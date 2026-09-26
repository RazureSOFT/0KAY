import { ref as i, computed as C, onMounted as N, h as a } from "vue";
const P = `
/* Skills GUI — Material 3 Expressive. #app prefixes out-rank the host layer. */
#app .skills-page{
  height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);color:var(--md-on-surface);font-family:var(--font-family);
  background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);
}
#app .skills-page *{box-sizing:border-box}
#app .skills-page .page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}
#app .skills-page .eyebrow{margin:0 0 8px;color:var(--md-primary);font:800 11px/1 ui-monospace,monospace;letter-spacing:.18em}
#app .skills-page .page-header h1{margin:0;font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em}
#app .skills-page .subtitle{color:var(--md-on-surface-variant);font-size:14.5px;margin:8px 0 0;line-height:1.6;max-width:680px}
#app .skills-page .header-actions{display:flex;gap:10px;flex-wrap:wrap}
#app .skills-page .btn{
  height:46px;min-height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;
  font:700 13.5px/1 inherit;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;
  color:var(--md-on-surface);background:var(--md-surface-container-high);
  transition:transform 240ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color 180ms,box-shadow 200ms;
}
#app .skills-page .btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}
#app .skills-page .btn:disabled{opacity:.5;cursor:not-allowed}
#app .skills-page .btn.btn-primary{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
#app .skills-page .btn.btn-tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skills-page .btn.btn-danger{background:var(--md-error-container);color:var(--md-on-error-container,#410e0b)}
#app .skills-page .btn.sm{height:34px;min-height:34px;padding:0 15px;font-size:12.5px}
#app .skills-page .error-banner{padding:13px 18px;margin-bottom:var(--space-md);background:var(--md-error-container);color:var(--md-on-error-container,#410e0b);border-radius:18px;font-size:13px}
#app .skills-page .flash-banner{padding:13px 18px;margin-bottom:var(--space-md);background:var(--md-success-container);color:#0d3b1e;border-radius:18px;font-size:13px;font-weight:600}
#app .skills-page .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:var(--space-lg);margin-bottom:var(--space-xl)}
#app .skills-page .stat-card{
  padding:20px;border-radius:24px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);
  display:flex;flex-direction:column;gap:6px;box-shadow:var(--shadow-1);
  animation:skills-card-in 520ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)) both;
  transition:transform 280ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 280ms;
}
#app .skills-page .stat-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}
#app .skills-page .stat-card:nth-child(3n+1){background:var(--md-primary-container);color:var(--md-on-primary-container)}
#app .skills-page .stat-card:nth-child(3n+2){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skills-page .stat-card:nth-child(3n){background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#421326)}
@keyframes skills-card-in{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}
#app .skills-page .stat-label{font-size:11.5px;opacity:.75;color:inherit;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
#app .skills-page .stat-value{font-size:32px;font-weight:800;letter-spacing:-.02em;color:inherit;line-height:1.1}
#app .skills-page .stat-dir{font:12px/1.5 ui-monospace,monospace;word-break:break-all;color:inherit;opacity:.85}
#app .skills-page .upload-panel{
  padding:22px;border-radius:28px;margin-bottom:var(--space-xl);display:flex;flex-direction:column;gap:12px;
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);
}
#app .skills-page .upload-panel h2{margin:0;font-size:17px;font-weight:750}
#app .skills-page .upload-panel .hint{margin:0;font-size:13px;color:var(--md-on-surface-variant);line-height:1.55}
#app .skills-page .upload-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
#app .skills-page .upload-row input[type=text]{flex:1;min-width:200px}
#app .skills-page .file-pick{font-size:13px;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;gap:8px;cursor:pointer}
#app .skills-page .upload-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:6px}
#app .skills-page .folder-bar{
  display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  padding:16px 18px;border-radius:20px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);
}
#app .skills-page .folder-bar b{font-size:14px;font-weight:750}
#app .skills-page .folder-bar span{font-size:12.5px;opacity:.85;flex:1;min-width:160px}
#app .skills-page .toolbar{display:flex;gap:12px;align-items:center;margin-bottom:var(--space-lg)}
#app .skills-page .toolbar-count{font-size:13px;color:var(--md-on-surface-variant);white-space:nowrap;padding:0 6px;font-weight:600}
#app .skills-page .skill-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-lg);padding-bottom:var(--space-lg)}
#app .skills-page .skill-card{
  padding:22px;display:flex;flex-direction:column;gap:14px;border-radius:28px;
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);
  box-shadow:var(--shadow-1);animation:skills-card-in 520ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)) both;
  transition:transform 280ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 280ms,border-color 280ms;
}
#app .skills-page .skill-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}
#app .skills-page .card-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
#app .skills-page .card-top code{font:700 13px/1.2 ui-monospace,monospace;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:6px 12px;border-radius:999px}
#app .skills-page .status-chip{
  height:30px;padding:0 12px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;
  border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border:1px solid transparent;white-space:nowrap;
}
#app .skills-page .status-chip.builtin{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skills-page .card-desc{margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;color:var(--md-on-surface);flex:1}
#app .skills-page .tags{display:flex;gap:6px;flex-wrap:wrap}
#app .skills-page .chip{height:26px;padding:0 11px;font-size:12px;font-weight:600;border-radius:999px;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skills-page .card-actions{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:auto}
#app .skills-page .slash{font:11px/1.3 ui-monospace,monospace;color:var(--md-on-surface-variant)}
#app .skills-page .empty-state{padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);color:var(--md-on-surface-variant);border-radius:32px;margin-bottom:var(--space-lg)}
#app .skills-page .empty-state p{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}
#app .skills-page .empty-state .hint{margin-top:6px;font-size:13px;font-weight:400;opacity:.85}
@media(max-width:860px){
  #app .skills-page{padding:var(--space-lg)}
  #app .skills-page .page-header{display:block}
  #app .skills-page .header-actions{margin-top:14px}
  #app .skills-page .skill-grid{grid-template-columns:1fr}
}
`;
let S = !1;
function Y() {
  if (S || typeof document > "u") return;
  if (document.getElementById("skillsguishow-style")) {
    S = !0;
    return;
  }
  const l = document.createElement("style");
  l.id = "skillsguishow-style", l.textContent = P, document.head.appendChild(l), S = !0;
}
async function h(l, m, s) {
  const o = { method: l, headers: { "Content-Type": "application/json" } };
  s !== void 0 && (o.body = JSON.stringify(s));
  const t = await fetch(m, o), p = await t.json().catch(() => ({}));
  if (!t.ok || p.success === !1)
    throw new Error(p.error || `${l} ${m} → ${t.status}`);
  return p.result !== void 0 && p.result !== null ? p.result : p;
}
function E(l) {
  return String(l || "").replace(/\.md$/i, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}
const U = {
  name: "SkillsGuiShowPage",
  setup() {
    Y();
    const l = i([]), m = i(""), s = i(""), o = i(""), t = i(!1), p = i(""), u = i(!1), c = i(""), g = i(""), v = i(""), f = i(""), k = i(null), y = C(() => {
      const e = p.value.trim().toLowerCase();
      return e ? l.value.filter(
        (r) => r.name.toLowerCase().includes(e) || (r.description || "").toLowerCase().includes(e) || (r.tags || []).some((n) => String(n).toLowerCase().includes(e))
      ) : l.value;
    }), I = C(() => l.value.filter((e) => e.source !== "builtin").length), j = C(() => l.value.filter((e) => e.source === "builtin").length);
    async function x() {
      t.value = !0, s.value = "";
      try {
        const e = await h("GET", "/api/skills");
        l.value = Array.isArray(e?.skills) ? e.skills : [], m.value = e?.dir || "";
      } catch (e) {
        s.value = String(e?.message || e);
      } finally {
        t.value = !1;
      }
    }
    async function L() {
      if (!(!c.value.trim() || !g.value.trim())) {
        t.value = !0, s.value = "", o.value = "";
        try {
          await h("POST", "/api/skills", { name: c.value, content: g.value }), o.value = `已保存 ${c.value.trim()}`, c.value = "", g.value = "", u.value = !1, await x();
        } catch (e) {
          s.value = String(e?.message || e);
        } finally {
          t.value = !1;
        }
      }
    }
    async function T(e) {
      if (v.value !== e) {
        v.value = e;
        return;
      }
      v.value = "", t.value = !0, s.value = "", o.value = "";
      try {
        await h("DELETE", `/api/skills?name=${encodeURIComponent(e)}`), o.value = `已删除 ${e}`, await x();
      } catch (r) {
        s.value = String(r?.message || r);
      } finally {
        t.value = !1;
      }
    }
    function F(e) {
      const r = e.target.files && e.target.files[0];
      if (!r) return;
      const n = new FileReader();
      n.onload = () => {
        g.value = String(n.result || ""), c.value || (c.value = E(r.name));
      }, n.readAsText(r), e.target.value = "";
    }
    async function G(e) {
      const r = Array.from(e.target.files || []);
      e.target.value = "";
      const n = r.filter(
        (d) => /\.md$/i.test(d.name) || d.type === "text/markdown" || d.type === "text/plain"
      );
      if (!n.length) {
        s.value = "所选文件夹里没有找到 .md 文件";
        return;
      }
      t.value = !0, s.value = "", o.value = "";
      let A = 0, b = 0;
      for (let d = 0; d < n.length; d++) {
        const z = n[d], $ = E(z.name);
        if (f.value = `${d + 1}/${n.length} · ${$ || z.name}`, !$) {
          b++;
          continue;
        }
        try {
          const M = await z.text();
          await h("POST", "/api/skills", { name: $, content: M }), A++;
        } catch {
          b++;
        }
      }
      f.value = "", o.value = `文件夹上传完成：成功 ${A} 个${b ? ` · 失败 ${b} 个` : ""}`, u.value = !1, await x(), t.value = !1;
    }
    N(x);
    const w = (e, r, n) => a("div", { class: "stat-card" }, [
      a("span", { class: "stat-label" }, e),
      a("span", { class: "stat-value" }, r),
      n ? a("span", { class: "stat-label", style: "text-transform:none;letter-spacing:0;opacity:.7" }, n) : null
    ]);
    return () => a("div", { class: "skills-page" }, [
      a("input", {
        ref: k,
        type: "file",
        webkitdirectory: "",
        directory: "",
        multiple: !0,
        style: "display:none",
        onChange: G
      }),
      a("header", { class: "page-header" }, [
        a("div", {}, [
          a("p", { class: "eyebrow" }, "AGENT · SKILLS"),
          a("h1", {}, "技能管理"),
          a("p", { class: "subtitle" }, "浏览、上传、删除 Agent 技能。技能由 Agent 插件加载；在对话框输入 /技能名 可强制套用该技能。")
        ]),
        a("div", { class: "header-actions" }, [
          a("button", { class: "btn btn-tonal", disabled: t.value, onClick: x }, t.value ? "刷新中…" : "刷新"),
          a("button", {
            class: "btn btn-tonal",
            disabled: t.value,
            onClick: () => k.value?.click()
          }, "上传文件夹"),
          a("button", { class: "btn btn-primary", onClick: () => u.value = !u.value }, u.value ? "收起上传" : "上传技能")
        ])
      ]),
      s.value ? a("div", { class: "error-banner" }, s.value) : null,
      o.value ? a("div", { class: "flash-banner" }, o.value) : null,
      a("section", { class: "stat-grid" }, [
        w("技能总数", String(l.value.length), "含内置与文件技能"),
        w("文件技能", String(I.value), "可编辑、可删除"),
        w("内置技能", String(j.value), "code / research / general"),
        a("div", { class: "stat-card" }, [
          a("span", { class: "stat-label" }, "技能目录"),
          a("div", { class: "stat-dir" }, m.value || "—")
        ])
      ]),
      u.value ? a("section", { class: "upload-panel" }, [
        a("h2", {}, "上传 / 覆盖技能"),
        a("p", { class: "hint" }, "单个 Markdown 文件或直接粘贴内容。名称仅限英文、数字、-、_，将成为 /斜杠调用名。"),
        a("div", { class: "upload-row" }, [
          a("input", {
            type: "text",
            placeholder: "技能名，例如 code-review",
            value: c.value,
            onInput: (e) => c.value = e.target.value
          }),
          a("label", { class: "file-pick" }, [
            "选择 .md 文件",
            a("input", { type: "file", accept: ".md,text/markdown,text/plain", onChange: F })
          ])
        ]),
        a("textarea", {
          placeholder: `# 技能名

一句话描述。

1. 步骤…`,
          value: g.value,
          onInput: (e) => g.value = e.target.value
        }),
        a("div", { class: "folder-bar" }, [
          a("b", {}, "批量导入"),
          a("span", {}, `选择包含多个 .md 的整个文件夹，将逐个创建/覆盖技能（文件名即技能名）。${f.value ? " " + f.value : ""}`),
          a("button", {
            class: "btn sm btn-tonal",
            disabled: t.value,
            onClick: () => k.value?.click()
          }, f.value ? "上传中…" : "选择文件夹")
        ]),
        a("div", { class: "upload-actions" }, [
          a("button", { class: "btn btn-tonal", disabled: t.value, onClick: () => u.value = !1 }, "取消"),
          a("button", { class: "btn btn-primary", disabled: t.value || !c.value.trim() || !g.value.trim(), onClick: L }, "保存技能")
        ])
      ]) : null,
      a("section", { class: "toolbar" }, [
        a("input", {
          placeholder: "搜索技能名称、描述或标签…",
          value: p.value,
          onInput: (e) => p.value = e.target.value
        }),
        a("span", { class: "toolbar-count" }, `${y.value.length} / ${l.value.length} 个技能`)
      ]),
      y.value.length === 0 ? a("div", { class: "empty-state" }, [
        a("p", {}, s.value ? "无法读取技能列表。确认 Agent 在线后重试。" : p.value ? "没有匹配的技能。" : "暂无技能。"),
        a("p", { class: "hint" }, s.value ? "" : "点击右上角「上传技能」或「上传文件夹」创建。")
      ]) : a(
        "section",
        { class: "skill-grid" },
        y.value.map(
          (e, r) => a("article", { class: "skill-card", key: e.name, style: `animation-delay:${Math.min(r, 12) * 40}ms` }, [
            a("div", { class: "card-top" }, [
              a("code", {}, `/${e.name}`),
              a("span", { class: `status-chip${e.source === "builtin" ? " builtin" : ""}` }, e.source === "builtin" ? "内置" : "文件")
            ]),
            a("p", { class: "card-desc" }, e.description || "（无描述）"),
            e.tags && e.tags.length ? a("div", { class: "tags" }, e.tags.map((n) => a("span", { class: "chip", key: n }, `#${n}`))) : null,
            a("div", { class: "card-actions" }, [
              a("span", { class: "slash" }, `对话输入 /${e.name}`),
              a(
                "button",
                {
                  class: `btn sm ${v.value === e.name ? "btn-danger" : "btn-tonal"}`,
                  disabled: t.value,
                  onClick: () => T(e.name)
                },
                v.value === e.name ? "确认删除？" : "删除"
              )
            ])
          ])
        )
      )
    ]);
  }
};
export {
  U as default
};
