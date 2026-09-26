import { defineComponent as nt, ref as c, watch as B, nextTick as _t, openBlock as o, createBlock as ht, Teleport as gt, unref as j, createElementBlock as i, withModifiers as lt, createElementVNode as t, toDisplayString as n, normalizeClass as T, createCommentVNode as g, computed as st, onMounted as kt, createStaticVNode as U, Fragment as L, withDirectives as w, vModelText as D, vModelSelect as Y, renderList as P, normalizeStyle as at, createVNode as yt } from "vue";
import { u as ot, _ as wt } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const Ct = /* @__PURE__ */ nt({
  __name: "ConfirmDialog",
  setup(it) {
    const { confirmState: b, settle: d } = ot(), y = c(null), C = c(null);
    let x = null;
    const _ = () => (document.documentElement.lang || "").startsWith("en"), I = () => b.value?.options.title || (_() ? "Confirm" : "请确认"), N = () => b.value?.options.confirmLabel || (_() ? "Confirm" : "确认"), $ = () => b.value?.options.cancelLabel || (_() ? "Cancel" : "取消");
    B(() => !!b.value, async (l) => {
      l ? (x = document.activeElement, await _t(), y.value?.focus(), C.value?.focus()) : (y.value = null, x?.focus?.());
    });
    function f(l) {
      if (!b.value) return;
      if (l.key === "Escape") {
        l.preventDefault(), d(!1);
        return;
      }
      if (l.key !== "Tab" || !y.value) return;
      const u = [...y.value.querySelectorAll("button:not(:disabled)")];
      if (!u.length) return;
      const k = u[0], M = u[u.length - 1];
      l.shiftKey && document.activeElement === k ? (l.preventDefault(), M.focus()) : !l.shiftKey && document.activeElement === M && (l.preventDefault(), k.focus());
    }
    return (l, u) => (o(), ht(gt, { to: "body" }, [
      j(b) ? (o(), i("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: u[2] || (u[2] = lt((k) => j(d)(!1), ["self"])),
        onKeydown: f
      }, [
        t("section", {
          ref_key: "dialog",
          ref: y,
          class: "confirm-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          t("h2", null, n(I()), 1),
          t("p", null, n(j(b).options.message), 1),
          t("footer", null, [
            t("button", {
              ref_key: "cancelBtn",
              ref: C,
              type: "button",
              onClick: u[0] || (u[0] = (k) => j(d)(!1))
            }, n($()), 513),
            t("button", {
              type: "button",
              class: T(["confirm-primary", { danger: j(b).options.danger !== !1 }]),
              onClick: u[1] || (u[1] = (k) => j(d)(!0))
            }, n(N()), 3)
          ])
        ], 512)
      ], 32)) : g("", !0)
    ]));
  }
}), xt = { class: "page memory-page" }, $t = { class: "page-inner" }, Mt = { class: "page-header" }, Lt = { class: "header-actions" }, Tt = ["disabled"], St = ["disabled"], Et = ["disabled"], jt = { class: "stat-grid" }, Bt = { class: "stat-card" }, It = { class: "stat-value" }, Nt = { class: "stat-card" }, Vt = { class: "stat-value" }, Ft = { class: "stat-card" }, Ut = { class: "stat-value" }, Dt = { class: "stat-card" }, Ot = { class: "stat-value" }, Rt = { class: "tabs" }, qt = { class: "card toolbar" }, At = { class: "search-field" }, Ht = { class: "select" }, Kt = { class: "select" }, Pt = { class: "chip muted" }, zt = { class: "memory-list" }, Jt = { class: "card-top" }, Qt = {
  key: 0,
  class: "chip muted"
}, Wt = { class: "chip muted" }, Yt = ["onClick"], Gt = { class: "memory-content" }, Xt = {
  key: 0,
  class: "tags"
}, Zt = { class: "memory-foot" }, te = {
  class: "meter",
  title: "重要性"
}, ee = { class: "meter-bar" }, se = {
  class: "meter",
  title: "强度"
}, ae = { class: "meter-bar" }, ne = { class: "meter-text" }, le = {
  key: 1,
  class: "detail"
}, oe = { class: "card-actions" }, ie = ["onClick"], ce = ["onClick"], re = ["onClick"], ue = ["onClick"], de = {
  key: 0,
  class: "empty-state"
}, ve = {
  key: 0,
  class: "pager"
}, pe = ["disabled"], me = { class: "chip muted" }, fe = ["disabled"], be = { class: "grid-notes" }, _e = { class: "card" }, he = ["disabled"], ge = { class: "card" }, ke = { class: "card-head" }, ye = { class: "chip muted" }, we = { class: "search-field mini" }, Ce = { class: "note-list" }, xe = { class: "note-main" }, $e = { class: "item-meta" }, Me = { class: "item-meta" }, Le = { class: "note-actions" }, Te = ["onClick"], Se = ["onClick"], Ee = {
  key: 0,
  class: "list-empty"
}, je = {
  key: 0,
  class: "card reader"
}, Be = { class: "card-head" }, Ie = { class: "card-title" }, Ne = { class: "pager" }, Ve = ["disabled"], Fe = { class: "chip muted" }, Ue = ["disabled"], De = { class: "card toolbar" }, Oe = { class: "select" }, Re = { class: "chip muted" }, qe = { class: "reflection-list" }, Ae = { class: "card-head" }, He = { class: "card-title" }, Ke = { class: "item-meta" }, Pe = { class: "quote" }, ze = { class: "quote" }, Je = {
  key: 0,
  class: "card-actions"
}, Qe = ["onClick"], We = ["onClick"], Ye = {
  key: 0,
  class: "empty-state"
}, Ge = {
  key: 3,
  class: "error-banner"
}, Xe = {
  key: 4,
  class: "notice"
}, O = 30, Ze = /* @__PURE__ */ nt({
  __name: "MemoryPage",
  setup(it) {
    const { confirm: b } = ot(), d = c("memories"), y = c(""), C = c(""), x = c("recent"), _ = c(0), I = c([]), N = c(0), $ = c({ working: 0, shortTerm: { total: 0 }, longTerm: 0, avgStrength: 0 }), f = c(!1), l = c(""), u = c(""), k = c(""), M = c([]), R = c(""), v = c({ title: "", content: "", tags: "" }), p = c(null), q = c([]), A = c("proposed"), H = st(() => Math.max(1, Math.ceil(N.value / O))), z = st(() => Math.floor(_.value / O) + 1);
    function V(a) {
      return `${Math.round(Math.max(0, Math.min(1, a || 0)) * 100)}%`;
    }
    function ct(a) {
      return a === "long_term" ? "长期记忆" : a === "short_term" ? "短期记忆" : "工作记忆";
    }
    function J(a) {
      if (!a) return "";
      const e = new Date(a);
      return Number.isNaN(e.getTime()) ? a : e.toLocaleString();
    }
    function F(a) {
      u.value = a, setTimeout(() => {
        u.value === a && (u.value = "");
      }, 2e3);
    }
    async function m(a, e) {
      const s = await fetch("/api/life/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: a, payload: e })
      });
      if (!s.ok) throw new Error(await s.text() || `HTTP ${s.status}`);
      return s.json().catch(() => ({}));
    }
    async function S() {
      try {
        const a = await fetch("/api/life/memories?limit=1");
        if (a.ok) {
          const e = await a.json();
          e.stats && ($.value = e.stats);
        }
      } catch {
      }
    }
    async function h() {
      f.value = !0, l.value = "";
      try {
        const a = await m("memory_page", { tier: C.value, query: y.value.trim(), limit: O, offset: _.value, sort: x.value });
        I.value = a.items || [], N.value = a.total || 0;
      } catch (a) {
        l.value = a?.message || "无法读取记忆";
      } finally {
        f.value = !1;
      }
    }
    async function K() {
      f.value = !0, l.value = "";
      try {
        const a = await m("memory_note_list", { query: R.value.trim(), limit: 60 });
        M.value = a.notes || [];
      } catch (a) {
        l.value = a?.message || "无法读取笔记";
      } finally {
        f.value = !1;
      }
    }
    async function Q() {
      f.value = !0, l.value = "";
      try {
        const a = await m("memory_reflection_list", { status: A.value, limit: 80 });
        q.value = a.reflections || [];
      } catch (a) {
        l.value = a?.message || "无法读取反思提案";
      } finally {
        f.value = !1;
      }
    }
    function G() {
      return d.value === "notes" ? K() : d.value === "reflections" ? Q() : h();
    }
    async function rt(a) {
      try {
        await m("memory_reinforce", { ids: [a.id] }), F("已再巩固"), await h();
      } catch (e) {
        l.value = e?.message || "强化失败";
      }
    }
    async function X(a, e) {
      try {
        await m("memory_importance", { id: a.id, delta: e }), await h();
      } catch (s) {
        l.value = s?.message || "调整失败";
      }
    }
    async function ut() {
      try {
        const a = await m("memory_export", {}), e = new Blob([JSON.stringify(a, null, 2)], { type: "application/json" }), s = URL.createObjectURL(e), r = document.createElement("a");
        r.href = s, r.download = `0kay-memory-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, r.click(), URL.revokeObjectURL(s), F("已导出记忆快照");
      } catch (a) {
        l.value = a?.message || "导出失败";
      }
    }
    const Z = c(null);
    async function dt(a) {
      const e = a.target, s = e.files?.[0];
      if (s)
        try {
          const r = JSON.parse(await s.text()), et = await m("memory_import", { snapshot: r });
          F(`导入完成：新增 ${et.imported || 0} · 跳过 ${et.skipped || 0}`), await h(), await S();
        } catch (r) {
          l.value = r?.message || "导入失败";
        } finally {
          e.value = "";
        }
    }
    async function vt(a) {
      if (await b({ title: "删除记忆", message: "删除会撤销该记忆并重建检索投影，继续吗？", confirmLabel: "删除", danger: !0 }))
        try {
          await m("delete_memory", { id: a.id }), await h(), await S();
        } catch (s) {
          l.value = s?.message || "删除失败";
        }
    }
    async function pt() {
      if (await b({ title: "清除全部记忆", message: "这会清除工作、短期、长期记忆、笔记块和反思提案，无法恢复。确定继续吗？", confirmLabel: "全部清除", danger: !0 }))
        try {
          await m("clear_all_memory", {}), await h(), await S();
        } catch (e) {
          l.value = e?.message || "清除失败";
        }
    }
    async function mt() {
      if (!(!v.value.content.trim() && !v.value.title.trim()))
        try {
          await m("memory_note_create", {
            title: v.value.title,
            content: v.value.content,
            tags: v.value.tags.split(",").map((a) => a.trim()).filter(Boolean)
          }), v.value = { title: "", content: "", tags: "" }, F("笔记已保存"), await K();
        } catch (a) {
          l.value = a?.message || "保存笔记失败";
        }
    }
    async function W(a, e = 1) {
      try {
        const s = await m("memory_note_read", { note_id: a.note_id, offset: e, limit: 400 });
        p.value = { ...s, offset: s.offset || e };
      } catch (s) {
        l.value = s?.message || "读取笔记失败";
      }
    }
    async function ft(a) {
      if (await b({ title: "删除笔记", message: `删除笔记「${a.note_id}」及其分块？`, confirmLabel: "删除", danger: !0 }))
        try {
          await m("memory_note_delete", { note_id: a.note_id }), p.value?.note_id === a.note_id && (p.value = null), await K();
        } catch (s) {
          l.value = s?.message || "删除笔记失败";
        }
    }
    async function tt(a, e) {
      try {
        await m("memory_reflection_review", { id: a.id, accept: e }), await Q(), await S();
      } catch (s) {
        l.value = s?.message || "审核失败";
      }
    }
    async function bt() {
      try {
        const a = await m("memory_maintenance", {});
        F(`维护完成：巩固 ${a.consolidated ?? 0} 条`), await h(), await S();
      } catch (a) {
        l.value = a?.message || "维护失败";
      }
    }
    let E = null;
    return B(y, () => {
      _.value = 0, E && clearTimeout(E), E = setTimeout(h, 250);
    }), B([C, x], () => {
      _.value = 0, h();
    }), B(R, () => {
      E && clearTimeout(E), E = setTimeout(K, 250);
    }), B(A, Q), B(d, G), kt(async () => {
      await h(), await S();
    }), (a, e) => (o(), i("main", xt, [
      t("div", $t, [
        t("header", Mt, [
          e[17] || (e[17] = t("div", null, [
            t("p", { class: "eyebrow" }, "L.I.F.E / MEMORY"),
            t("h1", null, "记忆管理台"),
            t("p", { class: "subtitle" }, "浏览 LIFE 的记忆分层、强度与召回；管理笔记、审核反思提案。记忆由 LIFE 插件维护，禁用后此入口消失。")
          ], -1)),
          t("div", Lt, [
            t("button", {
              class: "btn btn-tonal",
              disabled: f.value,
              onClick: bt
            }, "巩固维护", 8, Tt),
            t("button", {
              class: "btn btn-danger",
              disabled: f.value,
              onClick: pt
            }, "一键清除", 8, St),
            t("button", {
              class: "btn btn-tonal",
              disabled: f.value,
              onClick: G
            }, n(f.value ? "加载中…" : "刷新"), 9, Et)
          ])
        ]),
        t("section", jt, [
          t("article", Bt, [
            e[18] || (e[18] = U('<div class="stat-head" data-v-7e62324c><span class="icon-badge tone-1" aria-hidden="true" data-v-7e62324c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-7e62324c><path d="M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-7e62324c></path></svg></span><span class="stat-label" data-v-7e62324c>工作记忆</span></div>', 1)),
            t("strong", It, n($.value.working), 1),
            e[19] || (e[19] = t("span", { class: "stat-hint" }, "当前上下文", -1))
          ]),
          t("article", Nt, [
            e[20] || (e[20] = U('<div class="stat-head" data-v-7e62324c><span class="icon-badge tone-2" aria-hidden="true" data-v-7e62324c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-7e62324c><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" data-v-7e62324c></circle><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-7e62324c></path></svg></span><span class="stat-label" data-v-7e62324c>短期记忆</span></div>', 1)),
            t("strong", Vt, n($.value.shortTerm?.total || 0), 1),
            e[21] || (e[21] = t("span", { class: "stat-hint" }, "待巩固记录", -1))
          ]),
          t("article", Ft, [
            e[22] || (e[22] = U('<div class="stat-head" data-v-7e62324c><span class="icon-badge tone-3" aria-hidden="true" data-v-7e62324c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-7e62324c><path d="M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 21.5v-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" data-v-7e62324c></path></svg></span><span class="stat-label" data-v-7e62324c>长期记忆</span></div>', 1)),
            t("strong", Ut, n($.value.longTerm || 0), 1),
            e[23] || (e[23] = t("span", { class: "stat-hint" }, "稳定沉淀", -1))
          ]),
          t("article", Dt, [
            e[24] || (e[24] = U('<div class="stat-head" data-v-7e62324c><span class="icon-badge tone-4" aria-hidden="true" data-v-7e62324c><svg width="19" height="19" viewBox="0 0 24 24" fill="none" data-v-7e62324c><path d="M4 14l4-4 3 3 5-6 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" data-v-7e62324c></path><path d="M4 19h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" data-v-7e62324c></path></svg></span><span class="stat-label" data-v-7e62324c>平均强度</span></div>', 1)),
            t("strong", Ot, n(V($.value.avgStrength)), 1),
            e[25] || (e[25] = t("span", { class: "stat-hint" }, "遗忘曲线后的值", -1))
          ])
        ]),
        t("nav", Rt, [
          t("button", {
            class: T({ active: d.value === "memories" }),
            onClick: e[0] || (e[0] = (s) => d.value = "memories")
          }, "记忆", 2),
          t("button", {
            class: T({ active: d.value === "notes" }),
            onClick: e[1] || (e[1] = (s) => d.value = "notes")
          }, "笔记", 2),
          t("button", {
            class: T({ active: d.value === "reflections" }),
            onClick: e[2] || (e[2] = (s) => d.value = "reflections")
          }, "反思提案", 2)
        ]),
        d.value === "memories" ? (o(), i(L, { key: 0 }, [
          t("section", qt, [
            t("div", At, [
              e[26] || (e[26] = t("svg", {
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
              w(t("input", {
                "onUpdate:modelValue": e[3] || (e[3] = (s) => y.value = s),
                placeholder: "搜索记忆内容或标签",
                "aria-label": "搜索记忆"
              }, null, 512), [
                [D, y.value]
              ])
            ]),
            t("label", Ht, [
              e[28] || (e[28] = t("span", null, "层级", -1)),
              w(t("select", {
                "onUpdate:modelValue": e[4] || (e[4] = (s) => C.value = s)
              }, [...e[27] || (e[27] = [
                t("option", { value: "" }, "全部", -1),
                t("option", { value: "short_term" }, "短期", -1),
                t("option", { value: "long_term" }, "长期", -1)
              ])], 512), [
                [Y, C.value]
              ])
            ]),
            t("label", Kt, [
              e[30] || (e[30] = t("span", null, "排序", -1)),
              w(t("select", {
                "onUpdate:modelValue": e[5] || (e[5] = (s) => x.value = s)
              }, [...e[29] || (e[29] = [
                t("option", { value: "recent" }, "最近", -1),
                t("option", { value: "strength" }, "强度", -1),
                t("option", { value: "importance" }, "重要性", -1),
                t("option", { value: "recall" }, "召回次数", -1)
              ])], 512), [
                [Y, x.value]
              ])
            ]),
            t("span", Pt, n(N.value) + " 条 · 第 " + n(z.value) + "/" + n(H.value) + " 页", 1),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: ut
            }, "导出"),
            t("button", {
              class: "btn btn-tonal btn-sm",
              onClick: e[6] || (e[6] = (s) => Z.value?.click())
            }, "导入"),
            t("input", {
              ref_key: "importInput",
              ref: Z,
              type: "file",
              accept: "application/json,.json",
              class: "hidden-input",
              onChange: dt
            }, null, 544)
          ]),
          t("section", zt, [
            (o(!0), i(L, null, P(I.value, (s) => (o(), i("article", {
              key: s.id,
              class: T(["memory-card", { open: k.value === s.id }])
            }, [
              t("div", Jt, [
                t("span", {
                  class: T(["chip", "tier-" + (s.tier === "long_term" ? "long" : "short")])
                }, n(ct(s.tier)), 3),
                s.scope && s.scope !== "public" ? (o(), i("span", Qt, n(s.scope), 1)) : g("", !0),
                t("span", Wt, n(s.memory_type || "knowledge"), 1),
                t("button", {
                  class: "btn-icon danger",
                  title: "删除记忆",
                  onClick: (r) => vt(s)
                }, [...e[31] || (e[31] = [
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
                ])], 8, Yt)
              ]),
              t("p", Gt, n(s.content), 1),
              s.tags?.length ? (o(), i("div", Xt, [
                (o(!0), i(L, null, P(s.tags, (r) => (o(), i("span", { key: r }, "#" + n(r), 1))), 128))
              ])) : g("", !0),
              t("footer", Zt, [
                t("div", te, [
                  e[32] || (e[32] = t("span", null, "重要性", -1)),
                  t("div", ee, [
                    t("i", {
                      style: at({ width: V(s.importance) }),
                      class: "fill-primary"
                    }, null, 4)
                  ]),
                  t("b", null, n(V(s.importance)), 1)
                ]),
                t("div", se, [
                  e[33] || (e[33] = t("span", null, "强度", -1)),
                  t("div", ae, [
                    t("i", {
                      style: at({ width: V(s.strength) }),
                      class: "fill-secondary"
                    }, null, 4)
                  ]),
                  t("b", null, n(V(s.strength)), 1)
                ]),
                t("span", ne, "召回 " + n(s.recall_count || 0) + " 次", 1)
              ]),
              k.value === s.id ? (o(), i("div", le, [
                t("dl", null, [
                  t("div", null, [
                    e[34] || (e[34] = t("dt", null, "ID", -1)),
                    t("dd", null, [
                      t("code", null, n(s.id), 1)
                    ])
                  ]),
                  t("div", null, [
                    e[35] || (e[35] = t("dt", null, "来源", -1)),
                    t("dd", null, n(s.source_kind || "conversation"), 1)
                  ]),
                  t("div", null, [
                    e[36] || (e[36] = t("dt", null, "创建", -1)),
                    t("dd", null, n(J(s.created_at)), 1)
                  ]),
                  t("div", null, [
                    e[37] || (e[37] = t("dt", null, "最近召回", -1)),
                    t("dd", null, n(J(s.last_recalled)), 1)
                  ])
                ])
              ])) : g("", !0),
              t("div", oe, [
                t("button", {
                  class: "btn btn-sm btn-tonal",
                  onClick: (r) => k.value = k.value === s.id ? "" : s.id
                }, n(k.value === s.id ? "收起" : "详情"), 9, ie),
                t("button", {
                  class: "btn btn-sm btn-tonal",
                  onClick: (r) => X(s, 0.1)
                }, "重要 +", 8, ce),
                t("button", {
                  class: "btn btn-sm btn-tonal",
                  onClick: (r) => X(s, -0.1)
                }, "重要 −", 8, re),
                t("button", {
                  class: "btn btn-sm btn-tonal",
                  onClick: (r) => rt(s)
                }, "再巩固", 8, ue)
              ])
            ], 2))), 128)),
            !f.value && !I.value.length ? (o(), i("div", de, [...e[38] || (e[38] = [
              t("p", null, "暂无匹配记忆", -1),
              t("p", { class: "hint" }, "LIFE 会在对话与工具调用中逐步沉淀记忆。", -1)
            ])])) : g("", !0)
          ]),
          H.value > 1 ? (o(), i("div", ve, [
            t("button", {
              class: "btn btn-tonal btn-sm",
              disabled: _.value === 0,
              onClick: e[7] || (e[7] = (s) => {
                _.value = Math.max(0, _.value - O), h();
              })
            }, "上一页", 8, pe),
            t("span", me, n(z.value) + " / " + n(H.value), 1),
            t("button", {
              class: "btn btn-tonal btn-sm",
              disabled: z.value >= H.value,
              onClick: e[8] || (e[8] = (s) => {
                _.value += O, h();
              })
            }, "下一页", 8, fe)
          ])) : g("", !0)
        ], 64)) : d.value === "notes" ? (o(), i(L, { key: 1 }, [
          t("section", be, [
            t("article", _e, [
              e[39] || (e[39] = t("div", { class: "card-head" }, [
                t("h2", { class: "card-title" }, "新建笔记")
              ], -1)),
              t("form", {
                class: "stack-form",
                onSubmit: lt(mt, ["prevent"])
              }, [
                w(t("input", {
                  "onUpdate:modelValue": e[9] || (e[9] = (s) => v.value.title = s),
                  class: "input",
                  placeholder: "标题",
                  "aria-label": "笔记标题"
                }, null, 512), [
                  [D, v.value.title]
                ]),
                w(t("input", {
                  "onUpdate:modelValue": e[10] || (e[10] = (s) => v.value.tags = s),
                  class: "input",
                  placeholder: "标签（逗号分隔，可选）",
                  "aria-label": "笔记标签"
                }, null, 512), [
                  [D, v.value.tags]
                ]),
                w(t("textarea", {
                  "onUpdate:modelValue": e[11] || (e[11] = (s) => v.value.content = s),
                  class: "input area",
                  placeholder: "笔记正文…",
                  "aria-label": "笔记正文"
                }, null, 512), [
                  [D, v.value.content]
                ]),
                t("button", {
                  class: "btn btn-primary",
                  type: "submit",
                  disabled: !v.value.content.trim() && !v.value.title.trim()
                }, "保存笔记", 8, he)
              ], 32)
            ]),
            t("article", ge, [
              t("div", ke, [
                e[40] || (e[40] = t("h2", { class: "card-title" }, "笔记库", -1)),
                t("span", ye, n(M.value.length), 1)
              ]),
              t("div", we, [
                w(t("input", {
                  "onUpdate:modelValue": e[12] || (e[12] = (s) => R.value = s),
                  placeholder: "搜索笔记…",
                  "aria-label": "搜索笔记"
                }, null, 512), [
                  [D, R.value]
                ])
              ]),
              t("ul", Ce, [
                (o(!0), i(L, null, P(M.value, (s) => (o(), i("li", {
                  key: s.note_id,
                  class: "note-item"
                }, [
                  t("div", xe, [
                    t("strong", null, n(s.note_id), 1),
                    t("span", $e, n(s.preview?.slice(0, 90) || "（空）"), 1),
                    t("span", Me, n((s.bytes / 1024).toFixed(1)) + " KB", 1)
                  ]),
                  t("div", Le, [
                    t("button", {
                      class: "btn btn-sm btn-tonal",
                      onClick: (r) => W(s)
                    }, "阅读", 8, Te),
                    t("button", {
                      class: "btn btn-sm btn-danger",
                      onClick: (r) => ft(s)
                    }, "删除", 8, Se)
                  ])
                ]))), 128)),
                M.value.length ? g("", !0) : (o(), i("li", Ee, "还没有笔记。LIFE 或你可以把长内容写入笔记并参与检索。"))
              ])
            ])
          ]),
          p.value ? (o(), i("section", je, [
            t("div", Be, [
              t("h2", Ie, n(p.value.note_id), 1),
              t("button", {
                class: "btn btn-sm btn-tonal",
                onClick: e[13] || (e[13] = (s) => p.value = null)
              }, "关闭")
            ]),
            t("pre", null, n(p.value.content), 1),
            t("div", Ne, [
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: p.value.offset <= 1,
                onClick: e[14] || (e[14] = (s) => W({ note_id: p.value.note_id }, Math.max(1, p.value.offset - 400)))
              }, "上一段", 8, Ve),
              t("span", Fe, n(p.value.total_lines) + " 行", 1),
              t("button", {
                class: "btn btn-tonal btn-sm",
                disabled: !p.value.has_more,
                onClick: e[15] || (e[15] = (s) => W({ note_id: p.value.note_id }, p.value.offset + 400))
              }, "下一段", 8, Ue)
            ])
          ])) : g("", !0)
        ], 64)) : (o(), i(L, { key: 2 }, [
          t("section", De, [
            t("label", Oe, [
              e[42] || (e[42] = t("span", null, "状态", -1)),
              w(t("select", {
                "onUpdate:modelValue": e[16] || (e[16] = (s) => A.value = s)
              }, [...e[41] || (e[41] = [
                U('<option value="proposed" data-v-7e62324c>待审核</option><option value="pending" data-v-7e62324c>待处理</option><option value="applied" data-v-7e62324c>已采纳</option><option value="rejected" data-v-7e62324c>已拒绝</option><option value="" data-v-7e62324c>全部</option>', 5)
              ])], 512), [
                [Y, A.value]
              ])
            ]),
            t("span", Re, n(q.value.length) + " 条", 1)
          ]),
          t("section", qe, [
            (o(!0), i(L, null, P(q.value, (s) => (o(), i("article", {
              key: s.id,
              class: "card reflection"
            }, [
              t("div", Ae, [
                t("h3", He, n(s.statement || "（无摘要）"), 1),
                t("span", {
                  class: T(["chip", s.status === "applied" ? "chip-ok" : s.status === "rejected" ? "chip-warn" : "muted"])
                }, n(s.status), 3)
              ]),
              t("p", Ke, "来源会话 " + n(s.session_id) + " · " + n(J(s.created_at)), 1),
              t("details", null, [
                e[43] || (e[43] = t("summary", null, "查看原始对话", -1)),
                t("p", Pe, "用户：" + n(s.user_text), 1),
                t("p", ze, "LIFE：" + n(s.assistant_text), 1)
              ]),
              s.status === "proposed" ? (o(), i("div", Je, [
                t("button", {
                  class: "btn btn-sm btn-primary",
                  onClick: (r) => tt(s, !0)
                }, "采纳为记忆", 8, Qe),
                t("button", {
                  class: "btn btn-sm btn-danger",
                  onClick: (r) => tt(s, !1)
                }, "拒绝", 8, We)
              ])) : g("", !0)
            ]))), 128)),
            q.value.length ? g("", !0) : (o(), i("div", Ye, [...e[44] || (e[44] = [
              t("p", null, "没有该状态的反思提案", -1),
              t("p", { class: "hint" }, "LIFE 从对话中提炼低风险记忆提案，等你确认。", -1)
            ])]))
          ])
        ], 64)),
        l.value ? (o(), i("p", Ge, n(l.value), 1)) : g("", !0),
        u.value ? (o(), i("p", Xe, n(u.value), 1)) : g("", !0)
      ]),
      yt(Ct)
    ]));
  }
}), ss = /* @__PURE__ */ wt(Ze, [["__scopeId", "data-v-7e62324c"]]);
export {
  ss as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent="#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color .14s,border-radius .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),color .14s}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity .18s var(--ease-emphasized,cubic-bezier(.2,0,0,1)),transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.select-menu-leave-active{transition:opacity .13s,transform .13s}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}.pcp[data-v-2943d753]{--r-xs:10px;--r-sm:14px;--r-md:20px;--r-lg:28px;--r-xl:36px;--spring:cubic-bezier(.2,.9,.25,1.15);height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;background:var(--md-surface);color:var(--md-on-surface);max-width:1240px;margin:0 auto}h1[data-v-2943d753],h2[data-v-2943d753],h3[data-v-2943d753],h4[data-v-2943d753]{margin:0;letter-spacing:-.01em}.eyebrow[data-v-2943d753]{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}.eyebrow b[data-v-2943d753]{font-size:9px}.hero[data-v-2943d753]{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}.hero[data-v-2943d753]:after{content:\"\";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}.hero-main[data-v-2943d753]{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}.hero-copy h1[data-v-2943d753]{font-size:clamp(26px,3.4vw,40px);font-weight:800}.sub[data-v-2943d753]{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}.hero-actions[data-v-2943d753]{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.fab[data-v-2943d753]{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);transition:transform .28s var(--spring),box-shadow .28s}.fab[data-v-2943d753]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}.fab[data-v-2943d753]:disabled{opacity:.6;cursor:not-allowed}.fab-ic[data-v-2943d753]{font-size:17px}.hero-stats[data-v-2943d753]{position:relative;z-index:1;display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:22px}.stat[data-v-2943d753]{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;border:0;border-radius:var(--r-md);background:color-mix(in srgb,var(--md-surface-container-lowest) 78%,transparent);cursor:pointer;text-align:left;transition:transform .25s var(--spring),background .25s;backdrop-filter:blur(4px)}.stat[data-v-2943d753]:hover{transform:translateY(-2px);background:var(--md-surface-container-lowest)}.stat-ic[data-v-2943d753]{font-size:14px;opacity:.85}.stat-num[data-v-2943d753]{font-size:26px;font-weight:800;letter-spacing:-.02em}.stat-cap[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.t1[data-v-2943d753]{color:var(--md-primary)}.t2[data-v-2943d753]{color:#9a6a00}.t3[data-v-2943d753]{color:#7b4bb7}.t4[data-v-2943d753]{color:#0d8a5f}.t5[data-v-2943d753]{color:#b5473c}.t6[data-v-2943d753]{color:#1a6fb4}.state-row[data-v-2943d753]{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}.pill[data-v-2943d753]{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}.pill.soft[data-v-2943d753]{font-weight:500;color:var(--md-on-surface-variant)}.pill.bad[data-v-2943d753]{background:#ffdcc6;color:#7a3a00}.chip-btn[data-v-2943d753]{border:0;border-radius:999px;padding:7px 14px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font:700 13px/1 inherit;cursor:pointer;transition:transform .2s var(--spring)}.chip-btn[data-v-2943d753]:hover{transform:translateY(-1px)}.banner[data-v-2943d753]{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}.banner.err[data-v-2943d753]{background:var(--md-error-container);color:#410e0b}.banner.ok[data-v-2943d753]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tabs[data-v-2943d753]{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}.tab[data-v-2943d753]{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .25s,color .25s,transform .25s var(--spring)}.tab i[data-v-2943d753]{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}.tab-ic[data-v-2943d753]{font-size:14px}.tab[data-v-2943d753]:hover{background:var(--md-surface-container-high)}.tab.active[data-v-2943d753]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}.tab.active i[data-v-2943d753]{opacity:.85}.panel[data-v-2943d753]{animation:fade-2943d753 .32s var(--spring)}@keyframes fade-2943d753{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.section-head[data-v-2943d753]{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}.section-head h2[data-v-2943d753]{font-size:22px;font-weight:800}.desc[data-v-2943d753]{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}.head-actions[data-v-2943d753]{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.btn[data-v-2943d753]{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}.btn.sm[data-v-2943d753]{height:34px;padding:0 14px;font-size:13px}.btn[data-v-2943d753]:disabled{opacity:.5;cursor:not-allowed}.btn[data-v-2943d753]:hover:not(:disabled){transform:translateY(-1px)}.btn.filled[data-v-2943d753]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn.tonic[data-v-2943d753]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.text[data-v-2943d753]{background:transparent;color:var(--md-primary)}.btn.danger[data-v-2943d753]{background:var(--md-error-container);color:#410e0b}.link[data-v-2943d753]{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}.card[data-v-2943d753]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}.card>h3[data-v-2943d753]{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}.card.sub[data-v-2943d753]{padding:16px;margin-bottom:0}.grid2[data-v-2943d753]{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.grid3[data-v-2943d753]{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}.cards[data-v-2943d753]{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}.item-card[data-v-2943d753]{display:flex;flex-direction:column;gap:8px}.row[data-v-2943d753]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.sub-label[data-v-2943d753]{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.hint[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}.meta[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}.prose[data-v-2943d753]{margin:0;font-size:14px;line-height:1.85;white-space:pre-wrap;overflow-wrap:anywhere}.empty[data-v-2943d753]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.field[data-v-2943d753]{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}.field[data-v-2943d753]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.field.area[data-v-2943d753]{height:auto;padding:12px 16px;line-height:1.6;resize:vertical;min-height:84px}.field.tiny[data-v-2943d753]{width:104px;height:38px;padding:0 12px;font-size:13px}.field.search[data-v-2943d753]{max-width:200px}.form-row[data-v-2943d753]{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}.form-row .field[data-v-2943d753]{flex:1;min-width:120px}.actions-row[data-v-2943d753]{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}.switches[data-v-2943d753]{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}.sw[data-v-2943d753]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}.sw input[data-v-2943d753]{width:18px;height:18px;accent-color:var(--md-primary)}.settings-grid[data-v-2943d753]{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.settings-grid label[data-v-2943d753]{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.settings-grid label.wide[data-v-2943d753]{grid-column:span 2}.settings-grid .field[data-v-2943d753]{height:40px}.chip[data-v-2943d753]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-2943d753]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-2943d753]{background:var(--md-success-container);color:#0d3b1e}.chip.warn[data-v-2943d753]{background:#ffe6c2;color:#7a4400}.chip.danger[data-v-2943d753]{background:var(--md-error-container);color:#410e0b}.chip button[data-v-2943d753]{border:0;background:transparent;color:inherit;cursor:pointer;font-weight:800;margin-left:2px}.count-pill[data-v-2943d753]{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}.chips[data-v-2943d753]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.owner[data-v-2943d753]{margin-left:6px;font-style:normal;font-size:12px;font-weight:800;background:var(--md-success-container);color:#0d3b1e;border-radius:999px;padding:2px 7px}.note[data-v-2943d753]{margin:10px 0;padding:12px 14px;border-radius:var(--r-sm);background:var(--md-surface-container);font-size:13px;line-height:1.6}.desk[data-v-2943d753]{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:16px;align-items:start}.desk-col[data-v-2943d753]{display:flex;flex-direction:column;gap:16px}.dcard[data-v-2943d753]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:18px}.dcard header[data-v-2943d753]{display:flex;align-items:center;gap:8px;margin-bottom:12px}.dcard header h3[data-v-2943d753]{font-size:14px;font-weight:800}.dcard header small[data-v-2943d753],.dcard header .link[data-v-2943d753]{margin-left:auto}.dcard .link[data-v-2943d753]{margin-left:auto}.dot[data-v-2943d753]{width:11px;height:11px;border-radius:50%;background:var(--md-outline)}.dot.ic[data-v-2943d753]{background:var(--md-primary);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-primary) 18%,transparent)}.fact-grid[data-v-2943d753]{display:grid;grid-template-columns:1fr 1fr;gap:10px}.fact[data-v-2943d753]{background:var(--md-surface-container-low);border-radius:var(--r-sm);padding:10px 12px;display:flex;flex-direction:column;gap:2px}.fact b[data-v-2943d753]{font-size:22px;font-weight:800}.fact span[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.mini-list[data-v-2943d753]{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}.mini-list li[data-v-2943d753]{display:flex;justify-content:space-between;gap:10px;font-size:13px;align-items:center}.cur[data-v-2943d753]{display:flex;align-items:center;gap:10px;font-size:15px}.tl[data-v-2943d753]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.tl li[data-v-2943d753]{display:flex;gap:12px;align-items:flex-start;padding:8px 10px;border-radius:var(--r-sm);background:var(--md-surface-container-low)}.tl li time[data-v-2943d753]{font:600 12px/1.4 ui-monospace,monospace;color:var(--md-on-surface-variant);flex:0 0 46px}.tl li>div[data-v-2943d753]{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.tl li strong.done[data-v-2943d753]{text-decoration:line-through;color:var(--md-on-surface-variant)}.tl li.ok[data-v-2943d753]{background:var(--md-success-container)}.tl li.warn[data-v-2943d753]{background:#fff3dd}.mini-tl[data-v-2943d753]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.mini-tl li[data-v-2943d753]{display:flex;gap:10px;align-items:flex-start}.mini-tl li>div[data-v-2943d753]{display:flex;flex-direction:column;gap:2px}.caps[data-v-2943d753]{display:flex;flex-wrap:wrap;gap:8px}.cap[data-v-2943d753]{display:flex;flex-direction:column;gap:1px;padding:8px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);min-width:96px}.cap b[data-v-2943d753]{font-size:13px}.cap small[data-v-2943d753]{font-size:12px;color:#0d8a5f;font-weight:700}.cap.off small[data-v-2943d753]{color:var(--md-on-surface-variant)}.fold[data-v-2943d753]{border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);margin-top:16px;background:var(--md-surface-container-lowest);overflow:hidden}.fold summary[data-v-2943d753]{padding:16px 20px;cursor:pointer;display:flex;flex-direction:column;gap:2px;list-style:none}.fold summary[data-v-2943d753]::-webkit-details-marker{display:none}.fold summary b[data-v-2943d753]{font-size:15px}.fold summary small[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.fold[open] summary[data-v-2943d753]{border-bottom:1px solid var(--md-outline-variant)}.fold .grid3[data-v-2943d753],.fold .grid2[data-v-2943d753]{padding:18px;margin:0}.stat-cards[data-v-2943d753]{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px}.stat-card[data-v-2943d753]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:18px;display:flex;flex-direction:column;gap:4px}.stat-card b[data-v-2943d753]{font-size:28px;font-weight:800}.stat-card span[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.bars[data-v-2943d753]{display:flex;flex-direction:column;gap:10px}.bar-row[data-v-2943d753]{display:flex;align-items:center;gap:10px;font-size:13px}.bar-label[data-v-2943d753]{flex:0 0 84px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--md-on-surface-variant)}.bar[data-v-2943d753]{flex:1;height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.bar i[data-v-2943d753]{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 60%,#fff));transition:width .4s var(--spring)}.bar.big[data-v-2943d753]{height:14px;margin:8px 0}.feed[data-v-2943d753]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.feed li[data-v-2943d753]{display:flex;flex-direction:column;gap:3px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);font-size:13px}.feed li .actions-row[data-v-2943d753]{margin-top:4px}.pos[data-v-2943d753]{color:var(--md-success);font-weight:800}.neg[data-v-2943d753]{color:var(--md-error);font-weight:800}.tl-detail[data-v-2943d753]{margin:4px 0 0;font-size:12px;color:var(--md-on-surface-variant);background:var(--md-surface-container);padding:7px 10px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}.user-layout[data-v-2943d753]{display:grid;grid-template-columns:300px 1fr;gap:16px;align-items:start}.roster[data-v-2943d753]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:14px;display:flex;flex-direction:column;gap:8px}.roster-head[data-v-2943d753]{display:flex;align-items:center;gap:8px;padding:4px 6px 8px}.roster-row[data-v-2943d753]{display:flex;gap:10px;align-items:center;padding:10px;border:0;border-radius:var(--r-sm);background:transparent;cursor:pointer;text-align:left;transition:background .2s}.roster-row[data-v-2943d753]:hover{background:var(--md-surface-container-low)}.roster-row.active[data-v-2943d753]{background:var(--md-secondary-container)}.avatar[data-v-2943d753]{width:38px;height:38px;border-radius:50%;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:800;flex:0 0 auto}.avatar.lg[data-v-2943d753]{width:52px;height:52px;font-size:20px}.rmain[data-v-2943d753]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.rtop[data-v-2943d753]{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700}.user-detail[data-v-2943d753]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;min-height:320px}.detail-head[data-v-2943d753]{display:flex;align-items:center;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}.subtabs[data-v-2943d753]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.subtabs button[data-v-2943d753]{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:700 12px/1 inherit;cursor:pointer}.subtabs button.active[data-v-2943d753]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}.kv-grid[data-v-2943d753]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:8px}.kv[data-v-2943d753]{background:var(--md-surface-container-low);border-radius:var(--r-sm);padding:12px 14px;display:flex;flex-direction:column;gap:3px}.kv span[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.kv b[data-v-2943d753]{font-size:22px;font-weight:800}.world-layout[data-v-2943d753]{display:grid;grid-template-columns:190px 1fr;gap:16px;align-items:start}.world-nav[data-v-2943d753]{position:sticky;top:8px;display:flex;flex-direction:column;gap:4px}.world-nav button[data-v-2943d753]{display:flex;justify-content:space-between;align-items:center;height:42px;padding:0 14px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .2s}.world-nav button[data-v-2943d753]:hover{background:var(--md-surface-container-high)}.world-nav button.active[data-v-2943d753]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.world-body .cards[data-v-2943d753]{margin-top:0}.group-form[data-v-2943d753]{display:grid;grid-template-columns:1fr 130px 1fr auto;gap:10px;margin-bottom:16px}.group-detail[data-v-2943d753]{margin:10px 0;padding:12px;border-radius:var(--r-sm);background:var(--md-surface-container-low)}.members[data-v-2943d753]{display:flex;flex-direction:column;gap:6px}.member[data-v-2943d753]{display:flex;align-items:center;gap:10px;font-size:13px}.member .meta[data-v-2943d753]{flex:1}.cal-card[data-v-2943d753]{grid-column:auto}.cal-week[data-v-2943d753]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}.cal-week span[data-v-2943d753]{text-align:center;font-size:12px;color:var(--md-on-surface-variant);font-weight:700}.cal-grid[data-v-2943d753]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-cell[data-v-2943d753]{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:12px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}.cal-cell.empty[data-v-2943d753]{border-color:transparent;background:transparent}.cal-cell.today[data-v-2943d753]{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 20%,transparent)}.cal-cell.has[data-v-2943d753]{background:var(--md-surface-container-low)}.cal-day[data-v-2943d753]{font-size:12px;font-weight:800;color:var(--md-on-surface-variant)}.cal-chip[data-v-2943d753]{font-size:11px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-more[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.cloud[data-v-2943d753]{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}.cloud-word[data-v-2943d753]{font-weight:800;color:var(--md-primary);line-height:1.2}.mini-actions[data-v-2943d753]{display:flex;gap:6px;flex:0 0 auto}.warnline[data-v-2943d753]{margin:12px 0 0;padding:10px 12px;border-radius:var(--r-sm);background:#fff3dd;color:#7a4400;font-size:13px}.spark[data-v-2943d753]{display:flex;align-items:flex-end;gap:6px;height:120px;padding:8px 2px 0}.spark-col[data-v-2943d753]{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px;height:100%}.spark-col i[data-v-2943d753]{width:100%;max-width:22px;border-radius:7px 7px 3px 3px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 55%,#fff));transition:height .4s var(--spring)}.spark-col span[data-v-2943d753]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace}.radar-wrap[data-v-2943d753]{display:flex;flex-direction:column;align-items:center;gap:8px}.radar[data-v-2943d753]{width:180px;height:180px}.radar-grid[data-v-2943d753]{fill:none;stroke:var(--md-outline-variant);stroke-width:1}.radar-fill[data-v-2943d753]{fill:color-mix(in srgb,var(--md-primary) 34%,transparent);stroke:var(--md-primary);stroke-width:2;transition:all .4s var(--spring)}.radar-lbl[data-v-2943d753]{font-size:10px;fill:var(--md-on-surface-variant);font-weight:700}.findings[data-v-2943d753]{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}.findings li[data-v-2943d753]{display:flex;gap:8px;align-items:center}#app .pcp .card[data-v-2943d753],#app .pcp .dcard[data-v-2943d753]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .pcp .field[data-v-2943d753]{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}#app .pcp .field[data-v-2943d753]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .pcp .field.area[data-v-2943d753]{height:auto}#app .pcp .field.tiny[data-v-2943d753]{height:40px}#app .pcp .settings-grid .field[data-v-2943d753]{height:44px}#app .pcp .btn[data-v-2943d753]{height:44px;padding:0 20px}#app .pcp .btn.sm[data-v-2943d753]{height:36px;padding:0 15px}#app .pcp .stat-card[data-v-2943d753],#app .pcp .item-card[data-v-2943d753]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent)}#app .pcp .note[data-v-2943d753],#app .pcp .fact[data-v-2943d753],#app .pcp .tl li[data-v-2943d753],#app .pcp .feed li[data-v-2943d753],#app .pcp .kv[data-v-2943d753],#app .pcp .cap[data-v-2943d753],#app .pcp .group-detail[data-v-2943d753]{background:var(--md-surface-container)}#app .pcp .sel[data-v-2943d753]{flex:0 0 auto}#app .pcp .sel[data-v-2943d753] .app-select-trigger{min-height:48px;border-radius:14px}#app .pcp .sel-tiny[data-v-2943d753]{flex:0 0 auto}#app .pcp .sel-tiny[data-v-2943d753] .app-select-trigger{min-height:38px;padding:0 10px;border-radius:12px;font-size:13px}@media (prefers-color-scheme: dark){.pill.bad[data-v-2943d753]{background:#5a2d00;color:#ffd7b0}.chip.warn[data-v-2943d753]{background:#5a3d00;color:#ffe0a3}.warnline[data-v-2943d753]{background:#3d2b00;color:#ffd89a}.tl li.warn[data-v-2943d753]{background:#3d2b00}}@media (max-width:1080px){.desk[data-v-2943d753]{grid-template-columns:1fr 1fr}.stat-cards[data-v-2943d753]{grid-template-columns:repeat(2,1fr)}.hero-stats[data-v-2943d753]{grid-template-columns:repeat(3,1fr)}}@media (max-width:820px){.grid2[data-v-2943d753],.grid3[data-v-2943d753],.desk[data-v-2943d753],.user-layout[data-v-2943d753],.world-layout[data-v-2943d753],.group-form[data-v-2943d753]{grid-template-columns:1fr}.settings-grid label.wide[data-v-2943d753]{grid-column:span 1}.hero-stats[data-v-2943d753]{grid-template-columns:repeat(2,1fr)}}@media (max-width:560px){.pcp[data-v-2943d753]{padding:var(--space-lg) var(--space-lg) 80px}.hero[data-v-2943d753]{padding:20px}.hero-actions[data-v-2943d753]{width:100%}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-7e62324c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-7e62324c]{max-width:1180px;margin:0 auto}.page-header[data-v-7e62324c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-7e62324c]{margin:0 0 6px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-7e62324c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-7e62324c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-7e62324c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-7e62324c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-7e62324c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-7e62324c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-7e62324c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-7e62324c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-7e62324c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-7e62324c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-7e62324c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-7e62324c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-7e62324c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-7e62324c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-7e62324c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-7e62324c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-7e62324c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-7e62324c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-7e62324c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-7e62324c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-7e62324c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-7e62324c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-7e62324c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-7e62324c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-7e62324c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-7e62324c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-7e62324c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-7e62324c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-7e62324c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-7e62324c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-7e62324c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-7e62324c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-7e62324c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-7e62324c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-7e62324c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-7e62324c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-7e62324c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-7e62324c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-7e62324c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-7e62324c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-7e62324c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-7e62324c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-7e62324c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-7e62324c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-7e62324c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-7e62324c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-7e62324c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-7e62324c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-7e62324c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-7e62324c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-7e62324c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-7e62324c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-7e62324c]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-7e62324c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-7e62324c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-7e62324c]{background:var(--md-primary)}.fill-secondary[data-v-7e62324c]{background:var(--md-secondary,#536255)}.meter-text[data-v-7e62324c]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-7e62324c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-7e62324c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-7e62324c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-7e62324c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-7e62324c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-7e62324c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-7e62324c]{display:none}.empty-state[data-v-7e62324c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-7e62324c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-7e62324c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-7e62324c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-7e62324c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-7e62324c]{display:flex;flex-direction:column;gap:10px}.input[data-v-7e62324c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-7e62324c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-7e62324c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-7e62324c],.reflection-list[data-v-7e62324c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-7e62324c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-7e62324c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-7e62324c]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-7e62324c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-7e62324c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-7e62324c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-7e62324c]{margin-top:var(--space-lg)}.reader pre[data-v-7e62324c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-7e62324c]{font-size:14px;font-weight:600}.reflection details[data-v-7e62324c]{margin-top:6px}.reflection summary[data-v-7e62324c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-7e62324c]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}#app .memory-page .page-header h1[data-v-7e62324c]{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}#app .memory-page .stat-grid[data-v-7e62324c]{gap:var(--space-lg)}#app .memory-page .stat-card[data-v-7e62324c],#app .memory-page .card[data-v-7e62324c],#app .memory-page .memory-card[data-v-7e62324c]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .memory-page .stat-card[data-v-7e62324c]{border-radius:24px;transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}#app .memory-page .stat-card[data-v-7e62324c]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}#app .memory-page .stat-value[data-v-7e62324c]{font-size:34px;font-weight:800;letter-spacing:-.02em}#app .memory-page .icon-badge[data-v-7e62324c]{width:44px;height:44px;border-radius:16px 16px 16px 6px}#app .memory-page .card[data-v-7e62324c],#app .memory-page .memory-card[data-v-7e62324c]{border-radius:24px}#app .memory-page .memory-card[data-v-7e62324c]{transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .22s,border-color .2s}#app .memory-page .memory-card[data-v-7e62324c]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}#app .memory-page .btn[data-v-7e62324c]{height:44px;padding:0 20px;border-radius:999px;font-weight:700}#app .memory-page .btn-sm[data-v-7e62324c]{height:34px;padding:0 14px;font-size:13px}#app .memory-page .btn-tonal[data-v-7e62324c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .memory-page .btn-primary[data-v-7e62324c]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 28%,transparent)}#app .memory-page .input[data-v-7e62324c]{height:48px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);transition:background-color .18s,border-color .18s,box-shadow .2s}#app .memory-page .input[data-v-7e62324c]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .memory-page .input.area[data-v-7e62324c]{height:auto;padding:14px 16px}#app .memory-page .search-field input[data-v-7e62324c]{height:44px}#app .memory-page .search-field.mini[data-v-7e62324c]{border-color:transparent;background:var(--md-surface-container-high);border-radius:14px}#app .memory-page .select select[data-v-7e62324c]{height:44px;border-color:transparent;border-radius:14px;background:var(--md-surface-container-high);padding:0 14px}#app .memory-page .tabs[data-v-7e62324c]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .memory-page .tabs button[data-v-7e62324c]{border-radius:999px;padding:9px 20px;font-weight:650}#app .memory-page .tabs button.active[data-v-7e62324c]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:var(--shadow-1)}#app .memory-page .note-item[data-v-7e62324c]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-low)}@media (max-width:900px){.stat-grid[data-v-7e62324c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-7e62324c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-7e62324c]{padding:var(--space-lg)}.header-actions[data-v-7e62324c]{padding-top:0}.memory-list[data-v-7e62324c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
