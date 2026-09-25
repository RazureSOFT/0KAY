import { defineComponent as it, ref as i, computed as X, watch as T, onMounted as dt, openBlock as l, createElementBlock as o, createElementVNode as t, toDisplayString as n, createStaticVNode as V, normalizeClass as y, Fragment as g, withDirectives as f, vModelText as L, vModelSelect as Y, renderList as D, createCommentVNode as b, normalizeStyle as Z, withModifiers as rt, createVNode as ut } from "vue";
import { _ as ct, u as vt, a as pt } from "./assets/_plugin-vue_export-helper-CihezfpQ.js";
const bt = { class: "page" }, _t = { class: "page-inner" }, ht = { class: "page-header" }, mt = { class: "header-actions" }, ft = ["disabled"], gt = ["disabled"], kt = ["disabled"], yt = { class: "stat-grid" }, wt = { class: "stat-card" }, Ct = { class: "stat-value" }, Mt = { class: "stat-card" }, xt = { class: "stat-value" }, $t = { class: "stat-card" }, Tt = { class: "stat-value" }, Vt = { class: "stat-card" }, Lt = { class: "stat-value" }, Nt = { class: "tabs" }, St = { class: "card toolbar" }, Et = { class: "search-field" }, Bt = { class: "select" }, Ft = { class: "select" }, jt = { class: "chip muted" }, It = { class: "memory-list" }, Ut = { class: "card-top" }, qt = {
  key: 0,
  class: "chip muted"
}, At = { class: "chip muted" }, Dt = ["onClick"], Ht = { class: "memory-content" }, Pt = {
  key: 0,
  class: "tags"
}, zt = { class: "memory-foot" }, Ot = {
  class: "meter",
  title: "重要性"
}, Rt = { class: "meter-bar" }, Jt = {
  class: "meter",
  title: "强度"
}, Kt = { class: "meter-bar" }, Qt = { class: "meter-text" }, Yt = {
  key: 1,
  class: "detail"
}, Gt = { class: "card-actions" }, Wt = ["onClick"], Xt = ["onClick"], Zt = {
  key: 0,
  class: "empty-state"
}, te = {
  key: 0,
  class: "pager"
}, ee = ["disabled"], se = { class: "chip muted" }, ae = ["disabled"], ne = { class: "grid-notes" }, le = { class: "card" }, oe = ["disabled"], ie = { class: "card" }, de = { class: "card-head" }, re = { class: "chip muted" }, ue = { class: "search-field mini" }, ce = { class: "note-list" }, ve = { class: "note-main" }, pe = { class: "item-meta" }, be = { class: "item-meta" }, _e = { class: "note-actions" }, he = ["onClick"], me = ["onClick"], fe = {
  key: 0,
  class: "list-empty"
}, ge = {
  key: 0,
  class: "card reader"
}, ke = { class: "card-head" }, ye = { class: "card-title" }, we = { class: "pager" }, Ce = ["disabled"], Me = { class: "chip muted" }, xe = ["disabled"], $e = { class: "card toolbar" }, Te = { class: "select" }, Ve = { class: "chip muted" }, Le = { class: "reflection-list" }, Ne = { class: "card-head" }, Se = { class: "card-title" }, Ee = { class: "item-meta" }, Be = { class: "quote" }, Fe = { class: "quote" }, je = {
  key: 0,
  class: "card-actions"
}, Ie = ["onClick"], Ue = ["onClick"], qe = {
  key: 0,
  class: "empty-state"
}, Ae = {
  key: 3,
  class: "error-banner"
}, De = {
  key: 4,
  class: "notice"
}, N = 30, He = /* @__PURE__ */ it({
  __name: "MemoryPage",
  setup(Pe) {
    const { confirm: H } = vt(), c = i("memories"), S = i(""), E = i(""), B = i("recent"), m = i(0), P = i([]), z = i(0), w = i({ working: 0, shortTerm: { total: 0 }, longTerm: 0, avgStrength: 0 }), v = i(!1), d = i(""), C = i(""), M = i(""), F = i([]), j = i(""), r = i({ title: "", content: "", tags: "" }), u = i(null), I = i([]), U = i("proposed"), q = X(() => Math.max(1, Math.ceil(z.value / N))), O = X(() => Math.floor(m.value / N) + 1);
    function x(a) {
      return `${Math.round(Math.max(0, Math.min(1, a || 0)) * 100)}%`;
    }
    function tt(a) {
      return a === "long_term" ? "长期记忆" : a === "short_term" ? "短期记忆" : "工作记忆";
    }
    function R(a) {
      if (!a) return "";
      const e = new Date(a);
      return Number.isNaN(e.getTime()) ? a : e.toLocaleString();
    }
    function J(a) {
      C.value = a, setTimeout(() => {
        C.value === a && (C.value = "");
      }, 2e3);
    }
    async function p(a, e) {
      const s = await fetch("/api/life/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: a, payload: e })
      });
      if (!s.ok) throw new Error(await s.text() || `HTTP ${s.status}`);
      return s.json().catch(() => ({}));
    }
    async function $() {
      try {
        const a = await fetch("/api/life/memories?limit=1");
        if (a.ok) {
          const e = await a.json();
          e.stats && (w.value = e.stats);
        }
      } catch {
      }
    }
    async function _() {
      v.value = !0, d.value = "";
      try {
        const a = await p("memory_page", { tier: E.value, query: S.value.trim(), limit: N, offset: m.value, sort: B.value });
        P.value = a.items || [], z.value = a.total || 0;
      } catch (a) {
        d.value = a?.message || "无法读取记忆";
      } finally {
        v.value = !1;
      }
    }
    async function A() {
      v.value = !0, d.value = "";
      try {
        const a = await p("memory_note_list", { query: j.value.trim(), limit: 60 });
        F.value = a.notes || [];
      } catch (a) {
        d.value = a?.message || "无法读取笔记";
      } finally {
        v.value = !1;
      }
    }
    async function K() {
      v.value = !0, d.value = "";
      try {
        const a = await p("memory_reflection_list", { status: U.value, limit: 80 });
        I.value = a.reflections || [];
      } catch (a) {
        d.value = a?.message || "无法读取反思提案";
      } finally {
        v.value = !1;
      }
    }
    function G() {
      return c.value === "notes" ? A() : c.value === "reflections" ? K() : _();
    }
    async function et(a) {
      try {
        await p("memory_reinforce", { ids: [a.id] }), J("已再巩固"), await _();
      } catch (e) {
        d.value = e?.message || "强化失败";
      }
    }
    async function st(a) {
      if (await H({ title: "删除记忆", message: "删除会撤销该记忆并重建检索投影，继续吗？", confirmLabel: "删除", danger: !0 }))
        try {
          await p("delete_memory", { id: a.id }), await _(), await $();
        } catch (s) {
          d.value = s?.message || "删除失败";
        }
    }
    async function at() {
      if (await H({ title: "清除全部记忆", message: "这会清除工作、短期、长期记忆、笔记块和反思提案，无法恢复。确定继续吗？", confirmLabel: "全部清除", danger: !0 }))
        try {
          await p("clear_all_memory", {}), await _(), await $();
        } catch (e) {
          d.value = e?.message || "清除失败";
        }
    }
    async function nt() {
      if (!(!r.value.content.trim() && !r.value.title.trim()))
        try {
          await p("memory_note_create", {
            title: r.value.title,
            content: r.value.content,
            tags: r.value.tags.split(",").map((a) => a.trim()).filter(Boolean)
          }), r.value = { title: "", content: "", tags: "" }, J("笔记已保存"), await A();
        } catch (a) {
          d.value = a?.message || "保存笔记失败";
        }
    }
    async function Q(a, e = 1) {
      try {
        const s = await p("memory_note_read", { note_id: a.note_id, offset: e, limit: 400 });
        u.value = { ...s, offset: s.offset || e };
      } catch (s) {
        d.value = s?.message || "读取笔记失败";
      }
    }
    async function lt(a) {
      if (await H({ title: "删除笔记", message: `删除笔记「${a.note_id}」及其分块？`, confirmLabel: "删除", danger: !0 }))
        try {
          await p("memory_note_delete", { note_id: a.note_id }), u.value?.note_id === a.note_id && (u.value = null), await A();
        } catch (s) {
          d.value = s?.message || "删除笔记失败";
        }
    }
    async function W(a, e) {
      try {
        await p("memory_reflection_review", { id: a.id, accept: e }), await K(), await $();
      } catch (s) {
        d.value = s?.message || "审核失败";
      }
    }
    async function ot() {
      try {
        const a = await p("memory_maintenance", {});
        J(`维护完成：巩固 ${a.consolidated ?? 0} 条`), await _(), await $();
      } catch (a) {
        d.value = a?.message || "维护失败";
      }
    }
    let k = null;
    return T(S, () => {
      m.value = 0, k && clearTimeout(k), k = setTimeout(_, 250);
    }), T([E, B], () => {
      m.value = 0, _();
    }), T(j, () => {
      k && clearTimeout(k), k = setTimeout(A, 250);
    }), T(U, K), T(c, G), dt(async () => {
      await _(), await $();
    }), (a, e) => (l(), o("main", bt, [
      t("div", _t, [
        t("header", ht, [
          e[16] || (e[16] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / MEMORY"),
            t("h1", null, "记忆管理台"),
            t("p", { class: "subtitle" }, "浏览 LIFE 的记忆分层、强度与召回；管理笔记、审核反思提案。记忆由 LIFE 插件维护，禁用后此入口消失。")
          ], -1)),
          t("div", mt, [
            t("button", {
              class: "btn btn-tonal",
              disabled: v.value,
              onClick: ot
            }, "巩固维护", 8, ft),
            t("button", {
              class: "btn btn-danger",
              disabled: v.value,
              onClick: at
            }, "一键清除", 8, gt),
            t("button", {
              class: "btn btn-tonal",
              disabled: v.value,
              onClick: G
            }, n(v.value ? "加载中…" : "刷新"), 9, kt)
          ])
        ]),
        t("section", yt, [
          t("article", wt, [
            e[17] || (e[17] = V('<div class="stat-head" data-v-44679b4d><span class="icon-badge tone-1" aria-hidden="true" data-v-44679b4d><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-44679b4d><path d="M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-44679b4d></path></svg></span><span class="stat-label" data-v-44679b4d>工作记忆</span></div>', 1)),
            t("strong", Ct, n(w.value.working), 1),
            e[18] || (e[18] = t("span", { class: "stat-hint" }, "当前上下文", -1))
          ]),
          t("article", Mt, [
            e[19] || (e[19] = V('<div class="stat-head" data-v-44679b4d><span class="icon-badge tone-2" aria-hidden="true" data-v-44679b4d><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-44679b4d><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" data-v-44679b4d></circle><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-44679b4d></path></svg></span><span class="stat-label" data-v-44679b4d>短期记忆</span></div>', 1)),
            t("strong", xt, n(w.value.shortTerm?.total || 0), 1),
            e[20] || (e[20] = t("span", { class: "stat-hint" }, "待巩固记录", -1))
          ]),
          t("article", $t, [
            e[21] || (e[21] = V('<div class="stat-head" data-v-44679b4d><span class="icon-badge tone-3" aria-hidden="true" data-v-44679b4d><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-44679b4d><path d="M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 21.5v-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-44679b4d></path></svg></span><span class="stat-label" data-v-44679b4d>长期记忆</span></div>', 1)),
            t("strong", Tt, n(w.value.longTerm || 0), 1),
            e[22] || (e[22] = t("span", { class: "stat-hint" }, "稳定沉淀", -1))
          ]),
          t("article", Vt, [
            e[23] || (e[23] = V('<div class="stat-head" data-v-44679b4d><span class="icon-badge tone-4" aria-hidden="true" data-v-44679b4d><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-44679b4d><path d="M4 14l4-4 3 3 5-6 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-44679b4d></path><path d="M4 19h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-44679b4d></path></svg></span><span class="stat-label" data-v-44679b4d>平均强度</span></div>', 1)),
            t("strong", Lt, n(x(w.value.avgStrength)), 1),
            e[24] || (e[24] = t("span", { class: "stat-hint" }, "遗忘曲线后的值", -1))
          ])
        ]),
        t("nav", Nt, [
          t("button", {
            class: y({ active: c.value === "memories" }),
            onClick: e[0] || (e[0] = (s) => c.value = "memories")
          }, "记忆", 2),
          t("button", {
            class: y({ active: c.value === "notes" }),
            onClick: e[1] || (e[1] = (s) => c.value = "notes")
          }, "笔记", 2),
          t("button", {
            class: y({ active: c.value === "reflections" }),
            onClick: e[2] || (e[2] = (s) => c.value = "reflections")
          }, "反思提案", 2)
        ]),
        c.value === "memories" ? (l(), o(g, { key: 0 }, [
          t("section", St, [
            t("div", Et, [
              e[25] || (e[25] = t("svg", {
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
                "onUpdate:modelValue": e[3] || (e[3] = (s) => S.value = s),
                placeholder: "搜索记忆内容或标签",
                "aria-label": "搜索记忆"
              }, null, 512), [
                [L, S.value]
              ])
            ]),
            t("label", Bt, [
              e[27] || (e[27] = t("span", null, "层级", -1)),
              f(t("select", {
                "onUpdate:modelValue": e[4] || (e[4] = (s) => E.value = s)
              }, [...e[26] || (e[26] = [
                t("option", { value: "" }, "全部", -1),
                t("option", { value: "short_term" }, "短期", -1),
                t("option", { value: "long_term" }, "长期", -1)
              ])], 512), [
                [Y, E.value]
              ])
            ]),
            t("label", Ft, [
              e[29] || (e[29] = t("span", null, "排序", -1)),
              f(t("select", {
                "onUpdate:modelValue": e[5] || (e[5] = (s) => B.value = s)
              }, [...e[28] || (e[28] = [
                t("option", { value: "recent" }, "最近", -1),
                t("option", { value: "strength" }, "强度", -1),
                t("option", { value: "importance" }, "重要性", -1),
                t("option", { value: "recall" }, "召回次数", -1)
              ])], 512), [
                [Y, B.value]
              ])
            ]),
            t("span", jt, n(z.value) + " 条 · 第 " + n(O.value) + "/" + n(q.value) + " 页", 1)
          ]),
          t("section", It, [
            (l(!0), o(g, null, D(P.value, (s) => (l(), o("article", {
              key: s.id,
              class: y(["memory-card", { open: M.value === s.id }])
            }, [
              t("div", Ut, [
                t("span", {
                  class: y(["chip", "tier-" + (s.tier === "long_term" ? "long" : "short")])
                }, n(tt(s.tier)), 3),
                s.scope && s.scope !== "public" ? (l(), o("span", qt, n(s.scope), 1)) : b("", !0),
                t("span", At, n(s.memory_type || "knowledge"), 1),
                t("button", {
                  class: "btn-icon danger",
                  title: "删除记忆",
                  onClick: (h) => st(s)
                }, [...e[30] || (e[30] = [
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
                ])], 8, Dt)
              ]),
              t("p", Ht, n(s.content), 1),
              s.tags?.length ? (l(), o("div", Pt, [
                (l(!0), o(g, null, D(s.tags, (h) => (l(), o("span", { key: h }, "#" + n(h), 1))), 128))
              ])) : b("", !0),
              t("footer", zt, [
                t("div", Ot, [
                  e[31] || (e[31] = t("span", null, "重要性", -1)),
                  t("div", Rt, [
                    t("i", {
                      style: Z({ width: x(s.importance) }),
                      class: "fill-primary"
                    }, null, 4)
                  ]),
                  t("b", null, n(x(s.importance)), 1)
                ]),
                t("div", Jt, [
                  e[32] || (e[32] = t("span", null, "强度", -1)),
                  t("div", Kt, [
                    t("i", {
                      style: Z({ width: x(s.strength) }),
                      class: "fill-secondary"
                    }, null, 4)
                  ]),
                  t("b", null, n(x(s.strength)), 1)
                ]),
                t("span", Qt, "召回 " + n(s.recall_count || 0) + " 次", 1)
              ]),
              M.value === s.id ? (l(), o("div", Yt, [
                t("dl", null, [
                  t("div", null, [
                    e[33] || (e[33] = t("dt", null, "ID", -1)),
                    t("dd", null, [
                      t("code", null, n(s.id), 1)
                    ])
                  ]),
                  t("div", null, [
                    e[34] || (e[34] = t("dt", null, "来源", -1)),
                    t("dd", null, n(s.source_kind || "conversation"), 1)
                  ]),
                  t("div", null, [
                    e[35] || (e[35] = t("dt", null, "创建", -1)),
                    t("dd", null, n(R(s.created_at)), 1)
                  ]),
                  t("div", null, [
                    e[36] || (e[36] = t("dt", null, "最近召回", -1)),
                    t("dd", null, n(R(s.last_recalled)), 1)
                  ])
                ])
              ])) : b("", !0),
              t("div", Gt, [
                t("button", {
                  class: "btn btn-sm btn-tonal",
                  onClick: (h) => M.value = M.value === s.id ? "" : s.id
                }, n(M.value === s.id ? "收起" : "详情"), 9, Wt),
                t("button", {
                  class: "btn btn-sm btn-tonal",
                  onClick: (h) => et(s)
                }, "再巩固", 8, Xt)
              ])
            ], 2))), 128)),
            !v.value && !P.value.length ? (l(), o("div", Zt, [...e[37] || (e[37] = [
              t("p", null, "暂无匹配记忆", -1),
              t("p", { class: "hint" }, "LIFE 会在对话与工具调用中逐步沉淀记忆。", -1)
            ])])) : b("", !0)
          ]),
          q.value > 1 ? (l(), o("div", te, [
            t("button", {
              class: "btn btn-tonal btn-sm",
              disabled: m.value === 0,
              onClick: e[6] || (e[6] = (s) => {
                m.value = Math.max(0, m.value - N), _();
              })
            }, "上一页", 8, ee),
            t("span", se, n(O.value) + " / " + n(q.value), 1),
            t("button", {
              class: "btn btn-tonal btn-sm",
              disabled: O.value >= q.value,
              onClick: e[7] || (e[7] = (s) => {
                m.value += N, _();
              })
            }, "下一页", 8, ae)
          ])) : b("", !0)
        ], 64)) : c.value === "notes" ? (l(), o(g, { key: 1 }, [
          t("section", ne, [
            t("article", le, [
              e[38] || (e[38] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "新建笔记")
              ], -1)),
              t("form", {
                class: "stack-form",
                onSubmit: rt(nt, ["prevent"])
              }, [
                f(t("input", {
                  "onUpdate:modelValue": e[8] || (e[8] = (s) => r.value.title = s),
                  class: "input",
                  placeholder: "标题",
                  "aria-label": "笔记标题"
                }, null, 512), [
                  [L, r.value.title]
                ]),
                f(t("input", {
                  "onUpdate:modelValue": e[9] || (e[9] = (s) => r.value.tags = s),
                  class: "input",
                  placeholder: "标签（逗号分隔，可选）",
                  "aria-label": "笔记标签"
                }, null, 512), [
                  [L, r.value.tags]
                ]),
                f(t("textarea", {
                  "onUpdate:modelValue": e[10] || (e[10] = (s) => r.value.content = s),
                  class: "input area",
                  placeholder: "笔记正文…",
                  "aria-label": "笔记正文"
                }, null, 512), [
                  [L, r.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !r.value.content.trim() && !r.value.title.trim()
                }, "保存笔记", 8, oe)
              ], 32)
            ]),
            t("article", ie, [
              t("div", de, [
                e[39] || (e[39] = t("h2", { class: "card-title" }, "笔记库", -1)),
                t("span", re, n(F.value.length), 1)
              ]),
              t("div", ue, [
                f(t("input", {
                  "onUpdate:modelValue": e[11] || (e[11] = (s) => j.value = s),
                  placeholder: "搜索笔记…",
                  "aria-label": "搜索笔记"
                }, null, 512), [
                  [L, j.value]
                ])
              ]),
              t("ul", ce, [
                (l(!0), o(g, null, D(F.value, (s) => (l(), o("li", {
                  key: s.note_id,
                  class: "note-item"
                }, [
                  t("div", ve, [
                    t("strong", null, n(s.note_id), 1),
                    t("span", pe, n(s.preview?.slice(0, 90) || "（空）"), 1),
                    t("span", be, n((s.bytes / 1024).toFixed(1)) + " KB", 1)
                  ]),
                  t("div", _e, [
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      onClick: (h) => Q(s)
                    }, "阅读", 8, he),
                    t("button", {
                      class: "btn btn-sm btn-danger",
                      onClick: (h) => lt(s)
                    }, "删除", 8, me)
                  ])
                ]))), 128)),
                F.value.length ? b("", !0) : (l(), o("li", fe, "还没有笔记。LIFE 或你可以把长内容写入笔记并参与检索。"))
              ])
            ])
          ]),
          u.value ? (l(), o("section", ge, [
            t("div", ke, [
              t("h2", ye, n(u.value.note_id), 1),
              t("button", {
                class: "btn btn-sm btn-tonal",
                onClick: e[12] || (e[12] = (s) => u.value = null)
              }, "关闭")
            ]),
            t("pre", null, n(u.value.content), 1),
            t("div", we, [
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: u.value.offset <= 1,
                onClick: e[13] || (e[13] = (s) => Q({ note_id: u.value.note_id }, Math.max(1, u.value.offset - 400)))
              }, "上一段", 8, Ce),
              t("span", Me, n(u.value.total_lines) + " 行", 1),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: !u.value.has_more,
                onClick: e[14] || (e[14] = (s) => Q({ note_id: u.value.note_id }, u.value.offset + 400))
              }, "下一段", 8, xe)
            ])
          ])) : b("", !0)
        ], 64)) : (l(), o(g, { key: 2 }, [
          t("section", $e, [
            t("label", Te, [
              e[41] || (e[41] = t("span", null, "状态", -1)),
              f(t("select", {
                "onUpdate:modelValue": e[15] || (e[15] = (s) => U.value = s)
              }, [...e[40] || (e[40] = [
                V('<option value="proposed" data-v-44679b4d>待审核</option><option value="pending" data-v-44679b4d>待处理</option><option value="applied" data-v-44679b4d>已采纳</option><option value="rejected" data-v-44679b4d>已拒绝</option><option value="" data-v-44679b4d>全部</option>', 5)
              ])], 512), [
                [Y, U.value]
              ])
            ]),
            t("span", Ve, n(I.value.length) + " 条", 1)
          ]),
          t("section", Le, [
            (l(!0), o(g, null, D(I.value, (s) => (l(), o("article", {
              key: s.id,
              class: "card reflection"
            }, [
              t("div", Ne, [
                t("h3", Se, n(s.statement || "（无摘要）"), 1),
                t("span", {
                  class: y(["chip", s.status === "applied" ? "chip-ok" : s.status === "rejected" ? "chip-warn" : "muted"])
                }, n(s.status), 3)
              ]),
              t("p", Ee, "来源会话 " + n(s.session_id) + " · " + n(R(s.created_at)), 1),
              t("details", null, [
                e[42] || (e[42] = t("summary", null, "查看原始对话", -1)),
                t("p", Be, "用户：" + n(s.user_text), 1),
                t("p", Fe, "LIFE：" + n(s.assistant_text), 1)
              ]),
              s.status === "proposed" ? (l(), o("div", je, [
                t("button", {
                  class: "btn btn-sm btn-primary",
                  onClick: (h) => W(s, !0)
                }, "采纳为记忆", 8, Ie),
                t("button", {
                  class: "btn btn-sm btn-danger",
                  onClick: (h) => W(s, !1)
                }, "拒绝", 8, Ue)
              ])) : b("", !0)
            ]))), 128)),
            I.value.length ? b("", !0) : (l(), o("div", qe, [...e[43] || (e[43] = [
              t("p", null, "没有该状态的反思提案", -1),
              t("p", { class: "hint" }, "LIFE 从对话中提炼低风险记忆提案，等你确认。", -1)
            ])]))
          ])
        ], 64)),
        d.value ? (l(), o("p", Ae, n(d.value), 1)) : b("", !0),
        C.value ? (l(), o("p", De, n(C.value), 1)) : b("", !0)
      ]),
      ut(ct)
    ]));
  }
}), Re = /* @__PURE__ */ pt(He, [["__scopeId", "data-v-44679b4d"]]);
export {
  Re as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-97426f7f]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-97426f7f]{max-width:1180px;margin:0 auto}.page-header[data-v-97426f7f]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-97426f7f]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-97426f7f]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-97426f7f]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-97426f7f]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-97426f7f]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-97426f7f]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-97426f7f]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-97426f7f]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-97426f7f]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-97426f7f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-97426f7f]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-97426f7f]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-97426f7f]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-97426f7f]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-97426f7f]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-97426f7f]{display:flex;align-items:center;gap:10px}.stat-label[data-v-97426f7f]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-97426f7f]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-97426f7f]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-97426f7f]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-97426f7f]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-97426f7f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-97426f7f]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-97426f7f]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-97426f7f]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-97426f7f]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-97426f7f]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-97426f7f]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-97426f7f]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-97426f7f]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-97426f7f]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-97426f7f]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-97426f7f]{background:#fff1dc;color:#7a4400}.input[data-v-97426f7f]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-97426f7f]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-97426f7f]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-97426f7f]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-97426f7f]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-97426f7f]{grid-column:1/-1}.stack-form[data-v-97426f7f]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-97426f7f]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-97426f7f]{align-self:flex-start}.item-list[data-v-97426f7f],.rel-list[data-v-97426f7f],.feed[data-v-97426f7f],.timeline[data-v-97426f7f]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-97426f7f]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-97426f7f]{align-items:flex-start}.item[data-v-97426f7f]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-97426f7f]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-97426f7f]{font-size:14px;font-weight:600}.item-main strong.done[data-v-97426f7f]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-97426f7f]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-97426f7f]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-97426f7f]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-97426f7f]{background:transparent;border:0}.check-label[data-v-97426f7f]{display:flex;align-items:center}.check-label input[data-v-97426f7f]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-97426f7f]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-97426f7f]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-97426f7f]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-97426f7f]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-97426f7f],.rel-meter[data-v-97426f7f]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-97426f7f]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-97426f7f]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-97426f7f]{font-size:12px}.rel-actions[data-v-97426f7f]{display:flex;gap:4px}.ledger[data-v-97426f7f]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-97426f7f]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-97426f7f]{padding:8px 12px}.feed time[data-v-97426f7f],.timeline time[data-v-97426f7f]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-97426f7f]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-97426f7f]{color:var(--md-success);font-weight:700}.neg[data-v-97426f7f]{color:var(--md-error);font-weight:700}.policy[data-v-97426f7f]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-97426f7f]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-97426f7f]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-97426f7f]{margin-top:6px}.audit-card[data-v-97426f7f]{margin-bottom:var(--space-lg)}.timeline[data-v-97426f7f]{position:relative}.timeline li[data-v-97426f7f]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-97426f7f]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-97426f7f]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-97426f7f]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-97426f7f]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-97426f7f]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-97426f7f]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-97426f7f]{font-size:13.5px;font-weight:650}.tl-detail[data-v-97426f7f]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-97426f7f]{grid-template-columns:repeat(2,1fr)}.grid[data-v-97426f7f],.agenda-form[data-v-97426f7f]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-97426f7f]{padding:var(--space-lg)}.header-actions[data-v-97426f7f]{padding-top:0}}.page[data-v-44679b4d]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-44679b4d]{max-width:1180px;margin:0 auto}.page-header[data-v-44679b4d]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-44679b4d]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-44679b4d]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-44679b4d]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-44679b4d]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-44679b4d]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-44679b4d]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-44679b4d]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-44679b4d]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-44679b4d]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-44679b4d]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-44679b4d]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-44679b4d]{display:flex;align-items:center;gap:10px}.stat-label[data-v-44679b4d]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-44679b4d]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-44679b4d]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-44679b4d]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-44679b4d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-44679b4d]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-44679b4d]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-44679b4d]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-44679b4d]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-44679b4d]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-44679b4d]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-44679b4d]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-44679b4d]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-44679b4d]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-44679b4d]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-44679b4d]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-44679b4d]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-44679b4d]{background:#fff1dc;color:#7a4400}.error-banner[data-v-44679b4d]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-44679b4d]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-44679b4d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-44679b4d]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-44679b4d]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-44679b4d]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-44679b4d]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-44679b4d]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-44679b4d]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-44679b4d]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-44679b4d]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-44679b4d]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-44679b4d]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-44679b4d]{background:var(--md-primary)}.fill-secondary[data-v-44679b4d]{background:var(--md-secondary,#536255)}.meter-text[data-v-44679b4d]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-44679b4d]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-44679b4d]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-44679b4d]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-44679b4d]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-44679b4d]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-44679b4d]{display:flex;gap:8px;justify-content:flex-end}.empty-state[data-v-44679b4d]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-44679b4d]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-44679b4d]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-44679b4d]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-44679b4d]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-44679b4d]{display:flex;flex-direction:column;gap:10px}.input[data-v-44679b4d]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-44679b4d]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-44679b4d]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-44679b4d],.reflection-list[data-v-44679b4d]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-44679b4d]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-44679b4d]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-44679b4d]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-44679b4d]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-44679b4d]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-44679b4d]{margin-top:var(--space-lg)}.reader pre[data-v-44679b4d]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-44679b4d]{font-size:14px;font-weight:600}.reflection details[data-v-44679b4d]{margin-top:6px}.reflection summary[data-v-44679b4d]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-44679b4d]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-44679b4d]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-44679b4d]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-44679b4d]{padding:var(--space-lg)}.header-actions[data-v-44679b4d]{padding-top:0}.memory-list[data-v-44679b4d]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
