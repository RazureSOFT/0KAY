import { ref as m, defineComponent as j, watch as A, nextTick as D, openBlock as v, createBlock as I, Teleport as P, unref as w, createElementBlock as p, withModifiers as H, createElementVNode as t, toDisplayString as n, normalizeClass as F, createCommentVNode as M, computed as S, onMounted as O, createTextVNode as q, createStaticVNode as C, withDirectives as z, vModelText as K, Fragment as B, renderList as N, normalizeStyle as V, createVNode as J } from "vue";
import { _ as R } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
const _ = m(null);
function $() {
  function x(r) {
    const i = typeof r == "string" ? { message: r } : r;
    return _.value && _.value.resolve(!1), new Promise((d) => {
      _.value = { options: i, resolve: d };
    });
  }
  function l(r) {
    const i = _.value;
    _.value = null, i?.resolve(r);
  }
  return { confirmState: _, confirm: x, settle: l };
}
const U = /* @__PURE__ */ j({
  __name: "ConfirmDialog",
  setup(x) {
    const { confirmState: l, settle: r } = $(), i = m(null), d = m(null);
    let h = null;
    const u = () => (document.documentElement.lang || "").startsWith("en"), f = () => l.value?.options.title || (u() ? "Confirm" : "请确认"), b = () => l.value?.options.confirmLabel || (u() ? "Confirm" : "确认"), g = () => l.value?.options.cancelLabel || (u() ? "Cancel" : "取消");
    A(() => !!l.value, async (c) => {
      c ? (h = document.activeElement, await D(), i.value?.focus(), d.value?.focus()) : (i.value = null, h?.focus?.());
    });
    function T(c) {
      if (!l.value) return;
      if (c.key === "Escape") {
        c.preventDefault(), r(!1);
        return;
      }
      if (c.key !== "Tab" || !i.value) return;
      const o = [...i.value.querySelectorAll("button:not(:disabled)")];
      if (!o.length) return;
      const k = o[0], y = o[o.length - 1];
      c.shiftKey && document.activeElement === k ? (c.preventDefault(), y.focus()) : !c.shiftKey && document.activeElement === y && (c.preventDefault(), k.focus());
    }
    return (c, o) => (v(), I(P, { to: "body" }, [
      w(l) ? (v(), p("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: o[2] || (o[2] = H((k) => w(r)(!1), ["self"])),
        onKeydown: T
      }, [
        t("section", {
          ref_key: "dialog",
          ref: i,
          class: "confirm-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          t("h2", null, n(f()), 1),
          t("p", null, n(w(l).options.message), 1),
          t("footer", null, [
            t("button", {
              ref_key: "cancelBtn",
              ref: d,
              type: "button",
              onClick: o[0] || (o[0] = (k) => w(r)(!1))
            }, n(g()), 513),
            t("button", {
              type: "button",
              class: F(["confirm-primary", { danger: w(l).options.danger !== !1 }]),
              onClick: o[1] || (o[1] = (k) => w(r)(!0))
            }, n(b()), 3)
          ])
        ], 512)
      ], 32)) : M("", !0)
    ]));
  }
}), W = { class: "page" }, Y = { class: "page-inner" }, G = { class: "page-header" }, Q = { class: "header-actions" }, X = ["disabled"], Z = ["disabled"], tt = { class: "stat-grid" }, et = { class: "stat-card" }, at = { class: "stat-value" }, st = { class: "stat-card" }, nt = { class: "stat-value" }, ot = { class: "stat-card" }, rt = { class: "stat-value" }, lt = { class: "stat-card" }, it = { class: "stat-value" }, ct = { class: "card search-card" }, dt = { class: "search-field" }, ut = { class: "chip muted" }, vt = {
  key: 0,
  class: "error-banner"
}, ht = { class: "memory-list" }, pt = { class: "card-top" }, ft = { class: "memory-id" }, mt = ["onClick"], gt = { class: "memory-content" }, kt = {
  key: 0,
  class: "tags"
}, wt = { class: "memory-foot" }, _t = {
  class: "meter",
  title: "重要性"
}, bt = { class: "meter-bar" }, yt = {
  class: "meter",
  title: "强度"
}, Ct = { class: "meter-bar" }, Mt = {
  key: 0,
  class: "empty-state"
}, xt = /* @__PURE__ */ j({
  __name: "MemoryPage",
  setup(x) {
    const { confirm: l } = $(), r = m(""), i = m([]), d = m({ working: 0, shortTerm: { total: 0 }, longTerm: 0, avgStrength: 0 }), h = m(!1), u = m(""), f = S(() => i.value), b = S(() => ({
      working: f.value.filter((s) => s.tier === "working").length,
      short: f.value.filter((s) => s.tier === "short_term").length,
      long: f.value.filter((s) => s.tier === "long_term").length
    }));
    function g(s) {
      return `${Math.round(Math.max(0, Math.min(1, s || 0)) * 100)}%`;
    }
    function T(s) {
      return s === "long_term" ? "长期记忆" : s === "short_term" ? "短期记忆" : "工作记忆";
    }
    function c(s) {
      if (!s) return "";
      const e = new Date(s);
      return Number.isNaN(e.getTime()) ? s : e.toLocaleString();
    }
    async function o() {
      h.value = !0, u.value = "";
      try {
        const s = new URLSearchParams({ limit: "200" });
        r.value.trim() && s.set("query", r.value.trim());
        const e = await fetch(`/api/life/memories?${s}`);
        if (!e.ok) throw new Error(`HTTP ${e.status}`);
        const a = await e.json();
        i.value = Array.isArray(a.memories) ? a.memories : [], d.value = a.stats || d.value, a.error && (u.value = a.error);
      } catch (s) {
        u.value = s?.message || "无法读取 LIFE 记忆";
      } finally {
        h.value = !1;
      }
    }
    async function k(s) {
      if (await l({
        title: "删除记忆",
        message: "删除会撤销该记忆并重建检索投影，继续吗？",
        confirmLabel: "删除",
        danger: !0
      }))
        try {
          const a = await fetch("/api/life/companion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete_memory", payload: { id: s } })
          });
          if (!a.ok) throw new Error(await a.text());
          await o();
        } catch (a) {
          u.value = a?.message || "删除失败";
        }
    }
    async function y() {
      if (await l({
        title: "清除全部记忆",
        message: "这会清除工作、短期、长期记忆、笔记块和反思提案，无法恢复。确定继续吗？",
        confirmLabel: "全部清除",
        danger: !0
      }))
        try {
          const e = await fetch("/api/life/companion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "clear_all_memory", payload: {} })
          });
          if (!e.ok) throw new Error(await e.text());
          await o();
        } catch (e) {
          u.value = e?.message || "清除失败";
        }
    }
    let E = null;
    return A(r, () => {
      E && clearTimeout(E), E = setTimeout(o, 250);
    }), O(o), (s, e) => (v(), p("main", W, [
      t("div", Y, [
        t("header", G, [
          e[2] || (e[2] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / MEMORY"),
            t("h1", null, "记忆管理台"),
            t("p", { class: "subtitle" }, "浏览 LIFE 主动记忆、遗忘强度和检索结果。记忆由 LIFE 插件注册；禁用 LIFE 后此入口会消失。")
          ], -1)),
          t("div", Q, [
            t("button", {
              class: "btn btn-danger",
              disabled: h.value,
              onClick: y
            }, [...e[1] || (e[1] = [
              t("svg", {
                width: "15",
                height: "15",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                t("path", {
                  d: "M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13",
                  stroke: "currentColor",
                  "stroke-width": "1.8",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ], -1),
              q(" 一键清除 ", -1)
            ])], 8, X),
            t("button", {
              class: "btn btn-tonal",
              disabled: h.value,
              onClick: o
            }, n(h.value ? "刷新中…" : "刷新"), 9, Z)
          ])
        ]),
        t("section", tt, [
          t("article", et, [
            e[3] || (e[3] = C('<div class="stat-head" data-v-7a517320><span class="icon-badge tone-1" aria-hidden="true" data-v-7a517320><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-7a517320><path d="M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18m0-13a3 3 0 013 3v.5a2.5 2.5 0 012.5 2.5 2.5 2.5 0 01-1.5 4.5c.4 1.2.1 2.6-1 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-7a517320></path></svg></span><span class="stat-label" data-v-7a517320>工作记忆</span></div>', 1)),
            t("strong", at, n(d.value.working), 1),
            e[4] || (e[4] = t("span", { class: "stat-hint" }, "当前上下文", -1))
          ]),
          t("article", st, [
            e[5] || (e[5] = C('<div class="stat-head" data-v-7a517320><span class="icon-badge tone-2" aria-hidden="true" data-v-7a517320><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-7a517320><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" data-v-7a517320></circle><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-7a517320></path></svg></span><span class="stat-label" data-v-7a517320>短期记忆</span></div>', 1)),
            t("strong", nt, n(d.value.shortTerm?.total || b.value.short), 1),
            e[6] || (e[6] = t("span", { class: "stat-hint" }, "待巩固记录", -1))
          ]),
          t("article", ot, [
            e[7] || (e[7] = C('<div class="stat-head" data-v-7a517320><span class="icon-badge tone-3" aria-hidden="true" data-v-7a517320><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-7a517320><path d="M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 21.5v-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-7a517320></path><path d="M9 7.5h6M9 11h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-7a517320></path></svg></span><span class="stat-label" data-v-7a517320>长期记忆</span></div>', 1)),
            t("strong", rt, n(d.value.longTerm || b.value.long), 1),
            e[8] || (e[8] = t("span", { class: "stat-hint" }, "稳定沉淀", -1))
          ]),
          t("article", lt, [
            e[9] || (e[9] = C('<div class="stat-head" data-v-7a517320><span class="icon-badge tone-4" aria-hidden="true" data-v-7a517320><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-7a517320><path d="M4 14l4-4 3 3 5-6 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-7a517320></path><path d="M4 19h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-7a517320></path></svg></span><span class="stat-label" data-v-7a517320>平均强度</span></div>', 1)),
            t("strong", it, n(g(d.value.avgStrength)), 1),
            e[10] || (e[10] = t("span", { class: "stat-hint" }, "遗忘曲线后的值", -1))
          ])
        ]),
        t("section", ct, [
          t("div", dt, [
            e[11] || (e[11] = t("svg", {
              class: "search-icon",
              width: "17",
              height: "17",
              viewBox: "0 0 24 24",
              fill: "none",
              "aria-hidden": "true"
            }, [
              t("circle", {
                cx: "11",
                cy: "11",
                r: "6.5",
                stroke: "currentColor",
                "stroke-width": "1.8"
              }),
              t("path", {
                d: "M16 16l4.5 4.5",
                stroke: "currentColor",
                "stroke-width": "1.8",
                "stroke-linecap": "round"
              })
            ], -1)),
            z(t("input", {
              "onUpdate:modelValue": e[0] || (e[0] = (a) => r.value = a),
              placeholder: "搜索记忆内容、标签或笔记引用",
              "aria-label": "搜索记忆"
            }, null, 512), [
              [K, r.value]
            ]),
            t("span", ut, n(f.value.length) + " 条结果", 1)
          ])
        ]),
        u.value ? (v(), p("p", vt, n(u.value), 1)) : M("", !0),
        t("section", ht, [
          (v(!0), p(B, null, N(f.value, (a) => (v(), p("article", {
            key: a.id,
            class: "memory-card"
          }, [
            t("div", pt, [
              t("span", {
                class: F(["chip", "tier-" + (a.tier === "long_term" ? "long" : a.tier === "short_term" ? "short" : "work")])
              }, n(T(a.tier)), 3),
              t("code", ft, n(a.id.slice(0, 8)), 1),
              t("button", {
                class: "btn-icon danger",
                title: "删除记忆",
                onClick: (L) => k(a.id)
              }, [...e[12] || (e[12] = [
                t("svg", {
                  width: "15",
                  height: "15",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  t("path", {
                    d: "M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13",
                    stroke: "currentColor",
                    "stroke-width": "1.8",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  })
                ], -1)
              ])], 8, mt)
            ]),
            t("p", gt, n(a.content), 1),
            a.tags?.length ? (v(), p("div", kt, [
              (v(!0), p(B, null, N(a.tags, (L) => (v(), p("span", { key: L }, "#" + n(L), 1))), 128))
            ])) : M("", !0),
            t("footer", wt, [
              t("div", _t, [
                e[13] || (e[13] = t("span", null, "重要性", -1)),
                t("div", bt, [
                  t("i", {
                    style: V({ width: g(a.importance) }),
                    class: "fill-primary"
                  }, null, 4)
                ]),
                t("b", null, n(g(a.importance)), 1)
              ]),
              t("div", yt, [
                e[14] || (e[14] = t("span", null, "强度", -1)),
                t("div", Ct, [
                  t("i", {
                    style: V({ width: g(a.strength) }),
                    class: "fill-secondary"
                  }, null, 4)
                ]),
                t("b", null, n(g(a.strength)), 1)
              ]),
              t("time", null, n(c(a.created_at)), 1)
            ])
          ]))), 128)),
          !h.value && !f.value.length ? (v(), p("div", Mt, [...e[15] || (e[15] = [
            t("div", {
              class: "empty-icon",
              "aria-hidden": "true"
            }, [
              t("svg", {
                width: "26",
                height: "26",
                viewBox: "0 0 24 24",
                fill: "none"
              }, [
                t("path", {
                  d: "M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18m0-13a3 3 0 013 3v.5a2.5 2.5 0 012.5 2.5 2.5 2.5 0 01-1.5 4.5c.4 1.2.1 2.6-1 3.5",
                  stroke: "currentColor",
                  "stroke-width": "1.6",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ])
            ], -1),
            t("p", null, "暂无匹配记忆", -1),
            t("p", { class: "hint" }, "LIFE 会在对话和主动工具调用中逐步沉淀记忆。", -1)
          ])])) : M("", !0)
        ])
      ]),
      J(U)
    ]));
  }
}), Lt = /* @__PURE__ */ R(xt, [["__scopeId", "data-v-7a517320"]]);
export {
  Lt as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent=".page[data-v-eb1b4f5a]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-eb1b4f5a]{max-width:1180px;margin:0 auto}.page-header[data-v-eb1b4f5a]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-eb1b4f5a]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-eb1b4f5a]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em;color:var(--md-on-surface)}.subtitle[data-v-eb1b4f5a]{margin:6px 0 0;max-width:620px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-eb1b4f5a]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-eb1b4f5a]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-eb1b4f5a]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-eb1b4f5a]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-eb1b4f5a]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-eb1b4f5a]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-eb1b4f5a]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-eb1b4f5a]{background:var(--md-error-container);color:#410e0b}.error-banner[data-v-eb1b4f5a]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.stat-grid[data-v-eb1b4f5a]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-eb1b4f5a]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-eb1b4f5a]{display:flex;align-items:center;gap:10px}.stat-label[data-v-eb1b4f5a]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-eb1b4f5a]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1;color:var(--md-on-surface)}.stat-hint[data-v-eb1b4f5a]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-eb1b4f5a]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-eb1b4f5a]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-eb1b4f5a]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-eb1b4f5a]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-eb1b4f5a]{background:var(--md-success-container);color:#0d3b1e}.grid[data-v-eb1b4f5a]{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}.card[data-v-eb1b4f5a]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}.card-head[data-v-eb1b4f5a]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}.card-title[data-v-eb1b4f5a]{margin:0;font-size:16px;font-weight:650;color:var(--md-on-surface)}.section-label[data-v-eb1b4f5a]{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.chip[data-v-eb1b4f5a]{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}.chip.muted[data-v-eb1b4f5a]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip-ok[data-v-eb1b4f5a]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-eb1b4f5a]{background:#fff1dc;color:#7a4400}.input[data-v-eb1b4f5a]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1 inherit;outline:none;transition:border-color .15s,box-shadow .15s}.input[data-v-eb1b4f5a]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input[data-v-eb1b4f5a]::placeholder{color:var(--md-on-surface-variant);opacity:.8}.input.area[data-v-eb1b4f5a]{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}.agenda-form[data-v-eb1b4f5a]{display:grid;grid-template-columns:1fr 240px auto;gap:10px}.agenda-form .area[data-v-eb1b4f5a]{grid-column:1/-1}.stack-form[data-v-eb1b4f5a]{display:flex;flex-direction:column;gap:10px;align-items:flex-start}.stack-form .btn[data-v-eb1b4f5a]{margin-top:2px}.item-list[data-v-eb1b4f5a],.rel-list[data-v-eb1b4f5a],.feed[data-v-eb1b4f5a],.timeline[data-v-eb1b4f5a]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.item[data-v-eb1b4f5a]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);transition:border-color .15s,background .15s}.item[data-v-eb1b4f5a]:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}.item-main[data-v-eb1b4f5a]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.item-main strong[data-v-eb1b4f5a]{font-size:14px;font-weight:600;color:var(--md-on-surface)}.item-main strong.done[data-v-eb1b4f5a]{text-decoration:line-through;color:var(--md-on-surface-variant)}.item-meta[data-v-eb1b4f5a]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.item-actions[data-v-eb1b4f5a]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-eb1b4f5a]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.list-empty.plain[data-v-eb1b4f5a]{background:transparent;border:0}.check-label[data-v-eb1b4f5a]{display:flex;align-items:center}.check-label input[data-v-eb1b4f5a]{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}.trait-item .chip[data-v-eb1b4f5a]{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rel[data-v-eb1b4f5a]{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.avatar[data-v-eb1b4f5a]{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}.rel-main[data-v-eb1b4f5a]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.rel-top[data-v-eb1b4f5a]{display:flex;align-items:center;gap:8px}.rel-top strong[data-v-eb1b4f5a]{font-size:14px}.rel-meter[data-v-eb1b4f5a]{display:flex;align-items:center;gap:8px}.meter-bar[data-v-eb1b4f5a]{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-eb1b4f5a]{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}.rel-meter b[data-v-eb1b4f5a]{font-size:12px;color:var(--md-on-surface)}.feed li[data-v-eb1b4f5a]{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}.feed time[data-v-eb1b4f5a],.timeline time[data-v-eb1b4f5a]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.feed p[data-v-eb1b4f5a]{margin:5px 0 0;font-size:13.5px;line-height:1.65;white-space:pre-wrap;color:var(--md-on-surface)}.audit-card[data-v-eb1b4f5a]{margin-bottom:var(--space-lg)}.timeline[data-v-eb1b4f5a]{position:relative}.timeline li[data-v-eb1b4f5a]{display:flex;gap:14px;position:relative;padding-bottom:4px}.timeline li[data-v-eb1b4f5a]:not(:last-child):before{content:\"\";position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}.dot[data-v-eb1b4f5a]{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}.dot.ok[data-v-eb1b4f5a]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.dot.warn[data-v-eb1b4f5a]{background:#e08700;box-shadow:0 0 0 3px #fff1dc}.tl-body[data-v-eb1b4f5a]{flex:1;min-width:0;padding-bottom:14px}.tl-head[data-v-eb1b4f5a]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.tl-head strong[data-v-eb1b4f5a]{font-size:13.5px;font-weight:650}.tl-detail[data-v-eb1b4f5a]{margin:4px 0 0;font-size:12.5px;color:var(--md-on-surface);background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}@media (max-width:900px){.stat-grid[data-v-eb1b4f5a]{grid-template-columns:repeat(2,1fr)}.grid[data-v-eb1b4f5a],.agenda-form[data-v-eb1b4f5a]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-eb1b4f5a]{padding:var(--space-lg)}.header-actions[data-v-eb1b4f5a]{padding-top:0}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-7a517320]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-7a517320]{max-width:1180px;margin:0 auto}.page-header[data-v-7a517320]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-7a517320]{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-7a517320]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em;color:var(--md-on-surface)}.subtitle[data-v-7a517320]{margin:6px 0 0;max-width:620px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-7a517320]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}.btn[data-v-7a517320]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-7a517320]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-7a517320]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-tonal[data-v-7a517320]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-7a517320]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-7a517320]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-7a517320]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-7a517320]{display:flex;align-items:center;gap:10px}.stat-label[data-v-7a517320]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-7a517320]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1;color:var(--md-on-surface)}.stat-hint[data-v-7a517320]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-7a517320]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-7a517320]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-7a517320]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-7a517320]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-7a517320]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-7a517320]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1)}.search-card[data-v-7a517320]{padding:var(--space-md);margin-bottom:var(--space-lg)}.search-field[data-v-7a517320]{display:flex;align-items:center;gap:12px}.search-icon[data-v-7a517320]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-7a517320]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-7a517320]::placeholder{color:var(--md-on-surface-variant);opacity:.8}.chip[data-v-7a517320]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-7a517320]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-work[data-v-7a517320]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tier-short[data-v-7a517320]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-7a517320]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.error-banner[data-v-7a517320]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:0 0 var(--space-lg)}.memory-list[data-v-7a517320]{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:var(--space-lg)}.memory-card[data-v-7a517320]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-7a517320]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-7a517320]{display:flex;align-items:center;gap:10px}.memory-id[data-v-7a517320]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:3px 7px;border-radius:6px}.btn-icon[data-v-7a517320]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;transition:background .15s,color .15s}.btn-icon.danger[data-v-7a517320]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-7a517320]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap;color:var(--md-on-surface)}.tags[data-v-7a517320]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-7a517320]{font-size:12px;font-weight:500;color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-7a517320]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:auto;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-7a517320]{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}.meter-bar[data-v-7a517320]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-7a517320]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-7a517320]{background:var(--md-primary)}.fill-secondary[data-v-7a517320]{background:var(--md-secondary,#536255)}.meter b[data-v-7a517320]{font-weight:600;color:var(--md-on-surface)}.memory-foot time[data-v-7a517320]{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}.empty-state[data-v-7a517320]{grid-column:1/-1;padding:64px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-icon[data-v-7a517320]{width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:var(--md-surface-container-high);display:grid;place-items:center;color:var(--md-on-surface-variant)}.empty-state p[data-v-7a517320]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-7a517320]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}@media (max-width:900px){.stat-grid[data-v-7a517320]{grid-template-columns:repeat(2,1fr)}}@media (max-width:640px){.page[data-v-7a517320]{padding:var(--space-lg)}.header-actions[data-v-7a517320]{padding-top:0}.memory-list[data-v-7a517320]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
