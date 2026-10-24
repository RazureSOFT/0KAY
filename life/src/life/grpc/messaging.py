import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'gen', 'python'))

from plugin.v1 import plugin_pb2
from plugin.v1 import plugin_pb2_grpc

from ..logging_setup import get_logger

log = get_logger("grpc.messaging")


def parse_conversation(conversation: str):
    kind, _, peer = str(conversation or "").partition(":")
    kind = kind.strip()
    peer = peer.strip()
    if kind not in ("group", "private") or not peer:
        return None, None
    return kind, peer


class MessageServiceServicer(plugin_pb2_grpc.MessageServiceServicer):

    def __init__(self, engine):
        self.engine = engine

    async def ListAdapters(self, request, context):
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
