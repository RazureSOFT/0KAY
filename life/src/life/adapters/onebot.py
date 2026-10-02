"""OneBot v11 adapter for QQ messaging."""

import asyncio
import base64
import json
import time
from pathlib import Path
from typing import AsyncIterator, Callable, Optional
from dataclasses import dataclass

import websockets
import httpx

from .. import media

#: Ceiling on an image we will hand to the vision model (the OneBot server
#: resolves the bytes; this bounds what we then base64 into memory).
MAX_IMAGE_BYTES = 8 * 1024 * 1024

#: Ceiling on a voice clip sent as a base64 CQ record segment.
MAX_RECORD_BYTES = 4 * 1024 * 1024


def _image_mime(blob: bytes) -> str:
    """Magic-byte sniffing; "" when the bytes are not a supported image."""
    if blob[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if blob[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if blob[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    if blob[:4] == b"RIFF" and blob[8:12] == b"WEBP":
        return "image/webp"
    if blob[:2] == b"BM":
        return "image/bmp"
    return ""


def _cq_escape(value: object) -> str:
    """Escape a value for safe use inside a CQ code parameter.

    OneBot v11 requires ``&`` ``[`` ``]`` ``,`` inside a CQ code parameter to be
    escaped; without this a model-supplied image URL or TTS text containing ``]``
    could close the CQ code early and inject another one.
    """
    return (str(value)
            .replace("&", "&#38;")
            .replace("[", "&#91;")
            .replace("]", "&#93;")
            .replace(",", "&#44;"))


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
    should_reply: Callable | None = None
    #: ``async (ref: str) -> str`` — caption an inbound image so a text-only
    #: model can still reason about it.  Wired by the server to the vision model.
    vision_handler: Callable | None = None


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

        backoff = 1.0
        while self._running:
            started = time.monotonic()
            try:
                await self._connect_websocket()
            except Exception as e:
                print(f"OneBot WebSocket error: {e}")
            if not self._running:
                break
            # A *clean* return also means the socket closed (e.g. the server
            # rejects a duplicate connection and closes immediately), so the
            # sleep must run on every iteration — otherwise this is a hot
            # reconnect loop.  Reset the backoff after a stable connection,
            # otherwise grow it so a rejecting server is not hammered.
            if time.monotonic() - started >= 10.0:
                backoff = 1.0
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, 60.0)

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
                except json.JSONDecodeError:
                    continue
                # One failing event must not tear down the whole WebSocket and
                # silently drop every event queued behind it (a single QQ API
                # rejection or a 300s model timeout used to do exactly that).
                try:
                    await self._handle_event(data)
                except Exception as error:
                    print(f"OneBot event handling failed: {error}")
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
        # Caption inbound images with the vision model when it is wired, so the
        # picture's content reaches a text-only model instead of a bare placeholder.
        content = (await self._describe(msg)) or msg.text
        if msg.is_group and self.config.observe_group and self.config.observer:
            await self.config.observer(str(msg.group_id), str(msg.user_id), content, msg.sender_name)
        keywords = tuple(k.lower() for k in self.config.trigger_keywords if k.strip())
        if msg.is_group:
            # Group chats: mention/keyword wakes; otherwise allow a natural continuation
            # of a topic LIFE recently spoke about (via the should_reply callback).
            mentioned = self._is_mentioned(data, msg)
            keyword_hit = bool(keywords) and any(keyword in content.lower() for keyword in keywords)
            allowed = mentioned or keyword_hit
            if not allowed and self.config.should_reply:
                try:
                    allowed = bool(await self.config.should_reply(str(msg.group_id), str(msg.user_id), content, mentioned))
                except Exception:
                    allowed = False
            if not allowed:
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
        # Send as a text *segment* rather than a raw string.  The string form is
        # parsed for CQ codes, so model output — which any chat participant can
        # steer via prompt injection — could smuggle in [CQ:at,qq=all], images,
        # etc.  The segment form is never CQ-parsed.
        payload = {"message": [{"type": "text", "data": {"text": str(message)}}]}
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

    async def fetch_image_base64(self, ref: str) -> tuple[str, str]:
        """Resolve a CQ image reference to ``(base64, mime)`` via the OneBot server.

        OneBot's ``get_image`` returns either a base64 payload or a local path;
        the OneBot server performs any download itself, so LIFE never fetches a
        model/user-supplied URL directly (no SSRF surface).  A remote URL handed
        back by the server is refused for the same reason.  Returns ``("", "")``
        when the image is missing, too large, or not a supported format.
        """
        if not str(ref or "").strip():
            return "", ""
        data = await self._call("get_image", {"file": str(ref)})
        raw = str(data.get("file") or data.get("url") or "")
        if not raw:
            return "", ""
        if raw.startswith("data:"):
            head, _, payload = raw.partition(",")
            mime = head[5:].split(";")[0] or "image/png"
            if len(payload) * 3 // 4 > MAX_IMAGE_BYTES:
                return "", ""
            return payload, mime
        if raw.startswith("base64://"):
            return raw[len("base64://"):], "image/png"
        if raw.startswith(("http://", "https://")):
            # The server could not resolve it locally; do not fetch it ourselves.
            return "", ""
        path = Path(raw)
        try:
            if not path.is_file() or path.stat().st_size > MAX_IMAGE_BYTES:
                return "", ""
            blob = path.read_bytes()
        except OSError:
            return "", ""
        mime = _image_mime(blob)
        if not mime:
            return "", ""
        return base64.b64encode(blob).decode(), mime

    async def _describe(self, msg: "OneBotMessage") -> str:
        """Render a message's segments, captioning images when vision is wired.

        Captions are resolved asynchronously *first* (OneBot `get_image` + the
        vision model are both async), then rendered through the sync
        `describe_segments`, so a text-only model still receives the picture's
        content instead of a bare ``[图片：url]`` placeholder.
        """
        if not self.config.vision_handler or not msg.has_media:
            return msg.description
        captions: dict[str, str] = {}
        for seg in msg.segments:
            if seg["type"] != "image":
                continue
            ref = str(seg["data"].get("file") or seg["data"].get("url") or "")
            if not ref or ref in captions:
                continue
            try:
                captions[ref] = str(await self.config.vision_handler(ref) or "").strip()
            except Exception as error:
                print(f"OneBot vision caption failed: {error}")
                captions[ref] = ""
        if not any(captions.values()):
            return msg.description
        return media.describe_segments(msg.message, vision=lambda ref: captions.get(str(ref), ""))

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
        payload = {"message": f"[CQ:tts,text={_cq_escape(str(text)[:300])}]"}
        if group_id:
            payload["group_id"] = int(group_id)
            return await self._call("send_group_msg", payload)
        payload["user_id"] = int(user_id or 0)
        return await self._call("send_private_msg", payload)

    async def send_record(self, audio: bytes, user_id: int | None = None, group_id: int | None = None):
        """Send a voice message from raw audio bytes (self-hosted TTS output).

        OneBot's own CQ TTS only synthesises *text*; this is the counterpart used
        when a `tts_endpoint` is configured and LIFE produced the audio itself.
        """
        if not audio:
            raise ValueError("audio is required")
        if len(audio) > MAX_RECORD_BYTES:
            raise ValueError(f"audio exceeds {MAX_RECORD_BYTES} bytes")
        payload = {"message": f"[CQ:record,file=base64://{base64.b64encode(audio).decode()}]"}
        if group_id:
            payload["group_id"] = int(group_id)
            return await self._call("send_group_msg", payload)
        payload["user_id"] = int(user_id or 0)
        return await self._call("send_private_msg", payload)

    async def send_image(self, file: str, user_id: int | None = None, group_id: int | None = None):
        """Send an image by file path/URL via CQ code."""
        payload = {"message": f"[CQ:image,file={_cq_escape(file)}]"}
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
