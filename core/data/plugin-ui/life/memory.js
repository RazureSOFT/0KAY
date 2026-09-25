import { defineComponent as vt, ref as c, computed as et, watch as L, onMounted as pt, openBlock as l, createElementBlock as o, createElementVNode as t, toDisplayString as n, createStaticVNode as S, normalizeClass as w, Fragment as g, withDirectives as f, vModelText as j, vModelSelect as Y, renderList as D, createCommentVNode as _, normalizeStyle as st, withModifiers as mt, createVNode as bt } from "vue";
import { _ as _t, u as ht, a as ft } from "./assets/_plugin-vue_export-helper-CihezfpQ.js";
const gt = { class: "page" }, kt = { class: "page-inner" }, yt = { class: "page-header" }, wt = { class: "header-actions" }, Ct = ["disabled"], Mt = ["disabled"], xt = ["disabled"], $t = { class: "stat-grid" }, Tt = { class: "stat-card" }, Lt = { class: "stat-value" }, St = { class: "stat-card" }, jt = { class: "stat-value" }, It = { class: "stat-card" }, Nt = { class: "stat-value" }, Vt = { class: "stat-card" }, Et = { class: "stat-value" }, Ut = { class: "tabs" }, Bt = { class: "card toolbar" }, Ft = { class: "search-field" }, Ot = { class: "select" }, Rt = { class: "select" }, qt = { class: "chip muted" }, Dt = { class: "memory-list" }, At = { class: "card-top" }, Ht = {
  key: 0,
  class: "chip muted"
}, Pt = { class: "chip muted" }, zt = ["onClick"], Jt = { class: "memory-content" }, Kt = {
  key: 0,
  class: "tags"
}, Qt = { class: "memory-foot" }, Yt = {
  class: "meter",
  title: "重要性"
}, Gt = { class: "meter-bar" }, Wt = {
  class: "meter",
  title: "强度"
}, Xt = { class: "meter-bar" }, Zt = { class: "meter-text" }, te = {
  key: 1,
  class: "detail"
}, ee = { class: "card-actions" }, se = ["onClick"], ae = ["onClick"], ne = ["onClick"], le = ["onClick"], oe = {
  key: 0,
  class: "empty-state"
}, ie = {
  key: 0,
  class: "pager"
}, de = ["disabled"], ce = { class: "chip muted" }, re = ["disabled"], ue = { class: "grid-notes" }, ve = { class: "card" }, pe = ["disabled"], me = { class: "card" }, be = { class: "card-head" }, _e = { class: "chip muted" }, he = { class: "search-field mini" }, fe = { class: "note-list" }, ge = { class: "note-main" }, ke = { class: "item-meta" }, ye = { class: "item-meta" }, we = { class: "note-actions" }, Ce = ["onClick"], Me = ["onClick"], xe = {
  key: 0,
  class: "list-empty"
}, $e = {
  key: 0,
  class: "card reader"
}, Te = { class: "card-head" }, Le = { class: "card-title" }, Se = { class: "pager" }, je = ["disabled"], Ie = { class: "chip muted" }, Ne = ["disabled"], Ve = { class: "card toolbar" }, Ee = { class: "select" }, Ue = { class: "chip muted" }, Be = { class: "reflection-list" }, Fe = { class: "card-head" }, Oe = { class: "card-title" }, Re = { class: "item-meta" }, qe = { class: "quote" }, De = { class: "quote" }, Ae = {
  key: 0,
  class: "card-actions"
}, He = ["onClick"], Pe = ["onClick"], ze = {
  key: 0,
  class: "empty-state"
}, Je = {
  key: 3,
  class: "error-banner"
}, Ke = {
  key: 4,
  class: "notice"
}, I = 30, Qe = /* @__PURE__ */ vt({
  __name: "MemoryPage",
  setup(Ye) {
    const { confirm: A } = ht(), m = c("memories"), N = c(""), V = c(""), E = c("recent"), h = c(0), H = c([]), P = c(0), C = c({ working: 0, shortTerm: { total: 0 }, longTerm: 0, avgStrength: 0 }), b = c(!1), i = c(""), M = c(""), x = c(""), U = c([]), B = c(""), r = c({ title: "", content: "", tags: "" }), u = c(null), F = c([]), O = c("proposed"), R = et(() => Math.max(1, Math.ceil(P.value / I))), z = et(() => Math.floor(h.value / I) + 1);
    function $(a) {
      return `${Math.round(Math.max(0, Math.min(1, a || 0)) * 100)}%`;
    }
    function at(a) {
      return a === "long_term" ? "长期记忆" : a === "short_term" ? "短期记忆" : "工作记忆";
    }
    function J(a) {
      if (!a) return "";
      const e = new Date(a);
      return Number.isNaN(e.getTime()) ? a : e.toLocaleString();
    }
    function T(a) {
      M.value = a, setTimeout(() => {
        M.value === a && (M.value = "");
      }, 2e3);
    }
    async function v(a, e) {
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
          e.stats && (C.value = e.stats);
        }
      } catch {
      }
    }
    async function p() {
      b.value = !0, i.value = "";
      try {
        const a = await v("memory_page", { tier: V.value, query: N.value.trim(), limit: I, offset: h.value, sort: E.value });
        H.value = a.items || [], P.value = a.total || 0;
      } catch (a) {
        i.value = a?.message || "无法读取记忆";
      } finally {
        b.value = !1;
      }
    }
    async function q() {
      b.value = !0, i.value = "";
      try {
        const a = await v("memory_note_list", { query: B.value.trim(), limit: 60 });
        U.value = a.notes || [];
      } catch (a) {
        i.value = a?.message || "无法读取笔记";
      } finally {
        b.value = !1;
      }
    }
    async function K() {
      b.value = !0, i.value = "";
      try {
        const a = await v("memory_reflection_list", { status: O.value, limit: 80 });
        F.value = a.reflections || [];
      } catch (a) {
        i.value = a?.message || "无法读取反思提案";
      } finally {
        b.value = !1;
      }
    }
    function G() {
      return m.value === "notes" ? q() : m.value === "reflections" ? K() : p();
    }
    async function nt(a) {
      try {
        await v("memory_reinforce", { ids: [a.id] }), T("已再巩固"), await p();
      } catch (e) {
        i.value = e?.message || "强化失败";
      }
    }
    async function W(a, e) {
      try {
        await v("memory_importance", { id: a.id, delta: e }), await p();
      } catch (s) {
        i.value = s?.message || "调整失败";
      }
    }
    async function lt() {
      try {
        const a = await v("memory_export", {}), e = new Blob([JSON.stringify(a, null, 2)], { type: "application/json" }), s = URL.createObjectURL(e), d = document.createElement("a");
        d.href = s, d.download = `0kay-memory-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, d.click(), URL.revokeObjectURL(s), T("已导出记忆快照");
      } catch (a) {
        i.value = a?.message || "导出失败";
      }
    }
    const X = c(null);
    async function ot(a) {
      const e = a.target, s = e.files?.[0];
      if (s)
        try {
          const d = JSON.parse(await s.text()), tt = await v("memory_import", { snapshot: d });
          T(`导入完成：新增 ${tt.imported || 0} · 跳过 ${tt.skipped || 0}`), await p(), await k();
        } catch (d) {
          i.value = d?.message || "导入失败";
        } finally {
          e.value = "";
        }
    }
    async function it(a) {
      if (await A({ title: "删除记忆", message: "删除会撤销该记忆并重建检索投影，继续吗？", confirmLabel: "删除", danger: !0 }))
        try {
          await v("delete_memory", { id: a.id }), await p(), await k();
        } catch (s) {
          i.value = s?.message || "删除失败";
        }
    }
    async function dt() {
      if (await A({ title: "清除全部记忆", message: "这会清除工作、短期、长期记忆、笔记块和反思提案，无法恢复。确定继续吗？", confirmLabel: "全部清除", danger: !0 }))
        try {
          await v("clear_all_memory", {}), await p(), await k();
        } catch (e) {
          i.value = e?.message || "清除失败";
        }
    }
    async function ct() {
      if (!(!r.value.content.trim() && !r.value.title.trim()))
        try {
          await v("memory_note_create", {
            title: r.value.title,
            content: r.value.content,
            tags: r.value.tags.split(",").map((a) => a.trim()).filter(Boolean)
          }), r.value = { title: "", content: "", tags: "" }, T("笔记已保存"), await q();
        } catch (a) {
          i.value = a?.message || "保存笔记失败";
        }
    }
    async function Q(a, e = 1) {
      try {
        const s = await v("memory_note_read", { note_id: a.note_id, offset: e, limit: 400 });
        u.value = { ...s, offset: s.offset || e };
      } catch (s) {
        i.value = s?.message || "读取笔记失败";
      }
    }
    async function rt(a) {
      if (await A({ title: "删除笔记", message: `删除笔记「${a.note_id}」及其分块？`, confirmLabel: "删除", danger: !0 }))
        try {
          await v("memory_note_delete", { note_id: a.note_id }), u.value?.note_id === a.note_id && (u.value = null), await q();
        } catch (s) {
          i.value = s?.message || "删除笔记失败";
        }
    }
    async function Z(a, e) {
      try {
        await v("memory_reflection_review", { id: a.id, accept: e }), await K(), await k();
      } catch (s) {
        i.value = s?.message || "审核失败";
      }
    }
    async function ut() {
      try {
        const a = await v("memory_maintenance", {});
        T(`维护完成：巩固 ${a.consolidated ?? 0} 条`), await p(), await k();
      } catch (a) {
        i.value = a?.message || "维护失败";
      }
    }
    let y = null;
    return L(N, () => {
      h.value = 0, y && clearTimeout(y), y = setTimeout(p, 250);
    }), L([V, E], () => {
      h.value = 0, p();
    }), L(B, () => {
      y && clearTimeout(y), y = setTimeout(q, 250);
    }), L(O, K), L(m, G), pt(async () => {
      await p(), await k();
    }), (a, e) => (l(), o("main", gt, [
      t("div", kt, [
        t("header", yt, [
          e[17] || (e[17] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / MEMORY"),
            t("h1", null, "记忆管理台"),
            t("p", { class: "subtitle" }, "浏览 LIFE 的记忆分层、强度与召回；管理笔记、审核反思提案。记忆由 LIFE 插件维护，禁用后此入口消失。")
          ], -1)),
          t("div", wt, [
            t("button", {
              class: "btn btn-tonal",
              disabled: b.value,
              onClick: ut
            }, "巩固维护", 8, Ct),
            t("button", {
              class: "btn btn-danger",
              disabled: b.value,
              onClick: dt
            }, "一键清除", 8, Mt),
            t("button", {
              class: "btn btn-tonal",
              disabled: b.value,
              onClick: G
            }, n(b.value ? "加载中…" : "刷新"), 9, xt)
          ])
        ]),
        t("section", $t, [
          t("article", Tt, [
            e[18] || (e[18] = S('<div class="stat-head" data-v-d1a7766c><span class="icon-badge tone-1" aria-hidden="true" data-v-d1a7766c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-d1a7766c><path d="M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-d1a7766c></path></svg></span><span class="stat-label" data-v-d1a7766c>工作记忆</span></div>', 1)),
            t("strong", Lt, n(C.value.working), 1),
            e[19] || (e[19] = t("span", { class: "stat-hint" }, "当前上下文", -1))
          ]),
          t("article", St, [
            e[20] || (e[20] = S('<div class="stat-head" data-v-d1a7766c><span class="icon-badge tone-2" aria-hidden="true" data-v-d1a7766c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-d1a7766c><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" data-v-d1a7766c></circle><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-d1a7766c></path></svg></span><span class="stat-label" data-v-d1a7766c>短期记忆</span></div>', 1)),
            t("strong", jt, n(C.value.shortTerm?.total || 0), 1),
            e[21] || (e[21] = t("span", { class: "stat-hint" }, "待巩固记录", -1))
          ]),
          t("article", It, [
            e[22] || (e[22] = S('<div class="stat-head" data-v-d1a7766c><span class="icon-badge tone-3" aria-hidden="true" data-v-d1a7766c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-d1a7766c><path d="M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 21.5v-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-d1a7766c></path></svg></span><span class="stat-label" data-v-d1a7766c>长期记忆</span></div>', 1)),
            t("strong", Nt, n(C.value.longTerm || 0), 1),
            e[23] || (e[23] = t("span", { class: "stat-hint" }, "稳定沉淀", -1))
          ]),
          t("article", Vt, [
            e[24] || (e[24] = S('<div class="stat-head" data-v-d1a7766c><span class="icon-badge tone-4" aria-hidden="true" data-v-d1a7766c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-d1a7766c><path d="M4 14l4-4 3 3 5-6 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-d1a7766c></path><path d="M4 19h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-d1a7766c></path></svg></span><span class="stat-label" data-v-d1a7766c>平均强度</span></div>', 1)),
            t("strong", Et, n($(C.value.avgStrength)), 1),
            e[25] || (e[25] = t("span", { class: "stat-hint" }, "遗忘曲线后的值", -1))
          ])
        ]),
        t("nav", Ut, [
          t("button", {
            class: w({ active: m.value === "memories" }),
            onClick: e[0] || (e[0] = (s) => m.value = "memories")
          }, "记忆", 2),
          t("button", {
            class: w({ active: m.value === "notes" }),
            onClick: e[1] || (e[1] = (s) => m.value = "notes")
          }, "笔记", 2),
          t("button", {
            class: w({ active: m.value === "reflections" }),
            onClick: e[2] || (e[2] = (s) => m.value = "reflections")
          }, "反思提案", 2)
        ]),
        m.value === "memories" ? (l(), o(g, { key: 0 }, [
          t("section", Bt, [
            t("div", Ft, [
              e[26] || (e[26] = t("svg", {
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
              f(t("input", {
                "onUpdate:modelValue": e[3] || (e[3] = (s) => N.value = s),
                placeholder: "搜索记忆内容或标签",
                "aria-label": "搜索记忆"
              }, null, 512), [
                [j, N.value]
              ])
            ]),
            t("label", Ot, [
              e[28] || (e[28] = t("span", null, "层级", -1)),
              f(t("select", {
                "onUpdate:modelValue": e[4] || (e[4] = (s) => V.value = s)
              }, [...e[27] || (e[27] = [
                t("option", { value: "" }, "全部", -1),
                t("option", { value: "short_term" }, "短期", -1),
                t("option", { value: "long_term" }, "长期", -1)
              ])], 512), [
                [Y, V.value]
              ])
            ]),
            t("label", Rt, [
              e[30] || (e[30] = t("span", null, "排序", -1)),
              f(t("select", {
                "onUpdate:modelValue": e[5] || (e[5] = (s) => E.value = s)
              }, [...e[29] || (e[29] = [
                t("option", { value: "recent" }, "最近", -1),
                t("option", { value: "strength" }, "强度", -1),
                t("option", { value: "importance" }, "重要性", -1),
                t("option", { value: "recall" }, "召回次数", -1)
              ])], 512), [
                [Y, E.value]
              ])
            ]),
            t("span", qt, n(P.value) + " 条 · 第 " + n(z.value) + "/" + n(R.value) + " 页", 1),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: lt
            }, "导出"),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: e[6] || (e[6] = (s) => X.value?.click())
            }, "导入"),
            t("input", {
              ref_key: "importInput",
              ref: X,
              type: "file",
              accept: "application/json,.json",
              class: "hidden-input",
              onChange: ot
            }, null, 544)
          ]),
          t("section", Dt, [
            (l(!0), o(g, null, D(H.value, (s) => (l(), o("article", {
              key: s.id,
              class: w(["memory-card", { open: x.value === s.id }])
            }, [
              t("div", At, [
                t("span", {
                  class: w(["chip", "tier-" + (s.tier === "long_term" ? "long" : "short")])
                }, n(at(s.tier)), 3),
                s.scope && s.scope !== "public" ? (l(), o("span", Ht, n(s.scope), 1)) : _("", !0),
                t("span", Pt, n(s.memory_type || "knowledge"), 1),
                t("button", {
                  class: "btn-icon danger",
                  title: "删除记忆",
                  onClick: (d) => it(s)
                }, [...e[31] || (e[31] = [
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
                ])], 8, zt)
              ]),
              t("p", Jt, n(s.content), 1),
              s.tags?.length ? (l(), o("div", Kt, [
                (l(!0), o(g, null, D(s.tags, (d) => (l(), o("span", { key: d }, "#" + n(d), 1))), 128))
              ])) : _("", !0),
              t("footer", Qt, [
                t("div", Yt, [
                  e[32] || (e[32] = t("span", null, "重要性", -1)),
                  t("div", Gt, [
                    t("i", {
                      style: st({ width: $(s.importance) }),
                      class: "fill-primary"
                    }, null, 4)
                  ]),
                  t("b", null, n($(s.importance)), 1)
                ]),
                t("div", Wt, [
                  e[33] || (e[33] = t("span", null, "强度", -1)),
                  t("div", Xt, [
                    t("i", {
                      style: st({ width: $(s.strength) }),
                      class: "fill-secondary"
                    }, null, 4)
                  ]),
                  t("b", null, n($(s.strength)), 1)
                ]),
                t("span", Zt, "召回 " + n(s.recall_count || 0) + " 次", 1)
              ]),
              x.value === s.id ? (l(), o("div", te, [
                t("dl", null, [
                  t("div", null, [
                    e[34] || (e[34] = t("dt", null, "ID", -1)),
                    t("dd", null, [
                      t("code", null, n(s.id), 1)
                    ])
                  ]),
                  t("div", null, [
                    e[35] || (e[35] = t("dt", null, "来源", -1)),
                    t("dd", null, n(s.source_kind || "conversation"), 1)
                  ]),
                  t("div", null, [
                    e[36] || (e[36] = t("dt", null, "创建", -1)),
                    t("dd", null, n(J(s.created_at)), 1)
                  ]),
                  t("div", null, [
                    e[37] || (e[37] = t("dt", null, "最近召回", -1)),
                    t("dd", null, n(J(s.last_recalled)), 1)
                  ])
                ])
              ])) : _("", !0),
              t("div", ee, [
                t("button", {
                  class: "btn btn-sm btn-tonal",
                  onClick: (d) => x.value = x.value === s.id ? "" : s.id
                }, n(x.value === s.id ? "收起" : "详情"), 9, se),
                t("button", {
                  class: "btn btn-sm btn-tonal",
                  onClick: (d) => W(s, 0.1)
                }, "重要 +", 8, ae),
                t("button", {
                  class: "btn btn-sm btn-tonal",
                  onClick: (d) => W(s, -0.1)
                }, "重要 −", 8, ne),
                t("button", {
                  class: "btn btn-sm btn-tonal",
                  onClick: (d) => nt(s)
                }, "再巩固", 8, le)
              ])
            ], 2))), 128)),
            !b.value && !H.value.length ? (l(), o("div", oe, [...e[38] || (e[38] = [
              t("p", null, "暂无匹配记忆", -1),
              t("p", { class: "hint" }, "LIFE 会在对话与工具调用中逐步沉淀记忆。", -1)
            ])])) : _("", !0)
          ]),
          R.value > 1 ? (l(), o("div", ie, [
            t("button", {
              class: "btn btn-tonal btn-sm",
              disabled: h.value === 0,
              onClick: e[7] || (e[7] = (s) => {
                h.value = Math.max(0, h.value - I), p();
              })
            }, "上一页", 8, de),
            t("span", ce, n(z.value) + " / " + n(R.value), 1),
            t("button", {
              class: "btn btn-tonal btn-sm",
              disabled: z.value >= R.value,
              onClick: e[8] || (e[8] = (s) => {
                h.value += I, p();
              })
            }, "下一页", 8, re)
          ])) : _("", !0)
        ], 64)) : m.value === "notes" ? (l(), o(g, { key: 1 }, [
          t("section", ue, [
            t("article", ve, [
              e[39] || (e[39] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "新建笔记")
              ], -1)),
              t("form", {
                class: "stack-form",
                onSubmit: mt(ct, ["prevent"])
              }, [
                f(t("input", {
                  "onUpdate:modelValue": e[9] || (e[9] = (s) => r.value.title = s),
                  class: "input",
                  placeholder: "标题",
                  "aria-label": "笔记标题"
                }, null, 512), [
                  [j, r.value.title]
                ]),
                f(t("input", {
                  "onUpdate:modelValue": e[10] || (e[10] = (s) => r.value.tags = s),
                  class: "input",
                  placeholder: "标签（逗号分隔，可选）",
                  "aria-label": "笔记标签"
                }, null, 512), [
                  [j, r.value.tags]
                ]),
                f(t("textarea", {
                  "onUpdate:modelValue": e[11] || (e[11] = (s) => r.value.content = s),
                  class: "input area",
                  placeholder: "笔记正文…",
                  "aria-label": "笔记正文"
                }, null, 512), [
                  [j, r.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !r.value.content.trim() && !r.value.title.trim()
                }, "保存笔记", 8, pe)
              ], 32)
            ]),
            t("article", me, [
              t("div", be, [
                e[40] || (e[40] = t("h2", { class: "card-title" }, "笔记库", -1)),
                t("span", _e, n(U.value.length), 1)
              ]),
              t("div", he, [
                f(t("input", {
                  "onUpdate:modelValue": e[12] || (e[12] = (s) => B.value = s),
                  placeholder: "搜索笔记…",
                  "aria-label": "搜索笔记"
                }, null, 512), [
                  [j, B.value]
                ])
              ]),
              t("ul", fe, [
                (l(!0), o(g, null, D(U.value, (s) => (l(), o("li", {
                  key: s.note_id,
                  class: "note-item"
                }, [
                  t("div", ge, [
                    t("strong", null, n(s.note_id), 1),
                    t("span", ke, n(s.preview?.slice(0, 90) || "（空）"), 1),
                    t("span", ye, n((s.bytes / 1024).toFixed(1)) + " KB", 1)
                  ]),
                  t("div", we, [
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      onClick: (d) => Q(s)
                    }, "阅读", 8, Ce),
                    t("button", {
                      class: "btn btn-sm btn-danger",
                      onClick: (d) => rt(s)
                    }, "删除", 8, Me)
                  ])
                ]))), 128)),
                U.value.length ? _("", !0) : (l(), o("li", xe, "还没有笔记。LIFE 或你可以把长内容写入笔记并参与检索。"))
              ])
            ])
          ]),
          u.value ? (l(), o("section", $e, [
            t("div", Te, [
              t("h2", Le, n(u.value.note_id), 1),
              t("button", {
                class: "btn btn-sm btn-tonal",
                onClick: e[13] || (e[13] = (s) => u.value = null)
              }, "关闭")
            ]),
            t("pre", null, n(u.value.content), 1),
            t("div", Se, [
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: u.value.offset <= 1,
                onClick: e[14] || (e[14] = (s) => Q({ note_id: u.value.note_id }, Math.max(1, u.value.offset - 400)))
              }, "上一段", 8, je),
              t("span", Ie, n(u.value.total_lines) + " 行", 1),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: !u.value.has_more,
                onClick: e[15] || (e[15] = (s) => Q({ note_id: u.value.note_id }, u.value.offset + 400))
              }, "下一段", 8, Ne)
            ])
          ])) : _("", !0)
        ], 64)) : (l(), o(g, { key: 2 }, [
          t("section", Ve, [
            t("label", Ee, [
              e[42] || (e[42] = t("span", null, "状态", -1)),
              f(t("select", {
                "onUpdate:modelValue": e[16] || (e[16] = (s) => O.value = s)
              }, [...e[41] || (e[41] = [
                S('<option value="proposed" data-v-d1a7766c>待审核</option><option value="pending" data-v-d1a7766c>待处理</option><option value="applied" data-v-d1a7766c>已采纳</option><option value="rejected" data-v-d1a7766c>已拒绝</option><option value="" data-v-d1a7766c>全部</option>', 5)
              ])], 512), [
                [Y, O.value]
              ])
            ]),
            t("span", Ue, n(F.value.length) + " 条", 1)
          ]),
          t("section", Be, [
            (l(!0), o(g, null, D(F.value, (s) => (l(), o("article", {
              key: s.id,
              class: "card reflection"
            }, [
              t("div", Fe, [
                t("h3", Oe, n(s.statement || "（无摘要）"), 1),
                t("span", {
                  class: w(["chip", s.status === "applied" ? "chip-ok" : s.status === "rejected" ? "chip-warn" : "muted"])
                }, n(s.status), 3)
              ]),
              t("p", Re, "来源会话 " + n(s.session_id) + " · " + n(J(s.created_at)), 1),
              t("details", null, [
                e[43] || (e[43] = t("summary", null, "查看原始对话", -1)),
                t("p", qe, "用户：" + n(s.user_text), 1),
                t("p", De, "LIFE：" + n(s.assistant_text), 1)
              ]),
              s.status === "proposed" ? (l(), o("div", Ae, [
                t("button", {
                  class: "btn btn-sm btn-primary",
                  onClick: (d) => Z(s, !0)
                }, "采纳为记忆", 8, He),
                t("button", {
                  class: "btn btn-sm btn-danger",
                  onClick: (d) => Z(s, !1)
                }, "拒绝", 8, Pe)
              ])) : _("", !0)
            ]))), 128)),
            F.value.length ? _("", !0) : (l(), o("div", ze, [...e[44] || (e[44] = [
              t("p", null, "没有该状态的反思提案", -1),
              t("p", { class: "hint" }, "LIFE 从对话中提炼低风险记忆提案，等你确认。", -1)
            ])]))
          ])
        ], 64)),
        i.value ? (l(), o("p", Je, n(i.value), 1)) : _("", !0),
        M.value ? (l(), o("p", Ke, n(M.value), 1)) : _("", !0)
      ]),
      bt(_t)
    ]));
  }
}), Xe = /* @__PURE__ */ ft(Qe, [["__scopeId", "data-v-d1a7766c"]]);
export {
  Xe as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-bff6ffa9]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-bff6ffa9]{max-width:1180px;margin:0 auto}.page-header[data-v-bff6ffa9]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-bff6ffa9]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-bff6ffa9]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-bff6ffa9]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-bff6ffa9]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-bff6ffa9]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-bff6ffa9]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-bff6ffa9]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-bff6ffa9]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-bff6ffa9]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-bff6ffa9]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-bff6ffa9]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-bff6ffa9]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-bff6ffa9]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-bff6ffa9]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-bff6ffa9]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-bff6ffa9]{display:flex;align-items:center;gap:10px}.stat-label[data-v-bff6ffa9]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-bff6ffa9]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-bff6ffa9]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-bff6ffa9]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-bff6ffa9]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-bff6ffa9]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-bff6ffa9]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-bff6ffa9]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-bff6ffa9]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-bff6ffa9]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-bff6ffa9]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-bff6ffa9]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-bff6ffa9]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-bff6ffa9]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-bff6ffa9]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-bff6ffa9]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-bff6ffa9]{background:#fff1dc;color:#7a4400}.input[data-v-bff6ffa9]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-bff6ffa9]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-bff6ffa9]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-bff6ffa9]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-bff6ffa9]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-bff6ffa9]{grid-column:1/-1}.stack-form[data-v-bff6ffa9]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-bff6ffa9]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-bff6ffa9]{align-self:flex-start}.item-list[data-v-bff6ffa9],.rel-list[data-v-bff6ffa9],.feed[data-v-bff6ffa9],.timeline[data-v-bff6ffa9]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-bff6ffa9]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-bff6ffa9]{align-items:flex-start}.item[data-v-bff6ffa9]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-bff6ffa9]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-bff6ffa9]{font-size:14px;font-weight:600}.item-main strong.done[data-v-bff6ffa9]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-bff6ffa9]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-bff6ffa9]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-bff6ffa9]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-bff6ffa9]{background:transparent;border:0}.check-label[data-v-bff6ffa9]{display:flex;align-items:center}.check-line[data-v-bff6ffa9]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-bff6ffa9]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-bff6ffa9]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-bff6ffa9]{background:#fff1dc;color:#7a4400}.head-actions[data-v-bff6ffa9]{display:flex;gap:8px}.check-label input[data-v-bff6ffa9]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-bff6ffa9]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-bff6ffa9]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-bff6ffa9]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-bff6ffa9]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-bff6ffa9],.rel-meter[data-v-bff6ffa9]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-bff6ffa9]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-bff6ffa9]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-bff6ffa9]{font-size:12px}.rel-actions[data-v-bff6ffa9]{display:flex;gap:4px}.ledger[data-v-bff6ffa9]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-bff6ffa9]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-bff6ffa9]{padding:8px 12px}.feed time[data-v-bff6ffa9],.timeline time[data-v-bff6ffa9]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-bff6ffa9]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-bff6ffa9]{color:var(--md-success);font-weight:700}.neg[data-v-bff6ffa9]{color:var(--md-error);font-weight:700}.policy[data-v-bff6ffa9]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-bff6ffa9]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-bff6ffa9]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-bff6ffa9]{margin-top:6px}.audit-card[data-v-bff6ffa9]{margin-bottom:var(--space-lg)}.usage-grid[data-v-bff6ffa9]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-bff6ffa9]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-bff6ffa9]{font-size:20px;font-weight:700}.usage-item span[data-v-bff6ffa9]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-bff6ffa9]{position:relative}.timeline li[data-v-bff6ffa9]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-bff6ffa9]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-bff6ffa9]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-bff6ffa9]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-bff6ffa9]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-bff6ffa9]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-bff6ffa9]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-bff6ffa9]{font-size:13.5px;font-weight:650}.tl-detail[data-v-bff6ffa9]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-bff6ffa9]{grid-template-columns:repeat(2,1fr)}.grid[data-v-bff6ffa9],.agenda-form[data-v-bff6ffa9]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-bff6ffa9]{padding:var(--space-lg)}.header-actions[data-v-bff6ffa9]{padding-top:0}}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
