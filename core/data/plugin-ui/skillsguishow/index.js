import { ref as i, computed as b, onMounted as $, h as e } from "vue";
const E = `
/* Skills GUI — Material 3 Expressive. #app prefixes out-rank the host layer. */
#app .skills-page{height:100%;overflow-y:auto;padding:clamp(18px,2.4vw,30px);background:var(--md-surface);color:var(--md-on-surface);font-family:var(--font-family)}
#app .skills-page *{box-sizing:border-box}
#app .skills-page .page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,30px);flex-wrap:wrap}
#app .skills-page .page-header h1{margin:0;font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}
#app .skills-page .subtitle{color:var(--md-on-surface-variant);font-size:14px;margin:8px 0 0;line-height:1.6;max-width:680px}
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
#app .skills-page .error-banner{padding:12px 16px;margin-bottom:var(--space-md);background:var(--md-error-container);color:var(--md-on-error-container,#410e0b);border-radius:16px;font-size:13px}
#app .skills-page .flash-banner{padding:12px 16px;margin-bottom:var(--space-md);background:var(--md-success-container);color:#0d3b1e;border-radius:16px;font-size:13px;font-weight:600}
#app .skills-page .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:var(--space-lg);margin-bottom:var(--space-xl)}
#app .skills-page .stat-card{
  padding:20px;border-radius:24px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);
  background:var(--md-surface-container-low);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:6px;
  transition:transform 280ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 280ms;
}
#app .skills-page .stat-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}
#app .skills-page .stat-card:nth-child(3n+1){background:var(--md-primary-container);color:var(--md-on-primary-container)}
#app .skills-page .stat-card:nth-child(3n+2){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skills-page .stat-card:nth-child(3n){background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#421326)}
#app .skills-page .stat-label{font-size:11.5px;opacity:.75;color:inherit;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
#app .skills-page .stat-value{font-size:30px;font-weight:800;letter-spacing:-.02em;color:inherit;line-height:1.1}
#app .skills-page .stat-dir{font:12px/1.5 ui-monospace,monospace;word-break:break-all;color:inherit;opacity:.85}
#app .skills-page .upload-panel{
  padding:22px;border-radius:24px;margin-bottom:var(--space-xl);display:flex;flex-direction:column;gap:12px;
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);
}
#app .skills-page .upload-panel h2{margin:0;font-size:17px;font-weight:750}
#app .skills-page .upload-panel .hint{margin:0;font-size:13px;color:var(--md-on-surface-variant)}
#app .skills-page .upload-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
#app .skills-page .upload-row input[type=text]{flex:1;min-width:200px;height:48px;padding:0 16px}
#app .skills-page .file-pick{font-size:13px;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;gap:6px}
#app .skills-page textarea{width:100%;min-height:150px;padding:14px 16px;line-height:1.6;resize:vertical}
#app .skills-page .upload-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:6px}
#app .skills-page .toolbar{display:flex;gap:12px;align-items:center;margin-bottom:var(--space-lg)}
#app .skills-page .toolbar input{flex:1;min-width:0;height:48px;padding:0 16px}
#app .skills-page .toolbar-count{font-size:13px;color:var(--md-on-surface-variant);white-space:nowrap;padding:0 6px;font-weight:600}
#app .skills-page .skill-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-lg);padding-bottom:var(--space-lg)}
#app .skills-page .skill-card{
  padding:20px;display:flex;flex-direction:column;gap:14px;border-radius:24px;
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);
  box-shadow:var(--shadow-1);transition:transform 280ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 280ms,border-color 280ms;
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
let h = !1;
function j() {
  if (h || typeof document > "u") return;
  if (document.getElementById("skillsguishow-style")) {
    h = !0;
    return;
  }
  const l = document.createElement("style");
  l.id = "skillsguishow-style", l.textContent = E, document.head.appendChild(l), h = !0;
}
async function k(l, g, s) {
  const p = { method: l, headers: { "Content-Type": "application/json" } };
  s !== void 0 && (p.body = JSON.stringify(s));
  const t = await fetch(g, p), n = await t.json().catch(() => ({}));
  if (!t.ok || n.success === !1)
    throw new Error(n.error || `${l} ${g} → ${t.status}`);
  return n.result !== void 0 && n.result !== null ? n.result : n;
}
const A = {
  name: "SkillsGuiShowPage",
  setup() {
    j();
    const l = i([]), g = i(""), s = i(""), p = i(""), t = i(!1), n = i(""), u = i(!1), o = i(""), d = i(""), m = i(""), x = b(() => {
      const a = n.value.trim().toLowerCase();
      return a ? l.value.filter(
        (r) => r.name.toLowerCase().includes(a) || (r.description || "").toLowerCase().includes(a) || (r.tags || []).some((c) => String(c).toLowerCase().includes(a))
      ) : l.value;
    }), y = b(() => l.value.filter((a) => a.source !== "builtin").length), w = b(() => l.value.filter((a) => a.source === "builtin").length);
    async function v() {
      t.value = !0, s.value = "";
      try {
        const a = await k("GET", "/api/skills");
        l.value = Array.isArray(a?.skills) ? a.skills : [], g.value = a?.dir || "";
      } catch (a) {
        s.value = String(a?.message || a);
      } finally {
        t.value = !1;
      }
    }
    async function z() {
      if (!(!o.value.trim() || !d.value.trim())) {
        t.value = !0, s.value = "", p.value = "";
        try {
          await k("POST", "/api/skills", { name: o.value, content: d.value }), p.value = `已保存 ${o.value.trim()}`, o.value = "", d.value = "", u.value = !1, await v();
        } catch (a) {
          s.value = String(a?.message || a);
        } finally {
          t.value = !1;
        }
      }
    }
    async function C(a) {
      if (m.value !== a) {
        m.value = a;
        return;
      }
      m.value = "", t.value = !0, s.value = "", p.value = "";
      try {
        await k("DELETE", `/api/skills?name=${encodeURIComponent(a)}`), p.value = `已删除 ${a}`, await v();
      } catch (r) {
        s.value = String(r?.message || r);
      } finally {
        t.value = !1;
      }
    }
    function S(a) {
      const r = a.target.files && a.target.files[0];
      if (!r) return;
      const c = new FileReader();
      c.onload = () => {
        d.value = String(c.result || ""), o.value || (o.value = r.name.replace(/\.md$/i, ""));
      }, c.readAsText(r), a.target.value = "";
    }
    $(v);
    const f = (a, r, c) => e("div", { class: "stat-card" }, [
      e("span", { class: "stat-label" }, a),
      e("span", { class: "stat-value" }, r),
      c ? e("span", { class: "stat-label", style: "text-transform:none;letter-spacing:0" }, c) : null
    ]);
    return () => e("div", { class: "skills-page" }, [
      e("header", { class: "page-header" }, [
        e("div", {}, [
          e("h1", {}, "技能管理"),
          e("p", { class: "subtitle" }, "浏览、上传、删除 Agent 技能。技能由 Agent 插件加载；在对话框输入 /技能名 可强制套用该技能。")
        ]),
        e("div", { class: "header-actions" }, [
          e("button", { class: "btn btn-tonal", disabled: t.value, onClick: v }, t.value ? "刷新中…" : "刷新"),
          e("button", { class: "btn btn-primary", onClick: () => u.value = !u.value }, u.value ? "收起上传" : "上传技能")
        ])
      ]),
      s.value ? e("div", { class: "error-banner" }, s.value) : null,
      p.value ? e("div", { class: "flash-banner" }, p.value) : null,
      e("section", { class: "stat-grid" }, [
        f("技能总数", String(l.value.length), "含内置与文件技能"),
        f("文件技能", String(y.value), "可编辑、可删除"),
        f("内置技能", String(w.value), "code / research / general"),
        e("div", { class: "stat-card" }, [
          e("span", { class: "stat-label" }, "技能目录"),
          e("div", { class: "stat-dir" }, g.value || "—")
        ])
      ]),
      u.value ? e("section", { class: "card upload-panel" }, [
        e("h2", {}, "上传 / 覆盖技能"),
        e("p", { class: "hint" }, "Markdown 文件或直接粘贴内容。名称仅限英文、数字、-、_，将成为 /斜杠调用名。"),
        e("div", { class: "upload-row" }, [
          e("input", {
            type: "text",
            placeholder: "技能名，例如 code-review",
            value: o.value,
            onInput: (a) => o.value = a.target.value
          }),
          e("label", { class: "file-pick" }, [
            "选择 .md 文件 ",
            e("input", { type: "file", accept: ".md,text/markdown,text/plain", onChange: S })
          ])
        ]),
        e("textarea", {
          placeholder: `# 技能名

一句话描述。

1. 步骤…`,
          value: d.value,
          onInput: (a) => d.value = a.target.value
        }),
        e("div", { class: "upload-actions" }, [
          e("button", { class: "btn btn-tonal", disabled: t.value, onClick: () => u.value = !1 }, "取消"),
          e("button", { class: "btn btn-primary", disabled: t.value || !o.value.trim() || !d.value.trim(), onClick: z }, "保存技能")
        ])
      ]) : null,
      e("section", { class: "toolbar" }, [
        e("input", {
          placeholder: "搜索技能名称、描述或标签…",
          value: n.value,
          onInput: (a) => n.value = a.target.value
        }),
        e("span", { class: "toolbar-count" }, `${x.value.length} / ${l.value.length} 个技能`)
      ]),
      x.value.length === 0 ? e("div", { class: "empty-state" }, [
        e("p", {}, s.value ? "无法读取技能列表。确认 Agent 在线后重试。" : n.value ? "没有匹配的技能。" : "暂无技能。"),
        e("p", { class: "hint" }, s.value ? "" : "点击右上角「上传技能」创建第一个。")
      ]) : e(
        "section",
        { class: "skill-grid" },
        x.value.map(
          (a) => e("article", { class: "plugin-card skill-card", key: a.name }, [
            e("div", { class: "card-top" }, [
              e("code", {}, `/${a.name}`),
              e("span", { class: `status-chip${a.source === "builtin" ? " builtin" : ""}` }, a.source === "builtin" ? "内置" : "文件")
            ]),
            e("p", { class: "card-desc" }, a.description || "（无描述）"),
            a.tags && a.tags.length ? e("div", { class: "tags" }, a.tags.map((r) => e("span", { class: "chip", key: r }, `#${r}`))) : null,
            e("div", { class: "card-actions" }, [
              e("span", { class: "slash" }, `对话输入 /${a.name}`),
              e(
                "button",
                {
                  class: `btn sm ${m.value === a.name ? "btn-danger" : "btn-tonal"}`,
                  disabled: t.value,
                  onClick: () => C(a.name)
                },
                m.value === a.name ? "确认删除？" : "删除"
              )
            ])
          ])
        )
      )
    ]);
  }
};
export {
  A as default
};
