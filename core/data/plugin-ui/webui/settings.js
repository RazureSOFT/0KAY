var lt = Object.defineProperty;
var ot = (L, s, _) => s in L ? lt(L, s, { enumerable: !0, configurable: !0, writable: !0, value: _ }) : L[s] = _;
var K = (L, s, _) => ot(L, typeof s != "symbol" ? s + "" : s, _);
import { defineComponent as ee, reactive as nt, ref as P, onMounted as ae, openBlock as a, createElementBlock as r, createElementVNode as e, toDisplayString as l, unref as t, createTextVNode as oe, withDirectives as N, vModelCheckbox as Q, vModelText as D, Fragment as F, renderList as J, normalizeClass as j, createCommentVNode as M, computed as Y, onUnmounted as ze, withKeys as Ge, createStaticVNode as at, createVNode as W, vModelDynamic as it, withModifiers as Oe, TransitionGroup as Be, withCtx as Ie, watch as Xe, vModelSelect as rt, shallowRef as Ke, createBlock as le, resolveDynamicComponent as ut, Transition as dt } from "vue";
import { useRouter as Ze, useRoute as ct } from "vue-router";
import { useI18n as te } from "vue-i18n";
import { apiGet as he, apiPost as Me, ApiError as Qe, useConfirm as Ce, useProvidersStore as pt, PROVIDERS as Ve, AppSelect as ue, getLanguage as ht, LOCALES as vt, setLanguage as mt, useWizardStore as Le, useSettingsMeta as De, useUIPatchesStore as et, PinInput as He, useSettingsSectionsStore as _t, DEFAULT_LIVE2D_MODELS as gt } from "@0kay/host";
import { L as bt } from "./assets/Live2DStage-CQ-AJ4l1.js";
import { _ as ie } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
import { t as je } from "./assets/toast-CztbypyC.js";
const ft = { class: "life-settings" }, yt = { class: "ls-hero" }, kt = { class: "ls-hero-main" }, wt = { class: "ls-sub" }, $t = ["disabled"], Ct = { class: "ls-grid" }, St = { class: "ls-card" }, Pt = { class: "ls-card-head" }, xt = { class: "ls-switch" }, Mt = { class: "ls-switch-text" }, Ut = { class: "ls-switch" }, Et = { class: "ls-switch-text" }, Tt = { class: "ls-field" }, At = ["placeholder"], Nt = { class: "ls-card" }, Vt = { class: "ls-card-head" }, Rt = { class: "ls-note" }, Ot = { class: "ls-label" }, It = { class: "ls-models" }, zt = ["onClick"], Lt = {
  key: 0,
  class: "ls-empty"
}, Dt = { class: "ls-label" }, Ft = { class: "ls-models" }, Bt = ["onClick"], Kt = {
  key: 0,
  class: "ls-empty"
}, Ht = { class: "ls-card" }, jt = { class: "ls-card-head" }, Yt = { class: "ls-note" }, Jt = { class: "ls-switch" }, Wt = { class: "ls-switch-text" }, qt = { class: "ls-switch" }, Gt = { class: "ls-switch-text" }, Xt = { class: "ls-card" }, Zt = { class: "ls-switch" }, Qt = { class: "ls-switch-text" }, es = { class: "ls-card ls-card-wide" }, ts = { class: "ls-card-head" }, ss = { class: "ls-row" }, ls = { class: "ls-switch" }, os = { class: "ls-switch-text" }, ns = { class: "ls-switch" }, as = { class: "ls-switch-text" }, is = { class: "ls-row" }, rs = { class: "ls-field" }, us = { class: "ls-field" }, ds = { class: "ls-row" }, cs = { class: "ls-field" }, ps = { class: "ls-field" }, hs = ["placeholder"], vs = { class: "ls-row" }, ms = { class: "ls-field" }, _s = { class: "ls-field" }, gs = { class: "ls-card ls-card-wide" }, bs = { class: "ls-card-head" }, fs = { class: "ls-row" }, ys = { class: "ls-switch" }, ks = { class: "ls-switch-text" }, ws = { class: "ls-row" }, $s = { class: "ls-field" }, Cs = ["placeholder"], Ss = { class: "ls-field" }, Ps = ["title"], xs = { class: "ls-hint" }, Ms = {
  key: 0,
  class: "ls-state"
}, Us = /* @__PURE__ */ ee({
  __name: "LifeSettingsPanel",
  setup(L) {
    const { t: s } = te(), _ = nt({
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
      output_model: "",
      // 「喊一声唤醒」: the nickname is the wake word. It lives here so the persona's
      // name has one home; the chat page reads it and does the actual listening.
      wake_enabled: !1,
      wake_nickname: "",
      asr_language: "zh"
    }), b = P(""), $ = P(!1), k = P(!1), v = P([]), C = P(""), E = P([]);
    async function c() {
      try {
        const [o, i] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (o.ok && (Object.assign(_, (await o.json()).values || {}), k.value = !0), i.ok) {
          const d = await i.json();
          E.value = Array.isArray(d.models) ? d.models.map((g) => ({ id: g.id, provider: g.provider || "custom", supports_thinking: g.supports_thinking })).filter((g) => g.id) : [], v.value = E.value.map((g) => g.id), C.value = s("lifeSettings.sourceFromCore");
        }
      } catch {
        b.value = s("lifeSettings.loadFailed");
      }
    }
    async function u() {
      if (!k.value) {
        b.value = s("lifeSettings.notLoaded");
        return;
      }
      $.value = !0, b.value = "";
      try {
        const o = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: _ }) });
        if (!o.ok) throw new Error(String(o.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: _.screen_watch, computer_use: _.computer_use, report_agent_host: _.report_agent_host }) }), b.value = s("lifeSettings.savedNotice");
      } catch {
        b.value = s("lifeSettings.saveFailed");
      } finally {
        $.value = !1;
      }
    }
    return ae(c), (o, i) => (a(), r("section", ft, [
      e("header", yt, [
        e("div", kt, [
          i[17] || (i[17] = e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS", -1)),
          e("h2", null, l(t(s)("lifeSettings.title")), 1),
          e("p", wt, l(t(s)("lifeSettings.subtitle")), 1)
        ]),
        e("button", {
          class: "ls-save",
          disabled: $.value,
          onClick: u
        }, [
          i[18] || (i[18] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          oe(l($.value ? t(s)("common.saving") : t(s)("common.save")), 1)
        ], 8, $t)
      ]),
      e("div", Ct, [
        e("article", St, [
          e("div", Pt, [
            i[19] || (i[19] = e("span", { class: "ls-ic tone-1" }, "◉", -1)),
            e("h3", null, l(t(s)("lifeSettings.hostPerms")), 1)
          ]),
          e("label", xt, [
            N(e("input", {
              "onUpdate:modelValue": i[0] || (i[0] = (d) => _.screen_watch = d),
              type: "checkbox"
            }, null, 512), [
              [Q, _.screen_watch]
            ]),
            i[20] || (i[20] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Mt, [
              e("b", null, l(t(s)("lifeSettings.screenWatch")), 1),
              e("small", null, l(t(s)("lifeSettings.screenWatchDesc")), 1)
            ])
          ]),
          e("label", Ut, [
            N(e("input", {
              "onUpdate:modelValue": i[1] || (i[1] = (d) => _.computer_use = d),
              type: "checkbox"
            }, null, 512), [
              [Q, _.computer_use]
            ]),
            i[21] || (i[21] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Et, [
              e("b", null, l(t(s)("lifeSettings.computerUse")), 1),
              e("small", null, l(t(s)("lifeSettings.computerUseDesc")), 1)
            ])
          ]),
          e("label", Tt, [
            e("span", null, l(t(s)("lifeSettings.agentHost")), 1),
            N(e("input", {
              "onUpdate:modelValue": i[2] || (i[2] = (d) => _.report_agent_host = d),
              placeholder: t(s)("lifeSettings.agentHostPlaceholder")
            }, null, 8, At), [
              [D, _.report_agent_host]
            ])
          ])
        ]),
        e("article", Nt, [
          e("div", Vt, [
            i[22] || (i[22] = e("span", { class: "ls-ic tone-2" }, "✦", -1)),
            e("h3", null, l(t(s)("lifeSettings.thinkOutput")), 1)
          ]),
          e("p", Rt, l(C.value || t(s)("lifeSettings.loadingModels")), 1),
          e("p", Ot, l(t(s)("lifeSettings.thinkLabel")), 1),
          e("div", It, [
            (a(!0), r(F, null, J(E.value, (d) => (a(), r("button", {
              key: "think-" + d.id,
              type: "button",
              class: j(["ls-model", { selected: _.think_model === d.id }]),
              onClick: (g) => _.think_model = d.id
            }, [
              e("b", null, l(d.id), 1),
              e("span", null, l(d.provider) + " · " + l(d.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, zt))), 128)),
            E.value.length ? M("", !0) : (a(), r("span", Lt, l(t(s)("lifeSettings.noModels")), 1))
          ]),
          e("p", Dt, l(t(s)("lifeSettings.outputLabel")), 1),
          e("div", Ft, [
            (a(!0), r(F, null, J(E.value, (d) => (a(), r("button", {
              key: "output-" + d.id,
              type: "button",
              class: j(["ls-model", { selected: _.output_model === d.id }]),
              onClick: (g) => _.output_model = d.id
            }, [
              e("b", null, l(d.id), 1),
              e("span", null, l(d.provider) + " · output", 1)
            ], 10, Bt))), 128)),
            E.value.length ? M("", !0) : (a(), r("span", Kt, l(t(s)("lifeSettings.noModels")), 1))
          ])
        ]),
        e("article", Ht, [
          e("div", jt, [
            i[23] || (i[23] = e("span", { class: "ls-ic tone-3" }, "✉", -1)),
            e("h3", null, l(t(s)("lifeSettings.mail")), 1)
          ]),
          e("p", Yt, l(t(s)("lifeSettings.mailNote", { mcp: "0kay-mcp", mail: "mail" })), 1),
          e("label", Jt, [
            N(e("input", {
              "onUpdate:modelValue": i[3] || (i[3] = (d) => _.mail_auto_approve_all = d),
              type: "checkbox"
            }, null, 512), [
              [Q, _.mail_auto_approve_all]
            ]),
            i[24] || (i[24] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Wt, [
              e("b", null, l(t(s)("lifeSettings.mailAutoApprove")), 1),
              e("small", null, l(t(s)("lifeSettings.mailAutoApproveDesc")), 1)
            ])
          ]),
          e("label", qt, [
            N(e("input", {
              "onUpdate:modelValue": i[4] || (i[4] = (d) => _.mail_require_approval = d),
              type: "checkbox"
            }, null, 512), [
              [Q, _.mail_require_approval]
            ]),
            i[25] || (i[25] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Gt, [
              e("b", null, l(t(s)("lifeSettings.mailRequireApproval")), 1),
              e("small", null, l(t(s)("lifeSettings.mailRequireApprovalDesc")), 1)
            ])
          ])
        ]),
        e("article", Xt, [
          i[27] || (i[27] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", Zt, [
            N(e("input", {
              "onUpdate:modelValue": i[5] || (i[5] = (d) => _.mcp_enabled = d),
              type: "checkbox"
            }, null, 512), [
              [Q, _.mcp_enabled]
            ]),
            i[26] || (i[26] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Qt, [
              e("b", null, l(t(s)("lifeSettings.mcpEnabled")), 1),
              e("small", null, l(t(s)("lifeSettings.mcpEnabledDesc")), 1)
            ])
          ])
        ]),
        e("article", es, [
          e("div", ts, [
            i[28] || (i[28] = e("span", { class: "ls-ic tone-5" }, "☷", -1)),
            e("h3", null, l(t(s)("lifeSettings.onebot")), 1)
          ]),
          e("div", ss, [
            e("label", ls, [
              N(e("input", {
                "onUpdate:modelValue": i[6] || (i[6] = (d) => _.onebot_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [Q, _.onebot_enabled]
              ]),
              i[29] || (i[29] = e("span", { class: "ls-track" }, null, -1)),
              e("span", os, [
                e("b", null, l(t(s)("lifeSettings.onebotEnable")), 1)
              ])
            ]),
            e("label", ns, [
              N(e("input", {
                "onUpdate:modelValue": i[7] || (i[7] = (d) => _.onebot_observe_group = d),
                type: "checkbox"
              }, null, 512), [
                [Q, _.onebot_observe_group]
              ]),
              i[30] || (i[30] = e("span", { class: "ls-track" }, null, -1)),
              e("span", as, [
                e("b", null, l(t(s)("lifeSettings.onebotObserve")), 1),
                e("small", null, l(t(s)("lifeSettings.onebotObserveDesc")), 1)
              ])
            ])
          ]),
          e("div", is, [
            e("label", rs, [
              e("span", null, l(t(s)("lifeSettings.onebotWs")), 1),
              N(e("input", {
                "onUpdate:modelValue": i[8] || (i[8] = (d) => _.onebot_ws_url = d),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [D, _.onebot_ws_url]
              ])
            ]),
            e("label", us, [
              e("span", null, l(t(s)("lifeSettings.onebotHttp")), 1),
              N(e("input", {
                "onUpdate:modelValue": i[9] || (i[9] = (d) => _.onebot_http_url = d),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [D, _.onebot_http_url]
              ])
            ])
          ]),
          e("div", ds, [
            e("label", cs, [
              i[31] || (i[31] = e("span", null, "Access Token", -1)),
              N(e("input", {
                "onUpdate:modelValue": i[10] || (i[10] = (d) => _.onebot_access_token = d),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [D, _.onebot_access_token]
              ])
            ]),
            e("label", ps, [
              e("span", null, l(t(s)("lifeSettings.onebotKeywords")), 1),
              N(e("input", {
                "onUpdate:modelValue": i[11] || (i[11] = (d) => _.onebot_trigger_keywords = d),
                placeholder: t(s)("lifeSettings.onebotKeywordsPlaceholder")
              }, null, 8, hs), [
                [D, _.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", vs, [
            e("label", ms, [
              e("span", null, l(t(s)("lifeSettings.proactiveDaily")), 1),
              N(e("input", {
                "onUpdate:modelValue": i[12] || (i[12] = (d) => _.proactive_daily_limit = d),
                type: "number",
                min: "0",
                placeholder: "3"
              }, null, 512), [
                [
                  D,
                  _.proactive_daily_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", _s, [
              e("span", null, l(t(s)("lifeSettings.proactiveTarget")), 1),
              N(e("input", {
                "onUpdate:modelValue": i[13] || (i[13] = (d) => _.proactive_target_limit = d),
                type: "number",
                min: "0",
                placeholder: "1"
              }, null, 512), [
                [
                  D,
                  _.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ]),
        e("article", gs, [
          e("div", bs, [
            i[32] || (i[32] = e("span", { class: "ls-ic tone-2" }, "🎙", -1)),
            e("h3", null, l(t(s)("lifeSettings.wake")), 1)
          ]),
          e("div", fs, [
            e("label", ys, [
              N(e("input", {
                "onUpdate:modelValue": i[14] || (i[14] = (d) => _.wake_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [Q, _.wake_enabled]
              ]),
              i[33] || (i[33] = e("span", { class: "ls-track" }, null, -1)),
              e("span", ks, [
                e("b", null, l(t(s)("lifeSettings.wakeEnable")), 1),
                e("small", null, l(t(s)("lifeSettings.wakeEnableDesc")), 1)
              ])
            ])
          ]),
          e("div", ws, [
            e("label", $s, [
              e("span", null, l(t(s)("lifeSettings.wakeNickname")), 1),
              N(e("input", {
                "onUpdate:modelValue": i[15] || (i[15] = (d) => _.wake_nickname = d),
                placeholder: t(s)("lifeSettings.wakeNicknamePlaceholder")
              }, null, 8, Cs), [
                [D, _.wake_nickname]
              ])
            ]),
            e("label", Ss, [
              e("span", null, l(t(s)("lifeSettings.asrLanguage")), 1),
              N(e("input", {
                "onUpdate:modelValue": i[16] || (i[16] = (d) => _.asr_language = d),
                placeholder: "zh",
                title: t(s)("lifeSettings.asrLanguageDesc")
              }, null, 8, Ps), [
                [D, _.asr_language]
              ])
            ])
          ]),
          e("p", xs, l(t(s)("lifeSettings.wakeHint")), 1)
        ])
      ]),
      b.value ? (a(), r("p", Ms, l(b.value), 1)) : M("", !0)
    ]));
  }
}), Es = /* @__PURE__ */ ie(Us, [["__scopeId", "data-v-f79f46a2"]]), Ts = "/okay-logo.svg", As = { class: "content-card about" }, Ns = { class: "identity" }, Vs = { class: "app-id" }, Rs = { class: "ver-badge" }, Os = { class: "app-desc" }, Is = { class: "identity-actions" }, zs = ["href"], Ls = { class: "section" }, Ds = { class: "section-head" }, Fs = ["disabled"], Bs = {
  key: 0,
  class: "alert",
  role: "alert"
}, Ks = {
  class: "us-hero-icon",
  "aria-hidden": "true"
}, Hs = {
  key: 0,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, js = {
  key: 1,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ys = {
  key: 2,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Js = { class: "us-hero-text" }, Ws = { key: 0 }, qs = { key: 1 }, Gs = { class: "us-hero-actions" }, Xs = ["disabled"], Zs = ["disabled", "title"], Qs = ["href"], el = {
  key: 2,
  class: "us-notes"
}, tl = { class: "us-notes-title" }, sl = { class: "us-notes-body" }, ll = {
  key: 3,
  class: "alert",
  role: "alert"
}, ol = { class: "us-apply-head" }, nl = { key: 0 }, al = { key: 1 }, il = {
  key: 0,
  class: "us-chip-tag"
}, rl = { class: "us-apply-label" }, ul = {
  key: 0,
  class: "us-apply-error"
}, dl = {
  key: 1,
  class: "us-apply-log"
}, cl = { class: "section" }, pl = { class: "section-title" }, hl = { class: "credits" }, vl = ["href"], ml = ["src", "alt"], _l = { class: "person-info" }, gl = { class: "name" }, bl = { class: "role" }, fl = ["src"], yl = { class: "person-info" }, kl = { class: "role" }, wl = { class: "section-head contributors-head" }, $l = { class: "section-title" }, Cl = { class: "muted" }, Sl = {
  key: 0,
  class: "contribs"
}, Pl = ["href"], xl = ["src", "alt"], Ml = { class: "login" }, Ul = {
  key: 0,
  class: "count"
}, El = {
  key: 1,
  class: "muted"
}, Tl = ["href"], Al = { class: "foot" }, Nl = ["href"], Re = "https://github.com/RazureSOFT/0KAY", Vl = "https://github.com/RazureSOFT", Rl = /* @__PURE__ */ ee({
  __name: "AboutPanel",
  setup(L) {
    const { t: s } = te(), _ = P("0.1.3"), b = P([]), $ = P(""), k = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, v = (U, x = 96) => `https://github.com/${U}.png?size=${x}`, C = P(!1), E = P(null), c = P(""), u = P(null), o = P("");
    let i = null;
    function d(U) {
      return u.value?.status === "running" && u.value.plugin === U;
    }
    async function g(U, x) {
      if (u.value?.status !== "running") {
        o.value = "";
        try {
          u.value = await Me("/api/plugins/pm/update", { plugin: U, version: x || "" }), h();
        } catch (B) {
          o.value = B instanceof Error ? B.message : String(B);
        }
      }
    }
    async function y() {
      try {
        u.value = await he("/api/plugins/pm/status");
      } catch {
        return;
      }
      u.value && u.value.status !== "running" && (w(), V());
    }
    function h() {
      i || (i = setInterval(y, 2e3));
    }
    function w() {
      i && (clearInterval(i), i = null);
    }
    const S = Y(() => {
      switch (u.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), I = Y(() => E.value ? E.value.has_update ? "warn" : E.value.latest ? "ok" : "none" : "none");
    async function V() {
      C.value = !0, c.value = "";
      try {
        const U = await he("/api/plugins/pm/check");
        E.value = U, U?.current && (_.value = String(U.current));
      } catch (U) {
        c.value = U instanceof Qe && U.status === 404 ? s("settings.about.unsupported") : U instanceof Error ? U.message : String(U);
      } finally {
        C.value = !1;
      }
    }
    async function z() {
      try {
        const U = { Accept: "application/vnd.github+json" }, [x, B] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: U }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: U })
        ]);
        if (!x.ok) throw new Error(`HTTP ${x.status}`);
        const q = /* @__PURE__ */ new Map(), G = await x.json();
        for (const O of Array.isArray(G) ? G : [])
          O?.login && q.set(O.login, O);
        if (B.ok) {
          const O = await B.json();
          for (const A of Array.isArray(O) ? O : []) {
            const R = A?.author;
            !R?.login || R.login.endsWith("[bot]") || q.has(R.login) || q.set(R.login, {
              login: R.login,
              avatar_url: R.avatar_url,
              html_url: R.html_url,
              contributions: 0
            });
          }
        }
        b.value = [...q.values()].sort(
          (O, A) => (A.contributions || 0) - (O.contributions || 0) || O.login.localeCompare(A.login)
        );
      } catch (U) {
        $.value = U instanceof Error ? U.message : String(U), b.value = [];
      }
    }
    return ae(() => {
      V(), z(), he("/api/plugins/pm/status").then((U) => {
        u.value = U, U?.status === "running" && h();
      }).catch(() => {
      });
    }), ze(w), (U, x) => (a(), r("div", As, [
      e("header", Ns, [
        x[3] || (x[3] = e("img", {
          class: "app-icon",
          src: Ts,
          alt: "",
          "aria-hidden": "true"
        }, null, -1)),
        e("div", Vs, [
          e("h2", null, [
            x[2] || (x[2] = oe("0KAY ", -1)),
            e("span", Rs, "v" + l(_.value), 1)
          ]),
          e("p", Os, l(t(s)("settings.about.description")), 1)
        ]),
        e("div", Is, [
          e("a", {
            class: "btn btn-tonal sm",
            href: Re,
            target: "_blank",
            rel: "noopener noreferrer"
          }, l(t(s)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${Re}/releases`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "Releases ↗", 8, zs)
        ])
      ]),
      e("section", Ls, [
        e("div", Ds, [
          x[4] || (x[4] = e("h3", { class: "section-title" }, "0KAY", -1)),
          e("button", {
            class: "btn btn-tonal sm",
            disabled: C.value,
            onClick: V
          }, l(t(s)(C.value ? "settings.about.checking" : "settings.about.check")), 9, Fs)
        ]),
        c.value ? (a(), r("p", Bs, l(c.value), 1)) : (a(), r("div", {
          key: 1,
          class: j(["us-hero", I.value])
        }, [
          e("div", Ks, [
            I.value === "ok" ? (a(), r("svg", Hs, [...x[5] || (x[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : I.value === "warn" ? (a(), r("svg", js, [...x[6] || (x[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (a(), r("svg", Ys, [...x[7] || (x[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", Js, [
            e("b", null, l(t(s)(I.value === "warn" ? "settings.about.available" : I.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            E.value?.latest ? (a(), r("span", Ws, [
              oe("v" + l(E.value.current) + " → ", 1),
              e("em", null, "v" + l(E.value.latest), 1)
            ])) : (a(), r("span", qs, "0KAY v" + l(E.value?.current || _.value), 1))
          ]),
          e("div", Gs, [
            E.value?.has_update ? (a(), r("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: d("core"),
              onClick: x[0] || (x[0] = (B) => g("core", E.value.latest))
            }, l(d("core") ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, Xs)) : M("", !0),
            E.value?.source_available !== !1 ? (a(), r("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: d("core"),
              title: t(s)("settings.about.betaHint"),
              onClick: x[1] || (x[1] = (B) => g("core"))
            }, l(d("core") ? t(s)("settings.about.updating") : t(s)("settings.about.beta")), 9, Zs)) : M("", !0),
            E.value?.url ? (a(), r("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: E.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, Qs)) : M("", !0)
          ])
        ], 2)),
        E.value?.notes ? (a(), r("div", el, [
          e("p", tl, l(t(s)("settings.about.whatsNew")), 1),
          e("pre", sl, l(E.value.notes), 1)
        ])) : M("", !0),
        o.value ? (a(), r("p", ll, l(o.value), 1)) : M("", !0),
        u.value && u.value.status !== "idle" ? (a(), r("div", {
          key: 4,
          class: j(["us-apply-banner", u.value.status])
        }, [
          e("div", ol, [
            x[8] || (x[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              oe(l(u.value.package), 1),
              u.value.version ? (a(), r("span", nl, "@" + l(u.value.version), 1)) : (a(), r("span", al, " · main"))
            ]),
            u.value.mode === "source" ? (a(), r("span", il, l(t(s)("settings.about.sourceMode")), 1)) : M("", !0),
            e("span", rl, l(S.value), 1)
          ]),
          u.value.error ? (a(), r("p", ul, l(u.value.error), 1)) : M("", !0),
          u.value.log ? (a(), r("pre", dl, l(u.value.log), 1)) : M("", !0)
        ], 2)) : M("", !0)
      ]),
      e("section", cl, [
        e("h3", pl, l(t(s)("settings.about.developerTitle")) + " & " + l(t(s)("settings.about.teamTitle")), 1),
        e("div", hl, [
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
            }, null, 8, ml),
            e("div", _l, [
              e("span", gl, l(k.login), 1),
              e("span", bl, l(t(s)("settings.about.developerTitle")), 1)
            ]),
            x[9] || (x[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, vl),
          e("a", {
            class: "person",
            href: Vl,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: v("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, fl),
            e("div", yl, [
              x[10] || (x[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", kl, l(t(s)("settings.about.teamTitle")), 1)
            ]),
            x[11] || (x[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", wl, [
          e("h3", $l, l(t(s)("settings.about.contributorsTitle")), 1),
          e("span", Cl, l(t(s)("settings.about.contributorsFrom")), 1)
        ]),
        b.value.length ? (a(), r("div", Sl, [
          (a(!0), r(F, null, J(b.value, (B) => (a(), r("a", {
            key: B.login,
            class: "contrib",
            href: B.html_url || `https://github.com/${B.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: B.avatar_url || v(B.login, 64),
              alt: B.login,
              loading: "lazy"
            }, null, 8, xl),
            e("span", Ml, l(B.login), 1),
            B.contributions ? (a(), r("span", Ul, l(B.contributions), 1)) : M("", !0)
          ], 8, Pl))), 128))
        ])) : (a(), r("p", El, [
          e("a", {
            class: "repo-link",
            href: k.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "razureink ↗", 8, Tl)
        ]))
      ]),
      e("footer", Al, [
        x[12] || (x[12] = e("span", { class: "status-chip" }, "MIT", -1)),
        x[13] || (x[13] = e("span", null, "© 2026 RazureSOFT", -1)),
        e("a", {
          class: "repo-link",
          href: `${Re}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, Nl)
      ])
    ]));
  }
}), Ol = /* @__PURE__ */ ie(Rl, [["__scopeId", "data-v-da8c447d"]]), Il = { class: "content-card updates" }, zl = { class: "us-block" }, Ll = { class: "us-head" }, Dl = { class: "us-head-text" }, Fl = { class: "us-title" }, Bl = { class: "us-desc" }, Kl = { class: "us-source" }, Hl = { class: "us-input-group" }, jl = ["disabled", "placeholder"], Yl = ["disabled"], Jl = { class: "us-chips" }, Wl = ["disabled"], ql = ["disabled"], Gl = {
  key: 0,
  class: "us-saved"
}, Xl = { class: "helper-text" }, Zl = {
  key: 0,
  class: "alert"
}, Ql = { class: "us-block" }, eo = { class: "us-head" }, to = { class: "us-head-text" }, so = { class: "us-title" }, lo = { class: "us-desc" }, oo = { class: "us-head-actions" }, no = ["disabled"], ao = {
  key: 0,
  class: "alert",
  role: "alert"
}, io = { class: "us-apply-head" }, ro = { key: 0 }, uo = { key: 1 }, co = {
  key: 0,
  class: "us-chip-tag"
}, po = { class: "us-apply-label" }, ho = {
  key: 0,
  class: "us-apply-error"
}, vo = {
  key: 1,
  class: "us-apply-log"
}, mo = {
  key: 2,
  class: "alert",
  role: "alert"
}, _o = {
  key: 3,
  class: "us-table"
}, go = { class: "us-row us-thead" }, bo = { class: "us-name" }, fo = { class: "us-name-text" }, yo = { class: "us-ver" }, ko = { class: "us-status-text" }, wo = { class: "us-actions" }, $o = ["disabled", "onClick"], Co = ["disabled", "onClick"], So = ["href", "title"], Po = {
  key: 0,
  class: "us-empty"
}, xo = /* @__PURE__ */ ee({
  __name: "UpdatesPanel",
  setup(L) {
    const { t: s } = te(), _ = P(!1), b = P(null), $ = P(""), k = P(null), v = P("");
    let C = null;
    const E = P(""), c = P(""), u = P(!1), o = P(!1), i = P(!1), d = P(""), g = Y(() => E.value.trim() !== c.value), y = Y(() => E.value.trim() !== "");
    function h(O) {
      return k.value?.status === "running" && k.value.plugin === O;
    }
    async function w(O, A) {
      if (k.value?.status !== "running") {
        v.value = "";
        try {
          k.value = await Me("/api/plugins/pm/update", { plugin: O, version: A || "" }), I();
        } catch (R) {
          v.value = R instanceof Error ? R.message : String(R);
        }
      }
    }
    async function S() {
      try {
        k.value = await he("/api/plugins/pm/status");
      } catch {
        return;
      }
      k.value && k.value.status !== "running" && (V(), x());
    }
    function I() {
      C || (C = setInterval(S, 2e3));
    }
    function V() {
      C && (clearInterval(C), C = null);
    }
    const z = Y(() => {
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
    }), U = Y(() => (b.value || []).filter((O) => O.has_update).length);
    async function x() {
      _.value = !0, $.value = "";
      try {
        const O = await he("/api/plugins/pm/check-plugins");
        b.value = O?.plugins || [];
      } catch (O) {
        $.value = O instanceof Qe && O.status === 404 ? s("settings.about.unsupported") : O instanceof Error ? O.message : String(O);
      } finally {
        _.value = !1;
      }
    }
    async function B() {
      u.value = !0, d.value = "";
      try {
        const O = await he("/api/settings/updates"), A = String(O?.values?.github_proxy ?? "");
        E.value = A, c.value = A;
      } catch {
      } finally {
        u.value = !1;
      }
    }
    async function q() {
      o.value = !0, d.value = "";
      try {
        const O = E.value.trim();
        await Me("/api/settings/updates", { values: { github_proxy: O } }), c.value = O, i.value = !0, setTimeout(() => {
          i.value = !1;
        }, 1500);
      } catch (O) {
        d.value = O instanceof Error ? O.message : String(O);
      } finally {
        o.value = !1;
      }
    }
    function G(O) {
      E.value = O, q();
    }
    return ae(() => {
      x(), B(), he("/api/plugins/pm/status").then((O) => {
        k.value = O, O?.status === "running" && I();
      }).catch(() => {
      });
    }), ze(V), (O, A) => (a(), r("div", Il, [
      e("section", zl, [
        e("header", Ll, [
          A[3] || (A[3] = e("span", {
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
          e("div", Dl, [
            e("h3", Fl, l(t(s)("settings.pluginSourceTitle")), 1),
            e("p", Bl, l(t(s)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: j(["us-tag", { on: y.value }])
          }, l(y.value ? "ghproxy" : t(s)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", Kl, [
          e("div", Hl, [
            A[4] || (A[4] = e("span", {
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
            N(e("input", {
              "onUpdate:modelValue": A[0] || (A[0] = (R) => E.value = R),
              class: "us-input",
              type: "text",
              disabled: u.value,
              placeholder: t(s)("settings.pluginSourcePlaceholder"),
              onKeyup: Ge(q, ["enter"])
            }, null, 40, jl), [
              [D, E.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: o.value || !g.value,
              onClick: q
            }, l(t(s)("settings.save")), 9, Yl)
          ]),
          e("div", Jl, [
            e("button", {
              type: "button",
              class: j(["us-chip", { active: !y.value }]),
              disabled: o.value,
              onClick: A[1] || (A[1] = (R) => G(""))
            }, l(t(s)("settings.pluginSourceDirect")), 11, Wl),
            e("button", {
              type: "button",
              class: j(["us-chip", { active: E.value.trim() === "https://gh-proxy.com" }]),
              disabled: o.value,
              onClick: A[2] || (A[2] = (R) => G("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, ql),
            i.value ? (a(), r("span", Gl, l(t(s)("settings.saved")), 1)) : M("", !0)
          ]),
          e("p", Xl, l(t(s)("settings.pluginSourceHelp")), 1),
          d.value ? (a(), r("p", Zl, l(d.value), 1)) : M("", !0)
        ])
      ]),
      A[10] || (A[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", Ql, [
        e("header", eo, [
          A[5] || (A[5] = at('<span class="us-ico" aria-hidden="true" data-v-95a0aad4><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-95a0aad4><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect></svg></span>', 1)),
          e("div", to, [
            e("h3", so, l(t(s)("settings.about.plugins")), 1),
            e("p", lo, l(t(s)("settings.about.updateHint")), 1)
          ]),
          e("div", oo, [
            e("span", {
              class: j(["us-count", { warn: U.value > 0 }])
            }, l(U.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: _.value,
              onClick: x
            }, l(t(s)(_.value ? "settings.about.checking" : "settings.about.check")), 9, no)
          ])
        ]),
        v.value ? (a(), r("p", ao, l(v.value), 1)) : M("", !0),
        k.value && k.value.status !== "idle" ? (a(), r("div", {
          key: 1,
          class: j(["us-apply-banner", k.value.status])
        }, [
          e("div", io, [
            A[6] || (A[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              oe(l(k.value.package), 1),
              k.value.version ? (a(), r("span", ro, "@" + l(k.value.version), 1)) : (a(), r("span", uo, " · main"))
            ]),
            k.value.mode === "source" ? (a(), r("span", co, l(t(s)("settings.about.sourceMode")), 1)) : M("", !0),
            e("span", po, l(z.value), 1)
          ]),
          k.value.error ? (a(), r("p", ho, l(k.value.error), 1)) : M("", !0),
          k.value.log ? (a(), r("pre", vo, l(k.value.log), 1)) : M("", !0)
        ], 2)) : M("", !0),
        $.value ? (a(), r("p", mo, l($.value), 1)) : M("", !0),
        b.value ? (a(), r("div", _o, [
          e("div", go, [
            e("span", null, l(t(s)("plugins.updatesColPlugin")), 1),
            e("span", null, l(t(s)("plugins.updatesColVersion")), 1),
            e("span", null, l(t(s)("plugins.updatesColStatus")), 1),
            A[7] || (A[7] = e("span", null, null, -1))
          ]),
          (a(!0), r(F, null, J(b.value, (R) => (a(), r("div", {
            key: R.name,
            class: "us-row"
          }, [
            e("span", bo, [
              e("span", {
                class: j(["us-dot", R.error ? "bad" : R.has_update ? "warn" : R.latest ? "ok" : ""])
              }, null, 2),
              e("span", fo, l(R.name), 1)
            ]),
            e("span", yo, [
              e("em", null, "v" + l(R.version || "—"), 1),
              A[8] || (A[8] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: j({ good: !!R.latest })
              }, l(R.latest ? `v${R.latest}` : "—"), 3)
            ]),
            e("span", {
              class: j(["us-status", R.error ? "bad" : R.has_update ? "warn" : R.latest ? "ok" : ""])
            }, [
              e("span", ko, l(R.error || t(s)(R.has_update ? "settings.about.available" : R.latest ? "settings.about.latest" : "settings.about.noRelease")), 1)
            ], 2),
            e("span", wo, [
              R.can_update && R.has_update ? (a(), r("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: h(R.name),
                onClick: (fe) => w(R.name, R.latest)
              }, l(h(R.name) ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, $o)) : R.can_update ? (a(), r("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: h(R.name),
                onClick: (fe) => w(R.name)
              }, l(h(R.name) ? t(s)("settings.about.updating") : t(s)("settings.about.syncNow")), 9, Co)) : M("", !0),
              R.repository ? (a(), r("a", {
                key: 2,
                class: "us-repo",
                href: R.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: R.repository
              }, l(t(s)("plugins.updatesColRepo")) + " ↗", 9, So)) : M("", !0)
            ])
          ]))), 128)),
          b.value.length ? M("", !0) : (a(), r("p", Po, l(t(s)("settings.about.noPlugins")), 1))
        ])) : M("", !0),
        A[9] || (A[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), Mo = /* @__PURE__ */ ie(xo, [["__scopeId", "data-v-95a0aad4"]]), Uo = { class: "content-card provider-panel" }, Eo = { class: "pp-editor-head" }, To = ["aria-label"], Ao = { class: "pp-editor-title" }, No = { class: "card-desc" }, Vo = { class: "pp-section" }, Ro = { class: "pp-section-title" }, Oo = { class: "pp-grid" }, Io = { class: "field" }, zo = { class: "field" }, Lo = {
  key: 0,
  class: "pp-req"
}, Do = ["placeholder"], Fo = { class: "field pp-span" }, Bo = ["placeholder"], Ko = { class: "field" }, Ho = { class: "helper-text" }, jo = { class: "field" }, Yo = { class: "helper-text" }, Jo = { class: "pp-section" }, Wo = { class: "pp-section-head" }, qo = { class: "pp-section-title" }, Go = ["disabled"], Xo = { class: "field" }, Zo = { class: "pp-key" }, Qo = ["type", "placeholder"], en = {
  key: 0,
  class: "helper-text"
}, tn = {
  key: 1,
  class: "pp-probe err"
}, sn = {
  key: 2,
  class: "pp-probe ok"
}, ln = { class: "pp-section" }, on = { class: "pp-section-head" }, nn = { class: "pp-section-title" }, an = { class: "pp-count" }, rn = ["disabled"], un = {
  key: 0,
  class: "pp-discovered"
}, dn = { class: "pp-model-tools" }, cn = ["placeholder"], pn = { class: "pp-add-model" }, hn = ["placeholder", "aria-label", "onKeydown"], vn = ["disabled"], mn = {
  key: 1,
  class: "helper-text pp-add-error"
}, _n = {
  key: 2,
  class: "pp-models"
}, gn = ["title"], bn = ["value", "title", "onChange"], fn = ["value"], yn = ["title", "disabled", "onClick"], kn = ["title"], wn = ["checked", "onChange"], $n = ["title", "aria-label", "onClick"], Cn = {
  key: 0,
  class: "helper-text"
}, Sn = {
  key: 3,
  class: "helper-text"
}, Pn = {
  key: 0,
  class: "pp-error",
  role: "alert"
}, xn = { class: "pp-editor-actions" }, Mn = ["disabled"], Un = { class: "pp-list-head" }, En = { class: "card-desc" }, Tn = { class: "pp-list-actions" }, An = {
  key: 0,
  class: "pp-cards"
}, Nn = { class: "pp-card-head" }, Vn = { class: "pp-logo" }, Rn = ["src", "alt"], On = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, In = { class: "pp-card-id" }, zn = ["title"], Ln = { class: "pp-card-badges" }, Dn = {
  key: 0,
  class: "pp-badge primary"
}, Fn = { class: "pp-badge" }, Bn = { class: "pp-card-status" }, Kn = {
  key: 0,
  class: "pp-meta"
}, Hn = ["title"], jn = { class: "pp-chips" }, Yn = {
  key: 0,
  class: "pp-chip more"
}, Jn = {
  key: 1,
  class: "pp-chip empty"
}, Wn = { class: "pp-card-actions" }, qn = ["onClick"], Gn = ["disabled", "onClick"], Xn = ["disabled", "onClick"], Zn = ["onClick"], Qn = ["onClick"], ea = {
  key: 1,
  class: "pp-empty"
}, ta = /* @__PURE__ */ ee({
  __name: "ProviderPanel",
  setup(L) {
    const { t: s } = te(), { confirm: _ } = Ce(), b = pt(), $ = P({}), k = P("list"), v = P(null), C = P(""), E = P({ state: "idle" }), c = P([]), u = P(""), o = P(!1), i = P(!1), d = P(!1);
    ae(async () => {
      await b.fetchAll();
      for (const f of b.providers) B(f);
    });
    function g(f) {
      return Ve.find((m) => m.id === f) || null;
    }
    function y(f) {
      return f.name && f.name.trim() ? f.name.trim() : g(f.provider)?.name || f.provider;
    }
    function h(f) {
      return g(f.provider)?.logo || "";
    }
    const w = Y(() => [
      { value: "chat", label: s("modelType.chat") },
      { value: "embedding", label: s("modelType.embedding") },
      { value: "rerank", label: s("modelType.rerank") },
      { value: "vision", label: s("modelType.vision") },
      { value: "tts", label: s("modelType.tts") },
      { value: "image", label: s("modelType.image") },
      { value: "audio", label: s("modelType.audio") }
    ]);
    function S(f) {
      return (v.value?.model_types || {})[f] || "chat";
    }
    function I(f, m) {
      if (!v.value) return;
      const p = { ...v.value.model_types || {} };
      !m || m === "chat" ? delete p[f] : p[f] = m, v.value.model_types = p;
    }
    function V(f) {
      const m = new Set(f.disabled_models || []);
      return f.models.filter((p) => !m.has(p));
    }
    function z(f) {
      return b.defaultProviderId === f.id;
    }
    function U(f) {
      const m = v.value;
      if (!m) return;
      const p = Ve.find((n) => n.id === f);
      p?.baseUrl && !m.base_url && (m.base_url = p.baseUrl), m.format = p?.format || "";
    }
    async function x(f, m = "") {
      if (!f.base_url) return { state: "error", message: s("settings.baseUrlRequired") };
      const p = performance.now();
      try {
        const n = await fetch("/api/models/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: f.id,
            provider: f.provider,
            base_url: f.base_url,
            format: f.format || "",
            api_key: m || ""
          })
        });
        if (!n.ok) throw new Error(`HTTP ${n.status}`);
        const T = await n.json(), Z = Math.round(performance.now() - p);
        return T.source === "api" && Array.isArray(T.models) && T.models.length ? { state: "ok", count: T.models.length, ms: Z, models: T.models } : { state: "error", message: T.error || s("settings.connectionFailed"), ms: Z };
      } catch (n) {
        return { state: "error", message: n instanceof Error ? n.message : String(n) };
      }
    }
    async function B(f, m = "") {
      $.value = { ...$.value, [f.id]: { state: "checking" } };
      const p = await x(f, m);
      $.value = { ...$.value, [f.id]: p };
    }
    function q() {
      for (const f of b.providers) B(f);
    }
    function G() {
      v.value = {
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
      }, C.value = "", E.value = { state: "idle" }, c.value = [], u.value = "", o.value = !1, i.value = !1, k.value = "edit";
    }
    function O(f) {
      v.value = {
        ...f,
        api_key: "",
        name: f.name || "",
        models: [...f.models],
        disabled_models: [...f.disabled_models || []],
        format: f.format || "",
        model_types: { ...f.model_types || {} }
      }, i.value = !!f.api_key_masked, C.value = "", E.value = { state: "idle" }, c.value = [], u.value = "", o.value = !1, k.value = "edit";
    }
    function A() {
      k.value = "list", v.value = null, C.value = "";
    }
    async function R() {
      const f = v.value;
      if (!f) return;
      C.value = "";
      const m = (f.name || "").trim();
      if (!f.base_url.trim()) {
        C.value = s("settings.baseUrlRequired");
        return;
      }
      if (f.provider === "custom" && !m) {
        C.value = s("settings.providerNameRequired");
        return;
      }
      if (!f.models.length) {
        C.value = s("settings.modelsRequired");
        return;
      }
      f.id || (f.id = `${f.provider}_${Date.now().toString(36)}`), f.name = m, f.disabled_models = (f.disabled_models || []).filter((p) => f.models.includes(p)), (!f.default_model || !f.models.includes(f.default_model) || f.disabled_models.includes(f.default_model)) && (f.default_model = V(f)[0] || f.models[0]), d.value = !0;
      try {
        await b.upsert({ ...f }), b.defaultProviderId || await b.setDefaults(f.id, f.default_model), A(), B(b.providers.find((p) => p.id === f.id) || f);
      } catch (p) {
        C.value = p instanceof Error ? p.message : String(p);
      } finally {
        d.value = !1;
      }
    }
    async function fe(f) {
      if (await _({
        title: s("settings.remove"),
        message: `${s("settings.remove")} ${y(f)}?`,
        confirmLabel: s("settings.remove"),
        danger: !0
      }))
        try {
          await b.remove(f.id);
        } catch {
        }
    }
    async function me(f) {
      try {
        await b.upsert({ ...f, enabled: !f.enabled });
      } catch {
      }
    }
    async function re(f) {
      const m = f.default_model || V(f)[0] || f.models[0] || "";
      try {
        await b.setDefaults(f.id, m);
      } catch {
      }
    }
    async function de() {
      const f = v.value;
      if (!f) return;
      E.value = { state: "checking" };
      const m = await x(f, f.api_key);
      E.value = m, m.state === "ok" && m.models && (c.value = m.models);
    }
    function X() {
      const f = v.value;
      !f || !c.value.length || (f.models = [...c.value], f.disabled_models = (f.disabled_models || []).filter((m) => f.models.includes(m)), f.models.includes(f.default_model) || (f.default_model = ""));
    }
    function ye(f) {
      const m = v.value;
      if (!m) return;
      const p = new Set(m.disabled_models || []);
      p.has(f) ? p.delete(f) : p.add(f), m.disabled_models = [...p], p.has(m.default_model) && (m.default_model = V(m)[0] || "");
    }
    function ke(f) {
      const m = v.value;
      m && (m.default_model = f, m.disabled_models = (m.disabled_models || []).filter((p) => p !== f));
    }
    const ce = P(""), ge = P("");
    function Se() {
      const f = v.value;
      if (!f) return;
      const m = ce.value.trim();
      if (ge.value = "", !!m) {
        if (f.models.includes(m)) {
          ge.value = s("settings.modelExists", { name: m });
          return;
        }
        f.models = [...f.models, m], f.disabled_models = (f.disabled_models || []).filter((p) => p !== m), f.default_model || (f.default_model = m), ce.value = "";
      }
    }
    function Pe(f) {
      const m = v.value;
      if (m) {
        if (m.models = m.models.filter((p) => p !== f), m.disabled_models = (m.disabled_models || []).filter((p) => p !== f), m.model_types) {
          const p = { ...m.model_types };
          delete p[f], m.model_types = p;
        }
        m.default_model === f && (m.default_model = V(m)[0] || m.models[0] || "");
      }
    }
    function we(f) {
      const m = v.value;
      m && (m.disabled_models = f ? [] : [...m.models]);
    }
    function Ee() {
      const f = v.value;
      if (!f) return;
      const m = new Set(f.disabled_models || []);
      f.disabled_models = f.models.filter((p) => !m.has(p));
    }
    const pe = Y(() => {
      const f = v.value?.models || [], m = u.value.trim().toLowerCase();
      return m ? f.filter((p) => p.toLowerCase().includes(m)) : f;
    }), Te = Y(() => v.value ? V(v.value).length : 0);
    function xe() {
      return s("settings.fetchedSummary", { n: c.value.length });
    }
    const Ae = Y(() => [
      { value: "", label: s("settings.formatAuto") },
      { value: "openai", label: s("settings.formatOpenai") },
      { value: "anthropic", label: s("settings.formatAnthropic") }
    ]), Ne = Y(
      () => Ve.map((f) => ({ value: f.id, label: s(`providers.${f.id}.name`, f.name) }))
    );
    return (f, m) => (a(), r("div", Uo, [
      k.value === "edit" && v.value ? (a(), r(F, { key: 0 }, [
        e("div", Eo, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: A,
            "aria-label": t(s)("settings.back")
          }, [...m[12] || (m[12] = [
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
          ])], 8, To),
          e("div", Ao, [
            e("h2", null, l(v.value.id ? t(s)("settings.edit") : t(s)("settings.addProvider")), 1),
            e("p", No, l(t(s)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: j(["pp-status", E.value.state])
          }, [
            m[13] || (m[13] = e("span", { class: "pp-dot" }, null, -1)),
            oe(" " + l(E.value.state === "checking" ? t(s)("settings.testing") : E.value.state === "ok" ? t(s)("settings.connectionOk") : E.value.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", Vo, [
          e("h3", Ro, l(t(s)("settings.providerSectionBasic")), 1),
          e("div", Oo, [
            e("div", Io, [
              e("label", null, l(t(s)("wizard.provider")), 1),
              W(t(ue), {
                modelValue: v.value.provider,
                "onUpdate:modelValue": m[0] || (m[0] = (p) => v.value.provider = p),
                class: "input",
                "aria-label": t(s)("wizard.provider"),
                options: Ne.value,
                onChange: U
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", zo, [
              e("label", null, [
                oe(l(t(s)("settings.providerName")) + " ", 1),
                v.value.provider === "custom" ? (a(), r("span", Lo, "*")) : M("", !0)
              ]),
              N(e("input", {
                "onUpdate:modelValue": m[1] || (m[1] = (p) => v.value.name = p),
                placeholder: t(s)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, Do), [
                [D, v.value.name]
              ])
            ]),
            e("div", Fo, [
              e("label", null, l(t(s)("wizard.baseUrl")), 1),
              N(e("input", {
                "onUpdate:modelValue": m[2] || (m[2] = (p) => v.value.base_url = p),
                placeholder: t(s)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, Bo), [
                [D, v.value.base_url]
              ])
            ]),
            e("div", Ko, [
              e("label", null, l(t(s)("settings.apiFormat")), 1),
              W(t(ue), {
                modelValue: v.value.format,
                "onUpdate:modelValue": m[3] || (m[3] = (p) => v.value.format = p),
                class: "input",
                "aria-label": t(s)("settings.apiFormat"),
                options: Ae.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Ho, l(t(s)("settings.apiFormatHint")), 1)
            ]),
            e("div", jo, [
              e("label", null, l(t(s)("wizard.defaultModel")), 1),
              W(t(ue), {
                modelValue: v.value.default_model,
                "onUpdate:modelValue": m[4] || (m[4] = (p) => v.value.default_model = p),
                class: "input",
                "aria-label": t(s)("wizard.defaultModel"),
                options: V(v.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Yo, l(t(s)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", Jo, [
          e("div", Wo, [
            e("h3", qo, l(t(s)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: E.value.state === "checking",
              onClick: de
            }, l(E.value.state === "checking" ? t(s)("settings.testing") : t(s)("settings.testConnection")), 9, Go)
          ]),
          e("div", Xo, [
            e("label", null, l(t(s)("wizard.apiKey")), 1),
            e("div", Zo, [
              N(e("input", {
                "onUpdate:modelValue": m[5] || (m[5] = (p) => v.value.api_key = p),
                type: o.value ? "text" : "password",
                placeholder: i.value ? t(s)("settings.apiKeyKept") : t(s)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, Qo), [
                [it, v.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: m[6] || (m[6] = (p) => o.value = !o.value)
              }, l(o.value ? t(s)("settings.hideKey") : t(s)("settings.showKey")), 1)
            ]),
            i.value ? (a(), r("p", en, l(t(s)("settings.apiKeyKeptHint")), 1)) : M("", !0),
            E.value.state === "error" ? (a(), r("p", tn, l(E.value.message), 1)) : E.value.state === "ok" ? (a(), r("p", sn, l(t(s)("settings.connectionOk")) + " · " + l(xe()) + " · " + l(E.value.ms) + "ms ", 1)) : M("", !0)
          ])
        ]),
        e("section", ln, [
          e("div", on, [
            e("h3", nn, [
              oe(l(t(s)("settings.providerSectionModels")) + " ", 1),
              e("span", an, l(Te.value) + "/" + l(v.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: E.value.state === "checking",
              onClick: de
            }, l(t(s)("settings.fetchModels")), 9, rn)
          ]),
          c.value.length && c.value.join("\0") !== v.value.models.join("\0") ? (a(), r("div", un, [
            e("span", null, l(xe()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: X
            }, l(t(s)("settings.applyFetched")), 1)
          ])) : M("", !0),
          e("div", dn, [
            N(e("input", {
              "onUpdate:modelValue": m[7] || (m[7] = (p) => u.value = p),
              class: "input pp-search",
              placeholder: t(s)("settings.searchModels")
            }, null, 8, cn), [
              [D, u.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: m[8] || (m[8] = (p) => we(!0))
            }, l(t(s)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: m[9] || (m[9] = (p) => Ee())
            }, l(t(s)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: m[10] || (m[10] = (p) => we(!1))
            }, l(t(s)("settings.clearSelection")), 1)
          ]),
          e("div", pn, [
            N(e("input", {
              "onUpdate:modelValue": m[11] || (m[11] = (p) => ce.value = p),
              class: "input",
              placeholder: t(s)("settings.addModelPlaceholder"),
              "aria-label": t(s)("settings.addModelPlaceholder"),
              onKeydown: Ge(Oe(Se, ["prevent"]), ["enter"])
            }, null, 40, hn), [
              [D, ce.value]
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: !ce.value.trim(),
              onClick: Se
            }, l(t(s)("settings.addModel")), 9, vn)
          ]),
          ge.value ? (a(), r("p", mn, l(ge.value), 1)) : M("", !0),
          v.value.models.length ? (a(), r("div", _n, [
            (a(!0), r(F, null, J(pe.value, (p) => (a(), r("div", {
              key: p,
              class: j(["pp-model", { off: (v.value.disabled_models || []).includes(p) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: p
              }, l(p), 9, gn),
              e("select", {
                class: j(["pp-type", { tagged: S(p) !== "chat" }]),
                value: S(p),
                title: t(s)("settings.providerModelType"),
                onChange: (n) => I(p, n.target.value)
              }, [
                (a(!0), r(F, null, J(w.value, (n) => (a(), r("option", {
                  key: n.value,
                  value: n.value
                }, l(n.label), 9, fn))), 128))
              ], 42, bn),
              v.value.default_model !== p ? (a(), r("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: t(s)("settings.makeDefault"),
                disabled: (v.value.disabled_models || []).includes(p),
                onClick: (n) => ke(p)
              }, "☆", 8, yn)) : (a(), r("span", {
                key: 1,
                class: "pp-star on",
                title: t(s)("wizard.defaultModel")
              }, "★", 8, kn)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(v.value.disabled_models || []).includes(p),
                onChange: (n) => ye(p)
              }, null, 40, wn),
              e("button", {
                class: "pp-remove",
                type: "button",
                title: t(s)("settings.removeModel", { name: p }),
                "aria-label": t(s)("settings.removeModel", { name: p }),
                onClick: (n) => Pe(p)
              }, "×", 8, $n)
            ], 2))), 128)),
            pe.value.length ? M("", !0) : (a(), r("p", Cn, l(t(s)("settings.searchModels")), 1))
          ])) : (a(), r("p", Sn, l(t(s)("settings.noModelsYet")), 1))
        ]),
        C.value ? (a(), r("p", Pn, l(C.value), 1)) : M("", !0),
        e("div", xn, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: d.value,
            onClick: R
          }, l(d.value ? t(s)("settings.saving") : t(s)("settings.save")), 9, Mn),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: A
          }, l(t(s)("settings.cancel")), 1)
        ])
      ], 64)) : (a(), r(F, { key: 1 }, [
        e("div", Un, [
          e("div", null, [
            e("h2", null, l(t(s)("settings.tabs.provider")), 1),
            e("p", En, l(t(s)("settings.providerDesc")), 1)
          ]),
          e("div", Tn, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: q
            }, l(t(s)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: G
            }, "+ " + l(t(s)("settings.addProvider")), 1)
          ])
        ]),
        t(b).providers.length ? (a(), r("div", An, [
          (a(!0), r(F, null, J(t(b).providers, (p) => (a(), r("article", {
            key: p.id,
            class: j(["pp-card", { off: !p.enabled, default: z(p) }])
          }, [
            e("header", Nn, [
              e("span", Vn, [
                h(p) ? (a(), r("img", {
                  key: 0,
                  src: h(p),
                  alt: y(p)
                }, null, 8, Rn)) : (a(), r("svg", On, [...m[14] || (m[14] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", In, [
                e("strong", null, l(y(p)), 1),
                e("code", {
                  title: p.base_url
                }, l(p.base_url || "—"), 9, zn)
              ]),
              e("div", Ln, [
                z(p) ? (a(), r("span", Dn, l(t(s)("settings.default")), 1)) : M("", !0),
                e("span", Fn, l(V(p).length) + "/" + l(p.models.length), 1)
              ])
            ]),
            e("div", Bn, [
              e("span", {
                class: j(["pp-status", $.value[p.id]?.state || "idle"])
              }, [
                m[15] || (m[15] = e("span", { class: "pp-dot" }, null, -1)),
                oe(" " + l($.value[p.id]?.state === "checking" ? t(s)("settings.testing") : $.value[p.id]?.state === "ok" ? t(s)("settings.connectionOk") : $.value[p.id]?.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
              ], 2),
              $.value[p.id]?.state === "ok" ? (a(), r("span", Kn, l(t(s)("settings.fetchedSummary", { n: $.value[p.id]?.count || 0 })) + " · " + l($.value[p.id]?.ms) + "ms", 1)) : $.value[p.id]?.state === "error" ? (a(), r("span", {
                key: 1,
                class: "pp-meta err",
                title: $.value[p.id]?.message
              }, l($.value[p.id]?.message), 9, Hn)) : M("", !0)
            ]),
            e("div", jn, [
              (a(!0), r(F, null, J(V(p).slice(0, 6), (n) => (a(), r("span", {
                key: n,
                class: "pp-chip"
              }, l(n), 1))), 128)),
              V(p).length > 6 ? (a(), r("span", Yn, "+" + l(V(p).length - 6), 1)) : M("", !0),
              p.models.length ? M("", !0) : (a(), r("span", Jn, l(t(s)("settings.noModelsYet")), 1))
            ]),
            e("footer", Wn, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (n) => O(p)
              }, l(t(s)("settings.edit")), 9, qn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: $.value[p.id]?.state === "checking",
                onClick: (n) => B(p)
              }, l(t(s)("settings.testConnection")), 9, Gn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: z(p),
                onClick: (n) => re(p)
              }, l(t(s)("settings.makeDefault")), 9, Xn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (n) => me(p)
              }, l(p.enabled ? t(s)("settings.disableProvider") : t(s)("settings.enableProvider")), 9, Zn),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (n) => fe(p)
              }, l(t(s)("settings.remove")), 9, Qn)
            ])
          ], 2))), 128))
        ])) : (a(), r("div", ea, [
          e("p", null, l(t(s)("settings.noProviders")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: G
          }, "+ " + l(t(s)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), sa = /* @__PURE__ */ ie(ta, [["__scopeId", "data-v-d93aed7e"]]), la = { class: "pairing-panel" }, oa = {
  key: 0,
  class: "pairing-error",
  role: "alert"
}, na = { key: 1 }, aa = { key: 0 }, ia = ["onClick"], ra = ["onClick"], ua = ["disabled", "onClick"], da = /* @__PURE__ */ ee({
  __name: "PairingPanel",
  setup(L) {
    const { t: s } = te(), { confirm: _ } = Ce(), b = P([]), $ = P([]), k = P(""), v = P("");
    let C;
    async function E() {
      try {
        const o = await fetch("/api/pairing/pending");
        if (!o.ok) throw new Error(await o.text());
        b.value = (await o.json()).requests || [];
      } catch (o) {
        k.value = o.message;
      }
      try {
        const o = await fetch("/api/pairing/devices");
        o.ok && ($.value = (await o.json()).devices || []);
      } catch {
      }
    }
    async function c(o, i) {
      try {
        const d = await fetch("/api/pairing/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...o, allow: i })
        });
        if (!d.ok) throw new Error(await d.text());
        await E();
      } catch (d) {
        k.value = d.message;
      }
    }
    async function u(o) {
      if (!(v.value || !await _({
        title: s("pairing.disconnect"),
        message: s("pairing.disconnectConfirm", { name: o.name || o.id }),
        confirmLabel: s("pairing.disconnect"),
        danger: !0
      }))) {
        v.value = o.id;
        try {
          const d = await fetch("/api/pairing/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: o.id })
          });
          if (!d.ok) throw new Error(await d.text());
          await E();
        } catch (d) {
          k.value = d.message;
        } finally {
          v.value = "";
        }
      }
    }
    return ae(() => {
      E(), C = setInterval(E, 3e3);
    }), ze(() => clearInterval(C)), (o, i) => (a(), r("section", la, [
      e("h3", null, l(t(s)("pairing.title")), 1),
      e("p", null, l(t(s)("pairing.hint")), 1),
      k.value ? (a(), r("p", oa, l(k.value), 1)) : M("", !0),
      b.value.length ? M("", !0) : (a(), r("p", na, l(t(s)("pairing.empty")), 1)),
      W(Be, {
        tag: "div",
        name: "pair",
        class: "pairing-list"
      }, {
        default: Ie(() => [
          (a(!0), r(F, null, J(b.value, (d) => (a(), r("article", {
            key: d.id
          }, [
            e("strong", null, l(d.name), 1),
            e("code", null, l(d.code), 1),
            d.approved ? (a(), r("span", aa, l(t(s)("pairing.approved")), 1)) : (a(), r(F, { key: 1 }, [
              e("button", {
                type: "button",
                class: "btn btn-ghost",
                onClick: (g) => c(d, !1)
              }, l(t(s)("pairing.deny")), 9, ia),
              e("button", {
                type: "button",
                class: "btn btn-primary",
                onClick: (g) => c(d, !0)
              }, l(t(s)("pairing.allow")), 9, ra)
            ], 64))
          ]))), 128))
        ]),
        _: 1
      }),
      $.value.length ? (a(), r(F, { key: 2 }, [
        e("h4", null, l(t(s)("pairing.pairedCount", { n: $.value.length })), 1),
        W(Be, {
          tag: "div",
          name: "pair",
          class: "pairing-list"
        }, {
          default: Ie(() => [
            (a(!0), r(F, null, J($.value, (d) => (a(), r("article", {
              key: d.id
            }, [
              e("strong", null, l(d.name || d.id), 1),
              e("button", {
                type: "button",
                class: "btn btn-danger-tonal",
                disabled: v.value === d.id,
                onClick: (g) => u(d)
              }, l(v.value === d.id ? t(s)("pairing.disconnecting") : t(s)("pairing.disconnect")), 9, ua)
            ]))), 128))
          ]),
          _: 1
        })
      ], 64)) : M("", !0)
    ]));
  }
}), ca = /* @__PURE__ */ ie(da, [["__scopeId", "data-v-c18959f6"]]), pa = { class: "content-card" }, ha = { class: "card-desc" }, va = { class: "field" }, ma = ["aria-label"], _a = ["aria-pressed", "onClick"], ga = /* @__PURE__ */ ee({
  __name: "GeneralPanel",
  setup(L) {
    const { t: s } = te(), _ = P(ht());
    function b($) {
      _.value = $, mt($);
    }
    return ($, k) => (a(), r("div", pa, [
      e("h2", null, l(t(s)("settings.tabs.general")), 1),
      e("p", ha, l(t(s)("settings.generalDesc")), 1),
      e("div", va, [
        e("label", null, l(t(s)("settings.language")), 1),
        e("div", {
          class: "segmented",
          role: "group",
          "aria-label": t(s)("settings.language")
        }, [
          (a(!0), r(F, null, J(t(vt), (v) => (a(), r("button", {
            key: v.code,
            class: j(["seg", { active: _.value === v.code }]),
            "aria-pressed": _.value === v.code,
            onClick: (C) => b(v.code)
          }, l(v.label), 11, _a))), 128))
        ], 8, ma)
      ]),
      W(ca)
    ]));
  }
});
var _e;
((L) => {
  const v = class v {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code with the given version number,
    // error correction level, data codeword bytes, and mask number.
    // This is a low-level API that most users should not use directly.
    // A mid-level API is the encodeSegments() function.
    constructor(c, u, o, i) {
      K(this, "version");
      K(this, "errorCorrectionLevel");
      /*-- Fields --*/
      // The width and height of this QR Code, measured in modules, between
      // 21 and 177 (inclusive). This is equal to version * 4 + 17.
      K(this, "size");
      // The index of the mask pattern used in this QR Code, which is between 0 and 7 (inclusive).
      // Even if a QR Code is created with automatic masking requested (mask = -1),
      // the resulting object still has a mask value between 0 and 7.
      K(this, "mask");
      // The modules of this QR Code (false = light, true = dark).
      // Immutable after constructor finishes. Accessed through getModule().
      K(this, "modules", []);
      // Indicates function modules that are not subjected to masking. Discarded when constructor finishes.
      K(this, "isFunction", []);
      if (this.version = c, this.errorCorrectionLevel = u, c < v.MIN_VERSION || c > v.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (i < -1 || i > 7)
        throw new RangeError("Mask value out of range");
      this.size = c * 4 + 17;
      let d = [];
      for (let y = 0; y < this.size; y++)
        d.push(!1);
      for (let y = 0; y < this.size; y++)
        this.modules.push(d.slice()), this.isFunction.push(d.slice());
      this.drawFunctionPatterns();
      const g = this.addEccAndInterleave(o);
      if (this.drawCodewords(g), i == -1) {
        let y = 1e9;
        for (let h = 0; h < 8; h++) {
          this.applyMask(h), this.drawFormatBits(h);
          const w = this.getPenaltyScore();
          w < y && (i = h, y = w), this.applyMask(h);
        }
      }
      $(0 <= i && i <= 7), this.mask = i, this.applyMask(i), this.drawFormatBits(i), this.isFunction = [];
    }
    /*-- Static factory functions (high level) --*/
    // Returns a QR Code representing the given Unicode text string at the given error correction level.
    // As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer
    // Unicode code points (not UTF-16 code units) if the low error correction level is used. The smallest possible
    // QR Code version is automatically chosen for the output. The ECC level of the result may be higher than the
    // ecl argument if it can be done without increasing the version.
    static encodeText(c, u) {
      const o = L.QrSegment.makeSegments(c);
      return v.encodeSegments(o, u);
    }
    // Returns a QR Code representing the given binary data at the given error correction level.
    // This function always encodes using the binary segment mode, not any text mode. The maximum number of
    // bytes allowed is 2953. The smallest possible QR Code version is automatically chosen for the output.
    // The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
    static encodeBinary(c, u) {
      const o = L.QrSegment.makeBytes(c);
      return v.encodeSegments([o], u);
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
    static encodeSegments(c, u, o = 1, i = 40, d = -1, g = !0) {
      if (!(v.MIN_VERSION <= o && o <= i && i <= v.MAX_VERSION) || d < -1 || d > 7)
        throw new RangeError("Invalid value");
      let y, h;
      for (y = o; ; y++) {
        const V = v.getNumDataCodewords(y, u) * 8, z = k.getTotalBits(c, y);
        if (z <= V) {
          h = z;
          break;
        }
        if (y >= i)
          throw new RangeError("Data too long");
      }
      for (const V of [v.Ecc.MEDIUM, v.Ecc.QUARTILE, v.Ecc.HIGH])
        g && h <= v.getNumDataCodewords(y, V) * 8 && (u = V);
      let w = [];
      for (const V of c) {
        _(V.mode.modeBits, 4, w), _(V.numChars, V.mode.numCharCountBits(y), w);
        for (const z of V.getData())
          w.push(z);
      }
      $(w.length == h);
      const S = v.getNumDataCodewords(y, u) * 8;
      $(w.length <= S), _(0, Math.min(4, S - w.length), w), _(0, (8 - w.length % 8) % 8, w), $(w.length % 8 == 0);
      for (let V = 236; w.length < S; V ^= 253)
        _(V, 8, w);
      let I = [];
      for (; I.length * 8 < w.length; )
        I.push(0);
      return w.forEach((V, z) => I[z >>> 3] |= V << 7 - (z & 7)), new v(y, u, I, d);
    }
    /*-- Accessor methods --*/
    // Returns the color of the module (pixel) at the given coordinates, which is false
    // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
    // If the given coordinates are out of bounds, then false (light) is returned.
    getModule(c, u) {
      return 0 <= c && c < this.size && 0 <= u && u < this.size && this.modules[u][c];
    }
    /*-- Private helper methods for constructor: Drawing function modules --*/
    // Reads this object's version field, and draws and marks all function modules.
    drawFunctionPatterns() {
      for (let o = 0; o < this.size; o++)
        this.setFunctionModule(6, o, o % 2 == 0), this.setFunctionModule(o, 6, o % 2 == 0);
      this.drawFinderPattern(3, 3), this.drawFinderPattern(this.size - 4, 3), this.drawFinderPattern(3, this.size - 4);
      const c = this.getAlignmentPatternPositions(), u = c.length;
      for (let o = 0; o < u; o++)
        for (let i = 0; i < u; i++)
          o == 0 && i == 0 || o == 0 && i == u - 1 || o == u - 1 && i == 0 || this.drawAlignmentPattern(c[o], c[i]);
      this.drawFormatBits(0), this.drawVersion();
    }
    // Draws two copies of the format bits (with its own error correction code)
    // based on the given mask and this object's error correction level field.
    drawFormatBits(c) {
      const u = this.errorCorrectionLevel.formatBits << 3 | c;
      let o = u;
      for (let d = 0; d < 10; d++)
        o = o << 1 ^ (o >>> 9) * 1335;
      const i = (u << 10 | o) ^ 21522;
      $(i >>> 15 == 0);
      for (let d = 0; d <= 5; d++)
        this.setFunctionModule(8, d, b(i, d));
      this.setFunctionModule(8, 7, b(i, 6)), this.setFunctionModule(8, 8, b(i, 7)), this.setFunctionModule(7, 8, b(i, 8));
      for (let d = 9; d < 15; d++)
        this.setFunctionModule(14 - d, 8, b(i, d));
      for (let d = 0; d < 8; d++)
        this.setFunctionModule(this.size - 1 - d, 8, b(i, d));
      for (let d = 8; d < 15; d++)
        this.setFunctionModule(8, this.size - 15 + d, b(i, d));
      this.setFunctionModule(8, this.size - 8, !0);
    }
    // Draws two copies of the version bits (with its own error correction code),
    // based on this object's version field, iff 7 <= version <= 40.
    drawVersion() {
      if (this.version < 7)
        return;
      let c = this.version;
      for (let o = 0; o < 12; o++)
        c = c << 1 ^ (c >>> 11) * 7973;
      const u = this.version << 12 | c;
      $(u >>> 18 == 0);
      for (let o = 0; o < 18; o++) {
        const i = b(u, o), d = this.size - 11 + o % 3, g = Math.floor(o / 3);
        this.setFunctionModule(d, g, i), this.setFunctionModule(g, d, i);
      }
    }
    // Draws a 9*9 finder pattern including the border separator,
    // with the center module at (x, y). Modules can be out of bounds.
    drawFinderPattern(c, u) {
      for (let o = -4; o <= 4; o++)
        for (let i = -4; i <= 4; i++) {
          const d = Math.max(Math.abs(i), Math.abs(o)), g = c + i, y = u + o;
          0 <= g && g < this.size && 0 <= y && y < this.size && this.setFunctionModule(g, y, d != 2 && d != 4);
        }
    }
    // Draws a 5*5 alignment pattern, with the center module
    // at (x, y). All modules must be in bounds.
    drawAlignmentPattern(c, u) {
      for (let o = -2; o <= 2; o++)
        for (let i = -2; i <= 2; i++)
          this.setFunctionModule(c + i, u + o, Math.max(Math.abs(i), Math.abs(o)) != 1);
    }
    // Sets the color of a module and marks it as a function module.
    // Only used by the constructor. Coordinates must be in bounds.
    setFunctionModule(c, u, o) {
      this.modules[u][c] = o, this.isFunction[u][c] = !0;
    }
    /*-- Private helper methods for constructor: Codewords and masking --*/
    // Returns a new byte string representing the given data with the appropriate error correction
    // codewords appended to it, based on this object's version and error correction level.
    addEccAndInterleave(c) {
      const u = this.version, o = this.errorCorrectionLevel;
      if (c.length != v.getNumDataCodewords(u, o))
        throw new RangeError("Invalid argument");
      const i = v.NUM_ERROR_CORRECTION_BLOCKS[o.ordinal][u], d = v.ECC_CODEWORDS_PER_BLOCK[o.ordinal][u], g = Math.floor(v.getNumRawDataModules(u) / 8), y = i - g % i, h = Math.floor(g / i);
      let w = [];
      const S = v.reedSolomonComputeDivisor(d);
      for (let V = 0, z = 0; V < i; V++) {
        let U = c.slice(z, z + h - d + (V < y ? 0 : 1));
        z += U.length;
        const x = v.reedSolomonComputeRemainder(U, S);
        V < y && U.push(0), w.push(U.concat(x));
      }
      let I = [];
      for (let V = 0; V < w[0].length; V++)
        w.forEach((z, U) => {
          (V != h - d || U >= y) && I.push(z[V]);
        });
      return $(I.length == g), I;
    }
    // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
    // data area of this QR Code. Function modules need to be marked off before this is called.
    drawCodewords(c) {
      if (c.length != Math.floor(v.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let u = 0;
      for (let o = this.size - 1; o >= 1; o -= 2) {
        o == 6 && (o = 5);
        for (let i = 0; i < this.size; i++)
          for (let d = 0; d < 2; d++) {
            const g = o - d, h = (o + 1 & 2) == 0 ? this.size - 1 - i : i;
            !this.isFunction[h][g] && u < c.length * 8 && (this.modules[h][g] = b(c[u >>> 3], 7 - (u & 7)), u++);
          }
      }
      $(u == c.length * 8);
    }
    // XORs the codeword modules in this QR Code with the given mask pattern.
    // The function modules must be marked and the codeword bits must be drawn
    // before masking. Due to the arithmetic of XOR, calling applyMask() with
    // the same mask value a second time will undo the mask. A final well-formed
    // QR Code needs exactly one (not zero, two, etc.) mask applied.
    applyMask(c) {
      if (c < 0 || c > 7)
        throw new RangeError("Mask value out of range");
      for (let u = 0; u < this.size; u++)
        for (let o = 0; o < this.size; o++) {
          let i;
          switch (c) {
            case 0:
              i = (o + u) % 2 == 0;
              break;
            case 1:
              i = u % 2 == 0;
              break;
            case 2:
              i = o % 3 == 0;
              break;
            case 3:
              i = (o + u) % 3 == 0;
              break;
            case 4:
              i = (Math.floor(o / 3) + Math.floor(u / 2)) % 2 == 0;
              break;
            case 5:
              i = o * u % 2 + o * u % 3 == 0;
              break;
            case 6:
              i = (o * u % 2 + o * u % 3) % 2 == 0;
              break;
            case 7:
              i = ((o + u) % 2 + o * u % 3) % 2 == 0;
              break;
            default:
              throw new Error("Unreachable");
          }
          !this.isFunction[u][o] && i && (this.modules[u][o] = !this.modules[u][o]);
        }
    }
    // Calculates and returns the penalty score based on state of this QR Code's current modules.
    // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
    getPenaltyScore() {
      let c = 0;
      for (let d = 0; d < this.size; d++) {
        let g = !1, y = 0, h = [0, 0, 0, 0, 0, 0, 0];
        for (let w = 0; w < this.size; w++)
          this.modules[d][w] == g ? (y++, y == 5 ? c += v.PENALTY_N1 : y > 5 && c++) : (this.finderPenaltyAddHistory(y, h), g || (c += this.finderPenaltyCountPatterns(h) * v.PENALTY_N3), g = this.modules[d][w], y = 1);
        c += this.finderPenaltyTerminateAndCount(g, y, h) * v.PENALTY_N3;
      }
      for (let d = 0; d < this.size; d++) {
        let g = !1, y = 0, h = [0, 0, 0, 0, 0, 0, 0];
        for (let w = 0; w < this.size; w++)
          this.modules[w][d] == g ? (y++, y == 5 ? c += v.PENALTY_N1 : y > 5 && c++) : (this.finderPenaltyAddHistory(y, h), g || (c += this.finderPenaltyCountPatterns(h) * v.PENALTY_N3), g = this.modules[w][d], y = 1);
        c += this.finderPenaltyTerminateAndCount(g, y, h) * v.PENALTY_N3;
      }
      for (let d = 0; d < this.size - 1; d++)
        for (let g = 0; g < this.size - 1; g++) {
          const y = this.modules[d][g];
          y == this.modules[d][g + 1] && y == this.modules[d + 1][g] && y == this.modules[d + 1][g + 1] && (c += v.PENALTY_N2);
        }
      let u = 0;
      for (const d of this.modules)
        u = d.reduce((g, y) => g + (y ? 1 : 0), u);
      const o = this.size * this.size, i = Math.ceil(Math.abs(u * 20 - o * 10) / o) - 1;
      return $(0 <= i && i <= 9), c += i * v.PENALTY_N4, $(0 <= c && c <= 2568888), c;
    }
    /*-- Private helper functions --*/
    // Returns an ascending list of positions of alignment patterns for this version number.
    // Each position is in the range [0,177), and are used on both the x and y axes.
    // This could be implemented as lookup table of 40 variable-length lists of integers.
    getAlignmentPatternPositions() {
      if (this.version == 1)
        return [];
      {
        const c = Math.floor(this.version / 7) + 2, u = Math.floor((this.version * 8 + c * 3 + 5) / (c * 4 - 4)) * 2;
        let o = [6];
        for (let i = this.size - 7; o.length < c; i -= u)
          o.splice(1, 0, i);
        return o;
      }
    }
    // Returns the number of data bits that can be stored in a QR Code of the given version number, after
    // all function modules are excluded. This includes remainder bits, so it might not be a multiple of 8.
    // The result is in the range [208, 29648]. This could be implemented as a 40-entry lookup table.
    static getNumRawDataModules(c) {
      if (c < v.MIN_VERSION || c > v.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let u = (16 * c + 128) * c + 64;
      if (c >= 2) {
        const o = Math.floor(c / 7) + 2;
        u -= (25 * o - 10) * o - 55, c >= 7 && (u -= 36);
      }
      return $(208 <= u && u <= 29648), u;
    }
    // Returns the number of 8-bit data (i.e. not error correction) codewords contained in any
    // QR Code of the given version number and error correction level, with remainder bits discarded.
    // This stateless pure function could be implemented as a (40*4)-cell lookup table.
    static getNumDataCodewords(c, u) {
      return Math.floor(v.getNumRawDataModules(c) / 8) - v.ECC_CODEWORDS_PER_BLOCK[u.ordinal][c] * v.NUM_ERROR_CORRECTION_BLOCKS[u.ordinal][c];
    }
    // Returns a Reed-Solomon ECC generator polynomial for the given degree. This could be
    // implemented as a lookup table over all possible parameter values, instead of as an algorithm.
    static reedSolomonComputeDivisor(c) {
      if (c < 1 || c > 255)
        throw new RangeError("Degree out of range");
      let u = [];
      for (let i = 0; i < c - 1; i++)
        u.push(0);
      u.push(1);
      let o = 1;
      for (let i = 0; i < c; i++) {
        for (let d = 0; d < u.length; d++)
          u[d] = v.reedSolomonMultiply(u[d], o), d + 1 < u.length && (u[d] ^= u[d + 1]);
        o = v.reedSolomonMultiply(o, 2);
      }
      return u;
    }
    // Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.
    static reedSolomonComputeRemainder(c, u) {
      let o = u.map((i) => 0);
      for (const i of c) {
        const d = i ^ o.shift();
        o.push(0), u.forEach((g, y) => o[y] ^= v.reedSolomonMultiply(g, d));
      }
      return o;
    }
    // Returns the product of the two given field elements modulo GF(2^8/0x11D). The arguments and result
    // are unsigned 8-bit integers. This could be implemented as a lookup table of 256*256 entries of uint8.
    static reedSolomonMultiply(c, u) {
      if (c >>> 8 || u >>> 8)
        throw new RangeError("Byte out of range");
      let o = 0;
      for (let i = 7; i >= 0; i--)
        o = o << 1 ^ (o >>> 7) * 285, o ^= (u >>> i & 1) * c;
      return $(o >>> 8 == 0), o;
    }
    // Can only be called immediately after a light run is added, and
    // returns either 0, 1, or 2. A helper function for getPenaltyScore().
    finderPenaltyCountPatterns(c) {
      const u = c[1];
      $(u <= this.size * 3);
      const o = u > 0 && c[2] == u && c[3] == u * 3 && c[4] == u && c[5] == u;
      return (o && c[0] >= u * 4 && c[6] >= u ? 1 : 0) + (o && c[6] >= u * 4 && c[0] >= u ? 1 : 0);
    }
    // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
    finderPenaltyTerminateAndCount(c, u, o) {
      return c && (this.finderPenaltyAddHistory(u, o), u = 0), u += this.size, this.finderPenaltyAddHistory(u, o), this.finderPenaltyCountPatterns(o);
    }
    // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
    finderPenaltyAddHistory(c, u) {
      u[0] == 0 && (c += this.size), u.pop(), u.unshift(c);
    }
  };
  /*-- Constants and tables --*/
  // The minimum version number supported in the QR Code Model 2 standard.
  K(v, "MIN_VERSION", 1), // The maximum version number supported in the QR Code Model 2 standard.
  K(v, "MAX_VERSION", 40), // For use in getPenaltyScore(), when evaluating which mask is best.
  K(v, "PENALTY_N1", 3), K(v, "PENALTY_N2", 3), K(v, "PENALTY_N3", 40), K(v, "PENALTY_N4", 10), K(v, "ECC_CODEWORDS_PER_BLOCK", [
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
  ]), K(v, "NUM_ERROR_CORRECTION_BLOCKS", [
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
  let s = v;
  L.QrCode = s;
  function _(E, c, u) {
    if (c < 0 || c > 31 || E >>> c)
      throw new RangeError("Value out of range");
    for (let o = c - 1; o >= 0; o--)
      u.push(E >>> o & 1);
  }
  function b(E, c) {
    return (E >>> c & 1) != 0;
  }
  function $(E) {
    if (!E)
      throw new Error("Assertion error");
  }
  const C = class C {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code segment with the given attributes and data.
    // The character count (numChars) must agree with the mode and the bit buffer length,
    // but the constraint isn't checked. The given bit buffer is cloned and stored.
    constructor(c, u, o) {
      K(this, "mode");
      K(this, "numChars");
      K(this, "bitData");
      if (this.mode = c, this.numChars = u, this.bitData = o, u < 0)
        throw new RangeError("Invalid argument");
      this.bitData = o.slice();
    }
    /*-- Static factory functions (mid level) --*/
    // Returns a segment representing the given binary data encoded in
    // byte mode. All input byte arrays are acceptable. Any text string
    // can be converted to UTF-8 bytes and encoded as a byte mode segment.
    static makeBytes(c) {
      let u = [];
      for (const o of c)
        _(o, 8, u);
      return new C(C.Mode.BYTE, c.length, u);
    }
    // Returns a segment representing the given string of decimal digits encoded in numeric mode.
    static makeNumeric(c) {
      if (!C.isNumeric(c))
        throw new RangeError("String contains non-numeric characters");
      let u = [];
      for (let o = 0; o < c.length; ) {
        const i = Math.min(c.length - o, 3);
        _(parseInt(c.substring(o, o + i), 10), i * 3 + 1, u), o += i;
      }
      return new C(C.Mode.NUMERIC, c.length, u);
    }
    // Returns a segment representing the given text string encoded in alphanumeric mode.
    // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
    // dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static makeAlphanumeric(c) {
      if (!C.isAlphanumeric(c))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let u = [], o;
      for (o = 0; o + 2 <= c.length; o += 2) {
        let i = C.ALPHANUMERIC_CHARSET.indexOf(c.charAt(o)) * 45;
        i += C.ALPHANUMERIC_CHARSET.indexOf(c.charAt(o + 1)), _(i, 11, u);
      }
      return o < c.length && _(C.ALPHANUMERIC_CHARSET.indexOf(c.charAt(o)), 6, u), new C(C.Mode.ALPHANUMERIC, c.length, u);
    }
    // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
    // The result may use various segment modes and switch modes to optimize the length of the bit stream.
    static makeSegments(c) {
      return c == "" ? [] : C.isNumeric(c) ? [C.makeNumeric(c)] : C.isAlphanumeric(c) ? [C.makeAlphanumeric(c)] : [C.makeBytes(C.toUtf8ByteArray(c))];
    }
    // Returns a segment representing an Extended Channel Interpretation
    // (ECI) designator with the given assignment value.
    static makeEci(c) {
      let u = [];
      if (c < 0)
        throw new RangeError("ECI assignment value out of range");
      if (c < 128)
        _(c, 8, u);
      else if (c < 16384)
        _(2, 2, u), _(c, 14, u);
      else if (c < 1e6)
        _(6, 3, u), _(c, 21, u);
      else
        throw new RangeError("ECI assignment value out of range");
      return new C(C.Mode.ECI, 0, u);
    }
    // Tests whether the given string can be encoded as a segment in numeric mode.
    // A string is encodable iff each character is in the range 0 to 9.
    static isNumeric(c) {
      return C.NUMERIC_REGEX.test(c);
    }
    // Tests whether the given string can be encoded as a segment in alphanumeric mode.
    // A string is encodable iff each character is in the following set: 0 to 9, A to Z
    // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static isAlphanumeric(c) {
      return C.ALPHANUMERIC_REGEX.test(c);
    }
    /*-- Methods --*/
    // Returns a new copy of the data bits of this segment.
    getData() {
      return this.bitData.slice();
    }
    // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
    // the given version. The result is infinity if a segment has too many characters to fit its length field.
    static getTotalBits(c, u) {
      let o = 0;
      for (const i of c) {
        const d = i.mode.numCharCountBits(u);
        if (i.numChars >= 1 << d)
          return 1 / 0;
        o += 4 + d + i.bitData.length;
      }
      return o;
    }
    // Returns a new array of bytes representing the given string encoded in UTF-8.
    static toUtf8ByteArray(c) {
      c = encodeURI(c);
      let u = [];
      for (let o = 0; o < c.length; o++)
        c.charAt(o) != "%" ? u.push(c.charCodeAt(o)) : (u.push(parseInt(c.substring(o + 1, o + 3), 16)), o += 2);
      return u;
    }
  };
  /*-- Constants --*/
  // Describes precisely all strings that are encodable in numeric mode.
  K(C, "NUMERIC_REGEX", /^[0-9]*$/), // Describes precisely all strings that are encodable in alphanumeric mode.
  K(C, "ALPHANUMERIC_REGEX", /^[A-Z0-9 $%*+.\/:-]*$/), // The set of all legal characters in alphanumeric mode,
  // where each character value maps to the index in the string.
  K(C, "ALPHANUMERIC_CHARSET", "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:");
  let k = C;
  L.QrSegment = k;
})(_e || (_e = {}));
((L) => {
  ((s) => {
    const b = class b {
      // The QR Code can tolerate about 30% erroneous codewords
      /*-- Constructor and fields --*/
      constructor(k, v) {
        K(this, "ordinal");
        K(this, "formatBits");
        this.ordinal = k, this.formatBits = v;
      }
    };
    /*-- Constants --*/
    K(b, "LOW", new b(0, 1)), // The QR Code can tolerate about  7% erroneous codewords
    K(b, "MEDIUM", new b(1, 0)), // The QR Code can tolerate about 15% erroneous codewords
    K(b, "QUARTILE", new b(2, 3)), // The QR Code can tolerate about 25% erroneous codewords
    K(b, "HIGH", new b(3, 2));
    let _ = b;
    s.Ecc = _;
  })(L.QrCode || (L.QrCode = {}));
})(_e || (_e = {}));
((L) => {
  ((s) => {
    const b = class b {
      /*-- Constructor and fields --*/
      constructor(k, v) {
        K(this, "modeBits");
        K(this, "numBitsCharCount");
        this.modeBits = k, this.numBitsCharCount = v;
      }
      /*-- Method --*/
      // (Package-private) Returns the bit width of the character count field for a segment in
      // this mode in a QR Code at the given version number. The result is in the range [0, 16].
      numCharCountBits(k) {
        return this.numBitsCharCount[Math.floor((k + 7) / 17)];
      }
    };
    /*-- Constants --*/
    K(b, "NUMERIC", new b(1, [10, 12, 14])), K(b, "ALPHANUMERIC", new b(2, [9, 11, 13])), K(b, "BYTE", new b(4, [8, 16, 16])), K(b, "KANJI", new b(8, [8, 10, 12])), K(b, "ECI", new b(7, [0, 0, 0]));
    let _ = b;
    s.Mode = _;
  })(L.QrSegment || (L.QrSegment = {}));
})(_e || (_e = {}));
const Ye = _e, ba = { class: "content-card" }, fa = { class: "card-desc" }, ya = { class: "connection-grid" }, ka = { class: "connection-form" }, wa = { class: "field" }, $a = ["placeholder"], Ca = { class: "field" }, Sa = { class: "toggle-label" }, Pa = { class: "field" }, xa = ["placeholder"], Ma = { class: "field" }, Ua = ["placeholder"], Ea = { class: "field" }, Ta = { class: "helper-text" }, Aa = { key: 0 }, Na = { key: 1 }, Va = { class: "actions-row" }, Ra = { class: "connection-qr" }, Oa = ["viewBox"], Ia = ["width", "height"], za = ["x", "y"], La = { class: "connection-link" }, Je = "0kay.connection.qr.v2", Da = /* @__PURE__ */ ee({
  __name: "ConnectionPanel",
  setup(L) {
    const { t: s } = te();
    function _() {
      try {
        return JSON.parse(localStorage.getItem(Je) || "{}");
      } catch {
        return {};
      }
    }
    function b(z) {
      const U = (x) => /^192\.168\./.test(x) ? 0 : /^10\./.test(x) ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(x) ? 2 : /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(x) ? 4 : 3;
      return [...z].sort((x, B) => U(x) - U(B))[0] || "";
    }
    const $ = _(), k = !!$.hostOverride, v = P($.hostOverride && $.host ? $.host : location.hostname), C = P(k), E = location.protocol === "https:" ? location.port || "443" : "8080", c = P($.port ?? E), u = P($.tls ?? location.protocol === "https:"), o = P(""), i = P(""), d = P($.name ?? "0KAY"), g = P(""), y = P(!1), h = P(!1);
    ae(async () => {
      try {
        const z = await fetch("/api/auth/session");
        if (z.ok) {
          const U = await z.json();
          g.value = String(U.core_id || ""), y.value = !!U.lan_enabled;
          const x = Array.isArray(U.addresses) ? U.addresses : [], B = b(x);
          !C.value && B && (v.value = B);
        }
      } catch {
      }
    }), Xe([v, c, u, d, C], () => {
      localStorage.setItem(
        Je,
        JSON.stringify({
          host: v.value,
          hostOverride: C.value,
          port: c.value,
          tls: u.value,
          name: d.value
        })
      );
    });
    const w = Y(() => {
      const z = u.value ? "https" : "http", U = String(c.value || "").trim();
      return `${z}://${v.value.trim()}${U ? ":" + U : ""}`;
    }), S = Y(() => {
      const z = [["v", "1"], ["url", w.value]];
      return d.value.trim() && z.push(["name", d.value.trim()]), o.value.trim() && z.push(["token", o.value.trim()]), i.value.trim() && z.push(["pin", i.value.trim()]), g.value && z.push(["core_id", g.value]), `0kay://pair?${z.map(([x, B]) => `${x}=${encodeURIComponent(B)}`).join("&")}`;
    }), I = Y(() => {
      const z = Ye.QrCode.encodeText(S.value, Ye.QrCode.Ecc.MEDIUM), U = z.size, x = 2, B = U + x * 2, q = [];
      for (let G = 0; G < U; G++)
        for (let O = 0; O < U; O++)
          z.getModule(O, G) && q.push({ x: O + x, y: G + x });
      return { dim: B, dark: q };
    });
    async function V() {
      try {
        await navigator.clipboard.writeText(S.value), h.value = !0, setTimeout(() => h.value = !1, 1500);
      } catch {
      }
    }
    return (z, U) => (a(), r("div", ba, [
      e("h2", null, l(t(s)("connection.title")), 1),
      e("p", fa, l(t(s)("connection.lead")), 1),
      e("div", ya, [
        e("div", ka, [
          e("div", wa, [
            e("label", null, l(t(s)("connection.remoteHost")), 1),
            N(e("input", {
              "onUpdate:modelValue": U[0] || (U[0] = (x) => v.value = x),
              class: "input",
              placeholder: t(s)("connection.hostPlaceholder"),
              onInput: U[1] || (U[1] = (x) => C.value = !0)
            }, null, 40, $a), [
              [D, v.value]
            ])
          ]),
          e("div", Ca, [
            e("label", null, l(t(s)("connection.port")), 1),
            N(e("input", {
              "onUpdate:modelValue": U[2] || (U[2] = (x) => c.value = x),
              class: "input",
              inputmode: "numeric",
              placeholder: "8080"
            }, null, 512), [
              [D, c.value]
            ])
          ]),
          e("label", Sa, [
            N(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": U[3] || (U[3] = (x) => u.value = x)
            }, null, 512), [
              [Q, u.value]
            ]),
            U[7] || (U[7] = e("span", { class: "toggle-slider" }, null, -1)),
            e("span", null, l(t(s)("connection.useTls")), 1)
          ]),
          e("div", Pa, [
            e("label", null, l(t(s)("connection.token")), 1),
            N(e("input", {
              "onUpdate:modelValue": U[4] || (U[4] = (x) => o.value = x),
              class: "input",
              type: "password",
              placeholder: t(s)("connection.tokenPlaceholder"),
              autocomplete: "off"
            }, null, 8, xa), [
              [D, o.value]
            ])
          ]),
          e("div", Ma, [
            e("label", null, l(t(s)("connection.pin")), 1),
            N(e("input", {
              "onUpdate:modelValue": U[5] || (U[5] = (x) => i.value = x),
              class: "input",
              type: "password",
              placeholder: t(s)("connection.pinPlaceholder"),
              autocomplete: "off"
            }, null, 8, Ua), [
              [D, i.value]
            ])
          ]),
          e("div", Ea, [
            e("label", null, l(t(s)("connection.deviceName")), 1),
            N(e("input", {
              "onUpdate:modelValue": U[6] || (U[6] = (x) => d.value = x),
              class: "input",
              placeholder: "0KAY"
            }, null, 512), [
              [D, d.value]
            ])
          ]),
          e("div", Ta, [
            oe(l(t(s)("connection.address")), 1),
            e("code", null, l(w.value), 1),
            g.value ? (a(), r("span", Aa, " · Core: " + l(g.value), 1)) : M("", !0),
            y.value ? (a(), r("span", Na, l(t(s)("connection.lanMode")), 1)) : M("", !0)
          ]),
          e("div", Va, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              onClick: V
            }, l(h.value ? t(s)("common.copied") : t(s)("connection.copyLink")), 1)
          ])
        ]),
        e("div", Ra, [
          (a(), r("svg", {
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
            }, null, 8, Ia),
            (a(!0), r(F, null, J(I.value.dark, (x) => (a(), r("rect", {
              key: x.x + ":" + x.y,
              x: x.x,
              y: x.y,
              width: "1",
              height: "1",
              fill: "#0b1020"
            }, null, 8, za))), 128))
          ], 8, Oa)),
          e("code", La, l(S.value), 1)
        ])
      ])
    ]));
  }
}), Fa = /* @__PURE__ */ ie(Da, [["__scopeId", "data-v-b6056614"]]), Ba = { class: "content-card" }, Ka = { class: "card-desc" }, Ha = { class: "field-row" }, ja = { class: "field" }, Ya = ["placeholder"], Ja = { class: "field" }, Wa = ["placeholder"], qa = { class: "field" }, Ga = { class: "field" }, Xa = ["placeholder"], Za = { class: "field" }, Qa = ["placeholder"], ei = { class: "field" }, ti = ["placeholder"], si = { class: "field" }, li = ["placeholder"], oi = { class: "helper-text" }, ni = /* @__PURE__ */ ee({
  __name: "PersonaPanel",
  setup(L) {
    const { t: s } = te(), _ = Le(), { tabLabel: b, tabMeta: $ } = De();
    return (k, v) => (a(), r("div", Ba, [
      e("h2", null, l(t(b)("persona")), 1),
      e("p", Ka, l(t($)("persona")?.descriptionKey ? t(s)(t($)("persona").descriptionKey) : t(s)("settings.personaDesc")), 1),
      e("div", Ha, [
        e("div", ja, [
          e("label", null, l(t(s)("wizard.name")), 1),
          N(e("input", {
            "onUpdate:modelValue": v[0] || (v[0] = (C) => t(_).persona.name = C),
            placeholder: t(s)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, Ya), [
            [D, t(_).persona.name]
          ])
        ]),
        e("div", Ja, [
          e("label", null, l(t(s)("wizard.avatarUrl")), 1),
          N(e("input", {
            "onUpdate:modelValue": v[1] || (v[1] = (C) => t(_).persona.avatar = C),
            placeholder: t(s)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, Wa), [
            [D, t(_).persona.avatar]
          ])
        ]),
        e("div", qa, [
          e("label", null, l(t(s)("settings.personaBirthDate")), 1),
          N(e("input", {
            "onUpdate:modelValue": v[2] || (v[2] = (C) => t(_).persona.birthDate = C),
            type: "date",
            class: "input"
          }, null, 512), [
            [D, t(_).persona.birthDate]
          ])
        ])
      ]),
      e("div", Ga, [
        e("label", null, l(t(s)("wizard.description")), 1),
        N(e("textarea", {
          "onUpdate:modelValue": v[3] || (v[3] = (C) => t(_).persona.description = C),
          placeholder: t(s)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Xa), [
          [D, t(_).persona.description]
        ])
      ]),
      e("div", Za, [
        e("label", null, l(t(s)("wizard.personality")), 1),
        N(e("textarea", {
          "onUpdate:modelValue": v[4] || (v[4] = (C) => t(_).persona.personality = C),
          placeholder: t(s)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Qa), [
          [D, t(_).persona.personality]
        ])
      ]),
      e("div", ei, [
        e("label", null, l(t(s)("wizard.greeting")), 1),
        N(e("textarea", {
          "onUpdate:modelValue": v[5] || (v[5] = (C) => t(_).persona.greeting = C),
          placeholder: t(s)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, ti), [
          [D, t(_).persona.greeting]
        ])
      ]),
      e("div", si, [
        e("label", null, l(t(s)("wizard.customPrompt")), 1),
        N(e("textarea", {
          "onUpdate:modelValue": v[6] || (v[6] = (C) => t(_).persona.customPrompt = C),
          placeholder: t(s)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, li), [
          [D, t(_).persona.customPrompt]
        ]),
        e("p", oi, l(t(s)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), ai = { class: "content-card" }, ii = { class: "card-desc" }, ri = { class: "toggle-label" }, ui = { class: "helper-text" }, di = { class: "toggle-label" }, ci = { class: "helper-text" }, pi = { class: "field" }, hi = ["placeholder"], vi = { class: "helper-text" }, mi = {
  key: 0,
  class: "helper-text"
}, _i = { class: "actions-row" }, gi = /* @__PURE__ */ ee({
  __name: "PermissionsPanel",
  setup(L) {
    const { t: s } = te(), { tabLabel: _, tabMeta: b, fieldLabel: $, fieldHelp: k } = De(), v = P({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), C = P("");
    async function E() {
      try {
        const u = await fetch("/api/life/permissions");
        if (u.ok) {
          const o = await u.json();
          v.value = {
            screen_watch: !!o.screen_watch,
            computer_use: !!o.computer_use,
            report_agent_host: o.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function c() {
      C.value = "";
      try {
        const u = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(v.value)
        });
        if (!u.ok) throw new Error(String(u.status));
        const o = await u.json();
        v.value = {
          screen_watch: !!o.screen_watch,
          computer_use: !!o.computer_use,
          report_agent_host: o.report_agent_host || ""
        }, C.value = s("settings.permSaved");
      } catch {
        C.value = s("settings.permFailed");
      }
    }
    return ae(E), (u, o) => (a(), r("div", ai, [
      e("h2", null, l(t(_)("permissions")), 1),
      e("p", ii, l(t(b)("permissions")?.descriptionKey ? t(s)(t(b)("permissions").descriptionKey) : t(s)("settings.permissionsDesc")), 1),
      e("label", ri, [
        N(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": o[0] || (o[0] = (i) => v.value.screen_watch = i),
          onChange: c
        }, null, 544), [
          [Q, v.value.screen_watch]
        ]),
        o[4] || (o[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(t($)(t(b)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          o[3] || (o[3] = e("br", null, null, -1)),
          e("small", ui, l(t(k)(t(b)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", di, [
        N(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": o[1] || (o[1] = (i) => v.value.computer_use = i),
          onChange: c
        }, null, 544), [
          [Q, v.value.computer_use]
        ]),
        o[6] || (o[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(t($)(t(b)("permissions"), "computer_use", "settings.computerUse")), 1),
          o[5] || (o[5] = e("br", null, null, -1)),
          e("small", ci, l(t(k)(t(b)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", pi, [
        e("label", null, l(t($)(t(b)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        N(e("input", {
          "onUpdate:modelValue": o[2] || (o[2] = (i) => v.value.report_agent_host = i),
          class: "input",
          placeholder: t(k)(t(b)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: c
        }, null, 40, hi), [
          [D, v.value.report_agent_host]
        ]),
        e("p", vi, l(t(k)(t(b)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      C.value ? (a(), r("div", mi, l(C.value), 1)) : M("", !0),
      e("div", _i, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: c
        }, l(t(s)("settings.save")), 1)
      ])
    ]));
  }
}), bi = P(!1), fi = P(!1);
P(!1);
const ve = P(!1), be = P(!0), Fe = P(!0), $e = P([]), tt = P(!1);
P(!1);
const Ue = P(!1), We = [];
function yi(L) {
  const s = We.splice(0, We.length);
  for (const _ of s)
    _.resolve();
}
async function ki() {
  const L = window.fetch;
  try {
    const s = await L("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!s.ok) return;
    const _ = await s.json();
    ve.value = !!_.configured, be.value = _.enabled !== !1, Fe.value = _.login_enabled !== !1, $e.value = Array.isArray(_.pages) ? _.pages : [], Ue.value = !_.configured && be.value;
  } catch {
  }
}
async function wi(L) {
  const s = window.fetch, _ = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(L)
  }), b = await _.json().catch(() => null);
  if (!_.ok) throw new Error(b?.error || `HTTP ${_.status}`);
  typeof b?.enabled == "boolean" && (be.value = b.enabled), typeof b?.login_enabled == "boolean" && (Fe.value = b.login_enabled), Array.isArray(b?.pages) && ($e.value = b.pages), ve.value = !!b?.configured, Ue.value = !b?.configured && be.value;
}
async function $i() {
  const L = window.fetch, s = await L("/api/security/pin", { method: "DELETE" }), _ = await s.json().catch(() => null);
  if (!s.ok) throw new Error(_?.error || `HTTP ${s.status}`);
  tt.value = !1, ve.value = !1, Ue.value = be.value;
}
async function Ci(L) {
  const s = window.fetch, _ = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: L })
  }), b = await _.json().catch(() => null);
  if (!_.ok || !b?.configured) throw new Error(b?.error || `HTTP ${_.status}`);
  L.trim(), tt.value = !0, ve.value = !0, Ue.value = !1, fi.value = !0, bi.value = !1, yi();
}
const Si = { class: "content-card security-panel" }, Pi = { class: "card-desc" }, xi = { class: "sec-stack" }, Mi = { class: "toggle-label" }, Ui = ["checked", "disabled"], Ei = { class: "helper-text" }, Ti = { class: "toggle-label" }, Ai = ["checked", "disabled"], Ni = { class: "helper-text" }, Vi = { class: "sec-card" }, Ri = { class: "sec-card-head" }, Oi = { class: "sec-pin-grid" }, Ii = { class: "sec-pin-col" }, zi = { class: "sec-pin-label" }, Li = { class: "sec-pin-col" }, Di = { class: "sec-pin-label" }, Fi = { class: "sec-actions" }, Bi = ["disabled"], Ki = ["disabled"], Hi = { class: "sec-card" }, ji = { class: "sec-card-head" }, Yi = { class: "sec-chip" }, Ji = { class: "helper-text" }, Wi = { class: "page-list" }, qi = ["checked", "disabled", "onChange"], Gi = { class: "page-text" }, Xi = { class: "page-name" }, Zi = {
  key: 0,
  class: "helper-text sec-msg"
}, Qi = {
  key: 1,
  class: "sec-error"
}, er = /* @__PURE__ */ ee({
  __name: "SecurityPanel",
  setup(L) {
    const { t: s } = te(), { confirm: _ } = Ce(), b = et(), $ = P(!1), k = P(""), v = P(""), C = P(""), E = P(""), c = Y(() => {
      const y = [], h = /* @__PURE__ */ new Set(), w = (S, I) => {
        !S || h.has(S) || (h.add(S), y.push({ path: S, label: I || S }));
      };
      for (const S of b.navItems) {
        const I = S.to || (S.id === "chat" ? "/" : "");
        if (!I) continue;
        let V = S.labelKey ? s(S.labelKey) : "";
        (!V || V === S.labelKey) && (V = S.label || S.id), w(I, V);
      }
      for (const S of b.routerPatches) {
        let I = S.titleKey ? s(S.titleKey) : "";
        (!I || I === S.titleKey) && (I = S.title || String(S.name || S.path)), w(S.path, I);
      }
      return y;
    });
    ae(() => {
      ki();
    });
    async function u(y) {
      $.value = !0, k.value = "", v.value = "";
      try {
        await wi(y), k.value = s("settings.saved"), setTimeout(() => {
          k.value = "";
        }, 1500);
      } catch (h) {
        v.value = h?.message || s("settings.permFailed");
      } finally {
        $.value = !1;
      }
    }
    function o(y, h) {
      u({ [y]: h });
    }
    function i(y, h) {
      const w = new Set($e.value);
      h ? w.add(y) : w.delete(y), u({ pages: [...w] });
    }
    async function d() {
      if (v.value = "", C.value.length !== 6) {
        v.value = s("wizard.pinTooShort");
        return;
      }
      if (C.value !== E.value) {
        v.value = s("wizard.pinMismatch");
        return;
      }
      $.value = !0;
      try {
        await Ci(C.value), C.value = "", E.value = "", k.value = s("settings.saved"), setTimeout(() => {
          k.value = "";
        }, 1500);
      } catch (y) {
        v.value = y?.message || s("settings.permFailed");
      } finally {
        $.value = !1;
      }
    }
    async function g() {
      if (await _({
        title: s("security.removePin"),
        message: s("security.removePinConfirm"),
        confirmLabel: s("common.delete"),
        danger: !0
      })) {
        $.value = !0, v.value = "";
        try {
          await $i(), k.value = s("settings.saved"), setTimeout(() => {
            k.value = "";
          }, 1500);
        } catch (h) {
          v.value = h?.message || s("settings.permFailed");
        } finally {
          $.value = !1;
        }
      }
    }
    return (y, h) => (a(), r("div", Si, [
      e("h2", null, l(t(s)("settings.tabs.security")), 1),
      e("p", Pi, l(t(s)("security.desc")), 1),
      e("div", xi, [
        e("label", Mi, [
          e("input", {
            type: "checkbox",
            checked: t(be),
            disabled: $.value,
            onChange: h[0] || (h[0] = (w) => o("enabled", w.target.checked))
          }, null, 40, Ui),
          h[4] || (h[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(t(s)("security.pinSwitch")), 1),
            e("small", Ei, l(t(s)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", Ti, [
          e("input", {
            type: "checkbox",
            checked: t(Fe),
            disabled: $.value,
            onChange: h[1] || (h[1] = (w) => o("login_enabled", w.target.checked))
          }, null, 40, Ai),
          h[5] || (h[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(t(s)("security.loginSwitch")), 1),
            e("small", Ni, l(t(s)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", Vi, [
          e("div", Ri, [
            e("strong", null, l(t(ve) ? t(s)("security.changePin") : t(s)("auth.setupTitle")), 1),
            e("span", {
              class: j(["sec-chip", { on: t(ve) }])
            }, l(t(ve) ? t(s)("security.pinSet") : t(s)("security.pinUnset")), 3)
          ]),
          e("div", Oi, [
            e("div", Ii, [
              e("span", zi, l(t(s)("auth.pinNew")), 1),
              W(t(He), {
                modelValue: C.value,
                "onUpdate:modelValue": h[2] || (h[2] = (w) => C.value = w)
              }, null, 8, ["modelValue"])
            ]),
            e("div", Li, [
              e("span", Di, l(t(s)("auth.pinConfirm")), 1),
              W(t(He), {
                modelValue: E.value,
                "onUpdate:modelValue": h[3] || (h[3] = (w) => E.value = w),
                onComplete: d
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", Fi, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: $.value,
              onClick: d
            }, l(t(s)("auth.savePin")), 9, Bi),
            t(ve) ? (a(), r("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: $.value,
              onClick: g
            }, l(t(s)("security.removePin")), 9, Ki)) : M("", !0)
          ])
        ]),
        e("section", Hi, [
          e("div", ji, [
            e("strong", null, l(t(s)("security.pages")), 1),
            e("span", Yi, l(t(s)("security.pageCount", { n: t($e).length })), 1)
          ]),
          e("p", Ji, l(t(s)("security.pagesHelp")), 1),
          e("div", Wi, [
            (a(!0), r(F, null, J(c.value, (w) => (a(), r("label", {
              key: w.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: t($e).includes(w.path),
                disabled: $.value,
                onChange: (S) => i(w.path, S.target.checked)
              }, null, 40, qi),
              h[6] || (h[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", Gi, [
                e("span", Xi, l(w.label), 1),
                e("code", null, l(w.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      k.value ? (a(), r("p", Zi, l(k.value), 1)) : M("", !0),
      v.value ? (a(), r("p", Qi, l(v.value), 1)) : M("", !0)
    ]));
  }
}), tr = /* @__PURE__ */ ie(er, [["__scopeId", "data-v-fb8c17b3"]]), sr = { class: "mcp-panel" }, lr = { class: "mcp-head" }, or = { class: "subtitle" }, nr = { class: "mcp-actions" }, ar = ["disabled"], ir = {
  key: 0,
  class: "error-banner"
}, rr = {
  key: 1,
  class: "notice-banner"
}, ur = {
  key: 2,
  class: "hint"
}, dr = {
  key: 3,
  class: "mcp-list"
}, cr = { class: "mcp-row" }, pr = { class: "mcp-field grow" }, hr = ["onUpdate:modelValue", "readonly"], vr = { class: "mcp-field" }, mr = ["onUpdate:modelValue", "onChange"], _r = { value: "builtin" }, gr = { class: "mcp-toggle" }, br = ["onUpdate:modelValue"], fr = ["onClick"], yr = { class: "mcp-field" }, kr = ["onUpdate:modelValue"], wr = { class: "mcp-field" }, $r = ["onUpdate:modelValue"], Cr = { class: "mcp-field" }, Sr = ["onUpdate:modelValue"], Pr = { class: "mcp-field" }, xr = ["onUpdate:modelValue"], Mr = { class: "builtin-note" }, Ur = { class: "mail-grid" }, Er = { class: "mail-col" }, Tr = { class: "mail-label" }, Ar = { class: "mcp-field" }, Nr = ["onUpdate:modelValue"], Vr = { class: "mail-row" }, Rr = { class: "mcp-field" }, Or = ["onUpdate:modelValue"], Ir = { class: "mcp-toggle" }, zr = ["onUpdate:modelValue"], Lr = { class: "mcp-field" }, Dr = ["onUpdate:modelValue"], Fr = { class: "mcp-field" }, Br = ["onUpdate:modelValue"], Kr = { class: "mail-col" }, Hr = { class: "mail-label" }, jr = { class: "mcp-field" }, Yr = ["onUpdate:modelValue"], Jr = { class: "mail-row" }, Wr = { class: "mcp-field" }, qr = ["onUpdate:modelValue"], Gr = { class: "mcp-toggle" }, Xr = ["onUpdate:modelValue"], Zr = { class: "mcp-field" }, Qr = ["onUpdate:modelValue"], eu = { class: "mcp-field" }, tu = ["onUpdate:modelValue"], su = { class: "mail-row" }, lu = { class: "mcp-field grow" }, ou = ["onUpdate:modelValue", "placeholder"], nu = { class: "mcp-field" }, au = ["onUpdate:modelValue"], iu = {
  key: 0,
  class: "hint"
}, ru = /* @__PURE__ */ ee({
  __name: "McpPanel",
  setup(L) {
    const { t: s } = te(), _ = P([]), b = P(!1), $ = P(!1), k = P(""), v = P(!1);
    function C() {
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
    function E(g) {
      const y = g?.transport === "http" ? "http" : g?.transport === "builtin" || g?.builtin ? "builtin" : "stdio", h = g?.options?.imap || {}, w = g?.options?.smtp || {};
      return {
        id: String(g?.id || ""),
        transport: y,
        command: String(g?.command || ""),
        argsText: Array.isArray(g?.args) ? g.args.join(`
`) : "",
        url: String(g?.url || ""),
        headersText: g?.headers && typeof g.headers == "object" ? JSON.stringify(g.headers, null, 2) : "",
        enabled: g?.enabled !== !1,
        imapHost: String(h.host || ""),
        imapPort: Number(h.port) || 993,
        imapSsl: h.ssl !== !1,
        imapUser: String(h.user || ""),
        imapPassword: String(h.password || ""),
        smtpHost: String(w.host || ""),
        smtpPort: Number(w.port) || 465,
        smtpSecure: w.secure !== !1,
        smtpUser: String(w.user || ""),
        smtpPassword: String(w.password || ""),
        from: String(w.from || ""),
        fromName: String(w.fromName || "0KAY")
      };
    }
    function c(g) {
      if (g.transport === "builtin") {
        const h = {};
        return (g.imapHost.trim() || g.imapUser.trim()) && (h.imap = {
          host: g.imapHost.trim(),
          port: Number(g.imapPort) || 993,
          ssl: g.imapSsl,
          user: g.imapUser.trim(),
          password: g.imapPassword
        }), (g.smtpHost.trim() || g.smtpUser.trim() || g.from.trim()) && (h.smtp = {
          host: g.smtpHost.trim(),
          port: Number(g.smtpPort) || 465,
          secure: g.smtpSecure,
          user: g.smtpUser.trim(),
          password: g.smtpPassword,
          from: g.from.trim(),
          fromName: g.fromName.trim() || "0KAY"
        }), { id: g.id.trim() || "mail", transport: "builtin", builtin: "mail", enabled: g.enabled, options: h };
      }
      const y = { id: g.id.trim(), transport: g.transport, enabled: g.enabled };
      if (g.transport === "http") {
        if (g.url.trim() && (y.url = g.url.trim()), g.headersText.trim())
          try {
            y.headers = JSON.parse(g.headersText);
          } catch {
            throw new Error(s("mcp.headersInvalid", { id: g.id || "(unnamed)" }));
          }
      } else {
        g.command.trim() && (y.command = g.command.trim());
        const h = g.argsText.split(`
`).map((w) => w.trim()).filter(Boolean);
        h.length && (y.args = h);
      }
      return y;
    }
    function u(g) {
      g.transport === "builtin" && (g.id = "mail");
    }
    function o() {
      const g = C();
      _.value.some((y) => y.transport === "builtin") && (g.transport = "stdio"), _.value.push(g);
    }
    async function i() {
      b.value = !0, k.value = "";
      try {
        const y = (await he("/api/settings/mcp"))?.values?.servers;
        let h = [];
        if (typeof y == "string" && y.trim())
          try {
            const w = JSON.parse(y);
            Array.isArray(w) && (h = w);
          } catch {
            k.value = s("mcp.configInvalid");
          }
        _.value = h.map(E);
      } catch (g) {
        k.value = g?.message || String(g);
      } finally {
        b.value = !1;
      }
    }
    async function d() {
      if (!$.value) {
        $.value = !0, k.value = "", v.value = !1;
        try {
          const g = /* @__PURE__ */ new Set(), y = _.value.map(c).filter((h) => {
            const w = String(h.id || "").trim();
            return !w || g.has(w) ? !1 : (g.add(w), !0);
          });
          await Me("/api/settings/mcp", { values: { servers: JSON.stringify(y) } }), v.value = !0, setTimeout(() => {
            v.value = !1;
          }, 2e3);
        } catch (g) {
          k.value = g?.message || String(g);
        } finally {
          $.value = !1;
        }
      }
    }
    return ae(i), (g, y) => (a(), r("div", sr, [
      e("header", lr, [
        e("div", null, [
          e("h2", null, l(t(s)("mcp.title")), 1),
          e("p", or, l(t(s)("mcp.subtitle")), 1)
        ]),
        e("div", nr, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: o
          }, l(t(s)("mcp.addServer")), 1),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: $.value,
            onClick: d
          }, l($.value ? t(s)("common.saving") : t(s)("common.save")), 9, ar)
        ])
      ]),
      k.value ? (a(), r("div", ir, l(k.value), 1)) : M("", !0),
      v.value ? (a(), r("div", rr, l(t(s)("settings.saved")), 1)) : M("", !0),
      b.value ? (a(), r("p", ur, l(t(s)("common.loading")), 1)) : (a(), r("div", dr, [
        (a(!0), r(F, null, J(_.value, (h, w) => (a(), r("article", {
          key: w,
          class: j(["mcp-card", { "is-builtin": h.transport === "builtin" }])
        }, [
          e("div", cr, [
            e("label", pr, [
              y[0] || (y[0] = e("span", null, "ID", -1)),
              N(e("input", {
                "onUpdate:modelValue": (S) => h.id = S,
                readonly: h.transport === "builtin",
                placeholder: "filesystem"
              }, null, 8, hr), [
                [D, h.id]
              ])
            ]),
            e("label", vr, [
              e("span", null, l(t(s)("mcp.transport")), 1),
              N(e("select", {
                "onUpdate:modelValue": (S) => h.transport = S,
                onChange: (S) => u(h)
              }, [
                y[1] || (y[1] = e("option", { value: "stdio" }, "stdio", -1)),
                y[2] || (y[2] = e("option", { value: "http" }, "http", -1)),
                e("option", _r, l(t(s)("mcp.builtinMail")), 1)
              ], 40, mr), [
                [rt, h.transport]
              ])
            ]),
            e("label", gr, [
              N(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (S) => h.enabled = S
              }, null, 8, br), [
                [Q, h.enabled]
              ]),
              e("span", null, l(t(s)("mcp.enabled")), 1)
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (S) => _.value.splice(w, 1)
            }, l(t(s)("common.delete")), 9, fr)
          ]),
          h.transport === "stdio" ? (a(), r(F, { key: 0 }, [
            e("label", yr, [
              e("span", null, l(t(s)("mcp.command")), 1),
              N(e("input", {
                "onUpdate:modelValue": (S) => h.command = S,
                placeholder: "npx"
              }, null, 8, kr), [
                [D, h.command]
              ])
            ]),
            e("label", wr, [
              e("span", null, l(t(s)("mcp.args")), 1),
              N(e("textarea", {
                "onUpdate:modelValue": (S) => h.argsText = S,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, $r), [
                [D, h.argsText]
              ])
            ])
          ], 64)) : h.transport === "http" ? (a(), r(F, { key: 1 }, [
            e("label", Cr, [
              y[3] || (y[3] = e("span", null, "URL", -1)),
              N(e("input", {
                "onUpdate:modelValue": (S) => h.url = S,
                placeholder: "https://example.com/mcp"
              }, null, 8, Sr), [
                [D, h.url]
              ])
            ]),
            e("label", Pr, [
              y[4] || (y[4] = e("span", null, "Headers（JSON）", -1)),
              N(e("textarea", {
                "onUpdate:modelValue": (S) => h.headersText = S,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, xr), [
                [D, h.headersText]
              ])
            ])
          ], 64)) : (a(), r(F, { key: 2 }, [
            e("p", Mr, l(t(s)("mcp.builtinNote")), 1),
            e("div", Ur, [
              e("div", Er, [
                e("p", Tr, l(t(s)("mcp.imap")), 1),
                e("label", Ar, [
                  e("span", null, l(t(s)("mcp.host")), 1),
                  N(e("input", {
                    "onUpdate:modelValue": (S) => h.imapHost = S,
                    placeholder: "imap.example.com",
                    autocomplete: "off"
                  }, null, 8, Nr), [
                    [D, h.imapHost]
                  ])
                ]),
                e("div", Vr, [
                  e("label", Rr, [
                    e("span", null, l(t(s)("mcp.port")), 1),
                    N(e("input", {
                      "onUpdate:modelValue": (S) => h.imapPort = S,
                      type: "number",
                      placeholder: "993"
                    }, null, 8, Or), [
                      [
                        D,
                        h.imapPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", Ir, [
                    N(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (S) => h.imapSsl = S
                    }, null, 8, zr), [
                      [Q, h.imapSsl]
                    ]),
                    y[5] || (y[5] = e("span", null, "SSL", -1))
                  ])
                ]),
                e("label", Lr, [
                  e("span", null, l(t(s)("mcp.username")), 1),
                  N(e("input", {
                    "onUpdate:modelValue": (S) => h.imapUser = S,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, Dr), [
                    [D, h.imapUser]
                  ])
                ]),
                e("label", Fr, [
                  e("span", null, l(t(s)("mcp.password")), 1),
                  N(e("input", {
                    "onUpdate:modelValue": (S) => h.imapPassword = S,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, Br), [
                    [D, h.imapPassword]
                  ])
                ])
              ]),
              e("div", Kr, [
                e("p", Hr, l(t(s)("mcp.smtp")), 1),
                e("label", jr, [
                  e("span", null, l(t(s)("mcp.host")), 1),
                  N(e("input", {
                    "onUpdate:modelValue": (S) => h.smtpHost = S,
                    placeholder: "smtp.example.com",
                    autocomplete: "off"
                  }, null, 8, Yr), [
                    [D, h.smtpHost]
                  ])
                ]),
                e("div", Jr, [
                  e("label", Wr, [
                    e("span", null, l(t(s)("mcp.port")), 1),
                    N(e("input", {
                      "onUpdate:modelValue": (S) => h.smtpPort = S,
                      type: "number",
                      placeholder: "465"
                    }, null, 8, qr), [
                      [
                        D,
                        h.smtpPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", Gr, [
                    N(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (S) => h.smtpSecure = S
                    }, null, 8, Xr), [
                      [Q, h.smtpSecure]
                    ]),
                    y[6] || (y[6] = e("span", null, "SSL（465）", -1))
                  ])
                ]),
                e("label", Zr, [
                  e("span", null, l(t(s)("mcp.username")), 1),
                  N(e("input", {
                    "onUpdate:modelValue": (S) => h.smtpUser = S,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, Qr), [
                    [D, h.smtpUser]
                  ])
                ]),
                e("label", eu, [
                  e("span", null, l(t(s)("mcp.password")), 1),
                  N(e("input", {
                    "onUpdate:modelValue": (S) => h.smtpPassword = S,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, tu), [
                    [D, h.smtpPassword]
                  ])
                ]),
                e("div", su, [
                  e("label", lu, [
                    e("span", null, l(t(s)("mcp.from")), 1),
                    N(e("input", {
                      "onUpdate:modelValue": (S) => h.from = S,
                      placeholder: t(s)("mcp.fromPlaceholder"),
                      autocomplete: "off"
                    }, null, 8, ou), [
                      [D, h.from]
                    ])
                  ]),
                  e("label", nu, [
                    e("span", null, l(t(s)("mcp.fromName")), 1),
                    N(e("input", {
                      "onUpdate:modelValue": (S) => h.fromName = S,
                      placeholder: "0KAY",
                      autocomplete: "off"
                    }, null, 8, au), [
                      [D, h.fromName]
                    ])
                  ])
                ])
              ])
            ])
          ], 64))
        ], 2))), 128)),
        _.value.length ? M("", !0) : (a(), r("p", iu, l(t(s)("mcp.emptyServers")), 1))
      ]))
    ]));
  }
}), uu = /* @__PURE__ */ ie(ru, [["__scopeId", "data-v-01485e38"]]), du = { class: "content-card danger" }, cu = { class: "card-desc" }, pu = { class: "danger-box" }, hu = ["disabled"], vu = /* @__PURE__ */ ee({
  __name: "DangerPanel",
  setup(L) {
    const { t: s } = te(), _ = Le(), b = Ze(), { confirm: $ } = Ce(), k = P(!1);
    async function v() {
      if (!(k.value || !await $({
        title: s("settings.reset"),
        message: s("settings.resetConfirmMsg"),
        confirmLabel: s("settings.reset"),
        danger: !0
      }))) {
        k.value = !0;
        try {
          _.resetWizard(), b.push("/");
        } finally {
          k.value = !1;
        }
      }
    }
    return (C, E) => (a(), r("div", du, [
      e("h2", null, l(t(s)("settings.tabs.danger")), 1),
      e("p", cu, l(t(s)("settings.resetDesc")), 1),
      e("div", pu, [
        e("div", null, [
          e("strong", null, l(t(s)("settings.reset")), 1),
          e("p", null, l(t(s)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          disabled: k.value,
          onClick: v
        }, l(t(s)("settings.reset")), 9, hu)
      ])
    ]));
  }
}), mu = {
  key: 1,
  class: "plugin-pane-message"
}, _u = {
  key: 2,
  class: "plugin-pane-message"
}, gu = /* @__PURE__ */ ee({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(L) {
    const s = L, _ = Ke(null), b = Ke("");
    return Xe(
      () => s.module,
      async ($) => {
        if (!$) {
          _.value = null, b.value = "";
          return;
        }
        try {
          const k = await import(
            /* @vite-ignore */
            $
          );
          _.value = k?.default || k, b.value = "";
        } catch (k) {
          _.value = null, b.value = k?.message || String(k);
        }
      },
      { immediate: !0 }
    ), ($, k) => _.value ? (a(), le(ut(_.value), { key: 0 })) : b.value ? (a(), r("div", mu, l(b.value), 1)) : (a(), r("div", _u, "Loading plugin module…"));
  }
}), bu = /* @__PURE__ */ ie(gu, [["__scopeId", "data-v-2d1f36bc"]]), fu = { class: "models-field" }, yu = {
  key: 0,
  class: "models-list"
}, ku = { class: "models-rank" }, wu = ["title"], $u = { class: "models-actions" }, Cu = ["disabled", "aria-label", "onClick"], Su = ["disabled", "aria-label", "onClick"], Pu = ["aria-label", "onClick"], xu = {
  key: 1,
  class: "models-empty"
}, Mu = /* @__PURE__ */ ee({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(L, { emit: s }) {
    const { t: _ } = te(), b = L, $ = s, k = Y(() => String(b.modelValue || "").split(",").map((o) => o.trim()).filter(Boolean)), v = Y(() => b.options.filter((o) => !k.value.includes(o)));
    function C(o) {
      $("update:modelValue", o.join(","));
    }
    function E(o) {
      o && !k.value.includes(o) && C([...k.value, o]);
    }
    function c(o) {
      C(k.value.filter((i) => i !== o));
    }
    function u(o, i) {
      const d = [...k.value], g = o + i;
      g < 0 || g >= d.length || ([d[o], d[g]] = [d[g], d[o]], C(d));
    }
    return (o, i) => (a(), r("div", fu, [
      k.value.length ? (a(), r("ol", yu, [
        (a(!0), r(F, null, J(k.value, (d, g) => (a(), r("li", { key: d }, [
          e("span", ku, l(g + 1), 1),
          e("span", {
            class: "models-name",
            title: d
          }, l(d), 9, wu),
          e("span", $u, [
            e("button", {
              type: "button",
              disabled: g === 0,
              "aria-label": t(_)("models.higher"),
              onClick: (y) => u(g, -1)
            }, "↑", 8, Cu),
            e("button", {
              type: "button",
              disabled: g === k.value.length - 1,
              "aria-label": t(_)("models.lower"),
              onClick: (y) => u(g, 1)
            }, "↓", 8, Su),
            e("button", {
              type: "button",
              "aria-label": t(_)("common.remove"),
              onClick: (y) => c(d)
            }, "✕", 8, Pu)
          ])
        ]))), 128))
      ])) : (a(), r("p", xu, l(t(_)("models.empty")), 1)),
      v.value.length ? (a(), le(t(ue), {
        key: 2,
        options: v.value,
        "model-value": "",
        placeholder: t(_)("models.addPlaceholder"),
        "onUpdate:modelValue": E
      }, null, 8, ["options", "placeholder"])) : M("", !0)
    ]));
  }
}), qe = /* @__PURE__ */ ie(Mu, [["__scopeId", "data-v-7089f4a3"]]), Uu = { class: "settings-page" }, Eu = { class: "page-header" }, Tu = { class: "subtitle" }, Au = { key: 0 }, Nu = { key: 1 }, Vu = { class: "settings-layout" }, Ru = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, Ou = ["aria-current", "data-tab-id", "title", "aria-label", "onClick"], Iu = {
  class: "nav-icon",
  "aria-hidden": "true"
}, zu = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Lu = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Du = {
  key: 2,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Fu = {
  key: 3,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Bu = {
  key: 4,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ku = {
  key: 5,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Hu = {
  key: 6,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, ju = {
  key: 7,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Yu = {
  key: 8,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ju = {
  key: 9,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Wu = {
  key: 10,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, qu = {
  key: 11,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Gu = { class: "nav-label" }, Xu = { class: "settings-content" }, Zu = {
  key: 0,
  class: "content-card provider-runtime"
}, Qu = {
  key: 0,
  class: "helper-text"
}, ed = {
  key: 0,
  class: "toggle-label"
}, td = ["checked", "onChange"], sd = { key: 0 }, ld = {
  key: 1,
  class: "helper-text"
}, od = {
  key: 0,
  class: "helper-text"
}, nd = ["type", "value", "onInput"], ad = {
  key: 0,
  class: "helper-text"
}, id = { class: "actions-row" }, rd = ["disabled"], ud = {
  key: "live2d",
  class: "content-card"
}, dd = { class: "card-desc" }, cd = { class: "toggle-label" }, pd = { class: "field" }, hd = { class: "model-choices" }, vd = ["value", "checked", "onChange"], md = ["placeholder"], _d = { class: "helper-text" }, gd = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, bd = { class: "helper-text" }, fd = ["disabled"], yd = { class: "field" }, kd = {
  key: 0,
  class: "helper-text"
}, wd = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, $d = ["value", "checked", "onChange"], Cd = ["onClick"], Sd = {
  key: 0,
  class: "card-desc"
}, Pd = {
  key: 1,
  class: "helper-text"
}, xd = {
  key: 0,
  class: "toggle-label"
}, Md = ["checked", "onChange"], Ud = { key: 0 }, Ed = {
  key: 1,
  class: "helper-text"
}, Td = {
  key: 0,
  class: "helper-text"
}, Ad = {
  key: 0,
  class: "helper-text"
}, Nd = {
  key: 0,
  class: "helper-text"
}, Vd = { class: "actions-row" }, Rd = ["disabled"], Od = {
  key: 0,
  class: "helper-text"
}, Id = {
  key: 0,
  class: "helper-text"
}, zd = ["type", "value", "onInput"], Ld = {
  key: 0,
  class: "helper-text"
}, Dd = { class: "actions-row" }, Fd = ["disabled"], Bd = {
  key: 0,
  class: "card-desc"
}, Kd = {
  key: 1,
  class: "card-desc"
}, Hd = {
  key: 0,
  class: "toggle-label"
}, jd = ["checked", "onChange"], Yd = { key: 0 }, Jd = {
  key: 1,
  class: "helper-text"
}, Wd = {
  key: 0,
  class: "helper-text"
}, qd = {
  key: 0,
  class: "helper-text"
}, Gd = {
  key: 0,
  class: "helper-text"
}, Xd = ["type", "value", "onInput"], Zd = {
  key: 0,
  class: "helper-text"
}, Qd = { class: "actions-row" }, ec = ["disabled"], tc = {
  key: "unknown",
  class: "content-card tab-unknown"
}, dc = /* @__PURE__ */ ee({
  __name: "SettingsPage",
  setup(L) {
    const { t: s } = te(), { confirm: _ } = Ce(), b = Le(), $ = _t(), k = et(), v = ct(), C = Ze(), E = Y(() => k.settingsTabs.map((m) => ({
      id: m.id,
      icon: m.icon || "chip"
    }))), c = Y(() => {
      const m = new Set(k.settingsTabs.map((n) => n.id)), p = new Set(k.removedSettingsIds);
      return $.sections.filter((n) => n.id !== "permissions" && !m.has(n.id) && !p.has(n.id)).map((n) => ({ id: n.id, icon: n.icon || "lock" }));
    }), u = Y(() => [...E.value, ...c.value]), o = P("general"), i = P(!1), d = P([]), g = P(null), y = P(""), h = P({}), w = P(""), S = P("ok"), I = P(!1), V = P(!1), z = P(""), U = P(!1), x = P([]), B = Y(() => s("settings.modelAuto")), q = Y(() => [
      { value: "", label: B.value },
      ...x.value.map((m) => ({ value: m, label: m }))
    ]);
    async function G() {
      try {
        const m = await fetch("/api/models");
        if (!m.ok) return;
        const p = await m.json();
        x.value = Array.from(new Set((p.models || []).map((n) => String(n.id || "")).filter(Boolean)));
      } catch {
      }
    }
    async function O(m) {
      V.value = !0, z.value = "";
      try {
        const p = await fetch(`/api/settings/${m}/test`, { method: "POST" }), n = p.headers.get("content-type") || "";
        if (p.ok && n.startsWith("audio")) {
          const T = URL.createObjectURL(await p.blob());
          try {
            await new Audio(T).play();
          } catch {
          }
          window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: T } })), z.value = s("settings.testSuccess");
        } else {
          const T = await p.json().catch(() => ({}));
          z.value = T.error || `HTTP ${p.status}`;
        }
      } catch (p) {
        z.value = p instanceof Error ? p.message : String(p);
      } finally {
        V.value = !1;
      }
    }
    const { tabMeta: A, isBuiltinTab: R, isPluginSection: fe, tabLabel: me, fieldLabel: re, fieldHelp: de, pluginSection: X } = De(), ye = Y(() => R(o.value) ? null : A(o.value)?.module || null);
    function ke(m, p) {
      const n = h.value[m]?.[p];
      return typeof n == "boolean" ? n : n === "true" || n === 1 || n === "1";
    }
    function ce(m) {
      if (A(m)?.fields?.length && !R(m)) {
        ge(m);
        return;
      }
      const n = X(m);
      if (!n) return;
      const T = {};
      for (const H of n.fields)
        H.type === "bool" ? T[H.key] = H.default_value === "true" || H.default_value === "1" : H.type === "number" ? T[H.key] = Number(H.default_value || 0) : T[H.key] = H.default_value || "";
      const Z = $.values[m] || {}, se = { ...T };
      for (const H of n.fields) {
        if (!(H.key in Z)) continue;
        const ne = Z[H.key];
        H.type === "bool" ? se[H.key] = ne === !0 || ne === "true" || ne === 1 || ne === "1" : se[H.key] = ne;
      }
      h.value = {
        ...h.value,
        [m]: se
      };
    }
    async function ge(m) {
      const p = A(m);
      if (!p?.fields?.length) return;
      const n = {};
      for (const T of p.fields)
        T.type === "bool" ? n[T.key] = T.default_value === "true" || T.default_value === "1" : T.type === "number" ? n[T.key] = Number(T.default_value || 0) : n[T.key] = T.default_value || "";
      if (p.loadApi)
        try {
          const T = await fetch(p.loadApi);
          if (T.ok) {
            const Z = await T.json();
            for (const se of p.fields) {
              if (!(se.key in Z)) continue;
              const H = Z[se.key];
              se.type === "bool" ? n[se.key] = H === !0 || H === "true" || H === 1 || H === "1" : n[se.key] = H;
            }
          }
        } catch {
        }
      h.value = { ...h.value, [m]: n };
    }
    async function Se(m) {
      const p = A(m);
      if (!I.value) {
        I.value = !0, w.value = "";
        try {
          const n = h.value[m] || {};
          if (p?.saveApi) {
            const T = await fetch(p.saveApi, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(n)
            });
            if (!T.ok) throw new Error(String(T.status));
          }
          w.value = s("settings.saved"), S.value = "ok", setTimeout(() => {
            w.value = "";
          }, 3e3);
        } catch {
          w.value = s("settings.permFailed"), S.value = "error";
        } finally {
          I.value = !1;
        }
      }
    }
    async function Pe(m) {
      if (!I.value) {
        I.value = !0, w.value = "";
        try {
          await $.saveValues(m, h.value[m] || {}), w.value = s("settings.saved"), S.value = "ok", setTimeout(() => {
            w.value = "";
          }, 3e3);
        } catch {
          w.value = s("settings.permFailed"), S.value = "error";
        } finally {
          I.value = !1;
        }
      }
    }
    async function we() {
      try {
        const m = await fetch("/api/live2d");
        if (m.ok) {
          const p = await m.json();
          d.value = p.models || [];
        }
      } catch {
        d.value = [];
      }
    }
    async function Ee(m) {
      if (await _({
        title: s("settings.live2d"),
        message: s("settings.deleteModelConfirm", { label: m.label }),
        confirmLabel: s("common.delete"),
        danger: !0
      }))
        try {
          const n = await fetch(`/api/live2d/${encodeURIComponent(m.id)}`, { method: "DELETE" });
          if (!n.ok) throw new Error(await n.text());
          const T = await n.json();
          d.value = T.models || [];
          const Z = m.url.slice(0, m.url.indexOf("/", 15) + 1);
          b.live2d.modelUrl.startsWith(Z) && (b.live2d.modelUrl = "", b.live2d.enabled = !1, b.saveToStorage()), await pe(), y.value = s("settings.modelDeleted"), window.dispatchEvent(new Event("live2d-models-changed"));
        } catch (n) {
          y.value = n.message;
        }
    }
    async function pe() {
      b.saveToStorage();
      const m = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: b.live2d.enabled, model_url: b.live2d.modelUrl } }) });
      if (!m.ok) throw new Error(await m.text());
    }
    async function Te() {
      if (!U.value) {
        U.value = !0, y.value = "";
        try {
          await pe(), y.value = s("settings.saved"), setTimeout(() => {
            y.value === s("settings.saved") && (y.value = "");
          }, 3e3);
        } catch (m) {
          y.value = m.message, je(s("settings.permFailed"), "error");
        } finally {
          U.value = !1;
        }
      }
    }
    function xe() {
      g.value?.click();
    }
    async function Ae(m) {
      const p = m.target, n = p.files;
      if (!(!n || n.length === 0)) {
        y.value = "";
        try {
          const T = new FormData(), Z = [];
          for (const ne of Array.from(n)) {
            const st = ne.webkitRelativePath || ne.name;
            Z.push(st), T.append("files", ne, ne.name);
          }
          T.append("paths", JSON.stringify(Z));
          const se = await fetch("/api/live2d", { method: "POST", body: T });
          if (!se.ok) throw new Error(await se.text());
          const H = await se.json();
          y.value = s("settings.uploadOk"), H?.models ? d.value = H.models : await we(), H?.model_url && (b.live2d.modelUrl = H.model_url, b.live2d.enabled = !0, b.saveToStorage(), await pe(), window.dispatchEvent(new Event("live2d-models-changed")));
        } catch (T) {
          y.value = `${s("settings.uploadFail")}：${T.message}`;
        } finally {
          p.value = "";
        }
      }
    }
    ae(async () => {
      b.loadFromStorage();
      const m = v.query.tab;
      m && (o.value = m), we(), G(), await $.fetchSections();
      for (const p of $.sections) ce(p.id);
      !u.value.some((p) => p.id === o.value) && !R(o.value) && (o.value = "general");
    });
    function Ne(m) {
      o.value = m, R(m) || ce(m), C.replace({ query: { tab: m } });
    }
    function f() {
      if (b.saveToStorage(), o.value === "live2d") {
        pe().then(() => {
          i.value = !0, setTimeout(() => {
            i.value = !1;
          }, 1500);
        }).catch((m) => {
          y.value = m.message, je(s("settings.permFailed"), "error");
        });
        return;
      }
      i.value = !0, setTimeout(() => {
        i.value = !1;
      }, 1500);
    }
    return (m, p) => (a(), r("div", Uu, [
      e("header", Eu, [
        e("div", null, [
          e("h1", null, l(t(s)("settings.title")), 1),
          e("p", Tu, l(t(s)("settings.pageDesc")), 1)
        ]),
        t(R)(o.value) && o.value !== "about" && o.value !== "updates" && o.value !== "danger" ? (a(), r("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: f
        }, [
          i.value ? (a(), r("span", Au, l(t(s)("settings.saved")), 1)) : (a(), r("span", Nu, l(t(s)("settings.save")), 1))
        ])) : M("", !0)
      ]),
      e("div", Vu, [
        e("nav", Ru, [
          (a(!0), r(F, null, J(u.value, (n) => (a(), r("button", {
            key: n.id,
            class: j(["nav-item", { active: o.value === n.id }]),
            "aria-current": o.value === n.id ? "true" : void 0,
            "data-tab-id": n.id,
            title: t(me)(n.id),
            "aria-label": t(me)(n.id),
            onClick: (T) => Ne(n.id)
          }, [
            p[18] || (p[18] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", Iu, [
              n.icon === "globe" ? (a(), r("svg", zu, [...p[6] || (p[6] = [
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
              ])])) : n.icon === "cloud" ? (a(), r("svg", Lu, [...p[7] || (p[7] = [
                e("path", {
                  d: "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])])) : n.icon === "chip" ? (a(), r("svg", Du, [...p[8] || (p[8] = [
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
              ])])) : n.icon === "person" ? (a(), r("svg", Fu, [...p[9] || (p[9] = [
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
              ])])) : n.icon === "avatar" ? (a(), r("svg", Bu, [...p[10] || (p[10] = [
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
              ])])) : n.icon === "brightness" ? (a(), r("svg", Ku, [...p[11] || (p[11] = [
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
              ])])) : n.icon === "warn" ? (a(), r("svg", Hu, [...p[12] || (p[12] = [
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
              ])])) : n.icon === "info" ? (a(), r("svg", ju, [...p[13] || (p[13] = [
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
              ])])) : n.icon === "download" ? (a(), r("svg", Yu, [...p[14] || (p[14] = [
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
              ])])) : n.icon === "shield" ? (a(), r("svg", Ju, [...p[15] || (p[15] = [
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
              ])])) : n.icon === "link" ? (a(), r("svg", Wu, [...p[16] || (p[16] = [
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
              ])])) : (a(), r("svg", qu, [...p[17] || (p[17] = [
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
            e("span", Gu, l(t(me)(n.id)), 1)
          ], 10, Ou))), 128))
        ]),
        e("section", Xu, [
          W(dt, {
            name: "tab",
            mode: "out-in"
          }, {
            default: Ie(() => [
              o.value === "general" ? (a(), le(ga, { key: "general" })) : o.value === "connection" ? (a(), le(Fa, { key: "connection" })) : o.value === "provider" ? (a(), r(F, { key: 2 }, [
                W(sa),
                t(X)("provider")?.fields?.length ? (a(), r("div", Zu, [
                  e("h3", null, l(t(X)("provider").label), 1),
                  t(X)("provider").description ? (a(), r("p", Qu, l(t(X)("provider").description), 1)) : M("", !0),
                  (a(!0), r(F, null, J(t(X)("provider").fields, (n) => (a(), r("div", {
                    key: n.key,
                    class: "field"
                  }, [
                    n.type === "bool" ? (a(), r("label", ed, [
                      e("input", {
                        type: "checkbox",
                        checked: ke("provider", n.key),
                        onChange: (T) => h.value = { ...h.value, provider: { ...h.value.provider, [n.key]: T.target.checked } }
                      }, null, 40, td),
                      p[19] || (p[19] = e("span", { class: "toggle-slider" }, null, -1)),
                      e("span", null, [
                        e("strong", null, l(n.label), 1),
                        n.help ? (a(), r("br", sd)) : M("", !0),
                        n.help ? (a(), r("small", ld, l(n.help), 1)) : M("", !0)
                      ])
                    ])) : n.type === "select" ? (a(), r(F, { key: 1 }, [
                      e("label", null, l(n.label), 1),
                      W(t(ue), {
                        class: "input",
                        "aria-label": n.label,
                        "model-value": String(h.value.provider?.[n.key] ?? ""),
                        options: n.options || [],
                        "onUpdate:modelValue": (T) => h.value = { ...h.value, provider: { ...h.value.provider, [n.key]: T } }
                      }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                      n.help ? (a(), r("p", od, l(n.help), 1)) : M("", !0)
                    ], 64)) : (a(), r(F, { key: 2 }, [
                      e("label", null, l(n.label), 1),
                      e("input", {
                        class: "input",
                        type: n.type === "number" ? "number" : "text",
                        value: h.value.provider?.[n.key],
                        onInput: (T) => h.value = { ...h.value, provider: { ...h.value.provider, [n.key]: n.type === "number" ? Number(T.target.value) : T.target.value } }
                      }, null, 40, nd),
                      n.help ? (a(), r("p", ad, l(n.help), 1)) : M("", !0)
                    ], 64))
                  ]))), 128)),
                  w.value ? (a(), r("div", {
                    key: 1,
                    class: j(["helper-text", S.value === "error" ? "msg-error" : "msg-success"]),
                    role: "status"
                  }, l(w.value), 3)) : M("", !0),
                  e("div", id, [
                    e("button", {
                      class: "btn btn-primary",
                      type: "button",
                      disabled: I.value,
                      onClick: p[0] || (p[0] = (n) => Pe("provider"))
                    }, l(t(s)("settings.save")), 9, rd)
                  ])
                ])) : M("", !0)
              ], 64)) : o.value === "persona" ? (a(), le(ni, { key: 3 })) : o.value === "live2d" ? (a(), r("div", ud, [
                e("h2", null, l(t(me)("live2d")), 1),
                e("p", dd, l(t(A)("live2d")?.descriptionKey ? t(s)(t(A)("live2d").descriptionKey) : t(s)("settings.live2dDesc")), 1),
                W(bt, { class: "live2d-preview" }),
                e("label", cd, [
                  N(e("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": p[1] || (p[1] = (n) => t(b).live2d.enabled = n)
                  }, null, 512), [
                    [Q, t(b).live2d.enabled]
                  ]),
                  p[20] || (p[20] = e("span", { class: "toggle-slider" }, null, -1)),
                  e("span", null, l(t(s)("wizard.enableLive2d")), 1)
                ]),
                e("div", pd, [
                  e("label", null, l(t(s)("wizard.modelUrl")), 1),
                  e("div", hd, [
                    (a(!0), r(F, null, J(t(gt), (n) => (a(), r("label", {
                      key: n.id,
                      class: j(["model-choice", { selected: t(b).live2d.modelUrl === n.url }])
                    }, [
                      e("input", {
                        type: "radio",
                        name: "live2d-model",
                        value: n.url,
                        checked: t(b).live2d.modelUrl === n.url,
                        onChange: (T) => {
                          t(b).live2d.modelUrl = n.url, t(b).live2d.enabled = !0;
                        }
                      }, null, 40, vd),
                      e("span", null, l(n.label), 1),
                      e("code", null, l(n.url), 1)
                    ], 2))), 128))
                  ]),
                  N(e("input", {
                    "onUpdate:modelValue": p[2] || (p[2] = (n) => t(b).live2d.modelUrl = n),
                    placeholder: t(s)("wizard.modelUrlPlaceholder"),
                    class: "input"
                  }, null, 8, md), [
                    [D, t(b).live2d.modelUrl]
                  ]),
                  e("p", _d, [
                    oe(l(t(s)("wizard.live2dHelp")) + " ", 1),
                    e("a", gd, l(t(s)("wizard.live2dSamples")), 1)
                  ])
                ]),
                e("p", bd, l(t(s)("settings.live2dHelper")), 1),
                e("button", {
                  class: "btn btn-tonal",
                  disabled: U.value,
                  onClick: Te
                }, l(U.value ? t(s)("settings.saving") : t(s)("settings.saveLife2d")), 9, fd),
                e("div", yd, [
                  e("label", null, l(t(s)("settings.uploadFolder")), 1),
                  e("label", {
                    class: "upload-area",
                    onClick: Oe(xe, ["prevent"])
                  }, [
                    e("span", null, l(t(s)("settings.uploadFolderHint")), 1)
                  ]),
                  e("input", {
                    ref_key: "folderInput",
                    ref: g,
                    type: "file",
                    webkitdirectory: "",
                    directory: "",
                    multiple: "",
                    class: "file-input",
                    onChange: Ae
                  }, null, 544),
                  y.value ? (a(), r("p", kd, l(y.value), 1)) : M("", !0),
                  d.value.length ? (a(), r("div", wd, [
                    (a(!0), r(F, null, J(d.value, (n) => (a(), r("label", {
                      key: n.id,
                      class: j(["model-choice", { selected: t(b).live2d.modelUrl === n.url }])
                    }, [
                      e("input", {
                        type: "radio",
                        name: "live2d-uploaded",
                        value: n.url,
                        checked: t(b).live2d.modelUrl === n.url,
                        onChange: (T) => {
                          t(b).live2d.modelUrl = n.url, t(b).live2d.enabled = !0, pe().catch((Z) => y.value = Z.message);
                        }
                      }, null, 40, $d),
                      e("span", null, l(n.label), 1),
                      e("code", null, l(n.url), 1),
                      e("button", {
                        type: "button",
                        class: "btn btn-danger",
                        onClick: Oe((T) => Ee(n), ["prevent"])
                      }, l(t(s)("settings.deleteModel")), 9, Cd)
                    ], 2))), 128))
                  ])) : M("", !0)
                ])
              ])) : o.value === "security" ? (a(), le(tr, { key: 5 })) : o.value === "permissions" ? (a(), le(gi, { key: 6 })) : o.value === "mcp" ? (a(), le(uu, { key: 7 })) : o.value === "life_settings" ? (a(), le(Es, { key: 8 })) : t(fe)(o.value) && t(X)(o.value) ? (a(), r("div", {
                key: `section-${o.value}`,
                class: "content-card"
              }, [
                e("h2", null, l(t(X)(o.value).label), 1),
                t(X)(o.value).description ? (a(), r("p", Sd, l(t(X)(o.value).description), 1)) : M("", !0),
                t(X)(o.value).plugin_name ? (a(), r("p", Pd, l(t(X)(o.value).plugin_name), 1)) : M("", !0),
                (a(!0), r(F, null, J(t(X)(o.value).fields, (n) => (a(), r("div", {
                  key: n.key,
                  class: "field"
                }, [
                  n.type === "bool" ? (a(), r("label", xd, [
                    e("input", {
                      type: "checkbox",
                      checked: ke(o.value, n.key),
                      onChange: (T) => h.value = { ...h.value, [o.value]: { ...h.value[o.value], [n.key]: T.target.checked } }
                    }, null, 40, Md),
                    p[21] || (p[21] = e("span", { class: "toggle-slider" }, null, -1)),
                    e("span", null, [
                      e("strong", null, l(n.label), 1),
                      n.help ? (a(), r("br", Ud)) : M("", !0),
                      n.help ? (a(), r("small", Ed, l(n.help), 1)) : M("", !0)
                    ])
                  ])) : n.type === "select" ? (a(), r(F, { key: 1 }, [
                    e("label", null, l(n.label), 1),
                    W(t(ue), {
                      class: "input",
                      "aria-label": n.label,
                      "model-value": String(h.value[o.value]?.[n.key] ?? ""),
                      options: n.options || [],
                      "onUpdate:modelValue": (T) => h.value[o.value] = { ...h.value[o.value], [n.key]: T }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    n.help ? (a(), r("p", Td, l(n.help), 1)) : M("", !0)
                  ], 64)) : n.type === "model" ? (a(), r(F, { key: 2 }, [
                    e("label", null, l(n.label), 1),
                    W(t(ue), {
                      class: "input",
                      "aria-label": n.label,
                      "model-value": String(h.value[o.value]?.[n.key] ?? ""),
                      options: q.value,
                      "onUpdate:modelValue": (T) => h.value[o.value] = { ...h.value[o.value], [n.key]: T }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    n.help ? (a(), r("p", Ad, l(n.help), 1)) : M("", !0)
                  ], 64)) : n.type === "models" ? (a(), r(F, { key: 3 }, [
                    e("label", null, l(n.label), 1),
                    W(qe, {
                      "model-value": String(h.value[o.value]?.[n.key] ?? ""),
                      options: x.value,
                      "onUpdate:modelValue": (T) => h.value[o.value] = { ...h.value[o.value], [n.key]: T }
                    }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                    n.help ? (a(), r("p", Nd, l(n.help), 1)) : M("", !0)
                  ], 64)) : n.type === "test" ? (a(), r(F, { key: 4 }, [
                    e("label", null, l(n.label), 1),
                    e("div", Vd, [
                      e("button", {
                        class: "btn btn-tonal",
                        type: "button",
                        disabled: V.value,
                        onClick: p[3] || (p[3] = (T) => O(o.value))
                      }, l(V.value ? t(s)("settings.testing") : n.label || t(s)("settings.test")), 9, Rd),
                      z.value ? (a(), r("span", Od, l(z.value), 1)) : M("", !0)
                    ]),
                    n.help ? (a(), r("p", Id, l(n.help), 1)) : M("", !0)
                  ], 64)) : (a(), r(F, { key: 5 }, [
                    e("label", null, l(n.label), 1),
                    e("input", {
                      class: "input",
                      type: n.type === "number" ? "number" : "text",
                      value: h.value[o.value]?.[n.key],
                      onInput: (T) => h.value[o.value] = { ...h.value[o.value], [n.key]: n.type === "number" ? Number(T.target.value) : T.target.value }
                    }, null, 40, zd),
                    n.help ? (a(), r("p", Ld, l(n.help), 1)) : M("", !0)
                  ], 64))
                ]))), 128)),
                w.value ? (a(), r("div", {
                  key: 2,
                  class: j(["helper-text", S.value === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, l(w.value), 3)) : M("", !0),
                e("div", Dd, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: I.value,
                    onClick: p[4] || (p[4] = (n) => Pe(o.value))
                  }, l(t(s)("settings.save")), 9, Fd)
                ])
              ])) : ye.value ? (a(), le(bu, {
                key: ye.value,
                module: ye.value || ""
              }, null, 8, ["module"])) : !t(R)(o.value) && t(A)(o.value)?.fields?.length ? (a(), r("div", {
                key: `patch-${o.value}`,
                class: "content-card"
              }, [
                e("h2", null, l(t(me)(o.value)), 1),
                t(A)(o.value)?.descriptionKey ? (a(), r("p", Bd, l(t(s)(t(A)(o.value).descriptionKey)), 1)) : t(A)(o.value)?.description ? (a(), r("p", Kd, l(t(A)(o.value).description), 1)) : M("", !0),
                (a(!0), r(F, null, J(t(A)(o.value).fields, (n) => (a(), r("div", {
                  key: n.key,
                  class: "field"
                }, [
                  n.type === "bool" ? (a(), r("label", Hd, [
                    e("input", {
                      type: "checkbox",
                      checked: ke(o.value, n.key),
                      onChange: (T) => h.value = { ...h.value, [o.value]: { ...h.value[o.value], [n.key]: T.target.checked } }
                    }, null, 40, jd),
                    p[22] || (p[22] = e("span", { class: "toggle-slider" }, null, -1)),
                    e("span", null, [
                      e("strong", null, l(t(re)(t(A)(o.value), n.key, `settings.${n.key}`)), 1),
                      n.help || n.helpKey ? (a(), r("br", Yd)) : M("", !0),
                      n.help || n.helpKey ? (a(), r("small", Jd, l(t(de)(t(A)(o.value), n.key, `settings.${n.key}Desc`)), 1)) : M("", !0)
                    ])
                  ])) : n.type === "select" ? (a(), r(F, { key: 1 }, [
                    e("label", null, l(t(re)(t(A)(o.value), n.key, `settings.${n.key}`)), 1),
                    W(t(ue), {
                      class: "input",
                      "aria-label": t(re)(t(A)(o.value), n.key, `settings.${n.key}`),
                      "model-value": String(h.value[o.value]?.[n.key] ?? ""),
                      options: n.options || [],
                      "onUpdate:modelValue": (T) => h.value[o.value] = { ...h.value[o.value], [n.key]: T }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    n.help || n.helpKey ? (a(), r("p", Wd, l(t(de)(t(A)(o.value), n.key, `settings.${n.key}Desc`)), 1)) : M("", !0)
                  ], 64)) : n.type === "model" ? (a(), r(F, { key: 2 }, [
                    e("label", null, l(t(re)(t(A)(o.value), n.key, `settings.${n.key}`)), 1),
                    W(t(ue), {
                      class: "input",
                      "aria-label": t(re)(t(A)(o.value), n.key, `settings.${n.key}`),
                      "model-value": String(h.value[o.value]?.[n.key] ?? ""),
                      options: q.value,
                      "onUpdate:modelValue": (T) => h.value[o.value] = { ...h.value[o.value], [n.key]: T }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    n.help || n.helpKey ? (a(), r("p", qd, l(t(de)(t(A)(o.value), n.key, `settings.${n.key}Desc`)), 1)) : M("", !0)
                  ], 64)) : n.type === "models" ? (a(), r(F, { key: 3 }, [
                    e("label", null, l(t(re)(t(A)(o.value), n.key, `settings.${n.key}`)), 1),
                    W(qe, {
                      "model-value": String(h.value[o.value]?.[n.key] ?? ""),
                      options: x.value,
                      "onUpdate:modelValue": (T) => h.value[o.value] = { ...h.value[o.value], [n.key]: T }
                    }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                    n.help || n.helpKey ? (a(), r("p", Gd, l(t(de)(t(A)(o.value), n.key, `settings.${n.key}Desc`)), 1)) : M("", !0)
                  ], 64)) : (a(), r(F, { key: 4 }, [
                    e("label", null, l(t(re)(t(A)(o.value), n.key, `settings.${n.key}`)), 1),
                    e("input", {
                      class: "input",
                      type: n.type === "number" ? "number" : "text",
                      value: h.value[o.value]?.[n.key],
                      onInput: (T) => h.value[o.value] = { ...h.value[o.value], [n.key]: n.type === "number" ? Number(T.target.value) : T.target.value }
                    }, null, 40, Xd),
                    n.help || n.helpKey ? (a(), r("p", Zd, l(t(de)(t(A)(o.value), n.key, `settings.${n.key}Desc`)), 1)) : M("", !0)
                  ], 64))
                ]))), 128)),
                w.value ? (a(), r("div", {
                  key: 2,
                  class: j(["helper-text", S.value === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, l(w.value), 3)) : M("", !0),
                e("div", Qd, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: I.value,
                    onClick: p[5] || (p[5] = (n) => Se(o.value))
                  }, l(t(s)("settings.save")), 9, ec)
                ])
              ])) : o.value === "about" ? (a(), le(Ol, { key: "about" })) : o.value === "updates" ? (a(), le(Mo, { key: "updates" })) : o.value === "danger" ? (a(), le(vu, { key: "danger" })) : (a(), r("div", tc, [
                e("p", null, l(t(s)("settings.tabNotFound")), 1)
              ]))
            ]),
            _: 1
          })
        ])
      ])
    ]));
  }
});
export {
  dc as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent="@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage[data-v-15b509be]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-15b509be]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-15b509be]:active{cursor:grabbing}.stage-canvas[data-v-15b509be]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-15b509be]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-15b509be]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-15b509be]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-15b509be]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-15b509be]:active{transform:scale(.96)}.stage-reset.dragging[data-v-15b509be]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-15b509be]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-15b509be]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-15b509be]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-e199848c]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-e199848c]{flex-direction:row-reverse}.avatar[data-v-e199848c]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-e199848c]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-e199848c]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-e199848c]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-e199848c]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-e199848c]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-e199848c]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden}.msg-file-name[data-v-e199848c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-e199848c]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-e199848c]{max-width:70%}.content[data-v-e199848c]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.content-markdown[data-v-e199848c]{white-space:normal}.user .content[data-v-e199848c]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-e199848c]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-e199848c]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-e199848c]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-e199848c]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-e199848c]{margin:4px 0}.think-body b[data-v-e199848c]{color:var(--md-on-surface)}.think-summary[data-v-e199848c]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-e199848c]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-e199848c]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-e199848c]{justify-content:flex-end}.separator[data-v-e199848c]{color:var(--neutral-gray-10)}.emotion[data-v-e199848c]{font-weight:500}.chat-panel[data-v-8a0e76e2]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-8a0e76e2]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-8a0e76e2]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-8a0e76e2]{color:var(--md-error)}.chat-container[data-v-8a0e76e2]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-8a0e76e2]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-8a0e76e2]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-8a0e76e2]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-8a0e76e2]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-8a0e76e2]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-8a0e76e2]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-8a0e76e2]{display:flex;gap:4px}.typing-dots span[data-v-8a0e76e2]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-8a0e76e2 1.4s infinite ease-in-out}.typing-dots span[data-v-8a0e76e2]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-8a0e76e2]:nth-child(2){animation-delay:-.16s}@keyframes bounce-8a0e76e2{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-8a0e76e2]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-8a0e76e2]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-8a0e76e2]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-8a0e76e2]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-8a0e76e2]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-8a0e76e2],.pending-files[data-v-8a0e76e2]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-8a0e76e2]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden}.pending-file-name[data-v-8a0e76e2]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-8a0e76e2]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-8a0e76e2]:hover{color:var(--error)}.pending-thumb[data-v-8a0e76e2]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-8a0e76e2]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-8a0e76e2]{position:absolute;top:2px;right:2px;width:22px;height:22px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.pending-thumb.uploading[data-v-8a0e76e2]{display:flex;align-items:center;justify-content:center;background:var(--md-surface-container-high);animation:thumb-shimmer-8a0e76e2 1.2s infinite}.upload-spinner[data-v-8a0e76e2]{width:18px;height:18px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:upload-spin-8a0e76e2 .8s linear infinite}@keyframes upload-spin-8a0e76e2{to{transform:rotate(360deg)}}@keyframes thumb-shimmer-8a0e76e2{0%,to{opacity:1}50%{opacity:.55}}@media(prefers-reduced-motion:reduce){.pending-thumb.uploading[data-v-8a0e76e2]{animation:none}}.attach-btn[data-v-8a0e76e2]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-8a0e76e2]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-8a0e76e2]:disabled{opacity:.5;cursor:not-allowed}.wake-btn.active[data-v-8a0e76e2]{color:var(--md-primary);background:color-mix(in srgb,var(--md-primary) 14%,transparent)}.wake-strip[data-v-8a0e76e2]{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:5px 10px;border-radius:var(--radius-md, 10px);background:color-mix(in srgb,var(--md-primary) 10%,transparent);color:var(--md-primary);font-size:12px}.wake-strip.capturing[data-v-8a0e76e2]{background:color-mix(in srgb,var(--md-primary) 18%,transparent)}.wake-dot[data-v-8a0e76e2]{width:8px;height:8px;border-radius:50%;background:currentColor;animation:wake-pulse-8a0e76e2 1.1s ease-in-out infinite}.wake-strip.capturing .wake-dot[data-v-8a0e76e2]{animation-duration:.5s}.wake-text[data-v-8a0e76e2]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wake-stop[data-v-8a0e76e2]{border:none;background:transparent;color:inherit;cursor:pointer;font-size:15px;line-height:1;padding:0 2px;opacity:.75}.wake-stop[data-v-8a0e76e2]:hover{opacity:1}@keyframes wake-pulse-8a0e76e2{0%,to{opacity:1}50%{opacity:.2}}@media(prefers-reduced-motion:reduce){.wake-dot[data-v-8a0e76e2]{animation:none}}.send-button[data-v-8a0e76e2]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-8a0e76e2]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-8a0e76e2]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-8a0e76e2]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-8a0e76e2]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-8a0e76e2]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-8a0e76e2]{background:var(--success)}.disconnected .status-dot[data-v-8a0e76e2]{background:var(--error)}.hint[data-v-8a0e76e2]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-45331204]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-45331204]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-45331204]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-45331204]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-45331204]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-45331204]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-45331204]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-45331204]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-45331204]{margin-bottom:var(--space-xl)}.section-header[data-v-45331204]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-45331204]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.mood-display[data-v-45331204]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-45331204]{margin-bottom:var(--space-md)}.mood-label[data-v-45331204]{font-size:var(--font-size-md);font-weight:600}.emotion-bars[data-v-45331204]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-45331204]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-45331204]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-45331204]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-45331204]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-45331204]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.chat-page[data-v-599f785f]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-599f785f]{grid-template-columns:1fr}.stage-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-599f785f]{flex:1;min-height:240px}.status-panel[data-v-599f785f]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-599f785f]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-599f785f]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-599f785f]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-599f785f]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-599f785f]:hover,.page-resizer[data-v-599f785f]:active{background:var(--md-primary)}.chat-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-599f785f]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-599f785f]{display:flex;flex-direction:column}.stage-column[data-v-599f785f]{flex:1;min-height:0}.page-resizer[data-v-599f785f]{display:none}.chat-column[data-v-599f785f]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);visibility:hidden;transition:transform var(--transition-normal),visibility 0s linear var(--duration-medium)}.chat-column.open[data-v-599f785f]{transform:translate(0);visibility:visible;transition:transform var(--transition-normal),visibility 0s linear 0s}}.console[data-v-940c88b5]{display:flex;flex-direction:column;min-height:0;height:100%;background:var(--md-surface);color:var(--md-on-surface)}.pane-enter-active[data-v-940c88b5]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel)}.pane-leave-active[data-v-940c88b5]{transition:opacity var(--duration-instant) var(--ease-emphasized-accel)}.pane-enter-from[data-v-940c88b5],.pane-leave-to[data-v-940c88b5]{opacity:0}@media(prefers-reduced-motion:reduce){.pane-enter-active[data-v-940c88b5],.pane-leave-active[data-v-940c88b5]{transition-duration:1ms}}.console-bar[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:flex-end;gap:var(--space-md);padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.tabs[data-v-940c88b5]{display:flex;gap:var(--space-xs)}.tab[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:0 14px;border:0;border-radius:var(--radius-full);background:transparent;color:var(--md-on-surface-variant);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}.tab[data-v-940c88b5]:hover{background:color-mix(in srgb,var(--md-on-surface) 7%,transparent)}.tab.active[data-v-940c88b5]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tab[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.tab-badge[data-v-940c88b5]{min-width:18px;padding:0 5px;border-radius:var(--radius-full);background:var(--md-error-container);color:var(--md-on-error-container);font-size:11px;font-weight:700;text-align:center}.controls[data-v-940c88b5]{display:flex;flex:1;flex-wrap:wrap;align-items:flex-end;gap:var(--space-sm)}.field[data-v-940c88b5]{display:flex;flex-direction:column;gap:2px}.field.grow[data-v-940c88b5]{flex:1;min-width:180px}.field-label[data-v-940c88b5]{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant)}.input[data-v-940c88b5]{min-height:34px;padding:0 10px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-sm);background:var(--md-surface-container-lowest);color:inherit;font:inherit;font-size:13px}.input[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:1px}.check[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap}.btn[data-v-940c88b5]{min-height:34px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast)}.btn[data-v-940c88b5]:hover:not(:disabled){background:var(--md-surface-container-high)}.btn[data-v-940c88b5]:disabled{opacity:.5;cursor:default}.btn[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.status[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);white-space:nowrap}.status .dot[data-v-940c88b5]{width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.status.live .dot[data-v-940c88b5]{background:var(--md-success);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-success) 22%,transparent)}.status.dead .dot[data-v-940c88b5]{background:var(--md-error)}.banner[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-sm);margin:0;padding:var(--space-sm) var(--space-lg);background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px}.banner code[data-v-940c88b5]{flex:1;min-width:0;overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.pane[data-v-940c88b5]{flex:1;min-height:0;overflow:auto}.empty[data-v-940c88b5]{padding:var(--space-xl);color:var(--md-on-surface-variant);font-size:13px}.rows[data-v-940c88b5]{margin:0;padding:0;list-style:none;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,monospace;font-size:12px;line-height:1.55}.row[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;padding:3px var(--space-lg);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.row[data-v-940c88b5]:hover{background:color-mix(in srgb,var(--md-on-surface) 4%,transparent)}.row[data-v-940c88b5]:before{content:\"\";width:3px;align-self:stretch;margin:1px 0;border-radius:2px;background:var(--md-outline)}.row.debug[data-v-940c88b5]:before{background:var(--md-outline)}.row.info[data-v-940c88b5]:before{background:var(--md-primary)}.row.warn[data-v-940c88b5]:before{background:var(--md-warning)}.row.error[data-v-940c88b5]:before{background:var(--md-error)}.row.ok[data-v-940c88b5]:before{background:var(--md-success)}.ts[data-v-940c88b5]{color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.lvl[data-v-940c88b5]{min-width:46px;font-weight:700;color:var(--md-on-surface-variant);white-space:nowrap}.row.warn .lvl[data-v-940c88b5]{color:var(--md-warning)}.row.error .lvl[data-v-940c88b5]{color:var(--md-error)}.component[data-v-940c88b5]{min-width:96px;padding:0 6px;border-radius:var(--radius-sm);background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.msg[data-v-940c88b5]{flex:1;min-width:200px;word-break:break-word}.kv[data-v-940c88b5]{color:var(--md-on-surface-variant);white-space:nowrap}.kv .k[data-v-940c88b5]{opacity:.7}.kv .v[data-v-940c88b5]{color:var(--md-on-surface)}.err[data-v-940c88b5]{color:var(--md-error)}.event[data-v-940c88b5]{padding:0 6px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.dur[data-v-940c88b5]{margin-left:auto;color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.indent[data-v-940c88b5]{flex:none}.link[data-v-940c88b5]{padding:0;border:0;background:none;color:var(--md-primary);font:inherit;font-size:11px;cursor:pointer;text-decoration:underline dotted}.link[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}@media(max-width:720px){.console-bar[data-v-940c88b5]{align-items:stretch}.controls[data-v-940c88b5]{flex-direction:column;align-items:stretch}.component[data-v-940c88b5],.lvl[data-v-940c88b5]{min-width:0}}#app .console[data-v-940c88b5] :is(.tab,.btn){min-height:34px;border-radius:var(--radius-full)}#app .console .input[data-v-940c88b5]{min-height:34px;border-radius:var(--radius-sm)}.plugins-page[data-v-147ee65e]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-147ee65e]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-147ee65e]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-147ee65e],.pp-hero h1[data-v-147ee65e]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-147ee65e]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-147ee65e]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-147ee65e]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.banner-enter-active[data-v-147ee65e]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}.banner-leave-active[data-v-147ee65e]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.banner-enter-from[data-v-147ee65e],.banner-leave-to[data-v-147ee65e]{opacity:0;transform:translateY(-6px)}.pp-stats[data-v-147ee65e]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-147ee65e]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-147ee65e]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-147ee65e]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-147ee65e]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-147ee65e]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-147ee65e]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-147ee65e]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-147ee65e]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-147ee65e var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-147ee65e{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-147ee65e]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-147ee65e]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-147ee65e]{opacity:.62}.plugin-top[data-v-147ee65e]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-147ee65e]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-147ee65e]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-147ee65e]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-147ee65e]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-147ee65e]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-147ee65e]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-147ee65e]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-147ee65e]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-147ee65e]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-147ee65e]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-147ee65e]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-147ee65e]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-147ee65e]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-147ee65e]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-147ee65e]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-147ee65e]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-147ee65e]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-147ee65e]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-147ee65e]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-147ee65e]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-147ee65e]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-147ee65e]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-147ee65e]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-147ee65e]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-147ee65e]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-147ee65e]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-147ee65e]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-147ee65e]{white-space:nowrap}#app .plugins-page .btn[data-v-147ee65e]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-147ee65e]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-147ee65e]:disabled{opacity:.6;cursor:not-allowed}.empty-state[data-v-147ee65e]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-147ee65e]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-147ee65e]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-147ee65e]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-147ee65e]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-147ee65e]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-147ee65e]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-147ee65e],.pd-leave-to[data-v-147ee65e]{opacity:0}.pd-enter-active .pd-dialog[data-v-147ee65e]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-147ee65e]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-147ee65e],.pd-leave-to .pd-dialog[data-v-147ee65e]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-147ee65e]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-147ee65e]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-147ee65e]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-147ee65e]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-147ee65e]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-147ee65e]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-147ee65e]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-147ee65e]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-147ee65e]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-147ee65e]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-147ee65e]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-147ee65e]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-147ee65e]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-147ee65e]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-147ee65e]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-147ee65e]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-147ee65e]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-147ee65e]{color:var(--md-error)}.pd-foot[data-v-147ee65e]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-147ee65e]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn[data-v-147ee65e]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-147ee65e],.pd-leave-active[data-v-147ee65e],.pd-enter-active .pd-dialog[data-v-147ee65e],.pd-leave-active .pd-dialog[data-v-147ee65e]{transition:none}.pd-enter-from .pd-dialog[data-v-147ee65e],.pd-leave-to .pd-dialog[data-v-147ee65e]{transform:none}}.life-settings[data-v-f79f46a2]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-f79f46a2]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-f79f46a2 .52s var(--ls-spring) both}.ls-hero-main[data-v-f79f46a2]{min-width:0}.ls-eyebrow[data-v-f79f46a2]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-f79f46a2]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-f79f46a2]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-f79f46a2]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-f79f46a2]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-f79f46a2]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-f79f46a2]{font-size:16px}.ls-grid[data-v-f79f46a2]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-f79f46a2]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-f79f46a2 .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-f79f46a2]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-f79f46a2]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-f79f46a2]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-f79f46a2]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-f79f46a2]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-f79f46a2]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-f79f46a2]{grid-column:1 / -1}.ls-card-head[data-v-f79f46a2]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-f79f46a2]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-f79f46a2]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-f79f46a2]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-f79f46a2]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-f79f46a2]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-f79f46a2]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-f79f46a2]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-f79f46a2]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-f79f46a2]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-f79f46a2]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-f79f46a2]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-f79f46a2]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-f79f46a2]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-f79f46a2]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-f79f46a2]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-f79f46a2]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-f79f46a2]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-f79f46a2]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-f79f46a2]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-f79f46a2]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-f79f46a2]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-f79f46a2]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-f79f46a2]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-f79f46a2]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-f79f46a2]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-f79f46a2]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-f79f46a2]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-f79f46a2]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-f79f46a2]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-f79f46a2]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-f79f46a2]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-f79f46a2]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-f79f46a2]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}#app .ls-model[data-v-f79f46a2]{border-radius:20px}#app .ls-model.selected[data-v-f79f46a2]{border-radius:20px 20px 20px 8px}.ls-model b[data-v-f79f46a2]{font-size:13px;word-break:break-all}.ls-model span[data-v-f79f46a2]{font-size:12px;color:var(--md-on-surface-variant)}.ls-hint[data-v-f79f46a2]{margin:12px 0 0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.ls-state[data-v-f79f46a2]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-f79f46a2 .32s var(--ls-spring) both}@keyframes ls-rise-f79f46a2{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-f79f46a2{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-f79f46a2],.ls-row[data-v-f79f46a2],.ls-models[data-v-f79f46a2]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-f79f46a2],.ls-card[data-v-f79f46a2],.ls-state[data-v-f79f46a2]{animation:none}}.about[data-v-da8c447d]{display:flex;flex-direction:column;gap:26px}.identity[data-v-da8c447d]{display:flex;align-items:center;gap:16px}.app-icon[data-v-da8c447d]{flex:none;width:56px;height:56px;filter:drop-shadow(0 6px 16px color-mix(in srgb,var(--md-primary) 25%,transparent))}.app-id[data-v-da8c447d]{flex:1;min-width:0}.app-id h2[data-v-da8c447d]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-da8c447d]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-da8c447d]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-da8c447d]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-da8c447d]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-da8c447d]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-da8c447d]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-da8c447d]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.credits[data-v-da8c447d]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-da8c447d]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-da8c447d]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-da8c447d]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-da8c447d]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-da8c447d]{font-size:16px;font-weight:650}.person-info .role[data-v-da8c447d]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-da8c447d]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-da8c447d]{margin-top:6px}.contribs[data-v-da8c447d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-da8c447d]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-da8c447d]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-da8c447d]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-da8c447d]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-da8c447d]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-da8c447d]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-da8c447d]{margin-left:auto}.status-chip[data-v-da8c447d]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-da8c447d]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-da8c447d]:hover{text-decoration:underline}.muted[data-v-da8c447d]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-da8c447d]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-da8c447d]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-hero.warn[data-v-da8c447d]{background:var(--md-warning-container);color:var(--md-on-warning-container);border-color:transparent}.us-hero.none[data-v-da8c447d]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-da8c447d]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-da8c447d]{flex:1;min-width:0}.us-hero-text b[data-v-da8c447d]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-da8c447d]{font-size:13px;opacity:.85}.us-hero-text em[data-v-da8c447d]{font-style:normal;font-weight:700}.us-hero-actions[data-v-da8c447d]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-da8c447d]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-da8c447d]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-da8c447d]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-da8c447d]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-da8c447d]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-da8c447d]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-apply-banner.failed[data-v-da8c447d]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-da8c447d]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-da8c447d]{font-weight:700}.us-apply-label[data-v-da8c447d]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-da8c447d]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-da8c447d]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-da8c447d]{animation:us-spin-da8c447d .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-da8c447d],.us-apply-banner.failed .us-spinner[data-v-da8c447d]{display:none}.us-apply-log[data-v-da8c447d],.us-apply-error[data-v-da8c447d]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-da8c447d{to{transform:rotate(360deg)}}.alert[data-v-da8c447d]{color:var(--md-error)}.updates[data-v-95a0aad4]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-95a0aad4]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-95a0aad4]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-95a0aad4]{display:flex;align-items:center;gap:12px}.us-ico[data-v-95a0aad4]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-95a0aad4]{flex:1;min-width:0}.us-title[data-v-95a0aad4]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-95a0aad4]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-95a0aad4]{display:flex;align-items:center;gap:8px}.us-tag[data-v-95a0aad4]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-95a0aad4]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-95a0aad4]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-95a0aad4]{background:#ffdf9e;color:#4a3800}.us-source[data-v-95a0aad4]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-95a0aad4]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-95a0aad4]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-95a0aad4]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-95a0aad4]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-95a0aad4]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-95a0aad4]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-95a0aad4]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-95a0aad4]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-95a0aad4]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-95a0aad4]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-95a0aad4]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-95a0aad4]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-95a0aad4]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-95a0aad4]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-95a0aad4]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-95a0aad4]{flex:1;min-width:0}.us-hero-text b[data-v-95a0aad4]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-95a0aad4]{font-size:13px;opacity:.85}.us-hero-text em[data-v-95a0aad4]{font-style:normal;font-weight:700}.us-hero-actions[data-v-95a0aad4]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-95a0aad4]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-95a0aad4]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-95a0aad4]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-95a0aad4]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-95a0aad4]{font-weight:700}.us-apply-label[data-v-95a0aad4]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-95a0aad4]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-95a0aad4]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-95a0aad4]{animation:us-spin-95a0aad4 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-95a0aad4],.us-apply-banner.failed .us-spinner[data-v-95a0aad4]{display:none}.us-apply-log[data-v-95a0aad4],.us-apply-error[data-v-95a0aad4]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-95a0aad4{to{transform:rotate(360deg)}}.us-table[data-v-95a0aad4]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-95a0aad4]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-95a0aad4]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-95a0aad4]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-95a0aad4]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden}.us-name-text[data-v-95a0aad4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-95a0aad4]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-95a0aad4]{background:var(--md-success)}.us-dot.warn[data-v-95a0aad4]{background:#e0a800}.us-dot.bad[data-v-95a0aad4]{background:var(--md-error)}.us-ver[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-95a0aad4]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-95a0aad4]{font-weight:650}.us-ver b.good[data-v-95a0aad4]{color:var(--md-success)}.us-arrow[data-v-95a0aad4]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-95a0aad4]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden}.us-status-text[data-v-95a0aad4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-95a0aad4]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-95a0aad4]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-95a0aad4]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-95a0aad4]:hover{text-decoration:underline}.us-empty[data-v-95a0aad4]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-95a0aad4]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-95a0aad4]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.alert[data-v-95a0aad4]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-95a0aad4]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-95a0aad4]{display:none}.us-hero[data-v-95a0aad4]{flex-wrap:wrap}.us-hero-actions[data-v-95a0aad4]{width:100%}}.provider-panel[data-v-d93aed7e]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-d93aed7e]{display:flex;align-items:center;gap:14px}.pp-back[data-v-d93aed7e]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-d93aed7e]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-d93aed7e]{flex:1;min-width:0}.pp-editor-title h2[data-v-d93aed7e]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-d93aed7e]{margin:3px 0 0}.pp-section[data-v-d93aed7e]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-d93aed7e]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-d93aed7e]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-d93aed7e]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-d93aed7e]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-d93aed7e]{margin-bottom:0}.pp-span[data-v-d93aed7e]{grid-column:1 / -1}.pp-req[data-v-d93aed7e]{color:var(--md-error);margin-left:2px}.pp-key[data-v-d93aed7e]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-d93aed7e]{flex:1}.pp-key-toggle[data-v-d93aed7e]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-d93aed7e]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-d93aed7e]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-d93aed7e]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-d93aed7e]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-d93aed7e]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-d93aed7e]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-d93aed7e]{animation:pp-pulse-d93aed7e 1s ease-in-out infinite}@keyframes pp-pulse-d93aed7e{50%{opacity:.15}}.pp-probe[data-v-d93aed7e]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-d93aed7e]{color:var(--md-success)}.pp-probe.err[data-v-d93aed7e]{color:var(--md-error)}.pp-discovered[data-v-d93aed7e]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-d93aed7e]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-d93aed7e]{flex:1;min-width:160px}.pp-mini[data-v-d93aed7e]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-d93aed7e]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-add-model[data-v-d93aed7e]{display:flex;align-items:center;gap:8px;margin-top:8px}.pp-add-model .input[data-v-d93aed7e]{flex:1;min-width:0}.pp-add-model .btn[data-v-d93aed7e]{flex:none;white-space:nowrap}.pp-add-error[data-v-d93aed7e]{color:var(--md-error)}.pp-remove[data-v-d93aed7e]{flex:none;width:26px;height:26px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);font-size:17px;line-height:1;cursor:pointer}.pp-remove[data-v-d93aed7e]:hover{background:color-mix(in srgb,var(--md-error) 14%,transparent);color:var(--md-error)}.pp-models[data-v-d93aed7e]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-d93aed7e]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-d93aed7e]:first-child{border-top:0}.pp-model.off[data-v-d93aed7e]{opacity:.5}.pp-model-name[data-v-d93aed7e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-d93aed7e]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-d93aed7e]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-d93aed7e]{color:#e0a800;cursor:default}.pp-switch[data-v-d93aed7e]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-d93aed7e]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-d93aed7e]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-d93aed7e]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-d93aed7e]{display:flex;gap:10px}.pp-list-head[data-v-d93aed7e]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-d93aed7e]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-d93aed7e]{margin:3px 0 0}.pp-list-actions[data-v-d93aed7e]{display:flex;gap:8px}.pp-cards[data-v-d93aed7e]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-d93aed7e]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-d93aed7e]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-d93aed7e]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-d93aed7e]{opacity:.62}.pp-card-head[data-v-d93aed7e]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-d93aed7e]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-d93aed7e]{width:26px;height:26px}.pp-card-id[data-v-d93aed7e]{flex:1;min-width:0}.pp-card-id strong[data-v-d93aed7e]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-d93aed7e]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-d93aed7e]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-d93aed7e]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-d93aed7e]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-d93aed7e]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-d93aed7e]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-d93aed7e]{color:var(--md-error)}.pp-chips[data-v-d93aed7e]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-d93aed7e]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-d93aed7e],.pp-chip.empty[data-v-d93aed7e]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-d93aed7e]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.pp-empty[data-v-d93aed7e]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-d93aed7e],.pp-cards[data-v-d93aed7e]{grid-template-columns:1fr}}.pairing-panel[data-v-c18959f6]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-c18959f6]{margin:12px 0;color:var(--md-on-surface-variant)}.pairing-panel .pairing-error[data-v-c18959f6]{color:var(--md-error)}article[data-v-c18959f6]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-c18959f6]{font-size:24px;letter-spacing:4px}h4[data-v-c18959f6]{margin:18px 0 0}.pairing-list[data-v-c18959f6]{position:relative}.pair-enter-active[data-v-c18959f6],.pair-leave-active[data-v-c18959f6]{transition:opacity var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out)}.pair-enter-from[data-v-c18959f6],.pair-leave-to[data-v-c18959f6]{opacity:0;transform:translateY(4px)}.pair-leave-active[data-v-c18959f6]{position:absolute;width:100%}.pair-move[data-v-c18959f6]{transition:transform var(--duration-medium) var(--ease-out)}@media(prefers-reduced-motion:reduce){.pair-enter-active[data-v-c18959f6],.pair-leave-active[data-v-c18959f6],.pair-move[data-v-c18959f6]{transition-duration:1ms}}.connection-grid[data-v-b6056614]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,264px);gap:24px;align-items:start}@media(max-width:1000px){.connection-grid[data-v-b6056614]{grid-template-columns:minmax(0,1fr)}}.connection-form .field[data-v-b6056614]{margin-bottom:12px}.connection-qr[data-v-b6056614]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-b6056614]{background:#fff;border-radius:8px;padding:6px;width:100%;max-width:264px;height:auto}.connection-link[data-v-b6056614]{max-width:100%;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.helper-text[data-v-b6056614]{overflow-wrap:anywhere}.toggle-label[data-v-b6056614]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-fb8c17b3]{max-width:920px}.sec-stack[data-v-fb8c17b3]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-fb8c17b3]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-fb8c17b3]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-fb8c17b3]{font-size:15px;font-weight:700}.sec-chip[data-v-fb8c17b3]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-fb8c17b3]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-fb8c17b3]{margin:2px 0 12px}.sec-pin-grid[data-v-fb8c17b3]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-fb8c17b3]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-fb8c17b3]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-fb8c17b3]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-fb8c17b3]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-fb8c17b3]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-fb8c17b3]:hover{background:var(--md-surface-container)}.page-item[data-v-fb8c17b3]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-fb8c17b3]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-fb8c17b3]{width:44px;height:26px}.page-item .toggle-slider[data-v-fb8c17b3]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-fb8c17b3]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-fb8c17b3]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-fb8c17b3]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-fb8c17b3]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-fb8c17b3]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-fb8c17b3]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-fb8c17b3]{margin-top:12px}.sec-error[data-v-fb8c17b3]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-fb8c17b3]{grid-template-columns:1fr}}.mcp-panel[data-v-01485e38]{max-width:900px}.mcp-head[data-v-01485e38]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-01485e38]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-01485e38]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-01485e38]{display:flex;gap:10px}.error-banner[data-v-01485e38]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-01485e38]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-01485e38]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-01485e38]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-01485e38]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-01485e38]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-01485e38]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-01485e38]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-01485e38]{flex:1}.mcp-field>span[data-v-01485e38]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-01485e38],.mcp-field select[data-v-01485e38],.mcp-field textarea[data-v-01485e38]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-01485e38]{opacity:.7}.mcp-field textarea[data-v-01485e38]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-01485e38]:focus,.mcp-field select[data-v-01485e38]:focus,.mcp-field textarea[data-v-01485e38]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-01485e38]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-01485e38]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-01485e38]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-01485e38]{font-family:ui-monospace,monospace}.mail-grid[data-v-01485e38]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-01485e38]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-01485e38]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-01485e38]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-01485e38]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-01485e38]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-01485e38]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-01485e38]:disabled{opacity:.6;cursor:not-allowed}#app .mcp-panel[data-v-01485e38] :is(.btn,.mcp-remove){border-radius:999px}#app .mcp-panel .mcp-field[data-v-01485e38] :is(input,select,textarea){border-radius:12px}@media(max-width:720px){.mail-grid[data-v-01485e38]{grid-template-columns:1fr}}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.models-field[data-v-7089f4a3]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-7089f4a3]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-7089f4a3]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-7089f4a3]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-7089f4a3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-7089f4a3]{display:inline-flex;gap:4px}.models-actions button[data-v-7089f4a3]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-7089f4a3]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-7089f4a3]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-7089f4a3]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.usage-page[data-v-e1479886]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-e1479886]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-e1479886]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-e1479886]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-e1479886]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-e1479886]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-e1479886]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-e1479886]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-e1479886]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-e1479886]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .usage-page .btn[data-v-e1479886]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-e1479886]:disabled{opacity:.55;cursor:not-allowed}.overview[data-v-e1479886]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-e1479886]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-e1479886]{display:grid;place-items:center}.donut[data-v-e1479886]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-e1479886]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-e1479886]{fill:none;stroke-width:5}.donut-track[data-v-e1479886]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-e1479886]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-e1479886]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-e1479886]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-e1479886]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-e1479886]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-e1479886]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-e1479886]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-e1479886]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-e1479886]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-e1479886]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-e1479886]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-e1479886]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-e1479886]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-e1479886]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-e1479886]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-e1479886]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-e1479886]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-e1479886]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-e1479886]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-e1479886]{background:var(--md-primary)}.dot.completion[data-v-e1479886]{background:var(--md-tertiary)}.mini-stack[data-v-e1479886]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-e1479886]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-e1479886]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-e1479886]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-e1479886]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-e1479886]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-e1479886]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-e1479886]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-e1479886]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-e1479886]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-e1479886]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-e1479886]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-e1479886]{position:absolute;inset:0}.grid span[data-v-e1479886]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-e1479886]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-e1479886]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-e1479886]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-e1479886]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-e1479886]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-e1479886]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-e1479886]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-e1479886]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-e1479886 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-e1479886]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-e1479886]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-e1479886]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-e1479886]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-e1479886]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-e1479886]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-e1479886]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-e1479886]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-e1479886]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-e1479886]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-e1479886]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-e1479886]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-e1479886]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-e1479886]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}.usage-loading[data-v-e1479886]{display:grid;grid-template-columns:minmax(220px,.9fr) 1.5fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-xl)}.skeleton[data-v-e1479886]{border-radius:32px;background:var(--md-surface-container-low);min-height:180px;animation:sk-shimmer-e1479886 1.4s ease-in-out infinite}.sk-donut[data-v-e1479886]{min-height:220px}@keyframes sk-shimmer-e1479886{0%,to{opacity:1}50%{opacity:.55}}@media(max-width:980px){.usage-loading[data-v-e1479886]{grid-template-columns:1fr 1fr}}@media(max-width:640px){.usage-loading[data-v-e1479886]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.skeleton[data-v-e1479886]{animation:none;opacity:.7}}@keyframes up-e1479886{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-e1479886]{grid-template-columns:1fr 1fr}.mini-stack[data-v-e1479886]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-e1479886],.mini-stack[data-v-e1479886]{grid-template-columns:1fr}.chart[data-v-e1479886]{height:200px;padding-left:34px}.grid span i[data-v-e1479886]{left:-34px;width:28px}.axis span[data-v-e1479886]{font-size:11px}}@media(max-width:560px){.axis span[data-v-e1479886]{font-size:10px}.axis span[data-v-e1479886]:nth-child(2n){visibility:hidden}}\n";document.head.appendChild(s)}})();
