import asyncio
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

import grpc

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.grpc.auth import (
    LifeAuthInterceptor,
    accepted_tokens,
    build_interceptor,
    extract_bearer,
    resolve_mode,
)
from life.identity import set_identity
from life.v1 import life_pb2, life_pb2_grpc

TOKEN = "s3cret-service-token"


class _Aborted(Exception):
    def __init__(self, code, details):
        self.code = code
        self.details = details


class _Context:
    """Minimal ServicerContext double: `abort` ends the call like aio's does."""

    def __init__(self):
        self.code = None
        self.details = None
        self.called = False

    def set_code(self, code):
        self.code = code

    def set_details(self, details):
        self.details = details

    async def abort(self, code, details):
        self.code, self.details = code, details
        raise _Aborted(code, details)


class _Details:
    def __init__(self, metadata, method=b"/life.v1.LifeService/GetState"):
        self.method = method
        self._metadata = metadata

    def invocation_metadata(self):
        # The cython implementation exposes this method, not `.metadata`.
        return self._metadata


def _unary_handler(on_call):
    async def handler(request, context):
        return on_call(request, context)

    return grpc.unary_unary_rpc_method_handler(handler, lambda value: value, lambda value: value)


def _stream_handler(on_call):
    return grpc.unary_stream_rpc_method_handler(on_call, lambda value: value, lambda value: value)


class ModeParsing(unittest.TestCase):
    def test_explicit_modes(self):
        self.assertEqual(resolve_mode("1"), "on")
        self.assertEqual(resolve_mode("true"), "on")
        self.assertEqual(resolve_mode("0"), "off")
        self.assertEqual(resolve_mode("OFF"), "off")
        self.assertEqual(resolve_mode("auto"), "auto")
        self.assertEqual(resolve_mode(None), "auto")
        self.assertEqual(resolve_mode(""), "auto")

    def test_typo_fails_closed(self):
        # A misspelled security switch must not disable authentication.
        self.assertEqual(resolve_mode("ture"), "on")
        self.assertEqual(resolve_mode("yes-ish"), "on")


class TokenResolution(unittest.TestCase):
    def setUp(self):
        set_identity("", "")

    def tearDown(self):
        set_identity("", "")

    def test_env_token(self):
        with patch.dict(os.environ, {"LIFE_GRPC_TOKEN": TOKEN}, clear=False):
            os.environ.pop("CORE_API_TOKEN", None)
            self.assertEqual(accepted_tokens(), [TOKEN])

    def test_identity_token_preferred_and_deduplicated(self):
        set_identity("life", TOKEN)
        with patch.dict(os.environ, {"LIFE_GRPC_TOKEN": TOKEN}):
            self.assertEqual(accepted_tokens(), [TOKEN])

    def test_no_credentials(self):
        os.environ.pop("LIFE_GRPC_TOKEN", None)
        os.environ.pop("CORE_API_TOKEN", None)
        self.assertEqual(accepted_tokens(), [])

    def test_extract_bearer(self):
        self.assertEqual(extract_bearer([("authorization", f"Bearer {TOKEN}")]), TOKEN)
        self.assertEqual(extract_bearer([("authorization", "bearer " + TOKEN)]), TOKEN)
        self.assertEqual(extract_bearer([("authorization", TOKEN)]), TOKEN)
        self.assertEqual(extract_bearer([("other", "x")]), "")
        self.assertEqual(extract_bearer(None), "")


class InterceptorUnit(unittest.TestCase):
    def setUp(self):
        set_identity("", "")
        os.environ.pop("LIFE_GRPC_TOKEN", None)
        os.environ.pop("CORE_API_TOKEN", None)

    def tearDown(self):
        set_identity("", "")

    async def _run(self, interceptor, metadata, handler):
        async def continuation(_details):
            return handler

        return await interceptor.intercept_service(continuation, _Details(metadata))

    def test_on_mode_without_credentials_denies(self):
        seen = []
        interceptor = LifeAuthInterceptor(mode="on")
        handler = asyncio.run(self._run(interceptor, [], _unary_handler(seen.append)))
        self.assertIsNotNone(handler)

        context = _Context()
        with self.assertRaises(_Aborted) as ctx:
            asyncio.run(handler.unary_unary(b"{}", context))
        self.assertEqual(ctx.exception.code, grpc.StatusCode.UNAUTHENTICATED)
        # The servicer must never see the rejected call.
        self.assertEqual(seen, [])

    def test_on_mode_with_wrong_token_denies(self):
        with patch.dict(os.environ, {"LIFE_GRPC_TOKEN": TOKEN}):
            interceptor = LifeAuthInterceptor(mode="on")
            handler = asyncio.run(
                self._run(interceptor, [("authorization", "Bearer nope")],
                          _unary_handler(lambda *_: "reached"))
            )
        context = _Context()
        with self.assertRaises(_Aborted):
            asyncio.run(handler.unary_unary(b"{}", context))
        self.assertEqual(context.code, grpc.StatusCode.UNAUTHENTICATED)

    def test_valid_token_reaches_the_handler(self):
        with patch.dict(os.environ, {"LIFE_GRPC_TOKEN": TOKEN}):
            interceptor = LifeAuthInterceptor(mode="on")
            handler = asyncio.run(
                self._run(interceptor, [("authorization", f"Bearer {TOKEN}")],
                          _unary_handler(lambda *_: "reached"))
            )
        self.assertEqual(asyncio.run(handler.unary_unary(b"{}", _Context())), "reached")

    def test_auto_mode_waits_for_credentials_on_loopback(self):
        # Outbound registration proceeds while inbound business calls stay closed.
        interceptor = LifeAuthInterceptor(mode="auto")
        handler = asyncio.run(self._run(interceptor, [], _unary_handler(lambda *_: "reached")))
        with self.assertRaises(_Aborted):
            asyncio.run(handler.unary_unary(b"{}", _Context()))

    def test_auto_mode_enforces_once_a_token_exists(self):
        with patch.dict(os.environ, {"LIFE_GRPC_TOKEN": TOKEN}):
            interceptor = LifeAuthInterceptor(mode="auto")
            handler = asyncio.run(self._run(interceptor, [], _unary_handler(lambda *_: "reached")))
        context = _Context()
        with self.assertRaises(_Aborted):
            asyncio.run(handler.unary_unary(b"{}", context))
        self.assertEqual(context.code, grpc.StatusCode.UNAUTHENTICATED)

    def test_auto_mode_enforces_without_tokens_when_remote(self):
        interceptor = LifeAuthInterceptor(mode="auto", require_without_tokens=True)
        handler = asyncio.run(self._run(interceptor, [], _unary_handler(lambda *_: "reached")))
        context = _Context()
        with self.assertRaises(_Aborted):
            asyncio.run(handler.unary_unary(b"{}", context))
        self.assertEqual(context.code, grpc.StatusCode.UNAUTHENTICATED)

    def test_off_mode_is_not_installed(self):
        self.assertIsNone(build_interceptor("off", non_loopback=False))

    def test_stream_handler_denies_without_consuming_the_request(self):
        with patch.dict(os.environ, {"LIFE_GRPC_TOKEN": TOKEN}):
            interceptor = LifeAuthInterceptor(mode="on")
            handler = asyncio.run(
                self._run(interceptor, [], _stream_handler(_async_gen))
            )
        context = _Context()

        async def consume():
            async for _ in handler.unary_stream(b"{}", context):
                pass

        with self.assertRaises(_Aborted):
            asyncio.run(consume())
        self.assertEqual(context.code, grpc.StatusCode.UNAUTHENTICATED)

    def test_rejects_unknown_modes(self):
        with self.assertRaises(ValueError):
            LifeAuthInterceptor(mode="sometimes")


async def _async_gen(_request, _context):
    yield b"should not be produced"


class _Servicer(life_pb2_grpc.LifeServiceServicer):
    def __init__(self):
        self.calls = 0

    def GetState(self, request, context):
        self.calls += 1
        return life_pb2.GetStateResponse()


async def _round_trip(token: str | None) -> tuple[str, int]:
    """Start a real server with the interceptor and call it once."""
    interceptor = LifeAuthInterceptor(mode="on")
    server = grpc.aio.server(interceptors=[interceptor])
    servicer = _Servicer()
    life_pb2_grpc.add_LifeServiceServicer_to_server(servicer, server)
    port = server.add_insecure_port("127.0.0.1:0")
    await server.start()
    metadata = (("authorization", f"Bearer {token}"),) if token else ()
    status, calls = "ok", -1
    try:
        channel = grpc.aio.insecure_channel(f"127.0.0.1:{port}")
        stub = life_pb2_grpc.LifeServiceStub(channel)
        try:
            await stub.GetState(life_pb2.GetStateRequest(), metadata=metadata, timeout=5)
        except grpc.aio.AioRpcError as error:
            status = str(error.code())
        finally:
            await channel.close()
        calls = servicer.calls
    finally:
        await server.stop(grace=0)
    return status, calls


class ServerRoundTrip(unittest.TestCase):
    def setUp(self):
        set_identity("", "")

    def tearDown(self):
        set_identity("", "")

    def test_missing_token_is_rejected_by_a_real_server(self):
        os.environ.pop("LIFE_GRPC_TOKEN", None)
        status, calls = asyncio.run(_round_trip(None))
        self.assertEqual(status, "StatusCode.UNAUTHENTICATED")
        self.assertEqual(calls, 0)

    def test_wrong_token_is_rejected_by_a_real_server(self):
        with patch.dict(os.environ, {"LIFE_GRPC_TOKEN": TOKEN}):
            status, calls = asyncio.run(_round_trip("wrong"))
        self.assertEqual(status, "StatusCode.UNAUTHENTICATED")
        self.assertEqual(calls, 0)

    def test_valid_token_is_admitted_by_a_real_server(self):
        with patch.dict(os.environ, {"LIFE_GRPC_TOKEN": TOKEN}):
            status, calls = asyncio.run(_round_trip(TOKEN))
        self.assertEqual(status, "ok")
        self.assertEqual(calls, 1)


if __name__ == "__main__":
    unittest.main()
