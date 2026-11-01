var ns = Object.defineProperty;
var ls = (g, s, h) => s in g ? ns(g, s, { enumerable: !0, configurable: !0, writable: !0, value: h }) : g[s] = h;
var ee = (g, s, h) => ls(g, typeof s != "symbol" ? s + "" : s, h);
import { defineComponent as _e, ref as x, computed as Z, onMounted as De, onUnmounted as rt, watch as Ge, openBlock as r, createElementBlock as u, normalizeClass as oe, createElementVNode as e, unref as t, normalizeStyle as Vt, toDisplayString as n, createCommentVNode as V, withModifiers as He, nextTick as os, createVNode as be, Fragment as G, renderList as de, createTextVNode as Re, reactive as as, withDirectives as O, vModelCheckbox as Ce, vModelText as W, withKeys as _t, createStaticVNode as is, vModelDynamic as rs, TransitionGroup as Lt, withCtx as ot, createBlock as $e, vModelSelect as ds, shallowRef as Rt, resolveDynamicComponent as cs, Transition as us, isRef as ps } from "vue";
import { useI18n as ye } from "vue-i18n";
import { useLifeStore as hs, useWizardStore as dt, live2dRuntimeReady as vs, DEFAULT_LIVE2D_MODELS as ms, apiGet as je, apiPost as at, ApiError as jt, useConfirm as st, useProvidersStore as fs, PROVIDERS as mt, AppSelect as We, getLanguage as gs, LOCALES as bs, setLanguage as _s, MarkdownContent as ys, useSettingsMeta as yt, useUIPatchesStore as Yt, PinInput as Ot, ModalShell as ks, useSettingsSectionsStore as ws, NavIcon as Dt } from "@0kay/host";
import { useRouter as Xt, useRoute as $s } from "vue-router";
const Ss = ["title"], Cs = {
  key: 0,
  class: "stage-placeholder"
}, Ps = {
  key: 1,
  class: "stage-status"
}, xs = {
  key: 2,
  class: "stage-status warn"
}, Ms = ["title", "aria-label"], Es = { class: "stage-hint" }, zt = "0kay.web.live2d.resetbtn", Us = "0kay.web.live2d.transform.", Ts = /* @__PURE__ */ _e({
  __name: "Live2DStage",
  props: {
    bare: { type: Boolean, default: !1 },
    transformScope: { default: "" }
  },
  setup(g) {
    const { t: s } = ye(), h = hs(), d = dt(), b = x(null), $ = x(null), p = x(""), y = x("idle"), C = x(""), i = g, o = Z(() => i.bare), l = Z(() => d.live2d.enabled), a = Z(() => d.live2d.modelUrl.trim()), c = Z(() => h.emotionMood), v = Z(() => {
      const m = String(c.value || "");
      if (!m) return "";
      const _ = `emotion.${m}`, A = s(_);
      return A === _ ? m : A;
    }), w = Z(() => h.emotionColor), f = x([]);
    async function E() {
      try {
        const m = await fetch("/api/live2d");
        if (m.ok) {
          const _ = await m.json();
          f.value = _.models || [];
        }
      } catch {
        f.value = [];
      }
    }
    const U = x(null), H = x(J()), R = x(!1);
    let I = !1, M = { x: 0, y: 0 }, T = { x: 0, y: 0 };
    function J() {
      try {
        const m = localStorage.getItem(zt);
        if (m) {
          const _ = JSON.parse(m);
          if (typeof _?.x == "number" && typeof _?.y == "number") return _;
        }
      } catch {
      }
      return null;
    }
    const ve = Z(() => H.value ? { left: `${H.value.x}px`, top: `${H.value.y}px`, right: "auto", bottom: "auto" } : {});
    function ae(m) {
      R.value = !0, I = !1, M = { x: m.clientX, y: m.clientY };
      const _ = U.value?.getBoundingClientRect();
      T = { x: _?.left ?? 0, y: _?.top ?? 0 };
      try {
        U.value?.setPointerCapture(m.pointerId);
      } catch {
      }
    }
    function K(m) {
      if (!R.value || !b.value) return;
      const _ = m.clientX - M.x, A = m.clientY - M.y;
      (Math.abs(_) > 3 || Math.abs(A) > 3) && (I = !0);
      const D = b.value.getBoundingClientRect(), le = U.value?.offsetWidth || 34, ue = ze(T.x - D.left + _, 4, Math.max(4, D.width - le - 4)), re = ze(T.y - D.top + A, 4, Math.max(4, D.height - le - 4));
      H.value = { x: Math.round(ue), y: Math.round(re) };
    }
    function j(m) {
      if (R.value) {
        R.value = !1;
        try {
          U.value?.releasePointerCapture(m.pointerId);
        } catch {
        }
        if (I)
          try {
            localStorage.setItem(zt, JSON.stringify(H.value));
          } catch {
          }
      }
    }
    function z() {
      if (I) {
        I = !1;
        return;
      }
      Qt();
    }
    let B = null, F = null, Ve = null, Te = 0, he = 0, Ee = { x: 0, y: 0, has: !1 }, Pe = !1, xe = null, te = { x: 0, y: 0 }, me = null, Ae = null, Se = null, pe = null, Me = null, fe = "off", se = 0, Ke = 0, Q = 0, L = 120, ie = ["ParamMouthOpenY"];
    function Ie(m) {
      const _ = F?.internalModel?.coreModel;
      if (!_) return;
      const A = ze(m, 0, 1);
      for (const D of ie)
        try {
          typeof _.setParameterValueById == "function" ? _.setParameterValueById(D, A) : typeof _.setParamFloat == "function" && _.setParamFloat(D, A);
        } catch {
        }
    }
    function Qe(m) {
      const _ = [];
      try {
        const A = m?.internalModel?.settings;
        let D = A?.getLipSyncParameters?.();
        if (!Array.isArray(D) && Array.isArray(A?.groups) && (D = A.groups.find((ue) => (ue?.Name || ue?.name || "").toLowerCase() === "lipsync")?.Ids), Array.isArray(D))
          for (const le of D) typeof le == "string" && le && _.push(le);
      } catch {
      }
      ie = _.length ? _ : ["ParamMouthOpenY"];
    }
    function Xe() {
      if (fe === "off") {
        se !== 0 && (se = 0, Ie(0));
        return;
      }
      if (fe === "audio" && pe && Me) {
        pe.getByteTimeDomainData(Me);
        let m = 0;
        for (let D = 0; D < Me.length; D++) {
          const le = (Me[D] - 128) / 128;
          m += le * le;
        }
        const _ = Math.sqrt(m / Me.length), A = ze(_ * 3.4, 0, 1);
        se = se * 0.35 + A * 0.65, Ie(se);
        return;
      }
      if (fe === "text") {
        const m = performance.now() - Ke;
        if (m > Q * L + 260) {
          fe = "off", se = 0, Ie(0);
          return;
        }
        const _ = m % L / L, A = _ < 0.5 ? 0.12 + 0.72 * Math.sin(_ / 0.5 * Math.PI) : 0.06;
        se = se * 0.45 + A * 0.55, Ie(se);
      }
    }
    async function k(m, _ = "") {
      if (!m) {
        P(_);
        return;
      }
      if (F)
        try {
          if (me || (me = new Audio(), me.crossOrigin = "anonymous", me.addEventListener("ended", () => {
            fe = "off", se = 0, Ie(0);
          })), Ae && Ae !== m)
            try {
              URL.revokeObjectURL(Ae);
            } catch {
            }
          if (Ae = m, me.src = m, !Se) {
            const A = window.AudioContext || window.webkitAudioContext;
            A && (Se = new A(), pe = Se.createAnalyser(), pe.fftSize = 1024, Me = new Uint8Array(pe.fftSize), Se.createMediaElementSource(me).connect(pe), pe.connect(Se.destination));
          }
          await Se?.resume().catch(() => {
          }), fe = "audio", await me.play().catch(() => {
            _ ? P(_) : (fe = "off", Ie(0));
          });
        } catch {
          _ ? P(_) : fe = "off";
        }
    }
    function P(m) {
      const _ = Array.from(String(m || "")).filter((A) => /\S/.test(A));
      _.length && (L = /[\u4e00-\u9fff]/.test(_.join("")) ? 140 : 80, Q = _.length, Ke = performance.now(), fe = "text");
    }
    function S() {
      fe = "off", se = 0, Ie(0);
      try {
        me?.pause();
      } catch {
      }
    }
    function ne(m) {
      const _ = m.detail || {};
      _.url ? k(_.url, _.text || "") : _.text && P(_.text);
    }
    let ke = {}, we = [], N = 0;
    function X(m) {
      ke = {}, we = [];
      try {
        const _ = m?.internalModel?.motionManager, A = m?.internalModel?.settings, D = _?.definitions || A?.motions || {};
        for (const [ue, re] of Object.entries(D)) ke[ue] = Array.isArray(re) ? re.length : 0;
        we = (_?.expressionManager?.definitions || A?.expressions || []).map((ue) => ue?.Name || ue?.name).filter((ue) => !!ue);
      } catch {
      }
      try {
        console.info("[live2d] motions", ke, "expressions", we);
      } catch {
      }
      try {
        window.__0KAY_LIVE2D_CAPS__ = { motions: ke, expressions: we };
      } catch {
      }
    }
    function Y(m, _) {
      if (!F) return;
      const A = Object.keys(ke).filter((re) => ke[re] > 0);
      if (!A.length) return;
      const D = A.find((re) => /idle/i.test(re)), le = m && ke[m] > 0, ue = le ? m : _ == null && D ? D : A.find((re) => re !== D) || A[0];
      try {
        const re = F.internalModel?.motionManager;
        if (typeof F.motion == "function" && le) {
          F.motion(ue, _);
          return;
        }
        if (_ == null) {
          re?.startRandomMotion?.(ue);
          return;
        }
        re?.startMotion?.(ue, _);
      } catch {
      }
    }
    const q = {
      smile: /smile|happy|joy|fun/i,
      laugh: /laugh|joy|happy/i,
      sad: /sad|sorrow|cry/i,
      angry: /angry|anger|mad/i,
      surprised: /surpris|shock|wow/i,
      shy: /shy|blush|embarrass/i,
      confused: /confus|puzzl|question/i,
      sleepy: /sleep|tired|doz/i,
      calm: /calm|normal|default|neutral/i
    };
    function Ue(m) {
      const _ = we.findIndex((D) => D.toLowerCase() === m.toLowerCase());
      if (_ >= 0) return _;
      const A = q[m.toLowerCase()];
      if (A) {
        const D = we.findIndex((le) => A.test(le));
        if (D >= 0) return D;
      }
      return we.indexOf(m);
    }
    function ge(m) {
      if (!F || !m) return;
      const _ = /^\d+$/.test(m) ? Number(m) : Ue(m), A = _ >= 0 ? _ : m;
      try {
        const D = F.internalModel?.motionManager?.expressionManager;
        if (D?.setExpression) {
          D.setExpression(A);
          return;
        }
        F.expression?.(A);
      } catch {
      }
    }
    function ce() {
      Fe(), !(typeof window > "u") && (N = window.setInterval(() => {
        if (fe !== "off" || document.hidden) return;
        const m = Object.keys(ke).filter((_) => ke[_] > 0 && !/idle/i.test(_));
        m.length && Math.random() < 0.6 && Y(m[Math.floor(Math.random() * m.length)]), we.length && Math.random() < 0.5 && ge(we[Math.floor(Math.random() * we.length)]);
      }, 9e3));
    }
    function Fe() {
      N && (clearInterval(N), N = 0);
    }
    function wt(m) {
      const _ = m.detail || {};
      _.expression && ge(_.expression), (_.group || _.index != null) && Y(_.group, _.index);
    }
    function Wt() {
      return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore);
    }
    function ze(m, _, A) {
      return Math.min(A, Math.max(_, m));
    }
    function ut() {
      const m = i.transformScope ? `${i.transformScope}|` : "";
      return Us + m + (a.value || "default");
    }
    function $t() {
      try {
        const m = localStorage.getItem(ut());
        if (!m) return null;
        const _ = JSON.parse(m);
        if (typeof _?.x == "number" && typeof _?.y == "number" && typeof _?.scale == "number") return _;
      } catch {
      }
      return null;
    }
    function pt(m = !1) {
      if (!F) return;
      const _ = () => {
        try {
          localStorage.setItem(ut(), JSON.stringify({
            x: Math.round(F.x * 100) / 100,
            y: Math.round(F.y * 100) / 100,
            scale: Math.round(F.scale.x * 1e4) / 1e4
          }));
        } catch {
        }
      };
      if (m) {
        he && (clearTimeout(he), he = 0), _();
        return;
      }
      he && clearTimeout(he), he = window.setTimeout(() => {
        he = 0, _();
      }, 140);
    }
    function St() {
      if (Fe(), fe = "off", se = 0, Je(), he && (clearTimeout(he), he = 0), F) {
        try {
          B?.stage && B.stage.removeChild(F), F.destroy?.();
        } catch {
        }
        F = null;
      }
    }
    function Ct() {
      if (It(), St(), Ve && (Ve.disconnect(), Ve = null), he && (clearTimeout(he), he = 0), B) {
        try {
          B.destroy(!1, { children: !0, texture: !1, baseTexture: !1 });
        } catch {
        }
        B = null;
      }
    }
    function Pt(m) {
      if (typeof m.getLocalBounds == "function") {
        const D = m.getLocalBounds();
        if (D && D.width > 0 && D.height > 0) return { width: D.width, height: D.height };
      }
      const _ = Math.max(Math.abs(m.scale.x) || 0, 1e-4), A = Math.max(Math.abs(m.scale.y) || 0, 1e-4);
      return { width: Math.max(m.width / _, 1), height: Math.max(m.height / A, 1) };
    }
    function ht(m = F) {
      if (!m || !B) return !1;
      const _ = B.screen.width, A = B.screen.height;
      if (!_ || !A) return !1;
      const D = Pt(m);
      if (D.width > 0 && D.height > 0) {
        const le = Math.min(_ / D.width, A / D.height) * 0.88;
        m.anchor?.set?.(0.5, 0.5), m.scale.set(le, le);
      }
      m.position.set(_ * 0.5, A * 0.55);
      try {
        const le = m.getBounds?.();
        if (le && le.width > 0 && le.height > 0) {
          m.x += _ * 0.5 - (le.x + le.width * 0.5), m.y += A * 0.55 - (le.y + le.height * 0.55);
          const ue = m.getBounds?.();
          if (ue && ue.width > 0 && ue.height > 0) {
            const re = Math.min(_ / ue.width, A / ue.height) * 0.88, Le = Math.abs(m.scale.x) || 1;
            if (Number.isFinite(re) && re > 0 && Math.abs(re - Le) / Le > 0.08) {
              const Be = Le * re;
              m.scale.set(Be, Be);
              const Ne = m.getBounds?.();
              Ne && Ne.width > 0 && (m.x += _ * 0.5 - (Ne.x + Ne.width * 0.5), m.y += A * 0.55 - (Ne.y + Ne.height * 0.55));
            }
          }
        }
      } catch {
      }
      return !0;
    }
    function qt() {
      if (!F) return { hw: 0, hh: 0 };
      const m = Pt(F), _ = Math.abs(F.scale.x) || 1, A = Math.abs(F.scale.y) || 1;
      return { hw: m.width * _ / 2, hh: m.height * A / 2 };
    }
    function nt() {
      if (!F || !B) return;
      const m = B.screen.width, _ = B.screen.height, { hw: A, hh: D } = qt(), le = Math.min(A * 0.7, m * 0.5), ue = Math.min(D * 0.7, _ * 0.5), re = le - A, Le = m - le + A, Be = ue - D, Ne = _ - ue + D, et = re <= Le ? ze(F.x, re, Le) : m * 0.5, Nt = Be <= Ne ? ze(F.y, Be, Ne) : _ * 0.55;
      F.position.set(et, Nt);
    }
    function Gt() {
      if (!F || !B) return;
      const m = $t();
      if (m && Number.isFinite(m.scale) && m.scale > 0) {
        F.anchor?.set?.(0.5, 0.5), F.scale.set(m.scale, m.scale), F.position.set(m.x, m.y), nt();
        return;
      }
      ht();
    }
    function Zt(m, _) {
      if (!F || !window.PIXI || typeof window.PIXI.Point != "function" || typeof F.toModelPosition != "function") return null;
      try {
        const A = new window.PIXI.Point(m, _);
        return F.toModelPosition(A, new window.PIXI.Point());
      } catch {
        return null;
      }
    }
    function xt(m, _, A) {
      const D = A - _;
      return !Number.isFinite(D) || Math.abs(D) <= 1e-4 ? 0 : ze((m - _) / D * 2 - 1, -1, 1);
    }
    function Mt(m, _) {
      const A = F?.internalModel, D = A?.focusController;
      if (!D || typeof D.focus != "function" || !B) return;
      const le = B.screen.width || 1, ue = B.screen.height || 1;
      let re = m / le * 2 - 1, Le = _ / ue * 2 - 1;
      const Be = Zt(m, _);
      if (Be && A.originalWidth && A.originalHeight) {
        const Ne = xt(Be.x, 0, A.originalWidth), et = xt(Be.y, 0, A.originalHeight);
        Ne >= -1 && Ne <= 1 && et >= -1 && et <= 1 && (re = re * 0.35 + Ne * 0.65, Le = Le * 0.35 + et * 0.65);
      }
      re = ze(re, -1, 1), Le = ze(Le, -1, 1), D.focus(re, -Le);
    }
    function lt() {
      Ee.has && Mt(Ee.x, Ee.y);
    }
    function Et(m) {
      if (!F || !B || !b.value) return;
      const _ = b.value.getBoundingClientRect();
      if (!_.width || !_.height) return;
      const A = (m.clientX - _.left) / _.width * B.screen.width, D = (m.clientY - _.top) / _.height * B.screen.height;
      Ee = { x: A, y: D, has: !0 }, Pe && m.pointerId === xe && (F.position.set(A + te.x, D + te.y), nt(), pt()), Mt(A, D);
    }
    function Ut(m) {
      if (!F || !B || !b.value || m.button !== 0 && m.pointerType === "mouse" || m.target?.closest?.(".stage-reset")) return;
      const _ = b.value.getBoundingClientRect();
      if (!_.width || !_.height) return;
      const A = (m.clientX - _.left) / _.width * B.screen.width, D = (m.clientY - _.top) / _.height * B.screen.height;
      Pe = !0, xe = m.pointerId, te = { x: F.x - A, y: F.y - D };
      try {
        b.value.setPointerCapture(m.pointerId);
      } catch {
      }
      b.value && (b.value.style.cursor = "grabbing");
    }
    function Je(m) {
      if (Pe && !(m && xe !== null && m.pointerId !== xe)) {
        if (Pe = !1, b.value) {
          try {
            xe !== null && b.value.releasePointerCapture(xe);
          } catch {
          }
          b.value.style.cursor = "grab";
        }
        xe = null, pt(!0);
      }
    }
    function Tt(m) {
      if (!F || y.value !== "ok" || m.shiftKey) return;
      m.preventDefault();
      const _ = m.deltaY < 0 ? 1.06 : 0.94, A = ze(F.scale.x * _, 0.08, 3.2);
      F.scale.set(A, A), nt(), lt(), pt();
    }
    function Qt() {
      if (!(!F || !B)) {
        try {
          localStorage.removeItem(ut());
        } catch {
        }
        he && (clearTimeout(he), he = 0);
        try {
          B.resize?.();
        } catch {
        }
        B?.stage && (B.stage.hitArea = B.screen), ht(), lt();
      }
    }
    function At() {
      It();
      const m = b.value;
      m && (m.style.cursor = "grab", m.addEventListener("pointermove", Et), m.addEventListener("pointerdown", Ut), m.addEventListener("pointerup", Je), m.addEventListener("pointercancel", Je), m.addEventListener("pointerleave", Je), m.addEventListener("wheel", Tt, { passive: !1 }));
    }
    function It() {
      const m = b.value;
      m && (m.removeEventListener("pointermove", Et), m.removeEventListener("pointerdown", Ut), m.removeEventListener("pointerup", Je), m.removeEventListener("pointercancel", Je), m.removeEventListener("pointerleave", Je), m.removeEventListener("wheel", Tt), Pe = !1, xe = null);
    }
    function es() {
      if (B || !$.value || !b.value) return;
      const m = window.PIXI;
      B = new m.Application({
        view: $.value,
        resizeTo: b.value,
        autoStart: !0,
        antialias: !0,
        backgroundAlpha: 0,
        powerPreference: "high-performance"
      }), B.stage && (B.stage.interactive = !0, B.stage.hitArea = B.screen), Ve = new ResizeObserver(() => {
        try {
          B?.resize?.();
        } catch {
        }
        if (B?.stage && (B.stage.hitArea = B.screen), F) {
          const _ = $t();
          _ && Number.isFinite(_.scale) && _.scale > 0 ? (F.position.set(_.x, _.y), F.scale.set(_.scale, _.scale), nt()) : ht();
        }
        lt();
      }), Ve.observe(b.value), At();
    }
    async function vt() {
      try {
        await vs;
      } catch (A) {
        y.value = "error", C.value = `Live2D runtime: ${A.message}`;
        return;
      }
      const m = ++Te;
      if (St(), !l.value) {
        y.value = "disabled", p.value = "";
        return;
      }
      if (!Wt()) {
        y.value = "no-libs", C.value = s("live2d.libsMissing");
        return;
      }
      const _ = a.value || f.value[0]?.url;
      if (!_) {
        y.value = "error", C.value = s("live2d.noModel");
        return;
      }
      if (y.value = "loading", C.value = "", p.value = _.split("/").pop() || _, await os(), B || es(), !B) {
        y.value = "error", C.value = s("live2d.stageMissing");
        return;
      }
      try {
        const A = await window.PIXI.live2d.Live2DModel.from(_, { autoInteract: !1 });
        if (m !== Te) {
          try {
            A.destroy?.();
          } catch {
          }
          return;
        }
        F = A, At(), A.anchor?.set?.(0.5, 0.5), B.stage.addChild(A), Gt();
        try {
          A.internalModel?.on?.("beforeModelUpdate", Xe);
        } catch {
        }
        Qe(A), X(A), y.value = "ok", lt(), Y("Idle"), ce();
      } catch (A) {
        if (m !== Te) return;
        console.error("Live2D load failed:", A), y.value = "error", C.value = A?.message || s("live2d.loadError");
      }
    }
    function ts() {
      if (!l.value) {
        Ct(), y.value = "disabled";
        return;
      }
      vt();
    }
    De(async () => {
      window.addEventListener("live2d-models-changed", E), window.addEventListener("live2d-speak", ne), window.addEventListener("live2d-motion", wt), window.__0KAY_LIVE2D__ = { speak: k, stop: S, motion: Y, expression: ge };
      try {
        const m = await fetch("/api/settings/live2d");
        if (m.ok) {
          const { values: _ } = await m.json();
          _ && typeof _.enabled == "boolean" && (d.live2d.enabled = _.enabled), _ && typeof _.model_url == "string" && (d.live2d.modelUrl = _.model_url);
        }
      } catch {
      }
      await E(), l.value ? vt() : y.value = "disabled";
    }), rt(() => {
      if (window.removeEventListener("live2d-models-changed", E), window.removeEventListener("live2d-speak", ne), window.removeEventListener("live2d-motion", wt), Fe(), S(), Ae) {
        try {
          URL.revokeObjectURL(Ae);
        } catch {
        }
        Ae = null;
      }
      try {
        Se?.close();
      } catch {
      }
      Se = null, Te++, Ct();
    }), Ge(l, ts), Ge(a, () => {
      l.value && vt();
    });
    const ss = { happy: 2, sad: 4, irritated: 6, neutral: 0, drowsy: 0, exhausted: 0, sleeping: 0 };
    return Ge(c, (m) => {
      if (!F || fe !== "off" || !we.length) return;
      const _ = ss[m] ?? 0;
      ge(we[_] || we[0]), (m === "happy" || m === "irritated") && Math.random() < 0.5 && Y();
    }), (m, _) => (r(), u("div", {
      class: oe(["live2d-stage", { on: l.value, bare: o.value }])
    }, [
      e("div", {
        ref_key: "stageEl",
        ref: b,
        class: "stage-viewport",
        style: Vt({ "--mood": w.value }),
        title: l.value && y.value === "ok" ? t(s)("live2d.interactHint") : ""
      }, [
        e("canvas", {
          ref_key: "canvasEl",
          ref: $,
          class: "stage-canvas"
        }, null, 512),
        l.value ? y.value === "loading" ? (r(), u("div", Ps, n(t(s)("live2d.loading")), 1)) : y.value === "error" || y.value === "no-libs" ? (r(), u("div", xs, n(C.value || t(s)("live2d.loadError")), 1)) : V("", !0) : (r(), u("div", Cs, [
          e("p", null, n(t(s)("live2d.disabledHint")), 1)
        ])),
        l.value && y.value === "ok" ? (r(), u("button", {
          key: 3,
          ref_key: "resetBtnEl",
          ref: U,
          class: oe(["stage-reset", { dragging: R.value }]),
          type: "button",
          style: Vt(ve.value),
          title: t(s)("live2d.resetView"),
          "aria-label": t(s)("live2d.resetView"),
          onPointerdown: He(ae, ["stop"]),
          onPointermove: He(K, ["stop"]),
          onPointerup: He(j, ["stop"]),
          onPointercancel: He(j, ["stop"]),
          onClick: He(z, ["stop"])
        }, "⟲", 46, Ms)) : V("", !0),
        _[0] || (_[0] = e("div", { class: "stage-gradient" }, null, -1)),
        e("div", Es, n(v.value), 1)
      ], 12, Ss)
    ], 2));
  }
}), Oe = (g, s) => {
  const h = g.__vccOpts || g;
  for (const [d, b] of s)
    h[d] = b;
  return h;
}, As = /* @__PURE__ */ Oe(Ts, [["__scopeId", "data-v-d05720d4"]]), Is = { class: "content-card" }, Ns = { class: "toggle-label" }, Vs = ["checked"], Ls = { class: "field" }, Rs = { class: "model-choices" }, Os = ["value", "checked", "onChange"], Ds = ["value", "placeholder"], zs = { class: "helper-text" }, Fs = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, Bs = { class: "helper-text" }, Ks = ["disabled"], Hs = { class: "field" }, js = ["disabled"], Ys = {
  key: 0,
  class: "helper-text",
  role: "status"
}, Xs = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, Js = ["value", "checked", "onChange"], Ws = ["onClick"], qs = /* @__PURE__ */ _e({
  __name: "Live2DPanel",
  props: {
    enabled: { type: Boolean },
    modelUrl: {},
    uploaded: {},
    msg: {},
    saving: { type: Boolean }
  },
  emits: ["update:enabled", "update:modelUrl", "save", "upload", "delete"],
  setup(g, { emit: s }) {
    const h = s, { t: d } = ye(), b = x(null);
    function $() {
      b.value?.click();
    }
    function p(C) {
      h("update:modelUrl", C), h("update:enabled", !0);
    }
    function y(C) {
      const i = C.target, o = i.files;
      !o || !o.length || (h("upload", o), i.value = "");
    }
    return (C, i) => (r(), u("div", Is, [
      e("h2", null, n(t(d)("settings.live2d")), 1),
      be(As, { class: "live2d-preview" }),
      e("label", Ns, [
        e("input", {
          type: "checkbox",
          checked: g.enabled,
          onChange: i[0] || (i[0] = (o) => h("update:enabled", o.target.checked))
        }, null, 40, Vs),
        i[3] || (i[3] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, n(t(d)("wizard.enableLive2d")), 1)
      ]),
      e("div", Ls, [
        e("label", null, n(t(d)("wizard.modelUrl")), 1),
        e("div", Rs, [
          (r(!0), u(G, null, de(t(ms), (o) => (r(), u("label", {
            key: o.id,
            class: oe(["model-choice", { selected: g.modelUrl === o.url }])
          }, [
            e("input", {
              type: "radio",
              name: "live2d-model",
              value: o.url,
              checked: g.modelUrl === o.url,
              onChange: (l) => p(o.url)
            }, null, 40, Os),
            e("span", null, n(o.label), 1),
            e("code", null, n(o.url), 1)
          ], 2))), 128))
        ]),
        e("input", {
          value: g.modelUrl,
          placeholder: t(d)("wizard.modelUrlPlaceholder"),
          class: "input",
          onInput: i[1] || (i[1] = (o) => h("update:modelUrl", o.target.value))
        }, null, 40, Ds),
        e("p", zs, [
          Re(n(t(d)("wizard.live2dHelp")) + " ", 1),
          e("a", Fs, n(t(d)("wizard.live2dSamples")), 1)
        ])
      ]),
      e("p", Bs, n(t(d)("settings.live2dHelper")), 1),
      e("button", {
        class: "btn btn-tonal",
        disabled: g.saving,
        onClick: i[2] || (i[2] = (o) => h("save"))
      }, n(g.saving ? t(d)("settings.saving") : t(d)("settings.saveLife2d")), 9, Ks),
      e("div", Hs, [
        e("label", null, n(t(d)("settings.uploadFolder")), 1),
        e("button", {
          type: "button",
          class: "upload-area",
          disabled: g.saving,
          onClick: $
        }, [
          e("span", null, n(t(d)("settings.uploadFolderHint")), 1)
        ], 8, js),
        e("input", {
          ref_key: "fileInput",
          ref: b,
          type: "file",
          webkitdirectory: "",
          directory: "",
          multiple: "",
          class: "file-input",
          onChange: y
        }, null, 544),
        g.msg ? (r(), u("p", Ys, n(g.msg), 1)) : V("", !0),
        g.uploaded && g.uploaded.length ? (r(), u("div", Xs, [
          (r(!0), u(G, null, de(g.uploaded, (o) => (r(), u("label", {
            key: o.id,
            class: oe(["model-choice", { selected: g.modelUrl === o.url }])
          }, [
            e("input", {
              type: "radio",
              name: "live2d-uploaded",
              value: o.url,
              checked: g.modelUrl === o.url,
              onChange: (l) => p(o.url)
            }, null, 40, Js),
            e("span", null, n(o.label), 1),
            e("code", null, n(o.url), 1),
            e("button", {
              type: "button",
              class: "btn btn-danger",
              onClick: He((l) => h("delete", o), ["prevent"])
            }, n(t(d)("settings.deleteModel")), 9, Ws)
          ], 2))), 128))
        ])) : V("", !0)
      ])
    ]));
  }
}), Gs = { class: "life-settings" }, Zs = { class: "ls-hero" }, Qs = { class: "ls-hero-main" }, en = { class: "ls-sub" }, tn = ["disabled"], sn = { class: "ls-grid" }, nn = { class: "ls-card" }, ln = { class: "ls-card-head" }, on = { class: "ls-switch" }, an = { class: "ls-switch-text" }, rn = { class: "ls-switch" }, dn = { class: "ls-switch-text" }, cn = { class: "ls-field" }, un = ["placeholder"], pn = { class: "ls-card" }, hn = { class: "ls-card-head" }, vn = { class: "ls-note" }, mn = { class: "ls-label" }, fn = { class: "ls-models" }, gn = ["onClick"], bn = {
  key: 0,
  class: "ls-empty"
}, _n = { class: "ls-label" }, yn = { class: "ls-models" }, kn = ["onClick"], wn = {
  key: 0,
  class: "ls-empty"
}, $n = { class: "ls-card" }, Sn = { class: "ls-card-head" }, Cn = { class: "ls-note" }, Pn = { class: "ls-switch" }, xn = { class: "ls-switch-text" }, Mn = { class: "ls-switch" }, En = { class: "ls-switch-text" }, Un = { class: "ls-card" }, Tn = { class: "ls-switch" }, An = { class: "ls-switch-text" }, In = { class: "ls-card ls-card-wide" }, Nn = { class: "ls-card-head" }, Vn = { class: "ls-row" }, Ln = { class: "ls-switch" }, Rn = { class: "ls-switch-text" }, On = { class: "ls-switch" }, Dn = { class: "ls-switch-text" }, zn = { class: "ls-row" }, Fn = { class: "ls-field" }, Bn = { class: "ls-field" }, Kn = { class: "ls-row" }, Hn = { class: "ls-field" }, jn = { class: "ls-field" }, Yn = ["placeholder"], Xn = { class: "ls-row" }, Jn = { class: "ls-field" }, Wn = { class: "ls-field" }, qn = { class: "ls-card ls-card-wide" }, Gn = { class: "ls-card-head" }, Zn = { class: "ls-row" }, Qn = { class: "ls-switch" }, el = { class: "ls-switch-text" }, tl = { class: "ls-row" }, sl = { class: "ls-field" }, nl = ["placeholder"], ll = { class: "ls-field" }, ol = ["title"], al = { class: "ls-hint" }, il = { class: "ls-card ls-card-wide" }, rl = { class: "ls-card-head" }, dl = { class: "ls-row" }, cl = { class: "ls-switch" }, ul = { class: "ls-switch-text" }, pl = { class: "ls-switch" }, hl = { class: "ls-switch-text" }, vl = { class: "ls-switch" }, ml = { class: "ls-switch-text" }, fl = { class: "ls-hint" }, gl = {
  key: 0,
  class: "ls-state"
}, bl = /* @__PURE__ */ _e({
  __name: "LifeSettingsPanel",
  setup(g) {
    const { t: s } = ye(), h = as({
      screen_watch: !1,
      computer_use: !1,
      report_agent_host: "",
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
      wake_enabled: !1,
      wake_nickname: "",
      asr_language: "zh",
      voice_reply_enabled: !0,
      selfie_enabled: !0,
      call_enabled: !1
    }), d = x(""), b = x(!1), $ = x(!1), p = x([]), y = x(""), C = x([]);
    async function i() {
      try {
        const [l, a] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (l.ok && (Object.assign(h, (await l.json()).values || {}), $.value = !0), a.ok) {
          const c = await a.json();
          C.value = Array.isArray(c.models) ? c.models.map((v) => ({ id: v.id, provider: v.provider || "custom", supports_thinking: v.supports_thinking })).filter((v) => v.id) : [], p.value = C.value.map((v) => v.id), y.value = s("lifeSettings.sourceFromCore");
        }
      } catch {
        d.value = s("lifeSettings.loadFailed");
      }
    }
    async function o() {
      if (!$.value) {
        d.value = s("lifeSettings.notLoaded");
        return;
      }
      b.value = !0, d.value = "";
      try {
        const l = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: h }) });
        if (!l.ok) throw new Error(String(l.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: h.screen_watch, computer_use: h.computer_use, report_agent_host: h.report_agent_host }) }), d.value = s("lifeSettings.savedNotice");
      } catch {
        d.value = s("lifeSettings.saveFailed");
      } finally {
        b.value = !1;
      }
    }
    return De(i), (l, a) => (r(), u("section", Gs, [
      e("header", Zs, [
        e("div", Qs, [
          a[20] || (a[20] = e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS", -1)),
          e("h2", null, n(t(s)("lifeSettings.title")), 1),
          e("p", en, n(t(s)("lifeSettings.subtitle")), 1)
        ]),
        e("button", {
          class: "ls-save",
          disabled: b.value,
          onClick: o
        }, [
          a[21] || (a[21] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          Re(n(b.value ? t(s)("common.saving") : t(s)("common.save")), 1)
        ], 8, tn)
      ]),
      e("div", sn, [
        e("article", nn, [
          e("div", ln, [
            a[22] || (a[22] = e("span", { class: "ls-ic tone-1" }, "◉", -1)),
            e("h3", null, n(t(s)("lifeSettings.hostPerms")), 1)
          ]),
          e("label", on, [
            O(e("input", {
              "onUpdate:modelValue": a[0] || (a[0] = (c) => h.screen_watch = c),
              type: "checkbox"
            }, null, 512), [
              [Ce, h.screen_watch]
            ]),
            a[23] || (a[23] = e("span", { class: "ls-track" }, null, -1)),
            e("span", an, [
              e("b", null, n(t(s)("lifeSettings.screenWatch")), 1),
              e("small", null, n(t(s)("lifeSettings.screenWatchDesc")), 1)
            ])
          ]),
          e("label", rn, [
            O(e("input", {
              "onUpdate:modelValue": a[1] || (a[1] = (c) => h.computer_use = c),
              type: "checkbox"
            }, null, 512), [
              [Ce, h.computer_use]
            ]),
            a[24] || (a[24] = e("span", { class: "ls-track" }, null, -1)),
            e("span", dn, [
              e("b", null, n(t(s)("lifeSettings.computerUse")), 1),
              e("small", null, n(t(s)("lifeSettings.computerUseDesc")), 1)
            ])
          ]),
          e("label", cn, [
            e("span", null, n(t(s)("lifeSettings.agentHost")), 1),
            O(e("input", {
              "onUpdate:modelValue": a[2] || (a[2] = (c) => h.report_agent_host = c),
              placeholder: t(s)("lifeSettings.agentHostPlaceholder")
            }, null, 8, un), [
              [W, h.report_agent_host]
            ])
          ])
        ]),
        e("article", pn, [
          e("div", hn, [
            a[25] || (a[25] = e("span", { class: "ls-ic tone-2" }, "✦", -1)),
            e("h3", null, n(t(s)("lifeSettings.thinkOutput")), 1)
          ]),
          e("p", vn, n(y.value || t(s)("lifeSettings.loadingModels")), 1),
          e("p", mn, n(t(s)("lifeSettings.thinkLabel")), 1),
          e("div", fn, [
            (r(!0), u(G, null, de(C.value, (c) => (r(), u("button", {
              key: "think-" + c.id,
              type: "button",
              class: oe(["ls-model", { selected: h.think_model === c.id }]),
              onClick: (v) => h.think_model = c.id
            }, [
              e("b", null, n(c.id), 1),
              e("span", null, n(c.provider) + " · " + n(c.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, gn))), 128)),
            C.value.length ? V("", !0) : (r(), u("span", bn, n(t(s)("lifeSettings.noModels")), 1))
          ]),
          e("p", _n, n(t(s)("lifeSettings.outputLabel")), 1),
          e("div", yn, [
            (r(!0), u(G, null, de(C.value, (c) => (r(), u("button", {
              key: "output-" + c.id,
              type: "button",
              class: oe(["ls-model", { selected: h.output_model === c.id }]),
              onClick: (v) => h.output_model = c.id
            }, [
              e("b", null, n(c.id), 1),
              e("span", null, n(c.provider) + " · output", 1)
            ], 10, kn))), 128)),
            C.value.length ? V("", !0) : (r(), u("span", wn, n(t(s)("lifeSettings.noModels")), 1))
          ])
        ]),
        e("article", $n, [
          e("div", Sn, [
            a[26] || (a[26] = e("span", { class: "ls-ic tone-3" }, "✉", -1)),
            e("h3", null, n(t(s)("lifeSettings.mail")), 1)
          ]),
          e("p", Cn, n(t(s)("lifeSettings.mailNote", { mcp: "0kay-mcp", mail: "mail" })), 1),
          e("label", Pn, [
            O(e("input", {
              "onUpdate:modelValue": a[3] || (a[3] = (c) => h.mail_auto_approve_all = c),
              type: "checkbox"
            }, null, 512), [
              [Ce, h.mail_auto_approve_all]
            ]),
            a[27] || (a[27] = e("span", { class: "ls-track" }, null, -1)),
            e("span", xn, [
              e("b", null, n(t(s)("lifeSettings.mailAutoApprove")), 1),
              e("small", null, n(t(s)("lifeSettings.mailAutoApproveDesc")), 1)
            ])
          ]),
          e("label", Mn, [
            O(e("input", {
              "onUpdate:modelValue": a[4] || (a[4] = (c) => h.mail_require_approval = c),
              type: "checkbox"
            }, null, 512), [
              [Ce, h.mail_require_approval]
            ]),
            a[28] || (a[28] = e("span", { class: "ls-track" }, null, -1)),
            e("span", En, [
              e("b", null, n(t(s)("lifeSettings.mailRequireApproval")), 1),
              e("small", null, n(t(s)("lifeSettings.mailRequireApprovalDesc")), 1)
            ])
          ])
        ]),
        e("article", Un, [
          a[30] || (a[30] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", Tn, [
            O(e("input", {
              "onUpdate:modelValue": a[5] || (a[5] = (c) => h.mcp_enabled = c),
              type: "checkbox"
            }, null, 512), [
              [Ce, h.mcp_enabled]
            ]),
            a[29] || (a[29] = e("span", { class: "ls-track" }, null, -1)),
            e("span", An, [
              e("b", null, n(t(s)("lifeSettings.mcpEnabled")), 1),
              e("small", null, n(t(s)("lifeSettings.mcpEnabledDesc")), 1)
            ])
          ])
        ]),
        e("article", In, [
          e("div", Nn, [
            a[31] || (a[31] = e("span", { class: "ls-ic tone-5" }, "☷", -1)),
            e("h3", null, n(t(s)("lifeSettings.onebot")), 1)
          ]),
          e("div", Vn, [
            e("label", Ln, [
              O(e("input", {
                "onUpdate:modelValue": a[6] || (a[6] = (c) => h.onebot_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.onebot_enabled]
              ]),
              a[32] || (a[32] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Rn, [
                e("b", null, n(t(s)("lifeSettings.onebotEnable")), 1)
              ])
            ]),
            e("label", On, [
              O(e("input", {
                "onUpdate:modelValue": a[7] || (a[7] = (c) => h.onebot_observe_group = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.onebot_observe_group]
              ]),
              a[33] || (a[33] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Dn, [
                e("b", null, n(t(s)("lifeSettings.onebotObserve")), 1),
                e("small", null, n(t(s)("lifeSettings.onebotObserveDesc")), 1)
              ])
            ])
          ]),
          e("div", zn, [
            e("label", Fn, [
              e("span", null, n(t(s)("lifeSettings.onebotWs")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[8] || (a[8] = (c) => h.onebot_ws_url = c),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [W, h.onebot_ws_url]
              ])
            ]),
            e("label", Bn, [
              e("span", null, n(t(s)("lifeSettings.onebotHttp")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[9] || (a[9] = (c) => h.onebot_http_url = c),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [W, h.onebot_http_url]
              ])
            ])
          ]),
          e("div", Kn, [
            e("label", Hn, [
              a[34] || (a[34] = e("span", null, "Access Token", -1)),
              O(e("input", {
                "onUpdate:modelValue": a[10] || (a[10] = (c) => h.onebot_access_token = c),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [W, h.onebot_access_token]
              ])
            ]),
            e("label", jn, [
              e("span", null, n(t(s)("lifeSettings.onebotKeywords")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[11] || (a[11] = (c) => h.onebot_trigger_keywords = c),
                placeholder: t(s)("lifeSettings.onebotKeywordsPlaceholder")
              }, null, 8, Yn), [
                [W, h.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", Xn, [
            e("label", Jn, [
              e("span", null, n(t(s)("lifeSettings.proactiveDaily")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[12] || (a[12] = (c) => h.proactive_daily_limit = c),
                type: "number",
                min: "0",
                placeholder: "3"
              }, null, 512), [
                [
                  W,
                  h.proactive_daily_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", Wn, [
              e("span", null, n(t(s)("lifeSettings.proactiveTarget")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[13] || (a[13] = (c) => h.proactive_target_limit = c),
                type: "number",
                min: "0",
                placeholder: "1"
              }, null, 512), [
                [
                  W,
                  h.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ]),
        e("article", qn, [
          e("div", Gn, [
            a[35] || (a[35] = e("span", { class: "ls-ic tone-2" }, "🎙", -1)),
            e("h3", null, n(t(s)("lifeSettings.wake")), 1)
          ]),
          e("div", Zn, [
            e("label", Qn, [
              O(e("input", {
                "onUpdate:modelValue": a[14] || (a[14] = (c) => h.wake_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.wake_enabled]
              ]),
              a[36] || (a[36] = e("span", { class: "ls-track" }, null, -1)),
              e("span", el, [
                e("b", null, n(t(s)("lifeSettings.wakeEnable")), 1),
                e("small", null, n(t(s)("lifeSettings.wakeEnableDesc")), 1)
              ])
            ])
          ]),
          e("div", tl, [
            e("label", sl, [
              e("span", null, n(t(s)("lifeSettings.wakeNickname")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[15] || (a[15] = (c) => h.wake_nickname = c),
                placeholder: t(s)("lifeSettings.wakeNicknamePlaceholder")
              }, null, 8, nl), [
                [W, h.wake_nickname]
              ])
            ]),
            e("label", ll, [
              e("span", null, n(t(s)("lifeSettings.asrLanguage")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[16] || (a[16] = (c) => h.asr_language = c),
                placeholder: "zh",
                title: t(s)("lifeSettings.asrLanguageDesc")
              }, null, 8, ol), [
                [W, h.asr_language]
              ])
            ])
          ]),
          e("p", al, n(t(s)("lifeSettings.wakeHint")), 1)
        ]),
        e("article", il, [
          e("div", rl, [
            a[37] || (a[37] = e("span", { class: "ls-ic tone-4" }, "📸", -1)),
            e("h3", null, n(t(s)("lifeSettings.media")), 1)
          ]),
          e("div", dl, [
            e("label", cl, [
              O(e("input", {
                "onUpdate:modelValue": a[17] || (a[17] = (c) => h.voice_reply_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.voice_reply_enabled]
              ]),
              a[38] || (a[38] = e("span", { class: "ls-track" }, null, -1)),
              e("span", ul, [
                e("b", null, n(t(s)("lifeSettings.mediaVoice")), 1),
                e("small", null, n(t(s)("lifeSettings.mediaVoiceDesc")), 1)
              ])
            ]),
            e("label", pl, [
              O(e("input", {
                "onUpdate:modelValue": a[18] || (a[18] = (c) => h.selfie_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.selfie_enabled]
              ]),
              a[39] || (a[39] = e("span", { class: "ls-track" }, null, -1)),
              e("span", hl, [
                e("b", null, n(t(s)("lifeSettings.mediaSelfie")), 1),
                e("small", null, n(t(s)("lifeSettings.mediaSelfieDesc")), 1)
              ])
            ]),
            e("label", vl, [
              O(e("input", {
                "onUpdate:modelValue": a[19] || (a[19] = (c) => h.call_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.call_enabled]
              ]),
              a[40] || (a[40] = e("span", { class: "ls-track" }, null, -1)),
              e("span", ml, [
                e("b", null, n(t(s)("lifeSettings.mediaCall")), 1),
                e("small", null, n(t(s)("lifeSettings.mediaCallDesc")), 1)
              ])
            ])
          ]),
          e("p", fl, n(t(s)("lifeSettings.mediaHint")), 1)
        ])
      ]),
      d.value ? (r(), u("p", gl, n(d.value), 1)) : V("", !0)
    ]));
  }
}), _l = /* @__PURE__ */ Oe(bl, [["__scopeId", "data-v-d91bdafc"]]), yl = "/okay-logo.svg", kl = { class: "content-card about" }, wl = { class: "identity" }, $l = { class: "app-id" }, Sl = { class: "ver-badge" }, Cl = { class: "app-desc" }, Pl = { class: "identity-actions" }, xl = ["href"], Ml = { class: "section" }, El = { class: "section-head" }, Ul = ["disabled"], Tl = {
  key: 0,
  class: "alert",
  role: "alert"
}, Al = {
  class: "us-hero-icon",
  "aria-hidden": "true"
}, Il = {
  key: 0,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Nl = {
  key: 1,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Vl = {
  key: 2,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ll = { class: "us-hero-text" }, Rl = { key: 0 }, Ol = { key: 1 }, Dl = { class: "us-hero-actions" }, zl = ["disabled"], Fl = ["disabled", "title"], Bl = ["href"], Kl = {
  key: 2,
  class: "us-notes"
}, Hl = { class: "us-notes-title" }, jl = { class: "us-notes-body" }, Yl = {
  key: 3,
  class: "alert",
  role: "alert"
}, Xl = { class: "us-apply-head" }, Jl = { key: 0 }, Wl = { key: 1 }, ql = {
  key: 0,
  class: "us-chip-tag"
}, Gl = { class: "us-apply-label" }, Zl = {
  key: 0,
  class: "us-apply-error"
}, Ql = {
  key: 1,
  class: "us-apply-log"
}, eo = { class: "section" }, to = { class: "section-title" }, so = { class: "credits" }, no = ["href"], lo = ["src", "alt"], oo = { class: "person-info" }, ao = { class: "name" }, io = { class: "role" }, ro = ["src"], co = { class: "person-info" }, uo = { class: "role" }, po = { class: "section-head contributors-head" }, ho = { class: "section-title" }, vo = { class: "muted" }, mo = {
  key: 0,
  class: "contribs"
}, fo = ["href"], go = ["src", "alt"], bo = { class: "login" }, _o = {
  key: 0,
  class: "count"
}, yo = {
  key: 1,
  class: "muted"
}, ko = ["href"], wo = { class: "foot" }, $o = ["href"], ft = "https://github.com/RazureSOFT/0KAY", So = "https://github.com/RazureSOFT", Co = /* @__PURE__ */ _e({
  __name: "AboutPanel",
  setup(g) {
    const { t: s } = ye(), h = x("0.1.3"), d = x([]), b = x(""), $ = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, p = (M, T = 96) => `https://github.com/${M}.png?size=${T}`, y = x(!1), C = x(null), i = x(""), o = x(null), l = x("");
    let a = null;
    function c(M) {
      return o.value?.status === "running" && o.value.plugin === M;
    }
    async function v(M, T) {
      if (o.value?.status !== "running") {
        l.value = "";
        try {
          o.value = await at("/api/plugins/pm/update", { plugin: M, version: T || "" }), f();
        } catch (J) {
          l.value = J instanceof Error ? J.message : String(J);
        }
      }
    }
    async function w() {
      try {
        o.value = await je("/api/plugins/pm/status");
      } catch {
        return;
      }
      o.value && o.value.status !== "running" && (E(), R());
    }
    function f() {
      a || (a = setInterval(w, 2e3));
    }
    function E() {
      a && (clearInterval(a), a = null);
    }
    const U = Z(() => {
      switch (o.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), H = Z(() => C.value ? C.value.has_update ? "warn" : C.value.latest ? "ok" : "none" : "none");
    async function R() {
      y.value = !0, i.value = "";
      try {
        const M = await je("/api/plugins/pm/check");
        C.value = M, M?.current && (h.value = String(M.current));
      } catch (M) {
        i.value = M instanceof jt && M.status === 404 ? s("settings.about.unsupported") : M instanceof Error ? M.message : String(M);
      } finally {
        y.value = !1;
      }
    }
    async function I() {
      try {
        const M = { Accept: "application/vnd.github+json" }, [T, J] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: M }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: M })
        ]);
        if (!T.ok) throw new Error(`HTTP ${T.status}`);
        const ve = /* @__PURE__ */ new Map(), ae = await T.json();
        for (const K of Array.isArray(ae) ? ae : [])
          K?.login && ve.set(K.login, K);
        if (J.ok) {
          const K = await J.json();
          for (const j of Array.isArray(K) ? K : []) {
            const z = j?.author;
            !z?.login || z.login.endsWith("[bot]") || ve.has(z.login) || ve.set(z.login, {
              login: z.login,
              avatar_url: z.avatar_url,
              html_url: z.html_url,
              contributions: 0
            });
          }
        }
        d.value = [...ve.values()].sort(
          (K, j) => (j.contributions || 0) - (K.contributions || 0) || K.login.localeCompare(j.login)
        );
      } catch (M) {
        b.value = M instanceof Error ? M.message : String(M), d.value = [];
      }
    }
    return De(() => {
      R(), I(), je("/api/plugins/pm/status").then((M) => {
        o.value = M, M?.status === "running" && f();
      }).catch(() => {
      });
    }), rt(E), (M, T) => (r(), u("div", kl, [
      e("header", wl, [
        T[3] || (T[3] = e("img", {
          class: "app-icon",
          src: yl,
          alt: "",
          "aria-hidden": "true"
        }, null, -1)),
        e("div", $l, [
          e("h2", null, [
            T[2] || (T[2] = Re("0KAY ", -1)),
            e("span", Sl, "v" + n(h.value), 1)
          ]),
          e("p", Cl, n(t(s)("settings.about.description")), 1)
        ]),
        e("div", Pl, [
          e("a", {
            class: "btn btn-tonal sm",
            href: ft,
            target: "_blank",
            rel: "noopener noreferrer"
          }, n(t(s)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${ft}/releases`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "Releases ↗", 8, xl)
        ])
      ]),
      e("section", Ml, [
        e("div", El, [
          T[4] || (T[4] = e("h3", { class: "section-title" }, "0KAY", -1)),
          e("button", {
            class: "btn btn-tonal sm",
            disabled: y.value,
            onClick: R
          }, n(t(s)(y.value ? "settings.about.checking" : "settings.about.check")), 9, Ul)
        ]),
        i.value ? (r(), u("p", Tl, n(i.value), 1)) : (r(), u("div", {
          key: 1,
          class: oe(["us-hero", H.value])
        }, [
          e("div", Al, [
            H.value === "ok" ? (r(), u("svg", Il, [...T[5] || (T[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : H.value === "warn" ? (r(), u("svg", Nl, [...T[6] || (T[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (r(), u("svg", Vl, [...T[7] || (T[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", Ll, [
            e("b", null, n(t(s)(H.value === "warn" ? "settings.about.available" : H.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            C.value?.latest ? (r(), u("span", Rl, [
              Re("v" + n(C.value.current) + " → ", 1),
              e("em", null, "v" + n(C.value.latest), 1)
            ])) : (r(), u("span", Ol, "0KAY v" + n(C.value?.current || h.value), 1))
          ]),
          e("div", Dl, [
            C.value?.has_update ? (r(), u("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: c("core"),
              onClick: T[0] || (T[0] = (J) => v("core", C.value.latest))
            }, n(c("core") ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, zl)) : V("", !0),
            C.value?.source_available !== !1 ? (r(), u("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: c("core"),
              title: t(s)("settings.about.betaHint"),
              onClick: T[1] || (T[1] = (J) => v("core"))
            }, n(c("core") ? t(s)("settings.about.updating") : t(s)("settings.about.beta")), 9, Fl)) : V("", !0),
            C.value?.url ? (r(), u("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: C.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, Bl)) : V("", !0)
          ])
        ], 2)),
        C.value?.notes ? (r(), u("div", Kl, [
          e("p", Hl, n(t(s)("settings.about.whatsNew")), 1),
          e("pre", jl, n(C.value.notes), 1)
        ])) : V("", !0),
        l.value ? (r(), u("p", Yl, n(l.value), 1)) : V("", !0),
        o.value && o.value.status !== "idle" ? (r(), u("div", {
          key: 4,
          class: oe(["us-apply-banner", o.value.status])
        }, [
          e("div", Xl, [
            T[8] || (T[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Re(n(o.value.package), 1),
              o.value.version ? (r(), u("span", Jl, "@" + n(o.value.version), 1)) : (r(), u("span", Wl, " · main"))
            ]),
            o.value.mode === "source" ? (r(), u("span", ql, n(t(s)("settings.about.sourceMode")), 1)) : V("", !0),
            e("span", Gl, n(U.value), 1)
          ]),
          o.value.error ? (r(), u("p", Zl, n(o.value.error), 1)) : V("", !0),
          o.value.log ? (r(), u("pre", Ql, n(o.value.log), 1)) : V("", !0)
        ], 2)) : V("", !0)
      ]),
      e("section", eo, [
        e("h3", to, n(t(s)("settings.about.developerTitle")) + " & " + n(t(s)("settings.about.teamTitle")), 1),
        e("div", so, [
          e("a", {
            class: "person",
            href: $.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: $.avatar,
              alt: $.login,
              loading: "lazy"
            }, null, 8, lo),
            e("div", oo, [
              e("span", ao, n($.login), 1),
              e("span", io, n(t(s)("settings.about.developerTitle")), 1)
            ]),
            T[9] || (T[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, no),
          e("a", {
            class: "person",
            href: So,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: p("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, ro),
            e("div", co, [
              T[10] || (T[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", uo, n(t(s)("settings.about.teamTitle")), 1)
            ]),
            T[11] || (T[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", po, [
          e("h3", ho, n(t(s)("settings.about.contributorsTitle")), 1),
          e("span", vo, n(t(s)("settings.about.contributorsFrom")), 1)
        ]),
        d.value.length ? (r(), u("div", mo, [
          (r(!0), u(G, null, de(d.value, (J) => (r(), u("a", {
            key: J.login,
            class: "contrib",
            href: J.html_url || `https://github.com/${J.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: J.avatar_url || p(J.login, 64),
              alt: J.login,
              loading: "lazy"
            }, null, 8, go),
            e("span", bo, n(J.login), 1),
            J.contributions ? (r(), u("span", _o, n(J.contributions), 1)) : V("", !0)
          ], 8, fo))), 128))
        ])) : (r(), u("p", yo, [
          e("a", {
            class: "repo-link",
            href: $.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "razureink ↗", 8, ko)
        ]))
      ]),
      e("footer", wo, [
        T[12] || (T[12] = e("span", { class: "status-chip" }, "MIT", -1)),
        T[13] || (T[13] = e("span", null, "© 2026 RazureSOFT", -1)),
        e("a", {
          class: "repo-link",
          href: `${ft}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, $o)
      ])
    ]));
  }
}), Po = /* @__PURE__ */ Oe(Co, [["__scopeId", "data-v-2678e07b"]]), xo = { class: "content-card updates" }, Mo = { class: "us-block" }, Eo = { class: "us-head" }, Uo = { class: "us-head-text" }, To = { class: "us-title" }, Ao = { class: "us-desc" }, Io = { class: "us-source" }, No = { class: "us-input-group" }, Vo = ["disabled", "placeholder"], Lo = ["disabled"], Ro = { class: "us-chips" }, Oo = ["disabled"], Do = ["disabled"], zo = {
  key: 0,
  class: "us-saved"
}, Fo = { class: "helper-text" }, Bo = {
  key: 0,
  class: "alert"
}, Ko = { class: "us-block" }, Ho = { class: "us-head" }, jo = { class: "us-head-text" }, Yo = { class: "us-title" }, Xo = { class: "us-desc" }, Jo = { class: "us-head-actions" }, Wo = ["disabled"], qo = {
  key: 0,
  class: "alert",
  role: "alert"
}, Go = { class: "us-apply-head" }, Zo = { key: 0 }, Qo = { key: 1 }, ea = {
  key: 0,
  class: "us-chip-tag"
}, ta = { class: "us-apply-label" }, sa = {
  key: 0,
  class: "us-apply-error"
}, na = {
  key: 1,
  class: "us-apply-log"
}, la = {
  key: 2,
  class: "alert",
  role: "alert"
}, oa = {
  key: 3,
  class: "us-table"
}, aa = { class: "us-row us-thead" }, ia = { class: "us-name" }, ra = { class: "us-name-text" }, da = { class: "us-ver" }, ca = { class: "us-status-text" }, ua = { class: "us-actions" }, pa = ["disabled", "onClick"], ha = ["disabled", "onClick"], va = ["href", "title"], ma = {
  key: 0,
  class: "us-empty"
}, fa = /* @__PURE__ */ _e({
  __name: "UpdatesPanel",
  setup(g) {
    const { t: s } = ye(), h = x(!1), d = x(null), b = x(""), $ = x(null), p = x("");
    let y = null;
    const C = x(""), i = x(""), o = x(!1), l = x(!1), a = x(!1), c = x(""), v = Z(() => C.value.trim() !== i.value), w = Z(() => C.value.trim() !== "");
    function f(K) {
      return $.value?.status === "running" && $.value.plugin === K;
    }
    async function E(K, j) {
      if ($.value?.status !== "running") {
        p.value = "";
        try {
          $.value = await at("/api/plugins/pm/update", { plugin: K, version: j || "" }), H();
        } catch (z) {
          p.value = z instanceof Error ? z.message : String(z);
        }
      }
    }
    async function U() {
      try {
        $.value = await je("/api/plugins/pm/status");
      } catch {
        return;
      }
      $.value && $.value.status !== "running" && (R(), T());
    }
    function H() {
      y || (y = setInterval(U, 2e3));
    }
    function R() {
      y && (clearInterval(y), y = null);
    }
    const I = Z(() => {
      switch ($.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), M = Z(() => (d.value || []).filter((K) => K.has_update).length);
    async function T() {
      h.value = !0, b.value = "";
      try {
        const K = await je("/api/plugins/pm/check-plugins");
        d.value = K?.plugins || [];
      } catch (K) {
        b.value = K instanceof jt && K.status === 404 ? s("settings.about.unsupported") : K instanceof Error ? K.message : String(K);
      } finally {
        h.value = !1;
      }
    }
    async function J() {
      o.value = !0, c.value = "";
      try {
        const K = await je("/api/settings/updates"), j = String(K?.values?.github_proxy ?? "");
        C.value = j, i.value = j;
      } catch {
      } finally {
        o.value = !1;
      }
    }
    async function ve() {
      l.value = !0, c.value = "";
      try {
        const K = C.value.trim();
        await at("/api/settings/updates", { values: { github_proxy: K } }), i.value = K, a.value = !0, setTimeout(() => {
          a.value = !1;
        }, 1500);
      } catch (K) {
        c.value = K instanceof Error ? K.message : String(K);
      } finally {
        l.value = !1;
      }
    }
    function ae(K) {
      C.value = K, ve();
    }
    return De(() => {
      T(), J(), je("/api/plugins/pm/status").then((K) => {
        $.value = K, K?.status === "running" && H();
      }).catch(() => {
      });
    }), rt(R), (K, j) => (r(), u("div", xo, [
      e("section", Mo, [
        e("header", Eo, [
          j[3] || (j[3] = e("span", {
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
          e("div", Uo, [
            e("h3", To, n(t(s)("settings.pluginSourceTitle")), 1),
            e("p", Ao, n(t(s)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: oe(["us-tag", { on: w.value }])
          }, n(w.value ? "ghproxy" : t(s)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", Io, [
          e("div", No, [
            j[4] || (j[4] = e("span", {
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
            O(e("input", {
              "onUpdate:modelValue": j[0] || (j[0] = (z) => C.value = z),
              class: "us-input",
              type: "text",
              disabled: o.value,
              placeholder: t(s)("settings.pluginSourcePlaceholder"),
              onKeyup: _t(ve, ["enter"])
            }, null, 40, Vo), [
              [W, C.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: l.value || !v.value,
              onClick: ve
            }, n(t(s)("settings.save")), 9, Lo)
          ]),
          e("div", Ro, [
            e("button", {
              type: "button",
              class: oe(["us-chip", { active: !w.value }]),
              disabled: l.value,
              onClick: j[1] || (j[1] = (z) => ae(""))
            }, n(t(s)("settings.pluginSourceDirect")), 11, Oo),
            e("button", {
              type: "button",
              class: oe(["us-chip", { active: C.value.trim() === "https://gh-proxy.com" }]),
              disabled: l.value,
              onClick: j[2] || (j[2] = (z) => ae("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, Do),
            a.value ? (r(), u("span", zo, n(t(s)("settings.saved")), 1)) : V("", !0)
          ]),
          e("p", Fo, n(t(s)("settings.pluginSourceHelp")), 1),
          c.value ? (r(), u("p", Bo, n(c.value), 1)) : V("", !0)
        ])
      ]),
      j[10] || (j[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", Ko, [
        e("header", Ho, [
          j[5] || (j[5] = is('<span class="us-ico" aria-hidden="true" data-v-bc3fb39c><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-bc3fb39c><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect></svg></span>', 1)),
          e("div", jo, [
            e("h3", Yo, n(t(s)("settings.about.plugins")), 1),
            e("p", Xo, n(t(s)("settings.about.updateHint")), 1)
          ]),
          e("div", Jo, [
            e("span", {
              class: oe(["us-count", { warn: M.value > 0 }])
            }, n(M.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: h.value,
              onClick: T
            }, n(t(s)(h.value ? "settings.about.checking" : "settings.about.check")), 9, Wo)
          ])
        ]),
        p.value ? (r(), u("p", qo, n(p.value), 1)) : V("", !0),
        $.value && $.value.status !== "idle" ? (r(), u("div", {
          key: 1,
          class: oe(["us-apply-banner", $.value.status])
        }, [
          e("div", Go, [
            j[6] || (j[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Re(n($.value.package), 1),
              $.value.version ? (r(), u("span", Zo, "@" + n($.value.version), 1)) : (r(), u("span", Qo, " · main"))
            ]),
            $.value.mode === "source" ? (r(), u("span", ea, n(t(s)("settings.about.sourceMode")), 1)) : V("", !0),
            e("span", ta, n(I.value), 1)
          ]),
          $.value.error ? (r(), u("p", sa, n($.value.error), 1)) : V("", !0),
          $.value.log ? (r(), u("pre", na, n($.value.log), 1)) : V("", !0)
        ], 2)) : V("", !0),
        b.value ? (r(), u("p", la, n(b.value), 1)) : V("", !0),
        d.value ? (r(), u("div", oa, [
          e("div", aa, [
            e("span", null, n(t(s)("plugins.updatesColPlugin")), 1),
            e("span", null, n(t(s)("plugins.updatesColVersion")), 1),
            e("span", null, n(t(s)("plugins.updatesColStatus")), 1),
            j[7] || (j[7] = e("span", null, null, -1))
          ]),
          (r(!0), u(G, null, de(d.value, (z) => (r(), u("div", {
            key: z.name,
            class: "us-row"
          }, [
            e("span", ia, [
              e("span", {
                class: oe(["us-dot", z.error ? "bad" : z.has_update ? "warn" : z.latest ? "ok" : ""])
              }, null, 2),
              e("span", ra, n(z.name), 1)
            ]),
            e("span", da, [
              e("em", null, "v" + n(z.version || "—"), 1),
              j[8] || (j[8] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: oe({ good: !!z.latest })
              }, n(z.latest ? `v${z.latest}` : "—"), 3)
            ]),
            e("span", {
              class: oe(["us-status", z.error ? "bad" : z.has_update ? "warn" : z.latest ? "ok" : ""])
            }, [
              e("span", ca, n(z.error || t(s)(z.has_update ? "settings.about.available" : z.latest ? "settings.about.latest" : "settings.about.noRelease")), 1)
            ], 2),
            e("span", ua, [
              z.can_update && z.has_update ? (r(), u("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: f(z.name),
                onClick: (B) => E(z.name, z.latest)
              }, n(f(z.name) ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, pa)) : z.can_update ? (r(), u("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: f(z.name),
                onClick: (B) => E(z.name)
              }, n(f(z.name) ? t(s)("settings.about.updating") : t(s)("settings.about.syncNow")), 9, ha)) : V("", !0),
              z.repository ? (r(), u("a", {
                key: 2,
                class: "us-repo",
                href: z.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: z.repository
              }, n(t(s)("plugins.updatesColRepo")) + " ↗", 9, va)) : V("", !0)
            ])
          ]))), 128)),
          d.value.length ? V("", !0) : (r(), u("p", ma, n(t(s)("settings.about.noPlugins")), 1))
        ])) : V("", !0),
        j[9] || (j[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), ga = /* @__PURE__ */ Oe(fa, [["__scopeId", "data-v-bc3fb39c"]]), ba = { class: "content-card provider-panel" }, _a = { class: "pp-editor-head" }, ya = ["aria-label"], ka = { class: "pp-editor-title" }, wa = { class: "card-desc" }, $a = { class: "pp-section" }, Sa = { class: "pp-section-title" }, Ca = { class: "pp-grid" }, Pa = { class: "field" }, xa = { class: "helper-text" }, Ma = { class: "field" }, Ea = { class: "field" }, Ua = {
  key: 0,
  class: "pp-req"
}, Ta = ["placeholder"], Aa = { class: "field pp-span" }, Ia = ["placeholder"], Na = { class: "field" }, Va = { class: "helper-text" }, La = { class: "field" }, Ra = { class: "helper-text" }, Oa = { class: "pp-section" }, Da = { class: "pp-section-head" }, za = { class: "pp-section-title" }, Fa = ["disabled"], Ba = { class: "field" }, Ka = { class: "pp-key" }, Ha = ["type", "placeholder"], ja = {
  key: 0,
  class: "helper-text"
}, Ya = {
  key: 1,
  class: "pp-probe err"
}, Xa = {
  key: 2,
  class: "pp-probe ok"
}, Ja = { class: "pp-section" }, Wa = { class: "pp-section-head" }, qa = { class: "pp-section-title" }, Ga = { class: "pp-count" }, Za = ["disabled"], Qa = {
  key: 0,
  class: "pp-discovered"
}, ei = { class: "pp-model-tools" }, ti = ["placeholder"], si = { class: "pp-add-model" }, ni = ["placeholder", "aria-label", "onKeydown"], li = ["disabled"], oi = {
  key: 1,
  class: "helper-text pp-add-error"
}, ai = {
  key: 2,
  class: "pp-models"
}, ii = ["title"], ri = ["value", "title", "onChange"], di = ["value"], ci = ["title", "disabled", "onClick"], ui = ["title"], pi = ["checked", "onChange"], hi = ["title", "aria-label", "onClick"], vi = {
  key: 0,
  class: "helper-text"
}, mi = {
  key: 3,
  class: "helper-text"
}, fi = {
  key: 0,
  class: "pp-error",
  role: "alert"
}, gi = { class: "pp-editor-actions" }, bi = ["disabled"], _i = { class: "pp-list-head" }, yi = { class: "card-desc" }, ki = { class: "pp-list-actions" }, wi = {
  class: "pp-kinds",
  role: "tablist"
}, $i = ["aria-selected", "onClick"], Si = { class: "pp-kind-count" }, Ci = {
  key: 0,
  class: "pp-cards"
}, Pi = { class: "pp-card-head" }, xi = { class: "pp-logo" }, Mi = ["src", "alt"], Ei = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, Ui = { class: "pp-card-id" }, Ti = ["title"], Ai = { class: "pp-card-badges" }, Ii = {
  key: 0,
  class: "pp-badge primary"
}, Ni = { class: "pp-badge" }, Vi = { class: "pp-card-status" }, Li = {
  key: 0,
  class: "pp-meta"
}, Ri = ["title"], Oi = { class: "pp-chips" }, Di = {
  key: 0,
  class: "pp-chip more"
}, zi = {
  key: 1,
  class: "pp-chip empty"
}, Fi = { class: "pp-card-actions" }, Bi = ["onClick"], Ki = ["disabled", "onClick"], Hi = ["disabled", "onClick"], ji = ["onClick"], Yi = ["onClick"], Xi = {
  key: 1,
  class: "pp-empty"
}, Ji = /* @__PURE__ */ _e({
  __name: "ProviderPanel",
  setup(g) {
    const { t: s } = ye(), { confirm: h } = st(), d = fs(), b = x({}), $ = x("list"), p = x(null), y = x(""), C = x({ state: "idle" }), i = x([]), o = x(""), l = x(!1), a = x(!1), c = x(!1), v = x("llm"), w = Z(() => [
      { value: "llm", label: s("settings.providerKindLLM") },
      { value: "tts", label: s("settings.providerKindTTS") },
      { value: "asr", label: s("settings.providerKindASR") },
      { value: "image", label: s("settings.providerKindImage") }
    ]);
    function f(k) {
      return (k.kind || "llm").toLowerCase();
    }
    const E = Z(() => d.providers.filter((k) => f(k) === v.value));
    function U(k) {
      return d.providers.filter((P) => f(P) === k).length;
    }
    function H() {
      for (const k of E.value) B(k);
    }
    De(async () => {
      await d.fetchAll();
      for (const k of d.providers) B(k);
    });
    function R(k) {
      return mt.find((P) => P.id === k) || null;
    }
    function I(k) {
      return k.name && k.name.trim() ? k.name.trim() : R(k.provider)?.name || k.provider;
    }
    function M(k) {
      return R(k.provider)?.logo || "";
    }
    const T = Z(() => [
      { value: "chat", label: s("modelType.chat") },
      { value: "embedding", label: s("modelType.embedding") },
      { value: "rerank", label: s("modelType.rerank") },
      { value: "vision", label: s("modelType.vision") },
      { value: "tts", label: s("modelType.tts") },
      { value: "image", label: s("modelType.image") },
      { value: "audio", label: s("modelType.audio") }
    ]);
    function J(k) {
      return (p.value?.model_types || {})[k] || "chat";
    }
    function ve(k, P) {
      if (!p.value) return;
      const S = { ...p.value.model_types || {} };
      !P || P === "chat" ? delete S[k] : S[k] = P, p.value.model_types = S;
    }
    function ae(k) {
      const P = new Set(k.disabled_models || []);
      return k.models.filter((S) => !P.has(S));
    }
    function K(k) {
      return d.defaultProviderId === k.id;
    }
    function j(k) {
      const P = p.value;
      if (!P) return;
      const S = mt.find((ne) => ne.id === k);
      S?.baseUrl && !P.base_url && (P.base_url = S.baseUrl), P.format = S?.format || "";
    }
    async function z(k, P = "") {
      if (!k.base_url) return { state: "error", message: s("settings.baseUrlRequired") };
      const S = performance.now();
      try {
        const ne = await fetch("/api/models/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: k.id,
            provider: k.provider,
            base_url: k.base_url,
            format: k.format || "",
            api_key: P || ""
          })
        });
        if (!ne.ok) throw new Error(`HTTP ${ne.status}`);
        const ke = await ne.json(), we = Math.round(performance.now() - S);
        return ke.source === "api" && Array.isArray(ke.models) && ke.models.length ? { state: "ok", count: ke.models.length, ms: we, models: ke.models } : { state: "error", message: ke.error || s("settings.connectionFailed"), ms: we };
      } catch (ne) {
        return { state: "error", message: ne instanceof Error ? ne.message : String(ne) };
      }
    }
    async function B(k, P = "") {
      b.value = { ...b.value, [k.id]: { state: "checking" } };
      const S = await z(k, P);
      b.value = { ...b.value, [k.id]: S };
    }
    function F() {
      p.value = {
        id: "",
        provider: "custom",
        kind: v.value,
        name: "",
        api_key: "",
        base_url: "",
        models: [],
        disabled_models: [],
        default_model: "",
        enabled: !0,
        format: "",
        model_types: {}
      }, y.value = "", C.value = { state: "idle" }, i.value = [], o.value = "", l.value = !1, a.value = !1, $.value = "edit";
    }
    function Ve(k) {
      p.value = {
        ...k,
        api_key: "",
        name: k.name || "",
        models: [...k.models],
        disabled_models: [...k.disabled_models || []],
        format: k.format || "",
        model_types: { ...k.model_types || {} }
      }, a.value = !!k.api_key_masked, y.value = "", C.value = { state: "idle" }, i.value = [], o.value = "", l.value = !1, $.value = "edit";
    }
    function Te() {
      $.value = "list", p.value = null, y.value = "";
    }
    async function he() {
      const k = p.value;
      if (!k) return;
      y.value = "";
      const P = (k.name || "").trim();
      if (!k.base_url.trim()) {
        y.value = s("settings.baseUrlRequired");
        return;
      }
      if (k.provider === "custom" && !P) {
        y.value = s("settings.providerNameRequired");
        return;
      }
      if (!k.models.length) {
        y.value = s("settings.modelsRequired");
        return;
      }
      k.id || (k.id = `${k.provider}_${Date.now().toString(36)}`), k.name = P, k.disabled_models = (k.disabled_models || []).filter((S) => k.models.includes(S)), (!k.default_model || !k.models.includes(k.default_model) || k.disabled_models.includes(k.default_model)) && (k.default_model = ae(k)[0] || k.models[0]), c.value = !0;
      try {
        await d.upsert({ ...k }), d.defaultProviderId || await d.setDefaults(k.id, k.default_model), Te(), B(d.providers.find((S) => S.id === k.id) || k);
      } catch (S) {
        y.value = S instanceof Error ? S.message : String(S);
      } finally {
        c.value = !1;
      }
    }
    async function Ee(k) {
      if (await h({
        title: s("settings.remove"),
        message: `${s("settings.remove")} ${I(k)}?`,
        confirmLabel: s("settings.remove"),
        danger: !0
      }))
        try {
          await d.remove(k.id);
        } catch {
        }
    }
    async function Pe(k) {
      try {
        await d.upsert({ ...k, enabled: !k.enabled });
      } catch {
      }
    }
    async function xe(k) {
      const P = k.default_model || ae(k)[0] || k.models[0] || "";
      try {
        await d.setDefaults(k.id, P);
      } catch {
      }
    }
    async function te() {
      const k = p.value;
      if (!k) return;
      C.value = { state: "checking" };
      const P = await z(k, k.api_key);
      C.value = P, P.state === "ok" && P.models && (i.value = P.models);
    }
    function me() {
      const k = p.value;
      !k || !i.value.length || (k.models = [...i.value], k.disabled_models = (k.disabled_models || []).filter((P) => k.models.includes(P)), k.models.includes(k.default_model) || (k.default_model = ""));
    }
    function Ae(k) {
      const P = p.value;
      if (!P) return;
      const S = new Set(P.disabled_models || []);
      S.has(k) ? S.delete(k) : S.add(k), P.disabled_models = [...S], S.has(P.default_model) && (P.default_model = ae(P)[0] || "");
    }
    function Se(k) {
      const P = p.value;
      P && (P.default_model = k, P.disabled_models = (P.disabled_models || []).filter((S) => S !== k));
    }
    const pe = x(""), Me = x("");
    function fe() {
      const k = p.value;
      if (!k) return;
      const P = pe.value.trim();
      if (Me.value = "", !!P) {
        if (k.models.includes(P)) {
          Me.value = s("settings.modelExists", { name: P });
          return;
        }
        k.models = [...k.models, P], k.disabled_models = (k.disabled_models || []).filter((S) => S !== P), k.default_model || (k.default_model = P), pe.value = "";
      }
    }
    function se(k) {
      const P = p.value;
      if (P) {
        if (P.models = P.models.filter((S) => S !== k), P.disabled_models = (P.disabled_models || []).filter((S) => S !== k), P.model_types) {
          const S = { ...P.model_types };
          delete S[k], P.model_types = S;
        }
        P.default_model === k && (P.default_model = ae(P)[0] || P.models[0] || "");
      }
    }
    function Ke(k) {
      const P = p.value;
      P && (P.disabled_models = k ? [] : [...P.models]);
    }
    function Q() {
      const k = p.value;
      if (!k) return;
      const P = new Set(k.disabled_models || []);
      k.disabled_models = k.models.filter((S) => !P.has(S));
    }
    const L = Z(() => {
      const k = p.value?.models || [], P = o.value.trim().toLowerCase();
      return P ? k.filter((S) => S.toLowerCase().includes(P)) : k;
    }), ie = Z(() => p.value ? ae(p.value).length : 0);
    function Ie() {
      return s("settings.fetchedSummary", { n: i.value.length });
    }
    const Qe = Z(() => [
      { value: "", label: s("settings.formatAuto") },
      { value: "openai", label: s("settings.formatOpenai") },
      { value: "anthropic", label: s("settings.formatAnthropic") }
    ]), Xe = Z(
      () => mt.map((k) => ({ value: k.id, label: s(`providers.${k.id}.name`, k.name) }))
    );
    return (k, P) => (r(), u("div", ba, [
      $.value === "edit" && p.value ? (r(), u(G, { key: 0 }, [
        e("div", _a, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: Te,
            "aria-label": t(s)("settings.back")
          }, [...P[13] || (P[13] = [
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
          ])], 8, ya),
          e("div", ka, [
            e("h2", null, n(p.value.id ? t(s)("settings.edit") : t(s)("settings.addProvider")), 1),
            e("p", wa, n(t(s)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: oe(["pp-status", C.value.state])
          }, [
            P[14] || (P[14] = e("span", { class: "pp-dot" }, null, -1)),
            Re(" " + n(C.value.state === "checking" ? t(s)("settings.testing") : C.value.state === "ok" ? t(s)("settings.connectionOk") : C.value.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", $a, [
          e("h3", Sa, n(t(s)("settings.providerSectionBasic")), 1),
          e("div", Ca, [
            e("div", Pa, [
              e("label", null, n(t(s)("settings.providerKindLabel")), 1),
              be(t(We), {
                modelValue: p.value.kind,
                "onUpdate:modelValue": P[0] || (P[0] = (S) => p.value.kind = S),
                class: "input",
                "aria-label": t(s)("settings.providerKindLabel"),
                options: w.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", xa, n(t(s)("settings.providerKindHint")), 1)
            ]),
            e("div", Ma, [
              e("label", null, n(t(s)("wizard.provider")), 1),
              be(t(We), {
                modelValue: p.value.provider,
                "onUpdate:modelValue": P[1] || (P[1] = (S) => p.value.provider = S),
                class: "input",
                "aria-label": t(s)("wizard.provider"),
                options: Xe.value,
                onChange: j
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", Ea, [
              e("label", null, [
                Re(n(t(s)("settings.providerName")) + " ", 1),
                p.value.provider === "custom" ? (r(), u("span", Ua, "*")) : V("", !0)
              ]),
              O(e("input", {
                "onUpdate:modelValue": P[2] || (P[2] = (S) => p.value.name = S),
                placeholder: t(s)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, Ta), [
                [W, p.value.name]
              ])
            ]),
            e("div", Aa, [
              e("label", null, n(t(s)("wizard.baseUrl")), 1),
              O(e("input", {
                "onUpdate:modelValue": P[3] || (P[3] = (S) => p.value.base_url = S),
                placeholder: t(s)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, Ia), [
                [W, p.value.base_url]
              ])
            ]),
            e("div", Na, [
              e("label", null, n(t(s)("settings.apiFormat")), 1),
              be(t(We), {
                modelValue: p.value.format,
                "onUpdate:modelValue": P[4] || (P[4] = (S) => p.value.format = S),
                class: "input",
                "aria-label": t(s)("settings.apiFormat"),
                options: Qe.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Va, n(t(s)("settings.apiFormatHint")), 1)
            ]),
            e("div", La, [
              e("label", null, n(t(s)("wizard.defaultModel")), 1),
              be(t(We), {
                modelValue: p.value.default_model,
                "onUpdate:modelValue": P[5] || (P[5] = (S) => p.value.default_model = S),
                class: "input",
                "aria-label": t(s)("wizard.defaultModel"),
                options: ae(p.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Ra, n(t(s)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", Oa, [
          e("div", Da, [
            e("h3", za, n(t(s)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: C.value.state === "checking",
              onClick: te
            }, n(C.value.state === "checking" ? t(s)("settings.testing") : t(s)("settings.testConnection")), 9, Fa)
          ]),
          e("div", Ba, [
            e("label", null, n(t(s)("wizard.apiKey")), 1),
            e("div", Ka, [
              O(e("input", {
                "onUpdate:modelValue": P[6] || (P[6] = (S) => p.value.api_key = S),
                type: l.value ? "text" : "password",
                placeholder: a.value ? t(s)("settings.apiKeyKept") : t(s)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, Ha), [
                [rs, p.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: P[7] || (P[7] = (S) => l.value = !l.value)
              }, n(l.value ? t(s)("settings.hideKey") : t(s)("settings.showKey")), 1)
            ]),
            a.value ? (r(), u("p", ja, n(t(s)("settings.apiKeyKeptHint")), 1)) : V("", !0),
            C.value.state === "error" ? (r(), u("p", Ya, n(C.value.message), 1)) : C.value.state === "ok" ? (r(), u("p", Xa, n(t(s)("settings.connectionOk")) + " · " + n(Ie()) + " · " + n(C.value.ms) + "ms ", 1)) : V("", !0)
          ])
        ]),
        e("section", Ja, [
          e("div", Wa, [
            e("h3", qa, [
              Re(n(t(s)("settings.providerSectionModels")) + " ", 1),
              e("span", Ga, n(ie.value) + "/" + n(p.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: C.value.state === "checking",
              onClick: te
            }, n(t(s)("settings.fetchModels")), 9, Za)
          ]),
          i.value.length && i.value.join("\0") !== p.value.models.join("\0") ? (r(), u("div", Qa, [
            e("span", null, n(Ie()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: me
            }, n(t(s)("settings.applyFetched")), 1)
          ])) : V("", !0),
          e("div", ei, [
            O(e("input", {
              "onUpdate:modelValue": P[8] || (P[8] = (S) => o.value = S),
              class: "input pp-search",
              placeholder: t(s)("settings.searchModels")
            }, null, 8, ti), [
              [W, o.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[9] || (P[9] = (S) => Ke(!0))
            }, n(t(s)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[10] || (P[10] = (S) => Q())
            }, n(t(s)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[11] || (P[11] = (S) => Ke(!1))
            }, n(t(s)("settings.clearSelection")), 1)
          ]),
          e("div", si, [
            O(e("input", {
              "onUpdate:modelValue": P[12] || (P[12] = (S) => pe.value = S),
              class: "input",
              placeholder: t(s)("settings.addModelPlaceholder"),
              "aria-label": t(s)("settings.addModelPlaceholder"),
              onKeydown: _t(He(fe, ["prevent"]), ["enter"])
            }, null, 40, ni), [
              [W, pe.value]
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: !pe.value.trim(),
              onClick: fe
            }, n(t(s)("settings.addModel")), 9, li)
          ]),
          Me.value ? (r(), u("p", oi, n(Me.value), 1)) : V("", !0),
          p.value.models.length ? (r(), u("div", ai, [
            (r(!0), u(G, null, de(L.value, (S) => (r(), u("div", {
              key: S,
              class: oe(["pp-model", { off: (p.value.disabled_models || []).includes(S) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: S
              }, n(S), 9, ii),
              e("select", {
                class: oe(["pp-type", { tagged: J(S) !== "chat" }]),
                value: J(S),
                title: t(s)("settings.providerModelType"),
                onChange: (ne) => ve(S, ne.target.value)
              }, [
                (r(!0), u(G, null, de(T.value, (ne) => (r(), u("option", {
                  key: ne.value,
                  value: ne.value
                }, n(ne.label), 9, di))), 128))
              ], 42, ri),
              p.value.default_model !== S ? (r(), u("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: t(s)("settings.makeDefault"),
                disabled: (p.value.disabled_models || []).includes(S),
                onClick: (ne) => Se(S)
              }, "☆", 8, ci)) : (r(), u("span", {
                key: 1,
                class: "pp-star on",
                title: t(s)("wizard.defaultModel")
              }, "★", 8, ui)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(p.value.disabled_models || []).includes(S),
                onChange: (ne) => Ae(S)
              }, null, 40, pi),
              e("button", {
                class: "pp-remove",
                type: "button",
                title: t(s)("settings.removeModel", { name: S }),
                "aria-label": t(s)("settings.removeModel", { name: S }),
                onClick: (ne) => se(S)
              }, "×", 8, hi)
            ], 2))), 128)),
            L.value.length ? V("", !0) : (r(), u("p", vi, n(t(s)("settings.searchModels")), 1))
          ])) : (r(), u("p", mi, n(t(s)("settings.noModelsYet")), 1))
        ]),
        y.value ? (r(), u("p", fi, n(y.value), 1)) : V("", !0),
        e("div", gi, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: c.value,
            onClick: he
          }, n(c.value ? t(s)("settings.saving") : t(s)("settings.save")), 9, bi),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: Te
          }, n(t(s)("settings.cancel")), 1)
        ])
      ], 64)) : (r(), u(G, { key: 1 }, [
        e("div", _i, [
          e("div", null, [
            e("h2", null, n(t(s)("settings.tabs.provider")), 1),
            e("p", yi, n(t(s)("settings.providerDesc")), 1)
          ]),
          e("div", ki, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: H
            }, n(t(s)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: F
            }, "+ " + n(t(s)("settings.addProvider")), 1)
          ])
        ]),
        e("nav", wi, [
          (r(!0), u(G, null, de(w.value, (S) => (r(), u("button", {
            key: S.value,
            type: "button",
            role: "tab",
            class: oe(["pp-kind", { active: v.value === S.value }]),
            "aria-selected": v.value === S.value,
            onClick: (ne) => v.value = S.value
          }, [
            Re(n(S.label) + " ", 1),
            e("span", Si, n(U(S.value)), 1)
          ], 10, $i))), 128))
        ]),
        E.value.length ? (r(), u("div", Ci, [
          (r(!0), u(G, null, de(E.value, (S) => (r(), u("article", {
            key: S.id,
            class: oe(["pp-card", { off: !S.enabled, default: K(S) }])
          }, [
            e("header", Pi, [
              e("span", xi, [
                M(S) ? (r(), u("img", {
                  key: 0,
                  src: M(S),
                  alt: I(S)
                }, null, 8, Mi)) : (r(), u("svg", Ei, [...P[15] || (P[15] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", Ui, [
                e("strong", null, n(I(S)), 1),
                e("code", {
                  title: S.base_url
                }, n(S.base_url || "—"), 9, Ti)
              ]),
              e("div", Ai, [
                K(S) ? (r(), u("span", Ii, n(t(s)("settings.default")), 1)) : V("", !0),
                e("span", Ni, n(ae(S).length) + "/" + n(S.models.length), 1)
              ])
            ]),
            e("div", Vi, [
              e("span", {
                class: oe(["pp-status", b.value[S.id]?.state || "idle"])
              }, [
                P[16] || (P[16] = e("span", { class: "pp-dot" }, null, -1)),
                Re(" " + n(b.value[S.id]?.state === "checking" ? t(s)("settings.testing") : b.value[S.id]?.state === "ok" ? t(s)("settings.connectionOk") : b.value[S.id]?.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
              ], 2),
              b.value[S.id]?.state === "ok" ? (r(), u("span", Li, n(t(s)("settings.fetchedSummary", { n: b.value[S.id]?.count || 0 })) + " · " + n(b.value[S.id]?.ms) + "ms", 1)) : b.value[S.id]?.state === "error" ? (r(), u("span", {
                key: 1,
                class: "pp-meta err",
                title: b.value[S.id]?.message
              }, n(b.value[S.id]?.message), 9, Ri)) : V("", !0)
            ]),
            e("div", Oi, [
              (r(!0), u(G, null, de(ae(S).slice(0, 6), (ne) => (r(), u("span", {
                key: ne,
                class: "pp-chip"
              }, n(ne), 1))), 128)),
              ae(S).length > 6 ? (r(), u("span", Di, "+" + n(ae(S).length - 6), 1)) : V("", !0),
              S.models.length ? V("", !0) : (r(), u("span", zi, n(t(s)("settings.noModelsYet")), 1))
            ]),
            e("footer", Fi, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (ne) => Ve(S)
              }, n(t(s)("settings.edit")), 9, Bi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: b.value[S.id]?.state === "checking",
                onClick: (ne) => B(S)
              }, n(t(s)("settings.testConnection")), 9, Ki),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: K(S),
                onClick: (ne) => xe(S)
              }, n(t(s)("settings.makeDefault")), 9, Hi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (ne) => Pe(S)
              }, n(S.enabled ? t(s)("settings.disableProvider") : t(s)("settings.enableProvider")), 9, ji),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (ne) => Ee(S)
              }, n(t(s)("settings.remove")), 9, Yi)
            ])
          ], 2))), 128))
        ])) : (r(), u("div", Xi, [
          e("p", null, n(t(s)("settings.noProvidersForKind")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: F
          }, "+ " + n(t(s)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), Wi = /* @__PURE__ */ Oe(Ji, [["__scopeId", "data-v-d10cd596"]]), qi = { class: "pairing-panel" }, Gi = {
  key: 0,
  class: "pairing-error",
  role: "alert"
}, Zi = { key: 1 }, Qi = { key: 0 }, er = ["onClick"], tr = ["onClick"], sr = ["disabled", "onClick"], nr = /* @__PURE__ */ _e({
  __name: "PairingPanel",
  setup(g) {
    const { t: s } = ye(), { confirm: h } = st(), d = x([]), b = x([]), $ = x(""), p = x("");
    let y;
    async function C() {
      try {
        const l = await fetch("/api/pairing/pending");
        if (!l.ok) throw new Error(await l.text());
        d.value = (await l.json()).requests || [];
      } catch (l) {
        $.value = l.message;
      }
      try {
        const l = await fetch("/api/pairing/devices");
        l.ok && (b.value = (await l.json()).devices || []);
      } catch {
      }
    }
    async function i(l, a) {
      try {
        const c = await fetch("/api/pairing/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...l, allow: a })
        });
        if (!c.ok) throw new Error(await c.text());
        await C();
      } catch (c) {
        $.value = c.message;
      }
    }
    async function o(l) {
      if (!(p.value || !await h({
        title: s("pairing.disconnect"),
        message: s("pairing.disconnectConfirm", { name: l.name || l.id }),
        confirmLabel: s("pairing.disconnect"),
        danger: !0
      }))) {
        p.value = l.id;
        try {
          const c = await fetch("/api/pairing/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: l.id })
          });
          if (!c.ok) throw new Error(await c.text());
          await C();
        } catch (c) {
          $.value = c.message;
        } finally {
          p.value = "";
        }
      }
    }
    return De(() => {
      C(), y = setInterval(C, 3e3);
    }), rt(() => clearInterval(y)), (l, a) => (r(), u("section", qi, [
      e("h3", null, n(t(s)("pairing.title")), 1),
      e("p", null, n(t(s)("pairing.hint")), 1),
      $.value ? (r(), u("p", Gi, n($.value), 1)) : V("", !0),
      d.value.length ? V("", !0) : (r(), u("p", Zi, n(t(s)("pairing.empty")), 1)),
      be(Lt, {
        tag: "div",
        name: "pair",
        class: "pairing-list"
      }, {
        default: ot(() => [
          (r(!0), u(G, null, de(d.value, (c) => (r(), u("article", {
            key: c.id
          }, [
            e("strong", null, n(c.name), 1),
            e("code", null, n(c.code), 1),
            c.approved ? (r(), u("span", Qi, n(t(s)("pairing.approved")), 1)) : (r(), u(G, { key: 1 }, [
              e("button", {
                type: "button",
                class: "btn btn-ghost",
                onClick: (v) => i(c, !1)
              }, n(t(s)("pairing.deny")), 9, er),
              e("button", {
                type: "button",
                class: "btn btn-primary",
                onClick: (v) => i(c, !0)
              }, n(t(s)("pairing.allow")), 9, tr)
            ], 64))
          ]))), 128))
        ]),
        _: 1
      }),
      b.value.length ? (r(), u(G, { key: 2 }, [
        e("h4", null, n(t(s)("pairing.pairedCount", { n: b.value.length })), 1),
        be(Lt, {
          tag: "div",
          name: "pair",
          class: "pairing-list"
        }, {
          default: ot(() => [
            (r(!0), u(G, null, de(b.value, (c) => (r(), u("article", {
              key: c.id
            }, [
              e("strong", null, n(c.name || c.id), 1),
              e("button", {
                type: "button",
                class: "btn btn-danger-tonal",
                disabled: p.value === c.id,
                onClick: (v) => o(c)
              }, n(p.value === c.id ? t(s)("pairing.disconnecting") : t(s)("pairing.disconnect")), 9, sr)
            ]))), 128))
          ]),
          _: 1
        })
      ], 64)) : V("", !0)
    ]));
  }
}), lr = /* @__PURE__ */ Oe(nr, [["__scopeId", "data-v-67a1ff9e"]]), or = { class: "content-card" }, ar = { class: "card-desc" }, ir = { class: "field" }, rr = ["aria-label"], dr = ["aria-pressed", "onClick"], cr = /* @__PURE__ */ _e({
  __name: "GeneralPanel",
  setup(g) {
    const { t: s } = ye(), h = x(gs());
    function d(b) {
      h.value = b, _s(b);
    }
    return (b, $) => (r(), u("div", or, [
      e("h2", null, n(t(s)("settings.tabs.general")), 1),
      e("p", ar, n(t(s)("settings.generalDesc")), 1),
      e("div", ir, [
        e("label", null, n(t(s)("settings.language")), 1),
        e("div", {
          class: "segmented",
          role: "group",
          "aria-label": t(s)("settings.language")
        }, [
          (r(!0), u(G, null, de(t(bs), (p) => (r(), u("button", {
            key: p.code,
            class: oe(["seg", { active: h.value === p.code }]),
            "aria-pressed": h.value === p.code,
            onClick: (y) => d(p.code)
          }, n(p.label), 11, dr))), 128))
        ], 8, rr)
      ]),
      be(lr)
    ]));
  }
}), ur = { class: "models-field" }, pr = {
  key: 0,
  class: "models-list"
}, hr = { class: "models-rank" }, vr = ["title"], mr = { class: "models-actions" }, fr = ["disabled", "aria-label", "onClick"], gr = ["disabled", "aria-label", "onClick"], br = ["aria-label", "onClick"], _r = {
  key: 1,
  class: "models-empty"
}, yr = /* @__PURE__ */ _e({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(g, { emit: s }) {
    const { t: h } = ye(), d = g, b = s, $ = Z(() => String(d.modelValue || "").split(",").map((l) => l.trim()).filter(Boolean)), p = Z(() => d.options.filter((l) => !$.value.includes(l)));
    function y(l) {
      b("update:modelValue", l.join(","));
    }
    function C(l) {
      l && !$.value.includes(l) && y([...$.value, l]);
    }
    function i(l) {
      y($.value.filter((a) => a !== l));
    }
    function o(l, a) {
      const c = [...$.value], v = l + a;
      v < 0 || v >= c.length || ([c[l], c[v]] = [c[v], c[l]], y(c));
    }
    return (l, a) => (r(), u("div", ur, [
      $.value.length ? (r(), u("ol", pr, [
        (r(!0), u(G, null, de($.value, (c, v) => (r(), u("li", { key: c }, [
          e("span", hr, n(v + 1), 1),
          e("span", {
            class: "models-name",
            title: c
          }, n(c), 9, vr),
          e("span", mr, [
            e("button", {
              type: "button",
              disabled: v === 0,
              "aria-label": t(h)("models.higher"),
              onClick: (w) => o(v, -1)
            }, "↑", 8, fr),
            e("button", {
              type: "button",
              disabled: v === $.value.length - 1,
              "aria-label": t(h)("models.lower"),
              onClick: (w) => o(v, 1)
            }, "↓", 8, gr),
            e("button", {
              type: "button",
              "aria-label": t(h)("common.remove"),
              onClick: (w) => i(c)
            }, "✕", 8, br)
          ])
        ]))), 128))
      ])) : (r(), u("p", _r, n(t(h)("models.empty")), 1)),
      p.value.length ? (r(), $e(t(We), {
        key: 2,
        options: p.value,
        "model-value": "",
        placeholder: t(h)("models.addPlaceholder"),
        "onUpdate:modelValue": C
      }, null, 8, ["options", "placeholder"])) : V("", !0)
    ]));
  }
}), kr = /* @__PURE__ */ Oe(yr, [["__scopeId", "data-v-b6ad9d20"]]), wr = { class: "field" }, $r = {
  key: 0,
  class: "toggle-label"
}, Sr = ["checked"], Cr = { key: 0 }, Pr = {
  key: 1,
  class: "helper-text"
}, xr = {
  key: 1,
  class: "field-note"
}, Mr = { key: 0 }, Er = ["for"], Ur = {
  key: 0,
  class: "helper-text"
}, Tr = ["for"], Ar = {
  key: 0,
  class: "helper-text"
}, Ir = ["for"], Nr = {
  key: 0,
  class: "helper-text"
}, Vr = ["for"], Lr = { class: "path-row" }, Rr = ["id", "value", "placeholder"], Or = {
  key: 0,
  class: "helper-text"
}, Dr = ["for"], zr = ["id", "type", "value"], Fr = {
  key: 0,
  class: "helper-text"
}, gt = /* @__PURE__ */ _e({
  __name: "SettingsField",
  props: {
    field: {},
    label: {},
    help: {},
    modelValue: {},
    sectionId: {},
    options: {},
    modelOptions: {},
    availableModels: {}
  },
  emits: ["update:modelValue", "browse"],
  setup(g, { emit: s }) {
    const { t: h } = ye(), d = g, b = s;
    function $() {
      return `field-${d.sectionId}-${d.field.key}`;
    }
    function p(y) {
      const C = y.target.value;
      b("update:modelValue", d.field.type === "number" ? Number(C) : C);
    }
    return (y, C) => (r(), u("div", wr, [
      g.field.type === "bool" ? (r(), u("label", $r, [
        e("input", {
          type: "checkbox",
          checked: !!g.modelValue,
          onChange: C[0] || (C[0] = (i) => b("update:modelValue", i.target.checked))
        }, null, 40, Sr),
        C[5] || (C[5] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(g.label), 1),
          g.help ? (r(), u("br", Cr)) : V("", !0),
          g.help ? (r(), u("small", Pr, n(g.help), 1)) : V("", !0)
        ])
      ])) : g.field.type === "note" ? (r(), u("div", xr, [
        g.label ? (r(), u("strong", Mr, n(g.label), 1)) : V("", !0),
        be(t(ys), {
          content: g.help || ""
        }, null, 8, ["content"])
      ])) : g.field.type === "select" ? (r(), u(G, { key: 2 }, [
        e("label", {
          for: $()
        }, n(g.label), 9, Er),
        be(t(We), {
          "input-id": $(),
          class: "input",
          "aria-label": g.label,
          "model-value": String(g.modelValue ?? ""),
          options: g.field.options ?? g.options ?? [],
          "onUpdate:modelValue": C[1] || (C[1] = (i) => b("update:modelValue", i))
        }, null, 8, ["input-id", "aria-label", "model-value", "options"]),
        g.help ? (r(), u("p", Ur, n(g.help), 1)) : V("", !0)
      ], 64)) : g.field.type === "model" ? (r(), u(G, { key: 3 }, [
        e("label", {
          for: $()
        }, n(g.label), 9, Tr),
        be(t(We), {
          "input-id": $(),
          class: "input",
          "aria-label": g.label,
          "model-value": String(g.modelValue ?? ""),
          options: g.modelOptions || [],
          "onUpdate:modelValue": C[2] || (C[2] = (i) => b("update:modelValue", i))
        }, null, 8, ["input-id", "aria-label", "model-value", "options"]),
        g.help ? (r(), u("p", Ar, n(g.help), 1)) : V("", !0)
      ], 64)) : g.field.type === "models" ? (r(), u(G, { key: 4 }, [
        e("label", {
          for: $()
        }, n(g.label), 9, Ir),
        be(kr, {
          "model-value": String(g.modelValue ?? ""),
          options: g.availableModels || [],
          "onUpdate:modelValue": C[3] || (C[3] = (i) => b("update:modelValue", i))
        }, null, 8, ["model-value", "options"]),
        g.help ? (r(), u("p", Nr, n(g.help), 1)) : V("", !0)
      ], 64)) : g.field.type === "dir" ? (r(), u(G, { key: 5 }, [
        e("label", {
          for: $()
        }, n(g.label), 9, Vr),
        e("div", Lr, [
          e("input", {
            id: $(),
            class: "input",
            type: "text",
            spellcheck: "false",
            value: String(g.modelValue ?? ""),
            placeholder: g.field.default_value || "",
            onInput: p
          }, null, 40, Rr),
          e("button", {
            class: "btn btn-tonal compact",
            type: "button",
            onClick: C[4] || (C[4] = (i) => b("browse"))
          }, n(t(h)("settings.browse")), 1)
        ]),
        g.help ? (r(), u("p", Or, n(g.help), 1)) : V("", !0)
      ], 64)) : (r(), u(G, { key: 6 }, [
        e("label", {
          for: $()
        }, n(g.label), 9, Dr),
        e("input", {
          id: $(),
          class: "input",
          type: g.field.type === "number" ? "number" : "text",
          value: g.modelValue === void 0 || g.modelValue === null ? "" : String(g.modelValue),
          onInput: p
        }, null, 40, zr),
        g.help ? (r(), u("p", Fr, n(g.help), 1)) : V("", !0)
      ], 64))
    ]));
  }
});
var qe;
((g) => {
  const p = class p {
    constructor(i, o, l, a) {
      ee(this, "version");
      ee(this, "errorCorrectionLevel");
      ee(this, "size");
      ee(this, "mask");
      ee(this, "modules", []);
      ee(this, "isFunction", []);
      if (this.version = i, this.errorCorrectionLevel = o, i < p.MIN_VERSION || i > p.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (a < -1 || a > 7)
        throw new RangeError("Mask value out of range");
      this.size = i * 4 + 17;
      let c = [];
      for (let w = 0; w < this.size; w++)
        c.push(!1);
      for (let w = 0; w < this.size; w++)
        this.modules.push(c.slice()), this.isFunction.push(c.slice());
      this.drawFunctionPatterns();
      const v = this.addEccAndInterleave(l);
      if (this.drawCodewords(v), a == -1) {
        let w = 1e9;
        for (let f = 0; f < 8; f++) {
          this.applyMask(f), this.drawFormatBits(f);
          const E = this.getPenaltyScore();
          E < w && (a = f, w = E), this.applyMask(f);
        }
      }
      b(0 <= a && a <= 7), this.mask = a, this.applyMask(a), this.drawFormatBits(a), this.isFunction = [];
    }
    static encodeText(i, o) {
      const l = g.QrSegment.makeSegments(i);
      return p.encodeSegments(l, o);
    }
    static encodeBinary(i, o) {
      const l = g.QrSegment.makeBytes(i);
      return p.encodeSegments([l], o);
    }
    static encodeSegments(i, o, l = 1, a = 40, c = -1, v = !0) {
      if (!(p.MIN_VERSION <= l && l <= a && a <= p.MAX_VERSION) || c < -1 || c > 7)
        throw new RangeError("Invalid value");
      let w, f;
      for (w = l; ; w++) {
        const R = p.getNumDataCodewords(w, o) * 8, I = $.getTotalBits(i, w);
        if (I <= R) {
          f = I;
          break;
        }
        if (w >= a)
          throw new RangeError("Data too long");
      }
      for (const R of [p.Ecc.MEDIUM, p.Ecc.QUARTILE, p.Ecc.HIGH])
        v && f <= p.getNumDataCodewords(w, R) * 8 && (o = R);
      let E = [];
      for (const R of i) {
        h(R.mode.modeBits, 4, E), h(R.numChars, R.mode.numCharCountBits(w), E);
        for (const I of R.getData())
          E.push(I);
      }
      b(E.length == f);
      const U = p.getNumDataCodewords(w, o) * 8;
      b(E.length <= U), h(0, Math.min(4, U - E.length), E), h(0, (8 - E.length % 8) % 8, E), b(E.length % 8 == 0);
      for (let R = 236; E.length < U; R ^= 253)
        h(R, 8, E);
      let H = [];
      for (; H.length * 8 < E.length; )
        H.push(0);
      return E.forEach((R, I) => H[I >>> 3] |= R << 7 - (I & 7)), new p(w, o, H, c);
    }
    getModule(i, o) {
      return 0 <= i && i < this.size && 0 <= o && o < this.size && this.modules[o][i];
    }
    drawFunctionPatterns() {
      for (let l = 0; l < this.size; l++)
        this.setFunctionModule(6, l, l % 2 == 0), this.setFunctionModule(l, 6, l % 2 == 0);
      this.drawFinderPattern(3, 3), this.drawFinderPattern(this.size - 4, 3), this.drawFinderPattern(3, this.size - 4);
      const i = this.getAlignmentPatternPositions(), o = i.length;
      for (let l = 0; l < o; l++)
        for (let a = 0; a < o; a++)
          l == 0 && a == 0 || l == 0 && a == o - 1 || l == o - 1 && a == 0 || this.drawAlignmentPattern(i[l], i[a]);
      this.drawFormatBits(0), this.drawVersion();
    }
    drawFormatBits(i) {
      const o = this.errorCorrectionLevel.formatBits << 3 | i;
      let l = o;
      for (let c = 0; c < 10; c++)
        l = l << 1 ^ (l >>> 9) * 1335;
      const a = (o << 10 | l) ^ 21522;
      b(a >>> 15 == 0);
      for (let c = 0; c <= 5; c++)
        this.setFunctionModule(8, c, d(a, c));
      this.setFunctionModule(8, 7, d(a, 6)), this.setFunctionModule(8, 8, d(a, 7)), this.setFunctionModule(7, 8, d(a, 8));
      for (let c = 9; c < 15; c++)
        this.setFunctionModule(14 - c, 8, d(a, c));
      for (let c = 0; c < 8; c++)
        this.setFunctionModule(this.size - 1 - c, 8, d(a, c));
      for (let c = 8; c < 15; c++)
        this.setFunctionModule(8, this.size - 15 + c, d(a, c));
      this.setFunctionModule(8, this.size - 8, !0);
    }
    drawVersion() {
      if (this.version < 7)
        return;
      let i = this.version;
      for (let l = 0; l < 12; l++)
        i = i << 1 ^ (i >>> 11) * 7973;
      const o = this.version << 12 | i;
      b(o >>> 18 == 0);
      for (let l = 0; l < 18; l++) {
        const a = d(o, l), c = this.size - 11 + l % 3, v = Math.floor(l / 3);
        this.setFunctionModule(c, v, a), this.setFunctionModule(v, c, a);
      }
    }
    drawFinderPattern(i, o) {
      for (let l = -4; l <= 4; l++)
        for (let a = -4; a <= 4; a++) {
          const c = Math.max(Math.abs(a), Math.abs(l)), v = i + a, w = o + l;
          0 <= v && v < this.size && 0 <= w && w < this.size && this.setFunctionModule(v, w, c != 2 && c != 4);
        }
    }
    drawAlignmentPattern(i, o) {
      for (let l = -2; l <= 2; l++)
        for (let a = -2; a <= 2; a++)
          this.setFunctionModule(i + a, o + l, Math.max(Math.abs(a), Math.abs(l)) != 1);
    }
    setFunctionModule(i, o, l) {
      this.modules[o][i] = l, this.isFunction[o][i] = !0;
    }
    addEccAndInterleave(i) {
      const o = this.version, l = this.errorCorrectionLevel;
      if (i.length != p.getNumDataCodewords(o, l))
        throw new RangeError("Invalid argument");
      const a = p.NUM_ERROR_CORRECTION_BLOCKS[l.ordinal][o], c = p.ECC_CODEWORDS_PER_BLOCK[l.ordinal][o], v = Math.floor(p.getNumRawDataModules(o) / 8), w = a - v % a, f = Math.floor(v / a);
      let E = [];
      const U = p.reedSolomonComputeDivisor(c);
      for (let R = 0, I = 0; R < a; R++) {
        let M = i.slice(I, I + f - c + (R < w ? 0 : 1));
        I += M.length;
        const T = p.reedSolomonComputeRemainder(M, U);
        R < w && M.push(0), E.push(M.concat(T));
      }
      let H = [];
      for (let R = 0; R < E[0].length; R++)
        E.forEach((I, M) => {
          (R != f - c || M >= w) && H.push(I[R]);
        });
      return b(H.length == v), H;
    }
    drawCodewords(i) {
      if (i.length != Math.floor(p.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let o = 0;
      for (let l = this.size - 1; l >= 1; l -= 2) {
        l == 6 && (l = 5);
        for (let a = 0; a < this.size; a++)
          for (let c = 0; c < 2; c++) {
            const v = l - c, f = (l + 1 & 2) == 0 ? this.size - 1 - a : a;
            !this.isFunction[f][v] && o < i.length * 8 && (this.modules[f][v] = d(i[o >>> 3], 7 - (o & 7)), o++);
          }
      }
      b(o == i.length * 8);
    }
    applyMask(i) {
      if (i < 0 || i > 7)
        throw new RangeError("Mask value out of range");
      for (let o = 0; o < this.size; o++)
        for (let l = 0; l < this.size; l++) {
          let a;
          switch (i) {
            case 0:
              a = (l + o) % 2 == 0;
              break;
            case 1:
              a = o % 2 == 0;
              break;
            case 2:
              a = l % 3 == 0;
              break;
            case 3:
              a = (l + o) % 3 == 0;
              break;
            case 4:
              a = (Math.floor(l / 3) + Math.floor(o / 2)) % 2 == 0;
              break;
            case 5:
              a = l * o % 2 + l * o % 3 == 0;
              break;
            case 6:
              a = (l * o % 2 + l * o % 3) % 2 == 0;
              break;
            case 7:
              a = ((l + o) % 2 + l * o % 3) % 2 == 0;
              break;
            default:
              throw new Error("Unreachable");
          }
          !this.isFunction[o][l] && a && (this.modules[o][l] = !this.modules[o][l]);
        }
    }
    getPenaltyScore() {
      let i = 0;
      for (let c = 0; c < this.size; c++) {
        let v = !1, w = 0, f = [0, 0, 0, 0, 0, 0, 0];
        for (let E = 0; E < this.size; E++)
          this.modules[c][E] == v ? (w++, w == 5 ? i += p.PENALTY_N1 : w > 5 && i++) : (this.finderPenaltyAddHistory(w, f), v || (i += this.finderPenaltyCountPatterns(f) * p.PENALTY_N3), v = this.modules[c][E], w = 1);
        i += this.finderPenaltyTerminateAndCount(v, w, f) * p.PENALTY_N3;
      }
      for (let c = 0; c < this.size; c++) {
        let v = !1, w = 0, f = [0, 0, 0, 0, 0, 0, 0];
        for (let E = 0; E < this.size; E++)
          this.modules[E][c] == v ? (w++, w == 5 ? i += p.PENALTY_N1 : w > 5 && i++) : (this.finderPenaltyAddHistory(w, f), v || (i += this.finderPenaltyCountPatterns(f) * p.PENALTY_N3), v = this.modules[E][c], w = 1);
        i += this.finderPenaltyTerminateAndCount(v, w, f) * p.PENALTY_N3;
      }
      for (let c = 0; c < this.size - 1; c++)
        for (let v = 0; v < this.size - 1; v++) {
          const w = this.modules[c][v];
          w == this.modules[c][v + 1] && w == this.modules[c + 1][v] && w == this.modules[c + 1][v + 1] && (i += p.PENALTY_N2);
        }
      let o = 0;
      for (const c of this.modules)
        o = c.reduce((v, w) => v + (w ? 1 : 0), o);
      const l = this.size * this.size, a = Math.ceil(Math.abs(o * 20 - l * 10) / l) - 1;
      return b(0 <= a && a <= 9), i += a * p.PENALTY_N4, b(0 <= i && i <= 2568888), i;
    }
    getAlignmentPatternPositions() {
      if (this.version == 1)
        return [];
      {
        const i = Math.floor(this.version / 7) + 2, o = Math.floor((this.version * 8 + i * 3 + 5) / (i * 4 - 4)) * 2;
        let l = [6];
        for (let a = this.size - 7; l.length < i; a -= o)
          l.splice(1, 0, a);
        return l;
      }
    }
    static getNumRawDataModules(i) {
      if (i < p.MIN_VERSION || i > p.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let o = (16 * i + 128) * i + 64;
      if (i >= 2) {
        const l = Math.floor(i / 7) + 2;
        o -= (25 * l - 10) * l - 55, i >= 7 && (o -= 36);
      }
      return b(208 <= o && o <= 29648), o;
    }
    static getNumDataCodewords(i, o) {
      return Math.floor(p.getNumRawDataModules(i) / 8) - p.ECC_CODEWORDS_PER_BLOCK[o.ordinal][i] * p.NUM_ERROR_CORRECTION_BLOCKS[o.ordinal][i];
    }
    static reedSolomonComputeDivisor(i) {
      if (i < 1 || i > 255)
        throw new RangeError("Degree out of range");
      let o = [];
      for (let a = 0; a < i - 1; a++)
        o.push(0);
      o.push(1);
      let l = 1;
      for (let a = 0; a < i; a++) {
        for (let c = 0; c < o.length; c++)
          o[c] = p.reedSolomonMultiply(o[c], l), c + 1 < o.length && (o[c] ^= o[c + 1]);
        l = p.reedSolomonMultiply(l, 2);
      }
      return o;
    }
    static reedSolomonComputeRemainder(i, o) {
      let l = o.map((a) => 0);
      for (const a of i) {
        const c = a ^ l.shift();
        l.push(0), o.forEach((v, w) => l[w] ^= p.reedSolomonMultiply(v, c));
      }
      return l;
    }
    static reedSolomonMultiply(i, o) {
      if (i >>> 8 || o >>> 8)
        throw new RangeError("Byte out of range");
      let l = 0;
      for (let a = 7; a >= 0; a--)
        l = l << 1 ^ (l >>> 7) * 285, l ^= (o >>> a & 1) * i;
      return b(l >>> 8 == 0), l;
    }
    finderPenaltyCountPatterns(i) {
      const o = i[1];
      b(o <= this.size * 3);
      const l = o > 0 && i[2] == o && i[3] == o * 3 && i[4] == o && i[5] == o;
      return (l && i[0] >= o * 4 && i[6] >= o ? 1 : 0) + (l && i[6] >= o * 4 && i[0] >= o ? 1 : 0);
    }
    finderPenaltyTerminateAndCount(i, o, l) {
      return i && (this.finderPenaltyAddHistory(o, l), o = 0), o += this.size, this.finderPenaltyAddHistory(o, l), this.finderPenaltyCountPatterns(l);
    }
    finderPenaltyAddHistory(i, o) {
      o[0] == 0 && (i += this.size), o.pop(), o.unshift(i);
    }
  };
  ee(p, "MIN_VERSION", 1), ee(p, "MAX_VERSION", 40), ee(p, "PENALTY_N1", 3), ee(p, "PENALTY_N2", 3), ee(p, "PENALTY_N3", 40), ee(p, "PENALTY_N4", 10), ee(p, "ECC_CODEWORDS_PER_BLOCK", [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  ]), ee(p, "NUM_ERROR_CORRECTION_BLOCKS", [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  ]);
  let s = p;
  g.QrCode = s;
  function h(C, i, o) {
    if (i < 0 || i > 31 || C >>> i)
      throw new RangeError("Value out of range");
    for (let l = i - 1; l >= 0; l--)
      o.push(C >>> l & 1);
  }
  function d(C, i) {
    return (C >>> i & 1) != 0;
  }
  function b(C) {
    if (!C)
      throw new Error("Assertion error");
  }
  const y = class y {
    constructor(i, o, l) {
      ee(this, "mode");
      ee(this, "numChars");
      ee(this, "bitData");
      if (this.mode = i, this.numChars = o, this.bitData = l, o < 0)
        throw new RangeError("Invalid argument");
      this.bitData = l.slice();
    }
    static makeBytes(i) {
      let o = [];
      for (const l of i)
        h(l, 8, o);
      return new y(y.Mode.BYTE, i.length, o);
    }
    static makeNumeric(i) {
      if (!y.isNumeric(i))
        throw new RangeError("String contains non-numeric characters");
      let o = [];
      for (let l = 0; l < i.length; ) {
        const a = Math.min(i.length - l, 3);
        h(parseInt(i.substring(l, l + a), 10), a * 3 + 1, o), l += a;
      }
      return new y(y.Mode.NUMERIC, i.length, o);
    }
    static makeAlphanumeric(i) {
      if (!y.isAlphanumeric(i))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let o = [], l;
      for (l = 0; l + 2 <= i.length; l += 2) {
        let a = y.ALPHANUMERIC_CHARSET.indexOf(i.charAt(l)) * 45;
        a += y.ALPHANUMERIC_CHARSET.indexOf(i.charAt(l + 1)), h(a, 11, o);
      }
      return l < i.length && h(y.ALPHANUMERIC_CHARSET.indexOf(i.charAt(l)), 6, o), new y(y.Mode.ALPHANUMERIC, i.length, o);
    }
    static makeSegments(i) {
      return i == "" ? [] : y.isNumeric(i) ? [y.makeNumeric(i)] : y.isAlphanumeric(i) ? [y.makeAlphanumeric(i)] : [y.makeBytes(y.toUtf8ByteArray(i))];
    }
    static makeEci(i) {
      let o = [];
      if (i < 0)
        throw new RangeError("ECI assignment value out of range");
      if (i < 128)
        h(i, 8, o);
      else if (i < 16384)
        h(2, 2, o), h(i, 14, o);
      else if (i < 1e6)
        h(6, 3, o), h(i, 21, o);
      else
        throw new RangeError("ECI assignment value out of range");
      return new y(y.Mode.ECI, 0, o);
    }
    static isNumeric(i) {
      return y.NUMERIC_REGEX.test(i);
    }
    static isAlphanumeric(i) {
      return y.ALPHANUMERIC_REGEX.test(i);
    }
    getData() {
      return this.bitData.slice();
    }
    static getTotalBits(i, o) {
      let l = 0;
      for (const a of i) {
        const c = a.mode.numCharCountBits(o);
        if (a.numChars >= 1 << c)
          return 1 / 0;
        l += 4 + c + a.bitData.length;
      }
      return l;
    }
    static toUtf8ByteArray(i) {
      i = encodeURI(i);
      let o = [];
      for (let l = 0; l < i.length; l++)
        i.charAt(l) != "%" ? o.push(i.charCodeAt(l)) : (o.push(parseInt(i.substring(l + 1, l + 3), 16)), l += 2);
      return o;
    }
  };
  ee(y, "NUMERIC_REGEX", /^[0-9]*$/), ee(y, "ALPHANUMERIC_REGEX", /^[A-Z0-9 $%*+.\/:-]*$/), ee(y, "ALPHANUMERIC_CHARSET", "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:");
  let $ = y;
  g.QrSegment = $;
})(qe || (qe = {}));
((g) => {
  ((s) => {
    const d = class d {
      constructor($, p) {
        ee(this, "ordinal");
        ee(this, "formatBits");
        this.ordinal = $, this.formatBits = p;
      }
    };
    ee(d, "LOW", new d(0, 1)), ee(d, "MEDIUM", new d(1, 0)), ee(d, "QUARTILE", new d(2, 3)), ee(d, "HIGH", new d(3, 2));
    let h = d;
    s.Ecc = h;
  })(g.QrCode || (g.QrCode = {}));
})(qe || (qe = {}));
((g) => {
  ((s) => {
    const d = class d {
      constructor($, p) {
        ee(this, "modeBits");
        ee(this, "numBitsCharCount");
        this.modeBits = $, this.numBitsCharCount = p;
      }
      numCharCountBits($) {
        return this.numBitsCharCount[Math.floor(($ + 7) / 17)];
      }
    };
    ee(d, "NUMERIC", new d(1, [10, 12, 14])), ee(d, "ALPHANUMERIC", new d(2, [9, 11, 13])), ee(d, "BYTE", new d(4, [8, 16, 16])), ee(d, "KANJI", new d(8, [8, 10, 12])), ee(d, "ECI", new d(7, [0, 0, 0]));
    let h = d;
    s.Mode = h;
  })(g.QrSegment || (g.QrSegment = {}));
})(qe || (qe = {}));
const Ft = qe, Br = { class: "content-card" }, Kr = { class: "card-desc" }, Hr = { class: "connection-grid" }, jr = { class: "connection-form" }, Yr = { class: "field" }, Xr = ["placeholder"], Jr = { class: "field" }, Wr = { class: "toggle-label" }, qr = { class: "field" }, Gr = ["placeholder"], Zr = { class: "field" }, Qr = ["placeholder"], ed = { class: "field" }, td = { class: "helper-text" }, sd = { key: 0 }, nd = { key: 1 }, ld = { class: "actions-row" }, od = { class: "connection-qr" }, ad = ["viewBox"], id = ["width", "height"], rd = ["x", "y"], dd = { class: "connection-link" }, Bt = "0kay.connection.qr.v2", cd = /* @__PURE__ */ _e({
  __name: "ConnectionPanel",
  setup(g) {
    const { t: s } = ye();
    function h() {
      try {
        return JSON.parse(localStorage.getItem(Bt) || "{}");
      } catch {
        return {};
      }
    }
    function d(I) {
      const M = (T) => /^192\.168\./.test(T) ? 0 : /^10\./.test(T) ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(T) ? 2 : /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(T) ? 4 : 3;
      return [...I].sort((T, J) => M(T) - M(J))[0] || "";
    }
    const b = h(), $ = !!b.hostOverride, p = x(b.hostOverride && b.host ? b.host : location.hostname), y = x($), C = location.protocol === "https:" ? location.port || "443" : "8080", i = x(b.port ?? C), o = x(b.tls ?? location.protocol === "https:"), l = x(""), a = x(""), c = x(b.name ?? "0KAY"), v = x(""), w = x(!1), f = x(!1);
    De(async () => {
      try {
        const I = await fetch("/api/auth/session");
        if (I.ok) {
          const M = await I.json();
          v.value = String(M.core_id || ""), w.value = !!M.lan_enabled;
          const T = Array.isArray(M.addresses) ? M.addresses : [], J = d(T);
          !y.value && J && (p.value = J);
        }
      } catch {
      }
    }), Ge([p, i, o, c, y], () => {
      localStorage.setItem(
        Bt,
        JSON.stringify({
          host: p.value,
          hostOverride: y.value,
          port: i.value,
          tls: o.value,
          name: c.value
        })
      );
    });
    const E = Z(() => {
      const I = o.value ? "https" : "http", M = String(i.value || "").trim();
      return `${I}://${p.value.trim()}${M ? ":" + M : ""}`;
    }), U = Z(() => {
      const I = [["v", "1"], ["url", E.value]];
      return c.value.trim() && I.push(["name", c.value.trim()]), l.value.trim() && I.push(["token", l.value.trim()]), a.value.trim() && I.push(["pin", a.value.trim()]), v.value && I.push(["core_id", v.value]), `0kay://pair?${I.map(([T, J]) => `${T}=${encodeURIComponent(J)}`).join("&")}`;
    }), H = Z(() => {
      const I = Ft.QrCode.encodeText(U.value, Ft.QrCode.Ecc.MEDIUM), M = I.size, T = 2, J = M + T * 2, ve = [];
      for (let ae = 0; ae < M; ae++)
        for (let K = 0; K < M; K++)
          I.getModule(K, ae) && ve.push({ x: K + T, y: ae + T });
      return { dim: J, dark: ve };
    });
    async function R() {
      try {
        await navigator.clipboard.writeText(U.value), f.value = !0, setTimeout(() => f.value = !1, 1500);
      } catch {
      }
    }
    return (I, M) => (r(), u("div", Br, [
      e("h2", null, n(t(s)("connection.title")), 1),
      e("p", Kr, n(t(s)("connection.lead")), 1),
      e("div", Hr, [
        e("div", jr, [
          e("div", Yr, [
            e("label", null, n(t(s)("connection.remoteHost")), 1),
            O(e("input", {
              "onUpdate:modelValue": M[0] || (M[0] = (T) => p.value = T),
              class: "input",
              placeholder: t(s)("connection.hostPlaceholder"),
              onInput: M[1] || (M[1] = (T) => y.value = !0)
            }, null, 40, Xr), [
              [W, p.value]
            ])
          ]),
          e("div", Jr, [
            e("label", null, n(t(s)("connection.port")), 1),
            O(e("input", {
              "onUpdate:modelValue": M[2] || (M[2] = (T) => i.value = T),
              class: "input",
              inputmode: "numeric",
              placeholder: "8080"
            }, null, 512), [
              [W, i.value]
            ])
          ]),
          e("label", Wr, [
            O(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": M[3] || (M[3] = (T) => o.value = T)
            }, null, 512), [
              [Ce, o.value]
            ]),
            M[7] || (M[7] = e("span", { class: "toggle-slider" }, null, -1)),
            e("span", null, n(t(s)("connection.useTls")), 1)
          ]),
          e("div", qr, [
            e("label", null, n(t(s)("connection.token")), 1),
            O(e("input", {
              "onUpdate:modelValue": M[4] || (M[4] = (T) => l.value = T),
              class: "input",
              type: "password",
              placeholder: t(s)("connection.tokenPlaceholder"),
              autocomplete: "off"
            }, null, 8, Gr), [
              [W, l.value]
            ])
          ]),
          e("div", Zr, [
            e("label", null, n(t(s)("connection.pin")), 1),
            O(e("input", {
              "onUpdate:modelValue": M[5] || (M[5] = (T) => a.value = T),
              class: "input",
              type: "password",
              placeholder: t(s)("connection.pinPlaceholder"),
              autocomplete: "off"
            }, null, 8, Qr), [
              [W, a.value]
            ])
          ]),
          e("div", ed, [
            e("label", null, n(t(s)("connection.deviceName")), 1),
            O(e("input", {
              "onUpdate:modelValue": M[6] || (M[6] = (T) => c.value = T),
              class: "input",
              placeholder: "0KAY"
            }, null, 512), [
              [W, c.value]
            ])
          ]),
          e("div", td, [
            Re(n(t(s)("connection.address")), 1),
            e("code", null, n(E.value), 1),
            v.value ? (r(), u("span", sd, " · Core: " + n(v.value), 1)) : V("", !0),
            w.value ? (r(), u("span", nd, n(t(s)("connection.lanMode")), 1)) : V("", !0)
          ]),
          e("div", ld, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              onClick: R
            }, n(f.value ? t(s)("common.copied") : t(s)("connection.copyLink")), 1)
          ])
        ]),
        e("div", od, [
          (r(), u("svg", {
            viewBox: `0 0 ${H.value.dim} ${H.value.dim}`,
            width: "264",
            height: "264",
            "shape-rendering": "crispEdges",
            role: "img",
            "aria-label": "0KAY connection QR code"
          }, [
            e("rect", {
              x: "0",
              y: "0",
              width: H.value.dim,
              height: H.value.dim,
              fill: "#ffffff"
            }, null, 8, id),
            (r(!0), u(G, null, de(H.value.dark, (T) => (r(), u("rect", {
              key: T.x + ":" + T.y,
              x: T.x,
              y: T.y,
              width: "1",
              height: "1",
              fill: "#0b1020"
            }, null, 8, rd))), 128))
          ], 8, ad)),
          e("code", dd, n(U.value), 1)
        ])
      ])
    ]));
  }
}), ud = /* @__PURE__ */ Oe(cd, [["__scopeId", "data-v-d9b226f0"]]), pd = { class: "content-card" }, hd = { class: "card-desc" }, vd = { class: "field-row" }, md = { class: "field" }, fd = ["placeholder"], gd = { class: "field" }, bd = ["placeholder"], _d = { class: "field" }, yd = { class: "field" }, kd = ["placeholder"], wd = { class: "field" }, $d = ["placeholder"], Sd = { class: "field" }, Cd = ["placeholder"], Pd = { class: "field" }, xd = ["placeholder"], Md = { class: "helper-text" }, Ed = /* @__PURE__ */ _e({
  __name: "PersonaPanel",
  setup(g) {
    const { t: s } = ye(), h = dt(), { tabLabel: d, tabMeta: b } = yt();
    return ($, p) => (r(), u("div", pd, [
      e("h2", null, n(t(d)("persona")), 1),
      e("p", hd, n(t(b)("persona")?.descriptionKey ? t(s)(t(b)("persona").descriptionKey) : t(s)("settings.personaDesc")), 1),
      e("div", vd, [
        e("div", md, [
          e("label", null, n(t(s)("wizard.name")), 1),
          O(e("input", {
            "onUpdate:modelValue": p[0] || (p[0] = (y) => t(h).persona.name = y),
            placeholder: t(s)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, fd), [
            [W, t(h).persona.name]
          ])
        ]),
        e("div", gd, [
          e("label", null, n(t(s)("wizard.avatarUrl")), 1),
          O(e("input", {
            "onUpdate:modelValue": p[1] || (p[1] = (y) => t(h).persona.avatar = y),
            placeholder: t(s)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, bd), [
            [W, t(h).persona.avatar]
          ])
        ]),
        e("div", _d, [
          e("label", null, n(t(s)("settings.personaBirthDate")), 1),
          O(e("input", {
            "onUpdate:modelValue": p[2] || (p[2] = (y) => t(h).persona.birthDate = y),
            type: "date",
            class: "input"
          }, null, 512), [
            [W, t(h).persona.birthDate]
          ])
        ])
      ]),
      e("div", yd, [
        e("label", null, n(t(s)("wizard.description")), 1),
        O(e("textarea", {
          "onUpdate:modelValue": p[3] || (p[3] = (y) => t(h).persona.description = y),
          placeholder: t(s)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, kd), [
          [W, t(h).persona.description]
        ])
      ]),
      e("div", wd, [
        e("label", null, n(t(s)("wizard.personality")), 1),
        O(e("textarea", {
          "onUpdate:modelValue": p[4] || (p[4] = (y) => t(h).persona.personality = y),
          placeholder: t(s)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, $d), [
          [W, t(h).persona.personality]
        ])
      ]),
      e("div", Sd, [
        e("label", null, n(t(s)("wizard.greeting")), 1),
        O(e("textarea", {
          "onUpdate:modelValue": p[5] || (p[5] = (y) => t(h).persona.greeting = y),
          placeholder: t(s)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, Cd), [
          [W, t(h).persona.greeting]
        ])
      ]),
      e("div", Pd, [
        e("label", null, n(t(s)("wizard.customPrompt")), 1),
        O(e("textarea", {
          "onUpdate:modelValue": p[6] || (p[6] = (y) => t(h).persona.customPrompt = y),
          placeholder: t(s)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, xd), [
          [W, t(h).persona.customPrompt]
        ]),
        e("p", Md, n(t(s)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), Ud = { class: "content-card" }, Td = { class: "card-desc" }, Ad = { class: "toggle-label" }, Id = { class: "helper-text" }, Nd = { class: "toggle-label" }, Vd = { class: "helper-text" }, Ld = { class: "field" }, Rd = ["placeholder"], Od = { class: "helper-text" }, Dd = {
  key: 0,
  class: "helper-text"
}, zd = { class: "actions-row" }, Fd = /* @__PURE__ */ _e({
  __name: "PermissionsPanel",
  setup(g) {
    const { t: s } = ye(), { tabLabel: h, tabMeta: d, fieldLabel: b, fieldHelp: $ } = yt(), p = x({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), y = x("");
    async function C() {
      try {
        const o = await fetch("/api/life/permissions");
        if (o.ok) {
          const l = await o.json();
          p.value = {
            screen_watch: !!l.screen_watch,
            computer_use: !!l.computer_use,
            report_agent_host: l.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function i() {
      y.value = "";
      try {
        const o = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p.value)
        });
        if (!o.ok) throw new Error(String(o.status));
        const l = await o.json();
        p.value = {
          screen_watch: !!l.screen_watch,
          computer_use: !!l.computer_use,
          report_agent_host: l.report_agent_host || ""
        }, y.value = s("settings.permSaved");
      } catch {
        y.value = s("settings.permFailed");
      }
    }
    return De(C), (o, l) => (r(), u("div", Ud, [
      e("h2", null, n(t(h)("permissions")), 1),
      e("p", Td, n(t(d)("permissions")?.descriptionKey ? t(s)(t(d)("permissions").descriptionKey) : t(s)("settings.permissionsDesc")), 1),
      e("label", Ad, [
        O(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": l[0] || (l[0] = (a) => p.value.screen_watch = a),
          onChange: i
        }, null, 544), [
          [Ce, p.value.screen_watch]
        ]),
        l[4] || (l[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(t(b)(t(d)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          l[3] || (l[3] = e("br", null, null, -1)),
          e("small", Id, n(t($)(t(d)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", Nd, [
        O(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": l[1] || (l[1] = (a) => p.value.computer_use = a),
          onChange: i
        }, null, 544), [
          [Ce, p.value.computer_use]
        ]),
        l[6] || (l[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(t(b)(t(d)("permissions"), "computer_use", "settings.computerUse")), 1),
          l[5] || (l[5] = e("br", null, null, -1)),
          e("small", Vd, n(t($)(t(d)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", Ld, [
        e("label", null, n(t(b)(t(d)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        O(e("input", {
          "onUpdate:modelValue": l[2] || (l[2] = (a) => p.value.report_agent_host = a),
          class: "input",
          placeholder: t($)(t(d)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: i
        }, null, 40, Rd), [
          [W, p.value.report_agent_host]
        ]),
        e("p", Od, n(t($)(t(d)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      y.value ? (r(), u("div", Dd, n(y.value), 1)) : V("", !0),
      e("div", zd, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: i
        }, n(t(s)("settings.save")), 1)
      ])
    ]));
  }
}), Bd = x(!1), Kd = x(!1);
x(!1);
const Ye = x(!1), Ze = x(!0), kt = x(!0), tt = x([]), Jt = x(!1);
x(!1);
const ct = x(!1), Kt = [];
function Hd(g) {
  const s = Kt.splice(0, Kt.length);
  for (const h of s)
    h.resolve();
}
async function jd() {
  const g = window.fetch;
  try {
    const s = await g("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!s.ok) return;
    const h = await s.json();
    Ye.value = !!h.configured, Ze.value = h.enabled !== !1, kt.value = h.login_enabled !== !1, tt.value = Array.isArray(h.pages) ? h.pages : [], ct.value = !h.configured && Ze.value;
  } catch {
  }
}
async function Yd(g) {
  const s = window.fetch, h = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(g)
  }), d = await h.json().catch(() => null);
  if (!h.ok) throw new Error(d?.error || `HTTP ${h.status}`);
  typeof d?.enabled == "boolean" && (Ze.value = d.enabled), typeof d?.login_enabled == "boolean" && (kt.value = d.login_enabled), Array.isArray(d?.pages) && (tt.value = d.pages), Ye.value = !!d?.configured, ct.value = !d?.configured && Ze.value;
}
async function Xd() {
  const g = window.fetch, s = await g("/api/security/pin", { method: "DELETE" }), h = await s.json().catch(() => null);
  if (!s.ok) throw new Error(h?.error || `HTTP ${s.status}`);
  Jt.value = !1, Ye.value = !1, ct.value = Ze.value;
}
async function Jd(g) {
  const s = window.fetch, h = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: g })
  }), d = await h.json().catch(() => null);
  if (!h.ok || !d?.configured) throw new Error(d?.error || `HTTP ${h.status}`);
  g.trim(), Jt.value = !0, Ye.value = !0, ct.value = !1, Kd.value = !0, Bd.value = !1, Hd();
}
const Wd = { class: "content-card security-panel" }, qd = { class: "card-desc" }, Gd = { class: "sec-stack" }, Zd = { class: "toggle-label" }, Qd = ["checked", "disabled"], ec = { class: "helper-text" }, tc = { class: "toggle-label" }, sc = ["checked", "disabled"], nc = { class: "helper-text" }, lc = { class: "sec-card" }, oc = { class: "sec-card-head" }, ac = { class: "sec-pin-grid" }, ic = { class: "sec-pin-col" }, rc = { class: "sec-pin-label" }, dc = { class: "sec-pin-col" }, cc = { class: "sec-pin-label" }, uc = { class: "sec-actions" }, pc = ["disabled"], hc = ["disabled"], vc = { class: "sec-card" }, mc = { class: "sec-card-head" }, fc = { class: "sec-chip" }, gc = { class: "helper-text" }, bc = { class: "page-list" }, _c = ["checked", "disabled", "onChange"], yc = { class: "page-text" }, kc = { class: "page-name" }, wc = {
  key: 0,
  class: "helper-text sec-msg"
}, $c = {
  key: 1,
  class: "sec-error"
}, Sc = /* @__PURE__ */ _e({
  __name: "SecurityPanel",
  setup(g) {
    const { t: s } = ye(), { confirm: h } = st(), d = Yt(), b = x(!1), $ = x(""), p = x(""), y = x(""), C = x(""), i = Z(() => {
      const w = [], f = /* @__PURE__ */ new Set(), E = (U, H) => {
        !U || f.has(U) || (f.add(U), w.push({ path: U, label: H || U }));
      };
      for (const U of d.navItems) {
        const H = U.to || (U.id === "chat" ? "/" : "");
        if (!H) continue;
        let R = U.labelKey ? s(U.labelKey) : "";
        (!R || R === U.labelKey) && (R = U.label || U.id), E(H, R);
      }
      for (const U of d.routerPatches) {
        let H = U.titleKey ? s(U.titleKey) : "";
        (!H || H === U.titleKey) && (H = U.title || String(U.name || U.path)), E(U.path, H);
      }
      return w;
    });
    De(() => {
      jd();
    });
    async function o(w) {
      b.value = !0, $.value = "", p.value = "";
      try {
        await Yd(w), $.value = s("settings.saved"), setTimeout(() => {
          $.value = "";
        }, 1500);
      } catch (f) {
        p.value = f?.message || s("settings.permFailed");
      } finally {
        b.value = !1;
      }
    }
    function l(w, f) {
      o({ [w]: f });
    }
    function a(w, f) {
      const E = new Set(tt.value);
      f ? E.add(w) : E.delete(w), o({ pages: [...E] });
    }
    async function c() {
      if (p.value = "", y.value.length !== 6) {
        p.value = s("wizard.pinTooShort");
        return;
      }
      if (y.value !== C.value) {
        p.value = s("wizard.pinMismatch");
        return;
      }
      b.value = !0;
      try {
        await Jd(y.value), y.value = "", C.value = "", $.value = s("settings.saved"), setTimeout(() => {
          $.value = "";
        }, 1500);
      } catch (w) {
        p.value = w?.message || s("settings.permFailed");
      } finally {
        b.value = !1;
      }
    }
    async function v() {
      if (await h({
        title: s("security.removePin"),
        message: s("security.removePinConfirm"),
        confirmLabel: s("common.delete"),
        danger: !0
      })) {
        b.value = !0, p.value = "";
        try {
          await Xd(), $.value = s("settings.saved"), setTimeout(() => {
            $.value = "";
          }, 1500);
        } catch (f) {
          p.value = f?.message || s("settings.permFailed");
        } finally {
          b.value = !1;
        }
      }
    }
    return (w, f) => (r(), u("div", Wd, [
      e("h2", null, n(t(s)("settings.tabs.security")), 1),
      e("p", qd, n(t(s)("security.desc")), 1),
      e("div", Gd, [
        e("label", Zd, [
          e("input", {
            type: "checkbox",
            checked: t(Ze),
            disabled: b.value,
            onChange: f[0] || (f[0] = (E) => l("enabled", E.target.checked))
          }, null, 40, Qd),
          f[4] || (f[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, n(t(s)("security.pinSwitch")), 1),
            e("small", ec, n(t(s)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", tc, [
          e("input", {
            type: "checkbox",
            checked: t(kt),
            disabled: b.value,
            onChange: f[1] || (f[1] = (E) => l("login_enabled", E.target.checked))
          }, null, 40, sc),
          f[5] || (f[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, n(t(s)("security.loginSwitch")), 1),
            e("small", nc, n(t(s)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", lc, [
          e("div", oc, [
            e("strong", null, n(t(Ye) ? t(s)("security.changePin") : t(s)("auth.setupTitle")), 1),
            e("span", {
              class: oe(["sec-chip", { on: t(Ye) }])
            }, n(t(Ye) ? t(s)("security.pinSet") : t(s)("security.pinUnset")), 3)
          ]),
          e("div", ac, [
            e("div", ic, [
              e("span", rc, n(t(s)("auth.pinNew")), 1),
              be(t(Ot), {
                modelValue: y.value,
                "onUpdate:modelValue": f[2] || (f[2] = (E) => y.value = E)
              }, null, 8, ["modelValue"])
            ]),
            e("div", dc, [
              e("span", cc, n(t(s)("auth.pinConfirm")), 1),
              be(t(Ot), {
                modelValue: C.value,
                "onUpdate:modelValue": f[3] || (f[3] = (E) => C.value = E),
                onComplete: c
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", uc, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: b.value,
              onClick: c
            }, n(t(s)("auth.savePin")), 9, pc),
            t(Ye) ? (r(), u("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: b.value,
              onClick: v
            }, n(t(s)("security.removePin")), 9, hc)) : V("", !0)
          ])
        ]),
        e("section", vc, [
          e("div", mc, [
            e("strong", null, n(t(s)("security.pages")), 1),
            e("span", fc, n(t(s)("security.pageCount", { n: t(tt).length })), 1)
          ]),
          e("p", gc, n(t(s)("security.pagesHelp")), 1),
          e("div", bc, [
            (r(!0), u(G, null, de(i.value, (E) => (r(), u("label", {
              key: E.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: t(tt).includes(E.path),
                disabled: b.value,
                onChange: (U) => a(E.path, U.target.checked)
              }, null, 40, _c),
              f[6] || (f[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", yc, [
                e("span", kc, n(E.label), 1),
                e("code", null, n(E.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      $.value ? (r(), u("p", wc, n($.value), 1)) : V("", !0),
      p.value ? (r(), u("p", $c, n(p.value), 1)) : V("", !0)
    ]));
  }
}), Cc = /* @__PURE__ */ Oe(Sc, [["__scopeId", "data-v-8a0a3d8d"]]), Pc = { class: "mcp-panel" }, xc = { class: "mcp-head" }, Mc = { class: "subtitle" }, Ec = { class: "mcp-actions" }, Uc = ["disabled"], Tc = {
  key: 0,
  class: "error-banner"
}, Ac = {
  key: 1,
  class: "notice-banner"
}, Ic = {
  key: 2,
  class: "hint"
}, Nc = {
  key: 3,
  class: "mcp-list"
}, Vc = { class: "mcp-row" }, Lc = { class: "mcp-field grow" }, Rc = ["onUpdate:modelValue", "readonly"], Oc = { class: "mcp-field" }, Dc = ["onUpdate:modelValue", "onChange"], zc = { value: "builtin" }, Fc = { class: "mcp-toggle" }, Bc = ["onUpdate:modelValue"], Kc = ["onClick"], Hc = { class: "mcp-field" }, jc = ["onUpdate:modelValue"], Yc = { class: "mcp-field" }, Xc = ["onUpdate:modelValue"], Jc = { class: "mcp-field" }, Wc = ["onUpdate:modelValue"], qc = { class: "mcp-field" }, Gc = ["onUpdate:modelValue"], Zc = { class: "builtin-note" }, Qc = { class: "mail-grid" }, eu = { class: "mail-col" }, tu = { class: "mail-label" }, su = { class: "mcp-field" }, nu = ["onUpdate:modelValue"], lu = { class: "mail-row" }, ou = { class: "mcp-field" }, au = ["onUpdate:modelValue"], iu = { class: "mcp-toggle" }, ru = ["onUpdate:modelValue"], du = { class: "mcp-field" }, cu = ["onUpdate:modelValue"], uu = { class: "mcp-field" }, pu = ["onUpdate:modelValue"], hu = { class: "mail-col" }, vu = { class: "mail-label" }, mu = { class: "mcp-field" }, fu = ["onUpdate:modelValue"], gu = { class: "mail-row" }, bu = { class: "mcp-field" }, _u = ["onUpdate:modelValue"], yu = { class: "mcp-toggle" }, ku = ["onUpdate:modelValue"], wu = { class: "mcp-field" }, $u = ["onUpdate:modelValue"], Su = { class: "mcp-field" }, Cu = ["onUpdate:modelValue"], Pu = { class: "mail-row" }, xu = { class: "mcp-field grow" }, Mu = ["onUpdate:modelValue", "placeholder"], Eu = { class: "mcp-field" }, Uu = ["onUpdate:modelValue"], Tu = {
  key: 0,
  class: "hint"
}, Au = /* @__PURE__ */ _e({
  __name: "McpPanel",
  setup(g) {
    const { t: s } = ye(), h = x([]), d = x(!1), b = x(!1), $ = x(""), p = x(!1);
    function y() {
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
    function C(v) {
      const w = v?.transport === "http" ? "http" : v?.transport === "builtin" || v?.builtin ? "builtin" : "stdio", f = v?.options?.imap || {}, E = v?.options?.smtp || {};
      return {
        id: String(v?.id || ""),
        transport: w,
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
        smtpHost: String(E.host || ""),
        smtpPort: Number(E.port) || 465,
        smtpSecure: E.secure !== !1,
        smtpUser: String(E.user || ""),
        smtpPassword: String(E.password || ""),
        from: String(E.from || ""),
        fromName: String(E.fromName || "0KAY")
      };
    }
    function i(v) {
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
      const w = { id: v.id.trim(), transport: v.transport, enabled: v.enabled };
      if (v.transport === "http") {
        if (v.url.trim() && (w.url = v.url.trim()), v.headersText.trim())
          try {
            w.headers = JSON.parse(v.headersText);
          } catch {
            throw new Error(s("mcp.headersInvalid", { id: v.id || "(unnamed)" }));
          }
      } else {
        v.command.trim() && (w.command = v.command.trim());
        const f = v.argsText.split(`
`).map((E) => E.trim()).filter(Boolean);
        f.length && (w.args = f);
      }
      return w;
    }
    function o(v) {
      v.transport === "builtin" && (v.id = "mail");
    }
    function l() {
      const v = y();
      h.value.some((w) => w.transport === "builtin") && (v.transport = "stdio"), h.value.push(v);
    }
    async function a() {
      d.value = !0, $.value = "";
      try {
        const w = (await je("/api/settings/mcp"))?.values?.servers;
        let f = [];
        if (typeof w == "string" && w.trim())
          try {
            const E = JSON.parse(w);
            Array.isArray(E) && (f = E);
          } catch {
            $.value = s("mcp.configInvalid");
          }
        h.value = f.map(C);
      } catch (v) {
        $.value = v?.message || String(v);
      } finally {
        d.value = !1;
      }
    }
    async function c() {
      if (!b.value) {
        b.value = !0, $.value = "", p.value = !1;
        try {
          const v = /* @__PURE__ */ new Set(), w = h.value.map(i).filter((f) => {
            const E = String(f.id || "").trim();
            return !E || v.has(E) ? !1 : (v.add(E), !0);
          });
          await at("/api/settings/mcp", { values: { servers: JSON.stringify(w) } }), p.value = !0, setTimeout(() => {
            p.value = !1;
          }, 2e3);
        } catch (v) {
          $.value = v?.message || String(v);
        } finally {
          b.value = !1;
        }
      }
    }
    return De(a), (v, w) => (r(), u("div", Pc, [
      e("header", xc, [
        e("div", null, [
          e("h2", null, n(t(s)("mcp.title")), 1),
          e("p", Mc, n(t(s)("mcp.subtitle")), 1)
        ]),
        e("div", Ec, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: l
          }, n(t(s)("mcp.addServer")), 1),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: b.value,
            onClick: c
          }, n(b.value ? t(s)("common.saving") : t(s)("common.save")), 9, Uc)
        ])
      ]),
      $.value ? (r(), u("div", Tc, n($.value), 1)) : V("", !0),
      p.value ? (r(), u("div", Ac, n(t(s)("settings.saved")), 1)) : V("", !0),
      d.value ? (r(), u("p", Ic, n(t(s)("common.loading")), 1)) : (r(), u("div", Nc, [
        (r(!0), u(G, null, de(h.value, (f, E) => (r(), u("article", {
          key: E,
          class: oe(["mcp-card", { "is-builtin": f.transport === "builtin" }])
        }, [
          e("div", Vc, [
            e("label", Lc, [
              w[0] || (w[0] = e("span", null, "ID", -1)),
              O(e("input", {
                "onUpdate:modelValue": (U) => f.id = U,
                readonly: f.transport === "builtin",
                placeholder: "filesystem"
              }, null, 8, Rc), [
                [W, f.id]
              ])
            ]),
            e("label", Oc, [
              e("span", null, n(t(s)("mcp.transport")), 1),
              O(e("select", {
                "onUpdate:modelValue": (U) => f.transport = U,
                onChange: (U) => o(f)
              }, [
                w[1] || (w[1] = e("option", { value: "stdio" }, "stdio", -1)),
                w[2] || (w[2] = e("option", { value: "http" }, "http", -1)),
                e("option", zc, n(t(s)("mcp.builtinMail")), 1)
              ], 40, Dc), [
                [ds, f.transport]
              ])
            ]),
            e("label", Fc, [
              O(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (U) => f.enabled = U
              }, null, 8, Bc), [
                [Ce, f.enabled]
              ]),
              e("span", null, n(t(s)("mcp.enabled")), 1)
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (U) => h.value.splice(E, 1)
            }, n(t(s)("common.delete")), 9, Kc)
          ]),
          f.transport === "stdio" ? (r(), u(G, { key: 0 }, [
            e("label", Hc, [
              e("span", null, n(t(s)("mcp.command")), 1),
              O(e("input", {
                "onUpdate:modelValue": (U) => f.command = U,
                placeholder: "npx"
              }, null, 8, jc), [
                [W, f.command]
              ])
            ]),
            e("label", Yc, [
              e("span", null, n(t(s)("mcp.args")), 1),
              O(e("textarea", {
                "onUpdate:modelValue": (U) => f.argsText = U,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, Xc), [
                [W, f.argsText]
              ])
            ])
          ], 64)) : f.transport === "http" ? (r(), u(G, { key: 1 }, [
            e("label", Jc, [
              w[3] || (w[3] = e("span", null, "URL", -1)),
              O(e("input", {
                "onUpdate:modelValue": (U) => f.url = U,
                placeholder: "https://example.com/mcp"
              }, null, 8, Wc), [
                [W, f.url]
              ])
            ]),
            e("label", qc, [
              w[4] || (w[4] = e("span", null, "Headers（JSON）", -1)),
              O(e("textarea", {
                "onUpdate:modelValue": (U) => f.headersText = U,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, Gc), [
                [W, f.headersText]
              ])
            ])
          ], 64)) : (r(), u(G, { key: 2 }, [
            e("p", Zc, n(t(s)("mcp.builtinNote")), 1),
            e("div", Qc, [
              e("div", eu, [
                e("p", tu, n(t(s)("mcp.imap")), 1),
                e("label", su, [
                  e("span", null, n(t(s)("mcp.host")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (U) => f.imapHost = U,
                    placeholder: "imap.example.com",
                    autocomplete: "off"
                  }, null, 8, nu), [
                    [W, f.imapHost]
                  ])
                ]),
                e("div", lu, [
                  e("label", ou, [
                    e("span", null, n(t(s)("mcp.port")), 1),
                    O(e("input", {
                      "onUpdate:modelValue": (U) => f.imapPort = U,
                      type: "number",
                      placeholder: "993"
                    }, null, 8, au), [
                      [
                        W,
                        f.imapPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", iu, [
                    O(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (U) => f.imapSsl = U
                    }, null, 8, ru), [
                      [Ce, f.imapSsl]
                    ]),
                    w[5] || (w[5] = e("span", null, "SSL", -1))
                  ])
                ]),
                e("label", du, [
                  e("span", null, n(t(s)("mcp.username")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (U) => f.imapUser = U,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, cu), [
                    [W, f.imapUser]
                  ])
                ]),
                e("label", uu, [
                  e("span", null, n(t(s)("mcp.password")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (U) => f.imapPassword = U,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, pu), [
                    [W, f.imapPassword]
                  ])
                ])
              ]),
              e("div", hu, [
                e("p", vu, n(t(s)("mcp.smtp")), 1),
                e("label", mu, [
                  e("span", null, n(t(s)("mcp.host")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (U) => f.smtpHost = U,
                    placeholder: "smtp.example.com",
                    autocomplete: "off"
                  }, null, 8, fu), [
                    [W, f.smtpHost]
                  ])
                ]),
                e("div", gu, [
                  e("label", bu, [
                    e("span", null, n(t(s)("mcp.port")), 1),
                    O(e("input", {
                      "onUpdate:modelValue": (U) => f.smtpPort = U,
                      type: "number",
                      placeholder: "465"
                    }, null, 8, _u), [
                      [
                        W,
                        f.smtpPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", yu, [
                    O(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (U) => f.smtpSecure = U
                    }, null, 8, ku), [
                      [Ce, f.smtpSecure]
                    ]),
                    w[6] || (w[6] = e("span", null, "SSL（465）", -1))
                  ])
                ]),
                e("label", wu, [
                  e("span", null, n(t(s)("mcp.username")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (U) => f.smtpUser = U,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, $u), [
                    [W, f.smtpUser]
                  ])
                ]),
                e("label", Su, [
                  e("span", null, n(t(s)("mcp.password")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (U) => f.smtpPassword = U,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, Cu), [
                    [W, f.smtpPassword]
                  ])
                ]),
                e("div", Pu, [
                  e("label", xu, [
                    e("span", null, n(t(s)("mcp.from")), 1),
                    O(e("input", {
                      "onUpdate:modelValue": (U) => f.from = U,
                      placeholder: t(s)("mcp.fromPlaceholder"),
                      autocomplete: "off"
                    }, null, 8, Mu), [
                      [W, f.from]
                    ])
                  ]),
                  e("label", Eu, [
                    e("span", null, n(t(s)("mcp.fromName")), 1),
                    O(e("input", {
                      "onUpdate:modelValue": (U) => f.fromName = U,
                      placeholder: "0KAY",
                      autocomplete: "off"
                    }, null, 8, Uu), [
                      [W, f.fromName]
                    ])
                  ])
                ])
              ])
            ])
          ], 64))
        ], 2))), 128)),
        h.value.length ? V("", !0) : (r(), u("p", Tu, n(t(s)("mcp.emptyServers")), 1))
      ]))
    ]));
  }
}), Iu = /* @__PURE__ */ Oe(Au, [["__scopeId", "data-v-60e55840"]]), Nu = { class: "content-card danger" }, Vu = { class: "card-desc" }, Lu = { class: "danger-box" }, Ru = ["disabled"], Ou = /* @__PURE__ */ _e({
  __name: "DangerPanel",
  setup(g) {
    const { t: s } = ye(), h = dt(), d = Xt(), { confirm: b } = st(), $ = x(!1);
    async function p() {
      if (!($.value || !await b({
        title: s("settings.reset"),
        message: s("settings.resetConfirmMsg"),
        confirmLabel: s("settings.reset"),
        danger: !0
      }))) {
        $.value = !0;
        try {
          h.resetWizard(), d.push("/");
        } finally {
          $.value = !1;
        }
      }
    }
    return (y, C) => (r(), u("div", Nu, [
      e("h2", null, n(t(s)("settings.tabs.danger")), 1),
      e("p", Vu, n(t(s)("settings.resetDesc")), 1),
      e("div", Lu, [
        e("div", null, [
          e("strong", null, n(t(s)("settings.reset")), 1),
          e("p", null, n(t(s)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          disabled: $.value,
          onClick: p
        }, n(t(s)("settings.reset")), 9, Ru)
      ])
    ]));
  }
}), Du = {
  key: 1,
  class: "plugin-pane-message"
}, zu = {
  key: 2,
  class: "plugin-pane-message"
}, Fu = /* @__PURE__ */ _e({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(g) {
    const { t: s } = ye(), h = g, d = Rt(null), b = Rt("");
    let $ = 0;
    return Ge(
      () => h.module,
      async (p) => {
        if (!p) {
          d.value = null, b.value = "";
          return;
        }
        const y = ++$;
        try {
          const C = await import(
            /* @vite-ignore */
            p
          );
          if (y !== $) return;
          d.value = C?.default || C, b.value = "";
        } catch (C) {
          if (y !== $) return;
          d.value = null, b.value = C?.message || String(C);
        }
      },
      { immediate: !0 }
    ), (p, y) => d.value ? (r(), $e(cs(d.value), { key: 0 })) : b.value ? (r(), u("div", Du, n(b.value), 1)) : (r(), u("div", zu, n(t(s)("pluginPane.loading")), 1));
  }
}), Bu = /* @__PURE__ */ Oe(Fu, [["__scopeId", "data-v-32ca9ff2"]]), Ku = { class: "pp-head" }, Hu = ["aria-label", "disabled"], ju = { class: "pp-roots" }, Yu = ["onClick"], Xu = ["placeholder"], Ju = ["aria-busy"], Wu = {
  key: 0,
  class: "pp-empty"
}, qu = {
  key: 1,
  class: "pp-empty pp-error"
}, Gu = {
  key: 2,
  class: "pp-empty"
}, Zu = ["title", "onClick"], Qu = { class: "pp-name" }, ep = ["title"], tp = { class: "pp-foot" }, sp = ["disabled"], np = ["disabled"], lp = /* @__PURE__ */ _e({
  __name: "PathPicker",
  props: {
    open: { type: Boolean },
    initial: {},
    title: {}
  },
  emits: ["update:open", "pick"],
  setup(g, { emit: s }) {
    const h = g, d = s, { t: b } = ye(), $ = x(""), p = x(""), y = x([]), C = x([]), i = x(!1), o = x(""), l = x(""), a = x(!1);
    let c = "";
    async function v(R) {
      i.value = !0, o.value = "";
      try {
        const I = await fetch(`/api/agent/workspace?path=${encodeURIComponent(R || "")}`);
        if (!I.ok) {
          const T = await I.json().catch(() => ({}));
          o.value = T?.error || `HTTP ${I.status}`;
          return;
        }
        const M = await I.json();
        $.value = String(M?.path || ""), p.value = String(M?.parent || ""), y.value = Array.isArray(M?.roots) ? M.roots.map(String) : [], C.value = Array.isArray(M?.directories) ? M.directories.map((T) => ({ name: String(T?.name || ""), path: String(T?.path || "") })) : [], l.value = $.value, c = $.value;
      } catch (I) {
        o.value = I instanceof Error ? I.message : String(I);
      } finally {
        i.value = !1;
      }
    }
    Ge(
      () => h.open,
      (R) => {
        if (!R) return;
        o.value = "";
        const I = (h.initial || "").trim() || c;
        l.value = I, v(I);
      },
      { immediate: !0 }
    );
    function w() {
      d("update:open", !1);
    }
    function f() {
      const R = ($.value || l.value).trim();
      R && (d("pick", R), w());
    }
    function E(R) {
      v(R.path);
    }
    function U() {
      p.value && p.value !== $.value && v(p.value);
    }
    async function H() {
      if (!a.value) {
        a.value = !0, o.value = "";
        try {
          const R = await fetch(`/api/agent/pick-folder?title=${encodeURIComponent(h.title || b("settings.pathPickTitle"))}`);
          if (R.ok) {
            const I = await R.json().catch(() => ({}));
            I?.path && (d("pick", String(I.path)), w());
          }
        } catch (R) {
          o.value = R instanceof Error ? R.message : String(R);
        } finally {
          a.value = !1;
        }
      }
    }
    return (R, I) => (r(), $e(t(ks), {
      open: g.open,
      title: g.title || t(b)("settings.pathPickTitle"),
      "on-dismiss": w,
      "initial-focus": "first",
      "panel-class": "path-picker-panel"
    }, {
      default: ot(() => [
        e("header", Ku, [
          e("h2", null, n(g.title || t(b)("settings.pathPickTitle")), 1),
          e("button", {
            class: "pp-icon",
            type: "button",
            "aria-label": t(b)("settings.pathUp"),
            disabled: i.value,
            onClick: U
          }, "↑", 8, Hu)
        ]),
        e("div", ju, [
          (r(!0), u(G, null, de(y.value, (M) => (r(), u("button", {
            key: M,
            class: oe(["pp-root", { "is-active": $.value === M }]),
            type: "button",
            onClick: (T) => v(M)
          }, n(M), 11, Yu))), 128))
        ]),
        O(e("input", {
          "onUpdate:modelValue": I[0] || (I[0] = (M) => l.value = M),
          class: "input pp-path",
          placeholder: t(b)("settings.pathPlaceholder"),
          spellcheck: "false",
          onKeydown: I[1] || (I[1] = _t(He((M) => v(l.value), ["prevent"]), ["enter"]))
        }, null, 40, Xu), [
          [W, l.value]
        ]),
        e("div", {
          class: "pp-list",
          role: "listbox",
          "aria-busy": i.value
        }, [
          i.value ? (r(), u("p", Wu, n(t(b)("settings.pathLoading")), 1)) : o.value ? (r(), u("p", qu, n(o.value), 1)) : C.value.length ? (r(!0), u(G, { key: 3 }, de(C.value, (M) => (r(), u("button", {
            key: M.path,
            class: "pp-item",
            type: "button",
            role: "option",
            title: M.path,
            onClick: (T) => E(M)
          }, [
            I[2] || (I[2] = e("span", {
              class: "pp-folder",
              "aria-hidden": "true"
            }, "▸", -1)),
            e("span", Qu, n(M.name), 1)
          ], 8, Zu))), 128)) : (r(), u("p", Gu, n(t(b)("settings.pathEmpty")), 1))
        ], 8, Ju),
        e("p", {
          class: "pp-current",
          title: $.value
        }, n(t(b)("settings.pathSelected", { path: $.value || l.value || "—" })), 9, ep),
        e("footer", tp, [
          e("button", {
            class: "btn btn-text",
            type: "button",
            disabled: a.value,
            onClick: H
          }, n(a.value ? t(b)("settings.pathNativeBusy") : t(b)("settings.pathNative")), 9, sp),
          I[3] || (I[3] = e("span", { class: "pp-spacer" }, null, -1)),
          e("button", {
            class: "btn btn-text",
            type: "button",
            onClick: w
          }, n(t(b)("settings.cancel")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: i.value || !($.value || l.value),
            onClick: f
          }, n(t(b)("settings.pathUse")), 9, np)
        ])
      ]),
      _: 1
    }, 8, ["open", "title"]));
  }
}), op = /* @__PURE__ */ Oe(lp, [["__scopeId", "data-v-580db486"]]), it = x([]);
let ap = 0;
const bt = /* @__PURE__ */ new Map();
function ip(g) {
  const s = bt.get(g);
  s && clearTimeout(s), bt.delete(g), it.value = it.value.filter((h) => h.id !== g);
}
function Ht(g, s = "info", h) {
  const d = {
    id: ++ap,
    kind: s,
    message: g,
    duration: s === "error" ? 6500 : 3500
  };
  return it.value = [...it.value.slice(-4), d], bt.set(d.id, setTimeout(() => ip(d.id), d.duration)), d.id;
}
function rp() {
  const { t: g } = ye(), { confirm: s } = st(), h = dt(), d = ws(), b = Yt(), $ = $s(), p = Xt(), y = Z(() => b.settingsTabs.map((N) => ({
    id: N.id,
    icon: N.icon || "chip"
  }))), C = Z(() => {
    const N = new Set(b.settingsTabs.map((Y) => Y.id)), X = new Set(b.removedSettingsIds);
    return d.sections.filter((Y) => Y.id !== "permissions" && !N.has(Y.id) && !X.has(Y.id)).map((Y) => ({ id: Y.id, icon: Y.icon || "lock" }));
  }), i = Z(() => [...y.value, ...C.value]), o = Z(() => [
    { id: "core", label: g("settings.groupCore"), tabs: y.value },
    { id: "plugins", label: g("settings.groupPlugins"), tabs: C.value }
  ].filter((N) => N.tabs.length)), l = x($.query.tab || "general"), a = x(!1), c = x([]), v = x(""), w = x({}), f = x(""), E = x("ok"), U = x(!1), H = typeof window < "u" && !!window.okayDesktop?.isDesktop;
  async function R() {
    try {
      await window.okayDesktop?.openSettings?.();
    } catch {
    }
  }
  const I = x(!1), M = x(!1), T = x(!1), J = x("");
  function ve() {
    J.value = "", M.value = !0;
  }
  function ae() {
    T.value || (M.value = !1);
  }
  async function K() {
    if (!T.value) {
      T.value = !0, J.value = "";
      try {
        const N = await fetch("/api/agent/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: g("settings.evolveSessionTitle") })
        });
        if (!N.ok) throw new Error(`HTTP ${N.status}`);
        const X = await N.json(), Y = X?.session_id || X?.id;
        if (!Y) throw new Error(g("settings.evolveNoSession"));
        const q = await fetch("/api/agent/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: Y,
            prompt: g("settings.evolvePrompt"),
            agent_type: "general"
          })
        });
        if (!q.ok) throw new Error(`HTTP ${q.status}`);
        M.value = !1, J.value = g("settings.evolveStarted");
      } catch (N) {
        J.value = N instanceof Error ? N.message : String(N);
      } finally {
        T.value = !1;
      }
    }
  }
  const j = x(""), z = x(!1), B = x([]), F = Z(() => g("settings.modelAuto")), Ve = Z(() => [
    { value: "", label: F.value },
    ...B.value.map((N) => ({ value: N, label: N }))
  ]);
  async function Te() {
    try {
      const N = await fetch("/api/models");
      if (!N.ok) return;
      const X = await N.json();
      B.value = Array.from(new Set((X.models || []).map((Y) => String(Y.id || "")).filter(Boolean)));
    } catch {
    }
  }
  async function he(N) {
    I.value = !0, j.value = "";
    try {
      const X = await fetch(`/api/settings/${N}/test`, { method: "POST" }), Y = X.headers.get("content-type") || "";
      if (X.ok && Y.startsWith("audio")) {
        const q = URL.createObjectURL(await X.blob());
        try {
          await new Audio(q).play();
        } catch {
        }
        window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: q } })), j.value = g("settings.testSuccess");
      } else {
        const q = await X.json().catch(() => ({}));
        j.value = q.error || `HTTP ${X.status}`;
      }
    } catch (X) {
      j.value = X instanceof Error ? X.message : String(X);
    } finally {
      I.value = !1;
    }
  }
  const { tabMeta: Ee, isBuiltinTab: Pe, isPluginSection: xe, tabLabel: te, fieldLabel: me, fieldHelp: Ae, pluginSection: Se } = yt(), pe = x(""), Me = Z({
    get: () => pe.value !== "",
    set: (N) => {
      N || (pe.value = "");
    }
  }), fe = Z(() => Se(l.value)?.fields.find((X) => X.key === pe.value)?.label || ""), se = Z(() => String(w.value[l.value]?.[pe.value] ?? ""));
  function Ke(N) {
    const X = pe.value;
    X && (w.value = {
      ...w.value,
      [l.value]: { ...w.value[l.value], [X]: N }
    });
  }
  const Q = Z(() => Pe(l.value) ? null : Ee(l.value)?.module || null);
  function L(N) {
    if (Ee(N)?.fields?.length && !Pe(N)) {
      ie(N);
      return;
    }
    const Y = Se(N);
    if (!Y) return;
    const q = {};
    for (const ce of Y.fields)
      ce.type !== "note" && (ce.type === "bool" ? q[ce.key] = ce.default_value === "true" || ce.default_value === "1" : ce.type === "number" ? q[ce.key] = Number(ce.default_value || 0) : q[ce.key] = ce.default_value || "");
    const Ue = d.values[N] || {}, ge = { ...q };
    for (const ce of Y.fields) {
      if (!(ce.key in Ue)) continue;
      const Fe = Ue[ce.key];
      ce.type === "bool" ? ge[ce.key] = Fe === !0 || Fe === "true" || Fe === 1 || Fe === "1" : ge[ce.key] = Fe;
    }
    w.value = {
      ...w.value,
      [N]: ge
    };
  }
  async function ie(N) {
    const X = Ee(N);
    if (!X?.fields?.length) return;
    const Y = {};
    for (const q of X.fields)
      q.type === "bool" ? Y[q.key] = q.default_value === "true" || q.default_value === "1" : q.type === "number" ? Y[q.key] = Number(q.default_value || 0) : Y[q.key] = q.default_value || "";
    if (X.loadApi)
      try {
        const q = await fetch(X.loadApi);
        if (q.ok) {
          const Ue = await q.json();
          for (const ge of X.fields) {
            if (!(ge.key in Ue)) continue;
            const ce = Ue[ge.key];
            ge.type === "bool" ? Y[ge.key] = ce === !0 || ce === "true" || ce === 1 || ce === "1" : Y[ge.key] = ce;
          }
        }
      } catch {
      }
    w.value = { ...w.value, [N]: Y };
  }
  async function Ie(N) {
    const X = Ee(N);
    if (!U.value) {
      U.value = !0, f.value = "";
      try {
        const Y = w.value[N] || {};
        if (X?.saveApi) {
          const q = await fetch(X.saveApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Y)
          });
          if (!q.ok) throw new Error(String(q.status));
        }
        f.value = g("settings.saved"), E.value = "ok", setTimeout(() => {
          f.value = "";
        }, 3e3);
      } catch {
        f.value = g("settings.permFailed"), E.value = "error";
      } finally {
        U.value = !1;
      }
    }
  }
  async function Qe(N) {
    if (!U.value) {
      U.value = !0, f.value = "";
      try {
        const X = new Set((Se(N)?.fields || []).filter((q) => q.type === "note").map((q) => q.key)), Y = Object.fromEntries(
          Object.entries(w.value[N] || {}).filter(([q]) => !X.has(q))
        );
        await d.saveValues(N, Y), f.value = g("settings.saved"), E.value = "ok", setTimeout(() => {
          f.value = "";
        }, 3e3);
      } catch {
        f.value = g("settings.permFailed"), E.value = "error";
      } finally {
        U.value = !1;
      }
    }
  }
  async function Xe() {
    try {
      const N = await fetch("/api/live2d");
      if (N.ok) {
        const X = await N.json();
        c.value = X.models || [];
      }
    } catch {
      c.value = [];
    }
  }
  async function k(N) {
    if (await s({
      title: g("settings.live2d"),
      message: g("settings.deleteModelConfirm", { label: N.label }),
      confirmLabel: g("common.delete"),
      danger: !0
    }))
      try {
        const Y = await fetch(`/api/live2d/${encodeURIComponent(N.id)}`, { method: "DELETE" });
        if (!Y.ok) throw new Error(await Y.text());
        const q = await Y.json();
        c.value = q.models || [];
        const Ue = N.url.slice(0, N.url.indexOf("/", 15) + 1);
        h.live2d.modelUrl.startsWith(Ue) && (h.live2d.modelUrl = "", h.live2d.enabled = !1, h.saveToStorage()), await P(), v.value = g("settings.modelDeleted"), window.dispatchEvent(new Event("live2d-models-changed"));
      } catch (Y) {
        v.value = Y.message;
      }
  }
  async function P() {
    h.saveToStorage();
    const N = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: h.live2d.enabled, model_url: h.live2d.modelUrl } }) });
    if (!N.ok) throw new Error(await N.text());
  }
  async function S() {
    if (!z.value) {
      z.value = !0, v.value = "";
      try {
        await P(), v.value = g("settings.saved"), setTimeout(() => {
          v.value === g("settings.saved") && (v.value = "");
        }, 3e3);
      } catch (N) {
        v.value = N.message, Ht(g("settings.permFailed"), "error");
      } finally {
        z.value = !1;
      }
    }
  }
  async function ne(N) {
    if (!(!N || N.length === 0)) {
      v.value = "";
      try {
        const X = new FormData(), Y = [];
        for (const ge of Array.from(N)) {
          const ce = ge.webkitRelativePath || ge.name;
          Y.push(ce), X.append("files", ge, ge.name);
        }
        X.append("paths", JSON.stringify(Y));
        const q = await fetch("/api/live2d", { method: "POST", body: X });
        if (!q.ok) throw new Error(await q.text());
        const Ue = await q.json();
        v.value = g("settings.uploadOk"), Ue?.models ? c.value = Ue.models : await Xe(), Ue?.model_url && (h.live2d.modelUrl = Ue.model_url, h.live2d.enabled = !0, h.saveToStorage(), await P(), window.dispatchEvent(new Event("live2d-models-changed")));
      } catch (X) {
        v.value = `${g("settings.uploadFail")}：${X.message}`;
      }
    }
  }
  De(async () => {
    h.loadFromStorage(), Xe(), Te(), await d.fetchSections();
    for (const N of d.sections) L(N.id);
    d.sections.length && !i.value.some((N) => N.id === l.value) && !Pe(l.value) && (l.value = "general");
  });
  function ke(N) {
    l.value = N, Pe(N) || L(N), p.replace({ query: { tab: N } });
  }
  function we() {
    if (h.saveToStorage(), l.value === "live2d") {
      P().then(() => {
        a.value = !0, setTimeout(() => {
          a.value = !1;
        }, 1500);
      }).catch((N) => {
        v.value = N.message, Ht(g("settings.permFailed"), "error");
      });
      return;
    }
    a.value = !0, setTimeout(() => {
      a.value = !1;
    }, 1500);
  }
  return {
    wizard: h,
    sectionsStore: d,
    uiPatches: b,
    route: $,
    router: p,
    tabs: y,
    pluginOnlyTabs: C,
    allTabs: i,
    navGroups: o,
    activeTab: l,
    saved: a,
    uploadedModels: c,
    uploadMsg: v,
    sectionDrafts: w,
    sectionMsg: f,
    sectionMsgKind: E,
    sectionSaving: U,
    sectionTesting: I,
    isDesktop: H,
    openDesktopSettings: R,
    evolveDialog: M,
    evolveBusy: T,
    evolveMsg: J,
    openEvolveDialog: ve,
    closeEvolveDialog: ae,
    confirmEvolve: K,
    sectionTestMsg: j,
    live2dSaving: z,
    availableModels: B,
    modelAutoLabel: F,
    modelOptions: Ve,
    loadAvailableModels: Te,
    testPluginSection: he,
    pickerField: pe,
    pickerOpen: Me,
    pickerTitle: fe,
    pickerInitial: se,
    applyPickedPath: Ke,
    moduleTab: Q,
    loadSectionDraft: L,
    loadPatchFields: ie,
    savePatchFields: Ie,
    saveSection: Qe,
    loadUploadedModels: Xe,
    deleteModel: k,
    saveLive2D: P,
    saveLive2DNow: S,
    onFolderSelected: ne,
    selectTab: ke,
    save: we,
    t: g,
    confirm: s,
    tabMeta: Ee,
    isBuiltinTab: Pe,
    isPluginSection: xe,
    tabLabel: te,
    fieldLabel: me,
    fieldHelp: Ae,
    pluginSection: Se
  };
}
const dp = { class: "settings-page" }, cp = { class: "page-header" }, up = { class: "subtitle" }, pp = { key: 0 }, hp = { key: 1 }, vp = { class: "settings-layout" }, mp = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, fp = { class: "nav-group" }, gp = ["aria-current", "data-tab-id", "title", "aria-label", "onClick"], bp = {
  class: "nav-icon",
  "aria-hidden": "true"
}, _p = { class: "nav-label" }, yp = ["title"], kp = {
  class: "nav-icon",
  "aria-hidden": "true"
}, wp = { class: "nav-label" }, $p = { class: "settings-content" }, Sp = {
  key: "provider",
  class: "tab-stack"
}, Cp = {
  key: 0,
  class: "content-card provider-runtime"
}, Pp = {
  key: 0,
  class: "helper-text"
}, xp = { class: "actions-row" }, Mp = ["disabled"], Ep = {
  key: 0,
  class: "card-desc"
}, Up = {
  key: 1,
  class: "helper-text"
}, Tp = { class: "actions-row" }, Ap = ["disabled"], Ip = {
  key: 0,
  class: "helper-text"
}, Np = {
  key: 0,
  class: "helper-text"
}, Vp = { class: "actions-row" }, Lp = ["disabled"], Rp = {
  key: 0,
  class: "helper-text"
}, Op = {
  key: 0,
  class: "helper-text"
}, Dp = { class: "actions-row" }, zp = ["disabled"], Fp = {
  key: 0,
  class: "card-desc"
}, Bp = {
  key: 1,
  class: "card-desc"
}, Kp = { class: "actions-row" }, Hp = ["disabled"], jp = {
  key: "unknown",
  class: "content-card tab-unknown"
}, Yp = ["aria-label"], Xp = { class: "dialog-card" }, Jp = { class: "helper-text" }, Wp = { class: "helper-text" }, qp = {
  key: 0,
  class: "helper-text msg-error"
}, Gp = { class: "actions-row" }, Zp = ["disabled"], Qp = ["disabled"], oh = /* @__PURE__ */ _e({
  __name: "SettingsPage",
  setup(g) {
    const {
      wizard: s,
      navGroups: h,
      activeTab: d,
      saved: b,
      uploadedModels: $,
      uploadMsg: p,
      sectionDrafts: y,
      sectionMsg: C,
      sectionMsgKind: i,
      sectionSaving: o,
      sectionTesting: l,
      sectionTestMsg: a,
      live2dSaving: c,
      availableModels: v,
      modelOptions: w,
      testPluginSection: f,
      isDesktop: E,
      openDesktopSettings: U,
      evolveDialog: H,
      evolveBusy: R,
      evolveMsg: I,
      openEvolveDialog: M,
      closeEvolveDialog: T,
      confirmEvolve: J,
      pickerField: ve,
      pickerOpen: ae,
      pickerTitle: K,
      pickerInitial: j,
      applyPickedPath: z,
      moduleTab: B,
      savePatchFields: F,
      saveSection: Ve,
      deleteModel: Te,
      saveLive2DNow: he,
      onFolderSelected: Ee,
      selectTab: Pe,
      save: xe,
      t: te,
      tabMeta: me,
      isBuiltinTab: Ae,
      isPluginSection: Se,
      tabLabel: pe,
      fieldLabel: Me,
      fieldHelp: fe,
      pluginSection: se
    } = rp();
    return (Ke, Q) => (r(), u("div", dp, [
      e("header", cp, [
        e("div", null, [
          e("h1", null, n(t(te)("settings.title")), 1),
          e("p", up, n(t(te)("settings.pageDesc")), 1)
        ]),
        t(d) === "persona" || t(d) === "live2d" ? (r(), u("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: Q[0] || (Q[0] = //@ts-ignore
          (...L) => t(xe) && t(xe)(...L))
        }, [
          t(b) ? (r(), u("span", pp, n(t(te)("settings.saved")), 1)) : (r(), u("span", hp, n(t(te)("settings.save")), 1))
        ])) : V("", !0)
      ]),
      e("div", vp, [
        e("nav", mp, [
          (r(!0), u(G, null, de(t(h), (L) => (r(), u(G, {
            key: L.id
          }, [
            e("p", fp, n(L.label), 1),
            (r(!0), u(G, null, de(L.tabs, (ie) => (r(), u("button", {
              key: ie.id,
              class: oe(["nav-item", { active: t(d) === ie.id }]),
              "aria-current": t(d) === ie.id ? "true" : void 0,
              "data-tab-id": ie.id,
              title: t(pe)(ie.id),
              "aria-label": t(pe)(ie.id),
              onClick: (Ie) => t(Pe)(ie.id)
            }, [
              Q[12] || (Q[12] = e("span", { class: "nav-indicator" }, null, -1)),
              e("span", bp, [
                be(t(Dt), {
                  name: ie.icon || "chip",
                  size: 20
                }, null, 8, ["name"])
              ]),
              e("span", _p, n(t(pe)(ie.id)), 1)
            ], 10, gp))), 128))
          ], 64))), 128)),
          t(E) ? (r(), u("button", {
            key: 0,
            class: "nav-item nav-desktop",
            type: "button",
            title: t(te)("settings.desktopTitle"),
            onClick: Q[1] || (Q[1] = //@ts-ignore
            (...L) => t(U) && t(U)(...L))
          }, [
            Q[13] || (Q[13] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", kp, [
              be(t(Dt), {
                name: "chip",
                size: 20
              })
            ]),
            e("span", wp, n(t(te)("settings.desktopTitle")), 1)
          ], 8, yp)) : V("", !0)
        ]),
        e("section", $p, [
          be(us, {
            name: "tab",
            mode: "out-in"
          }, {
            default: ot(() => [
              t(d) === "general" ? (r(), $e(cr, { key: "general" })) : t(d) === "connection" ? (r(), $e(ud, { key: "connection" })) : t(d) === "provider" ? (r(), u("div", Sp, [
                be(Wi),
                t(se)("provider")?.fields?.length ? (r(), u("div", Cp, [
                  e("h3", null, n(t(se)("provider").label), 1),
                  t(se)("provider").description ? (r(), u("p", Pp, n(t(se)("provider").description), 1)) : V("", !0),
                  (r(!0), u(G, null, de(t(se)("provider").fields, (L) => (r(), $e(gt, {
                    key: L.key,
                    field: L,
                    label: L.label,
                    help: L.help,
                    "model-value": t(y).provider?.[L.key],
                    "section-id": "provider",
                    "model-options": t(w),
                    "available-models": t(v),
                    "onUpdate:modelValue": (ie) => y.value = { ...t(y), provider: { ...t(y).provider, [L.key]: ie } },
                    onBrowse: (ie) => ve.value = L.key
                  }, null, 8, ["field", "label", "help", "model-value", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                  t(C) ? (r(), u("div", {
                    key: 1,
                    class: oe(["helper-text", t(i) === "error" ? "msg-error" : "msg-success"]),
                    role: "status"
                  }, n(t(C)), 3)) : V("", !0),
                  e("div", xp, [
                    e("button", {
                      class: "btn btn-primary",
                      type: "button",
                      disabled: t(o),
                      onClick: Q[2] || (Q[2] = (L) => t(Ve)("provider"))
                    }, n(t(te)("settings.save")), 9, Mp)
                  ])
                ])) : V("", !0)
              ])) : t(d) === "persona" ? (r(), $e(Ed, { key: 3 })) : t(d) === "live2d" ? (r(), $e(qs, {
                key: "live2d",
                enabled: t(s).live2d.enabled,
                "model-url": t(s).live2d.modelUrl,
                uploaded: t($),
                msg: t(p),
                saving: t(c),
                "onUpdate:enabled": Q[3] || (Q[3] = (L) => t(s).live2d.enabled = L),
                "onUpdate:modelUrl": Q[4] || (Q[4] = (L) => t(s).live2d.modelUrl = L),
                onSave: t(he),
                onUpload: t(Ee),
                onDelete: t(Te)
              }, null, 8, ["enabled", "model-url", "uploaded", "msg", "saving", "onSave", "onUpload", "onDelete"])) : t(d) === "security" ? (r(), $e(Cc, { key: 5 })) : t(d) === "permissions" ? (r(), $e(Fd, { key: 6 })) : t(d) === "mcp" ? (r(), $e(Iu, { key: 7 })) : t(d) === "life_settings" ? (r(), $e(_l, { key: 8 })) : t(Se)(t(d)) && t(se)(t(d)) ? (r(), u("div", {
                key: `section-${t(d)}`,
                class: "content-card"
              }, [
                e("h2", null, n(t(se)(t(d)).label), 1),
                t(se)(t(d)).description ? (r(), u("p", Ep, n(t(se)(t(d)).description), 1)) : V("", !0),
                t(se)(t(d)).plugin_name && t(se)(t(d)).plugin_name !== t(d) ? (r(), u("p", Up, n(t(te)("settings.pluginProvidedBy", { name: t(se)(t(d)).plugin_name })), 1)) : V("", !0),
                (r(!0), u(G, null, de(t(se)(t(d)).fields.filter((L) => L.type !== "test"), (L) => (r(), $e(gt, {
                  key: L.key,
                  field: L,
                  label: L.label,
                  help: L.help,
                  "model-value": t(y)[t(d)]?.[L.key],
                  "section-id": t(d),
                  "model-options": t(w),
                  "available-models": t(v),
                  "onUpdate:modelValue": (ie) => t(y)[t(d)] = { ...t(y)[t(d)], [L.key]: ie },
                  onBrowse: (ie) => ve.value = L.key
                }, null, 8, ["field", "label", "help", "model-value", "section-id", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                (r(!0), u(G, null, de(t(se)(t(d)).fields.filter((L) => L.type === "test"), (L) => (r(), u("div", {
                  key: L.key,
                  class: "field"
                }, [
                  e("label", null, n(L.label), 1),
                  e("div", Tp, [
                    e("button", {
                      class: "btn btn-tonal",
                      type: "button",
                      disabled: t(l),
                      onClick: Q[5] || (Q[5] = (ie) => t(f)(t(d)))
                    }, n(t(l) ? t(te)("settings.testing") : L.label || t(te)("settings.test")), 9, Ap),
                    t(a) ? (r(), u("span", Ip, n(t(a)), 1)) : V("", !0)
                  ]),
                  L.help ? (r(), u("p", Np, n(L.help), 1)) : V("", !0)
                ]))), 128)),
                (r(!0), u(G, null, de(t(se)(t(d)).fields.filter((L) => L.type === "action"), (L) => (r(), u("div", {
                  key: L.key,
                  class: "field"
                }, [
                  e("label", null, n(L.label), 1),
                  e("div", Vp, [
                    e("button", {
                      class: "btn btn-tonal",
                      type: "button",
                      disabled: t(R) || String(t(y)[t(d)]?.self_evolve_enabled) !== "true",
                      onClick: Q[6] || (Q[6] = //@ts-ignore
                      (...ie) => t(M) && t(M)(...ie))
                    }, n(L.label), 9, Lp),
                    t(I) ? (r(), u("span", Rp, n(t(I)), 1)) : V("", !0)
                  ]),
                  L.help ? (r(), u("p", Op, n(L.help), 1)) : V("", !0)
                ]))), 128)),
                t(C) ? (r(), u("div", {
                  key: 2,
                  class: oe(["helper-text", t(i) === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, n(t(C)), 3)) : V("", !0),
                e("div", Dp, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: t(o),
                    onClick: Q[7] || (Q[7] = (L) => t(Ve)(t(d)))
                  }, n(t(te)("settings.save")), 9, zp)
                ])
              ])) : t(B) ? (r(), $e(Bu, {
                key: t(B),
                module: t(B) || ""
              }, null, 8, ["module"])) : !t(Ae)(t(d)) && t(me)(t(d))?.fields?.length ? (r(), u("div", {
                key: `patch-${t(d)}`,
                class: "content-card"
              }, [
                e("h2", null, n(t(pe)(t(d))), 1),
                t(me)(t(d))?.descriptionKey ? (r(), u("p", Fp, n(t(te)(t(me)(t(d)).descriptionKey)), 1)) : t(me)(t(d))?.description ? (r(), u("p", Bp, n(t(me)(t(d)).description), 1)) : V("", !0),
                (r(!0), u(G, null, de(t(me)(t(d)).fields, (L) => (r(), $e(gt, {
                  key: L.key,
                  field: L,
                  label: t(Me)(t(me)(t(d)), L.key, `settings.${L.key}`),
                  help: t(fe)(t(me)(t(d)), L.key, `settings.${L.key}Desc`),
                  "model-value": t(y)[t(d)]?.[L.key],
                  "section-id": t(d),
                  "model-options": t(w),
                  "available-models": t(v),
                  "onUpdate:modelValue": (ie) => t(y)[t(d)] = { ...t(y)[t(d)], [L.key]: ie },
                  onBrowse: (ie) => ve.value = L.key
                }, null, 8, ["field", "label", "help", "model-value", "section-id", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                t(C) ? (r(), u("div", {
                  key: 2,
                  class: oe(["helper-text", t(i) === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, n(t(C)), 3)) : V("", !0),
                e("div", Kp, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: t(o),
                    onClick: Q[8] || (Q[8] = (L) => t(F)(t(d)))
                  }, n(t(te)("settings.save")), 9, Hp)
                ])
              ])) : t(d) === "about" ? (r(), $e(Po, { key: "about" })) : t(d) === "updates" ? (r(), $e(ga, { key: "updates" })) : t(d) === "danger" ? (r(), $e(Ou, { key: "danger" })) : (r(), u("div", jp, [
                e("p", null, n(t(te)("settings.tabNotFound")), 1)
              ]))
            ]),
            _: 1
          })
        ])
      ]),
      be(op, {
        open: t(ae),
        "onUpdate:open": Q[9] || (Q[9] = (L) => ps(ae) ? ae.value = L : null),
        initial: t(j),
        title: t(K),
        onPick: t(z)
      }, null, 8, ["open", "initial", "title", "onPick"]),
      t(H) ? (r(), u("div", {
        key: 0,
        class: "dialog-veil",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t(te)("settings.evolveConfirmTitle")
      }, [
        e("div", Xp, [
          e("h2", null, n(t(te)("settings.evolveConfirmTitle")), 1),
          e("p", Jp, n(t(te)("settings.evolveConfirmBody")), 1),
          e("ul", Wp, [
            e("li", null, n(t(te)("settings.evolveBoundaryWorktree")), 1),
            e("li", null, n(t(te)("settings.evolveBoundaryMain")), 1),
            e("li", null, n(t(te)("settings.evolveBoundaryTests")), 1)
          ]),
          t(I) ? (r(), u("p", qp, n(t(I)), 1)) : V("", !0),
          e("div", Gp, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              disabled: t(R),
              onClick: Q[10] || (Q[10] = //@ts-ignore
              (...L) => t(T) && t(T)(...L))
            }, n(t(te)("settings.cancel")), 9, Zp),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: t(R),
              onClick: Q[11] || (Q[11] = //@ts-ignore
              (...L) => t(J) && t(J)(...L))
            }, n(t(R) ? t(te)("settings.evolveStarting") : t(te)("settings.evolveConfirmAction")), 9, Qp)
          ])
        ])
      ], 8, Yp)) : V("", !0)
    ]));
  }
});
export {
  oh as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style-settings')){const s=document.createElement('style');s.id='webui-plugin-style-settings';s.textContent="@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage.bare[data-v-d05720d4],.live2d-stage.bare .stage-viewport[data-v-d05720d4]{background:none!important;border:0!important;border-radius:0!important;min-height:0}.live2d-stage.bare .stage-gradient[data-v-d05720d4],.live2d-stage.bare .stage-hint[data-v-d05720d4],.live2d-stage.bare .stage-reset[data-v-d05720d4]{display:none!important}.live2d-stage[data-v-d05720d4]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-d05720d4]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-d05720d4]:active{cursor:grabbing}.stage-canvas[data-v-d05720d4]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-d05720d4]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-d05720d4]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-d05720d4]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-d05720d4]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-d05720d4]:active{transform:scale(.96)}.stage-reset.dragging[data-v-d05720d4]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-d05720d4]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-d05720d4]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-d05720d4]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.life-settings[data-v-d91bdafc]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-d91bdafc]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-d91bdafc .52s var(--ls-spring) both}.ls-hero-main[data-v-d91bdafc]{min-width:0}.ls-eyebrow[data-v-d91bdafc]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-d91bdafc]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-d91bdafc]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-d91bdafc]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-d91bdafc]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-d91bdafc]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-d91bdafc]{font-size:16px}.ls-grid[data-v-d91bdafc]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-d91bdafc]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-d91bdafc .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-d91bdafc]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-d91bdafc]{grid-column:1 / -1}.ls-card-head[data-v-d91bdafc]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-d91bdafc]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-d91bdafc]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-d91bdafc]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d91bdafc]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d91bdafc]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-d91bdafc]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-d91bdafc]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-d91bdafc]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-d91bdafc]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-d91bdafc]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-d91bdafc]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-d91bdafc]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-d91bdafc]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-d91bdafc]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-d91bdafc]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-d91bdafc]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-d91bdafc]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-d91bdafc]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-d91bdafc]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-d91bdafc]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-d91bdafc]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-d91bdafc]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-d91bdafc]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-d91bdafc]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-d91bdafc]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-d91bdafc]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-d91bdafc]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-d91bdafc]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-d91bdafc]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-d91bdafc]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-d91bdafc]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-d91bdafc]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-d91bdafc]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}#app .ls-model[data-v-d91bdafc]{border-radius:20px}#app .ls-model.selected[data-v-d91bdafc]{border-radius:20px 20px 20px 8px}.ls-model b[data-v-d91bdafc]{font-size:13px;word-break:break-all}.ls-model span[data-v-d91bdafc]{font-size:12px;color:var(--md-on-surface-variant)}.ls-hint[data-v-d91bdafc]{margin:12px 0 0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.ls-state[data-v-d91bdafc]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-d91bdafc .32s var(--ls-spring) both}@keyframes ls-rise-d91bdafc{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-d91bdafc{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-d91bdafc],.ls-row[data-v-d91bdafc],.ls-models[data-v-d91bdafc]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-d91bdafc],.ls-card[data-v-d91bdafc],.ls-state[data-v-d91bdafc]{animation:none}}.about[data-v-2678e07b]{display:flex;flex-direction:column;gap:26px}.identity[data-v-2678e07b]{display:flex;align-items:center;gap:16px}.app-icon[data-v-2678e07b]{flex:none;width:56px;height:56px;filter:drop-shadow(0 6px 16px color-mix(in srgb,var(--md-primary) 25%,transparent))}.app-id[data-v-2678e07b]{flex:1;min-width:0}.app-id h2[data-v-2678e07b]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-2678e07b]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-2678e07b]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-2678e07b]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-2678e07b]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-2678e07b]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-2678e07b]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-2678e07b]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.credits[data-v-2678e07b]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-2678e07b]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-2678e07b]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-2678e07b]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-2678e07b]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-2678e07b]{font-size:16px;font-weight:650}.person-info .role[data-v-2678e07b]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-2678e07b]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-2678e07b]{margin-top:6px}.contribs[data-v-2678e07b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-2678e07b]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-2678e07b]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-2678e07b]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-2678e07b]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-2678e07b]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-2678e07b]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-2678e07b]{margin-left:auto}.status-chip[data-v-2678e07b]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-2678e07b]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-2678e07b]:hover{text-decoration:underline}.muted[data-v-2678e07b]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-2678e07b]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-2678e07b]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-hero.warn[data-v-2678e07b]{background:var(--md-warning-container);color:var(--md-on-warning-container);border-color:transparent}.us-hero.none[data-v-2678e07b]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-2678e07b]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-2678e07b]{flex:1;min-width:0}.us-hero-text b[data-v-2678e07b]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-2678e07b]{font-size:13px;opacity:.85}.us-hero-text em[data-v-2678e07b]{font-style:normal;font-weight:700}.us-hero-actions[data-v-2678e07b]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-2678e07b]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-2678e07b]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-2678e07b]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-2678e07b]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-2678e07b]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-2678e07b]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-apply-banner.failed[data-v-2678e07b]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-2678e07b]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-2678e07b]{font-weight:700}.us-apply-label[data-v-2678e07b]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-2678e07b]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-2678e07b]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-2678e07b]{animation:us-spin-2678e07b .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-2678e07b],.us-apply-banner.failed .us-spinner[data-v-2678e07b]{display:none}.us-apply-log[data-v-2678e07b],.us-apply-error[data-v-2678e07b]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-2678e07b{to{transform:rotate(360deg)}}.alert[data-v-2678e07b]{color:var(--md-error)}.updates[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-bc3fb39c]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-bc3fb39c]{display:flex;align-items:center;gap:12px}.us-ico[data-v-bc3fb39c]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-bc3fb39c]{flex:1;min-width:0}.us-title[data-v-bc3fb39c]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-bc3fb39c]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px}.us-tag[data-v-bc3fb39c]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-bc3fb39c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-bc3fb39c]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-bc3fb39c]{background:#ffdf9e;color:#4a3800}.us-source[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-bc3fb39c]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-bc3fb39c]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-bc3fb39c]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-bc3fb39c]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-bc3fb39c]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-bc3fb39c]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-bc3fb39c]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-bc3fb39c]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-bc3fb39c]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-bc3fb39c]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-bc3fb39c]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-bc3fb39c]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-bc3fb39c]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-bc3fb39c]{flex:1;min-width:0}.us-hero-text b[data-v-bc3fb39c]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-bc3fb39c]{font-size:13px;opacity:.85}.us-hero-text em[data-v-bc3fb39c]{font-style:normal;font-weight:700}.us-hero-actions[data-v-bc3fb39c]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-bc3fb39c]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-bc3fb39c]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-bc3fb39c]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-bc3fb39c]{font-weight:700}.us-apply-label[data-v-bc3fb39c]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-bc3fb39c]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-bc3fb39c]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-bc3fb39c]{animation:us-spin-bc3fb39c .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-bc3fb39c],.us-apply-banner.failed .us-spinner[data-v-bc3fb39c]{display:none}.us-apply-log[data-v-bc3fb39c],.us-apply-error[data-v-bc3fb39c]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-bc3fb39c{to{transform:rotate(360deg)}}.us-table[data-v-bc3fb39c]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-bc3fb39c]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-bc3fb39c]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-bc3fb39c]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-bc3fb39c]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden}.us-name-text[data-v-bc3fb39c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-bc3fb39c]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-bc3fb39c]{background:var(--md-success)}.us-dot.warn[data-v-bc3fb39c]{background:#e0a800}.us-dot.bad[data-v-bc3fb39c]{background:var(--md-error)}.us-ver[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-bc3fb39c]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-bc3fb39c]{font-weight:650}.us-ver b.good[data-v-bc3fb39c]{color:var(--md-success)}.us-arrow[data-v-bc3fb39c]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-bc3fb39c]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden}.us-status-text[data-v-bc3fb39c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-bc3fb39c]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-bc3fb39c]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-bc3fb39c]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-bc3fb39c]:hover{text-decoration:underline}.us-empty[data-v-bc3fb39c]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-bc3fb39c]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-bc3fb39c]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.alert[data-v-bc3fb39c]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-bc3fb39c]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-bc3fb39c]{display:none}.us-hero[data-v-bc3fb39c]{flex-wrap:wrap}.us-hero-actions[data-v-bc3fb39c]{width:100%}}.provider-panel[data-v-d10cd596]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-d10cd596]{display:flex;align-items:center;gap:14px}.pp-back[data-v-d10cd596]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-d10cd596]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-d10cd596]{flex:1;min-width:0}.pp-editor-title h2[data-v-d10cd596]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-d10cd596]{margin:3px 0 0}.pp-section[data-v-d10cd596]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-d10cd596]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-d10cd596]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-d10cd596]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-d10cd596]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-d10cd596]{margin-bottom:0}.pp-span[data-v-d10cd596]{grid-column:1 / -1}.pp-req[data-v-d10cd596]{color:var(--md-error);margin-left:2px}.pp-key[data-v-d10cd596]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-d10cd596]{flex:1}.pp-key-toggle[data-v-d10cd596]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-d10cd596]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-d10cd596]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-d10cd596]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-d10cd596]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-d10cd596]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-d10cd596]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-d10cd596]{animation:pp-pulse-d10cd596 1s ease-in-out infinite}@keyframes pp-pulse-d10cd596{50%{opacity:.15}}.pp-probe[data-v-d10cd596]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-d10cd596]{color:var(--md-success)}.pp-probe.err[data-v-d10cd596]{color:var(--md-error)}.pp-discovered[data-v-d10cd596]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-d10cd596]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-d10cd596]{flex:1;min-width:160px}.pp-mini[data-v-d10cd596]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-d10cd596]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-add-model[data-v-d10cd596]{display:flex;align-items:center;gap:8px;margin-top:8px}.pp-add-model .input[data-v-d10cd596]{flex:1;min-width:0}.pp-add-model .btn[data-v-d10cd596]{flex:none;white-space:nowrap}.pp-add-error[data-v-d10cd596]{color:var(--md-error)}.pp-remove[data-v-d10cd596]{flex:none;width:26px;height:26px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);font-size:17px;line-height:1;cursor:pointer}.pp-remove[data-v-d10cd596]:hover{background:color-mix(in srgb,var(--md-error) 14%,transparent);color:var(--md-error)}.pp-models[data-v-d10cd596]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-d10cd596]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-d10cd596]:first-child{border-top:0}.pp-model.off[data-v-d10cd596]{opacity:.5}.pp-model-name[data-v-d10cd596]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-d10cd596]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-d10cd596]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-d10cd596]{color:#e0a800;cursor:default}.pp-switch[data-v-d10cd596]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-d10cd596]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-d10cd596]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-d10cd596]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-d10cd596]{display:flex;gap:10px}.pp-list-head[data-v-d10cd596]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-d10cd596]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-d10cd596]{margin:3px 0 0}.pp-list-actions[data-v-d10cd596]{display:flex;gap:8px}.pp-cards[data-v-d10cd596]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:14px}.pp-kinds[data-v-d10cd596]{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 12px}.pp-kind[data-v-d10cd596]{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);font-size:13px;font-weight:600;line-height:1}.pp-kind[data-v-d10cd596]:hover{border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));color:var(--md-on-surface)}.pp-kind.active[data-v-d10cd596]{background:var(--md-secondary-container);border-color:transparent;color:var(--md-on-secondary-container)}.pp-kind-count[data-v-d10cd596]{min-width:18px;padding:1px 5px;border-radius:999px;background:color-mix(in srgb,currentColor 12%,transparent);font-size:11px;font-weight:700;text-align:center}.pp-card[data-v-d10cd596]{display:flex;flex-direction:column;gap:12px;padding:16px;min-width:0;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-d10cd596]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-d10cd596]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-d10cd596]{opacity:.62}.pp-card-head[data-v-d10cd596]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-d10cd596]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-d10cd596]{width:26px;height:26px}.pp-card-id[data-v-d10cd596]{flex:1;min-width:0}.pp-card-id strong[data-v-d10cd596]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-d10cd596]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-d10cd596]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-d10cd596]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-d10cd596]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-d10cd596]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-d10cd596]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-d10cd596]{color:var(--md-error)}.pp-chips[data-v-d10cd596]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-d10cd596]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-d10cd596],.pp-chip.empty[data-v-d10cd596]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-d10cd596]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.pp-empty[data-v-d10cd596]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-d10cd596],.pp-cards[data-v-d10cd596]{grid-template-columns:1fr}}.pairing-panel[data-v-67a1ff9e]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-67a1ff9e]{margin:12px 0;color:var(--md-on-surface-variant)}.pairing-panel .pairing-error[data-v-67a1ff9e]{color:var(--md-error)}article[data-v-67a1ff9e]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-67a1ff9e]{font-size:24px;letter-spacing:4px}h4[data-v-67a1ff9e]{margin:18px 0 0}.pairing-list[data-v-67a1ff9e]{position:relative}.pair-enter-active[data-v-67a1ff9e],.pair-leave-active[data-v-67a1ff9e]{transition:opacity var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out)}.pair-enter-from[data-v-67a1ff9e],.pair-leave-to[data-v-67a1ff9e]{opacity:0;transform:translateY(4px)}.pair-leave-active[data-v-67a1ff9e]{position:absolute;width:100%}.pair-move[data-v-67a1ff9e]{transition:transform var(--duration-medium) var(--ease-out)}@media(prefers-reduced-motion:reduce){.pair-enter-active[data-v-67a1ff9e],.pair-leave-active[data-v-67a1ff9e],.pair-move[data-v-67a1ff9e]{transition-duration:1ms}}.models-field[data-v-b6ad9d20]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-b6ad9d20]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-b6ad9d20]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-b6ad9d20]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-b6ad9d20]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-b6ad9d20]{display:inline-flex;gap:4px}.models-actions button[data-v-b6ad9d20]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-b6ad9d20]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-b6ad9d20]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-b6ad9d20]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.connection-grid[data-v-d9b226f0]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,264px);gap:24px;align-items:start}@media(max-width:1000px){.connection-grid[data-v-d9b226f0]{grid-template-columns:minmax(0,1fr)}}.connection-form .field[data-v-d9b226f0]{margin-bottom:12px}.connection-qr[data-v-d9b226f0]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-d9b226f0]{background:#fff;border-radius:8px;padding:6px;width:100%;max-width:264px;height:auto}.connection-link[data-v-d9b226f0]{max-width:100%;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.helper-text[data-v-d9b226f0]{overflow-wrap:anywhere}.toggle-label[data-v-d9b226f0]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-8a0a3d8d]{max-width:920px}.sec-stack[data-v-8a0a3d8d]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-8a0a3d8d]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-8a0a3d8d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-8a0a3d8d]{font-size:15px;font-weight:700}.sec-chip[data-v-8a0a3d8d]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-8a0a3d8d]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-8a0a3d8d]{margin:2px 0 12px}.sec-pin-grid[data-v-8a0a3d8d]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-8a0a3d8d]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-8a0a3d8d]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-8a0a3d8d]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-8a0a3d8d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-8a0a3d8d]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-8a0a3d8d]:hover{background:var(--md-surface-container)}.page-item[data-v-8a0a3d8d]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-8a0a3d8d]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-8a0a3d8d]{width:44px;height:26px}.page-item .toggle-slider[data-v-8a0a3d8d]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-8a0a3d8d]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-8a0a3d8d]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-8a0a3d8d]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-8a0a3d8d]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-8a0a3d8d]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-8a0a3d8d]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-8a0a3d8d]{margin-top:12px}.sec-error[data-v-8a0a3d8d]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-8a0a3d8d]{grid-template-columns:1fr}}.mcp-panel[data-v-60e55840]{max-width:900px}.mcp-head[data-v-60e55840]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-60e55840]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-60e55840]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-60e55840]{display:flex;gap:10px}.error-banner[data-v-60e55840]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-60e55840]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-60e55840]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-60e55840]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-60e55840]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-60e55840]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-60e55840]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-60e55840]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-60e55840]{flex:1}.mcp-field>span[data-v-60e55840]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-60e55840],.mcp-field select[data-v-60e55840],.mcp-field textarea[data-v-60e55840]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-60e55840]{opacity:.7}.mcp-field textarea[data-v-60e55840]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-60e55840]:focus,.mcp-field select[data-v-60e55840]:focus,.mcp-field textarea[data-v-60e55840]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-60e55840]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-60e55840]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-60e55840]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-60e55840]{font-family:ui-monospace,monospace}.mail-grid[data-v-60e55840]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-60e55840]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-60e55840]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-60e55840]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-60e55840]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-60e55840]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-60e55840]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-60e55840]:disabled{opacity:.6;cursor:not-allowed}#app .mcp-panel[data-v-60e55840] :is(.btn,.mcp-remove){border-radius:999px}#app .mcp-panel .mcp-field[data-v-60e55840] :is(input,select,textarea){border-radius:12px}@media(max-width:720px){.mail-grid[data-v-60e55840]{grid-template-columns:1fr}}.plugin-pane-message[data-v-32ca9ff2]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.pp-head[data-v-580db486]{display:flex;align-items:center;justify-content:space-between;gap:8px}.pp-head h2[data-v-580db486]{margin:0;font-size:18px}.pp-icon[data-v-580db486]{width:32px;height:32px;border-radius:50%;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);font-size:15px;cursor:pointer}.pp-icon[data-v-580db486]:disabled{opacity:.45;cursor:not-allowed}.pp-roots[data-v-580db486]{display:flex;flex-wrap:wrap;gap:6px}.pp-root[data-v-580db486]{padding:4px 10px;border-radius:999px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface-variant);font-size:12px;font-family:monospace;cursor:pointer}.pp-root.is-active[data-v-580db486]{border-color:var(--md-primary);color:var(--md-primary)}.pp-path[data-v-580db486]{font-family:monospace;font-size:13px}.pp-list[data-v-580db486]{display:flex;flex-direction:column;gap:2px;min-height:180px;max-height:42vh;overflow:auto;padding:6px;border-radius:14px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest, var(--md-surface))}.pp-item[data-v-580db486]{display:flex;align-items:center;gap:8px;padding:7px 10px;border:0;border-radius:10px;background:none;color:var(--md-on-surface);font-size:13px;text-align:left;cursor:pointer}.pp-item[data-v-580db486]:hover,.pp-item[data-v-580db486]:focus-visible{background:var(--md-surface-container-high);outline:none}.pp-folder[data-v-580db486]{color:var(--md-primary);font-size:13px;line-height:1;opacity:.85}.pp-name[data-v-580db486]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-empty[data-v-580db486]{margin:0;padding:24px 8px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.pp-error[data-v-580db486]{color:var(--md-error, #b3261e)}.pp-current[data-v-580db486]{margin:0;font-family:monospace;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-foot[data-v-580db486]{display:flex;align-items:center;gap:8px}.pp-spacer[data-v-580db486]{flex:1}\n";document.head.appendChild(s)}})();
