from __future__ import annotations

import os
import re
from typing import Any, Callable
from urllib.parse import urlsplit

from .logging_setup import get_logger

logger = get_logger("media")

CQ_PATTERN = re.compile(r"\[CQ:([a-zA-Z_]+)((?:,[^\]]*)*)\]")

MAX_TTS_BYTES = 16 * 1024 * 1024


def _parse_cq_params(raw: str) -> dict:
    params: dict[str, str] = {}
    for pair in str(raw or "").split(","):
        if "=" in pair:
            key, value = pair.split("=", 1)
            params[key] = value
    return params


def parse_segments(message: Any) -> list[dict]:
    if isinstance(message, list):
        out: list[dict] = []
        for seg in message:
            if isinstance(seg, dict) and seg.get("type"):
                out.append({"type": str(seg["type"]), "data": dict(seg.get("data") or {})})
            elif isinstance(seg, str):
                out.extend(parse_segments(seg))
        return out
    text = str(message or "")
    segments: list[dict] = []
    last = 0
    for match in CQ_PATTERN.finditer(text):
        if match.start() > last:
            segments.append({"type": "text", "data": {"text": text[last:match.start()]}})
        segments.append({"type": match.group(1), "data": _parse_cq_params(match.group(2))})
        last = match.end()
    if last < len(text):
        segments.append({"type": "text", "data": {"text": text[last:]}})
    return [seg for seg in segments if seg["type"] != "text" or seg["data"].get("text", "").strip()]


def plain_text(message: Any) -> str:
    return "".join(seg["data"].get("text", "") for seg in parse_segments(message) if seg["type"] == "text").strip()


def describe_segments(message: Any, vision: Callable[[str], str] | None = None) -> str:
    parts: list[str] = []
    for seg in parse_segments(message):
        kind = seg["type"]
        data = seg["data"]
        if kind == "text":
            parts.append(str(data.get("text", "")).strip())
        elif kind == "image":
            ref = data.get("file") or data.get("url") or "未知"
            caption = ""
            if vision:
                try:
                    caption = str(vision(str(ref)) or "").strip()
                except Exception:
                    caption = ""
            parts.append(f"[图片：{ref}{('｜' + caption) if caption else ''}]")
        elif kind == "face":
            parts.append(f"[表情{data.get('id', '')}]")
        elif kind == "at":
            parts.append(f"@{data.get('name') or data.get('qq') or '某人'}")
        elif kind == "reply":
            parts.append(f"[引用消息 {data.get('id', '')}]")
        elif kind == "record":
            parts.append("[语音]")
        elif kind == "forward":
            parts.append("[合并转发]")
        elif kind == "json":
            parts.append("[卡片消息]")
        elif kind == "file":
            parts.append(f"[文件：{data.get('name') or data.get('file') or ''}]")
        else:
            parts.append(f"[{kind}]")
    return " ".join(part for part in parts if part).strip()


class MediaPipeline:

    def __init__(self, settings_getter: Callable[[], dict] | None = None):
        self.settings_getter = settings_getter or (lambda: {})

    def tts_endpoint(self) -> str:
        return str((self.settings_getter() or {}).get("tts_endpoint") or os.getenv("TTS_ENDPOINT") or "").strip()

    def has_tts(self) -> bool:
        return bool(self.tts_endpoint())

    @staticmethod
    def _tts_allowed_hosts() -> set[str]:
        raw = os.getenv("TTS_ALLOWED_HOSTS") or ""
        return {host.strip().lower() for host in raw.split(",") if host.strip()}

    async def synthesize(self, text: str) -> bytes | None:
        endpoint = self.tts_endpoint()
        if not endpoint or not str(text or "").strip():
            return None
        parsed = urlsplit(endpoint)
        if parsed.scheme not in ("http", "https"):
            logger.warning("TTS endpoint rejected (unsupported scheme): %s", endpoint)
            return None
        from .tools.tools import _assert_public_http_url
        try:
            _assert_public_http_url(endpoint, "LIFE_ALLOW_PRIVATE_TTS")
        except ValueError as error:
            logger.warning("TTS endpoint rejected: %s (%s)", endpoint, error)
            return None
        allowed = self._tts_allowed_hosts()
        if allowed and (parsed.hostname or "").lower() not in allowed:
            logger.warning("TTS endpoint host not in TTS_ALLOWED_HOSTS: %s", parsed.hostname)
            return None
        import httpx
        from .network import PublicHTTPTransport

        try:
            async with httpx.AsyncClient(timeout=30, transport=PublicHTTPTransport("LIFE_ALLOW_PRIVATE_TTS")) as client:
                headers = {"Authorization": "Bearer " + os.environ["TTS_SERVICE_TOKEN"]} if os.getenv("TTS_SERVICE_TOKEN") else {}
                async with client.stream("POST", endpoint, json={"text": str(text)[:500]}, headers=headers) as response:
                    response.raise_for_status()
                    buffer = bytearray()
                    async for chunk in response.aiter_bytes():
                        buffer.extend(chunk)
                        if len(buffer) > MAX_TTS_BYTES:
                            logger.warning("TTS response exceeded %d bytes; discarded", MAX_TTS_BYTES)
                            return None
                    return bytes(buffer)
        except Exception as error:
            logger.warning("TTS synthesis failed: %s", error)
            return None

    def describe(self, message: Any, vision: Callable[[str], str] | None = None) -> str:
        return describe_segments(message, vision=vision)


def recall_note(notice_type: str, user_id: Any, operator_id: Any = None, message_id: Any = None) -> str:
    kind = "群" if notice_type == "group_recall" else "私聊"
    return f"[{kind}撤回] 用户 {user_id} 撤回了一条消息（id={message_id}）"


VOICE_TAG = "[[voice]]"
SELFIE_TAG = "[[selfie:{}]]"
CALL_TAG = "[[call]]"

MEDIA_HINT = (
    "多模态（可选，按需使用，不要每条都用）：\n"
    "{lines}\n"
    "把标签单独放在一句话的末尾，用户看不到标签本身，客户端会据此发送语音/照片/发起通话。\n"
    "没有合适契机就不要用；文字本身永远是最重要的表达。"
)


def media_capability_block(values: dict | None = None) -> str:
    values = values or {}
    lines: list[str] = []
    if str(values.get("voice_reply_enabled", "true")).lower() not in ("false", "0", "no"):
        lines.append(
            f"- 想用声音说这句话时，句末加 {VOICE_TAG}（适合撒娇、语气很重要、或用户要求语音时）"
        )
    if str(values.get("selfie_enabled", "true")).lower() not in ("false", "0", "no"):
        lines.append(
            f"- 想给对方看自己现在的样子时，句末加 {SELFIE_TAG.format('<一句话描述此刻的场景、穿着、表情>')}"
            "（适合用户要求看照片/自拍、或想分享当下氛围时）"
        )
    if str(values.get("call_enabled", "false")).lower() in ("true", "1", "yes"):
        lines.append(
            f"- 想正经聊一会儿、打字太慢时，句末加 {CALL_TAG}（会发起语音通话，双方用说的）"
        )
    if not lines:
        return ""
    return MEDIA_HINT.format(lines="\n".join(lines))
