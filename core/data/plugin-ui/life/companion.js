import { defineComponent as Qt, ref as c, computed as x, onMounted as Kt, openBlock as l, createElementBlock as n, createElementVNode as t, toDisplayString as a, createCommentVNode as d, createStaticVNode as lt, normalizeClass as k, withModifiers as E, withDirectives as m, vModelText as h, Fragment as u, renderList as p, createTextVNode as f, vModelCheckbox as Rt, normalizeStyle as nt, vModelSelect as Wt } from "vue";
import { u as Xt, _ as Zt } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const te = { class: "page" }, ee = { class: "page-inner" }, se = { class: "page-header" }, ae = { class: "header-actions" }, le = ["disabled"], ne = ["disabled"], oe = {
  key: 0,
  class: "error-banner"
}, ie = {
  key: 1,
  class: "notice"
}, de = { class: "stat-grid" }, re = { class: "stat-card" }, ue = { class: "stat-value" }, ce = { class: "stat-card" }, ve = { class: "stat-value" }, pe = { class: "stat-card" }, _e = { class: "stat-value" }, me = { class: "stat-hint" }, he = { class: "stat-card" }, be = { class: "stat-value" }, ye = { class: "life-state" }, ge = { class: "state-pill" }, ke = {
  key: 0,
  class: "state-pill"
}, fe = { class: "group" }, we = { class: "grid" }, Ce = { class: "card" }, $e = { class: "item-list" }, Se = { class: "item-main" }, xe = { class: "item-meta" }, Me = { class: "item-actions" }, je = ["onClick"], Ue = ["onClick"], Le = {
  key: 0,
  class: "list-empty"
}, Ne = { class: "item-list" }, Fe = { class: "item-main" }, Ve = { class: "item-row" }, De = { class: "item-meta" }, Te = {
  key: 0,
  class: "list-empty"
}, Ee = { class: "card" }, Ie = { class: "card-head" }, Oe = { class: "chip muted" }, Pe = { class: "check-line" }, qe = ["disabled"], Ye = { class: "item-list" }, Ae = { class: "item-main" }, Be = { class: "item-meta" }, Je = { class: "item-actions" }, ze = ["onClick"], Ge = {
  key: 0,
  class: "list-empty"
}, He = { class: "card" }, Qe = { class: "card-head" }, Ke = { class: "head-actions" }, Re = ["disabled"], We = { class: "book" }, Xe = { class: "book-nav" }, Ze = ["disabled"], ts = ["disabled"], es = { class: "book-page" }, ss = { class: "book-heading" }, as = {
  key: 0,
  class: "book-body"
}, ls = {
  key: 1,
  class: "book-empty"
}, ns = { class: "card" }, os = { class: "card-head" }, is = { class: "head-actions" }, ds = ["disabled"], rs = { class: "feed" }, us = {
  key: 0,
  class: "list-empty plain"
}, cs = { class: "group" }, vs = { class: "grid" }, ps = { class: "card cal-card" }, _s = { class: "card-head" }, ms = { class: "head-actions" }, hs = { class: "cal-month" }, bs = { class: "cal-week" }, ys = { class: "cal-grid" }, gs = {
  key: 0,
  class: "cal-day"
}, ks = ["title"], fs = {
  key: 1,
  class: "cal-more"
}, ws = {
  key: 0,
  class: "cal-warn"
}, Cs = { class: "section-label" }, $s = { class: "item-list" }, Ss = { class: "item-main" }, xs = { class: "item-meta" }, Ms = { class: "item-actions" }, js = ["onClick"], Us = ["onClick"], Ls = {
  key: 0,
  class: "list-empty"
}, Ns = { class: "card" }, Fs = { class: "card-head" }, Vs = { class: "chip muted" }, Ds = ["disabled"], Ts = { class: "item-list" }, Es = { class: "item-main" }, Is = { class: "item-row" }, Os = { class: "meter-bar" }, Ps = {
  key: 0,
  class: "item-meta"
}, qs = { class: "item-actions" }, Ys = ["onClick"], As = ["onClick"], Bs = {
  key: 0,
  class: "list-empty"
}, Js = { class: "card" }, zs = { class: "card-head" }, Gs = { class: "chip muted" }, Hs = ["disabled"], Qs = { class: "item-list" }, Ks = { class: "item-main" }, Rs = { class: "item-meta" }, Ws = { class: "item-actions" }, Xs = ["onClick"], Zs = {
  key: 0,
  class: "list-empty"
}, ta = { class: "card" }, ea = { class: "card-head" }, sa = { class: "chip muted" }, aa = { class: "cloud" }, la = {
  key: 0,
  class: "list-empty plain"
}, na = { class: "group" }, oa = { class: "grid" }, ia = { class: "card" }, da = { class: "card-head" }, ra = { class: "card-title" }, ua = {
  key: 1,
  class: "chip muted"
}, ca = { class: "user-tools" }, va = ["value"], pa = { class: "rel-list" }, _a = ["onClick"], ma = { class: "avatar" }, ha = { class: "rel-main" }, ba = { class: "rel-top" }, ya = { class: "chip" }, ga = { class: "rel-meter" }, ka = { class: "meter-bar" }, fa = { class: "item-meta" }, wa = {
  key: 0,
  class: "list-empty"
}, Ca = {
  key: 1,
  class: "list-empty"
}, $a = { class: "detail-head" }, Sa = { class: "avatar" }, xa = { class: "rel-main" }, Ma = { class: "item-meta" }, ja = { class: "tabs" }, Ua = ["onClick"], La = {
  key: 0,
  class: "detail-body"
}, Na = { class: "kv-grid" }, Fa = { class: "kv" }, Va = { class: "kv" }, Da = { class: "kv" }, Ta = { class: "kv" }, Ea = { class: "kv" }, Ia = { class: "feed compact" }, Oa = {
  key: 0,
  class: "list-empty plain"
}, Pa = {
  key: 1,
  class: "detail-body"
}, qa = { class: "rel-meter big" }, Ya = { class: "meter-bar" }, Aa = { class: "rel-actions" }, Ba = { class: "feed compact" }, Ja = {
  key: 0,
  class: "list-empty plain"
}, za = {
  key: 2,
  class: "detail-body"
}, Ga = { class: "item-list" }, Ha = { class: "item-main" }, Qa = { class: "item-meta" }, Ka = { class: "item-meta" }, Ra = { class: "item-actions" }, Wa = ["onClick"], Xa = {
  key: 0,
  class: "list-empty"
}, Za = { class: "feed compact" }, tl = {
  key: 0,
  class: "list-empty plain"
}, el = {
  key: 3,
  class: "detail-body"
}, sl = { class: "item-list" }, al = { class: "item-main" }, ll = { class: "mem-text" }, nl = { class: "item-meta" }, ol = { class: "item-actions" }, il = ["onClick"], dl = {
  key: 0,
  class: "list-empty"
}, rl = {
  key: 4,
  class: "detail-body"
}, ul = { class: "timeline" }, cl = { class: "tl-body" }, vl = { class: "tl-head" }, pl = { class: "item-meta" }, _l = { class: "tl-detail" }, ml = {
  key: 0,
  class: "list-empty plain"
}, hl = { class: "card" }, bl = { class: "item-list" }, yl = { class: "item-main" }, gl = { class: "item-meta" }, kl = { class: "chip" }, fl = {
  key: 0,
  class: "list-empty"
}, wl = { class: "group" }, Cl = { class: "grid" }, $l = { class: "card" }, Sl = { class: "card-head" }, xl = { class: "chip muted" }, Ml = { class: "toolbar-inline" }, jl = ["disabled"], Ul = ["disabled"], Ll = { class: "item-list" }, Nl = { class: "item-main" }, Fl = { class: "item-meta" }, Vl = { class: "item-meta" }, Dl = { class: "item-actions" }, Tl = ["onClick"], El = {
  key: 0,
  class: "list-empty"
}, Il = { class: "policy" }, Ol = { class: "select" }, Pl = { class: "select" }, ql = { class: "select" }, Yl = { class: "select" }, Al = { class: "feed" }, Bl = {
  key: 0,
  class: "list-empty plain"
}, Jl = { class: "group" }, zl = { class: "grid" }, Gl = { class: "card" }, Hl = { class: "card-head" }, Ql = { class: "chip muted" }, Kl = { class: "item-list" }, Rl = { class: "item-main" }, Wl = { class: "item-meta" }, Xl = {
  key: 0,
  class: "group-detail"
}, Zl = {
  key: 0,
  class: "topics"
}, tn = { class: "feed compact" }, en = { class: "item-actions" }, sn = ["onClick"], an = {
  key: 0,
  class: "list-empty"
}, ln = { class: "group" }, nn = { class: "grid" }, on = { class: "card audit-card" }, dn = { class: "card-head" }, rn = { class: "chip muted" }, un = { class: "usage-grid" }, cn = { class: "usage-item" }, vn = { class: "usage-item" }, pn = { class: "usage-item" }, _n = { class: "item-list" }, mn = { class: "item-main" }, hn = { class: "item-meta" }, bn = {
  key: 0,
  class: "list-empty"
}, yn = { class: "card audit-card" }, gn = { class: "card-head" }, kn = { class: "timeline" }, fn = { class: "tl-body" }, wn = { class: "tl-head" }, Cn = { class: "item-meta" }, $n = { class: "tl-detail" }, Sn = {
  key: 0,
  class: "list-empty plain"
}, xn = /* @__PURE__ */ Qt({
  __name: "CompanionPage",
  setup(Mn) {
    const { confirm: xt } = Xt(), r = c({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), z = c(!1), S = c(""), P = c(""), q = c(""), G = c(""), H = c(""), Q = c(""), K = c(""), ot = () => {
      const o = /* @__PURE__ */ new Date(), s = (e) => String(e).padStart(2, "0");
      return `${o.getFullYear()}-${s(o.getMonth() + 1)}-${s(o.getDate())}`;
    }, Y = c(ot()), M = c({ date: "", content: "", previous: null, next: null }), A = c(!1), mt = x(() => (M.value.content || "").split(/\n{2,}/).map((o) => o.trim()).filter(Boolean));
    async function it(o = Y.value) {
      A.value = !0;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "journal_page", payload: { date: o } }) });
        if (!s.ok) throw Error(await s.text());
        const e = await s.json();
        M.value = { date: e?.date || o, content: e?.content || "", previous: e?.previous || null, next: e?.next || null }, Y.value = M.value.date;
      } catch (s) {
        S.value = s?.message || "无法读取日记";
      } finally {
        A.value = !1;
      }
    }
    function ht(o) {
      const s = o === "previous" ? M.value.previous : M.value.next;
      s && it(s);
    }
    const R = c(""), b = c({ target: "", motive: "", content: "", preferred_at: "" }), y = c({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), W = x(() => Object.entries(r.value.groups || {})), X = x(() => (r.value.proactive?.candidates || []).filter((o) => !["delivered", "cancelled"].includes(o.status))), dt = x(() => r.value.proactive?.receipts || []), bt = ot(), rt = x(() => (r.value.agenda || []).filter((o) => {
      const s = String(o.start_at || "").replace("T", " ");
      return !s || s.slice(0, 10) >= bt;
    }));
    function w(o) {
      P.value = o, setTimeout(() => {
        P.value === o && (P.value = "");
      }, 2e3);
    }
    const j = c(null);
    async function Mt() {
      try {
        const o = await fetch("/api/usage");
        o.ok && (j.value = await o.json());
      } catch {
      }
    }
    async function I() {
      z.value = !0, S.value = "";
      try {
        const o = await fetch("/api/life/companion");
        if (!o.ok) throw Error(String(o.status));
        r.value = await o.json(), r.value?.policy && (y.value = { ...y.value, ...r.value.policy });
      } catch (o) {
        S.value = o?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        z.value = !1;
      }
      Mt(), it(), at();
    }
    async function _(o, s) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: o, payload: s }) });
        if (!e.ok) throw Error(await e.text());
        return await I(), await e.json().catch(() => ({}));
      } catch (e) {
        return S.value = e?.message || "操作失败", null;
      }
    }
    async function jt() {
      q.value.trim() && (await _("add_agenda", { title: q.value, when: G.value, detail: H.value }), q.value = "", G.value = "", H.value = "");
    }
    async function yt(o, s) {
      s.trim() && (await _(o, { content: s }), o === "journal" ? Q.value = "" : K.value = "");
    }
    function ut(o) {
      return `${Math.round(Math.max(0, Math.min(1, o || 0)) * 100)}%`;
    }
    function gt(o) {
      if (o.status === "completed") return { label: "已完成", cls: "chip-ok" };
      const s = new Date(String(o.start_at || "").replace(" ", "T"));
      return !Number.isNaN(s.getTime()) && s.getTime() <= Date.now() ? { label: "进行中", cls: "chip-warn" } : { label: "待开始", cls: "muted" };
    }
    async function kt(o, s) {
      await _("relationship_adjust", { user_id: o, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: s }) && w(`已调整 ${o}`);
    }
    async function Ut() {
      if (!b.value.target.trim() || !b.value.content.trim()) return;
      await _("proactive_create", { ...b.value }) && (b.value = { target: "", motive: "", content: "", preferred_at: "" }, w("已创建主动候选"));
    }
    async function ft(o) {
      await _("proactive_cancel", { id: o, reason: "dashboard_cancel" }), w("已取消候选");
    }
    async function Lt() {
      await _("proactive_policy", { daily_limit: Number(y.value.daily_limit), per_target_limit: Number(y.value.per_target_limit), quiet_start: Number(y.value.quiet_start), quiet_end: Number(y.value.quiet_end) }), w("策略已保存");
    }
    const O = c("");
    async function wt(o) {
      O.value = o;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: o === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        await I(), w("已由 LIFE 生成");
      } catch (s) {
        S.value = s?.message || "生成失败";
      } finally {
        O.value = "";
      }
    }
    async function Nt() {
      const o = b.value.target.trim() || "user:owner";
      await _("proactive_suggest", { target: o, hint: b.value.motive }) && (b.value = { target: "", motive: "", content: "", preferred_at: "" }, w("已生成建议候选"));
    }
    const Z = c(!1);
    async function Ft() {
      Z.value = !0;
      try {
        const o = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!o.ok) throw Error(await o.text());
        const s = await o.json();
        await I(), w(s?.skipped ? `本次跳过：${s.skipped}` : `已投递 ${s.delivered || 0} 条 · 拦截 ${s.blocked || 0} 条`);
      } catch (o) {
        S.value = o?.message || "投递失败";
      } finally {
        Z.value = !1;
      }
    }
    const tt = c(!1);
    async function Vt() {
      tt.value = !0;
      try {
        const o = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!o.ok) throw Error(await o.text());
        const s = await o.json();
        await I();
        const e = s?.applied;
        w(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (o) {
        S.value = o?.message || "规划失败";
      } finally {
        tt.value = !1;
      }
    }
    function ct(o) {
      const s = (o || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let i = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? (i = new Date(s), i.setHours(0, 0, 0, 0), i < e && i.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(s) && (i = new Date(e.getFullYear(), Number(s.slice(0, 2)) - 1, Number(s.slice(3, 5))), i < e && i.setFullYear(e.getFullYear() + 1)), !i || Number.isNaN(i.getTime()) ? null : Math.round((i.getTime() - e.getTime()) / 864e5);
    }
    const g = c({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function Dt() {
      !g.value.title.trim() || !g.value.date.trim() || (await _("date_add", { ...g.value }), g.value = { title: "", date: "", repeat_yearly: !0, note: "" }, w("已添加重要日期"));
    }
    async function Tt(o) {
      await _("date_delete", { id: o }), w("已删除");
    }
    async function Et() {
      await _("circadian_eat", { amount: 45 }), w("已用餐");
    }
    async function It() {
      const o = await _("daily_agenda", {});
      w(o?.created ? `LIFE 已安排 ${o.created} 项活动` : "今天已有安排");
    }
    async function Ct(o) {
      await xt({ title: o === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await _("journal_clear", { kind: o }), w("已清除"));
    }
    function U(o) {
      if (!o) return "";
      const s = new Date(o);
      return Number.isNaN(s.getTime()) ? o : s.toLocaleString();
    }
    const D = c(""), et = c(""), st = c(""), v = c(null), vt = c(!1), T = c("overview"), Ot = [{ key: "overview", label: "概览" }, { key: "relationship", label: "关系" }, { key: "proactive", label: "主动" }, { key: "memory", label: "记忆" }, { key: "diagnostics", label: "诊断" }], Pt = x(() => Array.from(new Set((r.value.relationships || []).map((o) => o.stage).filter(Boolean)))), pt = x(() => (r.value.relationships || []).filter((o) => (!et.value || String(o.user_id).toLowerCase().includes(et.value.toLowerCase())) && (!st.value || o.stage === st.value)));
    async function $t(o) {
      D.value = o, T.value = "overview", vt.value = !0;
      const s = await _("user_detail", { user_id: o, limit: 100, memory_limit: 100 });
      v.value = s || null, vt.value = !1;
    }
    function qt() {
      D.value = "", v.value = null;
    }
    async function Yt(o) {
      await _("delete_memory", { id: o }), D.value && $t(D.value);
    }
    const B = c(ot().slice(0, 7)), L = c({ events: [], candidates: [], conflicts: [] }), N = c({ title: "", detail: "", kind: "growth" }), F = c({ name: "", tags: "", note: "" }), _t = x(() => r.value.word_cloud || []), At = x(() => {
      const [o, s] = B.value.split("-").map(Number);
      if (!o || !s) return [];
      const e = new Date(o, s, 0).getDate(), i = new Date(o, s - 1, 1).getDay(), C = {};
      for (const $ of L.value.events || []) {
        const V = String($.start_at || "").replace("T", " ").slice(0, 10);
        (C[V] || (C[V] = [])).push($);
      }
      const J = [];
      for (let $ = 0; $ < i; $++) J.push({ key: `pad-${$}`, empty: !0 });
      for (let $ = 1; $ <= e; $++) {
        const V = `${o}-${String(s).padStart(2, "0")}-${String($).padStart(2, "0")}`;
        J.push({ key: V, day: $, iso: V, events: C[V] || [], today: V === bt });
      }
      return J;
    });
    async function at() {
      const o = await _("calendar_month", { month: B.value });
      o && (L.value = o);
    }
    function St(o) {
      const [s, e] = B.value.split("-").map(Number), i = new Date(s, e - 1 + o, 1);
      B.value = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}`, at();
    }
    async function Bt() {
      N.value.title.trim() && (await _("goal_add", { ...N.value }), N.value = { title: "", detail: "", kind: "growth" });
    }
    async function Jt(o) {
      await _("goal_update", { id: o, status: "done", progress: 1 });
    }
    async function zt(o) {
      await _("goal_delete", { id: o });
    }
    async function Gt() {
      F.value.name.trim() && (await _("food_add", { ...F.value }), F.value = { name: "", tags: "", note: "" });
    }
    async function Ht(o) {
      await _("food_delete", { id: o });
    }
    return Kt(I), (o, s) => (l(), n("main", te, [
      t("div", ee, [
        t("header", se, [
          s[38] || (s[38] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", ae, [
            t("button", {
              class: "btn btn-primary",
              disabled: tt.value,
              onClick: Vt
            }, a(tt.value ? "规划中…" : "让 LIFE 规划"), 9, le),
            t("button", {
              class: "btn btn-tonal",
              disabled: z.value,
              onClick: I
            }, a(z.value ? "刷新中…" : "刷新"), 9, ne)
          ])
        ]),
        S.value ? (l(), n("p", oe, a(S.value), 1)) : d("", !0),
        P.value ? (l(), n("p", ie, a(P.value), 1)) : d("", !0),
        t("section", de, [
          t("article", re, [
            s[39] || (s[39] = lt('<div class="stat-head" data-v-00be6e6c><span class="icon-badge tone-1" aria-hidden="true" data-v-00be6e6c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-00be6e6c><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-00be6e6c></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-00be6e6c></path></svg></span><span class="stat-label" data-v-00be6e6c>关系对象</span></div>', 1)),
            t("strong", ue, a(r.value.relationships?.length || 0), 1),
            s[40] || (s[40] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", ce, [
            s[41] || (s[41] = lt('<div class="stat-head" data-v-00be6e6c><span class="icon-badge tone-2" aria-hidden="true" data-v-00be6e6c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-00be6e6c><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-00be6e6c></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-00be6e6c></path></svg></span><span class="stat-label" data-v-00be6e6c>活动日程</span></div>', 1)),
            t("strong", ve, a(rt.value.filter((e) => e.status === "active").length), 1),
            s[42] || (s[42] = t("span", { class: "stat-hint" }, "今天起待进行", -1))
          ]),
          t("article", pe, [
            s[43] || (s[43] = lt('<div class="stat-head" data-v-00be6e6c><span class="icon-badge tone-3" aria-hidden="true" data-v-00be6e6c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-00be6e6c><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-00be6e6c></path></svg></span><span class="stat-label" data-v-00be6e6c>待投递主动行为</span></div>', 1)),
            t("strong", _e, a(X.value.length), 1),
            t("span", me, "已投递 " + a(dt.value.length) + " 次", 1)
          ]),
          t("article", he, [
            s[44] || (s[44] = lt('<div class="stat-head" data-v-00be6e6c><span class="icon-badge tone-4" aria-hidden="true" data-v-00be6e6c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-00be6e6c><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-00be6e6c></path></svg></span><span class="stat-label" data-v-00be6e6c>已观察群聊</span></div>', 1)),
            t("strong", be, a(W.value.length), 1),
            s[45] || (s[45] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", ye, [
          t("span", ge, "精力 " + a(Math.round(r.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: k(["state-pill", { warn: (r.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + a(Math.round(r.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: k(["state-pill", { warn: (r.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + a(Math.round(r.value.circadian?.health ?? 100)), 3),
          r.value.circadian?.is_sleeping ? (l(), n("span", ke, "睡眠中")) : d("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: Et
          }, "吃饭")
        ]),
        t("section", fe, [
          s[56] || (s[56] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", we, [
            t("article", Ce, [
              t("div", { class: "card-head" }, [
                s[46] || (s[46] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: It
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: E(jt, ["prevent"])
              }, [
                m(t("input", {
                  "onUpdate:modelValue": s[0] || (s[0] = (e) => q.value = e),
                  class: "input",
                  placeholder: "日程标题",
                  "aria-label": "日程标题"
                }, null, 512), [
                  [h, q.value]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[1] || (s[1] = (e) => G.value = e),
                  class: "input",
                  placeholder: "时间，例如 2026-09-25 20:00",
                  "aria-label": "时间"
                }, null, 512), [
                  [h, G.value]
                ]),
                s[47] || (s[47] = t("button", {
                  class: "btn btn-primary",
                  type: "submit"
                }, "创建候选", -1)),
                m(t("textarea", {
                  "onUpdate:modelValue": s[2] || (s[2] = (e) => H.value = e),
                  class: "input area",
                  placeholder: "说明（可选）"
                }, null, 512), [
                  [h, H.value]
                ])
              ], 32),
              s[48] || (s[48] = t("h3", { class: "section-label" }, "待确认候选", -1)),
              t("ul", $e, [
                (l(!0), n(u, null, p(r.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (l(), n("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Se, [
                    t("strong", null, a(e.title), 1),
                    t("span", xe, a(e.when_text) + " · " + a(e.detail || "等待你确认"), 1)
                  ]),
                  t("div", Me, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (i) => _("confirm_agenda", { id: e.id })
                    }, "确认", 8, je),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => _("reject_agenda", { id: e.id })
                    }, "拒绝", 8, Ue)
                  ])
                ]))), 128)),
                r.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? d("", !0) : (l(), n("li", Le, "没有待确认的日程候选"))
              ]),
              s[49] || (s[49] = t("h3", { class: "section-label" }, [
                f("今天的日程 "),
                t("small", { class: "hint-inline" }, "LIFE 按时间自动推进")
              ], -1)),
              t("ul", Ne, [
                (l(!0), n(u, null, p(rt.value, (e) => (l(), n("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Fe, [
                    t("div", Ve, [
                      t("strong", {
                        class: k({ done: e.status === "completed" })
                      }, a(e.title), 3),
                      t("span", {
                        class: k(["chip", gt(e).cls])
                      }, a(gt(e).label), 3)
                    ]),
                    t("span", De, [
                      f(a(e.start_at), 1),
                      e.detail ? (l(), n(u, { key: 0 }, [
                        f(" · " + a(e.detail), 1)
                      ], 64)) : d("", !0)
                    ])
                  ])
                ]))), 128)),
                rt.value.length ? d("", !0) : (l(), n("li", Te, "今天还没有安排，点右上角让 LIFE 安排。"))
              ])
            ]),
            t("article", Ee, [
              t("div", Ie, [
                s[50] || (s[50] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", Oe, a((r.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: E(Dt, ["prevent"])
              }, [
                m(t("input", {
                  "onUpdate:modelValue": s[3] || (s[3] = (e) => g.value.title = e),
                  class: "input",
                  placeholder: "名称，如 生日 / 纪念日",
                  "aria-label": "重要日期名称"
                }, null, 512), [
                  [h, g.value.title]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[4] || (s[4] = (e) => g.value.date = e),
                  class: "input",
                  placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                  "aria-label": "重要日期"
                }, null, 512), [
                  [h, g.value.date]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[5] || (s[5] = (e) => g.value.note = e),
                  class: "input",
                  placeholder: "备注（可选）",
                  "aria-label": "备注"
                }, null, 512), [
                  [h, g.value.note]
                ]),
                t("label", Pe, [
                  m(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[6] || (s[6] = (e) => g.value.repeat_yearly = e)
                  }, null, 512), [
                    [Rt, g.value.repeat_yearly]
                  ]),
                  s[51] || (s[51] = f(" 每年重复", -1))
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !g.value.title.trim() || !g.value.date.trim()
                }, "添加", 8, qe)
              ], 32),
              t("ul", Ye, [
                (l(!0), n(u, null, p(r.value.important_dates, (e) => (l(), n("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Ae, [
                    t("strong", null, a(e.title), 1),
                    t("span", Be, [
                      f(a(e.date_text), 1),
                      ct(e.date_text) !== null ? (l(), n(u, { key: 0 }, [
                        f(" · " + a(ct(e.date_text) === 0 ? "就是今天" : ct(e.date_text) + " 天后"), 1)
                      ], 64)) : d("", !0),
                      e.note ? (l(), n(u, { key: 1 }, [
                        f(" · " + a(e.note), 1)
                      ], 64)) : d("", !0)
                    ])
                  ]),
                  t("div", Je, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => Tt(e.id)
                    }, "删除", 8, ze)
                  ])
                ]))), 128)),
                r.value.important_dates?.length ? d("", !0) : (l(), n("li", Ge, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", He, [
              t("div", Qe, [
                s[52] || (s[52] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", Ke, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[7] || (s[7] = (e) => Ct("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: O.value === "journal",
                    onClick: s[8] || (s[8] = (e) => wt("journal"))
                  }, a(O.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, Re)
                ])
              ]),
              t("div", We, [
                t("div", Xe, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !M.value.previous || A.value,
                    onClick: s[9] || (s[9] = (e) => ht("previous"))
                  }, "← 前一页", 8, Ze),
                  m(t("input", {
                    "onUpdate:modelValue": s[10] || (s[10] = (e) => Y.value = e),
                    class: "input book-date",
                    type: "date",
                    "aria-label": "日记日期",
                    onChange: s[11] || (s[11] = (e) => it(Y.value))
                  }, null, 544), [
                    [h, Y.value]
                  ]),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !M.value.next || A.value,
                    onClick: s[12] || (s[12] = (e) => ht("next"))
                  }, "后一页 →", 8, ts)
                ]),
                t("div", es, [
                  t("p", ss, a(M.value.date), 1),
                  mt.value.length ? (l(), n("div", as, [
                    (l(!0), n(u, null, p(mt.value, (e, i) => (l(), n("p", { key: i }, a(e), 1))), 128))
                  ])) : (l(), n("p", ls, a(A.value ? "翻页中…" : "这一天还没有写下什么。"), 1))
                ])
              ]),
              t("form", {
                class: "stack-form diary-manual",
                onSubmit: s[14] || (s[14] = E((e) => yt("journal", Q.value), ["prevent"]))
              }, [
                m(t("textarea", {
                  "onUpdate:modelValue": s[13] || (s[13] = (e) => Q.value = e),
                  class: "input area",
                  placeholder: "为今天写下一点…"
                }, null, 512), [
                  [h, Q.value]
                ]),
                s[53] || (s[53] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "写入今天", -1))
              ], 32)
            ]),
            t("article", ns, [
              t("div", os, [
                s[54] || (s[54] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", is, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[15] || (s[15] = (e) => Ct("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: O.value === "dream",
                    onClick: s[16] || (s[16] = (e) => wt("dream"))
                  }, a(O.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, ds)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: s[18] || (s[18] = E((e) => yt("dream", K.value), ["prevent"]))
              }, [
                m(t("textarea", {
                  "onUpdate:modelValue": s[17] || (s[17] = (e) => K.value = e),
                  class: "input area",
                  placeholder: "记录一个梦境或睡眠反思…"
                }, null, 512), [
                  [h, K.value]
                ]),
                s[55] || (s[55] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "记录梦境", -1))
              ], 32),
              t("ol", rs, [
                (l(!0), n(u, null, p(r.value.dreams, (e) => (l(), n("li", {
                  key: e.id
                }, [
                  t("time", null, a(e.at), 1),
                  t("p", null, a(e.content), 1)
                ]))), 128)),
                r.value.dreams?.length ? d("", !0) : (l(), n("li", us, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", cs, [
          s[61] || (s[61] = t("h2", { class: "group-title" }, "生活日历", -1)),
          t("div", vs, [
            t("article", ps, [
              t("div", _s, [
                s[57] || (s[57] = t("h2", { class: "card-title" }, "生活日历", -1)),
                t("div", ms, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[19] || (s[19] = (e) => St(-1))
                  }, "←"),
                  t("strong", hs, a(B.value), 1),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[20] || (s[20] = (e) => St(1))
                  }, "→")
                ])
              ]),
              t("div", bs, [
                (l(), n(u, null, p(["日", "一", "二", "三", "四", "五", "六"], (e) => t("span", { key: e }, a(e), 1)), 64))
              ]),
              t("div", ys, [
                (l(!0), n(u, null, p(At.value, (e) => (l(), n("div", {
                  key: e.key,
                  class: k(["cal-cell", { empty: e.empty, today: e.today, has: e.events?.length }])
                }, [
                  e.empty ? d("", !0) : (l(), n("span", gs, a(e.day), 1)),
                  (l(!0), n(u, null, p((e.events || []).slice(0, 2), (i) => (l(), n("span", {
                    key: i.id,
                    class: "cal-chip",
                    title: i.title
                  }, a(i.title), 9, ks))), 128)),
                  (e.events || []).length > 2 ? (l(), n("span", fs, "+" + a(e.events.length - 2), 1)) : d("", !0)
                ], 2))), 128))
              ]),
              L.value.conflicts?.length ? (l(), n("p", ws, "⚠ " + a(L.value.conflicts.length) + " 处时间冲突：" + a(L.value.conflicts.map((e) => e.titles.join(" / ")).join("；")), 1)) : d("", !0),
              t("h3", Cs, "本月待确认候选 (" + a(L.value.candidates?.length || 0) + ")", 1),
              t("ul", $s, [
                (l(!0), n(u, null, p((L.value.candidates || []).slice(0, 6), (e) => (l(), n("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Ss, [
                    t("strong", null, a(e.title), 1),
                    t("span", xs, a(e.when_text), 1)
                  ]),
                  t("div", Ms, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (i) => _("confirm_agenda", { id: e.id }).then(at)
                    }, "确认", 8, js),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => _("reject_agenda", { id: e.id }).then(at)
                    }, "拒绝", 8, Us)
                  ])
                ]))), 128)),
                (L.value.candidates || []).length ? d("", !0) : (l(), n("li", Ls, "没有待确认候选"))
              ])
            ]),
            t("article", Ns, [
              t("div", Fs, [
                s[58] || (s[58] = t("h2", { class: "card-title" }, "个人目标", -1)),
                t("span", Vs, a((r.value.goals || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: E(Bt, ["prevent"])
              }, [
                m(t("input", {
                  "onUpdate:modelValue": s[21] || (s[21] = (e) => N.value.title = e),
                  class: "input",
                  placeholder: "目标，如 学会一首钢琴曲",
                  "aria-label": "目标标题"
                }, null, 512), [
                  [h, N.value.title]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[22] || (s[22] = (e) => N.value.detail = e),
                  class: "input",
                  placeholder: "说明（可选）",
                  "aria-label": "目标说明"
                }, null, 512), [
                  [h, N.value.detail]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !N.value.title.trim()
                }, "添加目标", 8, Ds)
              ], 32),
              t("ul", Ts, [
                (l(!0), n(u, null, p(r.value.goals, (e) => (l(), n("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Es, [
                    t("div", Is, [
                      t("strong", {
                        class: k({ done: e.status === "done" })
                      }, a(e.title), 3),
                      t("span", {
                        class: k(["chip", e.status === "done" ? "chip-ok" : "muted"])
                      }, a(e.status === "done" ? "已完成" : "进行中"), 3)
                    ]),
                    t("div", Os, [
                      t("i", {
                        style: nt({ width: ut(e.progress) })
                      }, null, 4)
                    ]),
                    e.detail ? (l(), n("span", Ps, a(e.detail), 1)) : d("", !0)
                  ]),
                  t("div", qs, [
                    e.status !== "done" ? (l(), n("button", {
                      key: 0,
                      class: "btn btn-tonal btn-sm",
                      onClick: (i) => Jt(e.id)
                    }, "完成", 8, Ys)) : d("", !0),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => zt(e.id)
                    }, "删除", 8, As)
                  ])
                ]))), 128)),
                (r.value.goals || []).length ? d("", !0) : (l(), n("li", Bs, "还没有个人目标"))
              ])
            ]),
            t("article", Js, [
              t("div", zs, [
                s[59] || (s[59] = t("h2", { class: "card-title" }, "食物菜单", -1)),
                t("span", Gs, a((r.value.food || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: E(Gt, ["prevent"])
              }, [
                m(t("input", {
                  "onUpdate:modelValue": s[23] || (s[23] = (e) => F.value.name = e),
                  class: "input",
                  placeholder: "食物，如 番茄牛腩",
                  "aria-label": "食物名称"
                }, null, 512), [
                  [h, F.value.name]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[24] || (s[24] = (e) => F.value.tags = e),
                  class: "input",
                  placeholder: "标签，如 家常 / 甜（可选）",
                  "aria-label": "食物标签"
                }, null, 512), [
                  [h, F.value.tags]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !F.value.name.trim()
                }, "加入菜单", 8, Hs)
              ], 32),
              t("ul", Qs, [
                (l(!0), n(u, null, p(r.value.food, (e) => (l(), n("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Ks, [
                    t("strong", null, a(e.name), 1),
                    t("span", Rs, a(e.tags || "—"), 1)
                  ]),
                  t("div", Ws, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => Ht(e.id)
                    }, "删除", 8, Xs)
                  ])
                ]))), 128)),
                (r.value.food || []).length ? d("", !0) : (l(), n("li", Zs, "菜单还是空的"))
              ])
            ]),
            t("article", ta, [
              t("div", ea, [
                s[60] || (s[60] = t("h2", { class: "card-title" }, "群聊黑话词云", -1)),
                t("span", sa, a(_t.value.length), 1)
              ]),
              t("div", aa, [
                (l(!0), n(u, null, p(_t.value, (e) => (l(), n("span", {
                  key: e.topic,
                  class: "cloud-word",
                  style: nt({ fontSize: 12 + Math.min(18, Math.log(e.score + 1) * 6) + "px", opacity: 0.55 + Math.min(0.45, e.score / 20) })
                }, a(e.topic), 5))), 128)),
                _t.value.length ? d("", !0) : (l(), n("span", la, "还没有群聊词云数据"))
              ])
            ])
          ])
        ]),
        t("section", na, [
          s[75] || (s[75] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", oa, [
            t("article", ia, [
              t("div", da, [
                t("h2", ra, a(D.value ? "用户详情" : "用户"), 1),
                D.value ? (l(), n("button", {
                  key: 0,
                  class: "btn btn-tonal btn-sm",
                  onClick: qt
                }, "← 返回用户列表")) : (l(), n("span", ua, a(pt.value.length) + " / " + a(r.value.relationships?.length || 0), 1))
              ]),
              D.value ? vt.value ? (l(), n("div", Ca, "加载中…")) : v.value ? (l(), n(u, { key: 2 }, [
                t("div", $a, [
                  t("span", Sa, a((v.value.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", xa, [
                    t("strong", null, a(v.value.user_id), 1),
                    t("span", Ma, "阶段 " + a(v.value.relationship?.stage || "未知") + " · 好感 " + a(Math.round((v.value.relationship?.affinity || 0) * 100)) + "% · 最近 " + a(v.value.relationship?.last_seen || "—"), 1)
                  ])
                ]),
                t("nav", ja, [
                  (l(), n(u, null, p(Ot, (e) => t("button", {
                    key: e.key,
                    class: k(["tab", { active: T.value === e.key }]),
                    onClick: (i) => T.value = e.key
                  }, a(e.label), 11, Ua)), 64))
                ]),
                T.value === "overview" ? (l(), n("div", La, [
                  t("div", Na, [
                    t("div", Fa, [
                      s[64] || (s[64] = t("span", null, "关系事件", -1)),
                      t("strong", null, a(v.value.counts?.ledger || 0), 1)
                    ]),
                    t("div", Va, [
                      s[65] || (s[65] = t("span", null, "主动候选", -1)),
                      t("strong", null, a(v.value.counts?.candidates || 0), 1)
                    ]),
                    t("div", Da, [
                      s[66] || (s[66] = t("span", null, "已投递", -1)),
                      t("strong", null, a(v.value.counts?.delivered || 0), 1)
                    ]),
                    t("div", Ta, [
                      s[67] || (s[67] = t("span", null, "记忆条数", -1)),
                      t("strong", null, a(v.value.memories?.total || 0), 1)
                    ]),
                    t("div", Ea, [
                      s[68] || (s[68] = t("span", null, "阶段主动上限", -1)),
                      t("strong", null, a(v.value.stage_limit ?? "不限"), 1)
                    ])
                  ]),
                  s[69] || (s[69] = t("h3", { class: "section-label" }, "最近关系事件", -1)),
                  t("ol", Ia, [
                    (l(!0), n(u, null, p((v.value.ledger || []).slice(0, 5), (e) => (l(), n("li", {
                      key: e.id
                    }, [
                      t("time", null, a(U(e.created_at)), 1),
                      t("p", null, [
                        f(a(e.event_key) + " ", 1),
                        t("span", {
                          class: k(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        f(" · " + a(e.reason), 1)
                      ])
                    ]))), 128)),
                    (v.value.ledger || []).length ? d("", !0) : (l(), n("li", Oa, "暂无关系事件"))
                  ])
                ])) : T.value === "relationship" ? (l(), n("div", Pa, [
                  t("div", qa, [
                    t("div", Ya, [
                      t("i", {
                        style: nt({ width: ut(v.value.relationship?.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, a(Math.round((v.value.relationship?.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("div", Aa, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[27] || (s[27] = (e) => kt(v.value.user_id, 0.05))
                    }, "更亲近 +"),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[28] || (s[28] = (e) => kt(v.value.user_id, -0.05))
                    }, "更疏远 −")
                  ]),
                  s[71] || (s[71] = t("h3", { class: "section-label" }, "事件账本", -1)),
                  t("ol", Ba, [
                    (l(!0), n(u, null, p(v.value.ledger, (e) => (l(), n("li", {
                      key: e.id
                    }, [
                      t("time", null, a(U(e.created_at)), 1),
                      t("p", null, [
                        t("strong", null, a(e.event_key), 1),
                        s[70] || (s[70] = f()),
                        t("span", {
                          class: k(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        f(" · " + a(e.reason) + " (" + a(e.channel) + ")", 1)
                      ])
                    ]))), 128)),
                    (v.value.ledger || []).length ? d("", !0) : (l(), n("li", Ja, "暂无关系事件"))
                  ])
                ])) : T.value === "proactive" ? (l(), n("div", za, [
                  s[72] || (s[72] = t("h3", { class: "section-label" }, "候选队列", -1)),
                  t("ul", Ga, [
                    (l(!0), n(u, null, p(v.value.proactive?.candidates || [], (e) => (l(), n("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", Ha, [
                        t("strong", null, a(e.motive), 1),
                        t("span", Qa, a(e.content), 1),
                        t("span", Ka, a(e.status) + " · " + a(U(e.updated_at)), 1)
                      ]),
                      t("div", Ra, [
                        ["delivered", "cancelled"].includes(e.status) ? d("", !0) : (l(), n("button", {
                          key: 0,
                          class: "btn btn-danger btn-sm",
                          onClick: (i) => ft(e.id)
                        }, "取消", 8, Wa))
                      ])
                    ]))), 128)),
                    (v.value.proactive?.candidates || []).length ? d("", !0) : (l(), n("li", Xa, "暂无主动记录"))
                  ]),
                  s[73] || (s[73] = t("h3", { class: "section-label" }, "投递记录", -1)),
                  t("ol", Za, [
                    (l(!0), n(u, null, p(v.value.proactive?.receipts || [], (e) => (l(), n("li", {
                      key: e.id
                    }, [
                      t("time", null, a(U(e.created_at)), 1),
                      t("p", null, a(e.phase) + " · " + a(e.content), 1)
                    ]))), 128)),
                    (v.value.proactive?.receipts || []).length ? d("", !0) : (l(), n("li", tl, "暂无投递"))
                  ])
                ])) : T.value === "memory" ? (l(), n("div", el, [
                  t("ul", sl, [
                    (l(!0), n(u, null, p(v.value.memories?.items || [], (e) => (l(), n("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", al, [
                        t("strong", ll, a(e.content), 1),
                        t("span", nl, "scope " + a(e.scope) + " · 重要度 " + a(Math.round((e.importance || 0) * 100)) + "% · 召回 " + a(e.recall_count) + " 次", 1)
                      ]),
                      t("div", ol, [
                        t("button", {
                          class: "btn btn-danger btn-sm",
                          onClick: (i) => Yt(e.id)
                        }, "删除", 8, il)
                      ])
                    ]))), 128)),
                    (v.value.memories?.items || []).length ? d("", !0) : (l(), n("li", dl, "没有与该用户相关的记忆"))
                  ])
                ])) : (l(), n("div", rl, [
                  t("ol", ul, [
                    (l(!0), n(u, null, p(v.value.audit || [], (e) => (l(), n("li", {
                      key: e.id
                    }, [
                      t("span", {
                        class: k(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                        "aria-hidden": "true"
                      }, null, 2),
                      t("div", cl, [
                        t("div", vl, [
                          t("strong", null, a(e.kind), 1),
                          t("span", {
                            class: k(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                          }, a(e.outcome), 3),
                          t("time", null, a(U(e.created_at)), 1)
                        ]),
                        t("p", pl, a(e.target), 1),
                        t("p", _l, a(e.detail), 1)
                      ])
                    ]))), 128)),
                    (v.value.audit || []).length ? d("", !0) : (l(), n("li", ml, "暂无诊断记录"))
                  ])
                ]))
              ], 64)) : d("", !0) : (l(), n(u, { key: 0 }, [
                t("div", ca, [
                  m(t("input", {
                    "onUpdate:modelValue": s[25] || (s[25] = (e) => et.value = e),
                    class: "input",
                    placeholder: "搜索用户 ID",
                    "aria-label": "搜索用户"
                  }, null, 512), [
                    [h, et.value]
                  ]),
                  m(t("select", {
                    "onUpdate:modelValue": s[26] || (s[26] = (e) => st.value = e),
                    class: "input user-stage",
                    "aria-label": "按阶段筛选"
                  }, [
                    s[62] || (s[62] = t("option", { value: "" }, "全部阶段", -1)),
                    (l(!0), n(u, null, p(Pt.value, (e) => (l(), n("option", {
                      key: e,
                      value: e
                    }, a(e), 9, va))), 128))
                  ], 512), [
                    [Wt, st.value]
                  ])
                ]),
                t("ul", pa, [
                  (l(!0), n(u, null, p(pt.value, (e) => (l(), n("li", {
                    key: e.user_id,
                    class: "rel",
                    onClick: (i) => $t(e.user_id)
                  }, [
                    t("span", ma, a((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                    t("div", ha, [
                      t("div", ba, [
                        t("strong", null, a(e.user_id), 1),
                        t("span", ya, a(e.stage), 1)
                      ]),
                      t("div", ga, [
                        t("div", ka, [
                          t("i", {
                            style: nt({ width: ut(e.affinity) })
                          }, null, 4)
                        ]),
                        t("b", null, a(Math.round((e.affinity || 0) * 100)) + "%", 1)
                      ]),
                      t("span", fa, "最近互动：" + a(e.last_seen || "暂无"), 1)
                    ]),
                    s[63] || (s[63] = t("span", {
                      class: "rel-chevron",
                      "aria-hidden": "true"
                    }, "›", -1))
                  ], 8, _a))), 128)),
                  pt.value.length ? d("", !0) : (l(), n("li", wa, "没有匹配的用户"))
                ])
              ], 64))
            ]),
            t("article", hl, [
              s[74] || (s[74] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", bl, [
                (l(!0), n(u, null, p(r.value.persona_evolution, (e) => (l(), n("li", {
                  key: e.id,
                  class: "item trait-item"
                }, [
                  t("div", yl, [
                    t("strong", null, a(e.trait), 1),
                    t("span", gl, "支持 " + a(e.support_count) + " 次 · 置信度 " + a(Math.round((e.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", kl, a(e.value), 1)
                ]))), 128)),
                r.value.persona_evolution?.length ? d("", !0) : (l(), n("li", fl, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", wl, [
          s[85] || (s[85] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", Cl, [
            t("article", $l, [
              t("div", Sl, [
                s[76] || (s[76] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", xl, "待投递 " + a(X.value.length), 1)
              ]),
              t("div", Ml, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Nt
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: Z.value,
                  onClick: Ft
                }, a(Z.value ? "检查中…" : "立即检查投递"), 9, jl)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: E(Ut, ["prevent"])
              }, [
                m(t("input", {
                  "onUpdate:modelValue": s[29] || (s[29] = (e) => b.value.target = e),
                  class: "input",
                  placeholder: "目标：session:<会话ID> / user:<QQ> / group:<群号>",
                  "aria-label": "主动对象"
                }, null, 512), [
                  [h, b.value.target]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[30] || (s[30] = (e) => b.value.motive = e),
                  class: "input",
                  placeholder: "动机，如 care / reminder",
                  "aria-label": "动机"
                }, null, 512), [
                  [h, b.value.motive]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[31] || (s[31] = (e) => b.value.preferred_at = e),
                  class: "input",
                  placeholder: "期望时间（可选，ISO）",
                  "aria-label": "期望时间"
                }, null, 512), [
                  [h, b.value.preferred_at]
                ]),
                m(t("textarea", {
                  "onUpdate:modelValue": s[32] || (s[32] = (e) => b.value.content = e),
                  class: "input area",
                  placeholder: "想说的内容…"
                }, null, 512), [
                  [h, b.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !b.value.target.trim() || !b.value.content.trim()
                }, "创建候选", 8, Ul)
              ], 32),
              s[81] || (s[81] = t("h3", { class: "section-label" }, "候选队列", -1)),
              t("ul", Ll, [
                (l(!0), n(u, null, p(X.value, (e) => (l(), n("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Nl, [
                    t("strong", null, a(e.target) + " · " + a(e.motive), 1),
                    t("span", Fl, a(e.content), 1),
                    t("span", Vl, "状态 " + a(e.status) + " · " + a(U(e.created_at)), 1)
                  ]),
                  t("div", Dl, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => ft(e.id)
                    }, "取消", 8, Tl)
                  ])
                ]))), 128)),
                X.value.length ? d("", !0) : (l(), n("li", El, "没有待投递候选"))
              ]),
              s[82] || (s[82] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", Il, [
                t("label", Ol, [
                  s[77] || (s[77] = t("span", null, "每日上限", -1)),
                  m(t("input", {
                    "onUpdate:modelValue": s[33] || (s[33] = (e) => y.value.daily_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      h,
                      y.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Pl, [
                  s[78] || (s[78] = t("span", null, "单人上限", -1)),
                  m(t("input", {
                    "onUpdate:modelValue": s[34] || (s[34] = (e) => y.value.per_target_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      h,
                      y.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", ql, [
                  s[79] || (s[79] = t("span", null, "免打扰起", -1)),
                  m(t("input", {
                    "onUpdate:modelValue": s[35] || (s[35] = (e) => y.value.quiet_start = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      h,
                      y.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Yl, [
                  s[80] || (s[80] = t("span", null, "免打扰止", -1)),
                  m(t("input", {
                    "onUpdate:modelValue": s[36] || (s[36] = (e) => y.value.quiet_end = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      h,
                      y.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Lt
                }, "保存策略")
              ]),
              s[83] || (s[83] = t("p", { class: "helper-inline" }, [
                f("免打扰起止相同即关闭；target 用 "),
                t("code", null, "session:<会话ID>"),
                f(" 可直接发到对话。")
              ], -1)),
              s[84] || (s[84] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", Al, [
                (l(!0), n(u, null, p(dt.value, (e) => (l(), n("li", {
                  key: e.id
                }, [
                  t("time", null, a(U(e.created_at)), 1),
                  t("p", null, a(e.phase) + " · " + a(e.content), 1)
                ]))), 128)),
                dt.value.length ? d("", !0) : (l(), n("li", Bl, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", Jl, [
          s[87] || (s[87] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", zl, [
            t("article", Gl, [
              t("div", Hl, [
                s[86] || (s[86] = t("h2", { class: "card-title" }, "群聊观察", -1)),
                t("span", Ql, a(W.value.length), 1)
              ]),
              t("ul", Kl, [
                (l(!0), n(u, null, p(W.value, ([e, i]) => (l(), n("li", {
                  key: e,
                  class: "item group-item"
                }, [
                  t("div", Rl, [
                    t("strong", null, a(e), 1),
                    t("span", Wl, "情绪 " + a(i.mood || "—") + " · " + a(i.messages?.length || 0) + " 条观察 · " + a(i.topics?.length || 0) + " 个话题", 1),
                    R.value === e ? (l(), n("div", Xl, [
                      i.topics?.length ? (l(), n("div", Zl, [
                        (l(!0), n(u, null, p(i.topics, (C) => (l(), n("span", {
                          key: C.topic,
                          class: "chip muted"
                        }, a(C.topic) + " · " + a(Math.round(C.score)), 1))), 128))
                      ])) : d("", !0),
                      t("ol", tn, [
                        (l(!0), n(u, null, p(i.messages, (C, J) => (l(), n("li", { key: J }, [
                          t("time", null, a(U(C.created_at)), 1),
                          t("p", null, [
                            t("strong", null, a(C.user_id), 1),
                            f("：" + a(C.content), 1)
                          ])
                        ]))), 128))
                      ])
                    ])) : d("", !0)
                  ]),
                  t("div", en, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (C) => R.value = R.value === e ? "" : e
                    }, a(R.value === e ? "收起" : "展开"), 9, sn)
                  ])
                ]))), 128)),
                W.value.length ? d("", !0) : (l(), n("li", an, "群聊观察尚未启用或没有消息。"))
              ])
            ])
          ])
        ]),
        t("section", ln, [
          s[93] || (s[93] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", nn, [
            t("article", on, [
              t("div", dn, [
                s[88] || (s[88] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", rn, a(j.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", un, [
                t("div", cn, [
                  t("strong", null, a((j.value?.total_tokens || 0).toLocaleString()), 1),
                  s[89] || (s[89] = t("span", null, "总 Token", -1))
                ]),
                t("div", vn, [
                  t("strong", null, a((j.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  s[90] || (s[90] = t("span", null, "输入", -1))
                ]),
                t("div", pn, [
                  t("strong", null, a((j.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  s[91] || (s[91] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", _n, [
                (l(!0), n(u, null, p(j.value?.by_model || {}, (e, i) => (l(), n("li", {
                  key: i,
                  class: "item"
                }, [
                  t("div", mn, [
                    t("strong", null, a(i), 1),
                    t("span", hn, a((e.total || 0).toLocaleString()) + " tokens · " + a(e.count) + " 次", 1)
                  ])
                ]))), 128)),
                !j.value || !Object.keys(j.value.by_model || {}).length ? (l(), n("li", bn, "暂无用量记录")) : d("", !0)
              ])
            ]),
            t("article", yn, [
              t("div", gn, [
                s[92] || (s[92] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: s[37] || (s[37] = (e) => _("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", kn, [
                (l(!0), n(u, null, p(r.value.audit, (e) => (l(), n("li", {
                  key: e.at + e.kind
                }, [
                  t("span", {
                    class: k(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", fn, [
                    t("div", wn, [
                      t("strong", null, a(e.kind), 1),
                      t("span", {
                        class: k(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, a(e.outcome), 3),
                      t("time", null, a(e.at), 1)
                    ]),
                    t("p", Cn, a(e.target), 1),
                    t("p", $n, a(e.detail), 1)
                  ])
                ]))), 128)),
                r.value.audit?.length ? d("", !0) : (l(), n("li", Sn, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), Ln = /* @__PURE__ */ Zt(xn, [["__scopeId", "data-v-00be6e6c"]]);
export {
  Ln as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-00be6e6c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-00be6e6c]{max-width:1180px;margin:0 auto}.page-header[data-v-00be6e6c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-00be6e6c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-00be6e6c]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-00be6e6c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-00be6e6c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-00be6e6c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-00be6e6c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-00be6e6c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-00be6e6c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-00be6e6c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-00be6e6c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-00be6e6c]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-00be6e6c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-00be6e6c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-00be6e6c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-00be6e6c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-00be6e6c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-00be6e6c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-00be6e6c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-00be6e6c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-00be6e6c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-00be6e6c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-00be6e6c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-00be6e6c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-00be6e6c]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-00be6e6c]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-00be6e6c]{margin-bottom:var(--space-lg)}.group-title[data-v-00be6e6c]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-00be6e6c]{margin-bottom:0}.card[data-v-00be6e6c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-00be6e6c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-00be6e6c]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-00be6e6c]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-00be6e6c]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-00be6e6c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-00be6e6c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-00be6e6c]{background:#fff1dc;color:#7a4400}.input[data-v-00be6e6c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-00be6e6c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-00be6e6c]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-00be6e6c]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-00be6e6c]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-00be6e6c]{grid-column:1/-1}.stack-form[data-v-00be6e6c]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-00be6e6c]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-00be6e6c]{align-self:flex-start}.item-list[data-v-00be6e6c],.rel-list[data-v-00be6e6c],.feed[data-v-00be6e6c],.timeline[data-v-00be6e6c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-00be6e6c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-00be6e6c]{align-items:flex-start}.item[data-v-00be6e6c]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-00be6e6c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-00be6e6c]{font-size:14px;font-weight:600}.item-main strong.done[data-v-00be6e6c]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-00be6e6c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-00be6e6c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-00be6e6c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-00be6e6c]{background:transparent;border:0}.check-label[data-v-00be6e6c]{display:flex;align-items:center}.check-line[data-v-00be6e6c]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-00be6e6c]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-00be6e6c]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-00be6e6c]{background:#fff1dc;color:#7a4400}.head-actions[data-v-00be6e6c]{display:flex;gap:8px}.item-row[data-v-00be6e6c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hint-inline[data-v-00be6e6c]{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}.helper-inline[data-v-00be6e6c]{margin:8px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.helper-inline code[data-v-00be6e6c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:2px 6px;border-radius:6px}.check-label input[data-v-00be6e6c]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-00be6e6c]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-00be6e6c]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-00be6e6c]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-00be6e6c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-00be6e6c],.rel-meter[data-v-00be6e6c]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-00be6e6c]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-00be6e6c]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-00be6e6c]{font-size:12px}.rel-actions[data-v-00be6e6c]{display:flex;gap:4px}.ledger[data-v-00be6e6c]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.user-tools[data-v-00be6e6c]{display:flex;gap:10px;margin-bottom:12px}.user-stage[data-v-00be6e6c]{width:130px;flex:0 0 auto}.rel[data-v-00be6e6c]{cursor:pointer}.rel-chevron[data-v-00be6e6c]{font-size:20px;color:var(--md-on-surface-variant);flex-shrink:0}.detail-head[data-v-00be6e6c]{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}.tabs[data-v-00be6e6c]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tab[data-v-00be6e6c]{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:600 12.5px/1 inherit;cursor:pointer}.tab[data-v-00be6e6c]:hover{border-color:var(--md-primary)}.tab.active[data-v-00be6e6c]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}.detail-body[data-v-00be6e6c]{display:flex;flex-direction:column;gap:6px}.kv-grid[data-v-00be6e6c]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.kv[data-v-00be6e6c]{background:var(--md-surface-container-low);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:4px}.kv span[data-v-00be6e6c]{font-size:12px;color:var(--md-on-surface-variant)}.kv strong[data-v-00be6e6c]{font-size:20px;font-weight:700}.rel-meter.big[data-v-00be6e6c]{margin:6px 0}.rel-meter.big b[data-v-00be6e6c]{font-size:15px}.mem-text[data-v-00be6e6c]{font-weight:500!important;line-height:1.6}.cal-card[data-v-00be6e6c]{grid-column:1/-1}.cal-month[data-v-00be6e6c]{font-size:14px;font-weight:700;min-width:76px;text-align:center}.cal-week[data-v-00be6e6c]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}.cal-week span[data-v-00be6e6c]{text-align:center;font-size:11px;color:var(--md-on-surface-variant);font-weight:600}.cal-grid[data-v-00be6e6c]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-cell[data-v-00be6e6c]{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}.cal-cell.empty[data-v-00be6e6c]{border-color:transparent;background:transparent}.cal-cell.today[data-v-00be6e6c]{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 18%,transparent)}.cal-cell.has[data-v-00be6e6c]{background:var(--md-surface-container-low)}.cal-day[data-v-00be6e6c]{font-size:12px;font-weight:700;color:var(--md-on-surface-variant)}.cal-chip[data-v-00be6e6c]{font-size:10.5px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-more[data-v-00be6e6c]{font-size:10px;color:var(--md-on-surface-variant)}.cal-warn[data-v-00be6e6c]{margin:12px 0 0;padding:8px 12px;border-radius:10px;background:#fff1dc;color:#7a4400;font-size:12.5px}.cloud[data-v-00be6e6c]{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}.cloud-word[data-v-00be6e6c]{font-weight:700;color:var(--md-primary);line-height:1.2}.book[data-v-00be6e6c]{border:1px solid var(--md-outline-variant);border-radius:14px;background:linear-gradient(180deg,var(--md-surface-container-lowest),var(--md-surface-container-low));padding:16px 18px}.book-nav[data-v-00be6e6c]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.book-date[data-v-00be6e6c]{width:auto;height:34px;flex:0 0 auto}.book-page[data-v-00be6e6c]{min-height:120px;border-top:1px solid var(--md-outline-variant);padding-top:14px}.book-heading[data-v-00be6e6c]{margin:0 0 10px;font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--md-on-surface-variant);letter-spacing:.02em}.book-body[data-v-00be6e6c]{display:flex;flex-direction:column;gap:10px}.book-body p[data-v-00be6e6c]{margin:0;font-size:14px;line-height:1.95;text-indent:2em;color:var(--md-on-surface);white-space:pre-wrap;overflow-wrap:anywhere}.book-empty[data-v-00be6e6c]{margin:0;font-size:13px;color:var(--md-on-surface-variant);font-style:italic}.diary-manual[data-v-00be6e6c]{margin-top:14px;border-top:1px dashed var(--md-outline-variant);padding-top:12px}.feed li[data-v-00be6e6c]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-00be6e6c]{padding:8px 12px}.feed time[data-v-00be6e6c],.timeline time[data-v-00be6e6c]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-00be6e6c]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-00be6e6c]{color:var(--md-success);font-weight:700}.neg[data-v-00be6e6c]{color:var(--md-error);font-weight:700}.policy[data-v-00be6e6c]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-00be6e6c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-00be6e6c]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-00be6e6c]{margin-top:6px}.audit-card[data-v-00be6e6c]{margin-bottom:var(--space-lg)}.usage-grid[data-v-00be6e6c]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-00be6e6c]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-00be6e6c]{font-size:20px;font-weight:700}.usage-item span[data-v-00be6e6c]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-00be6e6c]{position:relative}.timeline li[data-v-00be6e6c]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-00be6e6c]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-00be6e6c]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-00be6e6c]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-00be6e6c]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-00be6e6c]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-00be6e6c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-00be6e6c]{font-size:13.5px;font-weight:650}.tl-detail[data-v-00be6e6c]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-00be6e6c]{grid-template-columns:repeat(2,1fr)}.grid[data-v-00be6e6c],.agenda-form[data-v-00be6e6c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-00be6e6c]{padding:var(--space-lg)}.header-actions[data-v-00be6e6c]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
