"""Three-line (booktabs) tables for papers: HTML, LaTeX and docx."""
from __future__ import annotations

from html import escape
from pathlib import Path

# LaTeX special characters.  `\` must be substituted as a whole token, which the
# per-character map below does naturally (the replacement is emitted verbatim).
_LATEX_SPECIAL = {
    "\\": r"\textbackslash{}",
    "&": r"\&", "%": r"\%", "$": r"\$", "#": r"\#",
    "_": r"\_", "{": r"\{", "}": r"\}",
    "~": r"\textasciitilde{}", "^": r"\textasciicircum{}",
}


def _latex_escape(value: object) -> str:
    """Escape LaTeX special characters in cell/caption text.

    The HTML path already uses ``escape``; the LaTeX path did not, so ``&``,
    ``%``, ``_`` etc. in cell text would break compilation — or inject commands.
    """
    return "".join(_LATEX_SPECIAL.get(char, char) for char in str(value))


def _normalize(header, rows):
    header = [str(cell) for cell in (header or [])]
    rows = [[str(cell) for cell in row] for row in (rows or [])]
    width = len(header) or max((len(row) for row in rows), default=0)
    header = header + [""] * (width - len(header))
    return header, [row + [""] * (width - len(row)) for row in rows]


def table_to_html(header, rows, *, caption: str = "", path=None) -> str:
    """A three-line table (top/mid/bottom rules only) as an HTML string."""
    header, rows = _normalize(header, rows)
    head = "".join(f"<th>{escape(cell)}</th>" for cell in header)
    body = "".join(
        "<tr>" + "".join(f"<td>{escape(cell)}</td>" for cell in row) + "</tr>"
        for row in rows
    )
    cap = f"<caption>{escape(caption)}</caption>" if caption else ""
    html = (
        '<table class="three-line">'
        f"{cap}<thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>"
    )
    if path:
        target = Path(path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html, encoding="utf-8")
    return html


def table_to_latex(header, rows, *, caption: str = "", label: str = "",
                   path=None) -> str:
    """A ``booktabs`` table (requires ``\\usepackage{booktabs}``)."""
    header, rows = _normalize(header, rows)
    columns = "l" * max(1, len(header))
    lines = [
        "\\begin{table}[htbp]",
        "  \\centering",
    ]
    if caption:
        lines.append(f"  \\caption{{{_latex_escape(caption)}}}")
    if label:
        lines.append(f"  \\label{{{_latex_escape(label)}}}")
    lines += [
        f"  \\begin{{tabular}}{{{columns}}}",
        "    \\toprule",
        "    " + " & ".join(_latex_escape(cell) for cell in header) + " \\\\",
        "    \\midrule",
    ]
    lines += ["    " + " & ".join(_latex_escape(cell) for cell in row) + " \\\\" for row in rows]
    lines += [
        "    \\bottomrule",
        "  \\end{tabular}",
        "\\end{table}",
    ]
    latex = "\n".join(lines)
    if path:
        target = Path(path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(latex, encoding="utf-8")
    return latex


def table_to_docx(header, rows, *, caption: str = "", path=None):
    """Append a three-line table to a ``python-docx`` document, or return one.

    With ``path`` the document is saved and the ``Path`` is returned; without it
    the ``docx`` object is returned so the caller can add more content.
    """
    from docx import Document
    from docx.enum.text import WD_ALIGN_PARAGRAPH

    header, rows = _normalize(header, rows)
    document = Document()
    if caption:
        paragraph = document.add_paragraph(caption)
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        paragraph.paragraph_format.keep_with_next = True
    table = document.add_table(rows=1 + len(rows), cols=max(1, len(header)))
    table.style = "Table Grid"
    for column, cell in enumerate(header):
        table.cell(0, column).text = cell
    for row_index, row in enumerate(rows, start=1):
        for column, cell in enumerate(row):
            table.cell(row_index, column).text = cell
    if path is None:
        return document
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    document.save(target)
    return target
