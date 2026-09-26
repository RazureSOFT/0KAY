import { defineComponent as Je, ref as v, computed as V, onMounted as Ye, openBlock as n, createElementBlock as i, createElementVNode as t, toDisplayString as a, createCommentVNode as u, createStaticVNode as yt, normalizeClass as y, withModifiers as x, withDirectives as d, vModelText as r, Fragment as m, renderList as _, createTextVNode as k, vModelCheckbox as ht, normalizeStyle as kt, vModelSelect as Ft } from "vue";
import { u as Be, _ as Ae } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const Ge = { class: "page" }, ze = { class: "page-inner" }, Re = { class: "page-header" }, He = { class: "header-actions" }, We = ["disabled"], Ke = ["disabled"], Qe = {
  key: 0,
  class: "error-banner"
}, Xe = {
  key: 1,
  class: "notice"
}, Ze = { class: "stat-grid" }, ts = { class: "stat-card" }, es = { class: "stat-value" }, ss = { class: "stat-card" }, ls = { class: "stat-value" }, as = { class: "stat-card" }, ns = { class: "stat-value" }, is = { class: "stat-hint" }, os = { class: "stat-card" }, ds = { class: "stat-value" }, us = { class: "life-state" }, rs = { class: "state-pill" }, cs = {
  key: 0,
  class: "state-pill"
}, ps = { class: "group" }, vs = { class: "grid" }, ms = { class: "card" }, _s = { class: "item-list" }, bs = { class: "item-main" }, gs = { class: "item-meta" }, ys = { class: "item-actions" }, hs = ["onClick"], ks = ["onClick"], fs = {
  key: 0,
  class: "list-empty"
}, ws = { class: "item-list" }, Cs = { class: "item-main" }, Ss = { class: "item-row" }, xs = { class: "item-meta" }, Us = {
  key: 0,
  class: "list-empty"
}, $s = { class: "card" }, Vs = { class: "card-head" }, js = { class: "chip muted" }, Ns = { class: "check-line" }, Ms = ["disabled"], Fs = { class: "item-list" }, Ls = { class: "item-main" }, Ts = { class: "item-meta" }, Ds = { class: "item-actions" }, Es = ["onClick"], Os = {
  key: 0,
  class: "list-empty"
}, qs = { class: "card" }, Is = { class: "card-head" }, Ps = { class: "head-actions" }, Js = ["disabled"], Ys = { class: "book" }, Bs = { class: "book-nav" }, As = ["disabled"], Gs = ["disabled"], zs = { class: "book-page" }, Rs = { class: "book-heading" }, Hs = {
  key: 0,
  class: "book-body"
}, Ws = {
  key: 1,
  class: "book-empty"
}, Ks = { class: "card" }, Qs = { class: "card-head" }, Xs = { class: "head-actions" }, Zs = ["disabled"], tl = { class: "feed" }, el = {
  key: 0,
  class: "list-empty plain"
}, sl = { class: "group" }, ll = { class: "grid" }, al = { class: "card cal-card" }, nl = { class: "card-head" }, il = { class: "head-actions" }, ol = { class: "cal-month" }, dl = { class: "cal-week" }, ul = { class: "cal-grid" }, rl = {
  key: 0,
  class: "cal-day"
}, cl = ["title"], pl = {
  key: 1,
  class: "cal-more"
}, vl = {
  key: 0,
  class: "cal-warn"
}, ml = { class: "section-label" }, _l = { class: "item-list" }, bl = { class: "item-main" }, gl = { class: "item-meta" }, yl = { class: "item-actions" }, hl = ["onClick"], kl = ["onClick"], fl = {
  key: 0,
  class: "list-empty"
}, wl = { class: "card" }, Cl = { class: "card-head" }, Sl = { class: "chip muted" }, xl = ["disabled"], Ul = { class: "item-list" }, $l = { class: "item-main" }, Vl = { class: "item-row" }, jl = { class: "meter-bar" }, Nl = {
  key: 0,
  class: "item-meta"
}, Ml = { class: "item-actions" }, Fl = ["onClick"], Ll = ["onClick"], Tl = {
  key: 0,
  class: "list-empty"
}, Dl = { class: "card" }, El = { class: "card-head" }, Ol = { class: "chip muted" }, ql = ["disabled"], Il = { class: "item-list" }, Pl = { class: "item-main" }, Jl = { class: "item-meta" }, Yl = { class: "item-actions" }, Bl = ["onClick"], Al = {
  key: 0,
  class: "list-empty"
}, Gl = { class: "card" }, zl = { class: "card-head" }, Rl = { class: "chip muted" }, Hl = { class: "cloud" }, Wl = {
  key: 0,
  class: "list-empty plain"
}, Kl = { class: "group" }, Ql = { class: "grid" }, Xl = { class: "card" }, Zl = { class: "card-head" }, ta = { class: "card-title" }, ea = {
  key: 1,
  class: "chip muted"
}, sa = { class: "user-tools" }, la = ["value"], aa = { class: "rel-list" }, na = ["onClick"], ia = { class: "avatar" }, oa = { class: "rel-main" }, da = { class: "rel-top" }, ua = { class: "chip" }, ra = { class: "rel-meter" }, ca = { class: "meter-bar" }, pa = { class: "item-meta" }, va = {
  key: 0,
  class: "list-empty"
}, ma = {
  key: 1,
  class: "list-empty"
}, _a = { class: "detail-head" }, ba = { class: "avatar" }, ga = { class: "rel-main" }, ya = { class: "item-meta" }, ha = { class: "tabs" }, ka = ["onClick"], fa = {
  key: 0,
  class: "detail-body"
}, wa = { class: "kv-grid" }, Ca = { class: "kv" }, Sa = { class: "kv" }, xa = { class: "kv" }, Ua = { class: "kv" }, $a = { class: "kv" }, Va = { class: "feed compact" }, ja = {
  key: 0,
  class: "list-empty plain"
}, Na = {
  key: 1,
  class: "detail-body"
}, Ma = { class: "rel-meter big" }, Fa = { class: "meter-bar" }, La = { class: "rel-actions" }, Ta = { class: "feed compact" }, Da = {
  key: 0,
  class: "list-empty plain"
}, Ea = {
  key: 2,
  class: "detail-body"
}, Oa = { class: "item-list" }, qa = { class: "item-main" }, Ia = { class: "item-meta" }, Pa = { class: "item-meta" }, Ja = { class: "item-actions" }, Ya = ["onClick"], Ba = {
  key: 0,
  class: "list-empty"
}, Aa = { class: "feed compact" }, Ga = {
  key: 0,
  class: "list-empty plain"
}, za = {
  key: 3,
  class: "detail-body"
}, Ra = { class: "item-list" }, Ha = { class: "item-main" }, Wa = { class: "mem-text" }, Ka = { class: "item-meta" }, Qa = { class: "item-actions" }, Xa = ["onClick"], Za = {
  key: 0,
  class: "list-empty"
}, tn = {
  key: 4,
  class: "detail-body"
}, en = { class: "timeline" }, sn = { class: "tl-body" }, ln = { class: "tl-head" }, an = { class: "item-meta" }, nn = { class: "tl-detail" }, on = {
  key: 0,
  class: "list-empty plain"
}, dn = { class: "card" }, un = { class: "item-list" }, rn = { class: "item-main" }, cn = { class: "item-meta" }, pn = { class: "chip" }, vn = {
  key: 0,
  class: "list-empty"
}, mn = { class: "group" }, _n = { class: "grid" }, bn = { class: "card" }, gn = { class: "card-head" }, yn = { class: "chip muted" }, hn = { class: "form-row" }, kn = ["disabled"], fn = { class: "item-list" }, wn = { class: "item-main" }, Cn = { class: "item-row" }, Sn = { class: "chip muted" }, xn = { class: "chip" }, Un = {
  key: 0,
  class: "item-meta"
}, $n = { class: "item-actions" }, Vn = ["onClick"], jn = {
  key: 0,
  class: "list-empty"
}, Nn = { class: "card" }, Mn = { class: "card-head" }, Fn = { class: "chip muted" }, Ln = { class: "toolbar-inline" }, Tn = ["disabled"], Dn = { class: "item-list" }, En = { class: "item-main" }, On = { class: "item-meta" }, qn = { class: "item-actions" }, In = ["onClick"], Pn = ["onClick"], Jn = ["onClick"], Yn = {
  key: 0,
  class: "list-empty"
}, Bn = { class: "card" }, An = { class: "card-head" }, Gn = { class: "chip muted" }, zn = { class: "form-row" }, Rn = ["disabled"], Hn = { class: "item-list" }, Wn = { class: "item-main" }, Kn = { class: "item-meta" }, Qn = {
  key: 0,
  class: "list-empty"
}, Xn = ["disabled"], Zn = { class: "item-list" }, ti = { class: "item-main" }, ei = { class: "item-meta" }, si = { class: "item-actions" }, li = ["onClick"], ai = {
  key: 0,
  class: "list-empty"
}, ni = { class: "group" }, ii = { class: "grid" }, oi = { class: "card" }, di = { class: "card-head" }, ui = { class: "card-title" }, ri = { class: "chip muted" }, ci = { class: "form-row" }, pi = ["value"], vi = { class: "toolbar-inline" }, mi = ["disabled"], _i = { class: "world-filter" }, bi = ["onClick"], gi = { class: "card" }, yi = { class: "item-list" }, hi = { class: "item-main" }, ki = { class: "item-row" }, fi = { class: "chip muted" }, wi = { class: "item-meta world-content" }, Ci = {
  key: 0,
  class: "item-meta"
}, Si = { class: "item-actions" }, xi = ["onClick"], Ui = ["onClick"], $i = {
  key: 0,
  class: "list-empty"
}, Vi = { class: "group" }, ji = { class: "grid" }, Ni = { class: "card" }, Mi = { class: "card-head" }, Fi = { class: "chip muted" }, Li = { class: "toolbar-inline" }, Ti = ["disabled"], Di = ["disabled"], Ei = { class: "item-list" }, Oi = { class: "item-main" }, qi = { class: "item-meta" }, Ii = { class: "item-meta" }, Pi = { class: "item-actions" }, Ji = ["onClick"], Yi = {
  key: 0,
  class: "list-empty"
}, Bi = { class: "policy" }, Ai = { class: "select" }, Gi = { class: "select" }, zi = { class: "select" }, Ri = { class: "select" }, Hi = { class: "feed" }, Wi = {
  key: 0,
  class: "list-empty plain"
}, Ki = { class: "group" }, Qi = { class: "grid" }, Xi = { class: "card" }, Zi = { class: "card-head" }, to = { class: "chip muted" }, eo = ["disabled"], so = { class: "item-list" }, lo = { class: "item-main" }, ao = { class: "item-row" }, no = {
  key: 0,
  class: "chip muted"
}, io = { class: "item-meta" }, oo = {
  key: 0,
  class: "group-detail"
}, uo = { class: "topics" }, ro = ["onClick"], co = {
  key: 0,
  class: "item-meta"
}, po = ["onSubmit"], vo = ["onUpdate:modelValue"], mo = { class: "member-list" }, _o = { class: "member-id" }, bo = { class: "item-meta" }, go = ["value", "onChange"], yo = {
  key: 0,
  class: "item-meta"
}, ho = { class: "item-actions" }, ko = ["value", "onChange"], fo = ["onClick"], wo = ["onClick"], Co = {
  key: 0,
  class: "list-empty"
}, So = { class: "group" }, xo = { class: "grid" }, Uo = { class: "card" }, $o = { class: "settings-grid" }, Vo = { class: "select" }, jo = { class: "select" }, No = { class: "select" }, Mo = { class: "select" }, Fo = { class: "select" }, Lo = { class: "select" }, To = { class: "select" }, Do = { class: "select" }, Eo = { class: "select" }, Oo = { class: "toggle-row" }, qo = { class: "check-line" }, Io = { class: "check-line" }, Po = { class: "check-line" }, Jo = { class: "card" }, Yo = ["disabled"], Bo = { class: "group" }, Ao = { class: "grid" }, Go = { class: "card audit-card" }, zo = { class: "card-head" }, Ro = { class: "chip muted" }, Ho = { class: "usage-grid" }, Wo = { class: "usage-item" }, Ko = { class: "usage-item" }, Qo = { class: "usage-item" }, Xo = { class: "item-list" }, Zo = { class: "item-main" }, td = { class: "item-meta" }, ed = {
  key: 0,
  class: "list-empty"
}, sd = { class: "card audit-card" }, ld = { class: "item-list" }, ad = { class: "item-main" }, nd = { class: "item-meta" }, id = {
  key: 0,
  class: "list-empty"
}, od = {
  key: 0,
  class: "kv-grid"
}, dd = { class: "card audit-card" }, ud = { class: "card-head" }, rd = { class: "timeline" }, cd = { class: "tl-body" }, pd = { class: "tl-head" }, vd = { class: "item-meta" }, md = { class: "tl-detail" }, _d = {
  key: 0,
  class: "list-empty plain"
}, bd = /* @__PURE__ */ Je({
  __name: "CompanionPage",
  setup(gd) {
    const { confirm: Wt } = Be(), c = v({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), st = v(!1), j = v(""), K = v(""), Q = v(""), lt = v(""), at = v(""), nt = v(""), it = v(""), ot = () => {
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
    function Tt(l) {
      const s = l === "previous" ? L.value.previous : L.value.next;
      s && ft(s);
    }
    const J = v(""), f = v({ target: "", motive: "", content: "", preferred_at: "" }), C = v({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), Kt = V(() => Object.entries(c.value.groups || {})), dt = V(() => (c.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), wt = V(() => c.value.proactive?.receipts || []), Dt = ot(), Ct = V(() => (c.value.agenda || []).filter((l) => {
      const s = String(l.start_at || "").replace("T", " ");
      return !s || s.slice(0, 10) >= Dt;
    }));
    function w(l) {
      K.value = l, setTimeout(() => {
        K.value === l && (K.value = "");
      }, 2e3);
    }
    const T = v(null);
    async function Qt() {
      try {
        const l = await fetch("/api/usage");
        l.ok && (T.value = await l.json());
      } catch {
      }
    }
    async function z() {
      st.value = !0, j.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        c.value = await l.json(), c.value?.policy && (C.value = { ...C.value, ...c.value.policy }), Le();
      } catch (l) {
        j.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        st.value = !1;
      }
      Qt(), ft(), vt(), ye();
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
    async function Et(l, s) {
      const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: s }) });
      if (!e.ok) throw Error(await e.text());
      return await e.json().catch(() => ({}));
    }
    async function Xt() {
      Q.value.trim() && (await p("add_agenda", { title: Q.value, when: lt.value, detail: at.value }), Q.value = "", lt.value = "", at.value = "");
    }
    async function Ot(l, s) {
      s.trim() && (await p(l, { content: s }), l === "journal" ? nt.value = "" : it.value = "");
    }
    function St(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    function qt(l) {
      if (l.status === "completed") return { label: "已完成", cls: "chip-ok" };
      const s = new Date(String(l.start_at || "").replace(" ", "T"));
      return !Number.isNaN(s.getTime()) && s.getTime() <= Date.now() ? { label: "进行中", cls: "chip-warn" } : { label: "待开始", cls: "muted" };
    }
    async function It(l, s) {
      await p("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: s }) && w(`已调整 ${l}`);
    }
    async function Zt() {
      if (!f.value.target.trim() || !f.value.content.trim()) return;
      await p("proactive_create", { ...f.value }) && (f.value = { target: "", motive: "", content: "", preferred_at: "" }, w("已创建主动候选"));
    }
    async function Pt(l) {
      await p("proactive_cancel", { id: l, reason: "dashboard_cancel" }), w("已取消候选");
    }
    async function te() {
      await p("proactive_policy", { daily_limit: Number(C.value.daily_limit), per_target_limit: Number(C.value.per_target_limit), quiet_start: Number(C.value.quiet_start), quiet_end: Number(C.value.quiet_end) }), w("策略已保存");
    }
    const R = v("");
    async function Jt(l) {
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
    async function ee() {
      const l = f.value.target.trim() || "user:owner";
      await p("proactive_suggest", { target: l, hint: f.value.motive }) && (f.value = { target: "", motive: "", content: "", preferred_at: "" }, w("已生成建议候选"));
    }
    const ut = v(!1);
    async function se() {
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
    async function le() {
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
    async function ae() {
      !S.value.title.trim() || !S.value.date.trim() || (await p("date_add", { ...S.value }), S.value = { title: "", date: "", repeat_yearly: !0, note: "" }, w("已添加重要日期"));
    }
    async function ne(l) {
      await p("date_delete", { id: l }), w("已删除");
    }
    async function ie() {
      await p("circadian_eat", { amount: 45 }), w("已用餐");
    }
    async function oe() {
      const l = await p("daily_agenda", {});
      w(l?.created ? `LIFE 已安排 ${l.created} 项活动` : "今天已有安排");
    }
    async function Yt(l) {
      await Wt({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await p("journal_clear", { kind: l }), w("已清除"));
    }
    function D(l) {
      if (!l) return "";
      const s = new Date(l);
      return Number.isNaN(s.getTime()) ? l : s.toLocaleString();
    }
    const Y = v(""), ct = v(""), pt = v(""), b = v(null), Ut = v(!1), B = v("overview"), de = [{ key: "overview", label: "概览" }, { key: "relationship", label: "关系" }, { key: "proactive", label: "主动" }, { key: "memory", label: "记忆" }, { key: "diagnostics", label: "诊断" }], ue = V(() => Array.from(new Set((c.value.relationships || []).map((l) => l.stage).filter(Boolean)))), $t = V(() => (c.value.relationships || []).filter((l) => (!ct.value || String(l.user_id).toLowerCase().includes(ct.value.toLowerCase())) && (!pt.value || l.stage === pt.value)));
    async function Bt(l) {
      Y.value = l, B.value = "overview", Ut.value = !0;
      const s = await p("user_detail", { user_id: l, limit: 100, memory_limit: 100 });
      b.value = s || null, Ut.value = !1;
    }
    function re() {
      Y.value = "", b.value = null;
    }
    async function ce(l) {
      await p("delete_memory", { id: l }), Y.value && Bt(Y.value);
    }
    const tt = v(ot().slice(0, 7)), E = v({ events: [], candidates: [], conflicts: [] }), O = v({ title: "", detail: "", kind: "growth" }), q = v({ name: "", tags: "", note: "" }), Vt = V(() => c.value.word_cloud || []), pe = V(() => {
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
        Mt.push({ key: P, day: N, iso: P, events: G[P] || [], today: P === Dt });
      }
      return Mt;
    });
    async function vt() {
      try {
        const l = await Et("calendar_month", { month: tt.value });
        l && (E.value = l);
      } catch {
      }
    }
    function At(l) {
      const [s, e] = tt.value.split("-").map(Number), o = new Date(s, e - 1 + l, 1);
      tt.value = `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`, vt();
    }
    async function ve() {
      O.value.title.trim() && (await p("goal_add", { ...O.value }), O.value = { title: "", detail: "", kind: "growth" });
    }
    async function me(l) {
      await p("goal_update", { id: l, status: "done", progress: 1 });
    }
    async function _e(l) {
      await p("goal_delete", { id: l });
    }
    async function be() {
      q.value.name.trim() && (await p("food_add", { ...q.value }), q.value = { name: "", tags: "", note: "" });
    }
    async function ge(l) {
      await p("food_delete", { id: l });
    }
    const mt = v([]), M = v({ group_id: "", policy: "observe", alias: "" }), jt = v({}), Nt = v({}), _t = v({});
    async function ye() {
      try {
        const l = await Et("group_list", {});
        mt.value = l.groups || [];
      } catch {
      }
    }
    async function he() {
      M.value.group_id.trim() && (await p("group_upsert", { ...M.value }), M.value = { group_id: "", policy: "observe", alias: "" });
    }
    async function ke(l) {
      await p("group_delete", { group_id: l }), J.value === l && (J.value = "");
    }
    async function fe(l, s) {
      const e = s.target.value;
      await p("group_upsert", { group_id: l.group_id, policy: e, alias: l.alias || "", note: l.note || "" });
    }
    async function we(l, s, e) {
      const o = e.target.value;
      await p("group_member_flag", { group_id: l, user_id: s, flag: o }), bt(l);
    }
    async function bt(l) {
      const [s, e] = await Promise.all([p("group_slang_list", { group_id: l }), p("group_members", { group_id: l })]);
      jt.value[l] = s?.slang || [], Nt.value[l] = e?.members || [];
    }
    function Ce(l) {
      J.value = J.value === l ? "" : l, J.value && bt(l);
    }
    async function Se(l) {
      const s = (_t.value[l] || "").trim();
      s && (await p("group_slang_update", { group_id: l, topic: s, score: 1 }), _t.value[l] = "", bt(l));
    }
    async function xe(l, s) {
      await p("group_slang_delete", { group_id: l, topic: s }), bt(l);
    }
    const U = v({ name: "", category: "general", level: 1, keywords: "" }), I = v({ text: "", scene: "" }), A = v("pending"), F = v({ user_id: "", name: "", tags: "" }), $ = v({ source_id: "", target_id: "", relation: "" }), Gt = V(() => (c.value.expressions || []).filter((l) => l.status === A.value)), gt = V(() => {
      const l = c.value.expressions || [];
      return { pending: l.filter((s) => s.status === "pending").length, approved: l.filter((s) => s.status === "approved").length, rejected: l.filter((s) => s.status === "rejected").length };
    });
    async function Ue() {
      U.value.name.trim() && (await p("skill_add", { ...U.value, level: Number(U.value.level) }), U.value = { name: "", category: "general", level: 1, keywords: "" });
    }
    async function $e(l) {
      await p("skill_delete", { id: l });
    }
    async function Ve() {
      I.value.text.trim() && (await p("expression_add", { ...I.value }), I.value = { text: "", scene: "" });
    }
    async function zt(l, s) {
      await p("expression_review", { id: l, accept: s });
    }
    async function je(l) {
      await p("expression_delete", { id: l });
    }
    async function Ne() {
      F.value.user_id.trim() && (await p("social_node_upsert", { ...F.value }), F.value = { user_id: "", name: "", tags: "" });
    }
    async function Me() {
      !$.value.source_id.trim() || !$.value.target_id.trim() || (await p("social_edge_add", { ...$.value }), $.value = { source_id: "", target_id: "", relation: "" });
    }
    async function Fe(l) {
      await p("social_edge_delete", { id: l });
    }
    const g = v({}), et = v(null), H = v("");
    function Le() {
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
    async function Te() {
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
    async function Ee() {
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
    async function Oe() {
      const l = await p("diagnostics", {});
      l && (et.value = l);
    }
    const Rt = ["persona", "worldview", "style", "background", "wardrobe", "reference"], W = v(""), h = v({ id: "", kind: "worldview", title: "", content: "", tags: "" }), Ht = V(() => (c.value.world || []).filter((l) => !W.value || l.kind === W.value));
    function qe(l) {
      h.value = { id: l.id, kind: l.kind, title: l.title, content: l.content, tags: l.tags || "" };
    }
    async function Ie() {
      !h.value.title.trim() || !h.value.content.trim() || (await p("world_upsert", { ...h.value }), h.value = { id: "", kind: "worldview", title: "", content: "", tags: "" });
    }
    async function Pe(l) {
      await p("world_delete", { id: l });
    }
    return Ye(z), (l, s) => (n(), i("main", Ge, [
      t("div", ze, [
        t("header", Re, [
          s[75] || (s[75] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", He, [
            t("button", {
              class: "btn btn-primary",
              disabled: rt.value,
              onClick: le
            }, a(rt.value ? "规划中…" : "让 LIFE 规划"), 9, We),
            t("button", {
              class: "btn btn-tonal",
              disabled: st.value,
              onClick: z
            }, a(st.value ? "刷新中…" : "刷新"), 9, Ke)
          ])
        ]),
        j.value ? (n(), i("p", Qe, a(j.value), 1)) : u("", !0),
        K.value ? (n(), i("p", Xe, a(K.value), 1)) : u("", !0),
        t("section", Ze, [
          t("article", ts, [
            s[76] || (s[76] = yt('<div class="stat-head" data-v-8c41c87c><span class="icon-badge tone-1" aria-hidden="true" data-v-8c41c87c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-8c41c87c><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-8c41c87c></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-8c41c87c></path></svg></span><span class="stat-label" data-v-8c41c87c>关系对象</span></div>', 1)),
            t("strong", es, a(c.value.relationships?.length || 0), 1),
            s[77] || (s[77] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", ss, [
            s[78] || (s[78] = yt('<div class="stat-head" data-v-8c41c87c><span class="icon-badge tone-2" aria-hidden="true" data-v-8c41c87c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-8c41c87c><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-8c41c87c></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-8c41c87c></path></svg></span><span class="stat-label" data-v-8c41c87c>活动日程</span></div>', 1)),
            t("strong", ls, a(Ct.value.filter((e) => e.status === "active").length), 1),
            s[79] || (s[79] = t("span", { class: "stat-hint" }, "今天起待进行", -1))
          ]),
          t("article", as, [
            s[80] || (s[80] = yt('<div class="stat-head" data-v-8c41c87c><span class="icon-badge tone-3" aria-hidden="true" data-v-8c41c87c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-8c41c87c><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-8c41c87c></path></svg></span><span class="stat-label" data-v-8c41c87c>待投递主动行为</span></div>', 1)),
            t("strong", ns, a(dt.value.length), 1),
            t("span", is, "已投递 " + a(wt.value.length) + " 次", 1)
          ]),
          t("article", os, [
            s[81] || (s[81] = yt('<div class="stat-head" data-v-8c41c87c><span class="icon-badge tone-4" aria-hidden="true" data-v-8c41c87c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-8c41c87c><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-8c41c87c></path></svg></span><span class="stat-label" data-v-8c41c87c>已观察群聊</span></div>', 1)),
            t("strong", ds, a(Kt.value.length), 1),
            s[82] || (s[82] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", us, [
          t("span", rs, "精力 " + a(Math.round(c.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: y(["state-pill", { warn: (c.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + a(Math.round(c.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: y(["state-pill", { warn: (c.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + a(Math.round(c.value.circadian?.health ?? 100)), 3),
          c.value.circadian?.is_sleeping ? (n(), i("span", cs, "睡眠中")) : u("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: ie
          }, "吃饭")
        ]),
        t("section", ps, [
          s[93] || (s[93] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", vs, [
            t("article", ms, [
              t("div", { class: "card-head" }, [
                s[83] || (s[83] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: oe
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: x(Xt, ["prevent"])
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
              t("ul", _s, [
                (n(!0), i(m, null, _(c.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", bs, [
                    t("strong", null, a(e.title), 1),
                    t("span", gs, a(e.when_text) + " · " + a(e.detail || "等待你确认"), 1)
                  ]),
                  t("div", ys, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (o) => p("confirm_agenda", { id: e.id })
                    }, "确认", 8, hs),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => p("reject_agenda", { id: e.id })
                    }, "拒绝", 8, ks)
                  ])
                ]))), 128)),
                c.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? u("", !0) : (n(), i("li", fs, "没有待确认的日程候选"))
              ]),
              s[86] || (s[86] = t("h3", { class: "section-label" }, [
                k("今天的日程 "),
                t("small", { class: "hint-inline" }, "LIFE 按时间自动推进")
              ], -1)),
              t("ul", ws, [
                (n(!0), i(m, null, _(Ct.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Cs, [
                    t("div", Ss, [
                      t("strong", {
                        class: y({ done: e.status === "completed" })
                      }, a(e.title), 3),
                      t("span", {
                        class: y(["chip", qt(e).cls])
                      }, a(qt(e).label), 3)
                    ]),
                    t("span", xs, [
                      k(a(e.start_at), 1),
                      e.detail ? (n(), i(m, { key: 0 }, [
                        k(" · " + a(e.detail), 1)
                      ], 64)) : u("", !0)
                    ])
                  ])
                ]))), 128)),
                Ct.value.length ? u("", !0) : (n(), i("li", Us, "今天还没有安排，点右上角让 LIFE 安排。"))
              ])
            ]),
            t("article", $s, [
              t("div", Vs, [
                s[87] || (s[87] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", js, a((c.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(ae, ["prevent"])
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
                t("label", Ns, [
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
                }, "添加", 8, Ms)
              ], 32),
              t("ul", Fs, [
                (n(!0), i(m, null, _(c.value.important_dates, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Ls, [
                    t("strong", null, a(e.title), 1),
                    t("span", Ts, [
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
                      onClick: (o) => ne(e.id)
                    }, "删除", 8, Es)
                  ])
                ]))), 128)),
                c.value.important_dates?.length ? u("", !0) : (n(), i("li", Os, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", qs, [
              t("div", Is, [
                s[89] || (s[89] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", Ps, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[7] || (s[7] = (e) => Yt("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: R.value === "journal",
                    onClick: s[8] || (s[8] = (e) => Jt("journal"))
                  }, a(R.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, Js)
                ])
              ]),
              t("div", Ys, [
                t("div", Bs, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !L.value.previous || Z.value,
                    onClick: s[9] || (s[9] = (e) => Tt("previous"))
                  }, "← 前一页", 8, As),
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
                    onClick: s[12] || (s[12] = (e) => Tt("next"))
                  }, "后一页 →", 8, Gs)
                ]),
                t("div", zs, [
                  t("p", Rs, a(L.value.date), 1),
                  Lt.value.length ? (n(), i("div", Hs, [
                    (n(!0), i(m, null, _(Lt.value, (e, o) => (n(), i("p", { key: o }, a(e), 1))), 128))
                  ])) : (n(), i("p", Ws, a(Z.value ? "翻页中…" : "这一天还没有写下什么。"), 1))
                ])
              ]),
              t("form", {
                class: "stack-form diary-manual",
                onSubmit: s[14] || (s[14] = x((e) => Ot("journal", nt.value), ["prevent"]))
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
            t("article", Ks, [
              t("div", Qs, [
                s[91] || (s[91] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", Xs, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[15] || (s[15] = (e) => Yt("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: R.value === "dream",
                    onClick: s[16] || (s[16] = (e) => Jt("dream"))
                  }, a(R.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, Zs)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: s[18] || (s[18] = x((e) => Ot("dream", it.value), ["prevent"]))
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
              t("ol", tl, [
                (n(!0), i(m, null, _(c.value.dreams, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, a(e.at), 1),
                  t("p", null, a(e.content), 1)
                ]))), 128)),
                c.value.dreams?.length ? u("", !0) : (n(), i("li", el, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", sl, [
          s[98] || (s[98] = t("h2", { class: "group-title" }, "生活日历", -1)),
          t("div", ll, [
            t("article", al, [
              t("div", nl, [
                s[94] || (s[94] = t("h2", { class: "card-title" }, "生活日历", -1)),
                t("div", il, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[19] || (s[19] = (e) => At(-1))
                  }, "←"),
                  t("strong", ol, a(tt.value), 1),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: s[20] || (s[20] = (e) => At(1))
                  }, "→")
                ])
              ]),
              t("div", dl, [
                (n(), i(m, null, _(["日", "一", "二", "三", "四", "五", "六"], (e) => t("span", { key: e }, a(e), 1)), 64))
              ]),
              t("div", ul, [
                (n(!0), i(m, null, _(pe.value, (e) => (n(), i("div", {
                  key: e.key,
                  class: y(["cal-cell", { empty: e.empty, today: e.today, has: e.events?.length }])
                }, [
                  e.empty ? u("", !0) : (n(), i("span", rl, a(e.day), 1)),
                  (n(!0), i(m, null, _((e.events || []).slice(0, 2), (o) => (n(), i("span", {
                    key: o.id,
                    class: "cal-chip",
                    title: o.title
                  }, a(o.title), 9, cl))), 128)),
                  (e.events || []).length > 2 ? (n(), i("span", pl, "+" + a(e.events.length - 2), 1)) : u("", !0)
                ], 2))), 128))
              ]),
              E.value.conflicts?.length ? (n(), i("p", vl, "⚠ " + a(E.value.conflicts.length) + " 处时间冲突：" + a(E.value.conflicts.map((e) => e.titles.join(" / ")).join("；")), 1)) : u("", !0),
              t("h3", ml, "本月待确认候选 (" + a(E.value.candidates?.length || 0) + ")", 1),
              t("ul", _l, [
                (n(!0), i(m, null, _((E.value.candidates || []).slice(0, 6), (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", bl, [
                    t("strong", null, a(e.title), 1),
                    t("span", gl, a(e.when_text), 1)
                  ]),
                  t("div", yl, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (o) => p("confirm_agenda", { id: e.id }).then(vt)
                    }, "确认", 8, hl),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => p("reject_agenda", { id: e.id }).then(vt)
                    }, "拒绝", 8, kl)
                  ])
                ]))), 128)),
                (E.value.candidates || []).length ? u("", !0) : (n(), i("li", fl, "没有待确认候选"))
              ])
            ]),
            t("article", wl, [
              t("div", Cl, [
                s[95] || (s[95] = t("h2", { class: "card-title" }, "个人目标", -1)),
                t("span", Sl, a((c.value.goals || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(ve, ["prevent"])
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
                }, "添加目标", 8, xl)
              ], 32),
              t("ul", Ul, [
                (n(!0), i(m, null, _(c.value.goals, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", $l, [
                    t("div", Vl, [
                      t("strong", {
                        class: y({ done: e.status === "done" })
                      }, a(e.title), 3),
                      t("span", {
                        class: y(["chip", e.status === "done" ? "chip-ok" : "muted"])
                      }, a(e.status === "done" ? "已完成" : "进行中"), 3)
                    ]),
                    t("div", jl, [
                      t("i", {
                        style: kt({ width: St(e.progress) })
                      }, null, 4)
                    ]),
                    e.detail ? (n(), i("span", Nl, a(e.detail), 1)) : u("", !0)
                  ]),
                  t("div", Ml, [
                    e.status !== "done" ? (n(), i("button", {
                      key: 0,
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => me(e.id)
                    }, "完成", 8, Fl)) : u("", !0),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => _e(e.id)
                    }, "删除", 8, Ll)
                  ])
                ]))), 128)),
                (c.value.goals || []).length ? u("", !0) : (n(), i("li", Tl, "还没有个人目标"))
              ])
            ]),
            t("article", Dl, [
              t("div", El, [
                s[96] || (s[96] = t("h2", { class: "card-title" }, "食物菜单", -1)),
                t("span", Ol, a((c.value.food || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(be, ["prevent"])
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
                }, "加入菜单", 8, ql)
              ], 32),
              t("ul", Il, [
                (n(!0), i(m, null, _(c.value.food, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Pl, [
                    t("strong", null, a(e.name), 1),
                    t("span", Jl, a(e.tags || "—"), 1)
                  ]),
                  t("div", Yl, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => ge(e.id)
                    }, "删除", 8, Bl)
                  ])
                ]))), 128)),
                (c.value.food || []).length ? u("", !0) : (n(), i("li", Al, "菜单还是空的"))
              ])
            ]),
            t("article", Gl, [
              t("div", zl, [
                s[97] || (s[97] = t("h2", { class: "card-title" }, "群聊黑话词云", -1)),
                t("span", Rl, a(Vt.value.length), 1)
              ]),
              t("div", Hl, [
                (n(!0), i(m, null, _(Vt.value, (e) => (n(), i("span", {
                  key: e.topic,
                  class: "cloud-word",
                  style: kt({ fontSize: 12 + Math.min(18, Math.log(e.score + 1) * 6) + "px", opacity: 0.55 + Math.min(0.45, e.score / 20) })
                }, a(e.topic), 5))), 128)),
                Vt.value.length ? u("", !0) : (n(), i("span", Wl, "还没有群聊词云数据"))
              ])
            ])
          ])
        ]),
        t("section", Kl, [
          s[112] || (s[112] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", Ql, [
            t("article", Xl, [
              t("div", Zl, [
                t("h2", ta, a(Y.value ? "用户详情" : "用户"), 1),
                Y.value ? (n(), i("button", {
                  key: 0,
                  class: "btn btn-tonal btn-sm",
                  onClick: re
                }, "← 返回用户列表")) : (n(), i("span", ea, a($t.value.length) + " / " + a(c.value.relationships?.length || 0), 1))
              ]),
              Y.value ? Ut.value ? (n(), i("div", ma, "加载中…")) : b.value ? (n(), i(m, { key: 2 }, [
                t("div", _a, [
                  t("span", ba, a((b.value.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", ga, [
                    t("strong", null, a(b.value.user_id), 1),
                    t("span", ya, "阶段 " + a(b.value.relationship?.stage || "未知") + " · 好感 " + a(Math.round((b.value.relationship?.affinity || 0) * 100)) + "% · 最近 " + a(b.value.relationship?.last_seen || "—"), 1)
                  ])
                ]),
                t("nav", ha, [
                  (n(), i(m, null, _(de, (e) => t("button", {
                    key: e.key,
                    class: y(["tab", { active: B.value === e.key }]),
                    onClick: (o) => B.value = e.key
                  }, a(e.label), 11, ka)), 64))
                ]),
                B.value === "overview" ? (n(), i("div", fa, [
                  t("div", wa, [
                    t("div", Ca, [
                      s[101] || (s[101] = t("span", null, "关系事件", -1)),
                      t("strong", null, a(b.value.counts?.ledger || 0), 1)
                    ]),
                    t("div", Sa, [
                      s[102] || (s[102] = t("span", null, "主动候选", -1)),
                      t("strong", null, a(b.value.counts?.candidates || 0), 1)
                    ]),
                    t("div", xa, [
                      s[103] || (s[103] = t("span", null, "已投递", -1)),
                      t("strong", null, a(b.value.counts?.delivered || 0), 1)
                    ]),
                    t("div", Ua, [
                      s[104] || (s[104] = t("span", null, "记忆条数", -1)),
                      t("strong", null, a(b.value.memories?.total || 0), 1)
                    ]),
                    t("div", $a, [
                      s[105] || (s[105] = t("span", null, "阶段主动上限", -1)),
                      t("strong", null, a(b.value.stage_limit ?? "不限"), 1)
                    ])
                  ]),
                  s[106] || (s[106] = t("h3", { class: "section-label" }, "最近关系事件", -1)),
                  t("ol", Va, [
                    (n(!0), i(m, null, _((b.value.ledger || []).slice(0, 5), (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a(D(e.created_at)), 1),
                      t("p", null, [
                        k(a(e.event_key) + " ", 1),
                        t("span", {
                          class: y(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        k(" · " + a(e.reason), 1)
                      ])
                    ]))), 128)),
                    (b.value.ledger || []).length ? u("", !0) : (n(), i("li", ja, "暂无关系事件"))
                  ])
                ])) : B.value === "relationship" ? (n(), i("div", Na, [
                  t("div", Ma, [
                    t("div", Fa, [
                      t("i", {
                        style: kt({ width: St(b.value.relationship?.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, a(Math.round((b.value.relationship?.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("div", La, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[27] || (s[27] = (e) => It(b.value.user_id, 0.05))
                    }, "更亲近 +"),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[28] || (s[28] = (e) => It(b.value.user_id, -0.05))
                    }, "更疏远 −")
                  ]),
                  s[108] || (s[108] = t("h3", { class: "section-label" }, "事件账本", -1)),
                  t("ol", Ta, [
                    (n(!0), i(m, null, _(b.value.ledger, (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a(D(e.created_at)), 1),
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
                ])) : B.value === "proactive" ? (n(), i("div", Ea, [
                  s[109] || (s[109] = t("h3", { class: "section-label" }, "候选队列", -1)),
                  t("ul", Oa, [
                    (n(!0), i(m, null, _(b.value.proactive?.candidates || [], (e) => (n(), i("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", qa, [
                        t("strong", null, a(e.motive), 1),
                        t("span", Ia, a(e.content), 1),
                        t("span", Pa, a(e.status) + " · " + a(D(e.updated_at)), 1)
                      ]),
                      t("div", Ja, [
                        ["delivered", "cancelled"].includes(e.status) ? u("", !0) : (n(), i("button", {
                          key: 0,
                          class: "btn btn-danger btn-sm",
                          onClick: (o) => Pt(e.id)
                        }, "取消", 8, Ya))
                      ])
                    ]))), 128)),
                    (b.value.proactive?.candidates || []).length ? u("", !0) : (n(), i("li", Ba, "暂无主动记录"))
                  ]),
                  s[110] || (s[110] = t("h3", { class: "section-label" }, "投递记录", -1)),
                  t("ol", Aa, [
                    (n(!0), i(m, null, _(b.value.proactive?.receipts || [], (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a(D(e.created_at)), 1),
                      t("p", null, a(e.phase) + " · " + a(e.content), 1)
                    ]))), 128)),
                    (b.value.proactive?.receipts || []).length ? u("", !0) : (n(), i("li", Ga, "暂无投递"))
                  ])
                ])) : B.value === "memory" ? (n(), i("div", za, [
                  t("ul", Ra, [
                    (n(!0), i(m, null, _(b.value.memories?.items || [], (e) => (n(), i("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", Ha, [
                        t("strong", Wa, a(e.content), 1),
                        t("span", Ka, "scope " + a(e.scope) + " · 重要度 " + a(Math.round((e.importance || 0) * 100)) + "% · 召回 " + a(e.recall_count) + " 次", 1)
                      ]),
                      t("div", Qa, [
                        t("button", {
                          class: "btn btn-danger btn-sm",
                          onClick: (o) => ce(e.id)
                        }, "删除", 8, Xa)
                      ])
                    ]))), 128)),
                    (b.value.memories?.items || []).length ? u("", !0) : (n(), i("li", Za, "没有与该用户相关的记忆"))
                  ])
                ])) : (n(), i("div", tn, [
                  t("ol", en, [
                    (n(!0), i(m, null, _(b.value.audit || [], (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("span", {
                        class: y(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                        "aria-hidden": "true"
                      }, null, 2),
                      t("div", sn, [
                        t("div", ln, [
                          t("strong", null, a(e.kind), 1),
                          t("span", {
                            class: y(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                          }, a(e.outcome), 3),
                          t("time", null, a(D(e.created_at)), 1)
                        ]),
                        t("p", an, a(e.target), 1),
                        t("p", nn, a(e.detail), 1)
                      ])
                    ]))), 128)),
                    (b.value.audit || []).length ? u("", !0) : (n(), i("li", on, "暂无诊断记录"))
                  ])
                ]))
              ], 64)) : u("", !0) : (n(), i(m, { key: 0 }, [
                t("div", sa, [
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
                    (n(!0), i(m, null, _(ue.value, (e) => (n(), i("option", {
                      key: e,
                      value: e
                    }, a(e), 9, la))), 128))
                  ], 512), [
                    [Ft, pt.value]
                  ])
                ]),
                t("ul", aa, [
                  (n(!0), i(m, null, _($t.value, (e) => (n(), i("li", {
                    key: e.user_id,
                    class: "rel",
                    onClick: (o) => Bt(e.user_id)
                  }, [
                    t("span", ia, a((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                    t("div", oa, [
                      t("div", da, [
                        t("strong", null, a(e.user_id), 1),
                        t("span", ua, a(e.stage), 1)
                      ]),
                      t("div", ra, [
                        t("div", ca, [
                          t("i", {
                            style: kt({ width: St(e.affinity) })
                          }, null, 4)
                        ]),
                        t("b", null, a(Math.round((e.affinity || 0) * 100)) + "%", 1)
                      ]),
                      t("span", pa, "最近互动：" + a(e.last_seen || "暂无"), 1)
                    ]),
                    s[100] || (s[100] = t("span", {
                      class: "rel-chevron",
                      "aria-hidden": "true"
                    }, "›", -1))
                  ], 8, na))), 128)),
                  $t.value.length ? u("", !0) : (n(), i("li", va, "没有匹配的用户"))
                ])
              ], 64))
            ]),
            t("article", dn, [
              s[111] || (s[111] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", un, [
                (n(!0), i(m, null, _(c.value.persona_evolution, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item trait-item"
                }, [
                  t("div", rn, [
                    t("strong", null, a(e.trait), 1),
                    t("span", cn, "支持 " + a(e.support_count) + " 次 · 置信度 " + a(Math.round((e.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", pn, a(e.value), 1)
                ]))), 128)),
                c.value.persona_evolution?.length ? u("", !0) : (n(), i("li", vn, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", mn, [
          s[117] || (s[117] = t("h2", { class: "group-title" }, "学习", -1)),
          t("div", _n, [
            t("article", bn, [
              t("div", gn, [
                s[113] || (s[113] = t("h2", { class: "card-title" }, "技能学习", -1)),
                t("span", yn, a((c.value.skills || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(Ue, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[29] || (s[29] = (e) => U.value.name = e),
                  class: "input",
                  placeholder: "技能，如 弹钢琴",
                  "aria-label": "技能名称"
                }, null, 512), [
                  [r, U.value.name]
                ]),
                t("div", hn, [
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
                }, "添加技能", 8, kn)
              ], 32),
              t("ul", fn, [
                (n(!0), i(m, null, _(c.value.skills, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", wn, [
                    t("div", Cn, [
                      t("strong", null, a(e.name), 1),
                      t("span", Sn, "Lv." + a(e.level), 1),
                      t("span", xn, a(e.category), 1)
                    ]),
                    e.keywords ? (n(), i("span", Un, a(e.keywords), 1)) : u("", !0)
                  ]),
                  t("div", $n, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => $e(e.id)
                    }, "删除", 8, Vn)
                  ])
                ]))), 128)),
                (c.value.skills || []).length ? u("", !0) : (n(), i("li", jn, "还没有技能"))
              ])
            ]),
            t("article", Nn, [
              t("div", Mn, [
                s[114] || (s[114] = t("h2", { class: "card-title" }, "表达学习", -1)),
                t("span", Fn, "待审 " + a(gt.value.pending), 1)
              ]),
              t("div", Ln, [
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
                onSubmit: x(Ve, ["prevent"])
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
                }, "入库", 8, Tn)
              ], 32),
              t("ul", Dn, [
                (n(!0), i(m, null, _(Gt.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", En, [
                    t("strong", null, a(e.text), 1),
                    t("span", On, a(e.scene || "通用") + " · " + a(e.source), 1)
                  ]),
                  t("div", qn, [
                    e.status === "pending" ? (n(), i("button", {
                      key: 0,
                      class: "btn btn-primary btn-sm",
                      onClick: (o) => zt(e.id, !0)
                    }, "采用", 8, In)) : u("", !0),
                    e.status === "pending" ? (n(), i("button", {
                      key: 1,
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => zt(e.id, !1)
                    }, "拒绝", 8, Pn)) : u("", !0),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => je(e.id)
                    }, "删除", 8, Jn)
                  ])
                ]))), 128)),
                Gt.value.length ? u("", !0) : (n(), i("li", Yn, "该分类下没有表达"))
              ])
            ]),
            t("article", Bn, [
              t("div", An, [
                s[115] || (s[115] = t("h2", { class: "card-title" }, "社交关系网", -1)),
                t("span", Gn, a((c.value.social_nodes || []).length) + " 人 · " + a((c.value.social_edges || []).length) + " 关系", 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(Ne, ["prevent"])
              }, [
                d(t("input", {
                  "onUpdate:modelValue": s[38] || (s[38] = (e) => F.value.user_id = e),
                  class: "input",
                  placeholder: "用户 ID",
                  "aria-label": "用户 ID"
                }, null, 512), [
                  [r, F.value.user_id]
                ]),
                t("div", zn, [
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
                }, "加入关系网", 8, Rn)
              ], 32),
              t("ul", Hn, [
                (n(!0), i(m, null, _(c.value.social_nodes, (e) => (n(), i("li", {
                  key: e.user_id,
                  class: "item"
                }, [
                  t("div", Wn, [
                    t("strong", null, a(e.name || e.user_id), 1),
                    t("span", Kn, [
                      k(a(e.user_id), 1),
                      e.tags ? (n(), i(m, { key: 0 }, [
                        k(" · " + a(e.tags), 1)
                      ], 64)) : u("", !0)
                    ])
                  ])
                ]))), 128)),
                (c.value.social_nodes || []).length ? u("", !0) : (n(), i("li", Qn, "关系网还是空的"))
              ]),
              s[116] || (s[116] = t("h3", { class: "section-label" }, "关系连线", -1)),
              t("form", {
                class: "form-row",
                onSubmit: x(Me, ["prevent"])
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
                }, "连线", 8, Xn)
              ], 32),
              t("ul", Zn, [
                (n(!0), i(m, null, _(c.value.social_edges, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ti, [
                    t("strong", null, a(e.source_id) + " → " + a(e.target_id), 1),
                    t("span", ei, a(e.relation), 1)
                  ]),
                  t("div", si, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => Fe(e.id)
                    }, "删除", 8, li)
                  ])
                ]))), 128)),
                (c.value.social_edges || []).length ? u("", !0) : (n(), i("li", ai, "还没有关系连线"))
              ])
            ])
          ])
        ]),
        t("section", ni, [
          s[119] || (s[119] = t("h2", { class: "group-title" }, "世界知识", -1)),
          t("div", ii, [
            t("article", oi, [
              t("div", di, [
                t("h2", ui, a(h.value.id ? "编辑条目" : "新增条目"), 1),
                t("span", ri, a((c.value.world || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(Ie, ["prevent"])
              }, [
                t("div", ci, [
                  d(t("select", {
                    "onUpdate:modelValue": s[44] || (s[44] = (e) => h.value.kind = e),
                    class: "input world-kind",
                    "aria-label": "类型"
                  }, [
                    (n(), i(m, null, _(Rt, (e) => t("option", {
                      key: e,
                      value: e
                    }, a(e), 9, pi)), 64))
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
                t("div", vi, [
                  t("button", {
                    class: "btn btn-primary",
                    type: "submit",
                    disabled: !h.value.title.trim() || !h.value.content.trim()
                  }, a(h.value.id ? "保存" : "添加"), 9, mi),
                  h.value.id ? (n(), i("button", {
                    key: 0,
                    type: "button",
                    class: "btn btn-tonal",
                    onClick: s[48] || (s[48] = (e) => h.value = { id: "", kind: "worldview", title: "", content: "", tags: "" })
                  }, "取消编辑")) : u("", !0)
                ])
              ], 32),
              t("div", _i, [
                t("button", {
                  class: y(["btn btn-sm", W.value === "" ? "btn-primary" : "btn-tonal"]),
                  onClick: s[49] || (s[49] = (e) => W.value = "")
                }, "全部", 2),
                (n(), i(m, null, _(Rt, (e) => t("button", {
                  key: e,
                  class: y(["btn btn-sm", W.value === e ? "btn-primary" : "btn-tonal"]),
                  onClick: (o) => W.value = e
                }, a(e), 11, bi)), 64))
              ])
            ]),
            t("article", gi, [
              s[118] || (s[118] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "条目")
              ], -1)),
              t("ul", yi, [
                (n(!0), i(m, null, _(Ht.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", hi, [
                    t("div", ki, [
                      t("strong", null, a(e.title), 1),
                      t("span", fi, a(e.kind), 1)
                    ]),
                    t("span", wi, a(e.content), 1),
                    e.tags ? (n(), i("span", Ci, a(e.tags), 1)) : u("", !0)
                  ]),
                  t("div", Si, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => qe(e)
                    }, "编辑", 8, xi),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => Pe(e.id)
                    }, "删除", 8, Ui)
                  ])
                ]))), 128)),
                Ht.value.length ? u("", !0) : (n(), i("li", $i, "还没有条目"))
              ])
            ])
          ])
        ]),
        t("section", Vi, [
          s[129] || (s[129] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", ji, [
            t("article", Ni, [
              t("div", Mi, [
                s[120] || (s[120] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", Fi, "待投递 " + a(dt.value.length), 1)
              ]),
              t("div", Li, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: ee
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: ut.value,
                  onClick: se
                }, a(ut.value ? "检查中…" : "立即检查投递"), 9, Ti)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: x(Zt, ["prevent"])
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
              t("ul", Ei, [
                (n(!0), i(m, null, _(dt.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Oi, [
                    t("strong", null, a(e.target) + " · " + a(e.motive), 1),
                    t("span", qi, a(e.content), 1),
                    t("span", Ii, "状态 " + a(e.status) + " · " + a(D(e.created_at)), 1)
                  ]),
                  t("div", Pi, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => Pt(e.id)
                    }, "取消", 8, Ji)
                  ])
                ]))), 128)),
                dt.value.length ? u("", !0) : (n(), i("li", Yi, "没有待投递候选"))
              ]),
              s[126] || (s[126] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", Bi, [
                t("label", Ai, [
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
                t("label", Gi, [
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
                t("label", zi, [
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
                t("label", Ri, [
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
                  onClick: te
                }, "保存策略")
              ]),
              s[127] || (s[127] = t("p", { class: "helper-inline" }, [
                k("免打扰起止相同即关闭；target 用 "),
                t("code", null, "session:<会话ID>"),
                k(" 可直接发到对话。")
              ], -1)),
              s[128] || (s[128] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", Hi, [
                (n(!0), i(m, null, _(wt.value, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, a(D(e.created_at)), 1),
                  t("p", null, a(e.phase) + " · " + a(e.content), 1)
                ]))), 128)),
                wt.value.length ? u("", !0) : (n(), i("li", Wi, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", Ki, [
          s[137] || (s[137] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", Qi, [
            t("article", Xi, [
              t("div", Zi, [
                s[130] || (s[130] = t("h2", { class: "card-title" }, "群聊管理", -1)),
                t("span", to, a(mt.value.length), 1)
              ]),
              t("form", {
                class: "group-form",
                onSubmit: x(he, ["prevent"])
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
                }, "添加群", 8, eo)
              ], 32),
              t("ul", so, [
                (n(!0), i(m, null, _(mt.value, (e) => (n(), i("li", {
                  key: e.group_id,
                  class: "item group-item"
                }, [
                  t("div", lo, [
                    t("div", ao, [
                      t("strong", null, a(e.group_id), 1),
                      e.alias ? (n(), i("span", no, a(e.alias), 1)) : u("", !0),
                      t("span", {
                        class: y(["chip", e.policy === "blacklist" ? "chip-warn" : e.policy === "whitelist" ? "chip-ok" : "muted"])
                      }, a(e.policy), 3)
                    ]),
                    t("span", io, a(e.observations) + " 条观察 · " + a(e.topics) + " 个话题", 1),
                    J.value === e.group_id ? (n(), i("div", oo, [
                      s[134] || (s[134] = t("h4", { class: "section-label" }, "黑话 / 话题", -1)),
                      t("div", uo, [
                        (n(!0), i(m, null, _(jt.value[e.group_id] || [], (o) => (n(), i("span", {
                          key: o.topic,
                          class: "chip muted"
                        }, [
                          k(a(o.topic) + " · " + a(Math.round(o.score)), 1),
                          t("button", {
                            class: "chip-x",
                            onClick: (G) => xe(e.group_id, o.topic)
                          }, "×", 8, ro)
                        ]))), 128)),
                        (jt.value[e.group_id] || []).length ? u("", !0) : (n(), i("span", co, "暂无"))
                      ]),
                      t("form", {
                        class: "slang-form",
                        onSubmit: x((o) => Se(e.group_id), ["prevent"])
                      }, [
                        d(t("input", {
                          "onUpdate:modelValue": (o) => _t.value[e.group_id] = o,
                          class: "input",
                          placeholder: "新增黑话 / 话题",
                          "aria-label": "新增黑话"
                        }, null, 8, vo), [
                          [r, _t.value[e.group_id]]
                        ]),
                        s[132] || (s[132] = t("button", {
                          class: "btn btn-tonal btn-sm",
                          type: "submit"
                        }, "添加", -1))
                      ], 40, po),
                      s[135] || (s[135] = t("h4", { class: "section-label" }, "成员安全", -1)),
                      t("ul", mo, [
                        (n(!0), i(m, null, _(Nt.value[e.group_id] || [], (o) => (n(), i("li", {
                          key: o.user_id,
                          class: "member-row"
                        }, [
                          t("span", _o, a(o.user_id), 1),
                          t("span", bo, a(o.messages) + " 条 · " + a(D(o.last_at)), 1),
                          t("select", {
                            class: "input flag-select",
                            value: o.flag,
                            onChange: (G) => we(e.group_id, o.user_id, G)
                          }, [...s[133] || (s[133] = [
                            t("option", { value: "watch" }, "关注", -1),
                            t("option", { value: "allow" }, "放行", -1),
                            t("option", { value: "mute" }, "禁言", -1)
                          ])], 40, go)
                        ]))), 128)),
                        (Nt.value[e.group_id] || []).length ? u("", !0) : (n(), i("li", yo, "暂无成员观察"))
                      ])
                    ])) : u("", !0)
                  ]),
                  t("div", ho, [
                    t("select", {
                      class: "input policy-select",
                      value: e.policy,
                      onChange: (o) => fe(e, o)
                    }, [...s[136] || (s[136] = [
                      t("option", { value: "observe" }, "观察", -1),
                      t("option", { value: "whitelist" }, "白名单", -1),
                      t("option", { value: "blacklist" }, "黑名单", -1)
                    ])], 40, ko),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (o) => Ce(e.group_id)
                    }, a(J.value === e.group_id ? "收起" : "管理"), 9, fo),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => ke(e.group_id)
                    }, "删除", 8, wo)
                  ])
                ]))), 128)),
                mt.value.length ? u("", !0) : (n(), i("li", Co, "还没有群记录。收到群消息或在上面添加。"))
              ])
            ])
          ])
        ]),
        t("section", So, [
          s[153] || (s[153] = t("h2", { class: "group-title" }, "配置", -1)),
          t("div", xo, [
            t("article", Uo, [
              t("div", { class: "card-head" }, [
                s[138] || (s[138] = t("h2", { class: "card-title" }, "运行设置", -1)),
                t("button", {
                  class: "btn btn-primary btn-sm",
                  onClick: Te
                }, "保存")
              ]),
              t("div", $o, [
                t("label", Vo, [
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
                t("label", jo, [
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
                t("label", No, [
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
                t("label", Mo, [
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
                t("label", Fo, [
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
                t("label", Lo, [
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
                t("label", To, [
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
                t("label", Eo, [
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
              t("div", Oo, [
                t("label", qo, [
                  d(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[70] || (s[70] = (e) => g.value.enable_proactive = e)
                  }, null, 512), [
                    [ht, g.value.enable_proactive]
                  ]),
                  s[148] || (s[148] = k(" 启用主动消息", -1))
                ]),
                t("label", Io, [
                  d(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[71] || (s[71] = (e) => g.value.enable_group_observe = e)
                  }, null, 512), [
                    [ht, g.value.enable_group_observe]
                  ]),
                  s[149] || (s[149] = k(" 群聊观察", -1))
                ]),
                t("label", Po, [
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
            t("article", Jo, [
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
                onClick: Ee,
                disabled: !H.value.trim()
              }, "导入", 8, Yo),
              s[152] || (s[152] = t("p", { class: "helper-inline" }, "合并设置、目标、菜单、技能、表达、重要日期等，不会删除已有数据。", -1))
            ])
          ])
        ]),
        t("section", Bo, [
          s[160] || (s[160] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", Ao, [
            t("article", Go, [
              t("div", zo, [
                s[154] || (s[154] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", Ro, a(T.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", Ho, [
                t("div", Wo, [
                  t("strong", null, a((T.value?.total_tokens || 0).toLocaleString()), 1),
                  s[155] || (s[155] = t("span", null, "总 Token", -1))
                ]),
                t("div", Ko, [
                  t("strong", null, a((T.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  s[156] || (s[156] = t("span", null, "输入", -1))
                ]),
                t("div", Qo, [
                  t("strong", null, a((T.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  s[157] || (s[157] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", Xo, [
                (n(!0), i(m, null, _(T.value?.by_model || {}, (e, o) => (n(), i("li", {
                  key: o,
                  class: "item"
                }, [
                  t("div", Zo, [
                    t("strong", null, a(o), 1),
                    t("span", td, a((e.total || 0).toLocaleString()) + " tokens · " + a(e.count) + " 次", 1)
                  ])
                ]))), 128)),
                !T.value || !Object.keys(T.value.by_model || {}).length ? (n(), i("li", ed, "暂无用量记录")) : u("", !0)
              ])
            ]),
            t("article", sd, [
              t("div", { class: "card-head" }, [
                s[158] || (s[158] = t("h2", { class: "card-title" }, "排障检查", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: Oe
                }, "运行诊断")
              ]),
              t("ul", ld, [
                (n(!0), i(m, null, _(et.value?.checks || [], (e) => (n(), i("li", {
                  key: e.name,
                  class: "item"
                }, [
                  t("div", ad, [
                    t("strong", null, a(e.name), 1),
                    t("span", nd, a(e.detail), 1)
                  ]),
                  t("span", {
                    class: y(["chip", e.status === "ok" ? "chip-ok" : e.status === "warn" ? "chip-warn" : "muted"])
                  }, a(e.status), 3)
                ]))), 128)),
                et.value ? u("", !0) : (n(), i("li", id, "点击“运行诊断”查看检查项"))
              ]),
              et.value ? (n(), i("div", od, [
                (n(!0), i(m, null, _(et.value.counts, (e, o) => (n(), i("div", {
                  key: o,
                  class: "kv"
                }, [
                  t("span", null, a(o), 1),
                  t("strong", null, a(e), 1)
                ]))), 128))
              ])) : u("", !0)
            ]),
            t("article", dd, [
              t("div", ud, [
                s[159] || (s[159] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: s[74] || (s[74] = (e) => p("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", rd, [
                (n(!0), i(m, null, _(c.value.audit, (e) => (n(), i("li", {
                  key: e.at + e.kind
                }, [
                  t("span", {
                    class: y(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", cd, [
                    t("div", pd, [
                      t("strong", null, a(e.kind), 1),
                      t("span", {
                        class: y(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, a(e.outcome), 3),
                      t("time", null, a(e.at), 1)
                    ]),
                    t("p", vd, a(e.target), 1),
                    t("p", md, a(e.detail), 1)
                  ])
                ]))), 128)),
                c.value.audit?.length ? u("", !0) : (n(), i("li", _d, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), kd = /* @__PURE__ */ Ae(bd, [["__scopeId", "data-v-8c41c87c"]]);
export {
  kd as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-8c41c87c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-8c41c87c]{max-width:1180px;margin:0 auto}.page-header[data-v-8c41c87c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-8c41c87c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-8c41c87c]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-8c41c87c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-8c41c87c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-8c41c87c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-8c41c87c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-8c41c87c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-8c41c87c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-8c41c87c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-8c41c87c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-8c41c87c]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-8c41c87c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-8c41c87c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-8c41c87c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-8c41c87c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-8c41c87c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-8c41c87c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-8c41c87c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-8c41c87c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-8c41c87c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-8c41c87c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-8c41c87c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-8c41c87c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-8c41c87c]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-8c41c87c]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-8c41c87c]{margin-bottom:var(--space-lg)}.group-title[data-v-8c41c87c]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-8c41c87c]{margin-bottom:0}.card[data-v-8c41c87c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-8c41c87c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-8c41c87c]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-8c41c87c]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-8c41c87c]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-8c41c87c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-8c41c87c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-8c41c87c]{background:#fff1dc;color:#7a4400}.input[data-v-8c41c87c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-8c41c87c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-8c41c87c]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-8c41c87c]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-8c41c87c]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-8c41c87c]{grid-column:1/-1}.stack-form[data-v-8c41c87c]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-8c41c87c]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-8c41c87c]{align-self:flex-start}.item-list[data-v-8c41c87c],.rel-list[data-v-8c41c87c],.feed[data-v-8c41c87c],.timeline[data-v-8c41c87c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-8c41c87c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-8c41c87c]{align-items:flex-start}.item[data-v-8c41c87c]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-8c41c87c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-8c41c87c]{font-size:14px;font-weight:600}.item-main strong.done[data-v-8c41c87c]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-8c41c87c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-8c41c87c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-8c41c87c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-8c41c87c]{background:transparent;border:0}.check-label[data-v-8c41c87c]{display:flex;align-items:center}.check-line[data-v-8c41c87c]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-8c41c87c]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-8c41c87c]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-8c41c87c]{background:#fff1dc;color:#7a4400}.head-actions[data-v-8c41c87c]{display:flex;gap:8px}.item-row[data-v-8c41c87c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hint-inline[data-v-8c41c87c]{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}.helper-inline[data-v-8c41c87c]{margin:8px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.helper-inline code[data-v-8c41c87c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:2px 6px;border-radius:6px}.check-label input[data-v-8c41c87c]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-8c41c87c]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-8c41c87c]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-8c41c87c]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-8c41c87c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-8c41c87c],.rel-meter[data-v-8c41c87c]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-8c41c87c]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-8c41c87c]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-8c41c87c]{font-size:12px}.rel-actions[data-v-8c41c87c]{display:flex;gap:4px}.ledger[data-v-8c41c87c]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.user-tools[data-v-8c41c87c]{display:flex;gap:10px;margin-bottom:12px}.user-stage[data-v-8c41c87c]{width:130px;flex:0 0 auto}.rel[data-v-8c41c87c]{cursor:pointer}.rel-chevron[data-v-8c41c87c]{font-size:20px;color:var(--md-on-surface-variant);flex-shrink:0}.detail-head[data-v-8c41c87c]{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}.tabs[data-v-8c41c87c]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tab[data-v-8c41c87c]{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:600 12.5px/1 inherit;cursor:pointer}.tab[data-v-8c41c87c]:hover{border-color:var(--md-primary)}.tab.active[data-v-8c41c87c]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}.detail-body[data-v-8c41c87c]{display:flex;flex-direction:column;gap:6px}.kv-grid[data-v-8c41c87c]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.kv[data-v-8c41c87c]{background:var(--md-surface-container-low);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:4px}.kv span[data-v-8c41c87c]{font-size:12px;color:var(--md-on-surface-variant)}.kv strong[data-v-8c41c87c]{font-size:20px;font-weight:700}.rel-meter.big[data-v-8c41c87c]{margin:6px 0}.rel-meter.big b[data-v-8c41c87c]{font-size:15px}.mem-text[data-v-8c41c87c]{font-weight:500!important;line-height:1.6}.cal-card[data-v-8c41c87c]{grid-column:1/-1}.cal-month[data-v-8c41c87c]{font-size:14px;font-weight:700;min-width:76px;text-align:center}.cal-week[data-v-8c41c87c]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}.cal-week span[data-v-8c41c87c]{text-align:center;font-size:11px;color:var(--md-on-surface-variant);font-weight:600}.cal-grid[data-v-8c41c87c]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-cell[data-v-8c41c87c]{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}.cal-cell.empty[data-v-8c41c87c]{border-color:transparent;background:transparent}.cal-cell.today[data-v-8c41c87c]{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 18%,transparent)}.cal-cell.has[data-v-8c41c87c]{background:var(--md-surface-container-low)}.cal-day[data-v-8c41c87c]{font-size:12px;font-weight:700;color:var(--md-on-surface-variant)}.cal-chip[data-v-8c41c87c]{font-size:10.5px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-more[data-v-8c41c87c]{font-size:10px;color:var(--md-on-surface-variant)}.cal-warn[data-v-8c41c87c]{margin:12px 0 0;padding:8px 12px;border-radius:10px;background:#fff1dc;color:#7a4400;font-size:12.5px}.cloud[data-v-8c41c87c]{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}.cloud-word[data-v-8c41c87c]{font-weight:700;color:var(--md-primary);line-height:1.2}.group-form[data-v-8c41c87c]{display:grid;grid-template-columns:1fr 120px 1fr auto;gap:10px;margin-bottom:12px}.policy-select[data-v-8c41c87c]{width:auto;height:34px;flex:0 0 auto}.flag-select[data-v-8c41c87c]{width:auto;height:30px;flex:0 0 auto;font-size:12px}.slang-form[data-v-8c41c87c]{display:flex;gap:8px;margin:8px 0}.slang-form .input[data-v-8c41c87c]{height:34px}.chip-x[data-v-8c41c87c]{border:0;background:transparent;color:inherit;cursor:pointer;font-weight:700;margin-left:4px}.member-list[data-v-8c41c87c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.member-row[data-v-8c41c87c]{display:flex;align-items:center;gap:10px;font-size:12.5px}.member-id[data-v-8c41c87c]{font-weight:600;min-width:80px}.member-row .item-meta[data-v-8c41c87c]{flex:1}.form-row[data-v-8c41c87c]{display:flex;gap:10px}.form-row .input[data-v-8c41c87c]{flex:1}.scene-input[data-v-8c41c87c]{width:120px;flex:0 0 auto}.settings-grid[data-v-8c41c87c]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px}.toggle-row[data-v-8c41c87c]{display:flex;gap:16px;flex-wrap:wrap}.select span[data-v-8c41c87c]{white-space:nowrap}.world-kind[data-v-8c41c87c]{width:130px;flex:0 0 auto}.world-filter[data-v-8c41c87c]{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}.world-content[data-v-8c41c87c]{white-space:pre-wrap}.book[data-v-8c41c87c]{border:1px solid var(--md-outline-variant);border-radius:14px;background:linear-gradient(180deg,var(--md-surface-container-lowest),var(--md-surface-container-low));padding:16px 18px}.book-nav[data-v-8c41c87c]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.book-date[data-v-8c41c87c]{width:auto;height:34px;flex:0 0 auto}.book-page[data-v-8c41c87c]{min-height:120px;border-top:1px solid var(--md-outline-variant);padding-top:14px}.book-heading[data-v-8c41c87c]{margin:0 0 10px;font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--md-on-surface-variant);letter-spacing:.02em}.book-body[data-v-8c41c87c]{display:flex;flex-direction:column;gap:10px}.book-body p[data-v-8c41c87c]{margin:0;font-size:14px;line-height:1.95;text-indent:2em;color:var(--md-on-surface);white-space:pre-wrap;overflow-wrap:anywhere}.book-empty[data-v-8c41c87c]{margin:0;font-size:13px;color:var(--md-on-surface-variant);font-style:italic}.diary-manual[data-v-8c41c87c]{margin-top:14px;border-top:1px dashed var(--md-outline-variant);padding-top:12px}.feed li[data-v-8c41c87c]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-8c41c87c]{padding:8px 12px}.feed time[data-v-8c41c87c],.timeline time[data-v-8c41c87c]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-8c41c87c]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-8c41c87c]{color:var(--md-success);font-weight:700}.neg[data-v-8c41c87c]{color:var(--md-error);font-weight:700}.policy[data-v-8c41c87c]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-8c41c87c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-8c41c87c]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-8c41c87c]{margin-top:6px}.audit-card[data-v-8c41c87c]{margin-bottom:var(--space-lg)}.usage-grid[data-v-8c41c87c]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-8c41c87c]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-8c41c87c]{font-size:20px;font-weight:700}.usage-item span[data-v-8c41c87c]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-8c41c87c]{position:relative}.timeline li[data-v-8c41c87c]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-8c41c87c]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-8c41c87c]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-8c41c87c]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-8c41c87c]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-8c41c87c]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-8c41c87c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-8c41c87c]{font-size:13.5px;font-weight:650}.tl-detail[data-v-8c41c87c]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-8c41c87c]{grid-template-columns:repeat(2,1fr)}.grid[data-v-8c41c87c],.agenda-form[data-v-8c41c87c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-8c41c87c]{padding:var(--space-lg)}.header-actions[data-v-8c41c87c]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
