import { defineComponent as ct, ref as u, computed as H, onMounted as pt, openBlock as n, createElementBlock as o, createElementVNode as t, toDisplayString as a, createCommentVNode as r, createStaticVNode as B, normalizeClass as $, withModifiers as S, withDirectives as _, vModelText as g, Fragment as c, renderList as m, createTextVNode as f, vModelCheckbox as vt, normalizeStyle as _t } from "vue";
import { u as mt, _ as ht } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const gt = { class: "page" }, bt = { class: "page-inner" }, ft = { class: "page-header" }, yt = { class: "header-actions" }, kt = ["disabled"], wt = ["disabled"], Ct = {
  key: 0,
  class: "error-banner"
}, jt = {
  key: 1,
  class: "notice"
}, xt = { class: "stat-grid" }, $t = { class: "stat-card" }, Lt = { class: "stat-value" }, Mt = { class: "stat-card" }, St = { class: "stat-value" }, Et = { class: "stat-card" }, Ft = { class: "stat-value" }, Nt = { class: "stat-hint" }, Vt = { class: "stat-card" }, Tt = { class: "stat-value" }, Ut = { class: "life-state" }, It = { class: "state-pill" }, Dt = {
  key: 0,
  class: "state-pill"
}, Ot = { class: "group" }, Pt = { class: "grid" }, Yt = { class: "card" }, At = { class: "item-list" }, Bt = { class: "item-main" }, Jt = { class: "item-meta" }, zt = { class: "item-actions" }, Ht = ["onClick"], qt = ["onClick"], Gt = {
  key: 0,
  class: "list-empty"
}, Rt = { class: "item-list" }, Wt = { class: "check-label" }, Kt = ["checked", "onChange"], Qt = { class: "item-main" }, Xt = { class: "item-meta" }, Zt = {
  key: 0,
  class: "list-empty"
}, te = { class: "card" }, ee = { class: "card-head" }, se = { class: "chip muted" }, ae = { class: "check-line" }, le = ["disabled"], ne = { class: "item-list" }, oe = { class: "item-main" }, ie = { class: "item-meta" }, de = { class: "item-actions" }, re = ["onClick"], ue = {
  key: 0,
  class: "list-empty"
}, ce = { class: "card" }, pe = { class: "card-head" }, ve = { class: "head-actions" }, _e = ["disabled"], me = { class: "feed" }, he = {
  key: 0,
  class: "list-empty plain"
}, ge = { class: "card" }, be = { class: "card-head" }, fe = { class: "head-actions" }, ye = ["disabled"], ke = { class: "feed" }, we = {
  key: 0,
  class: "list-empty plain"
}, Ce = { class: "group" }, je = { class: "grid" }, xe = { class: "card" }, $e = { class: "card-head" }, Le = { class: "rel-list" }, Me = { class: "avatar" }, Se = { class: "rel-main" }, Ee = { class: "rel-top" }, Fe = { class: "chip" }, Ne = { class: "rel-meter" }, Ve = { class: "meter-bar" }, Te = { class: "item-meta" }, Ue = { class: "rel-actions" }, Ie = ["onClick"], De = ["onClick"], Oe = {
  key: 0,
  class: "list-empty"
}, Pe = {
  key: 0,
  class: "ledger"
}, Ye = { class: "section-label" }, Ae = { class: "feed" }, Be = {
  key: 0,
  class: "list-empty plain"
}, Je = { class: "card" }, ze = { class: "item-list" }, He = { class: "item-main" }, qe = { class: "item-meta" }, Ge = { class: "chip" }, Re = {
  key: 0,
  class: "list-empty"
}, We = { class: "group" }, Ke = { class: "grid" }, Qe = { class: "card" }, Xe = { class: "card-head" }, Ze = { class: "chip muted" }, ts = { class: "toolbar-inline" }, es = ["disabled"], ss = ["disabled"], as = { class: "item-list" }, ls = { class: "item-main" }, ns = { class: "item-meta" }, os = { class: "item-meta" }, is = { class: "item-actions" }, ds = ["onClick"], rs = {
  key: 0,
  class: "list-empty"
}, us = { class: "policy" }, cs = { class: "select" }, ps = { class: "select" }, vs = { class: "feed" }, _s = {
  key: 0,
  class: "list-empty plain"
}, ms = { class: "group" }, hs = { class: "grid" }, gs = { class: "card" }, bs = { class: "card-head" }, fs = { class: "chip muted" }, ys = { class: "item-list" }, ks = { class: "item-main" }, ws = { class: "item-meta" }, Cs = {
  key: 0,
  class: "group-detail"
}, js = {
  key: 0,
  class: "topics"
}, xs = { class: "feed compact" }, $s = { class: "item-actions" }, Ls = ["onClick"], Ms = {
  key: 0,
  class: "list-empty"
}, Ss = { class: "group" }, Es = { class: "grid" }, Fs = { class: "card audit-card" }, Ns = { class: "card-head" }, Vs = { class: "chip muted" }, Ts = { class: "usage-grid" }, Us = { class: "usage-item" }, Is = { class: "usage-item" }, Ds = { class: "usage-item" }, Os = { class: "item-list" }, Ps = { class: "item-main" }, Ys = { class: "item-meta" }, As = {
  key: 0,
  class: "list-empty"
}, Bs = { class: "card audit-card" }, Js = { class: "card-head" }, zs = { class: "timeline" }, Hs = { class: "tl-body" }, qs = { class: "tl-head" }, Gs = { class: "item-meta" }, Rs = { class: "tl-detail" }, Ws = {
  key: 0,
  class: "list-empty plain"
}, Ks = /* @__PURE__ */ ct({
  __name: "CompanionPage",
  setup(Qs) {
    const { confirm: K } = mt(), i = u({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), E = u(!1), y = u(""), L = u(""), M = u(""), F = u(""), N = u(""), V = u(""), T = u(""), U = u(!1), I = u(""), p = u({ target: "", motive: "", content: "", preferred_at: "" }), C = u({ daily_limit: 6, per_target_limit: 2 }), D = H(() => Object.entries(i.value.groups || {})), O = H(() => (i.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), J = H(() => i.value.proactive?.receipts || []);
    function b(l) {
      L.value = l, setTimeout(() => {
        L.value === l && (L.value = "");
      }, 2e3);
    }
    const k = u(null);
    async function Q() {
      try {
        const l = await fetch("/api/usage");
        l.ok && (k.value = await l.json());
      } catch {
      }
    }
    async function j() {
      E.value = !0, y.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        i.value = await l.json();
      } catch (l) {
        y.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        E.value = !1;
      }
      Q();
    }
    async function v(l, s) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: s }) });
        if (!e.ok) throw Error(await e.text());
        return await j(), await e.json().catch(() => ({}));
      } catch (e) {
        return y.value = e?.message || "操作失败", null;
      }
    }
    async function X() {
      M.value.trim() && (await v("add_agenda", { title: M.value, when: F.value, detail: N.value }), M.value = "", F.value = "", N.value = "");
    }
    async function q(l, s) {
      s.trim() && (await v(l, { content: s }), l === "journal" ? V.value = "" : T.value = "");
    }
    function Z(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    async function G(l, s) {
      await v("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: s }) && b(`已调整 ${l}`);
    }
    async function tt() {
      if (!p.value.target.trim() || !p.value.content.trim()) return;
      await v("proactive_create", { ...p.value }) && (p.value = { target: "", motive: "", content: "", preferred_at: "" }, b("已创建主动候选"));
    }
    async function et(l) {
      await v("proactive_cancel", { id: l, reason: "dashboard_cancel" }), b("已取消候选");
    }
    async function st() {
      await v("proactive_policy", { daily_limit: Number(C.value.daily_limit), per_target_limit: Number(C.value.per_target_limit) }), b("策略已保存");
    }
    const x = u("");
    async function R(l) {
      x.value = l;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        await j(), b("已由 LIFE 生成");
      } catch (s) {
        y.value = s?.message || "生成失败";
      } finally {
        x.value = "";
      }
    }
    async function at() {
      const l = p.value.target.trim() || "user:owner";
      await v("proactive_suggest", { target: l, hint: p.value.motive }) && (p.value = { target: "", motive: "", content: "", preferred_at: "" }, b("已生成建议候选"));
    }
    const P = u(!1);
    async function lt() {
      P.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await j(), b(s?.skipped ? `本次跳过：${s.skipped}` : `已投递 ${s.delivered || 0} 条 · 拦截 ${s.blocked || 0} 条`);
      } catch (l) {
        y.value = l?.message || "投递失败";
      } finally {
        P.value = !1;
      }
    }
    const Y = u(!1);
    async function nt() {
      Y.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const s = await l.json();
        await j();
        const e = s?.applied;
        b(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (l) {
        y.value = l?.message || "规划失败";
      } finally {
        Y.value = !1;
      }
    }
    function z(l) {
      const s = (l || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let d = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? (d = new Date(s), d.setHours(0, 0, 0, 0), d < e && d.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(s) && (d = new Date(e.getFullYear(), Number(s.slice(0, 2)) - 1, Number(s.slice(3, 5))), d < e && d.setFullYear(e.getFullYear() + 1)), !d || Number.isNaN(d.getTime()) ? null : Math.round((d.getTime() - e.getTime()) / 864e5);
    }
    const h = u({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function ot() {
      !h.value.title.trim() || !h.value.date.trim() || (await v("date_add", { ...h.value }), h.value = { title: "", date: "", repeat_yearly: !0, note: "" }, b("已添加重要日期"));
    }
    async function it(l) {
      await v("date_delete", { id: l }), b("已删除");
    }
    async function dt() {
      await v("circadian_eat", { amount: 45 }), b("已用餐");
    }
    async function rt() {
      const l = await v("daily_agenda", {});
      b(l?.created ? `LIFE 已安排 ${l.created} 项活动` : "今天已有安排");
    }
    async function W(l) {
      await K({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await v("journal_clear", { kind: l }), b("已清除"));
    }
    function A(l) {
      if (!l) return "";
      const s = new Date(l);
      return Number.isNaN(s.getTime()) ? l : s.toLocaleString();
    }
    return pt(j), (l, s) => (n(), o("main", gt, [
      t("div", bt, [
        t("header", ft, [
          s[23] || (s[23] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", yt, [
            t("button", {
              class: "btn btn-primary",
              disabled: Y.value,
              onClick: nt
            }, a(Y.value ? "规划中…" : "让 LIFE 规划"), 9, kt),
            t("button", {
              class: "btn btn-tonal",
              disabled: E.value,
              onClick: j
            }, a(E.value ? "刷新中…" : "刷新"), 9, wt)
          ])
        ]),
        y.value ? (n(), o("p", Ct, a(y.value), 1)) : r("", !0),
        L.value ? (n(), o("p", jt, a(L.value), 1)) : r("", !0),
        t("section", xt, [
          t("article", $t, [
            s[24] || (s[24] = B('<div class="stat-head" data-v-f5f50d99><span class="icon-badge tone-1" aria-hidden="true" data-v-f5f50d99><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-f5f50d99><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-f5f50d99></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-f5f50d99></path></svg></span><span class="stat-label" data-v-f5f50d99>关系对象</span></div>', 1)),
            t("strong", Lt, a(i.value.relationships?.length || 0), 1),
            s[25] || (s[25] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", Mt, [
            s[26] || (s[26] = B('<div class="stat-head" data-v-f5f50d99><span class="icon-badge tone-2" aria-hidden="true" data-v-f5f50d99><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-f5f50d99><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-f5f50d99></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-f5f50d99></path></svg></span><span class="stat-label" data-v-f5f50d99>活动日程</span></div>', 1)),
            t("strong", St, a(i.value.agenda?.filter((e) => e.status === "active").length || 0), 1),
            s[27] || (s[27] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", Et, [
            s[28] || (s[28] = B('<div class="stat-head" data-v-f5f50d99><span class="icon-badge tone-3" aria-hidden="true" data-v-f5f50d99><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-f5f50d99><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-f5f50d99></path></svg></span><span class="stat-label" data-v-f5f50d99>待投递主动行为</span></div>', 1)),
            t("strong", Ft, a(O.value.length), 1),
            t("span", Nt, "已投递 " + a(J.value.length) + " 次", 1)
          ]),
          t("article", Vt, [
            s[29] || (s[29] = B('<div class="stat-head" data-v-f5f50d99><span class="icon-badge tone-4" aria-hidden="true" data-v-f5f50d99><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-f5f50d99><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-f5f50d99></path></svg></span><span class="stat-label" data-v-f5f50d99>已观察群聊</span></div>', 1)),
            t("strong", Tt, a(D.value.length), 1),
            s[30] || (s[30] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", Ut, [
          t("span", It, "精力 " + a(Math.round(i.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: $(["state-pill", { warn: (i.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + a(Math.round(i.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: $(["state-pill", { warn: (i.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + a(Math.round(i.value.circadian?.health ?? 100)), 3),
          i.value.circadian?.is_sleeping ? (n(), o("span", Dt, "睡眠中")) : r("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: dt
          }, "吃饭")
        ]),
        t("section", Ot, [
          s[41] || (s[41] = t("h2", { class: "group-title" }, "生活", -1)),
          t("div", Pt, [
            t("article", Yt, [
              t("div", { class: "card-head" }, [
                s[31] || (s[31] = t("h2", { class: "card-title" }, "日程", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: rt
                }, "由 LIFE 安排今天")
              ]),
              t("form", {
                class: "agenda-form",
                onSubmit: S(X, ["prevent"])
              }, [
                _(t("input", {
                  "onUpdate:modelValue": s[0] || (s[0] = (e) => M.value = e),
                  class: "input",
                  placeholder: "日程标题",
                  "aria-label": "日程标题"
                }, null, 512), [
                  [g, M.value]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": s[1] || (s[1] = (e) => F.value = e),
                  class: "input",
                  placeholder: "时间，例如 2026-09-25 20:00",
                  "aria-label": "时间"
                }, null, 512), [
                  [g, F.value]
                ]),
                s[32] || (s[32] = t("button", {
                  class: "btn btn-primary",
                  type: "submit"
                }, "创建候选", -1)),
                _(t("textarea", {
                  "onUpdate:modelValue": s[2] || (s[2] = (e) => N.value = e),
                  class: "input area",
                  placeholder: "说明（可选）"
                }, null, 512), [
                  [g, N.value]
                ])
              ], 32),
              s[33] || (s[33] = t("h3", { class: "section-label" }, "待确认候选", -1)),
              t("ul", At, [
                (n(!0), o(c, null, m(i.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", Bt, [
                    t("strong", null, a(e.title), 1),
                    t("span", Jt, a(e.when_text) + " · " + a(e.detail || "等待你确认"), 1)
                  ]),
                  t("div", zt, [
                    t("button", {
                      class: "btn btn-primary btn-sm",
                      onClick: (d) => v("confirm_agenda", { id: e.id })
                    }, "确认", 8, Ht),
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (d) => v("reject_agenda", { id: e.id })
                    }, "拒绝", 8, qt)
                  ])
                ]))), 128)),
                i.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? r("", !0) : (n(), o("li", Gt, "没有待确认的日程候选"))
              ]),
              s[34] || (s[34] = t("h3", { class: "section-label" }, "已确认日程", -1)),
              t("ul", Rt, [
                (n(!0), o(c, null, m(i.value.agenda, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("label", Wt, [
                    t("input", {
                      checked: e.status === "completed",
                      type: "checkbox",
                      onChange: (d) => v("complete_agenda", { id: e.id })
                    }, null, 40, Kt)
                  ]),
                  t("div", Qt, [
                    t("strong", {
                      class: $({ done: e.status === "completed" })
                    }, a(e.title), 3),
                    t("span", Xt, [
                      f(a(e.start_at), 1),
                      e.detail ? (n(), o(c, { key: 0 }, [
                        f(" · " + a(e.detail), 1)
                      ], 64)) : r("", !0)
                    ])
                  ])
                ]))), 128)),
                i.value.agenda?.length ? r("", !0) : (n(), o("li", Zt, "暂无已确认日程"))
              ])
            ]),
            t("article", te, [
              t("div", ee, [
                s[35] || (s[35] = t("h2", { class: "card-title" }, "重要日期", -1)),
                t("span", se, a((i.value.important_dates || []).length), 1)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: S(ot, ["prevent"])
              }, [
                _(t("input", {
                  "onUpdate:modelValue": s[3] || (s[3] = (e) => h.value.title = e),
                  class: "input",
                  placeholder: "名称，如 生日 / 纪念日",
                  "aria-label": "重要日期名称"
                }, null, 512), [
                  [g, h.value.title]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": s[4] || (s[4] = (e) => h.value.date = e),
                  class: "input",
                  placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                  "aria-label": "重要日期"
                }, null, 512), [
                  [g, h.value.date]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": s[5] || (s[5] = (e) => h.value.note = e),
                  class: "input",
                  placeholder: "备注（可选）",
                  "aria-label": "备注"
                }, null, 512), [
                  [g, h.value.note]
                ]),
                t("label", ae, [
                  _(t("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": s[6] || (s[6] = (e) => h.value.repeat_yearly = e)
                  }, null, 512), [
                    [vt, h.value.repeat_yearly]
                  ]),
                  s[36] || (s[36] = f(" 每年重复", -1))
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !h.value.title.trim() || !h.value.date.trim()
                }, "添加", 8, le)
              ], 32),
              t("ul", ne, [
                (n(!0), o(c, null, m(i.value.important_dates, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", oe, [
                    t("strong", null, a(e.title), 1),
                    t("span", ie, [
                      f(a(e.date_text), 1),
                      z(e.date_text) !== null ? (n(), o(c, { key: 0 }, [
                        f(" · " + a(z(e.date_text) === 0 ? "就是今天" : z(e.date_text) + " 天后"), 1)
                      ], 64)) : r("", !0),
                      e.note ? (n(), o(c, { key: 1 }, [
                        f(" · " + a(e.note), 1)
                      ], 64)) : r("", !0)
                    ])
                  ]),
                  t("div", de, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (d) => it(e.id)
                    }, "删除", 8, re)
                  ])
                ]))), 128)),
                i.value.important_dates?.length ? r("", !0) : (n(), o("li", ue, "还没有重要日期，LIFE 会据此规划提醒。"))
              ])
            ]),
            t("article", ce, [
              t("div", pe, [
                s[37] || (s[37] = t("h2", { class: "card-title" }, "日记", -1)),
                t("div", ve, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[7] || (s[7] = (e) => W("journal"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: x.value === "journal",
                    onClick: s[8] || (s[8] = (e) => R("journal"))
                  }, a(x.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, _e)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: s[10] || (s[10] = S((e) => q("journal", V.value), ["prevent"]))
              }, [
                _(t("textarea", {
                  "onUpdate:modelValue": s[9] || (s[9] = (e) => V.value = e),
                  class: "input area",
                  placeholder: "记录 LIFE 的日记…"
                }, null, 512), [
                  [g, V.value]
                ]),
                s[38] || (s[38] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "写入日记", -1))
              ], 32),
              t("ol", me, [
                (n(!0), o(c, null, m(i.value.journal, (e) => (n(), o("li", {
                  key: e.id
                }, [
                  t("time", null, a(e.at), 1),
                  t("p", null, a(e.content), 1)
                ]))), 128)),
                i.value.journal?.length ? r("", !0) : (n(), o("li", he, "还没有日记"))
              ])
            ]),
            t("article", ge, [
              t("div", be, [
                s[39] || (s[39] = t("h2", { class: "card-title" }, "梦境", -1)),
                t("div", fe, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: s[11] || (s[11] = (e) => W("dream"))
                  }, "清除"),
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    disabled: x.value === "dream",
                    onClick: s[12] || (s[12] = (e) => R("dream"))
                  }, a(x.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, ye)
                ])
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: s[14] || (s[14] = S((e) => q("dream", T.value), ["prevent"]))
              }, [
                _(t("textarea", {
                  "onUpdate:modelValue": s[13] || (s[13] = (e) => T.value = e),
                  class: "input area",
                  placeholder: "记录一个梦境或睡眠反思…"
                }, null, 512), [
                  [g, T.value]
                ]),
                s[40] || (s[40] = t("button", {
                  class: "btn btn-tonal",
                  type: "submit"
                }, "记录梦境", -1))
              ], 32),
              t("ol", ke, [
                (n(!0), o(c, null, m(i.value.dreams, (e) => (n(), o("li", {
                  key: e.id
                }, [
                  t("time", null, a(e.at), 1),
                  t("p", null, a(e.content), 1)
                ]))), 128)),
                i.value.dreams?.length ? r("", !0) : (n(), o("li", we, "还没有梦境记录"))
              ])
            ])
          ])
        ]),
        t("section", Ce, [
          s[44] || (s[44] = t("h2", { class: "group-title" }, "关系", -1)),
          t("div", je, [
            t("article", xe, [
              t("div", $e, [
                s[42] || (s[42] = t("h2", { class: "card-title" }, "关系账本", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: s[15] || (s[15] = (e) => U.value = !U.value)
                }, a(U.value ? "隐藏事件" : "查看事件账本"), 1)
              ]),
              t("ul", Le, [
                (n(!0), o(c, null, m(i.value.relationships, (e) => (n(), o("li", {
                  key: e.user_id,
                  class: "rel"
                }, [
                  t("span", Me, a((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                  t("div", Se, [
                    t("div", Ee, [
                      t("strong", null, a(e.user_id), 1),
                      t("span", Fe, a(e.stage), 1)
                    ]),
                    t("div", Ne, [
                      t("div", Ve, [
                        t("i", {
                          style: _t({ width: Z(e.affinity) })
                        }, null, 4)
                      ]),
                      t("b", null, a(Math.round((e.affinity || 0) * 100)) + "%", 1)
                    ]),
                    t("span", Te, "最近互动：" + a(e.last_seen || "暂无"), 1)
                  ]),
                  t("div", Ue, [
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      title: "更亲近",
                      onClick: (d) => G(e.user_id, 0.05)
                    }, "+", 8, Ie),
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      title: "更疏远",
                      onClick: (d) => G(e.user_id, -0.05)
                    }, "−", 8, De)
                  ])
                ]))), 128)),
                i.value.relationships?.length ? r("", !0) : (n(), o("li", Oe, "暂无关系记录"))
              ]),
              U.value ? (n(), o("div", Pe, [
                t("h3", Ye, "事件账本（最近 " + a(i.value.relationship_ledger?.length || 0) + " 条）", 1),
                t("ol", Ae, [
                  (n(!0), o(c, null, m(i.value.relationship_ledger, (e) => (n(), o("li", {
                    key: e.id
                  }, [
                    t("time", null, a(A(e.created_at)), 1),
                    t("p", null, [
                      t("strong", null, a(e.user_id), 1),
                      f(" · " + a(e.event_key) + " ", 1),
                      t("span", {
                        class: $(e.delta >= 0 ? "pos" : "neg")
                      }, a(e.delta >= 0 ? "+" : "") + a(e.delta), 3),
                      f(" · " + a(e.reason) + " (" + a(e.channel) + ")", 1)
                    ])
                  ]))), 128)),
                  i.value.relationship_ledger?.length ? r("", !0) : (n(), o("li", Be, "暂无关系事件"))
                ])
              ])) : r("", !0)
            ]),
            t("article", Je, [
              s[43] || (s[43] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "成长中的性格")
              ], -1)),
              t("ul", ze, [
                (n(!0), o(c, null, m(i.value.persona_evolution, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item trait-item"
                }, [
                  t("div", He, [
                    t("strong", null, a(e.trait), 1),
                    t("span", qe, "支持 " + a(e.support_count) + " 次 · 置信度 " + a(Math.round((e.confidence || 0) * 100)) + "%", 1)
                  ]),
                  t("span", Ge, a(e.value), 1)
                ]))), 128)),
                i.value.persona_evolution?.length ? r("", !0) : (n(), o("li", Re, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
              ])
            ])
          ])
        ]),
        t("section", We, [
          s[51] || (s[51] = t("h2", { class: "group-title" }, "主动行为", -1)),
          t("div", Ke, [
            t("article", Qe, [
              t("div", Xe, [
                s[45] || (s[45] = t("h2", { class: "card-title" }, "主动行为", -1)),
                t("span", Ze, "待投递 " + a(O.value.length), 1)
              ]),
              t("div", ts, [
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: at
                }, "让 LIFE 建议一条"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: P.value,
                  onClick: lt
                }, a(P.value ? "检查中…" : "立即检查投递"), 9, es)
              ]),
              t("form", {
                class: "stack-form",
                onSubmit: S(tt, ["prevent"])
              }, [
                _(t("input", {
                  "onUpdate:modelValue": s[16] || (s[16] = (e) => p.value.target = e),
                  class: "input",
                  placeholder: "对象（user_id / 会话）",
                  "aria-label": "主动对象"
                }, null, 512), [
                  [g, p.value.target]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": s[17] || (s[17] = (e) => p.value.motive = e),
                  class: "input",
                  placeholder: "动机，如 care / reminder",
                  "aria-label": "动机"
                }, null, 512), [
                  [g, p.value.motive]
                ]),
                _(t("input", {
                  "onUpdate:modelValue": s[18] || (s[18] = (e) => p.value.preferred_at = e),
                  class: "input",
                  placeholder: "期望时间（可选，ISO）",
                  "aria-label": "期望时间"
                }, null, 512), [
                  [g, p.value.preferred_at]
                ]),
                _(t("textarea", {
                  "onUpdate:modelValue": s[19] || (s[19] = (e) => p.value.content = e),
                  class: "input area",
                  placeholder: "想说的内容…"
                }, null, 512), [
                  [g, p.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !p.value.target.trim() || !p.value.content.trim()
                }, "创建候选", 8, ss)
              ], 32),
              s[48] || (s[48] = t("h3", { class: "section-label" }, "候选队列", -1)),
              t("ul", as, [
                (n(!0), o(c, null, m(O.value, (e) => (n(), o("li", {
                  key: e.id,
                  class: "item"
                }, [
                  t("div", ls, [
                    t("strong", null, a(e.target) + " · " + a(e.motive), 1),
                    t("span", ns, a(e.content), 1),
                    t("span", os, "状态 " + a(e.status) + " · " + a(A(e.created_at)), 1)
                  ]),
                  t("div", is, [
                    t("button", {
                      class: "btn btn-danger btn-sm",
                      onClick: (d) => et(e.id)
                    }, "取消", 8, ds)
                  ])
                ]))), 128)),
                O.value.length ? r("", !0) : (n(), o("li", rs, "没有待投递候选"))
              ]),
              s[49] || (s[49] = t("h3", { class: "section-label" }, "配额策略", -1)),
              t("div", us, [
                t("label", cs, [
                  s[46] || (s[46] = t("span", null, "每日上限", -1)),
                  _(t("input", {
                    "onUpdate:modelValue": s[20] || (s[20] = (e) => C.value.daily_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      g,
                      C.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("label", ps, [
                  s[47] || (s[47] = t("span", null, "单人上限", -1)),
                  _(t("input", {
                    "onUpdate:modelValue": s[21] || (s[21] = (e) => C.value.per_target_limit = e),
                    type: "number",
                    min: "0",
                    class: "input tiny"
                  }, null, 512), [
                    [
                      g,
                      C.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: st
                }, "保存策略")
              ]),
              s[50] || (s[50] = t("h3", { class: "section-label" }, "投递记录", -1)),
              t("ol", vs, [
                (n(!0), o(c, null, m(J.value, (e) => (n(), o("li", {
                  key: e.id
                }, [
                  t("time", null, a(A(e.created_at)), 1),
                  t("p", null, a(e.phase) + " · " + a(e.content), 1)
                ]))), 128)),
                J.value.length ? r("", !0) : (n(), o("li", _s, "还没有主动投递记录"))
              ])
            ])
          ])
        ]),
        t("section", ms, [
          s[53] || (s[53] = t("h2", { class: "group-title" }, "群聊观察", -1)),
          t("div", hs, [
            t("article", gs, [
              t("div", bs, [
                s[52] || (s[52] = t("h2", { class: "card-title" }, "群聊观察", -1)),
                t("span", fs, a(D.value.length), 1)
              ]),
              t("ul", ys, [
                (n(!0), o(c, null, m(D.value, ([e, d]) => (n(), o("li", {
                  key: e,
                  class: "item group-item"
                }, [
                  t("div", ks, [
                    t("strong", null, a(e), 1),
                    t("span", ws, "情绪 " + a(d.mood || "—") + " · " + a(d.messages?.length || 0) + " 条观察 · " + a(d.topics?.length || 0) + " 个话题", 1),
                    I.value === e ? (n(), o("div", Cs, [
                      d.topics?.length ? (n(), o("div", js, [
                        (n(!0), o(c, null, m(d.topics, (w) => (n(), o("span", {
                          key: w.topic,
                          class: "chip muted"
                        }, a(w.topic) + " · " + a(Math.round(w.score)), 1))), 128))
                      ])) : r("", !0),
                      t("ol", xs, [
                        (n(!0), o(c, null, m(d.messages, (w, ut) => (n(), o("li", { key: ut }, [
                          t("time", null, a(A(w.created_at)), 1),
                          t("p", null, [
                            t("strong", null, a(w.user_id), 1),
                            f("：" + a(w.content), 1)
                          ])
                        ]))), 128))
                      ])
                    ])) : r("", !0)
                  ]),
                  t("div", $s, [
                    t("button", {
                      class: "btn btn-tonal btn-sm",
                      onClick: (w) => I.value = I.value === e ? "" : e
                    }, a(I.value === e ? "收起" : "展开"), 9, Ls)
                  ])
                ]))), 128)),
                D.value.length ? r("", !0) : (n(), o("li", Ms, "群聊观察尚未启用或没有消息。"))
              ])
            ])
          ])
        ]),
        t("section", Ss, [
          s[59] || (s[59] = t("h2", { class: "group-title" }, "诊断", -1)),
          t("div", Es, [
            t("article", Fs, [
              t("div", Ns, [
                s[54] || (s[54] = t("h2", { class: "card-title" }, "模型用量", -1)),
                t("span", Vs, a(k.value?.request_count || 0) + " 次请求", 1)
              ]),
              t("div", Ts, [
                t("div", Us, [
                  t("strong", null, a((k.value?.total_tokens || 0).toLocaleString()), 1),
                  s[55] || (s[55] = t("span", null, "总 Token", -1))
                ]),
                t("div", Is, [
                  t("strong", null, a((k.value?.total_prompt_tokens || 0).toLocaleString()), 1),
                  s[56] || (s[56] = t("span", null, "输入", -1))
                ]),
                t("div", Ds, [
                  t("strong", null, a((k.value?.total_completion_tokens || 0).toLocaleString()), 1),
                  s[57] || (s[57] = t("span", null, "输出", -1))
                ])
              ]),
              t("ul", Os, [
                (n(!0), o(c, null, m(k.value?.by_model || {}, (e, d) => (n(), o("li", {
                  key: d,
                  class: "item"
                }, [
                  t("div", Ps, [
                    t("strong", null, a(d), 1),
                    t("span", Ys, a((e.total || 0).toLocaleString()) + " tokens · " + a(e.count) + " 次", 1)
                  ])
                ]))), 128)),
                !k.value || !Object.keys(k.value.by_model || {}).length ? (n(), o("li", As, "暂无用量记录")) : r("", !0)
              ])
            ]),
            t("article", Bs, [
              t("div", Js, [
                s[58] || (s[58] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  onClick: s[22] || (s[22] = (e) => v("memory_maintenance", {}))
                }, "执行记忆维护与备份")
              ]),
              t("ol", zs, [
                (n(!0), o(c, null, m(i.value.audit, (e) => (n(), o("li", {
                  key: e.at + e.kind
                }, [
                  t("span", {
                    class: $(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                    "aria-hidden": "true"
                  }, null, 2),
                  t("div", Hs, [
                    t("div", qs, [
                      t("strong", null, a(e.kind), 1),
                      t("span", {
                        class: $(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                      }, a(e.outcome), 3),
                      t("time", null, a(e.at), 1)
                    ]),
                    t("p", Gs, a(e.target), 1),
                    t("p", Rs, a(e.detail), 1)
                  ])
                ]))), 128)),
                i.value.audit?.length ? r("", !0) : (n(), o("li", Ws, "暂无审计记录"))
              ])
            ])
          ])
        ])
      ])
    ]));
  }
}), ta = /* @__PURE__ */ ht(Ks, [["__scopeId", "data-v-f5f50d99"]]);
export {
  ta as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-f5f50d99]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-f5f50d99]{max-width:1180px;margin:0 auto}.page-header[data-v-f5f50d99]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-f5f50d99]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-f5f50d99]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-f5f50d99]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-f5f50d99]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-f5f50d99]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-f5f50d99]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-f5f50d99]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-f5f50d99]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-f5f50d99]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-f5f50d99]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-f5f50d99]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-f5f50d99]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-f5f50d99]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-f5f50d99]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-f5f50d99]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-f5f50d99]{display:flex;align-items:center;gap:10px}.stat-label[data-v-f5f50d99]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-f5f50d99]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-f5f50d99]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-f5f50d99]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-f5f50d99]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-f5f50d99]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-f5f50d99]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-f5f50d99]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-f5f50d99]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.group[data-v-f5f50d99]{margin-bottom:var(--space-lg)}.group-title[data-v-f5f50d99]{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.group .grid[data-v-f5f50d99]{margin-bottom:0}.card[data-v-f5f50d99]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-f5f50d99]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-f5f50d99]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-f5f50d99]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-f5f50d99]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-f5f50d99]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-f5f50d99]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-f5f50d99]{background:#fff1dc;color:#7a4400}.input[data-v-f5f50d99]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-f5f50d99]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-f5f50d99]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-f5f50d99]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-f5f50d99]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-f5f50d99]{grid-column:1/-1}.stack-form[data-v-f5f50d99]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-f5f50d99]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-f5f50d99]{align-self:flex-start}.item-list[data-v-f5f50d99],.rel-list[data-v-f5f50d99],.feed[data-v-f5f50d99],.timeline[data-v-f5f50d99]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-f5f50d99]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-f5f50d99]{align-items:flex-start}.item[data-v-f5f50d99]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-f5f50d99]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-f5f50d99]{font-size:14px;font-weight:600}.item-main strong.done[data-v-f5f50d99]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-f5f50d99]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-f5f50d99]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-f5f50d99]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-f5f50d99]{background:transparent;border:0}.check-label[data-v-f5f50d99]{display:flex;align-items:center}.check-line[data-v-f5f50d99]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-f5f50d99]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-f5f50d99]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-f5f50d99]{background:#fff1dc;color:#7a4400}.head-actions[data-v-f5f50d99]{display:flex;gap:8px}.check-label input[data-v-f5f50d99]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-f5f50d99]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-f5f50d99]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-f5f50d99]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-f5f50d99]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-f5f50d99],.rel-meter[data-v-f5f50d99]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-f5f50d99]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-f5f50d99]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-f5f50d99]{font-size:12px}.rel-actions[data-v-f5f50d99]{display:flex;gap:4px}.ledger[data-v-f5f50d99]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-f5f50d99]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-f5f50d99]{padding:8px 12px}.feed time[data-v-f5f50d99],.timeline time[data-v-f5f50d99]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-f5f50d99]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-f5f50d99]{color:var(--md-success);font-weight:700}.neg[data-v-f5f50d99]{color:var(--md-error);font-weight:700}.policy[data-v-f5f50d99]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-f5f50d99]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-f5f50d99]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-f5f50d99]{margin-top:6px}.audit-card[data-v-f5f50d99]{margin-bottom:var(--space-lg)}.usage-grid[data-v-f5f50d99]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-f5f50d99]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-f5f50d99]{font-size:20px;font-weight:700}.usage-item span[data-v-f5f50d99]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-f5f50d99]{position:relative}.timeline li[data-v-f5f50d99]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-f5f50d99]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-f5f50d99]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-f5f50d99]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-f5f50d99]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-f5f50d99]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-f5f50d99]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-f5f50d99]{font-size:13.5px;font-weight:650}.tl-detail[data-v-f5f50d99]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-f5f50d99]{grid-template-columns:repeat(2,1fr)}.grid[data-v-f5f50d99],.agenda-form[data-v-f5f50d99]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-f5f50d99]{padding:var(--space-lg)}.header-actions[data-v-f5f50d99]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
