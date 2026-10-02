"""Markdown -> HTML -> docx publishing pipeline.

Collect the paper as Markdown, convert it to a styled HTML document for review,
then export a Word document for submission.  The converter covers the subset a
paper needs (headings, paragraphs, lists, tables, fenced code, blockquotes,
images/figures, emphasis, links) and emits XHTML-shaped markup so the docx pass
can parse it with the standard library.
"""
from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from html import escape
from pathlib import Path

# DTD / entity declarations are stripped before parsing untrusted HTML.
_DTD_RE = re.compile(r"<!\s*(DOCTYPE|ENTITY)", re.IGNORECASE)

_ACADEMIC_CSS = """
:root { --ink:#1b2430; --muted:#5b6b7a; --rule:#c9d2dc; --accent:#3a6ea5; }
@page { margin: 2.2cm; }
body { max-width: 820px; margin: 0 auto; padding: 32px 20px; color: var(--ink);
  font-family: "Times New Roman", "Songti SC", "SimSun", serif; line-height: 1.7; }
h1 { font-size: 1.7rem; text-align: center; }
h2 { font-size: 1.3rem; border-bottom: 1px solid var(--rule); padding-bottom: 4px; }
h3 { font-size: 1.1rem; }
p { text-align: justify; }
table.three-line { border-collapse: collapse; margin: 1em auto; }
table.three-line caption { caption-side: top; font-weight: 700; margin-bottom: 6px; }
table.three-line th, table.three-line td { padding: 5px 14px; }
table.three-line thead tr { border-top: 2px solid var(--ink); border-bottom: 1px solid var(--ink); }
table.three-line tbody tr:last-child { border-bottom: 2px solid var(--ink); }
pre { background: #f5f7fa; border: 1px solid var(--rule); border-radius: 8px;
  padding: 12px; overflow-x: auto; }
code { font-family: "Cascadia Code", Consolas, monospace; font-size: .92em; }
figure { text-align: center; margin: 1.4em 0; }
figure img { max-width: 100%; }
figcaption { color: var(--muted); font-size: .9em; margin-top: 6px; }
blockquote { border-left: 3px solid var(--accent); margin: 1em 0; padding: 2px 14px;
  color: var(--muted); }
"""


def _is_block_start(line: str) -> bool:
    stripped = line.strip()
    return bool(
        re.match(r"^(#{1,6})\s+", stripped)
        or stripped.startswith("```")
        or stripped.startswith(">")
        or re.match(r"^([-*+]|\d+\.)\s+", stripped)
        or re.match(r"^!\[[^\]]*\]\([^)]+\)\s*$", stripped)
        or re.match(r"^\s*([-*_])\1{2,}\s*$", stripped)
    )


def _inline(text: str) -> str:
    text = escape(text, quote=False)
    text = re.sub(
        r"!\[([^\]]*)\]\(([^)]+)\)",
        lambda m: f'<img src="{escape(m.group(2), quote=True)}" '
                  f'alt="{escape(m.group(1), quote=True)}"/>',
        text,
    )
    text = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda m: f'<a href="{escape(m.group(2), quote=True)}">{m.group(1)}</a>',
        text,
    )
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", text)
    return text


def _split_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def _table_html(header: list[str], rows: list[list[str]]) -> str:
    from .tables import table_to_html

    return table_to_html(header, rows)


def markdown_to_html(markdown_text: str, *, title: str = "", css: str = "") -> str:
    """Convert a Markdown document into a styled, well-formed HTML document."""
    lines = str(markdown_text or "").replace("\r\n", "\n").replace("\r", "\n").split("\n")
    parts: list[str] = []
    index, total = 0, len(lines)
    while index < total:
        line = lines[index]
        stripped = line.strip()

        if stripped.startswith("```"):
            language = stripped[3:].strip()
            index += 1
            buffer: list[str] = []
            while index < total and not lines[index].strip().startswith("```"):
                buffer.append(lines[index])
                index += 1
            index += 1
            code = escape("\n".join(buffer))
            cls = f' class="language-{escape(language)}"' if language else ""
            parts.append(f"<pre><code{cls}>{code}</code></pre>")
            continue

        heading = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if heading:
            level = len(heading.group(1))
            parts.append(f"<h{level}>{_inline(heading.group(2).strip())}</h{level}>")
            index += 1
            continue

        if re.match(r"^([-*_])\1{2,}$", stripped):
            parts.append("<hr/>")
            index += 1
            continue

        if (index + 1 < total and "|" in line
                and re.match(r"^\s*\|?\s*:?-{2,}", lines[index + 1] or "")):
            header = _split_row(line)
            index += 2
            rows = []
            while index < total and "|" in lines[index] and lines[index].strip():
                rows.append(_split_row(lines[index]))
                index += 1
            parts.append(_table_html(header, rows))
            continue

        if re.match(r"^\s*([-*+]|\d+\.)\s+", line):
            ordered = bool(re.match(r"^\s*\d+\.", line))
            items = []
            while index < total and re.match(r"^\s*([-*+]|\d+\.)\s+", lines[index]):
                items.append(re.sub(r"^\s*([-*+]|\d+\.)\s+", "", lines[index]).strip())
                index += 1
            tag = "ol" if ordered else "ul"
            body = "".join(f"<li>{_inline(item)}</li>" for item in items)
            parts.append(f"<{tag}>{body}</{tag}>")
            continue

        if line.startswith(">"):
            quoted = []
            while index < total and lines[index].startswith(">"):
                quoted.append(lines[index][1:].strip())
                index += 1
            parts.append(f"<blockquote><p>{_inline(' '.join(quoted))}</p></blockquote>")
            continue

        image = re.match(r"^!\[([^\]]*)\]\(([^)]+)\)\s*$", stripped)
        if image:
            alt, src = image.group(1), image.group(2)
            caption = f"<figcaption>{_inline(alt)}</figcaption>" if alt else ""
            parts.append(
                f'<figure><img src="{escape(src, quote=True)}" '
                f'alt="{escape(alt, quote=True)}"/>{caption}</figure>'
            )
            index += 1
            continue

        if not stripped:
            index += 1
            continue

        buffer = [stripped]
        index += 1
        while index < total and lines[index].strip() and not _is_block_start(lines[index]):
            buffer.append(lines[index].strip())
            index += 1
        parts.append(f"<p>{_inline(' '.join(buffer))}</p>")

    return _document("\n".join(parts), title, css)


def _document(body: str, title: str, css: str) -> str:
    head = ['<meta charset="utf-8"/>']
    if title:
        head.append(f"<title>{escape(title)}</title>")
    style = css if css != "" else _ACADEMIC_CSS
    if style:
        head.append(f"<style>{style}</style>")
    return f"<!DOCTYPE html><html><head>{''.join(head)}</head><body>{body}</body></html>"


def _extract_body(html: str) -> str:
    match = re.search(r"<body[^>]*>(.*)</body>", html or "", flags=re.S | re.I)
    return match.group(1) if match else (html or "")


def _set_east_asian(style_or_run, family: str) -> None:
    from docx.oxml.ns import qn

    rpr = style_or_run.font._element.get_or_add_rPr()
    fonts = rpr.find(qn("w:rFonts"))
    if fonts is None:
        fonts = rpr.makeelement(qn("w:rFonts"), {})
        rpr.append(fonts)
    fonts.set(qn("w:eastAsia"), family)


def _add_runs(paragraph, element, *, bold=False, italic=False, code=False) -> None:
    from docx.shared import Pt

    if element.text:
        run = paragraph.add_run(element.text)
        run.bold = bold or run.bold
        run.italic = italic or run.italic
        if code:
            run.font.name = "Consolas"
            run.font.size = Pt(10)
    for child in element:
        tag = child.tag
        _add_runs(paragraph, child,
                  bold=bold or tag == "strong",
                  italic=italic or tag == "em",
                  code=code or tag == "code")
        if child.tail:
            paragraph.add_run(child.tail)


def _emit_block(document, element) -> None:
    tag = element.tag
    if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
        paragraph = document.add_heading("", level=int(tag[1]))
        _add_runs(paragraph, element)
        return
    if tag == "p":
        _add_runs(document.add_paragraph(), element)
        return
    if tag in ("ul", "ol"):
        style = "List Number" if tag == "ol" else "List Bullet"
        for item in element.findall("li"):
            _add_runs(document.add_paragraph(style=style), item)
        return
    if tag == "pre":
        text = "".join(element.itertext())
        paragraph = document.add_paragraph()
        run = paragraph.add_run(text)
        run.font.name = "Consolas"
        return
    if tag == "blockquote":
        for child in element:
            _add_runs(document.add_paragraph(style="Intense Quote"), child)
        return
    if tag == "hr":
        document.add_paragraph("—" * 20)
        return
    if tag == "table":
        _emit_table(document, element)
        return
    if tag == "figure":
        image = element.find("img")
        if image is not None and image.get("src"):
            _emit_image(document, image.get("src"))
        caption = element.find("figcaption")
        if caption is not None:
            paragraph = document.add_paragraph()
            paragraph.alignment = 1  # center
            _add_runs(paragraph, caption)
        return
    if tag == "img":
        _emit_image(document, element.get("src"))
        return
    _add_runs(document.add_paragraph(), element)


def _emit_image(document, src: str) -> None:
    from docx.shared import Inches

    local = Path(src)
    if local.is_file():
        try:
            document.add_picture(str(local), width=Inches(5.6))
        except Exception:
            document.add_paragraph(f"[image: {src}]")


def _emit_table(document, element) -> None:
    rows = element.findall(".//tr")
    if not rows:
        return
    cells = rows[0].findall("th") or rows[0].findall("td")
    table = document.add_table(rows=len(rows), cols=max(1, len(cells)))
    table.style = "Table Grid"
    for row_index, row in enumerate(rows):
        for column, cell in enumerate(row.findall("th") + row.findall("td")):
            paragraph = table.cell(row_index, column).paragraphs[0]
            _add_runs(paragraph, cell)


def html_to_docx(html: str, path, *, title: str = ""):
    """Export HTML (as produced by :func:`markdown_to_html`) to a Word document."""
    from docx import Document
    from docx.shared import Pt

    document = Document()
    normal = document.styles["Normal"]
    normal.font.name = "Times New Roman"
    normal.font.size = Pt(11)
    _set_east_asian(normal, "宋体")
    if title:
        heading = document.add_heading(title, level=0)
        heading.alignment = 1

    body = _extract_body(html)
    # `body` is derived from model-authored markdown: reject DTD/entity
    # declarations before handing it to the XML parser (XXE / expansion DoS).
    if _DTD_RE.search(body):
        body = re.sub(r"<!\s*(DOCTYPE|ENTITY)[^>]*>", "", body, flags=re.IGNORECASE)
    try:
        root = ET.fromstring(f"<root>{body}</root>")
    except ET.ParseError:
        document.add_paragraph(re.sub(r"<[^>]+>", "", body).strip())
        root = None
    if root is not None:
        for element in root:
            _emit_block(document, element)

    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    document.save(target)
    return target


def safe_stem(name: object, default: str = "paper") -> str:
    """Sanitise a caller-supplied filename stem so it cannot escape the output dir.

    ``stem``/``name`` come from a JSON spec that a model can author, so
    ``"../../etc/passwd"`` must not turn into a path traversal.
    """
    stem = re.sub(r"[^\w.\-]+", "_", str(name or "")).strip("._-") or default
    return stem[:80]


def build_paper(markdown_text: str, out_dir, *, title: str = "", stem: str = "paper",
                css: str = "") -> dict:
    """Write ``<out_dir>/<stem>.html`` and ``<out_dir>/<stem>.docx``; return paths."""
    directory = Path(out_dir)
    directory.mkdir(parents=True, exist_ok=True)
    stem = safe_stem(stem)
    html = markdown_to_html(markdown_text, title=title, css=css)
    html_path = directory / f"{stem}.html"
    html_path.write_text(html, encoding="utf-8")
    docx_path = html_to_docx(html, directory / f"{stem}.docx", title=title)
    return {"html": html_path, "docx": docx_path}
