import { defineComponent as q, ref as u, computed as O, onMounted as K, openBlock as l, createElementBlock as n, createElementVNode as t, toDisplayString as a, createCommentVNode as d, createStaticVNode as F, withModifiers as I, withDirectives as _, vModelText as h, Fragment as c, renderList as p, normalizeClass as P, createTextVNode as w, normalizeStyle as Q, createVNode as X } from "vue";
import { _ as Y, a as Z } from "./assets/_plugin-vue_export-helper-CihezfpQ.js";
const tt = { class: "page" }, et = { class: "page-inner" }, st = { class: "page-header" }, at = { class: "header-actions" }, lt = ["disabled"], nt = {
  key: 0,
  class: "error-banner"
}, it = {
  key: 1,
  class: "notice"
}, ot = { class: "stat-grid" }, dt = { class: "stat-card" }, rt = { class: "stat-value" }, ct = { class: "stat-card" }, ut = { class: "stat-value" }, pt = { class: "stat-card" }, vt = { class: "stat-value" }, _t = { class: "stat-hint" }, ht = { class: "stat-card" }, mt = { class: "stat-value" }, gt = { class: "grid" }, bt = { class: "card" }, yt = { class: "item-list" }, kt = { class: "item-main" }, ft = { class: "item-meta" }, wt = { class: "item-actions" }, Ct = ["onClick"], xt = ["onClick"], Mt = {
  key: 0,
  class: "list-empty"
}, Vt = { class: "item-list" }, jt = { class: "check-label" }, $t = ["checked", "onChange"], Lt = { class: "item-main" }, Nt = { class: "item-meta" }, St = {
  key: 0,
  class: "list-empty"
}, Ut = { class: "card" }, Et = { class: "card-head" }, Ft = { class: "rel-list" }, It = { class: "avatar" }, Pt = { class: "rel-main" }, Tt = { class: "rel-top" }, Bt = { class: "chip" }, Ot = { class: "rel-meter" }, At = { class: "meter-bar" }, Dt = { class: "item-meta" }, zt = { class: "rel-actions" }, Ht = ["onClick"], Gt = ["onClick"], Jt = {
  key: 0,
  class: "list-empty"
}, Rt = {
  key: 0,
  class: "ledger"
}, Wt = { class: "section-label" }, qt = { class: "feed" }, Kt = {
  key: 0,
  class: "list-empty plain"
}, Qt = { class: "card" }, Xt = { class: "card-head" }, Yt = { class: "chip muted" }, Zt = ["disabled"], te = { class: "item-list" }, ee = { class: "item-main" }, se = { class: "item-meta" }, ae = { class: "item-meta" }, le = { class: "item-actions" }, ne = ["onClick"], ie = {
  key: 0,
  class: "list-empty"
}, oe = { class: "policy" }, de = { class: "select" }, re = { class: "select" }, ce = { class: "feed" }, ue = {
  key: 0,
  class: "list-empty plain"
}, pe = { class: "card" }, ve = { class: "item-list" }, _e = { class: "item-main" }, he = { class: "item-meta" }, me = { class: "chip" }, ge = {
  key: 0,
  class: "list-empty"
}, be = { class: "card" }, ye = { class: "card-head" }, ke = { class: "chip muted" }, fe = { class: "item-list" }, we = { class: "item-main" }, Ce = { class: "item-meta" }, xe = {
  key: 0,
  class: "group-detail"
}, Me = {
  key: 0,
  class: "topics"
}, Ve = { class: "feed compact" }, je = { class: "item-actions" }, $e = ["onClick"], Le = {
  key: 0,
  class: "list-empty"
}, Ne = { class: "card" }, Se = { class: "feed" }, Ue = {
  key: 0,
  class: "list-empty plain"
}, Ee = { class: "card" }, Fe = { class: "feed" }, Ie = {
  key: 0,
  class: "list-empty plain"
}, Pe = { class: "card audit-card" }, Te = { class: "card-head" }, Be = { class: "timeline" }, Oe = { class: "tl-body" }, Ae = { class: "tl-head" }, De = { class: "item-meta" }, ze = { class: "tl-detail" }, He = {
  key: 0,
  class: "list-empty plain"
}, Ge = /* @__PURE__ */ q({
  __name: "CompanionPage",
  setup(Je) {
    const o = u({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), C = u(!1), y = u(""), k = u(""), f = u(""), x = u(""), M = u(""), V = u(""), j = u(""), $ = u(!1), L = u(""), r = u({ target: "", motive: "", content: "", preferred_at: "" }), b = u({ daily_limit: 6, per_target_limit: 2 }), N = O(() => Object.entries(o.value.groups || {})), S = O(() => (o.value.proactive?.candidates || []).filter((i) => !["delivered", "cancelled"].includes(i.status))), T = O(() => o.value.proactive?.receipts || []);
    function U(i) {
      k.value = i, setTimeout(() => {
        k.value === i && (k.value = "");
      }, 2e3);
    }
    async function B() {
      C.value = !0, y.value = "";
      try {
        const i = await fetch("/api/life/companion");
        if (!i.ok) throw Error(String(i.status));
        o.value = await i.json();
      } catch (i) {
        y.value = i?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        C.value = !1;
      }
    }
    async function m(i, s) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: i, payload: s }) });
        if (!e.ok) throw Error(await e.text());
        return await B(), await e.json().catch(() => ({}));
      } catch (e) {
        return y.value = e?.message || "操作失败", null;
      }
    }
    async function z() {
      f.value.trim() && (await m("add_agenda", { title: f.value, when: x.value, detail: M.value }), f.value = "", x.value = "", M.value = "");
    }
    async function A(i, s) {
      s.trim() && (await m(i, { content: s }), i === "journal" ? V.value = "" : j.value = "");
    }
    function H(i) {
      return `${Math.round(Math.max(0, Math.min(1, i || 0)) * 100)}%`;
    }
    async function D(i, s) {
      await m("relationship_adjust", { user_id: i, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: s }) && U(`已调整 ${i}`);
    }
    async function G() {
      if (!r.value.target.trim() || !r.value.content.trim()) return;
      await m("proactive_create", { ...r.value }) && (r.value = { target: "", motive: "", content: "", preferred_at: "" }, U("已创建主动候选"));
    }
    async function J(i) {
      await m("proactive_cancel", { id: i, reason: "dashboard_cancel" }), U("已取消候选");
    }
    async function R() {
      await m("proactive_policy", { daily_limit: Number(b.value.daily_limit), per_target_limit: Number(b.value.per_target_limit) }), U("策略已保存");
    }
    function E(i) {
      if (!i) return "";
      const s = new Date(i);
      return Number.isNaN(s.getTime()) ? i : s.toLocaleString();
    }
    return K(B), (i, s) => (l(), n("main", tt, [
      t("div", et, [
        t("header", st, [
          s[15] || (s[15] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", at, [
            t("button", {
              class: "btn btn-tonal",
              disabled: C.value,
              onClick: B
            }, a(C.value ? "刷新中…" : "刷新"), 9, lt)
          ])
        ]),
        y.value ? (l(), n("p", nt, a(y.value), 1)) : d("", !0),
        k.value ? (l(), n("p", it, a(k.value), 1)) : d("", !0),
        t("section", ot, [
          t("article", dt, [
            s[16] || (s[16] = F('<div class="stat-head" data-v-002ee0e6><span class="icon-badge tone-1" aria-hidden="true" data-v-002ee0e6><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-002ee0e6><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-002ee0e6></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-002ee0e6></path></svg></span><span class="stat-label" data-v-002ee0e6>关系对象</span></div>', 1)),
            t("strong", rt, a(o.value.relationships?.length || 0), 1),
            s[17] || (s[17] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", ct, [
            s[18] || (s[18] = F('<div class="stat-head" data-v-002ee0e6><span class="icon-badge tone-2" aria-hidden="true" data-v-002ee0e6><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-002ee0e6><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-002ee0e6></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-002ee0e6></path></svg></span><span class="stat-label" data-v-002ee0e6>活动日程</span></div>', 1)),
            t("strong", ut, a(o.value.agenda?.filter((e) => e.status === "active").length || 0), 1),
            s[19] || (s[19] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", pt, [
            s[20] || (s[20] = F('<div class="stat-head" data-v-002ee0e6><span class="icon-badge tone-3" aria-hidden="true" data-v-002ee0e6><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-002ee0e6><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-002ee0e6></path></svg></span><span class="stat-label" data-v-002ee0e6>待投递主动行为</span></div>', 1)),
            t("strong", vt, a(S.value.length), 1),
            t("span", _t, "已投递 " + a(T.value.length) + " 次", 1)
          ]),
          t("article", ht, [
            s[21] || (s[21] = F('<div class="stat-head" data-v-002ee0e6><span class="icon-badge tone-4" aria-hidden="true" data-v-002ee0e6><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-002ee0e6><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-002ee0e6></path></svg></span><span class="stat-label" data-v-002ee0e6>已观察群聊</span></div>', 1)),
            t("strong", mt, a(N.value.length), 1),
            s[22] || (s[22] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", gt, [
          t("article", bt, [
            s[24] || (s[24] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "日程")
            ], -1)),
            t("form", {
              class: "agenda-form",
              onSubmit: I(z, ["prevent"])
            }, [
              _(t("input", {
                "onUpdate:modelValue": s[0] || (s[0] = (e) => f.value = e),
                class: "input",
                placeholder: "日程标题",
                "aria-label": "日程标题"
              }, null, 512), [
                [h, f.value]
              ]),
              _(t("input", {
                "onUpdate:modelValue": s[1] || (s[1] = (e) => x.value = e),
                class: "input",
                placeholder: "时间，例如 2026-09-25 20:00",
                "aria-label": "时间"
              }, null, 512), [
                [h, x.value]
              ]),
              s[23] || (s[23] = t("button", {
                class: "btn btn-primary",
                type: "submit"
              }, "创建候选", -1)),
              _(t("textarea", {
                "onUpdate:modelValue": s[2] || (s[2] = (e) => M.value = e),
                class: "input area",
                placeholder: "说明（可选）"
              }, null, 512), [
                [h, M.value]
              ])
            ], 32),
            s[25] || (s[25] = t("h3", { class: "section-label" }, "待确认候选", -1)),
            t("ul", yt, [
              (l(!0), n(c, null, p(o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", kt, [
                  t("strong", null, a(e.title), 1),
                  t("span", ft, a(e.when_text) + " · " + a(e.detail || "等待你确认"), 1)
                ]),
                t("div", wt, [
                  t("button", {
                    class: "btn btn-primary btn-sm",
                    onClick: (v) => m("confirm_agenda", { id: e.id })
                  }, "确认", 8, Ct),
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (v) => m("reject_agenda", { id: e.id })
                  }, "拒绝", 8, xt)
                ])
              ]))), 128)),
              o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? d("", !0) : (l(), n("li", Mt, "没有待确认的日程候选"))
            ]),
            s[26] || (s[26] = t("h3", { class: "section-label" }, "已确认日程", -1)),
            t("ul", Vt, [
              (l(!0), n(c, null, p(o.value.agenda, (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("label", jt, [
                  t("input", {
                    checked: e.status === "completed",
                    type: "checkbox",
                    onChange: (v) => m("complete_agenda", { id: e.id })
                  }, null, 40, $t)
                ]),
                t("div", Lt, [
                  t("strong", {
                    class: P({ done: e.status === "completed" })
                  }, a(e.title), 3),
                  t("span", Nt, [
                    w(a(e.start_at), 1),
                    e.detail ? (l(), n(c, { key: 0 }, [
                      w(" · " + a(e.detail), 1)
                    ], 64)) : d("", !0)
                  ])
                ])
              ]))), 128)),
              o.value.agenda?.length ? d("", !0) : (l(), n("li", St, "暂无已确认日程"))
            ])
          ]),
          t("article", Ut, [
            t("div", Et, [
              s[27] || (s[27] = t("h2", { class: "card-title" }, "关系账本", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: s[3] || (s[3] = (e) => $.value = !$.value)
              }, a($.value ? "隐藏事件" : "查看事件账本"), 1)
            ]),
            t("ul", Ft, [
              (l(!0), n(c, null, p(o.value.relationships, (e) => (l(), n("li", {
                key: e.user_id,
                class: "rel"
              }, [
                t("span", It, a((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                t("div", Pt, [
                  t("div", Tt, [
                    t("strong", null, a(e.user_id), 1),
                    t("span", Bt, a(e.stage), 1)
                  ]),
                  t("div", Ot, [
                    t("div", At, [
                      t("i", {
                        style: Q({ width: H(e.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, a(Math.round((e.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("span", Dt, "最近互动：" + a(e.last_seen || "暂无"), 1)
                ]),
                t("div", zt, [
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更亲近",
                    onClick: (v) => D(e.user_id, 0.05)
                  }, "+", 8, Ht),
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更疏远",
                    onClick: (v) => D(e.user_id, -0.05)
                  }, "−", 8, Gt)
                ])
              ]))), 128)),
              o.value.relationships?.length ? d("", !0) : (l(), n("li", Jt, "暂无关系记录"))
            ]),
            $.value ? (l(), n("div", Rt, [
              t("h3", Wt, "事件账本（最近 " + a(o.value.relationship_ledger?.length || 0) + " 条）", 1),
              t("ol", qt, [
                (l(!0), n(c, null, p(o.value.relationship_ledger, (e) => (l(), n("li", {
                  key: e.id
                }, [
                  t("time", null, a(E(e.created_at)), 1),
                  t("p", null, [
                    t("strong", null, a(e.user_id), 1),
                    w(" · " + a(e.event_key) + " ", 1),
                    t("span", {
                      class: P(e.delta >= 0 ? "pos" : "neg")
                    }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                    w(" · " + a(e.reason) + " (" + a(e.channel) + ")", 1)
                  ])
                ]))), 128)),
                o.value.relationship_ledger?.length ? d("", !0) : (l(), n("li", Kt, "暂无关系事件"))
              ])
            ])) : d("", !0)
          ]),
          t("article", Qt, [
            t("div", Xt, [
              s[28] || (s[28] = t("h2", { class: "card-title" }, "主动行为", -1)),
              t("span", Yt, "待投递 " + a(S.value.length), 1)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: I(G, ["prevent"])
            }, [
              _(t("input", {
                "onUpdate:modelValue": s[4] || (s[4] = (e) => r.value.target = e),
                class: "input",
                placeholder: "对象（user_id / 会话）",
                "aria-label": "主动对象"
              }, null, 512), [
                [h, r.value.target]
              ]),
              _(t("input", {
                "onUpdate:modelValue": s[5] || (s[5] = (e) => r.value.motive = e),
                class: "input",
                placeholder: "动机，如 care / reminder",
                "aria-label": "动机"
              }, null, 512), [
                [h, r.value.motive]
              ]),
              _(t("input", {
                "onUpdate:modelValue": s[6] || (s[6] = (e) => r.value.preferred_at = e),
                class: "input",
                placeholder: "期望时间（可选，ISO）",
                "aria-label": "期望时间"
              }, null, 512), [
                [h, r.value.preferred_at]
              ]),
              _(t("textarea", {
                "onUpdate:modelValue": s[7] || (s[7] = (e) => r.value.content = e),
                class: "input area",
                placeholder: "想说的内容…"
              }, null, 512), [
                [h, r.value.content]
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !r.value.target.trim() || !r.value.content.trim()
              }, "创建候选", 8, Zt)
            ], 32),
            s[31] || (s[31] = t("h3", { class: "section-label" }, "候选队列", -1)),
            t("ul", te, [
              (l(!0), n(c, null, p(S.value, (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", ee, [
                  t("strong", null, a(e.target) + " · " + a(e.motive), 1),
                  t("span", se, a(e.content), 1),
                  t("span", ae, "状态 " + a(e.status) + " · " + a(E(e.created_at)), 1)
                ]),
                t("div", le, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (v) => J(e.id)
                  }, "取消", 8, ne)
                ])
              ]))), 128)),
              S.value.length ? d("", !0) : (l(), n("li", ie, "没有待投递候选"))
            ]),
            s[32] || (s[32] = t("h3", { class: "section-label" }, "配额策略", -1)),
            t("div", oe, [
              t("label", de, [
                s[29] || (s[29] = t("span", null, "每日上限", -1)),
                _(t("input", {
                  "onUpdate:modelValue": s[8] || (s[8] = (e) => b.value.daily_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    h,
                    b.value.daily_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("label", re, [
                s[30] || (s[30] = t("span", null, "单人上限", -1)),
                _(t("input", {
                  "onUpdate:modelValue": s[9] || (s[9] = (e) => b.value.per_target_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    h,
                    b.value.per_target_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: R
              }, "保存策略")
            ]),
            s[33] || (s[33] = t("h3", { class: "section-label" }, "投递记录", -1)),
            t("ol", ce, [
              (l(!0), n(c, null, p(T.value, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, a(E(e.created_at)), 1),
                t("p", null, a(e.phase) + " · " + a(e.content), 1)
              ]))), 128)),
              T.value.length ? d("", !0) : (l(), n("li", ue, "还没有主动投递记录"))
            ])
          ]),
          t("article", pe, [
            s[34] || (s[34] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "成长中的性格")
            ], -1)),
            t("ul", ve, [
              (l(!0), n(c, null, p(o.value.persona_evolution, (e) => (l(), n("li", {
                key: e.id,
                class: "item trait-item"
              }, [
                t("div", _e, [
                  t("strong", null, a(e.trait), 1),
                  t("span", he, "支持 " + a(e.support_count) + " 次 · 置信度 " + a(Math.round((e.confidence || 0) * 100)) + "%", 1)
                ]),
                t("span", me, a(e.value), 1)
              ]))), 128)),
              o.value.persona_evolution?.length ? d("", !0) : (l(), n("li", ge, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
            ])
          ]),
          t("article", be, [
            t("div", ye, [
              s[35] || (s[35] = t("h2", { class: "card-title" }, "群聊观察", -1)),
              t("span", ke, a(N.value.length), 1)
            ]),
            t("ul", fe, [
              (l(!0), n(c, null, p(N.value, ([e, v]) => (l(), n("li", {
                key: e,
                class: "item group-item"
              }, [
                t("div", we, [
                  t("strong", null, a(e), 1),
                  t("span", Ce, "情绪 " + a(v.mood || "—") + " · " + a(v.messages?.length || 0) + " 条观察 · " + a(v.topics?.length || 0) + " 个话题", 1),
                  L.value === e ? (l(), n("div", xe, [
                    v.topics?.length ? (l(), n("div", Me, [
                      (l(!0), n(c, null, p(v.topics, (g) => (l(), n("span", {
                        key: g.topic,
                        class: "chip muted"
                      }, a(g.topic) + " · " + a(Math.round(g.score)), 1))), 128))
                    ])) : d("", !0),
                    t("ol", Ve, [
                      (l(!0), n(c, null, p(v.messages, (g, W) => (l(), n("li", { key: W }, [
                        t("time", null, a(E(g.created_at)), 1),
                        t("p", null, [
                          t("strong", null, a(g.user_id), 1),
                          w("：" + a(g.content), 1)
                        ])
                      ]))), 128))
                    ])
                  ])) : d("", !0)
                ]),
                t("div", je, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: (g) => L.value = L.value === e ? "" : e
                  }, a(L.value === e ? "收起" : "展开"), 9, $e)
                ])
              ]))), 128)),
              N.value.length ? d("", !0) : (l(), n("li", Le, "群聊观察尚未启用或没有消息。"))
            ])
          ]),
          t("article", Ne, [
            s[37] || (s[37] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "日记")
            ], -1)),
            t("form", {
              class: "stack-form",
              onSubmit: s[11] || (s[11] = I((e) => A("journal", V.value), ["prevent"]))
            }, [
              _(t("textarea", {
                "onUpdate:modelValue": s[10] || (s[10] = (e) => V.value = e),
                class: "input area",
                placeholder: "记录 LIFE 的日记…"
              }, null, 512), [
                [h, V.value]
              ]),
              s[36] || (s[36] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "写入日记", -1))
            ], 32),
            t("ol", Se, [
              (l(!0), n(c, null, p(o.value.journal, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, a(e.at), 1),
                t("p", null, a(e.content), 1)
              ]))), 128)),
              o.value.journal?.length ? d("", !0) : (l(), n("li", Ue, "还没有日记"))
            ])
          ]),
          t("article", Ee, [
            s[39] || (s[39] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "梦境")
            ], -1)),
            t("form", {
              class: "stack-form",
              onSubmit: s[13] || (s[13] = I((e) => A("dream", j.value), ["prevent"]))
            }, [
              _(t("textarea", {
                "onUpdate:modelValue": s[12] || (s[12] = (e) => j.value = e),
                class: "input area",
                placeholder: "记录一个梦境或睡眠反思…"
              }, null, 512), [
                [h, j.value]
              ]),
              s[38] || (s[38] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "记录梦境", -1))
            ], 32),
            t("ol", Fe, [
              (l(!0), n(c, null, p(o.value.dreams, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, a(e.at), 1),
                t("p", null, a(e.content), 1)
              ]))), 128)),
              o.value.dreams?.length ? d("", !0) : (l(), n("li", Ie, "还没有梦境记录"))
            ])
          ])
        ]),
        t("article", Pe, [
          t("div", Te, [
            s[40] || (s[40] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: s[14] || (s[14] = (e) => m("memory_maintenance", {}))
            }, "执行记忆维护与备份")
          ]),
          t("ol", Be, [
            (l(!0), n(c, null, p(o.value.audit, (e) => (l(), n("li", {
              key: e.at + e.kind
            }, [
              t("span", {
                class: P(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                "aria-hidden": "true"
              }, null, 2),
              t("div", Oe, [
                t("div", Ae, [
                  t("strong", null, a(e.kind), 1),
                  t("span", {
                    class: P(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                  }, a(e.outcome), 3),
                  t("time", null, a(e.at), 1)
                ]),
                t("p", De, a(e.target), 1),
                t("p", ze, a(e.detail), 1)
              ])
            ]))), 128)),
            o.value.audit?.length ? d("", !0) : (l(), n("li", He, "暂无审计记录"))
          ])
        ])
      ]),
      X(Y)
    ]));
  }
}), qe = /* @__PURE__ */ Z(Ge, [["__scopeId", "data-v-002ee0e6"]]);
export {
  qe as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-002ee0e6]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-002ee0e6]{max-width:1180px;margin:0 auto}.page-header[data-v-002ee0e6]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-002ee0e6]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-002ee0e6]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-002ee0e6]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-002ee0e6]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-002ee0e6]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-002ee0e6]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-002ee0e6]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-002ee0e6]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-002ee0e6]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-002ee0e6]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-002ee0e6]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-002ee0e6]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-002ee0e6]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-002ee0e6]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-002ee0e6]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-002ee0e6]{display:flex;align-items:center;gap:10px}.stat-label[data-v-002ee0e6]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-002ee0e6]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-002ee0e6]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-002ee0e6]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-002ee0e6]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-002ee0e6]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-002ee0e6]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-002ee0e6]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-002ee0e6]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-002ee0e6]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-002ee0e6]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-002ee0e6]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-002ee0e6]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-002ee0e6]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-002ee0e6]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-002ee0e6]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-002ee0e6]{background:#fff1dc;color:#7a4400}.input[data-v-002ee0e6]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-002ee0e6]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-002ee0e6]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-002ee0e6]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-002ee0e6]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-002ee0e6]{grid-column:1/-1}.stack-form[data-v-002ee0e6]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.stack-form .btn[data-v-002ee0e6]{align-self:flex-start}.item-list[data-v-002ee0e6],.rel-list[data-v-002ee0e6],.feed[data-v-002ee0e6],.timeline[data-v-002ee0e6]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-002ee0e6]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-002ee0e6]{align-items:flex-start}.item[data-v-002ee0e6]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-002ee0e6]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-002ee0e6]{font-size:14px;font-weight:600}.item-main strong.done[data-v-002ee0e6]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-002ee0e6]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-002ee0e6]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-002ee0e6]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-002ee0e6]{background:transparent;border:0}.check-label[data-v-002ee0e6]{display:flex;align-items:center}.check-label input[data-v-002ee0e6]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-002ee0e6]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-002ee0e6]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-002ee0e6]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-002ee0e6]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-002ee0e6],.rel-meter[data-v-002ee0e6]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-002ee0e6]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-002ee0e6]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-002ee0e6]{font-size:12px}.rel-actions[data-v-002ee0e6]{display:flex;gap:4px}.ledger[data-v-002ee0e6]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-002ee0e6]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-002ee0e6]{padding:8px 12px}.feed time[data-v-002ee0e6],.timeline time[data-v-002ee0e6]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-002ee0e6]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-002ee0e6]{color:var(--md-success);font-weight:700}.neg[data-v-002ee0e6]{color:var(--md-error);font-weight:700}.policy[data-v-002ee0e6]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-002ee0e6]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-002ee0e6]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-002ee0e6]{margin-top:6px}.audit-card[data-v-002ee0e6]{margin-bottom:var(--space-lg)}.timeline[data-v-002ee0e6]{position:relative}.timeline li[data-v-002ee0e6]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-002ee0e6]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-002ee0e6]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-002ee0e6]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-002ee0e6]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-002ee0e6]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-002ee0e6]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-002ee0e6]{font-size:13.5px;font-weight:650}.tl-detail[data-v-002ee0e6]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-002ee0e6]{grid-template-columns:repeat(2,1fr)}.grid[data-v-002ee0e6],.agenda-form[data-v-002ee0e6]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-002ee0e6]{padding:var(--space-lg)}.header-actions[data-v-002ee0e6]{padding-top:0}}.page[data-v-44679b4d]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-44679b4d]{max-width:1180px;margin:0 auto}.page-header[data-v-44679b4d]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-44679b4d]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-44679b4d]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-44679b4d]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-44679b4d]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-44679b4d]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-44679b4d]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-44679b4d]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-44679b4d]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-44679b4d]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-44679b4d]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-44679b4d]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-44679b4d]{display:flex;align-items:center;gap:10px}.stat-label[data-v-44679b4d]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-44679b4d]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-44679b4d]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-44679b4d]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-44679b4d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-44679b4d]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-44679b4d]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-44679b4d]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-44679b4d]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-44679b4d]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-44679b4d]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-44679b4d]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-44679b4d]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-44679b4d]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-44679b4d]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-44679b4d]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-44679b4d]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-44679b4d]{background:#fff1dc;color:#7a4400}.error-banner[data-v-44679b4d]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-44679b4d]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-44679b4d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-44679b4d]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-44679b4d]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-44679b4d]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-44679b4d]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-44679b4d]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-44679b4d]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-44679b4d]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-44679b4d]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-44679b4d]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-44679b4d]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-44679b4d]{background:var(--md-primary)}.fill-secondary[data-v-44679b4d]{background:var(--md-secondary,#536255)}.meter-text[data-v-44679b4d]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-44679b4d]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-44679b4d]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-44679b4d]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-44679b4d]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-44679b4d]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-44679b4d]{display:flex;gap:8px;justify-content:flex-end}.empty-state[data-v-44679b4d]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-44679b4d]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-44679b4d]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-44679b4d]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-44679b4d]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-44679b4d]{display:flex;flex-direction:column;gap:10px}.input[data-v-44679b4d]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-44679b4d]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-44679b4d]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-44679b4d],.reflection-list[data-v-44679b4d]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-44679b4d]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-44679b4d]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-44679b4d]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-44679b4d]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-44679b4d]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-44679b4d]{margin-top:var(--space-lg)}.reader pre[data-v-44679b4d]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-44679b4d]{font-size:14px;font-weight:600}.reflection details[data-v-44679b4d]{margin-top:6px}.reflection summary[data-v-44679b4d]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-44679b4d]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-44679b4d]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-44679b4d]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-44679b4d]{padding:var(--space-lg)}.header-actions[data-v-44679b4d]{padding-top:0}.memory-list[data-v-44679b4d]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
