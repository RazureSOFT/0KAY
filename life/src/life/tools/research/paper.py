"""Markdown -> HTML -> docx publishing pipeline.

Renders a paper from Markdown into (a) a styled HTML review document and (b) a
Word document with a real title block, sectioned headings, justified body text,
centred figures with numbered captions and three-line tables.

Design notes
------------
* The HTML is parsed with the tolerant stdlib :class:`html.parser.HTMLParser`
  rather than an XML parser.  Model-authored Markdown routinely carries a stray
  ``&`` or ``<``; an XML parse error used to collapse the whole document into a
  single plain-text paragraph (losing every figure and all layout).
* Layout is author-controllable from the Markdown alone:
    - a leading ``---`` YAML-ish front-matter block (``title``, ``authors``,
      ``affiliation``, ``abstract``, ``keywords``);
    - figures ``![caption](path){width=60%}`` (also px/in/cm);
    - three-line (booktabs) tables.
  Relative image paths resolve against the Markdown file's directory, the
  output directory and the current directory, in that order.
"""
from __future__ import annotations

import re
from html import escape
from html.parser import HTMLParser
from pathlib import Path

# --- front matter -------------------------------------------------------------

def parse_front_matter(text: str) -> tuple[dict[str, str], str]:
    """Split a leading ``---`` metadata block from the Markdown body."""
    raw = str(text or "").replace("\r\n", "\n").replace("\r", "\n")
    lines = raw.split("\n")
    start = 0
    while start < len(lines) and not lines[start].strip():
        start += 1
    if start >= len(lines) or lines[start].strip() != "---":
        return {}, raw
    end = None
    for index in range(start + 1, len(lines)):
        if lines[index].strip() in ("---", "..."):
            end = index
            break
    if end is None:
        return {}, raw
    meta: dict[str, str] = {}
    for line in lines[start + 1:end]:
        if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        meta[key.strip().lower()] = value.strip().strip('"').strip("'")
    return meta, "\n".join(lines[end + 1:])


# --- tolerant HTML tree -------------------------------------------------------

_VOID = {"br", "hr", "img", "meta", "link", "input", "col", "area", "base",
         "source", "track", "wbr"}


class _Node:
    __slots__ = ("tag", "attrs", "children", "text")

    def __init__(self, tag: str, attrs=None, text: str = ""):
        self.tag = tag
        self.attrs = {key: (value or "") for key, value in (attrs or [])}
        self.children: list["_Node"] = []
        self.text = text


class _TreeBuilder(HTMLParser):
    """Build a simple element tree; tolerant of unescaped ``&``/``<`` and HTML entities."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = _Node("#root")
        self._stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = _Node(tag, attrs)
        self._stack[-1].children.append(node)
        if tag not in _VOID:
            self._stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self._stack[-1].children.append(_Node(tag, attrs))

    def handle_endtag(self, tag):
        for index in range(len(self._stack) - 1, 0, -1):
            if self._stack[index].tag == tag:
                del self._stack[index:]
                return

    def handle_data(self, data):
        if data:
            self._stack[-1].children.append(_Node("#text", text=data))


def _parse_html(html: str) -> _Node:
    builder = _TreeBuilder()
    builder.feed(html or "")
    builder.close()
    return builder.root


def _walk(node: _Node, tag: str):
    for child in node.children:
        if child.tag == tag:
            yield child
        yield from _walk(child, tag)


def _first(node: _Node, tag: str) -> _Node | None:
    return next(_walk(node, tag), None)


# --- markdown -> html ---------------------------------------------------------

_IMG_INLINE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]*)\})?")
_LINK_INLINE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def _is_block_start(line: str) -> bool:
    stripped = line.strip()
    return bool(
        re.match(r"^(#{1,6})\s+", stripped)
        or stripped.startswith("```")
        or stripped.startswith(">")
        or re.match(r"^([-*+]|\d+\.)\s+", stripped)
        or re.match(r"^!\[[^\]]*\]\([^)]+\)(?:\{[^}]*\})?\s*$", stripped)
        or re.match(r"^\s*([-*_])\1{2,}\s*$", stripped)
    )


def _image_attrs(attrs: str) -> str:
    match = re.search(r"width\s*=\s*([0-9.]+)\s*(%|px|in|cm)?", attrs or "")
    return f' data-width="{match.group(1)}{match.group(2) or ""}"' if match else ""


def _img_tag(alt: str, src: str, attrs: str = "") -> str:
    return (f'<img src="{escape(src, quote=True)}" alt="{escape(alt, quote=True)}"'
            f'{_image_attrs(attrs)}/>')


def _inline(text: str) -> str:
    text = escape(text, quote=False)
    text = _IMG_INLINE.sub(
        lambda m: _img_tag(m.group(1), m.group(2), m.group(3) or ""), text)
    text = _LINK_INLINE.sub(
        lambda m: f'<a href="{escape(m.group(2), quote=True)}">{m.group(1)}</a>', text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", text)
    return text


def _split_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def _table_html(header: list[str], rows: list[list[str]]) -> str:
    from .tables import table_to_html

    return table_to_html(header, rows)


def _title_block(meta: dict[str, str]) -> str:
    title = str(meta.get("title") or "").strip()
    authors = str(meta.get("authors") or meta.get("author") or "").strip()
    affiliation = str(meta.get("affiliation") or "").strip()
    abstract = str(meta.get("abstract") or "").strip()
    keywords = str(meta.get("keywords") or "").strip()
    if not any((title, authors, abstract, keywords)):
        return ""
    parts = ['<header class="doc-header">']
    if title:
        parts.append(f'<h1 class="doc-title">{escape(title)}</h1>')
    if authors:
        line = escape(authors)
        if affiliation:
            line += f'<br/><span class="doc-affil">{escape(affiliation)}</span>'
        parts.append(f'<p class="doc-authors">{line}</p>')
    if abstract:
        parts.append(f'<div class="doc-abstract"><p><strong>摘要　</strong>{_inline(abstract)}</p></div>')
    if keywords:
        parts.append(f'<p class="doc-keywords"><strong>关键词：</strong>{_inline(keywords)}</p>')
    parts.append("</header>")
    return "".join(parts)


def markdown_to_html(markdown_text: str, *, title: str = "", css: str = "",
                     meta: dict[str, str] | None = None) -> str:
    """Convert a Markdown document into a styled, well-formed HTML document."""
    if meta is None:
        meta, markdown_text = parse_front_matter(markdown_text)
    if title and not meta.get("title"):
        meta["title"] = title

    lines = str(markdown_text or "").replace("\r\n", "\n").replace("\r", "\n").split("\n")
    parts: list[str] = []
    header = _title_block(meta)
    if header:
        parts.append(header)

    # Drop a leading `# <title>` that merely repeats the front-matter title.
    doc_title = str(meta.get("title") or "").strip()
    for position, line in enumerate(lines):
        if not line.strip():
            continue
        if doc_title and re.match(r"^#\s+" + re.escape(doc_title) + r"\s*$", line.strip()):
            lines[position] = ""
        break

    figure_no = 0
    table_no = 0
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
            header_row = _split_row(line)
            index += 2
            rows = []
            while index < total and "|" in lines[index] and lines[index].strip():
                rows.append(_split_row(lines[index]))
                index += 1
            table_no += 1
            parts.append(_table_html(header_row, rows))
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

        image = re.match(r"^!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]*)\})?\s*$", stripped)
        if image:
            alt, src, extra = image.group(1), image.group(2), image.group(3) or ""
            figure_no += 1
            caption = _inline(alt) if alt else ""
            label = f"图 {figure_no}"
            cap = f'<figcaption>{label}{("　" + caption) if caption else ""}</figcaption>'
            parts.append(f'<figure>{_img_tag(alt, src, extra)}{cap}</figure>')
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

    return _document("\n".join(parts), str(meta.get("title") or title), css)


def _document(body: str, title: str, css: str) -> str:
    head = ['<meta charset="utf-8"/>', '<meta name="viewport" content="width=device-width, initial-scale=1"/>']
    if title:
        head.append(f"<title>{escape(title)}</title>")
    style = css if css != "" else _ACADEMIC_CSS
    if style:
        head.append(f"<style>{style}</style>")
    return f"<!DOCTYPE html><html><head>{''.join(head)}</head><body>{body}</body></html>"


# --- html -> docx -------------------------------------------------------------

_ACADEMIC_CSS = """
:root { --ink:#1b2430; --muted:#5b6b7a; --rule:#c9d2dc; --accent:#3a6ea5; }
@page { size: A4; margin: 2.2cm 2.4cm; }
body { max-width: 820px; margin: 0 auto; padding: 40px 22px; color: var(--ink);
  font-family: "Times New Roman", "Songti SC", "SimSun", "Noto Serif CJK SC", serif;
  font-size: 16px; line-height: 1.75; }
header.doc-header { text-align: center; margin: 0 0 30px; }
h1.doc-title { font-size: 1.9rem; line-height: 1.35; margin: 0 0 14px; font-weight: 700; }
p.doc-authors { margin: 0 0 6px; font-size: 1.02rem; }
.doc-affil { color: var(--muted); font-size: .95rem; }
.doc-abstract { text-align: justify; margin: 18px auto; padding: 14px 18px;
  background: #f6f8fb; border: 1px solid var(--rule); border-radius: 10px; font-size: .96rem; }
.doc-abstract p { margin: 0; }
p.doc-keywords { margin: 4px auto 20px; font-size: .95rem; }
h1, h2, h3, h4 { line-height: 1.4; }
h1 { font-size: 1.5rem; margin: 1.6em 0 .6em; }
h2 { font-size: 1.28rem; margin: 1.5em 0 .5em; border-bottom: 1px solid var(--rule); padding-bottom: 5px; }
h3 { font-size: 1.09rem; margin: 1.2em 0 .4em; }
p { text-align: justify; margin: .7em 0; }
table.three-line { border-collapse: collapse; margin: 1.2em auto; font-size: .96rem; }
table.three-line caption { caption-side: top; font-weight: 700; margin-bottom: 8px; }
table.three-line th, table.three-line td { padding: 6px 16px; text-align: center; }
table.three-line thead tr { border-top: 2px solid var(--ink); border-bottom: 1px solid var(--ink); }
table.three-line tbody tr:last-child { border-bottom: 2px solid var(--ink); }
pre { background: #f5f7fa; border: 1px solid var(--rule); border-radius: 8px;
  padding: 12px 14px; overflow-x: auto; font-size: .9rem; line-height: 1.5; }
code { font-family: "Cascadia Code", Consolas, monospace; font-size: .92em; }
figure { text-align: center; margin: 1.6em 0; }
figure img { max-width: 100%; height: auto; }
figcaption { color: var(--muted); font-size: .9rem; margin-top: 8px; }
blockquote { border-left: 3px solid var(--accent); margin: 1em 0; padding: 4px 16px;
  color: var(--muted); }
hr { border: none; border-top: 1px solid var(--rule); margin: 1.6em 0; }
"""


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


def _style_document(document) -> None:
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.shared import Cm, Pt

    section = document.sections[0]
    section.top_margin = Cm(2.2)
    section.bottom_margin = Cm(2.2)
    section.left_margin = Cm(2.4)
    section.right_margin = Cm(2.4)

    normal = document.styles["Normal"]
    normal.font.name = "Times New Roman"
    normal.font.size = Pt(10.5)
    normal.paragraph_format.line_spacing = 1.5
    normal.paragraph_format.space_after = Pt(4)
    normal.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    _set_east_asian(normal, "宋体")

    for name, size in (("Heading 1", 15), ("Heading 2", 13), ("Heading 3", 11.5)):
        try:
            style = document.styles[name]
        except KeyError:
            continue
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.name = "Times New Roman"
        _set_east_asian(style, "黑体")


def _add_runs(paragraph, node: _Node, *, bold=False, italic=False, code=False) -> None:
    from docx.shared import Pt

    for child in node.children:
        tag = child.tag
        if tag == "#text":
            if child.text:
                run = paragraph.add_run(child.text)
                if bold:
                    run.bold = True
                if italic:
                    run.italic = True
                if code:
                    run.font.name = "Consolas"
                    run.font.size = Pt(9.5)
        elif tag == "br":
            paragraph.add_run().add_break()
        elif tag in ("strong", "b"):
            _add_runs(paragraph, child, bold=True, italic=italic, code=code)
        elif tag in ("em", "i"):
            _add_runs(paragraph, child, bold=bold, italic=True, code=code)
        elif tag == "code":
            _add_runs(paragraph, child, bold=bold, italic=italic, code=True)
        else:
            _add_runs(paragraph, child, bold=bold, italic=italic, code=code)


def _resolve_image(src: str, base_dirs) -> Path | None:
    candidate = Path(str(src).strip())
    if candidate.is_absolute():
        return candidate if candidate.is_file() else None
    for base in base_dirs:
        resolved = Path(base) / candidate
        if resolved.is_file():
            return resolved
    return candidate if candidate.is_file() else None


def _image_width(attrs: dict, *, default_inches: float = 5.9):
    from docx.shared import Cm, Inches

    raw = str(attrs.get("data-width") or "").strip()
    match = re.match(r"([0-9.]+)\s*(%|px|in|cm)?$", raw)
    if not match:
        return Inches(default_inches)
    value = float(match.group(1))
    unit = match.group(2) or "in"
    if unit == "%":
        return Inches(6.3 * value / 100.0)
    if unit == "px":
        return Inches(value / 96.0)
    if unit == "cm":
        return Cm(value)
    return Inches(value)


def _emit_image(document, node: _Node, base_dirs) -> None:
    from docx.enum.text import WD_ALIGN_PARAGRAPH

    src = str(node.attrs.get("src") or "")
    alt = str(node.attrs.get("alt") or "")
    resolved = _resolve_image(src, base_dirs)
    if resolved is None:
        paragraph = document.add_paragraph(f"[缺失图片：{src or alt}]")
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        return
    try:
        document.add_picture(str(resolved), width=_image_width(node.attrs))
        document.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    except Exception:
        paragraph = document.add_paragraph(f"[图片无法插入：{src}]")
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER


def _emit_caption(document, node: _Node) -> None:
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.shared import Pt

    paragraph = document.add_paragraph()
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    paragraph.paragraph_format.space_after = Pt(10)
    _add_runs(paragraph, node)
    for run in paragraph.runs:
        run.font.size = Pt(9.5)


def _cell_border(cell, edge: str, size: int) -> None:
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    tc_pr = cell._tc.get_or_add_tcPr()
    borders = tc_pr.find(qn("w:tcBorders"))
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tc_pr.append(borders)
    element = borders.find(qn(f"w:{edge}"))
    if element is None:
        element = OxmlElement(f"w:{edge}")
        borders.append(element)
    element.set(qn("w:val"), "single")
    element.set(qn("w:sz"), str(size))
    element.set(qn("w:color"), "1b2430")
    element.set(qn("w:space"), "0")


def _three_line_table(table) -> None:
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    tbl_pr = table._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        element = OxmlElement(f"w:{edge}")
        element.set(qn("w:val"), "none")
        element.set(qn("w:sz"), "0")
        borders.append(element)
    tbl_pr.append(borders)
    for cell in table.rows[0].cells:
        _cell_border(cell, "top", 12)
        _cell_border(cell, "bottom", 6)
    for cell in table.rows[-1].cells:
        _cell_border(cell, "bottom", 12)


def _emit_table(document, node: _Node) -> None:
    rows = list(_walk(node, "tr"))
    if not rows:
        return
    caption = _first(node, "caption")
    if caption is not None:
        _emit_caption(document, caption)
    cells = [cell for cell in rows[0].children if cell.tag in ("th", "td")]
    table = document.add_table(rows=len(rows), cols=max(1, len(cells)))
    table.alignment = 1  # center
    for row_index, row in enumerate(rows):
        cells = [cell for cell in row.children if cell.tag in ("th", "td")]
        for column, cell in enumerate(cells):
            paragraph = table.cell(row_index, column).paragraphs[0]
            from docx.enum.text import WD_ALIGN_PARAGRAPH
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            _add_runs(paragraph, cell)
            if row_index == 0:
                for run in paragraph.runs:
                    run.bold = True
    try:
        _three_line_table(table)
    except Exception:
        table.style = "Table Grid"


def _emit_block(document, node: _Node, *, base_dirs=()) -> None:
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.shared import Cm, Pt

    tag = node.tag
    classes = str(node.attrs.get("class") or "")

    if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
        if "doc-title" in classes:
            paragraph = document.add_heading("", level=0)
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            _add_runs(paragraph, node)
            return
        paragraph = document.add_heading("", level=min(int(tag[1]), 4))
        _add_runs(paragraph, node)
        return

    if tag == "p":
        paragraph = document.add_paragraph()
        if "doc-authors" in classes:
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if "doc-keywords" in classes:
            paragraph.paragraph_format.space_before = Pt(6)
        _add_runs(paragraph, node)
        return

    if tag == "header" or tag == "section":
        for child in node.children:
            _emit_block(document, child, base_dirs=base_dirs)
        return

    if tag == "div":
        if "doc-abstract" in classes:
            paragraph = document.add_paragraph()
            paragraph.paragraph_format.left_indent = Cm(0.7)
            paragraph.paragraph_format.right_indent = Cm(0.7)
            for child in node.children:
                if child.tag == "p":
                    _add_runs(paragraph, child)
                elif child.tag == "#text":
                    paragraph.add_run(child.text)
            return
        for child in node.children:
            _emit_block(document, child, base_dirs=base_dirs)
        return

    if tag == "figure":
        image = _first(node, "img")
        if image is not None and image.attrs.get("src"):
            _emit_image(document, image, base_dirs)
        caption = _first(node, "figcaption")
        if caption is not None:
            _emit_caption(document, caption)
        return

    if tag == "img":
        _emit_image(document, node, base_dirs)
        return

    if tag in ("ul", "ol"):
        style = "List Number" if tag == "ol" else "List Bullet"
        for item in node.children:
            if item.tag == "li":
                _add_runs(document.add_paragraph(style=style), item)
        return

    if tag == "pre":
        paragraph = document.add_paragraph()
        run = paragraph.add_run("".join(child.text for child in _walk(node, "#text")))
        run.font.name = "Consolas"
        run.font.size = Pt(9)
        return

    if tag == "blockquote":
        for child in node.children:
            paragraph = document.add_paragraph()
            paragraph.paragraph_format.left_indent = Cm(0.8)
            _add_runs(paragraph, child)
        return

    if tag == "hr":
        paragraph = document.add_paragraph()
        try:
            from docx.oxml import OxmlElement
            from docx.oxml.ns import qn
            p_pr = paragraph._p.get_or_add_pPr()
            borders = OxmlElement("w:pBdr")
            bottom = OxmlElement("w:bottom")
            bottom.set(qn("w:val"), "single")
            bottom.set(qn("w:sz"), "6")
            bottom.set(qn("w:color"), "c9d2dc")
            borders.append(bottom)
            p_pr.append(borders)
        except Exception:
            paragraph.add_run("—" * 20)
        return

    if tag == "table":
        _emit_table(document, node)
        return

    _add_runs(document.add_paragraph(), node)


def html_to_docx(html: str, path, *, title: str = "", base_dirs=()):
    """Export HTML (as produced by :func:`markdown_to_html`) to a Word document."""
    from docx import Document

    document = Document()
    _style_document(document)
    if title:
        heading = document.add_heading(title, level=0)
        heading.alignment = 1

    root = _parse_html(_extract_body(html))
    for element in root.children:
        _emit_block(document, element, base_dirs=tuple(base_dirs))

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


def _try_pdf(docx_path: Path) -> Path | None:
    """Best-effort docx -> pdf via a local LibreOffice, if present."""
    import shutil
    import subprocess

    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice:
        for candidate in (
            r"C:\Program Files\LibreOffice\program\soffice.exe",
            r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
            "/Applications/LibreOffice.app/Contents/MacOS/soffice",
            "/usr/bin/soffice",
        ):
            if Path(candidate).is_file():
                soffice = candidate
                break
    if not soffice:
        return None
    try:
        subprocess.run(
            [soffice, "--headless", "--convert-to", "pdf", "--outdir",
             str(docx_path.parent), str(docx_path)],
            timeout=180, check=True, capture_output=True,
        )
    except Exception:
        return None
    pdf_path = docx_path.with_suffix(".pdf")
    return pdf_path if pdf_path.is_file() else None


def build_paper(markdown_text: str, out_dir, *, title: str = "", stem: str = "paper",
                css: str = "", base_dirs=None, meta: dict[str, str] | None = None,
                pdf: bool = False) -> dict:
    """Write ``<out_dir>/<stem>.html`` and ``<stem>.docx`` (and ``.pdf`` if asked)."""
    directory = Path(out_dir)
    directory.mkdir(parents=True, exist_ok=True)
    stem = safe_stem(stem)

    parsed_meta, body = parse_front_matter(markdown_text)
    merged = dict(parsed_meta)
    if meta:
        merged.update({key: str(value) for key, value in meta.items() if str(value).strip()})
    if title and not merged.get("title"):
        merged["title"] = title

    search_dirs = list(base_dirs or [])
    search_dirs.append(directory)
    search_dirs.append(Path.cwd())

    html = markdown_to_html(body, title=str(merged.get("title") or title), css=css, meta=merged)
    html_path = directory / f"{stem}.html"
    html_path.write_text(html, encoding="utf-8")
    # The title block is already part of the HTML, so do not add a second title.
    docx_path = html_to_docx(html, directory / f"{stem}.docx", base_dirs=search_dirs)

    result = {"html": html_path, "docx": docx_path}
    if pdf:
        generated = _try_pdf(docx_path)
        if generated is not None:
            result["pdf"] = generated
    return result
