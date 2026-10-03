import { defineComponent as X, reactive as je, ref as f, onMounted as se, openBlock as n, createElementBlock as i, createElementVNode as e, createTextVNode as Q, toDisplayString as o, withDirectives as T, vModelCheckbox as ee, vModelText as D, Fragment as N, renderList as B, normalizeClass as H, createCommentVNode as w, computed as J, onUnmounted as Se, unref as l, withKeys as Fe, createStaticVNode as Ne, createVNode as te, vModelDynamic as Ke, vModelSelect as Re, shallowRef as Ve, watch as He, createBlock as Z, resolveDynamicComponent as Be, withModifiers as Ee } from "vue";
import { useRouter as Oe, useRoute as Je } from "vue-router";
import { useI18n as le } from "vue-i18n";
import ie, { apiGet as ne, apiPost as be, ApiError as ze, useConfirm as Pe, useProvidersStore as We, PROVIDERS as xe, getLanguage as qe, LOCALES as Ye, setLanguage as Ge, useWizardStore as Te, useSettingsMeta as Ue, useUIPatchesStore as Le, useSettingsSectionsStore as Qe, DEFAULT_LIVE2D_MODELS as Xe } from "@0kay/host";
import { L as Ze } from "./assets/Live2DStage-C20BJYzk.js";
import { _ as re } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
const et = { class: "life-settings" }, tt = { class: "ls-hero" }, st = ["disabled"], lt = { class: "ls-grid" }, ot = { class: "ls-card" }, nt = { class: "ls-switch" }, at = { class: "ls-switch" }, it = { class: "ls-field" }, rt = { class: "ls-card" }, ut = { class: "ls-note" }, dt = { class: "ls-models" }, ct = ["onClick"], pt = {
  key: 0,
  class: "ls-empty"
}, vt = { class: "ls-models" }, _t = ["onClick"], ht = {
  key: 0,
  class: "ls-empty"
}, mt = { class: "ls-card" }, gt = { class: "ls-row" }, bt = { class: "ls-field" }, yt = { class: "ls-field" }, kt = { class: "ls-row" }, ft = { class: "ls-field" }, $t = { class: "ls-field" }, wt = { class: "ls-row" }, xt = { class: "ls-field" }, Ct = { class: "ls-field" }, St = { class: "ls-row" }, Pt = { class: "ls-field" }, Tt = { class: "ls-field" }, Ut = { class: "ls-row" }, Mt = { class: "ls-field" }, Vt = { class: "ls-field" }, Et = { class: "ls-field" }, At = { class: "ls-switch" }, Ot = { class: "ls-switch" }, zt = { class: "ls-mail-actions" }, Lt = ["disabled"], It = ["disabled"], Dt = { class: "ls-card" }, jt = { class: "ls-switch" }, Ft = { class: "ls-card ls-card-wide" }, Nt = { class: "ls-row" }, Kt = { class: "ls-switch" }, Rt = { class: "ls-switch" }, Ht = { class: "ls-row" }, Bt = { class: "ls-field" }, Jt = { class: "ls-field" }, Wt = { class: "ls-row" }, qt = { class: "ls-field" }, Yt = { class: "ls-field" }, Gt = { class: "ls-row" }, Qt = { class: "ls-field" }, Xt = { class: "ls-field" }, Zt = {
  key: 0,
  class: "ls-state"
}, es = /* @__PURE__ */ X({
  __name: "LifeSettingsPanel",
  setup(R) {
    const t = je({
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
    }), g = f(""), b = f(!1), m = f([]), y = f(""), d = f([]), $ = f(!1), k = f(""), L = f(null);
    function M() {
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
    async function _(j = !1) {
      $.value = !0, k.value = "", L.value = null;
      try {
        const a = await fetch("/api/life/companion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "mail_test", payload: { to: j ? t.mail_from || t.mail_imap_user : "", config: M() } })
        }), p = await a.json().catch(() => ({}));
        if (!a.ok) throw new Error(p.error || `HTTP ${a.status}`);
        const v = p.imap || {}, E = p.smtp || {}, A = p.sent;
        L.value = !!v.ok && !!E.ok && (!A || A.ok);
        const I = [
          `收信 IMAP：${v.ok ? `✓ 登录成功${v.messages != null ? ` · 收件箱 ${v.messages} 封` : ""}` : `✗ ${v.error || "失败"}`}`,
          `发信 SMTP：${E.ok ? "✓ 登录成功" : `✗ ${E.error || "失败"}`}`
        ];
        A && I.push(`测试邮件：${A.ok ? `✓ 已发送至 ${A.to}` : `✗ ${A.error || "发送失败"}`}`), k.value = I.join("　·　");
      } catch (a) {
        L.value = !1, k.value = a?.message || "测试失败";
      } finally {
        $.value = !1;
      }
    }
    async function u() {
      try {
        const [j, a] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (j.ok && Object.assign(t, (await j.json()).values || {}), a.ok) {
          const p = await a.json();
          d.value = Array.isArray(p.models) ? p.models.map((v) => ({ id: v.id, provider: v.provider || "custom", supports_thinking: v.supports_thinking })).filter((v) => v.id) : [], m.value = d.value.map((v) => v.id), y.value = "mocr 当前模型目录（由 Core 同步）";
        }
      } catch {
        g.value = "无法读取 LIFE 设置或模型目录";
      }
    }
    async function V() {
      b.value = !0, g.value = "";
      try {
        const j = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: t }) });
        if (!j.ok) throw new Error(String(j.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: t.screen_watch, computer_use: t.computer_use, report_agent_host: t.report_agent_host }) }), g.value = "已保存，LIFE 会在下一次设置轮询时应用。";
      } catch {
        g.value = "保存失败";
      } finally {
        b.value = !1;
      }
    }
    return se(u), (j, a) => (n(), i("section", et, [
      e("header", tt, [
        a[28] || (a[28] = e("div", { class: "ls-hero-main" }, [
          e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS"),
          e("h2", null, "L.I.F.E 专属设置"),
          e("p", { class: "ls-sub" }, "敏感功能默认关闭；凭据仅保存在本机 Core settings 文件。")
        ], -1)),
        e("button", {
          class: "ls-save",
          disabled: b.value,
          onClick: V
        }, [
          a[27] || (a[27] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          Q(o(b.value ? "保存中…" : "保存"), 1)
        ], 8, st)
      ]),
      e("div", lt, [
        e("article", ot, [
          a[34] || (a[34] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-1" }, "◉"),
            e("h3", null, "Agent 主机权限")
          ], -1)),
          e("label", nt, [
            T(e("input", {
              "onUpdate:modelValue": a[0] || (a[0] = (p) => t.screen_watch = p),
              type: "checkbox"
            }, null, 512), [
              [ee, t.screen_watch]
            ]),
            a[29] || (a[29] = e("span", { class: "ls-track" }, null, -1)),
            a[30] || (a[30] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许屏幕观察"),
              e("small", null, "读取当前屏幕内容")
            ], -1))
          ]),
          e("label", at, [
            T(e("input", {
              "onUpdate:modelValue": a[1] || (a[1] = (p) => t.computer_use = p),
              type: "checkbox"
            }, null, 512), [
              [ee, t.computer_use]
            ]),
            a[31] || (a[31] = e("span", { class: "ls-track" }, null, -1)),
            a[32] || (a[32] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许计算机操作"),
              e("small", null, "执行鼠标/键盘操作")
            ], -1))
          ]),
          e("label", it, [
            a[33] || (a[33] = e("span", null, "指定 Agent 主机（可选）", -1)),
            T(e("input", {
              "onUpdate:modelValue": a[2] || (a[2] = (p) => t.report_agent_host = p),
              placeholder: "hostname 或地址"
            }, null, 512), [
              [D, t.report_agent_host]
            ])
          ])
        ]),
        e("article", rt, [
          a[35] || (a[35] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-2" }, "✦"),
            e("h3", null, "THINK / OUTPUT 模型")
          ], -1)),
          e("p", ut, o(y.value || "正在读取 mocr 模型目录…"), 1),
          a[36] || (a[36] = e("p", { class: "ls-label" }, "THINK · 内部思考、记忆与工具规划", -1)),
          e("div", dt, [
            (n(!0), i(N, null, B(d.value, (p) => (n(), i("button", {
              key: "think-" + p.id,
              type: "button",
              class: H(["ls-model", { selected: t.think_model === p.id }]),
              onClick: (v) => t.think_model = p.id
            }, [
              e("b", null, o(p.id), 1),
              e("span", null, o(p.provider) + " · " + o(p.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, ct))), 128)),
            d.value.length ? w("", !0) : (n(), i("span", pt, "暂无模型"))
          ]),
          a[37] || (a[37] = e("p", { class: "ls-label" }, "OUTPUT · 最终人格化回复", -1)),
          e("div", vt, [
            (n(!0), i(N, null, B(d.value, (p) => (n(), i("button", {
              key: "output-" + p.id,
              type: "button",
              class: H(["ls-model", { selected: t.output_model === p.id }]),
              onClick: (v) => t.output_model = p.id
            }, [
              e("b", null, o(p.id), 1),
              e("span", null, o(p.provider) + " · output", 1)
            ], 10, _t))), 128)),
            d.value.length ? w("", !0) : (n(), i("span", ht, "暂无模型"))
          ])
        ]),
        e("article", mt, [
          a[53] || (a[53] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-3" }, "✉"),
            e("h3", null, "邮件收发")
          ], -1)),
          a[54] || (a[54] = e("p", { class: "ls-note" }, [
            Q("收信走 IMAP，发信走 SMTP；密码仅保存在本机 Core settings 文件。可填 "),
            e("code", null, "mailbox.json"),
            Q(" 做离线收信。")
          ], -1)),
          a[55] || (a[55] = e("p", { class: "ls-label" }, "收信 · IMAP", -1)),
          e("div", gt, [
            e("label", bt, [
              a[38] || (a[38] = e("span", null, "IMAP 主机", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[3] || (a[3] = (p) => t.mail_imap_host = p),
                placeholder: "imap.example.com"
              }, null, 512), [
                [D, t.mail_imap_host]
              ])
            ]),
            e("label", yt, [
              a[39] || (a[39] = e("span", null, "端口", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[4] || (a[4] = (p) => t.mail_imap_port = p),
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
          e("div", kt, [
            e("label", ft, [
              a[40] || (a[40] = e("span", null, "用户名", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[5] || (a[5] = (p) => t.mail_imap_user = p),
                placeholder: "user@example.com"
              }, null, 512), [
                [D, t.mail_imap_user]
              ])
            ]),
            e("label", $t, [
              a[41] || (a[41] = e("span", null, "密码 / 应用专用密码", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[6] || (a[6] = (p) => t.mail_imap_password = p),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [D, t.mail_imap_password]
              ])
            ])
          ]),
          a[56] || (a[56] = e("p", { class: "ls-label" }, "发信 · SMTP", -1)),
          e("div", wt, [
            e("label", xt, [
              a[42] || (a[42] = e("span", null, "SMTP 主机", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[7] || (a[7] = (p) => t.mail_smtp_host = p),
                placeholder: "smtp.example.com"
              }, null, 512), [
                [D, t.mail_smtp_host]
              ])
            ]),
            e("label", Ct, [
              a[43] || (a[43] = e("span", null, "端口", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[8] || (a[8] = (p) => t.mail_smtp_port = p),
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
          e("div", St, [
            e("label", Pt, [
              a[44] || (a[44] = e("span", null, "用户名", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[9] || (a[9] = (p) => t.mail_smtp_user = p),
                placeholder: "user@example.com"
              }, null, 512), [
                [D, t.mail_smtp_user]
              ])
            ]),
            e("label", Tt, [
              a[45] || (a[45] = e("span", null, "密码 / 应用专用密码", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[10] || (a[10] = (p) => t.mail_smtp_password = p),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [D, t.mail_smtp_password]
              ])
            ])
          ]),
          e("div", Ut, [
            e("label", Mt, [
              a[46] || (a[46] = e("span", null, "发件人地址（可选）", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[11] || (a[11] = (p) => t.mail_from = p),
                placeholder: "留空用 SMTP 用户名"
              }, null, 512), [
                [D, t.mail_from]
              ])
            ]),
            e("label", Vt, [
              a[47] || (a[47] = e("span", null, "发件人昵称（可选）", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[12] || (a[12] = (p) => t.mail_from_name = p),
                placeholder: "默认 0KAY"
              }, null, 512), [
                [D, t.mail_from_name]
              ])
            ])
          ]),
          e("label", Et, [
            a[48] || (a[48] = e("span", null, "离线邮箱 JSON（可选）", -1)),
            T(e("input", {
              "onUpdate:modelValue": a[13] || (a[13] = (p) => t.mail_mailbox_path = p),
              placeholder: "mailbox.json"
            }, null, 512), [
              [D, t.mail_mailbox_path]
            ])
          ]),
          e("label", At, [
            T(e("input", {
              "onUpdate:modelValue": a[14] || (a[14] = (p) => t.mail_auto_approve_all = p),
              type: "checkbox"
            }, null, 512), [
              [ee, t.mail_auto_approve_all]
            ]),
            a[49] || (a[49] = e("span", { class: "ls-track" }, null, -1)),
            a[50] || (a[50] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "全部自动审批"),
              e("small", null, "所有需确认的权限直接通过，不再弹窗询问")
            ], -1))
          ]),
          e("label", Ot, [
            T(e("input", {
              "onUpdate:modelValue": a[15] || (a[15] = (p) => t.mail_require_approval = p),
              type: "checkbox"
            }, null, 512), [
              [ee, t.mail_require_approval]
            ]),
            a[51] || (a[51] = e("span", { class: "ls-track" }, null, -1)),
            a[52] || (a[52] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "邮件操作需弹窗确认"),
              e("small", null, "读取 / 发送邮件前先在 WebUI 询问你")
            ], -1))
          ]),
          e("div", zt, [
            e("button", {
              type: "button",
              class: "ls-test",
              disabled: $.value,
              onClick: a[16] || (a[16] = (p) => _(!1))
            }, o($.value ? "测试中…" : "测试连接"), 9, Lt),
            e("button", {
              type: "button",
              class: "ls-test",
              disabled: $.value,
              onClick: a[17] || (a[17] = (p) => _(!0))
            }, "发送测试邮件", 8, It)
          ]),
          k.value ? (n(), i("p", {
            key: 0,
            class: H(["ls-mail-result", L.value ? "ok" : "bad"])
          }, o(k.value), 3)) : w("", !0)
        ]),
        e("article", Dt, [
          a[59] || (a[59] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", jt, [
            T(e("input", {
              "onUpdate:modelValue": a[18] || (a[18] = (p) => t.mcp_enabled = p),
              type: "checkbox"
            }, null, 512), [
              [ee, t.mcp_enabled]
            ]),
            a[57] || (a[57] = e("span", { class: "ls-track" }, null, -1)),
            a[58] || (a[58] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许调用 MCP 工具"),
              e("small", null, "服务清单在 Agent 设置中维护")
            ], -1))
          ])
        ]),
        e("article", Ft, [
          a[70] || (a[70] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-5" }, "☷"),
            e("h3", null, "OneBot v11 与主动行为")
          ], -1)),
          e("div", Nt, [
            e("label", Kt, [
              T(e("input", {
                "onUpdate:modelValue": a[19] || (a[19] = (p) => t.onebot_enabled = p),
                type: "checkbox"
              }, null, 512), [
                [ee, t.onebot_enabled]
              ]),
              a[60] || (a[60] = e("span", { class: "ls-track" }, null, -1)),
              a[61] || (a[61] = e("span", { class: "ls-switch-text" }, [
                e("b", null, "启用 OneBot")
              ], -1))
            ]),
            e("label", Rt, [
              T(e("input", {
                "onUpdate:modelValue": a[20] || (a[20] = (p) => t.onebot_observe_group = p),
                type: "checkbox"
              }, null, 512), [
                [ee, t.onebot_observe_group]
              ]),
              a[62] || (a[62] = e("span", { class: "ls-track" }, null, -1)),
              a[63] || (a[63] = e("span", { class: "ls-switch-text" }, [
                e("b", null, "仅观察群聊"),
                e("small", null, "未触发时不回复")
              ], -1))
            ])
          ]),
          e("div", Ht, [
            e("label", Bt, [
              a[64] || (a[64] = e("span", null, "WebSocket 地址", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[21] || (a[21] = (p) => t.onebot_ws_url = p),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [D, t.onebot_ws_url]
              ])
            ]),
            e("label", Jt, [
              a[65] || (a[65] = e("span", null, "HTTP API 地址", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[22] || (a[22] = (p) => t.onebot_http_url = p),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [D, t.onebot_http_url]
              ])
            ])
          ]),
          e("div", Wt, [
            e("label", qt, [
              a[66] || (a[66] = e("span", null, "Access Token", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[23] || (a[23] = (p) => t.onebot_access_token = p),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [D, t.onebot_access_token]
              ])
            ]),
            e("label", Yt, [
              a[67] || (a[67] = e("span", null, "触发关键词（逗号分隔，留空=全部）", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[24] || (a[24] = (p) => t.onebot_trigger_keywords = p),
                placeholder: "bot,在吗"
              }, null, 512), [
                [D, t.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", Gt, [
            e("label", Qt, [
              a[68] || (a[68] = e("span", null, "每日主动上限", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[25] || (a[25] = (p) => t.proactive_daily_limit = p),
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
            e("label", Xt, [
              a[69] || (a[69] = e("span", null, "单目标上限", -1)),
              T(e("input", {
                "onUpdate:modelValue": a[26] || (a[26] = (p) => t.proactive_target_limit = p),
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
      g.value ? (n(), i("p", Zt, o(g.value), 1)) : w("", !0)
    ]));
  }
}), ts = /* @__PURE__ */ re(es, [["__scopeId", "data-v-537538f7"]]), ss = { class: "content-card about" }, ls = { class: "identity" }, os = { class: "app-id" }, ns = { class: "ver-badge" }, as = { class: "app-desc" }, is = { class: "identity-actions" }, rs = ["href"], us = { class: "section" }, ds = { class: "section-head" }, cs = ["disabled"], ps = {
  key: 0,
  class: "alert",
  role: "alert"
}, vs = {
  class: "us-hero-icon",
  "aria-hidden": "true"
}, _s = {
  key: 0,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, hs = {
  key: 1,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, ms = {
  key: 2,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, gs = { class: "us-hero-text" }, bs = { key: 0 }, ys = { key: 1 }, ks = { class: "us-hero-actions" }, fs = ["disabled"], $s = ["disabled", "title"], ws = ["href"], xs = {
  key: 2,
  class: "us-notes"
}, Cs = { class: "us-notes-title" }, Ss = { class: "us-notes-body" }, Ps = {
  key: 3,
  class: "alert",
  role: "alert"
}, Ts = { class: "us-apply-head" }, Us = { key: 0 }, Ms = { key: 1 }, Vs = {
  key: 0,
  class: "us-chip-tag"
}, Es = { class: "us-apply-label" }, As = {
  key: 0,
  class: "us-apply-error"
}, Os = {
  key: 1,
  class: "us-apply-log"
}, zs = { class: "section" }, Ls = { class: "section-title" }, Is = { class: "credits" }, Ds = ["href"], js = ["src", "alt"], Fs = { class: "person-info" }, Ns = { class: "name" }, Ks = { class: "role" }, Rs = ["src"], Hs = { class: "person-info" }, Bs = { class: "role" }, Js = { class: "section-head contributors-head" }, Ws = { class: "section-title" }, qs = { class: "muted" }, Ys = {
  key: 0,
  class: "contribs"
}, Gs = ["href"], Qs = ["src", "alt"], Xs = { class: "login" }, Zs = {
  key: 0,
  class: "count"
}, el = {
  key: 1,
  class: "muted"
}, tl = ["href"], sl = { class: "foot" }, ll = ["href"], Ce = "https://github.com/RazureSOFT/0KAY", ol = "https://github.com/RazureSOFT", nl = /* @__PURE__ */ X({
  __name: "AboutPanel",
  setup(R) {
    const { t } = le(), g = f("0.1.2"), b = f([]), m = f(""), y = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, d = (x, U = 96) => `https://github.com/${x}.png?size=${U}`, $ = f(!1), k = f(null), L = f(""), M = f(null), _ = f("");
    let u = null;
    function V(x) {
      return M.value?.status === "running" && M.value.plugin === x;
    }
    async function j(x, U) {
      if (M.value?.status !== "running") {
        _.value = "";
        try {
          M.value = await be("/api/plugins/pm/update", { plugin: x, version: U || "" }), p();
        } catch (K) {
          _.value = K instanceof Error ? K.message : String(K);
        }
      }
    }
    async function a() {
      try {
        M.value = await ne("/api/plugins/pm/status");
      } catch {
        return;
      }
      M.value && M.value.status !== "running" && (v(), I());
    }
    function p() {
      u || (u = setInterval(a, 2e3));
    }
    function v() {
      u && (clearInterval(u), u = null);
    }
    const E = J(() => {
      switch (M.value?.status) {
        case "running":
          return t("settings.about.updating");
        case "done":
          return t("settings.about.updated");
        case "failed":
          return t("settings.about.updateFailed");
        default:
          return "";
      }
    }), A = J(() => k.value ? k.value.has_update ? "warn" : k.value.latest ? "ok" : "none" : "none");
    async function I() {
      $.value = !0, L.value = "";
      try {
        const x = await ne("/api/plugins/pm/check");
        k.value = x, x?.current && (g.value = String(x.current));
      } catch (x) {
        L.value = x instanceof ze && x.status === 404 ? t("settings.about.unsupported") : x instanceof Error ? x.message : String(x);
      } finally {
        $.value = !1;
      }
    }
    async function W() {
      try {
        const x = { Accept: "application/vnd.github+json" }, [U, K] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: x }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: x })
        ]);
        if (!U.ok) throw new Error(`HTTP ${U.status}`);
        const q = /* @__PURE__ */ new Map(), Y = await U.json();
        for (const O of Array.isArray(Y) ? Y : [])
          O?.login && q.set(O.login, O);
        if (K.ok) {
          const O = await K.json();
          for (const S of Array.isArray(O) ? O : []) {
            const C = S?.author;
            !C?.login || C.login.endsWith("[bot]") || q.has(C.login) || q.set(C.login, {
              login: C.login,
              avatar_url: C.avatar_url,
              html_url: C.html_url,
              contributions: 0
            });
          }
        }
        b.value = [...q.values()].sort(
          (O, S) => (S.contributions || 0) - (O.contributions || 0) || O.login.localeCompare(S.login)
        );
      } catch (x) {
        m.value = x instanceof Error ? x.message : String(x), b.value = [];
      }
    }
    return se(() => {
      I(), W(), ne("/api/plugins/pm/status").then((x) => {
        M.value = x, x?.status === "running" && p();
      }).catch(() => {
      });
    }), Se(v), (x, U) => (n(), i("div", ss, [
      e("header", ls, [
        U[3] || (U[3] = e("div", {
          class: "app-icon",
          "aria-hidden": "true"
        }, "0K", -1)),
        e("div", os, [
          e("h2", null, [
            U[2] || (U[2] = Q("0KAY ", -1)),
            e("span", ns, "v" + o(g.value), 1)
          ]),
          e("p", as, o(l(t)("settings.about.description")), 1)
        ]),
        e("div", is, [
          e("a", {
            class: "btn btn-tonal sm",
            href: Ce,
            target: "_blank",
            rel: "noopener noreferrer"
          }, o(l(t)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${Ce}/releases`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "Releases ↗", 8, rs)
        ])
      ]),
      e("section", us, [
        e("div", ds, [
          U[4] || (U[4] = e("h3", { class: "section-title" }, "0KAY", -1)),
          e("button", {
            class: "btn btn-tonal sm",
            disabled: $.value,
            onClick: I
          }, o(l(t)($.value ? "settings.about.checking" : "settings.about.check")), 9, cs)
        ]),
        L.value ? (n(), i("p", ps, o(L.value), 1)) : (n(), i("div", {
          key: 1,
          class: H(["us-hero", A.value])
        }, [
          e("div", vs, [
            A.value === "ok" ? (n(), i("svg", _s, [...U[5] || (U[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : A.value === "warn" ? (n(), i("svg", hs, [...U[6] || (U[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (n(), i("svg", ms, [...U[7] || (U[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", gs, [
            e("b", null, o(l(t)(A.value === "warn" ? "settings.about.available" : A.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            k.value?.latest ? (n(), i("span", bs, [
              Q("v" + o(k.value.current) + " → ", 1),
              e("em", null, "v" + o(k.value.latest), 1)
            ])) : (n(), i("span", ys, "0KAY v" + o(k.value?.current || g.value), 1))
          ]),
          e("div", ks, [
            k.value?.has_update ? (n(), i("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: V("core"),
              onClick: U[0] || (U[0] = (K) => j("core", k.value.latest))
            }, o(V("core") ? l(t)("settings.about.updating") : l(t)("settings.about.updateNow")), 9, fs)) : w("", !0),
            k.value?.source_available !== !1 ? (n(), i("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: V("core"),
              title: l(t)("settings.about.betaHint"),
              onClick: U[1] || (U[1] = (K) => j("core"))
            }, o(V("core") ? l(t)("settings.about.updating") : l(t)("settings.about.beta")), 9, $s)) : w("", !0),
            k.value?.url ? (n(), i("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: k.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, ws)) : w("", !0)
          ])
        ], 2)),
        k.value?.notes ? (n(), i("div", xs, [
          e("p", Cs, o(l(t)("settings.about.whatsNew")), 1),
          e("pre", Ss, o(k.value.notes), 1)
        ])) : w("", !0),
        _.value ? (n(), i("p", Ps, o(_.value), 1)) : w("", !0),
        M.value && M.value.status !== "idle" ? (n(), i("div", {
          key: 4,
          class: H(["us-apply-banner", M.value.status])
        }, [
          e("div", Ts, [
            U[8] || (U[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Q(o(M.value.package), 1),
              M.value.version ? (n(), i("span", Us, "@" + o(M.value.version), 1)) : (n(), i("span", Ms, " · main"))
            ]),
            M.value.mode === "source" ? (n(), i("span", Vs, o(l(t)("settings.about.sourceMode")), 1)) : w("", !0),
            e("span", Es, o(E.value), 1)
          ]),
          M.value.error ? (n(), i("p", As, o(M.value.error), 1)) : w("", !0),
          M.value.log ? (n(), i("pre", Os, o(M.value.log), 1)) : w("", !0)
        ], 2)) : w("", !0)
      ]),
      e("section", zs, [
        e("h3", Ls, o(l(t)("settings.about.developerTitle")) + " & " + o(l(t)("settings.about.teamTitle")), 1),
        e("div", Is, [
          e("a", {
            class: "person",
            href: y.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: y.avatar,
              alt: y.login,
              loading: "lazy"
            }, null, 8, js),
            e("div", Fs, [
              e("span", Ns, o(y.login), 1),
              e("span", Ks, o(l(t)("settings.about.developerTitle")), 1)
            ]),
            U[9] || (U[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, Ds),
          e("a", {
            class: "person",
            href: ol,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: d("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, Rs),
            e("div", Hs, [
              U[10] || (U[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", Bs, o(l(t)("settings.about.teamTitle")), 1)
            ]),
            U[11] || (U[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", Js, [
          e("h3", Ws, o(l(t)("settings.about.contributorsTitle")), 1),
          e("span", qs, o(l(t)("settings.about.contributorsFrom")), 1)
        ]),
        b.value.length ? (n(), i("div", Ys, [
          (n(!0), i(N, null, B(b.value, (K) => (n(), i("a", {
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
            }, null, 8, Qs),
            e("span", Xs, o(K.login), 1),
            K.contributions ? (n(), i("span", Zs, o(K.contributions), 1)) : w("", !0)
          ], 8, Gs))), 128))
        ])) : (n(), i("p", el, [
          e("a", {
            class: "repo-link",
            href: y.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "razureink ↗", 8, tl)
        ]))
      ]),
      e("footer", sl, [
        U[12] || (U[12] = e("span", { class: "status-chip" }, "MIT", -1)),
        U[13] || (U[13] = e("span", null, "© 2026 RazureSOFT", -1)),
        e("a", {
          class: "repo-link",
          href: `${Ce}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, ll)
      ])
    ]));
  }
}), al = /* @__PURE__ */ re(nl, [["__scopeId", "data-v-f0cbac94"]]), il = { class: "content-card updates" }, rl = { class: "us-block" }, ul = { class: "us-head" }, dl = { class: "us-head-text" }, cl = { class: "us-title" }, pl = { class: "us-desc" }, vl = { class: "us-source" }, _l = { class: "us-input-group" }, hl = ["disabled", "placeholder"], ml = ["disabled"], gl = { class: "us-chips" }, bl = ["disabled"], yl = ["disabled"], kl = {
  key: 0,
  class: "us-saved"
}, fl = { class: "helper-text" }, $l = {
  key: 0,
  class: "alert"
}, wl = { class: "us-block" }, xl = { class: "us-head" }, Cl = { class: "us-head-text" }, Sl = { class: "us-title" }, Pl = { class: "us-desc" }, Tl = { class: "us-head-actions" }, Ul = ["disabled"], Ml = {
  key: 0,
  class: "alert",
  role: "alert"
}, Vl = { class: "us-apply-head" }, El = { key: 0 }, Al = { key: 1 }, Ol = {
  key: 0,
  class: "us-chip-tag"
}, zl = { class: "us-apply-label" }, Ll = {
  key: 0,
  class: "us-apply-error"
}, Il = {
  key: 1,
  class: "us-apply-log"
}, Dl = {
  key: 2,
  class: "alert",
  role: "alert"
}, jl = {
  key: 3,
  class: "us-table"
}, Fl = { class: "us-name" }, Nl = { class: "us-ver" }, Kl = { class: "us-actions" }, Rl = ["disabled", "onClick"], Hl = ["disabled", "onClick"], Bl = ["href", "title"], Jl = {
  key: 0,
  class: "us-empty"
}, Wl = /* @__PURE__ */ X({
  __name: "UpdatesPanel",
  setup(R) {
    const { t } = le(), g = f(!1), b = f(null), m = f(""), y = f(null), d = f("");
    let $ = null;
    const k = f(""), L = f(""), M = f(!1), _ = f(!1), u = f(!1), V = f(""), j = J(() => k.value.trim() !== L.value), a = J(() => k.value.trim() !== "");
    function p(O) {
      return y.value?.status === "running" && y.value.plugin === O;
    }
    async function v(O, S) {
      if (y.value?.status !== "running") {
        d.value = "";
        try {
          y.value = await be("/api/plugins/pm/update", { plugin: O, version: S || "" }), A();
        } catch (C) {
          d.value = C instanceof Error ? C.message : String(C);
        }
      }
    }
    async function E() {
      try {
        y.value = await ne("/api/plugins/pm/status");
      } catch {
        return;
      }
      y.value && y.value.status !== "running" && (I(), U());
    }
    function A() {
      $ || ($ = setInterval(E, 2e3));
    }
    function I() {
      $ && (clearInterval($), $ = null);
    }
    const W = J(() => {
      switch (y.value?.status) {
        case "running":
          return t("settings.about.updating");
        case "done":
          return t("settings.about.updated");
        case "failed":
          return t("settings.about.updateFailed");
        default:
          return "";
      }
    }), x = J(() => (b.value || []).filter((O) => O.has_update).length);
    async function U() {
      g.value = !0, m.value = "";
      try {
        const O = await ne("/api/plugins/pm/check-plugins");
        b.value = O.plugins || [];
      } catch (O) {
        m.value = O instanceof ze && O.status === 404 ? t("settings.about.unsupported") : O instanceof Error ? O.message : String(O);
      } finally {
        g.value = !1;
      }
    }
    async function K() {
      M.value = !0, V.value = "";
      try {
        const O = await ne("/api/settings/updates"), S = String(O?.values?.github_proxy ?? "");
        k.value = S, L.value = S;
      } catch {
      } finally {
        M.value = !1;
      }
    }
    async function q() {
      _.value = !0, V.value = "";
      try {
        const O = k.value.trim();
        await be("/api/settings/updates", { values: { github_proxy: O } }), L.value = O, u.value = !0, setTimeout(() => {
          u.value = !1;
        }, 1500);
      } catch (O) {
        V.value = O instanceof Error ? O.message : String(O);
      } finally {
        _.value = !1;
      }
    }
    function Y(O) {
      k.value = O, q();
    }
    return se(() => {
      U(), K(), ne("/api/plugins/pm/status").then((O) => {
        y.value = O, O?.status === "running" && A();
      }).catch(() => {
      });
    }), Se(I), (O, S) => (n(), i("div", il, [
      e("section", rl, [
        e("header", ul, [
          S[3] || (S[3] = e("span", {
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
          e("div", dl, [
            e("h3", cl, o(l(t)("settings.pluginSourceTitle")), 1),
            e("p", pl, o(l(t)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: H(["us-tag", { on: a.value }])
          }, o(a.value ? "ghproxy" : l(t)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", vl, [
          e("div", _l, [
            S[4] || (S[4] = e("span", {
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
            T(e("input", {
              "onUpdate:modelValue": S[0] || (S[0] = (C) => k.value = C),
              class: "us-input",
              type: "text",
              disabled: M.value,
              placeholder: l(t)("settings.pluginSourcePlaceholder"),
              onKeyup: Fe(q, ["enter"])
            }, null, 40, hl), [
              [D, k.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: _.value || !j.value,
              onClick: q
            }, o(l(t)("settings.save")), 9, ml)
          ]),
          e("div", gl, [
            e("button", {
              type: "button",
              class: H(["us-chip", { active: !a.value }]),
              disabled: _.value,
              onClick: S[1] || (S[1] = (C) => Y(""))
            }, o(l(t)("settings.pluginSourceDirect")), 11, bl),
            e("button", {
              type: "button",
              class: H(["us-chip", { active: k.value.trim() === "https://gh-proxy.com" }]),
              disabled: _.value,
              onClick: S[2] || (S[2] = (C) => Y("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, yl),
            u.value ? (n(), i("span", kl, o(l(t)("settings.saved")), 1)) : w("", !0)
          ]),
          e("p", fl, o(l(t)("settings.pluginSourceHelp")), 1),
          V.value ? (n(), i("p", $l, o(V.value), 1)) : w("", !0)
        ])
      ]),
      S[10] || (S[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", wl, [
        e("header", xl, [
          S[5] || (S[5] = Ne('<span class="us-ico" aria-hidden="true" data-v-6bbe694b><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-6bbe694b><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect></svg></span>', 1)),
          e("div", Cl, [
            e("h3", Sl, o(l(t)("settings.about.plugins")), 1),
            e("p", Pl, o(l(t)("settings.about.updateHint")), 1)
          ]),
          e("div", Tl, [
            e("span", {
              class: H(["us-count", { warn: x.value > 0 }])
            }, o(x.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: g.value,
              onClick: U
            }, o(l(t)(g.value ? "settings.about.checking" : "settings.about.check")), 9, Ul)
          ])
        ]),
        d.value ? (n(), i("p", Ml, o(d.value), 1)) : w("", !0),
        y.value && y.value.status !== "idle" ? (n(), i("div", {
          key: 1,
          class: H(["us-apply-banner", y.value.status])
        }, [
          e("div", Vl, [
            S[6] || (S[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Q(o(y.value.package), 1),
              y.value.version ? (n(), i("span", El, "@" + o(y.value.version), 1)) : (n(), i("span", Al, " · main"))
            ]),
            y.value.mode === "source" ? (n(), i("span", Ol, o(l(t)("settings.about.sourceMode")), 1)) : w("", !0),
            e("span", zl, o(W.value), 1)
          ]),
          y.value.error ? (n(), i("p", Ll, o(y.value.error), 1)) : w("", !0),
          y.value.log ? (n(), i("pre", Il, o(y.value.log), 1)) : w("", !0)
        ], 2)) : w("", !0),
        m.value ? (n(), i("p", Dl, o(m.value), 1)) : w("", !0),
        b.value ? (n(), i("div", jl, [
          S[8] || (S[8] = e("div", { class: "us-row us-thead" }, [
            e("span", null, "Plugin"),
            e("span", null, "Version"),
            e("span", null, "Status"),
            e("span")
          ], -1)),
          (n(!0), i(N, null, B(b.value, (C) => (n(), i("div", {
            key: C.name,
            class: "us-row"
          }, [
            e("span", Fl, [
              e("span", {
                class: H(["us-dot", C.error ? "bad" : C.has_update ? "warn" : C.latest ? "ok" : ""])
              }, null, 2),
              Q(" " + o(C.name), 1)
            ]),
            e("span", Nl, [
              e("em", null, "v" + o(C.version || "—"), 1),
              S[7] || (S[7] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: H({ good: !!C.latest })
              }, o(C.latest ? `v${C.latest}` : "—"), 3)
            ]),
            e("span", {
              class: H(["us-status", C.error ? "bad" : C.has_update ? "warn" : C.latest ? "ok" : ""])
            }, o(C.error || l(t)(C.has_update ? "settings.about.available" : C.latest ? "settings.about.latest" : "settings.about.noRelease")), 3),
            e("span", Kl, [
              C.can_update && C.has_update ? (n(), i("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: p(C.name),
                onClick: (ue) => v(C.name, C.latest)
              }, o(p(C.name) ? l(t)("settings.about.updating") : l(t)("settings.about.updateNow")), 9, Rl)) : C.can_update ? (n(), i("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: p(C.name),
                onClick: (ue) => v(C.name)
              }, o(p(C.name) ? l(t)("settings.about.updating") : l(t)("settings.about.syncNow")), 9, Hl)) : w("", !0),
              C.repository ? (n(), i("a", {
                key: 2,
                class: "us-repo",
                href: C.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: C.repository
              }, "Repo ↗", 8, Bl)) : w("", !0)
            ])
          ]))), 128)),
          b.value.length ? w("", !0) : (n(), i("p", Jl, o(l(t)("settings.about.noPlugins")), 1))
        ])) : w("", !0),
        S[9] || (S[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), ql = /* @__PURE__ */ re(Wl, [["__scopeId", "data-v-6bbe694b"]]), Yl = { class: "content-card provider-panel" }, Gl = { class: "pp-editor-head" }, Ql = ["aria-label"], Xl = { class: "pp-editor-title" }, Zl = { class: "card-desc" }, eo = { class: "pp-section" }, to = { class: "pp-section-title" }, so = { class: "pp-grid" }, lo = { class: "field" }, oo = { class: "field" }, no = {
  key: 0,
  class: "pp-req"
}, ao = ["placeholder"], io = { class: "field pp-span" }, ro = ["placeholder"], uo = { class: "field" }, co = { class: "helper-text" }, po = { class: "field" }, vo = { class: "helper-text" }, _o = { class: "pp-section" }, ho = { class: "pp-section-head" }, mo = { class: "pp-section-title" }, go = ["disabled"], bo = { class: "field" }, yo = { class: "pp-key" }, ko = ["type", "placeholder"], fo = {
  key: 0,
  class: "helper-text"
}, $o = {
  key: 1,
  class: "pp-probe err"
}, wo = {
  key: 2,
  class: "pp-probe ok"
}, xo = { class: "pp-section" }, Co = { class: "pp-section-head" }, So = { class: "pp-section-title" }, Po = { class: "pp-count" }, To = ["disabled"], Uo = {
  key: 0,
  class: "pp-discovered"
}, Mo = { class: "pp-model-tools" }, Vo = ["placeholder"], Eo = {
  key: 1,
  class: "pp-models"
}, Ao = ["title"], Oo = ["value", "onChange"], zo = ["value"], Lo = ["title", "disabled", "onClick"], Io = ["title"], Do = ["checked", "onChange"], jo = {
  key: 0,
  class: "helper-text"
}, Fo = {
  key: 2,
  class: "helper-text"
}, No = {
  key: 0,
  class: "pp-error",
  role: "alert"
}, Ko = { class: "pp-editor-actions" }, Ro = ["disabled"], Ho = { class: "pp-list-head" }, Bo = { class: "card-desc" }, Jo = { class: "pp-list-actions" }, Wo = {
  key: 0,
  class: "pp-cards"
}, qo = { class: "pp-card-head" }, Yo = { class: "pp-logo" }, Go = ["src", "alt"], Qo = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, Xo = { class: "pp-card-id" }, Zo = ["title"], en = { class: "pp-card-badges" }, tn = {
  key: 0,
  class: "pp-badge primary"
}, sn = { class: "pp-badge" }, ln = { class: "pp-card-status" }, on = {
  key: 0,
  class: "pp-meta"
}, nn = ["title"], an = { class: "pp-chips" }, rn = {
  key: 0,
  class: "pp-chip more"
}, un = {
  key: 1,
  class: "pp-chip empty"
}, dn = { class: "pp-card-actions" }, cn = ["onClick"], pn = ["disabled", "onClick"], vn = ["disabled", "onClick"], _n = ["onClick"], hn = ["onClick"], mn = {
  key: 1,
  class: "pp-empty"
}, gn = /* @__PURE__ */ X({
  __name: "ProviderPanel",
  setup(R) {
    const { t } = le(), { confirm: g } = Pe(), b = We(), m = f({}), y = f("list"), d = f(null), $ = f(""), k = f({ state: "idle" }), L = f([]), M = f(""), _ = f(!1), u = f(!1), V = f(!1);
    se(async () => {
      await b.fetchAll();
      for (const s of b.providers) K(s);
    });
    function j(s) {
      return xe.find((r) => r.id === s) || null;
    }
    function a(s) {
      return s.name && s.name.trim() ? s.name.trim() : j(s.provider)?.name || s.provider;
    }
    function p(s) {
      return j(s.provider)?.logo || "";
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
    function E(s) {
      return (d.value?.model_types || {})[s] || "chat";
    }
    function A(s, r) {
      if (!d.value) return;
      const c = { ...d.value.model_types || {} };
      !r || r === "chat" ? delete c[s] : c[s] = r, d.value.model_types = c;
    }
    function I(s) {
      const r = new Set(s.disabled_models || []);
      return s.models.filter((c) => !r.has(c));
    }
    function W(s) {
      return b.defaultProviderId === s.id;
    }
    function x(s) {
      const r = d.value;
      if (!r) return;
      const c = xe.find((z) => z.id === s);
      c?.baseUrl && !r.base_url && (r.base_url = c.baseUrl), r.format = c?.format || "";
    }
    async function U(s, r = "") {
      if (!s.base_url) return { state: "error", message: t("settings.baseUrlRequired") };
      const c = performance.now();
      try {
        const z = await fetch("/api/models/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: s.id,
            provider: s.provider,
            base_url: s.base_url,
            format: s.format || "",
            api_key: r || ""
          })
        });
        if (!z.ok) throw new Error(`HTTP ${z.status}`);
        const F = await z.json(), G = Math.round(performance.now() - c);
        return F.source === "api" && Array.isArray(F.models) && F.models.length ? { state: "ok", count: F.models.length, ms: G, models: F.models } : { state: "error", message: F.error || t("settings.connectionFailed"), ms: G };
      } catch (z) {
        return { state: "error", message: z instanceof Error ? z.message : String(z) };
      }
    }
    async function K(s, r = "") {
      m.value = { ...m.value, [s.id]: { state: "checking" } };
      const c = await U(s, r);
      m.value = { ...m.value, [s.id]: c };
    }
    function q() {
      for (const s of b.providers) K(s);
    }
    function Y() {
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
      }, $.value = "", k.value = { state: "idle" }, L.value = [], M.value = "", _.value = !1, u.value = !1, y.value = "edit";
    }
    function O(s) {
      d.value = {
        ...s,
        api_key: "",
        name: s.name || "",
        models: [...s.models],
        disabled_models: [...s.disabled_models || []],
        format: s.format || "",
        model_types: { ...s.model_types || {} }
      }, u.value = !!s.api_key_masked, $.value = "", k.value = { state: "idle" }, L.value = [], M.value = "", _.value = !1, y.value = "edit";
    }
    function S() {
      y.value = "list", d.value = null, $.value = "";
    }
    async function C() {
      const s = d.value;
      if (!s) return;
      $.value = "";
      const r = (s.name || "").trim();
      if (!s.base_url.trim()) {
        $.value = t("settings.baseUrlRequired");
        return;
      }
      if (s.provider === "custom" && !r) {
        $.value = t("settings.providerNameRequired");
        return;
      }
      if (!s.models.length) {
        $.value = t("settings.modelsRequired");
        return;
      }
      s.id || (s.id = `${s.provider}_${Date.now().toString(36)}`), s.name = r, s.disabled_models = (s.disabled_models || []).filter((c) => s.models.includes(c)), (!s.default_model || !s.models.includes(s.default_model) || s.disabled_models.includes(s.default_model)) && (s.default_model = I(s)[0] || s.models[0]), V.value = !0;
      try {
        await b.upsert({ ...s }), b.defaultProviderId || await b.setDefaults(s.id, s.default_model), S(), K(b.providers.find((c) => c.id === s.id) || s);
      } catch (c) {
        $.value = c instanceof Error ? c.message : String(c);
      } finally {
        V.value = !1;
      }
    }
    async function ue(s) {
      if (await g({
        title: t("settings.remove"),
        message: `${t("settings.remove")} ${a(s)}?`,
        confirmLabel: t("settings.remove"),
        danger: !0
      }))
        try {
          await b.remove(s.id);
        } catch {
        }
    }
    async function pe(s) {
      try {
        await b.upsert({ ...s, enabled: !s.enabled });
      } catch {
      }
    }
    async function ke(s) {
      const r = s.default_model || I(s)[0] || s.models[0] || "";
      try {
        await b.setDefaults(s.id, r);
      } catch {
      }
    }
    async function ve() {
      const s = d.value;
      if (!s) return;
      k.value = { state: "checking" };
      const r = await U(s, s.api_key);
      k.value = r, r.state === "ok" && r.models && (L.value = r.models);
    }
    function _e() {
      const s = d.value;
      !s || !L.value.length || (s.models = [...L.value], s.disabled_models = (s.disabled_models || []).filter((r) => s.models.includes(r)), s.models.includes(s.default_model) || (s.default_model = ""));
    }
    function he(s) {
      const r = d.value;
      if (!r) return;
      const c = new Set(r.disabled_models || []);
      c.has(s) ? c.delete(s) : c.add(s), r.disabled_models = [...c], c.has(r.default_model) && (r.default_model = I(r)[0] || "");
    }
    function fe(s) {
      const r = d.value;
      r && (r.default_model = s, r.disabled_models = (r.disabled_models || []).filter((c) => c !== s));
    }
    function oe(s) {
      const r = d.value;
      r && (r.disabled_models = s ? [] : [...r.models]);
    }
    function $e() {
      const s = d.value;
      if (!s) return;
      const r = new Set(s.disabled_models || []);
      s.disabled_models = s.models.filter((c) => !r.has(c));
    }
    const me = J(() => {
      const s = d.value?.models || [], r = M.value.trim().toLowerCase();
      return r ? s.filter((c) => c.toLowerCase().includes(r)) : s;
    }), we = J(() => d.value ? I(d.value).length : 0);
    function ge() {
      return t("settings.fetchedSummary", { n: L.value.length });
    }
    const P = J(() => [
      { value: "", label: t("settings.formatAuto") },
      { value: "openai", label: t("settings.formatOpenai") },
      { value: "anthropic", label: t("settings.formatAnthropic") }
    ]), h = J(
      () => xe.map((s) => ({ value: s.id, label: t(`providers.${s.id}.name`, s.name) }))
    );
    return (s, r) => (n(), i("div", Yl, [
      y.value === "edit" && d.value ? (n(), i(N, { key: 0 }, [
        e("div", Gl, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: S,
            "aria-label": l(t)("settings.back")
          }, [...r[11] || (r[11] = [
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
          ])], 8, Ql),
          e("div", Xl, [
            e("h2", null, o(d.value.id ? l(t)("settings.edit") : l(t)("settings.addProvider")), 1),
            e("p", Zl, o(l(t)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: H(["pp-status", k.value.state])
          }, [
            r[12] || (r[12] = e("span", { class: "pp-dot" }, null, -1)),
            Q(" " + o(k.value.state === "checking" ? l(t)("settings.testing") : k.value.state === "ok" ? l(t)("settings.connectionOk") : k.value.state === "error" ? l(t)("settings.connectionFailed") : l(t)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", eo, [
          e("h3", to, o(l(t)("settings.providerSectionBasic")), 1),
          e("div", so, [
            e("div", lo, [
              e("label", null, o(l(t)("wizard.provider")), 1),
              te(l(ie), {
                modelValue: d.value.provider,
                "onUpdate:modelValue": r[0] || (r[0] = (c) => d.value.provider = c),
                class: "input",
                "aria-label": l(t)("wizard.provider"),
                options: h.value,
                onChange: x
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", oo, [
              e("label", null, [
                Q(o(l(t)("settings.providerName")) + " ", 1),
                d.value.provider === "custom" ? (n(), i("span", no, "*")) : w("", !0)
              ]),
              T(e("input", {
                "onUpdate:modelValue": r[1] || (r[1] = (c) => d.value.name = c),
                placeholder: l(t)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, ao), [
                [D, d.value.name]
              ])
            ]),
            e("div", io, [
              e("label", null, o(l(t)("wizard.baseUrl")), 1),
              T(e("input", {
                "onUpdate:modelValue": r[2] || (r[2] = (c) => d.value.base_url = c),
                placeholder: l(t)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, ro), [
                [D, d.value.base_url]
              ])
            ]),
            e("div", uo, [
              e("label", null, o(l(t)("settings.apiFormat")), 1),
              te(l(ie), {
                modelValue: d.value.format,
                "onUpdate:modelValue": r[3] || (r[3] = (c) => d.value.format = c),
                class: "input",
                "aria-label": l(t)("settings.apiFormat"),
                options: P.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", co, o(l(t)("settings.apiFormatHint")), 1)
            ]),
            e("div", po, [
              e("label", null, o(l(t)("wizard.defaultModel")), 1),
              te(l(ie), {
                modelValue: d.value.default_model,
                "onUpdate:modelValue": r[4] || (r[4] = (c) => d.value.default_model = c),
                class: "input",
                "aria-label": l(t)("wizard.defaultModel"),
                options: I(d.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", vo, o(l(t)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", _o, [
          e("div", ho, [
            e("h3", mo, o(l(t)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: k.value.state === "checking",
              onClick: ve
            }, o(k.value.state === "checking" ? l(t)("settings.testing") : l(t)("settings.testConnection")), 9, go)
          ]),
          e("div", bo, [
            e("label", null, o(l(t)("wizard.apiKey")), 1),
            e("div", yo, [
              T(e("input", {
                "onUpdate:modelValue": r[5] || (r[5] = (c) => d.value.api_key = c),
                type: _.value ? "text" : "password",
                placeholder: u.value ? l(t)("settings.apiKeyKept") : l(t)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, ko), [
                [Ke, d.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: r[6] || (r[6] = (c) => _.value = !_.value)
              }, o(_.value ? l(t)("settings.hideKey") : l(t)("settings.showKey")), 1)
            ]),
            u.value ? (n(), i("p", fo, o(l(t)("settings.apiKeyKeptHint")), 1)) : w("", !0),
            k.value.state === "error" ? (n(), i("p", $o, o(k.value.message), 1)) : k.value.state === "ok" ? (n(), i("p", wo, o(l(t)("settings.connectionOk")) + " · " + o(ge()) + " · " + o(k.value.ms) + "ms ", 1)) : w("", !0)
          ])
        ]),
        e("section", xo, [
          e("div", Co, [
            e("h3", So, [
              Q(o(l(t)("settings.providerSectionModels")) + " ", 1),
              e("span", Po, o(we.value) + "/" + o(d.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: k.value.state === "checking",
              onClick: ve
            }, o(l(t)("settings.fetchModels")), 9, To)
          ]),
          L.value.length && L.value.join("\0") !== d.value.models.join("\0") ? (n(), i("div", Uo, [
            e("span", null, o(ge()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: _e
            }, o(l(t)("settings.applyFetched")), 1)
          ])) : w("", !0),
          e("div", Mo, [
            T(e("input", {
              "onUpdate:modelValue": r[7] || (r[7] = (c) => M.value = c),
              class: "input pp-search",
              placeholder: l(t)("settings.searchModels")
            }, null, 8, Vo), [
              [D, M.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: r[8] || (r[8] = (c) => oe(!0))
            }, o(l(t)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: r[9] || (r[9] = (c) => $e())
            }, o(l(t)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: r[10] || (r[10] = (c) => oe(!1))
            }, o(l(t)("settings.clearSelection")), 1)
          ]),
          d.value.models.length ? (n(), i("div", Eo, [
            (n(!0), i(N, null, B(me.value, (c) => (n(), i("div", {
              key: c,
              class: H(["pp-model", { off: (d.value.disabled_models || []).includes(c) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: c
              }, o(c), 9, Ao),
              e("select", {
                class: H(["pp-type", { tagged: E(c) !== "chat" }]),
                value: E(c),
                title: "模型类型",
                onChange: (z) => A(c, z.target.value)
              }, [
                (n(), i(N, null, B(v, (z) => e("option", {
                  key: z.value,
                  value: z.value
                }, o(z.label), 9, zo)), 64))
              ], 42, Oo),
              d.value.default_model !== c ? (n(), i("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: l(t)("settings.makeDefault"),
                disabled: (d.value.disabled_models || []).includes(c),
                onClick: (z) => fe(c)
              }, "☆", 8, Lo)) : (n(), i("span", {
                key: 1,
                class: "pp-star on",
                title: l(t)("wizard.defaultModel")
              }, "★", 8, Io)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(d.value.disabled_models || []).includes(c),
                onChange: (z) => he(c)
              }, null, 40, Do)
            ], 2))), 128)),
            me.value.length ? w("", !0) : (n(), i("p", jo, o(l(t)("settings.searchModels")), 1))
          ])) : (n(), i("p", Fo, o(l(t)("settings.noModelsYet")), 1))
        ]),
        $.value ? (n(), i("p", No, o($.value), 1)) : w("", !0),
        e("div", Ko, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: V.value,
            onClick: C
          }, o(V.value ? l(t)("settings.saving") : l(t)("settings.save")), 9, Ro),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: S
          }, o(l(t)("settings.cancel")), 1)
        ])
      ], 64)) : (n(), i(N, { key: 1 }, [
        e("div", Ho, [
          e("div", null, [
            e("h2", null, o(l(t)("settings.tabs.provider")), 1),
            e("p", Bo, o(l(t)("settings.providerDesc")), 1)
          ]),
          e("div", Jo, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: q
            }, o(l(t)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: Y
            }, "+ " + o(l(t)("settings.addProvider")), 1)
          ])
        ]),
        l(b).providers.length ? (n(), i("div", Wo, [
          (n(!0), i(N, null, B(l(b).providers, (c) => (n(), i("article", {
            key: c.id,
            class: H(["pp-card", { off: !c.enabled, default: W(c) }])
          }, [
            e("header", qo, [
              e("span", Yo, [
                p(c) ? (n(), i("img", {
                  key: 0,
                  src: p(c),
                  alt: a(c)
                }, null, 8, Go)) : (n(), i("svg", Qo, [...r[13] || (r[13] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", Xo, [
                e("strong", null, o(a(c)), 1),
                e("code", {
                  title: c.base_url
                }, o(c.base_url || "—"), 9, Zo)
              ]),
              e("div", en, [
                W(c) ? (n(), i("span", tn, o(l(t)("settings.default")), 1)) : w("", !0),
                e("span", sn, o(I(c).length) + "/" + o(c.models.length), 1)
              ])
            ]),
            e("div", ln, [
              e("span", {
                class: H(["pp-status", m.value[c.id]?.state || "idle"])
              }, [
                r[14] || (r[14] = e("span", { class: "pp-dot" }, null, -1)),
                Q(" " + o(m.value[c.id]?.state === "checking" ? l(t)("settings.testing") : m.value[c.id]?.state === "ok" ? l(t)("settings.connectionOk") : m.value[c.id]?.state === "error" ? l(t)("settings.connectionFailed") : l(t)("settings.statusIdle")), 1)
              ], 2),
              m.value[c.id]?.state === "ok" ? (n(), i("span", on, o(l(t)("settings.fetchedSummary", { n: m.value[c.id]?.count || 0 })) + " · " + o(m.value[c.id]?.ms) + "ms", 1)) : m.value[c.id]?.state === "error" ? (n(), i("span", {
                key: 1,
                class: "pp-meta err",
                title: m.value[c.id]?.message
              }, o(m.value[c.id]?.message), 9, nn)) : w("", !0)
            ]),
            e("div", an, [
              (n(!0), i(N, null, B(I(c).slice(0, 6), (z) => (n(), i("span", {
                key: z,
                class: "pp-chip"
              }, o(z), 1))), 128)),
              I(c).length > 6 ? (n(), i("span", rn, "+" + o(I(c).length - 6), 1)) : w("", !0),
              c.models.length ? w("", !0) : (n(), i("span", un, o(l(t)("settings.noModelsYet")), 1))
            ]),
            e("footer", dn, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (z) => O(c)
              }, o(l(t)("settings.edit")), 9, cn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: m.value[c.id]?.state === "checking",
                onClick: (z) => K(c)
              }, o(l(t)("settings.testConnection")), 9, pn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: W(c),
                onClick: (z) => ke(c)
              }, o(l(t)("settings.makeDefault")), 9, vn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (z) => pe(c)
              }, o(c.enabled ? l(t)("settings.disableProvider") : l(t)("settings.enableProvider")), 9, _n),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (z) => ue(c)
              }, o(l(t)("settings.remove")), 9, hn)
            ])
          ], 2))), 128))
        ])) : (n(), i("div", mn, [
          e("p", null, o(l(t)("settings.noProviders")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: Y
          }, "+ " + o(l(t)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), bn = /* @__PURE__ */ re(gn, [["__scopeId", "data-v-dc98b94b"]]), yn = { class: "pairing-panel" }, kn = { key: 0 }, fn = { key: 1 }, $n = { key: 0 }, wn = ["onClick"], xn = ["onClick"], Cn = /* @__PURE__ */ X({
  __name: "PairingPanel",
  setup(R) {
    const t = f([]), g = f("");
    let b;
    async function m() {
      try {
        const d = await fetch("/api/pairing/pending");
        if (!d.ok) throw new Error(await d.text());
        t.value = (await d.json()).requests || [];
      } catch (d) {
        g.value = d.message;
      }
    }
    async function y(d, $) {
      try {
        const k = await fetch("/api/pairing/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, allow: $ }) });
        if (!k.ok) throw new Error(await k.text());
        await m();
      } catch (k) {
        g.value = k.message;
      }
    }
    return se(() => {
      m(), b = setInterval(m, 3e3);
    }), Se(() => clearInterval(b)), (d, $) => (n(), i("section", yn, [
      $[0] || ($[0] = e("h3", null, "设备配对", -1)),
      $[1] || ($[1] = e("p", null, "在 Core 所在电脑核对安装终端显示的 6 位代码，再允许连接。局域网发现需启用 CORE_LAN_ENABLED=1。", -1)),
      g.value ? (n(), i("p", kn, o(g.value), 1)) : w("", !0),
      t.value.length ? w("", !0) : (n(), i("p", fn, "暂无待配对设备")),
      (n(!0), i(N, null, B(t.value, (k) => (n(), i("article", {
        key: k.id
      }, [
        e("strong", null, o(k.name), 1),
        e("code", null, o(k.code), 1),
        k.approved ? (n(), i("span", $n, "已允许，等待客户端领取")) : (n(), i(N, { key: 1 }, [
          e("button", {
            onClick: (L) => y(k, !1)
          }, "拒绝", 8, wn),
          e("button", {
            onClick: (L) => y(k, !0)
          }, "核对代码并允许配对", 8, xn)
        ], 64))
      ]))), 128))
    ]));
  }
}), Sn = /* @__PURE__ */ re(Cn, [["__scopeId", "data-v-0559b1b2"]]), Pn = { class: "content-card" }, Tn = { class: "card-desc" }, Un = { class: "field" }, Mn = { class: "segmented" }, Vn = ["onClick"], En = /* @__PURE__ */ X({
  __name: "GeneralPanel",
  setup(R) {
    const { t } = le(), g = f(qe());
    function b(m) {
      g.value = m, Ge(m);
    }
    return (m, y) => (n(), i("div", Pn, [
      te(Sn),
      e("h2", null, o(l(t)("settings.tabs.general")), 1),
      e("p", Tn, o(l(t)("settings.generalDesc")), 1),
      e("div", Un, [
        e("label", null, o(l(t)("settings.language")), 1),
        e("div", Mn, [
          (n(!0), i(N, null, B(l(Ye), (d) => (n(), i("button", {
            key: d.code,
            class: H(["seg", { active: g.value === d.code }]),
            onClick: ($) => b(d.code)
          }, o(d.label), 11, Vn))), 128))
        ])
      ])
    ]));
  }
}), An = { class: "content-card" }, On = { class: "card-desc" }, zn = { class: "field-row" }, Ln = { class: "field" }, In = ["placeholder"], Dn = { class: "field" }, jn = ["placeholder"], Fn = { class: "field" }, Nn = { class: "field" }, Kn = ["placeholder"], Rn = { class: "field" }, Hn = ["placeholder"], Bn = { class: "field" }, Jn = ["placeholder"], Wn = { class: "field" }, qn = ["placeholder"], Yn = { class: "helper-text" }, Gn = /* @__PURE__ */ X({
  __name: "PersonaPanel",
  setup(R) {
    const { t } = le(), g = Te(), { tabLabel: b, tabMeta: m } = Ue();
    return (y, d) => (n(), i("div", An, [
      e("h2", null, o(l(b)("persona")), 1),
      e("p", On, o(l(m)("persona")?.descriptionKey ? l(t)(l(m)("persona").descriptionKey) : l(t)("settings.personaDesc")), 1),
      e("div", zn, [
        e("div", Ln, [
          e("label", null, o(l(t)("wizard.name")), 1),
          T(e("input", {
            "onUpdate:modelValue": d[0] || (d[0] = ($) => l(g).persona.name = $),
            placeholder: l(t)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, In), [
            [D, l(g).persona.name]
          ])
        ]),
        e("div", Dn, [
          e("label", null, o(l(t)("wizard.avatarUrl")), 1),
          T(e("input", {
            "onUpdate:modelValue": d[1] || (d[1] = ($) => l(g).persona.avatar = $),
            placeholder: l(t)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, jn), [
            [D, l(g).persona.avatar]
          ])
        ]),
        e("div", Fn, [
          d[7] || (d[7] = e("label", null, "出生日期", -1)),
          T(e("input", {
            "onUpdate:modelValue": d[2] || (d[2] = ($) => l(g).persona.birthDate = $),
            type: "date",
            class: "input"
          }, null, 512), [
            [D, l(g).persona.birthDate]
          ])
        ])
      ]),
      e("div", Nn, [
        e("label", null, o(l(t)("wizard.description")), 1),
        T(e("textarea", {
          "onUpdate:modelValue": d[3] || (d[3] = ($) => l(g).persona.description = $),
          placeholder: l(t)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Kn), [
          [D, l(g).persona.description]
        ])
      ]),
      e("div", Rn, [
        e("label", null, o(l(t)("wizard.personality")), 1),
        T(e("textarea", {
          "onUpdate:modelValue": d[4] || (d[4] = ($) => l(g).persona.personality = $),
          placeholder: l(t)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Hn), [
          [D, l(g).persona.personality]
        ])
      ]),
      e("div", Bn, [
        e("label", null, o(l(t)("wizard.greeting")), 1),
        T(e("textarea", {
          "onUpdate:modelValue": d[5] || (d[5] = ($) => l(g).persona.greeting = $),
          placeholder: l(t)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, Jn), [
          [D, l(g).persona.greeting]
        ])
      ]),
      e("div", Wn, [
        e("label", null, o(l(t)("wizard.customPrompt")), 1),
        T(e("textarea", {
          "onUpdate:modelValue": d[6] || (d[6] = ($) => l(g).persona.customPrompt = $),
          placeholder: l(t)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, qn), [
          [D, l(g).persona.customPrompt]
        ]),
        e("p", Yn, o(l(t)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), Qn = { class: "content-card" }, Xn = { class: "card-desc" }, Zn = { class: "toggle-label" }, ea = { class: "helper-text" }, ta = { class: "toggle-label" }, sa = { class: "helper-text" }, la = { class: "field" }, oa = ["placeholder"], na = { class: "helper-text" }, aa = {
  key: 0,
  class: "helper-text"
}, ia = { class: "actions-row" }, ra = /* @__PURE__ */ X({
  __name: "PermissionsPanel",
  setup(R) {
    const { t } = le(), { tabLabel: g, tabMeta: b, fieldLabel: m, fieldHelp: y } = Ue(), d = f({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), $ = f("");
    async function k() {
      try {
        const M = await fetch("/api/life/permissions");
        if (M.ok) {
          const _ = await M.json();
          d.value = {
            screen_watch: !!_.screen_watch,
            computer_use: !!_.computer_use,
            report_agent_host: _.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function L() {
      $.value = "";
      try {
        const M = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(d.value)
        });
        if (!M.ok) throw new Error(String(M.status));
        const _ = await M.json();
        d.value = {
          screen_watch: !!_.screen_watch,
          computer_use: !!_.computer_use,
          report_agent_host: _.report_agent_host || ""
        }, $.value = t("settings.permSaved");
      } catch {
        $.value = t("settings.permFailed");
      }
    }
    return se(k), (M, _) => (n(), i("div", Qn, [
      e("h2", null, o(l(g)("permissions")), 1),
      e("p", Xn, o(l(b)("permissions")?.descriptionKey ? l(t)(l(b)("permissions").descriptionKey) : l(t)("settings.permissionsDesc")), 1),
      e("label", Zn, [
        T(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": _[0] || (_[0] = (u) => d.value.screen_watch = u),
          onChange: L
        }, null, 544), [
          [ee, d.value.screen_watch]
        ]),
        _[4] || (_[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, o(l(m)(l(b)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          _[3] || (_[3] = e("br", null, null, -1)),
          e("small", ea, o(l(y)(l(b)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", ta, [
        T(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": _[1] || (_[1] = (u) => d.value.computer_use = u),
          onChange: L
        }, null, 544), [
          [ee, d.value.computer_use]
        ]),
        _[6] || (_[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, o(l(m)(l(b)("permissions"), "computer_use", "settings.computerUse")), 1),
          _[5] || (_[5] = e("br", null, null, -1)),
          e("small", sa, o(l(y)(l(b)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", la, [
        e("label", null, o(l(m)(l(b)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        T(e("input", {
          "onUpdate:modelValue": _[2] || (_[2] = (u) => d.value.report_agent_host = u),
          class: "input",
          placeholder: l(y)(l(b)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: L
        }, null, 40, oa), [
          [D, d.value.report_agent_host]
        ]),
        e("p", na, o(l(y)(l(b)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      $.value ? (n(), i("div", aa, o($.value), 1)) : w("", !0),
      e("div", ia, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: L
        }, o(l(t)("settings.save")), 1)
      ])
    ]));
  }
}), ua = f(!1), da = f(!1);
f(!1);
const ae = f(!1), de = f(!0), Me = f(!0), ce = f([]), Ie = f(!1);
f(!1);
const ye = f(!1), Ae = [];
function ca(R) {
  const t = Ae.splice(0, Ae.length);
  for (const g of t)
    g.resolve();
}
async function pa() {
  const R = window.fetch;
  try {
    const t = await R("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!t.ok) return;
    const g = await t.json();
    ae.value = !!g.configured, de.value = g.enabled !== !1, Me.value = g.login_enabled !== !1, ce.value = Array.isArray(g.pages) ? g.pages : [], ye.value = !g.configured && de.value;
  } catch {
  }
}
async function va(R) {
  const t = window.fetch, g = await t("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(R)
  }), b = await g.json().catch(() => null);
  if (!g.ok) throw new Error(b?.error || `HTTP ${g.status}`);
  typeof b?.enabled == "boolean" && (de.value = b.enabled), typeof b?.login_enabled == "boolean" && (Me.value = b.login_enabled), Array.isArray(b?.pages) && (ce.value = b.pages), ae.value = !!b?.configured, ye.value = !b?.configured && de.value;
}
async function _a() {
  const R = window.fetch, t = await R("/api/security/pin", { method: "DELETE" }), g = await t.json().catch(() => null);
  if (!t.ok) throw new Error(g?.error || `HTTP ${t.status}`);
  Ie.value = !1, ae.value = !1, ye.value = de.value;
}
async function ha(R) {
  const t = window.fetch, g = await t("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: R })
  }), b = await g.json().catch(() => null);
  if (!g.ok || !b?.configured) throw new Error(b?.error || `HTTP ${g.status}`);
  R.trim(), Ie.value = !0, ae.value = !0, ye.value = !1, da.value = !0, ua.value = !1, ca();
}
const ma = { class: "content-card security-panel" }, ga = { class: "card-desc" }, ba = { class: "sec-stack" }, ya = { class: "toggle-label" }, ka = ["checked", "disabled"], fa = { class: "helper-text" }, $a = { class: "toggle-label" }, wa = ["checked", "disabled"], xa = { class: "helper-text" }, Ca = { class: "sec-card" }, Sa = { class: "sec-card-head" }, Pa = { class: "sec-pin-grid" }, Ta = { class: "sec-pin-col" }, Ua = { class: "sec-pin-label" }, Ma = { class: "sec-pin-col" }, Va = { class: "sec-pin-label" }, Ea = { class: "sec-actions" }, Aa = ["disabled"], Oa = ["disabled"], za = { class: "sec-card" }, La = { class: "sec-card-head" }, Ia = { class: "sec-chip" }, Da = { class: "helper-text" }, ja = { class: "page-list" }, Fa = ["checked", "disabled", "onChange"], Na = { class: "page-text" }, Ka = { class: "page-name" }, Ra = {
  key: 0,
  class: "helper-text sec-msg"
}, Ha = {
  key: 1,
  class: "sec-error"
}, Ba = /* @__PURE__ */ X({
  __name: "SecurityPanel",
  setup(R) {
    const { t, locale: g } = le(), { confirm: b } = Pe(), m = Le(), y = f(!1), d = f(""), $ = f(""), k = f(""), L = f(""), M = J(() => {
      const p = [], v = /* @__PURE__ */ new Set(), E = (A, I) => {
        !A || v.has(A) || (v.add(A), p.push({ path: A, label: I || A }));
      };
      for (const A of m.navItems) {
        const I = A.to || (A.id === "chat" ? "/" : "");
        if (!I) continue;
        let W = A.labelKey ? t(A.labelKey) : "";
        (!W || W === A.labelKey) && (W = A.label || A.id), E(I, W);
      }
      for (const A of m.routerPatches) {
        let I = A.titleKey ? t(A.titleKey) : "";
        (!I || I === A.titleKey) && (I = A.title || String(A.name || A.path)), E(A.path, I);
      }
      return p;
    });
    se(() => {
      pa();
    });
    async function _(p) {
      y.value = !0, d.value = "", $.value = "";
      try {
        await va(p), d.value = t("settings.saved"), setTimeout(() => {
          d.value = "";
        }, 1500);
      } catch (v) {
        $.value = v?.message || t("settings.permFailed");
      } finally {
        y.value = !1;
      }
    }
    function u(p, v) {
      _({ [p]: v });
    }
    function V(p, v) {
      const E = new Set(ce.value);
      v ? E.add(p) : E.delete(p), _({ pages: [...E] });
    }
    async function j() {
      if ($.value = "", k.value.length !== 6) {
        $.value = t("wizard.pinTooShort");
        return;
      }
      if (k.value !== L.value) {
        $.value = t("wizard.pinMismatch");
        return;
      }
      y.value = !0;
      try {
        await ha(k.value), k.value = "", L.value = "", d.value = t("settings.saved"), setTimeout(() => {
          d.value = "";
        }, 1500);
      } catch (p) {
        $.value = p?.message || t("settings.permFailed");
      } finally {
        y.value = !1;
      }
    }
    async function a() {
      if (await b({
        title: t("security.removePin"),
        message: t("security.removePinConfirm"),
        confirmLabel: g.value === "en" ? "Delete" : "删除",
        danger: !0
      })) {
        y.value = !0, $.value = "";
        try {
          await _a(), d.value = t("settings.saved"), setTimeout(() => {
            d.value = "";
          }, 1500);
        } catch (v) {
          $.value = v?.message || t("settings.permFailed");
        } finally {
          y.value = !1;
        }
      }
    }
    return (p, v) => (n(), i("div", ma, [
      e("h2", null, o(l(t)("settings.tabs.security")), 1),
      e("p", ga, o(l(t)("security.desc")), 1),
      e("div", ba, [
        e("label", ya, [
          e("input", {
            type: "checkbox",
            checked: l(de),
            disabled: y.value,
            onChange: v[0] || (v[0] = (E) => u("enabled", E.target.checked))
          }, null, 40, ka),
          v[4] || (v[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, o(l(t)("security.pinSwitch")), 1),
            e("small", fa, o(l(t)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", $a, [
          e("input", {
            type: "checkbox",
            checked: l(Me),
            disabled: y.value,
            onChange: v[1] || (v[1] = (E) => u("login_enabled", E.target.checked))
          }, null, 40, wa),
          v[5] || (v[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, o(l(t)("security.loginSwitch")), 1),
            e("small", xa, o(l(t)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", Ca, [
          e("div", Sa, [
            e("strong", null, o(l(ae) ? l(t)("security.changePin") : l(t)("auth.setupTitle")), 1),
            e("span", {
              class: H(["sec-chip", { on: l(ae) }])
            }, o(l(ae) ? l(t)("security.pinSet") : l(t)("security.pinUnset")), 3)
          ]),
          e("div", Pa, [
            e("div", Ta, [
              e("span", Ua, o(l(t)("auth.pinNew")), 1),
              te(l(ie), {
                modelValue: k.value,
                "onUpdate:modelValue": v[2] || (v[2] = (E) => k.value = E)
              }, null, 8, ["modelValue"])
            ]),
            e("div", Ma, [
              e("span", Va, o(l(t)("auth.pinConfirm")), 1),
              te(l(ie), {
                modelValue: L.value,
                "onUpdate:modelValue": v[3] || (v[3] = (E) => L.value = E),
                onComplete: j
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", Ea, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: y.value,
              onClick: j
            }, o(l(t)("auth.savePin")), 9, Aa),
            l(ae) ? (n(), i("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: y.value,
              onClick: a
            }, o(l(t)("security.removePin")), 9, Oa)) : w("", !0)
          ])
        ]),
        e("section", za, [
          e("div", La, [
            e("strong", null, o(l(t)("security.pages")), 1),
            e("span", Ia, o(l(t)("security.pageCount", { n: l(ce).length })), 1)
          ]),
          e("p", Da, o(l(t)("security.pagesHelp")), 1),
          e("div", ja, [
            (n(!0), i(N, null, B(M.value, (E) => (n(), i("label", {
              key: E.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: l(ce).includes(E.path),
                disabled: y.value,
                onChange: (A) => V(E.path, A.target.checked)
              }, null, 40, Fa),
              v[6] || (v[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", Na, [
                e("span", Ka, o(E.label), 1),
                e("code", null, o(E.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      d.value ? (n(), i("p", Ra, o(d.value), 1)) : w("", !0),
      $.value ? (n(), i("p", Ha, o($.value), 1)) : w("", !0)
    ]));
  }
}), Ja = /* @__PURE__ */ re(Ba, [["__scopeId", "data-v-bd35de8f"]]), Wa = { class: "mcp-panel" }, qa = { class: "mcp-head" }, Ya = { class: "mcp-actions" }, Ga = ["disabled"], Qa = {
  key: 0,
  class: "error-banner"
}, Xa = {
  key: 1,
  class: "notice-banner"
}, Za = {
  key: 2,
  class: "hint"
}, ei = {
  key: 3,
  class: "mcp-list"
}, ti = { class: "mcp-row" }, si = { class: "mcp-field grow" }, li = ["onUpdate:modelValue"], oi = { class: "mcp-field" }, ni = ["onUpdate:modelValue"], ai = { class: "mcp-toggle" }, ii = ["onUpdate:modelValue"], ri = ["onClick"], ui = { class: "mcp-field" }, di = ["onUpdate:modelValue"], ci = { class: "mcp-field" }, pi = ["onUpdate:modelValue"], vi = { class: "mcp-field" }, _i = ["onUpdate:modelValue"], hi = { class: "mcp-field" }, mi = ["onUpdate:modelValue"], gi = {
  key: 0,
  class: "hint"
}, bi = /* @__PURE__ */ X({
  __name: "McpPanel",
  setup(R) {
    const t = f([]), g = f(!1), b = f(!1), m = f(""), y = f(!1);
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
    function k(_) {
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
        const V = _.argsText.split(`
`).map((j) => j.trim()).filter(Boolean);
        V.length && (u.args = V);
      }
      return u;
    }
    async function L() {
      g.value = !0, m.value = "";
      try {
        const u = (await ne("/api/settings/mcp"))?.values?.servers;
        let V = [];
        if (typeof u == "string" && u.trim())
          try {
            const j = JSON.parse(u);
            Array.isArray(j) && (V = j);
          } catch {
            m.value = "已保存的 MCP 配置不是合法 JSON，已忽略。";
          }
        t.value = V.map($);
      } catch (_) {
        m.value = _?.message || String(_);
      } finally {
        g.value = !1;
      }
    }
    async function M() {
      if (!b.value) {
        b.value = !0, m.value = "", y.value = !1;
        try {
          const _ = t.value.map(k).filter((u) => String(u.id || "").trim());
          await be("/api/settings/mcp", { values: { servers: JSON.stringify(_) } }), y.value = !0, setTimeout(() => {
            y.value = !1;
          }, 2e3);
        } catch (_) {
          m.value = _?.message || String(_);
        } finally {
          b.value = !1;
        }
      }
    }
    return se(L), (_, u) => (n(), i("div", Wa, [
      e("header", qa, [
        u[1] || (u[1] = e("div", null, [
          e("h2", null, "MCP 服务"),
          e("p", { class: "subtitle" }, "配置外部 MCP（模型上下文协议）服务。保存后 Agent 与 L.I.F.E 共用同一份配置。")
        ], -1)),
        e("div", Ya, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: u[0] || (u[0] = (V) => t.value.push(d()))
          }, "添加服务"),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: b.value,
            onClick: M
          }, o(b.value ? "保存中…" : "保存"), 9, Ga)
        ])
      ]),
      m.value ? (n(), i("div", Qa, o(m.value), 1)) : w("", !0),
      y.value ? (n(), i("div", Xa, "已保存")) : w("", !0),
      g.value ? (n(), i("p", Za, "加载中…")) : (n(), i("div", ei, [
        (n(!0), i(N, null, B(t.value, (V, j) => (n(), i("article", {
          key: j,
          class: "mcp-card"
        }, [
          e("div", ti, [
            e("label", si, [
              u[2] || (u[2] = e("span", null, "ID", -1)),
              T(e("input", {
                "onUpdate:modelValue": (a) => V.id = a,
                placeholder: "filesystem"
              }, null, 8, li), [
                [D, V.id]
              ])
            ]),
            e("label", oi, [
              u[4] || (u[4] = e("span", null, "传输", -1)),
              T(e("select", {
                "onUpdate:modelValue": (a) => V.transport = a
              }, [...u[3] || (u[3] = [
                e("option", { value: "stdio" }, "stdio", -1),
                e("option", { value: "http" }, "http", -1)
              ])], 8, ni), [
                [Re, V.transport]
              ])
            ]),
            e("label", ai, [
              T(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (a) => V.enabled = a
              }, null, 8, ii), [
                [ee, V.enabled]
              ]),
              u[5] || (u[5] = e("span", null, "启用", -1))
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (a) => t.value.splice(j, 1)
            }, "删除", 8, ri)
          ]),
          V.transport === "stdio" ? (n(), i(N, { key: 0 }, [
            e("label", ui, [
              u[6] || (u[6] = e("span", null, "命令", -1)),
              T(e("input", {
                "onUpdate:modelValue": (a) => V.command = a,
                placeholder: "npx"
              }, null, 8, di), [
                [D, V.command]
              ])
            ]),
            e("label", ci, [
              u[7] || (u[7] = e("span", null, "参数（每行一个）", -1)),
              T(e("textarea", {
                "onUpdate:modelValue": (a) => V.argsText = a,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, pi), [
                [D, V.argsText]
              ])
            ])
          ], 64)) : (n(), i(N, { key: 1 }, [
            e("label", vi, [
              u[8] || (u[8] = e("span", null, "URL", -1)),
              T(e("input", {
                "onUpdate:modelValue": (a) => V.url = a,
                placeholder: "https://example.com/mcp"
              }, null, 8, _i), [
                [D, V.url]
              ])
            ]),
            e("label", hi, [
              u[9] || (u[9] = e("span", null, "Headers（JSON）", -1)),
              T(e("textarea", {
                "onUpdate:modelValue": (a) => V.headersText = a,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, mi), [
                [D, V.headersText]
              ])
            ])
          ], 64))
        ]))), 128)),
        t.value.length ? w("", !0) : (n(), i("p", gi, "还没有 MCP 服务，点击「添加服务」。"))
      ]))
    ]));
  }
}), yi = /* @__PURE__ */ re(bi, [["__scopeId", "data-v-3b21cb32"]]), ki = { class: "content-card danger" }, fi = { class: "card-desc" }, $i = { class: "danger-box" }, wi = /* @__PURE__ */ X({
  __name: "DangerPanel",
  setup(R) {
    const { t } = le(), g = Te(), b = Oe();
    function m() {
      g.resetWizard(), b.push("/");
    }
    return (y, d) => (n(), i("div", ki, [
      e("h2", null, o(l(t)("settings.tabs.danger")), 1),
      e("p", fi, o(l(t)("settings.resetDesc")), 1),
      e("div", $i, [
        e("div", null, [
          e("strong", null, o(l(t)("settings.reset")), 1),
          e("p", null, o(l(t)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          onClick: m
        }, o(l(t)("settings.reset")), 1)
      ])
    ]));
  }
}), xi = {
  key: 1,
  class: "plugin-pane-message"
}, Ci = {
  key: 2,
  class: "plugin-pane-message"
}, Si = /* @__PURE__ */ X({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(R) {
    const t = R, g = Ve(null), b = Ve("");
    return He(
      () => t.module,
      async (m) => {
        if (!m) {
          g.value = null, b.value = "";
          return;
        }
        try {
          const y = await import(
            /* @vite-ignore */
            m
          );
          g.value = y?.default || y, b.value = "";
        } catch (y) {
          g.value = null, b.value = y?.message || String(y);
        }
      },
      { immediate: !0 }
    ), (m, y) => g.value ? (n(), Z(Be(g.value), { key: 0 })) : b.value ? (n(), i("div", xi, o(b.value), 1)) : (n(), i("div", Ci, "Loading plugin module…"));
  }
}), Pi = /* @__PURE__ */ re(Si, [["__scopeId", "data-v-2d1f36bc"]]), Ti = { class: "settings-page" }, Ui = { class: "page-header" }, Mi = { class: "subtitle" }, Vi = { key: 0 }, Ei = { key: 1 }, Ai = { class: "settings-layout" }, Oi = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, zi = ["onClick"], Li = {
  class: "nav-icon",
  "aria-hidden": "true"
}, Ii = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Di = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, ji = {
  key: 2,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Fi = {
  key: 3,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ni = {
  key: 4,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ki = {
  key: 5,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ri = {
  key: 6,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Hi = {
  key: 7,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Bi = {
  key: 8,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ji = {
  key: 9,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Wi = {
  key: 10,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, qi = { class: "nav-label" }, Yi = { class: "settings-content" }, Gi = {
  key: 0,
  class: "content-card provider-runtime"
}, Qi = {
  key: 0,
  class: "helper-text"
}, Xi = {
  key: 0,
  class: "toggle-label"
}, Zi = ["checked", "onChange"], er = { key: 0 }, tr = {
  key: 1,
  class: "helper-text"
}, sr = {
  key: 0,
  class: "helper-text"
}, lr = ["type", "value", "onInput"], or = {
  key: 0,
  class: "helper-text"
}, nr = {
  key: 1,
  class: "helper-text"
}, ar = { class: "actions-row" }, ir = {
  key: 3,
  class: "content-card"
}, rr = { class: "card-desc" }, ur = { class: "toggle-label" }, dr = { class: "field" }, cr = { class: "model-choices" }, pr = ["value", "checked", "onChange"], vr = ["placeholder"], _r = { class: "helper-text" }, hr = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, mr = { class: "field" }, gr = {
  key: 0,
  class: "helper-text"
}, br = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, yr = ["value", "checked", "onChange"], kr = ["onClick"], fr = {
  key: 8,
  class: "content-card"
}, $r = {
  key: 0,
  class: "card-desc"
}, wr = {
  key: 1,
  class: "helper-text"
}, xr = {
  key: 0,
  class: "toggle-label"
}, Cr = ["checked", "onChange"], Sr = { key: 0 }, Pr = {
  key: 1,
  class: "helper-text"
}, Tr = {
  key: 0,
  class: "helper-text"
}, Ur = { class: "actions-row" }, Mr = ["disabled"], Vr = {
  key: 0,
  class: "helper-text"
}, Er = {
  key: 0,
  class: "helper-text"
}, Ar = ["type", "value", "onInput"], Or = {
  key: 0,
  class: "helper-text"
}, zr = {
  key: 2,
  class: "helper-text"
}, Lr = { class: "actions-row" }, Ir = {
  key: 10,
  class: "content-card"
}, Dr = {
  key: 0,
  class: "card-desc"
}, jr = {
  key: 1,
  class: "card-desc"
}, Fr = {
  key: 0,
  class: "toggle-label"
}, Nr = ["checked", "onChange"], Kr = { key: 0 }, Rr = {
  key: 1,
  class: "helper-text"
}, Hr = {
  key: 0,
  class: "helper-text"
}, Br = ["type", "value", "onInput"], Jr = {
  key: 0,
  class: "helper-text"
}, Wr = {
  key: 2,
  class: "helper-text"
}, qr = { class: "actions-row" }, tu = /* @__PURE__ */ X({
  __name: "SettingsPage",
  setup(R) {
    const { t, locale: g } = le(), { confirm: b } = Pe(), m = Te(), y = Qe(), d = Le(), $ = Je(), k = Oe(), L = J(() => d.settingsTabs.map((P) => ({
      id: P.id,
      icon: P.icon || "chip"
    }))), M = J(() => {
      const P = new Set(d.settingsTabs.map((s) => s.id)), h = new Set(d.removedSettingsIds);
      return y.sections.filter((s) => s.id !== "permissions" && !P.has(s.id) && !h.has(s.id)).map((s) => ({ id: s.id, icon: s.icon || "lock" }));
    }), _ = J(() => [...L.value, ...M.value]), u = f("general"), V = f(!1), j = f([]), a = f(null), p = f(""), v = f({}), E = f(""), A = f(!1), I = f("");
    async function W(P) {
      A.value = !0, I.value = "";
      try {
        const h = await fetch(`/api/settings/${P}/test`, { method: "POST" }), s = h.headers.get("content-type") || "";
        if (h.ok && s.startsWith("audio")) {
          const r = URL.createObjectURL(await h.blob());
          try {
            await new Audio(r).play();
          } catch {
          }
          window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: r } })), I.value = "测试成功，正在播放…";
        } else {
          const r = await h.json().catch(() => ({}));
          I.value = r.error || `HTTP ${h.status}`;
        }
      } catch (h) {
        I.value = h instanceof Error ? h.message : String(h);
      } finally {
        A.value = !1;
      }
    }
    const { tabMeta: x, isBuiltinTab: U, isPluginSection: K, tabLabel: q, fieldLabel: Y, fieldHelp: O, pluginSection: S } = Ue(), C = J(() => U(u.value) ? null : x(u.value)?.module || null);
    function ue(P, h) {
      const s = v.value[P]?.[h];
      return typeof s == "boolean" ? s : s === "true" || s === 1 || s === "1";
    }
    function pe(P) {
      if (x(P)?.fields?.length && !U(P)) {
        ke(P);
        return;
      }
      const s = S(P);
      if (!s) return;
      const r = {};
      for (const F of s.fields)
        F.type === "bool" ? r[F.key] = F.default_value === "true" || F.default_value === "1" : F.type === "number" ? r[F.key] = Number(F.default_value || 0) : r[F.key] = F.default_value || "";
      const c = y.values[P] || {}, z = { ...r };
      for (const F of s.fields) {
        if (!(F.key in c)) continue;
        const G = c[F.key];
        F.type === "bool" ? z[F.key] = G === !0 || G === "true" || G === 1 || G === "1" : z[F.key] = G;
      }
      v.value = {
        ...v.value,
        [P]: z
      };
    }
    async function ke(P) {
      const h = x(P);
      if (!h?.fields?.length) return;
      const s = {};
      for (const r of h.fields)
        r.type === "bool" ? s[r.key] = r.default_value === "true" || r.default_value === "1" : r.type === "number" ? s[r.key] = Number(r.default_value || 0) : s[r.key] = r.default_value || "";
      if (h.loadApi)
        try {
          const r = await fetch(h.loadApi);
          if (r.ok) {
            const c = await r.json();
            for (const z of h.fields) {
              if (!(z.key in c)) continue;
              const F = c[z.key];
              z.type === "bool" ? s[z.key] = F === !0 || F === "true" || F === 1 || F === "1" : s[z.key] = F;
            }
          }
        } catch {
        }
      v.value = { ...v.value, [P]: s };
    }
    async function ve(P) {
      const h = x(P);
      E.value = "";
      try {
        const s = v.value[P] || {};
        if (h?.saveApi) {
          const r = await fetch(h.saveApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(s)
          });
          if (!r.ok) throw new Error(String(r.status));
        }
        E.value = t("settings.saved"), setTimeout(() => {
          E.value = "";
        }, 1500);
      } catch {
        E.value = t("settings.permFailed");
      }
    }
    async function _e(P) {
      E.value = "";
      try {
        await y.saveValues(P, v.value[P] || {}), E.value = t("settings.saved"), setTimeout(() => {
          E.value = "";
        }, 1500);
      } catch {
        E.value = t("settings.permFailed");
      }
    }
    async function he() {
      try {
        const P = await fetch("/api/live2d");
        if (P.ok) {
          const h = await P.json();
          j.value = h.models || [];
        }
      } catch {
        j.value = [];
      }
    }
    async function fe(P) {
      if (await b({
        title: t("settings.live2d"),
        message: `删除模型 ${P.label} 及所在模型文件夹中的全部资源？`,
        confirmLabel: g.value === "en" ? "Delete" : "删除",
        danger: !0
      }))
        try {
          const s = await fetch(`/api/live2d/${encodeURIComponent(P.id)}`, { method: "DELETE" });
          if (!s.ok) throw new Error(await s.text());
          const r = await s.json();
          j.value = r.models || [];
          const c = P.url.slice(0, P.url.indexOf("/", 15) + 1);
          m.live2d.modelUrl.startsWith(c) && (m.live2d.modelUrl = "", m.live2d.enabled = !1, m.saveToStorage()), await oe(), p.value = "模型已删除", window.dispatchEvent(new Event("live2d-models-changed"));
        } catch (s) {
          p.value = s.message;
        }
    }
    async function oe() {
      m.saveToStorage();
      const P = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: m.live2d.enabled, model_url: m.live2d.modelUrl } }) });
      if (!P.ok) throw new Error(await P.text());
    }
    function $e() {
      a.value?.click();
    }
    async function me(P) {
      const h = P.target, s = h.files;
      if (!(!s || s.length === 0)) {
        p.value = "";
        try {
          const r = new FormData(), c = [];
          for (const G of Array.from(s)) {
            const De = G.webkitRelativePath || G.name;
            c.push(De), r.append("files", G, G.name);
          }
          r.append("paths", JSON.stringify(c));
          const z = await fetch("/api/live2d", { method: "POST", body: r });
          if (!z.ok) throw new Error(await z.text());
          const F = await z.json();
          p.value = t("settings.uploadOk"), F?.models ? j.value = F.models : await he(), F?.model_url && (m.live2d.modelUrl = F.model_url, m.live2d.enabled = !0, m.saveToStorage(), await oe(), window.dispatchEvent(new Event("live2d-models-changed")));
        } catch (r) {
          p.value = `${t("settings.uploadFail")}：${r.message}`;
        } finally {
          h.value = "";
        }
      }
    }
    se(async () => {
      m.loadFromStorage();
      const P = $.query.tab;
      P && (u.value = P), he(), await y.fetchSections();
      for (const h of y.sections) pe(h.id);
    });
    function we(P) {
      u.value = P, U(P) || pe(P), k.replace({ query: { tab: P } });
    }
    function ge() {
      m.saveToStorage(), u.value === "live2d" && oe().catch((P) => {
        p.value = P.message;
      }), V.value = !0, setTimeout(() => {
        V.value = !1;
      }, 1500);
    }
    return (P, h) => (n(), i("div", Ti, [
      e("header", Ui, [
        e("div", null, [
          e("h1", null, o(l(t)("settings.title")), 1),
          e("p", Mi, o(l(t)("settings.pageDesc")), 1)
        ]),
        u.value !== "about" && !C.value ? (n(), i("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: ge
        }, [
          V.value ? (n(), i("span", Vi, o(l(t)("settings.saved")), 1)) : (n(), i("span", Ei, o(l(t)("settings.save")), 1))
        ])) : w("", !0)
      ]),
      e("div", Ai, [
        e("nav", Oi, [
          (n(!0), i(N, null, B(_.value, (s) => (n(), i("button", {
            key: s.id,
            class: H(["nav-item", { active: u.value === s.id }]),
            onClick: (r) => we(s.id)
          }, [
            h[18] || (h[18] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", Li, [
              s.icon === "globe" ? (n(), i("svg", Ii, [...h[7] || (h[7] = [
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
              ])])) : s.icon === "cloud" ? (n(), i("svg", Di, [...h[8] || (h[8] = [
                e("path", {
                  d: "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])])) : s.icon === "chip" ? (n(), i("svg", ji, [...h[9] || (h[9] = [
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
              ])])) : s.icon === "person" ? (n(), i("svg", Fi, [...h[10] || (h[10] = [
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
              ])])) : s.icon === "avatar" ? (n(), i("svg", Ni, [...h[11] || (h[11] = [
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
              ])])) : s.icon === "brightness" ? (n(), i("svg", Ki, [...h[12] || (h[12] = [
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
              ])])) : s.icon === "warn" ? (n(), i("svg", Ri, [...h[13] || (h[13] = [
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
              ])])) : s.icon === "info" ? (n(), i("svg", Hi, [...h[14] || (h[14] = [
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
              ])])) : s.icon === "download" ? (n(), i("svg", Bi, [...h[15] || (h[15] = [
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
              ])])) : s.icon === "shield" ? (n(), i("svg", Ji, [...h[16] || (h[16] = [
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
              ])])) : (n(), i("svg", Wi, [...h[17] || (h[17] = [
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
            e("span", qi, o(l(q)(s.id)), 1)
          ], 10, zi))), 128))
        ]),
        e("section", Yi, [
          u.value === "general" ? (n(), Z(En, { key: 0 })) : u.value === "provider" ? (n(), i(N, { key: 1 }, [
            te(bn),
            l(S)("provider")?.fields?.length ? (n(), i("div", Gi, [
              e("h3", null, o(l(S)("provider").label), 1),
              l(S)("provider").description ? (n(), i("p", Qi, o(l(S)("provider").description), 1)) : w("", !0),
              (n(!0), i(N, null, B(l(S)("provider").fields, (s) => (n(), i("div", {
                key: s.key,
                class: "field"
              }, [
                s.type === "bool" ? (n(), i("label", Xi, [
                  e("input", {
                    type: "checkbox",
                    checked: ue("provider", s.key),
                    onChange: (r) => v.value = { ...v.value, provider: { ...v.value.provider, [s.key]: r.target.checked } }
                  }, null, 40, Zi),
                  h[19] || (h[19] = e("span", { class: "toggle-slider" }, null, -1)),
                  e("span", null, [
                    e("strong", null, o(s.label), 1),
                    s.help ? (n(), i("br", er)) : w("", !0),
                    s.help ? (n(), i("small", tr, o(s.help), 1)) : w("", !0)
                  ])
                ])) : s.type === "select" ? (n(), i(N, { key: 1 }, [
                  e("label", null, o(s.label), 1),
                  te(l(ie), {
                    class: "input",
                    "aria-label": s.label,
                    "model-value": String(v.value.provider?.[s.key] ?? ""),
                    options: s.options || [],
                    "onUpdate:modelValue": (r) => v.value = { ...v.value, provider: { ...v.value.provider, [s.key]: r } }
                  }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                  s.help ? (n(), i("p", sr, o(s.help), 1)) : w("", !0)
                ], 64)) : (n(), i(N, { key: 2 }, [
                  e("label", null, o(s.label), 1),
                  e("input", {
                    class: "input",
                    type: s.type === "number" ? "number" : "text",
                    value: v.value.provider?.[s.key],
                    onInput: (r) => v.value = { ...v.value, provider: { ...v.value.provider, [s.key]: s.type === "number" ? Number(r.target.value) : r.target.value } }
                  }, null, 40, lr),
                  s.help ? (n(), i("p", or, o(s.help), 1)) : w("", !0)
                ], 64))
              ]))), 128)),
              E.value ? (n(), i("div", nr, o(E.value), 1)) : w("", !0),
              e("div", ar, [
                e("button", {
                  class: "btn btn-primary",
                  type: "button",
                  onClick: h[0] || (h[0] = (s) => _e("provider"))
                }, o(l(t)("settings.save")), 1)
              ])
            ])) : w("", !0)
          ], 64)) : u.value === "persona" ? (n(), Z(Gn, { key: 2 })) : u.value === "live2d" ? (n(), i("div", ir, [
            e("h2", null, o(l(q)("live2d")), 1),
            e("p", rr, o(l(x)("live2d")?.descriptionKey ? l(t)(l(x)("live2d").descriptionKey) : l(t)("settings.live2dDesc")), 1),
            te(Ze, { class: "live2d-preview" }),
            e("label", ur, [
              T(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": h[1] || (h[1] = (s) => l(m).live2d.enabled = s)
              }, null, 512), [
                [ee, l(m).live2d.enabled]
              ]),
              h[20] || (h[20] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", null, o(l(t)("wizard.enableLive2d")), 1)
            ]),
            e("div", dr, [
              e("label", null, o(l(t)("wizard.modelUrl")), 1),
              e("div", cr, [
                (n(!0), i(N, null, B(l(Xe), (s) => (n(), i("label", {
                  key: s.id,
                  class: H(["model-choice", { selected: l(m).live2d.modelUrl === s.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-model",
                    value: s.url,
                    checked: l(m).live2d.modelUrl === s.url,
                    onChange: (r) => {
                      l(m).live2d.modelUrl = s.url, l(m).live2d.enabled = !0;
                    }
                  }, null, 40, pr),
                  e("span", null, o(s.label), 1),
                  e("code", null, o(s.url), 1)
                ], 2))), 128))
              ]),
              T(e("input", {
                "onUpdate:modelValue": h[2] || (h[2] = (s) => l(m).live2d.modelUrl = s),
                placeholder: l(t)("wizard.modelUrlPlaceholder"),
                class: "input"
              }, null, 8, vr), [
                [D, l(m).live2d.modelUrl]
              ]),
              e("p", _r, [
                Q(o(l(t)("wizard.live2dHelp")) + " ", 1),
                e("a", hr, o(l(t)("wizard.live2dSamples")), 1)
              ])
            ]),
            h[21] || (h[21] = e("p", { class: "helper-text" }, "支持 Cubism 2（.model.json + .moc）与 Cubism 3/4（.model3.json + .moc3）。请选择完整模型文件夹，包含纹理、动作等资源。", -1)),
            e("button", {
              class: "btn btn-tonal",
              onClick: h[3] || (h[3] = (s) => oe().catch((r) => p.value = r.message))
            }, "保存 LIFE 的 Live2D 设置"),
            e("div", mr, [
              e("label", null, o(l(t)("settings.uploadFolder")), 1),
              e("label", {
                class: "upload-area",
                onClick: Ee($e, ["prevent"])
              }, [
                e("span", null, o(l(t)("settings.uploadFolderHint")), 1)
              ]),
              e("input", {
                ref_key: "folderInput",
                ref: a,
                type: "file",
                webkitdirectory: "",
                directory: "",
                multiple: "",
                class: "file-input",
                onChange: me
              }, null, 544),
              p.value ? (n(), i("p", gr, o(p.value), 1)) : w("", !0),
              j.value.length ? (n(), i("div", br, [
                (n(!0), i(N, null, B(j.value, (s) => (n(), i("label", {
                  key: s.id,
                  class: H(["model-choice", { selected: l(m).live2d.modelUrl === s.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-uploaded",
                    value: s.url,
                    checked: l(m).live2d.modelUrl === s.url,
                    onChange: (r) => {
                      l(m).live2d.modelUrl = s.url, l(m).live2d.enabled = !0, oe().catch((c) => p.value = c.message);
                    }
                  }, null, 40, yr),
                  e("span", null, o(s.label), 1),
                  e("code", null, o(s.url), 1),
                  e("button", {
                    type: "button",
                    class: "btn btn-danger",
                    onClick: Ee((r) => fe(s), ["prevent"])
                  }, "删除模型", 8, kr)
                ], 2))), 128))
              ])) : w("", !0)
            ])
          ])) : u.value === "security" ? (n(), Z(Ja, { key: 4 })) : u.value === "permissions" ? (n(), Z(ra, { key: 5 })) : u.value === "mcp" ? (n(), Z(yi, { key: 6 })) : u.value === "life_settings" ? (n(), Z(ts, { key: 7 })) : l(K)(u.value) && l(S)(u.value) ? (n(), i("div", fr, [
            e("h2", null, o(l(S)(u.value).label), 1),
            l(S)(u.value).description ? (n(), i("p", $r, o(l(S)(u.value).description), 1)) : w("", !0),
            l(S)(u.value).plugin_name ? (n(), i("p", wr, o(l(S)(u.value).plugin_name), 1)) : w("", !0),
            (n(!0), i(N, null, B(l(S)(u.value).fields, (s) => (n(), i("div", {
              key: s.key,
              class: "field"
            }, [
              s.type === "bool" ? (n(), i("label", xr, [
                e("input", {
                  type: "checkbox",
                  checked: ue(u.value, s.key),
                  onChange: (r) => v.value = { ...v.value, [u.value]: { ...v.value[u.value], [s.key]: r.target.checked } }
                }, null, 40, Cr),
                h[22] || (h[22] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, o(s.label), 1),
                  s.help ? (n(), i("br", Sr)) : w("", !0),
                  s.help ? (n(), i("small", Pr, o(s.help), 1)) : w("", !0)
                ])
              ])) : s.type === "select" ? (n(), i(N, { key: 1 }, [
                e("label", null, o(s.label), 1),
                te(l(ie), {
                  class: "input",
                  "aria-label": s.label,
                  "model-value": String(v.value[u.value]?.[s.key] ?? ""),
                  options: s.options || [],
                  "onUpdate:modelValue": (r) => v.value[u.value] = { ...v.value[u.value], [s.key]: r }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                s.help ? (n(), i("p", Tr, o(s.help), 1)) : w("", !0)
              ], 64)) : s.type === "test" ? (n(), i(N, { key: 2 }, [
                e("label", null, o(s.label), 1),
                e("div", Ur, [
                  e("button", {
                    class: "btn btn-tonal",
                    type: "button",
                    disabled: A.value,
                    onClick: h[4] || (h[4] = (r) => W(u.value))
                  }, o(A.value ? l(t)("settings.testing") : s.label || "测试"), 9, Mr),
                  I.value ? (n(), i("span", Vr, o(I.value), 1)) : w("", !0)
                ]),
                s.help ? (n(), i("p", Er, o(s.help), 1)) : w("", !0)
              ], 64)) : (n(), i(N, { key: 3 }, [
                e("label", null, o(s.label), 1),
                e("input", {
                  class: "input",
                  type: s.type === "number" ? "number" : "text",
                  value: v.value[u.value]?.[s.key],
                  onInput: (r) => v.value[u.value] = { ...v.value[u.value], [s.key]: s.type === "number" ? Number(r.target.value) : r.target.value }
                }, null, 40, Ar),
                s.help ? (n(), i("p", Or, o(s.help), 1)) : w("", !0)
              ], 64))
            ]))), 128)),
            E.value ? (n(), i("div", zr, o(E.value), 1)) : w("", !0),
            e("div", Lr, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: h[5] || (h[5] = (s) => _e(u.value))
              }, o(l(t)("settings.save")), 1)
            ])
          ])) : C.value ? (n(), Z(Pi, {
            key: C.value,
            module: C.value || ""
          }, null, 8, ["module"])) : !l(U)(u.value) && l(x)(u.value)?.fields?.length ? (n(), i("div", Ir, [
            e("h2", null, o(l(q)(u.value)), 1),
            l(x)(u.value)?.descriptionKey ? (n(), i("p", Dr, o(l(t)(l(x)(u.value).descriptionKey)), 1)) : l(x)(u.value)?.description ? (n(), i("p", jr, o(l(x)(u.value).description), 1)) : w("", !0),
            (n(!0), i(N, null, B(l(x)(u.value).fields, (s) => (n(), i("div", {
              key: s.key,
              class: "field"
            }, [
              s.type === "bool" ? (n(), i("label", Fr, [
                e("input", {
                  type: "checkbox",
                  checked: ue(u.value, s.key),
                  onChange: (r) => v.value = { ...v.value, [u.value]: { ...v.value[u.value], [s.key]: r.target.checked } }
                }, null, 40, Nr),
                h[23] || (h[23] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, o(l(Y)(l(x)(u.value), s.key, `settings.${s.key}`)), 1),
                  s.help || s.helpKey ? (n(), i("br", Kr)) : w("", !0),
                  s.help || s.helpKey ? (n(), i("small", Rr, o(l(O)(l(x)(u.value), s.key, `settings.${s.key}Desc`)), 1)) : w("", !0)
                ])
              ])) : s.type === "select" ? (n(), i(N, { key: 1 }, [
                e("label", null, o(l(Y)(l(x)(u.value), s.key, `settings.${s.key}`)), 1),
                te(l(ie), {
                  class: "input",
                  "aria-label": l(Y)(l(x)(u.value), s.key, `settings.${s.key}`),
                  "model-value": String(v.value[u.value]?.[s.key] ?? ""),
                  options: s.options || [],
                  "onUpdate:modelValue": (r) => v.value[u.value] = { ...v.value[u.value], [s.key]: r }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                s.help || s.helpKey ? (n(), i("p", Hr, o(l(O)(l(x)(u.value), s.key, `settings.${s.key}Desc`)), 1)) : w("", !0)
              ], 64)) : (n(), i(N, { key: 2 }, [
                e("label", null, o(l(Y)(l(x)(u.value), s.key, `settings.${s.key}`)), 1),
                e("input", {
                  class: "input",
                  type: s.type === "number" ? "number" : "text",
                  value: v.value[u.value]?.[s.key],
                  onInput: (r) => v.value[u.value] = { ...v.value[u.value], [s.key]: s.type === "number" ? Number(r.target.value) : r.target.value }
                }, null, 40, Br),
                s.help || s.helpKey ? (n(), i("p", Jr, o(l(O)(l(x)(u.value), s.key, `settings.${s.key}Desc`)), 1)) : w("", !0)
              ], 64))
            ]))), 128)),
            E.value ? (n(), i("div", Wr, o(E.value), 1)) : w("", !0),
            e("div", qr, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: h[6] || (h[6] = (s) => ve(u.value))
              }, o(l(t)("settings.save")), 1)
            ])
          ])) : u.value === "about" ? (n(), Z(al, { key: 11 })) : u.value === "updates" ? (n(), Z(ql, { key: 12 })) : (n(), Z(wi, { key: 13 }))
        ])
      ])
    ]));
  }
});
export {
  tu as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".live2d-stage[data-v-ed3cc7f4]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-ed3cc7f4]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:none;cursor:grab;user-select:none;background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,#f3edf7,#e7e0ec 55%,#d0bcff33)}.stage-viewport[data-v-ed3cc7f4]:active{cursor:grabbing}.stage-canvas[data-v-ed3cc7f4]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-ed3cc7f4]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-ed3cc7f4]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-ed3cc7f4]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-ed3cc7f4]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-ed3cc7f4]:active{transform:scale(.96)}.stage-reset.dragging[data-v-ed3cc7f4]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-ed3cc7f4]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-ed3cc7f4]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-ed3cc7f4]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-bdd613ec]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-bdd613ec]{flex-direction:row-reverse}.avatar[data-v-bdd613ec]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-bdd613ec]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-bdd613ec]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-bdd613ec]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-bdd613ec]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-bdd613ec]{max-width:70%}.content[data-v-bdd613ec]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.user .content[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-bdd613ec]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-bdd613ec]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-bdd613ec]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-bdd613ec]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-bdd613ec]{margin:4px 0}.think-body b[data-v-bdd613ec]{color:var(--md-on-surface)}.think-summary[data-v-bdd613ec]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-bdd613ec]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-bdd613ec]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-bdd613ec]{justify-content:flex-end}.separator[data-v-bdd613ec]{color:var(--neutral-gray-10)}.emotion[data-v-bdd613ec]{font-weight:500}.chat-panel[data-v-3b7db97c]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-3b7db97c]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-3b7db97c]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-3b7db97c]{color:var(--md-error)}.chat-container[data-v-3b7db97c]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-3b7db97c]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-3b7db97c]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-3b7db97c]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-3b7db97c]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-3b7db97c]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-3b7db97c]{display:flex;gap:4px}.typing-dots span[data-v-3b7db97c]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-3b7db97c 1.4s infinite ease-in-out}.typing-dots span[data-v-3b7db97c]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-3b7db97c]:nth-child(2){animation-delay:-.16s}@keyframes bounce-3b7db97c{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-3b7db97c]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-3b7db97c]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-3b7db97c]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-3b7db97c]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-3b7db97c]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-3b7db97c],.pending-files[data-v-3b7db97c]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-3b7db97c]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-3b7db97c]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-3b7db97c]:hover{color:var(--error)}.pending-thumb[data-v-3b7db97c]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-3b7db97c]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-3b7db97c]{position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.attach-btn[data-v-3b7db97c]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-3b7db97c]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-3b7db97c]:disabled{opacity:.5;cursor:not-allowed}.send-button[data-v-3b7db97c]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-3b7db97c]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-3b7db97c]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-3b7db97c]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-3b7db97c]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-3b7db97c]{background:var(--success)}.disconnected .status-dot[data-v-3b7db97c]{background:var(--error)}.hint[data-v-3b7db97c]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-95ba671e]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-95ba671e]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-95ba671e]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-95ba671e]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-95ba671e]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-95ba671e]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-95ba671e]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-95ba671e]{margin-bottom:var(--space-xl)}.section-header[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-95ba671e]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.section-value[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-30)}.mood-display[data-v-95ba671e]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-95ba671e]{margin-bottom:var(--space-md)}.mood-label[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600}.energy-bar[data-v-95ba671e]{height:8px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.energy-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out),background-color var(--duration-medium) var(--ease-out)}.emotion-bars[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-95ba671e]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-95ba671e]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-95ba671e]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.task-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-id[data-v-95ba671e]{font-family:monospace;font-size:var(--font-size-sm);color:var(--neutral-gray-50)}.task-status[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary)}.connection-info[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-sm);font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.link-btn[data-v-95ba671e]{border:none;background:none;color:var(--brand-primary);font-size:var(--font-size-xs);cursor:pointer;padding:0}.link-btn[data-v-95ba671e]:disabled{opacity:.5;cursor:default}.memory-stats[data-v-95ba671e]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);margin-bottom:var(--space-sm)}.memory-stat[data-v-95ba671e]{padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);text-align:center}.memory-stat-label[data-v-95ba671e]{display:block;font-size:var(--font-size-xs);color:var(--neutral-gray-30);margin-bottom:2px}.memory-stat-value[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-50)}.memory-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-xs)}.memory-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-sm);padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);font-size:var(--font-size-sm)}.memory-text[data-v-95ba671e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--neutral-gray-50)}.memory-strength[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary);font-weight:600}.connection-dot[data-v-95ba671e]{width:8px;height:8px;border-radius:50%;background:var(--error)}.connection-dot.connected[data-v-95ba671e]{background:var(--success)}.state-source[data-v-95ba671e]{margin-left:auto;font-size:var(--font-size-xs);font-weight:700;color:var(--brand-primary);letter-spacing:.5px}.agents-display[data-v-95ba671e]{padding:var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.agent-count[data-v-95ba671e]{display:flex;align-items:baseline;gap:var(--space-sm)}.agent-number[data-v-95ba671e]{font-size:var(--font-size-xl);font-weight:700;color:var(--neutral-gray-30)}.agent-number.online[data-v-95ba671e]{color:var(--success)}.agent-label[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.agent-offline[data-v-95ba671e]{margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.chat-page[data-v-157876d6]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-157876d6]{grid-template-columns:1fr}.stage-column[data-v-157876d6]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-157876d6]{flex:1;min-height:240px}.status-panel[data-v-157876d6]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-157876d6]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-157876d6]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-157876d6]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-157876d6]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-157876d6]:hover,.page-resizer[data-v-157876d6]:active{background:var(--md-primary)}.chat-column[data-v-157876d6]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-157876d6]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media (max-width: 960px){.chat-page[data-v-157876d6]{display:flex;flex-direction:column}.stage-column[data-v-157876d6]{flex:1;min-height:0}.page-resizer[data-v-157876d6]{display:none}.chat-column[data-v-157876d6]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);transition:transform var(--transition-normal)}.chat-column.open[data-v-157876d6]{transform:translate(0)}}.plugins-page[data-v-b484d3da]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-b484d3da]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-b484d3da]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-b484d3da],.pp-hero h1[data-v-b484d3da]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-b484d3da]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-b484d3da]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-b484d3da]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.pp-stats[data-v-b484d3da]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-b484d3da]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-b484d3da]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-b484d3da]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-b484d3da]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-b484d3da]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-b484d3da]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-b484d3da]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-b484d3da]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-b484d3da var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-b484d3da{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media (hover: hover) and (pointer: fine){#app .plugins-page .plugin-card[data-v-b484d3da]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-b484d3da]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-b484d3da]{opacity:.62}.plugin-top[data-v-b484d3da]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-b484d3da]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-b484d3da]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-b484d3da]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-b484d3da]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-b484d3da]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-b484d3da]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-b484d3da]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-b484d3da]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-b484d3da]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-b484d3da]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-b484d3da]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-b484d3da]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-b484d3da]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-b484d3da]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-b484d3da]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-b484d3da]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-b484d3da]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-b484d3da]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-b484d3da]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-b484d3da]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-b484d3da]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-b484d3da]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-b484d3da]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-b484d3da]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-b484d3da]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-b484d3da]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-b484d3da]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-b484d3da]{white-space:nowrap}#app .plugins-page .btn[data-v-b484d3da]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media (hover: hover) and (pointer: fine){#app .plugins-page .btn[data-v-b484d3da]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-b484d3da]:disabled{opacity:.6;cursor:not-allowed}#app .plugins-page .btn-tonal[data-v-b484d3da]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .plugins-page .btn-danger[data-v-b484d3da]{background:var(--md-error-container);color:var(--md-on-error-container)}.empty-state[data-v-b484d3da]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-b484d3da]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-b484d3da]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-b484d3da]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-b484d3da]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-b484d3da]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-b484d3da]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-b484d3da],.pd-leave-to[data-v-b484d3da]{opacity:0}.pd-enter-active .pd-dialog[data-v-b484d3da]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-b484d3da]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-b484d3da],.pd-leave-to .pd-dialog[data-v-b484d3da]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-b484d3da]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-b484d3da]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-b484d3da]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-b484d3da]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-b484d3da]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-b484d3da]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-b484d3da]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-b484d3da]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-b484d3da]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-b484d3da]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-b484d3da]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-b484d3da]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-b484d3da]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-b484d3da]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-b484d3da]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-b484d3da]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-b484d3da]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-b484d3da]{color:var(--md-error)}.pd-foot[data-v-b484d3da]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-b484d3da]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn-tonal[data-v-b484d3da]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pd-foot .btn-danger[data-v-b484d3da]{background:var(--md-error-container);color:var(--md-on-error-container)}.pd-foot .btn[data-v-b484d3da]:disabled{opacity:.6;cursor:not-allowed}@media (prefers-reduced-motion: reduce){.pd-enter-active[data-v-b484d3da],.pd-leave-active[data-v-b484d3da],.pd-enter-active .pd-dialog[data-v-b484d3da],.pd-leave-active .pd-dialog[data-v-b484d3da]{transition:none}.pd-enter-from .pd-dialog[data-v-b484d3da],.pd-leave-to .pd-dialog[data-v-b484d3da]{transform:none}}.life-settings[data-v-537538f7]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-537538f7]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-537538f7 .52s var(--ls-spring) both}.ls-hero-main[data-v-537538f7]{min-width:0}.ls-eyebrow[data-v-537538f7]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-537538f7]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-537538f7]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-537538f7]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media (hover: hover) and (pointer: fine){#app .ls-save[data-v-537538f7]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-537538f7]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-537538f7]{font-size:16px}.ls-grid[data-v-537538f7]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-537538f7]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-537538f7 .52s var(--ls-spring) both}@media (hover: hover) and (pointer: fine){.ls-card[data-v-537538f7]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-537538f7]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-537538f7]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-537538f7]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-537538f7]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-537538f7]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-537538f7]{grid-column:1 / -1}.ls-card-head[data-v-537538f7]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-537538f7]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-537538f7]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-537538f7]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-537538f7]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-537538f7]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-537538f7]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-537538f7]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-537538f7]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-537538f7]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-537538f7]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-537538f7]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-537538f7]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-537538f7]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-537538f7]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-537538f7]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-537538f7]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-537538f7]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-537538f7]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-537538f7]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-537538f7]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-537538f7]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-537538f7]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-537538f7]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-537538f7]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-537538f7]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-537538f7]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-537538f7]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-537538f7]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-537538f7]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-537538f7]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media (hover: hover) and (pointer: fine){.ls-model[data-v-537538f7]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-537538f7]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-537538f7]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}.ls-model b[data-v-537538f7]{font-size:13px;word-break:break-all}.ls-model span[data-v-537538f7]{font-size:12px;color:var(--md-on-surface-variant)}.ls-state[data-v-537538f7]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-537538f7 .32s var(--ls-spring) both}.ls-mail-actions[data-v-537538f7]{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}#app .ls-mail-actions .ls-test[data-v-537538f7]{min-height:44px;padding:0 20px;border:0;border-radius:999px;cursor:pointer;font:700 13px/1 inherit;background:var(--md-secondary-container);color:var(--md-on-secondary-container);transition:transform var(--duration-medium) var(--ease-spring),box-shadow var(--duration-medium) var(--ease-out)}@media (hover: hover) and (pointer: fine){#app .ls-mail-actions .ls-test[data-v-537538f7]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .ls-mail-actions .ls-test[data-v-537538f7]:disabled{opacity:.55;cursor:not-allowed}.ls-mail-result[data-v-537538f7]{margin:4px 0 0;padding:12px 15px;border-radius:16px;font-size:12.5px;line-height:1.55;font-weight:600}.ls-mail-result.ok[data-v-537538f7]{background:var(--md-success-container);color:var(--md-on-success-container)}.ls-mail-result.bad[data-v-537538f7]{background:var(--md-error-container);color:var(--md-on-error-container)}@keyframes ls-rise-537538f7{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-537538f7{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media (max-width: 760px){.ls-grid[data-v-537538f7],.ls-row[data-v-537538f7],.ls-models[data-v-537538f7]{grid-template-columns:1fr}}@media (prefers-reduced-motion: reduce){.ls-hero[data-v-537538f7],.ls-card[data-v-537538f7],.ls-state[data-v-537538f7]{animation:none}}.about[data-v-f0cbac94]{display:flex;flex-direction:column;gap:26px}.identity[data-v-f0cbac94]{display:flex;align-items:center;gap:16px}.app-icon[data-v-f0cbac94]{flex:none;width:56px;height:56px;border-radius:16px;background:var(--md-primary);color:var(--md-on-primary);display:grid;place-items:center;font-size:20px;font-weight:750;letter-spacing:-1px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 35%,transparent)}.app-id[data-v-f0cbac94]{flex:1;min-width:0}.app-id h2[data-v-f0cbac94]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-f0cbac94]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-f0cbac94]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-f0cbac94]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-f0cbac94]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-f0cbac94]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-f0cbac94]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.btn.sm[data-v-f0cbac94]{height:34px;padding-inline:16px;font-size:13px}.credits[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-f0cbac94]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-f0cbac94]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-f0cbac94]{font-size:16px;font-weight:650}.person-info .role[data-v-f0cbac94]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-f0cbac94]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-f0cbac94]{margin-top:6px}.contribs[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-f0cbac94]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-f0cbac94]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-f0cbac94]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-f0cbac94]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-f0cbac94]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-f0cbac94]{margin-left:auto}.status-chip[data-v-f0cbac94]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-f0cbac94]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-f0cbac94]:hover{text-decoration:underline}.muted[data-v-f0cbac94]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-f0cbac94]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-f0cbac94]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-f0cbac94]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-f0cbac94]{flex:1;min-width:0}.us-hero-text b[data-v-f0cbac94]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-f0cbac94]{font-size:13px;opacity:.85}.us-hero-text em[data-v-f0cbac94]{font-style:normal;font-weight:700}.us-hero-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-f0cbac94]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-f0cbac94]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-f0cbac94]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-f0cbac94]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-f0cbac94]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-f0cbac94]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-f0cbac94]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-f0cbac94]{font-weight:700}.us-apply-label[data-v-f0cbac94]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-f0cbac94]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-f0cbac94]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-f0cbac94]{animation:us-spin-f0cbac94 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-f0cbac94],.us-apply-banner.failed .us-spinner[data-v-f0cbac94]{display:none}.us-apply-log[data-v-f0cbac94],.us-apply-error[data-v-f0cbac94]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-f0cbac94{to{transform:rotate(360deg)}}.alert[data-v-f0cbac94]{color:var(--md-error)}.updates[data-v-6bbe694b]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-6bbe694b]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-6bbe694b]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-6bbe694b]{display:flex;align-items:center;gap:12px}.us-ico[data-v-6bbe694b]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-6bbe694b]{flex:1;min-width:0}.us-title[data-v-6bbe694b]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-6bbe694b]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-6bbe694b]{display:flex;align-items:center;gap:8px}.us-tag[data-v-6bbe694b]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-6bbe694b]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-6bbe694b]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-source[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-6bbe694b]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-6bbe694b]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-6bbe694b]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-6bbe694b]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-6bbe694b]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-6bbe694b]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-6bbe694b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-6bbe694b]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-6bbe694b]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-6bbe694b]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-6bbe694b]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-6bbe694b]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-6bbe694b]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-6bbe694b]{flex:1;min-width:0}.us-hero-text b[data-v-6bbe694b]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-6bbe694b]{font-size:13px;opacity:.85}.us-hero-text em[data-v-6bbe694b]{font-style:normal;font-weight:700}.us-hero-actions[data-v-6bbe694b]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-6bbe694b]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-6bbe694b]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-6bbe694b]{font-weight:700}.us-apply-label[data-v-6bbe694b]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-6bbe694b]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-6bbe694b]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-6bbe694b]{animation:us-spin-6bbe694b .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-6bbe694b],.us-apply-banner.failed .us-spinner[data-v-6bbe694b]{display:none}.us-apply-log[data-v-6bbe694b],.us-apply-error[data-v-6bbe694b]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-6bbe694b{to{transform:rotate(360deg)}}.us-table[data-v-6bbe694b]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-6bbe694b]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-6bbe694b]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-6bbe694b]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-6bbe694b]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-6bbe694b]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-6bbe694b]{background:var(--md-success)}.us-dot.warn[data-v-6bbe694b]{background:#e0a800}.us-dot.bad[data-v-6bbe694b]{background:var(--md-error)}.us-ver[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-6bbe694b]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-6bbe694b]{font-weight:650}.us-ver b.good[data-v-6bbe694b]{color:var(--md-success)}.us-arrow[data-v-6bbe694b]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-6bbe694b]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-6bbe694b]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-6bbe694b]:hover{text-decoration:underline}.us-empty[data-v-6bbe694b]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-6bbe694b]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-6bbe694b]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.btn.sm[data-v-6bbe694b]{height:34px;padding-inline:16px;font-size:13px}.btn.xs[data-v-6bbe694b]{height:30px;padding-inline:12px;font-size:12px}.alert[data-v-6bbe694b]{color:var(--md-error)}@media (max-width: 720px){.us-row[data-v-6bbe694b]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-6bbe694b]{display:none}.us-hero[data-v-6bbe694b]{flex-wrap:wrap}.us-hero-actions[data-v-6bbe694b]{width:100%}}.provider-panel[data-v-dc98b94b]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-dc98b94b]{display:flex;align-items:center;gap:14px}.pp-back[data-v-dc98b94b]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-dc98b94b]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-dc98b94b]{flex:1;min-width:0}.pp-editor-title h2[data-v-dc98b94b]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-dc98b94b]{margin:3px 0 0}.pp-section[data-v-dc98b94b]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-dc98b94b]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-dc98b94b]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-dc98b94b]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-dc98b94b]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-dc98b94b]{margin-bottom:0}.pp-span[data-v-dc98b94b]{grid-column:1 / -1}.pp-req[data-v-dc98b94b]{color:var(--md-error);margin-left:2px}.pp-key[data-v-dc98b94b]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-dc98b94b]{flex:1}.pp-key-toggle[data-v-dc98b94b]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-dc98b94b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-dc98b94b]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-dc98b94b]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-dc98b94b]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-dc98b94b]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-dc98b94b]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-dc98b94b]{animation:pp-pulse-dc98b94b 1s ease-in-out infinite}@keyframes pp-pulse-dc98b94b{50%{opacity:.15}}.pp-probe[data-v-dc98b94b]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-dc98b94b]{color:var(--md-success)}.pp-probe.err[data-v-dc98b94b]{color:var(--md-error)}.pp-discovered[data-v-dc98b94b]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-dc98b94b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-dc98b94b]{flex:1;min-width:160px}.pp-mini[data-v-dc98b94b]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-dc98b94b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-models[data-v-dc98b94b]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-dc98b94b]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-dc98b94b]:first-child{border-top:0}.pp-model.off[data-v-dc98b94b]{opacity:.5}.pp-model-name[data-v-dc98b94b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-dc98b94b]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-dc98b94b]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-dc98b94b]{color:#e0a800;cursor:default}.pp-switch[data-v-dc98b94b]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-dc98b94b]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-dc98b94b]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-dc98b94b]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-dc98b94b]{display:flex;gap:10px}.pp-list-head[data-v-dc98b94b]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-dc98b94b]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-dc98b94b]{margin:3px 0 0}.pp-list-actions[data-v-dc98b94b]{display:flex;gap:8px}.pp-cards[data-v-dc98b94b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-dc98b94b]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media (hover: hover) and (pointer: fine){.pp-card[data-v-dc98b94b]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-dc98b94b]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-dc98b94b]{opacity:.62}.pp-card-head[data-v-dc98b94b]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-dc98b94b]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-dc98b94b]{width:26px;height:26px}.pp-card-id[data-v-dc98b94b]{flex:1;min-width:0}.pp-card-id strong[data-v-dc98b94b]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-dc98b94b]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-dc98b94b]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-dc98b94b]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-dc98b94b]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-dc98b94b]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-dc98b94b]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-dc98b94b]{color:var(--md-error)}.pp-chips[data-v-dc98b94b]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-dc98b94b]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-dc98b94b],.pp-chip.empty[data-v-dc98b94b]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-dc98b94b]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.btn.sm[data-v-dc98b94b]{height:32px;padding-inline:12px;font-size:12.5px}.btn.xs[data-v-dc98b94b]{height:28px;padding-inline:12px;font-size:12px}.pp-empty[data-v-dc98b94b]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media (max-width: 640px){.pp-grid[data-v-dc98b94b],.pp-cards[data-v-dc98b94b]{grid-template-columns:1fr}}.pairing-panel[data-v-0559b1b2]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-0559b1b2]{margin:12px 0;color:var(--md-on-surface-variant)}article[data-v-0559b1b2]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-0559b1b2]{font-size:24px;letter-spacing:4px}button[data-v-0559b1b2]{padding:8px 12px}.security-panel[data-v-bd35de8f]{max-width:920px}.sec-stack[data-v-bd35de8f]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-bd35de8f]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-bd35de8f]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-bd35de8f]{font-size:15px;font-weight:700}.sec-chip[data-v-bd35de8f]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-bd35de8f]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-bd35de8f]{margin:2px 0 12px}.sec-pin-grid[data-v-bd35de8f]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-bd35de8f]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-bd35de8f]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-bd35de8f]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-bd35de8f]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-bd35de8f]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-bd35de8f]:hover{background:var(--md-surface-container)}.page-item[data-v-bd35de8f]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-bd35de8f]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-bd35de8f]{width:44px;height:26px}.page-item .toggle-slider[data-v-bd35de8f]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-bd35de8f]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-bd35de8f]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-bd35de8f]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-bd35de8f]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-bd35de8f]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-bd35de8f]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-bd35de8f]{margin-top:12px}.sec-error[data-v-bd35de8f]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media (max-width: 640px){.sec-pin-grid[data-v-bd35de8f]{grid-template-columns:1fr}}.mcp-panel[data-v-3b21cb32]{max-width:900px}.mcp-head[data-v-3b21cb32]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-3b21cb32]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-3b21cb32]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-3b21cb32]{display:flex;gap:10px}.error-banner[data-v-3b21cb32]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-3b21cb32]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-3b21cb32]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-3b21cb32]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-3b21cb32]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-row[data-v-3b21cb32]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-3b21cb32]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-3b21cb32]{flex:1}.mcp-field>span[data-v-3b21cb32]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-3b21cb32],.mcp-field select[data-v-3b21cb32],.mcp-field textarea[data-v-3b21cb32]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field textarea[data-v-3b21cb32]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-3b21cb32]:focus,.mcp-field select[data-v-3b21cb32]:focus,.mcp-field textarea[data-v-3b21cb32]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-3b21cb32]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-3b21cb32]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.btn[data-v-3b21cb32]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-3b21cb32]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-3b21cb32]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-3b21cb32]:disabled{opacity:.6;cursor:not-allowed}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.usage-page[data-v-a7476de1]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-a7476de1]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-a7476de1]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-a7476de1]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-a7476de1]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-a7476de1]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-a7476de1]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-a7476de1]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media (hover: hover) and (pointer: fine){#app .usage-page .btn[data-v-a7476de1]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-a7476de1]:disabled{opacity:.55;cursor:not-allowed}#app .usage-page .btn-tonal[data-v-a7476de1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .usage-page .btn-danger[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.overview[data-v-a7476de1]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-a7476de1]{display:grid;place-items:center}.donut[data-v-a7476de1]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-a7476de1]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-a7476de1]{fill:none;stroke-width:5}.donut-track[data-v-a7476de1]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-a7476de1]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-a7476de1]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-a7476de1]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-a7476de1]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-a7476de1]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-a7476de1]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-a7476de1]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-a7476de1]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-a7476de1]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-a7476de1]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-a7476de1]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-a7476de1]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-a7476de1]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-a7476de1]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-a7476de1]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-a7476de1]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-a7476de1]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-a7476de1]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-a7476de1]{background:var(--md-primary)}.dot.completion[data-v-a7476de1]{background:var(--md-tertiary)}.mini-stack[data-v-a7476de1]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-a7476de1]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media (hover: hover) and (pointer: fine){.mini[data-v-a7476de1]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-a7476de1]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-a7476de1]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-a7476de1]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-a7476de1]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-a7476de1]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-a7476de1]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-a7476de1]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-a7476de1]{position:absolute;inset:0}.grid span[data-v-a7476de1]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-a7476de1]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-a7476de1]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-a7476de1]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-a7476de1]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-a7476de1]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-a7476de1]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-a7476de1]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-a7476de1]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-a7476de1]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media (hover: hover) and (pointer: fine){.model-card[data-v-a7476de1]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-a7476de1]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-a7476de1]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-a7476de1]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-a7476de1]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-a7476de1]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-a7476de1]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-a7476de1]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-a7476de1]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-a7476de1]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-a7476de1]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-a7476de1]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}@keyframes up-a7476de1{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media (max-width: 980px){.overview[data-v-a7476de1]{grid-template-columns:1fr 1fr}.mini-stack[data-v-a7476de1]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media (max-width: 640px){.overview[data-v-a7476de1],.mini-stack[data-v-a7476de1]{grid-template-columns:1fr}.chart[data-v-a7476de1]{height:200px;padding-left:34px}.grid span i[data-v-a7476de1]{left:-34px;width:28px}.axis span[data-v-a7476de1]{font-size:11px}}\n";document.head.appendChild(s)}})();
