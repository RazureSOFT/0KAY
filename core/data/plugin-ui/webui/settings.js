var Ge = Object.defineProperty;
var Xe = (z, s, y) => s in z ? Ge(z, s, { enumerable: !0, configurable: !0, writable: !0, value: y }) : z[s] = y;
var H = (z, s, y) => Xe(z, typeof s != "symbol" ? s + "" : s, y);
import { defineComponent as ee, reactive as Ze, ref as M, onMounted as ie, openBlock as a, createElementBlock as u, createElementVNode as e, createTextVNode as G, toDisplayString as n, withDirectives as V, vModelCheckbox as te, vModelText as D, Fragment as K, renderList as q, normalizeClass as J, createCommentVNode as U, computed as W, onUnmounted as Te, unref as l, withKeys as Qe, createStaticVNode as et, createVNode as Q, vModelDynamic as tt, watch as He, vModelSelect as st, shallowRef as Oe, createBlock as le, resolveDynamicComponent as lt, withModifiers as Le } from "vue";
import { useRouter as je, useRoute as ot } from "vue-router";
import { useI18n as re } from "vue-i18n";
import { apiGet as pe, apiPost as Ce, ApiError as Ye, useConfirm as Ne, useProvidersStore as nt, PROVIDERS as Ee, AppSelect as de, getLanguage as at, LOCALES as it, setLanguage as rt, useWizardStore as Ve, useSettingsMeta as Ie, useUIPatchesStore as Je, PinInput as ze, useSettingsSectionsStore as ut, DEFAULT_LIVE2D_MODELS as dt } from "@0kay/host";
import { L as ct } from "./assets/Live2DStage-w9T1h3vJ.js";
import { _ as ue } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
const pt = { class: "life-settings" }, vt = { class: "ls-hero" }, ht = ["disabled"], mt = { class: "ls-grid" }, _t = { class: "ls-card" }, gt = { class: "ls-switch" }, bt = { class: "ls-switch" }, yt = { class: "ls-field" }, ft = { class: "ls-card" }, kt = { class: "ls-note" }, wt = { class: "ls-models" }, $t = ["onClick"], Ct = {
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
    }), y = M(""), g = M(!1), $ = M(!1), w = M([]), p = M(""), k = M([]);
    async function P() {
      try {
        const [r, t] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (r.ok && (Object.assign(s, (await r.json()).values || {}), $.value = !0), t.ok) {
          const o = await t.json();
          k.value = Array.isArray(o.models) ? o.models.map((c) => ({ id: c.id, provider: c.provider || "custom", supports_thinking: c.supports_thinking })).filter((c) => c.id) : [], w.value = k.value.map((c) => c.id), p.value = "mocr 当前模型目录（由 Core 同步）";
        }
      } catch {
        y.value = "无法读取 LIFE 设置或模型目录";
      }
    }
    async function d() {
      if (!$.value) {
        y.value = "设置尚未加载，已阻止保存以避免写回默认值";
        return;
      }
      g.value = !0, y.value = "";
      try {
        const r = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: s }) });
        if (!r.ok) throw new Error(String(r.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: s.screen_watch, computer_use: s.computer_use, report_agent_host: s.report_agent_host }) }), y.value = "已保存，LIFE 会在下一次设置轮询时应用。";
      } catch {
        y.value = "保存失败";
      } finally {
        g.value = !1;
      }
    }
    return ie(P), (r, t) => (a(), u("section", pt, [
      e("header", vt, [
        t[15] || (t[15] = e("div", { class: "ls-hero-main" }, [
          e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS"),
          e("h2", null, "L.I.F.E 专属设置"),
          e("p", { class: "ls-sub" }, "敏感功能默认关闭；凭据仅保存在本机 Core settings 文件。")
        ], -1)),
        e("button", {
          class: "ls-save",
          disabled: g.value,
          onClick: d
        }, [
          t[14] || (t[14] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          G(n(g.value ? "保存中…" : "保存"), 1)
        ], 8, ht)
      ]),
      e("div", mt, [
        e("article", _t, [
          t[21] || (t[21] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-1" }, "◉"),
            e("h3", null, "Agent 主机权限")
          ], -1)),
          e("label", gt, [
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
              [D, s.report_agent_host]
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
            (a(!0), u(K, null, q(k.value, (o) => (a(), u("button", {
              key: "think-" + o.id,
              type: "button",
              class: J(["ls-model", { selected: s.think_model === o.id }]),
              onClick: (c) => s.think_model = o.id
            }, [
              e("b", null, n(o.id), 1),
              e("span", null, n(o.provider) + " · " + n(o.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, $t))), 128)),
            k.value.length ? U("", !0) : (a(), u("span", Ct, "暂无模型"))
          ]),
          t[24] || (t[24] = e("p", { class: "ls-label" }, "OUTPUT · 最终人格化回复", -1)),
          e("div", St, [
            (a(!0), u(K, null, q(k.value, (o) => (a(), u("button", {
              key: "output-" + o.id,
              type: "button",
              class: J(["ls-model", { selected: s.output_model === o.id }]),
              onClick: (c) => s.output_model = o.id
            }, [
              e("b", null, n(o.id), 1),
              e("span", null, n(o.provider) + " · output", 1)
            ], 10, Pt))), 128)),
            k.value.length ? U("", !0) : (a(), u("span", xt, "暂无模型"))
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
                [D, s.onebot_ws_url]
              ])
            ]),
            e("label", zt, [
              t[39] || (t[39] = e("span", null, "HTTP API 地址", -1)),
              V(e("input", {
                "onUpdate:modelValue": t[9] || (t[9] = (o) => s.onebot_http_url = o),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [D, s.onebot_http_url]
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
                [D, s.onebot_access_token]
              ])
            ]),
            e("label", Bt, [
              t[41] || (t[41] = e("span", null, "触发关键词（逗号分隔，留空=全部）", -1)),
              V(e("input", {
                "onUpdate:modelValue": t[11] || (t[11] = (o) => s.onebot_trigger_keywords = o),
                placeholder: "bot,在吗"
              }, null, 512), [
                [D, s.onebot_trigger_keywords]
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
                  D,
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
                  D,
                  s.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ])
      ]),
      y.value ? (a(), u("p", Yt, n(y.value), 1)) : U("", !0)
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
}, ds = { class: "us-hero-text" }, cs = { key: 0 }, ps = { key: 1 }, vs = { class: "us-hero-actions" }, hs = ["disabled"], ms = ["disabled", "title"], _s = ["href"], gs = {
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
    const { t: s } = re(), y = M("0.1.2"), g = M([]), $ = M(""), w = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, p = (A, N = 96) => `https://github.com/${A}.png?size=${N}`, k = M(!1), P = M(null), d = M(""), r = M(null), t = M("");
    let o = null;
    function c(A) {
      return r.value?.status === "running" && r.value.plugin === A;
    }
    async function m(A, N) {
      if (r.value?.status !== "running") {
        t.value = "";
        try {
          r.value = await Ce("/api/plugins/pm/update", { plugin: A, version: N || "" }), C();
        } catch (j) {
          t.value = j instanceof Error ? j.message : String(j);
        }
      }
    }
    async function _() {
      try {
        r.value = await pe("/api/plugins/pm/status");
      } catch {
        return;
      }
      r.value && r.value.status !== "running" && (v(), E());
    }
    function C() {
      o || (o = setInterval(_, 2e3));
    }
    function v() {
      o && (clearInterval(o), o = null);
    }
    const I = W(() => {
      switch (r.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), R = W(() => P.value ? P.value.has_update ? "warn" : P.value.latest ? "ok" : "none" : "none");
    async function E() {
      k.value = !0, d.value = "";
      try {
        const A = await pe("/api/plugins/pm/check");
        P.value = A, A?.current && (y.value = String(A.current));
      } catch (A) {
        d.value = A instanceof Ye && A.status === 404 ? s("settings.about.unsupported") : A instanceof Error ? A.message : String(A);
      } finally {
        k.value = !1;
      }
    }
    async function x() {
      try {
        const A = { Accept: "application/vnd.github+json" }, [N, j] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: A }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: A })
        ]);
        if (!N.ok) throw new Error(`HTTP ${N.status}`);
        const X = /* @__PURE__ */ new Map(), F = await N.json();
        for (const L of Array.isArray(F) ? F : [])
          L?.login && X.set(L.login, L);
        if (j.ok) {
          const L = await j.json();
          for (const B of Array.isArray(L) ? L : []) {
            const O = B?.author;
            !O?.login || O.login.endsWith("[bot]") || X.has(O.login) || X.set(O.login, {
              login: O.login,
              avatar_url: O.avatar_url,
              html_url: O.html_url,
              contributions: 0
            });
          }
        }
        g.value = [...X.values()].sort(
          (L, B) => (B.contributions || 0) - (L.contributions || 0) || L.login.localeCompare(B.login)
        );
      } catch (A) {
        $.value = A instanceof Error ? A.message : String(A), g.value = [];
      }
    }
    return ie(() => {
      E(), x(), pe("/api/plugins/pm/status").then((A) => {
        r.value = A, A?.status === "running" && C();
      }).catch(() => {
      });
    }), Te(v), (A, N) => (a(), u("div", qt, [
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
            disabled: k.value,
            onClick: E
          }, n(l(s)(k.value ? "settings.about.checking" : "settings.about.check")), 9, os)
        ]),
        d.value ? (a(), u("p", ns, n(d.value), 1)) : (a(), u("div", {
          key: 1,
          class: J(["us-hero", R.value])
        }, [
          e("div", as, [
            R.value === "ok" ? (a(), u("svg", is, [...N[5] || (N[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : R.value === "warn" ? (a(), u("svg", rs, [...N[6] || (N[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (a(), u("svg", us, [...N[7] || (N[7] = [
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
            P.value?.latest ? (a(), u("span", cs, [
              G("v" + n(P.value.current) + " → ", 1),
              e("em", null, "v" + n(P.value.latest), 1)
            ])) : (a(), u("span", ps, "0KAY v" + n(P.value?.current || y.value), 1))
          ]),
          e("div", vs, [
            P.value?.has_update ? (a(), u("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: c("core"),
              onClick: N[0] || (N[0] = (j) => m("core", P.value.latest))
            }, n(c("core") ? l(s)("settings.about.updating") : l(s)("settings.about.updateNow")), 9, hs)) : U("", !0),
            P.value?.source_available !== !1 ? (a(), u("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: c("core"),
              title: l(s)("settings.about.betaHint"),
              onClick: N[1] || (N[1] = (j) => m("core"))
            }, n(c("core") ? l(s)("settings.about.updating") : l(s)("settings.about.beta")), 9, ms)) : U("", !0),
            P.value?.url ? (a(), u("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: P.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, _s)) : U("", !0)
          ])
        ], 2)),
        P.value?.notes ? (a(), u("div", gs, [
          e("p", bs, n(l(s)("settings.about.whatsNew")), 1),
          e("pre", ys, n(P.value.notes), 1)
        ])) : U("", !0),
        t.value ? (a(), u("p", fs, n(t.value), 1)) : U("", !0),
        r.value && r.value.status !== "idle" ? (a(), u("div", {
          key: 4,
          class: J(["us-apply-banner", r.value.status])
        }, [
          e("div", ks, [
            N[8] || (N[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              G(n(r.value.package), 1),
              r.value.version ? (a(), u("span", ws, "@" + n(r.value.version), 1)) : (a(), u("span", $s, " · main"))
            ]),
            r.value.mode === "source" ? (a(), u("span", Cs, n(l(s)("settings.about.sourceMode")), 1)) : U("", !0),
            e("span", Ss, n(I.value), 1)
          ]),
          r.value.error ? (a(), u("p", Ps, n(r.value.error), 1)) : U("", !0),
          r.value.log ? (a(), u("pre", xs, n(r.value.log), 1)) : U("", !0)
        ], 2)) : U("", !0)
      ]),
      e("section", Ms, [
        e("h3", Us, n(l(s)("settings.about.developerTitle")) + " & " + n(l(s)("settings.about.teamTitle")), 1),
        e("div", Es, [
          e("a", {
            class: "person",
            href: w.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: w.avatar,
              alt: w.login,
              loading: "lazy"
            }, null, 8, Ts),
            e("div", Ns, [
              e("span", Vs, n(w.login), 1),
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
        g.value.length ? (a(), u("div", Bs, [
          (a(!0), u(K, null, q(g.value, (j) => (a(), u("a", {
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
            j.contributions ? (a(), u("span", Ys, n(j.contributions), 1)) : U("", !0)
          ], 8, Ks))), 128))
        ])) : (a(), u("p", Js, [
          e("a", {
            class: "repo-link",
            href: w.url,
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
}), Qs = /* @__PURE__ */ ue(Zs, [["__scopeId", "data-v-f0cbac94"]]), el = { class: "content-card updates" }, tl = { class: "us-block" }, sl = { class: "us-head" }, ll = { class: "us-head-text" }, ol = { class: "us-title" }, nl = { class: "us-desc" }, al = { class: "us-source" }, il = { class: "us-input-group" }, rl = ["disabled", "placeholder"], ul = ["disabled"], dl = { class: "us-chips" }, cl = ["disabled"], pl = ["disabled"], vl = {
  key: 0,
  class: "us-saved"
}, hl = { class: "helper-text" }, ml = {
  key: 0,
  class: "alert"
}, _l = { class: "us-block" }, gl = { class: "us-head" }, bl = { class: "us-head-text" }, yl = { class: "us-title" }, fl = { class: "us-desc" }, kl = { class: "us-head-actions" }, wl = ["disabled"], $l = {
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
    const { t: s } = re(), y = M(!1), g = M(null), $ = M(""), w = M(null), p = M("");
    let k = null;
    const P = M(""), d = M(""), r = M(!1), t = M(!1), o = M(!1), c = M(""), m = W(() => P.value.trim() !== d.value), _ = W(() => P.value.trim() !== "");
    function C(L) {
      return w.value?.status === "running" && w.value.plugin === L;
    }
    async function v(L, B) {
      if (w.value?.status !== "running") {
        p.value = "";
        try {
          w.value = await Ce("/api/plugins/pm/update", { plugin: L, version: B || "" }), R();
        } catch (O) {
          p.value = O instanceof Error ? O.message : String(O);
        }
      }
    }
    async function I() {
      try {
        w.value = await pe("/api/plugins/pm/status");
      } catch {
        return;
      }
      w.value && w.value.status !== "running" && (E(), N());
    }
    function R() {
      k || (k = setInterval(I, 2e3));
    }
    function E() {
      k && (clearInterval(k), k = null);
    }
    const x = W(() => {
      switch (w.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), A = W(() => (g.value || []).filter((L) => L.has_update).length);
    async function N() {
      y.value = !0, $.value = "";
      try {
        const L = await pe("/api/plugins/pm/check-plugins");
        g.value = L.plugins || [];
      } catch (L) {
        $.value = L instanceof Ye && L.status === 404 ? s("settings.about.unsupported") : L instanceof Error ? L.message : String(L);
      } finally {
        y.value = !1;
      }
    }
    async function j() {
      r.value = !0, c.value = "";
      try {
        const L = await pe("/api/settings/updates"), B = String(L?.values?.github_proxy ?? "");
        P.value = B, d.value = B;
      } catch {
      } finally {
        r.value = !1;
      }
    }
    async function X() {
      t.value = !0, c.value = "";
      try {
        const L = P.value.trim();
        await Ce("/api/settings/updates", { values: { github_proxy: L } }), d.value = L, o.value = !0, setTimeout(() => {
          o.value = !1;
        }, 1500);
      } catch (L) {
        c.value = L instanceof Error ? L.message : String(L);
      } finally {
        t.value = !1;
      }
    }
    function F(L) {
      P.value = L, X();
    }
    return ie(() => {
      N(), j(), pe("/api/plugins/pm/status").then((L) => {
        w.value = L, L?.status === "running" && R();
      }).catch(() => {
      });
    }), Te(E), (L, B) => (a(), u("div", el, [
      e("section", tl, [
        e("header", sl, [
          B[3] || (B[3] = e("span", {
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
            class: J(["us-tag", { on: _.value }])
          }, n(_.value ? "ghproxy" : l(s)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", al, [
          e("div", il, [
            B[4] || (B[4] = e("span", {
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
              "onUpdate:modelValue": B[0] || (B[0] = (O) => P.value = O),
              class: "us-input",
              type: "text",
              disabled: r.value,
              placeholder: l(s)("settings.pluginSourcePlaceholder"),
              onKeyup: Qe(X, ["enter"])
            }, null, 40, rl), [
              [D, P.value]
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
              class: J(["us-chip", { active: !_.value }]),
              disabled: t.value,
              onClick: B[1] || (B[1] = (O) => F(""))
            }, n(l(s)("settings.pluginSourceDirect")), 11, cl),
            e("button", {
              type: "button",
              class: J(["us-chip", { active: P.value.trim() === "https://gh-proxy.com" }]),
              disabled: t.value,
              onClick: B[2] || (B[2] = (O) => F("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, pl),
            o.value ? (a(), u("span", vl, n(l(s)("settings.saved")), 1)) : U("", !0)
          ]),
          e("p", hl, n(l(s)("settings.pluginSourceHelp")), 1),
          c.value ? (a(), u("p", ml, n(c.value), 1)) : U("", !0)
        ])
      ]),
      B[10] || (B[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", _l, [
        e("header", gl, [
          B[5] || (B[5] = et('<span class="us-ico" aria-hidden="true" data-v-6bbe694b><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-6bbe694b><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect></svg></span>', 1)),
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
        p.value ? (a(), u("p", $l, n(p.value), 1)) : U("", !0),
        w.value && w.value.status !== "idle" ? (a(), u("div", {
          key: 1,
          class: J(["us-apply-banner", w.value.status])
        }, [
          e("div", Cl, [
            B[6] || (B[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              G(n(w.value.package), 1),
              w.value.version ? (a(), u("span", Sl, "@" + n(w.value.version), 1)) : (a(), u("span", Pl, " · main"))
            ]),
            w.value.mode === "source" ? (a(), u("span", xl, n(l(s)("settings.about.sourceMode")), 1)) : U("", !0),
            e("span", Ml, n(x.value), 1)
          ]),
          w.value.error ? (a(), u("p", Ul, n(w.value.error), 1)) : U("", !0),
          w.value.log ? (a(), u("pre", El, n(w.value.log), 1)) : U("", !0)
        ], 2)) : U("", !0),
        $.value ? (a(), u("p", Al, n($.value), 1)) : U("", !0),
        g.value ? (a(), u("div", Tl, [
          B[8] || (B[8] = e("div", { class: "us-row us-thead" }, [
            e("span", null, "Plugin"),
            e("span", null, "Version"),
            e("span", null, "Status"),
            e("span")
          ], -1)),
          (a(!0), u(K, null, q(g.value, (O) => (a(), u("div", {
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
              B[7] || (B[7] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: J({ good: !!O.latest })
              }, n(O.latest ? `v${O.latest}` : "—"), 3)
            ]),
            e("span", {
              class: J(["us-status", O.error ? "bad" : O.has_update ? "warn" : O.latest ? "ok" : ""])
            }, n(O.error || l(s)(O.has_update ? "settings.about.available" : O.latest ? "settings.about.latest" : "settings.about.noRelease")), 3),
            e("span", Il, [
              O.can_update && O.has_update ? (a(), u("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: C(O.name),
                onClick: (ne) => v(O.name, O.latest)
              }, n(C(O.name) ? l(s)("settings.about.updating") : l(s)("settings.about.updateNow")), 9, Rl)) : O.can_update ? (a(), u("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: C(O.name),
                onClick: (ne) => v(O.name)
              }, n(C(O.name) ? l(s)("settings.about.updating") : l(s)("settings.about.syncNow")), 9, Ol)) : U("", !0),
              O.repository ? (a(), u("a", {
                key: 2,
                class: "us-repo",
                href: O.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: O.repository
              }, "Repo ↗", 8, Ll)) : U("", !0)
            ])
          ]))), 128)),
          g.value.length ? U("", !0) : (a(), u("p", zl, n(l(s)("settings.about.noPlugins")), 1))
        ])) : U("", !0),
        B[9] || (B[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), Fl = /* @__PURE__ */ ue(Dl, [["__scopeId", "data-v-6bbe694b"]]), Bl = { class: "content-card provider-panel" }, Kl = { class: "pp-editor-head" }, Hl = ["aria-label"], jl = { class: "pp-editor-title" }, Yl = { class: "card-desc" }, Jl = { class: "pp-section" }, Wl = { class: "pp-section-title" }, ql = { class: "pp-grid" }, Gl = { class: "field" }, Xl = { class: "field" }, Zl = {
  key: 0,
  class: "pp-req"
}, Ql = ["placeholder"], eo = { class: "field pp-span" }, to = ["placeholder"], so = { class: "field" }, lo = { class: "helper-text" }, oo = { class: "field" }, no = { class: "helper-text" }, ao = { class: "pp-section" }, io = { class: "pp-section-head" }, ro = { class: "pp-section-title" }, uo = ["disabled"], co = { class: "field" }, po = { class: "pp-key" }, vo = ["type", "placeholder"], ho = {
  key: 0,
  class: "helper-text"
}, mo = {
  key: 1,
  class: "pp-probe err"
}, _o = {
  key: 2,
  class: "pp-probe ok"
}, go = { class: "pp-section" }, bo = { class: "pp-section-head" }, yo = { class: "pp-section-title" }, fo = { class: "pp-count" }, ko = ["disabled"], wo = {
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
    const { t: s } = re(), { confirm: y } = Ne(), g = nt(), $ = M({}), w = M("list"), p = M(null), k = M(""), P = M({ state: "idle" }), d = M([]), r = M(""), t = M(!1), o = M(!1), c = M(!1);
    ie(async () => {
      await g.fetchAll();
      for (const b of g.providers) j(b);
    });
    function m(b) {
      return Ee.find((S) => S.id === b) || null;
    }
    function _(b) {
      return b.name && b.name.trim() ? b.name.trim() : m(b.provider)?.name || b.provider;
    }
    function C(b) {
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
    function R(b, S) {
      if (!p.value) return;
      const h = { ...p.value.model_types || {} };
      !S || S === "chat" ? delete h[b] : h[b] = S, p.value.model_types = h;
    }
    function E(b) {
      const S = new Set(b.disabled_models || []);
      return b.models.filter((h) => !S.has(h));
    }
    function x(b) {
      return g.defaultProviderId === b.id;
    }
    function A(b) {
      const S = p.value;
      if (!S) return;
      const h = Ee.find((f) => f.id === b);
      h?.baseUrl && !S.base_url && (S.base_url = h.baseUrl), S.format = h?.format || "";
    }
    async function N(b, S = "") {
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
            api_key: S || ""
          })
        });
        if (!f.ok) throw new Error(`HTTP ${f.status}`);
        const i = await f.json(), T = Math.round(performance.now() - h);
        return i.source === "api" && Array.isArray(i.models) && i.models.length ? { state: "ok", count: i.models.length, ms: T, models: i.models } : { state: "error", message: i.error || s("settings.connectionFailed"), ms: T };
      } catch (f) {
        return { state: "error", message: f instanceof Error ? f.message : String(f) };
      }
    }
    async function j(b, S = "") {
      $.value = { ...$.value, [b.id]: { state: "checking" } };
      const h = await N(b, S);
      $.value = { ...$.value, [b.id]: h };
    }
    function X() {
      for (const b of g.providers) j(b);
    }
    function F() {
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
      }, k.value = "", P.value = { state: "idle" }, d.value = [], r.value = "", t.value = !1, o.value = !1, w.value = "edit";
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
      }, o.value = !!b.api_key_masked, k.value = "", P.value = { state: "idle" }, d.value = [], r.value = "", t.value = !1, w.value = "edit";
    }
    function B() {
      w.value = "list", p.value = null, k.value = "";
    }
    async function O() {
      const b = p.value;
      if (!b) return;
      k.value = "";
      const S = (b.name || "").trim();
      if (!b.base_url.trim()) {
        k.value = s("settings.baseUrlRequired");
        return;
      }
      if (b.provider === "custom" && !S) {
        k.value = s("settings.providerNameRequired");
        return;
      }
      if (!b.models.length) {
        k.value = s("settings.modelsRequired");
        return;
      }
      b.id || (b.id = `${b.provider}_${Date.now().toString(36)}`), b.name = S, b.disabled_models = (b.disabled_models || []).filter((h) => b.models.includes(h)), (!b.default_model || !b.models.includes(b.default_model) || b.disabled_models.includes(b.default_model)) && (b.default_model = E(b)[0] || b.models[0]), c.value = !0;
      try {
        await g.upsert({ ...b }), g.defaultProviderId || await g.setDefaults(b.id, b.default_model), B(), j(g.providers.find((h) => h.id === b.id) || b);
      } catch (h) {
        k.value = h instanceof Error ? h.message : String(h);
      } finally {
        c.value = !1;
      }
    }
    async function ne(b) {
      if (await y({
        title: s("settings.remove"),
        message: `${s("settings.remove")} ${_(b)}?`,
        confirmLabel: s("settings.remove"),
        danger: !0
      }))
        try {
          await g.remove(b.id);
        } catch {
        }
    }
    async function he(b) {
      try {
        await g.upsert({ ...b, enabled: !b.enabled });
      } catch {
      }
    }
    async function Z(b) {
      const S = b.default_model || E(b)[0] || b.models[0] || "";
      try {
        await g.setDefaults(b.id, S);
      } catch {
      }
    }
    async function me() {
      const b = p.value;
      if (!b) return;
      P.value = { state: "checking" };
      const S = await N(b, b.api_key);
      P.value = S, S.state === "ok" && S.models && (d.value = S.models);
    }
    function be() {
      const b = p.value;
      !b || !d.value.length || (b.models = [...d.value], b.disabled_models = (b.disabled_models || []).filter((S) => b.models.includes(S)), b.models.includes(b.default_model) || (b.default_model = ""));
    }
    function ke(b) {
      const S = p.value;
      if (!S) return;
      const h = new Set(S.disabled_models || []);
      h.has(b) ? h.delete(b) : h.add(b), S.disabled_models = [...h], h.has(S.default_model) && (S.default_model = E(S)[0] || "");
    }
    function Pe(b) {
      const S = p.value;
      S && (S.default_model = b, S.disabled_models = (S.disabled_models || []).filter((h) => h !== b));
    }
    function we(b) {
      const S = p.value;
      S && (S.disabled_models = b ? [] : [...S.models]);
    }
    function $e() {
      const b = p.value;
      if (!b) return;
      const S = new Set(b.disabled_models || []);
      b.disabled_models = b.models.filter((h) => !S.has(h));
    }
    const ye = W(() => {
      const b = p.value?.models || [], S = r.value.trim().toLowerCase();
      return S ? b.filter((h) => h.toLowerCase().includes(S)) : b;
    }), xe = W(() => p.value ? E(p.value).length : 0);
    function ce() {
      return s("settings.fetchedSummary", { n: d.value.length });
    }
    const Me = W(() => [
      { value: "", label: s("settings.formatAuto") },
      { value: "openai", label: s("settings.formatOpenai") },
      { value: "anthropic", label: s("settings.formatAnthropic") }
    ]), Ue = W(
      () => Ee.map((b) => ({ value: b.id, label: s(`providers.${b.id}.name`, b.name) }))
    );
    return (b, S) => (a(), u("div", Bl, [
      w.value === "edit" && p.value ? (a(), u(K, { key: 0 }, [
        e("div", Kl, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: B,
            "aria-label": l(s)("settings.back")
          }, [...S[11] || (S[11] = [
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
            class: J(["pp-status", P.value.state])
          }, [
            S[12] || (S[12] = e("span", { class: "pp-dot" }, null, -1)),
            G(" " + n(P.value.state === "checking" ? l(s)("settings.testing") : P.value.state === "ok" ? l(s)("settings.connectionOk") : P.value.state === "error" ? l(s)("settings.connectionFailed") : l(s)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", Jl, [
          e("h3", Wl, n(l(s)("settings.providerSectionBasic")), 1),
          e("div", ql, [
            e("div", Gl, [
              e("label", null, n(l(s)("wizard.provider")), 1),
              Q(l(de), {
                modelValue: p.value.provider,
                "onUpdate:modelValue": S[0] || (S[0] = (h) => p.value.provider = h),
                class: "input",
                "aria-label": l(s)("wizard.provider"),
                options: Ue.value,
                onChange: A
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", Xl, [
              e("label", null, [
                G(n(l(s)("settings.providerName")) + " ", 1),
                p.value.provider === "custom" ? (a(), u("span", Zl, "*")) : U("", !0)
              ]),
              V(e("input", {
                "onUpdate:modelValue": S[1] || (S[1] = (h) => p.value.name = h),
                placeholder: l(s)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, Ql), [
                [D, p.value.name]
              ])
            ]),
            e("div", eo, [
              e("label", null, n(l(s)("wizard.baseUrl")), 1),
              V(e("input", {
                "onUpdate:modelValue": S[2] || (S[2] = (h) => p.value.base_url = h),
                placeholder: l(s)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, to), [
                [D, p.value.base_url]
              ])
            ]),
            e("div", so, [
              e("label", null, n(l(s)("settings.apiFormat")), 1),
              Q(l(de), {
                modelValue: p.value.format,
                "onUpdate:modelValue": S[3] || (S[3] = (h) => p.value.format = h),
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
                "onUpdate:modelValue": S[4] || (S[4] = (h) => p.value.default_model = h),
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
              disabled: P.value.state === "checking",
              onClick: me
            }, n(P.value.state === "checking" ? l(s)("settings.testing") : l(s)("settings.testConnection")), 9, uo)
          ]),
          e("div", co, [
            e("label", null, n(l(s)("wizard.apiKey")), 1),
            e("div", po, [
              V(e("input", {
                "onUpdate:modelValue": S[5] || (S[5] = (h) => p.value.api_key = h),
                type: t.value ? "text" : "password",
                placeholder: o.value ? l(s)("settings.apiKeyKept") : l(s)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, vo), [
                [tt, p.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: S[6] || (S[6] = (h) => t.value = !t.value)
              }, n(t.value ? l(s)("settings.hideKey") : l(s)("settings.showKey")), 1)
            ]),
            o.value ? (a(), u("p", ho, n(l(s)("settings.apiKeyKeptHint")), 1)) : U("", !0),
            P.value.state === "error" ? (a(), u("p", mo, n(P.value.message), 1)) : P.value.state === "ok" ? (a(), u("p", _o, n(l(s)("settings.connectionOk")) + " · " + n(ce()) + " · " + n(P.value.ms) + "ms ", 1)) : U("", !0)
          ])
        ]),
        e("section", go, [
          e("div", bo, [
            e("h3", yo, [
              G(n(l(s)("settings.providerSectionModels")) + " ", 1),
              e("span", fo, n(xe.value) + "/" + n(p.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: P.value.state === "checking",
              onClick: me
            }, n(l(s)("settings.fetchModels")), 9, ko)
          ]),
          d.value.length && d.value.join("\0") !== p.value.models.join("\0") ? (a(), u("div", wo, [
            e("span", null, n(ce()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: be
            }, n(l(s)("settings.applyFetched")), 1)
          ])) : U("", !0),
          e("div", $o, [
            V(e("input", {
              "onUpdate:modelValue": S[7] || (S[7] = (h) => r.value = h),
              class: "input pp-search",
              placeholder: l(s)("settings.searchModels")
            }, null, 8, Co), [
              [D, r.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: S[8] || (S[8] = (h) => we(!0))
            }, n(l(s)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: S[9] || (S[9] = (h) => $e())
            }, n(l(s)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: S[10] || (S[10] = (h) => we(!1))
            }, n(l(s)("settings.clearSelection")), 1)
          ]),
          p.value.models.length ? (a(), u("div", So, [
            (a(!0), u(K, null, q(ye.value, (h) => (a(), u("div", {
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
                (a(), u(K, null, q(v, (f) => e("option", {
                  key: f.value,
                  value: f.value
                }, n(f.label), 9, Mo)), 64))
              ], 42, xo),
              p.value.default_model !== h ? (a(), u("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: l(s)("settings.makeDefault"),
                disabled: (p.value.disabled_models || []).includes(h),
                onClick: (f) => Pe(h)
              }, "☆", 8, Uo)) : (a(), u("span", {
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
            ye.value.length ? U("", !0) : (a(), u("p", To, n(l(s)("settings.searchModels")), 1))
          ])) : (a(), u("p", No, n(l(s)("settings.noModelsYet")), 1))
        ]),
        k.value ? (a(), u("p", Vo, n(k.value), 1)) : U("", !0),
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
            onClick: B
          }, n(l(s)("settings.cancel")), 1)
        ])
      ], 64)) : (a(), u(K, { key: 1 }, [
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
              onClick: F
            }, "+ " + n(l(s)("settings.addProvider")), 1)
          ])
        ]),
        l(g).providers.length ? (a(), u("div", Do, [
          (a(!0), u(K, null, q(l(g).providers, (h) => (a(), u("article", {
            key: h.id,
            class: J(["pp-card", { off: !h.enabled, default: x(h) }])
          }, [
            e("header", Fo, [
              e("span", Bo, [
                C(h) ? (a(), u("img", {
                  key: 0,
                  src: C(h),
                  alt: _(h)
                }, null, 8, Ko)) : (a(), u("svg", Ho, [...S[13] || (S[13] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", jo, [
                e("strong", null, n(_(h)), 1),
                e("code", {
                  title: h.base_url
                }, n(h.base_url || "—"), 9, Yo)
              ]),
              e("div", Jo, [
                x(h) ? (a(), u("span", Wo, n(l(s)("settings.default")), 1)) : U("", !0),
                e("span", qo, n(E(h).length) + "/" + n(h.models.length), 1)
              ])
            ]),
            e("div", Go, [
              e("span", {
                class: J(["pp-status", $.value[h.id]?.state || "idle"])
              }, [
                S[14] || (S[14] = e("span", { class: "pp-dot" }, null, -1)),
                G(" " + n($.value[h.id]?.state === "checking" ? l(s)("settings.testing") : $.value[h.id]?.state === "ok" ? l(s)("settings.connectionOk") : $.value[h.id]?.state === "error" ? l(s)("settings.connectionFailed") : l(s)("settings.statusIdle")), 1)
              ], 2),
              $.value[h.id]?.state === "ok" ? (a(), u("span", Xo, n(l(s)("settings.fetchedSummary", { n: $.value[h.id]?.count || 0 })) + " · " + n($.value[h.id]?.ms) + "ms", 1)) : $.value[h.id]?.state === "error" ? (a(), u("span", {
                key: 1,
                class: "pp-meta err",
                title: $.value[h.id]?.message
              }, n($.value[h.id]?.message), 9, Zo)) : U("", !0)
            ]),
            e("div", Qo, [
              (a(!0), u(K, null, q(E(h).slice(0, 6), (f) => (a(), u("span", {
                key: f,
                class: "pp-chip"
              }, n(f), 1))), 128)),
              E(h).length > 6 ? (a(), u("span", en, "+" + n(E(h).length - 6), 1)) : U("", !0),
              h.models.length ? U("", !0) : (a(), u("span", tn, n(l(s)("settings.noModelsYet")), 1))
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
                disabled: $.value[h.id]?.state === "checking",
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
        ])) : (a(), u("div", un, [
          e("p", null, n(l(s)("settings.noProviders")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: F
          }, "+ " + n(l(s)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), cn = /* @__PURE__ */ ue(dn, [["__scopeId", "data-v-828ee6e3"]]), pn = { class: "pairing-panel" }, vn = { key: 0 }, hn = { key: 1 }, mn = { key: 0 }, _n = ["onClick"], gn = ["onClick"], bn = /* @__PURE__ */ ee({
  __name: "PairingPanel",
  setup(z) {
    const s = M([]), y = M("");
    let g;
    async function $() {
      try {
        const p = await fetch("/api/pairing/pending");
        if (!p.ok) throw new Error(await p.text());
        s.value = (await p.json()).requests || [];
      } catch (p) {
        y.value = p.message;
      }
    }
    async function w(p, k) {
      try {
        const P = await fetch("/api/pairing/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, allow: k }) });
        if (!P.ok) throw new Error(await P.text());
        await $();
      } catch (P) {
        y.value = P.message;
      }
    }
    return ie(() => {
      $(), g = setInterval($, 3e3);
    }), Te(() => clearInterval(g)), (p, k) => (a(), u("section", pn, [
      k[0] || (k[0] = e("h3", null, "设备配对", -1)),
      k[1] || (k[1] = e("p", null, "在 Core 所在电脑核对安装终端显示的 6 位代码，再允许连接。局域网发现需启用 CORE_LAN_ENABLED=1。", -1)),
      y.value ? (a(), u("p", vn, n(y.value), 1)) : U("", !0),
      s.value.length ? U("", !0) : (a(), u("p", hn, "暂无待配对设备")),
      (a(!0), u(K, null, q(s.value, (P) => (a(), u("article", {
        key: P.id
      }, [
        e("strong", null, n(P.name), 1),
        e("code", null, n(P.code), 1),
        P.approved ? (a(), u("span", mn, "已允许，等待客户端领取")) : (a(), u(K, { key: 1 }, [
          e("button", {
            onClick: (d) => w(P, !1)
          }, "拒绝", 8, _n),
          e("button", {
            onClick: (d) => w(P, !0)
          }, "核对代码并允许配对", 8, gn)
        ], 64))
      ]))), 128))
    ]));
  }
}), yn = /* @__PURE__ */ ue(bn, [["__scopeId", "data-v-0559b1b2"]]), fn = { class: "content-card" }, kn = { class: "card-desc" }, wn = { class: "field" }, $n = { class: "segmented" }, Cn = ["onClick"], Sn = /* @__PURE__ */ ee({
  __name: "GeneralPanel",
  setup(z) {
    const { t: s } = re(), y = M(at());
    function g($) {
      y.value = $, rt($);
    }
    return ($, w) => (a(), u("div", fn, [
      Q(yn),
      e("h2", null, n(l(s)("settings.tabs.general")), 1),
      e("p", kn, n(l(s)("settings.generalDesc")), 1),
      e("div", wn, [
        e("label", null, n(l(s)("settings.language")), 1),
        e("div", $n, [
          (a(!0), u(K, null, q(l(it), (p) => (a(), u("button", {
            key: p.code,
            class: J(["seg", { active: y.value === p.code }]),
            onClick: (k) => g(p.code)
          }, n(p.label), 11, Cn))), 128))
        ])
      ])
    ]));
  }
});
var _e;
((z) => {
  const p = class p {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code with the given version number,
    // error correction level, data codeword bytes, and mask number.
    // This is a low-level API that most users should not use directly.
    // A mid-level API is the encodeSegments() function.
    constructor(d, r, t, o) {
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
      if (this.version = d, this.errorCorrectionLevel = r, d < p.MIN_VERSION || d > p.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (o < -1 || o > 7)
        throw new RangeError("Mask value out of range");
      this.size = d * 4 + 17;
      let c = [];
      for (let _ = 0; _ < this.size; _++)
        c.push(!1);
      for (let _ = 0; _ < this.size; _++)
        this.modules.push(c.slice()), this.isFunction.push(c.slice());
      this.drawFunctionPatterns();
      const m = this.addEccAndInterleave(t);
      if (this.drawCodewords(m), o == -1) {
        let _ = 1e9;
        for (let C = 0; C < 8; C++) {
          this.applyMask(C), this.drawFormatBits(C);
          const v = this.getPenaltyScore();
          v < _ && (o = C, _ = v), this.applyMask(C);
        }
      }
      $(0 <= o && o <= 7), this.mask = o, this.applyMask(o), this.drawFormatBits(o), this.isFunction = [];
    }
    /*-- Static factory functions (high level) --*/
    // Returns a QR Code representing the given Unicode text string at the given error correction level.
    // As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer
    // Unicode code points (not UTF-16 code units) if the low error correction level is used. The smallest possible
    // QR Code version is automatically chosen for the output. The ECC level of the result may be higher than the
    // ecl argument if it can be done without increasing the version.
    static encodeText(d, r) {
      const t = z.QrSegment.makeSegments(d);
      return p.encodeSegments(t, r);
    }
    // Returns a QR Code representing the given binary data at the given error correction level.
    // This function always encodes using the binary segment mode, not any text mode. The maximum number of
    // bytes allowed is 2953. The smallest possible QR Code version is automatically chosen for the output.
    // The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
    static encodeBinary(d, r) {
      const t = z.QrSegment.makeBytes(d);
      return p.encodeSegments([t], r);
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
    static encodeSegments(d, r, t = 1, o = 40, c = -1, m = !0) {
      if (!(p.MIN_VERSION <= t && t <= o && o <= p.MAX_VERSION) || c < -1 || c > 7)
        throw new RangeError("Invalid value");
      let _, C;
      for (_ = t; ; _++) {
        const E = p.getNumDataCodewords(_, r) * 8, x = w.getTotalBits(d, _);
        if (x <= E) {
          C = x;
          break;
        }
        if (_ >= o)
          throw new RangeError("Data too long");
      }
      for (const E of [p.Ecc.MEDIUM, p.Ecc.QUARTILE, p.Ecc.HIGH])
        m && C <= p.getNumDataCodewords(_, E) * 8 && (r = E);
      let v = [];
      for (const E of d) {
        y(E.mode.modeBits, 4, v), y(E.numChars, E.mode.numCharCountBits(_), v);
        for (const x of E.getData())
          v.push(x);
      }
      $(v.length == C);
      const I = p.getNumDataCodewords(_, r) * 8;
      $(v.length <= I), y(0, Math.min(4, I - v.length), v), y(0, (8 - v.length % 8) % 8, v), $(v.length % 8 == 0);
      for (let E = 236; v.length < I; E ^= 253)
        y(E, 8, v);
      let R = [];
      for (; R.length * 8 < v.length; )
        R.push(0);
      return v.forEach((E, x) => R[x >>> 3] |= E << 7 - (x & 7)), new p(_, r, R, c);
    }
    /*-- Accessor methods --*/
    // Returns the color of the module (pixel) at the given coordinates, which is false
    // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
    // If the given coordinates are out of bounds, then false (light) is returned.
    getModule(d, r) {
      return 0 <= d && d < this.size && 0 <= r && r < this.size && this.modules[r][d];
    }
    /*-- Private helper methods for constructor: Drawing function modules --*/
    // Reads this object's version field, and draws and marks all function modules.
    drawFunctionPatterns() {
      for (let t = 0; t < this.size; t++)
        this.setFunctionModule(6, t, t % 2 == 0), this.setFunctionModule(t, 6, t % 2 == 0);
      this.drawFinderPattern(3, 3), this.drawFinderPattern(this.size - 4, 3), this.drawFinderPattern(3, this.size - 4);
      const d = this.getAlignmentPatternPositions(), r = d.length;
      for (let t = 0; t < r; t++)
        for (let o = 0; o < r; o++)
          t == 0 && o == 0 || t == 0 && o == r - 1 || t == r - 1 && o == 0 || this.drawAlignmentPattern(d[t], d[o]);
      this.drawFormatBits(0), this.drawVersion();
    }
    // Draws two copies of the format bits (with its own error correction code)
    // based on the given mask and this object's error correction level field.
    drawFormatBits(d) {
      const r = this.errorCorrectionLevel.formatBits << 3 | d;
      let t = r;
      for (let c = 0; c < 10; c++)
        t = t << 1 ^ (t >>> 9) * 1335;
      const o = (r << 10 | t) ^ 21522;
      $(o >>> 15 == 0);
      for (let c = 0; c <= 5; c++)
        this.setFunctionModule(8, c, g(o, c));
      this.setFunctionModule(8, 7, g(o, 6)), this.setFunctionModule(8, 8, g(o, 7)), this.setFunctionModule(7, 8, g(o, 8));
      for (let c = 9; c < 15; c++)
        this.setFunctionModule(14 - c, 8, g(o, c));
      for (let c = 0; c < 8; c++)
        this.setFunctionModule(this.size - 1 - c, 8, g(o, c));
      for (let c = 8; c < 15; c++)
        this.setFunctionModule(8, this.size - 15 + c, g(o, c));
      this.setFunctionModule(8, this.size - 8, !0);
    }
    // Draws two copies of the version bits (with its own error correction code),
    // based on this object's version field, iff 7 <= version <= 40.
    drawVersion() {
      if (this.version < 7)
        return;
      let d = this.version;
      for (let t = 0; t < 12; t++)
        d = d << 1 ^ (d >>> 11) * 7973;
      const r = this.version << 12 | d;
      $(r >>> 18 == 0);
      for (let t = 0; t < 18; t++) {
        const o = g(r, t), c = this.size - 11 + t % 3, m = Math.floor(t / 3);
        this.setFunctionModule(c, m, o), this.setFunctionModule(m, c, o);
      }
    }
    // Draws a 9*9 finder pattern including the border separator,
    // with the center module at (x, y). Modules can be out of bounds.
    drawFinderPattern(d, r) {
      for (let t = -4; t <= 4; t++)
        for (let o = -4; o <= 4; o++) {
          const c = Math.max(Math.abs(o), Math.abs(t)), m = d + o, _ = r + t;
          0 <= m && m < this.size && 0 <= _ && _ < this.size && this.setFunctionModule(m, _, c != 2 && c != 4);
        }
    }
    // Draws a 5*5 alignment pattern, with the center module
    // at (x, y). All modules must be in bounds.
    drawAlignmentPattern(d, r) {
      for (let t = -2; t <= 2; t++)
        for (let o = -2; o <= 2; o++)
          this.setFunctionModule(d + o, r + t, Math.max(Math.abs(o), Math.abs(t)) != 1);
    }
    // Sets the color of a module and marks it as a function module.
    // Only used by the constructor. Coordinates must be in bounds.
    setFunctionModule(d, r, t) {
      this.modules[r][d] = t, this.isFunction[r][d] = !0;
    }
    /*-- Private helper methods for constructor: Codewords and masking --*/
    // Returns a new byte string representing the given data with the appropriate error correction
    // codewords appended to it, based on this object's version and error correction level.
    addEccAndInterleave(d) {
      const r = this.version, t = this.errorCorrectionLevel;
      if (d.length != p.getNumDataCodewords(r, t))
        throw new RangeError("Invalid argument");
      const o = p.NUM_ERROR_CORRECTION_BLOCKS[t.ordinal][r], c = p.ECC_CODEWORDS_PER_BLOCK[t.ordinal][r], m = Math.floor(p.getNumRawDataModules(r) / 8), _ = o - m % o, C = Math.floor(m / o);
      let v = [];
      const I = p.reedSolomonComputeDivisor(c);
      for (let E = 0, x = 0; E < o; E++) {
        let A = d.slice(x, x + C - c + (E < _ ? 0 : 1));
        x += A.length;
        const N = p.reedSolomonComputeRemainder(A, I);
        E < _ && A.push(0), v.push(A.concat(N));
      }
      let R = [];
      for (let E = 0; E < v[0].length; E++)
        v.forEach((x, A) => {
          (E != C - c || A >= _) && R.push(x[E]);
        });
      return $(R.length == m), R;
    }
    // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
    // data area of this QR Code. Function modules need to be marked off before this is called.
    drawCodewords(d) {
      if (d.length != Math.floor(p.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let r = 0;
      for (let t = this.size - 1; t >= 1; t -= 2) {
        t == 6 && (t = 5);
        for (let o = 0; o < this.size; o++)
          for (let c = 0; c < 2; c++) {
            const m = t - c, C = (t + 1 & 2) == 0 ? this.size - 1 - o : o;
            !this.isFunction[C][m] && r < d.length * 8 && (this.modules[C][m] = g(d[r >>> 3], 7 - (r & 7)), r++);
          }
      }
      $(r == d.length * 8);
    }
    // XORs the codeword modules in this QR Code with the given mask pattern.
    // The function modules must be marked and the codeword bits must be drawn
    // before masking. Due to the arithmetic of XOR, calling applyMask() with
    // the same mask value a second time will undo the mask. A final well-formed
    // QR Code needs exactly one (not zero, two, etc.) mask applied.
    applyMask(d) {
      if (d < 0 || d > 7)
        throw new RangeError("Mask value out of range");
      for (let r = 0; r < this.size; r++)
        for (let t = 0; t < this.size; t++) {
          let o;
          switch (d) {
            case 0:
              o = (t + r) % 2 == 0;
              break;
            case 1:
              o = r % 2 == 0;
              break;
            case 2:
              o = t % 3 == 0;
              break;
            case 3:
              o = (t + r) % 3 == 0;
              break;
            case 4:
              o = (Math.floor(t / 3) + Math.floor(r / 2)) % 2 == 0;
              break;
            case 5:
              o = t * r % 2 + t * r % 3 == 0;
              break;
            case 6:
              o = (t * r % 2 + t * r % 3) % 2 == 0;
              break;
            case 7:
              o = ((t + r) % 2 + t * r % 3) % 2 == 0;
              break;
            default:
              throw new Error("Unreachable");
          }
          !this.isFunction[r][t] && o && (this.modules[r][t] = !this.modules[r][t]);
        }
    }
    // Calculates and returns the penalty score based on state of this QR Code's current modules.
    // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
    getPenaltyScore() {
      let d = 0;
      for (let c = 0; c < this.size; c++) {
        let m = !1, _ = 0, C = [0, 0, 0, 0, 0, 0, 0];
        for (let v = 0; v < this.size; v++)
          this.modules[c][v] == m ? (_++, _ == 5 ? d += p.PENALTY_N1 : _ > 5 && d++) : (this.finderPenaltyAddHistory(_, C), m || (d += this.finderPenaltyCountPatterns(C) * p.PENALTY_N3), m = this.modules[c][v], _ = 1);
        d += this.finderPenaltyTerminateAndCount(m, _, C) * p.PENALTY_N3;
      }
      for (let c = 0; c < this.size; c++) {
        let m = !1, _ = 0, C = [0, 0, 0, 0, 0, 0, 0];
        for (let v = 0; v < this.size; v++)
          this.modules[v][c] == m ? (_++, _ == 5 ? d += p.PENALTY_N1 : _ > 5 && d++) : (this.finderPenaltyAddHistory(_, C), m || (d += this.finderPenaltyCountPatterns(C) * p.PENALTY_N3), m = this.modules[v][c], _ = 1);
        d += this.finderPenaltyTerminateAndCount(m, _, C) * p.PENALTY_N3;
      }
      for (let c = 0; c < this.size - 1; c++)
        for (let m = 0; m < this.size - 1; m++) {
          const _ = this.modules[c][m];
          _ == this.modules[c][m + 1] && _ == this.modules[c + 1][m] && _ == this.modules[c + 1][m + 1] && (d += p.PENALTY_N2);
        }
      let r = 0;
      for (const c of this.modules)
        r = c.reduce((m, _) => m + (_ ? 1 : 0), r);
      const t = this.size * this.size, o = Math.ceil(Math.abs(r * 20 - t * 10) / t) - 1;
      return $(0 <= o && o <= 9), d += o * p.PENALTY_N4, $(0 <= d && d <= 2568888), d;
    }
    /*-- Private helper functions --*/
    // Returns an ascending list of positions of alignment patterns for this version number.
    // Each position is in the range [0,177), and are used on both the x and y axes.
    // This could be implemented as lookup table of 40 variable-length lists of integers.
    getAlignmentPatternPositions() {
      if (this.version == 1)
        return [];
      {
        const d = Math.floor(this.version / 7) + 2, r = Math.floor((this.version * 8 + d * 3 + 5) / (d * 4 - 4)) * 2;
        let t = [6];
        for (let o = this.size - 7; t.length < d; o -= r)
          t.splice(1, 0, o);
        return t;
      }
    }
    // Returns the number of data bits that can be stored in a QR Code of the given version number, after
    // all function modules are excluded. This includes remainder bits, so it might not be a multiple of 8.
    // The result is in the range [208, 29648]. This could be implemented as a 40-entry lookup table.
    static getNumRawDataModules(d) {
      if (d < p.MIN_VERSION || d > p.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let r = (16 * d + 128) * d + 64;
      if (d >= 2) {
        const t = Math.floor(d / 7) + 2;
        r -= (25 * t - 10) * t - 55, d >= 7 && (r -= 36);
      }
      return $(208 <= r && r <= 29648), r;
    }
    // Returns the number of 8-bit data (i.e. not error correction) codewords contained in any
    // QR Code of the given version number and error correction level, with remainder bits discarded.
    // This stateless pure function could be implemented as a (40*4)-cell lookup table.
    static getNumDataCodewords(d, r) {
      return Math.floor(p.getNumRawDataModules(d) / 8) - p.ECC_CODEWORDS_PER_BLOCK[r.ordinal][d] * p.NUM_ERROR_CORRECTION_BLOCKS[r.ordinal][d];
    }
    // Returns a Reed-Solomon ECC generator polynomial for the given degree. This could be
    // implemented as a lookup table over all possible parameter values, instead of as an algorithm.
    static reedSolomonComputeDivisor(d) {
      if (d < 1 || d > 255)
        throw new RangeError("Degree out of range");
      let r = [];
      for (let o = 0; o < d - 1; o++)
        r.push(0);
      r.push(1);
      let t = 1;
      for (let o = 0; o < d; o++) {
        for (let c = 0; c < r.length; c++)
          r[c] = p.reedSolomonMultiply(r[c], t), c + 1 < r.length && (r[c] ^= r[c + 1]);
        t = p.reedSolomonMultiply(t, 2);
      }
      return r;
    }
    // Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.
    static reedSolomonComputeRemainder(d, r) {
      let t = r.map((o) => 0);
      for (const o of d) {
        const c = o ^ t.shift();
        t.push(0), r.forEach((m, _) => t[_] ^= p.reedSolomonMultiply(m, c));
      }
      return t;
    }
    // Returns the product of the two given field elements modulo GF(2^8/0x11D). The arguments and result
    // are unsigned 8-bit integers. This could be implemented as a lookup table of 256*256 entries of uint8.
    static reedSolomonMultiply(d, r) {
      if (d >>> 8 || r >>> 8)
        throw new RangeError("Byte out of range");
      let t = 0;
      for (let o = 7; o >= 0; o--)
        t = t << 1 ^ (t >>> 7) * 285, t ^= (r >>> o & 1) * d;
      return $(t >>> 8 == 0), t;
    }
    // Can only be called immediately after a light run is added, and
    // returns either 0, 1, or 2. A helper function for getPenaltyScore().
    finderPenaltyCountPatterns(d) {
      const r = d[1];
      $(r <= this.size * 3);
      const t = r > 0 && d[2] == r && d[3] == r * 3 && d[4] == r && d[5] == r;
      return (t && d[0] >= r * 4 && d[6] >= r ? 1 : 0) + (t && d[6] >= r * 4 && d[0] >= r ? 1 : 0);
    }
    // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
    finderPenaltyTerminateAndCount(d, r, t) {
      return d && (this.finderPenaltyAddHistory(r, t), r = 0), r += this.size, this.finderPenaltyAddHistory(r, t), this.finderPenaltyCountPatterns(t);
    }
    // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
    finderPenaltyAddHistory(d, r) {
      r[0] == 0 && (d += this.size), r.pop(), r.unshift(d);
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
  function y(P, d, r) {
    if (d < 0 || d > 31 || P >>> d)
      throw new RangeError("Value out of range");
    for (let t = d - 1; t >= 0; t--)
      r.push(P >>> t & 1);
  }
  function g(P, d) {
    return (P >>> d & 1) != 0;
  }
  function $(P) {
    if (!P)
      throw new Error("Assertion error");
  }
  const k = class k {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code segment with the given attributes and data.
    // The character count (numChars) must agree with the mode and the bit buffer length,
    // but the constraint isn't checked. The given bit buffer is cloned and stored.
    constructor(d, r, t) {
      H(this, "mode");
      H(this, "numChars");
      H(this, "bitData");
      if (this.mode = d, this.numChars = r, this.bitData = t, r < 0)
        throw new RangeError("Invalid argument");
      this.bitData = t.slice();
    }
    /*-- Static factory functions (mid level) --*/
    // Returns a segment representing the given binary data encoded in
    // byte mode. All input byte arrays are acceptable. Any text string
    // can be converted to UTF-8 bytes and encoded as a byte mode segment.
    static makeBytes(d) {
      let r = [];
      for (const t of d)
        y(t, 8, r);
      return new k(k.Mode.BYTE, d.length, r);
    }
    // Returns a segment representing the given string of decimal digits encoded in numeric mode.
    static makeNumeric(d) {
      if (!k.isNumeric(d))
        throw new RangeError("String contains non-numeric characters");
      let r = [];
      for (let t = 0; t < d.length; ) {
        const o = Math.min(d.length - t, 3);
        y(parseInt(d.substring(t, t + o), 10), o * 3 + 1, r), t += o;
      }
      return new k(k.Mode.NUMERIC, d.length, r);
    }
    // Returns a segment representing the given text string encoded in alphanumeric mode.
    // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
    // dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static makeAlphanumeric(d) {
      if (!k.isAlphanumeric(d))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let r = [], t;
      for (t = 0; t + 2 <= d.length; t += 2) {
        let o = k.ALPHANUMERIC_CHARSET.indexOf(d.charAt(t)) * 45;
        o += k.ALPHANUMERIC_CHARSET.indexOf(d.charAt(t + 1)), y(o, 11, r);
      }
      return t < d.length && y(k.ALPHANUMERIC_CHARSET.indexOf(d.charAt(t)), 6, r), new k(k.Mode.ALPHANUMERIC, d.length, r);
    }
    // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
    // The result may use various segment modes and switch modes to optimize the length of the bit stream.
    static makeSegments(d) {
      return d == "" ? [] : k.isNumeric(d) ? [k.makeNumeric(d)] : k.isAlphanumeric(d) ? [k.makeAlphanumeric(d)] : [k.makeBytes(k.toUtf8ByteArray(d))];
    }
    // Returns a segment representing an Extended Channel Interpretation
    // (ECI) designator with the given assignment value.
    static makeEci(d) {
      let r = [];
      if (d < 0)
        throw new RangeError("ECI assignment value out of range");
      if (d < 128)
        y(d, 8, r);
      else if (d < 16384)
        y(2, 2, r), y(d, 14, r);
      else if (d < 1e6)
        y(6, 3, r), y(d, 21, r);
      else
        throw new RangeError("ECI assignment value out of range");
      return new k(k.Mode.ECI, 0, r);
    }
    // Tests whether the given string can be encoded as a segment in numeric mode.
    // A string is encodable iff each character is in the range 0 to 9.
    static isNumeric(d) {
      return k.NUMERIC_REGEX.test(d);
    }
    // Tests whether the given string can be encoded as a segment in alphanumeric mode.
    // A string is encodable iff each character is in the following set: 0 to 9, A to Z
    // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static isAlphanumeric(d) {
      return k.ALPHANUMERIC_REGEX.test(d);
    }
    /*-- Methods --*/
    // Returns a new copy of the data bits of this segment.
    getData() {
      return this.bitData.slice();
    }
    // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
    // the given version. The result is infinity if a segment has too many characters to fit its length field.
    static getTotalBits(d, r) {
      let t = 0;
      for (const o of d) {
        const c = o.mode.numCharCountBits(r);
        if (o.numChars >= 1 << c)
          return 1 / 0;
        t += 4 + c + o.bitData.length;
      }
      return t;
    }
    // Returns a new array of bytes representing the given string encoded in UTF-8.
    static toUtf8ByteArray(d) {
      d = encodeURI(d);
      let r = [];
      for (let t = 0; t < d.length; t++)
        d.charAt(t) != "%" ? r.push(d.charCodeAt(t)) : (r.push(parseInt(d.substring(t + 1, t + 3), 16)), t += 2);
      return r;
    }
  };
  /*-- Constants --*/
  // Describes precisely all strings that are encodable in numeric mode.
  H(k, "NUMERIC_REGEX", /^[0-9]*$/), // Describes precisely all strings that are encodable in alphanumeric mode.
  H(k, "ALPHANUMERIC_REGEX", /^[A-Z0-9 $%*+.\/:-]*$/), // The set of all legal characters in alphanumeric mode,
  // where each character value maps to the index in the string.
  H(k, "ALPHANUMERIC_CHARSET", "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:");
  let w = k;
  z.QrSegment = w;
})(_e || (_e = {}));
((z) => {
  ((s) => {
    const g = class g {
      // The QR Code can tolerate about 30% erroneous codewords
      /*-- Constructor and fields --*/
      constructor(w, p) {
        H(this, "ordinal");
        H(this, "formatBits");
        this.ordinal = w, this.formatBits = p;
      }
    };
    /*-- Constants --*/
    H(g, "LOW", new g(0, 1)), // The QR Code can tolerate about  7% erroneous codewords
    H(g, "MEDIUM", new g(1, 0)), // The QR Code can tolerate about 15% erroneous codewords
    H(g, "QUARTILE", new g(2, 3)), // The QR Code can tolerate about 25% erroneous codewords
    H(g, "HIGH", new g(3, 2));
    let y = g;
    s.Ecc = y;
  })(z.QrCode || (z.QrCode = {}));
})(_e || (_e = {}));
((z) => {
  ((s) => {
    const g = class g {
      /*-- Constructor and fields --*/
      constructor(w, p) {
        H(this, "modeBits");
        H(this, "numBitsCharCount");
        this.modeBits = w, this.numBitsCharCount = p;
      }
      /*-- Method --*/
      // (Package-private) Returns the bit width of the character count field for a segment in
      // this mode in a QR Code at the given version number. The result is in the range [0, 16].
      numCharCountBits(w) {
        return this.numBitsCharCount[Math.floor((w + 7) / 17)];
      }
    };
    /*-- Constants --*/
    H(g, "NUMERIC", new g(1, [10, 12, 14])), H(g, "ALPHANUMERIC", new g(2, [9, 11, 13])), H(g, "BYTE", new g(4, [8, 16, 16])), H(g, "KANJI", new g(8, [8, 10, 12])), H(g, "ECI", new g(7, [0, 0, 0]));
    let y = g;
    s.Mode = y;
  })(z.QrSegment || (z.QrSegment = {}));
})(_e || (_e = {}));
const De = _e, Pn = { class: "content-card" }, xn = { class: "connection-grid" }, Mn = { class: "connection-form" }, Un = { class: "field" }, En = { class: "field" }, An = { class: "toggle-label" }, Tn = { class: "field" }, Nn = { class: "field" }, Vn = { class: "field" }, In = { class: "helper-text" }, Rn = { key: 0 }, On = { key: 1 }, Ln = { class: "actions-row" }, zn = { class: "connection-qr" }, Dn = ["viewBox"], Fn = ["width", "height"], Bn = ["x", "y"], Kn = { class: "connection-link" }, Fe = "0kay.connection.qr.v2", Hn = /* @__PURE__ */ ee({
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
    const g = s(), $ = !!g.hostOverride, w = M(g.hostOverride && g.host ? g.host : location.hostname), p = M($), k = location.protocol === "https:" ? location.port || "443" : "8080", P = M(g.port ?? k), d = M(g.tls ?? location.protocol === "https:"), r = M(g.token ?? ""), t = M(g.pin ?? ""), o = M(g.name ?? "0KAY"), c = M(""), m = M(!1), _ = M(!1);
    ie(async () => {
      try {
        const E = await fetch("/api/auth/session");
        if (E.ok) {
          const x = await E.json();
          c.value = String(x.core_id || ""), m.value = !!x.lan_enabled;
          const A = Array.isArray(x.addresses) ? x.addresses : [], N = y(A);
          !p.value && N && (w.value = N);
        }
      } catch {
      }
    }), He([w, P, d, r, t, o, p], () => {
      localStorage.setItem(
        Fe,
        JSON.stringify({
          host: w.value,
          hostOverride: p.value,
          port: P.value,
          tls: d.value,
          token: r.value,
          pin: t.value,
          name: o.value
        })
      );
    });
    const C = W(() => {
      const E = d.value ? "https" : "http", x = String(P.value || "").trim();
      return `${E}://${w.value.trim()}${x ? ":" + x : ""}`;
    }), v = W(() => {
      const E = [["v", "1"], ["url", C.value]];
      return o.value.trim() && E.push(["name", o.value.trim()]), r.value.trim() && E.push(["token", r.value.trim()]), t.value.trim() && E.push(["pin", t.value.trim()]), c.value && E.push(["core_id", c.value]), `0kay://pair?${E.map(([A, N]) => `${A}=${encodeURIComponent(N)}`).join("&")}`;
    }), I = W(() => {
      const E = De.QrCode.encodeText(v.value, De.QrCode.Ecc.MEDIUM), x = E.size, A = 2, N = x + A * 2, j = [];
      for (let X = 0; X < x; X++)
        for (let F = 0; F < x; F++)
          E.getModule(F, X) && j.push({ x: F + A, y: X + A });
      return { dim: N, dark: j };
    });
    async function R() {
      try {
        await navigator.clipboard.writeText(v.value), _.value = !0, setTimeout(() => _.value = !1, 1500);
      } catch {
      }
    }
    return (E, x) => (a(), u("div", Pn, [
      x[15] || (x[15] = e("h2", null, "连接手机", -1)),
      x[16] || (x[16] = e("p", { class: "card-desc" }, [
        G(" 用 0KAY 安卓 App 扫描下方二维码即可连接。默认使用本机局域网 IP；若通过 FRP / 反向代理暴露，请把下方 "),
        e("strong", null, "对外主机 / 端口 / TLS"),
        G(" 改成外网可达地址 （Core 本身无需修改）。Token / PIN 可留空（可信局域网）；公网访问请填写以便 App 直接认证。 ")
      ], -1)),
      e("div", xn, [
        e("div", Mn, [
          e("div", Un, [
            x[7] || (x[7] = e("label", null, "对外主机 / IP（默认局域网 IP）", -1)),
            V(e("input", {
              "onUpdate:modelValue": x[0] || (x[0] = (A) => w.value = A),
              class: "input",
              placeholder: "192.168.1.10 或 your.domain.com",
              onInput: x[1] || (x[1] = (A) => p.value = !0)
            }, null, 544), [
              [D, w.value]
            ])
          ]),
          e("div", En, [
            x[8] || (x[8] = e("label", null, "端口", -1)),
            V(e("input", {
              "onUpdate:modelValue": x[2] || (x[2] = (A) => P.value = A),
              class: "input",
              inputmode: "numeric",
              placeholder: "8080"
            }, null, 512), [
              [D, P.value]
            ])
          ]),
          e("label", An, [
            V(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": x[3] || (x[3] = (A) => d.value = A)
            }, null, 512), [
              [te, d.value]
            ]),
            x[9] || (x[9] = e("span", { class: "toggle-slider" }, null, -1)),
            x[10] || (x[10] = e("span", null, "使用 TLS (https / wss)", -1))
          ]),
          e("div", Tn, [
            x[11] || (x[11] = e("label", null, "API Token（可选）", -1)),
            V(e("input", {
              "onUpdate:modelValue": x[4] || (x[4] = (A) => r.value = A),
              class: "input",
              type: "password",
              placeholder: "留空则使用可信局域网",
              autocomplete: "off"
            }, null, 512), [
              [D, r.value]
            ])
          ]),
          e("div", Nn, [
            x[12] || (x[12] = e("label", null, "访问 PIN（可选）", -1)),
            V(e("input", {
              "onUpdate:modelValue": x[5] || (x[5] = (A) => t.value = A),
              class: "input",
              type: "password",
              placeholder: "敏感操作 PIN",
              autocomplete: "off"
            }, null, 512), [
              [D, t.value]
            ])
          ]),
          e("div", Vn, [
            x[13] || (x[13] = e("label", null, "设备显示名称（可选）", -1)),
            V(e("input", {
              "onUpdate:modelValue": x[6] || (x[6] = (A) => o.value = A),
              class: "input",
              placeholder: "0KAY"
            }, null, 512), [
              [D, o.value]
            ])
          ]),
          e("div", In, [
            x[14] || (x[14] = G(" 连接地址：", -1)),
            e("code", null, n(C.value), 1),
            c.value ? (a(), u("span", Rn, " · Core: " + n(c.value), 1)) : U("", !0),
            m.value ? (a(), u("span", On, " · LAN 模式")) : U("", !0)
          ]),
          e("div", Ln, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              onClick: R
            }, n(_.value ? "已复制" : "复制连接串"), 1)
          ])
        ]),
        e("div", zn, [
          (a(), u("svg", {
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
            }, null, 8, Fn),
            (a(!0), u(K, null, q(I.value.dark, (A) => (a(), u("rect", {
              key: A.x + ":" + A.y,
              x: A.x,
              y: A.y,
              width: "1",
              height: "1",
              fill: "#0b1020"
            }, null, 8, Bn))), 128))
          ], 8, Dn)),
          e("code", Kn, n(v.value), 1)
        ])
      ])
    ]));
  }
}), jn = /* @__PURE__ */ ue(Hn, [["__scopeId", "data-v-deea7b8b"]]), Yn = { class: "content-card" }, Jn = { class: "card-desc" }, Wn = { class: "field-row" }, qn = { class: "field" }, Gn = ["placeholder"], Xn = { class: "field" }, Zn = ["placeholder"], Qn = { class: "field" }, ea = { class: "field" }, ta = ["placeholder"], sa = { class: "field" }, la = ["placeholder"], oa = { class: "field" }, na = ["placeholder"], aa = { class: "field" }, ia = ["placeholder"], ra = { class: "helper-text" }, ua = /* @__PURE__ */ ee({
  __name: "PersonaPanel",
  setup(z) {
    const { t: s } = re(), y = Ve(), { tabLabel: g, tabMeta: $ } = Ie();
    return (w, p) => (a(), u("div", Yn, [
      e("h2", null, n(l(g)("persona")), 1),
      e("p", Jn, n(l($)("persona")?.descriptionKey ? l(s)(l($)("persona").descriptionKey) : l(s)("settings.personaDesc")), 1),
      e("div", Wn, [
        e("div", qn, [
          e("label", null, n(l(s)("wizard.name")), 1),
          V(e("input", {
            "onUpdate:modelValue": p[0] || (p[0] = (k) => l(y).persona.name = k),
            placeholder: l(s)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, Gn), [
            [D, l(y).persona.name]
          ])
        ]),
        e("div", Xn, [
          e("label", null, n(l(s)("wizard.avatarUrl")), 1),
          V(e("input", {
            "onUpdate:modelValue": p[1] || (p[1] = (k) => l(y).persona.avatar = k),
            placeholder: l(s)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, Zn), [
            [D, l(y).persona.avatar]
          ])
        ]),
        e("div", Qn, [
          p[7] || (p[7] = e("label", null, "出生日期", -1)),
          V(e("input", {
            "onUpdate:modelValue": p[2] || (p[2] = (k) => l(y).persona.birthDate = k),
            type: "date",
            class: "input"
          }, null, 512), [
            [D, l(y).persona.birthDate]
          ])
        ])
      ]),
      e("div", ea, [
        e("label", null, n(l(s)("wizard.description")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[3] || (p[3] = (k) => l(y).persona.description = k),
          placeholder: l(s)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, ta), [
          [D, l(y).persona.description]
        ])
      ]),
      e("div", sa, [
        e("label", null, n(l(s)("wizard.personality")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[4] || (p[4] = (k) => l(y).persona.personality = k),
          placeholder: l(s)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, la), [
          [D, l(y).persona.personality]
        ])
      ]),
      e("div", oa, [
        e("label", null, n(l(s)("wizard.greeting")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[5] || (p[5] = (k) => l(y).persona.greeting = k),
          placeholder: l(s)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, na), [
          [D, l(y).persona.greeting]
        ])
      ]),
      e("div", aa, [
        e("label", null, n(l(s)("wizard.customPrompt")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[6] || (p[6] = (k) => l(y).persona.customPrompt = k),
          placeholder: l(s)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, ia), [
          [D, l(y).persona.customPrompt]
        ]),
        e("p", ra, n(l(s)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), da = { class: "content-card" }, ca = { class: "card-desc" }, pa = { class: "toggle-label" }, va = { class: "helper-text" }, ha = { class: "toggle-label" }, ma = { class: "helper-text" }, _a = { class: "field" }, ga = ["placeholder"], ba = { class: "helper-text" }, ya = {
  key: 0,
  class: "helper-text"
}, fa = { class: "actions-row" }, ka = /* @__PURE__ */ ee({
  __name: "PermissionsPanel",
  setup(z) {
    const { t: s } = re(), { tabLabel: y, tabMeta: g, fieldLabel: $, fieldHelp: w } = Ie(), p = M({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), k = M("");
    async function P() {
      try {
        const r = await fetch("/api/life/permissions");
        if (r.ok) {
          const t = await r.json();
          p.value = {
            screen_watch: !!t.screen_watch,
            computer_use: !!t.computer_use,
            report_agent_host: t.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function d() {
      k.value = "";
      try {
        const r = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p.value)
        });
        if (!r.ok) throw new Error(String(r.status));
        const t = await r.json();
        p.value = {
          screen_watch: !!t.screen_watch,
          computer_use: !!t.computer_use,
          report_agent_host: t.report_agent_host || ""
        }, k.value = s("settings.permSaved");
      } catch {
        k.value = s("settings.permFailed");
      }
    }
    return ie(P), (r, t) => (a(), u("div", da, [
      e("h2", null, n(l(y)("permissions")), 1),
      e("p", ca, n(l(g)("permissions")?.descriptionKey ? l(s)(l(g)("permissions").descriptionKey) : l(s)("settings.permissionsDesc")), 1),
      e("label", pa, [
        V(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": t[0] || (t[0] = (o) => p.value.screen_watch = o),
          onChange: d
        }, null, 544), [
          [te, p.value.screen_watch]
        ]),
        t[4] || (t[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(l($)(l(g)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          t[3] || (t[3] = e("br", null, null, -1)),
          e("small", va, n(l(w)(l(g)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", ha, [
        V(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": t[1] || (t[1] = (o) => p.value.computer_use = o),
          onChange: d
        }, null, 544), [
          [te, p.value.computer_use]
        ]),
        t[6] || (t[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(l($)(l(g)("permissions"), "computer_use", "settings.computerUse")), 1),
          t[5] || (t[5] = e("br", null, null, -1)),
          e("small", ma, n(l(w)(l(g)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", _a, [
        e("label", null, n(l($)(l(g)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        V(e("input", {
          "onUpdate:modelValue": t[2] || (t[2] = (o) => p.value.report_agent_host = o),
          class: "input",
          placeholder: l(w)(l(g)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: d
        }, null, 40, ga), [
          [D, p.value.report_agent_host]
        ]),
        e("p", ba, n(l(w)(l(g)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      k.value ? (a(), u("div", ya, n(k.value), 1)) : U("", !0),
      e("div", fa, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: d
        }, n(l(s)("settings.save")), 1)
      ])
    ]));
  }
}), wa = M(!1), $a = M(!1);
M(!1);
const ve = M(!1), ge = M(!0), Re = M(!0), fe = M([]), We = M(!1);
M(!1);
const Se = M(!1), Be = [];
function Ca(z) {
  const s = Be.splice(0, Be.length);
  for (const y of s)
    y.resolve();
}
async function Sa() {
  const z = window.fetch;
  try {
    const s = await z("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!s.ok) return;
    const y = await s.json();
    ve.value = !!y.configured, ge.value = y.enabled !== !1, Re.value = y.login_enabled !== !1, fe.value = Array.isArray(y.pages) ? y.pages : [], Se.value = !y.configured && ge.value;
  } catch {
  }
}
async function Pa(z) {
  const s = window.fetch, y = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(z)
  }), g = await y.json().catch(() => null);
  if (!y.ok) throw new Error(g?.error || `HTTP ${y.status}`);
  typeof g?.enabled == "boolean" && (ge.value = g.enabled), typeof g?.login_enabled == "boolean" && (Re.value = g.login_enabled), Array.isArray(g?.pages) && (fe.value = g.pages), ve.value = !!g?.configured, Se.value = !g?.configured && ge.value;
}
async function xa() {
  const z = window.fetch, s = await z("/api/security/pin", { method: "DELETE" }), y = await s.json().catch(() => null);
  if (!s.ok) throw new Error(y?.error || `HTTP ${s.status}`);
  We.value = !1, ve.value = !1, Se.value = ge.value;
}
async function Ma(z) {
  const s = window.fetch, y = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: z })
  }), g = await y.json().catch(() => null);
  if (!y.ok || !g?.configured) throw new Error(g?.error || `HTTP ${y.status}`);
  z.trim(), We.value = !0, ve.value = !0, Se.value = !1, $a.value = !0, wa.value = !1, Ca();
}
const Ua = { class: "content-card security-panel" }, Ea = { class: "card-desc" }, Aa = { class: "sec-stack" }, Ta = { class: "toggle-label" }, Na = ["checked", "disabled"], Va = { class: "helper-text" }, Ia = { class: "toggle-label" }, Ra = ["checked", "disabled"], Oa = { class: "helper-text" }, La = { class: "sec-card" }, za = { class: "sec-card-head" }, Da = { class: "sec-pin-grid" }, Fa = { class: "sec-pin-col" }, Ba = { class: "sec-pin-label" }, Ka = { class: "sec-pin-col" }, Ha = { class: "sec-pin-label" }, ja = { class: "sec-actions" }, Ya = ["disabled"], Ja = ["disabled"], Wa = { class: "sec-card" }, qa = { class: "sec-card-head" }, Ga = { class: "sec-chip" }, Xa = { class: "helper-text" }, Za = { class: "page-list" }, Qa = ["checked", "disabled", "onChange"], ei = { class: "page-text" }, ti = { class: "page-name" }, si = {
  key: 0,
  class: "helper-text sec-msg"
}, li = {
  key: 1,
  class: "sec-error"
}, oi = /* @__PURE__ */ ee({
  __name: "SecurityPanel",
  setup(z) {
    const { t: s, locale: y } = re(), { confirm: g } = Ne(), $ = Je(), w = M(!1), p = M(""), k = M(""), P = M(""), d = M(""), r = W(() => {
      const C = [], v = /* @__PURE__ */ new Set(), I = (R, E) => {
        !R || v.has(R) || (v.add(R), C.push({ path: R, label: E || R }));
      };
      for (const R of $.navItems) {
        const E = R.to || (R.id === "chat" ? "/" : "");
        if (!E) continue;
        let x = R.labelKey ? s(R.labelKey) : "";
        (!x || x === R.labelKey) && (x = R.label || R.id), I(E, x);
      }
      for (const R of $.routerPatches) {
        let E = R.titleKey ? s(R.titleKey) : "";
        (!E || E === R.titleKey) && (E = R.title || String(R.name || R.path)), I(R.path, E);
      }
      return C;
    });
    ie(() => {
      Sa();
    });
    async function t(C) {
      w.value = !0, p.value = "", k.value = "";
      try {
        await Pa(C), p.value = s("settings.saved"), setTimeout(() => {
          p.value = "";
        }, 1500);
      } catch (v) {
        k.value = v?.message || s("settings.permFailed");
      } finally {
        w.value = !1;
      }
    }
    function o(C, v) {
      t({ [C]: v });
    }
    function c(C, v) {
      const I = new Set(fe.value);
      v ? I.add(C) : I.delete(C), t({ pages: [...I] });
    }
    async function m() {
      if (k.value = "", P.value.length !== 6) {
        k.value = s("wizard.pinTooShort");
        return;
      }
      if (P.value !== d.value) {
        k.value = s("wizard.pinMismatch");
        return;
      }
      w.value = !0;
      try {
        await Ma(P.value), P.value = "", d.value = "", p.value = s("settings.saved"), setTimeout(() => {
          p.value = "";
        }, 1500);
      } catch (C) {
        k.value = C?.message || s("settings.permFailed");
      } finally {
        w.value = !1;
      }
    }
    async function _() {
      if (await g({
        title: s("security.removePin"),
        message: s("security.removePinConfirm"),
        confirmLabel: y.value === "en" ? "Delete" : "删除",
        danger: !0
      })) {
        w.value = !0, k.value = "";
        try {
          await xa(), p.value = s("settings.saved"), setTimeout(() => {
            p.value = "";
          }, 1500);
        } catch (v) {
          k.value = v?.message || s("settings.permFailed");
        } finally {
          w.value = !1;
        }
      }
    }
    return (C, v) => (a(), u("div", Ua, [
      e("h2", null, n(l(s)("settings.tabs.security")), 1),
      e("p", Ea, n(l(s)("security.desc")), 1),
      e("div", Aa, [
        e("label", Ta, [
          e("input", {
            type: "checkbox",
            checked: l(ge),
            disabled: w.value,
            onChange: v[0] || (v[0] = (I) => o("enabled", I.target.checked))
          }, null, 40, Na),
          v[4] || (v[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, n(l(s)("security.pinSwitch")), 1),
            e("small", Va, n(l(s)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", Ia, [
          e("input", {
            type: "checkbox",
            checked: l(Re),
            disabled: w.value,
            onChange: v[1] || (v[1] = (I) => o("login_enabled", I.target.checked))
          }, null, 40, Ra),
          v[5] || (v[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, n(l(s)("security.loginSwitch")), 1),
            e("small", Oa, n(l(s)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", La, [
          e("div", za, [
            e("strong", null, n(l(ve) ? l(s)("security.changePin") : l(s)("auth.setupTitle")), 1),
            e("span", {
              class: J(["sec-chip", { on: l(ve) }])
            }, n(l(ve) ? l(s)("security.pinSet") : l(s)("security.pinUnset")), 3)
          ]),
          e("div", Da, [
            e("div", Fa, [
              e("span", Ba, n(l(s)("auth.pinNew")), 1),
              Q(l(ze), {
                modelValue: P.value,
                "onUpdate:modelValue": v[2] || (v[2] = (I) => P.value = I)
              }, null, 8, ["modelValue"])
            ]),
            e("div", Ka, [
              e("span", Ha, n(l(s)("auth.pinConfirm")), 1),
              Q(l(ze), {
                modelValue: d.value,
                "onUpdate:modelValue": v[3] || (v[3] = (I) => d.value = I),
                onComplete: m
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", ja, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: w.value,
              onClick: m
            }, n(l(s)("auth.savePin")), 9, Ya),
            l(ve) ? (a(), u("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: w.value,
              onClick: _
            }, n(l(s)("security.removePin")), 9, Ja)) : U("", !0)
          ])
        ]),
        e("section", Wa, [
          e("div", qa, [
            e("strong", null, n(l(s)("security.pages")), 1),
            e("span", Ga, n(l(s)("security.pageCount", { n: l(fe).length })), 1)
          ]),
          e("p", Xa, n(l(s)("security.pagesHelp")), 1),
          e("div", Za, [
            (a(!0), u(K, null, q(r.value, (I) => (a(), u("label", {
              key: I.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: l(fe).includes(I.path),
                disabled: w.value,
                onChange: (R) => c(I.path, R.target.checked)
              }, null, 40, Qa),
              v[6] || (v[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", ei, [
                e("span", ti, n(I.label), 1),
                e("code", null, n(I.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      p.value ? (a(), u("p", si, n(p.value), 1)) : U("", !0),
      k.value ? (a(), u("p", li, n(k.value), 1)) : U("", !0)
    ]));
  }
}), ni = /* @__PURE__ */ ue(oi, [["__scopeId", "data-v-b1d117f0"]]), ai = { class: "mcp-panel" }, ii = { class: "mcp-head" }, ri = { class: "mcp-actions" }, ui = ["disabled"], di = {
  key: 0,
  class: "error-banner"
}, ci = {
  key: 1,
  class: "notice-banner"
}, pi = {
  key: 2,
  class: "hint"
}, vi = {
  key: 3,
  class: "mcp-list"
}, hi = { class: "mcp-row" }, mi = { class: "mcp-field grow" }, _i = ["onUpdate:modelValue", "readonly"], gi = { class: "mcp-field" }, bi = ["onUpdate:modelValue", "onChange"], yi = { class: "mcp-toggle" }, fi = ["onUpdate:modelValue"], ki = ["onClick"], wi = { class: "mcp-field" }, $i = ["onUpdate:modelValue"], Ci = { class: "mcp-field" }, Si = ["onUpdate:modelValue"], Pi = { class: "mcp-field" }, xi = ["onUpdate:modelValue"], Mi = { class: "mcp-field" }, Ui = ["onUpdate:modelValue"], Ei = { class: "mail-grid" }, Ai = { class: "mail-col" }, Ti = { class: "mcp-field" }, Ni = ["onUpdate:modelValue"], Vi = { class: "mail-row" }, Ii = { class: "mcp-field" }, Ri = ["onUpdate:modelValue"], Oi = { class: "mcp-toggle" }, Li = ["onUpdate:modelValue"], zi = { class: "mcp-field" }, Di = ["onUpdate:modelValue"], Fi = { class: "mcp-field" }, Bi = ["onUpdate:modelValue"], Ki = { class: "mail-col" }, Hi = { class: "mcp-field" }, ji = ["onUpdate:modelValue"], Yi = { class: "mail-row" }, Ji = { class: "mcp-field" }, Wi = ["onUpdate:modelValue"], qi = { class: "mcp-toggle" }, Gi = ["onUpdate:modelValue"], Xi = { class: "mcp-field" }, Zi = ["onUpdate:modelValue"], Qi = { class: "mcp-field" }, er = ["onUpdate:modelValue"], tr = { class: "mail-row" }, sr = { class: "mcp-field grow" }, lr = ["onUpdate:modelValue"], or = { class: "mcp-field" }, nr = ["onUpdate:modelValue"], ar = {
  key: 0,
  class: "hint"
}, ir = /* @__PURE__ */ ee({
  __name: "McpPanel",
  setup(z) {
    const s = M([]), y = M(!1), g = M(!1), $ = M(""), w = M(!1);
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
    function k(c) {
      const m = c?.transport === "http" ? "http" : c?.transport === "builtin" || c?.builtin ? "builtin" : "stdio", _ = c?.options?.imap || {}, C = c?.options?.smtp || {};
      return {
        id: String(c?.id || ""),
        transport: m,
        command: String(c?.command || ""),
        argsText: Array.isArray(c?.args) ? c.args.join(`
`) : "",
        url: String(c?.url || ""),
        headersText: c?.headers && typeof c.headers == "object" ? JSON.stringify(c.headers, null, 2) : "",
        enabled: c?.enabled !== !1,
        imapHost: String(_.host || ""),
        imapPort: Number(_.port) || 993,
        imapSsl: _.ssl !== !1,
        imapUser: String(_.user || ""),
        imapPassword: String(_.password || ""),
        smtpHost: String(C.host || ""),
        smtpPort: Number(C.port) || 465,
        smtpSecure: C.secure !== !1,
        smtpUser: String(C.user || ""),
        smtpPassword: String(C.password || ""),
        from: String(C.from || ""),
        fromName: String(C.fromName || "0KAY")
      };
    }
    function P(c) {
      if (c.transport === "builtin") {
        const _ = {};
        return (c.imapHost.trim() || c.imapUser.trim()) && (_.imap = {
          host: c.imapHost.trim(),
          port: Number(c.imapPort) || 993,
          ssl: c.imapSsl,
          user: c.imapUser.trim(),
          password: c.imapPassword
        }), (c.smtpHost.trim() || c.smtpUser.trim() || c.from.trim()) && (_.smtp = {
          host: c.smtpHost.trim(),
          port: Number(c.smtpPort) || 465,
          secure: c.smtpSecure,
          user: c.smtpUser.trim(),
          password: c.smtpPassword,
          from: c.from.trim(),
          fromName: c.fromName.trim() || "0KAY"
        }), { id: c.id.trim() || "mail", transport: "builtin", builtin: "mail", enabled: c.enabled, options: _ };
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
        const _ = c.argsText.split(`
`).map((C) => C.trim()).filter(Boolean);
        _.length && (m.args = _);
      }
      return m;
    }
    function d(c) {
      c.transport === "builtin" && (c.id = "mail");
    }
    function r() {
      const c = p();
      s.value.some((m) => m.transport === "builtin") && (c.transport = "stdio"), s.value.push(c);
    }
    async function t() {
      y.value = !0, $.value = "";
      try {
        const m = (await pe("/api/settings/mcp"))?.values?.servers;
        let _ = [];
        if (typeof m == "string" && m.trim())
          try {
            const C = JSON.parse(m);
            Array.isArray(C) && (_ = C);
          } catch {
            $.value = "已保存的 MCP 配置不是合法 JSON，已忽略。";
          }
        s.value = _.map(k);
      } catch (c) {
        $.value = c?.message || String(c);
      } finally {
        y.value = !1;
      }
    }
    async function o() {
      if (!g.value) {
        g.value = !0, $.value = "", w.value = !1;
        try {
          const c = /* @__PURE__ */ new Set(), m = s.value.map(P).filter((_) => {
            const C = String(_.id || "").trim();
            return !C || c.has(C) ? !1 : (c.add(C), !0);
          });
          await Ce("/api/settings/mcp", { values: { servers: JSON.stringify(m) } }), w.value = !0, setTimeout(() => {
            w.value = !1;
          }, 2e3);
        } catch (c) {
          $.value = c?.message || String(c);
        } finally {
          g.value = !1;
        }
      }
    }
    return ie(t), (c, m) => (a(), u("div", ai, [
      e("header", ii, [
        m[0] || (m[0] = e("div", null, [
          e("h2", null, "MCP 服务"),
          e("p", { class: "subtitle" }, "配置外部 MCP（模型上下文协议）服务。保存后 Agent 与 L.I.F.E 共用同一份配置。")
        ], -1)),
        e("div", ri, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: r
          }, "添加服务"),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: g.value,
            onClick: o
          }, n(g.value ? "保存中…" : "保存"), 9, ui)
        ])
      ]),
      $.value ? (a(), u("div", di, n($.value), 1)) : U("", !0),
      w.value ? (a(), u("div", ci, "已保存")) : U("", !0),
      y.value ? (a(), u("p", pi, "加载中…")) : (a(), u("div", vi, [
        (a(!0), u(K, null, q(s.value, (_, C) => (a(), u("article", {
          key: C,
          class: J(["mcp-card", { "is-builtin": _.transport === "builtin" }])
        }, [
          e("div", hi, [
            e("label", mi, [
              m[1] || (m[1] = e("span", null, "ID", -1)),
              V(e("input", {
                "onUpdate:modelValue": (v) => _.id = v,
                readonly: _.transport === "builtin",
                placeholder: "filesystem"
              }, null, 8, _i), [
                [D, _.id]
              ])
            ]),
            e("label", gi, [
              m[3] || (m[3] = e("span", null, "传输", -1)),
              V(e("select", {
                "onUpdate:modelValue": (v) => _.transport = v,
                onChange: (v) => d(_)
              }, [...m[2] || (m[2] = [
                e("option", { value: "stdio" }, "stdio", -1),
                e("option", { value: "http" }, "http", -1),
                e("option", { value: "builtin" }, "内置邮件 (mail)", -1)
              ])], 40, bi), [
                [st, _.transport]
              ])
            ]),
            e("label", yi, [
              V(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (v) => _.enabled = v
              }, null, 8, fi), [
                [te, _.enabled]
              ]),
              m[4] || (m[4] = e("span", null, "启用", -1))
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (v) => s.value.splice(C, 1)
            }, "删除", 8, ki)
          ]),
          _.transport === "stdio" ? (a(), u(K, { key: 0 }, [
            e("label", wi, [
              m[5] || (m[5] = e("span", null, "命令", -1)),
              V(e("input", {
                "onUpdate:modelValue": (v) => _.command = v,
                placeholder: "npx"
              }, null, 8, $i), [
                [D, _.command]
              ])
            ]),
            e("label", Ci, [
              m[6] || (m[6] = e("span", null, "参数（每行一个）", -1)),
              V(e("textarea", {
                "onUpdate:modelValue": (v) => _.argsText = v,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, Si), [
                [D, _.argsText]
              ])
            ])
          ], 64)) : _.transport === "http" ? (a(), u(K, { key: 1 }, [
            e("label", Pi, [
              m[7] || (m[7] = e("span", null, "URL", -1)),
              V(e("input", {
                "onUpdate:modelValue": (v) => _.url = v,
                placeholder: "https://example.com/mcp"
              }, null, 8, xi), [
                [D, _.url]
              ])
            ]),
            e("label", Mi, [
              m[8] || (m[8] = e("span", null, "Headers（JSON）", -1)),
              V(e("textarea", {
                "onUpdate:modelValue": (v) => _.headersText = v,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, Ui), [
                [D, _.headersText]
              ])
            ])
          ], 64)) : (a(), u(K, { key: 2 }, [
            m[23] || (m[23] = e("p", { class: "builtin-note" }, [
              G("内置 0kay-mcp 邮件服务器：L.I.F.E 的 "),
              e("code", null, "getmail"),
              G(" / "),
              e("code", null, "sendmail"),
              G(" 工具经此收发邮件。留空表示不启用对应方向。")
            ], -1)),
            e("div", Ei, [
              e("div", Ai, [
                m[14] || (m[14] = e("p", { class: "mail-label" }, "收信 · IMAP", -1)),
                e("label", Ti, [
                  m[9] || (m[9] = e("span", null, "主机", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => _.imapHost = v,
                    placeholder: "imap.example.com",
                    autocomplete: "off"
                  }, null, 8, Ni), [
                    [D, _.imapHost]
                  ])
                ]),
                e("div", Vi, [
                  e("label", Ii, [
                    m[10] || (m[10] = e("span", null, "端口", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (v) => _.imapPort = v,
                      type: "number",
                      placeholder: "993"
                    }, null, 8, Ri), [
                      [
                        D,
                        _.imapPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", Oi, [
                    V(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (v) => _.imapSsl = v
                    }, null, 8, Li), [
                      [te, _.imapSsl]
                    ]),
                    m[11] || (m[11] = e("span", null, "SSL", -1))
                  ])
                ]),
                e("label", zi, [
                  m[12] || (m[12] = e("span", null, "用户名", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => _.imapUser = v,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, Di), [
                    [D, _.imapUser]
                  ])
                ]),
                e("label", Fi, [
                  m[13] || (m[13] = e("span", null, "密码 / 应用专用密码", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => _.imapPassword = v,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, Bi), [
                    [D, _.imapPassword]
                  ])
                ])
              ]),
              e("div", Ki, [
                m[22] || (m[22] = e("p", { class: "mail-label" }, "发信 · SMTP", -1)),
                e("label", Hi, [
                  m[15] || (m[15] = e("span", null, "主机", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => _.smtpHost = v,
                    placeholder: "smtp.example.com",
                    autocomplete: "off"
                  }, null, 8, ji), [
                    [D, _.smtpHost]
                  ])
                ]),
                e("div", Yi, [
                  e("label", Ji, [
                    m[16] || (m[16] = e("span", null, "端口", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (v) => _.smtpPort = v,
                      type: "number",
                      placeholder: "465"
                    }, null, 8, Wi), [
                      [
                        D,
                        _.smtpPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", qi, [
                    V(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (v) => _.smtpSecure = v
                    }, null, 8, Gi), [
                      [te, _.smtpSecure]
                    ]),
                    m[17] || (m[17] = e("span", null, "SSL（465）", -1))
                  ])
                ]),
                e("label", Xi, [
                  m[18] || (m[18] = e("span", null, "用户名", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => _.smtpUser = v,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, Zi), [
                    [D, _.smtpUser]
                  ])
                ]),
                e("label", Qi, [
                  m[19] || (m[19] = e("span", null, "密码 / 应用专用密码", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (v) => _.smtpPassword = v,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, er), [
                    [D, _.smtpPassword]
                  ])
                ]),
                e("div", tr, [
                  e("label", sr, [
                    m[20] || (m[20] = e("span", null, "发件人地址（可选）", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (v) => _.from = v,
                      placeholder: "留空用 SMTP 用户名",
                      autocomplete: "off"
                    }, null, 8, lr), [
                      [D, _.from]
                    ])
                  ]),
                  e("label", or, [
                    m[21] || (m[21] = e("span", null, "发件人昵称", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (v) => _.fromName = v,
                      placeholder: "0KAY",
                      autocomplete: "off"
                    }, null, 8, nr), [
                      [D, _.fromName]
                    ])
                  ])
                ])
              ])
            ])
          ], 64))
        ], 2))), 128)),
        s.value.length ? U("", !0) : (a(), u("p", ar, "还没有 MCP 服务，点击「添加服务」。传输选择「内置邮件」可配置邮箱收发。"))
      ]))
    ]));
  }
}), rr = /* @__PURE__ */ ue(ir, [["__scopeId", "data-v-35a85711"]]), ur = { class: "content-card danger" }, dr = { class: "card-desc" }, cr = { class: "danger-box" }, pr = /* @__PURE__ */ ee({
  __name: "DangerPanel",
  setup(z) {
    const { t: s } = re(), y = Ve(), g = je();
    function $() {
      y.resetWizard(), g.push("/");
    }
    return (w, p) => (a(), u("div", ur, [
      e("h2", null, n(l(s)("settings.tabs.danger")), 1),
      e("p", dr, n(l(s)("settings.resetDesc")), 1),
      e("div", cr, [
        e("div", null, [
          e("strong", null, n(l(s)("settings.reset")), 1),
          e("p", null, n(l(s)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          onClick: $
        }, n(l(s)("settings.reset")), 1)
      ])
    ]));
  }
}), vr = {
  key: 1,
  class: "plugin-pane-message"
}, hr = {
  key: 2,
  class: "plugin-pane-message"
}, mr = /* @__PURE__ */ ee({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(z) {
    const s = z, y = Oe(null), g = Oe("");
    return He(
      () => s.module,
      async ($) => {
        if (!$) {
          y.value = null, g.value = "";
          return;
        }
        try {
          const w = await import(
            /* @vite-ignore */
            $
          );
          y.value = w?.default || w, g.value = "";
        } catch (w) {
          y.value = null, g.value = w?.message || String(w);
        }
      },
      { immediate: !0 }
    ), ($, w) => y.value ? (a(), le(lt(y.value), { key: 0 })) : g.value ? (a(), u("div", vr, n(g.value), 1)) : (a(), u("div", hr, "Loading plugin module…"));
  }
}), _r = /* @__PURE__ */ ue(mr, [["__scopeId", "data-v-2d1f36bc"]]), gr = { class: "models-field" }, br = {
  key: 0,
  class: "models-list"
}, yr = { class: "models-rank" }, fr = ["title"], kr = { class: "models-actions" }, wr = ["disabled", "aria-label", "onClick"], $r = ["disabled", "aria-label", "onClick"], Cr = ["aria-label", "onClick"], Sr = {
  key: 1,
  class: "models-empty"
}, Pr = /* @__PURE__ */ ee({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(z, { emit: s }) {
    const { locale: y } = re(), g = z, $ = s, w = W(() => String(g.modelValue || "").split(",").map((t) => t.trim()).filter(Boolean)), p = W(() => g.options.filter((t) => !w.value.includes(t)));
    function k(t) {
      $("update:modelValue", t.join(","));
    }
    function P(t) {
      t && !w.value.includes(t) && k([...w.value, t]);
    }
    function d(t) {
      k(w.value.filter((o) => o !== t));
    }
    function r(t, o) {
      const c = [...w.value], m = t + o;
      m < 0 || m >= c.length || ([c[t], c[m]] = [c[m], c[t]], k(c));
    }
    return (t, o) => (a(), u("div", gr, [
      w.value.length ? (a(), u("ol", br, [
        (a(!0), u(K, null, q(w.value, (c, m) => (a(), u("li", { key: c }, [
          e("span", yr, n(m + 1), 1),
          e("span", {
            class: "models-name",
            title: c
          }, n(c), 9, fr),
          e("span", kr, [
            e("button", {
              type: "button",
              disabled: m === 0,
              "aria-label": l(y) === "en" ? "Higher priority" : "提高优先级",
              onClick: (_) => r(m, -1)
            }, "↑", 8, wr),
            e("button", {
              type: "button",
              disabled: m === w.value.length - 1,
              "aria-label": l(y) === "en" ? "Lower priority" : "降低优先级",
              onClick: (_) => r(m, 1)
            }, "↓", 8, $r),
            e("button", {
              type: "button",
              "aria-label": l(y) === "en" ? "Remove" : "移除",
              onClick: (_) => d(c)
            }, "✕", 8, Cr)
          ])
        ]))), 128))
      ])) : (a(), u("p", Sr, n(l(y) === "en" ? "No fallback models — provider catalog order is used." : "暂无备选模型，将按供应商目录顺序尝试。"), 1)),
      p.value.length ? (a(), le(l(de), {
        key: 2,
        options: p.value,
        "model-value": "",
        placeholder: l(y) === "en" ? "+ Add fallback model…" : "+ 添加备选模型…",
        "onUpdate:modelValue": P
      }, null, 8, ["options", "placeholder"])) : U("", !0)
    ]));
  }
}), Ke = /* @__PURE__ */ ue(Pr, [["__scopeId", "data-v-b73b6842"]]), xr = { class: "settings-page" }, Mr = { class: "page-header" }, Ur = { class: "subtitle" }, Er = { key: 0 }, Ar = { key: 1 }, Tr = { class: "settings-layout" }, Nr = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, Vr = ["onClick"], Ir = {
  class: "nav-icon",
  "aria-hidden": "true"
}, Rr = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Or = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Lr = {
  key: 2,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, zr = {
  key: 3,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Dr = {
  key: 4,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Fr = {
  key: 5,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Br = {
  key: 6,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Kr = {
  key: 7,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Hr = {
  key: 8,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, jr = {
  key: 9,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Yr = {
  key: 10,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Jr = {
  key: 11,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Wr = { class: "nav-label" }, qr = { class: "settings-content" }, Gr = {
  key: 0,
  class: "content-card provider-runtime"
}, Xr = {
  key: 0,
  class: "helper-text"
}, Zr = {
  key: 0,
  class: "toggle-label"
}, Qr = ["checked", "onChange"], eu = { key: 0 }, tu = {
  key: 1,
  class: "helper-text"
}, su = {
  key: 0,
  class: "helper-text"
}, lu = ["type", "value", "onInput"], ou = {
  key: 0,
  class: "helper-text"
}, nu = {
  key: 1,
  class: "helper-text"
}, au = { class: "actions-row" }, iu = {
  key: 4,
  class: "content-card"
}, ru = { class: "card-desc" }, uu = { class: "toggle-label" }, du = { class: "field" }, cu = { class: "model-choices" }, pu = ["value", "checked", "onChange"], vu = ["placeholder"], hu = { class: "helper-text" }, mu = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, _u = { class: "field" }, gu = {
  key: 0,
  class: "helper-text"
}, bu = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, yu = ["value", "checked", "onChange"], fu = ["onClick"], ku = {
  key: 9,
  class: "content-card"
}, wu = {
  key: 0,
  class: "card-desc"
}, $u = {
  key: 1,
  class: "helper-text"
}, Cu = {
  key: 0,
  class: "toggle-label"
}, Su = ["checked", "onChange"], Pu = { key: 0 }, xu = {
  key: 1,
  class: "helper-text"
}, Mu = {
  key: 0,
  class: "helper-text"
}, Uu = {
  key: 0,
  class: "helper-text"
}, Eu = {
  key: 0,
  class: "helper-text"
}, Au = { class: "actions-row" }, Tu = ["disabled"], Nu = {
  key: 0,
  class: "helper-text"
}, Vu = {
  key: 0,
  class: "helper-text"
}, Iu = ["type", "value", "onInput"], Ru = {
  key: 0,
  class: "helper-text"
}, Ou = {
  key: 2,
  class: "helper-text"
}, Lu = { class: "actions-row" }, zu = {
  key: 11,
  class: "content-card"
}, Du = {
  key: 0,
  class: "card-desc"
}, Fu = {
  key: 1,
  class: "card-desc"
}, Bu = {
  key: 0,
  class: "toggle-label"
}, Ku = ["checked", "onChange"], Hu = { key: 0 }, ju = {
  key: 1,
  class: "helper-text"
}, Yu = {
  key: 0,
  class: "helper-text"
}, Ju = {
  key: 0,
  class: "helper-text"
}, Wu = {
  key: 0,
  class: "helper-text"
}, qu = ["type", "value", "onInput"], Gu = {
  key: 0,
  class: "helper-text"
}, Xu = {
  key: 2,
  class: "helper-text"
}, Zu = { class: "actions-row" }, ad = /* @__PURE__ */ ee({
  __name: "SettingsPage",
  setup(z) {
    const { t: s, locale: y } = re(), { confirm: g } = Ne(), $ = Ve(), w = ut(), p = Je(), k = ot(), P = je(), d = W(() => p.settingsTabs.map((h) => ({
      id: h.id,
      icon: h.icon || "chip"
    }))), r = W(() => {
      const h = new Set(p.settingsTabs.map((i) => i.id)), f = new Set(p.removedSettingsIds);
      return w.sections.filter((i) => i.id !== "permissions" && !h.has(i.id) && !f.has(i.id)).map((i) => ({ id: i.id, icon: i.icon || "lock" }));
    }), t = W(() => [...d.value, ...r.value]), o = M("general"), c = M(!1), m = M([]), _ = M(null), C = M(""), v = M({}), I = M(""), R = M(!1), E = M(""), x = M([]), A = W(() => y.value === "en" ? "Auto (by strategy)" : "自动（按策略）"), N = W(() => [
      { value: "", label: A.value },
      ...x.value.map((h) => ({ value: h, label: h }))
    ]);
    async function j() {
      try {
        const h = await fetch("/api/models");
        if (!h.ok) return;
        const f = await h.json();
        x.value = Array.from(new Set((f.models || []).map((i) => String(i.id || "")).filter(Boolean)));
      } catch {
      }
    }
    async function X(h) {
      R.value = !0, E.value = "";
      try {
        const f = await fetch(`/api/settings/${h}/test`, { method: "POST" }), i = f.headers.get("content-type") || "";
        if (f.ok && i.startsWith("audio")) {
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
    const { tabMeta: F, isBuiltinTab: L, isPluginSection: B, tabLabel: O, fieldLabel: ne, fieldHelp: he, pluginSection: Z } = Ie(), me = W(() => L(o.value) ? null : F(o.value)?.module || null);
    function be(h, f) {
      const i = v.value[h]?.[f];
      return typeof i == "boolean" ? i : i === "true" || i === 1 || i === "1";
    }
    function ke(h) {
      if (F(h)?.fields?.length && !L(h)) {
        Pe(h);
        return;
      }
      const i = Z(h);
      if (!i) return;
      const T = {};
      for (const Y of i.fields)
        Y.type === "bool" ? T[Y.key] = Y.default_value === "true" || Y.default_value === "1" : Y.type === "number" ? T[Y.key] = Number(Y.default_value || 0) : T[Y.key] = Y.default_value || "";
      const oe = w.values[h] || {}, se = { ...T };
      for (const Y of i.fields) {
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
      const f = F(h);
      if (!f?.fields?.length) return;
      const i = {};
      for (const T of f.fields)
        T.type === "bool" ? i[T.key] = T.default_value === "true" || T.default_value === "1" : T.type === "number" ? i[T.key] = Number(T.default_value || 0) : i[T.key] = T.default_value || "";
      if (f.loadApi)
        try {
          const T = await fetch(f.loadApi);
          if (T.ok) {
            const oe = await T.json();
            for (const se of f.fields) {
              if (!(se.key in oe)) continue;
              const Y = oe[se.key];
              se.type === "bool" ? i[se.key] = Y === !0 || Y === "true" || Y === 1 || Y === "1" : i[se.key] = Y;
            }
          }
        } catch {
        }
      v.value = { ...v.value, [h]: i };
    }
    async function we(h) {
      const f = F(h);
      I.value = "";
      try {
        const i = v.value[h] || {};
        if (f?.saveApi) {
          const T = await fetch(f.saveApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(i)
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
        await w.saveValues(h, v.value[h] || {}), I.value = s("settings.saved"), setTimeout(() => {
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
      if (await g({
        title: s("settings.live2d"),
        message: `删除模型 ${h.label} 及所在模型文件夹中的全部资源？`,
        confirmLabel: y.value === "en" ? "Delete" : "删除",
        danger: !0
      }))
        try {
          const i = await fetch(`/api/live2d/${encodeURIComponent(h.id)}`, { method: "DELETE" });
          if (!i.ok) throw new Error(await i.text());
          const T = await i.json();
          m.value = T.models || [];
          const oe = h.url.slice(0, h.url.indexOf("/", 15) + 1);
          $.live2d.modelUrl.startsWith(oe) && ($.live2d.modelUrl = "", $.live2d.enabled = !1, $.saveToStorage()), await ce(), C.value = "模型已删除", window.dispatchEvent(new Event("live2d-models-changed"));
        } catch (i) {
          C.value = i.message;
        }
    }
    async function ce() {
      $.saveToStorage();
      const h = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: $.live2d.enabled, model_url: $.live2d.modelUrl } }) });
      if (!h.ok) throw new Error(await h.text());
    }
    function Me() {
      _.value?.click();
    }
    async function Ue(h) {
      const f = h.target, i = f.files;
      if (!(!i || i.length === 0)) {
        C.value = "";
        try {
          const T = new FormData(), oe = [];
          for (const ae of Array.from(i)) {
            const qe = ae.webkitRelativePath || ae.name;
            oe.push(qe), T.append("files", ae, ae.name);
          }
          T.append("paths", JSON.stringify(oe));
          const se = await fetch("/api/live2d", { method: "POST", body: T });
          if (!se.ok) throw new Error(await se.text());
          const Y = await se.json();
          C.value = s("settings.uploadOk"), Y?.models ? m.value = Y.models : await ye(), Y?.model_url && ($.live2d.modelUrl = Y.model_url, $.live2d.enabled = !0, $.saveToStorage(), await ce(), window.dispatchEvent(new Event("live2d-models-changed")));
        } catch (T) {
          C.value = `${s("settings.uploadFail")}：${T.message}`;
        } finally {
          f.value = "";
        }
      }
    }
    ie(async () => {
      $.loadFromStorage();
      const h = k.query.tab;
      h && (o.value = h), ye(), j(), await w.fetchSections();
      for (const f of w.sections) ke(f.id);
    });
    function b(h) {
      o.value = h, L(h) || ke(h), P.replace({ query: { tab: h } });
    }
    function S() {
      $.saveToStorage(), o.value === "live2d" && ce().catch((h) => {
        C.value = h.message;
      }), c.value = !0, setTimeout(() => {
        c.value = !1;
      }, 1500);
    }
    return (h, f) => (a(), u("div", xr, [
      e("header", Mr, [
        e("div", null, [
          e("h1", null, n(l(s)("settings.title")), 1),
          e("p", Ur, n(l(s)("settings.pageDesc")), 1)
        ]),
        o.value !== "about" && !me.value ? (a(), u("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: S
        }, [
          c.value ? (a(), u("span", Er, n(l(s)("settings.saved")), 1)) : (a(), u("span", Ar, n(l(s)("settings.save")), 1))
        ])) : U("", !0)
      ]),
      e("div", Tr, [
        e("nav", Nr, [
          (a(!0), u(K, null, q(t.value, (i) => (a(), u("button", {
            key: i.id,
            class: J(["nav-item", { active: o.value === i.id }]),
            onClick: (T) => b(i.id)
          }, [
            f[19] || (f[19] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", Ir, [
              i.icon === "globe" ? (a(), u("svg", Rr, [...f[7] || (f[7] = [
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
              ])])) : i.icon === "cloud" ? (a(), u("svg", Or, [...f[8] || (f[8] = [
                e("path", {
                  d: "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])])) : i.icon === "chip" ? (a(), u("svg", Lr, [...f[9] || (f[9] = [
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
              ])])) : i.icon === "person" ? (a(), u("svg", zr, [...f[10] || (f[10] = [
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
              ])])) : i.icon === "avatar" ? (a(), u("svg", Dr, [...f[11] || (f[11] = [
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
              ])])) : i.icon === "brightness" ? (a(), u("svg", Fr, [...f[12] || (f[12] = [
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
              ])])) : i.icon === "warn" ? (a(), u("svg", Br, [...f[13] || (f[13] = [
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
              ])])) : i.icon === "info" ? (a(), u("svg", Kr, [...f[14] || (f[14] = [
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
              ])])) : i.icon === "download" ? (a(), u("svg", Hr, [...f[15] || (f[15] = [
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
              ])])) : i.icon === "shield" ? (a(), u("svg", jr, [...f[16] || (f[16] = [
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
              ])])) : i.icon === "link" ? (a(), u("svg", Yr, [...f[17] || (f[17] = [
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
              ])])) : (a(), u("svg", Jr, [...f[18] || (f[18] = [
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
            e("span", Wr, n(l(O)(i.id)), 1)
          ], 10, Vr))), 128))
        ]),
        e("section", qr, [
          o.value === "general" ? (a(), le(Sn, { key: 0 })) : o.value === "connection" ? (a(), le(jn, { key: 1 })) : o.value === "provider" ? (a(), u(K, { key: 2 }, [
            Q(cn),
            l(Z)("provider")?.fields?.length ? (a(), u("div", Gr, [
              e("h3", null, n(l(Z)("provider").label), 1),
              l(Z)("provider").description ? (a(), u("p", Xr, n(l(Z)("provider").description), 1)) : U("", !0),
              (a(!0), u(K, null, q(l(Z)("provider").fields, (i) => (a(), u("div", {
                key: i.key,
                class: "field"
              }, [
                i.type === "bool" ? (a(), u("label", Zr, [
                  e("input", {
                    type: "checkbox",
                    checked: be("provider", i.key),
                    onChange: (T) => v.value = { ...v.value, provider: { ...v.value.provider, [i.key]: T.target.checked } }
                  }, null, 40, Qr),
                  f[20] || (f[20] = e("span", { class: "toggle-slider" }, null, -1)),
                  e("span", null, [
                    e("strong", null, n(i.label), 1),
                    i.help ? (a(), u("br", eu)) : U("", !0),
                    i.help ? (a(), u("small", tu, n(i.help), 1)) : U("", !0)
                  ])
                ])) : i.type === "select" ? (a(), u(K, { key: 1 }, [
                  e("label", null, n(i.label), 1),
                  Q(l(de), {
                    class: "input",
                    "aria-label": i.label,
                    "model-value": String(v.value.provider?.[i.key] ?? ""),
                    options: i.options || [],
                    "onUpdate:modelValue": (T) => v.value = { ...v.value, provider: { ...v.value.provider, [i.key]: T } }
                  }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                  i.help ? (a(), u("p", su, n(i.help), 1)) : U("", !0)
                ], 64)) : (a(), u(K, { key: 2 }, [
                  e("label", null, n(i.label), 1),
                  e("input", {
                    class: "input",
                    type: i.type === "number" ? "number" : "text",
                    value: v.value.provider?.[i.key],
                    onInput: (T) => v.value = { ...v.value, provider: { ...v.value.provider, [i.key]: i.type === "number" ? Number(T.target.value) : T.target.value } }
                  }, null, 40, lu),
                  i.help ? (a(), u("p", ou, n(i.help), 1)) : U("", !0)
                ], 64))
              ]))), 128)),
              I.value ? (a(), u("div", nu, n(I.value), 1)) : U("", !0),
              e("div", au, [
                e("button", {
                  class: "btn btn-primary",
                  type: "button",
                  onClick: f[0] || (f[0] = (i) => $e("provider"))
                }, n(l(s)("settings.save")), 1)
              ])
            ])) : U("", !0)
          ], 64)) : o.value === "persona" ? (a(), le(ua, { key: 3 })) : o.value === "live2d" ? (a(), u("div", iu, [
            e("h2", null, n(l(O)("live2d")), 1),
            e("p", ru, n(l(F)("live2d")?.descriptionKey ? l(s)(l(F)("live2d").descriptionKey) : l(s)("settings.live2dDesc")), 1),
            Q(ct, { class: "live2d-preview" }),
            e("label", uu, [
              V(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": f[1] || (f[1] = (i) => l($).live2d.enabled = i)
              }, null, 512), [
                [te, l($).live2d.enabled]
              ]),
              f[21] || (f[21] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", null, n(l(s)("wizard.enableLive2d")), 1)
            ]),
            e("div", du, [
              e("label", null, n(l(s)("wizard.modelUrl")), 1),
              e("div", cu, [
                (a(!0), u(K, null, q(l(dt), (i) => (a(), u("label", {
                  key: i.id,
                  class: J(["model-choice", { selected: l($).live2d.modelUrl === i.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-model",
                    value: i.url,
                    checked: l($).live2d.modelUrl === i.url,
                    onChange: (T) => {
                      l($).live2d.modelUrl = i.url, l($).live2d.enabled = !0;
                    }
                  }, null, 40, pu),
                  e("span", null, n(i.label), 1),
                  e("code", null, n(i.url), 1)
                ], 2))), 128))
              ]),
              V(e("input", {
                "onUpdate:modelValue": f[2] || (f[2] = (i) => l($).live2d.modelUrl = i),
                placeholder: l(s)("wizard.modelUrlPlaceholder"),
                class: "input"
              }, null, 8, vu), [
                [D, l($).live2d.modelUrl]
              ]),
              e("p", hu, [
                G(n(l(s)("wizard.live2dHelp")) + " ", 1),
                e("a", mu, n(l(s)("wizard.live2dSamples")), 1)
              ])
            ]),
            f[22] || (f[22] = e("p", { class: "helper-text" }, "支持 Cubism 2（.model.json + .moc）与 Cubism 3/4（.model3.json + .moc3）。请选择完整模型文件夹，包含纹理、动作等资源。", -1)),
            e("button", {
              class: "btn btn-tonal",
              onClick: f[3] || (f[3] = (i) => ce().catch((T) => C.value = T.message))
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
                ref: _,
                type: "file",
                webkitdirectory: "",
                directory: "",
                multiple: "",
                class: "file-input",
                onChange: Ue
              }, null, 544),
              C.value ? (a(), u("p", gu, n(C.value), 1)) : U("", !0),
              m.value.length ? (a(), u("div", bu, [
                (a(!0), u(K, null, q(m.value, (i) => (a(), u("label", {
                  key: i.id,
                  class: J(["model-choice", { selected: l($).live2d.modelUrl === i.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-uploaded",
                    value: i.url,
                    checked: l($).live2d.modelUrl === i.url,
                    onChange: (T) => {
                      l($).live2d.modelUrl = i.url, l($).live2d.enabled = !0, ce().catch((oe) => C.value = oe.message);
                    }
                  }, null, 40, yu),
                  e("span", null, n(i.label), 1),
                  e("code", null, n(i.url), 1),
                  e("button", {
                    type: "button",
                    class: "btn btn-danger",
                    onClick: Le((T) => xe(i), ["prevent"])
                  }, "删除模型", 8, fu)
                ], 2))), 128))
              ])) : U("", !0)
            ])
          ])) : o.value === "security" ? (a(), le(ni, { key: 5 })) : o.value === "permissions" ? (a(), le(ka, { key: 6 })) : o.value === "mcp" ? (a(), le(rr, { key: 7 })) : o.value === "life_settings" ? (a(), le(Wt, { key: 8 })) : l(B)(o.value) && l(Z)(o.value) ? (a(), u("div", ku, [
            e("h2", null, n(l(Z)(o.value).label), 1),
            l(Z)(o.value).description ? (a(), u("p", wu, n(l(Z)(o.value).description), 1)) : U("", !0),
            l(Z)(o.value).plugin_name ? (a(), u("p", $u, n(l(Z)(o.value).plugin_name), 1)) : U("", !0),
            (a(!0), u(K, null, q(l(Z)(o.value).fields, (i) => (a(), u("div", {
              key: i.key,
              class: "field"
            }, [
              i.type === "bool" ? (a(), u("label", Cu, [
                e("input", {
                  type: "checkbox",
                  checked: be(o.value, i.key),
                  onChange: (T) => v.value = { ...v.value, [o.value]: { ...v.value[o.value], [i.key]: T.target.checked } }
                }, null, 40, Su),
                f[23] || (f[23] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, n(i.label), 1),
                  i.help ? (a(), u("br", Pu)) : U("", !0),
                  i.help ? (a(), u("small", xu, n(i.help), 1)) : U("", !0)
                ])
              ])) : i.type === "select" ? (a(), u(K, { key: 1 }, [
                e("label", null, n(i.label), 1),
                Q(l(de), {
                  class: "input",
                  "aria-label": i.label,
                  "model-value": String(v.value[o.value]?.[i.key] ?? ""),
                  options: i.options || [],
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [i.key]: T }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                i.help ? (a(), u("p", Mu, n(i.help), 1)) : U("", !0)
              ], 64)) : i.type === "model" ? (a(), u(K, { key: 2 }, [
                e("label", null, n(i.label), 1),
                Q(l(de), {
                  class: "input",
                  "aria-label": i.label,
                  "model-value": String(v.value[o.value]?.[i.key] ?? ""),
                  options: N.value,
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [i.key]: T }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                i.help ? (a(), u("p", Uu, n(i.help), 1)) : U("", !0)
              ], 64)) : i.type === "models" ? (a(), u(K, { key: 3 }, [
                e("label", null, n(i.label), 1),
                Q(Ke, {
                  "model-value": String(v.value[o.value]?.[i.key] ?? ""),
                  options: x.value,
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [i.key]: T }
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                i.help ? (a(), u("p", Eu, n(i.help), 1)) : U("", !0)
              ], 64)) : i.type === "test" ? (a(), u(K, { key: 4 }, [
                e("label", null, n(i.label), 1),
                e("div", Au, [
                  e("button", {
                    class: "btn btn-tonal",
                    type: "button",
                    disabled: R.value,
                    onClick: f[4] || (f[4] = (T) => X(o.value))
                  }, n(R.value ? l(s)("settings.testing") : i.label || "测试"), 9, Tu),
                  E.value ? (a(), u("span", Nu, n(E.value), 1)) : U("", !0)
                ]),
                i.help ? (a(), u("p", Vu, n(i.help), 1)) : U("", !0)
              ], 64)) : (a(), u(K, { key: 5 }, [
                e("label", null, n(i.label), 1),
                e("input", {
                  class: "input",
                  type: i.type === "number" ? "number" : "text",
                  value: v.value[o.value]?.[i.key],
                  onInput: (T) => v.value[o.value] = { ...v.value[o.value], [i.key]: i.type === "number" ? Number(T.target.value) : T.target.value }
                }, null, 40, Iu),
                i.help ? (a(), u("p", Ru, n(i.help), 1)) : U("", !0)
              ], 64))
            ]))), 128)),
            I.value ? (a(), u("div", Ou, n(I.value), 1)) : U("", !0),
            e("div", Lu, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: f[5] || (f[5] = (i) => $e(o.value))
              }, n(l(s)("settings.save")), 1)
            ])
          ])) : me.value ? (a(), le(_r, {
            key: me.value,
            module: me.value || ""
          }, null, 8, ["module"])) : !l(L)(o.value) && l(F)(o.value)?.fields?.length ? (a(), u("div", zu, [
            e("h2", null, n(l(O)(o.value)), 1),
            l(F)(o.value)?.descriptionKey ? (a(), u("p", Du, n(l(s)(l(F)(o.value).descriptionKey)), 1)) : l(F)(o.value)?.description ? (a(), u("p", Fu, n(l(F)(o.value).description), 1)) : U("", !0),
            (a(!0), u(K, null, q(l(F)(o.value).fields, (i) => (a(), u("div", {
              key: i.key,
              class: "field"
            }, [
              i.type === "bool" ? (a(), u("label", Bu, [
                e("input", {
                  type: "checkbox",
                  checked: be(o.value, i.key),
                  onChange: (T) => v.value = { ...v.value, [o.value]: { ...v.value[o.value], [i.key]: T.target.checked } }
                }, null, 40, Ku),
                f[24] || (f[24] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, n(l(ne)(l(F)(o.value), i.key, `settings.${i.key}`)), 1),
                  i.help || i.helpKey ? (a(), u("br", Hu)) : U("", !0),
                  i.help || i.helpKey ? (a(), u("small", ju, n(l(he)(l(F)(o.value), i.key, `settings.${i.key}Desc`)), 1)) : U("", !0)
                ])
              ])) : i.type === "select" ? (a(), u(K, { key: 1 }, [
                e("label", null, n(l(ne)(l(F)(o.value), i.key, `settings.${i.key}`)), 1),
                Q(l(de), {
                  class: "input",
                  "aria-label": l(ne)(l(F)(o.value), i.key, `settings.${i.key}`),
                  "model-value": String(v.value[o.value]?.[i.key] ?? ""),
                  options: i.options || [],
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [i.key]: T }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                i.help || i.helpKey ? (a(), u("p", Yu, n(l(he)(l(F)(o.value), i.key, `settings.${i.key}Desc`)), 1)) : U("", !0)
              ], 64)) : i.type === "model" ? (a(), u(K, { key: 2 }, [
                e("label", null, n(l(ne)(l(F)(o.value), i.key, `settings.${i.key}`)), 1),
                Q(l(de), {
                  class: "input",
                  "aria-label": l(ne)(l(F)(o.value), i.key, `settings.${i.key}`),
                  "model-value": String(v.value[o.value]?.[i.key] ?? ""),
                  options: N.value,
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [i.key]: T }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                i.help || i.helpKey ? (a(), u("p", Ju, n(l(he)(l(F)(o.value), i.key, `settings.${i.key}Desc`)), 1)) : U("", !0)
              ], 64)) : i.type === "models" ? (a(), u(K, { key: 3 }, [
                e("label", null, n(l(ne)(l(F)(o.value), i.key, `settings.${i.key}`)), 1),
                Q(Ke, {
                  "model-value": String(v.value[o.value]?.[i.key] ?? ""),
                  options: x.value,
                  "onUpdate:modelValue": (T) => v.value[o.value] = { ...v.value[o.value], [i.key]: T }
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                i.help || i.helpKey ? (a(), u("p", Wu, n(l(he)(l(F)(o.value), i.key, `settings.${i.key}Desc`)), 1)) : U("", !0)
              ], 64)) : (a(), u(K, { key: 4 }, [
                e("label", null, n(l(ne)(l(F)(o.value), i.key, `settings.${i.key}`)), 1),
                e("input", {
                  class: "input",
                  type: i.type === "number" ? "number" : "text",
                  value: v.value[o.value]?.[i.key],
                  onInput: (T) => v.value[o.value] = { ...v.value[o.value], [i.key]: i.type === "number" ? Number(T.target.value) : T.target.value }
                }, null, 40, qu),
                i.help || i.helpKey ? (a(), u("p", Gu, n(l(he)(l(F)(o.value), i.key, `settings.${i.key}Desc`)), 1)) : U("", !0)
              ], 64))
            ]))), 128)),
            I.value ? (a(), u("div", Xu, n(I.value), 1)) : U("", !0),
            e("div", Zu, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: f[6] || (f[6] = (i) => we(o.value))
              }, n(l(s)("settings.save")), 1)
            ])
          ])) : o.value === "about" ? (a(), le(Qs, { key: 12 })) : o.value === "updates" ? (a(), le(Fl, { key: 13 })) : (a(), le(pr, { key: 14 }))
        ])
      ])
    ]));
  }
});
export {
  ad as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".live2d-stage[data-v-594879d8]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-594879d8]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:none;cursor:grab;user-select:none;background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,#f3edf7,#e7e0ec 55%,#d0bcff33)}.stage-viewport[data-v-594879d8]:active{cursor:grabbing}.stage-canvas[data-v-594879d8]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-594879d8]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-594879d8]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-594879d8]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-594879d8]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-594879d8]:active{transform:scale(.96)}.stage-reset.dragging[data-v-594879d8]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-594879d8]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-594879d8]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-594879d8]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-bdd613ec]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-bdd613ec]{flex-direction:row-reverse}.avatar[data-v-bdd613ec]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-bdd613ec]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-bdd613ec]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-bdd613ec]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-bdd613ec]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-bdd613ec]{max-width:70%}.content[data-v-bdd613ec]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.user .content[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-bdd613ec]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-bdd613ec]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-bdd613ec]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-bdd613ec]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-bdd613ec]{margin:4px 0}.think-body b[data-v-bdd613ec]{color:var(--md-on-surface)}.think-summary[data-v-bdd613ec]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-bdd613ec]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-bdd613ec]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-bdd613ec]{justify-content:flex-end}.separator[data-v-bdd613ec]{color:var(--neutral-gray-10)}.emotion[data-v-bdd613ec]{font-weight:500}.chat-panel[data-v-3b7db97c]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-3b7db97c]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-3b7db97c]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-3b7db97c]{color:var(--md-error)}.chat-container[data-v-3b7db97c]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-3b7db97c]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-3b7db97c]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-3b7db97c]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-3b7db97c]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-3b7db97c]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-3b7db97c]{display:flex;gap:4px}.typing-dots span[data-v-3b7db97c]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-3b7db97c 1.4s infinite ease-in-out}.typing-dots span[data-v-3b7db97c]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-3b7db97c]:nth-child(2){animation-delay:-.16s}@keyframes bounce-3b7db97c{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-3b7db97c]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-3b7db97c]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-3b7db97c]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-3b7db97c]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-3b7db97c]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-3b7db97c],.pending-files[data-v-3b7db97c]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-3b7db97c]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-3b7db97c]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-3b7db97c]:hover{color:var(--error)}.pending-thumb[data-v-3b7db97c]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-3b7db97c]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-3b7db97c]{position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.attach-btn[data-v-3b7db97c]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-3b7db97c]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-3b7db97c]:disabled{opacity:.5;cursor:not-allowed}.send-button[data-v-3b7db97c]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-3b7db97c]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-3b7db97c]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-3b7db97c]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-3b7db97c]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-3b7db97c]{background:var(--success)}.disconnected .status-dot[data-v-3b7db97c]{background:var(--error)}.hint[data-v-3b7db97c]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-95ba671e]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-95ba671e]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-95ba671e]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-95ba671e]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-95ba671e]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-95ba671e]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-95ba671e]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-95ba671e]{margin-bottom:var(--space-xl)}.section-header[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-95ba671e]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.section-value[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-30)}.mood-display[data-v-95ba671e]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-95ba671e]{margin-bottom:var(--space-md)}.mood-label[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600}.energy-bar[data-v-95ba671e]{height:8px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.energy-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out),background-color var(--duration-medium) var(--ease-out)}.emotion-bars[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-95ba671e]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-95ba671e]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-95ba671e]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.task-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-id[data-v-95ba671e]{font-family:monospace;font-size:var(--font-size-sm);color:var(--neutral-gray-50)}.task-status[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary)}.connection-info[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-sm);font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.link-btn[data-v-95ba671e]{border:none;background:none;color:var(--brand-primary);font-size:var(--font-size-xs);cursor:pointer;padding:0}.link-btn[data-v-95ba671e]:disabled{opacity:.5;cursor:default}.memory-stats[data-v-95ba671e]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);margin-bottom:var(--space-sm)}.memory-stat[data-v-95ba671e]{padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);text-align:center}.memory-stat-label[data-v-95ba671e]{display:block;font-size:var(--font-size-xs);color:var(--neutral-gray-30);margin-bottom:2px}.memory-stat-value[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-50)}.memory-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-xs)}.memory-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-sm);padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);font-size:var(--font-size-sm)}.memory-text[data-v-95ba671e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--neutral-gray-50)}.memory-strength[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary);font-weight:600}.connection-dot[data-v-95ba671e]{width:8px;height:8px;border-radius:50%;background:var(--error)}.connection-dot.connected[data-v-95ba671e]{background:var(--success)}.state-source[data-v-95ba671e]{margin-left:auto;font-size:var(--font-size-xs);font-weight:700;color:var(--brand-primary);letter-spacing:.5px}.agents-display[data-v-95ba671e]{padding:var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.agent-count[data-v-95ba671e]{display:flex;align-items:baseline;gap:var(--space-sm)}.agent-number[data-v-95ba671e]{font-size:var(--font-size-xl);font-weight:700;color:var(--neutral-gray-30)}.agent-number.online[data-v-95ba671e]{color:var(--success)}.agent-label[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.agent-offline[data-v-95ba671e]{margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.chat-page[data-v-d95e8000]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-d95e8000]{grid-template-columns:1fr}.stage-column[data-v-d95e8000]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-d95e8000]{flex:1;min-height:240px}.status-panel[data-v-d95e8000]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-d95e8000]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-d95e8000]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-d95e8000]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-d95e8000]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-d95e8000]:hover,.page-resizer[data-v-d95e8000]:active{background:var(--md-primary)}.chat-column[data-v-d95e8000]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-d95e8000]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-d95e8000]{display:flex;flex-direction:column}.stage-column[data-v-d95e8000]{flex:1;min-height:0}.page-resizer[data-v-d95e8000]{display:none}.chat-column[data-v-d95e8000]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);transition:transform var(--transition-normal)}.chat-column.open[data-v-d95e8000]{transform:translate(0)}}.plugins-page[data-v-27522700]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-27522700]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-27522700]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-27522700],.pp-hero h1[data-v-27522700]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-27522700]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-27522700]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-27522700]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.pp-stats[data-v-27522700]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-27522700]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-27522700]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-27522700]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-27522700]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-27522700]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-27522700]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-27522700]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-27522700]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-27522700 var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-27522700{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-27522700]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-27522700]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-27522700]{opacity:.62}.plugin-top[data-v-27522700]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-27522700]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-27522700]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-27522700]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-27522700]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-27522700]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-27522700]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-27522700]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-27522700]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-27522700]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-27522700]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-27522700]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-27522700]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-27522700]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-27522700]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-27522700]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-27522700]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-27522700]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-27522700]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-27522700]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-27522700]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-27522700]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-27522700]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-27522700]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-27522700]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-27522700]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-27522700]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-27522700]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-27522700]{white-space:nowrap}#app .plugins-page .btn[data-v-27522700]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-27522700]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-27522700]:disabled{opacity:.6;cursor:not-allowed}#app .plugins-page .btn-tonal[data-v-27522700]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .plugins-page .btn-danger[data-v-27522700]{background:var(--md-error-container);color:var(--md-on-error-container)}.empty-state[data-v-27522700]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-27522700]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-27522700]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-27522700]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-27522700]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-27522700]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-27522700]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-27522700],.pd-leave-to[data-v-27522700]{opacity:0}.pd-enter-active .pd-dialog[data-v-27522700]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-27522700]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-27522700],.pd-leave-to .pd-dialog[data-v-27522700]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-27522700]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-27522700]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-27522700]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-27522700]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-27522700]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-27522700]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-27522700]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-27522700]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-27522700]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-27522700]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-27522700]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-27522700]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-27522700]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-27522700]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-27522700]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-27522700]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-27522700]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-27522700]{color:var(--md-error)}.pd-foot[data-v-27522700]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-27522700]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn-tonal[data-v-27522700]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pd-foot .btn-danger[data-v-27522700]{background:var(--md-error-container);color:var(--md-on-error-container)}.pd-foot .btn[data-v-27522700]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-27522700],.pd-leave-active[data-v-27522700],.pd-enter-active .pd-dialog[data-v-27522700],.pd-leave-active .pd-dialog[data-v-27522700]{transition:none}.pd-enter-from .pd-dialog[data-v-27522700],.pd-leave-to .pd-dialog[data-v-27522700]{transform:none}}.life-settings[data-v-153238d0]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-153238d0]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-153238d0 .52s var(--ls-spring) both}.ls-hero-main[data-v-153238d0]{min-width:0}.ls-eyebrow[data-v-153238d0]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-153238d0]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-153238d0]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-153238d0]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-153238d0]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-153238d0]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-153238d0]{font-size:16px}.ls-grid[data-v-153238d0]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-153238d0]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-153238d0 .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-153238d0]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-153238d0]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-153238d0]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-153238d0]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-153238d0]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-153238d0]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-153238d0]{grid-column:1 / -1}.ls-card-head[data-v-153238d0]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-153238d0]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-153238d0]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-153238d0]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-153238d0]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-153238d0]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-153238d0]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-153238d0]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-153238d0]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-153238d0]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-153238d0]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-153238d0]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-153238d0]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-153238d0]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-153238d0]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-153238d0]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-153238d0]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-153238d0]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-153238d0]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-153238d0]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-153238d0]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-153238d0]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-153238d0]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-153238d0]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-153238d0]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-153238d0]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-153238d0]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-153238d0]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-153238d0]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-153238d0]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-153238d0]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-153238d0]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-153238d0]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-153238d0]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}.ls-model b[data-v-153238d0]{font-size:13px;word-break:break-all}.ls-model span[data-v-153238d0]{font-size:12px;color:var(--md-on-surface-variant)}.ls-state[data-v-153238d0]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-153238d0 .32s var(--ls-spring) both}@keyframes ls-rise-153238d0{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-153238d0{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-153238d0],.ls-row[data-v-153238d0],.ls-models[data-v-153238d0]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-153238d0],.ls-card[data-v-153238d0],.ls-state[data-v-153238d0]{animation:none}}.about[data-v-f0cbac94]{display:flex;flex-direction:column;gap:26px}.identity[data-v-f0cbac94]{display:flex;align-items:center;gap:16px}.app-icon[data-v-f0cbac94]{flex:none;width:56px;height:56px;border-radius:16px;background:var(--md-primary);color:var(--md-on-primary);display:grid;place-items:center;font-size:20px;font-weight:750;letter-spacing:-1px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 35%,transparent)}.app-id[data-v-f0cbac94]{flex:1;min-width:0}.app-id h2[data-v-f0cbac94]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-f0cbac94]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-f0cbac94]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-f0cbac94]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-f0cbac94]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-f0cbac94]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-f0cbac94]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.btn.sm[data-v-f0cbac94]{height:34px;padding-inline:16px;font-size:13px}.credits[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-f0cbac94]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-f0cbac94]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-f0cbac94]{font-size:16px;font-weight:650}.person-info .role[data-v-f0cbac94]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-f0cbac94]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-f0cbac94]{margin-top:6px}.contribs[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-f0cbac94]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-f0cbac94]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-f0cbac94]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-f0cbac94]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-f0cbac94]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-f0cbac94]{margin-left:auto}.status-chip[data-v-f0cbac94]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-f0cbac94]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-f0cbac94]:hover{text-decoration:underline}.muted[data-v-f0cbac94]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-f0cbac94]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-f0cbac94]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-f0cbac94]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-f0cbac94]{flex:1;min-width:0}.us-hero-text b[data-v-f0cbac94]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-f0cbac94]{font-size:13px;opacity:.85}.us-hero-text em[data-v-f0cbac94]{font-style:normal;font-weight:700}.us-hero-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-f0cbac94]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-f0cbac94]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-f0cbac94]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-f0cbac94]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-f0cbac94]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-f0cbac94]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-f0cbac94]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-f0cbac94]{font-weight:700}.us-apply-label[data-v-f0cbac94]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-f0cbac94]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-f0cbac94]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-f0cbac94]{animation:us-spin-f0cbac94 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-f0cbac94],.us-apply-banner.failed .us-spinner[data-v-f0cbac94]{display:none}.us-apply-log[data-v-f0cbac94],.us-apply-error[data-v-f0cbac94]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-f0cbac94{to{transform:rotate(360deg)}}.alert[data-v-f0cbac94]{color:var(--md-error)}.updates[data-v-6bbe694b]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-6bbe694b]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-6bbe694b]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-6bbe694b]{display:flex;align-items:center;gap:12px}.us-ico[data-v-6bbe694b]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-6bbe694b]{flex:1;min-width:0}.us-title[data-v-6bbe694b]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-6bbe694b]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-6bbe694b]{display:flex;align-items:center;gap:8px}.us-tag[data-v-6bbe694b]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-6bbe694b]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-6bbe694b]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-source[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-6bbe694b]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-6bbe694b]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-6bbe694b]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-6bbe694b]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-6bbe694b]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-6bbe694b]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-6bbe694b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-6bbe694b]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-6bbe694b]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-6bbe694b]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-6bbe694b]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-6bbe694b]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-6bbe694b]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-6bbe694b]{flex:1;min-width:0}.us-hero-text b[data-v-6bbe694b]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-6bbe694b]{font-size:13px;opacity:.85}.us-hero-text em[data-v-6bbe694b]{font-style:normal;font-weight:700}.us-hero-actions[data-v-6bbe694b]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-6bbe694b]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-6bbe694b]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-6bbe694b]{font-weight:700}.us-apply-label[data-v-6bbe694b]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-6bbe694b]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-6bbe694b]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-6bbe694b]{animation:us-spin-6bbe694b .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-6bbe694b],.us-apply-banner.failed .us-spinner[data-v-6bbe694b]{display:none}.us-apply-log[data-v-6bbe694b],.us-apply-error[data-v-6bbe694b]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-6bbe694b{to{transform:rotate(360deg)}}.us-table[data-v-6bbe694b]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-6bbe694b]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-6bbe694b]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-6bbe694b]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-6bbe694b]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-6bbe694b]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-6bbe694b]{background:var(--md-success)}.us-dot.warn[data-v-6bbe694b]{background:#e0a800}.us-dot.bad[data-v-6bbe694b]{background:var(--md-error)}.us-ver[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-6bbe694b]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-6bbe694b]{font-weight:650}.us-ver b.good[data-v-6bbe694b]{color:var(--md-success)}.us-arrow[data-v-6bbe694b]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-6bbe694b]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-6bbe694b]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-6bbe694b]:hover{text-decoration:underline}.us-empty[data-v-6bbe694b]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-6bbe694b]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-6bbe694b]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.btn.sm[data-v-6bbe694b]{height:34px;padding-inline:16px;font-size:13px}.btn.xs[data-v-6bbe694b]{height:30px;padding-inline:12px;font-size:12px}.alert[data-v-6bbe694b]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-6bbe694b]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-6bbe694b]{display:none}.us-hero[data-v-6bbe694b]{flex-wrap:wrap}.us-hero-actions[data-v-6bbe694b]{width:100%}}.provider-panel[data-v-828ee6e3]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-828ee6e3]{display:flex;align-items:center;gap:14px}.pp-back[data-v-828ee6e3]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-828ee6e3]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-828ee6e3]{flex:1;min-width:0}.pp-editor-title h2[data-v-828ee6e3]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-828ee6e3]{margin:3px 0 0}.pp-section[data-v-828ee6e3]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-828ee6e3]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-828ee6e3]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-828ee6e3]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-828ee6e3]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-828ee6e3]{margin-bottom:0}.pp-span[data-v-828ee6e3]{grid-column:1 / -1}.pp-req[data-v-828ee6e3]{color:var(--md-error);margin-left:2px}.pp-key[data-v-828ee6e3]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-828ee6e3]{flex:1}.pp-key-toggle[data-v-828ee6e3]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-828ee6e3]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-828ee6e3]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-828ee6e3]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-828ee6e3]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-828ee6e3]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-828ee6e3]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-828ee6e3]{animation:pp-pulse-828ee6e3 1s ease-in-out infinite}@keyframes pp-pulse-828ee6e3{50%{opacity:.15}}.pp-probe[data-v-828ee6e3]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-828ee6e3]{color:var(--md-success)}.pp-probe.err[data-v-828ee6e3]{color:var(--md-error)}.pp-discovered[data-v-828ee6e3]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-828ee6e3]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-828ee6e3]{flex:1;min-width:160px}.pp-mini[data-v-828ee6e3]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-828ee6e3]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-models[data-v-828ee6e3]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-828ee6e3]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-828ee6e3]:first-child{border-top:0}.pp-model.off[data-v-828ee6e3]{opacity:.5}.pp-model-name[data-v-828ee6e3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-828ee6e3]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-828ee6e3]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-828ee6e3]{color:#e0a800;cursor:default}.pp-switch[data-v-828ee6e3]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-828ee6e3]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-828ee6e3]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-828ee6e3]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-828ee6e3]{display:flex;gap:10px}.pp-list-head[data-v-828ee6e3]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-828ee6e3]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-828ee6e3]{margin:3px 0 0}.pp-list-actions[data-v-828ee6e3]{display:flex;gap:8px}.pp-cards[data-v-828ee6e3]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-828ee6e3]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-828ee6e3]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-828ee6e3]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-828ee6e3]{opacity:.62}.pp-card-head[data-v-828ee6e3]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-828ee6e3]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-828ee6e3]{width:26px;height:26px}.pp-card-id[data-v-828ee6e3]{flex:1;min-width:0}.pp-card-id strong[data-v-828ee6e3]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-828ee6e3]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-828ee6e3]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-828ee6e3]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-828ee6e3]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-828ee6e3]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-828ee6e3]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-828ee6e3]{color:var(--md-error)}.pp-chips[data-v-828ee6e3]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-828ee6e3]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-828ee6e3],.pp-chip.empty[data-v-828ee6e3]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-828ee6e3]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.btn.sm[data-v-828ee6e3]{height:32px;padding-inline:12px;font-size:12.5px}.btn.xs[data-v-828ee6e3]{height:28px;padding-inline:12px;font-size:12px}.pp-empty[data-v-828ee6e3]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-828ee6e3],.pp-cards[data-v-828ee6e3]{grid-template-columns:1fr}}.pairing-panel[data-v-0559b1b2]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-0559b1b2]{margin:12px 0;color:var(--md-on-surface-variant)}article[data-v-0559b1b2]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-0559b1b2]{font-size:24px;letter-spacing:4px}button[data-v-0559b1b2]{padding:8px 12px}.connection-grid[data-v-deea7b8b]{display:grid;grid-template-columns:minmax(280px,1fr) auto;gap:24px;align-items:start}@media(max-width:760px){.connection-grid[data-v-deea7b8b]{grid-template-columns:1fr}}.connection-form .field[data-v-deea7b8b]{margin-bottom:12px}.connection-qr[data-v-deea7b8b]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-deea7b8b]{background:#fff;border-radius:8px;padding:6px}.connection-link[data-v-deea7b8b]{max-width:280px;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.toggle-label[data-v-deea7b8b]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-b1d117f0]{max-width:920px}.sec-stack[data-v-b1d117f0]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-b1d117f0]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-b1d117f0]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-b1d117f0]{font-size:15px;font-weight:700}.sec-chip[data-v-b1d117f0]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-b1d117f0]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-b1d117f0]{margin:2px 0 12px}.sec-pin-grid[data-v-b1d117f0]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-b1d117f0]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-b1d117f0]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-b1d117f0]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-b1d117f0]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-b1d117f0]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-b1d117f0]:hover{background:var(--md-surface-container)}.page-item[data-v-b1d117f0]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-b1d117f0]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-b1d117f0]{width:44px;height:26px}.page-item .toggle-slider[data-v-b1d117f0]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-b1d117f0]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-b1d117f0]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-b1d117f0]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-b1d117f0]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-b1d117f0]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-b1d117f0]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-b1d117f0]{margin-top:12px}.sec-error[data-v-b1d117f0]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-b1d117f0]{grid-template-columns:1fr}}.mcp-panel[data-v-35a85711]{max-width:900px}.mcp-head[data-v-35a85711]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-35a85711]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-35a85711]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-35a85711]{display:flex;gap:10px}.error-banner[data-v-35a85711]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-35a85711]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-35a85711]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-35a85711]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-35a85711]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-35a85711]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-35a85711]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-35a85711]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-35a85711]{flex:1}.mcp-field>span[data-v-35a85711]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-35a85711],.mcp-field select[data-v-35a85711],.mcp-field textarea[data-v-35a85711]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-35a85711]{opacity:.7}.mcp-field textarea[data-v-35a85711]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-35a85711]:focus,.mcp-field select[data-v-35a85711]:focus,.mcp-field textarea[data-v-35a85711]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-35a85711]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-35a85711]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-35a85711]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-35a85711]{font-family:ui-monospace,monospace}.mail-grid[data-v-35a85711]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-35a85711]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-35a85711]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-35a85711]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-35a85711]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-35a85711]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-35a85711]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-35a85711]:disabled{opacity:.6;cursor:not-allowed}@media(max-width:720px){.mail-grid[data-v-35a85711]{grid-template-columns:1fr}}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.models-field[data-v-b73b6842]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-b73b6842]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-b73b6842]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-b73b6842]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-b73b6842]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-b73b6842]{display:inline-flex;gap:4px}.models-actions button[data-v-b73b6842]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-b73b6842]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-b73b6842]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-b73b6842]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.usage-page[data-v-a7476de1]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-a7476de1]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-a7476de1]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-a7476de1]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-a7476de1]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-a7476de1]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-a7476de1]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-a7476de1]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .usage-page .btn[data-v-a7476de1]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-a7476de1]:disabled{opacity:.55;cursor:not-allowed}#app .usage-page .btn-tonal[data-v-a7476de1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .usage-page .btn-danger[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.overview[data-v-a7476de1]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-a7476de1]{display:grid;place-items:center}.donut[data-v-a7476de1]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-a7476de1]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-a7476de1]{fill:none;stroke-width:5}.donut-track[data-v-a7476de1]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-a7476de1]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-a7476de1]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-a7476de1]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-a7476de1]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-a7476de1]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-a7476de1]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-a7476de1]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-a7476de1]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-a7476de1]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-a7476de1]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-a7476de1]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-a7476de1]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-a7476de1]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-a7476de1]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-a7476de1]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-a7476de1]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-a7476de1]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-a7476de1]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-a7476de1]{background:var(--md-primary)}.dot.completion[data-v-a7476de1]{background:var(--md-tertiary)}.mini-stack[data-v-a7476de1]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-a7476de1]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-a7476de1]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-a7476de1]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-a7476de1]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-a7476de1]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-a7476de1]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-a7476de1]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-a7476de1]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-a7476de1]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-a7476de1]{position:absolute;inset:0}.grid span[data-v-a7476de1]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-a7476de1]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-a7476de1]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-a7476de1]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-a7476de1]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-a7476de1]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-a7476de1]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-a7476de1]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-a7476de1]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-a7476de1]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-a7476de1]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-a7476de1]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-a7476de1]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-a7476de1]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-a7476de1]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-a7476de1]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-a7476de1]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-a7476de1]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-a7476de1]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-a7476de1]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-a7476de1]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-a7476de1]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}@keyframes up-a7476de1{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-a7476de1]{grid-template-columns:1fr 1fr}.mini-stack[data-v-a7476de1]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-a7476de1],.mini-stack[data-v-a7476de1]{grid-template-columns:1fr}.chart[data-v-a7476de1]{height:200px;padding-left:34px}.grid span i[data-v-a7476de1]{left:-34px;width:28px}.axis span[data-v-a7476de1]{font-size:11px}}\n";document.head.appendChild(s)}})();
