"""Drawing primitives: boxes, the banner, the context bar, spinners.

Widgets draw into a Frame and never print. Anything that needs to know its own
width takes it as an argument, so the same call works at 60 and 200 columns.
"""

from __future__ import annotations

from .ansi import PLAIN, display_width

SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"

# The banner from assets/logo/okay-banner.txt, cropped at the column where
# its baked-in captions start (48) so the client can draw live text there.
BANNER = [
    '          ▄▄▄▄███▄▄',
    '       ▄██▀       ▀█▄',
    '      ██▀           ██',
    '    ▄███             ▀',
    '   ▄███              ▄█',
    '   ███               ██▄',
    '  ███▀               ██▀',
    '  ███                ██',
    '  ███                ██ ▄▄',
    '  ███               █████▀',
    '  ███              ████▀   ▄▄█████▄   ██    ██',
    '  ▀██▄            ████    ▄██▀  ███   ██    ██',
    '   ▀██▄          ██▀ ██   ██    ███  ███   ▄██',
    '     ███▄    ▄▄▄█▀▀  ▀█▄  ██▄▄▄████  ███   ███',
    '       ▀▀████▀▀        ▀█▄ ▀▀▀▀▀ ██   ███████',
    '                         ▀              ▀ ███',
    '         ▄▄                              ▄██',
    '         ▀██▄                            ██',
    '           ▀██▄                         ██',
    '             ▀██▄                     ▄██▀',
    '               ▀██▄                  ▄██▀',
    '                 ▀███▄             ▄██▀',
    '                    ▀███▄▄▄▄   ▄▄▄██▀',
    '                       ▀▀████████▀▀',
]
BANNER_LABEL_COLUMN = 48
BANNER_LABEL_ROW = 10
# The compact banner is the same artwork at 16 rows instead of 24, so short
# terminals get the real logo rather than a different one.
BANNER_COMPACT_ROWS = 16
BANNER_COMPACT_LABEL_ROW = 7

_FULL_BLOCK = "\u2588"
_UPPER_HALF = "\u2580"
_LOWER_HALF = "\u2584"


def _pair_rows(upper: str, lower: str) -> str:
    """Two art rows as one row of half blocks."""
    out = []
    for index in range(max(len(upper), len(lower))):
        up = index < len(upper) and upper[index] != " "
        low = index < len(lower) and lower[index] != " "
        if up and low:
            out.append(_FULL_BLOCK)
        elif up:
            out.append(_UPPER_HALF)
        elif low:
            out.append(_LOWER_HALF)
        else:
            out.append(" ")
    return "".join(out).rstrip()


def compress(rows, target: int) -> list[str]:
    """Re-draw `rows` in `target` rows using half blocks.

    Halving a 24-row wordmark's rows one-for-one leaves the letterforms muddy,
    so the target is a parameter: 16 keeps "KAY" readable where 12 does not.
    A band that lands on a single source row keeps its own glyphs, which is
    what preserves the curves.
    """
    total = len(rows)
    if target <= 0 or target >= total:
        return [row.rstrip() for row in rows]
    out = []
    step = total / target
    for index in range(target):
        start = int(round(index * step))
        end = int(round((index + 1) * step))
        band = rows[start:end] or [rows[min(start, total - 1)]]
        out.append(_pair_rows(band[0], band[1]) if len(band) > 1
                   else band[0].rstrip())
    return out


BANNER_COMPACT = compress(BANNER, BANNER_COMPACT_ROWS)


_QUADRANTS = {
    (0, 0, 0, 0): " ",
    (1, 0, 0, 0): "▘",      # upper left
    (0, 1, 0, 0): "▝",      # upper right
    (0, 0, 1, 0): "▖",      # lower left
    (0, 0, 0, 1): "▗",      # lower right
    (1, 1, 0, 0): "▀",      # top half
    (0, 0, 1, 1): "▄",      # bottom half
    (1, 0, 1, 0): "▌",      # left half
    (0, 1, 0, 1): "▐",      # right half
    (1, 0, 0, 1): "▚",      # diagonal
    (0, 1, 1, 0): "▞",      # the other diagonal
    (1, 1, 1, 0): "▛",
    (1, 1, 0, 1): "▜",
    (1, 0, 1, 1): "▙",
    (0, 1, 1, 1): "▟",
    (1, 1, 1, 1): "█",      # full
}


def compress_columns(rows) -> list[str]:
    """Halve the width, using the four quadrants of a cell.

    A cell has a 2x2 addressable grid, so two columns can become one -- the
    only way a terminal can draw a narrower logo. Rows stay as they are: the
    same 2x2 grid cannot also halve them without losing the letterforms.
    """
    width = max(len(row) for row in rows)
    out = []
    for line in rows:
        cells = []
        for x in range(0, width - 1, 2):
            left = line[x] if x < len(line) else " "
            right = line[x + 1] if x + 1 < len(line) else " "
            key = (
                1 if left in ("█", "▀") else 0,
                1 if right in ("█", "▀") else 0,
                1 if left in ("█", "▄") else 0,
                1 if right in ("█", "▄") else 0,
            )
            cells.append(_QUADRANTS.get(key, "█"))
        out.append("".join(cells).rstrip())
    return out


BANNER_NARROW = compress_columns(BANNER)
# Captions sit two columns right of the art, whichever width it ended up.
BANNER_NARROW_LABEL_COLUMN = max(len(row) for row in BANNER_NARROW) + 2

# Narrow and short at once: both axes halved, which is the smallest the
# letterforms survive.
BANNER_TINY = compress(BANNER_NARROW, BANNER_COMPACT_ROWS)

# Best first; each entry is (art, caption row, caption column).
BANNER_VARIANTS = (
    (BANNER, BANNER_LABEL_ROW, BANNER_LABEL_COLUMN),
    (BANNER_COMPACT, BANNER_COMPACT_LABEL_ROW, BANNER_LABEL_COLUMN),
    (BANNER_NARROW, BANNER_LABEL_ROW, BANNER_NARROW_LABEL_COLUMN),
    (BANNER_TINY, BANNER_COMPACT_LABEL_ROW, BANNER_NARROW_LABEL_COLUMN),
)


def banner_rows(theme, art=None):
    """The banner, coloured so the flourish at the bottom fades out."""
    art = BANNER if art is None else art
    rows = []
    for index, line in enumerate(art):
        position = index / max(1, len(art))
        role = "accent" if position < 0.7 else ("accentSoft" if position < 0.95 else "muted")
        rows.append([(line, theme.style(role))])
    return rows

def box(frame, x: int, y: int, width: int, height: int, theme,
        title: str = "", focus: bool = False, title_right: str = "",
        role: str = "border") -> tuple[int, int, int, int]:
    """Draw a rounded box. Returns the inner rect (x, y, width, height).

    A 1-cell box has no inner area; callers guard on size before drawing, so a
    degenerate rect is returned rather than raising.
    """
    if width < 2 or height < 2:
        return (x, y, max(0, width - 2), max(0, height - 2))
    border = theme.style("borderFocus" if focus else role)
    inner_width = width - 2
    # The interior is opaque: a box drawn over content has to hide it, or the
    # old text shows through the gaps between borders and labels.
    for row in range(1, height - 1):
        frame.fill_row(y + row, " ", PLAIN)
        frame.put(x, y + row, "│", border)
        frame.put(x + width - 1, y + row, "│", border)
    frame.put(x, y, "╭" + "─" * inner_width + "╮", border)
    frame.put(x, y + height - 1, "╰" + "─" * inner_width + "╯", border)

    if title and inner_width >= 4:
        label = f" {title} "
        available = inner_width - 2
        if display_width(label) > available:
            label = label[:available]
            if len(label) > 1:
                label = label[:-1] + "…"
        frame.put(x + 2, y, label, theme.style("muted"))
    if title_right and inner_width >= 4:
        label = f" {title_right} "
        if display_width(label) <= inner_width - 2:
            frame.put(x + width - 2 - display_width(label), y, label, theme.style("subtle"))
    return (x + 2, y + 1, max(1, width - 4), max(0, height - 2))


def context_bar(theme, percent: int | None, width: int = 10) -> list[tuple[str, object]]:
    """Segmented pressure bar: green under 60, amber under 85, red above."""
    if percent is None:
        return [("░" * width, theme.style("ctxEmpty"))]
    value = max(0, min(100, int(percent)))
    filled = round(width * value / 100)
    if value >= 85:
        role = "error"
    elif value >= 60:
        role = "warning"
    else:
        role = "success"
    return [
        ("█" * filled, theme.style(role)),
        ("░" * (width - filled), theme.style("ctxEmpty")),
    ]


def spinner(theme, tick: int) -> tuple[str, object]:
    return (SPINNER[tick % len(SPINNER)] + " ", theme.style("accent"))


def _trim(value: float) -> str:
    """One decimal, but never a dangling .0 -- 128k reads better than 128.0k."""
    text = f"{value:.1f}"
    return text[:-2] if text.endswith(".0") else text


def human_tokens(count: float | int | None) -> str:
    try:
        value = float(count or 0)
    except (TypeError, ValueError):
        return "--"
    if value >= 1_000_000:
        return f"{_trim(value / 1_000_000)}M"
    if value >= 1_000:
        return f"{_trim(value / 1_000)}k"
    return f"{int(value)}"


def human_rate(value: float | None) -> str:
    if not value or value <= 0:
        return ""
    if value >= 100:
        return f"{value:.0f} tok/s"
    return f"{value:.1f} tok/s"

