import { watch as Se, nextTick as Pe, ref as f, defineComponent as Te, computed as W, onMounted as De, onUnmounted as $e, resolveComponent as Me, openBlock as u, createElementBlock as r, createElementVNode as s, toDisplayString as a, unref as o, createVNode as X, Transition as Z, withCtx as j, createCommentVNode as p, Fragment as A, renderList as R, withKeys as he, withModifiers as B, normalizeStyle as Ne, normalizeClass as F, createTextVNode as O, createBlock as ee, Teleport as xe } from "vue";
import { useI18n as Ae } from "vue-i18n";
import { useRouter as Re } from "vue-router";
import { useSettingsSectionsStore as Fe, useUIPatchesStore as He, useConfirm as Le, MarkdownContent as Ke } from "@0kay/host";
function Ie(y, e, C) {
  let m = null, S = !1;
  Se(y, async (g) => {
    g && !S ? (m = document.activeElement, await Pe(), (C?.value ?? e.value)?.focus()) : !g && S && (m?.focus?.(), m = null), S = g;
  });
  function z(g) {
    if (g.key !== "Tab" || !e.value) return;
    const _ = Array.from(
      e.value.querySelectorAll(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((E) => E.offsetParent !== null || E === document.activeElement);
    if (!_.length) return;
    const k = _[0], P = _[_.length - 1];
    g.shiftKey && document.activeElement === k ? (g.preventDefault(), P.focus()) : !g.shiftKey && document.activeElement === P && (g.preventDefault(), k.focus());
  }
  return { onKeydown: z };
}
const U = f([]);
let je = 0;
const te = /* @__PURE__ */ new Map();
function Be(y) {
  const e = te.get(y);
  e && clearTimeout(e), te.delete(y), U.value = U.value.filter((C) => C.id !== y);
}
function q(y, e = "info", C) {
  const m = {
    id: ++je,
    kind: e,
    message: y,
    duration: e === "error" ? 6500 : 3500
  };
  return U.value = [...U.value.slice(-4), m], te.set(m.id, setTimeout(() => Be(m.id), m.duration)), m.id;
}
const Oe = { class: "plugins-page" }, qe = { class: "pp-hero page-hero" }, Ue = { class: "pp-hero-copy" }, ze = { class: "subtitle" }, Ve = ["disabled"], Ye = {
  key: 0,
  class: "error-banner",
  role: "alert"
}, Je = {
  key: 0,
  class: "notice-banner",
  role: "status"
}, Ge = {
  key: 0,
  class: "pp-stats"
}, Qe = { class: "pp-stat tone-primary" }, We = { class: "pp-stat tone-success" }, Xe = { class: "pp-stat tone-muted" }, Ze = { class: "pp-stat tone-muted" }, et = { class: "plugin-grid" }, tt = ["title", "onClick", "onKeydown"], nt = { class: "plugin-top" }, st = { class: "plugin-titles" }, lt = { class: "plugin-id" }, at = { class: "plugin-meta" }, it = { class: "caps" }, ot = {
  key: 0,
  class: "cap-chip muted"
}, ut = ["title"], rt = ["checked", "disabled", "onChange"], ct = { class: "plugin-switch-label" }, dt = ["disabled", "onClick"], pt = ["onClick"], gt = ["href"], mt = {
  key: 0,
  class: "plugin-grid",
  "aria-hidden": "true"
}, vt = {
  key: 1,
  class: "empty-state"
}, ht = { class: "hint" }, ft = ["aria-label"], bt = { class: "pd-head" }, yt = { class: "pd-titles" }, _t = { class: "pd-pkg" }, kt = ["aria-label"], wt = { class: "pd-meta" }, Ct = {
  key: 0,
  class: "pd-chip"
}, Et = {
  key: 1,
  class: "pd-chip"
}, St = ["href"], Pt = { class: "pd-body" }, Tt = {
  key: 0,
  class: "pd-perms builtin"
}, Dt = {
  key: 1,
  class: "pd-perms"
}, $t = { key: 0 }, Mt = { key: 1 }, Nt = { key: 2 }, xt = {
  key: 3,
  class: "pd-hint"
}, At = {
  key: 2,
  class: "pd-hint"
}, Rt = {
  key: 3,
  class: "pd-hint err"
}, Ft = {
  key: 5,
  class: "pd-hint"
}, Ht = { class: "pd-foot" }, Lt = ["href"], Kt = ["disabled"], It = ["disabled", "title"], jt = ["disabled"], Bt = /* @__PURE__ */ Te({
  __name: "PluginsPage",
  setup(y) {
    const { t: e } = Ae(), C = Re(), m = Fe(), S = He(), { confirm: z } = Le(), g = f([]), _ = f(!1), k = f(""), P = f(""), E = f(""), V = f(""), T = f("");
    let Y = null;
    const i = f(null), ne = f(null), se = f(null), { onKeydown: le } = Ie(
      () => !!i.value,
      ne,
      se
    ), D = f(""), J = f(!1), $ = f(""), ae = /* @__PURE__ */ new Map();
    let H = 0;
    const fe = W(() => g.value.filter((n) => n.runtime && L(n)).length), be = W(() => g.value.filter((n) => n.runtime && n.disabled).length), ye = W(() => g.value.filter((n) => n.installedSource === "pm").length);
    function ie(n) {
      return (n.includes("/") && n.split("/").pop() || n).replace(/^0kay-/, "") || n;
    }
    function N(n) {
      return n.repository ? n.repository.replace(/\.git$/, "") : "";
    }
    function oe(n) {
      const l = /github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?$/.exec(n.repository || "");
      return l ? `${l[1]}/${l[2]}` : "";
    }
    const _e = [
      "README.md",
      "readme.md",
      "README.MD",
      "Readme.md",
      "README.markdown",
      "README.rst",
      "README.txt",
      "README"
    ];
    async function ke(n) {
      const l = oe(n);
      if (!l) {
        $.value = e("plugins.noRepo");
        return;
      }
      const d = ae.get(l);
      if (d !== void 0) {
        D.value = d;
        return;
      }
      const t = ++H;
      J.value = !0, $.value = "", D.value = "";
      try {
        let v = "";
        for (const b of _e) {
          const M = await fetch(`https://raw.githubusercontent.com/${l}/HEAD/${b}`);
          if (t !== H) return;
          if (M.ok) {
            v = await M.text();
            break;
          }
          if (M.status !== 404) throw new Error(`README HTTP ${M.status}`);
        }
        if (t !== H) return;
        if (!v.trim()) throw new Error(e("plugins.readmeNotFound"));
        ae.set(l, v), D.value = v;
      } catch (v) {
        t === H && ($.value = v?.message || String(v));
      } finally {
        t === H && (J.value = !1);
      }
    }
    function G(n) {
      i.value = n, ke(n);
    }
    function I() {
      i.value = null, D.value = "", $.value = "";
    }
    function L(n) {
      return !n.runtime || n.disabled ? !1 : n.status.includes("HEALTHY") || n.status === "HEALTHY";
    }
    async function x(n = !1) {
      n || (_.value = !0, k.value = "");
      try {
        const [l, d] = await Promise.all([fetch("/api/plugins"), fetch("/api/plugins/pm/installed")]), t = l.ok ? await l.json() : [], v = d.ok ? await d.json() : {}, b = Array.isArray(v) ? v : v.installed || [], M = Array.isArray(t) ? t : [], ge = /* @__PURE__ */ new Map();
        for (const c of M) ge.set(c.name, c);
        const K = [], me = /* @__PURE__ */ new Set();
        for (const c of b) {
          const w = c.name, ve = ie(w), h = ge.get(ve);
          h && me.add(ve), K.push({
            key: w,
            id: h?.plugin_id || w,
            name: h?.name || ie(w),
            packageName: w,
            version: h?.version || "",
            type: h?.type || "",
            capabilities: h?.capabilities || [],
            status: h?.status || "",
            health: h?.health || "",
            lifecycle: h?.lifecycle || "",
            needs_attention: h?.needs_attention,
            active_tasks: h?.active_tasks || 0,
            disabled: h?.disabled,
            runtime: !!h,
            installedSource: c.source === "pm" ? "pm" : "platform",
            repository: c.repository,
            builtin: h?.builtin,
            permissions: h?.permissions
          });
        }
        for (const c of M)
          me.has(c.name) || K.push({
            key: c.name,
            id: c.plugin_id,
            name: c.name,
            packageName: c.name,
            version: c.version,
            type: c.type,
            capabilities: c.capabilities || [],
            status: c.status,
            health: c.health || "",
            lifecycle: c.lifecycle || "",
            needs_attention: c.needs_attention,
            active_tasks: c.active_tasks,
            disabled: c.disabled,
            runtime: !0,
            installedSource: "",
            builtin: c.builtin,
            permissions: c.permissions
          });
        if (K.sort((c, w) => Number(w.runtime) - Number(c.runtime) || c.name.localeCompare(w.name)), g.value = K, i.value) {
          const c = K.find((w) => w.key === i.value?.key) || null;
          i.value = c, c || (D.value = "", $.value = "");
        }
      } catch (l) {
        n || (k.value = l.message || e("plugins.actionFailed"));
      } finally {
        _.value = !1;
      }
    }
    async function ue(n) {
      const l = !!n.disabled;
      E.value = n.name || n.id;
      try {
        const d = await fetch(`/api/plugins/${encodeURIComponent(n.name || n.id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: l })
        });
        if (!d.ok) throw new Error(`HTTP ${d.status}`);
        await Promise.all([x(), m.fetchSections(), S.fetchPatches()]);
      } catch (d) {
        k.value = d.message || e("plugins.actionFailed"), q(d.message || e("plugins.actionFailed"), "error");
      } finally {
        E.value = "";
      }
    }
    async function we(n) {
      const l = n.name || n.id;
      V.value = l;
      try {
        const d = await fetch(`/api/plugins/${encodeURIComponent(l)}/reconnect`, { method: "POST" });
        if (!d.ok) throw new Error(`HTTP ${d.status}`);
        const t = await d.json().catch(() => ({}));
        await x(), q(e("plugins.reconnected", { n: Number(t?.connections_closed) || 0 }));
      } catch (d) {
        k.value = d.message || e("plugins.actionFailed"), q(d.message || e("plugins.actionFailed"), "error");
      } finally {
        V.value = "";
      }
    }
    async function Ce() {
      for (let n = 0; n < 180; n++) {
        await new Promise((t) => setTimeout(t, 1e3));
        const l = await fetch("/api/plugins/pm/status");
        if (!l.ok) continue;
        const d = await l.json();
        if (d.status === "done") return;
        if (d.status === "error") throw new Error(d.error || e("plugins.actionFailed"));
      }
      throw new Error(e("plugins.timeout"));
    }
    async function re(n) {
      const l = n.packageName;
      if (await z({
        title: e("plugins.uninstallTitle"),
        message: e("plugins.uninstallConfirm", { pkg: l }),
        confirmLabel: e("plugins.uninstall"),
        danger: !0
      })) {
        P.value = "", T.value = l;
        try {
          const t = await fetch("/api/plugins/pm/uninstall", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ package: l })
          });
          if (!t.ok) {
            const v = await t.json().catch(() => ({}));
            throw new Error(v.error || `HTTP ${t.status}`);
          }
          await Ce(), P.value = e("plugins.uninstalled", { pkg: l }), await Promise.all([x(), m.fetchSections()]);
        } catch (t) {
          k.value = t.message || e("plugins.actionFailed"), q(t.message || e("plugins.actionFailed"), "error");
        } finally {
          T.value = "";
        }
      }
    }
    function ce(n) {
      return m.sections.find(
        (l) => l.id === n.name || l.plugin_name === n.name || l.plugin_id === n.id
      );
    }
    function Ee(n) {
      const l = ce(n);
      C.push({ path: "/settings", query: l ? { tab: l.id } : {} });
    }
    function de(n) {
      if (n.disabled) return e("plugins.disabled");
      if (n.runtime) {
        switch (n.lifecycle) {
          case "degraded":
            return e("plugins.healthDegraded");
          case "failed":
            return e("plugins.healthStale");
          case "starting":
            return e("plugins.phaseStarting");
          case "installed":
            return e("plugins.phaseInstalled");
          case "healthy":
            return e("agents.healthy");
        }
        return n.health === "degraded" ? e("plugins.healthDegraded") : n.health === "stale" ? e("plugins.healthStale") : L(n) ? e("agents.healthy") : n.status;
      }
      return n.installedSource === "pm" ? e("plugins.installedLabel") : e("plugins.platformComponent");
    }
    function Q(n) {
      return n.runtime ? e("plugins.runtime") : n.installedSource === "pm" ? e("plugins.thirdParty") : e("plugins.platform");
    }
    function pe(n) {
      n.key === "Escape" && i.value && I();
    }
    return De(() => {
      x(), m.fetchSections(), window.addEventListener("keydown", pe), Y = setInterval(() => {
        document.hidden || !T.value && !E.value && !i.value && x(!0);
      }, 5e3);
    }), $e(() => {
      Y && clearInterval(Y), window.removeEventListener("keydown", pe);
    }), (n, l) => {
      const d = Me("router-link");
      return u(), r("div", Oe, [
        s("header", qe, [
          s("div", Ue, [
            l[6] || (l[6] = s("p", { class: "pp-eyebrow page-eyebrow" }, "0KAY · PLUGINS", -1)),
            s("h1", null, a(o(e)("plugins.title")), 1),
            s("p", ze, a(o(e)("plugins.subtitle")), 1)
          ]),
          s("button", {
            class: "btn btn-tonal",
            onClick: l[0] || (l[0] = (t) => x()),
            disabled: _.value
          }, a(_.value ? o(e)("agents.refreshing") : o(e)("agents.refresh")), 9, Ve)
        ]),
        X(Z, { name: "banner" }, {
          default: j(() => [
            k.value ? (u(), r("div", Ye, a(k.value), 1)) : p("", !0)
          ]),
          _: 1
        }),
        X(Z, { name: "banner" }, {
          default: j(() => [
            P.value ? (u(), r("div", Je, a(P.value), 1)) : p("", !0)
          ]),
          _: 1
        }),
        g.value.length ? (u(), r("section", Ge, [
          s("div", Qe, [
            s("b", null, a(g.value.length), 1),
            s("span", null, a(o(e)("plugins.total")), 1)
          ]),
          s("div", We, [
            s("b", null, a(fe.value), 1),
            s("span", null, a(o(e)("plugins.healthy")), 1)
          ]),
          s("div", Xe, [
            s("b", null, a(be.value), 1),
            s("span", null, a(o(e)("plugins.disabled")), 1)
          ]),
          s("div", Ze, [
            s("b", null, a(ye.value), 1),
            s("span", null, a(o(e)("plugins.removable")), 1)
          ])
        ])) : p("", !0),
        s("div", et, [
          (u(!0), r(A, null, R(g.value, (t, v) => (u(), r("article", {
            key: t.key,
            class: F(["plugin-card", { healthy: L(t), disabled: t.runtime && t.disabled }]),
            style: Ne({ animationDelay: `${Math.min(v, 12) * 40}ms` }),
            role: "button",
            tabindex: "0",
            title: o(e)("plugins.viewDetails", { name: t.name }),
            onClick: (b) => G(t),
            onKeydown: [
              he(B((b) => G(t), ["prevent"]), ["enter"]),
              he(B((b) => G(t), ["prevent"]), ["space"])
            ]
          }, [
            s("div", nt, [
              l[8] || (l[8] = s("div", { class: "plugin-icon" }, [
                s("svg", {
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none"
                }, [
                  s("path", {
                    d: "M8 4v4M16 4v4M4 10h16M7 14h4v6H7v-6zM13 14h4v3h-4v-3z",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  })
                ])
              ], -1)),
              s("div", st, [
                s("h2", null, [
                  O(a(t.name), 1),
                  s("span", {
                    class: F(["source-badge", t.runtime ? "rt" : t.installedSource])
                  }, a(Q(t)), 3)
                ]),
                s("span", lt, a(t.packageName), 1)
              ]),
              s("span", {
                class: F(["status-chip", { ok: L(t), off: t.runtime && t.disabled }])
              }, [
                l[7] || (l[7] = s("span", { class: "status-dot" }, null, -1)),
                O(a(de(t)), 1)
              ], 2)
            ]),
            s("dl", at, [
              s("div", null, [
                s("dt", null, a(o(e)("agents.version")), 1),
                s("dd", null, a(t.version || "—"), 1)
              ]),
              s("div", null, [
                s("dt", null, a(o(e)("agents.tasks")), 1),
                s("dd", null, a(t.runtime ? t.active_tasks : "—"), 1)
              ]),
              s("div", null, [
                s("dt", null, a(o(e)("plugins.type")), 1),
                s("dd", null, a(t.runtime ? t.type || "—" : Q(t)), 1)
              ])
            ]),
            s("div", it, [
              (u(!0), r(A, null, R(t.capabilities, (b) => (u(), r("span", {
                key: b,
                class: "cap-chip"
              }, a(b), 1))), 128)),
              t.capabilities?.length ? p("", !0) : (u(), r("span", ot, "—"))
            ]),
            s("div", {
              class: "card-actions",
              onClick: l[1] || (l[1] = B(() => {
              }, ["stop"]))
            }, [
              t.runtime ? (u(), r("label", {
                key: 0,
                class: F(["plugin-switch", { on: !t.disabled, busy: E.value === t.name }]),
                title: t.disabled ? o(e)("plugins.enable") : o(e)("plugins.disable")
              }, [
                s("input", {
                  type: "checkbox",
                  checked: !t.disabled,
                  disabled: E.value === t.name,
                  onChange: (b) => ue(t)
                }, null, 40, rt),
                l[9] || (l[9] = s("span", { class: "plugin-switch-slider" }, null, -1)),
                s("span", ct, a(t.disabled ? o(e)("plugins.enable") : o(e)("plugins.disable")), 1)
              ], 10, ut)) : p("", !0),
              t.installedSource === "pm" ? (u(), r("button", {
                key: 1,
                class: "btn btn-danger-tonal",
                disabled: T.value === t.packageName,
                onClick: (b) => re(t)
              }, a(T.value === t.packageName ? o(e)("plugins.uninstalling") : o(e)("plugins.uninstall")), 9, dt)) : p("", !0),
              ce(t) ? (u(), r("button", {
                key: 2,
                class: "btn btn-tonal",
                onClick: (b) => Ee(t)
              }, a(o(e)("plugins.configure")), 9, pt)) : t.name === "agent" ? (u(), ee(d, {
                key: 3,
                class: "btn btn-tonal",
                to: "/settings?tab=agent"
              }, {
                default: j(() => [
                  O(a(o(e)("plugins.configure")), 1)
                ]),
                _: 1
              })) : p("", !0),
              N(t) ? (u(), r("a", {
                key: 4,
                class: "btn btn-tonal",
                href: N(t),
                target: "_blank",
                rel: "noopener noreferrer"
              }, a(o(e)("plugins.repo")), 9, gt)) : p("", !0)
            ])
          ], 46, tt))), 128)),
          _.value && g.value.length === 0 ? (u(), r("div", mt, [
            (u(), r(A, null, R(4, (t) => s("div", {
              key: t,
              class: "plugin-card plugin-skeleton"
            })), 64))
          ])) : p("", !0),
          g.value.length === 0 && !_.value ? (u(), r("div", vt, [
            s("p", null, a(o(e)("plugins.empty")), 1),
            s("p", ht, a(o(e)("plugins.emptyHint")), 1)
          ])) : p("", !0)
        ]),
        (u(), ee(xe, { to: "body" }, [
          X(Z, { name: "pd" }, {
            default: j(() => [
              i.value ? (u(), r("div", {
                key: 0,
                class: "pd-scrim",
                onClick: B(I, ["self"])
              }, [
                s("section", {
                  ref_key: "detailDialog",
                  ref: ne,
                  class: "pd-dialog",
                  role: "dialog",
                  "aria-modal": "true",
                  "aria-label": o(e)("plugins.detailsLabel", { name: i.value.name }),
                  tabindex: "-1",
                  onKeydown: l[5] || (l[5] = //@ts-ignore
                  (...t) => o(le) && o(le)(...t))
                }, [
                  s("header", bt, [
                    s("div", yt, [
                      s("h2", null, [
                        O(a(i.value.name) + " ", 1),
                        s("span", {
                          class: F(["source-badge", i.value.runtime ? "rt" : i.value.installedSource])
                        }, a(Q(i.value)), 3)
                      ]),
                      s("span", _t, a(i.value.packageName), 1)
                    ]),
                    s("button", {
                      ref_key: "detailCloseBtn",
                      ref: se,
                      class: "pd-close",
                      type: "button",
                      "aria-label": o(e)("common.close"),
                      onClick: I
                    }, "×", 8, kt)
                  ]),
                  s("div", wt, [
                    i.value.version ? (u(), r("span", Ct, "v" + a(i.value.version), 1)) : p("", !0),
                    i.value.type ? (u(), r("span", Et, a(i.value.type), 1)) : p("", !0),
                    s("span", {
                      class: F(["pd-chip", { ok: L(i.value) }])
                    }, a(de(i.value)), 3),
                    N(i.value) ? (u(), r("a", {
                      key: 2,
                      class: "pd-repo",
                      href: N(i.value),
                      target: "_blank",
                      rel: "noopener noreferrer"
                    }, a(oe(i.value)), 9, St)) : p("", !0)
                  ]),
                  s("div", Pt, [
                    i.value.builtin ? (u(), r("div", Tt, a(o(e)("plugins.builtinFullPerms")), 1)) : i.value.permissions ? (u(), r("div", Dt, [
                      i.value.permissions.api_requires?.length ? (u(), r("div", $t, [
                        s("h4", null, a(o(e)("plugins.callsCore")), 1),
                        s("ul", null, [
                          (u(!0), r(A, null, R(i.value.permissions.api_requires, (t) => (u(), r("li", { key: t }, a(t), 1))), 128))
                        ])
                      ])) : p("", !0),
                      i.value.permissions.api_exposes?.length ? (u(), r("div", Mt, [
                        s("h4", null, a(o(e)("plugins.exposes")), 1),
                        s("ul", null, [
                          (u(!0), r(A, null, R(i.value.permissions.api_exposes, (t) => (u(), r("li", { key: t }, a(t), 1))), 128))
                        ])
                      ])) : p("", !0),
                      i.value.permissions.egress?.length ? (u(), r("div", Nt, [
                        s("h4", null, a(o(e)("plugins.egress")), 1),
                        s("ul", null, [
                          (u(!0), r(A, null, R(i.value.permissions.egress, (t) => (u(), r("li", { key: t }, a(t), 1))), 128))
                        ])
                      ])) : p("", !0),
                      !i.value.permissions.api_requires?.length && !i.value.permissions.api_exposes?.length && !i.value.permissions.egress?.length ? (u(), r("p", xt, a(o(e)("plugins.noExtraPerms")), 1)) : p("", !0)
                    ])) : p("", !0),
                    J.value ? (u(), r("p", At, a(o(e)("plugins.loadingReadme")), 1)) : $.value ? (u(), r("p", Rt, a($.value), 1)) : D.value ? (u(), ee(o(Ke), {
                      key: 4,
                      content: D.value
                    }, null, 8, ["content"])) : (u(), r("p", Ft, a(o(e)("plugins.noReadme")), 1))
                  ]),
                  s("footer", Ht, [
                    N(i.value) ? (u(), r("a", {
                      key: 0,
                      class: "btn btn-tonal",
                      href: N(i.value),
                      target: "_blank",
                      rel: "noopener noreferrer"
                    }, a(o(e)("plugins.openRepo")), 9, Lt)) : p("", !0),
                    i.value.runtime ? (u(), r("button", {
                      key: 1,
                      class: "btn btn-tonal",
                      type: "button",
                      disabled: E.value === i.value.name,
                      onClick: l[2] || (l[2] = (t) => ue(i.value))
                    }, a(i.value.disabled ? o(e)("plugins.enable") : o(e)("plugins.disable")), 9, Kt)) : p("", !0),
                    i.value.runtime && !i.value.disabled ? (u(), r("button", {
                      key: 2,
                      class: "btn btn-tonal",
                      type: "button",
                      disabled: V.value === (i.value.name || i.value.id),
                      title: o(e)("plugins.reconnectHint"),
                      onClick: l[3] || (l[3] = (t) => we(i.value))
                    }, a(o(e)("plugins.reconnect")), 9, It)) : p("", !0),
                    i.value.installedSource === "pm" ? (u(), r("button", {
                      key: 3,
                      class: "btn btn-danger-tonal",
                      type: "button",
                      disabled: T.value === i.value.packageName,
                      onClick: l[4] || (l[4] = (t) => re(i.value))
                    }, a(T.value === i.value.packageName ? o(e)("plugins.uninstalling") : o(e)("plugins.uninstall")), 9, jt)) : p("", !0),
                    s("button", {
                      class: "btn btn-tonal",
                      type: "button",
                      onClick: I
                    }, a(o(e)("settings.close")), 1)
                  ])
                ], 40, ft)
              ])) : p("", !0)
            ]),
            _: 1
          })
        ]))
      ]);
    };
  }
}), Ot = (y, e) => {
  const C = y.__vccOpts || y;
  for (const [m, S] of e)
    C[m] = S;
  return C;
}, Yt = /* @__PURE__ */ Ot(Bt, [["__scopeId", "data-v-01fdf782"]]);
export {
  Yt as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style-plugins')){const s=document.createElement('style');s.id='webui-plugin-style-plugins';s.textContent=".plugins-page[data-v-01fdf782]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-01fdf782]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.error-banner[data-v-01fdf782]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-01fdf782]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.banner-enter-active[data-v-01fdf782]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}.banner-leave-active[data-v-01fdf782]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.banner-enter-from[data-v-01fdf782],.banner-leave-to[data-v-01fdf782]{opacity:0;transform:translateY(-6px)}.pp-stats[data-v-01fdf782]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-01fdf782]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-01fdf782]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-01fdf782]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-01fdf782]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-01fdf782]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-01fdf782]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-01fdf782]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(312px,100%),1fr));gap:var(--space-lg)}.plugin-skeleton[data-v-01fdf782]{min-height:168px;animation:plugin-sk-01fdf782 1.2s ease-in-out infinite}@keyframes plugin-sk-01fdf782{0%,to{opacity:.55}50%{opacity:.85}}@media(prefers-reduced-motion:reduce){.plugin-skeleton[data-v-01fdf782]{animation:none;opacity:.7}}#app .plugins-page .plugin-card[data-v-01fdf782]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-01fdf782 var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-01fdf782{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-01fdf782]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-01fdf782]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-01fdf782]{opacity:.62}.plugin-top[data-v-01fdf782]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-01fdf782]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-01fdf782]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-01fdf782]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-01fdf782]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-01fdf782]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-01fdf782]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-01fdf782]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-01fdf782]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-01fdf782]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-01fdf782]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-01fdf782]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-01fdf782]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-01fdf782]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-01fdf782]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-01fdf782]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-01fdf782]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-01fdf782]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-01fdf782]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-01fdf782]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-01fdf782]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-01fdf782]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-01fdf782]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-01fdf782]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-01fdf782]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-01fdf782]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-01fdf782]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-01fdf782]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-01fdf782]{white-space:nowrap}.empty-state[data-v-01fdf782]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-01fdf782]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-01fdf782]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-01fdf782]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-01fdf782]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-01fdf782]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-01fdf782]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-01fdf782],.pd-leave-to[data-v-01fdf782]{opacity:0}.pd-enter-active .pd-dialog[data-v-01fdf782]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-01fdf782]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-01fdf782],.pd-leave-to .pd-dialog[data-v-01fdf782]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-01fdf782]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-01fdf782]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-01fdf782]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-01fdf782]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-01fdf782]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-01fdf782]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-01fdf782]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-01fdf782]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-01fdf782]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-01fdf782]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-01fdf782]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-01fdf782]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-01fdf782]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-01fdf782]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-01fdf782]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-01fdf782]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-01fdf782]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-01fdf782]{color:var(--md-error)}.pd-foot[data-v-01fdf782]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-01fdf782]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn[data-v-01fdf782]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-01fdf782],.pd-leave-active[data-v-01fdf782],.pd-enter-active .pd-dialog[data-v-01fdf782],.pd-leave-active .pd-dialog[data-v-01fdf782]{transition:none}.pd-enter-from .pd-dialog[data-v-01fdf782],.pd-leave-to .pd-dialog[data-v-01fdf782]{transform:none}}\n";document.head.appendChild(s)}})();
