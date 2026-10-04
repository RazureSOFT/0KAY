"""Turn an inbound OneBot event into a LIFE conversation turn.

This is the piece the old outbound adapter did inside its WebSocket read loop,
extracted so it is transport-independent: it works the same whether the event
arrived over the reverse-WebSocket server, an HTTP callback, or a test harness.

The decision logic is deliberately unchanged from the outbound adapter — group
wake rules (mention / keyword / continuing topic), vision captioning, chunked
sending — because that behaviour is what users tuned their bots around. What is
new is that the *transport* is a parameter rather than ``self``.
"""
from __future__ import annotations

import asyncio
import json
from typing import AsyncIterator, Callable, Optional

from .. import media
from ..logging_setup import get_logger
from .onebot import OneBotMessage

logger = get_logger("adapters.inbound")

#: Ceiling on one outbound text segment, matching QQ's practical limit.
MAX_SEGMENT_CHARS = 2000


class InboundBridge:
    """Bridges platform events into ``engine.process_message`` and back out."""

    def __init__(self, engine, instance):
        self.engine = engine
        self.instance = instance

    @property
    def config(self):
        return self.instance

    def _session_id(self, data):
        runtime = self.engine.adapter_runtime
        if hasattr(runtime, "session_id"):
            return runtime.session_id(self.instance, data)
        suffix = f"qq_group_{data.get('group_id')}" if data.get("group_id") else f"qq_{data.get('user_id')}"
        return f"bot:{self.instance.id}:{suffix}"

    def _is_mentioned(self, data: dict, msg: OneBotMessage) -> bool:
        self_id = str(data.get("self_id") or "")
        for seg in msg.segments:
            if seg["type"] == "at" and self_id and str(seg["data"].get("qq")) == self_id:
                return True
        text = msg.description or str(msg.message or "")
        names = tuple(self.instance.bot_names()) if hasattr(self.instance, "bot_names") else ()
        return any(name and name in text for name in names)

    async def handle(self, data: dict, server) -> None:
        """Handle one event. Never raises: the socket must survive a bad turn."""
        try:
            post_type = data.get("post_type")
            if post_type == "notice":
                await self._handle_notice(data, server)
                return
            if post_type != "message":
                return
            await self._handle_message(data, server)
        except asyncio.CancelledError:
            raise
        except Exception as error:
            logger.warning("inbound event failed on adapter %s: %s", self.instance.id, error)

    async def _handle_notice(self, data: dict, server) -> None:
        notice_type = str(data.get("notice_type") or "")
        if notice_type not in ("group_recall", "friend_recall"):
            return
        handler = getattr(self.engine, "on_recall", None)
        if handler is None:
            return
        note = media.recall_note(notice_type, data.get("user_id"),
                                 data.get("operator_id"), data.get("message_id"))
        try:
            await handler(
                session_id=self._session_id(data),
                user_id=str(data.get("user_id") or ""),
                note=note,
                adapter_type="onebot_group" if data.get("group_id") else "onebot",
            )
        except Exception as error:
            logger.warning("recall handler error: %s", error)

    async def _handle_message(self, data: dict, server) -> None:
        msg = OneBotMessage(data)
        content = (await self._describe(msg, server)) or msg.text

        if msg.is_group and self.instance.observe_group:
            observer = getattr(self.engine, "on_group_observe", None)
            if observer is not None:
                try:
                    await observer(self._session_id(data), str(msg.user_id), content, msg.sender_name)
                except Exception as error:
                    logger.debug("group observer failed: %s", error)

        if not await self._should_reply(data, msg, content):
            return

        session_id = self._session_id(data)
        response = self.engine.process_message(
            session_id=session_id,
            user_id=str(msg.user_id),
            message=content,
            adapter_type="onebot_group" if msg.is_group else "onebot",
        )

        buffered = ""
        if hasattr(response, "__aiter__"):
            async for event in response:
                if event.get("type") == "chunk":
                    buffered += str(event.get("chunk") or "")
                    if event.get("done") and buffered:
                        await self._send(msg, buffered, server)
                        buffered = ""
                else:
                    await self._emit(msg, event, server)
            if buffered:
                await self._send(msg, buffered, server)
        else:
            for event in response:
                await self._emit(msg, event, server)

    async def _should_reply(self, data: dict, msg: OneBotMessage, content: str) -> bool:
        """Group wake rules: mention, keyword, or a topic LIFE is already in."""
        keywords = tuple(str(k).lower() for k in (self.instance.trigger_keywords or []) if str(k).strip())
        if msg.is_group:
            mentioned = self._is_mentioned(data, msg)
            keyword_hit = bool(keywords) and any(key in content.lower() for key in keywords)
            if mentioned or keyword_hit or not self.instance.observe_group:
                return True
            should_reply = getattr(self.engine, "should_reply_in_group", None)
            if should_reply is None:
                return False
            try:
                return bool(await should_reply(self._session_id(data), str(msg.user_id), content, mentioned))
            except Exception:
                return False
        if keywords and not any(key in content.lower() for key in keywords):
            return False
        return True

    async def _describe(self, msg: OneBotMessage, server) -> str:
        """Render segments, captioning images when a vision handler is wired."""
        describe = getattr(self.engine, "describe_media_ref", None)
        if describe is None or not msg.has_media:
            return msg.description
        captions: dict = {}
        for seg in msg.segments:
            if seg["type"] != "image":
                continue
            ref = str(seg["data"].get("file") or seg["data"].get("url") or "")
            if not ref or ref in captions:
                continue
            try:
                captions[ref] = str(await describe(ref, server) or "").strip()
            except Exception as error:
                logger.warning("vision caption failed: %s", error)
                captions[ref] = ""
        if not any(captions.values()):
            return msg.description
        return media.describe_segments(msg.message, vision=lambda ref: captions.get(str(ref), ""))

    async def _emit(self, msg: OneBotMessage, event: dict, server) -> None:
        etype = event.get("type") if isinstance(event, dict) else None
        if etype == "chunk":
            if event.get("chunk"):
                await self._send(msg, str(event["chunk"]), server)
                await asyncio.sleep(self.instance.chunk_delay)
        elif etype == "done":
            for part in event.get("chunks") or []:
                if part:
                    await self._send(msg, str(part), server)
                    await asyncio.sleep(self.instance.message_delay)

    async def _send(self, msg: OneBotMessage, text: str, server) -> None:
        """Send text back through the instance that received the message."""
        if not str(text or "").strip():
            return
        # Target exactly one of the two: passing both is ambiguous, and a
        # transport that keys on user_id would answer a group message privately.
        target = ({"group_id": int(msg.group_id)} if msg.is_group
                  else {"user_id": int(msg.user_id)})
        for start in range(0, len(text), MAX_SEGMENT_CHARS):
            part = text[start:start + MAX_SEGMENT_CHARS]
            await self.engine.adapter_runtime.send(
                part,
                session_id=self._session_id(msg.raw),
                self_id=msg.raw.get("self_id"),
                **target,
            )
