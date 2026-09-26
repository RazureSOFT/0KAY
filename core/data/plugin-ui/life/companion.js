import { defineComponent as Vt, ref as v, computed as N, onMounted as Dt, openBlock as n, createElementBlock as i, createElementVNode as t, toDisplayString as a, createCommentVNode as u, createStaticVNode as R, normalizeClass as w, withModifiers as I, withDirectives as _, vModelText as m, Fragment as c, renderList as p, createTextVNode as f, vModelCheckbox as Et, vModelSelect as Ft, normalizeStyle as _t } from "vue";
import { u as It, _ as Ot } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const Pt = { class: "page" }, qt = { class: "page-inner" }, Yt = { class: "page-header" }, At = { class: "header-actions" }, Bt = ["disabled"], Jt = ["disabled"], zt = {
  key: 0,
  class: "error-banner"
}, Ht = {
  key: 1,
  class: "notice"
}, Qt = { class: "stat-grid" }, Gt = { class: "stat-card" }, Kt = { class: "stat-value" }, Rt = { class: "stat-card" }, Wt = { class: "stat-value" }, Xt = { class: "stat-card" }, Zt = { class: "stat-value" }, te = { class: "stat-hint" }, ee = { class: "stat-card" }, se = { class: "stat-value" }, ae = { class: "life-state" }, le = { class: "state-pill" }, ne = {
  key: 0,
  class: "state-pill"
}, ie = { class: "group" }, oe = { class: "grid" }, de = { class: "card" }, re = { class: "item-list" }, ue = { class: "item-main" }, ce = { class: "item-meta" }, ve = { class: "item-actions" }, pe = ["onClick"], _e = ["onClick"], me = {
  key: 0,
  class: "list-empty"
}, he = { class: "item-list" }, be = { class: "item-main" }, ge = { class: "item-row" }, ye = { class: "item-meta" }, fe = {
  key: 0,
  class: "list-empty"
}, ke = { class: "card" }, we = { class: "card-head" }, Ce = { class: "chip muted" }, xe = { class: "check-line" }, Se = ["disabled"], $e = { class: "item-list" }, je = { class: "item-main" }, Me = { class: "item-meta" }, Le = { class: "item-actions" }, Ne = ["onClick"], Ue = {
  key: 0,
  class: "list-empty"
}, Te = { class: "card" }, Ve = { class: "card-head" }, De = { class: "head-actions" }, Ee = ["disabled"], Fe = { class: "book" }, Ie = { class: "book-nav" }, Oe = ["disabled"], Pe = ["disabled"], qe = { class: "book-page" }, Ye = { class: "book-heading" }, Ae = {
  key: 0,
  class: "book-body"
}, Be = {
  key: 1,
  class: "book-empty"
}, Je = { class: "card" }, ze = { class: "card-head" }, He = { class: "head-actions" }, Qe = ["disabled"], Ge = { class: "feed" }, Ke = {
  key: 0,
  class: "list-empty plain"
}, Re = { class: "group" }, We = { class: "grid" }, Xe = { class: "card" }, Ze = { class: "card-head" }, ts = { class: "card-title" }, es = {
  key: 1,
  class: "chip muted"
}, ss = { class: "user-tools" }, as = ["value"], ls = { class: "rel-list" }, ns = ["onClick"], is = { class: "avatar" }, os = { class: "rel-main" }, ds = { class: "rel-top" }, rs = { class: "chip" }, us = { class: "rel-meter" }, cs = { class: "meter-bar" }, vs = { class: "item-meta" }, ps = {
  key: 0,
  class: "list-empty"
}, _s = {
  key: 1,
  class: "list-empty"
}, ms = { class: "detail-head" }, hs = { class: "avatar" }, bs = { class: "rel-main" }, gs = { class: "item-meta" }, ys = { class: "tabs" }, fs = ["onClick"], ks = {
  key: 0,
  class: "detail-body"
}, ws = { class: "kv-grid" }, Cs = { class: "kv" }, xs = { class: "kv" }, Ss = { class: "kv" }, $s = { class: "kv" }, js = { class: "kv" }, Ms = { class: "feed compact" }, Ls = {
  key: 0,
  class: "list-empty plain"
}, Ns = {
  key: 1,
  class: "detail-body"
}, Us = { class: "rel-meter big" }, Ts = { class: "meter-bar" }, Vs = { class: "rel-actions" }, Ds = { class: "feed compact" }, Es = {
  key: 0,
  class: "list-empty plain"
}, Fs = {
  key: 2,
  class: "detail-body"
}, Is = { class: "item-list" }, Os = { class: "item-main" }, Ps = { class: "item-meta" }, qs = { class: "item-meta" }, Ys = { class: "item-actions" }, As = ["onClick"], Bs = {
  key: 0,
  class: "list-empty"
}, Js = { class: "feed compact" }, zs = {
  key: 0,
  class: "list-empty plain"
}, Hs = {
  key: 3,
  class: "detail-body"
}, Qs = { class: "item-list" }, Gs = { class: "item-main" }, Ks = { class: "mem-text" }, Rs = { class: "item-meta" }, Ws = { class: "item-actions" }, Xs = ["onClick"], Zs = {
  key: 0,
  class: "list-empty"
}, ta = {
  key: 4,
  class: "detail-body"
}, ea = { class: "timeline" }, sa = { class: "tl-body" }, aa = { class: "tl-head" }, la = { class: "item-meta" }, na = { class: "tl-detail" }, ia = {
  key: 0,
  class: "list-empty plain"
}, oa = { class: "card" }, da = { class: "item-list" }, ra = { class: "item-main" }, ua = { class: "item-meta" }, ca = { class: "chip" }, va = {
  key: 0,
  class: "list-empty"
}, pa = { class: "group" }, _a = { class: "grid" }, ma = { class: "card" }, ha = { class: "card-head" }, ba = { class: "chip muted" }, ga = { class: "toolbar-inline" }, ya = ["disabled"], fa = ["disabled"], ka = { class: "item-list" }, wa = { class: "item-main" }, Ca = { class: "item-meta" }, xa = { class: "item-meta" }, Sa = { class: "item-actions" }, $a = ["onClick"], ja = {
  key: 0,
  class: "list-empty"
}, Ma = { class: "policy" }, La = { class: "select" }, Na = { class: "select" }, Ua = { class: "select" }, Ta = { class: "select" }, Va = { class: "feed" }, Da = {
  key: 0,
  class: "list-empty plain"
}, Ea = { class: "group" }, Fa = { class: "grid" }, Ia = { class: "card" }, Oa = { class: "card-head" }, Pa = { class: "chip muted" }, qa = { class: "item-list" }, Ya = { class: "item-main" }, Aa = { class: "item-meta" }, Ba = {
  key: 0,
  class: "group-detail"
}, Ja = {
  key: 0,
  class: "topics"
}, za = { class: "feed compact" }, Ha = { class: "item-actions" }, Qa = ["onClick"], Ga = {
  key: 0,
  class: "list-empty"
}, Ka = { class: "group" }, Ra = { class: "grid" }, Wa = { class: "card audit-card" }, Xa = { class: "card-head" }, Za = { class: "chip muted" }, tl = { class: "usage-grid" }, el = { class: "usage-item" }, sl = { class: "usage-item" }, al = { class: "usage-item" }, ll = { class: "item-list" }, nl = { class: "item-main" }, il = { class: "item-meta" }, ol = {
  key: 0,
  class: "list-empty"
}, dl = { class: "card audit-card" }, rl = { class: "card-head" }, ul = { class: "timeline" }, cl = { class: "tl-body" }, vl = { class: "tl-head" }, pl = { class: "item-meta" }, _l = { class: "tl-detail" }, ml = {
  key: 0,
  class: "list-empty plain"
}, hl = /* @__PURE__ */ Vt({
  __name: "CompanionPage",
  setup(bl) {
    const { confirm: mt } = It(), r = v({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), O = v(!1), C = v(""), V = v(""), D = v(""), P = v(""), q = v(""), Y = v(""), A = v(""), at = () => {
      const l = /* @__PURE__ */ new Date(), s = (e) => String(e).padStart(2, "0");
      return `${l.getFullYear()}-${s(l.getMonth() + 1)}-${s(l.getDate())}`;
    }, E = v(at()), x = v({ date: "", content: "", previous: null, next: null }), F = v(!1), lt = N(() => (x.value.content || "").split(/\n{2,}/).map((l) => l.trim()).filter(Boolean));
    async function W(l = E.value) {
      F.value = !0;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "journal_page", payload: { date: l } }) });
        if (!s.ok) throw Error(await s.text());
        const e = await s.json();
        x.value = { date: e?.date || l, content: e?.content || "", previous: e?.previous || null, next: e?.next || null }, E.value = x.value.date;
      } catch (s) {
        C.value = s?.message || "无法读取日记";
      } finally {
        F.value = !1;
      }
    }
    function nt(l) {
      const s = l === "previous" ? x.value.previous : x.value.next;
      s && W(s);
    }
    const B = v(""), h = v({ target: "", motive: "", content: "", preferred_at: "" }), g = v({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), J = N(() => Object.entries(r.value.groups || {})), z = N(() => (r.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), X = N(() => r.value.proactive?.receipts || []), ht = at(), Z = N(() => (r.value.agenda || []).filter((l) => {
      const s = String(l.start_at || "").replace("T", " ");
      return !s || s.slice(0, 10) >= ht;
    }));
    function k(l) {
      V.value = l, setTimeout(() => {
        V.value === l && (V.value = "");
      }, 2e3);
    }
    const S = v(null);
    async function bt() {
      try {
        const l = await fetch("/api/usage");
        l.ok && (S.value = await l.json());
      } catch {
      }
    }
    async function U() {
      O.value = !0, C.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        r.value = await l.json(), r.value?.policy && (g.value = { ...g.value, ...r.value.policy });
      } catch (l) {
        C.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        O.value = !1;
      }
      bt(), W();
    }
    async function b(l, s) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: s }) });
        if (!e.ok) throw Error(await e.text());
        return await U(), await e.json().catch(() => ({}));
      } catch (e) {
        return C.value = e?.message || "操作失败", null;
      }
    }
    async function gt() {
      D.value.trim() && (await b("add_agenda", { title: D.value, when: P.value, detail: q.value }), D.value = "", P.value = "", q.value = "");
    }
    async function it(l, s) {
      s.trim() && (await b(l, { content: s }), l === "journal" ? Y.value = "" : A.value = "");
    }
    function ot(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    function dt(l) {
      if (l.status === "completed") return { label: "已完成", cls: "chip-ok" };
      const s = new Date(String(l.start_at || "").replace(" ", "T"));
      return !Number.isNaN(s.getTime()) && s.getTime() <= Date.now() ? { label: "进行中", cls: "chip-warn" } : { label: "待开始", cls: "muted" };
    }
    async function rt(l, s) {
      await b("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: s }) && k(`已调整 ${l}`);
    }
    async function yt() {
      if (!h.value.target.trim() || !h.value.content.trim()) return;
      await b("proactive_create", { ...h.value }) && (h.value = { target: "", motive: "", content: "", preferred_at: "" }, k("已创建主动候选"));
    }
    async function ut(l) {
      await b("proactive_cancel", { id: l, reason: "dashboard_cancel" }), k("已取消候选");
    }
    async function ft() {
      await b("proactive_policy", { daily_limit: Number(g.value.daily_limit), per_target_limit: Number(g.value.per_target_limit), quiet_start: Number(g.value.quiet_start), quiet_end: Number(g.value.quiet_end) }), k("策略已保存");
    }
    const T = v("");
    async function ct(l) {
      T.value = l;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        await U(), k("已由 LIFE 生成");
      } catch (s) {
        C.value = s?.message || "生成失败";
      } finally {
        T.value = "";
      }
    }
    async function kt() {
      const l = h.value.target.trim() || "user:owner";
      await b("proactive_suggest", { target: l, hint: h.value.motive }) && (h.value = { target: "", motive: "", content: "", preferred_at: "" }, k("已生成建议候选"));
    }
    const H = v(!1);
    async function wt() {
      H.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await U(), k(s?.skipped ? `本次跳过：${s.skipped}` : `已投递 ${s.delivered || 0} 条 · 拦截 ${s.blocked || 0} 条`);
      } catch (l) {
        C.value = l?.message || "投递失败";
      } finally {
        H.value = !1;
      }
    }
    const Q = v(!1);
    async function Ct() {
      Q.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await U();
        const e = s?.applied;
        k(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (l) {
        C.value = l?.message || "规划失败";
      } finally {
        Q.value = !1;
      }
    }
    function tt(l) {
      const s = (l || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let o = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? (o = new Date(s), o.setHours(0, 0, 0, 0), o < e && o.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(s) && (o = new Date(e.getFullYear(), Number(s.slice(0, 2)) - 1, Number(s.slice(3, 5))), o < e && o.setFullYear(e.getFullYear() + 1)), !o || Number.isNaN(o.getTime()) ? null : Math.round((o.getTime() - e.getTime()) / 864e5);
    }
    const y = v({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function xt() {
      !y.value.title.trim() || !y.value.date.trim() || (await b("date_add", { ...y.value }), y.value = { title: "", date: "", repeat_yearly: !0, note: "" }, k("已添加重要日期"));
    }
    async function St(l) {
      await b("date_delete", { id: l }), k("已删除");
    }
    async function $t() {
      await b("circadian_eat", { amount: 45 }), k("已用餐");
    }
    async function jt() {
      const l = await b("daily_agenda", {});
      k(l?.created ? `LIFE 已安排 ${l.created} 项活动` : "今天已有安排");
    }
    async function vt(l) {
      await mt({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await b("journal_clear", { kind: l }), k("已清除"));
    }
    function $(l) {
      if (!l) return "";
      const s = new Date(l);
      return Number.isNaN(s.getTime()) ? l : s.toLocaleString();
    }
    const M = v(""), G = v(""), K = v(""), d = v(null), et = v(!1), L = v("overview"), Mt = [{ key: "overview", label: "概览" }, { key: "relationship", label: "关系" }, { key: "proactive", label: "主动" }, { key: "memory", label: "记忆" }, { key: "diagnostics", label: "诊断" }], Lt = N(() => Array.from(new Set((r.value.relationships || []).map((l) => l.stage).filter(Boolean)))), st = N(() => (r.value.relationships || []).filter((l) => (!G.value || String(l.user_id).toLowerCase().includes(G.value.toLowerCase())) && (!K.value || l.stage === K.value)));
    async function pt(l) {
      M.value = l, L.value = "overview", et.value = !0;
      const s = await b("user_detail", { user_id: l, limit: 100, memory_limit: 100 });
      d.value = s || null, et.value = !1;
    }
    function Nt() {
      M.value = "", d.value = null;
    }
    async function Ut(l) {
      await b("delete_memory", { id: l }), M.value && pt(M.value);
    }
    return Dt(U), (l, s) => (n(), i("main", Pt, [
      t("div", qt, [
        t("header", Yt, [
          s[32] || (s[32] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", At, [
            t("button", {
              class: "btn btn-primary",
              disabled: Q.value,
              onClick: Ct
            }, a(Q.value ? "规划中…" : "让 LIFE 规划"), 9, Bt),
            t("button", {
              class: "btn btn-tonal",
              disabled: O.value,
              onClick: U
            }, a(O.value ? "刷新中…" : "刷新"), 9, Jt)
          ])
        ]),
        C.value ? (n(), i("p", zt, a(C.value), 1)) : u("", !0),
        V.value ? (n(), i("p", Ht, a(V.value), 1)) : u("", !0),
        t("section", Qt, [
          t("article", Gt, [
            s[33] || (s[33] = R('<div class="stat-head" data-v-0cd9686f><span class="icon-badge tone-1" aria-hidden="true" data-v-0cd9686f><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-0cd9686f><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-0cd9686f></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-0cd9686f></path></svg></span><span class="stat-label" data-v-0cd9686f>关系对象</span></div>', 1)),
            t("strong", Kt, a(r.value.relationships?.length || 0), 1),
            s[34] || (s[34] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", Rt, [
            s[35] || (s[35] = R('<div class="stat-head" data-v-0cd9686f><span class="icon-badge tone-2" aria-hidden="true" data-v-0cd9686f><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-0cd9686f><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-0cd9686f></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-0cd9686f></path></svg></span><span class="stat-label" data-v-0cd9686f>活动日程</span></div>', 1)),
            t("strong", Wt, a(Z.value.filter((e) => e.status === "active").length), 1),
            s[36] || (s[36] = t("span", { class: "stat-hint" }, "今天起待进行", -1))
          ]),
          t("article", Xt, [
            s[37] || (s[37] = R('<div class="stat-head" data-v-0cd9686f><span class="icon-badge tone-3" aria-hidden="true" data-v-0cd9686f><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-0cd9686f><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-0cd9686f></path></svg></span><span class="stat-label" data-v-0cd9686f>待投递主动行为</span></div>', 1)),
            t("strong", Zt, a(z.value.length), 1),
            t("span", te, "已投递 " + a(X.value.length) + " 次", 1)
          ]),
          t("article", ee, [
            s[38] || (s[38] = R('<div class="stat-head" data-v-0cd9686f><span class="icon-badge tone-4" aria-hidden="true" data-v-0cd9686f><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-0cd9686f><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-0cd9686f></path></svg></span><span class="stat-label" data-v-0cd9686f>已观察群聊</span></div>', 1)),
            t("strong", se, a(J.value.length), 1),
            s[39] || (s[39] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", ae, [
          t("span", le, "精力 " + a(Math.round(r.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: w(["state-pill", { warn: (r.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + a(Math.round(r.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: w(["state-pill", { warn: (r.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + a(Math.round(r.value.circadian?.health ?? 100)), 3),
          r.value.circadian?.is_sleeping ? (n(), i("span", ne, "睡眠中")) : u("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: $t
          }, "吃饭")
        ]),
        t("section", ie, [
          s[50] || (s[50] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", oe, [
            t("article", de, [
              t("div", { class: "card-head" }, [
                s[40] || (s[40] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: jt
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: I(gt, ["prevent"])
              }, [
                _(t("input", {
                  "onUpdate:modelValue": s[0] || (s[0] = (e) => D.value = e),
                  class: "input",
                  placeholder: "日程标题",
                  "aria-label": "日程标题"
                }, null, 512), [
                  [m, D.value]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": s[1] || (s[1] = (e) => P.value = e),
                  class: "input",
                  placeholder: "时间，例如 2026-09-25 20:00",
                  "aria-label": "时间"
                }, null, 512), [
                  [m, P.value]
                ]),
                s[41] || (s[41] = t("button", {
                  class: "btn btn-primary",
                  type: "submit"
                }, "创建候选", -1)),
                _(t("textarea", {
                  "onUpdate:modelValue": s[2] || (s[2] = (e) => q.value = e),
                  class: "input area",
                  placeholder: "说明（可选）"
                }, null, 512), [
                  [m, q.value]
                ])
              ], 32),
              s[42] || (s[42] = t("h3", { class: "section-label" }, "待确认候选", -1)),
              t("ul", re, [
                (n(!0), i(c, null, p(r.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ue, [
                    t("strong", null, a(e.title), 1),
                    t("span", ce, a(e.when_text) + " · " + a(e.detail || "等待你确认"), 1)
                  ]),
                  t("div", ve, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (o) => b("confirm_agenda", { id: e.id })
                    }, "确认", 8, pe),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => b("reject_agenda", { id: e.id })
                    }, "拒绝", 8, _e)
                  ])
                ]))), 128)),
                r.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? u("", !0) : (n(), i("li", me, "没有待确认的日程候选"))
              ]),
              s[43] || (s[43] = t("h3", { class: "section-label" }, [
                f("今天的日程 "),
                t("small", { class: "hint-inline" }, "LIFE 按时间自动推进")
              ], -1)),
              t("ul", he, [
                (n(!0), i(c, null, p(Z.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", be, [
                    t("div", ge, [
                      t("strong", {
                        class: w({ done: e.status === "completed" })
                      }, a(e.title), 3),
                      t("span", {
                        class: w(["chip", dt(e).cls])
                      }, a(dt(e).label), 3)
                    ]),
                    t("span", ye, [
                      f(a(e.start_at), 1),
                      e.detail ? (n(), i(c, { key: 0 }, [
                        f(" · " + a(e.detail), 1)
                      ], 64)) : u("", !0)
                    ])
                  ])
                ]))), 128)),
                Z.value.length ? u("", !0) : (n(), i("li", fe, "今天还没有安排，点右上角让 LIFE 安排。"))
              ])
            ]),
            t("article", ke, [
              t("div", we, [
                s[44] || (s[44] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", Ce, a((r.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: I(xt, ["prevent"])
              }, [
                _(t("input", {
                  "onUpdate:modelValue": s[3] || (s[3] = (e) => y.value.title = e),
                  class: "input",
                  placeholder: "名称，如 生日 / 纪念日",
                  "aria-label": "重要日期名称"
                }, null, 512), [
                  [m, y.value.title]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": s[4] || (s[4] = (e) => y.value.date = e),
                  class: "input",
                  placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                  "aria-label": "重要日期"
                }, null, 512), [
                  [m, y.value.date]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": s[5] || (s[5] = (e) => y.value.note = e),
                  class: "input",
                  placeholder: "备注（可选）",
                  "aria-label": "备注"
                }, null, 512), [
                  [m, y.value.note]
                ]),
                t("label", xe, [
                  _(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[6] || (s[6] = (e) => y.value.repeat_yearly = e)
                  }, null, 512), [
                    [Et, y.value.repeat_yearly]
                  ]),
                  s[45] || (s[45] = f(" 每年重复", -1))
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !y.value.title.trim() || !y.value.date.trim()
                }, "添加", 8, Se)
              ], 32),
              t("ul", $e, [
                (n(!0), i(c, null, p(r.value.important_dates, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", je, [
                    t("strong", null, a(e.title), 1),
                    t("span", Me, [
                      f(a(e.date_text), 1),
                      tt(e.date_text) !== null ? (n(), i(c, { key: 0 }, [
                        f(" · " + a(tt(e.date_text) === 0 ? "就是今天" : tt(e.date_text) + " 天后"), 1)
                      ], 64)) : u("", !0),
                      e.note ? (n(), i(c, { key: 1 }, [
                        f(" · " + a(e.note), 1)
                      ], 64)) : u("", !0)
                    ])
                  ]),
                  t("div", Le, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => St(e.id)
                    }, "删除", 8, Ne)
                  ])
                ]))), 128)),
                r.value.important_dates?.length ? u("", !0) : (n(), i("li", Ue, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", Te, [
              t("div", Ve, [
                s[46] || (s[46] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", De, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[7] || (s[7] = (e) => vt("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: T.value === "journal",
                    onClick: s[8] || (s[8] = (e) => ct("journal"))
                  }, a(T.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, Ee)
                ])
              ]),
              t("div", Fe, [
                t("div", Ie, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !x.value.previous || F.value,
                    onClick: s[9] || (s[9] = (e) => nt("previous"))
                  }, "← 前一页", 8, Oe),
                  _(t("input", {
                    "onUpdate:modelValue": s[10] || (s[10] = (e) => E.value = e),
                    class: "input book-date",
                    type: "date",
                    "aria-label": "日记日期",
                    onChange: s[11] || (s[11] = (e) => W(E.value))
                  }, null, 544), [
                    [m, E.value]
                  ]),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: !x.value.next || F.value,
                    onClick: s[12] || (s[12] = (e) => nt("next"))
                  }, "后一页 →", 8, Pe)
                ]),
                t("div", qe, [
                  t("p", Ye, a(x.value.date), 1),
                  lt.value.length ? (n(), i("div", Ae, [
                    (n(!0), i(c, null, p(lt.value, (e, o) => (n(), i("p", { key: o }, a(e), 1))), 128))
                  ])) : (n(), i("p", Be, a(F.value ? "翻页中…" : "这一天还没有写下什么。"), 1))
                ])
              ]),
              t("form", {
                class: "stack-form diary-manual",
                onSubmit: s[14] || (s[14] = I((e) => it("journal", Y.value), ["prevent"]))
              }, [
                _(t("textarea", {
                  "onUpdate:modelValue": s[13] || (s[13] = (e) => Y.value = e),
                  class: "input area",
                  placeholder: "为今天写下一点…"
                }, null, 512), [
                  [m, Y.value]
                ]),
                s[47] || (s[47] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "写入今天", -1))
              ], 32)
            ]),
            t("article", Je, [
              t("div", ze, [
                s[48] || (s[48] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", He, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[15] || (s[15] = (e) => vt("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: T.value === "dream",
                    onClick: s[16] || (s[16] = (e) => ct("dream"))
                  }, a(T.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, Qe)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: s[18] || (s[18] = I((e) => it("dream", A.value), ["prevent"]))
              }, [
                _(t("textarea", {
                  "onUpdate:modelValue": s[17] || (s[17] = (e) => A.value = e),
                  class: "input area",
                  placeholder: "记录一个梦境或睡眠反思…"
                }, null, 512), [
                  [m, A.value]
                ]),
                s[49] || (s[49] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "记录梦境", -1))
              ], 32),
              t("ol", Ge, [
                (n(!0), i(c, null, p(r.value.dreams, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, a(e.at), 1),
                  t("p", null, a(e.content), 1)
                ]))), 128)),
                r.value.dreams?.length ? u("", !0) : (n(), i("li", Ke, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", Re, [
          s[64] || (s[64] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", We, [
            t("article", Xe, [
              t("div", Ze, [
                t("h2", ts, a(M.value ? "用户详情" : "用户"), 1),
                M.value ? (n(), i("button", {
                  key: 0,
                  class: "btn btn-tonal btn-sm",
                  onClick: Nt
                }, "← 返回用户列表")) : (n(), i("span", es, a(st.value.length) + " / " + a(r.value.relationships?.length || 0), 1))
              ]),
              M.value ? et.value ? (n(), i("div", _s, "加载中…")) : d.value ? (n(), i(c, { key: 2 }, [
                t("div", ms, [
                  t("span", hs, a((d.value.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", bs, [
                    t("strong", null, a(d.value.user_id), 1),
                    t("span", gs, "阶段 " + a(d.value.relationship?.stage || "未知") + " · 好感 " + a(Math.round((d.value.relationship?.affinity || 0) * 100)) + "% · 最近 " + a(d.value.relationship?.last_seen || "—"), 1)
                  ])
                ]),
                t("nav", ys, [
                  (n(), i(c, null, p(Mt, (e) => t("button", {
                    key: e.key,
                    class: w(["tab", { active: L.value === e.key }]),
                    onClick: (o) => L.value = e.key
                  }, a(e.label), 11, fs)), 64))
                ]),
                L.value === "overview" ? (n(), i("div", ks, [
                  t("div", ws, [
                    t("div", Cs, [
                      s[53] || (s[53] = t("span", null, "关系事件", -1)),
                      t("strong", null, a(d.value.counts?.ledger || 0), 1)
                    ]),
                    t("div", xs, [
                      s[54] || (s[54] = t("span", null, "主动候选", -1)),
                      t("strong", null, a(d.value.counts?.candidates || 0), 1)
                    ]),
                    t("div", Ss, [
                      s[55] || (s[55] = t("span", null, "已投递", -1)),
                      t("strong", null, a(d.value.counts?.delivered || 0), 1)
                    ]),
                    t("div", $s, [
                      s[56] || (s[56] = t("span", null, "记忆条数", -1)),
                      t("strong", null, a(d.value.memories?.total || 0), 1)
                    ]),
                    t("div", js, [
                      s[57] || (s[57] = t("span", null, "阶段主动上限", -1)),
                      t("strong", null, a(d.value.stage_limit ?? "不限"), 1)
                    ])
                  ]),
                  s[58] || (s[58] = t("h3", { class: "section-label" }, "最近关系事件", -1)),
                  t("ol", Ms, [
                    (n(!0), i(c, null, p((d.value.ledger || []).slice(0, 5), (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a($(e.created_at)), 1),
                      t("p", null, [
                        f(a(e.event_key) + " ", 1),
                        t("span", {
                          class: w(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        f(" · " + a(e.reason), 1)
                      ])
                    ]))), 128)),
                    (d.value.ledger || []).length ? u("", !0) : (n(), i("li", Ls, "暂无关系事件"))
                  ])
                ])) : L.value === "relationship" ? (n(), i("div", Ns, [
                  t("div", Us, [
                    t("div", Ts, [
                      t("i", {
                        style: _t({ width: ot(d.value.relationship?.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, a(Math.round((d.value.relationship?.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("div", Vs, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[21] || (s[21] = (e) => rt(d.value.user_id, 0.05))
                    }, "更亲近 +"),
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: s[22] || (s[22] = (e) => rt(d.value.user_id, -0.05))
                    }, "更疏远 −")
                  ]),
                  s[60] || (s[60] = t("h3", { class: "section-label" }, "事件账本", -1)),
                  t("ol", Ds, [
                    (n(!0), i(c, null, p(d.value.ledger, (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a($(e.created_at)), 1),
                      t("p", null, [
                        t("strong", null, a(e.event_key), 1),
                        s[59] || (s[59] = f()),
                        t("span", {
                          class: w(e.delta >= 0 ? "pos" : "neg")
                        }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                        f(" · " + a(e.reason) + " (" + a(e.channel) + ")", 1)
                      ])
                    ]))), 128)),
                    (d.value.ledger || []).length ? u("", !0) : (n(), i("li", Es, "暂无关系事件"))
                  ])
                ])) : L.value === "proactive" ? (n(), i("div", Fs, [
                  s[61] || (s[61] = t("h3", { class: "section-label" }, "候选队列", -1)),
                  t("ul", Is, [
                    (n(!0), i(c, null, p(d.value.proactive?.candidates || [], (e) => (n(), i("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", Os, [
                        t("strong", null, a(e.motive), 1),
                        t("span", Ps, a(e.content), 1),
                        t("span", qs, a(e.status) + " · " + a($(e.updated_at)), 1)
                      ]),
                      t("div", Ys, [
                        ["delivered", "cancelled"].includes(e.status) ? u("", !0) : (n(), i("button", {
                          key: 0,
                          class: "btn btn-danger btn-sm",
                          onClick: (o) => ut(e.id)
                        }, "取消", 8, As))
                      ])
                    ]))), 128)),
                    (d.value.proactive?.candidates || []).length ? u("", !0) : (n(), i("li", Bs, "暂无主动记录"))
                  ]),
                  s[62] || (s[62] = t("h3", { class: "section-label" }, "投递记录", -1)),
                  t("ol", Js, [
                    (n(!0), i(c, null, p(d.value.proactive?.receipts || [], (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("time", null, a($(e.created_at)), 1),
                      t("p", null, a(e.phase) + " · " + a(e.content), 1)
                    ]))), 128)),
                    (d.value.proactive?.receipts || []).length ? u("", !0) : (n(), i("li", zs, "暂无投递"))
                  ])
                ])) : L.value === "memory" ? (n(), i("div", Hs, [
                  t("ul", Qs, [
                    (n(!0), i(c, null, p(d.value.memories?.items || [], (e) => (n(), i("li", {
                      key: e.id,
                      class: "item"
                    }, [
                      t("div", Gs, [
                        t("strong", Ks, a(e.content), 1),
                        t("span", Rs, "scope " + a(e.scope) + " · 重要度 " + a(Math.round((e.importance || 0) * 100)) + "% · 召回 " + a(e.recall_count) + " 次", 1)
                      ]),
                      t("div", Ws, [
                        t("button", {
                          class: "btn btn-danger btn-sm",
                          onClick: (o) => Ut(e.id)
                        }, "删除", 8, Xs)
                      ])
                    ]))), 128)),
                    (d.value.memories?.items || []).length ? u("", !0) : (n(), i("li", Zs, "没有与该用户相关的记忆"))
                  ])
                ])) : (n(), i("div", ta, [
                  t("ol", ea, [
                    (n(!0), i(c, null, p(d.value.audit || [], (e) => (n(), i("li", {
                      key: e.id
                    }, [
                      t("span", {
                        class: w(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                        "aria-hidden": "true"
                      }, null, 2),
                      t("div", sa, [
                        t("div", aa, [
                          t("strong", null, a(e.kind), 1),
                          t("span", {
                            class: w(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                          }, a(e.outcome), 3),
                          t("time", null, a($(e.created_at)), 1)
                        ]),
                        t("p", la, a(e.target), 1),
                        t("p", na, a(e.detail), 1)
                      ])
                    ]))), 128)),
                    (d.value.audit || []).length ? u("", !0) : (n(), i("li", ia, "暂无诊断记录"))
                  ])
                ]))
              ], 64)) : u("", !0) : (n(), i(c, { key: 0 }, [
                t("div", ss, [
                  _(t("input", {
                    "onUpdate:modelValue": s[19] || (s[19] = (e) => G.value = e),
                    class: "input",
                    placeholder: "搜索用户 ID",
                    "aria-label": "搜索用户"
                  }, null, 512), [
                    [m, G.value]
                  ]),
                  _(t("select", {
                    "onUpdate:modelValue": s[20] || (s[20] = (e) => K.value = e),
                    class: "input user-stage",
                    "aria-label": "按阶段筛选"
                  }, [
                    s[51] || (s[51] = t("option", { value: "" }, "全部阶段", -1)),
                    (n(!0), i(c, null, p(Lt.value, (e) => (n(), i("option", {
                      key: e,
                      value: e
                    }, a(e), 9, as))), 128))
                  ], 512), [
                    [Ft, K.value]
                  ])
                ]),
                t("ul", ls, [
                  (n(!0), i(c, null, p(st.value, (e) => (n(), i("li", {
                    key: e.user_id,
                    class: "rel",
                    onClick: (o) => pt(e.user_id)
                  }, [
                    t("span", is, a((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                    t("div", os, [
                      t("div", ds, [
                        t("strong", null, a(e.user_id), 1),
                        t("span", rs, a(e.stage), 1)
                      ]),
                      t("div", us, [
                        t("div", cs, [
                          t("i", {
                            style: _t({ width: ot(e.affinity) })
                          }, null, 4)
                        ]),
                        t("b", null, a(Math.round((e.affinity || 0) * 100)) + "%", 1)
                      ]),
                      t("span", vs, "最近互动：" + a(e.last_seen || "暂无"), 1)
                    ]),
                    s[52] || (s[52] = t("span", {
                      class: "rel-chevron",
                      "aria-hidden": "true"
                    }, "›", -1))
                  ], 8, ns))), 128)),
                  st.value.length ? u("", !0) : (n(), i("li", ps, "没有匹配的用户"))
                ])
              ], 64))
            ]),
            t("article", oa, [
              s[63] || (s[63] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", da, [
                (n(!0), i(c, null, p(r.value.persona_evolution, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item trait-item"
                }, [
                  t("div", ra, [
                    t("strong", null, a(e.trait), 1),
                    t("span", ua, "支持 " + a(e.support_count) + " 次 · 置信度 " + a(Math.round((e.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", ca, a(e.value), 1)
                ]))), 128)),
                r.value.persona_evolution?.length ? u("", !0) : (n(), i("li", va, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", pa, [
          s[74] || (s[74] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", _a, [
            t("article", ma, [
              t("div", ha, [
                s[65] || (s[65] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", ba, "待投递 " + a(z.value.length), 1)
              ]),
              t("div", ga, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: kt
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: H.value,
                  onClick: wt
                }, a(H.value ? "检查中…" : "立即检查投递"), 9, ya)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: I(yt, ["prevent"])
              }, [
                _(t("input", {
                  "onUpdate:modelValue": s[23] || (s[23] = (e) => h.value.target = e),
                  class: "input",
                  placeholder: "目标：session:<会话ID> / user:<QQ> / group:<群号>",
                  "aria-label": "主动对象"
                }, null, 512), [
                  [m, h.value.target]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": s[24] || (s[24] = (e) => h.value.motive = e),
                  class: "input",
                  placeholder: "动机，如 care / reminder",
                  "aria-label": "动机"
                }, null, 512), [
                  [m, h.value.motive]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": s[25] || (s[25] = (e) => h.value.preferred_at = e),
                  class: "input",
                  placeholder: "期望时间（可选，ISO）",
                  "aria-label": "期望时间"
                }, null, 512), [
                  [m, h.value.preferred_at]
                ]),
                _(t("textarea", {
                  "onUpdate:modelValue": s[26] || (s[26] = (e) => h.value.content = e),
                  class: "input area",
                  placeholder: "想说的内容…"
                }, null, 512), [
                  [m, h.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !h.value.target.trim() || !h.value.content.trim()
                }, "创建候选", 8, fa)
              ], 32),
              s[70] || (s[70] = t("h3", { class: "section-label" }, "候选队列", -1)),
              t("ul", ka, [
                (n(!0), i(c, null, p(z.value, (e) => (n(), i("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", wa, [
                    t("strong", null, a(e.target) + " · " + a(e.motive), 1),
                    t("span", Ca, a(e.content), 1),
                    t("span", xa, "状态 " + a(e.status) + " · " + a($(e.created_at)), 1)
                  ]),
                  t("div", Sa, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (o) => ut(e.id)
                    }, "取消", 8, $a)
                  ])
                ]))), 128)),
                z.value.length ? u("", !0) : (n(), i("li", ja, "没有待投递候选"))
              ]),
              s[71] || (s[71] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", Ma, [
                t("label", La, [
                  s[66] || (s[66] = t("span", null, "每日上限", -1)),
                  _(t("input", {
                    "onUpdate:modelValue": s[27] || (s[27] = (e) => g.value.daily_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      m,
                      g.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Na, [
                  s[67] || (s[67] = t("span", null, "单人上限", -1)),
                  _(t("input", {
                    "onUpdate:modelValue": s[28] || (s[28] = (e) => g.value.per_target_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      m,
                      g.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Ua, [
                  s[68] || (s[68] = t("span", null, "免打扰起", -1)),
                  _(t("input", {
                    "onUpdate:modelValue": s[29] || (s[29] = (e) => g.value.quiet_start = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      m,
                      g.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", Ta, [
                  s[69] || (s[69] = t("span", null, "免打扰止", -1)),
                  _(t("input", {
                    "onUpdate:modelValue": s[30] || (s[30] = (e) => g.value.quiet_end = e),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      m,
                      g.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: ft
                }, "保存策略")
              ]),
              s[72] || (s[72] = t("p", { class: "helper-inline" }, [
                f("免打扰起止相同即关闭；target 用 "),
                t("code", null, "session:<会话ID>"),
                f(" 可直接发到对话。")
              ], -1)),
              s[73] || (s[73] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", Va, [
                (n(!0), i(c, null, p(X.value, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, a($(e.created_at)), 1),
                  t("p", null, a(e.phase) + " · " + a(e.content), 1)
                ]))), 128)),
                X.value.length ? u("", !0) : (n(), i("li", Da, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", Ea, [
          s[76] || (s[76] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", Fa, [
            t("article", Ia, [
              t("div", Oa, [
                s[75] || (s[75] = t("h2", { class: "card-title" }, "群聊观察", -1)),
                t("span", Pa, a(J.value.length), 1)
              ]),
              t("ul", qa, [
                (n(!0), i(c, null, p(J.value, ([e, o]) => (n(), i("li", {
                  key: e,
                  class: "item group-item"
                }, [
                  t("div", Ya, [
                    t("strong", null, a(e), 1),
                    t("span", Aa, "情绪 " + a(o.mood || "—") + " · " + a(o.messages?.length || 0) + " 条观察 · " + a(o.topics?.length || 0) + " 个话题", 1),
                    B.value === e ? (n(), i("div", Ba, [
                      o.topics?.length ? (n(), i("div", Ja, [
                        (n(!0), i(c, null, p(o.topics, (j) => (n(), i("span", {
                          key: j.topic,
                          class: "chip muted"
                        }, a(j.topic) + " · " + a(Math.round(j.score)), 1))), 128))
                      ])) : u("", !0),
                      t("ol", za, [
                        (n(!0), i(c, null, p(o.messages, (j, Tt) => (n(), i("li", { key: Tt }, [
                          t("time", null, a($(j.created_at)), 1),
                          t("p", null, [
                            t("strong", null, a(j.user_id), 1),
                            f("：" + a(j.content), 1)
                          ])
                        ]))), 128))
                      ])
                    ])) : u("", !0)
                  ]),
                  t("div", Ha, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (j) => B.value = B.value === e ? "" : e
                    }, a(B.value === e ? "收起" : "展开"), 9, Qa)
                  ])
                ]))), 128)),
                J.value.length ? u("", !0) : (n(), i("li", Ga, "群聊观察尚未启用或没有消息。"))
              ])
            ])
          ])
        ]),
        t("section", Ka, [
          s[82] || (s[82] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", Ra, [
            t("article", Wa, [
              t("div", Xa, [
                s[77] || (s[77] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", Za, a(S.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", tl, [
                t("div", el, [
                  t("strong", null, a((S.value?.total_tokens || 0).toLocaleString()), 1),
                  s[78] || (s[78] = t("span", null, "总 Token", -1))
                ]),
                t("div", sl, [
                  t("strong", null, a((S.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  s[79] || (s[79] = t("span", null, "输入", -1))
                ]),
                t("div", al, [
                  t("strong", null, a((S.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  s[80] || (s[80] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", ll, [
                (n(!0), i(c, null, p(S.value?.by_model || {}, (e, o) => (n(), i("li", {
                  key: o,
                  class: "item"
                }, [
                  t("div", nl, [
                    t("strong", null, a(o), 1),
                    t("span", il, a((e.total || 0).toLocaleString()) + " tokens · " + a(e.count) + " 次", 1)
                  ])
                ]))), 128)),
                !S.value || !Object.keys(S.value.by_model || {}).length ? (n(), i("li", ol, "暂无用量记录")) : u("", !0)
              ])
            ]),
            t("article", dl, [
              t("div", rl, [
                s[81] || (s[81] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: s[31] || (s[31] = (e) => b("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", ul, [
                (n(!0), i(c, null, p(r.value.audit, (e) => (n(), i("li", {
                  key: e.at + e.kind
                }, [
                  t("span", {
                    class: w(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", cl, [
                    t("div", vl, [
                      t("strong", null, a(e.kind), 1),
                      t("span", {
                        class: w(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, a(e.outcome), 3),
                      t("time", null, a(e.at), 1)
                    ]),
                    t("p", pl, a(e.target), 1),
                    t("p", _l, a(e.detail), 1)
                  ])
                ]))), 128)),
                r.value.audit?.length ? u("", !0) : (n(), i("li", ml, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), fl = /* @__PURE__ */ Ot(hl, [["__scopeId", "data-v-0cd9686f"]]);
export {
  fl as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-0cd9686f]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-0cd9686f]{max-width:1180px;margin:0 auto}.page-header[data-v-0cd9686f]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-0cd9686f]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-0cd9686f]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-0cd9686f]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-0cd9686f]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-0cd9686f]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-0cd9686f]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-0cd9686f]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-0cd9686f]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-0cd9686f]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-0cd9686f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-0cd9686f]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-0cd9686f]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-0cd9686f]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-0cd9686f]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-0cd9686f]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-0cd9686f]{display:flex;align-items:center;gap:10px}.stat-label[data-v-0cd9686f]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-0cd9686f]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-0cd9686f]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-0cd9686f]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-0cd9686f]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-0cd9686f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-0cd9686f]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-0cd9686f]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-0cd9686f]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-0cd9686f]{margin-bottom:var(--space-lg)}.group-title[data-v-0cd9686f]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-0cd9686f]{margin-bottom:0}.card[data-v-0cd9686f]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-0cd9686f]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-0cd9686f]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-0cd9686f]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-0cd9686f]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-0cd9686f]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-0cd9686f]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-0cd9686f]{background:#fff1dc;color:#7a4400}.input[data-v-0cd9686f]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-0cd9686f]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-0cd9686f]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-0cd9686f]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-0cd9686f]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-0cd9686f]{grid-column:1/-1}.stack-form[data-v-0cd9686f]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-0cd9686f]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-0cd9686f]{align-self:flex-start}.item-list[data-v-0cd9686f],.rel-list[data-v-0cd9686f],.feed[data-v-0cd9686f],.timeline[data-v-0cd9686f]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-0cd9686f]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-0cd9686f]{align-items:flex-start}.item[data-v-0cd9686f]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-0cd9686f]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-0cd9686f]{font-size:14px;font-weight:600}.item-main strong.done[data-v-0cd9686f]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-0cd9686f]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-0cd9686f]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-0cd9686f]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-0cd9686f]{background:transparent;border:0}.check-label[data-v-0cd9686f]{display:flex;align-items:center}.check-line[data-v-0cd9686f]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-0cd9686f]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-0cd9686f]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-0cd9686f]{background:#fff1dc;color:#7a4400}.head-actions[data-v-0cd9686f]{display:flex;gap:8px}.item-row[data-v-0cd9686f]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.hint-inline[data-v-0cd9686f]{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}.helper-inline[data-v-0cd9686f]{margin:8px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.helper-inline code[data-v-0cd9686f]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:2px 6px;border-radius:6px}.check-label input[data-v-0cd9686f]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-0cd9686f]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-0cd9686f]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-0cd9686f]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-0cd9686f]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-0cd9686f],.rel-meter[data-v-0cd9686f]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-0cd9686f]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-0cd9686f]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-0cd9686f]{font-size:12px}.rel-actions[data-v-0cd9686f]{display:flex;gap:4px}.ledger[data-v-0cd9686f]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.user-tools[data-v-0cd9686f]{display:flex;gap:10px;margin-bottom:12px}.user-stage[data-v-0cd9686f]{width:130px;flex:0 0 auto}.rel[data-v-0cd9686f]{cursor:pointer}.rel-chevron[data-v-0cd9686f]{font-size:20px;color:var(--md-on-surface-variant);flex-shrink:0}.detail-head[data-v-0cd9686f]{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}.tabs[data-v-0cd9686f]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.tab[data-v-0cd9686f]{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:600 12.5px/1 inherit;cursor:pointer}.tab[data-v-0cd9686f]:hover{border-color:var(--md-primary)}.tab.active[data-v-0cd9686f]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}.detail-body[data-v-0cd9686f]{display:flex;flex-direction:column;gap:6px}.kv-grid[data-v-0cd9686f]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.kv[data-v-0cd9686f]{background:var(--md-surface-container-low);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:4px}.kv span[data-v-0cd9686f]{font-size:12px;color:var(--md-on-surface-variant)}.kv strong[data-v-0cd9686f]{font-size:20px;font-weight:700}.rel-meter.big[data-v-0cd9686f]{margin:6px 0}.rel-meter.big b[data-v-0cd9686f]{font-size:15px}.mem-text[data-v-0cd9686f]{font-weight:500!important;line-height:1.6}.book[data-v-0cd9686f]{border:1px solid var(--md-outline-variant);border-radius:14px;background:linear-gradient(180deg,var(--md-surface-container-lowest),var(--md-surface-container-low));padding:16px 18px}.book-nav[data-v-0cd9686f]{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.book-date[data-v-0cd9686f]{width:auto;height:34px;flex:0 0 auto}.book-page[data-v-0cd9686f]{min-height:120px;border-top:1px solid var(--md-outline-variant);padding-top:14px}.book-heading[data-v-0cd9686f]{margin:0 0 10px;font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--md-on-surface-variant);letter-spacing:.02em}.book-body[data-v-0cd9686f]{display:flex;flex-direction:column;gap:10px}.book-body p[data-v-0cd9686f]{margin:0;font-size:14px;line-height:1.95;text-indent:2em;color:var(--md-on-surface);white-space:pre-wrap;overflow-wrap:anywhere}.book-empty[data-v-0cd9686f]{margin:0;font-size:13px;color:var(--md-on-surface-variant);font-style:italic}.diary-manual[data-v-0cd9686f]{margin-top:14px;border-top:1px dashed var(--md-outline-variant);padding-top:12px}.feed li[data-v-0cd9686f]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-0cd9686f]{padding:8px 12px}.feed time[data-v-0cd9686f],.timeline time[data-v-0cd9686f]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-0cd9686f]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-0cd9686f]{color:var(--md-success);font-weight:700}.neg[data-v-0cd9686f]{color:var(--md-error);font-weight:700}.policy[data-v-0cd9686f]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-0cd9686f]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-0cd9686f]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-0cd9686f]{margin-top:6px}.audit-card[data-v-0cd9686f]{margin-bottom:var(--space-lg)}.usage-grid[data-v-0cd9686f]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-0cd9686f]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-0cd9686f]{font-size:20px;font-weight:700}.usage-item span[data-v-0cd9686f]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-0cd9686f]{position:relative}.timeline li[data-v-0cd9686f]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-0cd9686f]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-0cd9686f]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-0cd9686f]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-0cd9686f]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-0cd9686f]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-0cd9686f]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-0cd9686f]{font-size:13.5px;font-weight:650}.tl-detail[data-v-0cd9686f]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-0cd9686f]{grid-template-columns:repeat(2,1fr)}.grid[data-v-0cd9686f],.agenda-form[data-v-0cd9686f]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-0cd9686f]{padding:var(--space-lg)}.header-actions[data-v-0cd9686f]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
