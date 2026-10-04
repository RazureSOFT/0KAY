import { defineComponent as Y, ref as u, computed as U, watch as O, nextTick as E, onMounted as q, onUnmounted as W, openBlock as c, createElementBlock as f, mergeProps as J, createElementVNode as m, unref as z, toDisplayString as V, normalizeClass as M, createBlock as G, Teleport as _, createVNode as Q, Transition as X, withCtx as Z, withModifiers as P, normalizeStyle as ee, Fragment as ae, renderList as re, createCommentVNode as N } from "vue";
const te = ["aria-expanded", "aria-controls", "aria-activedescendant", "aria-label", "disabled"], ne = { class: "app-select-value" }, oe = {
  class: "app-select-chevron",
  "aria-hidden": "true"
}, ie = ["id", "aria-label"], le = ["id", "aria-selected", "aria-disabled", "data-index", "onPointermove", "onClick"], se = {
  key: 0,
  class: "app-select-check",
  "aria-hidden": "true"
}, de = {
  key: 0,
  class: "app-select-empty"
}, ue = /* @__PURE__ */ Y({
  inheritAttrs: !1,
  __name: "AppSelect",
  props: {
    modelValue: { default: "" },
    options: {},
    disabled: { type: Boolean, default: !1 },
    placeholder: { default: "请选择" },
    ariaLabel: {}
  },
  emits: ["update:modelValue", "change"],
  setup(t, { emit: e }) {
    const n = t, x = e;
    let p = 0;
    const C = (a) => `${a}-${++p}`, A = u("zh-CN"), b = u(null), w = u(null), l = u(!1), s = u(-1), j = u({}), y = u(!1), $ = C("select"), d = U(() => n.options.map((a) => typeof a == "string" ? { value: a, label: a } : a)), H = U(() => d.value.find((a) => a.value === n.modelValue)?.label || n.modelValue || n.placeholder);
    let k = "", I = 0;
    function h() {
      const a = b.value?.getBoundingClientRect();
      if (!a) return;
      const r = window.visualViewport?.height || innerHeight, o = window.visualViewport?.width || innerWidth, i = r - a.bottom - 10, v = a.top - 10;
      y.value = a.top >= Math.min(320, d.value.length * 46 + 12) + 8 || i < Math.min(320, d.value.length * 46 + 12) && v > i;
      const R = Math.max(48, Math.min(340, y.value ? v : i)), F = Math.min(Math.max(a.width, 220), o - 16);
      j.value = { position: "fixed", left: `${Math.max(8, Math.min(a.left, o - F - 8))}px`, width: `${F}px`, maxHeight: `${R}px`, ...y.value ? { bottom: `${r - a.top + 8}px` } : { top: `${a.bottom + 8}px` } };
    }
    function g(a = !1) {
      l.value = !1, k = "", a && b.value?.focus();
    }
    async function S() {
      n.disabled || l.value || (l.value = !0, s.value = d.value.findIndex((a) => a.value === n.modelValue && !a.disabled), s.value < 0 && (s.value = d.value.findIndex((a) => !a.disabled)), h(), await E(), L());
    }
    function L() {
      w.value?.querySelector(`[data-index="${s.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function T(a) {
      const r = d.value[a];
      !r || r.disabled || (x("update:modelValue", r.value), x("change", r.value), g(!0));
    }
    async function K(a) {
      if (!(n.disabled || a.isComposing)) {
        if (a.key === "Tab") {
          g();
          return;
        }
        if (a.key === "Escape") {
          l.value && (a.preventDefault(), g(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(a.key)) {
          if (a.preventDefault(), !l.value) {
            await S();
            return;
          }
          if (a.key === "Enter" || a.key === " ") {
            T(s.value);
            return;
          }
          const r = d.value.map((i, v) => i.disabled ? -1 : v).filter((i) => i >= 0);
          if (!r.length) return;
          const o = r.indexOf(s.value);
          s.value = a.key === "Home" ? r[0] : a.key === "End" ? r[r.length - 1] : r[(o + (a.key === "ArrowDown" ? 1 : -1) + r.length) % r.length], await E(), L();
          return;
        }
        if (a.key.length === 1 && !a.ctrlKey && !a.metaKey && !a.altKey) {
          await S();
          const r = Date.now();
          k = r - I > 700 ? a.key : k + a.key, I = r;
          const o = d.value.findIndex((i) => !i.disabled && i.label.toLocaleLowerCase().startsWith(k.toLocaleLowerCase()));
          o >= 0 && (s.value = o, await E(), L());
        }
      }
    }
    function B(a) {
      const r = a.target;
      !b.value?.contains(r) && !w.value?.contains(r) && g();
    }
    function D(a) {
      l.value && (!(a.target instanceof Node) || !w.value?.contains(a.target)) && h();
    }
    return O(() => n.disabled, (a) => {
      a && g();
    }), O(d, () => {
      l.value && (s.value >= d.value.length && (s.value = d.value.findIndex((a) => !a.disabled)), E(h));
    }), q(() => {
      document.addEventListener("pointerdown", B, !0), window.addEventListener("resize", h), window.addEventListener("scroll", D, !0);
    }), W(() => {
      document.removeEventListener("pointerdown", B, !0), window.removeEventListener("resize", h), window.removeEventListener("scroll", D, !0);
    }), (a, r) => (c(), f("div", J(a.$attrs, {
      class: ["app-select", { "is-disabled": t.disabled, "is-open": l.value }]
    }), [
      m("button", {
        ref_key: "trigger",
        ref: b,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": l.value,
        "aria-controls": l.value ? z($) : void 0,
        "aria-activedescendant": l.value && s.value >= 0 ? `${z($)}-${s.value}` : void 0,
        "aria-label": t.ariaLabel,
        disabled: t.disabled,
        onClick: r[0] || (r[0] = (o) => l.value ? g() : S()),
        onKeydown: K
      }, [
        m("span", ne, V(H.value), 1),
        m("span", oe, [
          (c(), f("svg", {
            class: M({ "is-open": l.value }),
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none"
          }, [...r[2] || (r[2] = [
            m("path", {
              d: "m6 9 6 6 6-6",
              stroke: "currentColor",
              "stroke-width": "1.9",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, null, -1)
          ])], 2))
        ])
      ], 40, te),
      (c(), G(_, { to: "body" }, [
        Q(X, { name: "select-menu" }, {
          default: Z(() => [
            l.value ? (c(), f("div", {
              key: 0,
              id: z($),
              ref_key: "menu",
              ref: w,
              class: M(["app-select-menu", { "opens-up": y.value }]),
              style: ee(j.value),
              role: "listbox",
              "aria-label": t.ariaLabel || "选项",
              onPointerdown: r[1] || (r[1] = P(() => {
              }, ["prevent"]))
            }, [
              (c(!0), f(ae, null, re(d.value, (o, i) => (c(), f("div", {
                id: `${z($)}-${i}`,
                key: `${o.value}:${i}`,
                role: "option",
                "aria-selected": o.value === t.modelValue,
                "aria-disabled": !!o.disabled,
                "data-index": i,
                class: M(["app-select-option", { highlighted: s.value === i, selected: o.value === t.modelValue, disabled: o.disabled }]),
                onPointermove: (v) => !o.disabled && (s.value = i),
                onClick: P((v) => T(i), ["stop"])
              }, [
                m("span", null, V(o.label), 1),
                o.value === t.modelValue ? (c(), f("span", se, [...r[3] || (r[3] = [
                  m("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none"
                  }, [
                    m("path", {
                      d: "m5 12 4 4L19 6",
                      stroke: "currentColor",
                      "stroke-width": "2.4",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ], -1)
                ])])) : N("", !0)
              ], 42, le))), 128)),
              d.value.length ? N("", !0) : (c(), f("div", de, V(A.value === "en" ? "No options available" : "暂无可选项"), 1))
            ], 46, ie)) : N("", !0)
          ]),
          _: 1
        })
      ]))
    ], 16));
  }
});
function fe(t) {
  const e = String(t?.message || t || "");
  return /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(e) ? "LIFE 服务暂时未就绪（可能正在启动或重启），已自动重试。稍候刷新即可。" : e || "操作失败";
}
const pe = (t) => new Promise((e) => setTimeout(e, t));
async function me(t, e = {}) {
  let n = null;
  for (let x = 0; x < 3; x++)
    try {
      const p = await fetch("/api/life/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: t, payload: e })
      });
      if (!p.ok) throw Error(await p.text() || String(p.status));
      return await p.json().catch(() => ({}));
    } catch (p) {
      n = p;
      const C = /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|502|503|life unavailable/i.test(String(p?.message || p));
      if (x < 2 && C) {
        await pe(1200);
        continue;
      }
      throw p;
    }
  throw n;
}
async function xe(t = "/api/life/companion") {
  const e = await fetch(t);
  if (!e.ok) throw Error(await e.text() || String(e.status));
  return e.json();
}
async function ge(t) {
  const e = await fetch(`/api/settings/${encodeURIComponent(t)}`);
  if (!e.ok) throw Error(String(e.status));
  return (await e.json().catch(() => ({}))).values || {};
}
async function ve(t, e) {
  const n = await fetch(`/api/settings/${encodeURIComponent(t)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values: e })
  });
  if (!n.ok) throw Error(await n.text() || String(n.status));
}
function he(t) {
  const e = `.${t}`;
  return `
${e}{
  --r-xs:10px; --r-sm:14px; --r-md:20px; --r-lg:28px; --r-xl:36px;
  --spring:cubic-bezier(.2,.9,.25,1.15);
  height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;
  background:var(--md-surface);color:var(--md-on-surface);
  max-width:1240px;margin:0 auto;
}
${e} h1,${e} h2,${e} h3,${e} h4{margin:0;letter-spacing:-.01em}
${e} .eyebrow{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}
${e} .eyebrow b{font-size:9px}

/* Hero */
${e} .hero{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;
  background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);
  color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}
${e} .hero::after{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}
${e} .hero-main{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}
${e} .hero-copy h1{font-size:clamp(26px,3.4vw,40px);font-weight:800}
${e} .sub{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}
${e} .hero-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
${e} .fab{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);
  font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);
  transition:transform .28s var(--spring),box-shadow .28s}
@media (hover: hover) and (pointer: fine){${e} .fab:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}
${e} .fab:disabled{opacity:.6;cursor:not-allowed}
${e} .fab-ic{font-size:17px}
${e} .state-row{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
${e} .pill{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}
${e} .pill.soft{font-weight:500;color:var(--md-on-surface-variant)}
${e} .pill.bad{background:#ffdcc6;color:#7a3a00}

${e} .banner{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}
${e} .banner.err{background:var(--md-error-container);color:var(--md-on-error-container)}
${e} .banner.ok{background:var(--md-primary-container);color:var(--md-on-primary-container)}

/* Tabs */
${e} .tabs{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}
${e} .tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);
  border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;
  transition:background .25s,color .25s,transform .25s var(--spring)}
${e} .tab i{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}
${e} .tab-ic{font-size:14px}
${e} .tab:hover{background:var(--md-surface-container-high)}
${e} .tab.active{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);
  box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
${e} .tab.active i{opacity:.85}

${e} .panel{animation:fade .32s var(--spring)}
@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
${e} .section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}
${e} .section-head h2{font-size:22px;font-weight:800}
${e} .desc{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}
${e} .head-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

/* Buttons */
${e} .btn{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}
${e} .btn.sm{height:34px;padding:0 14px;font-size:13px}
${e} .btn:disabled{opacity:.5;cursor:not-allowed}
@media (hover: hover) and (pointer: fine){${e} .btn:hover:not(:disabled){transform:translateY(-1px)}}
${e} .btn.filled{background:var(--md-primary);color:var(--md-on-primary,#fff)}
${e} .btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
${e} .btn.text{background:transparent;color:var(--md-primary)}
${e} .btn.danger{background:var(--md-error-container);color:var(--md-on-error-container)}
${e} .link{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}

/* Cards */
${e} .card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}
${e} .card > h3{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}
${e} .card.sub{padding:16px;margin-bottom:0}
${e} .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
${e} .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}
${e} .sub-label{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}
${e} .hint{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}
${e} .meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}
${e} .empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}

/* Fields */
${e} .field{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}
${e} .field:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
${e} .field.tiny{width:104px;height:38px;padding:0 12px;font-size:13px}
${e} .switches{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}
${e} .sw{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}
${e} .sw input{width:18px;height:18px;accent-color:var(--md-primary)}
${e} .settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
${e} .settings-grid label{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
${e} .settings-grid .field{height:40px}
${e} .fld{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);min-width:180px}

/* Chips / status */
${e} .count-pill{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
${e} .count-pill.ok{background:var(--md-success-container);color:#0d3b1e}
${e} .actions-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}

/* Feed list (adapters, routes, commitments …) */
${e} .feed{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
${e} .feed > li{padding:14px 16px;border-radius:var(--r-md);background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent)}
${e} .feed > li.empty{background:none;border:0}

/* Material 3 Expressive align */
#app ${e} .card{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}
#app ${e} .field{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}
#app ${e} .field:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}
#app ${e} .field.tiny{height:40px}
#app ${e} .settings-grid .field{height:44px}
#app ${e} .btn{height:44px;padding:0 20px}
#app ${e} .btn.sm{height:36px;padding:0 15px}

@media (prefers-reduced-motion: reduce){
  ${e} .panel{animation:none}
  ${e} .fab,${e} .btn,${e} .tab{transition:none}
  ${e} .fab:hover:not(:disabled),${e} .btn:hover:not(:disabled),${e} .tab.active{transform:none}
}
@media (prefers-color-scheme: dark){${e} .pill.bad{background:#5a2d00;color:#ffd7b0}}
@media(max-width:820px){${e} .grid2,${e} .grid3{grid-template-columns:1fr}}
@media(max-width:560px){${e}{padding:var(--space-lg) var(--space-lg) 80px}${e} .hero{padding:20px}${e} .hero-actions{width:100%}}
`;
}
function be(t, e) {
  if (typeof document > "u" || document.getElementById(t)) return;
  const n = document.createElement("style");
  n.id = t, n.textContent = e, document.head.appendChild(n);
}
export {
  ue as _,
  me as a,
  xe as b,
  fe as f,
  be as i,
  he as l,
  ge as r,
  pe as s,
  ve as w
};
