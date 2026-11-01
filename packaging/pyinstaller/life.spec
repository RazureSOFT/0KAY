# -*- mode: python ; coding: utf-8 -*-
"""One-file build of the L.I.F.E plugin.

Inputs come from the environment so the spec stays relative-path free:
  OKAY_REPO, OKAY_OUT, OKAY_WORK, OKAY_VERSION
"""

import os
from pathlib import Path

from PyInstaller.utils.hooks import collect_all, collect_submodules

repo = Path(os.environ["OKAY_REPO"])
pysrc = Path(os.environ["OKAY_PYSRC"])
gen = repo / "gen" / "python"

hiddenimports = [
    "grpc", "grpc.aio", "google.protobuf", "httpx", "websockets", "sqlite3", "ssl",
    # Gen's `life.v1` is merged into the `life` package by packaging/build.py;
    # name them explicitly so the collector never falls back to the
    # source-checkout-only __path__ extension.
    "life.v1.life_pb2", "life.v1.life_pb2_grpc",
]
datas = []
binaries = []

for package in ("life", "world"):
    hiddenimports += collect_submodules(package)
for package in ("core", "plugin", "mocr", "agent"):
    try:
        hiddenimports += collect_submodules(package)
    except Exception:
        pass

# Native or data-heavy dependencies. collect_all also picks up their metadata,
# which some of them read at import time.
for package in ("tantivy", "numpy", "matplotlib", "docx"):
    try:
        package_datas, package_binaries, package_hidden = collect_all(package)
        datas += package_datas
        binaries += package_binaries
        hiddenimports += package_hidden
    except Exception:
        pass

datas.append((str(repo / "life" / "manifest.json"), "."))
for pattern in ("*.json", "*.jsonl"):
    datas += [(str(path), "world") for path in (repo / "life" / "world").glob(pattern)]
datas += [(str(path), "skills") for path in (repo / "life" / "skills").glob("*.md")]

a = Analysis(
    [str(repo / "packaging" / "pyinstaller" / "life_entry.py")],
    pathex=[str(pysrc), str(repo / "life" / "src"), str(repo / "life"), str(gen), str(repo)],
    binaries=binaries,
    datas=datas,
    hiddenimports=sorted(set(hiddenimports)),
    hookspath=[],
    excludes=["tkinter", "PyQt5", "PyQt6", "PySide2", "PySide6"],
    noarchive=False,
)
pyz = PYZ(a.pure)
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name="0kay-life",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=True,
    disable_windowed_traceback=False,
)
