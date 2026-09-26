"""Minimal localization for user-facing LIFE strings (zh-CN / en-US)."""

from __future__ import annotations

DEFAULT_LOCALE = "zh-CN"
SUPPORTED = ("zh-CN", "en-US")

MESSAGES: dict[str, dict[str, str]] = {
    "zh-CN": {
        "diag.integrity": "数据库完整性",
        "diag.pending_candidates": "待确认日程",
        "diag.pending_expressions": "待审表达",
        "diag.pending_proactive": "待投递主动",
        "diag.recent_audit": "最近审计",
        "diag.timeline": "自我时间线",
        "diag.detail_count": "{count} 条",
        "diag.none": "暂无",
        "agent.sleeping": "正在睡觉",
        "agent.woke": "被叫醒了",
        "agent.quiet": "免打扰",
    },
    "en-US": {
        "diag.integrity": "Database integrity",
        "diag.pending_candidates": "Pending schedule",
        "diag.pending_expressions": "Expressions to review",
        "diag.pending_proactive": "Outreach to deliver",
        "diag.recent_audit": "Latest audit",
        "diag.timeline": "Self timeline",
        "diag.detail_count": "{count} items",
        "diag.none": "none",
        "agent.sleeping": "sleeping",
        "agent.woke": "woken up",
        "agent.quiet": "quiet hours",
    },
}


def normalize(locale: str | None) -> str:
    return locale if locale in MESSAGES else DEFAULT_LOCALE


def translate(key: str, locale: str | None = DEFAULT_LOCALE, **kwargs) -> str:
    table = MESSAGES[normalize(locale)]
    text = table.get(key) or MESSAGES[DEFAULT_LOCALE].get(key, key)
    try:
        return text.format(**kwargs)
    except (KeyError, IndexError):
        return text
