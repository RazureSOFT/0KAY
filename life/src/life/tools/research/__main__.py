"""CLI: ``python -m life.tools.research <command>``.

Commands:
    paper      <markdown.md> -o <dir> [--title T] [--stem S]
    table      <spec.json>   -o <dir>   # {"header":[...],"rows":[[...]],"caption":""}
    plot       <spec.json>   -o <dir>   # {"kind":"line","path":"f.png", ...}
    experiment <spec.json>   -o <dir>   # {"script":"exp.py","name":...,"params":{...}}
"""
from __future__ import annotations

import argparse
import importlib.util
import inspect
import json
from pathlib import Path


def _cmd_paper(args) -> int:
    from .paper import build_paper

    markdown = Path(args.markdown)
    text = markdown.read_text(encoding="utf-8-sig")
    meta = {key: getattr(args, key) for key in ("author", "authors", "affiliation", "abstract", "keywords")
            if getattr(args, key, "")}
    paths = build_paper(
        text, args.out, title=args.title, stem=args.stem,
        base_dirs=[markdown.resolve().parent], meta=meta or None, pdf=getattr(args, "pdf", False),
    )
    for kind, path in paths.items():
        print(f"{kind}: {path}")
    return 0


def _cmd_table(args) -> int:
    from .paper import safe_stem
    from .tables import table_to_docx, table_to_html, table_to_latex

    spec = json.loads(Path(args.spec).read_text(encoding="utf-8-sig"))
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    # The spec is model-authored: sanitise the stem so it cannot escape `out`.
    stem = safe_stem(spec.get("stem", "table"), "table")
    header, rows = spec.get("header", []), spec.get("rows", [])
    caption = spec.get("caption", "")
    (out / f"{stem}.html").write_text(
        table_to_html(header, rows, caption=caption), encoding="utf-8")
    (out / f"{stem}.tex").write_text(
        table_to_latex(header, rows, caption=caption, label=spec.get("label", "")),
        encoding="utf-8")
    table_to_docx(header, rows, caption=caption, path=out / f"{stem}.docx")
    print(f"table: {out / stem}.html, .tex, .docx")
    return 0


def _cmd_plot(args) -> int:
    from . import figures

    spec = json.loads(Path(args.spec).read_text(encoding="utf-8-sig"))
    kind = spec.pop("kind", "line")
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    builder = getattr(figures, kind, None)
    if builder is None or kind not in ("line", "bar", "grouped_bar", "scatter", "heatmap"):
        raise SystemExit(f"unknown figure kind: {kind}")
    # Confine the output path to the requested directory: the spec (and thus the
    # path) is model-authored, so a relative "../x" or an absolute path outside
    # `out` must be rejected rather than written.
    raw_path = str(spec.pop("path", "") or "")
    candidate = Path(raw_path) if raw_path else Path(f"{kind}.png")
    if not candidate.is_absolute():
        candidate = out / candidate
    resolved = candidate.resolve()
    if not resolved.is_relative_to(out.resolve()):
        raise SystemExit(f"plot path escapes the output directory: {candidate}")
    resolved.parent.mkdir(parents=True, exist_ok=True)
    result = builder(path=resolved, **spec)
    print(f"{kind}: {result}")
    return 0


def _load_module(script: Path):
    """Import an experiment script by path.

    Security note: this *executes* the referenced Python file, so the
    ``experiment`` command is a code-execution surface by design.  It is meant to
    be driven with trusted, local specs only — do not feed it a spec authored by
    an untrusted model or user without review.
    """
    spec = importlib.util.spec_from_file_location(f"research_{script.stem}", script)
    if spec is None or spec.loader is None:
        raise SystemExit(f"cannot import {script}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _cmd_experiment(args) -> int:
    from .experiment import run_experiment

    spec = json.loads(Path(args.spec).read_text(encoding="utf-8-sig"))
    script = spec.get("script") or spec.get("path")
    if not script:
        raise SystemExit("experiment spec needs 'script'")
    script_path = Path(script)
    if not script_path.is_absolute():
        script_path = Path.cwd() / script_path
    if not script_path.is_file():
        raise SystemExit(f"experiment script not found: {script_path}")
    module = _load_module(script_path)
    fn = getattr(module, "main", None) or getattr(module, "run", None)
    if not callable(fn):
        raise SystemExit(f"{script_path.name} needs a main() or run() function")
    params = spec.get("params") or {}
    try:
        inspect.signature(fn).bind(**params)
        call = lambda: fn(**params)  # noqa: E731
    except TypeError:
        call = fn
    run = run_experiment(spec.get("name") or script_path.stem, call,
                         out_dir=args.out, params=params)
    print(f"run_dir: {run.run_dir}")
    print(f"seconds: {run.seconds:.3f}")
    if run.error:
        print(run.error)
        return 1
    print("result: " + json.dumps(run.result, ensure_ascii=False, default=str)[:2000])
    return 0


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="life.tools.research")
    sub = parser.add_subparsers(dest="command", required=True)

    paper = sub.add_parser("paper", help="markdown -> html + docx (+ pdf)")
    paper.add_argument("markdown")
    paper.add_argument("-o", "--out", default=".")
    paper.add_argument("--title", default="")
    paper.add_argument("--stem", default="paper")
    paper.add_argument("--author", default="")
    paper.add_argument("--authors", default="")
    paper.add_argument("--affiliation", default="")
    paper.add_argument("--abstract", default="")
    paper.add_argument("--keywords", default="")
    paper.add_argument("--pdf", action="store_true", help="also export PDF via LibreOffice if available")
    paper.set_defaults(func=_cmd_paper)

    table = sub.add_parser("table", help="three-line table -> html/tex/docx")
    table.add_argument("spec")
    table.add_argument("-o", "--out", default=".")
    table.set_defaults(func=_cmd_table)

    plot = sub.add_parser("plot", help="figure from a JSON spec")
    plot.add_argument("spec")
    plot.add_argument("-o", "--out", default=".")
    plot.set_defaults(func=_cmd_plot)

    experiment = sub.add_parser("experiment", help="run a script and record its output")
    experiment.add_argument("spec")
    experiment.add_argument("-o", "--out", default=".")
    experiment.set_defaults(func=_cmd_experiment)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
