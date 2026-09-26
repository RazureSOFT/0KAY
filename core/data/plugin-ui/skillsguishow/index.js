import { ref as l, computed as I, onMounted as q, h as a } from "vue";
const E = `
/* ============ Skills GUI · Material 3 Expressive ============ */
#app .skg{
  --skg-spring:cubic-bezier(.22,1.3,.36,1);
  height:100%;overflow-y:auto;box-sizing:border-box;
  padding:clamp(22px,3vw,44px);
  color:var(--md-on-surface);font-family:var(--font-family);
  background:
    radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 12%,transparent),transparent 62%),
    radial-gradient(760px 420px at -8% 108%,color-mix(in srgb,var(--md-tertiary) 10%,transparent),transparent 60%),
    var(--md-surface);
}
#app .skg *{box-sizing:border-box}
#app .skg h1,#app .skg h2,#app .skg p{margin:0}
#app .skg button{font-family:inherit;position:static;min-height:0;isolation:auto}

/* ---------- Hero ---------- */
.skg-hero{
  position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:22px;flex-wrap:wrap;
  padding:clamp(24px,2.6vw,34px);border-radius:32px;margin-bottom:22px;
  background:
    radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 18%,transparent),transparent 70%),
    linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-high)));
  color:var(--md-on-primary-container);box-shadow:var(--shadow-1);
  animation:skg-rise 520ms var(--skg-spring) both;
}
.skg-hero-main{display:flex;gap:18px;align-items:flex-start;min-width:0}
.skg-logo{
  width:60px;height:60px;flex-shrink:0;display:grid;place-items:center;border-radius:22px 22px 22px 8px;
  background:var(--md-primary);color:var(--md-on-primary);
  box-shadow:0 10px 24px color-mix(in srgb,var(--md-primary) 32%,transparent);
}
.skg-eyebrow{display:inline-block;margin-bottom:10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 11px/1 ui-monospace,monospace;letter-spacing:.16em}
.skg-hero h1{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}
.skg-sub{margin-top:10px;font-size:13.5px;line-height:1.6;opacity:.82;max-width:62ch}
.skg-hero-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}

/* ---------- Buttons ---------- */
#app .skg .skg-btn{
  height:46px;padding:0 22px;border:0;border-radius:999px;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font:700 13.5px/1 inherit;color:var(--md-on-surface);background:var(--md-surface-container-high);
  transition:transform 260ms var(--skg-spring),background-color 180ms,box-shadow 200ms;
}
#app .skg .skg-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-2)}
#app .skg .skg-btn:disabled{opacity:.5;cursor:not-allowed}
#app .skg .skg-btn.skg-primary{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 32%,transparent)}
#app .skg .skg-btn.skg-tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skg .skg-btn.skg-danger{background:var(--md-error-container);color:var(--md-on-error-container,#410e0b)}
#app .skg .skg-btn.skg-sm{height:34px;padding:0 15px;font-size:12.5px}

/* ---------- Banners ---------- */
.skg-banner{padding:13px 18px;border-radius:18px;font-size:13px;margin-bottom:14px;font-weight:600}
.skg-banner.err{background:var(--md-error-container);color:var(--md-on-error-container,#410e0b)}
.skg-banner.ok{background:var(--md-success-container);color:#0d3b1e}

/* ---------- Stats ---------- */
.skg-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(178px,1fr));gap:18px;margin-bottom:22px}
.skg-stat{
  padding:20px;border-radius:26px;display:flex;flex-direction:column;gap:8px;
  box-shadow:var(--shadow-1);animation:skg-rise 520ms var(--skg-spring) both;
  transition:transform 300ms var(--skg-spring),box-shadow 300ms;
}
.skg-stat:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}
.skg-stat .skg-ic{width:40px;height:40px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 14%,transparent)}
.skg-stat b{font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.05}
.skg-stat span{font-size:11.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;opacity:.78}
.skg-stat.t1{background:var(--md-primary-container);color:var(--md-on-primary-container)}
.skg-stat.t2{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.skg-stat.t3{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#421326)}
.skg-stat.t4{background:var(--md-surface-container-low);color:var(--md-on-surface)}
.skg-stat.t4 .skg-ic{background:var(--md-surface-container-high)}
.skg-dir{font:11.5px/1.55 ui-monospace,monospace;word-break:break-all;opacity:.85;margin-top:2px}

/* ---------- Upload panel ---------- */
.skg-upload{
  padding:24px;border-radius:28px;margin-bottom:22px;display:flex;flex-direction:column;gap:14px;
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);
  box-shadow:var(--shadow-1);animation:skg-rise 460ms var(--skg-spring) both;
}
.skg-upload h2{font-size:17px;font-weight:800}
.skg-hint{font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}
.skg-upload input[type=text],.skg-textarea,.skg-search input{
  width:100%;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);
  color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;
  transition:background-color 180ms,border-color 180ms,box-shadow 200ms;
}
.skg-upload input[type=text],.skg-search input{height:50px;padding:0 16px}
.skg-textarea{min-height:150px;padding:14px 16px;line-height:1.6;resize:vertical}
.skg-upload input[type=text]:focus,.skg-textarea:focus,.skg-search input:focus{
  border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);
  box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);
}
.skg-upload-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.skg-upload-row input[type=text]{flex:1;min-width:200px}
.skg-file{
  display:inline-flex;align-items:center;gap:8px;height:50px;padding:0 18px;border-radius:16px;cursor:pointer;
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:700 13px/1 inherit;
  transition:background-color 180ms;
}
.skg-file:hover{background:var(--md-surface-container-highest)}
.skg-file input{display:none}
.skg-folder{
  display:flex;align-items:center;gap:16px;flex-wrap:wrap;
  padding:16px 18px;border-radius:22px;
  background:var(--md-secondary-container);color:var(--md-on-secondary-container);
}
.skg-folder b{font-size:14px;font-weight:800}
.skg-folder span{flex:1;min-width:180px;font-size:12.5px;line-height:1.55;opacity:.88}
.skg-folder .skg-btn{height:40px;padding:0 18px;background:var(--md-on-secondary-container);color:var(--md-secondary-container)}
.skg-upload-actions{display:flex;justify-content:flex-end;gap:10px}

/* ---------- Toolbar ---------- */
.skg-toolbar{display:flex;gap:14px;align-items:center;margin-bottom:18px;flex-wrap:wrap}
.skg-search{position:relative;flex:1;min-width:220px;display:flex;align-items:center}
.skg-search svg{position:absolute;left:16px;color:var(--md-on-surface-variant);pointer-events:none}
.skg-search input{padding-left:46px}
.skg-count{
  flex-shrink:0;height:34px;padding:0 14px;border-radius:999px;display:inline-flex;align-items:center;
  background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:700;
}

/* ---------- Cards ---------- */
.skg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(304px,1fr));gap:18px;padding-bottom:20px}
.skg-card{
  position:relative;padding:22px;border-radius:28px;display:flex;flex-direction:column;gap:14px;
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);
  box-shadow:var(--shadow-1);animation:skg-rise 520ms var(--skg-spring) both;
  transition:transform 300ms var(--skg-spring),box-shadow 300ms,border-color 300ms,border-radius 360ms var(--skg-spring);
}
.skg-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-3);border-color:color-mix(in srgb,var(--md-primary) 32%,var(--md-outline-variant));border-radius:28px 28px 28px 10px}
.skg-card-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
.skg-name{font:700 13px/1.2 ui-monospace,monospace;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:7px 13px;border-radius:999px}
.skg-pill{
  flex-shrink:0;height:30px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;
  font-size:12px;font-weight:700;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);
}
.skg-pill.builtin{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.skg-desc{font-size:14px;line-height:1.62;white-space:pre-wrap;color:var(--md-on-surface);flex:1;overflow-wrap:anywhere}
.skg-tags{display:flex;gap:6px;flex-wrap:wrap}
.skg-chip{height:26px;padding:0 11px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-primary-container);color:var(--md-on-primary-container)}
.skg-card-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:auto}
.skg-slash{font:11px/1.3 ui-monospace,monospace;color:var(--md-on-surface-variant)}

/* ---------- Empty ---------- */
.skg-empty{padding:64px 24px;text-align:center;border-radius:32px;background:var(--md-surface-container);color:var(--md-on-surface-variant)}
.skg-empty b{display:block;font-size:16px;font-weight:750;color:var(--md-on-surface)}
.skg-empty p{margin-top:8px;font-size:13px}

@keyframes skg-rise{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}
@media(max-width:860px){
  #app .skg{padding:var(--space-lg)}
  .skg-hero{display:block}
  .skg-hero-actions{margin-top:16px}
  .skg-grid{grid-template-columns:1fr}
}
`;
function R() {
  if (typeof document > "u") return;
  const r = document.getElementById("skillsguishow-style");
  if (r && r.textContent === E) return;
  r && r.remove();
  const i = document.createElement("style");
  i.id = "skillsguishow-style", i.textContent = E, document.head.appendChild(i);
}
async function w(r, i, t) {
  const p = { method: r, headers: { "Content-Type": "application/json" } };
  t !== void 0 && (p.body = JSON.stringify(t));
  const n = await fetch(i, p), c = await n.json().catch(() => ({}));
  if (!n.ok || c.success === !1)
    throw new Error(c.error || `${r} ${i} → ${n.status}`);
  return c.result !== void 0 && c.result !== null ? c.result : c;
}
function j(r) {
  return String(r || "").replace(/\.md$/i, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}
const k = (r, i = 22) => a(
  "svg",
  { width: i, height: i, viewBox: "0 0 24 24", fill: "none" },
  r.map((t) => a("path", { d: t, stroke: "currentColor", "stroke-width": 1.8, "stroke-linecap": "round", "stroke-linejoin": "round" }))
), _ = {
  name: "SkillsGuiShowPage",
  setup() {
    R();
    const r = l([]), i = l(""), t = l(""), p = l(""), n = l(!1), c = l(""), u = l(!1), d = l(""), m = l(""), v = l(""), f = l(""), C = l(null), $ = I(() => {
      const e = c.value.trim().toLowerCase();
      return e ? r.value.filter(
        (s) => s.name.toLowerCase().includes(e) || (s.description || "").toLowerCase().includes(e) || (s.tags || []).some((o) => String(o).toLowerCase().includes(e))
      ) : r.value;
    }), T = I(() => r.value.filter((e) => e.source !== "builtin").length), L = I(() => r.value.filter((e) => e.source === "builtin").length);
    async function h() {
      n.value = !0, t.value = "";
      try {
        const e = await w("GET", "/api/skills");
        r.value = Array.isArray(e?.skills) ? e.skills : [], i.value = e?.dir || "";
      } catch (e) {
        t.value = String(e?.message || e);
      } finally {
        n.value = !1;
      }
    }
    async function H() {
      if (!(!d.value.trim() || !m.value.trim())) {
        n.value = !0, t.value = "", p.value = "";
        try {
          await w("POST", "/api/skills", { name: d.value, content: m.value }), p.value = `已保存 ${d.value.trim()}`, d.value = "", m.value = "", u.value = !1, await h();
        } catch (e) {
          t.value = String(e?.message || e);
        } finally {
          n.value = !1;
        }
      }
    }
    async function Z(e) {
      if (v.value !== e) {
        v.value = e;
        return;
      }
      v.value = "", n.value = !0, t.value = "", p.value = "";
      try {
        await w("DELETE", `/api/skills?name=${encodeURIComponent(e)}`), p.value = `已删除 ${e}`, await h();
      } catch (s) {
        t.value = String(s?.message || s);
      } finally {
        n.value = !1;
      }
    }
    function B(e) {
      const s = e.target.files && e.target.files[0];
      if (!s) return;
      const o = new FileReader();
      o.onload = () => {
        m.value = String(o.result || ""), d.value || (d.value = j(s.name));
      }, o.readAsText(s), e.target.value = "";
    }
    async function F(e) {
      const s = Array.from(e.target.files || []);
      e.target.value = "";
      const o = s.filter((g) => /\.md$/i.test(g.name) || g.type === "text/markdown" || g.type === "text/plain");
      if (!o.length) {
        t.value = "所选文件夹里没有找到 .md 文件";
        return;
      }
      n.value = !0, t.value = "", p.value = "";
      let y = 0, x = 0;
      for (let g = 0; g < o.length; g++) {
        const z = o[g], S = j(z.name);
        if (f.value = `${g + 1}/${o.length} · ${S || z.name}`, !S) {
          x++;
          continue;
        }
        try {
          const O = await z.text();
          await w("POST", "/api/skills", { name: S, content: O }), y++;
        } catch {
          x++;
        }
      }
      f.value = "", p.value = `文件夹上传完成：成功 ${y} 个${x ? ` · 失败 ${x} 个` : ""}`, u.value = !1, await h(), n.value = !1;
    }
    q(h);
    const b = (e, s, o, y, x) => a("div", { class: `skg-stat ${e}` }, [
      a("span", { class: "skg-ic" }, s),
      a("b", {}, o),
      a("span", {}, y),
      x ? a("div", { class: "skg-dir" }, x) : null
    ]), G = () => k(["M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5v-16Z"]), N = () => k(["M7 3h7l5 5v13H7z", "M14 3v5h5"]), M = () => k(["M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"]), A = () => k(["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"]), P = () => k(["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z", "m20 20-3.5-3.5"]), U = () => k(["M12 16V4", "m7 9 5-5 5 5", "M5 20h14"]), Y = () => k(["M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"]);
    return () => a("div", { class: "skg" }, [
      a("input", { ref: C, type: "file", webkitdirectory: "", directory: "", multiple: !0, style: "display:none", onChange: F }),
      a("header", { class: "skg-hero" }, [
        a("div", { class: "skg-hero-main" }, [
          a("span", { class: "skg-logo" }, M()),
          a("div", {}, [
            a("span", { class: "skg-eyebrow" }, "AGENT · SKILLS"),
            a("h1", {}, "技能管理"),
            a("p", { class: "skg-sub" }, "浏览、上传、删除 Agent 技能。技能由 Agent 插件加载；在对话框输入 /技能名 可强制套用该技能。")
          ])
        ]),
        a("div", { class: "skg-hero-actions" }, [
          a("button", { class: "skg-btn skg-tonal", disabled: n.value, onClick: h }, [Y(), n.value ? "刷新中…" : "刷新"]),
          a("button", { class: "skg-btn skg-tonal", disabled: n.value, onClick: () => C.value?.click() }, [A(), "上传文件夹"]),
          a("button", { class: "skg-btn skg-primary", onClick: () => u.value = !u.value }, [U(), u.value ? "收起上传" : "上传技能"])
        ])
      ]),
      t.value ? a("div", { class: "skg-banner err" }, t.value) : null,
      p.value ? a("div", { class: "skg-banner ok" }, p.value) : null,
      a("section", { class: "skg-stats" }, [
        b("t1", G(), String(r.value.length), "技能总数", "含内置与文件技能"),
        b("t2", N(), String(T.value), "文件技能", "可编辑、可删除"),
        b("t3", M(), String(L.value), "内置技能", "code / research / general"),
        b("t4", A(), i.value ? "目录" : "—", "技能目录", i.value || "—")
      ]),
      u.value ? a("section", { class: "skg-upload" }, [
        a("h2", {}, "上传 / 覆盖技能"),
        a("p", { class: "skg-hint" }, "单个 Markdown 文件或直接粘贴内容。名称仅限英文、数字、-、_，将成为 /斜杠调用名。"),
        a("div", { class: "skg-upload-row" }, [
          a("input", { type: "text", placeholder: "技能名，例如 code-review", value: d.value, onInput: (e) => d.value = e.target.value }),
          a("label", { class: "skg-file" }, ["选择 .md 文件", a("input", { type: "file", accept: ".md,text/markdown,text/plain", onChange: B })])
        ]),
        a("textarea", { class: "skg-textarea", placeholder: `# 技能名

一句话描述。

1. 步骤…`, value: m.value, onInput: (e) => m.value = e.target.value }),
        a("div", { class: "skg-folder" }, [
          a("b", {}, "批量导入"),
          a("span", {}, `选择包含多个 .md 的整个文件夹，逐个创建或覆盖（文件名即技能名）。${f.value ? "  " + f.value : ""}`),
          a("button", { class: "skg-btn", disabled: n.value, onClick: () => C.value?.click() }, f.value ? "上传中…" : "选择文件夹")
        ]),
        a("div", { class: "skg-upload-actions" }, [
          a("button", { class: "skg-btn skg-tonal", disabled: n.value, onClick: () => u.value = !1 }, "取消"),
          a("button", { class: "skg-btn skg-primary", disabled: n.value || !d.value.trim() || !m.value.trim(), onClick: H }, "保存技能")
        ])
      ]) : null,
      a("section", { class: "skg-toolbar" }, [
        a("label", { class: "skg-search" }, [P(), a("input", { placeholder: "搜索技能名称、描述或标签…", value: c.value, onInput: (e) => c.value = e.target.value })]),
        a("span", { class: "skg-count" }, `${$.value.length} / ${r.value.length}`)
      ]),
      $.value.length === 0 ? a("div", { class: "skg-empty" }, [
        a("b", {}, t.value ? "无法读取技能列表" : c.value ? "没有匹配的技能" : "暂无技能"),
        a("p", {}, t.value ? "确认 Agent 在线后重试。" : "点击右上角「上传技能」或「上传文件夹」创建。")
      ]) : a(
        "section",
        { class: "skg-grid" },
        $.value.map(
          (e, s) => a("article", { class: "skg-card", key: e.name, style: `animation-delay:${Math.min(s, 12) * 40}ms` }, [
            a("div", { class: "skg-card-top" }, [
              a("code", { class: "skg-name" }, `/${e.name}`),
              a("span", { class: `skg-pill${e.source === "builtin" ? " builtin" : ""}` }, e.source === "builtin" ? "内置" : "文件")
            ]),
            a("p", { class: "skg-desc" }, e.description || "（无描述）"),
            e.tags && e.tags.length ? a("div", { class: "skg-tags" }, e.tags.map((o) => a("span", { class: "skg-chip", key: o }, `#${o}`))) : null,
            a("div", { class: "skg-card-foot" }, [
              a("span", { class: "skg-slash" }, `对话输入 /${e.name}`),
              a("button", { class: `skg-btn skg-sm ${v.value === e.name ? "skg-danger" : "skg-tonal"}`, disabled: n.value, onClick: () => Z(e.name) }, v.value === e.name ? "确认删除？" : "删除")
            ])
          ])
        )
      )
    ]);
  }
};
export {
  _ as default
};
