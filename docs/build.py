"""Small dependency-free Markdown-to-HTML builder for GitHub Pages.

Renders a Material 3 Expressive documentation site: a tonal navigation drawer,
MD3 color roles (light + dark) and expressive container shapes. No third-party
dependencies — plain Markdown in, one HTML page per file out.
"""
from pathlib import Path
import html
import re
import shutil

ROOT = Path(__file__).parent
OUT = ROOT.parent / "_site"

# Sidebar order; unknown pages fall back to alphabetical at the end.
ORDER = [
    "index", "HTTP_API", "PLUGIN_API", "plugin-lifecycle", "writing-a-plugin",
    "core-services", "agent-service", "life-service", "mocr-service",
    "settings-ui", "THINKING", "RELEASES", "security",
]

REPO = "https://github.com/RazureSOFT/0KAY"

STYLE = """
:root{
  color-scheme: light;
  --md-primary:#4a5b8c; --md-on-primary:#ffffff;
  --md-primary-container:#dbe1ff; --md-on-primary-container:#131b2e;
  --md-secondary-container:#e0e2f0; --md-on-secondary-container:#181a24;
  --md-surface:#fbf8ff; --md-surface-container-low:#f5f3fb;
  --md-surface-container:#efedf6; --md-surface-container-high:#e9e7f0;
  --md-surface-container-highest:#e3e1ea;
  --md-on-surface:#1a1b21; --md-on-surface-variant:#45464f;
  --md-outline:#757780; --md-outline-variant:#c5c6d0;
  --md-success-container:#d7f5cf; --md-error-container:#ffdad6;
  --md-shadow:rgba(20,18,36,.16);
  --radius-sm:12px; --radius-md:16px; --radius-lg:24px; --radius-xl:28px;
}
@media (prefers-color-scheme: dark){
  :root{
    color-scheme: dark;
    --md-primary:#b3c5ff; --md-on-primary:#1b2b52;
    --md-primary-container:#33436b; --md-on-primary-container:#dbe1ff;
    --md-secondary-container:#3a3c47; --md-on-secondary-container:#e0e2f0;
    --md-surface:#111318; --md-surface-container-low:#1a1b21;
    --md-surface-container:#1e1f26; --md-surface-container-high:#292a31;
    --md-surface-container-highest:#34353c;
    --md-on-surface:#e3e1e9; --md-on-surface-variant:#c6c6d0;
    --md-outline:#8f9099; --md-outline-variant:#45464f;
    --md-success-container:#1f4d1a; --md-error-container:#93000a;
    --md-shadow:rgba(0,0,0,.5);
  }
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0; min-height:100vh; background:var(--md-surface); color:var(--md-on-surface);
  font:400 15.5px/1.75 'Roboto','Segoe UI Variable','Segoe UI','PingFang SC','Microsoft YaHei',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
}
::selection{background:var(--md-primary-container); color:var(--md-on-primary-container)}
a{color:var(--md-primary); text-decoration:none}
a:hover{text-decoration:underline}
.shell{display:grid; grid-template-columns:300px minmax(0,1fr); min-height:100vh}
/* ---------- Navigation drawer ---------- */
.drawer{
  position:sticky; top:0; align-self:start; height:100vh; overflow-y:auto;
  padding:22px 14px; background:var(--md-surface-container-low);
  border-right:1px solid var(--md-outline-variant);
}
.brand{display:flex; align-items:center; gap:12px; padding:6px 10px 18px}
.brand-mark{
  width:46px; height:46px; display:grid; place-items:center; flex:none;
  border-radius:16px 16px 16px 6px; background:var(--md-primary);
  color:var(--md-on-primary); font-weight:800; letter-spacing:-1px; font-size:17px;
}
.brand-text b{display:block; font-size:16px; font-weight:800; letter-spacing:-.2px}
.brand-text span{font-size:12px; color:var(--md-on-surface-variant)}
.nav{display:flex; flex-direction:column; gap:4px}
.nav-item{
  position:relative; display:flex; align-items:center; gap:10px;
  padding:11px 16px; border-radius:22px 22px 22px 8px;
  color:var(--md-on-surface-variant); font-weight:600; font-size:14px;
  transition:background-color .22s, color .16s;
}
.nav-item:hover{background:color-mix(in srgb, var(--md-primary) 12%, transparent); text-decoration:none; color:var(--md-on-surface)}
.nav-item.active{background:var(--md-primary-container); color:var(--md-on-primary-container); font-weight:800}
.nav-item .dot{width:7px; height:7px; border-radius:50%; background:currentColor; opacity:.5; flex:none}
.drawer-foot{margin-top:18px; padding:12px 12px 0; border-top:1px solid var(--md-outline-variant); font-size:12px; color:var(--md-on-surface-variant)}
.drawer-foot a{font-weight:700}
/* ---------- Article ---------- */
.article{padding:clamp(24px,4vw,56px) clamp(20px,4vw,64px) 80px; max-width:920px}
.article>h1{
  margin:0 0 6px; font-size:clamp(30px,4vw,42px); line-height:1.12;
  font-weight:850; letter-spacing:-.02em;
}
.article>h1+p{color:var(--md-on-surface-variant); font-size:16px; margin-top:0}
h2{font-size:24px; font-weight:800; letter-spacing:-.01em; margin:2.1em 0 .5em}
h3{font-size:19px; font-weight:750; margin:1.7em 0 .4em}
h4,h5,h6{font-size:16px; font-weight:750; margin:1.4em 0 .3em}
p{margin:.7em 0}
ul{margin:.6em 0; padding-left:22px}
li{margin:.3em 0}
hr{border:0; border-top:1px solid var(--md-outline-variant); margin:2em 0}
strong{font-weight:750}
code{
  font-family:ui-monospace,'Cascadia Code','JetBrains Mono',Consolas,'SFMono-Regular',Menlo,monospace;
  font-size:.88em; background:var(--md-surface-container-high);
  padding:2px 6px; border-radius:8px;
}
pre{
  background:var(--md-surface-container-low); border:1px solid var(--md-outline-variant);
  border-radius:var(--radius-lg); padding:18px 20px; overflow:auto; margin:1.1em 0;
}
pre code{background:none; padding:0; font-size:13.5px; line-height:1.7}
/* ---------- Tables ---------- */
table{
  border-collapse:separate; border-spacing:0; width:100%; margin:1.2em 0; font-size:14px;
  background:var(--md-surface-container-low); border:1px solid var(--md-outline-variant);
  border-radius:var(--radius-lg); overflow:hidden;
}
th,td{padding:11px 15px; text-align:left; vertical-align:top; border-bottom:1px solid var(--md-outline-variant)}
th{background:var(--md-surface-container); font-weight:750; font-size:12.5px; text-transform:uppercase; letter-spacing:.04em; color:var(--md-on-surface-variant)}
tr:last-child td{border-bottom:0}
tbody tr:hover td{background:color-mix(in srgb, var(--md-primary) 5%, transparent)}
/* ---------- Chips / footer ---------- */
.badge{
  display:inline-flex; align-items:center; height:26px; padding:0 12px; border-radius:999px;
  background:var(--md-secondary-container); color:var(--md-on-secondary-container);
  font-size:12px; font-weight:700; margin-left:10px; vertical-align:middle;
}
/* ---------- Responsive ---------- */
@media (max-width:900px){
  .shell{grid-template-columns:1fr}
  .drawer{position:static; height:auto; border-right:0; border-bottom:1px solid var(--md-outline-variant); padding:16px 14px}
  .nav{flex-direction:row; flex-wrap:wrap}
  .nav-item{padding:8px 14px; border-radius:999px}
  .brand{padding-bottom:12px}
}
"""


def inline(value: str) -> str:
    value = html.escape(value, quote=False)
    value = re.sub(
        r"\[([^]]+)\]\(([^)]+)\)",
        lambda m: f'<a href="{m.group(2)[:-3] + ".html" if m.group(2).endswith(".md") else m.group(2)}">{m.group(1)}</a>',
        value,
    )
    value = re.sub(r"`([^`]+)`", r"<code>\1</code>", value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", value)
    return value


def markdown_body(text: str) -> str:
    body = []
    in_code = False
    list_open = False
    table_open = False
    for raw in text.splitlines():
        line = raw.rstrip()
        if line.startswith("```"):
            if in_code:
                body.append("</code></pre>")
                in_code = False
            else:
                body.append("<pre><code>")
                in_code = True
            continue
        if in_code:
            body.append(html.escape(line) + "\n")
            continue
        if not line:
            if list_open:
                body.append("</ul>")
                list_open = False
            if table_open:
                body.append("</table>")
                table_open = False
            continue
        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        item = re.match(r"^[-*]\s+(.+)$", line)
        if heading:
            if list_open:
                body.append("</ul>")
                list_open = False
            if table_open:
                body.append("</table>")
                table_open = False
            level = len(heading.group(1))
            body.append(f"<h{level}>{inline(heading.group(2))}</h{level}>")
        elif line.startswith("|"):
            if list_open:
                body.append("</ul>")
                list_open = False
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if not table_open:
                table_open = True
                body.append("<table>")
                body.append("<tr>" + "".join(f"<th>{inline(c)}</th>" for c in cells) + "</tr>")
            elif re.fullmatch(r"[\s|:-]+", line):
                continue
            else:
                body.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells) + "</tr>")
            continue
        else:
            if table_open:
                body.append("</table>")
                table_open = False
            if item:
                if not list_open:
                    body.append("<ul>")
                    list_open = True
                body.append(f"<li>{inline(item.group(1))}</li>")
            else:
                if list_open:
                    body.append("</ul>")
                    list_open = False
                body.append(f"<p>{inline(line)}</p>")
    if list_open:
        body.append("</ul>")
    if table_open:
        body.append("</table>")
    if in_code:
        body.append("</code></pre>")
    return "".join(body)


def first_heading(path: Path, fallback: str) -> str:
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def render(text: str, stem: str, title: str, nav: str) -> str:
    return f"""<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)} · 0KAY</title><style>{STYLE}</style></head>
<body><div class="shell">
<aside class="drawer">
  <a class="brand" href="index.html"><span class="brand-mark">0K</span>
    <span class="brand-text"><b>0KAY</b><span>Plugin API</span></span></a>
  <nav class="nav">{nav}</nav>
  <div class="drawer-foot">
    <div><a href="{REPO}">RazureSOFT/0KAY</a></div>
    <div>MIT · © 2026 RazureSOFT</div>
  </div>
</aside>
<main class="article"{' data-page="' + stem + '"' if stem else ''}>{markdown_body(text)}</main>
</div></body></html>"""


def main() -> None:
    sources = {p.stem: p for p in ROOT.glob("*.md")}
    labels = {stem: first_heading(path, stem) for stem, path in sources.items()}
    ordered = [s for s in ORDER if s in sources]
    ordered += sorted(s for s in sources if s not in ORDER)

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    for stem in ordered:
        nav = "".join(
            f'<a class="nav-item{" active" if other == stem else ""}" href="{other}.html">'
            f'<span class="dot"></span>{html.escape(labels[other])}</a>'
            for other in ordered
        )
        page = render(sources[stem].read_text(encoding="utf-8"), stem, labels[stem], nav)
        (OUT / f"{stem}.html").write_text(page, encoding="utf-8")


if __name__ == "__main__":
    main()
