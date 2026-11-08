#!/usr/bin/env python3
"""Build 0KAY installation packages.

One invocation produces, for a single target OS/architecture:

  * a portable stack archive (everything the runtime needs, no toolchains)
  * the terminal (TUI) installer for that platform
  * the desktop (Electron) installer, unless --variant tui

The Python services are frozen with PyInstaller, so this must run on the target
OS/arch (except when --allow-foreign-python is passed). Go cross-compiles, and
the Agent keeps a bundled Node runtime so an installed machine needs no Go, no
Node and no Python.

Examples:
  python packaging/build.py --variant both --os windows --arch x64 \
      --agent-dir ../0KAY-agent --mcp-dir ../0KAY-mcp --node-runtime ../node
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import platform
import shutil
import subprocess
import sys
import tarfile
import textwrap
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
HOST_OS = {'win32': 'windows', 'darwin': 'macos', 'linux': 'linux'}.get(sys.platform, sys.platform)
_MACHINE = platform.machine().lower()
HOST_ARCH = {'amd64': 'x64', 'x86_64': 'x64', 'arm64': 'arm64', 'aarch64': 'arm64'}.get(_MACHINE, _MACHINE)
GOOS = {'windows': 'windows', 'macos': 'darwin', 'linux': 'linux'}
GOARCH = {'x64': 'amd64', 'arm64': 'arm64'}
DEBARCH = {'x64': 'amd64', 'arm64': 'arm64'}

# Copy only what the runtime/build needs. The repository root also holds
# scratch logs and probe artifacts that can be locked while the app is running.
AGENT_ENTRIES = ['src', 'skills', 'manifest.json', 'package.json', 'package-lock.json', 'tsconfig.json', 'LICENSE', 'README.md']
MCP_ENTRIES = ['src', 'proto', 'manifest.json', 'package.json', 'package-lock.json', 'tsconfig.json', 'LICENSE', 'README.md']
PM_ENTRIES = ['bin', 'src', 'package.json', 'LICENSE', 'README.md']


def log(message: str) -> None:
    print(f"[packaging] {message}", flush=True)


def run(command, cwd=None, env=None, capture=False) -> str:
    log("$ " + " ".join(str(part) for part in command))
    merged = os.environ.copy()
    if env:
        merged.update({key: str(value) for key, value in env.items()})
    result = subprocess.run(
        [str(part) for part in command],
        cwd=str(cwd) if cwd else None,
        env=merged,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.STDOUT if capture else None,
    )
    if result.returncode != 0:
        if capture and result.stdout:
            print(result.stdout, file=sys.stderr)
        raise RuntimeError(f"command failed ({result.returncode}): {' '.join(map(str, command))}")
    return (result.stdout or "").strip()


def copy_tree(source: Path, destination: Path, *, ignore=()) -> None:
    if not source.exists():
        raise FileNotFoundError(source)
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(source, destination, ignore=shutil.ignore_patterns(*ignore), symlinks=False)


def clean(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def write_text(path: Path, text: str, mode: int = 0o644) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")
    if os.name != "nt":
        path.chmod(mode)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def exe(name: str, target_os: str) -> str:
    return f"{name}.exe" if target_os == "windows" else name


def npm_command(target_os: str) -> str:
    return "npm.cmd" if target_os == "windows" else "npm"


def read_version(explicit: str | None) -> str:
    if explicit:
        return explicit.lstrip("v")
    manifest = json.loads((REPO / "manifest.json").read_text(encoding="utf-8"))
    return str(manifest.get("version") or "0.0.0").lstrip("v")


# ---------------------------------------------------------------------------
# stack
# ---------------------------------------------------------------------------

def build_webui(args) -> Path:
    dist = REPO / "webui" / "dist"
    if args.rebuild_webui or not (dist / "index.html").exists():
        npm = npm_command(HOST_OS)
        if not args.skip_npm:
            run([npm, "ci"], cwd=REPO / "webui")
        run([npm, "run", "build"], cwd=REPO / "webui")
    if not (dist / "index.html").exists():
        raise RuntimeError("webui/dist/index.html is missing after the build")
    return dist


def build_plugin_pages(args) -> None:
    """Build the plugin page bundles that Core serves from core/data/plugin-ui.

    These used to be committed, so a checkout had them and packaging could just
    copy the directory. They are build output now (see .gitignore): a fresh clone
    has *no* page module at all — only the hand-written ones in compat/,
    darkmode/ and marketplace/. Packaging without this step produced an installer
    whose every plugin page renders blank, because Core finds an empty directory
    and serves nothing.

    Ordered so a missing prerequisite fails loudly rather than silently:
    1. `webui build:plugin` — chat/settings/plugins/usage/console.
    2. each `plugin-web/<name>` — agent, life, minecraft, skillsguishow.

    `--skip-npm` skips the dependency install, not the build: the bundles are
    required output, while `node_modules` may already be in place.
    """
    npm = npm_command(HOST_OS)

    def needs_install(package_dir: Path) -> bool:
        return not (package_dir / "node_modules").exists()

    def build(package_dir: Path, script: str, artifacts) -> None:
        label = package_dir.relative_to(REPO).as_posix()
        if not args.skip_npm and needs_install(package_dir):
            run([npm, "ci"], cwd=package_dir)
        run([npm, "run", script], cwd=package_dir)
        missing = [path for path in artifacts if not path.exists()]
        if missing:
            names = ", ".join(str(path.relative_to(REPO)) for path in missing)
            raise RuntimeError(f"{label}: {script} did not produce {names}")

    webui = REPO / "webui"
    build(
        webui,
        "build:plugin",
        [webui.parent / "core" / "data" / "plugin-ui" / "webui" / f"{name}.js"
         for name in ("chat", "settings", "plugins", "usage", "console")],
    )

    for name in ("agent", "life", "minecraft", "skillsguishow"):
        package_dir = REPO / "plugin-web" / name
        if not (package_dir / "package.json").exists():
            continue
        # Each plugin decides its own output filenames; asserting the directory
        # gained a file is what catches a build that ran but emitted nothing.
        out_dir = REPO / "core" / "data" / "plugin-ui" / name
        before = set(out_dir.glob("*.js")) if out_dir.exists() else set()
        if not args.skip_npm and needs_install(package_dir):
            run([npm, "ci"], cwd=package_dir)
        run([npm, "run", "build"], cwd=package_dir)
        after = set(out_dir.glob("*.js")) if out_dir.exists() else set()
        if not after or (args.rebuild_webui and after == before):
            raise RuntimeError(f"plugin-web/{name}: build produced no page module in {out_dir}")


def build_go(base: Path, args) -> None:
    bin_dir = base / "bin"
    bin_dir.mkdir(parents=True, exist_ok=True)
    env = {
        "GOOS": GOOS[args.os],
        "GOARCH": GOARCH[args.arch],
        "CGO_ENABLED": "0",
    }
    version_flag = f"-X 0kay/core/internal/version.Version={args.version}"
    targets = [
        (REPO / "core", "core", [version_flag]),
        (REPO / "mocr", "mocr", []),
        (REPO / "core", "0kay", [f"-X main.version={args.version}"]),
    ]
    for module, name, flags in targets:
        ldflags = " ".join(["-s", "-w", *flags])
        run(
            [
                "go", "build", "-trimpath", "-ldflags", ldflags,
                "-o", str(bin_dir / exe(name, args.os)),
                f"./cmd/{name}",
            ],
            cwd=module,
            env=env,
        )


def prepare_python_sources(work: Path) -> Path:
    """Merge the generated `life.v1` protobufs into the `life` package.

    In a source checkout `life/__init__.py` appends `gen/python/life` to the
    package `__path__`, which PyInstaller cannot follow. A real subpackage is
    produced here so the frozen binary imports `life.v1` normally.
    """
    merged = work / "pysrc"
    clean(merged)
    shutil.copytree(REPO / "life" / "src" / "life", merged / "life", symlinks=False)
    generated = REPO / "gen" / "python" / "life"
    if generated.exists():
        shutil.copytree(generated, merged / "life", dirs_exist_ok=True, symlinks=False)
    return merged


def build_python(base: Path, work: Path, args) -> None:
    if args.skip_python:
        # Not a silent skip: LIFE is the companion (chat + company) service, and
        # without it the package starts with those pages missing. A bundle with no
        # life looks exactly like a complete one from the outside — it installs,
        # it starts, and only the navigation betrays the difference — so say it
        # loudly enough that a release build is not cut from one by accident.
        log("")
        log("  !! --skip-python: LIFE is NOT packaged.")
        log("  !! The result runs, but has no companion/chat service and its pages")
        log("  !! will be missing. Never ship this artifact as a release.")
        log("")
        return
    python = args.python or sys.executable
    if not args.skip_python_deps:
        run([python, "-m", "pip", "install", "--upgrade", "pip"])
        run([python, "-m", "pip", "install", "--upgrade", "pyinstaller"])
        run([python, "-m", "pip", "install", "-e", f"{REPO / 'life'}[research]"])

    sources = prepare_python_sources(work)
    env = os.environ.copy()
    # `pysrc` comes first so `life` resolves to the merged package, while the
    # shared protobuf packages (core/plugin/mocr/agent) still come from gen.
    env["PYTHONPATH"] = os.pathsep.join([
        str(sources),
        str(REPO / "gen" / "python"),
        str(REPO / "life" / "src"),
        str(REPO / "life"),
        str(REPO),
        env.get("PYTHONPATH", ""),
    ]).strip(os.pathsep)
    bin_dir = base / "bin"
    bin_dir.mkdir(parents=True, exist_ok=True)
    (work / "pyi" / "spec").mkdir(parents=True, exist_ok=True)

    run(
        [
            python, "-m", "PyInstaller", "--noconfirm", "--clean",
            "--onefile", "--console", "--name", "0kay-tui",
            "--distpath", str(bin_dir),
            "--workpath", str(work / "pyi" / "tui"),
            "--specpath", str(work / "pyi" / "spec"),
            "--paths", str(REPO / "tui"),
            str(REPO / "tui" / "0kay.py"),
        ],
        env=env,
    )

    life_env = dict(env)
    life_env.update({
        "OKAY_REPO": str(REPO),
        "OKAY_PYSRC": str(sources),
        "OKAY_OUT": str(bin_dir),
        "OKAY_WORK": str(work / "pyi" / "life"),
        "OKAY_VERSION": args.version,
    })
    run(
        [
            python, "-m", "PyInstaller", "--noconfirm", "--clean",
            "--distpath", str(bin_dir),
            "--workpath", str(work / "pyi" / "life"),
            str(REPO / "packaging" / "pyinstaller" / "life.spec"),
        ],
        env=life_env,
    )


def build_life_assets(base: Path) -> None:
    # A frozen process reads these through package-relative paths and through
    # the working directory; both are satisfied by shipping them beside bin/.
    copy_tree(REPO / "life" / "world", base / "world", ignore=("__pycache__",))
    copy_tree(REPO / "life" / "skills", base / "skills")
    (base / "models").mkdir(exist_ok=True)


def build_core_seed(base: Path) -> None:
    # Core reads plugin UI modules and built-in UI patches from its data dir.
    # The launcher copies this seed into the writable data root on start, so a
    # fresh install has the shipped plugin pages without a source checkout.
    seed = base / "seed" / "core"
    for name in ("plugin-ui", "ui"):
        source = REPO / "core" / "data" / name
        if source.exists():
            # fluentui.patch is a runtime artifact installed by 0kay-pm, and
            # assets/ is an exploded build tree; neither ships in the bundle.
            copy_tree(source, seed / name, ignore=("assets", "__pycache__", "fluentui.patch"))


def copy_entries(source: Path, destination: Path, entries) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    for entry in entries:
        candidate = source / entry
        if not candidate.exists():
            continue
        target = destination / entry
        if candidate.is_dir():
            shutil.copytree(candidate, target, ignore=shutil.ignore_patterns('__pycache__'), symlinks=False)
        else:
            shutil.copy2(candidate, target)


def copy_node_runtime(destination_root: Path, args) -> None:
    """Ship Node once; both 0kay-pm and the Agent run on it."""
    runtime = destination_root / "runtimes" / "node"
    if runtime.exists():
        return
    runtime.mkdir(parents=True, exist_ok=True)
    if not args.node_runtime:
        raise RuntimeError("--node-runtime is required when bundling 0kay-pm or the Agent")
    node_runtime = Path(args.node_runtime).resolve()
    if not node_runtime.exists():
        raise FileNotFoundError(f"--node-runtime not found: {node_runtime}")
    if node_runtime.is_dir():
        copy_tree(node_runtime, runtime, ignore=("npm", "npx", "corepack", "node_modules"))
    else:
        shutil.copy2(node_runtime, runtime / exe("node", args.os))


def build_pm(base: Path, args) -> None:
    if not args.pm_dir:
        log("no --pm-dir; 0kay-pm is not bundled")
        return
    source = Path(args.pm_dir).resolve()
    if not source.exists():
        raise FileNotFoundError(f"--pm-dir not found: {source}")
    copy_entries(source, base / "pm", PM_ENTRIES)


def build_agent(overlay: Path, args) -> None:
    if not args.with_agent:
        return
    if not args.agent_dir or not args.mcp_dir:
        raise RuntimeError("--with-agent needs --agent-dir and --mcp-dir")
    agent_src = Path(args.agent_dir).resolve()
    mcp_src = Path(args.mcp_dir).resolve()

    copy_entries(agent_src, overlay / "agent", AGENT_ENTRIES)
    copy_entries(mcp_src, overlay / "mcp", MCP_ENTRIES)
    copy_tree(REPO / "proto", overlay / "proto")

    npm = npm_command(HOST_OS)
    if not args.skip_npm:
        run([npm, "ci"], cwd=overlay / "mcp")
        run([npm, "run", "build"], cwd=overlay / "mcp")
        run([npm, "ci"], cwd=overlay / "agent")
        run([npm, "run", "build"], cwd=overlay / "agent")
    else:
        log("skipping npm (--skip-npm); the agent and mcp trees must already be built")


def write_launcher_assets(base: Path, args) -> None:
    if args.os == "windows":
        write_text(
            base / "0kay.cmd",
            "@echo off\r\n"
            "\"%~dp0bin\\0kay.exe\" tui\r\n"
            "if errorlevel 1 pause\r\n",
        )
        if args.pm_dir:
            write_text(
                base / "0kay-pm.cmd",
                "@echo off\r\n"
                "\"%~dp0bin\\0kay-pm.cmd\" %*\r\n",
            )
            write_text(
                base / "bin" / "0kay-pm.cmd",
                "@echo off\r\n"
                "\"%~dp0..\\runtimes\\node\\node.exe\" \"%~dp0..\\pm\\bin\\0kay-pm.mjs\" %*\r\n",
            )
        # Shared by both Windows installers. User-level PATH only; no admin.
        write_text(
            base / "bin" / "0kay-path.ps1",
            "param([string]$Dir, [switch]$Remove)\n"
            "$current = [Environment]::GetEnvironmentVariable('Path','User')\n"
            "if ($null -eq $current) { $current = '' }\n"
            "$parts = @($current -split ';' | Where-Object { $_ -and ($_ -ne $Dir) })\n"
            "if (-not $Remove) { $parts = @($Dir) + $parts }\n"
            "[Environment]::SetEnvironmentVariable('Path', ($parts -join ';'), 'User')\n"
            "exit 0\n",
        )
    else:
        write_text(
            base / "0kay",
            "#!/bin/sh\n"
            "exec \"$(dirname \"$0\")/bin/0kay\" tui\n",
            mode=0o755,
        )
        if args.pm_dir:
            write_text(
                base / "0kay-pm",
                "#!/bin/sh\n"
                "exec \"$(dirname \"$0\")/bin/0kay-pm\" \"$@\"\n",
                mode=0o755,
            )
            write_text(
                base / "bin" / "0kay-pm",
                "#!/bin/sh\n"
                "root=\"$(cd \"$(dirname \"$0\")/..\" && pwd)\"\n"
                "exec \"$root/runtimes/node/bin/node\" \"$root/pm/bin/0kay-pm.mjs\" \"$@\"\n",
                mode=0o755,
            )

    manifest = {
        "schema": 1,
        "name": "@razuresoft/0kay",
        "version": args.version,
        "bundle": {
            "variant": args.variant,
            "os": args.os,
            "arch": args.arch,
        },
    }
    write_text(base / "manifest.json", json.dumps(manifest, indent=2) + "\n")
    write_text(base / "VERSION", args.version + "\n")
    write_text(base / "README-INSTALL.txt", textwrap.dedent(f"""\
        0KAY {args.version} ({args.os}/{args.arch})
        {"=" * 44}

        Start the terminal client:
          ./bin/0kay            (Windows: 0kay.cmd)

        The launcher starts Core, mocr, LIFE{" and the Agent" if args.with_agent else ""}, serves
        the WebUI at http://127.0.0.1:8080 and opens the TUI.

        Other commands:
          0kay run      keep the stack in the foreground (used by services)
          0kay up       start in the background
          0kay down     stop everything
          0kay status   health, ports and pids
          0kay logs NAME
        {"\n        Package manager (bundled, no npm needed):\n          ./0kay-pm          (Windows: 0kay-pm.cmd)\n          0kay-pm --help\n  0kay-pm install    download or update the release bundle" if args.pm_dir else ""}

        Data normally lives under data/ next to this file; read-only installs
        (AppImage, /opt, .app) fall back to ~/.0kay/data. runtime-env.json holds
        the generated tokens and ports; do not share it.
        """))


def set_executables(base: Path, args) -> None:
    if args.os == "windows":
        return
    for relative in ("bin/core", "bin/mocr", "bin/0kay", "bin/0kay-tui", "bin/0kay-life", "bin/0kay-pm"):
        candidate = base / relative
        if candidate.exists():
            candidate.chmod(0o755)
    for candidate in (base / "runtimes").rglob("node"):
        if candidate.is_file():
            candidate.chmod(0o755)
    for relative in ("0kay", "0kay-pm"):
        top = base / relative
        if top.exists():
            top.chmod(0o755)


def assemble(args, work: Path) -> tuple[Path, Path]:
    base = work / "base"
    overlay = work / "overlay"
    clean(base)
    clean(overlay)

    dist = build_webui(args)
    # Before build_core_seed: that step copies core/data/plugin-ui into the
    # installer's seed, so the page bundles have to exist by then.
    build_plugin_pages(args)
    copy_tree(dist, base / "webui")
    build_go(base, args)
    build_python(base, work, args)
    build_life_assets(base)
    build_core_seed(base)
    build_pm(base, args)
    if args.pm_dir or args.with_agent:
        copy_node_runtime(base, args)
    build_agent(overlay, args)
    write_launcher_assets(base, args)
    set_executables(base, args)
    return base, overlay


# ---------------------------------------------------------------------------
# packaging
# ---------------------------------------------------------------------------

def combined_tree(base: Path, overlay: Path, work: Path) -> Path:
    combined = work / "combined"
    clean(combined)
    for entry in base.iterdir():
        target = combined / entry.name
        if entry.is_dir():
            shutil.copytree(entry, target, symlinks=False)
        else:
            shutil.copy2(entry, target)
    if overlay.exists() and any(overlay.iterdir()):
        for entry in overlay.iterdir():
            target = combined / entry.name
            if entry.is_dir():
                shutil.copytree(entry, target, dirs_exist_ok=True, symlinks=False)
            else:
                shutil.copy2(entry, target)
    return combined


def make_portable(tree: Path, out: Path, args) -> Path:
    name = f"0kay-{args.os}-{args.arch}-v{args.version}"
    archive = out / f"{name}.tar.gz"
    log(f"portable {archive.name}")
    with tarfile.open(archive, "w:gz", dereference=True) as tar:
        tar.add(tree, arcname=name)
    return archive


def make_windows_installer(base: Path, overlay: Path, out: Path, work: Path, args) -> Path | None:
    makensis = shutil.which("makensis")
    if not makensis:
        log("makensis not found; skipping the Windows TUI installer")
        return None
    out.mkdir(parents=True, exist_ok=True)
    script = work / "0kay-setup.nsi"
    outfile = out / f"0KAY-Setup-{args.version}-{args.arch}.exe"
    branding = str(REPO / "packaging" / "branding")
    overlay_dir = overlay if overlay.exists() and any(overlay.iterdir()) else None
    has_pm = base.joinpath("0kay-pm.cmd").exists()

    pm_files = ""
    pm_shortcut = ""
    if has_pm:
        pm_files = rf'''  SetOutPath "$INSTDIR\bin"
  File "{base}\bin\0kay-pm.cmd"
  SetOutPath "$INSTDIR"
  File /r "{base}\pm"
  File /r "{base}\runtimes"
  File "{base}\0kay-pm.cmd"
'''
        pm_shortcut = r'''  CreateShortcut "$SMPROGRAMS\0KAY\0KAY Package Manager.lnk" "$SYSDIR\cmd.exe" '/k "$INSTDIR\0kay-pm.cmd"' '''

    agent_section = ""
    if overlay_dir:
        agent_files = "\n".join(
            f'  File /r "{overlay_dir}\\{name}"'
            for name in ("agent", "mcp", "proto")
            if (overlay_dir / name).exists()
        )
        agent_section = rf'''
Section "Agent + MCP plugins" SEC_AGENT
  SetOutPath "$INSTDIR"
{agent_files}
SectionEnd
'''

    write_text(script, rf'''Unicode true
!include "MUI2.nsh"
!include "WinMessages.nsh"
!include "LogicLib.nsh"
!include "nsDialogs.nsh"
Name "0KAY"
OutFile "{outfile}"
InstallDir "$LOCALAPPDATA\0KAY"
InstallDirRegKey HKCU "Software\0KAY" "InstallDir"
RequestExecutionLevel user
SetCompressor /SOLID lzma

Var okayAddPath
Var okayPathCheck
Var okayDescFont
Var okayHTTP
Var okayGRPC
Var okayMocrField
Var okayLifeField
Var okayAgentField
Var okayHTTPPort
Var okayGRPCPort
Var okayMocrPort
Var okayLifePort
Var okayAgentPort

!define MUI_ICON "{branding}\installerIcon.ico"
!define MUI_UNICON "{branding}\uninstallerIcon.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_RIGHT
!define MUI_HEADERIMAGE_BITMAP "{branding}\installerHeader.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "{branding}\installerSidebar.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "{branding}\uninstallerSidebar.bmp"
!define MUI_BRANDINGTEXT "0KAY  ·  v{args.version}"
!define MUI_WELCOMEPAGE_TITLE "Welcome to 0KAY"
!define MUI_WELCOMEPAGE_TEXT "0KAY is a self-hosted AI companion with a real agent underneath.$\r$\n$\r$\nThis installer sets up Core, the WebUI, LIFE, mocr, the terminal client, 0kay-pm and the Agent plugins you select. Nothing is compiled on this machine."
!define MUI_FINISHPAGE_TITLE "0KAY is installed"
!define MUI_FINISHPAGE_TEXT "Open a new terminal and run 0kay to start the stack. 0kay-pm is on the same PATH for installing more plugins.$\r$\n$\r$\nData is kept under the install folder, or in %USERPROFILE%\.0kay\data when the install tree is read-only."
!define MUI_FINISHPAGE_LINK "Project page"
!define MUI_FINISHPAGE_LINK_LOCATION "https://github.com/RazureSOFT/0KAY"
!define MUI_ABORTWARNING
!define MUI_COMPONENTSPAGE_SMALLDESC
!define MUI_FINISHPAGE_RUN "$INSTDIR\bin\0kay.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Start 0KAY"
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_COMPONENTS
Page custom OptionsPagePre OptionsPageLeave
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

!macro okayPortsDiffer A B
  StrCmp "${{A}}" "${{B}}" 0 +3
    MessageBox MB_OK|MB_ICONEXCLAMATION "Ports must be different."
    Abort
!macroend

!macro okayValidatePort VALUE
  IntOp $R0 "${{VALUE}}" + 0
  IntCmp $R0 1 0 okayPortsBad 0
  IntCmp $R0 65535 0 0 okayPortsBad
!macroend

!macro okayEnsurePortDefaults
  StrCmp $okayHTTPPort "" 0 +2
    StrCpy $okayHTTPPort "8080"
  StrCmp $okayGRPCPort "" 0 +2
    StrCpy $okayGRPCPort "50051"
  StrCmp $okayMocrPort "" 0 +2
    StrCpy $okayMocrPort "50052"
  StrCmp $okayLifePort "" 0 +2
    StrCpy $okayLifePort "50053"
  StrCmp $okayAgentPort "" 0 +2
    StrCpy $okayAgentPort "50054"
!macroend

Function OptionsPagePre
  nsDialogs::Create 1018
  Pop $0
  ${{If}} $0 == error
    Abort
  ${{EndIf}}

  CreateFont $okayDescFont "Segoe UI" 9 400
  ${{NSD_CreateLabel}} 0 30u 100% 10u "Add 0KAY to PATH. The WebUI uses the Core HTTP port."
  Pop $0
  SendMessage $0 ${{WM_SETFONT}} $okayDescFont 1
  SetCtlColors $0 0x68635F

  ${{NSD_CreateCheckbox}} 0 46u 100% 8u "Add 0KAY to PATH (0kay, 0kay-tui, 0kay-pm)"
  Pop $okayPathCheck
  ${{NSD_Check}} $okayPathCheck

  ${{NSD_CreateLabel}} 0 62u 100% 10u "More plugins can be added later with 0kay-pm."
  Pop $0

  ${{NSD_CreateLabel}} 0 84u 100% 10u "Ports"
  Pop $0
  SendMessage $0 ${{WM_SETFONT}} $okayDescFont 1
  SetCtlColors $0 0x6A6A00

  ${{NSD_CreateLabel}} 0 94u 42u 9u "Core HTTP"
  Pop $0
  StrCpy $R0 "8080"
  StrCmp $okayHTTPPort "" +2 0
  StrCpy $R0 $okayHTTPPort
  ${{NSD_CreateText}} 44u 93u 28u 9u "$R0"
  Pop $okayHTTP

  ${{NSD_CreateLabel}} 86u 94u 44u 9u "Core gRPC"
  Pop $0
  StrCpy $R0 "50051"
  StrCmp $okayGRPCPort "" +2 0
  StrCpy $R0 $okayGRPCPort
  ${{NSD_CreateText}} 132u 93u 28u 9u "$R0"
  Pop $okayGRPC

  ${{NSD_CreateLabel}} 0 108u 42u 9u "mocr gRPC"
  Pop $0
  StrCpy $R0 "50052"
  StrCmp $okayMocrPort "" +2 0
  StrCpy $R0 $okayMocrPort
  ${{NSD_CreateText}} 44u 107u 28u 9u "$R0"
  Pop $okayMocrField

  ${{NSD_CreateLabel}} 86u 108u 44u 9u "LIFE gRPC"
  Pop $0
  StrCpy $R0 "50053"
  StrCmp $okayLifePort "" +2 0
  StrCpy $R0 $okayLifePort
  ${{NSD_CreateText}} 132u 107u 28u 9u "$R0"
  Pop $okayLifeField

  ${{NSD_CreateLabel}} 0 122u 42u 9u "Agent gRPC"
  Pop $0
  StrCpy $R0 "50054"
  StrCmp $okayAgentPort "" +2 0
  StrCpy $R0 $okayAgentPort
  ${{NSD_CreateText}} 44u 121u 28u 9u "$R0"
  Pop $okayAgentField

  !insertmacro MUI_HEADER_TEXT "Options" "PATH, ports and plugins"
  nsDialogs::Show
FunctionEnd

Function OptionsPageLeave
  ${{NSD_GetState}} $okayPathCheck $0
  ${{If}} $0 == ${{BST_CHECKED}}
    StrCpy $okayAddPath "1"
  ${{Else}}
    StrCpy $okayAddPath "0"
  ${{EndIf}}

  ${{NSD_GetText}} $okayHTTP $okayHTTPPort
  ${{NSD_GetText}} $okayGRPC $okayGRPCPort
  ${{NSD_GetText}} $okayMocrField $okayMocrPort
  ${{NSD_GetText}} $okayLifeField $okayLifePort
  ${{NSD_GetText}} $okayAgentField $okayAgentPort

  !insertmacro okayEnsurePortDefaults
  !insertmacro okayValidatePort $okayHTTPPort
  !insertmacro okayValidatePort $okayGRPCPort
  !insertmacro okayValidatePort $okayMocrPort
  !insertmacro okayValidatePort $okayLifePort
  !insertmacro okayValidatePort $okayAgentPort

  !insertmacro okayPortsDiffer $okayHTTPPort $okayGRPCPort
  !insertmacro okayPortsDiffer $okayHTTPPort $okayMocrPort
  !insertmacro okayPortsDiffer $okayHTTPPort $okayLifePort
  !insertmacro okayPortsDiffer $okayHTTPPort $okayAgentPort
  !insertmacro okayPortsDiffer $okayGRPCPort $okayMocrPort
  !insertmacro okayPortsDiffer $okayGRPCPort $okayLifePort
  !insertmacro okayPortsDiffer $okayGRPCPort $okayAgentPort
  !insertmacro okayPortsDiffer $okayMocrPort $okayLifePort
  !insertmacro okayPortsDiffer $okayMocrPort $okayAgentPort
  !insertmacro okayPortsDiffer $okayLifePort $okayAgentPort
  Return

  okayPortsBad:
    MessageBox MB_OK|MB_ICONEXCLAMATION "Ports must be numbers between 1 and 65535."
    Abort
FunctionEnd

Function .onInstSuccess
  ${{If}} $okayAddPath != "0"
    nsExec::ExecToLog 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\bin\0kay-path.ps1" "$INSTDIR\bin"'
    SendMessage ${{HWND_BROADCAST}} ${{WM_SETTINGCHANGE}} 0 "STR:Environment" /TIMEOUT=5000
  ${{EndIf}}
FunctionEnd

Section "Core + 0kay-pm" SEC_CORE
  SectionIn RO
  SetOutPath "$INSTDIR\bin"
  File "{base}\bin\0kay.exe"
  File "{base}\bin\core.exe"
  File "{base}\bin\0kay-path.ps1"
  SetOutPath "$INSTDIR"
  File /r "{base}\seed"
  File "{base}\manifest.json"
  File "{base}\VERSION"
  File "{base}\README-INSTALL.txt"
{pm_files}  WriteUninstaller "$INSTDIR\uninstall.exe"
  CreateDirectory "$SMPROGRAMS\0KAY"
{pm_shortcut}
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\0KAY" "DisplayName" "0KAY"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\0KAY" "DisplayVersion" "{args.version}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\0KAY" "Publisher" "RazureSOFT"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\0KAY" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegStr HKCU "Software\0KAY" "InstallDir" "$INSTDIR"
  !insertmacro okayEnsurePortDefaults
  FileOpen $9 "$INSTDIR\runtime-env.json" w
  FileWrite $9 '{{$\r$\n'
  FileWrite $9 '  "CORE_HTTP_PORT": "$okayHTTPPort",$\r$\n'
  FileWrite $9 '  "CORE_GRPC_PORT": "$okayGRPCPort",$\r$\n'
  FileWrite $9 '  "MOCR_GRPC_PORT": "$okayMocrPort",$\r$\n'
  FileWrite $9 '  "LIFE_GRPC_PORT": "$okayLifePort",$\r$\n'
  FileWrite $9 '  "AGENT_GRPC_PORT": "$okayAgentPort"$\r$\n'
  FileWrite $9 '}}$\r$\n'
  FileClose $9

SectionEnd

Section "WebUI" SEC_WEBUI
  SetOutPath "$INSTDIR"
  File /r "{base}\webui"
SectionEnd

Section "Terminal client (TUI)" SEC_TUI
  SetOutPath "$INSTDIR\bin"
  File "{base}\bin\0kay-tui.exe"
  SetOutPath "$INSTDIR"
  File "{base}\0kay.cmd"
  CreateShortcut "$SMPROGRAMS\0KAY\0KAY Terminal.lnk" "$INSTDIR\0kay.cmd"
SectionEnd

Section "LIFE companion" SEC_LIFE
  SetOutPath "$INSTDIR\bin"
  File "{base}\bin\0kay-life.exe"
  SetOutPath "$INSTDIR"
  File /r "{base}\world"
  File /r "{base}\skills"
  CreateDirectory "$INSTDIR\models"
SectionEnd

Section "mocr model gateway" SEC_MOCR
  SetOutPath "$INSTDIR\bin"
  File "{base}\bin\mocr.exe"
SectionEnd
{agent_section}
Section "Uninstall"
  nsExec::ExecToLog 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\bin\0kay-path.ps1" "$INSTDIR\bin" -Remove'
  nsExec::ExecToLog '"$INSTDIR\bin\0kay.exe" down'
  Delete "$SMPROGRAMS\0KAY\0KAY Terminal.lnk"
  Delete "$SMPROGRAMS\0KAY\0KAY TUI.lnk"
  Delete "$SMPROGRAMS\0KAY\0KAY Package Manager.lnk"
  RMDir "$SMPROGRAMS\0KAY"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\0KAY"
  DeleteRegKey HKCU "Software\0KAY"
  RMDir /r "$INSTDIR"
SectionEnd

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${{SEC_CORE}} "Launcher, Core, 0kay-pm and the Node runtime. Required."
  !insertmacro MUI_DESCRIPTION_TEXT ${{SEC_WEBUI}} "Browser interface served by Core at http://127.0.0.1:8080."
  !insertmacro MUI_DESCRIPTION_TEXT ${{SEC_TUI}} "The 0kay and 0kay-tui terminal commands."
  !insertmacro MUI_DESCRIPTION_TEXT ${{SEC_LIFE}} "The companion persona, memory and mood."
  !insertmacro MUI_DESCRIPTION_TEXT ${{SEC_MOCR}} "The model gateway used for provider access and streaming."
  !insertmacro MUI_DESCRIPTION_TEXT ${{SEC_AGENT}} "Agent and MCP plugins. More plugins can be installed later with 0kay-pm."
!insertmacro MUI_FUNCTION_DESCRIPTION_END
''')
    run([makensis, "/V2", str(script)])
    return outfile


def make_macos_installer(tree: Path, out: Path, work: Path, args) -> Path | None:
    pkgbuild = shutil.which("pkgbuild")
    if not pkgbuild:
        log("pkgbuild not found; skipping the macOS installer")
        return None
    scripts = work / "pkg-scripts"
    scripts.mkdir(parents=True, exist_ok=True)
    write_text(
        scripts / "postinstall",
        "#!/bin/sh\n"
        "mkdir -p /usr/local/bin\n"
        "ln -sf /usr/local/0kay/bin/0kay /usr/local/bin/0kay\n"
        "ln -sf /usr/local/0kay/bin/0kay-pm /usr/local/bin/0kay-pm\n"
        "exit 0\n",
        mode=0o755,
    )
    component = out / f"0KAY-Setup-{args.version}-{args.arch}-component.pkg"
    final = out / f"0KAY-Setup-{args.version}-{args.arch}.pkg"
    run([
        pkgbuild,
        "--root", str(tree),
        "--identifier", "dev.0kay.tui",
        "--version", args.version,
        "--install-location", "/usr/local/0kay",
        "--scripts", str(scripts),
        str(component),
    ])
    if shutil.which("productbuild"):
        run([
            "productbuild",
            "--package", str(component),
            "--identifier", "dev.0kay.tui",
            "--version", args.version,
            str(final),
        ])
        component.unlink(missing_ok=True)
    else:
        component.rename(final)
    return final


def make_linux_installer(tree: Path, out: Path, work: Path, args) -> Path | None:
    dpkg = shutil.which("dpkg-deb")
    if not dpkg:
        log("dpkg-deb not found; skipping the .deb")
        return None
    root = work / "deb"
    clean(root)
    target = root / "opt" / "0kay"
    copy_tree(tree, target)
    link = root / "usr" / "bin" / "0kay"
    link.parent.mkdir(parents=True, exist_ok=True)
    if link.is_symlink() or link.exists():
        link.unlink()
    link.symlink_to("/opt/0kay/bin/0kay")
    if (target / "bin" / "0kay-pm").exists():
        pm_link = root / "usr" / "bin" / "0kay-pm"
        if pm_link.is_symlink() or pm_link.exists():
            pm_link.unlink()
        pm_link.symlink_to("/opt/0kay/bin/0kay-pm")
    control_dir = root / "DEBIAN"
    control_dir.mkdir(parents=True, exist_ok=True)
    write_text(
        control_dir / "control",
        f"""Package: 0kay
Version: {args.version}
Section: utils
Priority: optional
Architecture: {DEBARCH[args.arch]}
Maintainer: RazureSOFT <dev@razuresoft.dev>
Depends: ca-certificates, libc6
Description: 0KAY local AI companion platform
 Core, mocr, LIFE, the bundled WebUI, the terminal client and the supervisor.
 Start it with `0kay`.
""",
    )
    deb = out / f"0kay-terminal_{args.version}_{DEBARCH[args.arch]}.deb"
    run([dpkg, "--build", "--root-owner-group", str(root), str(deb)])
    return deb


def make_desktop(tree: Path, out: Path, work: Path, args) -> list[Path]:
    desktop = REPO / "desktop"
    stack = desktop / "resources-stack"
    clean(stack)
    for entry in tree.iterdir():
        target = stack / entry.name
        if entry.is_dir():
            shutil.copytree(entry, target, symlinks=False)
        else:
            shutil.copy2(entry, target)

    npm = npm_command(HOST_OS)
    if not args.skip_npm:
        install = "ci" if (desktop / "package-lock.json").exists() else "install"
        run([npm, install], cwd=desktop)

    output = work / "electron"
    clean(output)
    env = {"CSC_IDENTITY_AUTO_DISCOVERY": "false"}
    platform_flag = {"windows": "--win", "macos": "--mac", "linux": "--linux"}[args.os]
    arch_flag = {"x64": "--x64", "arm64": "--arm64"}[args.arch]
    builder = desktop / "node_modules" / ".bin" / ("electron-builder.cmd" if HOST_OS == "windows" else "electron-builder")
    if not builder.exists():
        raise RuntimeError("electron-builder is not installed; run npm ci in desktop/")
    run(
        [str(builder), platform_flag, arch_flag, "--publish", "never",
         f"-c.directories.output={output}"],
        cwd=desktop,
        env=env,
    )
    artifacts = []
    patterns = {
        "windows": ["*.exe"],
        "macos": ["*.dmg"],
        "linux": ["*.AppImage", "*.deb"],
    }[args.os]
    for pattern in patterns:
        # Top-level only: win-unpacked/ and mac/ contain the app itself, not an
        # installer, and copying those produces misleading artifacts.
        for artifact in output.glob(pattern):
            destination = out / artifact.name
            shutil.copy2(artifact, destination)
            artifacts.append(destination)
    return artifacts


def write_checksums(out: Path, args) -> None:
    sums = []
    for artifact in sorted(out.iterdir()):
        if artifact.is_file() and not artifact.name.endswith(".sha256") and not artifact.name.startswith("SHA256SUMS"):
            digest = sha256(artifact)
            sums.append(f"{digest}  {artifact.name}")
            (out / f"{artifact.name}.sha256").write_text(f"{digest}  {artifact.name}\n", encoding="utf-8")
    # Per-target file name: six matrix jobs upload to the same release, and a
    # single SHA256SUMS would overwrite the previous targets' entries.
    (out / f"SHA256SUMS-{args.os}-{args.arch}").write_text("\n".join(sums) + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# entry point
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description="Build 0KAY installers")
    parser.add_argument("--variant", choices=["tui", "desktop", "both"], default="both")
    parser.add_argument("--os", dest="os", choices=["windows", "macos", "linux"], default=HOST_OS)
    parser.add_argument("--arch", choices=["x64", "arm64"], default=HOST_ARCH)
    parser.add_argument("--version", default=None)
    parser.add_argument("--work", default=str(REPO / "build" / "packaging"))
    parser.add_argument("--out", default=str(REPO / "dist"))
    parser.add_argument("--python", default=None, help="interpreter for PyInstaller")
    parser.add_argument("--agent-dir", default=None)
    parser.add_argument("--mcp-dir", default=None)
    parser.add_argument("--pm-dir", default=None)
    parser.add_argument("--node-runtime", default=None)
    parser.add_argument("--with-agent", dest="with_agent", action="store_true", default=True)
    parser.add_argument("--without-agent", dest="with_agent", action="store_false")
    parser.add_argument("--skip-npm", action="store_true")
    parser.add_argument("--skip-python", action="store_true")
    parser.add_argument("--skip-python-deps", action="store_true")
    parser.add_argument("--skip-installers", action="store_true", help="only build the portable archive")
    parser.add_argument("--rebuild-webui", action="store_true")
    parser.add_argument("--allow-foreign-python", action="store_true")
    args = parser.parse_args()

    args.version = read_version(args.version)
    work = Path(args.work).resolve()
    out = Path(args.out).resolve()
    clean(work)
    out.mkdir(parents=True, exist_ok=True)

    if not args.skip_python and not args.allow_foreign_python:
        if args.os != HOST_OS or args.arch != HOST_ARCH:
            raise SystemExit(
                f"PyInstaller must run on the target ({args.os}/{args.arch}); "
                f"this host is {HOST_OS}/{HOST_ARCH}. Pass --skip-python or --allow-foreign-python."
            )

    log(f"0KAY {args.version} {args.os}/{args.arch} variant={args.variant}")
    base, overlay = assemble(args, work)
    tree = combined_tree(base, overlay, work)

    artifacts = [make_portable(tree, out, args)]
    if not args.skip_installers:
        if args.variant in ("tui", "both"):
            if args.os == "windows":
                installer = make_windows_installer(base, overlay, out, work, args)
            elif args.os == "macos":
                installer = make_macos_installer(tree, out, work, args)
            else:
                installer = make_linux_installer(tree, out, work, args)
            if installer:
                artifacts.append(installer)
        if args.variant in ("desktop", "both"):
            artifacts.extend(make_desktop(tree, out, work, args))

    write_checksums(out, args)
    log("artifacts:")
    for artifact in artifacts:
        log(f"  {artifact.name}  ({artifact.stat().st_size / (1024 * 1024):.1f} MiB)")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(130)
