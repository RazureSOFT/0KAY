import { ref as h, reactive as _e, computed as p, onMounted as ve, onUnmounted as pe, openBlock as l, createElementBlock as i, createElementVNode as e, normalizeClass as E, createTextVNode as _, toDisplayString as n, createCommentVNode as r, unref as ye, createVNode as g, Transition as W, withCtx as w, withDirectives as O, vModelSelect as ke, vModelText as U, Fragment as T, renderList as $, normalizeStyle as te, TransitionGroup as X } from "vue";
import { useConfirm as be, i18n as ge } from "@0kay/host";
const we = (D, s) => {
  const k = D.__vccOpts || D;
  for (const [v, A] of s)
    k[v] = A;
  return k;
}, Te = { class: "mc" }, $e = { class: "mc-head" }, Se = { class: "mc-title" }, Ce = { class: "mc-copy" }, Me = { class: "mc-sub" }, xe = {
  key: 0,
  class: "tag"
}, Pe = { class: "mc-actions" }, je = ["disabled"], Ne = ["disabled"], Ee = ["disabled"], Oe = {
  key: 0,
  class: "spinner",
  "aria-hidden": "true"
}, Ae = {
  key: 0,
  class: "toast",
  role: "status"
}, Ve = {
  key: 0,
  class: "err"
}, Be = {
  key: 1,
  class: "err action-err"
}, Ie = {
  key: 0,
  class: "fold"
}, Le = { class: "card connect" }, ze = { class: "connect-grid" }, Ue = ["placeholder"], De = ["placeholder"], He = ["placeholder"], Je = { class: "wide" }, Ke = ["placeholder"], Fe = { class: "actions" }, We = ["disabled"], Xe = {
  key: 0,
  class: "spinner",
  "aria-hidden": "true"
}, Ge = { class: "card log-card" }, Re = {
  key: 0,
  class: "muted log-empty"
}, Ye = {
  key: 1,
  class: "log"
}, Ze = { class: "log-time" }, qe = { class: "log-action" }, Qe = { class: "log-detail" }, et = {
  key: 0,
  class: "dash"
}, tt = { class: "grid" }, nt = { class: "card" }, st = { class: "card" }, at = { class: "bar-row" }, ot = { class: "bar-label" }, lt = { class: "bar" }, it = { class: "bar-num" }, ct = { class: "bar-row" }, rt = { class: "bar-label" }, ut = { class: "bar" }, dt = { class: "bar-num" }, mt = {
  key: 0,
  class: "err small"
}, ft = { class: "card" }, ht = { class: "muted" }, _t = { class: "list" }, vt = { class: "muted" }, pt = {
  key: 0,
  class: "chip muted"
}, yt = {
  key: 0,
  class: "muted"
}, kt = { class: "card" }, bt = { class: "muted" }, gt = { class: "list" }, wt = { class: "muted" }, Tt = ["disabled", "onClick"], $t = {
  key: 0,
  class: "spinner",
  "aria-hidden": "true"
}, St = {
  key: 0,
  class: "muted"
}, Ct = { class: "card" }, Mt = { class: "muted" }, xt = { class: "list" }, Pt = { class: "muted" }, jt = ["disabled", "onClick"], Nt = {
  key: 0,
  class: "spinner",
  "aria-hidden": "true"
}, Et = {
  key: 0,
  class: "muted"
}, Ot = { class: "card" }, At = { class: "muted" }, Vt = { class: "inv-wrap" }, Bt = { class: "inv hotbar" }, It = ["title"], Lt = {
  key: 0,
  class: "it"
}, zt = { key: 0 }, Ut = { class: "card" }, Dt = { class: "inv-wrap" }, Ht = { class: "inv" }, Jt = ["title"], Kt = {
  key: 0,
  class: "it"
}, Ft = { key: 0 }, Wt = {
  key: 2,
  class: "muted pad"
}, Xt = {
  key: 3,
  class: "muted pad"
}, G = "/api/plugins/minecraft/proxy", Gt = {
  __name: "MinecraftPage",
  setup(D) {
    const s = (o, a) => ge.global.t(o, a ?? {}), k = h(null), v = h({ waypoints: [], skills: [] }), A = h(!0), V = h(!1), u = h({ edition: "java", host: "", port: "", username: "", password: "" });
    let H = null;
    const y = h(""), S = h(""), C = h("");
    let J = null;
    const M = _e(/* @__PURE__ */ new Set()), R = p(() => M.size > 0);
    function Y(o, a) {
      return a && Object.keys(a).length ? `${o}:${JSON.stringify(a)}` : o;
    }
    function m(o, a) {
      return M.has(Y(o, a));
    }
    let B = null;
    try {
      const o = be();
      o && typeof o.confirm == "function" && (B = o.confirm);
    } catch {
    }
    const b = h(!1);
    let K = null;
    const x = h([]);
    let ne = 0;
    function P(o, a, t) {
      x.value.unshift({ id: ++ne, time: (/* @__PURE__ */ new Date()).toLocaleTimeString(), action: o, ok: a, detail: t }), x.value.length > 50 && (x.value.length = 50);
    }
    const c = p(() => k.value?.bot || null), F = p(() => !!c.value?.connected), se = p(() => k.value?.autopilot || { running: !1 }), ae = p(() => c.value?.username || ""), oe = {
      idle: "minecraft.stateIdle",
      connecting: "minecraft.stateConnecting",
      connected: "minecraft.stateConnected",
      spawning: "minecraft.stateSpawning",
      error: "minecraft.stateError"
    }, le = p(() => {
      const o = c.value?.state;
      if (!o) return s("minecraft.disconnected");
      const a = oe[o];
      return a ? s(a) : o;
    });
    function Z(o, a = 20) {
      const t = Number(o);
      return Number.isFinite(t) ? Math.max(0, Math.min(100, t / a * 100)) : 0;
    }
    const ie = p(() => {
      const o = {};
      for (const a of c.value?.inventory || []) o[a.slot] = a;
      return o;
    });
    function q(o) {
      return ie.value[o] || null;
    }
    const ce = p(() => Array.from({ length: 9 }, (o, a) => ({ slot: 36 + a, item: q(36 + a) }))), re = p(() => Array.from({ length: 27 }, (o, a) => ({ slot: 9 + a, item: q(9 + a) }))), I = h({});
    let L = null, Q = null;
    function ue() {
      const o = {};
      for (const a of c.value?.inventory || []) o[a.slot] = `${a.name}#${a.count ?? 1}`;
      if (L) {
        const a = {};
        for (const [t, d] of Object.entries(o)) {
          const f = Number(t);
          L[f] !== d && (a[f] = !0);
        }
        for (const t of Object.keys(L)) {
          const d = Number(t);
          d in o || (a[d] = !0);
        }
        Object.keys(a).length && (I.value = a, clearTimeout(Q), Q = setTimeout(() => {
          I.value = {};
        }, 700));
      }
      L = o;
    }
    function j(o) {
      return String(o || "").replace(/_/g, " ");
    }
    async function z() {
      try {
        const o = await fetch(`${G}/status`, { signal: AbortSignal.timeout(6e3) });
        if (!o.ok) throw new Error(`HTTP ${o.status}`);
        k.value = await o.json(), y.value = "", ue(), de();
      } catch (o) {
        y.value = s("minecraft.unreachable", { error: o?.message || "unreachable" });
      } finally {
        A.value = !1;
      }
    }
    async function de() {
      try {
        const o = await fetch(`${G}/world`, { signal: AbortSignal.timeout(6e3) });
        o.ok && (v.value = await o.json());
      } catch {
      }
    }
    async function N(o, a = {}) {
      const t = Y(o, a);
      if (!M.has(t)) {
        M.add(t), S.value = "", clearTimeout(J), C.value = "";
        try {
          const d = await fetch(`${G}/action`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: o, args: a }),
            signal: AbortSignal.timeout(4e4)
          }), f = await d.json().catch(() => ({}));
          if (d.status >= 500) {
            y.value = s("minecraft.unreachable", { error: `HTTP ${d.status}` }), P(o, !1, `HTTP ${d.status}`);
            return;
          }
          if (!d.ok || f.ok === !1) {
            const ee = f.error || `HTTP ${d.status}`;
            S.value = s("minecraft.actionFailed", { error: ee }), P(o, !1, ee);
            return;
          }
          await z(), C.value = s("minecraft.actionOk"), me(), P(o, !0, s("minecraft.logOk"));
        } catch (d) {
          if (d?.name === "TimeoutError" || d?.name === "AbortError") {
            const f = s("minecraft.actionTimeout");
            S.value = f, P(o, !1, f);
          } else {
            const f = d?.message || "unreachable";
            y.value = s("minecraft.unreachable", { error: f }), P(o, !1, f);
          }
        } finally {
          M.delete(t);
        }
      }
    }
    function me() {
      clearTimeout(J), J = setTimeout(() => {
        C.value = "";
      }, 3e3);
    }
    async function fe() {
      await N("connect", {
        edition: u.value.edition,
        host: u.value.host.trim(),
        port: u.value.port ? Number(u.value.port) : void 0,
        username: u.value.username.trim() || void 0,
        password: u.value.password || void 0
      });
    }
    async function he() {
      if (B) {
        await B({
          title: s("minecraft.disconnect"),
          message: s("minecraft.disconnectConfirm"),
          danger: !0,
          confirmLabel: s("minecraft.disconnect")
        }) && await N("disconnect");
        return;
      }
      if (!b.value) {
        b.value = !0, clearTimeout(K), K = setTimeout(() => {
          b.value = !1;
        }, 3e3);
        return;
      }
      clearTimeout(K), b.value = !1, await N("disconnect");
    }
    return ve(() => {
      z(), H = setInterval(z, 3e3);
    }), pe(() => {
      H && clearInterval(H);
    }), (o, a) => (l(), i("div", Te, [
      e("header", $e, [
        e("div", Se, [
          a[7] || (a[7] = e("span", {
            class: "mc-logo",
            "aria-hidden": "true"
          }, [
            e("svg", {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              e("path", {
                d: "M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z",
                stroke: "currentColor",
                "stroke-width": "1.7",
                "stroke-linejoin": "round"
              }),
              e("path", {
                d: "M12 12 4 7.5M12 12l8-4.5M12 12v9",
                stroke: "currentColor",
                "stroke-width": "1.7",
                "stroke-linejoin": "round"
              })
            ])
          ], -1)),
          e("div", Ce, [
            a[6] || (a[6] = e("h1", null, "Minecraft", -1)),
            e("p", Me, [
              e("span", {
                class: E(["dot", F.value ? "on" : y.value ? "err" : "off"])
              }, null, 2),
              _(" " + n(F.value ? ae.value || s("minecraft.connected") : le.value) + " ", 1),
              se.value.running ? (l(), i("span", xe, n(s("minecraft.autopilot")), 1)) : r("", !0)
            ])
          ])
        ]),
        e("div", Pe, [
          e("button", {
            class: "btn tonic",
            disabled: R.value,
            onClick: z
          }, n(s("minecraft.refresh")), 9, je),
          e("button", {
            class: "btn filled",
            disabled: R.value,
            onClick: a[0] || (a[0] = (t) => V.value = !V.value)
          }, n(V.value ? s("minecraft.collapse") : s("minecraft.connectSettings")), 9, Ne),
          F.value ? (l(), i("button", {
            key: 0,
            class: E(["btn danger", { armed: b.value }]),
            disabled: m("disconnect"),
            onClick: he
          }, [
            m("disconnect") ? (l(), i("span", Oe)) : r("", !0),
            _(" " + n(m("disconnect") ? s("minecraft.acting") : b.value && !ye(B) ? s("minecraft.confirmDisconnect") : s("minecraft.disconnect")), 1)
          ], 10, Ee)) : r("", !0)
        ])
      ]),
      g(W, { name: "toast" }, {
        default: w(() => [
          C.value ? (l(), i("p", Ae, n(C.value), 1)) : r("", !0)
        ]),
        _: 1
      }),
      y.value ? (l(), i("p", Ve, n(y.value), 1)) : r("", !0),
      S.value ? (l(), i("p", Be, n(S.value), 1)) : r("", !0),
      g(W, { name: "fold" }, {
        default: w(() => [
          V.value ? (l(), i("div", Ie, [
            e("section", Le, [
              e("h2", null, n(s("minecraft.connectTitle")), 1),
              e("div", ze, [
                e("label", null, [
                  e("span", null, n(s("minecraft.edition")), 1),
                  O(e("select", {
                    "onUpdate:modelValue": a[1] || (a[1] = (t) => u.value.edition = t)
                  }, [...a[8] || (a[8] = [
                    e("option", { value: "java" }, "Java", -1),
                    e("option", { value: "bedrock" }, "Bedrock", -1)
                  ])], 512), [
                    [ke, u.value.edition]
                  ])
                ]),
                e("label", null, [
                  e("span", null, n(s("minecraft.host")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": a[2] || (a[2] = (t) => u.value.host = t),
                    placeholder: s("minecraft.hostPlaceholder"),
                    spellcheck: "false"
                  }, null, 8, Ue), [
                    [U, u.value.host]
                  ])
                ]),
                e("label", null, [
                  e("span", null, n(s("minecraft.port")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": a[3] || (a[3] = (t) => u.value.port = t),
                    placeholder: s("minecraft.portPlaceholder"),
                    spellcheck: "false"
                  }, null, 8, De), [
                    [U, u.value.port]
                  ])
                ]),
                e("label", null, [
                  e("span", null, n(s("minecraft.username")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": a[4] || (a[4] = (t) => u.value.username = t),
                    placeholder: s("minecraft.usernamePlaceholder"),
                    spellcheck: "false"
                  }, null, 8, He), [
                    [U, u.value.username]
                  ])
                ]),
                e("label", Je, [
                  e("span", null, n(s("minecraft.password")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": a[5] || (a[5] = (t) => u.value.password = t),
                    placeholder: s("minecraft.passwordPlaceholder"),
                    spellcheck: "false"
                  }, null, 8, Ke), [
                    [U, u.value.password]
                  ])
                ])
              ]),
              e("div", Fe, [
                e("button", {
                  class: "btn filled",
                  disabled: m("connect") || !u.value.host.trim(),
                  onClick: fe
                }, [
                  m("connect") ? (l(), i("span", Xe)) : r("", !0),
                  _(" " + n(m("connect") ? s("minecraft.acting") : s("minecraft.connect")), 1)
                ], 8, We)
              ])
            ])
          ])) : r("", !0)
        ]),
        _: 1
      }),
      e("section", Ge, [
        e("h2", null, n(s("minecraft.actionLog")), 1),
        x.value.length ? (l(), i("ul", Ye, [
          (l(!0), i(T, null, $(x.value, (t) => (l(), i("li", {
            key: t.id,
            class: E(t.ok ? "ok" : "fail")
          }, [
            e("span", Ze, n(t.time), 1),
            e("code", qe, n(t.action), 1),
            e("span", Qe, n(t.detail), 1)
          ], 2))), 128))
        ])) : (l(), i("p", Re, n(s("minecraft.logEmpty")), 1))
      ]),
      g(W, { name: "dash" }, {
        default: w(() => [
          c.value ? (l(), i("div", et, [
            e("section", tt, [
              e("div", nt, [
                e("h2", null, n(s("minecraft.server")), 1),
                e("dl", null, [
                  e("dt", null, n(s("minecraft.address")), 1),
                  e("dd", null, n(c.value.host || "-") + ":" + n(c.value.port || "-"), 1),
                  e("dt", null, n(s("minecraft.edition")), 1),
                  e("dd", null, n(c.value.edition === "bedrock" ? "Bedrock" : "Java") + " " + n(c.value.version || ""), 1),
                  e("dt", null, n(s("minecraft.dimension")), 1),
                  e("dd", null, n(c.value.dimension || "-"), 1),
                  e("dt", null, n(s("minecraft.position")), 1),
                  e("dd", null, n(c.value.position ? `${c.value.position.x}, ${c.value.position.y}, ${c.value.position.z}` : "-"), 1),
                  e("dt", null, n(s("minecraft.held")), 1),
                  e("dd", null, n(j(c.value.held) || s("minecraft.emptySlot")), 1)
                ])
              ]),
              e("div", st, [
                e("h2", null, n(s("minecraft.status")), 1),
                e("div", at, [
                  e("span", ot, n(s("minecraft.health")), 1),
                  e("div", lt, [
                    e("i", {
                      class: "hp",
                      style: te({ transform: `scaleX(${Z(c.value.health) / 100})` })
                    }, null, 4)
                  ]),
                  e("span", it, n(c.value.health ?? "-") + "/20", 1)
                ]),
                e("div", ct, [
                  e("span", rt, n(s("minecraft.food")), 1),
                  e("div", ut, [
                    e("i", {
                      class: "food",
                      style: te({ transform: `scaleX(${Z(c.value.food) / 100})` })
                    }, null, 4)
                  ]),
                  e("span", dt, n(c.value.food ?? "-") + "/20", 1)
                ]),
                c.value.error ? (l(), i("p", mt, n(c.value.error), 1)) : r("", !0)
              ]),
              e("div", ft, [
                e("h2", null, [
                  _(n(s("minecraft.players")) + " ", 1),
                  e("span", ht, n((c.value.players || []).length), 1)
                ]),
                e("ul", _t, [
                  g(X, { name: "list" }, {
                    default: w(() => [
                      (l(!0), i(T, null, $(c.value.players || [], (t) => (l(), i("li", {
                        key: t.name
                      }, [
                        e("b", null, n(t.name), 1),
                        e("span", vt, n(t.position ? `${Math.round(t.position.x)}, ${Math.round(t.position.y)}, ${Math.round(t.position.z)}` : ""), 1),
                        t.ping != null ? (l(), i("span", pt, n(t.ping) + "ms", 1)) : r("", !0)
                      ]))), 128))
                    ]),
                    _: 1
                  }),
                  (c.value.players || []).length ? r("", !0) : (l(), i("li", yt, n(s("minecraft.noPlayers")), 1))
                ])
              ])
            ]),
            e("section", kt, [
              e("h2", null, [
                _(n(s("minecraft.waypoints")) + " ", 1),
                e("span", bt, n((v.value.waypoints || []).length), 1)
              ]),
              e("ul", gt, [
                g(X, { name: "list" }, {
                  default: w(() => [
                    (l(!0), i(T, null, $(v.value.waypoints || [], (t) => (l(), i("li", {
                      key: t.id
                    }, [
                      e("b", null, n(t.name), 1),
                      e("span", wt, n(Math.round(t.x)) + ", " + n(Math.round(t.y)) + ", " + n(Math.round(t.z)) + " · " + n(t.type), 1),
                      e("button", {
                        class: "btn sm tonic",
                        disabled: m("waypoint_goto", { name: t.name }),
                        onClick: (d) => N("waypoint_goto", { name: t.name })
                      }, [
                        m("waypoint_goto", { name: t.name }) ? (l(), i("span", $t)) : r("", !0),
                        _(" " + n(m("waypoint_goto", { name: t.name }) ? s("minecraft.acting") : s("minecraft.goto")), 1)
                      ], 8, Tt)
                    ]))), 128))
                  ]),
                  _: 1
                }),
                (v.value.waypoints || []).length ? r("", !0) : (l(), i("li", St, n(s("minecraft.noWaypoints")), 1))
              ])
            ]),
            e("section", Ct, [
              e("h2", null, [
                _(n(s("minecraft.skills")) + " ", 1),
                e("span", Mt, n((v.value.skills || []).length), 1)
              ]),
              e("ul", xt, [
                g(X, { name: "list" }, {
                  default: w(() => [
                    (l(!0), i(T, null, $(v.value.skills || [], (t) => (l(), i("li", {
                      key: t.id
                    }, [
                      e("b", null, n(t.name), 1),
                      e("span", Pt, n(s("minecraft.skillRuns", { steps: (t.steps || []).length, runs: t.runs || 0 })), 1),
                      e("button", {
                        class: "btn sm tonic",
                        disabled: m("skill_run", { name: t.name }),
                        onClick: (d) => N("skill_run", { name: t.name })
                      }, [
                        m("skill_run", { name: t.name }) ? (l(), i("span", Nt)) : r("", !0),
                        _(" " + n(m("skill_run", { name: t.name }) ? s("minecraft.acting") : s("minecraft.run")), 1)
                      ], 8, jt)
                    ]))), 128))
                  ]),
                  _: 1
                }),
                (v.value.skills || []).length ? r("", !0) : (l(), i("li", Et, n(s("minecraft.noSkills")), 1))
              ])
            ]),
            e("section", Ot, [
              e("h2", null, [
                _(n(s("minecraft.inventory")) + " ", 1),
                e("span", At, n(s("minecraft.hotbar")), 1)
              ]),
              e("div", Vt, [
                e("div", Bt, [
                  (l(!0), i(T, null, $(ce.value, (t) => (l(), i("div", {
                    key: t.slot,
                    class: E(["cell", { flash: I.value[t.slot] }]),
                    title: t.item ? `${j(t.item.name)} x${t.item.count}` : s("minecraft.emptySlot")
                  }, [
                    t.item ? (l(), i("span", Lt, [
                      _(n(j(t.item.name)), 1),
                      t.item.count > 1 ? (l(), i("b", zt, "×" + n(t.item.count), 1)) : r("", !0)
                    ])) : r("", !0)
                  ], 10, It))), 128))
                ])
              ])
            ]),
            e("section", Ut, [
              e("h2", null, n(s("minecraft.backpack")), 1),
              e("div", Dt, [
                e("div", Ht, [
                  (l(!0), i(T, null, $(re.value, (t) => (l(), i("div", {
                    key: t.slot,
                    class: E(["cell", { flash: I.value[t.slot] }]),
                    title: t.item ? `${j(t.item.name)} x${t.item.count}` : s("minecraft.emptySlot")
                  }, [
                    t.item ? (l(), i("span", Kt, [
                      _(n(j(t.item.name)), 1),
                      t.item.count > 1 ? (l(), i("b", Ft, "×" + n(t.item.count), 1)) : r("", !0)
                    ])) : r("", !0)
                  ], 10, Jt))), 128))
                ])
              ])
            ])
          ])) : r("", !0)
        ]),
        _: 1
      }),
      !c.value && A.value ? (l(), i("p", Wt, n(s("minecraft.loading")), 1)) : !c.value && !y.value ? (l(), i("p", Xt, n(s("minecraft.notConnectedHint")), 1)) : r("", !0)
    ]));
  }
}, Zt = /* @__PURE__ */ we(Gt, [["__scopeId", "data-v-f0f1787f"]]);
export {
  Zt as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('minecraft-plugin-style')){const s=document.createElement('style');s.id='minecraft-plugin-style';s.textContent="#app .mc[data-v-f0f1787f]{padding:clamp(18px,2.4vw,30px);max-width:1120px;margin:0 auto;color:var(--md-on-surface);font-family:var(--font-family)}#app .mc h1[data-v-f0f1787f],#app .mc h2[data-v-f0f1787f]{margin:0;letter-spacing:-.01em}#app .mc h2[data-v-f0f1787f]{font-size:15px;font-weight:750;margin-bottom:12px;display:flex;align-items:center;gap:8px}#app .mc .mc-head[data-v-f0f1787f]{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px;padding:20px 22px;border-radius:28px;background:radial-gradient(520px 240px at 100% 0%,color-mix(in srgb,var(--md-primary) 12%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-high)));box-shadow:var(--shadow-1)}#app .mc .mc-title[data-v-f0f1787f]{display:flex;align-items:center;gap:14px;min-width:0}#app .mc .mc-logo[data-v-f0f1787f]{width:52px;height:52px;flex-shrink:0;display:grid;place-items:center;border-radius:18px 18px 18px 7px;background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .mc .mc-copy h1[data-v-f0f1787f]{font-size:22px;font-weight:800}#app .mc .mc-sub[data-v-f0f1787f]{display:flex;align-items:center;gap:8px;margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);flex-wrap:wrap}#app .mc .dot[data-v-f0f1787f]{width:9px;height:9px;border-radius:50%;background:var(--md-outline);flex-shrink:0;transition:background-color var(--duration-short,.18s) ease,box-shadow var(--duration-short,.18s) ease}#app .mc .dot.on[data-v-f0f1787f]{background:var(--md-success);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-success) 22%,transparent);animation:mc-breath-f0f1787f 2s ease-in-out infinite}#app .mc .dot.err[data-v-f0f1787f]{background:var(--md-error);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-error) 20%,transparent)}@keyframes mc-breath-f0f1787f{0%,to{box-shadow:0 0 0 4px color-mix(in srgb,var(--md-success) 22%,transparent)}50%{box-shadow:0 0 0 8px color-mix(in srgb,var(--md-success) 8%,transparent)}}#app .mc .tag[data-v-f0f1787f]{font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--md-success-container);color:var(--md-on-success-container)}#app .mc .mc-actions[data-v-f0f1787f]{display:flex;gap:8px;align-items:center;flex-wrap:wrap}#app .mc .toast[data-v-f0f1787f]{margin:0 0 14px;padding:11px 16px;border-radius:16px;font-size:13px;font-weight:700;background:var(--md-success-container);color:var(--md-on-success-container);box-shadow:var(--shadow-1)}#app .mc .toast-enter-active[data-v-f0f1787f],#app .mc .toast-leave-active[data-v-f0f1787f]{transition:opacity var(--duration-short,.18s) ease,transform var(--duration-short,.18s) var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .mc .toast-enter-from[data-v-f0f1787f],#app .mc .toast-leave-to[data-v-f0f1787f]{opacity:0;transform:translateY(-6px)}#app .mc .btn[data-v-f0f1787f]{min-height:44px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform .24s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .18s,box-shadow .2s,border-radius .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .mc .btn[data-v-f0f1787f]:disabled{opacity:.5;cursor:not-allowed}@media(hover:hover)and (pointer:fine){#app .mc .btn[data-v-f0f1787f]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .mc .btn.sm[data-v-f0f1787f]{min-height:44px;padding:0 13px;font-size:13px}#app .mc .btn.filled[data-v-f0f1787f]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .mc .btn.tonic[data-v-f0f1787f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .mc .btn.danger[data-v-f0f1787f]{background:var(--md-error-container);color:var(--md-on-error-container)}#app .mc .btn.danger.armed[data-v-f0f1787f]{background:var(--md-error);color:var(--md-on-error)}#app .mc .spinner[data-v-f0f1787f]{width:14px;height:14px;flex-shrink:0;border-radius:50%;border:2px solid color-mix(in srgb,currentColor 30%,transparent);border-top-color:currentColor;animation:mc-spin-f0f1787f .7s linear infinite}@keyframes mc-spin-f0f1787f{to{transform:rotate(360deg)}}#app .mc .connect input[data-v-f0f1787f],#app .mc .connect select[data-v-f0f1787f]{height:44px;padding:0 14px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s}#app .mc .connect input[data-v-f0f1787f]:focus-visible,#app .mc .connect select[data-v-f0f1787f]:focus-visible{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .mc .card[data-v-f0f1787f]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;padding:18px 20px;margin-bottom:16px;box-shadow:var(--shadow-1);transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}@media(hover:hover)and (pointer:fine){#app .mc .card[data-v-f0f1787f]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}#app .mc .grid[data-v-f0f1787f]{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-bottom:0}#app .mc .grid .card[data-v-f0f1787f]{margin-bottom:16px}#app .mc .connect-grid[data-v-f0f1787f]{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}#app .mc .connect-grid label[data-v-f0f1787f]{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .mc .connect-grid label.wide[data-v-f0f1787f]{grid-column:1/-1}#app .mc .connect .actions[data-v-f0f1787f]{display:flex;justify-content:flex-end;margin-top:14px}#app .mc .fold[data-v-f0f1787f]{display:grid;grid-template-rows:1fr;margin-bottom:16px;transition:grid-template-rows .2s ease,opacity .2s ease}#app .mc .fold>.card[data-v-f0f1787f]{min-height:0;overflow:hidden;margin-bottom:0}#app .mc .fold-enter-from[data-v-f0f1787f],#app .mc .fold-leave-to[data-v-f0f1787f]{grid-template-rows:0fr;opacity:0}#app .mc .fold-enter-active[data-v-f0f1787f],#app .mc .fold-leave-active[data-v-f0f1787f]{transition:grid-template-rows .2s ease,opacity .2s ease}#app .mc .dash-leave-active[data-v-f0f1787f]{transition:opacity var(--duration-short,.18s) ease}#app .mc .dash-leave-to[data-v-f0f1787f]{opacity:0}#app .mc .dash>section[data-v-f0f1787f]{animation:mc-rise-f0f1787f .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)) both}#app .mc .dash>section[data-v-f0f1787f]:nth-child(2){animation-delay:40ms}#app .mc .dash>section[data-v-f0f1787f]:nth-child(3){animation-delay:80ms}#app .mc .dash>section[data-v-f0f1787f]:nth-child(4){animation-delay:.12s}#app .mc .dash>section[data-v-f0f1787f]:nth-child(5){animation-delay:.16s}#app .mc .grid .card[data-v-f0f1787f]{animation:mc-rise-f0f1787f .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)) both}#app .mc .grid .card[data-v-f0f1787f]:nth-child(2){animation-delay:40ms}#app .mc .grid .card[data-v-f0f1787f]:nth-child(3){animation-delay:80ms}@keyframes mc-rise-f0f1787f{0%{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}#app .mc dl[data-v-f0f1787f]{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0;font-size:13px}#app .mc dt[data-v-f0f1787f]{color:var(--md-on-surface-variant)}#app .mc dd[data-v-f0f1787f]{margin:0;overflow-wrap:anywhere}#app .mc .bar-row[data-v-f0f1787f]{display:flex;align-items:center;gap:12px;margin:10px 0;font-size:13px}#app .mc .bar-label[data-v-f0f1787f]{min-width:36px;white-space:nowrap;color:var(--md-on-surface-variant);flex-shrink:0}#app .mc .bar[data-v-f0f1787f]{flex:1;height:12px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}#app .mc .bar i[data-v-f0f1787f]{display:block;width:100%;height:100%;border-radius:999px;transform-origin:left;transform:scaleX(0);transition:transform var(--duration-long,.36s) var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .mc .bar i.hp[data-v-f0f1787f]{background:linear-gradient(90deg,var(--md-error),color-mix(in srgb,var(--md-error) 55%,var(--md-surface-container-lowest)))}#app .mc .bar i.food[data-v-f0f1787f]{background:linear-gradient(90deg,var(--md-warning),color-mix(in srgb,var(--md-warning) 55%,var(--md-surface-container-lowest)))}#app .mc .bar-num[data-v-f0f1787f]{width:54px;text-align:right;color:var(--md-on-surface-variant);flex-shrink:0}#app .mc .list[data-v-f0f1787f]{list-style:none;margin:0;padding:0;font-size:13px;display:flex;flex-direction:column;gap:2px;position:relative}#app .mc .list li[data-v-f0f1787f]{display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}#app .mc .list li[data-v-f0f1787f]:last-child{border-bottom:none}#app .mc .list li .btn[data-v-f0f1787f],#app .mc .list li span.muted[data-v-f0f1787f],#app .mc .list li .chip[data-v-f0f1787f]{margin-left:auto}#app .mc .list li b+span.muted[data-v-f0f1787f]{flex:1;min-width:0}#app .mc .list-move[data-v-f0f1787f],#app .mc .list-enter-active[data-v-f0f1787f],#app .mc .list-leave-active[data-v-f0f1787f]{transition:opacity .2s ease,transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .mc .list-enter-from[data-v-f0f1787f],#app .mc .list-leave-to[data-v-f0f1787f]{opacity:0;transform:translateY(-4px)}#app .mc .list-leave-active[data-v-f0f1787f]{position:absolute;width:auto;min-width:60%}#app .mc .chip[data-v-f0f1787f]{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}#app .mc .chip.muted[data-v-f0f1787f]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:600}#app .mc .muted[data-v-f0f1787f]{color:var(--md-on-surface-variant)}#app .mc .err[data-v-f0f1787f]{color:var(--md-error);font-size:13px;background:var(--md-error-container);padding:11px 16px;border-radius:16px;margin-bottom:14px}#app .mc .err.action-err[data-v-f0f1787f]{border-left:4px solid var(--md-error);border-radius:10px 16px 16px 10px}#app .mc .err.small[data-v-f0f1787f]{font-size:12px;margin:8px 0 0;background:transparent;padding:0}#app .mc .pad[data-v-f0f1787f]{padding:8px 0}#app .mc .log-card .log-empty[data-v-f0f1787f]{font-size:13px;margin:0}#app .mc .log[data-v-f0f1787f]{list-style:none;margin:0;padding:0;max-height:220px;overflow-y:auto;font-size:12.5px;display:flex;flex-direction:column;gap:2px}#app .mc .log li[data-v-f0f1787f]{display:flex;gap:10px;align-items:baseline;padding:5px 0 5px 12px;border-left:3px solid transparent}#app .mc .log li.ok[data-v-f0f1787f]{border-left-color:var(--md-success)}#app .mc .log li.fail[data-v-f0f1787f]{border-left-color:var(--md-error)}#app .mc .log .log-time[data-v-f0f1787f]{color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;flex-shrink:0}#app .mc .log .log-action[data-v-f0f1787f]{font-family:ui-monospace,monospace;font-size:12px;font-weight:700;flex-shrink:0}#app .mc .log .log-detail[data-v-f0f1787f]{color:var(--md-on-surface-variant);overflow-wrap:anywhere;min-width:0}#app .mc .log li.fail .log-detail[data-v-f0f1787f]{color:var(--md-error)}#app .mc .inv-wrap[data-v-f0f1787f]{overflow-x:auto}#app .mc .inv[data-v-f0f1787f]{display:grid;grid-template-columns:repeat(9,1fr);gap:8px}#app .mc .inv.hotbar[data-v-f0f1787f]{margin-bottom:10px}#app .mc .cell[data-v-f0f1787f]{aspect-ratio:1;border-radius:14px;background:var(--md-surface-container-high);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;align-items:center;justify-content:center;padding:4px;overflow:hidden;transition:transform .2s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .18s}@media(hover:hover)and (pointer:fine){#app .mc .cell[data-v-f0f1787f]:hover{background:var(--md-surface-container-highest)}}#app .mc .cell .it[data-v-f0f1787f]{font-size:11px;line-height:1.1;text-align:center;word-break:break-word}#app .mc .cell .it b[data-v-f0f1787f]{display:block;font-size:11px;color:var(--md-primary);font-weight:800}#app .mc .cell.flash[data-v-f0f1787f]{animation:mc-cell-flash-f0f1787f .6s ease-out}@keyframes mc-cell-flash-f0f1787f{0%{outline:2px solid var(--md-primary);outline-offset:1px;background:color-mix(in srgb,var(--md-primary) 22%,var(--md-surface-container-high))}to{outline:2px solid transparent;outline-offset:1px;background:var(--md-surface-container-high)}}@media(max-width:640px){#app .mc .mc-actions[data-v-f0f1787f]{width:100%}#app .mc .inv[data-v-f0f1787f]{grid-template-columns:repeat(9,minmax(30px,1fr));min-width:min(100%,306px)}#app .mc .cell[data-v-f0f1787f]{border-radius:10px;padding:2px}#app .mc .cell .it[data-v-f0f1787f],#app .mc .cell .it b[data-v-f0f1787f]{font-size:9px}}@media(prefers-reduced-motion:reduce){#app .mc[data-v-f0f1787f] *,#app .mc[data-v-f0f1787f] *:before,#app .mc[data-v-f0f1787f] *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}#app .mc .btn[data-v-f0f1787f]:hover:not(:disabled),#app .mc .card[data-v-f0f1787f]:hover{transform:none}#app .mc .dot.on[data-v-f0f1787f]{animation:none}}\n";document.head.appendChild(s)}})();
