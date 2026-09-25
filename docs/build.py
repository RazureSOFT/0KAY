"""Small dependency-free Markdown-to-HTML builder for GitHub Pages."""
from pathlib import Path
import html
import re
import shutil

ROOT = Path(__file__).parent
OUT = ROOT.parent / "_site"

def inline(value: str) -> str:
    value = html.escape(value, quote=False)
    value = re.sub(r"\[([^]]+)\]\(([^)]+)\)", lambda m: f'<a href="{m.group(2)[:-3] + ".html" if m.group(2).endswith(".md") else m.group(2)}">{m.group(1)}</a>', value)
    value = re.sub(r"`([^`]+)`", r"<code>\1</code>", value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", value)
    return value

def render(text: str, title: str) -> str:
    body = []
    in_code = False
    list_open = False
    table_open = False
    for raw in text.splitlines():
        line = raw.rstrip()
        if line.startswith("```"):
            if in_code:
                body.append("</code></pre>"); in_code = False
            else:
                body.append("<pre><code>"); in_code = True
            continue
        if in_code:
            body.append(html.escape(line) + "\n"); continue
        if not line:
            if list_open: body.append("</ul>"); list_open = False
            if table_open: body.append("</table>"); table_open = False
            continue
        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        item = re.match(r"^[-*]\s+(.+)$", line)
        if heading:
            if list_open: body.append("</ul>"); list_open = False
            if table_open: body.append("</table>"); table_open = False
            level = len(heading.group(1)); body.append(f"<h{level}>{inline(heading.group(2))}</h{level}>")
        elif line.startswith("|"):
            if list_open: body.append("</ul>"); list_open = False
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
            if table_open: body.append("</table>"); table_open = False
            if item:
                if not list_open: body.append("<ul>"); list_open = True
                body.append(f"<li>{inline(item.group(1))}</li>")
            else:
                if list_open: body.append("</ul>"); list_open = False
                body.append(f"<p>{inline(line)}</p>")
    if list_open: body.append("</ul>")
    if table_open: body.append("</table>")
    if in_code: body.append("</code></pre>")
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><style>body{{max-width:980px;margin:0 auto;padding:32px;font:16px/1.7 system-ui,sans-serif;color:#202124}}a{{color:#0758a8}}pre{{padding:16px;overflow:auto;background:#f1f3f4;border-radius:8px}}code{{background:#f1f3f4;padding:2px 4px;border-radius:4px}}h1,h2,h3{{line-height:1.25;border-bottom:1px solid #ddd;padding-bottom:6px}}table{{border-collapse:collapse;width:100%;margin:12px 0;font-size:14.5px}}th,td{{border:1px solid #ddd;padding:7px 10px;text-align:left;vertical-align:top}}th{{background:#f1f3f4}}tr:nth-child(even) td{{background:#fafbfc}}</style></head><body>{''.join(body)}</body></html>'''

if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir()
for source in ROOT.glob("*.md"):
    (OUT / f"{source.stem}.html").write_text(render(source.read_text(encoding="utf-8"), source.stem), encoding="utf-8")
