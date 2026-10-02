"""Authentication for the LIFE gRPC server.

Core is the only caller of :class:`LifeServiceServicer`, and it identifies
itself with the same service token it issued to LIFE at registration
(``registry.Token(pluginID)``), presented as ``authorization: Bearer <token>``.

Without this, every method on the server -- including the mutating action
handlers -- is callable by anyone who can reach the port, which the bind-host
check alone does not protect once ``LIFE_ALLOW_REMOTE_BIND`` is set.

Modes (``LIFE_REQUIRE_AUTH``):

``1`` / ``true`` / ``on``
    Always require a matching token, and fail closed when no credentials are
    configured: every call is rejected rather than admitted.
``0`` / ``false`` / ``off``
    No authentication.  Refused on a non-loopback bind (see ``serve``).
``auto`` (default)
    Require a token as soon as one is known, and always on a non-loopback
    bind.  The identity token only exists once registration with Core
    completes, so a loopback-only server tolerates the short pre-registration
    window instead of dead-locking its own startup.
"""
from __future__ import annotations

import hmac
import os
import threading

import grpc
from grpc.aio import ServerInterceptor

from ..identity import get_identity

_TRUE = ("1", "true", "yes", "on")
_FALSE = ("0", "false", "no", "off")
_BEARER = "bearer "
_UNAUTHENTICATED = grpc.StatusCode.UNAUTHENTICATED


def resolve_mode(raw: str | None) -> str:
    """Normalise ``LIFE_REQUIRE_AUTH`` to ``"on"``, ``"off"`` or ``"auto"``.

    Anything unrecognised becomes ``"on"``: a typo in a security switch must
    not silently turn authentication off.
    """
    value = (raw or "").strip().lower()
    if value in _FALSE:
        return "off"
    if value in _TRUE:
        return "on"
    if value in ("auto", ""):
        return "auto"
    return "on"


def accepted_tokens() -> list[str]:
    """Tokens a caller may present, in priority order (deduplicated)."""
    tokens: list[str] = []
    _, identity_token = get_identity()
    for candidate in (
        identity_token,
        os.getenv("LIFE_GRPC_TOKEN", ""),
        os.getenv("CORE_API_TOKEN", ""),
    ):
        candidate = (candidate or "").strip()
        if candidate and candidate not in tokens:
            tokens.append(candidate)
    return tokens


def metadata_pairs(handler_call_details) -> list[tuple[str, str]]:
    """Return the call's metadata as lower-cased ``(key, value)`` pairs.

    ``grpc.HandlerCallDetails`` documents a ``metadata`` attribute, but the
    cython implementation only exposes ``invocation_metadata()``; both forms
    (plus the ``_Metadatum`` objects aio yields) are handled here.
    """
    metadata = getattr(handler_call_details, "metadata", None)
    if metadata is None:
        metadata = getattr(handler_call_details, "invocation_metadata", None)
        if callable(metadata):
            metadata = metadata()
    if not metadata:
        return []
    pairs: list[tuple[str, str]] = []
    for item in metadata:
        if isinstance(item, (tuple, list)) and len(item) == 2:
            key, value = item[0], item[1]
        else:
            key, value = getattr(item, "key", ""), getattr(item, "value", "")
        pairs.append((str(key).lower(), str(value or "")))
    return pairs


def extract_bearer(metadata) -> str:
    """Pull the bearer token out of metadata pairs (keys lower-cased)."""
    if not metadata:
        return ""
    for key, value in metadata:
        if key != "authorization":
            continue
        value = (value or "").strip()
        if value[: len(_BEARER)].lower() == _BEARER:
            return value[len(_BEARER):].strip()
        return value
    return ""


def _matches(token: str, candidates: list[str]) -> bool:
    if not token:
        return False
    encoded = token.encode("utf-8")
    return any(hmac.compare_digest(encoded, candidate.encode("utf-8")) for candidate in candidates)


def _authorize(context, message: str):
    """Abort the call with UNAUTHENTICATED.  Only ever called on the deny path."""
    abort = getattr(context, "abort", None)
    if abort is None:
        # `set_code` alone still dispatches to the servicer, so without an
        # abort API there is no safe way to reject: fail loudly instead.
        context.set_code(_UNAUTHENTICATED)
        context.set_details(message)
        raise RuntimeError(message)
    # aio's `abort` ends the RPC; a sync test double may return None, so the
    # caller awaits only when it actually produced an awaitable.
    return abort(_UNAUTHENTICATED, message)


def _deny_unary(fn, message: str):
    async def wrapper(request, context):
        result = _authorize(context, message)
        if hasattr(result, "__await__"):
            await result
        return await fn(request, context)

    return wrapper


def _deny_stream_response(fn, message: str):
    # A unary->stream handler is an async generator function, so this must
    # itself be an async generator (not a coroutine) for the server to iterate it.
    async def wrapper(request, context):
        result = _authorize(context, message)
        if hasattr(result, "__await__"):
            await result
        async for item in fn(request, context):
            yield item

    return wrapper


def deny_handler(handler, message: str):
    """Return a copy of ``handler`` that aborts before reaching the servicer."""
    replacements = {}
    if handler.unary_unary is not None:
        replacements["unary_unary"] = _deny_unary(handler.unary_unary, message)
    if handler.unary_stream is not None:
        replacements["unary_stream"] = _deny_stream_response(handler.unary_stream, message)
    if handler.stream_unary is not None:
        replacements["stream_unary"] = _deny_unary(handler.stream_unary, message)
    if handler.stream_stream is not None:
        replacements["stream_stream"] = _deny_stream_response(handler.stream_stream, message)
    return handler._replace(**replacements)


class LifeAuthInterceptor(ServerInterceptor):
    """Reject calls that do not present a recognised service token.

    The accepted token set is resolved per call, so the identity token becomes
    valid without a restart as soon as registration with Core completes.
    """

    def __init__(self, mode: str = "auto", require_without_tokens: bool = False, log=None):
        if mode not in ("on", "off", "auto"):
            raise ValueError(f"unknown auth mode: {mode!r}")
        self.mode = mode
        self.require_without_tokens = bool(require_without_tokens)
        self._log = log
        self._warned_no_tokens = False
        self._lock = threading.Lock()

    @property
    def enabled(self) -> bool:
        return self.mode != "off"

    def _required(self, tokens: list[str]) -> bool:
        if self.mode == "off":
            return False
        if self.mode == "on" or self.require_without_tokens:
            return True
        # auto: enforce only once credentials exist, otherwise the server
        # would reject its own caller before registration has run.
        return bool(tokens)

    def _warn_once(self, message: str) -> None:
        with self._lock:
            if self._warned_no_tokens:
                return
            self._warned_no_tokens = True
        log = self._log or _get_log()
        log.warning("LIFE gRPC auth rejecting all calls: %s", message)

    async def intercept_service(self, continuation, handler_call_details):
        handler = await continuation(handler_call_details)
        if handler is None or self.mode == "off":
            return handler
        tokens = accepted_tokens()
        if not self._required(tokens):
            return handler
        if tokens and _matches(extract_bearer(metadata_pairs(handler_call_details)), tokens):
            return handler
        message = (
            "missing or invalid service token" if tokens else "no server credentials configured"
        )
        self._warn_once(message)
        return deny_handler(handler, message)


_log = None


def _get_log():
    global _log
    if _log is None:
        from ..logging_setup import get_logger

        _log = get_logger("life.grpc.auth")
    return _log


def build_interceptor(mode: str, non_loopback: bool, log=None) -> LifeAuthInterceptor | None:
    """Return the interceptor for this configuration (``None`` when disabled)."""
    if mode == "off":
        return None
    return LifeAuthInterceptor(mode=mode, require_without_tokens=non_loopback, log=log)
