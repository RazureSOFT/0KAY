import { ref as r, computed as h, onMounted as $, h as e } from "vue";
const E = `
.skills-page{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface)}
.skills-page *{box-sizing:border-box}
.skills-page .page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}
.skills-page .subtitle{color:var(--md-on-surface-variant);font-size:14px;margin:4px 0 0;line-height:1.6;max-width:680px}
.skills-page .header-actions{display:flex;gap:var(--space-sm);flex-wrap:wrap}
.skills-page .btn{height:36px;min-height:36px;padding:0 14px;font-size:13px}
.skills-page .btn.sm{height:28px;min-height:28px;padding:0 10px;font-size:12px}
.skills-page .error-banner{padding:12px 16px;margin-bottom:var(--space-md);background:var(--md-error-container);color:#410E0B;border-radius:var(--radius-md);font-size:13px}
.skills-page .flash-banner{padding:12px 16px;margin-bottom:var(--space-md);background:var(--md-success-container);color:#0D1F06;border-radius:var(--radius-md);font-size:13px}
.skills-page .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:var(--space-md);margin-bottom:var(--space-xl)}
.skills-page .stat-card{padding:var(--space-lg);border:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}
.skills-page .stat-label{font-size:12px;color:var(--md-on-surface-variant);text-transform:uppercase;letter-spacing:.4px}
.skills-page .stat-value{font-size:28px;font-weight:700;color:var(--md-on-surface)}
.skills-page .stat-dir{font:12px/1.5 ui-monospace,monospace;word-break:break-all;color:var(--md-on-surface-variant)}
.skills-page .upload-panel{padding:var(--space-lg);margin-bottom:var(--space-xl);display:flex;flex-direction:column;gap:var(--space-sm)}
.skills-page .upload-panel h2{margin:0;font-size:16px;font-weight:600}
.skills-page .upload-panel .hint{margin:0 0 var(--space-sm);font-size:13px;color:var(--md-on-surface-variant)}
.skills-page .upload-row{display:flex;gap:var(--space-sm);flex-wrap:wrap;align-items:center}
.skills-page .upload-row input[type=text]{flex:1;min-width:200px;height:40px;padding:0 14px}
.skills-page .file-pick{font-size:13px;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;gap:6px}
.skills-page textarea{width:100%;min-height:140px;padding:12px 14px;line-height:1.5;resize:vertical}
.skills-page .upload-actions{display:flex;justify-content:flex-end;gap:var(--space-sm);margin-top:var(--space-sm)}
.skills-page .toolbar{display:flex;gap:12px;align-items:center;margin-bottom:var(--space-lg)}
.skills-page .toolbar input{flex:1;min-width:0;height:40px;padding:0 14px}
.skills-page .toolbar-count{font-size:13px;color:var(--md-on-surface-variant);white-space:nowrap;padding:0 4px}
.skills-page .skill-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-lg);padding-bottom:var(--space-lg)}
.skills-page .skill-card{padding:var(--space-lg);display:flex;flex-direction:column;gap:var(--space-md)}
.skills-page .card-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
.skills-page .card-top code{font:600 13px/1.2 ui-monospace,monospace;color:var(--md-primary);background:var(--md-primary-container);padding:4px 10px;border-radius:var(--radius-full)}
.skills-page .status-chip{height:28px;padding:0 10px;display:inline-flex;align-items:center;font-size:12px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);border:1px solid transparent;white-space:nowrap}
.skills-page .status-chip.builtin{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.skills-page .card-desc{margin:0;font-size:14px;line-height:1.55;white-space:pre-wrap;color:var(--md-on-surface);flex:1}
.skills-page .tags{display:flex;gap:6px;flex-wrap:wrap}
.skills-page .chip{height:24px;padding:0 8px;font-size:12px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.skills-page .card-actions{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:auto}
.skills-page .slash{font:11px/1.3 ui-monospace,monospace;color:var(--md-on-surface-variant)}
.skills-page .empty-state{padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);color:var(--md-on-surface-variant);border-radius:32px;margin-bottom:var(--space-lg)}
.skills-page .empty-state .hint{margin-top:6px;font-size:13px;opacity:.85}
@media(max-width:860px){
  .skills-page{padding:var(--space-lg)}
  .skills-page .page-header{display:block}
  .skills-page .header-actions{margin-top:12px}
  .skills-page .skill-grid{grid-template-columns:1fr}
}
`;
let k = !1;
function j() {
  if (k || typeof document > "u") return;
  if (document.getElementById("skillsguishow-style")) {
    k = !0;
    return;
  }
  const t = document.createElement("style");
  t.id = "skillsguishow-style", t.textContent = E, document.head.appendChild(t), k = !0;
}
async function b(t, g, i) {
  const o = { method: t, headers: { "Content-Type": "application/json" } };
  i !== void 0 && (o.body = JSON.stringify(i));
  const l = await fetch(g, o), n = await l.json().catch(() => ({}));
  if (!l.ok || n.success === !1)
    throw new Error(n.error || `${t} ${g} → ${l.status}`);
  return n.result !== void 0 && n.result !== null ? n.result : n;
}
const I = {
  name: "SkillsGuiShowPage",
  setup() {
    j();
    const t = r([]), g = r(""), i = r(""), o = r(""), l = r(!1), n = r(""), u = r(!1), p = r(""), d = r(""), v = r(""), f = h(() => {
      const a = n.value.trim().toLowerCase();
      return a ? t.value.filter(
        (s) => s.name.toLowerCase().includes(a) || (s.description || "").toLowerCase().includes(a) || (s.tags || []).some((c) => String(c).toLowerCase().includes(a))
      ) : t.value;
    }), y = h(() => t.value.filter((a) => a.source !== "builtin").length), w = h(() => t.value.filter((a) => a.source === "builtin").length);
    async function m() {
      l.value = !0, i.value = "";
      try {
        const a = await b("GET", "/api/skills");
        t.value = Array.isArray(a?.skills) ? a.skills : [], g.value = a?.dir || "";
      } catch (a) {
        i.value = String(a?.message || a);
      } finally {
        l.value = !1;
      }
    }
    async function C() {
      if (!(!p.value.trim() || !d.value.trim())) {
        l.value = !0, i.value = "", o.value = "";
        try {
          await b("POST", "/api/skills", { name: p.value, content: d.value }), o.value = `已保存 ${p.value.trim()}`, p.value = "", d.value = "", u.value = !1, await m();
        } catch (a) {
          i.value = String(a?.message || a);
        } finally {
          l.value = !1;
        }
      }
    }
    async function z(a) {
      if (v.value !== a) {
        v.value = a;
        return;
      }
      v.value = "", l.value = !0, i.value = "", o.value = "";
      try {
        await b("DELETE", `/api/skills?name=${encodeURIComponent(a)}`), o.value = `已删除 ${a}`, await m();
      } catch (s) {
        i.value = String(s?.message || s);
      } finally {
        l.value = !1;
      }
    }
    function S(a) {
      const s = a.target.files && a.target.files[0];
      if (!s) return;
      const c = new FileReader();
      c.onload = () => {
        d.value = String(c.result || ""), p.value || (p.value = s.name.replace(/\.md$/i, ""));
      }, c.readAsText(s), a.target.value = "";
    }
    $(m);
    const x = (a, s, c) => e("div", { class: "stat-card" }, [
      e("span", { class: "stat-label" }, a),
      e("span", { class: "stat-value" }, s),
      c ? e("span", { class: "stat-label", style: "text-transform:none;letter-spacing:0" }, c) : null
    ]);
    return () => e("div", { class: "skills-page" }, [
      e("header", { class: "page-header" }, [
        e("div", {}, [
          e("h1", {}, "技能管理"),
          e("p", { class: "subtitle" }, "浏览、上传、删除 Agent 技能。技能由 Agent 插件加载；在对话框输入 /技能名 可强制套用该技能。")
        ]),
        e("div", { class: "header-actions" }, [
          e("button", { class: "btn btn-tonal", disabled: l.value, onClick: m }, l.value ? "刷新中…" : "刷新"),
          e("button", { class: "btn btn-primary", onClick: () => u.value = !u.value }, u.value ? "收起上传" : "上传技能")
        ])
      ]),
      i.value ? e("div", { class: "error-banner" }, i.value) : null,
      o.value ? e("div", { class: "flash-banner" }, o.value) : null,
      e("section", { class: "stat-grid" }, [
        x("技能总数", String(t.value.length), "含内置与文件技能"),
        x("文件技能", String(y.value), "可编辑、可删除"),
        x("内置技能", String(w.value), "code / research / general"),
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
            value: p.value,
            onInput: (a) => p.value = a.target.value
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
          e("button", { class: "btn btn-tonal", disabled: l.value, onClick: () => u.value = !1 }, "取消"),
          e("button", { class: "btn btn-primary", disabled: l.value || !p.value.trim() || !d.value.trim(), onClick: C }, "保存技能")
        ])
      ]) : null,
      e("section", { class: "toolbar" }, [
        e("input", {
          placeholder: "搜索技能名称、描述或标签…",
          value: n.value,
          onInput: (a) => n.value = a.target.value
        }),
        e("span", { class: "toolbar-count" }, `${f.value.length} / ${t.value.length} 个技能`)
      ]),
      f.value.length === 0 ? e("div", { class: "empty-state" }, [
        e("p", {}, i.value ? "无法读取技能列表。确认 Agent 在线后重试。" : n.value ? "没有匹配的技能。" : "暂无技能。"),
        e("p", { class: "hint" }, i.value ? "" : "点击右上角「上传技能」创建第一个。")
      ]) : e(
        "section",
        { class: "skill-grid" },
        f.value.map(
          (a) => e("article", { class: "plugin-card skill-card", key: a.name }, [
            e("div", { class: "card-top" }, [
              e("code", {}, `/${a.name}`),
              e("span", { class: `status-chip${a.source === "builtin" ? " builtin" : ""}` }, a.source === "builtin" ? "内置" : "文件")
            ]),
            e("p", { class: "card-desc" }, a.description || "（无描述）"),
            a.tags && a.tags.length ? e("div", { class: "tags" }, a.tags.map((s) => e("span", { class: "chip", key: s }, `#${s}`))) : null,
            e("div", { class: "card-actions" }, [
              e("span", { class: "slash" }, `对话输入 /${a.name}`),
              e(
                "button",
                {
                  class: `btn sm ${v.value === a.name ? "btn-danger" : "btn-tonal"}`,
                  disabled: l.value,
                  onClick: () => z(a.name)
                },
                v.value === a.name ? "确认删除？" : "删除"
              )
            ])
          ])
        )
      )
    ]);
  }
};
export {
  I as default
};
