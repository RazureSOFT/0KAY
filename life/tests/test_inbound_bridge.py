"""Tests for the inbound event → conversation-turn bridge.

The bridge is where transport-independent behaviour lives, so these tests use a
stub engine rather than a real one: what matters is that the *decisions* are
right (wake rules, media captioning, chunking, noticing a recall), not that a
model produced a good sentence.
"""
import asyncio
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "gen" / "python"))

from life.adapters.inbound import MAX_SEGMENT_CHARS, InboundBridge  # noqa: E402


def _run(coro):
    return asyncio.run(coro)


class _FakeRuntime:
    def __init__(self):
        self.sent: list = []

    async def send(self, message, **kwargs):
        self.sent.append({"message": message, **kwargs})
        return {"sent": True}


class _FakeEngine:
    """A minimal stand-in for LifeEngine: only the four bridge hooks."""

    def __init__(self, reply="", chunks=None, should_reply=True):
        self.turns: list = []
        self.observed: list = []
        self.recalls: list = []
        self.described: list = []
        self.adapter_runtime = _FakeRuntime()
        self._reply = reply
        self._chunks = chunks
        self._should_reply = should_reply

    async def on_group_observe(self, group_id, user_id, message, name=""):
        self.observed.append((group_id, user_id, message, name))

    async def should_reply_in_group(self, group_id, user_id, message, mentioned):
        return self._should_reply

    async def on_recall(self, session_id, user_id, note, adapter_type="onebot"):
        self.recalls.append((session_id, user_id, note, adapter_type))

    async def describe_media_ref(self, ref, server=None):
        self.described.append(ref)
        return f"描述:{ref}"

    def process_message(self, **kwargs):
        self.turns.append(kwargs)
        chunks = self._chunks if self._chunks is not None else [self._reply]

        async def iterator():
            for index, chunk in enumerate(chunks):
                yield {"type": "chunk", "chunk": chunk,
                       "done": index == len(chunks) - 1}
        return iterator()


def _instance(**overrides):
    base = dict(name="t", platform="aiocqhttp", enabled=True, ws_host="127.0.0.1",
                ws_port=6199, ws_token="", http_url="", access_token="",
                config_id="default", trigger_keywords=[], observe_group=True)
    base.update(overrides)
    return SimpleNamespace(
        **base,
        bot_names=lambda: (),
        chunk_delay=0.0,
        message_delay=0.0,
        id="adp_test",
        chunk_delay_seconds=0.0,
    )


class GroupWakeRuleTests(unittest.TestCase):
    def test_an_at_mention_wakes_the_bot(self):
        engine = _FakeEngine()
        bridge = InboundBridge(engine, _instance())
        data = {"post_type": "message", "self_id": 100, "group_id": 5, "user_id": 9,
                "message": [{"type": "at", "data": {"qq": "100"}},
                            {"type": "text", "data": {"text": "hello"}}]}
        _run(bridge.handle(data, None))
        self.assertEqual(len(engine.turns), 1)

    def test_an_at_of_someone_else_does_not_wake_the_bot(self):
        engine = _FakeEngine(should_reply=False)
        bridge = InboundBridge(engine, _instance(), )
        data = {"post_type": "message", "self_id": 100, "group_id": 5, "user_id": 9,
                "message": [{"type": "at", "data": {"qq": "777"}},
                            {"type": "text", "data": {"text": "hello"}}]}
        _run(bridge.handle(data, None))
        self.assertEqual(engine.turns, [])

    def test_a_trigger_keyword_wakes_the_bot(self):
        engine = _FakeEngine()
        bridge = InboundBridge(engine, _instance(trigger_keywords=["小助手"]))
        data = {"post_type": "message", "self_id": 100, "group_id": 5, "user_id": 9,
                "message": "小助手在吗"}
        _run(bridge.handle(data, None))
        self.assertEqual(len(engine.turns), 1)

    def test_a_private_keyword_filter_blocks_an_ordinary_private_message(self):
        engine = _FakeEngine()
        bridge = InboundBridge(engine, _instance(trigger_keywords=["ping"]))
        data = {"post_type": "message", "self_id": 100, "user_id": 9, "message": "hello"}
        _run(bridge.handle(data, None))
        self.assertEqual(engine.turns, [])

    def test_group_observation_happens_even_when_the_bot_stays_quiet(self):
        """Not replying must still teach LIFE about the group."""
        engine = _FakeEngine(should_reply=False)
        bridge = InboundBridge(engine, _instance())
        data = {"post_type": "message", "self_id": 100, "group_id": 5, "user_id": 9,
                "sender": {"nickname": "小明"}, "message": "随便聊聊"}
        _run(bridge.handle(data, None))
        self.assertEqual(engine.turns, [])
        self.assertEqual(len(engine.observed), 1)
        self.assertEqual(engine.observed[0][0], "bot:adp_test:qq_group_5")
        self.assertEqual(engine.observed[0][3], "小明")


class SessionIdTests(unittest.TestCase):
    def test_private_and_group_sessions_include_instance_identity(self):
        engine = _FakeEngine()
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "message", "self_id": 1, "user_id": 9,
                            "message": "hi"}, None))
        _run(bridge.handle({"post_type": "message", "self_id": 1, "group_id": 5,
                            "user_id": 9, "message": "hi"}, None))
        self.assertEqual(engine.turns[0]["session_id"], "bot:adp_test:qq_9")
        self.assertEqual(engine.turns[1]["session_id"], "bot:adp_test:qq_group_5")
        self.assertEqual(engine.turns[0]["adapter_type"], "onebot")
        self.assertEqual(engine.turns[1]["adapter_type"], "onebot_group")


class SendingTests(unittest.TestCase):
    def test_the_reply_goes_back_out_through_the_runtime(self):
        engine = _FakeEngine(reply="收到")
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "message", "self_id": 42, "user_id": 9,
                            "message": "hi"}, None))
        self.assertEqual(len(engine.adapter_runtime.sent), 1)
        sent = engine.adapter_runtime.sent[0]
        self.assertEqual(sent["message"], "收到")
        self.assertEqual(sent["user_id"], 9)
        self.assertEqual(sent["self_id"], 42)

    def test_a_long_reply_is_split_into_qq_sized_segments(self):
        long_text = "字" * (MAX_SEGMENT_CHARS * 2 + 5)
        engine = _FakeEngine(reply=long_text)
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "message", "self_id": 1, "user_id": 9,
                            "message": "hi"}, None))
        parts = [item["message"] for item in engine.adapter_runtime.sent]
        self.assertEqual(len(parts), 3)
        self.assertEqual("".join(parts), long_text)
        self.assertTrue(all(len(part) <= MAX_SEGMENT_CHARS for part in parts))

    def test_a_group_reply_is_addressed_to_the_group(self):
        engine = _FakeEngine(reply="好")
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "message", "self_id": 1, "group_id": 5,
                            "user_id": 9, "message": "hi"}, None))
        sent = engine.adapter_runtime.sent[0]
        self.assertEqual(sent["group_id"], 5)
        # Exactly one target: a group reply must not also carry user_id, or a
        # transport keying on it would answer privately instead of in the group.
        self.assertNotIn("user_id", sent)

    def test_a_private_reply_is_addressed_to_the_user(self):
        engine = _FakeEngine(reply="好")
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "message", "self_id": 1, "user_id": 9,
                            "message": "hi"}, None))
        sent = engine.adapter_runtime.sent[0]
        self.assertEqual(sent["user_id"], 9)
        self.assertNotIn("group_id", sent)

    def test_an_empty_reply_sends_nothing(self):
        engine = _FakeEngine(reply="")
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "message", "self_id": 1, "user_id": 9,
                            "message": "hi"}, None))
        self.assertEqual(engine.adapter_runtime.sent, [])


class MediaAndNoticeTests(unittest.TestCase):
    def test_an_image_is_captioned_before_reaching_the_model(self):
        engine = _FakeEngine()
        bridge = InboundBridge(engine, _instance())
        data = {"post_type": "message", "self_id": 1, "user_id": 9,
                "message": [{"type": "image", "data": {"file": "pic.jpg"}}]}
        _run(bridge.handle(data, None))
        self.assertEqual(engine.described, ["pic.jpg"])
        self.assertIn("描述:pic.jpg", engine.turns[0]["message"])

    def test_a_recall_notice_is_recorded_as_a_note(self):
        engine = _FakeEngine()
        bridge = InboundBridge(engine, _instance())
        data = {"post_type": "notice", "notice_type": "group_recall", "group_id": 5,
                "user_id": 9, "operator_id": 9, "message_id": 77}
        _run(bridge.handle(data, None))
        self.assertEqual(len(engine.recalls), 1)
        session_id, user_id, note, adapter_type = engine.recalls[0]
        self.assertEqual(session_id, "bot:adp_test:qq_group_5")
        self.assertEqual(user_id, "9")
        self.assertEqual(adapter_type, "onebot_group")
        self.assertTrue(note)

    def test_a_non_recall_notice_is_ignored(self):
        engine = _FakeEngine()
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "notice", "notice_type": "notify"}, None))
        self.assertEqual(engine.recalls, [])

    def test_a_meta_event_is_ignored(self):
        engine = _FakeEngine()
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "meta_event", "meta_event_type": "heartbeat"}, None))
        self.assertEqual(engine.turns, [])
        self.assertEqual(engine.observed, [])


class ResilienceTests(unittest.TestCase):
    def test_a_failing_turn_does_not_propagate(self):
        """One bad turn must not tear down the WebSocket and drop the queue."""

        class Exploding(_FakeEngine):
            def process_message(self, **kwargs):
                raise RuntimeError("model down")

        engine = Exploding()
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "message", "self_id": 1, "user_id": 9,
                            "message": "hi"}, None))

    def test_a_failing_observer_does_not_block_the_reply(self):
        class BadObserver(_FakeEngine):
            async def on_group_observe(self, *args, **kwargs):
                raise RuntimeError("store down")

        engine = BadObserver(reply="ok")
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "message", "self_id": 1, "group_id": 5,
                            "user_id": 9, "message": "hi"}, None))
        self.assertEqual(len(engine.adapter_runtime.sent), 1)

    def test_an_engine_without_the_hooks_still_works(self):
        """An engine that never grew the adapter hooks must degrade, not crash.

        The bridge reaches for its collaborators with ``getattr`` precisely so a
        partial implementation (or an older engine) keeps working over the parts
        it does support. A private message needs none of the four hooks.
        """
        engine = _FakeEngine(reply="hi back")
        for name in ("on_group_observe", "should_reply_in_group", "on_recall",
                     "describe_media_ref"):
            # Shadow the bound methods per-instance so the lookup really misses.
            setattr(engine, name, None)
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "message", "self_id": 1,
                            "user_id": 9, "message": "hi"}, None))
        self.assertEqual(len(engine.turns), 1)
        self.assertEqual(len(engine.adapter_runtime.sent), 1)

    def test_a_group_message_without_the_should_reply_hook_stays_silent(self):
        """Fail closed: an absent gate must not turn every group message into a reply."""
        engine = _FakeEngine()
        engine.should_reply_in_group = None
        bridge = InboundBridge(engine, _instance())
        _run(bridge.handle({"post_type": "message", "self_id": 1, "group_id": 5,
                            "user_id": 9, "message": "hi"}, None))
        self.assertEqual(engine.turns, [])


if __name__ == "__main__":
    unittest.main()
