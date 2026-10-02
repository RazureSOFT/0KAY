import { defineComponent as gt, ref as d, computed as L, watch as S, onMounted as yt, openBlock as l, createElementBlock as o, createElementVNode as t, toDisplayString as n, createStaticVNode as F, normalizeStyle as I, Fragment as g, renderList as N, createCommentVNode as h, normalizeClass as C, withDirectives as y, vModelText as V, vModelSelect as Z, createVNode as it, TransitionGroup as kt, withCtx as wt, withModifiers as xt } from "vue";
import { _ as Ct, u as Mt, a as $t } from "./assets/_plugin-vue_export-helper-Bl_tmTjg.js";
const Tt = { class: "page memory-page" }, jt = { class: "page-inner" }, Lt = { class: "page-header" }, St = { class: "header-actions" }, Ft = ["disabled"], It = ["disabled"], Nt = ["disabled"], Vt = { class: "stat-grid" }, Bt = { class: "stat-card" }, Et = { class: "stat-value" }, Rt = { class: "stat-card" }, Ut = { class: "stat-value" }, Ot = { class: "stat-card" }, Dt = { class: "stat-value" }, qt = { class: "stat-card" }, zt = { class: "stat-value" }, Ht = {
  key: 0,
  class: "card",
  style: { "margin-top": "16px" }
}, Pt = { class: "card-head" }, At = { class: "chip muted" }, Jt = { style: { display: "grid", "grid-template-columns": "1.4fr 1fr 1fr", gap: "18px", "align-items": "end" } }, Gt = { style: { display: "flex", "align-items": "center", gap: "10px", margin: "6px 0" } }, Kt = { style: { flex: "1", height: "10px", "border-radius": "999px", background: "var(--md-surface-container-high)", overflow: "hidden" } }, Qt = { style: { display: "flex", "align-items": "center", gap: "10px", margin: "6px 0" } }, Wt = { style: { flex: "1", height: "10px", "border-radius": "999px", background: "var(--md-surface-container-high)", overflow: "hidden" } }, Yt = { class: "hint" }, Xt = { style: { display: "flex", "align-items": "flex-end", gap: "3px", height: "60px" } }, Zt = ["title"], te = {
  viewBox: "0 0 200 60",
  style: { width: "100%", height: "60px", color: "var(--md-primary)" },
  "aria-label": "遗忘曲线"
}, ee = ["points"], se = { class: "tabs" }, ae = { class: "card toolbar" }, ne = { class: "search-field" }, le = { class: "select" }, oe = { class: "select" }, ie = { class: "chip muted" }, de = { class: "memory-list" }, re = { class: "card-top" }, ce = {
  key: 0,
  class: "chip muted"
}, ue = { class: "chip muted" }, ve = ["onClick"], pe = { class: "memory-content" }, he = {
  key: 0,
  class: "tags"
}, me = { class: "memory-foot" }, _e = {
  class: "meter",
  title: "重要性"
}, fe = { class: "meter-bar" }, be = {
  class: "meter",
  title: "强度"
}, ge = { class: "meter-bar" }, ye = { class: "meter-text" }, ke = {
  key: 1,
  class: "detail"
}, we = { class: "card-actions" }, xe = ["onClick"], Ce = ["onClick"], Me = ["onClick"], $e = ["onClick"], Te = {
  key: 0,
  class: "empty-state"
}, je = {
  key: 0,
  class: "pager"
}, Le = ["disabled"], Se = { class: "chip muted" }, Fe = ["disabled"], Ie = { class: "grid-notes" }, Ne = { class: "card" }, Ve = ["disabled"], Be = { class: "card" }, Ee = { class: "card-head" }, Re = { class: "chip muted" }, Ue = { class: "search-field mini" }, Oe = { class: "note-list" }, De = { class: "note-main" }, qe = { class: "item-meta" }, ze = { class: "item-meta" }, He = {
  key: 0,
  class: "chip muted"
}, Pe = { class: "note-actions" }, Ae = ["onClick"], Je = ["onClick"], Ge = {
  key: 0,
  class: "list-empty"
}, Ke = {
  key: 0,
  class: "card reader"
}, Qe = { class: "card-head" }, We = { class: "card-title" }, Ye = { class: "pager" }, Xe = ["disabled"], Ze = { class: "chip muted" }, ts = ["disabled"], es = { class: "card toolbar" }, ss = { class: "select" }, as = { class: "chip muted" }, ns = { class: "reflection-list" }, ls = { class: "card-head" }, os = { class: "card-title" }, is = {
  key: 0,
  class: "chip muted"
}, ds = { class: "item-meta" }, rs = { class: "quote" }, cs = { class: "quote" }, us = {
  key: 0,
  class: "card-actions"
}, vs = ["onClick"], ps = ["onClick"], hs = {
  key: 0,
  class: "empty-state"
}, ms = {
  key: 4,
  class: "error-banner"
}, _s = {
  key: 5,
  class: "notice"
}, B = 30, fs = /* @__PURE__ */ gt({
  __name: "MemoryPage",
  setup(bs) {
    const { confirm: A } = Mt(), _ = d("memories"), E = d(""), R = d(""), U = d("recent"), b = d(0), J = d([]), G = d(0), M = d({ working: 0, shortTerm: { total: 0 }, longTerm: 0, avgStrength: 0 }), c = d(null), tt = L(() => Math.max(1, c.value?.tiers?.short_term || 0, c.value?.tiers?.long_term || 0)), dt = L(() => Math.max(1, ...c.value?.strength_histogram || [1])), rt = L(() => (c.value?.decay_curve || []).map((e) => `${(e.day / 90 * 200).toFixed(1)},${(60 - e.strength * 60).toFixed(1)}`).join(" "));
    function K(a, e) {
      return `${Math.round((a || 0) / Math.max(1, e) * 100)}%`;
    }
    const f = d(!1), r = d(""), $ = d(""), T = d(""), O = d([]), D = d(""), v = d({ title: "", content: "", tags: "" }), p = d(null), q = d([]), z = d("proposed"), H = L(() => Math.max(1, Math.ceil(G.value / B))), Q = L(() => Math.floor(b.value / B) + 1);
    function w(a) {
      return `${Math.round(Math.max(0, Math.min(1, a || 0)) * 100)}%`;
    }
    function ct(a) {
      return a === "long_term" ? "长期记忆" : a === "short_term" ? "短期记忆" : "工作记忆";
    }
    function W(a) {
      if (!a) return "";
      const e = new Date(a);
      return Number.isNaN(e.getTime()) ? a : e.toLocaleString();
    }
    function j(a) {
      $.value = a, setTimeout(() => {
        $.value === a && ($.value = "");
      }, 2e3);
    }
    async function u(a, e) {
      const s = await fetch("/api/life/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: a, payload: e })
      });
      if (!s.ok) throw new Error(await s.text() || `HTTP ${s.status}`);
      return s.json().catch(() => ({}));
    }
    async function k() {
      try {
        const a = await fetch("/api/life/memories?limit=1");
        if (a.ok) {
          const e = await a.json();
          e.stats && (M.value = e.stats);
        }
      } catch {
      }
    }
    async function et() {
      try {
        c.value = await u("memory_dashboard", {});
      } catch {
      }
    }
    async function m() {
      f.value = !0, r.value = "";
      try {
        const a = await u("memory_page", { tier: R.value, query: E.value.trim(), limit: B, offset: b.value, sort: U.value });
        J.value = a.items || [], G.value = a.total || 0;
      } catch (a) {
        r.value = a?.message || "无法读取记忆";
      } finally {
        f.value = !1;
      }
    }
    async function P() {
      f.value = !0, r.value = "";
      try {
        const a = await u("memory_note_list", { query: D.value.trim(), limit: 60 });
        O.value = a.notes || [];
      } catch (a) {
        r.value = a?.message || "无法读取笔记";
      } finally {
        f.value = !1;
      }
    }
    async function Y() {
      f.value = !0, r.value = "";
      try {
        const a = await u("memory_reflection_list", { status: z.value, limit: 80 });
        q.value = a.reflections || [];
      } catch (a) {
        r.value = a?.message || "无法读取反思提案";
      } finally {
        f.value = !1;
      }
    }
    function st() {
      return k(), et(), _.value === "notes" ? P() : _.value === "reflections" ? Y() : m();
    }
    async function ut(a) {
      try {
        await u("memory_reinforce", { ids: [a.id] }), j("已再巩固"), await m();
      } catch (e) {
        r.value = e?.message || "强化失败";
      }
    }
    async function at(a, e) {
      try {
        await u("memory_importance", { id: a.id, delta: e }), await m();
      } catch (s) {
        r.value = s?.message || "调整失败";
      }
    }
    async function vt() {
      try {
        const a = await u("memory_export", {}), e = new Blob([JSON.stringify(a, null, 2)], { type: "application/json" }), s = URL.createObjectURL(e), i = document.createElement("a");
        i.href = s, i.download = `0kay-memory-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, i.click(), URL.revokeObjectURL(s), j("已导出记忆快照");
      } catch (a) {
        r.value = a?.message || "导出失败";
      }
    }
    const nt = d(null);
    async function pt(a) {
      const e = a.target, s = e.files?.[0];
      if (s)
        try {
          const i = JSON.parse(await s.text()), ot = await u("memory_import", { snapshot: i });
          j(`导入完成：新增 ${ot.imported || 0} · 跳过 ${ot.skipped || 0}`), await m(), await k();
        } catch (i) {
          r.value = i?.message || "导入失败";
        } finally {
          e.value = "";
        }
    }
    async function ht(a) {
      if (await A({
        title: "永久删除记忆",
        message: "这条记忆会被彻底抹掉：事实库、内存分层、检索投影，以及所有本地备份里的副本。删除后无法恢复，也无法通过导入备份找回。确定继续吗？",
        confirmLabel: "永久删除",
        danger: !0
      }))
        try {
          await u("delete_memory", { id: a.id }), await m(), await k();
        } catch (s) {
          r.value = s?.message || "删除失败";
        }
    }
    async function mt() {
      if (await A({
        title: "清除全部记忆",
        message: `清空工作 / 短期 / 长期记忆、笔记、反思提案与本地备份。
注意：这只清记忆层——关系、目标、承诺、自我叙事都还在，人还是原来那个人。
如果想连同关系与自我一起回到出厂状态，请到「伴侣」页的「重置整个人」。
此操作不可撤销。`,
        confirmLabel: "清除全部记忆",
        danger: !0
      }))
        try {
          await u("clear_all_memory", {}), await m(), await k();
        } catch (e) {
          r.value = e?.message || "清除失败";
        }
    }
    async function _t() {
      if (!(!v.value.content.trim() && !v.value.title.trim()))
        try {
          await u("memory_note_create", {
            title: v.value.title,
            content: v.value.content,
            tags: v.value.tags.split(",").map((a) => a.trim()).filter(Boolean)
          }), v.value = { title: "", content: "", tags: "" }, j("笔记已保存"), await P();
        } catch (a) {
          r.value = a?.message || "保存笔记失败";
        }
    }
    async function X(a, e = 1) {
      try {
        const s = await u("memory_note_read", { note_id: a.note_id, offset: e, limit: 400 });
        p.value = { ...s, offset: s.offset || e };
      } catch (s) {
        r.value = s?.message || "读取笔记失败";
      }
    }
    async function ft(a) {
      if (await A({ title: "删除笔记", message: `删除笔记「${a.note_id}」及其分块？`, confirmLabel: "删除", danger: !0 }))
        try {
          await u("memory_note_delete", { note_id: a.note_id }), p.value?.note_id === a.note_id && (p.value = null), await P();
        } catch (s) {
          r.value = s?.message || "删除笔记失败";
        }
    }
    async function lt(a, e) {
      try {
        await u("memory_reflection_review", { id: a.id, accept: e }), await Y(), await k();
      } catch (s) {
        r.value = s?.message || "审核失败";
      }
    }
    async function bt() {
      try {
        const a = await u("memory_maintenance", {});
        j(`维护完成：巩固 ${a.consolidated ?? 0} 条`), await m(), await k();
      } catch (a) {
        r.value = a?.message || "维护失败";
      }
    }
    let x = null;
    return S(E, () => {
      b.value = 0, x && clearTimeout(x), x = setTimeout(m, 250);
    }), S([R, U], () => {
      b.value = 0, m();
    }), S(D, () => {
      x && clearTimeout(x), x = setTimeout(P, 250);
    }), S(z, Y), S(_, st), yt(async () => {
      await m(), await k(), await et();
    }), (a, e) => (l(), o("main", Tt, [
      t("div", jt, [
        t("header", Lt, [
          e[17] || (e[17] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / MEMORY"),
            t("h1", null, "记忆管理台"),
            t("p", { class: "subtitle" }, "浏览 LIFE 的记忆分层、强度与召回；管理笔记、审核反思提案。记忆由 LIFE 插件维护，禁用后此入口消失。")
          ], -1)),
          t("div", St, [
            t("button", {
              class: "btn btn-tonal",
              disabled: f.value,
              onClick: bt
            }, "巩固维护", 8, Ft),
            t("button", {
              class: "btn btn-danger",
              disabled: f.value,
              onClick: mt,
              title: "只清记忆层；重置整个人在「伴侣」页"
            }, "清除全部记忆", 8, It),
            t("button", {
              class: "btn btn-tonal",
              disabled: f.value,
              onClick: st
            }, n(f.value ? "加载中…" : "刷新"), 9, Nt)
          ])
        ]),
        t("section", Vt, [
          t("article", Bt, [
            e[18] || (e[18] = F('<div class="stat-head" data-v-c4f2d266><span class="icon-badge tone-1" aria-hidden="true" data-v-c4f2d266><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-c4f2d266><path d="M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-c4f2d266></path></svg></span><span class="stat-label" data-v-c4f2d266>工作记忆</span></div>', 1)),
            t("strong", Et, n(M.value.working), 1),
            e[19] || (e[19] = t("span", { class: "stat-hint" }, "当前上下文", -1))
          ]),
          t("article", Rt, [
            e[20] || (e[20] = F('<div class="stat-head" data-v-c4f2d266><span class="icon-badge tone-2" aria-hidden="true" data-v-c4f2d266><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-c4f2d266><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" data-v-c4f2d266></circle><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-c4f2d266></path></svg></span><span class="stat-label" data-v-c4f2d266>短期记忆</span></div>', 1)),
            t("strong", Ut, n(M.value.shortTerm?.total || 0), 1),
            e[21] || (e[21] = t("span", { class: "stat-hint" }, "待巩固记录", -1))
          ]),
          t("article", Ot, [
            e[22] || (e[22] = F('<div class="stat-head" data-v-c4f2d266><span class="icon-badge tone-3" aria-hidden="true" data-v-c4f2d266><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-c4f2d266><path d="M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 21.5v-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-c4f2d266></path></svg></span><span class="stat-label" data-v-c4f2d266>长期记忆</span></div>', 1)),
            t("strong", Dt, n(M.value.longTerm || 0), 1),
            e[23] || (e[23] = t("span", { class: "stat-hint" }, "稳定沉淀", -1))
          ]),
          t("article", qt, [
            e[24] || (e[24] = F('<div class="stat-head" data-v-c4f2d266><span class="icon-badge tone-4" aria-hidden="true" data-v-c4f2d266><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-c4f2d266><path d="M4 14l4-4 3 3 5-6 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-c4f2d266></path><path d="M4 19h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-c4f2d266></path></svg></span><span class="stat-label" data-v-c4f2d266>平均强度</span></div>', 1)),
            t("strong", zt, n(w(M.value.avgStrength)), 1),
            e[25] || (e[25] = t("span", { class: "stat-hint" }, "遗忘曲线后的值", -1))
          ])
        ]),
        c.value ? (l(), o("section", Ht, [
          t("div", Pt, [
            e[26] || (e[26] = t("h2", { class: "card-title" }, "记忆动力学（TMD / RRF）", -1)),
            t("span", At, "RRF k=" + n(c.value.rrf_k), 1)
          ]),
          t("div", Jt, [
            t("div", null, [
              t("div", Gt, [
                e[27] || (e[27] = t("span", { style: { width: "48px", "font-size": "12px" } }, "短期", -1)),
                t("div", Kt, [
                  t("i", {
                    style: I({ display: "block", height: "100%", width: K(c.value.tiers.short_term, tt.value) })
                  }, null, 4)
                ]),
                t("b", null, n(c.value.tiers.short_term), 1)
              ]),
              t("div", Qt, [
                e[28] || (e[28] = t("span", { style: { width: "48px", "font-size": "12px" } }, "长期", -1)),
                t("div", Wt, [
                  t("i", {
                    style: I({ display: "block", height: "100%", width: K(c.value.tiers.long_term, tt.value) })
                  }, null, 4)
                ]),
                t("b", null, n(c.value.tiers.long_term), 1)
              ]),
              t("p", Yt, "平均强度 " + n(w(c.value.avg_strength)) + " · 低强度 " + n(c.value.low_strength) + " · 语义 " + n(c.value.types?.semantic || 0) + " / 情景 " + n(c.value.types?.episode || 0), 1)
            ]),
            t("div", null, [
              e[29] || (e[29] = t("p", { class: "hint" }, "强度分布（0→1）", -1)),
              t("div", Xt, [
                (l(!0), o(g, null, N(c.value.strength_histogram, (s, i) => (l(), o("i", {
                  key: i,
                  title: `${i / 10}~${(i + 1) / 10}: ${s}`,
                  style: I({ flex: "1", background: "var(--md-primary)", borderRadius: "3px 3px 0 0", height: K(s, dt.value) })
                }, null, 12, Zt))), 128))
              ])
            ]),
            t("div", null, [
              e[30] || (e[30] = t("p", { class: "hint" }, "遗忘曲线（重要度 0.7，λ=0.05）", -1)),
              (l(), o("svg", te, [
                t("polyline", {
                  points: rt.value,
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, 8, ee)
              ]))
            ])
          ])
        ])) : h("", !0),
        t("nav", se, [
          t("button", {
            class: C({ active: _.value === "memories" }),
            onClick: e[0] || (e[0] = (s) => _.value = "memories")
          }, "记忆", 2),
          t("button", {
            class: C({ active: _.value === "notes" }),
            onClick: e[1] || (e[1] = (s) => _.value = "notes")
          }, "笔记", 2),
          t("button", {
            class: C({ active: _.value === "reflections" }),
            onClick: e[2] || (e[2] = (s) => _.value = "reflections")
          }, "反思提案", 2)
        ]),
        _.value === "memories" ? (l(), o(g, { key: 1 }, [
          t("section", ae, [
            t("div", ne, [
              e[31] || (e[31] = t("svg", {
                class: "search-icon",
                width: "17",
                height: "17",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                t("circle", {
                  cx: "11",
                  cy: "11",
                  r: "6.5",
                  stroke: "currentColor",
                  "stroke-width": "1.8"
                }),
                t("path", {
                  d: "M16 16l4.5 4.5",
                  stroke: "currentColor",
                  "stroke-width": "1.8",
                  "stroke-linecap": "round"
                })
              ], -1)),
              y(t("input", {
                "onUpdate:modelValue": e[3] || (e[3] = (s) => E.value = s),
                placeholder: "搜索记忆内容或标签",
                "aria-label": "搜索记忆"
              }, null, 512), [
                [V, E.value]
              ])
            ]),
            t("label", le, [
              e[33] || (e[33] = t("span", null, "层级", -1)),
              y(t("select", {
                "onUpdate:modelValue": e[4] || (e[4] = (s) => R.value = s)
              }, [...e[32] || (e[32] = [
                t("option", { value: "" }, "全部", -1),
                t("option", { value: "short_term" }, "短期", -1),
                t("option", { value: "long_term" }, "长期", -1)
              ])], 512), [
                [Z, R.value]
              ])
            ]),
            t("label", oe, [
              e[35] || (e[35] = t("span", null, "排序", -1)),
              y(t("select", {
                "onUpdate:modelValue": e[5] || (e[5] = (s) => U.value = s)
              }, [...e[34] || (e[34] = [
                t("option", { value: "recent" }, "最近", -1),
                t("option", { value: "strength" }, "强度", -1),
                t("option", { value: "importance" }, "重要性", -1),
                t("option", { value: "recall" }, "召回次数", -1)
              ])], 512), [
                [Z, U.value]
              ])
            ]),
            t("span", ie, n(G.value) + " 条 · 第 " + n(Q.value) + "/" + n(H.value) + " 页", 1),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: vt
            }, "导出"),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: e[6] || (e[6] = (s) => nt.value?.click())
            }, "导入"),
            t("input", {
              ref_key: "importInput",
              ref: nt,
              type: "file",
              accept: "application/json,.json",
              class: "hidden-input",
              onChange: pt
            }, null, 544)
          ]),
          t("section", de, [
            it(kt, { name: "memory-card" }, {
              default: wt(() => [
                (l(!0), o(g, null, N(J.value, (s) => (l(), o("article", {
                  key: s.id,
                  class: C(["memory-card", { open: T.value === s.id }])
                }, [
                  t("div", re, [
                    t("span", {
                      class: C(["chip", "tier-" + (s.tier === "long_term" ? "long" : "short")])
                    }, n(ct(s.tier)), 3),
                    s.scope && s.scope !== "public" ? (l(), o("span", ce, n(s.scope), 1)) : h("", !0),
                    t("span", ue, n(s.memory_type || "knowledge"), 1),
                    t("button", {
                      class: "btn-icon danger",
                      title: "删除记忆",
                      onClick: (i) => ht(s)
                    }, [...e[36] || (e[36] = [
                      t("svg", {
                        width: "15",
                        height: "15",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        "aria-hidden": "true"
                      }, [
                        t("path", {
                          d: "M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13",
                          stroke: "currentColor",
                          "stroke-width": "1.8",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round"
                        })
                      ], -1)
                    ])], 8, ve)
                  ]),
                  t("p", pe, n(s.content), 1),
                  s.tags?.length ? (l(), o("div", he, [
                    (l(!0), o(g, null, N(s.tags, (i) => (l(), o("span", { key: i }, "#" + n(i), 1))), 128))
                  ])) : h("", !0),
                  t("footer", me, [
                    t("div", _e, [
                      e[37] || (e[37] = t("span", null, "重要性", -1)),
                      t("div", fe, [
                        t("i", {
                          style: I({ "--v": w(s.importance) }),
                          class: "fill-primary"
                        }, null, 4)
                      ]),
                      t("b", null, n(w(s.importance)), 1)
                    ]),
                    t("div", be, [
                      e[38] || (e[38] = t("span", null, "强度", -1)),
                      t("div", ge, [
                        t("i", {
                          style: I({ "--v": w(s.strength) }),
                          class: "fill-secondary"
                        }, null, 4)
                      ]),
                      t("b", null, n(w(s.strength)), 1)
                    ]),
                    t("span", ye, "召回 " + n(s.recall_count || 0) + " 次", 1)
                  ]),
                  T.value === s.id ? (l(), o("div", ke, [
                    t("dl", null, [
                      t("div", null, [
                        e[39] || (e[39] = t("dt", null, "ID", -1)),
                        t("dd", null, [
                          t("code", null, n(s.id), 1)
                        ])
                      ]),
                      t("div", null, [
                        e[40] || (e[40] = t("dt", null, "来源", -1)),
                        t("dd", null, n(s.source_kind || "conversation"), 1)
                      ]),
                      t("div", null, [
                        e[41] || (e[41] = t("dt", null, "创建", -1)),
                        t("dd", null, n(W(s.created_at)), 1)
                      ]),
                      t("div", null, [
                        e[42] || (e[42] = t("dt", null, "最近召回", -1)),
                        t("dd", null, n(W(s.last_recalled)), 1)
                      ])
                    ])
                  ])) : h("", !0),
                  t("div", we, [
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      onClick: (i) => T.value = T.value === s.id ? "" : s.id
                    }, n(T.value === s.id ? "收起" : "详情"), 9, xe),
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      onClick: (i) => at(s, 0.1)
                    }, "重要 +", 8, Ce),
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      onClick: (i) => at(s, -0.1)
                    }, "重要 −", 8, Me),
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      onClick: (i) => ut(s)
                    }, "再巩固", 8, $e)
                  ])
                ], 2))), 128))
              ]),
              _: 1
            }),
            !f.value && !J.value.length ? (l(), o("div", Te, [...e[43] || (e[43] = [
              t("p", null, "暂无匹配记忆", -1),
              t("p", { class: "hint" }, "LIFE 会在对话与工具调用中逐步沉淀记忆。", -1)
            ])])) : h("", !0)
          ]),
          H.value > 1 ? (l(), o("div", je, [
            t("button", {
              class: "btn btn-tonal btn-sm",
              disabled: b.value === 0,
              onClick: e[7] || (e[7] = (s) => {
                b.value = Math.max(0, b.value - B), m();
              })
            }, "上一页", 8, Le),
            t("span", Se, n(Q.value) + " / " + n(H.value), 1),
            t("button", {
              class: "btn btn-tonal btn-sm",
              disabled: Q.value >= H.value,
              onClick: e[8] || (e[8] = (s) => {
                b.value += B, m();
              })
            }, "下一页", 8, Fe)
          ])) : h("", !0)
        ], 64)) : _.value === "notes" ? (l(), o(g, { key: 2 }, [
          t("section", Ie, [
            t("article", Ne, [
              e[44] || (e[44] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "新建笔记")
              ], -1)),
              t("form", {
                class: "stack-form",
                onSubmit: xt(_t, ["prevent"])
              }, [
                y(t("input", {
                  "onUpdate:modelValue": e[9] || (e[9] = (s) => v.value.title = s),
                  class: "input",
                  placeholder: "标题",
                  "aria-label": "笔记标题"
                }, null, 512), [
                  [V, v.value.title]
                ]),
                y(t("input", {
                  "onUpdate:modelValue": e[10] || (e[10] = (s) => v.value.tags = s),
                  class: "input",
                  placeholder: "标签（逗号分隔，可选）",
                  "aria-label": "笔记标签"
                }, null, 512), [
                  [V, v.value.tags]
                ]),
                y(t("textarea", {
                  "onUpdate:modelValue": e[11] || (e[11] = (s) => v.value.content = s),
                  class: "input area",
                  placeholder: "笔记正文…",
                  "aria-label": "笔记正文"
                }, null, 512), [
                  [V, v.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !v.value.content.trim() && !v.value.title.trim()
                }, "保存笔记", 8, Ve)
              ], 32)
            ]),
            t("article", Be, [
              t("div", Ee, [
                e[45] || (e[45] = t("h2", { class: "card-title" }, "笔记库", -1)),
                t("span", Re, n(O.value.length), 1)
              ]),
              t("div", Ue, [
                y(t("input", {
                  "onUpdate:modelValue": e[12] || (e[12] = (s) => D.value = s),
                  placeholder: "搜索笔记…",
                  "aria-label": "搜索笔记"
                }, null, 512), [
                  [V, D.value]
                ])
              ]),
              t("ul", Oe, [
                (l(!0), o(g, null, N(O.value, (s) => (l(), o("li", {
                  key: s.note_id,
                  class: "note-item"
                }, [
                  t("div", De, [
                    t("strong", null, n(s.note_id), 1),
                    t("span", qe, n(s.preview?.slice(0, 90) || "（空）"), 1),
                    t("span", ze, n((s.bytes / 1024).toFixed(1)) + " KB", 1),
                    s.scope && s.scope !== "public" ? (l(), o("span", He, "scope：" + n(s.scope), 1)) : h("", !0)
                  ]),
                  t("div", Pe, [
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      onClick: (i) => X(s)
                    }, "阅读", 8, Ae),
                    t("button", {
                      class: "btn btn-sm btn-danger",
                      onClick: (i) => ft(s)
                    }, "删除", 8, Je)
                  ])
                ]))), 128)),
                O.value.length ? h("", !0) : (l(), o("li", Ge, "还没有笔记。LIFE 或你可以把长内容写入笔记并参与检索。"))
              ])
            ])
          ]),
          p.value ? (l(), o("section", Ke, [
            t("div", Qe, [
              t("h2", We, n(p.value.note_id), 1),
              t("button", {
                class: "btn btn-sm btn-tonal",
                onClick: e[13] || (e[13] = (s) => p.value = null)
              }, "关闭")
            ]),
            t("pre", null, n(p.value.content), 1),
            t("div", Ye, [
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: p.value.offset <= 1,
                onClick: e[14] || (e[14] = (s) => X({ note_id: p.value.note_id }, Math.max(1, p.value.offset - 400)))
              }, "上一段", 8, Xe),
              t("span", Ze, n(p.value.total_lines) + " 行", 1),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: !p.value.has_more,
                onClick: e[15] || (e[15] = (s) => X({ note_id: p.value.note_id }, p.value.offset + 400))
              }, "下一段", 8, ts)
            ])
          ])) : h("", !0)
        ], 64)) : (l(), o(g, { key: 3 }, [
          t("section", es, [
            t("label", ss, [
              e[47] || (e[47] = t("span", null, "状态", -1)),
              y(t("select", {
                "onUpdate:modelValue": e[16] || (e[16] = (s) => z.value = s)
              }, [...e[46] || (e[46] = [
                F('<option value="proposed" data-v-c4f2d266>待审核</option><option value="pending" data-v-c4f2d266>待处理</option><option value="applied" data-v-c4f2d266>已采纳</option><option value="rejected" data-v-c4f2d266>已拒绝</option><option value="" data-v-c4f2d266>全部</option>', 5)
              ])], 512), [
                [Z, z.value]
              ])
            ]),
            t("span", as, n(q.value.length) + " 条", 1)
          ]),
          t("section", ns, [
            (l(!0), o(g, null, N(q.value, (s) => (l(), o("article", {
              key: s.id,
              class: "card reflection"
            }, [
              t("div", ls, [
                t("h3", os, n(s.statement || "（无摘要）"), 1),
                t("span", {
                  class: C(["chip", s.status === "applied" ? "chip-ok" : s.status === "rejected" ? "chip-warn" : "muted"])
                }, n(s.status), 3),
                s.scope && s.scope !== "public" ? (l(), o("span", is, "scope：" + n(s.scope), 1)) : h("", !0)
              ]),
              t("p", ds, "来源会话 " + n(s.session_id) + " · " + n(W(s.created_at)), 1),
              t("details", null, [
                e[48] || (e[48] = t("summary", null, "查看原始对话", -1)),
                t("p", rs, "用户：" + n(s.user_text), 1),
                t("p", cs, "LIFE：" + n(s.assistant_text), 1)
              ]),
              s.status === "proposed" ? (l(), o("div", us, [
                t("button", {
                  class: "btn btn-sm btn-primary",
                  onClick: (i) => lt(s, !0)
                }, "采纳为记忆", 8, vs),
                t("button", {
                  class: "btn btn-sm btn-danger",
                  onClick: (i) => lt(s, !1)
                }, "拒绝", 8, ps)
              ])) : h("", !0)
            ]))), 128)),
            q.value.length ? h("", !0) : (l(), o("div", hs, [...e[49] || (e[49] = [
              t("p", null, "没有该状态的反思提案", -1),
              t("p", { class: "hint" }, "LIFE 从对话中提炼低风险记忆提案，等你确认。", -1)
            ])]))
          ])
        ], 64)),
        r.value ? (l(), o("p", ms, n(r.value), 1)) : h("", !0),
        $.value ? (l(), o("p", _s, n($.value), 1)) : h("", !0)
      ]),
      it(Ct)
    ]));
  }
}), ks = /* @__PURE__ */ $t(fs, [["__scopeId", "data-v-c4f2d266"]]);
export {
  ks as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:var(--z-modal);background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.confirm-dialog:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}@media (prefers-reduced-motion: reduce){.confirm-dialog{animation:none;transition:none}}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium),border-radius var(--duration-medium) var(--ease-spring)}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short)}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform var(--duration-medium) var(--ease-spring)}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:var(--z-popover);overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color var(--duration-short),border-radius var(--duration-medium) var(--ease-spring),color var(--duration-short)}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity var(--duration-short) var(--ease-emphasized),transform var(--duration-medium) var(--ease-spring)}.select-menu-leave-active{transition:opacity var(--duration-short),transform var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}@media (prefers-reduced-motion: reduce){#app .app-select-trigger{transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium)}.app-select-chevron,.app-select-chevron svg,.app-select-option{transition:none}.select-menu-enter-active,.select-menu-leave-active{transition:opacity var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{transform:none}}.pcp[data-v-1b5bfabf]{--r-xs:10px;--r-sm:14px;--r-md:20px;--r-lg:28px;--r-xl:36px;--spring:cubic-bezier(.2,.9,.25,1.15);height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;background:var(--md-surface);color:var(--md-on-surface);max-width:1240px;margin:0 auto}h1[data-v-1b5bfabf],h2[data-v-1b5bfabf],h3[data-v-1b5bfabf],h4[data-v-1b5bfabf]{margin:0;letter-spacing:-.01em}.eyebrow[data-v-1b5bfabf]{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}.eyebrow b[data-v-1b5bfabf]{font-size:9px}.hero[data-v-1b5bfabf]{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}.hero[data-v-1b5bfabf]:after{content:\"\";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}.hero-main[data-v-1b5bfabf]{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}.hero-copy h1[data-v-1b5bfabf]{font-size:clamp(26px,3.4vw,40px);font-weight:800}.sub[data-v-1b5bfabf]{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}.hero-actions[data-v-1b5bfabf]{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.fab[data-v-1b5bfabf]{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);transition:transform .28s var(--spring),box-shadow .28s}@media (hover: hover) and (pointer: fine){.fab[data-v-1b5bfabf]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}.fab[data-v-1b5bfabf]:disabled{opacity:.6;cursor:not-allowed}.fab-ic[data-v-1b5bfabf]{font-size:17px}.state-row[data-v-1b5bfabf]{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}.pill[data-v-1b5bfabf]{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}.pill.soft[data-v-1b5bfabf]{font-weight:500;color:var(--md-on-surface-variant)}.pill.bad[data-v-1b5bfabf]{background:#ffdcc6;color:#7a3a00}.banner[data-v-1b5bfabf]{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}.banner.err[data-v-1b5bfabf]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-1b5bfabf]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tabs[data-v-1b5bfabf]{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}.tab[data-v-1b5bfabf]{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .25s,color .25s,transform .25s var(--spring)}.tab i[data-v-1b5bfabf]{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}.tab-ic[data-v-1b5bfabf]{font-size:14px}.tab[data-v-1b5bfabf]:hover{background:var(--md-surface-container-high)}.tab.active[data-v-1b5bfabf]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}.tab.active i[data-v-1b5bfabf]{opacity:.85}.panel[data-v-1b5bfabf]{animation:fade-1b5bfabf .32s var(--spring)}@keyframes fade-1b5bfabf{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.section-head[data-v-1b5bfabf]{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}.section-head h2[data-v-1b5bfabf]{font-size:22px;font-weight:800}.desc[data-v-1b5bfabf]{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}.head-actions[data-v-1b5bfabf]{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.btn[data-v-1b5bfabf]{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}.btn.sm[data-v-1b5bfabf]{height:34px;padding:0 14px;font-size:13px}.btn[data-v-1b5bfabf]:disabled{opacity:.5;cursor:not-allowed}@media (hover: hover) and (pointer: fine){.btn[data-v-1b5bfabf]:hover:not(:disabled){transform:translateY(-1px)}}.btn.filled[data-v-1b5bfabf]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn.tonic[data-v-1b5bfabf]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.text[data-v-1b5bfabf]{background:transparent;color:var(--md-primary)}.btn.danger[data-v-1b5bfabf]{background:var(--md-error-container);color:var(--md-on-error-container)}.link[data-v-1b5bfabf]{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}.card[data-v-1b5bfabf]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}.card>h3[data-v-1b5bfabf]{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}.card.sub[data-v-1b5bfabf]{padding:16px;margin-bottom:0}.grid2[data-v-1b5bfabf]{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.grid3[data-v-1b5bfabf]{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}.sub-label[data-v-1b5bfabf]{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.hint[data-v-1b5bfabf]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}.world-field[data-v-1b5bfabf]{display:block;margin:10px 0}.world-label[data-v-1b5bfabf]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-1b5bfabf]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-1b5bfabf]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-1b5bfabf]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-1b5bfabf]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-1b5bfabf]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-1b5bfabf]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-1b5bfabf]{position:relative;margin-top:8px}.world-map-leaflet[data-v-1b5bfabf]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-1b5bfabf]{display:none}.wm-reset[data-v-1b5bfabf]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-1b5bfabf]:hover{background:#fff}.wm-compass[data-v-1b5bfabf]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-1b5bfabf]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-1b5bfabf]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-1b5bfabf]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-1b5bfabf]:hover{background:#fff}.wm-offline[data-v-1b5bfabf]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-1b5bfabf]{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-1b5bfabf]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-1b5bfabf]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-1b5bfabf]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-1b5bfabf]{flex:0 0 88px}.wm-routes span[data-v-1b5bfabf]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-1b5bfabf]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-1b5bfabf]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-1b5bfabf]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-1b5bfabf]{background:#e07a5f}.wm-legend i.k-work[data-v-1b5bfabf]{background:#5b8def}.wm-legend i.k-shop[data-v-1b5bfabf]{background:#e0a23d}.wm-legend i.k-food[data-v-1b5bfabf]{background:#57a773}.wm-legend i.k-park[data-v-1b5bfabf]{background:#3faead}.wm-legend i.k-transit[data-v-1b5bfabf]{background:#8b6fd6}.wm-legend i.k-other[data-v-1b5bfabf]{background:#8a94a6}.wm-legend i.k-actor[data-v-1b5bfabf]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-1b5bfabf]{background:#d64545}.wm-legend i.k-bus[data-v-1b5bfabf]{background:#e08a2e}.wm-legend i.k-park2[data-v-1b5bfabf]{background:#9bd08f}.wm-legend i.k-water[data-v-1b5bfabf]{background:#8fbfe6}.wm-legend i.k-hw[data-v-1b5bfabf]{background:#f08c2e}.wm-legend i.k-arterial[data-v-1b5bfabf]{background:#f7cf8a}.wm-legend i.k-street[data-v-1b5bfabf]{background:#fff;border-color:#b9c3cd}.meta[data-v-1b5bfabf]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}.empty[data-v-1b5bfabf]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.field[data-v-1b5bfabf]{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}.field[data-v-1b5bfabf]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.field.tiny[data-v-1b5bfabf]{width:104px;height:38px;padding:0 12px;font-size:13px}.preset-row[data-v-1b5bfabf]{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.switches[data-v-1b5bfabf]{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}.sw[data-v-1b5bfabf]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}.sw input[data-v-1b5bfabf]{width:18px;height:18px;accent-color:var(--md-primary)}.settings-grid[data-v-1b5bfabf]{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.settings-grid label[data-v-1b5bfabf]{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.settings-grid .field[data-v-1b5bfabf]{height:40px}.pfield[data-v-1b5bfabf]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.pfield textarea.field[data-v-1b5bfabf]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-1b5bfabf]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-1b5bfabf]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-1b5bfabf]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.som-channels[data-v-1b5bfabf]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-1b5bfabf]{display:grid;grid-template-columns:52px 1fr 48px;align-items:center;gap:10px}.som-chan-name[data-v-1b5bfabf]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.som-chan-bar[data-v-1b5bfabf]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-1b5bfabf]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-1b5bfabf]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.chip[data-v-1b5bfabf]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-1b5bfabf]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-1b5bfabf]{background:var(--md-success-container);color:#0d3b1e}.count-pill[data-v-1b5bfabf]{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}.count-pill.ok[data-v-1b5bfabf]{background:var(--md-success-container);color:#0d3b1e}.actions-row[data-v-1b5bfabf]{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}#app .pcp .card[data-v-1b5bfabf]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .pcp .field[data-v-1b5bfabf]{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}#app .pcp .field[data-v-1b5bfabf]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .pcp .field.tiny[data-v-1b5bfabf]{height:40px}#app .pcp .settings-grid .field[data-v-1b5bfabf]{height:44px}#app .pcp .btn[data-v-1b5bfabf]{height:44px;padding:0 20px}#app .pcp .btn.sm[data-v-1b5bfabf]{height:36px;padding:0 15px}#app .pcp .cog-metric[data-v-1b5bfabf]{background:var(--md-surface-container)}@media (prefers-reduced-motion: reduce){.panel[data-v-1b5bfabf]{animation:none}.fab[data-v-1b5bfabf],.btn[data-v-1b5bfabf],.tab[data-v-1b5bfabf],.som-chan-bar i[data-v-1b5bfabf]{transition:none}.fab[data-v-1b5bfabf]:hover:not(:disabled),.btn[data-v-1b5bfabf]:hover:not(:disabled),.tab.active[data-v-1b5bfabf]{transform:none}}@media (prefers-color-scheme: dark){.pill.bad[data-v-1b5bfabf]{background:#5a2d00;color:#ffd7b0}}@media (max-width:820px){.grid2[data-v-1b5bfabf],.grid3[data-v-1b5bfabf]{grid-template-columns:1fr}.settings-grid label.wide[data-v-1b5bfabf]{grid-column:span 1}}@media (max-width:560px){.pcp[data-v-1b5bfabf]{padding:var(--space-lg) var(--space-lg) 80px}.hero[data-v-1b5bfabf]{padding:20px}.hero-actions[data-v-1b5bfabf]{width:100%}}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}.page[data-v-c4f2d266]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-c4f2d266]{max-width:1180px;margin:0 auto}.page-header[data-v-c4f2d266]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-c4f2d266]{margin:0 0 6px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-c4f2d266]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-c4f2d266]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-c4f2d266]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-c4f2d266]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-c4f2d266]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-c4f2d266]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-c4f2d266]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-c4f2d266]{background:var(--md-error-container);color:var(--md-on-error-container)}.stat-grid[data-v-c4f2d266]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-c4f2d266]{display:flex;align-items:center;gap:10px}.stat-label[data-v-c4f2d266]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-c4f2d266]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-c4f2d266]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-c4f2d266]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-c4f2d266]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-c4f2d266]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-c4f2d266]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-c4f2d266]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-c4f2d266]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-c4f2d266]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-c4f2d266]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-c4f2d266]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-c4f2d266]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-c4f2d266]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-c4f2d266]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-c4f2d266]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-c4f2d266]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}.search-field.mini[data-v-c4f2d266]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-c4f2d266]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-c4f2d266]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-c4f2d266]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-c4f2d266]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-c4f2d266]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-c4f2d266]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-c4f2d266]{background:#fff1dc;color:#7a4400}.error-banner[data-v-c4f2d266]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px;margin:var(--space-lg) 0}.notice[data-v-c4f2d266]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-c4f2d266]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card-enter-active[data-v-c4f2d266]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.memory-card-leave-active[data-v-c4f2d266]{transition:opacity .16s var(--ease-emphasized-accel),transform .16s var(--ease-emphasized-accel)}.memory-card-enter-from[data-v-c4f2d266]{opacity:0;transform:translateY(6px) scale(.98)}.memory-card-leave-to[data-v-c4f2d266]{opacity:0;transform:scale(.98)}.memory-card-move[data-v-c4f2d266]{transition:transform .26s var(--ease-emphasized)}@media (prefers-reduced-motion: reduce){.memory-card-enter-active[data-v-c4f2d266],.memory-card-leave-active[data-v-c4f2d266],.memory-card-move[data-v-c4f2d266]{transition-duration:1ms}.memory-card-enter-from[data-v-c4f2d266],.memory-card-leave-to[data-v-c4f2d266]{transform:none}}.memory-card[data-v-c4f2d266]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-c4f2d266]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-c4f2d266]{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon[data-v-c4f2d266]:after{content:\"\";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}.btn-icon.danger[data-v-c4f2d266]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-c4f2d266]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-c4f2d266]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-c4f2d266]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-c4f2d266]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-c4f2d266]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-c4f2d266]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-c4f2d266]{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}.fill-primary[data-v-c4f2d266]{background:var(--md-primary)}.fill-secondary[data-v-c4f2d266]{background:var(--md-secondary,#536255)}.meter-text[data-v-c4f2d266]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-c4f2d266]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-c4f2d266]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-c4f2d266]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-c4f2d266]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-c4f2d266]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-c4f2d266]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-c4f2d266]{display:none}.empty-state[data-v-c4f2d266]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-c4f2d266]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-c4f2d266]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-c4f2d266]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-c4f2d266]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-c4f2d266]{display:flex;flex-direction:column;gap:10px}.input[data-v-c4f2d266]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-c4f2d266]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-c4f2d266]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-c4f2d266],.reflection-list[data-v-c4f2d266]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-c4f2d266]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-c4f2d266]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-c4f2d266]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-c4f2d266]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-c4f2d266]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-c4f2d266]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-c4f2d266]{margin-top:var(--space-lg)}.reader pre[data-v-c4f2d266]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-c4f2d266]{font-size:14px;font-weight:600}.reflection details[data-v-c4f2d266]{margin-top:6px}.reflection summary[data-v-c4f2d266]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-c4f2d266]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}#app .memory-page .page-header h1[data-v-c4f2d266]{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}#app .memory-page .stat-grid[data-v-c4f2d266]{gap:var(--space-lg)}#app .memory-page .stat-card[data-v-c4f2d266],#app .memory-page .card[data-v-c4f2d266],#app .memory-page .memory-card[data-v-c4f2d266]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .memory-page .stat-card[data-v-c4f2d266]{border-radius:24px;transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}@media (hover: hover) and (pointer: fine){#app .memory-page .stat-card[data-v-c4f2d266]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}#app .memory-page .stat-value[data-v-c4f2d266]{font-size:34px;font-weight:800;letter-spacing:-.02em}#app .memory-page .icon-badge[data-v-c4f2d266]{width:44px;height:44px;border-radius:16px 16px 16px 6px}#app .memory-page .card[data-v-c4f2d266],#app .memory-page .memory-card[data-v-c4f2d266]{border-radius:24px}#app .memory-page .memory-card[data-v-c4f2d266]{transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .22s,border-color .2s}@media (hover: hover) and (pointer: fine){#app .memory-page .memory-card[data-v-c4f2d266]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .memory-page .btn[data-v-c4f2d266]{height:44px;padding:0 20px;border-radius:999px;font-weight:700}#app .memory-page .btn-sm[data-v-c4f2d266]{height:34px;padding:0 14px;font-size:13px}#app .memory-page .btn-tonal[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .memory-page .btn-primary[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 28%,transparent)}#app .memory-page .input[data-v-c4f2d266]{height:48px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);transition:background-color .18s,border-color .18s,box-shadow .2s}#app .memory-page .input[data-v-c4f2d266]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .memory-page .input.area[data-v-c4f2d266]{height:auto;padding:14px 16px}#app .memory-page .search-field input[data-v-c4f2d266]{height:44px}#app .memory-page .search-field.mini[data-v-c4f2d266]{border-color:transparent;background:var(--md-surface-container-high);border-radius:14px}#app .memory-page .select select[data-v-c4f2d266]{height:44px;border-color:transparent;border-radius:14px;background:var(--md-surface-container-high);padding:0 14px}#app .memory-page .tabs[data-v-c4f2d266]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .memory-page .tabs button[data-v-c4f2d266]{border-radius:999px;padding:9px 20px;font-weight:650}#app .memory-page .tabs button.active[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:var(--shadow-1)}#app .memory-page .note-item[data-v-c4f2d266]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-low)}@media (prefers-reduced-motion: reduce){#app .memory-page .stat-card[data-v-c4f2d266]:hover,#app .memory-page .memory-card[data-v-c4f2d266]:hover{transform:none}.meter-bar i[data-v-c4f2d266]{transition:none}}@media (max-width:900px){.stat-grid[data-v-c4f2d266]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-c4f2d266]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-c4f2d266]{padding:var(--space-lg)}.header-actions[data-v-c4f2d266]{padding-top:0}.memory-list[data-v-c4f2d266]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
