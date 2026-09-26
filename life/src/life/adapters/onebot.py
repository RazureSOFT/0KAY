"""OneBot v11 adapter for QQ messaging."""

import asyncio
import json
import time
from typing import AsyncIterator, Callable, Optional
from dataclasses import dataclass

import websockets
import httpx

from .. import media


@dataclass
class OneBotConfig:
    """OneBot adapter configuration."""
    websocket_url: str = "ws://localhost:8080"
    http_url: str = "http://localhost:8080"
    access_token: str = ""
    message_delay: float = 0.5  # Delay between messages (simulates typing)
    chunk_delay: float = 0.3    # Delay between message chunks
    trigger_keywords: tuple[str, ...] = ()
    bot_names: tuple[str, ...] = ()
    observe_group: bool = True
    observer: Callable | None = None
    recall_handler: Callable | None = None


class OneBotMessage:
    """OneBot message representation."""

    def __init__(self, data: dict):
        self.raw = data
        self.message_id = data.get("message_id", 0)
        self.user_id = data.get("user_id", 0)
        self.group_id = data.get("group_id")
        self.message = data.get("message", "")
        self.sender = data.get("sender", {})
        self.segments = media.parse_segments(self.message)
        self.text = media.plain_text(self.message)
        self.description = media.describe_segments(self.message)

    @property
    def is_group(self) -> bool:
        return self.group_id is not None

    @property
    def has_media(self) -> bool:
        return any(seg["type"] != "text" for seg in self.segments)

    @property
    def sender_name(self) -> str:
        return self.sender.get("nickname", str(self.user_id))


class OneBotAdapter:
    """OneBot v11 adapter for QQ."""

    def __init__(self, config: OneBotConfig, message_handler: Callable):
        self.config = config
        self.message_handler = message_handler
        self._ws: Optional[websockets.WebSocketClientProtocol] = None
        self._running = False
        self._http_client: Optional[httpx.AsyncClient] = None

    async def start(self):
        """Start the OneBot adapter."""
        self._running = True
        self._http_client = httpx.AsyncClient(
            base_url=self.config.http_url,
            headers={"Authorization": f"Bearer {self.config.access_token}"}
            if self.config.access_token
            else {},
        )

        while self._running:
            try:
                await self._connect_websocket()
            except Exception as e:
                print(f"OneBot WebSocket error: {e}")
                await asyncio.sleep(5)

    async def _connect_websocket(self):
        """Connect to OneBot WebSocket."""
        headers = {}
        if self.config.access_token:
            headers["Authorization"] = f"Bearer {self.config.access_token}"

        async with websockets.connect(
            self.config.websocket_url,
            additional_headers=headers,
        ) as ws:
            self._ws = ws
            print(f"Connected to OneBot at {self.config.websocket_url}")

            async for raw_msg in ws:
                try:
                    data = json.loads(raw_msg)
                    await self._handle_event(data)
                except json.JSONDecodeError:
                    continue

    def _is_mentioned(self, data: dict, msg: "OneBotMessage") -> bool:
        self_id = str(data.get("self_id") or "")
        for seg in msg.segments:
            if seg["type"] == "at" and self_id and str(seg["data"].get("qq")) == self_id:
                return True
        text = msg.description or str(msg.message or "")
        for name in (self.config.bot_names or ()):
            if name and name in text:
                return True
        return False

    async def _handle_notice(self, data: dict):
        """Handle recall and other notices; only records an honest short note."""
        notice_type = str(data.get("notice_type") or "")
        if notice_type not in ("group_recall", "friend_recall"):
            return
        if self.config.recall_handler:
            note = media.recall_note(notice_type, data.get("user_id"), data.get("operator_id"), data.get("message_id"))
            try:
                await self.config.recall_handler(
                    session_id=f"qq_group_{data.get('group_id')}" if data.get("group_id") else f"qq_{data.get('user_id')}",
                    user_id=str(data.get("user_id") or ""),
                    note=note,
                    adapter_type="onebot_group" if data.get("group_id") else "onebot",
                )
            except Exception as error:
                print(f"recall handler error: {error}")

    async def _handle_event(self, data: dict):
        """Handle OneBot event."""
        post_type = data.get("post_type")
        if post_type == "notice":
            await self._handle_notice(data)
            return
        if post_type != "message":
            return

        msg = OneBotMessage(data)
        content = msg.description or msg.text
        if msg.is_group and self.config.observe_group and self.config.observer:
            await self.config.observer(str(msg.group_id), str(msg.user_id), content)
        keywords = tuple(k.lower() for k in self.config.trigger_keywords if k.strip())
        if msg.is_group:
            # Group chats: speak only when mentioned or a trigger keyword hits; observe otherwise.
            mentioned = self._is_mentioned(data, msg)
            if not mentioned and not (keywords and any(keyword in content.lower() for keyword in keywords)):
                return
        elif keywords and not any(keyword in content.lower() for keyword in keywords):
            return

        # Process message and get response (supports sync/async iterators)
        response_iterator = self.message_handler(
            session_id=f"qq_group_{msg.group_id}" if msg.is_group else f"qq_{msg.user_id}",
            user_id=str(msg.user_id),
            message=content,
            adapter_type="onebot_group" if msg.is_group else "onebot",
        )

        # Send response with delay — QQ 分条发送 via OutputResult chunks
        buffered = ""
        if hasattr(response_iterator, "__aiter__"):
            async for event in response_iterator:
                if event.get("type") == "chunk":
                    buffered += event.get("chunk", "")
                    if event.get("done") and buffered:
                        await self._send_message(msg.user_id, msg.group_id, buffered)
                        buffered = ""
                else:
                    await self._emit_event(msg, event)
            if buffered:
                await self._send_message(msg.user_id, msg.group_id, buffered)
        else:
            for event in response_iterator:
                await self._emit_event(msg, event)

    async def _emit_event(self, msg: OneBotMessage, event: dict):
        etype = event.get("type") if isinstance(event, dict) else None
        if etype == "chunk":
            chunk = event.get("chunk", "")
            if chunk:
                await self._send_message(
                    user_id=msg.user_id,
                    group_id=msg.group_id,
                    message=chunk,
                )
                await asyncio.sleep(self.config.chunk_delay)
        elif etype == "done":
            # Final flush with full chunks if provided
            for part in event.get("chunks") or []:
                if part:
                    await self._send_message(
                        user_id=msg.user_id,
                        group_id=msg.group_id,
                        message=part,
                    )
                    await asyncio.sleep(self.config.message_delay)

    async def _send_message(
        self,
        user_id: int,
        group_id: Optional[int],
        message: str,
    ):
        """Send message via OneBot HTTP API."""
        if not self._http_client:
            raise RuntimeError("OneBot is not connected")

        endpoint = "send_group_msg" if group_id else "send_private_msg"
        payload = {"message": message}
        if group_id:
            payload["group_id"] = group_id
        else:
            payload["user_id"] = user_id

        try:
            resp = await self._http_client.post(f"/{endpoint}", json=payload)
            resp.raise_for_status()
            if resp.json().get("retcode", 0) != 0:
                raise RuntimeError(f"OneBot rejected message: {resp.text}")
        except Exception as e:
            print(f"Failed to send message: {e}")
            raise

    async def send_group_notice(self, group_id: int, content: str):
        """Send group notice."""
        if not self._http_client:
            return

        try:
            await self._http_client.post(
                "/send_group_notice",
                json={"group_id": group_id, "content": content},
            )
        except Exception as e:
            print(f"Failed to send notice: {e}")

    async def _call(self, action: str, payload: dict):
        if not self._http_client:
            raise RuntimeError("OneBot is not connected")
        response = await self._http_client.post(f"/{action}", json=payload)
        response.raise_for_status()
        data = response.json()
        if data.get("retcode", 0) != 0:
            raise RuntimeError(f"OneBot rejected {action}: {response.text}")
        return data.get("data") or {}

    async def send_poke(self, user_id: int, group_id: int | None = None):
        """戳一戳 (poke)."""
        payload = {"user_id": int(user_id)}
        if group_id:
            payload["group_id"] = int(group_id)
        return await self._call("group_poke" if group_id else "friend_poke", payload)

    async def set_status(self, status: int = 0, battery: int = 100):
        """Sync the bot's QQ online status/battery."""
        return await self._call("set_online_status", {"status": int(status), "ext_status": 0, "battery_status": int(battery)})

    async def send_tts(self, text: str, user_id: int | None = None, group_id: int | None = None):
        """Send a voice message via CQ TTS."""
        if not str(text or "").strip():
            raise ValueError("text is required")
        payload = {"message": f"[CQ:tts,text={str(text)[:300]}]"}
        if group_id:
            payload["group_id"] = int(group_id)
            return await self._call("send_group_msg", payload)
        payload["user_id"] = int(user_id or 0)
        return await self._call("send_private_msg", payload)

    async def send_image(self, file: str, user_id: int | None = None, group_id: int | None = None):
        """Send an image by file path/URL via CQ code."""
        payload = {"message": f"[CQ:image,file={file}]"}
        if group_id:
            payload["group_id"] = int(group_id)
            return await self._call("send_group_msg", payload)
        payload["user_id"] = int(user_id or 0)
        return await self._call("send_private_msg", payload)

    async def send_message(self, message: str, user_id: int | None = None, group_id: int | None = None):
        """Send a proactive private or group message through OneBot HTTP."""
        if not message:
            raise ValueError("message is required")
        if not user_id and not group_id:
            raise ValueError("user_id or group_id is required")
        await self._send_message(user_id=int(user_id or 0), group_id=int(group_id) if group_id else None, message=message)

    async def stop(self):
        """Stop the adapter."""
        self._running = False
        if self._ws:
            await self._ws.close()
        if self._http_client:
            await self._http_client.aclose()


class OneBotManager:
    """Manages multiple OneBot connections."""

    def __init__(self, message_handler: Callable):
        self.message_handler = message_handler
        self.adapters: dict[str, OneBotAdapter] = {}

    def add_adapter(self, name: str, config: OneBotConfig):
        """Add a new OneBot adapter."""
        adapter = OneBotAdapter(config, self.message_handler)
        self.adapters[name] = adapter

    async def start_all(self):
        """Start all adapters."""
        tasks = [adapter.start() for adapter in self.adapters.values()]
        await asyncio.gather(*tasks)

    async def stop_all(self):
        """Stop all adapters."""
        for adapter in self.adapters.values():
            await adapter.stop()

    async def send_message(self, message: str, user_id: int | None = None, group_id: int | None = None):
        if not self.adapters:
            raise RuntimeError("OneBot is not connected")
        await next(iter(self.adapters.values())).send_message(message=message, user_id=user_id, group_id=group_id)
