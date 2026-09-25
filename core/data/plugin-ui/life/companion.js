import { defineComponent as dt, ref as u, computed as J, onMounted as rt, openBlock as l, createElementBlock as n, createElementVNode as t, toDisplayString as s, createCommentVNode as r, createStaticVNode as A, normalizeClass as M, withModifiers as N, withDirectives as v, vModelText as b, Fragment as c, renderList as _, createTextVNode as y, normalizeStyle as ut, vModelCheckbox as ct, createVNode as pt } from "vue";
import { _ as vt, a as _t } from "./assets/_plugin-vue_export-helper-CihezfpQ.js";
const mt = { class: "page" }, ht = { class: "page-inner" }, bt = { class: "page-header" }, gt = { class: "header-actions" }, yt = ["disabled"], ft = ["disabled"], kt = {
  key: 0,
  class: "error-banner"
}, wt = {
  key: 1,
  class: "notice"
}, Ct = { class: "stat-grid" }, jt = { class: "stat-card" }, xt = { class: "stat-value" }, Mt = { class: "stat-card" }, $t = { class: "stat-value" }, Lt = { class: "stat-card" }, Nt = { class: "stat-value" }, St = { class: "stat-hint" }, Vt = { class: "stat-card" }, Et = { class: "stat-value" }, Ft = { class: "life-state" }, Tt = { class: "state-pill" }, Ut = {
  key: 0,
  class: "state-pill"
}, Dt = { class: "grid" }, It = { class: "card" }, Ot = { class: "item-list" }, Pt = { class: "item-main" }, Yt = { class: "item-meta" }, Bt = { class: "item-actions" }, At = ["onClick"], zt = ["onClick"], Ht = {
  key: 0,
  class: "list-empty"
}, Jt = { class: "item-list" }, qt = { class: "check-label" }, Gt = ["checked", "onChange"], Rt = { class: "item-main" }, Wt = { class: "item-meta" }, Kt = {
  key: 0,
  class: "list-empty"
}, Qt = { class: "card" }, Xt = { class: "card-head" }, Zt = { class: "rel-list" }, te = { class: "avatar" }, ee = { class: "rel-main" }, ae = { class: "rel-top" }, se = { class: "chip" }, le = { class: "rel-meter" }, ne = { class: "meter-bar" }, ie = { class: "item-meta" }, oe = { class: "rel-actions" }, de = ["onClick"], re = ["onClick"], ue = {
  key: 0,
  class: "list-empty"
}, ce = {
  key: 0,
  class: "ledger"
}, pe = { class: "section-label" }, ve = { class: "feed" }, _e = {
  key: 0,
  class: "list-empty plain"
}, me = { class: "card" }, he = { class: "card-head" }, be = { class: "chip muted" }, ge = { class: "toolbar-inline" }, ye = ["disabled"], fe = ["disabled"], ke = { class: "item-list" }, we = { class: "item-main" }, Ce = { class: "item-meta" }, je = { class: "item-meta" }, xe = { class: "item-actions" }, Me = ["onClick"], $e = {
  key: 0,
  class: "list-empty"
}, Le = { class: "policy" }, Ne = { class: "select" }, Se = { class: "select" }, Ve = { class: "feed" }, Ee = {
  key: 0,
  class: "list-empty plain"
}, Fe = { class: "card" }, Te = { class: "card-head" }, Ue = { class: "chip muted" }, De = { class: "check-line" }, Ie = ["disabled"], Oe = { class: "item-list" }, Pe = { class: "item-main" }, Ye = { class: "item-meta" }, Be = { class: "item-actions" }, Ae = ["onClick"], ze = {
  key: 0,
  class: "list-empty"
}, He = { class: "card" }, Je = { class: "item-list" }, qe = { class: "item-main" }, Ge = { class: "item-meta" }, Re = { class: "chip" }, We = {
  key: 0,
  class: "list-empty"
}, Ke = { class: "card" }, Qe = { class: "card-head" }, Xe = { class: "chip muted" }, Ze = { class: "item-list" }, ta = { class: "item-main" }, ea = { class: "item-meta" }, aa = {
  key: 0,
  class: "group-detail"
}, sa = {
  key: 0,
  class: "topics"
}, la = { class: "feed compact" }, na = { class: "item-actions" }, ia = ["onClick"], oa = {
  key: 0,
  class: "list-empty"
}, da = { class: "card" }, ra = { class: "card-head" }, ua = ["disabled"], ca = { class: "feed" }, pa = {
  key: 0,
  class: "list-empty plain"
}, va = { class: "card" }, _a = { class: "card-head" }, ma = ["disabled"], ha = { class: "feed" }, ba = {
  key: 0,
  class: "list-empty plain"
}, ga = { class: "card audit-card" }, ya = { class: "card-head" }, fa = { class: "chip muted" }, ka = { class: "usage-grid" }, wa = { class: "usage-item" }, Ca = { class: "usage-item" }, ja = { class: "usage-item" }, xa = { class: "item-list" }, Ma = { class: "item-main" }, $a = { class: "item-meta" }, La = {
  key: 0,
  class: "list-empty"
}, Na = { class: "card audit-card" }, Sa = { class: "card-head" }, Va = { class: "timeline" }, Ea = { class: "tl-body" }, Fa = { class: "tl-head" }, Ta = { class: "item-meta" }, Ua = { class: "tl-detail" }, Da = {
  key: 0,
  class: "list-empty plain"
}, Ia = /* @__PURE__ */ dt({
  __name: "CompanionPage",
  setup(Oa) {
    const o = u({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), S = u(!1), f = u(""), $ = u(""), L = u(""), V = u(""), E = u(""), F = u(""), T = u(""), U = u(!1), D = u(""), p = u({ target: "", motive: "", content: "", preferred_at: "" }), C = u({ daily_limit: 6, per_target_limit: 2 }), I = J(() => Object.entries(o.value.groups || {})), O = J(() => (o.value.proactive?.candidates || []).filter((i) => !["delivered", "cancelled"].includes(i.status))), z = J(() => o.value.proactive?.receipts || []);
    function g(i) {
      $.value = i, setTimeout(() => {
        $.value === i && ($.value = "");
      }, 2e3);
    }
    const k = u(null);
    async function W() {
      try {
        const i = await fetch("/api/usage");
        i.ok && (k.value = await i.json());
      } catch {
      }
    }
    async function j() {
      S.value = !0, f.value = "";
      try {
        const i = await fetch("/api/life/companion");
        if (!i.ok) throw Error(String(i.status));
        o.value = await i.json();
      } catch (i) {
        f.value = i?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        S.value = !1;
      }
      W();
    }
    async function m(i, a) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: i, payload: a }) });
        if (!e.ok) throw Error(await e.text());
        return await j(), await e.json().catch(() => ({}));
      } catch (e) {
        return f.value = e?.message || "操作失败", null;
      }
    }
    async function K() {
      L.value.trim() && (await m("add_agenda", { title: L.value, when: V.value, detail: E.value }), L.value = "", V.value = "", E.value = "");
    }
    async function q(i, a) {
      a.trim() && (await m(i, { content: a }), i === "journal" ? F.value = "" : T.value = "");
    }
    function Q(i) {
      return `${Math.round(Math.max(0, Math.min(1, i || 0)) * 100)}%`;
    }
    async function G(i, a) {
      await m("relationship_adjust", { user_id: i, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: a }) && g(`已调整 ${i}`);
    }
    async function X() {
      if (!p.value.target.trim() || !p.value.content.trim()) return;
      await m("proactive_create", { ...p.value }) && (p.value = { target: "", motive: "", content: "", preferred_at: "" }, g("已创建主动候选"));
    }
    async function Z(i) {
      await m("proactive_cancel", { id: i, reason: "dashboard_cancel" }), g("已取消候选");
    }
    async function tt() {
      await m("proactive_policy", { daily_limit: Number(C.value.daily_limit), per_target_limit: Number(C.value.per_target_limit) }), g("策略已保存");
    }
    const x = u("");
    async function R(i) {
      x.value = i;
      try {
        const a = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: i === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!a.ok) throw Error(await a.text());
        await j(), g("已由 LIFE 生成");
      } catch (a) {
        f.value = a?.message || "生成失败";
      } finally {
        x.value = "";
      }
    }
    async function et() {
      const i = p.value.target.trim() || "user:owner";
      await m("proactive_suggest", { target: i, hint: p.value.motive }) && (p.value = { target: "", motive: "", content: "", preferred_at: "" }, g("已生成建议候选"));
    }
    const P = u(!1);
    async function at() {
      P.value = !0;
      try {
        const i = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!i.ok) throw Error(await i.text());
        const a = await i.json();
        await j(), g(a?.skipped ? `本次跳过：${a.skipped}` : `已投递 ${a.delivered || 0} 条 · 拦截 ${a.blocked || 0} 条`);
      } catch (i) {
        f.value = i?.message || "投递失败";
      } finally {
        P.value = !1;
      }
    }
    const Y = u(!1);
    async function st() {
      Y.value = !0;
      try {
        const i = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!i.ok) throw Error(await i.text());
        const a = await i.json();
        await j();
        const e = a?.applied;
        g(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (i) {
        f.value = i?.message || "规划失败";
      } finally {
        Y.value = !1;
      }
    }
    function H(i) {
      const a = (i || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let d = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(a) ? (d = new Date(a), d.setHours(0, 0, 0, 0), d < e && d.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(a) && (d = new Date(e.getFullYear(), Number(a.slice(0, 2)) - 1, Number(a.slice(3, 5))), d < e && d.setFullYear(e.getFullYear() + 1)), !d || Number.isNaN(d.getTime()) ? null : Math.round((d.getTime() - e.getTime()) / 864e5);
    }
    const h = u({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function lt() {
      !h.value.title.trim() || !h.value.date.trim() || (await m("date_add", { ...h.value }), h.value = { title: "", date: "", repeat_yearly: !0, note: "" }, g("已添加重要日期"));
    }
    async function nt(i) {
      await m("date_delete", { id: i }), g("已删除");
    }
    async function it() {
      await m("circadian_eat", { amount: 45 }), g("已用餐");
    }
    function B(i) {
      if (!i) return "";
      const a = new Date(i);
      return Number.isNaN(a.getTime()) ? i : a.toLocaleString();
    }
    return rt(j), (i, a) => (l(), n("main", mt, [
      t("div", ht, [
        t("header", bt, [
          a[21] || (a[21] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", gt, [
            t("button", {
              class: "btn btn-primary",
              disabled: Y.value,
              onClick: st
            }, s(Y.value ? "规划中…" : "让 LIFE 规划"), 9, yt),
            t("button", {
              class: "btn btn-tonal",
              disabled: S.value,
              onClick: j
            }, s(S.value ? "刷新中…" : "刷新"), 9, ft)
          ])
        ]),
        f.value ? (l(), n("p", kt, s(f.value), 1)) : r("", !0),
        $.value ? (l(), n("p", wt, s($.value), 1)) : r("", !0),
        t("section", Ct, [
          t("article", jt, [
            a[22] || (a[22] = A('<div class="stat-head" data-v-a95d7074><span class="icon-badge tone-1" aria-hidden="true" data-v-a95d7074><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-a95d7074><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-a95d7074></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-a95d7074></path></svg></span><span class="stat-label" data-v-a95d7074>关系对象</span></div>', 1)),
            t("strong", xt, s(o.value.relationships?.length || 0), 1),
            a[23] || (a[23] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", Mt, [
            a[24] || (a[24] = A('<div class="stat-head" data-v-a95d7074><span class="icon-badge tone-2" aria-hidden="true" data-v-a95d7074><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-a95d7074><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-a95d7074></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-a95d7074></path></svg></span><span class="stat-label" data-v-a95d7074>活动日程</span></div>', 1)),
            t("strong", $t, s(o.value.agenda?.filter((e) => e.status === "active").length || 0), 1),
            a[25] || (a[25] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", Lt, [
            a[26] || (a[26] = A('<div class="stat-head" data-v-a95d7074><span class="icon-badge tone-3" aria-hidden="true" data-v-a95d7074><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-a95d7074><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-a95d7074></path></svg></span><span class="stat-label" data-v-a95d7074>待投递主动行为</span></div>', 1)),
            t("strong", Nt, s(O.value.length), 1),
            t("span", St, "已投递 " + s(z.value.length) + " 次", 1)
          ]),
          t("article", Vt, [
            a[27] || (a[27] = A('<div class="stat-head" data-v-a95d7074><span class="icon-badge tone-4" aria-hidden="true" data-v-a95d7074><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-a95d7074><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-a95d7074></path></svg></span><span class="stat-label" data-v-a95d7074>已观察群聊</span></div>', 1)),
            t("strong", Et, s(I.value.length), 1),
            a[28] || (a[28] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", Ft, [
          t("span", Tt, "精力 " + s(Math.round(o.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: M(["state-pill", { warn: (o.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + s(Math.round(o.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: M(["state-pill", { warn: (o.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + s(Math.round(o.value.circadian?.health ?? 100)), 3),
          o.value.circadian?.is_sleeping ? (l(), n("span", Ut, "睡眠中")) : r("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: it
          }, "吃饭")
        ]),
        t("section", Dt, [
          t("article", It, [
            a[30] || (a[30] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "日程")
            ], -1)),
            t("form", {
              class: "agenda-form",
              onSubmit: N(K, ["prevent"])
            }, [
              v(t("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (e) => L.value = e),
                class: "input",
                placeholder: "日程标题",
                "aria-label": "日程标题"
              }, null, 512), [
                [b, L.value]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[1] || (a[1] = (e) => V.value = e),
                class: "input",
                placeholder: "时间，例如 2026-09-25 20:00",
                "aria-label": "时间"
              }, null, 512), [
                [b, V.value]
              ]),
              a[29] || (a[29] = t("button", {
                class: "btn btn-primary",
                type: "submit"
              }, "创建候选", -1)),
              v(t("textarea", {
                "onUpdate:modelValue": a[2] || (a[2] = (e) => E.value = e),
                class: "input area",
                placeholder: "说明（可选）"
              }, null, 512), [
                [b, E.value]
              ])
            ], 32),
            a[31] || (a[31] = t("h3", { class: "section-label" }, "待确认候选", -1)),
            t("ul", Ot, [
              (l(!0), n(c, null, _(o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", Pt, [
                  t("strong", null, s(e.title), 1),
                  t("span", Yt, s(e.when_text) + " · " + s(e.detail || "等待你确认"), 1)
                ]),
                t("div", Bt, [
                  t("button", {
                    class: "btn btn-primary btn-sm",
                    onClick: (d) => m("confirm_agenda", { id: e.id })
                  }, "确认", 8, At),
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => m("reject_agenda", { id: e.id })
                  }, "拒绝", 8, zt)
                ])
              ]))), 128)),
              o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? r("", !0) : (l(), n("li", Ht, "没有待确认的日程候选"))
            ]),
            a[32] || (a[32] = t("h3", { class: "section-label" }, "已确认日程", -1)),
            t("ul", Jt, [
              (l(!0), n(c, null, _(o.value.agenda, (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("label", qt, [
                  t("input", {
                    checked: e.status === "completed",
                    type: "checkbox",
                    onChange: (d) => m("complete_agenda", { id: e.id })
                  }, null, 40, Gt)
                ]),
                t("div", Rt, [
                  t("strong", {
                    class: M({ done: e.status === "completed" })
                  }, s(e.title), 3),
                  t("span", Wt, [
                    y(s(e.start_at), 1),
                    e.detail ? (l(), n(c, { key: 0 }, [
                      y(" · " + s(e.detail), 1)
                    ], 64)) : r("", !0)
                  ])
                ])
              ]))), 128)),
              o.value.agenda?.length ? r("", !0) : (l(), n("li", Kt, "暂无已确认日程"))
            ])
          ]),
          t("article", Qt, [
            t("div", Xt, [
              a[33] || (a[33] = t("h2", { class: "card-title" }, "关系账本", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: a[3] || (a[3] = (e) => U.value = !U.value)
              }, s(U.value ? "隐藏事件" : "查看事件账本"), 1)
            ]),
            t("ul", Zt, [
              (l(!0), n(c, null, _(o.value.relationships, (e) => (l(), n("li", {
                key: e.user_id,
                class: "rel"
              }, [
                t("span", te, s((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                t("div", ee, [
                  t("div", ae, [
                    t("strong", null, s(e.user_id), 1),
                    t("span", se, s(e.stage), 1)
                  ]),
                  t("div", le, [
                    t("div", ne, [
                      t("i", {
                        style: ut({ width: Q(e.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, s(Math.round((e.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("span", ie, "最近互动：" + s(e.last_seen || "暂无"), 1)
                ]),
                t("div", oe, [
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更亲近",
                    onClick: (d) => G(e.user_id, 0.05)
                  }, "+", 8, de),
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更疏远",
                    onClick: (d) => G(e.user_id, -0.05)
                  }, "−", 8, re)
                ])
              ]))), 128)),
              o.value.relationships?.length ? r("", !0) : (l(), n("li", ue, "暂无关系记录"))
            ]),
            U.value ? (l(), n("div", ce, [
              t("h3", pe, "事件账本（最近 " + s(o.value.relationship_ledger?.length || 0) + " 条）", 1),
              t("ol", ve, [
                (l(!0), n(c, null, _(o.value.relationship_ledger, (e) => (l(), n("li", {
                  key: e.id
                }, [
                  t("time", null, s(B(e.created_at)), 1),
                  t("p", null, [
                    t("strong", null, s(e.user_id), 1),
                    y(" · " + s(e.event_key) + " ", 1),
                    t("span", {
                      class: M(e.delta >= 0 ? "pos" : "neg")
                    }, s(e.delta >= 0 ? "+" : "") + s(e.delta), 3),
                    y(" · " + s(e.reason) + " (" + s(e.channel) + ")", 1)
                  ])
                ]))), 128)),
                o.value.relationship_ledger?.length ? r("", !0) : (l(), n("li", _e, "暂无关系事件"))
              ])
            ])) : r("", !0)
          ]),
          t("article", me, [
            t("div", he, [
              a[34] || (a[34] = t("h2", { class: "card-title" }, "主动行为", -1)),
              t("span", be, "待投递 " + s(O.value.length), 1)
            ]),
            t("div", ge, [
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: et
              }, "让 LIFE 建议一条"),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: P.value,
                onClick: at
              }, s(P.value ? "检查中…" : "立即检查投递"), 9, ye)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: N(X, ["prevent"])
            }, [
              v(t("input", {
                "onUpdate:modelValue": a[4] || (a[4] = (e) => p.value.target = e),
                class: "input",
                placeholder: "对象（user_id / 会话）",
                "aria-label": "主动对象"
              }, null, 512), [
                [b, p.value.target]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[5] || (a[5] = (e) => p.value.motive = e),
                class: "input",
                placeholder: "动机，如 care / reminder",
                "aria-label": "动机"
              }, null, 512), [
                [b, p.value.motive]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[6] || (a[6] = (e) => p.value.preferred_at = e),
                class: "input",
                placeholder: "期望时间（可选，ISO）",
                "aria-label": "期望时间"
              }, null, 512), [
                [b, p.value.preferred_at]
              ]),
              v(t("textarea", {
                "onUpdate:modelValue": a[7] || (a[7] = (e) => p.value.content = e),
                class: "input area",
                placeholder: "想说的内容…"
              }, null, 512), [
                [b, p.value.content]
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !p.value.target.trim() || !p.value.content.trim()
              }, "创建候选", 8, fe)
            ], 32),
            a[37] || (a[37] = t("h3", { class: "section-label" }, "候选队列", -1)),
            t("ul", ke, [
              (l(!0), n(c, null, _(O.value, (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", we, [
                  t("strong", null, s(e.target) + " · " + s(e.motive), 1),
                  t("span", Ce, s(e.content), 1),
                  t("span", je, "状态 " + s(e.status) + " · " + s(B(e.created_at)), 1)
                ]),
                t("div", xe, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => Z(e.id)
                  }, "取消", 8, Me)
                ])
              ]))), 128)),
              O.value.length ? r("", !0) : (l(), n("li", $e, "没有待投递候选"))
            ]),
            a[38] || (a[38] = t("h3", { class: "section-label" }, "配额策略", -1)),
            t("div", Le, [
              t("label", Ne, [
                a[35] || (a[35] = t("span", null, "每日上限", -1)),
                v(t("input", {
                  "onUpdate:modelValue": a[8] || (a[8] = (e) => C.value.daily_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    b,
                    C.value.daily_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("label", Se, [
                a[36] || (a[36] = t("span", null, "单人上限", -1)),
                v(t("input", {
                  "onUpdate:modelValue": a[9] || (a[9] = (e) => C.value.per_target_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    b,
                    C.value.per_target_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: tt
              }, "保存策略")
            ]),
            a[39] || (a[39] = t("h3", { class: "section-label" }, "投递记录", -1)),
            t("ol", Ve, [
              (l(!0), n(c, null, _(z.value, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, s(B(e.created_at)), 1),
                t("p", null, s(e.phase) + " · " + s(e.content), 1)
              ]))), 128)),
              z.value.length ? r("", !0) : (l(), n("li", Ee, "还没有主动投递记录"))
            ])
          ]),
          t("article", Fe, [
            t("div", Te, [
              a[40] || (a[40] = t("h2", { class: "card-title" }, "重要日期", -1)),
              t("span", Ue, s((o.value.important_dates || []).length), 1)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: N(lt, ["prevent"])
            }, [
              v(t("input", {
                "onUpdate:modelValue": a[10] || (a[10] = (e) => h.value.title = e),
                class: "input",
                placeholder: "名称，如 生日 / 纪念日",
                "aria-label": "重要日期名称"
              }, null, 512), [
                [b, h.value.title]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[11] || (a[11] = (e) => h.value.date = e),
                class: "input",
                placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                "aria-label": "重要日期"
              }, null, 512), [
                [b, h.value.date]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[12] || (a[12] = (e) => h.value.note = e),
                class: "input",
                placeholder: "备注（可选）",
                "aria-label": "备注"
              }, null, 512), [
                [b, h.value.note]
              ]),
              t("label", De, [
                v(t("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": a[13] || (a[13] = (e) => h.value.repeat_yearly = e)
                }, null, 512), [
                  [ct, h.value.repeat_yearly]
                ]),
                a[41] || (a[41] = y(" 每年重复", -1))
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !h.value.title.trim() || !h.value.date.trim()
              }, "添加", 8, Ie)
            ], 32),
            t("ul", Oe, [
              (l(!0), n(c, null, _(o.value.important_dates, (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", Pe, [
                  t("strong", null, s(e.title), 1),
                  t("span", Ye, [
                    y(s(e.date_text), 1),
                    H(e.date_text) !== null ? (l(), n(c, { key: 0 }, [
                      y(" · " + s(H(e.date_text) === 0 ? "就是今天" : H(e.date_text) + " 天后"), 1)
                    ], 64)) : r("", !0),
                    e.note ? (l(), n(c, { key: 1 }, [
                      y(" · " + s(e.note), 1)
                    ], 64)) : r("", !0)
                  ])
                ]),
                t("div", Be, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => nt(e.id)
                  }, "删除", 8, Ae)
                ])
              ]))), 128)),
              o.value.important_dates?.length ? r("", !0) : (l(), n("li", ze, "还没有重要日期，LIFE 会据此规划提醒。"))
            ])
          ]),
          t("article", He, [
            a[42] || (a[42] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "成长中的性格")
            ], -1)),
            t("ul", Je, [
              (l(!0), n(c, null, _(o.value.persona_evolution, (e) => (l(), n("li", {
                key: e.id,
                class: "item trait-item"
              }, [
                t("div", qe, [
                  t("strong", null, s(e.trait), 1),
                  t("span", Ge, "支持 " + s(e.support_count) + " 次 · 置信度 " + s(Math.round((e.confidence || 0) * 100)) + "%", 1)
                ]),
                t("span", Re, s(e.value), 1)
              ]))), 128)),
              o.value.persona_evolution?.length ? r("", !0) : (l(), n("li", We, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
            ])
          ]),
          t("article", Ke, [
            t("div", Qe, [
              a[43] || (a[43] = t("h2", { class: "card-title" }, "群聊观察", -1)),
              t("span", Xe, s(I.value.length), 1)
            ]),
            t("ul", Ze, [
              (l(!0), n(c, null, _(I.value, ([e, d]) => (l(), n("li", {
                key: e,
                class: "item group-item"
              }, [
                t("div", ta, [
                  t("strong", null, s(e), 1),
                  t("span", ea, "情绪 " + s(d.mood || "—") + " · " + s(d.messages?.length || 0) + " 条观察 · " + s(d.topics?.length || 0) + " 个话题", 1),
                  D.value === e ? (l(), n("div", aa, [
                    d.topics?.length ? (l(), n("div", sa, [
                      (l(!0), n(c, null, _(d.topics, (w) => (l(), n("span", {
                        key: w.topic,
                        class: "chip muted"
                      }, s(w.topic) + " · " + s(Math.round(w.score)), 1))), 128))
                    ])) : r("", !0),
                    t("ol", la, [
                      (l(!0), n(c, null, _(d.messages, (w, ot) => (l(), n("li", { key: ot }, [
                        t("time", null, s(B(w.created_at)), 1),
                        t("p", null, [
                          t("strong", null, s(w.user_id), 1),
                          y("：" + s(w.content), 1)
                        ])
                      ]))), 128))
                    ])
                  ])) : r("", !0)
                ]),
                t("div", na, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: (w) => D.value = D.value === e ? "" : e
                  }, s(D.value === e ? "收起" : "展开"), 9, ia)
                ])
              ]))), 128)),
              I.value.length ? r("", !0) : (l(), n("li", oa, "群聊观察尚未启用或没有消息。"))
            ])
          ]),
          t("article", da, [
            t("div", ra, [
              a[44] || (a[44] = t("h2", { class: "card-title" }, "日记", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: x.value === "journal",
                onClick: a[14] || (a[14] = (e) => R("journal"))
              }, s(x.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, ua)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: a[16] || (a[16] = N((e) => q("journal", F.value), ["prevent"]))
            }, [
              v(t("textarea", {
                "onUpdate:modelValue": a[15] || (a[15] = (e) => F.value = e),
                class: "input area",
                placeholder: "记录 LIFE 的日记…"
              }, null, 512), [
                [b, F.value]
              ]),
              a[45] || (a[45] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "写入日记", -1))
            ], 32),
            t("ol", ca, [
              (l(!0), n(c, null, _(o.value.journal, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, s(e.at), 1),
                t("p", null, s(e.content), 1)
              ]))), 128)),
              o.value.journal?.length ? r("", !0) : (l(), n("li", pa, "还没有日记"))
            ])
          ]),
          t("article", va, [
            t("div", _a, [
              a[46] || (a[46] = t("h2", { class: "card-title" }, "梦境", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: x.value === "dream",
                onClick: a[17] || (a[17] = (e) => R("dream"))
              }, s(x.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, ma)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: a[19] || (a[19] = N((e) => q("dream", T.value), ["prevent"]))
            }, [
              v(t("textarea", {
                "onUpdate:modelValue": a[18] || (a[18] = (e) => T.value = e),
                class: "input area",
                placeholder: "记录一个梦境或睡眠反思…"
              }, null, 512), [
                [b, T.value]
              ]),
              a[47] || (a[47] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "记录梦境", -1))
            ], 32),
            t("ol", ha, [
              (l(!0), n(c, null, _(o.value.dreams, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, s(e.at), 1),
                t("p", null, s(e.content), 1)
              ]))), 128)),
              o.value.dreams?.length ? r("", !0) : (l(), n("li", ba, "还没有梦境记录"))
            ])
          ])
        ]),
        t("article", ga, [
          t("div", ya, [
            a[48] || (a[48] = t("h2", { class: "card-title" }, "模型用量", -1)),
            t("span", fa, s(k.value?.request_count || 0) + " 次请求", 1)
          ]),
          t("div", ka, [
            t("div", wa, [
              t("strong", null, s((k.value?.total_tokens || 0).toLocaleString()), 1),
              a[49] || (a[49] = t("span", null, "总 Token", -1))
            ]),
            t("div", Ca, [
              t("strong", null, s((k.value?.total_prompt_tokens || 0).toLocaleString()), 1),
              a[50] || (a[50] = t("span", null, "输入", -1))
            ]),
            t("div", ja, [
              t("strong", null, s((k.value?.total_completion_tokens || 0).toLocaleString()), 1),
              a[51] || (a[51] = t("span", null, "输出", -1))
            ])
          ]),
          t("ul", xa, [
            (l(!0), n(c, null, _(k.value?.by_model || {}, (e, d) => (l(), n("li", {
              key: d,
              class: "item"
            }, [
              t("div", Ma, [
                t("strong", null, s(d), 1),
                t("span", $a, s((e.total || 0).toLocaleString()) + " tokens · " + s(e.count) + " 次", 1)
              ])
            ]))), 128)),
            !k.value || !Object.keys(k.value.by_model || {}).length ? (l(), n("li", La, "暂无用量记录")) : r("", !0)
          ])
        ]),
        t("article", Na, [
          t("div", Sa, [
            a[52] || (a[52] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: a[20] || (a[20] = (e) => m("memory_maintenance", {}))
            }, "执行记忆维护与备份")
          ]),
          t("ol", Va, [
            (l(!0), n(c, null, _(o.value.audit, (e) => (l(), n("li", {
              key: e.at + e.kind
            }, [
              t("span", {
                class: M(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                "aria-hidden": "true"
              }, null, 2),
              t("div", Ea, [
                t("div", Fa, [
                  t("strong", null, s(e.kind), 1),
                  t("span", {
                    class: M(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                  }, s(e.outcome), 3),
                  t("time", null, s(e.at), 1)
                ]),
                t("p", Ta, s(e.target), 1),
                t("p", Ua, s(e.detail), 1)
              ])
            ]))), 128)),
            o.value.audit?.length ? r("", !0) : (l(), n("li", Da, "暂无审计记录"))
          ])
        ])
      ]),
      pt(vt)
    ]));
  }
}), Ba = /* @__PURE__ */ _t(Ia, [["__scopeId", "data-v-a95d7074"]]);
export {
  Ba as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-a95d7074]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-a95d7074]{max-width:1180px;margin:0 auto}.page-header[data-v-a95d7074]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-a95d7074]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-a95d7074]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-a95d7074]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-a95d7074]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-a95d7074]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-a95d7074]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-a95d7074]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-a95d7074]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-a95d7074]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-a95d7074]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-a95d7074]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-a95d7074]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-a95d7074]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-a95d7074]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-a95d7074]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-a95d7074]{display:flex;align-items:center;gap:10px}.stat-label[data-v-a95d7074]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-a95d7074]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-a95d7074]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-a95d7074]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-a95d7074]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-a95d7074]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-a95d7074]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-a95d7074]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-a95d7074]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-a95d7074]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-a95d7074]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-a95d7074]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-a95d7074]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-a95d7074]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-a95d7074]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-a95d7074]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-a95d7074]{background:#fff1dc;color:#7a4400}.input[data-v-a95d7074]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-a95d7074]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-a95d7074]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-a95d7074]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-a95d7074]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-a95d7074]{grid-column:1/-1}.stack-form[data-v-a95d7074]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-a95d7074]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-a95d7074]{align-self:flex-start}.item-list[data-v-a95d7074],.rel-list[data-v-a95d7074],.feed[data-v-a95d7074],.timeline[data-v-a95d7074]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-a95d7074]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-a95d7074]{align-items:flex-start}.item[data-v-a95d7074]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-a95d7074]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-a95d7074]{font-size:14px;font-weight:600}.item-main strong.done[data-v-a95d7074]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-a95d7074]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-a95d7074]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-a95d7074]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-a95d7074]{background:transparent;border:0}.check-label[data-v-a95d7074]{display:flex;align-items:center}.check-line[data-v-a95d7074]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-a95d7074]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-a95d7074]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-a95d7074]{background:#fff1dc;color:#7a4400}.check-label input[data-v-a95d7074]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-a95d7074]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-a95d7074]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-a95d7074]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-a95d7074]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-a95d7074],.rel-meter[data-v-a95d7074]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-a95d7074]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-a95d7074]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-a95d7074]{font-size:12px}.rel-actions[data-v-a95d7074]{display:flex;gap:4px}.ledger[data-v-a95d7074]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-a95d7074]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-a95d7074]{padding:8px 12px}.feed time[data-v-a95d7074],.timeline time[data-v-a95d7074]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-a95d7074]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-a95d7074]{color:var(--md-success);font-weight:700}.neg[data-v-a95d7074]{color:var(--md-error);font-weight:700}.policy[data-v-a95d7074]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-a95d7074]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-a95d7074]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-a95d7074]{margin-top:6px}.audit-card[data-v-a95d7074]{margin-bottom:var(--space-lg)}.usage-grid[data-v-a95d7074]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}.usage-item[data-v-a95d7074]{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}.usage-item strong[data-v-a95d7074]{font-size:20px;font-weight:700}.usage-item span[data-v-a95d7074]{font-size:12px;color:var(--md-on-surface-variant)}.timeline[data-v-a95d7074]{position:relative}.timeline li[data-v-a95d7074]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-a95d7074]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-a95d7074]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-a95d7074]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-a95d7074]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-a95d7074]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-a95d7074]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-a95d7074]{font-size:13.5px;font-weight:650}.tl-detail[data-v-a95d7074]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-a95d7074]{grid-template-columns:repeat(2,1fr)}.grid[data-v-a95d7074],.agenda-form[data-v-a95d7074]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-a95d7074]{padding:var(--space-lg)}.header-actions[data-v-a95d7074]{padding-top:0}}.page[data-v-44679b4d]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-44679b4d]{max-width:1180px;margin:0 auto}.page-header[data-v-44679b4d]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-44679b4d]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-44679b4d]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-44679b4d]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-44679b4d]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-44679b4d]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-44679b4d]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-44679b4d]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-44679b4d]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-44679b4d]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-44679b4d]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-44679b4d]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-44679b4d]{display:flex;align-items:center;gap:10px}.stat-label[data-v-44679b4d]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-44679b4d]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-44679b4d]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-44679b4d]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-44679b4d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-44679b4d]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-44679b4d]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-44679b4d]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-44679b4d]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-44679b4d]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-44679b4d]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-44679b4d]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-44679b4d]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-44679b4d]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-44679b4d]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-44679b4d]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-44679b4d]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-44679b4d]{background:#fff1dc;color:#7a4400}.error-banner[data-v-44679b4d]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-44679b4d]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-44679b4d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-44679b4d]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-44679b4d]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-44679b4d]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-44679b4d]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-44679b4d]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-44679b4d]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-44679b4d]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-44679b4d]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-44679b4d]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-44679b4d]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-44679b4d]{background:var(--md-primary)}.fill-secondary[data-v-44679b4d]{background:var(--md-secondary,#536255)}.meter-text[data-v-44679b4d]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-44679b4d]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-44679b4d]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-44679b4d]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-44679b4d]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-44679b4d]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-44679b4d]{display:flex;gap:8px;justify-content:flex-end}.empty-state[data-v-44679b4d]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-44679b4d]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-44679b4d]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-44679b4d]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-44679b4d]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-44679b4d]{display:flex;flex-direction:column;gap:10px}.input[data-v-44679b4d]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-44679b4d]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-44679b4d]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-44679b4d],.reflection-list[data-v-44679b4d]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-44679b4d]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-44679b4d]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-44679b4d]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-44679b4d]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-44679b4d]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-44679b4d]{margin-top:var(--space-lg)}.reader pre[data-v-44679b4d]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-44679b4d]{font-size:14px;font-weight:600}.reflection details[data-v-44679b4d]{margin-top:6px}.reflection summary[data-v-44679b4d]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-44679b4d]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-44679b4d]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-44679b4d]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-44679b4d]{padding:var(--space-lg)}.header-actions[data-v-44679b4d]{padding-top:0}.memory-list[data-v-44679b4d]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
