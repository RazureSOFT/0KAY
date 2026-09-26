import { defineComponent as ue, ref as r, computed as x, onMounted as re, openBlock as n, createElementBlock as o, createElementVNode as t, toDisplayString as a, createCommentVNode as d, createStaticVNode as ot, normalizeClass as g, withModifiers as M, withDirectives as m, vModelText as h, Fragment as p, renderList as _, createTextVNode as f, vModelCheckbox as ce, normalizeStyle as it, vModelSelect as Ft } from "vue";
import { u as pe, _ as ve } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const _e = { class: "page" }, me = { class: "page-inner" }, he = { class: "page-header" }, be = { class: "header-actions" }, ge = ["disabled"], ye = ["disabled"], ke = {
  key: 0,
  class: "error-banner"
}, fe = {
  key: 1,
  class: "notice"
}, we = { class: "stat-grid" }, Ce = { class: "stat-card" }, Se = { class: "stat-value" }, $e = { class: "stat-card" }, xe = { class: "stat-value" }, Me = { class: "stat-card" }, Ue = { class: "stat-value" }, je = { class: "stat-hint" }, Ve = { class: "stat-card" }, Fe = { class: "stat-value" }, Le = { class: "life-state" }, Ne = { class: "state-pill" }, De = {
  key: 0,
  class: "state-pill"
}, Te = { class: "group" }, Ee = { class: "grid" }, Ie = { class: "card" }, Pe = { class: "item-list" }, Oe = { class: "item-main" }, qe = { class: "item-meta" }, Ye = { class: "item-actions" }, Ge = ["onClick"], Ae = ["onClick"], Be = {
  key: 0,
  class: "list-empty"
}, Je = { class: "item-list" }, ze = { class: "item-main" }, He = { class: "item-row" }, Qe = { class: "item-meta" }, Ke = {
  key: 0,
  class: "list-empty"
}, Re = { class: "card" }, We = { class: "card-head" }, Xe = { class: "chip muted" }, Ze = { class: "check-line" }, ts = ["disabled"], es = { class: "item-list" }, ss = { class: "item-main" }, as = { class: "item-meta" }, ls = { class: "item-actions" }, ns = ["onClick"], os = {
  key: 0,
  class: "list-empty"
}, is = { class: "card" }, ds = { class: "card-head" }, us = { class: "head-actions" }, rs = ["disabled"], cs = { class: "book" }, ps = { class: "book-nav" }, vs = ["disabled"], _s = ["disabled"], ms = { class: "book-page" }, hs = { class: "book-heading" }, bs = {
  key: 0,
  class: "book-body"
}, gs = {
  key: 1,
  class: "book-empty"
}, ys = { class: "card" }, ks = { class: "card-head" }, fs = { class: "head-actions" }, ws = ["disabled"], Cs = { class: "feed" }, Ss = {
  key: 0,
  class: "list-empty plain"
}, $s = { class: "group" }, xs = { class: "grid" }, Ms = { class: "card cal-card" }, Us = { class: "card-head" }, js = { class: "head-actions" }, Vs = { class: "cal-month" }, Fs = { class: "cal-week" }, Ls = { class: "cal-grid" }, Ns = {
  key: 0,
  class: "cal-day"
}, Ds = ["title"], Ts = {
  key: 1,
  class: "cal-more"
}, Es = {
  key: 0,
  class: "cal-warn"
}, Is = { class: "section-label" }, Ps = { class: "item-list" }, Os = { class: "item-main" }, qs = { class: "item-meta" }, Ys = { class: "item-actions" }, Gs = ["onClick"], As = ["onClick"], Bs = {
  key: 0,
  class: "list-empty"
}, Js = { class: "card" }, zs = { class: "card-head" }, Hs = { class: "chip muted" }, Qs = ["disabled"], Ks = { class: "item-list" }, Rs = { class: "item-main" }, Ws = { class: "item-row" }, Xs = { class: "meter-bar" }, Zs = {
  key: 0,
  class: "item-meta"
}, ta = { class: "item-actions" }, ea = ["onClick"], sa = ["onClick"], aa = {
  key: 0,
  class: "list-empty"
}, la = { class: "card" }, na = { class: "card-head" }, oa = { class: "chip muted" }, ia = ["disabled"], da = { class: "item-list" }, ua = { class: "item-main" }, ra = { class: "item-meta" }, ca = { class: "item-actions" }, pa = ["onClick"], va = {
  key: 0,
  class: "list-empty"
}, _a = { class: "card" }, ma = { class: "card-head" }, ha = { class: "chip muted" }, ba = { class: "cloud" }, ga = {
  key: 0,
  class: "list-empty plain"
}, ya = { class: "group" }, ka = { class: "grid" }, fa = { class: "card" }, wa = { class: "card-head" }, Ca = { class: "card-title" }, Sa = {
  key: 1,
  class: "chip muted"
}, $a = { class: "user-tools" }, xa = ["value"], Ma = { class: "rel-list" }, Ua = ["onClick"], ja = { class: "avatar" }, Va = { class: "rel-main" }, Fa = { class: "rel-top" }, La = { class: "chip" }, Na = { class: "rel-meter" }, Da = { class: "meter-bar" }, Ta = { class: "item-meta" }, Ea = {
  key: 0,
  class: "list-empty"
}, Ia = {
  key: 1,
  class: "list-empty"
}, Pa = { class: "detail-head" }, Oa = { class: "avatar" }, qa = { class: "rel-main" }, Ya = { class: "item-meta" }, Ga = { class: "tabs" }, Aa = ["onClick"], Ba = {
  key: 0,
  class: "detail-body"
}, Ja = { class: "kv-grid" }, za = { class: "kv" }, Ha = { class: "kv" }, Qa = { class: "kv" }, Ka = { class: "kv" }, Ra = { class: "kv" }, Wa = { class: "feed compact" }, Xa = {
  key: 0,
  class: "list-empty plain"
}, Za = {
  key: 1,
  class: "detail-body"
}, tl = { class: "rel-meter big" }, el = { class: "meter-bar" }, sl = { class: "rel-actions" }, al = { class: "feed compact" }, ll = {
  key: 0,
  class: "list-empty plain"
}, nl = {
  key: 2,
  class: "detail-body"
}, ol = { class: "item-list" }, il = { class: "item-main" }, dl = { class: "item-meta" }, ul = { class: "item-meta" }, rl = { class: "item-actions" }, cl = ["onClick"], pl = {
  key: 0,
  class: "list-empty"
}, vl = { class: "feed compact" }, _l = {
  key: 0,
  class: "list-empty plain"
}, ml = {
  key: 3,
  class: "detail-body"
}, hl = { class: "item-list" }, bl = { class: "item-main" }, gl = { class: "mem-text" }, yl = { class: "item-meta" }, kl = { class: "item-actions" }, fl = ["onClick"], wl = {
  key: 0,
  class: "list-empty"
}, Cl = {
  key: 4,
  class: "detail-body"
}, Sl = { class: "timeline" }, $l = { class: "tl-body" }, xl = { class: "tl-head" }, Ml = { class: "item-meta" }, Ul = { class: "tl-detail" }, jl = {
  key: 0,
  class: "list-empty plain"
}, Vl = { class: "card" }, Fl = { class: "item-list" }, Ll = { class: "item-main" }, Nl = { class: "item-meta" }, Dl = { class: "chip" }, Tl = {
  key: 0,
  class: "list-empty"
}, El = { class: "group" }, Il = { class: "grid" }, Pl = { class: "card" }, Ol = { class: "card-head" }, ql = { class: "chip muted" }, Yl = { class: "toolbar-inline" }, Gl = ["disabled"], Al = ["disabled"], Bl = { class: "item-list" }, Jl = { class: "item-main" }, zl = { class: "item-meta" }, Hl = { class: "item-meta" }, Ql = { class: "item-actions" }, Kl = ["onClick"], Rl = {
  key: 0,
  class: "list-empty"
}, Wl = { class: "policy" }, Xl = { class: "select" }, Zl = { class: "select" }, tn = { class: "select" }, en = { class: "select" }, sn = { class: "feed" }, an = {
  key: 0,
  class: "list-empty plain"
}, ln = { class: "group" }, nn = { class: "grid" }, on = { class: "card" }, dn = { class: "card-head" }, un = { class: "chip muted" }, rn = ["disabled"], cn = { class: "item-list" }, pn = { class: "item-main" }, vn = { class: "item-row" }, _n = {
  key: 0,
  class: "chip muted"
}, mn = { class: "item-meta" }, hn = {
  key: 0,
  class: "group-detail"
}, bn = { class: "topics" }, gn = ["onClick"], yn = {
  key: 0,
  class: "item-meta"
}, kn = ["onSubmit"], fn = ["onUpdate:modelValue"], wn = { class: "member-list" }, Cn = { class: "member-id" }, Sn = { class: "item-meta" }, $n = ["value", "onChange"], xn = {
  key: 0,
  class: "item-meta"
}, Mn = { class: "item-actions" }, Un = ["value", "onChange"], jn = ["onClick"], Vn = ["onClick"], Fn = {
  key: 0,
  class: "list-empty"
}, Ln = { class: "group" }, Nn = { class: "grid" }, Dn = { class: "card audit-card" }, Tn = { class: "card-head" }, En = { class: "chip muted" }, In = { class: "usage-grid" }, Pn = { class: "usage-item" }, On = { class: "usage-item" }, qn = { class: "usage-item" }, Yn = { class: "item-list" }, Gn = { class: "item-main" }, An = { class: "item-meta" }, Bn = {
  key: 0,
  class: "list-empty"
}, Jn = { class: "card audit-card" }, zn = { class: "card-head" }, Hn = { class: "timeline" }, Qn = { class: "tl-body" }, Kn = { class: "tl-head" }, Rn = { class: "item-meta" }, Wn = { class: "tl-detail" }, Xn = {
  key: 0,
  class: "list-empty plain"
}, Zn = /* @__PURE__ */ ue({
  __name: "CompanionPage",
  setup(to) {
    const { confirm: Lt } = pe(), u = r({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), z = r(!1), $ = r(""), Y = r(""), G = r(""), H = r(""), Q = r(""), K = r(""), R = r(""), dt = () => {
      const l = /* @__PURE__ */ new Date(), s = (e) => String(e).padStart(2, "0");
      return `${l.getFullYear()}-${s(l.getMonth() + 1)}-${s(l.getDate())}`;
    }, A = r(dt()), U = r({ date: "", content: "", previous: null, next: null }), B = r(!1), kt = x(() => (U.value.content || "").split(/\n{2,}/).map((l) => l.trim()).filter(Boolean));
    async function ut(l = A.value) {
      B.value = !0;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "journal_page", payload: { date: l } }) });
        if (!s.ok) throw Error(await s.text());
        const e = await s.json();
        U.value = { date: e?.date || l, content: e?.content || "", previous: e?.previous || null, next: e?.next || null }, A.value = U.value.date;
      } catch (s) {
        $.value = s?.message || "无法读取日记";
      } finally {
        B.value = !1;
      }
    }
    function ft(l) {
      const s = l === "previous" ? U.value.previous : U.value.next;
      s && ut(s);
    }
    const T = r(""), b = r({ target: "", motive: "", content: "", preferred_at: "" }), y = r({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), Nt = x(() => Object.entries(u.value.groups || {})), W = x(() => (u.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), rt = x(() => u.value.proactive?.receipts || []), wt = dt(), ct = x(() => (u.value.agenda || []).filter((l) => {
      const s = String(l.start_at || "").replace("T", " ");
      return !s || s.slice(0, 10) >= wt;
    }));
    function w(l) {
      Y.value = l, setTimeout(() => {
        Y.value === l && (Y.value = "");
      }, 2e3);
    }
    const j = r(null);
    async function Dt() {
      try {
        const l = await fetch("/api/usage");
        l.ok && (j.value = await l.json());
      } catch {
      }
    }
    async function O() {
      z.value = !0, $.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        u.value = await l.json(), u.value?.policy && (y.value = { ...y.value, ...u.value.policy });
      } catch (l) {
        $.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        z.value = !1;
      }
      Dt(), ut(), st(), ee();
    }
    async function c(l, s) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: s }) });
        if (!e.ok) throw Error(await e.text());
        return await O(), await e.json().catch(() => ({}));
      } catch (e) {
        return $.value = e?.message || "操作失败", null;
      }
    }
    async function Tt() {
      G.value.trim() && (await c("add_agenda", { title: G.value, when: H.value, detail: Q.value }), G.value = "", H.value = "", Q.value = "");
    }
    async function Ct(l, s) {
      s.trim() && (await c(l, { content: s }), l === "journal" ? K.value = "" : R.value = "");
    }
    function pt(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    function St(l) {
      if (l.status === "completed") return { label: "已完成", cls: "chip-ok" };
      const s = new Date(String(l.start_at || "").replace(" ", "T"));
      return !Number.isNaN(s.getTime()) && s.getTime() <= Date.now() ? { label: "进行中", cls: "chip-warn" } : { label: "待开始", cls: "muted" };
    }
    async function $t(l, s) {
      await c("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: s }) && w(`已调整 ${l}`);
    }
    async function Et() {
      if (!b.value.target.trim() || !b.value.content.trim()) return;
      await c("proactive_create", { ...b.value }) && (b.value = { target: "", motive: "", content: "", preferred_at: "" }, w("已创建主动候选"));
    }
    async function xt(l) {
      await c("proactive_cancel", { id: l, reason: "dashboard_cancel" }), w("已取消候选");
    }
    async function It() {
      await c("proactive_policy", { daily_limit: Number(y.value.daily_limit), per_target_limit: Number(y.value.per_target_limit), quiet_start: Number(y.value.quiet_start), quiet_end: Number(y.value.quiet_end) }), w("策略已保存");
    }
    const q = r("");
    async function Mt(l) {
      q.value = l;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        await O(), w("已由 LIFE 生成");
      } catch (s) {
        $.value = s?.message || "生成失败";
      } finally {
        q.value = "";
      }
    }
    async function Pt() {
      const l = b.value.target.trim() || "user:owner";
      await c("proactive_suggest", { target: l, hint: b.value.motive }) && (b.value = { target: "", motive: "", content: "", preferred_at: "" }, w("已生成建议候选"));
    }
    const X = r(!1);
    async function Ot() {
      X.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await O(), w(s?.skipped ? `本次跳过：${s.skipped}` : `已投递 ${s.delivered || 0} 条 · 拦截 ${s.blocked || 0} 条`);
      } catch (l) {
        $.value = l?.message || "投递失败";
      } finally {
        X.value = !1;
      }
    }
    const Z = r(!1);
    async function qt() {
      Z.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await O();
        const e = s?.applied;
        w(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (l) {
        $.value = l?.message || "规划失败";
      } finally {
        Z.value = !1;
      }
    }
    function vt(l) {
      const s = (l || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let i = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? (i = new Date(s), i.setHours(0, 0, 0, 0), i < e && i.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(s) && (i = new Date(e.getFullYear(), Number(s.slice(0, 2)) - 1, Number(s.slice(3, 5))), i < e && i.setFullYear(e.getFullYear() + 1)), !i || Number.isNaN(i.getTime()) ? null : Math.round((i.getTime() - e.getTime()) / 864e5);
    }
    const k = r({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function Yt() {
      !k.value.title.trim() || !k.value.date.trim() || (await c("date_add", { ...k.value }), k.value = { title: "", date: "", repeat_yearly: !0, note: "" }, w("已添加重要日期"));
    }
    async function Gt(l) {
      await c("date_delete", { id: l }), w("已删除");
    }
    async function At() {
      await c("circadian_eat", { amount: 45 }), w("已用餐");
    }
    async function Bt() {
      const l = await c("daily_agenda", {});
      w(l?.created ? `LIFE 已安排 ${l.created} 项活动` : "今天已有安排");
    }
    async function Ut(l) {
      await Lt({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await c("journal_clear", { kind: l }), w("已清除"));
    }
    function V(l) {
      if (!l) return "";
      const s = new Date(l);
      return Number.isNaN(s.getTime()) ? l : s.toLocaleString();
    }
    const E = r(""), tt = r(""), et = r(""), v = r(null), _t = r(!1), I = r("overview"), Jt = [{ key: "overview", label: "概览" }, { key: "relationship", label: "关系" }, { key: "proactive", label: "主动" }, { key: "memory", label: "记忆" }, { key: "diagnostics", label: "诊断" }], zt = x(() => Array.from(new Set((u.value.relationships || []).map((l) => l.stage).filter(Boolean)))), mt = x(() => (u.value.relationships || []).filter((l) => (!tt.value || String(l.user_id).toLowerCase().includes(tt.value.toLowerCase())) && (!et.value || l.stage === et.value)));
    async function jt(l) {
      E.value = l, I.value = "overview", _t.value = !0;
      const s = await c("user_detail", { user_id: l, limit: 100, memory_limit: 100 });
      v.value = s || null, _t.value = !1;
    }
    function Ht() {
      E.value = "", v.value = null;
    }
    async function Qt(l) {
      await c("delete_memory", { id: l }), E.value && jt(E.value);
    }
    const J = r(dt().slice(0, 7)), F = r({ events: [], candidates: [], conflicts: [] }), L = r({ title: "", detail: "", kind: "growth" }), N = r({ name: "", tags: "", note: "" }), ht = x(() => u.value.word_cloud || []), Kt = x(() => {
      const [l, s] = J.value.split("-").map(Number);
      if (!l || !s) return [];
      const e = new Date(l, s, 0).getDate(), i = new Date(l, s - 1, 1).getDay(), P = {};
      for (const C of F.value.events || []) {
        const D = String(C.start_at || "").replace("T", " ").slice(0, 10);
        (P[D] || (P[D] = [])).push(C);
      }
      const yt = [];
      for (let C = 0; C < i; C++) yt.push({ key: `pad-${C}`, empty: !0 });
      for (let C = 1; C <= e; C++) {
        const D = `${l}-${String(s).padStart(2, "0")}-${String(C).padStart(2, "0")}`;
        yt.push({ key: D, day: C, iso: D, events: P[D] || [], today: D === wt });
      }
      return yt;
    });
    async function st() {
      const l = await c("calendar_month", { month: J.value });
      l && (F.value = l);
    }
    function Vt(l) {
      const [s, e] = J.value.split("-").map(Number), i = new Date(s, e - 1 + l, 1);
      J.value = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}`, st();
    }
    async function Rt() {
      L.value.title.trim() && (await c("goal_add", { ...L.value }), L.value = { title: "", detail: "", kind: "growth" });
    }
    async function Wt(l) {
      await c("goal_update", { id: l, status: "done", progress: 1 });
    }
    async function Xt(l) {
      await c("goal_delete", { id: l });
    }
    async function Zt() {
      N.value.name.trim() && (await c("food_add", { ...N.value }), N.value = { name: "", tags: "", note: "" });
    }
    async function te(l) {
      await c("food_delete", { id: l });
    }
    const at = r([]), S = r({ group_id: "", policy: "observe", alias: "" }), bt = r({}), gt = r({}), lt = r({});
    async function ee() {
      const l = await c("group_list", {});
      l && (at.value = l.groups || []);
    }
    async function se() {
      S.value.group_id.trim() && (await c("group_upsert", { ...S.value }), S.value = { group_id: "", policy: "observe", alias: "" });
    }
    async function ae(l) {
      await c("group_delete", { group_id: l }), T.value === l && (T.value = "");
    }
    async function le(l, s) {
      const e = s.target.value;
      await c("group_upsert", { group_id: l.group_id, policy: e, alias: l.alias || "", note: l.note || "" });
    }
    async function ne(l, s, e) {
      const i = e.target.value;
      await c("group_member_flag", { group_id: l, user_id: s, flag: i }), nt(l);
    }
    async function nt(l) {
      const [s, e] = await Promise.all([c("group_slang_list", { group_id: l }), c("group_members", { group_id: l })]);
      bt.value[l] = s?.slang || [], gt.value[l] = e?.members || [];
    }
    function oe(l) {
      T.value = T.value === l ? "" : l, T.value && nt(l);
    }
    async function ie(l) {
      const s = (lt.value[l] || "").trim();
      s && (await c("group_slang_update", { group_id: l, topic: s, score: 1 }), lt.value[l] = "", nt(l));
    }
    async function de(l, s) {
      await c("group_slang_delete", { group_id: l, topic: s }), nt(l);
    }
    return re(O), (l, s) => (n(), o("main", _e, [
      t("div", me, [
        t("header", he, [
          s[41] || (s[41] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", be, [
            t("button", {
              class: "btn btn-primary",
              disabled: Z.value,
              onClick: qt
            }, a(Z.value ? "规划中…" : "让 LIFE 规划"), 9, ge),
            t("button", {
              class: "btn btn-tonal",
              disabled: z.value,
              onClick: O
            }, a(z.value ? "刷新中…" : "刷新"), 9, ye)
          ])
        ]),
        $.value ? (n(), o("p", ke, a($.value), 1)) : d("", !0),
        Y.value ? (n(), o("p", fe, a(Y.value), 1)) : d("", !0),
        t("section", we, [
          t("article", Ce, [
            s[42] || (s[42] = ot('<div class="stat-head" data-v-dc46334b><span class="icon-badge tone-1" aria-hidden="true" data-v-dc46334b><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-dc46334b><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-dc46334b></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-dc46334b></path></svg></span><span class="stat-label" data-v-dc46334b>关系对象</span></div>', 1)),
            t("strong", Se, a(u.value.relationships?.length || 0), 1),
            s[43] || (s[43] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", $e, [
            s[44] || (s[44] = ot('<div class="stat-head" data-v-dc46334b><span class="icon-badge tone-2" aria-hidden="true" data-v-dc46334b><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-dc46334b><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-dc46334b></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-dc46334b></path></svg></span><span class="stat-label" data-v-dc46334b>活动日程</span></div>', 1)),
            t("strong", xe, a(ct.value.filter((e) => e.status === "active").length), 1),
            s[45] || (s[45] = t("span", { class: "stat-hint" }, "今天起待进行", -1))
          ]),
          t("article", Me, [
            s[46] || (s[46] = ot('<div class="stat-head" data-v-dc46334b><span class="icon-badge tone-3" aria-hidden="true" data-v-dc46334b><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-dc46334b><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-dc46334b></path></svg></span><span class="stat-label" data-v-dc46334b>待投递主动行为</span></div>', 1)),
            t("strong", Ue, a(W.value.length), 1),
            t("span", je, "已投递 " + a(rt.value.length) + " 次", 1)
          ]),
          t("article", Ve, [
            s[47] || (s[47] = ot('<div class="stat-head" data-v-dc46334b><span class="icon-badge tone-4" aria-hidden="true" data-v-dc46334b><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-dc46334b><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-dc46334b></path></svg></span><span class="stat-label" data-v-dc46334b>已观察群聊</span></div>', 1)),
            t("strong", Fe, a(Nt.value.length), 1),
            s[48] || (s[48] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", Le, [
          t("span", Ne, "精力 " + a(Math.round(u.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: g(["state-pill", { warn: (u.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + a(Math.round(u.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: g(["state-pill", { warn: (u.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + a(Math.round(u.value.circadian?.health ?? 100)), 3),
          u.value.circadian?.is_sleeping ? (n(), o("span", De, "睡眠中")) : d("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: At
          }, "吃饭")
        ]),
        t("section", Te, [
          s[59] || (s[59] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", Ee, [
            t("article", Ie, [
              t("div", { class: "card-head" }, [
                s[49] || (s[49] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Bt
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: M(Tt, ["prevent"])
              }, [
                m(t("input", {
                  "onUpdate:modelValue": s[0] || (s[0] = (e) => G.value = e),
                  class: "input",
                  placeholder: "日程标题",
                  "aria-label": "日程标题"
                }, null, 512), [
                  [h, G.value]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[1] || (s[1] = (e) => H.value = e),
                  class: "input",
                  placeholder: "时间，例如 2026-09-25 20:00",
                  "aria-label": "时间"
                }, null, 512), [
                  [h, H.value]
                ]),
                s[50] || (s[50] = t("button", {
                  class: "btn btn-primary",
                  type: "submit"
                }, "创建候选", -1)),
                m(t("textarea", {
                  "onUpdate:modelValue": s[2] || (s[2] = (e) => Q.value = e),
                  class: "input area",
                  placeholder: "说明（可选）"
                }, null, 512), [
                  [h, Q.value]
                ])
              ], 32),
              s[51] || (s[51] = t("h3", { class: "section-label" }, "待确认候选", -1)),
              t("ul", Pe, [
                (n(!0), o(p, null, _(u.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Oe, [
                    t("strong", null, a(e.title), 1),
                    t("span", qe, a(e.when_text) + " · " + a(e.detail || "等待你确认"), 1)
                  ]),
                  t("div", Ye, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (i) => c("confirm_agenda", { id: e.id })
                    }, "确认", 8, Ge),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => c("reject_agenda", { id: e.id })
                    }, "拒绝", 8, Ae)
                  ])
                ]))), 128)),
                u.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? d("", !0) : (n(), o("li", Be, "没有待确认的日程候选"))
              ]),
              s[52] || (s[52] = t("h3", { class: "section-label" }, [
                f("今天的日程 "),
                t("small", { class: "hint-inline" }, "LIFE 按时间自动推进")
              ], -1)),
              t("ul", Je, [
                (n(!0), o(p, null, _(ct.value, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ze, [
                    t("div", He, [
                      t("strong", {
                        class: g({ done: e.status === "completed" })
                      }, a(e.title), 3),
                      t("span", {
                        class: g(["chip", St(e).cls])
                      }, a(St(e).label), 3)
                    ]),
                    t("span", Qe, [
                      f(a(e.start_at), 1),
                      e.detail ? (n(), o(p, { key: 0 }, [
                        f(" · " + a(e.detail), 1)
                      ], 64)) : d("", !0)
                    ])
                  ])
                ]))), 128)),
                ct.value.length ? d("", !0) : (n(), o("li", Ke, "今天还没有安排，点右上角让 LIFE 安排。"))
              ])
            ]),
            t("article", Re, [
              t("div", We, [
                s[53] || (s[53] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", Xe, a((u.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: M(Yt, ["prevent"])
              }, [
                m(t("input", {
                  "onUpdate:modelValue": s[3] || (s[3] = (e) => k.value.title = e),
                  class: "input",
                  placeholder: "名称，如 生日 / 纪念日",
                  "aria-label": "重要日期名称"
                }, null, 512), [
                  [h, k.value.title]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[4] || (s[4] = (e) => k.value.date = e),
                  class: "input",
                  placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                  "aria-label": "重要日期"
                }, null, 512), [
                  [h, k.value.date]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[5] || (s[5] = (e) => k.value.note = e),
                  class: "input",
                  placeholder: "备注（可选）",
                  "aria-label": "备注"
                }, null, 512), [
                  [h, k.value.note]
                ]),
                t("label", Ze, [
                  m(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[6] || (s[6] = (e) => k.value.repeat_yearly = e)
                  }, null, 512), [
                    [ce, k.value.repeat_yearly]
                  ]),
                  s[54] || (s[54] = f(" 每年重复", -1))
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !k.value.title.trim() || !k.value.date.trim()
                }, "添加", 8, ts)
              ], 32),
              t("ul", es, [
                (n(!0), o(p, null, _(u.value.important_dates, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ss, [
                    t("strong", null, a(e.title), 1),
                    t("span", as, [
                      f(a(e.date_text), 1),
                      vt(e.date_text) !== null ? (n(), o(p, { key: 0 }, [
                        f(" · " + a(vt(e.date_text) === 0 ? "就是今天" : vt(e.date_text) + " 天后"), 1)
                      ], 64)) : d("", !0),
                      e.note ? (n(), o(p, { key: 1 }, [
                        f(" · " + a(e.note), 1)
                      ], 64)) : d("", !0)
                    ])
                  ]),
                  t("div", ls, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => Gt(e.id)
                    }, "删除", 8, ns)
                  ])
                ]))), 128)),
                u.value.important_dates?.length ? d("", !0) : (n(), o("li", os, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", is, [
              t("div", ds, [
                s[55] || (s[55] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", us, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[7] || (s[7] = (e) => Ut("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: q.value === "journal",
                    onClick: s[8] || (s[8] = (e) => Mt("journal"))
                  }, a(q.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, rs)
                ])
              ]),
              t("div", cs, [
                t("div", ps, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !U.value.previous || B.value,
                    onClick: s[9] || (s[9] = (e) => ft("previous"))
                  }, "← 前一页", 8, vs),
                  m(t("input", {
                    "onUpdate:modelValue": s[10] || (s[10] = (e) => A.value = e),
                    class: "input book-date",
                    type: "date",
                    "aria-label": "日记日期",
                    onChange: s[11] || (s[11] = (e) => ut(A.value))
                  }, null, 544), [
                    [h, A.value]
                  ]),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !U.value.next || B.value,
                    onClick: s[12] || (s[12] = (e) => ft("next"))
                  }, "后一页 →", 8, _s)
                ]),
                t("div", ms, [
                  t("p", hs, a(U.value.date), 1),
                  kt.value.length ? (n(), o("div", bs, [
                    (n(!0), o(p, null, _(kt.value, (e, i) => (n(), o("p", { key: i }, a(e), 1))), 128))
                  ])) : (n(), o("p", gs, a(B.value ? "翻页中…" : "这一天还没有写下什么。"), 1))
                ])
              ]),
              t("form", {
                class: "stack-form diary-manual",
                onSubmit: s[14] || (s[14] = M((e) => Ct("journal", K.value), ["prevent"]))
              }, [
                m(t("textarea", {
                  "onUpdate:modelValue": s[13] || (s[13] = (e) => K.value = e),
                  class: "input area",
                  placeholder: "为今天写下一点…"
                }, null, 512), [
                  [h, K.value]
                ]),
                s[56] || (s[56] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "写入今天", -1))
              ], 32)
            ]),
            t("article", ys, [
              t("div", ks, [
                s[57] || (s[57] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", fs, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[15] || (s[15] = (e) => Ut("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: q.value === "dream",
                    onClick: s[16] || (s[16] = (e) => Mt("dream"))
                  }, a(q.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, ws)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: s[18] || (s[18] = M((e) => Ct("dream", R.value), ["prevent"]))
              }, [
                m(t("textarea", {
                  "onUpdate:modelValue": s[17] || (s[17] = (e) => R.value = e),
                  class: "input area",
                  placeholder: "记录一个梦境或睡眠反思…"
                }, null, 512), [
                  [h, R.value]
                ]),
                s[58] || (s[58] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "记录梦境", -1))
              ], 32),
              t("ol", Cs, [
                (n(!0), o(p, null, _(u.value.dreams, (e) => (n(), o("li", {
                  key: e.id
                }, [
                  t("time", null, a(e.at), 1),
                  t("p", null, a(e.content), 1)
                ]))), 128)),
                u.value.dreams?.length ? d("", !0) : (n(), o("li", Ss, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", $s, [
          s[64] || (s[64] = t("h2", { class: "group-title" }, "生活日历", -1)),
          t("div", xs, [
            t("article", Ms, [
              t("div", Us, [
                s[60] || (s[60] = t("h2", { class: "card-title" }, "生活日历", -1)),
                t("div", js, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[19] || (s[19] = (e) => Vt(-1))
                  }, "←"),
                  t("strong", Vs, a(J.value), 1),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[20] || (s[20] = (e) => Vt(1))
                  }, "→")
                ])
              ]),
              t("div", Fs, [
                (n(), o(p, null, _(["日", "一", "二", "三", "四", "五", "六"], (e) => t("span", { key: e }, a(e), 1)), 64))
              ]),
              t("div", Ls, [
                (n(!0), o(p, null, _(Kt.value, (e) => (n(), o("div", {
                  key: e.key,
                  class: g(["cal-cell", { empty: e.empty, today: e.today, has: e.events?.length }])
                }, [
                  e.empty ? d("", !0) : (n(), o("span", Ns, a(e.day), 1)),
                  (n(!0), o(p, null, _((e.events || []).slice(0, 2), (i) => (n(), o("span", {
                    key: i.id,
                    class: "cal-chip",
                    title: i.title
                  }, a(i.title), 9, Ds))), 128)),
                  (e.events || []).length > 2 ? (n(), o("span", Ts, "+" + a(e.events.length - 2), 1)) : d("", !0)
                ], 2))), 128))
              ]),
              F.value.conflicts?.length ? (n(), o("p", Es, "⚠ " + a(F.value.conflicts.length) + " 处时间冲突：" + a(F.value.conflicts.map((e) => e.titles.join(" / ")).join("；")), 1)) : d("", !0),
              t("h3", Is, "本月待确认候选 (" + a(F.value.candidates?.length || 0) + ")", 1),
              t("ul", Ps, [
                (n(!0), o(p, null, _((F.value.candidates || []).slice(0, 6), (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Os, [
                    t("strong", null, a(e.title), 1),
                    t("span", qs, a(e.when_text), 1)
                  ]),
                  t("div", Ys, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (i) => c("confirm_agenda", { id: e.id }).then(st)
                    }, "确认", 8, Gs),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => c("reject_agenda", { id: e.id }).then(st)
                    }, "拒绝", 8, As)
                  ])
                ]))), 128)),
                (F.value.candidates || []).length ? d("", !0) : (n(), o("li", Bs, "没有待确认候选"))
              ])
            ]),
            t("article", Js, [
              t("div", zs, [
                s[61] || (s[61] = t("h2", { class: "card-title" }, "个人目标", -1)),
                t("span", Hs, a((u.value.goals || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: M(Rt, ["prevent"])
              }, [
                m(t("input", {
                  "onUpdate:modelValue": s[21] || (s[21] = (e) => L.value.title = e),
                  class: "input",
                  placeholder: "目标，如 学会一首钢琴曲",
                  "aria-label": "目标标题"
                }, null, 512), [
                  [h, L.value.title]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[22] || (s[22] = (e) => L.value.detail = e),
                  class: "input",
                  placeholder: "说明（可选）",
                  "aria-label": "目标说明"
                }, null, 512), [
                  [h, L.value.detail]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !L.value.title.trim()
                }, "添加目标", 8, Qs)
              ], 32),
              t("ul", Ks, [
                (n(!0), o(p, null, _(u.value.goals, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Rs, [
                    t("div", Ws, [
                      t("strong", {
                        class: g({ done: e.status === "done" })
                      }, a(e.title), 3),
                      t("span", {
                        class: g(["chip", e.status === "done" ? "chip-ok" : "muted"])
                      }, a(e.status === "done" ? "已完成" : "进行中"), 3)
                    ]),
                    t("div", Xs, [
                      t("i", {
                        style: it({ width: pt(e.progress) })
                      }, null, 4)
                    ]),
                    e.detail ? (n(), o("span", Zs, a(e.detail), 1)) : d("", !0)
                  ]),
                  t("div", ta, [
                    e.status !== "done" ? (n(), o("button", {
                      key: 0,
                      class: "btn btn-tonal btn-sm",
                      onClick: (i) => Wt(e.id)
                    }, "完成", 8, ea)) : d("", !0),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => Xt(e.id)
                    }, "删除", 8, sa)
                  ])
                ]))), 128)),
                (u.value.goals || []).length ? d("", !0) : (n(), o("li", aa, "还没有个人目标"))
              ])
            ]),
            t("article", la, [
              t("div", na, [
                s[62] || (s[62] = t("h2", { class: "card-title" }, "食物菜单", -1)),
                t("span", oa, a((u.value.food || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: M(Zt, ["prevent"])
              }, [
                m(t("input", {
                  "onUpdate:modelValue": s[23] || (s[23] = (e) => N.value.name = e),
                  class: "input",
                  placeholder: "食物，如 番茄牛腩",
                  "aria-label": "食物名称"
                }, null, 512), [
                  [h, N.value.name]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[24] || (s[24] = (e) => N.value.tags = e),
                  class: "input",
                  placeholder: "标签，如 家常 / 甜（可选）",
                  "aria-label": "食物标签"
                }, null, 512), [
                  [h, N.value.tags]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !N.value.name.trim()
                }, "加入菜单", 8, ia)
              ], 32),
              t("ul", da, [
                (n(!0), o(p, null, _(u.value.food, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ua, [
                    t("strong", null, a(e.name), 1),
                    t("span", ra, a(e.tags || "—"), 1)
                  ]),
                  t("div", ca, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => te(e.id)
                    }, "删除", 8, pa)
                  ])
                ]))), 128)),
                (u.value.food || []).length ? d("", !0) : (n(), o("li", va, "菜单还是空的"))
              ])
            ]),
            t("article", _a, [
              t("div", ma, [
                s[63] || (s[63] = t("h2", { class: "card-title" }, "群聊黑话词云", -1)),
                t("span", ha, a(ht.value.length), 1)
              ]),
              t("div", ba, [
                (n(!0), o(p, null, _(ht.value, (e) => (n(), o("span", {
                  key: e.topic,
                  class: "cloud-word",
                  style: it({ fontSize: 12 + Math.min(18, Math.log(e.score + 1) * 6) + "px", opacity: 0.55 + Math.min(0.45, e.score / 20) })
                }, a(e.topic), 5))), 128)),
                ht.value.length ? d("", !0) : (n(), o("span", ga, "还没有群聊词云数据"))
              ])
            ])
          ])
        ]),
        t("section", ya, [
          s[78] || (s[78] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", ka, [
            t("article", fa, [
              t("div", wa, [
                t("h2", Ca, a(E.value ? "用户详情" : "用户"), 1),
                E.value ? (n(), o("button", {
                  key: 0,
                  class: "btn btn-tonal btn-sm",
                  onClick: Ht
                }, "← 返回用户列表")) : (n(), o("span", Sa, a(mt.value.length) + " / " + a(u.value.relationships?.length || 0), 1))
              ]),
              E.value ? _t.value ? (n(), o("div", Ia, "加载中…")) : v.value ? (n(), o(p, { key: 2 }, [
                t("div", Pa, [
                  t("span", Oa, a((v.value.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", qa, [
                    t("strong", null, a(v.value.user_id), 1),
                    t("span", Ya, "阶段 " + a(v.value.relationship?.stage || "未知") + " · 好感 " + a(Math.round((v.value.relationship?.affinity || 0) * 100)) + "% · 最近 " + a(v.value.relationship?.last_seen || "—"), 1)
                  ])
                ]),
                t("nav", Ga, [
                  (n(), o(p, null, _(Jt, (e) => t("button", {
                    key: e.key,
                    class: g(["tab", { active: I.value === e.key }]),
                    onClick: (i) => I.value = e.key
                  }, a(e.label), 11, Aa)), 64))
                ]),
                I.value === "overview" ? (n(), o("div", Ba, [
                  t("div", Ja, [
                    t("div", za, [
                      s[67] || (s[67] = t("span", null, "关系事件", -1)),
                      t("strong", null, a(v.value.counts?.ledger || 0), 1)
                    ]),
                    t("div", Ha, [
                      s[68] || (s[68] = t("span", null, "主动候选", -1)),
                      t("strong", null, a(v.value.counts?.candidates || 0), 1)
                    ]),
                    t("div", Qa, [
                      s[69] || (s[69] = t("span", null, "已投递", -1)),
                      t("strong", null, a(v.value.counts?.delivered || 0), 1)
                    ]),
                    t("div", Ka, [
                      s[70] || (s[70] = t("span", null, "记忆条数", -1)),
                      t("strong", null, a(v.value.memories?.total || 0), 1)
                    ]),
                    t("div", Ra, [
                      s[71] || (s[71] = t("span", null, "阶段主动上限", -1)),
                      t("strong", null, a(v.value.stage_limit ?? "不限"), 1)
                    ])
                  ]),
                  s[72] || (s[72] = t("h3", { class: "section-label" }, "最近关系事件", -1)),
                  t("ol", Wa, [
                    (n(!0), o(p, null, _((v.value.ledger || []).slice(0, 5), (e) => (n(), o("li", {
                      key: e.id
                    }, [
                      t("time", null, a(V(e.created_at)), 1),
                      t("p", null, [
                        f(a(e.event_key) + " ", 1),
                        t("span", {
                          class: g(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        f(" · " + a(e.reason), 1)
                      ])
                    ]))), 128)),
                    (v.value.ledger || []).length ? d("", !0) : (n(), o("li", Xa, "暂无关系事件"))
                  ])
                ])) : I.value === "relationship" ? (n(), o("div", Za, [
                  t("div", tl, [
                    t("div", el, [
                      t("i", {
                        style: it({ width: pt(v.value.relationship?.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, a(Math.round((v.value.relationship?.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("div", sl, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[27] || (s[27] = (e) => $t(v.value.user_id, 0.05))
                    }, "更亲近 +"),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[28] || (s[28] = (e) => $t(v.value.user_id, -0.05))
                    }, "更疏远 −")
                  ]),
                  s[74] || (s[74] = t("h3", { class: "section-label" }, "事件账本", -1)),
                  t("ol", al, [
                    (n(!0), o(p, null, _(v.value.ledger, (e) => (n(), o("li", {
                      key: e.id
                    }, [
                      t("time", null, a(V(e.created_at)), 1),
                      t("p", null, [
                        t("strong", null, a(e.event_key), 1),
                        s[73] || (s[73] = f()),
                        t("span", {
                          class: g(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        f(" · " + a(e.reason) + " (" + a(e.channel) + ")", 1)
                      ])
                    ]))), 128)),
                    (v.value.ledger || []).length ? d("", !0) : (n(), o("li", ll, "暂无关系事件"))
                  ])
                ])) : I.value === "proactive" ? (n(), o("div", nl, [
                  s[75] || (s[75] = t("h3", { class: "section-label" }, "候选队列", -1)),
                  t("ul", ol, [
                    (n(!0), o(p, null, _(v.value.proactive?.candidates || [], (e) => (n(), o("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", il, [
                        t("strong", null, a(e.motive), 1),
                        t("span", dl, a(e.content), 1),
                        t("span", ul, a(e.status) + " · " + a(V(e.updated_at)), 1)
                      ]),
                      t("div", rl, [
                        ["delivered", "cancelled"].includes(e.status) ? d("", !0) : (n(), o("button", {
                          key: 0,
                          class: "btn btn-danger btn-sm",
                          onClick: (i) => xt(e.id)
                        }, "取消", 8, cl))
                      ])
                    ]))), 128)),
                    (v.value.proactive?.candidates || []).length ? d("", !0) : (n(), o("li", pl, "暂无主动记录"))
                  ]),
                  s[76] || (s[76] = t("h3", { class: "section-label" }, "投递记录", -1)),
                  t("ol", vl, [
                    (n(!0), o(p, null, _(v.value.proactive?.receipts || [], (e) => (n(), o("li", {
                      key: e.id
                    }, [
                      t("time", null, a(V(e.created_at)), 1),
                      t("p", null, a(e.phase) + " · " + a(e.content), 1)
                    ]))), 128)),
                    (v.value.proactive?.receipts || []).length ? d("", !0) : (n(), o("li", _l, "暂无投递"))
                  ])
                ])) : I.value === "memory" ? (n(), o("div", ml, [
                  t("ul", hl, [
                    (n(!0), o(p, null, _(v.value.memories?.items || [], (e) => (n(), o("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", bl, [
                        t("strong", gl, a(e.content), 1),
                        t("span", yl, "scope " + a(e.scope) + " · 重要度 " + a(Math.round((e.importance || 0) * 100)) + "% · 召回 " + a(e.recall_count) + " 次", 1)
                      ]),
                      t("div", kl, [
                        t("button", {
                          class: "btn btn-danger btn-sm",
                          onClick: (i) => Qt(e.id)
                        }, "删除", 8, fl)
                      ])
                    ]))), 128)),
                    (v.value.memories?.items || []).length ? d("", !0) : (n(), o("li", wl, "没有与该用户相关的记忆"))
                  ])
                ])) : (n(), o("div", Cl, [
                  t("ol", Sl, [
                    (n(!0), o(p, null, _(v.value.audit || [], (e) => (n(), o("li", {
                      key: e.id
                    }, [
                      t("span", {
                        class: g(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                        "aria-hidden": "true"
                      }, null, 2),
                      t("div", $l, [
                        t("div", xl, [
                          t("strong", null, a(e.kind), 1),
                          t("span", {
                            class: g(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                          }, a(e.outcome), 3),
                          t("time", null, a(V(e.created_at)), 1)
                        ]),
                        t("p", Ml, a(e.target), 1),
                        t("p", Ul, a(e.detail), 1)
                      ])
                    ]))), 128)),
                    (v.value.audit || []).length ? d("", !0) : (n(), o("li", jl, "暂无诊断记录"))
                  ])
                ]))
              ], 64)) : d("", !0) : (n(), o(p, { key: 0 }, [
                t("div", $a, [
                  m(t("input", {
                    "onUpdate:modelValue": s[25] || (s[25] = (e) => tt.value = e),
                    class: "input",
                    placeholder: "搜索用户 ID",
                    "aria-label": "搜索用户"
                  }, null, 512), [
                    [h, tt.value]
                  ]),
                  m(t("select", {
                    "onUpdate:modelValue": s[26] || (s[26] = (e) => et.value = e),
                    class: "input user-stage",
                    "aria-label": "按阶段筛选"
                  }, [
                    s[65] || (s[65] = t("option", { value: "" }, "全部阶段", -1)),
                    (n(!0), o(p, null, _(zt.value, (e) => (n(), o("option", {
                      key: e,
                      value: e
                    }, a(e), 9, xa))), 128))
                  ], 512), [
                    [Ft, et.value]
                  ])
                ]),
                t("ul", Ma, [
                  (n(!0), o(p, null, _(mt.value, (e) => (n(), o("li", {
                    key: e.user_id,
                    class: "rel",
                    onClick: (i) => jt(e.user_id)
                  }, [
                    t("span", ja, a((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                    t("div", Va, [
                      t("div", Fa, [
                        t("strong", null, a(e.user_id), 1),
                        t("span", La, a(e.stage), 1)
                      ]),
                      t("div", Na, [
                        t("div", Da, [
                          t("i", {
                            style: it({ width: pt(e.affinity) })
                          }, null, 4)
                        ]),
                        t("b", null, a(Math.round((e.affinity || 0) * 100)) + "%", 1)
                      ]),
                      t("span", Ta, "最近互动：" + a(e.last_seen || "暂无"), 1)
                    ]),
                    s[66] || (s[66] = t("span", {
                      class: "rel-chevron",
                      "aria-hidden": "true"
                    }, "›", -1))
                  ], 8, Ua))), 128)),
                  mt.value.length ? d("", !0) : (n(), o("li", Ea, "没有匹配的用户"))
                ])
              ], 64))
            ]),
            t("article", Vl, [
              s[77] || (s[77] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", Fl, [
                (n(!0), o(p, null, _(u.value.persona_evolution, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item trait-item"
                }, [
                  t("div", Ll, [
                    t("strong", null, a(e.trait), 1),
                    t("span", Nl, "支持 " + a(e.support_count) + " 次 · 置信度 " + a(Math.round((e.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", Dl, a(e.value), 1)
                ]))), 128)),
                u.value.persona_evolution?.length ? d("", !0) : (n(), o("li", Tl, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", El, [
          s[88] || (s[88] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", Il, [
            t("article", Pl, [
              t("div", Ol, [
                s[79] || (s[79] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", ql, "待投递 " + a(W.value.length), 1)
              ]),
              t("div", Yl, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Pt
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: X.value,
                  onClick: Ot
                }, a(X.value ? "检查中…" : "立即检查投递"), 9, Gl)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: M(Et, ["prevent"])
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
                }, "创建候选", 8, Al)
              ], 32),
              s[84] || (s[84] = t("h3", { class: "section-label" }, "候选队列", -1)),
              t("ul", Bl, [
                (n(!0), o(p, null, _(W.value, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Jl, [
                    t("strong", null, a(e.target) + " · " + a(e.motive), 1),
                    t("span", zl, a(e.content), 1),
                    t("span", Hl, "状态 " + a(e.status) + " · " + a(V(e.created_at)), 1)
                  ]),
                  t("div", Ql, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => xt(e.id)
                    }, "取消", 8, Kl)
                  ])
                ]))), 128)),
                W.value.length ? d("", !0) : (n(), o("li", Rl, "没有待投递候选"))
              ]),
              s[85] || (s[85] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", Wl, [
                t("label", Xl, [
                  s[80] || (s[80] = t("span", null, "每日上限", -1)),
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
                t("label", Zl, [
                  s[81] || (s[81] = t("span", null, "单人上限", -1)),
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
                t("label", tn, [
                  s[82] || (s[82] = t("span", null, "免打扰起", -1)),
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
                t("label", en, [
                  s[83] || (s[83] = t("span", null, "免打扰止", -1)),
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
                  onClick: It
                }, "保存策略")
              ]),
              s[86] || (s[86] = t("p", { class: "helper-inline" }, [
                f("免打扰起止相同即关闭；target 用 "),
                t("code", null, "session:<会话ID>"),
                f(" 可直接发到对话。")
              ], -1)),
              s[87] || (s[87] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", sn, [
                (n(!0), o(p, null, _(rt.value, (e) => (n(), o("li", {
                  key: e.id
                }, [
                  t("time", null, a(V(e.created_at)), 1),
                  t("p", null, a(e.phase) + " · " + a(e.content), 1)
                ]))), 128)),
                rt.value.length ? d("", !0) : (n(), o("li", an, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", ln, [
          s[96] || (s[96] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", nn, [
            t("article", on, [
              t("div", dn, [
                s[89] || (s[89] = t("h2", { class: "card-title" }, "群聊管理", -1)),
                t("span", un, a(at.value.length), 1)
              ]),
              t("form", {
                class: "group-form",
                onSubmit: M(se, ["prevent"])
              }, [
                m(t("input", {
                  "onUpdate:modelValue": s[37] || (s[37] = (e) => S.value.group_id = e),
                  class: "input",
                  placeholder: "群号",
                  "aria-label": "群号"
                }, null, 512), [
                  [h, S.value.group_id]
                ]),
                m(t("select", {
                  "onUpdate:modelValue": s[38] || (s[38] = (e) => S.value.policy = e),
                  class: "input policy-select",
                  "aria-label": "策略"
                }, [...s[90] || (s[90] = [
                  t("option", { value: "observe" }, "观察", -1),
                  t("option", { value: "whitelist" }, "白名单", -1),
                  t("option", { value: "blacklist" }, "黑名单", -1)
                ])], 512), [
                  [Ft, S.value.policy]
                ]),
                m(t("input", {
                  "onUpdate:modelValue": s[39] || (s[39] = (e) => S.value.alias = e),
                  class: "input",
                  placeholder: "备注名（可选）",
                  "aria-label": "备注名"
                }, null, 512), [
                  [h, S.value.alias]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !S.value.group_id.trim()
                }, "添加群", 8, rn)
              ], 32),
              t("ul", cn, [
                (n(!0), o(p, null, _(at.value, (e) => (n(), o("li", {
                  key: e.group_id,
                  class: "item group-item"
                }, [
                  t("div", pn, [
                    t("div", vn, [
                      t("strong", null, a(e.group_id), 1),
                      e.alias ? (n(), o("span", _n, a(e.alias), 1)) : d("", !0),
                      t("span", {
                        class: g(["chip", e.policy === "blacklist" ? "chip-warn" : e.policy === "whitelist" ? "chip-ok" : "muted"])
                      }, a(e.policy), 3)
                    ]),
                    t("span", mn, a(e.observations) + " 条观察 · " + a(e.topics) + " 个话题", 1),
                    T.value === e.group_id ? (n(), o("div", hn, [
                      s[93] || (s[93] = t("h4", { class: "section-label" }, "黑话 / 话题", -1)),
                      t("div", bn, [
                        (n(!0), o(p, null, _(bt.value[e.group_id] || [], (i) => (n(), o("span", {
                          key: i.topic,
                          class: "chip muted"
                        }, [
                          f(a(i.topic) + " · " + a(Math.round(i.score)), 1),
                          t("button", {
                            class: "chip-x",
                            onClick: (P) => de(e.group_id, i.topic)
                          }, "×", 8, gn)
                        ]))), 128)),
                        (bt.value[e.group_id] || []).length ? d("", !0) : (n(), o("span", yn, "暂无"))
                      ]),
                      t("form", {
                        class: "slang-form",
                        onSubmit: M((i) => ie(e.group_id), ["prevent"])
                      }, [
                        m(t("input", {
                          "onUpdate:modelValue": (i) => lt.value[e.group_id] = i,
                          class: "input",
                          placeholder: "新增黑话 / 话题",
                          "aria-label": "新增黑话"
                        }, null, 8, fn), [
                          [h, lt.value[e.group_id]]
                        ]),
                        s[91] || (s[91] = t("button", {
                          class: "btn btn-tonal btn-sm",
                          type: "submit"
                        }, "添加", -1))
                      ], 40, kn),
                      s[94] || (s[94] = t("h4", { class: "section-label" }, "成员安全", -1)),
                      t("ul", wn, [
                        (n(!0), o(p, null, _(gt.value[e.group_id] || [], (i) => (n(), o("li", {
                          key: i.user_id,
                          class: "member-row"
                        }, [
                          t("span", Cn, a(i.user_id), 1),
                          t("span", Sn, a(i.messages) + " 条 · " + a(V(i.last_at)), 1),
                          t("select", {
                            class: "input flag-select",
                            value: i.flag,
                            onChange: (P) => ne(e.group_id, i.user_id, P)
                          }, [...s[92] || (s[92] = [
                            t("option", { value: "watch" }, "关注", -1),
                            t("option", { value: "allow" }, "放行", -1),
                            t("option", { value: "mute" }, "禁言", -1)
                          ])], 40, $n)
                        ]))), 128)),
                        (gt.value[e.group_id] || []).length ? d("", !0) : (n(), o("li", xn, "暂无成员观察"))
                      ])
                    ])) : d("", !0)
                  ]),
                  t("div", Mn, [
                    t("select", {
                      class: "input policy-select",
                      value: e.policy,
                      onChange: (i) => le(e, i)
                    }, [...s[95] || (s[95] = [
                      t("option", { value: "observe" }, "观察", -1),
                      t("option", { value: "whitelist" }, "白名单", -1),
                      t("option", { value: "blacklist" }, "黑名单", -1)
                    ])], 40, Un),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (i) => oe(e.group_id)
                    }, a(T.value === e.group_id ? "收起" : "管理"), 9, jn),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => ae(e.group_id)
                    }, "删除", 8, Vn)
                  ])
                ]))), 128)),
                at.value.length ? d("", !0) : (n(), o("li", Fn, "还没有群记录。收到群消息或在上面添加。"))
              ])
            ])
          ])
        ]),
        t("section", Ln, [
          s[102] || (s[102] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", Nn, [
            t("article", Dn, [
              t("div", Tn, [
                s[97] || (s[97] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", En, a(j.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", In, [
                t("div", Pn, [
                  t("strong", null, a((j.value?.total_tokens || 0).toLocaleString()), 1),
                  s[98] || (s[98] = t("span", null, "总 Token", -1))
                ]),
                t("div", On, [
                  t("strong", null, a((j.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  s[99] || (s[99] = t("span", null, "输入", -1))
                ]),
                t("div", qn, [
                  t("strong", null, a((j.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  s[100] || (s[100] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", Yn, [
                (n(!0), o(p, null, _(j.value?.by_model || {}, (e, i) => (n(), o("li", {
                  key: i,
                  class: "item"
                }, [
                  t("div", Gn, [
                    t("strong", null, a(i), 1),
                    t("span", An, a((e.total || 0).toLocaleString()) + " tokens · " + a(e.count) + " 次", 1)
                  ])
                ]))), 128)),
                !j.value || !Object.keys(j.value.by_model || {}).length ? (n(), o("li", Bn, "暂无用量记录")) : d("", !0)
              ])
            ]),
            t("article", Jn, [
              t("div", zn, [
                s[101] || (s[101] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: s[40] || (s[40] = (e) => c("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", Hn, [
                (n(!0), o(p, null, _(u.value.audit, (e) => (n(), o("li", {
                  key: e.at + e.kind
                }, [
                  t("span", {
                    class: g(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", Qn, [
                    t("div", Kn, [
                      t("strong", null, a(e.kind), 1),
                      t("span", {
                        class: g(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, a(e.outcome), 3),
                      t("time", null, a(e.at), 1)
                    ]),
                    t("p", Rn, a(e.target), 1),
                    t("p", Wn, a(e.detail), 1)
                  ])
                ]))), 128)),
                u.value.audit?.length ? d("", !0) : (n(), o("li", Xn, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), ao = /* @__PURE__ */ ve(Zn, [["__scopeId", "data-v-dc46334b"]]);
export {
  ao as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-dc46334b]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-dc46334b]{max-width:1180px;margin:0 auto}.page-header[data-v-dc46334b]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-dc46334b]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-dc46334b]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-dc46334b]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-dc46334b]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-dc46334b]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-dc46334b]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-dc46334b]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-dc46334b]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-dc46334b]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-dc46334b]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-dc46334b]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-dc46334b]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-dc46334b]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-dc46334b]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-dc46334b]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-dc46334b]{display:flex;align-items:center;gap:10px}.stat-label[data-v-dc46334b]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-dc46334b]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-dc46334b]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-dc46334b]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-dc46334b]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-dc46334b]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-dc46334b]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-dc46334b]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-dc46334b]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-dc46334b]{margin-bottom:var(--space-lg)}.group-title[data-v-dc46334b]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-dc46334b]{margin-bottom:0}.card[data-v-dc46334b]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-dc46334b]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-dc46334b]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-dc46334b]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-dc46334b]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-dc46334b]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-dc46334b]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-dc46334b]{background:#fff1dc;color:#7a4400}.input[data-v-dc46334b]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-dc46334b]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-dc46334b]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-dc46334b]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-dc46334b]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-dc46334b]{grid-column:1/-1}.stack-form[data-v-dc46334b]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-dc46334b]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-dc46334b]{align-self:flex-start}.item-list[data-v-dc46334b],.rel-list[data-v-dc46334b],.feed[data-v-dc46334b],.timeline[data-v-dc46334b]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-dc46334b]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-dc46334b]{align-items:flex-start}.item[data-v-dc46334b]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-dc46334b]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-dc46334b]{font-size:14px;font-weight:600}.item-main strong.done[data-v-dc46334b]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-dc46334b]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-dc46334b]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-dc46334b]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-dc46334b]{background:transparent;border:0}.check-label[data-v-dc46334b]{display:flex;align-items:center}.check-line[data-v-dc46334b]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-dc46334b]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-dc46334b]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-dc46334b]{background:#fff1dc;color:#7a4400}.head-actions[data-v-dc46334b]{display:flex;gap:8px}.item-row[data-v-dc46334b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hint-inline[data-v-dc46334b]{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}.helper-inline[data-v-dc46334b]{margin:8px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.helper-inline code[data-v-dc46334b]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:2px 6px;border-radius:6px}.check-label input[data-v-dc46334b]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-dc46334b]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-dc46334b]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-dc46334b]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-dc46334b]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-dc46334b],.rel-meter[data-v-dc46334b]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-dc46334b]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-dc46334b]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-dc46334b]{font-size:12px}.rel-actions[data-v-dc46334b]{display:flex;gap:4px}.ledger[data-v-dc46334b]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.user-tools[data-v-dc46334b]{display:flex;gap:10px;margin-bottom:12px}.user-stage[data-v-dc46334b]{width:130px;flex:0 0 auto}.rel[data-v-dc46334b]{cursor:pointer}.rel-chevron[data-v-dc46334b]{font-size:20px;color:var(--md-on-surface-variant);flex-shrink:0}.detail-head[data-v-dc46334b]{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}.tabs[data-v-dc46334b]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tab[data-v-dc46334b]{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:600 12.5px/1 inherit;cursor:pointer}.tab[data-v-dc46334b]:hover{border-color:var(--md-primary)}.tab.active[data-v-dc46334b]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}.detail-body[data-v-dc46334b]{display:flex;flex-direction:column;gap:6px}.kv-grid[data-v-dc46334b]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.kv[data-v-dc46334b]{background:var(--md-surface-container-low);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:4px}.kv span[data-v-dc46334b]{font-size:12px;color:var(--md-on-surface-variant)}.kv strong[data-v-dc46334b]{font-size:20px;font-weight:700}.rel-meter.big[data-v-dc46334b]{margin:6px 0}.rel-meter.big b[data-v-dc46334b]{font-size:15px}.mem-text[data-v-dc46334b]{font-weight:500!important;line-height:1.6}.cal-card[data-v-dc46334b]{grid-column:1/-1}.cal-month[data-v-dc46334b]{font-size:14px;font-weight:700;min-width:76px;text-align:center}.cal-week[data-v-dc46334b]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}.cal-week span[data-v-dc46334b]{text-align:center;font-size:11px;color:var(--md-on-surface-variant);font-weight:600}.cal-grid[data-v-dc46334b]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-cell[data-v-dc46334b]{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}.cal-cell.empty[data-v-dc46334b]{border-color:transparent;background:transparent}.cal-cell.today[data-v-dc46334b]{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 18%,transparent)}.cal-cell.has[data-v-dc46334b]{background:var(--md-surface-container-low)}.cal-day[data-v-dc46334b]{font-size:12px;font-weight:700;color:var(--md-on-surface-variant)}.cal-chip[data-v-dc46334b]{font-size:10.5px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-more[data-v-dc46334b]{font-size:10px;color:var(--md-on-surface-variant)}.cal-warn[data-v-dc46334b]{margin:12px 0 0;padding:8px 12px;border-radius:10px;background:#fff1dc;color:#7a4400;font-size:12.5px}.cloud[data-v-dc46334b]{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}.cloud-word[data-v-dc46334b]{font-weight:700;color:var(--md-primary);line-height:1.2}.group-form[data-v-dc46334b]{display:grid;grid-template-columns:1fr 120px 1fr auto;gap:10px;margin-bottom:12px}.policy-select[data-v-dc46334b]{width:auto;height:34px;flex:0 0 auto}.flag-select[data-v-dc46334b]{width:auto;height:30px;flex:0 0 auto;font-size:12px}.slang-form[data-v-dc46334b]{display:flex;gap:8px;margin:8px 0}.slang-form .input[data-v-dc46334b]{height:34px}.chip-x[data-v-dc46334b]{border:0;background:transparent;color:inherit;cursor:pointer;font-weight:700;margin-left:4px}.member-list[data-v-dc46334b]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.member-row[data-v-dc46334b]{display:flex;align-items:center;gap:10px;font-size:12.5px}.member-id[data-v-dc46334b]{font-weight:600;min-width:80px}.member-row .item-meta[data-v-dc46334b]{flex:1}.book[data-v-dc46334b]{border:1px solid var(--md-outline-variant);border-radius:14px;background:linear-gradient(180deg,var(--md-surface-container-lowest),var(--md-surface-container-low));padding:16px 18px}.book-nav[data-v-dc46334b]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.book-date[data-v-dc46334b]{width:auto;height:34px;flex:0 0 auto}.book-page[data-v-dc46334b]{min-height:120px;border-top:1px solid var(--md-outline-variant);padding-top:14px}.book-heading[data-v-dc46334b]{margin:0 0 10px;font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--md-on-surface-variant);letter-spacing:.02em}.book-body[data-v-dc46334b]{display:flex;flex-direction:column;gap:10px}.book-body p[data-v-dc46334b]{margin:0;font-size:14px;line-height:1.95;text-indent:2em;color:var(--md-on-surface);white-space:pre-wrap;overflow-wrap:anywhere}.book-empty[data-v-dc46334b]{margin:0;font-size:13px;color:var(--md-on-surface-variant);font-style:italic}.diary-manual[data-v-dc46334b]{margin-top:14px;border-top:1px dashed var(--md-outline-variant);padding-top:12px}.feed li[data-v-dc46334b]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-dc46334b]{padding:8px 12px}.feed time[data-v-dc46334b],.timeline time[data-v-dc46334b]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-dc46334b]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-dc46334b]{color:var(--md-success);font-weight:700}.neg[data-v-dc46334b]{color:var(--md-error);font-weight:700}.policy[data-v-dc46334b]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-dc46334b]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-dc46334b]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-dc46334b]{margin-top:6px}.audit-card[data-v-dc46334b]{margin-bottom:var(--space-lg)}.usage-grid[data-v-dc46334b]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-dc46334b]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-dc46334b]{font-size:20px;font-weight:700}.usage-item span[data-v-dc46334b]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-dc46334b]{position:relative}.timeline li[data-v-dc46334b]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-dc46334b]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-dc46334b]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-dc46334b]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-dc46334b]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-dc46334b]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-dc46334b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-dc46334b]{font-size:13.5px;font-weight:650}.tl-detail[data-v-dc46334b]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-dc46334b]{grid-template-columns:repeat(2,1fr)}.grid[data-v-dc46334b],.agenda-form[data-v-dc46334b]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-dc46334b]{padding:var(--space-lg)}.header-actions[data-v-dc46334b]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
