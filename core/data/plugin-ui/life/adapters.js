import { defineComponent as ue, ref as f, computed as B, onMounted as fe, openBlock as d, createElementBlock as p, createElementVNode as t, createTextVNode as m, toDisplayString as i, createCommentVNode as x, Fragment as U, renderList as Y, normalizeClass as G, createVNode as F, Transition as me, withCtx as K, unref as W, withDirectives as g, vModelText as v, vModelCheckbox as q, TransitionGroup as ge, nextTick as J } from "vue";
import { i18n as ee, useConfirm as ve, AppSelect as Q } from "@0kay/host";
const X = (h, a) => ee.global.t(h, {});
function T(h) {
  const a = String(h?.message || h || "");
  return /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(a) ? X("life.kit.notReady") : a || X("life.kit.actionFailed");
}
const he = (h) => new Promise((a) => setTimeout(a, h)), be = 3200;
async function y(h, a = {}) {
  let e = null;
  for (let w = 0; w < 3; w++)
    try {
      const s = await fetch("/api/life/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: h, payload: a })
      });
      if (!s.ok) throw Error(await s.text() || String(s.status));
      return await s.json().catch(() => ({}));
    } catch (s) {
      e = s;
      const _ = /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|502|503|life unavailable/i.test(String(s?.message || s));
      if (w < 2 && _) {
        await he(1200);
        continue;
      }
      throw s;
    }
  throw e;
}
function xe(h) {
  const a = `.${h}`;
  return `
${a}{
  --r-xs:10px; --r-sm:14px; --r-md:20px; --r-lg:28px; --r-xl:36px;
  --spring:cubic-bezier(.2,.9,.25,1.15);
  height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;
  background:var(--md-surface);color:var(--md-on-surface);
  max-width:1240px;margin:0 auto;
}
${a} h1,${a} h2,${a} h3,${a} h4{margin:0;letter-spacing:-.01em}
${a} .eyebrow{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}
${a} .eyebrow b{font-size:9px}

/* Hero */
${a} .hero{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;
  background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);
  color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}
${a} .hero::after{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}
${a} .hero-main{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}
${a} .hero-copy h1{font-size:clamp(26px,3.4vw,40px);font-weight:800}
${a} .sub{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}
${a} .hero-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
${a} .fab{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);
  font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);
  transition:transform .28s var(--spring),box-shadow .28s}
@media (hover: hover) and (pointer: fine){${a} .fab:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}
${a} .fab:disabled{opacity:.6;cursor:not-allowed}
${a} .fab-ic{font-size:17px}
${a} .state-row{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
${a} .pill{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}
${a} .pill.soft{font-weight:500;color:var(--md-on-surface-variant)}
${a} .pill.bad{background:var(--md-warning-container);color:var(--md-on-warning-container)}

${a} .banner{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}
${a} .banner.err{background:var(--md-error-container);color:var(--md-on-error-container)}
${a} .banner.ok{background:var(--md-primary-container);color:var(--md-on-primary-container)}

/* Tabs */
${a} .tabs{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}
${a} .tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);
  border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;
  transition:background .25s,color .25s,transform .25s var(--spring)}
${a} .tab i{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}
${a} .tab-ic{font-size:14px}
${a} .tab:hover{background:var(--md-surface-container-high)}
${a} .tab.active{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);
  box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
${a} .tab.active i{opacity:.85}

${a} .panel{animation:fade .32s var(--spring)}
@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
/* The v-show panels are permanently mounted, so the entrance animation only
   plays on first paint. A page that switches tabs replays it by toggling this
   class (distinct keyframes, otherwise re-adding the same computed animation
   would not restart it). See CompanionPage replayPanel(). */
${a} .panel-replay{animation:fadeReplay .32s var(--spring)}
@keyframes fadeReplay{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
${a} .section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}
${a} .section-head h2{font-size:22px;font-weight:800}
${a} .desc{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}
${a} .head-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

/* Buttons */
${a} .btn{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}
${a} .btn.sm{height:34px;padding:0 14px;font-size:13px}
${a} .btn:disabled{opacity:.5;cursor:not-allowed}
@media (hover: hover) and (pointer: fine){${a} .btn:hover:not(:disabled){transform:translateY(-1px)}}
${a} .btn.filled{background:var(--md-primary);color:var(--md-on-primary,#fff)}
${a} .btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
${a} .btn.text{background:transparent;color:var(--md-primary)}
${a} .btn.danger{background:var(--md-error-container);color:var(--md-on-error-container)}
${a} .link{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}

/* Cards */
${a} .card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}
${a} .card > h3{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
${a} .card.sub{padding:16px;margin-bottom:0}
/* minmax(0, 1fr) rather than 1fr: a bare 1fr track has an auto minimum, so one
   child with a large min-content width (a long model id, a URL) blows the track
   past the container instead of shrinking. */
${a} .grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
${a} .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}
${a} .sub-label{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}
${a} .hint{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}
${a} .meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}
${a} .empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}

/* Fields */
${a} .field{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}
${a} .field:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
${a} .field.tiny{width:104px;height:38px;padding:0 12px;font-size:13px}
${a} .switches{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}
${a} .sw{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}
${a} .sw input{width:18px;height:18px;accent-color:var(--md-primary)}
${a} .settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
${a} .settings-grid label{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
${a} .settings-grid .field{height:40px}
${a} .fld{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);min-width:180px}

/* Chips / status */
${a} .count-pill{margin-left:auto;flex:0 0 auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
${a} .count-pill.ok{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}
${a} .actions-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}

/* Feed list (adapters, routes, commitments …) */
${a} .feed{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
${a} .feed > li{padding:14px 16px;border-radius:var(--r-md);background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent)}
${a} .feed > li.empty{background:none;border:0}

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
#app ${a} .card{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}
#app ${a} .field{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}
#app ${a} .field:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}
#app ${a} .field.tiny{height:40px}
#app ${a} .settings-grid .field{height:44px}
#app ${a} .btn{height:44px;padding:0 20px}
#app ${a} .btn.sm{height:36px;padding:0 15px}

/* Theme-specific overrides key off html[data-theme] — the darkmode plugin's
   toggle — not prefers-color-scheme, so a manual light/dark choice in Settings
   is honored (the injected CSS is global, so html-level selectors are fine). */
@media (prefers-reduced-motion: reduce){
  ${a} .panel{animation:none}
  ${a} .panel-replay{animation:none}
  ${a} .fab,${a} .btn,${a} .tab{transition:none}
  ${a} .fab:hover:not(:disabled),${a} .btn:hover:not(:disabled),${a} .tab.active{transform:none}
}
html[data-theme="dark"] ${a} .pill.bad{background:#5a2d00;color:#ffd7b0}
@media(max-width:820px){${a} .grid2,${a} .grid3{grid-template-columns:1fr}}
@media(max-width:560px){${a}{padding:var(--space-lg) var(--space-lg) 80px}${a} .hero{padding:20px}${a} .hero-actions{width:100%}}
`;
}
const we = { class: "lsp" }, ye = { class: "hero" }, _e = { class: "hero-main" }, ke = { class: "hero-copy" }, $e = { class: "sub" }, Ce = { class: "hero-actions" }, ze = ["disabled"], Se = { class: "state-row" }, Te = { class: "pill soft" }, Ee = { class: "pill soft" }, Ue = { class: "pill soft" }, Ve = {
  key: 0,
  class: "banner err"
}, Ae = {
  key: 1,
  class: "banner ok"
}, Pe = {
  key: 2,
  class: "card empty"
}, Re = { class: "card" }, Fe = { class: "count-pill" }, Ne = {
  key: 0,
  class: "empty"
}, He = {
  key: 1,
  class: "feed"
}, Ie = { class: "adapter-row" }, je = { class: "pill muted" }, De = {
  class: "meta",
  style: { "margin-top": "6px" }
}, Me = { class: "pill soft" }, Le = { class: "meta" }, Oe = {
  key: 0,
  class: "hint",
  style: { color: "var(--md-error,#b3261e)" }
}, Be = { class: "adapter-actions" }, Ye = ["disabled", "onClick"], Ge = ["onClick"], Ke = ["disabled", "onClick"], We = { class: "settings-grid" }, qe = { key: 0 }, Je = ["placeholder"], Qe = ["placeholder"], Xe = ["placeholder"], Ze = ["placeholder"], ea = ["placeholder"], aa = { class: "hint" }, ta = {
  class: "sw",
  style: { "margin-top": "12px" }
}, ra = {
  class: "sw",
  style: { "margin-top": "12px" }
}, na = {
  key: 0,
  class: "hint platform-note"
}, la = { class: "editor-actions" }, ia = ["disabled"], oa = { class: "card" }, sa = { class: "hint" }, da = { class: "idx" }, pa = { class: "to" }, ca = { style: { "margin-left": "auto", display: "flex", gap: "8px" } }, ua = ["disabled", "aria-label", "title", "onClick"], fa = ["disabled", "aria-label", "title", "onClick"], ma = ["aria-label", "onClick"], ga = {
  key: 0,
  class: "empty"
}, va = {
  class: "settings-grid",
  style: { "margin-top": "14px" }
}, ha = ["placeholder"], ba = { class: "actions-row" }, xa = {
  class: "fld",
  style: { "margin-left": "auto" }
}, wa = ["disabled"], Z = "life-plugin-adapters-style", ka = /* @__PURE__ */ ue({
  __name: "AdapterSettingsPage",
  setup(h) {
    const { confirm: a } = ve(), e = (n, l) => ee.global.t(n, l ?? {}), w = f(!0), s = f(""), _ = f("");
    function z(n) {
      _.value = n, setTimeout(() => {
        _.value === n && (_.value = "");
      }, be);
    }
    const k = f([]), N = f([]), V = f([]), c = f(!1), $ = f(null), o = f(A()), H = f(null);
    function A() {
      return {
        id: "",
        name: "",
        platform: "aiocqhttp",
        enabled: !0,
        direction: "reverse",
        ws_path: "/ws",
        ws_host: "127.0.0.1",
        ws_port: 6199,
        ws_token: "",
        http_url: "",
        access_token: "",
        config_id: "default",
        trigger_keywords: "",
        observe_group: !0
      };
    }
    function I(n) {
      return N.value.find((l) => l.id === n) || { id: n };
    }
    function j(n) {
      const l = I(n.id);
      return n.enabled ? l.connected ? { label: e("life.adapters.stateConnected", { n: l.clients || 0 }), tone: "ok" } : l.running ? {
        label: e(n.direction === "connect" ? "life.adapters.stateConnecting" : "life.adapters.stateWaiting"),
        tone: "wait"
      } : { label: l.error ? e("life.adapters.stateFailed") : e("life.adapters.stateIdle"), tone: "bad" } : { label: e("life.adapters.stateDisabled"), tone: "muted" };
    }
    B(() => V.value.filter((n) => n.implemented).map((n) => n.id));
    const D = B(() => V.value.filter((n) => !n.implemented).map((n) => n.id));
    async function E() {
      w.value = !0, s.value = "";
      try {
        const [n, l, r] = await Promise.all([
          y("adapter_list"),
          y("adapter_platforms"),
          y("adapter_routes_get")
        ]);
        k.value = n?.instances || [], N.value = n?.runtime || [], V.value = l?.platforms || [], b.value = (r?.routes || []).map(L), P.value = r?.default_config_id || "default", o.value = { ...A(), ws_port: M() };
      } catch (n) {
        s.value = T(n);
      } finally {
        w.value = !1;
      }
    }
    function M() {
      const n = new Set(k.value.map((r) => Number(r.ws_port) || 0));
      let l = 6199;
      for (; n.has(l) && l < 65535; ) l += 1;
      return l;
    }
    async function ae() {
      $.value = "", o.value = {
        ...A(),
        ws_port: M()
      }, await J(), H.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    async function te(n) {
      $.value = n.id, o.value = {
        ...A(),
        ...n,
        trigger_keywords: Array.isArray(n.trigger_keywords) ? n.trigger_keywords.join(",") : n.trigger_keywords || ""
      }, await J(), H.value?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    async function re() {
      c.value = !0;
      try {
        const n = { ...o.value };
        n.id && !n.ws_token && delete n.ws_token, n.id && !n.access_token && delete n.access_token, n.trigger_keywords = String(n.trigger_keywords || "").split(",").map((S) => S.trim()).filter(Boolean);
        const l = Number(n.ws_port);
        n.ws_port === "" || n.ws_port === null || n.ws_port === void 0 ? delete n.ws_port : l > 0 ? n.ws_port = l : delete n.ws_port, n.id || delete n.id;
        const r = await y("adapter_upsert", { instance: n });
        if (r && r.ok === !1) throw Error(r.error || e("life.adapters.saveFailed"));
        r?.sync?.failed?.includes(r?.instance?.id) && n.enabled ? z(e("life.adapters.savedUnlistened")) : z(n.enabled === !1 ? e("life.adapters.savedDisabled") : e("life.adapters.savedListening")), $.value = null, await E();
      } catch (n) {
        s.value = T(n);
      } finally {
        c.value = !1;
      }
    }
    async function ne(n) {
      c.value = !0;
      try {
        await y("adapter_toggle", { id: n.id, enabled: !n.enabled }), z(n.enabled ? e("life.adapters.toggledDisabled", { name: n.name }) : e("life.adapters.toggledEnabled", { name: n.name })), await E();
      } catch (l) {
        s.value = T(l);
      } finally {
        c.value = !1;
      }
    }
    async function le(n) {
      if (await a({
        title: e("life.adapters.deleteTitle"),
        message: e("life.adapters.deleteMessage", { name: n.name }),
        confirmLabel: e("life.adapters.delete"),
        danger: !0
      })) {
        c.value = !0;
        try {
          await y("adapter_delete", { id: n.id }), z(e("life.adapters.deleted")), $.value === n.id && ($.value = null), await E();
        } catch (r) {
          s.value = T(r);
        } finally {
          c.value = !1;
        }
      }
    }
    async function ie() {
      c.value = !0;
      try {
        const l = (await y("adapter_sync"))?.failed || [];
        z(l.length ? e("life.adapters.resyncFailed", { count: l.length, names: l.join(e("life.adapters.listSeparator")) }) : e("life.adapters.resynced")), await E();
      } catch (n) {
        s.value = T(n);
      } finally {
        c.value = !1;
      }
    }
    const b = f([]), P = f("default"), C = f({ pattern: "*", config_id: "default" }), R = f(!1);
    let oe = 0;
    function L(n) {
      return { ...n, _key: `rule-${++oe}` };
    }
    const se = (n) => ({ pattern: n.pattern, config_id: n.config_id });
    function de() {
      const n = String(C.value.pattern || "").trim();
      if (!n) {
        s.value = e("life.adapters.routePatternRequired");
        return;
      }
      b.value = [...b.value, L({ pattern: n, config_id: String(C.value.config_id || "default").trim() || "default" })], C.value = { pattern: "*", config_id: "default" }, s.value = "";
    }
    function pe(n) {
      b.value = b.value.filter((l, r) => r !== n);
    }
    function O(n, l) {
      const r = [...b.value], u = n + l;
      if (u < 0 || u >= r.length) return;
      const [S] = r.splice(n, 1);
      r.splice(u, 0, S), b.value = r;
    }
    async function ce() {
      R.value = !0;
      try {
        await y("adapter_routes_set", {
          routes: b.value.map(se),
          default_config_id: String(P.value || "default").trim() || "default"
        }), z(e("life.adapters.routesSaved"));
      } catch (n) {
        s.value = T(n);
      } finally {
        R.value = !1;
      }
    }
    if (typeof document < "u" && !document.getElementById(Z)) {
      const n = document.createElement("style");
      n.id = Z, n.textContent = xe("lsp") + `
.lsp .adapter-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.lsp .adapter-row strong{font-size:15px;font-weight:750;overflow-wrap:anywhere}
.lsp .adapter-row .meta{flex:1 1 100%}
.lsp .adapter-actions{display:flex;gap:8px;flex-wrap:wrap;flex:1 1 100%}
.lsp .rule-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
/* A route pattern is an unbreakable regex / path; without this it pushes the
   row (and the card) wider than its column. */
.lsp .rule-row code{font:600 12px/1.4 ui-monospace,monospace;background:var(--md-surface-container-high);
  padding:2px 8px;border-radius:8px;color:var(--md-on-surface);overflow-wrap:anywhere;max-width:100%}
.lsp .rule-row .idx{font:700 12px/1 ui-monospace,monospace;color:var(--md-on-surface-variant);min-width:20px}
.lsp .rule-row .to{color:var(--md-primary);font-weight:700;font-size:13px}
.lsp .pill{font-size:12px;padding:4px 12px;transition:background .3s,color .3s}
.lsp .pill.wait{background:var(--md-secondary-container);color:var(--md-on-secondary-container);display:inline-flex;align-items:center;gap:6px}
/* "Waiting for a client" breathes so it reads as alive, not frozen. */
.lsp .pill.wait::before{content:'';flex:0 0 auto;width:7px;height:7px;border-radius:50%;background:currentColor;animation:lsp-breath 1.6s ease-in-out infinite}
@keyframes lsp-breath{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
.lsp .pill.ok{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}
.lsp .pill.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}
.lsp .pill.bad{background:var(--md-error-container);color:var(--md-on-error-container)}
.lsp .platform-note{margin:10px 0 0}
.lsp .token-warn{color:var(--md-error,#b3261e);font-weight:700}
.lsp .editor-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
/* Editor card fade-in when "Add/Edit adapter" mounts it. */
.lsp .lsp-fade-enter-active{transition:opacity 220ms var(--ease-emphasized-decel),transform 220ms var(--ease-emphasized-decel)}
.lsp .lsp-fade-enter-from{opacity:0;transform:translateY(6px)}
/* Route-rule FLIP: rows glide to their new position on ↑↓ reorder. */
.lsp .rule-flip-move{transition:transform 260ms var(--ease-emphasized)}
.lsp .rule-flip-enter-active{transition:opacity 200ms var(--ease-emphasized-decel),transform 200ms var(--ease-emphasized-decel)}
.lsp .rule-flip-enter-from{opacity:0;transform:translateY(4px)}
.lsp .rule-flip-leave-active{transition:opacity 140ms var(--ease-emphasized-accel)}
.lsp .rule-flip-leave-to{opacity:0}
@media (prefers-reduced-motion: reduce){
  .lsp .pill.wait::before{animation:none}
  .lsp .lsp-fade-enter-active,.lsp .rule-flip-move,.lsp .rule-flip-enter-active,.lsp .rule-flip-leave-active{transition-duration:1ms}
}
`, document.head.appendChild(n);
    }
    return fe(E), (n, l) => (d(), p("main", we, [
      t("header", ye, [
        t("div", _e, [
          t("div", ke, [
            l[17] || (l[17] = t(
              "p",
              { class: "eyebrow" },
              [
                t("b", null, "●"),
                m(" L.I.F.E · MESSAGING PLATFORMS")
              ],
              -1
              /* CACHED */
            )),
            t(
              "h1",
              null,
              i(e("life.adapters.title")),
              1
              /* TEXT */
            ),
            t("p", $e, [
              m(
                i(e("life.adapters.subtitleBefore")),
                1
                /* TEXT */
              ),
              t(
                "b",
                null,
                i(e("life.adapters.subtitleServer")),
                1
                /* TEXT */
              ),
              m(
                i(e("life.adapters.subtitleAfter")),
                1
                /* TEXT */
              )
            ])
          ]),
          t("div", Ce, [
            t("button", {
              class: "fab",
              disabled: c.value || w.value,
              onClick: ie
            }, [
              l[18] || (l[18] = t(
                "span",
                {
                  class: "fab-ic",
                  "aria-hidden": "true"
                },
                "↻",
                -1
                /* CACHED */
              )),
              m(
                i(c.value ? e("life.adapters.processing") : e("life.adapters.relisten")),
                1
                /* TEXT */
              )
            ], 8, ze)
          ])
        ]),
        t("div", Se, [
          t(
            "span",
            Te,
            i(e("life.adapters.adapterCount", { n: k.value.length })),
            1
            /* TEXT */
          ),
          t(
            "span",
            Ee,
            i(e("life.adapters.enabledCount", { n: k.value.filter((r) => r.enabled).length })),
            1
            /* TEXT */
          ),
          t(
            "span",
            Ue,
            i(e("life.adapters.connectedCount", { n: N.value.filter((r) => r.connected).length })),
            1
            /* TEXT */
          )
        ])
      ]),
      s.value ? (d(), p(
        "p",
        Ve,
        i(s.value),
        1
        /* TEXT */
      )) : x("v-if", !0),
      _.value ? (d(), p(
        "p",
        Ae,
        i(_.value),
        1
        /* TEXT */
      )) : x("v-if", !0),
      w.value ? (d(), p(
        "p",
        Pe,
        i(e("life.adapters.loadingConfig")),
        1
        /* TEXT */
      )) : x("v-if", !0),
      w.value ? x("v-if", !0) : (d(), p(
        U,
        { key: 3 },
        [
          t("article", Re, [
            t("h3", null, [
              m(
                i(e("life.adapters.adaptersHeading")) + " ",
                1
                /* TEXT */
              ),
              t(
                "span",
                Fe,
                i(k.value.length),
                1
                /* TEXT */
              ),
              t(
                "button",
                {
                  class: "btn filled sm",
                  style: { "margin-left": "auto" },
                  onClick: ae
                },
                i(e("life.adapters.addAdapter")),
                1
                /* TEXT */
              )
            ]),
            k.value.length ? (d(), p("ol", He, [
              (d(!0), p(
                U,
                null,
                Y(k.value, (r) => (d(), p("li", {
                  key: r.id
                }, [
                  t("div", Ie, [
                    t(
                      "strong",
                      null,
                      i(r.name || r.id),
                      1
                      /* TEXT */
                    ),
                    t(
                      "span",
                      {
                        class: G(["pill", j(r).tone])
                      },
                      i(j(r).label),
                      3
                      /* TEXT, CLASS */
                    ),
                    t(
                      "span",
                      je,
                      i(r.platform),
                      1
                      /* TEXT */
                    )
                  ]),
                  t("div", De, [
                    t(
                      "span",
                      Me,
                      i(r.direction === "connect" ? e("life.adapters.directionConnect") : e("life.adapters.directionReverse")),
                      1
                      /* TEXT */
                    ),
                    m(
                      " " + i(r.direction === "connect" ? e("life.adapters.connectingTo", { target: `${r.ws_host}:${r.ws_port}${r.ws_path || ""}` }) : e("life.adapters.listening", { host: r.ws_host, port: r.ws_port })) + " · " + i(e("life.adapters.personaInline")) + " ",
                      1
                      /* TEXT */
                    ),
                    t(
                      "code",
                      null,
                      i(r.config_id),
                      1
                      /* TEXT */
                    ),
                    r.http_url ? (d(), p(
                      U,
                      { key: 0 },
                      [
                        m(
                          " · HTTP " + i(r.http_url),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : x("v-if", !0)
                  ]),
                  t("div", Le, [
                    t(
                      "span",
                      {
                        class: G({ "token-warn": !r.has_ws_token && r.ws_host === "0.0.0.0" })
                      },
                      i(r.has_ws_token ? e("life.adapters.tokenSet") : e("life.adapters.tokenUnset")),
                      3
                      /* TEXT, CLASS */
                    ),
                    r.trigger_keywords && r.trigger_keywords.length ? (d(), p(
                      U,
                      { key: 0 },
                      [
                        m(
                          " · " + i(e("life.adapters.triggerWords")) + " " + i(r.trigger_keywords.join(e("life.adapters.listSeparator"))),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : x("v-if", !0)
                  ]),
                  I(r.id).error ? (d(), p(
                    "p",
                    Oe,
                    i(e("life.adapters.listenError", { error: I(r.id).error })),
                    1
                    /* TEXT */
                  )) : x("v-if", !0),
                  t("div", Be, [
                    t("button", {
                      class: "btn sm",
                      disabled: c.value,
                      onClick: (u) => ne(r)
                    }, i(r.enabled ? e("life.adapters.disable") : e("life.adapters.enable")), 9, Ye),
                    t("button", {
                      class: "btn sm",
                      onClick: (u) => te(r)
                    }, i(e("life.adapters.edit")), 9, Ge),
                    t("button", {
                      class: "btn sm danger",
                      disabled: c.value,
                      onClick: (u) => le(r)
                    }, i(e("life.adapters.delete")), 9, Ke)
                  ])
                ]))),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (d(), p(
              "p",
              Ne,
              i(e("life.adapters.emptyAdapters")),
              1
              /* TEXT */
            ))
          ]),
          F(me, { name: "lsp-fade" }, {
            default: K(() => [
              $.value !== null ? (d(), p(
                "article",
                {
                  key: 0,
                  ref_key: "editorEl",
                  ref: H,
                  class: "card"
                },
                [
                  t(
                    "h3",
                    null,
                    i(o.value.id ? e("life.adapters.editAdapterTitle") : e("life.adapters.addAdapterTitle")),
                    1
                    /* TEXT */
                  ),
                  t("div", We, [
                    t("label", null, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.platformCategory")),
                        1
                        /* TEXT */
                      ),
                      F(W(Q), {
                        modelValue: o.value.platform,
                        "onUpdate:modelValue": l[0] || (l[0] = (r) => o.value.platform = r),
                        options: V.value.map((r) => ({ value: r.id, label: r.id + (r.implemented ? "" : e("life.adapters.notImplemented")) }))
                      }, null, 8, ["modelValue", "options"])
                    ]),
                    t("label", null, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.direction")),
                        1
                        /* TEXT */
                      ),
                      F(W(Q), {
                        modelValue: o.value.direction,
                        "onUpdate:modelValue": l[1] || (l[1] = (r) => o.value.direction = r),
                        options: [
                          { value: "reverse", label: e("life.adapters.directionReverse") },
                          { value: "connect", label: e("life.adapters.directionConnect") }
                        ]
                      }, null, 8, ["modelValue", "options"])
                    ]),
                    t("label", null, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.botName")),
                        1
                        /* TEXT */
                      ),
                      g(t(
                        "input",
                        {
                          "onUpdate:modelValue": l[2] || (l[2] = (r) => o.value.name = r),
                          class: "field",
                          placeholder: "napcat"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [v, o.value.name]
                      ])
                    ]),
                    t("label", null, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.wsHost")),
                        1
                        /* TEXT */
                      ),
                      g(t(
                        "input",
                        {
                          "onUpdate:modelValue": l[3] || (l[3] = (r) => o.value.ws_host = r),
                          class: "field",
                          placeholder: "0.0.0.0"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [v, o.value.ws_host]
                      ])
                    ]),
                    t("label", null, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.wsPort")),
                        1
                        /* TEXT */
                      ),
                      g(t(
                        "input",
                        {
                          "onUpdate:modelValue": l[4] || (l[4] = (r) => o.value.ws_port = r),
                          class: "field",
                          type: "number",
                          min: "1",
                          max: "65535",
                          placeholder: "6199"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [
                          v,
                          o.value.ws_port,
                          void 0,
                          { number: !0 }
                        ]
                      ])
                    ]),
                    o.value.direction === "connect" ? (d(), p("label", qe, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.wsPath")),
                        1
                        /* TEXT */
                      ),
                      g(t("input", {
                        "onUpdate:modelValue": l[5] || (l[5] = (r) => o.value.ws_path = r),
                        class: "field",
                        placeholder: e("life.adapters.wsPathPlaceholder")
                      }, null, 8, Je), [
                        [v, o.value.ws_path]
                      ])
                    ])) : x("v-if", !0),
                    t("label", null, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.wsToken")),
                        1
                        /* TEXT */
                      ),
                      g(t("input", {
                        "onUpdate:modelValue": l[6] || (l[6] = (r) => o.value.ws_token = r),
                        class: "field",
                        type: "password",
                        placeholder: e("life.adapters.wsTokenPlaceholder")
                      }, null, 8, Qe), [
                        [v, o.value.ws_token]
                      ])
                    ]),
                    t("label", null, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.httpUrl")),
                        1
                        /* TEXT */
                      ),
                      g(t("input", {
                        "onUpdate:modelValue": l[7] || (l[7] = (r) => o.value.http_url = r),
                        class: "field",
                        placeholder: e("life.adapters.httpUrlPlaceholder")
                      }, null, 8, Xe), [
                        [v, o.value.http_url]
                      ])
                    ]),
                    t("label", null, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.accessToken")),
                        1
                        /* TEXT */
                      ),
                      g(t("input", {
                        "onUpdate:modelValue": l[8] || (l[8] = (r) => o.value.access_token = r),
                        class: "field",
                        placeholder: e("life.adapters.accessTokenPlaceholder")
                      }, null, 8, Ze), [
                        [v, o.value.access_token]
                      ])
                    ]),
                    t("label", null, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.configFile")),
                        1
                        /* TEXT */
                      ),
                      g(t(
                        "input",
                        {
                          "onUpdate:modelValue": l[9] || (l[9] = (r) => o.value.config_id = r),
                          class: "field",
                          placeholder: "default"
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [v, o.value.config_id]
                      ])
                    ]),
                    t("label", null, [
                      t(
                        "span",
                        null,
                        i(e("life.adapters.triggerKeywordsInherit")),
                        1
                        /* TEXT */
                      ),
                      g(t("input", {
                        "onUpdate:modelValue": l[10] || (l[10] = (r) => o.value.trigger_keywords = r),
                        class: "field",
                        placeholder: e("life.adapters.triggerKeywordsPlaceholder")
                      }, null, 8, ea), [
                        [v, o.value.trigger_keywords]
                      ])
                    ])
                  ]),
                  t(
                    "p",
                    aa,
                    i(e("life.adapters.directionHint")),
                    1
                    /* TEXT */
                  ),
                  t("label", ta, [
                    g(t(
                      "input",
                      {
                        "onUpdate:modelValue": l[11] || (l[11] = (r) => o.value.enabled = r),
                        type: "checkbox"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [q, o.value.enabled]
                    ]),
                    t(
                      "span",
                      null,
                      i(e("life.adapters.enableThisAdapter")),
                      1
                      /* TEXT */
                    )
                  ]),
                  t("label", ra, [
                    g(t(
                      "input",
                      {
                        "onUpdate:modelValue": l[12] || (l[12] = (r) => o.value.observe_group = r),
                        type: "checkbox"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [q, o.value.observe_group]
                    ]),
                    t(
                      "span",
                      null,
                      i(e("life.adapters.observeGroup")),
                      1
                      /* TEXT */
                    )
                  ]),
                  D.value.length ? (d(), p(
                    "p",
                    na,
                    i(e("life.adapters.pendingPlatforms", { names: D.value.join(e("life.adapters.listSeparator")) })),
                    1
                    /* TEXT */
                  )) : x("v-if", !0),
                  t("div", la, [
                    t("button", {
                      class: "btn filled sm",
                      disabled: c.value,
                      onClick: re
                    }, i(c.value ? e("life.adapters.saving") : e("life.adapters.save")), 9, ia),
                    t(
                      "button",
                      {
                        class: "btn sm",
                        onClick: l[13] || (l[13] = (r) => $.value = null)
                      },
                      i(e("life.adapters.cancel")),
                      1
                      /* TEXT */
                    )
                  ])
                ],
                512
                /* NEED_PATCH */
              )) : x("v-if", !0)
            ]),
            _: 1
            /* STABLE */
          }),
          t("article", oa, [
            t(
              "h3",
              null,
              i(e("life.adapters.routesTitle")),
              1
              /* TEXT */
            ),
            t("p", sa, [
              m(
                i(e("life.adapters.routesHintBefore")),
                1
                /* TEXT */
              ),
              t(
                "b",
                null,
                i(e("life.adapters.routesHintOrder")),
                1
                /* TEXT */
              ),
              m(
                i(e("life.adapters.routesHintAfterOrder")),
                1
                /* TEXT */
              ),
              l[19] || (l[19] = t(
                "code",
                null,
                "*",
                -1
                /* CACHED */
              )),
              m(
                i(e("life.adapters.routesHintMatchAll")),
                1
                /* TEXT */
              ),
              t(
                "code",
                null,
                i(e("life.adapters.routeRegexExample")),
                1
                /* TEXT */
              ),
              m(
                i(e("life.adapters.routesHintAnd")),
                1
                /* TEXT */
              ),
              t(
                "code",
                null,
                i(e("life.adapters.routePrefixExample")),
                1
                /* TEXT */
              ),
              m(
                i(e("life.adapters.routesHintTail")),
                1
                /* TEXT */
              ),
              l[20] || (l[20] = t(
                "code",
                null,
                "/sid",
                -1
                /* CACHED */
              )),
              m(
                i(e("life.adapters.routesHintSid")),
                1
                /* TEXT */
              )
            ]),
            F(ge, {
              tag: "ol",
              name: "rule-flip",
              class: "feed"
            }, {
              default: K(() => [
                (d(!0), p(
                  U,
                  null,
                  Y(b.value, (r, u) => (d(), p("li", {
                    key: r._key,
                    class: "rule-row"
                  }, [
                    t(
                      "span",
                      da,
                      i(u + 1),
                      1
                      /* TEXT */
                    ),
                    t(
                      "code",
                      null,
                      i(r.pattern),
                      1
                      /* TEXT */
                    ),
                    t(
                      "span",
                      pa,
                      "→ " + i(r.config_id),
                      1
                      /* TEXT */
                    ),
                    t("span", ca, [
                      t("button", {
                        class: "btn sm",
                        disabled: u === 0,
                        "aria-label": e("life.adapters.moveUp"),
                        title: e("life.adapters.moveUp"),
                        onClick: (S) => O(u, -1)
                      }, "↑", 8, ua),
                      t("button", {
                        class: "btn sm",
                        disabled: u === b.value.length - 1,
                        "aria-label": e("life.adapters.moveDown"),
                        title: e("life.adapters.moveDown"),
                        onClick: (S) => O(u, 1)
                      }, "↓", 8, fa),
                      t("button", {
                        class: "btn sm danger",
                        "aria-label": e("life.adapters.delete"),
                        onClick: (S) => pe(u)
                      }, i(e("life.adapters.delete")), 9, ma)
                    ])
                  ]))),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              _: 1
              /* STABLE */
            }),
            b.value.length ? x("v-if", !0) : (d(), p(
              "p",
              ga,
              i(e("life.adapters.emptyRoutes")),
              1
              /* TEXT */
            )),
            t("div", va, [
              t("label", null, [
                t(
                  "span",
                  null,
                  i(e("life.adapters.sessionPattern")) + "*",
                  1
                  /* TEXT */
                ),
                g(t("input", {
                  "onUpdate:modelValue": l[14] || (l[14] = (r) => C.value.pattern = r),
                  class: "field",
                  placeholder: e("life.adapters.sessionPatternPlaceholder")
                }, null, 8, ha), [
                  [v, C.value.pattern]
                ])
              ]),
              t("label", null, [
                t(
                  "span",
                  null,
                  i(e("life.adapters.configFile")),
                  1
                  /* TEXT */
                ),
                g(t(
                  "input",
                  {
                    "onUpdate:modelValue": l[15] || (l[15] = (r) => C.value.config_id = r),
                    class: "field",
                    placeholder: "default"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [v, C.value.config_id]
                ])
              ])
            ]),
            t("div", ba, [
              t(
                "button",
                {
                  class: "btn sm",
                  onClick: de
                },
                i(e("life.adapters.addRule")),
                1
                /* TEXT */
              ),
              t("label", xa, [
                t(
                  "span",
                  null,
                  i(e("life.adapters.defaultConfig")),
                  1
                  /* TEXT */
                ),
                g(t(
                  "input",
                  {
                    "onUpdate:modelValue": l[16] || (l[16] = (r) => P.value = r),
                    class: "field",
                    placeholder: "default"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [v, P.value]
                ])
              ]),
              t("button", {
                class: "btn filled sm",
                disabled: R.value,
                onClick: ce
              }, i(R.value ? e("life.adapters.saving") : e("life.adapters.saveRoutes")), 9, wa)
            ])
          ])
        ],
        64
        /* STABLE_FRAGMENT */
      ))
    ]));
  }
});
export {
  ka as default
};
