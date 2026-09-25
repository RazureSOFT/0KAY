import { defineComponent as pt, ref as u, computed as H, onMounted as vt, openBlock as n, createElementBlock as i, createElementVNode as t, toDisplayString as s, createCommentVNode as d, createStaticVNode as B, normalizeClass as C, withModifiers as N, withDirectives as _, vModelText as g, Fragment as c, renderList as m, createTextVNode as y, vModelCheckbox as _t, normalizeStyle as mt } from "vue";
import { u as ht, _ as gt } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const bt = { class: "page" }, yt = { class: "page-inner" }, ft = { class: "page-header" }, kt = { class: "header-actions" }, wt = ["disabled"], Ct = ["disabled"], jt = {
  key: 0,
  class: "error-banner"
}, xt = {
  key: 1,
  class: "notice"
}, Lt = { class: "stat-grid" }, $t = { class: "stat-card" }, Mt = { class: "stat-value" }, Nt = { class: "stat-card" }, St = { class: "stat-value" }, Et = { class: "stat-card" }, Ft = { class: "stat-value" }, Tt = { class: "stat-hint" }, Vt = { class: "stat-card" }, It = { class: "stat-value" }, Ut = { class: "life-state" }, Dt = { class: "state-pill" }, Ot = {
  key: 0,
  class: "state-pill"
}, Pt = { class: "group" }, Yt = { class: "grid" }, At = { class: "card" }, Bt = { class: "item-list" }, Jt = { class: "item-main" }, zt = { class: "item-meta" }, Ht = { class: "item-actions" }, qt = ["onClick"], Gt = ["onClick"], Rt = {
  key: 0,
  class: "list-empty"
}, Wt = { class: "item-list" }, Kt = { class: "item-main" }, Qt = { class: "item-row" }, Xt = { class: "item-meta" }, Zt = {
  key: 0,
  class: "list-empty"
}, te = { class: "card" }, ee = { class: "card-head" }, ae = { class: "chip muted" }, se = { class: "check-line" }, le = ["disabled"], ne = { class: "item-list" }, ie = { class: "item-main" }, oe = { class: "item-meta" }, re = { class: "item-actions" }, de = ["onClick"], ue = {
  key: 0,
  class: "list-empty"
}, ce = { class: "card" }, pe = { class: "card-head" }, ve = { class: "head-actions" }, _e = ["disabled"], me = { class: "feed" }, he = {
  key: 0,
  class: "list-empty plain"
}, ge = { class: "card" }, be = { class: "card-head" }, ye = { class: "head-actions" }, fe = ["disabled"], ke = { class: "feed" }, we = {
  key: 0,
  class: "list-empty plain"
}, Ce = { class: "group" }, je = { class: "grid" }, xe = { class: "card" }, Le = { class: "card-head" }, $e = { class: "rel-list" }, Me = { class: "avatar" }, Ne = { class: "rel-main" }, Se = { class: "rel-top" }, Ee = { class: "chip" }, Fe = { class: "rel-meter" }, Te = { class: "meter-bar" }, Ve = { class: "item-meta" }, Ie = { class: "rel-actions" }, Ue = ["onClick"], De = ["onClick"], Oe = {
  key: 0,
  class: "list-empty"
}, Pe = {
  key: 0,
  class: "ledger"
}, Ye = { class: "section-label" }, Ae = { class: "feed" }, Be = {
  key: 0,
  class: "list-empty plain"
}, Je = { class: "card" }, ze = { class: "item-list" }, He = { class: "item-main" }, qe = { class: "item-meta" }, Ge = { class: "chip" }, Re = {
  key: 0,
  class: "list-empty"
}, We = { class: "group" }, Ke = { class: "grid" }, Qe = { class: "card" }, Xe = { class: "card-head" }, Ze = { class: "chip muted" }, ta = { class: "toolbar-inline" }, ea = ["disabled"], aa = ["disabled"], sa = { class: "item-list" }, la = { class: "item-main" }, na = { class: "item-meta" }, ia = { class: "item-meta" }, oa = { class: "item-actions" }, ra = ["onClick"], da = {
  key: 0,
  class: "list-empty"
}, ua = { class: "policy" }, ca = { class: "select" }, pa = { class: "select" }, va = { class: "feed" }, _a = {
  key: 0,
  class: "list-empty plain"
}, ma = { class: "group" }, ha = { class: "grid" }, ga = { class: "card" }, ba = { class: "card-head" }, ya = { class: "chip muted" }, fa = { class: "item-list" }, ka = { class: "item-main" }, wa = { class: "item-meta" }, Ca = {
  key: 0,
  class: "group-detail"
}, ja = {
  key: 0,
  class: "topics"
}, xa = { class: "feed compact" }, La = { class: "item-actions" }, $a = ["onClick"], Ma = {
  key: 0,
  class: "list-empty"
}, Na = { class: "group" }, Sa = { class: "grid" }, Ea = { class: "card audit-card" }, Fa = { class: "card-head" }, Ta = { class: "chip muted" }, Va = { class: "usage-grid" }, Ia = { class: "usage-item" }, Ua = { class: "usage-item" }, Da = { class: "usage-item" }, Oa = { class: "item-list" }, Pa = { class: "item-main" }, Ya = { class: "item-meta" }, Aa = {
  key: 0,
  class: "list-empty"
}, Ba = { class: "card audit-card" }, Ja = { class: "card-head" }, za = { class: "timeline" }, Ha = { class: "tl-body" }, qa = { class: "tl-head" }, Ga = { class: "item-meta" }, Ra = { class: "tl-detail" }, Wa = {
  key: 0,
  class: "list-empty plain"
}, Ka = /* @__PURE__ */ pt({
  __name: "CompanionPage",
  setup(Qa) {
    const { confirm: Q } = ht(), o = u({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), S = u(!1), f = u(""), $ = u(""), M = u(""), E = u(""), F = u(""), T = u(""), V = u(""), I = u(!1), U = u(""), p = u({ target: "", motive: "", content: "", preferred_at: "" }), j = u({ daily_limit: 6, per_target_limit: 2 }), D = H(() => Object.entries(o.value.groups || {})), O = H(() => (o.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), J = H(() => o.value.proactive?.receipts || []);
    function b(l) {
      $.value = l, setTimeout(() => {
        $.value === l && ($.value = "");
      }, 2e3);
    }
    const k = u(null);
    async function X() {
      try {
        const l = await fetch("/api/usage");
        l.ok && (k.value = await l.json());
      } catch {
      }
    }
    async function x() {
      S.value = !0, f.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        o.value = await l.json();
      } catch (l) {
        f.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        S.value = !1;
      }
      X();
    }
    async function v(l, a) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: a }) });
        if (!e.ok) throw Error(await e.text());
        return await x(), await e.json().catch(() => ({}));
      } catch (e) {
        return f.value = e?.message || "操作失败", null;
      }
    }
    async function Z() {
      M.value.trim() && (await v("add_agenda", { title: M.value, when: E.value, detail: F.value }), M.value = "", E.value = "", F.value = "");
    }
    async function q(l, a) {
      a.trim() && (await v(l, { content: a }), l === "journal" ? T.value = "" : V.value = "");
    }
    function tt(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    function G(l) {
      if (l.status === "completed") return { label: "已完成", cls: "chip-ok" };
      const a = new Date(String(l.start_at || "").replace(" ", "T"));
      return !Number.isNaN(a.getTime()) && a.getTime() <= Date.now() ? { label: "进行中", cls: "chip-warn" } : { label: "待开始", cls: "muted" };
    }
    async function R(l, a) {
      await v("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: a }) && b(`已调整 ${l}`);
    }
    async function et() {
      if (!p.value.target.trim() || !p.value.content.trim()) return;
      await v("proactive_create", { ...p.value }) && (p.value = { target: "", motive: "", content: "", preferred_at: "" }, b("已创建主动候选"));
    }
    async function at(l) {
      await v("proactive_cancel", { id: l, reason: "dashboard_cancel" }), b("已取消候选");
    }
    async function st() {
      await v("proactive_policy", { daily_limit: Number(j.value.daily_limit), per_target_limit: Number(j.value.per_target_limit) }), b("策略已保存");
    }
    const L = u("");
    async function W(l) {
      L.value = l;
      try {
        const a = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!a.ok) throw Error(await a.text());
        await x(), b("已由 LIFE 生成");
      } catch (a) {
        f.value = a?.message || "生成失败";
      } finally {
        L.value = "";
      }
    }
    async function lt() {
      const l = p.value.target.trim() || "user:owner";
      await v("proactive_suggest", { target: l, hint: p.value.motive }) && (p.value = { target: "", motive: "", content: "", preferred_at: "" }, b("已生成建议候选"));
    }
    const P = u(!1);
    async function nt() {
      P.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const a = await l.json();
        await x(), b(a?.skipped ? `本次跳过：${a.skipped}` : `已投递 ${a.delivered || 0} 条 · 拦截 ${a.blocked || 0} 条`);
      } catch (l) {
        f.value = l?.message || "投递失败";
      } finally {
        P.value = !1;
      }
    }
    const Y = u(!1);
    async function it() {
      Y.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const a = await l.json();
        await x();
        const e = a?.applied;
        b(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (l) {
        f.value = l?.message || "规划失败";
      } finally {
        Y.value = !1;
      }
    }
    function z(l) {
      const a = (l || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let r = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(a) ? (r = new Date(a), r.setHours(0, 0, 0, 0), r < e && r.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(a) && (r = new Date(e.getFullYear(), Number(a.slice(0, 2)) - 1, Number(a.slice(3, 5))), r < e && r.setFullYear(e.getFullYear() + 1)), !r || Number.isNaN(r.getTime()) ? null : Math.round((r.getTime() - e.getTime()) / 864e5);
    }
    const h = u({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function ot() {
      !h.value.title.trim() || !h.value.date.trim() || (await v("date_add", { ...h.value }), h.value = { title: "", date: "", repeat_yearly: !0, note: "" }, b("已添加重要日期"));
    }
    async function rt(l) {
      await v("date_delete", { id: l }), b("已删除");
    }
    async function dt() {
      await v("circadian_eat", { amount: 45 }), b("已用餐");
    }
    async function ut() {
      const l = await v("daily_agenda", {});
      b(l?.created ? `LIFE 已安排 ${l.created} 项活动` : "今天已有安排");
    }
    async function K(l) {
      await Q({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await v("journal_clear", { kind: l }), b("已清除"));
    }
    function A(l) {
      if (!l) return "";
      const a = new Date(l);
      return Number.isNaN(a.getTime()) ? l : a.toLocaleString();
    }
    return vt(x), (l, a) => (n(), i("main", bt, [
      t("div", yt, [
        t("header", ft, [
          a[23] || (a[23] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", kt, [
            t("button", {
              class: "btn btn-primary",
              disabled: Y.value,
              onClick: it
            }, s(Y.value ? "规划中…" : "让 LIFE 规划"), 9, wt),
            t("button", {
              class: "btn btn-tonal",
              disabled: S.value,
              onClick: x
            }, s(S.value ? "刷新中…" : "刷新"), 9, Ct)
          ])
        ]),
        f.value ? (n(), i("p", jt, s(f.value), 1)) : d("", !0),
        $.value ? (n(), i("p", xt, s($.value), 1)) : d("", !0),
        t("section", Lt, [
          t("article", $t, [
            a[24] || (a[24] = B('<div class="stat-head" data-v-fa15a072><span class="icon-badge tone-1" aria-hidden="true" data-v-fa15a072><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-fa15a072><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-fa15a072></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-fa15a072></path></svg></span><span class="stat-label" data-v-fa15a072>关系对象</span></div>', 1)),
            t("strong", Mt, s(o.value.relationships?.length || 0), 1),
            a[25] || (a[25] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", Nt, [
            a[26] || (a[26] = B('<div class="stat-head" data-v-fa15a072><span class="icon-badge tone-2" aria-hidden="true" data-v-fa15a072><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-fa15a072><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-fa15a072></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-fa15a072></path></svg></span><span class="stat-label" data-v-fa15a072>活动日程</span></div>', 1)),
            t("strong", St, s(o.value.agenda?.filter((e) => e.status === "active").length || 0), 1),
            a[27] || (a[27] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", Et, [
            a[28] || (a[28] = B('<div class="stat-head" data-v-fa15a072><span class="icon-badge tone-3" aria-hidden="true" data-v-fa15a072><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-fa15a072><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-fa15a072></path></svg></span><span class="stat-label" data-v-fa15a072>待投递主动行为</span></div>', 1)),
            t("strong", Ft, s(O.value.length), 1),
            t("span", Tt, "已投递 " + s(J.value.length) + " 次", 1)
          ]),
          t("article", Vt, [
            a[29] || (a[29] = B('<div class="stat-head" data-v-fa15a072><span class="icon-badge tone-4" aria-hidden="true" data-v-fa15a072><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-fa15a072><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-fa15a072></path></svg></span><span class="stat-label" data-v-fa15a072>已观察群聊</span></div>', 1)),
            t("strong", It, s(D.value.length), 1),
            a[30] || (a[30] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", Ut, [
          t("span", Dt, "精力 " + s(Math.round(o.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: C(["state-pill", { warn: (o.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + s(Math.round(o.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: C(["state-pill", { warn: (o.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + s(Math.round(o.value.circadian?.health ?? 100)), 3),
          o.value.circadian?.is_sleeping ? (n(), i("span", Ot, "睡眠中")) : d("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: dt
          }, "吃饭")
        ]),
        t("section", Pt, [
          a[41] || (a[41] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", Yt, [
            t("article", At, [
              t("div", { class: "card-head" }, [
                a[31] || (a[31] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: ut
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: N(Z, ["prevent"])
              }, [
                _(t("input", {
                  "onUpdate:modelValue": a[0] || (a[0] = (e) => M.value = e),
                  class: "input",
                  placeholder: "日程标题",
                  "aria-label": "日程标题"
                }, null, 512), [
                  [g, M.value]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": a[1] || (a[1] = (e) => E.value = e),
                  class: "input",
                  placeholder: "时间，例如 2026-09-25 20:00",
                  "aria-label": "时间"
                }, null, 512), [
                  [g, E.value]
                ]),
                a[32] || (a[32] = t("button", {
                  class: "btn btn-primary",
                  type: "submit"
                }, "创建候选", -1)),
                _(t("textarea", {
                  "onUpdate:modelValue": a[2] || (a[2] = (e) => F.value = e),
                  class: "input area",
                  placeholder: "说明（可选）"
                }, null, 512), [
                  [g, F.value]
                ])
              ], 32),
              a[33] || (a[33] = t("h3", { class: "section-label" }, "待确认候选", -1)),
              t("ul", Bt, [
                (n(!0), i(c, null, m(o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Jt, [
                    t("strong", null, s(e.title), 1),
                    t("span", zt, s(e.when_text) + " · " + s(e.detail || "等待你确认"), 1)
                  ]),
                  t("div", Ht, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (r) => v("confirm_agenda", { id: e.id })
                    }, "确认", 8, qt),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (r) => v("reject_agenda", { id: e.id })
                    }, "拒绝", 8, Gt)
                  ])
                ]))), 128)),
                o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? d("", !0) : (n(), i("li", Rt, "没有待确认的日程候选"))
              ]),
              a[34] || (a[34] = t("h3", { class: "section-label" }, [
                y("今天的日程 "),
                t("small", { class: "hint-inline" }, "LIFE 按时间自动推进")
              ], -1)),
              t("ul", Wt, [
                (n(!0), i(c, null, m(o.value.agenda, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Kt, [
                    t("div", Qt, [
                      t("strong", {
                        class: C({ done: e.status === "completed" })
                      }, s(e.title), 3),
                      t("span", {
                        class: C(["chip", G(e).cls])
                      }, s(G(e).label), 3)
                    ]),
                    t("span", Xt, [
                      y(s(e.start_at), 1),
                      e.detail ? (n(), i(c, { key: 0 }, [
                        y(" · " + s(e.detail), 1)
                      ], 64)) : d("", !0)
                    ])
                  ])
                ]))), 128)),
                o.value.agenda?.length ? d("", !0) : (n(), i("li", Zt, "今天还没有安排，点右上角让 LIFE 安排。"))
              ])
            ]),
            t("article", te, [
              t("div", ee, [
                a[35] || (a[35] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", ae, s((o.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: N(ot, ["prevent"])
              }, [
                _(t("input", {
                  "onUpdate:modelValue": a[3] || (a[3] = (e) => h.value.title = e),
                  class: "input",
                  placeholder: "名称，如 生日 / 纪念日",
                  "aria-label": "重要日期名称"
                }, null, 512), [
                  [g, h.value.title]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": a[4] || (a[4] = (e) => h.value.date = e),
                  class: "input",
                  placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                  "aria-label": "重要日期"
                }, null, 512), [
                  [g, h.value.date]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": a[5] || (a[5] = (e) => h.value.note = e),
                  class: "input",
                  placeholder: "备注（可选）",
                  "aria-label": "备注"
                }, null, 512), [
                  [g, h.value.note]
                ]),
                t("label", se, [
                  _(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": a[6] || (a[6] = (e) => h.value.repeat_yearly = e)
                  }, null, 512), [
                    [_t, h.value.repeat_yearly]
                  ]),
                  a[36] || (a[36] = y(" 每年重复", -1))
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !h.value.title.trim() || !h.value.date.trim()
                }, "添加", 8, le)
              ], 32),
              t("ul", ne, [
                (n(!0), i(c, null, m(o.value.important_dates, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ie, [
                    t("strong", null, s(e.title), 1),
                    t("span", oe, [
                      y(s(e.date_text), 1),
                      z(e.date_text) !== null ? (n(), i(c, { key: 0 }, [
                        y(" · " + s(z(e.date_text) === 0 ? "就是今天" : z(e.date_text) + " 天后"), 1)
                      ], 64)) : d("", !0),
                      e.note ? (n(), i(c, { key: 1 }, [
                        y(" · " + s(e.note), 1)
                      ], 64)) : d("", !0)
                    ])
                  ]),
                  t("div", re, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (r) => rt(e.id)
                    }, "删除", 8, de)
                  ])
                ]))), 128)),
                o.value.important_dates?.length ? d("", !0) : (n(), i("li", ue, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", ce, [
              t("div", pe, [
                a[37] || (a[37] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", ve, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: a[7] || (a[7] = (e) => K("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: L.value === "journal",
                    onClick: a[8] || (a[8] = (e) => W("journal"))
                  }, s(L.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, _e)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: a[10] || (a[10] = N((e) => q("journal", T.value), ["prevent"]))
              }, [
                _(t("textarea", {
                  "onUpdate:modelValue": a[9] || (a[9] = (e) => T.value = e),
                  class: "input area",
                  placeholder: "记录 LIFE 的日记…"
                }, null, 512), [
                  [g, T.value]
                ]),
                a[38] || (a[38] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "写入日记", -1))
              ], 32),
              t("ol", me, [
                (n(!0), i(c, null, m(o.value.journal, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, s(e.at), 1),
                  t("p", null, s(e.content), 1)
                ]))), 128)),
                o.value.journal?.length ? d("", !0) : (n(), i("li", he, "还没有日记"))
              ])
            ]),
            t("article", ge, [
              t("div", be, [
                a[39] || (a[39] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", ye, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: a[11] || (a[11] = (e) => K("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: L.value === "dream",
                    onClick: a[12] || (a[12] = (e) => W("dream"))
                  }, s(L.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, fe)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: a[14] || (a[14] = N((e) => q("dream", V.value), ["prevent"]))
              }, [
                _(t("textarea", {
                  "onUpdate:modelValue": a[13] || (a[13] = (e) => V.value = e),
                  class: "input area",
                  placeholder: "记录一个梦境或睡眠反思…"
                }, null, 512), [
                  [g, V.value]
                ]),
                a[40] || (a[40] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "记录梦境", -1))
              ], 32),
              t("ol", ke, [
                (n(!0), i(c, null, m(o.value.dreams, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, s(e.at), 1),
                  t("p", null, s(e.content), 1)
                ]))), 128)),
                o.value.dreams?.length ? d("", !0) : (n(), i("li", we, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", Ce, [
          a[44] || (a[44] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", je, [
            t("article", xe, [
              t("div", Le, [
                a[42] || (a[42] = t("h2", { class: "card-title" }, "关系账本", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: a[15] || (a[15] = (e) => I.value = !I.value)
                }, s(I.value ? "隐藏事件" : "查看事件账本"), 1)
              ]),
              t("ul", $e, [
                (n(!0), i(c, null, m(o.value.relationships, (e) => (n(), i("li", {
                  key: e.user_id,
                  class: "rel"
                }, [
                  t("span", Me, s((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", Ne, [
                    t("div", Se, [
                      t("strong", null, s(e.user_id), 1),
                      t("span", Ee, s(e.stage), 1)
                    ]),
                    t("div", Fe, [
                      t("div", Te, [
                        t("i", {
                          style: mt({ width: tt(e.affinity) })
                        }, null, 4)
                      ]),
                      t("b", null, s(Math.round((e.affinity || 0) * 100)) + "%", 1)
                    ]),
                    t("span", Ve, "最近互动：" + s(e.last_seen || "暂无"), 1)
                  ]),
                  t("div", Ie, [
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      title: "更亲近",
                      onClick: (r) => R(e.user_id, 0.05)
                    }, "+", 8, Ue),
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      title: "更疏远",
                      onClick: (r) => R(e.user_id, -0.05)
                    }, "−", 8, De)
                  ])
                ]))), 128)),
                o.value.relationships?.length ? d("", !0) : (n(), i("li", Oe, "暂无关系记录"))
              ]),
              I.value ? (n(), i("div", Pe, [
                t("h3", Ye, "事件账本（最近 " + s(o.value.relationship_ledger?.length || 0) + " 条）", 1),
                t("ol", Ae, [
                  (n(!0), i(c, null, m(o.value.relationship_ledger, (e) => (n(), i("li", {
                    key: e.id
                  }, [
                    t("time", null, s(A(e.created_at)), 1),
                    t("p", null, [
                      t("strong", null, s(e.user_id), 1),
                      y(" · " + s(e.event_key) + " ", 1),
                      t("span", {
                        class: C(e.delta >= 0 ? "pos" : "neg")
                      }, s(e.delta >= 0 ? "+" : "") + s(e.delta), 3),
                      y(" · " + s(e.reason) + " (" + s(e.channel) + ")", 1)
                    ])
                  ]))), 128)),
                  o.value.relationship_ledger?.length ? d("", !0) : (n(), i("li", Be, "暂无关系事件"))
                ])
              ])) : d("", !0)
            ]),
            t("article", Je, [
              a[43] || (a[43] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", ze, [
                (n(!0), i(c, null, m(o.value.persona_evolution, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item trait-item"
                }, [
                  t("div", He, [
                    t("strong", null, s(e.trait), 1),
                    t("span", qe, "支持 " + s(e.support_count) + " 次 · 置信度 " + s(Math.round((e.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", Ge, s(e.value), 1)
                ]))), 128)),
                o.value.persona_evolution?.length ? d("", !0) : (n(), i("li", Re, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", We, [
          a[51] || (a[51] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", Ke, [
            t("article", Qe, [
              t("div", Xe, [
                a[45] || (a[45] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", Ze, "待投递 " + s(O.value.length), 1)
              ]),
              t("div", ta, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: lt
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: P.value,
                  onClick: nt
                }, s(P.value ? "检查中…" : "立即检查投递"), 9, ea)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: N(et, ["prevent"])
              }, [
                _(t("input", {
                  "onUpdate:modelValue": a[16] || (a[16] = (e) => p.value.target = e),
                  class: "input",
                  placeholder: "对象（user_id / 会话）",
                  "aria-label": "主动对象"
                }, null, 512), [
                  [g, p.value.target]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": a[17] || (a[17] = (e) => p.value.motive = e),
                  class: "input",
                  placeholder: "动机，如 care / reminder",
                  "aria-label": "动机"
                }, null, 512), [
                  [g, p.value.motive]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": a[18] || (a[18] = (e) => p.value.preferred_at = e),
                  class: "input",
                  placeholder: "期望时间（可选，ISO）",
                  "aria-label": "期望时间"
                }, null, 512), [
                  [g, p.value.preferred_at]
                ]),
                _(t("textarea", {
                  "onUpdate:modelValue": a[19] || (a[19] = (e) => p.value.content = e),
                  class: "input area",
                  placeholder: "想说的内容…"
                }, null, 512), [
                  [g, p.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !p.value.target.trim() || !p.value.content.trim()
                }, "创建候选", 8, aa)
              ], 32),
              a[48] || (a[48] = t("h3", { class: "section-label" }, "候选队列", -1)),
              t("ul", sa, [
                (n(!0), i(c, null, m(O.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", la, [
                    t("strong", null, s(e.target) + " · " + s(e.motive), 1),
                    t("span", na, s(e.content), 1),
                    t("span", ia, "状态 " + s(e.status) + " · " + s(A(e.created_at)), 1)
                  ]),
                  t("div", oa, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (r) => at(e.id)
                    }, "取消", 8, ra)
                  ])
                ]))), 128)),
                O.value.length ? d("", !0) : (n(), i("li", da, "没有待投递候选"))
              ]),
              a[49] || (a[49] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", ua, [
                t("label", ca, [
                  a[46] || (a[46] = t("span", null, "每日上限", -1)),
                  _(t("input", {
                    "onUpdate:modelValue": a[20] || (a[20] = (e) => j.value.daily_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      g,
                      j.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", pa, [
                  a[47] || (a[47] = t("span", null, "单人上限", -1)),
                  _(t("input", {
                    "onUpdate:modelValue": a[21] || (a[21] = (e) => j.value.per_target_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      g,
                      j.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: st
                }, "保存策略")
              ]),
              a[50] || (a[50] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", va, [
                (n(!0), i(c, null, m(J.value, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, s(A(e.created_at)), 1),
                  t("p", null, s(e.phase) + " · " + s(e.content), 1)
                ]))), 128)),
                J.value.length ? d("", !0) : (n(), i("li", _a, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", ma, [
          a[53] || (a[53] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", ha, [
            t("article", ga, [
              t("div", ba, [
                a[52] || (a[52] = t("h2", { class: "card-title" }, "群聊观察", -1)),
                t("span", ya, s(D.value.length), 1)
              ]),
              t("ul", fa, [
                (n(!0), i(c, null, m(D.value, ([e, r]) => (n(), i("li", {
                  key: e,
                  class: "item group-item"
                }, [
                  t("div", ka, [
                    t("strong", null, s(e), 1),
                    t("span", wa, "情绪 " + s(r.mood || "—") + " · " + s(r.messages?.length || 0) + " 条观察 · " + s(r.topics?.length || 0) + " 个话题", 1),
                    U.value === e ? (n(), i("div", Ca, [
                      r.topics?.length ? (n(), i("div", ja, [
                        (n(!0), i(c, null, m(r.topics, (w) => (n(), i("span", {
                          key: w.topic,
                          class: "chip muted"
                        }, s(w.topic) + " · " + s(Math.round(w.score)), 1))), 128))
                      ])) : d("", !0),
                      t("ol", xa, [
                        (n(!0), i(c, null, m(r.messages, (w, ct) => (n(), i("li", { key: ct }, [
                          t("time", null, s(A(w.created_at)), 1),
                          t("p", null, [
                            t("strong", null, s(w.user_id), 1),
                            y("：" + s(w.content), 1)
                          ])
                        ]))), 128))
                      ])
                    ])) : d("", !0)
                  ]),
                  t("div", La, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (w) => U.value = U.value === e ? "" : e
                    }, s(U.value === e ? "收起" : "展开"), 9, $a)
                  ])
                ]))), 128)),
                D.value.length ? d("", !0) : (n(), i("li", Ma, "群聊观察尚未启用或没有消息。"))
              ])
            ])
          ])
        ]),
        t("section", Na, [
          a[59] || (a[59] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", Sa, [
            t("article", Ea, [
              t("div", Fa, [
                a[54] || (a[54] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", Ta, s(k.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", Va, [
                t("div", Ia, [
                  t("strong", null, s((k.value?.total_tokens || 0).toLocaleString()), 1),
                  a[55] || (a[55] = t("span", null, "总 Token", -1))
                ]),
                t("div", Ua, [
                  t("strong", null, s((k.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  a[56] || (a[56] = t("span", null, "输入", -1))
                ]),
                t("div", Da, [
                  t("strong", null, s((k.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  a[57] || (a[57] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", Oa, [
                (n(!0), i(c, null, m(k.value?.by_model || {}, (e, r) => (n(), i("li", {
                  key: r,
                  class: "item"
                }, [
                  t("div", Pa, [
                    t("strong", null, s(r), 1),
                    t("span", Ya, s((e.total || 0).toLocaleString()) + " tokens · " + s(e.count) + " 次", 1)
                  ])
                ]))), 128)),
                !k.value || !Object.keys(k.value.by_model || {}).length ? (n(), i("li", Aa, "暂无用量记录")) : d("", !0)
              ])
            ]),
            t("article", Ba, [
              t("div", Ja, [
                a[58] || (a[58] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: a[22] || (a[22] = (e) => v("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", za, [
                (n(!0), i(c, null, m(o.value.audit, (e) => (n(), i("li", {
                  key: e.at + e.kind
                }, [
                  t("span", {
                    class: C(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", Ha, [
                    t("div", qa, [
                      t("strong", null, s(e.kind), 1),
                      t("span", {
                        class: C(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, s(e.outcome), 3),
                      t("time", null, s(e.at), 1)
                    ]),
                    t("p", Ga, s(e.target), 1),
                    t("p", Ra, s(e.detail), 1)
                  ])
                ]))), 128)),
                o.value.audit?.length ? d("", !0) : (n(), i("li", Wa, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), ts = /* @__PURE__ */ gt(Ka, [["__scopeId", "data-v-fa15a072"]]);
export {
  ts as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-fa15a072]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-fa15a072]{max-width:1180px;margin:0 auto}.page-header[data-v-fa15a072]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-fa15a072]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-fa15a072]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-fa15a072]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-fa15a072]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-fa15a072]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-fa15a072]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-fa15a072]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-fa15a072]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-fa15a072]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-fa15a072]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-fa15a072]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-fa15a072]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-fa15a072]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-fa15a072]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-fa15a072]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-fa15a072]{display:flex;align-items:center;gap:10px}.stat-label[data-v-fa15a072]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-fa15a072]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-fa15a072]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-fa15a072]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-fa15a072]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-fa15a072]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-fa15a072]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-fa15a072]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-fa15a072]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-fa15a072]{margin-bottom:var(--space-lg)}.group-title[data-v-fa15a072]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-fa15a072]{margin-bottom:0}.card[data-v-fa15a072]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-fa15a072]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-fa15a072]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-fa15a072]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-fa15a072]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-fa15a072]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-fa15a072]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-fa15a072]{background:#fff1dc;color:#7a4400}.input[data-v-fa15a072]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-fa15a072]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-fa15a072]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-fa15a072]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-fa15a072]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-fa15a072]{grid-column:1/-1}.stack-form[data-v-fa15a072]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-fa15a072]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-fa15a072]{align-self:flex-start}.item-list[data-v-fa15a072],.rel-list[data-v-fa15a072],.feed[data-v-fa15a072],.timeline[data-v-fa15a072]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-fa15a072]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-fa15a072]{align-items:flex-start}.item[data-v-fa15a072]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-fa15a072]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-fa15a072]{font-size:14px;font-weight:600}.item-main strong.done[data-v-fa15a072]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-fa15a072]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-fa15a072]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-fa15a072]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-fa15a072]{background:transparent;border:0}.check-label[data-v-fa15a072]{display:flex;align-items:center}.check-line[data-v-fa15a072]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-fa15a072]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-fa15a072]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-fa15a072]{background:#fff1dc;color:#7a4400}.head-actions[data-v-fa15a072]{display:flex;gap:8px}.item-row[data-v-fa15a072]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hint-inline[data-v-fa15a072]{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}.check-label input[data-v-fa15a072]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-fa15a072]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-fa15a072]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-fa15a072]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-fa15a072]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-fa15a072],.rel-meter[data-v-fa15a072]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-fa15a072]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-fa15a072]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-fa15a072]{font-size:12px}.rel-actions[data-v-fa15a072]{display:flex;gap:4px}.ledger[data-v-fa15a072]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-fa15a072]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-fa15a072]{padding:8px 12px}.feed time[data-v-fa15a072],.timeline time[data-v-fa15a072]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-fa15a072]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-fa15a072]{color:var(--md-success);font-weight:700}.neg[data-v-fa15a072]{color:var(--md-error);font-weight:700}.policy[data-v-fa15a072]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-fa15a072]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-fa15a072]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-fa15a072]{margin-top:6px}.audit-card[data-v-fa15a072]{margin-bottom:var(--space-lg)}.usage-grid[data-v-fa15a072]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-fa15a072]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-fa15a072]{font-size:20px;font-weight:700}.usage-item span[data-v-fa15a072]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-fa15a072]{position:relative}.timeline li[data-v-fa15a072]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-fa15a072]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-fa15a072]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-fa15a072]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-fa15a072]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-fa15a072]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-fa15a072]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-fa15a072]{font-size:13.5px;font-weight:650}.tl-detail[data-v-fa15a072]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-fa15a072]{grid-template-columns:repeat(2,1fr)}.grid[data-v-fa15a072],.agenda-form[data-v-fa15a072]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-fa15a072]{padding:var(--space-lg)}.header-actions[data-v-fa15a072]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
