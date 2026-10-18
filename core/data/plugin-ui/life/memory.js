import { defineComponent as Te, ref as c, computed as w, watch as j, onMounted as Se, openBlock as r, createElementBlock as l, createElementVNode as e, toDisplayString as s, createCommentVNode as m, normalizeStyle as A, Fragment as T, renderList as S, normalizeClass as $, createVNode as V, Transition as ze, withCtx as pe, withDirectives as P, vModelText as B, unref as ae, TransitionGroup as Le, withModifiers as Ne } from "vue";
import { useConfirm as Re, AppSelect as oe, i18n as je } from "@0kay/host";
const Ae = 3200;
function Ve(_) {
  const o = `.${_}`;
  return `
${o}{
  --r-xs:10px; --r-sm:14px; --r-md:20px; --r-lg:28px; --r-xl:36px;
  --spring:cubic-bezier(.2,.9,.25,1.15);
  height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;
  background:var(--md-surface);color:var(--md-on-surface);
  max-width:1240px;margin:0 auto;
}
${o} h1,${o} h2,${o} h3,${o} h4{margin:0;letter-spacing:-.01em}
${o} .eyebrow{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}
${o} .eyebrow b{font-size:9px}

/* Hero */
${o} .hero{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;
  background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);
  color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}
${o} .hero::after{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}
${o} .hero-main{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}
${o} .hero-copy h1{font-size:clamp(26px,3.4vw,40px);font-weight:800}
${o} .sub{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}
${o} .hero-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
${o} .fab{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);
  font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);
  transition:transform .28s var(--spring),box-shadow .28s}
@media (hover: hover) and (pointer: fine){${o} .fab:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}
${o} .fab:disabled{opacity:.6;cursor:not-allowed}
${o} .fab-ic{font-size:17px}
${o} .state-row{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
${o} .pill{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}
${o} .pill.soft{font-weight:500;color:var(--md-on-surface-variant)}
${o} .pill.bad{background:var(--md-warning-container);color:var(--md-on-warning-container)}

${o} .banner{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}
${o} .banner.err{background:var(--md-error-container);color:var(--md-on-error-container)}
${o} .banner.ok{background:var(--md-primary-container);color:var(--md-on-primary-container)}

/* Tabs */
${o} .tabs{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}
${o} .tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);
  border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;
  transition:background .25s,color .25s,transform .25s var(--spring)}
${o} .tab i{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}
${o} .tab-ic{font-size:14px}
${o} .tab:hover{background:var(--md-surface-container-high)}
${o} .tab.active{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);
  box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
${o} .tab.active i{opacity:.85}

${o} .panel{animation:fade .32s var(--spring)}
@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
/* The v-show panels are permanently mounted, so the entrance animation only
   plays on first paint. A page that switches tabs replays it by toggling this
   class (distinct keyframes, otherwise re-adding the same computed animation
   would not restart it). See CompanionPage replayPanel(). */
${o} .panel-replay{animation:fadeReplay .32s var(--spring)}
@keyframes fadeReplay{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
${o} .section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}
${o} .section-head h2{font-size:22px;font-weight:800}
${o} .desc{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}
${o} .head-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

/* Buttons */
${o} .btn{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}
${o} .btn.sm{height:34px;padding:0 14px;font-size:13px}
${o} .btn:disabled{opacity:.5;cursor:not-allowed}
@media (hover: hover) and (pointer: fine){${o} .btn:hover:not(:disabled){transform:translateY(-1px)}}
${o} .btn.filled{background:var(--md-primary);color:var(--md-on-primary,#fff)}
${o} .btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
${o} .btn.text{background:transparent;color:var(--md-primary)}
${o} .btn.danger{background:var(--md-error-container);color:var(--md-on-error-container)}
${o} .link{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}

/* Cards */
${o} .card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}
${o} .card > h3{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
${o} .card.sub{padding:16px;margin-bottom:0}
/* minmax(0, 1fr) rather than 1fr: a bare 1fr track has an auto minimum, so one
   child with a large min-content width (a long model id, a URL) blows the track
   past the container instead of shrinking. */
${o} .grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
${o} .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}
${o} .sub-label{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}
${o} .hint{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}
${o} .meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}
${o} .empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}

/* Fields */
${o} .field{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}
${o} .field:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
${o} .field.tiny{width:104px;height:38px;padding:0 12px;font-size:13px}
${o} .switches{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}
${o} .sw{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}
${o} .sw input{width:18px;height:18px;accent-color:var(--md-primary)}
${o} .settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
${o} .settings-grid label{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
${o} .settings-grid .field{height:40px}
${o} .fld{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);min-width:180px}

/* Chips / status */
${o} .count-pill{margin-left:auto;flex:0 0 auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
${o} .count-pill.ok{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}
${o} .actions-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}

/* Feed list (adapters, routes, commitments …) */
${o} .feed{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
${o} .feed > li{padding:14px 16px;border-radius:var(--r-md);background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent)}
${o} .feed > li.empty{background:none;border:0}

/* Material 3 Expressive align.
 *
 * Read this block as the source of truth for in-host sizing. These #app-prefixed
 * rules are (1,2,0) and supersede the base layer above, so the base .field
 * height/radius/background, .btn height, .field.tiny height and
 * .settings-grid .field height never render while the page is mounted in the
 * host. The base values are kept on purpose as the standalone fallback for a
 * page rendered without an #app ancestor — they are not dead, just shadowed.
 *
 * (No backticks in these comments: the whole sheet is a JS template literal.) */
#app ${o} .card{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}
#app ${o} .field{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}
#app ${o} .field:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}
#app ${o} .field.tiny{height:40px}
#app ${o} .settings-grid .field{height:44px}
#app ${o} .btn{height:44px;padding:0 20px}
#app ${o} .btn.sm{height:36px;padding:0 15px}

/* Theme-specific overrides key off html[data-theme] — the darkmode plugin's
   toggle — not prefers-color-scheme, so a manual light/dark choice in Settings
   is honored (the injected CSS is global, so html-level selectors are fine). */
@media (prefers-reduced-motion: reduce){
  ${o} .panel{animation:none}
  ${o} .panel-replay{animation:none}
  ${o} .fab,${o} .btn,${o} .tab{transition:none}
  ${o} .fab:hover:not(:disabled),${o} .btn:hover:not(:disabled),${o} .tab.active{transform:none}
}
html[data-theme="dark"] ${o} .pill.bad{background:#5a2d00;color:#ffd7b0}
@media(max-width:820px){${o} .grid2,${o} .grid3{grid-template-columns:1fr}}
@media(max-width:560px){${o}{padding:var(--space-lg) var(--space-lg) 80px}${o} .hero{padding:20px}${o} .hero-actions{width:100%}}
`;
}
function Pe(_, o) {
  if (typeof document > "u" || document.getElementById(_)) return;
  const t = document.createElement("style");
  t.id = _, t.textContent = o, document.head.appendChild(t);
}
const Be = { class: "memory-page" }, He = { class: "page-header" }, Ue = { class: "subtitle" }, Ie = { class: "header-actions" }, Oe = ["disabled"], Fe = ["disabled"], Ee = {
  key: 0,
  class: "banner err"
}, De = {
  key: 1,
  class: "banner ok"
}, Ye = { class: "stat-grid" }, qe = { class: "stat-card" }, Je = { class: "stat-head" }, We = { class: "stat-label" }, Ke = { class: "stat-value" }, Ge = { class: "stat-hint" }, Qe = { class: "stat-card" }, Xe = { class: "stat-head" }, Ze = { class: "stat-label" }, et = { class: "stat-value" }, tt = { class: "stat-hint" }, at = { class: "stat-card" }, ot = { class: "stat-head" }, st = { class: "stat-label" }, it = { class: "stat-value" }, nt = { class: "stat-hint" }, rt = { class: "stat-card" }, lt = { class: "stat-head" }, dt = { class: "stat-label" }, ct = { class: "stat-value" }, mt = { class: "stat-hint" }, pt = {
  key: 2,
  class: "card",
  style: { "margin-top": "16px" }
}, ut = { class: "card-head" }, ft = { class: "card-title" }, ht = { class: "chip muted" }, vt = { class: "dynamics-grid" }, gt = { style: { display: "flex", "align-items": "center", gap: "10px", margin: "6px 0" } }, yt = { style: { width: "48px", "font-size": "12px" } }, bt = { class: "dyn-track" }, _t = { style: { display: "flex", "align-items": "center", gap: "10px", margin: "6px 0" } }, xt = { style: { width: "48px", "font-size": "12px" } }, wt = { class: "dyn-track" }, kt = { class: "hint" }, $t = { class: "hint" }, Ct = { class: "dyn-hist" }, Mt = ["title"], Tt = { class: "hint" }, St = ["aria-label"], zt = ["points"], Lt = { class: "tabs" }, Nt = {
  key: "memories",
  class: "tab-body"
}, Rt = { class: "card toolbar" }, jt = { class: "search-field" }, At = ["placeholder", "aria-label"], Vt = { class: "fld" }, Pt = { class: "fld" }, Bt = { class: "chip muted" }, Ht = { class: "memory-list" }, Ut = { class: "card-top" }, It = {
  key: 0,
  class: "chip muted"
}, Ot = { class: "chip muted" }, Ft = ["title", "aria-label", "onClick"], Et = { class: "memory-content" }, Dt = {
  key: 0,
  class: "tags"
}, Yt = { class: "memory-foot" }, qt = ["title"], Jt = { class: "meter-bar" }, Wt = ["title"], Kt = { class: "meter-bar" }, Gt = { class: "meter-text" }, Qt = { class: "detail-clip" }, Xt = { class: "card-actions" }, Zt = ["onClick"], ea = ["onClick"], ta = ["onClick"], aa = ["onClick"], oa = {
  key: 1,
  class: "empty-state"
}, sa = { class: "hint" }, ia = {
  key: 0,
  class: "pager"
}, na = ["disabled"], ra = { class: "chip muted" }, la = ["disabled"], da = {
  key: "notes",
  class: "tab-body"
}, ca = { class: "grid-notes" }, ma = { class: "card" }, pa = { class: "card-head" }, ua = { class: "card-title" }, fa = ["placeholder", "aria-label"], ha = ["placeholder", "aria-label"], va = ["placeholder", "aria-label"], ga = ["disabled"], ya = { class: "card" }, ba = { class: "card-head" }, _a = { class: "card-title" }, xa = { class: "chip muted" }, wa = { class: "search-field mini" }, ka = ["placeholder", "aria-label"], $a = { class: "note-list" }, Ca = { class: "note-main" }, Ma = { class: "item-meta" }, Ta = {
  key: 0,
  class: "chip muted"
}, Sa = { class: "note-actions" }, za = ["onClick"], La = ["aria-label", "onClick"], Na = {
  key: 0,
  class: "list-empty"
}, Ra = {
  key: 0,
  class: "card reader"
}, ja = { class: "card-head" }, Aa = { class: "card-title" }, Va = { class: "pager" }, Pa = ["disabled"], Ba = { class: "chip muted" }, Ha = ["disabled"], Ua = {
  key: "reflections",
  class: "tab-body"
}, Ia = { class: "card toolbar" }, Oa = { class: "fld" }, Fa = { class: "chip muted" }, Ea = { class: "reflection-list" }, Da = { class: "card-head" }, Ya = { class: "card-title" }, qa = {
  key: 0,
  class: "chip muted"
}, Ja = { class: "item-meta" }, Wa = { class: "quote" }, Ka = { class: "quote" }, Ga = {
  key: 0,
  class: "card-actions"
}, Qa = ["onClick"], Xa = ["onClick"], Za = {
  key: 0,
  class: "empty-state"
}, eo = { class: "hint" }, to = { class: "danger-zone" }, ao = { class: "danger-copy" }, oo = { class: "hint" }, so = ["disabled"], H = 30, io = 4, no = /* @__PURE__ */ Te({
  __name: "MemoryPage",
  setup(_) {
    const { confirm: o } = Re(), t = (n, i) => je.global.t(n, i ?? {}), g = c("memories"), C = c(""), U = c(""), I = c("recent"), x = c(0), O = c([]), W = c(0), z = c({ working: 0, shortTerm: { total: 0 }, longTerm: 0, avgStrength: 0 }), u = c(null), se = w(() => Math.max(1, u.value?.tiers?.short_term || 0, u.value?.tiers?.long_term || 0)), ue = w(() => Math.max(1, ...u.value?.strength_histogram || [1])), ie = w(() => (u.value?.decay_curve || []).map((i) => `${(i.day / 90 * 200).toFixed(1)},${(60 - i.strength * 60).toFixed(1)}`).join(" "));
    function K(n, i) {
      return `${Math.round((n || 0) / Math.max(1, i) * 100)}%`;
    }
    const y = c(!1), p = c(""), L = c(""), N = c(""), F = c([]), E = c(""), h = c({ title: "", content: "", tags: "" }), v = c(null), D = c([]), Y = c("proposed"), q = w(() => Math.max(1, Math.ceil(W.value / H))), G = w(() => Math.floor(x.value / H) + 1);
    function M(n) {
      return `${Math.round(Math.max(0, Math.min(1, n || 0)) * 100)}%`;
    }
    function fe(n) {
      return t(n === "long_term" ? "life.memory.tierLong" : n === "short_term" ? "life.memory.tierShort" : "life.memory.tierWorking");
    }
    function Q(n) {
      if (!n) return "";
      const i = new Date(n);
      return Number.isNaN(i.getTime()) ? n : i.toLocaleString();
    }
    function R(n) {
      L.value = n, setTimeout(() => {
        L.value === n && (L.value = "");
      }, Ae);
    }
    async function f(n, i) {
      const a = await fetch("/api/life/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: n, payload: i })
      });
      if (!a.ok) throw new Error(await a.text() || `HTTP ${a.status}`);
      return a.json().catch(() => ({}));
    }
    async function k() {
      try {
        const n = await fetch("/api/life/memories?limit=1");
        if (n.ok) {
          const i = await n.json();
          i.stats && (z.value = i.stats);
        }
      } catch {
      }
    }
    async function ne() {
      try {
        u.value = await f("memory_dashboard", {});
      } catch {
      }
    }
    async function b() {
      y.value = !0, p.value = "";
      try {
        const n = await f("memory_page", { tier: U.value, query: C.value.trim(), limit: H, offset: x.value, sort: I.value });
        O.value = n.items || [], W.value = n.total || 0;
      } catch (n) {
        p.value = n?.message || t("life.memory.errorReadMemories");
      } finally {
        y.value = !1;
      }
    }
    async function J() {
      y.value = !0, p.value = "";
      try {
        const n = await f("memory_note_list", { query: E.value.trim(), limit: 60 });
        F.value = n.notes || [];
      } catch (n) {
        p.value = n?.message || t("life.memory.errorReadNotes");
      } finally {
        y.value = !1;
      }
    }
    async function X() {
      y.value = !0, p.value = "";
      try {
        const n = await f("memory_reflection_list", { status: Y.value, limit: 80 });
        D.value = n.reflections || [];
      } catch (n) {
        p.value = n?.message || t("life.memory.errorReadReflections");
      } finally {
        y.value = !1;
      }
    }
    function re() {
      return k(), ne(), g.value === "notes" ? J() : g.value === "reflections" ? X() : b();
    }
    async function he(n) {
      try {
        await f("memory_reinforce", { ids: [n.id] }), R(t("life.memory.toastReinforced")), await b();
      } catch (i) {
        p.value = i?.message || t("life.memory.errorReinforce");
      }
    }
    async function le(n, i) {
      try {
        await f("memory_importance", { id: n.id, delta: i }), await b();
      } catch (a) {
        p.value = a?.message || t("life.memory.errorAdjust");
      }
    }
    async function ve() {
      try {
        const n = await f("memory_export", {}), i = new Blob([JSON.stringify(n, null, 2)], { type: "application/json" }), a = URL.createObjectURL(i), d = document.createElement("a");
        d.href = a, d.download = `0kay-memory-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, d.click(), URL.revokeObjectURL(a), R(t("life.memory.toastExported"));
      } catch (n) {
        p.value = n?.message || t("life.memory.errorExport");
      }
    }
    const de = c(null);
    async function ge(n) {
      const i = n.target, a = i.files?.[0];
      if (a)
        try {
          const d = JSON.parse(await a.text()), me = await f("memory_import", { snapshot: d });
          R(t("life.memory.toastImported", { added: me.imported || 0, skipped: me.skipped || 0 })), await b(), await k();
        } catch (d) {
          p.value = d?.message || t("life.memory.errorImport");
        } finally {
          i.value = "";
        }
    }
    async function ye(n) {
      if (await o({
        title: t("life.memory.deleteMemoryTitle"),
        message: t("life.memory.deleteMemoryMessage"),
        confirmLabel: t("life.memory.deleteMemoryConfirm"),
        danger: !0
      }))
        try {
          await f("delete_memory", { id: n.id }), await b(), await k();
        } catch (a) {
          p.value = a?.message || t("life.memory.errorDelete");
        }
    }
    async function be() {
      if (!(!await o({
        title: t("life.memory.clearAll"),
        message: t("life.memory.clearAllMessage"),
        confirmLabel: t("life.memory.clearAll"),
        danger: !0
      }) || !await o({
        title: t("life.memory.clearAllConfirmTitle"),
        message: t("life.memory.clearAllConfirmMessage"),
        confirmLabel: t("life.memory.clearAllConfirm"),
        danger: !0
      })))
        try {
          await f("clear_all_memory", {}), await b(), await k();
        } catch (a) {
          p.value = a?.message || t("life.memory.errorClear");
        }
    }
    async function _e() {
      if (!(!h.value.content.trim() && !h.value.title.trim()))
        try {
          await f("memory_note_create", {
            title: h.value.title,
            content: h.value.content,
            tags: h.value.tags.split(",").map((n) => n.trim()).filter(Boolean)
          }), h.value = { title: "", content: "", tags: "" }, R(t("life.memory.toastNoteSaved")), await J();
        } catch (n) {
          p.value = n?.message || t("life.memory.errorSaveNote");
        }
    }
    async function Z(n, i = 1) {
      try {
        const a = await f("memory_note_read", { note_id: n.note_id, offset: i, limit: 400 });
        v.value = { ...a, offset: a.offset || i };
      } catch (a) {
        p.value = a?.message || t("life.memory.errorReadNote");
      }
    }
    async function xe(n) {
      if (await o({ title: t("life.memory.deleteNoteTitle"), message: t("life.memory.deleteNoteMessage", { id: n.note_id }), confirmLabel: t("life.memory.delete"), danger: !0 }))
        try {
          await f("memory_note_delete", { note_id: n.note_id }), v.value?.note_id === n.note_id && (v.value = null), await J();
        } catch (a) {
          p.value = a?.message || t("life.memory.errorDeleteNote");
        }
    }
    async function ce(n, i) {
      try {
        await f("memory_reflection_review", { id: n.id, accept: i }), await X(), await k();
      } catch (a) {
        p.value = a?.message || t("life.memory.errorReview");
      }
    }
    async function we() {
      try {
        const n = await f("memory_maintenance", {});
        R(t("life.memory.toastMaintained", { count: n.consolidated ?? 0 })), await b(), await k();
      } catch (n) {
        p.value = n?.message || t("life.memory.errorMaintain");
      }
    }
    let ee = null, te = null;
    j(C, () => {
      x.value = 0, ee && clearTimeout(ee), ee = setTimeout(b, 250);
    }), j([U, I], () => {
      x.value = 0, b();
    }), j(E, () => {
      te && clearTimeout(te), te = setTimeout(J, 250);
    }), j(Y, X), j(g, re), Se(async () => {
      await b(), await k(), await ne();
    }), Pe("life-plugin-memory-style", Ve("memory-page"));
    const ke = w(() => [
      { value: "", label: t("life.memory.all") },
      { value: "short_term", label: t("life.memory.shortTerm") },
      { value: "long_term", label: t("life.memory.longTerm") }
    ]), $e = w(() => [
      { value: "recent", label: t("life.memory.sortRecent") },
      { value: "strength", label: t("life.memory.sortStrength") },
      { value: "importance", label: t("life.memory.sortImportance") },
      { value: "recall", label: t("life.memory.sortRecall") }
    ]), Ce = w(() => [
      { value: "proposed", label: t("life.memory.statusProposed") },
      { value: "pending", label: t("life.memory.statusPending") },
      { value: "applied", label: t("life.memory.statusApplied") },
      { value: "rejected", label: t("life.memory.statusRejected") },
      { value: "", label: t("life.memory.all") }
    ]);
    function Me(n) {
      return (n.preview || "").split(`
`).map((a) => a.trim()).find(Boolean) || t("life.memory.emptyNotePreview");
    }
    return (n, i) => (r(), l("main", Be, [
      e("header", He, [
        e("div", null, [
          i[17] || (i[17] = e(
            "p",
            { class: "eyebrow" },
            "L.I.F.E / MEMORY",
            -1
            /* CACHED */
          )),
          e(
            "h1",
            null,
            s(t("life.memory.title")),
            1
            /* TEXT */
          ),
          e(
            "p",
            Ue,
            s(t("life.memory.subtitle")),
            1
            /* TEXT */
          )
        ]),
        e("div", Ie, [
          e("button", {
            class: "btn tonic",
            disabled: y.value,
            onClick: we
          }, s(t("life.memory.maintain")), 9, Oe),
          e("button", {
            class: "btn tonic",
            disabled: y.value,
            onClick: re
          }, s(y.value ? t("life.memory.loading") : t("life.memory.refresh")), 9, Fe)
        ])
      ]),
      m(` Banners live at the top of the page: at the bottom they scrolled out of
         view exactly when an action (delete/clear) reported its result. `),
      p.value ? (r(), l(
        "p",
        Ee,
        s(p.value),
        1
        /* TEXT */
      )) : m("v-if", !0),
      L.value ? (r(), l(
        "p",
        De,
        s(L.value),
        1
        /* TEXT */
      )) : m("v-if", !0),
      e("section", Ye, [
        e("article", qe, [
          e("div", Je, [
            i[18] || (i[18] = e(
              "span",
              {
                class: "icon-badge tone-1",
                "aria-hidden": "true"
              },
              [
                e("svg", {
                  width: "19",
                  height: "19",
                  viewBox: "0 0 24 24",
                  fill: "none"
                }, [
                  e("path", {
                    d: "M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  })
                ])
              ],
              -1
              /* CACHED */
            )),
            e(
              "span",
              We,
              s(t("life.memory.tierWorking")),
              1
              /* TEXT */
            )
          ]),
          e(
            "strong",
            Ke,
            s(z.value.working),
            1
            /* TEXT */
          ),
          e(
            "span",
            Ge,
            s(t("life.memory.workingHint")),
            1
            /* TEXT */
          )
        ]),
        e("article", Qe, [
          e("div", Xe, [
            i[19] || (i[19] = e(
              "span",
              {
                class: "icon-badge tone-2",
                "aria-hidden": "true"
              },
              [
                e("svg", {
                  width: "19",
                  height: "19",
                  viewBox: "0 0 24 24",
                  fill: "none"
                }, [
                  e("circle", {
                    cx: "12",
                    cy: "12",
                    r: "8",
                    stroke: "currentColor",
                    "stroke-width": "1.7"
                  }),
                  e("path", {
                    d: "M12 8v4l3 2",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linecap": "round"
                  })
                ])
              ],
              -1
              /* CACHED */
            )),
            e(
              "span",
              Ze,
              s(t("life.memory.tierShort")),
              1
              /* TEXT */
            )
          ]),
          e(
            "strong",
            et,
            s(z.value.shortTerm?.total || 0),
            1
            /* TEXT */
          ),
          e(
            "span",
            tt,
            s(t("life.memory.shortHint")),
            1
            /* TEXT */
          )
        ]),
        e("article", at, [
          e("div", ot, [
            i[20] || (i[20] = e(
              "span",
              {
                class: "icon-badge tone-3",
                "aria-hidden": "true"
              },
              [
                e("svg", {
                  width: "19",
                  height: "19",
                  viewBox: "0 0 24 24",
                  fill: "none"
                }, [
                  e("path", {
                    d: "M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 21.5v-16z",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linejoin": "round"
                  })
                ])
              ],
              -1
              /* CACHED */
            )),
            e(
              "span",
              st,
              s(t("life.memory.tierLong")),
              1
              /* TEXT */
            )
          ]),
          e(
            "strong",
            it,
            s(z.value.longTerm || 0),
            1
            /* TEXT */
          ),
          e(
            "span",
            nt,
            s(t("life.memory.longHint")),
            1
            /* TEXT */
          )
        ]),
        e("article", rt, [
          e("div", lt, [
            i[21] || (i[21] = e(
              "span",
              {
                class: "icon-badge tone-4",
                "aria-hidden": "true"
              },
              [
                e("svg", {
                  width: "19",
                  height: "19",
                  viewBox: "0 0 24 24",
                  fill: "none"
                }, [
                  e("path", {
                    d: "M4 14l4-4 3 3 5-6 4 4",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  }),
                  e("path", {
                    d: "M4 19h16",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linecap": "round"
                  })
                ])
              ],
              -1
              /* CACHED */
            )),
            e(
              "span",
              dt,
              s(t("life.memory.avgStrength")),
              1
              /* TEXT */
            )
          ]),
          e(
            "strong",
            ct,
            s(M(z.value.avgStrength)),
            1
            /* TEXT */
          ),
          e(
            "span",
            mt,
            s(t("life.memory.avgStrengthHint")),
            1
            /* TEXT */
          )
        ])
      ]),
      u.value ? (r(), l("section", pt, [
        e("div", ut, [
          e(
            "h2",
            ft,
            s(t("life.memory.dynamicsTitle")),
            1
            /* TEXT */
          ),
          e(
            "span",
            ht,
            "RRF k=" + s(u.value.rrf_k),
            1
            /* TEXT */
          )
        ]),
        e("div", vt, [
          e("div", null, [
            e("div", gt, [
              e(
                "span",
                yt,
                s(t("life.memory.shortTerm")),
                1
                /* TEXT */
              ),
              e("div", bt, [
                e(
                  "i",
                  {
                    class: "dyn-bar",
                    style: A({ width: K(u.value.tiers.short_term, se.value) })
                  },
                  null,
                  4
                  /* STYLE */
                )
              ]),
              e(
                "b",
                null,
                s(u.value.tiers.short_term),
                1
                /* TEXT */
              )
            ]),
            e("div", _t, [
              e(
                "span",
                xt,
                s(t("life.memory.longTerm")),
                1
                /* TEXT */
              ),
              e("div", wt, [
                e(
                  "i",
                  {
                    class: "dyn-bar",
                    style: A({ width: K(u.value.tiers.long_term, se.value) })
                  },
                  null,
                  4
                  /* STYLE */
                )
              ]),
              e(
                "b",
                null,
                s(u.value.tiers.long_term),
                1
                /* TEXT */
              )
            ]),
            e(
              "p",
              kt,
              s(t("life.memory.dynamicsSummary", { avg: M(u.value.avg_strength), low: u.value.low_strength, semantic: u.value.types?.semantic || 0, episode: u.value.types?.episode || 0 })),
              1
              /* TEXT */
            )
          ]),
          e("div", null, [
            e(
              "p",
              $t,
              s(t("life.memory.strengthHistogram")),
              1
              /* TEXT */
            ),
            e("div", Ct, [
              (r(!0), l(
                T,
                null,
                S(u.value.strength_histogram, (a, d) => (r(), l("i", {
                  key: d,
                  title: `${d / 10}~${(d + 1) / 10}: ${a}`,
                  style: A({ height: K(a, ue.value) })
                }, null, 12, Mt))),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          e("div", null, [
            e(
              "p",
              Tt,
              s(t("life.memory.decayCurveHint")),
              1
              /* TEXT */
            ),
            (r(), l("svg", {
              viewBox: "0 0 200 60",
              class: "dyn-curve",
              "aria-label": t("life.memory.decayCurveLabel")
            }, [
              m(` pathLength=1 normalizes the stroke so dashoffset 1→0 is a draw-in
                 animation regardless of the polyline's point count; re-keying on
                 the points replays it when the dashboard refreshes. `),
              (r(), l("polyline", {
                key: ie.value,
                class: "decay-line",
                points: ie.value,
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                pathLength: "1"
              }, null, 8, zt))
            ], 8, St))
          ])
        ])
      ])) : m("v-if", !0),
      e("nav", Lt, [
        e(
          "button",
          {
            class: $(["tab", { active: g.value === "memories" }]),
            onClick: i[0] || (i[0] = (a) => g.value = "memories")
          },
          s(t("life.memory.tabMemories")),
          3
          /* TEXT, CLASS */
        ),
        e(
          "button",
          {
            class: $(["tab", { active: g.value === "notes" }]),
            onClick: i[1] || (i[1] = (a) => g.value = "notes")
          },
          s(t("life.memory.tabNotes")),
          3
          /* TEXT, CLASS */
        ),
        e(
          "button",
          {
            class: $(["tab", { active: g.value === "reflections" }]),
            onClick: i[2] || (i[2] = (a) => g.value = "reflections")
          },
          s(t("life.memory.tabReflections")),
          3
          /* TEXT, CLASS */
        )
      ]),
      m(` One keyed element per tab so the Transition can cross-fade them
         (mode="out-in" keeps both lists from fighting over the grid layout). `),
      V(ze, {
        name: "tab-fade",
        mode: "out-in"
      }, {
        default: pe(() => [
          g.value === "memories" ? (r(), l("div", Nt, [
            e("section", Rt, [
              e("div", jt, [
                i[22] || (i[22] = e(
                  "svg",
                  {
                    class: "search-icon",
                    width: "17",
                    height: "17",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    "aria-hidden": "true"
                  },
                  [
                    e("circle", {
                      cx: "11",
                      cy: "11",
                      r: "6.5",
                      stroke: "currentColor",
                      "stroke-width": "1.8"
                    }),
                    e("path", {
                      d: "M16 16l4.5 4.5",
                      stroke: "currentColor",
                      "stroke-width": "1.8",
                      "stroke-linecap": "round"
                    })
                  ],
                  -1
                  /* CACHED */
                )),
                P(e("input", {
                  "onUpdate:modelValue": i[3] || (i[3] = (a) => C.value = a),
                  placeholder: t("life.memory.searchMemories"),
                  "aria-label": t("life.memory.searchMemoriesLabel")
                }, null, 8, At), [
                  [B, C.value]
                ])
              ]),
              e("label", Vt, [
                e(
                  "span",
                  null,
                  s(t("life.memory.tierLabel")),
                  1
                  /* TEXT */
                ),
                V(ae(oe), {
                  modelValue: U.value,
                  "onUpdate:modelValue": i[4] || (i[4] = (a) => U.value = a),
                  options: ke.value,
                  "aria-label": t("life.memory.tierLabel")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              e("label", Pt, [
                e(
                  "span",
                  null,
                  s(t("life.memory.sortLabel")),
                  1
                  /* TEXT */
                ),
                V(ae(oe), {
                  modelValue: I.value,
                  "onUpdate:modelValue": i[5] || (i[5] = (a) => I.value = a),
                  options: $e.value,
                  "aria-label": t("life.memory.sortLabel")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              e(
                "span",
                Bt,
                s(t("life.memory.totalPages", { total: W.value, page: G.value, pages: q.value })),
                1
                /* TEXT */
              ),
              e(
                "button",
                {
                  class: "btn tonic sm",
                  onClick: ve
                },
                s(t("life.memory.export")),
                1
                /* TEXT */
              ),
              e(
                "button",
                {
                  class: "btn tonic sm",
                  onClick: i[6] || (i[6] = (a) => de.value?.click())
                },
                s(t("life.memory.import")),
                1
                /* TEXT */
              ),
              e(
                "input",
                {
                  ref_key: "importInput",
                  ref: de,
                  type: "file",
                  accept: "application/json,.json",
                  class: "hidden-input",
                  onChange: ge
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              )
            ]),
            e("section", Ht, [
              V(Le, { name: "memory-card" }, {
                default: pe(() => [
                  (r(!0), l(
                    T,
                    null,
                    S(O.value, (a) => (r(), l(
                      "article",
                      {
                        key: a.id,
                        class: $(["memory-card", { open: N.value === a.id }])
                      },
                      [
                        e("div", Ut, [
                          e(
                            "span",
                            {
                              class: $(["chip", "tier-" + (a.tier === "long_term" ? "long" : "short")])
                            },
                            s(fe(a.tier)),
                            3
                            /* TEXT, CLASS */
                          ),
                          a.scope && a.scope !== "public" ? (r(), l(
                            "span",
                            It,
                            s(a.scope),
                            1
                            /* TEXT */
                          )) : m("v-if", !0),
                          e(
                            "span",
                            Ot,
                            s(a.memory_type || "knowledge"),
                            1
                            /* TEXT */
                          ),
                          e("button", {
                            class: "btn-icon danger",
                            title: t("life.memory.deleteMemory"),
                            "aria-label": t("life.memory.deleteMemory"),
                            onClick: (d) => ye(a)
                          }, [...i[23] || (i[23] = [
                            e(
                              "svg",
                              {
                                width: "15",
                                height: "15",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                "aria-hidden": "true"
                              },
                              [
                                e("path", {
                                  d: "M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13",
                                  stroke: "currentColor",
                                  "stroke-width": "1.8",
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round"
                                })
                              ],
                              -1
                              /* CACHED */
                            )
                          ])], 8, Ft)
                        ]),
                        e(
                          "p",
                          Et,
                          s(a.content),
                          1
                          /* TEXT */
                        ),
                        a.tags?.length ? (r(), l("div", Dt, [
                          (r(!0), l(
                            T,
                            null,
                            S(a.tags, (d) => (r(), l(
                              "span",
                              { key: d },
                              "#" + s(d),
                              1
                              /* TEXT */
                            ))),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ])) : m("v-if", !0),
                        e("footer", Yt, [
                          e("div", {
                            class: "meter",
                            title: t("life.memory.importance")
                          }, [
                            e(
                              "span",
                              null,
                              s(t("life.memory.importance")),
                              1
                              /* TEXT */
                            ),
                            e("div", Jt, [
                              e(
                                "i",
                                {
                                  style: A({ "--v": M(a.importance) }),
                                  class: "fill-primary"
                                },
                                null,
                                4
                                /* STYLE */
                              )
                            ]),
                            e(
                              "b",
                              null,
                              s(M(a.importance)),
                              1
                              /* TEXT */
                            )
                          ], 8, qt),
                          e("div", {
                            class: "meter",
                            title: t("life.memory.strength")
                          }, [
                            e(
                              "span",
                              null,
                              s(t("life.memory.strength")),
                              1
                              /* TEXT */
                            ),
                            e("div", Kt, [
                              e(
                                "i",
                                {
                                  style: A({ "--v": M(a.strength) }),
                                  class: "fill-secondary"
                                },
                                null,
                                4
                                /* STYLE */
                              )
                            ]),
                            e(
                              "b",
                              null,
                              s(M(a.strength)),
                              1
                              /* TEXT */
                            )
                          ], 8, Wt),
                          e(
                            "span",
                            Gt,
                            s(t("life.memory.recallTimes", { count: a.recall_count || 0 })),
                            1
                            /* TEXT */
                          )
                        ]),
                        m(` Always mounted; grid-template-rows 0fr→1fr animates expand/collapse
               instead of the v-if hard cut. `),
                        e(
                          "div",
                          {
                            class: $(["detail", { open: N.value === a.id }])
                          },
                          [
                            e("div", Qt, [
                              e("dl", null, [
                                e("div", null, [
                                  i[24] || (i[24] = e(
                                    "dt",
                                    null,
                                    "ID",
                                    -1
                                    /* CACHED */
                                  )),
                                  e("dd", null, [
                                    e(
                                      "code",
                                      null,
                                      s(a.id),
                                      1
                                      /* TEXT */
                                    )
                                  ])
                                ]),
                                e("div", null, [
                                  e(
                                    "dt",
                                    null,
                                    s(t("life.memory.source")),
                                    1
                                    /* TEXT */
                                  ),
                                  e(
                                    "dd",
                                    null,
                                    s(a.source_kind || "conversation"),
                                    1
                                    /* TEXT */
                                  )
                                ]),
                                e("div", null, [
                                  e(
                                    "dt",
                                    null,
                                    s(t("life.memory.created")),
                                    1
                                    /* TEXT */
                                  ),
                                  e(
                                    "dd",
                                    null,
                                    s(Q(a.created_at)),
                                    1
                                    /* TEXT */
                                  )
                                ]),
                                e("div", null, [
                                  e(
                                    "dt",
                                    null,
                                    s(t("life.memory.lastRecalled")),
                                    1
                                    /* TEXT */
                                  ),
                                  e(
                                    "dd",
                                    null,
                                    s(Q(a.last_recalled)),
                                    1
                                    /* TEXT */
                                  )
                                ])
                              ])
                            ])
                          ],
                          2
                          /* CLASS */
                        ),
                        e("div", Xt, [
                          e("button", {
                            class: "btn sm tonic",
                            onClick: (d) => N.value = N.value === a.id ? "" : a.id
                          }, s(N.value === a.id ? t("life.memory.collapse") : t("life.memory.details")), 9, Zt),
                          e("button", {
                            class: "btn sm tonic",
                            onClick: (d) => le(a, 0.1)
                          }, s(t("life.memory.importanceUp")), 9, ea),
                          e("button", {
                            class: "btn sm tonic",
                            onClick: (d) => le(a, -0.1)
                          }, s(t("life.memory.importanceDown")), 9, ta),
                          e("button", {
                            class: "btn sm tonic",
                            onClick: (d) => he(a)
                          }, s(t("life.memory.reinforce")), 9, aa)
                        ])
                      ],
                      2
                      /* CLASS */
                    ))),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                _: 1
                /* STABLE */
              }),
              m(" Shimmer skeleton while the first page loads, instead of an empty flash. "),
              y.value && !O.value.length ? (r(), l(
                T,
                { key: 0 },
                S(io, (a) => e("article", {
                  key: "sk" + a,
                  class: "memory-card skeleton-card",
                  "aria-hidden": "true"
                }, [...i[25] || (i[25] = [
                  e(
                    "span",
                    { class: "sk-line w30" },
                    null,
                    -1
                    /* CACHED */
                  ),
                  e(
                    "span",
                    { class: "sk-line w90" },
                    null,
                    -1
                    /* CACHED */
                  ),
                  e(
                    "span",
                    { class: "sk-line w75" },
                    null,
                    -1
                    /* CACHED */
                  ),
                  e(
                    "span",
                    { class: "sk-line w40" },
                    null,
                    -1
                    /* CACHED */
                  )
                ])])),
                64
                /* STABLE_FRAGMENT */
              )) : m("v-if", !0),
              !y.value && !O.value.length ? (r(), l("div", oa, [
                e(
                  "p",
                  null,
                  s(t("life.memory.emptyMemories")),
                  1
                  /* TEXT */
                ),
                e(
                  "p",
                  sa,
                  s(t("life.memory.emptyMemoriesHint")),
                  1
                  /* TEXT */
                )
              ])) : m("v-if", !0)
            ]),
            q.value > 1 ? (r(), l("div", ia, [
              e("button", {
                class: "btn sm tonic",
                disabled: x.value === 0,
                onClick: i[7] || (i[7] = (a) => {
                  x.value = Math.max(0, x.value - H), b();
                })
              }, s(t("life.memory.prevPage")), 9, na),
              e(
                "span",
                ra,
                s(G.value) + " / " + s(q.value),
                1
                /* TEXT */
              ),
              e("button", {
                class: "btn sm tonic",
                disabled: G.value >= q.value,
                onClick: i[8] || (i[8] = (a) => {
                  x.value += H, b();
                })
              }, s(t("life.memory.nextPage")), 9, la)
            ])) : m("v-if", !0)
          ])) : g.value === "notes" ? (r(), l("div", da, [
            e("section", ca, [
              e("article", ma, [
                e("div", pa, [
                  e(
                    "h2",
                    ua,
                    s(t("life.memory.newNote")),
                    1
                    /* TEXT */
                  )
                ]),
                e(
                  "form",
                  {
                    class: "stack-form",
                    onSubmit: Ne(_e, ["prevent"])
                  },
                  [
                    P(e("input", {
                      "onUpdate:modelValue": i[9] || (i[9] = (a) => h.value.title = a),
                      class: "field",
                      placeholder: t("life.memory.noteTitle"),
                      "aria-label": t("life.memory.noteTitleLabel")
                    }, null, 8, fa), [
                      [B, h.value.title]
                    ]),
                    P(e("input", {
                      "onUpdate:modelValue": i[10] || (i[10] = (a) => h.value.tags = a),
                      class: "field",
                      placeholder: t("life.memory.noteTags"),
                      "aria-label": t("life.memory.noteTagsLabel")
                    }, null, 8, ha), [
                      [B, h.value.tags]
                    ]),
                    P(e("textarea", {
                      "onUpdate:modelValue": i[11] || (i[11] = (a) => h.value.content = a),
                      class: "field area",
                      placeholder: t("life.memory.noteContent"),
                      "aria-label": t("life.memory.noteContentLabel")
                    }, null, 8, va), [
                      [B, h.value.content]
                    ]),
                    e("button", {
                      class: "btn filled",
                      type: "submit",
                      disabled: !h.value.content.trim() && !h.value.title.trim()
                    }, s(t("life.memory.saveNote")), 9, ga)
                  ],
                  32
                  /* NEED_HYDRATION */
                )
              ]),
              e("article", ya, [
                e("div", ba, [
                  e(
                    "h2",
                    _a,
                    s(t("life.memory.noteLibrary")),
                    1
                    /* TEXT */
                  ),
                  e(
                    "span",
                    xa,
                    s(F.value.length),
                    1
                    /* TEXT */
                  )
                ]),
                e("div", wa, [
                  P(e("input", {
                    "onUpdate:modelValue": i[12] || (i[12] = (a) => E.value = a),
                    placeholder: t("life.memory.searchNotes"),
                    "aria-label": t("life.memory.searchNotesLabel")
                  }, null, 8, ka), [
                    [B, E.value]
                  ])
                ]),
                e("ul", $a, [
                  (r(!0), l(
                    T,
                    null,
                    S(F.value, (a) => (r(), l("li", {
                      key: a.note_id,
                      class: "note-item"
                    }, [
                      e("div", Ca, [
                        e(
                          "strong",
                          null,
                          s(Me(a)),
                          1
                          /* TEXT */
                        ),
                        e(
                          "span",
                          Ma,
                          s(a.note_id) + " · " + s((a.bytes / 1024).toFixed(1)) + " KB",
                          1
                          /* TEXT */
                        ),
                        a.scope && a.scope !== "public" ? (r(), l(
                          "span",
                          Ta,
                          s(t("life.memory.scopePrefix")) + s(a.scope),
                          1
                          /* TEXT */
                        )) : m("v-if", !0)
                      ]),
                      e("div", Sa, [
                        e("button", {
                          class: "btn sm tonic",
                          onClick: (d) => Z(a)
                        }, s(t("life.memory.read")), 9, za),
                        e("button", {
                          class: "btn sm danger",
                          "aria-label": t("life.memory.deleteNoteTitle") + " " + a.note_id,
                          onClick: (d) => xe(a)
                        }, s(t("life.memory.delete")), 9, La)
                      ])
                    ]))),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  F.value.length ? m("v-if", !0) : (r(), l(
                    "li",
                    Na,
                    s(t("life.memory.emptyNotes")),
                    1
                    /* TEXT */
                  ))
                ])
              ])
            ]),
            v.value ? (r(), l("section", Ra, [
              e("div", ja, [
                e(
                  "h2",
                  Aa,
                  s(v.value.note_id),
                  1
                  /* TEXT */
                ),
                e(
                  "button",
                  {
                    class: "btn sm tonic",
                    onClick: i[13] || (i[13] = (a) => v.value = null)
                  },
                  s(t("life.memory.close")),
                  1
                  /* TEXT */
                )
              ]),
              e(
                "pre",
                null,
                s(v.value.content),
                1
                /* TEXT */
              ),
              e("div", Va, [
                e("button", {
                  class: "btn sm tonic",
                  disabled: v.value.offset <= 1,
                  onClick: i[14] || (i[14] = (a) => Z({ note_id: v.value.note_id }, Math.max(1, v.value.offset - 400)))
                }, s(t("life.memory.prevChunk")), 9, Pa),
                e(
                  "span",
                  Ba,
                  s(t("life.memory.lines", { count: v.value.total_lines })),
                  1
                  /* TEXT */
                ),
                e("button", {
                  class: "btn sm tonic",
                  disabled: !v.value.has_more,
                  onClick: i[15] || (i[15] = (a) => Z({ note_id: v.value.note_id }, v.value.offset + 400))
                }, s(t("life.memory.nextChunk")), 9, Ha)
              ])
            ])) : m("v-if", !0)
          ])) : (r(), l("div", Ua, [
            e("section", Ia, [
              e("label", Oa, [
                e(
                  "span",
                  null,
                  s(t("life.memory.statusLabel")),
                  1
                  /* TEXT */
                ),
                V(ae(oe), {
                  modelValue: Y.value,
                  "onUpdate:modelValue": i[16] || (i[16] = (a) => Y.value = a),
                  options: Ce.value,
                  "aria-label": t("life.memory.statusLabel")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              e(
                "span",
                Fa,
                s(t("life.memory.reflectionCount", { count: D.value.length })),
                1
                /* TEXT */
              )
            ]),
            e("section", Ea, [
              (r(!0), l(
                T,
                null,
                S(D.value, (a) => (r(), l("article", {
                  key: a.id,
                  class: "card reflection"
                }, [
                  e("div", Da, [
                    e(
                      "h3",
                      Ya,
                      s(a.statement || t("life.memory.noSummary")),
                      1
                      /* TEXT */
                    ),
                    e(
                      "span",
                      {
                        class: $(["chip", a.status === "applied" ? "chip-ok" : a.status === "rejected" ? "chip-warn" : "muted"])
                      },
                      s(a.status),
                      3
                      /* TEXT, CLASS */
                    ),
                    a.scope && a.scope !== "public" ? (r(), l(
                      "span",
                      qa,
                      s(t("life.memory.scopePrefix")) + s(a.scope),
                      1
                      /* TEXT */
                    )) : m("v-if", !0)
                  ]),
                  e(
                    "p",
                    Ja,
                    s(t("life.memory.sourceSession", { session: a.session_id })) + " · " + s(Q(a.created_at)),
                    1
                    /* TEXT */
                  ),
                  e("details", null, [
                    e(
                      "summary",
                      null,
                      s(t("life.memory.viewConversation")),
                      1
                      /* TEXT */
                    ),
                    e(
                      "p",
                      Wa,
                      s(t("life.memory.userPrefix")) + s(a.user_text),
                      1
                      /* TEXT */
                    ),
                    e(
                      "p",
                      Ka,
                      s(t("life.memory.assistantPrefix")) + s(a.assistant_text),
                      1
                      /* TEXT */
                    )
                  ]),
                  a.status === "proposed" ? (r(), l("div", Ga, [
                    e("button", {
                      class: "btn sm filled",
                      onClick: (d) => ce(a, !0)
                    }, s(t("life.memory.acceptAsMemory")), 9, Qa),
                    e("button", {
                      class: "btn sm danger",
                      onClick: (d) => ce(a, !1)
                    }, s(t("life.memory.reject")), 9, Xa)
                  ])) : m("v-if", !0)
                ]))),
                128
                /* KEYED_FRAGMENT */
              )),
              D.value.length ? m("v-if", !0) : (r(), l("div", Za, [
                e(
                  "p",
                  null,
                  s(t("life.memory.emptyReflections")),
                  1
                  /* TEXT */
                ),
                e(
                  "p",
                  eo,
                  s(t("life.memory.emptyReflectionsHint")),
                  1
                  /* TEXT */
                )
              ]))
            ])
          ]))
        ]),
        _: 1
        /* STABLE */
      }),
      m(` Irreversible actions live in their own danger zone at the very bottom,
         away from the everyday header actions, with a second confirm step. `),
      e("section", to, [
        e("div", ao, [
          e(
            "h2",
            null,
            s(t("life.memory.dangerTitle")),
            1
            /* TEXT */
          ),
          e(
            "p",
            oo,
            s(t("life.memory.clearAllHint")),
            1
            /* TEXT */
          )
        ]),
        e("button", {
          class: "btn danger",
          disabled: y.value,
          onClick: be
        }, s(t("life.memory.clearAll")), 9, so)
      ])
    ]));
  }
}), ro = (_, o) => {
  const t = _.__vccOpts || _;
  for (const [g, C] of o)
    t[g] = C;
  return t;
}, mo = /* @__PURE__ */ ro(no, [["__scopeId", "data-v-e12fa355"]]);
export {
  mo as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page-header[data-v-e12fa355]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.page-header h1[data-v-e12fa355]{margin:0;font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-e12fa355]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-e12fa355]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.stat-grid[data-v-e12fa355]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-e12fa355]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:var(--r-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px;transition:transform .28s var(--ease-spring),box-shadow .28s}@media(hover:hover)and (pointer:fine){.stat-card[data-v-e12fa355]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}.stat-head[data-v-e12fa355]{display:flex;align-items:center;gap:10px}.stat-label[data-v-e12fa355]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-e12fa355]{font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-e12fa355]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-e12fa355]{width:44px;height:44px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-e12fa355]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-e12fa355]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-e12fa355]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-e12fa355]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}.card-head[data-v-e12fa355]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-e12fa355]{margin:0;font-size:16px;font-weight:650}.toolbar[data-v-e12fa355]{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-e12fa355]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px;height:52px;padding:0 14px;border-radius:16px;background:var(--md-surface-container-high)}.search-icon[data-v-e12fa355]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-e12fa355]{flex:1;min-width:0;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-e12fa355]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}.search-field.mini[data-v-e12fa355]{height:auto;padding:10px 12px;margin-bottom:12px}#app .memory-page .field.area[data-v-e12fa355]{height:auto;min-height:120px;padding:12px 14px;resize:vertical;line-height:1.6}.chip[data-v-e12fa355]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-e12fa355]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-e12fa355]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-e12fa355]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-e12fa355]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}.chip-warn[data-v-e12fa355]{background:var(--md-warning-container);color:var(--md-on-warning-container)}.memory-list[data-v-e12fa355]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:var(--space-lg)}.memory-card[data-v-e12fa355]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:var(--r-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:transform .26s var(--ease-spring),box-shadow .22s,border-color .2s}@media(hover:hover)and (pointer:fine){.memory-card[data-v-e12fa355]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}.memory-card-enter-active[data-v-e12fa355]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.memory-card-leave-active[data-v-e12fa355]{transition:opacity .16s var(--ease-emphasized-accel),transform .16s var(--ease-emphasized-accel)}.memory-card-enter-from[data-v-e12fa355]{opacity:0;transform:translateY(6px) scale(.98)}.memory-card-leave-to[data-v-e12fa355]{opacity:0;transform:scale(.98)}.memory-card-move[data-v-e12fa355]{transition:transform .26s var(--ease-emphasized)}@media(prefers-reduced-motion:reduce){.memory-card-enter-active[data-v-e12fa355],.memory-card-leave-active[data-v-e12fa355],.memory-card-move[data-v-e12fa355]{transition-duration:1ms}.memory-card-enter-from[data-v-e12fa355],.memory-card-leave-to[data-v-e12fa355],.stat-card[data-v-e12fa355]:hover,.memory-card[data-v-e12fa355]:hover{transform:none}}.card-top[data-v-e12fa355]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-e12fa355]{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}#app .memory-page .btn-icon[data-v-e12fa355]{min-height:0}.btn-icon[data-v-e12fa355]:after{content:\"\";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}.btn-icon.danger[data-v-e12fa355]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-e12fa355]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere}.tags[data-v-e12fa355]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-e12fa355]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-e12fa355]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-e12fa355]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-e12fa355]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-e12fa355]{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}.fill-primary[data-v-e12fa355]{background:var(--md-primary)}.fill-secondary[data-v-e12fa355]{background:var(--md-secondary,#536255)}.meter-text[data-v-e12fa355]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-e12fa355]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .24s var(--ease-out,ease)}.detail.open[data-v-e12fa355]{grid-template-rows:1fr}.detail-clip[data-v-e12fa355]{overflow:hidden;min-height:0;border-top:0 solid transparent}.detail-clip dl[data-v-e12fa355]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px;padding-top:10px}.detail.open .detail-clip[data-v-e12fa355]{border-top-width:1px;border-top-style:solid;border-top-color:var(--md-outline-variant)}.detail dt[data-v-e12fa355]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-e12fa355]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-e12fa355]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-e12fa355]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-e12fa355]{display:none}.empty-state[data-v-e12fa355]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--r-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-e12fa355]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-e12fa355]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-e12fa355]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-e12fa355]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-e12fa355]{display:flex;flex-direction:column;gap:10px}.note-list[data-v-e12fa355],.reflection-list[data-v-e12fa355]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-e12fa355]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:16px;background:var(--md-surface-container-low)}.note-main[data-v-e12fa355]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-e12fa355]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-e12fa355]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-e12fa355]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-e12fa355]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-e12fa355]{margin-top:var(--space-lg)}.reader pre[data-v-e12fa355]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-e12fa355]{font-size:14px;font-weight:600}.reflection details[data-v-e12fa355]{margin-top:6px}.reflection summary[data-v-e12fa355]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-e12fa355]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){.meter-bar i[data-v-e12fa355]{transition:none}}.tab-body[data-v-e12fa355]{min-width:0}.tab-fade-enter-active[data-v-e12fa355]{transition:opacity .2s var(--ease-emphasized-decel)}.tab-fade-leave-active[data-v-e12fa355]{transition:opacity .14s var(--ease-emphasized-accel)}.tab-fade-enter-from[data-v-e12fa355],.tab-fade-leave-to[data-v-e12fa355]{opacity:0}@media(prefers-reduced-motion:reduce){.tab-fade-enter-active[data-v-e12fa355],.tab-fade-leave-active[data-v-e12fa355]{transition-duration:1ms}}.dynamics-grid[data-v-e12fa355]{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:18px;align-items:end}@media(max-width:900px){.dynamics-grid[data-v-e12fa355]{grid-template-columns:1fr}}.dyn-track[data-v-e12fa355]{flex:1;height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.dyn-bar[data-v-e12fa355]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .5s var(--ease-out,ease)}.dyn-hist[data-v-e12fa355]{display:flex;align-items:flex-end;gap:3px;height:60px}.dyn-hist i[data-v-e12fa355]{flex:1;background:var(--md-primary);border-radius:3px 3px 0 0;transition:height .5s var(--ease-out,ease)}.dyn-curve[data-v-e12fa355]{width:100%;height:60px;color:var(--md-primary);display:block}.decay-line[data-v-e12fa355]{stroke-dasharray:1;stroke-dashoffset:1;animation:decay-draw-e12fa355 .9s var(--ease-out,ease) forwards}@keyframes decay-draw-e12fa355{to{stroke-dashoffset:0}}@media(prefers-reduced-motion:reduce){.dyn-bar[data-v-e12fa355],.dyn-hist i[data-v-e12fa355]{transition:none}.decay-line[data-v-e12fa355]{animation:none;stroke-dashoffset:0}}.skeleton-card[data-v-e12fa355]{gap:12px;pointer-events:none}.sk-line[data-v-e12fa355]{display:block;height:12px;border-radius:6px;background:linear-gradient(90deg,var(--md-surface-container-high) 25%,color-mix(in srgb,var(--md-on-surface) 8%,var(--md-surface-container-high)) 45%,var(--md-surface-container-high) 65%);background-size:200% 100%;animation:sk-shimmer-e12fa355 1.4s linear infinite}.sk-line.w30[data-v-e12fa355]{width:30%}.sk-line.w40[data-v-e12fa355]{width:40%}.sk-line.w75[data-v-e12fa355]{width:75%}.sk-line.w90[data-v-e12fa355]{width:90%}@keyframes sk-shimmer-e12fa355{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.sk-line[data-v-e12fa355]{animation:none}}.danger-zone[data-v-e12fa355]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-lg);flex-wrap:wrap;margin-top:var(--space-xl);padding:var(--space-lg);border:1px solid color-mix(in srgb,var(--md-error,#b3261e) 45%,transparent);border-radius:var(--r-lg);background:color-mix(in srgb,var(--md-error,#b3261e) 5%,transparent)}.danger-zone h2[data-v-e12fa355]{margin:0;font-size:15px;font-weight:750;color:var(--md-error,#b3261e)}.danger-zone .hint[data-v-e12fa355]{margin:4px 0 0}.danger-copy[data-v-e12fa355]{flex:1;min-width:240px}@media(max-width:900px){.stat-grid[data-v-e12fa355]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-e12fa355]{grid-template-columns:1fr}}@media(max-width:640px){.header-actions[data-v-e12fa355]{padding-top:0}.memory-list[data-v-e12fa355]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
