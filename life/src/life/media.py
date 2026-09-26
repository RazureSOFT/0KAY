"""Multimodal message handling for OneBot (images/GIF/quotes/forwards/voice).

Parsing and description are pure and testable. Outbound media (TTS, poke, QQ
status) is optional and fail-soft: a missing endpoint never breaks a reply.
"""

from __future__ import annotations

import os
import re
from typing import Any, Callable

CQ_PATTERN = re.compile(r"\[CQ:([a-zA-Z_]+)((?:,[^\]]*)*)\]")


def _parse_cq_params(raw: str) -> dict:
    params: dict[str, str] = {}
    for pair in str(raw or "").split(","):
        if "=" in pair:
            key, value = pair.split("=", 1)
            params[key] = value
    return params


def parse_segments(message: Any) -> list[dict]:
    """Normalize a OneBot message (CQ string or segment list) into segments."""
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
    """Render segments as text so a text-only model can still reason about media."""
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
    """Optional outbound media backends (TTS), fail-soft and disabled by default."""

    def __init__(self, settings_getter: Callable[[], dict] | None = None):
        self.settings_getter = settings_getter or (lambda: {})

    def tts_endpoint(self) -> str:
        return str((self.settings_getter() or {}).get("tts_endpoint") or os.getenv("TTS_ENDPOINT") or "").strip()

    def has_tts(self) -> bool:
        return bool(self.tts_endpoint())

    async def synthesize(self, text: str) -> bytes | None:
        """Return audio bytes from the configured TTS endpoint, or None on any failure."""
        endpoint = self.tts_endpoint()
        if not endpoint or not str(text or "").strip():
            return None
        import httpx

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(endpoint, json={"text": str(text)[:500]})
                response.raise_for_status()
                return response.content
        except Exception:
            return None

    def describe(self, message: Any, vision: Callable[[str], str] | None = None) -> str:
        return describe_segments(message, vision=vision)


def recall_note(notice_type: str, user_id: Any, operator_id: Any = None, message_id: Any = None) -> str:
    """A short, honest note for a recalled message (no invented content)."""
    kind = "群" if notice_type == "group_recall" else "私聊"
    return f"[{kind}撤回] 用户 {user_id} 撤回了一条消息（id={message_id}）"
