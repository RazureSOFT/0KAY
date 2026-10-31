from __future__ import annotations

from life.worldsim.scene import Scene, apply_update, build_scene, daypart, render_block

WORLD_STATE = {
    "world": {"hour": 19, "raining": False, "temperature_c": 18.4},
    "mood": {"valence": 0.7, "arousal": 0.6, "irritation": 0.0},
}

WORLD_MAP = {
    "locations": [
        {"id": "l0", "name": "灯塔咖啡", "kind": "shop", "desc": "街角开到很晚的店"},
        {"id": "l1", "name": "海风公寓", "kind": "home", "desc": ""},
    ],
    "actors": [
        {"id": "a0", "name": "林小满", "location": "l0"},
        {"id": "a1", "name": "陈屿", "location": "l0"},
        {"id": "a2", "name": "苏婉", "location": "l1"},
    ],
}


def test_daypart_boundaries():
    assert daypart(6) == "dawn"
    assert daypart(10) == "morning"
    assert daypart(12) == "noon"
    assert daypart(15) == "afternoon"
    assert daypart(19) == "evening"
    assert daypart(22) == "night"
    assert daypart(2) == "late night"
    assert daypart("nope") == "unknown"


def test_scene_comes_from_world_not_from_the_model():
    scene = build_scene(WORLD_STATE, WORLD_MAP, actor_id="a0")
    assert scene.place == "灯塔咖啡"
    assert scene.place_kind == "shop"
    assert scene.part_of_day == "evening"
    assert scene.weather == "18°C"
    assert scene.mood == "bright and talkative"


def test_only_the_other_people_in_the_room_are_present():
    scene = build_scene(WORLD_STATE, WORLD_MAP, actor_id="a0")
    assert scene.present == ["陈屿"]


def test_the_model_cannot_move_the_character():
    scene = build_scene(WORLD_STATE, WORLD_MAP, actor_id="a0")
    moved = apply_update(scene, {"place": "海风公寓", "place_desc": "暖气开得很足"})
    assert moved.place == "灯塔咖啡"
    assert moved.place_desc == "暖气开得很足"


def test_atmosphere_survives_a_rebuild_in_the_same_place():
    scene = build_scene(WORLD_STATE, WORLD_MAP, actor_id="a0")
    apply_update(scene, {"taboo": ["不要在这里提工作"], "hooks": ["隔壁桌在吵架"]})
    again = build_scene(WORLD_STATE, WORLD_MAP, actor_id="a0", previous=scene)
    assert again.taboo == ["不要在这里提工作"]
    assert again.hooks == ["隔壁桌在吵架"]


def test_moving_drops_the_old_atmosphere():
    scene = build_scene(WORLD_STATE, WORLD_MAP, actor_id="a0")
    apply_update(scene, {"taboo": ["不要在这里提工作"]})
    elsewhere = dict(WORLD_MAP)
    elsewhere["actors"] = [{"id": "a0", "name": "林小满", "location": "l1"}]
    moved = build_scene(WORLD_STATE, elsewhere, actor_id="a0", previous=scene)
    assert moved.place == "海风公寓"
    assert moved.taboo == []


def test_render_is_empty_without_a_scene():
    assert render_block(None) == ""
    assert render_block(Scene()) == ""


def test_render_mentions_place_time_and_company():
    scene = build_scene(WORLD_STATE, WORLD_MAP, actor_id="a0")
    block = render_block(scene)
    assert "灯塔咖啡" in block
    assert "evening" in block
    assert "陈屿" in block
    assert "do not invent a different place" in block


def test_unknown_hour_does_not_crash():
    scene = build_scene({"world": {}}, WORLD_MAP, actor_id="a0")
    assert scene.place == "灯塔咖啡"
    assert scene.part_of_day == ""
