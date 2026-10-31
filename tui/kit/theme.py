"""Colour roles and the two palettes they resolve from.

Roles exist instead of raw colour names so a widget never has to know whether
the terminal is light or dark. Both palettes keep the same contrast structure: the brand violet carries focus
and interaction, body text stays neutral, and the semantic states keep the
WebUI's own success / warning / error hues.

`ansi` is the 16-colour fallback for terminals without truecolor.
"""

from __future__ import annotations

import os

from .ansi import Colour

# Taken from the WebUI palette (webui/src/styles/theme.css): MD3 violet, one
# light scheme. The WebUI has no dark scheme, so the dark set here is built
# from the same MD3 tokens in inverse -- --md-inverse-primary, --md-inverse-on-
# surface and friends are exactly the dark counterpart of a light MD3 scheme,
# which is why the two views look like the same product.
DARK = {
    "accent": "#d0bcff",
    "accentSoft": "#e6deff",
    "text": "#f5eff7",
    "strong": "#ffffff",
    "muted": "#cac4d0",
    "subtle": "#938f99",
    "border": "#4a4458",
    "borderFocus": "#d0bcff",
    "success": "#8ed6a8",
    "error": "#ffb4ab",
    "warning": "#ffdf9e",
    "plan": "#b6c7b7",
    "user": "#e6deff",
    "think": "#a8a1b8",
    "toolRead": "#8ecfe0",
    "toolWrite": "#c9b6f0",
    "toolExec": "#8ed6a8",
    "toolWeb": "#d0bcff",
    "toolTask": "#efb0c6",
    "ctxPrompt": "#d0bcff",
    "ctxAssistant": "#e6deff",
    "ctxThinking": "#efb0c6",
    "ctxTools": "#8ed6a8",
    "ctxEmpty": "#3b3547",
}

LIGHT = {
    "accent": "#5944c6",
    "accentSoft": "#7a63d8",
    "text": "#211d2a",
    "strong": "#141218",
    "muted": "#60596d",
    "subtle": "#83798f",
    "border": "#d8d0e3",
    "borderFocus": "#5944c6",
    "success": "#27633e",
    "error": "#b3261e",
    "warning": "#7a5900",
    "plan": "#536255",
    "user": "#4a38ad",
    "think": "#8a8399",
    "toolRead": "#2f6f95",
    "toolWrite": "#6a4fa8",
    "toolExec": "#27633e",
    "toolWeb": "#5944c6",
    "toolTask": "#9b405e",
    "ctxPrompt": "#5944c6",
    "ctxAssistant": "#7a63d8",
    "ctxThinking": "#9b405e",
    "ctxTools": "#27633e",
    "ctxEmpty": "#ddd6e8",
}

ANSI = {
    "accent": "ansi:blue",
    "accentSoft": "ansi:brightblue",
    "text": "ansi:white",
    "strong": "ansi:brightwhite",
    "muted": "ansi:brightblack",
    "subtle": "ansi:black",
    "border": "ansi:brightblack",
    "borderFocus": "ansi:brightblue",
    "success": "ansi:green",
    "error": "ansi:red",
    "warning": "ansi:yellow",
    "plan": "ansi:green",
    "user": "ansi:brightblue",
    "think": "ansi:brightblack",
    "toolRead": "ansi:cyan",
    "toolWrite": "ansi:magenta",
    "toolExec": "ansi:green",
    "toolWeb": "ansi:blue",
    "toolTask": "ansi:magenta",
    "ctxPrompt": "ansi:blue",
    "ctxAssistant": "ansi:brightblue",
    "ctxThinking": "ansi:magenta",
    "ctxTools": "ansi:green",
    "ctxEmpty": "ansi:black",
}


class Theme:
    """A palette plus the capability used to emit it."""

    def __init__(self, name: str, palette: dict, colour: Colour):
        self.name = name
        self._palette = palette
        self.colour = colour

    def __getitem__(self, role: str) -> str:
        return self._palette.get(role, self._palette.get("text", ""))

    def get(self, role: str, fallback: str = "") -> str:
        return self._palette.get(role, fallback)

    def style(self, role: str = "text", **flags):
        from .ansi import Style
        return Style(fg=self[role], **flags)


def _env_background() -> str:
    """Light or dark, from the environment only.

    A terminal can be asked (OSC 11), but the reply arrives on the same channel
    as keystrokes and a terminal that ignores the question eats the first thing
    the user types. An environment hint is free and wrong guesses only cost a
    palette, so that is what we read.
    """
    fg_bg = os.environ.get("COLORFGBG", "")
    if fg_bg:
        try:
            background = int(fg_bg.split(";")[-1])
            return "light" if background in (7, 15) or background >= 9 else "dark"
        except ValueError:
            pass
    hint = os.environ.get("TERM_BACKGROUND", "").lower()
    if hint in ("light", "dark"):
        return hint
    if os.environ.get("TERM_PROGRAM", "").lower() == "apple_terminal":
        return "light"
    return "dark"


def detect_colour() -> str:
    """truecolor / 256 / 16 / none, from TERM and the common hints."""
    if os.environ.get("NO_COLOR"):
        return "none"
    if os.environ.get("FORCE_COLOR"):
        return "truecolor"
    if os.environ.get("COLORTERM", "").lower() in ("truecolor", "24bit"):
        return "truecolor"
    if os.environ.get("WT_SESSION") or os.environ.get("TERM_PROGRAM") in (
        "vscode", "iTerm.app", "WezTerm", "kitty",
    ):
        return "truecolor"
    term = os.environ.get("TERM", "")
    if "256color" in term:
        return "256"
    if term in ("", "dumb") and os.name != "nt":
        return "none"
    return "16"


def build(name: str = "auto", colour_mode: str = "") -> Theme:
    """`name` is auto | light | dark | ansi."""
    if name == "auto":
        name = _env_background()
    if name == "ansi":
        palette, mode = ANSI, "16"
    elif name == "light":
        palette, mode = LIGHT, "truecolor"
    else:
        palette, mode = DARK, "truecolor"
    if colour_mode == "none":
        mode = "none"
    elif colour_mode in ("16", "256", "truecolor"):
        mode = colour_mode
    return Theme(name, palette, Colour(mode))
