import { defineComponent as Se, ref as u, computed as U, watch as $e, nextTick as de, onMounted as ve, onUnmounted as pe, openBlock as l, createElementBlock as r, Fragment as F, createElementVNode as o, normalizeClass as E, createCommentVNode as c, createVNode as W, Transition as A, withCtx as D, normalizeStyle as fe, unref as h, toDisplayString as s, renderList as G, createTextVNode as he, withDirectives as ze, withKeys as we, withModifiers as me, vModelText as Oe, createApp as Pe } from "vue";
import { i18n as Te } from "@0kay/host";
const He = 3200, Ie = ["aria-label"], Ne = ["title"], Fe = ["title"], We = ["aria-label"], Ae = { class: "count" }, De = ["title"], Ve = { class: "list-body" }, qe = {
  key: 0,
  class: "muted pad"
}, Be = ["onClick"], Ke = ["src", "alt"], Re = { class: "fb" }, Xe = { class: "row-main" }, Ye = { class: "row-top" }, je = { class: "row-sub" }, Je = {
  key: 0,
  class: "me"
}, Ue = ["aria-label"], Ge = ["src", "alt"], Qe = { class: "fb" }, Ze = ["title"], et = {
  key: 0,
  class: "muted pad"
}, tt = {
  key: 1,
  class: "muted pad"
}, nt = { class: "bubble" }, at = {
  key: 0,
  class: "sender"
}, ot = {
  key: 1,
  class: "text"
}, it = { class: "time" }, st = {
  key: 0,
  class: "composer"
}, lt = {
  key: 0,
  class: "send-error",
  role: "alert"
}, rt = ["placeholder", "onKeydown"], ut = ["disabled"], ct = ["aria-label"], dt = { class: "lsw-meta" }, vt = { class: "lsw-body" }, pt = {
  key: 0,
  class: "lsw-badge"
}, ft = /* @__PURE__ */ Se({
  __name: "SocialWindow",
  setup(y) {
    const i = (n, t) => Te.global.t(n, t ?? {}), f = u([]), v = u(""), w = u([]), C = u(""), M = u(!1), V = u(null), T = (n, t, e) => Math.max(t, Math.min(e, n));
    function Q(n) {
      const t = window.innerWidth || 1280, e = window.innerHeight || 800, a = T(n.w, 280, Math.max(280, t - 16)), d = T(n.h, 220, Math.max(220, e - 16));
      return { w: a, h: d, x: T(n.x, 0, Math.max(0, t - 90)), y: T(n.y, 0, Math.max(0, e - 40)) };
    }
    function ye(n, t, e) {
      try {
        const x = JSON.parse(localStorage.getItem(n) || "null");
        if (x && typeof x.x == "number") return Q({ ...e, ...x });
      } catch {
      }
      const a = window.innerWidth || 1280, d = window.innerHeight || 800;
      return { x: Math.max(16, a - e.w - t.x), y: t.y, w: Math.min(e.w, a - 16), h: Math.min(e.h, d - 16) };
    }
    function Z(n, t, e) {
      const a = u(ye(n, t, e)), d = U(() => ({ translate: `${a.value.x}px ${a.value.y}px`, width: `${a.value.w}px`, height: `${a.value.h}px` })), x = () => {
        try {
          localStorage.setItem(n, JSON.stringify(a.value));
        } catch {
        }
      };
      function Me(p) {
        p.target.setPointerCapture?.(p.pointerId);
        const X = p.clientX, Y = p.clientY, j = a.value.x, J = a.value.y, z = (P) => {
          a.value = { ...a.value, x: Math.max(0, Math.min(window.innerWidth - 90, j + P.clientX - X)), y: Math.max(0, Math.min(window.innerHeight - 40, J + P.clientY - Y)) };
        }, O = () => {
          window.removeEventListener("pointermove", z), window.removeEventListener("pointerup", O), x();
        };
        window.addEventListener("pointermove", z), window.addEventListener("pointerup", O);
      }
      function Le(p) {
        p.stopPropagation();
        const X = p.clientX, Y = p.clientY, j = a.value.w, J = a.value.h, z = (P) => {
          a.value = { ...a.value, w: Math.min(Math.max(280, j + P.clientX - X), Math.max(280, window.innerWidth - 16)), h: Math.min(Math.max(220, J + P.clientY - Y), Math.max(220, window.innerHeight - 16)) };
        }, O = () => {
          window.removeEventListener("pointermove", z), window.removeEventListener("pointerup", O), x();
        };
        window.addEventListener("pointermove", z), window.addEventListener("pointerup", O);
      }
      return ve(() => {
        const p = () => {
          a.value = Q(a.value), x();
        };
        window.addEventListener("resize", p), pe(() => window.removeEventListener("resize", p));
      }), { s: a, style: d, startDrag: Me, startResize: Le };
    }
    const L = u(!1), _ = u(!1), { style: ge, startDrag: ee, startResize: te } = Z("0kay.life.social.list", { x: 12, y: 64 }, { w: 340, h: 460 }), { style: _e, startDrag: ne, startResize: ae } = Z("0kay.life.social.chat", { x: 344, y: 64 }, { w: 380, h: 520 }), oe = u(location.pathname === "/");
    function S() {
      oe.value = location.pathname === "/";
    }
    (function() {
      const t = history.pushState, e = history.replaceState;
      history.pushState = function(...a) {
        const d = t.apply(history, a);
        return window.dispatchEvent(new Event("0kay:location")), d;
      }, history.replaceState = function(...a) {
        const d = e.apply(history, a);
        return window.dispatchEvent(new Event("0kay:location")), d;
      };
    })();
    const $ = u(!1), g = u(!1), H = u(0), I = u(""), ie = {};
    let q = !1, B;
    async function K(n, t = {}) {
      const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: n, payload: t }) });
      if (!e.ok) throw new Error(await e.text());
      return e.json();
    }
    async function se() {
      try {
        const t = (await K("chat_conversations", { limit: 100 })).conversations || [];
        f.value = t;
        let e = "";
        for (const a of t) {
          const d = ie[a.conversation];
          q && a.last_direction === "out" && d !== void 0 && a.last_at !== d && (!e || a.last_at > e) && (e = a.last_at, I.value = a.conversation);
        }
        q && e && ($.value = !0, g.value = !1, H.value += 1);
        for (const a of t) ie[a.conversation] = a.last_at;
        q = !0;
      } catch {
      }
    }
    async function R() {
      if (!v.value) {
        w.value = [];
        return;
      }
      try {
        const t = (await K("chat_messages", { conversation: v.value, limit: 200 })).messages || [], e = t.length !== w.value.length, d = w.value.length === 0 || ke();
        w.value = t, e && d && be();
      } catch {
      }
    }
    function ke() {
      const n = V.value;
      return n ? n.scrollHeight - n.scrollTop - n.clientHeight < 80 : !0;
    }
    function be() {
      de(() => {
        const n = V.value;
        n && (n.scrollTop = n.scrollHeight);
      });
    }
    function k(n) {
      return n ? n.name || (n.kind === "group" ? i("life.chat.groupPrefix", { id: n.peer_id }) : n.peer_id) : "";
    }
    function N(n) {
      return !n || !n.peer_id || n.conversation.startsWith("bili") ? "" : n.kind === "group" ? `https://p.qlogo.cn/gh/${n.peer_id}/${n.peer_id}/100` : `https://q1.qlogo.cn/g?b=qq&nk=${n.peer_id}&s=100`;
    }
    function le(n) {
      const t = new Date(n);
      return Number.isNaN(t.getTime()) ? "" : t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    function xe(n) {
      return { image: i("life.chat.image"), record: i("life.chat.voice"), video: i("life.chat.video"), face: i("life.chat.face") }[n] || i("life.chat.media");
    }
    const m = U(() => f.value.find((n) => n.conversation === v.value) || null);
    function re(n) {
      v.value = n, w.value = [], b.value = "", R(), _.value = !0;
    }
    const b = u("");
    async function ue() {
      const n = C.value.trim();
      if (!(!n || M.value || !v.value)) {
        M.value = !0;
        try {
          const t = m.value?.adapter_id || "", e = await K("chat_send", { conversation: v.value, text: n, adapter_id: t });
          if (e && e.ok === !1) throw new Error(e.error || i("life.chat.sendFailed"));
          C.value = "", b.value = "", await R();
        } catch (t) {
          const e = String(t?.message || "").trim() || i("life.chat.sendFailed");
          b.value = e, setTimeout(() => {
            b.value === e && (b.value = "");
          }, He);
        } finally {
          M.value = !1;
        }
      }
    }
    function Ee() {
      $.value = !1, H.value = 0, re(I.value);
    }
    const ce = u(null), Ce = U(() => $.value && !g.value);
    return $e(Ce, (n) => {
      n && de(() => ce.value?.focus());
    }), ve(() => {
      se(), B = setInterval(() => {
        se(), _.value && R();
      }, 2500), window.addEventListener("0kay:location", S), window.addEventListener("popstate", S), S();
    }), pe(() => {
      B && clearInterval(B), window.removeEventListener("0kay:location", S), window.removeEventListener("popstate", S);
    }), (n, t) => (l(), r(
      F,
      null,
      [
        oe.value ? (l(), r("aside", {
          key: 0,
          class: "dock",
          "aria-label": i("life.chat.dockAria")
        }, [
          o("button", {
            type: "button",
            class: E(["dock-btn", { active: L.value }]),
            title: i("life.chat.tab"),
            onClick: t[0] || (t[0] = (e) => L.value = !L.value)
          }, [...t[15] || (t[15] = [
            o(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              },
              [
                o("path", {
                  d: "M4 6h16M4 12h16M4 18h10",
                  stroke: "currentColor",
                  "stroke-width": "1.7",
                  "stroke-linecap": "round"
                })
              ],
              -1
              /* CACHED */
            )
          ])], 10, Ne),
          o("button", {
            type: "button",
            class: E(["dock-btn", { active: _.value }]),
            title: i("life.chat.title"),
            onClick: t[1] || (t[1] = (e) => _.value = !_.value)
          }, [...t[16] || (t[16] = [
            o(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              },
              [
                o("path", {
                  d: "M4 5h16v11H8l-4 3V5z",
                  stroke: "currentColor",
                  "stroke-width": "1.7",
                  "stroke-linejoin": "round"
                })
              ],
              -1
              /* CACHED */
            )
          ])], 10, Fe)
        ], 8, Ie)) : c("v-if", !0),
        W(A, { name: "lsw-fade" }, {
          default: D(() => [
            L.value ? (l(), r("section", {
              key: 0,
              class: "panel",
              style: fe(h(ge)),
              "aria-label": i("life.chat.listAria")
            }, [
              o(
                "div",
                {
                  class: "toolbar",
                  onPointerdown: t[3] || (t[3] = //@ts-ignore
                  (...e) => h(ee) && h(ee)(...e))
                },
                [
                  t[17] || (t[17] = o(
                    "span",
                    {
                      class: "grab",
                      "aria-hidden": "true"
                    },
                    "⠿",
                    -1
                    /* CACHED */
                  )),
                  o(
                    "strong",
                    null,
                    s(i("life.chat.tab")),
                    1
                    /* TEXT */
                  ),
                  o(
                    "span",
                    Ae,
                    s(f.value.length),
                    1
                    /* TEXT */
                  ),
                  o("button", {
                    type: "button",
                    title: i("life.chat.collapse"),
                    onClick: t[2] || (t[2] = (e) => L.value = !1)
                  }, "✕", 8, De)
                ],
                32
                /* NEED_HYDRATION */
              ),
              o("div", Ve, [
                f.value.length ? c("v-if", !0) : (l(), r(
                  "p",
                  qe,
                  s(i("life.chat.noConversations")),
                  1
                  /* TEXT */
                )),
                (l(!0), r(
                  F,
                  null,
                  G(f.value, (e) => (l(), r("button", {
                    key: e.conversation,
                    class: E(["row", { selected: e.conversation === v.value }]),
                    onClick: (a) => re(e.conversation)
                  }, [
                    o(
                      "span",
                      {
                        class: E(["avatar", e.kind])
                      },
                      [
                        N(e) ? (l(), r("img", {
                          key: 0,
                          src: N(e),
                          alt: k(e),
                          loading: "lazy",
                          onError: t[4] || (t[4] = (a) => a.target.style.display = "none")
                        }, null, 40, Ke)) : c("v-if", !0),
                        o(
                          "span",
                          Re,
                          s(e.kind === "group" ? i("life.chat.groupInitial") : k(e).slice(0, 1) || "?"),
                          1
                          /* TEXT */
                        )
                      ],
                      2
                      /* CLASS */
                    ),
                    o("span", Xe, [
                      o("span", Ye, [
                        o(
                          "strong",
                          null,
                          s(k(e)),
                          1
                          /* TEXT */
                        ),
                        o(
                          "small",
                          null,
                          s(le(e.last_at)),
                          1
                          /* TEXT */
                        )
                      ]),
                      o("span", je, [
                        e.last_direction === "out" ? (l(), r(
                          "span",
                          Je,
                          s(i("life.chat.me")) + ":",
                          1
                          /* TEXT */
                        )) : c("v-if", !0),
                        he(
                          " " + s(e.last_text || i("life.chat.mediaOnly")),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ], 10, Be))),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              o(
                "div",
                {
                  class: "resize",
                  onPointerdown: t[5] || (t[5] = //@ts-ignore
                  (...e) => h(te) && h(te)(...e))
                },
                null,
                32
                /* NEED_HYDRATION */
              )
            ], 12, We)) : c("v-if", !0)
          ]),
          _: 1
          /* STABLE */
        }),
        W(A, { name: "lsw-fade" }, {
          default: D(() => [
            _.value ? (l(), r("section", {
              key: 0,
              class: "panel",
              style: fe(h(_e)),
              "aria-label": i("life.chat.chatAria")
            }, [
              o(
                "div",
                {
                  class: "toolbar",
                  onPointerdown: t[8] || (t[8] = //@ts-ignore
                  (...e) => h(ne) && h(ne)(...e))
                },
                [
                  t[18] || (t[18] = o(
                    "span",
                    {
                      class: "grab",
                      "aria-hidden": "true"
                    },
                    "⠿",
                    -1
                    /* CACHED */
                  )),
                  o(
                    "span",
                    {
                      class: E(["avatar sm", m.value?.kind])
                    },
                    [
                      N(m.value) ? (l(), r("img", {
                        key: 0,
                        src: N(m.value),
                        alt: k(m.value),
                        onError: t[6] || (t[6] = (e) => e.target.style.display = "none")
                      }, null, 40, Ge)) : c("v-if", !0),
                      o(
                        "span",
                        Qe,
                        s(m.value ? m.value.kind === "group" ? i("life.chat.groupInitial") : k(m.value).slice(0, 1) : "?"),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  ),
                  o(
                    "strong",
                    null,
                    s(k(m.value) || i("life.chat.pickConversation")),
                    1
                    /* TEXT */
                  ),
                  o("button", {
                    type: "button",
                    title: i("life.chat.collapse"),
                    onClick: t[7] || (t[7] = (e) => _.value = !1)
                  }, "✕", 8, Ze)
                ],
                32
                /* NEED_HYDRATION */
              ),
              o(
                "div",
                {
                  ref_key: "scroller",
                  ref: V,
                  class: "thread"
                },
                [
                  v.value ? w.value.length ? c("v-if", !0) : (l(), r(
                    "p",
                    tt,
                    s(i("life.chat.noMessages")),
                    1
                    /* TEXT */
                  )) : (l(), r(
                    "p",
                    et,
                    s(i("life.chat.pickConversation")),
                    1
                    /* TEXT */
                  )),
                  (l(!0), r(
                    F,
                    null,
                    G(w.value, (e) => (l(), r(
                      "div",
                      {
                        key: e.id,
                        class: E(["msg", e.direction])
                      },
                      [
                        o("div", nt, [
                          e.direction === "in" && e.peer_name ? (l(), r(
                            "span",
                            at,
                            s(e.peer_name),
                            1
                            /* TEXT */
                          )) : c("v-if", !0),
                          e.text ? (l(), r(
                            "span",
                            ot,
                            s(e.text),
                            1
                            /* TEXT */
                          )) : c("v-if", !0),
                          (l(!0), r(
                            F,
                            null,
                            G(e.media, (a) => (l(), r(
                              "span",
                              {
                                key: a,
                                class: "chip"
                              },
                              s(xe(a)),
                              1
                              /* TEXT */
                            ))),
                            128
                            /* KEYED_FRAGMENT */
                          )),
                          o(
                            "span",
                            it,
                            s(le(e.at)),
                            1
                            /* TEXT */
                          )
                        ])
                      ],
                      2
                      /* CLASS */
                    ))),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ],
                512
                /* NEED_PATCH */
              ),
              v.value ? (l(), r("footer", st, [
                b.value ? (l(), r(
                  "p",
                  lt,
                  s(b.value),
                  1
                  /* TEXT */
                )) : c("v-if", !0),
                ze(o("textarea", {
                  "onUpdate:modelValue": t[9] || (t[9] = (e) => C.value = e),
                  rows: "1",
                  placeholder: i("life.chat.placeholder"),
                  onKeydown: we(me(ue, ["exact", "prevent"]), ["enter"])
                }, null, 40, rt), [
                  [Oe, C.value]
                ]),
                o("button", {
                  disabled: M.value || !C.value.trim(),
                  onClick: ue
                }, s(M.value ? i("life.chat.sending") : i("life.chat.send")), 9, ut)
              ])) : c("v-if", !0),
              o(
                "div",
                {
                  class: "resize",
                  onPointerdown: t[10] || (t[10] = //@ts-ignore
                  (...e) => h(ae) && h(ae)(...e))
                },
                null,
                32
                /* NEED_HYDRATION */
              )
            ], 12, Ue)) : c("v-if", !0)
          ]),
          _: 1
          /* STABLE */
        }),
        W(A, { name: "lsw-fade" }, {
          default: D(() => [
            $.value && !g.value ? (l(), r(
              "div",
              {
                key: 0,
                class: "lsw-scrim",
                onClick: t[12] || (t[12] = me((e) => g.value = !0, ["self"])),
                onKeydown: t[13] || (t[13] = we((e) => g.value = !0, ["esc"]))
              },
              [
                o("section", {
                  ref_key: "dialogEl",
                  ref: ce,
                  class: "lsw-dialog",
                  role: "dialog",
                  "aria-modal": "true",
                  tabindex: "-1",
                  "aria-label": i("life.chat.replied")
                }, [
                  o("header", null, [
                    o("div", null, [
                      t[19] || (t[19] = o(
                        "span",
                        { class: "lsw-eyebrow" },
                        "L.I.F.E · SOCIAL",
                        -1
                        /* CACHED */
                      )),
                      o(
                        "h2",
                        null,
                        s(i("life.chat.replied")),
                        1
                        /* TEXT */
                      )
                    ]),
                    o(
                      "button",
                      {
                        onClick: t[11] || (t[11] = (e) => g.value = !0)
                      },
                      s(i("life.chat.later")),
                      1
                      /* TEXT */
                    )
                  ]),
                  o(
                    "p",
                    dt,
                    s(k(f.value.find((e) => e.conversation === I.value))),
                    1
                    /* TEXT */
                  ),
                  o(
                    "p",
                    vt,
                    s(f.value.find((e) => e.conversation === I.value)?.last_text || i("life.chat.mediaOnly")),
                    1
                    /* TEXT */
                  ),
                  o("footer", null, [
                    o(
                      "button",
                      {
                        class: "lsw-primary",
                        onClick: Ee
                      },
                      s(i("life.chat.open")),
                      1
                      /* TEXT */
                    )
                  ])
                ], 8, ct)
              ],
              32
              /* NEED_HYDRATION */
            )) : c("v-if", !0)
          ]),
          _: 1
          /* STABLE */
        }),
        W(A, { name: "lsw-fab" }, {
          default: D(() => [
            $.value && g.value ? (l(), r("button", {
              key: 0,
              class: "lsw-fab",
              onClick: t[14] || (t[14] = (e) => g.value = !1)
            }, [
              he(
                s(i("life.chat.replied")),
                1
                /* TEXT */
              ),
              H.value > 1 ? (l(), r(
                "span",
                pt,
                s(H.value),
                1
                /* TEXT */
              )) : c("v-if", !0)
            ])) : c("v-if", !0)
          ]),
          _: 1
          /* STABLE */
        })
      ],
      64
      /* STABLE_FRAGMENT */
    ));
  }
}), ht = (y, i) => {
  const f = y.__vccOpts || y;
  for (const [v, w] of i)
    f[v] = w;
  return f;
}, wt = /* @__PURE__ */ ht(ft, [["__scopeId", "data-v-5506380f"]]);
function gt() {
  const y = document.createElement("div");
  y.id = "0kay-life-social-window", document.body.appendChild(y);
  const i = Pe(wt);
  return i.mount(y), () => {
    try {
      i.unmount();
    } catch {
    }
    y.remove();
  };
}
export {
  gt as default,
  gt as install
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".muted[data-v-5506380f]{color:var(--md-on-surface-variant);font-size:13px}.pad[data-v-5506380f]{padding:14px}.dock[data-v-5506380f]{position:fixed;right:16px;top:76px;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 8px;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}.dock-btn[data-v-5506380f]{position:relative;width:42px;height:42px;display:grid;place-items:center;border:0;border-radius:14px;background:transparent;color:var(--md-on-surface-variant);cursor:pointer;transition:background-color .16s,color .16s,transform .16s var(--ease-emphasized-decel)}.dock-btn[data-v-5506380f]:hover{background:var(--md-secondary-container);color:var(--md-on-surface);transform:translateY(-1px)}.dock-btn[data-v-5506380f]:active{transform:scale(.94)}.dock-btn.active[data-v-5506380f]{background:color-mix(in srgb,var(--md-primary) 18%,transparent);color:var(--md-primary)}.dock-btn[data-v-5506380f]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.panel[data-v-5506380f]{position:fixed;left:0;top:0;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;background:var(--md-surface-container-low);box-shadow:var(--shadow-4);color:var(--md-on-surface)}.toolbar[data-v-5506380f]{display:flex;align-items:center;gap:6px;padding:7px 9px;background:var(--md-surface-container-high);color:var(--md-on-surface);cursor:grab;touch-action:none;user-select:none;flex:0 0 auto}.toolbar[data-v-5506380f]:active{cursor:grabbing}.toolbar .grab[data-v-5506380f]{font-size:13px;line-height:1;color:var(--md-on-surface-variant);padding:0 2px;cursor:grab}.toolbar strong[data-v-5506380f]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:650}.toolbar .count[data-v-5506380f]{flex:none;min-width:20px;height:20px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-size:11.5px;font-weight:700}.toolbar button[data-v-5506380f]{width:28px;height:28px;padding:0;display:inline-grid;place-items:center;border:0;border-radius:8px;font-size:13px;line-height:1;color:var(--md-on-surface-variant);background:transparent;cursor:pointer;flex-shrink:0}#app .toolbar button[data-v-5506380f]{min-height:0}.toolbar button[data-v-5506380f]:hover{background:var(--md-surface-container-highest)}.list-body[data-v-5506380f]{flex:1;min-height:0;overflow-y:auto;padding:6px;display:flex;flex-direction:column;gap:2px}.row[data-v-5506380f]{display:flex;gap:10px;align-items:center;width:100%;text-align:left;border:0;background:transparent;color:inherit;font:inherit;padding:8px 9px;border-radius:12px;cursor:pointer}.row[data-v-5506380f]:hover{background:var(--md-surface-container-high)}.row.selected[data-v-5506380f]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.row-main[data-v-5506380f]{min-width:0;flex:1;display:flex;flex-direction:column;gap:2px}.row-top[data-v-5506380f]{display:flex;justify-content:space-between;gap:8px}.row-top strong[data-v-5506380f]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}.row-top small[data-v-5506380f]{font-size:11px;opacity:.6;flex:0 0 auto}.row-sub[data-v-5506380f]{font-size:12px;opacity:.75;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.me[data-v-5506380f]{color:var(--md-primary);font-weight:700}.row.selected .me[data-v-5506380f]{color:inherit;opacity:.85}.avatar[data-v-5506380f]{position:relative;width:38px;height:38px;flex:0 0 38px;border-radius:50%;overflow:hidden;background:var(--md-primary);color:var(--md-on-primary, #fff);display:flex;align-items:center;justify-content:center;font-weight:800}.avatar.group[data-v-5506380f]{border-radius:12px}.avatar.sm[data-v-5506380f]{width:26px;height:26px;flex-basis:26px}.avatar img[data-v-5506380f]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.fb[data-v-5506380f]{font-size:14px}.thread[data-v-5506380f]{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:0}.msg[data-v-5506380f]{display:flex;opacity:1;transform:none;transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}@starting-style{.msg[data-v-5506380f]{opacity:0;transform:translateY(4px)}}.msg.out[data-v-5506380f]{justify-content:flex-end}.bubble[data-v-5506380f]{max-width:82%;background:var(--md-surface-container-low);border-radius:8px 24px 24px;padding:8px 12px;display:flex;flex-direction:column;gap:3px;box-shadow:var(--shadow-1)}.msg.out .bubble[data-v-5506380f]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px}.sender[data-v-5506380f]{font-size:11px;font-weight:700;opacity:.75}.text[data-v-5506380f]{white-space:pre-wrap;word-break:break-word;font-size:13px}.chip[data-v-5506380f]{align-self:flex-start;font-size:11px;padding:1px 8px;border-radius:999px;background:color-mix(in srgb,currentColor 16%,transparent)}.time[data-v-5506380f]{align-self:flex-end;font-size:10px;opacity:.6}.composer[data-v-5506380f]{display:flex;gap:8px;padding:8px 10px;border-top:1px solid var(--md-outline-variant);align-items:flex-end;flex:0 0 auto;flex-wrap:wrap}.send-error[data-v-5506380f]{flex:1 0 100%;margin:0;padding:6px 10px;border-radius:8px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:12px;overflow-wrap:anywhere}.composer textarea[data-v-5506380f]{flex:1;resize:none;min-height:38px;max-height:110px;padding:9px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;outline:none}.composer textarea[data-v-5506380f]:focus{border-color:var(--md-primary)}.composer button[data-v-5506380f]{height:38px;padding:0 16px;border:0;border-radius:12px;background:var(--md-primary);color:var(--md-on-primary, #fff);font-weight:700;cursor:pointer}.composer button[data-v-5506380f]:disabled{opacity:.5;cursor:not-allowed}.resize[data-v-5506380f]{position:absolute;right:1px;bottom:1px;width:16px;height:16px;cursor:nwse-resize;touch-action:none;opacity:.5;background:repeating-linear-gradient(135deg,transparent 0 3px,var(--md-on-surface-variant) 3px 4px)}.resize[data-v-5506380f]:hover{opacity:.85}.lsw-scrim[data-v-5506380f]{position:fixed;inset:0;z-index:var(--z-modal, 4000);background:var(--md-scrim, color-mix(in srgb, #18132d 42%, transparent));backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.lsw-dialog[data-v-5506380f]{width:min(560px,100%);max-height:85vh;overflow:auto;border-radius:28px;background:var(--md-surface);color:var(--md-on-surface);padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.lsw-dialog header[data-v-5506380f]{display:flex;justify-content:space-between;align-items:center;gap:16px}.lsw-eyebrow[data-v-5506380f]{font-size:12px;letter-spacing:2px;color:var(--md-primary);font-weight:700}.lsw-dialog h2[data-v-5506380f]{font-size:24px;margin:8px 0}.lsw-meta[data-v-5506380f]{font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere;margin:0}.lsw-body[data-v-5506380f]{margin:16px 0;white-space:pre-wrap;overflow-wrap:anywhere}.lsw-dialog button[data-v-5506380f]{border:0;border-radius:999px;padding:12px 20px;font:inherit;cursor:pointer;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.lsw-dialog .lsw-primary[data-v-5506380f]{background:var(--md-primary);color:var(--md-on-primary, #fff)}.lsw-dialog footer[data-v-5506380f]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px}.lsw-fab[data-v-5506380f]{position:fixed;right:24px;bottom:24px;z-index:var(--z-toast, 6000);display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:12px 20px;background:var(--md-primary);color:var(--md-on-primary, #fff);font:inherit;font-weight:700;cursor:pointer;box-shadow:var(--shadow-3)}.lsw-badge[data-v-5506380f]{background:var(--md-error);color:var(--md-on-error, #fff);border-radius:999px;padding:0 8px;font-size:12px}.lsw-fade-enter-active[data-v-5506380f]{transition:opacity .24s var(--ease-emphasized-decel),transform .24s var(--ease-emphasized-decel)}.lsw-fade-leave-active[data-v-5506380f]{transition:opacity .14s var(--ease-emphasized-accel),transform .14s var(--ease-emphasized-accel)}.lsw-fade-enter-from[data-v-5506380f],.lsw-fade-leave-to[data-v-5506380f]{opacity:0;transform:translateY(-6px) scale(.99)}.lsw-fab-enter-active[data-v-5506380f]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.lsw-fab-leave-active[data-v-5506380f]{transition:opacity .14s var(--ease-emphasized-accel),transform .14s var(--ease-emphasized-accel)}.lsw-fab-enter-from[data-v-5506380f],.lsw-fab-leave-to[data-v-5506380f]{opacity:0;transform:translateY(12px) scale(.9)}@media(prefers-reduced-motion:reduce){.lsw-fade-enter-active[data-v-5506380f],.lsw-fade-leave-active[data-v-5506380f],.lsw-fab-enter-active[data-v-5506380f],.lsw-fab-leave-active[data-v-5506380f]{transition-duration:1ms}.msg[data-v-5506380f]{transition:none}}\n";document.head.appendChild(s)}})();
