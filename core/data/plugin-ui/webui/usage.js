import { defineComponent as Z, ref as x, computed as d, onMounted as Y, onUnmounted as z, openBlock as c, createElementBlock as i, createElementVNode as e, toDisplayString as t, unref as n, createCommentVNode as L, Fragment as b, normalizeStyle as g, createTextVNode as U, renderList as M } from "vue";
import { useI18n as G } from "vue-i18n";
import { useConfirm as K } from "@0kay/host";
const J = { class: "usage-page" }, Q = { class: "hero page-hero" }, W = { class: "hero-copy" }, X = { class: "subtitle" }, ee = { class: "hero-actions" }, se = ["disabled"], te = ["disabled"], oe = {
  key: 0,
  class: "banner err",
  role: "alert"
}, ae = {
  key: 1,
  class: "banner ok",
  role: "status"
}, le = {
  key: 2,
  class: "usage-loading",
  "aria-hidden": "true"
}, ne = { class: "overview" }, ce = { class: "card donut-card" }, ie = { class: "donut" }, ue = {
  viewBox: "0 0 42 42",
  "aria-hidden": "true",
  fill: "none",
  "stroke-width": "5"
}, re = ["stroke-dasharray"], de = ["stroke-dasharray", "stroke-dashoffset"], he = { class: "donut-center" }, _e = { class: "card total-card" }, ve = { class: "total-head" }, pe = { class: "stat-label" }, me = { class: "big" }, ge = ["aria-label"], ke = { class: "legend" }, be = { class: "lg" }, ye = { class: "lg" }, fe = { class: "mini-stack" }, we = { class: "mini" }, $e = { class: "mini" }, xe = { class: "mini" }, Me = { class: "panel" }, Te = { class: "panel-head" }, Ne = {
  key: 0,
  class: "panel-note"
}, Ce = {
  key: 0,
  class: "empty"
}, Ee = {
  key: 1,
  class: "chart"
}, Le = { class: "bars" }, Se = {
  class: "grid",
  "aria-hidden": "true"
}, De = ["title"], Be = { class: "axis" }, Pe = { class: "panel" }, qe = { class: "panel-head" }, Ue = { class: "panel-note" }, je = {
  key: 0,
  class: "empty"
}, Fe = {
  key: 1,
  class: "model-table-wrap"
}, He = { class: "model-table" }, Ve = { scope: "col" }, Ae = {
  scope: "col",
  class: "num"
}, Ie = {
  scope: "col",
  class: "num"
}, Re = {
  scope: "col",
  class: "num"
}, Oe = {
  scope: "col",
  class: "num"
}, Ze = {
  scope: "col",
  class: "num"
}, Ye = { class: "cell-model" }, ze = { class: "num" }, Ge = { class: "share-cell" }, Ke = { class: "share-track" }, Je = { class: "num" }, Qe = { class: "num" }, We = { class: "num" }, Xe = { class: "num" }, es = /* @__PURE__ */ Z({
  __name: "UsagePage",
  setup(T) {
    const { t: o } = G(), { confirm: y } = K(), r = x(null), h = x(!1), _ = x(""), k = x("");
    let N;
    const S = ["#5944c6", "#9b405e", "#27633e", "#8a5a00", "#1a6fb4", "#7b4bb7", "#0d8a5f", "#b5473c"];
    async function f(l = !1) {
      l || (h.value = !0, _.value = "");
      try {
        const s = await fetch("/api/usage");
        if (!s.ok) throw new Error(`HTTP ${s.status}`);
        r.value = await s.json();
      } catch (s) {
        l || (_.value = s?.message || o("usage.loadFailed"));
      } finally {
        h.value = !1;
      }
    }
    async function j() {
      if (await y({
        title: o("usage.clear"),
        message: o("usage.clearConfirm"),
        confirmLabel: o("usage.clear"),
        danger: !0
      })) {
        _.value = "", k.value = "";
        try {
          const s = await fetch("/api/usage", { method: "DELETE" });
          if (!s.ok) throw new Error(`HTTP ${s.status}`);
          k.value = o("usage.cleared"), await f(), setTimeout(() => {
            k.value = "";
          }, 2e3);
        } catch (s) {
          _.value = s?.message || o("usage.loadFailed");
        }
      }
    }
    const w = d(() => {
      const l = r.value?.by_model || {};
      return Object.entries(l).map(([s, a], O) => ({ model: s, ...a, color: S[O % S.length] })).sort((s, a) => (a.total || 0) - (s.total || 0));
    }), F = d(() => {
      const l = r.value?.by_day || {};
      return Object.entries(l).map(([s, a]) => ({ day: s, ...a })).sort((s, a) => s.day < a.day ? 1 : -1).slice(0, 14);
    }), v = d(() => [...F.value].reverse()), D = d(() => Math.max(1, ...v.value.map((l) => l.total || 0))), H = d(() => Math.max(1, ...w.value.map((l) => l.total || 0))), C = d(() => v.value.reduce((l, s) => s.total > (l?.total || 0) ? s : l, v.value[0] || null)), V = [0.25, 0.5, 0.75, 1], p = d(() => Number(r.value?.total_tokens || 0)), B = d(() => Number(r.value?.total_prompt_tokens || 0)), A = d(() => Number(r.value?.total_completion_tokens || 0)), m = d(() => p.value ? Math.round(B.value / p.value * 100) : 0), $ = d(() => p.value ? 100 - m.value : 0), I = d(() => {
      const l = Number(r.value?.request_count || 0);
      return l ? Math.round(p.value / l) : 0;
    });
    function u(l) {
      return Number(l || 0).toLocaleString();
    }
    function E(l) {
      const s = Number(l || 0);
      return s >= 1e6 ? `${(s / 1e6).toFixed(s >= 1e7 ? 0 : 1)}M` : s >= 1e3 ? `${(s / 1e3).toFixed(s >= 1e4 ? 0 : 1)}k` : String(s);
    }
    function R(l) {
      return `${Math.max(3, Math.round(Number(l || 0) / D.value * 100))}%`;
    }
    function P(l) {
      return `${Math.max(3, Math.round(Number(l || 0) / H.value * 100))}%`;
    }
    function q(l) {
      const s = new Date(l);
      return Number.isNaN(s.getTime()) ? l.slice(5) : `${s.getMonth() + 1}/${s.getDate()}`;
    }
    return Y(() => {
      f(), N = window.setInterval(() => {
        document.hidden || f(!0);
      }, 15e3);
    }), z(() => {
      N && window.clearInterval(N);
    }), (l, s) => (c(), i("div", J, [
      e("header", Q, [
        e("div", W, [
          s[1] || (s[1] = e("p", { class: "eyebrow page-eyebrow" }, "0KAY · USAGE", -1)),
          e("h1", null, t(n(o)("usage.title")), 1),
          e("p", X, t(n(o)("usage.subtitle")), 1)
        ]),
        e("div", ee, [
          e("button", {
            class: "btn btn-tonal",
            disabled: h.value,
            onClick: s[0] || (s[0] = (a) => f())
          }, t(n(o)("memory.refresh")), 9, se),
          e("button", {
            class: "btn btn-danger-tonal",
            disabled: h.value,
            onClick: j
          }, t(n(o)("usage.clear")), 9, te)
        ])
      ]),
      _.value ? (c(), i("div", oe, t(_.value), 1)) : L("", !0),
      k.value ? (c(), i("div", ae, t(k.value), 1)) : L("", !0),
      h.value && !r.value ? (c(), i("div", le, [...s[2] || (s[2] = [
        e("div", { class: "skeleton sk-donut" }, null, -1),
        e("div", { class: "skeleton sk-card" }, null, -1),
        e("div", { class: "skeleton sk-card" }, null, -1)
      ])])) : (c(), i(b, { key: 3 }, [
        e("section", ne, [
          e("article", ce, [
            e("div", ie, [
              (c(), i("svg", ue, [
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
                  "stroke-dasharray": `${m.value} 100`
                }, null, 8, re),
                e("circle", {
                  class: "donut-completion",
                  cx: "21",
                  cy: "21",
                  r: "15.9",
                  pathLength: "100",
                  "stroke-dasharray": `${$.value} 100`,
                  "stroke-dashoffset": -m.value
                }, null, 8, de)
              ])),
              e("div", he, [
                e("b", null, t(E(p.value)), 1),
                e("span", null, t(n(o)("usage.totalTokens")), 1)
              ])
            ])
          ]),
          e("article", _e, [
            e("div", ve, [
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
                e("span", pe, t(n(o)("usage.totalTokens")), 1),
                e("b", me, t(u(p.value)), 1)
              ])
            ]),
            e("div", {
              class: "compose",
              role: "img",
              "aria-label": n(o)("usage.composeAria", { prompt: m.value, completion: $.value })
            }, [
              e("span", {
                class: "seg prompt",
                style: g({ width: `${m.value}%` })
              }, null, 4),
              e("span", {
                class: "seg completion",
                style: g({ width: `${$.value}%` })
              }, null, 4)
            ], 8, ge),
            e("div", ke, [
              e("span", be, [
                s[5] || (s[5] = e("i", { class: "dot prompt" }, null, -1)),
                U(t(n(o)("usage.promptTokens")), 1),
                e("b", null, t(u(B.value)), 1),
                e("small", null, t(m.value) + "%", 1)
              ]),
              e("span", ye, [
                s[6] || (s[6] = e("i", { class: "dot completion" }, null, -1)),
                U(t(n(o)("usage.completionTokens")), 1),
                e("b", null, t(u(A.value)), 1),
                e("small", null, t($.value) + "%", 1)
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
                e("b", null, t(u(r.value?.session_count)), 1),
                e("span", null, t(n(o)("usage.sessions")), 1)
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
                e("b", null, t(u(r.value?.request_count)), 1),
                e("span", null, t(n(o)("usage.requests")), 1)
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
                e("b", null, t(u(I.value)), 1),
                e("span", null, t(n(o)("usage.tokensPerRequest")), 1)
              ])
            ])
          ])
        ]),
        e("section", Me, [
          e("div", Te, [
            e("h2", null, t(n(o)("usage.byDay")), 1),
            C.value ? (c(), i("span", Ne, t(n(o)("usage.peak", { label: q(C.value.day), value: E(C.value.total) })), 1)) : L("", !0)
          ]),
          v.value.length === 0 ? (c(), i("div", Ce, t(n(o)("usage.empty")), 1)) : (c(), i("div", Ee, [
            e("div", Le, [
              e("div", Se, [
                (c(), i(b, null, M(V, (a) => e("span", {
                  key: a,
                  style: g({ bottom: `${a * 100}%` })
                }, [
                  e("i", null, t(E(D.value * a)), 1)
                ], 4)), 64))
              ]),
              (c(!0), i(b, null, M(v.value, (a) => (c(), i("div", {
                key: a.day,
                class: "col",
                title: `${a.day} · ${n(o)("usage.totalTokens")} ${u(a.total)} · ${n(o)("usage.promptTokens")} ${u(a.prompt)} · ${n(o)("usage.completionTokens")} ${u(a.completion)} · #${u(a.count)}`
              }, [
                e("div", {
                  class: "col-bar",
                  style: g({ transform: `scaleY(${R(a.total)})` })
                }, null, 4)
              ], 8, De))), 128))
            ]),
            e("div", Be, [
              (c(!0), i(b, null, M(v.value, (a) => (c(), i("span", {
                key: a.day
              }, t(q(a.day)), 1))), 128))
            ])
          ]))
        ]),
        e("section", Pe, [
          e("div", qe, [
            e("h2", null, t(n(o)("usage.byModel")), 1),
            e("span", Ue, t(n(o)("usage.modelsCount", { n: w.value.length })), 1)
          ]),
          w.value.length === 0 ? (c(), i("div", je, t(n(o)("usage.empty")), 1)) : (c(), i("div", Fe, [
            e("table", He, [
              e("thead", null, [
                e("tr", null, [
                  e("th", Ve, t(n(o)("usage.colModel")), 1),
                  e("th", Ae, t(n(o)("usage.colShare")), 1),
                  e("th", Ie, t(n(o)("usage.tokens")), 1),
                  e("th", Re, t(n(o)("usage.promptTokens")), 1),
                  e("th", Oe, t(n(o)("usage.completionTokens")), 1),
                  e("th", Ze, t(n(o)("usage.requestsSuffix")), 1)
                ])
              ]),
              e("tbody", null, [
                (c(!0), i(b, null, M(w.value, (a) => (c(), i("tr", {
                  key: a.model
                }, [
                  e("td", Ye, [
                    e("span", {
                      class: "row-dot",
                      style: g({ background: a.color }),
                      "aria-hidden": "true"
                    }, null, 4),
                    e("code", null, t(a.model), 1)
                  ]),
                  e("td", ze, [
                    e("span", Ge, [
                      e("span", Ke, [
                        e("span", {
                          class: "share-fill",
                          style: g({ width: P(a.total), background: a.color })
                        }, null, 4)
                      ]),
                      e("b", null, t(P(a.total)), 1)
                    ])
                  ]),
                  e("td", Je, [
                    e("b", null, t(u(a.total)), 1)
                  ]),
                  e("td", Qe, t(u(a.prompt)), 1),
                  e("td", We, t(u(a.completion)), 1),
                  e("td", Xe, t(u(a.count)), 1)
                ]))), 128))
              ])
            ])
          ]))
        ])
      ], 64))
    ]));
  }
}), ss = (T, o) => {
  const y = T.__vccOpts || T;
  for (const [r, h] of o)
    y[r] = h;
  return y;
}, ls = /* @__PURE__ */ ss(es, [["__scopeId", "data-v-045cecd9"]]);
export {
  ls as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style-usage')){const s=document.createElement('style');s.id='webui-plugin-style-usage';s.textContent=".usage-page[data-v-045cecd9]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-045cecd9]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.hero-actions[data-v-045cecd9]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-045cecd9]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-045cecd9]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-045cecd9]{background:var(--md-success-container);color:var(--md-on-success-container)}.overview[data-v-045cecd9]{display:grid;grid-template-columns:minmax(min(220px,100%),.9fr) minmax(min(280px,100%),1.5fr) minmax(min(200px,100%),1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-045cecd9]{background:var(--md-surface-container-lowest, #ffffff);border:1px solid color-mix(in srgb,var(--md-outline-variant) 70%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-045cecd9 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-045cecd9]{display:grid;place-items:center}.donut[data-v-045cecd9]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-045cecd9]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-045cecd9]{fill:none;stroke-width:5}.donut-track[data-v-045cecd9]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-045cecd9]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-045cecd9]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-045cecd9]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-045cecd9]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-045cecd9]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-045cecd9]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-045cecd9]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-045cecd9]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-045cecd9]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-045cecd9]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-045cecd9]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-045cecd9]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-045cecd9]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-045cecd9]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-045cecd9]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-045cecd9]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-045cecd9]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-045cecd9]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-045cecd9]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-045cecd9]{background:var(--md-primary)}.dot.completion[data-v-045cecd9]{background:var(--md-tertiary)}.mini-stack[data-v-045cecd9]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-045cecd9]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-045cecd9 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-045cecd9]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-045cecd9]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-045cecd9]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-045cecd9]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-045cecd9]{background:var(--md-surface-container-lowest, #ffffff);border:1px solid color-mix(in srgb,var(--md-outline-variant) 70%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-045cecd9 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-045cecd9]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-045cecd9]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-045cecd9]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-045cecd9]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-045cecd9]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-045cecd9]{position:absolute;inset:0}.grid span[data-v-045cecd9]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-045cecd9]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-045cecd9]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-045cecd9]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-045cecd9]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-045cecd9]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-045cecd9]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-table-wrap[data-v-045cecd9]{overflow-x:auto;border-radius:18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.model-table[data-v-045cecd9]{width:100%;border-collapse:collapse;font-size:13px}.model-table th[data-v-045cecd9],.model-table td[data-v-045cecd9]{padding:10px 14px;text-align:left;white-space:nowrap}.model-table thead th[data-v-045cecd9]{position:sticky;top:0;z-index:1;font:700 11px/1 var(--font-family);letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-bottom:1px solid var(--md-outline-variant)}.model-table tbody tr[data-v-045cecd9]{border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.model-table tbody tr[data-v-045cecd9]:last-child{border-bottom:none}@media(hover:hover)and (pointer:fine){.model-table tbody tr[data-v-045cecd9]:hover{background:color-mix(in srgb,var(--md-primary) 6%,transparent)}}.model-table .num[data-v-045cecd9]{text-align:right;font-variant-numeric:tabular-nums}.cell-model[data-v-045cecd9]{display:flex;align-items:center;gap:9px;min-width:180px}.cell-model code[data-v-045cecd9]{font:700 12.5px/1.35 ui-monospace,monospace;overflow-wrap:anywhere;white-space:normal}.row-dot[data-v-045cecd9]{width:9px;height:9px;border-radius:3px;flex-shrink:0}.share-cell[data-v-045cecd9]{display:inline-flex;align-items:center;gap:8px;justify-content:flex-end;width:100%}.share-cell b[data-v-045cecd9]{font-variant-numeric:tabular-nums;min-width:38px;text-align:right}.share-track[data-v-045cecd9]{width:72px;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.share-fill[data-v-045cecd9]{display:block;height:100%;border-radius:999px;transition:width var(--duration-long) var(--ease-spring)}.empty[data-v-045cecd9]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}.usage-loading[data-v-045cecd9]{display:grid;grid-template-columns:minmax(220px,.9fr) 1.5fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-xl)}.skeleton[data-v-045cecd9]{border-radius:32px;background:var(--md-surface-container-low);min-height:180px;animation:sk-shimmer-045cecd9 1.4s ease-in-out infinite}.sk-donut[data-v-045cecd9]{min-height:220px}@keyframes sk-shimmer-045cecd9{0%,to{opacity:1}50%{opacity:.55}}@media(max-width:980px){.usage-loading[data-v-045cecd9]{grid-template-columns:1fr 1fr}}@media(max-width:640px){.usage-loading[data-v-045cecd9]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.skeleton[data-v-045cecd9]{animation:none;opacity:.7}}@keyframes up-045cecd9{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-045cecd9]{grid-template-columns:1fr 1fr}.mini-stack[data-v-045cecd9]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-045cecd9],.mini-stack[data-v-045cecd9]{grid-template-columns:1fr}.chart[data-v-045cecd9]{height:200px;padding-left:34px}.grid span i[data-v-045cecd9]{left:-34px;width:28px}.axis span[data-v-045cecd9]{font-size:11px}}@media(max-width:560px){.axis span[data-v-045cecd9]{font-size:10px}.axis span[data-v-045cecd9]:nth-child(2n){visibility:hidden}}\n";document.head.appendChild(s)}})();
