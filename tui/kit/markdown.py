"""Markdown to styled rows.

The browser gets a full renderer; this one has a narrower job: an answer should
read as an answer. Headings lose their hashes, emphasis becomes real emphasis,
lists get a hanging indent, and code keeps its columns -- a diff or an indented
snippet that has been reflowed is worse than useless.

Deliberately unsupported: nested emphasis, reference links, footnotes, HTML.
At 80 columns a wrong guess is more confusing than showing the source.
"""

from __future__ import annotations

import re

from .ansi import PLAIN, Style, char_width, display_width, spans_to_text, wrap_spans

_FENCE = re.compile(r"^\s*(`{3,}|~{3,})\s*(\S*)\s*$")
_HEADING = re.compile(r"^\s*(#{1,6})\s+(.*?)\s*#*\s*$")
_BULLET = re.compile(r"^(\s*)[-*+]\s+(.*)$")
_ORDERED = re.compile(r"^(\s*)(\d{1,3})[.)]\s+(.*)$")
_QUOTE = re.compile(r"^\s*>\s?(.*)$")
_RULE = re.compile(r"^\s*([-*_])(\s*\1){2,}\s*$")
_TABLE = re.compile(r"^\s*\|.*\|?\s*$")
_LINK = re.compile(r"\[([^\]]*)\]\(([^)\s]+)\)")
_CODE_SPAN = re.compile(r"`([^`]+)`")
_STRONG = re.compile(r"\*\*([^*]+)\*\*")
_STRIKE = re.compile(r"~~([^~]+)~~")
_EM = re.compile(r"(?<![\w*])\*([^*\s][^*]*)\*(?![\w*])")

CODE_GUTTER = "▏ "
QUOTE_GUTTER = "▏ "


def _italics(style: Style | None) -> Style:
    """Same colour, slanted -- used for quoted text without losing emphasis."""
    if style is None:
        return Style(italic=True)
    return Style(fg=style.fg, bg=style.bg, bold=style.bold, dim=style.dim,
                 italic=True, underline=style.underline, reverse=style.reverse)


def _slice(text: str, width: int) -> tuple[str, str]:
    """Head that fits in `width` columns, and the rest."""
    if width <= 0:
        return "", text
    taken = 0
    index = 0
    for ch in text:
        step = char_width(ch)
        if taken + step > width:
            break
        taken += step
        index += 1
    return text[:index], text[index:]


def _hanging(spans, width: int, first: str, theme,
             first_style: Style | None = None) -> list[list[tuple[str, Style]]]:
    """Wrap to `width`, hanging the continuation under the first row's marker."""
    lead = display_width(first)
    lines = wrap_spans(spans, max(4, width - lead))
    style = first_style if first_style is not None else theme.style("subtle")
    pad = " " * lead
    out: list[list[tuple[str, Style]]] = []
    for index, line in enumerate(lines):
        marker = first if index == 0 else pad
        out.append(([(marker, style)] if marker else []) + list(line))
    return out


def _emphasis(chunk: str, theme) -> list[tuple[str, Style]]:
    """Bold, strike, links and italic inside a stretch with no code spans."""
    out: list[tuple[str, Style]] = []
    position = 0
    plain = theme.style("text")
    for pattern, role in ((_LINK, "link"), (_STRONG, "strong"),
                          (_STRIKE, "strike"), (_EM, "em")):
        while True:
            match = pattern.search(chunk, position)
            if match is None:
                break
            if match.start() > position:
                out.append((chunk[position:match.start()], plain))
            if role == "link":
                label, url = match.group(1), match.group(2)
                out.append((label or url, theme.style("accent", underline=True)))
                if label:
                    out.append((f" ({url})", theme.style("subtle")))
            elif role == "strong":
                out.append((match.group(1), theme.style("strong", bold=True)))
            elif role == "strike":
                out.append((match.group(1), theme.style("muted")))
            else:
                out.append((match.group(1), theme.style("text", italic=True)))
            position = match.end()
    if position < len(chunk):
        out.append((chunk[position:], plain))
    return out


def _inline(text: str, theme) -> list[tuple[str, Style]]:
    """One line of prose to styled runs.

    Code spans are taken out first so `**` inside them is left alone; the rest
    is coloured left to right and anything unmatched stays plain.
    """
    spans: list[tuple[str, Style]] = []
    position = 0
    while True:
        match = _CODE_SPAN.search(text, position)
        if match is None:
            break
        if match.start() > position:
            spans.extend(_emphasis(text[position:match.start()], theme))
        spans.append((match.group(1), theme.style("accentSoft")))
        position = match.end()
    if position < len(text):
        spans.extend(_emphasis(text[position:], theme))
    return spans or [("", theme.style("text"))]


def _code_rows(line: str, width: int, theme) -> list[list[tuple[str, Style]]]:
    """Code keeps its columns: slice, never reflow."""
    body = theme.style("text")
    gutter = display_width(CODE_GUTTER)
    rows: list[list[tuple[str, Style]]] = []
    head, rest = _slice(line, width - gutter)
    rows.append([(CODE_GUTTER, theme.style("subtle")), (head, body)])
    while rest:
        head, rest = _slice(rest, width - gutter)
        rows.append([(CODE_GUTTER, theme.style("subtle")), (head, body)])
    return rows


def render(text: str, width: int, theme) -> list[list[tuple[str, Style]]]:
    """Render markdown to rows of styled spans, at most `width` columns wide."""
    if width <= 2:
        return [[("", PLAIN)]]
    rows: list[list[tuple[str, Style]]] = []
    in_code = False
    fence_char = ""
    paragraph: list[str] = []

    def blank() -> None:
        if rows and spans_to_text(rows[-1]).strip():
            rows.append([("", PLAIN)])

    def flush_paragraph() -> None:
        # A single newline in markdown is a soft break: the lines belong to one
        # paragraph and must wrap as one, or prose comes out ragged.
        nonlocal paragraph
        if paragraph:
            rows.extend(wrap_spans(_inline(" ".join(paragraph), theme), width))
            paragraph = []

    for raw in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        line = raw.rstrip()
        fenced = _FENCE.match(line)

        if in_code:
            if fenced and fenced.group(1).startswith(fence_char):
                in_code = False
                continue
            rows.extend(_code_rows(line, width, theme))
            continue
        if fenced:
            flush_paragraph()
            in_code = True
            fence_char = fenced.group(1)[0]
            blank()
            language = fenced.group(2)
            if language:
                rows.append([(CODE_GUTTER, theme.style("subtle")),
                             (language, theme.style("subtle"))])
            continue

        if not line.strip():
            flush_paragraph()
            blank()
            continue

        if _RULE.match(line):
            flush_paragraph()
            blank()
            rows.append([("─" * width, theme.style("border"))])
            blank()
            continue

        heading = _HEADING.match(line)
        if heading:
            flush_paragraph()
            blank()
            role = "accent" if len(heading.group(1)) <= 2 else "strong"
            rows.extend(_hanging(
                [(heading.group(2), theme.style(role, bold=True))],
                width, "", theme, theme.style(role, bold=True)))
            blank()
            continue

        quote = _QUOTE.match(line)
        if quote:
            flush_paragraph()
            spans = [(piece, _italics(style))
                     for piece, style in _inline(quote.group(1), theme)]
            rows.extend(_hanging(spans, width, QUOTE_GUTTER, theme,
                                 theme.style("muted")))
            continue

        bullet = _BULLET.match(line)
        if bullet:
            flush_paragraph()
            depth = "  " * (len(bullet.group(1)) // 2)
            rows.extend(_hanging(_inline(bullet.group(2), theme), width,
                                 depth + "• ", theme, theme.style("accent")))
            continue

        ordered = _ORDERED.match(line)
        if ordered:
            flush_paragraph()
            depth = "  " * (len(ordered.group(1)) // 2)
            marker = f"{ordered.group(2)}. "
            rows.extend(_hanging(_inline(ordered.group(3), theme), width,
                                 depth + marker, theme, theme.style("muted")))
            continue

        if "|" in line and _TABLE.match(line):
            # Keep table rows aligned instead of reflowing them into soup.
            flush_paragraph()
            head, rest = _slice(line, width)
            rows.append([(head, theme.style("muted"))])
            while rest:
                head, rest = _slice(rest, width)
                rows.append([(head, theme.style("muted"))])
            continue

        paragraph.append(line)

    flush_paragraph()
    while rows and not spans_to_text(rows[-1]).strip():
        rows.pop()
    return rows or [[("", PLAIN)]]
