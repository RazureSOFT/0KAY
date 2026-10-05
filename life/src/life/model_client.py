"""Async model transport; resolve fresh credentials for the requested model."""
import os
import json
import grpc
import httpx
import asyncio
from urllib.parse import urlsplit
from mocr.v1 import mocr_pb2, mocr_pb2_grpc

from .http_auth import auth_headers, require_auth_headers

# Hard ceiling for an attachment download so a hostile/large file cannot
# exhaust plugin memory (the response used to be buffered without limit).
MAX_ATTACHMENT_BYTES = 64 * 1024 * 1024


def estimate_tokens(text: str) -> int:
    """Deterministic fallback when a provider reports no usage numbers:
    roughly 4 ASCII chars per token, one token per non-ASCII (CJK) char."""
    plain = str(text or "")
    if not plain:
        return 0
    ascii_chars = sum(1 for ch in plain if ord(ch) < 128)
    return ascii_chars // 4 + (len(plain) - ascii_chars)


def _origin(url: str) -> tuple[str, str, int]:
    parts = urlsplit(url)
    scheme = (parts.scheme or "http").lower()
    return (scheme, (parts.hostname or "").lower(), parts.port or (443 if scheme == "https" else 80))


class MocrClient:
    def __init__(self, address=None, core_http=None):
        self.address = address or os.getenv("MOCR_ADDRESS", "localhost:50052")
        self.core_http = (core_http or os.getenv("CORE_HTTP_ADDR") or os.getenv("CORE_HTTP") or "http://127.0.0.1:8080").rstrip("/")
        self._channel = None
        self._stub = None
        self._http = None
        self._connect_lock = asyncio.Lock()
        self.recorder = None

    async def connect(self):
        # Serialize so concurrent callers cannot close each other's fresh channel;
        # close any previous channel first so a reconnect does not leak it.
        async with self._connect_lock:
            if self._channel is not None:
                try:
                    await self._channel.close()
                except Exception:
                    pass
                self._channel = None
                self._stub = None
            channel = grpc.aio.insecure_channel(self.address)
            self._channel = channel
            self._stub = mocr_pb2_grpc.MocrServiceStub(channel)

    async def _http_client(self):
        # Guarded so two concurrent first callers cannot each build a client
        # (leaking one); `close` clears `_http` under the same lock.
        async with self._connect_lock:
            if self._http is None:
                self._http = httpx.AsyncClient(timeout=5)
            return self._http

    async def fetch_file(self, url: str, timeout: float = 30.0) -> bytes:
        """Download an uploaded attachment from Core by its /api/files URL.

        Absolute URLs are accepted only when they point at the Core origin, so a
        model-supplied URL cannot reuse the plugin's Bearer token as an SSRF
        primitive against an arbitrary third party.
        """
        if not url:
            raise ValueError("empty attachment url")
        raw = str(url).strip()
        if raw.startswith("http://") or raw.startswith("https://"):
            if _origin(raw) != _origin(self.core_http):
                raise ValueError("attachment url must point at the Core host")
            target = raw
        else:
            target = f"{self.core_http}{raw}"
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=False) as http:
            # Fail closed: never issue a Core file request with no credentials.
            async with http.stream("GET", target, headers=require_auth_headers()) as response:
                response.raise_for_status()
                buffer = bytearray()
                async for chunk in response.aiter_bytes():
                    buffer.extend(chunk)
                    if len(buffer) > MAX_ATTACHMENT_BYTES:
                        raise ValueError("attachment exceeds size limit")
                return bytes(buffer)

    async def close(self):
        async with self._connect_lock:
            if self._http:
                await self._http.aclose()
                self._http = None
            if self._channel:
                try:
                    await self._channel.close()
                except Exception:
                    pass
                self._channel = None
                self._stub = None

    async def describe_image(self, model_id, image_base64, mime="image/jpeg", prompt="", max_tokens=1024, timeout=90.0) -> str:
        """Describe an image with a vision-capable model.

        Resolves credentials per request like text generation, so it works with
        OpenAI-compatible and Anthropic-format providers. Used for screen
        observation (a downscaled screenshot from the Agent host).
        """
        client = await self._http_client()
        response = await client.get(f"{self.core_http}/api/providers/credentials", headers=auth_headers())
        response.raise_for_status()
        data = response.json()
        providers = data if isinstance(data, list) else data.get("providers", [])
        default_id = data.get("default_provider_id", "") if isinstance(data, dict) else ""
        if not model_id or str(model_id).lower() in ("auto", "mocr"):            chosen = next((p for p in providers if p.get("enabled", True) and p.get("id") == default_id), None)
        else:
            matches = [p for p in providers if p.get("enabled", True)
                       and any((m if isinstance(m, str) else m.get("id", m.get("model_id"))) == model_id for m in p.get("models", []))]
            chosen = next((p for p in matches if p.get("id") == default_id), matches[0] if matches else None)
        if not chosen:
            raise RuntimeError(f"No enabled provider configured for vision model {model_id}")
        provider = str(chosen.get("provider") or "").strip().lower()
        fmt = str(chosen.get("format") or "").strip().lower()
        base = str(chosen.get("base_url") or "").rstrip("/")
        key = str(chosen.get("api_key") or "")
        ask = prompt or "用两三句话描述这张电脑屏幕截图：正在使用什么程序、有哪些窗口或内容、用户可能在做什么。"
        async with httpx.AsyncClient(timeout=timeout) as http:
            if provider == "anthropic" or fmt == "anthropic":
                url = base + ("/messages" if base.endswith("/v1") else "/v1/messages")
                body = {"model": model_id, "max_tokens": max_tokens, "messages": [{"role": "user", "content": [
                    {"type": "image", "source": {"type": "base64", "media_type": mime, "data": image_base64}},
                    {"type": "text", "text": ask},
                ]}]}
                resp = await http.post(url, json=body, headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
                resp.raise_for_status()
                payload = resp.json()
                return "".join(str(part.get("text") or "") for part in (payload.get("content") or []) if isinstance(part, dict)).strip()
            url = base + "/chat/completions"
            body = {"model": model_id, "max_tokens": max_tokens, "messages": [{"role": "user", "content": [
                {"type": "text", "text": ask},
                {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{image_base64}"}},
            ]}]}
            resp = await http.post(url, json=body, headers={"Authorization": f"Bearer {key}", "content-type": "application/json"})
            resp.raise_for_status()
            payload = resp.json()
            choices = payload.get("choices") or []
            if not choices:
                return ""
            content = (choices[0].get("message") or {}).get("content")
            if isinstance(content, list):
                return "".join(str(part.get("text") or "") for part in content if isinstance(part, dict)).strip()
            return str(content or "").strip()

    async def generate(self, model_id, messages, system_prompt="", thinking=False, max_tokens=1024, temperature=None, usage=None):
        """Stream text chunks; when ``usage`` is a dict it is filled with the
        final ``prompt_tokens``/``completion_tokens`` reported by the provider
        (or a deterministic estimate when none is reported)."""
        record = await self.recorder.start("think" if thinking else "output", messages[-1]["content"] if messages else model_id) if self.recorder else None
        result = ""
        try:
            async for chunk in self._generate(model_id, messages, system_prompt, thinking, max_tokens, temperature, usage=usage):
                result += chunk
                yield chunk
            if usage is not None and not usage.get("prompt_tokens") and not usage.get("completion_tokens"):
                usage["prompt_tokens"] = estimate_tokens(system_prompt) + sum(
                    estimate_tokens(str(m.get("content") or "")) for m in messages)
                usage["completion_tokens"] = estimate_tokens(result)
            if record:
                await self.recorder.finish(record, result)
        except (asyncio.CancelledError, GeneratorExit):
            if record:
                await self.recorder.finish(record, result, cancelled=True)
            raise
        except Exception as error:
            if record:
                await self.recorder.finish(record, result, str(error))
            raise

    @staticmethod
    def _wire_message(message):
        """Build a proto Message, including multimodal content_parts when present."""
        wire = mocr_pb2.Message(role=str(message.get("role") or "user"), content=str(message.get("content") or ""))
        for part in message.get("parts") or []:
            wire.content_parts.add(
                type=str(part.get("type") or "text"),
                text=str(part.get("text") or ""),
                image_url=str(part.get("imageUrl") or part.get("image_url") or ""),
                mime_type=str(part.get("mime") or part.get("mimeType") or ""),
            )
        return wire

    async def _generate(self, model_id, messages, system_prompt="", thinking=False, max_tokens=1024, temperature=None, usage=None):
        if not self._stub:
            await self.connect()
        client = await self._http_client()
        # Credentials are resolved per request: GET /api/providers is redacted,
        # so the secret-bearing catalog comes from /api/providers/credentials.
        # Re-reading every time keeps provider edits effective immediately.
        response = await client.get(f"{self.core_http}/api/providers/credentials", headers=auth_headers())
        response.raise_for_status()
        data = response.json()
        providers = data if isinstance(data, list) else data.get("providers", [])
        default_id = data.get("default_provider_id", "") if isinstance(data, dict) else ""
        auto = (not model_id) or str(model_id).lower() in ("auto", "mocr")
        if auto:
            enabled = [p for p in providers if p.get("enabled", True)]
            chosen = next((p for p in enabled if p.get("id") == default_id), enabled[0] if enabled else None)
            if not chosen:
                raise RuntimeError("No enabled provider configured for automatic selection")
            model_id = chosen.get("default_model") or next(
                (m if isinstance(m, str) else m.get("id", m.get("model_id")) for m in chosen.get("models", []) if m), "")
            if not model_id:
                raise RuntimeError("Automatic selection found no model on the default provider")
        else:
            matches = [p for p in providers if p.get("enabled", True)
                       and model_id not in (p.get("disabled_models") or [])
                       and any((m if isinstance(m, str) else m.get("id", m.get("model_id"))) == model_id for m in p.get("models", []))]
            chosen = next((p for p in matches if p.get("id") == default_id), matches[0] if matches else None)
            if not chosen:
                raise RuntimeError(f"No enabled provider configured for model {model_id}")
        request = mocr_pb2.GenerateRequest(
            model_id=model_id, messages=[self._wire_message(m) for m in messages],
            system_prompt=system_prompt, max_tokens=max_tokens, stream=True, thinking=thinking,
            provider=chosen.get("provider", ""), base_url=chosen.get("base_url", ""), api_key=chosen.get("api_key", ""))
        if temperature is not None:
            try:
                request.temperature = float(temperature)
            except Exception:
                pass
        token = os.getenv("MOCR_GRPC_TOKEN") or os.getenv("CORE_API_TOKEN")
        kwargs = {"timeout": 300}
        if token:
            kwargs["metadata"] = (("authorization", "Bearer " + token),)
        call = self._stub.Generate(request, **kwargs)
        try:
            async for response in call:
                if response.chunk:
                    yield response.chunk
                if usage is not None and response.usage:
                    # The mocr server reports usage on the final (done) response.
                    usage["prompt_tokens"] = int(response.usage.prompt_tokens)
                    usage["completion_tokens"] = int(response.usage.completion_tokens)
                if response.done:
                    if response.finish_reason in (mocr_pb2.FINISH_REASON_ERROR, mocr_pb2.FINISH_REASON_LENGTH, mocr_pb2.FINISH_REASON_CONTENT_FILTER):
                        raise RuntimeError(f"Model generation failed: {response.finish_reason}")
                    return
            raise RuntimeError("Model stream ended without completion")
        finally:
            call.cancel()
