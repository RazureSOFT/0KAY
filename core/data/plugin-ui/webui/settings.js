import { defineComponent as X, reactive as Be, ref as S, onMounted as re, openBlock as n, createElementBlock as a, createElementVNode as e, createTextVNode as q, toDisplayString as l, withDirectives as V, vModelCheckbox as ee, vModelText as N, Fragment as I, renderList as J, normalizeClass as B, createCommentVNode as w, computed as W, onUnmounted as Ve, unref as t, withKeys as Je, createStaticVNode as We, createVNode as Q, vModelDynamic as Ye, vModelSelect as qe, shallowRef as Le, watch as Ge, createBlock as le, resolveDynamicComponent as Qe, withModifiers as ze } from "vue";
import { useRouter as Fe, useRoute as Xe } from "vue-router";
import { useI18n as ae } from "vue-i18n";
import { apiGet as ce, apiPost as $e, ApiError as je, useConfirm as Me, useProvidersStore as Ze, PROVIDERS as Ue, AppSelect as ie, getLanguage as et, LOCALES as tt, setLanguage as st, useWizardStore as Ae, useSettingsMeta as Ee, useUIPatchesStore as Ke, PinInput as Ie, useSettingsSectionsStore as lt, DEFAULT_LIVE2D_MODELS as ot } from "@0kay/host";
import { L as nt } from "./assets/Live2DStage-w9T1h3vJ.js";
import { _ as ue } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
const at = { class: "life-settings" }, it = { class: "ls-hero" }, rt = ["disabled"], ut = { class: "ls-grid" }, dt = { class: "ls-card" }, ct = { class: "ls-switch" }, pt = { class: "ls-switch" }, vt = { class: "ls-field" }, ht = { class: "ls-card" }, mt = { class: "ls-note" }, _t = { class: "ls-models" }, bt = ["onClick"], gt = {
  key: 0,
  class: "ls-empty"
}, yt = { class: "ls-models" }, kt = ["onClick"], ft = {
  key: 0,
  class: "ls-empty"
}, $t = { class: "ls-card" }, wt = { class: "ls-switch" }, Ct = { class: "ls-switch" }, St = { class: "ls-card" }, xt = { class: "ls-switch" }, Pt = { class: "ls-card ls-card-wide" }, Ut = { class: "ls-row" }, Tt = { class: "ls-switch" }, Vt = { class: "ls-switch" }, Mt = { class: "ls-row" }, At = { class: "ls-field" }, Et = { class: "ls-field" }, Ot = { class: "ls-row" }, Lt = { class: "ls-field" }, zt = { class: "ls-field" }, It = { class: "ls-row" }, Nt = { class: "ls-field" }, Dt = { class: "ls-field" }, Ft = {
  key: 0,
  class: "ls-state"
}, jt = /* @__PURE__ */ X({
  __name: "LifeSettingsPanel",
  setup(R) {
    const s = Be({
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
    }), _ = S(""), k = S(!1), b = S(!1), g = S([]), p = S(""), $ = S([]);
    async function x() {
      try {
        const [U, i] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (U.ok && (Object.assign(s, (await U.json()).values || {}), b.value = !0), i.ok) {
          const u = await i.json();
          $.value = Array.isArray(u.models) ? u.models.map((v) => ({ id: v.id, provider: v.provider || "custom", supports_thinking: v.supports_thinking })).filter((v) => v.id) : [], g.value = $.value.map((v) => v.id), p.value = "mocr 当前模型目录（由 Core 同步）";
        }
      } catch {
        _.value = "无法读取 LIFE 设置或模型目录";
      }
    }
    async function z() {
      if (!b.value) {
        _.value = "设置尚未加载，已阻止保存以避免写回默认值";
        return;
      }
      k.value = !0, _.value = "";
      try {
        const U = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: s }) });
        if (!U.ok) throw new Error(String(U.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: s.screen_watch, computer_use: s.computer_use, report_agent_host: s.report_agent_host }) }), _.value = "已保存，LIFE 会在下一次设置轮询时应用。";
      } catch {
        _.value = "保存失败";
      } finally {
        k.value = !1;
      }
    }
    return re(x), (U, i) => (n(), a("section", at, [
      e("header", it, [
        i[15] || (i[15] = e("div", { class: "ls-hero-main" }, [
          e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS"),
          e("h2", null, "L.I.F.E 专属设置"),
          e("p", { class: "ls-sub" }, "敏感功能默认关闭；凭据仅保存在本机 Core settings 文件。")
        ], -1)),
        e("button", {
          class: "ls-save",
          disabled: k.value,
          onClick: z
        }, [
          i[14] || (i[14] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          q(l(k.value ? "保存中…" : "保存"), 1)
        ], 8, rt)
      ]),
      e("div", ut, [
        e("article", dt, [
          i[21] || (i[21] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-1" }, "◉"),
            e("h3", null, "Agent 主机权限")
          ], -1)),
          e("label", ct, [
            V(e("input", {
              "onUpdate:modelValue": i[0] || (i[0] = (u) => s.screen_watch = u),
              type: "checkbox"
            }, null, 512), [
              [ee, s.screen_watch]
            ]),
            i[16] || (i[16] = e("span", { class: "ls-track" }, null, -1)),
            i[17] || (i[17] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许屏幕观察"),
              e("small", null, "读取当前屏幕内容")
            ], -1))
          ]),
          e("label", pt, [
            V(e("input", {
              "onUpdate:modelValue": i[1] || (i[1] = (u) => s.computer_use = u),
              type: "checkbox"
            }, null, 512), [
              [ee, s.computer_use]
            ]),
            i[18] || (i[18] = e("span", { class: "ls-track" }, null, -1)),
            i[19] || (i[19] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许计算机操作"),
              e("small", null, "执行鼠标/键盘操作")
            ], -1))
          ]),
          e("label", vt, [
            i[20] || (i[20] = e("span", null, "指定 Agent 主机（可选）", -1)),
            V(e("input", {
              "onUpdate:modelValue": i[2] || (i[2] = (u) => s.report_agent_host = u),
              placeholder: "hostname 或地址"
            }, null, 512), [
              [N, s.report_agent_host]
            ])
          ])
        ]),
        e("article", ht, [
          i[22] || (i[22] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-2" }, "✦"),
            e("h3", null, "THINK / OUTPUT 模型")
          ], -1)),
          e("p", mt, l(p.value || "正在读取 mocr 模型目录…"), 1),
          i[23] || (i[23] = e("p", { class: "ls-label" }, "THINK · 内部思考、记忆与工具规划", -1)),
          e("div", _t, [
            (n(!0), a(I, null, J($.value, (u) => (n(), a("button", {
              key: "think-" + u.id,
              type: "button",
              class: B(["ls-model", { selected: s.think_model === u.id }]),
              onClick: (v) => s.think_model = u.id
            }, [
              e("b", null, l(u.id), 1),
              e("span", null, l(u.provider) + " · " + l(u.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, bt))), 128)),
            $.value.length ? w("", !0) : (n(), a("span", gt, "暂无模型"))
          ]),
          i[24] || (i[24] = e("p", { class: "ls-label" }, "OUTPUT · 最终人格化回复", -1)),
          e("div", yt, [
            (n(!0), a(I, null, J($.value, (u) => (n(), a("button", {
              key: "output-" + u.id,
              type: "button",
              class: B(["ls-model", { selected: s.output_model === u.id }]),
              onClick: (v) => s.output_model = u.id
            }, [
              e("b", null, l(u.id), 1),
              e("span", null, l(u.provider) + " · output", 1)
            ], 10, kt))), 128)),
            $.value.length ? w("", !0) : (n(), a("span", ft, "暂无模型"))
          ])
        ]),
        e("article", $t, [
          i[29] || (i[29] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-3" }, "✉"),
            e("h3", null, "邮件收发")
          ], -1)),
          i[30] || (i[30] = e("p", { class: "ls-note" }, [
            q("邮件（收信 IMAP / 发信 SMTP）由内置的 "),
            e("code", null, "0kay-mcp"),
            q(" mail 服务器提供。请到「设置 → MCP」的服务器列表中配置 "),
            e("code", null, "mail"),
            q(" 服务器的 SMTP/IMAP 凭据。")
          ], -1)),
          e("label", wt, [
            V(e("input", {
              "onUpdate:modelValue": i[3] || (i[3] = (u) => s.mail_auto_approve_all = u),
              type: "checkbox"
            }, null, 512), [
              [ee, s.mail_auto_approve_all]
            ]),
            i[25] || (i[25] = e("span", { class: "ls-track" }, null, -1)),
            i[26] || (i[26] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "全部自动审批"),
              e("small", null, "所有需确认的权限直接通过，不再弹窗询问")
            ], -1))
          ]),
          e("label", Ct, [
            V(e("input", {
              "onUpdate:modelValue": i[4] || (i[4] = (u) => s.mail_require_approval = u),
              type: "checkbox"
            }, null, 512), [
              [ee, s.mail_require_approval]
            ]),
            i[27] || (i[27] = e("span", { class: "ls-track" }, null, -1)),
            i[28] || (i[28] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "邮件操作需弹窗确认"),
              e("small", null, "读取 / 发送邮件前先在 WebUI 询问你")
            ], -1))
          ])
        ]),
        e("article", St, [
          i[33] || (i[33] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", xt, [
            V(e("input", {
              "onUpdate:modelValue": i[5] || (i[5] = (u) => s.mcp_enabled = u),
              type: "checkbox"
            }, null, 512), [
              [ee, s.mcp_enabled]
            ]),
            i[31] || (i[31] = e("span", { class: "ls-track" }, null, -1)),
            i[32] || (i[32] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许调用 MCP 工具"),
              e("small", null, "服务清单在 Agent 设置中维护")
            ], -1))
          ])
        ]),
        e("article", Pt, [
          i[44] || (i[44] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-5" }, "☷"),
            e("h3", null, "OneBot v11 与主动行为")
          ], -1)),
          e("div", Ut, [
            e("label", Tt, [
              V(e("input", {
                "onUpdate:modelValue": i[6] || (i[6] = (u) => s.onebot_enabled = u),
                type: "checkbox"
              }, null, 512), [
                [ee, s.onebot_enabled]
              ]),
              i[34] || (i[34] = e("span", { class: "ls-track" }, null, -1)),
              i[35] || (i[35] = e("span", { class: "ls-switch-text" }, [
                e("b", null, "启用 OneBot")
              ], -1))
            ]),
            e("label", Vt, [
              V(e("input", {
                "onUpdate:modelValue": i[7] || (i[7] = (u) => s.onebot_observe_group = u),
                type: "checkbox"
              }, null, 512), [
                [ee, s.onebot_observe_group]
              ]),
              i[36] || (i[36] = e("span", { class: "ls-track" }, null, -1)),
              i[37] || (i[37] = e("span", { class: "ls-switch-text" }, [
                e("b", null, "仅观察群聊"),
                e("small", null, "未触发时不回复")
              ], -1))
            ])
          ]),
          e("div", Mt, [
            e("label", At, [
              i[38] || (i[38] = e("span", null, "WebSocket 地址", -1)),
              V(e("input", {
                "onUpdate:modelValue": i[8] || (i[8] = (u) => s.onebot_ws_url = u),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [N, s.onebot_ws_url]
              ])
            ]),
            e("label", Et, [
              i[39] || (i[39] = e("span", null, "HTTP API 地址", -1)),
              V(e("input", {
                "onUpdate:modelValue": i[9] || (i[9] = (u) => s.onebot_http_url = u),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [N, s.onebot_http_url]
              ])
            ])
          ]),
          e("div", Ot, [
            e("label", Lt, [
              i[40] || (i[40] = e("span", null, "Access Token", -1)),
              V(e("input", {
                "onUpdate:modelValue": i[10] || (i[10] = (u) => s.onebot_access_token = u),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [N, s.onebot_access_token]
              ])
            ]),
            e("label", zt, [
              i[41] || (i[41] = e("span", null, "触发关键词（逗号分隔，留空=全部）", -1)),
              V(e("input", {
                "onUpdate:modelValue": i[11] || (i[11] = (u) => s.onebot_trigger_keywords = u),
                placeholder: "bot,在吗"
              }, null, 512), [
                [N, s.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", It, [
            e("label", Nt, [
              i[42] || (i[42] = e("span", null, "每日主动上限", -1)),
              V(e("input", {
                "onUpdate:modelValue": i[12] || (i[12] = (u) => s.proactive_daily_limit = u),
                type: "number",
                min: "0",
                placeholder: "3"
              }, null, 512), [
                [
                  N,
                  s.proactive_daily_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", Dt, [
              i[43] || (i[43] = e("span", null, "单目标上限", -1)),
              V(e("input", {
                "onUpdate:modelValue": i[13] || (i[13] = (u) => s.proactive_target_limit = u),
                type: "number",
                min: "0",
                placeholder: "1"
              }, null, 512), [
                [
                  N,
                  s.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ])
      ]),
      _.value ? (n(), a("p", Ft, l(_.value), 1)) : w("", !0)
    ]));
  }
}), Kt = /* @__PURE__ */ ue(jt, [["__scopeId", "data-v-153238d0"]]), Ht = { class: "content-card about" }, Rt = { class: "identity" }, Bt = { class: "app-id" }, Jt = { class: "ver-badge" }, Wt = { class: "app-desc" }, Yt = { class: "identity-actions" }, qt = ["href"], Gt = { class: "section" }, Qt = { class: "section-head" }, Xt = ["disabled"], Zt = {
  key: 0,
  class: "alert",
  role: "alert"
}, es = {
  class: "us-hero-icon",
  "aria-hidden": "true"
}, ts = {
  key: 0,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, ss = {
  key: 1,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, ls = {
  key: 2,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, os = { class: "us-hero-text" }, ns = { key: 0 }, as = { key: 1 }, is = { class: "us-hero-actions" }, rs = ["disabled"], us = ["disabled", "title"], ds = ["href"], cs = {
  key: 2,
  class: "us-notes"
}, ps = { class: "us-notes-title" }, vs = { class: "us-notes-body" }, hs = {
  key: 3,
  class: "alert",
  role: "alert"
}, ms = { class: "us-apply-head" }, _s = { key: 0 }, bs = { key: 1 }, gs = {
  key: 0,
  class: "us-chip-tag"
}, ys = { class: "us-apply-label" }, ks = {
  key: 0,
  class: "us-apply-error"
}, fs = {
  key: 1,
  class: "us-apply-log"
}, $s = { class: "section" }, ws = { class: "section-title" }, Cs = { class: "credits" }, Ss = ["href"], xs = ["src", "alt"], Ps = { class: "person-info" }, Us = { class: "name" }, Ts = { class: "role" }, Vs = ["src"], Ms = { class: "person-info" }, As = { class: "role" }, Es = { class: "section-head contributors-head" }, Os = { class: "section-title" }, Ls = { class: "muted" }, zs = {
  key: 0,
  class: "contribs"
}, Is = ["href"], Ns = ["src", "alt"], Ds = { class: "login" }, Fs = {
  key: 0,
  class: "count"
}, js = {
  key: 1,
  class: "muted"
}, Ks = ["href"], Hs = { class: "foot" }, Rs = ["href"], Te = "https://github.com/RazureSOFT/0KAY", Bs = "https://github.com/RazureSOFT", Js = /* @__PURE__ */ X({
  __name: "AboutPanel",
  setup(R) {
    const { t: s } = ae(), _ = S("0.1.2"), k = S([]), b = S(""), g = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, p = (F, M = 96) => `https://github.com/${F}.png?size=${M}`, $ = S(!1), x = S(null), z = S(""), U = S(null), i = S("");
    let u = null;
    function v(F) {
      return U.value?.status === "running" && U.value.plugin === F;
    }
    async function m(F, M) {
      if (U.value?.status !== "running") {
        i.value = "";
        try {
          U.value = await $e("/api/plugins/pm/update", { plugin: F, version: M || "" }), P();
        } catch (K) {
          i.value = K instanceof Error ? K.message : String(K);
        }
      }
    }
    async function f() {
      try {
        U.value = await ce("/api/plugins/pm/status");
      } catch {
        return;
      }
      U.value && U.value.status !== "running" && (d(), D());
    }
    function P() {
      u || (u = setInterval(f, 2e3));
    }
    function d() {
      u && (clearInterval(u), u = null);
    }
    const E = W(() => {
      switch (U.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), O = W(() => x.value ? x.value.has_update ? "warn" : x.value.latest ? "ok" : "none" : "none");
    async function D() {
      $.value = !0, z.value = "";
      try {
        const F = await ce("/api/plugins/pm/check");
        x.value = F, F?.current && (_.value = String(F.current));
      } catch (F) {
        z.value = F instanceof je && F.status === 404 ? s("settings.about.unsupported") : F instanceof Error ? F.message : String(F);
      } finally {
        $.value = !1;
      }
    }
    async function Y() {
      try {
        const F = { Accept: "application/vnd.github+json" }, [M, K] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: F }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: F })
        ]);
        if (!M.ok) throw new Error(`HTTP ${M.status}`);
        const te = /* @__PURE__ */ new Map(), j = await M.json();
        for (const A of Array.isArray(j) ? j : [])
          A?.login && te.set(A.login, A);
        if (K.ok) {
          const A = await K.json();
          for (const L of Array.isArray(A) ? A : []) {
            const T = L?.author;
            !T?.login || T.login.endsWith("[bot]") || te.has(T.login) || te.set(T.login, {
              login: T.login,
              avatar_url: T.avatar_url,
              html_url: T.html_url,
              contributions: 0
            });
          }
        }
        k.value = [...te.values()].sort(
          (A, L) => (L.contributions || 0) - (A.contributions || 0) || A.login.localeCompare(L.login)
        );
      } catch (F) {
        b.value = F instanceof Error ? F.message : String(F), k.value = [];
      }
    }
    return re(() => {
      D(), Y(), ce("/api/plugins/pm/status").then((F) => {
        U.value = F, F?.status === "running" && P();
      }).catch(() => {
      });
    }), Ve(d), (F, M) => (n(), a("div", Ht, [
      e("header", Rt, [
        M[3] || (M[3] = e("div", {
          class: "app-icon",
          "aria-hidden": "true"
        }, "0K", -1)),
        e("div", Bt, [
          e("h2", null, [
            M[2] || (M[2] = q("0KAY ", -1)),
            e("span", Jt, "v" + l(_.value), 1)
          ]),
          e("p", Wt, l(t(s)("settings.about.description")), 1)
        ]),
        e("div", Yt, [
          e("a", {
            class: "btn btn-tonal sm",
            href: Te,
            target: "_blank",
            rel: "noopener noreferrer"
          }, l(t(s)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${Te}/releases`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "Releases ↗", 8, qt)
        ])
      ]),
      e("section", Gt, [
        e("div", Qt, [
          M[4] || (M[4] = e("h3", { class: "section-title" }, "0KAY", -1)),
          e("button", {
            class: "btn btn-tonal sm",
            disabled: $.value,
            onClick: D
          }, l(t(s)($.value ? "settings.about.checking" : "settings.about.check")), 9, Xt)
        ]),
        z.value ? (n(), a("p", Zt, l(z.value), 1)) : (n(), a("div", {
          key: 1,
          class: B(["us-hero", O.value])
        }, [
          e("div", es, [
            O.value === "ok" ? (n(), a("svg", ts, [...M[5] || (M[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : O.value === "warn" ? (n(), a("svg", ss, [...M[6] || (M[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (n(), a("svg", ls, [...M[7] || (M[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", os, [
            e("b", null, l(t(s)(O.value === "warn" ? "settings.about.available" : O.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            x.value?.latest ? (n(), a("span", ns, [
              q("v" + l(x.value.current) + " → ", 1),
              e("em", null, "v" + l(x.value.latest), 1)
            ])) : (n(), a("span", as, "0KAY v" + l(x.value?.current || _.value), 1))
          ]),
          e("div", is, [
            x.value?.has_update ? (n(), a("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: v("core"),
              onClick: M[0] || (M[0] = (K) => m("core", x.value.latest))
            }, l(v("core") ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, rs)) : w("", !0),
            x.value?.source_available !== !1 ? (n(), a("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: v("core"),
              title: t(s)("settings.about.betaHint"),
              onClick: M[1] || (M[1] = (K) => m("core"))
            }, l(v("core") ? t(s)("settings.about.updating") : t(s)("settings.about.beta")), 9, us)) : w("", !0),
            x.value?.url ? (n(), a("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: x.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, ds)) : w("", !0)
          ])
        ], 2)),
        x.value?.notes ? (n(), a("div", cs, [
          e("p", ps, l(t(s)("settings.about.whatsNew")), 1),
          e("pre", vs, l(x.value.notes), 1)
        ])) : w("", !0),
        i.value ? (n(), a("p", hs, l(i.value), 1)) : w("", !0),
        U.value && U.value.status !== "idle" ? (n(), a("div", {
          key: 4,
          class: B(["us-apply-banner", U.value.status])
        }, [
          e("div", ms, [
            M[8] || (M[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              q(l(U.value.package), 1),
              U.value.version ? (n(), a("span", _s, "@" + l(U.value.version), 1)) : (n(), a("span", bs, " · main"))
            ]),
            U.value.mode === "source" ? (n(), a("span", gs, l(t(s)("settings.about.sourceMode")), 1)) : w("", !0),
            e("span", ys, l(E.value), 1)
          ]),
          U.value.error ? (n(), a("p", ks, l(U.value.error), 1)) : w("", !0),
          U.value.log ? (n(), a("pre", fs, l(U.value.log), 1)) : w("", !0)
        ], 2)) : w("", !0)
      ]),
      e("section", $s, [
        e("h3", ws, l(t(s)("settings.about.developerTitle")) + " & " + l(t(s)("settings.about.teamTitle")), 1),
        e("div", Cs, [
          e("a", {
            class: "person",
            href: g.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: g.avatar,
              alt: g.login,
              loading: "lazy"
            }, null, 8, xs),
            e("div", Ps, [
              e("span", Us, l(g.login), 1),
              e("span", Ts, l(t(s)("settings.about.developerTitle")), 1)
            ]),
            M[9] || (M[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, Ss),
          e("a", {
            class: "person",
            href: Bs,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: p("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, Vs),
            e("div", Ms, [
              M[10] || (M[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", As, l(t(s)("settings.about.teamTitle")), 1)
            ]),
            M[11] || (M[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", Es, [
          e("h3", Os, l(t(s)("settings.about.contributorsTitle")), 1),
          e("span", Ls, l(t(s)("settings.about.contributorsFrom")), 1)
        ]),
        k.value.length ? (n(), a("div", zs, [
          (n(!0), a(I, null, J(k.value, (K) => (n(), a("a", {
            key: K.login,
            class: "contrib",
            href: K.html_url || `https://github.com/${K.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: K.avatar_url || p(K.login, 64),
              alt: K.login,
              loading: "lazy"
            }, null, 8, Ns),
            e("span", Ds, l(K.login), 1),
            K.contributions ? (n(), a("span", Fs, l(K.contributions), 1)) : w("", !0)
          ], 8, Is))), 128))
        ])) : (n(), a("p", js, [
          e("a", {
            class: "repo-link",
            href: g.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "razureink ↗", 8, Ks)
        ]))
      ]),
      e("footer", Hs, [
        M[12] || (M[12] = e("span", { class: "status-chip" }, "MIT", -1)),
        M[13] || (M[13] = e("span", null, "© 2026 RazureSOFT", -1)),
        e("a", {
          class: "repo-link",
          href: `${Te}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, Rs)
      ])
    ]));
  }
}), Ws = /* @__PURE__ */ ue(Js, [["__scopeId", "data-v-f0cbac94"]]), Ys = { class: "content-card updates" }, qs = { class: "us-block" }, Gs = { class: "us-head" }, Qs = { class: "us-head-text" }, Xs = { class: "us-title" }, Zs = { class: "us-desc" }, el = { class: "us-source" }, tl = { class: "us-input-group" }, sl = ["disabled", "placeholder"], ll = ["disabled"], ol = { class: "us-chips" }, nl = ["disabled"], al = ["disabled"], il = {
  key: 0,
  class: "us-saved"
}, rl = { class: "helper-text" }, ul = {
  key: 0,
  class: "alert"
}, dl = { class: "us-block" }, cl = { class: "us-head" }, pl = { class: "us-head-text" }, vl = { class: "us-title" }, hl = { class: "us-desc" }, ml = { class: "us-head-actions" }, _l = ["disabled"], bl = {
  key: 0,
  class: "alert",
  role: "alert"
}, gl = { class: "us-apply-head" }, yl = { key: 0 }, kl = { key: 1 }, fl = {
  key: 0,
  class: "us-chip-tag"
}, $l = { class: "us-apply-label" }, wl = {
  key: 0,
  class: "us-apply-error"
}, Cl = {
  key: 1,
  class: "us-apply-log"
}, Sl = {
  key: 2,
  class: "alert",
  role: "alert"
}, xl = {
  key: 3,
  class: "us-table"
}, Pl = { class: "us-name" }, Ul = { class: "us-ver" }, Tl = { class: "us-actions" }, Vl = ["disabled", "onClick"], Ml = ["disabled", "onClick"], Al = ["href", "title"], El = {
  key: 0,
  class: "us-empty"
}, Ol = /* @__PURE__ */ X({
  __name: "UpdatesPanel",
  setup(R) {
    const { t: s } = ae(), _ = S(!1), k = S(null), b = S(""), g = S(null), p = S("");
    let $ = null;
    const x = S(""), z = S(""), U = S(!1), i = S(!1), u = S(!1), v = S(""), m = W(() => x.value.trim() !== z.value), f = W(() => x.value.trim() !== "");
    function P(A) {
      return g.value?.status === "running" && g.value.plugin === A;
    }
    async function d(A, L) {
      if (g.value?.status !== "running") {
        p.value = "";
        try {
          g.value = await $e("/api/plugins/pm/update", { plugin: A, version: L || "" }), O();
        } catch (T) {
          p.value = T instanceof Error ? T.message : String(T);
        }
      }
    }
    async function E() {
      try {
        g.value = await ce("/api/plugins/pm/status");
      } catch {
        return;
      }
      g.value && g.value.status !== "running" && (D(), M());
    }
    function O() {
      $ || ($ = setInterval(E, 2e3));
    }
    function D() {
      $ && (clearInterval($), $ = null);
    }
    const Y = W(() => {
      switch (g.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), F = W(() => (k.value || []).filter((A) => A.has_update).length);
    async function M() {
      _.value = !0, b.value = "";
      try {
        const A = await ce("/api/plugins/pm/check-plugins");
        k.value = A.plugins || [];
      } catch (A) {
        b.value = A instanceof je && A.status === 404 ? s("settings.about.unsupported") : A instanceof Error ? A.message : String(A);
      } finally {
        _.value = !1;
      }
    }
    async function K() {
      U.value = !0, v.value = "";
      try {
        const A = await ce("/api/settings/updates"), L = String(A?.values?.github_proxy ?? "");
        x.value = L, z.value = L;
      } catch {
      } finally {
        U.value = !1;
      }
    }
    async function te() {
      i.value = !0, v.value = "";
      try {
        const A = x.value.trim();
        await $e("/api/settings/updates", { values: { github_proxy: A } }), z.value = A, u.value = !0, setTimeout(() => {
          u.value = !1;
        }, 1500);
      } catch (A) {
        v.value = A instanceof Error ? A.message : String(A);
      } finally {
        i.value = !1;
      }
    }
    function j(A) {
      x.value = A, te();
    }
    return re(() => {
      M(), K(), ce("/api/plugins/pm/status").then((A) => {
        g.value = A, A?.status === "running" && O();
      }).catch(() => {
      });
    }), Ve(D), (A, L) => (n(), a("div", Ys, [
      e("section", qs, [
        e("header", Gs, [
          L[3] || (L[3] = e("span", {
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
          e("div", Qs, [
            e("h3", Xs, l(t(s)("settings.pluginSourceTitle")), 1),
            e("p", Zs, l(t(s)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: B(["us-tag", { on: f.value }])
          }, l(f.value ? "ghproxy" : t(s)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", el, [
          e("div", tl, [
            L[4] || (L[4] = e("span", {
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
              "onUpdate:modelValue": L[0] || (L[0] = (T) => x.value = T),
              class: "us-input",
              type: "text",
              disabled: U.value,
              placeholder: t(s)("settings.pluginSourcePlaceholder"),
              onKeyup: Je(te, ["enter"])
            }, null, 40, sl), [
              [N, x.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: i.value || !m.value,
              onClick: te
            }, l(t(s)("settings.save")), 9, ll)
          ]),
          e("div", ol, [
            e("button", {
              type: "button",
              class: B(["us-chip", { active: !f.value }]),
              disabled: i.value,
              onClick: L[1] || (L[1] = (T) => j(""))
            }, l(t(s)("settings.pluginSourceDirect")), 11, nl),
            e("button", {
              type: "button",
              class: B(["us-chip", { active: x.value.trim() === "https://gh-proxy.com" }]),
              disabled: i.value,
              onClick: L[2] || (L[2] = (T) => j("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, al),
            u.value ? (n(), a("span", il, l(t(s)("settings.saved")), 1)) : w("", !0)
          ]),
          e("p", rl, l(t(s)("settings.pluginSourceHelp")), 1),
          v.value ? (n(), a("p", ul, l(v.value), 1)) : w("", !0)
        ])
      ]),
      L[10] || (L[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", dl, [
        e("header", cl, [
          L[5] || (L[5] = We('<span class="us-ico" aria-hidden="true" data-v-6bbe694b><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-6bbe694b><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect></svg></span>', 1)),
          e("div", pl, [
            e("h3", vl, l(t(s)("settings.about.plugins")), 1),
            e("p", hl, l(t(s)("settings.about.updateHint")), 1)
          ]),
          e("div", ml, [
            e("span", {
              class: B(["us-count", { warn: F.value > 0 }])
            }, l(F.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: _.value,
              onClick: M
            }, l(t(s)(_.value ? "settings.about.checking" : "settings.about.check")), 9, _l)
          ])
        ]),
        p.value ? (n(), a("p", bl, l(p.value), 1)) : w("", !0),
        g.value && g.value.status !== "idle" ? (n(), a("div", {
          key: 1,
          class: B(["us-apply-banner", g.value.status])
        }, [
          e("div", gl, [
            L[6] || (L[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              q(l(g.value.package), 1),
              g.value.version ? (n(), a("span", yl, "@" + l(g.value.version), 1)) : (n(), a("span", kl, " · main"))
            ]),
            g.value.mode === "source" ? (n(), a("span", fl, l(t(s)("settings.about.sourceMode")), 1)) : w("", !0),
            e("span", $l, l(Y.value), 1)
          ]),
          g.value.error ? (n(), a("p", wl, l(g.value.error), 1)) : w("", !0),
          g.value.log ? (n(), a("pre", Cl, l(g.value.log), 1)) : w("", !0)
        ], 2)) : w("", !0),
        b.value ? (n(), a("p", Sl, l(b.value), 1)) : w("", !0),
        k.value ? (n(), a("div", xl, [
          L[8] || (L[8] = e("div", { class: "us-row us-thead" }, [
            e("span", null, "Plugin"),
            e("span", null, "Version"),
            e("span", null, "Status"),
            e("span")
          ], -1)),
          (n(!0), a(I, null, J(k.value, (T) => (n(), a("div", {
            key: T.name,
            class: "us-row"
          }, [
            e("span", Pl, [
              e("span", {
                class: B(["us-dot", T.error ? "bad" : T.has_update ? "warn" : T.latest ? "ok" : ""])
              }, null, 2),
              q(" " + l(T.name), 1)
            ]),
            e("span", Ul, [
              e("em", null, "v" + l(T.version || "—"), 1),
              L[7] || (L[7] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: B({ good: !!T.latest })
              }, l(T.latest ? `v${T.latest}` : "—"), 3)
            ]),
            e("span", {
              class: B(["us-status", T.error ? "bad" : T.has_update ? "warn" : T.latest ? "ok" : ""])
            }, l(T.error || t(s)(T.has_update ? "settings.about.available" : T.latest ? "settings.about.latest" : "settings.about.noRelease")), 3),
            e("span", Tl, [
              T.can_update && T.has_update ? (n(), a("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: P(T.name),
                onClick: (oe) => d(T.name, T.latest)
              }, l(P(T.name) ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, Vl)) : T.can_update ? (n(), a("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: P(T.name),
                onClick: (oe) => d(T.name)
              }, l(P(T.name) ? t(s)("settings.about.updating") : t(s)("settings.about.syncNow")), 9, Ml)) : w("", !0),
              T.repository ? (n(), a("a", {
                key: 2,
                class: "us-repo",
                href: T.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: T.repository
              }, "Repo ↗", 8, Al)) : w("", !0)
            ])
          ]))), 128)),
          k.value.length ? w("", !0) : (n(), a("p", El, l(t(s)("settings.about.noPlugins")), 1))
        ])) : w("", !0),
        L[9] || (L[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), Ll = /* @__PURE__ */ ue(Ol, [["__scopeId", "data-v-6bbe694b"]]), zl = { class: "content-card provider-panel" }, Il = { class: "pp-editor-head" }, Nl = ["aria-label"], Dl = { class: "pp-editor-title" }, Fl = { class: "card-desc" }, jl = { class: "pp-section" }, Kl = { class: "pp-section-title" }, Hl = { class: "pp-grid" }, Rl = { class: "field" }, Bl = { class: "field" }, Jl = {
  key: 0,
  class: "pp-req"
}, Wl = ["placeholder"], Yl = { class: "field pp-span" }, ql = ["placeholder"], Gl = { class: "field" }, Ql = { class: "helper-text" }, Xl = { class: "field" }, Zl = { class: "helper-text" }, eo = { class: "pp-section" }, to = { class: "pp-section-head" }, so = { class: "pp-section-title" }, lo = ["disabled"], oo = { class: "field" }, no = { class: "pp-key" }, ao = ["type", "placeholder"], io = {
  key: 0,
  class: "helper-text"
}, ro = {
  key: 1,
  class: "pp-probe err"
}, uo = {
  key: 2,
  class: "pp-probe ok"
}, co = { class: "pp-section" }, po = { class: "pp-section-head" }, vo = { class: "pp-section-title" }, ho = { class: "pp-count" }, mo = ["disabled"], _o = {
  key: 0,
  class: "pp-discovered"
}, bo = { class: "pp-model-tools" }, go = ["placeholder"], yo = {
  key: 1,
  class: "pp-models"
}, ko = ["title"], fo = ["value", "onChange"], $o = ["value"], wo = ["title", "disabled", "onClick"], Co = ["title"], So = ["checked", "onChange"], xo = {
  key: 0,
  class: "helper-text"
}, Po = {
  key: 2,
  class: "helper-text"
}, Uo = {
  key: 0,
  class: "pp-error",
  role: "alert"
}, To = { class: "pp-editor-actions" }, Vo = ["disabled"], Mo = { class: "pp-list-head" }, Ao = { class: "card-desc" }, Eo = { class: "pp-list-actions" }, Oo = {
  key: 0,
  class: "pp-cards"
}, Lo = { class: "pp-card-head" }, zo = { class: "pp-logo" }, Io = ["src", "alt"], No = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, Do = { class: "pp-card-id" }, Fo = ["title"], jo = { class: "pp-card-badges" }, Ko = {
  key: 0,
  class: "pp-badge primary"
}, Ho = { class: "pp-badge" }, Ro = { class: "pp-card-status" }, Bo = {
  key: 0,
  class: "pp-meta"
}, Jo = ["title"], Wo = { class: "pp-chips" }, Yo = {
  key: 0,
  class: "pp-chip more"
}, qo = {
  key: 1,
  class: "pp-chip empty"
}, Go = { class: "pp-card-actions" }, Qo = ["onClick"], Xo = ["disabled", "onClick"], Zo = ["disabled", "onClick"], en = ["onClick"], tn = ["onClick"], sn = {
  key: 1,
  class: "pp-empty"
}, ln = /* @__PURE__ */ X({
  __name: "ProviderPanel",
  setup(R) {
    const { t: s } = ae(), { confirm: _ } = Me(), k = Ze(), b = S({}), g = S("list"), p = S(null), $ = S(""), x = S({ state: "idle" }), z = S([]), U = S(""), i = S(!1), u = S(!1), v = S(!1);
    re(async () => {
      await k.fetchAll();
      for (const c of k.providers) K(c);
    });
    function m(c) {
      return Ue.find((y) => y.id === c) || null;
    }
    function f(c) {
      return c.name && c.name.trim() ? c.name.trim() : m(c.provider)?.name || c.provider;
    }
    function P(c) {
      return m(c.provider)?.logo || "";
    }
    const d = [
      { value: "chat", label: "Chat 对话" },
      { value: "embedding", label: "Embedding 向量" },
      { value: "rerank", label: "Rerank 重排" },
      { value: "vision", label: "Vision 视觉" },
      { value: "tts", label: "TTS 语音" },
      { value: "image", label: "Image 图像" },
      { value: "audio", label: "Audio 音频" }
    ];
    function E(c) {
      return (p.value?.model_types || {})[c] || "chat";
    }
    function O(c, y) {
      if (!p.value) return;
      const r = { ...p.value.model_types || {} };
      !y || y === "chat" ? delete r[c] : r[c] = y, p.value.model_types = r;
    }
    function D(c) {
      const y = new Set(c.disabled_models || []);
      return c.models.filter((r) => !y.has(r));
    }
    function Y(c) {
      return k.defaultProviderId === c.id;
    }
    function F(c) {
      const y = p.value;
      if (!y) return;
      const r = Ue.find((h) => h.id === c);
      r?.baseUrl && !y.base_url && (y.base_url = r.baseUrl), y.format = r?.format || "";
    }
    async function M(c, y = "") {
      if (!c.base_url) return { state: "error", message: s("settings.baseUrlRequired") };
      const r = performance.now();
      try {
        const h = await fetch("/api/models/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: c.id,
            provider: c.provider,
            base_url: c.base_url,
            format: c.format || "",
            api_key: y || ""
          })
        });
        if (!h.ok) throw new Error(`HTTP ${h.status}`);
        const o = await h.json(), C = Math.round(performance.now() - r);
        return o.source === "api" && Array.isArray(o.models) && o.models.length ? { state: "ok", count: o.models.length, ms: C, models: o.models } : { state: "error", message: o.error || s("settings.connectionFailed"), ms: C };
      } catch (h) {
        return { state: "error", message: h instanceof Error ? h.message : String(h) };
      }
    }
    async function K(c, y = "") {
      b.value = { ...b.value, [c.id]: { state: "checking" } };
      const r = await M(c, y);
      b.value = { ...b.value, [c.id]: r };
    }
    function te() {
      for (const c of k.providers) K(c);
    }
    function j() {
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
      }, $.value = "", x.value = { state: "idle" }, z.value = [], U.value = "", i.value = !1, u.value = !1, g.value = "edit";
    }
    function A(c) {
      p.value = {
        ...c,
        api_key: "",
        name: c.name || "",
        models: [...c.models],
        disabled_models: [...c.disabled_models || []],
        format: c.format || "",
        model_types: { ...c.model_types || {} }
      }, u.value = !!c.api_key_masked, $.value = "", x.value = { state: "idle" }, z.value = [], U.value = "", i.value = !1, g.value = "edit";
    }
    function L() {
      g.value = "list", p.value = null, $.value = "";
    }
    async function T() {
      const c = p.value;
      if (!c) return;
      $.value = "";
      const y = (c.name || "").trim();
      if (!c.base_url.trim()) {
        $.value = s("settings.baseUrlRequired");
        return;
      }
      if (c.provider === "custom" && !y) {
        $.value = s("settings.providerNameRequired");
        return;
      }
      if (!c.models.length) {
        $.value = s("settings.modelsRequired");
        return;
      }
      c.id || (c.id = `${c.provider}_${Date.now().toString(36)}`), c.name = y, c.disabled_models = (c.disabled_models || []).filter((r) => c.models.includes(r)), (!c.default_model || !c.models.includes(c.default_model) || c.disabled_models.includes(c.default_model)) && (c.default_model = D(c)[0] || c.models[0]), v.value = !0;
      try {
        await k.upsert({ ...c }), k.defaultProviderId || await k.setDefaults(c.id, c.default_model), L(), K(k.providers.find((r) => r.id === c.id) || c);
      } catch (r) {
        $.value = r instanceof Error ? r.message : String(r);
      } finally {
        v.value = !1;
      }
    }
    async function oe(c) {
      if (await _({
        title: s("settings.remove"),
        message: `${s("settings.remove")} ${f(c)}?`,
        confirmLabel: s("settings.remove"),
        danger: !0
      }))
        try {
          await k.remove(c.id);
        } catch {
        }
    }
    async function ve(c) {
      try {
        await k.upsert({ ...c, enabled: !c.enabled });
      } catch {
      }
    }
    async function G(c) {
      const y = c.default_model || D(c)[0] || c.models[0] || "";
      try {
        await k.setDefaults(c.id, y);
      } catch {
      }
    }
    async function he() {
      const c = p.value;
      if (!c) return;
      x.value = { state: "checking" };
      const y = await M(c, c.api_key);
      x.value = y, y.state === "ok" && y.models && (z.value = y.models);
    }
    function _e() {
      const c = p.value;
      !c || !z.value.length || (c.models = [...z.value], c.disabled_models = (c.disabled_models || []).filter((y) => c.models.includes(y)), c.models.includes(c.default_model) || (c.default_model = ""));
    }
    function ye(c) {
      const y = p.value;
      if (!y) return;
      const r = new Set(y.disabled_models || []);
      r.has(c) ? r.delete(c) : r.add(c), y.disabled_models = [...r], r.has(y.default_model) && (y.default_model = D(y)[0] || "");
    }
    function Ce(c) {
      const y = p.value;
      y && (y.default_model = c, y.disabled_models = (y.disabled_models || []).filter((r) => r !== c));
    }
    function ke(c) {
      const y = p.value;
      y && (y.disabled_models = c ? [] : [...y.models]);
    }
    function fe() {
      const c = p.value;
      if (!c) return;
      const y = new Set(c.disabled_models || []);
      c.disabled_models = c.models.filter((r) => !y.has(r));
    }
    const be = W(() => {
      const c = p.value?.models || [], y = U.value.trim().toLowerCase();
      return y ? c.filter((r) => r.toLowerCase().includes(y)) : c;
    }), Se = W(() => p.value ? D(p.value).length : 0);
    function de() {
      return s("settings.fetchedSummary", { n: z.value.length });
    }
    const xe = W(() => [
      { value: "", label: s("settings.formatAuto") },
      { value: "openai", label: s("settings.formatOpenai") },
      { value: "anthropic", label: s("settings.formatAnthropic") }
    ]), Pe = W(
      () => Ue.map((c) => ({ value: c.id, label: s(`providers.${c.id}.name`, c.name) }))
    );
    return (c, y) => (n(), a("div", zl, [
      g.value === "edit" && p.value ? (n(), a(I, { key: 0 }, [
        e("div", Il, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: L,
            "aria-label": t(s)("settings.back")
          }, [...y[11] || (y[11] = [
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
          ])], 8, Nl),
          e("div", Dl, [
            e("h2", null, l(p.value.id ? t(s)("settings.edit") : t(s)("settings.addProvider")), 1),
            e("p", Fl, l(t(s)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: B(["pp-status", x.value.state])
          }, [
            y[12] || (y[12] = e("span", { class: "pp-dot" }, null, -1)),
            q(" " + l(x.value.state === "checking" ? t(s)("settings.testing") : x.value.state === "ok" ? t(s)("settings.connectionOk") : x.value.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", jl, [
          e("h3", Kl, l(t(s)("settings.providerSectionBasic")), 1),
          e("div", Hl, [
            e("div", Rl, [
              e("label", null, l(t(s)("wizard.provider")), 1),
              Q(t(ie), {
                modelValue: p.value.provider,
                "onUpdate:modelValue": y[0] || (y[0] = (r) => p.value.provider = r),
                class: "input",
                "aria-label": t(s)("wizard.provider"),
                options: Pe.value,
                onChange: F
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", Bl, [
              e("label", null, [
                q(l(t(s)("settings.providerName")) + " ", 1),
                p.value.provider === "custom" ? (n(), a("span", Jl, "*")) : w("", !0)
              ]),
              V(e("input", {
                "onUpdate:modelValue": y[1] || (y[1] = (r) => p.value.name = r),
                placeholder: t(s)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, Wl), [
                [N, p.value.name]
              ])
            ]),
            e("div", Yl, [
              e("label", null, l(t(s)("wizard.baseUrl")), 1),
              V(e("input", {
                "onUpdate:modelValue": y[2] || (y[2] = (r) => p.value.base_url = r),
                placeholder: t(s)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, ql), [
                [N, p.value.base_url]
              ])
            ]),
            e("div", Gl, [
              e("label", null, l(t(s)("settings.apiFormat")), 1),
              Q(t(ie), {
                modelValue: p.value.format,
                "onUpdate:modelValue": y[3] || (y[3] = (r) => p.value.format = r),
                class: "input",
                "aria-label": t(s)("settings.apiFormat"),
                options: xe.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Ql, l(t(s)("settings.apiFormatHint")), 1)
            ]),
            e("div", Xl, [
              e("label", null, l(t(s)("wizard.defaultModel")), 1),
              Q(t(ie), {
                modelValue: p.value.default_model,
                "onUpdate:modelValue": y[4] || (y[4] = (r) => p.value.default_model = r),
                class: "input",
                "aria-label": t(s)("wizard.defaultModel"),
                options: D(p.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Zl, l(t(s)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", eo, [
          e("div", to, [
            e("h3", so, l(t(s)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: x.value.state === "checking",
              onClick: he
            }, l(x.value.state === "checking" ? t(s)("settings.testing") : t(s)("settings.testConnection")), 9, lo)
          ]),
          e("div", oo, [
            e("label", null, l(t(s)("wizard.apiKey")), 1),
            e("div", no, [
              V(e("input", {
                "onUpdate:modelValue": y[5] || (y[5] = (r) => p.value.api_key = r),
                type: i.value ? "text" : "password",
                placeholder: u.value ? t(s)("settings.apiKeyKept") : t(s)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, ao), [
                [Ye, p.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: y[6] || (y[6] = (r) => i.value = !i.value)
              }, l(i.value ? t(s)("settings.hideKey") : t(s)("settings.showKey")), 1)
            ]),
            u.value ? (n(), a("p", io, l(t(s)("settings.apiKeyKeptHint")), 1)) : w("", !0),
            x.value.state === "error" ? (n(), a("p", ro, l(x.value.message), 1)) : x.value.state === "ok" ? (n(), a("p", uo, l(t(s)("settings.connectionOk")) + " · " + l(de()) + " · " + l(x.value.ms) + "ms ", 1)) : w("", !0)
          ])
        ]),
        e("section", co, [
          e("div", po, [
            e("h3", vo, [
              q(l(t(s)("settings.providerSectionModels")) + " ", 1),
              e("span", ho, l(Se.value) + "/" + l(p.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: x.value.state === "checking",
              onClick: he
            }, l(t(s)("settings.fetchModels")), 9, mo)
          ]),
          z.value.length && z.value.join("\0") !== p.value.models.join("\0") ? (n(), a("div", _o, [
            e("span", null, l(de()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: _e
            }, l(t(s)("settings.applyFetched")), 1)
          ])) : w("", !0),
          e("div", bo, [
            V(e("input", {
              "onUpdate:modelValue": y[7] || (y[7] = (r) => U.value = r),
              class: "input pp-search",
              placeholder: t(s)("settings.searchModels")
            }, null, 8, go), [
              [N, U.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: y[8] || (y[8] = (r) => ke(!0))
            }, l(t(s)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: y[9] || (y[9] = (r) => fe())
            }, l(t(s)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: y[10] || (y[10] = (r) => ke(!1))
            }, l(t(s)("settings.clearSelection")), 1)
          ]),
          p.value.models.length ? (n(), a("div", yo, [
            (n(!0), a(I, null, J(be.value, (r) => (n(), a("div", {
              key: r,
              class: B(["pp-model", { off: (p.value.disabled_models || []).includes(r) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: r
              }, l(r), 9, ko),
              e("select", {
                class: B(["pp-type", { tagged: E(r) !== "chat" }]),
                value: E(r),
                title: "模型类型",
                onChange: (h) => O(r, h.target.value)
              }, [
                (n(), a(I, null, J(d, (h) => e("option", {
                  key: h.value,
                  value: h.value
                }, l(h.label), 9, $o)), 64))
              ], 42, fo),
              p.value.default_model !== r ? (n(), a("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: t(s)("settings.makeDefault"),
                disabled: (p.value.disabled_models || []).includes(r),
                onClick: (h) => Ce(r)
              }, "☆", 8, wo)) : (n(), a("span", {
                key: 1,
                class: "pp-star on",
                title: t(s)("wizard.defaultModel")
              }, "★", 8, Co)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(p.value.disabled_models || []).includes(r),
                onChange: (h) => ye(r)
              }, null, 40, So)
            ], 2))), 128)),
            be.value.length ? w("", !0) : (n(), a("p", xo, l(t(s)("settings.searchModels")), 1))
          ])) : (n(), a("p", Po, l(t(s)("settings.noModelsYet")), 1))
        ]),
        $.value ? (n(), a("p", Uo, l($.value), 1)) : w("", !0),
        e("div", To, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: v.value,
            onClick: T
          }, l(v.value ? t(s)("settings.saving") : t(s)("settings.save")), 9, Vo),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: L
          }, l(t(s)("settings.cancel")), 1)
        ])
      ], 64)) : (n(), a(I, { key: 1 }, [
        e("div", Mo, [
          e("div", null, [
            e("h2", null, l(t(s)("settings.tabs.provider")), 1),
            e("p", Ao, l(t(s)("settings.providerDesc")), 1)
          ]),
          e("div", Eo, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: te
            }, l(t(s)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: j
            }, "+ " + l(t(s)("settings.addProvider")), 1)
          ])
        ]),
        t(k).providers.length ? (n(), a("div", Oo, [
          (n(!0), a(I, null, J(t(k).providers, (r) => (n(), a("article", {
            key: r.id,
            class: B(["pp-card", { off: !r.enabled, default: Y(r) }])
          }, [
            e("header", Lo, [
              e("span", zo, [
                P(r) ? (n(), a("img", {
                  key: 0,
                  src: P(r),
                  alt: f(r)
                }, null, 8, Io)) : (n(), a("svg", No, [...y[13] || (y[13] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", Do, [
                e("strong", null, l(f(r)), 1),
                e("code", {
                  title: r.base_url
                }, l(r.base_url || "—"), 9, Fo)
              ]),
              e("div", jo, [
                Y(r) ? (n(), a("span", Ko, l(t(s)("settings.default")), 1)) : w("", !0),
                e("span", Ho, l(D(r).length) + "/" + l(r.models.length), 1)
              ])
            ]),
            e("div", Ro, [
              e("span", {
                class: B(["pp-status", b.value[r.id]?.state || "idle"])
              }, [
                y[14] || (y[14] = e("span", { class: "pp-dot" }, null, -1)),
                q(" " + l(b.value[r.id]?.state === "checking" ? t(s)("settings.testing") : b.value[r.id]?.state === "ok" ? t(s)("settings.connectionOk") : b.value[r.id]?.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
              ], 2),
              b.value[r.id]?.state === "ok" ? (n(), a("span", Bo, l(t(s)("settings.fetchedSummary", { n: b.value[r.id]?.count || 0 })) + " · " + l(b.value[r.id]?.ms) + "ms", 1)) : b.value[r.id]?.state === "error" ? (n(), a("span", {
                key: 1,
                class: "pp-meta err",
                title: b.value[r.id]?.message
              }, l(b.value[r.id]?.message), 9, Jo)) : w("", !0)
            ]),
            e("div", Wo, [
              (n(!0), a(I, null, J(D(r).slice(0, 6), (h) => (n(), a("span", {
                key: h,
                class: "pp-chip"
              }, l(h), 1))), 128)),
              D(r).length > 6 ? (n(), a("span", Yo, "+" + l(D(r).length - 6), 1)) : w("", !0),
              r.models.length ? w("", !0) : (n(), a("span", qo, l(t(s)("settings.noModelsYet")), 1))
            ]),
            e("footer", Go, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (h) => A(r)
              }, l(t(s)("settings.edit")), 9, Qo),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: b.value[r.id]?.state === "checking",
                onClick: (h) => K(r)
              }, l(t(s)("settings.testConnection")), 9, Xo),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: Y(r),
                onClick: (h) => G(r)
              }, l(t(s)("settings.makeDefault")), 9, Zo),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (h) => ve(r)
              }, l(r.enabled ? t(s)("settings.disableProvider") : t(s)("settings.enableProvider")), 9, en),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (h) => oe(r)
              }, l(t(s)("settings.remove")), 9, tn)
            ])
          ], 2))), 128))
        ])) : (n(), a("div", sn, [
          e("p", null, l(t(s)("settings.noProviders")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: j
          }, "+ " + l(t(s)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), on = /* @__PURE__ */ ue(ln, [["__scopeId", "data-v-828ee6e3"]]), nn = { class: "pairing-panel" }, an = { key: 0 }, rn = { key: 1 }, un = { key: 0 }, dn = ["onClick"], cn = ["onClick"], pn = /* @__PURE__ */ X({
  __name: "PairingPanel",
  setup(R) {
    const s = S([]), _ = S("");
    let k;
    async function b() {
      try {
        const p = await fetch("/api/pairing/pending");
        if (!p.ok) throw new Error(await p.text());
        s.value = (await p.json()).requests || [];
      } catch (p) {
        _.value = p.message;
      }
    }
    async function g(p, $) {
      try {
        const x = await fetch("/api/pairing/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, allow: $ }) });
        if (!x.ok) throw new Error(await x.text());
        await b();
      } catch (x) {
        _.value = x.message;
      }
    }
    return re(() => {
      b(), k = setInterval(b, 3e3);
    }), Ve(() => clearInterval(k)), (p, $) => (n(), a("section", nn, [
      $[0] || ($[0] = e("h3", null, "设备配对", -1)),
      $[1] || ($[1] = e("p", null, "在 Core 所在电脑核对安装终端显示的 6 位代码，再允许连接。局域网发现需启用 CORE_LAN_ENABLED=1。", -1)),
      _.value ? (n(), a("p", an, l(_.value), 1)) : w("", !0),
      s.value.length ? w("", !0) : (n(), a("p", rn, "暂无待配对设备")),
      (n(!0), a(I, null, J(s.value, (x) => (n(), a("article", {
        key: x.id
      }, [
        e("strong", null, l(x.name), 1),
        e("code", null, l(x.code), 1),
        x.approved ? (n(), a("span", un, "已允许，等待客户端领取")) : (n(), a(I, { key: 1 }, [
          e("button", {
            onClick: (z) => g(x, !1)
          }, "拒绝", 8, dn),
          e("button", {
            onClick: (z) => g(x, !0)
          }, "核对代码并允许配对", 8, cn)
        ], 64))
      ]))), 128))
    ]));
  }
}), vn = /* @__PURE__ */ ue(pn, [["__scopeId", "data-v-0559b1b2"]]), hn = { class: "content-card" }, mn = { class: "card-desc" }, _n = { class: "field" }, bn = { class: "segmented" }, gn = ["onClick"], yn = /* @__PURE__ */ X({
  __name: "GeneralPanel",
  setup(R) {
    const { t: s } = ae(), _ = S(et());
    function k(b) {
      _.value = b, st(b);
    }
    return (b, g) => (n(), a("div", hn, [
      Q(vn),
      e("h2", null, l(t(s)("settings.tabs.general")), 1),
      e("p", mn, l(t(s)("settings.generalDesc")), 1),
      e("div", _n, [
        e("label", null, l(t(s)("settings.language")), 1),
        e("div", bn, [
          (n(!0), a(I, null, J(t(tt), (p) => (n(), a("button", {
            key: p.code,
            class: B(["seg", { active: _.value === p.code }]),
            onClick: ($) => k(p.code)
          }, l(p.label), 11, gn))), 128))
        ])
      ])
    ]));
  }
}), kn = { class: "content-card" }, fn = { class: "card-desc" }, $n = { class: "field-row" }, wn = { class: "field" }, Cn = ["placeholder"], Sn = { class: "field" }, xn = ["placeholder"], Pn = { class: "field" }, Un = { class: "field" }, Tn = ["placeholder"], Vn = { class: "field" }, Mn = ["placeholder"], An = { class: "field" }, En = ["placeholder"], On = { class: "field" }, Ln = ["placeholder"], zn = { class: "helper-text" }, In = /* @__PURE__ */ X({
  __name: "PersonaPanel",
  setup(R) {
    const { t: s } = ae(), _ = Ae(), { tabLabel: k, tabMeta: b } = Ee();
    return (g, p) => (n(), a("div", kn, [
      e("h2", null, l(t(k)("persona")), 1),
      e("p", fn, l(t(b)("persona")?.descriptionKey ? t(s)(t(b)("persona").descriptionKey) : t(s)("settings.personaDesc")), 1),
      e("div", $n, [
        e("div", wn, [
          e("label", null, l(t(s)("wizard.name")), 1),
          V(e("input", {
            "onUpdate:modelValue": p[0] || (p[0] = ($) => t(_).persona.name = $),
            placeholder: t(s)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, Cn), [
            [N, t(_).persona.name]
          ])
        ]),
        e("div", Sn, [
          e("label", null, l(t(s)("wizard.avatarUrl")), 1),
          V(e("input", {
            "onUpdate:modelValue": p[1] || (p[1] = ($) => t(_).persona.avatar = $),
            placeholder: t(s)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, xn), [
            [N, t(_).persona.avatar]
          ])
        ]),
        e("div", Pn, [
          p[7] || (p[7] = e("label", null, "出生日期", -1)),
          V(e("input", {
            "onUpdate:modelValue": p[2] || (p[2] = ($) => t(_).persona.birthDate = $),
            type: "date",
            class: "input"
          }, null, 512), [
            [N, t(_).persona.birthDate]
          ])
        ])
      ]),
      e("div", Un, [
        e("label", null, l(t(s)("wizard.description")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[3] || (p[3] = ($) => t(_).persona.description = $),
          placeholder: t(s)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Tn), [
          [N, t(_).persona.description]
        ])
      ]),
      e("div", Vn, [
        e("label", null, l(t(s)("wizard.personality")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[4] || (p[4] = ($) => t(_).persona.personality = $),
          placeholder: t(s)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Mn), [
          [N, t(_).persona.personality]
        ])
      ]),
      e("div", An, [
        e("label", null, l(t(s)("wizard.greeting")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[5] || (p[5] = ($) => t(_).persona.greeting = $),
          placeholder: t(s)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, En), [
          [N, t(_).persona.greeting]
        ])
      ]),
      e("div", On, [
        e("label", null, l(t(s)("wizard.customPrompt")), 1),
        V(e("textarea", {
          "onUpdate:modelValue": p[6] || (p[6] = ($) => t(_).persona.customPrompt = $),
          placeholder: t(s)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, Ln), [
          [N, t(_).persona.customPrompt]
        ]),
        e("p", zn, l(t(s)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), Nn = { class: "content-card" }, Dn = { class: "card-desc" }, Fn = { class: "toggle-label" }, jn = { class: "helper-text" }, Kn = { class: "toggle-label" }, Hn = { class: "helper-text" }, Rn = { class: "field" }, Bn = ["placeholder"], Jn = { class: "helper-text" }, Wn = {
  key: 0,
  class: "helper-text"
}, Yn = { class: "actions-row" }, qn = /* @__PURE__ */ X({
  __name: "PermissionsPanel",
  setup(R) {
    const { t: s } = ae(), { tabLabel: _, tabMeta: k, fieldLabel: b, fieldHelp: g } = Ee(), p = S({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), $ = S("");
    async function x() {
      try {
        const U = await fetch("/api/life/permissions");
        if (U.ok) {
          const i = await U.json();
          p.value = {
            screen_watch: !!i.screen_watch,
            computer_use: !!i.computer_use,
            report_agent_host: i.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function z() {
      $.value = "";
      try {
        const U = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p.value)
        });
        if (!U.ok) throw new Error(String(U.status));
        const i = await U.json();
        p.value = {
          screen_watch: !!i.screen_watch,
          computer_use: !!i.computer_use,
          report_agent_host: i.report_agent_host || ""
        }, $.value = s("settings.permSaved");
      } catch {
        $.value = s("settings.permFailed");
      }
    }
    return re(x), (U, i) => (n(), a("div", Nn, [
      e("h2", null, l(t(_)("permissions")), 1),
      e("p", Dn, l(t(k)("permissions")?.descriptionKey ? t(s)(t(k)("permissions").descriptionKey) : t(s)("settings.permissionsDesc")), 1),
      e("label", Fn, [
        V(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": i[0] || (i[0] = (u) => p.value.screen_watch = u),
          onChange: z
        }, null, 544), [
          [ee, p.value.screen_watch]
        ]),
        i[4] || (i[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(t(b)(t(k)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          i[3] || (i[3] = e("br", null, null, -1)),
          e("small", jn, l(t(g)(t(k)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", Kn, [
        V(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": i[1] || (i[1] = (u) => p.value.computer_use = u),
          onChange: z
        }, null, 544), [
          [ee, p.value.computer_use]
        ]),
        i[6] || (i[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(t(b)(t(k)("permissions"), "computer_use", "settings.computerUse")), 1),
          i[5] || (i[5] = e("br", null, null, -1)),
          e("small", Hn, l(t(g)(t(k)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", Rn, [
        e("label", null, l(t(b)(t(k)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        V(e("input", {
          "onUpdate:modelValue": i[2] || (i[2] = (u) => p.value.report_agent_host = u),
          class: "input",
          placeholder: t(g)(t(k)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: z
        }, null, 40, Bn), [
          [N, p.value.report_agent_host]
        ]),
        e("p", Jn, l(t(g)(t(k)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      $.value ? (n(), a("div", Wn, l($.value), 1)) : w("", !0),
      e("div", Yn, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: z
        }, l(t(s)("settings.save")), 1)
      ])
    ]));
  }
}), Gn = S(!1), Qn = S(!1);
S(!1);
const pe = S(!1), me = S(!0), Oe = S(!0), ge = S([]), He = S(!1);
S(!1);
const we = S(!1), Ne = [];
function Xn(R) {
  const s = Ne.splice(0, Ne.length);
  for (const _ of s)
    _.resolve();
}
async function Zn() {
  const R = window.fetch;
  try {
    const s = await R("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!s.ok) return;
    const _ = await s.json();
    pe.value = !!_.configured, me.value = _.enabled !== !1, Oe.value = _.login_enabled !== !1, ge.value = Array.isArray(_.pages) ? _.pages : [], we.value = !_.configured && me.value;
  } catch {
  }
}
async function ea(R) {
  const s = window.fetch, _ = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(R)
  }), k = await _.json().catch(() => null);
  if (!_.ok) throw new Error(k?.error || `HTTP ${_.status}`);
  typeof k?.enabled == "boolean" && (me.value = k.enabled), typeof k?.login_enabled == "boolean" && (Oe.value = k.login_enabled), Array.isArray(k?.pages) && (ge.value = k.pages), pe.value = !!k?.configured, we.value = !k?.configured && me.value;
}
async function ta() {
  const R = window.fetch, s = await R("/api/security/pin", { method: "DELETE" }), _ = await s.json().catch(() => null);
  if (!s.ok) throw new Error(_?.error || `HTTP ${s.status}`);
  He.value = !1, pe.value = !1, we.value = me.value;
}
async function sa(R) {
  const s = window.fetch, _ = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: R })
  }), k = await _.json().catch(() => null);
  if (!_.ok || !k?.configured) throw new Error(k?.error || `HTTP ${_.status}`);
  R.trim(), He.value = !0, pe.value = !0, we.value = !1, Qn.value = !0, Gn.value = !1, Xn();
}
const la = { class: "content-card security-panel" }, oa = { class: "card-desc" }, na = { class: "sec-stack" }, aa = { class: "toggle-label" }, ia = ["checked", "disabled"], ra = { class: "helper-text" }, ua = { class: "toggle-label" }, da = ["checked", "disabled"], ca = { class: "helper-text" }, pa = { class: "sec-card" }, va = { class: "sec-card-head" }, ha = { class: "sec-pin-grid" }, ma = { class: "sec-pin-col" }, _a = { class: "sec-pin-label" }, ba = { class: "sec-pin-col" }, ga = { class: "sec-pin-label" }, ya = { class: "sec-actions" }, ka = ["disabled"], fa = ["disabled"], $a = { class: "sec-card" }, wa = { class: "sec-card-head" }, Ca = { class: "sec-chip" }, Sa = { class: "helper-text" }, xa = { class: "page-list" }, Pa = ["checked", "disabled", "onChange"], Ua = { class: "page-text" }, Ta = { class: "page-name" }, Va = {
  key: 0,
  class: "helper-text sec-msg"
}, Ma = {
  key: 1,
  class: "sec-error"
}, Aa = /* @__PURE__ */ X({
  __name: "SecurityPanel",
  setup(R) {
    const { t: s, locale: _ } = ae(), { confirm: k } = Me(), b = Ke(), g = S(!1), p = S(""), $ = S(""), x = S(""), z = S(""), U = W(() => {
      const P = [], d = /* @__PURE__ */ new Set(), E = (O, D) => {
        !O || d.has(O) || (d.add(O), P.push({ path: O, label: D || O }));
      };
      for (const O of b.navItems) {
        const D = O.to || (O.id === "chat" ? "/" : "");
        if (!D) continue;
        let Y = O.labelKey ? s(O.labelKey) : "";
        (!Y || Y === O.labelKey) && (Y = O.label || O.id), E(D, Y);
      }
      for (const O of b.routerPatches) {
        let D = O.titleKey ? s(O.titleKey) : "";
        (!D || D === O.titleKey) && (D = O.title || String(O.name || O.path)), E(O.path, D);
      }
      return P;
    });
    re(() => {
      Zn();
    });
    async function i(P) {
      g.value = !0, p.value = "", $.value = "";
      try {
        await ea(P), p.value = s("settings.saved"), setTimeout(() => {
          p.value = "";
        }, 1500);
      } catch (d) {
        $.value = d?.message || s("settings.permFailed");
      } finally {
        g.value = !1;
      }
    }
    function u(P, d) {
      i({ [P]: d });
    }
    function v(P, d) {
      const E = new Set(ge.value);
      d ? E.add(P) : E.delete(P), i({ pages: [...E] });
    }
    async function m() {
      if ($.value = "", x.value.length !== 6) {
        $.value = s("wizard.pinTooShort");
        return;
      }
      if (x.value !== z.value) {
        $.value = s("wizard.pinMismatch");
        return;
      }
      g.value = !0;
      try {
        await sa(x.value), x.value = "", z.value = "", p.value = s("settings.saved"), setTimeout(() => {
          p.value = "";
        }, 1500);
      } catch (P) {
        $.value = P?.message || s("settings.permFailed");
      } finally {
        g.value = !1;
      }
    }
    async function f() {
      if (await k({
        title: s("security.removePin"),
        message: s("security.removePinConfirm"),
        confirmLabel: _.value === "en" ? "Delete" : "删除",
        danger: !0
      })) {
        g.value = !0, $.value = "";
        try {
          await ta(), p.value = s("settings.saved"), setTimeout(() => {
            p.value = "";
          }, 1500);
        } catch (d) {
          $.value = d?.message || s("settings.permFailed");
        } finally {
          g.value = !1;
        }
      }
    }
    return (P, d) => (n(), a("div", la, [
      e("h2", null, l(t(s)("settings.tabs.security")), 1),
      e("p", oa, l(t(s)("security.desc")), 1),
      e("div", na, [
        e("label", aa, [
          e("input", {
            type: "checkbox",
            checked: t(me),
            disabled: g.value,
            onChange: d[0] || (d[0] = (E) => u("enabled", E.target.checked))
          }, null, 40, ia),
          d[4] || (d[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(t(s)("security.pinSwitch")), 1),
            e("small", ra, l(t(s)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", ua, [
          e("input", {
            type: "checkbox",
            checked: t(Oe),
            disabled: g.value,
            onChange: d[1] || (d[1] = (E) => u("login_enabled", E.target.checked))
          }, null, 40, da),
          d[5] || (d[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(t(s)("security.loginSwitch")), 1),
            e("small", ca, l(t(s)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", pa, [
          e("div", va, [
            e("strong", null, l(t(pe) ? t(s)("security.changePin") : t(s)("auth.setupTitle")), 1),
            e("span", {
              class: B(["sec-chip", { on: t(pe) }])
            }, l(t(pe) ? t(s)("security.pinSet") : t(s)("security.pinUnset")), 3)
          ]),
          e("div", ha, [
            e("div", ma, [
              e("span", _a, l(t(s)("auth.pinNew")), 1),
              Q(t(Ie), {
                modelValue: x.value,
                "onUpdate:modelValue": d[2] || (d[2] = (E) => x.value = E)
              }, null, 8, ["modelValue"])
            ]),
            e("div", ba, [
              e("span", ga, l(t(s)("auth.pinConfirm")), 1),
              Q(t(Ie), {
                modelValue: z.value,
                "onUpdate:modelValue": d[3] || (d[3] = (E) => z.value = E),
                onComplete: m
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", ya, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: g.value,
              onClick: m
            }, l(t(s)("auth.savePin")), 9, ka),
            t(pe) ? (n(), a("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: g.value,
              onClick: f
            }, l(t(s)("security.removePin")), 9, fa)) : w("", !0)
          ])
        ]),
        e("section", $a, [
          e("div", wa, [
            e("strong", null, l(t(s)("security.pages")), 1),
            e("span", Ca, l(t(s)("security.pageCount", { n: t(ge).length })), 1)
          ]),
          e("p", Sa, l(t(s)("security.pagesHelp")), 1),
          e("div", xa, [
            (n(!0), a(I, null, J(U.value, (E) => (n(), a("label", {
              key: E.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: t(ge).includes(E.path),
                disabled: g.value,
                onChange: (O) => v(E.path, O.target.checked)
              }, null, 40, Pa),
              d[6] || (d[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", Ua, [
                e("span", Ta, l(E.label), 1),
                e("code", null, l(E.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      p.value ? (n(), a("p", Va, l(p.value), 1)) : w("", !0),
      $.value ? (n(), a("p", Ma, l($.value), 1)) : w("", !0)
    ]));
  }
}), Ea = /* @__PURE__ */ ue(Aa, [["__scopeId", "data-v-b1d117f0"]]), Oa = { class: "mcp-panel" }, La = { class: "mcp-head" }, za = { class: "mcp-actions" }, Ia = ["disabled"], Na = {
  key: 0,
  class: "error-banner"
}, Da = {
  key: 1,
  class: "notice-banner"
}, Fa = {
  key: 2,
  class: "hint"
}, ja = {
  key: 3,
  class: "mcp-list"
}, Ka = { class: "mcp-row" }, Ha = { class: "mcp-field grow" }, Ra = ["onUpdate:modelValue", "readonly"], Ba = { class: "mcp-field" }, Ja = ["onUpdate:modelValue", "onChange"], Wa = { class: "mcp-toggle" }, Ya = ["onUpdate:modelValue"], qa = ["onClick"], Ga = { class: "mcp-field" }, Qa = ["onUpdate:modelValue"], Xa = { class: "mcp-field" }, Za = ["onUpdate:modelValue"], ei = { class: "mcp-field" }, ti = ["onUpdate:modelValue"], si = { class: "mcp-field" }, li = ["onUpdate:modelValue"], oi = { class: "mail-grid" }, ni = { class: "mail-col" }, ai = { class: "mcp-field" }, ii = ["onUpdate:modelValue"], ri = { class: "mail-row" }, ui = { class: "mcp-field" }, di = ["onUpdate:modelValue"], ci = { class: "mcp-toggle" }, pi = ["onUpdate:modelValue"], vi = { class: "mcp-field" }, hi = ["onUpdate:modelValue"], mi = { class: "mcp-field" }, _i = ["onUpdate:modelValue"], bi = { class: "mail-col" }, gi = { class: "mcp-field" }, yi = ["onUpdate:modelValue"], ki = { class: "mail-row" }, fi = { class: "mcp-field" }, $i = ["onUpdate:modelValue"], wi = { class: "mcp-toggle" }, Ci = ["onUpdate:modelValue"], Si = { class: "mcp-field" }, xi = ["onUpdate:modelValue"], Pi = { class: "mcp-field" }, Ui = ["onUpdate:modelValue"], Ti = { class: "mail-row" }, Vi = { class: "mcp-field grow" }, Mi = ["onUpdate:modelValue"], Ai = { class: "mcp-field" }, Ei = ["onUpdate:modelValue"], Oi = {
  key: 0,
  class: "hint"
}, Li = /* @__PURE__ */ X({
  __name: "McpPanel",
  setup(R) {
    const s = S([]), _ = S(!1), k = S(!1), b = S(""), g = S(!1);
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
    function $(v) {
      const m = v?.transport === "http" ? "http" : v?.transport === "builtin" || v?.builtin ? "builtin" : "stdio", f = v?.options?.imap || {}, P = v?.options?.smtp || {};
      return {
        id: String(v?.id || ""),
        transport: m,
        command: String(v?.command || ""),
        argsText: Array.isArray(v?.args) ? v.args.join(`
`) : "",
        url: String(v?.url || ""),
        headersText: v?.headers && typeof v.headers == "object" ? JSON.stringify(v.headers, null, 2) : "",
        enabled: v?.enabled !== !1,
        imapHost: String(f.host || ""),
        imapPort: Number(f.port) || 993,
        imapSsl: f.ssl !== !1,
        imapUser: String(f.user || ""),
        imapPassword: String(f.password || ""),
        smtpHost: String(P.host || ""),
        smtpPort: Number(P.port) || 465,
        smtpSecure: P.secure !== !1,
        smtpUser: String(P.user || ""),
        smtpPassword: String(P.password || ""),
        from: String(P.from || ""),
        fromName: String(P.fromName || "0KAY")
      };
    }
    function x(v) {
      if (v.transport === "builtin") {
        const f = {};
        return (v.imapHost.trim() || v.imapUser.trim()) && (f.imap = {
          host: v.imapHost.trim(),
          port: Number(v.imapPort) || 993,
          ssl: v.imapSsl,
          user: v.imapUser.trim(),
          password: v.imapPassword
        }), (v.smtpHost.trim() || v.smtpUser.trim() || v.from.trim()) && (f.smtp = {
          host: v.smtpHost.trim(),
          port: Number(v.smtpPort) || 465,
          secure: v.smtpSecure,
          user: v.smtpUser.trim(),
          password: v.smtpPassword,
          from: v.from.trim(),
          fromName: v.fromName.trim() || "0KAY"
        }), { id: v.id.trim() || "mail", transport: "builtin", builtin: "mail", enabled: v.enabled, options: f };
      }
      const m = { id: v.id.trim(), transport: v.transport, enabled: v.enabled };
      if (v.transport === "http") {
        if (v.url.trim() && (m.url = v.url.trim()), v.headersText.trim())
          try {
            m.headers = JSON.parse(v.headersText);
          } catch {
            throw new Error(`服务「${v.id || "(未命名)"}」的 Headers 不是合法 JSON`);
          }
      } else {
        v.command.trim() && (m.command = v.command.trim());
        const f = v.argsText.split(`
`).map((P) => P.trim()).filter(Boolean);
        f.length && (m.args = f);
      }
      return m;
    }
    function z(v) {
      v.transport === "builtin" && (v.id = "mail");
    }
    function U() {
      const v = p();
      s.value.some((m) => m.transport === "builtin") && (v.transport = "stdio"), s.value.push(v);
    }
    async function i() {
      _.value = !0, b.value = "";
      try {
        const m = (await ce("/api/settings/mcp"))?.values?.servers;
        let f = [];
        if (typeof m == "string" && m.trim())
          try {
            const P = JSON.parse(m);
            Array.isArray(P) && (f = P);
          } catch {
            b.value = "已保存的 MCP 配置不是合法 JSON，已忽略。";
          }
        s.value = f.map($);
      } catch (v) {
        b.value = v?.message || String(v);
      } finally {
        _.value = !1;
      }
    }
    async function u() {
      if (!k.value) {
        k.value = !0, b.value = "", g.value = !1;
        try {
          const v = /* @__PURE__ */ new Set(), m = s.value.map(x).filter((f) => {
            const P = String(f.id || "").trim();
            return !P || v.has(P) ? !1 : (v.add(P), !0);
          });
          await $e("/api/settings/mcp", { values: { servers: JSON.stringify(m) } }), g.value = !0, setTimeout(() => {
            g.value = !1;
          }, 2e3);
        } catch (v) {
          b.value = v?.message || String(v);
        } finally {
          k.value = !1;
        }
      }
    }
    return re(i), (v, m) => (n(), a("div", Oa, [
      e("header", La, [
        m[0] || (m[0] = e("div", null, [
          e("h2", null, "MCP 服务"),
          e("p", { class: "subtitle" }, "配置外部 MCP（模型上下文协议）服务。保存后 Agent 与 L.I.F.E 共用同一份配置。")
        ], -1)),
        e("div", za, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: U
          }, "添加服务"),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: k.value,
            onClick: u
          }, l(k.value ? "保存中…" : "保存"), 9, Ia)
        ])
      ]),
      b.value ? (n(), a("div", Na, l(b.value), 1)) : w("", !0),
      g.value ? (n(), a("div", Da, "已保存")) : w("", !0),
      _.value ? (n(), a("p", Fa, "加载中…")) : (n(), a("div", ja, [
        (n(!0), a(I, null, J(s.value, (f, P) => (n(), a("article", {
          key: P,
          class: B(["mcp-card", { "is-builtin": f.transport === "builtin" }])
        }, [
          e("div", Ka, [
            e("label", Ha, [
              m[1] || (m[1] = e("span", null, "ID", -1)),
              V(e("input", {
                "onUpdate:modelValue": (d) => f.id = d,
                readonly: f.transport === "builtin",
                placeholder: "filesystem"
              }, null, 8, Ra), [
                [N, f.id]
              ])
            ]),
            e("label", Ba, [
              m[3] || (m[3] = e("span", null, "传输", -1)),
              V(e("select", {
                "onUpdate:modelValue": (d) => f.transport = d,
                onChange: (d) => z(f)
              }, [...m[2] || (m[2] = [
                e("option", { value: "stdio" }, "stdio", -1),
                e("option", { value: "http" }, "http", -1),
                e("option", { value: "builtin" }, "内置邮件 (mail)", -1)
              ])], 40, Ja), [
                [qe, f.transport]
              ])
            ]),
            e("label", Wa, [
              V(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (d) => f.enabled = d
              }, null, 8, Ya), [
                [ee, f.enabled]
              ]),
              m[4] || (m[4] = e("span", null, "启用", -1))
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (d) => s.value.splice(P, 1)
            }, "删除", 8, qa)
          ]),
          f.transport === "stdio" ? (n(), a(I, { key: 0 }, [
            e("label", Ga, [
              m[5] || (m[5] = e("span", null, "命令", -1)),
              V(e("input", {
                "onUpdate:modelValue": (d) => f.command = d,
                placeholder: "npx"
              }, null, 8, Qa), [
                [N, f.command]
              ])
            ]),
            e("label", Xa, [
              m[6] || (m[6] = e("span", null, "参数（每行一个）", -1)),
              V(e("textarea", {
                "onUpdate:modelValue": (d) => f.argsText = d,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, Za), [
                [N, f.argsText]
              ])
            ])
          ], 64)) : f.transport === "http" ? (n(), a(I, { key: 1 }, [
            e("label", ei, [
              m[7] || (m[7] = e("span", null, "URL", -1)),
              V(e("input", {
                "onUpdate:modelValue": (d) => f.url = d,
                placeholder: "https://example.com/mcp"
              }, null, 8, ti), [
                [N, f.url]
              ])
            ]),
            e("label", si, [
              m[8] || (m[8] = e("span", null, "Headers（JSON）", -1)),
              V(e("textarea", {
                "onUpdate:modelValue": (d) => f.headersText = d,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, li), [
                [N, f.headersText]
              ])
            ])
          ], 64)) : (n(), a(I, { key: 2 }, [
            m[23] || (m[23] = e("p", { class: "builtin-note" }, [
              q("内置 0kay-mcp 邮件服务器：L.I.F.E 的 "),
              e("code", null, "getmail"),
              q(" / "),
              e("code", null, "sendmail"),
              q(" 工具经此收发邮件。留空表示不启用对应方向。")
            ], -1)),
            e("div", oi, [
              e("div", ni, [
                m[14] || (m[14] = e("p", { class: "mail-label" }, "收信 · IMAP", -1)),
                e("label", ai, [
                  m[9] || (m[9] = e("span", null, "主机", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (d) => f.imapHost = d,
                    placeholder: "imap.example.com",
                    autocomplete: "off"
                  }, null, 8, ii), [
                    [N, f.imapHost]
                  ])
                ]),
                e("div", ri, [
                  e("label", ui, [
                    m[10] || (m[10] = e("span", null, "端口", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (d) => f.imapPort = d,
                      type: "number",
                      placeholder: "993"
                    }, null, 8, di), [
                      [
                        N,
                        f.imapPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", ci, [
                    V(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (d) => f.imapSsl = d
                    }, null, 8, pi), [
                      [ee, f.imapSsl]
                    ]),
                    m[11] || (m[11] = e("span", null, "SSL", -1))
                  ])
                ]),
                e("label", vi, [
                  m[12] || (m[12] = e("span", null, "用户名", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (d) => f.imapUser = d,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, hi), [
                    [N, f.imapUser]
                  ])
                ]),
                e("label", mi, [
                  m[13] || (m[13] = e("span", null, "密码 / 应用专用密码", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (d) => f.imapPassword = d,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, _i), [
                    [N, f.imapPassword]
                  ])
                ])
              ]),
              e("div", bi, [
                m[22] || (m[22] = e("p", { class: "mail-label" }, "发信 · SMTP", -1)),
                e("label", gi, [
                  m[15] || (m[15] = e("span", null, "主机", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (d) => f.smtpHost = d,
                    placeholder: "smtp.example.com",
                    autocomplete: "off"
                  }, null, 8, yi), [
                    [N, f.smtpHost]
                  ])
                ]),
                e("div", ki, [
                  e("label", fi, [
                    m[16] || (m[16] = e("span", null, "端口", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (d) => f.smtpPort = d,
                      type: "number",
                      placeholder: "465"
                    }, null, 8, $i), [
                      [
                        N,
                        f.smtpPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", wi, [
                    V(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (d) => f.smtpSecure = d
                    }, null, 8, Ci), [
                      [ee, f.smtpSecure]
                    ]),
                    m[17] || (m[17] = e("span", null, "SSL（465）", -1))
                  ])
                ]),
                e("label", Si, [
                  m[18] || (m[18] = e("span", null, "用户名", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (d) => f.smtpUser = d,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, xi), [
                    [N, f.smtpUser]
                  ])
                ]),
                e("label", Pi, [
                  m[19] || (m[19] = e("span", null, "密码 / 应用专用密码", -1)),
                  V(e("input", {
                    "onUpdate:modelValue": (d) => f.smtpPassword = d,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, Ui), [
                    [N, f.smtpPassword]
                  ])
                ]),
                e("div", Ti, [
                  e("label", Vi, [
                    m[20] || (m[20] = e("span", null, "发件人地址（可选）", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (d) => f.from = d,
                      placeholder: "留空用 SMTP 用户名",
                      autocomplete: "off"
                    }, null, 8, Mi), [
                      [N, f.from]
                    ])
                  ]),
                  e("label", Ai, [
                    m[21] || (m[21] = e("span", null, "发件人昵称", -1)),
                    V(e("input", {
                      "onUpdate:modelValue": (d) => f.fromName = d,
                      placeholder: "0KAY",
                      autocomplete: "off"
                    }, null, 8, Ei), [
                      [N, f.fromName]
                    ])
                  ])
                ])
              ])
            ])
          ], 64))
        ], 2))), 128)),
        s.value.length ? w("", !0) : (n(), a("p", Oi, "还没有 MCP 服务，点击「添加服务」。传输选择「内置邮件」可配置邮箱收发。"))
      ]))
    ]));
  }
}), zi = /* @__PURE__ */ ue(Li, [["__scopeId", "data-v-35a85711"]]), Ii = { class: "content-card danger" }, Ni = { class: "card-desc" }, Di = { class: "danger-box" }, Fi = /* @__PURE__ */ X({
  __name: "DangerPanel",
  setup(R) {
    const { t: s } = ae(), _ = Ae(), k = Fe();
    function b() {
      _.resetWizard(), k.push("/");
    }
    return (g, p) => (n(), a("div", Ii, [
      e("h2", null, l(t(s)("settings.tabs.danger")), 1),
      e("p", Ni, l(t(s)("settings.resetDesc")), 1),
      e("div", Di, [
        e("div", null, [
          e("strong", null, l(t(s)("settings.reset")), 1),
          e("p", null, l(t(s)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          onClick: b
        }, l(t(s)("settings.reset")), 1)
      ])
    ]));
  }
}), ji = {
  key: 1,
  class: "plugin-pane-message"
}, Ki = {
  key: 2,
  class: "plugin-pane-message"
}, Hi = /* @__PURE__ */ X({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(R) {
    const s = R, _ = Le(null), k = Le("");
    return Ge(
      () => s.module,
      async (b) => {
        if (!b) {
          _.value = null, k.value = "";
          return;
        }
        try {
          const g = await import(
            /* @vite-ignore */
            b
          );
          _.value = g?.default || g, k.value = "";
        } catch (g) {
          _.value = null, k.value = g?.message || String(g);
        }
      },
      { immediate: !0 }
    ), (b, g) => _.value ? (n(), le(Qe(_.value), { key: 0 })) : k.value ? (n(), a("div", ji, l(k.value), 1)) : (n(), a("div", Ki, "Loading plugin module…"));
  }
}), Ri = /* @__PURE__ */ ue(Hi, [["__scopeId", "data-v-2d1f36bc"]]), Bi = { class: "models-field" }, Ji = {
  key: 0,
  class: "models-list"
}, Wi = { class: "models-rank" }, Yi = ["title"], qi = { class: "models-actions" }, Gi = ["disabled", "aria-label", "onClick"], Qi = ["disabled", "aria-label", "onClick"], Xi = ["aria-label", "onClick"], Zi = {
  key: 1,
  class: "models-empty"
}, er = /* @__PURE__ */ X({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(R, { emit: s }) {
    const { locale: _ } = ae(), k = R, b = s, g = W(() => String(k.modelValue || "").split(",").map((i) => i.trim()).filter(Boolean)), p = W(() => k.options.filter((i) => !g.value.includes(i)));
    function $(i) {
      b("update:modelValue", i.join(","));
    }
    function x(i) {
      i && !g.value.includes(i) && $([...g.value, i]);
    }
    function z(i) {
      $(g.value.filter((u) => u !== i));
    }
    function U(i, u) {
      const v = [...g.value], m = i + u;
      m < 0 || m >= v.length || ([v[i], v[m]] = [v[m], v[i]], $(v));
    }
    return (i, u) => (n(), a("div", Bi, [
      g.value.length ? (n(), a("ol", Ji, [
        (n(!0), a(I, null, J(g.value, (v, m) => (n(), a("li", { key: v }, [
          e("span", Wi, l(m + 1), 1),
          e("span", {
            class: "models-name",
            title: v
          }, l(v), 9, Yi),
          e("span", qi, [
            e("button", {
              type: "button",
              disabled: m === 0,
              "aria-label": t(_) === "en" ? "Higher priority" : "提高优先级",
              onClick: (f) => U(m, -1)
            }, "↑", 8, Gi),
            e("button", {
              type: "button",
              disabled: m === g.value.length - 1,
              "aria-label": t(_) === "en" ? "Lower priority" : "降低优先级",
              onClick: (f) => U(m, 1)
            }, "↓", 8, Qi),
            e("button", {
              type: "button",
              "aria-label": t(_) === "en" ? "Remove" : "移除",
              onClick: (f) => z(v)
            }, "✕", 8, Xi)
          ])
        ]))), 128))
      ])) : (n(), a("p", Zi, l(t(_) === "en" ? "No fallback models — provider catalog order is used." : "暂无备选模型，将按供应商目录顺序尝试。"), 1)),
      p.value.length ? (n(), le(t(ie), {
        key: 2,
        options: p.value,
        "model-value": "",
        placeholder: t(_) === "en" ? "+ Add fallback model…" : "+ 添加备选模型…",
        "onUpdate:modelValue": x
      }, null, 8, ["options", "placeholder"])) : w("", !0)
    ]));
  }
}), De = /* @__PURE__ */ ue(er, [["__scopeId", "data-v-b73b6842"]]), tr = { class: "settings-page" }, sr = { class: "page-header" }, lr = { class: "subtitle" }, or = { key: 0 }, nr = { key: 1 }, ar = { class: "settings-layout" }, ir = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, rr = ["onClick"], ur = {
  class: "nav-icon",
  "aria-hidden": "true"
}, dr = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, cr = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, pr = {
  key: 2,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, vr = {
  key: 3,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, hr = {
  key: 4,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, mr = {
  key: 5,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, _r = {
  key: 6,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, br = {
  key: 7,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, gr = {
  key: 8,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, yr = {
  key: 9,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, kr = {
  key: 10,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, fr = { class: "nav-label" }, $r = { class: "settings-content" }, wr = {
  key: 0,
  class: "content-card provider-runtime"
}, Cr = {
  key: 0,
  class: "helper-text"
}, Sr = {
  key: 0,
  class: "toggle-label"
}, xr = ["checked", "onChange"], Pr = { key: 0 }, Ur = {
  key: 1,
  class: "helper-text"
}, Tr = {
  key: 0,
  class: "helper-text"
}, Vr = ["type", "value", "onInput"], Mr = {
  key: 0,
  class: "helper-text"
}, Ar = {
  key: 1,
  class: "helper-text"
}, Er = { class: "actions-row" }, Or = {
  key: 3,
  class: "content-card"
}, Lr = { class: "card-desc" }, zr = { class: "toggle-label" }, Ir = { class: "field" }, Nr = { class: "model-choices" }, Dr = ["value", "checked", "onChange"], Fr = ["placeholder"], jr = { class: "helper-text" }, Kr = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, Hr = { class: "field" }, Rr = {
  key: 0,
  class: "helper-text"
}, Br = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, Jr = ["value", "checked", "onChange"], Wr = ["onClick"], Yr = {
  key: 8,
  class: "content-card"
}, qr = {
  key: 0,
  class: "card-desc"
}, Gr = {
  key: 1,
  class: "helper-text"
}, Qr = {
  key: 0,
  class: "toggle-label"
}, Xr = ["checked", "onChange"], Zr = { key: 0 }, eu = {
  key: 1,
  class: "helper-text"
}, tu = {
  key: 0,
  class: "helper-text"
}, su = {
  key: 0,
  class: "helper-text"
}, lu = {
  key: 0,
  class: "helper-text"
}, ou = { class: "actions-row" }, nu = ["disabled"], au = {
  key: 0,
  class: "helper-text"
}, iu = {
  key: 0,
  class: "helper-text"
}, ru = ["type", "value", "onInput"], uu = {
  key: 0,
  class: "helper-text"
}, du = {
  key: 2,
  class: "helper-text"
}, cu = { class: "actions-row" }, pu = {
  key: 10,
  class: "content-card"
}, vu = {
  key: 0,
  class: "card-desc"
}, hu = {
  key: 1,
  class: "card-desc"
}, mu = {
  key: 0,
  class: "toggle-label"
}, _u = ["checked", "onChange"], bu = { key: 0 }, gu = {
  key: 1,
  class: "helper-text"
}, yu = {
  key: 0,
  class: "helper-text"
}, ku = {
  key: 0,
  class: "helper-text"
}, fu = {
  key: 0,
  class: "helper-text"
}, $u = ["type", "value", "onInput"], wu = {
  key: 0,
  class: "helper-text"
}, Cu = {
  key: 2,
  class: "helper-text"
}, Su = { class: "actions-row" }, Au = /* @__PURE__ */ X({
  __name: "SettingsPage",
  setup(R) {
    const { t: s, locale: _ } = ae(), { confirm: k } = Me(), b = Ae(), g = lt(), p = Ke(), $ = Xe(), x = Fe(), z = W(() => p.settingsTabs.map((r) => ({
      id: r.id,
      icon: r.icon || "chip"
    }))), U = W(() => {
      const r = new Set(p.settingsTabs.map((o) => o.id)), h = new Set(p.removedSettingsIds);
      return g.sections.filter((o) => o.id !== "permissions" && !r.has(o.id) && !h.has(o.id)).map((o) => ({ id: o.id, icon: o.icon || "lock" }));
    }), i = W(() => [...z.value, ...U.value]), u = S("general"), v = S(!1), m = S([]), f = S(null), P = S(""), d = S({}), E = S(""), O = S(!1), D = S(""), Y = S([]), F = W(() => _.value === "en" ? "Auto (by strategy)" : "自动（按策略）"), M = W(() => [
      { value: "", label: F.value },
      ...Y.value.map((r) => ({ value: r, label: r }))
    ]);
    async function K() {
      try {
        const r = await fetch("/api/models");
        if (!r.ok) return;
        const h = await r.json();
        Y.value = Array.from(new Set((h.models || []).map((o) => String(o.id || "")).filter(Boolean)));
      } catch {
      }
    }
    async function te(r) {
      O.value = !0, D.value = "";
      try {
        const h = await fetch(`/api/settings/${r}/test`, { method: "POST" }), o = h.headers.get("content-type") || "";
        if (h.ok && o.startsWith("audio")) {
          const C = URL.createObjectURL(await h.blob());
          try {
            await new Audio(C).play();
          } catch {
          }
          window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: C } })), D.value = "测试成功，正在播放…";
        } else {
          const C = await h.json().catch(() => ({}));
          D.value = C.error || `HTTP ${h.status}`;
        }
      } catch (h) {
        D.value = h instanceof Error ? h.message : String(h);
      } finally {
        O.value = !1;
      }
    }
    const { tabMeta: j, isBuiltinTab: A, isPluginSection: L, tabLabel: T, fieldLabel: oe, fieldHelp: ve, pluginSection: G } = Ee(), he = W(() => A(u.value) ? null : j(u.value)?.module || null);
    function _e(r, h) {
      const o = d.value[r]?.[h];
      return typeof o == "boolean" ? o : o === "true" || o === 1 || o === "1";
    }
    function ye(r) {
      if (j(r)?.fields?.length && !A(r)) {
        Ce(r);
        return;
      }
      const o = G(r);
      if (!o) return;
      const C = {};
      for (const H of o.fields)
        H.type === "bool" ? C[H.key] = H.default_value === "true" || H.default_value === "1" : H.type === "number" ? C[H.key] = Number(H.default_value || 0) : C[H.key] = H.default_value || "";
      const se = g.values[r] || {}, Z = { ...C };
      for (const H of o.fields) {
        if (!(H.key in se)) continue;
        const ne = se[H.key];
        H.type === "bool" ? Z[H.key] = ne === !0 || ne === "true" || ne === 1 || ne === "1" : Z[H.key] = ne;
      }
      d.value = {
        ...d.value,
        [r]: Z
      };
    }
    async function Ce(r) {
      const h = j(r);
      if (!h?.fields?.length) return;
      const o = {};
      for (const C of h.fields)
        C.type === "bool" ? o[C.key] = C.default_value === "true" || C.default_value === "1" : C.type === "number" ? o[C.key] = Number(C.default_value || 0) : o[C.key] = C.default_value || "";
      if (h.loadApi)
        try {
          const C = await fetch(h.loadApi);
          if (C.ok) {
            const se = await C.json();
            for (const Z of h.fields) {
              if (!(Z.key in se)) continue;
              const H = se[Z.key];
              Z.type === "bool" ? o[Z.key] = H === !0 || H === "true" || H === 1 || H === "1" : o[Z.key] = H;
            }
          }
        } catch {
        }
      d.value = { ...d.value, [r]: o };
    }
    async function ke(r) {
      const h = j(r);
      E.value = "";
      try {
        const o = d.value[r] || {};
        if (h?.saveApi) {
          const C = await fetch(h.saveApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(o)
          });
          if (!C.ok) throw new Error(String(C.status));
        }
        E.value = s("settings.saved"), setTimeout(() => {
          E.value = "";
        }, 1500);
      } catch {
        E.value = s("settings.permFailed");
      }
    }
    async function fe(r) {
      E.value = "";
      try {
        await g.saveValues(r, d.value[r] || {}), E.value = s("settings.saved"), setTimeout(() => {
          E.value = "";
        }, 1500);
      } catch {
        E.value = s("settings.permFailed");
      }
    }
    async function be() {
      try {
        const r = await fetch("/api/live2d");
        if (r.ok) {
          const h = await r.json();
          m.value = h.models || [];
        }
      } catch {
        m.value = [];
      }
    }
    async function Se(r) {
      if (await k({
        title: s("settings.live2d"),
        message: `删除模型 ${r.label} 及所在模型文件夹中的全部资源？`,
        confirmLabel: _.value === "en" ? "Delete" : "删除",
        danger: !0
      }))
        try {
          const o = await fetch(`/api/live2d/${encodeURIComponent(r.id)}`, { method: "DELETE" });
          if (!o.ok) throw new Error(await o.text());
          const C = await o.json();
          m.value = C.models || [];
          const se = r.url.slice(0, r.url.indexOf("/", 15) + 1);
          b.live2d.modelUrl.startsWith(se) && (b.live2d.modelUrl = "", b.live2d.enabled = !1, b.saveToStorage()), await de(), P.value = "模型已删除", window.dispatchEvent(new Event("live2d-models-changed"));
        } catch (o) {
          P.value = o.message;
        }
    }
    async function de() {
      b.saveToStorage();
      const r = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: b.live2d.enabled, model_url: b.live2d.modelUrl } }) });
      if (!r.ok) throw new Error(await r.text());
    }
    function xe() {
      f.value?.click();
    }
    async function Pe(r) {
      const h = r.target, o = h.files;
      if (!(!o || o.length === 0)) {
        P.value = "";
        try {
          const C = new FormData(), se = [];
          for (const ne of Array.from(o)) {
            const Re = ne.webkitRelativePath || ne.name;
            se.push(Re), C.append("files", ne, ne.name);
          }
          C.append("paths", JSON.stringify(se));
          const Z = await fetch("/api/live2d", { method: "POST", body: C });
          if (!Z.ok) throw new Error(await Z.text());
          const H = await Z.json();
          P.value = s("settings.uploadOk"), H?.models ? m.value = H.models : await be(), H?.model_url && (b.live2d.modelUrl = H.model_url, b.live2d.enabled = !0, b.saveToStorage(), await de(), window.dispatchEvent(new Event("live2d-models-changed")));
        } catch (C) {
          P.value = `${s("settings.uploadFail")}：${C.message}`;
        } finally {
          h.value = "";
        }
      }
    }
    re(async () => {
      b.loadFromStorage();
      const r = $.query.tab;
      r && (u.value = r), be(), K(), await g.fetchSections();
      for (const h of g.sections) ye(h.id);
    });
    function c(r) {
      u.value = r, A(r) || ye(r), x.replace({ query: { tab: r } });
    }
    function y() {
      b.saveToStorage(), u.value === "live2d" && de().catch((r) => {
        P.value = r.message;
      }), v.value = !0, setTimeout(() => {
        v.value = !1;
      }, 1500);
    }
    return (r, h) => (n(), a("div", tr, [
      e("header", sr, [
        e("div", null, [
          e("h1", null, l(t(s)("settings.title")), 1),
          e("p", lr, l(t(s)("settings.pageDesc")), 1)
        ]),
        u.value !== "about" && !he.value ? (n(), a("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: y
        }, [
          v.value ? (n(), a("span", or, l(t(s)("settings.saved")), 1)) : (n(), a("span", nr, l(t(s)("settings.save")), 1))
        ])) : w("", !0)
      ]),
      e("div", ar, [
        e("nav", ir, [
          (n(!0), a(I, null, J(i.value, (o) => (n(), a("button", {
            key: o.id,
            class: B(["nav-item", { active: u.value === o.id }]),
            onClick: (C) => c(o.id)
          }, [
            h[18] || (h[18] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", ur, [
              o.icon === "globe" ? (n(), a("svg", dr, [...h[7] || (h[7] = [
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
              ])])) : o.icon === "cloud" ? (n(), a("svg", cr, [...h[8] || (h[8] = [
                e("path", {
                  d: "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])])) : o.icon === "chip" ? (n(), a("svg", pr, [...h[9] || (h[9] = [
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
              ])])) : o.icon === "person" ? (n(), a("svg", vr, [...h[10] || (h[10] = [
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
              ])])) : o.icon === "avatar" ? (n(), a("svg", hr, [...h[11] || (h[11] = [
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
              ])])) : o.icon === "brightness" ? (n(), a("svg", mr, [...h[12] || (h[12] = [
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
              ])])) : o.icon === "warn" ? (n(), a("svg", _r, [...h[13] || (h[13] = [
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
              ])])) : o.icon === "info" ? (n(), a("svg", br, [...h[14] || (h[14] = [
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
              ])])) : o.icon === "download" ? (n(), a("svg", gr, [...h[15] || (h[15] = [
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
              ])])) : o.icon === "shield" ? (n(), a("svg", yr, [...h[16] || (h[16] = [
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
              ])])) : (n(), a("svg", kr, [...h[17] || (h[17] = [
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
            e("span", fr, l(t(T)(o.id)), 1)
          ], 10, rr))), 128))
        ]),
        e("section", $r, [
          u.value === "general" ? (n(), le(yn, { key: 0 })) : u.value === "provider" ? (n(), a(I, { key: 1 }, [
            Q(on),
            t(G)("provider")?.fields?.length ? (n(), a("div", wr, [
              e("h3", null, l(t(G)("provider").label), 1),
              t(G)("provider").description ? (n(), a("p", Cr, l(t(G)("provider").description), 1)) : w("", !0),
              (n(!0), a(I, null, J(t(G)("provider").fields, (o) => (n(), a("div", {
                key: o.key,
                class: "field"
              }, [
                o.type === "bool" ? (n(), a("label", Sr, [
                  e("input", {
                    type: "checkbox",
                    checked: _e("provider", o.key),
                    onChange: (C) => d.value = { ...d.value, provider: { ...d.value.provider, [o.key]: C.target.checked } }
                  }, null, 40, xr),
                  h[19] || (h[19] = e("span", { class: "toggle-slider" }, null, -1)),
                  e("span", null, [
                    e("strong", null, l(o.label), 1),
                    o.help ? (n(), a("br", Pr)) : w("", !0),
                    o.help ? (n(), a("small", Ur, l(o.help), 1)) : w("", !0)
                  ])
                ])) : o.type === "select" ? (n(), a(I, { key: 1 }, [
                  e("label", null, l(o.label), 1),
                  Q(t(ie), {
                    class: "input",
                    "aria-label": o.label,
                    "model-value": String(d.value.provider?.[o.key] ?? ""),
                    options: o.options || [],
                    "onUpdate:modelValue": (C) => d.value = { ...d.value, provider: { ...d.value.provider, [o.key]: C } }
                  }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                  o.help ? (n(), a("p", Tr, l(o.help), 1)) : w("", !0)
                ], 64)) : (n(), a(I, { key: 2 }, [
                  e("label", null, l(o.label), 1),
                  e("input", {
                    class: "input",
                    type: o.type === "number" ? "number" : "text",
                    value: d.value.provider?.[o.key],
                    onInput: (C) => d.value = { ...d.value, provider: { ...d.value.provider, [o.key]: o.type === "number" ? Number(C.target.value) : C.target.value } }
                  }, null, 40, Vr),
                  o.help ? (n(), a("p", Mr, l(o.help), 1)) : w("", !0)
                ], 64))
              ]))), 128)),
              E.value ? (n(), a("div", Ar, l(E.value), 1)) : w("", !0),
              e("div", Er, [
                e("button", {
                  class: "btn btn-primary",
                  type: "button",
                  onClick: h[0] || (h[0] = (o) => fe("provider"))
                }, l(t(s)("settings.save")), 1)
              ])
            ])) : w("", !0)
          ], 64)) : u.value === "persona" ? (n(), le(In, { key: 2 })) : u.value === "live2d" ? (n(), a("div", Or, [
            e("h2", null, l(t(T)("live2d")), 1),
            e("p", Lr, l(t(j)("live2d")?.descriptionKey ? t(s)(t(j)("live2d").descriptionKey) : t(s)("settings.live2dDesc")), 1),
            Q(nt, { class: "live2d-preview" }),
            e("label", zr, [
              V(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": h[1] || (h[1] = (o) => t(b).live2d.enabled = o)
              }, null, 512), [
                [ee, t(b).live2d.enabled]
              ]),
              h[20] || (h[20] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", null, l(t(s)("wizard.enableLive2d")), 1)
            ]),
            e("div", Ir, [
              e("label", null, l(t(s)("wizard.modelUrl")), 1),
              e("div", Nr, [
                (n(!0), a(I, null, J(t(ot), (o) => (n(), a("label", {
                  key: o.id,
                  class: B(["model-choice", { selected: t(b).live2d.modelUrl === o.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-model",
                    value: o.url,
                    checked: t(b).live2d.modelUrl === o.url,
                    onChange: (C) => {
                      t(b).live2d.modelUrl = o.url, t(b).live2d.enabled = !0;
                    }
                  }, null, 40, Dr),
                  e("span", null, l(o.label), 1),
                  e("code", null, l(o.url), 1)
                ], 2))), 128))
              ]),
              V(e("input", {
                "onUpdate:modelValue": h[2] || (h[2] = (o) => t(b).live2d.modelUrl = o),
                placeholder: t(s)("wizard.modelUrlPlaceholder"),
                class: "input"
              }, null, 8, Fr), [
                [N, t(b).live2d.modelUrl]
              ]),
              e("p", jr, [
                q(l(t(s)("wizard.live2dHelp")) + " ", 1),
                e("a", Kr, l(t(s)("wizard.live2dSamples")), 1)
              ])
            ]),
            h[21] || (h[21] = e("p", { class: "helper-text" }, "支持 Cubism 2（.model.json + .moc）与 Cubism 3/4（.model3.json + .moc3）。请选择完整模型文件夹，包含纹理、动作等资源。", -1)),
            e("button", {
              class: "btn btn-tonal",
              onClick: h[3] || (h[3] = (o) => de().catch((C) => P.value = C.message))
            }, "保存 LIFE 的 Live2D 设置"),
            e("div", Hr, [
              e("label", null, l(t(s)("settings.uploadFolder")), 1),
              e("label", {
                class: "upload-area",
                onClick: ze(xe, ["prevent"])
              }, [
                e("span", null, l(t(s)("settings.uploadFolderHint")), 1)
              ]),
              e("input", {
                ref_key: "folderInput",
                ref: f,
                type: "file",
                webkitdirectory: "",
                directory: "",
                multiple: "",
                class: "file-input",
                onChange: Pe
              }, null, 544),
              P.value ? (n(), a("p", Rr, l(P.value), 1)) : w("", !0),
              m.value.length ? (n(), a("div", Br, [
                (n(!0), a(I, null, J(m.value, (o) => (n(), a("label", {
                  key: o.id,
                  class: B(["model-choice", { selected: t(b).live2d.modelUrl === o.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-uploaded",
                    value: o.url,
                    checked: t(b).live2d.modelUrl === o.url,
                    onChange: (C) => {
                      t(b).live2d.modelUrl = o.url, t(b).live2d.enabled = !0, de().catch((se) => P.value = se.message);
                    }
                  }, null, 40, Jr),
                  e("span", null, l(o.label), 1),
                  e("code", null, l(o.url), 1),
                  e("button", {
                    type: "button",
                    class: "btn btn-danger",
                    onClick: ze((C) => Se(o), ["prevent"])
                  }, "删除模型", 8, Wr)
                ], 2))), 128))
              ])) : w("", !0)
            ])
          ])) : u.value === "security" ? (n(), le(Ea, { key: 4 })) : u.value === "permissions" ? (n(), le(qn, { key: 5 })) : u.value === "mcp" ? (n(), le(zi, { key: 6 })) : u.value === "life_settings" ? (n(), le(Kt, { key: 7 })) : t(L)(u.value) && t(G)(u.value) ? (n(), a("div", Yr, [
            e("h2", null, l(t(G)(u.value).label), 1),
            t(G)(u.value).description ? (n(), a("p", qr, l(t(G)(u.value).description), 1)) : w("", !0),
            t(G)(u.value).plugin_name ? (n(), a("p", Gr, l(t(G)(u.value).plugin_name), 1)) : w("", !0),
            (n(!0), a(I, null, J(t(G)(u.value).fields, (o) => (n(), a("div", {
              key: o.key,
              class: "field"
            }, [
              o.type === "bool" ? (n(), a("label", Qr, [
                e("input", {
                  type: "checkbox",
                  checked: _e(u.value, o.key),
                  onChange: (C) => d.value = { ...d.value, [u.value]: { ...d.value[u.value], [o.key]: C.target.checked } }
                }, null, 40, Xr),
                h[22] || (h[22] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, l(o.label), 1),
                  o.help ? (n(), a("br", Zr)) : w("", !0),
                  o.help ? (n(), a("small", eu, l(o.help), 1)) : w("", !0)
                ])
              ])) : o.type === "select" ? (n(), a(I, { key: 1 }, [
                e("label", null, l(o.label), 1),
                Q(t(ie), {
                  class: "input",
                  "aria-label": o.label,
                  "model-value": String(d.value[u.value]?.[o.key] ?? ""),
                  options: o.options || [],
                  "onUpdate:modelValue": (C) => d.value[u.value] = { ...d.value[u.value], [o.key]: C }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                o.help ? (n(), a("p", tu, l(o.help), 1)) : w("", !0)
              ], 64)) : o.type === "model" ? (n(), a(I, { key: 2 }, [
                e("label", null, l(o.label), 1),
                Q(t(ie), {
                  class: "input",
                  "aria-label": o.label,
                  "model-value": String(d.value[u.value]?.[o.key] ?? ""),
                  options: M.value,
                  "onUpdate:modelValue": (C) => d.value[u.value] = { ...d.value[u.value], [o.key]: C }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                o.help ? (n(), a("p", su, l(o.help), 1)) : w("", !0)
              ], 64)) : o.type === "models" ? (n(), a(I, { key: 3 }, [
                e("label", null, l(o.label), 1),
                Q(De, {
                  "model-value": String(d.value[u.value]?.[o.key] ?? ""),
                  options: Y.value,
                  "onUpdate:modelValue": (C) => d.value[u.value] = { ...d.value[u.value], [o.key]: C }
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                o.help ? (n(), a("p", lu, l(o.help), 1)) : w("", !0)
              ], 64)) : o.type === "test" ? (n(), a(I, { key: 4 }, [
                e("label", null, l(o.label), 1),
                e("div", ou, [
                  e("button", {
                    class: "btn btn-tonal",
                    type: "button",
                    disabled: O.value,
                    onClick: h[4] || (h[4] = (C) => te(u.value))
                  }, l(O.value ? t(s)("settings.testing") : o.label || "测试"), 9, nu),
                  D.value ? (n(), a("span", au, l(D.value), 1)) : w("", !0)
                ]),
                o.help ? (n(), a("p", iu, l(o.help), 1)) : w("", !0)
              ], 64)) : (n(), a(I, { key: 5 }, [
                e("label", null, l(o.label), 1),
                e("input", {
                  class: "input",
                  type: o.type === "number" ? "number" : "text",
                  value: d.value[u.value]?.[o.key],
                  onInput: (C) => d.value[u.value] = { ...d.value[u.value], [o.key]: o.type === "number" ? Number(C.target.value) : C.target.value }
                }, null, 40, ru),
                o.help ? (n(), a("p", uu, l(o.help), 1)) : w("", !0)
              ], 64))
            ]))), 128)),
            E.value ? (n(), a("div", du, l(E.value), 1)) : w("", !0),
            e("div", cu, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: h[5] || (h[5] = (o) => fe(u.value))
              }, l(t(s)("settings.save")), 1)
            ])
          ])) : he.value ? (n(), le(Ri, {
            key: he.value,
            module: he.value || ""
          }, null, 8, ["module"])) : !t(A)(u.value) && t(j)(u.value)?.fields?.length ? (n(), a("div", pu, [
            e("h2", null, l(t(T)(u.value)), 1),
            t(j)(u.value)?.descriptionKey ? (n(), a("p", vu, l(t(s)(t(j)(u.value).descriptionKey)), 1)) : t(j)(u.value)?.description ? (n(), a("p", hu, l(t(j)(u.value).description), 1)) : w("", !0),
            (n(!0), a(I, null, J(t(j)(u.value).fields, (o) => (n(), a("div", {
              key: o.key,
              class: "field"
            }, [
              o.type === "bool" ? (n(), a("label", mu, [
                e("input", {
                  type: "checkbox",
                  checked: _e(u.value, o.key),
                  onChange: (C) => d.value = { ...d.value, [u.value]: { ...d.value[u.value], [o.key]: C.target.checked } }
                }, null, 40, _u),
                h[23] || (h[23] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, l(t(oe)(t(j)(u.value), o.key, `settings.${o.key}`)), 1),
                  o.help || o.helpKey ? (n(), a("br", bu)) : w("", !0),
                  o.help || o.helpKey ? (n(), a("small", gu, l(t(ve)(t(j)(u.value), o.key, `settings.${o.key}Desc`)), 1)) : w("", !0)
                ])
              ])) : o.type === "select" ? (n(), a(I, { key: 1 }, [
                e("label", null, l(t(oe)(t(j)(u.value), o.key, `settings.${o.key}`)), 1),
                Q(t(ie), {
                  class: "input",
                  "aria-label": t(oe)(t(j)(u.value), o.key, `settings.${o.key}`),
                  "model-value": String(d.value[u.value]?.[o.key] ?? ""),
                  options: o.options || [],
                  "onUpdate:modelValue": (C) => d.value[u.value] = { ...d.value[u.value], [o.key]: C }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                o.help || o.helpKey ? (n(), a("p", yu, l(t(ve)(t(j)(u.value), o.key, `settings.${o.key}Desc`)), 1)) : w("", !0)
              ], 64)) : o.type === "model" ? (n(), a(I, { key: 2 }, [
                e("label", null, l(t(oe)(t(j)(u.value), o.key, `settings.${o.key}`)), 1),
                Q(t(ie), {
                  class: "input",
                  "aria-label": t(oe)(t(j)(u.value), o.key, `settings.${o.key}`),
                  "model-value": String(d.value[u.value]?.[o.key] ?? ""),
                  options: M.value,
                  "onUpdate:modelValue": (C) => d.value[u.value] = { ...d.value[u.value], [o.key]: C }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                o.help || o.helpKey ? (n(), a("p", ku, l(t(ve)(t(j)(u.value), o.key, `settings.${o.key}Desc`)), 1)) : w("", !0)
              ], 64)) : o.type === "models" ? (n(), a(I, { key: 3 }, [
                e("label", null, l(t(oe)(t(j)(u.value), o.key, `settings.${o.key}`)), 1),
                Q(De, {
                  "model-value": String(d.value[u.value]?.[o.key] ?? ""),
                  options: Y.value,
                  "onUpdate:modelValue": (C) => d.value[u.value] = { ...d.value[u.value], [o.key]: C }
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                o.help || o.helpKey ? (n(), a("p", fu, l(t(ve)(t(j)(u.value), o.key, `settings.${o.key}Desc`)), 1)) : w("", !0)
              ], 64)) : (n(), a(I, { key: 4 }, [
                e("label", null, l(t(oe)(t(j)(u.value), o.key, `settings.${o.key}`)), 1),
                e("input", {
                  class: "input",
                  type: o.type === "number" ? "number" : "text",
                  value: d.value[u.value]?.[o.key],
                  onInput: (C) => d.value[u.value] = { ...d.value[u.value], [o.key]: o.type === "number" ? Number(C.target.value) : C.target.value }
                }, null, 40, $u),
                o.help || o.helpKey ? (n(), a("p", wu, l(t(ve)(t(j)(u.value), o.key, `settings.${o.key}Desc`)), 1)) : w("", !0)
              ], 64))
            ]))), 128)),
            E.value ? (n(), a("div", Cu, l(E.value), 1)) : w("", !0),
            e("div", Su, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: h[6] || (h[6] = (o) => ke(u.value))
              }, l(t(s)("settings.save")), 1)
            ])
          ])) : u.value === "about" ? (n(), le(Ws, { key: 11 })) : u.value === "updates" ? (n(), le(Ll, { key: 12 })) : (n(), le(Fi, { key: 13 }))
        ])
      ])
    ]));
  }
});
export {
  Au as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".live2d-stage[data-v-594879d8]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-594879d8]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:none;cursor:grab;user-select:none;background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,#f3edf7,#e7e0ec 55%,#d0bcff33)}.stage-viewport[data-v-594879d8]:active{cursor:grabbing}.stage-canvas[data-v-594879d8]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-594879d8]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-594879d8]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-594879d8]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-594879d8]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-594879d8]:active{transform:scale(.96)}.stage-reset.dragging[data-v-594879d8]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-594879d8]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-594879d8]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-594879d8]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-bdd613ec]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-bdd613ec]{flex-direction:row-reverse}.avatar[data-v-bdd613ec]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-bdd613ec]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-bdd613ec]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-bdd613ec]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-bdd613ec]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-bdd613ec]{max-width:70%}.content[data-v-bdd613ec]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.user .content[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-bdd613ec]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-bdd613ec]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-bdd613ec]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-bdd613ec]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-bdd613ec]{margin:4px 0}.think-body b[data-v-bdd613ec]{color:var(--md-on-surface)}.think-summary[data-v-bdd613ec]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-bdd613ec]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-bdd613ec]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-bdd613ec]{justify-content:flex-end}.separator[data-v-bdd613ec]{color:var(--neutral-gray-10)}.emotion[data-v-bdd613ec]{font-weight:500}.chat-panel[data-v-3b7db97c]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-3b7db97c]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-3b7db97c]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-3b7db97c]{color:var(--md-error)}.chat-container[data-v-3b7db97c]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-3b7db97c]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-3b7db97c]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-3b7db97c]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-3b7db97c]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-3b7db97c]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-3b7db97c]{display:flex;gap:4px}.typing-dots span[data-v-3b7db97c]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-3b7db97c 1.4s infinite ease-in-out}.typing-dots span[data-v-3b7db97c]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-3b7db97c]:nth-child(2){animation-delay:-.16s}@keyframes bounce-3b7db97c{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-3b7db97c]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-3b7db97c]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-3b7db97c]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-3b7db97c]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-3b7db97c]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-3b7db97c],.pending-files[data-v-3b7db97c]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-3b7db97c]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-3b7db97c]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-3b7db97c]:hover{color:var(--error)}.pending-thumb[data-v-3b7db97c]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-3b7db97c]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-3b7db97c]{position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.attach-btn[data-v-3b7db97c]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-3b7db97c]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-3b7db97c]:disabled{opacity:.5;cursor:not-allowed}.send-button[data-v-3b7db97c]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-3b7db97c]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-3b7db97c]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-3b7db97c]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-3b7db97c]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-3b7db97c]{background:var(--success)}.disconnected .status-dot[data-v-3b7db97c]{background:var(--error)}.hint[data-v-3b7db97c]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-95ba671e]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-95ba671e]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-95ba671e]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-95ba671e]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-95ba671e]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-95ba671e]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-95ba671e]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-95ba671e]{margin-bottom:var(--space-xl)}.section-header[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-95ba671e]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.section-value[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-30)}.mood-display[data-v-95ba671e]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-95ba671e]{margin-bottom:var(--space-md)}.mood-label[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600}.energy-bar[data-v-95ba671e]{height:8px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.energy-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out),background-color var(--duration-medium) var(--ease-out)}.emotion-bars[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-95ba671e]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-95ba671e]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-95ba671e]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.task-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-id[data-v-95ba671e]{font-family:monospace;font-size:var(--font-size-sm);color:var(--neutral-gray-50)}.task-status[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary)}.connection-info[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-sm);font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.link-btn[data-v-95ba671e]{border:none;background:none;color:var(--brand-primary);font-size:var(--font-size-xs);cursor:pointer;padding:0}.link-btn[data-v-95ba671e]:disabled{opacity:.5;cursor:default}.memory-stats[data-v-95ba671e]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);margin-bottom:var(--space-sm)}.memory-stat[data-v-95ba671e]{padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);text-align:center}.memory-stat-label[data-v-95ba671e]{display:block;font-size:var(--font-size-xs);color:var(--neutral-gray-30);margin-bottom:2px}.memory-stat-value[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-50)}.memory-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-xs)}.memory-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-sm);padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);font-size:var(--font-size-sm)}.memory-text[data-v-95ba671e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--neutral-gray-50)}.memory-strength[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary);font-weight:600}.connection-dot[data-v-95ba671e]{width:8px;height:8px;border-radius:50%;background:var(--error)}.connection-dot.connected[data-v-95ba671e]{background:var(--success)}.state-source[data-v-95ba671e]{margin-left:auto;font-size:var(--font-size-xs);font-weight:700;color:var(--brand-primary);letter-spacing:.5px}.agents-display[data-v-95ba671e]{padding:var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.agent-count[data-v-95ba671e]{display:flex;align-items:baseline;gap:var(--space-sm)}.agent-number[data-v-95ba671e]{font-size:var(--font-size-xl);font-weight:700;color:var(--neutral-gray-30)}.agent-number.online[data-v-95ba671e]{color:var(--success)}.agent-label[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.agent-offline[data-v-95ba671e]{margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.chat-page[data-v-d95e8000]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-d95e8000]{grid-template-columns:1fr}.stage-column[data-v-d95e8000]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-d95e8000]{flex:1;min-height:240px}.status-panel[data-v-d95e8000]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-d95e8000]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-d95e8000]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-d95e8000]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-d95e8000]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-d95e8000]:hover,.page-resizer[data-v-d95e8000]:active{background:var(--md-primary)}.chat-column[data-v-d95e8000]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-d95e8000]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-d95e8000]{display:flex;flex-direction:column}.stage-column[data-v-d95e8000]{flex:1;min-height:0}.page-resizer[data-v-d95e8000]{display:none}.chat-column[data-v-d95e8000]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);transition:transform var(--transition-normal)}.chat-column.open[data-v-d95e8000]{transform:translate(0)}}.plugins-page[data-v-27522700]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-27522700]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-27522700]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-27522700],.pp-hero h1[data-v-27522700]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-27522700]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-27522700]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-27522700]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.pp-stats[data-v-27522700]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-27522700]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-27522700]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-27522700]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-27522700]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-27522700]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-27522700]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-27522700]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-27522700]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-27522700 var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-27522700{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-27522700]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-27522700]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-27522700]{opacity:.62}.plugin-top[data-v-27522700]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-27522700]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-27522700]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-27522700]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-27522700]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-27522700]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-27522700]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-27522700]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-27522700]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-27522700]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-27522700]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-27522700]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-27522700]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-27522700]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-27522700]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-27522700]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-27522700]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-27522700]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-27522700]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-27522700]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-27522700]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-27522700]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-27522700]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-27522700]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-27522700]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-27522700]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-27522700]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-27522700]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-27522700]{white-space:nowrap}#app .plugins-page .btn[data-v-27522700]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-27522700]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-27522700]:disabled{opacity:.6;cursor:not-allowed}#app .plugins-page .btn-tonal[data-v-27522700]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .plugins-page .btn-danger[data-v-27522700]{background:var(--md-error-container);color:var(--md-on-error-container)}.empty-state[data-v-27522700]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-27522700]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-27522700]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-27522700]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-27522700]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-27522700]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-27522700]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-27522700],.pd-leave-to[data-v-27522700]{opacity:0}.pd-enter-active .pd-dialog[data-v-27522700]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-27522700]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-27522700],.pd-leave-to .pd-dialog[data-v-27522700]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-27522700]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-27522700]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-27522700]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-27522700]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-27522700]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-27522700]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-27522700]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-27522700]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-27522700]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-27522700]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-27522700]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-27522700]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-27522700]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-27522700]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-27522700]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-27522700]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-27522700]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-27522700]{color:var(--md-error)}.pd-foot[data-v-27522700]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-27522700]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn-tonal[data-v-27522700]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pd-foot .btn-danger[data-v-27522700]{background:var(--md-error-container);color:var(--md-on-error-container)}.pd-foot .btn[data-v-27522700]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-27522700],.pd-leave-active[data-v-27522700],.pd-enter-active .pd-dialog[data-v-27522700],.pd-leave-active .pd-dialog[data-v-27522700]{transition:none}.pd-enter-from .pd-dialog[data-v-27522700],.pd-leave-to .pd-dialog[data-v-27522700]{transform:none}}.life-settings[data-v-153238d0]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-153238d0]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-153238d0 .52s var(--ls-spring) both}.ls-hero-main[data-v-153238d0]{min-width:0}.ls-eyebrow[data-v-153238d0]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-153238d0]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-153238d0]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-153238d0]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-153238d0]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-153238d0]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-153238d0]{font-size:16px}.ls-grid[data-v-153238d0]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-153238d0]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-153238d0 .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-153238d0]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-153238d0]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-153238d0]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-153238d0]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-153238d0]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-153238d0]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-153238d0]{grid-column:1 / -1}.ls-card-head[data-v-153238d0]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-153238d0]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-153238d0]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-153238d0]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-153238d0]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-153238d0]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-153238d0]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-153238d0]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-153238d0]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-153238d0]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-153238d0]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-153238d0]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-153238d0]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-153238d0]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-153238d0]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-153238d0]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-153238d0]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-153238d0]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-153238d0]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-153238d0]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-153238d0]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-153238d0]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-153238d0]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-153238d0]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-153238d0]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-153238d0]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-153238d0]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-153238d0]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-153238d0]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-153238d0]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-153238d0]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-153238d0]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-153238d0]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-153238d0]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}.ls-model b[data-v-153238d0]{font-size:13px;word-break:break-all}.ls-model span[data-v-153238d0]{font-size:12px;color:var(--md-on-surface-variant)}.ls-state[data-v-153238d0]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-153238d0 .32s var(--ls-spring) both}@keyframes ls-rise-153238d0{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-153238d0{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-153238d0],.ls-row[data-v-153238d0],.ls-models[data-v-153238d0]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-153238d0],.ls-card[data-v-153238d0],.ls-state[data-v-153238d0]{animation:none}}.about[data-v-f0cbac94]{display:flex;flex-direction:column;gap:26px}.identity[data-v-f0cbac94]{display:flex;align-items:center;gap:16px}.app-icon[data-v-f0cbac94]{flex:none;width:56px;height:56px;border-radius:16px;background:var(--md-primary);color:var(--md-on-primary);display:grid;place-items:center;font-size:20px;font-weight:750;letter-spacing:-1px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 35%,transparent)}.app-id[data-v-f0cbac94]{flex:1;min-width:0}.app-id h2[data-v-f0cbac94]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-f0cbac94]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-f0cbac94]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-f0cbac94]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-f0cbac94]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-f0cbac94]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-f0cbac94]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.btn.sm[data-v-f0cbac94]{height:34px;padding-inline:16px;font-size:13px}.credits[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-f0cbac94]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-f0cbac94]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-f0cbac94]{font-size:16px;font-weight:650}.person-info .role[data-v-f0cbac94]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-f0cbac94]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-f0cbac94]{margin-top:6px}.contribs[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-f0cbac94]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-f0cbac94]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-f0cbac94]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-f0cbac94]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-f0cbac94]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-f0cbac94]{margin-left:auto}.status-chip[data-v-f0cbac94]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-f0cbac94]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-f0cbac94]:hover{text-decoration:underline}.muted[data-v-f0cbac94]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-f0cbac94]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-f0cbac94]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-f0cbac94]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-f0cbac94]{flex:1;min-width:0}.us-hero-text b[data-v-f0cbac94]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-f0cbac94]{font-size:13px;opacity:.85}.us-hero-text em[data-v-f0cbac94]{font-style:normal;font-weight:700}.us-hero-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-f0cbac94]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-f0cbac94]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-f0cbac94]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-f0cbac94]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-f0cbac94]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-f0cbac94]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-f0cbac94]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-f0cbac94]{font-weight:700}.us-apply-label[data-v-f0cbac94]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-f0cbac94]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-f0cbac94]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-f0cbac94]{animation:us-spin-f0cbac94 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-f0cbac94],.us-apply-banner.failed .us-spinner[data-v-f0cbac94]{display:none}.us-apply-log[data-v-f0cbac94],.us-apply-error[data-v-f0cbac94]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-f0cbac94{to{transform:rotate(360deg)}}.alert[data-v-f0cbac94]{color:var(--md-error)}.updates[data-v-6bbe694b]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-6bbe694b]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-6bbe694b]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-6bbe694b]{display:flex;align-items:center;gap:12px}.us-ico[data-v-6bbe694b]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-6bbe694b]{flex:1;min-width:0}.us-title[data-v-6bbe694b]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-6bbe694b]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-6bbe694b]{display:flex;align-items:center;gap:8px}.us-tag[data-v-6bbe694b]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-6bbe694b]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-6bbe694b]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-source[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-6bbe694b]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-6bbe694b]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-6bbe694b]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-6bbe694b]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-6bbe694b]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-6bbe694b]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-6bbe694b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-6bbe694b]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-6bbe694b]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-6bbe694b]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-6bbe694b]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-6bbe694b]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-6bbe694b]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-6bbe694b]{flex:1;min-width:0}.us-hero-text b[data-v-6bbe694b]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-6bbe694b]{font-size:13px;opacity:.85}.us-hero-text em[data-v-6bbe694b]{font-style:normal;font-weight:700}.us-hero-actions[data-v-6bbe694b]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-6bbe694b]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-6bbe694b]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-6bbe694b]{font-weight:700}.us-apply-label[data-v-6bbe694b]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-6bbe694b]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-6bbe694b]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-6bbe694b]{animation:us-spin-6bbe694b .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-6bbe694b],.us-apply-banner.failed .us-spinner[data-v-6bbe694b]{display:none}.us-apply-log[data-v-6bbe694b],.us-apply-error[data-v-6bbe694b]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-6bbe694b{to{transform:rotate(360deg)}}.us-table[data-v-6bbe694b]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-6bbe694b]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-6bbe694b]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-6bbe694b]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-6bbe694b]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-6bbe694b]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-6bbe694b]{background:var(--md-success)}.us-dot.warn[data-v-6bbe694b]{background:#e0a800}.us-dot.bad[data-v-6bbe694b]{background:var(--md-error)}.us-ver[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-6bbe694b]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-6bbe694b]{font-weight:650}.us-ver b.good[data-v-6bbe694b]{color:var(--md-success)}.us-arrow[data-v-6bbe694b]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-6bbe694b]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-6bbe694b]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-6bbe694b]:hover{text-decoration:underline}.us-empty[data-v-6bbe694b]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-6bbe694b]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-6bbe694b]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.btn.sm[data-v-6bbe694b]{height:34px;padding-inline:16px;font-size:13px}.btn.xs[data-v-6bbe694b]{height:30px;padding-inline:12px;font-size:12px}.alert[data-v-6bbe694b]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-6bbe694b]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-6bbe694b]{display:none}.us-hero[data-v-6bbe694b]{flex-wrap:wrap}.us-hero-actions[data-v-6bbe694b]{width:100%}}.provider-panel[data-v-828ee6e3]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-828ee6e3]{display:flex;align-items:center;gap:14px}.pp-back[data-v-828ee6e3]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-828ee6e3]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-828ee6e3]{flex:1;min-width:0}.pp-editor-title h2[data-v-828ee6e3]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-828ee6e3]{margin:3px 0 0}.pp-section[data-v-828ee6e3]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-828ee6e3]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-828ee6e3]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-828ee6e3]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-828ee6e3]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-828ee6e3]{margin-bottom:0}.pp-span[data-v-828ee6e3]{grid-column:1 / -1}.pp-req[data-v-828ee6e3]{color:var(--md-error);margin-left:2px}.pp-key[data-v-828ee6e3]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-828ee6e3]{flex:1}.pp-key-toggle[data-v-828ee6e3]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-828ee6e3]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-828ee6e3]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-828ee6e3]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-828ee6e3]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-828ee6e3]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-828ee6e3]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-828ee6e3]{animation:pp-pulse-828ee6e3 1s ease-in-out infinite}@keyframes pp-pulse-828ee6e3{50%{opacity:.15}}.pp-probe[data-v-828ee6e3]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-828ee6e3]{color:var(--md-success)}.pp-probe.err[data-v-828ee6e3]{color:var(--md-error)}.pp-discovered[data-v-828ee6e3]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-828ee6e3]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-828ee6e3]{flex:1;min-width:160px}.pp-mini[data-v-828ee6e3]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-828ee6e3]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-models[data-v-828ee6e3]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-828ee6e3]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-828ee6e3]:first-child{border-top:0}.pp-model.off[data-v-828ee6e3]{opacity:.5}.pp-model-name[data-v-828ee6e3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-828ee6e3]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-828ee6e3]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-828ee6e3]{color:#e0a800;cursor:default}.pp-switch[data-v-828ee6e3]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-828ee6e3]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-828ee6e3]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-828ee6e3]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-828ee6e3]{display:flex;gap:10px}.pp-list-head[data-v-828ee6e3]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-828ee6e3]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-828ee6e3]{margin:3px 0 0}.pp-list-actions[data-v-828ee6e3]{display:flex;gap:8px}.pp-cards[data-v-828ee6e3]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-828ee6e3]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-828ee6e3]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-828ee6e3]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-828ee6e3]{opacity:.62}.pp-card-head[data-v-828ee6e3]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-828ee6e3]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-828ee6e3]{width:26px;height:26px}.pp-card-id[data-v-828ee6e3]{flex:1;min-width:0}.pp-card-id strong[data-v-828ee6e3]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-828ee6e3]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-828ee6e3]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-828ee6e3]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-828ee6e3]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-828ee6e3]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-828ee6e3]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-828ee6e3]{color:var(--md-error)}.pp-chips[data-v-828ee6e3]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-828ee6e3]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-828ee6e3],.pp-chip.empty[data-v-828ee6e3]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-828ee6e3]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.btn.sm[data-v-828ee6e3]{height:32px;padding-inline:12px;font-size:12.5px}.btn.xs[data-v-828ee6e3]{height:28px;padding-inline:12px;font-size:12px}.pp-empty[data-v-828ee6e3]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-828ee6e3],.pp-cards[data-v-828ee6e3]{grid-template-columns:1fr}}.pairing-panel[data-v-0559b1b2]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-0559b1b2]{margin:12px 0;color:var(--md-on-surface-variant)}article[data-v-0559b1b2]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-0559b1b2]{font-size:24px;letter-spacing:4px}button[data-v-0559b1b2]{padding:8px 12px}.security-panel[data-v-b1d117f0]{max-width:920px}.sec-stack[data-v-b1d117f0]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-b1d117f0]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-b1d117f0]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-b1d117f0]{font-size:15px;font-weight:700}.sec-chip[data-v-b1d117f0]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-b1d117f0]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-b1d117f0]{margin:2px 0 12px}.sec-pin-grid[data-v-b1d117f0]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-b1d117f0]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-b1d117f0]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-b1d117f0]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-b1d117f0]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-b1d117f0]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-b1d117f0]:hover{background:var(--md-surface-container)}.page-item[data-v-b1d117f0]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-b1d117f0]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-b1d117f0]{width:44px;height:26px}.page-item .toggle-slider[data-v-b1d117f0]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-b1d117f0]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-b1d117f0]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-b1d117f0]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-b1d117f0]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-b1d117f0]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-b1d117f0]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-b1d117f0]{margin-top:12px}.sec-error[data-v-b1d117f0]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-b1d117f0]{grid-template-columns:1fr}}.mcp-panel[data-v-35a85711]{max-width:900px}.mcp-head[data-v-35a85711]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-35a85711]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-35a85711]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-35a85711]{display:flex;gap:10px}.error-banner[data-v-35a85711]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-35a85711]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-35a85711]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-35a85711]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-35a85711]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-35a85711]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-35a85711]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-35a85711]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-35a85711]{flex:1}.mcp-field>span[data-v-35a85711]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-35a85711],.mcp-field select[data-v-35a85711],.mcp-field textarea[data-v-35a85711]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-35a85711]{opacity:.7}.mcp-field textarea[data-v-35a85711]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-35a85711]:focus,.mcp-field select[data-v-35a85711]:focus,.mcp-field textarea[data-v-35a85711]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-35a85711]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-35a85711]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-35a85711]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-35a85711]{font-family:ui-monospace,monospace}.mail-grid[data-v-35a85711]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-35a85711]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-35a85711]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-35a85711]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-35a85711]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-35a85711]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-35a85711]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-35a85711]:disabled{opacity:.6;cursor:not-allowed}@media(max-width:720px){.mail-grid[data-v-35a85711]{grid-template-columns:1fr}}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.models-field[data-v-b73b6842]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-b73b6842]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-b73b6842]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-b73b6842]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-b73b6842]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-b73b6842]{display:inline-flex;gap:4px}.models-actions button[data-v-b73b6842]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-b73b6842]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-b73b6842]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-b73b6842]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.usage-page[data-v-a7476de1]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-a7476de1]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-a7476de1]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-a7476de1]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-a7476de1]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-a7476de1]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-a7476de1]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-a7476de1]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .usage-page .btn[data-v-a7476de1]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-a7476de1]:disabled{opacity:.55;cursor:not-allowed}#app .usage-page .btn-tonal[data-v-a7476de1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .usage-page .btn-danger[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.overview[data-v-a7476de1]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-a7476de1]{display:grid;place-items:center}.donut[data-v-a7476de1]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-a7476de1]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-a7476de1]{fill:none;stroke-width:5}.donut-track[data-v-a7476de1]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-a7476de1]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-a7476de1]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-a7476de1]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-a7476de1]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-a7476de1]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-a7476de1]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-a7476de1]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-a7476de1]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-a7476de1]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-a7476de1]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-a7476de1]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-a7476de1]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-a7476de1]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-a7476de1]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-a7476de1]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-a7476de1]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-a7476de1]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-a7476de1]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-a7476de1]{background:var(--md-primary)}.dot.completion[data-v-a7476de1]{background:var(--md-tertiary)}.mini-stack[data-v-a7476de1]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-a7476de1]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-a7476de1]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-a7476de1]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-a7476de1]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-a7476de1]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-a7476de1]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-a7476de1]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-a7476de1]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-a7476de1]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-a7476de1]{position:absolute;inset:0}.grid span[data-v-a7476de1]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-a7476de1]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-a7476de1]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-a7476de1]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-a7476de1]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-a7476de1]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-a7476de1]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-a7476de1]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-a7476de1]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-a7476de1]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-a7476de1]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-a7476de1]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-a7476de1]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-a7476de1]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-a7476de1]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-a7476de1]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-a7476de1]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-a7476de1]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-a7476de1]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-a7476de1]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-a7476de1]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-a7476de1]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}@keyframes up-a7476de1{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-a7476de1]{grid-template-columns:1fr 1fr}.mini-stack[data-v-a7476de1]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-a7476de1],.mini-stack[data-v-a7476de1]{grid-template-columns:1fr}.chart[data-v-a7476de1]{height:200px;padding-left:34px}.grid span i[data-v-a7476de1]{left:-34px;width:28px}.axis span[data-v-a7476de1]{font-size:11px}}\n";document.head.appendChild(s)}})();
