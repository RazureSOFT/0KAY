import { defineComponent as Pe, ref as v, computed as V, onMounted as Je, openBlock as n, createElementBlock as i, createElementVNode as t, toDisplayString as a, createCommentVNode as u, createStaticVNode as yt, normalizeClass as y, withModifiers as x, withDirectives as d, vModelText as r, Fragment as m, renderList as _, createTextVNode as k, vModelCheckbox as ht, normalizeStyle as kt, vModelSelect as Ft } from "vue";
import { u as Ye, _ as Be } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const Ae = { class: "page" }, Ge = { class: "page-inner" }, ze = { class: "page-header" }, Re = { class: "header-actions" }, He = ["disabled"], We = ["disabled"], Ke = {
  key: 0,
  class: "error-banner"
}, Qe = {
  key: 1,
  class: "notice"
}, Xe = { class: "stat-grid" }, Ze = { class: "stat-card" }, ts = { class: "stat-value" }, es = { class: "stat-card" }, ss = { class: "stat-value" }, ls = { class: "stat-card" }, as = { class: "stat-value" }, ns = { class: "stat-hint" }, is = { class: "stat-card" }, os = { class: "stat-value" }, ds = { class: "life-state" }, us = { class: "state-pill" }, rs = {
  key: 0,
  class: "state-pill"
}, cs = { class: "group" }, ps = { class: "grid" }, vs = { class: "card" }, ms = { class: "item-list" }, _s = { class: "item-main" }, bs = { class: "item-meta" }, gs = { class: "item-actions" }, ys = ["onClick"], hs = ["onClick"], ks = {
  key: 0,
  class: "list-empty"
}, fs = { class: "item-list" }, ws = { class: "item-main" }, Cs = { class: "item-row" }, Ss = { class: "item-meta" }, xs = {
  key: 0,
  class: "list-empty"
}, Us = { class: "card" }, $s = { class: "card-head" }, Vs = { class: "chip muted" }, js = { class: "check-line" }, Ns = ["disabled"], Ms = { class: "item-list" }, Fs = { class: "item-main" }, Ls = { class: "item-meta" }, Ds = { class: "item-actions" }, Ts = ["onClick"], Es = {
  key: 0,
  class: "list-empty"
}, Os = { class: "card" }, qs = { class: "card-head" }, Is = { class: "head-actions" }, Ps = ["disabled"], Js = { class: "book" }, Ys = { class: "book-nav" }, Bs = ["disabled"], As = ["disabled"], Gs = { class: "book-page" }, zs = { class: "book-heading" }, Rs = {
  key: 0,
  class: "book-body"
}, Hs = {
  key: 1,
  class: "book-empty"
}, Ws = { class: "card" }, Ks = { class: "card-head" }, Qs = { class: "head-actions" }, Xs = ["disabled"], Zs = { class: "feed" }, tl = {
  key: 0,
  class: "list-empty plain"
}, el = { class: "group" }, sl = { class: "grid" }, ll = { class: "card cal-card" }, al = { class: "card-head" }, nl = { class: "head-actions" }, il = { class: "cal-month" }, ol = { class: "cal-week" }, dl = { class: "cal-grid" }, ul = {
  key: 0,
  class: "cal-day"
}, rl = ["title"], cl = {
  key: 1,
  class: "cal-more"
}, pl = {
  key: 0,
  class: "cal-warn"
}, vl = { class: "section-label" }, ml = { class: "item-list" }, _l = { class: "item-main" }, bl = { class: "item-meta" }, gl = { class: "item-actions" }, yl = ["onClick"], hl = ["onClick"], kl = {
  key: 0,
  class: "list-empty"
}, fl = { class: "card" }, wl = { class: "card-head" }, Cl = { class: "chip muted" }, Sl = ["disabled"], xl = { class: "item-list" }, Ul = { class: "item-main" }, $l = { class: "item-row" }, Vl = { class: "meter-bar" }, jl = {
  key: 0,
  class: "item-meta"
}, Nl = { class: "item-actions" }, Ml = ["onClick"], Fl = ["onClick"], Ll = {
  key: 0,
  class: "list-empty"
}, Dl = { class: "card" }, Tl = { class: "card-head" }, El = { class: "chip muted" }, Ol = ["disabled"], ql = { class: "item-list" }, Il = { class: "item-main" }, Pl = { class: "item-meta" }, Jl = { class: "item-actions" }, Yl = ["onClick"], Bl = {
  key: 0,
  class: "list-empty"
}, Al = { class: "card" }, Gl = { class: "card-head" }, zl = { class: "chip muted" }, Rl = { class: "cloud" }, Hl = {
  key: 0,
  class: "list-empty plain"
}, Wl = { class: "group" }, Kl = { class: "grid" }, Ql = { class: "card" }, Xl = { class: "card-head" }, Zl = { class: "card-title" }, ta = {
  key: 1,
  class: "chip muted"
}, ea = { class: "user-tools" }, sa = ["value"], la = { class: "rel-list" }, aa = ["onClick"], na = { class: "avatar" }, ia = { class: "rel-main" }, oa = { class: "rel-top" }, da = { class: "chip" }, ua = { class: "rel-meter" }, ra = { class: "meter-bar" }, ca = { class: "item-meta" }, pa = {
  key: 0,
  class: "list-empty"
}, va = {
  key: 1,
  class: "list-empty"
}, ma = { class: "detail-head" }, _a = { class: "avatar" }, ba = { class: "rel-main" }, ga = { class: "item-meta" }, ya = { class: "tabs" }, ha = ["onClick"], ka = {
  key: 0,
  class: "detail-body"
}, fa = { class: "kv-grid" }, wa = { class: "kv" }, Ca = { class: "kv" }, Sa = { class: "kv" }, xa = { class: "kv" }, Ua = { class: "kv" }, $a = { class: "feed compact" }, Va = {
  key: 0,
  class: "list-empty plain"
}, ja = {
  key: 1,
  class: "detail-body"
}, Na = { class: "rel-meter big" }, Ma = { class: "meter-bar" }, Fa = { class: "rel-actions" }, La = { class: "feed compact" }, Da = {
  key: 0,
  class: "list-empty plain"
}, Ta = {
  key: 2,
  class: "detail-body"
}, Ea = { class: "item-list" }, Oa = { class: "item-main" }, qa = { class: "item-meta" }, Ia = { class: "item-meta" }, Pa = { class: "item-actions" }, Ja = ["onClick"], Ya = {
  key: 0,
  class: "list-empty"
}, Ba = { class: "feed compact" }, Aa = {
  key: 0,
  class: "list-empty plain"
}, Ga = {
  key: 3,
  class: "detail-body"
}, za = { class: "item-list" }, Ra = { class: "item-main" }, Ha = { class: "mem-text" }, Wa = { class: "item-meta" }, Ka = { class: "item-actions" }, Qa = ["onClick"], Xa = {
  key: 0,
  class: "list-empty"
}, Za = {
  key: 4,
  class: "detail-body"
}, tn = { class: "timeline" }, en = { class: "tl-body" }, sn = { class: "tl-head" }, ln = { class: "item-meta" }, an = { class: "tl-detail" }, nn = {
  key: 0,
  class: "list-empty plain"
}, on = { class: "card" }, dn = { class: "item-list" }, un = { class: "item-main" }, rn = { class: "item-meta" }, cn = { class: "chip" }, pn = {
  key: 0,
  class: "list-empty"
}, vn = { class: "group" }, mn = { class: "grid" }, _n = { class: "card" }, bn = { class: "card-head" }, gn = { class: "chip muted" }, yn = { class: "form-row" }, hn = ["disabled"], kn = { class: "item-list" }, fn = { class: "item-main" }, wn = { class: "item-row" }, Cn = { class: "chip muted" }, Sn = { class: "chip" }, xn = {
  key: 0,
  class: "item-meta"
}, Un = { class: "item-actions" }, $n = ["onClick"], Vn = {
  key: 0,
  class: "list-empty"
}, jn = { class: "card" }, Nn = { class: "card-head" }, Mn = { class: "chip muted" }, Fn = { class: "toolbar-inline" }, Ln = ["disabled"], Dn = { class: "item-list" }, Tn = { class: "item-main" }, En = { class: "item-meta" }, On = { class: "item-actions" }, qn = ["onClick"], In = ["onClick"], Pn = ["onClick"], Jn = {
  key: 0,
  class: "list-empty"
}, Yn = { class: "card" }, Bn = { class: "card-head" }, An = { class: "chip muted" }, Gn = { class: "form-row" }, zn = ["disabled"], Rn = { class: "item-list" }, Hn = { class: "item-main" }, Wn = { class: "item-meta" }, Kn = {
  key: 0,
  class: "list-empty"
}, Qn = ["disabled"], Xn = { class: "item-list" }, Zn = { class: "item-main" }, ti = { class: "item-meta" }, ei = { class: "item-actions" }, si = ["onClick"], li = {
  key: 0,
  class: "list-empty"
}, ai = { class: "group" }, ni = { class: "grid" }, ii = { class: "card" }, oi = { class: "card-head" }, di = { class: "card-title" }, ui = { class: "chip muted" }, ri = { class: "form-row" }, ci = ["value"], pi = { class: "toolbar-inline" }, vi = ["disabled"], mi = { class: "world-filter" }, _i = ["onClick"], bi = { class: "card" }, gi = { class: "item-list" }, yi = { class: "item-main" }, hi = { class: "item-row" }, ki = { class: "chip muted" }, fi = { class: "item-meta world-content" }, wi = {
  key: 0,
  class: "item-meta"
}, Ci = { class: "item-actions" }, Si = ["onClick"], xi = ["onClick"], Ui = {
  key: 0,
  class: "list-empty"
}, $i = { class: "group" }, Vi = { class: "grid" }, ji = { class: "card" }, Ni = { class: "card-head" }, Mi = { class: "chip muted" }, Fi = { class: "toolbar-inline" }, Li = ["disabled"], Di = ["disabled"], Ti = { class: "item-list" }, Ei = { class: "item-main" }, Oi = { class: "item-meta" }, qi = { class: "item-meta" }, Ii = { class: "item-actions" }, Pi = ["onClick"], Ji = {
  key: 0,
  class: "list-empty"
}, Yi = { class: "policy" }, Bi = { class: "select" }, Ai = { class: "select" }, Gi = { class: "select" }, zi = { class: "select" }, Ri = { class: "feed" }, Hi = {
  key: 0,
  class: "list-empty plain"
}, Wi = { class: "group" }, Ki = { class: "grid" }, Qi = { class: "card" }, Xi = { class: "card-head" }, Zi = { class: "chip muted" }, to = ["disabled"], eo = { class: "item-list" }, so = { class: "item-main" }, lo = { class: "item-row" }, ao = {
  key: 0,
  class: "chip muted"
}, no = { class: "item-meta" }, io = {
  key: 0,
  class: "group-detail"
}, oo = { class: "topics" }, uo = ["onClick"], ro = {
  key: 0,
  class: "item-meta"
}, co = ["onSubmit"], po = ["onUpdate:modelValue"], vo = { class: "member-list" }, mo = { class: "member-id" }, _o = { class: "item-meta" }, bo = ["value", "onChange"], go = {
  key: 0,
  class: "item-meta"
}, yo = { class: "item-actions" }, ho = ["value", "onChange"], ko = ["onClick"], fo = ["onClick"], wo = {
  key: 0,
  class: "list-empty"
}, Co = { class: "group" }, So = { class: "grid" }, xo = { class: "card" }, Uo = { class: "settings-grid" }, $o = { class: "select" }, Vo = { class: "select" }, jo = { class: "select" }, No = { class: "select" }, Mo = { class: "select" }, Fo = { class: "select" }, Lo = { class: "select" }, Do = { class: "select" }, To = { class: "select" }, Eo = { class: "toggle-row" }, Oo = { class: "check-line" }, qo = { class: "check-line" }, Io = { class: "check-line" }, Po = { class: "card" }, Jo = ["disabled"], Yo = { class: "group" }, Bo = { class: "grid" }, Ao = { class: "card audit-card" }, Go = { class: "card-head" }, zo = { class: "chip muted" }, Ro = { class: "usage-grid" }, Ho = { class: "usage-item" }, Wo = { class: "usage-item" }, Ko = { class: "usage-item" }, Qo = { class: "item-list" }, Xo = { class: "item-main" }, Zo = { class: "item-meta" }, td = {
  key: 0,
  class: "list-empty"
}, ed = { class: "card audit-card" }, sd = { class: "item-list" }, ld = { class: "item-main" }, ad = { class: "item-meta" }, nd = {
  key: 0,
  class: "list-empty"
}, id = {
  key: 0,
  class: "kv-grid"
}, od = { class: "card audit-card" }, dd = { class: "card-head" }, ud = { class: "timeline" }, rd = { class: "tl-body" }, cd = { class: "tl-head" }, pd = { class: "item-meta" }, vd = { class: "tl-detail" }, md = {
  key: 0,
  class: "list-empty plain"
}, _d = /* @__PURE__ */ Pe({
  __name: "CompanionPage",
  setup(bd) {
    const { confirm: Ht } = Ye(), c = v({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), st = v(!1), j = v(""), K = v(""), Q = v(""), lt = v(""), at = v(""), nt = v(""), it = v(""), ot = () => {
      const l = /* @__PURE__ */ new Date(), s = (e) => String(e).padStart(2, "0");
      return `${l.getFullYear()}-${s(l.getMonth() + 1)}-${s(l.getDate())}`;
    }, X = v(ot()), L = v({ date: "", content: "", previous: null, next: null }), Z = v(!1), Lt = V(() => (L.value.content || "").split(/\n{2,}/).map((l) => l.trim()).filter(Boolean));
    async function ft(l = X.value) {
      Z.value = !0;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "journal_page", payload: { date: l } }) });
        if (!s.ok) throw Error(await s.text());
        const e = await s.json();
        L.value = { date: e?.date || l, content: e?.content || "", previous: e?.previous || null, next: e?.next || null }, X.value = L.value.date;
      } catch (s) {
        j.value = s?.message || "无法读取日记";
      } finally {
        Z.value = !1;
      }
    }
    function Dt(l) {
      const s = l === "previous" ? L.value.previous : L.value.next;
      s && ft(s);
    }
    const J = v(""), f = v({ target: "", motive: "", content: "", preferred_at: "" }), C = v({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), Wt = V(() => Object.entries(c.value.groups || {})), dt = V(() => (c.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), wt = V(() => c.value.proactive?.receipts || []), Tt = ot(), Ct = V(() => (c.value.agenda || []).filter((l) => {
      const s = String(l.start_at || "").replace("T", " ");
      return !s || s.slice(0, 10) >= Tt;
    }));
    function w(l) {
      K.value = l, setTimeout(() => {
        K.value === l && (K.value = "");
      }, 2e3);
    }
    const D = v(null);
    async function Kt() {
      try {
        const l = await fetch("/api/usage");
        l.ok && (D.value = await l.json());
      } catch {
      }
    }
    async function z() {
      st.value = !0, j.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        c.value = await l.json(), c.value?.policy && (C.value = { ...C.value, ...c.value.policy }), Fe();
      } catch (l) {
        j.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        st.value = !1;
      }
      Kt(), ft(), vt(), ge();
    }
    async function p(l, s) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: s }) });
        if (!e.ok) throw Error(await e.text());
        return await z(), await e.json().catch(() => ({}));
      } catch (e) {
        return j.value = e?.message || "操作失败", null;
      }
    }
    async function Qt() {
      Q.value.trim() && (await p("add_agenda", { title: Q.value, when: lt.value, detail: at.value }), Q.value = "", lt.value = "", at.value = "");
    }
    async function Et(l, s) {
      s.trim() && (await p(l, { content: s }), l === "journal" ? nt.value = "" : it.value = "");
    }
    function St(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    function Ot(l) {
      if (l.status === "completed") return { label: "已完成", cls: "chip-ok" };
      const s = new Date(String(l.start_at || "").replace(" ", "T"));
      return !Number.isNaN(s.getTime()) && s.getTime() <= Date.now() ? { label: "进行中", cls: "chip-warn" } : { label: "待开始", cls: "muted" };
    }
    async function qt(l, s) {
      await p("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: s }) && w(`已调整 ${l}`);
    }
    async function Xt() {
      if (!f.value.target.trim() || !f.value.content.trim()) return;
      await p("proactive_create", { ...f.value }) && (f.value = { target: "", motive: "", content: "", preferred_at: "" }, w("已创建主动候选"));
    }
    async function It(l) {
      await p("proactive_cancel", { id: l, reason: "dashboard_cancel" }), w("已取消候选");
    }
    async function Zt() {
      await p("proactive_policy", { daily_limit: Number(C.value.daily_limit), per_target_limit: Number(C.value.per_target_limit), quiet_start: Number(C.value.quiet_start), quiet_end: Number(C.value.quiet_end) }), w("策略已保存");
    }
    const R = v("");
    async function Pt(l) {
      R.value = l;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        await z(), w("已由 LIFE 生成");
      } catch (s) {
        j.value = s?.message || "生成失败";
      } finally {
        R.value = "";
      }
    }
    async function te() {
      const l = f.value.target.trim() || "user:owner";
      await p("proactive_suggest", { target: l, hint: f.value.motive }) && (f.value = { target: "", motive: "", content: "", preferred_at: "" }, w("已生成建议候选"));
    }
    const ut = v(!1);
    async function ee() {
      ut.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await z(), w(s?.skipped ? `本次跳过：${s.skipped}` : `已投递 ${s.delivered || 0} 条 · 拦截 ${s.blocked || 0} 条`);
      } catch (l) {
        j.value = l?.message || "投递失败";
      } finally {
        ut.value = !1;
      }
    }
    const rt = v(!1);
    async function se() {
      rt.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await z();
        const e = s?.applied;
        w(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (l) {
        j.value = l?.message || "规划失败";
      } finally {
        rt.value = !1;
      }
    }
    function xt(l) {
      const s = (l || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let o = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? (o = new Date(s), o.setHours(0, 0, 0, 0), o < e && o.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(s) && (o = new Date(e.getFullYear(), Number(s.slice(0, 2)) - 1, Number(s.slice(3, 5))), o < e && o.setFullYear(e.getFullYear() + 1)), !o || Number.isNaN(o.getTime()) ? null : Math.round((o.getTime() - e.getTime()) / 864e5);
    }
    const S = v({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function le() {
      !S.value.title.trim() || !S.value.date.trim() || (await p("date_add", { ...S.value }), S.value = { title: "", date: "", repeat_yearly: !0, note: "" }, w("已添加重要日期"));
    }
    async function ae(l) {
      await p("date_delete", { id: l }), w("已删除");
    }
    async function ne() {
      await p("circadian_eat", { amount: 45 }), w("已用餐");
    }
    async function ie() {
      const l = await p("daily_agenda", {});
      w(l?.created ? `LIFE 已安排 ${l.created} 项活动` : "今天已有安排");
    }
    async function Jt(l) {
      await Ht({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await p("journal_clear", { kind: l }), w("已清除"));
    }
    function T(l) {
      if (!l) return "";
      const s = new Date(l);
      return Number.isNaN(s.getTime()) ? l : s.toLocaleString();
    }
    const Y = v(""), ct = v(""), pt = v(""), b = v(null), Ut = v(!1), B = v("overview"), oe = [{ key: "overview", label: "概览" }, { key: "relationship", label: "关系" }, { key: "proactive", label: "主动" }, { key: "memory", label: "记忆" }, { key: "diagnostics", label: "诊断" }], de = V(() => Array.from(new Set((c.value.relationships || []).map((l) => l.stage).filter(Boolean)))), $t = V(() => (c.value.relationships || []).filter((l) => (!ct.value || String(l.user_id).toLowerCase().includes(ct.value.toLowerCase())) && (!pt.value || l.stage === pt.value)));
    async function Yt(l) {
      Y.value = l, B.value = "overview", Ut.value = !0;
      const s = await p("user_detail", { user_id: l, limit: 100, memory_limit: 100 });
      b.value = s || null, Ut.value = !1;
    }
    function ue() {
      Y.value = "", b.value = null;
    }
    async function re(l) {
      await p("delete_memory", { id: l }), Y.value && Yt(Y.value);
    }
    const tt = v(ot().slice(0, 7)), E = v({ events: [], candidates: [], conflicts: [] }), O = v({ title: "", detail: "", kind: "growth" }), q = v({ name: "", tags: "", note: "" }), Vt = V(() => c.value.word_cloud || []), ce = V(() => {
      const [l, s] = tt.value.split("-").map(Number);
      if (!l || !s) return [];
      const e = new Date(l, s, 0).getDate(), o = new Date(l, s - 1, 1).getDay(), G = {};
      for (const N of E.value.events || []) {
        const P = String(N.start_at || "").replace("T", " ").slice(0, 10);
        (G[P] || (G[P] = [])).push(N);
      }
      const Mt = [];
      for (let N = 0; N < o; N++) Mt.push({ key: `pad-${N}`, empty: !0 });
      for (let N = 1; N <= e; N++) {
        const P = `${l}-${String(s).padStart(2, "0")}-${String(N).padStart(2, "0")}`;
        Mt.push({ key: P, day: N, iso: P, events: G[P] || [], today: P === Tt });
      }
      return Mt;
    });
    async function vt() {
      const l = await p("calendar_month", { month: tt.value });
      l && (E.value = l);
    }
    function Bt(l) {
      const [s, e] = tt.value.split("-").map(Number), o = new Date(s, e - 1 + l, 1);
      tt.value = `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`, vt();
    }
    async function pe() {
      O.value.title.trim() && (await p("goal_add", { ...O.value }), O.value = { title: "", detail: "", kind: "growth" });
    }
    async function ve(l) {
      await p("goal_update", { id: l, status: "done", progress: 1 });
    }
    async function me(l) {
      await p("goal_delete", { id: l });
    }
    async function _e() {
      q.value.name.trim() && (await p("food_add", { ...q.value }), q.value = { name: "", tags: "", note: "" });
    }
    async function be(l) {
      await p("food_delete", { id: l });
    }
    const mt = v([]), M = v({ group_id: "", policy: "observe", alias: "" }), jt = v({}), Nt = v({}), _t = v({});
    async function ge() {
      const l = await p("group_list", {});
      l && (mt.value = l.groups || []);
    }
    async function ye() {
      M.value.group_id.trim() && (await p("group_upsert", { ...M.value }), M.value = { group_id: "", policy: "observe", alias: "" });
    }
    async function he(l) {
      await p("group_delete", { group_id: l }), J.value === l && (J.value = "");
    }
    async function ke(l, s) {
      const e = s.target.value;
      await p("group_upsert", { group_id: l.group_id, policy: e, alias: l.alias || "", note: l.note || "" });
    }
    async function fe(l, s, e) {
      const o = e.target.value;
      await p("group_member_flag", { group_id: l, user_id: s, flag: o }), bt(l);
    }
    async function bt(l) {
      const [s, e] = await Promise.all([p("group_slang_list", { group_id: l }), p("group_members", { group_id: l })]);
      jt.value[l] = s?.slang || [], Nt.value[l] = e?.members || [];
    }
    function we(l) {
      J.value = J.value === l ? "" : l, J.value && bt(l);
    }
    async function Ce(l) {
      const s = (_t.value[l] || "").trim();
      s && (await p("group_slang_update", { group_id: l, topic: s, score: 1 }), _t.value[l] = "", bt(l));
    }
    async function Se(l, s) {
      await p("group_slang_delete", { group_id: l, topic: s }), bt(l);
    }
    const U = v({ name: "", category: "general", level: 1, keywords: "" }), I = v({ text: "", scene: "" }), A = v("pending"), F = v({ user_id: "", name: "", tags: "" }), $ = v({ source_id: "", target_id: "", relation: "" }), At = V(() => (c.value.expressions || []).filter((l) => l.status === A.value)), gt = V(() => {
      const l = c.value.expressions || [];
      return { pending: l.filter((s) => s.status === "pending").length, approved: l.filter((s) => s.status === "approved").length, rejected: l.filter((s) => s.status === "rejected").length };
    });
    async function xe() {
      U.value.name.trim() && (await p("skill_add", { ...U.value, level: Number(U.value.level) }), U.value = { name: "", category: "general", level: 1, keywords: "" });
    }
    async function Ue(l) {
      await p("skill_delete", { id: l });
    }
    async function $e() {
      I.value.text.trim() && (await p("expression_add", { ...I.value }), I.value = { text: "", scene: "" });
    }
    async function Gt(l, s) {
      await p("expression_review", { id: l, accept: s });
    }
    async function Ve(l) {
      await p("expression_delete", { id: l });
    }
    async function je() {
      F.value.user_id.trim() && (await p("social_node_upsert", { ...F.value }), F.value = { user_id: "", name: "", tags: "" });
    }
    async function Ne() {
      !$.value.source_id.trim() || !$.value.target_id.trim() || (await p("social_edge_add", { ...$.value }), $.value = { source_id: "", target_id: "", relation: "" });
    }
    async function Me(l) {
      await p("social_edge_delete", { id: l });
    }
    const g = v({}), et = v(null), H = v("");
    function Fe() {
      const l = c.value.settings || {}, s = (e, o) => String(l[e] ?? o);
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
    async function Le() {
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
      await p("settings_set", { settings: s }), w("设置已保存");
    }
    async function De() {
      const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "config_export", payload: {} }) });
      if (!l.ok) {
        j.value = await l.text();
        return;
      }
      const s = new Blob([JSON.stringify(await l.json(), null, 2)], { type: "application/json" }), e = URL.createObjectURL(s), o = document.createElement("a");
      o.href = e, o.download = `life-companion-${ot()}.json`, o.click(), URL.revokeObjectURL(e);
    }
    async function Te() {
      if (!H.value.trim()) return;
      let l;
      try {
        l = JSON.parse(H.value);
      } catch {
        j.value = "导入内容不是合法 JSON";
        return;
      }
      const s = await p("config_import", { snapshot: l });
      s && (H.value = "", w(`已导入：${Object.entries(s.applied || {}).map(([e, o]) => `${e} ${o}`).join(" · ")}`));
    }
    async function Ee() {
      const l = await p("diagnostics", {});
      l && (et.value = l);
    }
    const zt = ["persona", "worldview", "style", "background", "wardrobe", "reference"], W = v(""), h = v({ id: "", kind: "worldview", title: "", content: "", tags: "" }), Rt = V(() => (c.value.world || []).filter((l) => !W.value || l.kind === W.value));
    function Oe(l) {
      h.value = { id: l.id, kind: l.kind, title: l.title, content: l.content, tags: l.tags || "" };
    }
    async function qe() {
      !h.value.title.trim() || !h.value.content.trim() || (await p("world_upsert", { ...h.value }), h.value = { id: "", kind: "worldview", title: "", content: "", tags: "" });
    }
    async function Ie(l) {
      await p("world_delete", { id: l });
    }
    return Je(z), (l, s) => (n(), i("main", Ae, [
      t("div", Ge, [
        t("header", ze, [
          s[75] || (s[75] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", Re, [
            t("button", {
              class: "btn btn-primary",
              disabled: rt.value,
              onClick: se
            }, a(rt.value ? "规划中…" : "让 LIFE 规划"), 9, He),
            t("button", {
              class: "btn btn-tonal",
              disabled: st.value,
              onClick: z
            }, a(st.value ? "刷新中…" : "刷新"), 9, We)
          ])
        ]),
        j.value ? (n(), i("p", Ke, a(j.value), 1)) : u("", !0),
        K.value ? (n(), i("p", Qe, a(K.value), 1)) : u("", !0),
        t("section", Xe, [
          t("article", Ze, [
            s[76] || (s[76] = yt('<div class="stat-head" data-v-3402080a><span class="icon-badge tone-1" aria-hidden="true" data-v-3402080a><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-3402080a><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-3402080a></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-3402080a></path></svg></span><span class="stat-label" data-v-3402080a>关系对象</span></div>', 1)),
            t("strong", ts, a(c.value.relationships?.length || 0), 1),
            s[77] || (s[77] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", es, [
            s[78] || (s[78] = yt('<div class="stat-head" data-v-3402080a><span class="icon-badge tone-2" aria-hidden="true" data-v-3402080a><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-3402080a><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-3402080a></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-3402080a></path></svg></span><span class="stat-label" data-v-3402080a>活动日程</span></div>', 1)),
            t("strong", ss, a(Ct.value.filter((e) => e.status === "active").length), 1),
            s[79] || (s[79] = t("span", { class: "stat-hint" }, "今天起待进行", -1))
          ]),
          t("article", ls, [
            s[80] || (s[80] = yt('<div class="stat-head" data-v-3402080a><span class="icon-badge tone-3" aria-hidden="true" data-v-3402080a><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-3402080a><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-3402080a></path></svg></span><span class="stat-label" data-v-3402080a>待投递主动行为</span></div>', 1)),
            t("strong", as, a(dt.value.length), 1),
            t("span", ns, "已投递 " + a(wt.value.length) + " 次", 1)
          ]),
          t("article", is, [
            s[81] || (s[81] = yt('<div class="stat-head" data-v-3402080a><span class="icon-badge tone-4" aria-hidden="true" data-v-3402080a><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-3402080a><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-3402080a></path></svg></span><span class="stat-label" data-v-3402080a>已观察群聊</span></div>', 1)),
            t("strong", os, a(Wt.value.length), 1),
            s[82] || (s[82] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", ds, [
          t("span", us, "精力 " + a(Math.round(c.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: y(["state-pill", { warn: (c.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + a(Math.round(c.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: y(["state-pill", { warn: (c.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + a(Math.round(c.value.circadian?.health ?? 100)), 3),
          c.value.circadian?.is_sleeping ? (n(), i("span", rs, "睡眠中")) : u("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: ne
          }, "吃饭")
        ]),
        t("section", cs, [
          s[93] || (s[93] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", ps, [
            t("article", vs, [
              t("div", { class: "card-head" }, [
                s[83] || (s[83] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: ie
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: x(Qt, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[0] || (s[0] = (e) => Q.value = e),
                  class: "input",
                  placeholder: "日程标题",
                  "aria-label": "日程标题"
                }, null, 512), [
                  [r, Q.value]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[1] || (s[1] = (e) => lt.value = e),
                  class: "input",
                  placeholder: "时间，例如 2026-09-25 20:00",
                  "aria-label": "时间"
                }, null, 512), [
                  [r, lt.value]
                ]),
                s[84] || (s[84] = t("button", {
                  class: "btn btn-primary",
                  type: "submit"
                }, "创建候选", -1)),
                d(t("textarea", {
                  "onUpdate:modelValue": s[2] || (s[2] = (e) => at.value = e),
                  class: "input area",
                  placeholder: "说明（可选）"
                }, null, 512), [
                  [r, at.value]
                ])
              ], 32),
              s[85] || (s[85] = t("h3", { class: "section-label" }, "待确认候选", -1)),
              t("ul", ms, [
                (n(!0), i(m, null, _(c.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", _s, [
                    t("strong", null, a(e.title), 1),
                    t("span", bs, a(e.when_text) + " · " + a(e.detail || "等待你确认"), 1)
                  ]),
                  t("div", gs, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (o) => p("confirm_agenda", { id: e.id })
                    }, "确认", 8, ys),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => p("reject_agenda", { id: e.id })
                    }, "拒绝", 8, hs)
                  ])
                ]))), 128)),
                c.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? u("", !0) : (n(), i("li", ks, "没有待确认的日程候选"))
              ]),
              s[86] || (s[86] = t("h3", { class: "section-label" }, [
                k("今天的日程 "),
                t("small", { class: "hint-inline" }, "LIFE 按时间自动推进")
              ], -1)),
              t("ul", fs, [
                (n(!0), i(m, null, _(Ct.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ws, [
                    t("div", Cs, [
                      t("strong", {
                        class: y({ done: e.status === "completed" })
                      }, a(e.title), 3),
                      t("span", {
                        class: y(["chip", Ot(e).cls])
                      }, a(Ot(e).label), 3)
                    ]),
                    t("span", Ss, [
                      k(a(e.start_at), 1),
                      e.detail ? (n(), i(m, { key: 0 }, [
                        k(" · " + a(e.detail), 1)
                      ], 64)) : u("", !0)
                    ])
                  ])
                ]))), 128)),
                Ct.value.length ? u("", !0) : (n(), i("li", xs, "今天还没有安排，点右上角让 LIFE 安排。"))
              ])
            ]),
            t("article", Us, [
              t("div", $s, [
                s[87] || (s[87] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", Vs, a((c.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(le, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[3] || (s[3] = (e) => S.value.title = e),
                  class: "input",
                  placeholder: "名称，如 生日 / 纪念日",
                  "aria-label": "重要日期名称"
                }, null, 512), [
                  [r, S.value.title]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[4] || (s[4] = (e) => S.value.date = e),
                  class: "input",
                  placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                  "aria-label": "重要日期"
                }, null, 512), [
                  [r, S.value.date]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[5] || (s[5] = (e) => S.value.note = e),
                  class: "input",
                  placeholder: "备注（可选）",
                  "aria-label": "备注"
                }, null, 512), [
                  [r, S.value.note]
                ]),
                t("label", js, [
                  d(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[6] || (s[6] = (e) => S.value.repeat_yearly = e)
                  }, null, 512), [
                    [ht, S.value.repeat_yearly]
                  ]),
                  s[88] || (s[88] = k(" 每年重复", -1))
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !S.value.title.trim() || !S.value.date.trim()
                }, "添加", 8, Ns)
              ], 32),
              t("ul", Ms, [
                (n(!0), i(m, null, _(c.value.important_dates, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Fs, [
                    t("strong", null, a(e.title), 1),
                    t("span", Ls, [
                      k(a(e.date_text), 1),
                      xt(e.date_text) !== null ? (n(), i(m, { key: 0 }, [
                        k(" · " + a(xt(e.date_text) === 0 ? "就是今天" : xt(e.date_text) + " 天后"), 1)
                      ], 64)) : u("", !0),
                      e.note ? (n(), i(m, { key: 1 }, [
                        k(" · " + a(e.note), 1)
                      ], 64)) : u("", !0)
                    ])
                  ]),
                  t("div", Ds, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => ae(e.id)
                    }, "删除", 8, Ts)
                  ])
                ]))), 128)),
                c.value.important_dates?.length ? u("", !0) : (n(), i("li", Es, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", Os, [
              t("div", qs, [
                s[89] || (s[89] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", Is, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[7] || (s[7] = (e) => Jt("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: R.value === "journal",
                    onClick: s[8] || (s[8] = (e) => Pt("journal"))
                  }, a(R.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, Ps)
                ])
              ]),
              t("div", Js, [
                t("div", Ys, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !L.value.previous || Z.value,
                    onClick: s[9] || (s[9] = (e) => Dt("previous"))
                  }, "← 前一页", 8, Bs),
                  d(t("input", {
                    "onUpdate:modelValue": s[10] || (s[10] = (e) => X.value = e),
                    class: "input book-date",
                    type: "date",
                    "aria-label": "日记日期",
                    onChange: s[11] || (s[11] = (e) => ft(X.value))
                  }, null, 544), [
                    [r, X.value]
                  ]),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !L.value.next || Z.value,
                    onClick: s[12] || (s[12] = (e) => Dt("next"))
                  }, "后一页 →", 8, As)
                ]),
                t("div", Gs, [
                  t("p", zs, a(L.value.date), 1),
                  Lt.value.length ? (n(), i("div", Rs, [
                    (n(!0), i(m, null, _(Lt.value, (e, o) => (n(), i("p", { key: o }, a(e), 1))), 128))
                  ])) : (n(), i("p", Hs, a(Z.value ? "翻页中…" : "这一天还没有写下什么。"), 1))
                ])
              ]),
              t("form", {
                class: "stack-form diary-manual",
                onSubmit: s[14] || (s[14] = x((e) => Et("journal", nt.value), ["prevent"]))
              }, [
                d(t("textarea", {
                  "onUpdate:modelValue": s[13] || (s[13] = (e) => nt.value = e),
                  class: "input area",
                  placeholder: "为今天写下一点…"
                }, null, 512), [
                  [r, nt.value]
                ]),
                s[90] || (s[90] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "写入今天", -1))
              ], 32)
            ]),
            t("article", Ws, [
              t("div", Ks, [
                s[91] || (s[91] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", Qs, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[15] || (s[15] = (e) => Jt("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: R.value === "dream",
                    onClick: s[16] || (s[16] = (e) => Pt("dream"))
                  }, a(R.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, Xs)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: s[18] || (s[18] = x((e) => Et("dream", it.value), ["prevent"]))
              }, [
                d(t("textarea", {
                  "onUpdate:modelValue": s[17] || (s[17] = (e) => it.value = e),
                  class: "input area",
                  placeholder: "记录一个梦境或睡眠反思…"
                }, null, 512), [
                  [r, it.value]
                ]),
                s[92] || (s[92] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "记录梦境", -1))
              ], 32),
              t("ol", Zs, [
                (n(!0), i(m, null, _(c.value.dreams, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, a(e.at), 1),
                  t("p", null, a(e.content), 1)
                ]))), 128)),
                c.value.dreams?.length ? u("", !0) : (n(), i("li", tl, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", el, [
          s[98] || (s[98] = t("h2", { class: "group-title" }, "生活日历", -1)),
          t("div", sl, [
            t("article", ll, [
              t("div", al, [
                s[94] || (s[94] = t("h2", { class: "card-title" }, "生活日历", -1)),
                t("div", nl, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[19] || (s[19] = (e) => Bt(-1))
                  }, "←"),
                  t("strong", il, a(tt.value), 1),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[20] || (s[20] = (e) => Bt(1))
                  }, "→")
                ])
              ]),
              t("div", ol, [
                (n(), i(m, null, _(["日", "一", "二", "三", "四", "五", "六"], (e) => t("span", { key: e }, a(e), 1)), 64))
              ]),
              t("div", dl, [
                (n(!0), i(m, null, _(ce.value, (e) => (n(), i("div", {
                  key: e.key,
                  class: y(["cal-cell", { empty: e.empty, today: e.today, has: e.events?.length }])
                }, [
                  e.empty ? u("", !0) : (n(), i("span", ul, a(e.day), 1)),
                  (n(!0), i(m, null, _((e.events || []).slice(0, 2), (o) => (n(), i("span", {
                    key: o.id,
                    class: "cal-chip",
                    title: o.title
                  }, a(o.title), 9, rl))), 128)),
                  (e.events || []).length > 2 ? (n(), i("span", cl, "+" + a(e.events.length - 2), 1)) : u("", !0)
                ], 2))), 128))
              ]),
              E.value.conflicts?.length ? (n(), i("p", pl, "⚠ " + a(E.value.conflicts.length) + " 处时间冲突：" + a(E.value.conflicts.map((e) => e.titles.join(" / ")).join("；")), 1)) : u("", !0),
              t("h3", vl, "本月待确认候选 (" + a(E.value.candidates?.length || 0) + ")", 1),
              t("ul", ml, [
                (n(!0), i(m, null, _((E.value.candidates || []).slice(0, 6), (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", _l, [
                    t("strong", null, a(e.title), 1),
                    t("span", bl, a(e.when_text), 1)
                  ]),
                  t("div", gl, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (o) => p("confirm_agenda", { id: e.id }).then(vt)
                    }, "确认", 8, yl),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => p("reject_agenda", { id: e.id }).then(vt)
                    }, "拒绝", 8, hl)
                  ])
                ]))), 128)),
                (E.value.candidates || []).length ? u("", !0) : (n(), i("li", kl, "没有待确认候选"))
              ])
            ]),
            t("article", fl, [
              t("div", wl, [
                s[95] || (s[95] = t("h2", { class: "card-title" }, "个人目标", -1)),
                t("span", Cl, a((c.value.goals || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(pe, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[21] || (s[21] = (e) => O.value.title = e),
                  class: "input",
                  placeholder: "目标，如 学会一首钢琴曲",
                  "aria-label": "目标标题"
                }, null, 512), [
                  [r, O.value.title]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[22] || (s[22] = (e) => O.value.detail = e),
                  class: "input",
                  placeholder: "说明（可选）",
                  "aria-label": "目标说明"
                }, null, 512), [
                  [r, O.value.detail]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !O.value.title.trim()
                }, "添加目标", 8, Sl)
              ], 32),
              t("ul", xl, [
                (n(!0), i(m, null, _(c.value.goals, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Ul, [
                    t("div", $l, [
                      t("strong", {
                        class: y({ done: e.status === "done" })
                      }, a(e.title), 3),
                      t("span", {
                        class: y(["chip", e.status === "done" ? "chip-ok" : "muted"])
                      }, a(e.status === "done" ? "已完成" : "进行中"), 3)
                    ]),
                    t("div", Vl, [
                      t("i", {
                        style: kt({ width: St(e.progress) })
                      }, null, 4)
                    ]),
                    e.detail ? (n(), i("span", jl, a(e.detail), 1)) : u("", !0)
                  ]),
                  t("div", Nl, [
                    e.status !== "done" ? (n(), i("button", {
                      key: 0,
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => ve(e.id)
                    }, "完成", 8, Ml)) : u("", !0),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => me(e.id)
                    }, "删除", 8, Fl)
                  ])
                ]))), 128)),
                (c.value.goals || []).length ? u("", !0) : (n(), i("li", Ll, "还没有个人目标"))
              ])
            ]),
            t("article", Dl, [
              t("div", Tl, [
                s[96] || (s[96] = t("h2", { class: "card-title" }, "食物菜单", -1)),
                t("span", El, a((c.value.food || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(_e, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[23] || (s[23] = (e) => q.value.name = e),
                  class: "input",
                  placeholder: "食物，如 番茄牛腩",
                  "aria-label": "食物名称"
                }, null, 512), [
                  [r, q.value.name]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[24] || (s[24] = (e) => q.value.tags = e),
                  class: "input",
                  placeholder: "标签，如 家常 / 甜（可选）",
                  "aria-label": "食物标签"
                }, null, 512), [
                  [r, q.value.tags]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !q.value.name.trim()
                }, "加入菜单", 8, Ol)
              ], 32),
              t("ul", ql, [
                (n(!0), i(m, null, _(c.value.food, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Il, [
                    t("strong", null, a(e.name), 1),
                    t("span", Pl, a(e.tags || "—"), 1)
                  ]),
                  t("div", Jl, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => be(e.id)
                    }, "删除", 8, Yl)
                  ])
                ]))), 128)),
                (c.value.food || []).length ? u("", !0) : (n(), i("li", Bl, "菜单还是空的"))
              ])
            ]),
            t("article", Al, [
              t("div", Gl, [
                s[97] || (s[97] = t("h2", { class: "card-title" }, "群聊黑话词云", -1)),
                t("span", zl, a(Vt.value.length), 1)
              ]),
              t("div", Rl, [
                (n(!0), i(m, null, _(Vt.value, (e) => (n(), i("span", {
                  key: e.topic,
                  class: "cloud-word",
                  style: kt({ fontSize: 12 + Math.min(18, Math.log(e.score + 1) * 6) + "px", opacity: 0.55 + Math.min(0.45, e.score / 20) })
                }, a(e.topic), 5))), 128)),
                Vt.value.length ? u("", !0) : (n(), i("span", Hl, "还没有群聊词云数据"))
              ])
            ])
          ])
        ]),
        t("section", Wl, [
          s[112] || (s[112] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", Kl, [
            t("article", Ql, [
              t("div", Xl, [
                t("h2", Zl, a(Y.value ? "用户详情" : "用户"), 1),
                Y.value ? (n(), i("button", {
                  key: 0,
                  class: "btn btn-tonal btn-sm",
                  onClick: ue
                }, "← 返回用户列表")) : (n(), i("span", ta, a($t.value.length) + " / " + a(c.value.relationships?.length || 0), 1))
              ]),
              Y.value ? Ut.value ? (n(), i("div", va, "加载中…")) : b.value ? (n(), i(m, { key: 2 }, [
                t("div", ma, [
                  t("span", _a, a((b.value.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", ba, [
                    t("strong", null, a(b.value.user_id), 1),
                    t("span", ga, "阶段 " + a(b.value.relationship?.stage || "未知") + " · 好感 " + a(Math.round((b.value.relationship?.affinity || 0) * 100)) + "% · 最近 " + a(b.value.relationship?.last_seen || "—"), 1)
                  ])
                ]),
                t("nav", ya, [
                  (n(), i(m, null, _(oe, (e) => t("button", {
                    key: e.key,
                    class: y(["tab", { active: B.value === e.key }]),
                    onClick: (o) => B.value = e.key
                  }, a(e.label), 11, ha)), 64))
                ]),
                B.value === "overview" ? (n(), i("div", ka, [
                  t("div", fa, [
                    t("div", wa, [
                      s[101] || (s[101] = t("span", null, "关系事件", -1)),
                      t("strong", null, a(b.value.counts?.ledger || 0), 1)
                    ]),
                    t("div", Ca, [
                      s[102] || (s[102] = t("span", null, "主动候选", -1)),
                      t("strong", null, a(b.value.counts?.candidates || 0), 1)
                    ]),
                    t("div", Sa, [
                      s[103] || (s[103] = t("span", null, "已投递", -1)),
                      t("strong", null, a(b.value.counts?.delivered || 0), 1)
                    ]),
                    t("div", xa, [
                      s[104] || (s[104] = t("span", null, "记忆条数", -1)),
                      t("strong", null, a(b.value.memories?.total || 0), 1)
                    ]),
                    t("div", Ua, [
                      s[105] || (s[105] = t("span", null, "阶段主动上限", -1)),
                      t("strong", null, a(b.value.stage_limit ?? "不限"), 1)
                    ])
                  ]),
                  s[106] || (s[106] = t("h3", { class: "section-label" }, "最近关系事件", -1)),
                  t("ol", $a, [
                    (n(!0), i(m, null, _((b.value.ledger || []).slice(0, 5), (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a(T(e.created_at)), 1),
                      t("p", null, [
                        k(a(e.event_key) + " ", 1),
                        t("span", {
                          class: y(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        k(" · " + a(e.reason), 1)
                      ])
                    ]))), 128)),
                    (b.value.ledger || []).length ? u("", !0) : (n(), i("li", Va, "暂无关系事件"))
                  ])
                ])) : B.value === "relationship" ? (n(), i("div", ja, [
                  t("div", Na, [
                    t("div", Ma, [
                      t("i", {
                        style: kt({ width: St(b.value.relationship?.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, a(Math.round((b.value.relationship?.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("div", Fa, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[27] || (s[27] = (e) => qt(b.value.user_id, 0.05))
                    }, "更亲近 +"),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[28] || (s[28] = (e) => qt(b.value.user_id, -0.05))
                    }, "更疏远 −")
                  ]),
                  s[108] || (s[108] = t("h3", { class: "section-label" }, "事件账本", -1)),
                  t("ol", La, [
                    (n(!0), i(m, null, _(b.value.ledger, (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a(T(e.created_at)), 1),
                      t("p", null, [
                        t("strong", null, a(e.event_key), 1),
                        s[107] || (s[107] = k()),
                        t("span", {
                          class: y(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        k(" · " + a(e.reason) + " (" + a(e.channel) + ")", 1)
                      ])
                    ]))), 128)),
                    (b.value.ledger || []).length ? u("", !0) : (n(), i("li", Da, "暂无关系事件"))
                  ])
                ])) : B.value === "proactive" ? (n(), i("div", Ta, [
                  s[109] || (s[109] = t("h3", { class: "section-label" }, "候选队列", -1)),
                  t("ul", Ea, [
                    (n(!0), i(m, null, _(b.value.proactive?.candidates || [], (e) => (n(), i("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", Oa, [
                        t("strong", null, a(e.motive), 1),
                        t("span", qa, a(e.content), 1),
                        t("span", Ia, a(e.status) + " · " + a(T(e.updated_at)), 1)
                      ]),
                      t("div", Pa, [
                        ["delivered", "cancelled"].includes(e.status) ? u("", !0) : (n(), i("button", {
                          key: 0,
                          class: "btn btn-danger btn-sm",
                          onClick: (o) => It(e.id)
                        }, "取消", 8, Ja))
                      ])
                    ]))), 128)),
                    (b.value.proactive?.candidates || []).length ? u("", !0) : (n(), i("li", Ya, "暂无主动记录"))
                  ]),
                  s[110] || (s[110] = t("h3", { class: "section-label" }, "投递记录", -1)),
                  t("ol", Ba, [
                    (n(!0), i(m, null, _(b.value.proactive?.receipts || [], (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a(T(e.created_at)), 1),
                      t("p", null, a(e.phase) + " · " + a(e.content), 1)
                    ]))), 128)),
                    (b.value.proactive?.receipts || []).length ? u("", !0) : (n(), i("li", Aa, "暂无投递"))
                  ])
                ])) : B.value === "memory" ? (n(), i("div", Ga, [
                  t("ul", za, [
                    (n(!0), i(m, null, _(b.value.memories?.items || [], (e) => (n(), i("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", Ra, [
                        t("strong", Ha, a(e.content), 1),
                        t("span", Wa, "scope " + a(e.scope) + " · 重要度 " + a(Math.round((e.importance || 0) * 100)) + "% · 召回 " + a(e.recall_count) + " 次", 1)
                      ]),
                      t("div", Ka, [
                        t("button", {
                          class: "btn btn-danger btn-sm",
                          onClick: (o) => re(e.id)
                        }, "删除", 8, Qa)
                      ])
                    ]))), 128)),
                    (b.value.memories?.items || []).length ? u("", !0) : (n(), i("li", Xa, "没有与该用户相关的记忆"))
                  ])
                ])) : (n(), i("div", Za, [
                  t("ol", tn, [
                    (n(!0), i(m, null, _(b.value.audit || [], (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("span", {
                        class: y(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                        "aria-hidden": "true"
                      }, null, 2),
                      t("div", en, [
                        t("div", sn, [
                          t("strong", null, a(e.kind), 1),
                          t("span", {
                            class: y(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                          }, a(e.outcome), 3),
                          t("time", null, a(T(e.created_at)), 1)
                        ]),
                        t("p", ln, a(e.target), 1),
                        t("p", an, a(e.detail), 1)
                      ])
                    ]))), 128)),
                    (b.value.audit || []).length ? u("", !0) : (n(), i("li", nn, "暂无诊断记录"))
                  ])
                ]))
              ], 64)) : u("", !0) : (n(), i(m, { key: 0 }, [
                t("div", ea, [
                  d(t("input", {
                    "onUpdate:modelValue": s[25] || (s[25] = (e) => ct.value = e),
                    class: "input",
                    placeholder: "搜索用户 ID",
                    "aria-label": "搜索用户"
                  }, null, 512), [
                    [r, ct.value]
                  ]),
                  d(t("select", {
                    "onUpdate:modelValue": s[26] || (s[26] = (e) => pt.value = e),
                    class: "input user-stage",
                    "aria-label": "按阶段筛选"
                  }, [
                    s[99] || (s[99] = t("option", { value: "" }, "全部阶段", -1)),
                    (n(!0), i(m, null, _(de.value, (e) => (n(), i("option", {
                      key: e,
                      value: e
                    }, a(e), 9, sa))), 128))
                  ], 512), [
                    [Ft, pt.value]
                  ])
                ]),
                t("ul", la, [
                  (n(!0), i(m, null, _($t.value, (e) => (n(), i("li", {
                    key: e.user_id,
                    class: "rel",
                    onClick: (o) => Yt(e.user_id)
                  }, [
                    t("span", na, a((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                    t("div", ia, [
                      t("div", oa, [
                        t("strong", null, a(e.user_id), 1),
                        t("span", da, a(e.stage), 1)
                      ]),
                      t("div", ua, [
                        t("div", ra, [
                          t("i", {
                            style: kt({ width: St(e.affinity) })
                          }, null, 4)
                        ]),
                        t("b", null, a(Math.round((e.affinity || 0) * 100)) + "%", 1)
                      ]),
                      t("span", ca, "最近互动：" + a(e.last_seen || "暂无"), 1)
                    ]),
                    s[100] || (s[100] = t("span", {
                      class: "rel-chevron",
                      "aria-hidden": "true"
                    }, "›", -1))
                  ], 8, aa))), 128)),
                  $t.value.length ? u("", !0) : (n(), i("li", pa, "没有匹配的用户"))
                ])
              ], 64))
            ]),
            t("article", on, [
              s[111] || (s[111] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", dn, [
                (n(!0), i(m, null, _(c.value.persona_evolution, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item trait-item"
                }, [
                  t("div", un, [
                    t("strong", null, a(e.trait), 1),
                    t("span", rn, "支持 " + a(e.support_count) + " 次 · 置信度 " + a(Math.round((e.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", cn, a(e.value), 1)
                ]))), 128)),
                c.value.persona_evolution?.length ? u("", !0) : (n(), i("li", pn, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", vn, [
          s[117] || (s[117] = t("h2", { class: "group-title" }, "学习", -1)),
          t("div", mn, [
            t("article", _n, [
              t("div", bn, [
                s[113] || (s[113] = t("h2", { class: "card-title" }, "技能学习", -1)),
                t("span", gn, a((c.value.skills || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(xe, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[29] || (s[29] = (e) => U.value.name = e),
                  class: "input",
                  placeholder: "技能，如 弹钢琴",
                  "aria-label": "技能名称"
                }, null, 512), [
                  [r, U.value.name]
                ]),
                t("div", yn, [
                  d(t("input", {
                    "onUpdate:modelValue": s[30] || (s[30] = (e) => U.value.category = e),
                    class: "input",
                    placeholder: "分类",
                    "aria-label": "分类"
                  }, null, 512), [
                    [r, U.value.category]
                  ]),
                  d(t("input", {
                    "onUpdate:modelValue": s[31] || (s[31] = (e) => U.value.level = e),
                    class: "input tiny",
                    type: "number",
                    min: "1",
                    max: "10",
                    "aria-label": "等级"
                  }, null, 512), [
                    [
                      r,
                      U.value.level,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[32] || (s[32] = (e) => U.value.keywords = e),
                  class: "input",
                  placeholder: "关键词（逗号分隔，可选）",
                  "aria-label": "关键词"
                }, null, 512), [
                  [r, U.value.keywords]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !U.value.name.trim()
                }, "添加技能", 8, hn)
              ], 32),
              t("ul", kn, [
                (n(!0), i(m, null, _(c.value.skills, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", fn, [
                    t("div", wn, [
                      t("strong", null, a(e.name), 1),
                      t("span", Cn, "Lv." + a(e.level), 1),
                      t("span", Sn, a(e.category), 1)
                    ]),
                    e.keywords ? (n(), i("span", xn, a(e.keywords), 1)) : u("", !0)
                  ]),
                  t("div", Un, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => Ue(e.id)
                    }, "删除", 8, $n)
                  ])
                ]))), 128)),
                (c.value.skills || []).length ? u("", !0) : (n(), i("li", Vn, "还没有技能"))
              ])
            ]),
            t("article", jn, [
              t("div", Nn, [
                s[114] || (s[114] = t("h2", { class: "card-title" }, "表达学习", -1)),
                t("span", Mn, "待审 " + a(gt.value.pending), 1)
              ]),
              t("div", Fn, [
                t("button", {
                  class: y(["btn btn-sm", A.value === "pending" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[33] || (s[33] = (e) => A.value = "pending")
                }, "待审 " + a(gt.value.pending), 3),
                t("button", {
                  class: y(["btn btn-sm", A.value === "approved" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[34] || (s[34] = (e) => A.value = "approved")
                }, "已用 " + a(gt.value.approved), 3),
                t("button", {
                  class: y(["btn btn-sm", A.value === "rejected" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[35] || (s[35] = (e) => A.value = "rejected")
                }, "已拒 " + a(gt.value.rejected), 3)
              ]),
              t("form", {
                class: "slang-form",
                onSubmit: x($e, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[36] || (s[36] = (e) => I.value.text = e),
                  class: "input",
                  placeholder: "表达，如 晚安呀",
                  "aria-label": "表达内容"
                }, null, 512), [
                  [r, I.value.text]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[37] || (s[37] = (e) => I.value.scene = e),
                  class: "input scene-input",
                  placeholder: "场景",
                  "aria-label": "场景"
                }, null, 512), [
                  [r, I.value.scene]
                ]),
                t("button", {
                  class: "btn btn-primary btn-sm",
                  type: "submit",
                  disabled: !I.value.text.trim()
                }, "入库", 8, Ln)
              ], 32),
              t("ul", Dn, [
                (n(!0), i(m, null, _(At.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Tn, [
                    t("strong", null, a(e.text), 1),
                    t("span", En, a(e.scene || "通用") + " · " + a(e.source), 1)
                  ]),
                  t("div", On, [
                    e.status === "pending" ? (n(), i("button", {
                      key: 0,
                      class: "btn btn-primary btn-sm",
                      onClick: (o) => Gt(e.id, !0)
                    }, "采用", 8, qn)) : u("", !0),
                    e.status === "pending" ? (n(), i("button", {
                      key: 1,
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => Gt(e.id, !1)
                    }, "拒绝", 8, In)) : u("", !0),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => Ve(e.id)
                    }, "删除", 8, Pn)
                  ])
                ]))), 128)),
                At.value.length ? u("", !0) : (n(), i("li", Jn, "该分类下没有表达"))
              ])
            ]),
            t("article", Yn, [
              t("div", Bn, [
                s[115] || (s[115] = t("h2", { class: "card-title" }, "社交关系网", -1)),
                t("span", An, a((c.value.social_nodes || []).length) + " 人 · " + a((c.value.social_edges || []).length) + " 关系", 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(je, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[38] || (s[38] = (e) => F.value.user_id = e),
                  class: "input",
                  placeholder: "用户 ID",
                  "aria-label": "用户 ID"
                }, null, 512), [
                  [r, F.value.user_id]
                ]),
                t("div", Gn, [
                  d(t("input", {
                    "onUpdate:modelValue": s[39] || (s[39] = (e) => F.value.name = e),
                    class: "input",
                    placeholder: "称呼（可选）",
                    "aria-label": "称呼"
                  }, null, 512), [
                    [r, F.value.name]
                  ]),
                  d(t("input", {
                    "onUpdate:modelValue": s[40] || (s[40] = (e) => F.value.tags = e),
                    class: "input",
                    placeholder: "标签（可选）",
                    "aria-label": "标签"
                  }, null, 512), [
                    [r, F.value.tags]
                  ])
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !F.value.user_id.trim()
                }, "加入关系网", 8, zn)
              ], 32),
              t("ul", Rn, [
                (n(!0), i(m, null, _(c.value.social_nodes, (e) => (n(), i("li", {
                  key: e.user_id,
                  class: "item"
                }, [
                  t("div", Hn, [
                    t("strong", null, a(e.name || e.user_id), 1),
                    t("span", Wn, [
                      k(a(e.user_id), 1),
                      e.tags ? (n(), i(m, { key: 0 }, [
                        k(" · " + a(e.tags), 1)
                      ], 64)) : u("", !0)
                    ])
                  ])
                ]))), 128)),
                (c.value.social_nodes || []).length ? u("", !0) : (n(), i("li", Kn, "关系网还是空的"))
              ]),
              s[116] || (s[116] = t("h3", { class: "section-label" }, "关系连线", -1)),
              t("form", {
                class: "form-row",
                onSubmit: x(Ne, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[41] || (s[41] = (e) => $.value.source_id = e),
                  class: "input",
                  placeholder: "A",
                  "aria-label": "关系起点"
                }, null, 512), [
                  [r, $.value.source_id]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[42] || (s[42] = (e) => $.value.target_id = e),
                  class: "input",
                  placeholder: "B",
                  "aria-label": "关系终点"
                }, null, 512), [
                  [r, $.value.target_id]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[43] || (s[43] = (e) => $.value.relation = e),
                  class: "input",
                  placeholder: "关系，如 同学",
                  "aria-label": "关系"
                }, null, 512), [
                  [r, $.value.relation]
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  type: "submit",
                  disabled: !$.value.source_id.trim() || !$.value.target_id.trim()
                }, "连线", 8, Qn)
              ], 32),
              t("ul", Xn, [
                (n(!0), i(m, null, _(c.value.social_edges, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Zn, [
                    t("strong", null, a(e.source_id) + " → " + a(e.target_id), 1),
                    t("span", ti, a(e.relation), 1)
                  ]),
                  t("div", ei, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => Me(e.id)
                    }, "删除", 8, si)
                  ])
                ]))), 128)),
                (c.value.social_edges || []).length ? u("", !0) : (n(), i("li", li, "还没有关系连线"))
              ])
            ])
          ])
        ]),
        t("section", ai, [
          s[119] || (s[119] = t("h2", { class: "group-title" }, "世界知识", -1)),
          t("div", ni, [
            t("article", ii, [
              t("div", oi, [
                t("h2", di, a(h.value.id ? "编辑条目" : "新增条目"), 1),
                t("span", ui, a((c.value.world || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(qe, ["prevent"])
              }, [
                t("div", ri, [
                  d(t("select", {
                    "onUpdate:modelValue": s[44] || (s[44] = (e) => h.value.kind = e),
                    class: "input world-kind",
                    "aria-label": "类型"
                  }, [
                    (n(), i(m, null, _(zt, (e) => t("option", {
                      key: e,
                      value: e
                    }, a(e), 9, ci)), 64))
                  ], 512), [
                    [Ft, h.value.kind]
                  ]),
                  d(t("input", {
                    "onUpdate:modelValue": s[45] || (s[45] = (e) => h.value.title = e),
                    class: "input",
                    placeholder: "标题，如 世界观 / 今日穿搭",
                    "aria-label": "标题"
                  }, null, 512), [
                    [r, h.value.title]
                  ])
                ]),
                d(t("textarea", {
                  "onUpdate:modelValue": s[46] || (s[46] = (e) => h.value.content = e),
                  class: "input area",
                  placeholder: "内容…"
                }, null, 512), [
                  [r, h.value.content]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[47] || (s[47] = (e) => h.value.tags = e),
                  class: "input",
                  placeholder: "标签（可选）",
                  "aria-label": "标签"
                }, null, 512), [
                  [r, h.value.tags]
                ]),
                t("div", pi, [
                  t("button", {
                    class: "btn btn-primary",
                    type: "submit",
                    disabled: !h.value.title.trim() || !h.value.content.trim()
                  }, a(h.value.id ? "保存" : "添加"), 9, vi),
                  h.value.id ? (n(), i("button", {
                    key: 0,
                    type: "button",
                    class: "btn btn-tonal",
                    onClick: s[48] || (s[48] = (e) => h.value = { id: "", kind: "worldview", title: "", content: "", tags: "" })
                  }, "取消编辑")) : u("", !0)
                ])
              ], 32),
              t("div", mi, [
                t("button", {
                  class: y(["btn btn-sm", W.value === "" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[49] || (s[49] = (e) => W.value = "")
                }, "全部", 2),
                (n(), i(m, null, _(zt, (e) => t("button", {
                  key: e,
                  class: y(["btn btn-sm", W.value === e ? "btn-primary" : "btn-tonal"]),
                  onClick: (o) => W.value = e
                }, a(e), 11, _i)), 64))
              ])
            ]),
            t("article", bi, [
              s[118] || (s[118] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "条目")
              ], -1)),
              t("ul", gi, [
                (n(!0), i(m, null, _(Rt.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", yi, [
                    t("div", hi, [
                      t("strong", null, a(e.title), 1),
                      t("span", ki, a(e.kind), 1)
                    ]),
                    t("span", fi, a(e.content), 1),
                    e.tags ? (n(), i("span", wi, a(e.tags), 1)) : u("", !0)
                  ]),
                  t("div", Ci, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => Oe(e)
                    }, "编辑", 8, Si),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => Ie(e.id)
                    }, "删除", 8, xi)
                  ])
                ]))), 128)),
                Rt.value.length ? u("", !0) : (n(), i("li", Ui, "还没有条目"))
              ])
            ])
          ])
        ]),
        t("section", $i, [
          s[129] || (s[129] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", Vi, [
            t("article", ji, [
              t("div", Ni, [
                s[120] || (s[120] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", Mi, "待投递 " + a(dt.value.length), 1)
              ]),
              t("div", Fi, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: te
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: ut.value,
                  onClick: ee
                }, a(ut.value ? "检查中…" : "立即检查投递"), 9, Li)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(Xt, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[50] || (s[50] = (e) => f.value.target = e),
                  class: "input",
                  placeholder: "目标：session:<会话ID> / user:<QQ> / group:<群号>",
                  "aria-label": "主动对象"
                }, null, 512), [
                  [r, f.value.target]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[51] || (s[51] = (e) => f.value.motive = e),
                  class: "input",
                  placeholder: "动机，如 care / reminder",
                  "aria-label": "动机"
                }, null, 512), [
                  [r, f.value.motive]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[52] || (s[52] = (e) => f.value.preferred_at = e),
                  class: "input",
                  placeholder: "期望时间（可选，ISO）",
                  "aria-label": "期望时间"
                }, null, 512), [
                  [r, f.value.preferred_at]
                ]),
                d(t("textarea", {
                  "onUpdate:modelValue": s[53] || (s[53] = (e) => f.value.content = e),
                  class: "input area",
                  placeholder: "想说的内容…"
                }, null, 512), [
                  [r, f.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !f.value.target.trim() || !f.value.content.trim()
                }, "创建候选", 8, Di)
              ], 32),
              s[125] || (s[125] = t("h3", { class: "section-label" }, "候选队列", -1)),
              t("ul", Ti, [
                (n(!0), i(m, null, _(dt.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Ei, [
                    t("strong", null, a(e.target) + " · " + a(e.motive), 1),
                    t("span", Oi, a(e.content), 1),
                    t("span", qi, "状态 " + a(e.status) + " · " + a(T(e.created_at)), 1)
                  ]),
                  t("div", Ii, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => It(e.id)
                    }, "取消", 8, Pi)
                  ])
                ]))), 128)),
                dt.value.length ? u("", !0) : (n(), i("li", Ji, "没有待投递候选"))
              ]),
              s[126] || (s[126] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", Yi, [
                t("label", Bi, [
                  s[121] || (s[121] = t("span", null, "每日上限", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[54] || (s[54] = (e) => C.value.daily_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      C.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Ai, [
                  s[122] || (s[122] = t("span", null, "单人上限", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[55] || (s[55] = (e) => C.value.per_target_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      C.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Gi, [
                  s[123] || (s[123] = t("span", null, "免打扰起", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[56] || (s[56] = (e) => C.value.quiet_start = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      C.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", zi, [
                  s[124] || (s[124] = t("span", null, "免打扰止", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[57] || (s[57] = (e) => C.value.quiet_end = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      C.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Zt
                }, "保存策略")
              ]),
              s[127] || (s[127] = t("p", { class: "helper-inline" }, [
                k("免打扰起止相同即关闭；target 用 "),
                t("code", null, "session:<会话ID>"),
                k(" 可直接发到对话。")
              ], -1)),
              s[128] || (s[128] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", Ri, [
                (n(!0), i(m, null, _(wt.value, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, a(T(e.created_at)), 1),
                  t("p", null, a(e.phase) + " · " + a(e.content), 1)
                ]))), 128)),
                wt.value.length ? u("", !0) : (n(), i("li", Hi, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", Wi, [
          s[137] || (s[137] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", Ki, [
            t("article", Qi, [
              t("div", Xi, [
                s[130] || (s[130] = t("h2", { class: "card-title" }, "群聊管理", -1)),
                t("span", Zi, a(mt.value.length), 1)
              ]),
              t("form", {
                class: "group-form",
                onSubmit: x(ye, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[58] || (s[58] = (e) => M.value.group_id = e),
                  class: "input",
                  placeholder: "群号",
                  "aria-label": "群号"
                }, null, 512), [
                  [r, M.value.group_id]
                ]),
                d(t("select", {
                  "onUpdate:modelValue": s[59] || (s[59] = (e) => M.value.policy = e),
                  class: "input policy-select",
                  "aria-label": "策略"
                }, [...s[131] || (s[131] = [
                  t("option", { value: "observe" }, "观察", -1),
                  t("option", { value: "whitelist" }, "白名单", -1),
                  t("option", { value: "blacklist" }, "黑名单", -1)
                ])], 512), [
                  [Ft, M.value.policy]
                ]),
                d(t("input", {
                  "onUpdate:modelValue": s[60] || (s[60] = (e) => M.value.alias = e),
                  class: "input",
                  placeholder: "备注名（可选）",
                  "aria-label": "备注名"
                }, null, 512), [
                  [r, M.value.alias]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !M.value.group_id.trim()
                }, "添加群", 8, to)
              ], 32),
              t("ul", eo, [
                (n(!0), i(m, null, _(mt.value, (e) => (n(), i("li", {
                  key: e.group_id,
                  class: "item group-item"
                }, [
                  t("div", so, [
                    t("div", lo, [
                      t("strong", null, a(e.group_id), 1),
                      e.alias ? (n(), i("span", ao, a(e.alias), 1)) : u("", !0),
                      t("span", {
                        class: y(["chip", e.policy === "blacklist" ? "chip-warn" : e.policy === "whitelist" ? "chip-ok" : "muted"])
                      }, a(e.policy), 3)
                    ]),
                    t("span", no, a(e.observations) + " 条观察 · " + a(e.topics) + " 个话题", 1),
                    J.value === e.group_id ? (n(), i("div", io, [
                      s[134] || (s[134] = t("h4", { class: "section-label" }, "黑话 / 话题", -1)),
                      t("div", oo, [
                        (n(!0), i(m, null, _(jt.value[e.group_id] || [], (o) => (n(), i("span", {
                          key: o.topic,
                          class: "chip muted"
                        }, [
                          k(a(o.topic) + " · " + a(Math.round(o.score)), 1),
                          t("button", {
                            class: "chip-x",
                            onClick: (G) => Se(e.group_id, o.topic)
                          }, "×", 8, uo)
                        ]))), 128)),
                        (jt.value[e.group_id] || []).length ? u("", !0) : (n(), i("span", ro, "暂无"))
                      ]),
                      t("form", {
                        class: "slang-form",
                        onSubmit: x((o) => Ce(e.group_id), ["prevent"])
                      }, [
                        d(t("input", {
                          "onUpdate:modelValue": (o) => _t.value[e.group_id] = o,
                          class: "input",
                          placeholder: "新增黑话 / 话题",
                          "aria-label": "新增黑话"
                        }, null, 8, po), [
                          [r, _t.value[e.group_id]]
                        ]),
                        s[132] || (s[132] = t("button", {
                          class: "btn btn-tonal btn-sm",
                          type: "submit"
                        }, "添加", -1))
                      ], 40, co),
                      s[135] || (s[135] = t("h4", { class: "section-label" }, "成员安全", -1)),
                      t("ul", vo, [
                        (n(!0), i(m, null, _(Nt.value[e.group_id] || [], (o) => (n(), i("li", {
                          key: o.user_id,
                          class: "member-row"
                        }, [
                          t("span", mo, a(o.user_id), 1),
                          t("span", _o, a(o.messages) + " 条 · " + a(T(o.last_at)), 1),
                          t("select", {
                            class: "input flag-select",
                            value: o.flag,
                            onChange: (G) => fe(e.group_id, o.user_id, G)
                          }, [...s[133] || (s[133] = [
                            t("option", { value: "watch" }, "关注", -1),
                            t("option", { value: "allow" }, "放行", -1),
                            t("option", { value: "mute" }, "禁言", -1)
                          ])], 40, bo)
                        ]))), 128)),
                        (Nt.value[e.group_id] || []).length ? u("", !0) : (n(), i("li", go, "暂无成员观察"))
                      ])
                    ])) : u("", !0)
                  ]),
                  t("div", yo, [
                    t("select", {
                      class: "input policy-select",
                      value: e.policy,
                      onChange: (o) => ke(e, o)
                    }, [...s[136] || (s[136] = [
                      t("option", { value: "observe" }, "观察", -1),
                      t("option", { value: "whitelist" }, "白名单", -1),
                      t("option", { value: "blacklist" }, "黑名单", -1)
                    ])], 40, ho),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => we(e.group_id)
                    }, a(J.value === e.group_id ? "收起" : "管理"), 9, ko),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => he(e.group_id)
                    }, "删除", 8, fo)
                  ])
                ]))), 128)),
                mt.value.length ? u("", !0) : (n(), i("li", wo, "还没有群记录。收到群消息或在上面添加。"))
              ])
            ])
          ])
        ]),
        t("section", Co, [
          s[153] || (s[153] = t("h2", { class: "group-title" }, "配置", -1)),
          t("div", So, [
            t("article", xo, [
              t("div", { class: "card-head" }, [
                s[138] || (s[138] = t("h2", { class: "card-title" }, "运行设置", -1)),
                t("button", {
                  class: "btn btn-primary btn-sm",
                  onClick: Le
                }, "保存")
              ]),
              t("div", Uo, [
                t("label", $o, [
                  s[139] || (s[139] = t("span", null, "每日主动上限", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[61] || (s[61] = (e) => g.value.proactive_daily_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      g.value.proactive_daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Vo, [
                  s[140] || (s[140] = t("span", null, "单人上限", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[62] || (s[62] = (e) => g.value.proactive_target_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      g.value.proactive_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", jo, [
                  s[141] || (s[141] = t("span", null, "免打扰起", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[63] || (s[63] = (e) => g.value.quiet_start = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      g.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", No, [
                  s[142] || (s[142] = t("span", null, "免打扰止", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[64] || (s[64] = (e) => g.value.quiet_end = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      g.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Mo, [
                  s[143] || (s[143] = t("span", null, "空闲分钟", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[65] || (s[65] = (e) => g.value.idle_minutes = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      g.value.idle_minutes,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Fo, [
                  s[144] || (s[144] = t("span", null, "最小间隔(分)", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[66] || (s[66] = (e) => g.value.min_interval_minutes = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      g.value.min_interval_minutes,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Lo, [
                  s[145] || (s[145] = t("span", null, "检查间隔(秒)", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[67] || (s[67] = (e) => g.value.check_interval_seconds = e),
                    type: "number",
                    min: "60",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      g.value.check_interval_seconds,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Do, [
                  s[146] || (s[146] = t("span", null, "连发上限", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[68] || (s[68] = (e) => g.value.burst_max = e),
                    type: "number",
                    min: "1",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      g.value.burst_max,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", To, [
                  s[147] || (s[147] = t("span", null, "每日 Token", -1)),
                  d(t("input", {
                    "onUpdate:modelValue": s[69] || (s[69] = (e) => g.value.daily_token_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      r,
                      g.value.daily_token_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ])
              ]),
              t("div", Eo, [
                t("label", Oo, [
                  d(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[70] || (s[70] = (e) => g.value.enable_proactive = e)
                  }, null, 512), [
                    [ht, g.value.enable_proactive]
                  ]),
                  s[148] || (s[148] = k(" 启用主动消息", -1))
                ]),
                t("label", qo, [
                  d(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[71] || (s[71] = (e) => g.value.enable_group_observe = e)
                  }, null, 512), [
                    [ht, g.value.enable_group_observe]
                  ]),
                  s[149] || (s[149] = k(" 群聊观察", -1))
                ]),
                t("label", Io, [
                  d(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[72] || (s[72] = (e) => g.value.enable_dream = e)
                  }, null, 512), [
                    [ht, g.value.enable_dream]
                  ]),
                  s[150] || (s[150] = k(" 梦境生成", -1))
                ])
              ])
            ]),
            t("article", Po, [
              t("div", { class: "card-head" }, [
                s[151] || (s[151] = t("h2", { class: "card-title" }, "数据导入导出", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: De
                }, "导出 JSON")
              ]),
              d(t("textarea", {
                "onUpdate:modelValue": s[73] || (s[73] = (e) => H.value = e),
                class: "input area",
                placeholder: "粘贴导出的配置 JSON 后点导入…"
              }, null, 512), [
                [r, H.value]
              ]),
              t("button", {
                class: "btn btn-primary btn-sm",
                onClick: Te,
                disabled: !H.value.trim()
              }, "导入", 8, Jo),
              s[152] || (s[152] = t("p", { class: "helper-inline" }, "合并设置、目标、菜单、技能、表达、重要日期等，不会删除已有数据。", -1))
            ])
          ])
        ]),
        t("section", Yo, [
          s[160] || (s[160] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", Bo, [
            t("article", Ao, [
              t("div", Go, [
                s[154] || (s[154] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", zo, a(D.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", Ro, [
                t("div", Ho, [
                  t("strong", null, a((D.value?.total_tokens || 0).toLocaleString()), 1),
                  s[155] || (s[155] = t("span", null, "总 Token", -1))
                ]),
                t("div", Wo, [
                  t("strong", null, a((D.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  s[156] || (s[156] = t("span", null, "输入", -1))
                ]),
                t("div", Ko, [
                  t("strong", null, a((D.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  s[157] || (s[157] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", Qo, [
                (n(!0), i(m, null, _(D.value?.by_model || {}, (e, o) => (n(), i("li", {
                  key: o,
                  class: "item"
                }, [
                  t("div", Xo, [
                    t("strong", null, a(o), 1),
                    t("span", Zo, a((e.total || 0).toLocaleString()) + " tokens · " + a(e.count) + " 次", 1)
                  ])
                ]))), 128)),
                !D.value || !Object.keys(D.value.by_model || {}).length ? (n(), i("li", td, "暂无用量记录")) : u("", !0)
              ])
            ]),
            t("article", ed, [
              t("div", { class: "card-head" }, [
                s[158] || (s[158] = t("h2", { class: "card-title" }, "排障检查", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Ee
                }, "运行诊断")
              ]),
              t("ul", sd, [
                (n(!0), i(m, null, _(et.value?.checks || [], (e) => (n(), i("li", {
                  key: e.name,
                  class: "item"
                }, [
                  t("div", ld, [
                    t("strong", null, a(e.name), 1),
                    t("span", ad, a(e.detail), 1)
                  ]),
                  t("span", {
                    class: y(["chip", e.status === "ok" ? "chip-ok" : e.status === "warn" ? "chip-warn" : "muted"])
                  }, a(e.status), 3)
                ]))), 128)),
                et.value ? u("", !0) : (n(), i("li", nd, "点击“运行诊断”查看检查项"))
              ]),
              et.value ? (n(), i("div", id, [
                (n(!0), i(m, null, _(et.value.counts, (e, o) => (n(), i("div", {
                  key: o,
                  class: "kv"
                }, [
                  t("span", null, a(o), 1),
                  t("strong", null, a(e), 1)
                ]))), 128))
              ])) : u("", !0)
            ]),
            t("article", od, [
              t("div", dd, [
                s[159] || (s[159] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: s[74] || (s[74] = (e) => p("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", ud, [
                (n(!0), i(m, null, _(c.value.audit, (e) => (n(), i("li", {
                  key: e.at + e.kind
                }, [
                  t("span", {
                    class: y(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", rd, [
                    t("div", cd, [
                      t("strong", null, a(e.kind), 1),
                      t("span", {
                        class: y(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, a(e.outcome), 3),
                      t("time", null, a(e.at), 1)
                    ]),
                    t("p", pd, a(e.target), 1),
                    t("p", vd, a(e.detail), 1)
                  ])
                ]))), 128)),
                c.value.audit?.length ? u("", !0) : (n(), i("li", md, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), hd = /* @__PURE__ */ Be(_d, [["__scopeId", "data-v-3402080a"]]);
export {
  hd as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-3402080a]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-3402080a]{max-width:1180px;margin:0 auto}.page-header[data-v-3402080a]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-3402080a]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-3402080a]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-3402080a]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-3402080a]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-3402080a]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-3402080a]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-3402080a]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-3402080a]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-3402080a]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-3402080a]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-3402080a]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-3402080a]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-3402080a]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-3402080a]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-3402080a]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-3402080a]{display:flex;align-items:center;gap:10px}.stat-label[data-v-3402080a]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-3402080a]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-3402080a]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-3402080a]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-3402080a]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-3402080a]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-3402080a]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-3402080a]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-3402080a]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-3402080a]{margin-bottom:var(--space-lg)}.group-title[data-v-3402080a]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-3402080a]{margin-bottom:0}.card[data-v-3402080a]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-3402080a]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-3402080a]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-3402080a]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-3402080a]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-3402080a]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-3402080a]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-3402080a]{background:#fff1dc;color:#7a4400}.input[data-v-3402080a]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-3402080a]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-3402080a]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-3402080a]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-3402080a]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-3402080a]{grid-column:1/-1}.stack-form[data-v-3402080a]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-3402080a]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-3402080a]{align-self:flex-start}.item-list[data-v-3402080a],.rel-list[data-v-3402080a],.feed[data-v-3402080a],.timeline[data-v-3402080a]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-3402080a]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-3402080a]{align-items:flex-start}.item[data-v-3402080a]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-3402080a]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-3402080a]{font-size:14px;font-weight:600}.item-main strong.done[data-v-3402080a]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-3402080a]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-3402080a]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-3402080a]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-3402080a]{background:transparent;border:0}.check-label[data-v-3402080a]{display:flex;align-items:center}.check-line[data-v-3402080a]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-3402080a]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-3402080a]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-3402080a]{background:#fff1dc;color:#7a4400}.head-actions[data-v-3402080a]{display:flex;gap:8px}.item-row[data-v-3402080a]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hint-inline[data-v-3402080a]{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}.helper-inline[data-v-3402080a]{margin:8px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.helper-inline code[data-v-3402080a]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:2px 6px;border-radius:6px}.check-label input[data-v-3402080a]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-3402080a]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-3402080a]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-3402080a]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-3402080a]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-3402080a],.rel-meter[data-v-3402080a]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-3402080a]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-3402080a]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-3402080a]{font-size:12px}.rel-actions[data-v-3402080a]{display:flex;gap:4px}.ledger[data-v-3402080a]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.user-tools[data-v-3402080a]{display:flex;gap:10px;margin-bottom:12px}.user-stage[data-v-3402080a]{width:130px;flex:0 0 auto}.rel[data-v-3402080a]{cursor:pointer}.rel-chevron[data-v-3402080a]{font-size:20px;color:var(--md-on-surface-variant);flex-shrink:0}.detail-head[data-v-3402080a]{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}.tabs[data-v-3402080a]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tab[data-v-3402080a]{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:600 12.5px/1 inherit;cursor:pointer}.tab[data-v-3402080a]:hover{border-color:var(--md-primary)}.tab.active[data-v-3402080a]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}.detail-body[data-v-3402080a]{display:flex;flex-direction:column;gap:6px}.kv-grid[data-v-3402080a]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.kv[data-v-3402080a]{background:var(--md-surface-container-low);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:4px}.kv span[data-v-3402080a]{font-size:12px;color:var(--md-on-surface-variant)}.kv strong[data-v-3402080a]{font-size:20px;font-weight:700}.rel-meter.big[data-v-3402080a]{margin:6px 0}.rel-meter.big b[data-v-3402080a]{font-size:15px}.mem-text[data-v-3402080a]{font-weight:500!important;line-height:1.6}.cal-card[data-v-3402080a]{grid-column:1/-1}.cal-month[data-v-3402080a]{font-size:14px;font-weight:700;min-width:76px;text-align:center}.cal-week[data-v-3402080a]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}.cal-week span[data-v-3402080a]{text-align:center;font-size:11px;color:var(--md-on-surface-variant);font-weight:600}.cal-grid[data-v-3402080a]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-cell[data-v-3402080a]{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}.cal-cell.empty[data-v-3402080a]{border-color:transparent;background:transparent}.cal-cell.today[data-v-3402080a]{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 18%,transparent)}.cal-cell.has[data-v-3402080a]{background:var(--md-surface-container-low)}.cal-day[data-v-3402080a]{font-size:12px;font-weight:700;color:var(--md-on-surface-variant)}.cal-chip[data-v-3402080a]{font-size:10.5px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-more[data-v-3402080a]{font-size:10px;color:var(--md-on-surface-variant)}.cal-warn[data-v-3402080a]{margin:12px 0 0;padding:8px 12px;border-radius:10px;background:#fff1dc;color:#7a4400;font-size:12.5px}.cloud[data-v-3402080a]{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}.cloud-word[data-v-3402080a]{font-weight:700;color:var(--md-primary);line-height:1.2}.group-form[data-v-3402080a]{display:grid;grid-template-columns:1fr 120px 1fr auto;gap:10px;margin-bottom:12px}.policy-select[data-v-3402080a]{width:auto;height:34px;flex:0 0 auto}.flag-select[data-v-3402080a]{width:auto;height:30px;flex:0 0 auto;font-size:12px}.slang-form[data-v-3402080a]{display:flex;gap:8px;margin:8px 0}.slang-form .input[data-v-3402080a]{height:34px}.chip-x[data-v-3402080a]{border:0;background:transparent;color:inherit;cursor:pointer;font-weight:700;margin-left:4px}.member-list[data-v-3402080a]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.member-row[data-v-3402080a]{display:flex;align-items:center;gap:10px;font-size:12.5px}.member-id[data-v-3402080a]{font-weight:600;min-width:80px}.member-row .item-meta[data-v-3402080a]{flex:1}.form-row[data-v-3402080a]{display:flex;gap:10px}.form-row .input[data-v-3402080a]{flex:1}.scene-input[data-v-3402080a]{width:120px;flex:0 0 auto}.settings-grid[data-v-3402080a]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px}.toggle-row[data-v-3402080a]{display:flex;gap:16px;flex-wrap:wrap}.select span[data-v-3402080a]{white-space:nowrap}.world-kind[data-v-3402080a]{width:130px;flex:0 0 auto}.world-filter[data-v-3402080a]{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}.world-content[data-v-3402080a]{white-space:pre-wrap}.book[data-v-3402080a]{border:1px solid var(--md-outline-variant);border-radius:14px;background:linear-gradient(180deg,var(--md-surface-container-lowest),var(--md-surface-container-low));padding:16px 18px}.book-nav[data-v-3402080a]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.book-date[data-v-3402080a]{width:auto;height:34px;flex:0 0 auto}.book-page[data-v-3402080a]{min-height:120px;border-top:1px solid var(--md-outline-variant);padding-top:14px}.book-heading[data-v-3402080a]{margin:0 0 10px;font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--md-on-surface-variant);letter-spacing:.02em}.book-body[data-v-3402080a]{display:flex;flex-direction:column;gap:10px}.book-body p[data-v-3402080a]{margin:0;font-size:14px;line-height:1.95;text-indent:2em;color:var(--md-on-surface);white-space:pre-wrap;overflow-wrap:anywhere}.book-empty[data-v-3402080a]{margin:0;font-size:13px;color:var(--md-on-surface-variant);font-style:italic}.diary-manual[data-v-3402080a]{margin-top:14px;border-top:1px dashed var(--md-outline-variant);padding-top:12px}.feed li[data-v-3402080a]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-3402080a]{padding:8px 12px}.feed time[data-v-3402080a],.timeline time[data-v-3402080a]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-3402080a]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-3402080a]{color:var(--md-success);font-weight:700}.neg[data-v-3402080a]{color:var(--md-error);font-weight:700}.policy[data-v-3402080a]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-3402080a]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-3402080a]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-3402080a]{margin-top:6px}.audit-card[data-v-3402080a]{margin-bottom:var(--space-lg)}.usage-grid[data-v-3402080a]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-3402080a]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-3402080a]{font-size:20px;font-weight:700}.usage-item span[data-v-3402080a]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-3402080a]{position:relative}.timeline li[data-v-3402080a]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-3402080a]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-3402080a]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-3402080a]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-3402080a]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-3402080a]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-3402080a]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-3402080a]{font-size:13.5px;font-weight:650}.tl-detail[data-v-3402080a]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-3402080a]{grid-template-columns:repeat(2,1fr)}.grid[data-v-3402080a],.agenda-form[data-v-3402080a]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-3402080a]{padding:var(--space-lg)}.header-actions[data-v-3402080a]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
