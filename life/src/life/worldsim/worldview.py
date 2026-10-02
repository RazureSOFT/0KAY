"""Precise worldview + a renderable map.

The owner (optionally with the model's help) specifies where the world is —
country / city / district, real or fictional — a premise, a cast and a set of
places.  A *map* places those locations on a 1000x700 canvas with coordinates
and roads (edges), and gives every actor a home location, so the dashboard can
render where everyone is.

The model proposes a worldview; this module normalises it into the canonical
shape (clamping coordinates, dropping unknown fields) so nothing downstream has
to trust the LLM's formatting.  When the model is unavailable the same shape is
built deterministically from the settings, so the panel always has a map.
"""
from __future__ import annotations

import copy
import hashlib
import json
import math
import re

from .assets import parse_actors_text, parse_places_text
from .citymap import build_city, build_nation

WIDTH = 1000
HEIGHT = 700
KINDS = ("home", "work", "shop", "food", "park", "transit", "other")
MAX_LOCATIONS = 14
MAX_ACTORS = 10

# Approximate geographic spread of the abstract canvas around the map centre
# (~9 km), so a fictional city still renders as a walkable neighbourhood.
LAT_SPAN = 0.08
LNG_SPAN = 0.10

# Real tile basemaps need a real centre. Known cities/countries get their true
# coordinates; anything else defaults to a southern-China city backdrop.
CITY_CENTERS = {
    "北京": (39.90, 116.40), "上海": (31.23, 121.47), "广州": (23.13, 113.26),
    "深圳": (22.54, 114.06), "杭州": (30.25, 120.16), "成都": (30.57, 104.07),
    "武汉": (30.59, 114.31), "南京": (32.06, 118.79), "重庆": (29.56, 106.55),
    "西安": (34.34, 108.94), "长沙": (28.23, 112.94), "厦门": (24.48, 118.09),
    "苏州": (31.30, 120.62), "宁波": (29.87, 121.55), "福州": (26.07, 119.30),
}
COUNTRY_CENTERS = {
    "中国": (35.0, 105.0, 4), "日本": (36.2, 138.2, 5), "韩国": (36.5, 127.9, 6),
    "美国": (39.8, -98.6, 4), "英国": (54.0, -2.0, 5), "法国": (46.6, 2.2, 5),
    "德国": (51.2, 10.4, 5), "澳大利亚": (-25.0, 133.8, 4),
}
DEFAULT_CENTER = {"lat": 30.25, "lng": 120.16, "zoom": 13}  # Hangzhou backdrop


def _float(value, default: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _resolve_center(data: dict, settings: dict) -> dict:
    raw = data.get("center") if isinstance(data.get("center"), dict) else {}
    lat = raw.get("lat", settings.get("env_latitude"))
    lng = raw.get("lng", settings.get("env_longitude"))
    if lat not in (None, "") and lng not in (None, ""):
        return {"lat": _float(lat, DEFAULT_CENTER["lat"]), "lng": _float(lng, DEFAULT_CENTER["lng"]),
                "zoom": _clamp(_int(raw.get("zoom"), 13), 3, 18)}
    city = str(data.get("city") or settings.get("world_city") or "").strip()
    for name, (clat, clng) in CITY_CENTERS.items():
        if name and name in city:
            return {"lat": clat, "lng": clng, "zoom": 13}
    country = str(data.get("country") or settings.get("world_country") or "").strip()
    for name, (clat, clng, zoom) in COUNTRY_CENTERS.items():
        if name and name in country:
            return {"lat": clat, "lng": clng, "zoom": zoom}
    return dict(DEFAULT_CENTER)


def _int(value, default: int) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return default


def _clamp(value: int, low: int, high: int) -> int:
    return max(low, min(high, value))


def _clampf(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def extract_json(text: str) -> dict:
    """Pull the first JSON object out of a model reply (handles ``` fences)."""
    body = str(text or "")
    if "```" in body:
        parts = body.split("```")
        for part in parts:
            candidate = part[3:] if part.startswith("json") else part
            try:
                loaded = json.loads(candidate.strip())
                if isinstance(loaded, dict):
                    return loaded
            except ValueError:
                continue
    match = re.search(r"\{.*\}", body, re.S)
    if match:
        try:
            loaded = json.loads(match.group(0))
            if isinstance(loaded, dict):
                return loaded
        except ValueError:
            pass
    return {}


def _default_pools():
    from world import generate_assets
    return list(generate_assets._PLACES), list(generate_assets._NAMES)


def _layout_on_ring(count: int) -> list[tuple[int, int]]:
    """Deterministic organic scatter (golden-angle), more map-like than a ring."""
    if count <= 1:
        return [(WIDTH // 2, HEIGHT // 2)]
    points = []
    for index in range(count):
        radius = math.sqrt((index + 0.5) / count)
        angle = index * 2.399963229728653  # golden angle
        points.append((int(WIDTH / 2 + math.cos(angle) * radius * WIDTH * 0.38),
                       int(HEIGHT / 2 + math.sin(angle) * radius * HEIGHT * 0.40)))
    return points


def _spread(locations: list[dict], min_dist: int = 140, iterations: int = 120) -> None:
    """Push nodes apart so no two labels/nodes pile up (deterministic)."""
    count = len(locations)
    if count < 2:
        return
    points = [[float(loc["x"]), float(loc["y"])] for loc in locations]
    for _ in range(iterations):
        moved = False
        for i in range(count):
            for j in range(i + 1, count):
                dx, dy = points[j][0] - points[i][0], points[j][1] - points[i][1]
                distance = math.hypot(dx, dy) or 0.001
                if distance < min_dist:
                    push = (min_dist - distance) / 2
                    ux, uy = dx / distance, dy / distance
                    points[i][0] -= ux * push; points[i][1] -= uy * push
                    points[j][0] += ux * push; points[j][1] += uy * push
                    moved = True
        for point in points:
            point[0] = min(WIDTH - 100, max(100, point[0]))
            point[1] = min(HEIGHT - 100, max(100, point[1]))
        if not moved:
            break
    for loc, point in zip(locations, points):
        loc["x"], loc["y"] = int(point[0]), int(point[1])


def _normalize_locations(raw_places, default_places) -> list[dict]:
    locations: list[dict] = []
    seen: set[str] = set()
    source = list(raw_places or [])[:MAX_LOCATIONS]
    for entry in source:
        if isinstance(entry, str):
            entry = {"name": entry}
        if not isinstance(entry, dict):
            continue
        name = str(entry.get("name") or "").strip()
        if not name or name in seen:
            continue
        seen.add(name)
        kind = str(entry.get("kind") or "other").strip().lower()
        if kind not in KINDS:
            kind = "other"
        locations.append({
            "id": f"l{len(locations)}",
            "name": name[:24],
            "kind": kind,
            "x": _clamp(_int(entry.get("x"), -1), 40, WIDTH - 40) if entry.get("x") is not None else -1,
            "y": _clamp(_int(entry.get("y"), -1), 40, HEIGHT - 40) if entry.get("y") is not None else -1,
            "lat": entry.get("lat"), "lng": entry.get("lng"),
            "desc": str(entry.get("desc") or "")[:120],
        })
    if len(locations) < 3:  # only pad an under-specified world, never a full one
        for name in default_places:
            if len(locations) >= MAX_LOCATIONS or len(locations) >= 6:
                break
            name = str(name).strip()
            if name and name not in seen:
                seen.add(name)
                locations.append({"id": f"l{len(locations)}", "name": name[:24], "kind": "other",
                                  "x": -1, "y": -1, "lat": None, "lng": None, "desc": ""})
    # Fill any missing coordinates deterministically on a ring.
    ring = _layout_on_ring(len(locations))
    for index, location in enumerate(locations):
        if location["x"] < 0 or location["y"] < 0:
            location["x"], location["y"] = ring[index]
    _spread(locations)
    return locations


def _normalize_edges(raw_edges, locations) -> list[list[str]]:
    by_name = {loc["name"]: loc["id"] for loc in locations}
    ids = {loc["id"] for loc in locations}
    edges: list[list[str]] = []
    for edge in (raw_edges or [])[:60]:
        if not isinstance(edge, (list, tuple)) or len(edge) < 2:
            continue
        a = by_name.get(str(edge[0])) or (str(edge[0]) if str(edge[0]) in ids else None)
        b = by_name.get(str(edge[1])) or (str(edge[1]) if str(edge[1]) in ids else None)
        if a and b and a != b and [a, b] not in edges and [b, a] not in edges:
            edges.append([a, b])
    if not edges and len(locations) > 1:
        # Guarantee a connected, plausible road network: walk to the nearest
        # unvisited node instead of chaining in list order.
        positions = {loc["id"]: (loc["x"], loc["y"]) for loc in locations}
        ids = [loc["id"] for loc in locations]
        visited = {ids[0]}
        current = ids[0]
        while len(visited) < len(ids):
            nxt = min((i for i in ids if i not in visited),
                      key=lambda i: (positions[i][0] - positions[current][0]) ** 2
                      + (positions[i][1] - positions[current][1]) ** 2)
            edges.append([current, nxt])
            visited.add(nxt)
            current = nxt
    return edges


def _normalize_actors(raw_actors, locations):
    actors: list[dict] = []
    for index, entry in enumerate(list(raw_actors or [])[:MAX_ACTORS]):
        if isinstance(entry, str):
            entry = {"name": entry}
        if not isinstance(entry, dict):
            continue
        name = str(entry.get("name") or "").strip()
        if not name:
            continue
        role = str(entry.get("role") or "friend").strip()
        if role not in ("friend", "colleague", "family", "other"):
            role = "friend"
        location = str(entry.get("location") or "").strip()
        home = next((loc["id"] for loc in locations if loc["name"] == location or loc["id"] == location), None)
        if home is None:
            home = locations[index % len(locations)]["id"] if locations else ""
        actors.append({"id": f"a{index}", "name": name[:16], "role": role, "location": home})
    return actors


def normalize_worldview(data: dict, settings: dict | None = None) -> dict:
    """Canonical worldview from a model/panel dict, defaulting to the settings."""
    settings = settings or {}
    data = data if isinstance(data, dict) else {}
    default_places, default_names = _default_pools()

    fictional_raw = data.get("fictional", settings.get("world_fictional", "fictional"))
    fictional = str(fictional_raw).strip().lower() not in ("real", "0", "false", "真实", "现实")

    raw_places = data.get("places")
    if not raw_places:
        raw_places = [{"name": p} for p in parse_places_text(str(settings.get("world_places") or ""))]
    if not raw_places:
        raw_places = [{"name": p} for p in default_places]
    locations = _normalize_locations(raw_places, default_places)

    raw_actors = data.get("actors")
    if not raw_actors:
        raw_actors = [{"name": n, "role": r} for n, r in parse_actors_text(str(settings.get("world_actors") or ""))]
    if not raw_actors:
        raw_actors = [{"name": n, "role": r} for n, r in default_names]
    actor_places = data.get("actor_places") if isinstance(data.get("actor_places"), dict) else {}
    for actor in raw_actors:
        if isinstance(actor, dict) and not actor.get("location"):
            actor["location"] = actor_places.get(str(actor.get("name") or ""), "")
    actors = _normalize_actors(raw_actors, locations)

    country = str(data.get("country") or settings.get("world_country") or "").strip()[:40]
    city = str(data.get("city") or settings.get("world_city") or "").strip()[:40]
    district = str(data.get("district") or settings.get("world_district") or "").strip()[:40]
    title = str(data.get("map_title") or city or "世界地图").strip()[:40]

    if fictional:
        # A fictional city has no real basemap: draw it from the setting
        # (districts + water + the story's places).
        region_names = data.get("regions")
        if isinstance(region_names, list):
            region_names = [str(r.get("name") if isinstance(r, dict) else r) for r in region_names]
        world_map = build_city(country=country, city=city,
                               districts=data.get("districts"), water=data.get("water"),
                               roads=data.get("roads"), metro=data.get("metro"),
                               bus=data.get("bus"), parks=data.get("parks"),
                               compounds=data.get("compounds"), buildings=data.get("buildings"),
                               names=region_names, locations=locations, actors=actors,
                               title=title, width=WIDTH, height=HEIGHT)
        locations = world_map["locations"]
        world_map["nation"] = build_nation(country=country, city=city, provinces=region_names,
                                           cities=data.get("cities"), width=WIDTH, height=HEIGHT)
        world_map["regions"] = [p["name"] for p in world_map["nation"]["provinces"]]
    else:
        center = _resolve_center(data, settings)
        for location in locations:
            if location.get("lat") not in (None, "") and location.get("lng") not in (None, ""):
                location["lat"] = round(_clampf(_float(location["lat"], center["lat"]), -85.0, 85.0), 6)
                location["lng"] = round(_clampf(_float(location["lng"], center["lng"]), -180.0, 180.0), 6)
            else:
                location["lat"] = round(center["lat"] + (0.5 - location["y"] / HEIGHT) * LAT_SPAN, 6)
                location["lng"] = round(center["lng"] + (location["x"] / WIDTH - 0.5) * LNG_SPAN, 6)
        world_map = {
            "kind": "real", "title": title, "width": WIDTH, "height": HEIGHT,
            "country": country, "city": city, "center": center,
            "locations": locations, "edges": _normalize_edges(data.get("edges"), locations),
            "actors": actors,
        }

    return {
        "fictional": fictional,
        "country": country,
        "city": city,
        "district": district,
        # The premise carries the owner's full setting; keep it long enough for a
        # detailed worldbuilding document instead of truncating to a blurb.
        "premise": str(data.get("premise") or settings.get("world_premise") or "").strip()[:4000],
        "actors": actors,
        "places": locations,
        "map": world_map,
    }


def _migrate_legacy(built: dict) -> dict:
    """Old built-map payload → current input format (names only, no coordinates)."""
    locations = built.get("locations") or []
    id_to_name = {loc.get("id"): loc.get("name") for loc in locations}
    metro = []
    for line in built.get("metro", []):
        stations = [{"name": s.get("name", "")} for s in line.get("stations", []) if s.get("name")]
        if stations:
            metro.append({"name": line.get("name", ""), "stations": stations})
    bus = []
    for line in built.get("bus", []):
        stops = [{"name": s.get("name", "")} for s in (line.get("stops") or line.get("stations") or []) if s.get("name")]
        if stops:
            bus.append({"name": line.get("name", ""), "stops": stops})
    cities = (built.get("nation") or {}).get("cities", [])
    return {
        "places": [{"name": loc.get("name"), "kind": loc.get("kind", "other")} for loc in locations if loc.get("name")],
        "districts": [{"name": d.get("name")} for d in built.get("districts", []) if d.get("name")],
        "water": built.get("water", []),
        "metro": metro, "bus": bus,
        "parks": [{"name": p.get("name")} for p in built.get("parks", []) if p.get("name")],
        "compounds": [{"name": c.get("name")} for c in built.get("compounds", []) if c.get("name")],
        "regions": built.get("regions"),
        "cities": [{"name": c.get("name"), "capital": c.get("capital")} for c in cities if c.get("name")],
        "actors": [{"name": a.get("name"), "role": a.get("role"),
                    "location": id_to_name.get(a.get("location"), "")} for a in built.get("actors", [])],
    }


_STORED_KEYS = ("districts", "water", "roads", "metro", "bus", "parks", "compounds",
                "buildings", "cities", "regions", "places", "actors", "edges", "center")
# Keys that only a *built* map carries (the model's raw input never has them).
# Used to tell a stored built payload from a stored raw input, because both share
# keys like ``roads`` — treating a built payload as input would warp it twice.
_BUILT_MARKERS = ("lakes", "rivers", "blocks", "streets", "named_buildings", "nation")

_MAP_CACHE_LIMIT = 8
_MAP_CACHE: dict[str, dict] = {}


def _settings_key(settings: dict) -> str:
    try:
        return json.dumps(settings, ensure_ascii=False, sort_keys=True, default=str)
    except (TypeError, ValueError):
        return repr(sorted(settings.items(), key=lambda kv: str(kv[0])))


def build_map(settings: dict | None) -> dict:
    """The map for the current settings, memoised per settings (built once per diff).

    Rebuilding the procedural city is expensive and ``worldview_snapshot`` runs on
    every panel poll, so identical settings reuse the previous result.  A copy is
    returned so callers cannot mutate the cache.
    """
    settings = settings or {}
    key = _settings_key(settings)
    cached = _MAP_CACHE.get(key)
    if cached is not None:
        return copy.deepcopy(cached)
    result = _build_map(settings)
    if len(_MAP_CACHE) >= _MAP_CACHE_LIMIT:
        _MAP_CACHE.pop(next(iter(_MAP_CACHE)), None)
    _MAP_CACHE[key] = copy.deepcopy(result)
    return result


def _build_map(settings: dict) -> dict:
    """The map for the current settings (stored map if valid, else synthesized)."""
    stored = settings.get("world_map")
    data: dict = {}
    if stored:
        try:
            parsed = json.loads(stored) if isinstance(stored, str) else stored
            # A built payload is migrated to the input format (names kept,
            # coordinates dropped) so its already-warped geometry is not warped a
            # second time; only the raw input format is rebuilt as-is.
            if isinstance(parsed, dict):
                if any(parsed.get(key) for key in _BUILT_MARKERS):
                    data = _migrate_legacy(parsed)
                elif any(parsed.get(key) for key in _STORED_KEYS if key != "actors"):
                    data = parsed
                elif parsed.get("locations"):
                    data = _migrate_legacy(parsed)
        except (TypeError, ValueError):
            data = {}
    if not data:
        return normalize_worldview({}, settings)["map"]
    kind = str(data.get("kind") or "").strip()
    fictional = kind == "fictional" or (
        kind != "real" and str(settings.get("world_fictional", "fictional")) != "real")
    regions = data.get("regions")
    # The stored payload is the model's raw *input* (unwarped); the map is rebuilt
    # from it, so geometry is warped exactly once and never accumulates.
    world = normalize_worldview(
        {"fictional": fictional,
         "country": settings.get("world_country"), "city": settings.get("world_city"),
         "district": settings.get("world_district"), "premise": settings.get("world_premise"),
         "center": data.get("center"), "regions": regions,
         "districts": data.get("districts"), "water": data.get("water"),
         "roads": data.get("roads"), "metro": data.get("metro"),
         "bus": data.get("bus"), "parks": data.get("parks"),
         "compounds": data.get("compounds"), "buildings": data.get("buildings"),
         "cities": data.get("cities"),
         "places": data.get("places") or data.get("locations"), "edges": data.get("edges"),
         "actors": data.get("actors") or []},
        settings)
    return world["map"]


def input_for_storage(data: dict) -> dict:
    """The model's raw map *input*, persisted so the map is rebuilt deterministically.

    Storing the raw input (not the built geometry) means the map is warped exactly
    once per build and never accumulates duplicate roads on reload.
    """
    data = data if isinstance(data, dict) else {}
    return {key: data.get(key) for key in _STORED_KEYS if data.get(key) is not None}


def map_revision(settings: dict | None) -> str:
    """Stable signature of the stored map, used to rebuild the runtime."""
    map_payload = build_map(settings)
    blob = json.dumps(map_payload, ensure_ascii=False, sort_keys=True)
    return hashlib.sha1(blob.encode("utf-8")).hexdigest()[:12]
