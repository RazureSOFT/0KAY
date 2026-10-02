"""S1 gate: generated assets are valid, distributed as specified, and the LLM
cache is content-addressed."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]          # life/
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from world import gates, generate_assets, ledger_rules  # noqa: E402
from life.worldsim.assets import validate_cast, validate_templates, tier_distribution  # noqa: E402
from life.worldsim.llm_cache import LLMCache, prompt_key  # noqa: E402


class AssetGate(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.out = Path(cls.tmp.name) / "world"
        cls.report = generate_assets.generate(cls.out, seed=1)
        cls.cast = json.loads((cls.out / "cast.json").read_text(encoding="utf-8"))
        cls.templates = [json.loads(line) for line in (cls.out / "templates.jsonl").read_text(encoding="utf-8").splitlines() if line.strip()]

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_cast_and_templates_are_valid(self):
        self.assertEqual(validate_cast(self.cast), [])
        self.assertEqual(validate_templates(self.templates), [])

    def test_tier_distribution_matches_target(self):
        self.assertEqual(tier_distribution(self.templates), generate_assets.TIER_TARGET)

    def test_s1_gate_passes(self):
        result = gates.gate_s1(self.out / "cast.json", self.out / "templates.jsonl")
        self.assertTrue(result["passed"], result.get("problems"))

    def test_review_pass_rate_is_one(self):
        self.assertEqual(self.report["review"]["pass_rate"], 1.0)

    def test_llm_cache_is_content_addressed(self):
        with tempfile.TemporaryDirectory() as cache_dir:
            cache = LLMCache(cache_dir)
            self.assertIsNone(cache.get("hello", "m1"))
            cache.put("hello", "world", "m1")
            self.assertEqual(cache.get("hello", "m1"), "world")
            self.assertEqual(prompt_key("hello", "m1"), prompt_key("hello", "m1"))
            self.assertNotEqual(prompt_key("hello", "m1"), prompt_key("hello", "m2"))
            self.assertEqual(cache.stats()["hits"], 1)

    def test_typed_pools_prevent_nonsense_pairings(self):
        """Regression: patterns only draw nouns that fit their verb.

        The old unconstrained cartesian product produced "买了球赛" / "尝到了花" /
        "碰到了雨伞"; those must never come back.
        """
        for template in self.templates:
            text = template["text"]
            if "尝到了" in text:
                self.assertFalse(any(w in text for w in ("球赛", "雨伞", "歌", "剧", "外套")), text)
            if "买了" in text:
                self.assertFalse(any(w in text for w in ("球赛", "雨伞", "老人", "小孩")), text)
            if "碰到了" in text:
                self.assertFalse(any(w in text for w in ("花", "盆栽", "旧照片", "歌")), text)
            if "那家卖" in text:
                self.assertFalse(any(p + "那家卖" in text for p in ("家", "阳台", "公园", "地铁站")), text)

    def test_worldview_overrides_build_a_valid_world(self):
        """A user premise/actor/place roster replaces the stock world, still 300."""
        from life.worldsim.assets import parse_actors_text, parse_places_text
        self.assertEqual(parse_actors_text("小满|朋友\n阿杰 | 同事\n妈妈"),
                         [("小满", "friend"), ("阿杰", "colleague"), ("妈妈", "friend")])
        self.assertEqual(parse_places_text("家里, 天台、楼下小店"), ["家里", "天台", "楼下小店"])
        with tempfile.TemporaryDirectory() as directory:
            out = Path(directory) / "world"
            report = generate_assets.generate(
                out, seed=3, premise="一座临海小城",
                actors=parse_actors_text("小满\n阿杰|同事"),
                places=parse_places_text("家里,天台,楼下小店"))
            cast = json.loads((out / "cast.json").read_text(encoding="utf-8"))
            templates = [json.loads(line) for line in (out / "templates.jsonl").read_text(encoding="utf-8").splitlines() if line.strip()]
        self.assertEqual([a["name"] for a in cast["actors"]], ["小满", "阿杰"])
        self.assertEqual(cast["premise"], "一座临海小城")
        self.assertEqual(report["templates"], 300)
        self.assertEqual(validate_cast(cast), [])
        self.assertEqual(validate_templates(templates), [])

    def test_ledger_rules_clamp_and_debounce(self):
        self.assertEqual(ledger_rules.event_relation_delta(5), ledger_rules.MAX_RELATION_DELTA)
        ledger = {"last_times": {}, "daily_relation": 0.0, "drama_budget": 1.0}
        first = ledger_rules.apply_event(ledger, {"template_id": "t1", "intensity": 2}, 100.0)
        self.assertTrue(first["applied"])
        ledger["last_times"]["t1"] = first["mark_time"]  # caller persists the ledger
        # Same template inside the cooldown is refused.
        again = ledger_rules.apply_event(ledger, {"template_id": "t1", "intensity": 2}, 101.0)
        self.assertFalse(again["applied"])
        # High-intensity event is refused once the drama budget is spent.
        broke = ledger_rules.apply_event({"last_times": {}, "daily_relation": 0.0, "drama_budget": 0.0},
                                         {"template_id": "t9", "intensity": 4}, 200.0)
        self.assertFalse(broke["applied"])


if __name__ == "__main__":
    unittest.main()
