"""Two languages for the interface.

Keys are stable identifiers, not the English text, so a wording change does not
silently lose its translation. A missing key falls back to English and then to
the key itself: a half-translated build shows English, never blanks.
"""

from __future__ import annotations

LANGS = ("en", "zh")
_current = "en"

EN = {
    "hint.keys": ("? help · ↑↓ history · tab complete · shift+enter newline · "
                  "ctrl+b panel · ctrl+o unfold · ctrl+c interrupt · ctrl+d quit"),
    "hint.busy": ("enter steers (interrupts and sends) · tab queues · "
                  "ctrl+c interrupt · esc scrolls"),
    "hint.editor": ("draft editor · enter adds a line · f2 or esc returns to the chat · "
                    "alt+←/→ by word"),
    "status.ready": "ready",
    "status.working": "working",
    "status.thinking": "thinking",
    "status.ctx": "ctx",
    "status.back": "back",
    "status.queued": "queued",
    "status.full_access": "full access",
    "status.no_agent": "no agent",
    "status.approvals": "approvals",
    "status.approval": "approval",
    "status.questions": "questions",
    "status.question": "question",
    "prompt.placeholder": "Ask 0KAY, or type / for commands",
    "prompt.answer": "answer",
    "prompt.value": "new value for",
    "help.title": "keys",
    "help.commands": "commands",
    "panel.settings": "settings",
    "panel.sessions": "sessions",
    "panel.agent": "agent",
    "panel.permission": "permission",
    "panel.effort": "thinking effort",
    "panel.notify": "notifications",
    "panel.usage": "usage",
    "panel.todos": "todos",
    "panel.question": "question",
    "panel.approvals": "approvals",
    "panel.model": "switch model",
    "panel.language": "language",
    "panel.theme": "theme",
    "panel.plugins": "plugins",
    "panel.tasks": "tasks",
    "side.context": "context",
    "side.usage": "usage",
    "side.todos": "todos",
    "side.git": "git",
    "side.live": "live",
    "side.this_turn": "this turn",
    "side.ledger": "ledger",
    "side.cache": "cache",
    "side.cost": "cost",
    "side.agent": "agent",
    "side.model": "model",
    "side.effort": "effort",
    "side.permission": "permission",
    "side.queued": "queued",
    "side.compacts_at": "compacts at",
    "side.compact": "compact",
    "notice.no_agent": "no agent registered · start one, or /agent after it connects",
    "notice.agent_offline": "no agent online · the gateway has nowhere to run the turn",
    "notice.steering": "steering · interrupting this turn to send yours",
    "notice.queued": "queued · {count} waiting · sent when this turn ends",
    "notice.effort": "effort → {glyph} {level} · {hint}",
    "notice.permission_full": "permission → full access · tools run without asking",
    "notice.permission_normal": "permission → normal · sensitive tools will ask",
    "notice.full_access_start": "starting with full access · tools will not ask",
    "notice.exported": "exported · {path}",
    "notice.nothing_to_export": "nothing to export yet",
    "notice.resumed": "resumed {session} · {turns} turns",
    "notice.forked": "forked {session} · {turns} turns",
    "notice.language": "language → {lang}",
    "notice.side_on": "side panel on · ctrl+b hides it",
    "notice.side_off": "side panel off",
    "notice.pasted": "pasted {lines} lines · {chars} characters · enter sends",
    "notice.pasted_image": "picture pasted · {name}",
    "notice.no_image": "no picture on the clipboard · ctrl+v needs an image",
    "notice.attached": "{count} picture(s) sent to the model",
    "notice.upload_failed": "could not attach {name} · {reason}",
    "notice.interrupt": "interrupting…",
    "cmd.new": "Start a new agent session",
    "cmd.resume": "Continue an earlier session: /resume picks one",
    "cmd.session": "Show which agent session this conversation is",
    "cmd.fork": "Copy this conversation and continue in the copy",
    "cmd.agent": "Which agent runs the turn: /agent picks, /agent auto resets",
    "cmd.export": "Save the conversation as markdown",
    "cmd.paste": "Put the clipboard's picture into the draft",
    "cmd.todo": "The agent's task list",
    "cmd.settings": "Browse and edit the WebUI settings: /settings [section]",
    "cmd.notify": "Task-complete notifications: unfocused, always, or off",
    "cmd.permission": "Ask before sensitive tools, or full access",
    "cmd.intensity": "Thinking effort: off, low, medium, high, max",
    "cmd.approvals": "Review pending tool approvals",
    "cmd.questions": "See what the agent is asking",
    "cmd.answer": "Answer a pending question",
    "cmd.plugins": "List the plugins the gateway knows",
    "cmd.tasks": "Inspect the task tree",
    "cmd.usage": "Tokens, cache hits and cost",
    "cmd.model": "Switch the model for the next turn",
    "cmd.models": "List the models the gateway offers",
    "cmd.reconnect": "Ask a plugin to reconnect",
    "cmd.health": "Check the gateway",
    "cmd.theme": "Switch between light, dark and ansi",
    "cmd.lang": "Interface language: /lang zh or /lang en",
    "cmd.help": "Show keys and commands",
    "cmd.quit": "Leave",
}

ZH = {
    "hint.keys": ("? 帮助 · ↑↓ 历史 · tab 补全 · shift+enter 换行 · ctrl+b 侧栏 · "
                  "ctrl+o 展开 · ctrl+c 中断 · ctrl+d 退出"),
    "hint.busy": ("enter 插话（中断后重发）· tab 排队 · ctrl+c 中断 · esc 滚动"),
    "hint.editor": ("草稿编辑器 · enter 换行 · f2 或 esc 回到对话 · alt+←/→ 按词移动"),
    "status.ready": "就绪",
    "status.working": "运行中",
    "status.thinking": "思考中",
    "status.ctx": "上下文",
    "status.back": "上方",
    "status.queued": "排队",
    "status.full_access": "全权限",
    "status.no_agent": "无 agent",
    "status.approvals": "待审批",
    "status.approval": "待审批",
    "status.questions": "待回答",
    "status.question": "待回答",
    "prompt.placeholder": "对 0KAY 说点什么，或输入 / 看命令",
    "prompt.answer": "回答",
    "prompt.value": "新值",
    "help.title": "按键",
    "help.commands": "命令",
    "panel.settings": "设置",
    "panel.sessions": "会话",
    "panel.agent": "agent",
    "panel.permission": "权限",
    "panel.effort": "思考强度",
    "panel.notify": "通知",
    "panel.usage": "用量",
    "panel.todos": "任务",
    "panel.question": "提问",
    "panel.approvals": "审批",
    "panel.model": "切换模型",
    "panel.language": "语言",
    "panel.theme": "主题",
    "panel.plugins": "插件",
    "panel.tasks": "任务",
    "side.context": "上下文",
    "side.usage": "用量",
    "side.todos": "任务",
    "side.git": "git",
    "side.live": "状态",
    "side.this_turn": "本轮",
    "side.ledger": "累计",
    "side.cache": "缓存",
    "side.cost": "花费",
    "side.agent": "agent",
    "side.model": "模型",
    "side.effort": "强度",
    "side.permission": "权限",
    "side.queued": "排队",
    "side.compacts_at": "压缩阈值",
    "side.compact": "压缩",
    "notice.no_agent": "没有已注册的 agent · 先启动一个，连上后用 /agent 选择",
    "notice.agent_offline": "没有在线的 agent · 网关无处执行这一轮",
    "notice.steering": "正在插话 · 中断本轮并发送你的输入",
    "notice.queued": "已排队 · 还有 {count} 条 · 本轮结束后自动发送",
    "notice.effort": "强度 → {glyph} {level} · {hint}",
    "notice.permission_full": "权限 → 全权限 · 工具不再询问",
    "notice.permission_normal": "权限 → 普通 · 敏感工具会先询问",
    "notice.full_access_start": "以全权限启动 · 工具不再询问",
    "notice.exported": "已导出 · {path}",
    "notice.nothing_to_export": "还没有可导出的内容",
    "notice.resumed": "已恢复 {session} · {turns} 轮",
    "notice.forked": "已派生 {session} · {turns} 轮",
    "notice.language": "语言 → {lang}",
    "notice.side_on": "侧栏已打开 · ctrl+b 收起",
    "notice.side_off": "侧栏已收起",
    "notice.pasted": "已粘贴 {lines} 行 · {chars} 字符 · enter 发送",
    "notice.pasted_image": "已粘贴图片 · {name}",
    "notice.no_image": "剪贴板里没有图片 · ctrl+v 需要一张图",
    "notice.attached": "已把 {count} 张图片发给模型",
    "notice.upload_failed": "附加 {name} 失败 · {reason}",
    "notice.interrupt": "正在中断…",
    "cmd.new": "开一个新会话",
    "cmd.resume": "继续之前的会话：/resume 选择",
    "cmd.session": "显示当前会话",
    "cmd.fork": "复制当前对话并在副本里继续",
    "cmd.agent": "选择哪台机器执行：/agent 选择，/agent auto 重置",
    "cmd.export": "把对话导出成 markdown",
    "cmd.paste": "把剪贴板里的图片放进草稿",
    "cmd.todo": "agent 的任务清单",
    "cmd.settings": "浏览并修改网页端的设置：/settings [段]",
    "cmd.notify": "完成通知：后台时、总是、关闭",
    "cmd.permission": "敏感工具前询问，或全权限",
    "cmd.intensity": "思考强度：off、low、medium、high、max",
    "cmd.approvals": "查看待审批的工具调用",
    "cmd.questions": "看 agent 在问什么",
    "cmd.answer": "回答一个待回复的问题",
    "cmd.plugins": "列出网关已知的插件",
    "cmd.tasks": "查看任务树",
    "cmd.usage": "token、缓存命中与花费",
    "cmd.model": "切换下一轮使用的模型",
    "cmd.models": "列出网关提供的模型",
    "cmd.reconnect": "让某个插件重连",
    "cmd.health": "检查网关",
    "cmd.theme": "切换浅色、深色、ansi",
    "cmd.lang": "界面语言：/lang zh 或 /lang en",
    "cmd.help": "显示按键与命令",
    "cmd.quit": "退出",
}

_TABLES = {"en": EN, "zh": ZH}


def set_language(lang: str) -> str:
    """Switch the table. Unknown values keep the current language."""
    global _current
    if lang in LANGS:
        _current = lang
    return _current


def language() -> str:
    return _current


def has(key: str) -> bool:
    """Whether a translation exists, so callers can keep their own default."""
    return key in _TABLES.get(_current, EN) or key in EN


def t(key: str, **values) -> str:
    """The text for `key` in the current language.

    Falls back to English, then to the key: a missing translation must never
    produce an empty line where a label should be.
    """
    table = _TABLES.get(_current, EN)
    text = table.get(key) or EN.get(key) or key
    if values:
        try:
            return text.format(**values)
        except (KeyError, IndexError):
            return text
    return text
