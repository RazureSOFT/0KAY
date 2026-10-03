var Ke = Object.defineProperty;
var He = (z, t, b) => t in z ? Ke(z, t, { enumerable: !0, configurable: !0, writable: !0, value: b }) : z[t] = b;
var F = (z, t, b) => He(z, typeof t != "symbol" ? t + "" : t, b);
import { defineComponent as X, reactive as Ye, ref as P, onMounted as le, openBlock as u, createElementBlock as c, createElementVNode as e, createTextVNode as q, toDisplayString as o, withDirectives as U, vModelCheckbox as te, vModelText as L, Fragment as K, renderList as J, normalizeClass as Y, createCommentVNode as M, computed as W, onUnmounted as Me, unref as l, withKeys as Je, createStaticVNode as We, createVNode as se, vModelDynamic as qe, watch as ze, vModelSelect as Ge, shallowRef as Ne, createBlock as ee, resolveDynamicComponent as Xe, withModifiers as Re } from "vue";
import { useRouter as Le, useRoute as Ze } from "vue-router";
import { useI18n as oe } from "vue-i18n";
import ue, { apiGet as ie, apiPost as ye, ApiError as De, useConfirm as Ee, useProvidersStore as Qe, PROVIDERS as Se, getLanguage as et, LOCALES as tt, setLanguage as st, useWizardStore as Te, useSettingsMeta as Ae, useUIPatchesStore as Fe, useSettingsSectionsStore as lt, DEFAULT_LIVE2D_MODELS as ot } from "@0kay/host";
import { L as nt } from "./assets/Live2DStage-C20BJYzk.js";
import { _ as ne } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
const at = { class: "life-settings" }, it = { class: "ls-hero" }, rt = ["disabled"], ut = { class: "ls-grid" }, dt = { class: "ls-card" }, ct = { class: "ls-switch" }, pt = { class: "ls-switch" }, vt = { class: "ls-field" }, ht = { class: "ls-card" }, mt = { class: "ls-note" }, _t = { class: "ls-models" }, gt = ["onClick"], bt = {
  key: 0,
  class: "ls-empty"
}, ft = { class: "ls-models" }, yt = ["onClick"], kt = {
  key: 0,
  class: "ls-empty"
}, wt = { class: "ls-card" }, $t = { class: "ls-row" }, Ct = { class: "ls-field" }, Pt = { class: "ls-field" }, St = { class: "ls-row" }, xt = { class: "ls-field" }, Mt = { class: "ls-field" }, Et = { class: "ls-row" }, Tt = { class: "ls-field" }, At = { class: "ls-field" }, Ut = { class: "ls-row" }, Nt = { class: "ls-field" }, Rt = { class: "ls-field" }, It = { class: "ls-row" }, Ot = { class: "ls-field" }, Vt = { class: "ls-field" }, zt = { class: "ls-field" }, Lt = { class: "ls-switch" }, Dt = { class: "ls-switch" }, Ft = { class: "ls-mail-actions" }, Bt = ["disabled"], jt = ["disabled"], Kt = { class: "ls-card" }, Ht = { class: "ls-switch" }, Yt = { class: "ls-card ls-card-wide" }, Jt = { class: "ls-row" }, Wt = { class: "ls-switch" }, qt = { class: "ls-switch" }, Gt = { class: "ls-row" }, Xt = { class: "ls-field" }, Zt = { class: "ls-field" }, Qt = { class: "ls-row" }, es = { class: "ls-field" }, ts = { class: "ls-field" }, ss = { class: "ls-row" }, ls = { class: "ls-field" }, os = { class: "ls-field" }, ns = {
  key: 0,
  class: "ls-state"
}, as = /* @__PURE__ */ X({
  __name: "LifeSettingsPanel",
  setup(z) {
    const t = Ye({
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
    }), b = P(""), g = P(!1), k = P([]), w = P(""), p = P([]), y = P(!1), $ = P(""), r = P(null);
    function d() {
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
    async function a(S = !1) {
      y.value = !0, $.value = "", r.value = null;
      try {
        const n = await fetch("/api/life/companion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "mail_test", payload: { to: S ? t.mail_from || t.mail_imap_user : "", config: d() } })
        }), h = await n.json().catch(() => ({}));
        if (!n.ok) throw new Error(h.error || `HTTP ${n.status}`);
        const v = h.imap || {}, x = h.smtp || {}, A = h.sent;
        r.value = !!v.ok && !!x.ok && (!A || A.ok);
        const E = [
          `收信 IMAP：${v.ok ? `✓ 登录成功${v.messages != null ? ` · 收件箱 ${v.messages} 封` : ""}` : `✗ ${v.error || "失败"}`}`,
          `发信 SMTP：${x.ok ? "✓ 登录成功" : `✗ ${x.error || "失败"}`}`
        ];
        A && E.push(`测试邮件：${A.ok ? `✓ 已发送至 ${A.to}` : `✗ ${A.error || "发送失败"}`}`), $.value = E.join("　·　");
      } catch (n) {
        r.value = !1, $.value = n?.message || "测试失败";
      } finally {
        y.value = !1;
      }
    }
    async function i() {
      try {
        const [S, n] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (S.ok && Object.assign(t, (await S.json()).values || {}), n.ok) {
          const h = await n.json();
          p.value = Array.isArray(h.models) ? h.models.map((v) => ({ id: v.id, provider: v.provider || "custom", supports_thinking: v.supports_thinking })).filter((v) => v.id) : [], k.value = p.value.map((v) => v.id), w.value = "mocr 当前模型目录（由 Core 同步）";
        }
      } catch {
        b.value = "无法读取 LIFE 设置或模型目录";
      }
    }
    async function _() {
      g.value = !0, b.value = "";
      try {
        const S = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: t }) });
        if (!S.ok) throw new Error(String(S.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: t.screen_watch, computer_use: t.computer_use, report_agent_host: t.report_agent_host }) }), b.value = "已保存，LIFE 会在下一次设置轮询时应用。";
      } catch {
        b.value = "保存失败";
      } finally {
        g.value = !1;
      }
    }
    return le(i), (S, n) => (u(), c("section", at, [
      e("header", it, [
        n[28] || (n[28] = e("div", { class: "ls-hero-main" }, [
          e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS"),
          e("h2", null, "L.I.F.E 专属设置"),
          e("p", { class: "ls-sub" }, "敏感功能默认关闭；凭据仅保存在本机 Core settings 文件。")
        ], -1)),
        e("button", {
          class: "ls-save",
          disabled: g.value,
          onClick: _
        }, [
          n[27] || (n[27] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          q(o(g.value ? "保存中…" : "保存"), 1)
        ], 8, rt)
      ]),
      e("div", ut, [
        e("article", dt, [
          n[34] || (n[34] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-1" }, "◉"),
            e("h3", null, "Agent 主机权限")
          ], -1)),
          e("label", ct, [
            U(e("input", {
              "onUpdate:modelValue": n[0] || (n[0] = (h) => t.screen_watch = h),
              type: "checkbox"
            }, null, 512), [
              [te, t.screen_watch]
            ]),
            n[29] || (n[29] = e("span", { class: "ls-track" }, null, -1)),
            n[30] || (n[30] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许屏幕观察"),
              e("small", null, "读取当前屏幕内容")
            ], -1))
          ]),
          e("label", pt, [
            U(e("input", {
              "onUpdate:modelValue": n[1] || (n[1] = (h) => t.computer_use = h),
              type: "checkbox"
            }, null, 512), [
              [te, t.computer_use]
            ]),
            n[31] || (n[31] = e("span", { class: "ls-track" }, null, -1)),
            n[32] || (n[32] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许计算机操作"),
              e("small", null, "执行鼠标/键盘操作")
            ], -1))
          ]),
          e("label", vt, [
            n[33] || (n[33] = e("span", null, "指定 Agent 主机（可选）", -1)),
            U(e("input", {
              "onUpdate:modelValue": n[2] || (n[2] = (h) => t.report_agent_host = h),
              placeholder: "hostname 或地址"
            }, null, 512), [
              [L, t.report_agent_host]
            ])
          ])
        ]),
        e("article", ht, [
          n[35] || (n[35] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-2" }, "✦"),
            e("h3", null, "THINK / OUTPUT 模型")
          ], -1)),
          e("p", mt, o(w.value || "正在读取 mocr 模型目录…"), 1),
          n[36] || (n[36] = e("p", { class: "ls-label" }, "THINK · 内部思考、记忆与工具规划", -1)),
          e("div", _t, [
            (u(!0), c(K, null, J(p.value, (h) => (u(), c("button", {
              key: "think-" + h.id,
              type: "button",
              class: Y(["ls-model", { selected: t.think_model === h.id }]),
              onClick: (v) => t.think_model = h.id
            }, [
              e("b", null, o(h.id), 1),
              e("span", null, o(h.provider) + " · " + o(h.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, gt))), 128)),
            p.value.length ? M("", !0) : (u(), c("span", bt, "暂无模型"))
          ]),
          n[37] || (n[37] = e("p", { class: "ls-label" }, "OUTPUT · 最终人格化回复", -1)),
          e("div", ft, [
            (u(!0), c(K, null, J(p.value, (h) => (u(), c("button", {
              key: "output-" + h.id,
              type: "button",
              class: Y(["ls-model", { selected: t.output_model === h.id }]),
              onClick: (v) => t.output_model = h.id
            }, [
              e("b", null, o(h.id), 1),
              e("span", null, o(h.provider) + " · output", 1)
            ], 10, yt))), 128)),
            p.value.length ? M("", !0) : (u(), c("span", kt, "暂无模型"))
          ])
        ]),
        e("article", wt, [
          n[53] || (n[53] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-3" }, "✉"),
            e("h3", null, "邮件收发")
          ], -1)),
          n[54] || (n[54] = e("p", { class: "ls-note" }, [
            q("收信走 IMAP，发信走 SMTP；密码仅保存在本机 Core settings 文件。可填 "),
            e("code", null, "mailbox.json"),
            q(" 做离线收信。")
          ], -1)),
          n[55] || (n[55] = e("p", { class: "ls-label" }, "收信 · IMAP", -1)),
          e("div", $t, [
            e("label", Ct, [
              n[38] || (n[38] = e("span", null, "IMAP 主机", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[3] || (n[3] = (h) => t.mail_imap_host = h),
                placeholder: "imap.example.com"
              }, null, 512), [
                [L, t.mail_imap_host]
              ])
            ]),
            e("label", Pt, [
              n[39] || (n[39] = e("span", null, "端口", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[4] || (n[4] = (h) => t.mail_imap_port = h),
                type: "number",
                placeholder: "993"
              }, null, 512), [
                [
                  L,
                  t.mail_imap_port,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("div", St, [
            e("label", xt, [
              n[40] || (n[40] = e("span", null, "用户名", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[5] || (n[5] = (h) => t.mail_imap_user = h),
                placeholder: "user@example.com"
              }, null, 512), [
                [L, t.mail_imap_user]
              ])
            ]),
            e("label", Mt, [
              n[41] || (n[41] = e("span", null, "密码 / 应用专用密码", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[6] || (n[6] = (h) => t.mail_imap_password = h),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [L, t.mail_imap_password]
              ])
            ])
          ]),
          n[56] || (n[56] = e("p", { class: "ls-label" }, "发信 · SMTP", -1)),
          e("div", Et, [
            e("label", Tt, [
              n[42] || (n[42] = e("span", null, "SMTP 主机", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[7] || (n[7] = (h) => t.mail_smtp_host = h),
                placeholder: "smtp.example.com"
              }, null, 512), [
                [L, t.mail_smtp_host]
              ])
            ]),
            e("label", At, [
              n[43] || (n[43] = e("span", null, "端口", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[8] || (n[8] = (h) => t.mail_smtp_port = h),
                type: "number",
                placeholder: "465"
              }, null, 512), [
                [
                  L,
                  t.mail_smtp_port,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("div", Ut, [
            e("label", Nt, [
              n[44] || (n[44] = e("span", null, "用户名", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[9] || (n[9] = (h) => t.mail_smtp_user = h),
                placeholder: "user@example.com"
              }, null, 512), [
                [L, t.mail_smtp_user]
              ])
            ]),
            e("label", Rt, [
              n[45] || (n[45] = e("span", null, "密码 / 应用专用密码", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[10] || (n[10] = (h) => t.mail_smtp_password = h),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [L, t.mail_smtp_password]
              ])
            ])
          ]),
          e("div", It, [
            e("label", Ot, [
              n[46] || (n[46] = e("span", null, "发件人地址（可选）", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[11] || (n[11] = (h) => t.mail_from = h),
                placeholder: "留空用 SMTP 用户名"
              }, null, 512), [
                [L, t.mail_from]
              ])
            ]),
            e("label", Vt, [
              n[47] || (n[47] = e("span", null, "发件人昵称（可选）", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[12] || (n[12] = (h) => t.mail_from_name = h),
                placeholder: "默认 0KAY"
              }, null, 512), [
                [L, t.mail_from_name]
              ])
            ])
          ]),
          e("label", zt, [
            n[48] || (n[48] = e("span", null, "离线邮箱 JSON（可选）", -1)),
            U(e("input", {
              "onUpdate:modelValue": n[13] || (n[13] = (h) => t.mail_mailbox_path = h),
              placeholder: "mailbox.json"
            }, null, 512), [
              [L, t.mail_mailbox_path]
            ])
          ]),
          e("label", Lt, [
            U(e("input", {
              "onUpdate:modelValue": n[14] || (n[14] = (h) => t.mail_auto_approve_all = h),
              type: "checkbox"
            }, null, 512), [
              [te, t.mail_auto_approve_all]
            ]),
            n[49] || (n[49] = e("span", { class: "ls-track" }, null, -1)),
            n[50] || (n[50] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "全部自动审批"),
              e("small", null, "所有需确认的权限直接通过，不再弹窗询问")
            ], -1))
          ]),
          e("label", Dt, [
            U(e("input", {
              "onUpdate:modelValue": n[15] || (n[15] = (h) => t.mail_require_approval = h),
              type: "checkbox"
            }, null, 512), [
              [te, t.mail_require_approval]
            ]),
            n[51] || (n[51] = e("span", { class: "ls-track" }, null, -1)),
            n[52] || (n[52] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "邮件操作需弹窗确认"),
              e("small", null, "读取 / 发送邮件前先在 WebUI 询问你")
            ], -1))
          ]),
          e("div", Ft, [
            e("button", {
              type: "button",
              class: "ls-test",
              disabled: y.value,
              onClick: n[16] || (n[16] = (h) => a(!1))
            }, o(y.value ? "测试中…" : "测试连接"), 9, Bt),
            e("button", {
              type: "button",
              class: "ls-test",
              disabled: y.value,
              onClick: n[17] || (n[17] = (h) => a(!0))
            }, "发送测试邮件", 8, jt)
          ]),
          $.value ? (u(), c("p", {
            key: 0,
            class: Y(["ls-mail-result", r.value ? "ok" : "bad"])
          }, o($.value), 3)) : M("", !0)
        ]),
        e("article", Kt, [
          n[59] || (n[59] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", Ht, [
            U(e("input", {
              "onUpdate:modelValue": n[18] || (n[18] = (h) => t.mcp_enabled = h),
              type: "checkbox"
            }, null, 512), [
              [te, t.mcp_enabled]
            ]),
            n[57] || (n[57] = e("span", { class: "ls-track" }, null, -1)),
            n[58] || (n[58] = e("span", { class: "ls-switch-text" }, [
              e("b", null, "允许调用 MCP 工具"),
              e("small", null, "服务清单在 Agent 设置中维护")
            ], -1))
          ])
        ]),
        e("article", Yt, [
          n[70] || (n[70] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-5" }, "☷"),
            e("h3", null, "OneBot v11 与主动行为")
          ], -1)),
          e("div", Jt, [
            e("label", Wt, [
              U(e("input", {
                "onUpdate:modelValue": n[19] || (n[19] = (h) => t.onebot_enabled = h),
                type: "checkbox"
              }, null, 512), [
                [te, t.onebot_enabled]
              ]),
              n[60] || (n[60] = e("span", { class: "ls-track" }, null, -1)),
              n[61] || (n[61] = e("span", { class: "ls-switch-text" }, [
                e("b", null, "启用 OneBot")
              ], -1))
            ]),
            e("label", qt, [
              U(e("input", {
                "onUpdate:modelValue": n[20] || (n[20] = (h) => t.onebot_observe_group = h),
                type: "checkbox"
              }, null, 512), [
                [te, t.onebot_observe_group]
              ]),
              n[62] || (n[62] = e("span", { class: "ls-track" }, null, -1)),
              n[63] || (n[63] = e("span", { class: "ls-switch-text" }, [
                e("b", null, "仅观察群聊"),
                e("small", null, "未触发时不回复")
              ], -1))
            ])
          ]),
          e("div", Gt, [
            e("label", Xt, [
              n[64] || (n[64] = e("span", null, "WebSocket 地址", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[21] || (n[21] = (h) => t.onebot_ws_url = h),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [L, t.onebot_ws_url]
              ])
            ]),
            e("label", Zt, [
              n[65] || (n[65] = e("span", null, "HTTP API 地址", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[22] || (n[22] = (h) => t.onebot_http_url = h),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [L, t.onebot_http_url]
              ])
            ])
          ]),
          e("div", Qt, [
            e("label", es, [
              n[66] || (n[66] = e("span", null, "Access Token", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[23] || (n[23] = (h) => t.onebot_access_token = h),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [L, t.onebot_access_token]
              ])
            ]),
            e("label", ts, [
              n[67] || (n[67] = e("span", null, "触发关键词（逗号分隔，留空=全部）", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[24] || (n[24] = (h) => t.onebot_trigger_keywords = h),
                placeholder: "bot,在吗"
              }, null, 512), [
                [L, t.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", ss, [
            e("label", ls, [
              n[68] || (n[68] = e("span", null, "每日主动上限", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[25] || (n[25] = (h) => t.proactive_daily_limit = h),
                type: "number",
                min: "0",
                placeholder: "3"
              }, null, 512), [
                [
                  L,
                  t.proactive_daily_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", os, [
              n[69] || (n[69] = e("span", null, "单目标上限", -1)),
              U(e("input", {
                "onUpdate:modelValue": n[26] || (n[26] = (h) => t.proactive_target_limit = h),
                type: "number",
                min: "0",
                placeholder: "1"
              }, null, 512), [
                [
                  L,
                  t.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ])
      ]),
      b.value ? (u(), c("p", ns, o(b.value), 1)) : M("", !0)
    ]));
  }
}), is = /* @__PURE__ */ ne(as, [["__scopeId", "data-v-537538f7"]]), rs = { class: "content-card about" }, us = { class: "identity" }, ds = { class: "app-id" }, cs = { class: "ver-badge" }, ps = { class: "app-desc" }, vs = { class: "identity-actions" }, hs = ["href"], ms = { class: "section" }, _s = { class: "section-head" }, gs = ["disabled"], bs = {
  key: 0,
  class: "alert",
  role: "alert"
}, fs = {
  class: "us-hero-icon",
  "aria-hidden": "true"
}, ys = {
  key: 0,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, ks = {
  key: 1,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, ws = {
  key: 2,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, $s = { class: "us-hero-text" }, Cs = { key: 0 }, Ps = { key: 1 }, Ss = { class: "us-hero-actions" }, xs = ["disabled"], Ms = ["disabled", "title"], Es = ["href"], Ts = {
  key: 2,
  class: "us-notes"
}, As = { class: "us-notes-title" }, Us = { class: "us-notes-body" }, Ns = {
  key: 3,
  class: "alert",
  role: "alert"
}, Rs = { class: "us-apply-head" }, Is = { key: 0 }, Os = { key: 1 }, Vs = {
  key: 0,
  class: "us-chip-tag"
}, zs = { class: "us-apply-label" }, Ls = {
  key: 0,
  class: "us-apply-error"
}, Ds = {
  key: 1,
  class: "us-apply-log"
}, Fs = { class: "section" }, Bs = { class: "section-title" }, js = { class: "credits" }, Ks = ["href"], Hs = ["src", "alt"], Ys = { class: "person-info" }, Js = { class: "name" }, Ws = { class: "role" }, qs = ["src"], Gs = { class: "person-info" }, Xs = { class: "role" }, Zs = { class: "section-head contributors-head" }, Qs = { class: "section-title" }, el = { class: "muted" }, tl = {
  key: 0,
  class: "contribs"
}, sl = ["href"], ll = ["src", "alt"], ol = { class: "login" }, nl = {
  key: 0,
  class: "count"
}, al = {
  key: 1,
  class: "muted"
}, il = ["href"], rl = { class: "foot" }, ul = ["href"], xe = "https://github.com/RazureSOFT/0KAY", dl = "https://github.com/RazureSOFT", cl = /* @__PURE__ */ X({
  __name: "AboutPanel",
  setup(z) {
    const { t } = oe(), b = P("0.1.2"), g = P([]), k = P(""), w = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, p = (T, R = 96) => `https://github.com/${T}.png?size=${R}`, y = P(!1), $ = P(null), r = P(""), d = P(null), a = P("");
    let i = null;
    function _(T) {
      return d.value?.status === "running" && d.value.plugin === T;
    }
    async function S(T, R) {
      if (d.value?.status !== "running") {
        a.value = "";
        try {
          d.value = await ye("/api/plugins/pm/update", { plugin: T, version: R || "" }), h();
        } catch (H) {
          a.value = H instanceof Error ? H.message : String(H);
        }
      }
    }
    async function n() {
      try {
        d.value = await ie("/api/plugins/pm/status");
      } catch {
        return;
      }
      d.value && d.value.status !== "running" && (v(), E());
    }
    function h() {
      i || (i = setInterval(n, 2e3));
    }
    function v() {
      i && (clearInterval(i), i = null);
    }
    const x = W(() => {
      switch (d.value?.status) {
        case "running":
          return t("settings.about.updating");
        case "done":
          return t("settings.about.updated");
        case "failed":
          return t("settings.about.updateFailed");
        default:
          return "";
      }
    }), A = W(() => $.value ? $.value.has_update ? "warn" : $.value.latest ? "ok" : "none" : "none");
    async function E() {
      y.value = !0, r.value = "";
      try {
        const T = await ie("/api/plugins/pm/check");
        $.value = T, T?.current && (b.value = String(T.current));
      } catch (T) {
        r.value = T instanceof De && T.status === 404 ? t("settings.about.unsupported") : T instanceof Error ? T.message : String(T);
      } finally {
        y.value = !1;
      }
    }
    async function B() {
      try {
        const T = { Accept: "application/vnd.github+json" }, [R, H] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: T }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: T })
        ]);
        if (!R.ok) throw new Error(`HTTP ${R.status}`);
        const G = /* @__PURE__ */ new Map(), Z = await R.json();
        for (const V of Array.isArray(Z) ? Z : [])
          V?.login && G.set(V.login, V);
        if (H.ok) {
          const V = await H.json();
          for (const I of Array.isArray(V) ? V : []) {
            const N = I?.author;
            !N?.login || N.login.endsWith("[bot]") || G.has(N.login) || G.set(N.login, {
              login: N.login,
              avatar_url: N.avatar_url,
              html_url: N.html_url,
              contributions: 0
            });
          }
        }
        g.value = [...G.values()].sort(
          (V, I) => (I.contributions || 0) - (V.contributions || 0) || V.login.localeCompare(I.login)
        );
      } catch (T) {
        k.value = T instanceof Error ? T.message : String(T), g.value = [];
      }
    }
    return le(() => {
      E(), B(), ie("/api/plugins/pm/status").then((T) => {
        d.value = T, T?.status === "running" && h();
      }).catch(() => {
      });
    }), Me(v), (T, R) => (u(), c("div", rs, [
      e("header", us, [
        R[3] || (R[3] = e("div", {
          class: "app-icon",
          "aria-hidden": "true"
        }, "0K", -1)),
        e("div", ds, [
          e("h2", null, [
            R[2] || (R[2] = q("0KAY ", -1)),
            e("span", cs, "v" + o(b.value), 1)
          ]),
          e("p", ps, o(l(t)("settings.about.description")), 1)
        ]),
        e("div", vs, [
          e("a", {
            class: "btn btn-tonal sm",
            href: xe,
            target: "_blank",
            rel: "noopener noreferrer"
          }, o(l(t)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${xe}/releases`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "Releases ↗", 8, hs)
        ])
      ]),
      e("section", ms, [
        e("div", _s, [
          R[4] || (R[4] = e("h3", { class: "section-title" }, "0KAY", -1)),
          e("button", {
            class: "btn btn-tonal sm",
            disabled: y.value,
            onClick: E
          }, o(l(t)(y.value ? "settings.about.checking" : "settings.about.check")), 9, gs)
        ]),
        r.value ? (u(), c("p", bs, o(r.value), 1)) : (u(), c("div", {
          key: 1,
          class: Y(["us-hero", A.value])
        }, [
          e("div", fs, [
            A.value === "ok" ? (u(), c("svg", ys, [...R[5] || (R[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : A.value === "warn" ? (u(), c("svg", ks, [...R[6] || (R[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (u(), c("svg", ws, [...R[7] || (R[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", $s, [
            e("b", null, o(l(t)(A.value === "warn" ? "settings.about.available" : A.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            $.value?.latest ? (u(), c("span", Cs, [
              q("v" + o($.value.current) + " → ", 1),
              e("em", null, "v" + o($.value.latest), 1)
            ])) : (u(), c("span", Ps, "0KAY v" + o($.value?.current || b.value), 1))
          ]),
          e("div", Ss, [
            $.value?.has_update ? (u(), c("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: _("core"),
              onClick: R[0] || (R[0] = (H) => S("core", $.value.latest))
            }, o(_("core") ? l(t)("settings.about.updating") : l(t)("settings.about.updateNow")), 9, xs)) : M("", !0),
            $.value?.source_available !== !1 ? (u(), c("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: _("core"),
              title: l(t)("settings.about.betaHint"),
              onClick: R[1] || (R[1] = (H) => S("core"))
            }, o(_("core") ? l(t)("settings.about.updating") : l(t)("settings.about.beta")), 9, Ms)) : M("", !0),
            $.value?.url ? (u(), c("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: $.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, Es)) : M("", !0)
          ])
        ], 2)),
        $.value?.notes ? (u(), c("div", Ts, [
          e("p", As, o(l(t)("settings.about.whatsNew")), 1),
          e("pre", Us, o($.value.notes), 1)
        ])) : M("", !0),
        a.value ? (u(), c("p", Ns, o(a.value), 1)) : M("", !0),
        d.value && d.value.status !== "idle" ? (u(), c("div", {
          key: 4,
          class: Y(["us-apply-banner", d.value.status])
        }, [
          e("div", Rs, [
            R[8] || (R[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              q(o(d.value.package), 1),
              d.value.version ? (u(), c("span", Is, "@" + o(d.value.version), 1)) : (u(), c("span", Os, " · main"))
            ]),
            d.value.mode === "source" ? (u(), c("span", Vs, o(l(t)("settings.about.sourceMode")), 1)) : M("", !0),
            e("span", zs, o(x.value), 1)
          ]),
          d.value.error ? (u(), c("p", Ls, o(d.value.error), 1)) : M("", !0),
          d.value.log ? (u(), c("pre", Ds, o(d.value.log), 1)) : M("", !0)
        ], 2)) : M("", !0)
      ]),
      e("section", Fs, [
        e("h3", Bs, o(l(t)("settings.about.developerTitle")) + " & " + o(l(t)("settings.about.teamTitle")), 1),
        e("div", js, [
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
            }, null, 8, Hs),
            e("div", Ys, [
              e("span", Js, o(w.login), 1),
              e("span", Ws, o(l(t)("settings.about.developerTitle")), 1)
            ]),
            R[9] || (R[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, Ks),
          e("a", {
            class: "person",
            href: dl,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: p("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, qs),
            e("div", Gs, [
              R[10] || (R[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", Xs, o(l(t)("settings.about.teamTitle")), 1)
            ]),
            R[11] || (R[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", Zs, [
          e("h3", Qs, o(l(t)("settings.about.contributorsTitle")), 1),
          e("span", el, o(l(t)("settings.about.contributorsFrom")), 1)
        ]),
        g.value.length ? (u(), c("div", tl, [
          (u(!0), c(K, null, J(g.value, (H) => (u(), c("a", {
            key: H.login,
            class: "contrib",
            href: H.html_url || `https://github.com/${H.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: H.avatar_url || p(H.login, 64),
              alt: H.login,
              loading: "lazy"
            }, null, 8, ll),
            e("span", ol, o(H.login), 1),
            H.contributions ? (u(), c("span", nl, o(H.contributions), 1)) : M("", !0)
          ], 8, sl))), 128))
        ])) : (u(), c("p", al, [
          e("a", {
            class: "repo-link",
            href: w.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "razureink ↗", 8, il)
        ]))
      ]),
      e("footer", rl, [
        R[12] || (R[12] = e("span", { class: "status-chip" }, "MIT", -1)),
        R[13] || (R[13] = e("span", null, "© 2026 RazureSOFT", -1)),
        e("a", {
          class: "repo-link",
          href: `${xe}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, ul)
      ])
    ]));
  }
}), pl = /* @__PURE__ */ ne(cl, [["__scopeId", "data-v-f0cbac94"]]), vl = { class: "content-card updates" }, hl = { class: "us-block" }, ml = { class: "us-head" }, _l = { class: "us-head-text" }, gl = { class: "us-title" }, bl = { class: "us-desc" }, fl = { class: "us-source" }, yl = { class: "us-input-group" }, kl = ["disabled", "placeholder"], wl = ["disabled"], $l = { class: "us-chips" }, Cl = ["disabled"], Pl = ["disabled"], Sl = {
  key: 0,
  class: "us-saved"
}, xl = { class: "helper-text" }, Ml = {
  key: 0,
  class: "alert"
}, El = { class: "us-block" }, Tl = { class: "us-head" }, Al = { class: "us-head-text" }, Ul = { class: "us-title" }, Nl = { class: "us-desc" }, Rl = { class: "us-head-actions" }, Il = ["disabled"], Ol = {
  key: 0,
  class: "alert",
  role: "alert"
}, Vl = { class: "us-apply-head" }, zl = { key: 0 }, Ll = { key: 1 }, Dl = {
  key: 0,
  class: "us-chip-tag"
}, Fl = { class: "us-apply-label" }, Bl = {
  key: 0,
  class: "us-apply-error"
}, jl = {
  key: 1,
  class: "us-apply-log"
}, Kl = {
  key: 2,
  class: "alert",
  role: "alert"
}, Hl = {
  key: 3,
  class: "us-table"
}, Yl = { class: "us-name" }, Jl = { class: "us-ver" }, Wl = { class: "us-actions" }, ql = ["disabled", "onClick"], Gl = ["disabled", "onClick"], Xl = ["href", "title"], Zl = {
  key: 0,
  class: "us-empty"
}, Ql = /* @__PURE__ */ X({
  __name: "UpdatesPanel",
  setup(z) {
    const { t } = oe(), b = P(!1), g = P(null), k = P(""), w = P(null), p = P("");
    let y = null;
    const $ = P(""), r = P(""), d = P(!1), a = P(!1), i = P(!1), _ = P(""), S = W(() => $.value.trim() !== r.value), n = W(() => $.value.trim() !== "");
    function h(V) {
      return w.value?.status === "running" && w.value.plugin === V;
    }
    async function v(V, I) {
      if (w.value?.status !== "running") {
        p.value = "";
        try {
          w.value = await ye("/api/plugins/pm/update", { plugin: V, version: I || "" }), A();
        } catch (N) {
          p.value = N instanceof Error ? N.message : String(N);
        }
      }
    }
    async function x() {
      try {
        w.value = await ie("/api/plugins/pm/status");
      } catch {
        return;
      }
      w.value && w.value.status !== "running" && (E(), R());
    }
    function A() {
      y || (y = setInterval(x, 2e3));
    }
    function E() {
      y && (clearInterval(y), y = null);
    }
    const B = W(() => {
      switch (w.value?.status) {
        case "running":
          return t("settings.about.updating");
        case "done":
          return t("settings.about.updated");
        case "failed":
          return t("settings.about.updateFailed");
        default:
          return "";
      }
    }), T = W(() => (g.value || []).filter((V) => V.has_update).length);
    async function R() {
      b.value = !0, k.value = "";
      try {
        const V = await ie("/api/plugins/pm/check-plugins");
        g.value = V.plugins || [];
      } catch (V) {
        k.value = V instanceof De && V.status === 404 ? t("settings.about.unsupported") : V instanceof Error ? V.message : String(V);
      } finally {
        b.value = !1;
      }
    }
    async function H() {
      d.value = !0, _.value = "";
      try {
        const V = await ie("/api/settings/updates"), I = String(V?.values?.github_proxy ?? "");
        $.value = I, r.value = I;
      } catch {
      } finally {
        d.value = !1;
      }
    }
    async function G() {
      a.value = !0, _.value = "";
      try {
        const V = $.value.trim();
        await ye("/api/settings/updates", { values: { github_proxy: V } }), r.value = V, i.value = !0, setTimeout(() => {
          i.value = !1;
        }, 1500);
      } catch (V) {
        _.value = V instanceof Error ? V.message : String(V);
      } finally {
        a.value = !1;
      }
    }
    function Z(V) {
      $.value = V, G();
    }
    return le(() => {
      R(), H(), ie("/api/plugins/pm/status").then((V) => {
        w.value = V, V?.status === "running" && A();
      }).catch(() => {
      });
    }), Me(E), (V, I) => (u(), c("div", vl, [
      e("section", hl, [
        e("header", ml, [
          I[3] || (I[3] = e("span", {
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
          e("div", _l, [
            e("h3", gl, o(l(t)("settings.pluginSourceTitle")), 1),
            e("p", bl, o(l(t)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: Y(["us-tag", { on: n.value }])
          }, o(n.value ? "ghproxy" : l(t)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", fl, [
          e("div", yl, [
            I[4] || (I[4] = e("span", {
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
              "onUpdate:modelValue": I[0] || (I[0] = (N) => $.value = N),
              class: "us-input",
              type: "text",
              disabled: d.value,
              placeholder: l(t)("settings.pluginSourcePlaceholder"),
              onKeyup: Je(G, ["enter"])
            }, null, 40, kl), [
              [L, $.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: a.value || !S.value,
              onClick: G
            }, o(l(t)("settings.save")), 9, wl)
          ]),
          e("div", $l, [
            e("button", {
              type: "button",
              class: Y(["us-chip", { active: !n.value }]),
              disabled: a.value,
              onClick: I[1] || (I[1] = (N) => Z(""))
            }, o(l(t)("settings.pluginSourceDirect")), 11, Cl),
            e("button", {
              type: "button",
              class: Y(["us-chip", { active: $.value.trim() === "https://gh-proxy.com" }]),
              disabled: a.value,
              onClick: I[2] || (I[2] = (N) => Z("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, Pl),
            i.value ? (u(), c("span", Sl, o(l(t)("settings.saved")), 1)) : M("", !0)
          ]),
          e("p", xl, o(l(t)("settings.pluginSourceHelp")), 1),
          _.value ? (u(), c("p", Ml, o(_.value), 1)) : M("", !0)
        ])
      ]),
      I[10] || (I[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", El, [
        e("header", Tl, [
          I[5] || (I[5] = We('<span class="us-ico" aria-hidden="true" data-v-6bbe694b><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-6bbe694b><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-6bbe694b></rect></svg></span>', 1)),
          e("div", Al, [
            e("h3", Ul, o(l(t)("settings.about.plugins")), 1),
            e("p", Nl, o(l(t)("settings.about.updateHint")), 1)
          ]),
          e("div", Rl, [
            e("span", {
              class: Y(["us-count", { warn: T.value > 0 }])
            }, o(T.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: b.value,
              onClick: R
            }, o(l(t)(b.value ? "settings.about.checking" : "settings.about.check")), 9, Il)
          ])
        ]),
        p.value ? (u(), c("p", Ol, o(p.value), 1)) : M("", !0),
        w.value && w.value.status !== "idle" ? (u(), c("div", {
          key: 1,
          class: Y(["us-apply-banner", w.value.status])
        }, [
          e("div", Vl, [
            I[6] || (I[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              q(o(w.value.package), 1),
              w.value.version ? (u(), c("span", zl, "@" + o(w.value.version), 1)) : (u(), c("span", Ll, " · main"))
            ]),
            w.value.mode === "source" ? (u(), c("span", Dl, o(l(t)("settings.about.sourceMode")), 1)) : M("", !0),
            e("span", Fl, o(B.value), 1)
          ]),
          w.value.error ? (u(), c("p", Bl, o(w.value.error), 1)) : M("", !0),
          w.value.log ? (u(), c("pre", jl, o(w.value.log), 1)) : M("", !0)
        ], 2)) : M("", !0),
        k.value ? (u(), c("p", Kl, o(k.value), 1)) : M("", !0),
        g.value ? (u(), c("div", Hl, [
          I[8] || (I[8] = e("div", { class: "us-row us-thead" }, [
            e("span", null, "Plugin"),
            e("span", null, "Version"),
            e("span", null, "Status"),
            e("span")
          ], -1)),
          (u(!0), c(K, null, J(g.value, (N) => (u(), c("div", {
            key: N.name,
            class: "us-row"
          }, [
            e("span", Yl, [
              e("span", {
                class: Y(["us-dot", N.error ? "bad" : N.has_update ? "warn" : N.latest ? "ok" : ""])
              }, null, 2),
              q(" " + o(N.name), 1)
            ]),
            e("span", Jl, [
              e("em", null, "v" + o(N.version || "—"), 1),
              I[7] || (I[7] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: Y({ good: !!N.latest })
              }, o(N.latest ? `v${N.latest}` : "—"), 3)
            ]),
            e("span", {
              class: Y(["us-status", N.error ? "bad" : N.has_update ? "warn" : N.latest ? "ok" : ""])
            }, o(N.error || l(t)(N.has_update ? "settings.about.available" : N.latest ? "settings.about.latest" : "settings.about.noRelease")), 3),
            e("span", Wl, [
              N.can_update && N.has_update ? (u(), c("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: h(N.name),
                onClick: (de) => v(N.name, N.latest)
              }, o(h(N.name) ? l(t)("settings.about.updating") : l(t)("settings.about.updateNow")), 9, ql)) : N.can_update ? (u(), c("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: h(N.name),
                onClick: (de) => v(N.name)
              }, o(h(N.name) ? l(t)("settings.about.updating") : l(t)("settings.about.syncNow")), 9, Gl)) : M("", !0),
              N.repository ? (u(), c("a", {
                key: 2,
                class: "us-repo",
                href: N.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: N.repository
              }, "Repo ↗", 8, Xl)) : M("", !0)
            ])
          ]))), 128)),
          g.value.length ? M("", !0) : (u(), c("p", Zl, o(l(t)("settings.about.noPlugins")), 1))
        ])) : M("", !0),
        I[9] || (I[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), eo = /* @__PURE__ */ ne(Ql, [["__scopeId", "data-v-6bbe694b"]]), to = { class: "content-card provider-panel" }, so = { class: "pp-editor-head" }, lo = ["aria-label"], oo = { class: "pp-editor-title" }, no = { class: "card-desc" }, ao = { class: "pp-section" }, io = { class: "pp-section-title" }, ro = { class: "pp-grid" }, uo = { class: "field" }, co = { class: "field" }, po = {
  key: 0,
  class: "pp-req"
}, vo = ["placeholder"], ho = { class: "field pp-span" }, mo = ["placeholder"], _o = { class: "field" }, go = { class: "helper-text" }, bo = { class: "field" }, fo = { class: "helper-text" }, yo = { class: "pp-section" }, ko = { class: "pp-section-head" }, wo = { class: "pp-section-title" }, $o = ["disabled"], Co = { class: "field" }, Po = { class: "pp-key" }, So = ["type", "placeholder"], xo = {
  key: 0,
  class: "helper-text"
}, Mo = {
  key: 1,
  class: "pp-probe err"
}, Eo = {
  key: 2,
  class: "pp-probe ok"
}, To = { class: "pp-section" }, Ao = { class: "pp-section-head" }, Uo = { class: "pp-section-title" }, No = { class: "pp-count" }, Ro = ["disabled"], Io = {
  key: 0,
  class: "pp-discovered"
}, Oo = { class: "pp-model-tools" }, Vo = ["placeholder"], zo = {
  key: 1,
  class: "pp-models"
}, Lo = ["title"], Do = ["value", "onChange"], Fo = ["value"], Bo = ["title", "disabled", "onClick"], jo = ["title"], Ko = ["checked", "onChange"], Ho = {
  key: 0,
  class: "helper-text"
}, Yo = {
  key: 2,
  class: "helper-text"
}, Jo = {
  key: 0,
  class: "pp-error",
  role: "alert"
}, Wo = { class: "pp-editor-actions" }, qo = ["disabled"], Go = { class: "pp-list-head" }, Xo = { class: "card-desc" }, Zo = { class: "pp-list-actions" }, Qo = {
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
}, pn = ["title"], vn = { class: "pp-chips" }, hn = {
  key: 0,
  class: "pp-chip more"
}, mn = {
  key: 1,
  class: "pp-chip empty"
}, _n = { class: "pp-card-actions" }, gn = ["onClick"], bn = ["disabled", "onClick"], fn = ["disabled", "onClick"], yn = ["onClick"], kn = ["onClick"], wn = {
  key: 1,
  class: "pp-empty"
}, $n = /* @__PURE__ */ X({
  __name: "ProviderPanel",
  setup(z) {
    const { t } = oe(), { confirm: b } = Ee(), g = Qe(), k = P({}), w = P("list"), p = P(null), y = P(""), $ = P({ state: "idle" }), r = P([]), d = P(""), a = P(!1), i = P(!1), _ = P(!1);
    le(async () => {
      await g.fetchAll();
      for (const s of g.providers) H(s);
    });
    function S(s) {
      return Se.find((m) => m.id === s) || null;
    }
    function n(s) {
      return s.name && s.name.trim() ? s.name.trim() : S(s.provider)?.name || s.provider;
    }
    function h(s) {
      return S(s.provider)?.logo || "";
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
    function x(s) {
      return (p.value?.model_types || {})[s] || "chat";
    }
    function A(s, m) {
      if (!p.value) return;
      const f = { ...p.value.model_types || {} };
      !m || m === "chat" ? delete f[s] : f[s] = m, p.value.model_types = f;
    }
    function E(s) {
      const m = new Set(s.disabled_models || []);
      return s.models.filter((f) => !m.has(f));
    }
    function B(s) {
      return g.defaultProviderId === s.id;
    }
    function T(s) {
      const m = p.value;
      if (!m) return;
      const f = Se.find((D) => D.id === s);
      f?.baseUrl && !m.base_url && (m.base_url = f.baseUrl), m.format = f?.format || "";
    }
    async function R(s, m = "") {
      if (!s.base_url) return { state: "error", message: t("settings.baseUrlRequired") };
      const f = performance.now();
      try {
        const D = await fetch("/api/models/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: s.id,
            provider: s.provider,
            base_url: s.base_url,
            format: s.format || "",
            api_key: m || ""
          })
        });
        if (!D.ok) throw new Error(`HTTP ${D.status}`);
        const j = await D.json(), Q = Math.round(performance.now() - f);
        return j.source === "api" && Array.isArray(j.models) && j.models.length ? { state: "ok", count: j.models.length, ms: Q, models: j.models } : { state: "error", message: j.error || t("settings.connectionFailed"), ms: Q };
      } catch (D) {
        return { state: "error", message: D instanceof Error ? D.message : String(D) };
      }
    }
    async function H(s, m = "") {
      k.value = { ...k.value, [s.id]: { state: "checking" } };
      const f = await R(s, m);
      k.value = { ...k.value, [s.id]: f };
    }
    function G() {
      for (const s of g.providers) H(s);
    }
    function Z() {
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
      }, y.value = "", $.value = { state: "idle" }, r.value = [], d.value = "", a.value = !1, i.value = !1, w.value = "edit";
    }
    function V(s) {
      p.value = {
        ...s,
        api_key: "",
        name: s.name || "",
        models: [...s.models],
        disabled_models: [...s.disabled_models || []],
        format: s.format || "",
        model_types: { ...s.model_types || {} }
      }, i.value = !!s.api_key_masked, y.value = "", $.value = { state: "idle" }, r.value = [], d.value = "", a.value = !1, w.value = "edit";
    }
    function I() {
      w.value = "list", p.value = null, y.value = "";
    }
    async function N() {
      const s = p.value;
      if (!s) return;
      y.value = "";
      const m = (s.name || "").trim();
      if (!s.base_url.trim()) {
        y.value = t("settings.baseUrlRequired");
        return;
      }
      if (s.provider === "custom" && !m) {
        y.value = t("settings.providerNameRequired");
        return;
      }
      if (!s.models.length) {
        y.value = t("settings.modelsRequired");
        return;
      }
      s.id || (s.id = `${s.provider}_${Date.now().toString(36)}`), s.name = m, s.disabled_models = (s.disabled_models || []).filter((f) => s.models.includes(f)), (!s.default_model || !s.models.includes(s.default_model) || s.disabled_models.includes(s.default_model)) && (s.default_model = E(s)[0] || s.models[0]), _.value = !0;
      try {
        await g.upsert({ ...s }), g.defaultProviderId || await g.setDefaults(s.id, s.default_model), I(), H(g.providers.find((f) => f.id === s.id) || s);
      } catch (f) {
        y.value = f instanceof Error ? f.message : String(f);
      } finally {
        _.value = !1;
      }
    }
    async function de(s) {
      if (await b({
        title: t("settings.remove"),
        message: `${t("settings.remove")} ${n(s)}?`,
        confirmLabel: t("settings.remove"),
        danger: !0
      }))
        try {
          await g.remove(s.id);
        } catch {
        }
    }
    async function he(s) {
      try {
        await g.upsert({ ...s, enabled: !s.enabled });
      } catch {
      }
    }
    async function we(s) {
      const m = s.default_model || E(s)[0] || s.models[0] || "";
      try {
        await g.setDefaults(s.id, m);
      } catch {
      }
    }
    async function me() {
      const s = p.value;
      if (!s) return;
      $.value = { state: "checking" };
      const m = await R(s, s.api_key);
      $.value = m, m.state === "ok" && m.models && (r.value = m.models);
    }
    function _e() {
      const s = p.value;
      !s || !r.value.length || (s.models = [...r.value], s.disabled_models = (s.disabled_models || []).filter((m) => s.models.includes(m)), s.models.includes(s.default_model) || (s.default_model = ""));
    }
    function ge(s) {
      const m = p.value;
      if (!m) return;
      const f = new Set(m.disabled_models || []);
      f.has(s) ? f.delete(s) : f.add(s), m.disabled_models = [...f], f.has(m.default_model) && (m.default_model = E(m)[0] || "");
    }
    function $e(s) {
      const m = p.value;
      m && (m.default_model = s, m.disabled_models = (m.disabled_models || []).filter((f) => f !== s));
    }
    function ae(s) {
      const m = p.value;
      m && (m.disabled_models = s ? [] : [...m.models]);
    }
    function Ce() {
      const s = p.value;
      if (!s) return;
      const m = new Set(s.disabled_models || []);
      s.disabled_models = s.models.filter((f) => !m.has(f));
    }
    const be = W(() => {
      const s = p.value?.models || [], m = d.value.trim().toLowerCase();
      return m ? s.filter((f) => f.toLowerCase().includes(m)) : s;
    }), Pe = W(() => p.value ? E(p.value).length : 0);
    function fe() {
      return t("settings.fetchedSummary", { n: r.value.length });
    }
    const O = W(() => [
      { value: "", label: t("settings.formatAuto") },
      { value: "openai", label: t("settings.formatOpenai") },
      { value: "anthropic", label: t("settings.formatAnthropic") }
    ]), C = W(
      () => Se.map((s) => ({ value: s.id, label: t(`providers.${s.id}.name`, s.name) }))
    );
    return (s, m) => (u(), c("div", to, [
      w.value === "edit" && p.value ? (u(), c(K, { key: 0 }, [
        e("div", so, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: I,
            "aria-label": l(t)("settings.back")
          }, [...m[11] || (m[11] = [
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
            e("h2", null, o(p.value.id ? l(t)("settings.edit") : l(t)("settings.addProvider")), 1),
            e("p", no, o(l(t)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: Y(["pp-status", $.value.state])
          }, [
            m[12] || (m[12] = e("span", { class: "pp-dot" }, null, -1)),
            q(" " + o($.value.state === "checking" ? l(t)("settings.testing") : $.value.state === "ok" ? l(t)("settings.connectionOk") : $.value.state === "error" ? l(t)("settings.connectionFailed") : l(t)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", ao, [
          e("h3", io, o(l(t)("settings.providerSectionBasic")), 1),
          e("div", ro, [
            e("div", uo, [
              e("label", null, o(l(t)("wizard.provider")), 1),
              se(l(ue), {
                modelValue: p.value.provider,
                "onUpdate:modelValue": m[0] || (m[0] = (f) => p.value.provider = f),
                class: "input",
                "aria-label": l(t)("wizard.provider"),
                options: C.value,
                onChange: T
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", co, [
              e("label", null, [
                q(o(l(t)("settings.providerName")) + " ", 1),
                p.value.provider === "custom" ? (u(), c("span", po, "*")) : M("", !0)
              ]),
              U(e("input", {
                "onUpdate:modelValue": m[1] || (m[1] = (f) => p.value.name = f),
                placeholder: l(t)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, vo), [
                [L, p.value.name]
              ])
            ]),
            e("div", ho, [
              e("label", null, o(l(t)("wizard.baseUrl")), 1),
              U(e("input", {
                "onUpdate:modelValue": m[2] || (m[2] = (f) => p.value.base_url = f),
                placeholder: l(t)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, mo), [
                [L, p.value.base_url]
              ])
            ]),
            e("div", _o, [
              e("label", null, o(l(t)("settings.apiFormat")), 1),
              se(l(ue), {
                modelValue: p.value.format,
                "onUpdate:modelValue": m[3] || (m[3] = (f) => p.value.format = f),
                class: "input",
                "aria-label": l(t)("settings.apiFormat"),
                options: O.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", go, o(l(t)("settings.apiFormatHint")), 1)
            ]),
            e("div", bo, [
              e("label", null, o(l(t)("wizard.defaultModel")), 1),
              se(l(ue), {
                modelValue: p.value.default_model,
                "onUpdate:modelValue": m[4] || (m[4] = (f) => p.value.default_model = f),
                class: "input",
                "aria-label": l(t)("wizard.defaultModel"),
                options: E(p.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", fo, o(l(t)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", yo, [
          e("div", ko, [
            e("h3", wo, o(l(t)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: $.value.state === "checking",
              onClick: me
            }, o($.value.state === "checking" ? l(t)("settings.testing") : l(t)("settings.testConnection")), 9, $o)
          ]),
          e("div", Co, [
            e("label", null, o(l(t)("wizard.apiKey")), 1),
            e("div", Po, [
              U(e("input", {
                "onUpdate:modelValue": m[5] || (m[5] = (f) => p.value.api_key = f),
                type: a.value ? "text" : "password",
                placeholder: i.value ? l(t)("settings.apiKeyKept") : l(t)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, So), [
                [qe, p.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: m[6] || (m[6] = (f) => a.value = !a.value)
              }, o(a.value ? l(t)("settings.hideKey") : l(t)("settings.showKey")), 1)
            ]),
            i.value ? (u(), c("p", xo, o(l(t)("settings.apiKeyKeptHint")), 1)) : M("", !0),
            $.value.state === "error" ? (u(), c("p", Mo, o($.value.message), 1)) : $.value.state === "ok" ? (u(), c("p", Eo, o(l(t)("settings.connectionOk")) + " · " + o(fe()) + " · " + o($.value.ms) + "ms ", 1)) : M("", !0)
          ])
        ]),
        e("section", To, [
          e("div", Ao, [
            e("h3", Uo, [
              q(o(l(t)("settings.providerSectionModels")) + " ", 1),
              e("span", No, o(Pe.value) + "/" + o(p.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: $.value.state === "checking",
              onClick: me
            }, o(l(t)("settings.fetchModels")), 9, Ro)
          ]),
          r.value.length && r.value.join("\0") !== p.value.models.join("\0") ? (u(), c("div", Io, [
            e("span", null, o(fe()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: _e
            }, o(l(t)("settings.applyFetched")), 1)
          ])) : M("", !0),
          e("div", Oo, [
            U(e("input", {
              "onUpdate:modelValue": m[7] || (m[7] = (f) => d.value = f),
              class: "input pp-search",
              placeholder: l(t)("settings.searchModels")
            }, null, 8, Vo), [
              [L, d.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: m[8] || (m[8] = (f) => ae(!0))
            }, o(l(t)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: m[9] || (m[9] = (f) => Ce())
            }, o(l(t)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: m[10] || (m[10] = (f) => ae(!1))
            }, o(l(t)("settings.clearSelection")), 1)
          ]),
          p.value.models.length ? (u(), c("div", zo, [
            (u(!0), c(K, null, J(be.value, (f) => (u(), c("div", {
              key: f,
              class: Y(["pp-model", { off: (p.value.disabled_models || []).includes(f) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: f
              }, o(f), 9, Lo),
              e("select", {
                class: Y(["pp-type", { tagged: x(f) !== "chat" }]),
                value: x(f),
                title: "模型类型",
                onChange: (D) => A(f, D.target.value)
              }, [
                (u(), c(K, null, J(v, (D) => e("option", {
                  key: D.value,
                  value: D.value
                }, o(D.label), 9, Fo)), 64))
              ], 42, Do),
              p.value.default_model !== f ? (u(), c("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: l(t)("settings.makeDefault"),
                disabled: (p.value.disabled_models || []).includes(f),
                onClick: (D) => $e(f)
              }, "☆", 8, Bo)) : (u(), c("span", {
                key: 1,
                class: "pp-star on",
                title: l(t)("wizard.defaultModel")
              }, "★", 8, jo)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(p.value.disabled_models || []).includes(f),
                onChange: (D) => ge(f)
              }, null, 40, Ko)
            ], 2))), 128)),
            be.value.length ? M("", !0) : (u(), c("p", Ho, o(l(t)("settings.searchModels")), 1))
          ])) : (u(), c("p", Yo, o(l(t)("settings.noModelsYet")), 1))
        ]),
        y.value ? (u(), c("p", Jo, o(y.value), 1)) : M("", !0),
        e("div", Wo, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: _.value,
            onClick: N
          }, o(_.value ? l(t)("settings.saving") : l(t)("settings.save")), 9, qo),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: I
          }, o(l(t)("settings.cancel")), 1)
        ])
      ], 64)) : (u(), c(K, { key: 1 }, [
        e("div", Go, [
          e("div", null, [
            e("h2", null, o(l(t)("settings.tabs.provider")), 1),
            e("p", Xo, o(l(t)("settings.providerDesc")), 1)
          ]),
          e("div", Zo, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: G
            }, o(l(t)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: Z
            }, "+ " + o(l(t)("settings.addProvider")), 1)
          ])
        ]),
        l(g).providers.length ? (u(), c("div", Qo, [
          (u(!0), c(K, null, J(l(g).providers, (f) => (u(), c("article", {
            key: f.id,
            class: Y(["pp-card", { off: !f.enabled, default: B(f) }])
          }, [
            e("header", en, [
              e("span", tn, [
                h(f) ? (u(), c("img", {
                  key: 0,
                  src: h(f),
                  alt: n(f)
                }, null, 8, sn)) : (u(), c("svg", ln, [...m[13] || (m[13] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", on, [
                e("strong", null, o(n(f)), 1),
                e("code", {
                  title: f.base_url
                }, o(f.base_url || "—"), 9, nn)
              ]),
              e("div", an, [
                B(f) ? (u(), c("span", rn, o(l(t)("settings.default")), 1)) : M("", !0),
                e("span", un, o(E(f).length) + "/" + o(f.models.length), 1)
              ])
            ]),
            e("div", dn, [
              e("span", {
                class: Y(["pp-status", k.value[f.id]?.state || "idle"])
              }, [
                m[14] || (m[14] = e("span", { class: "pp-dot" }, null, -1)),
                q(" " + o(k.value[f.id]?.state === "checking" ? l(t)("settings.testing") : k.value[f.id]?.state === "ok" ? l(t)("settings.connectionOk") : k.value[f.id]?.state === "error" ? l(t)("settings.connectionFailed") : l(t)("settings.statusIdle")), 1)
              ], 2),
              k.value[f.id]?.state === "ok" ? (u(), c("span", cn, o(l(t)("settings.fetchedSummary", { n: k.value[f.id]?.count || 0 })) + " · " + o(k.value[f.id]?.ms) + "ms", 1)) : k.value[f.id]?.state === "error" ? (u(), c("span", {
                key: 1,
                class: "pp-meta err",
                title: k.value[f.id]?.message
              }, o(k.value[f.id]?.message), 9, pn)) : M("", !0)
            ]),
            e("div", vn, [
              (u(!0), c(K, null, J(E(f).slice(0, 6), (D) => (u(), c("span", {
                key: D,
                class: "pp-chip"
              }, o(D), 1))), 128)),
              E(f).length > 6 ? (u(), c("span", hn, "+" + o(E(f).length - 6), 1)) : M("", !0),
              f.models.length ? M("", !0) : (u(), c("span", mn, o(l(t)("settings.noModelsYet")), 1))
            ]),
            e("footer", _n, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (D) => V(f)
              }, o(l(t)("settings.edit")), 9, gn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: k.value[f.id]?.state === "checking",
                onClick: (D) => H(f)
              }, o(l(t)("settings.testConnection")), 9, bn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: B(f),
                onClick: (D) => we(f)
              }, o(l(t)("settings.makeDefault")), 9, fn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (D) => he(f)
              }, o(f.enabled ? l(t)("settings.disableProvider") : l(t)("settings.enableProvider")), 9, yn),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (D) => de(f)
              }, o(l(t)("settings.remove")), 9, kn)
            ])
          ], 2))), 128))
        ])) : (u(), c("div", wn, [
          e("p", null, o(l(t)("settings.noProviders")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: Z
          }, "+ " + o(l(t)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), Cn = /* @__PURE__ */ ne($n, [["__scopeId", "data-v-dc98b94b"]]), Pn = { class: "pairing-panel" }, Sn = { key: 0 }, xn = { key: 1 }, Mn = { key: 0 }, En = ["onClick"], Tn = ["onClick"], An = /* @__PURE__ */ X({
  __name: "PairingPanel",
  setup(z) {
    const t = P([]), b = P("");
    let g;
    async function k() {
      try {
        const p = await fetch("/api/pairing/pending");
        if (!p.ok) throw new Error(await p.text());
        t.value = (await p.json()).requests || [];
      } catch (p) {
        b.value = p.message;
      }
    }
    async function w(p, y) {
      try {
        const $ = await fetch("/api/pairing/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, allow: y }) });
        if (!$.ok) throw new Error(await $.text());
        await k();
      } catch ($) {
        b.value = $.message;
      }
    }
    return le(() => {
      k(), g = setInterval(k, 3e3);
    }), Me(() => clearInterval(g)), (p, y) => (u(), c("section", Pn, [
      y[0] || (y[0] = e("h3", null, "设备配对", -1)),
      y[1] || (y[1] = e("p", null, "在 Core 所在电脑核对安装终端显示的 6 位代码，再允许连接。局域网发现需启用 CORE_LAN_ENABLED=1。", -1)),
      b.value ? (u(), c("p", Sn, o(b.value), 1)) : M("", !0),
      t.value.length ? M("", !0) : (u(), c("p", xn, "暂无待配对设备")),
      (u(!0), c(K, null, J(t.value, ($) => (u(), c("article", {
        key: $.id
      }, [
        e("strong", null, o($.name), 1),
        e("code", null, o($.code), 1),
        $.approved ? (u(), c("span", Mn, "已允许，等待客户端领取")) : (u(), c(K, { key: 1 }, [
          e("button", {
            onClick: (r) => w($, !1)
          }, "拒绝", 8, En),
          e("button", {
            onClick: (r) => w($, !0)
          }, "核对代码并允许配对", 8, Tn)
        ], 64))
      ]))), 128))
    ]));
  }
}), Un = /* @__PURE__ */ ne(An, [["__scopeId", "data-v-0559b1b2"]]), Nn = { class: "content-card" }, Rn = { class: "card-desc" }, In = { class: "field" }, On = { class: "segmented" }, Vn = ["onClick"], zn = /* @__PURE__ */ X({
  __name: "GeneralPanel",
  setup(z) {
    const { t } = oe(), b = P(et());
    function g(k) {
      b.value = k, st(k);
    }
    return (k, w) => (u(), c("div", Nn, [
      se(Un),
      e("h2", null, o(l(t)("settings.tabs.general")), 1),
      e("p", Rn, o(l(t)("settings.generalDesc")), 1),
      e("div", In, [
        e("label", null, o(l(t)("settings.language")), 1),
        e("div", On, [
          (u(!0), c(K, null, J(l(tt), (p) => (u(), c("button", {
            key: p.code,
            class: Y(["seg", { active: b.value === p.code }]),
            onClick: (y) => g(p.code)
          }, o(p.label), 11, Vn))), 128))
        ])
      ])
    ]));
  }
});
var ce;
((z) => {
  const p = class p {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code with the given version number,
    // error correction level, data codeword bytes, and mask number.
    // This is a low-level API that most users should not use directly.
    // A mid-level API is the encodeSegments() function.
    constructor(r, d, a, i) {
      F(this, "version");
      F(this, "errorCorrectionLevel");
      /*-- Fields --*/
      // The width and height of this QR Code, measured in modules, between
      // 21 and 177 (inclusive). This is equal to version * 4 + 17.
      F(this, "size");
      // The index of the mask pattern used in this QR Code, which is between 0 and 7 (inclusive).
      // Even if a QR Code is created with automatic masking requested (mask = -1),
      // the resulting object still has a mask value between 0 and 7.
      F(this, "mask");
      // The modules of this QR Code (false = light, true = dark).
      // Immutable after constructor finishes. Accessed through getModule().
      F(this, "modules", []);
      // Indicates function modules that are not subjected to masking. Discarded when constructor finishes.
      F(this, "isFunction", []);
      if (this.version = r, this.errorCorrectionLevel = d, r < p.MIN_VERSION || r > p.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (i < -1 || i > 7)
        throw new RangeError("Mask value out of range");
      this.size = r * 4 + 17;
      let _ = [];
      for (let n = 0; n < this.size; n++)
        _.push(!1);
      for (let n = 0; n < this.size; n++)
        this.modules.push(_.slice()), this.isFunction.push(_.slice());
      this.drawFunctionPatterns();
      const S = this.addEccAndInterleave(a);
      if (this.drawCodewords(S), i == -1) {
        let n = 1e9;
        for (let h = 0; h < 8; h++) {
          this.applyMask(h), this.drawFormatBits(h);
          const v = this.getPenaltyScore();
          v < n && (i = h, n = v), this.applyMask(h);
        }
      }
      k(0 <= i && i <= 7), this.mask = i, this.applyMask(i), this.drawFormatBits(i), this.isFunction = [];
    }
    /*-- Static factory functions (high level) --*/
    // Returns a QR Code representing the given Unicode text string at the given error correction level.
    // As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer
    // Unicode code points (not UTF-16 code units) if the low error correction level is used. The smallest possible
    // QR Code version is automatically chosen for the output. The ECC level of the result may be higher than the
    // ecl argument if it can be done without increasing the version.
    static encodeText(r, d) {
      const a = z.QrSegment.makeSegments(r);
      return p.encodeSegments(a, d);
    }
    // Returns a QR Code representing the given binary data at the given error correction level.
    // This function always encodes using the binary segment mode, not any text mode. The maximum number of
    // bytes allowed is 2953. The smallest possible QR Code version is automatically chosen for the output.
    // The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
    static encodeBinary(r, d) {
      const a = z.QrSegment.makeBytes(r);
      return p.encodeSegments([a], d);
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
    static encodeSegments(r, d, a = 1, i = 40, _ = -1, S = !0) {
      if (!(p.MIN_VERSION <= a && a <= i && i <= p.MAX_VERSION) || _ < -1 || _ > 7)
        throw new RangeError("Invalid value");
      let n, h;
      for (n = a; ; n++) {
        const E = p.getNumDataCodewords(n, d) * 8, B = w.getTotalBits(r, n);
        if (B <= E) {
          h = B;
          break;
        }
        if (n >= i)
          throw new RangeError("Data too long");
      }
      for (const E of [p.Ecc.MEDIUM, p.Ecc.QUARTILE, p.Ecc.HIGH])
        S && h <= p.getNumDataCodewords(n, E) * 8 && (d = E);
      let v = [];
      for (const E of r) {
        b(E.mode.modeBits, 4, v), b(E.numChars, E.mode.numCharCountBits(n), v);
        for (const B of E.getData())
          v.push(B);
      }
      k(v.length == h);
      const x = p.getNumDataCodewords(n, d) * 8;
      k(v.length <= x), b(0, Math.min(4, x - v.length), v), b(0, (8 - v.length % 8) % 8, v), k(v.length % 8 == 0);
      for (let E = 236; v.length < x; E ^= 253)
        b(E, 8, v);
      let A = [];
      for (; A.length * 8 < v.length; )
        A.push(0);
      return v.forEach((E, B) => A[B >>> 3] |= E << 7 - (B & 7)), new p(n, d, A, _);
    }
    /*-- Accessor methods --*/
    // Returns the color of the module (pixel) at the given coordinates, which is false
    // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
    // If the given coordinates are out of bounds, then false (light) is returned.
    getModule(r, d) {
      return 0 <= r && r < this.size && 0 <= d && d < this.size && this.modules[d][r];
    }
    /*-- Private helper methods for constructor: Drawing function modules --*/
    // Reads this object's version field, and draws and marks all function modules.
    drawFunctionPatterns() {
      for (let a = 0; a < this.size; a++)
        this.setFunctionModule(6, a, a % 2 == 0), this.setFunctionModule(a, 6, a % 2 == 0);
      this.drawFinderPattern(3, 3), this.drawFinderPattern(this.size - 4, 3), this.drawFinderPattern(3, this.size - 4);
      const r = this.getAlignmentPatternPositions(), d = r.length;
      for (let a = 0; a < d; a++)
        for (let i = 0; i < d; i++)
          a == 0 && i == 0 || a == 0 && i == d - 1 || a == d - 1 && i == 0 || this.drawAlignmentPattern(r[a], r[i]);
      this.drawFormatBits(0), this.drawVersion();
    }
    // Draws two copies of the format bits (with its own error correction code)
    // based on the given mask and this object's error correction level field.
    drawFormatBits(r) {
      const d = this.errorCorrectionLevel.formatBits << 3 | r;
      let a = d;
      for (let _ = 0; _ < 10; _++)
        a = a << 1 ^ (a >>> 9) * 1335;
      const i = (d << 10 | a) ^ 21522;
      k(i >>> 15 == 0);
      for (let _ = 0; _ <= 5; _++)
        this.setFunctionModule(8, _, g(i, _));
      this.setFunctionModule(8, 7, g(i, 6)), this.setFunctionModule(8, 8, g(i, 7)), this.setFunctionModule(7, 8, g(i, 8));
      for (let _ = 9; _ < 15; _++)
        this.setFunctionModule(14 - _, 8, g(i, _));
      for (let _ = 0; _ < 8; _++)
        this.setFunctionModule(this.size - 1 - _, 8, g(i, _));
      for (let _ = 8; _ < 15; _++)
        this.setFunctionModule(8, this.size - 15 + _, g(i, _));
      this.setFunctionModule(8, this.size - 8, !0);
    }
    // Draws two copies of the version bits (with its own error correction code),
    // based on this object's version field, iff 7 <= version <= 40.
    drawVersion() {
      if (this.version < 7)
        return;
      let r = this.version;
      for (let a = 0; a < 12; a++)
        r = r << 1 ^ (r >>> 11) * 7973;
      const d = this.version << 12 | r;
      k(d >>> 18 == 0);
      for (let a = 0; a < 18; a++) {
        const i = g(d, a), _ = this.size - 11 + a % 3, S = Math.floor(a / 3);
        this.setFunctionModule(_, S, i), this.setFunctionModule(S, _, i);
      }
    }
    // Draws a 9*9 finder pattern including the border separator,
    // with the center module at (x, y). Modules can be out of bounds.
    drawFinderPattern(r, d) {
      for (let a = -4; a <= 4; a++)
        for (let i = -4; i <= 4; i++) {
          const _ = Math.max(Math.abs(i), Math.abs(a)), S = r + i, n = d + a;
          0 <= S && S < this.size && 0 <= n && n < this.size && this.setFunctionModule(S, n, _ != 2 && _ != 4);
        }
    }
    // Draws a 5*5 alignment pattern, with the center module
    // at (x, y). All modules must be in bounds.
    drawAlignmentPattern(r, d) {
      for (let a = -2; a <= 2; a++)
        for (let i = -2; i <= 2; i++)
          this.setFunctionModule(r + i, d + a, Math.max(Math.abs(i), Math.abs(a)) != 1);
    }
    // Sets the color of a module and marks it as a function module.
    // Only used by the constructor. Coordinates must be in bounds.
    setFunctionModule(r, d, a) {
      this.modules[d][r] = a, this.isFunction[d][r] = !0;
    }
    /*-- Private helper methods for constructor: Codewords and masking --*/
    // Returns a new byte string representing the given data with the appropriate error correction
    // codewords appended to it, based on this object's version and error correction level.
    addEccAndInterleave(r) {
      const d = this.version, a = this.errorCorrectionLevel;
      if (r.length != p.getNumDataCodewords(d, a))
        throw new RangeError("Invalid argument");
      const i = p.NUM_ERROR_CORRECTION_BLOCKS[a.ordinal][d], _ = p.ECC_CODEWORDS_PER_BLOCK[a.ordinal][d], S = Math.floor(p.getNumRawDataModules(d) / 8), n = i - S % i, h = Math.floor(S / i);
      let v = [];
      const x = p.reedSolomonComputeDivisor(_);
      for (let E = 0, B = 0; E < i; E++) {
        let T = r.slice(B, B + h - _ + (E < n ? 0 : 1));
        B += T.length;
        const R = p.reedSolomonComputeRemainder(T, x);
        E < n && T.push(0), v.push(T.concat(R));
      }
      let A = [];
      for (let E = 0; E < v[0].length; E++)
        v.forEach((B, T) => {
          (E != h - _ || T >= n) && A.push(B[E]);
        });
      return k(A.length == S), A;
    }
    // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
    // data area of this QR Code. Function modules need to be marked off before this is called.
    drawCodewords(r) {
      if (r.length != Math.floor(p.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let d = 0;
      for (let a = this.size - 1; a >= 1; a -= 2) {
        a == 6 && (a = 5);
        for (let i = 0; i < this.size; i++)
          for (let _ = 0; _ < 2; _++) {
            const S = a - _, h = (a + 1 & 2) == 0 ? this.size - 1 - i : i;
            !this.isFunction[h][S] && d < r.length * 8 && (this.modules[h][S] = g(r[d >>> 3], 7 - (d & 7)), d++);
          }
      }
      k(d == r.length * 8);
    }
    // XORs the codeword modules in this QR Code with the given mask pattern.
    // The function modules must be marked and the codeword bits must be drawn
    // before masking. Due to the arithmetic of XOR, calling applyMask() with
    // the same mask value a second time will undo the mask. A final well-formed
    // QR Code needs exactly one (not zero, two, etc.) mask applied.
    applyMask(r) {
      if (r < 0 || r > 7)
        throw new RangeError("Mask value out of range");
      for (let d = 0; d < this.size; d++)
        for (let a = 0; a < this.size; a++) {
          let i;
          switch (r) {
            case 0:
              i = (a + d) % 2 == 0;
              break;
            case 1:
              i = d % 2 == 0;
              break;
            case 2:
              i = a % 3 == 0;
              break;
            case 3:
              i = (a + d) % 3 == 0;
              break;
            case 4:
              i = (Math.floor(a / 3) + Math.floor(d / 2)) % 2 == 0;
              break;
            case 5:
              i = a * d % 2 + a * d % 3 == 0;
              break;
            case 6:
              i = (a * d % 2 + a * d % 3) % 2 == 0;
              break;
            case 7:
              i = ((a + d) % 2 + a * d % 3) % 2 == 0;
              break;
            default:
              throw new Error("Unreachable");
          }
          !this.isFunction[d][a] && i && (this.modules[d][a] = !this.modules[d][a]);
        }
    }
    // Calculates and returns the penalty score based on state of this QR Code's current modules.
    // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
    getPenaltyScore() {
      let r = 0;
      for (let _ = 0; _ < this.size; _++) {
        let S = !1, n = 0, h = [0, 0, 0, 0, 0, 0, 0];
        for (let v = 0; v < this.size; v++)
          this.modules[_][v] == S ? (n++, n == 5 ? r += p.PENALTY_N1 : n > 5 && r++) : (this.finderPenaltyAddHistory(n, h), S || (r += this.finderPenaltyCountPatterns(h) * p.PENALTY_N3), S = this.modules[_][v], n = 1);
        r += this.finderPenaltyTerminateAndCount(S, n, h) * p.PENALTY_N3;
      }
      for (let _ = 0; _ < this.size; _++) {
        let S = !1, n = 0, h = [0, 0, 0, 0, 0, 0, 0];
        for (let v = 0; v < this.size; v++)
          this.modules[v][_] == S ? (n++, n == 5 ? r += p.PENALTY_N1 : n > 5 && r++) : (this.finderPenaltyAddHistory(n, h), S || (r += this.finderPenaltyCountPatterns(h) * p.PENALTY_N3), S = this.modules[v][_], n = 1);
        r += this.finderPenaltyTerminateAndCount(S, n, h) * p.PENALTY_N3;
      }
      for (let _ = 0; _ < this.size - 1; _++)
        for (let S = 0; S < this.size - 1; S++) {
          const n = this.modules[_][S];
          n == this.modules[_][S + 1] && n == this.modules[_ + 1][S] && n == this.modules[_ + 1][S + 1] && (r += p.PENALTY_N2);
        }
      let d = 0;
      for (const _ of this.modules)
        d = _.reduce((S, n) => S + (n ? 1 : 0), d);
      const a = this.size * this.size, i = Math.ceil(Math.abs(d * 20 - a * 10) / a) - 1;
      return k(0 <= i && i <= 9), r += i * p.PENALTY_N4, k(0 <= r && r <= 2568888), r;
    }
    /*-- Private helper functions --*/
    // Returns an ascending list of positions of alignment patterns for this version number.
    // Each position is in the range [0,177), and are used on both the x and y axes.
    // This could be implemented as lookup table of 40 variable-length lists of integers.
    getAlignmentPatternPositions() {
      if (this.version == 1)
        return [];
      {
        const r = Math.floor(this.version / 7) + 2, d = Math.floor((this.version * 8 + r * 3 + 5) / (r * 4 - 4)) * 2;
        let a = [6];
        for (let i = this.size - 7; a.length < r; i -= d)
          a.splice(1, 0, i);
        return a;
      }
    }
    // Returns the number of data bits that can be stored in a QR Code of the given version number, after
    // all function modules are excluded. This includes remainder bits, so it might not be a multiple of 8.
    // The result is in the range [208, 29648]. This could be implemented as a 40-entry lookup table.
    static getNumRawDataModules(r) {
      if (r < p.MIN_VERSION || r > p.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let d = (16 * r + 128) * r + 64;
      if (r >= 2) {
        const a = Math.floor(r / 7) + 2;
        d -= (25 * a - 10) * a - 55, r >= 7 && (d -= 36);
      }
      return k(208 <= d && d <= 29648), d;
    }
    // Returns the number of 8-bit data (i.e. not error correction) codewords contained in any
    // QR Code of the given version number and error correction level, with remainder bits discarded.
    // This stateless pure function could be implemented as a (40*4)-cell lookup table.
    static getNumDataCodewords(r, d) {
      return Math.floor(p.getNumRawDataModules(r) / 8) - p.ECC_CODEWORDS_PER_BLOCK[d.ordinal][r] * p.NUM_ERROR_CORRECTION_BLOCKS[d.ordinal][r];
    }
    // Returns a Reed-Solomon ECC generator polynomial for the given degree. This could be
    // implemented as a lookup table over all possible parameter values, instead of as an algorithm.
    static reedSolomonComputeDivisor(r) {
      if (r < 1 || r > 255)
        throw new RangeError("Degree out of range");
      let d = [];
      for (let i = 0; i < r - 1; i++)
        d.push(0);
      d.push(1);
      let a = 1;
      for (let i = 0; i < r; i++) {
        for (let _ = 0; _ < d.length; _++)
          d[_] = p.reedSolomonMultiply(d[_], a), _ + 1 < d.length && (d[_] ^= d[_ + 1]);
        a = p.reedSolomonMultiply(a, 2);
      }
      return d;
    }
    // Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.
    static reedSolomonComputeRemainder(r, d) {
      let a = d.map((i) => 0);
      for (const i of r) {
        const _ = i ^ a.shift();
        a.push(0), d.forEach((S, n) => a[n] ^= p.reedSolomonMultiply(S, _));
      }
      return a;
    }
    // Returns the product of the two given field elements modulo GF(2^8/0x11D). The arguments and result
    // are unsigned 8-bit integers. This could be implemented as a lookup table of 256*256 entries of uint8.
    static reedSolomonMultiply(r, d) {
      if (r >>> 8 || d >>> 8)
        throw new RangeError("Byte out of range");
      let a = 0;
      for (let i = 7; i >= 0; i--)
        a = a << 1 ^ (a >>> 7) * 285, a ^= (d >>> i & 1) * r;
      return k(a >>> 8 == 0), a;
    }
    // Can only be called immediately after a light run is added, and
    // returns either 0, 1, or 2. A helper function for getPenaltyScore().
    finderPenaltyCountPatterns(r) {
      const d = r[1];
      k(d <= this.size * 3);
      const a = d > 0 && r[2] == d && r[3] == d * 3 && r[4] == d && r[5] == d;
      return (a && r[0] >= d * 4 && r[6] >= d ? 1 : 0) + (a && r[6] >= d * 4 && r[0] >= d ? 1 : 0);
    }
    // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
    finderPenaltyTerminateAndCount(r, d, a) {
      return r && (this.finderPenaltyAddHistory(d, a), d = 0), d += this.size, this.finderPenaltyAddHistory(d, a), this.finderPenaltyCountPatterns(a);
    }
    // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
    finderPenaltyAddHistory(r, d) {
      d[0] == 0 && (r += this.size), d.pop(), d.unshift(r);
    }
  };
  /*-- Constants and tables --*/
  // The minimum version number supported in the QR Code Model 2 standard.
  F(p, "MIN_VERSION", 1), // The maximum version number supported in the QR Code Model 2 standard.
  F(p, "MAX_VERSION", 40), // For use in getPenaltyScore(), when evaluating which mask is best.
  F(p, "PENALTY_N1", 3), F(p, "PENALTY_N2", 3), F(p, "PENALTY_N3", 40), F(p, "PENALTY_N4", 10), F(p, "ECC_CODEWORDS_PER_BLOCK", [
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
  ]), F(p, "NUM_ERROR_CORRECTION_BLOCKS", [
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
  let t = p;
  z.QrCode = t;
  function b($, r, d) {
    if (r < 0 || r > 31 || $ >>> r)
      throw new RangeError("Value out of range");
    for (let a = r - 1; a >= 0; a--)
      d.push($ >>> a & 1);
  }
  function g($, r) {
    return ($ >>> r & 1) != 0;
  }
  function k($) {
    if (!$)
      throw new Error("Assertion error");
  }
  const y = class y {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code segment with the given attributes and data.
    // The character count (numChars) must agree with the mode and the bit buffer length,
    // but the constraint isn't checked. The given bit buffer is cloned and stored.
    constructor(r, d, a) {
      F(this, "mode");
      F(this, "numChars");
      F(this, "bitData");
      if (this.mode = r, this.numChars = d, this.bitData = a, d < 0)
        throw new RangeError("Invalid argument");
      this.bitData = a.slice();
    }
    /*-- Static factory functions (mid level) --*/
    // Returns a segment representing the given binary data encoded in
    // byte mode. All input byte arrays are acceptable. Any text string
    // can be converted to UTF-8 bytes and encoded as a byte mode segment.
    static makeBytes(r) {
      let d = [];
      for (const a of r)
        b(a, 8, d);
      return new y(y.Mode.BYTE, r.length, d);
    }
    // Returns a segment representing the given string of decimal digits encoded in numeric mode.
    static makeNumeric(r) {
      if (!y.isNumeric(r))
        throw new RangeError("String contains non-numeric characters");
      let d = [];
      for (let a = 0; a < r.length; ) {
        const i = Math.min(r.length - a, 3);
        b(parseInt(r.substring(a, a + i), 10), i * 3 + 1, d), a += i;
      }
      return new y(y.Mode.NUMERIC, r.length, d);
    }
    // Returns a segment representing the given text string encoded in alphanumeric mode.
    // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
    // dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static makeAlphanumeric(r) {
      if (!y.isAlphanumeric(r))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let d = [], a;
      for (a = 0; a + 2 <= r.length; a += 2) {
        let i = y.ALPHANUMERIC_CHARSET.indexOf(r.charAt(a)) * 45;
        i += y.ALPHANUMERIC_CHARSET.indexOf(r.charAt(a + 1)), b(i, 11, d);
      }
      return a < r.length && b(y.ALPHANUMERIC_CHARSET.indexOf(r.charAt(a)), 6, d), new y(y.Mode.ALPHANUMERIC, r.length, d);
    }
    // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
    // The result may use various segment modes and switch modes to optimize the length of the bit stream.
    static makeSegments(r) {
      return r == "" ? [] : y.isNumeric(r) ? [y.makeNumeric(r)] : y.isAlphanumeric(r) ? [y.makeAlphanumeric(r)] : [y.makeBytes(y.toUtf8ByteArray(r))];
    }
    // Returns a segment representing an Extended Channel Interpretation
    // (ECI) designator with the given assignment value.
    static makeEci(r) {
      let d = [];
      if (r < 0)
        throw new RangeError("ECI assignment value out of range");
      if (r < 128)
        b(r, 8, d);
      else if (r < 16384)
        b(2, 2, d), b(r, 14, d);
      else if (r < 1e6)
        b(6, 3, d), b(r, 21, d);
      else
        throw new RangeError("ECI assignment value out of range");
      return new y(y.Mode.ECI, 0, d);
    }
    // Tests whether the given string can be encoded as a segment in numeric mode.
    // A string is encodable iff each character is in the range 0 to 9.
    static isNumeric(r) {
      return y.NUMERIC_REGEX.test(r);
    }
    // Tests whether the given string can be encoded as a segment in alphanumeric mode.
    // A string is encodable iff each character is in the following set: 0 to 9, A to Z
    // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static isAlphanumeric(r) {
      return y.ALPHANUMERIC_REGEX.test(r);
    }
    /*-- Methods --*/
    // Returns a new copy of the data bits of this segment.
    getData() {
      return this.bitData.slice();
    }
    // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
    // the given version. The result is infinity if a segment has too many characters to fit its length field.
    static getTotalBits(r, d) {
      let a = 0;
      for (const i of r) {
        const _ = i.mode.numCharCountBits(d);
        if (i.numChars >= 1 << _)
          return 1 / 0;
        a += 4 + _ + i.bitData.length;
      }
      return a;
    }
    // Returns a new array of bytes representing the given string encoded in UTF-8.
    static toUtf8ByteArray(r) {
      r = encodeURI(r);
      let d = [];
      for (let a = 0; a < r.length; a++)
        r.charAt(a) != "%" ? d.push(r.charCodeAt(a)) : (d.push(parseInt(r.substring(a + 1, a + 3), 16)), a += 2);
      return d;
    }
  };
  /*-- Constants --*/
  // Describes precisely all strings that are encodable in numeric mode.
  F(y, "NUMERIC_REGEX", /^[0-9]*$/), // Describes precisely all strings that are encodable in alphanumeric mode.
  F(y, "ALPHANUMERIC_REGEX", /^[A-Z0-9 $%*+.\/:-]*$/), // The set of all legal characters in alphanumeric mode,
  // where each character value maps to the index in the string.
  F(y, "ALPHANUMERIC_CHARSET", "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:");
  let w = y;
  z.QrSegment = w;
})(ce || (ce = {}));
((z) => {
  ((t) => {
    const g = class g {
      // The QR Code can tolerate about 30% erroneous codewords
      /*-- Constructor and fields --*/
      constructor(w, p) {
        F(this, "ordinal");
        F(this, "formatBits");
        this.ordinal = w, this.formatBits = p;
      }
    };
    /*-- Constants --*/
    F(g, "LOW", new g(0, 1)), // The QR Code can tolerate about  7% erroneous codewords
    F(g, "MEDIUM", new g(1, 0)), // The QR Code can tolerate about 15% erroneous codewords
    F(g, "QUARTILE", new g(2, 3)), // The QR Code can tolerate about 25% erroneous codewords
    F(g, "HIGH", new g(3, 2));
    let b = g;
    t.Ecc = b;
  })(z.QrCode || (z.QrCode = {}));
})(ce || (ce = {}));
((z) => {
  ((t) => {
    const g = class g {
      /*-- Constructor and fields --*/
      constructor(w, p) {
        F(this, "modeBits");
        F(this, "numBitsCharCount");
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
    F(g, "NUMERIC", new g(1, [10, 12, 14])), F(g, "ALPHANUMERIC", new g(2, [9, 11, 13])), F(g, "BYTE", new g(4, [8, 16, 16])), F(g, "KANJI", new g(8, [8, 10, 12])), F(g, "ECI", new g(7, [0, 0, 0]));
    let b = g;
    t.Mode = b;
  })(z.QrSegment || (z.QrSegment = {}));
})(ce || (ce = {}));
const Ie = ce, Ln = { class: "content-card" }, Dn = { class: "connection-grid" }, Fn = { class: "connection-form" }, Bn = { class: "field" }, jn = { class: "field" }, Kn = { class: "toggle-label" }, Hn = { class: "field" }, Yn = { class: "field" }, Jn = { class: "field" }, Wn = { class: "helper-text" }, qn = { key: 0 }, Gn = { key: 1 }, Xn = { class: "actions-row" }, Zn = { class: "connection-qr" }, Qn = ["viewBox"], ea = ["width", "height"], ta = ["x", "y"], sa = { class: "connection-link" }, Oe = "0kay.connection.qr.v1", la = /* @__PURE__ */ X({
  __name: "ConnectionPanel",
  setup(z) {
    function t() {
      try {
        return JSON.parse(localStorage.getItem(Oe) || "{}");
      } catch {
        return {};
      }
    }
    const b = t(), g = P(b.host ?? location.hostname), k = P(b.port ?? (location.port || (location.protocol === "https:" ? "443" : "8080"))), w = P(b.tls ?? location.protocol === "https:"), p = P(b.token ?? ""), y = P(b.pin ?? ""), $ = P(b.name ?? "0KAY"), r = P(""), d = P(!1), a = P(!1);
    le(async () => {
      try {
        const h = await fetch("/api/auth/session");
        if (h.ok) {
          const v = await h.json();
          r.value = String(v.core_id || ""), d.value = !!v.lan_enabled;
        }
      } catch {
      }
    }), ze([g, k, w, p, y, $], () => {
      localStorage.setItem(
        Oe,
        JSON.stringify({
          host: g.value,
          port: k.value,
          tls: w.value,
          token: p.value,
          pin: y.value,
          name: $.value
        })
      );
    });
    const i = W(() => {
      const h = w.value ? "https" : "http", v = String(k.value || "").trim();
      return `${h}://${g.value.trim()}${v ? ":" + v : ""}`;
    }), _ = W(() => {
      const h = [["v", "1"], ["url", i.value]];
      return $.value.trim() && h.push(["name", $.value.trim()]), p.value.trim() && h.push(["token", p.value.trim()]), y.value.trim() && h.push(["pin", y.value.trim()]), r.value && h.push(["core_id", r.value]), `0kay://pair?${h.map(([x, A]) => `${x}=${encodeURIComponent(A)}`).join("&")}`;
    }), S = W(() => {
      const h = Ie.QrCode.encodeText(_.value, Ie.QrCode.Ecc.MEDIUM), v = h.size, x = 2, A = v + x * 2, E = [];
      for (let B = 0; B < v; B++)
        for (let T = 0; T < v; T++)
          h.getModule(T, B) && E.push({ x: T + x, y: B + x });
      return { dim: A, dark: E };
    });
    async function n() {
      try {
        await navigator.clipboard.writeText(_.value), a.value = !0, setTimeout(() => a.value = !1, 1500);
      } catch {
      }
    }
    return (h, v) => (u(), c("div", Ln, [
      v[14] || (v[14] = e("h2", null, "连接手机", -1)),
      v[15] || (v[15] = e("p", { class: "card-desc" }, [
        q(" 用 0KAY 安卓 App 扫描下方二维码即可连接。若通过 FRP / 反向代理暴露，请把下方 "),
        e("strong", null, "对外主机 / 端口 / TLS"),
        q(" 改成外网可达地址（Core 本身无需修改）。 Token / PIN 可留空（可信局域网）；公网访问请填写以便 App 直接认证。 ")
      ], -1)),
      e("div", Dn, [
        e("div", Fn, [
          e("div", Bn, [
            v[6] || (v[6] = e("label", null, "对外主机 / IP", -1)),
            U(e("input", {
              "onUpdate:modelValue": v[0] || (v[0] = (x) => g.value = x),
              class: "input",
              placeholder: "192.168.1.10 或 your.domain.com"
            }, null, 512), [
              [L, g.value]
            ])
          ]),
          e("div", jn, [
            v[7] || (v[7] = e("label", null, "端口", -1)),
            U(e("input", {
              "onUpdate:modelValue": v[1] || (v[1] = (x) => k.value = x),
              class: "input",
              inputmode: "numeric",
              placeholder: "8080"
            }, null, 512), [
              [L, k.value]
            ])
          ]),
          e("label", Kn, [
            U(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": v[2] || (v[2] = (x) => w.value = x)
            }, null, 512), [
              [te, w.value]
            ]),
            v[8] || (v[8] = e("span", { class: "toggle-slider" }, null, -1)),
            v[9] || (v[9] = e("span", null, "使用 TLS (https / wss)", -1))
          ]),
          e("div", Hn, [
            v[10] || (v[10] = e("label", null, "API Token（可选）", -1)),
            U(e("input", {
              "onUpdate:modelValue": v[3] || (v[3] = (x) => p.value = x),
              class: "input",
              type: "password",
              placeholder: "留空则使用可信局域网",
              autocomplete: "off"
            }, null, 512), [
              [L, p.value]
            ])
          ]),
          e("div", Yn, [
            v[11] || (v[11] = e("label", null, "访问 PIN（可选）", -1)),
            U(e("input", {
              "onUpdate:modelValue": v[4] || (v[4] = (x) => y.value = x),
              class: "input",
              type: "password",
              placeholder: "敏感操作 PIN",
              autocomplete: "off"
            }, null, 512), [
              [L, y.value]
            ])
          ]),
          e("div", Jn, [
            v[12] || (v[12] = e("label", null, "设备显示名称（可选）", -1)),
            U(e("input", {
              "onUpdate:modelValue": v[5] || (v[5] = (x) => $.value = x),
              class: "input",
              placeholder: "0KAY"
            }, null, 512), [
              [L, $.value]
            ])
          ]),
          e("div", Wn, [
            v[13] || (v[13] = q(" 连接地址：", -1)),
            e("code", null, o(i.value), 1),
            r.value ? (u(), c("span", qn, " · Core: " + o(r.value), 1)) : M("", !0),
            d.value ? (u(), c("span", Gn, " · LAN 模式")) : M("", !0)
          ]),
          e("div", Xn, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              onClick: n
            }, o(a.value ? "已复制" : "复制连接串"), 1)
          ])
        ]),
        e("div", Zn, [
          (u(), c("svg", {
            viewBox: `0 0 ${S.value.dim} ${S.value.dim}`,
            width: "264",
            height: "264",
            "shape-rendering": "crispEdges",
            role: "img",
            "aria-label": "0KAY connection QR code"
          }, [
            e("rect", {
              x: "0",
              y: "0",
              width: S.value.dim,
              height: S.value.dim,
              fill: "#ffffff"
            }, null, 8, ea),
            (u(!0), c(K, null, J(S.value.dark, (x) => (u(), c("rect", {
              key: x.x + ":" + x.y,
              x: x.x,
              y: x.y,
              width: "1",
              height: "1",
              fill: "#0b1020"
            }, null, 8, ta))), 128))
          ], 8, Qn)),
          e("code", sa, o(_.value), 1)
        ])
      ])
    ]));
  }
}), oa = /* @__PURE__ */ ne(la, [["__scopeId", "data-v-247dc582"]]), na = { class: "content-card" }, aa = { class: "card-desc" }, ia = { class: "field-row" }, ra = { class: "field" }, ua = ["placeholder"], da = { class: "field" }, ca = ["placeholder"], pa = { class: "field" }, va = { class: "field" }, ha = ["placeholder"], ma = { class: "field" }, _a = ["placeholder"], ga = { class: "field" }, ba = ["placeholder"], fa = { class: "field" }, ya = ["placeholder"], ka = { class: "helper-text" }, wa = /* @__PURE__ */ X({
  __name: "PersonaPanel",
  setup(z) {
    const { t } = oe(), b = Te(), { tabLabel: g, tabMeta: k } = Ae();
    return (w, p) => (u(), c("div", na, [
      e("h2", null, o(l(g)("persona")), 1),
      e("p", aa, o(l(k)("persona")?.descriptionKey ? l(t)(l(k)("persona").descriptionKey) : l(t)("settings.personaDesc")), 1),
      e("div", ia, [
        e("div", ra, [
          e("label", null, o(l(t)("wizard.name")), 1),
          U(e("input", {
            "onUpdate:modelValue": p[0] || (p[0] = (y) => l(b).persona.name = y),
            placeholder: l(t)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, ua), [
            [L, l(b).persona.name]
          ])
        ]),
        e("div", da, [
          e("label", null, o(l(t)("wizard.avatarUrl")), 1),
          U(e("input", {
            "onUpdate:modelValue": p[1] || (p[1] = (y) => l(b).persona.avatar = y),
            placeholder: l(t)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, ca), [
            [L, l(b).persona.avatar]
          ])
        ]),
        e("div", pa, [
          p[7] || (p[7] = e("label", null, "出生日期", -1)),
          U(e("input", {
            "onUpdate:modelValue": p[2] || (p[2] = (y) => l(b).persona.birthDate = y),
            type: "date",
            class: "input"
          }, null, 512), [
            [L, l(b).persona.birthDate]
          ])
        ])
      ]),
      e("div", va, [
        e("label", null, o(l(t)("wizard.description")), 1),
        U(e("textarea", {
          "onUpdate:modelValue": p[3] || (p[3] = (y) => l(b).persona.description = y),
          placeholder: l(t)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, ha), [
          [L, l(b).persona.description]
        ])
      ]),
      e("div", ma, [
        e("label", null, o(l(t)("wizard.personality")), 1),
        U(e("textarea", {
          "onUpdate:modelValue": p[4] || (p[4] = (y) => l(b).persona.personality = y),
          placeholder: l(t)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, _a), [
          [L, l(b).persona.personality]
        ])
      ]),
      e("div", ga, [
        e("label", null, o(l(t)("wizard.greeting")), 1),
        U(e("textarea", {
          "onUpdate:modelValue": p[5] || (p[5] = (y) => l(b).persona.greeting = y),
          placeholder: l(t)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, ba), [
          [L, l(b).persona.greeting]
        ])
      ]),
      e("div", fa, [
        e("label", null, o(l(t)("wizard.customPrompt")), 1),
        U(e("textarea", {
          "onUpdate:modelValue": p[6] || (p[6] = (y) => l(b).persona.customPrompt = y),
          placeholder: l(t)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, ya), [
          [L, l(b).persona.customPrompt]
        ]),
        e("p", ka, o(l(t)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), $a = { class: "content-card" }, Ca = { class: "card-desc" }, Pa = { class: "toggle-label" }, Sa = { class: "helper-text" }, xa = { class: "toggle-label" }, Ma = { class: "helper-text" }, Ea = { class: "field" }, Ta = ["placeholder"], Aa = { class: "helper-text" }, Ua = {
  key: 0,
  class: "helper-text"
}, Na = { class: "actions-row" }, Ra = /* @__PURE__ */ X({
  __name: "PermissionsPanel",
  setup(z) {
    const { t } = oe(), { tabLabel: b, tabMeta: g, fieldLabel: k, fieldHelp: w } = Ae(), p = P({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), y = P("");
    async function $() {
      try {
        const d = await fetch("/api/life/permissions");
        if (d.ok) {
          const a = await d.json();
          p.value = {
            screen_watch: !!a.screen_watch,
            computer_use: !!a.computer_use,
            report_agent_host: a.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function r() {
      y.value = "";
      try {
        const d = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p.value)
        });
        if (!d.ok) throw new Error(String(d.status));
        const a = await d.json();
        p.value = {
          screen_watch: !!a.screen_watch,
          computer_use: !!a.computer_use,
          report_agent_host: a.report_agent_host || ""
        }, y.value = t("settings.permSaved");
      } catch {
        y.value = t("settings.permFailed");
      }
    }
    return le($), (d, a) => (u(), c("div", $a, [
      e("h2", null, o(l(b)("permissions")), 1),
      e("p", Ca, o(l(g)("permissions")?.descriptionKey ? l(t)(l(g)("permissions").descriptionKey) : l(t)("settings.permissionsDesc")), 1),
      e("label", Pa, [
        U(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": a[0] || (a[0] = (i) => p.value.screen_watch = i),
          onChange: r
        }, null, 544), [
          [te, p.value.screen_watch]
        ]),
        a[4] || (a[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, o(l(k)(l(g)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          a[3] || (a[3] = e("br", null, null, -1)),
          e("small", Sa, o(l(w)(l(g)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", xa, [
        U(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": a[1] || (a[1] = (i) => p.value.computer_use = i),
          onChange: r
        }, null, 544), [
          [te, p.value.computer_use]
        ]),
        a[6] || (a[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, o(l(k)(l(g)("permissions"), "computer_use", "settings.computerUse")), 1),
          a[5] || (a[5] = e("br", null, null, -1)),
          e("small", Ma, o(l(w)(l(g)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", Ea, [
        e("label", null, o(l(k)(l(g)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        U(e("input", {
          "onUpdate:modelValue": a[2] || (a[2] = (i) => p.value.report_agent_host = i),
          class: "input",
          placeholder: l(w)(l(g)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: r
        }, null, 40, Ta), [
          [L, p.value.report_agent_host]
        ]),
        e("p", Aa, o(l(w)(l(g)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      y.value ? (u(), c("div", Ua, o(y.value), 1)) : M("", !0),
      e("div", Na, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: r
        }, o(l(t)("settings.save")), 1)
      ])
    ]));
  }
}), Ia = P(!1), Oa = P(!1);
P(!1);
const re = P(!1), pe = P(!0), Ue = P(!0), ve = P([]), Be = P(!1);
P(!1);
const ke = P(!1), Ve = [];
function Va(z) {
  const t = Ve.splice(0, Ve.length);
  for (const b of t)
    b.resolve();
}
async function za() {
  const z = window.fetch;
  try {
    const t = await z("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!t.ok) return;
    const b = await t.json();
    re.value = !!b.configured, pe.value = b.enabled !== !1, Ue.value = b.login_enabled !== !1, ve.value = Array.isArray(b.pages) ? b.pages : [], ke.value = !b.configured && pe.value;
  } catch {
  }
}
async function La(z) {
  const t = window.fetch, b = await t("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(z)
  }), g = await b.json().catch(() => null);
  if (!b.ok) throw new Error(g?.error || `HTTP ${b.status}`);
  typeof g?.enabled == "boolean" && (pe.value = g.enabled), typeof g?.login_enabled == "boolean" && (Ue.value = g.login_enabled), Array.isArray(g?.pages) && (ve.value = g.pages), re.value = !!g?.configured, ke.value = !g?.configured && pe.value;
}
async function Da() {
  const z = window.fetch, t = await z("/api/security/pin", { method: "DELETE" }), b = await t.json().catch(() => null);
  if (!t.ok) throw new Error(b?.error || `HTTP ${t.status}`);
  Be.value = !1, re.value = !1, ke.value = pe.value;
}
async function Fa(z) {
  const t = window.fetch, b = await t("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: z })
  }), g = await b.json().catch(() => null);
  if (!b.ok || !g?.configured) throw new Error(g?.error || `HTTP ${b.status}`);
  z.trim(), Be.value = !0, re.value = !0, ke.value = !1, Oa.value = !0, Ia.value = !1, Va();
}
const Ba = { class: "content-card security-panel" }, ja = { class: "card-desc" }, Ka = { class: "sec-stack" }, Ha = { class: "toggle-label" }, Ya = ["checked", "disabled"], Ja = { class: "helper-text" }, Wa = { class: "toggle-label" }, qa = ["checked", "disabled"], Ga = { class: "helper-text" }, Xa = { class: "sec-card" }, Za = { class: "sec-card-head" }, Qa = { class: "sec-pin-grid" }, ei = { class: "sec-pin-col" }, ti = { class: "sec-pin-label" }, si = { class: "sec-pin-col" }, li = { class: "sec-pin-label" }, oi = { class: "sec-actions" }, ni = ["disabled"], ai = ["disabled"], ii = { class: "sec-card" }, ri = { class: "sec-card-head" }, ui = { class: "sec-chip" }, di = { class: "helper-text" }, ci = { class: "page-list" }, pi = ["checked", "disabled", "onChange"], vi = { class: "page-text" }, hi = { class: "page-name" }, mi = {
  key: 0,
  class: "helper-text sec-msg"
}, _i = {
  key: 1,
  class: "sec-error"
}, gi = /* @__PURE__ */ X({
  __name: "SecurityPanel",
  setup(z) {
    const { t, locale: b } = oe(), { confirm: g } = Ee(), k = Fe(), w = P(!1), p = P(""), y = P(""), $ = P(""), r = P(""), d = W(() => {
      const h = [], v = /* @__PURE__ */ new Set(), x = (A, E) => {
        !A || v.has(A) || (v.add(A), h.push({ path: A, label: E || A }));
      };
      for (const A of k.navItems) {
        const E = A.to || (A.id === "chat" ? "/" : "");
        if (!E) continue;
        let B = A.labelKey ? t(A.labelKey) : "";
        (!B || B === A.labelKey) && (B = A.label || A.id), x(E, B);
      }
      for (const A of k.routerPatches) {
        let E = A.titleKey ? t(A.titleKey) : "";
        (!E || E === A.titleKey) && (E = A.title || String(A.name || A.path)), x(A.path, E);
      }
      return h;
    });
    le(() => {
      za();
    });
    async function a(h) {
      w.value = !0, p.value = "", y.value = "";
      try {
        await La(h), p.value = t("settings.saved"), setTimeout(() => {
          p.value = "";
        }, 1500);
      } catch (v) {
        y.value = v?.message || t("settings.permFailed");
      } finally {
        w.value = !1;
      }
    }
    function i(h, v) {
      a({ [h]: v });
    }
    function _(h, v) {
      const x = new Set(ve.value);
      v ? x.add(h) : x.delete(h), a({ pages: [...x] });
    }
    async function S() {
      if (y.value = "", $.value.length !== 6) {
        y.value = t("wizard.pinTooShort");
        return;
      }
      if ($.value !== r.value) {
        y.value = t("wizard.pinMismatch");
        return;
      }
      w.value = !0;
      try {
        await Fa($.value), $.value = "", r.value = "", p.value = t("settings.saved"), setTimeout(() => {
          p.value = "";
        }, 1500);
      } catch (h) {
        y.value = h?.message || t("settings.permFailed");
      } finally {
        w.value = !1;
      }
    }
    async function n() {
      if (await g({
        title: t("security.removePin"),
        message: t("security.removePinConfirm"),
        confirmLabel: b.value === "en" ? "Delete" : "删除",
        danger: !0
      })) {
        w.value = !0, y.value = "";
        try {
          await Da(), p.value = t("settings.saved"), setTimeout(() => {
            p.value = "";
          }, 1500);
        } catch (v) {
          y.value = v?.message || t("settings.permFailed");
        } finally {
          w.value = !1;
        }
      }
    }
    return (h, v) => (u(), c("div", Ba, [
      e("h2", null, o(l(t)("settings.tabs.security")), 1),
      e("p", ja, o(l(t)("security.desc")), 1),
      e("div", Ka, [
        e("label", Ha, [
          e("input", {
            type: "checkbox",
            checked: l(pe),
            disabled: w.value,
            onChange: v[0] || (v[0] = (x) => i("enabled", x.target.checked))
          }, null, 40, Ya),
          v[4] || (v[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, o(l(t)("security.pinSwitch")), 1),
            e("small", Ja, o(l(t)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", Wa, [
          e("input", {
            type: "checkbox",
            checked: l(Ue),
            disabled: w.value,
            onChange: v[1] || (v[1] = (x) => i("login_enabled", x.target.checked))
          }, null, 40, qa),
          v[5] || (v[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, o(l(t)("security.loginSwitch")), 1),
            e("small", Ga, o(l(t)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", Xa, [
          e("div", Za, [
            e("strong", null, o(l(re) ? l(t)("security.changePin") : l(t)("auth.setupTitle")), 1),
            e("span", {
              class: Y(["sec-chip", { on: l(re) }])
            }, o(l(re) ? l(t)("security.pinSet") : l(t)("security.pinUnset")), 3)
          ]),
          e("div", Qa, [
            e("div", ei, [
              e("span", ti, o(l(t)("auth.pinNew")), 1),
              se(l(ue), {
                modelValue: $.value,
                "onUpdate:modelValue": v[2] || (v[2] = (x) => $.value = x)
              }, null, 8, ["modelValue"])
            ]),
            e("div", si, [
              e("span", li, o(l(t)("auth.pinConfirm")), 1),
              se(l(ue), {
                modelValue: r.value,
                "onUpdate:modelValue": v[3] || (v[3] = (x) => r.value = x),
                onComplete: S
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", oi, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: w.value,
              onClick: S
            }, o(l(t)("auth.savePin")), 9, ni),
            l(re) ? (u(), c("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: w.value,
              onClick: n
            }, o(l(t)("security.removePin")), 9, ai)) : M("", !0)
          ])
        ]),
        e("section", ii, [
          e("div", ri, [
            e("strong", null, o(l(t)("security.pages")), 1),
            e("span", ui, o(l(t)("security.pageCount", { n: l(ve).length })), 1)
          ]),
          e("p", di, o(l(t)("security.pagesHelp")), 1),
          e("div", ci, [
            (u(!0), c(K, null, J(d.value, (x) => (u(), c("label", {
              key: x.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: l(ve).includes(x.path),
                disabled: w.value,
                onChange: (A) => _(x.path, A.target.checked)
              }, null, 40, pi),
              v[6] || (v[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", vi, [
                e("span", hi, o(x.label), 1),
                e("code", null, o(x.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      p.value ? (u(), c("p", mi, o(p.value), 1)) : M("", !0),
      y.value ? (u(), c("p", _i, o(y.value), 1)) : M("", !0)
    ]));
  }
}), bi = /* @__PURE__ */ ne(gi, [["__scopeId", "data-v-bd35de8f"]]), fi = { class: "mcp-panel" }, yi = { class: "mcp-head" }, ki = { class: "mcp-actions" }, wi = ["disabled"], $i = {
  key: 0,
  class: "error-banner"
}, Ci = {
  key: 1,
  class: "notice-banner"
}, Pi = {
  key: 2,
  class: "hint"
}, Si = {
  key: 3,
  class: "mcp-list"
}, xi = { class: "mcp-row" }, Mi = { class: "mcp-field grow" }, Ei = ["onUpdate:modelValue"], Ti = { class: "mcp-field" }, Ai = ["onUpdate:modelValue"], Ui = { class: "mcp-toggle" }, Ni = ["onUpdate:modelValue"], Ri = ["onClick"], Ii = { class: "mcp-field" }, Oi = ["onUpdate:modelValue"], Vi = { class: "mcp-field" }, zi = ["onUpdate:modelValue"], Li = { class: "mcp-field" }, Di = ["onUpdate:modelValue"], Fi = { class: "mcp-field" }, Bi = ["onUpdate:modelValue"], ji = {
  key: 0,
  class: "hint"
}, Ki = /* @__PURE__ */ X({
  __name: "McpPanel",
  setup(z) {
    const t = P([]), b = P(!1), g = P(!1), k = P(""), w = P(!1);
    function p() {
      return { id: "", transport: "stdio", command: "", argsText: "", url: "", headersText: "", enabled: !0 };
    }
    function y(a) {
      return {
        id: String(a?.id || ""),
        transport: a?.transport === "http" ? "http" : "stdio",
        command: String(a?.command || ""),
        argsText: Array.isArray(a?.args) ? a.args.join(`
`) : "",
        url: String(a?.url || ""),
        headersText: a?.headers && typeof a.headers == "object" ? JSON.stringify(a.headers, null, 2) : "",
        enabled: a?.enabled !== !1
      };
    }
    function $(a) {
      const i = { id: a.id.trim(), transport: a.transport, enabled: a.enabled };
      if (a.transport === "http") {
        if (a.url.trim() && (i.url = a.url.trim()), a.headersText.trim())
          try {
            i.headers = JSON.parse(a.headersText);
          } catch {
            throw new Error(`服务「${a.id || "(未命名)"}」的 Headers 不是合法 JSON`);
          }
      } else {
        a.command.trim() && (i.command = a.command.trim());
        const _ = a.argsText.split(`
`).map((S) => S.trim()).filter(Boolean);
        _.length && (i.args = _);
      }
      return i;
    }
    async function r() {
      b.value = !0, k.value = "";
      try {
        const i = (await ie("/api/settings/mcp"))?.values?.servers;
        let _ = [];
        if (typeof i == "string" && i.trim())
          try {
            const S = JSON.parse(i);
            Array.isArray(S) && (_ = S);
          } catch {
            k.value = "已保存的 MCP 配置不是合法 JSON，已忽略。";
          }
        t.value = _.map(y);
      } catch (a) {
        k.value = a?.message || String(a);
      } finally {
        b.value = !1;
      }
    }
    async function d() {
      if (!g.value) {
        g.value = !0, k.value = "", w.value = !1;
        try {
          const a = t.value.map($).filter((i) => String(i.id || "").trim());
          await ye("/api/settings/mcp", { values: { servers: JSON.stringify(a) } }), w.value = !0, setTimeout(() => {
            w.value = !1;
          }, 2e3);
        } catch (a) {
          k.value = a?.message || String(a);
        } finally {
          g.value = !1;
        }
      }
    }
    return le(r), (a, i) => (u(), c("div", fi, [
      e("header", yi, [
        i[1] || (i[1] = e("div", null, [
          e("h2", null, "MCP 服务"),
          e("p", { class: "subtitle" }, "配置外部 MCP（模型上下文协议）服务。保存后 Agent 与 L.I.F.E 共用同一份配置。")
        ], -1)),
        e("div", ki, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: i[0] || (i[0] = (_) => t.value.push(p()))
          }, "添加服务"),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: g.value,
            onClick: d
          }, o(g.value ? "保存中…" : "保存"), 9, wi)
        ])
      ]),
      k.value ? (u(), c("div", $i, o(k.value), 1)) : M("", !0),
      w.value ? (u(), c("div", Ci, "已保存")) : M("", !0),
      b.value ? (u(), c("p", Pi, "加载中…")) : (u(), c("div", Si, [
        (u(!0), c(K, null, J(t.value, (_, S) => (u(), c("article", {
          key: S,
          class: "mcp-card"
        }, [
          e("div", xi, [
            e("label", Mi, [
              i[2] || (i[2] = e("span", null, "ID", -1)),
              U(e("input", {
                "onUpdate:modelValue": (n) => _.id = n,
                placeholder: "filesystem"
              }, null, 8, Ei), [
                [L, _.id]
              ])
            ]),
            e("label", Ti, [
              i[4] || (i[4] = e("span", null, "传输", -1)),
              U(e("select", {
                "onUpdate:modelValue": (n) => _.transport = n
              }, [...i[3] || (i[3] = [
                e("option", { value: "stdio" }, "stdio", -1),
                e("option", { value: "http" }, "http", -1)
              ])], 8, Ai), [
                [Ge, _.transport]
              ])
            ]),
            e("label", Ui, [
              U(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (n) => _.enabled = n
              }, null, 8, Ni), [
                [te, _.enabled]
              ]),
              i[5] || (i[5] = e("span", null, "启用", -1))
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (n) => t.value.splice(S, 1)
            }, "删除", 8, Ri)
          ]),
          _.transport === "stdio" ? (u(), c(K, { key: 0 }, [
            e("label", Ii, [
              i[6] || (i[6] = e("span", null, "命令", -1)),
              U(e("input", {
                "onUpdate:modelValue": (n) => _.command = n,
                placeholder: "npx"
              }, null, 8, Oi), [
                [L, _.command]
              ])
            ]),
            e("label", Vi, [
              i[7] || (i[7] = e("span", null, "参数（每行一个）", -1)),
              U(e("textarea", {
                "onUpdate:modelValue": (n) => _.argsText = n,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, zi), [
                [L, _.argsText]
              ])
            ])
          ], 64)) : (u(), c(K, { key: 1 }, [
            e("label", Li, [
              i[8] || (i[8] = e("span", null, "URL", -1)),
              U(e("input", {
                "onUpdate:modelValue": (n) => _.url = n,
                placeholder: "https://example.com/mcp"
              }, null, 8, Di), [
                [L, _.url]
              ])
            ]),
            e("label", Fi, [
              i[9] || (i[9] = e("span", null, "Headers（JSON）", -1)),
              U(e("textarea", {
                "onUpdate:modelValue": (n) => _.headersText = n,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, Bi), [
                [L, _.headersText]
              ])
            ])
          ], 64))
        ]))), 128)),
        t.value.length ? M("", !0) : (u(), c("p", ji, "还没有 MCP 服务，点击「添加服务」。"))
      ]))
    ]));
  }
}), Hi = /* @__PURE__ */ ne(Ki, [["__scopeId", "data-v-3b21cb32"]]), Yi = { class: "content-card danger" }, Ji = { class: "card-desc" }, Wi = { class: "danger-box" }, qi = /* @__PURE__ */ X({
  __name: "DangerPanel",
  setup(z) {
    const { t } = oe(), b = Te(), g = Le();
    function k() {
      b.resetWizard(), g.push("/");
    }
    return (w, p) => (u(), c("div", Yi, [
      e("h2", null, o(l(t)("settings.tabs.danger")), 1),
      e("p", Ji, o(l(t)("settings.resetDesc")), 1),
      e("div", Wi, [
        e("div", null, [
          e("strong", null, o(l(t)("settings.reset")), 1),
          e("p", null, o(l(t)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          onClick: k
        }, o(l(t)("settings.reset")), 1)
      ])
    ]));
  }
}), Gi = {
  key: 1,
  class: "plugin-pane-message"
}, Xi = {
  key: 2,
  class: "plugin-pane-message"
}, Zi = /* @__PURE__ */ X({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(z) {
    const t = z, b = Ne(null), g = Ne("");
    return ze(
      () => t.module,
      async (k) => {
        if (!k) {
          b.value = null, g.value = "";
          return;
        }
        try {
          const w = await import(
            /* @vite-ignore */
            k
          );
          b.value = w?.default || w, g.value = "";
        } catch (w) {
          b.value = null, g.value = w?.message || String(w);
        }
      },
      { immediate: !0 }
    ), (k, w) => b.value ? (u(), ee(Xe(b.value), { key: 0 })) : g.value ? (u(), c("div", Gi, o(g.value), 1)) : (u(), c("div", Xi, "Loading plugin module…"));
  }
}), Qi = /* @__PURE__ */ ne(Zi, [["__scopeId", "data-v-2d1f36bc"]]), er = { class: "settings-page" }, tr = { class: "page-header" }, sr = { class: "subtitle" }, lr = { key: 0 }, or = { key: 1 }, nr = { class: "settings-layout" }, ar = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, ir = ["onClick"], rr = {
  class: "nav-icon",
  "aria-hidden": "true"
}, ur = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, dr = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, cr = {
  key: 2,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, pr = {
  key: 3,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, vr = {
  key: 4,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, hr = {
  key: 5,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, mr = {
  key: 6,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, _r = {
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
}, br = {
  key: 9,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, fr = {
  key: 10,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, yr = {
  key: 11,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, kr = { class: "nav-label" }, wr = { class: "settings-content" }, $r = {
  key: 0,
  class: "content-card provider-runtime"
}, Cr = {
  key: 0,
  class: "helper-text"
}, Pr = {
  key: 0,
  class: "toggle-label"
}, Sr = ["checked", "onChange"], xr = { key: 0 }, Mr = {
  key: 1,
  class: "helper-text"
}, Er = {
  key: 0,
  class: "helper-text"
}, Tr = ["type", "value", "onInput"], Ar = {
  key: 0,
  class: "helper-text"
}, Ur = {
  key: 1,
  class: "helper-text"
}, Nr = { class: "actions-row" }, Rr = {
  key: 4,
  class: "content-card"
}, Ir = { class: "card-desc" }, Or = { class: "toggle-label" }, Vr = { class: "field" }, zr = { class: "model-choices" }, Lr = ["value", "checked", "onChange"], Dr = ["placeholder"], Fr = { class: "helper-text" }, Br = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, jr = { class: "field" }, Kr = {
  key: 0,
  class: "helper-text"
}, Hr = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, Yr = ["value", "checked", "onChange"], Jr = ["onClick"], Wr = {
  key: 9,
  class: "content-card"
}, qr = {
  key: 0,
  class: "card-desc"
}, Gr = {
  key: 1,
  class: "helper-text"
}, Xr = {
  key: 0,
  class: "toggle-label"
}, Zr = ["checked", "onChange"], Qr = { key: 0 }, eu = {
  key: 1,
  class: "helper-text"
}, tu = {
  key: 0,
  class: "helper-text"
}, su = { class: "actions-row" }, lu = ["disabled"], ou = {
  key: 0,
  class: "helper-text"
}, nu = {
  key: 0,
  class: "helper-text"
}, au = ["type", "value", "onInput"], iu = {
  key: 0,
  class: "helper-text"
}, ru = {
  key: 2,
  class: "helper-text"
}, uu = { class: "actions-row" }, du = {
  key: 11,
  class: "content-card"
}, cu = {
  key: 0,
  class: "card-desc"
}, pu = {
  key: 1,
  class: "card-desc"
}, vu = {
  key: 0,
  class: "toggle-label"
}, hu = ["checked", "onChange"], mu = { key: 0 }, _u = {
  key: 1,
  class: "helper-text"
}, gu = {
  key: 0,
  class: "helper-text"
}, bu = ["type", "value", "onInput"], fu = {
  key: 0,
  class: "helper-text"
}, yu = {
  key: 2,
  class: "helper-text"
}, ku = { class: "actions-row" }, Eu = /* @__PURE__ */ X({
  __name: "SettingsPage",
  setup(z) {
    const { t, locale: b } = oe(), { confirm: g } = Ee(), k = Te(), w = lt(), p = Fe(), y = Ze(), $ = Le(), r = W(() => p.settingsTabs.map((O) => ({
      id: O.id,
      icon: O.icon || "chip"
    }))), d = W(() => {
      const O = new Set(p.settingsTabs.map((s) => s.id)), C = new Set(p.removedSettingsIds);
      return w.sections.filter((s) => s.id !== "permissions" && !O.has(s.id) && !C.has(s.id)).map((s) => ({ id: s.id, icon: s.icon || "lock" }));
    }), a = W(() => [...r.value, ...d.value]), i = P("general"), _ = P(!1), S = P([]), n = P(null), h = P(""), v = P({}), x = P(""), A = P(!1), E = P("");
    async function B(O) {
      A.value = !0, E.value = "";
      try {
        const C = await fetch(`/api/settings/${O}/test`, { method: "POST" }), s = C.headers.get("content-type") || "";
        if (C.ok && s.startsWith("audio")) {
          const m = URL.createObjectURL(await C.blob());
          try {
            await new Audio(m).play();
          } catch {
          }
          window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: m } })), E.value = "测试成功，正在播放…";
        } else {
          const m = await C.json().catch(() => ({}));
          E.value = m.error || `HTTP ${C.status}`;
        }
      } catch (C) {
        E.value = C instanceof Error ? C.message : String(C);
      } finally {
        A.value = !1;
      }
    }
    const { tabMeta: T, isBuiltinTab: R, isPluginSection: H, tabLabel: G, fieldLabel: Z, fieldHelp: V, pluginSection: I } = Ae(), N = W(() => R(i.value) ? null : T(i.value)?.module || null);
    function de(O, C) {
      const s = v.value[O]?.[C];
      return typeof s == "boolean" ? s : s === "true" || s === 1 || s === "1";
    }
    function he(O) {
      if (T(O)?.fields?.length && !R(O)) {
        we(O);
        return;
      }
      const s = I(O);
      if (!s) return;
      const m = {};
      for (const j of s.fields)
        j.type === "bool" ? m[j.key] = j.default_value === "true" || j.default_value === "1" : j.type === "number" ? m[j.key] = Number(j.default_value || 0) : m[j.key] = j.default_value || "";
      const f = w.values[O] || {}, D = { ...m };
      for (const j of s.fields) {
        if (!(j.key in f)) continue;
        const Q = f[j.key];
        j.type === "bool" ? D[j.key] = Q === !0 || Q === "true" || Q === 1 || Q === "1" : D[j.key] = Q;
      }
      v.value = {
        ...v.value,
        [O]: D
      };
    }
    async function we(O) {
      const C = T(O);
      if (!C?.fields?.length) return;
      const s = {};
      for (const m of C.fields)
        m.type === "bool" ? s[m.key] = m.default_value === "true" || m.default_value === "1" : m.type === "number" ? s[m.key] = Number(m.default_value || 0) : s[m.key] = m.default_value || "";
      if (C.loadApi)
        try {
          const m = await fetch(C.loadApi);
          if (m.ok) {
            const f = await m.json();
            for (const D of C.fields) {
              if (!(D.key in f)) continue;
              const j = f[D.key];
              D.type === "bool" ? s[D.key] = j === !0 || j === "true" || j === 1 || j === "1" : s[D.key] = j;
            }
          }
        } catch {
        }
      v.value = { ...v.value, [O]: s };
    }
    async function me(O) {
      const C = T(O);
      x.value = "";
      try {
        const s = v.value[O] || {};
        if (C?.saveApi) {
          const m = await fetch(C.saveApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(s)
          });
          if (!m.ok) throw new Error(String(m.status));
        }
        x.value = t("settings.saved"), setTimeout(() => {
          x.value = "";
        }, 1500);
      } catch {
        x.value = t("settings.permFailed");
      }
    }
    async function _e(O) {
      x.value = "";
      try {
        await w.saveValues(O, v.value[O] || {}), x.value = t("settings.saved"), setTimeout(() => {
          x.value = "";
        }, 1500);
      } catch {
        x.value = t("settings.permFailed");
      }
    }
    async function ge() {
      try {
        const O = await fetch("/api/live2d");
        if (O.ok) {
          const C = await O.json();
          S.value = C.models || [];
        }
      } catch {
        S.value = [];
      }
    }
    async function $e(O) {
      if (await g({
        title: t("settings.live2d"),
        message: `删除模型 ${O.label} 及所在模型文件夹中的全部资源？`,
        confirmLabel: b.value === "en" ? "Delete" : "删除",
        danger: !0
      }))
        try {
          const s = await fetch(`/api/live2d/${encodeURIComponent(O.id)}`, { method: "DELETE" });
          if (!s.ok) throw new Error(await s.text());
          const m = await s.json();
          S.value = m.models || [];
          const f = O.url.slice(0, O.url.indexOf("/", 15) + 1);
          k.live2d.modelUrl.startsWith(f) && (k.live2d.modelUrl = "", k.live2d.enabled = !1, k.saveToStorage()), await ae(), h.value = "模型已删除", window.dispatchEvent(new Event("live2d-models-changed"));
        } catch (s) {
          h.value = s.message;
        }
    }
    async function ae() {
      k.saveToStorage();
      const O = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: k.live2d.enabled, model_url: k.live2d.modelUrl } }) });
      if (!O.ok) throw new Error(await O.text());
    }
    function Ce() {
      n.value?.click();
    }
    async function be(O) {
      const C = O.target, s = C.files;
      if (!(!s || s.length === 0)) {
        h.value = "";
        try {
          const m = new FormData(), f = [];
          for (const Q of Array.from(s)) {
            const je = Q.webkitRelativePath || Q.name;
            f.push(je), m.append("files", Q, Q.name);
          }
          m.append("paths", JSON.stringify(f));
          const D = await fetch("/api/live2d", { method: "POST", body: m });
          if (!D.ok) throw new Error(await D.text());
          const j = await D.json();
          h.value = t("settings.uploadOk"), j?.models ? S.value = j.models : await ge(), j?.model_url && (k.live2d.modelUrl = j.model_url, k.live2d.enabled = !0, k.saveToStorage(), await ae(), window.dispatchEvent(new Event("live2d-models-changed")));
        } catch (m) {
          h.value = `${t("settings.uploadFail")}：${m.message}`;
        } finally {
          C.value = "";
        }
      }
    }
    le(async () => {
      k.loadFromStorage();
      const O = y.query.tab;
      O && (i.value = O), ge(), await w.fetchSections();
      for (const C of w.sections) he(C.id);
    });
    function Pe(O) {
      i.value = O, R(O) || he(O), $.replace({ query: { tab: O } });
    }
    function fe() {
      k.saveToStorage(), i.value === "live2d" && ae().catch((O) => {
        h.value = O.message;
      }), _.value = !0, setTimeout(() => {
        _.value = !1;
      }, 1500);
    }
    return (O, C) => (u(), c("div", er, [
      e("header", tr, [
        e("div", null, [
          e("h1", null, o(l(t)("settings.title")), 1),
          e("p", sr, o(l(t)("settings.pageDesc")), 1)
        ]),
        i.value !== "about" && !N.value ? (u(), c("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: fe
        }, [
          _.value ? (u(), c("span", lr, o(l(t)("settings.saved")), 1)) : (u(), c("span", or, o(l(t)("settings.save")), 1))
        ])) : M("", !0)
      ]),
      e("div", nr, [
        e("nav", ar, [
          (u(!0), c(K, null, J(a.value, (s) => (u(), c("button", {
            key: s.id,
            class: Y(["nav-item", { active: i.value === s.id }]),
            onClick: (m) => Pe(s.id)
          }, [
            C[19] || (C[19] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", rr, [
              s.icon === "globe" ? (u(), c("svg", ur, [...C[7] || (C[7] = [
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
              ])])) : s.icon === "cloud" ? (u(), c("svg", dr, [...C[8] || (C[8] = [
                e("path", {
                  d: "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])])) : s.icon === "chip" ? (u(), c("svg", cr, [...C[9] || (C[9] = [
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
              ])])) : s.icon === "person" ? (u(), c("svg", pr, [...C[10] || (C[10] = [
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
              ])])) : s.icon === "avatar" ? (u(), c("svg", vr, [...C[11] || (C[11] = [
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
              ])])) : s.icon === "brightness" ? (u(), c("svg", hr, [...C[12] || (C[12] = [
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
              ])])) : s.icon === "warn" ? (u(), c("svg", mr, [...C[13] || (C[13] = [
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
              ])])) : s.icon === "info" ? (u(), c("svg", _r, [...C[14] || (C[14] = [
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
              ])])) : s.icon === "download" ? (u(), c("svg", gr, [...C[15] || (C[15] = [
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
              ])])) : s.icon === "shield" ? (u(), c("svg", br, [...C[16] || (C[16] = [
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
              ])])) : s.icon === "link" ? (u(), c("svg", fr, [...C[17] || (C[17] = [
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
              ])])) : (u(), c("svg", yr, [...C[18] || (C[18] = [
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
            e("span", kr, o(l(G)(s.id)), 1)
          ], 10, ir))), 128))
        ]),
        e("section", wr, [
          i.value === "general" ? (u(), ee(zn, { key: 0 })) : i.value === "connection" ? (u(), ee(oa, { key: 1 })) : i.value === "provider" ? (u(), c(K, { key: 2 }, [
            se(Cn),
            l(I)("provider")?.fields?.length ? (u(), c("div", $r, [
              e("h3", null, o(l(I)("provider").label), 1),
              l(I)("provider").description ? (u(), c("p", Cr, o(l(I)("provider").description), 1)) : M("", !0),
              (u(!0), c(K, null, J(l(I)("provider").fields, (s) => (u(), c("div", {
                key: s.key,
                class: "field"
              }, [
                s.type === "bool" ? (u(), c("label", Pr, [
                  e("input", {
                    type: "checkbox",
                    checked: de("provider", s.key),
                    onChange: (m) => v.value = { ...v.value, provider: { ...v.value.provider, [s.key]: m.target.checked } }
                  }, null, 40, Sr),
                  C[20] || (C[20] = e("span", { class: "toggle-slider" }, null, -1)),
                  e("span", null, [
                    e("strong", null, o(s.label), 1),
                    s.help ? (u(), c("br", xr)) : M("", !0),
                    s.help ? (u(), c("small", Mr, o(s.help), 1)) : M("", !0)
                  ])
                ])) : s.type === "select" ? (u(), c(K, { key: 1 }, [
                  e("label", null, o(s.label), 1),
                  se(l(ue), {
                    class: "input",
                    "aria-label": s.label,
                    "model-value": String(v.value.provider?.[s.key] ?? ""),
                    options: s.options || [],
                    "onUpdate:modelValue": (m) => v.value = { ...v.value, provider: { ...v.value.provider, [s.key]: m } }
                  }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                  s.help ? (u(), c("p", Er, o(s.help), 1)) : M("", !0)
                ], 64)) : (u(), c(K, { key: 2 }, [
                  e("label", null, o(s.label), 1),
                  e("input", {
                    class: "input",
                    type: s.type === "number" ? "number" : "text",
                    value: v.value.provider?.[s.key],
                    onInput: (m) => v.value = { ...v.value, provider: { ...v.value.provider, [s.key]: s.type === "number" ? Number(m.target.value) : m.target.value } }
                  }, null, 40, Tr),
                  s.help ? (u(), c("p", Ar, o(s.help), 1)) : M("", !0)
                ], 64))
              ]))), 128)),
              x.value ? (u(), c("div", Ur, o(x.value), 1)) : M("", !0),
              e("div", Nr, [
                e("button", {
                  class: "btn btn-primary",
                  type: "button",
                  onClick: C[0] || (C[0] = (s) => _e("provider"))
                }, o(l(t)("settings.save")), 1)
              ])
            ])) : M("", !0)
          ], 64)) : i.value === "persona" ? (u(), ee(wa, { key: 3 })) : i.value === "live2d" ? (u(), c("div", Rr, [
            e("h2", null, o(l(G)("live2d")), 1),
            e("p", Ir, o(l(T)("live2d")?.descriptionKey ? l(t)(l(T)("live2d").descriptionKey) : l(t)("settings.live2dDesc")), 1),
            se(nt, { class: "live2d-preview" }),
            e("label", Or, [
              U(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": C[1] || (C[1] = (s) => l(k).live2d.enabled = s)
              }, null, 512), [
                [te, l(k).live2d.enabled]
              ]),
              C[21] || (C[21] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", null, o(l(t)("wizard.enableLive2d")), 1)
            ]),
            e("div", Vr, [
              e("label", null, o(l(t)("wizard.modelUrl")), 1),
              e("div", zr, [
                (u(!0), c(K, null, J(l(ot), (s) => (u(), c("label", {
                  key: s.id,
                  class: Y(["model-choice", { selected: l(k).live2d.modelUrl === s.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-model",
                    value: s.url,
                    checked: l(k).live2d.modelUrl === s.url,
                    onChange: (m) => {
                      l(k).live2d.modelUrl = s.url, l(k).live2d.enabled = !0;
                    }
                  }, null, 40, Lr),
                  e("span", null, o(s.label), 1),
                  e("code", null, o(s.url), 1)
                ], 2))), 128))
              ]),
              U(e("input", {
                "onUpdate:modelValue": C[2] || (C[2] = (s) => l(k).live2d.modelUrl = s),
                placeholder: l(t)("wizard.modelUrlPlaceholder"),
                class: "input"
              }, null, 8, Dr), [
                [L, l(k).live2d.modelUrl]
              ]),
              e("p", Fr, [
                q(o(l(t)("wizard.live2dHelp")) + " ", 1),
                e("a", Br, o(l(t)("wizard.live2dSamples")), 1)
              ])
            ]),
            C[22] || (C[22] = e("p", { class: "helper-text" }, "支持 Cubism 2（.model.json + .moc）与 Cubism 3/4（.model3.json + .moc3）。请选择完整模型文件夹，包含纹理、动作等资源。", -1)),
            e("button", {
              class: "btn btn-tonal",
              onClick: C[3] || (C[3] = (s) => ae().catch((m) => h.value = m.message))
            }, "保存 LIFE 的 Live2D 设置"),
            e("div", jr, [
              e("label", null, o(l(t)("settings.uploadFolder")), 1),
              e("label", {
                class: "upload-area",
                onClick: Re(Ce, ["prevent"])
              }, [
                e("span", null, o(l(t)("settings.uploadFolderHint")), 1)
              ]),
              e("input", {
                ref_key: "folderInput",
                ref: n,
                type: "file",
                webkitdirectory: "",
                directory: "",
                multiple: "",
                class: "file-input",
                onChange: be
              }, null, 544),
              h.value ? (u(), c("p", Kr, o(h.value), 1)) : M("", !0),
              S.value.length ? (u(), c("div", Hr, [
                (u(!0), c(K, null, J(S.value, (s) => (u(), c("label", {
                  key: s.id,
                  class: Y(["model-choice", { selected: l(k).live2d.modelUrl === s.url }])
                }, [
                  e("input", {
                    type: "radio",
                    name: "live2d-uploaded",
                    value: s.url,
                    checked: l(k).live2d.modelUrl === s.url,
                    onChange: (m) => {
                      l(k).live2d.modelUrl = s.url, l(k).live2d.enabled = !0, ae().catch((f) => h.value = f.message);
                    }
                  }, null, 40, Yr),
                  e("span", null, o(s.label), 1),
                  e("code", null, o(s.url), 1),
                  e("button", {
                    type: "button",
                    class: "btn btn-danger",
                    onClick: Re((m) => $e(s), ["prevent"])
                  }, "删除模型", 8, Jr)
                ], 2))), 128))
              ])) : M("", !0)
            ])
          ])) : i.value === "security" ? (u(), ee(bi, { key: 5 })) : i.value === "permissions" ? (u(), ee(Ra, { key: 6 })) : i.value === "mcp" ? (u(), ee(Hi, { key: 7 })) : i.value === "life_settings" ? (u(), ee(is, { key: 8 })) : l(H)(i.value) && l(I)(i.value) ? (u(), c("div", Wr, [
            e("h2", null, o(l(I)(i.value).label), 1),
            l(I)(i.value).description ? (u(), c("p", qr, o(l(I)(i.value).description), 1)) : M("", !0),
            l(I)(i.value).plugin_name ? (u(), c("p", Gr, o(l(I)(i.value).plugin_name), 1)) : M("", !0),
            (u(!0), c(K, null, J(l(I)(i.value).fields, (s) => (u(), c("div", {
              key: s.key,
              class: "field"
            }, [
              s.type === "bool" ? (u(), c("label", Xr, [
                e("input", {
                  type: "checkbox",
                  checked: de(i.value, s.key),
                  onChange: (m) => v.value = { ...v.value, [i.value]: { ...v.value[i.value], [s.key]: m.target.checked } }
                }, null, 40, Zr),
                C[23] || (C[23] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, o(s.label), 1),
                  s.help ? (u(), c("br", Qr)) : M("", !0),
                  s.help ? (u(), c("small", eu, o(s.help), 1)) : M("", !0)
                ])
              ])) : s.type === "select" ? (u(), c(K, { key: 1 }, [
                e("label", null, o(s.label), 1),
                se(l(ue), {
                  class: "input",
                  "aria-label": s.label,
                  "model-value": String(v.value[i.value]?.[s.key] ?? ""),
                  options: s.options || [],
                  "onUpdate:modelValue": (m) => v.value[i.value] = { ...v.value[i.value], [s.key]: m }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                s.help ? (u(), c("p", tu, o(s.help), 1)) : M("", !0)
              ], 64)) : s.type === "test" ? (u(), c(K, { key: 2 }, [
                e("label", null, o(s.label), 1),
                e("div", su, [
                  e("button", {
                    class: "btn btn-tonal",
                    type: "button",
                    disabled: A.value,
                    onClick: C[4] || (C[4] = (m) => B(i.value))
                  }, o(A.value ? l(t)("settings.testing") : s.label || "测试"), 9, lu),
                  E.value ? (u(), c("span", ou, o(E.value), 1)) : M("", !0)
                ]),
                s.help ? (u(), c("p", nu, o(s.help), 1)) : M("", !0)
              ], 64)) : (u(), c(K, { key: 3 }, [
                e("label", null, o(s.label), 1),
                e("input", {
                  class: "input",
                  type: s.type === "number" ? "number" : "text",
                  value: v.value[i.value]?.[s.key],
                  onInput: (m) => v.value[i.value] = { ...v.value[i.value], [s.key]: s.type === "number" ? Number(m.target.value) : m.target.value }
                }, null, 40, au),
                s.help ? (u(), c("p", iu, o(s.help), 1)) : M("", !0)
              ], 64))
            ]))), 128)),
            x.value ? (u(), c("div", ru, o(x.value), 1)) : M("", !0),
            e("div", uu, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: C[5] || (C[5] = (s) => _e(i.value))
              }, o(l(t)("settings.save")), 1)
            ])
          ])) : N.value ? (u(), ee(Qi, {
            key: N.value,
            module: N.value || ""
          }, null, 8, ["module"])) : !l(R)(i.value) && l(T)(i.value)?.fields?.length ? (u(), c("div", du, [
            e("h2", null, o(l(G)(i.value)), 1),
            l(T)(i.value)?.descriptionKey ? (u(), c("p", cu, o(l(t)(l(T)(i.value).descriptionKey)), 1)) : l(T)(i.value)?.description ? (u(), c("p", pu, o(l(T)(i.value).description), 1)) : M("", !0),
            (u(!0), c(K, null, J(l(T)(i.value).fields, (s) => (u(), c("div", {
              key: s.key,
              class: "field"
            }, [
              s.type === "bool" ? (u(), c("label", vu, [
                e("input", {
                  type: "checkbox",
                  checked: de(i.value, s.key),
                  onChange: (m) => v.value = { ...v.value, [i.value]: { ...v.value[i.value], [s.key]: m.target.checked } }
                }, null, 40, hu),
                C[24] || (C[24] = e("span", { class: "toggle-slider" }, null, -1)),
                e("span", null, [
                  e("strong", null, o(l(Z)(l(T)(i.value), s.key, `settings.${s.key}`)), 1),
                  s.help || s.helpKey ? (u(), c("br", mu)) : M("", !0),
                  s.help || s.helpKey ? (u(), c("small", _u, o(l(V)(l(T)(i.value), s.key, `settings.${s.key}Desc`)), 1)) : M("", !0)
                ])
              ])) : s.type === "select" ? (u(), c(K, { key: 1 }, [
                e("label", null, o(l(Z)(l(T)(i.value), s.key, `settings.${s.key}`)), 1),
                se(l(ue), {
                  class: "input",
                  "aria-label": l(Z)(l(T)(i.value), s.key, `settings.${s.key}`),
                  "model-value": String(v.value[i.value]?.[s.key] ?? ""),
                  options: s.options || [],
                  "onUpdate:modelValue": (m) => v.value[i.value] = { ...v.value[i.value], [s.key]: m }
                }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                s.help || s.helpKey ? (u(), c("p", gu, o(l(V)(l(T)(i.value), s.key, `settings.${s.key}Desc`)), 1)) : M("", !0)
              ], 64)) : (u(), c(K, { key: 2 }, [
                e("label", null, o(l(Z)(l(T)(i.value), s.key, `settings.${s.key}`)), 1),
                e("input", {
                  class: "input",
                  type: s.type === "number" ? "number" : "text",
                  value: v.value[i.value]?.[s.key],
                  onInput: (m) => v.value[i.value] = { ...v.value[i.value], [s.key]: s.type === "number" ? Number(m.target.value) : m.target.value }
                }, null, 40, bu),
                s.help || s.helpKey ? (u(), c("p", fu, o(l(V)(l(T)(i.value), s.key, `settings.${s.key}Desc`)), 1)) : M("", !0)
              ], 64))
            ]))), 128)),
            x.value ? (u(), c("div", yu, o(x.value), 1)) : M("", !0),
            e("div", ku, [
              e("button", {
                class: "btn btn-primary",
                type: "button",
                onClick: C[6] || (C[6] = (s) => me(i.value))
              }, o(l(t)("settings.save")), 1)
            ])
          ])) : i.value === "about" ? (u(), ee(pl, { key: 12 })) : i.value === "updates" ? (u(), ee(eo, { key: 13 })) : (u(), ee(qi, { key: 14 }))
        ])
      ])
    ]));
  }
});
export {
  Eu as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".live2d-stage[data-v-ed3cc7f4]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-ed3cc7f4]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:none;cursor:grab;user-select:none;background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,#f3edf7,#e7e0ec 55%,#d0bcff33)}.stage-viewport[data-v-ed3cc7f4]:active{cursor:grabbing}.stage-canvas[data-v-ed3cc7f4]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-ed3cc7f4]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-ed3cc7f4]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-ed3cc7f4]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-ed3cc7f4]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-ed3cc7f4]:active{transform:scale(.96)}.stage-reset.dragging[data-v-ed3cc7f4]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-ed3cc7f4]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-ed3cc7f4]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-ed3cc7f4]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-bdd613ec]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-bdd613ec]{flex-direction:row-reverse}.avatar[data-v-bdd613ec]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-bdd613ec]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-bdd613ec]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-bdd613ec]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-bdd613ec]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-bdd613ec]{max-width:70%}.content[data-v-bdd613ec]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.user .content[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-bdd613ec]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-bdd613ec]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-bdd613ec]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-bdd613ec]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-bdd613ec]{margin:4px 0}.think-body b[data-v-bdd613ec]{color:var(--md-on-surface)}.think-summary[data-v-bdd613ec]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-bdd613ec]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-bdd613ec]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-bdd613ec]{justify-content:flex-end}.separator[data-v-bdd613ec]{color:var(--neutral-gray-10)}.emotion[data-v-bdd613ec]{font-weight:500}.chat-panel[data-v-3b7db97c]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-3b7db97c]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-3b7db97c]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-3b7db97c]{color:var(--md-error)}.chat-container[data-v-3b7db97c]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-3b7db97c]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-3b7db97c]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-3b7db97c]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-3b7db97c]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-3b7db97c]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-3b7db97c]{display:flex;gap:4px}.typing-dots span[data-v-3b7db97c]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-3b7db97c 1.4s infinite ease-in-out}.typing-dots span[data-v-3b7db97c]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-3b7db97c]:nth-child(2){animation-delay:-.16s}@keyframes bounce-3b7db97c{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-3b7db97c]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-3b7db97c]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-3b7db97c]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-3b7db97c]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-3b7db97c]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-3b7db97c],.pending-files[data-v-3b7db97c]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-3b7db97c]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-3b7db97c]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-3b7db97c]:hover{color:var(--error)}.pending-thumb[data-v-3b7db97c]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-3b7db97c]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-3b7db97c]{position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.attach-btn[data-v-3b7db97c]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-3b7db97c]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-3b7db97c]:disabled{opacity:.5;cursor:not-allowed}.send-button[data-v-3b7db97c]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-3b7db97c]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-3b7db97c]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-3b7db97c]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-3b7db97c]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-3b7db97c]{background:var(--success)}.disconnected .status-dot[data-v-3b7db97c]{background:var(--error)}.hint[data-v-3b7db97c]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-95ba671e]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-95ba671e]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-95ba671e]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-95ba671e]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-95ba671e]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-95ba671e]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-95ba671e]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-95ba671e]{margin-bottom:var(--space-xl)}.section-header[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-95ba671e]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.section-value[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-30)}.mood-display[data-v-95ba671e]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-95ba671e]{margin-bottom:var(--space-md)}.mood-label[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600}.energy-bar[data-v-95ba671e]{height:8px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.energy-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out),background-color var(--duration-medium) var(--ease-out)}.emotion-bars[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-95ba671e]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-95ba671e]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-95ba671e]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.task-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-id[data-v-95ba671e]{font-family:monospace;font-size:var(--font-size-sm);color:var(--neutral-gray-50)}.task-status[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary)}.connection-info[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-sm);font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.link-btn[data-v-95ba671e]{border:none;background:none;color:var(--brand-primary);font-size:var(--font-size-xs);cursor:pointer;padding:0}.link-btn[data-v-95ba671e]:disabled{opacity:.5;cursor:default}.memory-stats[data-v-95ba671e]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);margin-bottom:var(--space-sm)}.memory-stat[data-v-95ba671e]{padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);text-align:center}.memory-stat-label[data-v-95ba671e]{display:block;font-size:var(--font-size-xs);color:var(--neutral-gray-30);margin-bottom:2px}.memory-stat-value[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-50)}.memory-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-xs)}.memory-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-sm);padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);font-size:var(--font-size-sm)}.memory-text[data-v-95ba671e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--neutral-gray-50)}.memory-strength[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary);font-weight:600}.connection-dot[data-v-95ba671e]{width:8px;height:8px;border-radius:50%;background:var(--error)}.connection-dot.connected[data-v-95ba671e]{background:var(--success)}.state-source[data-v-95ba671e]{margin-left:auto;font-size:var(--font-size-xs);font-weight:700;color:var(--brand-primary);letter-spacing:.5px}.agents-display[data-v-95ba671e]{padding:var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.agent-count[data-v-95ba671e]{display:flex;align-items:baseline;gap:var(--space-sm)}.agent-number[data-v-95ba671e]{font-size:var(--font-size-xl);font-weight:700;color:var(--neutral-gray-30)}.agent-number.online[data-v-95ba671e]{color:var(--success)}.agent-label[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.agent-offline[data-v-95ba671e]{margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.chat-page[data-v-157876d6]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-157876d6]{grid-template-columns:1fr}.stage-column[data-v-157876d6]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-157876d6]{flex:1;min-height:240px}.status-panel[data-v-157876d6]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-157876d6]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-157876d6]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-157876d6]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-157876d6]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-157876d6]:hover,.page-resizer[data-v-157876d6]:active{background:var(--md-primary)}.chat-column[data-v-157876d6]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-157876d6]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-157876d6]{display:flex;flex-direction:column}.stage-column[data-v-157876d6]{flex:1;min-height:0}.page-resizer[data-v-157876d6]{display:none}.chat-column[data-v-157876d6]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);transition:transform var(--transition-normal)}.chat-column.open[data-v-157876d6]{transform:translate(0)}}.plugins-page[data-v-b484d3da]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-b484d3da]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-b484d3da]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-b484d3da],.pp-hero h1[data-v-b484d3da]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-b484d3da]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-b484d3da]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-b484d3da]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.pp-stats[data-v-b484d3da]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-b484d3da]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-b484d3da]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-b484d3da]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-b484d3da]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-b484d3da]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-b484d3da]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-b484d3da]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-b484d3da]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-b484d3da var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-b484d3da{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-b484d3da]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-b484d3da]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-b484d3da]{opacity:.62}.plugin-top[data-v-b484d3da]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-b484d3da]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-b484d3da]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-b484d3da]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-b484d3da]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-b484d3da]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-b484d3da]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-b484d3da]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-b484d3da]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-b484d3da]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-b484d3da]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-b484d3da]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-b484d3da]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-b484d3da]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-b484d3da]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-b484d3da]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-b484d3da]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-b484d3da]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-b484d3da]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-b484d3da]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-b484d3da]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-b484d3da]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-b484d3da]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-b484d3da]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-b484d3da]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-b484d3da]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-b484d3da]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-b484d3da]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-b484d3da]{white-space:nowrap}#app .plugins-page .btn[data-v-b484d3da]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-b484d3da]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-b484d3da]:disabled{opacity:.6;cursor:not-allowed}#app .plugins-page .btn-tonal[data-v-b484d3da]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .plugins-page .btn-danger[data-v-b484d3da]{background:var(--md-error-container);color:var(--md-on-error-container)}.empty-state[data-v-b484d3da]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-b484d3da]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-b484d3da]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-b484d3da]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-b484d3da]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-b484d3da]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-b484d3da]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-b484d3da],.pd-leave-to[data-v-b484d3da]{opacity:0}.pd-enter-active .pd-dialog[data-v-b484d3da]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-b484d3da]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-b484d3da],.pd-leave-to .pd-dialog[data-v-b484d3da]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-b484d3da]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-b484d3da]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-b484d3da]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-b484d3da]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-b484d3da]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-b484d3da]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-b484d3da]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-b484d3da]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-b484d3da]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-b484d3da]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-b484d3da]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-b484d3da]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-b484d3da]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-b484d3da]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-b484d3da]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-b484d3da]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-b484d3da]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-b484d3da]{color:var(--md-error)}.pd-foot[data-v-b484d3da]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-b484d3da]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn-tonal[data-v-b484d3da]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pd-foot .btn-danger[data-v-b484d3da]{background:var(--md-error-container);color:var(--md-on-error-container)}.pd-foot .btn[data-v-b484d3da]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-b484d3da],.pd-leave-active[data-v-b484d3da],.pd-enter-active .pd-dialog[data-v-b484d3da],.pd-leave-active .pd-dialog[data-v-b484d3da]{transition:none}.pd-enter-from .pd-dialog[data-v-b484d3da],.pd-leave-to .pd-dialog[data-v-b484d3da]{transform:none}}.life-settings[data-v-537538f7]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-537538f7]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-537538f7 .52s var(--ls-spring) both}.ls-hero-main[data-v-537538f7]{min-width:0}.ls-eyebrow[data-v-537538f7]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-537538f7]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-537538f7]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-537538f7]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-537538f7]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-537538f7]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-537538f7]{font-size:16px}.ls-grid[data-v-537538f7]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-537538f7]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-537538f7 .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-537538f7]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-537538f7]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-537538f7]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-537538f7]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-537538f7]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-537538f7]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-537538f7]{grid-column:1 / -1}.ls-card-head[data-v-537538f7]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-537538f7]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-537538f7]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-537538f7]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-537538f7]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-537538f7]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-537538f7]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-537538f7]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-537538f7]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-537538f7]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-537538f7]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-537538f7]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-537538f7]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-537538f7]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-537538f7]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-537538f7]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-537538f7]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-537538f7]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-537538f7]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-537538f7]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-537538f7]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-537538f7]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-537538f7]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-537538f7]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-537538f7]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-537538f7]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-537538f7]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-537538f7]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-537538f7]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-537538f7]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-537538f7]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-537538f7]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-537538f7]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-537538f7]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}.ls-model b[data-v-537538f7]{font-size:13px;word-break:break-all}.ls-model span[data-v-537538f7]{font-size:12px;color:var(--md-on-surface-variant)}.ls-state[data-v-537538f7]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-537538f7 .32s var(--ls-spring) both}.ls-mail-actions[data-v-537538f7]{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}#app .ls-mail-actions .ls-test[data-v-537538f7]{min-height:44px;padding:0 20px;border:0;border-radius:999px;cursor:pointer;font:700 13px/1 inherit;background:var(--md-secondary-container);color:var(--md-on-secondary-container);transition:transform var(--duration-medium) var(--ease-spring),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .ls-mail-actions .ls-test[data-v-537538f7]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .ls-mail-actions .ls-test[data-v-537538f7]:disabled{opacity:.55;cursor:not-allowed}.ls-mail-result[data-v-537538f7]{margin:4px 0 0;padding:12px 15px;border-radius:16px;font-size:12.5px;line-height:1.55;font-weight:600}.ls-mail-result.ok[data-v-537538f7]{background:var(--md-success-container);color:var(--md-on-success-container)}.ls-mail-result.bad[data-v-537538f7]{background:var(--md-error-container);color:var(--md-on-error-container)}@keyframes ls-rise-537538f7{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-537538f7{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-537538f7],.ls-row[data-v-537538f7],.ls-models[data-v-537538f7]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-537538f7],.ls-card[data-v-537538f7],.ls-state[data-v-537538f7]{animation:none}}.about[data-v-f0cbac94]{display:flex;flex-direction:column;gap:26px}.identity[data-v-f0cbac94]{display:flex;align-items:center;gap:16px}.app-icon[data-v-f0cbac94]{flex:none;width:56px;height:56px;border-radius:16px;background:var(--md-primary);color:var(--md-on-primary);display:grid;place-items:center;font-size:20px;font-weight:750;letter-spacing:-1px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 35%,transparent)}.app-id[data-v-f0cbac94]{flex:1;min-width:0}.app-id h2[data-v-f0cbac94]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-f0cbac94]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-f0cbac94]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-f0cbac94]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-f0cbac94]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-f0cbac94]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-f0cbac94]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.btn.sm[data-v-f0cbac94]{height:34px;padding-inline:16px;font-size:13px}.credits[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-f0cbac94]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-f0cbac94]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-f0cbac94]{font-size:16px;font-weight:650}.person-info .role[data-v-f0cbac94]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-f0cbac94]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-f0cbac94]{margin-top:6px}.contribs[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-f0cbac94]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-f0cbac94]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-f0cbac94]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-f0cbac94]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-f0cbac94]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-f0cbac94]{margin-left:auto}.status-chip[data-v-f0cbac94]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-f0cbac94]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-f0cbac94]:hover{text-decoration:underline}.muted[data-v-f0cbac94]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-f0cbac94]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-f0cbac94]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-f0cbac94]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-f0cbac94]{flex:1;min-width:0}.us-hero-text b[data-v-f0cbac94]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-f0cbac94]{font-size:13px;opacity:.85}.us-hero-text em[data-v-f0cbac94]{font-style:normal;font-weight:700}.us-hero-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-f0cbac94]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-f0cbac94]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-f0cbac94]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-f0cbac94]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-f0cbac94]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-f0cbac94]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-f0cbac94]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-f0cbac94]{font-weight:700}.us-apply-label[data-v-f0cbac94]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-f0cbac94]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-f0cbac94]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-f0cbac94]{animation:us-spin-f0cbac94 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-f0cbac94],.us-apply-banner.failed .us-spinner[data-v-f0cbac94]{display:none}.us-apply-log[data-v-f0cbac94],.us-apply-error[data-v-f0cbac94]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-f0cbac94{to{transform:rotate(360deg)}}.alert[data-v-f0cbac94]{color:var(--md-error)}.updates[data-v-6bbe694b]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-6bbe694b]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-6bbe694b]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-6bbe694b]{display:flex;align-items:center;gap:12px}.us-ico[data-v-6bbe694b]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-6bbe694b]{flex:1;min-width:0}.us-title[data-v-6bbe694b]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-6bbe694b]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-6bbe694b]{display:flex;align-items:center;gap:8px}.us-tag[data-v-6bbe694b]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-6bbe694b]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-6bbe694b]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-source[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-6bbe694b]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-6bbe694b]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-6bbe694b]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-6bbe694b]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-6bbe694b]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-6bbe694b]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-6bbe694b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-6bbe694b]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-6bbe694b]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-6bbe694b]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-6bbe694b]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-6bbe694b]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-6bbe694b]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-6bbe694b]{flex:1;min-width:0}.us-hero-text b[data-v-6bbe694b]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-6bbe694b]{font-size:13px;opacity:.85}.us-hero-text em[data-v-6bbe694b]{font-style:normal;font-weight:700}.us-hero-actions[data-v-6bbe694b]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-6bbe694b]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-6bbe694b]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-6bbe694b]{font-weight:700}.us-apply-label[data-v-6bbe694b]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-6bbe694b]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-6bbe694b]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-6bbe694b]{animation:us-spin-6bbe694b .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-6bbe694b],.us-apply-banner.failed .us-spinner[data-v-6bbe694b]{display:none}.us-apply-log[data-v-6bbe694b],.us-apply-error[data-v-6bbe694b]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-6bbe694b{to{transform:rotate(360deg)}}.us-table[data-v-6bbe694b]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-6bbe694b]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-6bbe694b]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-6bbe694b]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-6bbe694b]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-6bbe694b]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-6bbe694b]{background:var(--md-success)}.us-dot.warn[data-v-6bbe694b]{background:#e0a800}.us-dot.bad[data-v-6bbe694b]{background:var(--md-error)}.us-ver[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-6bbe694b]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-6bbe694b]{font-weight:650}.us-ver b.good[data-v-6bbe694b]{color:var(--md-success)}.us-arrow[data-v-6bbe694b]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-6bbe694b]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-6bbe694b]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-6bbe694b]:hover{text-decoration:underline}.us-empty[data-v-6bbe694b]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-6bbe694b]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-6bbe694b]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.btn.sm[data-v-6bbe694b]{height:34px;padding-inline:16px;font-size:13px}.btn.xs[data-v-6bbe694b]{height:30px;padding-inline:12px;font-size:12px}.alert[data-v-6bbe694b]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-6bbe694b]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-6bbe694b]{display:none}.us-hero[data-v-6bbe694b]{flex-wrap:wrap}.us-hero-actions[data-v-6bbe694b]{width:100%}}.provider-panel[data-v-dc98b94b]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-dc98b94b]{display:flex;align-items:center;gap:14px}.pp-back[data-v-dc98b94b]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-dc98b94b]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-dc98b94b]{flex:1;min-width:0}.pp-editor-title h2[data-v-dc98b94b]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-dc98b94b]{margin:3px 0 0}.pp-section[data-v-dc98b94b]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-dc98b94b]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-dc98b94b]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-dc98b94b]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-dc98b94b]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-dc98b94b]{margin-bottom:0}.pp-span[data-v-dc98b94b]{grid-column:1 / -1}.pp-req[data-v-dc98b94b]{color:var(--md-error);margin-left:2px}.pp-key[data-v-dc98b94b]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-dc98b94b]{flex:1}.pp-key-toggle[data-v-dc98b94b]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-dc98b94b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-dc98b94b]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-dc98b94b]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-dc98b94b]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-dc98b94b]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-dc98b94b]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-dc98b94b]{animation:pp-pulse-dc98b94b 1s ease-in-out infinite}@keyframes pp-pulse-dc98b94b{50%{opacity:.15}}.pp-probe[data-v-dc98b94b]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-dc98b94b]{color:var(--md-success)}.pp-probe.err[data-v-dc98b94b]{color:var(--md-error)}.pp-discovered[data-v-dc98b94b]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-dc98b94b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-dc98b94b]{flex:1;min-width:160px}.pp-mini[data-v-dc98b94b]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-dc98b94b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-models[data-v-dc98b94b]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-dc98b94b]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-dc98b94b]:first-child{border-top:0}.pp-model.off[data-v-dc98b94b]{opacity:.5}.pp-model-name[data-v-dc98b94b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-dc98b94b]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-dc98b94b]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-dc98b94b]{color:#e0a800;cursor:default}.pp-switch[data-v-dc98b94b]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-dc98b94b]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-dc98b94b]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-dc98b94b]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-dc98b94b]{display:flex;gap:10px}.pp-list-head[data-v-dc98b94b]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-dc98b94b]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-dc98b94b]{margin:3px 0 0}.pp-list-actions[data-v-dc98b94b]{display:flex;gap:8px}.pp-cards[data-v-dc98b94b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-dc98b94b]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-dc98b94b]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-dc98b94b]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-dc98b94b]{opacity:.62}.pp-card-head[data-v-dc98b94b]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-dc98b94b]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-dc98b94b]{width:26px;height:26px}.pp-card-id[data-v-dc98b94b]{flex:1;min-width:0}.pp-card-id strong[data-v-dc98b94b]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-dc98b94b]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-dc98b94b]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-dc98b94b]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-dc98b94b]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-dc98b94b]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-dc98b94b]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-dc98b94b]{color:var(--md-error)}.pp-chips[data-v-dc98b94b]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-dc98b94b]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-dc98b94b],.pp-chip.empty[data-v-dc98b94b]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-dc98b94b]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.btn.sm[data-v-dc98b94b]{height:32px;padding-inline:12px;font-size:12.5px}.btn.xs[data-v-dc98b94b]{height:28px;padding-inline:12px;font-size:12px}.pp-empty[data-v-dc98b94b]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-dc98b94b],.pp-cards[data-v-dc98b94b]{grid-template-columns:1fr}}.pairing-panel[data-v-0559b1b2]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-0559b1b2]{margin:12px 0;color:var(--md-on-surface-variant)}article[data-v-0559b1b2]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-0559b1b2]{font-size:24px;letter-spacing:4px}button[data-v-0559b1b2]{padding:8px 12px}.connection-grid[data-v-247dc582]{display:grid;grid-template-columns:minmax(280px,1fr) auto;gap:24px;align-items:start}@media(max-width:760px){.connection-grid[data-v-247dc582]{grid-template-columns:1fr}}.connection-form .field[data-v-247dc582]{margin-bottom:12px}.connection-qr[data-v-247dc582]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-247dc582]{background:#fff;border-radius:8px;padding:6px}.connection-link[data-v-247dc582]{max-width:280px;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.toggle-label[data-v-247dc582]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-bd35de8f]{max-width:920px}.sec-stack[data-v-bd35de8f]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-bd35de8f]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-bd35de8f]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-bd35de8f]{font-size:15px;font-weight:700}.sec-chip[data-v-bd35de8f]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-bd35de8f]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-bd35de8f]{margin:2px 0 12px}.sec-pin-grid[data-v-bd35de8f]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-bd35de8f]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-bd35de8f]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-bd35de8f]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-bd35de8f]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-bd35de8f]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-bd35de8f]:hover{background:var(--md-surface-container)}.page-item[data-v-bd35de8f]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-bd35de8f]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-bd35de8f]{width:44px;height:26px}.page-item .toggle-slider[data-v-bd35de8f]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-bd35de8f]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-bd35de8f]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-bd35de8f]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-bd35de8f]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-bd35de8f]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-bd35de8f]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-bd35de8f]{margin-top:12px}.sec-error[data-v-bd35de8f]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-bd35de8f]{grid-template-columns:1fr}}.mcp-panel[data-v-3b21cb32]{max-width:900px}.mcp-head[data-v-3b21cb32]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-3b21cb32]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-3b21cb32]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-3b21cb32]{display:flex;gap:10px}.error-banner[data-v-3b21cb32]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-3b21cb32]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-3b21cb32]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-3b21cb32]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-3b21cb32]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-row[data-v-3b21cb32]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-3b21cb32]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-3b21cb32]{flex:1}.mcp-field>span[data-v-3b21cb32]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-3b21cb32],.mcp-field select[data-v-3b21cb32],.mcp-field textarea[data-v-3b21cb32]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field textarea[data-v-3b21cb32]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-3b21cb32]:focus,.mcp-field select[data-v-3b21cb32]:focus,.mcp-field textarea[data-v-3b21cb32]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-3b21cb32]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-3b21cb32]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.btn[data-v-3b21cb32]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-3b21cb32]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-3b21cb32]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-3b21cb32]:disabled{opacity:.6;cursor:not-allowed}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.usage-page[data-v-a7476de1]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-a7476de1]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-a7476de1]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-a7476de1]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-a7476de1]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-a7476de1]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-a7476de1]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-a7476de1]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .usage-page .btn[data-v-a7476de1]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-a7476de1]:disabled{opacity:.55;cursor:not-allowed}#app .usage-page .btn-tonal[data-v-a7476de1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .usage-page .btn-danger[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.overview[data-v-a7476de1]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-a7476de1]{display:grid;place-items:center}.donut[data-v-a7476de1]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-a7476de1]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-a7476de1]{fill:none;stroke-width:5}.donut-track[data-v-a7476de1]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-a7476de1]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-a7476de1]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-a7476de1]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-a7476de1]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-a7476de1]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-a7476de1]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-a7476de1]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-a7476de1]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-a7476de1]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-a7476de1]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-a7476de1]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-a7476de1]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-a7476de1]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-a7476de1]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-a7476de1]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-a7476de1]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-a7476de1]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-a7476de1]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-a7476de1]{background:var(--md-primary)}.dot.completion[data-v-a7476de1]{background:var(--md-tertiary)}.mini-stack[data-v-a7476de1]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-a7476de1]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-a7476de1]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-a7476de1]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-a7476de1]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-a7476de1]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-a7476de1]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-a7476de1]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-a7476de1]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-a7476de1]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-a7476de1]{position:absolute;inset:0}.grid span[data-v-a7476de1]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-a7476de1]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-a7476de1]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-a7476de1]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-a7476de1]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-a7476de1]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-a7476de1]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-a7476de1]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-a7476de1]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-a7476de1]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-a7476de1]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-a7476de1]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-a7476de1]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-a7476de1]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-a7476de1]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-a7476de1]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-a7476de1]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-a7476de1]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-a7476de1]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-a7476de1]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-a7476de1]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-a7476de1]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}@keyframes up-a7476de1{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-a7476de1]{grid-template-columns:1fr 1fr}.mini-stack[data-v-a7476de1]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-a7476de1],.mini-stack[data-v-a7476de1]{grid-template-columns:1fr}.chart[data-v-a7476de1]{height:200px;padding-left:34px}.grid span i[data-v-a7476de1]{left:-34px;width:28px}.axis span[data-v-a7476de1]{font-size:11px}}\n";document.head.appendChild(s)}})();
