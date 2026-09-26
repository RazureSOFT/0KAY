"""Grounded daily diary & dream generation.

Mirrors the reference companion's ``dreaming.py`` discipline: every durable fact
carries a level so that a plan or a simulation can never be narrated as a lived
experience. Output is validated for grounding/quality/duplication and rewritten
at most once before it is persisted.
"""

from __future__ import annotations

import re
from difflib import SequenceMatcher
from typing import Any, Awaitable, Callable

Complete = Callable[[str], Awaitable[str]]

COMPLETION_MARKERS = (
    "完成", "做完", "做好", "整理好", "收拾好", "写完", "看完", "读完",
    "做完", "去了", "出门了", "散了", "结束了", "吃过", "睡了",
)
INTERNAL_MARKERS = (
    "系统", "模型", "提示词", "json", "planned", "confirmed", "status",
    "字段", "证据", "ledger", "evidence", "运行推演", "日程字段", "指标",
)
DREAM_ABSTRACT_MARKERS = (
    "状态", "情绪", "心情", "感觉", "余韵", "碎片", "生活感", "日程",
    "计划", "总结", "用户", "主动", "消息", "回复", "关系", "陪伴",
)

LEDGER_LABELS = {
    "confirmed": "已确认发生",
    "planned": "计划，可能尚未发生",
    "state": "状态底色，不是事件",
}


def _compact(text: Any, limit: int = 900) -> str:
    return "".join(ch.lower() for ch in str(text or "") if "\u4e00" <= ch <= "\u9fff" or ch.isalnum())[:limit]


def _clean(text: Any, limit: int = 4000) -> str:
    value = str(text or "").strip().strip('"').strip()
    value = re.sub(r"^```[a-zA-Z]*\s*|\s*```$", "", value).strip()
    return value[:limit]


# --------------------------------------------------------------------------
# Evidence ledger
# --------------------------------------------------------------------------
def build_ledger(
    *,
    agenda: list[dict[str, Any]],
    interactions: list[dict[str, Any]],
    memories: list[str],
    body_phrase: str,
    emotion_phrase: str,
    day: str,
) -> tuple[str, list[dict[str, str]]]:
    """Return (rendered ledger, entries) with a level on every fact."""
    entries: list[dict[str, str]] = []
    for item in agenda or []:
        title = str(item.get("title") or "").strip()
        if not title:
            continue
        start = str(item.get("start_at") or "").replace("T", " ")
        clock = start[11:16] if len(start) >= 16 else ""
        status = str(item.get("status") or "")
        level = "confirmed" if status == "completed" else "planned"
        source = "日程（已发生）" if level == "confirmed" else "日程（计划，未必发生）"
        entries.append({"level": level, "source": source, "text": f"{clock} {title}".strip()})
    for event in interactions or []:
        who = str(event.get("user_id") or "某人")
        key = str(event.get("event_key") or "互动")
        entries.append({"level": "confirmed", "source": "互动", "text": f"{who} {key}"})
    for memory in memories or []:
        text = str(memory or "").strip()
        if text:
            entries.append({"level": "confirmed", "source": "记忆", "text": text[:80]})
    entries.append({"level": "state", "source": "状态", "text": f"{body_phrase}；{emotion_phrase}"})
    lines = [f"- [{LEDGER_LABELS.get(e['level'], e['level'])}] {e['source']}：{e['text']}" for e in entries]
    return "\n".join(lines), entries


# --------------------------------------------------------------------------
# Quality / duplication
# --------------------------------------------------------------------------
def journal_similarity(body: str, recent_texts: list[str]) -> float:
    current = _compact(body)
    if len(current) < 8:
        return 0.0
    best = 0.0
    for prior in recent_texts or []:
        other = _compact(prior)
        if len(other) < 8:
            continue
        best = max(best, SequenceMatcher(None, current, other).ratio())
    return best


def _bigrams(text: str) -> set[str]:
    compact = re.sub(r"[^\u4e00-\u9fffA-Za-z0-9]", "", text)
    return {compact[i:i + 2] for i in range(max(0, len(compact) - 1))}


def planned_written_as_done(body: str, entries: list[dict[str, str]]) -> bool:
    """True if a planned item is asserted as completed (verb/object near a done-marker)."""
    for entry in entries:
        if entry.get("level") != "planned":
            continue
        title = re.sub(r"^\d{1,2}:\d{2}\s*", "", entry.get("text", "")).strip()
        if not title:
            continue
        tokens = _bigrams(title)
        for marker in COMPLETION_MARKERS:
            start = 0
            while True:
                index = body.find(marker, start)
                if index < 0:
                    break
                window = body[max(0, index - 12): index + 12]
                if len(tokens & _bigrams(window)) >= 2:
                    return True
                start = index + len(marker)
    return False


def quality_issues(
    body: str,
    entries: list[dict[str, str]],
    recent_texts: list[str],
    min_chars: int,
    max_chars: int,
) -> list[str]:
    issues: list[str] = []
    if not body:
        return ["正文为空"]
    length = len(re.sub(r"\s+", "", body))
    if length < max(28, min_chars // 2):
        issues.append("正文过短，没有形成有效记录")
    if length > max_chars + 120:
        issues.append("正文明显超出篇幅")
    if any(marker in body for marker in INTERNAL_MARKERS):
        issues.append("正文泄露后台术语或指标")
    if planned_written_as_done(body, entries):
        issues.append("把未确认的计划写成了已经完成的经历")
    if journal_similarity(body, recent_texts) >= 0.55:
        issues.append("与近期日记过于相似")
    return issues


# --------------------------------------------------------------------------
# Journal
# --------------------------------------------------------------------------
def journal_prompt(
    *,
    day: str,
    time_text: str,
    ledger_text: str,
    recent_texts: list[str],
    min_chars: int,
    max_chars: int,
    environment_text: str = "",
) -> str:
    avoid = "\n".join(f"- {_compact(t, 90)}" for t in (recent_texts or [])[:3]) or "（暂无）"
    env_line = f"环境：{environment_text}\n" if environment_text else ""
    return (
        f"你是 L.I.F.E 的内心独白作者。请以第一人称写 {day} 这一天的日记（{min_chars}~{max_chars} 字）。\n"
        "只能写「今天的事实」里真实发生的事；标为“计划”的事项尚未确认发生，最多写成打算或略过，绝不能写成已经做完。\n"
        "至少具体提到两件真实的事项或互动，口语化、有时间感，不要空泛抒情，不要编造未发生的事。\n"
        f"现在是 {time_text}。{env_line}\n今天的事实：\n{ledger_text}\n\n"
        f"最近三天已写过的日记（避免重复，只作避重参考）：\n{avoid}\n\n"
        "只输出日记正文，不要标题，不要出现任何数字指标、字段名或后台术语。"
    )


def journal_rewrite_prompt(
    *,
    body: str,
    issues: list[str],
    ledger_text: str,
    min_chars: int,
    max_chars: int,
) -> str:
    return (
        "请修订下面这篇私人日记，只改一次。保留第一人称质感和真实细节，只纠正无依据的完成叙述。\n"
        f"需要纠正的问题：{'；'.join(issues)}\n"
        "只有标为“已确认发生”的才能写成今天真实做过；计划最多写成打算；不要补写没有来源的场景。\n"
        f"篇幅 {min_chars}~{max_chars} 字，材料少时可以更短。\n\n"
        f"今天的事实：\n{ledger_text}\n\n原稿：\n{body}\n\n只输出修订后的正文。"
    )


async def generate_journal(
    complete: Complete,
    *,
    day: str,
    time_text: str,
    ledger_text: str,
    entries: list[dict[str, str]],
    recent_texts: list[str],
    min_chars: int = 120,
    max_chars: int = 220,
    environment_text: str = "",
) -> str:
    body = _clean(await complete(journal_prompt(
        day=day, time_text=time_text, ledger_text=ledger_text,
        recent_texts=recent_texts, min_chars=min_chars, max_chars=max_chars,
        environment_text=environment_text,
    )))
    if not body:
        return ""
    issues = quality_issues(body, entries, recent_texts, min_chars, max_chars)
    if issues:
        revised = _clean(await complete(journal_rewrite_prompt(
            body=body, issues=issues, ledger_text=ledger_text,
            min_chars=min_chars, max_chars=max_chars,
        )))
        if revised:
            body = revised
    return body


# --------------------------------------------------------------------------
# Dream
# --------------------------------------------------------------------------
DREAM_THEMES = {
    "温柔日常": "梦像从白天的普通片段里渗出来，柔软、安静、带一点生活气。",
    "奇幻": "现实里的东西轻轻偏离常理，带一点不合逻辑的发光或变形。",
    "追逐": "一直在赶什么、找什么、错过什么，醒来会残留一点慌。",
    "悬疑": "细节像有答案却总差一点，梦里反复回头、确认、怀疑。",
    "荒诞": "东西莫名接到一起，逻辑松掉，带一点好笑又奇怪的偏移。",
    "怀旧": "把旧场景、旧物件、旧关系轻轻翻出来，但不一定讲得明白。",
}


def dream_prompt(
    *,
    theme_name: str,
    theme_hint: str,
    context_text: str,
    fragments: list[str],
    min_chars: int,
    max_chars: int,
) -> str:
    fragment_block = "\n".join(f"- {f}" for f in (fragments or [])[:8]) or "（只剩一点断续的画面）"
    return (
        f"你是 L.I.F.E 的梦境生成器。请以第一人称写一个今早残留的梦（{min_chars}~{max_chars} 字）。\n"
        f"主题：{theme_name}——{theme_hint}\n"
        "可以跳接、荒诞、前后不完全合逻辑，但要摸得到一条梦里的情绪线，并且能从具体生活碎片里长出来，"
        "不要写成日程、日记、设定说明或宏大奇幻简介，不要解释。\n"
        f"可用碎片：\n{fragment_block}\n\n当前状态：{context_text}\n\n只输出梦境正文。"
    )


async def generate_dream(
    complete: Complete,
    *,
    theme_name: str,
    theme_hint: str,
    context_text: str,
    fragments: list[str],
    recent_texts: list[str],
    min_chars: int = 80,
    max_chars: int = 160,
) -> str:
    body = _clean(await complete(dream_prompt(
        theme_name=theme_name, theme_hint=theme_hint, context_text=context_text,
        fragments=fragments, min_chars=min_chars, max_chars=max_chars,
    )))
    if not body:
        return ""
    # Dreams are abstract by design, so only block obvious ground-truth leakage
    # and near-duplicates rather than enforcing the diary's factual ledger.
    if any(marker in body for marker in INTERNAL_MARKERS) or journal_similarity(body, recent_texts) >= 0.7:
        revised = _clean(await complete(dream_prompt(
            theme_name=theme_name, theme_hint=theme_hint, context_text=context_text,
            fragments=fragments, min_chars=min_chars, max_chars=max_chars,
        ) + "\n注意：换一批意象，不要与最近的梦重复，不要出现后台术语。"))
        if revised:
            body = revised
    return body
