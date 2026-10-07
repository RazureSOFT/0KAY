import { ref as c, computed as C, onMounted as aa, onUnmounted as ea, h as a } from "vue";
import { i18n as ra } from "@0kay/host";
const ta = {
  title: "技能管理",
  subtitle: "浏览、上传、删除 Agent 技能。技能由 Agent 插件加载；在对话框输入 /技能名 可强制套用该技能。",
  refresh: "刷新",
  refreshing: "刷新中…",
  uploadFolder: "上传文件夹",
  uploadSkill: "上传技能",
  collapseUpload: "收起上传",
  statTotal: "技能总数",
  statTotalHint: "含内置与文件技能",
  statFile: "文件技能",
  statFileHint: "可编辑、可删除",
  statBuiltin: "内置技能",
  statBuiltinHint: "code / research / general",
  statDir: "技能目录",
  dirValue: "目录",
  uploadTitle: "上传 / 覆盖技能",
  uploadHint: "单个 Markdown 文件或直接粘贴内容。名称仅限英文、数字、-、_，将成为 /斜杠调用名。",
  namePlaceholder: "技能名，例如 code-review",
  pickFile: "选择 .md 文件",
  contentPlaceholder: `# 技能名

一句话描述。

1. 步骤…`,
  batchImport: "批量导入",
  batchImportHint: "选择包含多个 .md 的整个文件夹，逐个创建或覆盖（文件名即技能名）。",
  chooseFolder: "选择文件夹",
  uploading: "上传中…",
  cancel: "取消",
  saveSkill: "保存技能",
  searchAria: "搜索技能",
  searchPlaceholder: "搜索技能名称、描述或标签…",
  emptyErrorTitle: "无法读取技能列表",
  emptyErrorHint: "确认 Agent 在线后重试。",
  emptyNoMatch: "没有匹配的技能",
  emptyNoneTitle: "暂无技能",
  emptyNoneHint: "点击右上角「上传技能」或「上传文件夹」创建。",
  pillBuiltin: "内置",
  pillFile: "文件",
  noDesc: "（无描述）",
  slashHint: "对话输入 /{name}",
  delete: "删除",
  confirmDelete: "确认删除？",
  close: "关闭",
  saved: "已保存 {name}",
  deleted: "已删除 {name}",
  folderNoMd: "所选文件夹里没有找到 .md 文件",
  folderDone: "文件夹上传完成：成功 {ok} 个",
  folderDoneFailed: "文件夹上传完成：成功 {ok} 个 · 失败 {failed} 个",
  progress: "{done}/{total} · {name}"
};
function r(n, s) {
  const o = `skillsguishow.${n}`;
  let l = null;
  try {
    const t = ra.global.t(o, s ?? {});
    if (t && t !== o) return t;
  } catch {
  }
  if (l = ta[n] ?? n, s)
    for (const [t, d] of Object.entries(s)) l = l.split(`{${t}}`).join(String(d));
  return l;
}
const P = `
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
  animation:skg-rise var(--duration-medium,220ms) var(--skg-spring) both;
}
.skg-hero-main{display:flex;gap:18px;align-items:flex-start;min-width:0}
.skg-logo{
  width:60px;height:60px;flex-shrink:0;display:grid;place-items:center;border-radius:22px 22px 22px 8px;
  background:var(--md-primary);color:var(--md-on-primary);
  box-shadow:0 10px 24px color-mix(in srgb,var(--md-primary) 32%,transparent);
}
.skg-eyebrow{display:inline-block;margin-bottom:10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}
.skg-hero h1{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}
.skg-sub{margin-top:10px;font-size:14px;line-height:1.6;opacity:.82;max-width:62ch}
.skg-hero-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}

/* ---------- Buttons ---------- */
#app .skg .skg-btn{
  height:46px;padding:0 22px;border:0;border-radius:999px;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font:700 14px/1 inherit;color:var(--md-on-surface);background:var(--md-surface-container-high);
  transition:transform 260ms var(--skg-spring),background-color 180ms,box-shadow 200ms;
}
#app .skg .skg-btn:disabled{opacity:.5;cursor:not-allowed}
@media (hover: hover) and (pointer: fine){
  #app .skg .skg-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-2)}
}
#app .skg .skg-btn.skg-primary{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 32%,transparent)}
#app .skg .skg-btn.skg-tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skg .skg-btn.skg-danger{background:var(--md-error-container);color:var(--md-on-error-container)}
#app .skg .skg-btn.skg-sm{min-height:44px;padding:0 15px;font-size:13px}

/* ---------- Banners ---------- */
.skg-banner{
  padding:13px 18px;border-radius:18px;font-size:13px;margin-bottom:14px;font-weight:600;
  display:flex;align-items:flex-start;justify-content:space-between;gap:12px;
  animation:skg-rise var(--duration-medium,220ms) var(--skg-spring) both;
}
.skg-banner.err{background:var(--md-error-container);color:var(--md-on-error-container)}
.skg-banner.ok{background:var(--md-success-container);color:var(--md-on-success-container)}
.skg-banner-close{
  flex-shrink:0;width:26px;height:26px;margin:-4px -6px 0 0;display:grid;place-items:center;
  border:0;border-radius:50%;background:transparent;color:inherit;cursor:pointer;font-size:17px;line-height:1;
  opacity:.65;transition:opacity 160ms,background-color 160ms;
}
.skg-banner-close:hover{opacity:1;background:color-mix(in srgb,currentColor 12%,transparent)}

/* ---------- Stats ---------- */
.skg-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(178px,1fr));gap:18px;margin-bottom:22px}
.skg-stat{
  padding:20px;border-radius:26px;display:flex;flex-direction:column;gap:8px;
  box-shadow:var(--shadow-1);animation:skg-rise var(--duration-medium,220ms) var(--skg-spring) both;
  transition:transform 300ms var(--skg-spring),box-shadow 300ms;
}
@media (hover: hover) and (pointer: fine){
  .skg-stat:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}
}
.skg-stat .skg-ic{width:40px;height:40px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 14%,transparent)}
.skg-stat b{font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.05}
.skg-stat span{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;opacity:.78}
.skg-stat.t1{background:var(--md-primary-container);color:var(--md-on-primary-container)}
.skg-stat.t2{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.skg-stat.t3{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}
.skg-stat.t4{background:var(--md-surface-container-low);color:var(--md-on-surface)}
.skg-stat.t4 .skg-ic{background:var(--md-surface-container-high)}
.skg-dir{font:11.5px/1.55 ui-monospace,monospace;word-break:break-all;opacity:.85;margin-top:2px}

/* ---------- Upload panel ---------- */
.skg-upload{
  padding:24px;border-radius:28px;margin-bottom:22px;display:flex;flex-direction:column;gap:14px;
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);
  box-shadow:var(--shadow-1);animation:skg-rise var(--duration-medium,220ms) var(--skg-spring) both;
}
.skg-upload h2{font-size:17px;font-weight:800}
.skg-hint{font-size:13px;line-height:1.6;color:var(--md-on-surface-variant)}
.skg-upload input[type=text],.skg-textarea,.skg-search input{
  width:100%;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);
  color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;
  transition:background-color 180ms,border-color 180ms,box-shadow 200ms;
}
.skg-upload input[type=text],.skg-search input{height:50px;padding:0 16px}
.skg-textarea{min-height:150px;padding:14px 16px;line-height:1.6;resize:vertical}
.skg-upload input[type=text]:focus-visible,.skg-textarea:focus-visible,.skg-search input:focus-visible{
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
.skg-folder span{flex:1;min-width:180px;font-size:13px;line-height:1.55;opacity:.88}
.skg-folder .skg-btn{min-height:44px;padding:0 18px;background:var(--md-on-secondary-container);color:var(--md-secondary-container)}
/* Batch-import progress bar (percent fill while a folder upload runs) */
.skg-progress{
  flex:1 1 100%;height:8px;border-radius:999px;overflow:hidden;
  background:color-mix(in srgb,var(--md-on-secondary-container) 22%,transparent);
}
.skg-progress-fill{
  height:100%;border-radius:999px;background:var(--md-on-secondary-container);
  transition:width 240ms var(--skg-spring);
}
.skg-upload-actions{display:flex;justify-content:flex-end;gap:10px}

/* ---------- Toolbar ---------- */
.skg-toolbar{display:flex;gap:14px;align-items:center;margin-bottom:18px;flex-wrap:wrap}
.skg-search{position:relative;flex:1;min-width:220px;display:flex;align-items:center}
.skg-search svg{position:absolute;left:16px;color:var(--md-on-surface-variant);pointer-events:none}
.skg-search input{padding-left:46px}
.skg-count{
  flex-shrink:0;height:34px;padding:0 14px;border-radius:999px;display:inline-flex;align-items:center;
  background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:13px;font-weight:700;
}

/* ---------- Cards ---------- */
.skg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(304px,1fr));gap:18px;padding-bottom:20px}
.skg-card{
  position:relative;padding:22px;border-radius:28px;display:flex;flex-direction:column;gap:14px;
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);
  box-shadow:var(--shadow-1);animation:skg-rise var(--duration-medium,220ms) var(--skg-spring) both;
  transition:transform 300ms var(--skg-spring),box-shadow 300ms,border-color 300ms,border-radius 360ms var(--skg-spring);
}
@media (hover: hover) and (pointer: fine){
  .skg-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-3);border-color:color-mix(in srgb,var(--md-primary) 32%,var(--md-outline-variant));border-radius:28px 28px 28px 10px}
}
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
@media (prefers-reduced-motion: reduce){
  #app .skg *, #app .skg *::before, #app .skg *::after{
    animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
    scroll-behavior:auto !important;
  }
  .skg-stat:hover,
  .skg-card:hover,
  #app .skg .skg-btn:hover:not(:disabled){transform:none}
}
`;
function na() {
  if (typeof document > "u") return;
  const n = document.getElementById("skillsguishow-style");
  if (n && n.textContent === P) return;
  n && n.remove();
  const s = document.createElement("style");
  s.id = "skillsguishow-style", s.textContent = P, document.head.appendChild(s);
}
async function z(n, s, o) {
  const l = { method: n, headers: { "Content-Type": "application/json" } };
  o !== void 0 && (l.body = JSON.stringify(o));
  const t = await fetch(s, l), d = await t.json().catch(() => ({}));
  if (!t.ok || d.success === !1)
    throw new Error(d.error || `${n} ${s} → ${t.status}`);
  return d.result !== void 0 && d.result !== null ? d.result : d;
}
function U(n) {
  return String(n || "").replace(/\.md$/i, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}
const f = (n, s = 22) => a(
  "svg",
  { width: s, height: s, viewBox: "0 0 24 24", fill: "none" },
  n.map((o) => a("path", { d: o, stroke: "currentColor", "stroke-width": 1.8, "stroke-linecap": "round", "stroke-linejoin": "round" }))
), ia = {
  name: "SkillsGuiShowPage",
  setup() {
    na();
    const n = c([]), s = c(""), o = c(""), l = c(""), t = c(!1), d = c(""), m = c(!1), g = c(""), v = c(""), x = c(""), H = c(null), b = c(0), h = c(0), F = c(""), I = C(() => h.value > 0), Z = C(() => h.value ? Math.round(b.value / h.value * 100) : 0);
    let M = null;
    function $(e) {
      l.value = e, clearTimeout(M), M = setTimeout(() => {
        l.value = "";
      }, 4e3);
    }
    const E = C(() => {
      const e = d.value.trim().toLowerCase();
      return e ? n.value.filter(
        (i) => i.name.toLowerCase().includes(e) || (i.description || "").toLowerCase().includes(e) || (i.tags || []).some((p) => String(p).toLowerCase().includes(e))
      ) : n.value;
    }), G = C(() => n.value.filter((e) => e.source !== "builtin").length), O = C(() => n.value.filter((e) => e.source === "builtin").length);
    async function y() {
      t.value = !0, o.value = "";
      try {
        const e = await z("GET", "/api/skills");
        n.value = Array.isArray(e?.skills) ? e.skills : [], s.value = e?.dir || "";
      } catch (e) {
        o.value = String(e?.message || e);
      } finally {
        t.value = !1;
      }
    }
    async function V() {
      if (!(!g.value.trim() || !v.value.trim())) {
        t.value = !0, o.value = "", l.value = "";
        try {
          await z("POST", "/api/skills", { name: g.value, content: v.value }), $(r("saved", { name: g.value.trim() })), g.value = "", v.value = "", m.value = !1, await y();
        } catch (e) {
          o.value = String(e?.message || e);
        } finally {
          t.value = !1;
        }
      }
    }
    let T = null;
    function A() {
      clearTimeout(T), x.value = "";
    }
    function N(e) {
      e.key === "Escape" && x.value && A();
    }
    async function Y(e) {
      if (x.value !== e) {
        clearTimeout(T), x.value = e, T = setTimeout(A, 3e3);
        return;
      }
      A(), t.value = !0, o.value = "", l.value = "";
      try {
        await z("DELETE", `/api/skills?name=${encodeURIComponent(e)}`), $(r("deleted", { name: e })), await y();
      } catch (i) {
        o.value = String(i?.message || i);
      } finally {
        t.value = !1;
      }
    }
    function K(e) {
      const i = e.target.files && e.target.files[0];
      if (!i) return;
      const p = new FileReader();
      p.onload = () => {
        v.value = String(p.result || ""), g.value || (g.value = U(i.name));
      }, p.readAsText(i), e.target.value = "";
    }
    async function q(e) {
      const i = Array.from(e.target.files || []);
      e.target.value = "";
      const p = i.filter((u) => /\.md$/i.test(u.name) || u.type === "text/markdown" || u.type === "text/plain");
      if (!p.length) {
        o.value = r("folderNoMd");
        return;
      }
      t.value = !0, o.value = "", l.value = "", b.value = 0, h.value = p.length;
      let w = 0, k = 0;
      for (let u = 0; u < p.length; u++) {
        const D = p[u], B = U(D.name);
        if (F.value = B || D.name, !B) {
          k++, b.value = u + 1;
          continue;
        }
        try {
          const X = await D.text();
          await z("POST", "/api/skills", { name: B, content: X }), w++;
        } catch {
          k++;
        }
        b.value = u + 1;
      }
      h.value = 0, F.value = "", $(k ? r("folderDoneFailed", { ok: w, failed: k }) : r("folderDone", { ok: w })), m.value = !1, await y(), t.value = !1;
    }
    aa(() => {
      y(), window.addEventListener("keydown", N);
    }), ea(() => {
      window.removeEventListener("keydown", N), clearTimeout(M), clearTimeout(T);
    });
    const S = (e, i, p, w, k) => a("div", { class: `skg-stat ${e}` }, [
      a("span", { class: "skg-ic" }, i),
      a("b", {}, p),
      a("span", {}, w),
      k ? a("div", { class: "skg-dir" }, k) : null
    ]), R = () => f(["M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5v-16Z"]), _ = () => f(["M7 3h7l5 5v13H7z", "M14 3v5h5"]), j = () => f(["M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"]), L = () => f(["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"]), J = () => f(["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z", "m20 20-3.5-3.5"]), Q = () => f(["M12 16V4", "m7 9 5-5 5 5", "M5 20h14"]), W = () => f(["M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"]);
    return () => a("div", { class: "skg" }, [
      a("input", { ref: H, type: "file", webkitdirectory: "", directory: "", multiple: !0, style: "display:none", onChange: q }),
      a("header", { class: "skg-hero" }, [
        a("div", { class: "skg-hero-main" }, [
          a("span", { class: "skg-logo" }, j()),
          a("div", {}, [
            a("span", { class: "skg-eyebrow" }, "AGENT · SKILLS"),
            a("h1", {}, r("title")),
            a("p", { class: "skg-sub" }, r("subtitle"))
          ])
        ]),
        a("div", { class: "skg-hero-actions" }, [
          a("button", { class: "skg-btn skg-tonal", disabled: t.value, onClick: y }, [W(), t.value ? r("refreshing") : r("refresh")]),
          a("button", { class: "skg-btn skg-tonal", disabled: t.value, onClick: () => H.value?.click() }, [L(), r("uploadFolder")]),
          a("button", { class: "skg-btn skg-primary", onClick: () => m.value = !m.value }, [Q(), m.value ? r("collapseUpload") : r("uploadSkill")])
        ])
      ]),
      o.value ? a("div", { class: "skg-banner err" }, [
        a("span", {}, o.value),
        a("button", { class: "skg-banner-close", "aria-label": r("close"), title: r("close"), onClick: () => o.value = "" }, "×")
      ]) : null,
      l.value ? a("div", { class: "skg-banner ok" }, l.value) : null,
      a("section", { class: "skg-stats" }, [
        S("t1", R(), String(n.value.length), r("statTotal"), r("statTotalHint")),
        S("t2", _(), String(G.value), r("statFile"), r("statFileHint")),
        S("t3", j(), String(O.value), r("statBuiltin"), r("statBuiltinHint")),
        S("t4", L(), s.value ? r("dirValue") : "—", r("statDir"), s.value || "—")
      ]),
      m.value ? a("section", { class: "skg-upload" }, [
        a("h2", {}, r("uploadTitle")),
        a("p", { class: "skg-hint" }, r("uploadHint")),
        a("div", { class: "skg-upload-row" }, [
          a("input", { type: "text", placeholder: r("namePlaceholder"), value: g.value, onInput: (e) => g.value = e.target.value }),
          a("label", { class: "skg-file" }, [r("pickFile"), a("input", { type: "file", accept: ".md,text/markdown,text/plain", onChange: K })])
        ]),
        a("textarea", { class: "skg-textarea", placeholder: r("contentPlaceholder"), value: v.value, onInput: (e) => v.value = e.target.value }),
        a("div", { class: "skg-folder" }, [
          a("b", {}, r("batchImport")),
          a("span", {}, I.value ? r("progress", { done: b.value, total: h.value, name: F.value }) : r("batchImportHint")),
          I.value ? a("div", { class: "skg-progress" }, [
            a("div", { class: "skg-progress-fill", style: { width: `${Z.value}%` } })
          ]) : null,
          a("button", { class: "skg-btn", disabled: t.value, onClick: () => H.value?.click() }, I.value ? r("uploading") : r("chooseFolder"))
        ]),
        a("div", { class: "skg-upload-actions" }, [
          a("button", { class: "skg-btn skg-tonal", disabled: t.value, onClick: () => m.value = !1 }, r("cancel")),
          a("button", { class: "skg-btn skg-primary", disabled: t.value || !g.value.trim() || !v.value.trim(), onClick: V }, r("saveSkill"))
        ])
      ]) : null,
      a("section", { class: "skg-toolbar" }, [
        a("label", { class: "skg-search" }, [J(), a("input", { "aria-label": r("searchAria"), placeholder: r("searchPlaceholder"), value: d.value, onInput: (e) => d.value = e.target.value })]),
        a("span", { class: "skg-count" }, `${E.value.length} / ${n.value.length}`)
      ]),
      E.value.length === 0 ? a("div", { class: "skg-empty" }, [
        a("b", {}, o.value ? r("emptyErrorTitle") : d.value ? r("emptyNoMatch") : r("emptyNoneTitle")),
        a("p", {}, o.value ? r("emptyErrorHint") : r("emptyNoneHint"))
      ]) : a(
        "section",
        { class: "skg-grid" },
        E.value.map(
          (e, i) => a("article", {
            class: "skg-card",
            key: e.name,
            // Staggered entrance: 40ms per index, capped at ~400ms. Newly
            // matched/added cards replay the rise animation on mount.
            style: { animationDelay: `${Math.min(i * 40, 400)}ms` }
          }, [
            a("div", { class: "skg-card-top" }, [
              a("code", { class: "skg-name" }, `/${e.name}`),
              a("span", { class: `skg-pill${e.source === "builtin" ? " builtin" : ""}` }, e.source === "builtin" ? r("pillBuiltin") : r("pillFile"))
            ]),
            a("p", { class: "skg-desc" }, e.description || r("noDesc")),
            e.tags && e.tags.length ? a("div", { class: "skg-tags" }, e.tags.map((p) => a("span", { class: "skg-chip", key: p }, `#${p}`))) : null,
            a("div", { class: "skg-card-foot" }, [
              a("span", { class: "skg-slash" }, r("slashHint", { name: e.name })),
              // Built-in skills are managed by the plugin itself — no delete.
              e.source !== "builtin" ? a("button", {
                class: `skg-btn skg-sm ${x.value === e.name ? "skg-danger" : "skg-tonal"}`,
                disabled: t.value,
                onClick: () => Y(e.name)
              }, x.value === e.name ? r("confirmDelete") : r("delete")) : null
            ])
          ])
        )
      )
    ]);
  }
};
export {
  ia as default
};
