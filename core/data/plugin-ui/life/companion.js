import { defineComponent as et, ref as c, computed as z, onMounted as at, openBlock as n, createElementBlock as i, createElementVNode as t, toDisplayString as s, createCommentVNode as r, createStaticVNode as U, withModifiers as B, withDirectives as h, vModelText as m, Fragment as u, renderList as p, normalizeClass as A, createTextVNode as x, normalizeStyle as st, createVNode as lt } from "vue";
import { _ as nt, a as it } from "./assets/_plugin-vue_export-helper-CihezfpQ.js";
const ot = { class: "page" }, dt = { class: "page-inner" }, rt = { class: "page-header" }, ct = { class: "header-actions" }, ut = ["disabled"], pt = ["disabled"], vt = {
  key: 0,
  class: "error-banner"
}, _t = {
  key: 1,
  class: "notice"
}, ht = { class: "stat-grid" }, mt = { class: "stat-card" }, bt = { class: "stat-value" }, gt = { class: "stat-card" }, yt = { class: "stat-value" }, ft = { class: "stat-card" }, kt = { class: "stat-value" }, wt = { class: "stat-hint" }, Ct = { class: "stat-card" }, jt = { class: "stat-value" }, xt = { class: "grid" }, $t = { class: "card" }, Et = { class: "item-list" }, Lt = { class: "item-main" }, Nt = { class: "item-meta" }, St = { class: "item-actions" }, Mt = ["onClick"], Vt = ["onClick"], Tt = {
  key: 0,
  class: "list-empty"
}, Ft = { class: "item-list" }, It = { class: "check-label" }, Ot = ["checked", "onChange"], Pt = { class: "item-main" }, Ut = { class: "item-meta" }, Bt = {
  key: 0,
  class: "list-empty"
}, At = { class: "card" }, Dt = { class: "card-head" }, zt = { class: "rel-list" }, Jt = { class: "avatar" }, Ht = { class: "rel-main" }, Gt = { class: "rel-top" }, Rt = { class: "chip" }, Wt = { class: "rel-meter" }, qt = { class: "meter-bar" }, Kt = { class: "item-meta" }, Qt = { class: "rel-actions" }, Xt = ["onClick"], Yt = ["onClick"], Zt = {
  key: 0,
  class: "list-empty"
}, te = {
  key: 0,
  class: "ledger"
}, ee = { class: "section-label" }, ae = { class: "feed" }, se = {
  key: 0,
  class: "list-empty plain"
}, le = { class: "card" }, ne = { class: "card-head" }, ie = { class: "chip muted" }, oe = { class: "toolbar-inline" }, de = ["disabled"], re = ["disabled"], ce = { class: "item-list" }, ue = { class: "item-main" }, pe = { class: "item-meta" }, ve = { class: "item-meta" }, _e = { class: "item-actions" }, he = ["onClick"], me = {
  key: 0,
  class: "list-empty"
}, be = { class: "policy" }, ge = { class: "select" }, ye = { class: "select" }, fe = { class: "feed" }, ke = {
  key: 0,
  class: "list-empty plain"
}, we = { class: "card" }, Ce = { class: "item-list" }, je = { class: "item-main" }, xe = { class: "item-meta" }, $e = { class: "chip" }, Ee = {
  key: 0,
  class: "list-empty"
}, Le = { class: "card" }, Ne = { class: "card-head" }, Se = { class: "chip muted" }, Me = { class: "item-list" }, Ve = { class: "item-main" }, Te = { class: "item-meta" }, Fe = {
  key: 0,
  class: "group-detail"
}, Ie = {
  key: 0,
  class: "topics"
}, Oe = { class: "feed compact" }, Pe = { class: "item-actions" }, Ue = ["onClick"], Be = {
  key: 0,
  class: "list-empty"
}, Ae = { class: "card" }, De = { class: "card-head" }, ze = ["disabled"], Je = { class: "feed" }, He = {
  key: 0,
  class: "list-empty plain"
}, Ge = { class: "card" }, Re = { class: "card-head" }, We = ["disabled"], qe = { class: "feed" }, Ke = {
  key: 0,
  class: "list-empty plain"
}, Qe = { class: "card audit-card" }, Xe = { class: "card-head" }, Ye = { class: "timeline" }, Ze = { class: "tl-body" }, ta = { class: "tl-head" }, ea = { class: "item-meta" }, aa = { class: "tl-detail" }, sa = {
  key: 0,
  class: "list-empty plain"
}, la = /* @__PURE__ */ et({
  __name: "CompanionPage",
  setup(na) {
    const o = c({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), $ = c(!1), b = c(""), C = c(""), j = c(""), E = c(""), L = c(""), N = c(""), S = c(""), M = c(!1), V = c(""), d = c({ target: "", motive: "", content: "", preferred_at: "" }), f = c({ daily_limit: 6, per_target_limit: 2 }), T = z(() => Object.entries(o.value.groups || {})), F = z(() => (o.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), D = z(() => o.value.proactive?.receipts || []);
    function g(l) {
      C.value = l, setTimeout(() => {
        C.value === l && (C.value = "");
      }, 2e3);
    }
    async function k() {
      $.value = !0, b.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        o.value = await l.json();
      } catch (l) {
        b.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        $.value = !1;
      }
    }
    async function _(l, a) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: a }) });
        if (!e.ok) throw Error(await e.text());
        return await k(), await e.json().catch(() => ({}));
      } catch (e) {
        return b.value = e?.message || "操作失败", null;
      }
    }
    async function R() {
      j.value.trim() && (await _("add_agenda", { title: j.value, when: E.value, detail: L.value }), j.value = "", E.value = "", L.value = "");
    }
    async function J(l, a) {
      a.trim() && (await _(l, { content: a }), l === "journal" ? N.value = "" : S.value = "");
    }
    function W(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    async function H(l, a) {
      await _("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: a }) && g(`已调整 ${l}`);
    }
    async function q() {
      if (!d.value.target.trim() || !d.value.content.trim()) return;
      await _("proactive_create", { ...d.value }) && (d.value = { target: "", motive: "", content: "", preferred_at: "" }, g("已创建主动候选"));
    }
    async function K(l) {
      await _("proactive_cancel", { id: l, reason: "dashboard_cancel" }), g("已取消候选");
    }
    async function Q() {
      await _("proactive_policy", { daily_limit: Number(f.value.daily_limit), per_target_limit: Number(f.value.per_target_limit) }), g("策略已保存");
    }
    const w = c("");
    async function G(l) {
      w.value = l;
      try {
        const a = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!a.ok) throw Error(await a.text());
        await k(), g("已由 LIFE 生成");
      } catch (a) {
        b.value = a?.message || "生成失败";
      } finally {
        w.value = "";
      }
    }
    async function X() {
      const l = d.value.target.trim() || "user:owner";
      await _("proactive_suggest", { target: l, hint: d.value.motive }) && (d.value = { target: "", motive: "", content: "", preferred_at: "" }, g("已生成建议候选"));
    }
    const I = c(!1);
    async function Y() {
      I.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const a = await l.json();
        await k(), g(a?.skipped ? `本次跳过：${a.skipped}` : `已投递 ${a.delivered || 0} 条 · 拦截 ${a.blocked || 0} 条`);
      } catch (l) {
        b.value = l?.message || "投递失败";
      } finally {
        I.value = !1;
      }
    }
    const O = c(!1);
    async function Z() {
      O.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const a = await l.json();
        await k();
        const e = a?.applied;
        g(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (l) {
        b.value = l?.message || "规划失败";
      } finally {
        O.value = !1;
      }
    }
    function P(l) {
      if (!l) return "";
      const a = new Date(l);
      return Number.isNaN(a.getTime()) ? l : a.toLocaleString();
    }
    return at(k), (l, a) => (n(), i("main", ot, [
      t("div", dt, [
        t("header", rt, [
          a[17] || (a[17] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", ct, [
            t("button", {
              class: "btn btn-primary",
              disabled: O.value,
              onClick: Z
            }, s(O.value ? "规划中…" : "让 LIFE 规划"), 9, ut),
            t("button", {
              class: "btn btn-tonal",
              disabled: $.value,
              onClick: k
            }, s($.value ? "刷新中…" : "刷新"), 9, pt)
          ])
        ]),
        b.value ? (n(), i("p", vt, s(b.value), 1)) : r("", !0),
        C.value ? (n(), i("p", _t, s(C.value), 1)) : r("", !0),
        t("section", ht, [
          t("article", mt, [
            a[18] || (a[18] = U('<div class="stat-head" data-v-cc3d3a63><span class="icon-badge tone-1" aria-hidden="true" data-v-cc3d3a63><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-cc3d3a63><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-cc3d3a63></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-cc3d3a63></path></svg></span><span class="stat-label" data-v-cc3d3a63>关系对象</span></div>', 1)),
            t("strong", bt, s(o.value.relationships?.length || 0), 1),
            a[19] || (a[19] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", gt, [
            a[20] || (a[20] = U('<div class="stat-head" data-v-cc3d3a63><span class="icon-badge tone-2" aria-hidden="true" data-v-cc3d3a63><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-cc3d3a63><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-cc3d3a63></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-cc3d3a63></path></svg></span><span class="stat-label" data-v-cc3d3a63>活动日程</span></div>', 1)),
            t("strong", yt, s(o.value.agenda?.filter((e) => e.status === "active").length || 0), 1),
            a[21] || (a[21] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", ft, [
            a[22] || (a[22] = U('<div class="stat-head" data-v-cc3d3a63><span class="icon-badge tone-3" aria-hidden="true" data-v-cc3d3a63><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-cc3d3a63><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-cc3d3a63></path></svg></span><span class="stat-label" data-v-cc3d3a63>待投递主动行为</span></div>', 1)),
            t("strong", kt, s(F.value.length), 1),
            t("span", wt, "已投递 " + s(D.value.length) + " 次", 1)
          ]),
          t("article", Ct, [
            a[23] || (a[23] = U('<div class="stat-head" data-v-cc3d3a63><span class="icon-badge tone-4" aria-hidden="true" data-v-cc3d3a63><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-cc3d3a63><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-cc3d3a63></path></svg></span><span class="stat-label" data-v-cc3d3a63>已观察群聊</span></div>', 1)),
            t("strong", jt, s(T.value.length), 1),
            a[24] || (a[24] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", xt, [
          t("article", $t, [
            a[26] || (a[26] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "日程")
            ], -1)),
            t("form", {
              class: "agenda-form",
              onSubmit: B(R, ["prevent"])
            }, [
              h(t("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (e) => j.value = e),
                class: "input",
                placeholder: "日程标题",
                "aria-label": "日程标题"
              }, null, 512), [
                [m, j.value]
              ]),
              h(t("input", {
                "onUpdate:modelValue": a[1] || (a[1] = (e) => E.value = e),
                class: "input",
                placeholder: "时间，例如 2026-09-25 20:00",
                "aria-label": "时间"
              }, null, 512), [
                [m, E.value]
              ]),
              a[25] || (a[25] = t("button", {
                class: "btn btn-primary",
                type: "submit"
              }, "创建候选", -1)),
              h(t("textarea", {
                "onUpdate:modelValue": a[2] || (a[2] = (e) => L.value = e),
                class: "input area",
                placeholder: "说明（可选）"
              }, null, 512), [
                [m, L.value]
              ])
            ], 32),
            a[27] || (a[27] = t("h3", { class: "section-label" }, "待确认候选", -1)),
            t("ul", Et, [
              (n(!0), i(u, null, p(o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), i("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", Lt, [
                  t("strong", null, s(e.title), 1),
                  t("span", Nt, s(e.when_text) + " · " + s(e.detail || "等待你确认"), 1)
                ]),
                t("div", St, [
                  t("button", {
                    class: "btn btn-primary btn-sm",
                    onClick: (v) => _("confirm_agenda", { id: e.id })
                  }, "确认", 8, Mt),
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (v) => _("reject_agenda", { id: e.id })
                  }, "拒绝", 8, Vt)
                ])
              ]))), 128)),
              o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? r("", !0) : (n(), i("li", Tt, "没有待确认的日程候选"))
            ]),
            a[28] || (a[28] = t("h3", { class: "section-label" }, "已确认日程", -1)),
            t("ul", Ft, [
              (n(!0), i(u, null, p(o.value.agenda, (e) => (n(), i("li", {
                key: e.id,
                class: "item"
              }, [
                t("label", It, [
                  t("input", {
                    checked: e.status === "completed",
                    type: "checkbox",
                    onChange: (v) => _("complete_agenda", { id: e.id })
                  }, null, 40, Ot)
                ]),
                t("div", Pt, [
                  t("strong", {
                    class: A({ done: e.status === "completed" })
                  }, s(e.title), 3),
                  t("span", Ut, [
                    x(s(e.start_at), 1),
                    e.detail ? (n(), i(u, { key: 0 }, [
                      x(" · " + s(e.detail), 1)
                    ], 64)) : r("", !0)
                  ])
                ])
              ]))), 128)),
              o.value.agenda?.length ? r("", !0) : (n(), i("li", Bt, "暂无已确认日程"))
            ])
          ]),
          t("article", At, [
            t("div", Dt, [
              a[29] || (a[29] = t("h2", { class: "card-title" }, "关系账本", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: a[3] || (a[3] = (e) => M.value = !M.value)
              }, s(M.value ? "隐藏事件" : "查看事件账本"), 1)
            ]),
            t("ul", zt, [
              (n(!0), i(u, null, p(o.value.relationships, (e) => (n(), i("li", {
                key: e.user_id,
                class: "rel"
              }, [
                t("span", Jt, s((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                t("div", Ht, [
                  t("div", Gt, [
                    t("strong", null, s(e.user_id), 1),
                    t("span", Rt, s(e.stage), 1)
                  ]),
                  t("div", Wt, [
                    t("div", qt, [
                      t("i", {
                        style: st({ width: W(e.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, s(Math.round((e.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("span", Kt, "最近互动：" + s(e.last_seen || "暂无"), 1)
                ]),
                t("div", Qt, [
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更亲近",
                    onClick: (v) => H(e.user_id, 0.05)
                  }, "+", 8, Xt),
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更疏远",
                    onClick: (v) => H(e.user_id, -0.05)
                  }, "−", 8, Yt)
                ])
              ]))), 128)),
              o.value.relationships?.length ? r("", !0) : (n(), i("li", Zt, "暂无关系记录"))
            ]),
            M.value ? (n(), i("div", te, [
              t("h3", ee, "事件账本（最近 " + s(o.value.relationship_ledger?.length || 0) + " 条）", 1),
              t("ol", ae, [
                (n(!0), i(u, null, p(o.value.relationship_ledger, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, s(P(e.created_at)), 1),
                  t("p", null, [
                    t("strong", null, s(e.user_id), 1),
                    x(" · " + s(e.event_key) + " ", 1),
                    t("span", {
                      class: A(e.delta >= 0 ? "pos" : "neg")
                    }, s(e.delta >= 0 ? "+" : "") + s(e.delta), 3),
                    x(" · " + s(e.reason) + " (" + s(e.channel) + ")", 1)
                  ])
                ]))), 128)),
                o.value.relationship_ledger?.length ? r("", !0) : (n(), i("li", se, "暂无关系事件"))
              ])
            ])) : r("", !0)
          ]),
          t("article", le, [
            t("div", ne, [
              a[30] || (a[30] = t("h2", { class: "card-title" }, "主动行为", -1)),
              t("span", ie, "待投递 " + s(F.value.length), 1)
            ]),
            t("div", oe, [
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: X
              }, "让 LIFE 建议一条"),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: I.value,
                onClick: Y
              }, s(I.value ? "检查中…" : "立即检查投递"), 9, de)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: B(q, ["prevent"])
            }, [
              h(t("input", {
                "onUpdate:modelValue": a[4] || (a[4] = (e) => d.value.target = e),
                class: "input",
                placeholder: "对象（user_id / 会话）",
                "aria-label": "主动对象"
              }, null, 512), [
                [m, d.value.target]
              ]),
              h(t("input", {
                "onUpdate:modelValue": a[5] || (a[5] = (e) => d.value.motive = e),
                class: "input",
                placeholder: "动机，如 care / reminder",
                "aria-label": "动机"
              }, null, 512), [
                [m, d.value.motive]
              ]),
              h(t("input", {
                "onUpdate:modelValue": a[6] || (a[6] = (e) => d.value.preferred_at = e),
                class: "input",
                placeholder: "期望时间（可选，ISO）",
                "aria-label": "期望时间"
              }, null, 512), [
                [m, d.value.preferred_at]
              ]),
              h(t("textarea", {
                "onUpdate:modelValue": a[7] || (a[7] = (e) => d.value.content = e),
                class: "input area",
                placeholder: "想说的内容…"
              }, null, 512), [
                [m, d.value.content]
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !d.value.target.trim() || !d.value.content.trim()
              }, "创建候选", 8, re)
            ], 32),
            a[33] || (a[33] = t("h3", { class: "section-label" }, "候选队列", -1)),
            t("ul", ce, [
              (n(!0), i(u, null, p(F.value, (e) => (n(), i("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", ue, [
                  t("strong", null, s(e.target) + " · " + s(e.motive), 1),
                  t("span", pe, s(e.content), 1),
                  t("span", ve, "状态 " + s(e.status) + " · " + s(P(e.created_at)), 1)
                ]),
                t("div", _e, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (v) => K(e.id)
                  }, "取消", 8, he)
                ])
              ]))), 128)),
              F.value.length ? r("", !0) : (n(), i("li", me, "没有待投递候选"))
            ]),
            a[34] || (a[34] = t("h3", { class: "section-label" }, "配额策略", -1)),
            t("div", be, [
              t("label", ge, [
                a[31] || (a[31] = t("span", null, "每日上限", -1)),
                h(t("input", {
                  "onUpdate:modelValue": a[8] || (a[8] = (e) => f.value.daily_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    m,
                    f.value.daily_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("label", ye, [
                a[32] || (a[32] = t("span", null, "单人上限", -1)),
                h(t("input", {
                  "onUpdate:modelValue": a[9] || (a[9] = (e) => f.value.per_target_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    m,
                    f.value.per_target_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: Q
              }, "保存策略")
            ]),
            a[35] || (a[35] = t("h3", { class: "section-label" }, "投递记录", -1)),
            t("ol", fe, [
              (n(!0), i(u, null, p(D.value, (e) => (n(), i("li", {
                key: e.id
              }, [
                t("time", null, s(P(e.created_at)), 1),
                t("p", null, s(e.phase) + " · " + s(e.content), 1)
              ]))), 128)),
              D.value.length ? r("", !0) : (n(), i("li", ke, "还没有主动投递记录"))
            ])
          ]),
          t("article", we, [
            a[36] || (a[36] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "成长中的性格")
            ], -1)),
            t("ul", Ce, [
              (n(!0), i(u, null, p(o.value.persona_evolution, (e) => (n(), i("li", {
                key: e.id,
                class: "item trait-item"
              }, [
                t("div", je, [
                  t("strong", null, s(e.trait), 1),
                  t("span", xe, "支持 " + s(e.support_count) + " 次 · 置信度 " + s(Math.round((e.confidence || 0) * 100)) + "%", 1)
                ]),
                t("span", $e, s(e.value), 1)
              ]))), 128)),
              o.value.persona_evolution?.length ? r("", !0) : (n(), i("li", Ee, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
            ])
          ]),
          t("article", Le, [
            t("div", Ne, [
              a[37] || (a[37] = t("h2", { class: "card-title" }, "群聊观察", -1)),
              t("span", Se, s(T.value.length), 1)
            ]),
            t("ul", Me, [
              (n(!0), i(u, null, p(T.value, ([e, v]) => (n(), i("li", {
                key: e,
                class: "item group-item"
              }, [
                t("div", Ve, [
                  t("strong", null, s(e), 1),
                  t("span", Te, "情绪 " + s(v.mood || "—") + " · " + s(v.messages?.length || 0) + " 条观察 · " + s(v.topics?.length || 0) + " 个话题", 1),
                  V.value === e ? (n(), i("div", Fe, [
                    v.topics?.length ? (n(), i("div", Ie, [
                      (n(!0), i(u, null, p(v.topics, (y) => (n(), i("span", {
                        key: y.topic,
                        class: "chip muted"
                      }, s(y.topic) + " · " + s(Math.round(y.score)), 1))), 128))
                    ])) : r("", !0),
                    t("ol", Oe, [
                      (n(!0), i(u, null, p(v.messages, (y, tt) => (n(), i("li", { key: tt }, [
                        t("time", null, s(P(y.created_at)), 1),
                        t("p", null, [
                          t("strong", null, s(y.user_id), 1),
                          x("：" + s(y.content), 1)
                        ])
                      ]))), 128))
                    ])
                  ])) : r("", !0)
                ]),
                t("div", Pe, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: (y) => V.value = V.value === e ? "" : e
                  }, s(V.value === e ? "收起" : "展开"), 9, Ue)
                ])
              ]))), 128)),
              T.value.length ? r("", !0) : (n(), i("li", Be, "群聊观察尚未启用或没有消息。"))
            ])
          ]),
          t("article", Ae, [
            t("div", De, [
              a[38] || (a[38] = t("h2", { class: "card-title" }, "日记", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: w.value === "journal",
                onClick: a[10] || (a[10] = (e) => G("journal"))
              }, s(w.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, ze)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: a[12] || (a[12] = B((e) => J("journal", N.value), ["prevent"]))
            }, [
              h(t("textarea", {
                "onUpdate:modelValue": a[11] || (a[11] = (e) => N.value = e),
                class: "input area",
                placeholder: "记录 LIFE 的日记…"
              }, null, 512), [
                [m, N.value]
              ]),
              a[39] || (a[39] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "写入日记", -1))
            ], 32),
            t("ol", Je, [
              (n(!0), i(u, null, p(o.value.journal, (e) => (n(), i("li", {
                key: e.id
              }, [
                t("time", null, s(e.at), 1),
                t("p", null, s(e.content), 1)
              ]))), 128)),
              o.value.journal?.length ? r("", !0) : (n(), i("li", He, "还没有日记"))
            ])
          ]),
          t("article", Ge, [
            t("div", Re, [
              a[40] || (a[40] = t("h2", { class: "card-title" }, "梦境", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: w.value === "dream",
                onClick: a[13] || (a[13] = (e) => G("dream"))
              }, s(w.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, We)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: a[15] || (a[15] = B((e) => J("dream", S.value), ["prevent"]))
            }, [
              h(t("textarea", {
                "onUpdate:modelValue": a[14] || (a[14] = (e) => S.value = e),
                class: "input area",
                placeholder: "记录一个梦境或睡眠反思…"
              }, null, 512), [
                [m, S.value]
              ]),
              a[41] || (a[41] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "记录梦境", -1))
            ], 32),
            t("ol", qe, [
              (n(!0), i(u, null, p(o.value.dreams, (e) => (n(), i("li", {
                key: e.id
              }, [
                t("time", null, s(e.at), 1),
                t("p", null, s(e.content), 1)
              ]))), 128)),
              o.value.dreams?.length ? r("", !0) : (n(), i("li", Ke, "还没有梦境记录"))
            ])
          ])
        ]),
        t("article", Qe, [
          t("div", Xe, [
            a[42] || (a[42] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: a[16] || (a[16] = (e) => _("memory_maintenance", {}))
            }, "执行记忆维护与备份")
          ]),
          t("ol", Ye, [
            (n(!0), i(u, null, p(o.value.audit, (e) => (n(), i("li", {
              key: e.at + e.kind
            }, [
              t("span", {
                class: A(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                "aria-hidden": "true"
              }, null, 2),
              t("div", Ze, [
                t("div", ta, [
                  t("strong", null, s(e.kind), 1),
                  t("span", {
                    class: A(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                  }, s(e.outcome), 3),
                  t("time", null, s(e.at), 1)
                ]),
                t("p", ea, s(e.target), 1),
                t("p", aa, s(e.detail), 1)
              ])
            ]))), 128)),
            o.value.audit?.length ? r("", !0) : (n(), i("li", sa, "暂无审计记录"))
          ])
        ])
      ]),
      lt(nt)
    ]));
  }
}), da = /* @__PURE__ */ it(la, [["__scopeId", "data-v-cc3d3a63"]]);
export {
  da as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-cc3d3a63]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-cc3d3a63]{max-width:1180px;margin:0 auto}.page-header[data-v-cc3d3a63]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-cc3d3a63]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-cc3d3a63]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-cc3d3a63]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-cc3d3a63]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-cc3d3a63]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-cc3d3a63]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-cc3d3a63]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-cc3d3a63]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-cc3d3a63]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-cc3d3a63]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-cc3d3a63]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-cc3d3a63]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-cc3d3a63]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-cc3d3a63]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-cc3d3a63]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-cc3d3a63]{display:flex;align-items:center;gap:10px}.stat-label[data-v-cc3d3a63]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-cc3d3a63]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-cc3d3a63]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-cc3d3a63]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-cc3d3a63]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-cc3d3a63]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-cc3d3a63]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-cc3d3a63]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-cc3d3a63]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-cc3d3a63]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-cc3d3a63]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-cc3d3a63]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-cc3d3a63]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-cc3d3a63]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-cc3d3a63]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-cc3d3a63]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-cc3d3a63]{background:#fff1dc;color:#7a4400}.input[data-v-cc3d3a63]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-cc3d3a63]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-cc3d3a63]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-cc3d3a63]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-cc3d3a63]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-cc3d3a63]{grid-column:1/-1}.stack-form[data-v-cc3d3a63]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-cc3d3a63]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-cc3d3a63]{align-self:flex-start}.item-list[data-v-cc3d3a63],.rel-list[data-v-cc3d3a63],.feed[data-v-cc3d3a63],.timeline[data-v-cc3d3a63]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-cc3d3a63]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-cc3d3a63]{align-items:flex-start}.item[data-v-cc3d3a63]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-cc3d3a63]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-cc3d3a63]{font-size:14px;font-weight:600}.item-main strong.done[data-v-cc3d3a63]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-cc3d3a63]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-cc3d3a63]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-cc3d3a63]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-cc3d3a63]{background:transparent;border:0}.check-label[data-v-cc3d3a63]{display:flex;align-items:center}.check-label input[data-v-cc3d3a63]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-cc3d3a63]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-cc3d3a63]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-cc3d3a63]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-cc3d3a63]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-cc3d3a63],.rel-meter[data-v-cc3d3a63]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-cc3d3a63]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-cc3d3a63]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-cc3d3a63]{font-size:12px}.rel-actions[data-v-cc3d3a63]{display:flex;gap:4px}.ledger[data-v-cc3d3a63]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-cc3d3a63]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-cc3d3a63]{padding:8px 12px}.feed time[data-v-cc3d3a63],.timeline time[data-v-cc3d3a63]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-cc3d3a63]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-cc3d3a63]{color:var(--md-success);font-weight:700}.neg[data-v-cc3d3a63]{color:var(--md-error);font-weight:700}.policy[data-v-cc3d3a63]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-cc3d3a63]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-cc3d3a63]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-cc3d3a63]{margin-top:6px}.audit-card[data-v-cc3d3a63]{margin-bottom:var(--space-lg)}.timeline[data-v-cc3d3a63]{position:relative}.timeline li[data-v-cc3d3a63]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-cc3d3a63]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-cc3d3a63]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-cc3d3a63]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-cc3d3a63]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-cc3d3a63]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-cc3d3a63]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-cc3d3a63]{font-size:13.5px;font-weight:650}.tl-detail[data-v-cc3d3a63]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-cc3d3a63]{grid-template-columns:repeat(2,1fr)}.grid[data-v-cc3d3a63],.agenda-form[data-v-cc3d3a63]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-cc3d3a63]{padding:var(--space-lg)}.header-actions[data-v-cc3d3a63]{padding-top:0}}.page[data-v-44679b4d]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-44679b4d]{max-width:1180px;margin:0 auto}.page-header[data-v-44679b4d]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-44679b4d]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-44679b4d]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-44679b4d]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-44679b4d]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-44679b4d]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-44679b4d]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-44679b4d]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-44679b4d]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-44679b4d]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-44679b4d]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-44679b4d]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-44679b4d]{display:flex;align-items:center;gap:10px}.stat-label[data-v-44679b4d]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-44679b4d]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-44679b4d]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-44679b4d]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-44679b4d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-44679b4d]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-44679b4d]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-44679b4d]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-44679b4d]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-44679b4d]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-44679b4d]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-44679b4d]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-44679b4d]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-44679b4d]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-44679b4d]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-44679b4d]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-44679b4d]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-44679b4d]{background:#fff1dc;color:#7a4400}.error-banner[data-v-44679b4d]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-44679b4d]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-44679b4d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-44679b4d]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-44679b4d]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-44679b4d]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-44679b4d]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-44679b4d]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-44679b4d]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-44679b4d]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-44679b4d]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-44679b4d]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-44679b4d]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-44679b4d]{background:var(--md-primary)}.fill-secondary[data-v-44679b4d]{background:var(--md-secondary,#536255)}.meter-text[data-v-44679b4d]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-44679b4d]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-44679b4d]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-44679b4d]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-44679b4d]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-44679b4d]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-44679b4d]{display:flex;gap:8px;justify-content:flex-end}.empty-state[data-v-44679b4d]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-44679b4d]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-44679b4d]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-44679b4d]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-44679b4d]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-44679b4d]{display:flex;flex-direction:column;gap:10px}.input[data-v-44679b4d]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-44679b4d]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-44679b4d]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-44679b4d],.reflection-list[data-v-44679b4d]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-44679b4d]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-44679b4d]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-44679b4d]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-44679b4d]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-44679b4d]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-44679b4d]{margin-top:var(--space-lg)}.reader pre[data-v-44679b4d]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-44679b4d]{font-size:14px;font-weight:600}.reflection details[data-v-44679b4d]{margin-top:6px}.reflection summary[data-v-44679b4d]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-44679b4d]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-44679b4d]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-44679b4d]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-44679b4d]{padding:var(--space-lg)}.header-actions[data-v-44679b4d]{padding-top:0}.memory-list[data-v-44679b4d]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
