import { defineComponent as Le, ref as v, computed as j, onMounted as De, openBlock as n, createElementBlock as i, createElementVNode as t, toDisplayString as a, createCommentVNode as d, createStaticVNode as bt, normalizeClass as y, withModifiers as x, withDirectives as u, vModelText as c, Fragment as m, renderList as _, createTextVNode as h, vModelCheckbox as gt, normalizeStyle as yt, vModelSelect as Bt } from "vue";
import { u as Te, _ as Ee } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const Oe = { class: "page" }, qe = { class: "page-inner" }, Ie = { class: "page-header" }, Pe = { class: "header-actions" }, Je = ["disabled"], Ye = ["disabled"], Be = {
  key: 0,
  class: "error-banner"
}, Ae = {
  key: 1,
  class: "notice"
}, Ge = { class: "stat-grid" }, ze = { class: "stat-card" }, Re = { class: "stat-value" }, He = { class: "stat-card" }, Qe = { class: "stat-value" }, Ke = { class: "stat-card" }, We = { class: "stat-value" }, Xe = { class: "stat-hint" }, Ze = { class: "stat-card" }, ts = { class: "stat-value" }, es = { class: "life-state" }, ss = { class: "state-pill" }, ls = {
  key: 0,
  class: "state-pill"
}, as = { class: "group" }, ns = { class: "grid" }, is = { class: "card" }, os = { class: "item-list" }, us = { class: "item-main" }, ds = { class: "item-meta" }, rs = { class: "item-actions" }, cs = ["onClick"], ps = ["onClick"], vs = {
  key: 0,
  class: "list-empty"
}, ms = { class: "item-list" }, _s = { class: "item-main" }, bs = { class: "item-row" }, gs = { class: "item-meta" }, ys = {
  key: 0,
  class: "list-empty"
}, hs = { class: "card" }, ks = { class: "card-head" }, fs = { class: "chip muted" }, ws = { class: "check-line" }, Cs = ["disabled"], Ss = { class: "item-list" }, xs = { class: "item-main" }, Us = { class: "item-meta" }, $s = { class: "item-actions" }, Vs = ["onClick"], js = {
  key: 0,
  class: "list-empty"
}, Ns = { class: "card" }, Ms = { class: "card-head" }, Fs = { class: "head-actions" }, Ls = ["disabled"], Ds = { class: "book" }, Ts = { class: "book-nav" }, Es = ["disabled"], Os = ["disabled"], qs = { class: "book-page" }, Is = { class: "book-heading" }, Ps = {
  key: 0,
  class: "book-body"
}, Js = {
  key: 1,
  class: "book-empty"
}, Ys = { class: "card" }, Bs = { class: "card-head" }, As = { class: "head-actions" }, Gs = ["disabled"], zs = { class: "feed" }, Rs = {
  key: 0,
  class: "list-empty plain"
}, Hs = { class: "group" }, Qs = { class: "grid" }, Ks = { class: "card cal-card" }, Ws = { class: "card-head" }, Xs = { class: "head-actions" }, Zs = { class: "cal-month" }, tl = { class: "cal-week" }, el = { class: "cal-grid" }, sl = {
  key: 0,
  class: "cal-day"
}, ll = ["title"], al = {
  key: 1,
  class: "cal-more"
}, nl = {
  key: 0,
  class: "cal-warn"
}, il = { class: "section-label" }, ol = { class: "item-list" }, ul = { class: "item-main" }, dl = { class: "item-meta" }, rl = { class: "item-actions" }, cl = ["onClick"], pl = ["onClick"], vl = {
  key: 0,
  class: "list-empty"
}, ml = { class: "card" }, _l = { class: "card-head" }, bl = { class: "chip muted" }, gl = ["disabled"], yl = { class: "item-list" }, hl = { class: "item-main" }, kl = { class: "item-row" }, fl = { class: "meter-bar" }, wl = {
  key: 0,
  class: "item-meta"
}, Cl = { class: "item-actions" }, Sl = ["onClick"], xl = ["onClick"], Ul = {
  key: 0,
  class: "list-empty"
}, $l = { class: "card" }, Vl = { class: "card-head" }, jl = { class: "chip muted" }, Nl = ["disabled"], Ml = { class: "item-list" }, Fl = { class: "item-main" }, Ll = { class: "item-meta" }, Dl = { class: "item-actions" }, Tl = ["onClick"], El = {
  key: 0,
  class: "list-empty"
}, Ol = { class: "card" }, ql = { class: "card-head" }, Il = { class: "chip muted" }, Pl = { class: "cloud" }, Jl = {
  key: 0,
  class: "list-empty plain"
}, Yl = { class: "group" }, Bl = { class: "grid" }, Al = { class: "card" }, Gl = { class: "card-head" }, zl = { class: "card-title" }, Rl = {
  key: 1,
  class: "chip muted"
}, Hl = { class: "user-tools" }, Ql = ["value"], Kl = { class: "rel-list" }, Wl = ["onClick"], Xl = { class: "avatar" }, Zl = { class: "rel-main" }, ta = { class: "rel-top" }, ea = { class: "chip" }, sa = { class: "rel-meter" }, la = { class: "meter-bar" }, aa = { class: "item-meta" }, na = {
  key: 0,
  class: "list-empty"
}, ia = {
  key: 1,
  class: "list-empty"
}, oa = { class: "detail-head" }, ua = { class: "avatar" }, da = { class: "rel-main" }, ra = { class: "item-meta" }, ca = { class: "tabs" }, pa = ["onClick"], va = {
  key: 0,
  class: "detail-body"
}, ma = { class: "kv-grid" }, _a = { class: "kv" }, ba = { class: "kv" }, ga = { class: "kv" }, ya = { class: "kv" }, ha = { class: "kv" }, ka = { class: "feed compact" }, fa = {
  key: 0,
  class: "list-empty plain"
}, wa = {
  key: 1,
  class: "detail-body"
}, Ca = { class: "rel-meter big" }, Sa = { class: "meter-bar" }, xa = { class: "rel-actions" }, Ua = { class: "feed compact" }, $a = {
  key: 0,
  class: "list-empty plain"
}, Va = {
  key: 2,
  class: "detail-body"
}, ja = { class: "item-list" }, Na = { class: "item-main" }, Ma = { class: "item-meta" }, Fa = { class: "item-meta" }, La = { class: "item-actions" }, Da = ["onClick"], Ta = {
  key: 0,
  class: "list-empty"
}, Ea = { class: "feed compact" }, Oa = {
  key: 0,
  class: "list-empty plain"
}, qa = {
  key: 3,
  class: "detail-body"
}, Ia = { class: "item-list" }, Pa = { class: "item-main" }, Ja = { class: "mem-text" }, Ya = { class: "item-meta" }, Ba = { class: "item-actions" }, Aa = ["onClick"], Ga = {
  key: 0,
  class: "list-empty"
}, za = {
  key: 4,
  class: "detail-body"
}, Ra = { class: "timeline" }, Ha = { class: "tl-body" }, Qa = { class: "tl-head" }, Ka = { class: "item-meta" }, Wa = { class: "tl-detail" }, Xa = {
  key: 0,
  class: "list-empty plain"
}, Za = { class: "card" }, tn = { class: "item-list" }, en = { class: "item-main" }, sn = { class: "item-meta" }, ln = { class: "chip" }, an = {
  key: 0,
  class: "list-empty"
}, nn = { class: "group" }, on = { class: "grid" }, un = { class: "card" }, dn = { class: "card-head" }, rn = { class: "chip muted" }, cn = { class: "form-row" }, pn = ["disabled"], vn = { class: "item-list" }, mn = { class: "item-main" }, _n = { class: "item-row" }, bn = { class: "chip muted" }, gn = { class: "chip" }, yn = {
  key: 0,
  class: "item-meta"
}, hn = { class: "item-actions" }, kn = ["onClick"], fn = {
  key: 0,
  class: "list-empty"
}, wn = { class: "card" }, Cn = { class: "card-head" }, Sn = { class: "chip muted" }, xn = { class: "toolbar-inline" }, Un = ["disabled"], $n = { class: "item-list" }, Vn = { class: "item-main" }, jn = { class: "item-meta" }, Nn = { class: "item-actions" }, Mn = ["onClick"], Fn = ["onClick"], Ln = ["onClick"], Dn = {
  key: 0,
  class: "list-empty"
}, Tn = { class: "card" }, En = { class: "card-head" }, On = { class: "chip muted" }, qn = { class: "form-row" }, In = ["disabled"], Pn = { class: "item-list" }, Jn = { class: "item-main" }, Yn = { class: "item-meta" }, Bn = {
  key: 0,
  class: "list-empty"
}, An = ["disabled"], Gn = { class: "item-list" }, zn = { class: "item-main" }, Rn = { class: "item-meta" }, Hn = { class: "item-actions" }, Qn = ["onClick"], Kn = {
  key: 0,
  class: "list-empty"
}, Wn = { class: "group" }, Xn = { class: "grid" }, Zn = { class: "card" }, ti = { class: "card-head" }, ei = { class: "chip muted" }, si = { class: "toolbar-inline" }, li = ["disabled"], ai = ["disabled"], ni = { class: "item-list" }, ii = { class: "item-main" }, oi = { class: "item-meta" }, ui = { class: "item-meta" }, di = { class: "item-actions" }, ri = ["onClick"], ci = {
  key: 0,
  class: "list-empty"
}, pi = { class: "policy" }, vi = { class: "select" }, mi = { class: "select" }, _i = { class: "select" }, bi = { class: "select" }, gi = { class: "feed" }, yi = {
  key: 0,
  class: "list-empty plain"
}, hi = { class: "group" }, ki = { class: "grid" }, fi = { class: "card" }, wi = { class: "card-head" }, Ci = { class: "chip muted" }, Si = ["disabled"], xi = { class: "item-list" }, Ui = { class: "item-main" }, $i = { class: "item-row" }, Vi = {
  key: 0,
  class: "chip muted"
}, ji = { class: "item-meta" }, Ni = {
  key: 0,
  class: "group-detail"
}, Mi = { class: "topics" }, Fi = ["onClick"], Li = {
  key: 0,
  class: "item-meta"
}, Di = ["onSubmit"], Ti = ["onUpdate:modelValue"], Ei = { class: "member-list" }, Oi = { class: "member-id" }, qi = { class: "item-meta" }, Ii = ["value", "onChange"], Pi = {
  key: 0,
  class: "item-meta"
}, Ji = { class: "item-actions" }, Yi = ["value", "onChange"], Bi = ["onClick"], Ai = ["onClick"], Gi = {
  key: 0,
  class: "list-empty"
}, zi = { class: "group" }, Ri = { class: "grid" }, Hi = { class: "card" }, Qi = { class: "settings-grid" }, Ki = { class: "select" }, Wi = { class: "select" }, Xi = { class: "select" }, Zi = { class: "select" }, to = { class: "select" }, eo = { class: "select" }, so = { class: "select" }, lo = { class: "select" }, ao = { class: "select" }, no = { class: "toggle-row" }, io = { class: "check-line" }, oo = { class: "check-line" }, uo = { class: "check-line" }, ro = { class: "card" }, co = ["disabled"], po = { class: "group" }, vo = { class: "grid" }, mo = { class: "card audit-card" }, _o = { class: "card-head" }, bo = { class: "chip muted" }, go = { class: "usage-grid" }, yo = { class: "usage-item" }, ho = { class: "usage-item" }, ko = { class: "usage-item" }, fo = { class: "item-list" }, wo = { class: "item-main" }, Co = { class: "item-meta" }, So = {
  key: 0,
  class: "list-empty"
}, xo = { class: "card audit-card" }, Uo = { class: "item-list" }, $o = { class: "item-main" }, Vo = { class: "item-meta" }, jo = {
  key: 0,
  class: "list-empty"
}, No = {
  key: 0,
  class: "kv-grid"
}, Mo = { class: "card audit-card" }, Fo = { class: "card-head" }, Lo = { class: "timeline" }, Do = { class: "tl-body" }, To = { class: "tl-head" }, Eo = { class: "item-meta" }, Oo = { class: "tl-detail" }, qo = {
  key: 0,
  class: "list-empty plain"
}, Io = /* @__PURE__ */ Le({
  __name: "CompanionPage",
  setup(Po) {
    const { confirm: At } = Te(), r = v({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), tt = v(!1), $ = v(""), H = v(""), Q = v(""), et = v(""), st = v(""), lt = v(""), at = v(""), nt = () => {
      const l = /* @__PURE__ */ new Date(), s = (e) => String(e).padStart(2, "0");
      return `${l.getFullYear()}-${s(l.getMonth() + 1)}-${s(l.getDate())}`;
    }, K = v(nt()), F = v({ date: "", content: "", previous: null, next: null }), W = v(!1), Nt = j(() => (F.value.content || "").split(/\n{2,}/).map((l) => l.trim()).filter(Boolean));
    async function ht(l = K.value) {
      W.value = !0;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "journal_page", payload: { date: l } }) });
        if (!s.ok) throw Error(await s.text());
        const e = await s.json();
        F.value = { date: e?.date || l, content: e?.content || "", previous: e?.previous || null, next: e?.next || null }, K.value = F.value.date;
      } catch (s) {
        $.value = s?.message || "无法读取日记";
      } finally {
        W.value = !1;
      }
    }
    function Mt(l) {
      const s = l === "previous" ? F.value.previous : F.value.next;
      s && ht(s);
    }
    const P = v(""), k = v({ target: "", motive: "", content: "", preferred_at: "" }), w = v({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), Gt = j(() => Object.entries(r.value.groups || {})), it = j(() => (r.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), kt = j(() => r.value.proactive?.receipts || []), Ft = nt(), ft = j(() => (r.value.agenda || []).filter((l) => {
      const s = String(l.start_at || "").replace("T", " ");
      return !s || s.slice(0, 10) >= Ft;
    }));
    function f(l) {
      H.value = l, setTimeout(() => {
        H.value === l && (H.value = "");
      }, 2e3);
    }
    const L = v(null);
    async function zt() {
      try {
        const l = await fetch("/api/usage");
        l.ok && (L.value = await l.json());
      } catch {
      }
    }
    async function G() {
      tt.value = !0, $.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        r.value = await l.json(), r.value?.policy && (w.value = { ...w.value, ...r.value.policy }), Ve();
      } catch (l) {
        $.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        tt.value = !1;
      }
      zt(), ht(), ct(), ve();
    }
    async function p(l, s) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: s }) });
        if (!e.ok) throw Error(await e.text());
        return await G(), await e.json().catch(() => ({}));
      } catch (e) {
        return $.value = e?.message || "操作失败", null;
      }
    }
    async function Rt() {
      Q.value.trim() && (await p("add_agenda", { title: Q.value, when: et.value, detail: st.value }), Q.value = "", et.value = "", st.value = "");
    }
    async function Lt(l, s) {
      s.trim() && (await p(l, { content: s }), l === "journal" ? lt.value = "" : at.value = "");
    }
    function wt(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    function Dt(l) {
      if (l.status === "completed") return { label: "已完成", cls: "chip-ok" };
      const s = new Date(String(l.start_at || "").replace(" ", "T"));
      return !Number.isNaN(s.getTime()) && s.getTime() <= Date.now() ? { label: "进行中", cls: "chip-warn" } : { label: "待开始", cls: "muted" };
    }
    async function Tt(l, s) {
      await p("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: s }) && f(`已调整 ${l}`);
    }
    async function Ht() {
      if (!k.value.target.trim() || !k.value.content.trim()) return;
      await p("proactive_create", { ...k.value }) && (k.value = { target: "", motive: "", content: "", preferred_at: "" }, f("已创建主动候选"));
    }
    async function Et(l) {
      await p("proactive_cancel", { id: l, reason: "dashboard_cancel" }), f("已取消候选");
    }
    async function Qt() {
      await p("proactive_policy", { daily_limit: Number(w.value.daily_limit), per_target_limit: Number(w.value.per_target_limit), quiet_start: Number(w.value.quiet_start), quiet_end: Number(w.value.quiet_end) }), f("策略已保存");
    }
    const z = v("");
    async function Ot(l) {
      z.value = l;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        await G(), f("已由 LIFE 生成");
      } catch (s) {
        $.value = s?.message || "生成失败";
      } finally {
        z.value = "";
      }
    }
    async function Kt() {
      const l = k.value.target.trim() || "user:owner";
      await p("proactive_suggest", { target: l, hint: k.value.motive }) && (k.value = { target: "", motive: "", content: "", preferred_at: "" }, f("已生成建议候选"));
    }
    const ot = v(!1);
    async function Wt() {
      ot.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await G(), f(s?.skipped ? `本次跳过：${s.skipped}` : `已投递 ${s.delivered || 0} 条 · 拦截 ${s.blocked || 0} 条`);
      } catch (l) {
        $.value = l?.message || "投递失败";
      } finally {
        ot.value = !1;
      }
    }
    const ut = v(!1);
    async function Xt() {
      ut.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await G();
        const e = s?.applied;
        f(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (l) {
        $.value = l?.message || "规划失败";
      } finally {
        ut.value = !1;
      }
    }
    function Ct(l) {
      const s = (l || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let o = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? (o = new Date(s), o.setHours(0, 0, 0, 0), o < e && o.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(s) && (o = new Date(e.getFullYear(), Number(s.slice(0, 2)) - 1, Number(s.slice(3, 5))), o < e && o.setFullYear(e.getFullYear() + 1)), !o || Number.isNaN(o.getTime()) ? null : Math.round((o.getTime() - e.getTime()) / 864e5);
    }
    const C = v({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function Zt() {
      !C.value.title.trim() || !C.value.date.trim() || (await p("date_add", { ...C.value }), C.value = { title: "", date: "", repeat_yearly: !0, note: "" }, f("已添加重要日期"));
    }
    async function te(l) {
      await p("date_delete", { id: l }), f("已删除");
    }
    async function ee() {
      await p("circadian_eat", { amount: 45 }), f("已用餐");
    }
    async function se() {
      const l = await p("daily_agenda", {});
      f(l?.created ? `LIFE 已安排 ${l.created} 项活动` : "今天已有安排");
    }
    async function qt(l) {
      await At({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await p("journal_clear", { kind: l }), f("已清除"));
    }
    function D(l) {
      if (!l) return "";
      const s = new Date(l);
      return Number.isNaN(s.getTime()) ? l : s.toLocaleString();
    }
    const J = v(""), dt = v(""), rt = v(""), b = v(null), St = v(!1), Y = v("overview"), le = [{ key: "overview", label: "概览" }, { key: "relationship", label: "关系" }, { key: "proactive", label: "主动" }, { key: "memory", label: "记忆" }, { key: "diagnostics", label: "诊断" }], ae = j(() => Array.from(new Set((r.value.relationships || []).map((l) => l.stage).filter(Boolean)))), xt = j(() => (r.value.relationships || []).filter((l) => (!dt.value || String(l.user_id).toLowerCase().includes(dt.value.toLowerCase())) && (!rt.value || l.stage === rt.value)));
    async function It(l) {
      J.value = l, Y.value = "overview", St.value = !0;
      const s = await p("user_detail", { user_id: l, limit: 100, memory_limit: 100 });
      b.value = s || null, St.value = !1;
    }
    function ne() {
      J.value = "", b.value = null;
    }
    async function ie(l) {
      await p("delete_memory", { id: l }), J.value && It(J.value);
    }
    const X = v(nt().slice(0, 7)), T = v({ events: [], candidates: [], conflicts: [] }), E = v({ title: "", detail: "", kind: "growth" }), O = v({ name: "", tags: "", note: "" }), Ut = j(() => r.value.word_cloud || []), oe = j(() => {
      const [l, s] = X.value.split("-").map(Number);
      if (!l || !s) return [];
      const e = new Date(l, s, 0).getDate(), o = new Date(l, s - 1, 1).getDay(), A = {};
      for (const V of T.value.events || []) {
        const I = String(V.start_at || "").replace("T", " ").slice(0, 10);
        (A[I] || (A[I] = [])).push(V);
      }
      const jt = [];
      for (let V = 0; V < o; V++) jt.push({ key: `pad-${V}`, empty: !0 });
      for (let V = 1; V <= e; V++) {
        const I = `${l}-${String(s).padStart(2, "0")}-${String(V).padStart(2, "0")}`;
        jt.push({ key: I, day: V, iso: I, events: A[I] || [], today: I === Ft });
      }
      return jt;
    });
    async function ct() {
      const l = await p("calendar_month", { month: X.value });
      l && (T.value = l);
    }
    function Pt(l) {
      const [s, e] = X.value.split("-").map(Number), o = new Date(s, e - 1 + l, 1);
      X.value = `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`, ct();
    }
    async function ue() {
      E.value.title.trim() && (await p("goal_add", { ...E.value }), E.value = { title: "", detail: "", kind: "growth" });
    }
    async function de(l) {
      await p("goal_update", { id: l, status: "done", progress: 1 });
    }
    async function re(l) {
      await p("goal_delete", { id: l });
    }
    async function ce() {
      O.value.name.trim() && (await p("food_add", { ...O.value }), O.value = { name: "", tags: "", note: "" });
    }
    async function pe(l) {
      await p("food_delete", { id: l });
    }
    const pt = v([]), N = v({ group_id: "", policy: "observe", alias: "" }), $t = v({}), Vt = v({}), vt = v({});
    async function ve() {
      const l = await p("group_list", {});
      l && (pt.value = l.groups || []);
    }
    async function me() {
      N.value.group_id.trim() && (await p("group_upsert", { ...N.value }), N.value = { group_id: "", policy: "observe", alias: "" });
    }
    async function _e(l) {
      await p("group_delete", { group_id: l }), P.value === l && (P.value = "");
    }
    async function be(l, s) {
      const e = s.target.value;
      await p("group_upsert", { group_id: l.group_id, policy: e, alias: l.alias || "", note: l.note || "" });
    }
    async function ge(l, s, e) {
      const o = e.target.value;
      await p("group_member_flag", { group_id: l, user_id: s, flag: o }), mt(l);
    }
    async function mt(l) {
      const [s, e] = await Promise.all([p("group_slang_list", { group_id: l }), p("group_members", { group_id: l })]);
      $t.value[l] = s?.slang || [], Vt.value[l] = e?.members || [];
    }
    function ye(l) {
      P.value = P.value === l ? "" : l, P.value && mt(l);
    }
    async function he(l) {
      const s = (vt.value[l] || "").trim();
      s && (await p("group_slang_update", { group_id: l, topic: s, score: 1 }), vt.value[l] = "", mt(l));
    }
    async function ke(l, s) {
      await p("group_slang_delete", { group_id: l, topic: s }), mt(l);
    }
    const S = v({ name: "", category: "general", level: 1, keywords: "" }), q = v({ text: "", scene: "" }), B = v("pending"), M = v({ user_id: "", name: "", tags: "" }), U = v({ source_id: "", target_id: "", relation: "" }), Jt = j(() => (r.value.expressions || []).filter((l) => l.status === B.value)), _t = j(() => {
      const l = r.value.expressions || [];
      return { pending: l.filter((s) => s.status === "pending").length, approved: l.filter((s) => s.status === "approved").length, rejected: l.filter((s) => s.status === "rejected").length };
    });
    async function fe() {
      S.value.name.trim() && (await p("skill_add", { ...S.value, level: Number(S.value.level) }), S.value = { name: "", category: "general", level: 1, keywords: "" });
    }
    async function we(l) {
      await p("skill_delete", { id: l });
    }
    async function Ce() {
      q.value.text.trim() && (await p("expression_add", { ...q.value }), q.value = { text: "", scene: "" });
    }
    async function Yt(l, s) {
      await p("expression_review", { id: l, accept: s });
    }
    async function Se(l) {
      await p("expression_delete", { id: l });
    }
    async function xe() {
      M.value.user_id.trim() && (await p("social_node_upsert", { ...M.value }), M.value = { user_id: "", name: "", tags: "" });
    }
    async function Ue() {
      !U.value.source_id.trim() || !U.value.target_id.trim() || (await p("social_edge_add", { ...U.value }), U.value = { source_id: "", target_id: "", relation: "" });
    }
    async function $e(l) {
      await p("social_edge_delete", { id: l });
    }
    const g = v({}), Z = v(null), R = v("");
    function Ve() {
      const l = r.value.settings || {}, s = (e, o) => String(l[e] ?? o);
      g.value = {
        proactive_daily_limit: Number(s("proactive_daily_limit", "3")),
        proactive_target_limit: Number(s("proactive_target_limit", "1")),
        quiet_start: Number(s("quiet_start", "23")),
        quiet_end: Number(s("quiet_end", "8")),
        idle_minutes: Number(s("idle_minutes", "30")),
        min_interval_minutes: Number(s("min_interval_minutes", "5")),
        check_interval_seconds: Number(s("check_interval_seconds", "600")),
        burst_max: Number(s("burst_max", "2")),
        daily_token_limit: Number(s("daily_token_limit", "0")),
        enable_proactive: s("enable_proactive", "1") === "1",
        enable_group_observe: s("enable_group_observe", "1") === "1",
        enable_dream: s("enable_dream", "1") === "1"
      };
    }
    async function je() {
      const l = g.value, s = {
        proactive_daily_limit: String(l.proactive_daily_limit),
        proactive_target_limit: String(l.proactive_target_limit),
        quiet_start: String(l.quiet_start),
        quiet_end: String(l.quiet_end),
        idle_minutes: String(l.idle_minutes),
        min_interval_minutes: String(l.min_interval_minutes),
        check_interval_seconds: String(l.check_interval_seconds),
        burst_max: String(l.burst_max),
        daily_token_limit: String(l.daily_token_limit),
        enable_proactive: l.enable_proactive ? "1" : "0",
        enable_group_observe: l.enable_group_observe ? "1" : "0",
        enable_dream: l.enable_dream ? "1" : "0"
      };
      await p("settings_set", { settings: s }), f("设置已保存");
    }
    async function Ne() {
      const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "config_export", payload: {} }) });
      if (!l.ok) {
        $.value = await l.text();
        return;
      }
      const s = new Blob([JSON.stringify(await l.json(), null, 2)], { type: "application/json" }), e = URL.createObjectURL(s), o = document.createElement("a");
      o.href = e, o.download = `life-companion-${nt()}.json`, o.click(), URL.revokeObjectURL(e);
    }
    async function Me() {
      if (!R.value.trim()) return;
      let l;
      try {
        l = JSON.parse(R.value);
      } catch {
        $.value = "导入内容不是合法 JSON";
        return;
      }
      const s = await p("config_import", { snapshot: l });
      s && (R.value = "", f(`已导入：${Object.entries(s.applied || {}).map(([e, o]) => `${e} ${o}`).join(" · ")}`));
    }
    async function Fe() {
      const l = await p("diagnostics", {});
      l && (Z.value = l);
    }
    return De(G), (l, s) => (n(), i("main", Oe, [
      t("div", qe, [
        t("header", Ie, [
          s[69] || (s[69] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", Pe, [
            t("button", {
              class: "btn btn-primary",
              disabled: ut.value,
              onClick: Xt
            }, a(ut.value ? "规划中…" : "让 LIFE 规划"), 9, Je),
            t("button", {
              class: "btn btn-tonal",
              disabled: tt.value,
              onClick: G
            }, a(tt.value ? "刷新中…" : "刷新"), 9, Ye)
          ])
        ]),
        $.value ? (n(), i("p", Be, a($.value), 1)) : d("", !0),
        H.value ? (n(), i("p", Ae, a(H.value), 1)) : d("", !0),
        t("section", Ge, [
          t("article", ze, [
            s[70] || (s[70] = bt('<div class="stat-head" data-v-cc0ee331><span class="icon-badge tone-1" aria-hidden="true" data-v-cc0ee331><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-cc0ee331><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-cc0ee331></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-cc0ee331></path></svg></span><span class="stat-label" data-v-cc0ee331>关系对象</span></div>', 1)),
            t("strong", Re, a(r.value.relationships?.length || 0), 1),
            s[71] || (s[71] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", He, [
            s[72] || (s[72] = bt('<div class="stat-head" data-v-cc0ee331><span class="icon-badge tone-2" aria-hidden="true" data-v-cc0ee331><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-cc0ee331><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-cc0ee331></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-cc0ee331></path></svg></span><span class="stat-label" data-v-cc0ee331>活动日程</span></div>', 1)),
            t("strong", Qe, a(ft.value.filter((e) => e.status === "active").length), 1),
            s[73] || (s[73] = t("span", { class: "stat-hint" }, "今天起待进行", -1))
          ]),
          t("article", Ke, [
            s[74] || (s[74] = bt('<div class="stat-head" data-v-cc0ee331><span class="icon-badge tone-3" aria-hidden="true" data-v-cc0ee331><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-cc0ee331><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-cc0ee331></path></svg></span><span class="stat-label" data-v-cc0ee331>待投递主动行为</span></div>', 1)),
            t("strong", We, a(it.value.length), 1),
            t("span", Xe, "已投递 " + a(kt.value.length) + " 次", 1)
          ]),
          t("article", Ze, [
            s[75] || (s[75] = bt('<div class="stat-head" data-v-cc0ee331><span class="icon-badge tone-4" aria-hidden="true" data-v-cc0ee331><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-cc0ee331><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-cc0ee331></path></svg></span><span class="stat-label" data-v-cc0ee331>已观察群聊</span></div>', 1)),
            t("strong", ts, a(Gt.value.length), 1),
            s[76] || (s[76] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", es, [
          t("span", ss, "精力 " + a(Math.round(r.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: y(["state-pill", { warn: (r.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + a(Math.round(r.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: y(["state-pill", { warn: (r.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + a(Math.round(r.value.circadian?.health ?? 100)), 3),
          r.value.circadian?.is_sleeping ? (n(), i("span", ls, "睡眠中")) : d("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: ee
          }, "吃饭")
        ]),
        t("section", as, [
          s[87] || (s[87] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", ns, [
            t("article", is, [
              t("div", { class: "card-head" }, [
                s[77] || (s[77] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: se
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: x(Rt, ["prevent"])
              }, [
                u(t("input", {
                  "onUpdate:modelValue": s[0] || (s[0] = (e) => Q.value = e),
                  class: "input",
                  placeholder: "日程标题",
                  "aria-label": "日程标题"
                }, null, 512), [
                  [c, Q.value]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[1] || (s[1] = (e) => et.value = e),
                  class: "input",
                  placeholder: "时间，例如 2026-09-25 20:00",
                  "aria-label": "时间"
                }, null, 512), [
                  [c, et.value]
                ]),
                s[78] || (s[78] = t("button", {
                  class: "btn btn-primary",
                  type: "submit"
                }, "创建候选", -1)),
                u(t("textarea", {
                  "onUpdate:modelValue": s[2] || (s[2] = (e) => st.value = e),
                  class: "input area",
                  placeholder: "说明（可选）"
                }, null, 512), [
                  [c, st.value]
                ])
              ], 32),
              s[79] || (s[79] = t("h3", { class: "section-label" }, "待确认候选", -1)),
              t("ul", os, [
                (n(!0), i(m, null, _(r.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", us, [
                    t("strong", null, a(e.title), 1),
                    t("span", ds, a(e.when_text) + " · " + a(e.detail || "等待你确认"), 1)
                  ]),
                  t("div", rs, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (o) => p("confirm_agenda", { id: e.id })
                    }, "确认", 8, cs),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => p("reject_agenda", { id: e.id })
                    }, "拒绝", 8, ps)
                  ])
                ]))), 128)),
                r.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? d("", !0) : (n(), i("li", vs, "没有待确认的日程候选"))
              ]),
              s[80] || (s[80] = t("h3", { class: "section-label" }, [
                h("今天的日程 "),
                t("small", { class: "hint-inline" }, "LIFE 按时间自动推进")
              ], -1)),
              t("ul", ms, [
                (n(!0), i(m, null, _(ft.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", _s, [
                    t("div", bs, [
                      t("strong", {
                        class: y({ done: e.status === "completed" })
                      }, a(e.title), 3),
                      t("span", {
                        class: y(["chip", Dt(e).cls])
                      }, a(Dt(e).label), 3)
                    ]),
                    t("span", gs, [
                      h(a(e.start_at), 1),
                      e.detail ? (n(), i(m, { key: 0 }, [
                        h(" · " + a(e.detail), 1)
                      ], 64)) : d("", !0)
                    ])
                  ])
                ]))), 128)),
                ft.value.length ? d("", !0) : (n(), i("li", ys, "今天还没有安排，点右上角让 LIFE 安排。"))
              ])
            ]),
            t("article", hs, [
              t("div", ks, [
                s[81] || (s[81] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", fs, a((r.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(Zt, ["prevent"])
              }, [
                u(t("input", {
                  "onUpdate:modelValue": s[3] || (s[3] = (e) => C.value.title = e),
                  class: "input",
                  placeholder: "名称，如 生日 / 纪念日",
                  "aria-label": "重要日期名称"
                }, null, 512), [
                  [c, C.value.title]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[4] || (s[4] = (e) => C.value.date = e),
                  class: "input",
                  placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                  "aria-label": "重要日期"
                }, null, 512), [
                  [c, C.value.date]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[5] || (s[5] = (e) => C.value.note = e),
                  class: "input",
                  placeholder: "备注（可选）",
                  "aria-label": "备注"
                }, null, 512), [
                  [c, C.value.note]
                ]),
                t("label", ws, [
                  u(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[6] || (s[6] = (e) => C.value.repeat_yearly = e)
                  }, null, 512), [
                    [gt, C.value.repeat_yearly]
                  ]),
                  s[82] || (s[82] = h(" 每年重复", -1))
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !C.value.title.trim() || !C.value.date.trim()
                }, "添加", 8, Cs)
              ], 32),
              t("ul", Ss, [
                (n(!0), i(m, null, _(r.value.important_dates, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", xs, [
                    t("strong", null, a(e.title), 1),
                    t("span", Us, [
                      h(a(e.date_text), 1),
                      Ct(e.date_text) !== null ? (n(), i(m, { key: 0 }, [
                        h(" · " + a(Ct(e.date_text) === 0 ? "就是今天" : Ct(e.date_text) + " 天后"), 1)
                      ], 64)) : d("", !0),
                      e.note ? (n(), i(m, { key: 1 }, [
                        h(" · " + a(e.note), 1)
                      ], 64)) : d("", !0)
                    ])
                  ]),
                  t("div", $s, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => te(e.id)
                    }, "删除", 8, Vs)
                  ])
                ]))), 128)),
                r.value.important_dates?.length ? d("", !0) : (n(), i("li", js, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", Ns, [
              t("div", Ms, [
                s[83] || (s[83] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", Fs, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[7] || (s[7] = (e) => qt("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: z.value === "journal",
                    onClick: s[8] || (s[8] = (e) => Ot("journal"))
                  }, a(z.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, Ls)
                ])
              ]),
              t("div", Ds, [
                t("div", Ts, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !F.value.previous || W.value,
                    onClick: s[9] || (s[9] = (e) => Mt("previous"))
                  }, "← 前一页", 8, Es),
                  u(t("input", {
                    "onUpdate:modelValue": s[10] || (s[10] = (e) => K.value = e),
                    class: "input book-date",
                    type: "date",
                    "aria-label": "日记日期",
                    onChange: s[11] || (s[11] = (e) => ht(K.value))
                  }, null, 544), [
                    [c, K.value]
                  ]),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !F.value.next || W.value,
                    onClick: s[12] || (s[12] = (e) => Mt("next"))
                  }, "后一页 →", 8, Os)
                ]),
                t("div", qs, [
                  t("p", Is, a(F.value.date), 1),
                  Nt.value.length ? (n(), i("div", Ps, [
                    (n(!0), i(m, null, _(Nt.value, (e, o) => (n(), i("p", { key: o }, a(e), 1))), 128))
                  ])) : (n(), i("p", Js, a(W.value ? "翻页中…" : "这一天还没有写下什么。"), 1))
                ])
              ]),
              t("form", {
                class: "stack-form diary-manual",
                onSubmit: s[14] || (s[14] = x((e) => Lt("journal", lt.value), ["prevent"]))
              }, [
                u(t("textarea", {
                  "onUpdate:modelValue": s[13] || (s[13] = (e) => lt.value = e),
                  class: "input area",
                  placeholder: "为今天写下一点…"
                }, null, 512), [
                  [c, lt.value]
                ]),
                s[84] || (s[84] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "写入今天", -1))
              ], 32)
            ]),
            t("article", Ys, [
              t("div", Bs, [
                s[85] || (s[85] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", As, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[15] || (s[15] = (e) => qt("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: z.value === "dream",
                    onClick: s[16] || (s[16] = (e) => Ot("dream"))
                  }, a(z.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, Gs)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: s[18] || (s[18] = x((e) => Lt("dream", at.value), ["prevent"]))
              }, [
                u(t("textarea", {
                  "onUpdate:modelValue": s[17] || (s[17] = (e) => at.value = e),
                  class: "input area",
                  placeholder: "记录一个梦境或睡眠反思…"
                }, null, 512), [
                  [c, at.value]
                ]),
                s[86] || (s[86] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "记录梦境", -1))
              ], 32),
              t("ol", zs, [
                (n(!0), i(m, null, _(r.value.dreams, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, a(e.at), 1),
                  t("p", null, a(e.content), 1)
                ]))), 128)),
                r.value.dreams?.length ? d("", !0) : (n(), i("li", Rs, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", Hs, [
          s[92] || (s[92] = t("h2", { class: "group-title" }, "生活日历", -1)),
          t("div", Qs, [
            t("article", Ks, [
              t("div", Ws, [
                s[88] || (s[88] = t("h2", { class: "card-title" }, "生活日历", -1)),
                t("div", Xs, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[19] || (s[19] = (e) => Pt(-1))
                  }, "←"),
                  t("strong", Zs, a(X.value), 1),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[20] || (s[20] = (e) => Pt(1))
                  }, "→")
                ])
              ]),
              t("div", tl, [
                (n(), i(m, null, _(["日", "一", "二", "三", "四", "五", "六"], (e) => t("span", { key: e }, a(e), 1)), 64))
              ]),
              t("div", el, [
                (n(!0), i(m, null, _(oe.value, (e) => (n(), i("div", {
                  key: e.key,
                  class: y(["cal-cell", { empty: e.empty, today: e.today, has: e.events?.length }])
                }, [
                  e.empty ? d("", !0) : (n(), i("span", sl, a(e.day), 1)),
                  (n(!0), i(m, null, _((e.events || []).slice(0, 2), (o) => (n(), i("span", {
                    key: o.id,
                    class: "cal-chip",
                    title: o.title
                  }, a(o.title), 9, ll))), 128)),
                  (e.events || []).length > 2 ? (n(), i("span", al, "+" + a(e.events.length - 2), 1)) : d("", !0)
                ], 2))), 128))
              ]),
              T.value.conflicts?.length ? (n(), i("p", nl, "⚠ " + a(T.value.conflicts.length) + " 处时间冲突：" + a(T.value.conflicts.map((e) => e.titles.join(" / ")).join("；")), 1)) : d("", !0),
              t("h3", il, "本月待确认候选 (" + a(T.value.candidates?.length || 0) + ")", 1),
              t("ul", ol, [
                (n(!0), i(m, null, _((T.value.candidates || []).slice(0, 6), (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ul, [
                    t("strong", null, a(e.title), 1),
                    t("span", dl, a(e.when_text), 1)
                  ]),
                  t("div", rl, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (o) => p("confirm_agenda", { id: e.id }).then(ct)
                    }, "确认", 8, cl),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => p("reject_agenda", { id: e.id }).then(ct)
                    }, "拒绝", 8, pl)
                  ])
                ]))), 128)),
                (T.value.candidates || []).length ? d("", !0) : (n(), i("li", vl, "没有待确认候选"))
              ])
            ]),
            t("article", ml, [
              t("div", _l, [
                s[89] || (s[89] = t("h2", { class: "card-title" }, "个人目标", -1)),
                t("span", bl, a((r.value.goals || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(ue, ["prevent"])
              }, [
                u(t("input", {
                  "onUpdate:modelValue": s[21] || (s[21] = (e) => E.value.title = e),
                  class: "input",
                  placeholder: "目标，如 学会一首钢琴曲",
                  "aria-label": "目标标题"
                }, null, 512), [
                  [c, E.value.title]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[22] || (s[22] = (e) => E.value.detail = e),
                  class: "input",
                  placeholder: "说明（可选）",
                  "aria-label": "目标说明"
                }, null, 512), [
                  [c, E.value.detail]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !E.value.title.trim()
                }, "添加目标", 8, gl)
              ], 32),
              t("ul", yl, [
                (n(!0), i(m, null, _(r.value.goals, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", hl, [
                    t("div", kl, [
                      t("strong", {
                        class: y({ done: e.status === "done" })
                      }, a(e.title), 3),
                      t("span", {
                        class: y(["chip", e.status === "done" ? "chip-ok" : "muted"])
                      }, a(e.status === "done" ? "已完成" : "进行中"), 3)
                    ]),
                    t("div", fl, [
                      t("i", {
                        style: yt({ width: wt(e.progress) })
                      }, null, 4)
                    ]),
                    e.detail ? (n(), i("span", wl, a(e.detail), 1)) : d("", !0)
                  ]),
                  t("div", Cl, [
                    e.status !== "done" ? (n(), i("button", {
                      key: 0,
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => de(e.id)
                    }, "完成", 8, Sl)) : d("", !0),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => re(e.id)
                    }, "删除", 8, xl)
                  ])
                ]))), 128)),
                (r.value.goals || []).length ? d("", !0) : (n(), i("li", Ul, "还没有个人目标"))
              ])
            ]),
            t("article", $l, [
              t("div", Vl, [
                s[90] || (s[90] = t("h2", { class: "card-title" }, "食物菜单", -1)),
                t("span", jl, a((r.value.food || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(ce, ["prevent"])
              }, [
                u(t("input", {
                  "onUpdate:modelValue": s[23] || (s[23] = (e) => O.value.name = e),
                  class: "input",
                  placeholder: "食物，如 番茄牛腩",
                  "aria-label": "食物名称"
                }, null, 512), [
                  [c, O.value.name]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[24] || (s[24] = (e) => O.value.tags = e),
                  class: "input",
                  placeholder: "标签，如 家常 / 甜（可选）",
                  "aria-label": "食物标签"
                }, null, 512), [
                  [c, O.value.tags]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !O.value.name.trim()
                }, "加入菜单", 8, Nl)
              ], 32),
              t("ul", Ml, [
                (n(!0), i(m, null, _(r.value.food, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Fl, [
                    t("strong", null, a(e.name), 1),
                    t("span", Ll, a(e.tags || "—"), 1)
                  ]),
                  t("div", Dl, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => pe(e.id)
                    }, "删除", 8, Tl)
                  ])
                ]))), 128)),
                (r.value.food || []).length ? d("", !0) : (n(), i("li", El, "菜单还是空的"))
              ])
            ]),
            t("article", Ol, [
              t("div", ql, [
                s[91] || (s[91] = t("h2", { class: "card-title" }, "群聊黑话词云", -1)),
                t("span", Il, a(Ut.value.length), 1)
              ]),
              t("div", Pl, [
                (n(!0), i(m, null, _(Ut.value, (e) => (n(), i("span", {
                  key: e.topic,
                  class: "cloud-word",
                  style: yt({ fontSize: 12 + Math.min(18, Math.log(e.score + 1) * 6) + "px", opacity: 0.55 + Math.min(0.45, e.score / 20) })
                }, a(e.topic), 5))), 128)),
                Ut.value.length ? d("", !0) : (n(), i("span", Jl, "还没有群聊词云数据"))
              ])
            ])
          ])
        ]),
        t("section", Yl, [
          s[106] || (s[106] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", Bl, [
            t("article", Al, [
              t("div", Gl, [
                t("h2", zl, a(J.value ? "用户详情" : "用户"), 1),
                J.value ? (n(), i("button", {
                  key: 0,
                  class: "btn btn-tonal btn-sm",
                  onClick: ne
                }, "← 返回用户列表")) : (n(), i("span", Rl, a(xt.value.length) + " / " + a(r.value.relationships?.length || 0), 1))
              ]),
              J.value ? St.value ? (n(), i("div", ia, "加载中…")) : b.value ? (n(), i(m, { key: 2 }, [
                t("div", oa, [
                  t("span", ua, a((b.value.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", da, [
                    t("strong", null, a(b.value.user_id), 1),
                    t("span", ra, "阶段 " + a(b.value.relationship?.stage || "未知") + " · 好感 " + a(Math.round((b.value.relationship?.affinity || 0) * 100)) + "% · 最近 " + a(b.value.relationship?.last_seen || "—"), 1)
                  ])
                ]),
                t("nav", ca, [
                  (n(), i(m, null, _(le, (e) => t("button", {
                    key: e.key,
                    class: y(["tab", { active: Y.value === e.key }]),
                    onClick: (o) => Y.value = e.key
                  }, a(e.label), 11, pa)), 64))
                ]),
                Y.value === "overview" ? (n(), i("div", va, [
                  t("div", ma, [
                    t("div", _a, [
                      s[95] || (s[95] = t("span", null, "关系事件", -1)),
                      t("strong", null, a(b.value.counts?.ledger || 0), 1)
                    ]),
                    t("div", ba, [
                      s[96] || (s[96] = t("span", null, "主动候选", -1)),
                      t("strong", null, a(b.value.counts?.candidates || 0), 1)
                    ]),
                    t("div", ga, [
                      s[97] || (s[97] = t("span", null, "已投递", -1)),
                      t("strong", null, a(b.value.counts?.delivered || 0), 1)
                    ]),
                    t("div", ya, [
                      s[98] || (s[98] = t("span", null, "记忆条数", -1)),
                      t("strong", null, a(b.value.memories?.total || 0), 1)
                    ]),
                    t("div", ha, [
                      s[99] || (s[99] = t("span", null, "阶段主动上限", -1)),
                      t("strong", null, a(b.value.stage_limit ?? "不限"), 1)
                    ])
                  ]),
                  s[100] || (s[100] = t("h3", { class: "section-label" }, "最近关系事件", -1)),
                  t("ol", ka, [
                    (n(!0), i(m, null, _((b.value.ledger || []).slice(0, 5), (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a(D(e.created_at)), 1),
                      t("p", null, [
                        h(a(e.event_key) + " ", 1),
                        t("span", {
                          class: y(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        h(" · " + a(e.reason), 1)
                      ])
                    ]))), 128)),
                    (b.value.ledger || []).length ? d("", !0) : (n(), i("li", fa, "暂无关系事件"))
                  ])
                ])) : Y.value === "relationship" ? (n(), i("div", wa, [
                  t("div", Ca, [
                    t("div", Sa, [
                      t("i", {
                        style: yt({ width: wt(b.value.relationship?.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, a(Math.round((b.value.relationship?.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("div", xa, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[27] || (s[27] = (e) => Tt(b.value.user_id, 0.05))
                    }, "更亲近 +"),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[28] || (s[28] = (e) => Tt(b.value.user_id, -0.05))
                    }, "更疏远 −")
                  ]),
                  s[102] || (s[102] = t("h3", { class: "section-label" }, "事件账本", -1)),
                  t("ol", Ua, [
                    (n(!0), i(m, null, _(b.value.ledger, (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a(D(e.created_at)), 1),
                      t("p", null, [
                        t("strong", null, a(e.event_key), 1),
                        s[101] || (s[101] = h()),
                        t("span", {
                          class: y(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        h(" · " + a(e.reason) + " (" + a(e.channel) + ")", 1)
                      ])
                    ]))), 128)),
                    (b.value.ledger || []).length ? d("", !0) : (n(), i("li", $a, "暂无关系事件"))
                  ])
                ])) : Y.value === "proactive" ? (n(), i("div", Va, [
                  s[103] || (s[103] = t("h3", { class: "section-label" }, "候选队列", -1)),
                  t("ul", ja, [
                    (n(!0), i(m, null, _(b.value.proactive?.candidates || [], (e) => (n(), i("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", Na, [
                        t("strong", null, a(e.motive), 1),
                        t("span", Ma, a(e.content), 1),
                        t("span", Fa, a(e.status) + " · " + a(D(e.updated_at)), 1)
                      ]),
                      t("div", La, [
                        ["delivered", "cancelled"].includes(e.status) ? d("", !0) : (n(), i("button", {
                          key: 0,
                          class: "btn btn-danger btn-sm",
                          onClick: (o) => Et(e.id)
                        }, "取消", 8, Da))
                      ])
                    ]))), 128)),
                    (b.value.proactive?.candidates || []).length ? d("", !0) : (n(), i("li", Ta, "暂无主动记录"))
                  ]),
                  s[104] || (s[104] = t("h3", { class: "section-label" }, "投递记录", -1)),
                  t("ol", Ea, [
                    (n(!0), i(m, null, _(b.value.proactive?.receipts || [], (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a(D(e.created_at)), 1),
                      t("p", null, a(e.phase) + " · " + a(e.content), 1)
                    ]))), 128)),
                    (b.value.proactive?.receipts || []).length ? d("", !0) : (n(), i("li", Oa, "暂无投递"))
                  ])
                ])) : Y.value === "memory" ? (n(), i("div", qa, [
                  t("ul", Ia, [
                    (n(!0), i(m, null, _(b.value.memories?.items || [], (e) => (n(), i("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", Pa, [
                        t("strong", Ja, a(e.content), 1),
                        t("span", Ya, "scope " + a(e.scope) + " · 重要度 " + a(Math.round((e.importance || 0) * 100)) + "% · 召回 " + a(e.recall_count) + " 次", 1)
                      ]),
                      t("div", Ba, [
                        t("button", {
                          class: "btn btn-danger btn-sm",
                          onClick: (o) => ie(e.id)
                        }, "删除", 8, Aa)
                      ])
                    ]))), 128)),
                    (b.value.memories?.items || []).length ? d("", !0) : (n(), i("li", Ga, "没有与该用户相关的记忆"))
                  ])
                ])) : (n(), i("div", za, [
                  t("ol", Ra, [
                    (n(!0), i(m, null, _(b.value.audit || [], (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("span", {
                        class: y(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                        "aria-hidden": "true"
                      }, null, 2),
                      t("div", Ha, [
                        t("div", Qa, [
                          t("strong", null, a(e.kind), 1),
                          t("span", {
                            class: y(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                          }, a(e.outcome), 3),
                          t("time", null, a(D(e.created_at)), 1)
                        ]),
                        t("p", Ka, a(e.target), 1),
                        t("p", Wa, a(e.detail), 1)
                      ])
                    ]))), 128)),
                    (b.value.audit || []).length ? d("", !0) : (n(), i("li", Xa, "暂无诊断记录"))
                  ])
                ]))
              ], 64)) : d("", !0) : (n(), i(m, { key: 0 }, [
                t("div", Hl, [
                  u(t("input", {
                    "onUpdate:modelValue": s[25] || (s[25] = (e) => dt.value = e),
                    class: "input",
                    placeholder: "搜索用户 ID",
                    "aria-label": "搜索用户"
                  }, null, 512), [
                    [c, dt.value]
                  ]),
                  u(t("select", {
                    "onUpdate:modelValue": s[26] || (s[26] = (e) => rt.value = e),
                    class: "input user-stage",
                    "aria-label": "按阶段筛选"
                  }, [
                    s[93] || (s[93] = t("option", { value: "" }, "全部阶段", -1)),
                    (n(!0), i(m, null, _(ae.value, (e) => (n(), i("option", {
                      key: e,
                      value: e
                    }, a(e), 9, Ql))), 128))
                  ], 512), [
                    [Bt, rt.value]
                  ])
                ]),
                t("ul", Kl, [
                  (n(!0), i(m, null, _(xt.value, (e) => (n(), i("li", {
                    key: e.user_id,
                    class: "rel",
                    onClick: (o) => It(e.user_id)
                  }, [
                    t("span", Xl, a((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                    t("div", Zl, [
                      t("div", ta, [
                        t("strong", null, a(e.user_id), 1),
                        t("span", ea, a(e.stage), 1)
                      ]),
                      t("div", sa, [
                        t("div", la, [
                          t("i", {
                            style: yt({ width: wt(e.affinity) })
                          }, null, 4)
                        ]),
                        t("b", null, a(Math.round((e.affinity || 0) * 100)) + "%", 1)
                      ]),
                      t("span", aa, "最近互动：" + a(e.last_seen || "暂无"), 1)
                    ]),
                    s[94] || (s[94] = t("span", {
                      class: "rel-chevron",
                      "aria-hidden": "true"
                    }, "›", -1))
                  ], 8, Wl))), 128)),
                  xt.value.length ? d("", !0) : (n(), i("li", na, "没有匹配的用户"))
                ])
              ], 64))
            ]),
            t("article", Za, [
              s[105] || (s[105] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", tn, [
                (n(!0), i(m, null, _(r.value.persona_evolution, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item trait-item"
                }, [
                  t("div", en, [
                    t("strong", null, a(e.trait), 1),
                    t("span", sn, "支持 " + a(e.support_count) + " 次 · 置信度 " + a(Math.round((e.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", ln, a(e.value), 1)
                ]))), 128)),
                r.value.persona_evolution?.length ? d("", !0) : (n(), i("li", an, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", nn, [
          s[111] || (s[111] = t("h2", { class: "group-title" }, "学习", -1)),
          t("div", on, [
            t("article", un, [
              t("div", dn, [
                s[107] || (s[107] = t("h2", { class: "card-title" }, "技能学习", -1)),
                t("span", rn, a((r.value.skills || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(fe, ["prevent"])
              }, [
                u(t("input", {
                  "onUpdate:modelValue": s[29] || (s[29] = (e) => S.value.name = e),
                  class: "input",
                  placeholder: "技能，如 弹钢琴",
                  "aria-label": "技能名称"
                }, null, 512), [
                  [c, S.value.name]
                ]),
                t("div", cn, [
                  u(t("input", {
                    "onUpdate:modelValue": s[30] || (s[30] = (e) => S.value.category = e),
                    class: "input",
                    placeholder: "分类",
                    "aria-label": "分类"
                  }, null, 512), [
                    [c, S.value.category]
                  ]),
                  u(t("input", {
                    "onUpdate:modelValue": s[31] || (s[31] = (e) => S.value.level = e),
                    class: "input tiny",
                    type: "number",
                    min: "1",
                    max: "10",
                    "aria-label": "等级"
                  }, null, 512), [
                    [
                      c,
                      S.value.level,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[32] || (s[32] = (e) => S.value.keywords = e),
                  class: "input",
                  placeholder: "关键词（逗号分隔，可选）",
                  "aria-label": "关键词"
                }, null, 512), [
                  [c, S.value.keywords]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !S.value.name.trim()
                }, "添加技能", 8, pn)
              ], 32),
              t("ul", vn, [
                (n(!0), i(m, null, _(r.value.skills, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", mn, [
                    t("div", _n, [
                      t("strong", null, a(e.name), 1),
                      t("span", bn, "Lv." + a(e.level), 1),
                      t("span", gn, a(e.category), 1)
                    ]),
                    e.keywords ? (n(), i("span", yn, a(e.keywords), 1)) : d("", !0)
                  ]),
                  t("div", hn, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => we(e.id)
                    }, "删除", 8, kn)
                  ])
                ]))), 128)),
                (r.value.skills || []).length ? d("", !0) : (n(), i("li", fn, "还没有技能"))
              ])
            ]),
            t("article", wn, [
              t("div", Cn, [
                s[108] || (s[108] = t("h2", { class: "card-title" }, "表达学习", -1)),
                t("span", Sn, "待审 " + a(_t.value.pending), 1)
              ]),
              t("div", xn, [
                t("button", {
                  class: y(["btn btn-sm", B.value === "pending" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[33] || (s[33] = (e) => B.value = "pending")
                }, "待审 " + a(_t.value.pending), 3),
                t("button", {
                  class: y(["btn btn-sm", B.value === "approved" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[34] || (s[34] = (e) => B.value = "approved")
                }, "已用 " + a(_t.value.approved), 3),
                t("button", {
                  class: y(["btn btn-sm", B.value === "rejected" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[35] || (s[35] = (e) => B.value = "rejected")
                }, "已拒 " + a(_t.value.rejected), 3)
              ]),
              t("form", {
                class: "slang-form",
                onSubmit: x(Ce, ["prevent"])
              }, [
                u(t("input", {
                  "onUpdate:modelValue": s[36] || (s[36] = (e) => q.value.text = e),
                  class: "input",
                  placeholder: "表达，如 晚安呀",
                  "aria-label": "表达内容"
                }, null, 512), [
                  [c, q.value.text]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[37] || (s[37] = (e) => q.value.scene = e),
                  class: "input scene-input",
                  placeholder: "场景",
                  "aria-label": "场景"
                }, null, 512), [
                  [c, q.value.scene]
                ]),
                t("button", {
                  class: "btn btn-primary btn-sm",
                  type: "submit",
                  disabled: !q.value.text.trim()
                }, "入库", 8, Un)
              ], 32),
              t("ul", $n, [
                (n(!0), i(m, null, _(Jt.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Vn, [
                    t("strong", null, a(e.text), 1),
                    t("span", jn, a(e.scene || "通用") + " · " + a(e.source), 1)
                  ]),
                  t("div", Nn, [
                    e.status === "pending" ? (n(), i("button", {
                      key: 0,
                      class: "btn btn-primary btn-sm",
                      onClick: (o) => Yt(e.id, !0)
                    }, "采用", 8, Mn)) : d("", !0),
                    e.status === "pending" ? (n(), i("button", {
                      key: 1,
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => Yt(e.id, !1)
                    }, "拒绝", 8, Fn)) : d("", !0),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => Se(e.id)
                    }, "删除", 8, Ln)
                  ])
                ]))), 128)),
                Jt.value.length ? d("", !0) : (n(), i("li", Dn, "该分类下没有表达"))
              ])
            ]),
            t("article", Tn, [
              t("div", En, [
                s[109] || (s[109] = t("h2", { class: "card-title" }, "社交关系网", -1)),
                t("span", On, a((r.value.social_nodes || []).length) + " 人 · " + a((r.value.social_edges || []).length) + " 关系", 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(xe, ["prevent"])
              }, [
                u(t("input", {
                  "onUpdate:modelValue": s[38] || (s[38] = (e) => M.value.user_id = e),
                  class: "input",
                  placeholder: "用户 ID",
                  "aria-label": "用户 ID"
                }, null, 512), [
                  [c, M.value.user_id]
                ]),
                t("div", qn, [
                  u(t("input", {
                    "onUpdate:modelValue": s[39] || (s[39] = (e) => M.value.name = e),
                    class: "input",
                    placeholder: "称呼（可选）",
                    "aria-label": "称呼"
                  }, null, 512), [
                    [c, M.value.name]
                  ]),
                  u(t("input", {
                    "onUpdate:modelValue": s[40] || (s[40] = (e) => M.value.tags = e),
                    class: "input",
                    placeholder: "标签（可选）",
                    "aria-label": "标签"
                  }, null, 512), [
                    [c, M.value.tags]
                  ])
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !M.value.user_id.trim()
                }, "加入关系网", 8, In)
              ], 32),
              t("ul", Pn, [
                (n(!0), i(m, null, _(r.value.social_nodes, (e) => (n(), i("li", {
                  key: e.user_id,
                  class: "item"
                }, [
                  t("div", Jn, [
                    t("strong", null, a(e.name || e.user_id), 1),
                    t("span", Yn, [
                      h(a(e.user_id), 1),
                      e.tags ? (n(), i(m, { key: 0 }, [
                        h(" · " + a(e.tags), 1)
                      ], 64)) : d("", !0)
                    ])
                  ])
                ]))), 128)),
                (r.value.social_nodes || []).length ? d("", !0) : (n(), i("li", Bn, "关系网还是空的"))
              ]),
              s[110] || (s[110] = t("h3", { class: "section-label" }, "关系连线", -1)),
              t("form", {
                class: "form-row",
                onSubmit: x(Ue, ["prevent"])
              }, [
                u(t("input", {
                  "onUpdate:modelValue": s[41] || (s[41] = (e) => U.value.source_id = e),
                  class: "input",
                  placeholder: "A",
                  "aria-label": "关系起点"
                }, null, 512), [
                  [c, U.value.source_id]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[42] || (s[42] = (e) => U.value.target_id = e),
                  class: "input",
                  placeholder: "B",
                  "aria-label": "关系终点"
                }, null, 512), [
                  [c, U.value.target_id]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[43] || (s[43] = (e) => U.value.relation = e),
                  class: "input",
                  placeholder: "关系，如 同学",
                  "aria-label": "关系"
                }, null, 512), [
                  [c, U.value.relation]
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  type: "submit",
                  disabled: !U.value.source_id.trim() || !U.value.target_id.trim()
                }, "连线", 8, An)
              ], 32),
              t("ul", Gn, [
                (n(!0), i(m, null, _(r.value.social_edges, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", zn, [
                    t("strong", null, a(e.source_id) + " → " + a(e.target_id), 1),
                    t("span", Rn, a(e.relation), 1)
                  ]),
                  t("div", Hn, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => $e(e.id)
                    }, "删除", 8, Qn)
                  ])
                ]))), 128)),
                (r.value.social_edges || []).length ? d("", !0) : (n(), i("li", Kn, "还没有关系连线"))
              ])
            ])
          ])
        ]),
        t("section", Wn, [
          s[121] || (s[121] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", Xn, [
            t("article", Zn, [
              t("div", ti, [
                s[112] || (s[112] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", ei, "待投递 " + a(it.value.length), 1)
              ]),
              t("div", si, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Kt
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: ot.value,
                  onClick: Wt
                }, a(ot.value ? "检查中…" : "立即检查投递"), 9, li)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(Ht, ["prevent"])
              }, [
                u(t("input", {
                  "onUpdate:modelValue": s[44] || (s[44] = (e) => k.value.target = e),
                  class: "input",
                  placeholder: "目标：session:<会话ID> / user:<QQ> / group:<群号>",
                  "aria-label": "主动对象"
                }, null, 512), [
                  [c, k.value.target]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[45] || (s[45] = (e) => k.value.motive = e),
                  class: "input",
                  placeholder: "动机，如 care / reminder",
                  "aria-label": "动机"
                }, null, 512), [
                  [c, k.value.motive]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[46] || (s[46] = (e) => k.value.preferred_at = e),
                  class: "input",
                  placeholder: "期望时间（可选，ISO）",
                  "aria-label": "期望时间"
                }, null, 512), [
                  [c, k.value.preferred_at]
                ]),
                u(t("textarea", {
                  "onUpdate:modelValue": s[47] || (s[47] = (e) => k.value.content = e),
                  class: "input area",
                  placeholder: "想说的内容…"
                }, null, 512), [
                  [c, k.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !k.value.target.trim() || !k.value.content.trim()
                }, "创建候选", 8, ai)
              ], 32),
              s[117] || (s[117] = t("h3", { class: "section-label" }, "候选队列", -1)),
              t("ul", ni, [
                (n(!0), i(m, null, _(it.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ii, [
                    t("strong", null, a(e.target) + " · " + a(e.motive), 1),
                    t("span", oi, a(e.content), 1),
                    t("span", ui, "状态 " + a(e.status) + " · " + a(D(e.created_at)), 1)
                  ]),
                  t("div", di, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => Et(e.id)
                    }, "取消", 8, ri)
                  ])
                ]))), 128)),
                it.value.length ? d("", !0) : (n(), i("li", ci, "没有待投递候选"))
              ]),
              s[118] || (s[118] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", pi, [
                t("label", vi, [
                  s[113] || (s[113] = t("span", null, "每日上限", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[48] || (s[48] = (e) => w.value.daily_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      w.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", mi, [
                  s[114] || (s[114] = t("span", null, "单人上限", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[49] || (s[49] = (e) => w.value.per_target_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      w.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", _i, [
                  s[115] || (s[115] = t("span", null, "免打扰起", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[50] || (s[50] = (e) => w.value.quiet_start = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      w.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", bi, [
                  s[116] || (s[116] = t("span", null, "免打扰止", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[51] || (s[51] = (e) => w.value.quiet_end = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      w.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Qt
                }, "保存策略")
              ]),
              s[119] || (s[119] = t("p", { class: "helper-inline" }, [
                h("免打扰起止相同即关闭；target 用 "),
                t("code", null, "session:<会话ID>"),
                h(" 可直接发到对话。")
              ], -1)),
              s[120] || (s[120] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", gi, [
                (n(!0), i(m, null, _(kt.value, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, a(D(e.created_at)), 1),
                  t("p", null, a(e.phase) + " · " + a(e.content), 1)
                ]))), 128)),
                kt.value.length ? d("", !0) : (n(), i("li", yi, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", hi, [
          s[129] || (s[129] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", ki, [
            t("article", fi, [
              t("div", wi, [
                s[122] || (s[122] = t("h2", { class: "card-title" }, "群聊管理", -1)),
                t("span", Ci, a(pt.value.length), 1)
              ]),
              t("form", {
                class: "group-form",
                onSubmit: x(me, ["prevent"])
              }, [
                u(t("input", {
                  "onUpdate:modelValue": s[52] || (s[52] = (e) => N.value.group_id = e),
                  class: "input",
                  placeholder: "群号",
                  "aria-label": "群号"
                }, null, 512), [
                  [c, N.value.group_id]
                ]),
                u(t("select", {
                  "onUpdate:modelValue": s[53] || (s[53] = (e) => N.value.policy = e),
                  class: "input policy-select",
                  "aria-label": "策略"
                }, [...s[123] || (s[123] = [
                  t("option", { value: "observe" }, "观察", -1),
                  t("option", { value: "whitelist" }, "白名单", -1),
                  t("option", { value: "blacklist" }, "黑名单", -1)
                ])], 512), [
                  [Bt, N.value.policy]
                ]),
                u(t("input", {
                  "onUpdate:modelValue": s[54] || (s[54] = (e) => N.value.alias = e),
                  class: "input",
                  placeholder: "备注名（可选）",
                  "aria-label": "备注名"
                }, null, 512), [
                  [c, N.value.alias]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !N.value.group_id.trim()
                }, "添加群", 8, Si)
              ], 32),
              t("ul", xi, [
                (n(!0), i(m, null, _(pt.value, (e) => (n(), i("li", {
                  key: e.group_id,
                  class: "item group-item"
                }, [
                  t("div", Ui, [
                    t("div", $i, [
                      t("strong", null, a(e.group_id), 1),
                      e.alias ? (n(), i("span", Vi, a(e.alias), 1)) : d("", !0),
                      t("span", {
                        class: y(["chip", e.policy === "blacklist" ? "chip-warn" : e.policy === "whitelist" ? "chip-ok" : "muted"])
                      }, a(e.policy), 3)
                    ]),
                    t("span", ji, a(e.observations) + " 条观察 · " + a(e.topics) + " 个话题", 1),
                    P.value === e.group_id ? (n(), i("div", Ni, [
                      s[126] || (s[126] = t("h4", { class: "section-label" }, "黑话 / 话题", -1)),
                      t("div", Mi, [
                        (n(!0), i(m, null, _($t.value[e.group_id] || [], (o) => (n(), i("span", {
                          key: o.topic,
                          class: "chip muted"
                        }, [
                          h(a(o.topic) + " · " + a(Math.round(o.score)), 1),
                          t("button", {
                            class: "chip-x",
                            onClick: (A) => ke(e.group_id, o.topic)
                          }, "×", 8, Fi)
                        ]))), 128)),
                        ($t.value[e.group_id] || []).length ? d("", !0) : (n(), i("span", Li, "暂无"))
                      ]),
                      t("form", {
                        class: "slang-form",
                        onSubmit: x((o) => he(e.group_id), ["prevent"])
                      }, [
                        u(t("input", {
                          "onUpdate:modelValue": (o) => vt.value[e.group_id] = o,
                          class: "input",
                          placeholder: "新增黑话 / 话题",
                          "aria-label": "新增黑话"
                        }, null, 8, Ti), [
                          [c, vt.value[e.group_id]]
                        ]),
                        s[124] || (s[124] = t("button", {
                          class: "btn btn-tonal btn-sm",
                          type: "submit"
                        }, "添加", -1))
                      ], 40, Di),
                      s[127] || (s[127] = t("h4", { class: "section-label" }, "成员安全", -1)),
                      t("ul", Ei, [
                        (n(!0), i(m, null, _(Vt.value[e.group_id] || [], (o) => (n(), i("li", {
                          key: o.user_id,
                          class: "member-row"
                        }, [
                          t("span", Oi, a(o.user_id), 1),
                          t("span", qi, a(o.messages) + " 条 · " + a(D(o.last_at)), 1),
                          t("select", {
                            class: "input flag-select",
                            value: o.flag,
                            onChange: (A) => ge(e.group_id, o.user_id, A)
                          }, [...s[125] || (s[125] = [
                            t("option", { value: "watch" }, "关注", -1),
                            t("option", { value: "allow" }, "放行", -1),
                            t("option", { value: "mute" }, "禁言", -1)
                          ])], 40, Ii)
                        ]))), 128)),
                        (Vt.value[e.group_id] || []).length ? d("", !0) : (n(), i("li", Pi, "暂无成员观察"))
                      ])
                    ])) : d("", !0)
                  ]),
                  t("div", Ji, [
                    t("select", {
                      class: "input policy-select",
                      value: e.policy,
                      onChange: (o) => be(e, o)
                    }, [...s[128] || (s[128] = [
                      t("option", { value: "observe" }, "观察", -1),
                      t("option", { value: "whitelist" }, "白名单", -1),
                      t("option", { value: "blacklist" }, "黑名单", -1)
                    ])], 40, Yi),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => ye(e.group_id)
                    }, a(P.value === e.group_id ? "收起" : "管理"), 9, Bi),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => _e(e.group_id)
                    }, "删除", 8, Ai)
                  ])
                ]))), 128)),
                pt.value.length ? d("", !0) : (n(), i("li", Gi, "还没有群记录。收到群消息或在上面添加。"))
              ])
            ])
          ])
        ]),
        t("section", zi, [
          s[145] || (s[145] = t("h2", { class: "group-title" }, "配置", -1)),
          t("div", Ri, [
            t("article", Hi, [
              t("div", { class: "card-head" }, [
                s[130] || (s[130] = t("h2", { class: "card-title" }, "运行设置", -1)),
                t("button", {
                  class: "btn btn-primary btn-sm",
                  onClick: je
                }, "保存")
              ]),
              t("div", Qi, [
                t("label", Ki, [
                  s[131] || (s[131] = t("span", null, "每日主动上限", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[55] || (s[55] = (e) => g.value.proactive_daily_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      g.value.proactive_daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Wi, [
                  s[132] || (s[132] = t("span", null, "单人上限", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[56] || (s[56] = (e) => g.value.proactive_target_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      g.value.proactive_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Xi, [
                  s[133] || (s[133] = t("span", null, "免打扰起", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[57] || (s[57] = (e) => g.value.quiet_start = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      g.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Zi, [
                  s[134] || (s[134] = t("span", null, "免打扰止", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[58] || (s[58] = (e) => g.value.quiet_end = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      g.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", to, [
                  s[135] || (s[135] = t("span", null, "空闲分钟", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[59] || (s[59] = (e) => g.value.idle_minutes = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      g.value.idle_minutes,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", eo, [
                  s[136] || (s[136] = t("span", null, "最小间隔(分)", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[60] || (s[60] = (e) => g.value.min_interval_minutes = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      g.value.min_interval_minutes,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", so, [
                  s[137] || (s[137] = t("span", null, "检查间隔(秒)", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[61] || (s[61] = (e) => g.value.check_interval_seconds = e),
                    type: "number",
                    min: "60",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      g.value.check_interval_seconds,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", lo, [
                  s[138] || (s[138] = t("span", null, "连发上限", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[62] || (s[62] = (e) => g.value.burst_max = e),
                    type: "number",
                    min: "1",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      g.value.burst_max,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", ao, [
                  s[139] || (s[139] = t("span", null, "每日 Token", -1)),
                  u(t("input", {
                    "onUpdate:modelValue": s[63] || (s[63] = (e) => g.value.daily_token_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      c,
                      g.value.daily_token_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              t("div", no, [
                t("label", io, [
                  u(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[64] || (s[64] = (e) => g.value.enable_proactive = e)
                  }, null, 512), [
                    [gt, g.value.enable_proactive]
                  ]),
                  s[140] || (s[140] = h(" 启用主动消息", -1))
                ]),
                t("label", oo, [
                  u(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[65] || (s[65] = (e) => g.value.enable_group_observe = e)
                  }, null, 512), [
                    [gt, g.value.enable_group_observe]
                  ]),
                  s[141] || (s[141] = h(" 群聊观察", -1))
                ]),
                t("label", uo, [
                  u(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[66] || (s[66] = (e) => g.value.enable_dream = e)
                  }, null, 512), [
                    [gt, g.value.enable_dream]
                  ]),
                  s[142] || (s[142] = h(" 梦境生成", -1))
                ])
              ])
            ]),
            t("article", ro, [
              t("div", { class: "card-head" }, [
                s[143] || (s[143] = t("h2", { class: "card-title" }, "数据导入导出", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Ne
                }, "导出 JSON")
              ]),
              u(t("textarea", {
                "onUpdate:modelValue": s[67] || (s[67] = (e) => R.value = e),
                class: "input area",
                placeholder: "粘贴导出的配置 JSON 后点导入…"
              }, null, 512), [
                [c, R.value]
              ]),
              t("button", {
                class: "btn btn-primary btn-sm",
                onClick: Me,
                disabled: !R.value.trim()
              }, "导入", 8, co),
              s[144] || (s[144] = t("p", { class: "helper-inline" }, "合并设置、目标、菜单、技能、表达、重要日期等，不会删除已有数据。", -1))
            ])
          ])
        ]),
        t("section", po, [
          s[152] || (s[152] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", vo, [
            t("article", mo, [
              t("div", _o, [
                s[146] || (s[146] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", bo, a(L.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", go, [
                t("div", yo, [
                  t("strong", null, a((L.value?.total_tokens || 0).toLocaleString()), 1),
                  s[147] || (s[147] = t("span", null, "总 Token", -1))
                ]),
                t("div", ho, [
                  t("strong", null, a((L.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  s[148] || (s[148] = t("span", null, "输入", -1))
                ]),
                t("div", ko, [
                  t("strong", null, a((L.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  s[149] || (s[149] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", fo, [
                (n(!0), i(m, null, _(L.value?.by_model || {}, (e, o) => (n(), i("li", {
                  key: o,
                  class: "item"
                }, [
                  t("div", wo, [
                    t("strong", null, a(o), 1),
                    t("span", Co, a((e.total || 0).toLocaleString()) + " tokens · " + a(e.count) + " 次", 1)
                  ])
                ]))), 128)),
                !L.value || !Object.keys(L.value.by_model || {}).length ? (n(), i("li", So, "暂无用量记录")) : d("", !0)
              ])
            ]),
            t("article", xo, [
              t("div", { class: "card-head" }, [
                s[150] || (s[150] = t("h2", { class: "card-title" }, "排障检查", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Fe
                }, "运行诊断")
              ]),
              t("ul", Uo, [
                (n(!0), i(m, null, _(Z.value?.checks || [], (e) => (n(), i("li", {
                  key: e.name,
                  class: "item"
                }, [
                  t("div", $o, [
                    t("strong", null, a(e.name), 1),
                    t("span", Vo, a(e.detail), 1)
                  ]),
                  t("span", {
                    class: y(["chip", e.status === "ok" ? "chip-ok" : e.status === "warn" ? "chip-warn" : "muted"])
                  }, a(e.status), 3)
                ]))), 128)),
                Z.value ? d("", !0) : (n(), i("li", jo, "点击“运行诊断”查看检查项"))
              ]),
              Z.value ? (n(), i("div", No, [
                (n(!0), i(m, null, _(Z.value.counts, (e, o) => (n(), i("div", {
                  key: o,
                  class: "kv"
                }, [
                  t("span", null, a(o), 1),
                  t("strong", null, a(e), 1)
                ]))), 128))
              ])) : d("", !0)
            ]),
            t("article", Mo, [
              t("div", Fo, [
                s[151] || (s[151] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: s[68] || (s[68] = (e) => p("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", Lo, [
                (n(!0), i(m, null, _(r.value.audit, (e) => (n(), i("li", {
                  key: e.at + e.kind
                }, [
                  t("span", {
                    class: y(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", Do, [
                    t("div", To, [
                      t("strong", null, a(e.kind), 1),
                      t("span", {
                        class: y(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, a(e.outcome), 3),
                      t("time", null, a(e.at), 1)
                    ]),
                    t("p", Eo, a(e.target), 1),
                    t("p", Oo, a(e.detail), 1)
                  ])
                ]))), 128)),
                r.value.audit?.length ? d("", !0) : (n(), i("li", qo, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), Bo = /* @__PURE__ */ Ee(Io, [["__scopeId", "data-v-cc0ee331"]]);
export {
  Bo as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-cc0ee331]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-cc0ee331]{max-width:1180px;margin:0 auto}.page-header[data-v-cc0ee331]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-cc0ee331]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-cc0ee331]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-cc0ee331]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-cc0ee331]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-cc0ee331]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-cc0ee331]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-cc0ee331]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-cc0ee331]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-cc0ee331]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-cc0ee331]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-cc0ee331]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-cc0ee331]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-cc0ee331]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-cc0ee331]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-cc0ee331]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-cc0ee331]{display:flex;align-items:center;gap:10px}.stat-label[data-v-cc0ee331]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-cc0ee331]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-cc0ee331]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-cc0ee331]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-cc0ee331]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-cc0ee331]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-cc0ee331]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-cc0ee331]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-cc0ee331]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-cc0ee331]{margin-bottom:var(--space-lg)}.group-title[data-v-cc0ee331]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-cc0ee331]{margin-bottom:0}.card[data-v-cc0ee331]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-cc0ee331]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-cc0ee331]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-cc0ee331]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-cc0ee331]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-cc0ee331]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-cc0ee331]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-cc0ee331]{background:#fff1dc;color:#7a4400}.input[data-v-cc0ee331]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-cc0ee331]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-cc0ee331]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-cc0ee331]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-cc0ee331]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-cc0ee331]{grid-column:1/-1}.stack-form[data-v-cc0ee331]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-cc0ee331]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-cc0ee331]{align-self:flex-start}.item-list[data-v-cc0ee331],.rel-list[data-v-cc0ee331],.feed[data-v-cc0ee331],.timeline[data-v-cc0ee331]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-cc0ee331]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-cc0ee331]{align-items:flex-start}.item[data-v-cc0ee331]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-cc0ee331]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-cc0ee331]{font-size:14px;font-weight:600}.item-main strong.done[data-v-cc0ee331]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-cc0ee331]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-cc0ee331]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-cc0ee331]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-cc0ee331]{background:transparent;border:0}.check-label[data-v-cc0ee331]{display:flex;align-items:center}.check-line[data-v-cc0ee331]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-cc0ee331]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-cc0ee331]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-cc0ee331]{background:#fff1dc;color:#7a4400}.head-actions[data-v-cc0ee331]{display:flex;gap:8px}.item-row[data-v-cc0ee331]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hint-inline[data-v-cc0ee331]{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}.helper-inline[data-v-cc0ee331]{margin:8px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.helper-inline code[data-v-cc0ee331]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:2px 6px;border-radius:6px}.check-label input[data-v-cc0ee331]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-cc0ee331]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-cc0ee331]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-cc0ee331]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-cc0ee331]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-cc0ee331],.rel-meter[data-v-cc0ee331]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-cc0ee331]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-cc0ee331]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-cc0ee331]{font-size:12px}.rel-actions[data-v-cc0ee331]{display:flex;gap:4px}.ledger[data-v-cc0ee331]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.user-tools[data-v-cc0ee331]{display:flex;gap:10px;margin-bottom:12px}.user-stage[data-v-cc0ee331]{width:130px;flex:0 0 auto}.rel[data-v-cc0ee331]{cursor:pointer}.rel-chevron[data-v-cc0ee331]{font-size:20px;color:var(--md-on-surface-variant);flex-shrink:0}.detail-head[data-v-cc0ee331]{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}.tabs[data-v-cc0ee331]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tab[data-v-cc0ee331]{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:600 12.5px/1 inherit;cursor:pointer}.tab[data-v-cc0ee331]:hover{border-color:var(--md-primary)}.tab.active[data-v-cc0ee331]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}.detail-body[data-v-cc0ee331]{display:flex;flex-direction:column;gap:6px}.kv-grid[data-v-cc0ee331]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.kv[data-v-cc0ee331]{background:var(--md-surface-container-low);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:4px}.kv span[data-v-cc0ee331]{font-size:12px;color:var(--md-on-surface-variant)}.kv strong[data-v-cc0ee331]{font-size:20px;font-weight:700}.rel-meter.big[data-v-cc0ee331]{margin:6px 0}.rel-meter.big b[data-v-cc0ee331]{font-size:15px}.mem-text[data-v-cc0ee331]{font-weight:500!important;line-height:1.6}.cal-card[data-v-cc0ee331]{grid-column:1/-1}.cal-month[data-v-cc0ee331]{font-size:14px;font-weight:700;min-width:76px;text-align:center}.cal-week[data-v-cc0ee331]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}.cal-week span[data-v-cc0ee331]{text-align:center;font-size:11px;color:var(--md-on-surface-variant);font-weight:600}.cal-grid[data-v-cc0ee331]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-cell[data-v-cc0ee331]{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}.cal-cell.empty[data-v-cc0ee331]{border-color:transparent;background:transparent}.cal-cell.today[data-v-cc0ee331]{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 18%,transparent)}.cal-cell.has[data-v-cc0ee331]{background:var(--md-surface-container-low)}.cal-day[data-v-cc0ee331]{font-size:12px;font-weight:700;color:var(--md-on-surface-variant)}.cal-chip[data-v-cc0ee331]{font-size:10.5px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-more[data-v-cc0ee331]{font-size:10px;color:var(--md-on-surface-variant)}.cal-warn[data-v-cc0ee331]{margin:12px 0 0;padding:8px 12px;border-radius:10px;background:#fff1dc;color:#7a4400;font-size:12.5px}.cloud[data-v-cc0ee331]{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}.cloud-word[data-v-cc0ee331]{font-weight:700;color:var(--md-primary);line-height:1.2}.group-form[data-v-cc0ee331]{display:grid;grid-template-columns:1fr 120px 1fr auto;gap:10px;margin-bottom:12px}.policy-select[data-v-cc0ee331]{width:auto;height:34px;flex:0 0 auto}.flag-select[data-v-cc0ee331]{width:auto;height:30px;flex:0 0 auto;font-size:12px}.slang-form[data-v-cc0ee331]{display:flex;gap:8px;margin:8px 0}.slang-form .input[data-v-cc0ee331]{height:34px}.chip-x[data-v-cc0ee331]{border:0;background:transparent;color:inherit;cursor:pointer;font-weight:700;margin-left:4px}.member-list[data-v-cc0ee331]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.member-row[data-v-cc0ee331]{display:flex;align-items:center;gap:10px;font-size:12.5px}.member-id[data-v-cc0ee331]{font-weight:600;min-width:80px}.member-row .item-meta[data-v-cc0ee331]{flex:1}.form-row[data-v-cc0ee331]{display:flex;gap:10px}.form-row .input[data-v-cc0ee331]{flex:1}.scene-input[data-v-cc0ee331]{width:120px;flex:0 0 auto}.settings-grid[data-v-cc0ee331]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px}.toggle-row[data-v-cc0ee331]{display:flex;gap:16px;flex-wrap:wrap}.select span[data-v-cc0ee331]{white-space:nowrap}.book[data-v-cc0ee331]{border:1px solid var(--md-outline-variant);border-radius:14px;background:linear-gradient(180deg,var(--md-surface-container-lowest),var(--md-surface-container-low));padding:16px 18px}.book-nav[data-v-cc0ee331]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.book-date[data-v-cc0ee331]{width:auto;height:34px;flex:0 0 auto}.book-page[data-v-cc0ee331]{min-height:120px;border-top:1px solid var(--md-outline-variant);padding-top:14px}.book-heading[data-v-cc0ee331]{margin:0 0 10px;font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--md-on-surface-variant);letter-spacing:.02em}.book-body[data-v-cc0ee331]{display:flex;flex-direction:column;gap:10px}.book-body p[data-v-cc0ee331]{margin:0;font-size:14px;line-height:1.95;text-indent:2em;color:var(--md-on-surface);white-space:pre-wrap;overflow-wrap:anywhere}.book-empty[data-v-cc0ee331]{margin:0;font-size:13px;color:var(--md-on-surface-variant);font-style:italic}.diary-manual[data-v-cc0ee331]{margin-top:14px;border-top:1px dashed var(--md-outline-variant);padding-top:12px}.feed li[data-v-cc0ee331]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-cc0ee331]{padding:8px 12px}.feed time[data-v-cc0ee331],.timeline time[data-v-cc0ee331]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-cc0ee331]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-cc0ee331]{color:var(--md-success);font-weight:700}.neg[data-v-cc0ee331]{color:var(--md-error);font-weight:700}.policy[data-v-cc0ee331]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-cc0ee331]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-cc0ee331]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-cc0ee331]{margin-top:6px}.audit-card[data-v-cc0ee331]{margin-bottom:var(--space-lg)}.usage-grid[data-v-cc0ee331]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-cc0ee331]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-cc0ee331]{font-size:20px;font-weight:700}.usage-item span[data-v-cc0ee331]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-cc0ee331]{position:relative}.timeline li[data-v-cc0ee331]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-cc0ee331]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-cc0ee331]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-cc0ee331]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-cc0ee331]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-cc0ee331]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-cc0ee331]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-cc0ee331]{font-size:13.5px;font-weight:650}.tl-detail[data-v-cc0ee331]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-cc0ee331]{grid-template-columns:repeat(2,1fr)}.grid[data-v-cc0ee331],.agenda-form[data-v-cc0ee331]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-cc0ee331]{padding:var(--space-lg)}.header-actions[data-v-cc0ee331]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
