import { defineComponent as Z, ref as M, computed as d, onMounted as Y, onUnmounted as z, openBlock as i, createElementBlock as r, createElementVNode as e, toDisplayString as t, unref as n, createCommentVNode as D, Fragment as b, normalizeStyle as g, createTextVNode as k, renderList as T } from "vue";
import { useI18n as G } from "vue-i18n";
import { useConfirm as K } from "@0kay/host";
const X = { class: "usage-page" }, J = { class: "hero page-hero" }, Q = { class: "hero-copy" }, W = { class: "subtitle" }, ee = { class: "hero-actions" }, se = ["disabled"], te = ["disabled"], ae = {
  key: 0,
  class: "banner err",
  role: "alert"
}, le = {
  key: 1,
  class: "banner ok",
  role: "status"
}, oe = {
  key: 2,
  class: "usage-loading",
  "aria-hidden": "true"
}, ne = { class: "overview" }, ie = { class: "card donut-card" }, re = { class: "donut" }, ce = {
  viewBox: "0 0 42 42",
  "aria-hidden": "true"
}, ue = ["stroke-dasharray"], de = ["stroke-dasharray", "stroke-dashoffset"], ve = { class: "donut-center" }, he = { class: "card total-card" }, me = { class: "total-head" }, pe = { class: "stat-label" }, _e = { class: "big" }, ge = ["aria-label"], ke = { class: "legend" }, ye = { class: "lg" }, be = { class: "lg" }, fe = { class: "mini-stack" }, we = { class: "mini" }, $e = { class: "mini" }, xe = { class: "mini" }, Me = { class: "panel" }, Te = { class: "panel-head" }, Ne = {
  key: 0,
  class: "panel-note"
}, Ce = {
  key: 0,
  class: "empty"
}, Ee = {
  key: 1,
  class: "chart"
}, Le = { class: "bars" }, De = {
  class: "grid",
  "aria-hidden": "true"
}, Se = ["title"], Be = { class: "axis" }, Pe = { class: "panel" }, Ue = { class: "panel-head" }, qe = { class: "panel-note" }, je = {
  key: 0,
  class: "empty"
}, Fe = {
  key: 1,
  class: "model-grid"
}, He = { class: "mc-top" }, Ve = { class: "mc-avatar" }, Ae = { class: "mc-name" }, Ie = { class: "mc-share" }, Re = { class: "mc-total" }, Oe = { class: "mc-track" }, Ze = { class: "mc-meta" }, Ye = /* @__PURE__ */ Z({
  __name: "UsagePage",
  setup(N) {
    const { t: l } = G(), { confirm: f } = K(), u = M(null), v = M(!1), h = M(""), y = M("");
    let C;
    const S = ["#5944c6", "#9b405e", "#27633e", "#8a5a00", "#1a6fb4", "#7b4bb7", "#0d8a5f", "#b5473c"];
    async function w(o = !1) {
      o || (v.value = !0, h.value = "");
      try {
        const s = await fetch("/api/usage");
        if (!s.ok) throw new Error(`HTTP ${s.status}`);
        u.value = await s.json();
      } catch (s) {
        o || (h.value = s?.message || l("usage.loadFailed"));
      } finally {
        v.value = !1;
      }
    }
    async function j() {
      if (await f({
        title: l("usage.clear"),
        message: l("usage.clearConfirm"),
        confirmLabel: l("usage.clear"),
        danger: !0
      })) {
        h.value = "", y.value = "";
        try {
          const s = await fetch("/api/usage", { method: "DELETE" });
          if (!s.ok) throw new Error(`HTTP ${s.status}`);
          y.value = l("usage.cleared"), await w(), setTimeout(() => {
            y.value = "";
          }, 2e3);
        } catch (s) {
          h.value = s?.message || l("usage.loadFailed");
        }
      }
    }
    const $ = d(() => {
      const o = u.value?.by_model || {};
      return Object.entries(o).map(([s, a], O) => ({ model: s, ...a, color: S[O % S.length] })).sort((s, a) => (a.total || 0) - (s.total || 0));
    }), F = d(() => {
      const o = u.value?.by_day || {};
      return Object.entries(o).map(([s, a]) => ({ day: s, ...a })).sort((s, a) => s.day < a.day ? 1 : -1).slice(0, 14);
    }), m = d(() => [...F.value].reverse()), B = d(() => Math.max(1, ...m.value.map((o) => o.total || 0))), H = d(() => Math.max(1, ...$.value.map((o) => o.total || 0))), E = d(() => m.value.reduce((o, s) => s.total > (o?.total || 0) ? s : o, m.value[0] || null)), V = [0.25, 0.5, 0.75, 1], p = d(() => Number(u.value?.total_tokens || 0)), P = d(() => Number(u.value?.total_prompt_tokens || 0)), A = d(() => Number(u.value?.total_completion_tokens || 0)), _ = d(() => p.value ? Math.round(P.value / p.value * 100) : 0), x = d(() => p.value ? 100 - _.value : 0), I = d(() => {
      const o = Number(u.value?.request_count || 0);
      return o ? Math.round(p.value / o) : 0;
    });
    function c(o) {
      return Number(o || 0).toLocaleString();
    }
    function L(o) {
      const s = Number(o || 0);
      return s >= 1e6 ? `${(s / 1e6).toFixed(s >= 1e7 ? 0 : 1)}M` : s >= 1e3 ? `${(s / 1e3).toFixed(s >= 1e4 ? 0 : 1)}k` : String(s);
    }
    function R(o) {
      return `${Math.max(3, Math.round(Number(o || 0) / B.value * 100))}%`;
    }
    function U(o) {
      return `${Math.max(3, Math.round(Number(o || 0) / H.value * 100))}%`;
    }
    function q(o) {
      const s = new Date(o);
      return Number.isNaN(s.getTime()) ? o.slice(5) : `${s.getMonth() + 1}/${s.getDate()}`;
    }
    return Y(() => {
      w(), C = window.setInterval(() => {
        document.hidden || w(!0);
      }, 15e3);
    }), z(() => {
      C && window.clearInterval(C);
    }), (o, s) => (i(), r("div", X, [
      e("header", J, [
        e("div", Q, [
          s[1] || (s[1] = e("p", { class: "eyebrow page-eyebrow" }, "0KAY · USAGE", -1)),
          e("h1", null, t(n(l)("usage.title")), 1),
          e("p", W, t(n(l)("usage.subtitle")), 1)
        ]),
        e("div", ee, [
          e("button", {
            class: "btn btn-tonal",
            disabled: v.value,
            onClick: s[0] || (s[0] = (a) => w())
          }, t(n(l)("memory.refresh")), 9, se),
          e("button", {
            class: "btn btn-danger-tonal",
            disabled: v.value,
            onClick: j
          }, t(n(l)("usage.clear")), 9, te)
        ])
      ]),
      h.value ? (i(), r("div", ae, t(h.value), 1)) : D("", !0),
      y.value ? (i(), r("div", le, t(y.value), 1)) : D("", !0),
      v.value && !u.value ? (i(), r("div", oe, [...s[2] || (s[2] = [
        e("div", { class: "skeleton sk-donut" }, null, -1),
        e("div", { class: "skeleton sk-card" }, null, -1),
        e("div", { class: "skeleton sk-card" }, null, -1)
      ])])) : (i(), r(b, { key: 3 }, [
        e("section", ne, [
          e("article", ie, [
            e("div", re, [
              (i(), r("svg", ce, [
                s[3] || (s[3] = e("circle", {
                  class: "donut-track",
                  cx: "21",
                  cy: "21",
                  r: "15.9",
                  pathLength: "100"
                }, null, -1)),
                e("circle", {
                  class: "donut-prompt",
                  cx: "21",
                  cy: "21",
                  r: "15.9",
                  pathLength: "100",
                  "stroke-dasharray": `${_.value} 100`
                }, null, 8, ue),
                e("circle", {
                  class: "donut-completion",
                  cx: "21",
                  cy: "21",
                  r: "15.9",
                  pathLength: "100",
                  "stroke-dasharray": `${x.value} 100`,
                  "stroke-dashoffset": -_.value
                }, null, 8, de)
              ])),
              e("div", ve, [
                e("b", null, t(L(p.value)), 1),
                e("span", null, t(n(l)("usage.totalTokens")), 1)
              ])
            ])
          ]),
          e("article", he, [
            e("div", me, [
              s[4] || (s[4] = e("span", { class: "stat-ic" }, [
                e("svg", {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none"
                }, [
                  e("path", {
                    d: "M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z",
                    stroke: "currentColor",
                    "stroke-width": "1.8"
                  }),
                  e("path", {
                    d: "M8 9h8M8 13h5",
                    stroke: "currentColor",
                    "stroke-width": "1.8",
                    "stroke-linecap": "round"
                  })
                ])
              ], -1)),
              e("div", null, [
                e("span", pe, t(n(l)("usage.totalTokens")), 1),
                e("b", _e, t(c(p.value)), 1)
              ])
            ]),
            e("div", {
              class: "compose",
              role: "img",
              "aria-label": n(l)("usage.composeAria", { prompt: _.value, completion: x.value })
            }, [
              e("span", {
                class: "seg prompt",
                style: g({ width: `${_.value}%` })
              }, null, 4),
              e("span", {
                class: "seg completion",
                style: g({ width: `${x.value}%` })
              }, null, 4)
            ], 8, ge),
            e("div", ke, [
              e("span", ye, [
                s[5] || (s[5] = e("i", { class: "dot prompt" }, null, -1)),
                k(t(n(l)("usage.promptTokens")), 1),
                e("b", null, t(c(P.value)), 1),
                e("small", null, t(_.value) + "%", 1)
              ]),
              e("span", be, [
                s[6] || (s[6] = e("i", { class: "dot completion" }, null, -1)),
                k(t(n(l)("usage.completionTokens")), 1),
                e("b", null, t(c(A.value)), 1),
                e("small", null, t(x.value) + "%", 1)
              ])
            ])
          ]),
          e("div", fe, [
            e("article", we, [
              s[7] || (s[7] = e("span", { class: "mini-ic" }, [
                e("svg", {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none"
                }, [
                  e("path", {
                    d: "M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4V6Z",
                    stroke: "currentColor",
                    "stroke-width": "1.8",
                    "stroke-linejoin": "round"
                  })
                ])
              ], -1)),
              e("div", null, [
                e("b", null, t(c(u.value?.session_count)), 1),
                e("span", null, t(n(l)("usage.sessions")), 1)
              ])
            ]),
            e("article", $e, [
              s[8] || (s[8] = e("span", { class: "mini-ic" }, [
                e("svg", {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none"
                }, [
                  e("path", {
                    d: "M13 2 4 14h6l-1 8 9-12h-6l1-8Z",
                    stroke: "currentColor",
                    "stroke-width": "1.8",
                    "stroke-linejoin": "round"
                  })
                ])
              ], -1)),
              e("div", null, [
                e("b", null, t(c(u.value?.request_count)), 1),
                e("span", null, t(n(l)("usage.requests")), 1)
              ])
            ]),
            e("article", xe, [
              s[9] || (s[9] = e("span", { class: "mini-ic" }, [
                e("svg", {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none"
                }, [
                  e("path", {
                    d: "M12 3v18M5 12h14",
                    stroke: "currentColor",
                    "stroke-width": "1.8",
                    "stroke-linecap": "round"
                  })
                ])
              ], -1)),
              e("div", null, [
                e("b", null, t(c(I.value)), 1),
                e("span", null, t(n(l)("usage.tokensPerRequest")), 1)
              ])
            ])
          ])
        ]),
        e("section", Me, [
          e("div", Te, [
            e("h2", null, t(n(l)("usage.byDay")), 1),
            E.value ? (i(), r("span", Ne, t(n(l)("usage.peak", { label: q(E.value.day), value: L(E.value.total) })), 1)) : D("", !0)
          ]),
          m.value.length === 0 ? (i(), r("div", Ce, t(n(l)("usage.empty")), 1)) : (i(), r("div", Ee, [
            e("div", Le, [
              e("div", De, [
                (i(), r(b, null, T(V, (a) => e("span", {
                  key: a,
                  style: g({ bottom: `${a * 100}%` })
                }, [
                  e("i", null, t(L(B.value * a)), 1)
                ], 4)), 64))
              ]),
              (i(!0), r(b, null, T(m.value, (a) => (i(), r("div", {
                key: a.day,
                class: "col",
                title: `${a.day} · ${n(l)("usage.totalTokens")} ${c(a.total)} · ${n(l)("usage.promptTokens")} ${c(a.prompt)} · ${n(l)("usage.completionTokens")} ${c(a.completion)} · #${c(a.count)}`
              }, [
                e("div", {
                  class: "col-bar",
                  style: g({ transform: `scaleY(${R(a.total)})` })
                }, null, 4)
              ], 8, Se))), 128))
            ]),
            e("div", Be, [
              (i(!0), r(b, null, T(m.value, (a) => (i(), r("span", {
                key: a.day
              }, t(q(a.day)), 1))), 128))
            ])
          ]))
        ]),
        e("section", Pe, [
          e("div", Ue, [
            e("h2", null, t(n(l)("usage.byModel")), 1),
            e("span", qe, t(n(l)("usage.modelsCount", { n: $.value.length })), 1)
          ]),
          $.value.length === 0 ? (i(), r("div", je, t(n(l)("usage.empty")), 1)) : (i(), r("div", Fe, [
            (i(!0), r(b, null, T($.value, (a) => (i(), r("article", {
              key: a.model,
              class: "model-card",
              style: g({ "--c": a.color })
            }, [
              e("div", He, [
                e("span", Ve, t(a.model.slice(0, 1).toUpperCase()), 1),
                e("code", Ae, t(a.model), 1),
                e("span", Ie, t(U(a.total).replace("%", "")) + "%", 1)
              ]),
              e("b", Re, [
                k(t(c(a.total)) + " ", 1),
                e("small", null, t(n(l)("usage.tokens")), 1)
              ]),
              e("div", Oe, [
                e("div", {
                  class: "mc-fill",
                  style: g({ transform: `scaleX(${U(a.total)})` })
                }, null, 4)
              ]),
              e("div", Ze, [
                e("span", null, [
                  e("b", null, t(c(a.prompt)), 1),
                  k(t(n(l)("usage.promptTokens")), 1)
                ]),
                e("span", null, [
                  e("b", null, t(c(a.completion)), 1),
                  k(t(n(l)("usage.completionTokens")), 1)
                ]),
                e("span", null, [
                  e("b", null, t(c(a.count)), 1),
                  k(" " + t(n(l)("usage.requestsSuffix")), 1)
                ])
              ])
            ], 4))), 128))
          ]))
        ])
      ], 64))
    ]));
  }
}), ze = (N, l) => {
  const f = N.__vccOpts || N;
  for (const [u, v] of l)
    f[u] = v;
  return f;
}, Je = /* @__PURE__ */ ze(Ye, [["__scopeId", "data-v-6065e013"]]);
export {
  Je as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".usage-page[data-v-6065e013]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-6065e013]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.hero-actions[data-v-6065e013]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-6065e013]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-6065e013]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-6065e013]{background:var(--md-success-container);color:var(--md-on-success-container)}.overview[data-v-6065e013]{display:grid;grid-template-columns:minmax(min(220px,100%),.9fr) minmax(min(280px,100%),1.5fr) minmax(min(200px,100%),1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-6065e013]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-6065e013 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-6065e013]{display:grid;place-items:center}.donut[data-v-6065e013]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-6065e013]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-6065e013]{fill:none;stroke-width:5}.donut-track[data-v-6065e013]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-6065e013]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-6065e013]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-6065e013]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-6065e013]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-6065e013]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-6065e013]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-6065e013]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-6065e013]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-6065e013]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-6065e013]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-6065e013]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-6065e013]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-6065e013]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-6065e013]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-6065e013]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-6065e013]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-6065e013]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-6065e013]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-6065e013]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-6065e013]{background:var(--md-primary)}.dot.completion[data-v-6065e013]{background:var(--md-tertiary)}.mini-stack[data-v-6065e013]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-6065e013]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-6065e013 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-6065e013]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-6065e013]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-6065e013]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-6065e013]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-6065e013]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-6065e013 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-6065e013]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-6065e013]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-6065e013]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-6065e013]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-6065e013]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-6065e013]{position:absolute;inset:0}.grid span[data-v-6065e013]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-6065e013]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-6065e013]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-6065e013]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-6065e013]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-6065e013]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-6065e013]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-6065e013]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(264px,100%),1fr));gap:16px}.model-card[data-v-6065e013]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-6065e013 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-6065e013]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-6065e013]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-6065e013]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-6065e013]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-6065e013]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-6065e013]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-6065e013]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-6065e013]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-6065e013]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-6065e013]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-6065e013]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-6065e013]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-6065e013]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-6065e013]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}.usage-loading[data-v-6065e013]{display:grid;grid-template-columns:minmax(220px,.9fr) 1.5fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-xl)}.skeleton[data-v-6065e013]{border-radius:32px;background:var(--md-surface-container-low);min-height:180px;animation:sk-shimmer-6065e013 1.4s ease-in-out infinite}.sk-donut[data-v-6065e013]{min-height:220px}@keyframes sk-shimmer-6065e013{0%,to{opacity:1}50%{opacity:.55}}@media(max-width:980px){.usage-loading[data-v-6065e013]{grid-template-columns:1fr 1fr}}@media(max-width:640px){.usage-loading[data-v-6065e013]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.skeleton[data-v-6065e013]{animation:none;opacity:.7}}@keyframes up-6065e013{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-6065e013]{grid-template-columns:1fr 1fr}.mini-stack[data-v-6065e013]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-6065e013],.mini-stack[data-v-6065e013]{grid-template-columns:1fr}.chart[data-v-6065e013]{height:200px;padding-left:34px}.grid span i[data-v-6065e013]{left:-34px;width:28px}.axis span[data-v-6065e013]{font-size:11px}}@media(max-width:560px){.axis span[data-v-6065e013]{font-size:10px}.axis span[data-v-6065e013]:nth-child(2n){visibility:hidden}}\n";document.head.appendChild(s)}})();
