"""The slash-command table.

Declared as data so the palette, `Tab` completion and `/help` all read from one
place; the app only implements `run()`, so a new command is one row here plus
one branch there.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Command:
    name: str
    description: str
    argument: str = ""
    aliases: tuple[str, ...] = ()


@dataclass(frozen=True)
class Suggestion:
    """One palette row, whatever it completes to.

    Commands and paths share the widget; `kind` decides what Enter does.
    """
    name: str                 # as shown: "/plugins", "kit/app.py/"
    description: str = ""
    value: str = ""           # text inserted by completion
    kind: str = "command"     # command | file
    argument: str = ""


COMMANDS: tuple[Command, ...] = (
    Command("new", "Start a new agent session", aliases=("clear", "reset")),
    Command("resume", "Continue an earlier session: /resume picks one",
            aliases=("sessions",)),
    Command("session", "Show which agent session this conversation is"),
    Command("fork", "Copy this conversation and continue in the copy"),
    Command("agent", "Which agent runs the turn: /agent picks, /agent auto resets"),
    Command("export", "Save the conversation as markdown", "[file]"),
    Command("paste", "Put the clipboard's picture into the draft"),
    Command("todo", "The agent's task list", aliases=("todos",)),
    Command("settings", "Browse and edit the WebUI settings: /settings [section]",
            "[section]"),
    Command("notify", "Task-complete notifications: unfocused, always, or off"),
    Command("permission", "Permission mode: /permission picks, or 'full' for full access",
            "[normal|full]"),
    Command("intensity", "Thinking effort: off, low, medium, high, max"),
    Command("approvals", "Tools waiting for your approval (enter allows, d denies)"),
    Command("questions", "Questions the agent is waiting on"),
    Command("answer", "Answer a pending question: /answer <n> <text>", "<n> <text>"),
    Command("plugins", "Registered plugins, phase and heartbeat", aliases=("p",)),
    Command("tasks", "Recent tasks with progress", aliases=("t",)),
    Command("usage", "Token usage by day and model", aliases=("u",)),
    Command("model", "Switch model: /model picks, /model <id|prefix> switches"),
    Command("models", "Available models and the active one", aliases=("m", "ls")),
    Command("reconnect", "Restart one plugin by name", "<plugin>"),
    Command("health", "Probe the gateway"),
    Command("lang", "Interface language: /lang zh or /lang en", "zh|en"),
    Command("theme", "Repaint for light, dark or a 16-colour terminal",
            "[light|dark|ansi]"),
    Command("help", "Keys, commands and what the status line means", aliases=("?",)),
    Command("quit", "Leave the client", aliases=("q", "exit")),
)

_BY_NAME: dict[str, Command] = {}
for _command in COMMANDS:
    _BY_NAME[_command.name] = _command
    for _alias in _command.aliases:
        _BY_NAME[_alias] = _command


def resolve(word: str) -> Command | None:
    return _BY_NAME.get(word.lstrip("/").lower())


def matching(typed: str) -> list[Command]:
    """Commands whose name starts with what has been typed after the slash.

    An exact name wins the first row: typing `/help` and reading `/health`
    highlighted above it is the kind of thing that makes Enter feel wrong.
    Everything else keeps table order so the list does not reshuffle mid-typing.
    """
    needle = typed.lstrip("/").lower()
    if not needle:
        return list(COMMANDS)
    if " " in needle:
        return []
    head = needle.split(" ")[0]
    hits = [c for c in COMMANDS if c.name.startswith(head)]
    for command in COMMANDS:
        if command in hits:
            continue
        if any(alias.startswith(head) for alias in command.aliases):
            hits.append(command)
    exact = _BY_NAME.get(head)
    if exact is not None and exact in hits:
        hits.remove(exact)
        hits.insert(0, exact)
    return hits
