import { defineComponent as Te, ref as c, computed as g, watch as $, onMounted as Se, openBlock as i, createElementBlock as n, createElementVNode as e, toDisplayString as l, createCommentVNode as _, normalizeStyle as R, Fragment as x, renderList as M, normalizeClass as w, createVNode as j, Transition as Le, withCtx as me, withDirectives as V, vModelText as A, unref as te, TransitionGroup as Ne, withModifiers as $e } from "vue";
import { useConfirm as Re, AppSelect as se, i18n as je } from "@0kay/host";
import { i as Ve, l as Ae, F as He } from "./assets/kit-Du4J5J-o.js";
import { _ as Pe } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
const Be = { class: "memory-page" }, Ue = { class: "page-header" }, Ie = { class: "subtitle" }, Oe = { class: "header-actions" }, Fe = ["disabled"], De = ["disabled"], Ee = {
  key: 0,
  class: "banner err"
}, ze = {
  key: 1,
  class: "banner ok"
}, qe = { class: "stat-grid" }, Je = { class: "stat-card" }, We = { class: "stat-head" }, Ke = { class: "stat-label" }, Ge = { class: "stat-value" }, Qe = { class: "stat-hint" }, Ye = { class: "stat-card" }, Xe = { class: "stat-head" }, Ze = { class: "stat-label" }, et = { class: "stat-value" }, tt = { class: "stat-hint" }, st = { class: "stat-card" }, lt = { class: "stat-head" }, ot = { class: "stat-label" }, at = { class: "stat-value" }, it = { class: "stat-hint" }, nt = { class: "stat-card" }, rt = { class: "stat-head" }, ct = { class: "stat-label" }, dt = { class: "stat-value" }, mt = { class: "stat-hint" }, ut = {
  key: 2,
  class: "card",
  style: { "margin-top": "16px" }
}, ft = { class: "card-head" }, vt = { class: "card-title" }, _t = { class: "chip muted" }, ht = { class: "dynamics-grid" }, yt = { style: { display: "flex", "align-items": "center", gap: "10px", margin: "6px 0" } }, pt = { style: { width: "48px", "font-size": "12px" } }, bt = { class: "dyn-track" }, gt = { style: { display: "flex", "align-items": "center", gap: "10px", margin: "6px 0" } }, kt = { style: { width: "48px", "font-size": "12px" } }, wt = { class: "dyn-track" }, Ct = { class: "hint" }, xt = { class: "hint" }, Mt = { class: "dyn-hist" }, Tt = ["title"], St = { class: "hint" }, Lt = ["aria-label"], Nt = ["points"], $t = { class: "tabs" }, Rt = {
  key: "memories",
  class: "tab-body"
}, jt = { class: "card toolbar" }, Vt = { class: "search-field" }, At = ["placeholder", "aria-label"], Ht = { class: "fld" }, Pt = { class: "fld" }, Bt = { class: "chip muted" }, Ut = { class: "memory-list" }, It = { class: "card-top" }, Ot = {
  key: 0,
  class: "chip muted"
}, Ft = { class: "chip muted" }, Dt = ["title", "aria-label", "onClick"], Et = { class: "memory-content" }, zt = {
  key: 0,
  class: "tags"
}, qt = { class: "memory-foot" }, Jt = ["title"], Wt = { class: "meter-bar" }, Kt = ["title"], Gt = { class: "meter-bar" }, Qt = { class: "meter-text" }, Yt = { class: "detail-clip" }, Xt = { class: "card-actions" }, Zt = ["onClick"], es = ["onClick"], ts = ["onClick"], ss = ["onClick"], ls = {
  key: 1,
  class: "empty-state"
}, os = { class: "hint" }, as = {
  key: 0,
  class: "pager"
}, is = ["disabled"], ns = { class: "chip muted" }, rs = ["disabled"], cs = {
  key: "notes",
  class: "tab-body"
}, ds = { class: "grid-notes" }, ms = { class: "card" }, us = { class: "card-head" }, fs = { class: "card-title" }, vs = ["placeholder", "aria-label"], _s = ["placeholder", "aria-label"], hs = ["placeholder", "aria-label"], ys = ["disabled"], ps = { class: "card" }, bs = { class: "card-head" }, gs = { class: "card-title" }, ks = { class: "chip muted" }, ws = { class: "search-field mini" }, Cs = ["placeholder", "aria-label"], xs = { class: "note-list" }, Ms = { class: "note-main" }, Ts = { class: "item-meta" }, Ss = {
  key: 0,
  class: "chip muted"
}, Ls = { class: "note-actions" }, Ns = ["onClick"], $s = ["aria-label", "onClick"], Rs = {
  key: 0,
  class: "list-empty"
}, js = {
  key: 0,
  class: "card reader"
}, Vs = { class: "card-head" }, As = { class: "card-title" }, Hs = { class: "pager" }, Ps = ["disabled"], Bs = { class: "chip muted" }, Us = ["disabled"], Is = {
  key: "reflections",
  class: "tab-body"
}, Os = { class: "card toolbar" }, Fs = { class: "fld" }, Ds = { class: "chip muted" }, Es = { class: "reflection-list" }, zs = { class: "card-head" }, qs = { class: "card-title" }, Js = {
  key: 0,
  class: "chip muted"
}, Ws = { class: "item-meta" }, Ks = { class: "quote" }, Gs = { class: "quote" }, Qs = {
  key: 0,
  class: "card-actions"
}, Ys = ["onClick"], Xs = ["onClick"], Zs = {
  key: 0,
  class: "empty-state"
}, el = { class: "hint" }, tl = { class: "danger-zone" }, sl = { class: "danger-copy" }, ll = { class: "hint" }, ol = ["disabled"], H = 30, al = 4, il = /* @__PURE__ */ Te({
  __name: "MemoryPage",
  setup(nl) {
    const { confirm: P } = Re(), t = (a, o) => je.global.t(a, o ?? {}), p = c("memories"), B = c(""), U = c(""), I = c("recent"), b = c(0), O = c([]), W = c(0), T = c({ working: 0, shortTerm: { total: 0 }, longTerm: 0, avgStrength: 0 }), m = c(null), le = g(() => Math.max(1, m.value?.tiers?.short_term || 0, m.value?.tiers?.long_term || 0)), ue = g(() => Math.max(1, ...m.value?.strength_histogram || [1])), oe = g(() => (m.value?.decay_curve || []).map((o) => `${(o.day / 90 * 200).toFixed(1)},${(60 - o.strength * 60).toFixed(1)}`).join(" "));
    function K(a, o) {
      return `${Math.round((a || 0) / Math.max(1, o) * 100)}%`;
    }
    const h = c(!1), d = c(""), S = c(""), L = c(""), F = c([]), D = c(""), f = c({ title: "", content: "", tags: "" }), v = c(null), E = c([]), z = c("proposed"), q = g(() => Math.max(1, Math.ceil(W.value / H))), G = g(() => Math.floor(b.value / H) + 1);
    function C(a) {
      return `${Math.round(Math.max(0, Math.min(1, a || 0)) * 100)}%`;
    }
    function fe(a) {
      return t(a === "long_term" ? "life.memory.tierLong" : a === "short_term" ? "life.memory.tierShort" : "life.memory.tierWorking");
    }
    function Q(a) {
      if (!a) return "";
      const o = new Date(a);
      return Number.isNaN(o.getTime()) ? a : o.toLocaleString();
    }
    function N(a) {
      S.value = a, setTimeout(() => {
        S.value === a && (S.value = "");
      }, He);
    }
    async function u(a, o) {
      const s = await fetch("/api/life/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: a, payload: o })
      });
      if (!s.ok) throw new Error(await s.text() || `HTTP ${s.status}`);
      return s.json().catch(() => ({}));
    }
    async function k() {
      try {
        const a = await fetch("/api/life/memories?limit=1");
        if (a.ok) {
          const o = await a.json();
          o.stats && (T.value = o.stats);
        }
      } catch {
      }
    }
    async function ae() {
      try {
        m.value = await u("memory_dashboard", {});
      } catch {
      }
    }
    async function y() {
      h.value = !0, d.value = "";
      try {
        const a = await u("memory_page", { tier: U.value, query: B.value.trim(), limit: H, offset: b.value, sort: I.value });
        O.value = a.items || [], W.value = a.total || 0;
      } catch (a) {
        d.value = a?.message || t("life.memory.errorReadMemories");
      } finally {
        h.value = !1;
      }
    }
    async function J() {
      h.value = !0, d.value = "";
      try {
        const a = await u("memory_note_list", { query: D.value.trim(), limit: 60 });
        F.value = a.notes || [];
      } catch (a) {
        d.value = a?.message || t("life.memory.errorReadNotes");
      } finally {
        h.value = !1;
      }
    }
    async function Y() {
      h.value = !0, d.value = "";
      try {
        const a = await u("memory_reflection_list", { status: z.value, limit: 80 });
        E.value = a.reflections || [];
      } catch (a) {
        d.value = a?.message || t("life.memory.errorReadReflections");
      } finally {
        h.value = !1;
      }
    }
    function ie() {
      return k(), ae(), p.value === "notes" ? J() : p.value === "reflections" ? Y() : y();
    }
    async function ve(a) {
      try {
        await u("memory_reinforce", { ids: [a.id] }), N(t("life.memory.toastReinforced")), await y();
      } catch (o) {
        d.value = o?.message || t("life.memory.errorReinforce");
      }
    }
    async function ne(a, o) {
      try {
        await u("memory_importance", { id: a.id, delta: o }), await y();
      } catch (s) {
        d.value = s?.message || t("life.memory.errorAdjust");
      }
    }
    async function _e() {
      try {
        const a = await u("memory_export", {}), o = new Blob([JSON.stringify(a, null, 2)], { type: "application/json" }), s = URL.createObjectURL(o), r = document.createElement("a");
        r.href = s, r.download = `0kay-memory-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, r.click(), URL.revokeObjectURL(s), N(t("life.memory.toastExported"));
      } catch (a) {
        d.value = a?.message || t("life.memory.errorExport");
      }
    }
    const re = c(null);
    async function he(a) {
      const o = a.target, s = o.files?.[0];
      if (s)
        try {
          const r = JSON.parse(await s.text()), de = await u("memory_import", { snapshot: r });
          N(t("life.memory.toastImported", { added: de.imported || 0, skipped: de.skipped || 0 })), await y(), await k();
        } catch (r) {
          d.value = r?.message || t("life.memory.errorImport");
        } finally {
          o.value = "";
        }
    }
    async function ye(a) {
      if (await P({
        title: t("life.memory.deleteMemoryTitle"),
        message: t("life.memory.deleteMemoryMessage"),
        confirmLabel: t("life.memory.deleteMemoryConfirm"),
        danger: !0
      }))
        try {
          await u("delete_memory", { id: a.id }), await y(), await k();
        } catch (s) {
          d.value = s?.message || t("life.memory.errorDelete");
        }
    }
    async function pe() {
      if (!(!await P({
        title: t("life.memory.clearAll"),
        message: t("life.memory.clearAllMessage"),
        confirmLabel: t("life.memory.clearAll"),
        danger: !0
      }) || !await P({
        title: t("life.memory.clearAllConfirmTitle"),
        message: t("life.memory.clearAllConfirmMessage"),
        confirmLabel: t("life.memory.clearAllConfirm"),
        danger: !0
      })))
        try {
          await u("clear_all_memory", {}), await y(), await k();
        } catch (s) {
          d.value = s?.message || t("life.memory.errorClear");
        }
    }
    async function be() {
      if (!(!f.value.content.trim() && !f.value.title.trim()))
        try {
          await u("memory_note_create", {
            title: f.value.title,
            content: f.value.content,
            tags: f.value.tags.split(",").map((a) => a.trim()).filter(Boolean)
          }), f.value = { title: "", content: "", tags: "" }, N(t("life.memory.toastNoteSaved")), await J();
        } catch (a) {
          d.value = a?.message || t("life.memory.errorSaveNote");
        }
    }
    async function X(a, o = 1) {
      try {
        const s = await u("memory_note_read", { note_id: a.note_id, offset: o, limit: 400 });
        v.value = { ...s, offset: s.offset || o };
      } catch (s) {
        d.value = s?.message || t("life.memory.errorReadNote");
      }
    }
    async function ge(a) {
      if (await P({ title: t("life.memory.deleteNoteTitle"), message: t("life.memory.deleteNoteMessage", { id: a.note_id }), confirmLabel: t("life.memory.delete"), danger: !0 }))
        try {
          await u("memory_note_delete", { note_id: a.note_id }), v.value?.note_id === a.note_id && (v.value = null), await J();
        } catch (s) {
          d.value = s?.message || t("life.memory.errorDeleteNote");
        }
    }
    async function ce(a, o) {
      try {
        await u("memory_reflection_review", { id: a.id, accept: o }), await Y(), await k();
      } catch (s) {
        d.value = s?.message || t("life.memory.errorReview");
      }
    }
    async function ke() {
      try {
        const a = await u("memory_maintenance", {});
        N(t("life.memory.toastMaintained", { count: a.consolidated ?? 0 })), await y(), await k();
      } catch (a) {
        d.value = a?.message || t("life.memory.errorMaintain");
      }
    }
    let Z = null, ee = null;
    $(B, () => {
      b.value = 0, Z && clearTimeout(Z), Z = setTimeout(y, 250);
    }), $([U, I], () => {
      b.value = 0, y();
    }), $(D, () => {
      ee && clearTimeout(ee), ee = setTimeout(J, 250);
    }), $(z, Y), $(p, ie), Se(async () => {
      await y(), await k(), await ae();
    }), Ve("life-plugin-memory-style", Ae("memory-page"));
    const we = g(() => [
      { value: "", label: t("life.memory.all") },
      { value: "short_term", label: t("life.memory.shortTerm") },
      { value: "long_term", label: t("life.memory.longTerm") }
    ]), Ce = g(() => [
      { value: "recent", label: t("life.memory.sortRecent") },
      { value: "strength", label: t("life.memory.sortStrength") },
      { value: "importance", label: t("life.memory.sortImportance") },
      { value: "recall", label: t("life.memory.sortRecall") }
    ]), xe = g(() => [
      { value: "proposed", label: t("life.memory.statusProposed") },
      { value: "pending", label: t("life.memory.statusPending") },
      { value: "applied", label: t("life.memory.statusApplied") },
      { value: "rejected", label: t("life.memory.statusRejected") },
      { value: "", label: t("life.memory.all") }
    ]);
    function Me(a) {
      return (a.preview || "").split(`
`).map((s) => s.trim()).find(Boolean) || t("life.memory.emptyNotePreview");
    }
    return (a, o) => (i(), n("main", Be, [
      e("header", Ue, [
        e("div", null, [
          o[17] || (o[17] = e("p", { class: "eyebrow" }, "L.I.F.E / MEMORY", -1)),
          e("h1", null, l(t("life.memory.title")), 1),
          e("p", Ie, l(t("life.memory.subtitle")), 1)
        ]),
        e("div", Oe, [
          e("button", {
            class: "btn tonic",
            disabled: h.value,
            onClick: ke
          }, l(t("life.memory.maintain")), 9, Fe),
          e("button", {
            class: "btn tonic",
            disabled: h.value,
            onClick: ie
          }, l(h.value ? t("life.memory.loading") : t("life.memory.refresh")), 9, De)
        ])
      ]),
      d.value ? (i(), n("p", Ee, l(d.value), 1)) : _("", !0),
      S.value ? (i(), n("p", ze, l(S.value), 1)) : _("", !0),
      e("section", qe, [
        e("article", Je, [
          e("div", We, [
            o[18] || (o[18] = e("span", {
              class: "icon-badge tone-1",
              "aria-hidden": "true"
            }, [
              e("svg", {
                width: "19",
                height: "19",
                viewBox: "0 0 24 24",
                fill: "none"
              }, [
                e("path", {
                  d: "M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18",
                  stroke: "currentColor",
                  "stroke-width": "1.7",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ])
            ], -1)),
            e("span", Ke, l(t("life.memory.tierWorking")), 1)
          ]),
          e("strong", Ge, l(T.value.working), 1),
          e("span", Qe, l(t("life.memory.workingHint")), 1)
        ]),
        e("article", Ye, [
          e("div", Xe, [
            o[19] || (o[19] = e("span", {
              class: "icon-badge tone-2",
              "aria-hidden": "true"
            }, [
              e("svg", {
                width: "19",
                height: "19",
                viewBox: "0 0 24 24",
                fill: "none"
              }, [
                e("circle", {
                  cx: "12",
                  cy: "12",
                  r: "8",
                  stroke: "currentColor",
                  "stroke-width": "1.7"
                }),
                e("path", {
                  d: "M12 8v4l3 2",
                  stroke: "currentColor",
                  "stroke-width": "1.7",
                  "stroke-linecap": "round"
                })
              ])
            ], -1)),
            e("span", Ze, l(t("life.memory.tierShort")), 1)
          ]),
          e("strong", et, l(T.value.shortTerm?.total || 0), 1),
          e("span", tt, l(t("life.memory.shortHint")), 1)
        ]),
        e("article", st, [
          e("div", lt, [
            o[20] || (o[20] = e("span", {
              class: "icon-badge tone-3",
              "aria-hidden": "true"
            }, [
              e("svg", {
                width: "19",
                height: "19",
                viewBox: "0 0 24 24",
                fill: "none"
              }, [
                e("path", {
                  d: "M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 21.5v-16z",
                  stroke: "currentColor",
                  "stroke-width": "1.7",
                  "stroke-linejoin": "round"
                })
              ])
            ], -1)),
            e("span", ot, l(t("life.memory.tierLong")), 1)
          ]),
          e("strong", at, l(T.value.longTerm || 0), 1),
          e("span", it, l(t("life.memory.longHint")), 1)
        ]),
        e("article", nt, [
          e("div", rt, [
            o[21] || (o[21] = e("span", {
              class: "icon-badge tone-4",
              "aria-hidden": "true"
            }, [
              e("svg", {
                width: "19",
                height: "19",
                viewBox: "0 0 24 24",
                fill: "none"
              }, [
                e("path", {
                  d: "M4 14l4-4 3 3 5-6 4 4",
                  stroke: "currentColor",
                  "stroke-width": "1.7",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }),
                e("path", {
                  d: "M4 19h16",
                  stroke: "currentColor",
                  "stroke-width": "1.7",
                  "stroke-linecap": "round"
                })
              ])
            ], -1)),
            e("span", ct, l(t("life.memory.avgStrength")), 1)
          ]),
          e("strong", dt, l(C(T.value.avgStrength)), 1),
          e("span", mt, l(t("life.memory.avgStrengthHint")), 1)
        ])
      ]),
      m.value ? (i(), n("section", ut, [
        e("div", ft, [
          e("h2", vt, l(t("life.memory.dynamicsTitle")), 1),
          e("span", _t, "RRF k=" + l(m.value.rrf_k), 1)
        ]),
        e("div", ht, [
          e("div", null, [
            e("div", yt, [
              e("span", pt, l(t("life.memory.shortTerm")), 1),
              e("div", bt, [
                e("i", {
                  class: "dyn-bar",
                  style: R({ width: K(m.value.tiers.short_term, le.value) })
                }, null, 4)
              ]),
              e("b", null, l(m.value.tiers.short_term), 1)
            ]),
            e("div", gt, [
              e("span", kt, l(t("life.memory.longTerm")), 1),
              e("div", wt, [
                e("i", {
                  class: "dyn-bar",
                  style: R({ width: K(m.value.tiers.long_term, le.value) })
                }, null, 4)
              ]),
              e("b", null, l(m.value.tiers.long_term), 1)
            ]),
            e("p", Ct, l(t("life.memory.dynamicsSummary", { avg: C(m.value.avg_strength), low: m.value.low_strength, semantic: m.value.types?.semantic || 0, episode: m.value.types?.episode || 0 })), 1)
          ]),
          e("div", null, [
            e("p", xt, l(t("life.memory.strengthHistogram")), 1),
            e("div", Mt, [
              (i(!0), n(x, null, M(m.value.strength_histogram, (s, r) => (i(), n("i", {
                key: r,
                title: `${r / 10}~${(r + 1) / 10}: ${s}`,
                style: R({ height: K(s, ue.value) })
              }, null, 12, Tt))), 128))
            ])
          ]),
          e("div", null, [
            e("p", St, l(t("life.memory.decayCurveHint")), 1),
            (i(), n("svg", {
              viewBox: "0 0 200 60",
              class: "dyn-curve",
              "aria-label": t("life.memory.decayCurveLabel")
            }, [
              (i(), n("polyline", {
                key: oe.value,
                class: "decay-line",
                points: oe.value,
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                pathLength: "1"
              }, null, 8, Nt))
            ], 8, Lt))
          ])
        ])
      ])) : _("", !0),
      e("nav", $t, [
        e("button", {
          class: w(["tab", { active: p.value === "memories" }]),
          onClick: o[0] || (o[0] = (s) => p.value = "memories")
        }, l(t("life.memory.tabMemories")), 3),
        e("button", {
          class: w(["tab", { active: p.value === "notes" }]),
          onClick: o[1] || (o[1] = (s) => p.value = "notes")
        }, l(t("life.memory.tabNotes")), 3),
        e("button", {
          class: w(["tab", { active: p.value === "reflections" }]),
          onClick: o[2] || (o[2] = (s) => p.value = "reflections")
        }, l(t("life.memory.tabReflections")), 3)
      ]),
      j(Le, {
        name: "tab-fade",
        mode: "out-in"
      }, {
        default: me(() => [
          p.value === "memories" ? (i(), n("div", Rt, [
            e("section", jt, [
              e("div", Vt, [
                o[22] || (o[22] = e("svg", {
                  class: "search-icon",
                  width: "17",
                  height: "17",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  e("circle", {
                    cx: "11",
                    cy: "11",
                    r: "6.5",
                    stroke: "currentColor",
                    "stroke-width": "1.8"
                  }),
                  e("path", {
                    d: "M16 16l4.5 4.5",
                    stroke: "currentColor",
                    "stroke-width": "1.8",
                    "stroke-linecap": "round"
                  })
                ], -1)),
                V(e("input", {
                  "onUpdate:modelValue": o[3] || (o[3] = (s) => B.value = s),
                  placeholder: t("life.memory.searchMemories"),
                  "aria-label": t("life.memory.searchMemoriesLabel")
                }, null, 8, At), [
                  [A, B.value]
                ])
              ]),
              e("label", Ht, [
                e("span", null, l(t("life.memory.tierLabel")), 1),
                j(te(se), {
                  modelValue: U.value,
                  "onUpdate:modelValue": o[4] || (o[4] = (s) => U.value = s),
                  options: we.value,
                  "aria-label": t("life.memory.tierLabel")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              e("label", Pt, [
                e("span", null, l(t("life.memory.sortLabel")), 1),
                j(te(se), {
                  modelValue: I.value,
                  "onUpdate:modelValue": o[5] || (o[5] = (s) => I.value = s),
                  options: Ce.value,
                  "aria-label": t("life.memory.sortLabel")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              e("span", Bt, l(t("life.memory.totalPages", { total: W.value, page: G.value, pages: q.value })), 1),
              e("button", {
                class: "btn tonic sm",
                onClick: _e
              }, l(t("life.memory.export")), 1),
              e("button", {
                class: "btn tonic sm",
                onClick: o[6] || (o[6] = (s) => re.value?.click())
              }, l(t("life.memory.import")), 1),
              e("input", {
                ref_key: "importInput",
                ref: re,
                type: "file",
                accept: "application/json,.json",
                class: "hidden-input",
                onChange: he
              }, null, 544)
            ]),
            e("section", Ut, [
              j(Ne, { name: "memory-card" }, {
                default: me(() => [
                  (i(!0), n(x, null, M(O.value, (s) => (i(), n("article", {
                    key: s.id,
                    class: w(["memory-card", { open: L.value === s.id }])
                  }, [
                    e("div", It, [
                      e("span", {
                        class: w(["chip", "tier-" + (s.tier === "long_term" ? "long" : "short")])
                      }, l(fe(s.tier)), 3),
                      s.scope && s.scope !== "public" ? (i(), n("span", Ot, l(s.scope), 1)) : _("", !0),
                      e("span", Ft, l(s.memory_type || "knowledge"), 1),
                      e("button", {
                        class: "btn-icon danger",
                        title: t("life.memory.deleteMemory"),
                        "aria-label": t("life.memory.deleteMemory"),
                        onClick: (r) => ye(s)
                      }, [...o[23] || (o[23] = [
                        e("svg", {
                          width: "15",
                          height: "15",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          "aria-hidden": "true"
                        }, [
                          e("path", {
                            d: "M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13",
                            stroke: "currentColor",
                            "stroke-width": "1.8",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          })
                        ], -1)
                      ])], 8, Dt)
                    ]),
                    e("p", Et, l(s.content), 1),
                    s.tags?.length ? (i(), n("div", zt, [
                      (i(!0), n(x, null, M(s.tags, (r) => (i(), n("span", { key: r }, "#" + l(r), 1))), 128))
                    ])) : _("", !0),
                    e("footer", qt, [
                      e("div", {
                        class: "meter",
                        title: t("life.memory.importance")
                      }, [
                        e("span", null, l(t("life.memory.importance")), 1),
                        e("div", Wt, [
                          e("i", {
                            style: R({ "--v": C(s.importance) }),
                            class: "fill-primary"
                          }, null, 4)
                        ]),
                        e("b", null, l(C(s.importance)), 1)
                      ], 8, Jt),
                      e("div", {
                        class: "meter",
                        title: t("life.memory.strength")
                      }, [
                        e("span", null, l(t("life.memory.strength")), 1),
                        e("div", Gt, [
                          e("i", {
                            style: R({ "--v": C(s.strength) }),
                            class: "fill-secondary"
                          }, null, 4)
                        ]),
                        e("b", null, l(C(s.strength)), 1)
                      ], 8, Kt),
                      e("span", Qt, l(t("life.memory.recallTimes", { count: s.recall_count || 0 })), 1)
                    ]),
                    e("div", {
                      class: w(["detail", { open: L.value === s.id }])
                    }, [
                      e("div", Yt, [
                        e("dl", null, [
                          e("div", null, [
                            o[24] || (o[24] = e("dt", null, "ID", -1)),
                            e("dd", null, [
                              e("code", null, l(s.id), 1)
                            ])
                          ]),
                          e("div", null, [
                            e("dt", null, l(t("life.memory.source")), 1),
                            e("dd", null, l(s.source_kind || "conversation"), 1)
                          ]),
                          e("div", null, [
                            e("dt", null, l(t("life.memory.created")), 1),
                            e("dd", null, l(Q(s.created_at)), 1)
                          ]),
                          e("div", null, [
                            e("dt", null, l(t("life.memory.lastRecalled")), 1),
                            e("dd", null, l(Q(s.last_recalled)), 1)
                          ])
                        ])
                      ])
                    ], 2),
                    e("div", Xt, [
                      e("button", {
                        class: "btn sm tonic",
                        onClick: (r) => L.value = L.value === s.id ? "" : s.id
                      }, l(L.value === s.id ? t("life.memory.collapse") : t("life.memory.details")), 9, Zt),
                      e("button", {
                        class: "btn sm tonic",
                        onClick: (r) => ne(s, 0.1)
                      }, l(t("life.memory.importanceUp")), 9, es),
                      e("button", {
                        class: "btn sm tonic",
                        onClick: (r) => ne(s, -0.1)
                      }, l(t("life.memory.importanceDown")), 9, ts),
                      e("button", {
                        class: "btn sm tonic",
                        onClick: (r) => ve(s)
                      }, l(t("life.memory.reinforce")), 9, ss)
                    ])
                  ], 2))), 128))
                ]),
                _: 1
              }),
              h.value && !O.value.length ? (i(), n(x, { key: 0 }, M(al, (s) => e("article", {
                key: "sk" + s,
                class: "memory-card skeleton-card",
                "aria-hidden": "true"
              }, [...o[25] || (o[25] = [
                e("span", { class: "sk-line w30" }, null, -1),
                e("span", { class: "sk-line w90" }, null, -1),
                e("span", { class: "sk-line w75" }, null, -1),
                e("span", { class: "sk-line w40" }, null, -1)
              ])])), 64)) : _("", !0),
              !h.value && !O.value.length ? (i(), n("div", ls, [
                e("p", null, l(t("life.memory.emptyMemories")), 1),
                e("p", os, l(t("life.memory.emptyMemoriesHint")), 1)
              ])) : _("", !0)
            ]),
            q.value > 1 ? (i(), n("div", as, [
              e("button", {
                class: "btn sm tonic",
                disabled: b.value === 0,
                onClick: o[7] || (o[7] = (s) => {
                  b.value = Math.max(0, b.value - H), y();
                })
              }, l(t("life.memory.prevPage")), 9, is),
              e("span", ns, l(G.value) + " / " + l(q.value), 1),
              e("button", {
                class: "btn sm tonic",
                disabled: G.value >= q.value,
                onClick: o[8] || (o[8] = (s) => {
                  b.value += H, y();
                })
              }, l(t("life.memory.nextPage")), 9, rs)
            ])) : _("", !0)
          ])) : p.value === "notes" ? (i(), n("div", cs, [
            e("section", ds, [
              e("article", ms, [
                e("div", us, [
                  e("h2", fs, l(t("life.memory.newNote")), 1)
                ]),
                e("form", {
                  class: "stack-form",
                  onSubmit: $e(be, ["prevent"])
                }, [
                  V(e("input", {
                    "onUpdate:modelValue": o[9] || (o[9] = (s) => f.value.title = s),
                    class: "field",
                    placeholder: t("life.memory.noteTitle"),
                    "aria-label": t("life.memory.noteTitleLabel")
                  }, null, 8, vs), [
                    [A, f.value.title]
                  ]),
                  V(e("input", {
                    "onUpdate:modelValue": o[10] || (o[10] = (s) => f.value.tags = s),
                    class: "field",
                    placeholder: t("life.memory.noteTags"),
                    "aria-label": t("life.memory.noteTagsLabel")
                  }, null, 8, _s), [
                    [A, f.value.tags]
                  ]),
                  V(e("textarea", {
                    "onUpdate:modelValue": o[11] || (o[11] = (s) => f.value.content = s),
                    class: "field area",
                    placeholder: t("life.memory.noteContent"),
                    "aria-label": t("life.memory.noteContentLabel")
                  }, null, 8, hs), [
                    [A, f.value.content]
                  ]),
                  e("button", {
                    class: "btn filled",
                    type: "submit",
                    disabled: !f.value.content.trim() && !f.value.title.trim()
                  }, l(t("life.memory.saveNote")), 9, ys)
                ], 32)
              ]),
              e("article", ps, [
                e("div", bs, [
                  e("h2", gs, l(t("life.memory.noteLibrary")), 1),
                  e("span", ks, l(F.value.length), 1)
                ]),
                e("div", ws, [
                  V(e("input", {
                    "onUpdate:modelValue": o[12] || (o[12] = (s) => D.value = s),
                    placeholder: t("life.memory.searchNotes"),
                    "aria-label": t("life.memory.searchNotesLabel")
                  }, null, 8, Cs), [
                    [A, D.value]
                  ])
                ]),
                e("ul", xs, [
                  (i(!0), n(x, null, M(F.value, (s) => (i(), n("li", {
                    key: s.note_id,
                    class: "note-item"
                  }, [
                    e("div", Ms, [
                      e("strong", null, l(Me(s)), 1),
                      e("span", Ts, l(s.note_id) + " · " + l((s.bytes / 1024).toFixed(1)) + " KB", 1),
                      s.scope && s.scope !== "public" ? (i(), n("span", Ss, l(t("life.memory.scopePrefix")) + l(s.scope), 1)) : _("", !0)
                    ]),
                    e("div", Ls, [
                      e("button", {
                        class: "btn sm tonic",
                        onClick: (r) => X(s)
                      }, l(t("life.memory.read")), 9, Ns),
                      e("button", {
                        class: "btn sm danger",
                        "aria-label": t("life.memory.deleteNoteTitle") + " " + s.note_id,
                        onClick: (r) => ge(s)
                      }, l(t("life.memory.delete")), 9, $s)
                    ])
                  ]))), 128)),
                  F.value.length ? _("", !0) : (i(), n("li", Rs, l(t("life.memory.emptyNotes")), 1))
                ])
              ])
            ]),
            v.value ? (i(), n("section", js, [
              e("div", Vs, [
                e("h2", As, l(v.value.note_id), 1),
                e("button", {
                  class: "btn sm tonic",
                  onClick: o[13] || (o[13] = (s) => v.value = null)
                }, l(t("life.memory.close")), 1)
              ]),
              e("pre", null, l(v.value.content), 1),
              e("div", Hs, [
                e("button", {
                  class: "btn sm tonic",
                  disabled: v.value.offset <= 1,
                  onClick: o[14] || (o[14] = (s) => X({ note_id: v.value.note_id }, Math.max(1, v.value.offset - 400)))
                }, l(t("life.memory.prevChunk")), 9, Ps),
                e("span", Bs, l(t("life.memory.lines", { count: v.value.total_lines })), 1),
                e("button", {
                  class: "btn sm tonic",
                  disabled: !v.value.has_more,
                  onClick: o[15] || (o[15] = (s) => X({ note_id: v.value.note_id }, v.value.offset + 400))
                }, l(t("life.memory.nextChunk")), 9, Us)
              ])
            ])) : _("", !0)
          ])) : (i(), n("div", Is, [
            e("section", Os, [
              e("label", Fs, [
                e("span", null, l(t("life.memory.statusLabel")), 1),
                j(te(se), {
                  modelValue: z.value,
                  "onUpdate:modelValue": o[16] || (o[16] = (s) => z.value = s),
                  options: xe.value,
                  "aria-label": t("life.memory.statusLabel")
                }, null, 8, ["modelValue", "options", "aria-label"])
              ]),
              e("span", Ds, l(t("life.memory.reflectionCount", { count: E.value.length })), 1)
            ]),
            e("section", Es, [
              (i(!0), n(x, null, M(E.value, (s) => (i(), n("article", {
                key: s.id,
                class: "card reflection"
              }, [
                e("div", zs, [
                  e("h3", qs, l(s.statement || t("life.memory.noSummary")), 1),
                  e("span", {
                    class: w(["chip", s.status === "applied" ? "chip-ok" : s.status === "rejected" ? "chip-warn" : "muted"])
                  }, l(s.status), 3),
                  s.scope && s.scope !== "public" ? (i(), n("span", Js, l(t("life.memory.scopePrefix")) + l(s.scope), 1)) : _("", !0)
                ]),
                e("p", Ws, l(t("life.memory.sourceSession", { session: s.session_id })) + " · " + l(Q(s.created_at)), 1),
                e("details", null, [
                  e("summary", null, l(t("life.memory.viewConversation")), 1),
                  e("p", Ks, l(t("life.memory.userPrefix")) + l(s.user_text), 1),
                  e("p", Gs, l(t("life.memory.assistantPrefix")) + l(s.assistant_text), 1)
                ]),
                s.status === "proposed" ? (i(), n("div", Qs, [
                  e("button", {
                    class: "btn sm filled",
                    onClick: (r) => ce(s, !0)
                  }, l(t("life.memory.acceptAsMemory")), 9, Ys),
                  e("button", {
                    class: "btn sm danger",
                    onClick: (r) => ce(s, !1)
                  }, l(t("life.memory.reject")), 9, Xs)
                ])) : _("", !0)
              ]))), 128)),
              E.value.length ? _("", !0) : (i(), n("div", Zs, [
                e("p", null, l(t("life.memory.emptyReflections")), 1),
                e("p", el, l(t("life.memory.emptyReflectionsHint")), 1)
              ]))
            ])
          ]))
        ]),
        _: 1
      }),
      e("section", tl, [
        e("div", sl, [
          e("h2", null, l(t("life.memory.dangerTitle")), 1),
          e("p", ll, l(t("life.memory.clearAllHint")), 1)
        ]),
        e("button", {
          class: "btn danger",
          disabled: h.value,
          onClick: pe
        }, l(t("life.memory.clearAll")), 9, ol)
      ])
    ]));
  }
}), ul = /* @__PURE__ */ Pe(il, [["__scopeId", "data-v-e12fa355"]]);
export {
  ul as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page-header[data-v-e12fa355]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.page-header h1[data-v-e12fa355]{margin:0;font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-e12fa355]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-e12fa355]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.stat-grid[data-v-e12fa355]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-e12fa355]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:var(--r-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px;transition:transform .28s var(--ease-spring),box-shadow .28s}@media(hover:hover)and (pointer:fine){.stat-card[data-v-e12fa355]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}.stat-head[data-v-e12fa355]{display:flex;align-items:center;gap:10px}.stat-label[data-v-e12fa355]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-e12fa355]{font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-e12fa355]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-e12fa355]{width:44px;height:44px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-e12fa355]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-e12fa355]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-e12fa355]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-e12fa355]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}.card-head[data-v-e12fa355]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-e12fa355]{margin:0;font-size:16px;font-weight:650}.toolbar[data-v-e12fa355]{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-e12fa355]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px;height:52px;padding:0 14px;border-radius:16px;background:var(--md-surface-container-high)}.search-icon[data-v-e12fa355]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-e12fa355]{flex:1;min-width:0;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-e12fa355]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}.search-field.mini[data-v-e12fa355]{height:auto;padding:10px 12px;margin-bottom:12px}#app .memory-page .field.area[data-v-e12fa355]{height:auto;min-height:120px;padding:12px 14px;resize:vertical;line-height:1.6}.chip[data-v-e12fa355]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-e12fa355]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-e12fa355]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-e12fa355]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-e12fa355]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}.chip-warn[data-v-e12fa355]{background:var(--md-warning-container);color:var(--md-on-warning-container)}.memory-list[data-v-e12fa355]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:var(--space-lg)}.memory-card[data-v-e12fa355]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:var(--r-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:transform .26s var(--ease-spring),box-shadow .22s,border-color .2s}@media(hover:hover)and (pointer:fine){.memory-card[data-v-e12fa355]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}.memory-card-enter-active[data-v-e12fa355]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.memory-card-leave-active[data-v-e12fa355]{transition:opacity .16s var(--ease-emphasized-accel),transform .16s var(--ease-emphasized-accel)}.memory-card-enter-from[data-v-e12fa355]{opacity:0;transform:translateY(6px) scale(.98)}.memory-card-leave-to[data-v-e12fa355]{opacity:0;transform:scale(.98)}.memory-card-move[data-v-e12fa355]{transition:transform .26s var(--ease-emphasized)}@media(prefers-reduced-motion:reduce){.memory-card-enter-active[data-v-e12fa355],.memory-card-leave-active[data-v-e12fa355],.memory-card-move[data-v-e12fa355]{transition-duration:1ms}.memory-card-enter-from[data-v-e12fa355],.memory-card-leave-to[data-v-e12fa355],.stat-card[data-v-e12fa355]:hover,.memory-card[data-v-e12fa355]:hover{transform:none}}.card-top[data-v-e12fa355]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-e12fa355]{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}#app .memory-page .btn-icon[data-v-e12fa355]{min-height:0}.btn-icon[data-v-e12fa355]:after{content:\"\";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}.btn-icon.danger[data-v-e12fa355]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-e12fa355]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere}.tags[data-v-e12fa355]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-e12fa355]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-e12fa355]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-e12fa355]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-e12fa355]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-e12fa355]{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}.fill-primary[data-v-e12fa355]{background:var(--md-primary)}.fill-secondary[data-v-e12fa355]{background:var(--md-secondary,#536255)}.meter-text[data-v-e12fa355]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-e12fa355]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .24s var(--ease-out,ease)}.detail.open[data-v-e12fa355]{grid-template-rows:1fr}.detail-clip[data-v-e12fa355]{overflow:hidden;min-height:0;border-top:0 solid transparent}.detail-clip dl[data-v-e12fa355]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px;padding-top:10px}.detail.open .detail-clip[data-v-e12fa355]{border-top-width:1px;border-top-style:solid;border-top-color:var(--md-outline-variant)}.detail dt[data-v-e12fa355]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-e12fa355]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-e12fa355]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-e12fa355]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-e12fa355]{display:none}.empty-state[data-v-e12fa355]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--r-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-e12fa355]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-e12fa355]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-e12fa355]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-e12fa355]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-e12fa355]{display:flex;flex-direction:column;gap:10px}.note-list[data-v-e12fa355],.reflection-list[data-v-e12fa355]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-e12fa355]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:16px;background:var(--md-surface-container-low)}.note-main[data-v-e12fa355]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-e12fa355]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-e12fa355]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-e12fa355]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-e12fa355]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-e12fa355]{margin-top:var(--space-lg)}.reader pre[data-v-e12fa355]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-e12fa355]{font-size:14px;font-weight:600}.reflection details[data-v-e12fa355]{margin-top:6px}.reflection summary[data-v-e12fa355]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-e12fa355]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){.meter-bar i[data-v-e12fa355]{transition:none}}.tab-body[data-v-e12fa355]{min-width:0}.tab-fade-enter-active[data-v-e12fa355]{transition:opacity .2s var(--ease-emphasized-decel)}.tab-fade-leave-active[data-v-e12fa355]{transition:opacity .14s var(--ease-emphasized-accel)}.tab-fade-enter-from[data-v-e12fa355],.tab-fade-leave-to[data-v-e12fa355]{opacity:0}@media(prefers-reduced-motion:reduce){.tab-fade-enter-active[data-v-e12fa355],.tab-fade-leave-active[data-v-e12fa355]{transition-duration:1ms}}.dynamics-grid[data-v-e12fa355]{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:18px;align-items:end}@media(max-width:900px){.dynamics-grid[data-v-e12fa355]{grid-template-columns:1fr}}.dyn-track[data-v-e12fa355]{flex:1;height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.dyn-bar[data-v-e12fa355]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .5s var(--ease-out,ease)}.dyn-hist[data-v-e12fa355]{display:flex;align-items:flex-end;gap:3px;height:60px}.dyn-hist i[data-v-e12fa355]{flex:1;background:var(--md-primary);border-radius:3px 3px 0 0;transition:height .5s var(--ease-out,ease)}.dyn-curve[data-v-e12fa355]{width:100%;height:60px;color:var(--md-primary);display:block}.decay-line[data-v-e12fa355]{stroke-dasharray:1;stroke-dashoffset:1;animation:decay-draw-e12fa355 .9s var(--ease-out,ease) forwards}@keyframes decay-draw-e12fa355{to{stroke-dashoffset:0}}@media(prefers-reduced-motion:reduce){.dyn-bar[data-v-e12fa355],.dyn-hist i[data-v-e12fa355]{transition:none}.decay-line[data-v-e12fa355]{animation:none;stroke-dashoffset:0}}.skeleton-card[data-v-e12fa355]{gap:12px;pointer-events:none}.sk-line[data-v-e12fa355]{display:block;height:12px;border-radius:6px;background:linear-gradient(90deg,var(--md-surface-container-high) 25%,color-mix(in srgb,var(--md-on-surface) 8%,var(--md-surface-container-high)) 45%,var(--md-surface-container-high) 65%);background-size:200% 100%;animation:sk-shimmer-e12fa355 1.4s linear infinite}.sk-line.w30[data-v-e12fa355]{width:30%}.sk-line.w40[data-v-e12fa355]{width:40%}.sk-line.w75[data-v-e12fa355]{width:75%}.sk-line.w90[data-v-e12fa355]{width:90%}@keyframes sk-shimmer-e12fa355{0%{background-position:200% 0}to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.sk-line[data-v-e12fa355]{animation:none}}.danger-zone[data-v-e12fa355]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-lg);flex-wrap:wrap;margin-top:var(--space-xl);padding:var(--space-lg);border:1px solid color-mix(in srgb,var(--md-error,#b3261e) 45%,transparent);border-radius:var(--r-lg);background:color-mix(in srgb,var(--md-error,#b3261e) 5%,transparent)}.danger-zone h2[data-v-e12fa355]{margin:0;font-size:15px;font-weight:750;color:var(--md-error,#b3261e)}.danger-zone .hint[data-v-e12fa355]{margin:4px 0 0}.danger-copy[data-v-e12fa355]{flex:1;min-width:240px}@media(max-width:900px){.stat-grid[data-v-e12fa355]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-e12fa355]{grid-template-columns:1fr}}@media(max-width:640px){.header-actions[data-v-e12fa355]{padding-top:0}.memory-list[data-v-e12fa355]{grid-template-columns:1fr}}.muted[data-v-3d757c40]{color:var(--md-on-surface-variant);font-size:13px}.pad[data-v-3d757c40]{padding:14px}.dock[data-v-3d757c40]{position:fixed;right:16px;top:76px;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;align-items:center;gap:10px;padding:10px 8px;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}.dock-btn[data-v-3d757c40]{position:relative;width:42px;height:42px;display:grid;place-items:center;border:0;border-radius:14px;background:transparent;color:var(--md-on-surface-variant);cursor:pointer;transition:background-color .16s,color .16s,transform .16s var(--ease-emphasized-decel)}.dock-btn[data-v-3d757c40]:hover{background:var(--md-secondary-container);color:var(--md-on-surface);transform:translateY(-1px)}.dock-btn[data-v-3d757c40]:active{transform:scale(.94)}.dock-btn.active[data-v-3d757c40]{background:color-mix(in srgb,var(--md-primary) 18%,transparent);color:var(--md-primary)}.dock-btn[data-v-3d757c40]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.panel[data-v-3d757c40]{position:fixed;left:0;top:0;z-index:var(--z-panel, 3000);display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;background:var(--md-surface-container-low);box-shadow:var(--shadow-4);color:var(--md-on-surface)}.toolbar[data-v-3d757c40]{display:flex;align-items:center;gap:6px;padding:7px 9px;background:var(--md-surface-container-high);color:var(--md-on-surface);cursor:grab;touch-action:none;user-select:none;flex:0 0 auto}.toolbar[data-v-3d757c40]:active{cursor:grabbing}.toolbar .grab[data-v-3d757c40]{font-size:13px;line-height:1;color:var(--md-on-surface-variant);padding:0 2px;cursor:grab}.toolbar strong[data-v-3d757c40]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:650}.toolbar .count[data-v-3d757c40]{flex:none;min-width:20px;height:20px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-size:11.5px;font-weight:700}.toolbar button[data-v-3d757c40]{width:28px;height:28px;padding:0;display:inline-grid;place-items:center;border:0;border-radius:8px;font-size:13px;line-height:1;color:var(--md-on-surface-variant);background:transparent;cursor:pointer;flex-shrink:0}#app .toolbar button[data-v-3d757c40]{min-height:0}.toolbar button[data-v-3d757c40]:hover{background:var(--md-surface-container-highest)}.list-body[data-v-3d757c40]{flex:1;min-height:0;overflow-y:auto;padding:6px;display:flex;flex-direction:column;gap:2px}.row[data-v-3d757c40]{display:flex;gap:10px;align-items:center;width:100%;text-align:left;border:0;background:transparent;color:inherit;font:inherit;padding:8px 9px;border-radius:12px;cursor:pointer}.row[data-v-3d757c40]:hover{background:var(--md-surface-container-high)}.row.selected[data-v-3d757c40]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.row-main[data-v-3d757c40]{min-width:0;flex:1;display:flex;flex-direction:column;gap:2px}.row-top[data-v-3d757c40]{display:flex;justify-content:space-between;gap:8px}.row-top strong[data-v-3d757c40]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}.row-top small[data-v-3d757c40]{font-size:11px;opacity:.6;flex:0 0 auto}.row-sub[data-v-3d757c40]{font-size:12px;opacity:.75;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.me[data-v-3d757c40]{color:var(--md-primary);font-weight:700}.row.selected .me[data-v-3d757c40]{color:inherit;opacity:.85}.avatar[data-v-3d757c40]{position:relative;width:38px;height:38px;flex:0 0 38px;border-radius:50%;overflow:hidden;background:var(--md-primary);color:var(--md-on-primary, #fff);display:flex;align-items:center;justify-content:center;font-weight:800}.avatar.group[data-v-3d757c40]{border-radius:12px}.avatar.sm[data-v-3d757c40]{width:26px;height:26px;flex-basis:26px}.avatar img[data-v-3d757c40]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.fb[data-v-3d757c40]{font-size:14px}.thread[data-v-3d757c40]{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:0}.msg[data-v-3d757c40]{display:flex;opacity:1;transform:none;transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}@starting-style{.msg[data-v-3d757c40]{opacity:0;transform:translateY(4px)}}.msg.out[data-v-3d757c40]{justify-content:flex-end}.bubble[data-v-3d757c40]{max-width:82%;background:var(--md-surface-container-low);border-radius:8px 24px 24px;padding:8px 12px;display:flex;flex-direction:column;gap:3px;box-shadow:var(--shadow-1)}.msg.out .bubble[data-v-3d757c40]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px}.sender[data-v-3d757c40]{font-size:11px;font-weight:700;opacity:.75}.text[data-v-3d757c40]{white-space:pre-wrap;word-break:break-word;font-size:13px}.chip[data-v-3d757c40]{align-self:flex-start;font-size:11px;padding:1px 8px;border-radius:999px;background:color-mix(in srgb,currentColor 16%,transparent)}.time[data-v-3d757c40]{align-self:flex-end;font-size:10px;opacity:.6}.composer[data-v-3d757c40]{display:flex;gap:8px;padding:8px 10px;border-top:1px solid var(--md-outline-variant);align-items:flex-end;flex:0 0 auto;flex-wrap:wrap}.send-error[data-v-3d757c40]{flex:1 0 100%;margin:0;padding:6px 10px;border-radius:8px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:12px;overflow-wrap:anywhere}.composer textarea[data-v-3d757c40]{flex:1;resize:none;min-height:38px;max-height:110px;padding:9px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;outline:none}.composer textarea[data-v-3d757c40]:focus{border-color:var(--md-primary)}.composer button[data-v-3d757c40]{height:38px;padding:0 16px;border:0;border-radius:12px;background:var(--md-primary);color:var(--md-on-primary, #fff);font-weight:700;cursor:pointer}.composer button[data-v-3d757c40]:disabled{opacity:.5;cursor:not-allowed}.resize[data-v-3d757c40]{position:absolute;right:1px;bottom:1px;width:16px;height:16px;cursor:nwse-resize;touch-action:none;opacity:.5;background:repeating-linear-gradient(135deg,transparent 0 3px,var(--md-on-surface-variant) 3px 4px)}.resize[data-v-3d757c40]:hover{opacity:.85}.lsw-scrim[data-v-3d757c40]{position:fixed;inset:0;z-index:var(--z-modal, 4000);background:var(--md-scrim, color-mix(in srgb, #18132d 42%, transparent));backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.lsw-dialog[data-v-3d757c40]{width:min(560px,100%);max-height:85vh;overflow:auto;border-radius:28px;background:var(--md-surface);color:var(--md-on-surface);padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.lsw-dialog header[data-v-3d757c40]{display:flex;justify-content:space-between;align-items:center;gap:16px}.lsw-eyebrow[data-v-3d757c40]{font-size:12px;letter-spacing:2px;color:var(--md-primary);font-weight:700}.lsw-dialog h2[data-v-3d757c40]{font-size:24px;margin:8px 0}.lsw-meta[data-v-3d757c40]{font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere;margin:0}.lsw-body[data-v-3d757c40]{margin:16px 0;white-space:pre-wrap;overflow-wrap:anywhere}.lsw-dialog button[data-v-3d757c40]{border:0;border-radius:999px;padding:12px 20px;font:inherit;cursor:pointer;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.lsw-dialog .lsw-primary[data-v-3d757c40]{background:var(--md-primary);color:var(--md-on-primary, #fff)}.lsw-dialog footer[data-v-3d757c40]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px}.lsw-fab[data-v-3d757c40]{position:fixed;right:24px;bottom:24px;z-index:var(--z-toast, 6000);display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:12px 20px;background:var(--md-primary);color:var(--md-on-primary, #fff);font:inherit;font-weight:700;cursor:pointer;box-shadow:var(--shadow-3)}.lsw-badge[data-v-3d757c40]{background:var(--md-error);color:var(--md-on-error, #fff);border-radius:999px;padding:0 8px;font-size:12px}.lsw-fade-enter-active[data-v-3d757c40]{transition:opacity .24s var(--ease-emphasized-decel),transform .24s var(--ease-emphasized-decel)}.lsw-fade-leave-active[data-v-3d757c40]{transition:opacity .14s var(--ease-emphasized-accel),transform .14s var(--ease-emphasized-accel)}.lsw-fade-enter-from[data-v-3d757c40],.lsw-fade-leave-to[data-v-3d757c40]{opacity:0;transform:translateY(-6px) scale(.99)}.lsw-fab-enter-active[data-v-3d757c40]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.lsw-fab-leave-active[data-v-3d757c40]{transition:opacity .14s var(--ease-emphasized-accel),transform .14s var(--ease-emphasized-accel)}.lsw-fab-enter-from[data-v-3d757c40],.lsw-fab-leave-to[data-v-3d757c40]{opacity:0;transform:translateY(12px) scale(.9)}@media(prefers-reduced-motion:reduce){.lsw-fade-enter-active[data-v-3d757c40],.lsw-fade-leave-active[data-v-3d757c40],.lsw-fab-enter-active[data-v-3d757c40],.lsw-fab-leave-active[data-v-3d757c40]{transition-duration:1ms}.msg[data-v-3d757c40]{transition:none}}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.world-field[data-v-be260f43]{display:block;margin:10px 0}.world-label[data-v-be260f43]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-be260f43]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-be260f43]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-be260f43]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-be260f43]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-be260f43]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-be260f43]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-be260f43]{position:relative;margin-top:8px}.world-map-leaflet[data-v-be260f43]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-be260f43]{display:none}.wm-reset[data-v-be260f43]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-be260f43]:hover{background:#fff}.wm-compass[data-v-be260f43]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay,2000);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-be260f43]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-be260f43]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-be260f43]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay,2000);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-be260f43]:hover{background:#fff}.wm-offline[data-v-be260f43]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay,2000);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-be260f43]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-be260f43]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-be260f43]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-be260f43]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-be260f43]{flex:0 0 88px}.wm-routes span[data-v-be260f43]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-be260f43]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-be260f43]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-be260f43]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-be260f43]{background:#e07a5f}.wm-legend i.k-work[data-v-be260f43]{background:#5b8def}.wm-legend i.k-shop[data-v-be260f43]{background:#e0a23d}.wm-legend i.k-food[data-v-be260f43]{background:#57a773}.wm-legend i.k-park[data-v-be260f43]{background:#3faead}.wm-legend i.k-transit[data-v-be260f43]{background:#8b6fd6}.wm-legend i.k-other[data-v-be260f43]{background:#8a94a6}.wm-legend i.k-actor[data-v-be260f43]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-be260f43]{background:#d64545}.wm-legend i.k-bus[data-v-be260f43]{background:#e08a2e}.wm-legend i.k-park2[data-v-be260f43]{background:#9bd08f}.wm-legend i.k-water[data-v-be260f43]{background:#8fbfe6}.wm-legend i.k-hw[data-v-be260f43]{background:#f08c2e}.wm-legend i.k-arterial[data-v-be260f43]{background:#f7cf8a}.wm-legend i.k-street[data-v-be260f43]{background:#fff;border-color:#b9c3cd}.pfield[data-v-be260f43]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}#app .pcp .pfield textarea.field[data-v-be260f43]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-be260f43]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-be260f43]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-be260f43]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cog-metric.warn[data-v-be260f43]{border-color:var(--md-error,#b3261e);background:color-mix(in srgb,var(--md-error,#b3261e) 8%,transparent)}.cog-metric.warn span[data-v-be260f43],.cog-metric.warn strong[data-v-be260f43]{color:var(--md-error,#b3261e)}.som-channels[data-v-be260f43]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-be260f43]{display:grid;grid-template-columns:minmax(52px,88px) minmax(0,1fr) 48px;align-items:center;gap:10px}.som-chan-name[data-v-be260f43]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.som-chan-bar[data-v-be260f43]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-be260f43]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-be260f43]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.chip[data-v-be260f43]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-be260f43]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-be260f43]{background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}#app .pcp .cog-metric[data-v-be260f43]{background:var(--md-surface-container)}.sync-pill[data-v-be260f43]{font-weight:500;opacity:.85}html[data-theme=dark] #app .pcp .world-map-leaflet{background:#10151c}html[data-theme=dark] #app .pcp .wm-reset,html[data-theme=dark] #app .pcp .wm-scope{background:color-mix(in srgb,var(--md-surface-container-high) 94%,transparent);color:var(--md-on-surface)}html[data-theme=dark] #app .pcp .wm-reset:hover,html[data-theme=dark] #app .pcp .wm-scope:hover{background:var(--md-surface-container-highest)}html[data-theme=dark] #app .pcp .wm-compass{background:color-mix(in srgb,var(--md-surface-container-high) 92%,transparent);border-color:var(--md-outline-variant)}html[data-theme=dark] .wm-district-inner{color:#aeb9c4;text-shadow:none}html[data-theme=dark] .wm-station .wm-route-inner{background:#1a2230;color:#d7dee6}html[data-theme=dark] .leaflet-container{background:#10151c}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}\n";document.head.appendChild(s)}})();
