import { defineComponent as ue, ref as f, computed as x, onMounted as de, onBeforeUnmount as pe, openBlock as i, createElementBlock as c, createElementVNode as l, toDisplayString as n, unref as u, Fragment as k, renderList as w, normalizeClass as M, createTextVNode as Y, createCommentVNode as R, withDirectives as Q, vModelText as ve, vModelCheckbox as fe, createVNode as _e, Transition as me, withCtx as he, normalizeStyle as ge } from "vue";
import { useI18n as be } from "vue-i18n";
import { useConfirm as ye, apiGet as Z, streamSSE as ke, apiPut as we, apiPost as Ce } from "@0kay/host";
const Se = { class: "console" }, xe = { class: "page-hero console-hero" }, Le = { class: "console-bar" }, Te = ["aria-label"], $e = ["aria-selected", "onClick"], Oe = {
  key: 0,
  class: "tab-badge"
}, Pe = { class: "controls" }, Ne = { class: "field" }, Ee = { class: "field-label" }, Me = ["value", "aria-label"], Re = ["value"], Fe = { class: "field grow" }, Ie = { class: "field-label" }, Ue = ["placeholder", "aria-label"], Ve = { class: "check" }, Ae = ["disabled"], Be = {
  key: 0,
  class: "banner",
  role: "alert"
}, De = {
  key: 0,
  class: "empty"
}, He = ["aria-label"], je = { class: "ts" }, qe = { class: "lvl" }, ze = { class: "component" }, Ge = { class: "msg" }, Je = { class: "k" }, We = { class: "v" }, Ke = ["title", "onClick"], Xe = {
  key: 0,
  class: "empty"
}, Ye = ["aria-label"], Qe = { class: "lvl" }, Ze = { class: "component" }, et = { class: "msg" }, tt = { class: "k" }, st = { class: "v" }, lt = {
  key: 0,
  class: "err"
}, nt = ["title"], ot = { class: "dur" }, at = ["title", "onClick"], ee = 1e3, rt = /* @__PURE__ */ ue({
  __name: "ConsolePage",
  setup(F) {
    const { t: o } = be(), { confirm: O } = ye(), h = f("logs"), p = f([]), y = f([]), _ = f("INFO"), m = f(""), L = f(!0), T = f(!1), v = f(""), I = f(!1), P = f(null);
    let C = null;
    const D = ["DEBUG", "INFO", "WARN", "ERROR"];
    function N(e) {
      const s = D.indexOf(String(e).toUpperCase());
      return s === -1 ? 1 : s;
    }
    const H = (e) => String(e || "").toLowerCase();
    function te(e) {
      const s = new Date(e);
      if (Number.isNaN(s.getTime())) return String(e);
      const t = (a, d = 2) => String(a).padStart(d, "0");
      return `${t(s.getHours())}:${t(s.getMinutes())}:${t(s.getSeconds())}.${t(s.getMilliseconds(), 3)}`;
    }
    function j(e) {
      return !e || e < 0 ? "—" : e < 1e3 ? `${e}ns` : e < 1e6 ? `${(e / 1e3).toFixed(0)}µs` : e < 1e9 ? `${(e / 1e6).toFixed(1)}ms` : `${(e / 1e9).toFixed(2)}s`;
    }
    function U(e) {
      if (!e) return null;
      try {
        return JSON.parse(e);
      } catch {
        return null;
      }
    }
    function q(e) {
      return e.fields ? Object.entries(e.fields).filter(
        ([s]) => s !== "time" && s !== "level" && s !== "msg" && s !== "component" && s !== "trace_id" && s !== "span"
      ) : [];
    }
    const z = (e) => e.fields && typeof e.fields.component == "string" ? e.fields.component : e.source || "—", se = x(() => N(_.value)), G = x(() => {
      const e = se.value, s = m.value.trim().toLowerCase();
      return p.value.filter((t) => N(t.level) < e ? !1 : s ? t.message.toLowerCase().includes(s) || (t.trace_id || "").includes(s) || z(t).toLowerCase().includes(s) || q(t).some(([, a]) => String(a).toLowerCase().includes(s)) : !0);
    }), V = x(() => {
      const e = m.value.trim().toLowerCase(), s = [...y.value].reverse();
      return e ? s.filter(
        (t) => t.name.toLowerCase().includes(e) || t.trace_id.includes(e) || (t.error || "").toLowerCase().includes(e) || Object.entries(t.attrs || {}).some(([, a]) => a.toLowerCase().includes(e))
      ) : s;
    }), J = x(() => p.value.filter((e) => N(e.level) >= N("ERROR")).length), le = x(() => {
      const e = /* @__PURE__ */ new Map(), s = [], t = new Set(V.value.map((r) => r.span_id));
      for (const r of V.value) {
        const b = r.parent_id && t.has(r.parent_id) ? r.parent_id : "";
        if (!b) {
          s.push(r);
          continue;
        }
        const S = e.get(b);
        S ? S.push(r) : e.set(b, [r]);
      }
      const a = [], d = (r, b) => {
        a.push({ span: r, depth: b });
        for (const S of e.get(r.span_id) || []) d(S, b + 1);
      };
      for (const r of s.sort((b, S) => b.start_unix_nano - S.start_unix_nano)) d(r, 0);
      return a;
    }), ne = x(() => {
      const e = /* @__PURE__ */ new Map();
      for (const s of y.value) {
        const t = e.get(s.trace_id) || 0, a = s.start_unix_nano + s.duration_ns;
        e.set(s.trace_id, Math.max(t, a) - Math.min(t || a, s.start_unix_nano));
      }
      return e;
    });
    function oe(e) {
      p.value.push(e), p.value.length > ee && p.value.splice(0, p.value.length - ee), A();
    }
    function ae(e) {
      const s = y.value.findIndex((t) => t.span_id === e.span_id);
      s !== -1 && y.value.splice(s, 1), y.value.push(e), A();
    }
    function A() {
      if (!L.value || h.value !== "logs") return;
      const e = P.value;
      e && (e.scrollTop = e.scrollHeight);
    }
    function W() {
      const e = P.value;
      if (!e) return;
      e.scrollHeight - e.scrollTop - e.clientHeight < 24 && !L.value && (L.value = !0);
    }
    async function B() {
      I.value = !0;
      try {
        const e = new URLSearchParams({ limit: "500", level: _.value });
        m.value.trim() && e.set("q", m.value.trim());
        const [s, t] = await Promise.all([
          Z(`/api/console/logs?${e}`),
          Z("/api/console/spans?limit=500")
        ]);
        s && (_.value = s.level || _.value, p.value = s.logs || []), t && (y.value = t.spans || []), v.value = "";
      } catch (e) {
        v.value = String(e);
      } finally {
        I.value = !1;
      }
    }
    let $ = 0, g = null, K = !1;
    async function E() {
      C?.abort();
      const e = new AbortController();
      C = e;
      const s = new URLSearchParams({ limit: "200", level: _.value });
      m.value.trim() && s.set("q", m.value.trim()), T.value = !1;
      try {
        await ke(
          `/api/console/stream?${s}`,
          ({ event: a, data: d }) => {
            if (T.value = !0, v.value = "", $ = 0, a === "log") {
              const r = U(d);
              r && oe(r);
            } else if (a === "span") {
              const r = U(d);
              r && ae(r);
            } else if (a === "ready") {
              const r = U(d);
              r?.level && (_.value = r.level);
            }
          },
          e.signal
        );
      } catch (a) {
        e.signal.aborted || (v.value = String(a));
      } finally {
        C === e && (T.value = !1);
      }
      if (K || e.signal.aborted || C !== e) return;
      g && clearTimeout(g);
      const t = Math.min(1e3 * 2 ** $, 3e4);
      $ = Math.min($ + 1, 6), g = setTimeout(() => {
        g = null, E();
      }, t);
    }
    function re() {
      g && clearTimeout(g), $ = 0, E();
    }
    async function ie(e) {
      _.value = e;
      try {
        const s = await we("/api/console/level", { level: e });
        s?.level && (_.value = s.level);
      } catch (s) {
        v.value = String(s);
      }
      await B(), await E();
    }
    async function ce() {
      if (await O({
        title: o("console.clear"),
        message: o("console.clearConfirm"),
        confirmLabel: o("console.clear"),
        danger: !0
      }))
        try {
          await Ce("/api/console/clear"), p.value = [], y.value = [];
        } catch (s) {
          v.value = String(s);
        }
    }
    function X(e) {
      m.value = e, h.value = "traces";
    }
    return de(async () => {
      await B(), await E(), A();
    }), pe(() => {
      K = !0, g && clearTimeout(g), C?.abort(), C = null;
    }), (e, s) => (i(), c("section", Se, [
      l("header", xe, [
        l("div", null, [
          s[5] || (s[5] = l("p", { class: "page-eyebrow" }, "0KAY · CONSOLE", -1)),
          l("h1", null, n(u(o)("console.title")), 1)
        ])
      ]),
      l("header", Le, [
        l("div", {
          class: "tabs",
          role: "tablist",
          "aria-label": u(o)("console.tabsLabel")
        }, [
          (i(), c(k, null, w(["logs", "traces"], (t) => l("button", {
            key: t,
            role: "tab",
            type: "button",
            class: M(["tab", { active: h.value === t }]),
            "aria-selected": h.value === t,
            onClick: (a) => h.value = t
          }, [
            Y(n(u(o)(`console.tab.${t}`)) + " ", 1),
            t === "logs" && J.value ? (i(), c("span", Oe, n(J.value), 1)) : R("", !0)
          ], 10, $e)), 64))
        ], 8, Te),
        l("div", Pe, [
          l("label", Ne, [
            l("span", Ee, n(u(o)("console.level")), 1),
            l("select", {
              class: "input",
              value: _.value,
              "aria-label": u(o)("console.level"),
              onChange: s[0] || (s[0] = (t) => ie(t.target.value))
            }, [
              (i(), c(k, null, w(D, (t) => l("option", {
                key: t,
                value: t
              }, n(t), 9, Re)), 64))
            ], 40, Me)
          ]),
          l("label", Fe, [
            l("span", Ie, n(u(o)("console.search")), 1),
            Q(l("input", {
              "onUpdate:modelValue": s[1] || (s[1] = (t) => m.value = t),
              class: "input",
              type: "search",
              placeholder: u(o)("console.searchPlaceholder"),
              "aria-label": u(o)("console.search")
            }, null, 8, Ue), [
              [ve, m.value]
            ])
          ]),
          l("label", Ve, [
            Q(l("input", {
              "onUpdate:modelValue": s[2] || (s[2] = (t) => L.value = t),
              type: "checkbox"
            }, null, 512), [
              [fe, L.value]
            ]),
            l("span", null, n(u(o)("console.follow")), 1)
          ]),
          l("button", {
            type: "button",
            class: "btn",
            disabled: I.value,
            onClick: s[3] || (s[3] = (t) => B())
          }, n(u(o)("console.refresh")), 9, Ae),
          l("button", {
            type: "button",
            class: "btn",
            onClick: s[4] || (s[4] = (t) => ce())
          }, n(u(o)("console.clear")), 1),
          l("span", {
            class: M(["status", { live: T.value, dead: !!v.value }])
          }, [
            s[6] || (s[6] = l("span", {
              class: "dot",
              "aria-hidden": "true"
            }, null, -1)),
            Y(" " + n(v.value ? u(o)("console.disconnected") : T.value ? u(o)("console.live") : u(o)("console.connecting")), 1)
          ], 2)
        ])
      ]),
      v.value ? (i(), c("p", Be, [
        l("span", null, n(u(o)("console.streamError")), 1),
        l("code", null, n(v.value), 1),
        l("button", {
          type: "button",
          class: "btn",
          onClick: re
        }, n(u(o)("console.reconnect")), 1)
      ])) : R("", !0),
      _e(me, {
        name: "pane",
        mode: "out-in"
      }, {
        default: he(() => [
          h.value === "logs" ? (i(), c("div", {
            key: "logs",
            ref_key: "pane",
            ref: P,
            class: "pane",
            role: "tabpanel",
            onScrollPassive: W
          }, [
            G.value.length ? (i(), c("ol", {
              key: 1,
              class: "rows",
              "aria-label": u(o)("console.tab.logs")
            }, [
              (i(!0), c(k, null, w(G.value, (t, a) => (i(), c("li", {
                key: `${t.time}-${a}`,
                class: M(["row", H(t.level)])
              }, [
                l("time", je, n(te(t.time)), 1),
                l("span", qe, n(t.level), 1),
                l("span", ze, n(z(t)), 1),
                l("span", Ge, n(t.message), 1),
                (i(!0), c(k, null, w(q(t), ([d, r]) => (i(), c("span", {
                  key: d,
                  class: "kv"
                }, [
                  l("span", Je, n(d) + "=", 1),
                  l("span", We, n(String(r)), 1)
                ]))), 128)),
                t.trace_id ? (i(), c("button", {
                  key: 0,
                  type: "button",
                  class: "link trace",
                  title: u(o)("console.showTrace"),
                  onClick: (d) => X(t.trace_id)
                }, n(t.trace_id.slice(0, 8)), 9, Ke)) : R("", !0)
              ], 2))), 128))
            ], 8, He)) : (i(), c("p", De, n(u(o)("console.noLogs")), 1))
          ], 544)) : (i(), c("div", {
            key: 1,
            ref_key: "pane",
            ref: P,
            class: "pane",
            role: "tabpanel",
            onScrollPassive: W
          }, [
            V.value.length ? (i(), c("ol", {
              key: 1,
              class: "rows",
              "aria-label": u(o)("console.tab.traces")
            }, [
              (i(!0), c(k, null, w(le.value, (t) => (i(), c("li", {
                key: t.span.span_id,
                class: M(["row span", [H(t.span.status), t.span.kind]])
              }, [
                l("span", {
                  class: "indent",
                  style: ge({ width: t.depth * 14 + "px" }),
                  "aria-hidden": "true"
                }, null, 4),
                l("span", Qe, n(t.span.kind), 1),
                l("span", Ze, n(t.span.name), 1),
                l("span", et, [
                  (i(!0), c(k, null, w(Object.entries(t.span.attrs || {}), ([a, d]) => (i(), c("span", {
                    key: a,
                    class: "kv"
                  }, [
                    l("span", tt, n(a) + "=", 1),
                    l("span", st, n(d), 1)
                  ]))), 128)),
                  t.span.error ? (i(), c("span", lt, n(t.span.error), 1)) : R("", !0)
                ]),
                (i(!0), c(k, null, w(t.span.events || [], (a, d) => (i(), c("span", {
                  key: d,
                  class: "event",
                  title: JSON.stringify(a.attrs || {})
                }, n(a.name), 9, nt))), 128)),
                l("span", ot, n(j(t.span.duration_ns)), 1),
                l("button", {
                  type: "button",
                  class: "link trace",
                  title: u(o)("console.totalTrace"),
                  onClick: (a) => X(t.span.trace_id)
                }, n(j(ne.value.get(t.span.trace_id) || 0)), 9, at)
              ], 2))), 128))
            ], 8, Ye)) : (i(), c("p", Xe, n(u(o)("console.noSpans")), 1))
          ], 544))
        ]),
        _: 1
      })
    ]));
  }
}), it = (F, o) => {
  const O = F.__vccOpts || F;
  for (const [h, p] of o)
    O[h] = p;
  return O;
}, pt = /* @__PURE__ */ it(rt, [["__scopeId", "data-v-3e2ea946"]]);
export {
  pt as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".console[data-v-3e2ea946]{display:flex;flex-direction:column;min-height:0;height:100%;background:var(--md-surface);color:var(--md-on-surface)}.pane-enter-active[data-v-3e2ea946]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel)}.pane-leave-active[data-v-3e2ea946]{transition:opacity var(--duration-instant) var(--ease-emphasized-accel)}.pane-enter-from[data-v-3e2ea946],.pane-leave-to[data-v-3e2ea946]{opacity:0}@media(prefers-reduced-motion:reduce){.pane-enter-active[data-v-3e2ea946],.pane-leave-active[data-v-3e2ea946]{transition-duration:1ms}}.console-hero[data-v-3e2ea946]{margin-bottom:4px}.console-bar[data-v-3e2ea946]{display:flex;flex-wrap:wrap;align-items:flex-end;gap:var(--space-md);padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.tabs[data-v-3e2ea946]{display:flex;gap:var(--space-xs)}.tab[data-v-3e2ea946]{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:0 14px;border:0;border-radius:var(--radius-full);background:transparent;color:var(--md-on-surface-variant);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}.tab[data-v-3e2ea946]:hover{background:color-mix(in srgb,var(--md-on-surface) 7%,transparent)}.tab.active[data-v-3e2ea946]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tab[data-v-3e2ea946]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.tab-badge[data-v-3e2ea946]{min-width:18px;padding:0 5px;border-radius:var(--radius-full);background:var(--md-error-container);color:var(--md-on-error-container);font-size:11px;font-weight:700;text-align:center}.controls[data-v-3e2ea946]{display:flex;flex:1;flex-wrap:wrap;align-items:flex-end;gap:var(--space-sm)}.field[data-v-3e2ea946]{display:flex;flex-direction:column;gap:2px}.field.grow[data-v-3e2ea946]{flex:1;min-width:180px}.field-label[data-v-3e2ea946]{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant)}.input[data-v-3e2ea946]{min-height:34px;padding:0 10px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-sm);background:var(--md-surface-container-lowest);color:inherit;font:inherit;font-size:13px}.input[data-v-3e2ea946]:focus-visible{outline:2px solid var(--md-primary);outline-offset:1px}.check[data-v-3e2ea946]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap}.btn[data-v-3e2ea946]{min-height:34px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast)}.btn[data-v-3e2ea946]:hover:not(:disabled){background:var(--md-surface-container-high)}.btn[data-v-3e2ea946]:disabled{opacity:.5;cursor:default}.btn[data-v-3e2ea946]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.status[data-v-3e2ea946]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);white-space:nowrap}.status .dot[data-v-3e2ea946]{width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.status.live .dot[data-v-3e2ea946]{background:var(--md-success);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-success) 22%,transparent)}.status.dead .dot[data-v-3e2ea946]{background:var(--md-error)}.banner[data-v-3e2ea946]{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-sm);margin:0;padding:var(--space-sm) var(--space-lg);background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px}.banner code[data-v-3e2ea946]{flex:1;min-width:0;overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.pane[data-v-3e2ea946]{flex:1;min-height:0;overflow:auto}.empty[data-v-3e2ea946]{padding:var(--space-xl);color:var(--md-on-surface-variant);font-size:13px}.rows[data-v-3e2ea946]{margin:0;padding:0;list-style:none;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,monospace;font-size:12px;line-height:1.55}.row[data-v-3e2ea946]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;padding:3px var(--space-lg);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.row[data-v-3e2ea946]:hover{background:color-mix(in srgb,var(--md-on-surface) 4%,transparent)}.row[data-v-3e2ea946]:before{content:\"\";width:3px;align-self:stretch;margin:1px 0;border-radius:2px;background:var(--md-outline)}.row.debug[data-v-3e2ea946]:before{background:var(--md-outline)}.row.info[data-v-3e2ea946]:before{background:var(--md-primary)}.row.warn[data-v-3e2ea946]:before{background:var(--md-warning)}.row.error[data-v-3e2ea946]:before{background:var(--md-error)}.row.ok[data-v-3e2ea946]:before{background:var(--md-success)}.ts[data-v-3e2ea946]{color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.lvl[data-v-3e2ea946]{min-width:46px;font-weight:700;color:var(--md-on-surface-variant);white-space:nowrap}.row.warn .lvl[data-v-3e2ea946]{color:var(--md-warning)}.row.error .lvl[data-v-3e2ea946]{color:var(--md-error)}.component[data-v-3e2ea946]{min-width:96px;padding:0 6px;border-radius:var(--radius-sm);background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.msg[data-v-3e2ea946]{flex:1;min-width:200px;word-break:break-word}.kv[data-v-3e2ea946]{color:var(--md-on-surface-variant);white-space:nowrap}.kv .k[data-v-3e2ea946]{opacity:.7}.kv .v[data-v-3e2ea946]{color:var(--md-on-surface)}.err[data-v-3e2ea946]{color:var(--md-error)}.event[data-v-3e2ea946]{padding:0 6px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.dur[data-v-3e2ea946]{margin-left:auto;color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.indent[data-v-3e2ea946]{flex:none}.link[data-v-3e2ea946]{padding:0;border:0;background:none;color:var(--md-primary);font:inherit;font-size:11px;cursor:pointer;text-decoration:underline dotted}.link[data-v-3e2ea946]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}@media(max-width:720px){.console-bar[data-v-3e2ea946]{align-items:stretch}.controls[data-v-3e2ea946]{flex-direction:column;align-items:stretch}.component[data-v-3e2ea946],.lvl[data-v-3e2ea946]{min-width:0}}#app .console[data-v-3e2ea946] :is(.tab,.btn){min-height:34px;border-radius:var(--radius-full)}#app .console .input[data-v-3e2ea946]{min-height:34px;border-radius:var(--radius-sm)}\n";document.head.appendChild(s)}})();
