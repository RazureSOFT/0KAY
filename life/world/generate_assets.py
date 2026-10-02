"""S1: generate worldsim assets (cast + event templates).

Offline by default and fully deterministic (seeded), so it runs without network
and is reproducible.  An optional ``llm`` callable can enrich/review the result;
when absent we use conservative defaults derived from the persona, and the
second-pass review is the schema + duplicate check (see ``review_assets``).

Templates are built from **typed** noun pools: a pattern only draws nouns that
fit its verb/place, so the assembled sentence is always a coherent little scene.
(An earlier version crossed a single 30-word list with every pattern, which is
where ``买了球赛`` / ``尝到了花`` / ``碰到了雨伞`` came from.)

Usage:
    python -m world assets --out world --seed 0
"""
from __future__ import annotations

import argparse
import importlib
import json
import random
import re
from pathlib import Path

TIER_TARGET = {"trivia": 210, "small": 75, "shareable": 12, "upset": 3}
TIER_INTENSITY = {"trivia": 1, "small": 2, "shareable": 3, "upset": 4}

# --- typed noun pools -------------------------------------------------------
# Buy-able goods.
_BUY = ["咖啡", "面包", "布丁", "饼干", "书", "花", "盆栽", "杯子", "袜子", "外套",
        "耳机", "绿萝", "香菜", "水果"]
# Things you notice around you.
_SEE = ["猫", "老人", "小孩", "公交车", "快递", "雨伞", "花", "盆栽", "灯泡",
        "旧照片", "海报", "街角的猫"]
# Memory triggers (used by "想起了").
_RECALL = ["旧照片", "老电影", "歌", "花", "书", "咖啡", "家乡的菜", "小时候的玩具",
           "老唱片", "旧日记"]
# People / things you can bump into.
_MEET = ["老人", "小孩", "猫", "快递", "雨伞", "公交车", "邻居", "老同学",
         "同事", "送外卖的"]
# Things you can leave behind.
_LEAVE = ["快递", "雨伞", "外套", "耳机", "杯子", "纸箱", "书", "袜子", "面包", "钥匙"]
# Edible / drinkable only ("尝到了").
_EAT = ["咖啡", "面包", "布丁", "饼干", "香菜", "外卖", "蛋糕", "拉面", "水果", "奶茶", "栗子", "汤"]
# Things worth tidying up.
_TIDY = ["纸箱", "旧照片", "书", "盆栽", "袜子", "杯子", "窗台", "绿萝", "外套", "耳机", "灯泡", "书架"]
# Things you go out to watch.
_SHOW = ["剧", "球赛", "电影", "展览", "演出"]
# Things that come in a new version.
_REPLACE = ["耳机", "外套", "杯子", "雨伞", "盆栽", "袜子", "灯泡", "手机", "背包",
            "水杯", "台灯", "键盘", "鼠标", "床单", "窗帘", "抱枕"]
# Things a small shop might sell.
_SELL = ["面包", "花", "咖啡", "书", "盆栽", "布丁", "饼干", "水果"]
# Things one can be busy with.
_BUSY = ["工作", "项目", "搬家", "健身", "论文", "考试", "装修", "带新人", "找房子",
         "准备演讲", "写东西", "做预算", "学做菜", "剪辑视频", "复习"]
# Gifts you can help pick.
_GIFT = ["礼物", "外套", "耳机", "杯子", "盆栽", "书", "围巾", "台灯", "抱枕", "背包",
         "花瓶", "相框", "香薰", "日记本", "拼图", "钢笔"]
# Talk topics.
_TOPIC = ["往事", "烦恼", "梦想", "小时候", "最近的压力", "喜欢的东西", "未来的打算"]
_MOOD_REASON = ["工作", "感情", "家里的事"]
_FLARE = ["小事", "误会", "安排"]

_TAGS = ["日常", "生活", "关系", "工作", "兴趣", "天气"]

_NAMES = [("林小满", "friend"), ("阿哲", "friend"), ("陈姐", "colleague"),
          ("王工", "colleague"), ("妈妈", "family"), ("表妹", "family")]
_PLACES = ["楼下便利店", "常去的咖啡馆", "公司", "公园", "菜市场", "书店", "健身房",
           "地铁站", "家", "阳台", "电影院", "体育馆", "美术馆"]
_PLOTS = [
    ("想学做一道新菜", 0.1, 0.2),
    ("和林小满约好一起去看展", 0.0, 0.1),
    ("推进一个想做的小项目", 0.3, 0.4),
    ("重新开始跑步", 0.0, 0.1),
]

# places that fit a verb, used to keep the scene plausible
_SHOP_PLACES = ["楼下便利店", "菜市场", "书店"]
_EAT_PLACES = ["常去的咖啡馆", "菜市场", "楼下便利店"]
_TIDY_PLACES = ["家", "公司", "阳台"]
_EVENT_PLACES = ["电影院", "体育馆", "美术馆", "公园"]

_ACTOR = "{actor}"
_NO_PLACE = [None]

# (pattern, thing_pool, place_pool)
_TRIVIA_FORMS = [
    ("{actor}在{place}买了{thing}", _BUY, _SHOP_PLACES),
    ("{actor}在{place}看到{thing}", _SEE, None),
    ("{actor}路过{place}，想起了{thing}", _RECALL, None),
    ("{actor}在{place}碰到了{thing}", _MEET, None),
    ("{actor}把{thing}落在了{place}", _LEAVE, None),
    ("{actor}在{place}尝到了{thing}", _EAT, _EAT_PLACES),
    ("{actor}在{place}整理{thing}", _TIDY, _TIDY_PLACES),
]
_SMALL_FORMS = [
    ("{actor}约你周末去{place}看{thing}", _SHOW, ["电影院", "体育馆", "美术馆"]),
    ("{actor}换了新的{thing}", _REPLACE, _NO_PLACE),
    ("{place}那家卖{thing}的店好像关门了", _SELL, _SHOP_PLACES),
    ("{actor}最近在忙{thing}", _BUSY, _NO_PLACE),
    ("你帮{actor}挑了个{thing}", _GIFT, _NO_PLACE),
]
_SHARE_FORMS = [
    ("{actor}跟你聊到很晚，说起了{thing}", _TOPIC, _NO_PLACE),
    ("{actor}今天情绪不太好，因为{thing}", _MOOD_REASON, _NO_PLACE),
    ("你和{actor}一起去了{place}，还聊到了{thing}", _TOPIC, None),
    ("{actor}分享了一件关于{thing}的事", _TOPIC, _NO_PLACE),
]
_UPSET_FORMS = [
    ("{actor}和你因为{thing}闹了点别扭", _FLARE, _NO_PLACE),
    ("{place}出了点状况，你有点担心{actor}", [None], ["公司", "健身房", "地铁站"]),
    ("{actor}遇到了麻烦，需要你搭把手", [None], _NO_PLACE),
]


def _slots(text: str) -> list[str]:
    seen: list[str] = []
    for name in re.findall(r"\{(\w+)\}", text):
        if name not in seen:
            seen.append(name)
    return seen


def build_cast(persona: dict | None = None, rng: random.Random | None = None,
               actors=None, places=None, premise: str = "") -> dict:
    """Build the cast. ``actors`` is a list of ``(name, role)`` pairs (or bare
    names); ``places`` a list of strings. Both override the defaults so a user
    worldview can replace the stock world."""
    rng = rng or random.Random(0)
    roster = list(actors) if actors else list(_NAMES)
    cast_actors = []
    for index, entry in enumerate(roster):
        if isinstance(entry, (list, tuple)):
            name = str(entry[0]).strip() if entry else ""
            role = str(entry[1]).strip() if len(entry) > 1 and entry[1] else "friend"
        else:
            name, role = str(entry).strip(), "friend"
        if not name:
            continue
        if role not in ("friend", "colleague", "family", "other"):
            role = "friend"
        cast_actors.append({
            "id": f"a{index}", "name": name, "role": role,
            "affinity": round(rng.uniform(0.45, 0.8), 3),
            "warmth": round(rng.uniform(0.4, 0.75), 3),
            "tension": round(rng.uniform(0.0, 0.15), 3),
            "recent": "最近没什么特别的事",
        })
    if not cast_actors:
        cast_actors = [
            {"id": f"a{i}", "name": name, "role": role,
             "affinity": round(rng.uniform(0.45, 0.8), 3),
             "warmth": round(rng.uniform(0.4, 0.75), 3),
             "tension": round(rng.uniform(0.0, 0.15), 3),
             "recent": "最近没什么特别的事"}
            for i, (name, role) in enumerate(_NAMES)
        ]
    place_list = [str(p).strip() for p in (places or _PLACES) if str(p).strip()]
    if len(place_list) < 3:
        place_list = list(_PLACES)
    plots = [{"id": f"p{i}", "title": title, "progress": progress, "tension": tension}
             for i, (title, progress, tension) in enumerate(_PLOTS)]
    return {"actors": cast_actors, "places": place_list, "plots": plots,
            "persona": str((persona or {}).get("name") or ""),
            "premise": str(premise or "").strip()}


def _emit(templates: list[dict], text: str, tier: str, rng: random.Random) -> None:
    if any(t["text"] == text for t in templates):
        return
    templates.append({
        "template_id": f"t{len(templates):04d}",
        "text": text,
        "tier": tier,
        "intensity": TIER_INTENSITY[tier],
        "slots": _slots(text),
        "persona_tags": [rng.choice(_TAGS)],
        "base_rate": round(1.0 + (2.0 if rng.random() < 0.05 else 0.0) + rng.uniform(-0.1, 0.1), 3),
    })


def _fill(templates: list[dict], pattern: str, things: list, places, tier: str,
          count: int, rng: random.Random, known_places: list[str]) -> int:
    """Emit up to ``count`` distinct sentences for one pattern, drawing only from
    the pools that fit it. Returns how many were added."""
    if places is None:
        pool = list(known_places)
    elif places == _NO_PLACE:
        pool = [None]
    else:
        pool = [p for p in places if p in known_places] or list(known_places[:4])
    combos = [(thing, place) for thing in things for place in pool]
    rng.shuffle(combos)
    made = 0
    for thing, place in combos:
        text = pattern.format(actor=_ACTOR, thing=thing, place=place)
        if any(t["text"] == text for t in templates):
            continue
        _emit(templates, text, tier, rng)
        made += 1
        if made >= count:
            break
    return made


def build_templates(rng: random.Random | None = None, places=None) -> list[dict]:
    rng = rng or random.Random(0)
    known = list(places) if places else list(_PLACES)
    templates: list[dict] = []
    for pattern, things, pools in _TRIVIA_FORMS:
        _fill(templates, pattern, things, pools, "trivia", 30, rng, known)
    for pattern, things, pools in _SMALL_FORMS:
        _fill(templates, pattern, things, pools, "small", 15, rng, known)
    for pattern, things, pools in _SHARE_FORMS:
        _fill(templates, pattern, things, pools, "shareable", 3, rng, known)
    for pattern, things, pools in _UPSET_FORMS:
        _fill(templates, pattern, things, pools, "upset", 1, rng, known)
    return templates


def review_assets(cast: dict, templates: list[dict], llm=None) -> dict:
    """Second pass: schema + duplicate review; optional LLM persona-fit review."""
    from sys import path as _path
    from pathlib import Path as _Path
    _path.insert(0, str(_Path(__file__).resolve().parents[1] / "src"))
    from .assets import validate_cast, validate_templates  # noqa: WPS433

    issues = validate_cast(cast) + validate_templates(templates)
    texts = [t["text"] for t in templates]
    if len(texts) != len(set(texts)):
        issues.append("duplicate template text")
    total = max(1, len(templates))
    result = {"issues": issues, "pass_rate": round(1.0 - len(issues) / total, 4), "total": total}
    if llm is not None:
        try:
            result["llm_review"] = llm(cast, templates)
        except Exception as error:  # pragma: no cover - optional path
            result["llm_review_error"] = str(error)
    return result


def generate(out_dir: Path | str = "world", persona: dict | None = None, seed: int = 0, llm=None,
             actors=None, places=None, premise: str = "") -> dict:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    rng = random.Random(seed)
    cast = build_cast(persona, rng, actors=actors, places=places, premise=premise)
    templates = build_templates(rng, places=cast["places"])
    review = review_assets(cast, templates, llm)
    (out / "cast.json").write_text(json.dumps(cast, ensure_ascii=False, indent=2), encoding="utf-8")
    with (out / "templates.jsonl").open("w", encoding="utf-8") as handle:
        for template in templates:
            handle.write(json.dumps(template, ensure_ascii=False) + "\n")
    report = {"cast": len(cast["actors"]), "templates": len(templates),
              "steps": dict((tier, sum(1 for t in templates if t["tier"] == tier)) for tier in TIER_TARGET),
              "review": review}
    (out / "assets_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    return report


def main() -> None:  # pragma: no cover - CLI
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="world")
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--premise", default="")
    # Default generation is deterministic and network-free; `--offline` makes
    # that explicit and blocks the optional LLM enricher.  Previously the flag
    # was `default=True` *and* a `store_true`, so it could never be turned off
    # and was never read — a dead switch.
    parser.add_argument("--offline", action="store_true",
                        help="Force deterministic generation; never load an LLM enricher.")
    parser.add_argument("--llm-module", default="",
                        help="Optional 'pkg.mod:callable' LLM enricher for review_assets(); ignored when --offline.")
    args = parser.parse_args()
    llm = None
    if not args.offline and args.llm_module:
        module_name, _, attribute = args.llm_module.partition(":")
        llm = getattr(importlib.import_module(module_name), attribute)
    report = generate(args.out, seed=args.seed, premise=args.premise, llm=llm)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":  # pragma: no cover
    main()
