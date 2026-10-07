var st = Object.defineProperty;
var lt = (F, s, v) => s in F ? st(F, s, { enumerable: !0, configurable: !0, writable: !0, value: v }) : F[s] = v;
var j = (F, s, v) => lt(F, typeof s != "symbol" ? s + "" : s, v);
import { defineComponent as te, reactive as ot, ref as S, onMounted as ue, openBlock as n, createElementBlock as i, createElementVNode as e, toDisplayString as l, unref as t, createTextVNode as ie, withDirectives as R, vModelCheckbox as se, vModelText as K, Fragment as B, renderList as G, normalizeClass as W, createCommentVNode as E, computed as q, onUnmounted as Ie, withKeys as nt, createStaticVNode as at, createVNode as X, vModelDynamic as it, TransitionGroup as Fe, withCtx as Oe, watch as Ge, vModelSelect as rt, shallowRef as Be, createBlock as ne, resolveDynamicComponent as ut, Transition as dt, withModifiers as Ke } from "vue";
import { useRouter as Xe, useRoute as ct } from "vue-router";
import { useI18n as le } from "vue-i18n";
import { apiGet as me, apiPost as Ee, ApiError as Ze, useConfirm as xe, useProvidersStore as pt, PROVIDERS as Ve, AppSelect as pe, getLanguage as ht, LOCALES as vt, setLanguage as mt, useWizardStore as ze, useSettingsMeta as Le, useUIPatchesStore as Qe, PinInput as He, useSettingsSectionsStore as _t, DEFAULT_LIVE2D_MODELS as gt } from "@0kay/host";
import { L as bt } from "./assets/Live2DStage-CQ-AJ4l1.js";
import { _ as de } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
import { t as je } from "./assets/toast-CztbypyC.js";
const ft = { class: "life-settings" }, yt = { class: "ls-hero" }, kt = { class: "ls-hero-main" }, wt = { class: "ls-sub" }, $t = ["disabled"], Ct = { class: "ls-grid" }, St = { class: "ls-card" }, Pt = { class: "ls-card-head" }, xt = { class: "ls-switch" }, Mt = { class: "ls-switch-text" }, Ut = { class: "ls-switch" }, Et = { class: "ls-switch-text" }, Tt = { class: "ls-field" }, At = ["placeholder"], Nt = { class: "ls-card" }, Vt = { class: "ls-card-head" }, Rt = { class: "ls-note" }, Ot = { class: "ls-label" }, It = { class: "ls-models" }, zt = ["onClick"], Lt = {
  key: 0,
  class: "ls-empty"
}, Dt = { class: "ls-label" }, Ft = { class: "ls-models" }, Bt = ["onClick"], Kt = {
  key: 0,
  class: "ls-empty"
}, Ht = { class: "ls-card" }, jt = { class: "ls-card-head" }, Yt = { class: "ls-note" }, Jt = { class: "ls-switch" }, Wt = { class: "ls-switch-text" }, qt = { class: "ls-switch" }, Gt = { class: "ls-switch-text" }, Xt = { class: "ls-card" }, Zt = { class: "ls-switch" }, Qt = { class: "ls-switch-text" }, es = { class: "ls-card ls-card-wide" }, ts = { class: "ls-card-head" }, ss = { class: "ls-row" }, ls = { class: "ls-switch" }, os = { class: "ls-switch-text" }, ns = { class: "ls-switch" }, as = { class: "ls-switch-text" }, is = { class: "ls-row" }, rs = { class: "ls-field" }, us = { class: "ls-field" }, ds = { class: "ls-row" }, cs = { class: "ls-field" }, ps = { class: "ls-field" }, hs = ["placeholder"], vs = { class: "ls-row" }, ms = { class: "ls-field" }, _s = { class: "ls-field" }, gs = {
  key: 0,
  class: "ls-state"
}, bs = /* @__PURE__ */ te({
  __name: "LifeSettingsPanel",
  setup(F) {
    const { t: s } = le(), v = ot({
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
    }), _ = S(""), w = S(!1), f = S(!1), h = S([]), $ = S(""), T = S([]);
    async function d() {
      try {
        const [o, r] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (o.ok && (Object.assign(v, (await o.json()).values || {}), f.value = !0), r.ok) {
          const c = await r.json();
          T.value = Array.isArray(c.models) ? c.models.map((m) => ({ id: m.id, provider: m.provider || "custom", supports_thinking: m.supports_thinking })).filter((m) => m.id) : [], h.value = T.value.map((m) => m.id), $.value = s("lifeSettings.sourceFromCore");
        }
      } catch {
        _.value = s("lifeSettings.loadFailed");
      }
    }
    async function u() {
      if (!f.value) {
        _.value = s("lifeSettings.notLoaded");
        return;
      }
      w.value = !0, _.value = "";
      try {
        const o = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: v }) });
        if (!o.ok) throw new Error(String(o.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: v.screen_watch, computer_use: v.computer_use, report_agent_host: v.report_agent_host }) }), _.value = s("lifeSettings.savedNotice");
      } catch {
        _.value = s("lifeSettings.saveFailed");
      } finally {
        w.value = !1;
      }
    }
    return ue(d), (o, r) => (n(), i("section", ft, [
      e("header", yt, [
        e("div", kt, [
          r[14] || (r[14] = e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS", -1)),
          e("h2", null, l(t(s)("lifeSettings.title")), 1),
          e("p", wt, l(t(s)("lifeSettings.subtitle")), 1)
        ]),
        e("button", {
          class: "ls-save",
          disabled: w.value,
          onClick: u
        }, [
          r[15] || (r[15] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          ie(l(w.value ? t(s)("common.saving") : t(s)("common.save")), 1)
        ], 8, $t)
      ]),
      e("div", Ct, [
        e("article", St, [
          e("div", Pt, [
            r[16] || (r[16] = e("span", { class: "ls-ic tone-1" }, "◉", -1)),
            e("h3", null, l(t(s)("lifeSettings.hostPerms")), 1)
          ]),
          e("label", xt, [
            R(e("input", {
              "onUpdate:modelValue": r[0] || (r[0] = (c) => v.screen_watch = c),
              type: "checkbox"
            }, null, 512), [
              [se, v.screen_watch]
            ]),
            r[17] || (r[17] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Mt, [
              e("b", null, l(t(s)("lifeSettings.screenWatch")), 1),
              e("small", null, l(t(s)("lifeSettings.screenWatchDesc")), 1)
            ])
          ]),
          e("label", Ut, [
            R(e("input", {
              "onUpdate:modelValue": r[1] || (r[1] = (c) => v.computer_use = c),
              type: "checkbox"
            }, null, 512), [
              [se, v.computer_use]
            ]),
            r[18] || (r[18] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Et, [
              e("b", null, l(t(s)("lifeSettings.computerUse")), 1),
              e("small", null, l(t(s)("lifeSettings.computerUseDesc")), 1)
            ])
          ]),
          e("label", Tt, [
            e("span", null, l(t(s)("lifeSettings.agentHost")), 1),
            R(e("input", {
              "onUpdate:modelValue": r[2] || (r[2] = (c) => v.report_agent_host = c),
              placeholder: t(s)("lifeSettings.agentHostPlaceholder")
            }, null, 8, At), [
              [K, v.report_agent_host]
            ])
          ])
        ]),
        e("article", Nt, [
          e("div", Vt, [
            r[19] || (r[19] = e("span", { class: "ls-ic tone-2" }, "✦", -1)),
            e("h3", null, l(t(s)("lifeSettings.thinkOutput")), 1)
          ]),
          e("p", Rt, l($.value || t(s)("lifeSettings.loadingModels")), 1),
          e("p", Ot, l(t(s)("lifeSettings.thinkLabel")), 1),
          e("div", It, [
            (n(!0), i(B, null, G(T.value, (c) => (n(), i("button", {
              key: "think-" + c.id,
              type: "button",
              class: W(["ls-model", { selected: v.think_model === c.id }]),
              onClick: (m) => v.think_model = c.id
            }, [
              e("b", null, l(c.id), 1),
              e("span", null, l(c.provider) + " · " + l(c.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, zt))), 128)),
            T.value.length ? E("", !0) : (n(), i("span", Lt, l(t(s)("lifeSettings.noModels")), 1))
          ]),
          e("p", Dt, l(t(s)("lifeSettings.outputLabel")), 1),
          e("div", Ft, [
            (n(!0), i(B, null, G(T.value, (c) => (n(), i("button", {
              key: "output-" + c.id,
              type: "button",
              class: W(["ls-model", { selected: v.output_model === c.id }]),
              onClick: (m) => v.output_model = c.id
            }, [
              e("b", null, l(c.id), 1),
              e("span", null, l(c.provider) + " · output", 1)
            ], 10, Bt))), 128)),
            T.value.length ? E("", !0) : (n(), i("span", Kt, l(t(s)("lifeSettings.noModels")), 1))
          ])
        ]),
        e("article", Ht, [
          e("div", jt, [
            r[20] || (r[20] = e("span", { class: "ls-ic tone-3" }, "✉", -1)),
            e("h3", null, l(t(s)("lifeSettings.mail")), 1)
          ]),
          e("p", Yt, l(t(s)("lifeSettings.mailNote", { mcp: "0kay-mcp", mail: "mail" })), 1),
          e("label", Jt, [
            R(e("input", {
              "onUpdate:modelValue": r[3] || (r[3] = (c) => v.mail_auto_approve_all = c),
              type: "checkbox"
            }, null, 512), [
              [se, v.mail_auto_approve_all]
            ]),
            r[21] || (r[21] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Wt, [
              e("b", null, l(t(s)("lifeSettings.mailAutoApprove")), 1),
              e("small", null, l(t(s)("lifeSettings.mailAutoApproveDesc")), 1)
            ])
          ]),
          e("label", qt, [
            R(e("input", {
              "onUpdate:modelValue": r[4] || (r[4] = (c) => v.mail_require_approval = c),
              type: "checkbox"
            }, null, 512), [
              [se, v.mail_require_approval]
            ]),
            r[22] || (r[22] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Gt, [
              e("b", null, l(t(s)("lifeSettings.mailRequireApproval")), 1),
              e("small", null, l(t(s)("lifeSettings.mailRequireApprovalDesc")), 1)
            ])
          ])
        ]),
        e("article", Xt, [
          r[24] || (r[24] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", Zt, [
            R(e("input", {
              "onUpdate:modelValue": r[5] || (r[5] = (c) => v.mcp_enabled = c),
              type: "checkbox"
            }, null, 512), [
              [se, v.mcp_enabled]
            ]),
            r[23] || (r[23] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Qt, [
              e("b", null, l(t(s)("lifeSettings.mcpEnabled")), 1),
              e("small", null, l(t(s)("lifeSettings.mcpEnabledDesc")), 1)
            ])
          ])
        ]),
        e("article", es, [
          e("div", ts, [
            r[25] || (r[25] = e("span", { class: "ls-ic tone-5" }, "☷", -1)),
            e("h3", null, l(t(s)("lifeSettings.onebot")), 1)
          ]),
          e("div", ss, [
            e("label", ls, [
              R(e("input", {
                "onUpdate:modelValue": r[6] || (r[6] = (c) => v.onebot_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [se, v.onebot_enabled]
              ]),
              r[26] || (r[26] = e("span", { class: "ls-track" }, null, -1)),
              e("span", os, [
                e("b", null, l(t(s)("lifeSettings.onebotEnable")), 1)
              ])
            ]),
            e("label", ns, [
              R(e("input", {
                "onUpdate:modelValue": r[7] || (r[7] = (c) => v.onebot_observe_group = c),
                type: "checkbox"
              }, null, 512), [
                [se, v.onebot_observe_group]
              ]),
              r[27] || (r[27] = e("span", { class: "ls-track" }, null, -1)),
              e("span", as, [
                e("b", null, l(t(s)("lifeSettings.onebotObserve")), 1),
                e("small", null, l(t(s)("lifeSettings.onebotObserveDesc")), 1)
              ])
            ])
          ]),
          e("div", is, [
            e("label", rs, [
              e("span", null, l(t(s)("lifeSettings.onebotWs")), 1),
              R(e("input", {
                "onUpdate:modelValue": r[8] || (r[8] = (c) => v.onebot_ws_url = c),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [K, v.onebot_ws_url]
              ])
            ]),
            e("label", us, [
              e("span", null, l(t(s)("lifeSettings.onebotHttp")), 1),
              R(e("input", {
                "onUpdate:modelValue": r[9] || (r[9] = (c) => v.onebot_http_url = c),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [K, v.onebot_http_url]
              ])
            ])
          ]),
          e("div", ds, [
            e("label", cs, [
              r[28] || (r[28] = e("span", null, "Access Token", -1)),
              R(e("input", {
                "onUpdate:modelValue": r[10] || (r[10] = (c) => v.onebot_access_token = c),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [K, v.onebot_access_token]
              ])
            ]),
            e("label", ps, [
              e("span", null, l(t(s)("lifeSettings.onebotKeywords")), 1),
              R(e("input", {
                "onUpdate:modelValue": r[11] || (r[11] = (c) => v.onebot_trigger_keywords = c),
                placeholder: t(s)("lifeSettings.onebotKeywordsPlaceholder")
              }, null, 8, hs), [
                [K, v.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", vs, [
            e("label", ms, [
              e("span", null, l(t(s)("lifeSettings.proactiveDaily")), 1),
              R(e("input", {
                "onUpdate:modelValue": r[12] || (r[12] = (c) => v.proactive_daily_limit = c),
                type: "number",
                min: "0",
                placeholder: "3"
              }, null, 512), [
                [
                  K,
                  v.proactive_daily_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", _s, [
              e("span", null, l(t(s)("lifeSettings.proactiveTarget")), 1),
              R(e("input", {
                "onUpdate:modelValue": r[13] || (r[13] = (c) => v.proactive_target_limit = c),
                type: "number",
                min: "0",
                placeholder: "1"
              }, null, 512), [
                [
                  K,
                  v.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ])
      ]),
      _.value ? (n(), i("p", gs, l(_.value), 1)) : E("", !0)
    ]));
  }
}), fs = /* @__PURE__ */ de(bs, [["__scopeId", "data-v-cd0c2989"]]), ys = "/okay-logo.svg", ks = { class: "content-card about" }, ws = { class: "identity" }, $s = { class: "app-id" }, Cs = { class: "ver-badge" }, Ss = { class: "app-desc" }, Ps = { class: "identity-actions" }, xs = ["href"], Ms = { class: "section" }, Us = { class: "section-head" }, Es = ["disabled"], Ts = {
  key: 0,
  class: "alert",
  role: "alert"
}, As = {
  class: "us-hero-icon",
  "aria-hidden": "true"
}, Ns = {
  key: 0,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Vs = {
  key: 1,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Rs = {
  key: 2,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Os = { class: "us-hero-text" }, Is = { key: 0 }, zs = { key: 1 }, Ls = { class: "us-hero-actions" }, Ds = ["disabled"], Fs = ["disabled", "title"], Bs = ["href"], Ks = {
  key: 2,
  class: "us-notes"
}, Hs = { class: "us-notes-title" }, js = { class: "us-notes-body" }, Ys = {
  key: 3,
  class: "alert",
  role: "alert"
}, Js = { class: "us-apply-head" }, Ws = { key: 0 }, qs = { key: 1 }, Gs = {
  key: 0,
  class: "us-chip-tag"
}, Xs = { class: "us-apply-label" }, Zs = {
  key: 0,
  class: "us-apply-error"
}, Qs = {
  key: 1,
  class: "us-apply-log"
}, el = { class: "section" }, tl = { class: "section-title" }, sl = { class: "credits" }, ll = ["href"], ol = ["src", "alt"], nl = { class: "person-info" }, al = { class: "name" }, il = { class: "role" }, rl = ["src"], ul = { class: "person-info" }, dl = { class: "role" }, cl = { class: "section-head contributors-head" }, pl = { class: "section-title" }, hl = { class: "muted" }, vl = {
  key: 0,
  class: "contribs"
}, ml = ["href"], _l = ["src", "alt"], gl = { class: "login" }, bl = {
  key: 0,
  class: "count"
}, fl = {
  key: 1,
  class: "muted"
}, yl = ["href"], kl = { class: "foot" }, wl = ["href"], Re = "https://github.com/RazureSOFT/0KAY", $l = "https://github.com/RazureSOFT", Cl = /* @__PURE__ */ te({
  __name: "AboutPanel",
  setup(F) {
    const { t: s } = le(), v = S("0.1.3"), _ = S([]), w = S(""), f = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, h = (U, P = 96) => `https://github.com/${U}.png?size=${P}`, $ = S(!1), T = S(null), d = S(""), u = S(null), o = S("");
    let r = null;
    function c(U) {
      return u.value?.status === "running" && u.value.plugin === U;
    }
    async function m(U, P) {
      if (u.value?.status !== "running") {
        o.value = "";
        try {
          u.value = await Ee("/api/plugins/pm/update", { plugin: U, version: P || "" }), p();
        } catch (H) {
          o.value = H instanceof Error ? H.message : String(H);
        }
      }
    }
    async function g() {
      try {
        u.value = await me("/api/plugins/pm/status");
      } catch {
        return;
      }
      u.value && u.value.status !== "running" && (k(), O());
    }
    function p() {
      r || (r = setInterval(g, 2e3));
    }
    function k() {
      r && (clearInterval(r), r = null);
    }
    const C = q(() => {
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
    }), L = q(() => T.value ? T.value.has_update ? "warn" : T.value.latest ? "ok" : "none" : "none");
    async function O() {
      $.value = !0, d.value = "";
      try {
        const U = await me("/api/plugins/pm/check");
        T.value = U, U?.current && (v.value = String(U.current));
      } catch (U) {
        d.value = U instanceof Ze && U.status === 404 ? s("settings.about.unsupported") : U instanceof Error ? U.message : String(U);
      } finally {
        $.value = !1;
      }
    }
    async function D() {
      try {
        const U = { Accept: "application/vnd.github+json" }, [P, H] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: U }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: U })
        ]);
        if (!P.ok) throw new Error(`HTTP ${P.status}`);
        const Z = /* @__PURE__ */ new Map(), Q = await P.json();
        for (const z of Array.isArray(Q) ? Q : [])
          z?.login && Z.set(z.login, z);
        if (H.ok) {
          const z = await H.json();
          for (const N of Array.isArray(z) ? z : []) {
            const I = N?.author;
            !I?.login || I.login.endsWith("[bot]") || Z.has(I.login) || Z.set(I.login, {
              login: I.login,
              avatar_url: I.avatar_url,
              html_url: I.html_url,
              contributions: 0
            });
          }
        }
        _.value = [...Z.values()].sort(
          (z, N) => (N.contributions || 0) - (z.contributions || 0) || z.login.localeCompare(N.login)
        );
      } catch (U) {
        w.value = U instanceof Error ? U.message : String(U), _.value = [];
      }
    }
    return ue(() => {
      O(), D(), me("/api/plugins/pm/status").then((U) => {
        u.value = U, U?.status === "running" && p();
      }).catch(() => {
      });
    }), Ie(k), (U, P) => (n(), i("div", ks, [
      e("header", ws, [
        P[3] || (P[3] = e("img", {
          class: "app-icon",
          src: ys,
          alt: "",
          "aria-hidden": "true"
        }, null, -1)),
        e("div", $s, [
          e("h2", null, [
            P[2] || (P[2] = ie("0KAY ", -1)),
            e("span", Cs, "v" + l(v.value), 1)
          ]),
          e("p", Ss, l(t(s)("settings.about.description")), 1)
        ]),
        e("div", Ps, [
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
          }, "Releases ↗", 8, xs)
        ])
      ]),
      e("section", Ms, [
        e("div", Us, [
          P[4] || (P[4] = e("h3", { class: "section-title" }, "0KAY", -1)),
          e("button", {
            class: "btn btn-tonal sm",
            disabled: $.value,
            onClick: O
          }, l(t(s)($.value ? "settings.about.checking" : "settings.about.check")), 9, Es)
        ]),
        d.value ? (n(), i("p", Ts, l(d.value), 1)) : (n(), i("div", {
          key: 1,
          class: W(["us-hero", L.value])
        }, [
          e("div", As, [
            L.value === "ok" ? (n(), i("svg", Ns, [...P[5] || (P[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : L.value === "warn" ? (n(), i("svg", Vs, [...P[6] || (P[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (n(), i("svg", Rs, [...P[7] || (P[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", Os, [
            e("b", null, l(t(s)(L.value === "warn" ? "settings.about.available" : L.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            T.value?.latest ? (n(), i("span", Is, [
              ie("v" + l(T.value.current) + " → ", 1),
              e("em", null, "v" + l(T.value.latest), 1)
            ])) : (n(), i("span", zs, "0KAY v" + l(T.value?.current || v.value), 1))
          ]),
          e("div", Ls, [
            T.value?.has_update ? (n(), i("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: c("core"),
              onClick: P[0] || (P[0] = (H) => m("core", T.value.latest))
            }, l(c("core") ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, Ds)) : E("", !0),
            T.value?.source_available !== !1 ? (n(), i("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: c("core"),
              title: t(s)("settings.about.betaHint"),
              onClick: P[1] || (P[1] = (H) => m("core"))
            }, l(c("core") ? t(s)("settings.about.updating") : t(s)("settings.about.beta")), 9, Fs)) : E("", !0),
            T.value?.url ? (n(), i("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: T.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, Bs)) : E("", !0)
          ])
        ], 2)),
        T.value?.notes ? (n(), i("div", Ks, [
          e("p", Hs, l(t(s)("settings.about.whatsNew")), 1),
          e("pre", js, l(T.value.notes), 1)
        ])) : E("", !0),
        o.value ? (n(), i("p", Ys, l(o.value), 1)) : E("", !0),
        u.value && u.value.status !== "idle" ? (n(), i("div", {
          key: 4,
          class: W(["us-apply-banner", u.value.status])
        }, [
          e("div", Js, [
            P[8] || (P[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              ie(l(u.value.package), 1),
              u.value.version ? (n(), i("span", Ws, "@" + l(u.value.version), 1)) : (n(), i("span", qs, " · main"))
            ]),
            u.value.mode === "source" ? (n(), i("span", Gs, l(t(s)("settings.about.sourceMode")), 1)) : E("", !0),
            e("span", Xs, l(C.value), 1)
          ]),
          u.value.error ? (n(), i("p", Zs, l(u.value.error), 1)) : E("", !0),
          u.value.log ? (n(), i("pre", Qs, l(u.value.log), 1)) : E("", !0)
        ], 2)) : E("", !0)
      ]),
      e("section", el, [
        e("h3", tl, l(t(s)("settings.about.developerTitle")) + " & " + l(t(s)("settings.about.teamTitle")), 1),
        e("div", sl, [
          e("a", {
            class: "person",
            href: f.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: f.avatar,
              alt: f.login,
              loading: "lazy"
            }, null, 8, ol),
            e("div", nl, [
              e("span", al, l(f.login), 1),
              e("span", il, l(t(s)("settings.about.developerTitle")), 1)
            ]),
            P[9] || (P[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, ll),
          e("a", {
            class: "person",
            href: $l,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: h("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, rl),
            e("div", ul, [
              P[10] || (P[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", dl, l(t(s)("settings.about.teamTitle")), 1)
            ]),
            P[11] || (P[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", cl, [
          e("h3", pl, l(t(s)("settings.about.contributorsTitle")), 1),
          e("span", hl, l(t(s)("settings.about.contributorsFrom")), 1)
        ]),
        _.value.length ? (n(), i("div", vl, [
          (n(!0), i(B, null, G(_.value, (H) => (n(), i("a", {
            key: H.login,
            class: "contrib",
            href: H.html_url || `https://github.com/${H.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: H.avatar_url || h(H.login, 64),
              alt: H.login,
              loading: "lazy"
            }, null, 8, _l),
            e("span", gl, l(H.login), 1),
            H.contributions ? (n(), i("span", bl, l(H.contributions), 1)) : E("", !0)
          ], 8, ml))), 128))
        ])) : (n(), i("p", fl, [
          e("a", {
            class: "repo-link",
            href: f.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "razureink ↗", 8, yl)
        ]))
      ]),
      e("footer", kl, [
        P[12] || (P[12] = e("span", { class: "status-chip" }, "MIT", -1)),
        P[13] || (P[13] = e("span", null, "© 2026 RazureSOFT", -1)),
        e("a", {
          class: "repo-link",
          href: `${Re}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, wl)
      ])
    ]));
  }
}), Sl = /* @__PURE__ */ de(Cl, [["__scopeId", "data-v-da8c447d"]]), Pl = { class: "content-card updates" }, xl = { class: "us-block" }, Ml = { class: "us-head" }, Ul = { class: "us-head-text" }, El = { class: "us-title" }, Tl = { class: "us-desc" }, Al = { class: "us-source" }, Nl = { class: "us-input-group" }, Vl = ["disabled", "placeholder"], Rl = ["disabled"], Ol = { class: "us-chips" }, Il = ["disabled"], zl = ["disabled"], Ll = {
  key: 0,
  class: "us-saved"
}, Dl = { class: "helper-text" }, Fl = {
  key: 0,
  class: "alert"
}, Bl = { class: "us-block" }, Kl = { class: "us-head" }, Hl = { class: "us-head-text" }, jl = { class: "us-title" }, Yl = { class: "us-desc" }, Jl = { class: "us-head-actions" }, Wl = ["disabled"], ql = {
  key: 0,
  class: "alert",
  role: "alert"
}, Gl = { class: "us-apply-head" }, Xl = { key: 0 }, Zl = { key: 1 }, Ql = {
  key: 0,
  class: "us-chip-tag"
}, eo = { class: "us-apply-label" }, to = {
  key: 0,
  class: "us-apply-error"
}, so = {
  key: 1,
  class: "us-apply-log"
}, lo = {
  key: 2,
  class: "alert",
  role: "alert"
}, oo = {
  key: 3,
  class: "us-table"
}, no = { class: "us-row us-thead" }, ao = { class: "us-name" }, io = { class: "us-name-text" }, ro = { class: "us-ver" }, uo = { class: "us-status-text" }, co = { class: "us-actions" }, po = ["disabled", "onClick"], ho = ["disabled", "onClick"], vo = ["href", "title"], mo = {
  key: 0,
  class: "us-empty"
}, _o = /* @__PURE__ */ te({
  __name: "UpdatesPanel",
  setup(F) {
    const { t: s } = le(), v = S(!1), _ = S(null), w = S(""), f = S(null), h = S("");
    let $ = null;
    const T = S(""), d = S(""), u = S(!1), o = S(!1), r = S(!1), c = S(""), m = q(() => T.value.trim() !== d.value), g = q(() => T.value.trim() !== "");
    function p(z) {
      return f.value?.status === "running" && f.value.plugin === z;
    }
    async function k(z, N) {
      if (f.value?.status !== "running") {
        h.value = "";
        try {
          f.value = await Ee("/api/plugins/pm/update", { plugin: z, version: N || "" }), L();
        } catch (I) {
          h.value = I instanceof Error ? I.message : String(I);
        }
      }
    }
    async function C() {
      try {
        f.value = await me("/api/plugins/pm/status");
      } catch {
        return;
      }
      f.value && f.value.status !== "running" && (O(), P());
    }
    function L() {
      $ || ($ = setInterval(C, 2e3));
    }
    function O() {
      $ && (clearInterval($), $ = null);
    }
    const D = q(() => {
      switch (f.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), U = q(() => (_.value || []).filter((z) => z.has_update).length);
    async function P() {
      v.value = !0, w.value = "";
      try {
        const z = await me("/api/plugins/pm/check-plugins");
        _.value = z?.plugins || [];
      } catch (z) {
        w.value = z instanceof Ze && z.status === 404 ? s("settings.about.unsupported") : z instanceof Error ? z.message : String(z);
      } finally {
        v.value = !1;
      }
    }
    async function H() {
      u.value = !0, c.value = "";
      try {
        const z = await me("/api/settings/updates"), N = String(z?.values?.github_proxy ?? "");
        T.value = N, d.value = N;
      } catch {
      } finally {
        u.value = !1;
      }
    }
    async function Z() {
      o.value = !0, c.value = "";
      try {
        const z = T.value.trim();
        await Ee("/api/settings/updates", { values: { github_proxy: z } }), d.value = z, r.value = !0, setTimeout(() => {
          r.value = !1;
        }, 1500);
      } catch (z) {
        c.value = z instanceof Error ? z.message : String(z);
      } finally {
        o.value = !1;
      }
    }
    function Q(z) {
      T.value = z, Z();
    }
    return ue(() => {
      P(), H(), me("/api/plugins/pm/status").then((z) => {
        f.value = z, z?.status === "running" && L();
      }).catch(() => {
      });
    }), Ie(O), (z, N) => (n(), i("div", Pl, [
      e("section", xl, [
        e("header", Ml, [
          N[3] || (N[3] = e("span", {
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
          e("div", Ul, [
            e("h3", El, l(t(s)("settings.pluginSourceTitle")), 1),
            e("p", Tl, l(t(s)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: W(["us-tag", { on: g.value }])
          }, l(g.value ? "ghproxy" : t(s)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", Al, [
          e("div", Nl, [
            N[4] || (N[4] = e("span", {
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
            R(e("input", {
              "onUpdate:modelValue": N[0] || (N[0] = (I) => T.value = I),
              class: "us-input",
              type: "text",
              disabled: u.value,
              placeholder: t(s)("settings.pluginSourcePlaceholder"),
              onKeyup: nt(Z, ["enter"])
            }, null, 40, Vl), [
              [K, T.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: o.value || !m.value,
              onClick: Z
            }, l(t(s)("settings.save")), 9, Rl)
          ]),
          e("div", Ol, [
            e("button", {
              type: "button",
              class: W(["us-chip", { active: !g.value }]),
              disabled: o.value,
              onClick: N[1] || (N[1] = (I) => Q(""))
            }, l(t(s)("settings.pluginSourceDirect")), 11, Il),
            e("button", {
              type: "button",
              class: W(["us-chip", { active: T.value.trim() === "https://gh-proxy.com" }]),
              disabled: o.value,
              onClick: N[2] || (N[2] = (I) => Q("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, zl),
            r.value ? (n(), i("span", Ll, l(t(s)("settings.saved")), 1)) : E("", !0)
          ]),
          e("p", Dl, l(t(s)("settings.pluginSourceHelp")), 1),
          c.value ? (n(), i("p", Fl, l(c.value), 1)) : E("", !0)
        ])
      ]),
      N[10] || (N[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", Bl, [
        e("header", Kl, [
          N[5] || (N[5] = at('<span class="us-ico" aria-hidden="true" data-v-95a0aad4><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-95a0aad4><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect></svg></span>', 1)),
          e("div", Hl, [
            e("h3", jl, l(t(s)("settings.about.plugins")), 1),
            e("p", Yl, l(t(s)("settings.about.updateHint")), 1)
          ]),
          e("div", Jl, [
            e("span", {
              class: W(["us-count", { warn: U.value > 0 }])
            }, l(U.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: v.value,
              onClick: P
            }, l(t(s)(v.value ? "settings.about.checking" : "settings.about.check")), 9, Wl)
          ])
        ]),
        h.value ? (n(), i("p", ql, l(h.value), 1)) : E("", !0),
        f.value && f.value.status !== "idle" ? (n(), i("div", {
          key: 1,
          class: W(["us-apply-banner", f.value.status])
        }, [
          e("div", Gl, [
            N[6] || (N[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              ie(l(f.value.package), 1),
              f.value.version ? (n(), i("span", Xl, "@" + l(f.value.version), 1)) : (n(), i("span", Zl, " · main"))
            ]),
            f.value.mode === "source" ? (n(), i("span", Ql, l(t(s)("settings.about.sourceMode")), 1)) : E("", !0),
            e("span", eo, l(D.value), 1)
          ]),
          f.value.error ? (n(), i("p", to, l(f.value.error), 1)) : E("", !0),
          f.value.log ? (n(), i("pre", so, l(f.value.log), 1)) : E("", !0)
        ], 2)) : E("", !0),
        w.value ? (n(), i("p", lo, l(w.value), 1)) : E("", !0),
        _.value ? (n(), i("div", oo, [
          e("div", no, [
            e("span", null, l(t(s)("plugins.updatesColPlugin")), 1),
            e("span", null, l(t(s)("plugins.updatesColVersion")), 1),
            e("span", null, l(t(s)("plugins.updatesColStatus")), 1),
            N[7] || (N[7] = e("span", null, null, -1))
          ]),
          (n(!0), i(B, null, G(_.value, (I) => (n(), i("div", {
            key: I.name,
            class: "us-row"
          }, [
            e("span", ao, [
              e("span", {
                class: W(["us-dot", I.error ? "bad" : I.has_update ? "warn" : I.latest ? "ok" : ""])
              }, null, 2),
              e("span", io, l(I.name), 1)
            ]),
            e("span", ro, [
              e("em", null, "v" + l(I.version || "—"), 1),
              N[8] || (N[8] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: W({ good: !!I.latest })
              }, l(I.latest ? `v${I.latest}` : "—"), 3)
            ]),
            e("span", {
              class: W(["us-status", I.error ? "bad" : I.has_update ? "warn" : I.latest ? "ok" : ""])
            }, [
              e("span", uo, l(I.error || t(s)(I.has_update ? "settings.about.available" : I.latest ? "settings.about.latest" : "settings.about.noRelease")), 1)
            ], 2),
            e("span", co, [
              I.can_update && I.has_update ? (n(), i("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: p(I.name),
                onClick: (ke) => k(I.name, I.latest)
              }, l(p(I.name) ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, po)) : I.can_update ? (n(), i("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: p(I.name),
                onClick: (ke) => k(I.name)
              }, l(p(I.name) ? t(s)("settings.about.updating") : t(s)("settings.about.syncNow")), 9, ho)) : E("", !0),
              I.repository ? (n(), i("a", {
                key: 2,
                class: "us-repo",
                href: I.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: I.repository
              }, l(t(s)("plugins.updatesColRepo")) + " ↗", 9, vo)) : E("", !0)
            ])
          ]))), 128)),
          _.value.length ? E("", !0) : (n(), i("p", mo, l(t(s)("settings.about.noPlugins")), 1))
        ])) : E("", !0),
        N[9] || (N[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), go = /* @__PURE__ */ de(_o, [["__scopeId", "data-v-95a0aad4"]]), bo = { class: "content-card provider-panel" }, fo = { class: "pp-editor-head" }, yo = ["aria-label"], ko = { class: "pp-editor-title" }, wo = { class: "card-desc" }, $o = { class: "pp-section" }, Co = { class: "pp-section-title" }, So = { class: "pp-grid" }, Po = { class: "field" }, xo = { class: "field" }, Mo = {
  key: 0,
  class: "pp-req"
}, Uo = ["placeholder"], Eo = { class: "field pp-span" }, To = ["placeholder"], Ao = { class: "field" }, No = { class: "helper-text" }, Vo = { class: "field" }, Ro = { class: "helper-text" }, Oo = { class: "pp-section" }, Io = { class: "pp-section-head" }, zo = { class: "pp-section-title" }, Lo = ["disabled"], Do = { class: "field" }, Fo = { class: "pp-key" }, Bo = ["type", "placeholder"], Ko = {
  key: 0,
  class: "helper-text"
}, Ho = {
  key: 1,
  class: "pp-probe err"
}, jo = {
  key: 2,
  class: "pp-probe ok"
}, Yo = { class: "pp-section" }, Jo = { class: "pp-section-head" }, Wo = { class: "pp-section-title" }, qo = { class: "pp-count" }, Go = ["disabled"], Xo = {
  key: 0,
  class: "pp-discovered"
}, Zo = { class: "pp-model-tools" }, Qo = ["placeholder"], en = {
  key: 1,
  class: "pp-models"
}, tn = ["title"], sn = ["value", "title", "onChange"], ln = ["value"], on = ["title", "disabled", "onClick"], nn = ["title"], an = ["checked", "onChange"], rn = {
  key: 0,
  class: "helper-text"
}, un = {
  key: 2,
  class: "helper-text"
}, dn = {
  key: 0,
  class: "pp-error",
  role: "alert"
}, cn = { class: "pp-editor-actions" }, pn = ["disabled"], hn = { class: "pp-list-head" }, vn = { class: "card-desc" }, mn = { class: "pp-list-actions" }, _n = {
  key: 0,
  class: "pp-cards"
}, gn = { class: "pp-card-head" }, bn = { class: "pp-logo" }, fn = ["src", "alt"], yn = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, kn = { class: "pp-card-id" }, wn = ["title"], $n = { class: "pp-card-badges" }, Cn = {
  key: 0,
  class: "pp-badge primary"
}, Sn = { class: "pp-badge" }, Pn = { class: "pp-card-status" }, xn = {
  key: 0,
  class: "pp-meta"
}, Mn = ["title"], Un = { class: "pp-chips" }, En = {
  key: 0,
  class: "pp-chip more"
}, Tn = {
  key: 1,
  class: "pp-chip empty"
}, An = { class: "pp-card-actions" }, Nn = ["onClick"], Vn = ["disabled", "onClick"], Rn = ["disabled", "onClick"], On = ["onClick"], In = ["onClick"], zn = {
  key: 1,
  class: "pp-empty"
}, Ln = /* @__PURE__ */ te({
  __name: "ProviderPanel",
  setup(F) {
    const { t: s } = le(), { confirm: v } = xe(), _ = pt(), w = S({}), f = S("list"), h = S(null), $ = S(""), T = S({ state: "idle" }), d = S([]), u = S(""), o = S(!1), r = S(!1), c = S(!1);
    ue(async () => {
      await _.fetchAll();
      for (const b of _.providers) H(b);
    });
    function m(b) {
      return Ve.find((x) => x.id === b) || null;
    }
    function g(b) {
      return b.name && b.name.trim() ? b.name.trim() : m(b.provider)?.name || b.provider;
    }
    function p(b) {
      return m(b.provider)?.logo || "";
    }
    const k = q(() => [
      { value: "chat", label: s("modelType.chat") },
      { value: "embedding", label: s("modelType.embedding") },
      { value: "rerank", label: s("modelType.rerank") },
      { value: "vision", label: s("modelType.vision") },
      { value: "tts", label: s("modelType.tts") },
      { value: "image", label: s("modelType.image") },
      { value: "audio", label: s("modelType.audio") }
    ]);
    function C(b) {
      return (h.value?.model_types || {})[b] || "chat";
    }
    function L(b, x) {
      if (!h.value) return;
      const y = { ...h.value.model_types || {} };
      !x || x === "chat" ? delete y[b] : y[b] = x, h.value.model_types = y;
    }
    function O(b) {
      const x = new Set(b.disabled_models || []);
      return b.models.filter((y) => !x.has(y));
    }
    function D(b) {
      return _.defaultProviderId === b.id;
    }
    function U(b) {
      const x = h.value;
      if (!x) return;
      const y = Ve.find((Y) => Y.id === b);
      y?.baseUrl && !x.base_url && (x.base_url = y.baseUrl), x.format = y?.format || "";
    }
    async function P(b, x = "") {
      if (!b.base_url) return { state: "error", message: s("settings.baseUrlRequired") };
      const y = performance.now();
      try {
        const Y = await fetch("/api/models/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: b.id,
            provider: b.provider,
            base_url: b.base_url,
            format: b.format || "",
            api_key: x || ""
          })
        });
        if (!Y.ok) throw new Error(`HTTP ${Y.status}`);
        const ve = await Y.json(), V = Math.round(performance.now() - y);
        return ve.source === "api" && Array.isArray(ve.models) && ve.models.length ? { state: "ok", count: ve.models.length, ms: V, models: ve.models } : { state: "error", message: ve.error || s("settings.connectionFailed"), ms: V };
      } catch (Y) {
        return { state: "error", message: Y instanceof Error ? Y.message : String(Y) };
      }
    }
    async function H(b, x = "") {
      w.value = { ...w.value, [b.id]: { state: "checking" } };
      const y = await P(b, x);
      w.value = { ...w.value, [b.id]: y };
    }
    function Z() {
      for (const b of _.providers) H(b);
    }
    function Q() {
      h.value = {
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
      }, $.value = "", T.value = { state: "idle" }, d.value = [], u.value = "", o.value = !1, r.value = !1, f.value = "edit";
    }
    function z(b) {
      h.value = {
        ...b,
        api_key: "",
        name: b.name || "",
        models: [...b.models],
        disabled_models: [...b.disabled_models || []],
        format: b.format || "",
        model_types: { ...b.model_types || {} }
      }, r.value = !!b.api_key_masked, $.value = "", T.value = { state: "idle" }, d.value = [], u.value = "", o.value = !1, f.value = "edit";
    }
    function N() {
      f.value = "list", h.value = null, $.value = "";
    }
    async function I() {
      const b = h.value;
      if (!b) return;
      $.value = "";
      const x = (b.name || "").trim();
      if (!b.base_url.trim()) {
        $.value = s("settings.baseUrlRequired");
        return;
      }
      if (b.provider === "custom" && !x) {
        $.value = s("settings.providerNameRequired");
        return;
      }
      if (!b.models.length) {
        $.value = s("settings.modelsRequired");
        return;
      }
      b.id || (b.id = `${b.provider}_${Date.now().toString(36)}`), b.name = x, b.disabled_models = (b.disabled_models || []).filter((y) => b.models.includes(y)), (!b.default_model || !b.models.includes(b.default_model) || b.disabled_models.includes(b.default_model)) && (b.default_model = O(b)[0] || b.models[0]), c.value = !0;
      try {
        await _.upsert({ ...b }), _.defaultProviderId || await _.setDefaults(b.id, b.default_model), N(), H(_.providers.find((y) => y.id === b.id) || b);
      } catch (y) {
        $.value = y instanceof Error ? y.message : String(y);
      } finally {
        c.value = !1;
      }
    }
    async function ke(b) {
      if (await v({
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
    async function ge(b) {
      try {
        await _.upsert({ ...b, enabled: !b.enabled });
      } catch {
      }
    }
    async function ce(b) {
      const x = b.default_model || O(b)[0] || b.models[0] || "";
      try {
        await _.setDefaults(b.id, x);
      } catch {
      }
    }
    async function he() {
      const b = h.value;
      if (!b) return;
      T.value = { state: "checking" };
      const x = await P(b, b.api_key);
      T.value = x, x.state === "ok" && x.models && (d.value = x.models);
    }
    function ee() {
      const b = h.value;
      !b || !d.value.length || (b.models = [...d.value], b.disabled_models = (b.disabled_models || []).filter((x) => b.models.includes(x)), b.models.includes(b.default_model) || (b.default_model = ""));
    }
    function we(b) {
      const x = h.value;
      if (!x) return;
      const y = new Set(x.disabled_models || []);
      y.has(b) ? y.delete(b) : y.add(b), x.disabled_models = [...y], y.has(x.default_model) && (x.default_model = O(x)[0] || "");
    }
    function $e(b) {
      const x = h.value;
      x && (x.default_model = b, x.disabled_models = (x.disabled_models || []).filter((y) => y !== b));
    }
    function Ce(b) {
      const x = h.value;
      x && (x.disabled_models = b ? [] : [...x.models]);
    }
    function Ae() {
      const b = h.value;
      if (!b) return;
      const x = new Set(b.disabled_models || []);
      b.disabled_models = b.models.filter((y) => !x.has(y));
    }
    const Me = q(() => {
      const b = h.value?.models || [], x = u.value.trim().toLowerCase();
      return x ? b.filter((y) => y.toLowerCase().includes(x)) : b;
    }), Ue = q(() => h.value ? O(h.value).length : 0);
    function Se() {
      return s("settings.fetchedSummary", { n: d.value.length });
    }
    const Ne = q(() => [
      { value: "", label: s("settings.formatAuto") },
      { value: "openai", label: s("settings.formatOpenai") },
      { value: "anthropic", label: s("settings.formatAnthropic") }
    ]), be = q(
      () => Ve.map((b) => ({ value: b.id, label: s(`providers.${b.id}.name`, b.name) }))
    );
    return (b, x) => (n(), i("div", bo, [
      f.value === "edit" && h.value ? (n(), i(B, { key: 0 }, [
        e("div", fo, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: N,
            "aria-label": t(s)("settings.back")
          }, [...x[11] || (x[11] = [
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
          ])], 8, yo),
          e("div", ko, [
            e("h2", null, l(h.value.id ? t(s)("settings.edit") : t(s)("settings.addProvider")), 1),
            e("p", wo, l(t(s)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: W(["pp-status", T.value.state])
          }, [
            x[12] || (x[12] = e("span", { class: "pp-dot" }, null, -1)),
            ie(" " + l(T.value.state === "checking" ? t(s)("settings.testing") : T.value.state === "ok" ? t(s)("settings.connectionOk") : T.value.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", $o, [
          e("h3", Co, l(t(s)("settings.providerSectionBasic")), 1),
          e("div", So, [
            e("div", Po, [
              e("label", null, l(t(s)("wizard.provider")), 1),
              X(t(pe), {
                modelValue: h.value.provider,
                "onUpdate:modelValue": x[0] || (x[0] = (y) => h.value.provider = y),
                class: "input",
                "aria-label": t(s)("wizard.provider"),
                options: be.value,
                onChange: U
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", xo, [
              e("label", null, [
                ie(l(t(s)("settings.providerName")) + " ", 1),
                h.value.provider === "custom" ? (n(), i("span", Mo, "*")) : E("", !0)
              ]),
              R(e("input", {
                "onUpdate:modelValue": x[1] || (x[1] = (y) => h.value.name = y),
                placeholder: t(s)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, Uo), [
                [K, h.value.name]
              ])
            ]),
            e("div", Eo, [
              e("label", null, l(t(s)("wizard.baseUrl")), 1),
              R(e("input", {
                "onUpdate:modelValue": x[2] || (x[2] = (y) => h.value.base_url = y),
                placeholder: t(s)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, To), [
                [K, h.value.base_url]
              ])
            ]),
            e("div", Ao, [
              e("label", null, l(t(s)("settings.apiFormat")), 1),
              X(t(pe), {
                modelValue: h.value.format,
                "onUpdate:modelValue": x[3] || (x[3] = (y) => h.value.format = y),
                class: "input",
                "aria-label": t(s)("settings.apiFormat"),
                options: Ne.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", No, l(t(s)("settings.apiFormatHint")), 1)
            ]),
            e("div", Vo, [
              e("label", null, l(t(s)("wizard.defaultModel")), 1),
              X(t(pe), {
                modelValue: h.value.default_model,
                "onUpdate:modelValue": x[4] || (x[4] = (y) => h.value.default_model = y),
                class: "input",
                "aria-label": t(s)("wizard.defaultModel"),
                options: O(h.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Ro, l(t(s)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", Oo, [
          e("div", Io, [
            e("h3", zo, l(t(s)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: T.value.state === "checking",
              onClick: he
            }, l(T.value.state === "checking" ? t(s)("settings.testing") : t(s)("settings.testConnection")), 9, Lo)
          ]),
          e("div", Do, [
            e("label", null, l(t(s)("wizard.apiKey")), 1),
            e("div", Fo, [
              R(e("input", {
                "onUpdate:modelValue": x[5] || (x[5] = (y) => h.value.api_key = y),
                type: o.value ? "text" : "password",
                placeholder: r.value ? t(s)("settings.apiKeyKept") : t(s)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, Bo), [
                [it, h.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: x[6] || (x[6] = (y) => o.value = !o.value)
              }, l(o.value ? t(s)("settings.hideKey") : t(s)("settings.showKey")), 1)
            ]),
            r.value ? (n(), i("p", Ko, l(t(s)("settings.apiKeyKeptHint")), 1)) : E("", !0),
            T.value.state === "error" ? (n(), i("p", Ho, l(T.value.message), 1)) : T.value.state === "ok" ? (n(), i("p", jo, l(t(s)("settings.connectionOk")) + " · " + l(Se()) + " · " + l(T.value.ms) + "ms ", 1)) : E("", !0)
          ])
        ]),
        e("section", Yo, [
          e("div", Jo, [
            e("h3", Wo, [
              ie(l(t(s)("settings.providerSectionModels")) + " ", 1),
              e("span", qo, l(Ue.value) + "/" + l(h.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: T.value.state === "checking",
              onClick: he
            }, l(t(s)("settings.fetchModels")), 9, Go)
          ]),
          d.value.length && d.value.join("\0") !== h.value.models.join("\0") ? (n(), i("div", Xo, [
            e("span", null, l(Se()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: ee
            }, l(t(s)("settings.applyFetched")), 1)
          ])) : E("", !0),
          e("div", Zo, [
            R(e("input", {
              "onUpdate:modelValue": x[7] || (x[7] = (y) => u.value = y),
              class: "input pp-search",
              placeholder: t(s)("settings.searchModels")
            }, null, 8, Qo), [
              [K, u.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: x[8] || (x[8] = (y) => Ce(!0))
            }, l(t(s)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: x[9] || (x[9] = (y) => Ae())
            }, l(t(s)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: x[10] || (x[10] = (y) => Ce(!1))
            }, l(t(s)("settings.clearSelection")), 1)
          ]),
          h.value.models.length ? (n(), i("div", en, [
            (n(!0), i(B, null, G(Me.value, (y) => (n(), i("div", {
              key: y,
              class: W(["pp-model", { off: (h.value.disabled_models || []).includes(y) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: y
              }, l(y), 9, tn),
              e("select", {
                class: W(["pp-type", { tagged: C(y) !== "chat" }]),
                value: C(y),
                title: t(s)("settings.providerModelType"),
                onChange: (Y) => L(y, Y.target.value)
              }, [
                (n(!0), i(B, null, G(k.value, (Y) => (n(), i("option", {
                  key: Y.value,
                  value: Y.value
                }, l(Y.label), 9, ln))), 128))
              ], 42, sn),
              h.value.default_model !== y ? (n(), i("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: t(s)("settings.makeDefault"),
                disabled: (h.value.disabled_models || []).includes(y),
                onClick: (Y) => $e(y)
              }, "☆", 8, on)) : (n(), i("span", {
                key: 1,
                class: "pp-star on",
                title: t(s)("wizard.defaultModel")
              }, "★", 8, nn)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(h.value.disabled_models || []).includes(y),
                onChange: (Y) => we(y)
              }, null, 40, an)
            ], 2))), 128)),
            Me.value.length ? E("", !0) : (n(), i("p", rn, l(t(s)("settings.searchModels")), 1))
          ])) : (n(), i("p", un, l(t(s)("settings.noModelsYet")), 1))
        ]),
        $.value ? (n(), i("p", dn, l($.value), 1)) : E("", !0),
        e("div", cn, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: c.value,
            onClick: I
          }, l(c.value ? t(s)("settings.saving") : t(s)("settings.save")), 9, pn),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: N
          }, l(t(s)("settings.cancel")), 1)
        ])
      ], 64)) : (n(), i(B, { key: 1 }, [
        e("div", hn, [
          e("div", null, [
            e("h2", null, l(t(s)("settings.tabs.provider")), 1),
            e("p", vn, l(t(s)("settings.providerDesc")), 1)
          ]),
          e("div", mn, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: Z
            }, l(t(s)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: Q
            }, "+ " + l(t(s)("settings.addProvider")), 1)
          ])
        ]),
        t(_).providers.length ? (n(), i("div", _n, [
          (n(!0), i(B, null, G(t(_).providers, (y) => (n(), i("article", {
            key: y.id,
            class: W(["pp-card", { off: !y.enabled, default: D(y) }])
          }, [
            e("header", gn, [
              e("span", bn, [
                p(y) ? (n(), i("img", {
                  key: 0,
                  src: p(y),
                  alt: g(y)
                }, null, 8, fn)) : (n(), i("svg", yn, [...x[13] || (x[13] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", kn, [
                e("strong", null, l(g(y)), 1),
                e("code", {
                  title: y.base_url
                }, l(y.base_url || "—"), 9, wn)
              ]),
              e("div", $n, [
                D(y) ? (n(), i("span", Cn, l(t(s)("settings.default")), 1)) : E("", !0),
                e("span", Sn, l(O(y).length) + "/" + l(y.models.length), 1)
              ])
            ]),
            e("div", Pn, [
              e("span", {
                class: W(["pp-status", w.value[y.id]?.state || "idle"])
              }, [
                x[14] || (x[14] = e("span", { class: "pp-dot" }, null, -1)),
                ie(" " + l(w.value[y.id]?.state === "checking" ? t(s)("settings.testing") : w.value[y.id]?.state === "ok" ? t(s)("settings.connectionOk") : w.value[y.id]?.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
              ], 2),
              w.value[y.id]?.state === "ok" ? (n(), i("span", xn, l(t(s)("settings.fetchedSummary", { n: w.value[y.id]?.count || 0 })) + " · " + l(w.value[y.id]?.ms) + "ms", 1)) : w.value[y.id]?.state === "error" ? (n(), i("span", {
                key: 1,
                class: "pp-meta err",
                title: w.value[y.id]?.message
              }, l(w.value[y.id]?.message), 9, Mn)) : E("", !0)
            ]),
            e("div", Un, [
              (n(!0), i(B, null, G(O(y).slice(0, 6), (Y) => (n(), i("span", {
                key: Y,
                class: "pp-chip"
              }, l(Y), 1))), 128)),
              O(y).length > 6 ? (n(), i("span", En, "+" + l(O(y).length - 6), 1)) : E("", !0),
              y.models.length ? E("", !0) : (n(), i("span", Tn, l(t(s)("settings.noModelsYet")), 1))
            ]),
            e("footer", An, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (Y) => z(y)
              }, l(t(s)("settings.edit")), 9, Nn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: w.value[y.id]?.state === "checking",
                onClick: (Y) => H(y)
              }, l(t(s)("settings.testConnection")), 9, Vn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: D(y),
                onClick: (Y) => ce(y)
              }, l(t(s)("settings.makeDefault")), 9, Rn),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (Y) => ge(y)
              }, l(y.enabled ? t(s)("settings.disableProvider") : t(s)("settings.enableProvider")), 9, On),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (Y) => ke(y)
              }, l(t(s)("settings.remove")), 9, In)
            ])
          ], 2))), 128))
        ])) : (n(), i("div", zn, [
          e("p", null, l(t(s)("settings.noProviders")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: Q
          }, "+ " + l(t(s)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), Dn = /* @__PURE__ */ de(Ln, [["__scopeId", "data-v-630e57ef"]]), Fn = { class: "pairing-panel" }, Bn = {
  key: 0,
  class: "pairing-error",
  role: "alert"
}, Kn = { key: 1 }, Hn = { key: 0 }, jn = ["onClick"], Yn = ["onClick"], Jn = ["disabled", "onClick"], Wn = /* @__PURE__ */ te({
  __name: "PairingPanel",
  setup(F) {
    const { t: s } = le(), { confirm: v } = xe(), _ = S([]), w = S([]), f = S(""), h = S("");
    let $;
    async function T() {
      try {
        const o = await fetch("/api/pairing/pending");
        if (!o.ok) throw new Error(await o.text());
        _.value = (await o.json()).requests || [];
      } catch (o) {
        f.value = o.message;
      }
      try {
        const o = await fetch("/api/pairing/devices");
        o.ok && (w.value = (await o.json()).devices || []);
      } catch {
      }
    }
    async function d(o, r) {
      try {
        const c = await fetch("/api/pairing/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...o, allow: r })
        });
        if (!c.ok) throw new Error(await c.text());
        await T();
      } catch (c) {
        f.value = c.message;
      }
    }
    async function u(o) {
      if (!(h.value || !await v({
        title: s("pairing.disconnect"),
        message: s("pairing.disconnectConfirm", { name: o.name || o.id }),
        confirmLabel: s("pairing.disconnect"),
        danger: !0
      }))) {
        h.value = o.id;
        try {
          const c = await fetch("/api/pairing/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: o.id })
          });
          if (!c.ok) throw new Error(await c.text());
          await T();
        } catch (c) {
          f.value = c.message;
        } finally {
          h.value = "";
        }
      }
    }
    return ue(() => {
      T(), $ = setInterval(T, 3e3);
    }), Ie(() => clearInterval($)), (o, r) => (n(), i("section", Fn, [
      e("h3", null, l(t(s)("pairing.title")), 1),
      e("p", null, l(t(s)("pairing.hint")), 1),
      f.value ? (n(), i("p", Bn, l(f.value), 1)) : E("", !0),
      _.value.length ? E("", !0) : (n(), i("p", Kn, l(t(s)("pairing.empty")), 1)),
      X(Fe, {
        tag: "div",
        name: "pair",
        class: "pairing-list"
      }, {
        default: Oe(() => [
          (n(!0), i(B, null, G(_.value, (c) => (n(), i("article", {
            key: c.id
          }, [
            e("strong", null, l(c.name), 1),
            e("code", null, l(c.code), 1),
            c.approved ? (n(), i("span", Hn, l(t(s)("pairing.approved")), 1)) : (n(), i(B, { key: 1 }, [
              e("button", {
                type: "button",
                class: "btn btn-ghost",
                onClick: (m) => d(c, !1)
              }, l(t(s)("pairing.deny")), 9, jn),
              e("button", {
                type: "button",
                class: "btn btn-primary",
                onClick: (m) => d(c, !0)
              }, l(t(s)("pairing.allow")), 9, Yn)
            ], 64))
          ]))), 128))
        ]),
        _: 1
      }),
      w.value.length ? (n(), i(B, { key: 2 }, [
        e("h4", null, l(t(s)("pairing.pairedCount", { n: w.value.length })), 1),
        X(Fe, {
          tag: "div",
          name: "pair",
          class: "pairing-list"
        }, {
          default: Oe(() => [
            (n(!0), i(B, null, G(w.value, (c) => (n(), i("article", {
              key: c.id
            }, [
              e("strong", null, l(c.name || c.id), 1),
              e("button", {
                type: "button",
                class: "btn btn-danger-tonal",
                disabled: h.value === c.id,
                onClick: (m) => u(c)
              }, l(h.value === c.id ? t(s)("pairing.disconnecting") : t(s)("pairing.disconnect")), 9, Jn)
            ]))), 128))
          ]),
          _: 1
        })
      ], 64)) : E("", !0)
    ]));
  }
}), qn = /* @__PURE__ */ de(Wn, [["__scopeId", "data-v-c18959f6"]]), Gn = { class: "content-card" }, Xn = { class: "card-desc" }, Zn = { class: "field" }, Qn = ["aria-label"], ea = ["aria-pressed", "onClick"], ta = /* @__PURE__ */ te({
  __name: "GeneralPanel",
  setup(F) {
    const { t: s } = le(), v = S(ht());
    function _(w) {
      v.value = w, mt(w);
    }
    return (w, f) => (n(), i("div", Gn, [
      e("h2", null, l(t(s)("settings.tabs.general")), 1),
      e("p", Xn, l(t(s)("settings.generalDesc")), 1),
      e("div", Zn, [
        e("label", null, l(t(s)("settings.language")), 1),
        e("div", {
          class: "segmented",
          role: "group",
          "aria-label": t(s)("settings.language")
        }, [
          (n(!0), i(B, null, G(t(vt), (h) => (n(), i("button", {
            key: h.code,
            class: W(["seg", { active: v.value === h.code }]),
            "aria-pressed": v.value === h.code,
            onClick: ($) => _(h.code)
          }, l(h.label), 11, ea))), 128))
        ], 8, Qn)
      ]),
      X(qn)
    ]));
  }
});
var fe;
((F) => {
  const h = class h {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code with the given version number,
    // error correction level, data codeword bytes, and mask number.
    // This is a low-level API that most users should not use directly.
    // A mid-level API is the encodeSegments() function.
    constructor(d, u, o, r) {
      j(this, "version");
      j(this, "errorCorrectionLevel");
      /*-- Fields --*/
      // The width and height of this QR Code, measured in modules, between
      // 21 and 177 (inclusive). This is equal to version * 4 + 17.
      j(this, "size");
      // The index of the mask pattern used in this QR Code, which is between 0 and 7 (inclusive).
      // Even if a QR Code is created with automatic masking requested (mask = -1),
      // the resulting object still has a mask value between 0 and 7.
      j(this, "mask");
      // The modules of this QR Code (false = light, true = dark).
      // Immutable after constructor finishes. Accessed through getModule().
      j(this, "modules", []);
      // Indicates function modules that are not subjected to masking. Discarded when constructor finishes.
      j(this, "isFunction", []);
      if (this.version = d, this.errorCorrectionLevel = u, d < h.MIN_VERSION || d > h.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (r < -1 || r > 7)
        throw new RangeError("Mask value out of range");
      this.size = d * 4 + 17;
      let c = [];
      for (let g = 0; g < this.size; g++)
        c.push(!1);
      for (let g = 0; g < this.size; g++)
        this.modules.push(c.slice()), this.isFunction.push(c.slice());
      this.drawFunctionPatterns();
      const m = this.addEccAndInterleave(o);
      if (this.drawCodewords(m), r == -1) {
        let g = 1e9;
        for (let p = 0; p < 8; p++) {
          this.applyMask(p), this.drawFormatBits(p);
          const k = this.getPenaltyScore();
          k < g && (r = p, g = k), this.applyMask(p);
        }
      }
      w(0 <= r && r <= 7), this.mask = r, this.applyMask(r), this.drawFormatBits(r), this.isFunction = [];
    }
    /*-- Static factory functions (high level) --*/
    // Returns a QR Code representing the given Unicode text string at the given error correction level.
    // As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer
    // Unicode code points (not UTF-16 code units) if the low error correction level is used. The smallest possible
    // QR Code version is automatically chosen for the output. The ECC level of the result may be higher than the
    // ecl argument if it can be done without increasing the version.
    static encodeText(d, u) {
      const o = F.QrSegment.makeSegments(d);
      return h.encodeSegments(o, u);
    }
    // Returns a QR Code representing the given binary data at the given error correction level.
    // This function always encodes using the binary segment mode, not any text mode. The maximum number of
    // bytes allowed is 2953. The smallest possible QR Code version is automatically chosen for the output.
    // The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
    static encodeBinary(d, u) {
      const o = F.QrSegment.makeBytes(d);
      return h.encodeSegments([o], u);
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
    static encodeSegments(d, u, o = 1, r = 40, c = -1, m = !0) {
      if (!(h.MIN_VERSION <= o && o <= r && r <= h.MAX_VERSION) || c < -1 || c > 7)
        throw new RangeError("Invalid value");
      let g, p;
      for (g = o; ; g++) {
        const O = h.getNumDataCodewords(g, u) * 8, D = f.getTotalBits(d, g);
        if (D <= O) {
          p = D;
          break;
        }
        if (g >= r)
          throw new RangeError("Data too long");
      }
      for (const O of [h.Ecc.MEDIUM, h.Ecc.QUARTILE, h.Ecc.HIGH])
        m && p <= h.getNumDataCodewords(g, O) * 8 && (u = O);
      let k = [];
      for (const O of d) {
        v(O.mode.modeBits, 4, k), v(O.numChars, O.mode.numCharCountBits(g), k);
        for (const D of O.getData())
          k.push(D);
      }
      w(k.length == p);
      const C = h.getNumDataCodewords(g, u) * 8;
      w(k.length <= C), v(0, Math.min(4, C - k.length), k), v(0, (8 - k.length % 8) % 8, k), w(k.length % 8 == 0);
      for (let O = 236; k.length < C; O ^= 253)
        v(O, 8, k);
      let L = [];
      for (; L.length * 8 < k.length; )
        L.push(0);
      return k.forEach((O, D) => L[D >>> 3] |= O << 7 - (D & 7)), new h(g, u, L, c);
    }
    /*-- Accessor methods --*/
    // Returns the color of the module (pixel) at the given coordinates, which is false
    // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
    // If the given coordinates are out of bounds, then false (light) is returned.
    getModule(d, u) {
      return 0 <= d && d < this.size && 0 <= u && u < this.size && this.modules[u][d];
    }
    /*-- Private helper methods for constructor: Drawing function modules --*/
    // Reads this object's version field, and draws and marks all function modules.
    drawFunctionPatterns() {
      for (let o = 0; o < this.size; o++)
        this.setFunctionModule(6, o, o % 2 == 0), this.setFunctionModule(o, 6, o % 2 == 0);
      this.drawFinderPattern(3, 3), this.drawFinderPattern(this.size - 4, 3), this.drawFinderPattern(3, this.size - 4);
      const d = this.getAlignmentPatternPositions(), u = d.length;
      for (let o = 0; o < u; o++)
        for (let r = 0; r < u; r++)
          o == 0 && r == 0 || o == 0 && r == u - 1 || o == u - 1 && r == 0 || this.drawAlignmentPattern(d[o], d[r]);
      this.drawFormatBits(0), this.drawVersion();
    }
    // Draws two copies of the format bits (with its own error correction code)
    // based on the given mask and this object's error correction level field.
    drawFormatBits(d) {
      const u = this.errorCorrectionLevel.formatBits << 3 | d;
      let o = u;
      for (let c = 0; c < 10; c++)
        o = o << 1 ^ (o >>> 9) * 1335;
      const r = (u << 10 | o) ^ 21522;
      w(r >>> 15 == 0);
      for (let c = 0; c <= 5; c++)
        this.setFunctionModule(8, c, _(r, c));
      this.setFunctionModule(8, 7, _(r, 6)), this.setFunctionModule(8, 8, _(r, 7)), this.setFunctionModule(7, 8, _(r, 8));
      for (let c = 9; c < 15; c++)
        this.setFunctionModule(14 - c, 8, _(r, c));
      for (let c = 0; c < 8; c++)
        this.setFunctionModule(this.size - 1 - c, 8, _(r, c));
      for (let c = 8; c < 15; c++)
        this.setFunctionModule(8, this.size - 15 + c, _(r, c));
      this.setFunctionModule(8, this.size - 8, !0);
    }
    // Draws two copies of the version bits (with its own error correction code),
    // based on this object's version field, iff 7 <= version <= 40.
    drawVersion() {
      if (this.version < 7)
        return;
      let d = this.version;
      for (let o = 0; o < 12; o++)
        d = d << 1 ^ (d >>> 11) * 7973;
      const u = this.version << 12 | d;
      w(u >>> 18 == 0);
      for (let o = 0; o < 18; o++) {
        const r = _(u, o), c = this.size - 11 + o % 3, m = Math.floor(o / 3);
        this.setFunctionModule(c, m, r), this.setFunctionModule(m, c, r);
      }
    }
    // Draws a 9*9 finder pattern including the border separator,
    // with the center module at (x, y). Modules can be out of bounds.
    drawFinderPattern(d, u) {
      for (let o = -4; o <= 4; o++)
        for (let r = -4; r <= 4; r++) {
          const c = Math.max(Math.abs(r), Math.abs(o)), m = d + r, g = u + o;
          0 <= m && m < this.size && 0 <= g && g < this.size && this.setFunctionModule(m, g, c != 2 && c != 4);
        }
    }
    // Draws a 5*5 alignment pattern, with the center module
    // at (x, y). All modules must be in bounds.
    drawAlignmentPattern(d, u) {
      for (let o = -2; o <= 2; o++)
        for (let r = -2; r <= 2; r++)
          this.setFunctionModule(d + r, u + o, Math.max(Math.abs(r), Math.abs(o)) != 1);
    }
    // Sets the color of a module and marks it as a function module.
    // Only used by the constructor. Coordinates must be in bounds.
    setFunctionModule(d, u, o) {
      this.modules[u][d] = o, this.isFunction[u][d] = !0;
    }
    /*-- Private helper methods for constructor: Codewords and masking --*/
    // Returns a new byte string representing the given data with the appropriate error correction
    // codewords appended to it, based on this object's version and error correction level.
    addEccAndInterleave(d) {
      const u = this.version, o = this.errorCorrectionLevel;
      if (d.length != h.getNumDataCodewords(u, o))
        throw new RangeError("Invalid argument");
      const r = h.NUM_ERROR_CORRECTION_BLOCKS[o.ordinal][u], c = h.ECC_CODEWORDS_PER_BLOCK[o.ordinal][u], m = Math.floor(h.getNumRawDataModules(u) / 8), g = r - m % r, p = Math.floor(m / r);
      let k = [];
      const C = h.reedSolomonComputeDivisor(c);
      for (let O = 0, D = 0; O < r; O++) {
        let U = d.slice(D, D + p - c + (O < g ? 0 : 1));
        D += U.length;
        const P = h.reedSolomonComputeRemainder(U, C);
        O < g && U.push(0), k.push(U.concat(P));
      }
      let L = [];
      for (let O = 0; O < k[0].length; O++)
        k.forEach((D, U) => {
          (O != p - c || U >= g) && L.push(D[O]);
        });
      return w(L.length == m), L;
    }
    // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
    // data area of this QR Code. Function modules need to be marked off before this is called.
    drawCodewords(d) {
      if (d.length != Math.floor(h.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let u = 0;
      for (let o = this.size - 1; o >= 1; o -= 2) {
        o == 6 && (o = 5);
        for (let r = 0; r < this.size; r++)
          for (let c = 0; c < 2; c++) {
            const m = o - c, p = (o + 1 & 2) == 0 ? this.size - 1 - r : r;
            !this.isFunction[p][m] && u < d.length * 8 && (this.modules[p][m] = _(d[u >>> 3], 7 - (u & 7)), u++);
          }
      }
      w(u == d.length * 8);
    }
    // XORs the codeword modules in this QR Code with the given mask pattern.
    // The function modules must be marked and the codeword bits must be drawn
    // before masking. Due to the arithmetic of XOR, calling applyMask() with
    // the same mask value a second time will undo the mask. A final well-formed
    // QR Code needs exactly one (not zero, two, etc.) mask applied.
    applyMask(d) {
      if (d < 0 || d > 7)
        throw new RangeError("Mask value out of range");
      for (let u = 0; u < this.size; u++)
        for (let o = 0; o < this.size; o++) {
          let r;
          switch (d) {
            case 0:
              r = (o + u) % 2 == 0;
              break;
            case 1:
              r = u % 2 == 0;
              break;
            case 2:
              r = o % 3 == 0;
              break;
            case 3:
              r = (o + u) % 3 == 0;
              break;
            case 4:
              r = (Math.floor(o / 3) + Math.floor(u / 2)) % 2 == 0;
              break;
            case 5:
              r = o * u % 2 + o * u % 3 == 0;
              break;
            case 6:
              r = (o * u % 2 + o * u % 3) % 2 == 0;
              break;
            case 7:
              r = ((o + u) % 2 + o * u % 3) % 2 == 0;
              break;
            default:
              throw new Error("Unreachable");
          }
          !this.isFunction[u][o] && r && (this.modules[u][o] = !this.modules[u][o]);
        }
    }
    // Calculates and returns the penalty score based on state of this QR Code's current modules.
    // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
    getPenaltyScore() {
      let d = 0;
      for (let c = 0; c < this.size; c++) {
        let m = !1, g = 0, p = [0, 0, 0, 0, 0, 0, 0];
        for (let k = 0; k < this.size; k++)
          this.modules[c][k] == m ? (g++, g == 5 ? d += h.PENALTY_N1 : g > 5 && d++) : (this.finderPenaltyAddHistory(g, p), m || (d += this.finderPenaltyCountPatterns(p) * h.PENALTY_N3), m = this.modules[c][k], g = 1);
        d += this.finderPenaltyTerminateAndCount(m, g, p) * h.PENALTY_N3;
      }
      for (let c = 0; c < this.size; c++) {
        let m = !1, g = 0, p = [0, 0, 0, 0, 0, 0, 0];
        for (let k = 0; k < this.size; k++)
          this.modules[k][c] == m ? (g++, g == 5 ? d += h.PENALTY_N1 : g > 5 && d++) : (this.finderPenaltyAddHistory(g, p), m || (d += this.finderPenaltyCountPatterns(p) * h.PENALTY_N3), m = this.modules[k][c], g = 1);
        d += this.finderPenaltyTerminateAndCount(m, g, p) * h.PENALTY_N3;
      }
      for (let c = 0; c < this.size - 1; c++)
        for (let m = 0; m < this.size - 1; m++) {
          const g = this.modules[c][m];
          g == this.modules[c][m + 1] && g == this.modules[c + 1][m] && g == this.modules[c + 1][m + 1] && (d += h.PENALTY_N2);
        }
      let u = 0;
      for (const c of this.modules)
        u = c.reduce((m, g) => m + (g ? 1 : 0), u);
      const o = this.size * this.size, r = Math.ceil(Math.abs(u * 20 - o * 10) / o) - 1;
      return w(0 <= r && r <= 9), d += r * h.PENALTY_N4, w(0 <= d && d <= 2568888), d;
    }
    /*-- Private helper functions --*/
    // Returns an ascending list of positions of alignment patterns for this version number.
    // Each position is in the range [0,177), and are used on both the x and y axes.
    // This could be implemented as lookup table of 40 variable-length lists of integers.
    getAlignmentPatternPositions() {
      if (this.version == 1)
        return [];
      {
        const d = Math.floor(this.version / 7) + 2, u = Math.floor((this.version * 8 + d * 3 + 5) / (d * 4 - 4)) * 2;
        let o = [6];
        for (let r = this.size - 7; o.length < d; r -= u)
          o.splice(1, 0, r);
        return o;
      }
    }
    // Returns the number of data bits that can be stored in a QR Code of the given version number, after
    // all function modules are excluded. This includes remainder bits, so it might not be a multiple of 8.
    // The result is in the range [208, 29648]. This could be implemented as a 40-entry lookup table.
    static getNumRawDataModules(d) {
      if (d < h.MIN_VERSION || d > h.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let u = (16 * d + 128) * d + 64;
      if (d >= 2) {
        const o = Math.floor(d / 7) + 2;
        u -= (25 * o - 10) * o - 55, d >= 7 && (u -= 36);
      }
      return w(208 <= u && u <= 29648), u;
    }
    // Returns the number of 8-bit data (i.e. not error correction) codewords contained in any
    // QR Code of the given version number and error correction level, with remainder bits discarded.
    // This stateless pure function could be implemented as a (40*4)-cell lookup table.
    static getNumDataCodewords(d, u) {
      return Math.floor(h.getNumRawDataModules(d) / 8) - h.ECC_CODEWORDS_PER_BLOCK[u.ordinal][d] * h.NUM_ERROR_CORRECTION_BLOCKS[u.ordinal][d];
    }
    // Returns a Reed-Solomon ECC generator polynomial for the given degree. This could be
    // implemented as a lookup table over all possible parameter values, instead of as an algorithm.
    static reedSolomonComputeDivisor(d) {
      if (d < 1 || d > 255)
        throw new RangeError("Degree out of range");
      let u = [];
      for (let r = 0; r < d - 1; r++)
        u.push(0);
      u.push(1);
      let o = 1;
      for (let r = 0; r < d; r++) {
        for (let c = 0; c < u.length; c++)
          u[c] = h.reedSolomonMultiply(u[c], o), c + 1 < u.length && (u[c] ^= u[c + 1]);
        o = h.reedSolomonMultiply(o, 2);
      }
      return u;
    }
    // Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.
    static reedSolomonComputeRemainder(d, u) {
      let o = u.map((r) => 0);
      for (const r of d) {
        const c = r ^ o.shift();
        o.push(0), u.forEach((m, g) => o[g] ^= h.reedSolomonMultiply(m, c));
      }
      return o;
    }
    // Returns the product of the two given field elements modulo GF(2^8/0x11D). The arguments and result
    // are unsigned 8-bit integers. This could be implemented as a lookup table of 256*256 entries of uint8.
    static reedSolomonMultiply(d, u) {
      if (d >>> 8 || u >>> 8)
        throw new RangeError("Byte out of range");
      let o = 0;
      for (let r = 7; r >= 0; r--)
        o = o << 1 ^ (o >>> 7) * 285, o ^= (u >>> r & 1) * d;
      return w(o >>> 8 == 0), o;
    }
    // Can only be called immediately after a light run is added, and
    // returns either 0, 1, or 2. A helper function for getPenaltyScore().
    finderPenaltyCountPatterns(d) {
      const u = d[1];
      w(u <= this.size * 3);
      const o = u > 0 && d[2] == u && d[3] == u * 3 && d[4] == u && d[5] == u;
      return (o && d[0] >= u * 4 && d[6] >= u ? 1 : 0) + (o && d[6] >= u * 4 && d[0] >= u ? 1 : 0);
    }
    // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
    finderPenaltyTerminateAndCount(d, u, o) {
      return d && (this.finderPenaltyAddHistory(u, o), u = 0), u += this.size, this.finderPenaltyAddHistory(u, o), this.finderPenaltyCountPatterns(o);
    }
    // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
    finderPenaltyAddHistory(d, u) {
      u[0] == 0 && (d += this.size), u.pop(), u.unshift(d);
    }
  };
  /*-- Constants and tables --*/
  // The minimum version number supported in the QR Code Model 2 standard.
  j(h, "MIN_VERSION", 1), // The maximum version number supported in the QR Code Model 2 standard.
  j(h, "MAX_VERSION", 40), // For use in getPenaltyScore(), when evaluating which mask is best.
  j(h, "PENALTY_N1", 3), j(h, "PENALTY_N2", 3), j(h, "PENALTY_N3", 40), j(h, "PENALTY_N4", 10), j(h, "ECC_CODEWORDS_PER_BLOCK", [
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
  ]), j(h, "NUM_ERROR_CORRECTION_BLOCKS", [
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
  let s = h;
  F.QrCode = s;
  function v(T, d, u) {
    if (d < 0 || d > 31 || T >>> d)
      throw new RangeError("Value out of range");
    for (let o = d - 1; o >= 0; o--)
      u.push(T >>> o & 1);
  }
  function _(T, d) {
    return (T >>> d & 1) != 0;
  }
  function w(T) {
    if (!T)
      throw new Error("Assertion error");
  }
  const $ = class $ {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code segment with the given attributes and data.
    // The character count (numChars) must agree with the mode and the bit buffer length,
    // but the constraint isn't checked. The given bit buffer is cloned and stored.
    constructor(d, u, o) {
      j(this, "mode");
      j(this, "numChars");
      j(this, "bitData");
      if (this.mode = d, this.numChars = u, this.bitData = o, u < 0)
        throw new RangeError("Invalid argument");
      this.bitData = o.slice();
    }
    /*-- Static factory functions (mid level) --*/
    // Returns a segment representing the given binary data encoded in
    // byte mode. All input byte arrays are acceptable. Any text string
    // can be converted to UTF-8 bytes and encoded as a byte mode segment.
    static makeBytes(d) {
      let u = [];
      for (const o of d)
        v(o, 8, u);
      return new $($.Mode.BYTE, d.length, u);
    }
    // Returns a segment representing the given string of decimal digits encoded in numeric mode.
    static makeNumeric(d) {
      if (!$.isNumeric(d))
        throw new RangeError("String contains non-numeric characters");
      let u = [];
      for (let o = 0; o < d.length; ) {
        const r = Math.min(d.length - o, 3);
        v(parseInt(d.substring(o, o + r), 10), r * 3 + 1, u), o += r;
      }
      return new $($.Mode.NUMERIC, d.length, u);
    }
    // Returns a segment representing the given text string encoded in alphanumeric mode.
    // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
    // dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static makeAlphanumeric(d) {
      if (!$.isAlphanumeric(d))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let u = [], o;
      for (o = 0; o + 2 <= d.length; o += 2) {
        let r = $.ALPHANUMERIC_CHARSET.indexOf(d.charAt(o)) * 45;
        r += $.ALPHANUMERIC_CHARSET.indexOf(d.charAt(o + 1)), v(r, 11, u);
      }
      return o < d.length && v($.ALPHANUMERIC_CHARSET.indexOf(d.charAt(o)), 6, u), new $($.Mode.ALPHANUMERIC, d.length, u);
    }
    // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
    // The result may use various segment modes and switch modes to optimize the length of the bit stream.
    static makeSegments(d) {
      return d == "" ? [] : $.isNumeric(d) ? [$.makeNumeric(d)] : $.isAlphanumeric(d) ? [$.makeAlphanumeric(d)] : [$.makeBytes($.toUtf8ByteArray(d))];
    }
    // Returns a segment representing an Extended Channel Interpretation
    // (ECI) designator with the given assignment value.
    static makeEci(d) {
      let u = [];
      if (d < 0)
        throw new RangeError("ECI assignment value out of range");
      if (d < 128)
        v(d, 8, u);
      else if (d < 16384)
        v(2, 2, u), v(d, 14, u);
      else if (d < 1e6)
        v(6, 3, u), v(d, 21, u);
      else
        throw new RangeError("ECI assignment value out of range");
      return new $($.Mode.ECI, 0, u);
    }
    // Tests whether the given string can be encoded as a segment in numeric mode.
    // A string is encodable iff each character is in the range 0 to 9.
    static isNumeric(d) {
      return $.NUMERIC_REGEX.test(d);
    }
    // Tests whether the given string can be encoded as a segment in alphanumeric mode.
    // A string is encodable iff each character is in the following set: 0 to 9, A to Z
    // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static isAlphanumeric(d) {
      return $.ALPHANUMERIC_REGEX.test(d);
    }
    /*-- Methods --*/
    // Returns a new copy of the data bits of this segment.
    getData() {
      return this.bitData.slice();
    }
    // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
    // the given version. The result is infinity if a segment has too many characters to fit its length field.
    static getTotalBits(d, u) {
      let o = 0;
      for (const r of d) {
        const c = r.mode.numCharCountBits(u);
        if (r.numChars >= 1 << c)
          return 1 / 0;
        o += 4 + c + r.bitData.length;
      }
      return o;
    }
    // Returns a new array of bytes representing the given string encoded in UTF-8.
    static toUtf8ByteArray(d) {
      d = encodeURI(d);
      let u = [];
      for (let o = 0; o < d.length; o++)
        d.charAt(o) != "%" ? u.push(d.charCodeAt(o)) : (u.push(parseInt(d.substring(o + 1, o + 3), 16)), o += 2);
      return u;
    }
  };
  /*-- Constants --*/
  // Describes precisely all strings that are encodable in numeric mode.
  j($, "NUMERIC_REGEX", /^[0-9]*$/), // Describes precisely all strings that are encodable in alphanumeric mode.
  j($, "ALPHANUMERIC_REGEX", /^[A-Z0-9 $%*+.\/:-]*$/), // The set of all legal characters in alphanumeric mode,
  // where each character value maps to the index in the string.
  j($, "ALPHANUMERIC_CHARSET", "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:");
  let f = $;
  F.QrSegment = f;
})(fe || (fe = {}));
((F) => {
  ((s) => {
    const _ = class _ {
      // The QR Code can tolerate about 30% erroneous codewords
      /*-- Constructor and fields --*/
      constructor(f, h) {
        j(this, "ordinal");
        j(this, "formatBits");
        this.ordinal = f, this.formatBits = h;
      }
    };
    /*-- Constants --*/
    j(_, "LOW", new _(0, 1)), // The QR Code can tolerate about  7% erroneous codewords
    j(_, "MEDIUM", new _(1, 0)), // The QR Code can tolerate about 15% erroneous codewords
    j(_, "QUARTILE", new _(2, 3)), // The QR Code can tolerate about 25% erroneous codewords
    j(_, "HIGH", new _(3, 2));
    let v = _;
    s.Ecc = v;
  })(F.QrCode || (F.QrCode = {}));
})(fe || (fe = {}));
((F) => {
  ((s) => {
    const _ = class _ {
      /*-- Constructor and fields --*/
      constructor(f, h) {
        j(this, "modeBits");
        j(this, "numBitsCharCount");
        this.modeBits = f, this.numBitsCharCount = h;
      }
      /*-- Method --*/
      // (Package-private) Returns the bit width of the character count field for a segment in
      // this mode in a QR Code at the given version number. The result is in the range [0, 16].
      numCharCountBits(f) {
        return this.numBitsCharCount[Math.floor((f + 7) / 17)];
      }
    };
    /*-- Constants --*/
    j(_, "NUMERIC", new _(1, [10, 12, 14])), j(_, "ALPHANUMERIC", new _(2, [9, 11, 13])), j(_, "BYTE", new _(4, [8, 16, 16])), j(_, "KANJI", new _(8, [8, 10, 12])), j(_, "ECI", new _(7, [0, 0, 0]));
    let v = _;
    s.Mode = v;
  })(F.QrSegment || (F.QrSegment = {}));
})(fe || (fe = {}));
const Ye = fe, sa = { class: "content-card" }, la = { class: "card-desc" }, oa = { class: "connection-grid" }, na = { class: "connection-form" }, aa = { class: "field" }, ia = ["placeholder"], ra = { class: "field" }, ua = { class: "toggle-label" }, da = { class: "field" }, ca = ["placeholder"], pa = { class: "field" }, ha = ["placeholder"], va = { class: "field" }, ma = { class: "helper-text" }, _a = { key: 0 }, ga = { key: 1 }, ba = { class: "actions-row" }, fa = { class: "connection-qr" }, ya = ["viewBox"], ka = ["width", "height"], wa = ["x", "y"], $a = { class: "connection-link" }, Je = "0kay.connection.qr.v2", Ca = /* @__PURE__ */ te({
  __name: "ConnectionPanel",
  setup(F) {
    const { t: s } = le();
    function v() {
      try {
        return JSON.parse(localStorage.getItem(Je) || "{}");
      } catch {
        return {};
      }
    }
    function _(D) {
      const U = (P) => /^192\.168\./.test(P) ? 0 : /^10\./.test(P) ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(P) ? 2 : /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(P) ? 4 : 3;
      return [...D].sort((P, H) => U(P) - U(H))[0] || "";
    }
    const w = v(), f = !!w.hostOverride, h = S(w.hostOverride && w.host ? w.host : location.hostname), $ = S(f), T = location.protocol === "https:" ? location.port || "443" : "8080", d = S(w.port ?? T), u = S(w.tls ?? location.protocol === "https:"), o = S(""), r = S(""), c = S(w.name ?? "0KAY"), m = S(""), g = S(!1), p = S(!1);
    ue(async () => {
      try {
        const D = await fetch("/api/auth/session");
        if (D.ok) {
          const U = await D.json();
          m.value = String(U.core_id || ""), g.value = !!U.lan_enabled;
          const P = Array.isArray(U.addresses) ? U.addresses : [], H = _(P);
          !$.value && H && (h.value = H);
        }
      } catch {
      }
    }), Ge([h, d, u, c, $], () => {
      localStorage.setItem(
        Je,
        JSON.stringify({
          host: h.value,
          hostOverride: $.value,
          port: d.value,
          tls: u.value,
          name: c.value
        })
      );
    });
    const k = q(() => {
      const D = u.value ? "https" : "http", U = String(d.value || "").trim();
      return `${D}://${h.value.trim()}${U ? ":" + U : ""}`;
    }), C = q(() => {
      const D = [["v", "1"], ["url", k.value]];
      return c.value.trim() && D.push(["name", c.value.trim()]), o.value.trim() && D.push(["token", o.value.trim()]), r.value.trim() && D.push(["pin", r.value.trim()]), m.value && D.push(["core_id", m.value]), `0kay://pair?${D.map(([P, H]) => `${P}=${encodeURIComponent(H)}`).join("&")}`;
    }), L = q(() => {
      const D = Ye.QrCode.encodeText(C.value, Ye.QrCode.Ecc.MEDIUM), U = D.size, P = 2, H = U + P * 2, Z = [];
      for (let Q = 0; Q < U; Q++)
        for (let z = 0; z < U; z++)
          D.getModule(z, Q) && Z.push({ x: z + P, y: Q + P });
      return { dim: H, dark: Z };
    });
    async function O() {
      try {
        await navigator.clipboard.writeText(C.value), p.value = !0, setTimeout(() => p.value = !1, 1500);
      } catch {
      }
    }
    return (D, U) => (n(), i("div", sa, [
      e("h2", null, l(t(s)("connection.title")), 1),
      e("p", la, l(t(s)("connection.lead")), 1),
      e("div", oa, [
        e("div", na, [
          e("div", aa, [
            e("label", null, l(t(s)("connection.remoteHost")), 1),
            R(e("input", {
              "onUpdate:modelValue": U[0] || (U[0] = (P) => h.value = P),
              class: "input",
              placeholder: t(s)("connection.hostPlaceholder"),
              onInput: U[1] || (U[1] = (P) => $.value = !0)
            }, null, 40, ia), [
              [K, h.value]
            ])
          ]),
          e("div", ra, [
            e("label", null, l(t(s)("connection.port")), 1),
            R(e("input", {
              "onUpdate:modelValue": U[2] || (U[2] = (P) => d.value = P),
              class: "input",
              inputmode: "numeric",
              placeholder: "8080"
            }, null, 512), [
              [K, d.value]
            ])
          ]),
          e("label", ua, [
            R(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": U[3] || (U[3] = (P) => u.value = P)
            }, null, 512), [
              [se, u.value]
            ]),
            U[7] || (U[7] = e("span", { class: "toggle-slider" }, null, -1)),
            e("span", null, l(t(s)("connection.useTls")), 1)
          ]),
          e("div", da, [
            e("label", null, l(t(s)("connection.token")), 1),
            R(e("input", {
              "onUpdate:modelValue": U[4] || (U[4] = (P) => o.value = P),
              class: "input",
              type: "password",
              placeholder: t(s)("connection.tokenPlaceholder"),
              autocomplete: "off"
            }, null, 8, ca), [
              [K, o.value]
            ])
          ]),
          e("div", pa, [
            e("label", null, l(t(s)("connection.pin")), 1),
            R(e("input", {
              "onUpdate:modelValue": U[5] || (U[5] = (P) => r.value = P),
              class: "input",
              type: "password",
              placeholder: t(s)("connection.pinPlaceholder"),
              autocomplete: "off"
            }, null, 8, ha), [
              [K, r.value]
            ])
          ]),
          e("div", va, [
            e("label", null, l(t(s)("connection.deviceName")), 1),
            R(e("input", {
              "onUpdate:modelValue": U[6] || (U[6] = (P) => c.value = P),
              class: "input",
              placeholder: "0KAY"
            }, null, 512), [
              [K, c.value]
            ])
          ]),
          e("div", ma, [
            ie(l(t(s)("connection.address")), 1),
            e("code", null, l(k.value), 1),
            m.value ? (n(), i("span", _a, " · Core: " + l(m.value), 1)) : E("", !0),
            g.value ? (n(), i("span", ga, l(t(s)("connection.lanMode")), 1)) : E("", !0)
          ]),
          e("div", ba, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              onClick: O
            }, l(p.value ? t(s)("common.copied") : t(s)("connection.copyLink")), 1)
          ])
        ]),
        e("div", fa, [
          (n(), i("svg", {
            viewBox: `0 0 ${L.value.dim} ${L.value.dim}`,
            width: "264",
            height: "264",
            "shape-rendering": "crispEdges",
            role: "img",
            "aria-label": "0KAY connection QR code"
          }, [
            e("rect", {
              x: "0",
              y: "0",
              width: L.value.dim,
              height: L.value.dim,
              fill: "#ffffff"
            }, null, 8, ka),
            (n(!0), i(B, null, G(L.value.dark, (P) => (n(), i("rect", {
              key: P.x + ":" + P.y,
              x: P.x,
              y: P.y,
              width: "1",
              height: "1",
              fill: "#0b1020"
            }, null, 8, wa))), 128))
          ], 8, ya)),
          e("code", $a, l(C.value), 1)
        ])
      ])
    ]));
  }
}), Sa = /* @__PURE__ */ de(Ca, [["__scopeId", "data-v-b6056614"]]), Pa = { class: "content-card" }, xa = { class: "card-desc" }, Ma = { class: "field-row" }, Ua = { class: "field" }, Ea = ["placeholder"], Ta = { class: "field" }, Aa = ["placeholder"], Na = { class: "field" }, Va = { class: "field" }, Ra = ["placeholder"], Oa = { class: "field" }, Ia = ["placeholder"], za = { class: "field" }, La = ["placeholder"], Da = { class: "field" }, Fa = ["placeholder"], Ba = { class: "helper-text" }, Ka = /* @__PURE__ */ te({
  __name: "PersonaPanel",
  setup(F) {
    const { t: s } = le(), v = ze(), { tabLabel: _, tabMeta: w } = Le();
    return (f, h) => (n(), i("div", Pa, [
      e("h2", null, l(t(_)("persona")), 1),
      e("p", xa, l(t(w)("persona")?.descriptionKey ? t(s)(t(w)("persona").descriptionKey) : t(s)("settings.personaDesc")), 1),
      e("div", Ma, [
        e("div", Ua, [
          e("label", null, l(t(s)("wizard.name")), 1),
          R(e("input", {
            "onUpdate:modelValue": h[0] || (h[0] = ($) => t(v).persona.name = $),
            placeholder: t(s)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, Ea), [
            [K, t(v).persona.name]
          ])
        ]),
        e("div", Ta, [
          e("label", null, l(t(s)("wizard.avatarUrl")), 1),
          R(e("input", {
            "onUpdate:modelValue": h[1] || (h[1] = ($) => t(v).persona.avatar = $),
            placeholder: t(s)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, Aa), [
            [K, t(v).persona.avatar]
          ])
        ]),
        e("div", Na, [
          e("label", null, l(t(s)("settings.personaBirthDate")), 1),
          R(e("input", {
            "onUpdate:modelValue": h[2] || (h[2] = ($) => t(v).persona.birthDate = $),
            type: "date",
            class: "input"
          }, null, 512), [
            [K, t(v).persona.birthDate]
          ])
        ])
      ]),
      e("div", Va, [
        e("label", null, l(t(s)("wizard.description")), 1),
        R(e("textarea", {
          "onUpdate:modelValue": h[3] || (h[3] = ($) => t(v).persona.description = $),
          placeholder: t(s)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Ra), [
          [K, t(v).persona.description]
        ])
      ]),
      e("div", Oa, [
        e("label", null, l(t(s)("wizard.personality")), 1),
        R(e("textarea", {
          "onUpdate:modelValue": h[4] || (h[4] = ($) => t(v).persona.personality = $),
          placeholder: t(s)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Ia), [
          [K, t(v).persona.personality]
        ])
      ]),
      e("div", za, [
        e("label", null, l(t(s)("wizard.greeting")), 1),
        R(e("textarea", {
          "onUpdate:modelValue": h[5] || (h[5] = ($) => t(v).persona.greeting = $),
          placeholder: t(s)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, La), [
          [K, t(v).persona.greeting]
        ])
      ]),
      e("div", Da, [
        e("label", null, l(t(s)("wizard.customPrompt")), 1),
        R(e("textarea", {
          "onUpdate:modelValue": h[6] || (h[6] = ($) => t(v).persona.customPrompt = $),
          placeholder: t(s)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, Fa), [
          [K, t(v).persona.customPrompt]
        ]),
        e("p", Ba, l(t(s)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), Ha = { class: "content-card" }, ja = { class: "card-desc" }, Ya = { class: "toggle-label" }, Ja = { class: "helper-text" }, Wa = { class: "toggle-label" }, qa = { class: "helper-text" }, Ga = { class: "field" }, Xa = ["placeholder"], Za = { class: "helper-text" }, Qa = {
  key: 0,
  class: "helper-text"
}, ei = { class: "actions-row" }, ti = /* @__PURE__ */ te({
  __name: "PermissionsPanel",
  setup(F) {
    const { t: s } = le(), { tabLabel: v, tabMeta: _, fieldLabel: w, fieldHelp: f } = Le(), h = S({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), $ = S("");
    async function T() {
      try {
        const u = await fetch("/api/life/permissions");
        if (u.ok) {
          const o = await u.json();
          h.value = {
            screen_watch: !!o.screen_watch,
            computer_use: !!o.computer_use,
            report_agent_host: o.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function d() {
      $.value = "";
      try {
        const u = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(h.value)
        });
        if (!u.ok) throw new Error(String(u.status));
        const o = await u.json();
        h.value = {
          screen_watch: !!o.screen_watch,
          computer_use: !!o.computer_use,
          report_agent_host: o.report_agent_host || ""
        }, $.value = s("settings.permSaved");
      } catch {
        $.value = s("settings.permFailed");
      }
    }
    return ue(T), (u, o) => (n(), i("div", Ha, [
      e("h2", null, l(t(v)("permissions")), 1),
      e("p", ja, l(t(_)("permissions")?.descriptionKey ? t(s)(t(_)("permissions").descriptionKey) : t(s)("settings.permissionsDesc")), 1),
      e("label", Ya, [
        R(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": o[0] || (o[0] = (r) => h.value.screen_watch = r),
          onChange: d
        }, null, 544), [
          [se, h.value.screen_watch]
        ]),
        o[4] || (o[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(t(w)(t(_)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          o[3] || (o[3] = e("br", null, null, -1)),
          e("small", Ja, l(t(f)(t(_)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", Wa, [
        R(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": o[1] || (o[1] = (r) => h.value.computer_use = r),
          onChange: d
        }, null, 544), [
          [se, h.value.computer_use]
        ]),
        o[6] || (o[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(t(w)(t(_)("permissions"), "computer_use", "settings.computerUse")), 1),
          o[5] || (o[5] = e("br", null, null, -1)),
          e("small", qa, l(t(f)(t(_)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", Ga, [
        e("label", null, l(t(w)(t(_)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        R(e("input", {
          "onUpdate:modelValue": o[2] || (o[2] = (r) => h.value.report_agent_host = r),
          class: "input",
          placeholder: t(f)(t(_)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: d
        }, null, 40, Xa), [
          [K, h.value.report_agent_host]
        ]),
        e("p", Za, l(t(f)(t(_)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      $.value ? (n(), i("div", Qa, l($.value), 1)) : E("", !0),
      e("div", ei, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: d
        }, l(t(s)("settings.save")), 1)
      ])
    ]));
  }
}), si = S(!1), li = S(!1);
S(!1);
const _e = S(!1), ye = S(!0), De = S(!0), Pe = S([]), et = S(!1);
S(!1);
const Te = S(!1), We = [];
function oi(F) {
  const s = We.splice(0, We.length);
  for (const v of s)
    v.resolve();
}
async function ni() {
  const F = window.fetch;
  try {
    const s = await F("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!s.ok) return;
    const v = await s.json();
    _e.value = !!v.configured, ye.value = v.enabled !== !1, De.value = v.login_enabled !== !1, Pe.value = Array.isArray(v.pages) ? v.pages : [], Te.value = !v.configured && ye.value;
  } catch {
  }
}
async function ai(F) {
  const s = window.fetch, v = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(F)
  }), _ = await v.json().catch(() => null);
  if (!v.ok) throw new Error(_?.error || `HTTP ${v.status}`);
  typeof _?.enabled == "boolean" && (ye.value = _.enabled), typeof _?.login_enabled == "boolean" && (De.value = _.login_enabled), Array.isArray(_?.pages) && (Pe.value = _.pages), _e.value = !!_?.configured, Te.value = !_?.configured && ye.value;
}
async function ii() {
  const F = window.fetch, s = await F("/api/security/pin", { method: "DELETE" }), v = await s.json().catch(() => null);
  if (!s.ok) throw new Error(v?.error || `HTTP ${s.status}`);
  et.value = !1, _e.value = !1, Te.value = ye.value;
}
async function ri(F) {
  const s = window.fetch, v = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: F })
  }), _ = await v.json().catch(() => null);
  if (!v.ok || !_?.configured) throw new Error(_?.error || `HTTP ${v.status}`);
  F.trim(), et.value = !0, _e.value = !0, Te.value = !1, li.value = !0, si.value = !1, oi();
}
const ui = { class: "content-card security-panel" }, di = { class: "card-desc" }, ci = { class: "sec-stack" }, pi = { class: "toggle-label" }, hi = ["checked", "disabled"], vi = { class: "helper-text" }, mi = { class: "toggle-label" }, _i = ["checked", "disabled"], gi = { class: "helper-text" }, bi = { class: "sec-card" }, fi = { class: "sec-card-head" }, yi = { class: "sec-pin-grid" }, ki = { class: "sec-pin-col" }, wi = { class: "sec-pin-label" }, $i = { class: "sec-pin-col" }, Ci = { class: "sec-pin-label" }, Si = { class: "sec-actions" }, Pi = ["disabled"], xi = ["disabled"], Mi = { class: "sec-card" }, Ui = { class: "sec-card-head" }, Ei = { class: "sec-chip" }, Ti = { class: "helper-text" }, Ai = { class: "page-list" }, Ni = ["checked", "disabled", "onChange"], Vi = { class: "page-text" }, Ri = { class: "page-name" }, Oi = {
  key: 0,
  class: "helper-text sec-msg"
}, Ii = {
  key: 1,
  class: "sec-error"
}, zi = /* @__PURE__ */ te({
  __name: "SecurityPanel",
  setup(F) {
    const { t: s } = le(), { confirm: v } = xe(), _ = Qe(), w = S(!1), f = S(""), h = S(""), $ = S(""), T = S(""), d = q(() => {
      const g = [], p = /* @__PURE__ */ new Set(), k = (C, L) => {
        !C || p.has(C) || (p.add(C), g.push({ path: C, label: L || C }));
      };
      for (const C of _.navItems) {
        const L = C.to || (C.id === "chat" ? "/" : "");
        if (!L) continue;
        let O = C.labelKey ? s(C.labelKey) : "";
        (!O || O === C.labelKey) && (O = C.label || C.id), k(L, O);
      }
      for (const C of _.routerPatches) {
        let L = C.titleKey ? s(C.titleKey) : "";
        (!L || L === C.titleKey) && (L = C.title || String(C.name || C.path)), k(C.path, L);
      }
      return g;
    });
    ue(() => {
      ni();
    });
    async function u(g) {
      w.value = !0, f.value = "", h.value = "";
      try {
        await ai(g), f.value = s("settings.saved"), setTimeout(() => {
          f.value = "";
        }, 1500);
      } catch (p) {
        h.value = p?.message || s("settings.permFailed");
      } finally {
        w.value = !1;
      }
    }
    function o(g, p) {
      u({ [g]: p });
    }
    function r(g, p) {
      const k = new Set(Pe.value);
      p ? k.add(g) : k.delete(g), u({ pages: [...k] });
    }
    async function c() {
      if (h.value = "", $.value.length !== 6) {
        h.value = s("wizard.pinTooShort");
        return;
      }
      if ($.value !== T.value) {
        h.value = s("wizard.pinMismatch");
        return;
      }
      w.value = !0;
      try {
        await ri($.value), $.value = "", T.value = "", f.value = s("settings.saved"), setTimeout(() => {
          f.value = "";
        }, 1500);
      } catch (g) {
        h.value = g?.message || s("settings.permFailed");
      } finally {
        w.value = !1;
      }
    }
    async function m() {
      if (await v({
        title: s("security.removePin"),
        message: s("security.removePinConfirm"),
        confirmLabel: s("common.delete"),
        danger: !0
      })) {
        w.value = !0, h.value = "";
        try {
          await ii(), f.value = s("settings.saved"), setTimeout(() => {
            f.value = "";
          }, 1500);
        } catch (p) {
          h.value = p?.message || s("settings.permFailed");
        } finally {
          w.value = !1;
        }
      }
    }
    return (g, p) => (n(), i("div", ui, [
      e("h2", null, l(t(s)("settings.tabs.security")), 1),
      e("p", di, l(t(s)("security.desc")), 1),
      e("div", ci, [
        e("label", pi, [
          e("input", {
            type: "checkbox",
            checked: t(ye),
            disabled: w.value,
            onChange: p[0] || (p[0] = (k) => o("enabled", k.target.checked))
          }, null, 40, hi),
          p[4] || (p[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(t(s)("security.pinSwitch")), 1),
            e("small", vi, l(t(s)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", mi, [
          e("input", {
            type: "checkbox",
            checked: t(De),
            disabled: w.value,
            onChange: p[1] || (p[1] = (k) => o("login_enabled", k.target.checked))
          }, null, 40, _i),
          p[5] || (p[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(t(s)("security.loginSwitch")), 1),
            e("small", gi, l(t(s)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", bi, [
          e("div", fi, [
            e("strong", null, l(t(_e) ? t(s)("security.changePin") : t(s)("auth.setupTitle")), 1),
            e("span", {
              class: W(["sec-chip", { on: t(_e) }])
            }, l(t(_e) ? t(s)("security.pinSet") : t(s)("security.pinUnset")), 3)
          ]),
          e("div", yi, [
            e("div", ki, [
              e("span", wi, l(t(s)("auth.pinNew")), 1),
              X(t(He), {
                modelValue: $.value,
                "onUpdate:modelValue": p[2] || (p[2] = (k) => $.value = k)
              }, null, 8, ["modelValue"])
            ]),
            e("div", $i, [
              e("span", Ci, l(t(s)("auth.pinConfirm")), 1),
              X(t(He), {
                modelValue: T.value,
                "onUpdate:modelValue": p[3] || (p[3] = (k) => T.value = k),
                onComplete: c
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", Si, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: w.value,
              onClick: c
            }, l(t(s)("auth.savePin")), 9, Pi),
            t(_e) ? (n(), i("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: w.value,
              onClick: m
            }, l(t(s)("security.removePin")), 9, xi)) : E("", !0)
          ])
        ]),
        e("section", Mi, [
          e("div", Ui, [
            e("strong", null, l(t(s)("security.pages")), 1),
            e("span", Ei, l(t(s)("security.pageCount", { n: t(Pe).length })), 1)
          ]),
          e("p", Ti, l(t(s)("security.pagesHelp")), 1),
          e("div", Ai, [
            (n(!0), i(B, null, G(d.value, (k) => (n(), i("label", {
              key: k.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: t(Pe).includes(k.path),
                disabled: w.value,
                onChange: (C) => r(k.path, C.target.checked)
              }, null, 40, Ni),
              p[6] || (p[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", Vi, [
                e("span", Ri, l(k.label), 1),
                e("code", null, l(k.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      f.value ? (n(), i("p", Oi, l(f.value), 1)) : E("", !0),
      h.value ? (n(), i("p", Ii, l(h.value), 1)) : E("", !0)
    ]));
  }
}), Li = /* @__PURE__ */ de(zi, [["__scopeId", "data-v-fb8c17b3"]]), Di = { class: "mcp-panel" }, Fi = { class: "mcp-head" }, Bi = { class: "subtitle" }, Ki = { class: "mcp-actions" }, Hi = ["disabled"], ji = {
  key: 0,
  class: "error-banner"
}, Yi = {
  key: 1,
  class: "notice-banner"
}, Ji = {
  key: 2,
  class: "hint"
}, Wi = {
  key: 3,
  class: "mcp-list"
}, qi = { class: "mcp-row" }, Gi = { class: "mcp-field grow" }, Xi = ["onUpdate:modelValue", "readonly"], Zi = { class: "mcp-field" }, Qi = ["onUpdate:modelValue", "onChange"], er = { value: "builtin" }, tr = { class: "mcp-toggle" }, sr = ["onUpdate:modelValue"], lr = ["onClick"], or = { class: "mcp-field" }, nr = ["onUpdate:modelValue"], ar = { class: "mcp-field" }, ir = ["onUpdate:modelValue"], rr = { class: "mcp-field" }, ur = ["onUpdate:modelValue"], dr = { class: "mcp-field" }, cr = ["onUpdate:modelValue"], pr = { class: "builtin-note" }, hr = { class: "mail-grid" }, vr = { class: "mail-col" }, mr = { class: "mail-label" }, _r = { class: "mcp-field" }, gr = ["onUpdate:modelValue"], br = { class: "mail-row" }, fr = { class: "mcp-field" }, yr = ["onUpdate:modelValue"], kr = { class: "mcp-toggle" }, wr = ["onUpdate:modelValue"], $r = { class: "mcp-field" }, Cr = ["onUpdate:modelValue"], Sr = { class: "mcp-field" }, Pr = ["onUpdate:modelValue"], xr = { class: "mail-col" }, Mr = { class: "mail-label" }, Ur = { class: "mcp-field" }, Er = ["onUpdate:modelValue"], Tr = { class: "mail-row" }, Ar = { class: "mcp-field" }, Nr = ["onUpdate:modelValue"], Vr = { class: "mcp-toggle" }, Rr = ["onUpdate:modelValue"], Or = { class: "mcp-field" }, Ir = ["onUpdate:modelValue"], zr = { class: "mcp-field" }, Lr = ["onUpdate:modelValue"], Dr = { class: "mail-row" }, Fr = { class: "mcp-field grow" }, Br = ["onUpdate:modelValue", "placeholder"], Kr = { class: "mcp-field" }, Hr = ["onUpdate:modelValue"], jr = {
  key: 0,
  class: "hint"
}, Yr = /* @__PURE__ */ te({
  __name: "McpPanel",
  setup(F) {
    const { t: s } = le(), v = S([]), _ = S(!1), w = S(!1), f = S(""), h = S(!1);
    function $() {
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
    function T(m) {
      const g = m?.transport === "http" ? "http" : m?.transport === "builtin" || m?.builtin ? "builtin" : "stdio", p = m?.options?.imap || {}, k = m?.options?.smtp || {};
      return {
        id: String(m?.id || ""),
        transport: g,
        command: String(m?.command || ""),
        argsText: Array.isArray(m?.args) ? m.args.join(`
`) : "",
        url: String(m?.url || ""),
        headersText: m?.headers && typeof m.headers == "object" ? JSON.stringify(m.headers, null, 2) : "",
        enabled: m?.enabled !== !1,
        imapHost: String(p.host || ""),
        imapPort: Number(p.port) || 993,
        imapSsl: p.ssl !== !1,
        imapUser: String(p.user || ""),
        imapPassword: String(p.password || ""),
        smtpHost: String(k.host || ""),
        smtpPort: Number(k.port) || 465,
        smtpSecure: k.secure !== !1,
        smtpUser: String(k.user || ""),
        smtpPassword: String(k.password || ""),
        from: String(k.from || ""),
        fromName: String(k.fromName || "0KAY")
      };
    }
    function d(m) {
      if (m.transport === "builtin") {
        const p = {};
        return (m.imapHost.trim() || m.imapUser.trim()) && (p.imap = {
          host: m.imapHost.trim(),
          port: Number(m.imapPort) || 993,
          ssl: m.imapSsl,
          user: m.imapUser.trim(),
          password: m.imapPassword
        }), (m.smtpHost.trim() || m.smtpUser.trim() || m.from.trim()) && (p.smtp = {
          host: m.smtpHost.trim(),
          port: Number(m.smtpPort) || 465,
          secure: m.smtpSecure,
          user: m.smtpUser.trim(),
          password: m.smtpPassword,
          from: m.from.trim(),
          fromName: m.fromName.trim() || "0KAY"
        }), { id: m.id.trim() || "mail", transport: "builtin", builtin: "mail", enabled: m.enabled, options: p };
      }
      const g = { id: m.id.trim(), transport: m.transport, enabled: m.enabled };
      if (m.transport === "http") {
        if (m.url.trim() && (g.url = m.url.trim()), m.headersText.trim())
          try {
            g.headers = JSON.parse(m.headersText);
          } catch {
            throw new Error(s("mcp.headersInvalid", { id: m.id || "(unnamed)" }));
          }
      } else {
        m.command.trim() && (g.command = m.command.trim());
        const p = m.argsText.split(`
`).map((k) => k.trim()).filter(Boolean);
        p.length && (g.args = p);
      }
      return g;
    }
    function u(m) {
      m.transport === "builtin" && (m.id = "mail");
    }
    function o() {
      const m = $();
      v.value.some((g) => g.transport === "builtin") && (m.transport = "stdio"), v.value.push(m);
    }
    async function r() {
      _.value = !0, f.value = "";
      try {
        const g = (await me("/api/settings/mcp"))?.values?.servers;
        let p = [];
        if (typeof g == "string" && g.trim())
          try {
            const k = JSON.parse(g);
            Array.isArray(k) && (p = k);
          } catch {
            f.value = s("mcp.configInvalid");
          }
        v.value = p.map(T);
      } catch (m) {
        f.value = m?.message || String(m);
      } finally {
        _.value = !1;
      }
    }
    async function c() {
      if (!w.value) {
        w.value = !0, f.value = "", h.value = !1;
        try {
          const m = /* @__PURE__ */ new Set(), g = v.value.map(d).filter((p) => {
            const k = String(p.id || "").trim();
            return !k || m.has(k) ? !1 : (m.add(k), !0);
          });
          await Ee("/api/settings/mcp", { values: { servers: JSON.stringify(g) } }), h.value = !0, setTimeout(() => {
            h.value = !1;
          }, 2e3);
        } catch (m) {
          f.value = m?.message || String(m);
        } finally {
          w.value = !1;
        }
      }
    }
    return ue(r), (m, g) => (n(), i("div", Di, [
      e("header", Fi, [
        e("div", null, [
          e("h2", null, l(t(s)("mcp.title")), 1),
          e("p", Bi, l(t(s)("mcp.subtitle")), 1)
        ]),
        e("div", Ki, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: o
          }, l(t(s)("mcp.addServer")), 1),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: w.value,
            onClick: c
          }, l(w.value ? t(s)("common.saving") : t(s)("common.save")), 9, Hi)
        ])
      ]),
      f.value ? (n(), i("div", ji, l(f.value), 1)) : E("", !0),
      h.value ? (n(), i("div", Yi, l(t(s)("settings.saved")), 1)) : E("", !0),
      _.value ? (n(), i("p", Ji, l(t(s)("common.loading")), 1)) : (n(), i("div", Wi, [
        (n(!0), i(B, null, G(v.value, (p, k) => (n(), i("article", {
          key: k,
          class: W(["mcp-card", { "is-builtin": p.transport === "builtin" }])
        }, [
          e("div", qi, [
            e("label", Gi, [
              g[0] || (g[0] = e("span", null, "ID", -1)),
              R(e("input", {
                "onUpdate:modelValue": (C) => p.id = C,
                readonly: p.transport === "builtin",
                placeholder: "filesystem"
              }, null, 8, Xi), [
                [K, p.id]
              ])
            ]),
            e("label", Zi, [
              e("span", null, l(t(s)("mcp.transport")), 1),
              R(e("select", {
                "onUpdate:modelValue": (C) => p.transport = C,
                onChange: (C) => u(p)
              }, [
                g[1] || (g[1] = e("option", { value: "stdio" }, "stdio", -1)),
                g[2] || (g[2] = e("option", { value: "http" }, "http", -1)),
                e("option", er, l(t(s)("mcp.builtinMail")), 1)
              ], 40, Qi), [
                [rt, p.transport]
              ])
            ]),
            e("label", tr, [
              R(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (C) => p.enabled = C
              }, null, 8, sr), [
                [se, p.enabled]
              ]),
              e("span", null, l(t(s)("mcp.enabled")), 1)
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (C) => v.value.splice(k, 1)
            }, l(t(s)("common.delete")), 9, lr)
          ]),
          p.transport === "stdio" ? (n(), i(B, { key: 0 }, [
            e("label", or, [
              e("span", null, l(t(s)("mcp.command")), 1),
              R(e("input", {
                "onUpdate:modelValue": (C) => p.command = C,
                placeholder: "npx"
              }, null, 8, nr), [
                [K, p.command]
              ])
            ]),
            e("label", ar, [
              e("span", null, l(t(s)("mcp.args")), 1),
              R(e("textarea", {
                "onUpdate:modelValue": (C) => p.argsText = C,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, ir), [
                [K, p.argsText]
              ])
            ])
          ], 64)) : p.transport === "http" ? (n(), i(B, { key: 1 }, [
            e("label", rr, [
              g[3] || (g[3] = e("span", null, "URL", -1)),
              R(e("input", {
                "onUpdate:modelValue": (C) => p.url = C,
                placeholder: "https://example.com/mcp"
              }, null, 8, ur), [
                [K, p.url]
              ])
            ]),
            e("label", dr, [
              g[4] || (g[4] = e("span", null, "Headers（JSON）", -1)),
              R(e("textarea", {
                "onUpdate:modelValue": (C) => p.headersText = C,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, cr), [
                [K, p.headersText]
              ])
            ])
          ], 64)) : (n(), i(B, { key: 2 }, [
            e("p", pr, l(t(s)("mcp.builtinNote")), 1),
            e("div", hr, [
              e("div", vr, [
                e("p", mr, l(t(s)("mcp.imap")), 1),
                e("label", _r, [
                  e("span", null, l(t(s)("mcp.host")), 1),
                  R(e("input", {
                    "onUpdate:modelValue": (C) => p.imapHost = C,
                    placeholder: "imap.example.com",
                    autocomplete: "off"
                  }, null, 8, gr), [
                    [K, p.imapHost]
                  ])
                ]),
                e("div", br, [
                  e("label", fr, [
                    e("span", null, l(t(s)("mcp.port")), 1),
                    R(e("input", {
                      "onUpdate:modelValue": (C) => p.imapPort = C,
                      type: "number",
                      placeholder: "993"
                    }, null, 8, yr), [
                      [
                        K,
                        p.imapPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", kr, [
                    R(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (C) => p.imapSsl = C
                    }, null, 8, wr), [
                      [se, p.imapSsl]
                    ]),
                    g[5] || (g[5] = e("span", null, "SSL", -1))
                  ])
                ]),
                e("label", $r, [
                  e("span", null, l(t(s)("mcp.username")), 1),
                  R(e("input", {
                    "onUpdate:modelValue": (C) => p.imapUser = C,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, Cr), [
                    [K, p.imapUser]
                  ])
                ]),
                e("label", Sr, [
                  e("span", null, l(t(s)("mcp.password")), 1),
                  R(e("input", {
                    "onUpdate:modelValue": (C) => p.imapPassword = C,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, Pr), [
                    [K, p.imapPassword]
                  ])
                ])
              ]),
              e("div", xr, [
                e("p", Mr, l(t(s)("mcp.smtp")), 1),
                e("label", Ur, [
                  e("span", null, l(t(s)("mcp.host")), 1),
                  R(e("input", {
                    "onUpdate:modelValue": (C) => p.smtpHost = C,
                    placeholder: "smtp.example.com",
                    autocomplete: "off"
                  }, null, 8, Er), [
                    [K, p.smtpHost]
                  ])
                ]),
                e("div", Tr, [
                  e("label", Ar, [
                    e("span", null, l(t(s)("mcp.port")), 1),
                    R(e("input", {
                      "onUpdate:modelValue": (C) => p.smtpPort = C,
                      type: "number",
                      placeholder: "465"
                    }, null, 8, Nr), [
                      [
                        K,
                        p.smtpPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", Vr, [
                    R(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (C) => p.smtpSecure = C
                    }, null, 8, Rr), [
                      [se, p.smtpSecure]
                    ]),
                    g[6] || (g[6] = e("span", null, "SSL（465）", -1))
                  ])
                ]),
                e("label", Or, [
                  e("span", null, l(t(s)("mcp.username")), 1),
                  R(e("input", {
                    "onUpdate:modelValue": (C) => p.smtpUser = C,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, Ir), [
                    [K, p.smtpUser]
                  ])
                ]),
                e("label", zr, [
                  e("span", null, l(t(s)("mcp.password")), 1),
                  R(e("input", {
                    "onUpdate:modelValue": (C) => p.smtpPassword = C,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, Lr), [
                    [K, p.smtpPassword]
                  ])
                ]),
                e("div", Dr, [
                  e("label", Fr, [
                    e("span", null, l(t(s)("mcp.from")), 1),
                    R(e("input", {
                      "onUpdate:modelValue": (C) => p.from = C,
                      placeholder: t(s)("mcp.fromPlaceholder"),
                      autocomplete: "off"
                    }, null, 8, Br), [
                      [K, p.from]
                    ])
                  ]),
                  e("label", Kr, [
                    e("span", null, l(t(s)("mcp.fromName")), 1),
                    R(e("input", {
                      "onUpdate:modelValue": (C) => p.fromName = C,
                      placeholder: "0KAY",
                      autocomplete: "off"
                    }, null, 8, Hr), [
                      [K, p.fromName]
                    ])
                  ])
                ])
              ])
            ])
          ], 64))
        ], 2))), 128)),
        v.value.length ? E("", !0) : (n(), i("p", jr, l(t(s)("mcp.emptyServers")), 1))
      ]))
    ]));
  }
}), Jr = /* @__PURE__ */ de(Yr, [["__scopeId", "data-v-01485e38"]]), Wr = { class: "content-card danger" }, qr = { class: "card-desc" }, Gr = { class: "danger-box" }, Xr = ["disabled"], Zr = /* @__PURE__ */ te({
  __name: "DangerPanel",
  setup(F) {
    const { t: s } = le(), v = ze(), _ = Xe(), { confirm: w } = xe(), f = S(!1);
    async function h() {
      if (!(f.value || !await w({
        title: s("settings.reset"),
        message: s("settings.resetConfirmMsg"),
        confirmLabel: s("settings.reset"),
        danger: !0
      }))) {
        f.value = !0;
        try {
          v.resetWizard(), _.push("/");
        } finally {
          f.value = !1;
        }
      }
    }
    return ($, T) => (n(), i("div", Wr, [
      e("h2", null, l(t(s)("settings.tabs.danger")), 1),
      e("p", qr, l(t(s)("settings.resetDesc")), 1),
      e("div", Gr, [
        e("div", null, [
          e("strong", null, l(t(s)("settings.reset")), 1),
          e("p", null, l(t(s)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          disabled: f.value,
          onClick: h
        }, l(t(s)("settings.reset")), 9, Xr)
      ])
    ]));
  }
}), Qr = {
  key: 1,
  class: "plugin-pane-message"
}, eu = {
  key: 2,
  class: "plugin-pane-message"
}, tu = /* @__PURE__ */ te({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(F) {
    const s = F, v = Be(null), _ = Be("");
    return Ge(
      () => s.module,
      async (w) => {
        if (!w) {
          v.value = null, _.value = "";
          return;
        }
        try {
          const f = await import(
            /* @vite-ignore */
            w
          );
          v.value = f?.default || f, _.value = "";
        } catch (f) {
          v.value = null, _.value = f?.message || String(f);
        }
      },
      { immediate: !0 }
    ), (w, f) => v.value ? (n(), ne(ut(v.value), { key: 0 })) : _.value ? (n(), i("div", Qr, l(_.value), 1)) : (n(), i("div", eu, "Loading plugin module…"));
  }
}), su = /* @__PURE__ */ de(tu, [["__scopeId", "data-v-2d1f36bc"]]), lu = { class: "models-field" }, ou = {
  key: 0,
  class: "models-list"
}, nu = { class: "models-rank" }, au = ["title"], iu = { class: "models-actions" }, ru = ["disabled", "aria-label", "onClick"], uu = ["disabled", "aria-label", "onClick"], du = ["aria-label", "onClick"], cu = {
  key: 1,
  class: "models-empty"
}, pu = /* @__PURE__ */ te({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(F, { emit: s }) {
    const { t: v } = le(), _ = F, w = s, f = q(() => String(_.modelValue || "").split(",").map((o) => o.trim()).filter(Boolean)), h = q(() => _.options.filter((o) => !f.value.includes(o)));
    function $(o) {
      w("update:modelValue", o.join(","));
    }
    function T(o) {
      o && !f.value.includes(o) && $([...f.value, o]);
    }
    function d(o) {
      $(f.value.filter((r) => r !== o));
    }
    function u(o, r) {
      const c = [...f.value], m = o + r;
      m < 0 || m >= c.length || ([c[o], c[m]] = [c[m], c[o]], $(c));
    }
    return (o, r) => (n(), i("div", lu, [
      f.value.length ? (n(), i("ol", ou, [
        (n(!0), i(B, null, G(f.value, (c, m) => (n(), i("li", { key: c }, [
          e("span", nu, l(m + 1), 1),
          e("span", {
            class: "models-name",
            title: c
          }, l(c), 9, au),
          e("span", iu, [
            e("button", {
              type: "button",
              disabled: m === 0,
              "aria-label": t(v)("models.higher"),
              onClick: (g) => u(m, -1)
            }, "↑", 8, ru),
            e("button", {
              type: "button",
              disabled: m === f.value.length - 1,
              "aria-label": t(v)("models.lower"),
              onClick: (g) => u(m, 1)
            }, "↓", 8, uu),
            e("button", {
              type: "button",
              "aria-label": t(v)("common.remove"),
              onClick: (g) => d(c)
            }, "✕", 8, du)
          ])
        ]))), 128))
      ])) : (n(), i("p", cu, l(t(v)("models.empty")), 1)),
      h.value.length ? (n(), ne(t(pe), {
        key: 2,
        options: h.value,
        "model-value": "",
        placeholder: t(v)("models.addPlaceholder"),
        "onUpdate:modelValue": T
      }, null, 8, ["options", "placeholder"])) : E("", !0)
    ]));
  }
}), qe = /* @__PURE__ */ de(pu, [["__scopeId", "data-v-7089f4a3"]]), hu = { class: "settings-page" }, vu = { class: "page-header" }, mu = { class: "subtitle" }, _u = { key: 0 }, gu = { key: 1 }, bu = { class: "settings-layout" }, fu = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, yu = ["aria-current", "data-tab-id", "title", "aria-label", "onClick"], ku = {
  class: "nav-icon",
  "aria-hidden": "true"
}, wu = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, $u = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Cu = {
  key: 2,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Su = {
  key: 3,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Pu = {
  key: 4,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, xu = {
  key: 5,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Mu = {
  key: 6,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Uu = {
  key: 7,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Eu = {
  key: 8,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Tu = {
  key: 9,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Au = {
  key: 10,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Nu = {
  key: 11,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Vu = { class: "nav-label" }, Ru = { class: "settings-content" }, Ou = {
  key: 0,
  class: "content-card provider-runtime"
}, Iu = {
  key: 0,
  class: "helper-text"
}, zu = {
  key: 0,
  class: "toggle-label"
}, Lu = ["checked", "onChange"], Du = { key: 0 }, Fu = {
  key: 1,
  class: "helper-text"
}, Bu = {
  key: 0,
  class: "helper-text"
}, Ku = ["type", "value", "onInput"], Hu = {
  key: 0,
  class: "helper-text"
}, ju = { class: "actions-row" }, Yu = ["disabled"], Ju = {
  key: "live2d",
  class: "content-card"
}, Wu = { class: "card-desc" }, qu = { class: "toggle-label" }, Gu = { class: "field" }, Xu = { class: "model-choices" }, Zu = ["value", "checked", "onChange"], Qu = ["placeholder"], ed = { class: "helper-text" }, td = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, sd = { class: "helper-text" }, ld = ["disabled"], od = { class: "field" }, nd = {
  key: 0,
  class: "helper-text"
}, ad = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, id = ["value", "checked", "onChange"], rd = ["onClick"], ud = {
  key: 0,
  class: "card-desc"
}, dd = {
  key: 1,
  class: "helper-text"
}, cd = {
  key: 0,
  class: "toggle-label"
}, pd = ["checked", "onChange"], hd = { key: 0 }, vd = {
  key: 1,
  class: "helper-text"
}, md = {
  key: 0,
  class: "helper-text"
}, _d = {
  key: 0,
  class: "helper-text"
}, gd = {
  key: 0,
  class: "helper-text"
}, bd = { class: "actions-row" }, fd = ["disabled"], yd = {
  key: 0,
  class: "helper-text"
}, kd = {
  key: 0,
  class: "helper-text"
}, wd = ["type", "value", "onInput"], $d = {
  key: 0,
  class: "helper-text"
}, Cd = { class: "actions-row" }, Sd = ["disabled"], Pd = {
  key: 0,
  class: "card-desc"
}, xd = {
  key: 1,
  class: "card-desc"
}, Md = {
  key: 0,
  class: "toggle-label"
}, Ud = ["checked", "onChange"], Ed = { key: 0 }, Td = {
  key: 1,
  class: "helper-text"
}, Ad = {
  key: 0,
  class: "helper-text"
}, Nd = {
  key: 0,
  class: "helper-text"
}, Vd = {
  key: 0,
  class: "helper-text"
}, Rd = ["type", "value", "onInput"], Od = {
  key: 0,
  class: "helper-text"
}, Id = { class: "actions-row" }, zd = ["disabled"], Ld = {
  key: "unknown",
  class: "content-card tab-unknown"
}, Wd = /* @__PURE__ */ te({
  __name: "SettingsPage",
  setup(F) {
    const { t: s } = le(), { confirm: v } = xe(), _ = ze(), w = _t(), f = Qe(), h = ct(), $ = Xe(), T = q(() => f.settingsTabs.map((V) => ({
      id: V.id,
      icon: V.icon || "chip"
    }))), d = q(() => {
      const V = new Set(f.settingsTabs.map((a) => a.id)), M = new Set(f.removedSettingsIds);
      return w.sections.filter((a) => a.id !== "permissions" && !V.has(a.id) && !M.has(a.id)).map((a) => ({ id: a.id, icon: a.icon || "lock" }));
    }), u = q(() => [...T.value, ...d.value]), o = S("general"), r = S(!1), c = S([]), m = S(null), g = S(""), p = S({}), k = S(""), C = S("ok"), L = S(!1), O = S(!1), D = S(""), U = S(!1), P = S([]), H = q(() => s("settings.modelAuto")), Z = q(() => [
      { value: "", label: H.value },
      ...P.value.map((V) => ({ value: V, label: V }))
    ]);
    async function Q() {
      try {
        const V = await fetch("/api/models");
        if (!V.ok) return;
        const M = await V.json();
        P.value = Array.from(new Set((M.models || []).map((a) => String(a.id || "")).filter(Boolean)));
      } catch {
      }
    }
    async function z(V) {
      O.value = !0, D.value = "";
      try {
        const M = await fetch(`/api/settings/${V}/test`, { method: "POST" }), a = M.headers.get("content-type") || "";
        if (M.ok && a.startsWith("audio")) {
          const A = URL.createObjectURL(await M.blob());
          try {
            await new Audio(A).play();
          } catch {
          }
          window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: A } })), D.value = s("settings.testSuccess");
        } else {
          const A = await M.json().catch(() => ({}));
          D.value = A.error || `HTTP ${M.status}`;
        }
      } catch (M) {
        D.value = M instanceof Error ? M.message : String(M);
      } finally {
        O.value = !1;
      }
    }
    const { tabMeta: N, isBuiltinTab: I, isPluginSection: ke, tabLabel: ge, fieldLabel: ce, fieldHelp: he, pluginSection: ee } = Le(), we = q(() => I(o.value) ? null : N(o.value)?.module || null);
    function $e(V, M) {
      const a = p.value[V]?.[M];
      return typeof a == "boolean" ? a : a === "true" || a === 1 || a === "1";
    }
    function Ce(V) {
      if (N(V)?.fields?.length && !I(V)) {
        Ae(V);
        return;
      }
      const a = ee(V);
      if (!a) return;
      const A = {};
      for (const J of a.fields)
        J.type === "bool" ? A[J.key] = J.default_value === "true" || J.default_value === "1" : J.type === "number" ? A[J.key] = Number(J.default_value || 0) : A[J.key] = J.default_value || "";
      const ae = w.values[V] || {}, oe = { ...A };
      for (const J of a.fields) {
        if (!(J.key in ae)) continue;
        const re = ae[J.key];
        J.type === "bool" ? oe[J.key] = re === !0 || re === "true" || re === 1 || re === "1" : oe[J.key] = re;
      }
      p.value = {
        ...p.value,
        [V]: oe
      };
    }
    async function Ae(V) {
      const M = N(V);
      if (!M?.fields?.length) return;
      const a = {};
      for (const A of M.fields)
        A.type === "bool" ? a[A.key] = A.default_value === "true" || A.default_value === "1" : A.type === "number" ? a[A.key] = Number(A.default_value || 0) : a[A.key] = A.default_value || "";
      if (M.loadApi)
        try {
          const A = await fetch(M.loadApi);
          if (A.ok) {
            const ae = await A.json();
            for (const oe of M.fields) {
              if (!(oe.key in ae)) continue;
              const J = ae[oe.key];
              oe.type === "bool" ? a[oe.key] = J === !0 || J === "true" || J === 1 || J === "1" : a[oe.key] = J;
            }
          }
        } catch {
        }
      p.value = { ...p.value, [V]: a };
    }
    async function Me(V) {
      const M = N(V);
      if (!L.value) {
        L.value = !0, k.value = "";
        try {
          const a = p.value[V] || {};
          if (M?.saveApi) {
            const A = await fetch(M.saveApi, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(a)
            });
            if (!A.ok) throw new Error(String(A.status));
          }
          k.value = s("settings.saved"), C.value = "ok", setTimeout(() => {
            k.value = "";
          }, 3e3);
        } catch {
          k.value = s("settings.permFailed"), C.value = "error";
        } finally {
          L.value = !1;
        }
      }
    }
    async function Ue(V) {
      if (!L.value) {
        L.value = !0, k.value = "";
        try {
          await w.saveValues(V, p.value[V] || {}), k.value = s("settings.saved"), C.value = "ok", setTimeout(() => {
            k.value = "";
          }, 3e3);
        } catch {
          k.value = s("settings.permFailed"), C.value = "error";
        } finally {
          L.value = !1;
        }
      }
    }
    async function Se() {
      try {
        const V = await fetch("/api/live2d");
        if (V.ok) {
          const M = await V.json();
          c.value = M.models || [];
        }
      } catch {
        c.value = [];
      }
    }
    async function Ne(V) {
      if (await v({
        title: s("settings.live2d"),
        message: s("settings.deleteModelConfirm", { label: V.label }),
        confirmLabel: s("common.delete"),
        danger: !0
      }))
        try {
          const a = await fetch(`/api/live2d/${encodeURIComponent(V.id)}`, { method: "DELETE" });
          if (!a.ok) throw new Error(await a.text());
          const A = await a.json();
          c.value = A.models || [];
          const ae = V.url.slice(0, V.url.indexOf("/", 15) + 1);
          _.live2d.modelUrl.startsWith(ae) && (_.live2d.modelUrl = "", _.live2d.enabled = !1, _.saveToStorage()), await be(), g.value = s("settings.modelDeleted"), window.dispatchEvent(new Event("live2d-models-changed"));
        } catch (a) {
          g.value = a.message;
        }
    }
    async function be() {
      _.saveToStorage();
      const V = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: _.live2d.enabled, model_url: _.live2d.modelUrl } }) });
      if (!V.ok) throw new Error(await V.text());
    }
    async function b() {
      if (!U.value) {
        U.value = !0, g.value = "";
        try {
          await be(), g.value = s("settings.saved"), setTimeout(() => {
            g.value === s("settings.saved") && (g.value = "");
          }, 3e3);
        } catch (V) {
          g.value = V.message, je(s("settings.permFailed"), "error");
        } finally {
          U.value = !1;
        }
      }
    }
    function x() {
      m.value?.click();
    }
    async function y(V) {
      const M = V.target, a = M.files;
      if (!(!a || a.length === 0)) {
        g.value = "";
        try {
          const A = new FormData(), ae = [];
          for (const re of Array.from(a)) {
            const tt = re.webkitRelativePath || re.name;
            ae.push(tt), A.append("files", re, re.name);
          }
          A.append("paths", JSON.stringify(ae));
          const oe = await fetch("/api/live2d", { method: "POST", body: A });
          if (!oe.ok) throw new Error(await oe.text());
          const J = await oe.json();
          g.value = s("settings.uploadOk"), J?.models ? c.value = J.models : await Se(), J?.model_url && (_.live2d.modelUrl = J.model_url, _.live2d.enabled = !0, _.saveToStorage(), await be(), window.dispatchEvent(new Event("live2d-models-changed")));
        } catch (A) {
          g.value = `${s("settings.uploadFail")}：${A.message}`;
        } finally {
          M.value = "";
        }
      }
    }
    ue(async () => {
      _.loadFromStorage();
      const V = h.query.tab;
      V && (o.value = V), Se(), Q(), await w.fetchSections();
      for (const M of w.sections) Ce(M.id);
      !u.value.some((M) => M.id === o.value) && !I(o.value) && (o.value = "general");
    });
    function Y(V) {
      o.value = V, I(V) || Ce(V), $.replace({ query: { tab: V } });
    }
    function ve() {
      if (_.saveToStorage(), o.value === "live2d") {
        be().then(() => {
          r.value = !0, setTimeout(() => {
            r.value = !1;
          }, 1500);
        }).catch((V) => {
          g.value = V.message, je(s("settings.permFailed"), "error");
        });
        return;
      }
      r.value = !0, setTimeout(() => {
        r.value = !1;
      }, 1500);
    }
    return (V, M) => (n(), i("div", hu, [
      e("header", vu, [
        e("div", null, [
          e("h1", null, l(t(s)("settings.title")), 1),
          e("p", mu, l(t(s)("settings.pageDesc")), 1)
        ]),
        t(I)(o.value) && o.value !== "about" && o.value !== "updates" && o.value !== "danger" ? (n(), i("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: ve
        }, [
          r.value ? (n(), i("span", _u, l(t(s)("settings.saved")), 1)) : (n(), i("span", gu, l(t(s)("settings.save")), 1))
        ])) : E("", !0)
      ]),
      e("div", bu, [
        e("nav", fu, [
          (n(!0), i(B, null, G(u.value, (a) => (n(), i("button", {
            key: a.id,
            class: W(["nav-item", { active: o.value === a.id }]),
            "aria-current": o.value === a.id ? "true" : void 0,
            "data-tab-id": a.id,
            title: t(ge)(a.id),
            "aria-label": t(ge)(a.id),
            onClick: (A) => Y(a.id)
          }, [
            M[18] || (M[18] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", ku, [
              a.icon === "globe" ? (n(), i("svg", wu, [...M[6] || (M[6] = [
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
              ])])) : a.icon === "cloud" ? (n(), i("svg", $u, [...M[7] || (M[7] = [
                e("path", {
                  d: "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])])) : a.icon === "chip" ? (n(), i("svg", Cu, [...M[8] || (M[8] = [
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
              ])])) : a.icon === "person" ? (n(), i("svg", Su, [...M[9] || (M[9] = [
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
              ])])) : a.icon === "avatar" ? (n(), i("svg", Pu, [...M[10] || (M[10] = [
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
              ])])) : a.icon === "brightness" ? (n(), i("svg", xu, [...M[11] || (M[11] = [
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
              ])])) : a.icon === "warn" ? (n(), i("svg", Mu, [...M[12] || (M[12] = [
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
              ])])) : a.icon === "info" ? (n(), i("svg", Uu, [...M[13] || (M[13] = [
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
              ])])) : a.icon === "download" ? (n(), i("svg", Eu, [...M[14] || (M[14] = [
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
              ])])) : a.icon === "shield" ? (n(), i("svg", Tu, [...M[15] || (M[15] = [
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
              ])])) : a.icon === "link" ? (n(), i("svg", Au, [...M[16] || (M[16] = [
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
              ])])) : (n(), i("svg", Nu, [...M[17] || (M[17] = [
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
            e("span", Vu, l(t(ge)(a.id)), 1)
          ], 10, yu))), 128))
        ]),
        e("section", Ru, [
          X(dt, {
            name: "tab",
            mode: "out-in"
          }, {
            default: Oe(() => [
              o.value === "general" ? (n(), ne(ta, { key: "general" })) : o.value === "connection" ? (n(), ne(Sa, { key: "connection" })) : o.value === "provider" ? (n(), i(B, { key: 2 }, [
                X(Dn),
                t(ee)("provider")?.fields?.length ? (n(), i("div", Ou, [
                  e("h3", null, l(t(ee)("provider").label), 1),
                  t(ee)("provider").description ? (n(), i("p", Iu, l(t(ee)("provider").description), 1)) : E("", !0),
                  (n(!0), i(B, null, G(t(ee)("provider").fields, (a) => (n(), i("div", {
                    key: a.key,
                    class: "field"
                  }, [
                    a.type === "bool" ? (n(), i("label", zu, [
                      e("input", {
                        type: "checkbox",
                        checked: $e("provider", a.key),
                        onChange: (A) => p.value = { ...p.value, provider: { ...p.value.provider, [a.key]: A.target.checked } }
                      }, null, 40, Lu),
                      M[19] || (M[19] = e("span", { class: "toggle-slider" }, null, -1)),
                      e("span", null, [
                        e("strong", null, l(a.label), 1),
                        a.help ? (n(), i("br", Du)) : E("", !0),
                        a.help ? (n(), i("small", Fu, l(a.help), 1)) : E("", !0)
                      ])
                    ])) : a.type === "select" ? (n(), i(B, { key: 1 }, [
                      e("label", null, l(a.label), 1),
                      X(t(pe), {
                        class: "input",
                        "aria-label": a.label,
                        "model-value": String(p.value.provider?.[a.key] ?? ""),
                        options: a.options || [],
                        "onUpdate:modelValue": (A) => p.value = { ...p.value, provider: { ...p.value.provider, [a.key]: A } }
                      }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                      a.help ? (n(), i("p", Bu, l(a.help), 1)) : E("", !0)
                    ], 64)) : (n(), i(B, { key: 2 }, [
                      e("label", null, l(a.label), 1),
                      e("input", {
                        class: "input",
                        type: a.type === "number" ? "number" : "text",
                        value: p.value.provider?.[a.key],
                        onInput: (A) => p.value = { ...p.value, provider: { ...p.value.provider, [a.key]: a.type === "number" ? Number(A.target.value) : A.target.value } }
                      }, null, 40, Ku),
                      a.help ? (n(), i("p", Hu, l(a.help), 1)) : E("", !0)
                    ], 64))
                  ]))), 128)),
                  k.value ? (n(), i("div", {
                    key: 1,
                    class: W(["helper-text", C.value === "error" ? "msg-error" : "msg-success"]),
                    role: "status"
                  }, l(k.value), 3)) : E("", !0),
                  e("div", ju, [
                    e("button", {
                      class: "btn btn-primary",
                      type: "button",
                      disabled: L.value,
                      onClick: M[0] || (M[0] = (a) => Ue("provider"))
                    }, l(t(s)("settings.save")), 9, Yu)
                  ])
                ])) : E("", !0)
              ], 64)) : o.value === "persona" ? (n(), ne(Ka, { key: 3 })) : o.value === "live2d" ? (n(), i("div", Ju, [
                e("h2", null, l(t(ge)("live2d")), 1),
                e("p", Wu, l(t(N)("live2d")?.descriptionKey ? t(s)(t(N)("live2d").descriptionKey) : t(s)("settings.live2dDesc")), 1),
                X(bt, { class: "live2d-preview" }),
                e("label", qu, [
                  R(e("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": M[1] || (M[1] = (a) => t(_).live2d.enabled = a)
                  }, null, 512), [
                    [se, t(_).live2d.enabled]
                  ]),
                  M[20] || (M[20] = e("span", { class: "toggle-slider" }, null, -1)),
                  e("span", null, l(t(s)("wizard.enableLive2d")), 1)
                ]),
                e("div", Gu, [
                  e("label", null, l(t(s)("wizard.modelUrl")), 1),
                  e("div", Xu, [
                    (n(!0), i(B, null, G(t(gt), (a) => (n(), i("label", {
                      key: a.id,
                      class: W(["model-choice", { selected: t(_).live2d.modelUrl === a.url }])
                    }, [
                      e("input", {
                        type: "radio",
                        name: "live2d-model",
                        value: a.url,
                        checked: t(_).live2d.modelUrl === a.url,
                        onChange: (A) => {
                          t(_).live2d.modelUrl = a.url, t(_).live2d.enabled = !0;
                        }
                      }, null, 40, Zu),
                      e("span", null, l(a.label), 1),
                      e("code", null, l(a.url), 1)
                    ], 2))), 128))
                  ]),
                  R(e("input", {
                    "onUpdate:modelValue": M[2] || (M[2] = (a) => t(_).live2d.modelUrl = a),
                    placeholder: t(s)("wizard.modelUrlPlaceholder"),
                    class: "input"
                  }, null, 8, Qu), [
                    [K, t(_).live2d.modelUrl]
                  ]),
                  e("p", ed, [
                    ie(l(t(s)("wizard.live2dHelp")) + " ", 1),
                    e("a", td, l(t(s)("wizard.live2dSamples")), 1)
                  ])
                ]),
                e("p", sd, l(t(s)("settings.live2dHelper")), 1),
                e("button", {
                  class: "btn btn-tonal",
                  disabled: U.value,
                  onClick: b
                }, l(U.value ? t(s)("settings.saving") : t(s)("settings.saveLife2d")), 9, ld),
                e("div", od, [
                  e("label", null, l(t(s)("settings.uploadFolder")), 1),
                  e("label", {
                    class: "upload-area",
                    onClick: Ke(x, ["prevent"])
                  }, [
                    e("span", null, l(t(s)("settings.uploadFolderHint")), 1)
                  ]),
                  e("input", {
                    ref_key: "folderInput",
                    ref: m,
                    type: "file",
                    webkitdirectory: "",
                    directory: "",
                    multiple: "",
                    class: "file-input",
                    onChange: y
                  }, null, 544),
                  g.value ? (n(), i("p", nd, l(g.value), 1)) : E("", !0),
                  c.value.length ? (n(), i("div", ad, [
                    (n(!0), i(B, null, G(c.value, (a) => (n(), i("label", {
                      key: a.id,
                      class: W(["model-choice", { selected: t(_).live2d.modelUrl === a.url }])
                    }, [
                      e("input", {
                        type: "radio",
                        name: "live2d-uploaded",
                        value: a.url,
                        checked: t(_).live2d.modelUrl === a.url,
                        onChange: (A) => {
                          t(_).live2d.modelUrl = a.url, t(_).live2d.enabled = !0, be().catch((ae) => g.value = ae.message);
                        }
                      }, null, 40, id),
                      e("span", null, l(a.label), 1),
                      e("code", null, l(a.url), 1),
                      e("button", {
                        type: "button",
                        class: "btn btn-danger",
                        onClick: Ke((A) => Ne(a), ["prevent"])
                      }, l(t(s)("settings.deleteModel")), 9, rd)
                    ], 2))), 128))
                  ])) : E("", !0)
                ])
              ])) : o.value === "security" ? (n(), ne(Li, { key: 5 })) : o.value === "permissions" ? (n(), ne(ti, { key: 6 })) : o.value === "mcp" ? (n(), ne(Jr, { key: 7 })) : o.value === "life_settings" ? (n(), ne(fs, { key: 8 })) : t(ke)(o.value) && t(ee)(o.value) ? (n(), i("div", {
                key: `section-${o.value}`,
                class: "content-card"
              }, [
                e("h2", null, l(t(ee)(o.value).label), 1),
                t(ee)(o.value).description ? (n(), i("p", ud, l(t(ee)(o.value).description), 1)) : E("", !0),
                t(ee)(o.value).plugin_name ? (n(), i("p", dd, l(t(ee)(o.value).plugin_name), 1)) : E("", !0),
                (n(!0), i(B, null, G(t(ee)(o.value).fields, (a) => (n(), i("div", {
                  key: a.key,
                  class: "field"
                }, [
                  a.type === "bool" ? (n(), i("label", cd, [
                    e("input", {
                      type: "checkbox",
                      checked: $e(o.value, a.key),
                      onChange: (A) => p.value = { ...p.value, [o.value]: { ...p.value[o.value], [a.key]: A.target.checked } }
                    }, null, 40, pd),
                    M[21] || (M[21] = e("span", { class: "toggle-slider" }, null, -1)),
                    e("span", null, [
                      e("strong", null, l(a.label), 1),
                      a.help ? (n(), i("br", hd)) : E("", !0),
                      a.help ? (n(), i("small", vd, l(a.help), 1)) : E("", !0)
                    ])
                  ])) : a.type === "select" ? (n(), i(B, { key: 1 }, [
                    e("label", null, l(a.label), 1),
                    X(t(pe), {
                      class: "input",
                      "aria-label": a.label,
                      "model-value": String(p.value[o.value]?.[a.key] ?? ""),
                      options: a.options || [],
                      "onUpdate:modelValue": (A) => p.value[o.value] = { ...p.value[o.value], [a.key]: A }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    a.help ? (n(), i("p", md, l(a.help), 1)) : E("", !0)
                  ], 64)) : a.type === "model" ? (n(), i(B, { key: 2 }, [
                    e("label", null, l(a.label), 1),
                    X(t(pe), {
                      class: "input",
                      "aria-label": a.label,
                      "model-value": String(p.value[o.value]?.[a.key] ?? ""),
                      options: Z.value,
                      "onUpdate:modelValue": (A) => p.value[o.value] = { ...p.value[o.value], [a.key]: A }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    a.help ? (n(), i("p", _d, l(a.help), 1)) : E("", !0)
                  ], 64)) : a.type === "models" ? (n(), i(B, { key: 3 }, [
                    e("label", null, l(a.label), 1),
                    X(qe, {
                      "model-value": String(p.value[o.value]?.[a.key] ?? ""),
                      options: P.value,
                      "onUpdate:modelValue": (A) => p.value[o.value] = { ...p.value[o.value], [a.key]: A }
                    }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                    a.help ? (n(), i("p", gd, l(a.help), 1)) : E("", !0)
                  ], 64)) : a.type === "test" ? (n(), i(B, { key: 4 }, [
                    e("label", null, l(a.label), 1),
                    e("div", bd, [
                      e("button", {
                        class: "btn btn-tonal",
                        type: "button",
                        disabled: O.value,
                        onClick: M[3] || (M[3] = (A) => z(o.value))
                      }, l(O.value ? t(s)("settings.testing") : a.label || t(s)("settings.test")), 9, fd),
                      D.value ? (n(), i("span", yd, l(D.value), 1)) : E("", !0)
                    ]),
                    a.help ? (n(), i("p", kd, l(a.help), 1)) : E("", !0)
                  ], 64)) : (n(), i(B, { key: 5 }, [
                    e("label", null, l(a.label), 1),
                    e("input", {
                      class: "input",
                      type: a.type === "number" ? "number" : "text",
                      value: p.value[o.value]?.[a.key],
                      onInput: (A) => p.value[o.value] = { ...p.value[o.value], [a.key]: a.type === "number" ? Number(A.target.value) : A.target.value }
                    }, null, 40, wd),
                    a.help ? (n(), i("p", $d, l(a.help), 1)) : E("", !0)
                  ], 64))
                ]))), 128)),
                k.value ? (n(), i("div", {
                  key: 2,
                  class: W(["helper-text", C.value === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, l(k.value), 3)) : E("", !0),
                e("div", Cd, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: L.value,
                    onClick: M[4] || (M[4] = (a) => Ue(o.value))
                  }, l(t(s)("settings.save")), 9, Sd)
                ])
              ])) : we.value ? (n(), ne(su, {
                key: we.value,
                module: we.value || ""
              }, null, 8, ["module"])) : !t(I)(o.value) && t(N)(o.value)?.fields?.length ? (n(), i("div", {
                key: `patch-${o.value}`,
                class: "content-card"
              }, [
                e("h2", null, l(t(ge)(o.value)), 1),
                t(N)(o.value)?.descriptionKey ? (n(), i("p", Pd, l(t(s)(t(N)(o.value).descriptionKey)), 1)) : t(N)(o.value)?.description ? (n(), i("p", xd, l(t(N)(o.value).description), 1)) : E("", !0),
                (n(!0), i(B, null, G(t(N)(o.value).fields, (a) => (n(), i("div", {
                  key: a.key,
                  class: "field"
                }, [
                  a.type === "bool" ? (n(), i("label", Md, [
                    e("input", {
                      type: "checkbox",
                      checked: $e(o.value, a.key),
                      onChange: (A) => p.value = { ...p.value, [o.value]: { ...p.value[o.value], [a.key]: A.target.checked } }
                    }, null, 40, Ud),
                    M[22] || (M[22] = e("span", { class: "toggle-slider" }, null, -1)),
                    e("span", null, [
                      e("strong", null, l(t(ce)(t(N)(o.value), a.key, `settings.${a.key}`)), 1),
                      a.help || a.helpKey ? (n(), i("br", Ed)) : E("", !0),
                      a.help || a.helpKey ? (n(), i("small", Td, l(t(he)(t(N)(o.value), a.key, `settings.${a.key}Desc`)), 1)) : E("", !0)
                    ])
                  ])) : a.type === "select" ? (n(), i(B, { key: 1 }, [
                    e("label", null, l(t(ce)(t(N)(o.value), a.key, `settings.${a.key}`)), 1),
                    X(t(pe), {
                      class: "input",
                      "aria-label": t(ce)(t(N)(o.value), a.key, `settings.${a.key}`),
                      "model-value": String(p.value[o.value]?.[a.key] ?? ""),
                      options: a.options || [],
                      "onUpdate:modelValue": (A) => p.value[o.value] = { ...p.value[o.value], [a.key]: A }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    a.help || a.helpKey ? (n(), i("p", Ad, l(t(he)(t(N)(o.value), a.key, `settings.${a.key}Desc`)), 1)) : E("", !0)
                  ], 64)) : a.type === "model" ? (n(), i(B, { key: 2 }, [
                    e("label", null, l(t(ce)(t(N)(o.value), a.key, `settings.${a.key}`)), 1),
                    X(t(pe), {
                      class: "input",
                      "aria-label": t(ce)(t(N)(o.value), a.key, `settings.${a.key}`),
                      "model-value": String(p.value[o.value]?.[a.key] ?? ""),
                      options: Z.value,
                      "onUpdate:modelValue": (A) => p.value[o.value] = { ...p.value[o.value], [a.key]: A }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    a.help || a.helpKey ? (n(), i("p", Nd, l(t(he)(t(N)(o.value), a.key, `settings.${a.key}Desc`)), 1)) : E("", !0)
                  ], 64)) : a.type === "models" ? (n(), i(B, { key: 3 }, [
                    e("label", null, l(t(ce)(t(N)(o.value), a.key, `settings.${a.key}`)), 1),
                    X(qe, {
                      "model-value": String(p.value[o.value]?.[a.key] ?? ""),
                      options: P.value,
                      "onUpdate:modelValue": (A) => p.value[o.value] = { ...p.value[o.value], [a.key]: A }
                    }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                    a.help || a.helpKey ? (n(), i("p", Vd, l(t(he)(t(N)(o.value), a.key, `settings.${a.key}Desc`)), 1)) : E("", !0)
                  ], 64)) : (n(), i(B, { key: 4 }, [
                    e("label", null, l(t(ce)(t(N)(o.value), a.key, `settings.${a.key}`)), 1),
                    e("input", {
                      class: "input",
                      type: a.type === "number" ? "number" : "text",
                      value: p.value[o.value]?.[a.key],
                      onInput: (A) => p.value[o.value] = { ...p.value[o.value], [a.key]: a.type === "number" ? Number(A.target.value) : A.target.value }
                    }, null, 40, Rd),
                    a.help || a.helpKey ? (n(), i("p", Od, l(t(he)(t(N)(o.value), a.key, `settings.${a.key}Desc`)), 1)) : E("", !0)
                  ], 64))
                ]))), 128)),
                k.value ? (n(), i("div", {
                  key: 2,
                  class: W(["helper-text", C.value === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, l(k.value), 3)) : E("", !0),
                e("div", Id, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: L.value,
                    onClick: M[5] || (M[5] = (a) => Me(o.value))
                  }, l(t(s)("settings.save")), 9, zd)
                ])
              ])) : o.value === "about" ? (n(), ne(Sl, { key: "about" })) : o.value === "updates" ? (n(), ne(go, { key: "updates" })) : o.value === "danger" ? (n(), ne(Zr, { key: "danger" })) : (n(), i("div", Ld, [
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
  Wd as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent="@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage[data-v-15b509be]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-15b509be]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-15b509be]:active{cursor:grabbing}.stage-canvas[data-v-15b509be]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-15b509be]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-15b509be]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-15b509be]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-15b509be]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-15b509be]:active{transform:scale(.96)}.stage-reset.dragging[data-v-15b509be]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-15b509be]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-15b509be]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-15b509be]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-e199848c]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-e199848c]{flex-direction:row-reverse}.avatar[data-v-e199848c]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-e199848c]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-e199848c]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-e199848c]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-e199848c]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-e199848c]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-e199848c]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden}.msg-file-name[data-v-e199848c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-e199848c]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-e199848c]{max-width:70%}.content[data-v-e199848c]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.content-markdown[data-v-e199848c]{white-space:normal}.user .content[data-v-e199848c]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-e199848c]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-e199848c]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-e199848c]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-e199848c]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-e199848c]{margin:4px 0}.think-body b[data-v-e199848c]{color:var(--md-on-surface)}.think-summary[data-v-e199848c]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-e199848c]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-e199848c]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-e199848c]{justify-content:flex-end}.separator[data-v-e199848c]{color:var(--neutral-gray-10)}.emotion[data-v-e199848c]{font-weight:500}.chat-panel[data-v-8f0db4ce]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-8f0db4ce]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-8f0db4ce]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-8f0db4ce]{color:var(--md-error)}.chat-container[data-v-8f0db4ce]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-8f0db4ce]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-8f0db4ce]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-8f0db4ce]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-8f0db4ce]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-8f0db4ce]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-8f0db4ce]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-8f0db4ce]{display:flex;gap:4px}.typing-dots span[data-v-8f0db4ce]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-8f0db4ce 1.4s infinite ease-in-out}.typing-dots span[data-v-8f0db4ce]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-8f0db4ce]:nth-child(2){animation-delay:-.16s}@keyframes bounce-8f0db4ce{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-8f0db4ce]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-8f0db4ce]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-8f0db4ce]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-8f0db4ce]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-8f0db4ce]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-8f0db4ce],.pending-files[data-v-8f0db4ce]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-8f0db4ce]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden}.pending-file-name[data-v-8f0db4ce]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-8f0db4ce]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-8f0db4ce]:hover{color:var(--error)}.pending-thumb[data-v-8f0db4ce]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-8f0db4ce]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-8f0db4ce]{position:absolute;top:2px;right:2px;width:22px;height:22px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.pending-thumb.uploading[data-v-8f0db4ce]{display:flex;align-items:center;justify-content:center;background:var(--md-surface-container-high);animation:thumb-shimmer-8f0db4ce 1.2s infinite}.upload-spinner[data-v-8f0db4ce]{width:18px;height:18px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:upload-spin-8f0db4ce .8s linear infinite}@keyframes upload-spin-8f0db4ce{to{transform:rotate(360deg)}}@keyframes thumb-shimmer-8f0db4ce{0%,to{opacity:1}50%{opacity:.55}}@media(prefers-reduced-motion:reduce){.pending-thumb.uploading[data-v-8f0db4ce]{animation:none}}.attach-btn[data-v-8f0db4ce]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-8f0db4ce]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-8f0db4ce]:disabled{opacity:.5;cursor:not-allowed}.send-button[data-v-8f0db4ce]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-8f0db4ce]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-8f0db4ce]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-8f0db4ce]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-8f0db4ce]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-8f0db4ce]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-8f0db4ce]{background:var(--success)}.disconnected .status-dot[data-v-8f0db4ce]{background:var(--error)}.hint[data-v-8f0db4ce]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-45331204]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-45331204]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-45331204]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-45331204]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-45331204]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-45331204]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-45331204]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-45331204]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-45331204]{margin-bottom:var(--space-xl)}.section-header[data-v-45331204]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-45331204]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.mood-display[data-v-45331204]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-45331204]{margin-bottom:var(--space-md)}.mood-label[data-v-45331204]{font-size:var(--font-size-md);font-weight:600}.emotion-bars[data-v-45331204]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-45331204]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-45331204]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-45331204]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-45331204]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-45331204]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.chat-page[data-v-599f785f]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-599f785f]{grid-template-columns:1fr}.stage-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-599f785f]{flex:1;min-height:240px}.status-panel[data-v-599f785f]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-599f785f]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-599f785f]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-599f785f]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-599f785f]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-599f785f]:hover,.page-resizer[data-v-599f785f]:active{background:var(--md-primary)}.chat-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-599f785f]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-599f785f]{display:flex;flex-direction:column}.stage-column[data-v-599f785f]{flex:1;min-height:0}.page-resizer[data-v-599f785f]{display:none}.chat-column[data-v-599f785f]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);visibility:hidden;transition:transform var(--transition-normal),visibility 0s linear var(--duration-medium)}.chat-column.open[data-v-599f785f]{transform:translate(0);visibility:visible;transition:transform var(--transition-normal),visibility 0s linear 0s}}.console[data-v-940c88b5]{display:flex;flex-direction:column;min-height:0;height:100%;background:var(--md-surface);color:var(--md-on-surface)}.pane-enter-active[data-v-940c88b5]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel)}.pane-leave-active[data-v-940c88b5]{transition:opacity var(--duration-instant) var(--ease-emphasized-accel)}.pane-enter-from[data-v-940c88b5],.pane-leave-to[data-v-940c88b5]{opacity:0}@media(prefers-reduced-motion:reduce){.pane-enter-active[data-v-940c88b5],.pane-leave-active[data-v-940c88b5]{transition-duration:1ms}}.console-bar[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:flex-end;gap:var(--space-md);padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.tabs[data-v-940c88b5]{display:flex;gap:var(--space-xs)}.tab[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:0 14px;border:0;border-radius:var(--radius-full);background:transparent;color:var(--md-on-surface-variant);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}.tab[data-v-940c88b5]:hover{background:color-mix(in srgb,var(--md-on-surface) 7%,transparent)}.tab.active[data-v-940c88b5]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tab[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.tab-badge[data-v-940c88b5]{min-width:18px;padding:0 5px;border-radius:var(--radius-full);background:var(--md-error-container);color:var(--md-on-error-container);font-size:11px;font-weight:700;text-align:center}.controls[data-v-940c88b5]{display:flex;flex:1;flex-wrap:wrap;align-items:flex-end;gap:var(--space-sm)}.field[data-v-940c88b5]{display:flex;flex-direction:column;gap:2px}.field.grow[data-v-940c88b5]{flex:1;min-width:180px}.field-label[data-v-940c88b5]{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant)}.input[data-v-940c88b5]{min-height:34px;padding:0 10px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-sm);background:var(--md-surface-container-lowest);color:inherit;font:inherit;font-size:13px}.input[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:1px}.check[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap}.btn[data-v-940c88b5]{min-height:34px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast)}.btn[data-v-940c88b5]:hover:not(:disabled){background:var(--md-surface-container-high)}.btn[data-v-940c88b5]:disabled{opacity:.5;cursor:default}.btn[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.status[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);white-space:nowrap}.status .dot[data-v-940c88b5]{width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.status.live .dot[data-v-940c88b5]{background:var(--md-success);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-success) 22%,transparent)}.status.dead .dot[data-v-940c88b5]{background:var(--md-error)}.banner[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-sm);margin:0;padding:var(--space-sm) var(--space-lg);background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px}.banner code[data-v-940c88b5]{flex:1;min-width:0;overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.pane[data-v-940c88b5]{flex:1;min-height:0;overflow:auto}.empty[data-v-940c88b5]{padding:var(--space-xl);color:var(--md-on-surface-variant);font-size:13px}.rows[data-v-940c88b5]{margin:0;padding:0;list-style:none;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,monospace;font-size:12px;line-height:1.55}.row[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;padding:3px var(--space-lg);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.row[data-v-940c88b5]:hover{background:color-mix(in srgb,var(--md-on-surface) 4%,transparent)}.row[data-v-940c88b5]:before{content:\"\";width:3px;align-self:stretch;margin:1px 0;border-radius:2px;background:var(--md-outline)}.row.debug[data-v-940c88b5]:before{background:var(--md-outline)}.row.info[data-v-940c88b5]:before{background:var(--md-primary)}.row.warn[data-v-940c88b5]:before{background:var(--md-warning)}.row.error[data-v-940c88b5]:before{background:var(--md-error)}.row.ok[data-v-940c88b5]:before{background:var(--md-success)}.ts[data-v-940c88b5]{color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.lvl[data-v-940c88b5]{min-width:46px;font-weight:700;color:var(--md-on-surface-variant);white-space:nowrap}.row.warn .lvl[data-v-940c88b5]{color:var(--md-warning)}.row.error .lvl[data-v-940c88b5]{color:var(--md-error)}.component[data-v-940c88b5]{min-width:96px;padding:0 6px;border-radius:var(--radius-sm);background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.msg[data-v-940c88b5]{flex:1;min-width:200px;word-break:break-word}.kv[data-v-940c88b5]{color:var(--md-on-surface-variant);white-space:nowrap}.kv .k[data-v-940c88b5]{opacity:.7}.kv .v[data-v-940c88b5]{color:var(--md-on-surface)}.err[data-v-940c88b5]{color:var(--md-error)}.event[data-v-940c88b5]{padding:0 6px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.dur[data-v-940c88b5]{margin-left:auto;color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.indent[data-v-940c88b5]{flex:none}.link[data-v-940c88b5]{padding:0;border:0;background:none;color:var(--md-primary);font:inherit;font-size:11px;cursor:pointer;text-decoration:underline dotted}.link[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}@media(max-width:720px){.console-bar[data-v-940c88b5]{align-items:stretch}.controls[data-v-940c88b5]{flex-direction:column;align-items:stretch}.component[data-v-940c88b5],.lvl[data-v-940c88b5]{min-width:0}}#app .console[data-v-940c88b5] :is(.tab,.btn){min-height:34px;border-radius:var(--radius-full)}#app .console .input[data-v-940c88b5]{min-height:34px;border-radius:var(--radius-sm)}.plugins-page[data-v-147ee65e]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-147ee65e]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-147ee65e]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-147ee65e],.pp-hero h1[data-v-147ee65e]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-147ee65e]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-147ee65e]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-147ee65e]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.banner-enter-active[data-v-147ee65e]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}.banner-leave-active[data-v-147ee65e]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.banner-enter-from[data-v-147ee65e],.banner-leave-to[data-v-147ee65e]{opacity:0;transform:translateY(-6px)}.pp-stats[data-v-147ee65e]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-147ee65e]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-147ee65e]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-147ee65e]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-147ee65e]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-147ee65e]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-147ee65e]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-147ee65e]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-147ee65e]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-147ee65e var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-147ee65e{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-147ee65e]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-147ee65e]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-147ee65e]{opacity:.62}.plugin-top[data-v-147ee65e]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-147ee65e]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-147ee65e]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-147ee65e]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-147ee65e]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-147ee65e]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-147ee65e]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-147ee65e]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-147ee65e]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-147ee65e]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-147ee65e]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-147ee65e]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-147ee65e]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-147ee65e]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-147ee65e]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-147ee65e]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-147ee65e]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-147ee65e]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-147ee65e]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-147ee65e]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-147ee65e]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-147ee65e]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-147ee65e]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-147ee65e]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-147ee65e]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-147ee65e]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-147ee65e]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-147ee65e]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-147ee65e]{white-space:nowrap}#app .plugins-page .btn[data-v-147ee65e]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-147ee65e]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-147ee65e]:disabled{opacity:.6;cursor:not-allowed}.empty-state[data-v-147ee65e]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-147ee65e]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-147ee65e]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-147ee65e]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-147ee65e]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-147ee65e]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-147ee65e]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-147ee65e],.pd-leave-to[data-v-147ee65e]{opacity:0}.pd-enter-active .pd-dialog[data-v-147ee65e]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-147ee65e]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-147ee65e],.pd-leave-to .pd-dialog[data-v-147ee65e]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-147ee65e]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-147ee65e]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-147ee65e]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-147ee65e]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-147ee65e]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-147ee65e]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-147ee65e]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-147ee65e]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-147ee65e]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-147ee65e]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-147ee65e]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-147ee65e]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-147ee65e]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-147ee65e]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-147ee65e]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-147ee65e]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-147ee65e]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-147ee65e]{color:var(--md-error)}.pd-foot[data-v-147ee65e]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-147ee65e]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn[data-v-147ee65e]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-147ee65e],.pd-leave-active[data-v-147ee65e],.pd-enter-active .pd-dialog[data-v-147ee65e],.pd-leave-active .pd-dialog[data-v-147ee65e]{transition:none}.pd-enter-from .pd-dialog[data-v-147ee65e],.pd-leave-to .pd-dialog[data-v-147ee65e]{transform:none}}.life-settings[data-v-cd0c2989]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-cd0c2989]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-cd0c2989 .52s var(--ls-spring) both}.ls-hero-main[data-v-cd0c2989]{min-width:0}.ls-eyebrow[data-v-cd0c2989]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-cd0c2989]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-cd0c2989]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-cd0c2989]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-cd0c2989]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-cd0c2989]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-cd0c2989]{font-size:16px}.ls-grid[data-v-cd0c2989]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-cd0c2989]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-cd0c2989 .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-cd0c2989]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-cd0c2989]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-cd0c2989]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-cd0c2989]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-cd0c2989]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-cd0c2989]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-cd0c2989]{grid-column:1 / -1}.ls-card-head[data-v-cd0c2989]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-cd0c2989]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-cd0c2989]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-cd0c2989]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-cd0c2989]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-cd0c2989]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-cd0c2989]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-cd0c2989]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-cd0c2989]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-cd0c2989]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-cd0c2989]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-cd0c2989]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-cd0c2989]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-cd0c2989]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-cd0c2989]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-cd0c2989]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-cd0c2989]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-cd0c2989]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-cd0c2989]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-cd0c2989]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-cd0c2989]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-cd0c2989]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-cd0c2989]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-cd0c2989]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-cd0c2989]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-cd0c2989]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-cd0c2989]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-cd0c2989]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-cd0c2989]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-cd0c2989]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-cd0c2989]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-cd0c2989]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-cd0c2989]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-cd0c2989]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}#app .ls-model[data-v-cd0c2989]{border-radius:20px}#app .ls-model.selected[data-v-cd0c2989]{border-radius:20px 20px 20px 8px}.ls-model b[data-v-cd0c2989]{font-size:13px;word-break:break-all}.ls-model span[data-v-cd0c2989]{font-size:12px;color:var(--md-on-surface-variant)}.ls-state[data-v-cd0c2989]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-cd0c2989 .32s var(--ls-spring) both}@keyframes ls-rise-cd0c2989{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-cd0c2989{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-cd0c2989],.ls-row[data-v-cd0c2989],.ls-models[data-v-cd0c2989]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-cd0c2989],.ls-card[data-v-cd0c2989],.ls-state[data-v-cd0c2989]{animation:none}}.about[data-v-da8c447d]{display:flex;flex-direction:column;gap:26px}.identity[data-v-da8c447d]{display:flex;align-items:center;gap:16px}.app-icon[data-v-da8c447d]{flex:none;width:56px;height:56px;filter:drop-shadow(0 6px 16px color-mix(in srgb,var(--md-primary) 25%,transparent))}.app-id[data-v-da8c447d]{flex:1;min-width:0}.app-id h2[data-v-da8c447d]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-da8c447d]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-da8c447d]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-da8c447d]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-da8c447d]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-da8c447d]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-da8c447d]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-da8c447d]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.credits[data-v-da8c447d]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-da8c447d]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-da8c447d]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-da8c447d]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-da8c447d]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-da8c447d]{font-size:16px;font-weight:650}.person-info .role[data-v-da8c447d]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-da8c447d]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-da8c447d]{margin-top:6px}.contribs[data-v-da8c447d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-da8c447d]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-da8c447d]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-da8c447d]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-da8c447d]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-da8c447d]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-da8c447d]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-da8c447d]{margin-left:auto}.status-chip[data-v-da8c447d]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-da8c447d]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-da8c447d]:hover{text-decoration:underline}.muted[data-v-da8c447d]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-da8c447d]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-da8c447d]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-hero.warn[data-v-da8c447d]{background:var(--md-warning-container);color:var(--md-on-warning-container);border-color:transparent}.us-hero.none[data-v-da8c447d]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-da8c447d]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-da8c447d]{flex:1;min-width:0}.us-hero-text b[data-v-da8c447d]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-da8c447d]{font-size:13px;opacity:.85}.us-hero-text em[data-v-da8c447d]{font-style:normal;font-weight:700}.us-hero-actions[data-v-da8c447d]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-da8c447d]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-da8c447d]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-da8c447d]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-da8c447d]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-da8c447d]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-da8c447d]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-apply-banner.failed[data-v-da8c447d]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-da8c447d]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-da8c447d]{font-weight:700}.us-apply-label[data-v-da8c447d]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-da8c447d]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-da8c447d]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-da8c447d]{animation:us-spin-da8c447d .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-da8c447d],.us-apply-banner.failed .us-spinner[data-v-da8c447d]{display:none}.us-apply-log[data-v-da8c447d],.us-apply-error[data-v-da8c447d]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-da8c447d{to{transform:rotate(360deg)}}.alert[data-v-da8c447d]{color:var(--md-error)}.updates[data-v-95a0aad4]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-95a0aad4]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-95a0aad4]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-95a0aad4]{display:flex;align-items:center;gap:12px}.us-ico[data-v-95a0aad4]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-95a0aad4]{flex:1;min-width:0}.us-title[data-v-95a0aad4]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-95a0aad4]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-95a0aad4]{display:flex;align-items:center;gap:8px}.us-tag[data-v-95a0aad4]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-95a0aad4]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-95a0aad4]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-95a0aad4]{background:#ffdf9e;color:#4a3800}.us-source[data-v-95a0aad4]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-95a0aad4]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-95a0aad4]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-95a0aad4]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-95a0aad4]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-95a0aad4]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-95a0aad4]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-95a0aad4]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-95a0aad4]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-95a0aad4]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-95a0aad4]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-95a0aad4]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-95a0aad4]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-95a0aad4]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-95a0aad4]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-95a0aad4]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-95a0aad4]{flex:1;min-width:0}.us-hero-text b[data-v-95a0aad4]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-95a0aad4]{font-size:13px;opacity:.85}.us-hero-text em[data-v-95a0aad4]{font-style:normal;font-weight:700}.us-hero-actions[data-v-95a0aad4]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-95a0aad4]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-95a0aad4]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-95a0aad4]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-95a0aad4]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-95a0aad4]{font-weight:700}.us-apply-label[data-v-95a0aad4]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-95a0aad4]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-95a0aad4]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-95a0aad4]{animation:us-spin-95a0aad4 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-95a0aad4],.us-apply-banner.failed .us-spinner[data-v-95a0aad4]{display:none}.us-apply-log[data-v-95a0aad4],.us-apply-error[data-v-95a0aad4]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-95a0aad4{to{transform:rotate(360deg)}}.us-table[data-v-95a0aad4]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-95a0aad4]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-95a0aad4]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-95a0aad4]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-95a0aad4]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden}.us-name-text[data-v-95a0aad4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-95a0aad4]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-95a0aad4]{background:var(--md-success)}.us-dot.warn[data-v-95a0aad4]{background:#e0a800}.us-dot.bad[data-v-95a0aad4]{background:var(--md-error)}.us-ver[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-95a0aad4]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-95a0aad4]{font-weight:650}.us-ver b.good[data-v-95a0aad4]{color:var(--md-success)}.us-arrow[data-v-95a0aad4]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-95a0aad4]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden}.us-status-text[data-v-95a0aad4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-95a0aad4]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-95a0aad4]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-95a0aad4]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-95a0aad4]:hover{text-decoration:underline}.us-empty[data-v-95a0aad4]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-95a0aad4]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-95a0aad4]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.alert[data-v-95a0aad4]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-95a0aad4]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-95a0aad4]{display:none}.us-hero[data-v-95a0aad4]{flex-wrap:wrap}.us-hero-actions[data-v-95a0aad4]{width:100%}}.provider-panel[data-v-630e57ef]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-630e57ef]{display:flex;align-items:center;gap:14px}.pp-back[data-v-630e57ef]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-630e57ef]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-630e57ef]{flex:1;min-width:0}.pp-editor-title h2[data-v-630e57ef]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-630e57ef]{margin:3px 0 0}.pp-section[data-v-630e57ef]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-630e57ef]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-630e57ef]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-630e57ef]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-630e57ef]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-630e57ef]{margin-bottom:0}.pp-span[data-v-630e57ef]{grid-column:1 / -1}.pp-req[data-v-630e57ef]{color:var(--md-error);margin-left:2px}.pp-key[data-v-630e57ef]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-630e57ef]{flex:1}.pp-key-toggle[data-v-630e57ef]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-630e57ef]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-630e57ef]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-630e57ef]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-630e57ef]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-630e57ef]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-630e57ef]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-630e57ef]{animation:pp-pulse-630e57ef 1s ease-in-out infinite}@keyframes pp-pulse-630e57ef{50%{opacity:.15}}.pp-probe[data-v-630e57ef]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-630e57ef]{color:var(--md-success)}.pp-probe.err[data-v-630e57ef]{color:var(--md-error)}.pp-discovered[data-v-630e57ef]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-630e57ef]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-630e57ef]{flex:1;min-width:160px}.pp-mini[data-v-630e57ef]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-630e57ef]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-models[data-v-630e57ef]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-630e57ef]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-630e57ef]:first-child{border-top:0}.pp-model.off[data-v-630e57ef]{opacity:.5}.pp-model-name[data-v-630e57ef]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-630e57ef]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-630e57ef]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-630e57ef]{color:#e0a800;cursor:default}.pp-switch[data-v-630e57ef]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-630e57ef]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-630e57ef]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-630e57ef]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-630e57ef]{display:flex;gap:10px}.pp-list-head[data-v-630e57ef]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-630e57ef]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-630e57ef]{margin:3px 0 0}.pp-list-actions[data-v-630e57ef]{display:flex;gap:8px}.pp-cards[data-v-630e57ef]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-630e57ef]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-630e57ef]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-630e57ef]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-630e57ef]{opacity:.62}.pp-card-head[data-v-630e57ef]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-630e57ef]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-630e57ef]{width:26px;height:26px}.pp-card-id[data-v-630e57ef]{flex:1;min-width:0}.pp-card-id strong[data-v-630e57ef]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-630e57ef]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-630e57ef]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-630e57ef]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-630e57ef]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-630e57ef]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-630e57ef]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-630e57ef]{color:var(--md-error)}.pp-chips[data-v-630e57ef]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-630e57ef]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-630e57ef],.pp-chip.empty[data-v-630e57ef]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-630e57ef]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.pp-empty[data-v-630e57ef]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-630e57ef],.pp-cards[data-v-630e57ef]{grid-template-columns:1fr}}.pairing-panel[data-v-c18959f6]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-c18959f6]{margin:12px 0;color:var(--md-on-surface-variant)}.pairing-panel .pairing-error[data-v-c18959f6]{color:var(--md-error)}article[data-v-c18959f6]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-c18959f6]{font-size:24px;letter-spacing:4px}h4[data-v-c18959f6]{margin:18px 0 0}.pairing-list[data-v-c18959f6]{position:relative}.pair-enter-active[data-v-c18959f6],.pair-leave-active[data-v-c18959f6]{transition:opacity var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out)}.pair-enter-from[data-v-c18959f6],.pair-leave-to[data-v-c18959f6]{opacity:0;transform:translateY(4px)}.pair-leave-active[data-v-c18959f6]{position:absolute;width:100%}.pair-move[data-v-c18959f6]{transition:transform var(--duration-medium) var(--ease-out)}@media(prefers-reduced-motion:reduce){.pair-enter-active[data-v-c18959f6],.pair-leave-active[data-v-c18959f6],.pair-move[data-v-c18959f6]{transition-duration:1ms}}.connection-grid[data-v-b6056614]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,264px);gap:24px;align-items:start}@media(max-width:1000px){.connection-grid[data-v-b6056614]{grid-template-columns:minmax(0,1fr)}}.connection-form .field[data-v-b6056614]{margin-bottom:12px}.connection-qr[data-v-b6056614]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-b6056614]{background:#fff;border-radius:8px;padding:6px;width:100%;max-width:264px;height:auto}.connection-link[data-v-b6056614]{max-width:100%;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.helper-text[data-v-b6056614]{overflow-wrap:anywhere}.toggle-label[data-v-b6056614]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-fb8c17b3]{max-width:920px}.sec-stack[data-v-fb8c17b3]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-fb8c17b3]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-fb8c17b3]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-fb8c17b3]{font-size:15px;font-weight:700}.sec-chip[data-v-fb8c17b3]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-fb8c17b3]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-fb8c17b3]{margin:2px 0 12px}.sec-pin-grid[data-v-fb8c17b3]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-fb8c17b3]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-fb8c17b3]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-fb8c17b3]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-fb8c17b3]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-fb8c17b3]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-fb8c17b3]:hover{background:var(--md-surface-container)}.page-item[data-v-fb8c17b3]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-fb8c17b3]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-fb8c17b3]{width:44px;height:26px}.page-item .toggle-slider[data-v-fb8c17b3]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-fb8c17b3]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-fb8c17b3]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-fb8c17b3]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-fb8c17b3]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-fb8c17b3]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-fb8c17b3]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-fb8c17b3]{margin-top:12px}.sec-error[data-v-fb8c17b3]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-fb8c17b3]{grid-template-columns:1fr}}.mcp-panel[data-v-01485e38]{max-width:900px}.mcp-head[data-v-01485e38]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-01485e38]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-01485e38]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-01485e38]{display:flex;gap:10px}.error-banner[data-v-01485e38]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-01485e38]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-01485e38]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-01485e38]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-01485e38]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-01485e38]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-01485e38]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-01485e38]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-01485e38]{flex:1}.mcp-field>span[data-v-01485e38]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-01485e38],.mcp-field select[data-v-01485e38],.mcp-field textarea[data-v-01485e38]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-01485e38]{opacity:.7}.mcp-field textarea[data-v-01485e38]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-01485e38]:focus,.mcp-field select[data-v-01485e38]:focus,.mcp-field textarea[data-v-01485e38]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-01485e38]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-01485e38]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-01485e38]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-01485e38]{font-family:ui-monospace,monospace}.mail-grid[data-v-01485e38]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-01485e38]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-01485e38]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-01485e38]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-01485e38]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-01485e38]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-01485e38]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-01485e38]:disabled{opacity:.6;cursor:not-allowed}#app .mcp-panel[data-v-01485e38] :is(.btn,.mcp-remove){border-radius:999px}#app .mcp-panel .mcp-field[data-v-01485e38] :is(input,select,textarea){border-radius:12px}@media(max-width:720px){.mail-grid[data-v-01485e38]{grid-template-columns:1fr}}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.models-field[data-v-7089f4a3]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-7089f4a3]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-7089f4a3]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-7089f4a3]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-7089f4a3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-7089f4a3]{display:inline-flex;gap:4px}.models-actions button[data-v-7089f4a3]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-7089f4a3]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-7089f4a3]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-7089f4a3]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.usage-page[data-v-e1479886]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-e1479886]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-e1479886]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-e1479886]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-e1479886]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-e1479886]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-e1479886]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-e1479886]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-e1479886]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-e1479886]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .usage-page .btn[data-v-e1479886]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-e1479886]:disabled{opacity:.55;cursor:not-allowed}.overview[data-v-e1479886]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-e1479886]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-e1479886]{display:grid;place-items:center}.donut[data-v-e1479886]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-e1479886]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-e1479886]{fill:none;stroke-width:5}.donut-track[data-v-e1479886]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-e1479886]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-e1479886]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-e1479886]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-e1479886]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-e1479886]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-e1479886]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-e1479886]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-e1479886]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-e1479886]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-e1479886]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-e1479886]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-e1479886]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-e1479886]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-e1479886]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-e1479886]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-e1479886]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-e1479886]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-e1479886]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-e1479886]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-e1479886]{background:var(--md-primary)}.dot.completion[data-v-e1479886]{background:var(--md-tertiary)}.mini-stack[data-v-e1479886]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-e1479886]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-e1479886]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-e1479886]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-e1479886]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-e1479886]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-e1479886]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-e1479886]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-e1479886]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-e1479886]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-e1479886]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-e1479886]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-e1479886]{position:absolute;inset:0}.grid span[data-v-e1479886]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-e1479886]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-e1479886]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-e1479886]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-e1479886]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-e1479886]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-e1479886]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-e1479886]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-e1479886]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-e1479886 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-e1479886]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-e1479886]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-e1479886]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-e1479886]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-e1479886]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-e1479886]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-e1479886]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-e1479886]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-e1479886]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-e1479886]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-e1479886]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-e1479886]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-e1479886]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-e1479886]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}.usage-loading[data-v-e1479886]{display:grid;grid-template-columns:minmax(220px,.9fr) 1.5fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-xl)}.skeleton[data-v-e1479886]{border-radius:32px;background:var(--md-surface-container-low);min-height:180px;animation:sk-shimmer-e1479886 1.4s ease-in-out infinite}.sk-donut[data-v-e1479886]{min-height:220px}@keyframes sk-shimmer-e1479886{0%,to{opacity:1}50%{opacity:.55}}@media(max-width:980px){.usage-loading[data-v-e1479886]{grid-template-columns:1fr 1fr}}@media(max-width:640px){.usage-loading[data-v-e1479886]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.skeleton[data-v-e1479886]{animation:none;opacity:.7}}@keyframes up-e1479886{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-e1479886]{grid-template-columns:1fr 1fr}.mini-stack[data-v-e1479886]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-e1479886],.mini-stack[data-v-e1479886]{grid-template-columns:1fr}.chart[data-v-e1479886]{height:200px;padding-left:34px}.grid span i[data-v-e1479886]{left:-34px;width:28px}.axis span[data-v-e1479886]{font-size:11px}}@media(max-width:560px){.axis span[data-v-e1479886]{font-size:10px}.axis span[data-v-e1479886]:nth-child(2n){visibility:hidden}}\n";document.head.appendChild(s)}})();
