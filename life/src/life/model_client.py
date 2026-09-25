"""Async model transport; resolve fresh credentials for the requested model."""
import os
import json
import grpc
import httpx
import asyncio
from mocr.v1 import mocr_pb2, mocr_pb2_grpc

from .http_auth import auth_headers


class MocrClient:
    def __init__(self, address=None, core_http=None):
        self.address = address or os.getenv("MOCR_ADDRESS", "localhost:50052")
        self.core_http = (core_http or os.getenv("CORE_HTTP_ADDR") or os.getenv("CORE_HTTP") or "http://127.0.0.1:8080").rstrip("/")
        self._channel = None
        self._stub = None
        self._http = None
        self.recorder = None

    async def connect(self):
        self._channel = grpc.aio.insecure_channel(self.address)
        self._stub = mocr_pb2_grpc.MocrServiceStub(self._channel)

    async def _http_client(self):
        if self._http is None:
            self._http = httpx.AsyncClient(timeout=5)
        return self._http

    async def close(self):
        if self._http:
            await self._http.aclose()
            self._http = None
        if self._channel:
            await self._channel.close()

    async def generate(self, model_id, messages, system_prompt="", thinking=False, max_tokens=1024):
        record = await self.recorder.start("think" if thinking else "output", messages[-1]["content"] if messages else model_id) if self.recorder else None
        result = ""
        try:
            async for chunk in self._generate(model_id, messages, system_prompt, thinking, max_tokens):
                result += chunk
                yield chunk
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

    async def _generate(self, model_id, messages, system_prompt="", thinking=False, max_tokens=1024):
        if not self._stub:
            await self.connect()
        client = await self._http_client()
        response = await client.get(f"{self.core_http}/api/providers", headers=auth_headers())
        response.raise_for_status()
        data = response.json()
        providers = data if isinstance(data, list) else data.get("providers", [])
        default_id = data.get("default_provider_id", "") if isinstance(data, dict) else ""
        matches = [p for p in providers if p.get("enabled", True)
                   and model_id not in (p.get("disabled_models") or [])
                   and any((m if isinstance(m, str) else m.get("id", m.get("model_id"))) == model_id for m in p.get("models", []))]
        chosen = next((p for p in matches if p.get("id") == default_id), matches[0] if matches else None)
        if not chosen:
            raise RuntimeError(f"No enabled provider configured for model {model_id}")
        request = mocr_pb2.GenerateRequest(
            model_id=model_id, messages=[mocr_pb2.Message(role=m["role"], content=m["content"]) for m in messages],
            system_prompt=system_prompt, max_tokens=max_tokens, stream=True, thinking=thinking,
            provider=chosen.get("provider", ""), base_url=chosen.get("base_url", ""), api_key=chosen.get("api_key", ""))
        call = self._stub.Generate(request, timeout=300)
        try:
            async for response in call:
                if response.chunk:
                    yield response.chunk
                if response.done:
                    if response.finish_reason in (mocr_pb2.FINISH_REASON_ERROR, mocr_pb2.FINISH_REASON_LENGTH, mocr_pb2.FINISH_REASON_CONTENT_FILTER):
                        raise RuntimeError(f"Model generation failed: {response.finish_reason}")
                    return
            raise RuntimeError("Model stream ended without completion")
        finally:
            call.cancel()
