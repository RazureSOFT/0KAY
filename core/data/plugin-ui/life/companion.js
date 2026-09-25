import { defineComponent as F, ref as c, computed as N, onMounted as $, openBlock as l, createElementBlock as n, createElementVNode as t, toDisplayString as e, createCommentVNode as d, createStaticVNode as x, withModifiers as j, withDirectives as b, vModelText as m, Fragment as r, renderList as u, normalizeClass as E, createTextVNode as V, normalizeStyle as B } from "vue";
import { _ as O } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
const U = { class: "page" }, z = { class: "page-inner" }, A = { class: "page-header" }, P = { class: "header-actions" }, T = ["disabled"], D = {
  key: 0,
  class: "error-banner"
}, H = { class: "stat-grid" }, J = { class: "stat-card" }, W = { class: "stat-value" }, q = { class: "stat-card" }, G = { class: "stat-value" }, K = { class: "stat-card" }, Q = { class: "stat-value" }, R = { class: "stat-card" }, X = { class: "stat-value" }, Y = { class: "grid" }, Z = { class: "card" }, tt = { class: "item-list" }, st = { class: "item-main" }, at = { class: "item-meta" }, et = { class: "item-actions" }, lt = ["onClick"], nt = ["onClick"], ot = {
  key: 0,
  class: "list-empty"
}, it = { class: "item-list" }, dt = { class: "check-label" }, rt = ["checked", "onChange"], ct = { class: "item-main" }, ut = { class: "item-meta" }, vt = {
  key: 0,
  class: "list-empty"
}, pt = { class: "card" }, ht = { class: "card-head" }, _t = { class: "chip muted" }, bt = { class: "rel-list" }, mt = { class: "avatar" }, gt = { class: "rel-main" }, ft = { class: "rel-top" }, kt = { class: "chip" }, yt = { class: "rel-meter" }, wt = { class: "meter-bar" }, Ct = { class: "item-meta" }, xt = {
  key: 0,
  class: "list-empty"
}, Mt = { class: "card" }, jt = { class: "item-list" }, Et = { class: "item-main" }, Lt = { class: "item-meta" }, Vt = { class: "chip" }, It = {
  key: 0,
  class: "list-empty"
}, St = { class: "card" }, Ft = { class: "card-head" }, Nt = { class: "chip muted" }, $t = { class: "item-list" }, Bt = { class: "item-main" }, Ot = { class: "item-meta" }, Ut = {
  key: 0,
  class: "list-empty"
}, zt = { class: "card" }, At = { class: "feed" }, Pt = {
  key: 0,
  class: "list-empty plain"
}, Tt = { class: "card" }, Dt = { class: "feed" }, Ht = {
  key: 0,
  class: "list-empty plain"
}, Jt = { class: "card audit-card" }, Wt = { class: "card-head" }, qt = { class: "timeline" }, Gt = { class: "tl-body" }, Kt = { class: "tl-head" }, Qt = { class: "item-meta" }, Rt = { class: "tl-detail" }, Xt = {
  key: 0,
  class: "list-empty plain"
}, Yt = /* @__PURE__ */ F({
  __name: "CompanionPage",
  setup(Zt) {
    const o = c({ relationships: [], agenda: [], journal: [], dreams: [], audit: [], groups: {}, proactive: {} }), g = c(!1), p = c(""), h = c(""), f = c(""), k = c(""), y = c(""), w = c(""), C = N(() => Object.entries(o.value.groups || {}));
    async function M() {
      g.value = !0, p.value = "";
      try {
        const i = await fetch("/api/life/companion");
        if (!i.ok) throw Error(String(i.status));
        o.value = await i.json();
      } catch (i) {
        p.value = i?.message || "无法读取 LIFE 陪伴状态";
      } finally {
        g.value = !1;
      }
    }
    async function v(i, a) {
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: i, payload: a }) });
        if (!s.ok) throw Error(await s.text());
        await M();
      } catch (s) {
        p.value = s?.message || "操作失败";
      }
    }
    async function I() {
      h.value.trim() && (await v("add_agenda", { title: h.value, when: f.value, detail: k.value }), h.value = "", f.value = "", k.value = "");
    }
    async function L(i, a) {
      a.trim() && (await v(i, { content: a }), i === "journal" ? y.value = "" : w.value = "");
    }
    function S(i) {
      return `${Math.round(Math.max(0, Math.min(1, i || 0)) * 100)}%`;
    }
    return $(M), (i, a) => (l(), n("main", U, [
      t("div", z, [
        t("header", A, [
          a[8] || (a[8] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / COMPANION"),
            t("h1", null, "陪伴面板"),
            t("p", { class: "subtitle" }, "日程、关系、生活状态、梦境、日记、群聊观察和主动行为审计均由 LIFE 插件维护。")
          ], -1)),
          t("div", P, [
            t("button", {
              class: "btn btn-tonal",
              disabled: g.value,
              onClick: M
            }, e(g.value ? "刷新中…" : "刷新"), 9, T)
          ])
        ]),
        p.value ? (l(), n("p", D, e(p.value), 1)) : d("", !0),
        t("section", H, [
          t("article", J, [
            a[9] || (a[9] = x('<div class="stat-head" data-v-eb1b4f5a><span class="icon-badge tone-1" aria-hidden="true" data-v-eb1b4f5a><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-eb1b4f5a><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" data-v-eb1b4f5a></circle><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6M17.6 14.7c2 .7 3.3 2.2 3.7 4.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-eb1b4f5a></path></svg></span><span class="stat-label" data-v-eb1b4f5a>关系对象</span></div>', 1)),
            t("strong", W, e(o.value.relationships?.length || 0), 1),
            a[10] || (a[10] = t("span", { class: "stat-hint" }, "被 LIFE 记住的人", -1))
          ]),
          t("article", q, [
            a[11] || (a[11] = x('<div class="stat-head" data-v-eb1b4f5a><span class="icon-badge tone-2" aria-hidden="true" data-v-eb1b4f5a><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-eb1b4f5a><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7" data-v-eb1b4f5a></rect><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-eb1b4f5a></path></svg></span><span class="stat-label" data-v-eb1b4f5a>活动日程</span></div>', 1)),
            t("strong", G, e(o.value.agenda?.filter((s) => s.status === "active").length || 0), 1),
            a[12] || (a[12] = t("span", { class: "stat-hint" }, "待确认 + 已确认", -1))
          ]),
          t("article", K, [
            a[13] || (a[13] = x('<div class="stat-head" data-v-eb1b4f5a><span class="icon-badge tone-3" aria-hidden="true" data-v-eb1b4f5a><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-eb1b4f5a><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" data-v-eb1b4f5a></path><path d="M18.5 15.5l.8 2.1 2.2.8-2.2.8-.8 2.1-.8-2.1-2.2-.8 2.2-.8.8-2.1z" fill="currentColor" data-v-eb1b4f5a></path></svg></span><span class="stat-label" data-v-eb1b4f5a>已投递主动行为</span></div>', 1)),
            t("strong", Q, e(o.value.proactive?.candidates?.filter((s) => s.status === "delivered").length || 0), 1),
            a[14] || (a[14] = t("span", { class: "stat-hint" }, "LIFE 主动发起", -1))
          ]),
          t("article", R, [
            a[15] || (a[15] = x('<div class="stat-head" data-v-eb1b4f5a><span class="icon-badge tone-4" aria-hidden="true" data-v-eb1b4f5a><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-eb1b4f5a><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-eb1b4f5a></path></svg></span><span class="stat-label" data-v-eb1b4f5a>已观察群聊</span></div>', 1)),
            t("strong", X, e(C.value.length), 1),
            a[16] || (a[16] = t("span", { class: "stat-hint" }, "群消息学习", -1))
          ])
        ]),
        t("section", Y, [
          t("article", Z, [
            a[18] || (a[18] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "日程")
            ], -1)),
            t("form", {
              class: "agenda-form",
              onSubmit: j(I, ["prevent"])
            }, [
              b(t("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (s) => h.value = s),
                class: "input",
                placeholder: "日程标题",
                "aria-label": "日程标题"
              }, null, 512), [
                [m, h.value]
              ]),
              b(t("input", {
                "onUpdate:modelValue": a[1] || (a[1] = (s) => f.value = s),
                class: "input",
                placeholder: "时间，例如 2026-09-25 20:00",
                "aria-label": "时间"
              }, null, 512), [
                [m, f.value]
              ]),
              a[17] || (a[17] = t("button", {
                class: "btn btn-primary",
                type: "submit"
              }, "创建候选", -1)),
              b(t("textarea", {
                "onUpdate:modelValue": a[2] || (a[2] = (s) => k.value = s),
                class: "input area",
                placeholder: "说明（可选）"
              }, null, 512), [
                [m, k.value]
              ])
            ], 32),
            a[19] || (a[19] = t("h3", { class: "section-label" }, "待确认候选", -1)),
            t("ul", tt, [
              (l(!0), n(r, null, u(o.value.calendar_candidates?.filter((s) => s.status === "pending_confirmation"), (s) => (l(), n("li", {
                key: s.id,
                class: "item"
              }, [
                t("div", st, [
                  t("strong", null, e(s.title), 1),
                  t("span", at, e(s.when_text) + " · " + e(s.detail || "等待你确认"), 1)
                ]),
                t("div", et, [
                  t("button", {
                    class: "btn btn-primary btn-sm",
                    onClick: (_) => v("confirm_agenda", { id: s.id })
                  }, "确认", 8, lt),
                  t("button", {
                    class: "btn btn-danger btn-sm",
                    onClick: (_) => v("reject_agenda", { id: s.id })
                  }, "拒绝", 8, nt)
                ])
              ]))), 128)),
              o.value.calendar_candidates?.filter((s) => s.status === "pending_confirmation").length ? d("", !0) : (l(), n("li", ot, "没有待确认的日程候选"))
            ]),
            a[20] || (a[20] = t("h3", { class: "section-label" }, "已确认日程", -1)),
            t("ul", it, [
              (l(!0), n(r, null, u(o.value.agenda, (s) => (l(), n("li", {
                key: s.id,
                class: "item"
              }, [
                t("label", dt, [
                  t("input", {
                    checked: s.status === "completed",
                    type: "checkbox",
                    onChange: (_) => v("complete_agenda", { id: s.id })
                  }, null, 40, rt)
                ]),
                t("div", ct, [
                  t("strong", {
                    class: E({ done: s.status === "completed" })
                  }, e(s.title), 3),
                  t("span", ut, [
                    V(e(s.start_at), 1),
                    s.detail ? (l(), n(r, { key: 0 }, [
                      V(" · " + e(s.detail), 1)
                    ], 64)) : d("", !0)
                  ])
                ])
              ]))), 128)),
              o.value.agenda?.length ? d("", !0) : (l(), n("li", vt, "暂无已确认日程"))
            ])
          ]),
          t("article", pt, [
            t("div", ht, [
              a[21] || (a[21] = t("h2", { class: "card-title" }, "关系账本", -1)),
              t("span", _t, e(o.value.relationships?.length || 0), 1)
            ]),
            t("ul", bt, [
              (l(!0), n(r, null, u(o.value.relationships, (s) => (l(), n("li", {
                key: s.user_id,
                class: "rel"
              }, [
                t("span", mt, e((s.user_id || "?").slice(0, 1).toUpperCase()), 1),
                t("div", gt, [
                  t("div", ft, [
                    t("strong", null, e(s.user_id), 1),
                    t("span", kt, e(s.stage), 1)
                  ]),
                  t("div", yt, [
                    t("div", wt, [
                      t("i", {
                        style: B({ width: S(s.affinity) })
                      }, null, 4)
                    ]),
                    t("b", null, e(Math.round((s.affinity || 0) * 100)) + "%", 1)
                  ]),
                  t("span", Ct, "最近互动：" + e(s.last_seen || "暂无"), 1)
                ])
              ]))), 128)),
              o.value.relationships?.length ? d("", !0) : (l(), n("li", xt, "暂无关系记录"))
            ])
          ]),
          t("article", Mt, [
            a[22] || (a[22] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "成长中的性格")
            ], -1)),
            t("ul", jt, [
              (l(!0), n(r, null, u(o.value.persona_evolution, (s) => (l(), n("li", {
                key: s.id,
                class: "item trait-item"
              }, [
                t("div", Et, [
                  t("strong", null, e(s.trait), 1),
                  t("span", Lt, "支持 " + e(s.support_count) + " 次 · 置信度 " + e(Math.round(s.confidence * 100)) + "%", 1)
                ]),
                t("span", Vt, e(s.value), 1)
              ]))), 128)),
              o.value.persona_evolution?.length ? d("", !0) : (l(), n("li", It, "LIFE 还在观察，重复出现的稳定倾向才会被确认。"))
            ])
          ]),
          t("article", St, [
            t("div", Ft, [
              a[23] || (a[23] = t("h2", { class: "card-title" }, "群聊观察", -1)),
              t("span", Nt, e(C.value.length), 1)
            ]),
            t("ul", $t, [
              (l(!0), n(r, null, u(C.value, ([s, _]) => (l(), n("li", {
                key: s,
                class: "item"
              }, [
                t("div", Bt, [
                  t("strong", null, e(s), 1),
                  t("span", Ot, e(_.messages?.length || 0) + " 条观察 · " + e(Object.keys(_.members || {}).length) + " 位成员", 1)
                ])
              ]))), 128)),
              C.value.length ? d("", !0) : (l(), n("li", Ut, "群聊观察尚未启用或没有消息。"))
            ])
          ]),
          t("article", zt, [
            a[25] || (a[25] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "日记")
            ], -1)),
            t("form", {
              class: "stack-form",
              onSubmit: a[4] || (a[4] = j((s) => L("journal", y.value), ["prevent"]))
            }, [
              b(t("textarea", {
                "onUpdate:modelValue": a[3] || (a[3] = (s) => y.value = s),
                class: "input area",
                placeholder: "记录 LIFE 的日记…"
              }, null, 512), [
                [m, y.value]
              ]),
              a[24] || (a[24] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "写入日记", -1))
            ], 32),
            t("ol", At, [
              (l(!0), n(r, null, u(o.value.journal, (s) => (l(), n("li", {
                key: s.id
              }, [
                t("time", null, e(s.at), 1),
                t("p", null, e(s.content), 1)
              ]))), 128)),
              o.value.journal?.length ? d("", !0) : (l(), n("li", Pt, "还没有日记"))
            ])
          ]),
          t("article", Tt, [
            a[27] || (a[27] = t("div", { class: "card-head" }, [
              t("h2", { class: "card-title" }, "梦境")
            ], -1)),
            t("form", {
              class: "stack-form",
              onSubmit: a[6] || (a[6] = j((s) => L("dream", w.value), ["prevent"]))
            }, [
              b(t("textarea", {
                "onUpdate:modelValue": a[5] || (a[5] = (s) => w.value = s),
                class: "input area",
                placeholder: "记录一个梦境或睡眠反思…"
              }, null, 512), [
                [m, w.value]
              ]),
              a[26] || (a[26] = t("button", {
                class: "btn btn-tonal",
                type: "submit"
              }, "记录梦境", -1))
            ], 32),
            t("ol", Dt, [
              (l(!0), n(r, null, u(o.value.dreams, (s) => (l(), n("li", {
                key: s.id
              }, [
                t("time", null, e(s.at), 1),
                t("p", null, e(s.content), 1)
              ]))), 128)),
              o.value.dreams?.length ? d("", !0) : (l(), n("li", Ht, "还没有梦境记录"))
            ])
          ])
        ]),
        t("article", Jt, [
          t("div", Wt, [
            a[28] || (a[28] = t("h2", { class: "card-title" }, "主动行为审计", -1)),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: a[7] || (a[7] = (s) => v("memory_maintenance", {}))
            }, "执行记忆维护与备份")
          ]),
          t("ol", qt, [
            (l(!0), n(r, null, u(o.value.audit, (s) => (l(), n("li", {
              key: s.at + s.kind
            }, [
              t("span", {
                class: E(["dot", s.outcome === "ok" ? "ok" : "warn"]),
                "aria-hidden": "true"
              }, null, 2),
              t("div", Gt, [
                t("div", Kt, [
                  t("strong", null, e(s.kind), 1),
                  t("span", {
                    class: E(["chip", s.outcome === "ok" ? "chip-ok" : "chip-warn"])
                  }, e(s.outcome), 3),
                  t("time", null, e(s.at), 1)
                ]),
                t("p", Qt, e(s.target), 1),
                t("p", Rt, e(s.detail), 1)
              ])
            ]))), 128)),
            o.value.audit?.length ? d("", !0) : (l(), n("li", Xt, "暂无审计记录"))
          ])
        ])
      ])
    ]));
  }
}), as = /* @__PURE__ */ O(Yt, [["__scopeId", "data-v-eb1b4f5a"]]);
export {
  as as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-eb1b4f5a]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-eb1b4f5a]{max-width:1180px;margin:0 auto}.page-header[data-v-eb1b4f5a]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-eb1b4f5a]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-eb1b4f5a]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em;color:var(--md-on-surface)}.subtitle[data-v-eb1b4f5a]{margin:6px 0 0;max-width:620px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-eb1b4f5a]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-eb1b4f5a]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-eb1b4f5a]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-eb1b4f5a]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-eb1b4f5a]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-eb1b4f5a]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-eb1b4f5a]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-eb1b4f5a]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-eb1b4f5a]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-eb1b4f5a]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-eb1b4f5a]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-eb1b4f5a]{display:flex;align-items:center;gap:10px}.stat-label[data-v-eb1b4f5a]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-eb1b4f5a]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1;color:var(--md-on-surface)}.stat-hint[data-v-eb1b4f5a]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-eb1b4f5a]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-eb1b4f5a]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-eb1b4f5a]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-eb1b4f5a]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-eb1b4f5a]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-eb1b4f5a]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-eb1b4f5a]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-eb1b4f5a]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-eb1b4f5a]{margin:0;font-size:16px;font-weight:650;color:var(--md-on-surface)}.section-label[data-v-eb1b4f5a]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-eb1b4f5a]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-eb1b4f5a]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip-ok[data-v-eb1b4f5a]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-eb1b4f5a]{background:#fff1dc;color:#7a4400}.input[data-v-eb1b4f5a]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1 inherit;outline:none;transition:border-color .15s,box-shadow .15s}.input[data-v-eb1b4f5a]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input[data-v-eb1b4f5a]::placeholder{color:var(--md-on-surface-variant);opacity:.8}.input.area[data-v-eb1b4f5a]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.agenda-form[data-v-eb1b4f5a]{display:grid;grid-template-columns:1fr 240px auto;gap:10px}.agenda-form .area[data-v-eb1b4f5a]{grid-column:1/-1}.stack-form[data-v-eb1b4f5a]{display:flex;flex-direction:column;gap:10px;align-items:flex-start}.stack-form .btn[data-v-eb1b4f5a]{margin-top:2px}.item-list[data-v-eb1b4f5a],.rel-list[data-v-eb1b4f5a],.feed[data-v-eb1b4f5a],.timeline[data-v-eb1b4f5a]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-eb1b4f5a]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);transition:border-color .15s,background .15s}.item[data-v-eb1b4f5a]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-eb1b4f5a]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-eb1b4f5a]{font-size:14px;font-weight:600;color:var(--md-on-surface)}.item-main strong.done[data-v-eb1b4f5a]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-eb1b4f5a]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-eb1b4f5a]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-eb1b4f5a]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-eb1b4f5a]{background:transparent;border:0}.check-label[data-v-eb1b4f5a]{display:flex;align-items:center}.check-label input[data-v-eb1b4f5a]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-eb1b4f5a]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-eb1b4f5a]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.avatar[data-v-eb1b4f5a]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-eb1b4f5a]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-eb1b4f5a]{display:flex;align-items:center;gap:8px}.rel-top strong[data-v-eb1b4f5a]{font-size:14px}.rel-meter[data-v-eb1b4f5a]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-eb1b4f5a]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-eb1b4f5a]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-eb1b4f5a]{font-size:12px;color:var(--md-on-surface)}.feed li[data-v-eb1b4f5a]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed time[data-v-eb1b4f5a],.timeline time[data-v-eb1b4f5a]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-eb1b4f5a]{margin:5px 0 0;font-size:13.5px;line-height:1.65;white-space:pre-wrap;color:var(--md-on-surface)}.audit-card[data-v-eb1b4f5a]{margin-bottom:var(--space-lg)}.timeline[data-v-eb1b4f5a]{position:relative}.timeline li[data-v-eb1b4f5a]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-eb1b4f5a]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-eb1b4f5a]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}.dot.ok[data-v-eb1b4f5a]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-eb1b4f5a]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-eb1b4f5a]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-eb1b4f5a]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-eb1b4f5a]{font-size:13.5px;font-weight:650}.tl-detail[data-v-eb1b4f5a]{margin:4px 0 0;font-size:12.5px;color:var(--md-on-surface);background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-eb1b4f5a]{grid-template-columns:repeat(2,1fr)}.grid[data-v-eb1b4f5a],.agenda-form[data-v-eb1b4f5a]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-eb1b4f5a]{padding:var(--space-lg)}.header-actions[data-v-eb1b4f5a]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-7a517320]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-7a517320]{max-width:1180px;margin:0 auto}.page-header[data-v-7a517320]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-7a517320]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-7a517320]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em;color:var(--md-on-surface)}.subtitle[data-v-7a517320]{margin:6px 0 0;max-width:620px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-7a517320]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-7a517320]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-7a517320]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-7a517320]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-tonal[data-v-7a517320]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-7a517320]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-7a517320]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-7a517320]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-7a517320]{display:flex;align-items:center;gap:10px}.stat-label[data-v-7a517320]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-7a517320]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1;color:var(--md-on-surface)}.stat-hint[data-v-7a517320]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-7a517320]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-7a517320]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-7a517320]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-7a517320]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-7a517320]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-7a517320]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1)}.search-card[data-v-7a517320]{padding:var(--space-md);margin-bottom:var(--space-lg)}.search-field[data-v-7a517320]{display:flex;align-items:center;gap:12px}.search-icon[data-v-7a517320]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-7a517320]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-7a517320]::placeholder{color:var(--md-on-surface-variant);opacity:.8}.chip[data-v-7a517320]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-7a517320]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-work[data-v-7a517320]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tier-short[data-v-7a517320]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-7a517320]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.error-banner[data-v-7a517320]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.memory-list[data-v-7a517320]{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:var(--space-lg)}.memory-card[data-v-7a517320]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-7a517320]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-7a517320]{display:flex;align-items:center;gap:10px}.memory-id[data-v-7a517320]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:3px 7px;border-radius:6px}.btn-icon[data-v-7a517320]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;transition:background .15s,color .15s}.btn-icon.danger[data-v-7a517320]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-7a517320]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap;color:var(--md-on-surface)}.tags[data-v-7a517320]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-7a517320]{font-size:12px;font-weight:500;color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-7a517320]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:auto;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-7a517320]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-7a517320]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-7a517320]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-7a517320]{background:var(--md-primary)}.fill-secondary[data-v-7a517320]{background:var(--md-secondary,#536255)}.meter b[data-v-7a517320]{font-weight:600;color:var(--md-on-surface)}.memory-foot time[data-v-7a517320]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.empty-state[data-v-7a517320]{grid-column:1/-1;padding:64px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-icon[data-v-7a517320]{width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:var(--md-surface-container-high);display:grid;place-items:center;color:var(--md-on-surface-variant)}.empty-state p[data-v-7a517320]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-7a517320]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}@media (max-width:900px){.stat-grid[data-v-7a517320]{grid-template-columns:repeat(2,1fr)}}@media (max-width:640px){.page[data-v-7a517320]{padding:var(--space-lg)}.header-actions[data-v-7a517320]{padding-top:0}.memory-list[data-v-7a517320]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
