import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.companion import CompanionSystem
from life.content import ContentSystem, parse_feed

RSS = """<?xml version="1.0"?>
<rss version="2.0"><channel><title>demo</title>
<item><title>Hello world</title><description><![CDATA[<p>first body</p>]]></description><link>http://a/1</link></item>
<item><title>Second post</title><description>second body</description><link>http://a/2</link></item>
</channel></rss>"""

ATOM = """<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
<entry><title>Atom one</title><summary>atom body</summary><link href="http://b/1"/></entry>
</feed>"""


class FeedParsing(unittest.TestCase):
    def test_rss_and_atom(self):
        rss = parse_feed(RSS, "news")
        self.assertEqual(len(rss), 2)
        self.assertEqual(rss[0]["title"], "Hello world")
        self.assertEqual(rss[0]["summary"], "first body")
        self.assertEqual(rss[0]["kind"], "news")
        atom = parse_feed(ATOM, "ai")
        self.assertEqual(atom[0]["title"], "Atom one")
        self.assertEqual(atom[0]["kind"], "ai")

    def test_malformed_feed_is_empty(self):
        self.assertEqual(parse_feed("not xml", "news"), [])

    def test_feed_setting_parsing(self):
        settings = {"news_feeds": "ai:https://x/feed, https://y/rss, bilibili:https://z"}
        content = ContentSystem(settings_getter=lambda: settings)
        feeds = content.feeds()
        self.assertEqual(feeds[0], ("ai", "https://x/feed"))
        self.assertEqual(feeds[1], ("news", "https://y/rss"))
        self.assertEqual(feeds[2], ("bilibili", "https://z"))


class DigestStorage(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.companion = CompanionSystem(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def test_digest_roundtrip(self):
        self.companion.add_digest("news", "feed", "标题", "摘要", "http://a")
        self.companion.add_digest("ai", "feed", "AI 日报", "今日模型动态")
        self.assertEqual(len(self.companion.list_digests()), 2)
        self.assertEqual(len(self.companion.list_digests("ai")), 1)
        self.assertTrue(self.companion.has_digest_today())
        self.assertIn("AI 日报", self.companion.recent_digest_context())


if __name__ == "__main__":
    unittest.main()
