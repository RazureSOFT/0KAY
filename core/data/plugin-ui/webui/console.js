import { defineComponent as re, ref as f, computed as S, onMounted as ce, onBeforeUnmount as ie, openBlock as r, createElementBlock as c, createElementVNode as n, unref as i, Fragment as y, renderList as k, normalizeClass as T, createTextVNode as W, toDisplayString as o, createCommentVNode as N, withDirectives as X, vModelText as ue, vModelCheckbox as pe, createVNode as de, Transition as ve, withCtx as fe, normalizeStyle as _e } from "vue";
import { useI18n as me } from "vue-i18n";
import { useConfirm as he, apiGet as K, streamSSE as ge, apiPut as be, apiPost as ye } from "@0kay/host";
const ke = { class: "console" }, we = { class: "console-bar" }, Ce = ["aria-label"], Se = ["aria-selected", "onClick"], xe = {
  key: 0,
  class: "tab-badge"
}, Le = { class: "controls" }, $e = { class: "field" }, Pe = { class: "field-label" }, Oe = ["value", "aria-label"], Te = ["value"], Ne = { class: "field grow" }, Ee = { class: "field-label" }, Me = ["placeholder", "aria-label"], Re = { class: "check" }, Fe = ["disabled"], Ie = {
  key: 0,
  class: "banner",
  role: "alert"
}, Ue = {
  key: 0,
  class: "empty"
}, Ve = ["aria-label"], Be = { class: "ts" }, De = { class: "lvl" }, Ae = { class: "component" }, He = { class: "msg" }, je = { class: "k" }, qe = { class: "v" }, ze = ["title", "onClick"], Ge = {
  key: 0,
  class: "empty"
}, Je = ["aria-label"], We = { class: "lvl" }, Xe = { class: "component" }, Ke = { class: "msg" }, Qe = { class: "k" }, Ye = { class: "v" }, Ze = {
  key: 0,
  class: "err"
}, et = ["title"], tt = { class: "dur" }, st = ["title", "onClick"], Q = 1e3, nt = /* @__PURE__ */ re({
  __name: "ConsolePage",
  setup(E) {
    const { t: a } = me(), { confirm: L } = he(), h = f("logs"), d = f([]), b = f([]), _ = f("INFO"), m = f(""), x = f(!0), $ = f(!1), v = f(""), M = f(!1), P = f(null);
    let w = null;
    const B = ["DEBUG", "INFO", "WARN", "ERROR"];
    function O(e) {
      const s = B.indexOf(String(e).toUpperCase());
      return s === -1 ? 1 : s;
    }
    const D = (e) => String(e || "").toLowerCase();
    function Y(e) {
      const s = new Date(e);
      if (Number.isNaN(s.getTime())) return String(e);
      const t = (l, p = 2) => String(l).padStart(p, "0");
      return `${t(s.getHours())}:${t(s.getMinutes())}:${t(s.getSeconds())}.${t(s.getMilliseconds(), 3)}`;
    }
    function A(e) {
      return !e || e < 0 ? "—" : e < 1e3 ? `${e}ns` : e < 1e6 ? `${(e / 1e3).toFixed(0)}µs` : e < 1e9 ? `${(e / 1e6).toFixed(1)}ms` : `${(e / 1e9).toFixed(2)}s`;
    }
    function R(e) {
      if (!e) return null;
      try {
        return JSON.parse(e);
      } catch {
        return null;
      }
    }
    function H(e) {
      return e.fields ? Object.entries(e.fields).filter(
        ([s]) => s !== "time" && s !== "level" && s !== "msg" && s !== "component" && s !== "trace_id" && s !== "span"
      ) : [];
    }
    const j = (e) => e.fields && typeof e.fields.component == "string" ? e.fields.component : e.source || "—", Z = S(() => O(_.value)), q = S(() => {
      const e = Z.value, s = m.value.trim().toLowerCase();
      return d.value.filter((t) => O(t.level) < e ? !1 : s ? t.message.toLowerCase().includes(s) || (t.trace_id || "").includes(s) || j(t).toLowerCase().includes(s) || H(t).some(([, l]) => String(l).toLowerCase().includes(s)) : !0);
    }), F = S(() => {
      const e = m.value.trim().toLowerCase(), s = [...b.value].reverse();
      return e ? s.filter(
        (t) => t.name.toLowerCase().includes(e) || t.trace_id.includes(e) || (t.error || "").toLowerCase().includes(e) || Object.entries(t.attrs || {}).some(([, l]) => l.toLowerCase().includes(e))
      ) : s;
    }), z = S(() => d.value.filter((e) => O(e.level) >= O("ERROR")).length), ee = S(() => {
      const e = /* @__PURE__ */ new Map(), s = [], t = new Set(F.value.map((u) => u.span_id));
      for (const u of F.value) {
        const g = u.parent_id && t.has(u.parent_id) ? u.parent_id : "";
        if (!g) {
          s.push(u);
          continue;
        }
        const C = e.get(g);
        C ? C.push(u) : e.set(g, [u]);
      }
      const l = [], p = (u, g) => {
        l.push({ span: u, depth: g });
        for (const C of e.get(u.span_id) || []) p(C, g + 1);
      };
      for (const u of s.sort((g, C) => g.start_unix_nano - C.start_unix_nano)) p(u, 0);
      return l;
    }), te = S(() => {
      const e = /* @__PURE__ */ new Map();
      for (const s of b.value) {
        const t = e.get(s.trace_id) || 0, l = s.start_unix_nano + s.duration_ns;
        e.set(s.trace_id, Math.max(t, l) - Math.min(t || l, s.start_unix_nano));
      }
      return e;
    });
    function se(e) {
      d.value.push(e), d.value.length > Q && d.value.splice(0, d.value.length - Q), I();
    }
    function ne(e) {
      const s = b.value.findIndex((t) => t.span_id === e.span_id);
      s !== -1 && b.value.splice(s, 1), b.value.push(e), I();
    }
    function I() {
      if (!x.value || h.value !== "logs") return;
      const e = P.value;
      e && (e.scrollTop = e.scrollHeight);
    }
    function G() {
      const e = P.value;
      if (!e) return;
      e.scrollHeight - e.scrollTop - e.clientHeight < 24 && !x.value && (x.value = !0);
    }
    async function U() {
      M.value = !0;
      try {
        const e = new URLSearchParams({ limit: "500", level: _.value });
        m.value.trim() && e.set("q", m.value.trim());
        const [s, t] = await Promise.all([
          K(`/api/console/logs?${e}`),
          K("/api/console/spans?limit=500")
        ]);
        s && (_.value = s.level || _.value, d.value = s.logs || []), t && (b.value = t.spans || []), v.value = "";
      } catch (e) {
        v.value = String(e);
      } finally {
        M.value = !1;
      }
    }
    async function V() {
      w?.abort(), w = new AbortController();
      const e = new URLSearchParams({ limit: "200", level: _.value });
      m.value.trim() && e.set("q", m.value.trim()), $.value = !1;
      try {
        await ge(
          `/api/console/stream?${e}`,
          ({ event: s, data: t }) => {
            if ($.value = !0, v.value = "", s === "log") {
              const l = R(t);
              l && se(l);
            } else if (s === "span") {
              const l = R(t);
              l && ne(l);
            } else if (s === "ready") {
              const l = R(t);
              l?.level && (_.value = l.level);
            }
          },
          w.signal
        );
      } catch (s) {
        w?.signal.aborted || (v.value = String(s));
      }
    }
    function le() {
      V();
    }
    async function oe(e) {
      _.value = e;
      try {
        const s = await be("/api/console/level", { level: e });
        s?.level && (_.value = s.level);
      } catch (s) {
        v.value = String(s);
      }
      await U(), await V();
    }
    async function ae() {
      if (await L({
        title: a("console.clear"),
        message: a("console.clearConfirm"),
        confirmLabel: a("console.clear"),
        danger: !0
      }))
        try {
          await ye("/api/console/clear"), d.value = [], b.value = [];
        } catch (s) {
          v.value = String(s);
        }
    }
    function J(e) {
      m.value = e, h.value = "traces";
    }
    return ce(async () => {
      await U(), await V(), I();
    }), ie(() => {
      w?.abort(), w = null;
    }), (e, s) => (r(), c("section", ke, [
      n("header", we, [
        n("div", {
          class: "tabs",
          role: "tablist",
          "aria-label": i(a)("console.tabsLabel")
        }, [
          (r(), c(y, null, k(["logs", "traces"], (t) => n("button", {
            key: t,
            role: "tab",
            type: "button",
            class: T(["tab", { active: h.value === t }]),
            "aria-selected": h.value === t,
            onClick: (l) => h.value = t
          }, [
            W(o(i(a)(`console.tab.${t}`)) + " ", 1),
            t === "logs" && z.value ? (r(), c("span", xe, o(z.value), 1)) : N("", !0)
          ], 10, Se)), 64))
        ], 8, Ce),
        n("div", Le, [
          n("label", $e, [
            n("span", Pe, o(i(a)("console.level")), 1),
            n("select", {
              class: "input",
              value: _.value,
              "aria-label": i(a)("console.level"),
              onChange: s[0] || (s[0] = (t) => oe(t.target.value))
            }, [
              (r(), c(y, null, k(B, (t) => n("option", {
                key: t,
                value: t
              }, o(t), 9, Te)), 64))
            ], 40, Oe)
          ]),
          n("label", Ne, [
            n("span", Ee, o(i(a)("console.search")), 1),
            X(n("input", {
              "onUpdate:modelValue": s[1] || (s[1] = (t) => m.value = t),
              class: "input",
              type: "search",
              placeholder: i(a)("console.searchPlaceholder"),
              "aria-label": i(a)("console.search")
            }, null, 8, Me), [
              [ue, m.value]
            ])
          ]),
          n("label", Re, [
            X(n("input", {
              "onUpdate:modelValue": s[2] || (s[2] = (t) => x.value = t),
              type: "checkbox"
            }, null, 512), [
              [pe, x.value]
            ]),
            n("span", null, o(i(a)("console.follow")), 1)
          ]),
          n("button", {
            type: "button",
            class: "btn",
            disabled: M.value,
            onClick: s[3] || (s[3] = (t) => U())
          }, o(i(a)("console.refresh")), 9, Fe),
          n("button", {
            type: "button",
            class: "btn",
            onClick: s[4] || (s[4] = (t) => ae())
          }, o(i(a)("console.clear")), 1),
          n("span", {
            class: T(["status", { live: $.value, dead: !!v.value }])
          }, [
            s[5] || (s[5] = n("span", {
              class: "dot",
              "aria-hidden": "true"
            }, null, -1)),
            W(" " + o(v.value ? i(a)("console.disconnected") : $.value ? i(a)("console.live") : i(a)("console.connecting")), 1)
          ], 2)
        ])
      ]),
      v.value ? (r(), c("p", Ie, [
        n("span", null, o(i(a)("console.streamError")), 1),
        n("code", null, o(v.value), 1),
        n("button", {
          type: "button",
          class: "btn",
          onClick: le
        }, o(i(a)("console.reconnect")), 1)
      ])) : N("", !0),
      de(ve, {
        name: "pane",
        mode: "out-in"
      }, {
        default: fe(() => [
          h.value === "logs" ? (r(), c("div", {
            key: "logs",
            ref_key: "pane",
            ref: P,
            class: "pane",
            role: "tabpanel",
            onScrollPassive: G
          }, [
            q.value.length ? (r(), c("ol", {
              key: 1,
              class: "rows",
              "aria-label": i(a)("console.tab.logs")
            }, [
              (r(!0), c(y, null, k(q.value, (t, l) => (r(), c("li", {
                key: `${t.time}-${l}`,
                class: T(["row", D(t.level)])
              }, [
                n("time", Be, o(Y(t.time)), 1),
                n("span", De, o(t.level), 1),
                n("span", Ae, o(j(t)), 1),
                n("span", He, o(t.message), 1),
                (r(!0), c(y, null, k(H(t), ([p, u]) => (r(), c("span", {
                  key: p,
                  class: "kv"
                }, [
                  n("span", je, o(p) + "=", 1),
                  n("span", qe, o(String(u)), 1)
                ]))), 128)),
                t.trace_id ? (r(), c("button", {
                  key: 0,
                  type: "button",
                  class: "link trace",
                  title: i(a)("console.showTrace"),
                  onClick: (p) => J(t.trace_id)
                }, o(t.trace_id.slice(0, 8)), 9, ze)) : N("", !0)
              ], 2))), 128))
            ], 8, Ve)) : (r(), c("p", Ue, o(i(a)("console.noLogs")), 1))
          ], 544)) : (r(), c("div", {
            key: 1,
            ref_key: "pane",
            ref: P,
            class: "pane",
            role: "tabpanel",
            onScrollPassive: G
          }, [
            F.value.length ? (r(), c("ol", {
              key: 1,
              class: "rows",
              "aria-label": i(a)("console.tab.traces")
            }, [
              (r(!0), c(y, null, k(ee.value, (t) => (r(), c("li", {
                key: t.span.span_id,
                class: T(["row span", [D(t.span.status), t.span.kind]])
              }, [
                n("span", {
                  class: "indent",
                  style: _e({ width: t.depth * 14 + "px" }),
                  "aria-hidden": "true"
                }, null, 4),
                n("span", We, o(t.span.kind), 1),
                n("span", Xe, o(t.span.name), 1),
                n("span", Ke, [
                  (r(!0), c(y, null, k(Object.entries(t.span.attrs || {}), ([l, p]) => (r(), c("span", {
                    key: l,
                    class: "kv"
                  }, [
                    n("span", Qe, o(l) + "=", 1),
                    n("span", Ye, o(p), 1)
                  ]))), 128)),
                  t.span.error ? (r(), c("span", Ze, o(t.span.error), 1)) : N("", !0)
                ]),
                (r(!0), c(y, null, k(t.span.events || [], (l, p) => (r(), c("span", {
                  key: p,
                  class: "event",
                  title: JSON.stringify(l.attrs || {})
                }, o(l.name), 9, et))), 128)),
                n("span", tt, o(A(t.span.duration_ns)), 1),
                n("button", {
                  type: "button",
                  class: "link trace",
                  title: i(a)("console.totalTrace"),
                  onClick: (l) => J(t.span.trace_id)
                }, o(A(te.value.get(t.span.trace_id) || 0)), 9, st)
              ], 2))), 128))
            ], 8, Je)) : (r(), c("p", Ge, o(i(a)("console.noSpans")), 1))
          ], 544))
        ]),
        _: 1
      })
    ]));
  }
}), lt = (E, a) => {
  const L = E.__vccOpts || E;
  for (const [h, d] of a)
    L[h] = d;
  return L;
}, ct = /* @__PURE__ */ lt(nt, [["__scopeId", "data-v-940c88b5"]]);
export {
  ct as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".console[data-v-940c88b5]{display:flex;flex-direction:column;min-height:0;height:100%;background:var(--md-surface);color:var(--md-on-surface)}.pane-enter-active[data-v-940c88b5]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel)}.pane-leave-active[data-v-940c88b5]{transition:opacity var(--duration-instant) var(--ease-emphasized-accel)}.pane-enter-from[data-v-940c88b5],.pane-leave-to[data-v-940c88b5]{opacity:0}@media(prefers-reduced-motion:reduce){.pane-enter-active[data-v-940c88b5],.pane-leave-active[data-v-940c88b5]{transition-duration:1ms}}.console-bar[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:flex-end;gap:var(--space-md);padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.tabs[data-v-940c88b5]{display:flex;gap:var(--space-xs)}.tab[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:0 14px;border:0;border-radius:var(--radius-full);background:transparent;color:var(--md-on-surface-variant);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}.tab[data-v-940c88b5]:hover{background:color-mix(in srgb,var(--md-on-surface) 7%,transparent)}.tab.active[data-v-940c88b5]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tab[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.tab-badge[data-v-940c88b5]{min-width:18px;padding:0 5px;border-radius:var(--radius-full);background:var(--md-error-container);color:var(--md-on-error-container);font-size:11px;font-weight:700;text-align:center}.controls[data-v-940c88b5]{display:flex;flex:1;flex-wrap:wrap;align-items:flex-end;gap:var(--space-sm)}.field[data-v-940c88b5]{display:flex;flex-direction:column;gap:2px}.field.grow[data-v-940c88b5]{flex:1;min-width:180px}.field-label[data-v-940c88b5]{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant)}.input[data-v-940c88b5]{min-height:34px;padding:0 10px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-sm);background:var(--md-surface-container-lowest);color:inherit;font:inherit;font-size:13px}.input[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:1px}.check[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap}.btn[data-v-940c88b5]{min-height:34px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast)}.btn[data-v-940c88b5]:hover:not(:disabled){background:var(--md-surface-container-high)}.btn[data-v-940c88b5]:disabled{opacity:.5;cursor:default}.btn[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.status[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);white-space:nowrap}.status .dot[data-v-940c88b5]{width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.status.live .dot[data-v-940c88b5]{background:var(--md-success);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-success) 22%,transparent)}.status.dead .dot[data-v-940c88b5]{background:var(--md-error)}.banner[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-sm);margin:0;padding:var(--space-sm) var(--space-lg);background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px}.banner code[data-v-940c88b5]{flex:1;min-width:0;overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.pane[data-v-940c88b5]{flex:1;min-height:0;overflow:auto}.empty[data-v-940c88b5]{padding:var(--space-xl);color:var(--md-on-surface-variant);font-size:13px}.rows[data-v-940c88b5]{margin:0;padding:0;list-style:none;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,monospace;font-size:12px;line-height:1.55}.row[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;padding:3px var(--space-lg);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.row[data-v-940c88b5]:hover{background:color-mix(in srgb,var(--md-on-surface) 4%,transparent)}.row[data-v-940c88b5]:before{content:\"\";width:3px;align-self:stretch;margin:1px 0;border-radius:2px;background:var(--md-outline)}.row.debug[data-v-940c88b5]:before{background:var(--md-outline)}.row.info[data-v-940c88b5]:before{background:var(--md-primary)}.row.warn[data-v-940c88b5]:before{background:var(--md-warning)}.row.error[data-v-940c88b5]:before{background:var(--md-error)}.row.ok[data-v-940c88b5]:before{background:var(--md-success)}.ts[data-v-940c88b5]{color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.lvl[data-v-940c88b5]{min-width:46px;font-weight:700;color:var(--md-on-surface-variant);white-space:nowrap}.row.warn .lvl[data-v-940c88b5]{color:var(--md-warning)}.row.error .lvl[data-v-940c88b5]{color:var(--md-error)}.component[data-v-940c88b5]{min-width:96px;padding:0 6px;border-radius:var(--radius-sm);background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.msg[data-v-940c88b5]{flex:1;min-width:200px;word-break:break-word}.kv[data-v-940c88b5]{color:var(--md-on-surface-variant);white-space:nowrap}.kv .k[data-v-940c88b5]{opacity:.7}.kv .v[data-v-940c88b5]{color:var(--md-on-surface)}.err[data-v-940c88b5]{color:var(--md-error)}.event[data-v-940c88b5]{padding:0 6px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.dur[data-v-940c88b5]{margin-left:auto;color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.indent[data-v-940c88b5]{flex:none}.link[data-v-940c88b5]{padding:0;border:0;background:none;color:var(--md-primary);font:inherit;font-size:11px;cursor:pointer;text-decoration:underline dotted}.link[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}@media(max-width:720px){.console-bar[data-v-940c88b5]{align-items:stretch}.controls[data-v-940c88b5]{flex-direction:column;align-items:stretch}.component[data-v-940c88b5],.lvl[data-v-940c88b5]{min-width:0}}#app .console[data-v-940c88b5] :is(.tab,.btn){min-height:34px;border-radius:var(--radius-full)}#app .console .input[data-v-940c88b5]{min-height:34px;border-radius:var(--radius-sm)}\n";document.head.appendChild(s)}})();
