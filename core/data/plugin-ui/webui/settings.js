var Ge = Object.defineProperty;
var Xe = (z, s, y) => s in z ? Ge(z, s, { enumerable: !0, configurable: !0, writable: !0, value: y }) : z[s] = y;
var H = (z, s, y) => Xe(z, typeof s != "symbol" ? s + "" : s, y);
import { defineComponent as ee, reactive as Ze, ref as M, onMounted as ie, openBlock as i, createElementBlock as d, createElementVNode as e, createTextVNode as G, toDisplayString as n, withDirectives as V, vModelCheckbox as te, vModelText as F, Fragment as D, renderList as q, normalizeClass as J, createCommentVNode as U, computed as W, onUnmounted as Te, unref as l, withKeys as Qe, createStaticVNode as et, createVNode as Q, vModelDynamic as tt, watch as He, vModelSelect as st, shallowRef as Oe, createBlock as le, resolveDynamicComponent as lt, withModifiers as Le } from "vue";
import { useRouter as je, useRoute as ot } from "vue-router";
import { useI18n as re } from "vue-i18n";
import { apiGet as pe, apiPost as Ce, ApiError as Ye, useConfirm as Ne, useProvidersStore as nt, PROVIDERS as Ee, AppSelect as de, getLanguage as at, LOCALES as it, setLanguage as rt, useWizardStore as Ve, useSettingsMeta as Ie, useUIPatchesStore as Je, PinInput as ze, useSettingsSectionsStore as ut, DEFAULT_LIVE2D_MODELS as dt } from "@0kay/host";
import { L as ct } from "./assets/Live2DStage-w9T1h3vJ.js";
import { _ as ue } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
const pt = { class: "life-settings" }, vt = { class: "ls-hero" }, ht = ["disabled"], mt = { class: "ls-grid" }, gt = { class: "ls-card" }, _t = { class: "ls-switch" }, bt = { class: "ls-switch" }, yt = { class: "ls-field" }, ft = { class: "ls-card" }, kt = { class: "ls-note" }, wt = { class: "ls-models" }, $t = ["onClick"], Ct = {
  key: 0,
  class: "ls-empty"
}, St = { class: "ls-models" }, Pt = ["onClick"], xt = {
  key: 0,
  class: "ls-empty"
}, Mt = { class: "ls-card" }, Ut = { class: "ls-switch" }, Et = { class: "ls-switch" }, At = { class: "ls-card" }, Tt = { class: "ls-switch" }, Nt = { class: "ls-card ls-card-wide" }, Vt = { class: "ls-row" }, It = { class: "ls-switch" }, Rt = { class: "ls-switch" }, Ot = { class: "ls-row" }, Lt = { class: "ls-field" }, zt = { class: "ls-field" }, Dt = { class: "ls-row" }, Ft = { class: "ls-field" }, Bt = { class: "ls-field" }, Kt = { class: "ls-row" }, Ht = { class: "ls-field" }, jt = { class: "ls-field" }, Yt = {
  key: 0,
  class: "ls-state"
}, Jt = /* @__PURE__ */ ee({
  __name: "LifeSettingsPanel",
  setup(z) {
    const s = Ze({
      screen_watch: !1,
      computer_use: !1,
      report_agent_host: "",
      // Fail closed: mail approval defaults ON so an unloaded/failed settings read
      // cannot silently persist an auto-approve state.
      mail_require_approval: !0,
      mail_auto_approve_all: !1,
      mcp_enabled: !0,
      onebot_enabled: !1,
      onebot_ws_url: "ws://127.0.0.1:6700",
      onebot_http_url: "http://127.0.0.1:6700",
      onebot_access_token: "",
      onebot_trigger_keywords: "",
      onebot_observe_group: !0,
      proactive_daily_limit: 3,
      proactive_target_limit: 1,
      think_model: "",
      output_model: ""
    }), y = M(""), _ = M(!1), w = M(!1), k = M([]), p = M(""), $ = M([]);
    async function C() {
      try {
        const [a, t] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (a.ok && (Object.assign(s, (await a.json()).values || {}), w.value = !0), t.ok) {
          const o = await t.json();
          $.value = Array.isArray(o.models) ? o.models.map((c) => ({ id: c.id, provider: c.provider || "custom", supports_thinking: c.supports_thinking })).filter((c) => c.id) : [], k.value = $.value.map((c) => c.id), p.value = "mocr 当前模型目录（由 Core 同步）";
        }
      } catch {
        y.value = "无法读取 LIFE 设置或模型目录";
      }
    }
    async function u() {
      if (!w.value) {
        y.value = "设置尚未加载，已阻止保存以避免写回默认值";
        return;
      }
      _.value = !0, y.value = "";
      try {
        const a = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: s }) });
        if (!a.ok) throw new Error(String(a.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: s.screen_watch, computer_use: s.computer_use, report_agent_host: s.report_agent_host }) }), y.value = "已保存，LIFE 会在下一次设置轮询时应用。";
      } catch {
        y.value = "保存失败";
      } finally {
        _.value = !1;
      }
    }
    return ie(C), (a, t) => (i(), d("section", pt, [
      e("header", vt, [
        t[15] || (t[15] = e("div", { class: "ls-hero-main" }, [
          e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS"),
          e("h2", null, "L.I.F.E 专属设置"),
          e("p", { class: "ls-sub" }, "敏感功能默认关闭；凭据仅保存在本机 Core settings 文件。")
        ], -1)),
        e("button", {
          class: "ls-save",
          disabled: _.value,
          onClick: u
        }, [
          t[14] || (t[14] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          G(n(_.value ? "保存中…" : "保存"), 1)
        ], 8, ht)
      ]),
      e("div", mt, [
        e("article", gt, [
          t[21] || (t[21] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-1" }, "◉"),
            e("h3", null, "Agent 主机权限")
          ], -1)),
          e("label", _t, [
            V(e("input", {
              "onUpdate:modelValue": t[0] || (t[0] = (o) => s.screen_watch = o),
              type: "checkbox"
            }, null, 512), [
              [te, s.screen_watch]
            ]),
            t[16] || (t[16] = e("span", { class: "ls-track" }, null, -1)),
            t[17] || (t[17] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许屏幕观察"),
              e("small", null, "读取当前屏幕内容")
            ], -1))
          ]),
          e("label", bt, [
            V(e("input", {
              "onUpdate:modelValue": t[1] || (t[1] = (o) => s.computer_use = o),
              type: "checkbox"
            }, null, 512), [
              [te, s.computer_use]
            ]),
            t[18] || (t[18] = e("span", { class: "ls-track" }, null, -1)),
            t[19] || (t[19] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许计算机操作"),
              e("small", null, "执行鼠标/键盘操作")
            ], -1))
          ]),
          e("label", yt, [
            t[20] || (t[20] = e("span", null, "指定 Agent 主机（可选）", -1)),
            V(e("input", {
              "onUpdate:modelValue": t[2] || (t[2] = (o) => s.report_agent_host = o),
              placeholder: "hostname 或地址"
            }, null, 512), [
              [F, s.report_agent_host]
            ])
          ])
        ]),
        e("article", ft, [
          t[22] || (t[22] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-2" }, "✦"),
            e("h3", null, "THINK / OUTPUT 模型")
          ], -1)),
          e("p", kt, n(p.value || "正在读取 mocr 模型目录…"), 1),
          t[23] || (t[23] = e("p", { class: "ls-label" }, "THINK · 内部思考、记忆与工具规划", -1)),
          e("div", wt, [
            (i(!0), d(D, null, q($.value, (o) => (i(), d("button", {
              key: "think-" + o.id,
              type: "button",
              class: J(["ls-model", { selected: s.think_model === o.id }]),
              onClick: (c) => s.think_model = o.id
            }, [
              e("b", null, n(o.id), 1),
              e("span", null, n(o.provider) + " · " + n(o.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, $t))), 128)),
            $.value.length ? U("", !0) : (i(), d("span", Ct, "暂无模型"))
          ]),
          t[24] || (t[24] = e("p", { class: "ls-label" }, "OUTPUT · 最终人格化回复", -1)),
          e("div", St, [
            (i(!0), d(D, null, q($.value, (o) => (i(), d("button", {
              key: "output-" + o.id,
              type: "button",
              class: J(["ls-model", { selected: s.output_model === o.id }]),
              onClick: (c) => s.output_model = o.id
            }, [
              e("b", null, n(o.id), 1),
              e("span", null, n(o.provider) + " · output", 1)
            ], 10, Pt))), 128)),
            $.value.length ? U("", !0) : (i(), d("span", xt, "暂无模型"))
          ])
        ]),
        e("article", Mt, [
          t[29] || (t[29] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-3" }, "✉"),
            e("h3", null, "邮件收发")
          ], -1)),
          t[30] || (t[30] = e("p", { class: "ls-note" }, [
            G("邮件（收信 IMAP / 发信 SMTP）由内置的 "),
            e("code", null, "0kay-mcp"),
            G(" mail 服务器提供。请到「设置 → MCP」的服务器列表中配置 "),
            e("code", null, "mail"),
            G(" 服务器的 SMTP/IMAP 凭据。")
          ], -1)),
          e("label", Ut, [
            V(e("input", {
              "onUpdate:modelValue": t[3] || (t[3] = (o) => s.mail_auto_approve_all = o),
              type: "checkbox"
            }, null, 512), [
              [te, s.mail_auto_approve_all]
            ]),
            t[25] || (t[25] = e("span", { class: "ls-track" }, null, -1)),
            t[26] || (t[26] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "全部自动审批"),
              e("small", null, "所有需确认的权限直接通过，不再弹窗询问")
            ], -1))
          ]),
          e("label", Et, [
            V(e("input", {
              "onUpdate:modelValue": t[4] || (t[4] = (o) => s.mail_require_approval = o),
              type: "checkbox"
            }, null, 512), [
              [te, s.mail_require_approval]
            ]),
            t[27] || (t[27] = e("span", { class: "ls-track" }, null, -1)),
            t[28] || (t[28] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "邮件操作需弹窗确认"),
              e("small", null, "读取 / 发送邮件前先在 WebUI 询问你")
            ], -1))
          ])
        ]),
        e("article", At, [
          t[33] || (t[33] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", Tt, [
            V(e("input", {
              "onUpdate:modelValue": t[5] || (t[5] = (o) => s.mcp_enabled = o),
              type: "checkbox"
            }, null, 512), [
              [te, s.mcp_enabled]
            ]),
            t[31] || (t[31] = e("span", { class: "ls-track" }, null, -1)),
            t[32] || (t[32] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许调用 MCP 工具"),
              e("small", null, "服务清单在 Agent 设置中维护")
            ], -1))
          ])
        ]),
        e("article", Nt, [
          t[44] || (t[44] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-5" }, "☷"),
            e("h3", null, "OneBot v11 与主动行为")
          ], -1)),
          e("div", Vt, [
            e("label", It, [
              V(e("input", {
                "onUpdate:modelValue": t[6] || (t[6] = (o) => s.onebot_enabled = o),
                type: "checkbox"
              }, null, 512), [
                [te, s.onebot_enabled]
              ]),
              t[34] || (t[34] = e("span", { class: "ls-track" }, null, -1)),
              t[35] || (t[35] = e("span", { class: "ls-switch-text" }, [
                e("b", null, "启用 OneBot")
              ], -1))
            ]),
            e("label", Rt, [
              V(e("input", {
                "onUpdate:modelValue": t[7] || (t[7] = (o) => s.onebot_observe_group = o),
                type: "checkbox"
              }, null, 512), [
                [te, s.onebot_observe_group]
              ]),
              t[36] || (t[36] = e("span", { class: "ls-track" }, null, -1)),
              t[37] || (t[37] = e("span", { class: "ls-switch-text" }, [
                e("b", null, "仅观察群聊"),
                e("small", null, "未触发时不回复")
              ], -1))
            ])
          ]),
          e("div", Ot, [
            e("label", Lt, [
              t[38] || (t[38] = e("span", null, "WebSocket 地址", -1)),
              V(e("input", {
                "onUpdate:modelValue": t[8] || (t[8] = (o) => s.onebot_ws_url = o),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [F, s.onebot_ws_url]
              ])
            ]),
            e("label", zt, [
              t[39] || (t[39] = e("span", null, "HTTP API 地址", -1)),
              V(e("input", {
                "onUpdate:modelValue": t[9] || (t[9] = (o) => s.onebot_http_url = o),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [F, s.onebot_http_url]
              ])
            ])
          ]),
          e("div", Dt, [
            e("label", Ft, [
              t[40] || (t[40] = e("span", null, "Access Token", -1)),
              V(e("input", {
                "onUpdate:modelValue": t[10] || (t[10] = (o) => s.onebot_access_token = o),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [F, s.onebot_access_token]
              ])
            ]),
            e("label", Bt, [
              t[41] || (t[41] = e("span", null, "触发关键词（逗号分隔，留空=全部）", -1)),
              V(e("input", {
                "onUpdate:modelValue": t[11] || (t[11] = (o) => s.onebot_trigger_keywords = o),
                placeholder: "bot,在吗"
              }, null, 512), [
                [F, s.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", Kt, [
            e("label", Ht, [
              t[42] || (t[42] = e("span", null, "每日主动上限", -1)),
              V(e("input", {
                "onUpdate:modelValue": t[12] || (t[12] = (o) => s.proactive_daily_limit = o),
                type: "number",
                min: "0",
                placeholder: "3"
              }, null, 512), [
                [
                  F,
                  s.proactive_daily_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", jt, [
              t[43] || (t[43] = e("span", null, "单目标上限", -1)),
              V(e("input", {
                "onUpdate:modelValue": t[13] || (t[13] = (o) => s.proactive_target_limit = o),
                type: "number",
                min: "0",
                placeholder: "1"
              }, null, 512), [
                [
                  F,
                  s.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ])
      ]),
      y.value ? (i(), d("p", Yt, n(y.value), 1)) : U("", !0)
    ]));
  }
}), Wt = /* @__PURE__ */ ue(Jt, [["__scopeId", "data-v-153238d0"]]), qt = { class: "content-card about" }, Gt = { class: "identity" }, Xt = { class: "app-id" }, Zt = { class: "ver-badge" }, Qt = { class: "app-desc" }, es = { class: "identity-actions" }, ts = ["href"], ss = { class: "section" }, ls = { class: "section-head" }, os = ["disabled"], ns = {
  key: 0,
  class: "alert",
  role: "alert"
}, as = {
  class: "us-hero-icon",
  "aria-hidden": "true"
}, is = {
  key: 0,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, rs = {
  key: 1,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, us = {
  key: 2,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, ds = { class: "us-hero-text" }, cs = { key: 0 }, ps = { key: 1 }, vs = { class: "us-hero-actions" }, hs = ["disabled"], ms = ["disabled", "title"], gs = ["href"], _s = {
  key: 2,
  class: "us-notes"
}, bs = { class: "us-notes-title" }, ys = { class: "us-notes-body" }, fs = {
  key: 3,
  class: "alert",
  role: "alert"
}, ks = { class: "us-apply-head" }, ws = { key: 0 }, $s = { key: 1 }, Cs = {
  key: 0,
  class: "us-chip-tag"
}, Ss = { class: "us-apply-label" }, Ps = {
  key: 0,
  class: "us-apply-error"
}, xs = {
  key: 1,
  class: "us-apply-log"
}, Ms = { class: "section" }, Us = { class: "section-title" }, Es = { class: "credits" }, As = ["href"], Ts = ["src", "alt"], Ns = { class: "person-info" }, Vs = { class: "name" }, Is = { class: "role" }, Rs = ["src"], Os = { class: "person-info" }, Ls = { class: "role" }, zs = { class: "section-head contributors-head" }, Ds = { class: "section-title" }, Fs = { class: "muted" }, Bs = {
  key: 0,
  class: "contribs"
}, Ks = ["href"], Hs = ["src", "alt"], js = { class: "login" }, Ys = {
  key: 0,
  class: "count"
}, Js = {
  key: 1,
  class: "muted"
}, Ws = ["href"], qs = { class: "foot" }, Gs = ["href"], Ae = "https://github.com/RazureSOFT/0KAY", Xs = "https://github.com/RazureSOFT", Zs = /* @__PURE__ */ ee({
  __name: "AboutPanel",
  setup(z) {
    const { t: s } = re(), y = M("0.1.2"), _ = M([]), w = M(""), k = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, p = (A, N = 96) => `https://github.com/${A}.png?size=${N}`, $ = M(!1), C = M(null), u = M(""), a = M(null), t = M("");
    let o = null;
    function c(A) {
      return a.value?.status === "running" && a.value.plugin === A;
    }
    async function m(A, N) {
      if (a.value?.status !== "running") {
        t.value = "";
        try {
          a.value = await Ce("/api/plugins/pm/update", { plugin: A, version: N || "" }), S();
        } catch (j) {
          t.value = j instanceof Error ? j.message : String(j);
        }
      }
    }
    async function g() {
      try {
        a.value = await pe("/api/plugins/pm/status");
      } catch {
        return;
      }
      a.value && a.value.status !== "running" && (v(), E());
    }
    function S() {
      o || (o = setInterval(g, 2e3));
    }
    function v() {
      o && (clearInterval(o), o = null);
    }
    const I = W(() => {
      switch (a.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), R = W(() => C.value ? C.value.has_update ? "warn" : C.value.latest ? "ok" : "none" : "none");
    async function E() {
      $.value = !0, u.value = "";
      try {
        const A = await pe("/api/plugins/pm/check");
        C.value = A, A?.current && (y.value = String(A.current));
      } catch (A) {
        u.value = A instanceof Ye && A.status === 404 ? s("settings.about.unsupported") : A instanceof Error ? A.message : String(A);
      } finally {
        $.value = !1;
      }
    }
    async function x() {
      try {
        const A = { Accept: "application/vnd.github+json" }, [N, j] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: A }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: A })
        ]);
        if (!N.ok) throw new Error(`HTTP ${N.status}`);
        const X = /* @__PURE__ */ new Map(), B = await N.json();
        for (const L of Array.isArray(B) ? B : [])
          L?.login && X.set(L.login, L);
        if (j.ok) {
          const L = await j.json();
          for (const K of Array.isArray(L) ? L : []) {
            const O = K?.author;
            !O?.login || O.login.endsWith("[bot]") || X.has(O.login) || X.set(O.login, {
              login: O.login,
              avatar_url: O.avatar_url,
              html_url: O.html_url,
              contributions: 0
            });
          }
        }
        _.value = [...X.values()].sort(
          (L, K) => (K.contributions || 0) - (L.contributions || 0) || L.login.localeCompare(K.login)
        );
      } catch (A) {
        w.value = A instanceof Error ? A.message : String(A), _.value = [];
      }
    }
    return ie(() => {
      E(), x(), pe("/api/plugins/pm/status").then((A) => {
        a.value = A, A?.status === "running" && S();
      }).catch(() => {
      });
    }), Te(v), (A, N) => (i(), d("div", qt, [
      e("header", Gt, [
        N[3] || (N[3] = e("div", {
          class: "app-icon",
          "aria-hidden": "true"
        }, "0K", -1)),
        e("div", Xt, [
          e("h2", null, [
            N[2] || (N[2] = G("0KAY ", -1)),
            e("span", Zt, "v" + n(y.value), 1)
          ]),
          e("p", Qt, n(l(s)("settings.about.description")), 1)
        ]),
        e("div", es, [
          e("a", {
            class: "btn btn-tonal sm",
            href: Ae,
            target: "_blank",
            rel: "noopener noreferrer"
          }, n(l(s)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${Ae}/releases`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "Releases ↗", 8, ts)
        ])
      ]),
      e("section", ss, [
        e("div", ls, [
          N[4] || (N[4] = e("h3", { class: "section-title" }, "0KAY", -1)),
          e("button", {
            class: "btn btn-tonal sm",
            disabled: $.value,
            onClick: E
          }, n(l(s)($.value ? "settings.about.checking" : "settings.about.check")), 9, os)
        ]),
        u.value ? (i(), d("p", ns, n(u.value), 1)) : (i(), d("div", {
          key: 1,
          class: J(["us-hero", R.value])
        }, [
          e("div", as, [
            R.value === "ok" ? (i(), d("svg", is, [...N[5] || (N[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : R.value === "warn" ? (i(), d("svg", rs, [...N[6] || (N[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (i(), d("svg", us, [...N[7] || (N[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", ds, [
            e("b", null, n(l(s)(R.value === "warn" ? "settings.about.available" : R.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            C.value?.latest ? (i(), d("span", cs, [
              G("v" + n(C.value.current) + " → ", 1),
              e("em", null, "v" + n(C.value.latest), 1)
            ])) : (i(), d("span", ps, "0KAY v" + n(C.value?.current || y.value), 1))
          ]),
          e("div", vs, [
            C.value?.has_update ? (i(), d("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: c("core"),
              onClick: N[0] || (N[0] = (j) => m("core", C.value.latest))
            }, n(c("core") ? l(s)("settings.about.updating") : l(s)("settings.about.updateNow")), 9, hs)) : U("", !0),
            C.value?.source_available !== !1 ? (i(), d("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: c("core"),
              title: l(s)("settings.about.betaHint"),
              onClick: N[1] || (N[1] = (j) => m("core"))
            }, n(c("core") ? l(s)("settings.about.updating") : l(s)("settings.about.beta")), 9, ms)) : U("", !0),
            C.value?.url ? (i(), d("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: C.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, gs)) : U("", !0)
          ])
        ], 2)),
        C.value?.notes ? (i(), d("div", _s, [
          e("p", bs, n(l(s)("settings.about.whatsNew")), 1),
          e("pre", ys, n(C.value.notes), 1)
        ])) : U("", !0),
        t.value ? (i(), d("p", fs, n(t.value), 1)) : U("", !0),
        a.value && a.value.status !== "idle" ? (i(), d("div", {
          key: 4,
          class: J(["us-apply-banner", a.value.status])
        }, [
          e("div", ks, [
            N[8] || (N[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              G(n(a.value.package), 1),
              a.value.version ? (i(), d("span", ws, "@" + n(a.value.version), 1)) : (i(), d("span", $s, " · main"))
            ]),
            a.value.mode === "source" ? (i(), d("span", Cs, n(l(s)("settings.about.sourceMode")), 1)) : U("", !0),
            e("span", Ss, n(I.value), 1)
          ]),
          a.value.error ? (i(), d("p", Ps, n(a.value.error), 1)) : U("", !0),
          a.value.log ? (i(), d("pre", xs, n(a.value.log), 1)) : U("", !0)
        ], 2)) : U("", !0)
      ]),
      e("section", Ms, [
        e("h3", Us, n(l(s)("settings.about.developerTitle")) + " & " + n(l(s)("settings.about.teamTitle")), 1),
        e("div", Es, [
          e("a", {
            class: "person",
            href: k.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: k.avatar,
              alt: k.login,
              loading: "lazy"
            }, null, 8, Ts),
            e("div", Ns, [
              e("span", Vs, n(k.login), 1),
              e("span", Is, n(l(s)("settings.about.developerTitle")), 1)
            ]),
            N[9] || (N[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, As),
          e("a", {
            class: "person",
            href: Xs,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: p("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, Rs),
            e("div", Os, [
              N[10] || (N[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", Ls, n(l(s)("settings.about.teamTitle")), 1)
            ]),
            N[11] || (N[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", zs, [
          e("h3", Ds, n(l(s)("settings.about.contributorsTitle")), 1),
          e("span", Fs, n(l(s)("settings.about.contributorsFrom")), 1)
        ]),
        _.value.length ? (i(), d("div", Bs, [
          (i(!0), d(D, null, q(_.value, (j) => (i(), d("a", {
            key: j.login,
            class: "contrib",
            href: j.html_url || `https://github.com/${j.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: j.avatar_url || p(j.login, 64),
              alt: j.login,
              loading: "lazy"
            }, null, 8, Hs),
            e("span", js, n(j.login), 1),
            j.contributions ? (i(), d("span", Ys, n(j.contributions), 1)) : U("", !0)
          ], 8, Ks))), 128))
        ])) : (i(), d("p", Js, [
          e("a", {
            class: "repo-link",
            href: k.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "razureink ↗", 8, Ws)
        ]))
      ]),
      e("footer", qs, [
        N[12] || (N[12] = e("span", { class: "status-chip" }, "MIT", -1)),
        N[13] || (N[13] = e("span", null, "© 2026 RazureSOFT", -1)),
        e("a", {
          class: "repo-link",
          href: `${Ae}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, Gs)
      ])
    ]));
  }
}), Qs = /* @__PURE__ */ ue(Zs, [["__scopeId", "data-v-979e4119"]]), el = { class: "content-card updates" }, tl = { class: "us-block" }, sl = { class: "us-head" }, ll = { class: "us-head-text" }, ol = { class: "us-title" }, nl = { class: "us-desc" }, al = { class: "us-source" }, il = { class: "us-input-group" }, rl = ["disabled", "placeholder"], ul = ["disabled"], dl = { class: "us-chips" }, cl = ["disabled"], pl = ["disabled"], vl = {
  key: 0,
  class: "us-saved"
}, hl = { class: "helper-text" }, ml = {
  key: 0,
  class: "alert"
}, gl = { class: "us-block" }, _l = { class: "us-head" }, bl = { class: "us-head-text" }, yl = { class: "us-title" }, fl = { class: "us-desc" }, kl = { class: "us-head-actions" }, wl = ["disabled"], $l = {
  key: 0,
  class: "alert",
  role: "alert"
}, Cl = { class: "us-apply-head" }, Sl = { key: 0 }, Pl = { key: 1 }, xl = {
  key: 0,
  class: "us-chip-tag"
}, Ml = { class: "us-apply-label" }, Ul = {
  key: 0,
  class: "us-apply-error"
}, El = {
  key: 1,
  class: "us-apply-log"
}, Al = {
  key: 2,
  class: "alert",
  role: "alert"
}, Tl = {
  key: 3,
  class: "us-table"
}, Nl = { class: "us-name" }, Vl = { class: "us-ver" }, Il = { class: "us-actions" }, Rl = ["disabled", "onClick"], Ol = ["disabled", "onClick"], Ll = ["href", "title"], zl = {
  key: 0,
  class: "us-empty"
}, Dl = /* @__PURE__ */ ee({
  __name: "UpdatesPanel",
  setup(z) {
    const { t: s } = re(), y = M(!1), _ = M(null), w = M(""), k = M(null), p = M("");
    let $ = null;
    const C = M(""), u = M(""), a = M(!1), t = M(!1), o = M(!1), c = M(""), m = W(() => C.value.trim() !== u.value), g = W(() => C.value.trim() !== "");
    function S(L) {
      return k.value?.status === "running" && k.value.plugin === L;
    }
    async function v(L, K) {
      if (k.value?.status !== "running") {
        p.value = "";
        try {
          k.value = await Ce("/api/plugins/pm/update", { plugin: L, version: K || "" }), R();
        } catch (O) {
          p.value = O instanceof Error ? O.message : String(O);
        }
      }
    }
    async function I() {
      try {
        k.value = await pe("/api/plugins/pm/status");
      } catch {
        return;
      }
      k.value && k.value.status !== "running" && (E(), N());
    }
    function R() {
      $ || ($ = setInterval(I, 2e3));
    }
    function E() {
      $ && (clearInterval($), $ = null);
    }
    const x = W(() => {
      switch (k.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), A = W(() => (_.value || []).filter((L) => L.has_update).length);
    async function N() {
      y.value = !0, w.value = "";
      try {
        const L = await pe("/api/plugins/pm/check-plugins");
        _.value = L?.plugins || [];
      } catch (L) {
        w.value = L instanceof Ye && L.status === 404 ? s("settings.about.unsupported") : L instanceof Error ? L.message : String(L);
      } finally {
        y.value = !1;
      }
    }
    async function j() {
      a.value = !0, c.value = "";
      try {
        const L = await pe("/api/settings/updates"), K = String(L?.values?.github_proxy ?? "");
        C.value = K, u.value = K;
      } catch {
      } finally {
        a.value = !1;
      }
    }
    async function X() {
      t.value = !0, c.value = "";
      try {
        const L = C.value.trim();
        await Ce("/api/settings/updates", { values: { github_proxy: L } }), u.value = L, o.value = !0, setTimeout(() => {
          o.value = !1;
        }, 1500);
      } catch (L) {
        c.value = L instanceof Error ? L.message : String(L);
      } finally {
        t.value = !1;
      }
    }
    function B(L) {
      C.value = L, X();
    }
    return ie(() => {
      N(), j(), pe("/api/plugins/pm/status").then((L) => {
        k.value = L, L?.status === "running" && R();
      }).catch(() => {
      });
    }), Te(E), (L, K) => (i(), d("div", el, [
      e("section", tl, [
        e("header", sl, [
          K[3] || (K[3] = e("span", {
            class: "us-ico",
            "aria-hidden": "true"
          }, [
            e("svg", {
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              e("path", {
                d: "M4 15a4 4 0 0 1 1.2-7.8A5.5 5.5 0 0 1 16 8.5a3.5 3.5 0 0 1 4 3.4A3.6 3.6 0 0 1 16.4 15H4z",
                stroke: "currentColor",
                "stroke-width": "1.8",
                "stroke-linejoin": "round"
              }),
              e("path", {
                d: "M12 11v7m0 0l-2.5-2.5M12 18l2.5-2.5",
                stroke: "currentColor",
                "stroke-width": "1.8",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ])
          ], -1)),
          e("div", ll, [
            e("h3", ol, n(l(s)("settings.pluginSourceTitle")), 1),
            e("p", nl, n(l(s)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: J(["us-tag", { on: g.value }])
          }, n(g.value ? "ghproxy" : l(s)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", al, [
          e("div", il, [
            K[4] || (K[4] = e("span", {
              class: "us-input-ico",
              "aria-hidden": "true"
            }, [
              e("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none"
              }, [
                e("path", {
                  d: "M10 14a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1",
                  stroke: "currentColor",
                  "stroke-width": "1.8",
                  "stroke-linecap": "round"
                }),
                e("path", {
                  d: "M14 10a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1",
                  stroke: "currentColor",
                  "stroke-width": "1.8",
                  "stroke-linecap": "round"
                })
              ])
            ], -1)),
            V(e("input", {
              "onUpdate:modelValue": K[0] || (K[0] = (O) => C.value = O),
              class: "us-input",
              type: "text",
              disabled: a.value,
              placeholder: l(s)("settings.pluginSourcePlaceholder"),
              onKeyup: Qe(X, ["enter"])
            }, null, 40, rl), [
              [F, C.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: t.value || !m.value,
              onClick: X
            }, n(l(s)("settings.save")), 9, ul)
          ]),
          e("div", dl, [
            e("button", {
              type: "button",
              class: J(["us-chip", { active: !g.value }]),
              disabled: t.value,
              onClick: K[1] || (K[1] = (O) => B(""))
            }, n(l(s)("settings.pluginSourceDirect")), 11, cl),
            e("button", {
              type: "button",
              class: J(["us-chip", { active: C.value.trim() === "https://gh-proxy.com" }]),
              disabled: t.value,
              onClick: K[2] || (K[2] = (O) => B("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, pl),
            o.value ? (i(), d("span", vl, n(l(s)("settings.saved")), 1)) : U("", !0)
          ]),
          e("p", hl, n(l(s)("settings.pluginSourceHelp")), 1),
          c.value ? (i(), d("p", ml, n(c.value), 1)) : U("", !0)
        ])
      ]),
      K[10] || (K[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", gl, [
        e("header", _l, [
          K[5] || (K[5] = et('<span class="us-ico" aria-hidden="true" data-v-d69111d9><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-d69111d9><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-d69111d9></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-d69111d9></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-d69111d9></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-d69111d9></rect></svg></span>', 1)),
          e("div", bl, [
            e("h3", yl, n(l(s)("settings.about.plugins")), 1),
            e("p", fl, n(l(s)("settings.about.updateHint")), 1)
          ]),
          e("div", kl, [
            e("span", {
              class: J(["us-count", { warn: A.value > 0 }])
            }, n(A.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: y.value,
              onClick: N
            }, n(l(s)(y.value ? "settings.about.checking" : "settings.about.check")), 9, wl)
          ])
        ]),
        p.value ? (i(), d("p", $l, n(p.value), 1)) : U("", !0),
        k.value && k.value.status !== "idle" ? (i(), d("div", {
          key: 1,
          class: J(["us-apply-banner", k.value.status])
        }, [
          e("div", Cl, [
            K[6] || (K[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              G(n(k.value.package), 1),
              k.value.version ? (i(), d("span", Sl, "@" + n(k.value.version), 1)) : (i(), d("span", Pl, " · main"))
            ]),
            k.value.mode === "source" ? (i(), d("span", xl, n(l(s)("settings.about.sourceMode")), 1)) : U("", !0),
            e("span", Ml, n(x.value), 1)
          ]),
          k.value.error ? (i(), d("p", Ul, n(k.value.error), 1)) : U("", !0),
          k.value.log ? (i(), d("pre", El, n(k.value.log), 1)) : U("", !0)
        ], 2)) : U("", !0),
        w.value ? (i(), d("p", Al, n(w.value), 1)) : U("", !0),
        _.value ? (i(), d("div", Tl, [
          K[8] || (K[8] = e("div", { class: "us-row us-thead" }, [
            e("span", null, "Plugin"),
            e("span", null, "Version"),
            e("span", null, "Status"),
            e("span")
          ], -1)),
          (i(!0), d(D, null, q(_.value, (O) => (i(), d("div", {
            key: O.name,
            class: "us-row"
          }, [
            e("span", Nl, [
              e("span", {
                class: J(["us-dot", O.error ? "bad" : O.has_update ? "warn" : O.latest ? "ok" : ""])
              }, null, 2),
              G(" " + n(O.name), 1)
            ]),
            e("span", Vl, [
              e("em", null, "v" + n(O.version || "—"), 1),
              K[7] || (K[7] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: J({ good: !!O.latest })
              }, n(O.latest ? `v${O.latest}` : "—"), 3)
            ]),
            e("span", {
              class: J(["us-status", O.error ? "bad" : O.has_update ? "warn" : O.latest ? "ok" : ""])
            }, n(O.error || l(s)(O.has_update ? "settings.about.available" : O.latest ? "settings.about.latest" : "settings.about.noRelease")), 3),
            e("span", Il, [
              O.can_update && O.has_update ? (i(), d("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: S(O.name),
                onClick: (ne) => v(O.name, O.latest)
              }, n(S(O.name) ? l(s)("settings.about.updating") : l(s)("settings.about.updateNow")), 9, Rl)) : O.can_update ? (i(), d("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: S(O.name),
                onClick: (ne) => v(O.name)
              }, n(S(O.name) ? l(s)("settings.about.updating") : l(s)("settings.about.syncNow")), 9, Ol)) : U("", !0),
              O.repository ? (i(), d("a", {
                key: 2,
                class: "us-repo",
                href: O.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: O.repository
              }, "Repo ↗", 8, Ll)) : U("", !0)
            ])
          ]))), 128)),
          _.value.length ? U("", !0) : (i(), d("p", zl, n(l(s)("settings.about.noPlugins")), 1))
        ])) : U("", !0),
        K[9] || (K[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), Fl = /* @__PURE__ */ ue(Dl, [["__scopeId", "data-v-d69111d9"]]), Bl = { class: "content-card provider-panel" }, Kl = { class: "pp-editor-head" }, Hl = ["aria-label"], jl = { class: "pp-editor-title" }, Yl = { class: "card-desc" }, Jl = { class: "pp-section" }, Wl = { class: "pp-section-title" }, ql = { class: "pp-grid" }, Gl = { class: "field" }, Xl = { class: "field" }, Zl = {
  key: 0,
  class: "pp-req"
}, Ql = ["placeholder"], eo = { class: "field pp-span" }, to = ["placeholder"], so = { class: "field" }, lo = { class: "helper-text" }, oo = { class: "field" }, no = { class: "helper-text" }, ao = { class: "pp-section" }, io = { class: "pp-section-head" }, ro = { class: "pp-section-title" }, uo = ["disabled"], co = { class: "field" }, po = { class: "pp-key" }, vo = ["type", "placeholder"], ho = {
  key: 0,
  class: "helper-text"
}, mo = {
  key: 1,
  class: "pp-probe err"
}, go = {
  key: 2,
  class: "pp-probe ok"
}, _o = { class: "pp-section" }, bo = { class: "pp-section-head" }, yo = { class: "pp-section-title" }, fo = { class: "pp-count" }, ko = ["disabled"], wo = {
  key: 0,
  class: "pp-discovered"
}, $o = { class: "pp-model-tools" }, Co = ["placeholder"], So = {
  key: 1,
  class: "pp-models"
}, Po = ["title"], xo = ["value", "onChange"], Mo = ["value"], Uo = ["title", "disabled", "onClick"], Eo = ["title"], Ao = ["checked", "onChange"], To = {
  key: 0,
  class: "helper-text"
}, No = {
  key: 2,
  class: "helper-text"
}, Vo = {
  key: 0,
  class: "pp-error",
  role: "alert"
}, Io = { class: "pp-editor-actions" }, Ro = ["disabled"], Oo = { class: "pp-list-head" }, Lo = { class: "card-desc" }, zo = { class: "pp-list-actions" }, Do = {
  key: 0,
  class: "pp-cards"
}, Fo = { class: "pp-card-head" }, Bo = { class: "pp-logo" }, Ko = ["src", "alt"], Ho = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, jo = { class: "pp-card-id" }, Yo = ["title"], Jo = { class: "pp-card-badges" }, Wo = {
  key: 0,
  class: "pp-badge primary"
}, qo = { class: "pp-badge" }, Go = { class: "pp-card-status" }, Xo = {
  key: 0,
  class: "pp-meta"
}, Zo = ["title"], Qo = { class: "pp-chips" }, en = {
  key: 0,
  class: "pp-chip more"
}, tn = {
  key: 1,
  class: "pp-chip empty"
}, sn = { class: "pp-card-actions" }, ln = ["onClick"], on = ["disabled", "onClick"], nn = ["disabled", "onClick"], an = ["onClick"], rn = ["onClick"], un = {
  key: 1,
  class: "pp-empty"
}, dn = /* @__PURE__ */ ee({
  __name: "ProviderPanel",
  setup(z) {
    const { t: s } = re(), { confirm: y } = Ne(), _ = nt(), w = M({}), k = M("list"), p = M(null), $ = M(""), C = M({ state: "idle" }), u = M([]), a = M(""), t = M(!1), o = M(!1), c = M(!1);
    ie(async () => {
      await _.fetchAll();
      for (const b of _.providers) j(b);
    });
    function m(b) {
      return Ee.find((P) => P.id === b) || null;
    }
    function g(b) {
      return b.name && b.name.trim() ? b.name.trim() : m(b.provider)?.name || b.provider;
    }
    function S(b) {
      return m(b.provider)?.logo || "";
    }
    const v = [
      { value: "chat", label: "Chat 对话" },
      { value: "embedding", label: "Embedding 向量" },
      { value: "rerank", label: "Rerank 重排" },
      { value: "vision", label: "Vision 视觉" },
      { value: "tts", label: "TTS 语音" },
      { value: "image", label: "Image 图像" },
      { value: "audio", label: "Audio 音频" }
    ];
    function I(b) {
      return (p.value?.model_types || {})[b] || "chat";
    }
    function R(b, P) {
      if (!p.value) return;
      const h = { ...p.value.model_types || {} };
      !P || P === "chat" ? delete h[b] : h[b] = P, p.value.model_types = h;
    }
    function E(b) {
      const P = new Set(b.disabled_models || []);
      return b.models.filter((h) => !P.has(h));
    }
    function x(b) {
      return _.defaultProviderId === b.id;
    }
    function A(b) {
      const P = p.value;
      if (!P) return;
      const h = Ee.find((f) => f.id === b);
      h?.baseUrl && !P.base_url && (P.base_url = h.baseUrl), P.format = h?.format || "";
    }
    async function N(b, P = "") {
      if (!b.base_url) return { state: "error", message: s("settings.baseUrlRequired") };
      const h = performance.now();
      try {
        const f = await fetch("/api/models/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: b.id,
            provider: b.provider,
            base_url: b.base_url,
            format: b.format || "",
            api_key: P || ""
          })
        });
        if (!f.ok) throw new Error(`HTTP ${f.status}`);
        const r = await f.json(), T = Math.round(performance.now() - h);
        return r.source === "api" && Array.isArray(r.models) && r.models.length ? { state: "ok", count: r.models.length, ms: T, models: r.models } : { state: "error", message: r.error || s("settings.connectionFailed"), ms: T };
      } catch (f) {
        return { state: "error", message: f instanceof Error ? f.message : String(f) };
      }
    }
    async function j(b, P = "") {
      w.value = { ...w.value, [b.id]: { state: "checking" } };
      const h = await N(b, P);
      w.value = { ...w.value, [b.id]: h };
    }
    function X() {
      for (const b of _.providers) j(b);
    }
    function B() {
      p.value = {
        id: "",
        provider: "custom",
        name: "",
        api_key: "",
        base_url: "",
        models: [],
        disabled_models: [],
        default_model: "",
        enabled: !0,
        format: "",
        model_types: {}
      }, $.value = "", C.value = { state: "idle" }, u.value = [], a.value = "", t.value = !1, o.value = !1, k.value = "edit";
    }
    function L(b) {
      p.value = {
        ...b,
        api_key: "",
        name: b.name || "",
        models: [...b.models],
        disabled_models: [...b.disabled_models || []],
        format: b.format || "",
        model_types: { ...b.model_types || {} }
      }, o.value = !!b.api_key_masked, $.value = "", C.value = { state: "idle" }, u.value = [], a.value = "", t.value = !1, k.value = "edit";
    }
    function K() {
      k.value = "list", p.value = null, $.value = "";
    }
    async function O() {
      const b = p.value;
      if (!b) return;
      $.value = "";
      const P = (b.name || "").trim();
      if (!b.base_url.trim()) {
        $.value = s("settings.baseUrlRequired");
        return;
      }
      if (b.provider === "custom" && !P) {
        $.value = s("settings.providerNameRequired");
        return;
      }
      if (!b.models.length) {
        $.value = s("settings.modelsRequired");
        return;
      }
      b.id || (b.id = `${b.provider}_${Date.now().toString(36)}`), b.name = P, b.disabled_models = (b.disabled_models || []).filter((h) => b.models.includes(h)), (!b.default_model || !b.models.includes(b.default_model) || b.disabled_models.includes(b.default_model)) && (b.default_model = E(b)[0] || b.models[0]), c.value = !0;
      try {
        await _.upsert({ ...b }), _.defaultProviderId || await _.setDefaults(b.id, b.default_model), K(), j(_.providers.find((h) => h.id === b.id) || b);
      } catch (h) {
        $.value = h instanceof Error ? h.message : String(h);
      } finally {
        c.value = !1;
      }
    }
    async function ne(b) {
      if (await y({
        title: s("settings.remove"),
        message: `${s("settings.remove")} ${g(b)}?`,
        confirmLabel: s("settings.remove"),
        danger: !0
      }))
        try {
          await _.remove(b.id);
        } catch {
        }
    }
    async function he(b) {
      try {
        await _.upsert({ ...b, enabled: !b.enabled });
      } catch {
      }
    }
    async function Z(b) {
      const P = b.default_model || E(b)[0] || b.models[0] || "";
      try {
        await _.setDefaults(b.id, P);
      } catch {
      }
    }
    async function me() {
      const b = p.value;
      if (!b) return;
      C.value = { state: "checking" };
      const P = await N(b, b.api_key);
      C.value = P, P.state === "ok" && P.models && (u.value = P.models);
    }
    function be() {
      const b = p.value;
      !b || !u.value.length || (b.models = [...u.value], b.disabled_models = (b.disabled_models || []).filter((P) => b.models.includes(P)), b.models.includes(b.default_model) || (b.default_model = ""));
    }
    function ke(b) {
      const P = p.value;
      if (!P) return;
      const h = new Set(P.disabled_models || []);
      h.has(b) ? h.delete(b) : h.add(b), P.disabled_models = [...h], h.has(P.default_model) && (P.default_model = E(P)[0] || "");
    }
    function Pe(b) {
      const P = p.value;
      P && (P.default_model = b, P.disabled_models = (P.disabled_models || []).filter((h) => h !== b));
    }
    function we(b) {
      const P = p.value;
      P && (P.disabled_models = b ? [] : [...P.models]);
    }
    function $e() {
      const b = p.value;
      if (!b) return;
      const P = new Set(b.disabled_models || []);
      b.disabled_models = b.models.filter((h) => !P.has(h));
    }
    const ye = W(() => {
      const b = p.value?.models || [], P = a.value.trim().toLowerCase();
      return P ? b.filter((h) => h.toLowerCase().includes(P)) : b;
    }), xe = W(() => p.value ? E(p.value).length : 0);
    function ce() {
      return s("settings.fetchedSummary", { n: u.value.length });
    }
    const Me = W(() => [
      { value: "", label: s("settings.formatAuto") },
      { value: "openai", label: s("settings.formatOpenai") },
      { value: "anthropic", label: s("settings.formatAnthropic") }
    ]), Ue = W(
      () => Ee.map((b) => ({ value: b.id, label: s(`providers.${b.id}.name`, b.name) }))
    );
    return (b, P) => (i(), d("div", Bl, [
      k.value === "edit" && p.value ? (i(), d(D, { key: 0 }, [
        e("div", Kl, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: K,
            "aria-label": l(s)("settings.back")
          }, [...P[11] || (P[11] = [
            e("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              e("path", {
                d: "M15 5l-7 7 7 7",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, Hl),
          e("div", jl, [
            e("h2", null, n(p.value.id ? l(s)("settings.edit") : l(s)("settings.addProvider")), 1),
            e("p", Yl, n(l(s)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: J(["pp-status", C.value.state])
          }, [
            P[12] || (P[12] = e("span", { class: "pp-dot" }, null, -1)),
            G(" " + n(C.value.state === "checking" ? l(s)("settings.testing") : C.value.state === "ok" ? l(s)("settings.connectionOk") : C.value.state === "error" ? l(s)("settings.connectionFailed") : l(s)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", Jl, [
          e("h3", Wl, n(l(s)("settings.providerSectionBasic")), 1),
          e("div", ql, [
            e("div", Gl, [
              e("label", null, n(l(s)("wizard.provider")), 1),
              Q(l(de), {
                modelValue: p.value.provider,
                "onUpdate:modelValue": P[0] || (P[0] = (h) => p.value.provider = h),
                class: "input",
                "aria-label": l(s)("wizard.provider"),
                options: Ue.value,
                onChange: A
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", Xl, [
              e("label", null, [
                G(n(l(s)("settings.providerName")) + " ", 1),
                p.value.provider === "custom" ? (i(), d("span", Zl, "*")) : U("", !0)
              ]),
              V(e("input", {
                "onUpdate:modelValue": P[1] || (P[1] = (h) => p.value.name = h),
                placeholder: l(s)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, Ql), [
                [F, p.value.name]
              ])
            ]),
            e("div", eo, [
              e("label", null, n(l(s)("wizard.baseUrl")), 1),
              V(e("input", {
                "onUpdate:modelValue": P[2] || (P[2] = (h) => p.value.base_url = h),
                placeholder: l(s)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, to), [
                [F, p.value.base_url]
              ])
            ]),
            e("div", so, [
              e("label", null, n(l(s)("settings.apiFormat")), 1),
              Q(l(de), {
                modelValue: p.value.format,
                "onUpdate:modelValue": P[3] || (P[3] = (h) => p.value.format = h),
                class: "input",
                "aria-label": l(s)("settings.apiFormat"),
                options: Me.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", lo, n(l(s)("settings.apiFormatHint")), 1)
            ]),
            e("div", oo, [
              e("label", null, n(l(s)("wizard.defaultModel")), 1),
              Q(l(de), {
                modelValue: p.value.default_model,
                "onUpdate:modelValue": P[4] || (P[4] = (h) => p.value.default_model = h),
                class: "input",
                "aria-label": l(s)("wizard.defaultModel"),
                options: E(p.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", no, n(l(s)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", ao, [
          e("div", io, [
            e("h3", ro, n(l(s)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: C.value.state === "checking",
              onClick: me
            }, n(C.value.state === "checking" ? l(s)("settings.testing") : l(s)("settings.testConnection")), 9, uo)
          ]),
          e("div", co, [
            e("label", null, n(l(s)("wizard.apiKey")), 1),
            e("div", po, [
              V(e("input", {
                "onUpdate:modelValue": P[5] || (P[5] = (h) => p.value.api_key = h),
                type: t.value ? "text" : "password",
                placeholder: o.value ? l(s)("settings.apiKeyKept") : l(s)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, vo), [
                [tt, p.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: P[6] || (P[6] = (h) => t.value = !t.value)
              }, n(t.value ? l(s)("settings.hideKey") : l(s)("settings.showKey")), 1)
            ]),
            o.value ? (i(), d("p", ho, n(l(s)("settings.apiKeyKeptHint")), 1)) : U("", !0),
            C.value.state === "error" ? (i(), d("p", mo, n(C.value.message), 1)) : C.value.state === "ok" ? (i(), d("p", go, n(l(s)("settings.connectionOk")) + " · " + n(ce()) + " · " + n(C.value.ms) + "ms ", 1)) : U("", !0)
          ])
        ]),
        e("section", _o, [
          e("div", bo, [
            e("h3", yo, [
              G(n(l(s)("settings.providerSectionModels")) + " ", 1),
              e("span", fo, n(xe.value) + "/" + n(p.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: C.value.state === "checking",
              onClick: me
            }, n(l(s)("settings.fetchModels")), 9, ko)
          ]),
          u.value.length && u.value.join("\0") !== p.value.models.join("\0") ? (i(), d("div", wo, [
            e("span", null, n(ce()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: be
            }, n(l(s)("settings.applyFetched")), 1)
          ])) : U("", !0),
          e("div", $o, [
            V(e("input", {
              "onUpdate:modelValue": P[7] || (P[7] = (h) => a.value = h),
              class: "input pp-search",
              placeholder: l(s)("settings.searchModels")
            }, null, 8, Co), [
              [F, a.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[8] || (P[8] = (h) => we(!0))
            }, n(l(s)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[9] || (P[9] = (h) => $e())
            }, n(l(s)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[10] || (P[10] = (h) => we(!1))
            }, n(l(s)("settings.clearSelection")), 1)
          ]),
          p.value.models.length ? (i(), d("div", So, [
            (i(!0), d(D, null, q(ye.value, (h) => (i(), d("div", {
              key: h,
              class: J(["pp-model", { off: (p.value.disabled_models || []).includes(h) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: h
              }, n(h), 9, Po),
              e("select", {
                class: J(["pp-type", { tagged: I(h) !== "chat" }]),
                value: I(h),
                title: "模型类型",
                onChange: (f) => R(h, f.target.value)
              }, [
                (i(), d(D, null, q(v, (f) => e("option", {
                  key: f.value,
                  value: f.value
                }, n(f.label), 9, Mo)), 64))
              ], 42, xo),
              p.value.default_model !== h ? (i(), d("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: l(s)("settings.makeDefault"),
                disabled: (p.value.disabled_models || []).includes(h),
                onClick: (f) => Pe(h)
              }, "☆", 8, Uo)) : (i(), d("span", {
                key: 1,
                class: "pp-star on",
                title: l(s)("wizard.defaultModel")
              }, "★", 8, Eo)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(p.value.disabled_models || []).includes(h),
                onChange: (f) => ke(h)
              }, null, 40, Ao)
            ], 2))), 128)),
            ye.value.length ? U("", !0) : (i(), d("p", To, n(l(s)("settings.searchModels")), 1))
          ])) : (i(), d("p", No, n(l(s)("settings.noModelsYet")), 1))
        ]),
        $.value ? (i(), d("p", Vo, n($.value), 1)) : U("", !0),
        e("div", Io, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: c.value,
            onClick: O
          }, n(c.value ? l(s)("settings.saving") : l(s)("settings.save")), 9, Ro),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: K
          }, n(l(s)("settings.cancel")), 1)
        ])
      ], 64)) : (i(), d(D, { key: 1 }, [
        e("div", Oo, [
          e("div", null, [
            e("h2", null, n(l(s)("settings.tabs.provider")), 1),
            e("p", Lo, n(l(s)("settings.providerDesc")), 1)
          ]),
          e("div", zo, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: X
            }, n(l(s)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: B
            }, "+ " + n(l(s)("settings.addProvider")), 1)
          ])
        ]),
        l(_).providers.length ? (i(), d("div", Do, [
          (i(!0), d(D, null, q(l(_).providers, (h) => (i(), d("article", {
            key: h.id,
            class: J(["pp-card", { off: !h.enabled, default: x(h) }])
          }, [
            e("header", Fo, [
              e("span", Bo, [
                S(h) ? (i(), d("img", {
                  key: 0,
                  src: S(h),
                  alt: g(h)
                }, null, 8, Ko)) : (i(), d("svg", Ho, [...P[13] || (P[13] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", jo, [
                e("strong", null, n(g(h)), 1),
                e("code", {
                  title: h.base_url
                }, n(h.base_url || "—"), 9, Yo)
              ]),
              e("div", Jo, [
                x(h) ? (i(), d("span", Wo, n(l(s)("settings.default")), 1)) : U("", !0),
                e("span", qo, n(E(h).length) + "/" + n(h.models.length), 1)
              ])
            ]),
            e("div", Go, [
              e("span", {
                class: J(["pp-status", w.value[h.id]?.state || "idle"])
              }, [
                P[14] || (P[14] = e("span", { class: "pp-dot" }, null, -1)),
                G(" " + n(w.value[h.id]?.state === "checking" ? l(s)("settings.testing") : w.value[h.id]?.state === "ok" ? l(s)("settings.connectionOk") : w.value[h.id]?.state === "error" ? l(s)("settings.connectionFailed") : l(s)("settings.statusIdle")), 1)
              ], 2),
              w.value[h.id]?.state === "ok" ? (i(), d("span", Xo, n(l(s)("settings.fetchedSummary", { n: w.value[h.id]?.count || 0 })) + " · " + n(w.value[h.id]?.ms) + "ms", 1)) : w.value[h.id]?.state === "error" ? (i(), d("span", {
                key: 1,
                class: "pp-meta err",
                title: w.value[h.id]?.message
              }, n(w.value[h.id]?.message), 9, Zo)) : U("", !0)
            ]),
            e("div", Qo, [
              (i(!0), d(D, null, q(E(h).slice(0, 6), (f) => (i(), d("span", {
                key: f,
                class: "pp-chip"
              }, n(f), 1))), 128)),
              E(h).length > 6 ? (i(), d("span", en, "+" + n(E(h).length - 6), 1)) : U("", !0),
              h.models.length ? U("", !0) : (i(), d("span", tn, n(l(s)("settings.noModelsYet")), 1))
            ]),
            e("footer", sn, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (f) => L(h)
              }, n(l(s)("settings.edit")), 9, ln),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: w.value[h.id]?.state === "checking",
                onClick: (f) => j(h)
              }, n(l(s)("settings.testConnection")), 9, on),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: x(h),
                onClick: (f) => Z(h)
              }, n(l(s)("settings.makeDefault")), 9, nn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (f) => he(h)
              }, n(h.enabled ? l(s)("settings.disableProvider") : l(s)("settings.enableProvider")), 9, an),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (f) => ne(h)
              }, n(l(s)("settings.remove")), 9, rn)
            ])
          ], 2))), 128))
        ])) : (i(), d("div", un, [
          e("p", null, n(l(s)("settings.noProviders")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: B
          }, "+ " + n(l(s)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), cn = /* @__PURE__ */ ue(dn, [["__scopeId", "data-v-828ee6e3"]]), pn = { class: "pairing-panel" }, vn = { key: 0 }, hn = { key: 1 }, mn = { key: 0 }, gn = ["onClick"], _n = ["onClick"], bn = ["onClick"], yn = /* @__PURE__ */ ee({
  __name: "PairingPanel",
  setup(z) {
    const s = M([]), y = M([]), _ = M("");
    let w;
    async function k() {
      try {
        const C = await fetch("/api/pairing/pending");
        if (!C.ok) throw new Error(await C.text());
        s.value = (await C.json()).requests || [];
      } catch (C) {
        _.value = C.message;
      }
      try {
        const C = await fetch("/api/pairing/devices");
        C.ok && (y.value = (await C.json()).devices || []);
      } catch {
      }
    }
    async function p(C, u) {
      try {
        const a = await fetch("/api/pairing/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...C, allow: u }) });
        if (!a.ok) throw new Error(await a.text());
        await k();
      } catch (a) {
        _.value = a.message;
      }
    }
    async function $(C) {
      try {
        const u = await fetch("/api/pairing/revoke", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: C.id }) });
        if (!u.ok) throw new Error(await u.text());
        await k();
      } catch (u) {
        _.value = u.message;
      }
    }
    return ie(() => {
      k(), w = setInterval(k, 3e3);
    }), Te(() => clearInterval(w)), (C, u) => (i(), d("section", pn, [
      u[0] || (u[0] = e("h3", null, "设备配对", -1)),
      u[1] || (u[1] = e("p", null, "待配对设备会申请连接并出示 6 位代码，核对后允许。局域网发现需启用 CORE_LAN_ENABLED=1。", -1)),
      _.value ? (i(), d("p", vn, n(_.value), 1)) : U("", !0),
      s.value.length ? U("", !0) : (i(), d("p", hn, "暂无待配对设备")),
      (i(!0), d(D, null, q(s.value, (a) => (i(), d("article", {
        key: a.id
      }, [
        e("strong", null, n(a.name), 1),
        e("code", null, n(a.code), 1),
        a.approved ? (i(), d("span", mn, "已允许，等待客户端领取")) : (i(), d(D, { key: 1 }, [
          e("button", {
            onClick: (t) => p(a, !1)
          }, "拒绝", 8, gn),
          e("button", {
            onClick: (t) => p(a, !0)
          }, "核对代码并允许配对", 8, _n)
        ], 64))
      ]))), 128)),
      y.value.length ? (i(), d(D, { key: 2 }, [
        e("h4", null, "已配对设备 (" + n(y.value.length) + ")", 1),
        (i(!0), d(D, null, q(y.value, (a) => (i(), d("article", {
          key: a.id
        }, [
          e("strong", null, n(a.name || a.id), 1),
          e("button", {
            class: "danger",
            onClick: (t) => $(a)
          }, "断开连接", 8, bn)
        ]))), 128))
      ], 64)) : U("", !0)
    ]));
  }
}), fn = /* @__PURE__ */ ue(yn, [["__scopeId", "data-v-62d9948d"]]), kn = { class: "content-card" }, wn = { class: "card-desc" }, $n = { class: "field" }, Cn = { class: "segmented" }, Sn = ["onClick"], Pn = /* @__PURE__ */ ee({
  __name: "GeneralPanel",
  setup(z) {
    const { t: s } = re(), y = M(at());
    function _(w) {
      y.value = w, rt(w);
    }
    return (w, k) => (i(), d("div", kn, [
      Q(fn),
      e("h2", null, n(l(s)("settings.tabs.general")), 1),
      e("p", wn, n(l(s)("settings.generalDesc")), 1),
      e("div", $n, [
        e("label", null, n(l(s)("settings.language")), 1),
        e("div", Cn, [
          (i(!0), d(D, null, q(l(it), (p) => (i(), d("button", {
            key: p.code,
            class: J(["seg", { active: y.value === p.code }]),
            onClick: ($) => _(p.code)
          }, n(p.label), 11, Sn))), 128))
        ])
      ])
    ]));
  }
});
var ge;
((z) => {
  const p = class p {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code with the given version number,
    // error correction level, data codeword bytes, and mask number.
    // This is a low-level API that most users should not use directly.
    // A mid-level API is the encodeSegments() function.
    constructor(u, a, t, o) {
      H(this, "version");
      H(this, "errorCorrectionLevel");
      /*-- Fields --*/
      // The width and height of this QR Code, measured in modules, between
      // 21 and 177 (inclusive). This is equal to version * 4 + 17.
      H(this, "size");
      // The index of the mask pattern used in this QR Code, which is between 0 and 7 (inclusive).
      // Even if a QR Code is created with automatic masking requested (mask = -1),
      // the resulting object still has a mask value between 0 and 7.
      H(this, "mask");
      // The modules of this QR Code (false = light, true = dark).
      // Immutable after constructor finishes. Accessed through getModule().
      H(this, "modules", []);
      // Indicates function modules that are not subjected to masking. Discarded when constructor finishes.
      H(this, "isFunction", []);
      if (this.version = u, this.errorCorrectionLevel = a, u < p.MIN_VERSION || u > p.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (o < -1 || o > 7)
        throw new RangeError("Mask value out of range");
      this.size = u * 4 + 17;
      let c = [];
      for (let g = 0; g < this.size; g++)
        c.push(!1);
      for (let g = 0; g < this.size; g++)
        this.modules.push(c.slice()), this.isFunction.push(c.slice());
      this.drawFunctionPatterns();
      const m = this.addEccAndInterleave(t);
      if (this.drawCodewords(m), o == -1) {
        let g = 1e9;
        for (let S = 0; S < 8; S++) {
          this.applyMask(S), this.drawFormatBits(S);
          const v = this.getPenaltyScore();
          v < g && (o = S, g = v), this.applyMask(S);
        }
      }
      w(0 <= o && o <= 7), this.mask = o, this.applyMask(o), this.drawFormatBits(o), this.isFunction = [];
    }
    /*-- Static factory functions (high level) --*/
    // Returns a QR Code representing the given Unicode text string at the given error correction level.
    // As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer
    // Unicode code points (not UTF-16 code units) if the low error correction level is used. The smallest possible
    // QR Code version is automatically chosen for the output. The ECC level of the result may be higher than the
    // ecl argument if it can be done without increasing the version.
    static encodeText(u, a) {
      const t = z.QrSegment.makeSegments(u);
      return p.encodeSegments(t, a);
    }
    // Returns a QR Code representing the given binary data at the given error correction level.
    // This function always encodes using the binary segment mode, not any text mode. The maximum number of
    // bytes allowed is 2953. The smallest possible QR Code version is automatically chosen for the output.
    // The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
    static encodeBinary(u, a) {
      const t = z.QrSegment.makeBytes(u);
      return p.encodeSegments([t], a);
    }
    /*-- Static factory functions (mid level) --*/
    // Returns a QR Code representing the given segments with the given encoding parameters.
    // The smallest possible QR Code version within the given range is automatically
    // chosen for the output. Iff boostEcl is true, then the ECC level of the result
    // may be higher than the ecl argument if it can be done without increasing the
    // version. The mask number is either between 0 to 7 (inclusive) to force that
    // mask, or -1 to automatically choose an appropriate mask (which may be slow).
    // This function allows the user to create a custom sequence of segments that switches
    // between modes (such as alphanumeric and byte) to encode text in less space.
    // This is a mid-level API; the high-level API is encodeText() and encodeBinary().
    static encodeSegments(u, a, t = 1, o = 40, c = -1, m = !0) {
      if (!(p.MIN_VERSION <= t && t <= o && o <= p.MAX_VERSION) || c < -1 || c > 7)
        throw new RangeError("Invalid value");
      let g, S;
      for (g = t; ; g++) {
        const E = p.getNumDataCodewords(g, a) * 8, x = k.getTotalBits(u, g);
        if (x <= E) {
          S = x;
          break;
        }
        if (g >= o)
          throw new RangeError("Data too long");
      }
      for (const E of [p.Ecc.MEDIUM, p.Ecc.QUARTILE, p.Ecc.HIGH])
        m && S <= p.getNumDataCodewords(g, E) * 8 && (a = E);
      let v = [];
      for (const E of u) {
        y(E.mode.modeBits, 4, v), y(E.numChars, E.mode.numCharCountBits(g), v);
        for (const x of E.getData())
          v.push(x);
      }
      w(v.length == S);
      const I = p.getNumDataCodewords(g, a) * 8;
      w(v.length <= I), y(0, Math.min(4, I - v.length), v), y(0, (8 - v.length % 8) % 8, v), w(v.length % 8 == 0);
      for (let E = 236; v.length < I; E ^= 253)
        y(E, 8, v);
      let R = [];
      for (; R.length * 8 < v.length; )
        R.push(0);
      return v.forEach((E, x) => R[x >>> 3] |= E << 7 - (x & 7)), new p(g, a, R, c);
    }
    /*-- Accessor methods --*/
    // Returns the color of the module (pixel) at the given coordinates, which is false
    // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
    // If the given coordinates are out of bounds, then false (light) is returned.
    getModule(u, a) {
      return 0 <= u && u < this.size && 0 <= a && a < this.size && this.modules[a][u];
    }
    /*-- Private helper methods for constructor: Drawing function modules --*/
    // Reads this object's version field, and draws and marks all function modules.
    drawFunctionPatterns() {
      for (let t = 0; t < this.size; t++)
        this.setFunctionModule(6, t, t % 2 == 0), this.setFunctionModule(t, 6, t % 2 == 0);
      this.drawFinderPattern(3, 3), this.drawFinderPattern(this.size - 4, 3), this.drawFinderPattern(3, this.size - 4);
      const u = this.getAlignmentPatternPositions(), a = u.length;
      for (let t = 0; t < a; t++)
        for (let o = 0; o < a; o++)
          t == 0 && o == 0 || t == 0 && o == a - 1 || t == a - 1 && o == 0 || this.drawAlignmentPattern(u[t], u[o]);
      this.drawFormatBits(0), this.drawVersion();
    }
    // Draws two copies of the format bits (with its own error correction code)
    // based on the given mask and this object's error correction level field.
    drawFormatBits(u) {
      const a = this.errorCorrectionLevel.formatBits << 3 | u;
      let t = a;
      for (let c = 0; c < 10; c++)
        t = t << 1 ^ (t >>> 9) * 1335;
      const o = (a << 10 | t) ^ 21522;
      w(o >>> 15 == 0);
      for (let c = 0; c <= 5; c++)
        this.setFunctionModule(8, c, _(o, c));
      this.setFunctionModule(8, 7, _(o, 6)), this.setFunctionModule(8, 8, _(o, 7)), this.setFunctionModule(7, 8, _(o, 8));
      for (let c = 9; c < 15; c++)
        this.setFunctionModule(14 - c, 8, _(o, c));
      for (let c = 0; c < 8; c++)
        this.setFunctionModule(this.size - 1 - c, 8, _(o, c));
      for (let c = 8; c < 15; c++)
        this.setFunctionModule(8, this.size - 15 + c, _(o, c));
      this.setFunctionModule(8, this.size - 8, !0);
    }
    // Draws two copies of the version bits (with its own error correction code),
    // based on this object's version field, iff 7 <= version <= 40.
    drawVersion() {
      if (this.version < 7)
        return;
      let u = this.version;
      for (let t = 0; t < 12; t++)
        u = u << 1 ^ (u >>> 11) * 7973;
      const a = this.version << 12 | u;
      w(a >>> 18 == 0);
      for (let t = 0; t < 18; t++) {
        const o = _(a, t), c = this.size - 11 + t % 3, m = Math.floor(t / 3);
        this.setFunctionModule(c, m, o), this.setFunctionModule(m, c, o);
      }
    }
    // Draws a 9*9 finder pattern including the border separator,
    // with the center module at (x, y). Modules can be out of bounds.
    drawFinderPattern(u, a) {
      for (let t = -4; t <= 4; t++)
        for (let o = -4; o <= 4; o++) {
          const c = Math.max(Math.abs(o), Math.abs(t)), m = u + o, g = a + t;
          0 <= m && m < this.size && 0 <= g && g < this.size && this.setFunctionModule(m, g, c != 2 && c != 4);
        }
    }
    // Draws a 5*5 alignment pattern, with the center module
    // at (x, y). All modules must be in bounds.
    drawAlignmentPattern(u, a) {
      for (let t = -2; t <= 2; t++)
        for (let o = -2; o <= 2; o++)
          this.setFunctionModule(u + o, a + t, Math.max(Math.abs(o), Math.abs(t)) != 1);
    }
    // Sets the color of a module and marks it as a function module.
    // Only used by the constructor. Coordinates must be in bounds.
    setFunctionModule(u, a, t) {
      this.modules[a][u] = t, this.isFunction[a][u] = !0;
    }
    /*-- Private helper methods for constructor: Codewords and masking --*/
    // Returns a new byte string representing the given data with the appropriate error correction
    // codewords appended to it, based on this object's version and error correction level.
    addEccAndInterleave(u) {
      const a = this.version, t = this.errorCorrectionLevel;
      if (u.length != p.getNumDataCodewords(a, t))
        throw new RangeError("Invalid argument");
      const o = p.NUM_ERROR_CORRECTION_BLOCKS[t.ordinal][a], c = p.ECC_CODEWORDS_PER_BLOCK[t.ordinal][a], m = Math.floor(p.getNumRawDataModules(a) / 8), g = o - m % o, S = Math.floor(m / o);
      let v = [];
      const I = p.reedSolomonComputeDivisor(c);
      for (let E = 0, x = 0; E < o; E++) {
        let A = u.slice(x, x + S - c + (E < g ? 0 : 1));
        x += A.length;
        const N = p.reedSolomonComputeRemainder(A, I);
        E < g && A.push(0), v.push(A.concat(N));
      }
      let R = [];
      for (let E = 0; E < v[0].length; E++)
        v.forEach((x, A) => {
          (E != S - c || A >= g) && R.push(x[E]);
        });
      return w(R.length == m), R;
    }
    // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
    // data area of this QR Code. Function modules need to be marked off before this is called.
    drawCodewords(u) {
      if (u.length != Math.floor(p.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let a = 0;
      for (let t = this.size - 1; t >= 1; t -= 2) {
        t == 6 && (t = 5);
        for (let o = 0; o < this.size; o++)
          for (let c = 0; c < 2; c++) {
            const m = t - c, S = (t + 1 & 2) == 0 ? this.size - 1 - o : o;
            !this.isFunction[S][m] && a < u.length * 8 && (this.modules[S][m] = _(u[a >>> 3], 7 - (a & 7)), a++);
          }
      }
      w(a == u.length * 8);
    }
    // XORs the codeword modules in this QR Code with the given mask pattern.
    // The function modules must be marked and the codeword bits must be drawn
    // before masking. Due to the arithmetic of XOR, calling applyMask() with
    // the same mask value a second time will undo the mask. A final well-formed
    // QR Code needs exactly one (not zero, two, etc.) mask applied.
    applyMask(u) {
      if (u < 0 || u > 7)
        throw new RangeError("Mask value out of range");
      for (let a = 0; a < this.size; a++)
        for (let t = 0; t < this.size; t++) {
          let o;
          switch (u) {
            case 0:
              o = (t + a) % 2 == 0;
              break;
            case 1:
              o = a % 2 == 0;
              break;
            case 2:
              o = t % 3 == 0;
              break;
            case 3:
              o = (t + a) % 3 == 0;
              break;
            case 4:
              o = (Math.floor(t / 3) + Math.floor(a / 2)) % 2 == 0;
              break;
            case 5:
              o = t * a % 2 + t * a % 3 == 0;
              break;
            case 6:
              o = (t * a % 2 + t * a % 3) % 2 == 0;
              break;
            case 7:
              o = ((t + a) % 2 + t * a % 3) % 2 == 0;
              break;
            default:
              throw new Error("Unreachable");
          }
          !this.isFunction[a][t] && o && (this.modules[a][t] = !this.modules[a][t]);
        }
    }
    // Calculates and returns the penalty score based on state of this QR Code's current modules.
    // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
    getPenaltyScore() {
      let u = 0;
      for (let c = 0; c < this.size; c++) {
        let m = !1, g = 0, S = [0, 0, 0, 0, 0, 0, 0];
        for (let v = 0; v < this.size; v++)
          this.modules[c][v] == m ? (g++, g == 5 ? u += p.PENALTY_N1 : g > 5 && u++) : (this.finderPenaltyAddHistory(g, S), m || (u += this.finderPenaltyCountPatterns(S) * p.PENALTY_N3), m = this.modules[c][v], g = 1);
        u += this.finderPenaltyTerminateAndCount(m, g, S) * p.PENALTY_N3;
      }
      for (let c = 0; c < this.size; c++) {
        let m = !1, g = 0, S = [0, 0, 0, 0, 0, 0, 0];
        for (let v = 0; v < this.size; v++)
          this.modules[v][c] == m ? (g++, g == 5 ? u += p.PENALTY_N1 : g > 5 && u++) : (this.finderPenaltyAddHistory(g, S), m || (u += this.finderPenaltyCountPatterns(S) * p.PENALTY_N3), m = this.modules[v][c], g = 1);
        u += this.finderPenaltyTerminateAndCount(m, g, S) * p.PENALTY_N3;
      }
      for (let c = 0; c < this.size - 1; c++)
        for (let m = 0; m < this.size - 1; m++) {
          const g = this.modules[c][m];
          g == this.modules[c][m + 1] && g == this.modules[c + 1][m] && g == this.modules[c + 1][m + 1] && (u += p.PENALTY_N2);
        }
      let a = 0;
      for (const c of this.modules)
        a = c.reduce((m, g) => m + (g ? 1 : 0), a);
      const t = this.size * this.size, o = Math.ceil(Math.abs(a * 20 - t * 10) / t) - 1;
      return w(0 <= o && o <= 9), u += o * p.PENALTY_N4, w(0 <= u && u <= 2568888), u;
    }
    /*-- Private helper functions --*/
    // Returns an ascending list of positions of alignment patterns for this version number.
    // Each position is in the range [0,177), and are used on both the x and y axes.
    // This could be implemented as lookup table of 40 variable-length lists of integers.
    getAlignmentPatternPositions() {
      if (this.version == 1)
        return [];
      {
        const u = Math.floor(this.version / 7) + 2, a = Math.floor((this.version * 8 + u * 3 + 5) / (u * 4 - 4)) * 2;
        let t = [6];
        for (let o = this.size - 7; t.length < u; o -= a)
          t.splice(1, 0, o);
        return t;
      }
    }
    // Returns the number of data bits that can be stored in a QR Code of the given version number, after
    // all function modules are excluded. This includes remainder bits, so it might not be a multiple of 8.
    // The result is in the range [208, 29648]. This could be implemented as a 40-entry lookup table.
    static getNumRawDataModules(u) {
      if (u < p.MIN_VERSION || u > p.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let a = (16 * u + 128) * u + 64;
      if (u >= 2) {
        const t = Math.floor(u / 7) + 2;
        a -= (25 * t - 10) * t - 55, u >= 7 && (a -= 36);
      }
      return w(208 <= a && a <= 29648), a;
    }
    // Returns the number of 8-bit data (i.e. not error correction) codewords contained in any
    // QR Code of the given version number and error correction level, with remainder bits discarded.
    // This stateless pure function could be implemented as a (40*4)-cell lookup table.
    static getNumDataCodewords(u, a) {
      return Math.floor(p.getNumRawDataModules(u) / 8) - p.ECC_CODEWORDS_PER_BLOCK[a.ordinal][u] * p.NUM_ERROR_CORRECTION_BLOCKS[a.ordinal][u];
    }
    // Returns a Reed-Solomon ECC generator polynomial for the given degree. This could be
    // implemented as a lookup table over all possible parameter values, instead of as an algorithm.
    static reedSolomonComputeDivisor(u) {
      if (u < 1 || u > 255)
        throw new RangeError("Degree out of range");
      let a = [];
      for (let o = 0; o < u - 1; o++)
        a.push(0);
      a.push(1);
      let t = 1;
      for (let o = 0; o < u; o++) {
        for (let c = 0; c < a.length; c++)
          a[c] = p.reedSolomonMultiply(a[c], t), c + 1 < a.length && (a[c] ^= a[c + 1]);
        t = p.reedSolomonMultiply(t, 2);
      }
      return a;
    }
    // Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.
    static reedSolomonComputeRemainder(u, a) {
      let t = a.map((o) => 0);
      for (const o of u) {
        const c = o ^ t.shift();
        t.push(0), a.forEach((m, g) => t[g] ^= p.reedSolomonMultiply(m, c));
      }
      return t;
    }
    // Returns the product of the two given field elements modulo GF(2^8/0x11D). The arguments and result
    // are unsigned 8-bit integers. This could be implemented as a lookup table of 256*256 entries of uint8.
    static reedSolomonMultiply(u, a) {
      if (u >>> 8 || a >>> 8)
        throw new RangeError("Byte out of range");
      let t = 0;
      for (let o = 7; o >= 0; o--)
        t = t << 1 ^ (t >>> 7) * 285, t ^= (a >>> o & 1) * u;
      return w(t >>> 8 == 0), t;
    }
    // Can only be called immediately after a light run is added, and
    // returns either 0, 1, or 2. A helper function for getPenaltyScore().
    finderPenaltyCountPatterns(u) {
      const a = u[1];
      w(a <= this.size * 3);
      const t = a > 0 && u[2] == a && u[3] == a * 3 && u[4] == a && u[5] == a;
      return (t && u[0] >= a * 4 && u[6] >= a ? 1 : 0) + (t && u[6] >= a * 4 && u[0] >= a ? 1 : 0);
    }
    // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
    finderPenaltyTerminateAndCount(u, a, t) {
      return u && (this.finderPenaltyAddHistory(a, t), a = 0), a += this.size, this.finderPenaltyAddHistory(a, t), this.finderPenaltyCountPatterns(t);
    }
    // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
    finderPenaltyAddHistory(u, a) {
      a[0] == 0 && (u += this.size), a.pop(), a.unshift(u);
    }
  };
  /*-- Constants and tables --*/
  // The minimum version number supported in the QR Code Model 2 standard.
  H(p, "MIN_VERSION", 1), // The maximum version number supported in the QR Code Model 2 standard.
  H(p, "MAX_VERSION", 40), // For use in getPenaltyScore(), when evaluating which mask is best.
  H(p, "PENALTY_N1", 3), H(p, "PENALTY_N2", 3), H(p, "PENALTY_N3", 40), H(p, "PENALTY_N4", 10), H(p, "ECC_CODEWORDS_PER_BLOCK", [
    // Version: (note that index 0 is for padding, and is set to an illegal value)
    //0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    // Low
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    // Medium
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    // Quartile
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
    // High
  ]), H(p, "NUM_ERROR_CORRECTION_BLOCKS", [
    // Version: (note that index 0 is for padding, and is set to an illegal value)
    //0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    // Low
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    // Medium
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    // Quartile
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
    // High
  ]);
  let s = p;
  z.QrCode = s;
  function y(C, u, a) {
    if (u < 0 || u > 31 || C >>> u)
      throw new RangeError("Value out of range");
    for (let t = u - 1; t >= 0; t--)
      a.push(C >>> t & 1);
  }
  function _(C, u) {
    return (C >>> u & 1) != 0;
  }
  function w(C) {
    if (!C)
      throw new Error("Assertion error");
  }
  const $ = class $ {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code segment with the given attributes and data.
    // The character count (numChars) must agree with the mode and the bit buffer length,
    // but the constraint isn't checked. The given bit buffer is cloned and stored.
    constructor(u, a, t) {
      H(this, "mode");
      H(this, "numChars");
      H(this, "bitData");
      if (this.mode = u, this.numChars = a, this.bitData = t, a < 0)
        throw new RangeError("Invalid argument");
      this.bitData = t.slice();
    }
    /*-- Static factory functions (mid level) --*/
    // Returns a segment representing the given binary data encoded in
    // byte mode. All input byte arrays are acceptable. Any text string
    // can be converted to UTF-8 bytes and encoded as a byte mode segment.
    static makeBytes(u) {
      let a = [];
      for (const t of u)
        y(t, 8, a);
      return new $($.Mode.BYTE, u.length, a);
    }
    // Returns a segment representing the given string of decimal digits encoded in numeric mode.
    static makeNumeric(u) {
      if (!$.isNumeric(u))
        throw new RangeError("String contains non-numeric characters");
      let a = [];
      for (let t = 0; t < u.length; ) {
        const o = Math.min(u.length - t, 3);
        y(parseInt(u.substring(t, t + o), 10), o * 3 + 1, a), t += o;
      }
      return new $($.Mode.NUMERIC, u.length, a);
    }
    // Returns a segment representing the given text string encoded in alphanumeric mode.
    // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
    // dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static makeAlphanumeric(u) {
      if (!$.isAlphanumeric(u))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let a = [], t;
      for (t = 0; t + 2 <= u.length; t += 2) {
        let o = $.ALPHANUMERIC_CHARSET.indexOf(u.charAt(t)) * 45;
        o += $.ALPHANUMERIC_CHARSET.indexOf(u.charAt(t + 1)), y(o, 11, a);
      }
      return t < u.length && y($.ALPHANUMERIC_CHARSET.indexOf(u.charAt(t)), 6, a), new $($.Mode.ALPHANUMERIC, u.length, a);
    }
    // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
    // The result may use various segment modes and switch modes to optimize the length of the bit stream.
    static makeSegments(u) {
      return u == "" ? [] : $.isNumeric(u) ? [$.makeNumeric(u)] : $.isAlphanumeric(u) ? [$.makeAlphanumeric(u)] : [$.makeBytes($.toUtf8ByteArray(u))];
    }
    // Returns a segment representing an Extended Channel Interpretation
    // (ECI) designator with the given assignment value.
    static makeEci(u) {
      let a = [];
      if (u < 0)
        throw new RangeError("ECI assignment value out of range");
      if (u < 128)
        y(u, 8, a);
      else if (u < 16384)
        y(2, 2, a), y(u, 14, a);
      else if (u < 1e6)
        y(6, 3, a), y(u, 21, a);
      else
        throw new RangeError("ECI assignment value out of range");
      return new $($.Mode.ECI, 0, a);
    }
    // Tests whether the given string can be encoded as a segment in numeric mode.
    // A string is encodable iff each character is in the range 0 to 9.
    static isNumeric(u) {
      return $.NUMERIC_REGEX.test(u);
    }
    // Tests whether the given string can be encoded as a segment in alphanumeric mode.
    // A string is encodable iff each character is in the following set: 0 to 9, A to Z
    // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static isAlphanumeric(u) {
      return $.ALPHANUMERIC_REGEX.test(u);
    }
    /*-- Methods --*/
    // Returns a new copy of the data bits of this segment.
    getData() {
      return this.bitData.slice();
    }
    // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
    // the given version. The result is infinity if a segment has too many characters to fit its length field.
    static getTotalBits(u, a) {
      let t = 0;
      for (const o of u) {
        const c = o.mode.numCharCountBits(a);
        if (o.numChars >= 1 << c)
          return 1 / 0;
        t += 4 + c + o.bitData.length;
      }
      return t;
    }
    // Returns a new array of bytes representing the given string encoded in UTF-8.
    static toUtf8ByteArray(u) {
      u = encodeURI(u);
      let a = [];
      for (let t = 0; t < u.length; t++)
        u.charAt(t) != "%" ? a.push(u.charCodeAt(t)) : (a.push(parseInt(u.substring(t + 1, t + 3), 16)), t += 2);
      return a;
    }
  };
  /*-- Constants --*/
  // Describes precisely all strings that are encodable in numeric mode.
  H($, "NUMERIC_REGEX", /^[0-9]*$/), // Describes precisely all strings that are encodable in alphanumeric mode.
  H($, "ALPHANUMERIC_REGEX", /^[A-Z0-9 $%*+.\/:-]*$/), // The set of all legal characters in alphanumeric mode,
  // where each character value maps to the index in the string.
  H($, "ALPHANUMERIC_CHARSET", "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:");
  let k = $;
  z.QrSegment = k;
})(ge || (ge = {}));
((z) => {
  ((s) => {
    const _ = class _ {
      // The QR Code can tolerate about 30% erroneous codewords
      /*-- Constructor and fields --*/
      constructor(k, p) {
        H(this, "ordinal");
        H(this, "formatBits");
        this.ordinal = k, this.formatBits = p;
      }
    };
    /*-- Constants --*/
    H(_, "LOW", new _(0, 1)), // The QR Code can tolerate about  7% erroneous codewords
    H(_, "MEDIUM", new _(1, 0)), // The QR Code can tolerate about 15% erroneous codewords
    H(_, "QUARTILE", new _(2, 3)), // The QR Code can tolerate about 25% erroneous codewords
    H(_, "HIGH", new _(3, 2));
    let y = _;
    s.Ecc = y;
  })(z.QrCode || (z.QrCode = {}));
})(ge || (ge = {}));
((z) => {
  ((s) => {
    const _ = class _ {
      /*-- Constructor and fields --*/
      constructor(k, p) {
        H(this, "modeBits");
        H(this, "numBitsCharCount");
        this.modeBits = k, this.numBitsCharCount = p;
      }
      /*-- Method --*/
      // (Package-private) Returns the bit width of the character count field for a segment in
      // this mode in a QR Code at the given version number. The result is in the range [0, 16].
      numCharCountBits(k) {
        return this.numBitsCharCount[Math.floor((k + 7) / 17)];
      }
    };
    /*-- Constants --*/
    H(_, "NUMERIC", new _(1, [10, 12, 14])), H(_, "ALPHANUMERIC", new _(2, [9, 11, 13])), H(_, "BYTE", new _(4, [8, 16, 16])), H(_, "KANJI", new _(8, [8, 10, 12])), H(_, "ECI", new _(7, [0, 0, 0]));
    let y = _;
    s.Mode = y;
  })(z.QrSegment || (z.QrSegment = {}));
})(ge || (ge = {}));
const De = ge, xn = { class: "content-card" }, Mn = { class: "connection-grid" }, Un = { class: "connection-form" }, En = { class: "field" }, An = { class: "field" }, Tn = { class: "toggle-label" }, Nn = { class: "field" }, Vn = { class: "field" }, In = { class: "field" }, Rn = { class: "helper-text" }, On = { key: 0 }, Ln = { key: 1 }, zn = { class: "actions-row" }, Dn = { class: "connection-qr" }, Fn = ["viewBox"], Bn = ["width", "height"], Kn = ["x", "y"], Hn = { class: "connection-link" }, Fe = "0kay.connection.qr.v2", jn = /* @__PURE__ */ ee({
  __name: "ConnectionPanel",
  setup(z) {
    function s() {
      try {
        return JSON.parse(localStorage.getItem(Fe) || "{}");
      } catch {
        return {};
      }
    }
    function y(E) {
      const x = (A) => /^192\.168\./.test(A) ? 0 : /^10\./.test(A) ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(A) ? 2 : /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(A) ? 4 : 3;
      return [...E].sort((A, N) => x(A) - x(N))[0] || "";
    }
    const _ = s(), w = !!_.hostOverride, k = M(_.hostOverride && _.host ? _.host : location.hostname), p = M(w), $ = location.protocol === "https:" ? location.port || "443" : "8080", C = M(_.port ?? $), u = M(_.tls ?? location.protocol === "https:"), a = M(""), t = M(""), o = M(_.name ?? "0KAY"), c = M(""), m = M(!1), g = M(!1);
    ie(async () => {
      try {
        const E = await fetch("/api/auth/session");
        if (E.ok) {
          const x = await E.json();
          c.value = String(x.core_id || ""), m.value = !!x.lan_enabled;
          const A = Array.isArray(x.addresses) ? x.addresses : [], N = y(A);
          !p.value && N && (k.value = N);
        }
      } catch {
      }
    }), He([k, C, u, o, p], () => {
      localStorage.setItem(
        Fe,
        JSON.stringify({
          host: k.value,
          hostOverride: p.value,
          port: C.value,
          tls: u.value,
          name: o.value
        })
      );
    });
    const S = W(() => {
      const E = u.value ? "https" : "http", x = String(C.value || "").trim();
      return `${E}://${k.value.trim()}${x ? ":" + x : ""}`;
    }), v = W(() => {
      const E = [["v", "1"], ["url", S.value]];
      return o.value.trim() && E.push(["name", o.value.trim()]), a.value.trim() && E.push(["token", a.value.trim()]), t.value.trim() && E.push(["pin", t.value.trim()]), c.value && E.push(["core_id", c.value]), `0kay://pair?${E.map(([A, N]) => `${A}=${encodeURIComponent(N)}`).join("&")}`;
    }), I = W(() => {
      const E = De.QrCode.encodeText(v.value, De.QrCode.Ecc.MEDIUM), x = E.size, A = 2, N = x + A * 2, j = [];
      for (let X = 0; X < x; X++)
        for (let B = 0; B < x; B++)
          E.getModule(B, X) && j.push({ x: B + A, y: X + A });
      return { dim: N, dark: j };
    });
    async function R() {
      try {
        await navigator.clipboard.writeText(v.value), g.value = !0, setTimeout(() => g.value = !1, 1500);
      } catch {
      }
    }
    return (E, x) => (i(), d("div", xn, [
      x[15] || (x[15] = e("h2", null, "连接手机", -1)),
      x[16] || (x[16] = e("p", { class: "card-desc" }, [
        G(" 用 0KAY 安卓 App 扫描下方二维码即可连接。默认使用本机局域网 IP；若通过 FRP / 反向代理暴露，请把下方 "),
        e("strong", null, "对外主机 / 端口 / TLS"),
        G(" 改成外网可达地址 （Core 本身无需修改）。Token / PIN 可留空（可信局域网）；公网访问请填写以便 App 直接认证。 ")
      ], -1)),
      e("div", Mn, [
        e("div", Un, [
          e("div", En, [
            x[7] || (x[7] = e("label", null, "对外主机 / IP（默认局域网 IP）", -1)),
            V(e("input", {
              "onUpdate:modelValue": x[0] || (x[0] = (A) => k.value = A),
              class: "input",
              placeholder: "192.168.1.10 或 your.domain.com",
              onInput: x[1] || (x[1] = (A) => p.value = !0)
            }, null, 544), [
              [F, k.value]
            ])
          ]),
          e("div", An, [
            x[8] || (x[8] = e("label", null, "端口", -1)),
            V(e("input", {
              "onUpdate:modelValue": x[2] || (x[2] = (A) => C.value = A),
              class: "input",
              inputmode: "numeric",
              placeholder: "8080"
            }, null, 512), [
              [F, C.value]
            ])
          ]),
          e("label", Tn, [
            V(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": x[3] || (x[3] = (A) => u.value = A)
            }, null, 512), [
              [te, u.value]
            ]),
            x[9] || (x[9] = e("span", { class: "toggle-slider" }, null, -1)),
            x[10] || (x[10] = e("span", null, "使用 TLS (https / wss)", -1))
          ]),
          e("div", Nn, [
            x[11] || (x[11] = e("label", null, "API Token（可选）", -1)),
            V(e("input", {
              "onUpdate:modelValue": x[4] || (x[4] = (A) => a.value = A),
              class: "input",
              type: "password",
              placeholder: "留空则使用可信局域网",
              autocomplete: "off"
            }, null, 512), [
              [F, a.value]
            ])
          ]),
          e("div", Vn, [
            x[12] || (x[12] = e("label", null, "访问 PIN（可选）", -1)),
            V(e("input", {
              "onUpdate:modelValue": x[5] || (x[5] = (A) => t.value = A),
              class: "input",
              type: "password",
              placeholder: "敏感操作 PIN",
              autocomplete: "off"
            }, null, 512), [
              [F, t.value]
            ])
          ]),
          e("div", In, [
            x[13] || (x[13] = e("label", null, "设备显示名称（可选）", -1)),
            V(e("input", {
              "onUpdate:modelValue": x[6] || (x[6] = (A) => o.value = A),
              class: "input",
              placeholder: "0KAY"
            }, null, 512), [
              [F, o.value]
            ])
          ]),
          e("div", Rn, [
            x[14] || (x[14] = G(" 连接地址：", -1)),
            e("code", null, n(S.value), 1),
            c.value ? (i(), d("span", On, " · Core: " + n(c.value), 1)) : U("", !0),
            m.value ? (i(), d("span", Ln, " · LAN 模式")) : U("", !0)
          ]),
          e("div", zn, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              onClick: R
            }, n(g.value ? "已复制" : "复制连接串"), 1)
          ])
        ]),
        e("div", Dn, [
          (i(), d("svg", {
            viewBox: `0 0 ${I.value.dim} ${I.value.dim}`,
            width: "264",
            height: "264",
            "shape-rendering": "crispEdges",
            role: "img",
            "aria-label": "0KAY connection QR code"
          }, [
            e("rect", {
              x: "0",
              y: "0",
              width: I.value.dim,
              height: I.value.dim,
              fill: "#ffffff"
            }, null, 8, Bn),
            (i(!0), d(D, null, q(I.value.dark, (A) => (i(), d("rect", {
              key: A.x + ":" + A.y,
              x: A.x,
              y: A.y,
              width: "1",
              height: "1",
              fill: "#0b1020"
            }, null, 8, Kn))), 128))
          ], 8, Fn)),
          e("code", Hn, n(v.value), 1)
        ])
      ])
    ]));
  }
}), Yn = /* @__PURE__ */ ue(jn, [["__scopeId", "data-v-14f725eb"]]), Jn = { class: "content-card" }, Wn = { class: "card-desc" }, qn = { class: "field-row" }, Gn = { class: "field" }, Xn = ["placeholder"], Zn = { class: "field" }, Qn = ["placeholder"], ea = { class: "field" }, ta = { class: "field" }, sa = ["placeholder"], la = { class: "field" }, oa = ["placeholder"], na = { class: "field" }, aa = ["placeholder"], ia = { class: "field" }, ra = ["placeholder"], ua = { class: "helper-text" }, da = /* @__PURE__ */ ee({
  __name: "PersonaPanel",
  setup(z) {
    const { t: s } = re(), y = Ve(), { tabLabel: _, tabMeta: w } = Ie();
    return (k, p) => (i(), d("div", Jn, [
      e("h2", null, n(l(_)("persona")), 1),
      e("p", Wn, n(l(w)("persona")?.descriptionKey ? l(s)(l(w)("persona").descriptionKey) : l(s)("settings.personaDesc")), 1),
      e("div", qn, [
        e("div", Gn, [
          e("label", null, n(l(s)("wizard.name")), 1),
          V(e("input", {
            "onUpdate:modelValue": p[0] || (p[0] = ($) => l(y).persona.name = $),
            placeholder: l(s)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, Xn), [
            [F, l(y).persona.name]
          ])
        ]),
        e("div", Zn, [
          e("label", null, n(l(s)("wizard.avatarUrl")), 1),
          V(e("input", {
            "onUpdate:modelValue": p[1] || (p[1] = ($) => l(y).persona.avatar = $),
            placeholder: l(s)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, Qn), [
            [F, l(y).persona.avatar]
          ])
        ]),
        e("div", ea, [
          p[7] || (p[7] = e("label", null, "出生日期", -1)),
          V(e("input", {
            "onUpdate:modelValue": p[2] || (p[2] = ($) => l(y).persona.birthDate = $),
            type: "date",
            class: "input"
          }, null, 512), [
            [F, l(y).persona.birthDate]
          ])
        ])
      ]),
      e("div", ta, [
        e("label", null, n(l(s)("wizard.description")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[3] || (p[3] = ($) => l(y).persona.description = $),
          placeholder: l(s)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, sa), [
          [F, l(y).persona.description]
        ])
      ]),
      e("div", la, [
        e("label", null, n(l(s)("wizard.personality")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[4] || (p[4] = ($) => l(y).persona.personality = $),
          placeholder: l(s)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, oa), [
          [F, l(y).persona.personality]
        ])
      ]),
      e("div", na, [
        e("label", null, n(l(s)("wizard.greeting")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[5] || (p[5] = ($) => l(y).persona.greeting = $),
          placeholder: l(s)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, aa), [
          [F, l(y).persona.greeting]
        ])
      ]),
      e("div", ia, [
        e("label", null, n(l(s)("wizard.customPrompt")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[6] || (p[6] = ($) => l(y).persona.customPrompt = $),
          placeholder: l(s)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, ra), [
          [F, l(y).persona.customPrompt]
        ]),
        e("p", ua, n(l(s)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), ca = { class: "content-card" }, pa = { class: "card-desc" }, va = { class: "toggle-label" }, ha = { class: "helper-text" }, ma = { class: "toggle-label" }, ga = { class: "helper-text" }, _a = { class: "field" }, ba = ["placeholder"], ya = { class: "helper-text" }, fa = {
  key: 0,
  class: "helper-text"
}, ka = { class: "actions-row" }, wa = /* @__PURE__ */ ee({
  __name: "PermissionsPanel",
  setup(z) {
    const { t: s } = re(), { tabLabel: y, tabMeta: _, fieldLabel: w, fieldHelp: k } = Ie(), p = M({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), $ = M("");
    async function C() {
      try {
        const a = await fetch("/api/life/permissions");
        if (a.ok) {
          const t = await a.json();
          p.value = {
            screen_watch: !!t.screen_watch,
            computer_use: !!t.computer_use,
            report_agent_host: t.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function u() {
      $.value = "";
      try {
        const a = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p.value)
        });
        if (!a.ok) throw new Error(String(a.status));
        const t = await a.json();
        p.value = {
          screen_watch: !!t.screen_watch,
          computer_use: !!t.computer_use,
          report_agent_host: t.report_agent_host || ""
        }, $.value = s("settings.permSaved");
      } catch {
        $.value = s("settings.permFailed");
      }
    }
    return ie(C), (a, t) => (i(), d("div", ca, [
      e("h2", null, n(l(y)("permissions")), 1),
      e("p", pa, n(l(_)("permissions")?.descriptionKey ? l(s)(l(_)("permissions").descriptionKey) : l(s)("settings.permissionsDesc")), 1),
      e("label", va, [
        V(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": t[0] || (t[0] = (o) => p.value.screen_watch = o),
          onChange: u
        }, null, 544), [
          [te, p.value.screen_watch]
        ]),
        t[4] || (t[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(l(w)(l(_)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          t[3] || (t[3] = e("br", null, null, -1)),
          e("small", ha, n(l(k)(l(_)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", ma, [
        V(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": t[1] || (t[1] = (o) => p.value.computer_use = o),
          onChange: u
        }, null, 544), [
          [te, p.value.computer_use]
        ]),
        t[6] || (t[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(l(w)(l(_)("permissions"), "computer_use", "settings.computerUse")), 1),
          t[5] || (t[5] = e("br", null, null, -1)),
          e("small", ga, n(l(k)(l(_)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", _a, [
        e("label", null, n(l(w)(l(_)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        V(e("input", {
          "onUpdate:modelValue": t[2] || (t[2] = (o) => p.value.report_agent_host = o),
          class: "input",
          placeholder: l(k)(l(_)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: u
        }, null, 40, ba), [
          [F, p.value.report_agent_host]
        ]),
        e("p", ya, n(l(k)(l(_)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      $.value ? (i(), d("div", fa, n($.value), 1)) : U("", !0),
      e("div", ka, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: u
        }, n(l(s)("settings.save")), 1)
      ])
    ]));
  }
}), $a = M(!1), Ca = M(!1);
M(!1);
const ve = M(!1), _e = M(!0), Re = M(!0), fe = M([]), We = M(!1);
M(!1);
const Se = M(!1), Be = [];
function Sa(z) {
  const s = Be.splice(0, Be.length);
  for (const y of s)
    y.resolve();
}
async function Pa() {
  const z = window.fetch;
  try {
    const s = await z("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!s.ok) return;
    const y = await s.json();
    ve.value = !!y.configured, _e.value = y.enabled !== !1, Re.value = y.login_enabled !== !1, fe.value = Array.isArray(y.pages) ? y.pages : [], Se.value = !y.configured && _e.value;
  } catch {
  }
}
async function xa(z) {
  const s = window.fetch, y = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(z)
  }), _ = await y.json().catch(() => null);
  if (!y.ok) throw new Error(_?.error || `HTTP ${y.status}`);
  typeof _?.enabled == "boolean" && (_e.value = _.enabled), typeof _?.login_enabled == "boolean" && (Re.value = _.login_enabled), Array.isArray(_?.pages) && (fe.value = _.pages), ve.value = !!_?.configured, Se.value = !_?.configured && _e.value;
}
async function Ma() {
  const z = window.fetch, s = await z("/api/security/pin", { method: "DELETE" }), y = await s.json().catch(() => null);
  if (!s.ok) throw new Error(y?.error || `HTTP ${s.status}`);
  We.value = !1, ve.value = !1, Se.value = _e.value;
}
async function Ua(z) {
  const s = window.fetch, y = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: z })
  }), _ = await y.json().catch(() => null);
  if (!y.ok || !_?.configured) throw new Error(_?.error || `HTTP ${y.status}`);
  z.trim(), We.value = !0, ve.value = !0, Se.value = !1, Ca.value = !0, $a.value = !1, Sa();
}
const Ea = { class: "content-card security-panel" }, Aa = { class: "card-desc" }, Ta = { class: "sec-stack" }, Na = { class: "toggle-label" }, Va = ["checked", "disabled"], Ia = { class: "helper-text" }, Ra = { class: "toggle-label" }, Oa = ["checked", "disabled"], La = { class: "helper-text" }, za = { class: "sec-card" }, Da = { class: "sec-card-head" }, Fa = { class: "sec-pin-grid" }, Ba = { class: "sec-pin-col" }, Ka = { class: "sec-pin-label" }, Ha = { class: "sec-pin-col" }, ja = { class: "sec-pin-label" }, Ya = { class: "sec-actions" }, Ja = ["disabled"], Wa = ["disabled"], qa = { class: "sec-card" }, Ga = { class: "sec-card-head" }, Xa = { class: "sec-chip" }, Za = { class: "helper-text" }, Qa = { class: "page-list" }, ei = ["checked", "disabled", "onChange"], ti = { class: "page-text" }, si = { class: "page-name" }, li = {
  key: 0,
  class: "helper-text sec-msg"
}, oi = {
  key: 1,
  class: "sec-error"
}, ni = /* @__PURE__ */ ee({
  __name: "SecurityPanel",
  setup(z) {
    const { t: s, locale: y } = re(), { confirm: _ } = Ne(), w = Je(), k = M(!1), p = M(""), $ = M(""), C = M(""), u = M(""), a = W(() => {
      const S = [], v = /* @__PURE__ */ new Set(), I = (R, E) => {
        !R || v.has(R) || (v.add(R), S.push({ path: R, label: E || R }));
      };
      for (const R of w.navItems) {
        const E = R.to || (R.id === "chat" ? "/" : "");
        if (!E) continue;
        let x = R.labelKey ? s(R.labelKey) : "";
        (!x || x === R.labelKey) && (x = R.label || R.id), I(E, x);
      }
      for (const R of w.routerPatches) {
        let E = R.titleKey ? s(R.titleKey) : "";
        (!E || E === R.titleKey) && (E = R.title || String(R.name || R.path)), I(R.path, E);
      }
      return S;
    });
    ie(() => {
      Pa();
    });
    async function t(S) {
      k.value = !0, p.value = "", $.value = "";
      try {
        await xa(S), p.value = s("settings.saved"), setTimeout(() => {
          p.value = "";
        }, 1500);
      } catch (v) {
        $.value = v?.message || s("settings.permFailed");
      } finally {
        k.value = !1;
      }
    }
    function o(S, v) {
      t({ [S]: v });
    }
    function c(S, v) {
      const I = new Set(fe.value);
      v ? I.add(S) : I.delete(S), t({ pages: [...I] });
    }
    async function m() {
      if ($.value = "", C.value.length !== 6) {
        $.value = s("wizard.pinTooShort");
        return;
      }
      if (C.value !== u.value) {
        $.value = s("wizard.pinMismatch");
        return;
      }
      k.value = !0;
      try {
        await Ua(C.value), C.value = "", u.value = "", p.value = s("settings.saved"), setTimeout(() => {
          p.value = "";
        }, 1500);
      } catch (S) {
        $.value = S?.message || s("settings.permFailed");
      } finally {
        k.value = !1;
      }
    }
    async function g() {
      if (await _({
        title: s("security.removePin"),
        message: s("security.removePinConfirm"),
        confirmLabel: y.value === "en" ? "Delete" : "删除",
        danger: !0
      })) {
        k.value = !0, $.value = "";
        try {
          await Ma(), p.value = s("settings.saved"), setTimeout(() => {
            p.value = "";
          }, 1500);
        } catch (v) {
          $.value = v?.message || s("settings.permFailed");
        } finally {
          k.value = !1;
        }
      }
    }
    return (S, v) => (i(), d("div", Ea, [
      e("h2", null, n(l(s)("settings.tabs.security")), 1),
      e("p", Aa, n(l(s)("security.desc")), 1),
      e("div", Ta, [
        e("label", Na, [
          e("input", {
            type: "checkbox",
            checked: l(_e),
            disabled: k.value,
            onChange: v[0] || (v[0] = (I) => o("enabled", I.target.checked))
          }, null, 40, Va),
          v[4] || (v[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, n(l(s)("security.pinSwitch")), 1),
            e("small", Ia, n(l(s)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", Ra, [
          e("input", {
            type: "checkbox",
            checked: l(Re),
            disabled: k.value,
            onChange: v[1] || (v[1] = (I) => o("login_enabled", I.target.checked))
          }, null, 40, Oa),
          v[5] || (v[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, n(l(s)("security.loginSwitch")), 1),
            e("small", La, n(l(s)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", za, [
          e("div", Da, [
            e("strong", null, n(l(ve) ? l(s)("security.changePin") : l(s)("auth.setupTitle")), 1),
            e("span", {
              class: J(["sec-chip", { on: l(ve) }])
            }, n(l(ve) ? l(s)("security.pinSet") : l(s)("security.pinUnset")), 3)
          ]),
          e("div", Fa, [
            e("div", Ba, [
              e("span", Ka, n(l(s)("auth.pinNew")), 1),
              Q(l(ze), {
                modelValue: C.value,
                "onUpdate:modelValue": v[2] || (v[2] = (I) => C.value = I)
              }, null, 8, ["modelValue"])
            ]),
            e("div", Ha, [
              e("span", ja, n(l(s)("auth.pinConfirm")), 1),
              Q(l(ze), {
                modelValue: u.value,
                "onUpdate:modelValue": v[3] || (v[3] = (I) => u.value = I),
                onComplete: m
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", Ya, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: k.value,
              onClick: m
            }, n(l(s)("auth.savePin")), 9, Ja),
            l(ve) ? (i(), d("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: k.value,
              onClick: g
            }, n(l(s)("security.removePin")), 9, Wa)) : U("", !0)
          ])
        ]),
        e("section", qa, [
          e("div", Ga, [
            e("strong", null, n(l(s)("security.pages")), 1),
            e("span", Xa, n(l(s)("security.pageCount", { n: l(fe).length })), 1)
          ]),
          e("p", Za, n(l(s)("security.pagesHelp")), 1),
          e("div", Qa, [
            (i(!0), d(D, null, q(a.value, (I) => (i(), d("label", {
              key: I.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: l(fe).includes(I.path),
                disabled: k.value,
                onChange: (R) => c(I.path, R.target.checked)
              }, null, 40, ei),
              v[6] || (v[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", ti, [
                e("span", si, n(I.label), 1),
                e("code", null, n(I.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      p.value ? (i(), d("p", li, n(p.value), 1)) : U("", !0),
      $.value ? (i(), d("p", oi, n($.value), 1)) : U("", !0)
    ]));
  }
}), ai = /* @__PURE__ */ ue(ni, [["__scopeId", "data-v-b1d117f0"]]), ii = { class: "mcp-panel" }, ri = { class: "mcp-head" }, ui = { class: "mcp-actions" }, di = ["disabled"], ci = {
  key: 0,
  class: "error-banner"
}, pi = {
  key: 1,
  class: "notice-banner"
}, vi = {
  key: 2,
  class: "hint"
}, hi = {
  key: 3,
  class: "mcp-list"
}, mi = { class: "mcp-row" }, gi = { class: "mcp-field grow" }, _i = ["onUpdate:modelValue", "readonly"], bi = { class: "mcp-field" }, yi = ["onUpdate:modelValue", "onChange"], fi = { class: "mcp-toggle" }, ki = ["onUpdate:modelValue"], wi = ["onClick"], $i = { class: "mcp-field" }, Ci = ["onUpdate:modelValue"], Si = { class: "mcp-field" }, Pi = ["onUpdate:modelValue"], xi = { class: "mcp-field" }, Mi = ["onUpdate:modelValue"], Ui = { class: "mcp-field" }, Ei = ["onUpdate:modelValue"], Ai = { class: "mail-grid" }, Ti = { class: "mail-col" }, Ni = { class: "mcp-field" }, Vi = ["onUpdate:modelValue"], Ii = { class: "mail-row" }, Ri = { class: "mcp-field" }, Oi = ["onUpdate:modelValue"], Li = { class: "mcp-toggle" }, zi = ["onUpdate:modelValue"], Di = { class: "mcp-field" }, Fi = ["onUpdate:modelValue"], Bi = { class: "mcp-field" }, Ki = ["onUpdate:modelValue"], Hi = { class: "mail-col" }, ji = { class: "mcp-field" }, Yi = ["onUpdate:modelValue"], Ji = { class: "mail-row" }, Wi = { class: "mcp-field" }, qi = ["onUpdate:modelValue"], Gi = { class: "mcp-toggle" }, Xi = ["onUpdate:modelValue"], Zi = { class: "mcp-field" }, Qi = ["onUpdate:modelValue"], er = { class: "mcp-field" }, tr = ["onUpdate:modelValue"], sr = { class: "mail-row" }, lr = { class: "mcp-field grow" }, or = ["onUpdate:modelValue"], nr = { class: "mcp-field" }, ar = ["onUpdate:modelValue"], ir = {
  key: 0,
  class: "hint"
}, rr = /* @__PURE__ */ ee({
  __name: "McpPanel",
  setup(z) {
    const s = M([]), y = M(!1), _ = M(!1), w = M(""), k = M(!1);
    function p() {
      return {
        id: "",
        transport: "stdio",
        command: "",
        argsText: "",
        url: "",
        headersText: "",
        enabled: !0,
        imapHost: "",
        imapPort: 993,
        imapSsl: !0,
        imapUser: "",
        imapPassword: "",
        smtpHost: "",
        smtpPort: 465,
        smtpSecure: !0,
        smtpUser: "",
        smtpPassword: "",
        from: "",
        fromName: "0KAY"
      };
    }
    function $(c) {
      const m = c?.transport === "http" ? "http" : c?.transport === "builtin" || c?.builtin ? "builtin" : "stdio", g = c?.options?.imap || {}, S = c?.options?.smtp || {};
      return {
        id: String(c?.id || ""),
        transport: m,
        command: String(c?.command || ""),
        argsText: Array.isArray(c?.args) ? c.args.join(`
`) : "",
        url: String(c?.url || ""),
        headersText: c?.headers && typeof c.headers == "object" ? JSON.stringify(c.headers, null, 2) : "",
        enabled: c?.enabled !== !1,
        imapHost: String(g.host || ""),
        imapPort: Number(g.port) || 993,
        imapSsl: g.ssl !== !1,
        imapUser: String(g.user || ""),
        imapPassword: String(g.password || ""),
        smtpHost: String(S.host || ""),
        smtpPort: Number(S.port) || 465,
        smtpSecure: S.secure !== !1,
        smtpUser: String(S.user || ""),
        smtpPassword: String(S.password || ""),
        from: String(S.from || ""),
        fromName: String(S.fromName || "0KAY")
      };
    }
    function C(c) {
      if (c.transport === "builtin") {
        const g = {};
        return (c.imapHost.trim() || c.imapUser.trim()) && (g.imap = {
          host: c.imapHost.trim(),
          port: Number(c.imapPort) || 993,
          ssl: c.imapSsl,
          user: c.imapUser.trim(),
          password: c.imapPassword
        }), (c.smtpHost.trim() || c.smtpUser.trim() || c.from.trim()) && (g.smtp = {
          host: c.smtpHost.trim(),
          port: Number(c.smtpPort) || 465,
          secure: c.smtpSecure,
          user: c.smtpUser.trim(),
          password: c.smtpPassword,
          from: c.from.trim(),
          fromName: c.fromName.trim() || "0KAY"
        }), { id: c.id.trim() || "mail", transport: "builtin", builtin: "mail", enabled: c.enabled, options: g };
      }
      const m = { id: c.id.trim(), transport: c.transport, enabled: c.enabled };
      if (c.transport === "http") {
        if (c.url.trim() && (m.url = c.url.trim()), c.headersText.trim())
          try {
            m.headers = JSON.parse(c.headersText);
          } catch {
            throw new Error(`服务「${c.id || "(未命名)"}」的 Headers 不是合法 JSON`);
          }
      } else {
        c.command.trim() && (m.command = c.command.trim());
        const g = c.argsText.split(`
`).map((S) => S.trim()).filter(Boolean);
        g.length && (m.args = g);
      }
      return m;
    }
    function u(c) {
      c.transport === "builtin" && (c.id = "mail");
    }
    function a() {
      const c = p();
      s.value.some((m) => m.transport === "builtin") && (c.transport = "stdio"), s.value.push(c);
    }
    async function t() {
      y.value = !0, w.value = "";
      try {
        const m = (await pe("/api/settings/mcp"))?.values?.servers;
        let g = [];
        if (typeof m == "string" && m.trim())
          try {
            const S = JSON.parse(m);
            Array.isArray(S) && (g = S);
          } catch {
            w.value = "已保存的 MCP 配置不是合法 JSON，已忽略。";
          }
        s.value = g.map($);
      } catch (c) {
        w.value = c?.message || String(c);
      } finally {
        y.value = !1;
      }
    }
    async function o() {
      if (!_.value) {
        _.value = !0, w.value = "", k.value = !1;
        try {
          const c = /* @__PURE__ */ new Set(), m = s.value.map(C).filter((g) => {
            const S = String(g.id || "").trim();
            return !S || c.has(S) ? !1 : (c.add(S), !0);
          });
          await Ce("/api/settings/mcp", { values: { servers: JSON.stringify(m) } }), k.value = !0, setTimeout(() => {
            k.value = !1;
          }, 2e3);
        } catch (c) {
          w.value = c?.message || String(c);
        } finally {
          _.value = !1;
        }
      }
    }
    return ie(t), (c, m) => (i(), d("div", ii, [
      e("header", ri, [
        m[0] || (m[0] = e("div", null, [
          e("h2", null, "MCP 服务"),
          e("p", { class: "subtitle" }, "配置外部 MCP（模型上下文协议）服务。保存后 Agent 与 L.I.F.E 共用同一份配置。")
        ], -1)),
        e("div", ui, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: a
          }, "添加服务"),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: _.value,
            onClick: o
          }, n(_.value ? "保存中…" : "保存"), 9, di)
        ])
      ]),
      w.value ? (i(), d("div", ci, n(w.value), 1)) : U("", !0),
      k.value ? (i(), d("div", pi, "已保存")) : U("", !0),
      y.value ? (i(), d("p", vi, "加载中…")) : (i(), d("div", hi, [
        (i(!0), d(D, null, q(s.value, (g, S) => (i(), d("article", {
          key: S,
          class: J(["mcp-card", { "is-builtin": g.transport === "builtin" }])
        }, [
          e("div", mi, [
            e("label", gi, [
              m[1] || (m[1] = e("span", null, "ID", -1)),
              V(e("input", {
                "onUpdate:modelValue": (v) => g.id = v,
                readonly: g.transport === "builtin",
                placeholder: "filesystem"
              }, null, 8, _i), [
                [F, g.id]
              ])
            ]),
            e("label", bi, [
              m[3] || (m[3] = e("span", null, "传输", -1)),
              V(e("select", {
                "onUpdate:modelValue": (v) => g.transport = v,
                onChange: (v) => u(g)
              }, [...m[2] || (m[2] = [
                e("option", { value: "stdio" }, "stdio", -1),
                e("option", { value: "http" }, "http", -1),
                e("option", { value: "builtin" }, "内置邮件 (mail)", -1)
              ])], 40, yi), [
                [st, g.transport]
              ])
            ]),
            e("label", fi, [
              V(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (v) => g.enabled = v
              }, null, 8, ki), [
                [te, g.enabled]
              ]),
              m[4] || (m[4] = e("span", null, "启用", -1))
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (v) => s.value.splice(S, 1)
            }, "删除", 8, wi)
          ]),
          g.transport === "stdio" ? (i(), d(D, { key: 0 }, [
            e("label", $i, [
              m[5] || (m[5] = e("span", null, "命令", -1)),
              V(e("input", {
                "onUpdate:modelValue": (v) => g.command = v,
                placeholder: "npx"
              }, null, 8, Ci), [
                [F, g.command]
              ])
            ]),
            e("label", Si, [
              m[6] || (m[6] = e("span", null, "参数（每行一个）", -1)),
              V(e("textarea", {
                "onUpdate:modelValue": (v) => g.argsText = v,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, Pi), [
                [F, g.argsText]
              ])
            ])
          ], 64)) : g.transport === "http" ? (i(), d(D, { key: 1 }, [
            e("label", xi, [
              m[7] || (m[7] = e("span", null, "URL", -1)),
              V(e("input", {
                "onUpdate:modelValue": (v) => g.url = v,
                placeholder: "https://example.com/mcp"
              }, null, 8, Mi), [
                [F, g.url]
              ])
            ]),
            e("label", Ui, [
              m[8] || (m[8] = e("span", null, "Headers（JSON）", -1)),
              V(e("textarea", {
                "onUpdate:modelValue": (v) => g.headersText = v,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, Ei), [
                [F, g.headersText]
              ])
            ])
          ], 64)) : (i(), d(D, { key: 2 }, [
            m[23] || (m[23] = e("p", { class: "builtin-note" }, [
              G("内置 0kay-mcp 邮件服务器：L.I.F.E 的 "),
              e("code", null, "getmail"),
              G(" / "),
              e("code", null, "sendmail"),
              G(" 工具经此收发邮件。留空表示不启用对应方向。")
            ], -1)),
            e("div", Ai, [
              e("div", Ti, [
                m[14] || (m[14] = e("p", { class: "mail-label" }, "收信 · IMAP", -1)),
                e("label", Ni, [
                  m[9] || (m[9] = e("span", null, "主机", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => g.imapHost = v,
                    placeholder: "imap.example.com",
                    autocomplete: "off"
                  }, null, 8, Vi), [
                    [F, g.imapHost]
                  ])
                ]),
                e("div", Ii, [
                  e("label", Ri, [
                    m[10] || (m[10] = e("span", null, "端口", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (v) => g.imapPort = v,
                      type: "number",
                      placeholder: "993"
                    }, null, 8, Oi), [
                      [
                        F,
                        g.imapPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", Li, [
                    V(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (v) => g.imapSsl = v
                    }, null, 8, zi), [
                      [te, g.imapSsl]
                    ]),
                    m[11] || (m[11] = e("span", null, "SSL", -1))
                  ])
                ]),
                e("label", Di, [
                  m[12] || (m[12] = e("span", null, "用户名", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => g.imapUser = v,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, Fi), [
                    [F, g.imapUser]
                  ])
                ]),
                e("label", Bi, [
                  m[13] || (m[13] = e("span", null, "密码 / 应用专用密码", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => g.imapPassword = v,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, Ki), [
                    [F, g.imapPassword]
                  ])
                ])
              ]),
              e("div", Hi, [
                m[22] || (m[22] = e("p", { class: "mail-label" }, "发信 · SMTP", -1)),
                e("label", ji, [
                  m[15] || (m[15] = e("span", null, "主机", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => g.smtpHost = v,
                    placeholder: "smtp.example.com",
                    autocomplete: "off"
                  }, null, 8, Yi), [
                    [F, g.smtpHost]
                  ])
                ]),
                e("div", Ji, [
                  e("label", Wi, [
                    m[16] || (m[16] = e("span", null, "端口", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (v) => g.smtpPort = v,
                      type: "number",
                      placeholder: "465"
                    }, null, 8, qi), [
                      [
                        F,
                        g.smtpPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", Gi, [
                    V(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (v) => g.smtpSecure = v
                    }, null, 8, Xi), [
                      [te, g.smtpSecure]
                    ]),
                    m[17] || (m[17] = e("span", null, "SSL（465）", -1))
                  ])
                ]),
                e("label", Zi, [
                  m[18] || (m[18] = e("span", null, "用户名", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => g.smtpUser = v,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, Qi), [
                    [F, g.smtpUser]
                  ])
                ]),
                e("label", er, [
                  m[19] || (m[19] = e("span", null, "密码 / 应用专用密码", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => g.smtpPassword = v,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, tr), [
                    [F, g.smtpPassword]
                  ])
                ]),
                e("div", sr, [
                  e("label", lr, [
                    m[20] || (m[20] = e("span", null, "发件人地址（可选）", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (v) => g.from = v,
                      placeholder: "留空用 SMTP 用户名",
                      autocomplete: "off"
                    }, null, 8, or), [
                      [F, g.from]
                    ])
                  ]),
                  e("label", nr, [
                    m[21] || (m[21] = e("span", null, "发件人昵称", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (v) => g.fromName = v,
                      placeholder: "0KAY",
                      autocomplete: "off"
                    }, null, 8, ar), [
                      [F, g.fromName]
                    ])
                  ])
                ])
              ])
            ])
          ], 64))
        ], 2))), 128)),
        s.value.length ? U("", !0) : (i(), d("p", ir, "还没有 MCP 服务，点击「添加服务」。传输选择「内置邮件」可配置邮箱收发。"))
      ]))
    ]));
  }
}), ur = /* @__PURE__ */ ue(rr, [["__scopeId", "data-v-775007b1"]]), dr = { class: "content-card danger" }, cr = { class: "card-desc" }, pr = { class: "danger-box" }, vr = /* @__PURE__ */ ee({
  __name: "DangerPanel",
  setup(z) {
    const { t: s } = re(), y = Ve(), _ = je();
    function w() {
      y.resetWizard(), _.push("/");
    }
    return (k, p) => (i(), d("div", dr, [
      e("h2", null, n(l(s)("settings.tabs.danger")), 1),
      e("p", cr, n(l(s)("settings.resetDesc")), 1),
      e("div", pr, [
        e("div", null, [
          e("strong", null, n(l(s)("settings.reset")), 1),
          e("p", null, n(l(s)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          onClick: w
        }, n(l(s)("settings.reset")), 1)
      ])
    ]));
  }
}), hr = {
  key: 1,
  class: "plugin-pane-message"
}, mr = {
  key: 2,
  class: "plugin-pane-message"
}, gr = /* @__PURE__ */ ee({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(z) {
    const s = z, y = Oe(null), _ = Oe("");
    return He(
      () => s.module,
      async (w) => {
        if (!w) {
          y.value = null, _.value = "";
          return;
        }
        try {
          const k = await import(
            /* @vite-ignore */
            w
          );
          y.value = k?.default || k, _.value = "";
        } catch (k) {
          y.value = null, _.value = k?.message || String(k);
        }
      },
      { immediate: !0 }
    ), (w, k) => y.value ? (i(), le(lt(y.value), { key: 0 })) : _.value ? (i(), d("div", hr, n(_.value), 1)) : (i(), d("div", mr, "Loading plugin module…"));
  }
}), _r = /* @__PURE__ */ ue(gr, [["__scopeId", "data-v-2d1f36bc"]]), br = { class: "models-field" }, yr = {
  key: 0,
  class: "models-list"
}, fr = { class: "models-rank" }, kr = ["title"], wr = { class: "models-actions" }, $r = ["disabled", "aria-label", "onClick"], Cr = ["disabled", "aria-label", "onClick"], Sr = ["aria-label", "onClick"], Pr = {
  key: 1,
  class: "models-empty"
}, xr = /* @__PURE__ */ ee({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(z, { emit: s }) {
    const { locale: y } = re(), _ = z, w = s, k = W(() => String(_.modelValue || "").split(",").map((t) => t.trim()).filter(Boolean)), p = W(() => _.options.filter((t) => !k.value.includes(t)));
    function $(t) {
      w("update:modelValue", t.join(","));
    }
    function C(t) {
      t && !k.value.includes(t) && $([...k.value, t]);
    }
    function u(t) {
      $(k.value.filter((o) => o !== t));
    }
    function a(t, o) {
      const c = [...k.value], m = t + o;
      m < 0 || m >= c.length || ([c[t], c[m]] = [c[m], c[t]], $(c));
    }
    return (t, o) => (i(), d("div", br, [
      k.value.length ? (i(), d("ol", yr, [
        (i(!0), d(D, null, q(k.value, (c, m) => (i(), d("li", { key: c }, [
          e("span", fr, n(m + 1), 1),
          e("span", {
            class: "models-name",
            title: c
          }, n(c), 9, kr),
          e("span", wr, [
            e("button", {
              type: "button",
              disabled: m === 0,
              "aria-label": l(y) === "en" ? "Higher priority" : "提高优先级",
              onClick: (g) => a(m, -1)
            }, "↑", 8, $r),
            e("button", {
              type: "button",
              disabled: m === k.value.length - 1,
              "aria-label": l(y) === "en" ? "Lower priority" : "降低优先级",
              onClick: (g) => a(m, 1)
            }, "↓", 8, Cr),
            e("button", {
              type: "button",
              "aria-label": l(y) === "en" ? "Remove" : "移除",
              onClick: (g) => u(c)
            }, "✕", 8, Sr)
          ])
        ]))), 128))
      ])) : (i(), d("p", Pr, n(l(y) === "en" ? "No fallback models — provider catalog order is used." : "暂无备选模型，将按供应商目录顺序尝试。"), 1)),
      p.value.length ? (i(), le(l(de), {
        key: 2,
        options: p.value,
        "model-value": "",
        placeholder: l(y) === "en" ? "+ Add fallback model…" : "+ 添加备选模型…",
        "onUpdate:modelValue": C
      }, null, 8, ["options", "placeholder"])) : U("", !0)
    ]));
  }
}), Ke = /* @__PURE__ */ ue(xr, [["__scopeId", "data-v-b73b6842"]]), Mr = { class: "settings-page" }, Ur = { class: "page-header" }, Er = { class: "subtitle" }, Ar = { key: 0 }, Tr = { key: 1 }, Nr = { class: "settings-layout" }, Vr = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, Ir = ["onClick"], Rr = {
  class: "nav-icon",
  "aria-hidden": "true"
}, Or = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Lr = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, zr = {
  key: 2,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Dr = {
  key: 3,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Fr = {
  key: 4,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Br = {
  key: 5,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Kr = {
  key: 6,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Hr = {
  key: 7,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, jr = {
  key: 8,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Yr = {
  key: 9,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Jr = {
  key: 10,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Wr = {
  key: 11,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, qr = { class: "nav-label" }, Gr = { class: "settings-content" }, Xr = {
  key: 0,
  class: "content-card provider-runtime"
}, Zr = {
  key: 0,
  class: "helper-text"
}, Qr = {
  key: 0,
  class: "toggle-label"
}, eu = ["checked", "onChange"], tu = { key: 0 }, su = {
  key: 1,
  class: "helper-text"
}, lu = {
  key: 0,
  class: "helper-text"
}, ou = ["type", "value", "onInput"], nu = {
  key: 0,
  class: "helper-text"
}, au = {
  key: 1,
  class: "helper-text"
}, iu = { class: "actions-row" }, ru = {
  key: 4,
  class: "content-card"
}, uu = { class: "card-desc" }, du = { class: "toggle-label" }, cu = { class: "field" }, pu = { class: "model-choices" }, vu = ["value", "checked", "onChange"], hu = ["placeholder"], mu = { class: "helper-text" }, gu = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, _u = { class: "field" }, bu = {
  key: 0,
  class: "helper-text"
}, yu = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, fu = ["value", "checked", "onChange"], ku = ["onClick"], wu = {
  key: 9,
  class: "content-card"
}, $u = {
  key: 0,
  class: "card-desc"
}, Cu = {
  key: 1,
  class: "helper-text"
}, Su = {
  key: 0,
  class: "toggle-label"
}, Pu = ["checked", "onChange"], xu = { key: 0 }, Mu = {
  key: 1,
  class: "helper-text"
}, Uu = {
  key: 0,
  class: "helper-text"
}, Eu = {
  key: 0,
  class: "helper-text"
}, Au = {
  key: 0,
  class: "helper-text"
}, Tu = { class: "actions-row" }, Nu = ["disabled"], Vu = {
  key: 0,
  class: "helper-text"
}, Iu = {
  key: 0,
  class: "helper-text"
}, Ru = ["type", "value", "onInput"], Ou = {
  key: 0,
  class: "helper-text"
}, Lu = {
  key: 2,
  class: "helper-text"
}, zu = { class: "actions-row" }, Du = {
  key: 11,
  class: "content-card"
}, Fu = {
  key: 0,
  class: "card-desc"
}, Bu = {
  key: 1,
  class: "card-desc"
}, Ku = {
  key: 0,
  class: "toggle-label"
}, Hu = ["checked", "onChange"], ju = { key: 0 }, Yu = {
  key: 1,
  class: "helper-text"
}, Ju = {
  key: 0,
  class: "helper-text"
}, Wu = {
  key: 0,
  class: "helper-text"
}, qu = {
  key: 0,
  class: "helper-text"
}, Gu = ["type", "value", "onInput"], Xu = {
  key: 0,
  class: "helper-text"
}, Zu = {
  key: 2,
  class: "helper-text"
}, Qu = { class: "actions-row" }, id = /* @__PURE__ */ ee({
  __name: "SettingsPage",
  setup(z) {
    const { t: s, locale: y } = re(), { confirm: _ } = Ne(), w = Ve(), k = ut(), p = Je(), $ = ot(), C = je(), u = W(() => p.settingsTabs.map((h) => ({
      id: h.id,
      icon: h.icon || "chip"
    }))), a = W(() => {
      const h = new Set(p.settingsTabs.map((r) => r.id)), f = new Set(p.removedSettingsIds);
      return k.sections.filter((r) => r.id !== "permissions" && !h.has(r.id) && !f.has(r.id)).map((r) => ({ id: r.id, icon: r.icon || "lock" }));
    }), t = W(() => [...u.value, ...a.value]), o = M("general"), c = M(!1), m = M([]), g = M(null), S = M(""), v = M({}), I = M(""), R = M(!1), E = M(""), x = M([]), A = W(() => y.value === "en" ? "Auto (by strategy)" : "自动（按策略）"), N = W(() => [
      { value: "", label: A.value },
      ...x.value.map((h) => ({ value: h, label: h }))
    ]);
    async function j() {
      try {
        const h = await fetch("/api/models");
        if (!h.ok) return;
        const f = await h.json();
        x.value = Array.from(new Set((f.models || []).map((r) => String(r.id || "")).filter(Boolean)));
      } catch {
      }
    }
    async function X(h) {
      R.value = !0, E.value = "";
      try {
        const f = await fetch(`/api/settings/${h}/test`, { method: "POST" }), r = f.headers.get("content-type") || "";
        if (f.ok && r.startsWith("audio")) {
          const T = URL.createObjectURL(await f.blob());
          try {
            await new Audio(T).play();
          } catch {
          }
          window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: T } })), E.value = "测试成功，正在播放…";
        } else {
          const T = await f.json().catch(() => ({}));
          E.value = T.error || `HTTP ${f.status}`;
        }
      } catch (f) {
        E.value = f instanceof Error ? f.message : String(f);
      } finally {
        R.value = !1;
      }
    }
    const { tabMeta: B, isBuiltinTab: L, isPluginSection: K, tabLabel: O, fieldLabel: ne, fieldHelp: he, pluginSection: Z } = Ie(), me = W(() => L(o.value) ? null : B(o.value)?.module || null);
    function be(h, f) {
      const r = v.value[h]?.[f];
      return typeof r == "boolean" ? r : r === "true" || r === 1 || r === "1";
    }
    function ke(h) {
      if (B(h)?.fields?.length && !L(h)) {
        Pe(h);
        return;
      }
      const r = Z(h);
      if (!r) return;
      const T = {};
      for (const Y of r.fields)
        Y.type === "bool" ? T[Y.key] = Y.default_value === "true" || Y.default_value === "1" : Y.type === "number" ? T[Y.key] = Number(Y.default_value || 0) : T[Y.key] = Y.default_value || "";
      const oe = k.values[h] || {}, se = { ...T };
      for (const Y of r.fields) {
        if (!(Y.key in oe)) continue;
        const ae = oe[Y.key];
        Y.type === "bool" ? se[Y.key] = ae === !0 || ae === "true" || ae === 1 || ae === "1" : se[Y.key] = ae;
      }
      v.value = {
        ...v.value,
        [h]: se
      };
    }
    async function Pe(h) {
      const f = B(h);
      if (!f?.fields?.length) return;
      const r = {};
      for (const T of f.fields)
        T.type === "bool" ? r[T.key] = T.default_value === "true" || T.default_value === "1" : T.type === "number" ? r[T.key] = Number(T.default_value || 0) : r[T.key] = T.default_value || "";
      if (f.loadApi)
        try {
          const T = await fetch(f.loadApi);
          if (T.ok) {
            const oe = await T.json();
            for (const se of f.fields) {
              if (!(se.key in oe)) continue;
              const Y = oe[se.key];
              se.type === "bool" ? r[se.key] = Y === !0 || Y === "true" || Y === 1 || Y === "1" : r[se.key] = Y;
            }
          }
        } catch {
        }
      v.value = { ...v.value, [h]: r };
    }
    async function we(h) {
      const f = B(h);
      I.value = "";
      try {
        const r = v.value[h] || {};
        if (f?.saveApi) {
          const T = await fetch(f.saveApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(r)
          });
          if (!T.ok) throw new Error(String(T.status));
        }
        I.value = s("settings.saved"), setTimeout(() => {
          I.value = "";
        }, 1500);
      } catch {
        I.value = s("settings.permFailed");
      }
    }
    async function $e(h) {
      I.value = "";
      try {
        await k.saveValues(h, v.value[h] || {}), I.value = s("settings.saved"), setTimeout(() => {
          I.value = "";
        }, 1500);
      } catch {
        I.value = s("settings.permFailed");
      }
    }
    async function ye() {
      try {
        const h = await fetch("/api/live2d");
        if (h.ok) {
          const f = await h.json();
          m.value = f.models || [];
        }
      } catch {
        m.value = [];
      }
    }
    async function xe(h) {
      if (await _({
        title: s("settings.live2d"),
        message: `删除模型 ${h.label} 及所在模型文件夹中的全部资源？`,
        confirmLabel: y.value === "en" ? "Delete" : "删除",
        danger: !0
      }))
        try {
          const r = await fetch(`/api/live2d/${encodeURIComponent(h.id)}`, { method: "DELETE" });
          if (!r.ok) throw new Error(await r.text());
          const T = await r.json();
          m.value = T.models || [];
          const oe = h.url.slice(0, h.url.indexOf("/", 15) + 1);
          w.live2d.modelUrl.startsWith(oe) && (w.live2d.modelUrl = "", w.live2d.enabled = !1, w.saveToStorage()), await ce(), S.value = "模型已删除", window.dispatchEvent(new Event("live2d-models-changed"));
        } catch (r) {
          S.value = r.message;
        }
    }
    async function ce() {
      w.saveToStorage();
      const h = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: w.live2d.enabled, model_url: w.live2d.modelUrl } }) });
      if (!h.ok) throw new Error(await h.text());
    }
    function Me() {
      g.value?.click();
    }
    async function Ue(h) {
      const f = h.target, r = f.files;
      if (!(!r || r.length === 0)) {
        S.value = "";
        try {
          const T = new FormData(), oe = [];
          for (const ae of Array.from(r)) {
            const qe = ae.webkitRelativePath || ae.name;
            oe.push(qe), T.append("files", ae, ae.name);
          }
          T.append("paths", JSON.stringify(oe));
          const se = await fetch("/api/live2d", { method: "POST", body: T });
          if (!se.ok) throw new Error(await se.text());
          const Y = await se.json();
          S.value = s("settings.uploadOk"), Y?.models ? m.value = Y.models : await ye(), Y?.model_url && (w.live2d.modelUrl = Y.model_url, w.live2d.enabled = !0, w.saveToStorage(), await ce(), window.dispatchEvent(new Event("live2d-models-changed")));
        } catch (T) {
          S.value = `${s("settings.uploadFail")}：${T.message}`;
        } finally {
          f.value = "";
        }
      }
    }
    ie(async () => {
      w.loadFromStorage();
      const h = $.query.tab;
      h && (o.value = h), ye(), j(), await k.fetchSections();
      for (const f of k.sections) ke(f.id);
    });
    function b(h) {
      o.value = h, L(h) || ke(h), C.replace({ query: { tab: h } });
    }
    function P() {
      w.saveToStorage(), o.value === "live2d" && ce().catch((h) => {
        S.value = h.message;
      }), c.value = !0, setTimeout(() => {
        c.value = !1;
      }, 1500);
    }
    return (h, f) => (i(), d("div", Mr, [
      e("header", Ur, [
        e("div", null, [
          e("h1", null, n(l(s)("settings.title")), 1),
          e("p", Er, n(l(s)("settings.pageDesc")), 1)
        ]),
        o.value !== "about" && !me.value ? (i(), d("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: P
        }, [
          c.value ? (i(), d("span", Ar, n(l(s)("settings.saved")), 1)) : (i(), d("span", Tr, n(l(s)("settings.save")), 1))
        ])) : U("", !0)
      ]),
      e("div", Nr, [
        e("nav", Vr, [
          (i(!0), d(D, null, q(t.value, (r) => (i(), d("button", {
            key: r.id,
            class: J(["nav-item", { active: o.value === r.id }]),
            onClick: (T) => b(r.id)
          }, [
            f[19] || (f[19] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", Rr, [
              r.icon === "globe" ? (i(), d("svg", Or, [...f[7] || (f[7] = [
                e("circle", {
                  cx: "12",
                  cy: "12",
                  r: "9",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("path", {
                  d: "M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1)
              ])])) : r.icon === "cloud" ? (i(), d("svg", Lr, [...f[8] || (f[8] = [
                e("path", {
                  d: "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])])) : r.icon === "chip" ? (i(), d("svg", zr, [...f[9] || (f[9] = [
                e("rect", {
                  x: "6",
                  y: "6",
                  width: "12",
                  height: "12",
                  rx: "2",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("path", {
                  d: "M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : r.icon === "person" ? (i(), d("svg", Dr, [...f[10] || (f[10] = [
                e("circle", {
                  cx: "12",
                  cy: "8",
                  r: "4",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("path", {
                  d: "M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : r.icon === "avatar" ? (i(), d("svg", Fr, [...f[11] || (f[11] = [
                e("circle", {
                  cx: "12",
                  cy: "10",
                  r: "6",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("path", {
                  d: "M5 21c1.5-3 4-4.5 7-4.5S17.5 18 19 21",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1),
                e("circle", {
                  cx: "10",
                  cy: "10",
                  r: "1",
                  fill: "currentColor"
                }, null, -1),
                e("circle", {
                  cx: "14",
                  cy: "10",
                  r: "1",
                  fill: "currentColor"
                }, null, -1)
              ])])) : r.icon === "brightness" ? (i(), d("svg", Br, [...f[12] || (f[12] = [
                e("circle", {
                  cx: "12",
                  cy: "12",
                  r: "4",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("path", {
                  d: "M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : r.icon === "warn" ? (i(), d("svg", Kr, [...f[13] || (f[13] = [
                e("path", {
                  d: "M12 4l9 16H3L12 4z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1),
                e("path", {
                  d: "M12 10v4M12 17.01",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : r.icon === "info" ? (i(), d("svg", Hr, [...f[14] || (f[14] = [
                e("circle", {
                  cx: "12",
                  cy: "12",
                  r: "9",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("path", {
                  d: "M12 11v5M12 7.5v.01",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : r.icon === "download" ? (i(), d("svg", jr, [...f[15] || (f[15] = [
                e("path", {
                  d: "M12 3v12m0 0l-4-4m4 4l4-4",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }, null, -1),
                e("path", {
                  d: "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : r.icon === "shield" ? (i(), d("svg", Yr, [...f[16] || (f[16] = [
                e("path", {
                  d: "M12 3l7 3v6c0 4.2-2.8 7.6-7 9-4.2-1.4-7-4.8-7-9V6l7-3z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1),
                e("path", {
                  d: "M9 12l2 2 4-4",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])])) : r.icon === "link" ? (i(), d("svg", Jr, [...f[17] || (f[17] = [
                e("rect", {
                  x: "3",
                  y: "3",
                  width: "7",
                  height: "7",
                  rx: "1.5",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("rect", {
                  x: "14",
                  y: "3",
                  width: "7",
                  height: "7",
                  rx: "1.5",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("rect", {
                  x: "3",
                  y: "14",
                  width: "7",
                  height: "7",
                  rx: "1.5",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("path", {
                  d: "M14 17h7M17.5 13.5v7",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : (i(), d("svg", Wr, [...f[18] || (f[18] = [
                e("rect", {
                  x: "5",
                  y: "11",
                  width: "14",
                  height: "10",
                  rx: "2",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("path", {
                  d: "M8 11V8a4 4 0 0 1 8 0v3",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])]))
            ]),
            e("span", qr, n(l(O)(r.id)), 1)
          ], 10, Ir))), 128))
        ]),
        e("section", Gr, [
          o.value === "general" ? (i(), le(Pn, { key: 0 })) : o.value === "connection" ? (i(), le(Yn, { key: 1 })) : o.value === "provider" ? (i(), d(D, { key: 2 }, [
            Q(cn),
            l(Z)("provider")?.fields?.length ? (i(), d("div", Xr, [
              e("h3", null, n(l(Z)("provider").label), 1),
              l(Z)("provider").description ? (i(), d("p", Zr, n(l(Z)("provider").description), 1)) : U("", !0),
              (i(!0), d(D, null, q(l(Z)("provider").fields, (r) => (i(), d("div", {
                key: r.key,
                class: "field"
              }, [
                r.type === "bool" ? (i(), d("label", Qr, [
                  e("input", {
                    type: "checkbox",
                    checked: be("provider", r.key),
                    onChange: (T) => v.value = { ...v.value, provider: { ...v.value.provider, [r.key]: T.target.checked } }
                  }, null, 40, eu),
                  f[20] || (f[20] = e("span", { class: "toggle-slider" }, null, -1)),
                  e("span", null, [
                    e("strong", null, n(r.label), 1),
                    r.help ? (i(), d("br", tu)) : U("", !0),
                    r.help ? (i(), d("small", su, n(r.help), 1)) : U("", !0)
                  ])
                ])) : r.type === "select" ? (i(), d(D, { key: 1 }, [
                  e("label", null, n(r.label), 1),
                  Q(l(de), {
                    class: "input",
                    "aria-label": r.label,
                    "model-value": String(v.value.provider?.[r.key] ?? ""),
                    options: r.options || [],
                    "onUpdate:modelValue": (T) => v.value = { ...v.value, provider: { ...v.value.provider, [r.key]: T } }
                  }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                  r.help ? (i(), d("p", lu, n(r.help), 1)) : U("", !0)
                ], 64)) : (i(), d(D, { key: 2 }, [
                  e("label", null, n(r.label), 1),
                  e("input", {
                    class: "input",
                    type: r.type === "number" ? "number" : "text",
                    value: v.value.provider?.[r.key],
                    onInput: (T) => v.value = { ...v.value, provider: { ...v.value.provider, [r.key]: r.type === "number" ? Number(T.target.value) : T.target.value } }
                  }, null, 40, ou),
                  r.help ? (i(), d("p", nu, n(r.help), 1)) : U("", !0)
                ], 64))
              ]))), 128)),
              I.value ? (i(), d("div", au, n(I.value), 1)) : U("", !0),
              e("div", iu, [
                e("button", {
                  class: "btn btn-primary",
                  type: "button",
                  onClick: f[0] || (f[0] = (r) => $e("provider"))
                }, n(l(s)("settings.save")), 1)
              ])
            ])) : U("", !0)
          ], 64)) : o.value === "persona" ? (i(), le(da, { key: 3 })) : o.value === "live2d" ? (i(), d("div", ru, [
            e("h2", null, n(l(O)("live2d")), 1),
            e("p", uu, n(l(B)("live2d")?.descriptionKey ? l(s)(l(B)("live2d").descriptionKey) : l(s)("settings.live2dDesc")), 1),
            Q(ct, { class: "live2d-preview" }),
            e("label", du, [
              V(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": f[1] || (f[1] = (r) => l(w).live2d.enabled = r)
              }, null, 512), [
                [te, l(w).live2d.enabled]
              ]),
              f[21] || (f[21] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", null, n(l(s)("wizard.enableLive2d")), 1)
            ]),
            e("div", cu, [
              e("label", null, n(l(s)("wizard.modelUrl")), 1),
              e("div", pu, [
                (i(!0), d(D, null, q(l(dt), (r) => (i(), d("label", {
                  key: r.id,
                  class: J(["model-choice", { selected: l(w).live2d.modelUrl === r.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-model",
                    value: r.url,
                    checked: l(w).live2d.modelUrl === r.url,
                    onChange: (T) => {
                      l(w).live2d.modelUrl = r.url, l(w).live2d.enabled = !0;
                    }
                  }, null, 40, vu),
                  e("span", null, n(r.label), 1),
                  e("code", null, n(r.url), 1)
                ], 2))), 128))
              ]),
              V(e("input", {
                "onUpdate:modelValue": f[2] || (f[2] = (r) => l(w).live2d.modelUrl = r),
                placeholder: l(s)("wizard.modelUrlPlaceholder"),
                class: "input"
              }, null, 8, hu), [
                [F, l(w).live2d.modelUrl]
              ]),
              e("p", mu, [
                G(n(l(s)("wizard.live2dHelp")) + " ", 1),
                e("a", gu, n(l(s)("wizard.live2dSamples")), 1)
              ])
            ]),
            f[22] || (f[22] = e("p", { class: "helper-text" }, "支持 Cubism 2（.model.json + .moc）与 Cubism 3/4（.model3.json + .moc3）。请选择完整模型文件夹，包含纹理、动作等资源。", -1)),
            e("button", {
              class: "btn btn-tonal",
              onClick: f[3] || (f[3] = (r) => ce().catch((T) => S.value = T.message))
            }, "保存 LIFE 的 Live2D 设置"),
            e("div", _u, [
              e("label", null, n(l(s)("settings.uploadFolder")), 1),
              e("label", {
                class: "upload-area",
                onClick: Le(Me, ["prevent"])
              }, [
                e("span", null, n(l(s)("settings.uploadFolderHint")), 1)
              ]),
              e("input", {
                ref_key: "folderInput",
                ref: g,
                type: "file",
                webkitdirectory: "",
                directory: "",
                multiple: "",
                class: "file-input",
                onChange: Ue
              }, null, 544),
              S.value ? (i(), d("p", bu, n(S.value), 1)) : U("", !0),
              m.value.length ? (i(), d("div", yu, [
                (i(!0), d(D, null, q(m.value, (r) => (i(), d("label", {
                  key: r.id,
                  class: J(["model-choice", { selected: l(w).live2d.modelUrl === r.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-uploaded",
                    value: r.url,
                    checked: l(w).live2d.modelUrl === r.url,
                    onChange: (T) => {
                      l(w).live2d.modelUrl = r.url, l(w).live2d.enabled = !0, ce().catch((oe) => S.value = oe.message);
                    }
                  }, null, 40, fu),
                  e("span", null, n(r.label), 1),
                  e("code", null, n(r.url), 1),
                  e("button", {
                    type: "button",
                    class: "btn btn-danger",
                    onClick: Le((T) => xe(r), ["prevent"])
                  }, "删除模型", 8, ku)
                ], 2))), 128))
              ])) : U("", !0)
            ])
          ])) : o.value === "security" ? (i(), le(ai, { key: 5 })) : o.value === "permissions" ? (i(), le(wa, { key: 6 })) : o.value === "mcp" ? (i(), le(ur, { key: 7 })) : o.value === "life_settings" ? (i(), le(Wt, { key: 8 })) : l(K)(o.value) && l(Z)(o.value) ? (i(), d("div", wu, [
            e("h2", null, n(l(Z)(o.value).label), 1),
            l(Z)(o.value).description ? (i(), d("p", $u, n(l(Z)(o.value).description), 1)) : U("", !0),
            l(Z)(o.value).plugin_name ? (i(), d("p", Cu, n(l(Z)(o.value).plugin_name), 1)) : U("", !0),
            (i(!0), d(D, null, q(l(Z)(o.value).fields, (r) => (i(), d("div", {
              key: r.key,
              class: "field"
            }, [
              r.type === "bool" ? (i(), d("label", Su, [
                e("input", {
                  type: "checkbox",
                  checked: be(o.value, r.key),
                  onChange: (T) => v.value = { ...v.value, [o.value]: { ...v.value[o.value], [r.key]: T.target.checked } }
                }, null, 40, Pu),
                f[23] || (f[23] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, n(r.label), 1),
                  r.help ? (i(), d("br", xu)) : U("", !0),
                  r.help ? (i(), d("small", Mu, n(r.help), 1)) : U("", !0)
                ])
              ])) : r.type === "select" ? (i(), d(D, { key: 1 }, [
                e("label", null, n(r.label), 1),
                Q(l(de), {
                  class: "input",
                  "aria-label": r.label,
                  "model-value": String(v.value[o.value]?.[r.key] ?? ""),
                  options: r.options || [],
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [r.key]: T }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                r.help ? (i(), d("p", Uu, n(r.help), 1)) : U("", !0)
              ], 64)) : r.type === "model" ? (i(), d(D, { key: 2 }, [
                e("label", null, n(r.label), 1),
                Q(l(de), {
                  class: "input",
                  "aria-label": r.label,
                  "model-value": String(v.value[o.value]?.[r.key] ?? ""),
                  options: N.value,
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [r.key]: T }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                r.help ? (i(), d("p", Eu, n(r.help), 1)) : U("", !0)
              ], 64)) : r.type === "models" ? (i(), d(D, { key: 3 }, [
                e("label", null, n(r.label), 1),
                Q(Ke, {
                  "model-value": String(v.value[o.value]?.[r.key] ?? ""),
                  options: x.value,
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [r.key]: T }
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                r.help ? (i(), d("p", Au, n(r.help), 1)) : U("", !0)
              ], 64)) : r.type === "test" ? (i(), d(D, { key: 4 }, [
                e("label", null, n(r.label), 1),
                e("div", Tu, [
                  e("button", {
                    class: "btn btn-tonal",
                    type: "button",
                    disabled: R.value,
                    onClick: f[4] || (f[4] = (T) => X(o.value))
                  }, n(R.value ? l(s)("settings.testing") : r.label || "测试"), 9, Nu),
                  E.value ? (i(), d("span", Vu, n(E.value), 1)) : U("", !0)
                ]),
                r.help ? (i(), d("p", Iu, n(r.help), 1)) : U("", !0)
              ], 64)) : (i(), d(D, { key: 5 }, [
                e("label", null, n(r.label), 1),
                e("input", {
                  class: "input",
                  type: r.type === "number" ? "number" : "text",
                  value: v.value[o.value]?.[r.key],
                  onInput: (T) => v.value[o.value] = { ...v.value[o.value], [r.key]: r.type === "number" ? Number(T.target.value) : T.target.value }
                }, null, 40, Ru),
                r.help ? (i(), d("p", Ou, n(r.help), 1)) : U("", !0)
              ], 64))
            ]))), 128)),
            I.value ? (i(), d("div", Lu, n(I.value), 1)) : U("", !0),
            e("div", zu, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: f[5] || (f[5] = (r) => $e(o.value))
              }, n(l(s)("settings.save")), 1)
            ])
          ])) : me.value ? (i(), le(_r, {
            key: me.value,
            module: me.value || ""
          }, null, 8, ["module"])) : !l(L)(o.value) && l(B)(o.value)?.fields?.length ? (i(), d("div", Du, [
            e("h2", null, n(l(O)(o.value)), 1),
            l(B)(o.value)?.descriptionKey ? (i(), d("p", Fu, n(l(s)(l(B)(o.value).descriptionKey)), 1)) : l(B)(o.value)?.description ? (i(), d("p", Bu, n(l(B)(o.value).description), 1)) : U("", !0),
            (i(!0), d(D, null, q(l(B)(o.value).fields, (r) => (i(), d("div", {
              key: r.key,
              class: "field"
            }, [
              r.type === "bool" ? (i(), d("label", Ku, [
                e("input", {
                  type: "checkbox",
                  checked: be(o.value, r.key),
                  onChange: (T) => v.value = { ...v.value, [o.value]: { ...v.value[o.value], [r.key]: T.target.checked } }
                }, null, 40, Hu),
                f[24] || (f[24] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, n(l(ne)(l(B)(o.value), r.key, `settings.${r.key}`)), 1),
                  r.help || r.helpKey ? (i(), d("br", ju)) : U("", !0),
                  r.help || r.helpKey ? (i(), d("small", Yu, n(l(he)(l(B)(o.value), r.key, `settings.${r.key}Desc`)), 1)) : U("", !0)
                ])
              ])) : r.type === "select" ? (i(), d(D, { key: 1 }, [
                e("label", null, n(l(ne)(l(B)(o.value), r.key, `settings.${r.key}`)), 1),
                Q(l(de), {
                  class: "input",
                  "aria-label": l(ne)(l(B)(o.value), r.key, `settings.${r.key}`),
                  "model-value": String(v.value[o.value]?.[r.key] ?? ""),
                  options: r.options || [],
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [r.key]: T }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                r.help || r.helpKey ? (i(), d("p", Ju, n(l(he)(l(B)(o.value), r.key, `settings.${r.key}Desc`)), 1)) : U("", !0)
              ], 64)) : r.type === "model" ? (i(), d(D, { key: 2 }, [
                e("label", null, n(l(ne)(l(B)(o.value), r.key, `settings.${r.key}`)), 1),
                Q(l(de), {
                  class: "input",
                  "aria-label": l(ne)(l(B)(o.value), r.key, `settings.${r.key}`),
                  "model-value": String(v.value[o.value]?.[r.key] ?? ""),
                  options: N.value,
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [r.key]: T }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                r.help || r.helpKey ? (i(), d("p", Wu, n(l(he)(l(B)(o.value), r.key, `settings.${r.key}Desc`)), 1)) : U("", !0)
              ], 64)) : r.type === "models" ? (i(), d(D, { key: 3 }, [
                e("label", null, n(l(ne)(l(B)(o.value), r.key, `settings.${r.key}`)), 1),
                Q(Ke, {
                  "model-value": String(v.value[o.value]?.[r.key] ?? ""),
                  options: x.value,
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [r.key]: T }
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                r.help || r.helpKey ? (i(), d("p", qu, n(l(he)(l(B)(o.value), r.key, `settings.${r.key}Desc`)), 1)) : U("", !0)
              ], 64)) : (i(), d(D, { key: 4 }, [
                e("label", null, n(l(ne)(l(B)(o.value), r.key, `settings.${r.key}`)), 1),
                e("input", {
                  class: "input",
                  type: r.type === "number" ? "number" : "text",
                  value: v.value[o.value]?.[r.key],
                  onInput: (T) => v.value[o.value] = { ...v.value[o.value], [r.key]: r.type === "number" ? Number(T.target.value) : T.target.value }
                }, null, 40, Gu),
                r.help || r.helpKey ? (i(), d("p", Xu, n(l(he)(l(B)(o.value), r.key, `settings.${r.key}Desc`)), 1)) : U("", !0)
              ], 64))
            ]))), 128)),
            I.value ? (i(), d("div", Zu, n(I.value), 1)) : U("", !0),
            e("div", Qu, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: f[6] || (f[6] = (r) => we(o.value))
              }, n(l(s)("settings.save")), 1)
            ])
          ])) : o.value === "about" ? (i(), le(Qs, { key: 12 })) : o.value === "updates" ? (i(), le(Fl, { key: 13 })) : (i(), le(vr, { key: 14 }))
        ])
      ])
    ]));
  }
});
export {
  id as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".live2d-stage[data-v-594879d8]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-594879d8]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:none;cursor:grab;user-select:none;background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,#f3edf7,#e7e0ec 55%,#d0bcff33)}.stage-viewport[data-v-594879d8]:active{cursor:grabbing}.stage-canvas[data-v-594879d8]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-594879d8]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-594879d8]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-594879d8]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-594879d8]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-594879d8]:active{transform:scale(.96)}.stage-reset.dragging[data-v-594879d8]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-594879d8]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-594879d8]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-594879d8]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-31946fce]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-31946fce]{flex-direction:row-reverse}.avatar[data-v-31946fce]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-31946fce]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-31946fce]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-31946fce]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-31946fce]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-31946fce]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-31946fce]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-31946fce]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-31946fce]{max-width:70%}.content[data-v-31946fce]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.user .content[data-v-31946fce]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-31946fce]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-31946fce]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-31946fce]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-31946fce]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-31946fce]{margin:4px 0}.think-body b[data-v-31946fce]{color:var(--md-on-surface)}.think-summary[data-v-31946fce]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-31946fce]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-31946fce]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-31946fce]{justify-content:flex-end}.separator[data-v-31946fce]{color:var(--neutral-gray-10)}.emotion[data-v-31946fce]{font-weight:500}.chat-panel[data-v-12162d94]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-12162d94]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-12162d94]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-12162d94]{color:var(--md-error)}.chat-container[data-v-12162d94]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-12162d94]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-12162d94]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-12162d94]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-12162d94]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-12162d94]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-12162d94]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-12162d94]{display:flex;gap:4px}.typing-dots span[data-v-12162d94]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-12162d94 1.4s infinite ease-in-out}.typing-dots span[data-v-12162d94]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-12162d94]:nth-child(2){animation-delay:-.16s}@keyframes bounce-12162d94{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-12162d94]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-12162d94]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-12162d94]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-12162d94]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-12162d94]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-12162d94],.pending-files[data-v-12162d94]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-12162d94]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-12162d94]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-12162d94]:hover{color:var(--error)}.pending-thumb[data-v-12162d94]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-12162d94]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-12162d94]{position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.attach-btn[data-v-12162d94]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-12162d94]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-12162d94]:disabled{opacity:.5;cursor:not-allowed}.send-button[data-v-12162d94]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-12162d94]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-12162d94]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-12162d94]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-12162d94]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-12162d94]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-12162d94]{background:var(--success)}.disconnected .status-dot[data-v-12162d94]{background:var(--error)}.hint[data-v-12162d94]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-16905aa0]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-16905aa0]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-16905aa0]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-16905aa0]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-16905aa0]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-16905aa0]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-16905aa0]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-16905aa0]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-16905aa0]{margin-bottom:var(--space-xl)}.section-header[data-v-16905aa0]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-16905aa0]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.section-value[data-v-16905aa0]{font-size:var(--font-size-sm);color:var(--neutral-gray-30)}.mood-display[data-v-16905aa0]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-16905aa0]{margin-bottom:var(--space-md)}.mood-label[data-v-16905aa0]{font-size:var(--font-size-md);font-weight:600}.energy-bar[data-v-16905aa0]{height:8px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.energy-fill[data-v-16905aa0]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out),background-color var(--duration-medium) var(--ease-out)}.emotion-bars[data-v-16905aa0]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-16905aa0]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-16905aa0]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-16905aa0]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-16905aa0]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-16905aa0]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-list[data-v-16905aa0]{display:flex;flex-direction:column;gap:var(--space-sm)}.task-item[data-v-16905aa0]{display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-id[data-v-16905aa0]{font-family:monospace;font-size:var(--font-size-sm);color:var(--neutral-gray-50)}.task-status[data-v-16905aa0]{font-size:var(--font-size-xs);color:var(--brand-primary)}.connection-info[data-v-16905aa0]{display:flex;align-items:center;gap:var(--space-sm);font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.link-btn[data-v-16905aa0]{border:none;background:none;color:var(--brand-primary);font-size:var(--font-size-xs);cursor:pointer;padding:0}.link-btn[data-v-16905aa0]:disabled{opacity:.5;cursor:default}.memory-stats[data-v-16905aa0]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);margin-bottom:var(--space-sm)}.memory-stat[data-v-16905aa0]{padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);text-align:center}.memory-stat-label[data-v-16905aa0]{display:block;font-size:var(--font-size-xs);color:var(--neutral-gray-30);margin-bottom:2px}.memory-stat-value[data-v-16905aa0]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-50)}.memory-list[data-v-16905aa0]{display:flex;flex-direction:column;gap:var(--space-xs)}.memory-item[data-v-16905aa0]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-sm);padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);font-size:var(--font-size-sm)}.memory-text[data-v-16905aa0]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--neutral-gray-50)}.memory-strength[data-v-16905aa0]{font-size:var(--font-size-xs);color:var(--brand-primary);font-weight:600}.connection-dot[data-v-16905aa0]{width:8px;height:8px;border-radius:50%;background:var(--error)}.connection-dot.connected[data-v-16905aa0]{background:var(--success)}.state-source[data-v-16905aa0]{margin-left:auto;font-size:var(--font-size-xs);font-weight:700;color:var(--brand-primary);letter-spacing:.5px}.agents-display[data-v-16905aa0]{padding:var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.agent-count[data-v-16905aa0]{display:flex;align-items:baseline;gap:var(--space-sm)}.agent-number[data-v-16905aa0]{font-size:var(--font-size-xl);font-weight:700;color:var(--neutral-gray-30)}.agent-number.online[data-v-16905aa0]{color:var(--success)}.agent-label[data-v-16905aa0]{font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.agent-offline[data-v-16905aa0]{margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.chat-page[data-v-ea28c256]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-ea28c256]{grid-template-columns:1fr}.stage-column[data-v-ea28c256]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-ea28c256]{flex:1;min-height:240px}.status-panel[data-v-ea28c256]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-ea28c256]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-ea28c256]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-ea28c256]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-ea28c256]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-ea28c256]:hover,.page-resizer[data-v-ea28c256]:active{background:var(--md-primary)}.chat-column[data-v-ea28c256]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-ea28c256]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-ea28c256]{display:flex;flex-direction:column}.stage-column[data-v-ea28c256]{flex:1;min-height:0}.page-resizer[data-v-ea28c256]{display:none}.chat-column[data-v-ea28c256]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);transition:transform var(--transition-normal)}.chat-column.open[data-v-ea28c256]{transform:translate(0)}}.plugins-page[data-v-68f27c9f]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-68f27c9f]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-68f27c9f]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-68f27c9f],.pp-hero h1[data-v-68f27c9f]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-68f27c9f]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-68f27c9f]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-68f27c9f]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.pp-stats[data-v-68f27c9f]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-68f27c9f]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-68f27c9f]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-68f27c9f]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-68f27c9f]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-68f27c9f]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-68f27c9f]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-68f27c9f]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-68f27c9f]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-68f27c9f var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-68f27c9f{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-68f27c9f]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-68f27c9f]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-68f27c9f]{opacity:.62}.plugin-top[data-v-68f27c9f]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-68f27c9f]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-68f27c9f]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-68f27c9f]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-68f27c9f]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-68f27c9f]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-68f27c9f]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-68f27c9f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-68f27c9f]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-68f27c9f]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-68f27c9f]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-68f27c9f]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-68f27c9f]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-68f27c9f]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-68f27c9f]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-68f27c9f]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-68f27c9f]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-68f27c9f]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-68f27c9f]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-68f27c9f]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-68f27c9f]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-68f27c9f]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-68f27c9f]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-68f27c9f]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-68f27c9f]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-68f27c9f]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-68f27c9f]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-68f27c9f]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-68f27c9f]{white-space:nowrap}#app .plugins-page .btn[data-v-68f27c9f]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-68f27c9f]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-68f27c9f]:disabled{opacity:.6;cursor:not-allowed}#app .plugins-page .btn-tonal[data-v-68f27c9f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .plugins-page .btn-danger[data-v-68f27c9f]{background:var(--md-error-container);color:var(--md-on-error-container)}.empty-state[data-v-68f27c9f]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-68f27c9f]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-68f27c9f]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-68f27c9f]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-68f27c9f]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-68f27c9f]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-68f27c9f]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-68f27c9f],.pd-leave-to[data-v-68f27c9f]{opacity:0}.pd-enter-active .pd-dialog[data-v-68f27c9f]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-68f27c9f]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-68f27c9f],.pd-leave-to .pd-dialog[data-v-68f27c9f]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-68f27c9f]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-68f27c9f]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-68f27c9f]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-68f27c9f]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-68f27c9f]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-68f27c9f]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-68f27c9f]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-68f27c9f]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-68f27c9f]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-68f27c9f]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-68f27c9f]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-68f27c9f]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-68f27c9f]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-68f27c9f]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-68f27c9f]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-68f27c9f]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-68f27c9f]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-68f27c9f]{color:var(--md-error)}.pd-foot[data-v-68f27c9f]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-68f27c9f]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn-tonal[data-v-68f27c9f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pd-foot .btn-danger[data-v-68f27c9f]{background:var(--md-error-container);color:var(--md-on-error-container)}.pd-foot .btn[data-v-68f27c9f]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-68f27c9f],.pd-leave-active[data-v-68f27c9f],.pd-enter-active .pd-dialog[data-v-68f27c9f],.pd-leave-active .pd-dialog[data-v-68f27c9f]{transition:none}.pd-enter-from .pd-dialog[data-v-68f27c9f],.pd-leave-to .pd-dialog[data-v-68f27c9f]{transform:none}}.life-settings[data-v-153238d0]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-153238d0]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-153238d0 .52s var(--ls-spring) both}.ls-hero-main[data-v-153238d0]{min-width:0}.ls-eyebrow[data-v-153238d0]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-153238d0]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-153238d0]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-153238d0]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-153238d0]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-153238d0]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-153238d0]{font-size:16px}.ls-grid[data-v-153238d0]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-153238d0]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-153238d0 .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-153238d0]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-153238d0]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-153238d0]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-153238d0]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-153238d0]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-153238d0]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-153238d0]{grid-column:1 / -1}.ls-card-head[data-v-153238d0]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-153238d0]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-153238d0]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-153238d0]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-153238d0]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-153238d0]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-153238d0]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-153238d0]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-153238d0]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-153238d0]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-153238d0]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-153238d0]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-153238d0]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-153238d0]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-153238d0]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-153238d0]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-153238d0]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-153238d0]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-153238d0]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-153238d0]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-153238d0]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-153238d0]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-153238d0]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-153238d0]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-153238d0]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-153238d0]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-153238d0]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-153238d0]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-153238d0]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-153238d0]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-153238d0]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-153238d0]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-153238d0]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-153238d0]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}.ls-model b[data-v-153238d0]{font-size:13px;word-break:break-all}.ls-model span[data-v-153238d0]{font-size:12px;color:var(--md-on-surface-variant)}.ls-state[data-v-153238d0]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-153238d0 .32s var(--ls-spring) both}@keyframes ls-rise-153238d0{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-153238d0{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-153238d0],.ls-row[data-v-153238d0],.ls-models[data-v-153238d0]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-153238d0],.ls-card[data-v-153238d0],.ls-state[data-v-153238d0]{animation:none}}.about[data-v-979e4119]{display:flex;flex-direction:column;gap:26px}.identity[data-v-979e4119]{display:flex;align-items:center;gap:16px}.app-icon[data-v-979e4119]{flex:none;width:56px;height:56px;border-radius:16px;background:var(--md-primary);color:var(--md-on-primary);display:grid;place-items:center;font-size:20px;font-weight:750;letter-spacing:-1px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 35%,transparent)}.app-id[data-v-979e4119]{flex:1;min-width:0}.app-id h2[data-v-979e4119]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-979e4119]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-979e4119]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-979e4119]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-979e4119]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-979e4119]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-979e4119]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-979e4119]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.btn.sm[data-v-979e4119]{height:34px;padding-inline:16px;font-size:13px}.credits[data-v-979e4119]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-979e4119]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-979e4119]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-979e4119]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-979e4119]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-979e4119]{font-size:16px;font-weight:650}.person-info .role[data-v-979e4119]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-979e4119]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-979e4119]{margin-top:6px}.contribs[data-v-979e4119]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-979e4119]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-979e4119]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-979e4119]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-979e4119]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-979e4119]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-979e4119]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-979e4119]{margin-left:auto}.status-chip[data-v-979e4119]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-979e4119]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-979e4119]:hover{text-decoration:underline}.muted[data-v-979e4119]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-979e4119]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-979e4119]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-979e4119]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-979e4119]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-979e4119]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-979e4119]{flex:1;min-width:0}.us-hero-text b[data-v-979e4119]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-979e4119]{font-size:13px;opacity:.85}.us-hero-text em[data-v-979e4119]{font-style:normal;font-weight:700}.us-hero-actions[data-v-979e4119]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-979e4119]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-979e4119]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-979e4119]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-979e4119]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-979e4119]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-979e4119]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-979e4119]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-979e4119]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-979e4119]{font-weight:700}.us-apply-label[data-v-979e4119]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-979e4119]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-979e4119]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-979e4119]{animation:us-spin-979e4119 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-979e4119],.us-apply-banner.failed .us-spinner[data-v-979e4119]{display:none}.us-apply-log[data-v-979e4119],.us-apply-error[data-v-979e4119]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-979e4119{to{transform:rotate(360deg)}}.alert[data-v-979e4119]{color:var(--md-error)}.updates[data-v-d69111d9]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-d69111d9]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-d69111d9]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-d69111d9]{display:flex;align-items:center;gap:12px}.us-ico[data-v-d69111d9]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-d69111d9]{flex:1;min-width:0}.us-title[data-v-d69111d9]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-d69111d9]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-d69111d9]{display:flex;align-items:center;gap:8px}.us-tag[data-v-d69111d9]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-d69111d9]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-d69111d9]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-d69111d9]{background:#ffdf9e;color:#4a3800}.us-source[data-v-d69111d9]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-d69111d9]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-d69111d9]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-d69111d9]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-d69111d9]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-d69111d9]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-d69111d9]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-d69111d9]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-d69111d9]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-d69111d9]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-d69111d9]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-d69111d9]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-d69111d9]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-d69111d9]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-d69111d9]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-d69111d9]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-d69111d9]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-d69111d9]{flex:1;min-width:0}.us-hero-text b[data-v-d69111d9]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-d69111d9]{font-size:13px;opacity:.85}.us-hero-text em[data-v-d69111d9]{font-style:normal;font-weight:700}.us-hero-actions[data-v-d69111d9]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-d69111d9]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-d69111d9]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-d69111d9]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-d69111d9]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-d69111d9]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-d69111d9]{font-weight:700}.us-apply-label[data-v-d69111d9]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-d69111d9]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-d69111d9]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-d69111d9]{animation:us-spin-d69111d9 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-d69111d9],.us-apply-banner.failed .us-spinner[data-v-d69111d9]{display:none}.us-apply-log[data-v-d69111d9],.us-apply-error[data-v-d69111d9]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-d69111d9{to{transform:rotate(360deg)}}.us-table[data-v-d69111d9]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-d69111d9]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-d69111d9]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-d69111d9]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-d69111d9]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-d69111d9]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-d69111d9]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-d69111d9]{background:var(--md-success)}.us-dot.warn[data-v-d69111d9]{background:#e0a800}.us-dot.bad[data-v-d69111d9]{background:var(--md-error)}.us-ver[data-v-d69111d9]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-d69111d9]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-d69111d9]{font-weight:650}.us-ver b.good[data-v-d69111d9]{color:var(--md-success)}.us-arrow[data-v-d69111d9]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-d69111d9]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-d69111d9]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-d69111d9]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-d69111d9]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-d69111d9]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-d69111d9]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-d69111d9]:hover{text-decoration:underline}.us-empty[data-v-d69111d9]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-d69111d9]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-d69111d9]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.btn.sm[data-v-d69111d9]{height:34px;padding-inline:16px;font-size:13px}.btn.xs[data-v-d69111d9]{height:30px;padding-inline:12px;font-size:12px}.alert[data-v-d69111d9]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-d69111d9]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-d69111d9]{display:none}.us-hero[data-v-d69111d9]{flex-wrap:wrap}.us-hero-actions[data-v-d69111d9]{width:100%}}.provider-panel[data-v-828ee6e3]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-828ee6e3]{display:flex;align-items:center;gap:14px}.pp-back[data-v-828ee6e3]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-828ee6e3]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-828ee6e3]{flex:1;min-width:0}.pp-editor-title h2[data-v-828ee6e3]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-828ee6e3]{margin:3px 0 0}.pp-section[data-v-828ee6e3]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-828ee6e3]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-828ee6e3]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-828ee6e3]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-828ee6e3]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-828ee6e3]{margin-bottom:0}.pp-span[data-v-828ee6e3]{grid-column:1 / -1}.pp-req[data-v-828ee6e3]{color:var(--md-error);margin-left:2px}.pp-key[data-v-828ee6e3]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-828ee6e3]{flex:1}.pp-key-toggle[data-v-828ee6e3]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-828ee6e3]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-828ee6e3]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-828ee6e3]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-828ee6e3]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-828ee6e3]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-828ee6e3]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-828ee6e3]{animation:pp-pulse-828ee6e3 1s ease-in-out infinite}@keyframes pp-pulse-828ee6e3{50%{opacity:.15}}.pp-probe[data-v-828ee6e3]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-828ee6e3]{color:var(--md-success)}.pp-probe.err[data-v-828ee6e3]{color:var(--md-error)}.pp-discovered[data-v-828ee6e3]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-828ee6e3]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-828ee6e3]{flex:1;min-width:160px}.pp-mini[data-v-828ee6e3]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-828ee6e3]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-models[data-v-828ee6e3]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-828ee6e3]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-828ee6e3]:first-child{border-top:0}.pp-model.off[data-v-828ee6e3]{opacity:.5}.pp-model-name[data-v-828ee6e3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-828ee6e3]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-828ee6e3]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-828ee6e3]{color:#e0a800;cursor:default}.pp-switch[data-v-828ee6e3]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-828ee6e3]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-828ee6e3]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-828ee6e3]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-828ee6e3]{display:flex;gap:10px}.pp-list-head[data-v-828ee6e3]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-828ee6e3]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-828ee6e3]{margin:3px 0 0}.pp-list-actions[data-v-828ee6e3]{display:flex;gap:8px}.pp-cards[data-v-828ee6e3]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-828ee6e3]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-828ee6e3]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-828ee6e3]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-828ee6e3]{opacity:.62}.pp-card-head[data-v-828ee6e3]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-828ee6e3]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-828ee6e3]{width:26px;height:26px}.pp-card-id[data-v-828ee6e3]{flex:1;min-width:0}.pp-card-id strong[data-v-828ee6e3]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-828ee6e3]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-828ee6e3]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-828ee6e3]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-828ee6e3]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-828ee6e3]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-828ee6e3]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-828ee6e3]{color:var(--md-error)}.pp-chips[data-v-828ee6e3]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-828ee6e3]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-828ee6e3],.pp-chip.empty[data-v-828ee6e3]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-828ee6e3]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.btn.sm[data-v-828ee6e3]{height:32px;padding-inline:12px;font-size:12.5px}.btn.xs[data-v-828ee6e3]{height:28px;padding-inline:12px;font-size:12px}.pp-empty[data-v-828ee6e3]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-828ee6e3],.pp-cards[data-v-828ee6e3]{grid-template-columns:1fr}}.pairing-panel[data-v-62d9948d]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-62d9948d]{margin:12px 0;color:var(--md-on-surface-variant)}article[data-v-62d9948d]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-62d9948d]{font-size:24px;letter-spacing:4px}button[data-v-62d9948d]{padding:8px 12px}button.danger[data-v-62d9948d]{color:var(--md-error, #b3261e);border-color:var(--md-error, #b3261e)}h4[data-v-62d9948d]{margin:18px 0 0}.connection-grid[data-v-14f725eb]{display:grid;grid-template-columns:minmax(280px,1fr) auto;gap:24px;align-items:start}@media(max-width:760px){.connection-grid[data-v-14f725eb]{grid-template-columns:1fr}}.connection-form .field[data-v-14f725eb]{margin-bottom:12px}.connection-qr[data-v-14f725eb]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-14f725eb]{background:#fff;border-radius:8px;padding:6px}.connection-link[data-v-14f725eb]{max-width:280px;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.toggle-label[data-v-14f725eb]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-b1d117f0]{max-width:920px}.sec-stack[data-v-b1d117f0]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-b1d117f0]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-b1d117f0]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-b1d117f0]{font-size:15px;font-weight:700}.sec-chip[data-v-b1d117f0]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-b1d117f0]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-b1d117f0]{margin:2px 0 12px}.sec-pin-grid[data-v-b1d117f0]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-b1d117f0]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-b1d117f0]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-b1d117f0]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-b1d117f0]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-b1d117f0]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-b1d117f0]:hover{background:var(--md-surface-container)}.page-item[data-v-b1d117f0]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-b1d117f0]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-b1d117f0]{width:44px;height:26px}.page-item .toggle-slider[data-v-b1d117f0]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-b1d117f0]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-b1d117f0]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-b1d117f0]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-b1d117f0]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-b1d117f0]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-b1d117f0]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-b1d117f0]{margin-top:12px}.sec-error[data-v-b1d117f0]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-b1d117f0]{grid-template-columns:1fr}}.mcp-panel[data-v-775007b1]{max-width:900px}.mcp-head[data-v-775007b1]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-775007b1]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-775007b1]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-775007b1]{display:flex;gap:10px}.error-banner[data-v-775007b1]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-775007b1]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-775007b1]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-775007b1]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-775007b1]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-775007b1]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-775007b1]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-775007b1]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-775007b1]{flex:1}.mcp-field>span[data-v-775007b1]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-775007b1],.mcp-field select[data-v-775007b1],.mcp-field textarea[data-v-775007b1]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-775007b1]{opacity:.7}.mcp-field textarea[data-v-775007b1]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-775007b1]:focus,.mcp-field select[data-v-775007b1]:focus,.mcp-field textarea[data-v-775007b1]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-775007b1]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-775007b1]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-775007b1]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-775007b1]{font-family:ui-monospace,monospace}.mail-grid[data-v-775007b1]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-775007b1]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-775007b1]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-775007b1]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-775007b1]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-775007b1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-775007b1]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-775007b1]:disabled{opacity:.6;cursor:not-allowed}@media(max-width:720px){.mail-grid[data-v-775007b1]{grid-template-columns:1fr}}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.models-field[data-v-b73b6842]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-b73b6842]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-b73b6842]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-b73b6842]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-b73b6842]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-b73b6842]{display:inline-flex;gap:4px}.models-actions button[data-v-b73b6842]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-b73b6842]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-b73b6842]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-b73b6842]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.usage-page[data-v-a7476de1]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-a7476de1]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-a7476de1]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-a7476de1]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-a7476de1]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-a7476de1]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-a7476de1]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-a7476de1]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .usage-page .btn[data-v-a7476de1]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-a7476de1]:disabled{opacity:.55;cursor:not-allowed}#app .usage-page .btn-tonal[data-v-a7476de1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .usage-page .btn-danger[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.overview[data-v-a7476de1]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-a7476de1]{display:grid;place-items:center}.donut[data-v-a7476de1]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-a7476de1]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-a7476de1]{fill:none;stroke-width:5}.donut-track[data-v-a7476de1]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-a7476de1]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-a7476de1]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-a7476de1]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-a7476de1]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-a7476de1]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-a7476de1]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-a7476de1]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-a7476de1]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-a7476de1]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-a7476de1]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-a7476de1]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-a7476de1]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-a7476de1]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-a7476de1]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-a7476de1]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-a7476de1]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-a7476de1]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-a7476de1]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-a7476de1]{background:var(--md-primary)}.dot.completion[data-v-a7476de1]{background:var(--md-tertiary)}.mini-stack[data-v-a7476de1]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-a7476de1]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-a7476de1]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-a7476de1]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-a7476de1]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-a7476de1]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-a7476de1]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-a7476de1]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-a7476de1]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-a7476de1]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-a7476de1]{position:absolute;inset:0}.grid span[data-v-a7476de1]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-a7476de1]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-a7476de1]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-a7476de1]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-a7476de1]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-a7476de1]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-a7476de1]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-a7476de1]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-a7476de1]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-a7476de1]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-a7476de1]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-a7476de1]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-a7476de1]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-a7476de1]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-a7476de1]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-a7476de1]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-a7476de1]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-a7476de1]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-a7476de1]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-a7476de1]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-a7476de1]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-a7476de1]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}@keyframes up-a7476de1{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-a7476de1]{grid-template-columns:1fr 1fr}.mini-stack[data-v-a7476de1]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-a7476de1],.mini-stack[data-v-a7476de1]{grid-template-columns:1fr}.chart[data-v-a7476de1]{height:200px;padding-left:34px}.grid span i[data-v-a7476de1]{left:-34px;width:28px}.axis span[data-v-a7476de1]{font-size:11px}}\n";document.head.appendChild(s)}})();
