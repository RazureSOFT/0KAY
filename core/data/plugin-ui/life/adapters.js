import { defineComponent as ne, ref as p, computed as j, onMounted as se, openBlock as u, createElementBlock as d, Fragment as U, createElementVNode as e, createTextVNode as r, toDisplayString as n, normalizeClass as D, createCommentVNode as g, withDirectives as i, vModelCheckbox as F, vModelText as v, renderList as z, createVNode as H } from "vue";
import { l as ae, _ as re, a as y, r as ie, f as C, w as ue } from "./assets/kit-CXR4p1ZZ.js";
import { _ as de, u as pe } from "./assets/ConfirmDialog.vue_vue_type_style_index_0_lang-BWG9soEK.js";
const ve = { class: "lsp" }, ce = { class: "hero" }, me = { class: "hero-main" }, _e = { class: "hero-actions" }, fe = ["disabled"], be = { class: "state-row" }, ge = { class: "pill soft" }, ye = { class: "pill soft" }, ke = { class: "pill soft" }, we = {
  key: 0,
  class: "banner err"
}, xe = {
  key: 1,
  class: "banner ok"
}, he = {
  key: 2,
  class: "card empty"
}, Ce = { class: "card" }, Ve = { class: "sw" }, Se = {
  class: "settings-grid",
  style: { "margin-top": "12px" }
}, Ue = {
  class: "sw",
  style: { "margin-top": "12px" }
}, Te = { class: "actions-row" }, $e = ["disabled"], Ne = { class: "card" }, Ae = { class: "count-pill" }, Ee = {
  key: 0,
  class: "empty"
}, Pe = {
  key: 1,
  class: "feed"
}, Ie = { class: "adapter-row" }, We = { class: "pill muted" }, Be = {
  class: "meta",
  style: { "margin-top": "6px" }
}, De = { class: "meta" }, Fe = {
  key: 0,
  class: "hint",
  style: { color: "var(--md-error,#b3261e)" }
}, Le = { class: "adapter-actions" }, Me = ["disabled", "onClick"], qe = ["onClick"], Re = ["disabled", "onClick"], je = {
  key: 0,
  class: "card"
}, ze = { class: "settings-grid" }, He = {
  class: "sw",
  style: { "margin-top": "12px" }
}, Oe = {
  key: 0,
  class: "hint platform-note"
}, Ge = { class: "editor-actions" }, Qe = ["disabled"], Ke = { class: "card" }, Ye = { class: "feed" }, Je = { class: "idx" }, Xe = { class: "to" }, Ze = { style: { "margin-left": "auto", display: "flex", gap: "8px" } }, el = ["disabled", "onClick"], ll = ["disabled", "onClick"], tl = ["onClick"], ol = {
  key: 0,
  class: "empty"
}, nl = {
  class: "settings-grid",
  style: { "margin-top": "14px" }
}, sl = { class: "actions-row" }, al = {
  class: "fld",
  style: { "margin-left": "auto" }
}, rl = ["disabled"], O = "life-plugin-adapters-style", vl = /* @__PURE__ */ ne({
  __name: "AdapterSettingsPage",
  setup(il) {
    const { confirm: G } = pe(), T = p(!0), f = p(""), $ = p("");
    function k(o) {
      $.value = o, setTimeout(() => {
        $.value === o && ($.value = "");
      }, 3200);
    }
    const c = p({
      onebot_enabled: !1,
      onebot_reverse_host: "0.0.0.0",
      onebot_reverse_port: 6199
    }), m = p({
      onebot_trigger_keywords: "",
      onebot_observe_group: !0,
      proactive_daily_limit: 3,
      proactive_target_limit: 1
    }), N = p(!1), w = p([]), W = p([]), A = p([]), _ = p(!1), x = p(null), s = p(E());
    function E() {
      return {
        id: "",
        name: "",
        platform: "aiocqhttp",
        enabled: !0,
        ws_host: "0.0.0.0",
        ws_port: 6199,
        ws_token: "",
        http_url: "",
        access_token: "",
        config_id: "default",
        trigger_keywords: ""
      };
    }
    function B(o) {
      return W.value.find((l) => l.id === o) || { id: o };
    }
    function L(o) {
      const l = B(o.id);
      return o.enabled ? l.connected ? { label: `已连接 · ${l.clients || 0} 客户端`, tone: "ok" } : l.listening ? { label: "等待客户端接入", tone: "wait" } : { label: l.error ? "监听失败" : "未监听", tone: "bad" } : { label: "未启用", tone: "muted" };
    }
    j(() => A.value.filter((o) => o.implemented).map((o) => o.id));
    const M = j(() => A.value.filter((o) => !o.implemented).map((o) => o.id));
    async function V() {
      T.value = !0, f.value = "";
      try {
        const [o, l, t, a] = await Promise.all([
          y("adapter_list"),
          y("adapter_platforms"),
          y("adapter_routes_get"),
          ie("life").catch(() => ({}))
        ]);
        w.value = o?.instances || [], W.value = o?.runtime || [], A.value = l?.platforms || [], t.value = t?.routes || [], P.value = t?.default_config_id || "default", c.value = {
          onebot_enabled: a.onebot_enabled === !0,
          onebot_reverse_host: String(a.onebot_reverse_host ?? "0.0.0.0") || "0.0.0.0",
          onebot_reverse_port: Number(a.onebot_reverse_port ?? 6199) || 6199
        }, m.value = {
          onebot_trigger_keywords: String(a.onebot_trigger_keywords ?? ""),
          onebot_observe_group: a.onebot_observe_group !== !1,
          proactive_daily_limit: Number(a.proactive_daily_limit ?? 3),
          proactive_target_limit: Number(a.proactive_target_limit ?? 1)
        }, s.value = {
          ...E(),
          ws_host: c.value.onebot_reverse_host,
          ws_port: q(),
          trigger_keywords: m.value.onebot_trigger_keywords
        };
      } catch (o) {
        f.value = C(o);
      } finally {
        T.value = !1;
      }
    }
    function q() {
      const o = new Set(w.value.map((t) => Number(t.ws_port) || 0));
      let l = c.value.onebot_reverse_port || 6199;
      for (; o.has(l) && l < 65535; ) l += 1;
      return l;
    }
    function Q() {
      x.value = "", s.value = {
        ...E(),
        ws_host: c.value.onebot_reverse_host || "0.0.0.0",
        ws_port: q(),
        trigger_keywords: m.value.onebot_trigger_keywords
      };
    }
    function K(o) {
      x.value = o.id, s.value = {
        ...E(),
        ...o,
        trigger_keywords: Array.isArray(o.trigger_keywords) ? o.trigger_keywords.join(",") : o.trigger_keywords || ""
      };
    }
    async function Y() {
      _.value = !0;
      try {
        const o = { ...s.value };
        o.trigger_keywords = String(o.trigger_keywords || "").split(",").map((S) => S.trim()).filter(Boolean);
        const l = Number(o.ws_port);
        o.ws_port === "" || o.ws_port === null || o.ws_port === void 0 ? delete o.ws_port : l > 0 ? o.ws_port = l : delete o.ws_port, o.id || delete o.id;
        const t = await y("adapter_upsert", { instance: o });
        if (t && t.ok === !1) throw Error(t.error || "保存失败");
        const a = t?.sync;
        a && a.started === !1 && o.enabled ? k("已保存，但未能开始监听（端口可能被占用），请检查端口后点「重新监听」") : k(o.enabled === !1 ? "已保存（未启用）" : "适配器已保存并开始监听"), x.value = null, await V();
      } catch (o) {
        f.value = C(o);
      } finally {
        _.value = !1;
      }
    }
    async function J(o) {
      _.value = !0;
      try {
        await y("adapter_toggle", { id: o.id, enabled: !o.enabled }), k(o.enabled ? `已停用「${o.name}」` : `已启用「${o.name}」`), await V();
      } catch (l) {
        f.value = C(l);
      } finally {
        _.value = !1;
      }
    }
    async function X(o) {
      if (await G({
        title: "删除该适配器",
        message: `将停止「${o.name}」的监听并删除它的连接配置。该机器人的会话记忆、关系与人设选择不会受影响。`,
        confirmLabel: "删除",
        danger: !0
      })) {
        _.value = !0;
        try {
          await y("adapter_delete", { id: o.id }), k("适配器已删除"), x.value === o.id && (x.value = null), await V();
        } catch (t) {
          f.value = C(t);
        } finally {
          _.value = !1;
        }
      }
    }
    async function Z() {
      _.value = !0;
      try {
        const l = ((await y("adapter_sync"))?.instances || []).filter((t) => t.error);
        k(l.length ? `重新监听完成，${l.length} 个适配器失败：${l.map((t) => t.name || t.id).join("、")}` : "已按配置重新监听"), await V();
      } catch (o) {
        f.value = C(o);
      } finally {
        _.value = !1;
      }
    }
    async function ee() {
      N.value = !0;
      try {
        await ue("life", {
          ...c.value,
          onebot_reverse_port: Number(c.value.onebot_reverse_port) || 6199,
          ...m.value,
          proactive_daily_limit: Number(m.value.proactive_daily_limit) || 0,
          proactive_target_limit: Number(m.value.proactive_target_limit) || 0
        }), await y("adapter_sync").catch(() => null), k(c.value.onebot_enabled ? "已开启消息平台总开关并重新监听" : "已关闭消息平台总开关，所有适配器停止监听"), await V();
      } catch (o) {
        f.value = C(o);
      } finally {
        N.value = !1;
      }
    }
    const b = p([]), P = p("default"), h = p({ pattern: "*", config_id: "default" }), I = p(!1);
    function le() {
      const o = String(h.value.pattern || "").trim();
      if (!o) {
        f.value = "会话匹配不能为空";
        return;
      }
      b.value = [...b.value, { pattern: o, config_id: String(h.value.config_id || "default").trim() || "default" }], h.value = { pattern: "*", config_id: "default" }, f.value = "";
    }
    function te(o) {
      b.value = b.value.filter((l, t) => t !== o);
    }
    function R(o, l) {
      const t = [...b.value], a = o + l;
      if (a < 0 || a >= t.length) return;
      const [S] = t.splice(o, 1);
      t.splice(a, 0, S), b.value = t;
    }
    async function oe() {
      I.value = !0;
      try {
        await y("adapter_routes_set", {
          routes: b.value,
          default_config_id: String(P.value || "default").trim() || "default"
        }), k("路由已保存；规则自上而下，首条命中生效");
      } catch (o) {
        f.value = C(o);
      } finally {
        I.value = !1;
      }
    }
    if (typeof document < "u" && !document.getElementById(O)) {
      const o = document.createElement("style");
      o.id = O, o.textContent = ae("lsp") + `
.lsp .adapter-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.lsp .adapter-row strong{font-size:15px;font-weight:750}
.lsp .adapter-row .meta{flex:1 1 100%}
.lsp .adapter-actions{display:flex;gap:8px;flex-wrap:wrap;flex:1 1 100%}
.lsp .rule-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.lsp .rule-row code{font:600 12px/1.4 ui-monospace,monospace;background:var(--md-surface-container-high);
  padding:2px 8px;border-radius:8px;color:var(--md-on-surface)}
.lsp .rule-row .idx{font:700 12px/1 ui-monospace,monospace;color:var(--md-on-surface-variant);min-width:20px}
.lsp .rule-row .to{color:var(--md-primary);font-weight:700;font-size:13px}
.lsp .pill.wait{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.lsp .pill.ok{background:var(--md-success-container);color:#0d3b1e}
.lsp .pill.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}
.lsp .pill.bad{background:var(--md-error-container);color:var(--md-on-error-container)}
.lsp .pill{font-size:12px;padding:4px 12px}
.lsp .platform-note{margin:10px 0 0}
.lsp .token-warn{color:var(--md-error,#b3261e);font-weight:700}
.lsp .editor-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
`, document.head.appendChild(o);
    }
    return se(V), (o, l) => (u(), d(U, null, [
      e("main", ve, [
        e("header", ce, [
          e("div", me, [
            l[22] || (l[22] = e("div", { class: "hero-copy" }, [
              e("p", { class: "eyebrow" }, [
                e("b", null, "●"),
                r(" L.I.F.E · MESSAGING PLATFORMS")
              ]),
              e("h1", null, "消息平台"),
              e("p", { class: "sub" }, [
                r(" 把角色接入 QQ / 企业微信 / 飞书 / Discord / Telegram。L.I.F.E 是"),
                e("b", null, "服务端"),
                r("： 在这里配置反向 WebSocket 的监听地址与 Token，由 NapCat 等客户端主动连入。 可以同时添加多个机器人，各自独立启停、互不影响。 ")
              ])
            ], -1)),
            e("div", _e, [
              e("button", {
                class: "fab",
                disabled: _.value || T.value,
                onClick: Z
              }, [
                l[21] || (l[21] = e("span", {
                  class: "fab-ic",
                  "aria-hidden": "true"
                }, "↻", -1)),
                r(n(_.value ? "处理中…" : "重新监听"), 1)
              ], 8, fe)
            ])
          ]),
          e("div", be, [
            e("span", ge, n(w.value.length) + " 个适配器", 1),
            e("span", ye, n(w.value.filter((t) => t.enabled).length) + " 个已启用", 1),
            e("span", ke, n(W.value.filter((t) => t.connected).length) + " 个已连接", 1),
            e("span", {
              class: D(["pill soft", c.value.onebot_enabled ? "" : "muted"])
            }, " 总开关 " + n(c.value.onebot_enabled ? "已开启" : "已关闭"), 3)
          ])
        ]),
        f.value ? (u(), d("p", we, n(f.value), 1)) : g("", !0),
        $.value ? (u(), d("p", xe, n($.value), 1)) : g("", !0),
        T.value ? (u(), d("p", he, "正在读取适配器配置…")) : g("", !0),
        T.value ? g("", !0) : (u(), d(U, { key: 3 }, [
          e("article", Ce, [
            l[30] || (l[30] = e("h3", null, "总开关与默认值", -1)),
            l[31] || (l[31] = e("p", { class: "hint" }, [
              r(" 关闭总开关会停止"),
              e("b", null, "全部"),
              r("反向 WebSocket 监听，与逐个停用适配器等效； 保留适配器配置，方便下次一键恢复。下面的监听地址与端口只作为新增机器人时的默认取值。 ")
            ], -1)),
            e("label", Ve, [
              i(e("input", {
                "onUpdate:modelValue": l[0] || (l[0] = (t) => c.value.onebot_enabled = t),
                type: "checkbox"
              }, null, 512), [
                [F, c.value.onebot_enabled]
              ]),
              l[23] || (l[23] = e("span", null, "启用消息平台适配器", -1))
            ]),
            e("div", Se, [
              e("label", null, [
                l[24] || (l[24] = e("span", null, "反向 WebSocket 默认主机", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[1] || (l[1] = (t) => c.value.onebot_reverse_host = t),
                  class: "field",
                  placeholder: "0.0.0.0"
                }, null, 512), [
                  [v, c.value.onebot_reverse_host]
                ])
              ]),
              e("label", null, [
                l[25] || (l[25] = e("span", null, "反向 WebSocket 默认端口", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[2] || (l[2] = (t) => c.value.onebot_reverse_port = t),
                  class: "field",
                  type: "number",
                  min: "1",
                  max: "65535",
                  placeholder: "6199"
                }, null, 512), [
                  [
                    v,
                    c.value.onebot_reverse_port,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                l[26] || (l[26] = e("span", null, "群聊触发关键词（逗号分隔，留空=全部）", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[3] || (l[3] = (t) => m.value.onebot_trigger_keywords = t),
                  class: "field",
                  placeholder: "bot,在吗"
                }, null, 512), [
                  [v, m.value.onebot_trigger_keywords]
                ])
              ]),
              e("label", null, [
                l[27] || (l[27] = e("span", null, "每日主动消息上限", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[4] || (l[4] = (t) => m.value.proactive_daily_limit = t),
                  class: "field",
                  type: "number",
                  min: "0",
                  placeholder: "3"
                }, null, 512), [
                  [
                    v,
                    m.value.proactive_daily_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                l[28] || (l[28] = e("span", null, "单目标每日上限", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[5] || (l[5] = (t) => m.value.proactive_target_limit = t),
                  class: "field",
                  type: "number",
                  min: "0",
                  placeholder: "1"
                }, null, 512), [
                  [
                    v,
                    m.value.proactive_target_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            e("label", Ue, [
              i(e("input", {
                "onUpdate:modelValue": l[6] || (l[6] = (t) => m.value.onebot_observe_group = t),
                type: "checkbox"
              }, null, 512), [
                [F, m.value.onebot_observe_group]
              ]),
              l[29] || (l[29] = e("span", null, "群聊观察（未触发回复时仍记录有限的话题与成员活跃度）", -1))
            ]),
            l[32] || (l[32] = e("p", { class: "hint" }, [
              r(" 主机填 "),
              e("code", null, "0.0.0.0"),
              r(" 会接受来自任意网卡的连接，此时"),
              e("b", null, "务必"),
              r("为每个适配器设置 Token。 ")
            ], -1)),
            e("div", Te, [
              e("button", {
                class: "btn filled sm",
                disabled: N.value,
                onClick: ee
              }, n(N.value ? "保存中…" : "保存并生效"), 9, $e)
            ])
          ]),
          e("article", Ne, [
            e("h3", null, [
              l[33] || (l[33] = r("适配器 ", -1)),
              e("span", Ae, n(w.value.length), 1),
              e("button", {
                class: "btn filled sm",
                style: { "margin-left": "auto" },
                onClick: Q
              }, "＋ 添加适配器")
            ]),
            w.value.length ? (u(), d("ol", Pe, [
              (u(!0), d(U, null, z(w.value, (t) => (u(), d("li", {
                key: t.id
              }, [
                e("div", Ie, [
                  e("strong", null, n(t.name || t.id), 1),
                  e("span", {
                    class: D(["pill", L(t).tone])
                  }, n(L(t).label), 3),
                  e("span", We, n(t.platform), 1)
                ]),
                e("div", Be, [
                  r(" 监听 ws://" + n(t.ws_host) + ":" + n(t.ws_port) + " · 人设 ", 1),
                  e("code", null, n(t.config_id), 1),
                  t.http_url ? (u(), d(U, { key: 0 }, [
                    r(" · HTTP " + n(t.http_url), 1)
                  ], 64)) : g("", !0)
                ]),
                e("div", De, [
                  e("span", {
                    class: D({ "token-warn": !t.ws_token && t.ws_host === "0.0.0.0" })
                  }, n(t.ws_token ? "Token 已设置" : "未设置 Token"), 3),
                  t.trigger_keywords && t.trigger_keywords.length ? (u(), d(U, { key: 0 }, [
                    r(" · 触发词 " + n(t.trigger_keywords.join("、")), 1)
                  ], 64)) : g("", !0)
                ]),
                B(t.id).error ? (u(), d("p", Fe, " 监听错误：" + n(B(t.id).error), 1)) : g("", !0),
                e("div", Le, [
                  e("button", {
                    class: "btn sm",
                    disabled: _.value,
                    onClick: (a) => J(t)
                  }, n(t.enabled ? "停用" : "启用"), 9, Me),
                  e("button", {
                    class: "btn sm",
                    onClick: (a) => K(t)
                  }, "编辑", 8, qe),
                  e("button", {
                    class: "btn sm danger",
                    disabled: _.value,
                    onClick: (a) => X(t)
                  }, "删除", 8, Re)
                ])
              ]))), 128))
            ])) : (u(), d("p", Ee, "还没有适配器。点「添加适配器」接入第一个机器人。"))
          ]),
          x.value !== null ? (u(), d("article", je, [
            e("h3", null, n(s.value.id ? "编辑适配器" : "添加适配器"), 1),
            e("div", ze, [
              e("label", null, [
                l[34] || (l[34] = e("span", null, "消息平台类别", -1)),
                H(re, {
                  modelValue: s.value.platform,
                  "onUpdate:modelValue": l[7] || (l[7] = (t) => s.value.platform = t),
                  options: A.value.map((t) => ({ value: t.id, label: t.id + (t.implemented ? "" : "（尚未实现）") }))
                }, null, 8, ["modelValue", "options"])
              ]),
              e("label", null, [
                l[35] || (l[35] = e("span", null, "机器人名称", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[8] || (l[8] = (t) => s.value.name = t),
                  class: "field",
                  placeholder: "napcat"
                }, null, 512), [
                  [v, s.value.name]
                ])
              ]),
              e("label", null, [
                l[36] || (l[36] = e("span", null, "反向 WebSocket 主机", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[9] || (l[9] = (t) => s.value.ws_host = t),
                  class: "field",
                  placeholder: "0.0.0.0"
                }, null, 512), [
                  [v, s.value.ws_host]
                ])
              ]),
              e("label", null, [
                l[37] || (l[37] = e("span", null, "反向 WebSocket 端口", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[10] || (l[10] = (t) => s.value.ws_port = t),
                  class: "field",
                  type: "number",
                  min: "1",
                  max: "65535",
                  placeholder: "6199"
                }, null, 512), [
                  [
                    v,
                    s.value.ws_port,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                l[38] || (l[38] = e("span", null, "反向 WebSocket Token", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[11] || (l[11] = (t) => s.value.ws_token = t),
                  class: "field",
                  type: "password",
                  placeholder: "留空则不启用 Token 验证"
                }, null, 512), [
                  [v, s.value.ws_token]
                ])
              ]),
              e("label", null, [
                l[39] || (l[39] = e("span", null, "HTTP API 地址（可选）", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[12] || (l[12] = (t) => s.value.http_url = t),
                  class: "field",
                  placeholder: "http://127.0.0.1:3000；留空则只走反向 WS"
                }, null, 512), [
                  [v, s.value.http_url]
                ])
              ]),
              e("label", null, [
                l[40] || (l[40] = e("span", null, "Access Token（可选）", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[13] || (l[13] = (t) => s.value.access_token = t),
                  class: "field",
                  placeholder: "HTTP API 鉴权"
                }, null, 512), [
                  [v, s.value.access_token]
                ])
              ]),
              e("label", null, [
                l[41] || (l[41] = e("span", null, "配置文件", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[14] || (l[14] = (t) => s.value.config_id = t),
                  class: "field",
                  placeholder: "default"
                }, null, 512), [
                  [v, s.value.config_id]
                ])
              ]),
              e("label", null, [
                l[42] || (l[42] = e("span", null, "触发关键词（逗号分隔，留空=继承全局）", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[15] || (l[15] = (t) => s.value.trigger_keywords = t),
                  class: "field",
                  placeholder: "bot,在吗"
                }, null, 512), [
                  [v, s.value.trigger_keywords]
                ])
              ])
            ]),
            e("label", He, [
              i(e("input", {
                "onUpdate:modelValue": l[16] || (l[16] = (t) => s.value.enabled = t),
                type: "checkbox"
              }, null, 512), [
                [F, s.value.enabled]
              ]),
              l[43] || (l[43] = e("span", null, "启用该适配器（未启用则不会监听，对应平台收不到消息）", -1))
            ]),
            M.value.length ? (u(), d("p", Oe, " 已注册但尚无实现的平台：" + n(M.value.join("、")) + "。选择它们可以先把配置存下来，等实现后无需重新录入。 ", 1)) : g("", !0),
            e("div", Ge, [
              e("button", {
                class: "btn filled sm",
                disabled: _.value,
                onClick: Y
              }, n(_.value ? "保存中…" : "保存"), 9, Qe),
              e("button", {
                class: "btn sm",
                onClick: l[17] || (l[17] = (t) => x.value = null)
              }, "取消")
            ])
          ])) : g("", !0),
          e("article", Ke, [
            l[47] || (l[47] = e("h3", null, "配置文件路由", -1)),
            l[48] || (l[48] = e("p", { class: "hint" }, [
              r(" 消息下发时，按"),
              e("b", null, "从上到下"),
              r("的顺序匹配首个符合条件的配置文件。使用 "),
              e("code", null, "*"),
              r(" 匹配所有会话， 也支持 "),
              e("code", null, "/正则/"),
              r(" 与 "),
              e("code", null, "前缀*"),
              r("。全部不匹配时使用默认配置文件。 在任意会话里发送 "),
              e("code", null, "/sid"),
              r(" 即可获取该会话 ID。 ")
            ], -1)),
            e("ol", Ye, [
              (u(!0), d(U, null, z(b.value, (t, a) => (u(), d("li", {
                key: a,
                class: "rule-row"
              }, [
                e("span", Je, n(a + 1), 1),
                e("code", null, n(t.pattern), 1),
                e("span", Xe, "→ " + n(t.config_id), 1),
                e("span", Ze, [
                  e("button", {
                    class: "btn sm",
                    disabled: a === 0,
                    onClick: (S) => R(a, -1)
                  }, "↑", 8, el),
                  e("button", {
                    class: "btn sm",
                    disabled: a === b.value.length - 1,
                    onClick: (S) => R(a, 1)
                  }, "↓", 8, ll),
                  e("button", {
                    class: "btn sm danger",
                    onClick: (S) => te(a)
                  }, "删除", 8, tl)
                ])
              ]))), 128)),
              b.value.length ? g("", !0) : (u(), d("li", ol, "还没有规则，所有会话都使用默认配置文件。"))
            ]),
            e("div", nl, [
              e("label", null, [
                l[44] || (l[44] = e("span", null, "会话 *", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[18] || (l[18] = (t) => h.value.pattern = t),
                  class: "field",
                  placeholder: "qq_group_* 或 /^qq_.*/"
                }, null, 512), [
                  [v, h.value.pattern]
                ])
              ]),
              e("label", null, [
                l[45] || (l[45] = e("span", null, "配置文件", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[19] || (l[19] = (t) => h.value.config_id = t),
                  class: "field",
                  placeholder: "default"
                }, null, 512), [
                  [v, h.value.config_id]
                ])
              ])
            ]),
            e("div", sl, [
              e("button", {
                class: "btn sm",
                onClick: le
              }, "添加规则"),
              e("label", al, [
                l[46] || (l[46] = e("span", null, "默认配置文件", -1)),
                i(e("input", {
                  "onUpdate:modelValue": l[20] || (l[20] = (t) => P.value = t),
                  class: "field",
                  placeholder: "default"
                }, null, 512), [
                  [v, P.value]
                ])
              ]),
              e("button", {
                class: "btn filled sm",
                disabled: I.value,
                onClick: oe
              }, n(I.value ? "保存中…" : "保存路由"), 9, rl)
            ])
          ])
        ], 64))
      ]),
      H(de)
    ], 64));
  }
});
export {
  vl as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent="#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium),border-radius var(--duration-medium) var(--ease-spring)}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short)}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform var(--duration-medium) var(--ease-spring)}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:var(--z-popover);overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color var(--duration-short),border-radius var(--duration-medium) var(--ease-spring),color var(--duration-short)}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity var(--duration-short) var(--ease-emphasized),transform var(--duration-medium) var(--ease-spring)}.select-menu-leave-active{transition:opacity var(--duration-short),transform var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}@media(prefers-reduced-motion:reduce){#app .app-select-trigger{transition:background-color var(--duration-short),border-color var(--duration-short),box-shadow var(--duration-medium)}.app-select-chevron,.app-select-chevron svg,.app-select-option{transition:none}.select-menu-enter-active,.select-menu-leave-active{transition:opacity var(--duration-short)}.select-menu-enter-from,.select-menu-leave-to{transform:none}}.confirm-scrim{position:fixed;inset:0;z-index:var(--z-modal);background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.confirm-dialog:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}@media(prefers-reduced-motion:reduce){.confirm-dialog{animation:none;transition:none}}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:#ffffff80}.leaflet-container{font-family:Helvetica Neue,Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px #000000a6;border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover,.leaflet-bar a:focus{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:700 18px Lucida Console,Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px #0006;background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=)}.leaflet-container .leaflet-control-attribution{background:#fff;background:#fffc;margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover,.leaflet-control-attribution a:focus{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:#fffc;text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px #0006}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover,.leaflet-container a.leaflet-popup-close-button:focus{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=.70710678,M12=.70710678,M21=-.70710678,M22=.70710678)}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px #0006}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}.world-field[data-v-48211299]{display:block;margin:10px 0}.world-label[data-v-48211299]{display:block;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);margin-bottom:4px}.world-text[data-v-48211299]{width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;line-height:1.5;resize:vertical;outline:none}.world-text[data-v-48211299]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.world-actions[data-v-48211299]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}.wm-head[data-v-48211299]{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}.wm-place[data-v-48211299]{font-size:12px;color:var(--md-on-surface-variant)}.wm-premise[data-v-48211299]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0 8px}.wm-map-wrap[data-v-48211299]{position:relative;margin-top:8px}.world-map-leaflet[data-v-48211299]{height:clamp(460px,72vh,820px);border-radius:16px;overflow:hidden;border:1px solid var(--md-outline-variant);background:#e8edf2}.world-map-leaflet.is-empty[data-v-48211299]{display:none}.wm-reset[data-v-48211299]{position:absolute;top:10px;right:10px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-reset[data-v-48211299]:hover{background:#fff}.wm-compass[data-v-48211299]{position:absolute;left:12px;bottom:12px;z-index:var(--z-overlay);width:38px;height:38px;border-radius:50%;background:#ffffffeb;border:1px solid #b9c3cd;box-shadow:0 1px 4px #0000002e;display:grid;place-items:center}.wm-compass i[data-v-48211299]{font-style:normal;font-size:12px;font-weight:800;color:#d64545;position:relative}.wm-compass i[data-v-48211299]:before{content:\"\";position:absolute;left:50%;top:-9px;transform:translate(-50%);border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:9px solid #33404c}.wm-scope[data-v-48211299]{position:absolute;bottom:12px;right:12px;z-index:var(--z-overlay);border:1px solid var(--md-outline-variant);background:#fffffff0;color:#33404c;border-radius:10px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 1px 4px #0000002e}.wm-scope[data-v-48211299]:hover{background:#fff}.wm-offline[data-v-48211299]{position:absolute;left:50%;bottom:12px;transform:translate(-50%);z-index:var(--z-overlay);background:#d1495bf0;color:#fff;font-size:12px;font-weight:600;padding:5px 12px;border-radius:10px;box-shadow:0 1px 4px #00000040}.wm-routes[data-v-48211299]{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:14px}.wm-routes h4[data-v-48211299]{margin:0 0 6px;font-size:13px;font-weight:800}.wm-routes ul[data-v-48211299]{list-style:none;margin:0;padding:0}.wm-routes li[data-v-48211299]{display:flex;gap:10px;padding:4px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent);font-size:12.5px}.wm-routes b[data-v-48211299]{flex:0 0 88px}.wm-routes span[data-v-48211299]{color:var(--md-on-surface-variant);line-height:1.5}.wm-legend[data-v-48211299]{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:12px;color:var(--md-on-surface-variant)}.wm-legend span[data-v-48211299]{display:inline-flex;align-items:center;gap:6px}.wm-legend i[data-v-48211299]{width:12px;height:12px;border-radius:50%;display:inline-block;border:1.5px solid rgba(255,255,255,.7)}.wm-legend i.k-home[data-v-48211299]{background:#e07a5f}.wm-legend i.k-work[data-v-48211299]{background:#5b8def}.wm-legend i.k-shop[data-v-48211299]{background:#e0a23d}.wm-legend i.k-food[data-v-48211299]{background:#57a773}.wm-legend i.k-park[data-v-48211299]{background:#3faead}.wm-legend i.k-transit[data-v-48211299]{background:#8b6fd6}.wm-legend i.k-other[data-v-48211299]{background:#8a94a6}.wm-legend i.k-actor[data-v-48211299]{background:#fff;border-color:#d1495b;box-shadow:inset 0 0 0 3px #d1495b}.wm-legend i.k-metro[data-v-48211299]{background:#d64545}.wm-legend i.k-bus[data-v-48211299]{background:#e08a2e}.wm-legend i.k-park2[data-v-48211299]{background:#9bd08f}.wm-legend i.k-water[data-v-48211299]{background:#8fbfe6}.wm-legend i.k-hw[data-v-48211299]{background:#f08c2e}.wm-legend i.k-arterial[data-v-48211299]{background:#f7cf8a}.wm-legend i.k-street[data-v-48211299]{background:#fff;border-color:#b9c3cd}.pfield[data-v-48211299]{display:flex;flex-direction:column;gap:4px;margin-top:10px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.pfield textarea.field[data-v-48211299]{height:auto;min-height:70px;padding:10px 12px;resize:vertical;line-height:1.5}.cog-metric[data-v-48211299]{display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant)}.cog-metric span[data-v-48211299]{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.cog-metric strong[data-v-48211299]{font-size:16px;font-weight:800;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cog-metric.warn[data-v-48211299]{border-color:var(--md-error,#b3261e);background:color-mix(in srgb,var(--md-error,#b3261e) 8%,transparent)}.cog-metric.warn span[data-v-48211299],.cog-metric.warn strong[data-v-48211299]{color:var(--md-error,#b3261e)}.som-channels[data-v-48211299]{margin-top:10px;display:flex;flex-direction:column;gap:6px}.som-chan[data-v-48211299]{display:grid;grid-template-columns:52px 1fr 48px;align-items:center;gap:10px}.som-chan-name[data-v-48211299]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.som-chan-bar[data-v-48211299]{display:block;height:8px;border-radius:999px;background:var(--md-surface-container);overflow:hidden}.som-chan-bar i[data-v-48211299]{display:block;width:100%;height:100%;border-radius:999px;background:var(--md-primary);transform-origin:left;transition:transform var(--duration-medium) var(--ease-out);will-change:transform}.som-chan-val[data-v-48211299]{font-size:12px;font-weight:700;text-align:right;color:var(--md-on-surface-variant)}.chip[data-v-48211299]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-48211299]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-48211299]{background:var(--md-success-container);color:#0d3b1e}#app .pcp .cog-metric[data-v-48211299]{background:var(--md-surface-container)}.wm-pin-holder,.wm-actor-holder{background:none;border:none}.wm-pin{position:absolute;left:0;top:0;width:16px;height:16px;border-radius:50%;background:var(--c,#8a94a6);border:3px solid #fff;box-shadow:0 2px 6px #00000073;transform:translate(-50%,-50%)}.wm-pin:after{content:\"\";position:absolute;left:50%;top:100%;width:2px;height:8px;background:#fff;transform:translate(-50%);opacity:.7}.wm-pin-label{position:absolute;left:12px;top:-9px;white-space:nowrap;background:#12141ad1;color:#fff;font-size:12px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none}.wm-actor-badge{position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#fff;color:#d1495b;border:3px solid #d1495b;font-size:14px;font-weight:800;line-height:1;display:grid;place-items:center;transform:translate(-50%,-50%);box-shadow:0 2px 6px #00000080;z-index:600}.wm-actor-name{position:absolute;left:0;top:20px;white-space:nowrap;background:#d1495b;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:9px;transform:translate(-50%)}.wm-district{background:none;border:none}.wm-district-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-size:12px;font-weight:800;letter-spacing:.2em;color:#5c6b78;text-shadow:0 1px 0 rgba(255,255,255,.9);pointer-events:none}.wm-route{background:none;border:none}.wm-route-inner{position:absolute;left:0;top:0;transform:translate(-50%,-50%);background:var(--c,#333);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:8px;white-space:nowrap;box-shadow:0 1px 3px #00000059;pointer-events:none}.wm-zoom-low .wm-minor{display:none}.wm-station .wm-route-inner{background:#fff;color:#33404c;border:1.5px solid var(--c,#888);border-radius:6px;font-size:9px;font-weight:700;padding:1px 5px}.leaflet-container{font-family:inherit;background:#e8edf2;border-radius:16px}.leaflet-container a{color:#2f6fed}.leaflet-popup-content{font-size:13px;line-height:1.5}.page[data-v-c4f2d266]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-c4f2d266]{max-width:1180px;margin:0 auto}.page-header[data-v-c4f2d266]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-c4f2d266]{margin:0 0 6px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-c4f2d266]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-c4f2d266]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-c4f2d266]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-c4f2d266]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-c4f2d266]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-c4f2d266]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-c4f2d266]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-c4f2d266]{background:var(--md-error-container);color:var(--md-on-error-container)}.stat-grid[data-v-c4f2d266]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-c4f2d266]{display:flex;align-items:center;gap:10px}.stat-label[data-v-c4f2d266]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-c4f2d266]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-c4f2d266]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-c4f2d266]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-c4f2d266]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-c4f2d266]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-c4f2d266]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-c4f2d266]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-c4f2d266]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-c4f2d266]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-c4f2d266]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-c4f2d266]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-c4f2d266]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-c4f2d266]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-c4f2d266]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-c4f2d266]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field input[data-v-c4f2d266]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}.search-field.mini[data-v-c4f2d266]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-c4f2d266]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-c4f2d266]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-c4f2d266]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-c4f2d266]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-c4f2d266]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-c4f2d266]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-c4f2d266]{background:#fff1dc;color:#7a4400}.error-banner[data-v-c4f2d266]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px;margin:var(--space-lg) 0}.notice[data-v-c4f2d266]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-c4f2d266]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-c4f2d266]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card-enter-active[data-v-c4f2d266]{transition:opacity .2s var(--ease-emphasized-decel),transform .2s var(--ease-emphasized-decel)}.memory-card-leave-active[data-v-c4f2d266]{transition:opacity .16s var(--ease-emphasized-accel),transform .16s var(--ease-emphasized-accel)}.memory-card-enter-from[data-v-c4f2d266]{opacity:0;transform:translateY(6px) scale(.98)}.memory-card-leave-to[data-v-c4f2d266]{opacity:0;transform:scale(.98)}.memory-card-move[data-v-c4f2d266]{transition:transform .26s var(--ease-emphasized)}@media(prefers-reduced-motion:reduce){.memory-card-enter-active[data-v-c4f2d266],.memory-card-leave-active[data-v-c4f2d266],.memory-card-move[data-v-c4f2d266]{transition-duration:1ms}.memory-card-enter-from[data-v-c4f2d266],.memory-card-leave-to[data-v-c4f2d266]{transform:none}}.memory-card[data-v-c4f2d266]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-c4f2d266]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-c4f2d266]{position:relative;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon[data-v-c4f2d266]:after{content:\"\";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}.btn-icon.danger[data-v-c4f2d266]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-c4f2d266]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-c4f2d266]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-c4f2d266]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-c4f2d266]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-c4f2d266]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-c4f2d266]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-c4f2d266]{display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(var(--v,0%));border-radius:999px;transition:transform .3s var(--ease-out,ease)}.fill-primary[data-v-c4f2d266]{background:var(--md-primary)}.fill-secondary[data-v-c4f2d266]{background:var(--md-secondary,#536255)}.meter-text[data-v-c4f2d266]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-c4f2d266]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-c4f2d266]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-c4f2d266]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-c4f2d266]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-c4f2d266]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-c4f2d266]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-c4f2d266]{display:none}.empty-state[data-v-c4f2d266]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-c4f2d266]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-c4f2d266]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-c4f2d266]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-c4f2d266]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-c4f2d266]{display:flex;flex-direction:column;gap:10px}.input[data-v-c4f2d266]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-c4f2d266]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-c4f2d266]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-c4f2d266],.reflection-list[data-v-c4f2d266]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-c4f2d266]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-c4f2d266]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-c4f2d266]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-c4f2d266]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-c4f2d266]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-c4f2d266]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-c4f2d266]{margin-top:var(--space-lg)}.reader pre[data-v-c4f2d266]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-c4f2d266]{font-size:14px;font-weight:600}.reflection details[data-v-c4f2d266]{margin-top:6px}.reflection summary[data-v-c4f2d266]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-c4f2d266]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}#app .memory-page .page-header h1[data-v-c4f2d266]{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}#app .memory-page .stat-grid[data-v-c4f2d266]{gap:var(--space-lg)}#app .memory-page .stat-card[data-v-c4f2d266],#app .memory-page .card[data-v-c4f2d266],#app .memory-page .memory-card[data-v-c4f2d266]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .memory-page .stat-card[data-v-c4f2d266]{border-radius:24px;transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}@media(hover:hover)and (pointer:fine){#app .memory-page .stat-card[data-v-c4f2d266]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}#app .memory-page .stat-value[data-v-c4f2d266]{font-size:34px;font-weight:800;letter-spacing:-.02em}#app .memory-page .icon-badge[data-v-c4f2d266]{width:44px;height:44px;border-radius:16px 16px 16px 6px}#app .memory-page .card[data-v-c4f2d266],#app .memory-page .memory-card[data-v-c4f2d266]{border-radius:24px}#app .memory-page .memory-card[data-v-c4f2d266]{transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .22s,border-color .2s}@media(hover:hover)and (pointer:fine){#app .memory-page .memory-card[data-v-c4f2d266]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .memory-page .btn[data-v-c4f2d266]{height:44px;padding:0 20px;border-radius:999px;font-weight:700}#app .memory-page .btn-sm[data-v-c4f2d266]{height:34px;padding:0 14px;font-size:13px}#app .memory-page .btn-tonal[data-v-c4f2d266]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .memory-page .btn-primary[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 28%,transparent)}#app .memory-page .input[data-v-c4f2d266]{height:48px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);transition:background-color .18s,border-color .18s,box-shadow .2s}#app .memory-page .input[data-v-c4f2d266]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .memory-page .input.area[data-v-c4f2d266]{height:auto;padding:14px 16px}#app .memory-page .search-field input[data-v-c4f2d266]{height:44px}#app .memory-page .search-field.mini[data-v-c4f2d266]{border-color:transparent;background:var(--md-surface-container-high);border-radius:14px}#app .memory-page .select select[data-v-c4f2d266]{height:44px;border-color:transparent;border-radius:14px;background:var(--md-surface-container-high);padding:0 14px}#app .memory-page .tabs[data-v-c4f2d266]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .memory-page .tabs button[data-v-c4f2d266]{border-radius:999px;padding:9px 20px;font-weight:650}#app .memory-page .tabs button.active[data-v-c4f2d266]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:var(--shadow-1)}#app .memory-page .note-item[data-v-c4f2d266]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-low)}@media(prefers-reduced-motion:reduce){#app .memory-page .stat-card[data-v-c4f2d266]:hover,#app .memory-page .memory-card[data-v-c4f2d266]:hover{transform:none}.meter-bar i[data-v-c4f2d266]{transition:none}}@media(max-width:900px){.stat-grid[data-v-c4f2d266]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-c4f2d266]{grid-template-columns:1fr}}@media(max-width:640px){.page[data-v-c4f2d266]{padding:var(--space-lg)}.header-actions[data-v-c4f2d266]{padding-top:0}.memory-list[data-v-c4f2d266]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
