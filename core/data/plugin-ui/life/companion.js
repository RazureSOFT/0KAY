import { defineComponent as xe, ref as c, computed as U, onMounted as $e, openBlock as n, createElementBlock as o, createElementVNode as t, toDisplayString as a, createCommentVNode as u, createStaticVNode as pt, normalizeClass as h, withModifiers as x, withDirectives as p, vModelText as _, Fragment as v, renderList as m, createTextVNode as y, vModelCheckbox as Se, normalizeStyle as vt, vModelSelect as Ot } from "vue";
import { u as Ue, _ as Ve } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const je = { class: "page" }, Me = { class: "page-inner" }, Fe = { class: "page-header" }, Ne = { class: "header-actions" }, De = ["disabled"], Le = ["disabled"], Ee = {
  key: 0,
  class: "error-banner"
}, Te = {
  key: 1,
  class: "notice"
}, Ie = { class: "stat-grid" }, Pe = { class: "stat-card" }, Oe = { class: "stat-value" }, qe = { class: "stat-card" }, Ye = { class: "stat-value" }, Ae = { class: "stat-card" }, Be = { class: "stat-value" }, Ge = { class: "stat-hint" }, Je = { class: "stat-card" }, ze = { class: "stat-value" }, He = { class: "life-state" }, Qe = { class: "state-pill" }, Ke = {
  key: 0,
  class: "state-pill"
}, Re = { class: "group" }, We = { class: "grid" }, Xe = { class: "card" }, Ze = { class: "item-list" }, ts = { class: "item-main" }, es = { class: "item-meta" }, ss = { class: "item-actions" }, as = ["onClick"], ls = ["onClick"], ns = {
  key: 0,
  class: "list-empty"
}, os = { class: "item-list" }, is = { class: "item-main" }, ds = { class: "item-row" }, us = { class: "item-meta" }, rs = {
  key: 0,
  class: "list-empty"
}, cs = { class: "card" }, ps = { class: "card-head" }, vs = { class: "chip muted" }, _s = { class: "check-line" }, ms = ["disabled"], bs = { class: "item-list" }, hs = { class: "item-main" }, gs = { class: "item-meta" }, ys = { class: "item-actions" }, ks = ["onClick"], fs = {
  key: 0,
  class: "list-empty"
}, ws = { class: "card" }, Cs = { class: "card-head" }, xs = { class: "head-actions" }, $s = ["disabled"], Ss = { class: "book" }, Us = { class: "book-nav" }, Vs = ["disabled"], js = ["disabled"], Ms = { class: "book-page" }, Fs = { class: "book-heading" }, Ns = {
  key: 0,
  class: "book-body"
}, Ds = {
  key: 1,
  class: "book-empty"
}, Ls = { class: "card" }, Es = { class: "card-head" }, Ts = { class: "head-actions" }, Is = ["disabled"], Ps = { class: "feed" }, Os = {
  key: 0,
  class: "list-empty plain"
}, qs = { class: "group" }, Ys = { class: "grid" }, As = { class: "card cal-card" }, Bs = { class: "card-head" }, Gs = { class: "head-actions" }, Js = { class: "cal-month" }, zs = { class: "cal-week" }, Hs = { class: "cal-grid" }, Qs = {
  key: 0,
  class: "cal-day"
}, Ks = ["title"], Rs = {
  key: 1,
  class: "cal-more"
}, Ws = {
  key: 0,
  class: "cal-warn"
}, Xs = { class: "section-label" }, Zs = { class: "item-list" }, ta = { class: "item-main" }, ea = { class: "item-meta" }, sa = { class: "item-actions" }, aa = ["onClick"], la = ["onClick"], na = {
  key: 0,
  class: "list-empty"
}, oa = { class: "card" }, ia = { class: "card-head" }, da = { class: "chip muted" }, ua = ["disabled"], ra = { class: "item-list" }, ca = { class: "item-main" }, pa = { class: "item-row" }, va = { class: "meter-bar" }, _a = {
  key: 0,
  class: "item-meta"
}, ma = { class: "item-actions" }, ba = ["onClick"], ha = ["onClick"], ga = {
  key: 0,
  class: "list-empty"
}, ya = { class: "card" }, ka = { class: "card-head" }, fa = { class: "chip muted" }, wa = ["disabled"], Ca = { class: "item-list" }, xa = { class: "item-main" }, $a = { class: "item-meta" }, Sa = { class: "item-actions" }, Ua = ["onClick"], Va = {
  key: 0,
  class: "list-empty"
}, ja = { class: "card" }, Ma = { class: "card-head" }, Fa = { class: "chip muted" }, Na = { class: "cloud" }, Da = {
  key: 0,
  class: "list-empty plain"
}, La = { class: "group" }, Ea = { class: "grid" }, Ta = { class: "card" }, Ia = { class: "card-head" }, Pa = { class: "card-title" }, Oa = {
  key: 1,
  class: "chip muted"
}, qa = { class: "user-tools" }, Ya = ["value"], Aa = { class: "rel-list" }, Ba = ["onClick"], Ga = { class: "avatar" }, Ja = { class: "rel-main" }, za = { class: "rel-top" }, Ha = { class: "chip" }, Qa = { class: "rel-meter" }, Ka = { class: "meter-bar" }, Ra = { class: "item-meta" }, Wa = {
  key: 0,
  class: "list-empty"
}, Xa = {
  key: 1,
  class: "list-empty"
}, Za = { class: "detail-head" }, tl = { class: "avatar" }, el = { class: "rel-main" }, sl = { class: "item-meta" }, al = { class: "tabs" }, ll = ["onClick"], nl = {
  key: 0,
  class: "detail-body"
}, ol = { class: "kv-grid" }, il = { class: "kv" }, dl = { class: "kv" }, ul = { class: "kv" }, rl = { class: "kv" }, cl = { class: "kv" }, pl = { class: "feed compact" }, vl = {
  key: 0,
  class: "list-empty plain"
}, _l = {
  key: 1,
  class: "detail-body"
}, ml = { class: "rel-meter big" }, bl = { class: "meter-bar" }, hl = { class: "rel-actions" }, gl = { class: "feed compact" }, yl = {
  key: 0,
  class: "list-empty plain"
}, kl = {
  key: 2,
  class: "detail-body"
}, fl = { class: "item-list" }, wl = { class: "item-main" }, Cl = { class: "item-meta" }, xl = { class: "item-meta" }, $l = { class: "item-actions" }, Sl = ["onClick"], Ul = {
  key: 0,
  class: "list-empty"
}, Vl = { class: "feed compact" }, jl = {
  key: 0,
  class: "list-empty plain"
}, Ml = {
  key: 3,
  class: "detail-body"
}, Fl = { class: "item-list" }, Nl = { class: "item-main" }, Dl = { class: "mem-text" }, Ll = { class: "item-meta" }, El = { class: "item-actions" }, Tl = ["onClick"], Il = {
  key: 0,
  class: "list-empty"
}, Pl = {
  key: 4,
  class: "detail-body"
}, Ol = { class: "timeline" }, ql = { class: "tl-body" }, Yl = { class: "tl-head" }, Al = { class: "item-meta" }, Bl = { class: "tl-detail" }, Gl = {
  key: 0,
  class: "list-empty plain"
}, Jl = { class: "card" }, zl = { class: "item-list" }, Hl = { class: "item-main" }, Ql = { class: "item-meta" }, Kl = { class: "chip" }, Rl = {
  key: 0,
  class: "list-empty"
}, Wl = { class: "group" }, Xl = { class: "grid" }, Zl = { class: "card" }, tn = { class: "card-head" }, en = { class: "chip muted" }, sn = { class: "form-row" }, an = ["disabled"], ln = { class: "item-list" }, nn = { class: "item-main" }, on = { class: "item-row" }, dn = { class: "chip muted" }, un = { class: "chip" }, rn = {
  key: 0,
  class: "item-meta"
}, cn = { class: "item-actions" }, pn = ["onClick"], vn = {
  key: 0,
  class: "list-empty"
}, _n = { class: "card" }, mn = { class: "card-head" }, bn = { class: "chip muted" }, hn = { class: "toolbar-inline" }, gn = ["disabled"], yn = { class: "item-list" }, kn = { class: "item-main" }, fn = { class: "item-meta" }, wn = { class: "item-actions" }, Cn = ["onClick"], xn = ["onClick"], $n = ["onClick"], Sn = {
  key: 0,
  class: "list-empty"
}, Un = { class: "card" }, Vn = { class: "card-head" }, jn = { class: "chip muted" }, Mn = { class: "form-row" }, Fn = ["disabled"], Nn = { class: "item-list" }, Dn = { class: "item-main" }, Ln = { class: "item-meta" }, En = {
  key: 0,
  class: "list-empty"
}, Tn = ["disabled"], In = { class: "item-list" }, Pn = { class: "item-main" }, On = { class: "item-meta" }, qn = { class: "item-actions" }, Yn = ["onClick"], An = {
  key: 0,
  class: "list-empty"
}, Bn = { class: "group" }, Gn = { class: "grid" }, Jn = { class: "card" }, zn = { class: "card-head" }, Hn = { class: "chip muted" }, Qn = { class: "toolbar-inline" }, Kn = ["disabled"], Rn = ["disabled"], Wn = { class: "item-list" }, Xn = { class: "item-main" }, Zn = { class: "item-meta" }, to = { class: "item-meta" }, eo = { class: "item-actions" }, so = ["onClick"], ao = {
  key: 0,
  class: "list-empty"
}, lo = { class: "policy" }, no = { class: "select" }, oo = { class: "select" }, io = { class: "select" }, uo = { class: "select" }, ro = { class: "feed" }, co = {
  key: 0,
  class: "list-empty plain"
}, po = { class: "group" }, vo = { class: "grid" }, _o = { class: "card" }, mo = { class: "card-head" }, bo = { class: "chip muted" }, ho = ["disabled"], go = { class: "item-list" }, yo = { class: "item-main" }, ko = { class: "item-row" }, fo = {
  key: 0,
  class: "chip muted"
}, wo = { class: "item-meta" }, Co = {
  key: 0,
  class: "group-detail"
}, xo = { class: "topics" }, $o = ["onClick"], So = {
  key: 0,
  class: "item-meta"
}, Uo = ["onSubmit"], Vo = ["onUpdate:modelValue"], jo = { class: "member-list" }, Mo = { class: "member-id" }, Fo = { class: "item-meta" }, No = ["value", "onChange"], Do = {
  key: 0,
  class: "item-meta"
}, Lo = { class: "item-actions" }, Eo = ["value", "onChange"], To = ["onClick"], Io = ["onClick"], Po = {
  key: 0,
  class: "list-empty"
}, Oo = { class: "group" }, qo = { class: "grid" }, Yo = { class: "card audit-card" }, Ao = { class: "card-head" }, Bo = { class: "chip muted" }, Go = { class: "usage-grid" }, Jo = { class: "usage-item" }, zo = { class: "usage-item" }, Ho = { class: "usage-item" }, Qo = { class: "item-list" }, Ko = { class: "item-main" }, Ro = { class: "item-meta" }, Wo = {
  key: 0,
  class: "list-empty"
}, Xo = { class: "card audit-card" }, Zo = { class: "card-head" }, ti = { class: "timeline" }, ei = { class: "tl-body" }, si = { class: "tl-head" }, ai = { class: "item-meta" }, li = { class: "tl-detail" }, ni = {
  key: 0,
  class: "list-empty plain"
}, oi = /* @__PURE__ */ xe({
  __name: "CompanionPage",
  setup(ii) {
    const { confirm: qt } = Ue(), d = c({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), W = c(!1), M = c(""), z = c(""), H = c(""), X = c(""), Z = c(""), tt = c(""), et = c(""), _t = () => {
      const l = /* @__PURE__ */ new Date(), s = (e) => String(e).padStart(2, "0");
      return `${l.getFullYear()}-${s(l.getMonth() + 1)}-${s(l.getDate())}`;
    }, Q = c(_t()), F = c({ date: "", content: "", previous: null, next: null }), K = c(!1), St = U(() => (F.value.content || "").split(/\n{2,}/).map((l) => l.trim()).filter(Boolean));
    async function mt(l = Q.value) {
      K.value = !0;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "journal_page", payload: { date: l } }) });
        if (!s.ok) throw Error(await s.text());
        const e = await s.json();
        F.value = { date: e?.date || l, content: e?.content || "", previous: e?.previous || null, next: e?.next || null }, Q.value = F.value.date;
      } catch (s) {
        M.value = s?.message || "无法读取日记";
      } finally {
        K.value = !1;
      }
    }
    function Ut(l) {
      const s = l === "previous" ? F.value.previous : F.value.next;
      s && mt(s);
    }
    const O = c(""), g = c({ target: "", motive: "", content: "", preferred_at: "" }), k = c({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), Yt = U(() => Object.entries(d.value.groups || {})), st = U(() => (d.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), bt = U(() => d.value.proactive?.receipts || []), Vt = _t(), ht = U(() => (d.value.agenda || []).filter((l) => {
      const s = String(l.start_at || "").replace("T", " ");
      return !s || s.slice(0, 10) >= Vt;
    }));
    function w(l) {
      z.value = l, setTimeout(() => {
        z.value === l && (z.value = "");
      }, 2e3);
    }
    const N = c(null);
    async function At() {
      try {
        const l = await fetch("/api/usage");
        l.ok && (N.value = await l.json());
      } catch {
      }
    }
    async function G() {
      W.value = !0, M.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        d.value = await l.json(), d.value?.policy && (k.value = { ...k.value, ...d.value.policy });
      } catch (l) {
        M.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        W.value = !1;
      }
      At(), mt(), it(), ue();
    }
    async function r(l, s) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: s }) });
        if (!e.ok) throw Error(await e.text());
        return await G(), await e.json().catch(() => ({}));
      } catch (e) {
        return M.value = e?.message || "操作失败", null;
      }
    }
    async function Bt() {
      H.value.trim() && (await r("add_agenda", { title: H.value, when: X.value, detail: Z.value }), H.value = "", X.value = "", Z.value = "");
    }
    async function jt(l, s) {
      s.trim() && (await r(l, { content: s }), l === "journal" ? tt.value = "" : et.value = "");
    }
    function gt(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    function Mt(l) {
      if (l.status === "completed") return { label: "已完成", cls: "chip-ok" };
      const s = new Date(String(l.start_at || "").replace(" ", "T"));
      return !Number.isNaN(s.getTime()) && s.getTime() <= Date.now() ? { label: "进行中", cls: "chip-warn" } : { label: "待开始", cls: "muted" };
    }
    async function Ft(l, s) {
      await r("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: s }) && w(`已调整 ${l}`);
    }
    async function Gt() {
      if (!g.value.target.trim() || !g.value.content.trim()) return;
      await r("proactive_create", { ...g.value }) && (g.value = { target: "", motive: "", content: "", preferred_at: "" }, w("已创建主动候选"));
    }
    async function Nt(l) {
      await r("proactive_cancel", { id: l, reason: "dashboard_cancel" }), w("已取消候选");
    }
    async function Jt() {
      await r("proactive_policy", { daily_limit: Number(k.value.daily_limit), per_target_limit: Number(k.value.per_target_limit), quiet_start: Number(k.value.quiet_start), quiet_end: Number(k.value.quiet_end) }), w("策略已保存");
    }
    const J = c("");
    async function Dt(l) {
      J.value = l;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        await G(), w("已由 LIFE 生成");
      } catch (s) {
        M.value = s?.message || "生成失败";
      } finally {
        J.value = "";
      }
    }
    async function zt() {
      const l = g.value.target.trim() || "user:owner";
      await r("proactive_suggest", { target: l, hint: g.value.motive }) && (g.value = { target: "", motive: "", content: "", preferred_at: "" }, w("已生成建议候选"));
    }
    const at = c(!1);
    async function Ht() {
      at.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await G(), w(s?.skipped ? `本次跳过：${s.skipped}` : `已投递 ${s.delivered || 0} 条 · 拦截 ${s.blocked || 0} 条`);
      } catch (l) {
        M.value = l?.message || "投递失败";
      } finally {
        at.value = !1;
      }
    }
    const lt = c(!1);
    async function Qt() {
      lt.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await G();
        const e = s?.applied;
        w(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (l) {
        M.value = l?.message || "规划失败";
      } finally {
        lt.value = !1;
      }
    }
    function yt(l) {
      const s = (l || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let i = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? (i = new Date(s), i.setHours(0, 0, 0, 0), i < e && i.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(s) && (i = new Date(e.getFullYear(), Number(s.slice(0, 2)) - 1, Number(s.slice(3, 5))), i < e && i.setFullYear(e.getFullYear() + 1)), !i || Number.isNaN(i.getTime()) ? null : Math.round((i.getTime() - e.getTime()) / 864e5);
    }
    const f = c({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function Kt() {
      !f.value.title.trim() || !f.value.date.trim() || (await r("date_add", { ...f.value }), f.value = { title: "", date: "", repeat_yearly: !0, note: "" }, w("已添加重要日期"));
    }
    async function Rt(l) {
      await r("date_delete", { id: l }), w("已删除");
    }
    async function Wt() {
      await r("circadian_eat", { amount: 45 }), w("已用餐");
    }
    async function Xt() {
      const l = await r("daily_agenda", {});
      w(l?.created ? `LIFE 已安排 ${l.created} 项活动` : "今天已有安排");
    }
    async function Lt(l) {
      await qt({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await r("journal_clear", { kind: l }), w("已清除"));
    }
    function D(l) {
      if (!l) return "";
      const s = new Date(l);
      return Number.isNaN(s.getTime()) ? l : s.toLocaleString();
    }
    const q = c(""), nt = c(""), ot = c(""), b = c(null), kt = c(!1), Y = c("overview"), Zt = [{ key: "overview", label: "概览" }, { key: "relationship", label: "关系" }, { key: "proactive", label: "主动" }, { key: "memory", label: "记忆" }, { key: "diagnostics", label: "诊断" }], te = U(() => Array.from(new Set((d.value.relationships || []).map((l) => l.stage).filter(Boolean)))), ft = U(() => (d.value.relationships || []).filter((l) => (!nt.value || String(l.user_id).toLowerCase().includes(nt.value.toLowerCase())) && (!ot.value || l.stage === ot.value)));
    async function Et(l) {
      q.value = l, Y.value = "overview", kt.value = !0;
      const s = await r("user_detail", { user_id: l, limit: 100, memory_limit: 100 });
      b.value = s || null, kt.value = !1;
    }
    function ee() {
      q.value = "", b.value = null;
    }
    async function se(l) {
      await r("delete_memory", { id: l }), q.value && Et(q.value);
    }
    const R = c(_t().slice(0, 7)), L = c({ events: [], candidates: [], conflicts: [] }), E = c({ title: "", detail: "", kind: "growth" }), T = c({ name: "", tags: "", note: "" }), wt = U(() => d.value.word_cloud || []), ae = U(() => {
      const [l, s] = R.value.split("-").map(Number);
      if (!l || !s) return [];
      const e = new Date(l, s, 0).getDate(), i = new Date(l, s - 1, 1).getDay(), B = {};
      for (const S of L.value.events || []) {
        const P = String(S.start_at || "").replace("T", " ").slice(0, 10);
        (B[P] || (B[P] = [])).push(S);
      }
      const $t = [];
      for (let S = 0; S < i; S++) $t.push({ key: `pad-${S}`, empty: !0 });
      for (let S = 1; S <= e; S++) {
        const P = `${l}-${String(s).padStart(2, "0")}-${String(S).padStart(2, "0")}`;
        $t.push({ key: P, day: S, iso: P, events: B[P] || [], today: P === Vt });
      }
      return $t;
    });
    async function it() {
      const l = await r("calendar_month", { month: R.value });
      l && (L.value = l);
    }
    function Tt(l) {
      const [s, e] = R.value.split("-").map(Number), i = new Date(s, e - 1 + l, 1);
      R.value = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}`, it();
    }
    async function le() {
      E.value.title.trim() && (await r("goal_add", { ...E.value }), E.value = { title: "", detail: "", kind: "growth" });
    }
    async function ne(l) {
      await r("goal_update", { id: l, status: "done", progress: 1 });
    }
    async function oe(l) {
      await r("goal_delete", { id: l });
    }
    async function ie() {
      T.value.name.trim() && (await r("food_add", { ...T.value }), T.value = { name: "", tags: "", note: "" });
    }
    async function de(l) {
      await r("food_delete", { id: l });
    }
    const dt = c([]), V = c({ group_id: "", policy: "observe", alias: "" }), Ct = c({}), xt = c({}), ut = c({});
    async function ue() {
      const l = await r("group_list", {});
      l && (dt.value = l.groups || []);
    }
    async function re() {
      V.value.group_id.trim() && (await r("group_upsert", { ...V.value }), V.value = { group_id: "", policy: "observe", alias: "" });
    }
    async function ce(l) {
      await r("group_delete", { group_id: l }), O.value === l && (O.value = "");
    }
    async function pe(l, s) {
      const e = s.target.value;
      await r("group_upsert", { group_id: l.group_id, policy: e, alias: l.alias || "", note: l.note || "" });
    }
    async function ve(l, s, e) {
      const i = e.target.value;
      await r("group_member_flag", { group_id: l, user_id: s, flag: i }), rt(l);
    }
    async function rt(l) {
      const [s, e] = await Promise.all([r("group_slang_list", { group_id: l }), r("group_members", { group_id: l })]);
      Ct.value[l] = s?.slang || [], xt.value[l] = e?.members || [];
    }
    function _e(l) {
      O.value = O.value === l ? "" : l, O.value && rt(l);
    }
    async function me(l) {
      const s = (ut.value[l] || "").trim();
      s && (await r("group_slang_update", { group_id: l, topic: s, score: 1 }), ut.value[l] = "", rt(l));
    }
    async function be(l, s) {
      await r("group_slang_delete", { group_id: l, topic: s }), rt(l);
    }
    const C = c({ name: "", category: "general", level: 1, keywords: "" }), I = c({ text: "", scene: "" }), A = c("pending"), j = c({ user_id: "", name: "", tags: "" }), $ = c({ source_id: "", target_id: "", relation: "" }), It = U(() => (d.value.expressions || []).filter((l) => l.status === A.value)), ct = U(() => {
      const l = d.value.expressions || [];
      return { pending: l.filter((s) => s.status === "pending").length, approved: l.filter((s) => s.status === "approved").length, rejected: l.filter((s) => s.status === "rejected").length };
    });
    async function he() {
      C.value.name.trim() && (await r("skill_add", { ...C.value, level: Number(C.value.level) }), C.value = { name: "", category: "general", level: 1, keywords: "" });
    }
    async function ge(l) {
      await r("skill_delete", { id: l });
    }
    async function ye() {
      I.value.text.trim() && (await r("expression_add", { ...I.value }), I.value = { text: "", scene: "" });
    }
    async function Pt(l, s) {
      await r("expression_review", { id: l, accept: s });
    }
    async function ke(l) {
      await r("expression_delete", { id: l });
    }
    async function fe() {
      j.value.user_id.trim() && (await r("social_node_upsert", { ...j.value }), j.value = { user_id: "", name: "", tags: "" });
    }
    async function we() {
      !$.value.source_id.trim() || !$.value.target_id.trim() || (await r("social_edge_add", { ...$.value }), $.value = { source_id: "", target_id: "", relation: "" });
    }
    async function Ce(l) {
      await r("social_edge_delete", { id: l });
    }
    return $e(G), (l, s) => (n(), o("main", je, [
      t("div", Me, [
        t("header", Fe, [
          s[56] || (s[56] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", Ne, [
            t("button", {
              class: "btn btn-primary",
              disabled: lt.value,
              onClick: Qt
            }, a(lt.value ? "规划中…" : "让 LIFE 规划"), 9, De),
            t("button", {
              class: "btn btn-tonal",
              disabled: W.value,
              onClick: G
            }, a(W.value ? "刷新中…" : "刷新"), 9, Le)
          ])
        ]),
        M.value ? (n(), o("p", Ee, a(M.value), 1)) : u("", !0),
        z.value ? (n(), o("p", Te, a(z.value), 1)) : u("", !0),
        t("section", Ie, [
          t("article", Pe, [
            s[57] || (s[57] = pt('<div class="stat-head" data-v-a7858fe0><span class="icon-badge tone-1" aria-hidden="true" data-v-a7858fe0><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-a7858fe0><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-a7858fe0></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-a7858fe0></path></svg></span><span class="stat-label" data-v-a7858fe0>关系对象</span></div>', 1)),
            t("strong", Oe, a(d.value.relationships?.length || 0), 1),
            s[58] || (s[58] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", qe, [
            s[59] || (s[59] = pt('<div class="stat-head" data-v-a7858fe0><span class="icon-badge tone-2" aria-hidden="true" data-v-a7858fe0><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-a7858fe0><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-a7858fe0></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-a7858fe0></path></svg></span><span class="stat-label" data-v-a7858fe0>活动日程</span></div>', 1)),
            t("strong", Ye, a(ht.value.filter((e) => e.status === "active").length), 1),
            s[60] || (s[60] = t("span", { class: "stat-hint" }, "今天起待进行", -1))
          ]),
          t("article", Ae, [
            s[61] || (s[61] = pt('<div class="stat-head" data-v-a7858fe0><span class="icon-badge tone-3" aria-hidden="true" data-v-a7858fe0><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-a7858fe0><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-a7858fe0></path></svg></span><span class="stat-label" data-v-a7858fe0>待投递主动行为</span></div>', 1)),
            t("strong", Be, a(st.value.length), 1),
            t("span", Ge, "已投递 " + a(bt.value.length) + " 次", 1)
          ]),
          t("article", Je, [
            s[62] || (s[62] = pt('<div class="stat-head" data-v-a7858fe0><span class="icon-badge tone-4" aria-hidden="true" data-v-a7858fe0><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-a7858fe0><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-a7858fe0></path></svg></span><span class="stat-label" data-v-a7858fe0>已观察群聊</span></div>', 1)),
            t("strong", ze, a(Yt.value.length), 1),
            s[63] || (s[63] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", He, [
          t("span", Qe, "精力 " + a(Math.round(d.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: h(["state-pill", { warn: (d.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + a(Math.round(d.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: h(["state-pill", { warn: (d.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + a(Math.round(d.value.circadian?.health ?? 100)), 3),
          d.value.circadian?.is_sleeping ? (n(), o("span", Ke, "睡眠中")) : u("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: Wt
          }, "吃饭")
        ]),
        t("section", Re, [
          s[74] || (s[74] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", We, [
            t("article", Xe, [
              t("div", { class: "card-head" }, [
                s[64] || (s[64] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Xt
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: x(Bt, ["prevent"])
              }, [
                p(t("input", {
                  "onUpdate:modelValue": s[0] || (s[0] = (e) => H.value = e),
                  class: "input",
                  placeholder: "日程标题",
                  "aria-label": "日程标题"
                }, null, 512), [
                  [_, H.value]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[1] || (s[1] = (e) => X.value = e),
                  class: "input",
                  placeholder: "时间，例如 2026-09-25 20:00",
                  "aria-label": "时间"
                }, null, 512), [
                  [_, X.value]
                ]),
                s[65] || (s[65] = t("button", {
                  class: "btn btn-primary",
                  type: "submit"
                }, "创建候选", -1)),
                p(t("textarea", {
                  "onUpdate:modelValue": s[2] || (s[2] = (e) => Z.value = e),
                  class: "input area",
                  placeholder: "说明（可选）"
                }, null, 512), [
                  [_, Z.value]
                ])
              ], 32),
              s[66] || (s[66] = t("h3", { class: "section-label" }, "待确认候选", -1)),
              t("ul", Ze, [
                (n(!0), o(v, null, m(d.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ts, [
                    t("strong", null, a(e.title), 1),
                    t("span", es, a(e.when_text) + " · " + a(e.detail || "等待你确认"), 1)
                  ]),
                  t("div", ss, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (i) => r("confirm_agenda", { id: e.id })
                    }, "确认", 8, as),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => r("reject_agenda", { id: e.id })
                    }, "拒绝", 8, ls)
                  ])
                ]))), 128)),
                d.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? u("", !0) : (n(), o("li", ns, "没有待确认的日程候选"))
              ]),
              s[67] || (s[67] = t("h3", { class: "section-label" }, [
                y("今天的日程 "),
                t("small", { class: "hint-inline" }, "LIFE 按时间自动推进")
              ], -1)),
              t("ul", os, [
                (n(!0), o(v, null, m(ht.value, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", is, [
                    t("div", ds, [
                      t("strong", {
                        class: h({ done: e.status === "completed" })
                      }, a(e.title), 3),
                      t("span", {
                        class: h(["chip", Mt(e).cls])
                      }, a(Mt(e).label), 3)
                    ]),
                    t("span", us, [
                      y(a(e.start_at), 1),
                      e.detail ? (n(), o(v, { key: 0 }, [
                        y(" · " + a(e.detail), 1)
                      ], 64)) : u("", !0)
                    ])
                  ])
                ]))), 128)),
                ht.value.length ? u("", !0) : (n(), o("li", rs, "今天还没有安排，点右上角让 LIFE 安排。"))
              ])
            ]),
            t("article", cs, [
              t("div", ps, [
                s[68] || (s[68] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", vs, a((d.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(Kt, ["prevent"])
              }, [
                p(t("input", {
                  "onUpdate:modelValue": s[3] || (s[3] = (e) => f.value.title = e),
                  class: "input",
                  placeholder: "名称，如 生日 / 纪念日",
                  "aria-label": "重要日期名称"
                }, null, 512), [
                  [_, f.value.title]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[4] || (s[4] = (e) => f.value.date = e),
                  class: "input",
                  placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                  "aria-label": "重要日期"
                }, null, 512), [
                  [_, f.value.date]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[5] || (s[5] = (e) => f.value.note = e),
                  class: "input",
                  placeholder: "备注（可选）",
                  "aria-label": "备注"
                }, null, 512), [
                  [_, f.value.note]
                ]),
                t("label", _s, [
                  p(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[6] || (s[6] = (e) => f.value.repeat_yearly = e)
                  }, null, 512), [
                    [Se, f.value.repeat_yearly]
                  ]),
                  s[69] || (s[69] = y(" 每年重复", -1))
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !f.value.title.trim() || !f.value.date.trim()
                }, "添加", 8, ms)
              ], 32),
              t("ul", bs, [
                (n(!0), o(v, null, m(d.value.important_dates, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", hs, [
                    t("strong", null, a(e.title), 1),
                    t("span", gs, [
                      y(a(e.date_text), 1),
                      yt(e.date_text) !== null ? (n(), o(v, { key: 0 }, [
                        y(" · " + a(yt(e.date_text) === 0 ? "就是今天" : yt(e.date_text) + " 天后"), 1)
                      ], 64)) : u("", !0),
                      e.note ? (n(), o(v, { key: 1 }, [
                        y(" · " + a(e.note), 1)
                      ], 64)) : u("", !0)
                    ])
                  ]),
                  t("div", ys, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => Rt(e.id)
                    }, "删除", 8, ks)
                  ])
                ]))), 128)),
                d.value.important_dates?.length ? u("", !0) : (n(), o("li", fs, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", ws, [
              t("div", Cs, [
                s[70] || (s[70] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", xs, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[7] || (s[7] = (e) => Lt("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: J.value === "journal",
                    onClick: s[8] || (s[8] = (e) => Dt("journal"))
                  }, a(J.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, $s)
                ])
              ]),
              t("div", Ss, [
                t("div", Us, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !F.value.previous || K.value,
                    onClick: s[9] || (s[9] = (e) => Ut("previous"))
                  }, "← 前一页", 8, Vs),
                  p(t("input", {
                    "onUpdate:modelValue": s[10] || (s[10] = (e) => Q.value = e),
                    class: "input book-date",
                    type: "date",
                    "aria-label": "日记日期",
                    onChange: s[11] || (s[11] = (e) => mt(Q.value))
                  }, null, 544), [
                    [_, Q.value]
                  ]),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !F.value.next || K.value,
                    onClick: s[12] || (s[12] = (e) => Ut("next"))
                  }, "后一页 →", 8, js)
                ]),
                t("div", Ms, [
                  t("p", Fs, a(F.value.date), 1),
                  St.value.length ? (n(), o("div", Ns, [
                    (n(!0), o(v, null, m(St.value, (e, i) => (n(), o("p", { key: i }, a(e), 1))), 128))
                  ])) : (n(), o("p", Ds, a(K.value ? "翻页中…" : "这一天还没有写下什么。"), 1))
                ])
              ]),
              t("form", {
                class: "stack-form diary-manual",
                onSubmit: s[14] || (s[14] = x((e) => jt("journal", tt.value), ["prevent"]))
              }, [
                p(t("textarea", {
                  "onUpdate:modelValue": s[13] || (s[13] = (e) => tt.value = e),
                  class: "input area",
                  placeholder: "为今天写下一点…"
                }, null, 512), [
                  [_, tt.value]
                ]),
                s[71] || (s[71] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "写入今天", -1))
              ], 32)
            ]),
            t("article", Ls, [
              t("div", Es, [
                s[72] || (s[72] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", Ts, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[15] || (s[15] = (e) => Lt("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: J.value === "dream",
                    onClick: s[16] || (s[16] = (e) => Dt("dream"))
                  }, a(J.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, Is)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: s[18] || (s[18] = x((e) => jt("dream", et.value), ["prevent"]))
              }, [
                p(t("textarea", {
                  "onUpdate:modelValue": s[17] || (s[17] = (e) => et.value = e),
                  class: "input area",
                  placeholder: "记录一个梦境或睡眠反思…"
                }, null, 512), [
                  [_, et.value]
                ]),
                s[73] || (s[73] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "记录梦境", -1))
              ], 32),
              t("ol", Ps, [
                (n(!0), o(v, null, m(d.value.dreams, (e) => (n(), o("li", {
                  key: e.id
                }, [
                  t("time", null, a(e.at), 1),
                  t("p", null, a(e.content), 1)
                ]))), 128)),
                d.value.dreams?.length ? u("", !0) : (n(), o("li", Os, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", qs, [
          s[79] || (s[79] = t("h2", { class: "group-title" }, "生活日历", -1)),
          t("div", Ys, [
            t("article", As, [
              t("div", Bs, [
                s[75] || (s[75] = t("h2", { class: "card-title" }, "生活日历", -1)),
                t("div", Gs, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[19] || (s[19] = (e) => Tt(-1))
                  }, "←"),
                  t("strong", Js, a(R.value), 1),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[20] || (s[20] = (e) => Tt(1))
                  }, "→")
                ])
              ]),
              t("div", zs, [
                (n(), o(v, null, m(["日", "一", "二", "三", "四", "五", "六"], (e) => t("span", { key: e }, a(e), 1)), 64))
              ]),
              t("div", Hs, [
                (n(!0), o(v, null, m(ae.value, (e) => (n(), o("div", {
                  key: e.key,
                  class: h(["cal-cell", { empty: e.empty, today: e.today, has: e.events?.length }])
                }, [
                  e.empty ? u("", !0) : (n(), o("span", Qs, a(e.day), 1)),
                  (n(!0), o(v, null, m((e.events || []).slice(0, 2), (i) => (n(), o("span", {
                    key: i.id,
                    class: "cal-chip",
                    title: i.title
                  }, a(i.title), 9, Ks))), 128)),
                  (e.events || []).length > 2 ? (n(), o("span", Rs, "+" + a(e.events.length - 2), 1)) : u("", !0)
                ], 2))), 128))
              ]),
              L.value.conflicts?.length ? (n(), o("p", Ws, "⚠ " + a(L.value.conflicts.length) + " 处时间冲突：" + a(L.value.conflicts.map((e) => e.titles.join(" / ")).join("；")), 1)) : u("", !0),
              t("h3", Xs, "本月待确认候选 (" + a(L.value.candidates?.length || 0) + ")", 1),
              t("ul", Zs, [
                (n(!0), o(v, null, m((L.value.candidates || []).slice(0, 6), (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ta, [
                    t("strong", null, a(e.title), 1),
                    t("span", ea, a(e.when_text), 1)
                  ]),
                  t("div", sa, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (i) => r("confirm_agenda", { id: e.id }).then(it)
                    }, "确认", 8, aa),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => r("reject_agenda", { id: e.id }).then(it)
                    }, "拒绝", 8, la)
                  ])
                ]))), 128)),
                (L.value.candidates || []).length ? u("", !0) : (n(), o("li", na, "没有待确认候选"))
              ])
            ]),
            t("article", oa, [
              t("div", ia, [
                s[76] || (s[76] = t("h2", { class: "card-title" }, "个人目标", -1)),
                t("span", da, a((d.value.goals || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(le, ["prevent"])
              }, [
                p(t("input", {
                  "onUpdate:modelValue": s[21] || (s[21] = (e) => E.value.title = e),
                  class: "input",
                  placeholder: "目标，如 学会一首钢琴曲",
                  "aria-label": "目标标题"
                }, null, 512), [
                  [_, E.value.title]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[22] || (s[22] = (e) => E.value.detail = e),
                  class: "input",
                  placeholder: "说明（可选）",
                  "aria-label": "目标说明"
                }, null, 512), [
                  [_, E.value.detail]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !E.value.title.trim()
                }, "添加目标", 8, ua)
              ], 32),
              t("ul", ra, [
                (n(!0), o(v, null, m(d.value.goals, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ca, [
                    t("div", pa, [
                      t("strong", {
                        class: h({ done: e.status === "done" })
                      }, a(e.title), 3),
                      t("span", {
                        class: h(["chip", e.status === "done" ? "chip-ok" : "muted"])
                      }, a(e.status === "done" ? "已完成" : "进行中"), 3)
                    ]),
                    t("div", va, [
                      t("i", {
                        style: vt({ width: gt(e.progress) })
                      }, null, 4)
                    ]),
                    e.detail ? (n(), o("span", _a, a(e.detail), 1)) : u("", !0)
                  ]),
                  t("div", ma, [
                    e.status !== "done" ? (n(), o("button", {
                      key: 0,
                      class: "btn btn-tonal btn-sm",
                      onClick: (i) => ne(e.id)
                    }, "完成", 8, ba)) : u("", !0),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => oe(e.id)
                    }, "删除", 8, ha)
                  ])
                ]))), 128)),
                (d.value.goals || []).length ? u("", !0) : (n(), o("li", ga, "还没有个人目标"))
              ])
            ]),
            t("article", ya, [
              t("div", ka, [
                s[77] || (s[77] = t("h2", { class: "card-title" }, "食物菜单", -1)),
                t("span", fa, a((d.value.food || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(ie, ["prevent"])
              }, [
                p(t("input", {
                  "onUpdate:modelValue": s[23] || (s[23] = (e) => T.value.name = e),
                  class: "input",
                  placeholder: "食物，如 番茄牛腩",
                  "aria-label": "食物名称"
                }, null, 512), [
                  [_, T.value.name]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[24] || (s[24] = (e) => T.value.tags = e),
                  class: "input",
                  placeholder: "标签，如 家常 / 甜（可选）",
                  "aria-label": "食物标签"
                }, null, 512), [
                  [_, T.value.tags]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !T.value.name.trim()
                }, "加入菜单", 8, wa)
              ], 32),
              t("ul", Ca, [
                (n(!0), o(v, null, m(d.value.food, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", xa, [
                    t("strong", null, a(e.name), 1),
                    t("span", $a, a(e.tags || "—"), 1)
                  ]),
                  t("div", Sa, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => de(e.id)
                    }, "删除", 8, Ua)
                  ])
                ]))), 128)),
                (d.value.food || []).length ? u("", !0) : (n(), o("li", Va, "菜单还是空的"))
              ])
            ]),
            t("article", ja, [
              t("div", Ma, [
                s[78] || (s[78] = t("h2", { class: "card-title" }, "群聊黑话词云", -1)),
                t("span", Fa, a(wt.value.length), 1)
              ]),
              t("div", Na, [
                (n(!0), o(v, null, m(wt.value, (e) => (n(), o("span", {
                  key: e.topic,
                  class: "cloud-word",
                  style: vt({ fontSize: 12 + Math.min(18, Math.log(e.score + 1) * 6) + "px", opacity: 0.55 + Math.min(0.45, e.score / 20) })
                }, a(e.topic), 5))), 128)),
                wt.value.length ? u("", !0) : (n(), o("span", Da, "还没有群聊词云数据"))
              ])
            ])
          ])
        ]),
        t("section", La, [
          s[93] || (s[93] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", Ea, [
            t("article", Ta, [
              t("div", Ia, [
                t("h2", Pa, a(q.value ? "用户详情" : "用户"), 1),
                q.value ? (n(), o("button", {
                  key: 0,
                  class: "btn btn-tonal btn-sm",
                  onClick: ee
                }, "← 返回用户列表")) : (n(), o("span", Oa, a(ft.value.length) + " / " + a(d.value.relationships?.length || 0), 1))
              ]),
              q.value ? kt.value ? (n(), o("div", Xa, "加载中…")) : b.value ? (n(), o(v, { key: 2 }, [
                t("div", Za, [
                  t("span", tl, a((b.value.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", el, [
                    t("strong", null, a(b.value.user_id), 1),
                    t("span", sl, "阶段 " + a(b.value.relationship?.stage || "未知") + " · 好感 " + a(Math.round((b.value.relationship?.affinity || 0) * 100)) + "% · 最近 " + a(b.value.relationship?.last_seen || "—"), 1)
                  ])
                ]),
                t("nav", al, [
                  (n(), o(v, null, m(Zt, (e) => t("button", {
                    key: e.key,
                    class: h(["tab", { active: Y.value === e.key }]),
                    onClick: (i) => Y.value = e.key
                  }, a(e.label), 11, ll)), 64))
                ]),
                Y.value === "overview" ? (n(), o("div", nl, [
                  t("div", ol, [
                    t("div", il, [
                      s[82] || (s[82] = t("span", null, "关系事件", -1)),
                      t("strong", null, a(b.value.counts?.ledger || 0), 1)
                    ]),
                    t("div", dl, [
                      s[83] || (s[83] = t("span", null, "主动候选", -1)),
                      t("strong", null, a(b.value.counts?.candidates || 0), 1)
                    ]),
                    t("div", ul, [
                      s[84] || (s[84] = t("span", null, "已投递", -1)),
                      t("strong", null, a(b.value.counts?.delivered || 0), 1)
                    ]),
                    t("div", rl, [
                      s[85] || (s[85] = t("span", null, "记忆条数", -1)),
                      t("strong", null, a(b.value.memories?.total || 0), 1)
                    ]),
                    t("div", cl, [
                      s[86] || (s[86] = t("span", null, "阶段主动上限", -1)),
                      t("strong", null, a(b.value.stage_limit ?? "不限"), 1)
                    ])
                  ]),
                  s[87] || (s[87] = t("h3", { class: "section-label" }, "最近关系事件", -1)),
                  t("ol", pl, [
                    (n(!0), o(v, null, m((b.value.ledger || []).slice(0, 5), (e) => (n(), o("li", {
                      key: e.id
                    }, [
                      t("time", null, a(D(e.created_at)), 1),
                      t("p", null, [
                        y(a(e.event_key) + " ", 1),
                        t("span", {
                          class: h(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        y(" · " + a(e.reason), 1)
                      ])
                    ]))), 128)),
                    (b.value.ledger || []).length ? u("", !0) : (n(), o("li", vl, "暂无关系事件"))
                  ])
                ])) : Y.value === "relationship" ? (n(), o("div", _l, [
                  t("div", ml, [
                    t("div", bl, [
                      t("i", {
                        style: vt({ width: gt(b.value.relationship?.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, a(Math.round((b.value.relationship?.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("div", hl, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[27] || (s[27] = (e) => Ft(b.value.user_id, 0.05))
                    }, "更亲近 +"),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[28] || (s[28] = (e) => Ft(b.value.user_id, -0.05))
                    }, "更疏远 −")
                  ]),
                  s[89] || (s[89] = t("h3", { class: "section-label" }, "事件账本", -1)),
                  t("ol", gl, [
                    (n(!0), o(v, null, m(b.value.ledger, (e) => (n(), o("li", {
                      key: e.id
                    }, [
                      t("time", null, a(D(e.created_at)), 1),
                      t("p", null, [
                        t("strong", null, a(e.event_key), 1),
                        s[88] || (s[88] = y()),
                        t("span", {
                          class: h(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        y(" · " + a(e.reason) + " (" + a(e.channel) + ")", 1)
                      ])
                    ]))), 128)),
                    (b.value.ledger || []).length ? u("", !0) : (n(), o("li", yl, "暂无关系事件"))
                  ])
                ])) : Y.value === "proactive" ? (n(), o("div", kl, [
                  s[90] || (s[90] = t("h3", { class: "section-label" }, "候选队列", -1)),
                  t("ul", fl, [
                    (n(!0), o(v, null, m(b.value.proactive?.candidates || [], (e) => (n(), o("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", wl, [
                        t("strong", null, a(e.motive), 1),
                        t("span", Cl, a(e.content), 1),
                        t("span", xl, a(e.status) + " · " + a(D(e.updated_at)), 1)
                      ]),
                      t("div", $l, [
                        ["delivered", "cancelled"].includes(e.status) ? u("", !0) : (n(), o("button", {
                          key: 0,
                          class: "btn btn-danger btn-sm",
                          onClick: (i) => Nt(e.id)
                        }, "取消", 8, Sl))
                      ])
                    ]))), 128)),
                    (b.value.proactive?.candidates || []).length ? u("", !0) : (n(), o("li", Ul, "暂无主动记录"))
                  ]),
                  s[91] || (s[91] = t("h3", { class: "section-label" }, "投递记录", -1)),
                  t("ol", Vl, [
                    (n(!0), o(v, null, m(b.value.proactive?.receipts || [], (e) => (n(), o("li", {
                      key: e.id
                    }, [
                      t("time", null, a(D(e.created_at)), 1),
                      t("p", null, a(e.phase) + " · " + a(e.content), 1)
                    ]))), 128)),
                    (b.value.proactive?.receipts || []).length ? u("", !0) : (n(), o("li", jl, "暂无投递"))
                  ])
                ])) : Y.value === "memory" ? (n(), o("div", Ml, [
                  t("ul", Fl, [
                    (n(!0), o(v, null, m(b.value.memories?.items || [], (e) => (n(), o("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", Nl, [
                        t("strong", Dl, a(e.content), 1),
                        t("span", Ll, "scope " + a(e.scope) + " · 重要度 " + a(Math.round((e.importance || 0) * 100)) + "% · 召回 " + a(e.recall_count) + " 次", 1)
                      ]),
                      t("div", El, [
                        t("button", {
                          class: "btn btn-danger btn-sm",
                          onClick: (i) => se(e.id)
                        }, "删除", 8, Tl)
                      ])
                    ]))), 128)),
                    (b.value.memories?.items || []).length ? u("", !0) : (n(), o("li", Il, "没有与该用户相关的记忆"))
                  ])
                ])) : (n(), o("div", Pl, [
                  t("ol", Ol, [
                    (n(!0), o(v, null, m(b.value.audit || [], (e) => (n(), o("li", {
                      key: e.id
                    }, [
                      t("span", {
                        class: h(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                        "aria-hidden": "true"
                      }, null, 2),
                      t("div", ql, [
                        t("div", Yl, [
                          t("strong", null, a(e.kind), 1),
                          t("span", {
                            class: h(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                          }, a(e.outcome), 3),
                          t("time", null, a(D(e.created_at)), 1)
                        ]),
                        t("p", Al, a(e.target), 1),
                        t("p", Bl, a(e.detail), 1)
                      ])
                    ]))), 128)),
                    (b.value.audit || []).length ? u("", !0) : (n(), o("li", Gl, "暂无诊断记录"))
                  ])
                ]))
              ], 64)) : u("", !0) : (n(), o(v, { key: 0 }, [
                t("div", qa, [
                  p(t("input", {
                    "onUpdate:modelValue": s[25] || (s[25] = (e) => nt.value = e),
                    class: "input",
                    placeholder: "搜索用户 ID",
                    "aria-label": "搜索用户"
                  }, null, 512), [
                    [_, nt.value]
                  ]),
                  p(t("select", {
                    "onUpdate:modelValue": s[26] || (s[26] = (e) => ot.value = e),
                    class: "input user-stage",
                    "aria-label": "按阶段筛选"
                  }, [
                    s[80] || (s[80] = t("option", { value: "" }, "全部阶段", -1)),
                    (n(!0), o(v, null, m(te.value, (e) => (n(), o("option", {
                      key: e,
                      value: e
                    }, a(e), 9, Ya))), 128))
                  ], 512), [
                    [Ot, ot.value]
                  ])
                ]),
                t("ul", Aa, [
                  (n(!0), o(v, null, m(ft.value, (e) => (n(), o("li", {
                    key: e.user_id,
                    class: "rel",
                    onClick: (i) => Et(e.user_id)
                  }, [
                    t("span", Ga, a((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                    t("div", Ja, [
                      t("div", za, [
                        t("strong", null, a(e.user_id), 1),
                        t("span", Ha, a(e.stage), 1)
                      ]),
                      t("div", Qa, [
                        t("div", Ka, [
                          t("i", {
                            style: vt({ width: gt(e.affinity) })
                          }, null, 4)
                        ]),
                        t("b", null, a(Math.round((e.affinity || 0) * 100)) + "%", 1)
                      ]),
                      t("span", Ra, "最近互动：" + a(e.last_seen || "暂无"), 1)
                    ]),
                    s[81] || (s[81] = t("span", {
                      class: "rel-chevron",
                      "aria-hidden": "true"
                    }, "›", -1))
                  ], 8, Ba))), 128)),
                  ft.value.length ? u("", !0) : (n(), o("li", Wa, "没有匹配的用户"))
                ])
              ], 64))
            ]),
            t("article", Jl, [
              s[92] || (s[92] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", zl, [
                (n(!0), o(v, null, m(d.value.persona_evolution, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item trait-item"
                }, [
                  t("div", Hl, [
                    t("strong", null, a(e.trait), 1),
                    t("span", Ql, "支持 " + a(e.support_count) + " 次 · 置信度 " + a(Math.round((e.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", Kl, a(e.value), 1)
                ]))), 128)),
                d.value.persona_evolution?.length ? u("", !0) : (n(), o("li", Rl, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", Wl, [
          s[98] || (s[98] = t("h2", { class: "group-title" }, "学习", -1)),
          t("div", Xl, [
            t("article", Zl, [
              t("div", tn, [
                s[94] || (s[94] = t("h2", { class: "card-title" }, "技能学习", -1)),
                t("span", en, a((d.value.skills || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(he, ["prevent"])
              }, [
                p(t("input", {
                  "onUpdate:modelValue": s[29] || (s[29] = (e) => C.value.name = e),
                  class: "input",
                  placeholder: "技能，如 弹钢琴",
                  "aria-label": "技能名称"
                }, null, 512), [
                  [_, C.value.name]
                ]),
                t("div", sn, [
                  p(t("input", {
                    "onUpdate:modelValue": s[30] || (s[30] = (e) => C.value.category = e),
                    class: "input",
                    placeholder: "分类",
                    "aria-label": "分类"
                  }, null, 512), [
                    [_, C.value.category]
                  ]),
                  p(t("input", {
                    "onUpdate:modelValue": s[31] || (s[31] = (e) => C.value.level = e),
                    class: "input tiny",
                    type: "number",
                    min: "1",
                    max: "10",
                    "aria-label": "等级"
                  }, null, 512), [
                    [
                      _,
                      C.value.level,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[32] || (s[32] = (e) => C.value.keywords = e),
                  class: "input",
                  placeholder: "关键词（逗号分隔，可选）",
                  "aria-label": "关键词"
                }, null, 512), [
                  [_, C.value.keywords]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !C.value.name.trim()
                }, "添加技能", 8, an)
              ], 32),
              t("ul", ln, [
                (n(!0), o(v, null, m(d.value.skills, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", nn, [
                    t("div", on, [
                      t("strong", null, a(e.name), 1),
                      t("span", dn, "Lv." + a(e.level), 1),
                      t("span", un, a(e.category), 1)
                    ]),
                    e.keywords ? (n(), o("span", rn, a(e.keywords), 1)) : u("", !0)
                  ]),
                  t("div", cn, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => ge(e.id)
                    }, "删除", 8, pn)
                  ])
                ]))), 128)),
                (d.value.skills || []).length ? u("", !0) : (n(), o("li", vn, "还没有技能"))
              ])
            ]),
            t("article", _n, [
              t("div", mn, [
                s[95] || (s[95] = t("h2", { class: "card-title" }, "表达学习", -1)),
                t("span", bn, "待审 " + a(ct.value.pending), 1)
              ]),
              t("div", hn, [
                t("button", {
                  class: h(["btn btn-sm", A.value === "pending" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[33] || (s[33] = (e) => A.value = "pending")
                }, "待审 " + a(ct.value.pending), 3),
                t("button", {
                  class: h(["btn btn-sm", A.value === "approved" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[34] || (s[34] = (e) => A.value = "approved")
                }, "已用 " + a(ct.value.approved), 3),
                t("button", {
                  class: h(["btn btn-sm", A.value === "rejected" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[35] || (s[35] = (e) => A.value = "rejected")
                }, "已拒 " + a(ct.value.rejected), 3)
              ]),
              t("form", {
                class: "slang-form",
                onSubmit: x(ye, ["prevent"])
              }, [
                p(t("input", {
                  "onUpdate:modelValue": s[36] || (s[36] = (e) => I.value.text = e),
                  class: "input",
                  placeholder: "表达，如 晚安呀",
                  "aria-label": "表达内容"
                }, null, 512), [
                  [_, I.value.text]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[37] || (s[37] = (e) => I.value.scene = e),
                  class: "input scene-input",
                  placeholder: "场景",
                  "aria-label": "场景"
                }, null, 512), [
                  [_, I.value.scene]
                ]),
                t("button", {
                  class: "btn btn-primary btn-sm",
                  type: "submit",
                  disabled: !I.value.text.trim()
                }, "入库", 8, gn)
              ], 32),
              t("ul", yn, [
                (n(!0), o(v, null, m(It.value, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", kn, [
                    t("strong", null, a(e.text), 1),
                    t("span", fn, a(e.scene || "通用") + " · " + a(e.source), 1)
                  ]),
                  t("div", wn, [
                    e.status === "pending" ? (n(), o("button", {
                      key: 0,
                      class: "btn btn-primary btn-sm",
                      onClick: (i) => Pt(e.id, !0)
                    }, "采用", 8, Cn)) : u("", !0),
                    e.status === "pending" ? (n(), o("button", {
                      key: 1,
                      class: "btn btn-tonal btn-sm",
                      onClick: (i) => Pt(e.id, !1)
                    }, "拒绝", 8, xn)) : u("", !0),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => ke(e.id)
                    }, "删除", 8, $n)
                  ])
                ]))), 128)),
                It.value.length ? u("", !0) : (n(), o("li", Sn, "该分类下没有表达"))
              ])
            ]),
            t("article", Un, [
              t("div", Vn, [
                s[96] || (s[96] = t("h2", { class: "card-title" }, "社交关系网", -1)),
                t("span", jn, a((d.value.social_nodes || []).length) + " 人 · " + a((d.value.social_edges || []).length) + " 关系", 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(fe, ["prevent"])
              }, [
                p(t("input", {
                  "onUpdate:modelValue": s[38] || (s[38] = (e) => j.value.user_id = e),
                  class: "input",
                  placeholder: "用户 ID",
                  "aria-label": "用户 ID"
                }, null, 512), [
                  [_, j.value.user_id]
                ]),
                t("div", Mn, [
                  p(t("input", {
                    "onUpdate:modelValue": s[39] || (s[39] = (e) => j.value.name = e),
                    class: "input",
                    placeholder: "称呼（可选）",
                    "aria-label": "称呼"
                  }, null, 512), [
                    [_, j.value.name]
                  ]),
                  p(t("input", {
                    "onUpdate:modelValue": s[40] || (s[40] = (e) => j.value.tags = e),
                    class: "input",
                    placeholder: "标签（可选）",
                    "aria-label": "标签"
                  }, null, 512), [
                    [_, j.value.tags]
                  ])
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !j.value.user_id.trim()
                }, "加入关系网", 8, Fn)
              ], 32),
              t("ul", Nn, [
                (n(!0), o(v, null, m(d.value.social_nodes, (e) => (n(), o("li", {
                  key: e.user_id,
                  class: "item"
                }, [
                  t("div", Dn, [
                    t("strong", null, a(e.name || e.user_id), 1),
                    t("span", Ln, [
                      y(a(e.user_id), 1),
                      e.tags ? (n(), o(v, { key: 0 }, [
                        y(" · " + a(e.tags), 1)
                      ], 64)) : u("", !0)
                    ])
                  ])
                ]))), 128)),
                (d.value.social_nodes || []).length ? u("", !0) : (n(), o("li", En, "关系网还是空的"))
              ]),
              s[97] || (s[97] = t("h3", { class: "section-label" }, "关系连线", -1)),
              t("form", {
                class: "form-row",
                onSubmit: x(we, ["prevent"])
              }, [
                p(t("input", {
                  "onUpdate:modelValue": s[41] || (s[41] = (e) => $.value.source_id = e),
                  class: "input",
                  placeholder: "A",
                  "aria-label": "关系起点"
                }, null, 512), [
                  [_, $.value.source_id]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[42] || (s[42] = (e) => $.value.target_id = e),
                  class: "input",
                  placeholder: "B",
                  "aria-label": "关系终点"
                }, null, 512), [
                  [_, $.value.target_id]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[43] || (s[43] = (e) => $.value.relation = e),
                  class: "input",
                  placeholder: "关系，如 同学",
                  "aria-label": "关系"
                }, null, 512), [
                  [_, $.value.relation]
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  type: "submit",
                  disabled: !$.value.source_id.trim() || !$.value.target_id.trim()
                }, "连线", 8, Tn)
              ], 32),
              t("ul", In, [
                (n(!0), o(v, null, m(d.value.social_edges, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Pn, [
                    t("strong", null, a(e.source_id) + " → " + a(e.target_id), 1),
                    t("span", On, a(e.relation), 1)
                  ]),
                  t("div", qn, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => Ce(e.id)
                    }, "删除", 8, Yn)
                  ])
                ]))), 128)),
                (d.value.social_edges || []).length ? u("", !0) : (n(), o("li", An, "还没有关系连线"))
              ])
            ])
          ])
        ]),
        t("section", Bn, [
          s[108] || (s[108] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", Gn, [
            t("article", Jn, [
              t("div", zn, [
                s[99] || (s[99] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", Hn, "待投递 " + a(st.value.length), 1)
              ]),
              t("div", Qn, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: zt
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: at.value,
                  onClick: Ht
                }, a(at.value ? "检查中…" : "立即检查投递"), 9, Kn)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(Gt, ["prevent"])
              }, [
                p(t("input", {
                  "onUpdate:modelValue": s[44] || (s[44] = (e) => g.value.target = e),
                  class: "input",
                  placeholder: "目标：session:<会话ID> / user:<QQ> / group:<群号>",
                  "aria-label": "主动对象"
                }, null, 512), [
                  [_, g.value.target]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[45] || (s[45] = (e) => g.value.motive = e),
                  class: "input",
                  placeholder: "动机，如 care / reminder",
                  "aria-label": "动机"
                }, null, 512), [
                  [_, g.value.motive]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[46] || (s[46] = (e) => g.value.preferred_at = e),
                  class: "input",
                  placeholder: "期望时间（可选，ISO）",
                  "aria-label": "期望时间"
                }, null, 512), [
                  [_, g.value.preferred_at]
                ]),
                p(t("textarea", {
                  "onUpdate:modelValue": s[47] || (s[47] = (e) => g.value.content = e),
                  class: "input area",
                  placeholder: "想说的内容…"
                }, null, 512), [
                  [_, g.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !g.value.target.trim() || !g.value.content.trim()
                }, "创建候选", 8, Rn)
              ], 32),
              s[104] || (s[104] = t("h3", { class: "section-label" }, "候选队列", -1)),
              t("ul", Wn, [
                (n(!0), o(v, null, m(st.value, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Xn, [
                    t("strong", null, a(e.target) + " · " + a(e.motive), 1),
                    t("span", Zn, a(e.content), 1),
                    t("span", to, "状态 " + a(e.status) + " · " + a(D(e.created_at)), 1)
                  ]),
                  t("div", eo, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => Nt(e.id)
                    }, "取消", 8, so)
                  ])
                ]))), 128)),
                st.value.length ? u("", !0) : (n(), o("li", ao, "没有待投递候选"))
              ]),
              s[105] || (s[105] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", lo, [
                t("label", no, [
                  s[100] || (s[100] = t("span", null, "每日上限", -1)),
                  p(t("input", {
                    "onUpdate:modelValue": s[48] || (s[48] = (e) => k.value.daily_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      k.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", oo, [
                  s[101] || (s[101] = t("span", null, "单人上限", -1)),
                  p(t("input", {
                    "onUpdate:modelValue": s[49] || (s[49] = (e) => k.value.per_target_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      k.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", io, [
                  s[102] || (s[102] = t("span", null, "免打扰起", -1)),
                  p(t("input", {
                    "onUpdate:modelValue": s[50] || (s[50] = (e) => k.value.quiet_start = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      k.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", uo, [
                  s[103] || (s[103] = t("span", null, "免打扰止", -1)),
                  p(t("input", {
                    "onUpdate:modelValue": s[51] || (s[51] = (e) => k.value.quiet_end = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      _,
                      k.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Jt
                }, "保存策略")
              ]),
              s[106] || (s[106] = t("p", { class: "helper-inline" }, [
                y("免打扰起止相同即关闭；target 用 "),
                t("code", null, "session:<会话ID>"),
                y(" 可直接发到对话。")
              ], -1)),
              s[107] || (s[107] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", ro, [
                (n(!0), o(v, null, m(bt.value, (e) => (n(), o("li", {
                  key: e.id
                }, [
                  t("time", null, a(D(e.created_at)), 1),
                  t("p", null, a(e.phase) + " · " + a(e.content), 1)
                ]))), 128)),
                bt.value.length ? u("", !0) : (n(), o("li", co, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", po, [
          s[116] || (s[116] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", vo, [
            t("article", _o, [
              t("div", mo, [
                s[109] || (s[109] = t("h2", { class: "card-title" }, "群聊管理", -1)),
                t("span", bo, a(dt.value.length), 1)
              ]),
              t("form", {
                class: "group-form",
                onSubmit: x(re, ["prevent"])
              }, [
                p(t("input", {
                  "onUpdate:modelValue": s[52] || (s[52] = (e) => V.value.group_id = e),
                  class: "input",
                  placeholder: "群号",
                  "aria-label": "群号"
                }, null, 512), [
                  [_, V.value.group_id]
                ]),
                p(t("select", {
                  "onUpdate:modelValue": s[53] || (s[53] = (e) => V.value.policy = e),
                  class: "input policy-select",
                  "aria-label": "策略"
                }, [...s[110] || (s[110] = [
                  t("option", { value: "observe" }, "观察", -1),
                  t("option", { value: "whitelist" }, "白名单", -1),
                  t("option", { value: "blacklist" }, "黑名单", -1)
                ])], 512), [
                  [Ot, V.value.policy]
                ]),
                p(t("input", {
                  "onUpdate:modelValue": s[54] || (s[54] = (e) => V.value.alias = e),
                  class: "input",
                  placeholder: "备注名（可选）",
                  "aria-label": "备注名"
                }, null, 512), [
                  [_, V.value.alias]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !V.value.group_id.trim()
                }, "添加群", 8, ho)
              ], 32),
              t("ul", go, [
                (n(!0), o(v, null, m(dt.value, (e) => (n(), o("li", {
                  key: e.group_id,
                  class: "item group-item"
                }, [
                  t("div", yo, [
                    t("div", ko, [
                      t("strong", null, a(e.group_id), 1),
                      e.alias ? (n(), o("span", fo, a(e.alias), 1)) : u("", !0),
                      t("span", {
                        class: h(["chip", e.policy === "blacklist" ? "chip-warn" : e.policy === "whitelist" ? "chip-ok" : "muted"])
                      }, a(e.policy), 3)
                    ]),
                    t("span", wo, a(e.observations) + " 条观察 · " + a(e.topics) + " 个话题", 1),
                    O.value === e.group_id ? (n(), o("div", Co, [
                      s[113] || (s[113] = t("h4", { class: "section-label" }, "黑话 / 话题", -1)),
                      t("div", xo, [
                        (n(!0), o(v, null, m(Ct.value[e.group_id] || [], (i) => (n(), o("span", {
                          key: i.topic,
                          class: "chip muted"
                        }, [
                          y(a(i.topic) + " · " + a(Math.round(i.score)), 1),
                          t("button", {
                            class: "chip-x",
                            onClick: (B) => be(e.group_id, i.topic)
                          }, "×", 8, $o)
                        ]))), 128)),
                        (Ct.value[e.group_id] || []).length ? u("", !0) : (n(), o("span", So, "暂无"))
                      ]),
                      t("form", {
                        class: "slang-form",
                        onSubmit: x((i) => me(e.group_id), ["prevent"])
                      }, [
                        p(t("input", {
                          "onUpdate:modelValue": (i) => ut.value[e.group_id] = i,
                          class: "input",
                          placeholder: "新增黑话 / 话题",
                          "aria-label": "新增黑话"
                        }, null, 8, Vo), [
                          [_, ut.value[e.group_id]]
                        ]),
                        s[111] || (s[111] = t("button", {
                          class: "btn btn-tonal btn-sm",
                          type: "submit"
                        }, "添加", -1))
                      ], 40, Uo),
                      s[114] || (s[114] = t("h4", { class: "section-label" }, "成员安全", -1)),
                      t("ul", jo, [
                        (n(!0), o(v, null, m(xt.value[e.group_id] || [], (i) => (n(), o("li", {
                          key: i.user_id,
                          class: "member-row"
                        }, [
                          t("span", Mo, a(i.user_id), 1),
                          t("span", Fo, a(i.messages) + " 条 · " + a(D(i.last_at)), 1),
                          t("select", {
                            class: "input flag-select",
                            value: i.flag,
                            onChange: (B) => ve(e.group_id, i.user_id, B)
                          }, [...s[112] || (s[112] = [
                            t("option", { value: "watch" }, "关注", -1),
                            t("option", { value: "allow" }, "放行", -1),
                            t("option", { value: "mute" }, "禁言", -1)
                          ])], 40, No)
                        ]))), 128)),
                        (xt.value[e.group_id] || []).length ? u("", !0) : (n(), o("li", Do, "暂无成员观察"))
                      ])
                    ])) : u("", !0)
                  ]),
                  t("div", Lo, [
                    t("select", {
                      class: "input policy-select",
                      value: e.policy,
                      onChange: (i) => pe(e, i)
                    }, [...s[115] || (s[115] = [
                      t("option", { value: "observe" }, "观察", -1),
                      t("option", { value: "whitelist" }, "白名单", -1),
                      t("option", { value: "blacklist" }, "黑名单", -1)
                    ])], 40, Eo),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (i) => _e(e.group_id)
                    }, a(O.value === e.group_id ? "收起" : "管理"), 9, To),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (i) => ce(e.group_id)
                    }, "删除", 8, Io)
                  ])
                ]))), 128)),
                dt.value.length ? u("", !0) : (n(), o("li", Po, "还没有群记录。收到群消息或在上面添加。"))
              ])
            ])
          ])
        ]),
        t("section", Oo, [
          s[122] || (s[122] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", qo, [
            t("article", Yo, [
              t("div", Ao, [
                s[117] || (s[117] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", Bo, a(N.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", Go, [
                t("div", Jo, [
                  t("strong", null, a((N.value?.total_tokens || 0).toLocaleString()), 1),
                  s[118] || (s[118] = t("span", null, "总 Token", -1))
                ]),
                t("div", zo, [
                  t("strong", null, a((N.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  s[119] || (s[119] = t("span", null, "输入", -1))
                ]),
                t("div", Ho, [
                  t("strong", null, a((N.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  s[120] || (s[120] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", Qo, [
                (n(!0), o(v, null, m(N.value?.by_model || {}, (e, i) => (n(), o("li", {
                  key: i,
                  class: "item"
                }, [
                  t("div", Ko, [
                    t("strong", null, a(i), 1),
                    t("span", Ro, a((e.total || 0).toLocaleString()) + " tokens · " + a(e.count) + " 次", 1)
                  ])
                ]))), 128)),
                !N.value || !Object.keys(N.value.by_model || {}).length ? (n(), o("li", Wo, "暂无用量记录")) : u("", !0)
              ])
            ]),
            t("article", Xo, [
              t("div", Zo, [
                s[121] || (s[121] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: s[55] || (s[55] = (e) => r("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", ti, [
                (n(!0), o(v, null, m(d.value.audit, (e) => (n(), o("li", {
                  key: e.at + e.kind
                }, [
                  t("span", {
                    class: h(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", ei, [
                    t("div", si, [
                      t("strong", null, a(e.kind), 1),
                      t("span", {
                        class: h(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, a(e.outcome), 3),
                      t("time", null, a(e.at), 1)
                    ]),
                    t("p", ai, a(e.target), 1),
                    t("p", li, a(e.detail), 1)
                  ])
                ]))), 128)),
                d.value.audit?.length ? u("", !0) : (n(), o("li", ni, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), ri = /* @__PURE__ */ Ve(oi, [["__scopeId", "data-v-a7858fe0"]]);
export {
  ri as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-a7858fe0]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-a7858fe0]{max-width:1180px;margin:0 auto}.page-header[data-v-a7858fe0]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-a7858fe0]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-a7858fe0]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-a7858fe0]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-a7858fe0]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-a7858fe0]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-a7858fe0]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-a7858fe0]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-a7858fe0]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-a7858fe0]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-a7858fe0]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-a7858fe0]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-a7858fe0]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-a7858fe0]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-a7858fe0]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-a7858fe0]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-a7858fe0]{display:flex;align-items:center;gap:10px}.stat-label[data-v-a7858fe0]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-a7858fe0]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-a7858fe0]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-a7858fe0]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-a7858fe0]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-a7858fe0]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-a7858fe0]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-a7858fe0]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-a7858fe0]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-a7858fe0]{margin-bottom:var(--space-lg)}.group-title[data-v-a7858fe0]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-a7858fe0]{margin-bottom:0}.card[data-v-a7858fe0]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-a7858fe0]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-a7858fe0]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-a7858fe0]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-a7858fe0]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-a7858fe0]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-a7858fe0]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-a7858fe0]{background:#fff1dc;color:#7a4400}.input[data-v-a7858fe0]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-a7858fe0]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-a7858fe0]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-a7858fe0]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-a7858fe0]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-a7858fe0]{grid-column:1/-1}.stack-form[data-v-a7858fe0]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-a7858fe0]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-a7858fe0]{align-self:flex-start}.item-list[data-v-a7858fe0],.rel-list[data-v-a7858fe0],.feed[data-v-a7858fe0],.timeline[data-v-a7858fe0]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-a7858fe0]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-a7858fe0]{align-items:flex-start}.item[data-v-a7858fe0]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-a7858fe0]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-a7858fe0]{font-size:14px;font-weight:600}.item-main strong.done[data-v-a7858fe0]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-a7858fe0]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-a7858fe0]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-a7858fe0]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-a7858fe0]{background:transparent;border:0}.check-label[data-v-a7858fe0]{display:flex;align-items:center}.check-line[data-v-a7858fe0]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-a7858fe0]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-a7858fe0]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-a7858fe0]{background:#fff1dc;color:#7a4400}.head-actions[data-v-a7858fe0]{display:flex;gap:8px}.item-row[data-v-a7858fe0]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hint-inline[data-v-a7858fe0]{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}.helper-inline[data-v-a7858fe0]{margin:8px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.helper-inline code[data-v-a7858fe0]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:2px 6px;border-radius:6px}.check-label input[data-v-a7858fe0]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-a7858fe0]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-a7858fe0]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-a7858fe0]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-a7858fe0]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-a7858fe0],.rel-meter[data-v-a7858fe0]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-a7858fe0]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-a7858fe0]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-a7858fe0]{font-size:12px}.rel-actions[data-v-a7858fe0]{display:flex;gap:4px}.ledger[data-v-a7858fe0]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.user-tools[data-v-a7858fe0]{display:flex;gap:10px;margin-bottom:12px}.user-stage[data-v-a7858fe0]{width:130px;flex:0 0 auto}.rel[data-v-a7858fe0]{cursor:pointer}.rel-chevron[data-v-a7858fe0]{font-size:20px;color:var(--md-on-surface-variant);flex-shrink:0}.detail-head[data-v-a7858fe0]{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}.tabs[data-v-a7858fe0]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tab[data-v-a7858fe0]{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:600 12.5px/1 inherit;cursor:pointer}.tab[data-v-a7858fe0]:hover{border-color:var(--md-primary)}.tab.active[data-v-a7858fe0]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}.detail-body[data-v-a7858fe0]{display:flex;flex-direction:column;gap:6px}.kv-grid[data-v-a7858fe0]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.kv[data-v-a7858fe0]{background:var(--md-surface-container-low);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:4px}.kv span[data-v-a7858fe0]{font-size:12px;color:var(--md-on-surface-variant)}.kv strong[data-v-a7858fe0]{font-size:20px;font-weight:700}.rel-meter.big[data-v-a7858fe0]{margin:6px 0}.rel-meter.big b[data-v-a7858fe0]{font-size:15px}.mem-text[data-v-a7858fe0]{font-weight:500!important;line-height:1.6}.cal-card[data-v-a7858fe0]{grid-column:1/-1}.cal-month[data-v-a7858fe0]{font-size:14px;font-weight:700;min-width:76px;text-align:center}.cal-week[data-v-a7858fe0]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}.cal-week span[data-v-a7858fe0]{text-align:center;font-size:11px;color:var(--md-on-surface-variant);font-weight:600}.cal-grid[data-v-a7858fe0]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-cell[data-v-a7858fe0]{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}.cal-cell.empty[data-v-a7858fe0]{border-color:transparent;background:transparent}.cal-cell.today[data-v-a7858fe0]{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 18%,transparent)}.cal-cell.has[data-v-a7858fe0]{background:var(--md-surface-container-low)}.cal-day[data-v-a7858fe0]{font-size:12px;font-weight:700;color:var(--md-on-surface-variant)}.cal-chip[data-v-a7858fe0]{font-size:10.5px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-more[data-v-a7858fe0]{font-size:10px;color:var(--md-on-surface-variant)}.cal-warn[data-v-a7858fe0]{margin:12px 0 0;padding:8px 12px;border-radius:10px;background:#fff1dc;color:#7a4400;font-size:12.5px}.cloud[data-v-a7858fe0]{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}.cloud-word[data-v-a7858fe0]{font-weight:700;color:var(--md-primary);line-height:1.2}.group-form[data-v-a7858fe0]{display:grid;grid-template-columns:1fr 120px 1fr auto;gap:10px;margin-bottom:12px}.policy-select[data-v-a7858fe0]{width:auto;height:34px;flex:0 0 auto}.flag-select[data-v-a7858fe0]{width:auto;height:30px;flex:0 0 auto;font-size:12px}.slang-form[data-v-a7858fe0]{display:flex;gap:8px;margin:8px 0}.slang-form .input[data-v-a7858fe0]{height:34px}.chip-x[data-v-a7858fe0]{border:0;background:transparent;color:inherit;cursor:pointer;font-weight:700;margin-left:4px}.member-list[data-v-a7858fe0]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.member-row[data-v-a7858fe0]{display:flex;align-items:center;gap:10px;font-size:12.5px}.member-id[data-v-a7858fe0]{font-weight:600;min-width:80px}.member-row .item-meta[data-v-a7858fe0]{flex:1}.form-row[data-v-a7858fe0]{display:flex;gap:10px}.form-row .input[data-v-a7858fe0]{flex:1}.scene-input[data-v-a7858fe0]{width:120px;flex:0 0 auto}.book[data-v-a7858fe0]{border:1px solid var(--md-outline-variant);border-radius:14px;background:linear-gradient(180deg,var(--md-surface-container-lowest),var(--md-surface-container-low));padding:16px 18px}.book-nav[data-v-a7858fe0]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.book-date[data-v-a7858fe0]{width:auto;height:34px;flex:0 0 auto}.book-page[data-v-a7858fe0]{min-height:120px;border-top:1px solid var(--md-outline-variant);padding-top:14px}.book-heading[data-v-a7858fe0]{margin:0 0 10px;font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--md-on-surface-variant);letter-spacing:.02em}.book-body[data-v-a7858fe0]{display:flex;flex-direction:column;gap:10px}.book-body p[data-v-a7858fe0]{margin:0;font-size:14px;line-height:1.95;text-indent:2em;color:var(--md-on-surface);white-space:pre-wrap;overflow-wrap:anywhere}.book-empty[data-v-a7858fe0]{margin:0;font-size:13px;color:var(--md-on-surface-variant);font-style:italic}.diary-manual[data-v-a7858fe0]{margin-top:14px;border-top:1px dashed var(--md-outline-variant);padding-top:12px}.feed li[data-v-a7858fe0]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-a7858fe0]{padding:8px 12px}.feed time[data-v-a7858fe0],.timeline time[data-v-a7858fe0]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-a7858fe0]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-a7858fe0]{color:var(--md-success);font-weight:700}.neg[data-v-a7858fe0]{color:var(--md-error);font-weight:700}.policy[data-v-a7858fe0]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-a7858fe0]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-a7858fe0]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-a7858fe0]{margin-top:6px}.audit-card[data-v-a7858fe0]{margin-bottom:var(--space-lg)}.usage-grid[data-v-a7858fe0]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-a7858fe0]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-a7858fe0]{font-size:20px;font-weight:700}.usage-item span[data-v-a7858fe0]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-a7858fe0]{position:relative}.timeline li[data-v-a7858fe0]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-a7858fe0]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-a7858fe0]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-a7858fe0]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-a7858fe0]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-a7858fe0]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-a7858fe0]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-a7858fe0]{font-size:13.5px;font-weight:650}.tl-detail[data-v-a7858fe0]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-a7858fe0]{grid-template-columns:repeat(2,1fr)}.grid[data-v-a7858fe0],.agenda-form[data-v-a7858fe0]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-a7858fe0]{padding:var(--space-lg)}.header-actions[data-v-a7858fe0]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
