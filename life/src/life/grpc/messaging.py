"""plugin.v1.MessageService for L.I.F.E.

L.I.F.E owns the platform connections — OneBot/QQ, Bilibili, the reverse
WebSocket server — so it is also the component Core routes outbound sends to.
This module exposes exactly that surface and nothing else:

* ``ListAdapters`` advertises the configured adapter instances, so Core can
  offer them to subscribers before any message has arrived on them.
* ``SendMessage`` delivers one outbound message through a named adapter.

Reading the bus is deliberately *not* implemented here. L.I.F.E already consumes
its own inbound traffic inside ``adapters.inbound.InboundBridge``, and its
manifest declares ``read_mode: "none"``; subscribing as well would mean the same
message being processed twice.

The equivalent dashboard path for a send is
``ManageCompanion{action: "chat_send"}`` (see grpc/server.py); both funnel into
``engine.adapter_runtime.send``, so the two cannot drift in behaviour.
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'gen', 'python'))

from plugin.v1 import plugin_pb2
from plugin.v1 import plugin_pb2_grpc

from ..logging_setup import get_logger

log = get_logger("grpc.messaging")


def parse_conversation(conversation: str):
    """Split a "group:<id>" / "private:<id>" key into (kind, peer).

    Returns (None, None) for anything else, so a malformed key is rejected
    rather than guessed at — sending a private message to a group id, or the
    reverse, is not a recoverable mistake.
    """
    kind, _, peer = str(conversation or "").partition(":")
    kind = kind.strip()
    peer = peer.strip()
    if kind not in ("group", "private") or not peer:
        return None, None
    return kind, peer


class MessageServiceServicer(plugin_pb2_grpc.MessageServiceServicer):
    """Implementation of plugin.v1.MessageService for L.I.F.E."""

    def __init__(self, engine):
        self.engine = engine

    async def ListAdapters(self, request, context):
        """Advertise the adapter instances this build can drive.

        Disabled instances are skipped: Core would otherwise hand out send
        targets that are guaranteed to fail. A transport that is merely
        disconnected is still listed, because an adapter configured for
        "reverse" direction is healthy while it waits for its client.
        """
        adapters = []
        try:
            rows = self.engine.adapter_status() or []
        except Exception as error:  # pragma: no cover - defensive
            log.warning("adapter enumeration failed: %s", error)
            return plugin_pb2.ListAdaptersResponse()
        for row in rows:
            if not row.get("enabled"):
                continue
            adapter_id = str(row.get("id") or "")
            if not adapter_id:
                continue
            adapters.append(plugin_pb2.AdapterDescriptor(
                adapter_id=adapter_id,
                platform=str(row.get("platform") or ""),
                name=str(row.get("name") or ""),
            ))
        return plugin_pb2.ListAdaptersResponse(adapters=adapters)

    async def SendMessage(self, request, context):
        kind, peer = parse_conversation(request.conversation)
        if kind is None:
            return plugin_pb2.SendMessageResponse(
                success=False,
                error="conversation must be 'group:<id>' or 'private:<id>'",
            )
        text = str(request.text or "")
        if request.media:
            # The OneBot path builds a text-only segment list; pretending to
            # deliver an attachment would report success for a message the user
            # never receives. Reject explicitly instead.
            return plugin_pb2.SendMessageResponse(
                success=False,
                error="media attachments are not supported by this adapter yet",
            )
        if not text.strip():
            return plugin_pb2.SendMessageResponse(
                success=False, error="text is required")

        try:
            await self.engine.adapter_runtime.send(
                text,
                user_id=peer if kind == "private" else None,
                group_id=peer if kind == "group" else None,
                session_id=str(request.conversation),
                instance_id=str(request.adapter_id or ""),
            )
        except Exception as error:
            log.warning("adapter send failed (%s via %s): %s",
                        request.conversation, request.adapter_id, error)
            return plugin_pb2.SendMessageResponse(success=False, error=str(error))
        return plugin_pb2.SendMessageResponse(success=True)
