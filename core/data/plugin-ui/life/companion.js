import { defineComponent as X, ref as c, computed as A, onMounted as Y, openBlock as l, createElementBlock as n, createElementVNode as t, toDisplayString as a, createCommentVNode as d, createStaticVNode as P, withModifiers as T, withDirectives as h, vModelText as m, Fragment as u, renderList as v, normalizeClass as O, createTextVNode as j, normalizeStyle as Z, createVNode as tt } from "vue";
import { _ as et, a as st } from "./assets/_plugin-vue_export-helper-CihezfpQ.js";
const at = { class: "page" }, lt = { class: "page-inner" }, nt = { class: "page-header" }, it = { class: "header-actions" }, ot = ["disabled"], rt = {
  key: 0,
  class: "error-banner"
}, dt = {
  key: 1,
  class: "notice"
}, ct = { class: "stat-grid" }, ut = { class: "stat-card" }, vt = { class: "stat-value" }, pt = { class: "stat-card" }, _t = { class: "stat-value" }, ht = { class: "stat-card" }, mt = { class: "stat-value" }, ft = { class: "stat-hint" }, bt = { class: "stat-card" }, gt = { class: "stat-value" }, yt = { class: "grid" }, kt = { class: "card" }, wt = { class: "item-list" }, Ct = { class: "item-main" }, jt = { class: "item-meta" }, xt = { class: "item-actions" }, Lt = ["onClick"], Mt = ["onClick"], Vt = {
  key: 0,
  class: "list-empty"
}, $t = { class: "item-list" }, Et = { class: "check-label" }, Nt = ["checked", "onChange"], St = { class: "item-main" }, Ft = { class: "item-meta" }, It = {
  key: 0,
  class: "list-empty"
}, Ut = { class: "card" }, Pt = { class: "card-head" }, Tt = { class: "rel-list" }, Ot = { class: "avatar" }, Bt = { class: "rel-main" }, At = { class: "rel-top" }, Dt = { class: "chip" }, zt = { class: "rel-meter" }, Ht = { class: "meter-bar" }, Jt = { class: "item-meta" }, Gt = { class: "rel-actions" }, Rt = ["onClick"], Wt = ["onClick"], qt = {
  key: 0,
  class: "list-empty"
}, Kt = {
  key: 0,
  class: "ledger"
}, Qt = { class: "section-label" }, Xt = { class: "feed" }, Yt = {
  key: 0,
  class: "list-empty plain"
}, Zt = { class: "card" }, te = { class: "card-head" }, ee = { class: "chip muted" }, se = ["disabled"], ae = { class: "item-list" }, le = { class: "item-main" }, ne = { class: "item-meta" }, ie = { class: "item-meta" }, oe = { class: "item-actions" }, re = ["onClick"], de = {
  key: 0,
  class: "list-empty"
}, ce = { class: "policy" }, ue = { class: "select" }, ve = { class: "select" }, pe = { class: "feed" }, _e = {
  key: 0,
  class: "list-empty plain"
}, he = { class: "card" }, me = { class: "item-list" }, fe = { class: "item-main" }, be = { class: "item-meta" }, ge = { class: "chip" }, ye = {
  key: 0,
  class: "list-empty"
}, ke = { class: "card" }, we = { class: "card-head" }, Ce = { class: "chip muted" }, je = { class: "item-list" }, xe = { class: "item-main" }, Le = { class: "item-meta" }, Me = {
  key: 0,
  class: "group-detail"
}, Ve = {
  key: 0,
  class: "topics"
}, $e = { class: "feed compact" }, Ee = { class: "item-actions" }, Ne = ["onClick"], Se = {
  key: 0,
  class: "list-empty"
}, Fe = { class: "card" }, Ie = { class: "card-head" }, Ue = ["disabled"], Pe = { class: "feed" }, Te = {
  key: 0,
  class: "list-empty plain"
}, Oe = { class: "card" }, Be = { class: "card-head" }, Ae = ["disabled"], De = { class: "feed" }, ze = {
  key: 0,
  class: "list-empty plain"
}, He = { class: "card audit-card" }, Je = { class: "card-head" }, Ge = { class: "timeline" }, Re = { class: "tl-body" }, We = { class: "tl-head" }, qe = { class: "item-meta" }, Ke = { class: "tl-detail" }, Qe = {
  key: 0,
  class: "list-empty plain"
}, Xe = /* @__PURE__ */ X({
  __name: "CompanionPage",
  setup(Ye) {
    const o = c({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), x = c(!1), b = c(""), w = c(""), C = c(""), L = c(""), M = c(""), V = c(""), $ = c(""), E = c(!1), N = c(""), r = c({ target: "", motive: "", content: "", preferred_at: "" }), g = c({ daily_limit: 6, per_target_limit: 2 }), S = A(() => Object.entries(o.value.groups || {})), F = A(() => (o.value.proactive?.candidates || []).filter((i) => !["delivered", "cancelled"].includes(i.status))), B = A(() => o.value.proactive?.receipts || []);
    function y(i) {
      w.value = i, setTimeout(() => {
        w.value === i && (w.value = "");
      }, 2e3);
    }
    async function I() {
      x.value = !0, b.value = "";
      try {
        const i = await fetch("/api/life/companion");
        if (!i.ok) throw Error(String(i.status));
        o.value = await i.json();
      } catch (i) {
        b.value = i?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        x.value = !1;
      }
    }
    async function _(i, s) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: i, payload: s }) });
        if (!e.ok) throw Error(await e.text());
        return await I(), await e.json().catch(() => ({}));
      } catch (e) {
        return b.value = e?.message || "操作失败", null;
      }
    }
    async function J() {
      C.value.trim() && (await _("add_agenda", { title: C.value, when: L.value, detail: M.value }), C.value = "", L.value = "", M.value = "");
    }
    async function D(i, s) {
      s.trim() && (await _(i, { content: s }), i === "journal" ? V.value = "" : $.value = "");
    }
    function G(i) {
      return `${Math.round(Math.max(0, Math.min(1, i || 0)) * 100)}%`;
    }
    async function z(i, s) {
      await _("relationship_adjust", { user_id: i, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: s }) && y(`已调整 ${i}`);
    }
    async function R() {
      if (!r.value.target.trim() || !r.value.content.trim()) return;
      await _("proactive_create", { ...r.value }) && (r.value = { target: "", motive: "", content: "", preferred_at: "" }, y("已创建主动候选"));
    }
    async function W(i) {
      await _("proactive_cancel", { id: i, reason: "dashboard_cancel" }), y("已取消候选");
    }
    async function q() {
      await _("proactive_policy", { daily_limit: Number(g.value.daily_limit), per_target_limit: Number(g.value.per_target_limit) }), y("策略已保存");
    }
    const k = c("");
    async function H(i) {
      k.value = i;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: i === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        await I(), y("已由 LIFE 生成");
      } catch (s) {
        b.value = s?.message || "生成失败";
      } finally {
        k.value = "";
      }
    }
    async function K() {
      const i = r.value.target.trim() || "user:owner";
      await _("proactive_suggest", { target: i, hint: r.value.motive }) && (r.value = { target: "", motive: "", content: "", preferred_at: "" }, y("已生成建议候选"));
    }
    function U(i) {
      if (!i) return "";
      const s = new Date(i);
      return Number.isNaN(s.getTime()) ? i : s.toLocaleString();
    }
    return Y(I), (i, s) => (l(), n("main", at, [
      t("div", lt, [
        t("header", nt, [
          s[17] || (s[17] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", it, [
            t("button", {
              class: "btn btn-tonal",
              disabled: x.value,
              onClick: I
            }, a(x.value ? "刷新中…" : "刷新"), 9, ot)
          ])
        ]),
        b.value ? (l(), n("p", rt, a(b.value), 1)) : d("", !0),
        w.value ? (l(), n("p", dt, a(w.value), 1)) : d("", !0),
        t("section", ct, [
          t("article", ut, [
            s[18] || (s[18] = P('<div class="stat-head" data-v-97426f7f><span class="icon-badge tone-1" aria-hidden="true" data-v-97426f7f><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-97426f7f><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-97426f7f></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-97426f7f></path></svg></span><span class="stat-label" data-v-97426f7f>关系对象</span></div>', 1)),
            t("strong", vt, a(o.value.relationships?.length || 0), 1),
            s[19] || (s[19] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", pt, [
            s[20] || (s[20] = P('<div class="stat-head" data-v-97426f7f><span class="icon-badge tone-2" aria-hidden="true" data-v-97426f7f><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-97426f7f><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-97426f7f></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-97426f7f></path></svg></span><span class="stat-label" data-v-97426f7f>活动日程</span></div>', 1)),
            t("strong", _t, a(o.value.agenda?.filter((e) => e.status === "active").length || 0), 1),
            s[21] || (s[21] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", ht, [
            s[22] || (s[22] = P('<div class="stat-head" data-v-97426f7f><span class="icon-badge tone-3" aria-hidden="true" data-v-97426f7f><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-97426f7f><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-97426f7f></path></svg></span><span class="stat-label" data-v-97426f7f>待投递主动行为</span></div>', 1)),
            t("strong", mt, a(F.value.length), 1),
            t("span", ft, "已投递 " + a(B.value.length) + " 次", 1)
          ]),
          t("article", bt, [
            s[23] || (s[23] = P('<div class="stat-head" data-v-97426f7f><span class="icon-badge tone-4" aria-hidden="true" data-v-97426f7f><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-97426f7f><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-97426f7f></path></svg></span><span class="stat-label" data-v-97426f7f>已观察群聊</span></div>', 1)),
            t("strong", gt, a(S.value.length), 1),
            s[24] || (s[24] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", yt, [
          t("article", kt, [
            s[26] || (s[26] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "日程")
            ], -1)),
            t("form", {
              class: "agenda-form",
              onSubmit: T(J, ["prevent"])
            }, [
              h(t("input", {
                "onUpdate:modelValue": s[0] || (s[0] = (e) => C.value = e),
                class: "input",
                placeholder: "日程标题",
                "aria-label": "日程标题"
              }, null, 512), [
                [m, C.value]
              ]),
              h(t("input", {
                "onUpdate:modelValue": s[1] || (s[1] = (e) => L.value = e),
                class: "input",
                placeholder: "时间，例如 2026-09-25 20:00",
                "aria-label": "时间"
              }, null, 512), [
                [m, L.value]
              ]),
              s[25] || (s[25] = t("button", {
                class: "btn btn-primary",
                type: "submit"
              }, "创建候选", -1)),
              h(t("textarea", {
                "onUpdate:modelValue": s[2] || (s[2] = (e) => M.value = e),
                class: "input area",
                placeholder: "说明（可选）"
              }, null, 512), [
                [m, M.value]
              ])
            ], 32),
            s[27] || (s[27] = t("h3", { class: "section-label" }, "待确认候选", -1)),
            t("ul", wt, [
              (l(!0), n(u, null, v(o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", Ct, [
                  t("strong", null, a(e.title), 1),
                  t("span", jt, a(e.when_text) + " · " + a(e.detail || "等待你确认"), 1)
                ]),
                t("div", xt, [
                  t("button", {
                    class: "btn btn-primary btn-sm",
                    onClick: (p) => _("confirm_agenda", { id: e.id })
                  }, "确认", 8, Lt),
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (p) => _("reject_agenda", { id: e.id })
                  }, "拒绝", 8, Mt)
                ])
              ]))), 128)),
              o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? d("", !0) : (l(), n("li", Vt, "没有待确认的日程候选"))
            ]),
            s[28] || (s[28] = t("h3", { class: "section-label" }, "已确认日程", -1)),
            t("ul", $t, [
              (l(!0), n(u, null, v(o.value.agenda, (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("label", Et, [
                  t("input", {
                    checked: e.status === "completed",
                    type: "checkbox",
                    onChange: (p) => _("complete_agenda", { id: e.id })
                  }, null, 40, Nt)
                ]),
                t("div", St, [
                  t("strong", {
                    class: O({ done: e.status === "completed" })
                  }, a(e.title), 3),
                  t("span", Ft, [
                    j(a(e.start_at), 1),
                    e.detail ? (l(), n(u, { key: 0 }, [
                      j(" · " + a(e.detail), 1)
                    ], 64)) : d("", !0)
                  ])
                ])
              ]))), 128)),
              o.value.agenda?.length ? d("", !0) : (l(), n("li", It, "暂无已确认日程"))
            ])
          ]),
          t("article", Ut, [
            t("div", Pt, [
              s[29] || (s[29] = t("h2", { class: "card-title" }, "关系账本", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: s[3] || (s[3] = (e) => E.value = !E.value)
              }, a(E.value ? "隐藏事件" : "查看事件账本"), 1)
            ]),
            t("ul", Tt, [
              (l(!0), n(u, null, v(o.value.relationships, (e) => (l(), n("li", {
                key: e.user_id,
                class: "rel"
              }, [
                t("span", Ot, a((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                t("div", Bt, [
                  t("div", At, [
                    t("strong", null, a(e.user_id), 1),
                    t("span", Dt, a(e.stage), 1)
                  ]),
                  t("div", zt, [
                    t("div", Ht, [
                      t("i", {
                        style: Z({ width: G(e.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, a(Math.round((e.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("span", Jt, "最近互动：" + a(e.last_seen || "暂无"), 1)
                ]),
                t("div", Gt, [
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更亲近",
                    onClick: (p) => z(e.user_id, 0.05)
                  }, "+", 8, Rt),
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更疏远",
                    onClick: (p) => z(e.user_id, -0.05)
                  }, "−", 8, Wt)
                ])
              ]))), 128)),
              o.value.relationships?.length ? d("", !0) : (l(), n("li", qt, "暂无关系记录"))
            ]),
            E.value ? (l(), n("div", Kt, [
              t("h3", Qt, "事件账本（最近 " + a(o.value.relationship_ledger?.length || 0) + " 条）", 1),
              t("ol", Xt, [
                (l(!0), n(u, null, v(o.value.relationship_ledger, (e) => (l(), n("li", {
                  key: e.id
                }, [
                  t("time", null, a(U(e.created_at)), 1),
                  t("p", null, [
                    t("strong", null, a(e.user_id), 1),
                    j(" · " + a(e.event_key) + " ", 1),
                    t("span", {
                      class: O(e.delta >= 0 ? "pos" : "neg")
                    }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                    j(" · " + a(e.reason) + " (" + a(e.channel) + ")", 1)
                  ])
                ]))), 128)),
                o.value.relationship_ledger?.length ? d("", !0) : (l(), n("li", Yt, "暂无关系事件"))
              ])
            ])) : d("", !0)
          ]),
          t("article", Zt, [
            t("div", te, [
              s[30] || (s[30] = t("h2", { class: "card-title" }, "主动行为", -1)),
              t("span", ee, "待投递 " + a(F.value.length), 1)
            ]),
            t("div", { class: "toolbar-inline" }, [
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: K
              }, "让 LIFE 建议一条")
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: T(R, ["prevent"])
            }, [
              h(t("input", {
                "onUpdate:modelValue": s[4] || (s[4] = (e) => r.value.target = e),
                class: "input",
                placeholder: "对象（user_id / 会话）",
                "aria-label": "主动对象"
              }, null, 512), [
                [m, r.value.target]
              ]),
              h(t("input", {
                "onUpdate:modelValue": s[5] || (s[5] = (e) => r.value.motive = e),
                class: "input",
                placeholder: "动机，如 care / reminder",
                "aria-label": "动机"
              }, null, 512), [
                [m, r.value.motive]
              ]),
              h(t("input", {
                "onUpdate:modelValue": s[6] || (s[6] = (e) => r.value.preferred_at = e),
                class: "input",
                placeholder: "期望时间（可选，ISO）",
                "aria-label": "期望时间"
              }, null, 512), [
                [m, r.value.preferred_at]
              ]),
              h(t("textarea", {
                "onUpdate:modelValue": s[7] || (s[7] = (e) => r.value.content = e),
                class: "input area",
                placeholder: "想说的内容…"
              }, null, 512), [
                [m, r.value.content]
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !r.value.target.trim() || !r.value.content.trim()
              }, "创建候选", 8, se)
            ], 32),
            s[33] || (s[33] = t("h3", { class: "section-label" }, "候选队列", -1)),
            t("ul", ae, [
              (l(!0), n(u, null, v(F.value, (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", le, [
                  t("strong", null, a(e.target) + " · " + a(e.motive), 1),
                  t("span", ne, a(e.content), 1),
                  t("span", ie, "状态 " + a(e.status) + " · " + a(U(e.created_at)), 1)
                ]),
                t("div", oe, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (p) => W(e.id)
                  }, "取消", 8, re)
                ])
              ]))), 128)),
              F.value.length ? d("", !0) : (l(), n("li", de, "没有待投递候选"))
            ]),
            s[34] || (s[34] = t("h3", { class: "section-label" }, "配额策略", -1)),
            t("div", ce, [
              t("label", ue, [
                s[31] || (s[31] = t("span", null, "每日上限", -1)),
                h(t("input", {
                  "onUpdate:modelValue": s[8] || (s[8] = (e) => g.value.daily_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    m,
                    g.value.daily_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("label", ve, [
                s[32] || (s[32] = t("span", null, "单人上限", -1)),
                h(t("input", {
                  "onUpdate:modelValue": s[9] || (s[9] = (e) => g.value.per_target_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    m,
                    g.value.per_target_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: q
              }, "保存策略")
            ]),
            s[35] || (s[35] = t("h3", { class: "section-label" }, "投递记录", -1)),
            t("ol", pe, [
              (l(!0), n(u, null, v(B.value, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, a(U(e.created_at)), 1),
                t("p", null, a(e.phase) + " · " + a(e.content), 1)
              ]))), 128)),
              B.value.length ? d("", !0) : (l(), n("li", _e, "还没有主动投递记录"))
            ])
          ]),
          t("article", he, [
            s[36] || (s[36] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "成长中的性格")
            ], -1)),
            t("ul", me, [
              (l(!0), n(u, null, v(o.value.persona_evolution, (e) => (l(), n("li", {
                key: e.id,
                class: "item trait-item"
              }, [
                t("div", fe, [
                  t("strong", null, a(e.trait), 1),
                  t("span", be, "支持 " + a(e.support_count) + " 次 · 置信度 " + a(Math.round((e.confidence || 0) * 100)) + "%", 1)
                ]),
                t("span", ge, a(e.value), 1)
              ]))), 128)),
              o.value.persona_evolution?.length ? d("", !0) : (l(), n("li", ye, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
            ])
          ]),
          t("article", ke, [
            t("div", we, [
              s[37] || (s[37] = t("h2", { class: "card-title" }, "群聊观察", -1)),
              t("span", Ce, a(S.value.length), 1)
            ]),
            t("ul", je, [
              (l(!0), n(u, null, v(S.value, ([e, p]) => (l(), n("li", {
                key: e,
                class: "item group-item"
              }, [
                t("div", xe, [
                  t("strong", null, a(e), 1),
                  t("span", Le, "情绪 " + a(p.mood || "—") + " · " + a(p.messages?.length || 0) + " 条观察 · " + a(p.topics?.length || 0) + " 个话题", 1),
                  N.value === e ? (l(), n("div", Me, [
                    p.topics?.length ? (l(), n("div", Ve, [
                      (l(!0), n(u, null, v(p.topics, (f) => (l(), n("span", {
                        key: f.topic,
                        class: "chip muted"
                      }, a(f.topic) + " · " + a(Math.round(f.score)), 1))), 128))
                    ])) : d("", !0),
                    t("ol", $e, [
                      (l(!0), n(u, null, v(p.messages, (f, Q) => (l(), n("li", { key: Q }, [
                        t("time", null, a(U(f.created_at)), 1),
                        t("p", null, [
                          t("strong", null, a(f.user_id), 1),
                          j("：" + a(f.content), 1)
                        ])
                      ]))), 128))
                    ])
                  ])) : d("", !0)
                ]),
                t("div", Ee, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: (f) => N.value = N.value === e ? "" : e
                  }, a(N.value === e ? "收起" : "展开"), 9, Ne)
                ])
              ]))), 128)),
              S.value.length ? d("", !0) : (l(), n("li", Se, "群聊观察尚未启用或没有消息。"))
            ])
          ]),
          t("article", Fe, [
            t("div", Ie, [
              s[38] || (s[38] = t("h2", { class: "card-title" }, "日记", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: k.value === "journal",
                onClick: s[10] || (s[10] = (e) => H("journal"))
              }, a(k.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, Ue)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: s[12] || (s[12] = T((e) => D("journal", V.value), ["prevent"]))
            }, [
              h(t("textarea", {
                "onUpdate:modelValue": s[11] || (s[11] = (e) => V.value = e),
                class: "input area",
                placeholder: "记录 LIFE 的日记…"
              }, null, 512), [
                [m, V.value]
              ]),
              s[39] || (s[39] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "写入日记", -1))
            ], 32),
            t("ol", Pe, [
              (l(!0), n(u, null, v(o.value.journal, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, a(e.at), 1),
                t("p", null, a(e.content), 1)
              ]))), 128)),
              o.value.journal?.length ? d("", !0) : (l(), n("li", Te, "还没有日记"))
            ])
          ]),
          t("article", Oe, [
            t("div", Be, [
              s[40] || (s[40] = t("h2", { class: "card-title" }, "梦境", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: k.value === "dream",
                onClick: s[13] || (s[13] = (e) => H("dream"))
              }, a(k.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, Ae)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: s[15] || (s[15] = T((e) => D("dream", $.value), ["prevent"]))
            }, [
              h(t("textarea", {
                "onUpdate:modelValue": s[14] || (s[14] = (e) => $.value = e),
                class: "input area",
                placeholder: "记录一个梦境或睡眠反思…"
              }, null, 512), [
                [m, $.value]
              ]),
              s[41] || (s[41] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "记录梦境", -1))
            ], 32),
            t("ol", De, [
              (l(!0), n(u, null, v(o.value.dreams, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, a(e.at), 1),
                t("p", null, a(e.content), 1)
              ]))), 128)),
              o.value.dreams?.length ? d("", !0) : (l(), n("li", ze, "还没有梦境记录"))
            ])
          ])
        ]),
        t("article", He, [
          t("div", Je, [
            s[42] || (s[42] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: s[16] || (s[16] = (e) => _("memory_maintenance", {}))
            }, "执行记忆维护与备份")
          ]),
          t("ol", Ge, [
            (l(!0), n(u, null, v(o.value.audit, (e) => (l(), n("li", {
              key: e.at + e.kind
            }, [
              t("span", {
                class: O(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                "aria-hidden": "true"
              }, null, 2),
              t("div", Re, [
                t("div", We, [
                  t("strong", null, a(e.kind), 1),
                  t("span", {
                    class: O(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                  }, a(e.outcome), 3),
                  t("time", null, a(e.at), 1)
                ]),
                t("p", qe, a(e.target), 1),
                t("p", Ke, a(e.detail), 1)
              ])
            ]))), 128)),
            o.value.audit?.length ? d("", !0) : (l(), n("li", Qe, "暂无审计记录"))
          ])
        ])
      ]),
      tt(et)
    ]));
  }
}), es = /* @__PURE__ */ st(Xe, [["__scopeId", "data-v-97426f7f"]]);
export {
  es as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-97426f7f]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-97426f7f]{max-width:1180px;margin:0 auto}.page-header[data-v-97426f7f]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-97426f7f]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-97426f7f]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-97426f7f]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-97426f7f]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-97426f7f]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-97426f7f]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-97426f7f]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-97426f7f]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-97426f7f]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-97426f7f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-97426f7f]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-97426f7f]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-97426f7f]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-97426f7f]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-97426f7f]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-97426f7f]{display:flex;align-items:center;gap:10px}.stat-label[data-v-97426f7f]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-97426f7f]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-97426f7f]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-97426f7f]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-97426f7f]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-97426f7f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-97426f7f]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-97426f7f]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-97426f7f]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-97426f7f]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-97426f7f]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-97426f7f]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-97426f7f]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-97426f7f]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-97426f7f]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-97426f7f]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-97426f7f]{background:#fff1dc;color:#7a4400}.input[data-v-97426f7f]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-97426f7f]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-97426f7f]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-97426f7f]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-97426f7f]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-97426f7f]{grid-column:1/-1}.stack-form[data-v-97426f7f]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-97426f7f]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-97426f7f]{align-self:flex-start}.item-list[data-v-97426f7f],.rel-list[data-v-97426f7f],.feed[data-v-97426f7f],.timeline[data-v-97426f7f]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-97426f7f]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-97426f7f]{align-items:flex-start}.item[data-v-97426f7f]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-97426f7f]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-97426f7f]{font-size:14px;font-weight:600}.item-main strong.done[data-v-97426f7f]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-97426f7f]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-97426f7f]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-97426f7f]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-97426f7f]{background:transparent;border:0}.check-label[data-v-97426f7f]{display:flex;align-items:center}.check-label input[data-v-97426f7f]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-97426f7f]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-97426f7f]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-97426f7f]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-97426f7f]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-97426f7f],.rel-meter[data-v-97426f7f]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-97426f7f]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-97426f7f]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-97426f7f]{font-size:12px}.rel-actions[data-v-97426f7f]{display:flex;gap:4px}.ledger[data-v-97426f7f]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-97426f7f]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-97426f7f]{padding:8px 12px}.feed time[data-v-97426f7f],.timeline time[data-v-97426f7f]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-97426f7f]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-97426f7f]{color:var(--md-success);font-weight:700}.neg[data-v-97426f7f]{color:var(--md-error);font-weight:700}.policy[data-v-97426f7f]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-97426f7f]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-97426f7f]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-97426f7f]{margin-top:6px}.audit-card[data-v-97426f7f]{margin-bottom:var(--space-lg)}.timeline[data-v-97426f7f]{position:relative}.timeline li[data-v-97426f7f]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-97426f7f]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-97426f7f]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-97426f7f]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-97426f7f]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-97426f7f]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-97426f7f]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-97426f7f]{font-size:13.5px;font-weight:650}.tl-detail[data-v-97426f7f]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-97426f7f]{grid-template-columns:repeat(2,1fr)}.grid[data-v-97426f7f],.agenda-form[data-v-97426f7f]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-97426f7f]{padding:var(--space-lg)}.header-actions[data-v-97426f7f]{padding-top:0}}.page[data-v-44679b4d]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-44679b4d]{max-width:1180px;margin:0 auto}.page-header[data-v-44679b4d]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-44679b4d]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-44679b4d]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-44679b4d]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-44679b4d]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-44679b4d]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-44679b4d]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-44679b4d]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-44679b4d]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-44679b4d]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-44679b4d]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-44679b4d]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-44679b4d]{display:flex;align-items:center;gap:10px}.stat-label[data-v-44679b4d]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-44679b4d]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-44679b4d]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-44679b4d]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-44679b4d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-44679b4d]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-44679b4d]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-44679b4d]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-44679b4d]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-44679b4d]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-44679b4d]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-44679b4d]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-44679b4d]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-44679b4d]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-44679b4d]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-44679b4d]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-44679b4d]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-44679b4d]{background:#fff1dc;color:#7a4400}.error-banner[data-v-44679b4d]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-44679b4d]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-44679b4d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-44679b4d]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-44679b4d]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-44679b4d]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-44679b4d]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-44679b4d]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-44679b4d]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-44679b4d]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-44679b4d]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-44679b4d]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-44679b4d]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-44679b4d]{background:var(--md-primary)}.fill-secondary[data-v-44679b4d]{background:var(--md-secondary,#536255)}.meter-text[data-v-44679b4d]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-44679b4d]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-44679b4d]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-44679b4d]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-44679b4d]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-44679b4d]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-44679b4d]{display:flex;gap:8px;justify-content:flex-end}.empty-state[data-v-44679b4d]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-44679b4d]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-44679b4d]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-44679b4d]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-44679b4d]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-44679b4d]{display:flex;flex-direction:column;gap:10px}.input[data-v-44679b4d]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-44679b4d]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-44679b4d]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-44679b4d],.reflection-list[data-v-44679b4d]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-44679b4d]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-44679b4d]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-44679b4d]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-44679b4d]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-44679b4d]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-44679b4d]{margin-top:var(--space-lg)}.reader pre[data-v-44679b4d]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-44679b4d]{font-size:14px;font-weight:600}.reflection details[data-v-44679b4d]{margin-top:6px}.reflection summary[data-v-44679b4d]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-44679b4d]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-44679b4d]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-44679b4d]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-44679b4d]{padding:var(--space-lg)}.header-actions[data-v-44679b4d]{padding-top:0}.memory-list[data-v-44679b4d]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
