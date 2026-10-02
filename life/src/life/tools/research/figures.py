"""Publication figures with a CJK-capable font.

Every function builds a figure, saves it as PNG (300 dpi by default) and returns
the output ``Path``.  Call :func:`use_chinese_font` once (it is idempotent) and
matplotlib labels render Chinese instead of tofu boxes.
"""
from __future__ import annotations

import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib import font_manager  # noqa: E402

# Packaged/windows font files, tried in order, then any installed CJK family.
_FONT_FILES = (
    r"C:\Windows\Fonts\msyh.ttc",
    r"C:\Windows\Fonts\msyh.ttf",
    r"C:\Windows\Fonts\simhei.ttf",
    r"C:\Windows\Fonts\simsun.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/System/Library/Fonts/PingFang.ttc",
)
_FONT_FAMILIES = ("Microsoft YaHei", "SimHei", "SimSun", "Noto Sans CJK SC",
                  "Source Han Sans SC", "WenQuanYi Zen Hei", "PingFang SC")

_PALETTE = ("#3a6ea5", "#d64545", "#2f9e6b", "#e08a2e", "#8b5cd6",
            "#3aa0a2", "#b5567c", "#8a6d3b")
_font_ready = False


def use_chinese_font() -> str:
    """Make matplotlib render CJK; returns the resolved family ("" if none)."""
    global _font_ready
    if _font_ready:
        return plt.rcParams.get("font.sans-serif", ["DejaVu Sans"])[0]
    installed = {f.name for f in font_manager.fontManager.ttflist}
    chosen = ""
    for path in _FONT_FILES:
        if not os.path.exists(path):
            continue
        try:
            font_manager.fontManager.addfont(path)
            chosen = font_manager.FontProperties(fname=path).get_name()
            break
        except Exception:  # pragma: no cover - platform dependent
            continue
    if not chosen:
        chosen = next((name for name in _FONT_FAMILIES if name in installed), "")
    fallback = [chosen, "DejaVu Sans"] if chosen else ["DejaVu Sans"]
    plt.rcParams["font.sans-serif"] = fallback
    plt.rcParams["axes.unicode_minus"] = False
    _font_ready = True
    return chosen


def _finish(fig, path, *, dpi: int, transparent: bool) -> Path:
    use_chinese_font()
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(target, dpi=dpi, bbox_inches="tight", transparent=transparent)
    plt.close(fig)
    return target


def _fig(ax_size):
    if isinstance(ax_size, (tuple, list)):
        width, height = ax_size
    else:
        width, height = 6.4, 4.0
    fig, ax = plt.subplots(figsize=(width, height))
    return fig, ax


def line(x, series=None, *, title="", xlabel="", ylabel="", path="figure.png",
         labels=None, width=6.4, height=4.0, dpi=300, grid=True, marker="o",
         transparent=False) -> Path:
    """Line chart. ``series`` is ``{name: [y, ...]}`` (or a single list of y)."""
    fig, ax = _fig((width, height))
    series = series if isinstance(series, dict) else {"": series}
    for index, (name, values) in enumerate(series.items()):
        ax.plot(x, values, marker=marker, linewidth=1.8,
                color=_PALETTE[index % len(_PALETTE)], label=name or None)
    if any(series):
        ax.legend(frameon=False)
    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.grid(grid, alpha=0.25)
    return _finish(fig, path, dpi=dpi, transparent=transparent)


def bar(labels, values, *, title="", xlabel="", ylabel="", path="figure.png",
        width=6.4, height=4.0, dpi=300, color=None, horizontal=False,
        value_fmt="{:.3g}", transparent=False) -> Path:
    """Bar chart, optionally with the value printed at each bar."""
    fig, ax = _fig((width, height))
    positions = range(len(labels))
    draw = ax.barh if horizontal else ax.bar
    bars = draw(list(positions), values, color=color or _PALETTE[0])
    if horizontal:
        ax.set_yticks(list(positions), labels)
    else:
        ax.set_xticks(list(positions), labels)
    if value_fmt:
        for rect, value in zip(bars, values):
            if horizontal:
                ax.text(rect.get_width(), rect.get_y() + rect.get_height() / 2,
                        " " + value_fmt.format(value), va="center", fontsize=8)
            else:
                ax.text(rect.get_x() + rect.get_width() / 2, rect.get_height(),
                        value_fmt.format(value), ha="center", va="bottom", fontsize=8)
    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    return _finish(fig, path, dpi=dpi, transparent=transparent)


def grouped_bar(labels, groups, *, title="", xlabel="", ylabel="",
                path="figure.png", width=7.2, height=4.0, dpi=300,
                transparent=False) -> Path:
    """Side-by-side bars. ``groups`` is ``{name: [value per label]}``."""
    import numpy as np

    fig, ax = _fig((width, height))
    names = list(groups)
    count = max(1, len(names))
    index = np.arange(len(labels))
    span = 0.8 / count
    for offset, name in enumerate(names):
        values = groups[name]
        ax.bar(index + (offset - (count - 1) / 2) * span, values, span,
               label=name, color=_PALETTE[offset % len(_PALETTE)])
    ax.set_xticks(index, labels)
    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.legend(frameon=False)
    return _finish(fig, path, dpi=dpi, transparent=transparent)


def scatter(x, y, *, title="", xlabel="", ylabel="", path="figure.png",
            width=6.4, height=4.0, dpi=300, labels=None, trend=False,
            transparent=False) -> Path:
    """Scatter plot with optional point labels and a linear trend line."""
    fig, ax = _fig((width, height))
    ax.scatter(x, y, s=28, color=_PALETTE[0], alpha=0.85, edgecolors="white")
    if labels:
        for xi, yi, text in zip(x, y, labels):
            ax.annotate(str(text), (xi, yi), fontsize=8,
                        xytext=(4, 4), textcoords="offset points")
    if trend and len(x) >= 2:
        import numpy as np
        slope, intercept = np.polyfit(x, y, 1)
        xs = [min(x), max(x)]
        ax.plot(xs, [slope * v + intercept for v in xs], "--",
                color=_PALETTE[1], linewidth=1.4)
    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    return _finish(fig, path, dpi=dpi, transparent=transparent)


def heatmap(matrix, *, row_labels=None, col_labels=None, title="",
            path="figure.png", width=6.0, height=5.0, dpi=300,
            cmap="YlGnBu", annotate=True, transparent=False) -> Path:
    """Heatmap of a 2-D ``matrix`` with an optional colorbar and annotations."""
    import numpy as np

    values = np.asarray(matrix, dtype=float)
    fig, ax = _fig((width, height))
    image = ax.imshow(values, cmap=cmap, aspect="auto")
    if col_labels:
        ax.set_xticks(range(len(col_labels)), col_labels, rotation=45, ha="right")
    if row_labels:
        ax.set_yticks(range(len(row_labels)), row_labels)
    if annotate:
        for i in range(values.shape[0]):
            for j in range(values.shape[1]):
                ax.text(j, i, f"{values[i, j]:.3g}", ha="center", va="center",
                        fontsize=7, color="#1b2430")
    ax.set_title(title)
    fig.colorbar(image, ax=ax, shrink=0.85)
    return _finish(fig, path, dpi=dpi, transparent=transparent)
