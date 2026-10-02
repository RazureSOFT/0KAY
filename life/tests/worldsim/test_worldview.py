"""Worldview + map: fictional nations are drawn, real countries use coordinates."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from life.worldsim.worldview import (  # noqa: E402
    HEIGHT, WIDTH, build_map, extract_json, map_revision, normalize_worldview)


class FictionMapTest(unittest.TestCase):
    def test_fictional_world_draws_from_the_setting(self):
        """No real basemap: districts + water + roads composed from the setting."""
        world = normalize_worldview(
            {"fictional": True, "country": "中国", "city": "星月城",
             "districts": [{"name": "老城区", "x": 260, "y": 340, "r": 180},
                           {"name": "新城区", "x": 700, "y": 300, "r": 160}],
             "water": [{"name": "星月湖", "kind": "lake", "x": 480, "y": 420, "r": 110}],
             "places": [{"name": "龙井小区14栋", "kind": "home", "x": 200, "y": 300},
                        {"name": "星月二高", "kind": "work", "x": 600, "y": 240},
                        {"name": "星月湖", "kind": "park", "x": 420, "y": 520}],
             "actors": [{"name": "白荼", "role": "friend", "location": "龙井小区14栋"}]}, {})
        world_map = world["map"]
        self.assertEqual(world_map["kind"], "fictional")
        self.assertEqual([d["name"] for d in world_map["districts"]], ["老城区", "新城区"])
        self.assertEqual(world_map["lakes"][0]["name"], "星月湖")
        for key in ("rivers", "roads", "blocks", "parks", "metro", "bus"):
            self.assertTrue(world_map[key], key)
        for loc in world_map["locations"]:
            self.assertTrue(0 <= loc["x"] <= WIDTH and 0 <= loc["y"] <= HEIGHT)
            self.assertIsNone(loc["lat"])
        self.assertEqual(world["actors"][0]["location"], world_map["locations"][0]["id"])

    def test_named_infrastructure_resolves_from_place_names(self):
        """Roads / metro / bus reference places by name; we resolve coordinates."""
        world = normalize_worldview({
            "fictional": True, "country": "中国", "city": "星月城",
            "places": [{"name": "龙井小区14栋", "kind": "home", "x": 200, "y": 300},
                       {"name": "星月二高", "kind": "work", "x": 600, "y": 240},
                       {"name": "星月湖", "kind": "park", "x": 420, "y": 520}],
            "roads": [{"name": "白鹭路", "kind": "arterial", "from": "龙井小区14栋", "to": "星月二高"}],
            "metro": [{"name": "地铁1号线", "stations": [{"name": "小区站", "at": "龙井小区14栋"},
                                                          {"name": "二高站", "at": "星月二高"}]}],
            "bus": [{"name": "公交12路", "stops": [{"name": "小区", "at": "龙井小区14栋"},
                                                    {"name": "学校", "at": "星月二高"}]}],
        }, {})["map"]
        road = next(r for r in world["roads"] if r["name"] == "白鹭路")
        self.assertGreaterEqual(len(road["points"]), 3)  # resolved from/to + a bend
        self.assertEqual([s["name"] for s in world["metro"][0]["stations"]], ["小区站", "二高站"])
        for station in world["metro"][0]["stations"]:
            self.assertIsInstance(station["x"], (int, float))
            self.assertIsInstance(station["y"], (int, float))
        self.assertEqual(world["bus"][0]["name"], "公交12路")

    def test_buildings_are_varied_with_tower_details(self):
        world_map = normalize_worldview(
            {"fictional": True, "country": "曦国", "city": "临海城",
             "places": [{"name": "A", "x": 100, "y": 100}]}, {})["map"]
        self.assertGreater(len(world_map["blocks"]), 20)
        self.assertTrue(all("shade" in b for b in world_map["blocks"]))
        self.assertTrue(any(b.get("tower") for b in world_map["blocks"]))

    def test_fictional_map_synthesises_when_model_gives_nothing(self):
        def build():
            return normalize_worldview(
                {"fictional": True, "country": "曦国", "city": "临海城",
                 "places": [{"name": "A", "x": 10, "y": 10}, {"name": "B", "x": 900, "y": 600}]}, {})["map"]
        world = build()
        self.assertTrue(world["districts"])   # default districts, so the map is never empty
        self.assertTrue(world["lakes"] and world["rivers"])
        self.assertTrue(world["metro"] and world["bus"] and world["blocks"])  # deterministic fabric
        self.assertEqual(world["districts"], build()["districts"])

    def test_build_map_uses_a_stored_input(self):
        from life.worldsim.worldview import input_for_storage
        raw = {"places": [{"name": "A", "x": 100, "y": 100}, {"name": "B", "x": 300, "y": 300},
                          {"name": "C", "x": 500, "y": 500}],
               "districts": [{"name": "老城区", "x": 300, "y": 300, "r": 180}]}
        built = build_map({"world_fictional": "fictional", "world_map": json.dumps(input_for_storage(raw)),
                           "world_places": "别的, 地点, 另一个"})
        self.assertEqual({loc["name"] for loc in built["locations"]}, {"A", "B", "C"})
        self.assertEqual([d["name"] for d in built["districts"]], ["老城区"])
        self.assertEqual(built["kind"], "fictional")

    def test_fictional_map_exports_edges_for_actor_movement(self):
        """The runtime moves actors along ``edges``; a fictional city must have them."""
        world_map = normalize_worldview(
            {"fictional": True, "country": "曦国", "city": "临海城",
             "places": [{"name": "A", "x": 100, "y": 100}, {"name": "B", "x": 500, "y": 300},
                        {"name": "C", "x": 900, "y": 600}]}, {})["map"]
        ids = {loc["id"] for loc in world_map["locations"]}
        self.assertTrue(world_map["edges"])
        for a, b in world_map["edges"]:
            self.assertIn(a, ids)
            self.assertIn(b, ids)

    def test_transit_colour_is_validated(self):
        """A model-supplied colour lands in an inline style, so only hex passes."""
        from life.worldsim.citymap import _METRO_COLORS
        world_map = normalize_worldview(
            {"fictional": True, "country": "曦国", "city": "临海城",
             "places": [{"name": "A", "x": 100, "y": 100}, {"name": "B", "x": 800, "y": 600}],
             "metro": [{"name": "地铁9号线", "color": "red;} body{display:none",
                        "stations": [{"name": "A站", "at": "A"}, {"name": "B站", "at": "B"}]}]}, {})["map"]
        self.assertIn(world_map["metro"][0]["color"], _METRO_COLORS)

    def test_build_map_is_memoised_with_a_copy(self):
        settings = {"world_fictional": "fictional", "world_country": "曦国", "world_city": "临海城"}
        first = build_map(settings)
        second = build_map(settings)
        self.assertEqual(first, second)
        self.assertIsNot(first, second)  # callers may mutate their copy freely

    def test_stored_built_map_is_migrated_not_rewarped(self):
        """A built payload (has ``blocks``) is migrated, never re-warped as input."""
        built = normalize_worldview(
            {"fictional": True, "country": "曦国", "city": "临海城",
             "places": [{"name": "A", "x": 100, "y": 100}, {"name": "B", "x": 500, "y": 300},
                        {"name": "C", "x": 900, "y": 600}]}, {})["map"]
        self.assertIn("blocks", built)
        rebuilt = build_map({"world_fictional": "fictional", "world_map": json.dumps(built, ensure_ascii=False)})
        self.assertEqual({loc["name"] for loc in rebuilt["locations"]}, {"A", "B", "C"})


class RealMapTest(unittest.TestCase):
    def test_locations_get_real_coordinates_around_a_centre(self):
        world = normalize_worldview(
            {"fictional": False, "country": "中国", "city": "杭州",
             "places": [{"name": "A", "x": 100, "y": 100}, {"name": "B", "x": 900, "y": 600},
                        {"name": "C", "x": 500, "y": 350}]}, {})
        world_map = world["map"]
        self.assertEqual(world_map["kind"], "real")
        self.assertAlmostEqual(world_map["center"]["lat"], 30.25, places=1)
        self.assertAlmostEqual(world_map["center"]["lng"], 120.16, places=1)
        for loc in world_map["locations"]:
            self.assertIsNotNone(loc["lat"])
            self.assertIsNotNone(loc["lng"])
            self.assertLess(abs(loc["lat"] - 30.25), 0.06)
            self.assertLess(abs(loc["lng"] - 120.16), 0.09)

    def test_explicit_lat_lng_wins(self):
        world = normalize_worldview(
            {"fictional": False, "center": {"lat": 10, "lng": 20, "zoom": 12},
             "places": [{"name": "A", "lat": 10.01, "lng": 20.02}, {"name": "B", "x": 10, "y": 10},
                        {"name": "C", "x": 500, "y": 300}]}, {})
        a = next(loc for loc in world["map"]["locations"] if loc["name"] == "A")
        self.assertAlmostEqual(a["lat"], 10.01)
        self.assertAlmostEqual(a["lng"], 20.02)

    def test_llm_dict_is_clamped_and_normalised(self):
        data = {
            "fictional": False, "country": "曦国", "city": "临海城", "district": "旧港区",
            "actors": [{"name": "阿黎", "role": "friend", "location": "灯塔"}],
            "places": [{"name": "灯塔", "kind": "transit", "x": 5000, "y": -100, "desc": "海边"},
                       {"name": "旧书店", "kind": "shop", "x": 100, "y": 200},
                       {"name": "家", "kind": "home", "x": 400, "y": 400}],
            "edges": [["灯塔", "旧书店"], ["灯塔", "不存在的地方"]],
        }
        world = normalize_worldview(data, {})
        self.assertFalse(world["fictional"])
        self.assertEqual((world["country"], world["city"], world["district"]), ("曦国", "临海城", "旧港区"))
        lamp = next(loc for loc in world["map"]["locations"] if loc["name"] == "灯塔")
        self.assertLessEqual(lamp["x"], WIDTH - 40)
        self.assertGreaterEqual(lamp["y"], 40)
        self.assertEqual(world["actors"][0]["location"], lamp["id"])
        names = {loc["id"]: loc["name"] for loc in world["map"]["locations"]}
        edges = {tuple(sorted((names[a], names[b]))) for a, b in world["map"]["edges"]}
        self.assertIn(tuple(sorted(("灯塔", "旧书店"))), edges)
        self.assertNotIn("不存在的地方", json.dumps(world["map"]["edges"], ensure_ascii=False))


class JsonHelpersTest(unittest.TestCase):
    def test_extract_json_handles_fences(self):
        self.assertEqual(extract_json('```json\n{"a": 1}\n```'), {"a": 1})
        self.assertEqual(extract_json('前言 {"b": 2} 后记'), {"b": 2})
        self.assertEqual(extract_json("nope"), {})

    def test_map_revision_tracks_settings(self):
        self.assertNotEqual(map_revision({"world_places": "A,B,C"}), map_revision({"world_places": "A,B,D"}))


if __name__ == "__main__":
    unittest.main()
