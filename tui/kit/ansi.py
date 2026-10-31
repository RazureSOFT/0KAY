"""Text measurement, wrapping and SGR emission.

The renderer never puts escape codes inside a string it still needs to measure:
a cell is sized from the plain character, and colour is attached as a `Style`
alongside it. That keeps truncation and padding exact even for CJK text, which
is the one thing that silently breaks every hand-rolled terminal layout.
"""

from __future__ import annotations

import re
import unicodedata

RESET = "\x1b[0m"

# East Asian Wide / Fullwidth plus the emoji blocks. Terminals are not
# consistent about all of these, but treating them as two columns matches every
# mainstream terminal on Windows Terminal, iTerm2, WezTerm and kitty.
_WIDE_RANGES = (
    (0x1100, 0x115F), (0x2E80, 0x303E), (0x3041, 0x33FF),
    (0x3400, 0x4DBF), (0x4E00, 0x9FFF), (0xA000, 0xA4CF),
    (0xA960, 0xA97F), (0xAC00, 0xD7A3), (0xF900, 0xFAFF),
    (0xFE10, 0xFE19), (0xFE30, 0xFE6F), (0xFF00, 0xFF60),
    (0xFFE0, 0xFFE6), (0x1F004, 0x1F004), (0x1F0CF, 0x1F0CF),
    (0x1F300, 0x1F64F), (0x1F680, 0x1F6FF), (0x1F900, 0x1F9FF),
    (0x1FA70, 0x1FAFF), (0x20000, 0x2FFFD), (0x30000, 0x3FFFD),
)

_ANSI_RE = re.compile(r"\x1b\[[0-9;?]*[ -/]*[@-~]")


def char_width(ch: str) -> int:
    """Columns one character occupies."""
    if ch == "":
        return 0
    code = ord(ch)
    if code == 0:
        return 0
    if code < 32 or code == 0x7F:
        return 0
    if code < 0x1100:
        return 1
    if unicodedata.combining(ch) or unicodedata.category(ch) in ("Mn", "Me", "Cf"):
        return 0
    for low, high in _WIDE_RANGES:
        if low <= code <= high:
            # Variation selectors and zero-width joiners live inside the emoji
            # ranges but take no space.
            return 2 if unicodedata.east_asian_width(ch) in ("W", "F") or code >= 0x1F000 else 1
    return 1


def display_width(text: str) -> int:
    """Columns a plain string occupies. Escape sequences are ignored."""
    if not text:
        return 0
    if "\x1b" in text:
        text = _ANSI_RE.sub("", text)
    return sum(char_width(ch) for ch in text)


def truncate(text: str, width: int, ellipsis: str = "…") -> str:
    """Cut to `width` columns, marking the cut."""
    if width <= 0:
        return ""
    if display_width(text) <= width:
        return text
    budget = width - display_width(ellipsis)
    out = []
    used = 0
    for ch in text:
        step = char_width(ch)
        if used + step > budget:
            break
        out.append(ch)
        used += step
    return "".join(out) + ellipsis


def pad(text: str, width: int, align: str = "left") -> str:
    """Pad to exactly `width` columns (never truncates)."""
    gap = width - display_width(text)
    if gap <= 0:
        return text
    if align == "right":
        return " " * gap + text
    if align == "center":
        left = gap // 2
        return " " * left + text + " " * (gap - left)
    return text + " " * gap


def wrap(text: str, width: int, indent: str = "") -> list[str]:
    """Word-wrap to `width` columns, breaking tokens that cannot fit."""
    if width <= 0:
        return [""]
    lines: list[str] = []
    for paragraph in text.split("\n"):
        if not paragraph.strip():
            lines.append("")
            continue
        line = ""
        for word in paragraph.split(" "):
            candidate = word if not line else line + " " + word
            if display_width(candidate) <= width:
                line = candidate
                continue
            if line:
                lines.append(line)
            # A single word longer than the line has to be sliced.
            while display_width(word) > width:
                cut = []
                used = 0
                for ch in word:
                    if used + char_width(ch) > width:
                        break
                    cut.append(ch)
                    used += char_width(ch)
                lines.append("".join(cut))
                word = word[len(cut):]
            line = word
        lines.append(line)
    return lines or [""]


def _cut_columns(text: str, width: int) -> tuple[str, str]:
    """Split off the longest prefix that fits, keeping display columns exact."""
    taken = 0
    index = 0
    for ch in text:
        step = char_width(ch)
        if taken + step > width:
            break
        taken += step
        index += 1
    if index == 0 and text:
        index = 1          # a single wide glyph still has to advance
    return text[:index], text[index:]


def _trim_end(spans: list[tuple[str, Style]]) -> list[tuple[str, Style]]:
    out = list(spans)
    while out and not out[-1][0].strip():
        text = out[-1][0].rstrip()
        if text:
            out[-1] = (text, out[-1][1])
            break
        out.pop()
    return out or [("", PLAIN)]


def wrap_spans(spans, width: int) -> list[list[tuple[str, Style]]]:
    """Word-wrap styled text to `width` columns.

    Styling and wrapping cannot be separated: measuring a line has to happen
    after the styles are attached, and a word may span several styles (bold
    tail, plain rest). This walks the spans once, accumulating runs, and only
    breaks where a space was — a long word is sliced rather than overflowing.
    """
    if width <= 0:
        return [[("", PLAIN)]]
    lines: list[list[tuple[str, Style]]] = []
    current: list[tuple[str, Style]] = []
    column = 0

    def flush() -> None:
        nonlocal current, column
        lines.append(_trim_end(current))
        current = []
        column = 0

    for text, style in spans:
        style = style or PLAIN
        index = 0
        while index < len(text):
            if text[index] == " ":
                end = index
                while end < len(text) and text[end] == " ":
                    end += 1
                if column > 0:
                    run = text[index:end]
                    current.append((run, style))
                    column += display_width(run)
                index = end
                continue

            end = index
            while end < len(text) and text[end] != " ":
                end += 1
            word = text[index:end]
            index = end

            if column > 0 and column + display_width(word) > width:
                flush()
            while display_width(word) > width - column:
                head, word = _cut_columns(word, width - column)
                current.append((head, style))
                column += display_width(head)
                if word:
                    flush()
            if word:
                current.append((word, style))
                column += display_width(word)

    lines.append(_trim_end(current))
    return lines or [[("", PLAIN)]]


def spans_to_text(spans) -> str:
    return "".join(text for text, _ in spans)


# --- colour ----------------------------------------------------------------


class Style:
    """A cell's attributes. Immutable so it can be hashed and compared."""

    __slots__ = ("fg", "bg", "bold", "dim", "italic", "underline", "reverse")

    def __init__(self, fg=None, bg=None, bold=False, dim=False,
                 italic=False, underline=False, reverse=False):
        self.fg = fg
        self.bg = bg
        self.bold = bold
        self.dim = dim
        self.italic = italic
        self.underline = underline
        self.reverse = reverse

    def _key(self):
        return (self.fg, self.bg, self.bold, self.dim, self.italic,
                self.underline, self.reverse)

    def __eq__(self, other):  # type: ignore[override]
        return isinstance(other, Style) and self._key() == other._key()

    def __hash__(self):
        return hash(self._key())

    def __repr__(self):
        return f"Style{self._key()}"

PLAIN = Style()

# 0xRRGGBB strings are resolved by the theme into either truecolor, a 256-colour
# approximation, or one of the 16 named slots.
_ANSI16 = {
    "black": 30, "red": 31, "green": 32, "yellow": 33,
    "blue": 34, "magenta": 35, "cyan": 36, "white": 37,
    "brightblack": 90, "brightred": 91, "brightgreen": 92,
    "brightyellow": 93, "brightblue": 94, "brightmagenta": 95,
    "brightcyan": 96, "brightwhite": 97,
}


def _hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16)


def _rgb_to_256(r: int, g: int, b: int) -> int:
    # The 6x6x6 cube plus greyscale ramp is close enough at these sizes.
    if abs(r - g) < 8 and abs(g - b) < 8:
        if r < 8:
            return 16
        if r > 248:
            return 231
        return 232 + round((r - 8) / 247 * 24)
    return 16 + 36 * round(r / 255 * 5) + 6 * round(g / 255 * 5) + round(b / 255 * 5)


def _rgb_to_16(r: int, g: int, b: int) -> int:
    # Nearest of the 16 classic colours by squared distance.
    palette = {
        0: (0, 0, 0), 1: (128, 0, 0), 2: (0, 128, 0), 3: (128, 128, 0),
        4: (0, 0, 128), 5: (128, 0, 128), 6: (0, 128, 128), 7: (192, 192, 192),
        8: (128, 128, 128), 9: (255, 0, 0), 10: (0, 255, 0), 11: (255, 255, 0),
        12: (0, 0, 255), 13: (255, 0, 255), 14: (0, 255, 255), 15: (255, 255, 255),
    }
    best, best_distance = 7, None
    for index, (pr, pg, pb) in palette.items():
        distance = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2
        if best_distance is None or distance < best_distance:
            best, best_distance = index, distance
    return best


class Colour:
    """Resolves palette values for the terminal's actual capability."""

    def __init__(self, mode: str = "truecolor"):
        self.mode = mode  # "truecolor" | "256" | "16" | "none"
        self._cache: dict[tuple[str, bool], str] = {}

    def sgr(self, value: str, background: bool = False) -> str:
        key = (value, background)
        cached = self._cache.get(key)
        if cached is not None:
            return cached
        code = self._compute(value, background)
        self._cache[key] = code
        return code

    def _compute(self, value: str, background: bool) -> str:
        if not value or self.mode == "none":
            return ""
        base = 48 if background else 38
        if value.startswith("#"):
            r, g, b = _hex_to_rgb(value)
            if self.mode == "truecolor":
                return f"\x1b[{base};2;{r};{g};{b}m"
            if self.mode == "256":
                return f"\x1b[{base};5;{_rgb_to_256(r, g, b)}m"
            index = _rgb_to_16(r, g, b)
            offset = 40 if background else 30
            if index >= 8:
                offset += 60
                index -= 8
            return f"\x1b[{offset + index}m"
        if value.startswith("ansi:"):
            name = value[5:]
            code = _ANSI16.get(name)
            if code is None:
                return ""
            if background:
                code += 10
            return f"\x1b[{code}m"
        return ""


def render(text: str, style: Style | None, colour: Colour) -> str:
    """Wrap `text` in the SGR sequence for `style`."""
    if style is None or style == PLAIN:
        return text
    parts = []
    if style.bold:
        parts.append("\x1b[1m")
    if style.dim:
        parts.append("\x1b[2m")
    if style.italic:
        parts.append("\x1b[3m")
    if style.underline:
        parts.append("\x1b[4m")
    if style.reverse:
        parts.append("\x1b[7m")
    if style.fg:
        parts.append(colour.sgr(style.fg, False))
    if style.bg:
        parts.append(colour.sgr(style.bg, True))
    body = "".join(parts)
    if not body:
        return text
    return body + text + RESET
