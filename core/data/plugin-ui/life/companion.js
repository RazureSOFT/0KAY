import { defineComponent as ut, ref as u, computed as H, onMounted as ct, openBlock as n, createElementBlock as i, createElementVNode as t, toDisplayString as s, createCommentVNode as r, createStaticVNode as A, normalizeClass as $, withModifiers as N, withDirectives as _, vModelText as f, Fragment as c, renderList as m, createTextVNode as g, normalizeStyle as pt, vModelCheckbox as vt, createVNode as _t } from "vue";
import { _ as mt, u as ht, a as ft } from "./assets/_plugin-vue_export-helper-CihezfpQ.js";
const bt = { class: "page" }, gt = { class: "page-inner" }, yt = { class: "page-header" }, kt = { class: "header-actions" }, wt = ["disabled"], Ct = ["disabled"], jt = {
  key: 0,
  class: "error-banner"
}, xt = {
  key: 1,
  class: "notice"
}, $t = { class: "stat-grid" }, Mt = { class: "stat-card" }, Lt = { class: "stat-value" }, Nt = { class: "stat-card" }, St = { class: "stat-value" }, Vt = { class: "stat-card" }, Et = { class: "stat-value" }, Ft = { class: "stat-hint" }, Tt = { class: "stat-card" }, Ut = { class: "stat-value" }, Dt = { class: "life-state" }, It = { class: "state-pill" }, Ot = {
  key: 0,
  class: "state-pill"
}, Pt = { class: "grid" }, Yt = { class: "card" }, Bt = { class: "item-list" }, At = { class: "item-main" }, Jt = { class: "item-meta" }, zt = { class: "item-actions" }, Ht = ["onClick"], qt = ["onClick"], Gt = {
  key: 0,
  class: "list-empty"
}, Rt = { class: "item-list" }, Wt = { class: "check-label" }, Kt = ["checked", "onChange"], Qt = { class: "item-main" }, Xt = { class: "item-meta" }, Zt = {
  key: 0,
  class: "list-empty"
}, te = { class: "card" }, ee = { class: "card-head" }, ae = { class: "rel-list" }, se = { class: "avatar" }, le = { class: "rel-main" }, ne = { class: "rel-top" }, ie = { class: "chip" }, oe = { class: "rel-meter" }, de = { class: "meter-bar" }, re = { class: "item-meta" }, ue = { class: "rel-actions" }, ce = ["onClick"], pe = ["onClick"], ve = {
  key: 0,
  class: "list-empty"
}, _e = {
  key: 0,
  class: "ledger"
}, me = { class: "section-label" }, he = { class: "feed" }, fe = {
  key: 0,
  class: "list-empty plain"
}, be = { class: "card" }, ge = { class: "card-head" }, ye = { class: "chip muted" }, ke = { class: "toolbar-inline" }, we = ["disabled"], Ce = ["disabled"], je = { class: "item-list" }, xe = { class: "item-main" }, $e = { class: "item-meta" }, Me = { class: "item-meta" }, Le = { class: "item-actions" }, Ne = ["onClick"], Se = {
  key: 0,
  class: "list-empty"
}, Ve = { class: "policy" }, Ee = { class: "select" }, Fe = { class: "select" }, Te = { class: "feed" }, Ue = {
  key: 0,
  class: "list-empty plain"
}, De = { class: "card" }, Ie = { class: "card-head" }, Oe = { class: "chip muted" }, Pe = { class: "check-line" }, Ye = ["disabled"], Be = { class: "item-list" }, Ae = { class: "item-main" }, Je = { class: "item-meta" }, ze = { class: "item-actions" }, He = ["onClick"], qe = {
  key: 0,
  class: "list-empty"
}, Ge = { class: "card" }, Re = { class: "item-list" }, We = { class: "item-main" }, Ke = { class: "item-meta" }, Qe = { class: "chip" }, Xe = {
  key: 0,
  class: "list-empty"
}, Ze = { class: "card" }, ta = { class: "card-head" }, ea = { class: "chip muted" }, aa = { class: "item-list" }, sa = { class: "item-main" }, la = { class: "item-meta" }, na = {
  key: 0,
  class: "group-detail"
}, ia = {
  key: 0,
  class: "topics"
}, oa = { class: "feed compact" }, da = { class: "item-actions" }, ra = ["onClick"], ua = {
  key: 0,
  class: "list-empty"
}, ca = { class: "card" }, pa = { class: "card-head" }, va = { class: "head-actions" }, _a = ["disabled"], ma = { class: "feed" }, ha = {
  key: 0,
  class: "list-empty plain"
}, fa = { class: "card" }, ba = { class: "card-head" }, ga = { class: "head-actions" }, ya = ["disabled"], ka = { class: "feed" }, wa = {
  key: 0,
  class: "list-empty plain"
}, Ca = { class: "card audit-card" }, ja = { class: "card-head" }, xa = { class: "chip muted" }, $a = { class: "usage-grid" }, Ma = { class: "usage-item" }, La = { class: "usage-item" }, Na = { class: "usage-item" }, Sa = { class: "item-list" }, Va = { class: "item-main" }, Ea = { class: "item-meta" }, Fa = {
  key: 0,
  class: "list-empty"
}, Ta = { class: "card audit-card" }, Ua = { class: "card-head" }, Da = { class: "timeline" }, Ia = { class: "tl-body" }, Oa = { class: "tl-head" }, Pa = { class: "item-meta" }, Ya = { class: "tl-detail" }, Ba = {
  key: 0,
  class: "list-empty plain"
}, Aa = /* @__PURE__ */ ut({
  __name: "CompanionPage",
  setup(Ja) {
    const { confirm: K } = ht(), o = u({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), S = u(!1), y = u(""), M = u(""), L = u(""), V = u(""), E = u(""), F = u(""), T = u(""), U = u(!1), D = u(""), p = u({ target: "", motive: "", content: "", preferred_at: "" }), C = u({ daily_limit: 6, per_target_limit: 2 }), I = H(() => Object.entries(o.value.groups || {})), O = H(() => (o.value.proactive?.candidates || []).filter((l) => !["delivered", "cancelled"].includes(l.status))), J = H(() => o.value.proactive?.receipts || []);
    function b(l) {
      M.value = l, setTimeout(() => {
        M.value === l && (M.value = "");
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
      S.value = !0, y.value = "";
      try {
        const l = await fetch("/api/life/companion");
        if (!l.ok) throw Error(String(l.status));
        o.value = await l.json();
      } catch (l) {
        y.value = l?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        S.value = !1;
      }
      Q();
    }
    async function v(l, a) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l, payload: a }) });
        if (!e.ok) throw Error(await e.text());
        return await j(), await e.json().catch(() => ({}));
      } catch (e) {
        return y.value = e?.message || "操作失败", null;
      }
    }
    async function X() {
      L.value.trim() && (await v("add_agenda", { title: L.value, when: V.value, detail: E.value }), L.value = "", V.value = "", E.value = "");
    }
    async function q(l, a) {
      a.trim() && (await v(l, { content: a }), l === "journal" ? F.value = "" : T.value = "");
    }
    function Z(l) {
      return `${Math.round(Math.max(0, Math.min(1, l || 0)) * 100)}%`;
    }
    async function G(l, a) {
      await v("relationship_adjust", { user_id: l, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: a }) && b(`已调整 ${l}`);
    }
    async function tt() {
      if (!p.value.target.trim() || !p.value.content.trim()) return;
      await v("proactive_create", { ...p.value }) && (p.value = { target: "", motive: "", content: "", preferred_at: "" }, b("已创建主动候选"));
    }
    async function et(l) {
      await v("proactive_cancel", { id: l, reason: "dashboard_cancel" }), b("已取消候选");
    }
    async function at() {
      await v("proactive_policy", { daily_limit: Number(C.value.daily_limit), per_target_limit: Number(C.value.per_target_limit) }), b("策略已保存");
    }
    const x = u("");
    async function R(l) {
      x.value = l;
      try {
        const a = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: l === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!a.ok) throw Error(await a.text());
        await j(), b("已由 LIFE 生成");
      } catch (a) {
        y.value = a?.message || "生成失败";
      } finally {
        x.value = "";
      }
    }
    async function st() {
      const l = p.value.target.trim() || "user:owner";
      await v("proactive_suggest", { target: l, hint: p.value.motive }) && (p.value = { target: "", motive: "", content: "", preferred_at: "" }, b("已生成建议候选"));
    }
    const P = u(!1);
    async function lt() {
      P.value = !0;
      try {
        const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!l.ok) throw Error(await l.text());
        const a = await l.json();
        await j(), b(a?.skipped ? `本次跳过：${a.skipped}` : `已投递 ${a.delivered || 0} 条 · 拦截 ${a.blocked || 0} 条`);
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
        const a = await l.json();
        await j();
        const e = a?.applied;
        b(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (l) {
        y.value = l?.message || "规划失败";
      } finally {
        Y.value = !1;
      }
    }
    function z(l) {
      const a = (l || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let d = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(a) ? (d = new Date(a), d.setHours(0, 0, 0, 0), d < e && d.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(a) && (d = new Date(e.getFullYear(), Number(a.slice(0, 2)) - 1, Number(a.slice(3, 5))), d < e && d.setFullYear(e.getFullYear() + 1)), !d || Number.isNaN(d.getTime()) ? null : Math.round((d.getTime() - e.getTime()) / 864e5);
    }
    const h = u({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function it() {
      !h.value.title.trim() || !h.value.date.trim() || (await v("date_add", { ...h.value }), h.value = { title: "", date: "", repeat_yearly: !0, note: "" }, b("已添加重要日期"));
    }
    async function ot(l) {
      await v("date_delete", { id: l }), b("已删除");
    }
    async function dt() {
      await v("circadian_eat", { amount: 45 }), b("已用餐");
    }
    async function W(l) {
      await K({ title: l === "dream" ? "清除梦境" : "清除日记", message: "将删除全部该类型记录，无法恢复。", confirmLabel: "清除", danger: !0 }) && (await v("journal_clear", { kind: l }), b("已清除"));
    }
    function B(l) {
      if (!l) return "";
      const a = new Date(l);
      return Number.isNaN(a.getTime()) ? l : a.toLocaleString();
    }
    return ct(j), (l, a) => (n(), i("main", bt, [
      t("div", gt, [
        t("header", yt, [
          a[23] || (a[23] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", kt, [
            t("button", {
              class: "btn btn-primary",
              disabled: Y.value,
              onClick: nt
            }, s(Y.value ? "规划中…" : "让 LIFE 规划"), 9, wt),
            t("button", {
              class: "btn btn-tonal",
              disabled: S.value,
              onClick: j
            }, s(S.value ? "刷新中…" : "刷新"), 9, Ct)
          ])
        ]),
        y.value ? (n(), i("p", jt, s(y.value), 1)) : r("", !0),
        M.value ? (n(), i("p", xt, s(M.value), 1)) : r("", !0),
        t("section", $t, [
          t("article", Mt, [
            a[24] || (a[24] = A('<div class="stat-head" data-v-bff6ffa9><span class="icon-badge tone-1" aria-hidden="true" data-v-bff6ffa9><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-bff6ffa9><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-bff6ffa9></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-bff6ffa9></path></svg></span><span class="stat-label" data-v-bff6ffa9>关系对象</span></div>', 1)),
            t("strong", Lt, s(o.value.relationships?.length || 0), 1),
            a[25] || (a[25] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", Nt, [
            a[26] || (a[26] = A('<div class="stat-head" data-v-bff6ffa9><span class="icon-badge tone-2" aria-hidden="true" data-v-bff6ffa9><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-bff6ffa9><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-bff6ffa9></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-bff6ffa9></path></svg></span><span class="stat-label" data-v-bff6ffa9>活动日程</span></div>', 1)),
            t("strong", St, s(o.value.agenda?.filter((e) => e.status === "active").length || 0), 1),
            a[27] || (a[27] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", Vt, [
            a[28] || (a[28] = A('<div class="stat-head" data-v-bff6ffa9><span class="icon-badge tone-3" aria-hidden="true" data-v-bff6ffa9><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-bff6ffa9><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-bff6ffa9></path></svg></span><span class="stat-label" data-v-bff6ffa9>待投递主动行为</span></div>', 1)),
            t("strong", Et, s(O.value.length), 1),
            t("span", Ft, "已投递 " + s(J.value.length) + " 次", 1)
          ]),
          t("article", Tt, [
            a[29] || (a[29] = A('<div class="stat-head" data-v-bff6ffa9><span class="icon-badge tone-4" aria-hidden="true" data-v-bff6ffa9><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-bff6ffa9><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-bff6ffa9></path></svg></span><span class="stat-label" data-v-bff6ffa9>已观察群聊</span></div>', 1)),
            t("strong", Ut, s(I.value.length), 1),
            a[30] || (a[30] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", Dt, [
          t("span", It, "精力 " + s(Math.round(o.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: $(["state-pill", { warn: (o.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + s(Math.round(o.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: $(["state-pill", { warn: (o.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + s(Math.round(o.value.circadian?.health ?? 100)), 3),
          o.value.circadian?.is_sleeping ? (n(), i("span", Ot, "睡眠中")) : r("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: dt
          }, "吃饭")
        ]),
        t("section", Pt, [
          t("article", Yt, [
            a[32] || (a[32] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "日程")
            ], -1)),
            t("form", {
              class: "agenda-form",
              onSubmit: N(X, ["prevent"])
            }, [
              _(t("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (e) => L.value = e),
                class: "input",
                placeholder: "日程标题",
                "aria-label": "日程标题"
              }, null, 512), [
                [f, L.value]
              ]),
              _(t("input", {
                "onUpdate:modelValue": a[1] || (a[1] = (e) => V.value = e),
                class: "input",
                placeholder: "时间，例如 2026-09-25 20:00",
                "aria-label": "时间"
              }, null, 512), [
                [f, V.value]
              ]),
              a[31] || (a[31] = t("button", {
                class: "btn btn-primary",
                type: "submit"
              }, "创建候选", -1)),
              _(t("textarea", {
                "onUpdate:modelValue": a[2] || (a[2] = (e) => E.value = e),
                class: "input area",
                placeholder: "说明（可选）"
              }, null, 512), [
                [f, E.value]
              ])
            ], 32),
            a[33] || (a[33] = t("h3", { class: "section-label" }, "待确认候选", -1)),
            t("ul", Bt, [
              (n(!0), i(c, null, m(o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (n(), i("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", At, [
                  t("strong", null, s(e.title), 1),
                  t("span", Jt, s(e.when_text) + " · " + s(e.detail || "等待你确认"), 1)
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
              o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? r("", !0) : (n(), i("li", Gt, "没有待确认的日程候选"))
            ]),
            a[34] || (a[34] = t("h3", { class: "section-label" }, "已确认日程", -1)),
            t("ul", Rt, [
              (n(!0), i(c, null, m(o.value.agenda, (e) => (n(), i("li", {
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
                  }, s(e.title), 3),
                  t("span", Xt, [
                    g(s(e.start_at), 1),
                    e.detail ? (n(), i(c, { key: 0 }, [
                      g(" · " + s(e.detail), 1)
                    ], 64)) : r("", !0)
                  ])
                ])
              ]))), 128)),
              o.value.agenda?.length ? r("", !0) : (n(), i("li", Zt, "暂无已确认日程"))
            ])
          ]),
          t("article", te, [
            t("div", ee, [
              a[35] || (a[35] = t("h2", { class: "card-title" }, "关系账本", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: a[3] || (a[3] = (e) => U.value = !U.value)
              }, s(U.value ? "隐藏事件" : "查看事件账本"), 1)
            ]),
            t("ul", ae, [
              (n(!0), i(c, null, m(o.value.relationships, (e) => (n(), i("li", {
                key: e.user_id,
                class: "rel"
              }, [
                t("span", se, s((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                t("div", le, [
                  t("div", ne, [
                    t("strong", null, s(e.user_id), 1),
                    t("span", ie, s(e.stage), 1)
                  ]),
                  t("div", oe, [
                    t("div", de, [
                      t("i", {
                        style: pt({ width: Z(e.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, s(Math.round((e.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("span", re, "最近互动：" + s(e.last_seen || "暂无"), 1)
                ]),
                t("div", ue, [
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更亲近",
                    onClick: (d) => G(e.user_id, 0.05)
                  }, "+", 8, ce),
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更疏远",
                    onClick: (d) => G(e.user_id, -0.05)
                  }, "−", 8, pe)
                ])
              ]))), 128)),
              o.value.relationships?.length ? r("", !0) : (n(), i("li", ve, "暂无关系记录"))
            ]),
            U.value ? (n(), i("div", _e, [
              t("h3", me, "事件账本（最近 " + s(o.value.relationship_ledger?.length || 0) + " 条）", 1),
              t("ol", he, [
                (n(!0), i(c, null, m(o.value.relationship_ledger, (e) => (n(), i("li", {
                  key: e.id
                }, [
                  t("time", null, s(B(e.created_at)), 1),
                  t("p", null, [
                    t("strong", null, s(e.user_id), 1),
                    g(" · " + s(e.event_key) + " ", 1),
                    t("span", {
                      class: $(e.delta >= 0 ? "pos" : "neg")
                    }, s(e.delta >= 0 ? "+" : "") + s(e.delta), 3),
                    g(" · " + s(e.reason) + " (" + s(e.channel) + ")", 1)
                  ])
                ]))), 128)),
                o.value.relationship_ledger?.length ? r("", !0) : (n(), i("li", fe, "暂无关系事件"))
              ])
            ])) : r("", !0)
          ]),
          t("article", be, [
            t("div", ge, [
              a[36] || (a[36] = t("h2", { class: "card-title" }, "主动行为", -1)),
              t("span", ye, "待投递 " + s(O.value.length), 1)
            ]),
            t("div", ke, [
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: st
              }, "让 LIFE 建议一条"),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: P.value,
                onClick: lt
              }, s(P.value ? "检查中…" : "立即检查投递"), 9, we)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: N(tt, ["prevent"])
            }, [
              _(t("input", {
                "onUpdate:modelValue": a[4] || (a[4] = (e) => p.value.target = e),
                class: "input",
                placeholder: "对象（user_id / 会话）",
                "aria-label": "主动对象"
              }, null, 512), [
                [f, p.value.target]
              ]),
              _(t("input", {
                "onUpdate:modelValue": a[5] || (a[5] = (e) => p.value.motive = e),
                class: "input",
                placeholder: "动机，如 care / reminder",
                "aria-label": "动机"
              }, null, 512), [
                [f, p.value.motive]
              ]),
              _(t("input", {
                "onUpdate:modelValue": a[6] || (a[6] = (e) => p.value.preferred_at = e),
                class: "input",
                placeholder: "期望时间（可选，ISO）",
                "aria-label": "期望时间"
              }, null, 512), [
                [f, p.value.preferred_at]
              ]),
              _(t("textarea", {
                "onUpdate:modelValue": a[7] || (a[7] = (e) => p.value.content = e),
                class: "input area",
                placeholder: "想说的内容…"
              }, null, 512), [
                [f, p.value.content]
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !p.value.target.trim() || !p.value.content.trim()
              }, "创建候选", 8, Ce)
            ], 32),
            a[39] || (a[39] = t("h3", { class: "section-label" }, "候选队列", -1)),
            t("ul", je, [
              (n(!0), i(c, null, m(O.value, (e) => (n(), i("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", xe, [
                  t("strong", null, s(e.target) + " · " + s(e.motive), 1),
                  t("span", $e, s(e.content), 1),
                  t("span", Me, "状态 " + s(e.status) + " · " + s(B(e.created_at)), 1)
                ]),
                t("div", Le, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => et(e.id)
                  }, "取消", 8, Ne)
                ])
              ]))), 128)),
              O.value.length ? r("", !0) : (n(), i("li", Se, "没有待投递候选"))
            ]),
            a[40] || (a[40] = t("h3", { class: "section-label" }, "配额策略", -1)),
            t("div", Ve, [
              t("label", Ee, [
                a[37] || (a[37] = t("span", null, "每日上限", -1)),
                _(t("input", {
                  "onUpdate:modelValue": a[8] || (a[8] = (e) => C.value.daily_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    f,
                    C.value.daily_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("label", Fe, [
                a[38] || (a[38] = t("span", null, "单人上限", -1)),
                _(t("input", {
                  "onUpdate:modelValue": a[9] || (a[9] = (e) => C.value.per_target_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    f,
                    C.value.per_target_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: at
              }, "保存策略")
            ]),
            a[41] || (a[41] = t("h3", { class: "section-label" }, "投递记录", -1)),
            t("ol", Te, [
              (n(!0), i(c, null, m(J.value, (e) => (n(), i("li", {
                key: e.id
              }, [
                t("time", null, s(B(e.created_at)), 1),
                t("p", null, s(e.phase) + " · " + s(e.content), 1)
              ]))), 128)),
              J.value.length ? r("", !0) : (n(), i("li", Ue, "还没有主动投递记录"))
            ])
          ]),
          t("article", De, [
            t("div", Ie, [
              a[42] || (a[42] = t("h2", { class: "card-title" }, "重要日期", -1)),
              t("span", Oe, s((o.value.important_dates || []).length), 1)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: N(it, ["prevent"])
            }, [
              _(t("input", {
                "onUpdate:modelValue": a[10] || (a[10] = (e) => h.value.title = e),
                class: "input",
                placeholder: "名称，如 生日 / 纪念日",
                "aria-label": "重要日期名称"
              }, null, 512), [
                [f, h.value.title]
              ]),
              _(t("input", {
                "onUpdate:modelValue": a[11] || (a[11] = (e) => h.value.date = e),
                class: "input",
                placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                "aria-label": "重要日期"
              }, null, 512), [
                [f, h.value.date]
              ]),
              _(t("input", {
                "onUpdate:modelValue": a[12] || (a[12] = (e) => h.value.note = e),
                class: "input",
                placeholder: "备注（可选）",
                "aria-label": "备注"
              }, null, 512), [
                [f, h.value.note]
              ]),
              t("label", Pe, [
                _(t("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": a[13] || (a[13] = (e) => h.value.repeat_yearly = e)
                }, null, 512), [
                  [vt, h.value.repeat_yearly]
                ]),
                a[43] || (a[43] = g(" 每年重复", -1))
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !h.value.title.trim() || !h.value.date.trim()
              }, "添加", 8, Ye)
            ], 32),
            t("ul", Be, [
              (n(!0), i(c, null, m(o.value.important_dates, (e) => (n(), i("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", Ae, [
                  t("strong", null, s(e.title), 1),
                  t("span", Je, [
                    g(s(e.date_text), 1),
                    z(e.date_text) !== null ? (n(), i(c, { key: 0 }, [
                      g(" · " + s(z(e.date_text) === 0 ? "就是今天" : z(e.date_text) + " 天后"), 1)
                    ], 64)) : r("", !0),
                    e.note ? (n(), i(c, { key: 1 }, [
                      g(" · " + s(e.note), 1)
                    ], 64)) : r("", !0)
                  ])
                ]),
                t("div", ze, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => ot(e.id)
                  }, "删除", 8, He)
                ])
              ]))), 128)),
              o.value.important_dates?.length ? r("", !0) : (n(), i("li", qe, "还没有重要日期，LIFE 会据此规划提醒。"))
            ])
          ]),
          t("article", Ge, [
            a[44] || (a[44] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "成长中的性格")
            ], -1)),
            t("ul", Re, [
              (n(!0), i(c, null, m(o.value.persona_evolution, (e) => (n(), i("li", {
                key: e.id,
                class: "item trait-item"
              }, [
                t("div", We, [
                  t("strong", null, s(e.trait), 1),
                  t("span", Ke, "支持 " + s(e.support_count) + " 次 · 置信度 " + s(Math.round((e.confidence || 0) * 100)) + "%", 1)
                ]),
                t("span", Qe, s(e.value), 1)
              ]))), 128)),
              o.value.persona_evolution?.length ? r("", !0) : (n(), i("li", Xe, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
            ])
          ]),
          t("article", Ze, [
            t("div", ta, [
              a[45] || (a[45] = t("h2", { class: "card-title" }, "群聊观察", -1)),
              t("span", ea, s(I.value.length), 1)
            ]),
            t("ul", aa, [
              (n(!0), i(c, null, m(I.value, ([e, d]) => (n(), i("li", {
                key: e,
                class: "item group-item"
              }, [
                t("div", sa, [
                  t("strong", null, s(e), 1),
                  t("span", la, "情绪 " + s(d.mood || "—") + " · " + s(d.messages?.length || 0) + " 条观察 · " + s(d.topics?.length || 0) + " 个话题", 1),
                  D.value === e ? (n(), i("div", na, [
                    d.topics?.length ? (n(), i("div", ia, [
                      (n(!0), i(c, null, m(d.topics, (w) => (n(), i("span", {
                        key: w.topic,
                        class: "chip muted"
                      }, s(w.topic) + " · " + s(Math.round(w.score)), 1))), 128))
                    ])) : r("", !0),
                    t("ol", oa, [
                      (n(!0), i(c, null, m(d.messages, (w, rt) => (n(), i("li", { key: rt }, [
                        t("time", null, s(B(w.created_at)), 1),
                        t("p", null, [
                          t("strong", null, s(w.user_id), 1),
                          g("：" + s(w.content), 1)
                        ])
                      ]))), 128))
                    ])
                  ])) : r("", !0)
                ]),
                t("div", da, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: (w) => D.value = D.value === e ? "" : e
                  }, s(D.value === e ? "收起" : "展开"), 9, ra)
                ])
              ]))), 128)),
              I.value.length ? r("", !0) : (n(), i("li", ua, "群聊观察尚未启用或没有消息。"))
            ])
          ]),
          t("article", ca, [
            t("div", pa, [
              a[46] || (a[46] = t("h2", { class: "card-title" }, "日记", -1)),
              t("div", va, [
                t("button", {
                  class: "btn btn-danger btn-sm",
                  onClick: a[14] || (a[14] = (e) => W("journal"))
                }, "清除"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: x.value === "journal",
                  onClick: a[15] || (a[15] = (e) => R("journal"))
                }, s(x.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, _a)
              ])
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: a[17] || (a[17] = N((e) => q("journal", F.value), ["prevent"]))
            }, [
              _(t("textarea", {
                "onUpdate:modelValue": a[16] || (a[16] = (e) => F.value = e),
                class: "input area",
                placeholder: "记录 LIFE 的日记…"
              }, null, 512), [
                [f, F.value]
              ]),
              a[47] || (a[47] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "写入日记", -1))
            ], 32),
            t("ol", ma, [
              (n(!0), i(c, null, m(o.value.journal, (e) => (n(), i("li", {
                key: e.id
              }, [
                t("time", null, s(e.at), 1),
                t("p", null, s(e.content), 1)
              ]))), 128)),
              o.value.journal?.length ? r("", !0) : (n(), i("li", ha, "还没有日记"))
            ])
          ]),
          t("article", fa, [
            t("div", ba, [
              a[48] || (a[48] = t("h2", { class: "card-title" }, "梦境", -1)),
              t("div", ga, [
                t("button", {
                  class: "btn btn-danger btn-sm",
                  onClick: a[18] || (a[18] = (e) => W("dream"))
                }, "清除"),
                t("button", {
                  class: "btn btn-tonal btn-sm",
                  disabled: x.value === "dream",
                  onClick: a[19] || (a[19] = (e) => R("dream"))
                }, s(x.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, ya)
              ])
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: a[21] || (a[21] = N((e) => q("dream", T.value), ["prevent"]))
            }, [
              _(t("textarea", {
                "onUpdate:modelValue": a[20] || (a[20] = (e) => T.value = e),
                class: "input area",
                placeholder: "记录一个梦境或睡眠反思…"
              }, null, 512), [
                [f, T.value]
              ]),
              a[49] || (a[49] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "记录梦境", -1))
            ], 32),
            t("ol", ka, [
              (n(!0), i(c, null, m(o.value.dreams, (e) => (n(), i("li", {
                key: e.id
              }, [
                t("time", null, s(e.at), 1),
                t("p", null, s(e.content), 1)
              ]))), 128)),
              o.value.dreams?.length ? r("", !0) : (n(), i("li", wa, "还没有梦境记录"))
            ])
          ])
        ]),
        t("article", Ca, [
          t("div", ja, [
            a[50] || (a[50] = t("h2", { class: "card-title" }, "模型用量", -1)),
            t("span", xa, s(k.value?.request_count || 0) + " 次请求", 1)
          ]),
          t("div", $a, [
            t("div", Ma, [
              t("strong", null, s((k.value?.total_tokens || 0).toLocaleString()), 1),
              a[51] || (a[51] = t("span", null, "总 Token", -1))
            ]),
            t("div", La, [
              t("strong", null, s((k.value?.total_prompt_tokens || 0).toLocaleString()), 1),
              a[52] || (a[52] = t("span", null, "输入", -1))
            ]),
            t("div", Na, [
              t("strong", null, s((k.value?.total_completion_tokens || 0).toLocaleString()), 1),
              a[53] || (a[53] = t("span", null, "输出", -1))
            ])
          ]),
          t("ul", Sa, [
            (n(!0), i(c, null, m(k.value?.by_model || {}, (e, d) => (n(), i("li", {
              key: d,
              class: "item"
            }, [
              t("div", Va, [
                t("strong", null, s(d), 1),
                t("span", Ea, s((e.total || 0).toLocaleString()) + " tokens · " + s(e.count) + " 次", 1)
              ])
            ]))), 128)),
            !k.value || !Object.keys(k.value.by_model || {}).length ? (n(), i("li", Fa, "暂无用量记录")) : r("", !0)
          ])
        ]),
        t("article", Ta, [
          t("div", Ua, [
            a[54] || (a[54] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: a[22] || (a[22] = (e) => v("memory_maintenance", {}))
            }, "执行记忆维护与备份")
          ]),
          t("ol", Da, [
            (n(!0), i(c, null, m(o.value.audit, (e) => (n(), i("li", {
              key: e.at + e.kind
            }, [
              t("span", {
                class: $(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                "aria-hidden": "true"
              }, null, 2),
              t("div", Ia, [
                t("div", Oa, [
                  t("strong", null, s(e.kind), 1),
                  t("span", {
                    class: $(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                  }, s(e.outcome), 3),
                  t("time", null, s(e.at), 1)
                ]),
                t("p", Pa, s(e.target), 1),
                t("p", Ya, s(e.detail), 1)
              ])
            ]))), 128)),
            o.value.audit?.length ? r("", !0) : (n(), i("li", Ba, "暂无审计记录"))
          ])
        ])
      ]),
      _t(mt)
    ]));
  }
}), qa = /* @__PURE__ */ ft(Aa, [["__scopeId", "data-v-bff6ffa9"]]);
export {
  qa as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-bff6ffa9]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-bff6ffa9]{max-width:1180px;margin:0 auto}.page-header[data-v-bff6ffa9]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-bff6ffa9]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-bff6ffa9]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-bff6ffa9]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-bff6ffa9]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-bff6ffa9]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-bff6ffa9]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-bff6ffa9]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-bff6ffa9]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-bff6ffa9]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-bff6ffa9]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-bff6ffa9]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-bff6ffa9]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-bff6ffa9]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-bff6ffa9]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-bff6ffa9]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-bff6ffa9]{display:flex;align-items:center;gap:10px}.stat-label[data-v-bff6ffa9]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-bff6ffa9]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-bff6ffa9]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-bff6ffa9]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-bff6ffa9]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-bff6ffa9]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-bff6ffa9]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-bff6ffa9]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-bff6ffa9]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-bff6ffa9]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-bff6ffa9]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-bff6ffa9]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-bff6ffa9]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-bff6ffa9]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-bff6ffa9]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-bff6ffa9]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-bff6ffa9]{background:#fff1dc;color:#7a4400}.input[data-v-bff6ffa9]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-bff6ffa9]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-bff6ffa9]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-bff6ffa9]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-bff6ffa9]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-bff6ffa9]{grid-column:1/-1}.stack-form[data-v-bff6ffa9]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-bff6ffa9]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-bff6ffa9]{align-self:flex-start}.item-list[data-v-bff6ffa9],.rel-list[data-v-bff6ffa9],.feed[data-v-bff6ffa9],.timeline[data-v-bff6ffa9]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-bff6ffa9]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-bff6ffa9]{align-items:flex-start}.item[data-v-bff6ffa9]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-bff6ffa9]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-bff6ffa9]{font-size:14px;font-weight:600}.item-main strong.done[data-v-bff6ffa9]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-bff6ffa9]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-bff6ffa9]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-bff6ffa9]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-bff6ffa9]{background:transparent;border:0}.check-label[data-v-bff6ffa9]{display:flex;align-items:center}.check-line[data-v-bff6ffa9]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-bff6ffa9]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-bff6ffa9]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-bff6ffa9]{background:#fff1dc;color:#7a4400}.head-actions[data-v-bff6ffa9]{display:flex;gap:8px}.check-label input[data-v-bff6ffa9]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-bff6ffa9]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-bff6ffa9]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-bff6ffa9]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-bff6ffa9]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-bff6ffa9],.rel-meter[data-v-bff6ffa9]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-bff6ffa9]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-bff6ffa9]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-bff6ffa9]{font-size:12px}.rel-actions[data-v-bff6ffa9]{display:flex;gap:4px}.ledger[data-v-bff6ffa9]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-bff6ffa9]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-bff6ffa9]{padding:8px 12px}.feed time[data-v-bff6ffa9],.timeline time[data-v-bff6ffa9]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-bff6ffa9]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-bff6ffa9]{color:var(--md-success);font-weight:700}.neg[data-v-bff6ffa9]{color:var(--md-error);font-weight:700}.policy[data-v-bff6ffa9]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-bff6ffa9]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-bff6ffa9]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-bff6ffa9]{margin-top:6px}.audit-card[data-v-bff6ffa9]{margin-bottom:var(--space-lg)}.usage-grid[data-v-bff6ffa9]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-bff6ffa9]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-bff6ffa9]{font-size:20px;font-weight:700}.usage-item span[data-v-bff6ffa9]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-bff6ffa9]{position:relative}.timeline li[data-v-bff6ffa9]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-bff6ffa9]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-bff6ffa9]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-bff6ffa9]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-bff6ffa9]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-bff6ffa9]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-bff6ffa9]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-bff6ffa9]{font-size:13.5px;font-weight:650}.tl-detail[data-v-bff6ffa9]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-bff6ffa9]{grid-template-columns:repeat(2,1fr)}.grid[data-v-bff6ffa9],.agenda-form[data-v-bff6ffa9]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-bff6ffa9]{padding:var(--space-lg)}.header-actions[data-v-bff6ffa9]{padding-top:0}}.page[data-v-d1a7766c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-d1a7766c]{max-width:1180px;margin:0 auto}.page-header[data-v-d1a7766c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-d1a7766c]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-d1a7766c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-d1a7766c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-d1a7766c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-d1a7766c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-d1a7766c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-d1a7766c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-d1a7766c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-d1a7766c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-d1a7766c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-d1a7766c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-d1a7766c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-d1a7766c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-d1a7766c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-d1a7766c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-d1a7766c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-d1a7766c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-d1a7766c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-d1a7766c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-d1a7766c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-d1a7766c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-d1a7766c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-d1a7766c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-d1a7766c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-d1a7766c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-d1a7766c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-d1a7766c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-d1a7766c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-d1a7766c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-d1a7766c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-d1a7766c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-d1a7766c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-d1a7766c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-d1a7766c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-d1a7766c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-d1a7766c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-d1a7766c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-d1a7766c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-d1a7766c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-d1a7766c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-d1a7766c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-d1a7766c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-d1a7766c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-d1a7766c]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-d1a7766c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-d1a7766c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-d1a7766c]{background:var(--md-primary)}.fill-secondary[data-v-d1a7766c]{background:var(--md-secondary,#536255)}.meter-text[data-v-d1a7766c]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-d1a7766c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-d1a7766c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-d1a7766c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-d1a7766c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-d1a7766c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-d1a7766c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-d1a7766c]{display:none}.empty-state[data-v-d1a7766c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-d1a7766c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-d1a7766c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-d1a7766c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-d1a7766c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-d1a7766c]{display:flex;flex-direction:column;gap:10px}.input[data-v-d1a7766c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-d1a7766c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-d1a7766c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-d1a7766c],.reflection-list[data-v-d1a7766c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-d1a7766c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-d1a7766c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-d1a7766c]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-d1a7766c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-d1a7766c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-d1a7766c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-d1a7766c]{margin-top:var(--space-lg)}.reader pre[data-v-d1a7766c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-d1a7766c]{font-size:14px;font-weight:600}.reflection details[data-v-d1a7766c]{margin-top:6px}.reflection summary[data-v-d1a7766c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-d1a7766c]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-d1a7766c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-d1a7766c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-d1a7766c]{padding:var(--space-lg)}.header-actions[data-v-d1a7766c]{padding-top:0}.memory-list[data-v-d1a7766c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
