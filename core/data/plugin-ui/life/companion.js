import { defineComponent as Al, ref as c, computed as k, onMounted as Bl, openBlock as a, createElementBlock as o, createElementVNode as e, createTextVNode as b, toDisplayString as n, normalizeClass as w, createCommentVNode as d, Fragment as _, renderList as m, withDirectives as u, unref as Yl, withKeys as At, vModelText as r, normalizeStyle as te, vShow as M, vModelSelect as I, vModelCheckbox as G } from "vue";
import { _ as Gl } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const Kl = { class: "hero" }, Ql = { class: "hero-main" }, Wl = { class: "hero-actions" }, Hl = ["disabled"], Xl = ["disabled"], Zl = { class: "hero-stats" }, es = { class: "stat-num" }, ts = { class: "stat-num" }, ls = { class: "stat-num" }, ss = { class: "stat-num" }, ns = { class: "stat-num" }, as = { class: "stat-num" }, os = { class: "state-row" }, is = { class: "pill" }, us = {
  key: 0,
  class: "pill"
}, ds = {
  key: 1,
  class: "pill soft"
}, rs = {
  key: 2,
  class: "pill soft"
}, cs = {
  key: 0,
  class: "banner err"
}, vs = {
  key: 1,
  class: "banner ok"
}, ps = {
  class: "tabs",
  "aria-label": "视图"
}, _s = ["onClick"], ms = { class: "tab-ic" }, ys = { class: "panel" }, bs = { class: "section-head" }, fs = { class: "head-actions" }, gs = { class: "desk" }, ks = { class: "desk-col" }, hs = { class: "dcard" }, ws = { class: "fact-grid" }, Cs = { class: "fact" }, xs = { class: "fact" }, $s = { class: "fact" }, Ss = { class: "fact" }, Us = {
  key: 0,
  class: "mini-list"
}, Vs = { class: "dcard" }, Ns = {
  key: 0,
  class: "cur"
}, js = {
  key: 1,
  class: "empty"
}, Ts = {
  key: 2,
  class: "meta"
}, Ms = {
  key: 0,
  class: "dcard"
}, Ds = { class: "mini-list" }, Os = { class: "meta" }, Ls = { class: "mini-actions" }, Fs = ["onClick"], Es = ["onClick"], qs = { class: "dcard" }, Ps = { class: "form-row" }, Js = { class: "form-row" }, Is = ["disabled"], Rs = { class: "desk-col" }, zs = { class: "dcard" }, As = { class: "tl" }, Bs = {
  key: 0,
  class: "meta"
}, Ys = {
  key: 0,
  class: "empty"
}, Gs = { class: "dcard" }, Ks = {
  key: 0,
  class: "prose"
}, Qs = {
  key: 1,
  class: "empty"
}, Ws = { class: "actions-row" }, Hs = { class: "actions-row" }, Xs = { class: "desk-col" }, Zs = { class: "dcard" }, en = { class: "mini-tl" }, tn = { class: "meta" }, ln = {
  key: 0,
  class: "empty"
}, sn = { class: "dcard" }, nn = { class: "caps" }, an = {
  key: 0,
  class: "empty"
}, on = {
  class: "fold",
  open: ""
}, un = { class: "grid3" }, dn = { class: "card" }, rn = { class: "mini-list" }, cn = {
  key: 0,
  class: "owner"
}, vn = {
  key: 0,
  class: "empty"
}, pn = { class: "card" }, _n = { class: "mini-list" }, mn = {
  key: 0,
  class: "empty"
}, yn = { class: "card" }, bn = { class: "policy" }, fn = { class: "fold" }, gn = { class: "grid2" }, kn = { class: "card" }, hn = { class: "bars" }, wn = { class: "bar-label" }, Cn = { class: "bar" }, xn = {
  key: 0,
  class: "empty"
}, $n = { class: "card" }, Sn = { class: "bars" }, Un = { class: "bar-label" }, Vn = { class: "bar" }, Nn = {
  key: 0,
  class: "empty"
}, jn = { class: "card" }, Tn = { class: "feed" }, Mn = { class: "meta" }, Dn = {
  key: 0,
  class: "empty"
}, On = { class: "card" }, Ln = { class: "feed" }, Fn = { class: "meta" }, En = {
  key: 0,
  class: "empty"
}, qn = { class: "panel" }, Pn = { class: "section-head" }, Jn = { class: "head-actions" }, In = ["disabled"], Rn = { class: "world-layout" }, zn = { class: "world-nav" }, An = ["onClick"], Bn = { class: "world-body" }, Yn = { class: "card" }, Gn = { class: "form-row" }, Kn = ["value"], Qn = { class: "actions-row" }, Wn = ["disabled"], Hn = { class: "cards" }, Xn = { class: "row" }, Zn = { class: "chip muted" }, ea = { class: "prose" }, ta = {
  key: 0,
  class: "meta"
}, la = { class: "actions-row" }, sa = ["onClick"], na = ["onClick"], aa = {
  key: 0,
  class: "empty"
}, oa = { class: "panel" }, ia = { class: "section-head" }, ua = { class: "head-actions" }, da = ["value"], ra = { class: "user-layout" }, ca = { class: "roster" }, va = { class: "roster-head" }, pa = { class: "count-pill" }, _a = ["onClick"], ma = { class: "avatar" }, ya = { class: "rmain" }, ba = { class: "rtop" }, fa = {
  key: 0,
  class: "owner"
}, ga = { class: "bar" }, ka = { class: "meta" }, ha = {
  key: 0,
  class: "empty"
}, wa = { class: "user-detail" }, Ca = {
  key: 1,
  class: "empty"
}, xa = { class: "detail-head" }, $a = { class: "avatar lg" }, Sa = { class: "meta" }, Ua = { class: "subtabs" }, Va = ["onClick"], Na = { key: 0 }, ja = { class: "kv-grid" }, Ta = { class: "kv" }, Ma = { class: "kv" }, Da = { class: "kv" }, Oa = { class: "kv" }, La = { class: "kv" }, Fa = {
  key: 0,
  class: "note"
}, Ea = {
  key: 1,
  class: "note"
}, qa = { class: "chips" }, Pa = ["onClick"], Ja = {
  key: 0,
  class: "meta"
}, Ia = { class: "form-row" }, Ra = ["disabled"], za = { key: 1 }, Aa = { class: "bar big" }, Ba = { class: "meta" }, Ya = { class: "actions-row" }, Ga = { class: "feed" }, Ka = {
  key: 0,
  class: "empty"
}, Qa = { key: 2 }, Wa = { class: "feed" }, Ha = { class: "meta" }, Xa = ["onClick"], Za = {
  key: 0,
  class: "empty"
}, eo = { key: 3 }, to = { class: "feed" }, lo = { class: "meta" }, so = ["onClick"], no = {
  key: 0,
  class: "empty"
}, ao = { key: 4 }, oo = { class: "feed" }, io = { class: "meta" }, uo = {
  key: 0,
  class: "empty"
}, ro = {
  key: 3,
  class: "empty"
}, co = { class: "panel" }, vo = { class: "section-head" }, po = { class: "head-actions" }, _o = { class: "card" }, mo = { class: "group-form" }, yo = ["disabled"], bo = { class: "cards" }, fo = { class: "row" }, go = {
  key: 0,
  class: "chip muted"
}, ko = { class: "meta" }, ho = {
  key: 0,
  class: "group-detail"
}, wo = { class: "chips" }, Co = {
  key: 0,
  class: "meta"
}, xo = { class: "chips" }, $o = ["onClick"], So = { class: "form-row" }, Uo = ["onUpdate:modelValue"], Vo = ["onClick"], No = { class: "members" }, jo = { class: "meta" }, To = ["value", "onChange"], Mo = { class: "actions-row" }, Do = ["value", "onChange"], Oo = ["onClick"], Lo = ["onClick"], Fo = {
  key: 0,
  class: "empty"
}, Eo = { class: "panel" }, qo = { class: "grid3" }, Po = { class: "card" }, Jo = { class: "count-pill" }, Io = { class: "form-row" }, Ro = ["disabled"], zo = { class: "feed" }, Ao = { class: "chip muted" }, Bo = { class: "actions-row" }, Yo = ["onClick"], Go = ["onClick"], Ko = {
  key: 0,
  class: "empty"
}, Qo = { class: "card" }, Wo = { class: "subtabs" }, Ho = { class: "form-row" }, Xo = ["disabled"], Zo = { class: "feed" }, ei = { class: "meta" }, ti = { class: "actions-row" }, li = ["onClick"], si = ["onClick"], ni = ["onClick"], ai = {
  key: 0,
  class: "empty"
}, oi = { class: "card" }, ii = { class: "count-pill" }, ui = { class: "form-row" }, di = ["disabled"], ri = { class: "feed" }, ci = { class: "meta" }, vi = {
  key: 0,
  class: "empty"
}, pi = { class: "form-row" }, _i = { class: "feed" }, mi = ["onClick"], yi = {
  key: 0,
  class: "empty"
}, bi = { class: "panel" }, fi = { class: "section-head" }, gi = { class: "head-actions" }, ki = { class: "grid2" }, hi = { class: "card cal-card" }, wi = { class: "cal-week" }, Ci = { class: "cal-grid" }, xi = {
  key: 0,
  class: "cal-day"
}, $i = {
  key: 1,
  class: "cal-more"
}, Si = {
  key: 0,
  class: "warnline"
}, Ui = { class: "sub-label" }, Vi = { class: "feed" }, Ni = { class: "actions-row" }, ji = ["onClick"], Ti = ["onClick"], Mi = {
  key: 0,
  class: "empty"
}, Di = { class: "card" }, Oi = { class: "spark" }, Li = ["title"], Fi = { class: "card" }, Ei = { class: "count-pill" }, qi = { class: "form-row" }, Pi = ["disabled"], Ji = { class: "feed" }, Ii = { class: "bar" }, Ri = { class: "form-row" }, zi = ["onUpdate:modelValue"], Ai = ["onClick"], Bi = ["onClick"], Yi = {
  key: 0,
  class: "feed"
}, Gi = {
  key: 0,
  class: "empty"
}, Ki = { class: "card" }, Qi = { class: "feed" }, Wi = { class: "chip" }, Hi = { class: "meta" }, Xi = {
  key: 0,
  class: "empty"
}, Zi = { class: "card" }, eu = { class: "count-pill" }, tu = { class: "feed" }, lu = { class: "meta" }, su = ["onClick"], nu = {
  key: 0,
  class: "empty"
}, au = { class: "card" }, ou = { class: "count-pill" }, iu = { class: "feed" }, uu = { class: "meta" }, du = {
  key: 0,
  class: "empty"
}, ru = { class: "card cal-card" }, cu = { class: "count-pill" }, vu = { class: "tl" }, pu = { class: "meta" }, _u = {
  key: 0,
  class: "empty"
}, mu = { class: "card" }, yu = { class: "radar-wrap" }, bu = {
  viewBox: "0 0 120 120",
  class: "radar",
  "aria-label": "情绪雷达"
}, fu = ["points"], gu = { class: "hint" }, ku = { class: "card cal-card" }, hu = { class: "count-pill" }, wu = { class: "feed" }, Cu = { class: "meta" }, xu = {
  key: 0,
  class: "findings"
}, $u = { class: "meta" }, Su = {
  key: 0,
  class: "empty"
}, Uu = { class: "panel" }, Vu = { class: "section-head" }, Nu = { class: "head-actions" }, ju = ["disabled"], Tu = { class: "grid2" }, Mu = { class: "card" }, Du = { class: "count-pill" }, Ou = { class: "form-row" }, Lu = ["value"], Fu = { class: "form-row" }, Eu = ["disabled"], qu = { class: "feed" }, Pu = { class: "meta" }, Ju = { class: "meta" }, Iu = ["onClick"], Ru = {
  key: 0,
  class: "empty"
}, zu = { class: "card" }, Au = { class: "feed" }, Bu = { class: "meta" }, Yu = {
  key: 0,
  class: "empty"
}, Gu = { class: "panel" }, Ku = { class: "stat-cards" }, Qu = { class: "stat-card" }, Wu = { class: "stat-card" }, Hu = { class: "stat-card" }, Xu = { class: "stat-card" }, Zu = { class: "card" }, ed = { class: "feed" }, td = { class: "meta" }, ld = {
  key: 0,
  class: "empty"
}, sd = { class: "panel" }, nd = { class: "section-head" }, ad = { class: "head-actions" }, od = { class: "grid2" }, id = { class: "card" }, ud = { class: "feed" }, dd = { class: "meta" }, rd = {
  key: 0,
  class: "empty"
}, cd = {
  key: 0,
  class: "kv-grid"
}, vd = { class: "card" }, pd = { class: "count-pill" }, _d = { class: "form-row" }, md = { class: "tl" }, yd = { class: "meta" }, bd = {
  key: 0,
  class: "tl-detail"
}, fd = {
  key: 0,
  class: "empty"
}, gd = { class: "panel" }, kd = { class: "grid2" }, hd = { class: "card" }, wd = { class: "settings-grid" }, Cd = { class: "switches" }, xd = { class: "sw" }, $d = { class: "sw" }, Sd = { class: "sw" }, Ud = { class: "sw" }, Vd = { class: "settings-grid" }, Nd = { class: "wide" }, jd = { class: "wide" }, Td = ["value"], Md = ["value"], Dd = { class: "sw" }, Od = { class: "card" }, Ld = { class: "settings-grid" }, Fd = { class: "switches" }, Ed = { class: "sw" }, qd = { class: "sw" }, Pd = { class: "actions-row" }, Jd = ["disabled"], Id = ["disabled"], Rd = { class: "panel" }, zd = { class: "grid2" }, Ad = { class: "card" }, Bd = { class: "card" }, Yd = { class: "feed" }, Gd = { class: "meta" }, Kd = {
  key: 0,
  class: "empty"
}, Qd = { class: "panel" }, Wd = { class: "grid3" }, Hd = { class: "card" }, Xd = { class: "actions-row" }, Zd = { class: "card" }, er = { class: "form-row" }, tr = ["value"], lr = ["disabled"], sr = { class: "card" }, nr = { class: "form-row" }, ar = ["disabled"], or = { class: "feed" }, ir = { class: "meta" }, ur = ["onClick"], dr = {
  key: 0,
  class: "empty"
}, rr = { class: "card" }, cr = { class: "form-row" }, vr = ["disabled"], pr = { class: "sw" }, _r = { class: "feed" }, mr = ["onClick"], yr = {
  key: 0,
  class: "empty"
}, br = { class: "card" }, fr = { class: "cloud" }, gr = {
  key: 0,
  class: "empty"
}, kr = /* @__PURE__ */ Al({
  __name: "CompanionPage",
  setup(hr) {
    const v = c({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [], open_topics: [], portraits: [], timeline: [] }), re = c(!1), x = c(""), ce = c(""), le = c(""), ke = c(""), he = c(""), we = c(""), Ce = c(""), se = () => {
      const s = /* @__PURE__ */ new Date(), t = (l) => String(l).padStart(2, "0");
      return `${s.getFullYear()}-${t(s.getMonth() + 1)}-${t(s.getDate())}`;
    }, tt = c(se()), qe = c({ date: "", content: "", previous: null, next: null }), lt = c(!1);
    k(() => (qe.value.content || "").split(/\n{2,}/).map((s) => s.trim()).filter(Boolean));
    async function Bt(s = tt.value) {
      lt.value = !0;
      try {
        const t = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "journal_page", payload: { date: s } }) });
        if (!t.ok) throw Error(await t.text());
        const l = await t.json();
        qe.value = { date: l?.date || s, content: l?.content || "", previous: l?.previous || null, next: l?.next || null }, tt.value = qe.value.date;
      } catch (t) {
        x.value = W(t);
      } finally {
        lt.value = !1;
      }
    }
    const K = c(""), U = c({ target: "", motive: "", content: "", preferred_at: "" }), Q = c(""), ve = c("");
    function st() {
      return Q.value === "__manual__" ? ve.value.trim() : Q.value;
    }
    const $ = c({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), Yt = k(() => Object.entries(v.value.groups || {})), pe = k(() => (v.value.proactive?.candidates || []).filter((s) => !["delivered", "cancelled"].includes(s.status))), nt = k(() => v.value.proactive?.receipts || []), at = se(), ne = k(() => (v.value.agenda || []).filter((s) => {
      const t = String(s.start_at || "").replace("T", " ");
      return !t || t.slice(0, 10) >= at;
    })), S = c("overview"), ot = c(null), ae = c(""), Gt = [
      { key: "overview", i: "01", label: "总览", icon: "◉" },
      { key: "world", i: "02", label: "世界知识", icon: "✎" },
      { key: "users", i: "03", label: "用户", icon: "☺" },
      { key: "groups", i: "04", label: "群聊", icon: "☷" },
      { key: "learning", i: "05", label: "学习", icon: "✚" },
      { key: "observe", i: "06", label: "观察", icon: "◎" },
      { key: "proactive", i: "07", label: "主动", icon: "✦" },
      { key: "tokens", i: "08", label: "Token", icon: "∑" },
      { key: "troubleshooting", i: "09", label: "排障", icon: "⚠" },
      { key: "config", i: "10", label: "配置", icon: "⚙" },
      { key: "models", i: "11", label: "模型", icon: "⌁" },
      { key: "experimental", i: "12", label: "实验", icon: "⚗" }
    ];
    function f(s) {
      ce.value = s, setTimeout(() => {
        ce.value === s && (ce.value = "");
      }, 2500);
    }
    function W(s) {
      const t = String(s?.message || s || "");
      return /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(t) ? "LIFE 服务暂时未就绪（可能正在启动或重启），已自动重试。稍候刷新即可。" : t || "操作失败";
    }
    const it = (s) => new Promise((t) => setTimeout(t, s)), R = c(null);
    async function ut() {
      try {
        const s = await fetch("/api/usage");
        s.ok && (R.value = await s.json());
      } catch {
      }
    }
    async function H(s = 0) {
      re.value = !0, x.value = "";
      try {
        const t = await fetch("/api/life/companion");
        if (!t.ok) throw Error(await t.text() || String(t.status));
        v.value = await t.json(), v.value?.policy && ($.value = { ...$.value, ...v.value.policy }), Tl(), re.value = !1, ut(), Bt(), Me(), ml(), kt(), Tt(), Ot();
      } catch (t) {
        if (s < 4)
          return await it(1500), H(s + 1);
        x.value = W(t), re.value = !1;
      }
    }
    async function y(s, t) {
      for (let l = 0; l < 3; l++)
        try {
          const i = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: s, payload: t }) });
          if (!i.ok) throw Error(await i.text());
          const C = await i.json().catch(() => ({}));
          return await H(), C;
        } catch (i) {
          if (l < 2 && /connection refused|Unavailable|actively refused|dial tcp|502|503|life unavailable/i.test(String(i?.message || i))) {
            await it(1200);
            continue;
          }
          return x.value = W(i), null;
        }
      return null;
    }
    async function J(s, t) {
      const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: s, payload: t }) });
      if (!l.ok) throw Error(await l.text());
      return await l.json().catch(() => ({}));
    }
    async function dt() {
      le.value.trim() && (await y("add_agenda", { title: le.value, when: ke.value, detail: he.value }), le.value = "", ke.value = "", he.value = "", f("已加入日程"));
    }
    async function rt(s, t) {
      t.trim() && (await y(s, { content: t }), s === "journal" ? we.value = "" : Ce.value = "");
    }
    function xe(s) {
      return `${Math.round(Math.max(0, Math.min(1, s || 0)) * 100)}%`;
    }
    function Pe(s) {
      if (s.status === "completed") return { label: "已完成", cls: "ok" };
      const t = new Date(String(s.start_at || "").replace(" ", "T"));
      return !Number.isNaN(t.getTime()) && t.getTime() <= Date.now() ? { label: "进行中", cls: "warn" } : { label: "待开始", cls: "muted" };
    }
    async function ct(s, t) {
      await y("relationship_adjust", { user_id: s, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: t }) && f(`已调整 ${s}`);
    }
    async function vt() {
      const s = await y("relationship_decay", {});
      f(s?.decayed != null ? `已自然回落 ${s.decayed} 个关系` : "已处理");
    }
    async function Kt() {
      const s = st();
      if (!s || !U.value.content.trim()) return;
      await y("proactive_create", { ...U.value, target: s }) && (U.value = { target: "", motive: "", content: "", preferred_at: "" }, Q.value = "", ve.value = "", f("已创建主动候选"));
    }
    async function pt(s) {
      await y("proactive_cancel", { id: s, reason: "dashboard_cancel" }), f("已取消候选");
    }
    async function Qt() {
      await y("proactive_policy", { daily_limit: Number($.value.daily_limit), per_target_limit: Number($.value.per_target_limit), quiet_start: Number($.value.quiet_start), quiet_end: Number($.value.quiet_end) }), f("策略已保存");
    }
    const _t = c("");
    async function $e(s) {
      _t.value = s;
      try {
        const t = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: s === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!t.ok) throw Error(await t.text());
        await H(), f("已由 LIFE 生成");
      } catch (t) {
        x.value = W(t);
      } finally {
        _t.value = "";
      }
    }
    async function Wt() {
      const s = st();
      if (!s) {
        f("先选择发送目标");
        return;
      }
      await y("proactive_suggest", { target: s, hint: U.value.motive }) && (U.value = { target: "", motive: "", content: "", preferred_at: "" }, Q.value = "", ve.value = "", f("已生成建议候选"));
    }
    const Se = c(!1);
    async function Ht() {
      Se.value = !0;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        const t = await s.json();
        await H(), f(t?.skipped ? `本次跳过：${t.skipped}` : `已投递 ${t.delivered || 0} 条 · 拦截 ${t.blocked || 0} 条`);
      } catch (s) {
        x.value = W(s);
      } finally {
        Se.value = !1;
      }
    }
    const Ue = c(!1);
    async function Xt() {
      Ue.value = !0;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        const t = await s.json();
        await H();
        const l = t?.applied;
        f(l ? `已自主规划：日程 ${l.agenda} · 主动 ${l.proactive}` : "本次没有新的规划");
      } catch (s) {
        x.value = W(s);
      } finally {
        Ue.value = !1;
      }
    }
    function Zt(s) {
      const t = (s || "").trim(), l = /* @__PURE__ */ new Date();
      l.setHours(0, 0, 0, 0);
      let i = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(t) ? (i = new Date(t), i.setHours(0, 0, 0, 0), i < l && i.setFullYear(l.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(t) && (i = new Date(l.getFullYear(), Number(t.slice(0, 2)) - 1, Number(t.slice(3, 5))), i < l && i.setFullYear(l.getFullYear() + 1)), !i || Number.isNaN(i.getTime()) ? null : Math.round((i.getTime() - l.getTime()) / 864e5);
    }
    const j = c({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function el() {
      !j.value.title.trim() || !j.value.date.trim() || (await y("date_add", { ...j.value }), j.value = { title: "", date: "", repeat_yearly: !0, note: "" }, f("已添加重要日期"));
    }
    async function tl(s) {
      await y("date_delete", { id: s }), f("已删除");
    }
    async function ll() {
      await y("circadian_eat", { amount: 45 }), f("已用餐");
    }
    async function mt() {
      const s = await y("daily_agenda", {});
      f(s?.created ? `LIFE 已安排 ${s.created} 项活动` : "今天已有安排");
    }
    function D(s) {
      if (!s) return "";
      const t = new Date(s);
      return Number.isNaN(t.getTime()) ? s : t.toLocaleString();
    }
    const F = c(""), Ve = c(""), Ne = c(""), g = c(null), Je = c(!1), je = c([]), oe = c(null), X = c("overview"), sl = [{ key: "overview", label: "概览" }, { key: "relationship", label: "关系" }, { key: "proactive", label: "主动" }, { key: "memory", label: "记忆" }, { key: "diagnostics", label: "诊断" }], nl = k(() => Array.from(new Set((v.value.relationships || []).map((s) => s.stage).filter(Boolean)))), yt = k(() => String(v.value.settings?.owner_user_ids || "").split(",").map((s) => s.trim()).filter(Boolean)), Ie = k(() => (v.value.relationships || []).filter((s) => (!Ve.value || String(s.user_id).toLowerCase().includes(Ve.value.toLowerCase())) && (!Ne.value || s.stage === Ne.value)));
    async function Re(s) {
      F.value = s, X.value = "overview", Je.value = !0;
      const [t, l, i] = await Promise.all([
        y("user_detail", { user_id: s, limit: 100, memory_limit: 100 }),
        J("open_topic_list", { user_id: s, limit: 10 }).catch(() => ({ topics: [] })),
        J("portrait_get", { user_id: s }).catch(() => null)
      ]);
      g.value = t || null, je.value = l?.topics || [], oe.value = i, Je.value = !1;
    }
    function al() {
      F.value = "", g.value = null, je.value = [], oe.value = null;
    }
    async function ol(s) {
      await y("delete_memory", { id: s }), F.value && Re(F.value);
    }
    async function il(s) {
      if (!F.value) return;
      const t = await y("open_topic_resolve", { user_id: F.value, topics: [s] });
      f(t?.resolved ? "已标记完成" : "已处理");
    }
    const _e = c(se().slice(0, 7)), z = c({ events: [], candidates: [], conflicts: [] }), ie = c({ title: "", detail: "", kind: "growth" }), ze = c({}), Te = c({}), A = c({ name: "", tags: "", note: "" }), bt = k(() => v.value.word_cloud || []), ul = k(() => {
      const [s, t] = _e.value.split("-").map(Number);
      if (!s || !t) return [];
      const l = new Date(s, t, 0).getDate(), i = new Date(s, t - 1, 1).getDay(), C = {};
      for (const N of z.value.events || []) {
        const L = String(N.start_at || "").replace("T", " ").slice(0, 10);
        (C[L] || (C[L] = [])).push(N);
      }
      const ge = [];
      for (let N = 0; N < i; N++) ge.push({ key: `pad-${N}`, empty: !0 });
      for (let N = 1; N <= l; N++) {
        const L = `${s}-${String(t).padStart(2, "0")}-${String(N).padStart(2, "0")}`;
        ge.push({ key: L, day: N, iso: L, events: C[L] || [], today: L === at });
      }
      return ge;
    });
    async function Me() {
      try {
        const s = await J("calendar_month", { month: _e.value });
        s && (z.value = s);
      } catch {
      }
    }
    function ft(s) {
      const [t, l] = _e.value.split("-").map(Number), i = new Date(t, l - 1 + s, 1);
      _e.value = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}`, Me();
    }
    async function dl() {
      ie.value.title.trim() && (await y("goal_add", { ...ie.value }), ie.value = { title: "", detail: "", kind: "growth" });
    }
    async function gt(s) {
      const t = await J("goal_logs", { id: s, limit: 20 });
      ze.value[s] = t?.logs || [];
    }
    async function rl(s) {
      const t = (Te.value[s] || "").trim();
      t && (await y("goal_log_add", { id: s, evidence: t }), Te.value[s] = "", gt(s));
    }
    async function cl() {
      A.value.name.trim() && (await y("food_add", { ...A.value }), A.value = { name: "", tags: "", note: "" });
    }
    async function vl(s) {
      await y("food_delete", { id: s });
    }
    const De = c([]);
    async function kt() {
      try {
        const s = await J("content_list", { limit: 30 });
        De.value = s?.digests || [];
      } catch {
      }
    }
    async function ht() {
      const s = await y("content_tick", {});
      kt(), s && (s.skipped === "disabled" ? f("内容抓取未开启（配置 → 环境与内容 打开 enable_content_fetch）") : s.skipped === "done" ? f("今天已经抓取过了") : s.skipped === "sleeping" ? f("睡眠中，暂不抓取") : f(s.stored != null ? `已抓取 ${s.stored} 条见闻` : "已处理"));
    }
    async function Ae() {
      const s = await y("outfit_tick", {});
      s && (s.outfit ? f(`今日穿搭：${s.outfit}`) : s.skipped === "no_wardrobe" ? f("衣橱还没有条目（世界知识 → wardrobe）") : s.skipped === "done" ? f("今天已经有穿搭了") : f("已处理"));
    }
    async function pl() {
      const s = await y("image_generate", { prompt: "今天的穿搭" });
      f(s?.ok ? "已生成" : `生图不可用：${s?.reason || "未配置扩展"}`);
    }
    async function wt() {
      if (!F.value || !ae.value.trim()) return;
      await y("open_topic_add", { user_id: F.value, topic: ae.value.trim() }) && (ae.value = "", f("已加入未完话题"));
    }
    const Ct = k(() => {
      const s = {};
      for (const l of v.value.timeline || []) {
        const i = String(l.created_at || "").slice(0, 10);
        i && (s[i] = (s[i] || 0) + 1);
      }
      const t = [];
      for (let l = 13; l >= 0; l--) {
        const i = /* @__PURE__ */ new Date();
        i.setDate(i.getDate() - l);
        const C = i.toISOString().slice(0, 10);
        t.push({ day: C.slice(5), count: s[C] || 0 });
      }
      return t;
    }), _l = k(() => Math.max(1, ...Ct.value.map((s) => s.count))), Z = c([]), xt = k(() => {
      const s = [];
      for (const t of v.value.conversations || []) s.push({ value: `session:${t}`, label: `会话 · ${t}` });
      for (const t of v.value.relationships || []) s.push({ value: `user:${t.user_id}`, label: `用户 · ${t.user_id}` });
      for (const t of Z.value) s.push({ value: `group:${t.group_id}`, label: `群 · ${t.alias || t.group_id}` });
      return s;
    }), E = c({ group_id: "", policy: "observe", alias: "" }), $t = c({}), St = c({}), me = c({}), Oe = c({});
    async function ml() {
      try {
        const s = await J("group_list", {});
        Z.value = s.groups || [];
      } catch {
      }
    }
    async function yl() {
      E.value.group_id.trim() && (await y("group_upsert", { ...E.value }), E.value = { group_id: "", policy: "observe", alias: "" });
    }
    async function bl(s) {
      await y("group_delete", { group_id: s }), K.value === s && (K.value = "");
    }
    async function fl(s, t) {
      const l = t.target.value;
      await y("group_upsert", { group_id: s.group_id, policy: l, alias: s.alias || "", note: s.note || "" });
    }
    async function gl(s, t, l) {
      const i = l.target.value;
      await y("group_member_flag", { group_id: s, user_id: t, flag: i }), Le(s);
    }
    async function Le(s) {
      const [t, l, i] = await Promise.all([y("group_slang_list", { group_id: s }), y("group_members", { group_id: s }), J("group_atmosphere", { group_id: s }).catch(() => null)]);
      $t.value[s] = t?.slang || [], St.value[s] = l?.members || [], i && (me.value[s] = i);
    }
    function kl(s) {
      K.value = K.value === s ? "" : s, K.value && Le(s);
    }
    async function hl(s) {
      const t = (Oe.value[s] || "").trim();
      t && (await y("group_slang_update", { group_id: s, topic: t, score: 1 }), Oe.value[s] = "", Le(s));
    }
    async function wl(s, t) {
      await y("group_slang_delete", { group_id: s, topic: t }), Le(s);
    }
    async function Ut() {
      const s = await y("group_wake_tick", {});
      f(s?.proposed != null ? `已生成 ${s.proposed} 条群聊插话候选` : "本次没有合适的群聊兴趣点");
    }
    const O = c({ name: "", category: "general", level: 1, keywords: "" }), B = c({ text: "", scene: "" }), ee = c("pending"), Y = c({ user_id: "", name: "", tags: "" }), q = c({ source_id: "", target_id: "", relation: "" }), Vt = k(() => (v.value.expressions || []).filter((s) => s.status === ee.value)), Be = k(() => {
      const s = v.value.expressions || [];
      return { pending: s.filter((t) => t.status === "pending").length, approved: s.filter((t) => t.status === "approved").length, rejected: s.filter((t) => t.status === "rejected").length };
    });
    async function Cl() {
      O.value.name.trim() && (await y("skill_add", { ...O.value, level: Number(O.value.level) }), O.value = { name: "", category: "general", level: 1, keywords: "" });
    }
    async function xl(s) {
      const t = await y("skill_grow", { name: s });
      f(t?.updated ? `${s} 升到 Lv.${t.level}` : "技能未找到");
    }
    async function $l(s) {
      await y("skill_delete", { id: s });
    }
    async function Sl() {
      B.value.text.trim() && (await y("expression_add", { ...B.value }), B.value = { text: "", scene: "" });
    }
    async function Nt(s, t) {
      await y("expression_review", { id: s, accept: t });
    }
    async function Ul(s) {
      await y("expression_delete", { id: s });
    }
    async function Vl() {
      Y.value.user_id.trim() && (await y("social_node_upsert", { ...Y.value }), Y.value = { user_id: "", name: "", tags: "" });
    }
    async function Nl() {
      !q.value.source_id.trim() || !q.value.target_id.trim() || (await y("social_edge_add", { ...q.value }), q.value = { source_id: "", target_id: "", relation: "" });
    }
    async function jl(s) {
      await y("social_edge_delete", { id: s });
    }
    const p = c({}), Fe = c("{}"), ye = c(null), P = c(""), jt = c({}), Ee = k(() => Object.entries(jt.value || {}).map(([s, t]) => ({ name: s, ...t })));
    async function Tt() {
      try {
        const s = await J("extension_status", {});
        jt.value = s?.extensions || {};
      } catch {
      }
    }
    function Tl() {
      const s = v.value.settings || {}, t = (l, i) => String(s[l] ?? i);
      p.value = {
        proactive_daily_limit: Number(t("proactive_daily_limit", "3")),
        proactive_target_limit: Number(t("proactive_target_limit", "1")),
        quiet_start: Number(t("quiet_start", "23")),
        quiet_end: Number(t("quiet_end", "8")),
        idle_minutes: Number(t("idle_minutes", "30")),
        min_interval_minutes: Number(t("min_interval_minutes", "5")),
        check_interval_seconds: Number(t("check_interval_seconds", "600")),
        burst_max: Number(t("burst_max", "2")),
        daily_token_limit: Number(t("daily_token_limit", "0")),
        enable_proactive: t("enable_proactive", "1") === "1",
        enable_group_observe: t("enable_group_observe", "1") === "1",
        enable_dream: t("enable_dream", "1") === "1",
        owner_user_ids: t("owner_user_ids", ""),
        secondary_user_ids: t("secondary_user_ids", ""),
        other_stage_cap: t("other_stage_cap", "熟悉"),
        secondary_stage_cap: t("secondary_stage_cap", "友好"),
        enable_exclusive_bond: t("enable_exclusive_bond", "1") === "1",
        affinity_decay_per_day: Number(t("affinity_decay_per_day", "0.02")),
        affinity_decay_after_days: Number(t("affinity_decay_after_days", "3")),
        reply_deceleration: t("reply_deceleration", "1") === "1",
        env_timezone: t("env_timezone", "Asia/Shanghai"),
        env_city: t("env_city", ""),
        env_latitude: t("env_latitude", ""),
        env_longitude: t("env_longitude", ""),
        enable_environment_fetch: t("enable_environment_fetch", "0") === "1",
        weather_cache_minutes: Number(t("weather_cache_minutes", "60")),
        enable_content_fetch: t("enable_content_fetch", "0") === "1",
        news_feeds: t("news_feeds", ""),
        content_items_per_feed: Number(t("content_items_per_feed", "3")),
        tts_endpoint: t("tts_endpoint", ""),
        locale: t("locale", "zh-CN")
      }, Fe.value = t("model_routes", "{}") || "{}";
    }
    async function Ml() {
      const s = p.value, t = {
        proactive_daily_limit: String(s.proactive_daily_limit),
        proactive_target_limit: String(s.proactive_target_limit),
        quiet_start: String(s.quiet_start),
        quiet_end: String(s.quiet_end),
        idle_minutes: String(s.idle_minutes),
        min_interval_minutes: String(s.min_interval_minutes),
        check_interval_seconds: String(s.check_interval_seconds),
        burst_max: String(s.burst_max),
        daily_token_limit: String(s.daily_token_limit),
        enable_proactive: s.enable_proactive ? "1" : "0",
        enable_group_observe: s.enable_group_observe ? "1" : "0",
        enable_dream: s.enable_dream ? "1" : "0",
        owner_user_ids: String(s.owner_user_ids),
        secondary_user_ids: String(s.secondary_user_ids),
        other_stage_cap: String(s.other_stage_cap),
        secondary_stage_cap: String(s.secondary_stage_cap),
        enable_exclusive_bond: s.enable_exclusive_bond ? "1" : "0",
        affinity_decay_per_day: String(s.affinity_decay_per_day),
        affinity_decay_after_days: String(s.affinity_decay_after_days),
        reply_deceleration: s.reply_deceleration ? "1" : "0",
        env_timezone: String(s.env_timezone),
        env_city: String(s.env_city),
        env_latitude: String(s.env_latitude),
        env_longitude: String(s.env_longitude),
        enable_environment_fetch: s.enable_environment_fetch ? "1" : "0",
        weather_cache_minutes: String(s.weather_cache_minutes),
        enable_content_fetch: s.enable_content_fetch ? "1" : "0",
        news_feeds: String(s.news_feeds),
        content_items_per_feed: String(s.content_items_per_feed),
        tts_endpoint: String(s.tts_endpoint),
        locale: String(s.locale)
      }, l = await y("settings_set", { settings: t });
      l?.rejected?.length ? f(`已保存，忽略无效项：${l.rejected.join("、")}`) : f("设置已保存");
    }
    async function Mt() {
      let s;
      try {
        s = JSON.parse(Fe.value || "{}");
      } catch {
        x.value = "模型分流不是合法 JSON";
        return;
      }
      await y("model_routes_set", { routes: s }), await y("settings_set", { settings: { model_routes: JSON.stringify(s) } }), f("模型分流已保存并生效");
    }
    async function Dl() {
      const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "config_export", payload: {} }) });
      if (!s.ok) {
        x.value = await s.text();
        return;
      }
      const t = new Blob([JSON.stringify(await s.json(), null, 2)], { type: "application/json" }), l = URL.createObjectURL(t), i = document.createElement("a");
      i.href = l, i.download = `life-companion-${se()}.json`, i.click(), URL.revokeObjectURL(l);
    }
    async function Ol() {
      if (!P.value.trim()) return;
      let s;
      try {
        s = JSON.parse(P.value);
      } catch {
        x.value = "导入内容不是合法 JSON";
        return;
      }
      const t = await y("config_import", { snapshot: s });
      t && (P.value = "", f(`已导入：${Object.entries(t.applied || {}).map(([l, i]) => `${l} ${i}`).join(" · ")}`));
    }
    async function Ll() {
      const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "export_all", payload: {} }) });
      if (!s.ok) {
        x.value = W(await s.text());
        return;
      }
      const t = new Blob([JSON.stringify(await s.json(), null, 2)], { type: "application/json" }), l = URL.createObjectURL(t), i = document.createElement("a");
      i.href = l, i.download = `life-full-${se()}.json`, i.click(), URL.revokeObjectURL(l);
    }
    async function Fl() {
      if (!P.value.trim()) return;
      let s;
      try {
        s = JSON.parse(P.value);
      } catch {
        x.value = "导入内容不是合法 JSON";
        return;
      }
      const t = await y("import_all", { snapshot: s });
      t && (P.value = "", f(`已全量导入：${Object.entries(t.applied || {}).map(([l, i]) => `${l} ${i}`).join(" · ")}`));
    }
    async function El() {
      const s = await y("diagnostics", {});
      s && (ye.value = s);
    }
    const Ye = c(""), Ge = c(""), Ke = c([]), Dt = c(0);
    async function Ot() {
      try {
        const s = await J("audit_query", { kind: Ye.value, outcome: Ge.value, limit: 120 });
        Ke.value = s?.items || [], Dt.value = s?.total || 0;
      } catch {
      }
    }
    const Lt = ["persona", "worldview", "style", "background", "wardrobe", "reference"], ue = c(""), h = c({ id: "", kind: "worldview", title: "", content: "", tags: "" }), Ft = k(() => (v.value.world || []).filter((s) => !ue.value || s.kind === ue.value));
    function ql(s) {
      h.value = { id: s.id, kind: s.kind, title: s.title, content: s.content, tags: s.tags || "" };
    }
    async function Et() {
      !h.value.title.trim() || !h.value.content.trim() || (await y("world_upsert", { ...h.value }), h.value = { id: "", kind: "worldview", title: "", content: "", tags: "" });
    }
    async function Pl(s) {
      await y("world_delete", { id: s });
    }
    const de = k(() => v.value.timeline || []), be = k(() => v.value.open_topics || []), Qe = k(() => v.value.portraits || []), We = k(() => v.value.reviews || []);
    function qt(s) {
      try {
        return JSON.parse(s.findings || "[]");
      } catch {
        return [];
      }
    }
    const He = c(""), Xe = k(() => {
      const s = He.value.trim().toLowerCase();
      return de.value.filter((t) => !s || `${t.topic} ${t.summary} ${t.detail || ""}`.toLowerCase().includes(s));
    }), Ze = c(""), Pt = k(() => {
      const s = Ze.value.trim().toLowerCase();
      return Z.value.filter((t) => !s || `${t.group_id} ${t.alias || ""}`.toLowerCase().includes(s));
    }), fe = k(() => v.value.emotion || { valence: 0, arousal: 0.5, connection: 0.5, irritation: 0 }), Jl = k(() => {
      const s = fe.value, t = [(Number(s.valence) + 1) / 2, Number(s.arousal), Number(s.connection), Number(s.irritation)], l = 60, i = 60, C = 46;
      return t.map((ge, N) => {
        const L = (-90 + N * 90) * Math.PI / 180, zt = C * Math.max(0.05, Math.min(1, Number(ge) || 0));
        return `${(l + zt * Math.cos(L)).toFixed(1)},${(i + zt * Math.sin(L)).toFixed(1)}`;
      }).join(" ");
    }), T = c({ kind: "tts", target: "", text: "", file: "" });
    async function Il() {
      const s = await y("send_media", { ...T.value });
      f(s?.ok ? "已发送" : `发送失败：${s?.reason || "未知"}`);
    }
    async function Rl() {
      const s = await y("backup_now", {});
      f(s?.backup ? "已备份陪伴数据" : `备份失败：${s?.error || "未知"}`);
    }
    const zl = se(), Jt = k(() => {
      const s = Date.now();
      return ne.value.filter((t) => {
        if (!t.start_at) return !1;
        const l = new Date(String(t.start_at).replace(" ", "T")).getTime();
        return !Number.isNaN(l) && l <= s;
      }).slice(-1)[0] || null;
    }), et = k(() => {
      const s = Date.now();
      return ne.value.find((t) => {
        if (!t.start_at) return !1;
        const l = new Date(String(t.start_at).replace(" ", "T")).getTime();
        return !Number.isNaN(l) && l > s;
      }) || null;
    }), It = k(() => (v.value.important_dates || []).map((s) => ({ ...s, inDays: Zt(s.date_text) })).filter((s) => s.inDays !== null).sort((s, t) => s.inDays - t.inDays).slice(0, 3)), Rt = k(() => (v.value.journal || [])[0] || null);
    k(() => (v.value.dreams || [])[0] || null);
    function V(s) {
      S.value = s;
      const t = ot.value;
      t ? t.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return Bl(H), (s, t) => (a(), o("main", {
      class: "pcp",
      ref_key: "pageEl",
      ref: ot
    }, [
      e("header", Kl, [
        e("div", Ql, [
          t[110] || (t[110] = e("div", { class: "hero-copy" }, [
            e("p", { class: "eyebrow" }, [
              e("b", null, "●"),
              b(" L.I.F.E / COMPANION")
            ]),
            e("h1", null, "陪伴面板"),
            e("p", { class: "sub" }, "日程、关系、主动、群聊、成长与诊断集中在这里；功能卡片点击进入对应视图。")
          ], -1)),
          e("div", Wl, [
            e("button", {
              class: "fab",
              disabled: Ue.value,
              onClick: Xt
            }, [
              t[109] || (t[109] = e("span", { class: "fab-ic" }, "✦", -1)),
              b(n(Ue.value ? "规划中…" : "让 LIFE 规划"), 1)
            ], 8, Hl),
            e("button", {
              class: "btn tonic",
              disabled: re.value,
              onClick: H
            }, n(re.value ? "刷新中…" : "刷新"), 9, Xl),
            e("button", {
              class: "btn text",
              onClick: t[0] || (t[0] = (l) => V("config"))
            }, "配置引导")
          ])
        ]),
        e("div", Zl, [
          e("button", {
            class: "stat",
            onClick: t[1] || (t[1] = (l) => V("users"))
          }, [
            t[111] || (t[111] = e("span", { class: "stat-ic t1" }, "☺", -1)),
            e("span", es, n(v.value.relationships?.length || 0), 1),
            t[112] || (t[112] = e("span", { class: "stat-cap" }, "关系对象", -1))
          ]),
          e("button", {
            class: "stat",
            onClick: t[2] || (t[2] = (l) => V("overview"))
          }, [
            t[113] || (t[113] = e("span", { class: "stat-ic t2" }, "▤", -1)),
            e("span", ts, n(ne.value.filter((l) => l.status === "active").length), 1),
            t[114] || (t[114] = e("span", { class: "stat-cap" }, "待进行日程", -1))
          ]),
          e("button", {
            class: "stat",
            onClick: t[3] || (t[3] = (l) => V("proactive"))
          }, [
            t[115] || (t[115] = e("span", { class: "stat-ic t3" }, "✦", -1)),
            e("span", ls, n(pe.value.length), 1),
            t[116] || (t[116] = e("span", { class: "stat-cap" }, "待投递主动", -1))
          ]),
          e("button", {
            class: "stat",
            onClick: t[4] || (t[4] = (l) => V("groups"))
          }, [
            t[117] || (t[117] = e("span", { class: "stat-ic t4" }, "☷", -1)),
            e("span", ss, n(Yt.value.length), 1),
            t[118] || (t[118] = e("span", { class: "stat-cap" }, "观察群聊", -1))
          ]),
          e("button", {
            class: "stat",
            onClick: t[5] || (t[5] = (l) => V("observe"))
          }, [
            t[119] || (t[119] = e("span", { class: "stat-ic t5" }, "◎", -1)),
            e("span", ns, n(be.value.length), 1),
            t[120] || (t[120] = e("span", { class: "stat-cap" }, "未完话题", -1))
          ]),
          e("button", {
            class: "stat",
            onClick: t[6] || (t[6] = (l) => V("observe"))
          }, [
            t[121] || (t[121] = e("span", { class: "stat-ic t6" }, "✎", -1)),
            e("span", as, n(De.value.length), 1),
            t[122] || (t[122] = e("span", { class: "stat-cap" }, "内容见闻", -1))
          ])
        ]),
        e("div", os, [
          e("span", is, "精力 " + n(Math.round(v.value.circadian?.mental_energy ?? 0)), 1),
          e("span", {
            class: w(["pill", { bad: (v.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + n(Math.round(v.value.circadian?.hunger ?? 0)), 3),
          e("span", {
            class: w(["pill", { bad: (v.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + n(Math.round(v.value.circadian?.health ?? 100)), 3),
          v.value.circadian?.is_sleeping ? (a(), o("span", us, "睡眠中")) : d("", !0),
          v.value.settings?.env_timezone ? (a(), o("span", ds, n(v.value.settings.env_timezone), 1)) : d("", !0),
          v.value.settings?.env_city ? (a(), o("span", rs, n(v.value.settings.env_city), 1)) : d("", !0),
          e("button", {
            class: "chip-btn",
            onClick: ll
          }, "吃饭"),
          e("button", {
            class: "chip-btn",
            onClick: Ae
          }, "今日穿搭"),
          e("button", {
            class: "chip-btn",
            onClick: vt
          }, "关系回落")
        ])
      ]),
      x.value ? (a(), o("p", cs, n(x.value), 1)) : d("", !0),
      ce.value ? (a(), o("p", vs, n(ce.value), 1)) : d("", !0),
      e("nav", ps, [
        (a(), o(_, null, m(Gt, (l) => e("button", {
          key: l.key,
          class: w(["tab", { active: S.value === l.key }]),
          onClick: (i) => V(l.key)
        }, [
          e("i", null, n(l.i), 1),
          e("span", ms, n(l.icon), 1),
          b(n(l.label), 1)
        ], 10, _s)), 64))
      ]),
      u(e("section", ys, [
        e("div", bs, [
          t[123] || (t[123] = e("div", null, [
            e("h2", null, "今日概览"),
            e("p", { class: "desc" }, "生活工作台：今天发生了什么、现在在做什么、接下来做什么。")
          ], -1)),
          e("div", fs, [
            e("button", {
              class: "btn tonal sm",
              onClick: mt
            }, "安排今天"),
            e("button", {
              class: "btn tonal sm",
              onClick: t[7] || (t[7] = (l) => $e("journal"))
            }, "生成日记"),
            e("button", {
              class: "btn tonal sm",
              onClick: t[8] || (t[8] = (l) => $e("dream"))
            }, "生成梦境")
          ])
        ]),
        e("div", gs, [
          e("div", ks, [
            e("article", hs, [
              e("header", null, [
                t[124] || (t[124] = e("span", { class: "dot ic" }, null, -1)),
                t[125] || (t[125] = e("h3", null, "今日", -1)),
                e("small", null, n(Yl(zl)), 1)
              ]),
              e("div", ws, [
                e("div", Cs, [
                  e("b", null, n(v.value.relationships?.length || 0), 1),
                  t[126] || (t[126] = e("span", null, "记住的人", -1))
                ]),
                e("div", xs, [
                  e("b", null, n(pe.value.length), 1),
                  t[127] || (t[127] = e("span", null, "待投递", -1))
                ]),
                e("div", $s, [
                  e("b", null, n(ne.value.length), 1),
                  t[128] || (t[128] = e("span", null, "今日日程", -1))
                ]),
                e("div", Ss, [
                  e("b", null, n(be.value.length), 1),
                  t[129] || (t[129] = e("span", null, "未完话题", -1))
                ])
              ]),
              It.value.length ? (a(), o("div", Us, [
                (a(!0), o(_, null, m(It.value, (l) => (a(), o("span", {
                  key: l.id,
                  class: "chip warn"
                }, n(l.title) + " · " + n(l.inDays === 0 ? "今天" : l.inDays + "天后"), 1))), 128))
              ])) : d("", !0)
            ]),
            e("article", Vs, [
              t[131] || (t[131] = e("header", null, [
                e("span", { class: "dot ic" }),
                e("h3", null, "当前")
              ], -1)),
              Jt.value ? (a(), o("div", Ns, [
                e("strong", null, n(Jt.value.title), 1),
                t[130] || (t[130] = e("span", { class: "chip ok" }, "进行中", -1))
              ])) : (a(), o("p", js, "此刻没有进行中的日程。")),
              et.value ? (a(), o("div", Ts, "接下来：" + n(et.value.start_at) + " " + n(et.value.title), 1)) : d("", !0)
            ]),
            v.value.calendar_candidates?.filter((l) => l.status === "pending_confirmation").length ? (a(), o("article", Ms, [
              e("header", null, [
                t[132] || (t[132] = e("span", { class: "dot ic" }, null, -1)),
                t[133] || (t[133] = e("h3", null, "待确认日程", -1)),
                e("small", null, n(v.value.calendar_candidates.filter((l) => l.status === "pending_confirmation").length), 1)
              ]),
              e("ul", Ds, [
                (a(!0), o(_, null, m(v.value.calendar_candidates.filter((l) => l.status === "pending_confirmation"), (l) => (a(), o("li", {
                  key: l.id
                }, [
                  e("span", null, [
                    b(n(l.title), 1),
                    e("em", Os, " · " + n(l.when_text), 1)
                  ]),
                  e("span", Ls, [
                    e("button", {
                      class: "btn filled sm",
                      onClick: (i) => y("confirm_agenda", { id: l.id })
                    }, "确认", 8, Fs),
                    e("button", {
                      class: "btn text sm",
                      onClick: (i) => y("reject_agenda", { id: l.id })
                    }, "拒绝", 8, Es)
                  ])
                ]))), 128))
              ])
            ])) : d("", !0),
            e("article", qs, [
              e("header", null, [
                t[134] || (t[134] = e("span", { class: "dot ic" }, null, -1)),
                t[135] || (t[135] = e("h3", null, "新增日程", -1)),
                e("button", {
                  class: "link",
                  onClick: mt
                }, "让 LIFE 安排")
              ]),
              e("div", Ps, [
                u(e("input", {
                  "onUpdate:modelValue": t[9] || (t[9] = (l) => le.value = l),
                  class: "field",
                  placeholder: "日程标题",
                  onKeyup: At(dt, ["enter"])
                }, null, 544), [
                  [r, le.value]
                ])
              ]),
              e("div", Js, [
                u(e("input", {
                  "onUpdate:modelValue": t[10] || (t[10] = (l) => ke.value = l),
                  class: "field",
                  placeholder: "时间，如 2026-09-25 20:00"
                }, null, 512), [
                  [r, ke.value]
                ])
              ]),
              u(e("textarea", {
                "onUpdate:modelValue": t[11] || (t[11] = (l) => he.value = l),
                class: "field area",
                placeholder: "说明（可选）"
              }, null, 512), [
                [r, he.value]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: dt,
                disabled: !le.value.trim()
              }, "添加到日程", 8, Is),
              t[136] || (t[136] = e("p", { class: "hint" }, "直接加入日程，无需确认。", -1))
            ])
          ]),
          e("div", Rs, [
            e("article", zs, [
              e("header", null, [
                t[137] || (t[137] = e("span", { class: "dot ic" }, null, -1)),
                t[138] || (t[138] = e("h3", null, "时间轴", -1)),
                e("button", {
                  class: "link",
                  onClick: t[12] || (t[12] = (l) => V("observe"))
                }, "完整日程")
              ]),
              e("ol", As, [
                (a(!0), o(_, null, m(ne.value, (l) => (a(), o("li", {
                  key: l.id,
                  class: w(Pe(l).cls)
                }, [
                  e("time", null, n((l.start_at || "").replace("T", " ").slice(11, 16) || "--:--"), 1),
                  e("div", null, [
                    e("strong", {
                      class: w({ done: l.status === "completed" })
                    }, n(l.title), 3),
                    l.detail ? (a(), o("span", Bs, n(l.detail), 1)) : d("", !0)
                  ]),
                  e("span", {
                    class: w(["chip", Pe(l).cls])
                  }, n(Pe(l).label), 3)
                ], 2))), 128)),
                ne.value.length ? d("", !0) : (a(), o("li", Ys, "今天还没有安排。"))
              ])
            ]),
            e("article", Gs, [
              e("header", null, [
                t[139] || (t[139] = e("span", { class: "dot ic" }, null, -1)),
                t[140] || (t[140] = e("h3", null, "最新日记", -1)),
                e("button", {
                  class: "link",
                  onClick: t[13] || (t[13] = (l) => V("observe"))
                }, "全部")
              ]),
              Rt.value ? (a(), o("p", Ks, n(Rt.value.content), 1)) : (a(), o("p", Qs, "今天还没有写下什么。")),
              e("div", Ws, [
                u(e("textarea", {
                  "onUpdate:modelValue": t[14] || (t[14] = (l) => we.value = l),
                  class: "field area",
                  placeholder: "为今天写下一点…"
                }, null, 512), [
                  [r, we.value]
                ]),
                e("button", {
                  class: "btn filled sm",
                  onClick: t[15] || (t[15] = (l) => rt("journal", we.value))
                }, "写入日记")
              ]),
              e("div", Hs, [
                u(e("textarea", {
                  "onUpdate:modelValue": t[16] || (t[16] = (l) => Ce.value = l),
                  class: "field area",
                  placeholder: "记录一个梦…"
                }, null, 512), [
                  [r, Ce.value]
                ]),
                e("button", {
                  class: "btn tonal sm",
                  onClick: t[17] || (t[17] = (l) => rt("dream", Ce.value))
                }, "写入梦境")
              ])
            ])
          ]),
          e("div", Xs, [
            e("article", Zs, [
              e("header", null, [
                t[141] || (t[141] = e("span", { class: "dot ic" }, null, -1)),
                t[142] || (t[142] = e("h3", null, "动态与记忆", -1)),
                e("button", {
                  class: "link",
                  onClick: t[18] || (t[18] = (l) => V("observe"))
                }, "观察")
              ]),
              e("ol", en, [
                (a(!0), o(_, null, m(de.value.slice(0, 5), (l) => (a(), o("li", {
                  key: l.id
                }, [
                  t[143] || (t[143] = e("span", { class: "dot" }, null, -1)),
                  e("div", null, [
                    e("strong", null, n(l.topic), 1),
                    e("span", tn, n(l.summary), 1)
                  ])
                ]))), 128)),
                de.value.length ? d("", !0) : (a(), o("li", ln, "还没有记录。"))
              ])
            ]),
            e("article", sn, [
              e("header", null, [
                t[144] || (t[144] = e("span", { class: "dot ic" }, null, -1)),
                t[145] || (t[145] = e("h3", null, "运行能力", -1)),
                e("button", {
                  class: "link",
                  onClick: t[19] || (t[19] = (l) => V("models"))
                }, "模型")
              ]),
              e("div", nn, [
                (a(!0), o(_, null, m(Ee.value, (l) => (a(), o("span", {
                  key: l.name,
                  class: w(["cap", { off: !l.available }])
                }, [
                  e("b", null, n(l.name), 1),
                  e("small", null, n(l.available ? "可用" : "未就绪"), 1)
                ], 2))), 128)),
                Ee.value.length ? d("", !0) : (a(), o("span", an, "没有注册的扩展。"))
              ])
            ])
          ])
        ]),
        e("details", on, [
          t[154] || (t[154] = e("summary", null, [
            e("b", null, "关系与主动策略"),
            e("small", null, "私聊、群聊与长线主动的当前概况")
          ], -1)),
          e("div", un, [
            e("article", dn, [
              t[146] || (t[146] = e("h3", null, "私聊关系", -1)),
              e("ul", rn, [
                (a(!0), o(_, null, m((v.value.relationships || []).slice(0, 5), (l) => (a(), o("li", {
                  key: l.user_id
                }, [
                  e("span", null, [
                    b(n(l.user_id), 1),
                    yt.value.includes(l.user_id) ? (a(), o("em", cn, "owner")) : d("", !0)
                  ]),
                  e("b", null, n(l.stage) + " · " + n(Math.round((l.affinity || 0) * 100)) + "%", 1)
                ]))), 128)),
                (v.value.relationships || []).length ? d("", !0) : (a(), o("li", vn, "暂无"))
              ])
            ]),
            e("article", pn, [
              t[147] || (t[147] = e("h3", null, "群聊观察", -1)),
              e("ul", _n, [
                (a(!0), o(_, null, m(Z.value.slice(0, 5), (l) => (a(), o("li", {
                  key: l.group_id
                }, [
                  e("span", null, n(l.alias || l.group_id), 1),
                  e("b", null, n(l.policy) + " · " + n(l.observations) + " 条", 1)
                ]))), 128)),
                Z.value.length ? d("", !0) : (a(), o("li", mn, "暂无"))
              ])
            ]),
            e("article", yn, [
              t[152] || (t[152] = e("h3", null, "长线主动", -1)),
              e("div", bn, [
                e("label", null, [
                  t[148] || (t[148] = e("span", null, "每日上限", -1)),
                  u(e("input", {
                    "onUpdate:modelValue": t[20] || (t[20] = (l) => $.value.daily_limit = l),
                    type: "number",
                    min: "0",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      r,
                      $.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                e("label", null, [
                  t[149] || (t[149] = e("span", null, "单人上限", -1)),
                  u(e("input", {
                    "onUpdate:modelValue": t[21] || (t[21] = (l) => $.value.per_target_limit = l),
                    type: "number",
                    min: "0",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      r,
                      $.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                e("label", null, [
                  t[150] || (t[150] = e("span", null, "免打扰起", -1)),
                  u(e("input", {
                    "onUpdate:modelValue": t[22] || (t[22] = (l) => $.value.quiet_start = l),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      r,
                      $.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                e("label", null, [
                  t[151] || (t[151] = e("span", null, "免打扰止", -1)),
                  u(e("input", {
                    "onUpdate:modelValue": t[23] || (t[23] = (l) => $.value.quiet_end = l),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      r,
                      $.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                e("button", {
                  class: "btn tonal sm",
                  onClick: Qt
                }, "保存策略")
              ]),
              t[153] || (t[153] = e("p", { class: "hint" }, "未回应会降速：连续 2 次暂停 24h、3 次暂停 3 天；回复即重置。", -1))
            ])
          ])
        ]),
        e("details", fn, [
          t[159] || (t[159] = e("summary", null, [
            e("b", null, "观察与内容记录"),
            e("small", null, "关系分布、群聊分布、内容见闻与活跃")
          ], -1)),
          e("div", gn, [
            e("article", kn, [
              t[155] || (t[155] = e("h3", null, "私聊关系分布", -1)),
              e("div", hn, [
                (a(!0), o(_, null, m((v.value.relationships || []).slice(0, 8), (l) => (a(), o("div", {
                  key: l.user_id,
                  class: "bar-row"
                }, [
                  e("span", wn, n(l.user_id), 1),
                  e("div", Cn, [
                    e("i", {
                      style: te({ width: xe(l.affinity) })
                    }, null, 4)
                  ]),
                  e("b", null, n(Math.round((l.affinity || 0) * 100)) + "%", 1)
                ]))), 128)),
                (v.value.relationships || []).length ? d("", !0) : (a(), o("p", xn, "暂无"))
              ])
            ]),
            e("article", $n, [
              t[156] || (t[156] = e("h3", null, "群聊观测分布", -1)),
              e("div", Sn, [
                (a(!0), o(_, null, m(Z.value.slice(0, 8), (l) => (a(), o("div", {
                  key: l.group_id,
                  class: "bar-row"
                }, [
                  e("span", Un, n(l.alias || l.group_id), 1),
                  e("div", Vn, [
                    e("i", {
                      style: te({ width: Math.min(100, l.observations) + "%" })
                    }, null, 4)
                  ]),
                  e("b", null, n(l.observations), 1)
                ]))), 128)),
                Z.value.length ? d("", !0) : (a(), o("p", Nn, "暂无"))
              ])
            ]),
            e("article", jn, [
              e("h3", null, [
                t[157] || (t[157] = b("内容见闻 ", -1)),
                e("button", {
                  class: "link",
                  onClick: ht
                }, "抓取")
              ]),
              e("ol", Tn, [
                (a(!0), o(_, null, m(De.value.slice(0, 6), (l) => (a(), o("li", {
                  key: l.id
                }, [
                  e("strong", null, n(l.title), 1),
                  e("span", Mn, n(l.kind) + " · " + n(D(l.created_at)), 1)
                ]))), 128)),
                De.value.length ? d("", !0) : (a(), o("li", Dn, "暂无；在配置里填 news_feeds 并开启内容抓取。"))
              ])
            ]),
            e("article", On, [
              t[158] || (t[158] = e("h3", null, "最近活跃", -1)),
              e("ol", Ln, [
                (a(!0), o(_, null, m(de.value.slice(0, 8), (l) => (a(), o("li", {
                  key: l.id
                }, [
                  e("strong", null, n(l.topic), 1),
                  e("span", Fn, n(D(l.created_at)) + " · " + n(l.summary), 1)
                ]))), 128)),
                de.value.length ? d("", !0) : (a(), o("li", En, "暂无"))
              ])
            ])
          ])
        ])
      ], 512), [
        [M, S.value === "overview"]
      ]),
      u(e("section", qn, [
        e("div", Pn, [
          t[160] || (t[160] = e("div", null, [
            e("h2", null, "世界知识"),
            e("p", { class: "desc" }, "角色资料、世界观、衣橱与引用资料；作为日程、状态、日记与主动行为的背景，不覆盖主回复人格。")
          ], -1)),
          e("div", Jn, [
            e("button", {
              class: "btn tonal sm",
              onClick: Ae
            }, "今日穿搭"),
            e("button", {
              class: "btn filled sm",
              onClick: Et,
              disabled: !h.value.title.trim() || !h.value.content.trim()
            }, n(h.value.id ? "保存" : "添加"), 9, In)
          ])
        ]),
        e("div", Rn, [
          e("aside", zn, [
            e("button", {
              class: w({ active: ue.value === "" }),
              onClick: t[24] || (t[24] = (l) => ue.value = "")
            }, [
              t[161] || (t[161] = b("全部 ", -1)),
              e("b", null, n((v.value.world || []).length), 1)
            ], 2),
            (a(), o(_, null, m(Lt, (l) => e("button", {
              key: l,
              class: w({ active: ue.value === l }),
              onClick: (i) => ue.value = l
            }, n(l), 11, An)), 64))
          ]),
          e("div", Bn, [
            e("article", Yn, [
              e("h3", null, n(h.value.id ? "编辑条目" : "新增条目"), 1),
              e("div", Gn, [
                u(e("select", {
                  "onUpdate:modelValue": t[25] || (t[25] = (l) => h.value.kind = l),
                  class: "field",
                  style: { "max-width": "150px" }
                }, [
                  (a(), o(_, null, m(Lt, (l) => e("option", {
                    key: l,
                    value: l
                  }, n(l), 9, Kn)), 64))
                ], 512), [
                  [I, h.value.kind]
                ]),
                u(e("input", {
                  "onUpdate:modelValue": t[26] || (t[26] = (l) => h.value.title = l),
                  class: "field",
                  placeholder: "标题，如 世界观 / 今日穿搭"
                }, null, 512), [
                  [r, h.value.title]
                ])
              ]),
              u(e("textarea", {
                "onUpdate:modelValue": t[27] || (t[27] = (l) => h.value.content = l),
                class: "field area",
                placeholder: "内容…"
              }, null, 512), [
                [r, h.value.content]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[28] || (t[28] = (l) => h.value.tags = l),
                class: "field",
                placeholder: "标签（可选）"
              }, null, 512), [
                [r, h.value.tags]
              ]),
              e("div", Qn, [
                e("button", {
                  class: "btn filled sm",
                  onClick: Et,
                  disabled: !h.value.title.trim() || !h.value.content.trim()
                }, n(h.value.id ? "保存" : "添加"), 9, Wn),
                h.value.id ? (a(), o("button", {
                  key: 0,
                  class: "btn text sm",
                  onClick: t[29] || (t[29] = (l) => h.value = { id: "", kind: "worldview", title: "", content: "", tags: "" })
                }, "取消编辑")) : d("", !0)
              ])
            ]),
            e("div", Hn, [
              (a(!0), o(_, null, m(Ft.value, (l) => (a(), o("article", {
                key: l.id,
                class: "card item-card"
              }, [
                e("div", Xn, [
                  e("strong", null, n(l.title), 1),
                  e("span", Zn, n(l.kind), 1)
                ]),
                e("p", ea, n(l.content), 1),
                l.tags ? (a(), o("span", ta, n(l.tags), 1)) : d("", !0),
                e("div", la, [
                  e("button", {
                    class: "btn tonal sm",
                    onClick: (i) => ql(l)
                  }, "编辑", 8, sa),
                  e("button", {
                    class: "btn danger sm",
                    onClick: (i) => Pl(l.id)
                  }, "删除", 8, na)
                ])
              ]))), 128)),
              Ft.value.length ? d("", !0) : (a(), o("p", aa, "还没有条目。"))
            ])
          ])
        ])
      ], 512), [
        [M, S.value === "world"]
      ]),
      u(e("section", oa, [
        e("div", ia, [
          t[163] || (t[163] = e("div", null, [
            e("h2", null, "用户档案"),
            e("p", { class: "desc" }, "关系阶段、互动表达、未完话题与画像；先看身份，再进入详情。")
          ], -1)),
          e("div", ua, [
            u(e("input", {
              "onUpdate:modelValue": t[30] || (t[30] = (l) => Ve.value = l),
              class: "field search",
              placeholder: "搜索用户 ID"
            }, null, 512), [
              [r, Ve.value]
            ]),
            u(e("select", {
              "onUpdate:modelValue": t[31] || (t[31] = (l) => Ne.value = l),
              class: "field",
              style: { "max-width": "150px" }
            }, [
              t[162] || (t[162] = e("option", { value: "" }, "全部阶段", -1)),
              (a(!0), o(_, null, m(nl.value, (l) => (a(), o("option", {
                key: l,
                value: l
              }, n(l), 9, da))), 128))
            ], 512), [
              [I, Ne.value]
            ])
          ])
        ]),
        e("div", ra, [
          e("aside", ca, [
            e("div", va, [
              t[164] || (t[164] = e("span", { class: "eyebrow" }, "PEOPLE", -1)),
              e("span", pa, n(Ie.value.length), 1)
            ]),
            (a(!0), o(_, null, m(Ie.value, (l) => (a(), o("button", {
              key: l.user_id,
              class: w(["roster-row", { active: F.value === l.user_id }]),
              onClick: (i) => Re(l.user_id)
            }, [
              e("span", ma, n((l.user_id || "?").slice(0, 1).toUpperCase()), 1),
              e("span", ya, [
                e("span", ba, [
                  b(n(l.user_id), 1),
                  yt.value.includes(l.user_id) ? (a(), o("em", fa, "owner")) : d("", !0)
                ]),
                e("span", ga, [
                  e("i", {
                    style: te({ width: xe(l.affinity) })
                  }, null, 4)
                ]),
                e("span", ka, n(l.stage) + " · " + n(Math.round((l.affinity || 0) * 100)) + "%", 1)
              ])
            ], 10, _a))), 128)),
            Ie.value.length ? d("", !0) : (a(), o("p", ha, "没有匹配的用户。"))
          ]),
          e("div", wa, [
            F.value ? (a(), o("button", {
              key: 0,
              class: "btn text sm",
              onClick: al
            }, "← 返回目录")) : d("", !0),
            Je.value ? (a(), o("div", Ca, "加载中…")) : g.value ? (a(), o(_, { key: 2 }, [
              e("div", xa, [
                e("span", $a, n((g.value.user_id || "?").slice(0, 1).toUpperCase()), 1),
                e("div", null, [
                  e("strong", null, n(g.value.user_id), 1),
                  e("span", Sa, "角色 " + n(g.value.role || "other") + " · 阶段 " + n(g.value.relationship?.stage) + " · 互动 " + n(g.value.expression?.interaction) + " · 好感 " + n(Math.round((g.value.relationship?.affinity || 0) * 100)) + "%", 1)
                ])
              ]),
              e("nav", Ua, [
                (a(), o(_, null, m(sl, (l) => e("button", {
                  key: l.key,
                  class: w({ active: X.value === l.key }),
                  onClick: (i) => X.value = l.key
                }, n(l.label), 11, Va)), 64))
              ]),
              X.value === "overview" ? (a(), o("div", Na, [
                e("div", ja, [
                  e("div", Ta, [
                    t[165] || (t[165] = e("span", null, "关系事件", -1)),
                    e("b", null, n(g.value.counts?.ledger || 0), 1)
                  ]),
                  e("div", Ma, [
                    t[166] || (t[166] = e("span", null, "主动候选", -1)),
                    e("b", null, n(g.value.counts?.candidates || 0), 1)
                  ]),
                  e("div", Da, [
                    t[167] || (t[167] = e("span", null, "已投递", -1)),
                    e("b", null, n(g.value.counts?.delivered || 0), 1)
                  ]),
                  e("div", Oa, [
                    t[168] || (t[168] = e("span", null, "记忆条数", -1)),
                    e("b", null, n(g.value.memories?.total || 0), 1)
                  ]),
                  e("div", La, [
                    t[169] || (t[169] = e("span", null, "主动额度", -1)),
                    e("b", null, n(g.value.expression?.proactive_limit ?? "—"), 1)
                  ])
                ]),
                oe.value?.summary ? (a(), o("div", Fa, [
                  t[170] || (t[170] = e("b", null, "画像：", -1)),
                  b(n(oe.value.summary), 1),
                  oe.value.traits ? (a(), o(_, { key: 0 }, [
                    b(" · " + n(oe.value.traits), 1)
                  ], 64)) : d("", !0)
                ])) : d("", !0),
                g.value.expression?.tone ? (a(), o("div", Ea, [
                  t[171] || (t[171] = e("b", null, "表达基调：", -1)),
                  b(n(g.value.expression.tone), 1)
                ])) : d("", !0),
                t[172] || (t[172] = e("h4", { class: "sub-label" }, "未完话题", -1)),
                e("div", qa, [
                  (a(!0), o(_, null, m(je.value, (l) => (a(), o("span", {
                    key: l,
                    class: "chip"
                  }, [
                    b(n(l), 1),
                    e("button", {
                      onClick: (i) => il(l)
                    }, "×", 8, Pa)
                  ]))), 128)),
                  je.value.length ? d("", !0) : (a(), o("span", Ja, "暂无"))
                ]),
                e("div", Ia, [
                  u(e("input", {
                    "onUpdate:modelValue": t[32] || (t[32] = (l) => ae.value = l),
                    class: "field",
                    placeholder: "手动加一条待跟进话题…",
                    onKeyup: At(wt, ["enter"])
                  }, null, 544), [
                    [r, ae.value]
                  ]),
                  e("button", {
                    class: "btn tonal sm",
                    onClick: wt,
                    disabled: !ae.value.trim()
                  }, "加入", 8, Ra)
                ])
              ])) : X.value === "relationship" ? (a(), o("div", za, [
                e("div", Aa, [
                  e("i", {
                    style: te({ width: xe(g.value.relationship?.affinity) })
                  }, null, 4)
                ]),
                e("p", Ba, "阶段 " + n(g.value.expression?.stage) + " · 互动 " + n(g.value.expression?.interaction) + " · 额度 " + n(g.value.expression?.proactive_limit) + " · 专属联结 " + n(g.value.expression?.bond ? "是" : "否"), 1),
                e("div", Ya, [
                  e("button", {
                    class: "btn tonal sm",
                    onClick: t[33] || (t[33] = (l) => ct(g.value.user_id, 0.05))
                  }, "更亲近 +"),
                  e("button", {
                    class: "btn tonal sm",
                    onClick: t[34] || (t[34] = (l) => ct(g.value.user_id, -0.05))
                  }, "更疏远 −")
                ]),
                t[173] || (t[173] = e("h4", { class: "sub-label" }, "事件账本", -1)),
                e("ol", Ga, [
                  (a(!0), o(_, null, m(g.value.ledger, (l) => (a(), o("li", {
                    key: l.id
                  }, [
                    e("span", {
                      class: w(l.delta >= 0 ? "pos" : "neg")
                    }, n(l.delta >= 0 ? "+" : "") + n(l.delta), 3),
                    b(" " + n(l.event_key) + " · " + n(l.reason) + " · " + n(D(l.created_at)), 1)
                  ]))), 128)),
                  (g.value.ledger || []).length ? d("", !0) : (a(), o("li", Ka, "暂无"))
                ])
              ])) : X.value === "proactive" ? (a(), o("div", Qa, [
                e("ol", Wa, [
                  (a(!0), o(_, null, m(g.value.proactive?.candidates || [], (l) => (a(), o("li", {
                    key: l.id
                  }, [
                    e("strong", null, n(l.motive), 1),
                    b(" · " + n(l.status), 1),
                    e("span", Ha, n(l.content), 1),
                    ["delivered", "cancelled"].includes(l.status) ? d("", !0) : (a(), o("button", {
                      key: 0,
                      class: "btn danger sm",
                      onClick: (i) => pt(l.id)
                    }, "取消", 8, Xa))
                  ]))), 128)),
                  (g.value.proactive?.candidates || []).length ? d("", !0) : (a(), o("li", Za, "暂无"))
                ])
              ])) : X.value === "memory" ? (a(), o("div", eo, [
                e("ol", to, [
                  (a(!0), o(_, null, m(g.value.memories?.items || [], (l) => (a(), o("li", {
                    key: l.id
                  }, [
                    b(n(l.content), 1),
                    e("span", lo, "scope " + n(l.scope) + " · 重要度 " + n(Math.round((l.importance || 0) * 100)) + "%", 1),
                    e("button", {
                      class: "btn danger sm",
                      onClick: (i) => ol(l.id)
                    }, "删除", 8, so)
                  ]))), 128)),
                  (g.value.memories?.items || []).length ? d("", !0) : (a(), o("li", no, "没有相关记忆"))
                ])
              ])) : (a(), o("div", ao, [
                e("ol", oo, [
                  (a(!0), o(_, null, m(g.value.audit || [], (l) => (a(), o("li", {
                    key: l.id
                  }, [
                    e("strong", null, n(l.kind), 1),
                    b(" · " + n(l.outcome), 1),
                    e("span", io, n(l.target) + " · " + n(D(l.created_at)), 1)
                  ]))), 128)),
                  (g.value.audit || []).length ? d("", !0) : (a(), o("li", uo, "暂无"))
                ])
              ]))
            ], 64)) : (a(), o("p", ro, "从左侧选择一个用户查看详情。"))
          ])
        ])
      ], 512), [
        [M, S.value === "users"]
      ]),
      u(e("section", co, [
        e("div", vo, [
          t[174] || (t[174] = e("div", null, [
            e("h2", null, "群聊观察"),
            e("p", { class: "desc" }, "群气氛、话题线、黑话与成员安全。")
          ], -1)),
          e("div", po, [
            u(e("input", {
              "onUpdate:modelValue": t[35] || (t[35] = (l) => Ze.value = l),
              class: "field search",
              placeholder: "搜索群号 / 备注"
            }, null, 512), [
              [r, Ze.value]
            ]),
            e("button", {
              class: "btn tonal sm",
              onClick: Ut
            }, "兴趣唤醒一次")
          ])
        ]),
        e("article", _o, [
          e("div", mo, [
            u(e("input", {
              "onUpdate:modelValue": t[36] || (t[36] = (l) => E.value.group_id = l),
              class: "field",
              placeholder: "群号"
            }, null, 512), [
              [r, E.value.group_id]
            ]),
            u(e("select", {
              "onUpdate:modelValue": t[37] || (t[37] = (l) => E.value.policy = l),
              class: "field",
              style: { "max-width": "130px" }
            }, [...t[175] || (t[175] = [
              e("option", { value: "observe" }, "观察", -1),
              e("option", { value: "whitelist" }, "白名单", -1),
              e("option", { value: "blacklist" }, "黑名单", -1)
            ])], 512), [
              [I, E.value.policy]
            ]),
            u(e("input", {
              "onUpdate:modelValue": t[38] || (t[38] = (l) => E.value.alias = l),
              class: "field",
              placeholder: "备注名（可选）"
            }, null, 512), [
              [r, E.value.alias]
            ]),
            e("button", {
              class: "btn filled sm",
              onClick: yl,
              disabled: !E.value.group_id.trim()
            }, "添加群", 8, yo)
          ]),
          e("div", bo, [
            (a(!0), o(_, null, m(Pt.value, (l) => (a(), o("article", {
              key: l.group_id,
              class: "card sub"
            }, [
              e("div", fo, [
                e("strong", null, n(l.group_id), 1),
                l.alias ? (a(), o("span", go, n(l.alias), 1)) : d("", !0),
                e("span", {
                  class: w(["chip", l.policy === "blacklist" ? "danger" : l.policy === "whitelist" ? "ok" : "muted"])
                }, n(l.policy), 3)
              ]),
              e("span", ko, [
                b(n(l.observations) + " 条观察 · " + n(l.topics) + " 个话题", 1),
                me.value[l.group_id] ? (a(), o(_, { key: 0 }, [
                  b(" · 气氛 " + n(me.value[l.group_id].label), 1)
                ], 64)) : d("", !0)
              ]),
              K.value === l.group_id ? (a(), o("div", ho, [
                t[177] || (t[177] = e("h4", { class: "sub-label" }, "话题线", -1)),
                e("div", wo, [
                  (a(!0), o(_, null, m(me.value[l.group_id]?.threads || [], (i) => (a(), o("span", {
                    key: i.topic,
                    class: "chip muted"
                  }, n(i.topic) + " · " + n(Math.round(i.score)), 1))), 128)),
                  (me.value[l.group_id]?.threads || []).length ? d("", !0) : (a(), o("span", Co, "暂无"))
                ]),
                t[178] || (t[178] = e("h4", { class: "sub-label" }, "黑话 / 话题", -1)),
                e("div", xo, [
                  (a(!0), o(_, null, m($t.value[l.group_id] || [], (i) => (a(), o("span", {
                    key: i.topic,
                    class: "chip muted"
                  }, [
                    b(n(i.topic) + " · " + n(Math.round(i.score)), 1),
                    e("button", {
                      onClick: (C) => wl(l.group_id, i.topic)
                    }, "×", 8, $o)
                  ]))), 128))
                ]),
                e("div", So, [
                  u(e("input", {
                    "onUpdate:modelValue": (i) => Oe.value[l.group_id] = i,
                    class: "field",
                    placeholder: "新增黑话 / 话题"
                  }, null, 8, Uo), [
                    [r, Oe.value[l.group_id]]
                  ]),
                  e("button", {
                    class: "btn tonal sm",
                    onClick: (i) => hl(l.group_id)
                  }, "添加", 8, Vo)
                ]),
                t[179] || (t[179] = e("h4", { class: "sub-label" }, "成员安全", -1)),
                e("div", No, [
                  (a(!0), o(_, null, m(St.value[l.group_id] || [], (i) => (a(), o("div", {
                    key: i.user_id,
                    class: "member"
                  }, [
                    e("span", null, n(i.user_id), 1),
                    e("span", jo, n(i.messages) + " 条", 1),
                    e("select", {
                      value: i.flag,
                      onChange: (C) => gl(l.group_id, i.user_id, C),
                      class: "field tiny"
                    }, [...t[176] || (t[176] = [
                      e("option", { value: "watch" }, "关注", -1),
                      e("option", { value: "allow" }, "放行", -1),
                      e("option", { value: "mute" }, "禁言", -1)
                    ])], 40, To)
                  ]))), 128))
                ])
              ])) : d("", !0),
              e("div", Mo, [
                e("select", {
                  value: l.policy,
                  onChange: (i) => fl(l, i),
                  class: "field tiny",
                  style: { "max-width": "120px" }
                }, [...t[180] || (t[180] = [
                  e("option", { value: "observe" }, "观察", -1),
                  e("option", { value: "whitelist" }, "白名单", -1),
                  e("option", { value: "blacklist" }, "黑名单", -1)
                ])], 40, Do),
                e("button", {
                  class: "btn tonal sm",
                  onClick: (i) => kl(l.group_id)
                }, n(K.value === l.group_id ? "收起" : "管理"), 9, Oo),
                e("button", {
                  class: "btn danger sm",
                  onClick: (i) => bl(l.group_id)
                }, "删除", 8, Lo)
              ])
            ]))), 128)),
            Pt.value.length ? d("", !0) : (a(), o("p", Fo, "还没有群记录。"))
          ])
        ])
      ], 512), [
        [M, S.value === "groups"]
      ]),
      u(e("section", Eo, [
        t[188] || (t[188] = e("div", { class: "section-head" }, [
          e("div", null, [
            e("h2", null, "学习"),
            e("p", { class: "desc" }, "技能成长、表达学习与社交关系网。")
          ])
        ], -1)),
        e("div", qo, [
          e("article", Po, [
            e("h3", null, [
              t[181] || (t[181] = b("技能学习 ", -1)),
              e("span", Jo, n((v.value.skills || []).length), 1)
            ]),
            e("div", Io, [
              u(e("input", {
                "onUpdate:modelValue": t[39] || (t[39] = (l) => O.value.name = l),
                class: "field",
                placeholder: "技能，如 弹钢琴"
              }, null, 512), [
                [r, O.value.name]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[40] || (t[40] = (l) => O.value.level = l),
                type: "number",
                min: "1",
                max: "10",
                class: "field tiny"
              }, null, 512), [
                [
                  r,
                  O.value.level,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            u(e("input", {
              "onUpdate:modelValue": t[41] || (t[41] = (l) => O.value.keywords = l),
              class: "field",
              placeholder: "关键词（逗号分隔，可选）"
            }, null, 512), [
              [r, O.value.keywords]
            ]),
            e("button", {
              class: "btn filled sm",
              onClick: Cl,
              disabled: !O.value.name.trim()
            }, "添加技能", 8, Ro),
            e("ol", zo, [
              (a(!0), o(_, null, m(v.value.skills, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", null, n(l.name), 1),
                t[182] || (t[182] = b()),
                e("span", Ao, "Lv." + n(l.level), 1),
                b(" " + n(l.category), 1),
                e("div", Bo, [
                  e("button", {
                    class: "btn tonal sm",
                    onClick: (i) => xl(l.name)
                  }, "练习 +1", 8, Yo),
                  e("button", {
                    class: "btn danger sm",
                    onClick: (i) => $l(l.id)
                  }, "删除", 8, Go)
                ])
              ]))), 128)),
              (v.value.skills || []).length ? d("", !0) : (a(), o("li", Ko, "还没有技能"))
            ])
          ]),
          e("article", Qo, [
            t[184] || (t[184] = e("h3", null, "表达学习", -1)),
            e("div", Wo, [
              e("button", {
                class: w({ active: ee.value === "pending" }),
                onClick: t[42] || (t[42] = (l) => ee.value = "pending")
              }, "待审 " + n(Be.value.pending), 3),
              e("button", {
                class: w({ active: ee.value === "approved" }),
                onClick: t[43] || (t[43] = (l) => ee.value = "approved")
              }, "已用 " + n(Be.value.approved), 3),
              e("button", {
                class: w({ active: ee.value === "rejected" }),
                onClick: t[44] || (t[44] = (l) => ee.value = "rejected")
              }, "已拒 " + n(Be.value.rejected), 3)
            ]),
            e("div", Ho, [
              u(e("input", {
                "onUpdate:modelValue": t[45] || (t[45] = (l) => B.value.text = l),
                class: "field",
                placeholder: "表达，如 晚安呀"
              }, null, 512), [
                [r, B.value.text]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[46] || (t[46] = (l) => B.value.scene = l),
                class: "field",
                style: { "max-width": "120px" },
                placeholder: "场景"
              }, null, 512), [
                [r, B.value.scene]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: Sl,
                disabled: !B.value.text.trim()
              }, "入库", 8, Xo)
            ]),
            e("ol", Zo, [
              (a(!0), o(_, null, m(Vt.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", null, n(l.text), 1),
                t[183] || (t[183] = b()),
                e("span", ei, n(l.scene || "通用") + " · " + n(l.source), 1),
                e("div", ti, [
                  l.status === "pending" ? (a(), o("button", {
                    key: 0,
                    class: "btn tonal sm",
                    onClick: (i) => Nt(l.id, !0)
                  }, "采用", 8, li)) : d("", !0),
                  l.status === "pending" ? (a(), o("button", {
                    key: 1,
                    class: "btn text sm",
                    onClick: (i) => Nt(l.id, !1)
                  }, "拒绝", 8, si)) : d("", !0),
                  e("button", {
                    class: "btn danger sm",
                    onClick: (i) => Ul(l.id)
                  }, "删除", 8, ni)
                ])
              ]))), 128)),
              Vt.value.length ? d("", !0) : (a(), o("li", ai, "该分类下没有表达"))
            ])
          ]),
          e("article", oi, [
            e("h3", null, [
              t[185] || (t[185] = b("社交关系网 ", -1)),
              e("span", ii, n((v.value.social_nodes || []).length) + " / " + n((v.value.social_edges || []).length), 1)
            ]),
            e("div", ui, [
              u(e("input", {
                "onUpdate:modelValue": t[47] || (t[47] = (l) => Y.value.user_id = l),
                class: "field",
                placeholder: "用户 ID"
              }, null, 512), [
                [r, Y.value.user_id]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[48] || (t[48] = (l) => Y.value.name = l),
                class: "field",
                placeholder: "称呼（可选）"
              }, null, 512), [
                [r, Y.value.name]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: Vl,
                disabled: !Y.value.user_id.trim()
              }, "加入", 8, di)
            ]),
            e("ol", ri, [
              (a(!0), o(_, null, m(v.value.social_nodes, (l) => (a(), o("li", {
                key: l.user_id
              }, [
                e("strong", null, n(l.name || l.user_id), 1),
                t[186] || (t[186] = b()),
                e("span", ci, n(l.user_id), 1)
              ]))), 128)),
              (v.value.social_nodes || []).length ? d("", !0) : (a(), o("li", vi, "关系网还是空的"))
            ]),
            t[187] || (t[187] = e("h4", { class: "sub-label" }, "关系连线", -1)),
            e("div", pi, [
              u(e("input", {
                "onUpdate:modelValue": t[49] || (t[49] = (l) => q.value.source_id = l),
                class: "field",
                placeholder: "A"
              }, null, 512), [
                [r, q.value.source_id]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[50] || (t[50] = (l) => q.value.target_id = l),
                class: "field",
                placeholder: "B"
              }, null, 512), [
                [r, q.value.target_id]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[51] || (t[51] = (l) => q.value.relation = l),
                class: "field",
                placeholder: "关系"
              }, null, 512), [
                [r, q.value.relation]
              ]),
              e("button", {
                class: "btn tonal sm",
                onClick: Nl
              }, "连线")
            ]),
            e("ol", _i, [
              (a(!0), o(_, null, m(v.value.social_edges, (l) => (a(), o("li", {
                key: l.id
              }, [
                b(n(l.source_id) + " → " + n(l.target_id) + " · " + n(l.relation) + " ", 1),
                e("button", {
                  class: "btn danger sm",
                  onClick: (i) => jl(l.id)
                }, "×", 8, mi)
              ]))), 128)),
              (v.value.social_edges || []).length ? d("", !0) : (a(), o("li", yi, "还没有连线"))
            ])
          ])
        ])
      ], 512), [
        [M, S.value === "learning"]
      ]),
      u(e("section", bi, [
        e("div", fi, [
          t[189] || (t[189] = e("div", null, [
            e("h2", null, "观察"),
            e("p", { class: "desc" }, "日程日历、目标、性格演化、未完话题、画像与自我时间线。")
          ], -1)),
          e("div", gi, [
            e("button", {
              class: "btn tonal sm",
              onClick: t[52] || (t[52] = (l) => ft(-1))
            }, "←"),
            e("strong", null, n(_e.value), 1),
            e("button", {
              class: "btn tonal sm",
              onClick: t[53] || (t[53] = (l) => ft(1))
            }, "→")
          ])
        ]),
        e("div", ki, [
          e("article", hi, [
            e("div", wi, [
              (a(), o(_, null, m(["日", "一", "二", "三", "四", "五", "六"], (l) => e("span", { key: l }, n(l), 1)), 64))
            ]),
            e("div", Ci, [
              (a(!0), o(_, null, m(ul.value, (l) => (a(), o("div", {
                key: l.key,
                class: w(["cal-cell", { empty: l.empty, today: l.today, has: l.events?.length }])
              }, [
                l.empty ? d("", !0) : (a(), o("span", xi, n(l.day), 1)),
                (a(!0), o(_, null, m((l.events || []).slice(0, 2), (i) => (a(), o("span", {
                  key: i.id,
                  class: "cal-chip"
                }, n(i.title), 1))), 128)),
                (l.events || []).length > 2 ? (a(), o("span", $i, "+" + n(l.events.length - 2), 1)) : d("", !0)
              ], 2))), 128))
            ]),
            z.value.conflicts?.length ? (a(), o("p", Si, "⚠ " + n(z.value.conflicts.length) + " 处时间冲突：" + n(z.value.conflicts.map((l) => l.titles.join(" / ")).join("；")), 1)) : d("", !0),
            e("h4", Ui, "本月待确认候选 (" + n(z.value.candidates?.length || 0) + ")", 1),
            e("ol", Vi, [
              (a(!0), o(_, null, m((z.value.candidates || []).slice(0, 8), (l) => (a(), o("li", {
                key: l.id
              }, [
                b(n(l.title) + " · " + n(l.when_text) + " ", 1),
                e("div", Ni, [
                  e("button", {
                    class: "btn filled sm",
                    onClick: (i) => y("confirm_agenda", { id: l.id }).then(Me)
                  }, "确认", 8, ji),
                  e("button", {
                    class: "btn text sm",
                    onClick: (i) => y("reject_agenda", { id: l.id }).then(Me)
                  }, "拒绝", 8, Ti)
                ])
              ]))), 128)),
              (z.value.candidates || []).length ? d("", !0) : (a(), o("li", Mi, "没有待确认候选"))
            ])
          ]),
          e("article", Di, [
            t[190] || (t[190] = e("h3", null, "近 14 天活跃", -1)),
            e("div", Oi, [
              (a(!0), o(_, null, m(Ct.value, (l) => (a(), o("div", {
                key: l.day,
                class: "spark-col",
                title: `${l.day} · ${l.count}`
              }, [
                e("i", {
                  style: te({ height: Math.max(4, Math.round(l.count / _l.value * 100)) + "%" })
                }, null, 4),
                e("span", null, n(l.day), 1)
              ], 8, Li))), 128))
            ]),
            t[191] || (t[191] = e("p", { class: "hint" }, "来自 Bot 自我时间线（日记/梦境/任务/主动/见闻）。", -1))
          ]),
          e("article", Fi, [
            e("h3", null, [
              t[192] || (t[192] = b("个人目标 ", -1)),
              e("span", Ei, n((v.value.goals || []).length), 1)
            ]),
            e("div", qi, [
              u(e("input", {
                "onUpdate:modelValue": t[54] || (t[54] = (l) => ie.value.title = l),
                class: "field",
                placeholder: "目标，如 学会一首钢琴曲"
              }, null, 512), [
                [r, ie.value.title]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: dl,
                disabled: !ie.value.title.trim()
              }, "添加", 8, Pi)
            ]),
            e("ol", Ji, [
              (a(!0), o(_, null, m(v.value.goals, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", {
                  class: w({ done: l.status === "done" })
                }, n(l.title), 3),
                e("span", Ii, [
                  e("i", {
                    style: te({ width: xe(l.progress) })
                  }, null, 4)
                ]),
                e("div", Ri, [
                  u(e("input", {
                    "onUpdate:modelValue": (i) => Te.value[l.id] = i,
                    class: "field",
                    placeholder: "记录一次进展…"
                  }, null, 8, zi), [
                    [r, Te.value[l.id]]
                  ]),
                  e("button", {
                    class: "btn tonal sm",
                    onClick: (i) => rl(l.id)
                  }, "记一笔", 8, Ai),
                  e("button", {
                    class: "btn text sm",
                    onClick: (i) => gt(l.id)
                  }, "日志", 8, Bi)
                ]),
                ze.value[l.id]?.length ? (a(), o("ol", Yi, [
                  (a(!0), o(_, null, m(ze.value[l.id], (i) => (a(), o("li", {
                    key: i.id,
                    class: "meta"
                  }, n(i.evidence) + " · " + n(D(i.created_at)), 1))), 128))
                ])) : d("", !0)
              ]))), 128)),
              (v.value.goals || []).length ? d("", !0) : (a(), o("li", Gi, "还没有目标"))
            ])
          ]),
          e("article", Ki, [
            t[194] || (t[194] = e("h3", null, "成长中的性格", -1)),
            e("ol", Qi, [
              (a(!0), o(_, null, m(v.value.persona_evolution, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", null, n(l.trait), 1),
                t[193] || (t[193] = b()),
                e("span", Wi, n(l.value), 1),
                e("span", Hi, "支持 " + n(l.support_count) + " · 置信 " + n(Math.round((l.confidence || 0) * 100)) + "%", 1)
              ]))), 128)),
              v.value.persona_evolution?.length ? d("", !0) : (a(), o("li", Xi, "LIFE 还在观察。"))
            ])
          ]),
          e("article", Zi, [
            e("h3", null, [
              t[195] || (t[195] = b("未完话题 ", -1)),
              e("span", eu, n(be.value.length), 1)
            ]),
            e("ol", tu, [
              (a(!0), o(_, null, m(be.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", null, n(l.topic), 1),
                e("span", lu, n(l.user_id) + " · " + n(D(l.updated_at)), 1),
                e("button", {
                  class: "btn tonal sm",
                  onClick: (i) => {
                    Re(l.user_id), V("users");
                  }
                }, "查看用户", 8, su)
              ]))), 128)),
              be.value.length ? d("", !0) : (a(), o("li", nu, "没有待跟进的话题。"))
            ])
          ]),
          e("article", au, [
            e("h3", null, [
              t[196] || (t[196] = b("轻量画像 ", -1)),
              e("span", ou, n(Qe.value.length), 1)
            ]),
            e("ol", iu, [
              (a(!0), o(_, null, m(Qe.value, (l) => (a(), o("li", {
                key: l.user_id
              }, [
                e("strong", null, n(l.user_id), 1),
                e("span", uu, [
                  b(n(l.summary), 1),
                  l.traits ? (a(), o(_, { key: 0 }, [
                    b(" · " + n(l.traits), 1)
                  ], 64)) : d("", !0)
                ])
              ]))), 128)),
              Qe.value.length ? d("", !0) : (a(), o("li", du, "还没有稳定画像。"))
            ])
          ]),
          e("article", ru, [
            e("h3", null, [
              t[197] || (t[197] = b("Bot 自我时间线 ", -1)),
              e("span", cu, n(Xe.value.length) + "/" + n(de.value.length), 1),
              u(e("input", {
                "onUpdate:modelValue": t[55] || (t[55] = (l) => He.value = l),
                class: "field search",
                style: { "margin-left": "auto" },
                placeholder: "搜索时间线"
              }, null, 512), [
                [r, He.value]
              ])
            ]),
            e("ol", vu, [
              (a(!0), o(_, null, m(Xe.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("time", null, n(D(l.created_at).slice(5, 16)), 1),
                e("div", null, [
                  e("strong", null, n(l.topic), 1),
                  e("span", pu, n(l.summary), 1)
                ])
              ]))), 128)),
              Xe.value.length ? d("", !0) : (a(), o("li", _u, "没有匹配的记录。"))
            ])
          ]),
          e("article", mu, [
            t[204] || (t[204] = e("h3", null, "情绪雷达", -1)),
            e("div", yu, [
              (a(), o("svg", bu, [
                t[198] || (t[198] = e("polygon", {
                  points: "60,14 106,60 60,106 14,60",
                  class: "radar-grid"
                }, null, -1)),
                t[199] || (t[199] = e("polygon", {
                  points: "60,37 83,60 60,83 37,60",
                  class: "radar-grid"
                }, null, -1)),
                e("polygon", {
                  points: Jl.value,
                  class: "radar-fill"
                }, null, 8, fu),
                t[200] || (t[200] = e("text", {
                  x: "60",
                  y: "10",
                  class: "radar-lbl",
                  "text-anchor": "middle"
                }, "心情", -1)),
                t[201] || (t[201] = e("text", {
                  x: "112",
                  y: "63",
                  class: "radar-lbl",
                  "text-anchor": "end"
                }, "激活", -1)),
                t[202] || (t[202] = e("text", {
                  x: "60",
                  y: "119",
                  class: "radar-lbl",
                  "text-anchor": "middle"
                }, "连接", -1)),
                t[203] || (t[203] = e("text", {
                  x: "8",
                  y: "63",
                  class: "radar-lbl"
                }, "烦扰", -1))
              ])),
              e("p", gu, "心情 " + n(Math.round((fe.value.valence + 1) / 2 * 100)) + "% · 激活 " + n(Math.round(fe.value.arousal * 100)) + "% · 连接 " + n(Math.round(fe.value.connection * 100)) + "% · 烦扰 " + n(Math.round(fe.value.irritation * 100)) + "%", 1)
            ])
          ]),
          e("article", ku, [
            e("h3", null, [
              t[205] || (t[205] = b("每日复盘 ", -1)),
              e("span", hu, n(We.value.length), 1),
              e("button", {
                class: "btn tonal sm",
                style: { "margin-left": "auto" },
                onClick: t[56] || (t[56] = (l) => y("daily_review", {}))
              }, "立即复盘")
            ]),
            e("ol", wu, [
              (a(!0), o(_, null, m(We.value, (l) => (a(), o("li", {
                key: l.date
              }, [
                e("strong", null, n(l.date), 1),
                e("span", Cu, n(l.summary), 1),
                qt(l).length ? (a(), o("ul", xu, [
                  (a(!0), o(_, null, m(qt(l), (i, C) => (a(), o("li", { key: C }, [
                    e("span", {
                      class: w(["chip", i.level === "warn" ? "warn" : "muted"])
                    }, n(i.title), 3),
                    e("span", $u, n(i.detail), 1)
                  ]))), 128))
                ])) : d("", !0)
              ]))), 128)),
              We.value.length ? d("", !0) : (a(), o("li", Su, "还没有复盘记录；每天会自动生成一次。"))
            ])
          ])
        ])
      ], 512), [
        [M, S.value === "observe"]
      ]),
      u(e("section", Uu, [
        e("div", Vu, [
          t[206] || (t[206] = e("div", null, [
            e("h2", null, "主动行为"),
            e("p", { class: "desc" }, "候选、投递时机、配额与未回应降速。")
          ], -1)),
          e("div", Nu, [
            e("button", {
              class: "btn tonal sm",
              onClick: Wt
            }, "让 LIFE 建议一条"),
            e("button", {
              class: "btn tonal sm",
              disabled: Se.value,
              onClick: Ht
            }, n(Se.value ? "检查中…" : "立即检查投递"), 9, ju)
          ])
        ]),
        e("div", Tu, [
          e("article", Mu, [
            e("h3", null, [
              t[207] || (t[207] = b("候选队列 ", -1)),
              e("span", Du, n(pe.value.length), 1)
            ]),
            e("div", Ou, [
              u(e("select", {
                "onUpdate:modelValue": t[57] || (t[57] = (l) => Q.value = l),
                class: "field"
              }, [
                t[208] || (t[208] = e("option", { value: "" }, "选择发送到哪个对话 / 对象…", -1)),
                (a(!0), o(_, null, m(xt.value, (l) => (a(), o("option", {
                  key: l.value,
                  value: l.value
                }, n(l.label), 9, Lu))), 128)),
                t[209] || (t[209] = e("option", { value: "__manual__" }, "手动输入…", -1))
              ], 512), [
                [I, Q.value]
              ]),
              Q.value === "__manual__" ? u((a(), o("input", {
                key: 0,
                "onUpdate:modelValue": t[58] || (t[58] = (l) => ve.value = l),
                class: "field",
                placeholder: "session:<会话ID> / user:<QQ> / group:<群号>"
              }, null, 512)), [
                [r, ve.value]
              ]) : d("", !0)
            ]),
            e("div", Fu, [
              u(e("input", {
                "onUpdate:modelValue": t[59] || (t[59] = (l) => U.value.motive = l),
                class: "field",
                placeholder: "动机，如 care"
              }, null, 512), [
                [r, U.value.motive]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[60] || (t[60] = (l) => U.value.preferred_at = l),
                class: "field",
                placeholder: "期望时间（ISO，可选）"
              }, null, 512), [
                [r, U.value.preferred_at]
              ])
            ]),
            u(e("textarea", {
              "onUpdate:modelValue": t[61] || (t[61] = (l) => U.value.content = l),
              class: "field area",
              placeholder: "想说的内容…"
            }, null, 512), [
              [r, U.value.content]
            ]),
            e("button", {
              class: "btn filled sm",
              onClick: Kt,
              disabled: !U.value.target.trim() || !U.value.content.trim()
            }, "创建候选", 8, Eu),
            e("ol", qu, [
              (a(!0), o(_, null, m(pe.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", null, n(l.target) + " · " + n(l.motive), 1),
                e("span", Pu, n(l.content), 1),
                e("span", Ju, [
                  b("窗口 " + n(D(l.preferred_at)), 1),
                  l.best_until ? (a(), o(_, { key: 0 }, [
                    b(" → " + n(D(l.best_until)), 1)
                  ], 64)) : d("", !0)
                ]),
                e("button", {
                  class: "btn danger sm",
                  onClick: (i) => pt(l.id)
                }, "取消", 8, Iu)
              ]))), 128)),
              pe.value.length ? d("", !0) : (a(), o("li", Ru, "没有待投递候选"))
            ])
          ]),
          e("article", zu, [
            t[210] || (t[210] = e("h3", null, "投递记录", -1)),
            e("ol", Au, [
              (a(!0), o(_, null, m(nt.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                b(n(l.phase) + " · " + n(l.content), 1),
                e("span", Bu, n(D(l.created_at)), 1)
              ]))), 128)),
              nt.value.length ? d("", !0) : (a(), o("li", Yu, "还没有投递记录"))
            ])
          ])
        ])
      ], 512), [
        [M, S.value === "proactive"]
      ]),
      u(e("section", Gu, [
        e("div", { class: "section-head" }, [
          t[211] || (t[211] = e("div", null, [
            e("h2", null, "Token 用量"),
            e("p", { class: "desc" }, "模型调用与 token 统计。")
          ], -1)),
          e("div", { class: "head-actions" }, [
            e("button", {
              class: "btn tonal sm",
              onClick: ut
            }, "刷新")
          ])
        ]),
        e("div", Ku, [
          e("article", Qu, [
            e("b", null, n((R.value?.total_tokens || 0).toLocaleString()), 1),
            t[212] || (t[212] = e("span", null, "总 Token", -1))
          ]),
          e("article", Wu, [
            e("b", null, n((R.value?.total_prompt_tokens || 0).toLocaleString()), 1),
            t[213] || (t[213] = e("span", null, "输入", -1))
          ]),
          e("article", Hu, [
            e("b", null, n((R.value?.total_completion_tokens || 0).toLocaleString()), 1),
            t[214] || (t[214] = e("span", null, "输出", -1))
          ]),
          e("article", Xu, [
            e("b", null, n(R.value?.request_count || 0), 1),
            t[215] || (t[215] = e("span", null, "请求次数", -1))
          ])
        ]),
        e("article", Zu, [
          t[217] || (t[217] = e("h3", null, "按模型", -1)),
          e("ol", ed, [
            (a(!0), o(_, null, m(R.value?.by_model || {}, (l, i) => (a(), o("li", { key: i }, [
              e("strong", null, n(i), 1),
              t[216] || (t[216] = b()),
              e("span", td, n((l.total || 0).toLocaleString()) + " tokens · " + n(l.count) + " 次", 1)
            ]))), 128)),
            !R.value || !Object.keys(R.value.by_model || {}).length ? (a(), o("li", ld, "暂无用量记录")) : d("", !0)
          ])
        ])
      ], 512), [
        [M, S.value === "tokens"]
      ]),
      u(e("section", sd, [
        e("div", nd, [
          t[218] || (t[218] = e("div", null, [
            e("h2", null, "排障与审计"),
            e("p", { class: "desc" }, "运行检查、主动行为审计与记忆维护。")
          ], -1)),
          e("div", ad, [
            e("button", {
              class: "btn tonal sm",
              onClick: El
            }, "运行诊断"),
            e("button", {
              class: "btn tonal sm",
              onClick: t[62] || (t[62] = (l) => y("memory_maintenance", {}))
            }, "记忆维护"),
            e("button", {
              class: "btn tonal sm",
              onClick: Rl
            }, "备份数据")
          ])
        ]),
        e("div", od, [
          e("article", id, [
            t[219] || (t[219] = e("h3", null, "运行检查", -1)),
            e("ol", ud, [
              (a(!0), o(_, null, m(ye.value?.checks || [], (l) => (a(), o("li", {
                key: l.name
              }, [
                e("strong", null, n(l.name), 1),
                e("span", dd, n(l.detail), 1),
                e("span", {
                  class: w(["chip", l.status === "ok" ? "ok" : l.status === "warn" ? "warn" : "muted"])
                }, n(l.status), 3)
              ]))), 128)),
              ye.value ? d("", !0) : (a(), o("li", rd, "点击运行诊断"))
            ]),
            ye.value ? (a(), o("div", cd, [
              (a(!0), o(_, null, m(ye.value.counts, (l, i) => (a(), o("div", {
                key: i,
                class: "kv"
              }, [
                e("span", null, n(i), 1),
                e("b", null, n(l), 1)
              ]))), 128))
            ])) : d("", !0)
          ]),
          e("article", vd, [
            e("h3", null, [
              t[220] || (t[220] = b("主动行为审计 ", -1)),
              e("span", pd, n(Dt.value), 1)
            ]),
            e("div", _d, [
              u(e("input", {
                "onUpdate:modelValue": t[63] || (t[63] = (l) => Ye.value = l),
                class: "field",
                placeholder: "类型筛选"
              }, null, 512), [
                [r, Ye.value]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[64] || (t[64] = (l) => Ge.value = l),
                class: "field",
                placeholder: "结果"
              }, null, 512), [
                [r, Ge.value]
              ]),
              e("button", {
                class: "btn tonal sm",
                onClick: Ot
              }, "查询")
            ]),
            e("ol", md, [
              (a(!0), o(_, null, m(Ke.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("time", null, n(D(l.created_at).slice(5, 16)), 1),
                e("div", null, [
                  e("strong", null, n(l.kind), 1),
                  t[221] || (t[221] = b()),
                  e("span", {
                    class: w(["chip", l.outcome === "ok" ? "ok" : "warn"])
                  }, n(l.outcome), 3),
                  e("span", yd, n(l.target), 1),
                  l.detail ? (a(), o("p", bd, n(l.detail), 1)) : d("", !0)
                ])
              ]))), 128)),
              Ke.value.length ? d("", !0) : (a(), o("li", fd, "暂无审计记录"))
            ])
          ])
        ])
      ], 512), [
        [M, S.value === "troubleshooting"]
      ]),
      u(e("section", gd, [
        e("div", { class: "section-head" }, [
          t[222] || (t[222] = e("div", null, [
            e("h2", null, "配置"),
            e("p", { class: "desc" }, "运行设置、用户边界、环境与内容、导入导出。")
          ], -1)),
          e("div", { class: "head-actions" }, [
            e("button", {
              class: "btn filled sm",
              onClick: Ml
            }, "保存")
          ])
        ]),
        e("div", kd, [
          e("article", hd, [
            t[243] || (t[243] = e("h3", null, "主动行为", -1)),
            e("div", wd, [
              e("label", null, [
                t[223] || (t[223] = e("span", null, "每日主动上限", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[65] || (t[65] = (l) => p.value.proactive_daily_limit = l),
                  type: "number",
                  min: "0",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.proactive_daily_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[224] || (t[224] = e("span", null, "单人上限", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[66] || (t[66] = (l) => p.value.proactive_target_limit = l),
                  type: "number",
                  min: "0",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.proactive_target_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[225] || (t[225] = e("span", null, "免打扰起", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[67] || (t[67] = (l) => p.value.quiet_start = l),
                  type: "number",
                  min: "0",
                  max: "23",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.quiet_start,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[226] || (t[226] = e("span", null, "免打扰止", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[68] || (t[68] = (l) => p.value.quiet_end = l),
                  type: "number",
                  min: "0",
                  max: "23",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.quiet_end,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[227] || (t[227] = e("span", null, "空闲分钟", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[69] || (t[69] = (l) => p.value.idle_minutes = l),
                  type: "number",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.idle_minutes,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[228] || (t[228] = e("span", null, "最小间隔(分)", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[70] || (t[70] = (l) => p.value.min_interval_minutes = l),
                  type: "number",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.min_interval_minutes,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[229] || (t[229] = e("span", null, "检查间隔(秒)", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[71] || (t[71] = (l) => p.value.check_interval_seconds = l),
                  type: "number",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.check_interval_seconds,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[230] || (t[230] = e("span", null, "连发上限", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[72] || (t[72] = (l) => p.value.burst_max = l),
                  type: "number",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.burst_max,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[231] || (t[231] = e("span", null, "每日 Token", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[73] || (t[73] = (l) => p.value.daily_token_limit = l),
                  type: "number",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.daily_token_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            e("div", Cd, [
              e("label", xd, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[74] || (t[74] = (l) => p.value.enable_proactive = l)
                }, null, 512), [
                  [G, p.value.enable_proactive]
                ]),
                t[232] || (t[232] = e("span", null, "启用主动消息", -1))
              ]),
              e("label", $d, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[75] || (t[75] = (l) => p.value.enable_group_observe = l)
                }, null, 512), [
                  [G, p.value.enable_group_observe]
                ]),
                t[233] || (t[233] = e("span", null, "群聊观察", -1))
              ]),
              e("label", Sd, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[76] || (t[76] = (l) => p.value.enable_dream = l)
                }, null, 512), [
                  [G, p.value.enable_dream]
                ]),
                t[234] || (t[234] = e("span", null, "梦境生成", -1))
              ]),
              e("label", Ud, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[77] || (t[77] = (l) => p.value.reply_deceleration = l)
                }, null, 512), [
                  [G, p.value.reply_deceleration]
                ]),
                t[235] || (t[235] = e("span", null, "未回应降速", -1))
              ])
            ]),
            t[244] || (t[244] = e("h4", { class: "sub-label" }, "用户边界", -1)),
            e("div", Vd, [
              e("label", Nd, [
                t[236] || (t[236] = e("span", null, "主要用户 ID（逗号分隔）", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[78] || (t[78] = (l) => p.value.owner_user_ids = l),
                  class: "field"
                }, null, 512), [
                  [r, p.value.owner_user_ids]
                ])
              ]),
              e("label", jd, [
                t[237] || (t[237] = e("span", null, "次要用户 ID（逗号分隔）", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[79] || (t[79] = (l) => p.value.secondary_user_ids = l),
                  class: "field"
                }, null, 512), [
                  [r, p.value.secondary_user_ids]
                ])
              ]),
              e("label", null, [
                t[238] || (t[238] = e("span", null, "普通用户阶段上限", -1)),
                u(e("select", {
                  "onUpdate:modelValue": t[80] || (t[80] = (l) => p.value.other_stage_cap = l),
                  class: "field"
                }, [
                  (a(), o(_, null, m(["警惕", "疏离", "陌生", "认识", "熟悉", "友好", "亲近", "亲密"], (l) => e("option", {
                    key: l,
                    value: l
                  }, n(l), 9, Td)), 64))
                ], 512), [
                  [I, p.value.other_stage_cap]
                ])
              ]),
              e("label", null, [
                t[239] || (t[239] = e("span", null, "次要用户阶段上限", -1)),
                u(e("select", {
                  "onUpdate:modelValue": t[81] || (t[81] = (l) => p.value.secondary_stage_cap = l),
                  class: "field"
                }, [
                  (a(), o(_, null, m(["警惕", "疏离", "陌生", "认识", "熟悉", "友好", "亲近", "亲密"], (l) => e("option", {
                    key: l,
                    value: l
                  }, n(l), 9, Md)), 64))
                ], 512), [
                  [I, p.value.secondary_stage_cap]
                ])
              ]),
              e("label", null, [
                t[240] || (t[240] = e("span", null, "好感回落/天", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[82] || (t[82] = (l) => p.value.affinity_decay_per_day = l),
                  type: "number",
                  step: "0.01",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.affinity_decay_per_day,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[241] || (t[241] = e("span", null, "未互动多久才回落(天)", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[83] || (t[83] = (l) => p.value.affinity_decay_after_days = l),
                  type: "number",
                  min: "0",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.affinity_decay_after_days,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            e("label", Dd, [
              u(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": t[84] || (t[84] = (l) => p.value.enable_exclusive_bond = l)
              }, null, 512), [
                [G, p.value.enable_exclusive_bond]
              ]),
              t[242] || (t[242] = e("span", null, "允许主要用户的专属联结", -1))
            ])
          ]),
          e("article", Od, [
            t[255] || (t[255] = e("h3", null, "环境与内容", -1)),
            e("div", Ld, [
              e("label", null, [
                t[245] || (t[245] = e("span", null, "时区", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[85] || (t[85] = (l) => p.value.env_timezone = l),
                  class: "field"
                }, null, 512), [
                  [r, p.value.env_timezone]
                ])
              ]),
              e("label", null, [
                t[246] || (t[246] = e("span", null, "城市", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[86] || (t[86] = (l) => p.value.env_city = l),
                  class: "field"
                }, null, 512), [
                  [r, p.value.env_city]
                ])
              ]),
              e("label", null, [
                t[247] || (t[247] = e("span", null, "纬度", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[87] || (t[87] = (l) => p.value.env_latitude = l),
                  class: "field tiny"
                }, null, 512), [
                  [r, p.value.env_latitude]
                ])
              ]),
              e("label", null, [
                t[248] || (t[248] = e("span", null, "经度", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[88] || (t[88] = (l) => p.value.env_longitude = l),
                  class: "field tiny"
                }, null, 512), [
                  [r, p.value.env_longitude]
                ])
              ]),
              e("label", null, [
                t[249] || (t[249] = e("span", null, "天气缓存(分)", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[89] || (t[89] = (l) => p.value.weather_cache_minutes = l),
                  type: "number",
                  min: "5",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.weather_cache_minutes,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[250] || (t[250] = e("span", null, "每条源条数", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[90] || (t[90] = (l) => p.value.content_items_per_feed = l),
                  type: "number",
                  min: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    r,
                    p.value.content_items_per_feed,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[252] || (t[252] = e("span", null, "语言", -1)),
                u(e("select", {
                  "onUpdate:modelValue": t[91] || (t[91] = (l) => p.value.locale = l),
                  class: "field"
                }, [...t[251] || (t[251] = [
                  e("option", { value: "zh-CN" }, "简体中文", -1),
                  e("option", { value: "en-US" }, "English", -1)
                ])], 512), [
                  [I, p.value.locale]
                ])
              ])
            ]),
            u(e("input", {
              "onUpdate:modelValue": t[92] || (t[92] = (l) => p.value.news_feeds = l),
              class: "field",
              placeholder: "news_feeds：ai:https://… , bilibili:https://… , https://…"
            }, null, 512), [
              [r, p.value.news_feeds]
            ]),
            u(e("input", {
              "onUpdate:modelValue": t[93] || (t[93] = (l) => p.value.tts_endpoint = l),
              class: "field",
              placeholder: "tts_endpoint（可选）"
            }, null, 512), [
              [r, p.value.tts_endpoint]
            ]),
            e("div", Fd, [
              e("label", Ed, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[94] || (t[94] = (l) => p.value.enable_environment_fetch = l)
                }, null, 512), [
                  [G, p.value.enable_environment_fetch]
                ]),
                t[253] || (t[253] = e("span", null, "允许联网取天气", -1))
              ]),
              e("label", qd, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[95] || (t[95] = (l) => p.value.enable_content_fetch = l)
                }, null, 512), [
                  [G, p.value.enable_content_fetch]
                ]),
                t[254] || (t[254] = e("span", null, "允许联网取内容", -1))
              ])
            ]),
            t[256] || (t[256] = e("h4", { class: "sub-label" }, "数据导入导出", -1)),
            e("div", { class: "actions-row" }, [
              e("button", {
                class: "btn tonal sm",
                onClick: Dl
              }, "导出配置"),
              e("button", {
                class: "btn tonal sm",
                onClick: Ll
              }, "导出全部（含关系/日记/时间线）")
            ]),
            u(e("textarea", {
              "onUpdate:modelValue": t[96] || (t[96] = (l) => P.value = l),
              class: "field area",
              placeholder: "粘贴导出 JSON 后点导入…"
            }, null, 512), [
              [r, P.value]
            ]),
            e("div", Pd, [
              e("button", {
                class: "btn filled sm",
                onClick: Ol,
                disabled: !P.value.trim()
              }, "导入配置", 8, Jd),
              e("button", {
                class: "btn filled sm",
                onClick: Fl,
                disabled: !P.value.trim()
              }, "全量导入", 8, Id)
            ])
          ])
        ])
      ], 512), [
        [M, S.value === "config"]
      ]),
      u(e("section", Rd, [
        e("div", { class: "section-head" }, [
          t[257] || (t[257] = e("div", null, [
            e("h2", null, "模型与扩展"),
            e("p", { class: "desc" }, "逐任务模型分流，以及可选扩展的可用状态（fail-closed）。")
          ], -1)),
          e("div", { class: "head-actions" }, [
            e("button", {
              class: "btn filled sm",
              onClick: Mt
            }, "保存分流"),
            e("button", {
              class: "btn tonal sm",
              onClick: Tt
            }, "刷新扩展")
          ])
        ]),
        e("div", zd, [
          e("article", Ad, [
            t[258] || (t[258] = e("h3", null, "逐任务模型分流", -1)),
            t[259] || (t[259] = e("p", { class: "hint" }, "JSON：任务 → 模型。可用任务：think / output / reflect / journal / dream / agenda / plan / compact。", -1)),
            u(e("textarea", {
              "onUpdate:modelValue": t[97] || (t[97] = (l) => Fe.value = l),
              class: "field area",
              placeholder: '{"think":"deepseek-v4-pro","output":"deepseek-flash"}'
            }, null, 512), [
              [r, Fe.value]
            ]),
            e("button", {
              class: "btn filled sm",
              onClick: Mt
            }, "保存并生效")
          ]),
          e("article", Bd, [
            t[260] || (t[260] = e("h3", null, "扩展状态", -1)),
            e("ol", Yd, [
              (a(!0), o(_, null, m(Ee.value, (l) => (a(), o("li", {
                key: l.name
              }, [
                e("strong", null, n(l.name), 1),
                e("span", Gd, "api " + n(l.api_version) + " · " + n(l.reason || "—"), 1),
                e("span", {
                  class: w(["chip", l.available ? "ok" : "muted"])
                }, n(l.available ? "可用" : "未就绪"), 3)
              ]))), 128)),
              Ee.value.length ? d("", !0) : (a(), o("li", Kd, "没有注册的扩展。"))
            ]),
            t[261] || (t[261] = e("p", { class: "hint" }, "未就绪的扩展不会伪装成可用；配置对应端点或开关后即可转为可用。", -1))
          ])
        ])
      ], 512), [
        [M, S.value === "models"]
      ]),
      u(e("section", Qd, [
        t[274] || (t[274] = e("div", { class: "section-head" }, [
          e("div", null, [
            e("h2", null, "实验与手动触发"),
            e("p", { class: "desc" }, "一次性触发内容抓取、群聊兴趣唤醒、关系回落、穿搭与生图（扩展未就绪时失败即报）。")
          ])
        ], -1)),
        e("div", Wd, [
          e("article", Hd, [
            t[262] || (t[262] = e("h3", null, "内容", -1)),
            e("div", Xd, [
              e("button", {
                class: "btn tonal sm",
                onClick: ht
              }, "抓取见闻"),
              e("button", {
                class: "btn tonal sm",
                onClick: t[98] || (t[98] = (l) => $e("journal"))
              }, "生成日记"),
              e("button", {
                class: "btn tonal sm",
                onClick: t[99] || (t[99] = (l) => $e("dream"))
              }, "生成梦境")
            ])
          ]),
          e("article", { class: "card" }, [
            t[263] || (t[263] = e("h3", null, "行为", -1)),
            e("div", { class: "actions-row" }, [
              e("button", {
                class: "btn tonal sm",
                onClick: Ut
              }, "群聊兴趣唤醒"),
              e("button", {
                class: "btn tonal sm",
                onClick: vt
              }, "关系自然回落"),
              e("button", {
                class: "btn tonal sm",
                onClick: Ae
              }, "今日穿搭")
            ])
          ]),
          e("article", { class: "card" }, [
            t[264] || (t[264] = e("h3", null, "生图（扩展门控）", -1)),
            t[265] || (t[265] = e("p", { class: "hint" }, "未安装生图扩展或未配置端点时不会伪装成功。", -1)),
            e("div", { class: "actions-row" }, [
              e("button", {
                class: "btn tonal sm",
                onClick: pl
              }, "尝试生图")
            ])
          ]),
          e("article", Zd, [
            t[268] || (t[268] = e("h3", null, "多模态出站", -1)),
            e("div", er, [
              u(e("select", {
                "onUpdate:modelValue": t[100] || (t[100] = (l) => T.value.kind = l),
                class: "field",
                style: { "max-width": "140px" }
              }, [...t[266] || (t[266] = [
                e("option", { value: "tts" }, "语音 TTS", -1),
                e("option", { value: "image" }, "图片", -1),
                e("option", { value: "poke" }, "戳一戳", -1),
                e("option", { value: "status" }, "QQ 状态", -1)
              ])], 512), [
                [I, T.value.kind]
              ]),
              u(e("select", {
                "onUpdate:modelValue": t[101] || (t[101] = (l) => T.value.target = l),
                class: "field"
              }, [
                t[267] || (t[267] = e("option", { value: "" }, "选择目标…", -1)),
                (a(!0), o(_, null, m(xt.value, (l) => (a(), o("option", {
                  key: l.value,
                  value: l.value
                }, n(l.label), 9, tr))), 128))
              ], 512), [
                [I, T.value.target]
              ])
            ]),
            T.value.kind === "tts" ? u((a(), o("textarea", {
              key: 0,
              "onUpdate:modelValue": t[102] || (t[102] = (l) => T.value.text = l),
              class: "field area",
              placeholder: "语音内容…"
            }, null, 512)), [
              [r, T.value.text]
            ]) : T.value.kind === "image" ? u((a(), o("input", {
              key: 1,
              "onUpdate:modelValue": t[103] || (t[103] = (l) => T.value.file = l),
              class: "field",
              placeholder: "图片路径 / URL"
            }, null, 512)), [
              [r, T.value.file]
            ]) : d("", !0),
            e("button", {
              class: "btn filled sm",
              onClick: Il,
              disabled: !T.value.target
            }, "发送", 8, lr),
            t[269] || (t[269] = e("p", { class: "hint" }, "需要 OneBot 已连接；未连接会明确失败。", -1))
          ]),
          e("article", sr, [
            t[270] || (t[270] = e("h3", null, "食物菜单", -1)),
            e("div", nr, [
              u(e("input", {
                "onUpdate:modelValue": t[104] || (t[104] = (l) => A.value.name = l),
                class: "field",
                placeholder: "食物，如 番茄牛腩"
              }, null, 512), [
                [r, A.value.name]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[105] || (t[105] = (l) => A.value.tags = l),
                class: "field",
                placeholder: "标签（可选）"
              }, null, 512), [
                [r, A.value.tags]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: cl,
                disabled: !A.value.name.trim()
              }, "加入", 8, ar)
            ]),
            e("ol", or, [
              (a(!0), o(_, null, m(v.value.food, (l) => (a(), o("li", {
                key: l.id
              }, [
                b(n(l.name) + " ", 1),
                e("span", ir, n(l.tags || "—"), 1),
                e("button", {
                  class: "btn danger sm",
                  onClick: (i) => vl(l.id)
                }, "删除", 8, ur)
              ]))), 128)),
              (v.value.food || []).length ? d("", !0) : (a(), o("li", dr, "菜单还是空的"))
            ])
          ]),
          e("article", rr, [
            t[272] || (t[272] = e("h3", null, "重要日期", -1)),
            e("div", cr, [
              u(e("input", {
                "onUpdate:modelValue": t[106] || (t[106] = (l) => j.value.title = l),
                class: "field",
                placeholder: "名称，如 生日"
              }, null, 512), [
                [r, j.value.title]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[107] || (t[107] = (l) => j.value.date = l),
                class: "field",
                placeholder: "YYYY-MM-DD 或 MM-DD"
              }, null, 512), [
                [r, j.value.date]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: el,
                disabled: !j.value.title.trim() || !j.value.date.trim()
              }, "添加", 8, vr)
            ]),
            e("label", pr, [
              u(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": t[108] || (t[108] = (l) => j.value.repeat_yearly = l)
              }, null, 512), [
                [G, j.value.repeat_yearly]
              ]),
              t[271] || (t[271] = e("span", null, "每年重复", -1))
            ]),
            e("ol", _r, [
              (a(!0), o(_, null, m(v.value.important_dates, (l) => (a(), o("li", {
                key: l.id
              }, [
                b(n(l.title) + " · " + n(l.date_text), 1),
                e("button", {
                  class: "btn danger sm",
                  onClick: (i) => tl(l.id)
                }, "删除", 8, mr)
              ]))), 128)),
              v.value.important_dates?.length ? d("", !0) : (a(), o("li", yr, "还没有重要日期"))
            ])
          ]),
          e("article", br, [
            t[273] || (t[273] = e("h3", null, "群聊黑话词云", -1)),
            e("div", fr, [
              (a(!0), o(_, null, m(bt.value, (l) => (a(), o("span", {
                key: l.topic,
                class: "cloud-word",
                style: te({ fontSize: 12 + Math.min(18, Math.log(l.score + 1) * 6) + "px", opacity: 0.55 + Math.min(0.45, l.score / 20) })
              }, n(l.topic), 5))), 128)),
              bt.value.length ? d("", !0) : (a(), o("span", gr, "还没有词云数据"))
            ])
          ])
        ])
      ], 512), [
        [M, S.value === "experimental"]
      ])
    ], 512));
  }
}), xr = /* @__PURE__ */ Gl(kr, [["__scopeId", "data-v-96d93786"]]);
export {
  xr as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".pcp[data-v-96d93786]{--r-xs:10px;--r-sm:14px;--r-md:20px;--r-lg:28px;--r-xl:36px;--spring:cubic-bezier(.2,.9,.25,1.15);height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;background:var(--md-surface);color:var(--md-on-surface);max-width:1240px;margin:0 auto}h1[data-v-96d93786],h2[data-v-96d93786],h3[data-v-96d93786],h4[data-v-96d93786]{margin:0;letter-spacing:-.01em}.eyebrow[data-v-96d93786]{margin:0 0 8px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}.eyebrow b[data-v-96d93786]{font-size:9px}.hero[data-v-96d93786]{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}.hero[data-v-96d93786]:after{content:\"\";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}.hero-main[data-v-96d93786]{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}.hero-copy h1[data-v-96d93786]{font-size:clamp(26px,3.4vw,40px);font-weight:800}.sub[data-v-96d93786]{margin:8px 0 0;max-width:620px;font-size:13.5px;line-height:1.6;color:var(--md-on-surface-variant)}.hero-actions[data-v-96d93786]{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.fab[data-v-96d93786]{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);transition:transform .28s var(--spring),box-shadow .28s}.fab[data-v-96d93786]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}.fab[data-v-96d93786]:disabled{opacity:.6;cursor:not-allowed}.fab-ic[data-v-96d93786]{font-size:17px}.hero-stats[data-v-96d93786]{position:relative;z-index:1;display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:22px}.stat[data-v-96d93786]{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;border:0;border-radius:var(--r-md);background:color-mix(in srgb,var(--md-surface-container-lowest) 78%,transparent);cursor:pointer;text-align:left;transition:transform .25s var(--spring),background .25s;backdrop-filter:blur(4px)}.stat[data-v-96d93786]:hover{transform:translateY(-2px);background:var(--md-surface-container-lowest)}.stat-ic[data-v-96d93786]{font-size:14px;opacity:.85}.stat-num[data-v-96d93786]{font-size:26px;font-weight:800;letter-spacing:-.02em}.stat-cap[data-v-96d93786]{font-size:11.5px;color:var(--md-on-surface-variant)}.t1[data-v-96d93786]{color:var(--md-primary)}.t2[data-v-96d93786]{color:#9a6a00}.t3[data-v-96d93786]{color:#7b4bb7}.t4[data-v-96d93786]{color:#0d8a5f}.t5[data-v-96d93786]{color:#b5473c}.t6[data-v-96d93786]{color:#1a6fb4}.state-row[data-v-96d93786]{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}.pill[data-v-96d93786]{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:12.5px;font-weight:700}.pill.soft[data-v-96d93786]{font-weight:500;color:var(--md-on-surface-variant)}.pill.bad[data-v-96d93786]{background:#ffdcc6;color:#7a3a00}.chip-btn[data-v-96d93786]{border:0;border-radius:999px;padding:7px 14px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font:700 12.5px/1 inherit;cursor:pointer;transition:transform .2s var(--spring)}.chip-btn[data-v-96d93786]:hover{transform:translateY(-1px)}.banner[data-v-96d93786]{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}.banner.err[data-v-96d93786]{background:var(--md-error-container);color:#410e0b}.banner.ok[data-v-96d93786]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tabs[data-v-96d93786]{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}.tab[data-v-96d93786]{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .25s,color .25s,transform .25s var(--spring)}.tab i[data-v-96d93786]{font-style:normal;font:700 10px/1 ui-monospace,monospace;opacity:.6}.tab-ic[data-v-96d93786]{font-size:14px}.tab[data-v-96d93786]:hover{background:var(--md-surface-container-high)}.tab.active[data-v-96d93786]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}.tab.active i[data-v-96d93786]{opacity:.85}.panel[data-v-96d93786]{animation:fade-96d93786 .32s var(--spring)}@keyframes fade-96d93786{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.section-head[data-v-96d93786]{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}.section-head h2[data-v-96d93786]{font-size:22px;font-weight:800}.desc[data-v-96d93786]{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}.head-actions[data-v-96d93786]{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.btn[data-v-96d93786]{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}.btn.sm[data-v-96d93786]{height:34px;padding:0 14px;font-size:12.5px}.btn[data-v-96d93786]:disabled{opacity:.5;cursor:not-allowed}.btn[data-v-96d93786]:hover:not(:disabled){transform:translateY(-1px)}.btn.filled[data-v-96d93786]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn.tonic[data-v-96d93786]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.text[data-v-96d93786]{background:transparent;color:var(--md-primary)}.btn.danger[data-v-96d93786]{background:var(--md-error-container);color:#410e0b}.link[data-v-96d93786]{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}.card[data-v-96d93786]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}.card>h3[data-v-96d93786]{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}.card.sub[data-v-96d93786]{padding:16px;margin-bottom:0}.grid2[data-v-96d93786]{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.grid3[data-v-96d93786]{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}.cards[data-v-96d93786]{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}.item-card[data-v-96d93786]{display:flex;flex-direction:column;gap:8px}.row[data-v-96d93786]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.sub-label[data-v-96d93786]{margin:16px 0 8px;font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.hint[data-v-96d93786]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}.meta[data-v-96d93786]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}.prose[data-v-96d93786]{margin:0;font-size:13.5px;line-height:1.85;white-space:pre-wrap;overflow-wrap:anywhere}.empty[data-v-96d93786]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.field[data-v-96d93786]{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}.field[data-v-96d93786]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.field.area[data-v-96d93786]{height:auto;padding:12px 16px;line-height:1.6;resize:vertical;min-height:84px}.field.tiny[data-v-96d93786]{width:104px;height:38px;padding:0 12px;font-size:13px}.field.search[data-v-96d93786]{max-width:200px}.form-row[data-v-96d93786]{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}.form-row .field[data-v-96d93786]{flex:1;min-width:120px}.actions-row[data-v-96d93786]{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}.switches[data-v-96d93786]{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}.sw[data-v-96d93786]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}.sw input[data-v-96d93786]{width:18px;height:18px;accent-color:var(--md-primary)}.settings-grid[data-v-96d93786]{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.settings-grid label[data-v-96d93786]{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.settings-grid label.wide[data-v-96d93786]{grid-column:span 2}.settings-grid .field[data-v-96d93786]{height:40px}.chip[data-v-96d93786]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:11.5px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-96d93786]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-96d93786]{background:var(--md-success-container);color:#0d3b1e}.chip.warn[data-v-96d93786]{background:#ffe6c2;color:#7a4400}.chip.danger[data-v-96d93786]{background:var(--md-error-container);color:#410e0b}.chip button[data-v-96d93786]{border:0;background:transparent;color:inherit;cursor:pointer;font-weight:800;margin-left:2px}.count-pill[data-v-96d93786]{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:11px;font-weight:700}.chips[data-v-96d93786]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.owner[data-v-96d93786]{margin-left:6px;font-style:normal;font-size:10px;font-weight:800;background:var(--md-success-container);color:#0d3b1e;border-radius:999px;padding:2px 7px}.note[data-v-96d93786]{margin:10px 0;padding:12px 14px;border-radius:var(--r-sm);background:var(--md-surface-container);font-size:12.5px;line-height:1.6}.desk[data-v-96d93786]{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:16px;align-items:start}.desk-col[data-v-96d93786]{display:flex;flex-direction:column;gap:16px}.dcard[data-v-96d93786]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:18px}.dcard header[data-v-96d93786]{display:flex;align-items:center;gap:8px;margin-bottom:12px}.dcard header h3[data-v-96d93786]{font-size:14px;font-weight:800}.dcard header small[data-v-96d93786],.dcard header .link[data-v-96d93786]{margin-left:auto}.dcard .link[data-v-96d93786]{margin-left:auto}.dot[data-v-96d93786]{width:11px;height:11px;border-radius:50%;background:var(--md-outline)}.dot.ic[data-v-96d93786]{background:var(--md-primary);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-primary) 18%,transparent)}.fact-grid[data-v-96d93786]{display:grid;grid-template-columns:1fr 1fr;gap:10px}.fact[data-v-96d93786]{background:var(--md-surface-container-low);border-radius:var(--r-sm);padding:10px 12px;display:flex;flex-direction:column;gap:2px}.fact b[data-v-96d93786]{font-size:22px;font-weight:800}.fact span[data-v-96d93786]{font-size:11.5px;color:var(--md-on-surface-variant)}.mini-list[data-v-96d93786]{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}.mini-list li[data-v-96d93786]{display:flex;justify-content:space-between;gap:10px;font-size:13px;align-items:center}.cur[data-v-96d93786]{display:flex;align-items:center;gap:10px;font-size:15px}.tl[data-v-96d93786]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.tl li[data-v-96d93786]{display:flex;gap:12px;align-items:flex-start;padding:8px 10px;border-radius:var(--r-sm);background:var(--md-surface-container-low)}.tl li time[data-v-96d93786]{font:600 11.5px/1.4 ui-monospace,monospace;color:var(--md-on-surface-variant);flex:0 0 46px}.tl li>div[data-v-96d93786]{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.tl li strong.done[data-v-96d93786]{text-decoration:line-through;color:var(--md-on-surface-variant)}.tl li.ok[data-v-96d93786]{background:var(--md-success-container)}.tl li.warn[data-v-96d93786]{background:#fff3dd}.mini-tl[data-v-96d93786]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.mini-tl li[data-v-96d93786]{display:flex;gap:10px;align-items:flex-start}.mini-tl li>div[data-v-96d93786]{display:flex;flex-direction:column;gap:2px}.caps[data-v-96d93786]{display:flex;flex-wrap:wrap;gap:8px}.cap[data-v-96d93786]{display:flex;flex-direction:column;gap:1px;padding:8px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);min-width:96px}.cap b[data-v-96d93786]{font-size:12.5px}.cap small[data-v-96d93786]{font-size:11px;color:#0d8a5f;font-weight:700}.cap.off small[data-v-96d93786]{color:var(--md-on-surface-variant)}.fold[data-v-96d93786]{border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);margin-top:16px;background:var(--md-surface-container-lowest);overflow:hidden}.fold summary[data-v-96d93786]{padding:16px 20px;cursor:pointer;display:flex;flex-direction:column;gap:2px;list-style:none}.fold summary[data-v-96d93786]::-webkit-details-marker{display:none}.fold summary b[data-v-96d93786]{font-size:15px}.fold summary small[data-v-96d93786]{font-size:12px;color:var(--md-on-surface-variant)}.fold[open] summary[data-v-96d93786]{border-bottom:1px solid var(--md-outline-variant)}.fold .grid3[data-v-96d93786],.fold .grid2[data-v-96d93786]{padding:18px;margin:0}.stat-cards[data-v-96d93786]{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px}.stat-card[data-v-96d93786]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:18px;display:flex;flex-direction:column;gap:4px}.stat-card b[data-v-96d93786]{font-size:28px;font-weight:800}.stat-card span[data-v-96d93786]{font-size:12px;color:var(--md-on-surface-variant)}.bars[data-v-96d93786]{display:flex;flex-direction:column;gap:10px}.bar-row[data-v-96d93786]{display:flex;align-items:center;gap:10px;font-size:12.5px}.bar-label[data-v-96d93786]{flex:0 0 84px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--md-on-surface-variant)}.bar[data-v-96d93786]{flex:1;height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.bar i[data-v-96d93786]{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 60%,#fff));transition:width .4s var(--spring)}.bar.big[data-v-96d93786]{height:14px;margin:8px 0}.feed[data-v-96d93786]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.feed li[data-v-96d93786]{display:flex;flex-direction:column;gap:3px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);font-size:13px}.feed li .actions-row[data-v-96d93786]{margin-top:4px}.pos[data-v-96d93786]{color:var(--md-success);font-weight:800}.neg[data-v-96d93786]{color:var(--md-error);font-weight:800}.tl-detail[data-v-96d93786]{margin:4px 0 0;font-size:12px;color:var(--md-on-surface-variant);background:var(--md-surface-container);padding:7px 10px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}.user-layout[data-v-96d93786]{display:grid;grid-template-columns:300px 1fr;gap:16px;align-items:start}.roster[data-v-96d93786]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:14px;display:flex;flex-direction:column;gap:8px}.roster-head[data-v-96d93786]{display:flex;align-items:center;gap:8px;padding:4px 6px 8px}.roster-row[data-v-96d93786]{display:flex;gap:10px;align-items:center;padding:10px;border:0;border-radius:var(--r-sm);background:transparent;cursor:pointer;text-align:left;transition:background .2s}.roster-row[data-v-96d93786]:hover{background:var(--md-surface-container-low)}.roster-row.active[data-v-96d93786]{background:var(--md-secondary-container)}.avatar[data-v-96d93786]{width:38px;height:38px;border-radius:50%;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:800;flex:0 0 auto}.avatar.lg[data-v-96d93786]{width:52px;height:52px;font-size:20px}.rmain[data-v-96d93786]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.rtop[data-v-96d93786]{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700}.user-detail[data-v-96d93786]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;min-height:320px}.detail-head[data-v-96d93786]{display:flex;align-items:center;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}.subtabs[data-v-96d93786]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.subtabs button[data-v-96d93786]{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:700 12px/1 inherit;cursor:pointer}.subtabs button.active[data-v-96d93786]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}.kv-grid[data-v-96d93786]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:8px}.kv[data-v-96d93786]{background:var(--md-surface-container-low);border-radius:var(--r-sm);padding:12px 14px;display:flex;flex-direction:column;gap:3px}.kv span[data-v-96d93786]{font-size:11.5px;color:var(--md-on-surface-variant)}.kv b[data-v-96d93786]{font-size:22px;font-weight:800}.world-layout[data-v-96d93786]{display:grid;grid-template-columns:190px 1fr;gap:16px;align-items:start}.world-nav[data-v-96d93786]{position:sticky;top:8px;display:flex;flex-direction:column;gap:4px}.world-nav button[data-v-96d93786]{display:flex;justify-content:space-between;align-items:center;height:42px;padding:0 14px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .2s}.world-nav button[data-v-96d93786]:hover{background:var(--md-surface-container-high)}.world-nav button.active[data-v-96d93786]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.world-body .cards[data-v-96d93786]{margin-top:0}.group-form[data-v-96d93786]{display:grid;grid-template-columns:1fr 130px 1fr auto;gap:10px;margin-bottom:16px}.group-detail[data-v-96d93786]{margin:10px 0;padding:12px;border-radius:var(--r-sm);background:var(--md-surface-container-low)}.members[data-v-96d93786]{display:flex;flex-direction:column;gap:6px}.member[data-v-96d93786]{display:flex;align-items:center;gap:10px;font-size:12.5px}.member .meta[data-v-96d93786]{flex:1}.cal-card[data-v-96d93786]{grid-column:auto}.cal-week[data-v-96d93786]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}.cal-week span[data-v-96d93786]{text-align:center;font-size:11px;color:var(--md-on-surface-variant);font-weight:700}.cal-grid[data-v-96d93786]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-cell[data-v-96d93786]{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:12px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}.cal-cell.empty[data-v-96d93786]{border-color:transparent;background:transparent}.cal-cell.today[data-v-96d93786]{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 20%,transparent)}.cal-cell.has[data-v-96d93786]{background:var(--md-surface-container-low)}.cal-day[data-v-96d93786]{font-size:12px;font-weight:800;color:var(--md-on-surface-variant)}.cal-chip[data-v-96d93786]{font-size:10.5px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-more[data-v-96d93786]{font-size:10px;color:var(--md-on-surface-variant)}.cloud[data-v-96d93786]{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}.cloud-word[data-v-96d93786]{font-weight:800;color:var(--md-primary);line-height:1.2}.mini-actions[data-v-96d93786]{display:flex;gap:6px;flex:0 0 auto}.warnline[data-v-96d93786]{margin:12px 0 0;padding:10px 12px;border-radius:var(--r-sm);background:#fff3dd;color:#7a4400;font-size:12.5px}.spark[data-v-96d93786]{display:flex;align-items:flex-end;gap:6px;height:120px;padding:8px 2px 0}.spark-col[data-v-96d93786]{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px;height:100%}.spark-col i[data-v-96d93786]{width:100%;max-width:22px;border-radius:7px 7px 3px 3px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 55%,#fff));transition:height .4s var(--spring)}.spark-col span[data-v-96d93786]{font-size:9.5px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace}.radar-wrap[data-v-96d93786]{display:flex;flex-direction:column;align-items:center;gap:8px}.radar[data-v-96d93786]{width:180px;height:180px}.radar-grid[data-v-96d93786]{fill:none;stroke:var(--md-outline-variant);stroke-width:1}.radar-fill[data-v-96d93786]{fill:color-mix(in srgb,var(--md-primary) 34%,transparent);stroke:var(--md-primary);stroke-width:2;transition:all .4s var(--spring)}.radar-lbl[data-v-96d93786]{font-size:8px;fill:var(--md-on-surface-variant);font-weight:700}.findings[data-v-96d93786]{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}.findings li[data-v-96d93786]{display:flex;gap:8px;align-items:center}@media (prefers-color-scheme: dark){.pill.bad[data-v-96d93786]{background:#5a2d00;color:#ffd7b0}.chip.warn[data-v-96d93786]{background:#5a3d00;color:#ffe0a3}.warnline[data-v-96d93786]{background:#3d2b00;color:#ffd89a}.tl li.warn[data-v-96d93786]{background:#3d2b00}}@media (max-width:1080px){.desk[data-v-96d93786]{grid-template-columns:1fr 1fr}.stat-cards[data-v-96d93786]{grid-template-columns:repeat(2,1fr)}.hero-stats[data-v-96d93786]{grid-template-columns:repeat(3,1fr)}}@media (max-width:820px){.grid2[data-v-96d93786],.grid3[data-v-96d93786],.desk[data-v-96d93786],.user-layout[data-v-96d93786],.world-layout[data-v-96d93786],.group-form[data-v-96d93786]{grid-template-columns:1fr}.settings-grid label.wide[data-v-96d93786]{grid-column:span 1}.hero-stats[data-v-96d93786]{grid-template-columns:repeat(2,1fr)}}@media (max-width:560px){.pcp[data-v-96d93786]{padding:var(--space-lg) var(--space-lg) 80px}.hero[data-v-96d93786]{padding:20px}.hero-actions[data-v-96d93786]{width:100%}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
