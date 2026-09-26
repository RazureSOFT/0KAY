import { defineComponent as ht, ref as u, computed as E, onMounted as bt, openBlock as n, createElementBlock as i, createElementVNode as t, toDisplayString as a, createCommentVNode as d, createStaticVNode as z, normalizeClass as x, withModifiers as F, withDirectives as v, vModelText as _, Fragment as c, renderList as m, createTextVNode as f, vModelCheckbox as gt, vModelSelect as yt, normalizeStyle as ft } from "vue";
import { u as kt, _ as wt } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const Ct = { class: "page" }, jt = { class: "page-inner" }, xt = { class: "page-header" }, St = { class: "header-actions" }, Mt = ["disabled"], $t = ["disabled"], Lt = {
  key: 0,
  class: "error-banner"
}, Nt = {
  key: 1,
  class: "notice"
}, Et = { class: "stat-grid" }, Ft = { class: "stat-card" }, Vt = { class: "stat-value" }, Dt = { class: "stat-card" }, Tt = { class: "stat-value" }, Ut = { class: "stat-card" }, It = { class: "stat-value" }, Ot = { class: "stat-hint" }, Pt = { class: "stat-card" }, qt = { class: "stat-value" }, Yt = { class: "life-state" }, At = { class: "state-pill" }, Bt = {
  key: 0,
  class: "state-pill"
}, Jt = { class: "group" }, zt = { class: "grid" }, Ht = { class: "card" }, Qt = { class: "item-list" }, Gt = { class: "item-main" }, Rt = { class: "item-meta" }, Wt = { class: "item-actions" }, Kt = ["onClick"], Xt = ["onClick"], Zt = {
  key: 0,
  class: "list-empty"
}, te = { class: "item-list" }, ee = { class: "item-main" }, se = { class: "item-row" }, ae = { class: "item-meta" }, le = {
  key: 0,
  class: "list-empty"
}, ne = { class: "card" }, ie = { class: "card-head" }, oe = { class: "chip muted" }, re = { class: "check-line" }, de = ["disabled"], ue = { class: "item-list" }, ce = { class: "item-main" }, ve = { class: "item-meta" }, pe = { class: "item-actions" }, _e = ["onClick"], me = {
  key: 0,
  class: "list-empty"
}, he = { class: "card" }, be = { class: "card-head" }, ge = { class: "head-actions" }, ye = ["disabled"], fe = { class: "diary-nav" }, ke = ["disabled"], we = ["value"], Ce = {
  key: 0,
  value: ""
}, je = ["disabled"], xe = {
  key: 0,
  class: "book"
}, Se = { class: "book-date" }, Me = { class: "book-body" }, $e = {
  key: 1,
  class: "book-empty"
}, Le = { class: "card" }, Ne = { class: "card-head" }, Ee = { class: "head-actions" }, Fe = ["disabled"], Ve = { class: "feed" }, De = {
  key: 0,
  class: "list-empty plain"
}, Te = { class: "group" }, Ue = { class: "grid" }, Ie = { class: "card" }, Oe = { class: "card-head" }, Pe = { class: "rel-list" }, qe = { class: "avatar" }, Ye = { class: "rel-main" }, Ae = { class: "rel-top" }, Be = { class: "chip" }, Je = { class: "rel-meter" }, ze = { class: "meter-bar" }, He = { class: "item-meta" }, Qe = { class: "rel-actions" }, Ge = ["onClick"], Re = ["onClick"], We = {
  key: 0,
  class: "list-empty"
}, Ke = {
  key: 0,
  class: "ledger"
}, Xe = { class: "section-label" }, Ze = { class: "feed" }, ts = {
  key: 0,
  class: "list-empty plain"
}, es = { class: "card" }, ss = { class: "item-list" }, as = { class: "item-main" }, ls = { class: "item-meta" }, ns = { class: "chip" }, is = {
  key: 0,
  class: "list-empty"
}, os = { class: "group" }, rs = { class: "grid" }, ds = { class: "card" }, us = { class: "card-head" }, cs = { class: "chip muted" }, vs = { class: "toolbar-inline" }, ps = ["disabled"], _s = ["disabled"], ms = { class: "item-list" }, hs = { class: "item-main" }, bs = { class: "item-meta" }, gs = { class: "item-meta" }, ys = { class: "item-actions" }, fs = ["onClick"], ks = {
  key: 0,
  class: "list-empty"
}, ws = { class: "policy" }, Cs = { class: "select" }, js = { class: "select" }, xs = { class: "select" }, Ss = { class: "select" }, Ms = { class: "feed" }, $s = {
  key: 0,
  class: "list-empty plain"
}, Ls = { class: "group" }, Ns = { class: "grid" }, Es = { class: "card" }, Fs = { class: "card-head" }, Vs = { class: "chip muted" }, Ds = { class: "item-list" }, Ts = { class: "item-main" }, Us = { class: "item-meta" }, Is = {
  key: 0,
  class: "group-detail"
}, Os = {
  key: 0,
  class: "topics"
}, Ps = { class: "feed compact" }, qs = { class: "item-actions" }, Ys = ["onClick"], As = {
  key: 0,
  class: "list-empty"
}, Bs = { class: "group" }, Js = { class: "grid" }, zs = { class: "card audit-card" }, Hs = { class: "card-head" }, Qs = { class: "chip muted" }, Gs = { class: "usage-grid" }, Rs = { class: "usage-item" }, Ws = { class: "usage-item" }, Ks = { class: "usage-item" }, Xs = { class: "item-list" }, Zs = { class: "item-main" }, ta = { class: "item-meta" }, ea = {
  key: 0,
  class: "list-empty"
}, sa = { class: "card audit-card" }, aa = { class: "card-head" }, la = { class: "timeline" }, na = { class: "tl-body" }, ia = { class: "tl-head" }, oa = { class: "item-meta" }, ra = { class: "tl-detail" }, da = {
  key: 0,
  class: "list-empty plain"
}, ua = /* @__PURE__ */ ht({
  __name: "CompanionPage",
  setup(ca) {
    const { confirm: et } = kt(), o = u({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), V = u(!1), k = u(""), $ = u(""), L = u(""), D = u(""), T = u(""), U = u(""), I = u(""), O = u(!1), P = u(""), p = u({ target: "", motive: "", content: "", preferred_at: "" }), b = u({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), q = E(() => Object.entries(o.value.groups || {})), Y = E(() => (o.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), H = E(() => o.value.proactive?.receipts || []);
    function y(l) {
      $.value = l, setTimeout(() => {
        $.value === l && ($.value = "");
      }, 2e3);
    }
    const w = u(null);
    async function st() {
      try {
        const l = await fetch("/api/usage");
        l.ok && (w.value = await l.json());
      } catch {
      }
    }
    async function S() {
      V.value = !0, k.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        o.value = await l.json(), o.value?.policy && (b.value = { ...b.value, ...o.value.policy }), !C.value && (o.value?.journal || []).length && (C.value = String(o.value.journal[o.value.journal.length - 1].at || "").slice(0, 10));
      } catch (l) {
        k.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        V.value = !1;
      }
      st();
    }
    async function h(l, e) {
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: e }) });
        if (!s.ok) throw Error(await s.text());
        return await S(), await s.json().catch(() => ({}));
      } catch (s) {
        return k.value = s?.message || "操作失败", null;
      }
    }
    async function at() {
      L.value.trim() && (await h("add_agenda", { title: L.value, when: D.value, detail: T.value }), L.value = "", D.value = "", T.value = "");
    }
    async function G(l, e) {
      e.trim() && (await h(l, { content: e }), l === "journal" ? U.value = "" : I.value = "");
    }
    function lt(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    function R(l) {
      if (l.status === "completed") return { label: "已完成", cls: "chip-ok" };
      const e = new Date(String(l.start_at || "").replace(" ", "T"));
      return !Number.isNaN(e.getTime()) && e.getTime() <= Date.now() ? { label: "进行中", cls: "chip-warn" } : { label: "待开始", cls: "muted" };
    }
    async function W(l, e) {
      await h("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: e }) && y(`已调整 ${l}`);
    }
    async function nt() {
      if (!p.value.target.trim() || !p.value.content.trim()) return;
      await h("proactive_create", { ...p.value }) && (p.value = { target: "", motive: "", content: "", preferred_at: "" }, y("已创建主动候选"));
    }
    async function it(l) {
      await h("proactive_cancel", { id: l, reason: "dashboard_cancel" }), y("已取消候选");
    }
    async function ot() {
      await h("proactive_policy", { daily_limit: Number(b.value.daily_limit), per_target_limit: Number(b.value.per_target_limit), quiet_start: Number(b.value.quiet_start), quiet_end: Number(b.value.quiet_end) }), y("策略已保存");
    }
    const M = u("");
    async function K(l) {
      M.value = l;
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!e.ok) throw Error(await e.text());
        await S(), y("已由 LIFE 生成");
      } catch (e) {
        k.value = e?.message || "生成失败";
      } finally {
        M.value = "";
      }
    }
    async function rt() {
      const l = p.value.target.trim() || "user:owner";
      await h("proactive_suggest", { target: l, hint: p.value.motive }) && (p.value = { target: "", motive: "", content: "", preferred_at: "" }, y("已生成建议候选"));
    }
    const A = u(!1);
    async function dt() {
      A.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const e = await l.json();
        await S(), y(e?.skipped ? `本次跳过：${e.skipped}` : `已投递 ${e.delivered || 0} 条 · 拦截 ${e.blocked || 0} 条`);
      } catch (l) {
        k.value = l?.message || "投递失败";
      } finally {
        A.value = !1;
      }
    }
    const B = u(!1);
    async function ut() {
      B.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const e = await l.json();
        await S();
        const s = e?.applied;
        y(s ? `已自主规划：日程 ${s.agenda} · 主动 ${s.proactive} · 日记 ${s.journal}` : "本次没有新的规划");
      } catch (l) {
        k.value = l?.message || "规划失败";
      } finally {
        B.value = !1;
      }
    }
    function Q(l) {
      const e = (l || "").trim(), s = /* @__PURE__ */ new Date();
      s.setHours(0, 0, 0, 0);
      let r = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(e) ? (r = new Date(e), r.setHours(0, 0, 0, 0), r < s && r.setFullYear(s.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(e) && (r = new Date(s.getFullYear(), Number(e.slice(0, 2)) - 1, Number(e.slice(3, 5))), r < s && r.setFullYear(s.getFullYear() + 1)), !r || Number.isNaN(r.getTime()) ? null : Math.round((r.getTime() - s.getTime()) / 864e5);
    }
    const g = u({ title: "", date: "", repeat_yearly: !0, note: "" }), C = u(""), N = E(() => {
      const l = /* @__PURE__ */ new Set();
      for (const e of o.value.journal || []) {
        const s = String(e?.at || "").slice(0, 10);
        s && l.add(s);
      }
      return [...l].sort().reverse();
    }), X = E(() => {
      const l = (o.value.journal || []).filter((e) => String(e?.at || "").slice(0, 10) === C.value);
      return l.length ? l[l.length - 1] : null;
    });
    function Z(l) {
      const e = N.value;
      if (!e.length) return;
      const s = e.indexOf(C.value), r = Math.min(e.length - 1, Math.max(0, (s < 0 ? e.length - 1 : s) - l));
      C.value = e[r];
    }
    async function ct() {
      !g.value.title.trim() || !g.value.date.trim() || (await h("date_add", { ...g.value }), g.value = { title: "", date: "", repeat_yearly: !0, note: "" }, y("已添加重要日期"));
    }
    async function vt(l) {
      await h("date_delete", { id: l }), y("已删除");
    }
    async function pt() {
      await h("circadian_eat", { amount: 45 }), y("已用餐");
    }
    async function _t() {
      const l = await h("daily_agenda", {});
      y(l?.created ? `LIFE 已安排 ${l.created} 项活动` : "今天已有安排");
    }
    async function tt(l) {
      await et({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await h("journal_clear", { kind: l }), y("已清除"));
    }
    function J(l) {
      if (!l) return "";
      const e = new Date(l);
      return Number.isNaN(e.getTime()) ? l : e.toLocaleString();
    }
    return bt(S), (l, e) => (n(), i("main", Ct, [
      t("div", jt, [
        t("header", xt, [
          e[28] || (e[28] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", St, [
            t("button", {
              class: "btn btn-primary",
              disabled: B.value,
              onClick: ut
            }, a(B.value ? "规划中…" : "让 LIFE 规划"), 9, Mt),
            t("button", {
              class: "btn btn-tonal",
              disabled: V.value,
              onClick: S
            }, a(V.value ? "刷新中…" : "刷新"), 9, $t)
          ])
        ]),
        k.value ? (n(), i("p", Lt, a(k.value), 1)) : d("", !0),
        $.value ? (n(), i("p", Nt, a($.value), 1)) : d("", !0),
        t("section", Et, [
          t("article", Ft, [
            e[29] || (e[29] = z('<div class="stat-head" data-v-6ac991e6><span class="icon-badge tone-1" aria-hidden="true" data-v-6ac991e6><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-6ac991e6><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-6ac991e6></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-6ac991e6></path></svg></span><span class="stat-label" data-v-6ac991e6>关系对象</span></div>', 1)),
            t("strong", Vt, a(o.value.relationships?.length || 0), 1),
            e[30] || (e[30] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", Dt, [
            e[31] || (e[31] = z('<div class="stat-head" data-v-6ac991e6><span class="icon-badge tone-2" aria-hidden="true" data-v-6ac991e6><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-6ac991e6><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-6ac991e6></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-6ac991e6></path></svg></span><span class="stat-label" data-v-6ac991e6>活动日程</span></div>', 1)),
            t("strong", Tt, a(o.value.agenda?.filter((s) => s.status === "active").length || 0), 1),
            e[32] || (e[32] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", Ut, [
            e[33] || (e[33] = z('<div class="stat-head" data-v-6ac991e6><span class="icon-badge tone-3" aria-hidden="true" data-v-6ac991e6><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-6ac991e6><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-6ac991e6></path></svg></span><span class="stat-label" data-v-6ac991e6>待投递主动行为</span></div>', 1)),
            t("strong", It, a(Y.value.length), 1),
            t("span", Ot, "已投递 " + a(H.value.length) + " 次", 1)
          ]),
          t("article", Pt, [
            e[34] || (e[34] = z('<div class="stat-head" data-v-6ac991e6><span class="icon-badge tone-4" aria-hidden="true" data-v-6ac991e6><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-6ac991e6><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-6ac991e6></path></svg></span><span class="stat-label" data-v-6ac991e6>已观察群聊</span></div>', 1)),
            t("strong", qt, a(q.value.length), 1),
            e[35] || (e[35] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", Yt, [
          t("span", At, "精力 " + a(Math.round(o.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: x(["state-pill", { warn: (o.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + a(Math.round(o.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: x(["state-pill", { warn: (o.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + a(Math.round(o.value.circadian?.health ?? 100)), 3),
          o.value.circadian?.is_sleeping ? (n(), i("span", Bt, "睡眠中")) : d("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: pt
          }, "吃饭")
        ]),
        t("section", Jt, [
          e[47] || (e[47] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", zt, [
            t("article", Ht, [
              t("div", { class: "card-head" }, [
                e[36] || (e[36] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: _t
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: F(at, ["prevent"])
              }, [
                v(t("input", {
                  "onUpdate:modelValue": e[0] || (e[0] = (s) => L.value = s),
                  class: "input",
                  placeholder: "日程标题",
                  "aria-label": "日程标题"
                }, null, 512), [
                  [_, L.value]
                ]),
                v(t("input", {
                  "onUpdate:modelValue": e[1] || (e[1] = (s) => D.value = s),
                  class: "input",
                  placeholder: "时间，例如 2026-09-25 20:00",
                  "aria-label": "时间"
                }, null, 512), [
                  [_, D.value]
                ]),
                e[37] || (e[37] = t("button", {
                  class: "btn btn-primary",
                  type: "submit"
                }, "创建候选", -1)),
                v(t("textarea", {
                  "onUpdate:modelValue": e[2] || (e[2] = (s) => T.value = s),
                  class: "input area",
                  placeholder: "说明（可选）"
                }, null, 512), [
                  [_, T.value]
                ])
              ], 32),
              e[38] || (e[38] = t("h3", { class: "section-label" }, "待确认候选", -1)),
              t("ul", Qt, [
                (n(!0), i(c, null, m(o.value.calendar_candidates?.filter((s) => s.status === "pending_confirmation"), (s) => (n(), i("li", {
                  key: s.id,
                  class: "item"
                }, [
                  t("div", Gt, [
                    t("strong", null, a(s.title), 1),
                    t("span", Rt, a(s.when_text) + " · " + a(s.detail || "等待你确认"), 1)
                  ]),
                  t("div", Wt, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (r) => h("confirm_agenda", { id: s.id })
                    }, "确认", 8, Kt),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (r) => h("reject_agenda", { id: s.id })
                    }, "拒绝", 8, Xt)
                  ])
                ]))), 128)),
                o.value.calendar_candidates?.filter((s) => s.status === "pending_confirmation").length ? d("", !0) : (n(), i("li", Zt, "没有待确认的日程候选"))
              ]),
              e[39] || (e[39] = t("h3", { class: "section-label" }, [
                f("今天的日程 "),
                t("small", { class: "hint-inline" }, "LIFE 按时间自动推进")
              ], -1)),
              t("ul", te, [
                (n(!0), i(c, null, m(o.value.agenda, (s) => (n(), i("li", {
                  key: s.id,
                  class: "item"
                }, [
                  t("div", ee, [
                    t("div", se, [
                      t("strong", {
                        class: x({ done: s.status === "completed" })
                      }, a(s.title), 3),
                      t("span", {
                        class: x(["chip", R(s).cls])
                      }, a(R(s).label), 3)
                    ]),
                    t("span", ae, [
                      f(a(s.start_at), 1),
                      s.detail ? (n(), i(c, { key: 0 }, [
                        f(" · " + a(s.detail), 1)
                      ], 64)) : d("", !0)
                    ])
                  ])
                ]))), 128)),
                o.value.agenda?.length ? d("", !0) : (n(), i("li", le, "今天还没有安排，点右上角让 LIFE 安排。"))
              ])
            ]),
            t("article", ne, [
              t("div", ie, [
                e[40] || (e[40] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", oe, a((o.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: F(ct, ["prevent"])
              }, [
                v(t("input", {
                  "onUpdate:modelValue": e[3] || (e[3] = (s) => g.value.title = s),
                  class: "input",
                  placeholder: "名称，如 生日 / 纪念日",
                  "aria-label": "重要日期名称"
                }, null, 512), [
                  [_, g.value.title]
                ]),
                v(t("input", {
                  "onUpdate:modelValue": e[4] || (e[4] = (s) => g.value.date = s),
                  class: "input",
                  placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                  "aria-label": "重要日期"
                }, null, 512), [
                  [_, g.value.date]
                ]),
                v(t("input", {
                  "onUpdate:modelValue": e[5] || (e[5] = (s) => g.value.note = s),
                  class: "input",
                  placeholder: "备注（可选）",
                  "aria-label": "备注"
                }, null, 512), [
                  [_, g.value.note]
                ]),
                t("label", re, [
                  v(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": e[6] || (e[6] = (s) => g.value.repeat_yearly = s)
                  }, null, 512), [
                    [gt, g.value.repeat_yearly]
                  ]),
                  e[41] || (e[41] = f(" 每年重复", -1))
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !g.value.title.trim() || !g.value.date.trim()
                }, "添加", 8, de)
              ], 32),
              t("ul", ue, [
                (n(!0), i(c, null, m(o.value.important_dates, (s) => (n(), i("li", {
                  key: s.id,
                  class: "item"
                }, [
                  t("div", ce, [
                    t("strong", null, a(s.title), 1),
                    t("span", ve, [
                      f(a(s.date_text), 1),
                      Q(s.date_text) !== null ? (n(), i(c, { key: 0 }, [
                        f(" · " + a(Q(s.date_text) === 0 ? "就是今天" : Q(s.date_text) + " 天后"), 1)
                      ], 64)) : d("", !0),
                      s.note ? (n(), i(c, { key: 1 }, [
                        f(" · " + a(s.note), 1)
                      ], 64)) : d("", !0)
                    ])
                  ]),
                  t("div", pe, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (r) => vt(s.id)
                    }, "删除", 8, _e)
                  ])
                ]))), 128)),
                o.value.important_dates?.length ? d("", !0) : (n(), i("li", me, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", he, [
              t("div", be, [
                e[42] || (e[42] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", ge, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: e[7] || (e[7] = (s) => tt("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: M.value === "journal",
                    onClick: e[8] || (e[8] = (s) => K("journal"))
                  }, a(M.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, ye)
                ])
              ]),
              t("div", fe, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: !N.value.length,
                  onClick: e[9] || (e[9] = (s) => Z(-1))
                }, "← 前一日", 8, ke),
                v(t("select", {
                  "onUpdate:modelValue": e[10] || (e[10] = (s) => C.value = s),
                  class: "input tiny",
                  "aria-label": "选择日期"
                }, [
                  (n(!0), i(c, null, m(N.value, (s) => (n(), i("option", {
                    key: s,
                    value: s
                  }, a(s), 9, we))), 128)),
                  N.value.length ? d("", !0) : (n(), i("option", Ce, "暂无日记"))
                ], 512), [
                  [yt, C.value]
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: !N.value.length,
                  onClick: e[11] || (e[11] = (s) => Z(1))
                }, "后一日 →", 8, je)
              ]),
              X.value ? (n(), i("article", xe, [
                t("header", Se, [
                  f(a(C.value), 1),
                  e[43] || (e[43] = t("small", null, " · LIFE 的日记", -1))
                ]),
                t("div", Me, [
                  (n(!0), i(c, null, m(String(X.value.content || "").split(/\n+/), (s, r) => (n(), i("p", { key: r }, a(s), 1))), 128))
                ])
              ])) : (n(), i("p", $e, "这一天还没有日记。")),
              t("form", {
                class: "stack-form diary-manual",
                onSubmit: e[13] || (e[13] = F((s) => G("journal", U.value), ["prevent"]))
              }, [
                v(t("textarea", {
                  "onUpdate:modelValue": e[12] || (e[12] = (s) => U.value = s),
                  class: "input area",
                  placeholder: "也可以手写一篇今天的日记…"
                }, null, 512), [
                  [_, U.value]
                ]),
                e[44] || (e[44] = t("button", {
                  class: "btn btn-tonal btn-sm",
                  type: "submit"
                }, "写入日记", -1))
              ], 32)
            ]),
            t("article", Le, [
              t("div", Ne, [
                e[45] || (e[45] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", Ee, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: e[14] || (e[14] = (s) => tt("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: M.value === "dream",
                    onClick: e[15] || (e[15] = (s) => K("dream"))
                  }, a(M.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, Fe)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: e[17] || (e[17] = F((s) => G("dream", I.value), ["prevent"]))
              }, [
                v(t("textarea", {
                  "onUpdate:modelValue": e[16] || (e[16] = (s) => I.value = s),
                  class: "input area",
                  placeholder: "记录一个梦境或睡眠反思…"
                }, null, 512), [
                  [_, I.value]
                ]),
                e[46] || (e[46] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "记录梦境", -1))
              ], 32),
              t("ol", Ve, [
                (n(!0), i(c, null, m(o.value.dreams, (s) => (n(), i("li", {
                  key: s.id
                }, [
                  t("time", null, a(s.at), 1),
                  t("p", null, a(s.content), 1)
                ]))), 128)),
                o.value.dreams?.length ? d("", !0) : (n(), i("li", De, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", Te, [
          e[50] || (e[50] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", Ue, [
            t("article", Ie, [
              t("div", Oe, [
                e[48] || (e[48] = t("h2", { class: "card-title" }, "关系账本", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: e[18] || (e[18] = (s) => O.value = !O.value)
                }, a(O.value ? "隐藏事件" : "查看事件账本"), 1)
              ]),
              t("ul", Pe, [
                (n(!0), i(c, null, m(o.value.relationships, (s) => (n(), i("li", {
                  key: s.user_id,
                  class: "rel"
                }, [
                  t("span", qe, a((s.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", Ye, [
                    t("div", Ae, [
                      t("strong", null, a(s.user_id), 1),
                      t("span", Be, a(s.stage), 1)
                    ]),
                    t("div", Je, [
                      t("div", ze, [
                        t("i", {
                          style: ft({ width: lt(s.affinity) })
                        }, null, 4)
                      ]),
                      t("b", null, a(Math.round((s.affinity || 0) * 100)) + "%", 1)
                    ]),
                    t("span", He, "最近互动：" + a(s.last_seen || "暂无"), 1)
                  ]),
                  t("div", Qe, [
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      title: "更亲近",
                      onClick: (r) => W(s.user_id, 0.05)
                    }, "+", 8, Ge),
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      title: "更疏远",
                      onClick: (r) => W(s.user_id, -0.05)
                    }, "−", 8, Re)
                  ])
                ]))), 128)),
                o.value.relationships?.length ? d("", !0) : (n(), i("li", We, "暂无关系记录"))
              ]),
              O.value ? (n(), i("div", Ke, [
                t("h3", Xe, "事件账本（最近 " + a(o.value.relationship_ledger?.length || 0) + " 条）", 1),
                t("ol", Ze, [
                  (n(!0), i(c, null, m(o.value.relationship_ledger, (s) => (n(), i("li", {
                    key: s.id
                  }, [
                    t("time", null, a(J(s.created_at)), 1),
                    t("p", null, [
                      t("strong", null, a(s.user_id), 1),
                      f(" · " + a(s.event_key) + " ", 1),
                      t("span", {
                        class: x(s.delta >= 0 ? "pos" : "neg")
                      }, a(s.delta >= 0 ? "+" : "") + a(s.delta), 3),
                      f(" · " + a(s.reason) + " (" + a(s.channel) + ")", 1)
                    ])
                  ]))), 128)),
                  o.value.relationship_ledger?.length ? d("", !0) : (n(), i("li", ts, "暂无关系事件"))
                ])
              ])) : d("", !0)
            ]),
            t("article", es, [
              e[49] || (e[49] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", ss, [
                (n(!0), i(c, null, m(o.value.persona_evolution, (s) => (n(), i("li", {
                  key: s.id,
                  class: "item trait-item"
                }, [
                  t("div", as, [
                    t("strong", null, a(s.trait), 1),
                    t("span", ls, "支持 " + a(s.support_count) + " 次 · 置信度 " + a(Math.round((s.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", ns, a(s.value), 1)
                ]))), 128)),
                o.value.persona_evolution?.length ? d("", !0) : (n(), i("li", is, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", os, [
          e[60] || (e[60] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", rs, [
            t("article", ds, [
              t("div", us, [
                e[51] || (e[51] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", cs, "待投递 " + a(Y.value.length), 1)
              ]),
              t("div", vs, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: rt
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: A.value,
                  onClick: dt
                }, a(A.value ? "检查中…" : "立即检查投递"), 9, ps)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: F(nt, ["prevent"])
              }, [
                v(t("input", {
                  "onUpdate:modelValue": e[19] || (e[19] = (s) => p.value.target = s),
                  class: "input",
                  placeholder: "目标：session:<会话ID> / user:<QQ> / group:<群号>",
                  "aria-label": "主动对象"
                }, null, 512), [
                  [_, p.value.target]
                ]),
                v(t("input", {
                  "onUpdate:modelValue": e[20] || (e[20] = (s) => p.value.motive = s),
                  class: "input",
                  placeholder: "动机，如 care / reminder",
                  "aria-label": "动机"
                }, null, 512), [
                  [_, p.value.motive]
                ]),
                v(t("input", {
                  "onUpdate:modelValue": e[21] || (e[21] = (s) => p.value.preferred_at = s),
                  class: "input",
                  placeholder: "期望时间（可选，ISO）",
                  "aria-label": "期望时间"
                }, null, 512), [
                  [_, p.value.preferred_at]
                ]),
                v(t("textarea", {
                  "onUpdate:modelValue": e[22] || (e[22] = (s) => p.value.content = s),
                  class: "input area",
                  placeholder: "想说的内容…"
                }, null, 512), [
                  [_, p.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !p.value.target.trim() || !p.value.content.trim()
                }, "创建候选", 8, _s)
              ], 32),
              e[56] || (e[56] = t("h3", { class: "section-label" }, "候选队列", -1)),
              t("ul", ms, [
                (n(!0), i(c, null, m(Y.value, (s) => (n(), i("li", {
                  key: s.id,
                  class: "item"
                }, [
                  t("div", hs, [
                    t("strong", null, a(s.target) + " · " + a(s.motive), 1),
                    t("span", bs, a(s.content), 1),
                    t("span", gs, "状态 " + a(s.status) + " · " + a(J(s.created_at)), 1)
                  ]),
                  t("div", ys, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (r) => it(s.id)
                    }, "取消", 8, fs)
                  ])
                ]))), 128)),
                Y.value.length ? d("", !0) : (n(), i("li", ks, "没有待投递候选"))
              ]),
              e[57] || (e[57] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", ws, [
                t("label", Cs, [
                  e[52] || (e[52] = t("span", null, "每日上限", -1)),
                  v(t("input", {
                    "onUpdate:modelValue": e[23] || (e[23] = (s) => b.value.daily_limit = s),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      b.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", js, [
                  e[53] || (e[53] = t("span", null, "单人上限", -1)),
                  v(t("input", {
                    "onUpdate:modelValue": e[24] || (e[24] = (s) => b.value.per_target_limit = s),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      b.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", xs, [
                  e[54] || (e[54] = t("span", null, "免打扰起", -1)),
                  v(t("input", {
                    "onUpdate:modelValue": e[25] || (e[25] = (s) => b.value.quiet_start = s),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      b.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Ss, [
                  e[55] || (e[55] = t("span", null, "免打扰止", -1)),
                  v(t("input", {
                    "onUpdate:modelValue": e[26] || (e[26] = (s) => b.value.quiet_end = s),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      b.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: ot
                }, "保存策略")
              ]),
              e[58] || (e[58] = t("p", { class: "helper-inline" }, [
                f("免打扰起止相同即关闭；target 用 "),
                t("code", null, "session:<会话ID>"),
                f(" 可直接发到对话。")
              ], -1)),
              e[59] || (e[59] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", Ms, [
                (n(!0), i(c, null, m(H.value, (s) => (n(), i("li", {
                  key: s.id
                }, [
                  t("time", null, a(J(s.created_at)), 1),
                  t("p", null, a(s.phase) + " · " + a(s.content), 1)
                ]))), 128)),
                H.value.length ? d("", !0) : (n(), i("li", $s, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", Ls, [
          e[62] || (e[62] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", Ns, [
            t("article", Es, [
              t("div", Fs, [
                e[61] || (e[61] = t("h2", { class: "card-title" }, "群聊观察", -1)),
                t("span", Vs, a(q.value.length), 1)
              ]),
              t("ul", Ds, [
                (n(!0), i(c, null, m(q.value, ([s, r]) => (n(), i("li", {
                  key: s,
                  class: "item group-item"
                }, [
                  t("div", Ts, [
                    t("strong", null, a(s), 1),
                    t("span", Us, "情绪 " + a(r.mood || "—") + " · " + a(r.messages?.length || 0) + " 条观察 · " + a(r.topics?.length || 0) + " 个话题", 1),
                    P.value === s ? (n(), i("div", Is, [
                      r.topics?.length ? (n(), i("div", Os, [
                        (n(!0), i(c, null, m(r.topics, (j) => (n(), i("span", {
                          key: j.topic,
                          class: "chip muted"
                        }, a(j.topic) + " · " + a(Math.round(j.score)), 1))), 128))
                      ])) : d("", !0),
                      t("ol", Ps, [
                        (n(!0), i(c, null, m(r.messages, (j, mt) => (n(), i("li", { key: mt }, [
                          t("time", null, a(J(j.created_at)), 1),
                          t("p", null, [
                            t("strong", null, a(j.user_id), 1),
                            f("：" + a(j.content), 1)
                          ])
                        ]))), 128))
                      ])
                    ])) : d("", !0)
                  ]),
                  t("div", qs, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (j) => P.value = P.value === s ? "" : s
                    }, a(P.value === s ? "收起" : "展开"), 9, Ys)
                  ])
                ]))), 128)),
                q.value.length ? d("", !0) : (n(), i("li", As, "群聊观察尚未启用或没有消息。"))
              ])
            ])
          ])
        ]),
        t("section", Bs, [
          e[68] || (e[68] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", Js, [
            t("article", zs, [
              t("div", Hs, [
                e[63] || (e[63] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", Qs, a(w.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", Gs, [
                t("div", Rs, [
                  t("strong", null, a((w.value?.total_tokens || 0).toLocaleString()), 1),
                  e[64] || (e[64] = t("span", null, "总 Token", -1))
                ]),
                t("div", Ws, [
                  t("strong", null, a((w.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  e[65] || (e[65] = t("span", null, "输入", -1))
                ]),
                t("div", Ks, [
                  t("strong", null, a((w.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  e[66] || (e[66] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", Xs, [
                (n(!0), i(c, null, m(w.value?.by_model || {}, (s, r) => (n(), i("li", {
                  key: r,
                  class: "item"
                }, [
                  t("div", Zs, [
                    t("strong", null, a(r), 1),
                    t("span", ta, a((s.total || 0).toLocaleString()) + " tokens · " + a(s.count) + " 次", 1)
                  ])
                ]))), 128)),
                !w.value || !Object.keys(w.value.by_model || {}).length ? (n(), i("li", ea, "暂无用量记录")) : d("", !0)
              ])
            ]),
            t("article", sa, [
              t("div", aa, [
                e[67] || (e[67] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: e[27] || (e[27] = (s) => h("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", la, [
                (n(!0), i(c, null, m(o.value.audit, (s) => (n(), i("li", {
                  key: s.at + s.kind
                }, [
                  t("span", {
                    class: x(["dot", s.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", na, [
                    t("div", ia, [
                      t("strong", null, a(s.kind), 1),
                      t("span", {
                        class: x(["chip", s.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, a(s.outcome), 3),
                      t("time", null, a(s.at), 1)
                    ]),
                    t("p", oa, a(s.target), 1),
                    t("p", ra, a(s.detail), 1)
                  ])
                ]))), 128)),
                o.value.audit?.length ? d("", !0) : (n(), i("li", da, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), _a = /* @__PURE__ */ wt(ua, [["__scopeId", "data-v-6ac991e6"]]);
export {
  _a as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-6ac991e6]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-6ac991e6]{max-width:1180px;margin:0 auto}.page-header[data-v-6ac991e6]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-6ac991e6]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-6ac991e6]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-6ac991e6]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-6ac991e6]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-6ac991e6]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-6ac991e6]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-6ac991e6]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-6ac991e6]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-6ac991e6]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-6ac991e6]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-6ac991e6]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-6ac991e6]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-6ac991e6]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-6ac991e6]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-6ac991e6]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-6ac991e6]{display:flex;align-items:center;gap:10px}.stat-label[data-v-6ac991e6]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-6ac991e6]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-6ac991e6]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-6ac991e6]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-6ac991e6]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-6ac991e6]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-6ac991e6]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-6ac991e6]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-6ac991e6]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-6ac991e6]{margin-bottom:var(--space-lg)}.group-title[data-v-6ac991e6]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-6ac991e6]{margin-bottom:0}.card[data-v-6ac991e6]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-6ac991e6]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-6ac991e6]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-6ac991e6]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-6ac991e6]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-6ac991e6]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-6ac991e6]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-6ac991e6]{background:#fff1dc;color:#7a4400}.input[data-v-6ac991e6]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-6ac991e6]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-6ac991e6]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-6ac991e6]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-6ac991e6]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-6ac991e6]{grid-column:1/-1}.stack-form[data-v-6ac991e6]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-6ac991e6]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-6ac991e6]{align-self:flex-start}.item-list[data-v-6ac991e6],.rel-list[data-v-6ac991e6],.feed[data-v-6ac991e6],.timeline[data-v-6ac991e6]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-6ac991e6]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-6ac991e6]{align-items:flex-start}.item[data-v-6ac991e6]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-6ac991e6]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-6ac991e6]{font-size:14px;font-weight:600}.item-main strong.done[data-v-6ac991e6]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-6ac991e6]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-6ac991e6]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-6ac991e6]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-6ac991e6]{background:transparent;border:0}.check-label[data-v-6ac991e6]{display:flex;align-items:center}.check-line[data-v-6ac991e6]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-6ac991e6]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-6ac991e6]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-6ac991e6]{background:#fff1dc;color:#7a4400}.head-actions[data-v-6ac991e6]{display:flex;gap:8px}.item-row[data-v-6ac991e6]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hint-inline[data-v-6ac991e6]{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}.helper-inline[data-v-6ac991e6]{margin:8px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.helper-inline code[data-v-6ac991e6]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:2px 6px;border-radius:6px}.diary-nav[data-v-6ac991e6]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.diary-nav .input.tiny[data-v-6ac991e6]{width:auto;min-width:132px}.book[data-v-6ac991e6]{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:22px 26px;box-shadow:var(--shadow-1)}.book-date[data-v-6ac991e6]{font-size:15px;font-weight:700;color:var(--md-primary);letter-spacing:.02em;border-bottom:1px solid var(--md-outline-variant);padding-bottom:9px;margin-bottom:14px}.book-date small[data-v-6ac991e6]{font-weight:500;color:var(--md-on-surface-variant)}.book-body p[data-v-6ac991e6]{margin:0 0 12px;line-height:1.95;font-size:14.5px;color:var(--md-on-surface);text-indent:2em}.book-empty[data-v-6ac991e6]{padding:34px;text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:14px;border:1px dashed var(--md-outline-variant)}.diary-manual[data-v-6ac991e6]{margin-top:14px;align-items:flex-start}.check-label input[data-v-6ac991e6]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-6ac991e6]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-6ac991e6]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-6ac991e6]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-6ac991e6]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-6ac991e6],.rel-meter[data-v-6ac991e6]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-6ac991e6]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-6ac991e6]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-6ac991e6]{font-size:12px}.rel-actions[data-v-6ac991e6]{display:flex;gap:4px}.ledger[data-v-6ac991e6]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-6ac991e6]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-6ac991e6]{padding:8px 12px}.feed time[data-v-6ac991e6],.timeline time[data-v-6ac991e6]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-6ac991e6]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-6ac991e6]{color:var(--md-success);font-weight:700}.neg[data-v-6ac991e6]{color:var(--md-error);font-weight:700}.policy[data-v-6ac991e6]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-6ac991e6]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-6ac991e6]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-6ac991e6]{margin-top:6px}.audit-card[data-v-6ac991e6]{margin-bottom:var(--space-lg)}.usage-grid[data-v-6ac991e6]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-6ac991e6]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-6ac991e6]{font-size:20px;font-weight:700}.usage-item span[data-v-6ac991e6]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-6ac991e6]{position:relative}.timeline li[data-v-6ac991e6]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-6ac991e6]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-6ac991e6]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-6ac991e6]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-6ac991e6]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-6ac991e6]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-6ac991e6]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-6ac991e6]{font-size:13.5px;font-weight:650}.tl-detail[data-v-6ac991e6]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-6ac991e6]{grid-template-columns:repeat(2,1fr)}.grid[data-v-6ac991e6],.agenda-form[data-v-6ac991e6]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-6ac991e6]{padding:var(--space-lg)}.header-actions[data-v-6ac991e6]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
