import { defineComponent as it, ref as u, computed as H, onMounted as ot, openBlock as l, createElementBlock as n, createElementVNode as t, toDisplayString as s, createCommentVNode as r, createStaticVNode as B, normalizeClass as j, withModifiers as N, withDirectives as v, vModelText as h, Fragment as p, renderList as b, createTextVNode as y, normalizeStyle as dt, vModelCheckbox as rt, createVNode as ct } from "vue";
import { _ as ut, a as pt } from "./assets/_plugin-vue_export-helper-CihezfpQ.js";
const vt = { class: "page" }, _t = { class: "page-inner" }, mt = { class: "page-header" }, ht = { class: "header-actions" }, bt = ["disabled"], gt = ["disabled"], yt = {
  key: 0,
  class: "error-banner"
}, ft = {
  key: 1,
  class: "notice"
}, kt = { class: "stat-grid" }, wt = { class: "stat-card" }, Ct = { class: "stat-value" }, xt = { class: "stat-card" }, jt = { class: "stat-value" }, Mt = { class: "stat-card" }, $t = { class: "stat-value" }, Nt = { class: "stat-hint" }, Vt = { class: "stat-card" }, Et = { class: "stat-value" }, Ft = { class: "life-state" }, Lt = { class: "state-pill" }, St = {
  key: 0,
  class: "state-pill"
}, Tt = { class: "grid" }, Ut = { class: "card" }, Dt = { class: "item-list" }, It = { class: "item-main" }, Ot = { class: "item-meta" }, Pt = { class: "item-actions" }, Yt = ["onClick"], Bt = ["onClick"], At = {
  key: 0,
  class: "list-empty"
}, zt = { class: "item-list" }, Ht = { class: "check-label" }, Jt = ["checked", "onChange"], Gt = { class: "item-main" }, Rt = { class: "item-meta" }, Wt = {
  key: 0,
  class: "list-empty"
}, qt = { class: "card" }, Kt = { class: "card-head" }, Qt = { class: "rel-list" }, Xt = { class: "avatar" }, Zt = { class: "rel-main" }, te = { class: "rel-top" }, ee = { class: "chip" }, ae = { class: "rel-meter" }, se = { class: "meter-bar" }, le = { class: "item-meta" }, ne = { class: "rel-actions" }, ie = ["onClick"], oe = ["onClick"], de = {
  key: 0,
  class: "list-empty"
}, re = {
  key: 0,
  class: "ledger"
}, ce = { class: "section-label" }, ue = { class: "feed" }, pe = {
  key: 0,
  class: "list-empty plain"
}, ve = { class: "card" }, _e = { class: "card-head" }, me = { class: "chip muted" }, he = { class: "toolbar-inline" }, be = ["disabled"], ge = ["disabled"], ye = { class: "item-list" }, fe = { class: "item-main" }, ke = { class: "item-meta" }, we = { class: "item-meta" }, Ce = { class: "item-actions" }, xe = ["onClick"], je = {
  key: 0,
  class: "list-empty"
}, Me = { class: "policy" }, $e = { class: "select" }, Ne = { class: "select" }, Ve = { class: "feed" }, Ee = {
  key: 0,
  class: "list-empty plain"
}, Fe = { class: "card" }, Le = { class: "card-head" }, Se = { class: "chip muted" }, Te = { class: "check-line" }, Ue = ["disabled"], De = { class: "item-list" }, Ie = { class: "item-main" }, Oe = { class: "item-meta" }, Pe = { class: "item-actions" }, Ye = ["onClick"], Be = {
  key: 0,
  class: "list-empty"
}, Ae = { class: "card" }, ze = { class: "item-list" }, He = { class: "item-main" }, Je = { class: "item-meta" }, Ge = { class: "chip" }, Re = {
  key: 0,
  class: "list-empty"
}, We = { class: "card" }, qe = { class: "card-head" }, Ke = { class: "chip muted" }, Qe = { class: "item-list" }, Xe = { class: "item-main" }, Ze = { class: "item-meta" }, ta = {
  key: 0,
  class: "group-detail"
}, ea = {
  key: 0,
  class: "topics"
}, aa = { class: "feed compact" }, sa = { class: "item-actions" }, la = ["onClick"], na = {
  key: 0,
  class: "list-empty"
}, ia = { class: "card" }, oa = { class: "card-head" }, da = ["disabled"], ra = { class: "feed" }, ca = {
  key: 0,
  class: "list-empty plain"
}, ua = { class: "card" }, pa = { class: "card-head" }, va = ["disabled"], _a = { class: "feed" }, ma = {
  key: 0,
  class: "list-empty plain"
}, ha = { class: "card audit-card" }, ba = { class: "card-head" }, ga = { class: "timeline" }, ya = { class: "tl-body" }, fa = { class: "tl-head" }, ka = { class: "item-meta" }, wa = { class: "tl-detail" }, Ca = {
  key: 0,
  class: "list-empty plain"
}, xa = /* @__PURE__ */ it({
  __name: "CompanionPage",
  setup(ja) {
    const o = u({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] }), V = u(!1), f = u(""), M = u(""), $ = u(""), E = u(""), F = u(""), L = u(""), S = u(""), T = u(!1), U = u(""), c = u({ target: "", motive: "", content: "", preferred_at: "" }), w = u({ daily_limit: 6, per_target_limit: 2 }), D = H(() => Object.entries(o.value.groups || {})), I = H(() => (o.value.proactive?.candidates || []).filter((i) => !["delivered", "cancelled"].includes(i.status))), A = H(() => o.value.proactive?.receipts || []);
    function g(i) {
      M.value = i, setTimeout(() => {
        M.value === i && (M.value = "");
      }, 2e3);
    }
    async function C() {
      V.value = !0, f.value = "";
      try {
        const i = await fetch("/api/life/companion");
        if (!i.ok) throw Error(String(i.status));
        o.value = await i.json();
      } catch (i) {
        f.value = i?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        V.value = !1;
      }
    }
    async function _(i, a) {
      try {
        const e = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: i, payload: a }) });
        if (!e.ok) throw Error(await e.text());
        return await C(), await e.json().catch(() => ({}));
      } catch (e) {
        return f.value = e?.message || "操作失败", null;
      }
    }
    async function W() {
      $.value.trim() && (await _("add_agenda", { title: $.value, when: E.value, detail: F.value }), $.value = "", E.value = "", F.value = "");
    }
    async function J(i, a) {
      a.trim() && (await _(i, { content: a }), i === "journal" ? L.value = "" : S.value = "");
    }
    function q(i) {
      return `${Math.round(Math.max(0, Math.min(1, i || 0)) * 100)}%`;
    }
    async function G(i, a) {
      await _("relationship_adjust", { user_id: i, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: a }) && g(`已调整 ${i}`);
    }
    async function K() {
      if (!c.value.target.trim() || !c.value.content.trim()) return;
      await _("proactive_create", { ...c.value }) && (c.value = { target: "", motive: "", content: "", preferred_at: "" }, g("已创建主动候选"));
    }
    async function Q(i) {
      await _("proactive_cancel", { id: i, reason: "dashboard_cancel" }), g("已取消候选");
    }
    async function X() {
      await _("proactive_policy", { daily_limit: Number(w.value.daily_limit), per_target_limit: Number(w.value.per_target_limit) }), g("策略已保存");
    }
    const x = u("");
    async function R(i) {
      x.value = i;
      try {
        const a = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: i === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!a.ok) throw Error(await a.text());
        await C(), g("已由 LIFE 生成");
      } catch (a) {
        f.value = a?.message || "生成失败";
      } finally {
        x.value = "";
      }
    }
    async function Z() {
      const i = c.value.target.trim() || "user:owner";
      await _("proactive_suggest", { target: i, hint: c.value.motive }) && (c.value = { target: "", motive: "", content: "", preferred_at: "" }, g("已生成建议候选"));
    }
    const O = u(!1);
    async function tt() {
      O.value = !0;
      try {
        const i = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!i.ok) throw Error(await i.text());
        const a = await i.json();
        await C(), g(a?.skipped ? `本次跳过：${a.skipped}` : `已投递 ${a.delivered || 0} 条 · 拦截 ${a.blocked || 0} 条`);
      } catch (i) {
        f.value = i?.message || "投递失败";
      } finally {
        O.value = !1;
      }
    }
    const P = u(!1);
    async function et() {
      P.value = !0;
      try {
        const i = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!i.ok) throw Error(await i.text());
        const a = await i.json();
        await C();
        const e = a?.applied;
        g(e ? `已自主规划：日程 ${e.agenda} · 主动 ${e.proactive} · 日记 ${e.journal}` : "本次没有新的规划");
      } catch (i) {
        f.value = i?.message || "规划失败";
      } finally {
        P.value = !1;
      }
    }
    function z(i) {
      const a = (i || "").trim(), e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      let d = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(a) ? (d = new Date(a), d.setHours(0, 0, 0, 0), d < e && d.setFullYear(e.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(a) && (d = new Date(e.getFullYear(), Number(a.slice(0, 2)) - 1, Number(a.slice(3, 5))), d < e && d.setFullYear(e.getFullYear() + 1)), !d || Number.isNaN(d.getTime()) ? null : Math.round((d.getTime() - e.getTime()) / 864e5);
    }
    const m = u({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function at() {
      !m.value.title.trim() || !m.value.date.trim() || (await _("date_add", { ...m.value }), m.value = { title: "", date: "", repeat_yearly: !0, note: "" }, g("已添加重要日期"));
    }
    async function st(i) {
      await _("date_delete", { id: i }), g("已删除");
    }
    async function lt() {
      await _("circadian_eat", { amount: 45 }), g("已用餐");
    }
    function Y(i) {
      if (!i) return "";
      const a = new Date(i);
      return Number.isNaN(a.getTime()) ? i : a.toLocaleString();
    }
    return ot(C), (i, a) => (l(), n("main", vt, [
      t("div", _t, [
        t("header", mt, [
          a[21] || (a[21] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。")
          ], -1)),
          t("div", ht, [
            t("button", {
              class: "btn btn-primary",
              disabled: P.value,
              onClick: et
            }, s(P.value ? "规划中…" : "让 LIFE 规划"), 9, bt),
            t("button", {
              class: "btn btn-tonal",
              disabled: V.value,
              onClick: C
            }, s(V.value ? "刷新中…" : "刷新"), 9, gt)
          ])
        ]),
        f.value ? (l(), n("p", yt, s(f.value), 1)) : r("", !0),
        M.value ? (l(), n("p", ft, s(M.value), 1)) : r("", !0),
        t("section", kt, [
          t("article", wt, [
            a[22] || (a[22] = B('<div class="stat-head" data-v-34cddb09><span class="icon-badge tone-1" aria-hidden="true" data-v-34cddb09><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-34cddb09><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-34cddb09></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-34cddb09></path></svg></span><span class="stat-label" data-v-34cddb09>关系对象</span></div>', 1)),
            t("strong", Ct, s(o.value.relationships?.length || 0), 1),
            a[23] || (a[23] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", xt, [
            a[24] || (a[24] = B('<div class="stat-head" data-v-34cddb09><span class="icon-badge tone-2" aria-hidden="true" data-v-34cddb09><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-34cddb09><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-34cddb09></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-34cddb09></path></svg></span><span class="stat-label" data-v-34cddb09>活动日程</span></div>', 1)),
            t("strong", jt, s(o.value.agenda?.filter((e) => e.status === "active").length || 0), 1),
            a[25] || (a[25] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", Mt, [
            a[26] || (a[26] = B('<div class="stat-head" data-v-34cddb09><span class="icon-badge tone-3" aria-hidden="true" data-v-34cddb09><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-34cddb09><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-34cddb09></path></svg></span><span class="stat-label" data-v-34cddb09>待投递主动行为</span></div>', 1)),
            t("strong", $t, s(I.value.length), 1),
            t("span", Nt, "已投递 " + s(A.value.length) + " 次", 1)
          ]),
          t("article", Vt, [
            a[27] || (a[27] = B('<div class="stat-head" data-v-34cddb09><span class="icon-badge tone-4" aria-hidden="true" data-v-34cddb09><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-34cddb09><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-34cddb09></path></svg></span><span class="stat-label" data-v-34cddb09>已观察群聊</span></div>', 1)),
            t("strong", Et, s(D.value.length), 1),
            a[28] || (a[28] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", Ft, [
          t("span", Lt, "精力 " + s(Math.round(o.value.circadian?.mental_energy ?? 0)), 1),
          t("span", {
            class: j(["state-pill", { warn: (o.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + s(Math.round(o.value.circadian?.hunger ?? 0)), 3),
          t("span", {
            class: j(["state-pill", { warn: (o.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + s(Math.round(o.value.circadian?.health ?? 100)), 3),
          o.value.circadian?.is_sleeping ? (l(), n("span", St, "睡眠中")) : r("", !0),
          t("button", {
            class: "btn btn-tonal btn-sm",
            onClick: lt
          }, "吃饭")
        ]),
        t("section", Tt, [
          t("article", Ut, [
            a[30] || (a[30] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "日程")
            ], -1)),
            t("form", {
              class: "agenda-form",
              onSubmit: N(W, ["prevent"])
            }, [
              v(t("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (e) => $.value = e),
                class: "input",
                placeholder: "日程标题",
                "aria-label": "日程标题"
              }, null, 512), [
                [h, $.value]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[1] || (a[1] = (e) => E.value = e),
                class: "input",
                placeholder: "时间，例如 2026-09-25 20:00",
                "aria-label": "时间"
              }, null, 512), [
                [h, E.value]
              ]),
              a[29] || (a[29] = t("button", {
                class: "btn btn-primary",
                type: "submit"
              }, "创建候选", -1)),
              v(t("textarea", {
                "onUpdate:modelValue": a[2] || (a[2] = (e) => F.value = e),
                class: "input area",
                placeholder: "说明（可选）"
              }, null, 512), [
                [h, F.value]
              ])
            ], 32),
            a[31] || (a[31] = t("h3", { class: "section-label" }, "待确认候选", -1)),
            t("ul", Dt, [
              (l(!0), n(p, null, b(o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation"), (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", It, [
                  t("strong", null, s(e.title), 1),
                  t("span", Ot, s(e.when_text) + " · " + s(e.detail || "等待你确认"), 1)
                ]),
                t("div", Pt, [
                  t("button", {
                    class: "btn btn-primary btn-sm",
                    onClick: (d) => _("confirm_agenda", { id: e.id })
                  }, "确认", 8, Yt),
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => _("reject_agenda", { id: e.id })
                  }, "拒绝", 8, Bt)
                ])
              ]))), 128)),
              o.value.calendar_candidates?.filter((e) => e.status === "pending_confirmation").length ? r("", !0) : (l(), n("li", At, "没有待确认的日程候选"))
            ]),
            a[32] || (a[32] = t("h3", { class: "section-label" }, "已确认日程", -1)),
            t("ul", zt, [
              (l(!0), n(p, null, b(o.value.agenda, (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("label", Ht, [
                  t("input", {
                    checked: e.status === "completed",
                    type: "checkbox",
                    onChange: (d) => _("complete_agenda", { id: e.id })
                  }, null, 40, Jt)
                ]),
                t("div", Gt, [
                  t("strong", {
                    class: j({ done: e.status === "completed" })
                  }, s(e.title), 3),
                  t("span", Rt, [
                    y(s(e.start_at), 1),
                    e.detail ? (l(), n(p, { key: 0 }, [
                      y(" · " + s(e.detail), 1)
                    ], 64)) : r("", !0)
                  ])
                ])
              ]))), 128)),
              o.value.agenda?.length ? r("", !0) : (l(), n("li", Wt, "暂无已确认日程"))
            ])
          ]),
          t("article", qt, [
            t("div", Kt, [
              a[33] || (a[33] = t("h2", { class: "card-title" }, "关系账本", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: a[3] || (a[3] = (e) => T.value = !T.value)
              }, s(T.value ? "隐藏事件" : "查看事件账本"), 1)
            ]),
            t("ul", Qt, [
              (l(!0), n(p, null, b(o.value.relationships, (e) => (l(), n("li", {
                key: e.user_id,
                class: "rel"
              }, [
                t("span", Xt, s((e.user_id || "?").slice(0, 1).toUpperCase()), 1),
                t("div", Zt, [
                  t("div", te, [
                    t("strong", null, s(e.user_id), 1),
                    t("span", ee, s(e.stage), 1)
                  ]),
                  t("div", ae, [
                    t("div", se, [
                      t("i", {
                        style: dt({ width: q(e.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, s(Math.round((e.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("span", le, "最近互动：" + s(e.last_seen || "暂无"), 1)
                ]),
                t("div", ne, [
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更亲近",
                    onClick: (d) => G(e.user_id, 0.05)
                  }, "+", 8, ie),
                  t("button", {
                    class: "btn btn-sm btn-tonal",
                    title: "更疏远",
                    onClick: (d) => G(e.user_id, -0.05)
                  }, "−", 8, oe)
                ])
              ]))), 128)),
              o.value.relationships?.length ? r("", !0) : (l(), n("li", de, "暂无关系记录"))
            ]),
            T.value ? (l(), n("div", re, [
              t("h3", ce, "事件账本（最近 " + s(o.value.relationship_ledger?.length || 0) + " 条）", 1),
              t("ol", ue, [
                (l(!0), n(p, null, b(o.value.relationship_ledger, (e) => (l(), n("li", {
                  key: e.id
                }, [
                  t("time", null, s(Y(e.created_at)), 1),
                  t("p", null, [
                    t("strong", null, s(e.user_id), 1),
                    y(" · " + s(e.event_key) + " ", 1),
                    t("span", {
                      class: j(e.delta >= 0 ? "pos" : "neg")
                    }, s(e.delta >= 0 ? "+" : "") + s(e.delta), 3),
                    y(" · " + s(e.reason) + " (" + s(e.channel) + ")", 1)
                  ])
                ]))), 128)),
                o.value.relationship_ledger?.length ? r("", !0) : (l(), n("li", pe, "暂无关系事件"))
              ])
            ])) : r("", !0)
          ]),
          t("article", ve, [
            t("div", _e, [
              a[34] || (a[34] = t("h2", { class: "card-title" }, "主动行为", -1)),
              t("span", me, "待投递 " + s(I.value.length), 1)
            ]),
            t("div", he, [
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: Z
              }, "让 LIFE 建议一条"),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: O.value,
                onClick: tt
              }, s(O.value ? "检查中…" : "立即检查投递"), 9, be)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: N(K, ["prevent"])
            }, [
              v(t("input", {
                "onUpdate:modelValue": a[4] || (a[4] = (e) => c.value.target = e),
                class: "input",
                placeholder: "对象（user_id / 会话）",
                "aria-label": "主动对象"
              }, null, 512), [
                [h, c.value.target]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[5] || (a[5] = (e) => c.value.motive = e),
                class: "input",
                placeholder: "动机，如 care / reminder",
                "aria-label": "动机"
              }, null, 512), [
                [h, c.value.motive]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[6] || (a[6] = (e) => c.value.preferred_at = e),
                class: "input",
                placeholder: "期望时间（可选，ISO）",
                "aria-label": "期望时间"
              }, null, 512), [
                [h, c.value.preferred_at]
              ]),
              v(t("textarea", {
                "onUpdate:modelValue": a[7] || (a[7] = (e) => c.value.content = e),
                class: "input area",
                placeholder: "想说的内容…"
              }, null, 512), [
                [h, c.value.content]
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !c.value.target.trim() || !c.value.content.trim()
              }, "创建候选", 8, ge)
            ], 32),
            a[37] || (a[37] = t("h3", { class: "section-label" }, "候选队列", -1)),
            t("ul", ye, [
              (l(!0), n(p, null, b(I.value, (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", fe, [
                  t("strong", null, s(e.target) + " · " + s(e.motive), 1),
                  t("span", ke, s(e.content), 1),
                  t("span", we, "状态 " + s(e.status) + " · " + s(Y(e.created_at)), 1)
                ]),
                t("div", Ce, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => Q(e.id)
                  }, "取消", 8, xe)
                ])
              ]))), 128)),
              I.value.length ? r("", !0) : (l(), n("li", je, "没有待投递候选"))
            ]),
            a[38] || (a[38] = t("h3", { class: "section-label" }, "配额策略", -1)),
            t("div", Me, [
              t("label", $e, [
                a[35] || (a[35] = t("span", null, "每日上限", -1)),
                v(t("input", {
                  "onUpdate:modelValue": a[8] || (a[8] = (e) => w.value.daily_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    h,
                    w.value.daily_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("label", Ne, [
                a[36] || (a[36] = t("span", null, "单人上限", -1)),
                v(t("input", {
                  "onUpdate:modelValue": a[9] || (a[9] = (e) => w.value.per_target_limit = e),
                  type: "number",
                  min: "0",
                  class: "input tiny"
                }, null, 512), [
                  [
                    h,
                    w.value.per_target_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              t("button", {
                class: "btn btn-tonal btn-sm",
                onClick: X
              }, "保存策略")
            ]),
            a[39] || (a[39] = t("h3", { class: "section-label" }, "投递记录", -1)),
            t("ol", Ve, [
              (l(!0), n(p, null, b(A.value, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, s(Y(e.created_at)), 1),
                t("p", null, s(e.phase) + " · " + s(e.content), 1)
              ]))), 128)),
              A.value.length ? r("", !0) : (l(), n("li", Ee, "还没有主动投递记录"))
            ])
          ]),
          t("article", Fe, [
            t("div", Le, [
              a[40] || (a[40] = t("h2", { class: "card-title" }, "重要日期", -1)),
              t("span", Se, s((o.value.important_dates || []).length), 1)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: N(at, ["prevent"])
            }, [
              v(t("input", {
                "onUpdate:modelValue": a[10] || (a[10] = (e) => m.value.title = e),
                class: "input",
                placeholder: "名称，如 生日 / 纪念日",
                "aria-label": "重要日期名称"
              }, null, 512), [
                [h, m.value.title]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[11] || (a[11] = (e) => m.value.date = e),
                class: "input",
                placeholder: "日期：YYYY-MM-DD 或 MM-DD",
                "aria-label": "重要日期"
              }, null, 512), [
                [h, m.value.date]
              ]),
              v(t("input", {
                "onUpdate:modelValue": a[12] || (a[12] = (e) => m.value.note = e),
                class: "input",
                placeholder: "备注（可选）",
                "aria-label": "备注"
              }, null, 512), [
                [h, m.value.note]
              ]),
              t("label", Te, [
                v(t("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": a[13] || (a[13] = (e) => m.value.repeat_yearly = e)
                }, null, 512), [
                  [rt, m.value.repeat_yearly]
                ]),
                a[41] || (a[41] = y(" 每年重复", -1))
              ]),
              t("button", {
                class: "btn btn-primary",
                type: "submit",
                disabled: !m.value.title.trim() || !m.value.date.trim()
              }, "添加", 8, Ue)
            ], 32),
            t("ul", De, [
              (l(!0), n(p, null, b(o.value.important_dates, (e) => (l(), n("li", {
                key: e.id,
                class: "item"
              }, [
                t("div", Ie, [
                  t("strong", null, s(e.title), 1),
                  t("span", Oe, [
                    y(s(e.date_text), 1),
                    z(e.date_text) !== null ? (l(), n(p, { key: 0 }, [
                      y(" · " + s(z(e.date_text) === 0 ? "就是今天" : z(e.date_text) + " 天后"), 1)
                    ], 64)) : r("", !0),
                    e.note ? (l(), n(p, { key: 1 }, [
                      y(" · " + s(e.note), 1)
                    ], 64)) : r("", !0)
                  ])
                ]),
                t("div", Pe, [
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (d) => st(e.id)
                  }, "删除", 8, Ye)
                ])
              ]))), 128)),
              o.value.important_dates?.length ? r("", !0) : (l(), n("li", Be, "还没有重要日期，LIFE 会据此规划提醒。"))
            ])
          ]),
          t("article", Ae, [
            a[42] || (a[42] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "成长中的性格")
            ], -1)),
            t("ul", ze, [
              (l(!0), n(p, null, b(o.value.persona_evolution, (e) => (l(), n("li", {
                key: e.id,
                class: "item trait-item"
              }, [
                t("div", He, [
                  t("strong", null, s(e.trait), 1),
                  t("span", Je, "支持 " + s(e.support_count) + " 次 · 置信度 " + s(Math.round((e.confidence || 0) * 100)) + "%", 1)
                ]),
                t("span", Ge, s(e.value), 1)
              ]))), 128)),
              o.value.persona_evolution?.length ? r("", !0) : (l(), n("li", Re, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
            ])
          ]),
          t("article", We, [
            t("div", qe, [
              a[43] || (a[43] = t("h2", { class: "card-title" }, "群聊观察", -1)),
              t("span", Ke, s(D.value.length), 1)
            ]),
            t("ul", Qe, [
              (l(!0), n(p, null, b(D.value, ([e, d]) => (l(), n("li", {
                key: e,
                class: "item group-item"
              }, [
                t("div", Xe, [
                  t("strong", null, s(e), 1),
                  t("span", Ze, "情绪 " + s(d.mood || "—") + " · " + s(d.messages?.length || 0) + " 条观察 · " + s(d.topics?.length || 0) + " 个话题", 1),
                  U.value === e ? (l(), n("div", ta, [
                    d.topics?.length ? (l(), n("div", ea, [
                      (l(!0), n(p, null, b(d.topics, (k) => (l(), n("span", {
                        key: k.topic,
                        class: "chip muted"
                      }, s(k.topic) + " · " + s(Math.round(k.score)), 1))), 128))
                    ])) : r("", !0),
                    t("ol", aa, [
                      (l(!0), n(p, null, b(d.messages, (k, nt) => (l(), n("li", { key: nt }, [
                        t("time", null, s(Y(k.created_at)), 1),
                        t("p", null, [
                          t("strong", null, s(k.user_id), 1),
                          y("：" + s(k.content), 1)
                        ])
                      ]))), 128))
                    ])
                  ])) : r("", !0)
                ]),
                t("div", sa, [
                  t("button", {
                    class: "btn btn-tonal btn-sm",
                    onClick: (k) => U.value = U.value === e ? "" : e
                  }, s(U.value === e ? "收起" : "展开"), 9, la)
                ])
              ]))), 128)),
              D.value.length ? r("", !0) : (l(), n("li", na, "群聊观察尚未启用或没有消息。"))
            ])
          ]),
          t("article", ia, [
            t("div", oa, [
              a[44] || (a[44] = t("h2", { class: "card-title" }, "日记", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: x.value === "journal",
                onClick: a[14] || (a[14] = (e) => R("journal"))
              }, s(x.value === "journal" ? "生成中…" : "由 LIFE 生成"), 9, da)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: a[16] || (a[16] = N((e) => J("journal", L.value), ["prevent"]))
            }, [
              v(t("textarea", {
                "onUpdate:modelValue": a[15] || (a[15] = (e) => L.value = e),
                class: "input area",
                placeholder: "记录 LIFE 的日记…"
              }, null, 512), [
                [h, L.value]
              ]),
              a[45] || (a[45] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "写入日记", -1))
            ], 32),
            t("ol", ra, [
              (l(!0), n(p, null, b(o.value.journal, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, s(e.at), 1),
                t("p", null, s(e.content), 1)
              ]))), 128)),
              o.value.journal?.length ? r("", !0) : (l(), n("li", ca, "还没有日记"))
            ])
          ]),
          t("article", ua, [
            t("div", pa, [
              a[46] || (a[46] = t("h2", { class: "card-title" }, "梦境", -1)),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: x.value === "dream",
                onClick: a[17] || (a[17] = (e) => R("dream"))
              }, s(x.value === "dream" ? "生成中…" : "由 LIFE 生成"), 9, va)
            ]),
            t("form", {
              class: "stack-form",
              onSubmit: a[19] || (a[19] = N((e) => J("dream", S.value), ["prevent"]))
            }, [
              v(t("textarea", {
                "onUpdate:modelValue": a[18] || (a[18] = (e) => S.value = e),
                class: "input area",
                placeholder: "记录一个梦境或睡眠反思…"
              }, null, 512), [
                [h, S.value]
              ]),
              a[47] || (a[47] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "记录梦境", -1))
            ], 32),
            t("ol", _a, [
              (l(!0), n(p, null, b(o.value.dreams, (e) => (l(), n("li", {
                key: e.id
              }, [
                t("time", null, s(e.at), 1),
                t("p", null, s(e.content), 1)
              ]))), 128)),
              o.value.dreams?.length ? r("", !0) : (l(), n("li", ma, "还没有梦境记录"))
            ])
          ])
        ]),
        t("article", ha, [
          t("div", ba, [
            a[48] || (a[48] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: a[20] || (a[20] = (e) => _("memory_maintenance", {}))
            }, "执行记忆维护与备份")
          ]),
          t("ol", ga, [
            (l(!0), n(p, null, b(o.value.audit, (e) => (l(), n("li", {
              key: e.at + e.kind
            }, [
              t("span", {
                class: j(["dot", e.outcome === "ok" ? "ok" : "warn"]),
                "aria-hidden": "true"
              }, null, 2),
              t("div", ya, [
                t("div", fa, [
                  t("strong", null, s(e.kind), 1),
                  t("span", {
                    class: j(["chip", e.outcome === "ok" ? "chip-ok" : "chip-warn"])
                  }, s(e.outcome), 3),
                  t("time", null, s(e.at), 1)
                ]),
                t("p", ka, s(e.target), 1),
                t("p", wa, s(e.detail), 1)
              ])
            ]))), 128)),
            o.value.audit?.length ? r("", !0) : (l(), n("li", Ca, "暂无审计记录"))
          ])
        ])
      ]),
      ct(ut)
    ]));
  }
}), Na = /* @__PURE__ */ pt(xa, [["__scopeId", "data-v-34cddb09"]]);
export {
  Na as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-34cddb09]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-34cddb09]{max-width:1180px;margin:0 auto}.page-header[data-v-34cddb09]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-34cddb09]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-34cddb09]{margin:0;font-size:var(--font-size-lg);font-weight:650}.subtitle[data-v-34cddb09]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-34cddb09]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-34cddb09]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}.btn[data-v-34cddb09]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-34cddb09]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-34cddb09]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-34cddb09]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-34cddb09]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-34cddb09]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-34cddb09]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.notice[data-v-34cddb09]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-34cddb09]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-34cddb09]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-34cddb09]{display:flex;align-items:center;gap:10px}.stat-label[data-v-34cddb09]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-34cddb09]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-34cddb09]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-34cddb09]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-34cddb09]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-34cddb09]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-34cddb09]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-34cddb09]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-34cddb09]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-34cddb09]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-34cddb09]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-34cddb09]{margin:0;font-size:16px;font-weight:650}.section-label[data-v-34cddb09]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-34cddb09]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-34cddb09]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}.chip-ok[data-v-34cddb09]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-34cddb09]{background:#fff1dc;color:#7a4400}.input[data-v-34cddb09]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-34cddb09]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-34cddb09]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.input.tiny[data-v-34cddb09]{width:80px;height:34px;padding:0 10px;font-size:13px}.agenda-form[data-v-34cddb09]{display:grid;grid-template-columns:1fr 220px auto;gap:10px}.agenda-form .area[data-v-34cddb09]{grid-column:1/-1}.stack-form[data-v-34cddb09]{display:flex;flex-direction:column;gap:10px;align-items:stretch}.toolbar-inline[data-v-34cddb09]{display:flex;gap:8px;margin-bottom:12px}.stack-form .btn[data-v-34cddb09]{align-self:flex-start}.item-list[data-v-34cddb09],.rel-list[data-v-34cddb09],.feed[data-v-34cddb09],.timeline[data-v-34cddb09]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-34cddb09]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.item.group-item[data-v-34cddb09]{align-items:flex-start}.item[data-v-34cddb09]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-34cddb09]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-34cddb09]{font-size:14px;font-weight:600}.item-main strong.done[data-v-34cddb09]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-34cddb09]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-34cddb09]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-34cddb09]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-34cddb09]{background:transparent;border:0}.check-label[data-v-34cddb09]{display:flex;align-items:center}.check-line[data-v-34cddb09]{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.life-state[data-v-34cddb09]{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}.state-pill[data-v-34cddb09]{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}.state-pill.warn[data-v-34cddb09]{background:#fff1dc;color:#7a4400}.check-label input[data-v-34cddb09]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-34cddb09]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-34cddb09]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}.avatar[data-v-34cddb09]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-34cddb09]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-34cddb09],.rel-meter[data-v-34cddb09]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-34cddb09]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-34cddb09]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-34cddb09]{font-size:12px}.rel-actions[data-v-34cddb09]{display:flex;gap:4px}.ledger[data-v-34cddb09]{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}.feed li[data-v-34cddb09]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed.compact li[data-v-34cddb09]{padding:8px 12px}.feed time[data-v-34cddb09],.timeline time[data-v-34cddb09]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-34cddb09]{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.pos[data-v-34cddb09]{color:var(--md-success);font-weight:700}.neg[data-v-34cddb09]{color:var(--md-error);font-weight:700}.policy[data-v-34cddb09]{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.select[data-v-34cddb09]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.topics[data-v-34cddb09]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.group-detail[data-v-34cddb09]{margin-top:6px}.audit-card[data-v-34cddb09]{margin-bottom:var(--space-lg)}.timeline[data-v-34cddb09]{position:relative}.timeline li[data-v-34cddb09]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-34cddb09]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-34cddb09]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}.dot.ok[data-v-34cddb09]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-34cddb09]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-34cddb09]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-34cddb09]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-34cddb09]{font-size:13.5px;font-weight:650}.tl-detail[data-v-34cddb09]{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-34cddb09]{grid-template-columns:repeat(2,1fr)}.grid[data-v-34cddb09],.agenda-form[data-v-34cddb09]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-34cddb09]{padding:var(--space-lg)}.header-actions[data-v-34cddb09]{padding-top:0}}.page[data-v-44679b4d]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-44679b4d]{max-width:1180px;margin:0 auto}.page-header[data-v-44679b4d]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-44679b4d]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-44679b4d]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-44679b4d]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-44679b4d]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-44679b4d]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-44679b4d]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-44679b4d]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-44679b4d]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-44679b4d]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-44679b4d]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-44679b4d]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-44679b4d]{display:flex;align-items:center;gap:10px}.stat-label[data-v-44679b4d]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-44679b4d]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-44679b4d]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-44679b4d]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-44679b4d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-44679b4d]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-44679b4d]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-44679b4d]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-44679b4d]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-44679b4d]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-44679b4d]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-44679b4d]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-44679b4d]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-44679b4d]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-44679b4d]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-44679b4d]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-44679b4d]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-44679b4d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-44679b4d]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-44679b4d]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-44679b4d]{background:#fff1dc;color:#7a4400}.error-banner[data-v-44679b4d]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-44679b4d]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-44679b4d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-44679b4d]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-44679b4d]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-44679b4d]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-44679b4d]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-44679b4d]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-44679b4d]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-44679b4d]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-44679b4d]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-44679b4d]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-44679b4d]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-44679b4d]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-44679b4d]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-44679b4d]{background:var(--md-primary)}.fill-secondary[data-v-44679b4d]{background:var(--md-secondary,#536255)}.meter-text[data-v-44679b4d]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.detail[data-v-44679b4d]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-44679b4d]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-44679b4d]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-44679b4d]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-44679b4d]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.card-actions[data-v-44679b4d]{display:flex;gap:8px;justify-content:flex-end}.empty-state[data-v-44679b4d]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-44679b4d]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-44679b4d]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-44679b4d]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-44679b4d]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-44679b4d]{display:flex;flex-direction:column;gap:10px}.input[data-v-44679b4d]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-44679b4d]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-44679b4d]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-44679b4d],.reflection-list[data-v-44679b4d]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-44679b4d]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-44679b4d]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-44679b4d]{font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-44679b4d]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-44679b4d]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-44679b4d]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-44679b4d]{margin-top:var(--space-lg)}.reader pre[data-v-44679b4d]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-44679b4d]{font-size:14px;font-weight:600}.reflection details[data-v-44679b4d]{margin-top:6px}.reflection summary[data-v-44679b4d]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-44679b4d]{margin:8px 0 0;font-size:12.5px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}@media (max-width:900px){.stat-grid[data-v-44679b4d]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-44679b4d]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-44679b4d]{padding:var(--space-lg)}.header-actions[data-v-44679b4d]{padding-top:0}.memory-list[data-v-44679b4d]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
