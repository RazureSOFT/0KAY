"""Standard research toolkit: figures, tables, paper export, experiment runs.

One stable, directly-callable place for the operations paper writing keeps
re-implementing as one-off scripts (``working/make_figures.py`` etc.).  Every
function is deterministic given its inputs and returns ``pathlib.Path`` (or the
built text) so callers — an agent, a notebook, or ``python -m life.tools.research``
— never have to reinvent fonts, palettes, naming or the docx pipeline.

Modules:
    figures     matplotlib figures with a CJK-capable font (PNG/SVG/PDF)
    tables      three-line tables as HTML / LaTeX / docx
    paper       markdown -> HTML -> docx publishing pipeline
    experiment  run a callable and record stdout / result / metadata
"""
from .figures import (
    bar,
    grouped_bar,
    heatmap,
    line,
    scatter,
    use_chinese_font,
)
from .tables import table_to_docx, table_to_html, table_to_latex
from .paper import build_paper, html_to_docx, markdown_to_html
from .experiment import RunResult, run_experiment

__all__ = [
    "use_chinese_font",
    "line", "bar", "grouped_bar", "scatter", "heatmap",
    "table_to_html", "table_to_latex", "table_to_docx",
    "markdown_to_html", "html_to_docx", "build_paper",
    "run_experiment", "RunResult",
]
