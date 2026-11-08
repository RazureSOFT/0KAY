"""Markdown to styled rows.

The browser gets a full renderer; this one has a narrower job: an answer should
read as an answer. Headings lose their hashes, emphasis becomes real emphasis,
lists get a hanging indent, and code keeps its columns -- a diff or an indented
snippet that has been reflowed is worse than useless.

Deliberately unsupported: nested emphasis, reference links, footnotes, HTML.
At 80 columns a wrong guess is more confusing than showing the source.
"""

from __future__ import annotations

import os
import re

from . import graphics
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
_MATH = re.compile(r"\$(?!\s)([^$\n]*?\S)\$")
_IMAGE = re.compile(r"^\s*!\[([^\]]*)\]\((.+?)\)\s*$")
# A picture tall enough to fill the screen would push the conversation away.
MAX_IMAGE_ROWS = 14
# One cell shows two rows of pixels: the glyph's colour is the lower one and
# its background the upper one.
HALF_BLOCK = "▀"


def _local_path(source: str, base: str = "") -> str:
    """A path on this machine, or "" when the source is remote."""
    if "://" in source:
        return ""
    candidate = source[7:] if source.startswith("file://") else source
    candidate = candidate.replace("%20", " ")
    if not os.path.isabs(candidate) and base:
        candidate = os.path.join(base, candidate)
    return candidate if os.path.exists(candidate) else ""

CODE_GUTTER = "▏ "
QUOTE_GUTTER = "▏ "

# Words worth colouring, per language. A missing language gets no colour at
# all rather than a wrong guess: coloured-wrong code reads as broken.
KEYWORDS = {
    "python": {"def", "class", "return", "if", "elif", "else", "for", "while",
               "import", "from", "as", "with", "try", "except", "finally",
               "raise", "yield", "await", "async", "lambda", "pass", "break",
               "continue", "and", "or", "not", "in", "is", "None", "True",
               "False", "global", "nonlocal", "assert", "del"},
    "js": {"const", "let", "var", "function", "return", "if", "else", "for",
           "while", "class", "new", "this", "throw", "try", "catch", "finally",
           "await", "async", "yield", "import", "export", "from", "default",
           "true", "false", "null", "undefined", "typeof", "instanceof"},
    "go": {"func", "package", "import", "return", "if", "else", "for", "range",
           "var", "const", "type", "struct", "interface", "map", "chan", "go",
           "defer", "select", "case", "switch", "break", "continue", "nil",
           "true", "false", "error"},
    "sh": {"if", "then", "else", "elif", "fi", "for", "in", "do", "done",
           "while", "case", "esac", "function", "return", "exit", "local",
           "export", "set", "source", "cd", "echo"},
}
KEYWORDS["javascript"] = KEYWORDS["js"]
KEYWORDS["typescript"] = KEYWORDS["js"]
KEYWORDS["ts"] = KEYWORDS["js"]
KEYWORDS["tsx"] = KEYWORDS["js"]
KEYWORDS["jsx"] = KEYWORDS["js"]
KEYWORDS["bash"] = KEYWORDS["sh"]
KEYWORDS["zsh"] = KEYWORDS["sh"]
KEYWORDS["py"] = KEYWORDS["python"]

_TOKEN = re.compile(
    r"(#[^\n]*|//[^\n]*)"            # comment
    r"|(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*')"   # string
    r"|(\b\d+(?:\.\d+)?\b)"          # number
    r"|([A-Za-z_][A-Za-z0-9_]*)"     # word
)

# LaTeX, to the extent an answer actually uses it.
GREEK = {
    "alpha": "α", "beta": "β", "gamma": "γ", "delta": "δ", "epsilon": "ε",
    "zeta": "ζ", "eta": "η", "theta": "θ", "iota": "ι", "kappa": "κ",
    "lambda": "λ", "mu": "μ", "nu": "ν", "xi": "ξ", "pi": "π", "rho": "ρ",
    "sigma": "σ", "tau": "τ", "upsilon": "υ", "phi": "φ", "chi": "χ",
    "psi": "ψ", "omega": "ω", "Gamma": "Γ", "Delta": "Δ", "Theta": "Θ",
    "Lambda": "Λ", "Xi": "Ξ", "Pi": "Π", "Sigma": "Σ", "Phi": "Φ",
    "Psi": "Ψ", "Omega": "Ω",
}
SYMBOLS = {
    "times": "×", "div": "÷", "pm": "±", "le": "≤", "leq": "≤", "ge": "≥",
    "geq": "≥", "ne": "≠", "neq": "≠", "approx": "≈", "infty": "∞",
    "sum": "∑", "prod": "∏", "int": "∫", "partial": "∂", "nabla": "∇",
    "rightarrow": "→", "to": "→", "leftarrow": "←", "Rightarrow": "⇒",
    "leftrightarrow": "↔", "cdot": "·", "ldots": "…", "dots": "…",
    "in": "∈", "notin": "∉", "subset": "⊂", "supset": "⊃", "cup": "∪",
    "cap": "∩", "forall": "∀", "exists": "∃", "emptyset": "∅",
}
SUPERSCRIPT = str.maketrans("0123456789+-=()nix", "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱˣ")
SUBSCRIPT = str.maketrans("0123456789+-=()aehijklmnoprstuvx",
                          "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ")


def _latex(source: str) -> str:
    """A formula as unicode text. Unknown commands keep their name."""
    text = source
    # Fractions first, so their braces do not confuse the rest.
    for _ in range(3):
        text = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"(\1)/(\2)", text)
        text = re.sub(r"\\sqrt\{([^{}]*)\}", r"√(\1)", text)
    for name, symbol in {**GREEK, **SYMBOLS}.items():
        text = re.sub(r"\\" + name + r"\b", symbol, text)
    text = re.sub(r"\^\{([^{}]*)\}", lambda m: m.group(1).translate(SUPERSCRIPT), text)
    text = re.sub(r"_\{([^{}]*)\}", lambda m: m.group(1).translate(SUBSCRIPT), text)
    text = re.sub(r"\^(\w)", lambda m: m.group(1).translate(SUPERSCRIPT), text)
    text = re.sub(r"_(\w)", lambda m: m.group(1).translate(SUBSCRIPT), text)
    text = text.replace("\\left", "").replace("\\right", "")
    text = re.sub(r"\\[,;:!]", " ", text)
    text = text.replace("{", "").replace("}", "")
    return text.strip()


def _highlight(line: str, language: str, theme) -> list[tuple[str, Style]]:
    """Colour one code line: comments, strings, numbers, keywords."""
    words = KEYWORDS.get(language.lower())
    if not words:
        return [(line, theme.style("text"))]
    spans: list[tuple[str, Style]] = []
    position = 0
    for match in _TOKEN.finditer(line):
        if match.start() > position:
            spans.append((line[position:match.start()], theme.style("text")))
        comment, string, number, word = match.groups()
        if comment:
            spans.append((comment, theme.style("subtle")))
        elif string:
            spans.append((string, theme.style("success")))
        elif number:
            spans.append((number, theme.style("warning")))
        elif word in words:
            spans.append((word, theme.style("accentSoft", bold=True)))
        else:
            spans.append((word, theme.style("text")))
        position = match.end()
    if position < len(line):
        spans.append((line[position:], theme.style("text")))
    return spans or [(line, theme.style("text"))]



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

    Code spans and formulas are taken out first so `**` inside them is left
    alone; the rest is coloured left to right and anything unmatched stays
    plain.
    """
    spans: list[tuple[str, Style]] = []
    position = 0
    while True:
        code = _CODE_SPAN.search(text, position)
        math = _MATH.search(text, position)
        if code is None and math is None:
            break
        if code is not None and (math is None or code.start() <= math.start()):
            match, is_math = code, False
        else:
            match, is_math = math, True
        if match.start() > position:
            spans.extend(_emphasis(text[position:match.start()], theme))
        if is_math:
            spans.append((_latex(match.group(1)), theme.style("accentSoft", italic=True)))
        else:
            spans.append((match.group(1), theme.style("accentSoft")))
        position = match.end()
    if position < len(text):
        spans.extend(_emphasis(text[position:], theme))
    return spans or [("", theme.style("text"))]


def _code_rows(line: str, width: int, theme,
               language: str = "") -> list[list[tuple[str, Style]]]:
    """Code keeps its columns: slice, never reflow."""
    gutter = display_width(CODE_GUTTER)
    room = max(4, width - gutter)
    rows: list[list[tuple[str, Style]]] = []
    head, rest = _slice(line, room)
    pieces = [head]
    while rest:
        head, rest = _slice(rest, room)
        pieces.append(head)
    for piece in pieces:
        body = (_highlight(piece, language, theme) if language
                else [(piece, theme.style("text"))])
        rows.append([(CODE_GUTTER, theme.style("subtle"))] + body)
    return rows


_MERMAID_EDGE = re.compile(r"^(.*?)-->(?:\|([^|]*)\|)?\s*(.*)$")
_MERMAID_NODE = re.compile(
    r"([A-Za-z0-9_]+)\s*(?:\[([^\]]*)\]|\{([^}]*)\}|\(\(([^)]*)\)\)|\(([^)]*)\))?")


def _mermaid_node(text: str) -> tuple[str, str]:
    """Split `A[Start]` into its id and its label."""
    match = _MERMAID_NODE.search(text.strip())
    if match is None:
        return "", ""
    ident = match.group(1)
    label = next((piece for piece in match.groups()[1:] if piece), "") or ident
    return ident, label


def _mermaid_chain(nodes: dict[str, str], edges: list[tuple[str, str, str]]):
    """The node order when the graph is a single line, else None.

    A chain is what most diagrams in an answer are; a branching one is listed
    as edges instead of pretending to be a picture.
    """
    outgoing: dict[str, list[str]] = {}
    incoming = set()
    for left, right, _ in edges:
        outgoing.setdefault(left, []).append(right)
        incoming.add(right)
    if not edges:
        return list(nodes)
    starts = [ident for ident in nodes if ident not in incoming]
    if len(starts) != 1:
        return None
    order: list[str] = []
    current = starts[0]
    while current and current not in order:
        order.append(current)
        following = outgoing.get(current) or []
        if len(following) > 1:
            return None
        current = following[0] if following else ""
    return order if len(order) == len(nodes) else None


def _mermaid_rows(lines: list[str], width: int, theme) -> list[list[tuple[str, Style]]]:
    """A flowchart as boxes and arrows, or as edges when it branches."""
    nodes: dict[str, str] = {}
    edges: list[tuple[str, str, str]] = []
    for raw in lines:
        line = raw.strip().rstrip(";")
        if not line or line.lower().startswith(("graph", "flowchart", "%%")):
            continue
        match = _MERMAID_EDGE.match(line)
        if match:
            left, label, right = (match.group(1).strip(),
                                  (match.group(2) or "").strip(),
                                  match.group(3).strip())
            for side in (left, right):
                ident, text = _mermaid_node(side)
                if ident:
                    nodes.setdefault(ident, text)
            start = _mermaid_node(left)[0]
            end = _mermaid_node(right)[0]
            if start and end:
                edges.append((start, end, label))
            continue
        ident, text = _mermaid_node(line)
        if ident:
            nodes.setdefault(ident, text)

    if not nodes:
        return _code_rows(" ".join(lines), width, theme, "mermaid")

    order = _mermaid_chain(nodes, edges)
    if order is None:
        rows: list[list[tuple[str, Style]]] = []
        for left, right, label in edges:
            text = f"{nodes.get(left, left)}  ──▶  {nodes.get(right, right)}"
            if label:
                text += f"  ({label})"
            head, rest = _slice(text, width)
            rows.append([(head, theme.style("muted"))])
            while rest:
                head, rest = _slice(rest, width)
                rows.append([(head, theme.style("muted"))])
        return rows

    rows = []
    limit = max(6, width - 4)
    for index, ident in enumerate(order):
        body = " " + nodes.get(ident, ident) + " "
        if display_width(body) > limit:
            body = _slice(body, limit)[0] + "…"
        inner = "─" * display_width(body)
        rows.append([("┌" + inner + "┐", theme.style("accentSoft"))])
        rows.append([("│", theme.style("accentSoft")), (body, theme.style("text")),
                     ("│", theme.style("accentSoft"))])
        rows.append([("└" + inner + "┘", theme.style("accentSoft"))])
        if index < len(order) - 1:
            label = next((text for left, right, text in edges
                          if left == ident and right == order[index + 1]), "")
            rows.append([("  ▼ " + label, theme.style("subtle"))])
    return rows


def image_paths(text: str, base: str = "") -> list[str]:
    """Local files this text refers to as pictures, in order, deduplicated.

    Used before a turn: the agent is a different machine as far as the
    filesystem is concerned, so a picture the model should see has to travel
    as an attachment rather than as a path in the prompt.
    """
    found: list[str] = []
    for match in re.finditer(r"!\[[^\]]*\]\(([^)]+)\)", text):
        path = _local_path(match.group(1).strip(), base)
        if path and path not in found:
            found.append(path)
    return found


def render(text: str, width: int, theme, images: list | None = None,
           base: str = "", protocol: bool | None = None) -> list[list[tuple[str, Style]]]:
    """Render markdown to rows of styled spans, at most `width` columns wide.

    `images` collects the pictures that need the terminal's graphics protocol:
    each entry is where its rectangle starts, in rows, plus how big it is. The
    rows themselves stay blank, which is what leaves the space.
    """
    if width <= 2:
        return [[("", PLAIN)]]
    rows: list[list[tuple[str, Style]]] = []
    in_code = False
    fence_char = ""
    language = ""
    diagram: list[str] = []
    in_math = False
    math_lines: list[str] = []
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

        if in_math:
            if line.strip().endswith("$$"):
                math_lines.append(line.strip()[:-2])
                flush_paragraph()
                blank()
                formula = _latex(" ".join(math_lines))
                head, rest = _slice(formula, max(8, width - 4))
                rows.append([("  " + head, theme.style("accentSoft", italic=True))])
                while rest:
                    head, rest = _slice(rest, max(8, width - 4))
                    rows.append([("  " + head, theme.style("accentSoft", italic=True))])
                blank()
                in_math = False
                math_lines = []
            else:
                math_lines.append(line.strip())
            continue

        if line.strip().startswith("$$"):
            inner = line.strip()[2:]
            flush_paragraph()
            blank()
            if inner.endswith("$$"):
                formula = _latex(inner[:-2])
                head, rest = _slice(formula, max(8, width - 4))
                rows.append([("  " + head, theme.style("accentSoft", italic=True))])
                while rest:
                    head, rest = _slice(rest, max(8, width - 4))
                    rows.append([("  " + head, theme.style("accentSoft", italic=True))])
                blank()
            else:
                in_math = True
                math_lines = [inner] if inner else []
            continue

        if in_code:
            if fenced and fenced.group(1).startswith(fence_char):
                in_code = False
                if diagram:
                    rows.extend(_mermaid_rows(diagram, width, theme))
                    blank()
                    diagram = []
                continue
            if language.lower() == "mermaid":
                # Drawn when the fence closes: a diagram needs all its edges.
                diagram.append(line)
            else:
                rows.extend(_code_rows(line, width, theme, language))
            continue
        if fenced:
            flush_paragraph()
            in_code = True
            fence_char = fenced.group(1)[0]
            language = fenced.group(2)
            diagram = []
            blank()
            if language and language.lower() != "mermaid":
                rows.append([(CODE_GUTTER, theme.style("subtle")),
                             (language, theme.style("subtle"))])
            continue

        if not line.strip():
            flush_paragraph()
            blank()
            continue

        picture = _IMAGE.match(line)
        if picture:
            flush_paragraph()
            blank()
            alt, source = picture.group(1), picture.group(2).strip()
            path = _local_path(source, base)
            # A graphics protocol gets a reserved rectangle painted over the
            # text; anything else falls back to half blocks, which are text
            # and so work in every terminal that can show colour at all.
            covered = protocol if protocol is not None else bool(graphics.kind())
            if path and covered and images is not None:
                cols, tall = graphics.cells_for(path, max(10, width - 2), MAX_IMAGE_ROWS)
                images.append({"row": len(rows), "path": path, "cols": cols,
                               "rows": tall, "alt": alt})
                for _ in range(tall):
                    rows.append([("", PLAIN)])
            else:
                cells = (graphics.block_cells(path, max(10, width - 2), MAX_IMAGE_ROWS)
                         if path else None)
                if cells:
                    for line in cells:
                        rows.append([(HALF_BLOCK, Style(fg=upper, bg=lower))
                                     for upper, lower in line])
                else:
                    rows.append([(graphics.caption(alt, path or source),
                                  theme.style("subtle"))])
            rows.append([("", PLAIN)])
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
    # Trailing blank rows are trimmed so a document does not end in whitespace,
    # but a row a picture is drawn into is not blank even though it looks it:
    # trimming those would delete the space the terminal needs to draw into,
    # and the image would be placed over whatever follows the answer.
    painted = set()
    for picture in (images or []):
        start = int(picture.get("row") or 0)
        painted.update(range(start, start + int(picture.get("rows") or 0)))
    while rows and not spans_to_text(rows[-1]).strip():
        if len(rows) - 1 in painted:
            break
        rows.pop()
    return rows or [[("", PLAIN)]]
