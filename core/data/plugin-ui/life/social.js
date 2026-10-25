import { defineComponent as ze, ref as u, computed as U, watch as Oe, nextTick as ve, onMounted as fe, onUnmounted as pe, openBlock as l, createElementBlock as r, Fragment as F, createElementVNode as o, normalizeClass as E, createCommentVNode as c, createVNode as W, Transition as A, withCtx as D, normalizeStyle as he, unref as h, toDisplayString as s, renderList as G, createTextVNode as we, withDirectives as He, withKeys as me, withModifiers as ye, vModelText as Pe, createApp as Te } from "vue";
import { i18n as Ie } from "@0kay/host";
const Ne = 3200, Fe = ["aria-label"], We = ["title"], Ae = ["title"], De = ["aria-label"], Ve = { class: "count" }, qe = ["title"], Be = { class: "list-body" }, Ke = {
  key: 0,
  class: "muted pad"
}, Re = ["onClick"], Xe = ["src", "alt"], Ye = { class: "fb" }, je = { class: "row-main" }, Je = { class: "row-top" }, Ue = { class: "row-sub" }, Ge = {
  key: 0,
  class: "me"
}, Qe = ["aria-label"], Ze = ["src", "alt"], et = { class: "fb" }, tt = ["title"], nt = {
  key: 0,
  class: "muted pad"
}, at = {
  key: 1,
  class: "muted pad"
}, ot = { class: "bubble" }, it = {
  key: 0,
  class: "sender"
}, st = {
  key: 1,
  class: "text"
}, lt = { class: "time" }, rt = {
  key: 0,
  class: "composer"
}, ut = {
  key: 0,
  class: "send-error",
  role: "alert"
}, ct = ["placeholder", "onKeydown"], dt = ["disabled"], vt = ["aria-label"], ft = { class: "lsw-meta" }, pt = { class: "lsw-body" }, ht = {
  key: 0,
  class: "lsw-badge"
}, wt = /* @__PURE__ */ ze({
  __name: "SocialWindow",
  setup(y) {
    const i = (n, t) => Ie.global.t(n, t ?? {}), f = u([]), d = u(""), w = u([]), C = u(""), M = u(!1), V = u(null), P = (n, t, e) => Math.max(t, Math.min(e, n));
    function Q(n) {
      const t = window.innerWidth || 1280, e = window.innerHeight || 800, a = P(n.w, 280, Math.max(280, t - 16)), p = P(n.h, 220, Math.max(220, e - 16));
      return { w: a, h: p, x: P(n.x, 0, Math.max(0, t - 90)), y: P(n.y, 0, Math.max(0, e - 40)) };
    }
    function ge(n, t, e) {
      try {
        const x = JSON.parse(localStorage.getItem(n) || "null");
        if (x && typeof x.x == "number") return Q({ ...e, ...x });
      } catch {
      }
      const a = window.innerWidth || 1280, p = window.innerHeight || 800;
      return { x: Math.max(16, a - e.w - t.x), y: t.y, w: Math.min(e.w, a - 16), h: Math.min(e.h, p - 16) };
    }
    function Z(n, t, e) {
      const a = u(ge(n, t, e)), p = U(() => ({ translate: `${a.value.x}px ${a.value.y}px`, width: `${a.value.w}px`, height: `${a.value.h}px` })), x = () => {
        try {
          localStorage.setItem(n, JSON.stringify(a.value));
        } catch {
        }
      };
      function Se(v) {
        v.target.setPointerCapture?.(v.pointerId);
        const X = v.clientX, Y = v.clientY, j = a.value.x, J = a.value.y, z = (H) => {
          a.value = { ...a.value, x: Math.max(0, Math.min(window.innerWidth - 90, j + H.clientX - X)), y: Math.max(0, Math.min(window.innerHeight - 40, J + H.clientY - Y)) };
        }, O = () => {
          window.removeEventListener("pointermove", z), window.removeEventListener("pointerup", O), x();
        };
        window.addEventListener("pointermove", z), window.addEventListener("pointerup", O);
      }
      function $e(v) {
        v.stopPropagation();
        const X = v.clientX, Y = v.clientY, j = a.value.w, J = a.value.h, z = (H) => {
          a.value = { ...a.value, w: Math.min(Math.max(280, j + H.clientX - X), Math.max(280, window.innerWidth - 16)), h: Math.min(Math.max(220, J + H.clientY - Y), Math.max(220, window.innerHeight - 16)) };
        }, O = () => {
          window.removeEventListener("pointermove", z), window.removeEventListener("pointerup", O), x();
        };
        window.addEventListener("pointermove", z), window.addEventListener("pointerup", O);
      }
      return fe(() => {
        const v = () => {
          a.value = Q(a.value), x();
        };
        window.addEventListener("resize", v), pe(() => window.removeEventListener("resize", v));
      }), { s: a, style: p, startDrag: Se, startResize: $e };
    }
    const L = u(!1), _ = u(!1), { style: _e, startDrag: ee, startResize: te } = Z("0kay.life.social.list", { x: 12, y: 64 }, { w: 340, h: 460 }), { style: ke, startDrag: ne, startResize: ae } = Z("0kay.life.social.chat", { x: 344, y: 64 }, { w: 380, h: 520 }), oe = u(location.pathname === "/");
    function S() {
      oe.value = location.pathname === "/";
    }
    let ie = !1;
    function be() {
      if (ie) return;
      ie = !0;
      const n = history.pushState, t = history.replaceState;
      history.pushState = function(...e) {
        const a = n.apply(history, e);
        return window.dispatchEvent(new Event("0kay:location")), a;
      }, history.replaceState = function(...e) {
        const a = t.apply(history, e);
        return window.dispatchEvent(new Event("0kay:location")), a;
      };
    }
    be();
    const $ = u(!1), g = u(!1), T = u(0), I = u(""), se = {};
    let q = !1, B;
    async function K(n, t = {}) {
      const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: n, payload: t }) });
      if (!e.ok) throw new Error(await e.text());
      return e.json();
    }
    async function le() {
      try {
        const t = (await K("chat_conversations", { limit: 100 })).conversations || [];
        f.value = t;
        let e = "";
        for (const a of t) {
          const p = se[a.conversation];
          q && a.last_direction === "out" && p !== void 0 && a.last_at !== p && (!e || a.last_at > e) && (e = a.last_at, I.value = a.conversation);
        }
        q && e && ($.value = !0, g.value = !1, T.value += 1);
        for (const a of t) se[a.conversation] = a.last_at;
        q = !0;
      } catch {
      }
    }
    async function R() {
      if (!d.value) {
        w.value = [];
        return;
      }
      try {
        const t = (await K("chat_messages", { conversation: d.value, limit: 200 })).messages || [], e = t.length !== w.value.length, p = w.value.length === 0 || xe();
        w.value = t, e && p && Ee();
      } catch {
      }
    }
    function xe() {
      const n = V.value;
      return n ? n.scrollHeight - n.scrollTop - n.clientHeight < 80 : !0;
    }
    function Ee() {
      ve(() => {
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
    function re(n) {
      const t = new Date(n);
      return Number.isNaN(t.getTime()) ? "" : t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    function Ce(n) {
      return { image: i("life.chat.image"), record: i("life.chat.voice"), video: i("life.chat.video"), face: i("life.chat.face") }[n] || i("life.chat.media");
    }
    const m = U(() => f.value.find((n) => n.conversation === d.value) || null);
    function ue(n) {
      d.value = n, w.value = [], b.value = "", R(), _.value = !0;
    }
    const b = u("");
    async function ce() {
      const n = C.value.trim();
      if (!(!n || M.value || !d.value)) {
        M.value = !0;
        try {
          const t = m.value?.adapter_id || "", e = await K("chat_send", { conversation: d.value, text: n, adapter_id: t });
          if (e && e.ok === !1) throw new Error(e.error || i("life.chat.sendFailed"));
          C.value = "", b.value = "", await R();
        } catch (t) {
          const e = String(t?.message || "").trim() || i("life.chat.sendFailed");
          b.value = e, setTimeout(() => {
            b.value === e && (b.value = "");
          }, Ne);
        } finally {
          M.value = !1;
        }
      }
    }
    function Me() {
      $.value = !1, T.value = 0, ue(I.value);
    }
    const de = u(null), Le = U(() => $.value && !g.value);
    return Oe(Le, (n) => {
      n && ve(() => de.value?.focus());
    }), fe(() => {
      le(), B = setInterval(() => {
        le(), _.value && R();
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
          ])], 10, We),
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
          ])], 10, Ae)
        ], 8, Fe)) : c("v-if", !0),
        W(A, { name: "lsw-fade" }, {
          default: D(() => [
            L.value ? (l(), r("section", {
              key: 0,
              class: "panel",
              style: he(h(_e)),
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
                    Ve,
                    s(f.value.length),
                    1
                    /* TEXT */
                  ),
                  o("button", {
                    type: "button",
                    title: i("life.chat.collapse"),
                    onClick: t[2] || (t[2] = (e) => L.value = !1)
                  }, "✕", 8, qe)
                ],
                32
                /* NEED_HYDRATION */
              ),
              o("div", Be, [
                f.value.length ? c("v-if", !0) : (l(), r(
                  "p",
                  Ke,
                  s(i("life.chat.noConversations")),
                  1
                  /* TEXT */
                )),
                (l(!0), r(
                  F,
                  null,
                  G(f.value, (e) => (l(), r("button", {
                    key: e.conversation,
                    class: E(["row", { selected: e.conversation === d.value }]),
                    onClick: (a) => ue(e.conversation)
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
                        }, null, 40, Xe)) : c("v-if", !0),
                        o(
                          "span",
                          Ye,
                          s(e.kind === "group" ? i("life.chat.groupInitial") : k(e).slice(0, 1) || "?"),
                          1
                          /* TEXT */
                        )
                      ],
                      2
                      /* CLASS */
                    ),
                    o("span", je, [
                      o("span", Je, [
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
                          s(re(e.last_at)),
                          1
                          /* TEXT */
                        )
                      ]),
                      o("span", Ue, [
                        e.last_direction === "out" ? (l(), r(
                          "span",
                          Ge,
                          s(i("life.chat.me")) + ":",
                          1
                          /* TEXT */
                        )) : c("v-if", !0),
                        we(
                          " " + s(e.last_text || i("life.chat.mediaOnly")),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ], 10, Re))),
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
            ], 12, De)) : c("v-if", !0)
          ]),
          _: 1
          /* STABLE */
        }),
        W(A, { name: "lsw-fade" }, {
          default: D(() => [
            _.value ? (l(), r("section", {
              key: 0,
              class: "panel",
              style: he(h(ke)),
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
                      }, null, 40, Ze)) : c("v-if", !0),
                      o(
                        "span",
                        et,
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
                  }, "✕", 8, tt)
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
                  d.value ? w.value.length ? c("v-if", !0) : (l(), r(
                    "p",
                    at,
                    s(i("life.chat.noMessages")),
                    1
                    /* TEXT */
                  )) : (l(), r(
                    "p",
                    nt,
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
                        o("div", ot, [
                          e.direction === "in" && e.peer_name ? (l(), r(
                            "span",
                            it,
                            s(e.peer_name),
                            1
                            /* TEXT */
                          )) : c("v-if", !0),
                          e.text ? (l(), r(
                            "span",
                            st,
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
                              s(Ce(a)),
                              1
                              /* TEXT */
                            ))),
                            128
                            /* KEYED_FRAGMENT */
                          )),
                          o(
                            "span",
                            lt,
                            s(re(e.at)),
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
              d.value ? (l(), r("footer", rt, [
                b.value ? (l(), r(
                  "p",
                  ut,
                  s(b.value),
                  1
                  /* TEXT */
                )) : c("v-if", !0),
                He(o("textarea", {
                  "onUpdate:modelValue": t[9] || (t[9] = (e) => C.value = e),
                  rows: "1",
                  placeholder: i("life.chat.placeholder"),
                  onKeydown: me(ye(ce, ["exact", "prevent"]), ["enter"])
                }, null, 40, ct), [
                  [Pe, C.value]
                ]),
                o("button", {
                  disabled: M.value || !C.value.trim(),
                  onClick: ce
                }, s(M.value ? i("life.chat.sending") : i("life.chat.send")), 9, dt)
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
            ], 12, Qe)) : c("v-if", !0)
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
                onClick: t[12] || (t[12] = ye((e) => g.value = !0, ["self"])),
                onKeydown: t[13] || (t[13] = me((e) => g.value = !0, ["esc"]))
              },
              [
                o("section", {
                  ref_key: "dialogEl",
                  ref: de,
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
                    ft,
                    s(k(f.value.find((e) => e.conversation === I.value))),
                    1
                    /* TEXT */
                  ),
                  o(
                    "p",
                    pt,
                    s(f.value.find((e) => e.conversation === I.value)?.last_text || i("life.chat.mediaOnly")),
                    1
                    /* TEXT */
                  ),
                  o("footer", null, [
                    o(
                      "button",
                      {
                        class: "lsw-primary",
                        onClick: Me
                      },
                      s(i("life.chat.open")),
                      1
                      /* TEXT */
                    )
                  ])
                ], 8, vt)
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
              we(
                s(i("life.chat.replied")),
                1
                /* TEXT */
              ),
              T.value > 1 ? (l(), r(
                "span",
                ht,
                s(T.value),
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
}), mt = (y, i) => {
  const f = y.__vccOpts || y;
  for (const [d, w] of i)
    f[d] = w;
  return f;
}, yt = /* @__PURE__ */ mt(wt, [["__scopeId", "data-v-12cf6d41"]]);
function kt() {
  const y = document.createElement("div");
  y.id = "0kay-life-social-window", document.body.appendChild(y);
  const i = Te(yt);
  return i.mount(y), () => {
    try {
      i.unmount();
    } catch {
    }
    y.remove();
  };
}
export {
  kt as default,
  kt as install
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".muted[data-v-12cf6d41]{color:var(--md-on-surface-variant);font-size:13px}.pad[data-v-12cf6d41]{padding:14px}.dock[data-v-12cf6d41]{position:fixed;right:16px;top:76px;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 8px;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}.dock-btn[data-v-12cf6d41]{position:relative;width:42px;height:42px;display:grid;place-items:center;border:0;border-radius:14px;background:transparent;color:var(--md-on-surface-variant);cursor:pointer;transition:background-color .16s,color .16s,transform .16s var(--ease-emphasized-decel)}.dock-btn[data-v-12cf6d41]:hover{background:var(--md-secondary-container);color:var(--md-on-surface);transform:translateY(-1px)}.dock-btn[data-v-12cf6d41]:active{transform:scale(.94)}.dock-btn.active[data-v-12cf6d41]{background:color-mix(in srgb,var(--md-primary) 18%,transparent);color:var(--md-primary)}.dock-btn[data-v-12cf6d41]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.panel[data-v-12cf6d41]{position:fixed;left:0;top:0;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;background:var(--md-surface-container-low);box-shadow:var(--shadow-4);color:var(--md-on-surface)}.toolbar[data-v-12cf6d41]{display:flex;align-items:center;gap:6px;padding:7px 9px;background:var(--md-surface-container-high);color:var(--md-on-surface);cursor:grab;touch-action:none;user-select:none;flex:0 0 auto}.toolbar[data-v-12cf6d41]:active{cursor:grabbing}.toolbar .grab[data-v-12cf6d41]{font-size:13px;line-height:1;color:var(--md-on-surface-variant);padding:0 2px;cursor:grab}.toolbar strong[data-v-12cf6d41]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:650}.toolbar .count[data-v-12cf6d41]{flex:none;min-width:20px;height:20px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-size:11.5px;font-weight:700}.toolbar button[data-v-12cf6d41]{width:28px;height:28px;padding:0;display:inline-grid;place-items:center;border:0;border-radius:8px;font-size:13px;line-height:1;color:var(--md-on-surface-variant);background:transparent;cursor:pointer;flex-shrink:0}#app .toolbar button[data-v-12cf6d41]{min-height:0}.toolbar button[data-v-12cf6d41]:hover{background:var(--md-surface-container-highest)}.list-body[data-v-12cf6d41]{flex:1;min-height:0;overflow-y:auto;padding:6px;display:flex;flex-direction:column;gap:2px}.row[data-v-12cf6d41]{display:flex;gap:10px;align-items:center;width:100%;text-align:left;border:0;background:transparent;color:inherit;font:inherit;padding:8px 9px;border-radius:12px;cursor:pointer}.row[data-v-12cf6d41]:hover{background:var(--md-surface-container-high)}.row.selected[data-v-12cf6d41]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.row-main[data-v-12cf6d41]{min-width:0;flex:1;display:flex;flex-direction:column;gap:2px}.row-top[data-v-12cf6d41]{display:flex;justify-content:space-between;gap:8px}.row-top strong[data-v-12cf6d41]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}.row-top small[data-v-12cf6d41]{font-size:11px;opacity:.6;flex:0 0 auto}.row-sub[data-v-12cf6d41]{font-size:12px;opacity:.75;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.me[data-v-12cf6d41]{color:var(--md-primary);font-weight:700}.row.selected .me[data-v-12cf6d41]{color:inherit;opacity:.85}.avatar[data-v-12cf6d41]{position:relative;width:38px;height:38px;flex:0 0 38px;border-radius:50%;overflow:hidden;background:var(--md-primary);color:var(--md-on-primary, #fff);display:flex;align-items:center;justify-content:center;font-weight:800}.avatar.group[data-v-12cf6d41]{border-radius:12px}.avatar.sm[data-v-12cf6d41]{width:26px;height:26px;flex-basis:26px}.avatar img[data-v-12cf6d41]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.fb[data-v-12cf6d41]{font-size:14px}.thread[data-v-12cf6d41]{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:0}.msg[data-v-12cf6d41]{display:flex;opacity:1;transform:none;transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}@starting-style{.msg[data-v-12cf6d41]{opacity:0;transform:translateY(4px)}}.msg.out[data-v-12cf6d41]{justify-content:flex-end}.bubble[data-v-12cf6d41]{max-width:82%;background:var(--md-surface-container-low);border-radius:8px 24px 24px;padding:8px 12px;display:flex;flex-direction:column;gap:3px;box-shadow:var(--shadow-1)}.msg.out .bubble[data-v-12cf6d41]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px}.sender[data-v-12cf6d41]{font-size:11px;font-weight:700;opacity:.75}.text[data-v-12cf6d41]{white-space:pre-wrap;word-break:break-word;font-size:13px}.chip[data-v-12cf6d41]{align-self:flex-start;font-size:11px;padding:1px 8px;border-radius:999px;background:color-mix(in srgb,currentColor 16%,transparent)}.time[data-v-12cf6d41]{align-self:flex-end;font-size:10px;opacity:.6}.composer[data-v-12cf6d41]{display:flex;gap:8px;padding:8px 10px;border-top:1px solid var(--md-outline-variant);align-items:flex-end;flex:0 0 auto;flex-wrap:wrap}.send-error[data-v-12cf6d41]{flex:1 0 100%;margin:0;padding:6px 10px;border-radius:8px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:12px;overflow-wrap:anywhere}.composer textarea[data-v-12cf6d41]{flex:1;resize:none;min-height:38px;max-height:110px;padding:9px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;outline:none}.composer textarea[data-v-12cf6d41]:focus{border-color:var(--md-primary)}.composer button[data-v-12cf6d41]{height:38px;padding:0 16px;border:0;border-radius:12px;background:var(--md-primary);color:var(--md-on-primary, #fff);font-weight:700;cursor:pointer}.composer button[data-v-12cf6d41]:disabled{opacity:.5;cursor:not-allowed}.resize[data-v-12cf6d41]{position:absolute;right:1px;bottom:1px;width:16px;height:16px;cursor:nwse-resize;touch-action:none;opacity:.5;background:repeating-linear-gradient(135deg,transparent 0 3px,var(--md-on-surface-variant) 3px 4px)}.resize[data-v-12cf6d41]:hover{opacity:.85}.lsw-scrim[data-v-12cf6d41]{position:fixed;inset:0;z-index:var(--z-modal, 4000);background:var(--md-scrim, color-mix(in srgb, #18132d 42%, transparent));backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.lsw-dialog[data-v-12cf6d41]{width:min(560px,100%);max-height:85vh;overflow:auto;border-radius:28px;background:var(--md-surface);color:var(--md-on-surface);padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.lsw-dialog header[data-v-12cf6d41]{display:flex;justify-content:space-between;align-items:center;gap:16px}.lsw-eyebrow[data-v-12cf6d41]{font-size:12px;letter-spacing:2px;color:var(--md-primary);font-weight:700}.lsw-dialog h2[data-v-12cf6d41]{font-size:24px;margin:8px 0}.lsw-meta[data-v-12cf6d41]{font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere;margin:0}.lsw-body[data-v-12cf6d41]{margin:16px 0;white-space:pre-wrap;overflow-wrap:anywhere}.lsw-dialog button[data-v-12cf6d41]{border:0;border-radius:999px;padding:12px 20px;font:inherit;cursor:pointer;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.lsw-dialog .lsw-primary[data-v-12cf6d41]{background:var(--md-primary);color:var(--md-on-primary, #fff)}.lsw-dialog footer[data-v-12cf6d41]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px}.lsw-fab[data-v-12cf6d41]{position:fixed;right:24px;bottom:24px;z-index:var(--z-toast, 6000);display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:12px 20px;background:var(--md-primary);color:var(--md-on-primary, #fff);font:inherit;font-weight:700;cursor:pointer;box-shadow:var(--shadow-3)}.lsw-badge[data-v-12cf6d41]{background:var(--md-error);color:var(--md-on-error, #fff);border-radius:999px;padding:0 8px;font-size:12px}.lsw-fade-enter-active[data-v-12cf6d41]{transition:opacity .24s var(--ease-emphasized-decel),transform .24s var(--ease-emphasized-decel)}.lsw-fade-leave-active[data-v-12cf6d41]{transition:opacity .14s var(--ease-emphasized-accel),transform .14s var(--ease-emphasized-accel)}.lsw-fade-enter-from[data-v-12cf6d41],.lsw-fade-leave-to[data-v-12cf6d41]{opacity:0;transform:translateY(-6px) scale(.99)}.lsw-fab-enter-active[data-v-12cf6d41]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.lsw-fab-leave-active[data-v-12cf6d41]{transition:opacity .14s var(--ease-emphasized-accel),transform .14s var(--ease-emphasized-accel)}.lsw-fab-enter-from[data-v-12cf6d41],.lsw-fab-leave-to[data-v-12cf6d41]{opacity:0;transform:translateY(12px) scale(.9)}@media(prefers-reduced-motion:reduce){.lsw-fade-enter-active[data-v-12cf6d41],.lsw-fade-leave-active[data-v-12cf6d41],.lsw-fab-enter-active[data-v-12cf6d41],.lsw-fab-leave-active[data-v-12cf6d41]{transition-duration:1ms}.msg[data-v-12cf6d41]{transition:none}}\n";document.head.appendChild(s)}})();
