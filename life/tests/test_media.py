import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life import media
from life.adapters.onebot import OneBotMessage


class MediaParsing(unittest.TestCase):
    def test_cq_string(self):
        message = "看这个[CQ:image,file=cat.jpg][CQ:at,qq=100,name=小红] 好看吗"
        segments = media.parse_segments(message)
        kinds = [seg["type"] for seg in segments]
        self.assertEqual(kinds, ["text", "image", "at", "text"])
        self.assertEqual(media.plain_text(message), "看这个 好看吗")

    def test_segment_list(self):
        message = [{"type": "text", "data": {"text": "hi"}},
                   {"type": "image", "data": {"url": "http://x/y.png"}},
                   {"type": "record", "data": {}}]
        description = media.describe_segments(message)
        self.assertIn("[图片：http://x/y.png]", description)
        self.assertIn("[语音]", description)

    def test_describe_and_vision_caption(self):
        message = [{"type": "image", "data": {"file": "a.png"}}]
        described = media.describe_segments(message, vision=lambda ref: "一只橘猫")
        self.assertIn("一只橘猫", described)

    def test_recall_note(self):
        note = media.recall_note("group_recall", 123, operator_id=456, message_id=789)
        self.assertIn("群撤回", note)
        self.assertIn("123", note)


class OneBotMessageMedia(unittest.TestCase):
    def test_message_exposes_segments(self):
        msg = OneBotMessage({"user_id": 1, "group_id": 2,
                             "message": [{"type": "text", "data": {"text": "hello"}},
                                         {"type": "image", "data": {"file": "x.jpg"}}]})
        self.assertTrue(msg.has_media)
        self.assertEqual(msg.text, "hello")
        self.assertIn("[图片", msg.description)


if __name__ == "__main__":
    unittest.main()
