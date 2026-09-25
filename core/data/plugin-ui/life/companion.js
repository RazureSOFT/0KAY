import { defineComponent as nt, ref as c, computed as H, onMounted as it, openBlock as n, createElementBlock as i, createElementVNode as t, toDisplayString as s, createCommentVNode as r, createStaticVNode as Y, withModifiers as M, withDirectives as v, vModelText as m, Fragment as p, renderList as h, normalizeClass as B, createTextVNode as y, normalizeStyle as ot, vModelCheckbox as dt, createVNode as rt } from "vue";
import { _ as ut, a as ct } from "./assets/_plugin-vue_export-helper-CihezfpQ.js";
const pt = { class: "page" }, vt = { class: "page-inner" }, _t = { class: "page-header" }, mt = { class: "header-actions" }, ht = ["disabled"], bt = ["disabled"], gt = {
  key: 0,
  class: "error-banner"
}, yt = {
  key: 1,
  class: "notice"
}, ft = { class: "stat-grid" }, kt = { class: "stat-card" }, wt = { class: "stat-value" }, Ct = { class: "stat-card" }, xt = { class: "stat-value" }, jt = { class: "stat-card" }, $t = { class: "stat-value" }, Mt = { class: "stat-hint" }, Nt = { class: "stat-card" }, Vt = { class: "stat-value" }, Et = { class: "grid" }, Ft = { class: "card" }, Lt = { class: "item-list" }, St = { class: "item-main" }, Tt = { class: "item-meta" }, Ut = { class: "item-actions" }, Dt = ["onClick"], It = ["onClick"], Ot = {
  key: 0,
  class: "list-empty"
}, Pt = { class: "item-list" }, Yt = { class: "check-label" }, Bt = ["checked", "onChange"], At = { class: "item-main" }, zt = { class: "item-meta" }, Ht = {
  key: 0,
  class: "list-empty"
}, Jt = { class: "card" }, Gt = { class: "card-head" }, Rt = { class: "rel-list" }, Wt = { class: "avatar" }, qt = { class: "rel-main" }, Kt = { class: "rel-top" }, Qt = { class: "chip" }, Xt = { class: "rel-meter" }, Zt = { class: "meter-bar" }, te = { class: "item-meta" }, ee = { class: "rel-actions" }, ae = ["onClick"], se = ["onClick"], le = {
  key: 0,
  class: "list-empty"
}, ne = {
  key: 0,
  class: "ledger"
}, ie = { class: "section-label" }, oe = { class: "feed" }, de = {
  key: 0,
  class: "list-empty plain"
}, re = { class: "card" }, ue = { class: "card-head" }, ce = { class: "chip muted" }, pe = { class: "toolbar-inline" }, ve = ["disabled"], _e = ["disabled"], me = { class: "item-list" }, he = { class: "item-main" }, be = { class: "item-meta" }, ge = { class: "item-meta" }, ye = { class: "item-actions" }, fe = ["onClick"], ke = {
  key: 0,
  class: "list-empty"
}, we = { class: "policy" }, Ce = { class: "select" }, xe = { class: "select" }, je = { class: "feed" }, $e = {
  key: 0,
  class: "list-empty plain"
}, Me = { class: "card" }, Ne = { class: "card-head" }, Ve = { class: "chip muted" }, Ee = { class: "check-line" }, Fe = ["disabled"], Le = { class: "item-list" }, Se = { class: "item-main" }, Te = { class: "item-meta" }, Ue = { class: "item-actions" }, De = ["onClick"], Ie = {
  key: 0,
  class: "list-empty"
}, Oe = { class: "card" }, Pe = { class: "item-list" }, Ye = { class: "item-main" }, Be = { class: "item-meta" }, Ae = { class: "chip" }, ze = {
  key: 0,
  class: "list-empty"
}, He = { class: "card" }, Je = { class: "card-head" }, Ge = { class: "chip muted" }, Re = { class: "item-list" }, We = { class: "item-main" }, qe = { class: "item-meta" }, Ke = {
  key: 0,
  class: "group-detail"
}, Qe = {
  key: 0,
  class: "topics"
}, Xe = { class: "feed compact" }, Ze = { class: "item-actions" }, ta = ["onClick"], ea = {
  key: 0,
  class: "list-empty"
}, aa = { class: "card" }, sa = { class: "card-head" }, la = ["disabled"], na = { class: "feed" }, ia = {
  key: 0,
  class: "list-empty plain"
}, oa = { class: "card" }, da = { class: "card-head" }, ra = ["disabled"], ua = { class: "feed" }, ca = {
  key: 0,
  class: "list-empty plain"
}, pa = { class: "card audit-card" }, va = { class: "card-head" }, _a = { class: "timeline" }, ma = { class: "tl-body" }, ha = { class: "tl-head" }, ba = { class: "item-meta" }, ga = { class: "tl-detail" }, ya = {
  key: 0,
  class: "list-empty plain"
}, fa = /* @__PURE__ */ nt({
  __name: "CompanionPage",
  setup(ka) {
    const o = c({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), N = c(!1), f = c(""), j = c(""), $ = c(""), V = c(""), E = c(""), F = c(""), L = c(""), S = c(!1), T = c(""), u = c({ target: "", motive: "", content: "", preferred_at: "" }), w = c({ daily_limit: 6, per_target_limit: 2 }), U = H(() => Object.entries(o.value.groups || {})), D = H(() => (o.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), A = H(() => o.value.proactive?.receipts || []);
    function g(l) {
      j.value = l, setTimeout(() => {
        j.value === l && (j.value = "");
      }, 2e3);
    }
    async function C() {
      N.value = !0, f.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        o.value = await l.json();
      } catch (l) {
        f.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        N.value = !1;
      }
    }
    async function b(l, a) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: a }) });
        if (!e.ok) throw Error(await e.text());
        return await C(), await e.json().catch(() => ({}));
      } catch (e) {
        return f.value = e?.message || "操作失败", null;
      }
    }
    async function W() {
      $.value.trim() && (await b("add_agenda", { title: $.value, when: V.value, detail: E.value }), $.value = "", V.value = "", E.value = "");
    }
    async function J(l, a) {
      a.trim() && (await b(l, { content: a }), l === "journal" ? F.value = "" : L.value = "");
    }
    function q(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    async function G(l, a) {
      await b("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: a }) && g(`已调整 ${l}`);
    }
    async function K() {
      if (!u.value.target.trim() || !u.value.content.trim()) return;
      await b("proactive_create", { ...u.value }) && (u.value = { target: "", motive: "", content: "", preferred_at: "" }, g("已创建主动候选"));
    }
    async function Q(l) {
      await b("proactive_cancel", { id: l, reason: "dashboard_cancel" }), g("已取消候选");
    }
    async function X() {
      await b("proactive_policy", { daily_limit: Number(w.value.daily_limit), per_target_limit: Number(w.value.per_target_limit) }), g("策略已保存");
    }
    const x = c("");
    async function R(l) {
      x.value = l;
      try {
        const a = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!a.ok) throw Error(await a.text());
        await C(), g("已由 LIFE 生成");
      } catch (a) {
        f.value = a?.message || "生成失败";
      } finally {
        x.value = "";
      }
    }
    async function Z() {
      const l = u.value.target.trim() || "user:owner";
      await b("proactive_suggest", { target: l, hint: u.value.motive }) && (u.value = { target: "", motive: "", content: "", preferred_at: "" }, g("已生成建议候选"));
    }
    const I = c(!1);
    async function tt() {
      I.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const a = await l.json();
        await C(), g(a?.skipped ? `本次跳过：${a.skipped}` : `已投递 ${a.delivered || 0} 条 · 拦截 ${a.blocked || 0} 条`);
      } catch (l) {
        f.value = l?.message || "投递失败";
      } finally {
        I.value = !1;
      }
    }
    const O = c(!1);
    async function et() {
      O.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const a = await l.json();
        await C();
        const e = a?.applied;
        g(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (l) {
        f.value = l?.message || "规划失败";
      } finally {
        O.value = !1;
      }
    }
    function z(l) {
      const a = (l || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let d = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(a) ? (d = new Date(a), d.setHours(0, 0, 0, 0), d < e && d.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(a) && (d = new Date(e.getFullYear(), Number(a.slice(0, 2)) - 1, Number(a.slice(3, 5))), d < e && d.setFullYear(e.getFullYear() + 1)), !d || Number.isNaN(d.getTime()) ? null : Math.round((d.getTime() - e.getTime()) / 864e5);
    }
    const _ = c({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function at() {
      !_.value.title.trim() || !_.value.date.trim() || (await b("date_add", { ..._.value }), _.value = { title: "", date: "", repeat_yearly: !0, note: "" }, g("已添加重要日期"));
    }
    async function st(l) {
      await b("date_delete", { id: l }), g("已删除");
    }
    function P(l) {
      if (!l) return "";
      const a = new Date(l);
      return Number.isNaN(a.getTime()) ? l : a.toLocaleString();
    }
    return it(C), (l, a) => (n(), i("main", pt, [
      t("div", vt, [
        t("header", _t, [
          a[21] || (a[21] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", mt, [
            t("button", {
              class: "btn btn-primary",
              disabled: O.value,
              onClick: et
            }, s(O.value ? "规划中…" : "让 LIFE 规划"), 9, ht),
            t("button", {
              class: "btn btn-tonal",
              disabled: N.value,
              onClick: C
            }, s(N.value ? "刷新中…" : "刷新"), 9, bt)
          ])
        ]),
        f.value ? (n(), i("p", gt, s(f.value), 1)) : r("", !0),
        j.value ? (n(), i("p", yt, s(j.value), 1)) : r("", !0),
        t("section", ft, [
          t("article", kt, [
            a[22] || (a[22] = Y('<div class="stat-head" data-v-2fd7129d><span class="icon-badge tone-1" aria-hidden="true" data-v-2fd7129d><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-2fd7129d><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-2fd7129d></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-2fd7129d></path></svg></span><span class="stat-label" data-v-2fd7129d>关系对象</span></div>', 1)),
            t("strong", wt, s(o.value.relationships?.length || 0), 1),
            a[23] || (a[23] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", Ct, [
            a[24] || (a[24] = Y('<div class="stat-head" data-v-2fd7129d><span class="icon-badge tone-2" aria-hidden="true" data-v-2fd7129d><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-2fd7129d><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-2fd7129d></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-2fd7129d></path></svg></span><span class="stat-label" data-v-2fd7129d>活动日程</span></div>', 1)),
            t("strong", xt, s(o.value.agenda?.filter((e) => e.status === "active").length || 0), 1),
            a[25] || (a[25] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", jt, [
            a[26] || (a[26] = Y('<div class="stat-head" data-v-2fd7129d><span class="icon-badge tone-3" aria-hidden="true" data-v-2fd7129d><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-2fd7129d><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-2fd7129d></path></svg></span><span class="stat-label" data-v-2fd7129d>待投递主动行为</span></div>', 1)),
            t("strong", $t, s(D.value.length), 1),
            t("span", Mt, "已投递 " + s(A.value.length) + " 次", 1)
          ]),
          t("article", Nt, [
            a[27] || (a[27] = Y('<div class="stat-head" data-v-2fd7129d><span class="icon-badge tone-4" aria-hidden="true" data-v-2fd7129d><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-2fd7129d><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-2fd7129d></path></svg></span><span class="stat-label" data-v-2fd7129d>已观察群聊</span></div>', 1)),
            t("strong", Vt, s(U.value.length), 1),
            a[28] || (a[28] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", Et, [
          t("article", Ft, [
            a[30] || (a[30] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "日程")
            ], -1)),
            t("form", {
              class: "agenda-form",
              onSubmit: M(W, ["prevent"])
            }, [
              v(t("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (e) => $.value = e),
                class: "input",
                placeholder: "日程标题",
                "aria-label": "日程标题"
              }, null, 512), [
                [m, $.value]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[1] || (a[1] = (e) => V.value = e),
                class: "input",
                placeholder: "时间，例如 2026-09-25 20:00",
                "aria-label": "时间"
              }, null, 512), [
                [m, V.value]
              ]),
              a[29] || (a[29] = t("button", {
                class: "btn btn-primary",
                type: "submit"
              }, "创建候选", -1)),
              v(t("textarea", {
                "onUpdate:modelValue": a[2] || (a[2] = (e) => E.value = e),
                class: "input area",
                placeholder: "说明（可选）"
              }, null, 512), [
                [m, E.value]
              ])
            ], 32),
            a[31] || (a[31] = t("h3", { class: "section-label" }, "待确认候选", -1)),
            t("ul", Lt, [
              (n(!0), i(p, null, h(o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), i("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", St, [
                  t("strong", null, s(e.title), 1),
                  t("span", Tt, s(e.when_text) + " · " + s(e.detail || "等待你确认"), 1)
                ]),
                t("div", Ut, [
                  t("button", {
                    class: "btn btn-primary btn-sm",
                    onClick: (d) => b("confirm_agenda", { id: e.id })
                  }, "确认", 8, Dt),
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => b("reject_agenda", { id: e.id })
                  }, "拒绝", 8, It)
                ])
              ]))), 128)),
              o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? r("", !0) : (n(), i("li", Ot, "没有待确认的日程候选"))
            ]),
            a[32] || (a[32] = t("h3", { class: "section-label" }, "已确认日程", -1)),
            t("ul", Pt, [
              (n(!0), i(p, null, h(o.value.agenda, (e) => (n(), i("li", {
                key: e.id,
                class: "item"
              }, [
                t("label", Yt, [
                  t("input", {
                    checked: e.status === "completed",
                    type: "checkbox",
                    onChange: (d) => b("complete_agenda", { id: e.id })
                  }, null, 40, Bt)
                ]),
                t("div", At, [
                  t("strong", {
                    class: B({ done: e.status === "completed" })
                  }, s(e.title), 3),
                  t("span", zt, [
                    y(s(e.start_at), 1),
                    e.detail ? (n(), i(p, { key: 0 }, [
                      y(" · " + s(e.detail), 1)
                    ], 64)) : r("", !0)
                  ])
                ])
              ]))), 128)),
              o.value.agenda?.length ? r("", !0) : (n(), i("li", Ht, "暂无已确认日程"))
            ])
          ]),
          t("article", Jt, [
            t("div", Gt, [
              a[33] || (a[33] = t("h2", { class: "card-title" }, "关系账本", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: a[3] || (a[3] = (e) => S.value = !S.value)
              }, s(S.value ? "隐藏事件" : "查看事件账本"), 1)
            ]),
            t("ul", Rt, [
              (n(!0), i(p, null, h(o.value.relationships, (e) => (n(), i("li", {
                key: e.user_id,
                class: "rel"
              }, [
                t("span", Wt, s((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                t("div", qt, [
                  t("div", Kt, [
                    t("strong", null, s(e.user_id), 1),
                    t("span", Qt, s(e.stage), 1)
                  ]),
                  t("div", Xt, [
                    t("div", Zt, [
                      t("i", {
                        style: ot({ width: q(e.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, s(Math.round((e.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("span", te, "最近互动：" + s(e.last_seen || "暂无"), 1)
                ]),
                t("div", ee, [
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更亲近",
                    onClick: (d) => G(e.user_id, 0.05)
                  }, "+", 8, ae),
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更疏远",
                    onClick: (d) => G(e.user_id, -0.05)
                  }, "−", 8, se)
                ])
              ]))), 128)),
              o.value.relationships?.length ? r("", !0) : (n(), i("li", le, "暂无关系记录"))
            ]),
            S.value ? (n(), i("div", ne, [
              t("h3", ie, "事件账本（最近 " + s(o.value.relationship_ledger?.length || 0) + " 条）", 1),
              t("ol", oe, [
                (n(!0), i(p, null, h(o.value.relationship_ledger, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, s(P(e.created_at)), 1),
                  t("p", null, [
                    t("strong", null, s(e.user_id), 1),
                    y(" · " + s(e.event_key) + " ", 1),
                    t("span", {
                      class: B(e.delta >= 0 ? "pos" : "neg")
                    }, s(e.delta >= 0 ? "+" : "") + s(e.delta), 3),
                    y(" · " + s(e.reason) + " (" + s(e.channel) + ")", 1)
                  ])
                ]))), 128)),
                o.value.relationship_ledger?.length ? r("", !0) : (n(), i("li", de, "暂无关系事件"))
              ])
            ])) : r("", !0)
          ]),
          t("article", re, [
            t("div", ue, [
              a[34] || (a[34] = t("h2", { class: "card-title" }, "主动行为", -1)),
              t("span", ce, "待投递 " + s(D.value.length), 1)
            ]),
            t("div", pe, [
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: Z
              }, "让 LIFE 建议一条"),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: I.value,
                onClick: tt
              }, s(I.value ? "检查中…" : "立即检查投递"), 9, ve)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: M(K, ["prevent"])
            }, [
              v(t("input", {
                "onUpdate:modelValue": a[4] || (a[4] = (e) => u.value.target = e),
                class: "input",
                placeholder: "对象（user_id / 会话）",
                "aria-label": "主动对象"
              }, null, 512), [
                [m, u.value.target]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[5] || (a[5] = (e) => u.value.motive = e),
                class: "input",
                placeholder: "动机，如 care / reminder",
                "aria-label": "动机"
              }, null, 512), [
                [m, u.value.motive]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[6] || (a[6] = (e) => u.value.preferred_at = e),
                class: "input",
                placeholder: "期望时间（可选，ISO）",
                "aria-label": "期望时间"
              }, null, 512), [
                [m, u.value.preferred_at]
              ]),
              v(t("textarea", {
                "onUpdate:modelValue": a[7] || (a[7] = (e) => u.value.content = e),
                class: "input area",
                placeholder: "想说的内容…"
              }, null, 512), [
                [m, u.value.content]
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !u.value.target.trim() || !u.value.content.trim()
              }, "创建候选", 8, _e)
            ], 32),
            a[37] || (a[37] = t("h3", { class: "section-label" }, "候选队列", -1)),
            t("ul", me, [
              (n(!0), i(p, null, h(D.value, (e) => (n(), i("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", he, [
                  t("strong", null, s(e.target) + " · " + s(e.motive), 1),
                  t("span", be, s(e.content), 1),
                  t("span", ge, "状态 " + s(e.status) + " · " + s(P(e.created_at)), 1)
                ]),
                t("div", ye, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => Q(e.id)
                  }, "取消", 8, fe)
                ])
              ]))), 128)),
              D.value.length ? r("", !0) : (n(), i("li", ke, "没有待投递候选"))
            ]),
            a[38] || (a[38] = t("h3", { class: "section-label" }, "配额策略", -1)),
            t("div", we, [
              t("label", Ce, [
                a[35] || (a[35] = t("span", null, "每日上限", -1)),
                v(t("input", {
                  "onUpdate:modelValue": a[8] || (a[8] = (e) => w.value.daily_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    m,
                    w.value.daily_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("label", xe, [
                a[36] || (a[36] = t("span", null, "单人上限", -1)),
                v(t("input", {
                  "onUpdate:modelValue": a[9] || (a[9] = (e) => w.value.per_target_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    m,
                    w.value.per_target_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: X
              }, "保存策略")
            ]),
            a[39] || (a[39] = t("h3", { class: "section-label" }, "投递记录", -1)),
            t("ol", je, [
              (n(!0), i(p, null, h(A.value, (e) => (n(), i("li", {
                key: e.id
              }, [
                t("time", null, s(P(e.created_at)), 1),
                t("p", null, s(e.phase) + " · " + s(e.content), 1)
              ]))), 128)),
              A.value.length ? r("", !0) : (n(), i("li", $e, "还没有主动投递记录"))
            ])
          ]),
          t("article", Me, [
            t("div", Ne, [
              a[40] || (a[40] = t("h2", { class: "card-title" }, "重要日期", -1)),
              t("span", Ve, s((o.value.important_dates || []).length), 1)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: M(at, ["prevent"])
            }, [
              v(t("input", {
                "onUpdate:modelValue": a[10] || (a[10] = (e) => _.value.title = e),
                class: "input",
                placeholder: "名称，如 生日 / 纪念日",
                "aria-label": "重要日期名称"
              }, null, 512), [
                [m, _.value.title]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[11] || (a[11] = (e) => _.value.date = e),
                class: "input",
                placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                "aria-label": "重要日期"
              }, null, 512), [
                [m, _.value.date]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[12] || (a[12] = (e) => _.value.note = e),
                class: "input",
                placeholder: "备注（可选）",
                "aria-label": "备注"
              }, null, 512), [
                [m, _.value.note]
              ]),
              t("label", Ee, [
                v(t("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": a[13] || (a[13] = (e) => _.value.repeat_yearly = e)
                }, null, 512), [
                  [dt, _.value.repeat_yearly]
                ]),
                a[41] || (a[41] = y(" 每年重复", -1))
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !_.value.title.trim() || !_.value.date.trim()
              }, "添加", 8, Fe)
            ], 32),
            t("ul", Le, [
              (n(!0), i(p, null, h(o.value.important_dates, (e) => (n(), i("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", Se, [
                  t("strong", null, s(e.title), 1),
                  t("span", Te, [
                    y(s(e.date_text), 1),
                    z(e.date_text) !== null ? (n(), i(p, { key: 0 }, [
                      y(" · " + s(z(e.date_text) === 0 ? "就是今天" : z(e.date_text) + " 天后"), 1)
                    ], 64)) : r("", !0),
                    e.note ? (n(), i(p, { key: 1 }, [
                      y(" · " + s(e.note), 1)
                    ], 64)) : r("", !0)
                  ])
                ]),
                t("div", Ue, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => st(e.id)
                  }, "删除", 8, De)
                ])
              ]))), 128)),
              o.value.important_dates?.length ? r("", !0) : (n(), i("li", Ie, "还没有重要日期，LIFE 会据此规划提醒。"))
            ])
          ]),
          t("article", Oe, [
            a[42] || (a[42] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "成长中的性格")
            ], -1)),
            t("ul", Pe, [
              (n(!0), i(p, null, h(o.value.persona_evolution, (e) => (n(), i("li", {
                key: e.id,
                class: "item trait-item"
              }, [
                t("div", Ye, [
                  t("strong", null, s(e.trait), 1),
                  t("span", Be, "支持 " + s(e.support_count) + " 次 · 置信度 " + s(Math.round((e.confidence || 0) * 100)) + "%", 1)
                ]),
                t("span", Ae, s(e.value), 1)
              ]))), 128)),
              o.value.persona_evolution?.length ? r("", !0) : (n(), i("li", ze, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
            ])
          ]),
          t("article", He, [
            t("div", Je, [
              a[43] || (a[43] = t("h2", { class: "card-title" }, "群聊观察", -1)),
              t("span", Ge, s(U.value.length), 1)
            ]),
            t("ul", Re, [
              (n(!0), i(p, null, h(U.value, ([e, d]) => (n(), i("li", {
                key: e,
                class: "item group-item"
              }, [
                t("div", We, [
                  t("strong", null, s(e), 1),
                  t("span", qe, "情绪 " + s(d.mood || "—") + " · " + s(d.messages?.length || 0) + " 条观察 · " + s(d.topics?.length || 0) + " 个话题", 1),
                  T.value === e ? (n(), i("div", Ke, [
                    d.topics?.length ? (n(), i("div", Qe, [
                      (n(!0), i(p, null, h(d.topics, (k) => (n(), i("span", {
                        key: k.topic,
                        class: "chip muted"
                      }, s(k.topic) + " · " + s(Math.round(k.score)), 1))), 128))
                    ])) : r("", !0),
                    t("ol", Xe, [
                      (n(!0), i(p, null, h(d.messages, (k, lt) => (n(), i("li", { key: lt }, [
                        t("time", null, s(P(k.created_at)), 1),
                        t("p", null, [
                          t("strong", null, s(k.user_id), 1),
                          y("：" + s(k.content), 1)
                        ])
                      ]))), 128))
                    ])
                  ])) : r("", !0)
                ]),
                t("div", Ze, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: (k) => T.value = T.value === e ? "" : e
                  }, s(T.value === e ? "收起" : "展开"), 9, ta)
                ])
              ]))), 128)),
              U.value.length ? r("", !0) : (n(), i("li", ea, "群聊观察尚未启用或没有消息。"))
            ])
          ]),
          t("article", aa, [
            t("div", sa, [
              a[44] || (a[44] = t("h2", { class: "card-title" }, "日记", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: x.value === "journal",
                onClick: a[14] || (a[14] = (e) => R("journal"))
              }, s(x.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, la)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: a[16] || (a[16] = M((e) => J("journal", F.value), ["prevent"]))
            }, [
              v(t("textarea", {
                "onUpdate:modelValue": a[15] || (a[15] = (e) => F.value = e),
                class: "input area",
                placeholder: "记录 LIFE 的日记…"
              }, null, 512), [
                [m, F.value]
              ]),
              a[45] || (a[45] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "写入日记", -1))
            ], 32),
            t("ol", na, [
              (n(!0), i(p, null, h(o.value.journal, (e) => (n(), i("li", {
                key: e.id
              }, [
                t("time", null, s(e.at), 1),
                t("p", null, s(e.content), 1)
              ]))), 128)),
              o.value.journal?.length ? r("", !0) : (n(), i("li", ia, "还没有日记"))
            ])
          ]),
          t("article", oa, [
            t("div", da, [
              a[46] || (a[46] = t("h2", { class: "card-title" }, "梦境", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: x.value === "dream",
                onClick: a[17] || (a[17] = (e) => R("dream"))
              }, s(x.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, ra)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: a[19] || (a[19] = M((e) => J("dream", L.value), ["prevent"]))
            }, [
              v(t("textarea", {
                "onUpdate:modelValue": a[18] || (a[18] = (e) => L.value = e),
                class: "input area",
                placeholder: "记录一个梦境或睡眠反思…"
              }, null, 512), [
                [m, L.value]
              ]),
              a[47] || (a[47] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "记录梦境", -1))
            ], 32),
            t("ol", ua, [
              (n(!0), i(p, null, h(o.value.dreams, (e) => (n(), i("li", {
                key: e.id
              }, [
                t("time", null, s(e.at), 1),
                t("p", null, s(e.content), 1)
              ]))), 128)),
              o.value.dreams?.length ? r("", !0) : (n(), i("li", ca, "还没有梦境记录"))
            ])
          ])
        ]),
        t("article", pa, [
          t("div", va, [
            a[48] || (a[48] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: a[20] || (a[20] = (e) => b("memory_maintenance", {}))
            }, "执行记忆维护与备份")
          ]),
          t("ol", _a, [
            (n(!0), i(p, null, h(o.value.audit, (e) => (n(), i("li", {
              key: e.at + e.kind
            }, [
              t("span", {
                class: B(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                "aria-hidden": "true"
              }, null, 2),
              t("div", ma, [
                t("div", ha, [
                  t("strong", null, s(e.kind), 1),
                  t("span", {
                    class: B(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                  }, s(e.outcome), 3),
                  t("time", null, s(e.at), 1)
                ]),
                t("p", ba, s(e.target), 1),
                t("p", ga, s(e.detail), 1)
              ])
            ]))), 128)),
            o.value.audit?.length ? r("", !0) : (n(), i("li", ya, "暂无审计记录"))
          ])
        ])
      ]),
      rt(ut)
    ]));
  }
}), xa = /* @__PURE__ */ ct(fa, [["__scopeId", "data-v-2fd7129d"]]);
export {
  xa as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-2fd7129d]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-2fd7129d]{max-width:1180px;margin:0 auto}.page-header[data-v-2fd7129d]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-2fd7129d]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-2fd7129d]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-2fd7129d]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-2fd7129d]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-2fd7129d]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-2fd7129d]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-2fd7129d]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-2fd7129d]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-2fd7129d]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-2fd7129d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-2fd7129d]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-2fd7129d]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-2fd7129d]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-2fd7129d]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-2fd7129d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-2fd7129d]{display:flex;align-items:center;gap:10px}.stat-label[data-v-2fd7129d]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-2fd7129d]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-2fd7129d]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-2fd7129d]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-2fd7129d]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-2fd7129d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-2fd7129d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-2fd7129d]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-2fd7129d]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-2fd7129d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-2fd7129d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-2fd7129d]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-2fd7129d]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-2fd7129d]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-2fd7129d]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-2fd7129d]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-2fd7129d]{background:#fff1dc;color:#7a4400}.input[data-v-2fd7129d]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-2fd7129d]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-2fd7129d]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-2fd7129d]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-2fd7129d]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-2fd7129d]{grid-column:1/-1}.stack-form[data-v-2fd7129d]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-2fd7129d]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-2fd7129d]{align-self:flex-start}.item-list[data-v-2fd7129d],.rel-list[data-v-2fd7129d],.feed[data-v-2fd7129d],.timeline[data-v-2fd7129d]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-2fd7129d]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-2fd7129d]{align-items:flex-start}.item[data-v-2fd7129d]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-2fd7129d]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-2fd7129d]{font-size:14px;font-weight:600}.item-main strong.done[data-v-2fd7129d]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-2fd7129d]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-2fd7129d]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-2fd7129d]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-2fd7129d]{background:transparent;border:0}.check-label[data-v-2fd7129d]{display:flex;align-items:center}.check-line[data-v-2fd7129d]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.check-label input[data-v-2fd7129d]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-2fd7129d]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-2fd7129d]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-2fd7129d]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-2fd7129d]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-2fd7129d],.rel-meter[data-v-2fd7129d]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-2fd7129d]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-2fd7129d]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-2fd7129d]{font-size:12px}.rel-actions[data-v-2fd7129d]{display:flex;gap:4px}.ledger[data-v-2fd7129d]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-2fd7129d]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-2fd7129d]{padding:8px 12px}.feed time[data-v-2fd7129d],.timeline time[data-v-2fd7129d]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-2fd7129d]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-2fd7129d]{color:var(--md-success);font-weight:700}.neg[data-v-2fd7129d]{color:var(--md-error);font-weight:700}.policy[data-v-2fd7129d]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-2fd7129d]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-2fd7129d]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-2fd7129d]{margin-top:6px}.audit-card[data-v-2fd7129d]{margin-bottom:var(--space-lg)}.timeline[data-v-2fd7129d]{position:relative}.timeline li[data-v-2fd7129d]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-2fd7129d]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-2fd7129d]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-2fd7129d]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-2fd7129d]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-2fd7129d]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-2fd7129d]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-2fd7129d]{font-size:13.5px;font-weight:650}.tl-detail[data-v-2fd7129d]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-2fd7129d]{grid-template-columns:repeat(2,1fr)}.grid[data-v-2fd7129d],.agenda-form[data-v-2fd7129d]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-2fd7129d]{padding:var(--space-lg)}.header-actions[data-v-2fd7129d]{padding-top:0}}.page[data-v-44679b4d]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-44679b4d]{max-width:1180px;margin:0 auto}.page-header[data-v-44679b4d]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-44679b4d]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-44679b4d]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-44679b4d]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-44679b4d]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-44679b4d]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-44679b4d]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-44679b4d]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-44679b4d]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-44679b4d]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-44679b4d]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-44679b4d]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-44679b4d]{display:flex;align-items:center;gap:10px}.stat-label[data-v-44679b4d]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-44679b4d]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-44679b4d]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-44679b4d]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-44679b4d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-44679b4d]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-44679b4d]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-44679b4d]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-44679b4d]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-44679b4d]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-44679b4d]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-44679b4d]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-44679b4d]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-44679b4d]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-44679b4d]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-44679b4d]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-44679b4d]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-44679b4d]{background:#fff1dc;color:#7a4400}.error-banner[data-v-44679b4d]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-44679b4d]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-44679b4d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-44679b4d]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-44679b4d]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-44679b4d]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-44679b4d]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-44679b4d]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-44679b4d]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-44679b4d]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-44679b4d]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-44679b4d]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-44679b4d]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-44679b4d]{background:var(--md-primary)}.fill-secondary[data-v-44679b4d]{background:var(--md-secondary,#536255)}.meter-text[data-v-44679b4d]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-44679b4d]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-44679b4d]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-44679b4d]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-44679b4d]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-44679b4d]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-44679b4d]{display:flex;gap:8px;justify-content:flex-end}.empty-state[data-v-44679b4d]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-44679b4d]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-44679b4d]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-44679b4d]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-44679b4d]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-44679b4d]{display:flex;flex-direction:column;gap:10px}.input[data-v-44679b4d]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-44679b4d]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-44679b4d]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-44679b4d],.reflection-list[data-v-44679b4d]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-44679b4d]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-44679b4d]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-44679b4d]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-44679b4d]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-44679b4d]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-44679b4d]{margin-top:var(--space-lg)}.reader pre[data-v-44679b4d]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-44679b4d]{font-size:14px;font-weight:600}.reflection details[data-v-44679b4d]{margin-top:6px}.reflection summary[data-v-44679b4d]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-44679b4d]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-44679b4d]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-44679b4d]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-44679b4d]{padding:var(--space-lg)}.header-actions[data-v-44679b4d]{padding-top:0}.memory-list[data-v-44679b4d]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
