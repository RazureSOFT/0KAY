import { defineComponent as kt, ref as r, computed as E, onMounted as wt, openBlock as n, createElementBlock as o, createElementVNode as t, toDisplayString as a, createCommentVNode as u, createStaticVNode as H, normalizeClass as $, withModifiers as F, withDirectives as c, vModelText as _, Fragment as p, renderList as b, createTextVNode as f, vModelCheckbox as Ct, normalizeStyle as xt } from "vue";
import { u as $t, _ as jt } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const St = { class: "page" }, Lt = { class: "page-inner" }, Nt = { class: "page-header" }, Mt = { class: "header-actions" }, Tt = ["disabled"], Et = ["disabled"], Ft = {
  key: 0,
  class: "error-banner"
}, Dt = {
  key: 1,
  class: "notice"
}, Vt = { class: "stat-grid" }, Ut = { class: "stat-card" }, It = { class: "stat-value" }, Ot = { class: "stat-card" }, Pt = { class: "stat-value" }, qt = { class: "stat-card" }, Yt = { class: "stat-value" }, At = { class: "stat-hint" }, Bt = { class: "stat-card" }, Jt = { class: "stat-value" }, zt = { class: "life-state" }, Ht = { class: "state-pill" }, Qt = {
  key: 0,
  class: "state-pill"
}, Gt = { class: "group" }, Kt = { class: "grid" }, Rt = { class: "card" }, Wt = { class: "item-list" }, Xt = { class: "item-main" }, Zt = { class: "item-meta" }, te = { class: "item-actions" }, ee = ["onClick"], se = ["onClick"], ae = {
  key: 0,
  class: "list-empty"
}, le = { class: "item-list" }, ne = { class: "item-main" }, oe = { class: "item-row" }, ie = { class: "item-meta" }, de = {
  key: 0,
  class: "list-empty"
}, re = { class: "card" }, ue = { class: "card-head" }, ce = { class: "chip muted" }, pe = { class: "check-line" }, ve = ["disabled"], _e = { class: "item-list" }, me = { class: "item-main" }, be = { class: "item-meta" }, he = { class: "item-actions" }, ge = ["onClick"], ye = {
  key: 0,
  class: "list-empty"
}, fe = { class: "card" }, ke = { class: "card-head" }, we = { class: "head-actions" }, Ce = ["disabled"], xe = { class: "book" }, $e = { class: "book-nav" }, je = ["disabled"], Se = ["disabled"], Le = { class: "book-page" }, Ne = { class: "book-heading" }, Me = {
  key: 0,
  class: "book-body"
}, Te = {
  key: 1,
  class: "book-empty"
}, Ee = { class: "card" }, Fe = { class: "card-head" }, De = { class: "head-actions" }, Ve = ["disabled"], Ue = { class: "feed" }, Ie = {
  key: 0,
  class: "list-empty plain"
}, Oe = { class: "group" }, Pe = { class: "grid" }, qe = { class: "card" }, Ye = { class: "card-head" }, Ae = { class: "rel-list" }, Be = { class: "avatar" }, Je = { class: "rel-main" }, ze = { class: "rel-top" }, He = { class: "chip" }, Qe = { class: "rel-meter" }, Ge = { class: "meter-bar" }, Ke = { class: "item-meta" }, Re = { class: "rel-actions" }, We = ["onClick"], Xe = ["onClick"], Ze = {
  key: 0,
  class: "list-empty"
}, ts = {
  key: 0,
  class: "ledger"
}, es = { class: "section-label" }, ss = { class: "feed" }, as = {
  key: 0,
  class: "list-empty plain"
}, ls = { class: "card" }, ns = { class: "item-list" }, os = { class: "item-main" }, is = { class: "item-meta" }, ds = { class: "chip" }, rs = {
  key: 0,
  class: "list-empty"
}, us = { class: "group" }, cs = { class: "grid" }, ps = { class: "card" }, vs = { class: "card-head" }, _s = { class: "chip muted" }, ms = { class: "toolbar-inline" }, bs = ["disabled"], hs = ["disabled"], gs = { class: "item-list" }, ys = { class: "item-main" }, fs = { class: "item-meta" }, ks = { class: "item-meta" }, ws = { class: "item-actions" }, Cs = ["onClick"], xs = {
  key: 0,
  class: "list-empty"
}, $s = { class: "policy" }, js = { class: "select" }, Ss = { class: "select" }, Ls = { class: "select" }, Ns = { class: "select" }, Ms = { class: "feed" }, Ts = {
  key: 0,
  class: "list-empty plain"
}, Es = { class: "group" }, Fs = { class: "grid" }, Ds = { class: "card" }, Vs = { class: "card-head" }, Us = { class: "chip muted" }, Is = { class: "item-list" }, Os = { class: "item-main" }, Ps = { class: "item-meta" }, qs = {
  key: 0,
  class: "group-detail"
}, Ys = {
  key: 0,
  class: "topics"
}, As = { class: "feed compact" }, Bs = { class: "item-actions" }, Js = ["onClick"], zs = {
  key: 0,
  class: "list-empty"
}, Hs = { class: "group" }, Qs = { class: "grid" }, Gs = { class: "card audit-card" }, Ks = { class: "card-head" }, Rs = { class: "chip muted" }, Ws = { class: "usage-grid" }, Xs = { class: "usage-item" }, Zs = { class: "usage-item" }, ta = { class: "usage-item" }, ea = { class: "item-list" }, sa = { class: "item-main" }, aa = { class: "item-meta" }, la = {
  key: 0,
  class: "list-empty"
}, na = { class: "card audit-card" }, oa = { class: "card-head" }, ia = { class: "timeline" }, da = { class: "tl-body" }, ra = { class: "tl-head" }, ua = { class: "item-meta" }, ca = { class: "tl-detail" }, pa = {
  key: 0,
  class: "list-empty plain"
}, va = /* @__PURE__ */ kt({
  __name: "CompanionPage",
  setup(_a) {
    const { confirm: nt } = $t(), i = r({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), D = r(!1), k = r(""), L = r(""), N = r(""), V = r(""), U = r(""), I = r(""), O = r(""), W = () => {
      const l = /* @__PURE__ */ new Date(), e = (s) => String(s).padStart(2, "0");
      return `${l.getFullYear()}-${e(l.getMonth() + 1)}-${e(l.getDate())}`;
    }, M = r(W()), w = r({ date: "", content: "", previous: null, next: null }), T = r(!1), X = E(() => (w.value.content || "").split(/\n{2,}/).map((l) => l.trim()).filter(Boolean));
    async function Q(l = M.value) {
      T.value = !0;
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "journal_page", payload: { date: l } }) });
        if (!e.ok) throw Error(await e.text());
        const s = await e.json();
        w.value = { date: s?.date || l, content: s?.content || "", previous: s?.previous || null, next: s?.next || null }, M.value = w.value.date;
      } catch (e) {
        k.value = e?.message || "无法读取日记";
      } finally {
        T.value = !1;
      }
    }
    function Z(l) {
      const e = l === "previous" ? w.value.previous : w.value.next;
      e && Q(e);
    }
    const P = r(!1), q = r(""), v = r({ target: "", motive: "", content: "", preferred_at: "" }), h = r({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), Y = E(() => Object.entries(i.value.groups || {})), A = E(() => (i.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), G = E(() => i.value.proactive?.receipts || []), ot = W(), K = E(() => (i.value.agenda || []).filter((l) => {
      const e = String(l.start_at || "").replace("T", " ");
      return !e || e.slice(0, 10) >= ot;
    }));
    function y(l) {
      L.value = l, setTimeout(() => {
        L.value === l && (L.value = "");
      }, 2e3);
    }
    const C = r(null);
    async function it() {
      try {
        const l = await fetch("/api/usage");
        l.ok && (C.value = await l.json());
      } catch {
      }
    }
    async function j() {
      D.value = !0, k.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        i.value = await l.json(), i.value?.policy && (h.value = { ...h.value, ...i.value.policy });
      } catch (l) {
        k.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        D.value = !1;
      }
      it(), Q();
    }
    async function m(l, e) {
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: e }) });
        if (!s.ok) throw Error(await s.text());
        return await j(), await s.json().catch(() => ({}));
      } catch (s) {
        return k.value = s?.message || "操作失败", null;
      }
    }
    async function dt() {
      N.value.trim() && (await m("add_agenda", { title: N.value, when: V.value, detail: U.value }), N.value = "", V.value = "", U.value = "");
    }
    async function tt(l, e) {
      e.trim() && (await m(l, { content: e }), l === "journal" ? I.value = "" : O.value = "");
    }
    function rt(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    function et(l) {
      if (l.status === "completed") return { label: "已完成", cls: "chip-ok" };
      const e = new Date(String(l.start_at || "").replace(" ", "T"));
      return !Number.isNaN(e.getTime()) && e.getTime() <= Date.now() ? { label: "进行中", cls: "chip-warn" } : { label: "待开始", cls: "muted" };
    }
    async function st(l, e) {
      await m("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: e }) && y(`已调整 ${l}`);
    }
    async function ut() {
      if (!v.value.target.trim() || !v.value.content.trim()) return;
      await m("proactive_create", { ...v.value }) && (v.value = { target: "", motive: "", content: "", preferred_at: "" }, y("已创建主动候选"));
    }
    async function ct(l) {
      await m("proactive_cancel", { id: l, reason: "dashboard_cancel" }), y("已取消候选");
    }
    async function pt() {
      await m("proactive_policy", { daily_limit: Number(h.value.daily_limit), per_target_limit: Number(h.value.per_target_limit), quiet_start: Number(h.value.quiet_start), quiet_end: Number(h.value.quiet_end) }), y("策略已保存");
    }
    const S = r("");
    async function at(l) {
      S.value = l;
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!e.ok) throw Error(await e.text());
        await j(), y("已由 LIFE 生成");
      } catch (e) {
        k.value = e?.message || "生成失败";
      } finally {
        S.value = "";
      }
    }
    async function vt() {
      const l = v.value.target.trim() || "user:owner";
      await m("proactive_suggest", { target: l, hint: v.value.motive }) && (v.value = { target: "", motive: "", content: "", preferred_at: "" }, y("已生成建议候选"));
    }
    const B = r(!1);
    async function _t() {
      B.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const e = await l.json();
        await j(), y(e?.skipped ? `本次跳过：${e.skipped}` : `已投递 ${e.delivered || 0} 条 · 拦截 ${e.blocked || 0} 条`);
      } catch (l) {
        k.value = l?.message || "投递失败";
      } finally {
        B.value = !1;
      }
    }
    const J = r(!1);
    async function mt() {
      J.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const e = await l.json();
        await j();
        const s = e?.applied;
        y(s ? `已自主规划：日程 ${s.agenda} · 主动 ${s.proactive} · 日记 ${s.journal}` : "本次没有新的规划");
      } catch (l) {
        k.value = l?.message || "规划失败";
      } finally {
        J.value = !1;
      }
    }
    function R(l) {
      const e = (l || "").trim(), s = /* @__PURE__ */ new Date();
      s.setHours(0, 0, 0, 0);
      let d = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(e) ? (d = new Date(e), d.setHours(0, 0, 0, 0), d < s && d.setFullYear(s.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(e) && (d = new Date(s.getFullYear(), Number(e.slice(0, 2)) - 1, Number(e.slice(3, 5))), d < s && d.setFullYear(s.getFullYear() + 1)), !d || Number.isNaN(d.getTime()) ? null : Math.round((d.getTime() - s.getTime()) / 864e5);
    }
    const g = r({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function bt() {
      !g.value.title.trim() || !g.value.date.trim() || (await m("date_add", { ...g.value }), g.value = { title: "", date: "", repeat_yearly: !0, note: "" }, y("已添加重要日期"));
    }
    async function ht(l) {
      await m("date_delete", { id: l }), y("已删除");
    }
    async function gt() {
      await m("circadian_eat", { amount: 45 }), y("已用餐");
    }
    async function yt() {
      const l = await m("daily_agenda", {});
      y(l?.created ? `LIFE 已安排 ${l.created} 项活动` : "今天已有安排");
    }
    async function lt(l) {
      await nt({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await m("journal_clear", { kind: l }), y("已清除"));
    }
    function z(l) {
      if (!l) return "";
      const e = new Date(l);
      return Number.isNaN(e.getTime()) ? l : e.toLocaleString();
    }
    return wt(j), (l, e) => (n(), o("main", St, [
      t("div", Lt, [
        t("header", Nt, [
          e[29] || (e[29] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", Mt, [
            t("button", {
              class: "btn btn-primary",
              disabled: J.value,
              onClick: mt
            }, a(J.value ? "规划中…" : "让 LIFE 规划"), 9, Tt),
            t("button", {
              class: "btn btn-tonal",
              disabled: D.value,
              onClick: j
            }, a(D.value ? "刷新中…" : "刷新"), 9, Et)
          ])
        ]),
        k.value ? (n(), o("p", Ft, a(k.value), 1)) : u("", !0),
        L.value ? (n(), o("p", Dt, a(L.value), 1)) : u("", !0),
        t("section", Vt, [
          t("article", Ut, [
            e[30] || (e[30] = H('<div class="stat-head" data-v-eeab4619><span class="icon-badge tone-1" aria-hidden="true" data-v-eeab4619><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-eeab4619><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-eeab4619></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-eeab4619></path></svg></span><span class="stat-label" data-v-eeab4619>关系对象</span></div>', 1)),
            t("strong", It, a(i.value.relationships?.length || 0), 1),
            e[31] || (e[31] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", Ot, [
            e[32] || (e[32] = H('<div class="stat-head" data-v-eeab4619><span class="icon-badge tone-2" aria-hidden="true" data-v-eeab4619><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-eeab4619><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-eeab4619></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-eeab4619></path></svg></span><span class="stat-label" data-v-eeab4619>活动日程</span></div>', 1)),
            t("strong", Pt, a(K.value.filter((s) => s.status === "active").length), 1),
            e[33] || (e[33] = t("span", { class: "stat-hint" }, "今天起待进行", -1))
          ]),
          t("article", qt, [
            e[34] || (e[34] = H('<div class="stat-head" data-v-eeab4619><span class="icon-badge tone-3" aria-hidden="true" data-v-eeab4619><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-eeab4619><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-eeab4619></path></svg></span><span class="stat-label" data-v-eeab4619>待投递主动行为</span></div>', 1)),
            t("strong", Yt, a(A.value.length), 1),
            t("span", At, "已投递 " + a(G.value.length) + " 次", 1)
          ]),
          t("article", Bt, [
            e[35] || (e[35] = H('<div class="stat-head" data-v-eeab4619><span class="icon-badge tone-4" aria-hidden="true" data-v-eeab4619><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-eeab4619><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-eeab4619></path></svg></span><span class="stat-label" data-v-eeab4619>已观察群聊</span></div>', 1)),
            t("strong", Jt, a(Y.value.length), 1),
            e[36] || (e[36] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", zt, [
          t("span", Ht, "精力 " + a(Math.round(i.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: $(["state-pill", { warn: (i.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + a(Math.round(i.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: $(["state-pill", { warn: (i.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + a(Math.round(i.value.circadian?.health ?? 100)), 3),
          i.value.circadian?.is_sleeping ? (n(), o("span", Qt, "睡眠中")) : u("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: gt
          }, "吃饭")
        ]),
        t("section", Gt, [
          e[47] || (e[47] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", Kt, [
            t("article", Rt, [
              t("div", { class: "card-head" }, [
                e[37] || (e[37] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: yt
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: F(dt, ["prevent"])
              }, [
                c(t("input", {
                  "onUpdate:modelValue": e[0] || (e[0] = (s) => N.value = s),
                  class: "input",
                  placeholder: "日程标题",
                  "aria-label": "日程标题"
                }, null, 512), [
                  [_, N.value]
                ]),
                c(t("input", {
                  "onUpdate:modelValue": e[1] || (e[1] = (s) => V.value = s),
                  class: "input",
                  placeholder: "时间，例如 2026-09-25 20:00",
                  "aria-label": "时间"
                }, null, 512), [
                  [_, V.value]
                ]),
                e[38] || (e[38] = t("button", {
                  class: "btn btn-primary",
                  type: "submit"
                }, "创建候选", -1)),
                c(t("textarea", {
                  "onUpdate:modelValue": e[2] || (e[2] = (s) => U.value = s),
                  class: "input area",
                  placeholder: "说明（可选）"
                }, null, 512), [
                  [_, U.value]
                ])
              ], 32),
              e[39] || (e[39] = t("h3", { class: "section-label" }, "待确认候选", -1)),
              t("ul", Wt, [
                (n(!0), o(p, null, b(i.value.calendar_candidates?.filter((s) => s.status === "pending_confirmation"), (s) => (n(), o("li", {
                  key: s.id,
                  class: "item"
                }, [
                  t("div", Xt, [
                    t("strong", null, a(s.title), 1),
                    t("span", Zt, a(s.when_text) + " · " + a(s.detail || "等待你确认"), 1)
                  ]),
                  t("div", te, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (d) => m("confirm_agenda", { id: s.id })
                    }, "确认", 8, ee),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (d) => m("reject_agenda", { id: s.id })
                    }, "拒绝", 8, se)
                  ])
                ]))), 128)),
                i.value.calendar_candidates?.filter((s) => s.status === "pending_confirmation").length ? u("", !0) : (n(), o("li", ae, "没有待确认的日程候选"))
              ]),
              e[40] || (e[40] = t("h3", { class: "section-label" }, [
                f("今天的日程 "),
                t("small", { class: "hint-inline" }, "LIFE 按时间自动推进")
              ], -1)),
              t("ul", le, [
                (n(!0), o(p, null, b(K.value, (s) => (n(), o("li", {
                  key: s.id,
                  class: "item"
                }, [
                  t("div", ne, [
                    t("div", oe, [
                      t("strong", {
                        class: $({ done: s.status === "completed" })
                      }, a(s.title), 3),
                      t("span", {
                        class: $(["chip", et(s).cls])
                      }, a(et(s).label), 3)
                    ]),
                    t("span", ie, [
                      f(a(s.start_at), 1),
                      s.detail ? (n(), o(p, { key: 0 }, [
                        f(" · " + a(s.detail), 1)
                      ], 64)) : u("", !0)
                    ])
                  ])
                ]))), 128)),
                K.value.length ? u("", !0) : (n(), o("li", de, "今天还没有安排，点右上角让 LIFE 安排。"))
              ])
            ]),
            t("article", re, [
              t("div", ue, [
                e[41] || (e[41] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", ce, a((i.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: F(bt, ["prevent"])
              }, [
                c(t("input", {
                  "onUpdate:modelValue": e[3] || (e[3] = (s) => g.value.title = s),
                  class: "input",
                  placeholder: "名称，如 生日 / 纪念日",
                  "aria-label": "重要日期名称"
                }, null, 512), [
                  [_, g.value.title]
                ]),
                c(t("input", {
                  "onUpdate:modelValue": e[4] || (e[4] = (s) => g.value.date = s),
                  class: "input",
                  placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                  "aria-label": "重要日期"
                }, null, 512), [
                  [_, g.value.date]
                ]),
                c(t("input", {
                  "onUpdate:modelValue": e[5] || (e[5] = (s) => g.value.note = s),
                  class: "input",
                  placeholder: "备注（可选）",
                  "aria-label": "备注"
                }, null, 512), [
                  [_, g.value.note]
                ]),
                t("label", pe, [
                  c(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": e[6] || (e[6] = (s) => g.value.repeat_yearly = s)
                  }, null, 512), [
                    [Ct, g.value.repeat_yearly]
                  ]),
                  e[42] || (e[42] = f(" 每年重复", -1))
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !g.value.title.trim() || !g.value.date.trim()
                }, "添加", 8, ve)
              ], 32),
              t("ul", _e, [
                (n(!0), o(p, null, b(i.value.important_dates, (s) => (n(), o("li", {
                  key: s.id,
                  class: "item"
                }, [
                  t("div", me, [
                    t("strong", null, a(s.title), 1),
                    t("span", be, [
                      f(a(s.date_text), 1),
                      R(s.date_text) !== null ? (n(), o(p, { key: 0 }, [
                        f(" · " + a(R(s.date_text) === 0 ? "就是今天" : R(s.date_text) + " 天后"), 1)
                      ], 64)) : u("", !0),
                      s.note ? (n(), o(p, { key: 1 }, [
                        f(" · " + a(s.note), 1)
                      ], 64)) : u("", !0)
                    ])
                  ]),
                  t("div", he, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (d) => ht(s.id)
                    }, "删除", 8, ge)
                  ])
                ]))), 128)),
                i.value.important_dates?.length ? u("", !0) : (n(), o("li", ye, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", fe, [
              t("div", ke, [
                e[43] || (e[43] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", we, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: e[7] || (e[7] = (s) => lt("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: S.value === "journal",
                    onClick: e[8] || (e[8] = (s) => at("journal"))
                  }, a(S.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, Ce)
                ])
              ]),
              t("div", xe, [
                t("div", $e, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !w.value.previous || T.value,
                    onClick: e[9] || (e[9] = (s) => Z("previous"))
                  }, "← 前一页", 8, je),
                  c(t("input", {
                    "onUpdate:modelValue": e[10] || (e[10] = (s) => M.value = s),
                    class: "input book-date",
                    type: "date",
                    "aria-label": "日记日期",
                    onChange: e[11] || (e[11] = (s) => Q(M.value))
                  }, null, 544), [
                    [_, M.value]
                  ]),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !w.value.next || T.value,
                    onClick: e[12] || (e[12] = (s) => Z("next"))
                  }, "后一页 →", 8, Se)
                ]),
                t("div", Le, [
                  t("p", Ne, a(w.value.date), 1),
                  X.value.length ? (n(), o("div", Me, [
                    (n(!0), o(p, null, b(X.value, (s, d) => (n(), o("p", { key: d }, a(s), 1))), 128))
                  ])) : (n(), o("p", Te, a(T.value ? "翻页中…" : "这一天还没有写下什么。"), 1))
                ])
              ]),
              t("form", {
                class: "stack-form diary-manual",
                onSubmit: e[14] || (e[14] = F((s) => tt("journal", I.value), ["prevent"]))
              }, [
                c(t("textarea", {
                  "onUpdate:modelValue": e[13] || (e[13] = (s) => I.value = s),
                  class: "input area",
                  placeholder: "为今天写下一点…"
                }, null, 512), [
                  [_, I.value]
                ]),
                e[44] || (e[44] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "写入今天", -1))
              ], 32)
            ]),
            t("article", Ee, [
              t("div", Fe, [
                e[45] || (e[45] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", De, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: e[15] || (e[15] = (s) => lt("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: S.value === "dream",
                    onClick: e[16] || (e[16] = (s) => at("dream"))
                  }, a(S.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, Ve)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: e[18] || (e[18] = F((s) => tt("dream", O.value), ["prevent"]))
              }, [
                c(t("textarea", {
                  "onUpdate:modelValue": e[17] || (e[17] = (s) => O.value = s),
                  class: "input area",
                  placeholder: "记录一个梦境或睡眠反思…"
                }, null, 512), [
                  [_, O.value]
                ]),
                e[46] || (e[46] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "记录梦境", -1))
              ], 32),
              t("ol", Ue, [
                (n(!0), o(p, null, b(i.value.dreams, (s) => (n(), o("li", {
                  key: s.id
                }, [
                  t("time", null, a(s.at), 1),
                  t("p", null, a(s.content), 1)
                ]))), 128)),
                i.value.dreams?.length ? u("", !0) : (n(), o("li", Ie, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", Oe, [
          e[50] || (e[50] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", Pe, [
            t("article", qe, [
              t("div", Ye, [
                e[48] || (e[48] = t("h2", { class: "card-title" }, "关系账本", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: e[19] || (e[19] = (s) => P.value = !P.value)
                }, a(P.value ? "隐藏事件" : "查看事件账本"), 1)
              ]),
              t("ul", Ae, [
                (n(!0), o(p, null, b(i.value.relationships, (s) => (n(), o("li", {
                  key: s.user_id,
                  class: "rel"
                }, [
                  t("span", Be, a((s.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", Je, [
                    t("div", ze, [
                      t("strong", null, a(s.user_id), 1),
                      t("span", He, a(s.stage), 1)
                    ]),
                    t("div", Qe, [
                      t("div", Ge, [
                        t("i", {
                          style: xt({ width: rt(s.affinity) })
                        }, null, 4)
                      ]),
                      t("b", null, a(Math.round((s.affinity || 0) * 100)) + "%", 1)
                    ]),
                    t("span", Ke, "最近互动：" + a(s.last_seen || "暂无"), 1)
                  ]),
                  t("div", Re, [
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      title: "更亲近",
                      onClick: (d) => st(s.user_id, 0.05)
                    }, "+", 8, We),
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      title: "更疏远",
                      onClick: (d) => st(s.user_id, -0.05)
                    }, "−", 8, Xe)
                  ])
                ]))), 128)),
                i.value.relationships?.length ? u("", !0) : (n(), o("li", Ze, "暂无关系记录"))
              ]),
              P.value ? (n(), o("div", ts, [
                t("h3", es, "事件账本（最近 " + a(i.value.relationship_ledger?.length || 0) + " 条）", 1),
                t("ol", ss, [
                  (n(!0), o(p, null, b(i.value.relationship_ledger, (s) => (n(), o("li", {
                    key: s.id
                  }, [
                    t("time", null, a(z(s.created_at)), 1),
                    t("p", null, [
                      t("strong", null, a(s.user_id), 1),
                      f(" · " + a(s.event_key) + " ", 1),
                      t("span", {
                        class: $(s.delta >= 0 ? "pos" : "neg")
                      }, a(s.delta >= 0 ? "+" : "") + a(s.delta), 3),
                      f(" · " + a(s.reason) + " (" + a(s.channel) + ")", 1)
                    ])
                  ]))), 128)),
                  i.value.relationship_ledger?.length ? u("", !0) : (n(), o("li", as, "暂无关系事件"))
                ])
              ])) : u("", !0)
            ]),
            t("article", ls, [
              e[49] || (e[49] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", ns, [
                (n(!0), o(p, null, b(i.value.persona_evolution, (s) => (n(), o("li", {
                  key: s.id,
                  class: "item trait-item"
                }, [
                  t("div", os, [
                    t("strong", null, a(s.trait), 1),
                    t("span", is, "支持 " + a(s.support_count) + " 次 · 置信度 " + a(Math.round((s.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", ds, a(s.value), 1)
                ]))), 128)),
                i.value.persona_evolution?.length ? u("", !0) : (n(), o("li", rs, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", us, [
          e[60] || (e[60] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", cs, [
            t("article", ps, [
              t("div", vs, [
                e[51] || (e[51] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", _s, "待投递 " + a(A.value.length), 1)
              ]),
              t("div", ms, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: vt
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: B.value,
                  onClick: _t
                }, a(B.value ? "检查中…" : "立即检查投递"), 9, bs)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: F(ut, ["prevent"])
              }, [
                c(t("input", {
                  "onUpdate:modelValue": e[20] || (e[20] = (s) => v.value.target = s),
                  class: "input",
                  placeholder: "目标：session:<会话ID> / user:<QQ> / group:<群号>",
                  "aria-label": "主动对象"
                }, null, 512), [
                  [_, v.value.target]
                ]),
                c(t("input", {
                  "onUpdate:modelValue": e[21] || (e[21] = (s) => v.value.motive = s),
                  class: "input",
                  placeholder: "动机，如 care / reminder",
                  "aria-label": "动机"
                }, null, 512), [
                  [_, v.value.motive]
                ]),
                c(t("input", {
                  "onUpdate:modelValue": e[22] || (e[22] = (s) => v.value.preferred_at = s),
                  class: "input",
                  placeholder: "期望时间（可选，ISO）",
                  "aria-label": "期望时间"
                }, null, 512), [
                  [_, v.value.preferred_at]
                ]),
                c(t("textarea", {
                  "onUpdate:modelValue": e[23] || (e[23] = (s) => v.value.content = s),
                  class: "input area",
                  placeholder: "想说的内容…"
                }, null, 512), [
                  [_, v.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !v.value.target.trim() || !v.value.content.trim()
                }, "创建候选", 8, hs)
              ], 32),
              e[56] || (e[56] = t("h3", { class: "section-label" }, "候选队列", -1)),
              t("ul", gs, [
                (n(!0), o(p, null, b(A.value, (s) => (n(), o("li", {
                  key: s.id,
                  class: "item"
                }, [
                  t("div", ys, [
                    t("strong", null, a(s.target) + " · " + a(s.motive), 1),
                    t("span", fs, a(s.content), 1),
                    t("span", ks, "状态 " + a(s.status) + " · " + a(z(s.created_at)), 1)
                  ]),
                  t("div", ws, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (d) => ct(s.id)
                    }, "取消", 8, Cs)
                  ])
                ]))), 128)),
                A.value.length ? u("", !0) : (n(), o("li", xs, "没有待投递候选"))
              ]),
              e[57] || (e[57] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", $s, [
                t("label", js, [
                  e[52] || (e[52] = t("span", null, "每日上限", -1)),
                  c(t("input", {
                    "onUpdate:modelValue": e[24] || (e[24] = (s) => h.value.daily_limit = s),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      h.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Ss, [
                  e[53] || (e[53] = t("span", null, "单人上限", -1)),
                  c(t("input", {
                    "onUpdate:modelValue": e[25] || (e[25] = (s) => h.value.per_target_limit = s),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      h.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Ls, [
                  e[54] || (e[54] = t("span", null, "免打扰起", -1)),
                  c(t("input", {
                    "onUpdate:modelValue": e[26] || (e[26] = (s) => h.value.quiet_start = s),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      h.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Ns, [
                  e[55] || (e[55] = t("span", null, "免打扰止", -1)),
                  c(t("input", {
                    "onUpdate:modelValue": e[27] || (e[27] = (s) => h.value.quiet_end = s),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      h.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: pt
                }, "保存策略")
              ]),
              e[58] || (e[58] = t("p", { class: "helper-inline" }, [
                f("免打扰起止相同即关闭；target 用 "),
                t("code", null, "session:<会话ID>"),
                f(" 可直接发到对话。")
              ], -1)),
              e[59] || (e[59] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", Ms, [
                (n(!0), o(p, null, b(G.value, (s) => (n(), o("li", {
                  key: s.id
                }, [
                  t("time", null, a(z(s.created_at)), 1),
                  t("p", null, a(s.phase) + " · " + a(s.content), 1)
                ]))), 128)),
                G.value.length ? u("", !0) : (n(), o("li", Ts, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", Es, [
          e[62] || (e[62] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", Fs, [
            t("article", Ds, [
              t("div", Vs, [
                e[61] || (e[61] = t("h2", { class: "card-title" }, "群聊观察", -1)),
                t("span", Us, a(Y.value.length), 1)
              ]),
              t("ul", Is, [
                (n(!0), o(p, null, b(Y.value, ([s, d]) => (n(), o("li", {
                  key: s,
                  class: "item group-item"
                }, [
                  t("div", Os, [
                    t("strong", null, a(s), 1),
                    t("span", Ps, "情绪 " + a(d.mood || "—") + " · " + a(d.messages?.length || 0) + " 条观察 · " + a(d.topics?.length || 0) + " 个话题", 1),
                    q.value === s ? (n(), o("div", qs, [
                      d.topics?.length ? (n(), o("div", Ys, [
                        (n(!0), o(p, null, b(d.topics, (x) => (n(), o("span", {
                          key: x.topic,
                          class: "chip muted"
                        }, a(x.topic) + " · " + a(Math.round(x.score)), 1))), 128))
                      ])) : u("", !0),
                      t("ol", As, [
                        (n(!0), o(p, null, b(d.messages, (x, ft) => (n(), o("li", { key: ft }, [
                          t("time", null, a(z(x.created_at)), 1),
                          t("p", null, [
                            t("strong", null, a(x.user_id), 1),
                            f("：" + a(x.content), 1)
                          ])
                        ]))), 128))
                      ])
                    ])) : u("", !0)
                  ]),
                  t("div", Bs, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (x) => q.value = q.value === s ? "" : s
                    }, a(q.value === s ? "收起" : "展开"), 9, Js)
                  ])
                ]))), 128)),
                Y.value.length ? u("", !0) : (n(), o("li", zs, "群聊观察尚未启用或没有消息。"))
              ])
            ])
          ])
        ]),
        t("section", Hs, [
          e[68] || (e[68] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", Qs, [
            t("article", Gs, [
              t("div", Ks, [
                e[63] || (e[63] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", Rs, a(C.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", Ws, [
                t("div", Xs, [
                  t("strong", null, a((C.value?.total_tokens || 0).toLocaleString()), 1),
                  e[64] || (e[64] = t("span", null, "总 Token", -1))
                ]),
                t("div", Zs, [
                  t("strong", null, a((C.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  e[65] || (e[65] = t("span", null, "输入", -1))
                ]),
                t("div", ta, [
                  t("strong", null, a((C.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  e[66] || (e[66] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", ea, [
                (n(!0), o(p, null, b(C.value?.by_model || {}, (s, d) => (n(), o("li", {
                  key: d,
                  class: "item"
                }, [
                  t("div", sa, [
                    t("strong", null, a(d), 1),
                    t("span", aa, a((s.total || 0).toLocaleString()) + " tokens · " + a(s.count) + " 次", 1)
                  ])
                ]))), 128)),
                !C.value || !Object.keys(C.value.by_model || {}).length ? (n(), o("li", la, "暂无用量记录")) : u("", !0)
              ])
            ]),
            t("article", na, [
              t("div", oa, [
                e[67] || (e[67] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: e[28] || (e[28] = (s) => m("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", ia, [
                (n(!0), o(p, null, b(i.value.audit, (s) => (n(), o("li", {
                  key: s.at + s.kind
                }, [
                  t("span", {
                    class: $(["dot", s.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", da, [
                    t("div", ra, [
                      t("strong", null, a(s.kind), 1),
                      t("span", {
                        class: $(["chip", s.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, a(s.outcome), 3),
                      t("time", null, a(s.at), 1)
                    ]),
                    t("p", ua, a(s.target), 1),
                    t("p", ca, a(s.detail), 1)
                  ])
                ]))), 128)),
                i.value.audit?.length ? u("", !0) : (n(), o("li", pa, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), ha = /* @__PURE__ */ jt(va, [["__scopeId", "data-v-eeab4619"]]);
export {
  ha as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-eeab4619]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-eeab4619]{max-width:1180px;margin:0 auto}.page-header[data-v-eeab4619]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-eeab4619]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-eeab4619]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-eeab4619]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-eeab4619]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-eeab4619]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-eeab4619]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-eeab4619]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-eeab4619]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-eeab4619]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-eeab4619]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-eeab4619]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-eeab4619]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-eeab4619]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-eeab4619]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-eeab4619]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-eeab4619]{display:flex;align-items:center;gap:10px}.stat-label[data-v-eeab4619]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-eeab4619]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-eeab4619]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-eeab4619]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-eeab4619]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-eeab4619]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-eeab4619]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-eeab4619]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-eeab4619]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-eeab4619]{margin-bottom:var(--space-lg)}.group-title[data-v-eeab4619]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-eeab4619]{margin-bottom:0}.card[data-v-eeab4619]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-eeab4619]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-eeab4619]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-eeab4619]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-eeab4619]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-eeab4619]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-eeab4619]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-eeab4619]{background:#fff1dc;color:#7a4400}.input[data-v-eeab4619]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-eeab4619]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-eeab4619]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-eeab4619]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-eeab4619]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-eeab4619]{grid-column:1/-1}.stack-form[data-v-eeab4619]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-eeab4619]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-eeab4619]{align-self:flex-start}.item-list[data-v-eeab4619],.rel-list[data-v-eeab4619],.feed[data-v-eeab4619],.timeline[data-v-eeab4619]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-eeab4619]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-eeab4619]{align-items:flex-start}.item[data-v-eeab4619]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-eeab4619]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-eeab4619]{font-size:14px;font-weight:600}.item-main strong.done[data-v-eeab4619]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-eeab4619]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-eeab4619]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-eeab4619]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-eeab4619]{background:transparent;border:0}.check-label[data-v-eeab4619]{display:flex;align-items:center}.check-line[data-v-eeab4619]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-eeab4619]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-eeab4619]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-eeab4619]{background:#fff1dc;color:#7a4400}.head-actions[data-v-eeab4619]{display:flex;gap:8px}.item-row[data-v-eeab4619]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hint-inline[data-v-eeab4619]{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}.helper-inline[data-v-eeab4619]{margin:8px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.helper-inline code[data-v-eeab4619]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:2px 6px;border-radius:6px}.check-label input[data-v-eeab4619]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-eeab4619]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-eeab4619]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-eeab4619]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-eeab4619]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-eeab4619],.rel-meter[data-v-eeab4619]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-eeab4619]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-eeab4619]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-eeab4619]{font-size:12px}.rel-actions[data-v-eeab4619]{display:flex;gap:4px}.ledger[data-v-eeab4619]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.book[data-v-eeab4619]{border:1px solid var(--md-outline-variant);border-radius:14px;background:linear-gradient(180deg,var(--md-surface-container-lowest),var(--md-surface-container-low));padding:16px 18px}.book-nav[data-v-eeab4619]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.book-date[data-v-eeab4619]{width:auto;height:34px;flex:0 0 auto}.book-page[data-v-eeab4619]{min-height:120px;border-top:1px solid var(--md-outline-variant);padding-top:14px}.book-heading[data-v-eeab4619]{margin:0 0 10px;font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--md-on-surface-variant);letter-spacing:.02em}.book-body[data-v-eeab4619]{display:flex;flex-direction:column;gap:10px}.book-body p[data-v-eeab4619]{margin:0;font-size:14px;line-height:1.95;text-indent:2em;color:var(--md-on-surface);white-space:pre-wrap;overflow-wrap:anywhere}.book-empty[data-v-eeab4619]{margin:0;font-size:13px;color:var(--md-on-surface-variant);font-style:italic}.diary-manual[data-v-eeab4619]{margin-top:14px;border-top:1px dashed var(--md-outline-variant);padding-top:12px}.feed li[data-v-eeab4619]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-eeab4619]{padding:8px 12px}.feed time[data-v-eeab4619],.timeline time[data-v-eeab4619]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-eeab4619]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-eeab4619]{color:var(--md-success);font-weight:700}.neg[data-v-eeab4619]{color:var(--md-error);font-weight:700}.policy[data-v-eeab4619]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-eeab4619]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-eeab4619]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-eeab4619]{margin-top:6px}.audit-card[data-v-eeab4619]{margin-bottom:var(--space-lg)}.usage-grid[data-v-eeab4619]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-eeab4619]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-eeab4619]{font-size:20px;font-weight:700}.usage-item span[data-v-eeab4619]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-eeab4619]{position:relative}.timeline li[data-v-eeab4619]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-eeab4619]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-eeab4619]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-eeab4619]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-eeab4619]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-eeab4619]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-eeab4619]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-eeab4619]{font-size:13.5px;font-weight:650}.tl-detail[data-v-eeab4619]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-eeab4619]{grid-template-columns:repeat(2,1fr)}.grid[data-v-eeab4619],.agenda-form[data-v-eeab4619]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-eeab4619]{padding:var(--space-lg)}.header-actions[data-v-eeab4619]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
