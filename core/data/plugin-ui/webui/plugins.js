import { watch as Ce, nextTick as Ee, ref as f, defineComponent as Se, computed as G, onMounted as Pe, onUnmounted as Te, resolveComponent as De, openBlock as u, createElementBlock as r, createElementVNode as n, toDisplayString as l, unref as o, createVNode as Q, Transition as W, withCtx as j, createCommentVNode as d, Fragment as H, renderList as K, withKeys as ve, withModifiers as B, normalizeStyle as Me, normalizeClass as $, createTextVNode as q, createBlock as X, Teleport as xe } from "vue";
import { useI18n as Ne } from "vue-i18n";
import { useRouter as $e } from "vue-router";
import { useSettingsSectionsStore as Ae, useUIPatchesStore as Re, useConfirm as Le, MarkdownContent as Fe } from "@0kay/host";
function He(_, t, w) {
  let v = null, S = !1;
  Ce(_, async (p) => {
    p && !S ? (v = document.activeElement, await Ee(), (w?.value ?? t.value)?.focus()) : !p && S && (v?.focus?.(), v = null), S = p;
  });
  function U(p) {
    if (p.key !== "Tab" || !t.value) return;
    const y = Array.from(
      t.value.querySelectorAll(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((E) => E.offsetParent !== null || E === document.activeElement);
    if (!y.length) return;
    const C = y[0], P = y[y.length - 1];
    p.shiftKey && document.activeElement === C ? (p.preventDefault(), P.focus()) : !p.shiftKey && document.activeElement === P && (p.preventDefault(), C.focus());
  }
  return { onKeydown: U };
}
const O = f([]);
let Ke = 0;
const Z = /* @__PURE__ */ new Map();
function Ie(_) {
  const t = Z.get(_);
  t && clearTimeout(t), Z.delete(_), O.value = O.value.filter((w) => w.id !== _);
}
function ge(_, t = "info", w) {
  const v = {
    id: ++Ke,
    kind: t,
    message: _,
    duration: t === "error" ? 6500 : 3500
  };
  return O.value = [...O.value.slice(-4), v], Z.set(v.id, setTimeout(() => Ie(v.id), v.duration)), v.id;
}
const je = { class: "plugins-page" }, Be = { class: "pp-hero" }, qe = { class: "pp-hero-copy" }, Oe = { class: "subtitle" }, Ue = ["disabled"], ze = {
  key: 0,
  class: "error-banner",
  role: "alert"
}, Ve = {
  key: 0,
  class: "notice-banner",
  role: "status"
}, Ye = {
  key: 0,
  class: "pp-stats"
}, Je = { class: "pp-stat tone-primary" }, Ge = { class: "pp-stat tone-success" }, Qe = { class: "pp-stat tone-muted" }, We = { class: "pp-stat tone-muted" }, Xe = { class: "plugin-grid" }, Ze = ["title", "onClick", "onKeydown"], et = { class: "plugin-top" }, tt = { class: "plugin-titles" }, nt = { class: "plugin-id" }, st = { class: "plugin-meta" }, lt = { class: "caps" }, at = {
  key: 0,
  class: "cap-chip muted"
}, it = ["title"], ot = ["checked", "disabled", "onChange"], ut = { class: "plugin-switch-label" }, rt = ["disabled", "onClick"], ct = ["onClick"], dt = ["href"], pt = {
  key: 0,
  class: "empty-state"
}, mt = { class: "hint" }, vt = ["aria-label"], gt = { class: "pd-head" }, ft = { class: "pd-titles" }, ht = { class: "pd-pkg" }, bt = ["aria-label"], _t = { class: "pd-meta" }, yt = {
  key: 0,
  class: "pd-chip"
}, kt = {
  key: 1,
  class: "pd-chip"
}, wt = ["href"], Ct = { class: "pd-body" }, Et = {
  key: 0,
  class: "pd-perms builtin"
}, St = {
  key: 1,
  class: "pd-perms"
}, Pt = { key: 0 }, Tt = { key: 1 }, Dt = { key: 2 }, Mt = {
  key: 3,
  class: "pd-hint"
}, xt = {
  key: 2,
  class: "pd-hint"
}, Nt = {
  key: 3,
  class: "pd-hint err"
}, $t = {
  key: 5,
  class: "pd-hint"
}, At = { class: "pd-foot" }, Rt = ["href"], Lt = ["disabled"], Ft = ["disabled"], Ht = /* @__PURE__ */ Se({
  __name: "PluginsPage",
  setup(_) {
    const { t } = Ne(), w = $e(), v = Ae(), S = Re(), { confirm: U } = Le(), p = f([]), y = f(!1), C = f(""), P = f(""), E = f(""), T = f("");
    let z = null;
    const i = f(null), ee = f(null), te = f(null), { onKeydown: ne } = He(
      () => !!i.value,
      ee,
      te
    ), D = f(""), V = f(!1), M = f(""), se = /* @__PURE__ */ new Map();
    let A = 0;
    const fe = G(() => p.value.filter((s) => s.runtime && R(s)).length), he = G(() => p.value.filter((s) => s.runtime && s.disabled).length), be = G(() => p.value.filter((s) => s.installedSource === "pm").length);
    function le(s) {
      return (s.includes("/") && s.split("/").pop() || s).replace(/^0kay-/, "") || s;
    }
    function N(s) {
      return s.repository ? s.repository.replace(/\.git$/, "") : "";
    }
    function ae(s) {
      const a = /github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?$/.exec(s.repository || "");
      return a ? `${a[1]}/${a[2]}` : "";
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
    async function ye(s) {
      const a = ae(s);
      if (!a) {
        M.value = t("plugins.noRepo");
        return;
      }
      const m = se.get(a);
      if (m !== void 0) {
        D.value = m;
        return;
      }
      const e = ++A;
      V.value = !0, M.value = "", D.value = "";
      try {
        let g = "";
        for (const h of _e) {
          const x = await fetch(`https://raw.githubusercontent.com/${a}/HEAD/${h}`);
          if (e !== A) return;
          if (x.ok) {
            g = await x.text();
            break;
          }
          if (x.status !== 404) throw new Error(`README HTTP ${x.status}`);
        }
        if (e !== A) return;
        if (!g.trim()) throw new Error(t("plugins.readmeNotFound"));
        se.set(a, g), D.value = g;
      } catch (g) {
        e === A && (M.value = g?.message || String(g));
      } finally {
        e === A && (V.value = !1);
      }
    }
    function Y(s) {
      i.value = s, ye(s);
    }
    function I() {
      i.value = null, D.value = "", M.value = "";
    }
    function R(s) {
      return !s.runtime || s.disabled ? !1 : s.status.includes("HEALTHY") || s.status === "HEALTHY";
    }
    async function L(s = !1) {
      s || (y.value = !0, C.value = "");
      try {
        const [a, m] = await Promise.all([fetch("/api/plugins"), fetch("/api/plugins/pm/installed")]), e = a.ok ? await a.json() : [], g = m.ok ? await m.json() : {}, h = Array.isArray(g) ? g : g.installed || [], x = Array.isArray(e) ? e : [], de = /* @__PURE__ */ new Map();
        for (const c of x) de.set(c.name, c);
        const F = [], pe = /* @__PURE__ */ new Set();
        for (const c of h) {
          const k = c.name, me = le(k), b = de.get(me);
          b && pe.add(me), F.push({
            key: k,
            id: b?.plugin_id || k,
            name: b?.name || le(k),
            packageName: k,
            version: b?.version || "",
            type: b?.type || "",
            capabilities: b?.capabilities || [],
            status: b?.status || "",
            active_tasks: b?.active_tasks || 0,
            disabled: b?.disabled,
            runtime: !!b,
            installedSource: c.source === "pm" ? "pm" : "platform",
            repository: c.repository,
            builtin: b?.builtin,
            permissions: b?.permissions
          });
        }
        for (const c of x)
          pe.has(c.name) || F.push({
            key: c.name,
            id: c.plugin_id,
            name: c.name,
            packageName: c.name,
            version: c.version,
            type: c.type,
            capabilities: c.capabilities || [],
            status: c.status,
            active_tasks: c.active_tasks,
            disabled: c.disabled,
            runtime: !0,
            installedSource: "",
            builtin: c.builtin,
            permissions: c.permissions
          });
        if (F.sort((c, k) => Number(k.runtime) - Number(c.runtime) || c.name.localeCompare(k.name)), p.value = F, i.value) {
          const c = F.find((k) => k.key === i.value?.key) || null;
          i.value = c, c || (D.value = "", M.value = "");
        }
      } catch (a) {
        s || (C.value = a.message || t("plugins.actionFailed"));
      } finally {
        y.value = !1;
      }
    }
    async function ie(s) {
      const a = !!s.disabled;
      E.value = s.name || s.id;
      try {
        const m = await fetch(`/api/plugins/${encodeURIComponent(s.name || s.id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: a })
        });
        if (!m.ok) throw new Error(`HTTP ${m.status}`);
        await Promise.all([L(), v.fetchSections(), S.fetchPatches()]);
      } catch (m) {
        C.value = m.message || t("plugins.actionFailed"), ge(m.message || t("plugins.actionFailed"), "error");
      } finally {
        E.value = "";
      }
    }
    async function ke() {
      for (let s = 0; s < 180; s++) {
        await new Promise((e) => setTimeout(e, 1e3));
        const a = await fetch("/api/plugins/pm/status");
        if (!a.ok) continue;
        const m = await a.json();
        if (m.status === "done") return;
        if (m.status === "error") throw new Error(m.error || t("plugins.actionFailed"));
      }
      throw new Error(t("plugins.timeout"));
    }
    async function oe(s) {
      const a = s.packageName;
      if (await U({
        title: t("plugins.uninstallTitle"),
        message: t("plugins.uninstallConfirm", { pkg: a }),
        confirmLabel: t("plugins.uninstall"),
        danger: !0
      })) {
        P.value = "", T.value = a;
        try {
          const e = await fetch("/api/plugins/pm/uninstall", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ package: a })
          });
          if (!e.ok) {
            const g = await e.json().catch(() => ({}));
            throw new Error(g.error || `HTTP ${e.status}`);
          }
          await ke(), P.value = t("plugins.uninstalled", { pkg: a }), await Promise.all([L(), v.fetchSections()]);
        } catch (e) {
          C.value = e.message || t("plugins.actionFailed"), ge(e.message || t("plugins.actionFailed"), "error");
        } finally {
          T.value = "";
        }
      }
    }
    function ue(s) {
      return v.sections.find(
        (a) => a.id === s.name || a.plugin_name === s.name || a.plugin_id === s.id
      );
    }
    function we(s) {
      const a = ue(s);
      w.push({ path: "/settings", query: a ? { tab: a.id } : {} });
    }
    function re(s) {
      return s.disabled ? t("plugins.disabled") : s.runtime ? R(s) ? t("agents.healthy") : s.status : s.installedSource === "pm" ? t("plugins.installedLabel") : t("plugins.platformComponent");
    }
    function J(s) {
      return s.runtime ? t("plugins.runtime") : s.installedSource === "pm" ? t("plugins.thirdParty") : t("plugins.platform");
    }
    function ce(s) {
      s.key === "Escape" && i.value && I();
    }
    return Pe(() => {
      L(), v.fetchSections(), window.addEventListener("keydown", ce), z = setInterval(() => {
        !T.value && !E.value && !i.value && L(!0);
      }, 5e3);
    }), Te(() => {
      z && clearInterval(z), window.removeEventListener("keydown", ce);
    }), (s, a) => {
      const m = De("router-link");
      return u(), r("div", je, [
        n("header", Be, [
          n("div", qe, [
            a[5] || (a[5] = n("p", { class: "pp-eyebrow" }, "0KAY · PLUGINS", -1)),
            n("h1", null, l(o(t)("plugins.title")), 1),
            n("p", Oe, l(o(t)("plugins.subtitle")), 1)
          ]),
          n("button", {
            class: "btn btn-tonal",
            onClick: a[0] || (a[0] = (e) => L()),
            disabled: y.value
          }, l(y.value ? o(t)("agents.refreshing") : o(t)("agents.refresh")), 9, Ue)
        ]),
        Q(W, { name: "banner" }, {
          default: j(() => [
            C.value ? (u(), r("div", ze, l(C.value), 1)) : d("", !0)
          ]),
          _: 1
        }),
        Q(W, { name: "banner" }, {
          default: j(() => [
            P.value ? (u(), r("div", Ve, l(P.value), 1)) : d("", !0)
          ]),
          _: 1
        }),
        p.value.length ? (u(), r("section", Ye, [
          n("div", Je, [
            n("b", null, l(p.value.length), 1),
            n("span", null, l(o(t)("plugins.total")), 1)
          ]),
          n("div", Ge, [
            n("b", null, l(fe.value), 1),
            n("span", null, l(o(t)("plugins.healthy")), 1)
          ]),
          n("div", Qe, [
            n("b", null, l(he.value), 1),
            n("span", null, l(o(t)("plugins.disabled")), 1)
          ]),
          n("div", We, [
            n("b", null, l(be.value), 1),
            n("span", null, l(o(t)("plugins.removable")), 1)
          ])
        ])) : d("", !0),
        n("div", Xe, [
          (u(!0), r(H, null, K(p.value, (e, g) => (u(), r("article", {
            key: e.key,
            class: $(["plugin-card", { healthy: R(e), disabled: e.runtime && e.disabled }]),
            style: Me({ animationDelay: `${Math.min(g, 12) * 40}ms` }),
            role: "button",
            tabindex: "0",
            title: o(t)("plugins.viewDetails", { name: e.name }),
            onClick: (h) => Y(e),
            onKeydown: [
              ve(B((h) => Y(e), ["prevent"]), ["enter"]),
              ve(B((h) => Y(e), ["prevent"]), ["space"])
            ]
          }, [
            n("div", et, [
              a[7] || (a[7] = n("div", { class: "plugin-icon" }, [
                n("svg", {
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none"
                }, [
                  n("path", {
                    d: "M8 4v4M16 4v4M4 10h16M7 14h4v6H7v-6zM13 14h4v3h-4v-3z",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  })
                ])
              ], -1)),
              n("div", tt, [
                n("h2", null, [
                  q(l(e.name), 1),
                  n("span", {
                    class: $(["source-badge", e.runtime ? "rt" : e.installedSource])
                  }, l(J(e)), 3)
                ]),
                n("span", nt, l(e.packageName), 1)
              ]),
              n("span", {
                class: $(["status-chip", { ok: R(e), off: e.runtime && e.disabled }])
              }, [
                a[6] || (a[6] = n("span", { class: "status-dot" }, null, -1)),
                q(l(re(e)), 1)
              ], 2)
            ]),
            n("dl", st, [
              n("div", null, [
                n("dt", null, l(o(t)("agents.version")), 1),
                n("dd", null, l(e.version || "—"), 1)
              ]),
              n("div", null, [
                n("dt", null, l(o(t)("agents.tasks")), 1),
                n("dd", null, l(e.runtime ? e.active_tasks : "—"), 1)
              ]),
              n("div", null, [
                n("dt", null, l(o(t)("plugins.type")), 1),
                n("dd", null, l(e.runtime ? e.type || "—" : J(e)), 1)
              ])
            ]),
            n("div", lt, [
              (u(!0), r(H, null, K(e.capabilities, (h) => (u(), r("span", {
                key: h,
                class: "cap-chip"
              }, l(h), 1))), 128)),
              e.capabilities?.length ? d("", !0) : (u(), r("span", at, "—"))
            ]),
            n("div", {
              class: "card-actions",
              onClick: a[1] || (a[1] = B(() => {
              }, ["stop"]))
            }, [
              e.runtime ? (u(), r("label", {
                key: 0,
                class: $(["plugin-switch", { on: !e.disabled, busy: E.value === e.name }]),
                title: e.disabled ? o(t)("plugins.enable") : o(t)("plugins.disable")
              }, [
                n("input", {
                  type: "checkbox",
                  checked: !e.disabled,
                  disabled: E.value === e.name,
                  onChange: (h) => ie(e)
                }, null, 40, ot),
                a[8] || (a[8] = n("span", { class: "plugin-switch-slider" }, null, -1)),
                n("span", ut, l(e.disabled ? o(t)("plugins.enable") : o(t)("plugins.disable")), 1)
              ], 10, it)) : d("", !0),
              e.installedSource === "pm" ? (u(), r("button", {
                key: 1,
                class: "btn btn-danger-tonal",
                disabled: T.value === e.packageName,
                onClick: (h) => oe(e)
              }, l(T.value === e.packageName ? o(t)("plugins.uninstalling") : o(t)("plugins.uninstall")), 9, rt)) : d("", !0),
              ue(e) ? (u(), r("button", {
                key: 2,
                class: "btn btn-tonal",
                onClick: (h) => we(e)
              }, l(o(t)("plugins.configure")), 9, ct)) : e.name === "agent" ? (u(), X(m, {
                key: 3,
                class: "btn btn-tonal",
                to: "/settings?tab=agent"
              }, {
                default: j(() => [
                  q(l(o(t)("plugins.configure")), 1)
                ]),
                _: 1
              })) : d("", !0),
              N(e) ? (u(), r("a", {
                key: 4,
                class: "btn btn-tonal",
                href: N(e),
                target: "_blank",
                rel: "noopener noreferrer"
              }, l(o(t)("plugins.repo")), 9, dt)) : d("", !0)
            ])
          ], 46, Ze))), 128)),
          p.value.length === 0 && !y.value ? (u(), r("div", pt, [
            n("p", null, l(o(t)("plugins.empty")), 1),
            n("p", mt, l(o(t)("plugins.emptyHint")), 1)
          ])) : d("", !0)
        ]),
        (u(), X(xe, { to: "body" }, [
          Q(W, { name: "pd" }, {
            default: j(() => [
              i.value ? (u(), r("div", {
                key: 0,
                class: "pd-scrim",
                onClick: B(I, ["self"])
              }, [
                n("section", {
                  ref_key: "detailDialog",
                  ref: ee,
                  class: "pd-dialog",
                  role: "dialog",
                  "aria-modal": "true",
                  "aria-label": o(t)("plugins.detailsLabel", { name: i.value.name }),
                  tabindex: "-1",
                  onKeydown: a[4] || (a[4] = //@ts-ignore
                  (...e) => o(ne) && o(ne)(...e))
                }, [
                  n("header", gt, [
                    n("div", ft, [
                      n("h2", null, [
                        q(l(i.value.name) + " ", 1),
                        n("span", {
                          class: $(["source-badge", i.value.runtime ? "rt" : i.value.installedSource])
                        }, l(J(i.value)), 3)
                      ]),
                      n("span", ht, l(i.value.packageName), 1)
                    ]),
                    n("button", {
                      ref_key: "detailCloseBtn",
                      ref: te,
                      class: "pd-close",
                      type: "button",
                      "aria-label": o(t)("common.close"),
                      onClick: I
                    }, "×", 8, bt)
                  ]),
                  n("div", _t, [
                    i.value.version ? (u(), r("span", yt, "v" + l(i.value.version), 1)) : d("", !0),
                    i.value.type ? (u(), r("span", kt, l(i.value.type), 1)) : d("", !0),
                    n("span", {
                      class: $(["pd-chip", { ok: R(i.value) }])
                    }, l(re(i.value)), 3),
                    N(i.value) ? (u(), r("a", {
                      key: 2,
                      class: "pd-repo",
                      href: N(i.value),
                      target: "_blank",
                      rel: "noopener noreferrer"
                    }, l(ae(i.value)), 9, wt)) : d("", !0)
                  ]),
                  n("div", Ct, [
                    i.value.builtin ? (u(), r("div", Et, l(o(t)("plugins.builtinFullPerms")), 1)) : i.value.permissions ? (u(), r("div", St, [
                      i.value.permissions.api_requires?.length ? (u(), r("div", Pt, [
                        n("h4", null, l(o(t)("plugins.callsCore")), 1),
                        n("ul", null, [
                          (u(!0), r(H, null, K(i.value.permissions.api_requires, (e) => (u(), r("li", { key: e }, l(e), 1))), 128))
                        ])
                      ])) : d("", !0),
                      i.value.permissions.api_exposes?.length ? (u(), r("div", Tt, [
                        n("h4", null, l(o(t)("plugins.exposes")), 1),
                        n("ul", null, [
                          (u(!0), r(H, null, K(i.value.permissions.api_exposes, (e) => (u(), r("li", { key: e }, l(e), 1))), 128))
                        ])
                      ])) : d("", !0),
                      i.value.permissions.egress?.length ? (u(), r("div", Dt, [
                        n("h4", null, l(o(t)("plugins.egress")), 1),
                        n("ul", null, [
                          (u(!0), r(H, null, K(i.value.permissions.egress, (e) => (u(), r("li", { key: e }, l(e), 1))), 128))
                        ])
                      ])) : d("", !0),
                      !i.value.permissions.api_requires?.length && !i.value.permissions.api_exposes?.length && !i.value.permissions.egress?.length ? (u(), r("p", Mt, l(o(t)("plugins.noExtraPerms")), 1)) : d("", !0)
                    ])) : d("", !0),
                    V.value ? (u(), r("p", xt, l(o(t)("plugins.loadingReadme")), 1)) : M.value ? (u(), r("p", Nt, l(M.value), 1)) : D.value ? (u(), X(o(Fe), {
                      key: 4,
                      content: D.value
                    }, null, 8, ["content"])) : (u(), r("p", $t, l(o(t)("plugins.noReadme")), 1))
                  ]),
                  n("footer", At, [
                    N(i.value) ? (u(), r("a", {
                      key: 0,
                      class: "btn btn-tonal",
                      href: N(i.value),
                      target: "_blank",
                      rel: "noopener noreferrer"
                    }, l(o(t)("plugins.openRepo")), 9, Rt)) : d("", !0),
                    i.value.runtime ? (u(), r("button", {
                      key: 1,
                      class: "btn btn-tonal",
                      type: "button",
                      disabled: E.value === i.value.name,
                      onClick: a[2] || (a[2] = (e) => ie(i.value))
                    }, l(i.value.disabled ? o(t)("plugins.enable") : o(t)("plugins.disable")), 9, Lt)) : d("", !0),
                    i.value.installedSource === "pm" ? (u(), r("button", {
                      key: 2,
                      class: "btn btn-danger-tonal",
                      type: "button",
                      disabled: T.value === i.value.packageName,
                      onClick: a[3] || (a[3] = (e) => oe(i.value))
                    }, l(T.value === i.value.packageName ? o(t)("plugins.uninstalling") : o(t)("plugins.uninstall")), 9, Ft)) : d("", !0),
                    n("button", {
                      class: "btn btn-tonal",
                      type: "button",
                      onClick: I
                    }, l(o(t)("settings.close")), 1)
                  ])
                ], 40, vt)
              ])) : d("", !0)
            ]),
            _: 1
          })
        ]))
      ]);
    };
  }
}), Kt = (_, t) => {
  const w = _.__vccOpts || _;
  for (const [v, S] of t)
    w[v] = S;
  return w;
}, Ot = /* @__PURE__ */ Kt(Ht, [["__scopeId", "data-v-b989ae34"]]);
export {
  Ot as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".plugins-page[data-v-b989ae34]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-b989ae34]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-b989ae34]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-b989ae34],.pp-hero h1[data-v-b989ae34]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-b989ae34]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-b989ae34]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-b989ae34]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.banner-enter-active[data-v-b989ae34]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}.banner-leave-active[data-v-b989ae34]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.banner-enter-from[data-v-b989ae34],.banner-leave-to[data-v-b989ae34]{opacity:0;transform:translateY(-6px)}.pp-stats[data-v-b989ae34]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-b989ae34]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-b989ae34]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-b989ae34]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-b989ae34]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-b989ae34]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-b989ae34]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-b989ae34]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-b989ae34]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-b989ae34 var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-b989ae34{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-b989ae34]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-b989ae34]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-b989ae34]{opacity:.62}.plugin-top[data-v-b989ae34]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-b989ae34]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-b989ae34]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-b989ae34]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-b989ae34]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-b989ae34]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-b989ae34]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-b989ae34]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-b989ae34]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-b989ae34]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-b989ae34]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-b989ae34]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-b989ae34]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-b989ae34]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-b989ae34]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-b989ae34]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-b989ae34]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-b989ae34]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-b989ae34]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-b989ae34]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-b989ae34]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-b989ae34]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-b989ae34]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-b989ae34]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-b989ae34]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-b989ae34]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-b989ae34]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-b989ae34]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-b989ae34]{white-space:nowrap}#app .plugins-page .btn[data-v-b989ae34]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-b989ae34]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-b989ae34]:disabled{opacity:.6;cursor:not-allowed}.empty-state[data-v-b989ae34]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-b989ae34]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-b989ae34]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-b989ae34]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-b989ae34]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-b989ae34]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-b989ae34]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-b989ae34],.pd-leave-to[data-v-b989ae34]{opacity:0}.pd-enter-active .pd-dialog[data-v-b989ae34]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-b989ae34]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-b989ae34],.pd-leave-to .pd-dialog[data-v-b989ae34]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-b989ae34]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-b989ae34]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-b989ae34]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-b989ae34]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-b989ae34]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-b989ae34]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-b989ae34]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-b989ae34]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-b989ae34]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-b989ae34]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-b989ae34]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-b989ae34]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-b989ae34]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-b989ae34]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-b989ae34]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-b989ae34]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-b989ae34]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-b989ae34]{color:var(--md-error)}.pd-foot[data-v-b989ae34]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-b989ae34]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn[data-v-b989ae34]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-b989ae34],.pd-leave-active[data-v-b989ae34],.pd-enter-active .pd-dialog[data-v-b989ae34],.pd-leave-active .pd-dialog[data-v-b989ae34]{transition:none}.pd-enter-from .pd-dialog[data-v-b989ae34],.pd-leave-to .pd-dialog[data-v-b989ae34]{transform:none}}\n";document.head.appendChild(s)}})();
