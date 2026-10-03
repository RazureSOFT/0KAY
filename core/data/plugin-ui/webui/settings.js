import { defineComponent as Q, reactive as Be, ref as x, onMounted as re, openBlock as n, createElementBlock as a, createElementVNode as e, createTextVNode as Z, toDisplayString as l, withDirectives as U, vModelCheckbox as oe, vModelText as D, Fragment as j, renderList as J, normalizeClass as B, createCommentVNode as f, computed as W, onUnmounted as Me, unref as s, withKeys as Je, createStaticVNode as We, createVNode as G, vModelDynamic as qe, vModelSelect as Ye, shallowRef as ze, watch as Ge, createBlock as se, resolveDynamicComponent as Qe, withModifiers as Le } from "vue";
import { useRouter as Fe, useRoute as Xe } from "vue-router";
import { useI18n as ae } from "vue-i18n";
import { apiGet as ce, apiPost as $e, ApiError as Ne, useConfirm as Ve, useProvidersStore as Ze, PROVIDERS as Te, AppSelect as ie, getLanguage as et, LOCALES as tt, setLanguage as st, useWizardStore as Ae, useSettingsMeta as Ee, useUIPatchesStore as Ke, PinInput as Ie, useSettingsSectionsStore as lt, DEFAULT_LIVE2D_MODELS as ot } from "@0kay/host";
import { L as nt } from "./assets/Live2DStage-w9T1h3vJ.js";
import { _ as ue } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
const at = { class: "life-settings" }, it = { class: "ls-hero" }, rt = ["disabled"], ut = { class: "ls-grid" }, dt = { class: "ls-card" }, ct = { class: "ls-switch" }, pt = { class: "ls-switch" }, vt = { class: "ls-field" }, _t = { class: "ls-card" }, ht = { class: "ls-note" }, mt = { class: "ls-models" }, bt = ["onClick"], gt = {
  key: 0,
  class: "ls-empty"
}, yt = { class: "ls-models" }, kt = ["onClick"], ft = {
  key: 0,
  class: "ls-empty"
}, $t = { class: "ls-card" }, wt = { class: "ls-row" }, Ct = { class: "ls-field" }, xt = { class: "ls-field" }, St = { class: "ls-row" }, Pt = { class: "ls-field" }, Tt = { class: "ls-field" }, Ut = { class: "ls-row" }, Mt = { class: "ls-field" }, Vt = { class: "ls-field" }, At = { class: "ls-row" }, Et = { class: "ls-field" }, Ot = { class: "ls-field" }, zt = { class: "ls-row" }, Lt = { class: "ls-field" }, It = { class: "ls-field" }, Dt = { class: "ls-field" }, jt = { class: "ls-switch" }, Ft = { class: "ls-switch" }, Nt = { class: "ls-mail-actions" }, Kt = ["disabled"], Rt = ["disabled"], Ht = { class: "ls-card" }, Bt = { class: "ls-switch" }, Jt = { class: "ls-card ls-card-wide" }, Wt = { class: "ls-row" }, qt = { class: "ls-switch" }, Yt = { class: "ls-switch" }, Gt = { class: "ls-row" }, Qt = { class: "ls-field" }, Xt = { class: "ls-field" }, Zt = { class: "ls-row" }, es = { class: "ls-field" }, ts = { class: "ls-field" }, ss = { class: "ls-row" }, ls = { class: "ls-field" }, os = { class: "ls-field" }, ns = {
  key: 0,
  class: "ls-state"
}, as = /* @__PURE__ */ Q({
  __name: "LifeSettingsPanel",
  setup(H) {
    const t = Be({
      screen_watch: !1,
      computer_use: !1,
      report_agent_host: "",
      mail_mailbox_path: "",
      mail_imap_host: "",
      mail_imap_port: 993,
      mail_imap_user: "",
      mail_imap_password: "",
      mail_smtp_host: "",
      mail_smtp_port: 465,
      mail_smtp_user: "",
      mail_smtp_password: "",
      mail_from: "",
      mail_from_name: "0KAY",
      mail_require_approval: !1,
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
    }), m = x(""), k = x(!1), g = x([]), b = x(""), d = x([]), $ = x(!1), w = x(""), z = x(null);
    function T() {
      return {
        mail_imap_host: t.mail_imap_host,
        mail_imap_port: t.mail_imap_port,
        mail_imap_user: t.mail_imap_user,
        mail_imap_password: t.mail_imap_password,
        mail_smtp_host: t.mail_smtp_host,
        mail_smtp_port: t.mail_smtp_port,
        mail_smtp_user: t.mail_smtp_user,
        mail_smtp_password: t.mail_smtp_password,
        mail_from: t.mail_from,
        mail_from_name: t.mail_from_name
      };
    }
    async function _(E = !1) {
      $.value = !0, w.value = "", z.value = null;
      try {
        const i = await fetch("/api/life/companion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "mail_test", payload: { to: E ? t.mail_from || t.mail_imap_user : "", config: T() } })
        }), p = await i.json().catch(() => ({}));
        if (!i.ok) throw new Error(p.error || `HTTP ${i.status}`);
        const h = p.imap || {}, M = p.smtp || {}, V = p.sent;
        z.value = !!h.ok && !!M.ok && (!V || V.ok);
        const I = [
          `收信 IMAP：${h.ok ? `✓ 登录成功${h.messages != null ? ` · 收件箱 ${h.messages} 封` : ""}` : `✗ ${h.error || "失败"}`}`,
          `发信 SMTP：${M.ok ? "✓ 登录成功" : `✗ ${M.error || "失败"}`}`
        ];
        V && I.push(`测试邮件：${V.ok ? `✓ 已发送至 ${V.to}` : `✗ ${V.error || "发送失败"}`}`), w.value = I.join("　·　");
      } catch (i) {
        z.value = !1, w.value = i?.message || "测试失败";
      } finally {
        $.value = !1;
      }
    }
    async function u() {
      try {
        const [E, i] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (E.ok && Object.assign(t, (await E.json()).values || {}), i.ok) {
          const p = await i.json();
          d.value = Array.isArray(p.models) ? p.models.map((h) => ({ id: h.id, provider: h.provider || "custom", supports_thinking: h.supports_thinking })).filter((h) => h.id) : [], g.value = d.value.map((h) => h.id), b.value = "mocr 当前模型目录（由 Core 同步）";
        }
      } catch {
        m.value = "无法读取 LIFE 设置或模型目录";
      }
    }
    async function S() {
      k.value = !0, m.value = "";
      try {
        const E = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: t }) });
        if (!E.ok) throw new Error(String(E.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: t.screen_watch, computer_use: t.computer_use, report_agent_host: t.report_agent_host }) }), m.value = "已保存，LIFE 会在下一次设置轮询时应用。";
      } catch {
        m.value = "保存失败";
      } finally {
        k.value = !1;
      }
    }
    return re(u), (E, i) => (n(), a("section", at, [
      e("header", it, [
        i[28] || (i[28] = e("div", { class: "ls-hero-main" }, [
          e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS"),
          e("h2", null, "L.I.F.E 专属设置"),
          e("p", { class: "ls-sub" }, "敏感功能默认关闭；凭据仅保存在本机 Core settings 文件。")
        ], -1)),
        e("button", {
          class: "ls-save",
          disabled: k.value,
          onClick: S
        }, [
          i[27] || (i[27] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          Z(l(k.value ? "保存中…" : "保存"), 1)
        ], 8, rt)
      ]),
      e("div", ut, [
        e("article", dt, [
          i[34] || (i[34] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-1" }, "◉"),
            e("h3", null, "Agent 主机权限")
          ], -1)),
          e("label", ct, [
            U(e("input", {
              "onUpdate:modelValue": i[0] || (i[0] = (p) => t.screen_watch = p),
              type: "checkbox"
            }, null, 512), [
              [oe, t.screen_watch]
            ]),
            i[29] || (i[29] = e("span", { class: "ls-track" }, null, -1)),
            i[30] || (i[30] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许屏幕观察"),
              e("small", null, "读取当前屏幕内容")
            ], -1))
          ]),
          e("label", pt, [
            U(e("input", {
              "onUpdate:modelValue": i[1] || (i[1] = (p) => t.computer_use = p),
              type: "checkbox"
            }, null, 512), [
              [oe, t.computer_use]
            ]),
            i[31] || (i[31] = e("span", { class: "ls-track" }, null, -1)),
            i[32] || (i[32] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许计算机操作"),
              e("small", null, "执行鼠标/键盘操作")
            ], -1))
          ]),
          e("label", vt, [
            i[33] || (i[33] = e("span", null, "指定 Agent 主机（可选）", -1)),
            U(e("input", {
              "onUpdate:modelValue": i[2] || (i[2] = (p) => t.report_agent_host = p),
              placeholder: "hostname 或地址"
            }, null, 512), [
              [D, t.report_agent_host]
            ])
          ])
        ]),
        e("article", _t, [
          i[35] || (i[35] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-2" }, "✦"),
            e("h3", null, "THINK / OUTPUT 模型")
          ], -1)),
          e("p", ht, l(b.value || "正在读取 mocr 模型目录…"), 1),
          i[36] || (i[36] = e("p", { class: "ls-label" }, "THINK · 内部思考、记忆与工具规划", -1)),
          e("div", mt, [
            (n(!0), a(j, null, J(d.value, (p) => (n(), a("button", {
              key: "think-" + p.id,
              type: "button",
              class: B(["ls-model", { selected: t.think_model === p.id }]),
              onClick: (h) => t.think_model = p.id
            }, [
              e("b", null, l(p.id), 1),
              e("span", null, l(p.provider) + " · " + l(p.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, bt))), 128)),
            d.value.length ? f("", !0) : (n(), a("span", gt, "暂无模型"))
          ]),
          i[37] || (i[37] = e("p", { class: "ls-label" }, "OUTPUT · 最终人格化回复", -1)),
          e("div", yt, [
            (n(!0), a(j, null, J(d.value, (p) => (n(), a("button", {
              key: "output-" + p.id,
              type: "button",
              class: B(["ls-model", { selected: t.output_model === p.id }]),
              onClick: (h) => t.output_model = p.id
            }, [
              e("b", null, l(p.id), 1),
              e("span", null, l(p.provider) + " · output", 1)
            ], 10, kt))), 128)),
            d.value.length ? f("", !0) : (n(), a("span", ft, "暂无模型"))
          ])
        ]),
        e("article", $t, [
          i[53] || (i[53] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-3" }, "✉"),
            e("h3", null, "邮件收发")
          ], -1)),
          i[54] || (i[54] = e("p", { class: "ls-note" }, [
            Z("收信走 IMAP，发信走 SMTP；密码仅保存在本机 Core settings 文件。可填 "),
            e("code", null, "mailbox.json"),
            Z(" 做离线收信。")
          ], -1)),
          i[55] || (i[55] = e("p", { class: "ls-label" }, "收信 · IMAP", -1)),
          e("div", wt, [
            e("label", Ct, [
              i[38] || (i[38] = e("span", null, "IMAP 主机", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[3] || (i[3] = (p) => t.mail_imap_host = p),
                placeholder: "imap.example.com"
              }, null, 512), [
                [D, t.mail_imap_host]
              ])
            ]),
            e("label", xt, [
              i[39] || (i[39] = e("span", null, "端口", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[4] || (i[4] = (p) => t.mail_imap_port = p),
                type: "number",
                placeholder: "993"
              }, null, 512), [
                [
                  D,
                  t.mail_imap_port,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("div", St, [
            e("label", Pt, [
              i[40] || (i[40] = e("span", null, "用户名", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[5] || (i[5] = (p) => t.mail_imap_user = p),
                placeholder: "user@example.com"
              }, null, 512), [
                [D, t.mail_imap_user]
              ])
            ]),
            e("label", Tt, [
              i[41] || (i[41] = e("span", null, "密码 / 应用专用密码", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[6] || (i[6] = (p) => t.mail_imap_password = p),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [D, t.mail_imap_password]
              ])
            ])
          ]),
          i[56] || (i[56] = e("p", { class: "ls-label" }, "发信 · SMTP", -1)),
          e("div", Ut, [
            e("label", Mt, [
              i[42] || (i[42] = e("span", null, "SMTP 主机", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[7] || (i[7] = (p) => t.mail_smtp_host = p),
                placeholder: "smtp.example.com"
              }, null, 512), [
                [D, t.mail_smtp_host]
              ])
            ]),
            e("label", Vt, [
              i[43] || (i[43] = e("span", null, "端口", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[8] || (i[8] = (p) => t.mail_smtp_port = p),
                type: "number",
                placeholder: "465"
              }, null, 512), [
                [
                  D,
                  t.mail_smtp_port,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("div", At, [
            e("label", Et, [
              i[44] || (i[44] = e("span", null, "用户名", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[9] || (i[9] = (p) => t.mail_smtp_user = p),
                placeholder: "user@example.com"
              }, null, 512), [
                [D, t.mail_smtp_user]
              ])
            ]),
            e("label", Ot, [
              i[45] || (i[45] = e("span", null, "密码 / 应用专用密码", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[10] || (i[10] = (p) => t.mail_smtp_password = p),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [D, t.mail_smtp_password]
              ])
            ])
          ]),
          e("div", zt, [
            e("label", Lt, [
              i[46] || (i[46] = e("span", null, "发件人地址（可选）", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[11] || (i[11] = (p) => t.mail_from = p),
                placeholder: "留空用 SMTP 用户名"
              }, null, 512), [
                [D, t.mail_from]
              ])
            ]),
            e("label", It, [
              i[47] || (i[47] = e("span", null, "发件人昵称（可选）", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[12] || (i[12] = (p) => t.mail_from_name = p),
                placeholder: "默认 0KAY"
              }, null, 512), [
                [D, t.mail_from_name]
              ])
            ])
          ]),
          e("label", Dt, [
            i[48] || (i[48] = e("span", null, "离线邮箱 JSON（可选）", -1)),
            U(e("input", {
              "onUpdate:modelValue": i[13] || (i[13] = (p) => t.mail_mailbox_path = p),
              placeholder: "mailbox.json"
            }, null, 512), [
              [D, t.mail_mailbox_path]
            ])
          ]),
          e("label", jt, [
            U(e("input", {
              "onUpdate:modelValue": i[14] || (i[14] = (p) => t.mail_auto_approve_all = p),
              type: "checkbox"
            }, null, 512), [
              [oe, t.mail_auto_approve_all]
            ]),
            i[49] || (i[49] = e("span", { class: "ls-track" }, null, -1)),
            i[50] || (i[50] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "全部自动审批"),
              e("small", null, "所有需确认的权限直接通过，不再弹窗询问")
            ], -1))
          ]),
          e("label", Ft, [
            U(e("input", {
              "onUpdate:modelValue": i[15] || (i[15] = (p) => t.mail_require_approval = p),
              type: "checkbox"
            }, null, 512), [
              [oe, t.mail_require_approval]
            ]),
            i[51] || (i[51] = e("span", { class: "ls-track" }, null, -1)),
            i[52] || (i[52] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "邮件操作需弹窗确认"),
              e("small", null, "读取 / 发送邮件前先在 WebUI 询问你")
            ], -1))
          ]),
          e("div", Nt, [
            e("button", {
              type: "button",
              class: "ls-test",
              disabled: $.value,
              onClick: i[16] || (i[16] = (p) => _(!1))
            }, l($.value ? "测试中…" : "测试连接"), 9, Kt),
            e("button", {
              type: "button",
              class: "ls-test",
              disabled: $.value,
              onClick: i[17] || (i[17] = (p) => _(!0))
            }, "发送测试邮件", 8, Rt)
          ]),
          w.value ? (n(), a("p", {
            key: 0,
            class: B(["ls-mail-result", z.value ? "ok" : "bad"])
          }, l(w.value), 3)) : f("", !0)
        ]),
        e("article", Ht, [
          i[59] || (i[59] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", Bt, [
            U(e("input", {
              "onUpdate:modelValue": i[18] || (i[18] = (p) => t.mcp_enabled = p),
              type: "checkbox"
            }, null, 512), [
              [oe, t.mcp_enabled]
            ]),
            i[57] || (i[57] = e("span", { class: "ls-track" }, null, -1)),
            i[58] || (i[58] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许调用 MCP 工具"),
              e("small", null, "服务清单在 Agent 设置中维护")
            ], -1))
          ])
        ]),
        e("article", Jt, [
          i[70] || (i[70] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-5" }, "☷"),
            e("h3", null, "OneBot v11 与主动行为")
          ], -1)),
          e("div", Wt, [
            e("label", qt, [
              U(e("input", {
                "onUpdate:modelValue": i[19] || (i[19] = (p) => t.onebot_enabled = p),
                type: "checkbox"
              }, null, 512), [
                [oe, t.onebot_enabled]
              ]),
              i[60] || (i[60] = e("span", { class: "ls-track" }, null, -1)),
              i[61] || (i[61] = e("span", { class: "ls-switch-text" }, [
                e("b", null, "启用 OneBot")
              ], -1))
            ]),
            e("label", Yt, [
              U(e("input", {
                "onUpdate:modelValue": i[20] || (i[20] = (p) => t.onebot_observe_group = p),
                type: "checkbox"
              }, null, 512), [
                [oe, t.onebot_observe_group]
              ]),
              i[62] || (i[62] = e("span", { class: "ls-track" }, null, -1)),
              i[63] || (i[63] = e("span", { class: "ls-switch-text" }, [
                e("b", null, "仅观察群聊"),
                e("small", null, "未触发时不回复")
              ], -1))
            ])
          ]),
          e("div", Gt, [
            e("label", Qt, [
              i[64] || (i[64] = e("span", null, "WebSocket 地址", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[21] || (i[21] = (p) => t.onebot_ws_url = p),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [D, t.onebot_ws_url]
              ])
            ]),
            e("label", Xt, [
              i[65] || (i[65] = e("span", null, "HTTP API 地址", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[22] || (i[22] = (p) => t.onebot_http_url = p),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [D, t.onebot_http_url]
              ])
            ])
          ]),
          e("div", Zt, [
            e("label", es, [
              i[66] || (i[66] = e("span", null, "Access Token", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[23] || (i[23] = (p) => t.onebot_access_token = p),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [D, t.onebot_access_token]
              ])
            ]),
            e("label", ts, [
              i[67] || (i[67] = e("span", null, "触发关键词（逗号分隔，留空=全部）", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[24] || (i[24] = (p) => t.onebot_trigger_keywords = p),
                placeholder: "bot,在吗"
              }, null, 512), [
                [D, t.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", ss, [
            e("label", ls, [
              i[68] || (i[68] = e("span", null, "每日主动上限", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[25] || (i[25] = (p) => t.proactive_daily_limit = p),
                type: "number",
                min: "0",
                placeholder: "3"
              }, null, 512), [
                [
                  D,
                  t.proactive_daily_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", os, [
              i[69] || (i[69] = e("span", null, "单目标上限", -1)),
              U(e("input", {
                "onUpdate:modelValue": i[26] || (i[26] = (p) => t.proactive_target_limit = p),
                type: "number",
                min: "0",
                placeholder: "1"
              }, null, 512), [
                [
                  D,
                  t.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ])
      ]),
      m.value ? (n(), a("p", ns, l(m.value), 1)) : f("", !0)
    ]));
  }
}), is = /* @__PURE__ */ ue(as, [["__scopeId", "data-v-537538f7"]]), rs = { class: "content-card about" }, us = { class: "identity" }, ds = { class: "app-id" }, cs = { class: "ver-badge" }, ps = { class: "app-desc" }, vs = { class: "identity-actions" }, _s = ["href"], hs = { class: "section" }, ms = { class: "section-head" }, bs = ["disabled"], gs = {
  key: 0,
  class: "alert",
  role: "alert"
}, ys = {
  class: "us-hero-icon",
  "aria-hidden": "true"
}, ks = {
  key: 0,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, fs = {
  key: 1,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, $s = {
  key: 2,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, ws = { class: "us-hero-text" }, Cs = { key: 0 }, xs = { key: 1 }, Ss = { class: "us-hero-actions" }, Ps = ["disabled"], Ts = ["disabled", "title"], Us = ["href"], Ms = {
  key: 2,
  class: "us-notes"
}, Vs = { class: "us-notes-title" }, As = { class: "us-notes-body" }, Es = {
  key: 3,
  class: "alert",
  role: "alert"
}, Os = { class: "us-apply-head" }, zs = { key: 0 }, Ls = { key: 1 }, Is = {
  key: 0,
  class: "us-chip-tag"
}, Ds = { class: "us-apply-label" }, js = {
  key: 0,
  class: "us-apply-error"
}, Fs = {
  key: 1,
  class: "us-apply-log"
}, Ns = { class: "section" }, Ks = { class: "section-title" }, Rs = { class: "credits" }, Hs = ["href"], Bs = ["src", "alt"], Js = { class: "person-info" }, Ws = { class: "name" }, qs = { class: "role" }, Ys = ["src"], Gs = { class: "person-info" }, Qs = { class: "role" }, Xs = { class: "section-head contributors-head" }, Zs = { class: "section-title" }, el = { class: "muted" }, tl = {
  key: 0,
  class: "contribs"
}, sl = ["href"], ll = ["src", "alt"], ol = { class: "login" }, nl = {
  key: 0,
  class: "count"
}, al = {
  key: 1,
  class: "muted"
}, il = ["href"], rl = { class: "foot" }, ul = ["href"], Ue = "https://github.com/RazureSOFT/0KAY", dl = "https://github.com/RazureSOFT", cl = /* @__PURE__ */ Q({
  __name: "AboutPanel",
  setup(H) {
    const { t } = ae(), m = x("0.1.2"), k = x([]), g = x(""), b = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, d = (F, A = 96) => `https://github.com/${F}.png?size=${A}`, $ = x(!1), w = x(null), z = x(""), T = x(null), _ = x("");
    let u = null;
    function S(F) {
      return T.value?.status === "running" && T.value.plugin === F;
    }
    async function E(F, A) {
      if (T.value?.status !== "running") {
        _.value = "";
        try {
          T.value = await $e("/api/plugins/pm/update", { plugin: F, version: A || "" }), p();
        } catch (K) {
          _.value = K instanceof Error ? K.message : String(K);
        }
      }
    }
    async function i() {
      try {
        T.value = await ce("/api/plugins/pm/status");
      } catch {
        return;
      }
      T.value && T.value.status !== "running" && (h(), I());
    }
    function p() {
      u || (u = setInterval(i, 2e3));
    }
    function h() {
      u && (clearInterval(u), u = null);
    }
    const M = W(() => {
      switch (T.value?.status) {
        case "running":
          return t("settings.about.updating");
        case "done":
          return t("settings.about.updated");
        case "failed":
          return t("settings.about.updateFailed");
        default:
          return "";
      }
    }), V = W(() => w.value ? w.value.has_update ? "warn" : w.value.latest ? "ok" : "none" : "none");
    async function I() {
      $.value = !0, z.value = "";
      try {
        const F = await ce("/api/plugins/pm/check");
        w.value = F, F?.current && (m.value = String(F.current));
      } catch (F) {
        z.value = F instanceof Ne && F.status === 404 ? t("settings.about.unsupported") : F instanceof Error ? F.message : String(F);
      } finally {
        $.value = !1;
      }
    }
    async function q() {
      try {
        const F = { Accept: "application/vnd.github+json" }, [A, K] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: F }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: F })
        ]);
        if (!A.ok) throw new Error(`HTTP ${A.status}`);
        const ee = /* @__PURE__ */ new Map(), N = await A.json();
        for (const O of Array.isArray(N) ? N : [])
          O?.login && ee.set(O.login, O);
        if (K.ok) {
          const O = await K.json();
          for (const L of Array.isArray(O) ? O : []) {
            const P = L?.author;
            !P?.login || P.login.endsWith("[bot]") || ee.has(P.login) || ee.set(P.login, {
              login: P.login,
              avatar_url: P.avatar_url,
              html_url: P.html_url,
              contributions: 0
            });
          }
        }
        k.value = [...ee.values()].sort(
          (O, L) => (L.contributions || 0) - (O.contributions || 0) || O.login.localeCompare(L.login)
        );
      } catch (F) {
        g.value = F instanceof Error ? F.message : String(F), k.value = [];
      }
    }
    return re(() => {
      I(), q(), ce("/api/plugins/pm/status").then((F) => {
        T.value = F, F?.status === "running" && p();
      }).catch(() => {
      });
    }), Me(h), (F, A) => (n(), a("div", rs, [
      e("header", us, [
        A[3] || (A[3] = e("div", {
          class: "app-icon",
          "aria-hidden": "true"
        }, "0K", -1)),
        e("div", ds, [
          e("h2", null, [
            A[2] || (A[2] = Z("0KAY ", -1)),
            e("span", cs, "v" + l(m.value), 1)
          ]),
          e("p", ps, l(s(t)("settings.about.description")), 1)
        ]),
        e("div", vs, [
          e("a", {
            class: "btn btn-tonal sm",
            href: Ue,
            target: "_blank",
            rel: "noopener noreferrer"
          }, l(s(t)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${Ue}/releases`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "Releases ↗", 8, _s)
        ])
      ]),
      e("section", hs, [
        e("div", ms, [
          A[4] || (A[4] = e("h3", { class: "section-title" }, "0KAY", -1)),
          e("button", {
            class: "btn btn-tonal sm",
            disabled: $.value,
            onClick: I
          }, l(s(t)($.value ? "settings.about.checking" : "settings.about.check")), 9, bs)
        ]),
        z.value ? (n(), a("p", gs, l(z.value), 1)) : (n(), a("div", {
          key: 1,
          class: B(["us-hero", V.value])
        }, [
          e("div", ys, [
            V.value === "ok" ? (n(), a("svg", ks, [...A[5] || (A[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : V.value === "warn" ? (n(), a("svg", fs, [...A[6] || (A[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (n(), a("svg", $s, [...A[7] || (A[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", ws, [
            e("b", null, l(s(t)(V.value === "warn" ? "settings.about.available" : V.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            w.value?.latest ? (n(), a("span", Cs, [
              Z("v" + l(w.value.current) + " → ", 1),
              e("em", null, "v" + l(w.value.latest), 1)
            ])) : (n(), a("span", xs, "0KAY v" + l(w.value?.current || m.value), 1))
          ]),
          e("div", Ss, [
            w.value?.has_update ? (n(), a("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: S("core"),
              onClick: A[0] || (A[0] = (K) => E("core", w.value.latest))
            }, l(S("core") ? s(t)("settings.about.updating") : s(t)("settings.about.updateNow")), 9, Ps)) : f("", !0),
            w.value?.source_available !== !1 ? (n(), a("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: S("core"),
              title: s(t)("settings.about.betaHint"),
              onClick: A[1] || (A[1] = (K) => E("core"))
            }, l(S("core") ? s(t)("settings.about.updating") : s(t)("settings.about.beta")), 9, Ts)) : f("", !0),
            w.value?.url ? (n(), a("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: w.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, Us)) : f("", !0)
          ])
        ], 2)),
        w.value?.notes ? (n(), a("div", Ms, [
          e("p", Vs, l(s(t)("settings.about.whatsNew")), 1),
          e("pre", As, l(w.value.notes), 1)
        ])) : f("", !0),
        _.value ? (n(), a("p", Es, l(_.value), 1)) : f("", !0),
        T.value && T.value.status !== "idle" ? (n(), a("div", {
          key: 4,
          class: B(["us-apply-banner", T.value.status])
        }, [
          e("div", Os, [
            A[8] || (A[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Z(l(T.value.package), 1),
              T.value.version ? (n(), a("span", zs, "@" + l(T.value.version), 1)) : (n(), a("span", Ls, " · main"))
            ]),
            T.value.mode === "source" ? (n(), a("span", Is, l(s(t)("settings.about.sourceMode")), 1)) : f("", !0),
            e("span", Ds, l(M.value), 1)
          ]),
          T.value.error ? (n(), a("p", js, l(T.value.error), 1)) : f("", !0),
          T.value.log ? (n(), a("pre", Fs, l(T.value.log), 1)) : f("", !0)
        ], 2)) : f("", !0)
      ]),
      e("section", Ns, [
        e("h3", Ks, l(s(t)("settings.about.developerTitle")) + " & " + l(s(t)("settings.about.teamTitle")), 1),
        e("div", Rs, [
          e("a", {
            class: "person",
            href: b.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: b.avatar,
              alt: b.login,
              loading: "lazy"
            }, null, 8, Bs),
            e("div", Js, [
              e("span", Ws, l(b.login), 1),
              e("span", qs, l(s(t)("settings.about.developerTitle")), 1)
            ]),
            A[9] || (A[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, Hs),
          e("a", {
            class: "person",
            href: dl,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: d("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, Ys),
            e("div", Gs, [
              A[10] || (A[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", Qs, l(s(t)("settings.about.teamTitle")), 1)
            ]),
            A[11] || (A[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", Xs, [
          e("h3", Zs, l(s(t)("settings.about.contributorsTitle")), 1),
          e("span", el, l(s(t)("settings.about.contributorsFrom")), 1)
        ]),
        k.value.length ? (n(), a("div", tl, [
          (n(!0), a(j, null, J(k.value, (K) => (n(), a("a", {
            key: K.login,
            class: "contrib",
            href: K.html_url || `https://github.com/${K.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: K.avatar_url || d(K.login, 64),
              alt: K.login,
              loading: "lazy"
            }, null, 8, ll),
            e("span", ol, l(K.login), 1),
            K.contributions ? (n(), a("span", nl, l(K.contributions), 1)) : f("", !0)
          ], 8, sl))), 128))
        ])) : (n(), a("p", al, [
          e("a", {
            class: "repo-link",
            href: b.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "razureink ↗", 8, il)
        ]))
      ]),
      e("footer", rl, [
        A[12] || (A[12] = e("span", { class: "status-chip" }, "MIT", -1)),
        A[13] || (A[13] = e("span", null, "© 2026 RazureSOFT", -1)),
        e("a", {
          class: "repo-link",
          href: `${Ue}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, ul)
      ])
    ]));
  }
}), pl = /* @__PURE__ */ ue(cl, [["__scopeId", "data-v-f0cbac94"]]), vl = { class: "content-card updates" }, _l = { class: "us-block" }, hl = { class: "us-head" }, ml = { class: "us-head-text" }, bl = { class: "us-title" }, gl = { class: "us-desc" }, yl = { class: "us-source" }, kl = { class: "us-input-group" }, fl = ["disabled", "placeholder"], $l = ["disabled"], wl = { class: "us-chips" }, Cl = ["disabled"], xl = ["disabled"], Sl = {
  key: 0,
  class: "us-saved"
}, Pl = { class: "helper-text" }, Tl = {
  key: 0,
  class: "alert"
}, Ul = { class: "us-block" }, Ml = { class: "us-head" }, Vl = { class: "us-head-text" }, Al = { class: "us-title" }, El = { class: "us-desc" }, Ol = { class: "us-head-actions" }, zl = ["disabled"], Ll = {
  key: 0,
  class: "alert",
  role: "alert"
}, Il = { class: "us-apply-head" }, Dl = { key: 0 }, jl = { key: 1 }, Fl = {
  key: 0,
  class: "us-chip-tag"
}, Nl = { class: "us-apply-label" }, Kl = {
  key: 0,
  class: "us-apply-error"
}, Rl = {
  key: 1,
  class: "us-apply-log"
}, Hl = {
  key: 2,
  class: "alert",
  role: "alert"
}, Bl = {
  key: 3,
  class: "us-table"
}, Jl = { class: "us-name" }, Wl = { class: "us-ver" }, ql = { class: "us-actions" }, Yl = ["disabled", "onClick"], Gl = ["disabled", "onClick"], Ql = ["href", "title"], Xl = {
  key: 0,
  class: "us-empty"
}, Zl = /* @__PURE__ */ Q({
  __name: "UpdatesPanel",
  setup(H) {
    const { t } = ae(), m = x(!1), k = x(null), g = x(""), b = x(null), d = x("");
    let $ = null;
    const w = x(""), z = x(""), T = x(!1), _ = x(!1), u = x(!1), S = x(""), E = W(() => w.value.trim() !== z.value), i = W(() => w.value.trim() !== "");
    function p(O) {
      return b.value?.status === "running" && b.value.plugin === O;
    }
    async function h(O, L) {
      if (b.value?.status !== "running") {
        d.value = "";
        try {
          b.value = await $e("/api/plugins/pm/update", { plugin: O, version: L || "" }), V();
        } catch (P) {
          d.value = P instanceof Error ? P.message : String(P);
        }
      }
    }
    async function M() {
      try {
        b.value = await ce("/api/plugins/pm/status");
      } catch {
        return;
      }
      b.value && b.value.status !== "running" && (I(), A());
    }
    function V() {
      $ || ($ = setInterval(M, 2e3));
    }
    function I() {
      $ && (clearInterval($), $ = null);
    }
    const q = W(() => {
      switch (b.value?.status) {
        case "running":
          return t("settings.about.updating");
        case "done":
          return t("settings.about.updated");
        case "failed":
          return t("settings.about.updateFailed");
        default:
          return "";
      }
    }), F = W(() => (k.value || []).filter((O) => O.has_update).length);
    async function A() {
      m.value = !0, g.value = "";
      try {
        const O = await ce("/api/plugins/pm/check-plugins");
        k.value = O.plugins || [];
      } catch (O) {
        g.value = O instanceof Ne && O.status === 404 ? t("settings.about.unsupported") : O instanceof Error ? O.message : String(O);
      } finally {
        m.value = !1;
      }
    }
    async function K() {
      T.value = !0, S.value = "";
      try {
        const O = await ce("/api/settings/updates"), L = String(O?.values?.github_proxy ?? "");
        w.value = L, z.value = L;
      } catch {
      } finally {
        T.value = !1;
      }
    }
    async function ee() {
      _.value = !0, S.value = "";
      try {
        const O = w.value.trim();
        await $e("/api/settings/updates", { values: { github_proxy: O } }), z.value = O, u.value = !0, setTimeout(() => {
          u.value = !1;
        }, 1500);
      } catch (O) {
        S.value = O instanceof Error ? O.message : String(O);
      } finally {
        _.value = !1;
      }
    }
    function N(O) {
      w.value = O, ee();
    }
    return re(() => {
      A(), K(), ce("/api/plugins/pm/status").then((O) => {
        b.value = O, O?.status === "running" && V();
      }).catch(() => {
      });
    }), Me(I), (O, L) => (n(), a("div", vl, [
      e("section", _l, [
        e("header", hl, [
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
          e("div", ml, [
            e("h3", bl, l(s(t)("settings.pluginSourceTitle")), 1),
            e("p", gl, l(s(t)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: B(["us-tag", { on: i.value }])
          }, l(i.value ? "ghproxy" : s(t)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", yl, [
          e("div", kl, [
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
            U(e("input", {
              "onUpdate:modelValue": L[0] || (L[0] = (P) => w.value = P),
              class: "us-input",
              type: "text",
              disabled: T.value,
              placeholder: s(t)("settings.pluginSourcePlaceholder"),
              onKeyup: Je(ee, ["enter"])
            }, null, 40, fl), [
              [D, w.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: _.value || !E.value,
              onClick: ee
            }, l(s(t)("settings.save")), 9, $l)
          ]),
          e("div", wl, [
            e("button", {
              type: "button",
              class: B(["us-chip", { active: !i.value }]),
              disabled: _.value,
              onClick: L[1] || (L[1] = (P) => N(""))
            }, l(s(t)("settings.pluginSourceDirect")), 11, Cl),
            e("button", {
              type: "button",
              class: B(["us-chip", { active: w.value.trim() === "https://gh-proxy.com" }]),
              disabled: _.value,
              onClick: L[2] || (L[2] = (P) => N("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, xl),
            u.value ? (n(), a("span", Sl, l(s(t)("settings.saved")), 1)) : f("", !0)
          ]),
          e("p", Pl, l(s(t)("settings.pluginSourceHelp")), 1),
          S.value ? (n(), a("p", Tl, l(S.value), 1)) : f("", !0)
        ])
      ]),
      L[10] || (L[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", Ul, [
        e("header", Ml, [
          L[5] || (L[5] = We('<span class="us-ico" aria-hidden="true" data-v-6bbe694b><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-6bbe694b><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect></svg></span>', 1)),
          e("div", Vl, [
            e("h3", Al, l(s(t)("settings.about.plugins")), 1),
            e("p", El, l(s(t)("settings.about.updateHint")), 1)
          ]),
          e("div", Ol, [
            e("span", {
              class: B(["us-count", { warn: F.value > 0 }])
            }, l(F.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: m.value,
              onClick: A
            }, l(s(t)(m.value ? "settings.about.checking" : "settings.about.check")), 9, zl)
          ])
        ]),
        d.value ? (n(), a("p", Ll, l(d.value), 1)) : f("", !0),
        b.value && b.value.status !== "idle" ? (n(), a("div", {
          key: 1,
          class: B(["us-apply-banner", b.value.status])
        }, [
          e("div", Il, [
            L[6] || (L[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Z(l(b.value.package), 1),
              b.value.version ? (n(), a("span", Dl, "@" + l(b.value.version), 1)) : (n(), a("span", jl, " · main"))
            ]),
            b.value.mode === "source" ? (n(), a("span", Fl, l(s(t)("settings.about.sourceMode")), 1)) : f("", !0),
            e("span", Nl, l(q.value), 1)
          ]),
          b.value.error ? (n(), a("p", Kl, l(b.value.error), 1)) : f("", !0),
          b.value.log ? (n(), a("pre", Rl, l(b.value.log), 1)) : f("", !0)
        ], 2)) : f("", !0),
        g.value ? (n(), a("p", Hl, l(g.value), 1)) : f("", !0),
        k.value ? (n(), a("div", Bl, [
          L[8] || (L[8] = e("div", { class: "us-row us-thead" }, [
            e("span", null, "Plugin"),
            e("span", null, "Version"),
            e("span", null, "Status"),
            e("span")
          ], -1)),
          (n(!0), a(j, null, J(k.value, (P) => (n(), a("div", {
            key: P.name,
            class: "us-row"
          }, [
            e("span", Jl, [
              e("span", {
                class: B(["us-dot", P.error ? "bad" : P.has_update ? "warn" : P.latest ? "ok" : ""])
              }, null, 2),
              Z(" " + l(P.name), 1)
            ]),
            e("span", Wl, [
              e("em", null, "v" + l(P.version || "—"), 1),
              L[7] || (L[7] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: B({ good: !!P.latest })
              }, l(P.latest ? `v${P.latest}` : "—"), 3)
            ]),
            e("span", {
              class: B(["us-status", P.error ? "bad" : P.has_update ? "warn" : P.latest ? "ok" : ""])
            }, l(P.error || s(t)(P.has_update ? "settings.about.available" : P.latest ? "settings.about.latest" : "settings.about.noRelease")), 3),
            e("span", ql, [
              P.can_update && P.has_update ? (n(), a("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: p(P.name),
                onClick: (le) => h(P.name, P.latest)
              }, l(p(P.name) ? s(t)("settings.about.updating") : s(t)("settings.about.updateNow")), 9, Yl)) : P.can_update ? (n(), a("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: p(P.name),
                onClick: (le) => h(P.name)
              }, l(p(P.name) ? s(t)("settings.about.updating") : s(t)("settings.about.syncNow")), 9, Gl)) : f("", !0),
              P.repository ? (n(), a("a", {
                key: 2,
                class: "us-repo",
                href: P.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: P.repository
              }, "Repo ↗", 8, Ql)) : f("", !0)
            ])
          ]))), 128)),
          k.value.length ? f("", !0) : (n(), a("p", Xl, l(s(t)("settings.about.noPlugins")), 1))
        ])) : f("", !0),
        L[9] || (L[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), eo = /* @__PURE__ */ ue(Zl, [["__scopeId", "data-v-6bbe694b"]]), to = { class: "content-card provider-panel" }, so = { class: "pp-editor-head" }, lo = ["aria-label"], oo = { class: "pp-editor-title" }, no = { class: "card-desc" }, ao = { class: "pp-section" }, io = { class: "pp-section-title" }, ro = { class: "pp-grid" }, uo = { class: "field" }, co = { class: "field" }, po = {
  key: 0,
  class: "pp-req"
}, vo = ["placeholder"], _o = { class: "field pp-span" }, ho = ["placeholder"], mo = { class: "field" }, bo = { class: "helper-text" }, go = { class: "field" }, yo = { class: "helper-text" }, ko = { class: "pp-section" }, fo = { class: "pp-section-head" }, $o = { class: "pp-section-title" }, wo = ["disabled"], Co = { class: "field" }, xo = { class: "pp-key" }, So = ["type", "placeholder"], Po = {
  key: 0,
  class: "helper-text"
}, To = {
  key: 1,
  class: "pp-probe err"
}, Uo = {
  key: 2,
  class: "pp-probe ok"
}, Mo = { class: "pp-section" }, Vo = { class: "pp-section-head" }, Ao = { class: "pp-section-title" }, Eo = { class: "pp-count" }, Oo = ["disabled"], zo = {
  key: 0,
  class: "pp-discovered"
}, Lo = { class: "pp-model-tools" }, Io = ["placeholder"], Do = {
  key: 1,
  class: "pp-models"
}, jo = ["title"], Fo = ["value", "onChange"], No = ["value"], Ko = ["title", "disabled", "onClick"], Ro = ["title"], Ho = ["checked", "onChange"], Bo = {
  key: 0,
  class: "helper-text"
}, Jo = {
  key: 2,
  class: "helper-text"
}, Wo = {
  key: 0,
  class: "pp-error",
  role: "alert"
}, qo = { class: "pp-editor-actions" }, Yo = ["disabled"], Go = { class: "pp-list-head" }, Qo = { class: "card-desc" }, Xo = { class: "pp-list-actions" }, Zo = {
  key: 0,
  class: "pp-cards"
}, en = { class: "pp-card-head" }, tn = { class: "pp-logo" }, sn = ["src", "alt"], ln = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, on = { class: "pp-card-id" }, nn = ["title"], an = { class: "pp-card-badges" }, rn = {
  key: 0,
  class: "pp-badge primary"
}, un = { class: "pp-badge" }, dn = { class: "pp-card-status" }, cn = {
  key: 0,
  class: "pp-meta"
}, pn = ["title"], vn = { class: "pp-chips" }, _n = {
  key: 0,
  class: "pp-chip more"
}, hn = {
  key: 1,
  class: "pp-chip empty"
}, mn = { class: "pp-card-actions" }, bn = ["onClick"], gn = ["disabled", "onClick"], yn = ["disabled", "onClick"], kn = ["onClick"], fn = ["onClick"], $n = {
  key: 1,
  class: "pp-empty"
}, wn = /* @__PURE__ */ Q({
  __name: "ProviderPanel",
  setup(H) {
    const { t } = ae(), { confirm: m } = Ve(), k = Ze(), g = x({}), b = x("list"), d = x(null), $ = x(""), w = x({ state: "idle" }), z = x([]), T = x(""), _ = x(!1), u = x(!1), S = x(!1);
    re(async () => {
      await k.fetchAll();
      for (const c of k.providers) K(c);
    });
    function E(c) {
      return Te.find((y) => y.id === c) || null;
    }
    function i(c) {
      return c.name && c.name.trim() ? c.name.trim() : E(c.provider)?.name || c.provider;
    }
    function p(c) {
      return E(c.provider)?.logo || "";
    }
    const h = [
      { value: "chat", label: "Chat 对话" },
      { value: "embedding", label: "Embedding 向量" },
      { value: "rerank", label: "Rerank 重排" },
      { value: "vision", label: "Vision 视觉" },
      { value: "tts", label: "TTS 语音" },
      { value: "image", label: "Image 图像" },
      { value: "audio", label: "Audio 音频" }
    ];
    function M(c) {
      return (d.value?.model_types || {})[c] || "chat";
    }
    function V(c, y) {
      if (!d.value) return;
      const r = { ...d.value.model_types || {} };
      !y || y === "chat" ? delete r[c] : r[c] = y, d.value.model_types = r;
    }
    function I(c) {
      const y = new Set(c.disabled_models || []);
      return c.models.filter((r) => !y.has(r));
    }
    function q(c) {
      return k.defaultProviderId === c.id;
    }
    function F(c) {
      const y = d.value;
      if (!y) return;
      const r = Te.find((v) => v.id === c);
      r?.baseUrl && !y.base_url && (y.base_url = r.baseUrl), y.format = r?.format || "";
    }
    async function A(c, y = "") {
      if (!c.base_url) return { state: "error", message: t("settings.baseUrlRequired") };
      const r = performance.now();
      try {
        const v = await fetch("/api/models/fetch", {
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
        if (!v.ok) throw new Error(`HTTP ${v.status}`);
        const o = await v.json(), C = Math.round(performance.now() - r);
        return o.source === "api" && Array.isArray(o.models) && o.models.length ? { state: "ok", count: o.models.length, ms: C, models: o.models } : { state: "error", message: o.error || t("settings.connectionFailed"), ms: C };
      } catch (v) {
        return { state: "error", message: v instanceof Error ? v.message : String(v) };
      }
    }
    async function K(c, y = "") {
      g.value = { ...g.value, [c.id]: { state: "checking" } };
      const r = await A(c, y);
      g.value = { ...g.value, [c.id]: r };
    }
    function ee() {
      for (const c of k.providers) K(c);
    }
    function N() {
      d.value = {
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
      }, $.value = "", w.value = { state: "idle" }, z.value = [], T.value = "", _.value = !1, u.value = !1, b.value = "edit";
    }
    function O(c) {
      d.value = {
        ...c,
        api_key: "",
        name: c.name || "",
        models: [...c.models],
        disabled_models: [...c.disabled_models || []],
        format: c.format || "",
        model_types: { ...c.model_types || {} }
      }, u.value = !!c.api_key_masked, $.value = "", w.value = { state: "idle" }, z.value = [], T.value = "", _.value = !1, b.value = "edit";
    }
    function L() {
      b.value = "list", d.value = null, $.value = "";
    }
    async function P() {
      const c = d.value;
      if (!c) return;
      $.value = "";
      const y = (c.name || "").trim();
      if (!c.base_url.trim()) {
        $.value = t("settings.baseUrlRequired");
        return;
      }
      if (c.provider === "custom" && !y) {
        $.value = t("settings.providerNameRequired");
        return;
      }
      if (!c.models.length) {
        $.value = t("settings.modelsRequired");
        return;
      }
      c.id || (c.id = `${c.provider}_${Date.now().toString(36)}`), c.name = y, c.disabled_models = (c.disabled_models || []).filter((r) => c.models.includes(r)), (!c.default_model || !c.models.includes(c.default_model) || c.disabled_models.includes(c.default_model)) && (c.default_model = I(c)[0] || c.models[0]), S.value = !0;
      try {
        await k.upsert({ ...c }), k.defaultProviderId || await k.setDefaults(c.id, c.default_model), L(), K(k.providers.find((r) => r.id === c.id) || c);
      } catch (r) {
        $.value = r instanceof Error ? r.message : String(r);
      } finally {
        S.value = !1;
      }
    }
    async function le(c) {
      if (await m({
        title: t("settings.remove"),
        message: `${t("settings.remove")} ${i(c)}?`,
        confirmLabel: t("settings.remove"),
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
    async function Y(c) {
      const y = c.default_model || I(c)[0] || c.models[0] || "";
      try {
        await k.setDefaults(c.id, y);
      } catch {
      }
    }
    async function _e() {
      const c = d.value;
      if (!c) return;
      w.value = { state: "checking" };
      const y = await A(c, c.api_key);
      w.value = y, y.state === "ok" && y.models && (z.value = y.models);
    }
    function me() {
      const c = d.value;
      !c || !z.value.length || (c.models = [...z.value], c.disabled_models = (c.disabled_models || []).filter((y) => c.models.includes(y)), c.models.includes(c.default_model) || (c.default_model = ""));
    }
    function ye(c) {
      const y = d.value;
      if (!y) return;
      const r = new Set(y.disabled_models || []);
      r.has(c) ? r.delete(c) : r.add(c), y.disabled_models = [...r], r.has(y.default_model) && (y.default_model = I(y)[0] || "");
    }
    function Ce(c) {
      const y = d.value;
      y && (y.default_model = c, y.disabled_models = (y.disabled_models || []).filter((r) => r !== c));
    }
    function ke(c) {
      const y = d.value;
      y && (y.disabled_models = c ? [] : [...y.models]);
    }
    function fe() {
      const c = d.value;
      if (!c) return;
      const y = new Set(c.disabled_models || []);
      c.disabled_models = c.models.filter((r) => !y.has(r));
    }
    const be = W(() => {
      const c = d.value?.models || [], y = T.value.trim().toLowerCase();
      return y ? c.filter((r) => r.toLowerCase().includes(y)) : c;
    }), xe = W(() => d.value ? I(d.value).length : 0);
    function de() {
      return t("settings.fetchedSummary", { n: z.value.length });
    }
    const Se = W(() => [
      { value: "", label: t("settings.formatAuto") },
      { value: "openai", label: t("settings.formatOpenai") },
      { value: "anthropic", label: t("settings.formatAnthropic") }
    ]), Pe = W(
      () => Te.map((c) => ({ value: c.id, label: t(`providers.${c.id}.name`, c.name) }))
    );
    return (c, y) => (n(), a("div", to, [
      b.value === "edit" && d.value ? (n(), a(j, { key: 0 }, [
        e("div", so, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: L,
            "aria-label": s(t)("settings.back")
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
          ])], 8, lo),
          e("div", oo, [
            e("h2", null, l(d.value.id ? s(t)("settings.edit") : s(t)("settings.addProvider")), 1),
            e("p", no, l(s(t)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: B(["pp-status", w.value.state])
          }, [
            y[12] || (y[12] = e("span", { class: "pp-dot" }, null, -1)),
            Z(" " + l(w.value.state === "checking" ? s(t)("settings.testing") : w.value.state === "ok" ? s(t)("settings.connectionOk") : w.value.state === "error" ? s(t)("settings.connectionFailed") : s(t)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", ao, [
          e("h3", io, l(s(t)("settings.providerSectionBasic")), 1),
          e("div", ro, [
            e("div", uo, [
              e("label", null, l(s(t)("wizard.provider")), 1),
              G(s(ie), {
                modelValue: d.value.provider,
                "onUpdate:modelValue": y[0] || (y[0] = (r) => d.value.provider = r),
                class: "input",
                "aria-label": s(t)("wizard.provider"),
                options: Pe.value,
                onChange: F
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", co, [
              e("label", null, [
                Z(l(s(t)("settings.providerName")) + " ", 1),
                d.value.provider === "custom" ? (n(), a("span", po, "*")) : f("", !0)
              ]),
              U(e("input", {
                "onUpdate:modelValue": y[1] || (y[1] = (r) => d.value.name = r),
                placeholder: s(t)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, vo), [
                [D, d.value.name]
              ])
            ]),
            e("div", _o, [
              e("label", null, l(s(t)("wizard.baseUrl")), 1),
              U(e("input", {
                "onUpdate:modelValue": y[2] || (y[2] = (r) => d.value.base_url = r),
                placeholder: s(t)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, ho), [
                [D, d.value.base_url]
              ])
            ]),
            e("div", mo, [
              e("label", null, l(s(t)("settings.apiFormat")), 1),
              G(s(ie), {
                modelValue: d.value.format,
                "onUpdate:modelValue": y[3] || (y[3] = (r) => d.value.format = r),
                class: "input",
                "aria-label": s(t)("settings.apiFormat"),
                options: Se.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", bo, l(s(t)("settings.apiFormatHint")), 1)
            ]),
            e("div", go, [
              e("label", null, l(s(t)("wizard.defaultModel")), 1),
              G(s(ie), {
                modelValue: d.value.default_model,
                "onUpdate:modelValue": y[4] || (y[4] = (r) => d.value.default_model = r),
                class: "input",
                "aria-label": s(t)("wizard.defaultModel"),
                options: I(d.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", yo, l(s(t)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", ko, [
          e("div", fo, [
            e("h3", $o, l(s(t)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: w.value.state === "checking",
              onClick: _e
            }, l(w.value.state === "checking" ? s(t)("settings.testing") : s(t)("settings.testConnection")), 9, wo)
          ]),
          e("div", Co, [
            e("label", null, l(s(t)("wizard.apiKey")), 1),
            e("div", xo, [
              U(e("input", {
                "onUpdate:modelValue": y[5] || (y[5] = (r) => d.value.api_key = r),
                type: _.value ? "text" : "password",
                placeholder: u.value ? s(t)("settings.apiKeyKept") : s(t)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, So), [
                [qe, d.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: y[6] || (y[6] = (r) => _.value = !_.value)
              }, l(_.value ? s(t)("settings.hideKey") : s(t)("settings.showKey")), 1)
            ]),
            u.value ? (n(), a("p", Po, l(s(t)("settings.apiKeyKeptHint")), 1)) : f("", !0),
            w.value.state === "error" ? (n(), a("p", To, l(w.value.message), 1)) : w.value.state === "ok" ? (n(), a("p", Uo, l(s(t)("settings.connectionOk")) + " · " + l(de()) + " · " + l(w.value.ms) + "ms ", 1)) : f("", !0)
          ])
        ]),
        e("section", Mo, [
          e("div", Vo, [
            e("h3", Ao, [
              Z(l(s(t)("settings.providerSectionModels")) + " ", 1),
              e("span", Eo, l(xe.value) + "/" + l(d.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: w.value.state === "checking",
              onClick: _e
            }, l(s(t)("settings.fetchModels")), 9, Oo)
          ]),
          z.value.length && z.value.join("\0") !== d.value.models.join("\0") ? (n(), a("div", zo, [
            e("span", null, l(de()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: me
            }, l(s(t)("settings.applyFetched")), 1)
          ])) : f("", !0),
          e("div", Lo, [
            U(e("input", {
              "onUpdate:modelValue": y[7] || (y[7] = (r) => T.value = r),
              class: "input pp-search",
              placeholder: s(t)("settings.searchModels")
            }, null, 8, Io), [
              [D, T.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: y[8] || (y[8] = (r) => ke(!0))
            }, l(s(t)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: y[9] || (y[9] = (r) => fe())
            }, l(s(t)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: y[10] || (y[10] = (r) => ke(!1))
            }, l(s(t)("settings.clearSelection")), 1)
          ]),
          d.value.models.length ? (n(), a("div", Do, [
            (n(!0), a(j, null, J(be.value, (r) => (n(), a("div", {
              key: r,
              class: B(["pp-model", { off: (d.value.disabled_models || []).includes(r) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: r
              }, l(r), 9, jo),
              e("select", {
                class: B(["pp-type", { tagged: M(r) !== "chat" }]),
                value: M(r),
                title: "模型类型",
                onChange: (v) => V(r, v.target.value)
              }, [
                (n(), a(j, null, J(h, (v) => e("option", {
                  key: v.value,
                  value: v.value
                }, l(v.label), 9, No)), 64))
              ], 42, Fo),
              d.value.default_model !== r ? (n(), a("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: s(t)("settings.makeDefault"),
                disabled: (d.value.disabled_models || []).includes(r),
                onClick: (v) => Ce(r)
              }, "☆", 8, Ko)) : (n(), a("span", {
                key: 1,
                class: "pp-star on",
                title: s(t)("wizard.defaultModel")
              }, "★", 8, Ro)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(d.value.disabled_models || []).includes(r),
                onChange: (v) => ye(r)
              }, null, 40, Ho)
            ], 2))), 128)),
            be.value.length ? f("", !0) : (n(), a("p", Bo, l(s(t)("settings.searchModels")), 1))
          ])) : (n(), a("p", Jo, l(s(t)("settings.noModelsYet")), 1))
        ]),
        $.value ? (n(), a("p", Wo, l($.value), 1)) : f("", !0),
        e("div", qo, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: S.value,
            onClick: P
          }, l(S.value ? s(t)("settings.saving") : s(t)("settings.save")), 9, Yo),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: L
          }, l(s(t)("settings.cancel")), 1)
        ])
      ], 64)) : (n(), a(j, { key: 1 }, [
        e("div", Go, [
          e("div", null, [
            e("h2", null, l(s(t)("settings.tabs.provider")), 1),
            e("p", Qo, l(s(t)("settings.providerDesc")), 1)
          ]),
          e("div", Xo, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: ee
            }, l(s(t)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: N
            }, "+ " + l(s(t)("settings.addProvider")), 1)
          ])
        ]),
        s(k).providers.length ? (n(), a("div", Zo, [
          (n(!0), a(j, null, J(s(k).providers, (r) => (n(), a("article", {
            key: r.id,
            class: B(["pp-card", { off: !r.enabled, default: q(r) }])
          }, [
            e("header", en, [
              e("span", tn, [
                p(r) ? (n(), a("img", {
                  key: 0,
                  src: p(r),
                  alt: i(r)
                }, null, 8, sn)) : (n(), a("svg", ln, [...y[13] || (y[13] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", on, [
                e("strong", null, l(i(r)), 1),
                e("code", {
                  title: r.base_url
                }, l(r.base_url || "—"), 9, nn)
              ]),
              e("div", an, [
                q(r) ? (n(), a("span", rn, l(s(t)("settings.default")), 1)) : f("", !0),
                e("span", un, l(I(r).length) + "/" + l(r.models.length), 1)
              ])
            ]),
            e("div", dn, [
              e("span", {
                class: B(["pp-status", g.value[r.id]?.state || "idle"])
              }, [
                y[14] || (y[14] = e("span", { class: "pp-dot" }, null, -1)),
                Z(" " + l(g.value[r.id]?.state === "checking" ? s(t)("settings.testing") : g.value[r.id]?.state === "ok" ? s(t)("settings.connectionOk") : g.value[r.id]?.state === "error" ? s(t)("settings.connectionFailed") : s(t)("settings.statusIdle")), 1)
              ], 2),
              g.value[r.id]?.state === "ok" ? (n(), a("span", cn, l(s(t)("settings.fetchedSummary", { n: g.value[r.id]?.count || 0 })) + " · " + l(g.value[r.id]?.ms) + "ms", 1)) : g.value[r.id]?.state === "error" ? (n(), a("span", {
                key: 1,
                class: "pp-meta err",
                title: g.value[r.id]?.message
              }, l(g.value[r.id]?.message), 9, pn)) : f("", !0)
            ]),
            e("div", vn, [
              (n(!0), a(j, null, J(I(r).slice(0, 6), (v) => (n(), a("span", {
                key: v,
                class: "pp-chip"
              }, l(v), 1))), 128)),
              I(r).length > 6 ? (n(), a("span", _n, "+" + l(I(r).length - 6), 1)) : f("", !0),
              r.models.length ? f("", !0) : (n(), a("span", hn, l(s(t)("settings.noModelsYet")), 1))
            ]),
            e("footer", mn, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (v) => O(r)
              }, l(s(t)("settings.edit")), 9, bn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: g.value[r.id]?.state === "checking",
                onClick: (v) => K(r)
              }, l(s(t)("settings.testConnection")), 9, gn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: q(r),
                onClick: (v) => Y(r)
              }, l(s(t)("settings.makeDefault")), 9, yn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (v) => ve(r)
              }, l(r.enabled ? s(t)("settings.disableProvider") : s(t)("settings.enableProvider")), 9, kn),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (v) => le(r)
              }, l(s(t)("settings.remove")), 9, fn)
            ])
          ], 2))), 128))
        ])) : (n(), a("div", $n, [
          e("p", null, l(s(t)("settings.noProviders")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: N
          }, "+ " + l(s(t)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), Cn = /* @__PURE__ */ ue(wn, [["__scopeId", "data-v-828ee6e3"]]), xn = { class: "pairing-panel" }, Sn = { key: 0 }, Pn = { key: 1 }, Tn = { key: 0 }, Un = ["onClick"], Mn = ["onClick"], Vn = /* @__PURE__ */ Q({
  __name: "PairingPanel",
  setup(H) {
    const t = x([]), m = x("");
    let k;
    async function g() {
      try {
        const d = await fetch("/api/pairing/pending");
        if (!d.ok) throw new Error(await d.text());
        t.value = (await d.json()).requests || [];
      } catch (d) {
        m.value = d.message;
      }
    }
    async function b(d, $) {
      try {
        const w = await fetch("/api/pairing/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, allow: $ }) });
        if (!w.ok) throw new Error(await w.text());
        await g();
      } catch (w) {
        m.value = w.message;
      }
    }
    return re(() => {
      g(), k = setInterval(g, 3e3);
    }), Me(() => clearInterval(k)), (d, $) => (n(), a("section", xn, [
      $[0] || ($[0] = e("h3", null, "设备配对", -1)),
      $[1] || ($[1] = e("p", null, "在 Core 所在电脑核对安装终端显示的 6 位代码，再允许连接。局域网发现需启用 CORE_LAN_ENABLED=1。", -1)),
      m.value ? (n(), a("p", Sn, l(m.value), 1)) : f("", !0),
      t.value.length ? f("", !0) : (n(), a("p", Pn, "暂无待配对设备")),
      (n(!0), a(j, null, J(t.value, (w) => (n(), a("article", {
        key: w.id
      }, [
        e("strong", null, l(w.name), 1),
        e("code", null, l(w.code), 1),
        w.approved ? (n(), a("span", Tn, "已允许，等待客户端领取")) : (n(), a(j, { key: 1 }, [
          e("button", {
            onClick: (z) => b(w, !1)
          }, "拒绝", 8, Un),
          e("button", {
            onClick: (z) => b(w, !0)
          }, "核对代码并允许配对", 8, Mn)
        ], 64))
      ]))), 128))
    ]));
  }
}), An = /* @__PURE__ */ ue(Vn, [["__scopeId", "data-v-0559b1b2"]]), En = { class: "content-card" }, On = { class: "card-desc" }, zn = { class: "field" }, Ln = { class: "segmented" }, In = ["onClick"], Dn = /* @__PURE__ */ Q({
  __name: "GeneralPanel",
  setup(H) {
    const { t } = ae(), m = x(et());
    function k(g) {
      m.value = g, st(g);
    }
    return (g, b) => (n(), a("div", En, [
      G(An),
      e("h2", null, l(s(t)("settings.tabs.general")), 1),
      e("p", On, l(s(t)("settings.generalDesc")), 1),
      e("div", zn, [
        e("label", null, l(s(t)("settings.language")), 1),
        e("div", Ln, [
          (n(!0), a(j, null, J(s(tt), (d) => (n(), a("button", {
            key: d.code,
            class: B(["seg", { active: m.value === d.code }]),
            onClick: ($) => k(d.code)
          }, l(d.label), 11, In))), 128))
        ])
      ])
    ]));
  }
}), jn = { class: "content-card" }, Fn = { class: "card-desc" }, Nn = { class: "field-row" }, Kn = { class: "field" }, Rn = ["placeholder"], Hn = { class: "field" }, Bn = ["placeholder"], Jn = { class: "field" }, Wn = { class: "field" }, qn = ["placeholder"], Yn = { class: "field" }, Gn = ["placeholder"], Qn = { class: "field" }, Xn = ["placeholder"], Zn = { class: "field" }, ea = ["placeholder"], ta = { class: "helper-text" }, sa = /* @__PURE__ */ Q({
  __name: "PersonaPanel",
  setup(H) {
    const { t } = ae(), m = Ae(), { tabLabel: k, tabMeta: g } = Ee();
    return (b, d) => (n(), a("div", jn, [
      e("h2", null, l(s(k)("persona")), 1),
      e("p", Fn, l(s(g)("persona")?.descriptionKey ? s(t)(s(g)("persona").descriptionKey) : s(t)("settings.personaDesc")), 1),
      e("div", Nn, [
        e("div", Kn, [
          e("label", null, l(s(t)("wizard.name")), 1),
          U(e("input", {
            "onUpdate:modelValue": d[0] || (d[0] = ($) => s(m).persona.name = $),
            placeholder: s(t)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, Rn), [
            [D, s(m).persona.name]
          ])
        ]),
        e("div", Hn, [
          e("label", null, l(s(t)("wizard.avatarUrl")), 1),
          U(e("input", {
            "onUpdate:modelValue": d[1] || (d[1] = ($) => s(m).persona.avatar = $),
            placeholder: s(t)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, Bn), [
            [D, s(m).persona.avatar]
          ])
        ]),
        e("div", Jn, [
          d[7] || (d[7] = e("label", null, "出生日期", -1)),
          U(e("input", {
            "onUpdate:modelValue": d[2] || (d[2] = ($) => s(m).persona.birthDate = $),
            type: "date",
            class: "input"
          }, null, 512), [
            [D, s(m).persona.birthDate]
          ])
        ])
      ]),
      e("div", Wn, [
        e("label", null, l(s(t)("wizard.description")), 1),
        U(e("textarea", {
          "onUpdate:modelValue": d[3] || (d[3] = ($) => s(m).persona.description = $),
          placeholder: s(t)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, qn), [
          [D, s(m).persona.description]
        ])
      ]),
      e("div", Yn, [
        e("label", null, l(s(t)("wizard.personality")), 1),
        U(e("textarea", {
          "onUpdate:modelValue": d[4] || (d[4] = ($) => s(m).persona.personality = $),
          placeholder: s(t)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Gn), [
          [D, s(m).persona.personality]
        ])
      ]),
      e("div", Qn, [
        e("label", null, l(s(t)("wizard.greeting")), 1),
        U(e("textarea", {
          "onUpdate:modelValue": d[5] || (d[5] = ($) => s(m).persona.greeting = $),
          placeholder: s(t)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, Xn), [
          [D, s(m).persona.greeting]
        ])
      ]),
      e("div", Zn, [
        e("label", null, l(s(t)("wizard.customPrompt")), 1),
        U(e("textarea", {
          "onUpdate:modelValue": d[6] || (d[6] = ($) => s(m).persona.customPrompt = $),
          placeholder: s(t)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, ea), [
          [D, s(m).persona.customPrompt]
        ]),
        e("p", ta, l(s(t)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), la = { class: "content-card" }, oa = { class: "card-desc" }, na = { class: "toggle-label" }, aa = { class: "helper-text" }, ia = { class: "toggle-label" }, ra = { class: "helper-text" }, ua = { class: "field" }, da = ["placeholder"], ca = { class: "helper-text" }, pa = {
  key: 0,
  class: "helper-text"
}, va = { class: "actions-row" }, _a = /* @__PURE__ */ Q({
  __name: "PermissionsPanel",
  setup(H) {
    const { t } = ae(), { tabLabel: m, tabMeta: k, fieldLabel: g, fieldHelp: b } = Ee(), d = x({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), $ = x("");
    async function w() {
      try {
        const T = await fetch("/api/life/permissions");
        if (T.ok) {
          const _ = await T.json();
          d.value = {
            screen_watch: !!_.screen_watch,
            computer_use: !!_.computer_use,
            report_agent_host: _.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function z() {
      $.value = "";
      try {
        const T = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(d.value)
        });
        if (!T.ok) throw new Error(String(T.status));
        const _ = await T.json();
        d.value = {
          screen_watch: !!_.screen_watch,
          computer_use: !!_.computer_use,
          report_agent_host: _.report_agent_host || ""
        }, $.value = t("settings.permSaved");
      } catch {
        $.value = t("settings.permFailed");
      }
    }
    return re(w), (T, _) => (n(), a("div", la, [
      e("h2", null, l(s(m)("permissions")), 1),
      e("p", oa, l(s(k)("permissions")?.descriptionKey ? s(t)(s(k)("permissions").descriptionKey) : s(t)("settings.permissionsDesc")), 1),
      e("label", na, [
        U(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": _[0] || (_[0] = (u) => d.value.screen_watch = u),
          onChange: z
        }, null, 544), [
          [oe, d.value.screen_watch]
        ]),
        _[4] || (_[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(s(g)(s(k)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          _[3] || (_[3] = e("br", null, null, -1)),
          e("small", aa, l(s(b)(s(k)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", ia, [
        U(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": _[1] || (_[1] = (u) => d.value.computer_use = u),
          onChange: z
        }, null, 544), [
          [oe, d.value.computer_use]
        ]),
        _[6] || (_[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(s(g)(s(k)("permissions"), "computer_use", "settings.computerUse")), 1),
          _[5] || (_[5] = e("br", null, null, -1)),
          e("small", ra, l(s(b)(s(k)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", ua, [
        e("label", null, l(s(g)(s(k)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        U(e("input", {
          "onUpdate:modelValue": _[2] || (_[2] = (u) => d.value.report_agent_host = u),
          class: "input",
          placeholder: s(b)(s(k)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: z
        }, null, 40, da), [
          [D, d.value.report_agent_host]
        ]),
        e("p", ca, l(s(b)(s(k)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      $.value ? (n(), a("div", pa, l($.value), 1)) : f("", !0),
      e("div", va, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: z
        }, l(s(t)("settings.save")), 1)
      ])
    ]));
  }
}), ha = x(!1), ma = x(!1);
x(!1);
const pe = x(!1), he = x(!0), Oe = x(!0), ge = x([]), Re = x(!1);
x(!1);
const we = x(!1), De = [];
function ba(H) {
  const t = De.splice(0, De.length);
  for (const m of t)
    m.resolve();
}
async function ga() {
  const H = window.fetch;
  try {
    const t = await H("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!t.ok) return;
    const m = await t.json();
    pe.value = !!m.configured, he.value = m.enabled !== !1, Oe.value = m.login_enabled !== !1, ge.value = Array.isArray(m.pages) ? m.pages : [], we.value = !m.configured && he.value;
  } catch {
  }
}
async function ya(H) {
  const t = window.fetch, m = await t("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(H)
  }), k = await m.json().catch(() => null);
  if (!m.ok) throw new Error(k?.error || `HTTP ${m.status}`);
  typeof k?.enabled == "boolean" && (he.value = k.enabled), typeof k?.login_enabled == "boolean" && (Oe.value = k.login_enabled), Array.isArray(k?.pages) && (ge.value = k.pages), pe.value = !!k?.configured, we.value = !k?.configured && he.value;
}
async function ka() {
  const H = window.fetch, t = await H("/api/security/pin", { method: "DELETE" }), m = await t.json().catch(() => null);
  if (!t.ok) throw new Error(m?.error || `HTTP ${t.status}`);
  Re.value = !1, pe.value = !1, we.value = he.value;
}
async function fa(H) {
  const t = window.fetch, m = await t("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: H })
  }), k = await m.json().catch(() => null);
  if (!m.ok || !k?.configured) throw new Error(k?.error || `HTTP ${m.status}`);
  H.trim(), Re.value = !0, pe.value = !0, we.value = !1, ma.value = !0, ha.value = !1, ba();
}
const $a = { class: "content-card security-panel" }, wa = { class: "card-desc" }, Ca = { class: "sec-stack" }, xa = { class: "toggle-label" }, Sa = ["checked", "disabled"], Pa = { class: "helper-text" }, Ta = { class: "toggle-label" }, Ua = ["checked", "disabled"], Ma = { class: "helper-text" }, Va = { class: "sec-card" }, Aa = { class: "sec-card-head" }, Ea = { class: "sec-pin-grid" }, Oa = { class: "sec-pin-col" }, za = { class: "sec-pin-label" }, La = { class: "sec-pin-col" }, Ia = { class: "sec-pin-label" }, Da = { class: "sec-actions" }, ja = ["disabled"], Fa = ["disabled"], Na = { class: "sec-card" }, Ka = { class: "sec-card-head" }, Ra = { class: "sec-chip" }, Ha = { class: "helper-text" }, Ba = { class: "page-list" }, Ja = ["checked", "disabled", "onChange"], Wa = { class: "page-text" }, qa = { class: "page-name" }, Ya = {
  key: 0,
  class: "helper-text sec-msg"
}, Ga = {
  key: 1,
  class: "sec-error"
}, Qa = /* @__PURE__ */ Q({
  __name: "SecurityPanel",
  setup(H) {
    const { t, locale: m } = ae(), { confirm: k } = Ve(), g = Ke(), b = x(!1), d = x(""), $ = x(""), w = x(""), z = x(""), T = W(() => {
      const p = [], h = /* @__PURE__ */ new Set(), M = (V, I) => {
        !V || h.has(V) || (h.add(V), p.push({ path: V, label: I || V }));
      };
      for (const V of g.navItems) {
        const I = V.to || (V.id === "chat" ? "/" : "");
        if (!I) continue;
        let q = V.labelKey ? t(V.labelKey) : "";
        (!q || q === V.labelKey) && (q = V.label || V.id), M(I, q);
      }
      for (const V of g.routerPatches) {
        let I = V.titleKey ? t(V.titleKey) : "";
        (!I || I === V.titleKey) && (I = V.title || String(V.name || V.path)), M(V.path, I);
      }
      return p;
    });
    re(() => {
      ga();
    });
    async function _(p) {
      b.value = !0, d.value = "", $.value = "";
      try {
        await ya(p), d.value = t("settings.saved"), setTimeout(() => {
          d.value = "";
        }, 1500);
      } catch (h) {
        $.value = h?.message || t("settings.permFailed");
      } finally {
        b.value = !1;
      }
    }
    function u(p, h) {
      _({ [p]: h });
    }
    function S(p, h) {
      const M = new Set(ge.value);
      h ? M.add(p) : M.delete(p), _({ pages: [...M] });
    }
    async function E() {
      if ($.value = "", w.value.length !== 6) {
        $.value = t("wizard.pinTooShort");
        return;
      }
      if (w.value !== z.value) {
        $.value = t("wizard.pinMismatch");
        return;
      }
      b.value = !0;
      try {
        await fa(w.value), w.value = "", z.value = "", d.value = t("settings.saved"), setTimeout(() => {
          d.value = "";
        }, 1500);
      } catch (p) {
        $.value = p?.message || t("settings.permFailed");
      } finally {
        b.value = !1;
      }
    }
    async function i() {
      if (await k({
        title: t("security.removePin"),
        message: t("security.removePinConfirm"),
        confirmLabel: m.value === "en" ? "Delete" : "删除",
        danger: !0
      })) {
        b.value = !0, $.value = "";
        try {
          await ka(), d.value = t("settings.saved"), setTimeout(() => {
            d.value = "";
          }, 1500);
        } catch (h) {
          $.value = h?.message || t("settings.permFailed");
        } finally {
          b.value = !1;
        }
      }
    }
    return (p, h) => (n(), a("div", $a, [
      e("h2", null, l(s(t)("settings.tabs.security")), 1),
      e("p", wa, l(s(t)("security.desc")), 1),
      e("div", Ca, [
        e("label", xa, [
          e("input", {
            type: "checkbox",
            checked: s(he),
            disabled: b.value,
            onChange: h[0] || (h[0] = (M) => u("enabled", M.target.checked))
          }, null, 40, Sa),
          h[4] || (h[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(s(t)("security.pinSwitch")), 1),
            e("small", Pa, l(s(t)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", Ta, [
          e("input", {
            type: "checkbox",
            checked: s(Oe),
            disabled: b.value,
            onChange: h[1] || (h[1] = (M) => u("login_enabled", M.target.checked))
          }, null, 40, Ua),
          h[5] || (h[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(s(t)("security.loginSwitch")), 1),
            e("small", Ma, l(s(t)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", Va, [
          e("div", Aa, [
            e("strong", null, l(s(pe) ? s(t)("security.changePin") : s(t)("auth.setupTitle")), 1),
            e("span", {
              class: B(["sec-chip", { on: s(pe) }])
            }, l(s(pe) ? s(t)("security.pinSet") : s(t)("security.pinUnset")), 3)
          ]),
          e("div", Ea, [
            e("div", Oa, [
              e("span", za, l(s(t)("auth.pinNew")), 1),
              G(s(Ie), {
                modelValue: w.value,
                "onUpdate:modelValue": h[2] || (h[2] = (M) => w.value = M)
              }, null, 8, ["modelValue"])
            ]),
            e("div", La, [
              e("span", Ia, l(s(t)("auth.pinConfirm")), 1),
              G(s(Ie), {
                modelValue: z.value,
                "onUpdate:modelValue": h[3] || (h[3] = (M) => z.value = M),
                onComplete: E
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", Da, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: b.value,
              onClick: E
            }, l(s(t)("auth.savePin")), 9, ja),
            s(pe) ? (n(), a("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: b.value,
              onClick: i
            }, l(s(t)("security.removePin")), 9, Fa)) : f("", !0)
          ])
        ]),
        e("section", Na, [
          e("div", Ka, [
            e("strong", null, l(s(t)("security.pages")), 1),
            e("span", Ra, l(s(t)("security.pageCount", { n: s(ge).length })), 1)
          ]),
          e("p", Ha, l(s(t)("security.pagesHelp")), 1),
          e("div", Ba, [
            (n(!0), a(j, null, J(T.value, (M) => (n(), a("label", {
              key: M.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: s(ge).includes(M.path),
                disabled: b.value,
                onChange: (V) => S(M.path, V.target.checked)
              }, null, 40, Ja),
              h[6] || (h[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", Wa, [
                e("span", qa, l(M.label), 1),
                e("code", null, l(M.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      d.value ? (n(), a("p", Ya, l(d.value), 1)) : f("", !0),
      $.value ? (n(), a("p", Ga, l($.value), 1)) : f("", !0)
    ]));
  }
}), Xa = /* @__PURE__ */ ue(Qa, [["__scopeId", "data-v-b1d117f0"]]), Za = { class: "mcp-panel" }, ei = { class: "mcp-head" }, ti = { class: "mcp-actions" }, si = ["disabled"], li = {
  key: 0,
  class: "error-banner"
}, oi = {
  key: 1,
  class: "notice-banner"
}, ni = {
  key: 2,
  class: "hint"
}, ai = {
  key: 3,
  class: "mcp-list"
}, ii = { class: "mcp-row" }, ri = { class: "mcp-field grow" }, ui = ["onUpdate:modelValue"], di = { class: "mcp-field" }, ci = ["onUpdate:modelValue"], pi = { class: "mcp-toggle" }, vi = ["onUpdate:modelValue"], _i = ["onClick"], hi = { class: "mcp-field" }, mi = ["onUpdate:modelValue"], bi = { class: "mcp-field" }, gi = ["onUpdate:modelValue"], yi = { class: "mcp-field" }, ki = ["onUpdate:modelValue"], fi = { class: "mcp-field" }, $i = ["onUpdate:modelValue"], wi = {
  key: 0,
  class: "hint"
}, Ci = /* @__PURE__ */ Q({
  __name: "McpPanel",
  setup(H) {
    const t = x([]), m = x(!1), k = x(!1), g = x(""), b = x(!1);
    function d() {
      return { id: "", transport: "stdio", command: "", argsText: "", url: "", headersText: "", enabled: !0 };
    }
    function $(_) {
      return {
        id: String(_?.id || ""),
        transport: _?.transport === "http" ? "http" : "stdio",
        command: String(_?.command || ""),
        argsText: Array.isArray(_?.args) ? _.args.join(`
`) : "",
        url: String(_?.url || ""),
        headersText: _?.headers && typeof _.headers == "object" ? JSON.stringify(_.headers, null, 2) : "",
        enabled: _?.enabled !== !1
      };
    }
    function w(_) {
      const u = { id: _.id.trim(), transport: _.transport, enabled: _.enabled };
      if (_.transport === "http") {
        if (_.url.trim() && (u.url = _.url.trim()), _.headersText.trim())
          try {
            u.headers = JSON.parse(_.headersText);
          } catch {
            throw new Error(`服务「${_.id || "(未命名)"}」的 Headers 不是合法 JSON`);
          }
      } else {
        _.command.trim() && (u.command = _.command.trim());
        const S = _.argsText.split(`
`).map((E) => E.trim()).filter(Boolean);
        S.length && (u.args = S);
      }
      return u;
    }
    async function z() {
      m.value = !0, g.value = "";
      try {
        const u = (await ce("/api/settings/mcp"))?.values?.servers;
        let S = [];
        if (typeof u == "string" && u.trim())
          try {
            const E = JSON.parse(u);
            Array.isArray(E) && (S = E);
          } catch {
            g.value = "已保存的 MCP 配置不是合法 JSON，已忽略。";
          }
        t.value = S.map($);
      } catch (_) {
        g.value = _?.message || String(_);
      } finally {
        m.value = !1;
      }
    }
    async function T() {
      if (!k.value) {
        k.value = !0, g.value = "", b.value = !1;
        try {
          const _ = t.value.map(w).filter((u) => String(u.id || "").trim());
          await $e("/api/settings/mcp", { values: { servers: JSON.stringify(_) } }), b.value = !0, setTimeout(() => {
            b.value = !1;
          }, 2e3);
        } catch (_) {
          g.value = _?.message || String(_);
        } finally {
          k.value = !1;
        }
      }
    }
    return re(z), (_, u) => (n(), a("div", Za, [
      e("header", ei, [
        u[1] || (u[1] = e("div", null, [
          e("h2", null, "MCP 服务"),
          e("p", { class: "subtitle" }, "配置外部 MCP（模型上下文协议）服务。保存后 Agent 与 L.I.F.E 共用同一份配置。")
        ], -1)),
        e("div", ti, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: u[0] || (u[0] = (S) => t.value.push(d()))
          }, "添加服务"),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: k.value,
            onClick: T
          }, l(k.value ? "保存中…" : "保存"), 9, si)
        ])
      ]),
      g.value ? (n(), a("div", li, l(g.value), 1)) : f("", !0),
      b.value ? (n(), a("div", oi, "已保存")) : f("", !0),
      m.value ? (n(), a("p", ni, "加载中…")) : (n(), a("div", ai, [
        (n(!0), a(j, null, J(t.value, (S, E) => (n(), a("article", {
          key: E,
          class: "mcp-card"
        }, [
          e("div", ii, [
            e("label", ri, [
              u[2] || (u[2] = e("span", null, "ID", -1)),
              U(e("input", {
                "onUpdate:modelValue": (i) => S.id = i,
                placeholder: "filesystem"
              }, null, 8, ui), [
                [D, S.id]
              ])
            ]),
            e("label", di, [
              u[4] || (u[4] = e("span", null, "传输", -1)),
              U(e("select", {
                "onUpdate:modelValue": (i) => S.transport = i
              }, [...u[3] || (u[3] = [
                e("option", { value: "stdio" }, "stdio", -1),
                e("option", { value: "http" }, "http", -1)
              ])], 8, ci), [
                [Ye, S.transport]
              ])
            ]),
            e("label", pi, [
              U(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (i) => S.enabled = i
              }, null, 8, vi), [
                [oe, S.enabled]
              ]),
              u[5] || (u[5] = e("span", null, "启用", -1))
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (i) => t.value.splice(E, 1)
            }, "删除", 8, _i)
          ]),
          S.transport === "stdio" ? (n(), a(j, { key: 0 }, [
            e("label", hi, [
              u[6] || (u[6] = e("span", null, "命令", -1)),
              U(e("input", {
                "onUpdate:modelValue": (i) => S.command = i,
                placeholder: "npx"
              }, null, 8, mi), [
                [D, S.command]
              ])
            ]),
            e("label", bi, [
              u[7] || (u[7] = e("span", null, "参数（每行一个）", -1)),
              U(e("textarea", {
                "onUpdate:modelValue": (i) => S.argsText = i,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, gi), [
                [D, S.argsText]
              ])
            ])
          ], 64)) : (n(), a(j, { key: 1 }, [
            e("label", yi, [
              u[8] || (u[8] = e("span", null, "URL", -1)),
              U(e("input", {
                "onUpdate:modelValue": (i) => S.url = i,
                placeholder: "https://example.com/mcp"
              }, null, 8, ki), [
                [D, S.url]
              ])
            ]),
            e("label", fi, [
              u[9] || (u[9] = e("span", null, "Headers（JSON）", -1)),
              U(e("textarea", {
                "onUpdate:modelValue": (i) => S.headersText = i,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, $i), [
                [D, S.headersText]
              ])
            ])
          ], 64))
        ]))), 128)),
        t.value.length ? f("", !0) : (n(), a("p", wi, "还没有 MCP 服务，点击「添加服务」。"))
      ]))
    ]));
  }
}), xi = /* @__PURE__ */ ue(Ci, [["__scopeId", "data-v-3b21cb32"]]), Si = { class: "content-card danger" }, Pi = { class: "card-desc" }, Ti = { class: "danger-box" }, Ui = /* @__PURE__ */ Q({
  __name: "DangerPanel",
  setup(H) {
    const { t } = ae(), m = Ae(), k = Fe();
    function g() {
      m.resetWizard(), k.push("/");
    }
    return (b, d) => (n(), a("div", Si, [
      e("h2", null, l(s(t)("settings.tabs.danger")), 1),
      e("p", Pi, l(s(t)("settings.resetDesc")), 1),
      e("div", Ti, [
        e("div", null, [
          e("strong", null, l(s(t)("settings.reset")), 1),
          e("p", null, l(s(t)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          onClick: g
        }, l(s(t)("settings.reset")), 1)
      ])
    ]));
  }
}), Mi = {
  key: 1,
  class: "plugin-pane-message"
}, Vi = {
  key: 2,
  class: "plugin-pane-message"
}, Ai = /* @__PURE__ */ Q({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(H) {
    const t = H, m = ze(null), k = ze("");
    return Ge(
      () => t.module,
      async (g) => {
        if (!g) {
          m.value = null, k.value = "";
          return;
        }
        try {
          const b = await import(
            /* @vite-ignore */
            g
          );
          m.value = b?.default || b, k.value = "";
        } catch (b) {
          m.value = null, k.value = b?.message || String(b);
        }
      },
      { immediate: !0 }
    ), (g, b) => m.value ? (n(), se(Qe(m.value), { key: 0 })) : k.value ? (n(), a("div", Mi, l(k.value), 1)) : (n(), a("div", Vi, "Loading plugin module…"));
  }
}), Ei = /* @__PURE__ */ ue(Ai, [["__scopeId", "data-v-2d1f36bc"]]), Oi = { class: "models-field" }, zi = {
  key: 0,
  class: "models-list"
}, Li = { class: "models-rank" }, Ii = ["title"], Di = { class: "models-actions" }, ji = ["disabled", "aria-label", "onClick"], Fi = ["disabled", "aria-label", "onClick"], Ni = ["aria-label", "onClick"], Ki = {
  key: 1,
  class: "models-empty"
}, Ri = /* @__PURE__ */ Q({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(H, { emit: t }) {
    const { locale: m } = ae(), k = H, g = t, b = W(() => String(k.modelValue || "").split(",").map((_) => _.trim()).filter(Boolean)), d = W(() => k.options.filter((_) => !b.value.includes(_)));
    function $(_) {
      g("update:modelValue", _.join(","));
    }
    function w(_) {
      _ && !b.value.includes(_) && $([...b.value, _]);
    }
    function z(_) {
      $(b.value.filter((u) => u !== _));
    }
    function T(_, u) {
      const S = [...b.value], E = _ + u;
      E < 0 || E >= S.length || ([S[_], S[E]] = [S[E], S[_]], $(S));
    }
    return (_, u) => (n(), a("div", Oi, [
      b.value.length ? (n(), a("ol", zi, [
        (n(!0), a(j, null, J(b.value, (S, E) => (n(), a("li", { key: S }, [
          e("span", Li, l(E + 1), 1),
          e("span", {
            class: "models-name",
            title: S
          }, l(S), 9, Ii),
          e("span", Di, [
            e("button", {
              type: "button",
              disabled: E === 0,
              "aria-label": s(m) === "en" ? "Higher priority" : "提高优先级",
              onClick: (i) => T(E, -1)
            }, "↑", 8, ji),
            e("button", {
              type: "button",
              disabled: E === b.value.length - 1,
              "aria-label": s(m) === "en" ? "Lower priority" : "降低优先级",
              onClick: (i) => T(E, 1)
            }, "↓", 8, Fi),
            e("button", {
              type: "button",
              "aria-label": s(m) === "en" ? "Remove" : "移除",
              onClick: (i) => z(S)
            }, "✕", 8, Ni)
          ])
        ]))), 128))
      ])) : (n(), a("p", Ki, l(s(m) === "en" ? "No fallback models — provider catalog order is used." : "暂无备选模型，将按供应商目录顺序尝试。"), 1)),
      d.value.length ? (n(), se(s(ie), {
        key: 2,
        options: d.value,
        "model-value": "",
        placeholder: s(m) === "en" ? "+ Add fallback model…" : "+ 添加备选模型…",
        "onUpdate:modelValue": w
      }, null, 8, ["options", "placeholder"])) : f("", !0)
    ]));
  }
}), je = /* @__PURE__ */ ue(Ri, [["__scopeId", "data-v-b73b6842"]]), Hi = { class: "settings-page" }, Bi = { class: "page-header" }, Ji = { class: "subtitle" }, Wi = { key: 0 }, qi = { key: 1 }, Yi = { class: "settings-layout" }, Gi = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, Qi = ["onClick"], Xi = {
  class: "nav-icon",
  "aria-hidden": "true"
}, Zi = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, er = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, tr = {
  key: 2,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, sr = {
  key: 3,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, lr = {
  key: 4,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, or = {
  key: 5,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, nr = {
  key: 6,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, ar = {
  key: 7,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, ir = {
  key: 8,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, rr = {
  key: 9,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, ur = {
  key: 10,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, dr = { class: "nav-label" }, cr = { class: "settings-content" }, pr = {
  key: 0,
  class: "content-card provider-runtime"
}, vr = {
  key: 0,
  class: "helper-text"
}, _r = {
  key: 0,
  class: "toggle-label"
}, hr = ["checked", "onChange"], mr = { key: 0 }, br = {
  key: 1,
  class: "helper-text"
}, gr = {
  key: 0,
  class: "helper-text"
}, yr = ["type", "value", "onInput"], kr = {
  key: 0,
  class: "helper-text"
}, fr = {
  key: 1,
  class: "helper-text"
}, $r = { class: "actions-row" }, wr = {
  key: 3,
  class: "content-card"
}, Cr = { class: "card-desc" }, xr = { class: "toggle-label" }, Sr = { class: "field" }, Pr = { class: "model-choices" }, Tr = ["value", "checked", "onChange"], Ur = ["placeholder"], Mr = { class: "helper-text" }, Vr = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, Ar = { class: "field" }, Er = {
  key: 0,
  class: "helper-text"
}, Or = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, zr = ["value", "checked", "onChange"], Lr = ["onClick"], Ir = {
  key: 8,
  class: "content-card"
}, Dr = {
  key: 0,
  class: "card-desc"
}, jr = {
  key: 1,
  class: "helper-text"
}, Fr = {
  key: 0,
  class: "toggle-label"
}, Nr = ["checked", "onChange"], Kr = { key: 0 }, Rr = {
  key: 1,
  class: "helper-text"
}, Hr = {
  key: 0,
  class: "helper-text"
}, Br = {
  key: 0,
  class: "helper-text"
}, Jr = {
  key: 0,
  class: "helper-text"
}, Wr = { class: "actions-row" }, qr = ["disabled"], Yr = {
  key: 0,
  class: "helper-text"
}, Gr = {
  key: 0,
  class: "helper-text"
}, Qr = ["type", "value", "onInput"], Xr = {
  key: 0,
  class: "helper-text"
}, Zr = {
  key: 2,
  class: "helper-text"
}, eu = { class: "actions-row" }, tu = {
  key: 10,
  class: "content-card"
}, su = {
  key: 0,
  class: "card-desc"
}, lu = {
  key: 1,
  class: "card-desc"
}, ou = {
  key: 0,
  class: "toggle-label"
}, nu = ["checked", "onChange"], au = { key: 0 }, iu = {
  key: 1,
  class: "helper-text"
}, ru = {
  key: 0,
  class: "helper-text"
}, uu = {
  key: 0,
  class: "helper-text"
}, du = {
  key: 0,
  class: "helper-text"
}, cu = ["type", "value", "onInput"], pu = {
  key: 0,
  class: "helper-text"
}, vu = {
  key: 2,
  class: "helper-text"
}, _u = { class: "actions-row" }, fu = /* @__PURE__ */ Q({
  __name: "SettingsPage",
  setup(H) {
    const { t, locale: m } = ae(), { confirm: k } = Ve(), g = Ae(), b = lt(), d = Ke(), $ = Xe(), w = Fe(), z = W(() => d.settingsTabs.map((r) => ({
      id: r.id,
      icon: r.icon || "chip"
    }))), T = W(() => {
      const r = new Set(d.settingsTabs.map((o) => o.id)), v = new Set(d.removedSettingsIds);
      return b.sections.filter((o) => o.id !== "permissions" && !r.has(o.id) && !v.has(o.id)).map((o) => ({ id: o.id, icon: o.icon || "lock" }));
    }), _ = W(() => [...z.value, ...T.value]), u = x("general"), S = x(!1), E = x([]), i = x(null), p = x(""), h = x({}), M = x(""), V = x(!1), I = x(""), q = x([]), F = W(() => m.value === "en" ? "Auto (by strategy)" : "自动（按策略）"), A = W(() => [
      { value: "", label: F.value },
      ...q.value.map((r) => ({ value: r, label: r }))
    ]);
    async function K() {
      try {
        const r = await fetch("/api/models");
        if (!r.ok) return;
        const v = await r.json();
        q.value = Array.from(new Set((v.models || []).map((o) => String(o.id || "")).filter(Boolean)));
      } catch {
      }
    }
    async function ee(r) {
      V.value = !0, I.value = "";
      try {
        const v = await fetch(`/api/settings/${r}/test`, { method: "POST" }), o = v.headers.get("content-type") || "";
        if (v.ok && o.startsWith("audio")) {
          const C = URL.createObjectURL(await v.blob());
          try {
            await new Audio(C).play();
          } catch {
          }
          window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: C } })), I.value = "测试成功，正在播放…";
        } else {
          const C = await v.json().catch(() => ({}));
          I.value = C.error || `HTTP ${v.status}`;
        }
      } catch (v) {
        I.value = v instanceof Error ? v.message : String(v);
      } finally {
        V.value = !1;
      }
    }
    const { tabMeta: N, isBuiltinTab: O, isPluginSection: L, tabLabel: P, fieldLabel: le, fieldHelp: ve, pluginSection: Y } = Ee(), _e = W(() => O(u.value) ? null : N(u.value)?.module || null);
    function me(r, v) {
      const o = h.value[r]?.[v];
      return typeof o == "boolean" ? o : o === "true" || o === 1 || o === "1";
    }
    function ye(r) {
      if (N(r)?.fields?.length && !O(r)) {
        Ce(r);
        return;
      }
      const o = Y(r);
      if (!o) return;
      const C = {};
      for (const R of o.fields)
        R.type === "bool" ? C[R.key] = R.default_value === "true" || R.default_value === "1" : R.type === "number" ? C[R.key] = Number(R.default_value || 0) : C[R.key] = R.default_value || "";
      const te = b.values[r] || {}, X = { ...C };
      for (const R of o.fields) {
        if (!(R.key in te)) continue;
        const ne = te[R.key];
        R.type === "bool" ? X[R.key] = ne === !0 || ne === "true" || ne === 1 || ne === "1" : X[R.key] = ne;
      }
      h.value = {
        ...h.value,
        [r]: X
      };
    }
    async function Ce(r) {
      const v = N(r);
      if (!v?.fields?.length) return;
      const o = {};
      for (const C of v.fields)
        C.type === "bool" ? o[C.key] = C.default_value === "true" || C.default_value === "1" : C.type === "number" ? o[C.key] = Number(C.default_value || 0) : o[C.key] = C.default_value || "";
      if (v.loadApi)
        try {
          const C = await fetch(v.loadApi);
          if (C.ok) {
            const te = await C.json();
            for (const X of v.fields) {
              if (!(X.key in te)) continue;
              const R = te[X.key];
              X.type === "bool" ? o[X.key] = R === !0 || R === "true" || R === 1 || R === "1" : o[X.key] = R;
            }
          }
        } catch {
        }
      h.value = { ...h.value, [r]: o };
    }
    async function ke(r) {
      const v = N(r);
      M.value = "";
      try {
        const o = h.value[r] || {};
        if (v?.saveApi) {
          const C = await fetch(v.saveApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(o)
          });
          if (!C.ok) throw new Error(String(C.status));
        }
        M.value = t("settings.saved"), setTimeout(() => {
          M.value = "";
        }, 1500);
      } catch {
        M.value = t("settings.permFailed");
      }
    }
    async function fe(r) {
      M.value = "";
      try {
        await b.saveValues(r, h.value[r] || {}), M.value = t("settings.saved"), setTimeout(() => {
          M.value = "";
        }, 1500);
      } catch {
        M.value = t("settings.permFailed");
      }
    }
    async function be() {
      try {
        const r = await fetch("/api/live2d");
        if (r.ok) {
          const v = await r.json();
          E.value = v.models || [];
        }
      } catch {
        E.value = [];
      }
    }
    async function xe(r) {
      if (await k({
        title: t("settings.live2d"),
        message: `删除模型 ${r.label} 及所在模型文件夹中的全部资源？`,
        confirmLabel: m.value === "en" ? "Delete" : "删除",
        danger: !0
      }))
        try {
          const o = await fetch(`/api/live2d/${encodeURIComponent(r.id)}`, { method: "DELETE" });
          if (!o.ok) throw new Error(await o.text());
          const C = await o.json();
          E.value = C.models || [];
          const te = r.url.slice(0, r.url.indexOf("/", 15) + 1);
          g.live2d.modelUrl.startsWith(te) && (g.live2d.modelUrl = "", g.live2d.enabled = !1, g.saveToStorage()), await de(), p.value = "模型已删除", window.dispatchEvent(new Event("live2d-models-changed"));
        } catch (o) {
          p.value = o.message;
        }
    }
    async function de() {
      g.saveToStorage();
      const r = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: g.live2d.enabled, model_url: g.live2d.modelUrl } }) });
      if (!r.ok) throw new Error(await r.text());
    }
    function Se() {
      i.value?.click();
    }
    async function Pe(r) {
      const v = r.target, o = v.files;
      if (!(!o || o.length === 0)) {
        p.value = "";
        try {
          const C = new FormData(), te = [];
          for (const ne of Array.from(o)) {
            const He = ne.webkitRelativePath || ne.name;
            te.push(He), C.append("files", ne, ne.name);
          }
          C.append("paths", JSON.stringify(te));
          const X = await fetch("/api/live2d", { method: "POST", body: C });
          if (!X.ok) throw new Error(await X.text());
          const R = await X.json();
          p.value = t("settings.uploadOk"), R?.models ? E.value = R.models : await be(), R?.model_url && (g.live2d.modelUrl = R.model_url, g.live2d.enabled = !0, g.saveToStorage(), await de(), window.dispatchEvent(new Event("live2d-models-changed")));
        } catch (C) {
          p.value = `${t("settings.uploadFail")}：${C.message}`;
        } finally {
          v.value = "";
        }
      }
    }
    re(async () => {
      g.loadFromStorage();
      const r = $.query.tab;
      r && (u.value = r), be(), K(), await b.fetchSections();
      for (const v of b.sections) ye(v.id);
    });
    function c(r) {
      u.value = r, O(r) || ye(r), w.replace({ query: { tab: r } });
    }
    function y() {
      g.saveToStorage(), u.value === "live2d" && de().catch((r) => {
        p.value = r.message;
      }), S.value = !0, setTimeout(() => {
        S.value = !1;
      }, 1500);
    }
    return (r, v) => (n(), a("div", Hi, [
      e("header", Bi, [
        e("div", null, [
          e("h1", null, l(s(t)("settings.title")), 1),
          e("p", Ji, l(s(t)("settings.pageDesc")), 1)
        ]),
        u.value !== "about" && !_e.value ? (n(), a("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: y
        }, [
          S.value ? (n(), a("span", Wi, l(s(t)("settings.saved")), 1)) : (n(), a("span", qi, l(s(t)("settings.save")), 1))
        ])) : f("", !0)
      ]),
      e("div", Yi, [
        e("nav", Gi, [
          (n(!0), a(j, null, J(_.value, (o) => (n(), a("button", {
            key: o.id,
            class: B(["nav-item", { active: u.value === o.id }]),
            onClick: (C) => c(o.id)
          }, [
            v[18] || (v[18] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", Xi, [
              o.icon === "globe" ? (n(), a("svg", Zi, [...v[7] || (v[7] = [
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
              ])])) : o.icon === "cloud" ? (n(), a("svg", er, [...v[8] || (v[8] = [
                e("path", {
                  d: "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])])) : o.icon === "chip" ? (n(), a("svg", tr, [...v[9] || (v[9] = [
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
              ])])) : o.icon === "person" ? (n(), a("svg", sr, [...v[10] || (v[10] = [
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
              ])])) : o.icon === "avatar" ? (n(), a("svg", lr, [...v[11] || (v[11] = [
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
              ])])) : o.icon === "brightness" ? (n(), a("svg", or, [...v[12] || (v[12] = [
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
              ])])) : o.icon === "warn" ? (n(), a("svg", nr, [...v[13] || (v[13] = [
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
              ])])) : o.icon === "info" ? (n(), a("svg", ar, [...v[14] || (v[14] = [
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
              ])])) : o.icon === "download" ? (n(), a("svg", ir, [...v[15] || (v[15] = [
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
              ])])) : o.icon === "shield" ? (n(), a("svg", rr, [...v[16] || (v[16] = [
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
              ])])) : (n(), a("svg", ur, [...v[17] || (v[17] = [
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
            e("span", dr, l(s(P)(o.id)), 1)
          ], 10, Qi))), 128))
        ]),
        e("section", cr, [
          u.value === "general" ? (n(), se(Dn, { key: 0 })) : u.value === "provider" ? (n(), a(j, { key: 1 }, [
            G(Cn),
            s(Y)("provider")?.fields?.length ? (n(), a("div", pr, [
              e("h3", null, l(s(Y)("provider").label), 1),
              s(Y)("provider").description ? (n(), a("p", vr, l(s(Y)("provider").description), 1)) : f("", !0),
              (n(!0), a(j, null, J(s(Y)("provider").fields, (o) => (n(), a("div", {
                key: o.key,
                class: "field"
              }, [
                o.type === "bool" ? (n(), a("label", _r, [
                  e("input", {
                    type: "checkbox",
                    checked: me("provider", o.key),
                    onChange: (C) => h.value = { ...h.value, provider: { ...h.value.provider, [o.key]: C.target.checked } }
                  }, null, 40, hr),
                  v[19] || (v[19] = e("span", { class: "toggle-slider" }, null, -1)),
                  e("span", null, [
                    e("strong", null, l(o.label), 1),
                    o.help ? (n(), a("br", mr)) : f("", !0),
                    o.help ? (n(), a("small", br, l(o.help), 1)) : f("", !0)
                  ])
                ])) : o.type === "select" ? (n(), a(j, { key: 1 }, [
                  e("label", null, l(o.label), 1),
                  G(s(ie), {
                    class: "input",
                    "aria-label": o.label,
                    "model-value": String(h.value.provider?.[o.key] ?? ""),
                    options: o.options || [],
                    "onUpdate:modelValue": (C) => h.value = { ...h.value, provider: { ...h.value.provider, [o.key]: C } }
                  }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                  o.help ? (n(), a("p", gr, l(o.help), 1)) : f("", !0)
                ], 64)) : (n(), a(j, { key: 2 }, [
                  e("label", null, l(o.label), 1),
                  e("input", {
                    class: "input",
                    type: o.type === "number" ? "number" : "text",
                    value: h.value.provider?.[o.key],
                    onInput: (C) => h.value = { ...h.value, provider: { ...h.value.provider, [o.key]: o.type === "number" ? Number(C.target.value) : C.target.value } }
                  }, null, 40, yr),
                  o.help ? (n(), a("p", kr, l(o.help), 1)) : f("", !0)
                ], 64))
              ]))), 128)),
              M.value ? (n(), a("div", fr, l(M.value), 1)) : f("", !0),
              e("div", $r, [
                e("button", {
                  class: "btn btn-primary",
                  type: "button",
                  onClick: v[0] || (v[0] = (o) => fe("provider"))
                }, l(s(t)("settings.save")), 1)
              ])
            ])) : f("", !0)
          ], 64)) : u.value === "persona" ? (n(), se(sa, { key: 2 })) : u.value === "live2d" ? (n(), a("div", wr, [
            e("h2", null, l(s(P)("live2d")), 1),
            e("p", Cr, l(s(N)("live2d")?.descriptionKey ? s(t)(s(N)("live2d").descriptionKey) : s(t)("settings.live2dDesc")), 1),
            G(nt, { class: "live2d-preview" }),
            e("label", xr, [
              U(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": v[1] || (v[1] = (o) => s(g).live2d.enabled = o)
              }, null, 512), [
                [oe, s(g).live2d.enabled]
              ]),
              v[20] || (v[20] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", null, l(s(t)("wizard.enableLive2d")), 1)
            ]),
            e("div", Sr, [
              e("label", null, l(s(t)("wizard.modelUrl")), 1),
              e("div", Pr, [
                (n(!0), a(j, null, J(s(ot), (o) => (n(), a("label", {
                  key: o.id,
                  class: B(["model-choice", { selected: s(g).live2d.modelUrl === o.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-model",
                    value: o.url,
                    checked: s(g).live2d.modelUrl === o.url,
                    onChange: (C) => {
                      s(g).live2d.modelUrl = o.url, s(g).live2d.enabled = !0;
                    }
                  }, null, 40, Tr),
                  e("span", null, l(o.label), 1),
                  e("code", null, l(o.url), 1)
                ], 2))), 128))
              ]),
              U(e("input", {
                "onUpdate:modelValue": v[2] || (v[2] = (o) => s(g).live2d.modelUrl = o),
                placeholder: s(t)("wizard.modelUrlPlaceholder"),
                class: "input"
              }, null, 8, Ur), [
                [D, s(g).live2d.modelUrl]
              ]),
              e("p", Mr, [
                Z(l(s(t)("wizard.live2dHelp")) + " ", 1),
                e("a", Vr, l(s(t)("wizard.live2dSamples")), 1)
              ])
            ]),
            v[21] || (v[21] = e("p", { class: "helper-text" }, "支持 Cubism 2（.model.json + .moc）与 Cubism 3/4（.model3.json + .moc3）。请选择完整模型文件夹，包含纹理、动作等资源。", -1)),
            e("button", {
              class: "btn btn-tonal",
              onClick: v[3] || (v[3] = (o) => de().catch((C) => p.value = C.message))
            }, "保存 LIFE 的 Live2D 设置"),
            e("div", Ar, [
              e("label", null, l(s(t)("settings.uploadFolder")), 1),
              e("label", {
                class: "upload-area",
                onClick: Le(Se, ["prevent"])
              }, [
                e("span", null, l(s(t)("settings.uploadFolderHint")), 1)
              ]),
              e("input", {
                ref_key: "folderInput",
                ref: i,
                type: "file",
                webkitdirectory: "",
                directory: "",
                multiple: "",
                class: "file-input",
                onChange: Pe
              }, null, 544),
              p.value ? (n(), a("p", Er, l(p.value), 1)) : f("", !0),
              E.value.length ? (n(), a("div", Or, [
                (n(!0), a(j, null, J(E.value, (o) => (n(), a("label", {
                  key: o.id,
                  class: B(["model-choice", { selected: s(g).live2d.modelUrl === o.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-uploaded",
                    value: o.url,
                    checked: s(g).live2d.modelUrl === o.url,
                    onChange: (C) => {
                      s(g).live2d.modelUrl = o.url, s(g).live2d.enabled = !0, de().catch((te) => p.value = te.message);
                    }
                  }, null, 40, zr),
                  e("span", null, l(o.label), 1),
                  e("code", null, l(o.url), 1),
                  e("button", {
                    type: "button",
                    class: "btn btn-danger",
                    onClick: Le((C) => xe(o), ["prevent"])
                  }, "删除模型", 8, Lr)
                ], 2))), 128))
              ])) : f("", !0)
            ])
          ])) : u.value === "security" ? (n(), se(Xa, { key: 4 })) : u.value === "permissions" ? (n(), se(_a, { key: 5 })) : u.value === "mcp" ? (n(), se(xi, { key: 6 })) : u.value === "life_settings" ? (n(), se(is, { key: 7 })) : s(L)(u.value) && s(Y)(u.value) ? (n(), a("div", Ir, [
            e("h2", null, l(s(Y)(u.value).label), 1),
            s(Y)(u.value).description ? (n(), a("p", Dr, l(s(Y)(u.value).description), 1)) : f("", !0),
            s(Y)(u.value).plugin_name ? (n(), a("p", jr, l(s(Y)(u.value).plugin_name), 1)) : f("", !0),
            (n(!0), a(j, null, J(s(Y)(u.value).fields, (o) => (n(), a("div", {
              key: o.key,
              class: "field"
            }, [
              o.type === "bool" ? (n(), a("label", Fr, [
                e("input", {
                  type: "checkbox",
                  checked: me(u.value, o.key),
                  onChange: (C) => h.value = { ...h.value, [u.value]: { ...h.value[u.value], [o.key]: C.target.checked } }
                }, null, 40, Nr),
                v[22] || (v[22] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, l(o.label), 1),
                  o.help ? (n(), a("br", Kr)) : f("", !0),
                  o.help ? (n(), a("small", Rr, l(o.help), 1)) : f("", !0)
                ])
              ])) : o.type === "select" ? (n(), a(j, { key: 1 }, [
                e("label", null, l(o.label), 1),
                G(s(ie), {
                  class: "input",
                  "aria-label": o.label,
                  "model-value": String(h.value[u.value]?.[o.key] ?? ""),
                  options: o.options || [],
                  "onUpdate:modelValue": (C) => h.value[u.value] = { ...h.value[u.value], [o.key]: C }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                o.help ? (n(), a("p", Hr, l(o.help), 1)) : f("", !0)
              ], 64)) : o.type === "model" ? (n(), a(j, { key: 2 }, [
                e("label", null, l(o.label), 1),
                G(s(ie), {
                  class: "input",
                  "aria-label": o.label,
                  "model-value": String(h.value[u.value]?.[o.key] ?? ""),
                  options: A.value,
                  "onUpdate:modelValue": (C) => h.value[u.value] = { ...h.value[u.value], [o.key]: C }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                o.help ? (n(), a("p", Br, l(o.help), 1)) : f("", !0)
              ], 64)) : o.type === "models" ? (n(), a(j, { key: 3 }, [
                e("label", null, l(o.label), 1),
                G(je, {
                  "model-value": String(h.value[u.value]?.[o.key] ?? ""),
                  options: q.value,
                  "onUpdate:modelValue": (C) => h.value[u.value] = { ...h.value[u.value], [o.key]: C }
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                o.help ? (n(), a("p", Jr, l(o.help), 1)) : f("", !0)
              ], 64)) : o.type === "test" ? (n(), a(j, { key: 4 }, [
                e("label", null, l(o.label), 1),
                e("div", Wr, [
                  e("button", {
                    class: "btn btn-tonal",
                    type: "button",
                    disabled: V.value,
                    onClick: v[4] || (v[4] = (C) => ee(u.value))
                  }, l(V.value ? s(t)("settings.testing") : o.label || "测试"), 9, qr),
                  I.value ? (n(), a("span", Yr, l(I.value), 1)) : f("", !0)
                ]),
                o.help ? (n(), a("p", Gr, l(o.help), 1)) : f("", !0)
              ], 64)) : (n(), a(j, { key: 5 }, [
                e("label", null, l(o.label), 1),
                e("input", {
                  class: "input",
                  type: o.type === "number" ? "number" : "text",
                  value: h.value[u.value]?.[o.key],
                  onInput: (C) => h.value[u.value] = { ...h.value[u.value], [o.key]: o.type === "number" ? Number(C.target.value) : C.target.value }
                }, null, 40, Qr),
                o.help ? (n(), a("p", Xr, l(o.help), 1)) : f("", !0)
              ], 64))
            ]))), 128)),
            M.value ? (n(), a("div", Zr, l(M.value), 1)) : f("", !0),
            e("div", eu, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: v[5] || (v[5] = (o) => fe(u.value))
              }, l(s(t)("settings.save")), 1)
            ])
          ])) : _e.value ? (n(), se(Ei, {
            key: _e.value,
            module: _e.value || ""
          }, null, 8, ["module"])) : !s(O)(u.value) && s(N)(u.value)?.fields?.length ? (n(), a("div", tu, [
            e("h2", null, l(s(P)(u.value)), 1),
            s(N)(u.value)?.descriptionKey ? (n(), a("p", su, l(s(t)(s(N)(u.value).descriptionKey)), 1)) : s(N)(u.value)?.description ? (n(), a("p", lu, l(s(N)(u.value).description), 1)) : f("", !0),
            (n(!0), a(j, null, J(s(N)(u.value).fields, (o) => (n(), a("div", {
              key: o.key,
              class: "field"
            }, [
              o.type === "bool" ? (n(), a("label", ou, [
                e("input", {
                  type: "checkbox",
                  checked: me(u.value, o.key),
                  onChange: (C) => h.value = { ...h.value, [u.value]: { ...h.value[u.value], [o.key]: C.target.checked } }
                }, null, 40, nu),
                v[23] || (v[23] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, l(s(le)(s(N)(u.value), o.key, `settings.${o.key}`)), 1),
                  o.help || o.helpKey ? (n(), a("br", au)) : f("", !0),
                  o.help || o.helpKey ? (n(), a("small", iu, l(s(ve)(s(N)(u.value), o.key, `settings.${o.key}Desc`)), 1)) : f("", !0)
                ])
              ])) : o.type === "select" ? (n(), a(j, { key: 1 }, [
                e("label", null, l(s(le)(s(N)(u.value), o.key, `settings.${o.key}`)), 1),
                G(s(ie), {
                  class: "input",
                  "aria-label": s(le)(s(N)(u.value), o.key, `settings.${o.key}`),
                  "model-value": String(h.value[u.value]?.[o.key] ?? ""),
                  options: o.options || [],
                  "onUpdate:modelValue": (C) => h.value[u.value] = { ...h.value[u.value], [o.key]: C }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                o.help || o.helpKey ? (n(), a("p", ru, l(s(ve)(s(N)(u.value), o.key, `settings.${o.key}Desc`)), 1)) : f("", !0)
              ], 64)) : o.type === "model" ? (n(), a(j, { key: 2 }, [
                e("label", null, l(s(le)(s(N)(u.value), o.key, `settings.${o.key}`)), 1),
                G(s(ie), {
                  class: "input",
                  "aria-label": s(le)(s(N)(u.value), o.key, `settings.${o.key}`),
                  "model-value": String(h.value[u.value]?.[o.key] ?? ""),
                  options: A.value,
                  "onUpdate:modelValue": (C) => h.value[u.value] = { ...h.value[u.value], [o.key]: C }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                o.help || o.helpKey ? (n(), a("p", uu, l(s(ve)(s(N)(u.value), o.key, `settings.${o.key}Desc`)), 1)) : f("", !0)
              ], 64)) : o.type === "models" ? (n(), a(j, { key: 3 }, [
                e("label", null, l(s(le)(s(N)(u.value), o.key, `settings.${o.key}`)), 1),
                G(je, {
                  "model-value": String(h.value[u.value]?.[o.key] ?? ""),
                  options: q.value,
                  "onUpdate:modelValue": (C) => h.value[u.value] = { ...h.value[u.value], [o.key]: C }
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                o.help || o.helpKey ? (n(), a("p", du, l(s(ve)(s(N)(u.value), o.key, `settings.${o.key}Desc`)), 1)) : f("", !0)
              ], 64)) : (n(), a(j, { key: 4 }, [
                e("label", null, l(s(le)(s(N)(u.value), o.key, `settings.${o.key}`)), 1),
                e("input", {
                  class: "input",
                  type: o.type === "number" ? "number" : "text",
                  value: h.value[u.value]?.[o.key],
                  onInput: (C) => h.value[u.value] = { ...h.value[u.value], [o.key]: o.type === "number" ? Number(C.target.value) : C.target.value }
                }, null, 40, cu),
                o.help || o.helpKey ? (n(), a("p", pu, l(s(ve)(s(N)(u.value), o.key, `settings.${o.key}Desc`)), 1)) : f("", !0)
              ], 64))
            ]))), 128)),
            M.value ? (n(), a("div", vu, l(M.value), 1)) : f("", !0),
            e("div", _u, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: v[6] || (v[6] = (o) => ke(u.value))
              }, l(s(t)("settings.save")), 1)
            ])
          ])) : u.value === "about" ? (n(), se(pl, { key: 11 })) : u.value === "updates" ? (n(), se(eo, { key: 12 })) : (n(), se(Ui, { key: 13 }))
        ])
      ])
    ]));
  }
});
export {
  fu as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".live2d-stage[data-v-594879d8]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-594879d8]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:none;cursor:grab;user-select:none;background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,#f3edf7,#e7e0ec 55%,#d0bcff33)}.stage-viewport[data-v-594879d8]:active{cursor:grabbing}.stage-canvas[data-v-594879d8]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-594879d8]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-594879d8]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-594879d8]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-594879d8]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-594879d8]:active{transform:scale(.96)}.stage-reset.dragging[data-v-594879d8]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-594879d8]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-594879d8]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-594879d8]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-bdd613ec]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-bdd613ec]{flex-direction:row-reverse}.avatar[data-v-bdd613ec]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-bdd613ec]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-bdd613ec]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-bdd613ec]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-bdd613ec]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-bdd613ec]{max-width:70%}.content[data-v-bdd613ec]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.user .content[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-bdd613ec]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-bdd613ec]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-bdd613ec]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-bdd613ec]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-bdd613ec]{margin:4px 0}.think-body b[data-v-bdd613ec]{color:var(--md-on-surface)}.think-summary[data-v-bdd613ec]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-bdd613ec]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-bdd613ec]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-bdd613ec]{justify-content:flex-end}.separator[data-v-bdd613ec]{color:var(--neutral-gray-10)}.emotion[data-v-bdd613ec]{font-weight:500}.chat-panel[data-v-3b7db97c]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-3b7db97c]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-3b7db97c]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-3b7db97c]{color:var(--md-error)}.chat-container[data-v-3b7db97c]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-3b7db97c]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-3b7db97c]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-3b7db97c]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-3b7db97c]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-3b7db97c]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-3b7db97c]{display:flex;gap:4px}.typing-dots span[data-v-3b7db97c]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-3b7db97c 1.4s infinite ease-in-out}.typing-dots span[data-v-3b7db97c]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-3b7db97c]:nth-child(2){animation-delay:-.16s}@keyframes bounce-3b7db97c{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-3b7db97c]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-3b7db97c]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-3b7db97c]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-3b7db97c]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-3b7db97c]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-3b7db97c],.pending-files[data-v-3b7db97c]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-3b7db97c]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-3b7db97c]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-3b7db97c]:hover{color:var(--error)}.pending-thumb[data-v-3b7db97c]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-3b7db97c]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-3b7db97c]{position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.attach-btn[data-v-3b7db97c]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-3b7db97c]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-3b7db97c]:disabled{opacity:.5;cursor:not-allowed}.send-button[data-v-3b7db97c]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-3b7db97c]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-3b7db97c]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-3b7db97c]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-3b7db97c]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-3b7db97c]{background:var(--success)}.disconnected .status-dot[data-v-3b7db97c]{background:var(--error)}.hint[data-v-3b7db97c]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-95ba671e]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-95ba671e]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-95ba671e]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-95ba671e]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-95ba671e]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-95ba671e]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-95ba671e]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-95ba671e]{margin-bottom:var(--space-xl)}.section-header[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-95ba671e]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.section-value[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-30)}.mood-display[data-v-95ba671e]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-95ba671e]{margin-bottom:var(--space-md)}.mood-label[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600}.energy-bar[data-v-95ba671e]{height:8px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.energy-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out),background-color var(--duration-medium) var(--ease-out)}.emotion-bars[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-95ba671e]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-95ba671e]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-95ba671e]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.task-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-id[data-v-95ba671e]{font-family:monospace;font-size:var(--font-size-sm);color:var(--neutral-gray-50)}.task-status[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary)}.connection-info[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-sm);font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.link-btn[data-v-95ba671e]{border:none;background:none;color:var(--brand-primary);font-size:var(--font-size-xs);cursor:pointer;padding:0}.link-btn[data-v-95ba671e]:disabled{opacity:.5;cursor:default}.memory-stats[data-v-95ba671e]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);margin-bottom:var(--space-sm)}.memory-stat[data-v-95ba671e]{padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);text-align:center}.memory-stat-label[data-v-95ba671e]{display:block;font-size:var(--font-size-xs);color:var(--neutral-gray-30);margin-bottom:2px}.memory-stat-value[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-50)}.memory-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-xs)}.memory-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-sm);padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);font-size:var(--font-size-sm)}.memory-text[data-v-95ba671e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--neutral-gray-50)}.memory-strength[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary);font-weight:600}.connection-dot[data-v-95ba671e]{width:8px;height:8px;border-radius:50%;background:var(--error)}.connection-dot.connected[data-v-95ba671e]{background:var(--success)}.state-source[data-v-95ba671e]{margin-left:auto;font-size:var(--font-size-xs);font-weight:700;color:var(--brand-primary);letter-spacing:.5px}.agents-display[data-v-95ba671e]{padding:var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.agent-count[data-v-95ba671e]{display:flex;align-items:baseline;gap:var(--space-sm)}.agent-number[data-v-95ba671e]{font-size:var(--font-size-xl);font-weight:700;color:var(--neutral-gray-30)}.agent-number.online[data-v-95ba671e]{color:var(--success)}.agent-label[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.agent-offline[data-v-95ba671e]{margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.chat-page[data-v-d95e8000]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-d95e8000]{grid-template-columns:1fr}.stage-column[data-v-d95e8000]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-d95e8000]{flex:1;min-height:240px}.status-panel[data-v-d95e8000]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-d95e8000]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-d95e8000]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-d95e8000]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-d95e8000]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-d95e8000]:hover,.page-resizer[data-v-d95e8000]:active{background:var(--md-primary)}.chat-column[data-v-d95e8000]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-d95e8000]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-d95e8000]{display:flex;flex-direction:column}.stage-column[data-v-d95e8000]{flex:1;min-height:0}.page-resizer[data-v-d95e8000]{display:none}.chat-column[data-v-d95e8000]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);transition:transform var(--transition-normal)}.chat-column.open[data-v-d95e8000]{transform:translate(0)}}.plugins-page[data-v-27522700]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-27522700]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-27522700]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-27522700],.pp-hero h1[data-v-27522700]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-27522700]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-27522700]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-27522700]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.pp-stats[data-v-27522700]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-27522700]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-27522700]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-27522700]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-27522700]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-27522700]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-27522700]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-27522700]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-27522700]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-27522700 var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-27522700{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-27522700]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-27522700]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-27522700]{opacity:.62}.plugin-top[data-v-27522700]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-27522700]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-27522700]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-27522700]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-27522700]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-27522700]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-27522700]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-27522700]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-27522700]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-27522700]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-27522700]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-27522700]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-27522700]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-27522700]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-27522700]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-27522700]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-27522700]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-27522700]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-27522700]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-27522700]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-27522700]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-27522700]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-27522700]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-27522700]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-27522700]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-27522700]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-27522700]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-27522700]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-27522700]{white-space:nowrap}#app .plugins-page .btn[data-v-27522700]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-27522700]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-27522700]:disabled{opacity:.6;cursor:not-allowed}#app .plugins-page .btn-tonal[data-v-27522700]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .plugins-page .btn-danger[data-v-27522700]{background:var(--md-error-container);color:var(--md-on-error-container)}.empty-state[data-v-27522700]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-27522700]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-27522700]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-27522700]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-27522700]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-27522700]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-27522700]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-27522700],.pd-leave-to[data-v-27522700]{opacity:0}.pd-enter-active .pd-dialog[data-v-27522700]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-27522700]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-27522700],.pd-leave-to .pd-dialog[data-v-27522700]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-27522700]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-27522700]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-27522700]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-27522700]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-27522700]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-27522700]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-27522700]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-27522700]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-27522700]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-27522700]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-27522700]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-27522700]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-27522700]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-27522700]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-27522700]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-27522700]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-27522700]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-27522700]{color:var(--md-error)}.pd-foot[data-v-27522700]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-27522700]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn-tonal[data-v-27522700]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pd-foot .btn-danger[data-v-27522700]{background:var(--md-error-container);color:var(--md-on-error-container)}.pd-foot .btn[data-v-27522700]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-27522700],.pd-leave-active[data-v-27522700],.pd-enter-active .pd-dialog[data-v-27522700],.pd-leave-active .pd-dialog[data-v-27522700]{transition:none}.pd-enter-from .pd-dialog[data-v-27522700],.pd-leave-to .pd-dialog[data-v-27522700]{transform:none}}.life-settings[data-v-537538f7]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-537538f7]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-537538f7 .52s var(--ls-spring) both}.ls-hero-main[data-v-537538f7]{min-width:0}.ls-eyebrow[data-v-537538f7]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-537538f7]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-537538f7]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-537538f7]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-537538f7]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-537538f7]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-537538f7]{font-size:16px}.ls-grid[data-v-537538f7]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-537538f7]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-537538f7 .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-537538f7]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-537538f7]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-537538f7]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-537538f7]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-537538f7]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-537538f7]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-537538f7]{grid-column:1 / -1}.ls-card-head[data-v-537538f7]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-537538f7]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-537538f7]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-537538f7]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-537538f7]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-537538f7]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-537538f7]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-537538f7]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-537538f7]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-537538f7]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-537538f7]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-537538f7]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-537538f7]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-537538f7]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-537538f7]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-537538f7]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-537538f7]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-537538f7]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-537538f7]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-537538f7]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-537538f7]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-537538f7]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-537538f7]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-537538f7]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-537538f7]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-537538f7]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-537538f7]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-537538f7]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-537538f7]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-537538f7]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-537538f7]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-537538f7]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-537538f7]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-537538f7]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}.ls-model b[data-v-537538f7]{font-size:13px;word-break:break-all}.ls-model span[data-v-537538f7]{font-size:12px;color:var(--md-on-surface-variant)}.ls-state[data-v-537538f7]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-537538f7 .32s var(--ls-spring) both}.ls-mail-actions[data-v-537538f7]{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}#app .ls-mail-actions .ls-test[data-v-537538f7]{min-height:44px;padding:0 20px;border:0;border-radius:999px;cursor:pointer;font:700 13px/1 inherit;background:var(--md-secondary-container);color:var(--md-on-secondary-container);transition:transform var(--duration-medium) var(--ease-spring),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .ls-mail-actions .ls-test[data-v-537538f7]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .ls-mail-actions .ls-test[data-v-537538f7]:disabled{opacity:.55;cursor:not-allowed}.ls-mail-result[data-v-537538f7]{margin:4px 0 0;padding:12px 15px;border-radius:16px;font-size:12.5px;line-height:1.55;font-weight:600}.ls-mail-result.ok[data-v-537538f7]{background:var(--md-success-container);color:var(--md-on-success-container)}.ls-mail-result.bad[data-v-537538f7]{background:var(--md-error-container);color:var(--md-on-error-container)}@keyframes ls-rise-537538f7{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-537538f7{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-537538f7],.ls-row[data-v-537538f7],.ls-models[data-v-537538f7]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-537538f7],.ls-card[data-v-537538f7],.ls-state[data-v-537538f7]{animation:none}}.about[data-v-f0cbac94]{display:flex;flex-direction:column;gap:26px}.identity[data-v-f0cbac94]{display:flex;align-items:center;gap:16px}.app-icon[data-v-f0cbac94]{flex:none;width:56px;height:56px;border-radius:16px;background:var(--md-primary);color:var(--md-on-primary);display:grid;place-items:center;font-size:20px;font-weight:750;letter-spacing:-1px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 35%,transparent)}.app-id[data-v-f0cbac94]{flex:1;min-width:0}.app-id h2[data-v-f0cbac94]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-f0cbac94]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-f0cbac94]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-f0cbac94]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-f0cbac94]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-f0cbac94]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-f0cbac94]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.btn.sm[data-v-f0cbac94]{height:34px;padding-inline:16px;font-size:13px}.credits[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-f0cbac94]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-f0cbac94]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-f0cbac94]{font-size:16px;font-weight:650}.person-info .role[data-v-f0cbac94]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-f0cbac94]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-f0cbac94]{margin-top:6px}.contribs[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-f0cbac94]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-f0cbac94]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-f0cbac94]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-f0cbac94]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-f0cbac94]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-f0cbac94]{margin-left:auto}.status-chip[data-v-f0cbac94]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-f0cbac94]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-f0cbac94]:hover{text-decoration:underline}.muted[data-v-f0cbac94]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-f0cbac94]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-f0cbac94]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-f0cbac94]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-f0cbac94]{flex:1;min-width:0}.us-hero-text b[data-v-f0cbac94]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-f0cbac94]{font-size:13px;opacity:.85}.us-hero-text em[data-v-f0cbac94]{font-style:normal;font-weight:700}.us-hero-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-f0cbac94]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-f0cbac94]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-f0cbac94]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-f0cbac94]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-f0cbac94]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-f0cbac94]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-f0cbac94]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-f0cbac94]{font-weight:700}.us-apply-label[data-v-f0cbac94]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-f0cbac94]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-f0cbac94]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-f0cbac94]{animation:us-spin-f0cbac94 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-f0cbac94],.us-apply-banner.failed .us-spinner[data-v-f0cbac94]{display:none}.us-apply-log[data-v-f0cbac94],.us-apply-error[data-v-f0cbac94]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-f0cbac94{to{transform:rotate(360deg)}}.alert[data-v-f0cbac94]{color:var(--md-error)}.updates[data-v-6bbe694b]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-6bbe694b]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-6bbe694b]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-6bbe694b]{display:flex;align-items:center;gap:12px}.us-ico[data-v-6bbe694b]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-6bbe694b]{flex:1;min-width:0}.us-title[data-v-6bbe694b]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-6bbe694b]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-6bbe694b]{display:flex;align-items:center;gap:8px}.us-tag[data-v-6bbe694b]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-6bbe694b]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-6bbe694b]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-source[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-6bbe694b]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-6bbe694b]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-6bbe694b]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-6bbe694b]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-6bbe694b]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-6bbe694b]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-6bbe694b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-6bbe694b]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-6bbe694b]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-6bbe694b]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-6bbe694b]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-6bbe694b]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-6bbe694b]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-6bbe694b]{flex:1;min-width:0}.us-hero-text b[data-v-6bbe694b]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-6bbe694b]{font-size:13px;opacity:.85}.us-hero-text em[data-v-6bbe694b]{font-style:normal;font-weight:700}.us-hero-actions[data-v-6bbe694b]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-6bbe694b]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-6bbe694b]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-6bbe694b]{font-weight:700}.us-apply-label[data-v-6bbe694b]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-6bbe694b]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-6bbe694b]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-6bbe694b]{animation:us-spin-6bbe694b .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-6bbe694b],.us-apply-banner.failed .us-spinner[data-v-6bbe694b]{display:none}.us-apply-log[data-v-6bbe694b],.us-apply-error[data-v-6bbe694b]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-6bbe694b{to{transform:rotate(360deg)}}.us-table[data-v-6bbe694b]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-6bbe694b]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-6bbe694b]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-6bbe694b]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-6bbe694b]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-6bbe694b]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-6bbe694b]{background:var(--md-success)}.us-dot.warn[data-v-6bbe694b]{background:#e0a800}.us-dot.bad[data-v-6bbe694b]{background:var(--md-error)}.us-ver[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-6bbe694b]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-6bbe694b]{font-weight:650}.us-ver b.good[data-v-6bbe694b]{color:var(--md-success)}.us-arrow[data-v-6bbe694b]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-6bbe694b]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-6bbe694b]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-6bbe694b]:hover{text-decoration:underline}.us-empty[data-v-6bbe694b]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-6bbe694b]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-6bbe694b]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.btn.sm[data-v-6bbe694b]{height:34px;padding-inline:16px;font-size:13px}.btn.xs[data-v-6bbe694b]{height:30px;padding-inline:12px;font-size:12px}.alert[data-v-6bbe694b]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-6bbe694b]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-6bbe694b]{display:none}.us-hero[data-v-6bbe694b]{flex-wrap:wrap}.us-hero-actions[data-v-6bbe694b]{width:100%}}.provider-panel[data-v-828ee6e3]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-828ee6e3]{display:flex;align-items:center;gap:14px}.pp-back[data-v-828ee6e3]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-828ee6e3]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-828ee6e3]{flex:1;min-width:0}.pp-editor-title h2[data-v-828ee6e3]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-828ee6e3]{margin:3px 0 0}.pp-section[data-v-828ee6e3]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-828ee6e3]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-828ee6e3]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-828ee6e3]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-828ee6e3]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-828ee6e3]{margin-bottom:0}.pp-span[data-v-828ee6e3]{grid-column:1 / -1}.pp-req[data-v-828ee6e3]{color:var(--md-error);margin-left:2px}.pp-key[data-v-828ee6e3]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-828ee6e3]{flex:1}.pp-key-toggle[data-v-828ee6e3]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-828ee6e3]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-828ee6e3]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-828ee6e3]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-828ee6e3]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-828ee6e3]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-828ee6e3]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-828ee6e3]{animation:pp-pulse-828ee6e3 1s ease-in-out infinite}@keyframes pp-pulse-828ee6e3{50%{opacity:.15}}.pp-probe[data-v-828ee6e3]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-828ee6e3]{color:var(--md-success)}.pp-probe.err[data-v-828ee6e3]{color:var(--md-error)}.pp-discovered[data-v-828ee6e3]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-828ee6e3]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-828ee6e3]{flex:1;min-width:160px}.pp-mini[data-v-828ee6e3]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-828ee6e3]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-models[data-v-828ee6e3]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-828ee6e3]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-828ee6e3]:first-child{border-top:0}.pp-model.off[data-v-828ee6e3]{opacity:.5}.pp-model-name[data-v-828ee6e3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-828ee6e3]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-828ee6e3]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-828ee6e3]{color:#e0a800;cursor:default}.pp-switch[data-v-828ee6e3]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-828ee6e3]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-828ee6e3]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-828ee6e3]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-828ee6e3]{display:flex;gap:10px}.pp-list-head[data-v-828ee6e3]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-828ee6e3]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-828ee6e3]{margin:3px 0 0}.pp-list-actions[data-v-828ee6e3]{display:flex;gap:8px}.pp-cards[data-v-828ee6e3]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-828ee6e3]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-828ee6e3]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-828ee6e3]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-828ee6e3]{opacity:.62}.pp-card-head[data-v-828ee6e3]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-828ee6e3]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-828ee6e3]{width:26px;height:26px}.pp-card-id[data-v-828ee6e3]{flex:1;min-width:0}.pp-card-id strong[data-v-828ee6e3]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-828ee6e3]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-828ee6e3]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-828ee6e3]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-828ee6e3]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-828ee6e3]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-828ee6e3]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-828ee6e3]{color:var(--md-error)}.pp-chips[data-v-828ee6e3]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-828ee6e3]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-828ee6e3],.pp-chip.empty[data-v-828ee6e3]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-828ee6e3]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.btn.sm[data-v-828ee6e3]{height:32px;padding-inline:12px;font-size:12.5px}.btn.xs[data-v-828ee6e3]{height:28px;padding-inline:12px;font-size:12px}.pp-empty[data-v-828ee6e3]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-828ee6e3],.pp-cards[data-v-828ee6e3]{grid-template-columns:1fr}}.pairing-panel[data-v-0559b1b2]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-0559b1b2]{margin:12px 0;color:var(--md-on-surface-variant)}article[data-v-0559b1b2]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-0559b1b2]{font-size:24px;letter-spacing:4px}button[data-v-0559b1b2]{padding:8px 12px}.security-panel[data-v-b1d117f0]{max-width:920px}.sec-stack[data-v-b1d117f0]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-b1d117f0]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-b1d117f0]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-b1d117f0]{font-size:15px;font-weight:700}.sec-chip[data-v-b1d117f0]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-b1d117f0]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-b1d117f0]{margin:2px 0 12px}.sec-pin-grid[data-v-b1d117f0]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-b1d117f0]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-b1d117f0]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-b1d117f0]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-b1d117f0]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-b1d117f0]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-b1d117f0]:hover{background:var(--md-surface-container)}.page-item[data-v-b1d117f0]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-b1d117f0]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-b1d117f0]{width:44px;height:26px}.page-item .toggle-slider[data-v-b1d117f0]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-b1d117f0]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-b1d117f0]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-b1d117f0]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-b1d117f0]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-b1d117f0]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-b1d117f0]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-b1d117f0]{margin-top:12px}.sec-error[data-v-b1d117f0]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-b1d117f0]{grid-template-columns:1fr}}.mcp-panel[data-v-3b21cb32]{max-width:900px}.mcp-head[data-v-3b21cb32]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-3b21cb32]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-3b21cb32]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-3b21cb32]{display:flex;gap:10px}.error-banner[data-v-3b21cb32]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-3b21cb32]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-3b21cb32]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-3b21cb32]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-3b21cb32]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-row[data-v-3b21cb32]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-3b21cb32]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-3b21cb32]{flex:1}.mcp-field>span[data-v-3b21cb32]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-3b21cb32],.mcp-field select[data-v-3b21cb32],.mcp-field textarea[data-v-3b21cb32]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field textarea[data-v-3b21cb32]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-3b21cb32]:focus,.mcp-field select[data-v-3b21cb32]:focus,.mcp-field textarea[data-v-3b21cb32]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-3b21cb32]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-3b21cb32]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.btn[data-v-3b21cb32]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-3b21cb32]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-3b21cb32]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-3b21cb32]:disabled{opacity:.6;cursor:not-allowed}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.models-field[data-v-b73b6842]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-b73b6842]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-b73b6842]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-b73b6842]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-b73b6842]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-b73b6842]{display:inline-flex;gap:4px}.models-actions button[data-v-b73b6842]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-b73b6842]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-b73b6842]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-b73b6842]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.usage-page[data-v-a7476de1]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-a7476de1]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-a7476de1]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-a7476de1]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-a7476de1]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-a7476de1]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-a7476de1]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-a7476de1]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .usage-page .btn[data-v-a7476de1]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-a7476de1]:disabled{opacity:.55;cursor:not-allowed}#app .usage-page .btn-tonal[data-v-a7476de1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .usage-page .btn-danger[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.overview[data-v-a7476de1]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-a7476de1]{display:grid;place-items:center}.donut[data-v-a7476de1]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-a7476de1]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-a7476de1]{fill:none;stroke-width:5}.donut-track[data-v-a7476de1]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-a7476de1]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-a7476de1]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-a7476de1]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-a7476de1]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-a7476de1]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-a7476de1]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-a7476de1]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-a7476de1]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-a7476de1]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-a7476de1]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-a7476de1]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-a7476de1]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-a7476de1]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-a7476de1]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-a7476de1]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-a7476de1]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-a7476de1]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-a7476de1]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-a7476de1]{background:var(--md-primary)}.dot.completion[data-v-a7476de1]{background:var(--md-tertiary)}.mini-stack[data-v-a7476de1]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-a7476de1]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-a7476de1]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-a7476de1]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-a7476de1]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-a7476de1]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-a7476de1]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-a7476de1]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-a7476de1]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-a7476de1]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-a7476de1]{position:absolute;inset:0}.grid span[data-v-a7476de1]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-a7476de1]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-a7476de1]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-a7476de1]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-a7476de1]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-a7476de1]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-a7476de1]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-a7476de1]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-a7476de1]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-a7476de1]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-a7476de1]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-a7476de1]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-a7476de1]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-a7476de1]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-a7476de1]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-a7476de1]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-a7476de1]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-a7476de1]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-a7476de1]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-a7476de1]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-a7476de1]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-a7476de1]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}@keyframes up-a7476de1{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-a7476de1]{grid-template-columns:1fr 1fr}.mini-stack[data-v-a7476de1]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-a7476de1],.mini-stack[data-v-a7476de1]{grid-template-columns:1fr}.chart[data-v-a7476de1]{height:200px;padding-left:34px}.grid span i[data-v-a7476de1]{left:-34px;width:28px}.axis span[data-v-a7476de1]{font-size:11px}}\n";document.head.appendChild(s)}})();
