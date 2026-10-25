var Zt = Object.defineProperty;
var Qt = (E, t, p) => t in E ? Zt(E, t, { enumerable: !0, configurable: !0, writable: !0, value: p }) : E[t] = p;
var W = (E, t, p) => Qt(E, typeof t != "symbol" ? t + "" : t, p);
import { defineComponent as ce, ref as x, computed as G, onMounted as Te, onUnmounted as st, watch as je, openBlock as u, createElementBlock as c, normalizeClass as ee, createElementVNode as e, unref as s, normalizeStyle as Tt, toDisplayString as l, createCommentVNode as O, withModifiers as Re, nextTick as es, reactive as ts, createTextVNode as Ue, withDirectives as F, vModelCheckbox as ue, vModelText as Y, Fragment as J, renderList as ne, withKeys as mt, createStaticVNode as ss, createVNode as fe, vModelDynamic as ls, TransitionGroup as At, withCtx as Qe, createBlock as me, vModelSelect as ns, shallowRef as It, resolveDynamicComponent as os, Transition as as } from "vue";
import { useRouter as zt, useRoute as is } from "vue-router";
import { useI18n as de } from "vue-i18n";
import { useLifeStore as rs, useWizardStore as lt, live2dRuntimeReady as us, apiGet as ze, apiPost as et, ApiError as Ft, useConfirm as qe, useProvidersStore as cs, PROVIDERS as dt, AppSelect as Ye, getLanguage as ds, LOCALES as ps, setLanguage as vs, MarkdownContent as hs, useSettingsMeta as ft, useUIPatchesStore as Bt, PinInput as Vt, ModalShell as ms, useSettingsSectionsStore as fs, NavIcon as gs, DEFAULT_LIVE2D_MODELS as _s } from "@0kay/host";
const bs = ["title"], ys = {
  key: 0,
  class: "stage-placeholder"
}, ks = {
  key: 1,
  class: "stage-status"
}, ws = {
  key: 2,
  class: "stage-status warn"
}, $s = ["title", "aria-label"], Ss = { class: "stage-hint" }, Nt = "0kay.web.live2d.resetbtn", Cs = "0kay.web.live2d.transform.", Ps = /* @__PURE__ */ ce({
  __name: "Live2DStage",
  setup(E) {
    const { t } = de(), p = rs(), v = lt(), g = x(null), k = x(null), d = x(""), w = x("idle"), C = x(""), a = G(() => v.live2d.enabled), i = G(() => v.live2d.modelUrl.trim()), n = G(() => p.emotionMood), o = G(() => {
      const h = String(n.value || "");
      if (!h) return "";
      const _ = `emotion.${h}`, N = t(_);
      return N === _ ? h : N;
    }), r = G(() => p.emotionColor), m = x([]);
    async function y() {
      try {
        const h = await fetch("/api/live2d");
        if (h.ok) {
          const _ = await h.json();
          m.value = _.models || [];
        }
      } catch {
        m.value = [];
      }
    }
    const f = x(null), M = x(T()), A = x(!1);
    let K = !1, R = { x: 0, y: 0 }, L = { x: 0, y: 0 };
    function T() {
      try {
        const h = localStorage.getItem(Nt);
        if (h) {
          const _ = JSON.parse(h);
          if (typeof _?.x == "number" && typeof _?.y == "number") return _;
        }
      } catch {
      }
      return null;
    }
    const I = G(() => M.value ? { left: `${M.value.x}px`, top: `${M.value.y}px`, right: "auto", bottom: "auto" } : {});
    function X(h) {
      A.value = !0, K = !1, R = { x: h.clientX, y: h.clientY };
      const _ = f.value?.getBoundingClientRect();
      L = { x: _?.left ?? 0, y: _?.top ?? 0 };
      try {
        f.value?.setPointerCapture(h.pointerId);
      } catch {
      }
    }
    function ae(h) {
      if (!A.value || !g.value) return;
      const _ = h.clientX - R.x, N = h.clientY - R.y;
      (Math.abs(_) > 3 || Math.abs(N) > 3) && (K = !0);
      const H = g.value.getBoundingClientRect(), Q = f.value?.offsetWidth || 34, se = Ie(L.x - H.left + _, 4, Math.max(4, H.width - Q - 4)), te = Ie(L.y - H.top + N, 4, Math.max(4, H.height - Q - 4));
      M.value = { x: Math.round(se), y: Math.round(te) };
    }
    function re(h) {
      if (A.value) {
        A.value = !1;
        try {
          f.value?.releasePointerCapture(h.pointerId);
        } catch {
        }
        if (K)
          try {
            localStorage.setItem(Nt, JSON.stringify(M.value));
          } catch {
          }
      }
    }
    function j() {
      if (K) {
        K = !1;
        return;
      }
      Jt();
    }
    let V = null, U = null, Ee = null, Ce = 0, oe = 0, Ve = { x: 0, y: 0, has: !1 }, le = !1, ie = null, Le = { x: 0, y: 0 }, ge = null, ye = null, ke = null, we = null, Pe = null, pe = "off", ve = 0, Be = 0, Oe = 0, De = 120, Ae = ["ParamMouthOpenY"];
    function b(h) {
      const _ = U?.internalModel?.coreModel;
      if (!_) return;
      const N = Ie(h, 0, 1);
      for (const H of Ae)
        try {
          typeof _.setParameterValueById == "function" ? _.setParameterValueById(H, N) : typeof _.setParamFloat == "function" && _.setParamFloat(H, N);
        } catch {
        }
    }
    function P(h) {
      const _ = [];
      try {
        const N = h?.internalModel?.settings;
        let H = N?.getLipSyncParameters?.();
        if (!Array.isArray(H) && Array.isArray(N?.groups) && (H = N.groups.find((se) => (se?.Name || se?.name || "").toLowerCase() === "lipsync")?.Ids), Array.isArray(H))
          for (const Q of H) typeof Q == "string" && Q && _.push(Q);
      } catch {
      }
      Ae = _.length ? _ : ["ParamMouthOpenY"];
    }
    function S() {
      if (pe === "off") {
        ve !== 0 && (ve = 0, b(0));
        return;
      }
      if (pe === "audio" && we && Pe) {
        we.getByteTimeDomainData(Pe);
        let h = 0;
        for (let H = 0; H < Pe.length; H++) {
          const Q = (Pe[H] - 128) / 128;
          h += Q * Q;
        }
        const _ = Math.sqrt(h / Pe.length), N = Ie(_ * 3.4, 0, 1);
        ve = ve * 0.35 + N * 0.65, b(ve);
        return;
      }
      if (pe === "text") {
        const h = performance.now() - Be;
        if (h > Oe * De + 260) {
          pe = "off", ve = 0, b(0);
          return;
        }
        const _ = h % De / De, N = _ < 0.5 ? 0.12 + 0.72 * Math.sin(_ / 0.5 * Math.PI) : 0.06;
        ve = ve * 0.45 + N * 0.55, b(ve);
      }
    }
    async function Z(h, _ = "") {
      if (!h) {
        $e(_);
        return;
      }
      if (U)
        try {
          if (ge || (ge = new Audio(), ge.crossOrigin = "anonymous", ge.addEventListener("ended", () => {
            pe = "off", ve = 0, b(0);
          })), ye && ye !== h)
            try {
              URL.revokeObjectURL(ye);
            } catch {
            }
          if (ye = h, ge.src = h, !ke) {
            const N = window.AudioContext || window.webkitAudioContext;
            N && (ke = new N(), we = ke.createAnalyser(), we.fftSize = 1024, Pe = new Uint8Array(we.fftSize), ke.createMediaElementSource(ge).connect(we), we.connect(ke.destination));
          }
          await ke?.resume().catch(() => {
          }), pe = "audio", await ge.play().catch(() => {
            _ ? $e(_) : (pe = "off", b(0));
          });
        } catch {
          _ ? $e(_) : pe = "off";
        }
    }
    function $e(h) {
      const _ = Array.from(String(h || "")).filter((N) => /\S/.test(N));
      _.length && (De = /[\u4e00-\u9fff]/.test(_.join("")) ? 140 : 80, Oe = _.length, Be = performance.now(), pe = "text");
    }
    function D() {
      pe = "off", ve = 0, b(0);
      try {
        ge?.pause();
      } catch {
      }
    }
    function B(h) {
      const _ = h.detail || {};
      _.url ? Z(_.url, _.text || "") : _.text && $e(_.text);
    }
    let $ = {}, z = [], he = 0;
    function _e(h) {
      $ = {}, z = [];
      try {
        const _ = h?.internalModel?.motionManager, N = h?.internalModel?.settings, H = _?.definitions || N?.motions || {};
        for (const [se, te] of Object.entries(H)) $[se] = Array.isArray(te) ? te.length : 0;
        z = (_?.expressionManager?.definitions || N?.expressions || []).map((se) => se?.Name || se?.name).filter((se) => !!se);
      } catch {
      }
      try {
        console.info("[live2d] motions", $, "expressions", z);
      } catch {
      }
      try {
        window.__0KAY_LIVE2D_CAPS__ = { motions: $, expressions: z };
      } catch {
      }
    }
    function q(h, _) {
      if (!U) return;
      const N = Object.keys($).filter((te) => $[te] > 0);
      if (!N.length) return;
      const H = N.find((te) => /idle/i.test(te)), Q = h && $[h] > 0, se = Q ? h : _ == null && H ? H : N.find((te) => te !== H) || N[0];
      try {
        const te = U.internalModel?.motionManager;
        if (typeof U.motion == "function" && Q) {
          U.motion(se, _);
          return;
        }
        if (_ == null) {
          te?.startRandomMotion?.(se);
          return;
        }
        te?.startMotion?.(se, _);
      } catch {
      }
    }
    function be(h) {
      if (!U || !h) return;
      const _ = /^\d+$/.test(h) ? Number(h) : z.indexOf(h), N = _ >= 0 ? _ : h;
      try {
        const H = U.internalModel?.motionManager?.expressionManager;
        if (H?.setExpression) {
          H.setExpression(N);
          return;
        }
        U.expression?.(N);
      } catch {
      }
    }
    function ot() {
      at(), !(typeof window > "u") && (he = window.setInterval(() => {
        if (pe !== "off" || document.hidden) return;
        const h = Object.keys($).filter((_) => $[_] > 0 && !/idle/i.test(_));
        h.length && Math.random() < 0.6 && q(h[Math.floor(Math.random() * h.length)]), z.length && Math.random() < 0.5 && be(z[Math.floor(Math.random() * z.length)]);
      }, 9e3));
    }
    function at() {
      he && (clearInterval(he), he = 0);
    }
    function _t(h) {
      const _ = h.detail || {};
      _.expression && be(_.expression), (_.group || _.index != null) && q(_.group, _.index);
    }
    function Kt() {
      return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore);
    }
    function Ie(h, _, N) {
      return Math.min(N, Math.max(_, h));
    }
    function it() {
      return Cs + (i.value || "default");
    }
    function bt() {
      try {
        const h = localStorage.getItem(it());
        if (!h) return null;
        const _ = JSON.parse(h);
        if (typeof _?.x == "number" && typeof _?.y == "number" && typeof _?.scale == "number") return _;
      } catch {
      }
      return null;
    }
    function rt(h = !1) {
      if (!U) return;
      const _ = () => {
        try {
          localStorage.setItem(it(), JSON.stringify({
            x: Math.round(U.x * 100) / 100,
            y: Math.round(U.y * 100) / 100,
            scale: Math.round(U.scale.x * 1e4) / 1e4
          }));
        } catch {
        }
      };
      if (h) {
        oe && (clearTimeout(oe), oe = 0), _();
        return;
      }
      oe && clearTimeout(oe), oe = window.setTimeout(() => {
        oe = 0, _();
      }, 140);
    }
    function yt() {
      if (at(), pe = "off", ve = 0, He(), oe && (clearTimeout(oe), oe = 0), U) {
        try {
          V?.stage && V.stage.removeChild(U), U.destroy?.();
        } catch {
        }
        U = null;
      }
    }
    function kt() {
      if (Et(), yt(), Ee && (Ee.disconnect(), Ee = null), oe && (clearTimeout(oe), oe = 0), V) {
        try {
          V.destroy(!1, { children: !0, texture: !1, baseTexture: !1 });
        } catch {
        }
        V = null;
      }
    }
    function wt(h) {
      if (typeof h.getLocalBounds == "function") {
        const H = h.getLocalBounds();
        if (H && H.width > 0 && H.height > 0) return { width: H.width, height: H.height };
      }
      const _ = Math.max(Math.abs(h.scale.x) || 0, 1e-4), N = Math.max(Math.abs(h.scale.y) || 0, 1e-4);
      return { width: Math.max(h.width / _, 1), height: Math.max(h.height / N, 1) };
    }
    function ut(h = U) {
      if (!h || !V) return !1;
      const _ = V.screen.width, N = V.screen.height;
      if (!_ || !N) return !1;
      const H = wt(h);
      if (H.width > 0 && H.height > 0) {
        const Q = Math.min(_ / H.width, N / H.height) * 0.88;
        h.anchor?.set?.(0.5, 0.5), h.scale.set(Q, Q);
      }
      h.position.set(_ * 0.5, N * 0.55);
      try {
        const Q = h.getBounds?.();
        if (Q && Q.width > 0 && Q.height > 0) {
          h.x += _ * 0.5 - (Q.x + Q.width * 0.5), h.y += N * 0.55 - (Q.y + Q.height * 0.55);
          const se = h.getBounds?.();
          if (se && se.width > 0 && se.height > 0) {
            const te = Math.min(_ / se.width, N / se.height) * 0.88, xe = Math.abs(h.scale.x) || 1;
            if (Number.isFinite(te) && te > 0 && Math.abs(te - xe) / xe > 0.08) {
              const Ne = xe * te;
              h.scale.set(Ne, Ne);
              const Se = h.getBounds?.();
              Se && Se.width > 0 && (h.x += _ * 0.5 - (Se.x + Se.width * 0.5), h.y += N * 0.55 - (Se.y + Se.height * 0.55));
            }
          }
        }
      } catch {
      }
      return !0;
    }
    function jt() {
      if (!U) return { hw: 0, hh: 0 };
      const h = wt(U), _ = Math.abs(U.scale.x) || 1, N = Math.abs(U.scale.y) || 1;
      return { hw: h.width * _ / 2, hh: h.height * N / 2 };
    }
    function Ge() {
      if (!U || !V) return;
      const h = V.screen.width, _ = V.screen.height, { hw: N, hh: H } = jt(), Q = Math.min(N * 0.7, h * 0.5), se = Math.min(H * 0.7, _ * 0.5), te = Q - N, xe = h - Q + N, Ne = se - H, Se = _ - se + H, Je = te <= xe ? Ie(U.x, te, xe) : h * 0.5, Ut = Ne <= Se ? Ie(U.y, Ne, Se) : _ * 0.55;
      U.position.set(Je, Ut);
    }
    function Yt() {
      if (!U || !V) return;
      const h = bt();
      if (h && Number.isFinite(h.scale) && h.scale > 0) {
        U.anchor?.set?.(0.5, 0.5), U.scale.set(h.scale, h.scale), U.position.set(h.x, h.y), Ge();
        return;
      }
      ut();
    }
    function Xt(h, _) {
      if (!U || !window.PIXI || typeof window.PIXI.Point != "function" || typeof U.toModelPosition != "function") return null;
      try {
        const N = new window.PIXI.Point(h, _);
        return U.toModelPosition(N, new window.PIXI.Point());
      } catch {
        return null;
      }
    }
    function $t(h, _, N) {
      const H = N - _;
      return !Number.isFinite(H) || Math.abs(H) <= 1e-4 ? 0 : Ie((h - _) / H * 2 - 1, -1, 1);
    }
    function St(h, _) {
      const N = U?.internalModel, H = N?.focusController;
      if (!H || typeof H.focus != "function" || !V) return;
      const Q = V.screen.width || 1, se = V.screen.height || 1;
      let te = h / Q * 2 - 1, xe = _ / se * 2 - 1;
      const Ne = Xt(h, _);
      if (Ne && N.originalWidth && N.originalHeight) {
        const Se = $t(Ne.x, 0, N.originalWidth), Je = $t(Ne.y, 0, N.originalHeight);
        Se >= -1 && Se <= 1 && Je >= -1 && Je <= 1 && (te = te * 0.35 + Se * 0.65, xe = xe * 0.35 + Je * 0.65);
      }
      te = Ie(te, -1, 1), xe = Ie(xe, -1, 1), H.focus(te, -xe);
    }
    function Ze() {
      Ve.has && St(Ve.x, Ve.y);
    }
    function Ct(h) {
      if (!U || !V || !g.value) return;
      const _ = g.value.getBoundingClientRect();
      if (!_.width || !_.height) return;
      const N = (h.clientX - _.left) / _.width * V.screen.width, H = (h.clientY - _.top) / _.height * V.screen.height;
      Ve = { x: N, y: H, has: !0 }, le && h.pointerId === ie && (U.position.set(N + Le.x, H + Le.y), Ge(), rt()), St(N, H);
    }
    function Pt(h) {
      if (!U || !V || !g.value || h.button !== 0 && h.pointerType === "mouse" || h.target?.closest?.(".stage-reset")) return;
      const _ = g.value.getBoundingClientRect();
      if (!_.width || !_.height) return;
      const N = (h.clientX - _.left) / _.width * V.screen.width, H = (h.clientY - _.top) / _.height * V.screen.height;
      le = !0, ie = h.pointerId, Le = { x: U.x - N, y: U.y - H };
      try {
        g.value.setPointerCapture(h.pointerId);
      } catch {
      }
      g.value && (g.value.style.cursor = "grabbing");
    }
    function He(h) {
      if (le && !(h && ie !== null && h.pointerId !== ie)) {
        if (le = !1, g.value) {
          try {
            ie !== null && g.value.releasePointerCapture(ie);
          } catch {
          }
          g.value.style.cursor = "grab";
        }
        ie = null, rt(!0);
      }
    }
    function xt(h) {
      if (!U || w.value !== "ok" || !h.ctrlKey && !h.metaKey) return;
      h.preventDefault();
      const _ = h.deltaY < 0 ? 1.06 : 0.94, N = Ie(U.scale.x * _, 0.08, 3.2);
      U.scale.set(N, N), Ge(), Ze(), rt();
    }
    function Jt() {
      if (!(!U || !V)) {
        try {
          localStorage.removeItem(it());
        } catch {
        }
        oe && (clearTimeout(oe), oe = 0);
        try {
          V.resize?.();
        } catch {
        }
        V?.stage && (V.stage.hitArea = V.screen), ut(), Ze();
      }
    }
    function Mt() {
      Et();
      const h = g.value;
      h && (h.style.cursor = "grab", h.addEventListener("pointermove", Ct), h.addEventListener("pointerdown", Pt), h.addEventListener("pointerup", He), h.addEventListener("pointercancel", He), h.addEventListener("pointerleave", He), h.addEventListener("wheel", xt, { passive: !1 }));
    }
    function Et() {
      const h = g.value;
      h && (h.removeEventListener("pointermove", Ct), h.removeEventListener("pointerdown", Pt), h.removeEventListener("pointerup", He), h.removeEventListener("pointercancel", He), h.removeEventListener("pointerleave", He), h.removeEventListener("wheel", xt), le = !1, ie = null);
    }
    function Wt() {
      if (V || !k.value || !g.value) return;
      const h = window.PIXI;
      V = new h.Application({
        view: k.value,
        resizeTo: g.value,
        autoStart: !0,
        antialias: !0,
        backgroundAlpha: 0,
        powerPreference: "high-performance"
      }), V.stage && (V.stage.interactive = !0, V.stage.hitArea = V.screen), Ee = new ResizeObserver(() => {
        try {
          V?.resize?.();
        } catch {
        }
        if (V?.stage && (V.stage.hitArea = V.screen), U) {
          const _ = bt();
          _ && Number.isFinite(_.scale) && _.scale > 0 ? (U.position.set(_.x, _.y), U.scale.set(_.scale, _.scale), Ge()) : ut();
        }
        Ze();
      }), Ee.observe(g.value), Mt();
    }
    async function ct() {
      try {
        await us;
      } catch (N) {
        w.value = "error", C.value = `Live2D runtime: ${N.message}`;
        return;
      }
      const h = ++Ce;
      if (yt(), !a.value) {
        w.value = "disabled", d.value = "";
        return;
      }
      if (!Kt()) {
        w.value = "no-libs", C.value = t("live2d.libsMissing");
        return;
      }
      const _ = i.value || m.value[0]?.url;
      if (!_) {
        w.value = "error", C.value = t("live2d.noModel");
        return;
      }
      if (w.value = "loading", C.value = "", d.value = _.split("/").pop() || _, await es(), V || Wt(), !V) {
        w.value = "error", C.value = t("live2d.stageMissing");
        return;
      }
      try {
        const N = await window.PIXI.live2d.Live2DModel.from(_, { autoInteract: !1 });
        if (h !== Ce) {
          try {
            N.destroy?.();
          } catch {
          }
          return;
        }
        U = N, Mt(), N.anchor?.set?.(0.5, 0.5), V.stage.addChild(N), Yt();
        try {
          N.internalModel?.on?.("beforeModelUpdate", S);
        } catch {
        }
        P(N), _e(N), w.value = "ok", Ze(), q("Idle"), ot();
      } catch (N) {
        if (h !== Ce) return;
        console.error("Live2D load failed:", N), w.value = "error", C.value = N?.message || t("live2d.loadError");
      }
    }
    function qt() {
      if (!a.value) {
        kt(), w.value = "disabled";
        return;
      }
      ct();
    }
    Te(async () => {
      window.addEventListener("live2d-models-changed", y), window.addEventListener("live2d-speak", B), window.addEventListener("live2d-motion", _t), window.__0KAY_LIVE2D__ = { speak: Z, stop: D, motion: q, expression: be };
      try {
        const h = await fetch("/api/settings/live2d");
        if (h.ok) {
          const { values: _ } = await h.json();
          _ && typeof _.enabled == "boolean" && (v.live2d.enabled = _.enabled), _ && typeof _.model_url == "string" && (v.live2d.modelUrl = _.model_url);
        }
      } catch {
      }
      await y(), a.value ? ct() : w.value = "disabled";
    }), st(() => {
      if (window.removeEventListener("live2d-models-changed", y), window.removeEventListener("live2d-speak", B), window.removeEventListener("live2d-motion", _t), at(), D(), ye) {
        try {
          URL.revokeObjectURL(ye);
        } catch {
        }
        ye = null;
      }
      try {
        ke?.close();
      } catch {
      }
      ke = null, Ce++, kt();
    }), je(a, qt), je(i, () => {
      a.value && ct();
    });
    const Gt = { happy: 2, sad: 4, irritated: 6, neutral: 0, drowsy: 0, exhausted: 0, sleeping: 0 };
    return je(n, (h) => {
      if (!U || pe !== "off" || !z.length) return;
      const _ = Gt[h] ?? 0;
      be(z[_] || z[0]), (h === "happy" || h === "irritated") && Math.random() < 0.5 && q();
    }), (h, _) => (u(), c("div", {
      class: ee(["live2d-stage", { on: a.value }])
    }, [
      e("div", {
        ref_key: "stageEl",
        ref: g,
        class: "stage-viewport",
        style: Tt({ "--mood": r.value }),
        title: a.value && w.value === "ok" ? s(t)("live2d.interactHint") : ""
      }, [
        e("canvas", {
          ref_key: "canvasEl",
          ref: k,
          class: "stage-canvas"
        }, null, 512),
        a.value ? w.value === "loading" ? (u(), c("div", ks, l(s(t)("live2d.loading")), 1)) : w.value === "error" || w.value === "no-libs" ? (u(), c("div", ws, l(C.value || s(t)("live2d.loadError")), 1)) : O("", !0) : (u(), c("div", ys, [
          e("p", null, l(s(t)("live2d.disabledHint")), 1)
        ])),
        a.value && w.value === "ok" ? (u(), c("button", {
          key: 3,
          ref_key: "resetBtnEl",
          ref: f,
          class: ee(["stage-reset", { dragging: A.value }]),
          type: "button",
          style: Tt(I.value),
          title: s(t)("live2d.resetView"),
          "aria-label": s(t)("live2d.resetView"),
          onPointerdown: Re(X, ["stop"]),
          onPointermove: Re(ae, ["stop"]),
          onPointerup: Re(re, ["stop"]),
          onPointercancel: Re(re, ["stop"]),
          onClick: Re(j, ["stop"])
        }, "⟲", 46, $s)) : O("", !0),
        _[0] || (_[0] = e("div", { class: "stage-gradient" }, null, -1)),
        e("div", Ss, l(o.value), 1)
      ], 12, bs)
    ], 2));
  }
}), Me = (E, t) => {
  const p = E.__vccOpts || E;
  for (const [v, g] of t)
    p[v] = g;
  return p;
}, xs = /* @__PURE__ */ Me(Ps, [["__scopeId", "data-v-389757eb"]]), Ms = { class: "life-settings" }, Es = { class: "ls-hero" }, Us = { class: "ls-hero-main" }, Ts = { class: "ls-sub" }, As = ["disabled"], Is = { class: "ls-grid" }, Vs = { class: "ls-card" }, Ns = { class: "ls-card-head" }, Rs = { class: "ls-switch" }, Ls = { class: "ls-switch-text" }, Os = { class: "ls-switch" }, Ds = { class: "ls-switch-text" }, zs = { class: "ls-field" }, Fs = ["placeholder"], Bs = { class: "ls-card" }, Hs = { class: "ls-card-head" }, Ks = { class: "ls-note" }, js = { class: "ls-label" }, Ys = { class: "ls-models" }, Xs = ["onClick"], Js = {
  key: 0,
  class: "ls-empty"
}, Ws = { class: "ls-label" }, qs = { class: "ls-models" }, Gs = ["onClick"], Zs = {
  key: 0,
  class: "ls-empty"
}, Qs = { class: "ls-card" }, el = { class: "ls-card-head" }, tl = { class: "ls-note" }, sl = { class: "ls-switch" }, ll = { class: "ls-switch-text" }, nl = { class: "ls-switch" }, ol = { class: "ls-switch-text" }, al = { class: "ls-card" }, il = { class: "ls-switch" }, rl = { class: "ls-switch-text" }, ul = { class: "ls-card ls-card-wide" }, cl = { class: "ls-card-head" }, dl = { class: "ls-row" }, pl = { class: "ls-switch" }, vl = { class: "ls-switch-text" }, hl = { class: "ls-switch" }, ml = { class: "ls-switch-text" }, fl = { class: "ls-row" }, gl = { class: "ls-field" }, _l = { class: "ls-field" }, bl = { class: "ls-row" }, yl = { class: "ls-field" }, kl = { class: "ls-field" }, wl = ["placeholder"], $l = { class: "ls-row" }, Sl = { class: "ls-field" }, Cl = { class: "ls-field" }, Pl = { class: "ls-card ls-card-wide" }, xl = { class: "ls-card-head" }, Ml = { class: "ls-row" }, El = { class: "ls-switch" }, Ul = { class: "ls-switch-text" }, Tl = { class: "ls-row" }, Al = { class: "ls-field" }, Il = ["placeholder"], Vl = { class: "ls-field" }, Nl = ["title"], Rl = { class: "ls-hint" }, Ll = { class: "ls-card ls-card-wide" }, Ol = { class: "ls-card-head" }, Dl = { class: "ls-row" }, zl = { class: "ls-switch" }, Fl = { class: "ls-switch-text" }, Bl = { class: "ls-switch" }, Hl = { class: "ls-switch-text" }, Kl = { class: "ls-switch" }, jl = { class: "ls-switch-text" }, Yl = { class: "ls-hint" }, Xl = {
  key: 0,
  class: "ls-state"
}, Jl = /* @__PURE__ */ ce({
  __name: "LifeSettingsPanel",
  setup(E) {
    const { t } = de(), p = ts({
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
    }), v = x(""), g = x(!1), k = x(!1), d = x([]), w = x(""), C = x([]);
    async function a() {
      try {
        const [n, o] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (n.ok && (Object.assign(p, (await n.json()).values || {}), k.value = !0), o.ok) {
          const r = await o.json();
          C.value = Array.isArray(r.models) ? r.models.map((m) => ({ id: m.id, provider: m.provider || "custom", supports_thinking: m.supports_thinking })).filter((m) => m.id) : [], d.value = C.value.map((m) => m.id), w.value = t("lifeSettings.sourceFromCore");
        }
      } catch {
        v.value = t("lifeSettings.loadFailed");
      }
    }
    async function i() {
      if (!k.value) {
        v.value = t("lifeSettings.notLoaded");
        return;
      }
      g.value = !0, v.value = "";
      try {
        const n = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: p }) });
        if (!n.ok) throw new Error(String(n.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: p.screen_watch, computer_use: p.computer_use, report_agent_host: p.report_agent_host }) }), v.value = t("lifeSettings.savedNotice");
      } catch {
        v.value = t("lifeSettings.saveFailed");
      } finally {
        g.value = !1;
      }
    }
    return Te(a), (n, o) => (u(), c("section", Ms, [
      e("header", Es, [
        e("div", Us, [
          o[20] || (o[20] = e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS", -1)),
          e("h2", null, l(s(t)("lifeSettings.title")), 1),
          e("p", Ts, l(s(t)("lifeSettings.subtitle")), 1)
        ]),
        e("button", {
          class: "ls-save",
          disabled: g.value,
          onClick: i
        }, [
          o[21] || (o[21] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          Ue(l(g.value ? s(t)("common.saving") : s(t)("common.save")), 1)
        ], 8, As)
      ]),
      e("div", Is, [
        e("article", Vs, [
          e("div", Ns, [
            o[22] || (o[22] = e("span", { class: "ls-ic tone-1" }, "◉", -1)),
            e("h3", null, l(s(t)("lifeSettings.hostPerms")), 1)
          ]),
          e("label", Rs, [
            F(e("input", {
              "onUpdate:modelValue": o[0] || (o[0] = (r) => p.screen_watch = r),
              type: "checkbox"
            }, null, 512), [
              [ue, p.screen_watch]
            ]),
            o[23] || (o[23] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Ls, [
              e("b", null, l(s(t)("lifeSettings.screenWatch")), 1),
              e("small", null, l(s(t)("lifeSettings.screenWatchDesc")), 1)
            ])
          ]),
          e("label", Os, [
            F(e("input", {
              "onUpdate:modelValue": o[1] || (o[1] = (r) => p.computer_use = r),
              type: "checkbox"
            }, null, 512), [
              [ue, p.computer_use]
            ]),
            o[24] || (o[24] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Ds, [
              e("b", null, l(s(t)("lifeSettings.computerUse")), 1),
              e("small", null, l(s(t)("lifeSettings.computerUseDesc")), 1)
            ])
          ]),
          e("label", zs, [
            e("span", null, l(s(t)("lifeSettings.agentHost")), 1),
            F(e("input", {
              "onUpdate:modelValue": o[2] || (o[2] = (r) => p.report_agent_host = r),
              placeholder: s(t)("lifeSettings.agentHostPlaceholder")
            }, null, 8, Fs), [
              [Y, p.report_agent_host]
            ])
          ])
        ]),
        e("article", Bs, [
          e("div", Hs, [
            o[25] || (o[25] = e("span", { class: "ls-ic tone-2" }, "✦", -1)),
            e("h3", null, l(s(t)("lifeSettings.thinkOutput")), 1)
          ]),
          e("p", Ks, l(w.value || s(t)("lifeSettings.loadingModels")), 1),
          e("p", js, l(s(t)("lifeSettings.thinkLabel")), 1),
          e("div", Ys, [
            (u(!0), c(J, null, ne(C.value, (r) => (u(), c("button", {
              key: "think-" + r.id,
              type: "button",
              class: ee(["ls-model", { selected: p.think_model === r.id }]),
              onClick: (m) => p.think_model = r.id
            }, [
              e("b", null, l(r.id), 1),
              e("span", null, l(r.provider) + " · " + l(r.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, Xs))), 128)),
            C.value.length ? O("", !0) : (u(), c("span", Js, l(s(t)("lifeSettings.noModels")), 1))
          ]),
          e("p", Ws, l(s(t)("lifeSettings.outputLabel")), 1),
          e("div", qs, [
            (u(!0), c(J, null, ne(C.value, (r) => (u(), c("button", {
              key: "output-" + r.id,
              type: "button",
              class: ee(["ls-model", { selected: p.output_model === r.id }]),
              onClick: (m) => p.output_model = r.id
            }, [
              e("b", null, l(r.id), 1),
              e("span", null, l(r.provider) + " · output", 1)
            ], 10, Gs))), 128)),
            C.value.length ? O("", !0) : (u(), c("span", Zs, l(s(t)("lifeSettings.noModels")), 1))
          ])
        ]),
        e("article", Qs, [
          e("div", el, [
            o[26] || (o[26] = e("span", { class: "ls-ic tone-3" }, "✉", -1)),
            e("h3", null, l(s(t)("lifeSettings.mail")), 1)
          ]),
          e("p", tl, l(s(t)("lifeSettings.mailNote", { mcp: "0kay-mcp", mail: "mail" })), 1),
          e("label", sl, [
            F(e("input", {
              "onUpdate:modelValue": o[3] || (o[3] = (r) => p.mail_auto_approve_all = r),
              type: "checkbox"
            }, null, 512), [
              [ue, p.mail_auto_approve_all]
            ]),
            o[27] || (o[27] = e("span", { class: "ls-track" }, null, -1)),
            e("span", ll, [
              e("b", null, l(s(t)("lifeSettings.mailAutoApprove")), 1),
              e("small", null, l(s(t)("lifeSettings.mailAutoApproveDesc")), 1)
            ])
          ]),
          e("label", nl, [
            F(e("input", {
              "onUpdate:modelValue": o[4] || (o[4] = (r) => p.mail_require_approval = r),
              type: "checkbox"
            }, null, 512), [
              [ue, p.mail_require_approval]
            ]),
            o[28] || (o[28] = e("span", { class: "ls-track" }, null, -1)),
            e("span", ol, [
              e("b", null, l(s(t)("lifeSettings.mailRequireApproval")), 1),
              e("small", null, l(s(t)("lifeSettings.mailRequireApprovalDesc")), 1)
            ])
          ])
        ]),
        e("article", al, [
          o[30] || (o[30] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", il, [
            F(e("input", {
              "onUpdate:modelValue": o[5] || (o[5] = (r) => p.mcp_enabled = r),
              type: "checkbox"
            }, null, 512), [
              [ue, p.mcp_enabled]
            ]),
            o[29] || (o[29] = e("span", { class: "ls-track" }, null, -1)),
            e("span", rl, [
              e("b", null, l(s(t)("lifeSettings.mcpEnabled")), 1),
              e("small", null, l(s(t)("lifeSettings.mcpEnabledDesc")), 1)
            ])
          ])
        ]),
        e("article", ul, [
          e("div", cl, [
            o[31] || (o[31] = e("span", { class: "ls-ic tone-5" }, "☷", -1)),
            e("h3", null, l(s(t)("lifeSettings.onebot")), 1)
          ]),
          e("div", dl, [
            e("label", pl, [
              F(e("input", {
                "onUpdate:modelValue": o[6] || (o[6] = (r) => p.onebot_enabled = r),
                type: "checkbox"
              }, null, 512), [
                [ue, p.onebot_enabled]
              ]),
              o[32] || (o[32] = e("span", { class: "ls-track" }, null, -1)),
              e("span", vl, [
                e("b", null, l(s(t)("lifeSettings.onebotEnable")), 1)
              ])
            ]),
            e("label", hl, [
              F(e("input", {
                "onUpdate:modelValue": o[7] || (o[7] = (r) => p.onebot_observe_group = r),
                type: "checkbox"
              }, null, 512), [
                [ue, p.onebot_observe_group]
              ]),
              o[33] || (o[33] = e("span", { class: "ls-track" }, null, -1)),
              e("span", ml, [
                e("b", null, l(s(t)("lifeSettings.onebotObserve")), 1),
                e("small", null, l(s(t)("lifeSettings.onebotObserveDesc")), 1)
              ])
            ])
          ]),
          e("div", fl, [
            e("label", gl, [
              e("span", null, l(s(t)("lifeSettings.onebotWs")), 1),
              F(e("input", {
                "onUpdate:modelValue": o[8] || (o[8] = (r) => p.onebot_ws_url = r),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [Y, p.onebot_ws_url]
              ])
            ]),
            e("label", _l, [
              e("span", null, l(s(t)("lifeSettings.onebotHttp")), 1),
              F(e("input", {
                "onUpdate:modelValue": o[9] || (o[9] = (r) => p.onebot_http_url = r),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [Y, p.onebot_http_url]
              ])
            ])
          ]),
          e("div", bl, [
            e("label", yl, [
              o[34] || (o[34] = e("span", null, "Access Token", -1)),
              F(e("input", {
                "onUpdate:modelValue": o[10] || (o[10] = (r) => p.onebot_access_token = r),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [Y, p.onebot_access_token]
              ])
            ]),
            e("label", kl, [
              e("span", null, l(s(t)("lifeSettings.onebotKeywords")), 1),
              F(e("input", {
                "onUpdate:modelValue": o[11] || (o[11] = (r) => p.onebot_trigger_keywords = r),
                placeholder: s(t)("lifeSettings.onebotKeywordsPlaceholder")
              }, null, 8, wl), [
                [Y, p.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", $l, [
            e("label", Sl, [
              e("span", null, l(s(t)("lifeSettings.proactiveDaily")), 1),
              F(e("input", {
                "onUpdate:modelValue": o[12] || (o[12] = (r) => p.proactive_daily_limit = r),
                type: "number",
                min: "0",
                placeholder: "3"
              }, null, 512), [
                [
                  Y,
                  p.proactive_daily_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", Cl, [
              e("span", null, l(s(t)("lifeSettings.proactiveTarget")), 1),
              F(e("input", {
                "onUpdate:modelValue": o[13] || (o[13] = (r) => p.proactive_target_limit = r),
                type: "number",
                min: "0",
                placeholder: "1"
              }, null, 512), [
                [
                  Y,
                  p.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ]),
        e("article", Pl, [
          e("div", xl, [
            o[35] || (o[35] = e("span", { class: "ls-ic tone-2" }, "🎙", -1)),
            e("h3", null, l(s(t)("lifeSettings.wake")), 1)
          ]),
          e("div", Ml, [
            e("label", El, [
              F(e("input", {
                "onUpdate:modelValue": o[14] || (o[14] = (r) => p.wake_enabled = r),
                type: "checkbox"
              }, null, 512), [
                [ue, p.wake_enabled]
              ]),
              o[36] || (o[36] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Ul, [
                e("b", null, l(s(t)("lifeSettings.wakeEnable")), 1),
                e("small", null, l(s(t)("lifeSettings.wakeEnableDesc")), 1)
              ])
            ])
          ]),
          e("div", Tl, [
            e("label", Al, [
              e("span", null, l(s(t)("lifeSettings.wakeNickname")), 1),
              F(e("input", {
                "onUpdate:modelValue": o[15] || (o[15] = (r) => p.wake_nickname = r),
                placeholder: s(t)("lifeSettings.wakeNicknamePlaceholder")
              }, null, 8, Il), [
                [Y, p.wake_nickname]
              ])
            ]),
            e("label", Vl, [
              e("span", null, l(s(t)("lifeSettings.asrLanguage")), 1),
              F(e("input", {
                "onUpdate:modelValue": o[16] || (o[16] = (r) => p.asr_language = r),
                placeholder: "zh",
                title: s(t)("lifeSettings.asrLanguageDesc")
              }, null, 8, Nl), [
                [Y, p.asr_language]
              ])
            ])
          ]),
          e("p", Rl, l(s(t)("lifeSettings.wakeHint")), 1)
        ]),
        e("article", Ll, [
          e("div", Ol, [
            o[37] || (o[37] = e("span", { class: "ls-ic tone-4" }, "📸", -1)),
            e("h3", null, l(s(t)("lifeSettings.media")), 1)
          ]),
          e("div", Dl, [
            e("label", zl, [
              F(e("input", {
                "onUpdate:modelValue": o[17] || (o[17] = (r) => p.voice_reply_enabled = r),
                type: "checkbox"
              }, null, 512), [
                [ue, p.voice_reply_enabled]
              ]),
              o[38] || (o[38] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Fl, [
                e("b", null, l(s(t)("lifeSettings.mediaVoice")), 1),
                e("small", null, l(s(t)("lifeSettings.mediaVoiceDesc")), 1)
              ])
            ]),
            e("label", Bl, [
              F(e("input", {
                "onUpdate:modelValue": o[18] || (o[18] = (r) => p.selfie_enabled = r),
                type: "checkbox"
              }, null, 512), [
                [ue, p.selfie_enabled]
              ]),
              o[39] || (o[39] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Hl, [
                e("b", null, l(s(t)("lifeSettings.mediaSelfie")), 1),
                e("small", null, l(s(t)("lifeSettings.mediaSelfieDesc")), 1)
              ])
            ]),
            e("label", Kl, [
              F(e("input", {
                "onUpdate:modelValue": o[19] || (o[19] = (r) => p.call_enabled = r),
                type: "checkbox"
              }, null, 512), [
                [ue, p.call_enabled]
              ]),
              o[40] || (o[40] = e("span", { class: "ls-track" }, null, -1)),
              e("span", jl, [
                e("b", null, l(s(t)("lifeSettings.mediaCall")), 1),
                e("small", null, l(s(t)("lifeSettings.mediaCallDesc")), 1)
              ])
            ])
          ]),
          e("p", Yl, l(s(t)("lifeSettings.mediaHint")), 1)
        ])
      ]),
      v.value ? (u(), c("p", Xl, l(v.value), 1)) : O("", !0)
    ]));
  }
}), Wl = /* @__PURE__ */ Me(Jl, [["__scopeId", "data-v-d91bdafc"]]), ql = "/okay-logo.svg", Gl = { class: "content-card about" }, Zl = { class: "identity" }, Ql = { class: "app-id" }, en = { class: "ver-badge" }, tn = { class: "app-desc" }, sn = { class: "identity-actions" }, ln = ["href"], nn = { class: "section" }, on = { class: "section-head" }, an = ["disabled"], rn = {
  key: 0,
  class: "alert",
  role: "alert"
}, un = {
  class: "us-hero-icon",
  "aria-hidden": "true"
}, cn = {
  key: 0,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, dn = {
  key: 1,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, pn = {
  key: 2,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, vn = { class: "us-hero-text" }, hn = { key: 0 }, mn = { key: 1 }, fn = { class: "us-hero-actions" }, gn = ["disabled"], _n = ["disabled", "title"], bn = ["href"], yn = {
  key: 2,
  class: "us-notes"
}, kn = { class: "us-notes-title" }, wn = { class: "us-notes-body" }, $n = {
  key: 3,
  class: "alert",
  role: "alert"
}, Sn = { class: "us-apply-head" }, Cn = { key: 0 }, Pn = { key: 1 }, xn = {
  key: 0,
  class: "us-chip-tag"
}, Mn = { class: "us-apply-label" }, En = {
  key: 0,
  class: "us-apply-error"
}, Un = {
  key: 1,
  class: "us-apply-log"
}, Tn = { class: "section" }, An = { class: "section-title" }, In = { class: "credits" }, Vn = ["href"], Nn = ["src", "alt"], Rn = { class: "person-info" }, Ln = { class: "name" }, On = { class: "role" }, Dn = ["src"], zn = { class: "person-info" }, Fn = { class: "role" }, Bn = { class: "section-head contributors-head" }, Hn = { class: "section-title" }, Kn = { class: "muted" }, jn = {
  key: 0,
  class: "contribs"
}, Yn = ["href"], Xn = ["src", "alt"], Jn = { class: "login" }, Wn = {
  key: 0,
  class: "count"
}, qn = {
  key: 1,
  class: "muted"
}, Gn = ["href"], Zn = { class: "foot" }, Qn = ["href"], pt = "https://github.com/RazureSOFT/0KAY", eo = "https://github.com/RazureSOFT", to = /* @__PURE__ */ ce({
  __name: "AboutPanel",
  setup(E) {
    const { t } = de(), p = x("0.1.3"), v = x([]), g = x(""), k = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, d = (T, I = 96) => `https://github.com/${T}.png?size=${I}`, w = x(!1), C = x(null), a = x(""), i = x(null), n = x("");
    let o = null;
    function r(T) {
      return i.value?.status === "running" && i.value.plugin === T;
    }
    async function m(T, I) {
      if (i.value?.status !== "running") {
        n.value = "";
        try {
          i.value = await et("/api/plugins/pm/update", { plugin: T, version: I || "" }), f();
        } catch (X) {
          n.value = X instanceof Error ? X.message : String(X);
        }
      }
    }
    async function y() {
      try {
        i.value = await ze("/api/plugins/pm/status");
      } catch {
        return;
      }
      i.value && i.value.status !== "running" && (M(), R());
    }
    function f() {
      o || (o = setInterval(y, 2e3));
    }
    function M() {
      o && (clearInterval(o), o = null);
    }
    const A = G(() => {
      switch (i.value?.status) {
        case "running":
          return t("settings.about.updating");
        case "done":
          return t("settings.about.updated");
        case "failed":
          return t("settings.about.updateFailed");
        default:
          return "";
      }
    }), K = G(() => C.value ? C.value.has_update ? "warn" : C.value.latest ? "ok" : "none" : "none");
    async function R() {
      w.value = !0, a.value = "";
      try {
        const T = await ze("/api/plugins/pm/check");
        C.value = T, T?.current && (p.value = String(T.current));
      } catch (T) {
        a.value = T instanceof Ft && T.status === 404 ? t("settings.about.unsupported") : T instanceof Error ? T.message : String(T);
      } finally {
        w.value = !1;
      }
    }
    async function L() {
      try {
        const T = { Accept: "application/vnd.github+json" }, [I, X] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: T }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: T })
        ]);
        if (!I.ok) throw new Error(`HTTP ${I.status}`);
        const ae = /* @__PURE__ */ new Map(), re = await I.json();
        for (const j of Array.isArray(re) ? re : [])
          j?.login && ae.set(j.login, j);
        if (X.ok) {
          const j = await X.json();
          for (const V of Array.isArray(j) ? j : []) {
            const U = V?.author;
            !U?.login || U.login.endsWith("[bot]") || ae.has(U.login) || ae.set(U.login, {
              login: U.login,
              avatar_url: U.avatar_url,
              html_url: U.html_url,
              contributions: 0
            });
          }
        }
        v.value = [...ae.values()].sort(
          (j, V) => (V.contributions || 0) - (j.contributions || 0) || j.login.localeCompare(V.login)
        );
      } catch (T) {
        g.value = T instanceof Error ? T.message : String(T), v.value = [];
      }
    }
    return Te(() => {
      R(), L(), ze("/api/plugins/pm/status").then((T) => {
        i.value = T, T?.status === "running" && f();
      }).catch(() => {
      });
    }), st(M), (T, I) => (u(), c("div", Gl, [
      e("header", Zl, [
        I[3] || (I[3] = e("img", {
          class: "app-icon",
          src: ql,
          alt: "",
          "aria-hidden": "true"
        }, null, -1)),
        e("div", Ql, [
          e("h2", null, [
            I[2] || (I[2] = Ue("0KAY ", -1)),
            e("span", en, "v" + l(p.value), 1)
          ]),
          e("p", tn, l(s(t)("settings.about.description")), 1)
        ]),
        e("div", sn, [
          e("a", {
            class: "btn btn-tonal sm",
            href: pt,
            target: "_blank",
            rel: "noopener noreferrer"
          }, l(s(t)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${pt}/releases`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "Releases ↗", 8, ln)
        ])
      ]),
      e("section", nn, [
        e("div", on, [
          I[4] || (I[4] = e("h3", { class: "section-title" }, "0KAY", -1)),
          e("button", {
            class: "btn btn-tonal sm",
            disabled: w.value,
            onClick: R
          }, l(s(t)(w.value ? "settings.about.checking" : "settings.about.check")), 9, an)
        ]),
        a.value ? (u(), c("p", rn, l(a.value), 1)) : (u(), c("div", {
          key: 1,
          class: ee(["us-hero", K.value])
        }, [
          e("div", un, [
            K.value === "ok" ? (u(), c("svg", cn, [...I[5] || (I[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : K.value === "warn" ? (u(), c("svg", dn, [...I[6] || (I[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (u(), c("svg", pn, [...I[7] || (I[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", vn, [
            e("b", null, l(s(t)(K.value === "warn" ? "settings.about.available" : K.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            C.value?.latest ? (u(), c("span", hn, [
              Ue("v" + l(C.value.current) + " → ", 1),
              e("em", null, "v" + l(C.value.latest), 1)
            ])) : (u(), c("span", mn, "0KAY v" + l(C.value?.current || p.value), 1))
          ]),
          e("div", fn, [
            C.value?.has_update ? (u(), c("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: r("core"),
              onClick: I[0] || (I[0] = (X) => m("core", C.value.latest))
            }, l(r("core") ? s(t)("settings.about.updating") : s(t)("settings.about.updateNow")), 9, gn)) : O("", !0),
            C.value?.source_available !== !1 ? (u(), c("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: r("core"),
              title: s(t)("settings.about.betaHint"),
              onClick: I[1] || (I[1] = (X) => m("core"))
            }, l(r("core") ? s(t)("settings.about.updating") : s(t)("settings.about.beta")), 9, _n)) : O("", !0),
            C.value?.url ? (u(), c("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: C.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, bn)) : O("", !0)
          ])
        ], 2)),
        C.value?.notes ? (u(), c("div", yn, [
          e("p", kn, l(s(t)("settings.about.whatsNew")), 1),
          e("pre", wn, l(C.value.notes), 1)
        ])) : O("", !0),
        n.value ? (u(), c("p", $n, l(n.value), 1)) : O("", !0),
        i.value && i.value.status !== "idle" ? (u(), c("div", {
          key: 4,
          class: ee(["us-apply-banner", i.value.status])
        }, [
          e("div", Sn, [
            I[8] || (I[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Ue(l(i.value.package), 1),
              i.value.version ? (u(), c("span", Cn, "@" + l(i.value.version), 1)) : (u(), c("span", Pn, " · main"))
            ]),
            i.value.mode === "source" ? (u(), c("span", xn, l(s(t)("settings.about.sourceMode")), 1)) : O("", !0),
            e("span", Mn, l(A.value), 1)
          ]),
          i.value.error ? (u(), c("p", En, l(i.value.error), 1)) : O("", !0),
          i.value.log ? (u(), c("pre", Un, l(i.value.log), 1)) : O("", !0)
        ], 2)) : O("", !0)
      ]),
      e("section", Tn, [
        e("h3", An, l(s(t)("settings.about.developerTitle")) + " & " + l(s(t)("settings.about.teamTitle")), 1),
        e("div", In, [
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
            }, null, 8, Nn),
            e("div", Rn, [
              e("span", Ln, l(k.login), 1),
              e("span", On, l(s(t)("settings.about.developerTitle")), 1)
            ]),
            I[9] || (I[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, Vn),
          e("a", {
            class: "person",
            href: eo,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: d("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, Dn),
            e("div", zn, [
              I[10] || (I[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", Fn, l(s(t)("settings.about.teamTitle")), 1)
            ]),
            I[11] || (I[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", Bn, [
          e("h3", Hn, l(s(t)("settings.about.contributorsTitle")), 1),
          e("span", Kn, l(s(t)("settings.about.contributorsFrom")), 1)
        ]),
        v.value.length ? (u(), c("div", jn, [
          (u(!0), c(J, null, ne(v.value, (X) => (u(), c("a", {
            key: X.login,
            class: "contrib",
            href: X.html_url || `https://github.com/${X.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: X.avatar_url || d(X.login, 64),
              alt: X.login,
              loading: "lazy"
            }, null, 8, Xn),
            e("span", Jn, l(X.login), 1),
            X.contributions ? (u(), c("span", Wn, l(X.contributions), 1)) : O("", !0)
          ], 8, Yn))), 128))
        ])) : (u(), c("p", qn, [
          e("a", {
            class: "repo-link",
            href: k.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "razureink ↗", 8, Gn)
        ]))
      ]),
      e("footer", Zn, [
        I[12] || (I[12] = e("span", { class: "status-chip" }, "MIT", -1)),
        I[13] || (I[13] = e("span", null, "© 2026 RazureSOFT", -1)),
        e("a", {
          class: "repo-link",
          href: `${pt}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, Qn)
      ])
    ]));
  }
}), so = /* @__PURE__ */ Me(to, [["__scopeId", "data-v-2678e07b"]]), lo = { class: "content-card updates" }, no = { class: "us-block" }, oo = { class: "us-head" }, ao = { class: "us-head-text" }, io = { class: "us-title" }, ro = { class: "us-desc" }, uo = { class: "us-source" }, co = { class: "us-input-group" }, po = ["disabled", "placeholder"], vo = ["disabled"], ho = { class: "us-chips" }, mo = ["disabled"], fo = ["disabled"], go = {
  key: 0,
  class: "us-saved"
}, _o = { class: "helper-text" }, bo = {
  key: 0,
  class: "alert"
}, yo = { class: "us-block" }, ko = { class: "us-head" }, wo = { class: "us-head-text" }, $o = { class: "us-title" }, So = { class: "us-desc" }, Co = { class: "us-head-actions" }, Po = ["disabled"], xo = {
  key: 0,
  class: "alert",
  role: "alert"
}, Mo = { class: "us-apply-head" }, Eo = { key: 0 }, Uo = { key: 1 }, To = {
  key: 0,
  class: "us-chip-tag"
}, Ao = { class: "us-apply-label" }, Io = {
  key: 0,
  class: "us-apply-error"
}, Vo = {
  key: 1,
  class: "us-apply-log"
}, No = {
  key: 2,
  class: "alert",
  role: "alert"
}, Ro = {
  key: 3,
  class: "us-table"
}, Lo = { class: "us-row us-thead" }, Oo = { class: "us-name" }, Do = { class: "us-name-text" }, zo = { class: "us-ver" }, Fo = { class: "us-status-text" }, Bo = { class: "us-actions" }, Ho = ["disabled", "onClick"], Ko = ["disabled", "onClick"], jo = ["href", "title"], Yo = {
  key: 0,
  class: "us-empty"
}, Xo = /* @__PURE__ */ ce({
  __name: "UpdatesPanel",
  setup(E) {
    const { t } = de(), p = x(!1), v = x(null), g = x(""), k = x(null), d = x("");
    let w = null;
    const C = x(""), a = x(""), i = x(!1), n = x(!1), o = x(!1), r = x(""), m = G(() => C.value.trim() !== a.value), y = G(() => C.value.trim() !== "");
    function f(j) {
      return k.value?.status === "running" && k.value.plugin === j;
    }
    async function M(j, V) {
      if (k.value?.status !== "running") {
        d.value = "";
        try {
          k.value = await et("/api/plugins/pm/update", { plugin: j, version: V || "" }), K();
        } catch (U) {
          d.value = U instanceof Error ? U.message : String(U);
        }
      }
    }
    async function A() {
      try {
        k.value = await ze("/api/plugins/pm/status");
      } catch {
        return;
      }
      k.value && k.value.status !== "running" && (R(), I());
    }
    function K() {
      w || (w = setInterval(A, 2e3));
    }
    function R() {
      w && (clearInterval(w), w = null);
    }
    const L = G(() => {
      switch (k.value?.status) {
        case "running":
          return t("settings.about.updating");
        case "done":
          return t("settings.about.updated");
        case "failed":
          return t("settings.about.updateFailed");
        default:
          return "";
      }
    }), T = G(() => (v.value || []).filter((j) => j.has_update).length);
    async function I() {
      p.value = !0, g.value = "";
      try {
        const j = await ze("/api/plugins/pm/check-plugins");
        v.value = j?.plugins || [];
      } catch (j) {
        g.value = j instanceof Ft && j.status === 404 ? t("settings.about.unsupported") : j instanceof Error ? j.message : String(j);
      } finally {
        p.value = !1;
      }
    }
    async function X() {
      i.value = !0, r.value = "";
      try {
        const j = await ze("/api/settings/updates"), V = String(j?.values?.github_proxy ?? "");
        C.value = V, a.value = V;
      } catch {
      } finally {
        i.value = !1;
      }
    }
    async function ae() {
      n.value = !0, r.value = "";
      try {
        const j = C.value.trim();
        await et("/api/settings/updates", { values: { github_proxy: j } }), a.value = j, o.value = !0, setTimeout(() => {
          o.value = !1;
        }, 1500);
      } catch (j) {
        r.value = j instanceof Error ? j.message : String(j);
      } finally {
        n.value = !1;
      }
    }
    function re(j) {
      C.value = j, ae();
    }
    return Te(() => {
      I(), X(), ze("/api/plugins/pm/status").then((j) => {
        k.value = j, j?.status === "running" && K();
      }).catch(() => {
      });
    }), st(R), (j, V) => (u(), c("div", lo, [
      e("section", no, [
        e("header", oo, [
          V[3] || (V[3] = e("span", {
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
          e("div", ao, [
            e("h3", io, l(s(t)("settings.pluginSourceTitle")), 1),
            e("p", ro, l(s(t)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: ee(["us-tag", { on: y.value }])
          }, l(y.value ? "ghproxy" : s(t)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", uo, [
          e("div", co, [
            V[4] || (V[4] = e("span", {
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
            F(e("input", {
              "onUpdate:modelValue": V[0] || (V[0] = (U) => C.value = U),
              class: "us-input",
              type: "text",
              disabled: i.value,
              placeholder: s(t)("settings.pluginSourcePlaceholder"),
              onKeyup: mt(ae, ["enter"])
            }, null, 40, po), [
              [Y, C.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: n.value || !m.value,
              onClick: ae
            }, l(s(t)("settings.save")), 9, vo)
          ]),
          e("div", ho, [
            e("button", {
              type: "button",
              class: ee(["us-chip", { active: !y.value }]),
              disabled: n.value,
              onClick: V[1] || (V[1] = (U) => re(""))
            }, l(s(t)("settings.pluginSourceDirect")), 11, mo),
            e("button", {
              type: "button",
              class: ee(["us-chip", { active: C.value.trim() === "https://gh-proxy.com" }]),
              disabled: n.value,
              onClick: V[2] || (V[2] = (U) => re("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, fo),
            o.value ? (u(), c("span", go, l(s(t)("settings.saved")), 1)) : O("", !0)
          ]),
          e("p", _o, l(s(t)("settings.pluginSourceHelp")), 1),
          r.value ? (u(), c("p", bo, l(r.value), 1)) : O("", !0)
        ])
      ]),
      V[10] || (V[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", yo, [
        e("header", ko, [
          V[5] || (V[5] = ss('<span class="us-ico" aria-hidden="true" data-v-bc3fb39c><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-bc3fb39c><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect></svg></span>', 1)),
          e("div", wo, [
            e("h3", $o, l(s(t)("settings.about.plugins")), 1),
            e("p", So, l(s(t)("settings.about.updateHint")), 1)
          ]),
          e("div", Co, [
            e("span", {
              class: ee(["us-count", { warn: T.value > 0 }])
            }, l(T.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: p.value,
              onClick: I
            }, l(s(t)(p.value ? "settings.about.checking" : "settings.about.check")), 9, Po)
          ])
        ]),
        d.value ? (u(), c("p", xo, l(d.value), 1)) : O("", !0),
        k.value && k.value.status !== "idle" ? (u(), c("div", {
          key: 1,
          class: ee(["us-apply-banner", k.value.status])
        }, [
          e("div", Mo, [
            V[6] || (V[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Ue(l(k.value.package), 1),
              k.value.version ? (u(), c("span", Eo, "@" + l(k.value.version), 1)) : (u(), c("span", Uo, " · main"))
            ]),
            k.value.mode === "source" ? (u(), c("span", To, l(s(t)("settings.about.sourceMode")), 1)) : O("", !0),
            e("span", Ao, l(L.value), 1)
          ]),
          k.value.error ? (u(), c("p", Io, l(k.value.error), 1)) : O("", !0),
          k.value.log ? (u(), c("pre", Vo, l(k.value.log), 1)) : O("", !0)
        ], 2)) : O("", !0),
        g.value ? (u(), c("p", No, l(g.value), 1)) : O("", !0),
        v.value ? (u(), c("div", Ro, [
          e("div", Lo, [
            e("span", null, l(s(t)("plugins.updatesColPlugin")), 1),
            e("span", null, l(s(t)("plugins.updatesColVersion")), 1),
            e("span", null, l(s(t)("plugins.updatesColStatus")), 1),
            V[7] || (V[7] = e("span", null, null, -1))
          ]),
          (u(!0), c(J, null, ne(v.value, (U) => (u(), c("div", {
            key: U.name,
            class: "us-row"
          }, [
            e("span", Oo, [
              e("span", {
                class: ee(["us-dot", U.error ? "bad" : U.has_update ? "warn" : U.latest ? "ok" : ""])
              }, null, 2),
              e("span", Do, l(U.name), 1)
            ]),
            e("span", zo, [
              e("em", null, "v" + l(U.version || "—"), 1),
              V[8] || (V[8] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: ee({ good: !!U.latest })
              }, l(U.latest ? `v${U.latest}` : "—"), 3)
            ]),
            e("span", {
              class: ee(["us-status", U.error ? "bad" : U.has_update ? "warn" : U.latest ? "ok" : ""])
            }, [
              e("span", Fo, l(U.error || s(t)(U.has_update ? "settings.about.available" : U.latest ? "settings.about.latest" : "settings.about.noRelease")), 1)
            ], 2),
            e("span", Bo, [
              U.can_update && U.has_update ? (u(), c("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: f(U.name),
                onClick: (Ee) => M(U.name, U.latest)
              }, l(f(U.name) ? s(t)("settings.about.updating") : s(t)("settings.about.updateNow")), 9, Ho)) : U.can_update ? (u(), c("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: f(U.name),
                onClick: (Ee) => M(U.name)
              }, l(f(U.name) ? s(t)("settings.about.updating") : s(t)("settings.about.syncNow")), 9, Ko)) : O("", !0),
              U.repository ? (u(), c("a", {
                key: 2,
                class: "us-repo",
                href: U.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: U.repository
              }, l(s(t)("plugins.updatesColRepo")) + " ↗", 9, jo)) : O("", !0)
            ])
          ]))), 128)),
          v.value.length ? O("", !0) : (u(), c("p", Yo, l(s(t)("settings.about.noPlugins")), 1))
        ])) : O("", !0),
        V[9] || (V[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), Jo = /* @__PURE__ */ Me(Xo, [["__scopeId", "data-v-bc3fb39c"]]), Wo = { class: "content-card provider-panel" }, qo = { class: "pp-editor-head" }, Go = ["aria-label"], Zo = { class: "pp-editor-title" }, Qo = { class: "card-desc" }, ea = { class: "pp-section" }, ta = { class: "pp-section-title" }, sa = { class: "pp-grid" }, la = { class: "field" }, na = { class: "field" }, oa = {
  key: 0,
  class: "pp-req"
}, aa = ["placeholder"], ia = { class: "field pp-span" }, ra = ["placeholder"], ua = { class: "field" }, ca = { class: "helper-text" }, da = { class: "field" }, pa = { class: "helper-text" }, va = { class: "pp-section" }, ha = { class: "pp-section-head" }, ma = { class: "pp-section-title" }, fa = ["disabled"], ga = { class: "field" }, _a = { class: "pp-key" }, ba = ["type", "placeholder"], ya = {
  key: 0,
  class: "helper-text"
}, ka = {
  key: 1,
  class: "pp-probe err"
}, wa = {
  key: 2,
  class: "pp-probe ok"
}, $a = { class: "pp-section" }, Sa = { class: "pp-section-head" }, Ca = { class: "pp-section-title" }, Pa = { class: "pp-count" }, xa = ["disabled"], Ma = {
  key: 0,
  class: "pp-discovered"
}, Ea = { class: "pp-model-tools" }, Ua = ["placeholder"], Ta = { class: "pp-add-model" }, Aa = ["placeholder", "aria-label", "onKeydown"], Ia = ["disabled"], Va = {
  key: 1,
  class: "helper-text pp-add-error"
}, Na = {
  key: 2,
  class: "pp-models"
}, Ra = ["title"], La = ["value", "title", "onChange"], Oa = ["value"], Da = ["title", "disabled", "onClick"], za = ["title"], Fa = ["checked", "onChange"], Ba = ["title", "aria-label", "onClick"], Ha = {
  key: 0,
  class: "helper-text"
}, Ka = {
  key: 3,
  class: "helper-text"
}, ja = {
  key: 0,
  class: "pp-error",
  role: "alert"
}, Ya = { class: "pp-editor-actions" }, Xa = ["disabled"], Ja = { class: "pp-list-head" }, Wa = { class: "card-desc" }, qa = { class: "pp-list-actions" }, Ga = {
  key: 0,
  class: "pp-cards"
}, Za = { class: "pp-card-head" }, Qa = { class: "pp-logo" }, ei = ["src", "alt"], ti = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, si = { class: "pp-card-id" }, li = ["title"], ni = { class: "pp-card-badges" }, oi = {
  key: 0,
  class: "pp-badge primary"
}, ai = { class: "pp-badge" }, ii = { class: "pp-card-status" }, ri = {
  key: 0,
  class: "pp-meta"
}, ui = ["title"], ci = { class: "pp-chips" }, di = {
  key: 0,
  class: "pp-chip more"
}, pi = {
  key: 1,
  class: "pp-chip empty"
}, vi = { class: "pp-card-actions" }, hi = ["onClick"], mi = ["disabled", "onClick"], fi = ["disabled", "onClick"], gi = ["onClick"], _i = ["onClick"], bi = {
  key: 1,
  class: "pp-empty"
}, yi = /* @__PURE__ */ ce({
  __name: "ProviderPanel",
  setup(E) {
    const { t } = de(), { confirm: p } = qe(), v = cs(), g = x({}), k = x("list"), d = x(null), w = x(""), C = x({ state: "idle" }), a = x([]), i = x(""), n = x(!1), o = x(!1), r = x(!1);
    Te(async () => {
      await v.fetchAll();
      for (const b of v.providers) X(b);
    });
    function m(b) {
      return dt.find((P) => P.id === b) || null;
    }
    function y(b) {
      return b.name && b.name.trim() ? b.name.trim() : m(b.provider)?.name || b.provider;
    }
    function f(b) {
      return m(b.provider)?.logo || "";
    }
    const M = G(() => [
      { value: "chat", label: t("modelType.chat") },
      { value: "embedding", label: t("modelType.embedding") },
      { value: "rerank", label: t("modelType.rerank") },
      { value: "vision", label: t("modelType.vision") },
      { value: "tts", label: t("modelType.tts") },
      { value: "image", label: t("modelType.image") },
      { value: "audio", label: t("modelType.audio") }
    ]);
    function A(b) {
      return (d.value?.model_types || {})[b] || "chat";
    }
    function K(b, P) {
      if (!d.value) return;
      const S = { ...d.value.model_types || {} };
      !P || P === "chat" ? delete S[b] : S[b] = P, d.value.model_types = S;
    }
    function R(b) {
      const P = new Set(b.disabled_models || []);
      return b.models.filter((S) => !P.has(S));
    }
    function L(b) {
      return v.defaultProviderId === b.id;
    }
    function T(b) {
      const P = d.value;
      if (!P) return;
      const S = dt.find((Z) => Z.id === b);
      S?.baseUrl && !P.base_url && (P.base_url = S.baseUrl), P.format = S?.format || "";
    }
    async function I(b, P = "") {
      if (!b.base_url) return { state: "error", message: t("settings.baseUrlRequired") };
      const S = performance.now();
      try {
        const Z = await fetch("/api/models/fetch", {
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
        if (!Z.ok) throw new Error(`HTTP ${Z.status}`);
        const $e = await Z.json(), D = Math.round(performance.now() - S);
        return $e.source === "api" && Array.isArray($e.models) && $e.models.length ? { state: "ok", count: $e.models.length, ms: D, models: $e.models } : { state: "error", message: $e.error || t("settings.connectionFailed"), ms: D };
      } catch (Z) {
        return { state: "error", message: Z instanceof Error ? Z.message : String(Z) };
      }
    }
    async function X(b, P = "") {
      g.value = { ...g.value, [b.id]: { state: "checking" } };
      const S = await I(b, P);
      g.value = { ...g.value, [b.id]: S };
    }
    function ae() {
      for (const b of v.providers) X(b);
    }
    function re() {
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
      }, w.value = "", C.value = { state: "idle" }, a.value = [], i.value = "", n.value = !1, o.value = !1, k.value = "edit";
    }
    function j(b) {
      d.value = {
        ...b,
        api_key: "",
        name: b.name || "",
        models: [...b.models],
        disabled_models: [...b.disabled_models || []],
        format: b.format || "",
        model_types: { ...b.model_types || {} }
      }, o.value = !!b.api_key_masked, w.value = "", C.value = { state: "idle" }, a.value = [], i.value = "", n.value = !1, k.value = "edit";
    }
    function V() {
      k.value = "list", d.value = null, w.value = "";
    }
    async function U() {
      const b = d.value;
      if (!b) return;
      w.value = "";
      const P = (b.name || "").trim();
      if (!b.base_url.trim()) {
        w.value = t("settings.baseUrlRequired");
        return;
      }
      if (b.provider === "custom" && !P) {
        w.value = t("settings.providerNameRequired");
        return;
      }
      if (!b.models.length) {
        w.value = t("settings.modelsRequired");
        return;
      }
      b.id || (b.id = `${b.provider}_${Date.now().toString(36)}`), b.name = P, b.disabled_models = (b.disabled_models || []).filter((S) => b.models.includes(S)), (!b.default_model || !b.models.includes(b.default_model) || b.disabled_models.includes(b.default_model)) && (b.default_model = R(b)[0] || b.models[0]), r.value = !0;
      try {
        await v.upsert({ ...b }), v.defaultProviderId || await v.setDefaults(b.id, b.default_model), V(), X(v.providers.find((S) => S.id === b.id) || b);
      } catch (S) {
        w.value = S instanceof Error ? S.message : String(S);
      } finally {
        r.value = !1;
      }
    }
    async function Ee(b) {
      if (await p({
        title: t("settings.remove"),
        message: `${t("settings.remove")} ${y(b)}?`,
        confirmLabel: t("settings.remove"),
        danger: !0
      }))
        try {
          await v.remove(b.id);
        } catch {
        }
    }
    async function Ce(b) {
      try {
        await v.upsert({ ...b, enabled: !b.enabled });
      } catch {
      }
    }
    async function oe(b) {
      const P = b.default_model || R(b)[0] || b.models[0] || "";
      try {
        await v.setDefaults(b.id, P);
      } catch {
      }
    }
    async function Ve() {
      const b = d.value;
      if (!b) return;
      C.value = { state: "checking" };
      const P = await I(b, b.api_key);
      C.value = P, P.state === "ok" && P.models && (a.value = P.models);
    }
    function le() {
      const b = d.value;
      !b || !a.value.length || (b.models = [...a.value], b.disabled_models = (b.disabled_models || []).filter((P) => b.models.includes(P)), b.models.includes(b.default_model) || (b.default_model = ""));
    }
    function ie(b) {
      const P = d.value;
      if (!P) return;
      const S = new Set(P.disabled_models || []);
      S.has(b) ? S.delete(b) : S.add(b), P.disabled_models = [...S], S.has(P.default_model) && (P.default_model = R(P)[0] || "");
    }
    function Le(b) {
      const P = d.value;
      P && (P.default_model = b, P.disabled_models = (P.disabled_models || []).filter((S) => S !== b));
    }
    const ge = x(""), ye = x("");
    function ke() {
      const b = d.value;
      if (!b) return;
      const P = ge.value.trim();
      if (ye.value = "", !!P) {
        if (b.models.includes(P)) {
          ye.value = t("settings.modelExists", { name: P });
          return;
        }
        b.models = [...b.models, P], b.disabled_models = (b.disabled_models || []).filter((S) => S !== P), b.default_model || (b.default_model = P), ge.value = "";
      }
    }
    function we(b) {
      const P = d.value;
      if (P) {
        if (P.models = P.models.filter((S) => S !== b), P.disabled_models = (P.disabled_models || []).filter((S) => S !== b), P.model_types) {
          const S = { ...P.model_types };
          delete S[b], P.model_types = S;
        }
        P.default_model === b && (P.default_model = R(P)[0] || P.models[0] || "");
      }
    }
    function Pe(b) {
      const P = d.value;
      P && (P.disabled_models = b ? [] : [...P.models]);
    }
    function pe() {
      const b = d.value;
      if (!b) return;
      const P = new Set(b.disabled_models || []);
      b.disabled_models = b.models.filter((S) => !P.has(S));
    }
    const ve = G(() => {
      const b = d.value?.models || [], P = i.value.trim().toLowerCase();
      return P ? b.filter((S) => S.toLowerCase().includes(P)) : b;
    }), Be = G(() => d.value ? R(d.value).length : 0);
    function Oe() {
      return t("settings.fetchedSummary", { n: a.value.length });
    }
    const De = G(() => [
      { value: "", label: t("settings.formatAuto") },
      { value: "openai", label: t("settings.formatOpenai") },
      { value: "anthropic", label: t("settings.formatAnthropic") }
    ]), Ae = G(
      () => dt.map((b) => ({ value: b.id, label: t(`providers.${b.id}.name`, b.name) }))
    );
    return (b, P) => (u(), c("div", Wo, [
      k.value === "edit" && d.value ? (u(), c(J, { key: 0 }, [
        e("div", qo, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: V,
            "aria-label": s(t)("settings.back")
          }, [...P[12] || (P[12] = [
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
          ])], 8, Go),
          e("div", Zo, [
            e("h2", null, l(d.value.id ? s(t)("settings.edit") : s(t)("settings.addProvider")), 1),
            e("p", Qo, l(s(t)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: ee(["pp-status", C.value.state])
          }, [
            P[13] || (P[13] = e("span", { class: "pp-dot" }, null, -1)),
            Ue(" " + l(C.value.state === "checking" ? s(t)("settings.testing") : C.value.state === "ok" ? s(t)("settings.connectionOk") : C.value.state === "error" ? s(t)("settings.connectionFailed") : s(t)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", ea, [
          e("h3", ta, l(s(t)("settings.providerSectionBasic")), 1),
          e("div", sa, [
            e("div", la, [
              e("label", null, l(s(t)("wizard.provider")), 1),
              fe(s(Ye), {
                modelValue: d.value.provider,
                "onUpdate:modelValue": P[0] || (P[0] = (S) => d.value.provider = S),
                class: "input",
                "aria-label": s(t)("wizard.provider"),
                options: Ae.value,
                onChange: T
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", na, [
              e("label", null, [
                Ue(l(s(t)("settings.providerName")) + " ", 1),
                d.value.provider === "custom" ? (u(), c("span", oa, "*")) : O("", !0)
              ]),
              F(e("input", {
                "onUpdate:modelValue": P[1] || (P[1] = (S) => d.value.name = S),
                placeholder: s(t)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, aa), [
                [Y, d.value.name]
              ])
            ]),
            e("div", ia, [
              e("label", null, l(s(t)("wizard.baseUrl")), 1),
              F(e("input", {
                "onUpdate:modelValue": P[2] || (P[2] = (S) => d.value.base_url = S),
                placeholder: s(t)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, ra), [
                [Y, d.value.base_url]
              ])
            ]),
            e("div", ua, [
              e("label", null, l(s(t)("settings.apiFormat")), 1),
              fe(s(Ye), {
                modelValue: d.value.format,
                "onUpdate:modelValue": P[3] || (P[3] = (S) => d.value.format = S),
                class: "input",
                "aria-label": s(t)("settings.apiFormat"),
                options: De.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", ca, l(s(t)("settings.apiFormatHint")), 1)
            ]),
            e("div", da, [
              e("label", null, l(s(t)("wizard.defaultModel")), 1),
              fe(s(Ye), {
                modelValue: d.value.default_model,
                "onUpdate:modelValue": P[4] || (P[4] = (S) => d.value.default_model = S),
                class: "input",
                "aria-label": s(t)("wizard.defaultModel"),
                options: R(d.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", pa, l(s(t)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", va, [
          e("div", ha, [
            e("h3", ma, l(s(t)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: C.value.state === "checking",
              onClick: Ve
            }, l(C.value.state === "checking" ? s(t)("settings.testing") : s(t)("settings.testConnection")), 9, fa)
          ]),
          e("div", ga, [
            e("label", null, l(s(t)("wizard.apiKey")), 1),
            e("div", _a, [
              F(e("input", {
                "onUpdate:modelValue": P[5] || (P[5] = (S) => d.value.api_key = S),
                type: n.value ? "text" : "password",
                placeholder: o.value ? s(t)("settings.apiKeyKept") : s(t)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, ba), [
                [ls, d.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: P[6] || (P[6] = (S) => n.value = !n.value)
              }, l(n.value ? s(t)("settings.hideKey") : s(t)("settings.showKey")), 1)
            ]),
            o.value ? (u(), c("p", ya, l(s(t)("settings.apiKeyKeptHint")), 1)) : O("", !0),
            C.value.state === "error" ? (u(), c("p", ka, l(C.value.message), 1)) : C.value.state === "ok" ? (u(), c("p", wa, l(s(t)("settings.connectionOk")) + " · " + l(Oe()) + " · " + l(C.value.ms) + "ms ", 1)) : O("", !0)
          ])
        ]),
        e("section", $a, [
          e("div", Sa, [
            e("h3", Ca, [
              Ue(l(s(t)("settings.providerSectionModels")) + " ", 1),
              e("span", Pa, l(Be.value) + "/" + l(d.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: C.value.state === "checking",
              onClick: Ve
            }, l(s(t)("settings.fetchModels")), 9, xa)
          ]),
          a.value.length && a.value.join("\0") !== d.value.models.join("\0") ? (u(), c("div", Ma, [
            e("span", null, l(Oe()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: le
            }, l(s(t)("settings.applyFetched")), 1)
          ])) : O("", !0),
          e("div", Ea, [
            F(e("input", {
              "onUpdate:modelValue": P[7] || (P[7] = (S) => i.value = S),
              class: "input pp-search",
              placeholder: s(t)("settings.searchModels")
            }, null, 8, Ua), [
              [Y, i.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[8] || (P[8] = (S) => Pe(!0))
            }, l(s(t)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[9] || (P[9] = (S) => pe())
            }, l(s(t)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[10] || (P[10] = (S) => Pe(!1))
            }, l(s(t)("settings.clearSelection")), 1)
          ]),
          e("div", Ta, [
            F(e("input", {
              "onUpdate:modelValue": P[11] || (P[11] = (S) => ge.value = S),
              class: "input",
              placeholder: s(t)("settings.addModelPlaceholder"),
              "aria-label": s(t)("settings.addModelPlaceholder"),
              onKeydown: mt(Re(ke, ["prevent"]), ["enter"])
            }, null, 40, Aa), [
              [Y, ge.value]
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: !ge.value.trim(),
              onClick: ke
            }, l(s(t)("settings.addModel")), 9, Ia)
          ]),
          ye.value ? (u(), c("p", Va, l(ye.value), 1)) : O("", !0),
          d.value.models.length ? (u(), c("div", Na, [
            (u(!0), c(J, null, ne(ve.value, (S) => (u(), c("div", {
              key: S,
              class: ee(["pp-model", { off: (d.value.disabled_models || []).includes(S) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: S
              }, l(S), 9, Ra),
              e("select", {
                class: ee(["pp-type", { tagged: A(S) !== "chat" }]),
                value: A(S),
                title: s(t)("settings.providerModelType"),
                onChange: (Z) => K(S, Z.target.value)
              }, [
                (u(!0), c(J, null, ne(M.value, (Z) => (u(), c("option", {
                  key: Z.value,
                  value: Z.value
                }, l(Z.label), 9, Oa))), 128))
              ], 42, La),
              d.value.default_model !== S ? (u(), c("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: s(t)("settings.makeDefault"),
                disabled: (d.value.disabled_models || []).includes(S),
                onClick: (Z) => Le(S)
              }, "☆", 8, Da)) : (u(), c("span", {
                key: 1,
                class: "pp-star on",
                title: s(t)("wizard.defaultModel")
              }, "★", 8, za)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(d.value.disabled_models || []).includes(S),
                onChange: (Z) => ie(S)
              }, null, 40, Fa),
              e("button", {
                class: "pp-remove",
                type: "button",
                title: s(t)("settings.removeModel", { name: S }),
                "aria-label": s(t)("settings.removeModel", { name: S }),
                onClick: (Z) => we(S)
              }, "×", 8, Ba)
            ], 2))), 128)),
            ve.value.length ? O("", !0) : (u(), c("p", Ha, l(s(t)("settings.searchModels")), 1))
          ])) : (u(), c("p", Ka, l(s(t)("settings.noModelsYet")), 1))
        ]),
        w.value ? (u(), c("p", ja, l(w.value), 1)) : O("", !0),
        e("div", Ya, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: r.value,
            onClick: U
          }, l(r.value ? s(t)("settings.saving") : s(t)("settings.save")), 9, Xa),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: V
          }, l(s(t)("settings.cancel")), 1)
        ])
      ], 64)) : (u(), c(J, { key: 1 }, [
        e("div", Ja, [
          e("div", null, [
            e("h2", null, l(s(t)("settings.tabs.provider")), 1),
            e("p", Wa, l(s(t)("settings.providerDesc")), 1)
          ]),
          e("div", qa, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: ae
            }, l(s(t)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: re
            }, "+ " + l(s(t)("settings.addProvider")), 1)
          ])
        ]),
        s(v).providers.length ? (u(), c("div", Ga, [
          (u(!0), c(J, null, ne(s(v).providers, (S) => (u(), c("article", {
            key: S.id,
            class: ee(["pp-card", { off: !S.enabled, default: L(S) }])
          }, [
            e("header", Za, [
              e("span", Qa, [
                f(S) ? (u(), c("img", {
                  key: 0,
                  src: f(S),
                  alt: y(S)
                }, null, 8, ei)) : (u(), c("svg", ti, [...P[14] || (P[14] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", si, [
                e("strong", null, l(y(S)), 1),
                e("code", {
                  title: S.base_url
                }, l(S.base_url || "—"), 9, li)
              ]),
              e("div", ni, [
                L(S) ? (u(), c("span", oi, l(s(t)("settings.default")), 1)) : O("", !0),
                e("span", ai, l(R(S).length) + "/" + l(S.models.length), 1)
              ])
            ]),
            e("div", ii, [
              e("span", {
                class: ee(["pp-status", g.value[S.id]?.state || "idle"])
              }, [
                P[15] || (P[15] = e("span", { class: "pp-dot" }, null, -1)),
                Ue(" " + l(g.value[S.id]?.state === "checking" ? s(t)("settings.testing") : g.value[S.id]?.state === "ok" ? s(t)("settings.connectionOk") : g.value[S.id]?.state === "error" ? s(t)("settings.connectionFailed") : s(t)("settings.statusIdle")), 1)
              ], 2),
              g.value[S.id]?.state === "ok" ? (u(), c("span", ri, l(s(t)("settings.fetchedSummary", { n: g.value[S.id]?.count || 0 })) + " · " + l(g.value[S.id]?.ms) + "ms", 1)) : g.value[S.id]?.state === "error" ? (u(), c("span", {
                key: 1,
                class: "pp-meta err",
                title: g.value[S.id]?.message
              }, l(g.value[S.id]?.message), 9, ui)) : O("", !0)
            ]),
            e("div", ci, [
              (u(!0), c(J, null, ne(R(S).slice(0, 6), (Z) => (u(), c("span", {
                key: Z,
                class: "pp-chip"
              }, l(Z), 1))), 128)),
              R(S).length > 6 ? (u(), c("span", di, "+" + l(R(S).length - 6), 1)) : O("", !0),
              S.models.length ? O("", !0) : (u(), c("span", pi, l(s(t)("settings.noModelsYet")), 1))
            ]),
            e("footer", vi, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (Z) => j(S)
              }, l(s(t)("settings.edit")), 9, hi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: g.value[S.id]?.state === "checking",
                onClick: (Z) => X(S)
              }, l(s(t)("settings.testConnection")), 9, mi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: L(S),
                onClick: (Z) => oe(S)
              }, l(s(t)("settings.makeDefault")), 9, fi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (Z) => Ce(S)
              }, l(S.enabled ? s(t)("settings.disableProvider") : s(t)("settings.enableProvider")), 9, gi),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (Z) => Ee(S)
              }, l(s(t)("settings.remove")), 9, _i)
            ])
          ], 2))), 128))
        ])) : (u(), c("div", bi, [
          e("p", null, l(s(t)("settings.noProviders")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: re
          }, "+ " + l(s(t)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), ki = /* @__PURE__ */ Me(yi, [["__scopeId", "data-v-33dae46a"]]), wi = { class: "pairing-panel" }, $i = {
  key: 0,
  class: "pairing-error",
  role: "alert"
}, Si = { key: 1 }, Ci = { key: 0 }, Pi = ["onClick"], xi = ["onClick"], Mi = ["disabled", "onClick"], Ei = /* @__PURE__ */ ce({
  __name: "PairingPanel",
  setup(E) {
    const { t } = de(), { confirm: p } = qe(), v = x([]), g = x([]), k = x(""), d = x("");
    let w;
    async function C() {
      try {
        const n = await fetch("/api/pairing/pending");
        if (!n.ok) throw new Error(await n.text());
        v.value = (await n.json()).requests || [];
      } catch (n) {
        k.value = n.message;
      }
      try {
        const n = await fetch("/api/pairing/devices");
        n.ok && (g.value = (await n.json()).devices || []);
      } catch {
      }
    }
    async function a(n, o) {
      try {
        const r = await fetch("/api/pairing/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...n, allow: o })
        });
        if (!r.ok) throw new Error(await r.text());
        await C();
      } catch (r) {
        k.value = r.message;
      }
    }
    async function i(n) {
      if (!(d.value || !await p({
        title: t("pairing.disconnect"),
        message: t("pairing.disconnectConfirm", { name: n.name || n.id }),
        confirmLabel: t("pairing.disconnect"),
        danger: !0
      }))) {
        d.value = n.id;
        try {
          const r = await fetch("/api/pairing/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: n.id })
          });
          if (!r.ok) throw new Error(await r.text());
          await C();
        } catch (r) {
          k.value = r.message;
        } finally {
          d.value = "";
        }
      }
    }
    return Te(() => {
      C(), w = setInterval(C, 3e3);
    }), st(() => clearInterval(w)), (n, o) => (u(), c("section", wi, [
      e("h3", null, l(s(t)("pairing.title")), 1),
      e("p", null, l(s(t)("pairing.hint")), 1),
      k.value ? (u(), c("p", $i, l(k.value), 1)) : O("", !0),
      v.value.length ? O("", !0) : (u(), c("p", Si, l(s(t)("pairing.empty")), 1)),
      fe(At, {
        tag: "div",
        name: "pair",
        class: "pairing-list"
      }, {
        default: Qe(() => [
          (u(!0), c(J, null, ne(v.value, (r) => (u(), c("article", {
            key: r.id
          }, [
            e("strong", null, l(r.name), 1),
            e("code", null, l(r.code), 1),
            r.approved ? (u(), c("span", Ci, l(s(t)("pairing.approved")), 1)) : (u(), c(J, { key: 1 }, [
              e("button", {
                type: "button",
                class: "btn btn-ghost",
                onClick: (m) => a(r, !1)
              }, l(s(t)("pairing.deny")), 9, Pi),
              e("button", {
                type: "button",
                class: "btn btn-primary",
                onClick: (m) => a(r, !0)
              }, l(s(t)("pairing.allow")), 9, xi)
            ], 64))
          ]))), 128))
        ]),
        _: 1
      }),
      g.value.length ? (u(), c(J, { key: 2 }, [
        e("h4", null, l(s(t)("pairing.pairedCount", { n: g.value.length })), 1),
        fe(At, {
          tag: "div",
          name: "pair",
          class: "pairing-list"
        }, {
          default: Qe(() => [
            (u(!0), c(J, null, ne(g.value, (r) => (u(), c("article", {
              key: r.id
            }, [
              e("strong", null, l(r.name || r.id), 1),
              e("button", {
                type: "button",
                class: "btn btn-danger-tonal",
                disabled: d.value === r.id,
                onClick: (m) => i(r)
              }, l(d.value === r.id ? s(t)("pairing.disconnecting") : s(t)("pairing.disconnect")), 9, Mi)
            ]))), 128))
          ]),
          _: 1
        })
      ], 64)) : O("", !0)
    ]));
  }
}), Ui = /* @__PURE__ */ Me(Ei, [["__scopeId", "data-v-67a1ff9e"]]), Ti = { class: "content-card" }, Ai = { class: "card-desc" }, Ii = { class: "field" }, Vi = ["aria-label"], Ni = ["aria-pressed", "onClick"], Ri = /* @__PURE__ */ ce({
  __name: "GeneralPanel",
  setup(E) {
    const { t } = de(), p = x(ds());
    function v(g) {
      p.value = g, vs(g);
    }
    return (g, k) => (u(), c("div", Ti, [
      e("h2", null, l(s(t)("settings.tabs.general")), 1),
      e("p", Ai, l(s(t)("settings.generalDesc")), 1),
      e("div", Ii, [
        e("label", null, l(s(t)("settings.language")), 1),
        e("div", {
          class: "segmented",
          role: "group",
          "aria-label": s(t)("settings.language")
        }, [
          (u(!0), c(J, null, ne(s(ps), (d) => (u(), c("button", {
            key: d.code,
            class: ee(["seg", { active: p.value === d.code }]),
            "aria-pressed": p.value === d.code,
            onClick: (w) => v(d.code)
          }, l(d.label), 11, Ni))), 128))
        ], 8, Vi)
      ]),
      fe(Ui)
    ]));
  }
}), Li = { class: "models-field" }, Oi = {
  key: 0,
  class: "models-list"
}, Di = { class: "models-rank" }, zi = ["title"], Fi = { class: "models-actions" }, Bi = ["disabled", "aria-label", "onClick"], Hi = ["disabled", "aria-label", "onClick"], Ki = ["aria-label", "onClick"], ji = {
  key: 1,
  class: "models-empty"
}, Yi = /* @__PURE__ */ ce({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(E, { emit: t }) {
    const { t: p } = de(), v = E, g = t, k = G(() => String(v.modelValue || "").split(",").map((n) => n.trim()).filter(Boolean)), d = G(() => v.options.filter((n) => !k.value.includes(n)));
    function w(n) {
      g("update:modelValue", n.join(","));
    }
    function C(n) {
      n && !k.value.includes(n) && w([...k.value, n]);
    }
    function a(n) {
      w(k.value.filter((o) => o !== n));
    }
    function i(n, o) {
      const r = [...k.value], m = n + o;
      m < 0 || m >= r.length || ([r[n], r[m]] = [r[m], r[n]], w(r));
    }
    return (n, o) => (u(), c("div", Li, [
      k.value.length ? (u(), c("ol", Oi, [
        (u(!0), c(J, null, ne(k.value, (r, m) => (u(), c("li", { key: r }, [
          e("span", Di, l(m + 1), 1),
          e("span", {
            class: "models-name",
            title: r
          }, l(r), 9, zi),
          e("span", Fi, [
            e("button", {
              type: "button",
              disabled: m === 0,
              "aria-label": s(p)("models.higher"),
              onClick: (y) => i(m, -1)
            }, "↑", 8, Bi),
            e("button", {
              type: "button",
              disabled: m === k.value.length - 1,
              "aria-label": s(p)("models.lower"),
              onClick: (y) => i(m, 1)
            }, "↓", 8, Hi),
            e("button", {
              type: "button",
              "aria-label": s(p)("common.remove"),
              onClick: (y) => a(r)
            }, "✕", 8, Ki)
          ])
        ]))), 128))
      ])) : (u(), c("p", ji, l(s(p)("models.empty")), 1)),
      d.value.length ? (u(), me(s(Ye), {
        key: 2,
        options: d.value,
        "model-value": "",
        placeholder: s(p)("models.addPlaceholder"),
        "onUpdate:modelValue": C
      }, null, 8, ["options", "placeholder"])) : O("", !0)
    ]));
  }
}), Xi = /* @__PURE__ */ Me(Yi, [["__scopeId", "data-v-b6ad9d20"]]), Ji = { class: "field" }, Wi = {
  key: 0,
  class: "toggle-label"
}, qi = ["checked"], Gi = { key: 0 }, Zi = {
  key: 1,
  class: "helper-text"
}, Qi = {
  key: 1,
  class: "field-note"
}, er = { key: 0 }, tr = ["for"], sr = {
  key: 0,
  class: "helper-text"
}, lr = ["for"], nr = {
  key: 0,
  class: "helper-text"
}, or = ["for"], ar = {
  key: 0,
  class: "helper-text"
}, ir = ["for"], rr = { class: "path-row" }, ur = ["id", "value", "placeholder"], cr = {
  key: 0,
  class: "helper-text"
}, dr = ["for"], pr = ["id", "type", "value"], vr = {
  key: 0,
  class: "helper-text"
}, vt = /* @__PURE__ */ ce({
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
  setup(E, { emit: t }) {
    const { t: p } = de(), v = E, g = t;
    function k() {
      return `field-${v.sectionId}-${v.field.key}`;
    }
    function d(w) {
      const C = w.target.value;
      g("update:modelValue", v.field.type === "number" ? Number(C) : C);
    }
    return (w, C) => (u(), c("div", Ji, [
      E.field.type === "bool" ? (u(), c("label", Wi, [
        e("input", {
          type: "checkbox",
          checked: !!E.modelValue,
          onChange: C[0] || (C[0] = (a) => g("update:modelValue", a.target.checked))
        }, null, 40, qi),
        C[5] || (C[5] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(E.label), 1),
          E.help ? (u(), c("br", Gi)) : O("", !0),
          E.help ? (u(), c("small", Zi, l(E.help), 1)) : O("", !0)
        ])
      ])) : E.field.type === "note" ? (u(), c("div", Qi, [
        E.label ? (u(), c("strong", er, l(E.label), 1)) : O("", !0),
        fe(s(hs), {
          content: E.help || ""
        }, null, 8, ["content"])
      ])) : E.field.type === "select" ? (u(), c(J, { key: 2 }, [
        e("label", {
          for: k()
        }, l(E.label), 9, tr),
        fe(s(Ye), {
          "input-id": k(),
          class: "input",
          "aria-label": E.label,
          "model-value": String(E.modelValue ?? ""),
          options: E.field.options ?? E.options ?? [],
          "onUpdate:modelValue": C[1] || (C[1] = (a) => g("update:modelValue", a))
        }, null, 8, ["input-id", "aria-label", "model-value", "options"]),
        E.help ? (u(), c("p", sr, l(E.help), 1)) : O("", !0)
      ], 64)) : E.field.type === "model" ? (u(), c(J, { key: 3 }, [
        e("label", {
          for: k()
        }, l(E.label), 9, lr),
        fe(s(Ye), {
          "input-id": k(),
          class: "input",
          "aria-label": E.label,
          "model-value": String(E.modelValue ?? ""),
          options: E.modelOptions || [],
          "onUpdate:modelValue": C[2] || (C[2] = (a) => g("update:modelValue", a))
        }, null, 8, ["input-id", "aria-label", "model-value", "options"]),
        E.help ? (u(), c("p", nr, l(E.help), 1)) : O("", !0)
      ], 64)) : E.field.type === "models" ? (u(), c(J, { key: 4 }, [
        e("label", {
          for: k()
        }, l(E.label), 9, or),
        fe(Xi, {
          "model-value": String(E.modelValue ?? ""),
          options: E.availableModels || [],
          "onUpdate:modelValue": C[3] || (C[3] = (a) => g("update:modelValue", a))
        }, null, 8, ["model-value", "options"]),
        E.help ? (u(), c("p", ar, l(E.help), 1)) : O("", !0)
      ], 64)) : E.field.type === "dir" ? (u(), c(J, { key: 5 }, [
        e("label", {
          for: k()
        }, l(E.label), 9, ir),
        e("div", rr, [
          e("input", {
            id: k(),
            class: "input",
            type: "text",
            spellcheck: "false",
            value: String(E.modelValue ?? ""),
            placeholder: E.field.default_value || "",
            onInput: d
          }, null, 40, ur),
          e("button", {
            class: "btn btn-tonal compact",
            type: "button",
            onClick: C[4] || (C[4] = (a) => g("browse"))
          }, l(s(p)("settings.browse")), 1)
        ]),
        E.help ? (u(), c("p", cr, l(E.help), 1)) : O("", !0)
      ], 64)) : (u(), c(J, { key: 6 }, [
        e("label", {
          for: k()
        }, l(E.label), 9, dr),
        e("input", {
          id: k(),
          class: "input",
          type: E.field.type === "number" ? "number" : "text",
          value: E.modelValue === void 0 || E.modelValue === null ? "" : String(E.modelValue),
          onInput: d
        }, null, 40, pr),
        E.help ? (u(), c("p", vr, l(E.help), 1)) : O("", !0)
      ], 64))
    ]));
  }
});
var Ke;
((E) => {
  const d = class d {
    constructor(a, i, n, o) {
      W(this, "version");
      W(this, "errorCorrectionLevel");
      W(this, "size");
      W(this, "mask");
      W(this, "modules", []);
      W(this, "isFunction", []);
      if (this.version = a, this.errorCorrectionLevel = i, a < d.MIN_VERSION || a > d.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (o < -1 || o > 7)
        throw new RangeError("Mask value out of range");
      this.size = a * 4 + 17;
      let r = [];
      for (let y = 0; y < this.size; y++)
        r.push(!1);
      for (let y = 0; y < this.size; y++)
        this.modules.push(r.slice()), this.isFunction.push(r.slice());
      this.drawFunctionPatterns();
      const m = this.addEccAndInterleave(n);
      if (this.drawCodewords(m), o == -1) {
        let y = 1e9;
        for (let f = 0; f < 8; f++) {
          this.applyMask(f), this.drawFormatBits(f);
          const M = this.getPenaltyScore();
          M < y && (o = f, y = M), this.applyMask(f);
        }
      }
      g(0 <= o && o <= 7), this.mask = o, this.applyMask(o), this.drawFormatBits(o), this.isFunction = [];
    }
    static encodeText(a, i) {
      const n = E.QrSegment.makeSegments(a);
      return d.encodeSegments(n, i);
    }
    static encodeBinary(a, i) {
      const n = E.QrSegment.makeBytes(a);
      return d.encodeSegments([n], i);
    }
    static encodeSegments(a, i, n = 1, o = 40, r = -1, m = !0) {
      if (!(d.MIN_VERSION <= n && n <= o && o <= d.MAX_VERSION) || r < -1 || r > 7)
        throw new RangeError("Invalid value");
      let y, f;
      for (y = n; ; y++) {
        const R = d.getNumDataCodewords(y, i) * 8, L = k.getTotalBits(a, y);
        if (L <= R) {
          f = L;
          break;
        }
        if (y >= o)
          throw new RangeError("Data too long");
      }
      for (const R of [d.Ecc.MEDIUM, d.Ecc.QUARTILE, d.Ecc.HIGH])
        m && f <= d.getNumDataCodewords(y, R) * 8 && (i = R);
      let M = [];
      for (const R of a) {
        p(R.mode.modeBits, 4, M), p(R.numChars, R.mode.numCharCountBits(y), M);
        for (const L of R.getData())
          M.push(L);
      }
      g(M.length == f);
      const A = d.getNumDataCodewords(y, i) * 8;
      g(M.length <= A), p(0, Math.min(4, A - M.length), M), p(0, (8 - M.length % 8) % 8, M), g(M.length % 8 == 0);
      for (let R = 236; M.length < A; R ^= 253)
        p(R, 8, M);
      let K = [];
      for (; K.length * 8 < M.length; )
        K.push(0);
      return M.forEach((R, L) => K[L >>> 3] |= R << 7 - (L & 7)), new d(y, i, K, r);
    }
    getModule(a, i) {
      return 0 <= a && a < this.size && 0 <= i && i < this.size && this.modules[i][a];
    }
    drawFunctionPatterns() {
      for (let n = 0; n < this.size; n++)
        this.setFunctionModule(6, n, n % 2 == 0), this.setFunctionModule(n, 6, n % 2 == 0);
      this.drawFinderPattern(3, 3), this.drawFinderPattern(this.size - 4, 3), this.drawFinderPattern(3, this.size - 4);
      const a = this.getAlignmentPatternPositions(), i = a.length;
      for (let n = 0; n < i; n++)
        for (let o = 0; o < i; o++)
          n == 0 && o == 0 || n == 0 && o == i - 1 || n == i - 1 && o == 0 || this.drawAlignmentPattern(a[n], a[o]);
      this.drawFormatBits(0), this.drawVersion();
    }
    drawFormatBits(a) {
      const i = this.errorCorrectionLevel.formatBits << 3 | a;
      let n = i;
      for (let r = 0; r < 10; r++)
        n = n << 1 ^ (n >>> 9) * 1335;
      const o = (i << 10 | n) ^ 21522;
      g(o >>> 15 == 0);
      for (let r = 0; r <= 5; r++)
        this.setFunctionModule(8, r, v(o, r));
      this.setFunctionModule(8, 7, v(o, 6)), this.setFunctionModule(8, 8, v(o, 7)), this.setFunctionModule(7, 8, v(o, 8));
      for (let r = 9; r < 15; r++)
        this.setFunctionModule(14 - r, 8, v(o, r));
      for (let r = 0; r < 8; r++)
        this.setFunctionModule(this.size - 1 - r, 8, v(o, r));
      for (let r = 8; r < 15; r++)
        this.setFunctionModule(8, this.size - 15 + r, v(o, r));
      this.setFunctionModule(8, this.size - 8, !0);
    }
    drawVersion() {
      if (this.version < 7)
        return;
      let a = this.version;
      for (let n = 0; n < 12; n++)
        a = a << 1 ^ (a >>> 11) * 7973;
      const i = this.version << 12 | a;
      g(i >>> 18 == 0);
      for (let n = 0; n < 18; n++) {
        const o = v(i, n), r = this.size - 11 + n % 3, m = Math.floor(n / 3);
        this.setFunctionModule(r, m, o), this.setFunctionModule(m, r, o);
      }
    }
    drawFinderPattern(a, i) {
      for (let n = -4; n <= 4; n++)
        for (let o = -4; o <= 4; o++) {
          const r = Math.max(Math.abs(o), Math.abs(n)), m = a + o, y = i + n;
          0 <= m && m < this.size && 0 <= y && y < this.size && this.setFunctionModule(m, y, r != 2 && r != 4);
        }
    }
    drawAlignmentPattern(a, i) {
      for (let n = -2; n <= 2; n++)
        for (let o = -2; o <= 2; o++)
          this.setFunctionModule(a + o, i + n, Math.max(Math.abs(o), Math.abs(n)) != 1);
    }
    setFunctionModule(a, i, n) {
      this.modules[i][a] = n, this.isFunction[i][a] = !0;
    }
    addEccAndInterleave(a) {
      const i = this.version, n = this.errorCorrectionLevel;
      if (a.length != d.getNumDataCodewords(i, n))
        throw new RangeError("Invalid argument");
      const o = d.NUM_ERROR_CORRECTION_BLOCKS[n.ordinal][i], r = d.ECC_CODEWORDS_PER_BLOCK[n.ordinal][i], m = Math.floor(d.getNumRawDataModules(i) / 8), y = o - m % o, f = Math.floor(m / o);
      let M = [];
      const A = d.reedSolomonComputeDivisor(r);
      for (let R = 0, L = 0; R < o; R++) {
        let T = a.slice(L, L + f - r + (R < y ? 0 : 1));
        L += T.length;
        const I = d.reedSolomonComputeRemainder(T, A);
        R < y && T.push(0), M.push(T.concat(I));
      }
      let K = [];
      for (let R = 0; R < M[0].length; R++)
        M.forEach((L, T) => {
          (R != f - r || T >= y) && K.push(L[R]);
        });
      return g(K.length == m), K;
    }
    drawCodewords(a) {
      if (a.length != Math.floor(d.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let i = 0;
      for (let n = this.size - 1; n >= 1; n -= 2) {
        n == 6 && (n = 5);
        for (let o = 0; o < this.size; o++)
          for (let r = 0; r < 2; r++) {
            const m = n - r, f = (n + 1 & 2) == 0 ? this.size - 1 - o : o;
            !this.isFunction[f][m] && i < a.length * 8 && (this.modules[f][m] = v(a[i >>> 3], 7 - (i & 7)), i++);
          }
      }
      g(i == a.length * 8);
    }
    applyMask(a) {
      if (a < 0 || a > 7)
        throw new RangeError("Mask value out of range");
      for (let i = 0; i < this.size; i++)
        for (let n = 0; n < this.size; n++) {
          let o;
          switch (a) {
            case 0:
              o = (n + i) % 2 == 0;
              break;
            case 1:
              o = i % 2 == 0;
              break;
            case 2:
              o = n % 3 == 0;
              break;
            case 3:
              o = (n + i) % 3 == 0;
              break;
            case 4:
              o = (Math.floor(n / 3) + Math.floor(i / 2)) % 2 == 0;
              break;
            case 5:
              o = n * i % 2 + n * i % 3 == 0;
              break;
            case 6:
              o = (n * i % 2 + n * i % 3) % 2 == 0;
              break;
            case 7:
              o = ((n + i) % 2 + n * i % 3) % 2 == 0;
              break;
            default:
              throw new Error("Unreachable");
          }
          !this.isFunction[i][n] && o && (this.modules[i][n] = !this.modules[i][n]);
        }
    }
    getPenaltyScore() {
      let a = 0;
      for (let r = 0; r < this.size; r++) {
        let m = !1, y = 0, f = [0, 0, 0, 0, 0, 0, 0];
        for (let M = 0; M < this.size; M++)
          this.modules[r][M] == m ? (y++, y == 5 ? a += d.PENALTY_N1 : y > 5 && a++) : (this.finderPenaltyAddHistory(y, f), m || (a += this.finderPenaltyCountPatterns(f) * d.PENALTY_N3), m = this.modules[r][M], y = 1);
        a += this.finderPenaltyTerminateAndCount(m, y, f) * d.PENALTY_N3;
      }
      for (let r = 0; r < this.size; r++) {
        let m = !1, y = 0, f = [0, 0, 0, 0, 0, 0, 0];
        for (let M = 0; M < this.size; M++)
          this.modules[M][r] == m ? (y++, y == 5 ? a += d.PENALTY_N1 : y > 5 && a++) : (this.finderPenaltyAddHistory(y, f), m || (a += this.finderPenaltyCountPatterns(f) * d.PENALTY_N3), m = this.modules[M][r], y = 1);
        a += this.finderPenaltyTerminateAndCount(m, y, f) * d.PENALTY_N3;
      }
      for (let r = 0; r < this.size - 1; r++)
        for (let m = 0; m < this.size - 1; m++) {
          const y = this.modules[r][m];
          y == this.modules[r][m + 1] && y == this.modules[r + 1][m] && y == this.modules[r + 1][m + 1] && (a += d.PENALTY_N2);
        }
      let i = 0;
      for (const r of this.modules)
        i = r.reduce((m, y) => m + (y ? 1 : 0), i);
      const n = this.size * this.size, o = Math.ceil(Math.abs(i * 20 - n * 10) / n) - 1;
      return g(0 <= o && o <= 9), a += o * d.PENALTY_N4, g(0 <= a && a <= 2568888), a;
    }
    getAlignmentPatternPositions() {
      if (this.version == 1)
        return [];
      {
        const a = Math.floor(this.version / 7) + 2, i = Math.floor((this.version * 8 + a * 3 + 5) / (a * 4 - 4)) * 2;
        let n = [6];
        for (let o = this.size - 7; n.length < a; o -= i)
          n.splice(1, 0, o);
        return n;
      }
    }
    static getNumRawDataModules(a) {
      if (a < d.MIN_VERSION || a > d.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let i = (16 * a + 128) * a + 64;
      if (a >= 2) {
        const n = Math.floor(a / 7) + 2;
        i -= (25 * n - 10) * n - 55, a >= 7 && (i -= 36);
      }
      return g(208 <= i && i <= 29648), i;
    }
    static getNumDataCodewords(a, i) {
      return Math.floor(d.getNumRawDataModules(a) / 8) - d.ECC_CODEWORDS_PER_BLOCK[i.ordinal][a] * d.NUM_ERROR_CORRECTION_BLOCKS[i.ordinal][a];
    }
    static reedSolomonComputeDivisor(a) {
      if (a < 1 || a > 255)
        throw new RangeError("Degree out of range");
      let i = [];
      for (let o = 0; o < a - 1; o++)
        i.push(0);
      i.push(1);
      let n = 1;
      for (let o = 0; o < a; o++) {
        for (let r = 0; r < i.length; r++)
          i[r] = d.reedSolomonMultiply(i[r], n), r + 1 < i.length && (i[r] ^= i[r + 1]);
        n = d.reedSolomonMultiply(n, 2);
      }
      return i;
    }
    static reedSolomonComputeRemainder(a, i) {
      let n = i.map((o) => 0);
      for (const o of a) {
        const r = o ^ n.shift();
        n.push(0), i.forEach((m, y) => n[y] ^= d.reedSolomonMultiply(m, r));
      }
      return n;
    }
    static reedSolomonMultiply(a, i) {
      if (a >>> 8 || i >>> 8)
        throw new RangeError("Byte out of range");
      let n = 0;
      for (let o = 7; o >= 0; o--)
        n = n << 1 ^ (n >>> 7) * 285, n ^= (i >>> o & 1) * a;
      return g(n >>> 8 == 0), n;
    }
    finderPenaltyCountPatterns(a) {
      const i = a[1];
      g(i <= this.size * 3);
      const n = i > 0 && a[2] == i && a[3] == i * 3 && a[4] == i && a[5] == i;
      return (n && a[0] >= i * 4 && a[6] >= i ? 1 : 0) + (n && a[6] >= i * 4 && a[0] >= i ? 1 : 0);
    }
    finderPenaltyTerminateAndCount(a, i, n) {
      return a && (this.finderPenaltyAddHistory(i, n), i = 0), i += this.size, this.finderPenaltyAddHistory(i, n), this.finderPenaltyCountPatterns(n);
    }
    finderPenaltyAddHistory(a, i) {
      i[0] == 0 && (a += this.size), i.pop(), i.unshift(a);
    }
  };
  W(d, "MIN_VERSION", 1), W(d, "MAX_VERSION", 40), W(d, "PENALTY_N1", 3), W(d, "PENALTY_N2", 3), W(d, "PENALTY_N3", 40), W(d, "PENALTY_N4", 10), W(d, "ECC_CODEWORDS_PER_BLOCK", [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  ]), W(d, "NUM_ERROR_CORRECTION_BLOCKS", [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  ]);
  let t = d;
  E.QrCode = t;
  function p(C, a, i) {
    if (a < 0 || a > 31 || C >>> a)
      throw new RangeError("Value out of range");
    for (let n = a - 1; n >= 0; n--)
      i.push(C >>> n & 1);
  }
  function v(C, a) {
    return (C >>> a & 1) != 0;
  }
  function g(C) {
    if (!C)
      throw new Error("Assertion error");
  }
  const w = class w {
    constructor(a, i, n) {
      W(this, "mode");
      W(this, "numChars");
      W(this, "bitData");
      if (this.mode = a, this.numChars = i, this.bitData = n, i < 0)
        throw new RangeError("Invalid argument");
      this.bitData = n.slice();
    }
    static makeBytes(a) {
      let i = [];
      for (const n of a)
        p(n, 8, i);
      return new w(w.Mode.BYTE, a.length, i);
    }
    static makeNumeric(a) {
      if (!w.isNumeric(a))
        throw new RangeError("String contains non-numeric characters");
      let i = [];
      for (let n = 0; n < a.length; ) {
        const o = Math.min(a.length - n, 3);
        p(parseInt(a.substring(n, n + o), 10), o * 3 + 1, i), n += o;
      }
      return new w(w.Mode.NUMERIC, a.length, i);
    }
    static makeAlphanumeric(a) {
      if (!w.isAlphanumeric(a))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let i = [], n;
      for (n = 0; n + 2 <= a.length; n += 2) {
        let o = w.ALPHANUMERIC_CHARSET.indexOf(a.charAt(n)) * 45;
        o += w.ALPHANUMERIC_CHARSET.indexOf(a.charAt(n + 1)), p(o, 11, i);
      }
      return n < a.length && p(w.ALPHANUMERIC_CHARSET.indexOf(a.charAt(n)), 6, i), new w(w.Mode.ALPHANUMERIC, a.length, i);
    }
    static makeSegments(a) {
      return a == "" ? [] : w.isNumeric(a) ? [w.makeNumeric(a)] : w.isAlphanumeric(a) ? [w.makeAlphanumeric(a)] : [w.makeBytes(w.toUtf8ByteArray(a))];
    }
    static makeEci(a) {
      let i = [];
      if (a < 0)
        throw new RangeError("ECI assignment value out of range");
      if (a < 128)
        p(a, 8, i);
      else if (a < 16384)
        p(2, 2, i), p(a, 14, i);
      else if (a < 1e6)
        p(6, 3, i), p(a, 21, i);
      else
        throw new RangeError("ECI assignment value out of range");
      return new w(w.Mode.ECI, 0, i);
    }
    static isNumeric(a) {
      return w.NUMERIC_REGEX.test(a);
    }
    static isAlphanumeric(a) {
      return w.ALPHANUMERIC_REGEX.test(a);
    }
    getData() {
      return this.bitData.slice();
    }
    static getTotalBits(a, i) {
      let n = 0;
      for (const o of a) {
        const r = o.mode.numCharCountBits(i);
        if (o.numChars >= 1 << r)
          return 1 / 0;
        n += 4 + r + o.bitData.length;
      }
      return n;
    }
    static toUtf8ByteArray(a) {
      a = encodeURI(a);
      let i = [];
      for (let n = 0; n < a.length; n++)
        a.charAt(n) != "%" ? i.push(a.charCodeAt(n)) : (i.push(parseInt(a.substring(n + 1, n + 3), 16)), n += 2);
      return i;
    }
  };
  W(w, "NUMERIC_REGEX", /^[0-9]*$/), W(w, "ALPHANUMERIC_REGEX", /^[A-Z0-9 $%*+.\/:-]*$/), W(w, "ALPHANUMERIC_CHARSET", "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:");
  let k = w;
  E.QrSegment = k;
})(Ke || (Ke = {}));
((E) => {
  ((t) => {
    const v = class v {
      constructor(k, d) {
        W(this, "ordinal");
        W(this, "formatBits");
        this.ordinal = k, this.formatBits = d;
      }
    };
    W(v, "LOW", new v(0, 1)), W(v, "MEDIUM", new v(1, 0)), W(v, "QUARTILE", new v(2, 3)), W(v, "HIGH", new v(3, 2));
    let p = v;
    t.Ecc = p;
  })(E.QrCode || (E.QrCode = {}));
})(Ke || (Ke = {}));
((E) => {
  ((t) => {
    const v = class v {
      constructor(k, d) {
        W(this, "modeBits");
        W(this, "numBitsCharCount");
        this.modeBits = k, this.numBitsCharCount = d;
      }
      numCharCountBits(k) {
        return this.numBitsCharCount[Math.floor((k + 7) / 17)];
      }
    };
    W(v, "NUMERIC", new v(1, [10, 12, 14])), W(v, "ALPHANUMERIC", new v(2, [9, 11, 13])), W(v, "BYTE", new v(4, [8, 16, 16])), W(v, "KANJI", new v(8, [8, 10, 12])), W(v, "ECI", new v(7, [0, 0, 0]));
    let p = v;
    t.Mode = p;
  })(E.QrSegment || (E.QrSegment = {}));
})(Ke || (Ke = {}));
const Rt = Ke, hr = { class: "content-card" }, mr = { class: "card-desc" }, fr = { class: "connection-grid" }, gr = { class: "connection-form" }, _r = { class: "field" }, br = ["placeholder"], yr = { class: "field" }, kr = { class: "toggle-label" }, wr = { class: "field" }, $r = ["placeholder"], Sr = { class: "field" }, Cr = ["placeholder"], Pr = { class: "field" }, xr = { class: "helper-text" }, Mr = { key: 0 }, Er = { key: 1 }, Ur = { class: "actions-row" }, Tr = { class: "connection-qr" }, Ar = ["viewBox"], Ir = ["width", "height"], Vr = ["x", "y"], Nr = { class: "connection-link" }, Lt = "0kay.connection.qr.v2", Rr = /* @__PURE__ */ ce({
  __name: "ConnectionPanel",
  setup(E) {
    const { t } = de();
    function p() {
      try {
        return JSON.parse(localStorage.getItem(Lt) || "{}");
      } catch {
        return {};
      }
    }
    function v(L) {
      const T = (I) => /^192\.168\./.test(I) ? 0 : /^10\./.test(I) ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(I) ? 2 : /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(I) ? 4 : 3;
      return [...L].sort((I, X) => T(I) - T(X))[0] || "";
    }
    const g = p(), k = !!g.hostOverride, d = x(g.hostOverride && g.host ? g.host : location.hostname), w = x(k), C = location.protocol === "https:" ? location.port || "443" : "8080", a = x(g.port ?? C), i = x(g.tls ?? location.protocol === "https:"), n = x(""), o = x(""), r = x(g.name ?? "0KAY"), m = x(""), y = x(!1), f = x(!1);
    Te(async () => {
      try {
        const L = await fetch("/api/auth/session");
        if (L.ok) {
          const T = await L.json();
          m.value = String(T.core_id || ""), y.value = !!T.lan_enabled;
          const I = Array.isArray(T.addresses) ? T.addresses : [], X = v(I);
          !w.value && X && (d.value = X);
        }
      } catch {
      }
    }), je([d, a, i, r, w], () => {
      localStorage.setItem(
        Lt,
        JSON.stringify({
          host: d.value,
          hostOverride: w.value,
          port: a.value,
          tls: i.value,
          name: r.value
        })
      );
    });
    const M = G(() => {
      const L = i.value ? "https" : "http", T = String(a.value || "").trim();
      return `${L}://${d.value.trim()}${T ? ":" + T : ""}`;
    }), A = G(() => {
      const L = [["v", "1"], ["url", M.value]];
      return r.value.trim() && L.push(["name", r.value.trim()]), n.value.trim() && L.push(["token", n.value.trim()]), o.value.trim() && L.push(["pin", o.value.trim()]), m.value && L.push(["core_id", m.value]), `0kay://pair?${L.map(([I, X]) => `${I}=${encodeURIComponent(X)}`).join("&")}`;
    }), K = G(() => {
      const L = Rt.QrCode.encodeText(A.value, Rt.QrCode.Ecc.MEDIUM), T = L.size, I = 2, X = T + I * 2, ae = [];
      for (let re = 0; re < T; re++)
        for (let j = 0; j < T; j++)
          L.getModule(j, re) && ae.push({ x: j + I, y: re + I });
      return { dim: X, dark: ae };
    });
    async function R() {
      try {
        await navigator.clipboard.writeText(A.value), f.value = !0, setTimeout(() => f.value = !1, 1500);
      } catch {
      }
    }
    return (L, T) => (u(), c("div", hr, [
      e("h2", null, l(s(t)("connection.title")), 1),
      e("p", mr, l(s(t)("connection.lead")), 1),
      e("div", fr, [
        e("div", gr, [
          e("div", _r, [
            e("label", null, l(s(t)("connection.remoteHost")), 1),
            F(e("input", {
              "onUpdate:modelValue": T[0] || (T[0] = (I) => d.value = I),
              class: "input",
              placeholder: s(t)("connection.hostPlaceholder"),
              onInput: T[1] || (T[1] = (I) => w.value = !0)
            }, null, 40, br), [
              [Y, d.value]
            ])
          ]),
          e("div", yr, [
            e("label", null, l(s(t)("connection.port")), 1),
            F(e("input", {
              "onUpdate:modelValue": T[2] || (T[2] = (I) => a.value = I),
              class: "input",
              inputmode: "numeric",
              placeholder: "8080"
            }, null, 512), [
              [Y, a.value]
            ])
          ]),
          e("label", kr, [
            F(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": T[3] || (T[3] = (I) => i.value = I)
            }, null, 512), [
              [ue, i.value]
            ]),
            T[7] || (T[7] = e("span", { class: "toggle-slider" }, null, -1)),
            e("span", null, l(s(t)("connection.useTls")), 1)
          ]),
          e("div", wr, [
            e("label", null, l(s(t)("connection.token")), 1),
            F(e("input", {
              "onUpdate:modelValue": T[4] || (T[4] = (I) => n.value = I),
              class: "input",
              type: "password",
              placeholder: s(t)("connection.tokenPlaceholder"),
              autocomplete: "off"
            }, null, 8, $r), [
              [Y, n.value]
            ])
          ]),
          e("div", Sr, [
            e("label", null, l(s(t)("connection.pin")), 1),
            F(e("input", {
              "onUpdate:modelValue": T[5] || (T[5] = (I) => o.value = I),
              class: "input",
              type: "password",
              placeholder: s(t)("connection.pinPlaceholder"),
              autocomplete: "off"
            }, null, 8, Cr), [
              [Y, o.value]
            ])
          ]),
          e("div", Pr, [
            e("label", null, l(s(t)("connection.deviceName")), 1),
            F(e("input", {
              "onUpdate:modelValue": T[6] || (T[6] = (I) => r.value = I),
              class: "input",
              placeholder: "0KAY"
            }, null, 512), [
              [Y, r.value]
            ])
          ]),
          e("div", xr, [
            Ue(l(s(t)("connection.address")), 1),
            e("code", null, l(M.value), 1),
            m.value ? (u(), c("span", Mr, " · Core: " + l(m.value), 1)) : O("", !0),
            y.value ? (u(), c("span", Er, l(s(t)("connection.lanMode")), 1)) : O("", !0)
          ]),
          e("div", Ur, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              onClick: R
            }, l(f.value ? s(t)("common.copied") : s(t)("connection.copyLink")), 1)
          ])
        ]),
        e("div", Tr, [
          (u(), c("svg", {
            viewBox: `0 0 ${K.value.dim} ${K.value.dim}`,
            width: "264",
            height: "264",
            "shape-rendering": "crispEdges",
            role: "img",
            "aria-label": "0KAY connection QR code"
          }, [
            e("rect", {
              x: "0",
              y: "0",
              width: K.value.dim,
              height: K.value.dim,
              fill: "#ffffff"
            }, null, 8, Ir),
            (u(!0), c(J, null, ne(K.value.dark, (I) => (u(), c("rect", {
              key: I.x + ":" + I.y,
              x: I.x,
              y: I.y,
              width: "1",
              height: "1",
              fill: "#0b1020"
            }, null, 8, Vr))), 128))
          ], 8, Ar)),
          e("code", Nr, l(A.value), 1)
        ])
      ])
    ]));
  }
}), Lr = /* @__PURE__ */ Me(Rr, [["__scopeId", "data-v-d9b226f0"]]), Or = { class: "content-card" }, Dr = { class: "card-desc" }, zr = { class: "field-row" }, Fr = { class: "field" }, Br = ["placeholder"], Hr = { class: "field" }, Kr = ["placeholder"], jr = { class: "field" }, Yr = { class: "field" }, Xr = ["placeholder"], Jr = { class: "field" }, Wr = ["placeholder"], qr = { class: "field" }, Gr = ["placeholder"], Zr = { class: "field" }, Qr = ["placeholder"], eu = { class: "helper-text" }, tu = /* @__PURE__ */ ce({
  __name: "PersonaPanel",
  setup(E) {
    const { t } = de(), p = lt(), { tabLabel: v, tabMeta: g } = ft();
    return (k, d) => (u(), c("div", Or, [
      e("h2", null, l(s(v)("persona")), 1),
      e("p", Dr, l(s(g)("persona")?.descriptionKey ? s(t)(s(g)("persona").descriptionKey) : s(t)("settings.personaDesc")), 1),
      e("div", zr, [
        e("div", Fr, [
          e("label", null, l(s(t)("wizard.name")), 1),
          F(e("input", {
            "onUpdate:modelValue": d[0] || (d[0] = (w) => s(p).persona.name = w),
            placeholder: s(t)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, Br), [
            [Y, s(p).persona.name]
          ])
        ]),
        e("div", Hr, [
          e("label", null, l(s(t)("wizard.avatarUrl")), 1),
          F(e("input", {
            "onUpdate:modelValue": d[1] || (d[1] = (w) => s(p).persona.avatar = w),
            placeholder: s(t)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, Kr), [
            [Y, s(p).persona.avatar]
          ])
        ]),
        e("div", jr, [
          e("label", null, l(s(t)("settings.personaBirthDate")), 1),
          F(e("input", {
            "onUpdate:modelValue": d[2] || (d[2] = (w) => s(p).persona.birthDate = w),
            type: "date",
            class: "input"
          }, null, 512), [
            [Y, s(p).persona.birthDate]
          ])
        ])
      ]),
      e("div", Yr, [
        e("label", null, l(s(t)("wizard.description")), 1),
        F(e("textarea", {
          "onUpdate:modelValue": d[3] || (d[3] = (w) => s(p).persona.description = w),
          placeholder: s(t)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Xr), [
          [Y, s(p).persona.description]
        ])
      ]),
      e("div", Jr, [
        e("label", null, l(s(t)("wizard.personality")), 1),
        F(e("textarea", {
          "onUpdate:modelValue": d[4] || (d[4] = (w) => s(p).persona.personality = w),
          placeholder: s(t)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, Wr), [
          [Y, s(p).persona.personality]
        ])
      ]),
      e("div", qr, [
        e("label", null, l(s(t)("wizard.greeting")), 1),
        F(e("textarea", {
          "onUpdate:modelValue": d[5] || (d[5] = (w) => s(p).persona.greeting = w),
          placeholder: s(t)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, Gr), [
          [Y, s(p).persona.greeting]
        ])
      ]),
      e("div", Zr, [
        e("label", null, l(s(t)("wizard.customPrompt")), 1),
        F(e("textarea", {
          "onUpdate:modelValue": d[6] || (d[6] = (w) => s(p).persona.customPrompt = w),
          placeholder: s(t)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, Qr), [
          [Y, s(p).persona.customPrompt]
        ]),
        e("p", eu, l(s(t)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), su = { class: "content-card" }, lu = { class: "card-desc" }, nu = { class: "toggle-label" }, ou = { class: "helper-text" }, au = { class: "toggle-label" }, iu = { class: "helper-text" }, ru = { class: "field" }, uu = ["placeholder"], cu = { class: "helper-text" }, du = {
  key: 0,
  class: "helper-text"
}, pu = { class: "actions-row" }, vu = /* @__PURE__ */ ce({
  __name: "PermissionsPanel",
  setup(E) {
    const { t } = de(), { tabLabel: p, tabMeta: v, fieldLabel: g, fieldHelp: k } = ft(), d = x({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), w = x("");
    async function C() {
      try {
        const i = await fetch("/api/life/permissions");
        if (i.ok) {
          const n = await i.json();
          d.value = {
            screen_watch: !!n.screen_watch,
            computer_use: !!n.computer_use,
            report_agent_host: n.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function a() {
      w.value = "";
      try {
        const i = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(d.value)
        });
        if (!i.ok) throw new Error(String(i.status));
        const n = await i.json();
        d.value = {
          screen_watch: !!n.screen_watch,
          computer_use: !!n.computer_use,
          report_agent_host: n.report_agent_host || ""
        }, w.value = t("settings.permSaved");
      } catch {
        w.value = t("settings.permFailed");
      }
    }
    return Te(C), (i, n) => (u(), c("div", su, [
      e("h2", null, l(s(p)("permissions")), 1),
      e("p", lu, l(s(v)("permissions")?.descriptionKey ? s(t)(s(v)("permissions").descriptionKey) : s(t)("settings.permissionsDesc")), 1),
      e("label", nu, [
        F(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": n[0] || (n[0] = (o) => d.value.screen_watch = o),
          onChange: a
        }, null, 544), [
          [ue, d.value.screen_watch]
        ]),
        n[4] || (n[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(s(g)(s(v)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          n[3] || (n[3] = e("br", null, null, -1)),
          e("small", ou, l(s(k)(s(v)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", au, [
        F(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": n[1] || (n[1] = (o) => d.value.computer_use = o),
          onChange: a
        }, null, 544), [
          [ue, d.value.computer_use]
        ]),
        n[6] || (n[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(s(g)(s(v)("permissions"), "computer_use", "settings.computerUse")), 1),
          n[5] || (n[5] = e("br", null, null, -1)),
          e("small", iu, l(s(k)(s(v)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", ru, [
        e("label", null, l(s(g)(s(v)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        F(e("input", {
          "onUpdate:modelValue": n[2] || (n[2] = (o) => d.value.report_agent_host = o),
          class: "input",
          placeholder: s(k)(s(v)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: a
        }, null, 40, uu), [
          [Y, d.value.report_agent_host]
        ]),
        e("p", cu, l(s(k)(s(v)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      w.value ? (u(), c("div", du, l(w.value), 1)) : O("", !0),
      e("div", pu, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: a
        }, l(s(t)("settings.save")), 1)
      ])
    ]));
  }
}), hu = x(!1), mu = x(!1);
x(!1);
const Fe = x(!1), Xe = x(!0), gt = x(!0), We = x([]), Ht = x(!1);
x(!1);
const nt = x(!1), Ot = [];
function fu(E) {
  const t = Ot.splice(0, Ot.length);
  for (const p of t)
    p.resolve();
}
async function gu() {
  const E = window.fetch;
  try {
    const t = await E("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!t.ok) return;
    const p = await t.json();
    Fe.value = !!p.configured, Xe.value = p.enabled !== !1, gt.value = p.login_enabled !== !1, We.value = Array.isArray(p.pages) ? p.pages : [], nt.value = !p.configured && Xe.value;
  } catch {
  }
}
async function _u(E) {
  const t = window.fetch, p = await t("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(E)
  }), v = await p.json().catch(() => null);
  if (!p.ok) throw new Error(v?.error || `HTTP ${p.status}`);
  typeof v?.enabled == "boolean" && (Xe.value = v.enabled), typeof v?.login_enabled == "boolean" && (gt.value = v.login_enabled), Array.isArray(v?.pages) && (We.value = v.pages), Fe.value = !!v?.configured, nt.value = !v?.configured && Xe.value;
}
async function bu() {
  const E = window.fetch, t = await E("/api/security/pin", { method: "DELETE" }), p = await t.json().catch(() => null);
  if (!t.ok) throw new Error(p?.error || `HTTP ${t.status}`);
  Ht.value = !1, Fe.value = !1, nt.value = Xe.value;
}
async function yu(E) {
  const t = window.fetch, p = await t("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: E })
  }), v = await p.json().catch(() => null);
  if (!p.ok || !v?.configured) throw new Error(v?.error || `HTTP ${p.status}`);
  E.trim(), Ht.value = !0, Fe.value = !0, nt.value = !1, mu.value = !0, hu.value = !1, fu();
}
const ku = { class: "content-card security-panel" }, wu = { class: "card-desc" }, $u = { class: "sec-stack" }, Su = { class: "toggle-label" }, Cu = ["checked", "disabled"], Pu = { class: "helper-text" }, xu = { class: "toggle-label" }, Mu = ["checked", "disabled"], Eu = { class: "helper-text" }, Uu = { class: "sec-card" }, Tu = { class: "sec-card-head" }, Au = { class: "sec-pin-grid" }, Iu = { class: "sec-pin-col" }, Vu = { class: "sec-pin-label" }, Nu = { class: "sec-pin-col" }, Ru = { class: "sec-pin-label" }, Lu = { class: "sec-actions" }, Ou = ["disabled"], Du = ["disabled"], zu = { class: "sec-card" }, Fu = { class: "sec-card-head" }, Bu = { class: "sec-chip" }, Hu = { class: "helper-text" }, Ku = { class: "page-list" }, ju = ["checked", "disabled", "onChange"], Yu = { class: "page-text" }, Xu = { class: "page-name" }, Ju = {
  key: 0,
  class: "helper-text sec-msg"
}, Wu = {
  key: 1,
  class: "sec-error"
}, qu = /* @__PURE__ */ ce({
  __name: "SecurityPanel",
  setup(E) {
    const { t } = de(), { confirm: p } = qe(), v = Bt(), g = x(!1), k = x(""), d = x(""), w = x(""), C = x(""), a = G(() => {
      const y = [], f = /* @__PURE__ */ new Set(), M = (A, K) => {
        !A || f.has(A) || (f.add(A), y.push({ path: A, label: K || A }));
      };
      for (const A of v.navItems) {
        const K = A.to || (A.id === "chat" ? "/" : "");
        if (!K) continue;
        let R = A.labelKey ? t(A.labelKey) : "";
        (!R || R === A.labelKey) && (R = A.label || A.id), M(K, R);
      }
      for (const A of v.routerPatches) {
        let K = A.titleKey ? t(A.titleKey) : "";
        (!K || K === A.titleKey) && (K = A.title || String(A.name || A.path)), M(A.path, K);
      }
      return y;
    });
    Te(() => {
      gu();
    });
    async function i(y) {
      g.value = !0, k.value = "", d.value = "";
      try {
        await _u(y), k.value = t("settings.saved"), setTimeout(() => {
          k.value = "";
        }, 1500);
      } catch (f) {
        d.value = f?.message || t("settings.permFailed");
      } finally {
        g.value = !1;
      }
    }
    function n(y, f) {
      i({ [y]: f });
    }
    function o(y, f) {
      const M = new Set(We.value);
      f ? M.add(y) : M.delete(y), i({ pages: [...M] });
    }
    async function r() {
      if (d.value = "", w.value.length !== 6) {
        d.value = t("wizard.pinTooShort");
        return;
      }
      if (w.value !== C.value) {
        d.value = t("wizard.pinMismatch");
        return;
      }
      g.value = !0;
      try {
        await yu(w.value), w.value = "", C.value = "", k.value = t("settings.saved"), setTimeout(() => {
          k.value = "";
        }, 1500);
      } catch (y) {
        d.value = y?.message || t("settings.permFailed");
      } finally {
        g.value = !1;
      }
    }
    async function m() {
      if (await p({
        title: t("security.removePin"),
        message: t("security.removePinConfirm"),
        confirmLabel: t("common.delete"),
        danger: !0
      })) {
        g.value = !0, d.value = "";
        try {
          await bu(), k.value = t("settings.saved"), setTimeout(() => {
            k.value = "";
          }, 1500);
        } catch (f) {
          d.value = f?.message || t("settings.permFailed");
        } finally {
          g.value = !1;
        }
      }
    }
    return (y, f) => (u(), c("div", ku, [
      e("h2", null, l(s(t)("settings.tabs.security")), 1),
      e("p", wu, l(s(t)("security.desc")), 1),
      e("div", $u, [
        e("label", Su, [
          e("input", {
            type: "checkbox",
            checked: s(Xe),
            disabled: g.value,
            onChange: f[0] || (f[0] = (M) => n("enabled", M.target.checked))
          }, null, 40, Cu),
          f[4] || (f[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(s(t)("security.pinSwitch")), 1),
            e("small", Pu, l(s(t)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", xu, [
          e("input", {
            type: "checkbox",
            checked: s(gt),
            disabled: g.value,
            onChange: f[1] || (f[1] = (M) => n("login_enabled", M.target.checked))
          }, null, 40, Mu),
          f[5] || (f[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(s(t)("security.loginSwitch")), 1),
            e("small", Eu, l(s(t)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", Uu, [
          e("div", Tu, [
            e("strong", null, l(s(Fe) ? s(t)("security.changePin") : s(t)("auth.setupTitle")), 1),
            e("span", {
              class: ee(["sec-chip", { on: s(Fe) }])
            }, l(s(Fe) ? s(t)("security.pinSet") : s(t)("security.pinUnset")), 3)
          ]),
          e("div", Au, [
            e("div", Iu, [
              e("span", Vu, l(s(t)("auth.pinNew")), 1),
              fe(s(Vt), {
                modelValue: w.value,
                "onUpdate:modelValue": f[2] || (f[2] = (M) => w.value = M)
              }, null, 8, ["modelValue"])
            ]),
            e("div", Nu, [
              e("span", Ru, l(s(t)("auth.pinConfirm")), 1),
              fe(s(Vt), {
                modelValue: C.value,
                "onUpdate:modelValue": f[3] || (f[3] = (M) => C.value = M),
                onComplete: r
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", Lu, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: g.value,
              onClick: r
            }, l(s(t)("auth.savePin")), 9, Ou),
            s(Fe) ? (u(), c("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: g.value,
              onClick: m
            }, l(s(t)("security.removePin")), 9, Du)) : O("", !0)
          ])
        ]),
        e("section", zu, [
          e("div", Fu, [
            e("strong", null, l(s(t)("security.pages")), 1),
            e("span", Bu, l(s(t)("security.pageCount", { n: s(We).length })), 1)
          ]),
          e("p", Hu, l(s(t)("security.pagesHelp")), 1),
          e("div", Ku, [
            (u(!0), c(J, null, ne(a.value, (M) => (u(), c("label", {
              key: M.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: s(We).includes(M.path),
                disabled: g.value,
                onChange: (A) => o(M.path, A.target.checked)
              }, null, 40, ju),
              f[6] || (f[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", Yu, [
                e("span", Xu, l(M.label), 1),
                e("code", null, l(M.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      k.value ? (u(), c("p", Ju, l(k.value), 1)) : O("", !0),
      d.value ? (u(), c("p", Wu, l(d.value), 1)) : O("", !0)
    ]));
  }
}), Gu = /* @__PURE__ */ Me(qu, [["__scopeId", "data-v-8a0a3d8d"]]), Zu = { class: "mcp-panel" }, Qu = { class: "mcp-head" }, ec = { class: "subtitle" }, tc = { class: "mcp-actions" }, sc = ["disabled"], lc = {
  key: 0,
  class: "error-banner"
}, nc = {
  key: 1,
  class: "notice-banner"
}, oc = {
  key: 2,
  class: "hint"
}, ac = {
  key: 3,
  class: "mcp-list"
}, ic = { class: "mcp-row" }, rc = { class: "mcp-field grow" }, uc = ["onUpdate:modelValue", "readonly"], cc = { class: "mcp-field" }, dc = ["onUpdate:modelValue", "onChange"], pc = { value: "builtin" }, vc = { class: "mcp-toggle" }, hc = ["onUpdate:modelValue"], mc = ["onClick"], fc = { class: "mcp-field" }, gc = ["onUpdate:modelValue"], _c = { class: "mcp-field" }, bc = ["onUpdate:modelValue"], yc = { class: "mcp-field" }, kc = ["onUpdate:modelValue"], wc = { class: "mcp-field" }, $c = ["onUpdate:modelValue"], Sc = { class: "builtin-note" }, Cc = { class: "mail-grid" }, Pc = { class: "mail-col" }, xc = { class: "mail-label" }, Mc = { class: "mcp-field" }, Ec = ["onUpdate:modelValue"], Uc = { class: "mail-row" }, Tc = { class: "mcp-field" }, Ac = ["onUpdate:modelValue"], Ic = { class: "mcp-toggle" }, Vc = ["onUpdate:modelValue"], Nc = { class: "mcp-field" }, Rc = ["onUpdate:modelValue"], Lc = { class: "mcp-field" }, Oc = ["onUpdate:modelValue"], Dc = { class: "mail-col" }, zc = { class: "mail-label" }, Fc = { class: "mcp-field" }, Bc = ["onUpdate:modelValue"], Hc = { class: "mail-row" }, Kc = { class: "mcp-field" }, jc = ["onUpdate:modelValue"], Yc = { class: "mcp-toggle" }, Xc = ["onUpdate:modelValue"], Jc = { class: "mcp-field" }, Wc = ["onUpdate:modelValue"], qc = { class: "mcp-field" }, Gc = ["onUpdate:modelValue"], Zc = { class: "mail-row" }, Qc = { class: "mcp-field grow" }, ed = ["onUpdate:modelValue", "placeholder"], td = { class: "mcp-field" }, sd = ["onUpdate:modelValue"], ld = {
  key: 0,
  class: "hint"
}, nd = /* @__PURE__ */ ce({
  __name: "McpPanel",
  setup(E) {
    const { t } = de(), p = x([]), v = x(!1), g = x(!1), k = x(""), d = x(!1);
    function w() {
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
    function C(m) {
      const y = m?.transport === "http" ? "http" : m?.transport === "builtin" || m?.builtin ? "builtin" : "stdio", f = m?.options?.imap || {}, M = m?.options?.smtp || {};
      return {
        id: String(m?.id || ""),
        transport: y,
        command: String(m?.command || ""),
        argsText: Array.isArray(m?.args) ? m.args.join(`
`) : "",
        url: String(m?.url || ""),
        headersText: m?.headers && typeof m.headers == "object" ? JSON.stringify(m.headers, null, 2) : "",
        enabled: m?.enabled !== !1,
        imapHost: String(f.host || ""),
        imapPort: Number(f.port) || 993,
        imapSsl: f.ssl !== !1,
        imapUser: String(f.user || ""),
        imapPassword: String(f.password || ""),
        smtpHost: String(M.host || ""),
        smtpPort: Number(M.port) || 465,
        smtpSecure: M.secure !== !1,
        smtpUser: String(M.user || ""),
        smtpPassword: String(M.password || ""),
        from: String(M.from || ""),
        fromName: String(M.fromName || "0KAY")
      };
    }
    function a(m) {
      if (m.transport === "builtin") {
        const f = {};
        return (m.imapHost.trim() || m.imapUser.trim()) && (f.imap = {
          host: m.imapHost.trim(),
          port: Number(m.imapPort) || 993,
          ssl: m.imapSsl,
          user: m.imapUser.trim(),
          password: m.imapPassword
        }), (m.smtpHost.trim() || m.smtpUser.trim() || m.from.trim()) && (f.smtp = {
          host: m.smtpHost.trim(),
          port: Number(m.smtpPort) || 465,
          secure: m.smtpSecure,
          user: m.smtpUser.trim(),
          password: m.smtpPassword,
          from: m.from.trim(),
          fromName: m.fromName.trim() || "0KAY"
        }), { id: m.id.trim() || "mail", transport: "builtin", builtin: "mail", enabled: m.enabled, options: f };
      }
      const y = { id: m.id.trim(), transport: m.transport, enabled: m.enabled };
      if (m.transport === "http") {
        if (m.url.trim() && (y.url = m.url.trim()), m.headersText.trim())
          try {
            y.headers = JSON.parse(m.headersText);
          } catch {
            throw new Error(t("mcp.headersInvalid", { id: m.id || "(unnamed)" }));
          }
      } else {
        m.command.trim() && (y.command = m.command.trim());
        const f = m.argsText.split(`
`).map((M) => M.trim()).filter(Boolean);
        f.length && (y.args = f);
      }
      return y;
    }
    function i(m) {
      m.transport === "builtin" && (m.id = "mail");
    }
    function n() {
      const m = w();
      p.value.some((y) => y.transport === "builtin") && (m.transport = "stdio"), p.value.push(m);
    }
    async function o() {
      v.value = !0, k.value = "";
      try {
        const y = (await ze("/api/settings/mcp"))?.values?.servers;
        let f = [];
        if (typeof y == "string" && y.trim())
          try {
            const M = JSON.parse(y);
            Array.isArray(M) && (f = M);
          } catch {
            k.value = t("mcp.configInvalid");
          }
        p.value = f.map(C);
      } catch (m) {
        k.value = m?.message || String(m);
      } finally {
        v.value = !1;
      }
    }
    async function r() {
      if (!g.value) {
        g.value = !0, k.value = "", d.value = !1;
        try {
          const m = /* @__PURE__ */ new Set(), y = p.value.map(a).filter((f) => {
            const M = String(f.id || "").trim();
            return !M || m.has(M) ? !1 : (m.add(M), !0);
          });
          await et("/api/settings/mcp", { values: { servers: JSON.stringify(y) } }), d.value = !0, setTimeout(() => {
            d.value = !1;
          }, 2e3);
        } catch (m) {
          k.value = m?.message || String(m);
        } finally {
          g.value = !1;
        }
      }
    }
    return Te(o), (m, y) => (u(), c("div", Zu, [
      e("header", Qu, [
        e("div", null, [
          e("h2", null, l(s(t)("mcp.title")), 1),
          e("p", ec, l(s(t)("mcp.subtitle")), 1)
        ]),
        e("div", tc, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: n
          }, l(s(t)("mcp.addServer")), 1),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: g.value,
            onClick: r
          }, l(g.value ? s(t)("common.saving") : s(t)("common.save")), 9, sc)
        ])
      ]),
      k.value ? (u(), c("div", lc, l(k.value), 1)) : O("", !0),
      d.value ? (u(), c("div", nc, l(s(t)("settings.saved")), 1)) : O("", !0),
      v.value ? (u(), c("p", oc, l(s(t)("common.loading")), 1)) : (u(), c("div", ac, [
        (u(!0), c(J, null, ne(p.value, (f, M) => (u(), c("article", {
          key: M,
          class: ee(["mcp-card", { "is-builtin": f.transport === "builtin" }])
        }, [
          e("div", ic, [
            e("label", rc, [
              y[0] || (y[0] = e("span", null, "ID", -1)),
              F(e("input", {
                "onUpdate:modelValue": (A) => f.id = A,
                readonly: f.transport === "builtin",
                placeholder: "filesystem"
              }, null, 8, uc), [
                [Y, f.id]
              ])
            ]),
            e("label", cc, [
              e("span", null, l(s(t)("mcp.transport")), 1),
              F(e("select", {
                "onUpdate:modelValue": (A) => f.transport = A,
                onChange: (A) => i(f)
              }, [
                y[1] || (y[1] = e("option", { value: "stdio" }, "stdio", -1)),
                y[2] || (y[2] = e("option", { value: "http" }, "http", -1)),
                e("option", pc, l(s(t)("mcp.builtinMail")), 1)
              ], 40, dc), [
                [ns, f.transport]
              ])
            ]),
            e("label", vc, [
              F(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (A) => f.enabled = A
              }, null, 8, hc), [
                [ue, f.enabled]
              ]),
              e("span", null, l(s(t)("mcp.enabled")), 1)
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (A) => p.value.splice(M, 1)
            }, l(s(t)("common.delete")), 9, mc)
          ]),
          f.transport === "stdio" ? (u(), c(J, { key: 0 }, [
            e("label", fc, [
              e("span", null, l(s(t)("mcp.command")), 1),
              F(e("input", {
                "onUpdate:modelValue": (A) => f.command = A,
                placeholder: "npx"
              }, null, 8, gc), [
                [Y, f.command]
              ])
            ]),
            e("label", _c, [
              e("span", null, l(s(t)("mcp.args")), 1),
              F(e("textarea", {
                "onUpdate:modelValue": (A) => f.argsText = A,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, bc), [
                [Y, f.argsText]
              ])
            ])
          ], 64)) : f.transport === "http" ? (u(), c(J, { key: 1 }, [
            e("label", yc, [
              y[3] || (y[3] = e("span", null, "URL", -1)),
              F(e("input", {
                "onUpdate:modelValue": (A) => f.url = A,
                placeholder: "https://example.com/mcp"
              }, null, 8, kc), [
                [Y, f.url]
              ])
            ]),
            e("label", wc, [
              y[4] || (y[4] = e("span", null, "Headers（JSON）", -1)),
              F(e("textarea", {
                "onUpdate:modelValue": (A) => f.headersText = A,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, $c), [
                [Y, f.headersText]
              ])
            ])
          ], 64)) : (u(), c(J, { key: 2 }, [
            e("p", Sc, l(s(t)("mcp.builtinNote")), 1),
            e("div", Cc, [
              e("div", Pc, [
                e("p", xc, l(s(t)("mcp.imap")), 1),
                e("label", Mc, [
                  e("span", null, l(s(t)("mcp.host")), 1),
                  F(e("input", {
                    "onUpdate:modelValue": (A) => f.imapHost = A,
                    placeholder: "imap.example.com",
                    autocomplete: "off"
                  }, null, 8, Ec), [
                    [Y, f.imapHost]
                  ])
                ]),
                e("div", Uc, [
                  e("label", Tc, [
                    e("span", null, l(s(t)("mcp.port")), 1),
                    F(e("input", {
                      "onUpdate:modelValue": (A) => f.imapPort = A,
                      type: "number",
                      placeholder: "993"
                    }, null, 8, Ac), [
                      [
                        Y,
                        f.imapPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", Ic, [
                    F(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (A) => f.imapSsl = A
                    }, null, 8, Vc), [
                      [ue, f.imapSsl]
                    ]),
                    y[5] || (y[5] = e("span", null, "SSL", -1))
                  ])
                ]),
                e("label", Nc, [
                  e("span", null, l(s(t)("mcp.username")), 1),
                  F(e("input", {
                    "onUpdate:modelValue": (A) => f.imapUser = A,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, Rc), [
                    [Y, f.imapUser]
                  ])
                ]),
                e("label", Lc, [
                  e("span", null, l(s(t)("mcp.password")), 1),
                  F(e("input", {
                    "onUpdate:modelValue": (A) => f.imapPassword = A,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, Oc), [
                    [Y, f.imapPassword]
                  ])
                ])
              ]),
              e("div", Dc, [
                e("p", zc, l(s(t)("mcp.smtp")), 1),
                e("label", Fc, [
                  e("span", null, l(s(t)("mcp.host")), 1),
                  F(e("input", {
                    "onUpdate:modelValue": (A) => f.smtpHost = A,
                    placeholder: "smtp.example.com",
                    autocomplete: "off"
                  }, null, 8, Bc), [
                    [Y, f.smtpHost]
                  ])
                ]),
                e("div", Hc, [
                  e("label", Kc, [
                    e("span", null, l(s(t)("mcp.port")), 1),
                    F(e("input", {
                      "onUpdate:modelValue": (A) => f.smtpPort = A,
                      type: "number",
                      placeholder: "465"
                    }, null, 8, jc), [
                      [
                        Y,
                        f.smtpPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", Yc, [
                    F(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (A) => f.smtpSecure = A
                    }, null, 8, Xc), [
                      [ue, f.smtpSecure]
                    ]),
                    y[6] || (y[6] = e("span", null, "SSL（465）", -1))
                  ])
                ]),
                e("label", Jc, [
                  e("span", null, l(s(t)("mcp.username")), 1),
                  F(e("input", {
                    "onUpdate:modelValue": (A) => f.smtpUser = A,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, Wc), [
                    [Y, f.smtpUser]
                  ])
                ]),
                e("label", qc, [
                  e("span", null, l(s(t)("mcp.password")), 1),
                  F(e("input", {
                    "onUpdate:modelValue": (A) => f.smtpPassword = A,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, Gc), [
                    [Y, f.smtpPassword]
                  ])
                ]),
                e("div", Zc, [
                  e("label", Qc, [
                    e("span", null, l(s(t)("mcp.from")), 1),
                    F(e("input", {
                      "onUpdate:modelValue": (A) => f.from = A,
                      placeholder: s(t)("mcp.fromPlaceholder"),
                      autocomplete: "off"
                    }, null, 8, ed), [
                      [Y, f.from]
                    ])
                  ]),
                  e("label", td, [
                    e("span", null, l(s(t)("mcp.fromName")), 1),
                    F(e("input", {
                      "onUpdate:modelValue": (A) => f.fromName = A,
                      placeholder: "0KAY",
                      autocomplete: "off"
                    }, null, 8, sd), [
                      [Y, f.fromName]
                    ])
                  ])
                ])
              ])
            ])
          ], 64))
        ], 2))), 128)),
        p.value.length ? O("", !0) : (u(), c("p", ld, l(s(t)("mcp.emptyServers")), 1))
      ]))
    ]));
  }
}), od = /* @__PURE__ */ Me(nd, [["__scopeId", "data-v-60e55840"]]), ad = { class: "content-card danger" }, id = { class: "card-desc" }, rd = { class: "danger-box" }, ud = ["disabled"], cd = /* @__PURE__ */ ce({
  __name: "DangerPanel",
  setup(E) {
    const { t } = de(), p = lt(), v = zt(), { confirm: g } = qe(), k = x(!1);
    async function d() {
      if (!(k.value || !await g({
        title: t("settings.reset"),
        message: t("settings.resetConfirmMsg"),
        confirmLabel: t("settings.reset"),
        danger: !0
      }))) {
        k.value = !0;
        try {
          p.resetWizard(), v.push("/");
        } finally {
          k.value = !1;
        }
      }
    }
    return (w, C) => (u(), c("div", ad, [
      e("h2", null, l(s(t)("settings.tabs.danger")), 1),
      e("p", id, l(s(t)("settings.resetDesc")), 1),
      e("div", rd, [
        e("div", null, [
          e("strong", null, l(s(t)("settings.reset")), 1),
          e("p", null, l(s(t)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          disabled: k.value,
          onClick: d
        }, l(s(t)("settings.reset")), 9, ud)
      ])
    ]));
  }
}), dd = {
  key: 1,
  class: "plugin-pane-message"
}, pd = {
  key: 2,
  class: "plugin-pane-message"
}, vd = /* @__PURE__ */ ce({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(E) {
    const { t } = de(), p = E, v = It(null), g = It("");
    let k = 0;
    return je(
      () => p.module,
      async (d) => {
        if (!d) {
          v.value = null, g.value = "";
          return;
        }
        const w = ++k;
        try {
          const C = await import(
            /* @vite-ignore */
            d
          );
          if (w !== k) return;
          v.value = C?.default || C, g.value = "";
        } catch (C) {
          if (w !== k) return;
          v.value = null, g.value = C?.message || String(C);
        }
      },
      { immediate: !0 }
    ), (d, w) => v.value ? (u(), me(os(v.value), { key: 0 })) : g.value ? (u(), c("div", dd, l(g.value), 1)) : (u(), c("div", pd, l(s(t)("pluginPane.loading")), 1));
  }
}), hd = /* @__PURE__ */ Me(vd, [["__scopeId", "data-v-32ca9ff2"]]), md = { class: "pp-head" }, fd = ["aria-label", "disabled"], gd = { class: "pp-roots" }, _d = ["onClick"], bd = ["placeholder"], yd = ["aria-busy"], kd = {
  key: 0,
  class: "pp-empty"
}, wd = {
  key: 1,
  class: "pp-empty pp-error"
}, $d = {
  key: 2,
  class: "pp-empty"
}, Sd = ["title", "onClick"], Cd = { class: "pp-name" }, Pd = ["title"], xd = { class: "pp-foot" }, Md = ["disabled"], Ed = ["disabled"], Ud = /* @__PURE__ */ ce({
  __name: "PathPicker",
  props: {
    open: { type: Boolean },
    initial: {},
    title: {}
  },
  emits: ["update:open", "pick"],
  setup(E, { emit: t }) {
    const p = E, v = t, { t: g } = de(), k = x(""), d = x(""), w = x([]), C = x([]), a = x(!1), i = x(""), n = x(""), o = x(!1);
    let r = "";
    async function m(R) {
      a.value = !0, i.value = "";
      try {
        const L = await fetch(`/api/agent/workspace?path=${encodeURIComponent(R || "")}`);
        if (!L.ok) {
          const I = await L.json().catch(() => ({}));
          i.value = I?.error || `HTTP ${L.status}`;
          return;
        }
        const T = await L.json();
        k.value = String(T?.path || ""), d.value = String(T?.parent || ""), w.value = Array.isArray(T?.roots) ? T.roots.map(String) : [], C.value = Array.isArray(T?.directories) ? T.directories.map((I) => ({ name: String(I?.name || ""), path: String(I?.path || "") })) : [], n.value = k.value, r = k.value;
      } catch (L) {
        i.value = L instanceof Error ? L.message : String(L);
      } finally {
        a.value = !1;
      }
    }
    je(
      () => p.open,
      (R) => {
        if (!R) return;
        i.value = "";
        const L = (p.initial || "").trim() || r;
        n.value = L, m(L);
      },
      { immediate: !0 }
    );
    function y() {
      v("update:open", !1);
    }
    function f() {
      const R = (k.value || n.value).trim();
      R && (v("pick", R), y());
    }
    function M(R) {
      m(R.path);
    }
    function A() {
      d.value && d.value !== k.value && m(d.value);
    }
    async function K() {
      if (!o.value) {
        o.value = !0, i.value = "";
        try {
          const R = await fetch(`/api/agent/pick-folder?title=${encodeURIComponent(p.title || g("settings.pathPickTitle"))}`);
          if (R.ok) {
            const L = await R.json().catch(() => ({}));
            L?.path && (v("pick", String(L.path)), y());
          }
        } catch (R) {
          i.value = R instanceof Error ? R.message : String(R);
        } finally {
          o.value = !1;
        }
      }
    }
    return (R, L) => (u(), me(s(ms), {
      open: E.open,
      title: E.title || s(g)("settings.pathPickTitle"),
      "on-dismiss": y,
      "initial-focus": "first",
      "panel-class": "path-picker-panel"
    }, {
      default: Qe(() => [
        e("header", md, [
          e("h2", null, l(E.title || s(g)("settings.pathPickTitle")), 1),
          e("button", {
            class: "pp-icon",
            type: "button",
            "aria-label": s(g)("settings.pathUp"),
            disabled: a.value,
            onClick: A
          }, "↑", 8, fd)
        ]),
        e("div", gd, [
          (u(!0), c(J, null, ne(w.value, (T) => (u(), c("button", {
            key: T,
            class: ee(["pp-root", { "is-active": k.value === T }]),
            type: "button",
            onClick: (I) => m(T)
          }, l(T), 11, _d))), 128))
        ]),
        F(e("input", {
          "onUpdate:modelValue": L[0] || (L[0] = (T) => n.value = T),
          class: "input pp-path",
          placeholder: s(g)("settings.pathPlaceholder"),
          spellcheck: "false",
          onKeydown: L[1] || (L[1] = mt(Re((T) => m(n.value), ["prevent"]), ["enter"]))
        }, null, 40, bd), [
          [Y, n.value]
        ]),
        e("div", {
          class: "pp-list",
          role: "listbox",
          "aria-busy": a.value
        }, [
          a.value ? (u(), c("p", kd, l(s(g)("settings.pathLoading")), 1)) : i.value ? (u(), c("p", wd, l(i.value), 1)) : C.value.length ? (u(!0), c(J, { key: 3 }, ne(C.value, (T) => (u(), c("button", {
            key: T.path,
            class: "pp-item",
            type: "button",
            role: "option",
            title: T.path,
            onClick: (I) => M(T)
          }, [
            L[2] || (L[2] = e("span", {
              class: "pp-folder",
              "aria-hidden": "true"
            }, "▸", -1)),
            e("span", Cd, l(T.name), 1)
          ], 8, Sd))), 128)) : (u(), c("p", $d, l(s(g)("settings.pathEmpty")), 1))
        ], 8, yd),
        e("p", {
          class: "pp-current",
          title: k.value
        }, l(s(g)("settings.pathSelected", { path: k.value || n.value || "—" })), 9, Pd),
        e("footer", xd, [
          e("button", {
            class: "btn btn-text",
            type: "button",
            disabled: o.value,
            onClick: K
          }, l(o.value ? s(g)("settings.pathNativeBusy") : s(g)("settings.pathNative")), 9, Md),
          L[3] || (L[3] = e("span", { class: "pp-spacer" }, null, -1)),
          e("button", {
            class: "btn btn-text",
            type: "button",
            onClick: y
          }, l(s(g)("settings.cancel")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: a.value || !(k.value || n.value),
            onClick: f
          }, l(s(g)("settings.pathUse")), 9, Ed)
        ])
      ]),
      _: 1
    }, 8, ["open", "title"]));
  }
}), Td = /* @__PURE__ */ Me(Ud, [["__scopeId", "data-v-580db486"]]), tt = x([]);
let Ad = 0;
const ht = /* @__PURE__ */ new Map();
function Id(E) {
  const t = ht.get(E);
  t && clearTimeout(t), ht.delete(E), tt.value = tt.value.filter((p) => p.id !== E);
}
function Dt(E, t = "info", p) {
  const v = {
    id: ++Ad,
    kind: t,
    message: E,
    duration: t === "error" ? 6500 : 3500
  };
  return tt.value = [...tt.value.slice(-4), v], ht.set(v.id, setTimeout(() => Id(v.id), v.duration)), v.id;
}
const Vd = { class: "settings-page" }, Nd = { class: "page-header" }, Rd = { class: "subtitle" }, Ld = { key: 0 }, Od = { key: 1 }, Dd = { class: "settings-layout" }, zd = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, Fd = ["aria-current", "data-tab-id", "title", "aria-label", "onClick"], Bd = {
  class: "nav-icon",
  "aria-hidden": "true"
}, Hd = { class: "nav-label" }, Kd = { class: "settings-content" }, jd = {
  key: 0,
  class: "content-card provider-runtime"
}, Yd = {
  key: 0,
  class: "helper-text"
}, Xd = { class: "actions-row" }, Jd = ["disabled"], Wd = {
  key: "live2d",
  class: "content-card"
}, qd = { class: "card-desc" }, Gd = { class: "toggle-label" }, Zd = { class: "field" }, Qd = { class: "model-choices" }, ep = ["value", "checked", "onChange"], tp = ["placeholder"], sp = { class: "helper-text" }, lp = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, np = { class: "helper-text" }, op = ["disabled"], ap = { class: "field" }, ip = {
  key: 0,
  class: "helper-text"
}, rp = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, up = ["value", "checked", "onChange"], cp = ["onClick"], dp = {
  key: 0,
  class: "card-desc"
}, pp = {
  key: 1,
  class: "helper-text"
}, vp = { class: "actions-row" }, hp = ["disabled"], mp = {
  key: 0,
  class: "helper-text"
}, fp = {
  key: 0,
  class: "helper-text"
}, gp = { class: "actions-row" }, _p = ["disabled"], bp = {
  key: 0,
  class: "card-desc"
}, yp = {
  key: 1,
  class: "card-desc"
}, kp = { class: "actions-row" }, wp = ["disabled"], $p = {
  key: "unknown",
  class: "content-card tab-unknown"
}, Ep = /* @__PURE__ */ ce({
  __name: "SettingsPage",
  setup(E) {
    const { t } = de(), { confirm: p } = qe(), v = lt(), g = fs(), k = Bt(), d = is(), w = zt(), C = G(() => k.settingsTabs.map((D) => ({
      id: D.id,
      icon: D.icon || "chip"
    }))), a = G(() => {
      const D = new Set(k.settingsTabs.map(($) => $.id)), B = new Set(k.removedSettingsIds);
      return g.sections.filter(($) => $.id !== "permissions" && !D.has($.id) && !B.has($.id)).map(($) => ({ id: $.id, icon: $.icon || "lock" }));
    }), i = G(() => [...C.value, ...a.value]), n = x(d.query.tab || "general"), o = x(!1), r = x([]), m = x(null), y = x(""), f = x({}), M = x(""), A = x("ok"), K = x(!1), R = x(!1), L = x(""), T = x(!1), I = x([]), X = G(() => t("settings.modelAuto")), ae = G(() => [
      { value: "", label: X.value },
      ...I.value.map((D) => ({ value: D, label: D }))
    ]);
    async function re() {
      try {
        const D = await fetch("/api/models");
        if (!D.ok) return;
        const B = await D.json();
        I.value = Array.from(new Set((B.models || []).map(($) => String($.id || "")).filter(Boolean)));
      } catch {
      }
    }
    async function j(D) {
      R.value = !0, L.value = "";
      try {
        const B = await fetch(`/api/settings/${D}/test`, { method: "POST" }), $ = B.headers.get("content-type") || "";
        if (B.ok && $.startsWith("audio")) {
          const z = URL.createObjectURL(await B.blob());
          try {
            await new Audio(z).play();
          } catch {
          }
          window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: z } })), L.value = t("settings.testSuccess");
        } else {
          const z = await B.json().catch(() => ({}));
          L.value = z.error || `HTTP ${B.status}`;
        }
      } catch (B) {
        L.value = B instanceof Error ? B.message : String(B);
      } finally {
        R.value = !1;
      }
    }
    const { tabMeta: V, isBuiltinTab: U, isPluginSection: Ee, tabLabel: Ce, fieldLabel: oe, fieldHelp: Ve, pluginSection: le } = ft(), ie = x(""), Le = G({
      get: () => ie.value !== "",
      set: (D) => {
        D || (ie.value = "");
      }
    }), ge = G(() => le(n.value)?.fields.find((B) => B.key === ie.value)?.label || ""), ye = G(() => String(f.value[n.value]?.[ie.value] ?? ""));
    function ke(D) {
      const B = ie.value;
      B && (f.value = {
        ...f.value,
        [n.value]: { ...f.value[n.value], [B]: D }
      });
    }
    const we = G(() => U(n.value) ? null : V(n.value)?.module || null);
    function Pe(D) {
      if (V(D)?.fields?.length && !U(D)) {
        pe(D);
        return;
      }
      const $ = le(D);
      if (!$) return;
      const z = {};
      for (const q of $.fields)
        q.type !== "note" && (q.type === "bool" ? z[q.key] = q.default_value === "true" || q.default_value === "1" : q.type === "number" ? z[q.key] = Number(q.default_value || 0) : z[q.key] = q.default_value || "");
      const he = g.values[D] || {}, _e = { ...z };
      for (const q of $.fields) {
        if (!(q.key in he)) continue;
        const be = he[q.key];
        q.type === "bool" ? _e[q.key] = be === !0 || be === "true" || be === 1 || be === "1" : _e[q.key] = be;
      }
      f.value = {
        ...f.value,
        [D]: _e
      };
    }
    async function pe(D) {
      const B = V(D);
      if (!B?.fields?.length) return;
      const $ = {};
      for (const z of B.fields)
        z.type === "bool" ? $[z.key] = z.default_value === "true" || z.default_value === "1" : z.type === "number" ? $[z.key] = Number(z.default_value || 0) : $[z.key] = z.default_value || "";
      if (B.loadApi)
        try {
          const z = await fetch(B.loadApi);
          if (z.ok) {
            const he = await z.json();
            for (const _e of B.fields) {
              if (!(_e.key in he)) continue;
              const q = he[_e.key];
              _e.type === "bool" ? $[_e.key] = q === !0 || q === "true" || q === 1 || q === "1" : $[_e.key] = q;
            }
          }
        } catch {
        }
      f.value = { ...f.value, [D]: $ };
    }
    async function ve(D) {
      const B = V(D);
      if (!K.value) {
        K.value = !0, M.value = "";
        try {
          const $ = f.value[D] || {};
          if (B?.saveApi) {
            const z = await fetch(B.saveApi, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify($)
            });
            if (!z.ok) throw new Error(String(z.status));
          }
          M.value = t("settings.saved"), A.value = "ok", setTimeout(() => {
            M.value = "";
          }, 3e3);
        } catch {
          M.value = t("settings.permFailed"), A.value = "error";
        } finally {
          K.value = !1;
        }
      }
    }
    async function Be(D) {
      if (!K.value) {
        K.value = !0, M.value = "";
        try {
          const B = new Set((le(D)?.fields || []).filter((z) => z.type === "note").map((z) => z.key)), $ = Object.fromEntries(
            Object.entries(f.value[D] || {}).filter(([z]) => !B.has(z))
          );
          await g.saveValues(D, $), M.value = t("settings.saved"), A.value = "ok", setTimeout(() => {
            M.value = "";
          }, 3e3);
        } catch {
          M.value = t("settings.permFailed"), A.value = "error";
        } finally {
          K.value = !1;
        }
      }
    }
    async function Oe() {
      try {
        const D = await fetch("/api/live2d");
        if (D.ok) {
          const B = await D.json();
          r.value = B.models || [];
        }
      } catch {
        r.value = [];
      }
    }
    async function De(D) {
      if (await p({
        title: t("settings.live2d"),
        message: t("settings.deleteModelConfirm", { label: D.label }),
        confirmLabel: t("common.delete"),
        danger: !0
      }))
        try {
          const $ = await fetch(`/api/live2d/${encodeURIComponent(D.id)}`, { method: "DELETE" });
          if (!$.ok) throw new Error(await $.text());
          const z = await $.json();
          r.value = z.models || [];
          const he = D.url.slice(0, D.url.indexOf("/", 15) + 1);
          v.live2d.modelUrl.startsWith(he) && (v.live2d.modelUrl = "", v.live2d.enabled = !1, v.saveToStorage()), await Ae(), y.value = t("settings.modelDeleted"), window.dispatchEvent(new Event("live2d-models-changed"));
        } catch ($) {
          y.value = $.message;
        }
    }
    async function Ae() {
      v.saveToStorage();
      const D = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: v.live2d.enabled, model_url: v.live2d.modelUrl } }) });
      if (!D.ok) throw new Error(await D.text());
    }
    async function b() {
      if (!T.value) {
        T.value = !0, y.value = "";
        try {
          await Ae(), y.value = t("settings.saved"), setTimeout(() => {
            y.value === t("settings.saved") && (y.value = "");
          }, 3e3);
        } catch (D) {
          y.value = D.message, Dt(t("settings.permFailed"), "error");
        } finally {
          T.value = !1;
        }
      }
    }
    function P() {
      m.value?.click();
    }
    async function S(D) {
      const B = D.target, $ = B.files;
      if (!(!$ || $.length === 0)) {
        y.value = "";
        try {
          const z = new FormData(), he = [];
          for (const be of Array.from($)) {
            const ot = be.webkitRelativePath || be.name;
            he.push(ot), z.append("files", be, be.name);
          }
          z.append("paths", JSON.stringify(he));
          const _e = await fetch("/api/live2d", { method: "POST", body: z });
          if (!_e.ok) throw new Error(await _e.text());
          const q = await _e.json();
          y.value = t("settings.uploadOk"), q?.models ? r.value = q.models : await Oe(), q?.model_url && (v.live2d.modelUrl = q.model_url, v.live2d.enabled = !0, v.saveToStorage(), await Ae(), window.dispatchEvent(new Event("live2d-models-changed")));
        } catch (z) {
          y.value = `${t("settings.uploadFail")}：${z.message}`;
        } finally {
          B.value = "";
        }
      }
    }
    Te(async () => {
      v.loadFromStorage(), Oe(), re(), await g.fetchSections();
      for (const D of g.sections) Pe(D.id);
      g.sections.length && !i.value.some((D) => D.id === n.value) && !U(n.value) && (n.value = "general");
    });
    function Z(D) {
      n.value = D, U(D) || Pe(D), w.replace({ query: { tab: D } });
    }
    function $e() {
      if (v.saveToStorage(), n.value === "live2d") {
        Ae().then(() => {
          o.value = !0, setTimeout(() => {
            o.value = !1;
          }, 1500);
        }).catch((D) => {
          y.value = D.message, Dt(t("settings.permFailed"), "error");
        });
        return;
      }
      o.value = !0, setTimeout(() => {
        o.value = !1;
      }, 1500);
    }
    return (D, B) => (u(), c("div", Vd, [
      e("header", Nd, [
        e("div", null, [
          e("h1", null, l(s(t)("settings.title")), 1),
          e("p", Rd, l(s(t)("settings.pageDesc")), 1)
        ]),
        n.value === "persona" || n.value === "live2d" ? (u(), c("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: $e
        }, [
          o.value ? (u(), c("span", Ld, l(s(t)("settings.saved")), 1)) : (u(), c("span", Od, l(s(t)("settings.save")), 1))
        ])) : O("", !0)
      ]),
      e("div", Dd, [
        e("nav", zd, [
          (u(!0), c(J, null, ne(i.value, ($) => (u(), c("button", {
            key: $.id,
            class: ee(["nav-item", { active: n.value === $.id }]),
            "aria-current": n.value === $.id ? "true" : void 0,
            "data-tab-id": $.id,
            title: s(Ce)($.id),
            "aria-label": s(Ce)($.id),
            onClick: (z) => Z($.id)
          }, [
            B[7] || (B[7] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", Bd, [
              fe(s(gs), {
                name: $.icon || "chip",
                size: 20
              }, null, 8, ["name"])
            ]),
            e("span", Hd, l(s(Ce)($.id)), 1)
          ], 10, Fd))), 128))
        ]),
        e("section", Kd, [
          fe(as, {
            name: "tab",
            mode: "out-in"
          }, {
            default: Qe(() => [
              n.value === "general" ? (u(), me(Ri, { key: "general" })) : n.value === "connection" ? (u(), me(Lr, { key: "connection" })) : n.value === "provider" ? (u(), c(J, { key: 2 }, [
                fe(ki),
                s(le)("provider")?.fields?.length ? (u(), c("div", jd, [
                  e("h3", null, l(s(le)("provider").label), 1),
                  s(le)("provider").description ? (u(), c("p", Yd, l(s(le)("provider").description), 1)) : O("", !0),
                  (u(!0), c(J, null, ne(s(le)("provider").fields, ($) => (u(), me(vt, {
                    key: $.key,
                    field: $,
                    label: $.label,
                    help: $.help,
                    "model-value": f.value.provider?.[$.key],
                    "section-id": "provider",
                    "model-options": ae.value,
                    "available-models": I.value,
                    "onUpdate:modelValue": (z) => f.value = { ...f.value, provider: { ...f.value.provider, [$.key]: z } },
                    onBrowse: (z) => ie.value = $.key
                  }, null, 8, ["field", "label", "help", "model-value", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                  M.value ? (u(), c("div", {
                    key: 1,
                    class: ee(["helper-text", A.value === "error" ? "msg-error" : "msg-success"]),
                    role: "status"
                  }, l(M.value), 3)) : O("", !0),
                  e("div", Xd, [
                    e("button", {
                      class: "btn btn-primary",
                      type: "button",
                      disabled: K.value,
                      onClick: B[0] || (B[0] = ($) => Be("provider"))
                    }, l(s(t)("settings.save")), 9, Jd)
                  ])
                ])) : O("", !0)
              ], 64)) : n.value === "persona" ? (u(), me(tu, { key: 3 })) : n.value === "live2d" ? (u(), c("div", Wd, [
                e("h2", null, l(s(Ce)("live2d")), 1),
                e("p", qd, l(s(V)("live2d")?.descriptionKey ? s(t)(s(V)("live2d").descriptionKey) : s(t)("settings.live2dDesc")), 1),
                fe(xs, { class: "live2d-preview" }),
                e("label", Gd, [
                  F(e("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": B[1] || (B[1] = ($) => s(v).live2d.enabled = $)
                  }, null, 512), [
                    [ue, s(v).live2d.enabled]
                  ]),
                  B[8] || (B[8] = e("span", { class: "toggle-slider" }, null, -1)),
                  e("span", null, l(s(t)("wizard.enableLive2d")), 1)
                ]),
                e("div", Zd, [
                  e("label", null, l(s(t)("wizard.modelUrl")), 1),
                  e("div", Qd, [
                    (u(!0), c(J, null, ne(s(_s), ($) => (u(), c("label", {
                      key: $.id,
                      class: ee(["model-choice", { selected: s(v).live2d.modelUrl === $.url }])
                    }, [
                      e("input", {
                        type: "radio",
                        name: "live2d-model",
                        value: $.url,
                        checked: s(v).live2d.modelUrl === $.url,
                        onChange: (z) => {
                          s(v).live2d.modelUrl = $.url, s(v).live2d.enabled = !0;
                        }
                      }, null, 40, ep),
                      e("span", null, l($.label), 1),
                      e("code", null, l($.url), 1)
                    ], 2))), 128))
                  ]),
                  F(e("input", {
                    "onUpdate:modelValue": B[2] || (B[2] = ($) => s(v).live2d.modelUrl = $),
                    placeholder: s(t)("wizard.modelUrlPlaceholder"),
                    class: "input"
                  }, null, 8, tp), [
                    [Y, s(v).live2d.modelUrl]
                  ]),
                  e("p", sp, [
                    Ue(l(s(t)("wizard.live2dHelp")) + " ", 1),
                    e("a", lp, l(s(t)("wizard.live2dSamples")), 1)
                  ])
                ]),
                e("p", np, l(s(t)("settings.live2dHelper")), 1),
                e("button", {
                  class: "btn btn-tonal",
                  disabled: T.value,
                  onClick: b
                }, l(T.value ? s(t)("settings.saving") : s(t)("settings.saveLife2d")), 9, op),
                e("div", ap, [
                  e("label", null, l(s(t)("settings.uploadFolder")), 1),
                  e("label", {
                    class: "upload-area",
                    onClick: Re(P, ["prevent"])
                  }, [
                    e("span", null, l(s(t)("settings.uploadFolderHint")), 1)
                  ]),
                  e("input", {
                    ref_key: "folderInput",
                    ref: m,
                    type: "file",
                    webkitdirectory: "",
                    directory: "",
                    multiple: "",
                    class: "file-input",
                    onChange: S
                  }, null, 544),
                  y.value ? (u(), c("p", ip, l(y.value), 1)) : O("", !0),
                  r.value.length ? (u(), c("div", rp, [
                    (u(!0), c(J, null, ne(r.value, ($) => (u(), c("label", {
                      key: $.id,
                      class: ee(["model-choice", { selected: s(v).live2d.modelUrl === $.url }])
                    }, [
                      e("input", {
                        type: "radio",
                        name: "live2d-uploaded",
                        value: $.url,
                        checked: s(v).live2d.modelUrl === $.url,
                        onChange: (z) => {
                          s(v).live2d.modelUrl = $.url, s(v).live2d.enabled = !0, Ae().catch((he) => y.value = he.message);
                        }
                      }, null, 40, up),
                      e("span", null, l($.label), 1),
                      e("code", null, l($.url), 1),
                      e("button", {
                        type: "button",
                        class: "btn btn-danger",
                        onClick: Re((z) => De($), ["prevent"])
                      }, l(s(t)("settings.deleteModel")), 9, cp)
                    ], 2))), 128))
                  ])) : O("", !0)
                ])
              ])) : n.value === "security" ? (u(), me(Gu, { key: 5 })) : n.value === "permissions" ? (u(), me(vu, { key: 6 })) : n.value === "mcp" ? (u(), me(od, { key: 7 })) : n.value === "life_settings" ? (u(), me(Wl, { key: 8 })) : s(Ee)(n.value) && s(le)(n.value) ? (u(), c("div", {
                key: `section-${n.value}`,
                class: "content-card"
              }, [
                e("h2", null, l(s(le)(n.value).label), 1),
                s(le)(n.value).description ? (u(), c("p", dp, l(s(le)(n.value).description), 1)) : O("", !0),
                s(le)(n.value).plugin_name && s(le)(n.value).plugin_name !== n.value ? (u(), c("p", pp, l(s(t)("settings.pluginProvidedBy", { name: s(le)(n.value).plugin_name })), 1)) : O("", !0),
                (u(!0), c(J, null, ne(s(le)(n.value).fields.filter(($) => $.type !== "test"), ($) => (u(), me(vt, {
                  key: $.key,
                  field: $,
                  label: $.label,
                  help: $.help,
                  "model-value": f.value[n.value]?.[$.key],
                  "section-id": n.value,
                  "model-options": ae.value,
                  "available-models": I.value,
                  "onUpdate:modelValue": (z) => f.value[n.value] = { ...f.value[n.value], [$.key]: z },
                  onBrowse: (z) => ie.value = $.key
                }, null, 8, ["field", "label", "help", "model-value", "section-id", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                (u(!0), c(J, null, ne(s(le)(n.value).fields.filter(($) => $.type === "test"), ($) => (u(), c("div", {
                  key: $.key,
                  class: "field"
                }, [
                  e("label", null, l($.label), 1),
                  e("div", vp, [
                    e("button", {
                      class: "btn btn-tonal",
                      type: "button",
                      disabled: R.value,
                      onClick: B[3] || (B[3] = (z) => j(n.value))
                    }, l(R.value ? s(t)("settings.testing") : $.label || s(t)("settings.test")), 9, hp),
                    L.value ? (u(), c("span", mp, l(L.value), 1)) : O("", !0)
                  ]),
                  $.help ? (u(), c("p", fp, l($.help), 1)) : O("", !0)
                ]))), 128)),
                M.value ? (u(), c("div", {
                  key: 2,
                  class: ee(["helper-text", A.value === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, l(M.value), 3)) : O("", !0),
                e("div", gp, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: K.value,
                    onClick: B[4] || (B[4] = ($) => Be(n.value))
                  }, l(s(t)("settings.save")), 9, _p)
                ])
              ])) : we.value ? (u(), me(hd, {
                key: we.value,
                module: we.value || ""
              }, null, 8, ["module"])) : !s(U)(n.value) && s(V)(n.value)?.fields?.length ? (u(), c("div", {
                key: `patch-${n.value}`,
                class: "content-card"
              }, [
                e("h2", null, l(s(Ce)(n.value)), 1),
                s(V)(n.value)?.descriptionKey ? (u(), c("p", bp, l(s(t)(s(V)(n.value).descriptionKey)), 1)) : s(V)(n.value)?.description ? (u(), c("p", yp, l(s(V)(n.value).description), 1)) : O("", !0),
                (u(!0), c(J, null, ne(s(V)(n.value).fields, ($) => (u(), me(vt, {
                  key: $.key,
                  field: $,
                  label: s(oe)(s(V)(n.value), $.key, `settings.${$.key}`),
                  help: s(Ve)(s(V)(n.value), $.key, `settings.${$.key}Desc`),
                  "model-value": f.value[n.value]?.[$.key],
                  "section-id": n.value,
                  "model-options": ae.value,
                  "available-models": I.value,
                  "onUpdate:modelValue": (z) => f.value[n.value] = { ...f.value[n.value], [$.key]: z },
                  onBrowse: (z) => ie.value = $.key
                }, null, 8, ["field", "label", "help", "model-value", "section-id", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                M.value ? (u(), c("div", {
                  key: 2,
                  class: ee(["helper-text", A.value === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, l(M.value), 3)) : O("", !0),
                e("div", kp, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: K.value,
                    onClick: B[5] || (B[5] = ($) => ve(n.value))
                  }, l(s(t)("settings.save")), 9, wp)
                ])
              ])) : n.value === "about" ? (u(), me(so, { key: "about" })) : n.value === "updates" ? (u(), me(Jo, { key: "updates" })) : n.value === "danger" ? (u(), me(cd, { key: "danger" })) : (u(), c("div", $p, [
                e("p", null, l(s(t)("settings.tabNotFound")), 1)
              ]))
            ]),
            _: 1
          })
        ])
      ]),
      fe(Td, {
        open: Le.value,
        "onUpdate:open": B[6] || (B[6] = ($) => Le.value = $),
        initial: ye.value,
        title: ge.value,
        onPick: ke
      }, null, 8, ["open", "initial", "title"])
    ]));
  }
});
export {
  Ep as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent="@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage[data-v-389757eb]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-389757eb]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-389757eb]:active{cursor:grabbing}.stage-canvas[data-v-389757eb]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-389757eb]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-389757eb]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-389757eb]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-389757eb]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-389757eb]:active{transform:scale(.96)}.stage-reset.dragging[data-v-389757eb]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-389757eb]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-389757eb]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-389757eb]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.life-settings[data-v-d91bdafc]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-d91bdafc]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-d91bdafc .52s var(--ls-spring) both}.ls-hero-main[data-v-d91bdafc]{min-width:0}.ls-eyebrow[data-v-d91bdafc]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-d91bdafc]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-d91bdafc]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-d91bdafc]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-d91bdafc]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-d91bdafc]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-d91bdafc]{font-size:16px}.ls-grid[data-v-d91bdafc]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-d91bdafc]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-d91bdafc .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-d91bdafc]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-d91bdafc]{grid-column:1 / -1}.ls-card-head[data-v-d91bdafc]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-d91bdafc]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-d91bdafc]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-d91bdafc]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d91bdafc]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d91bdafc]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-d91bdafc]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-d91bdafc]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-d91bdafc]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-d91bdafc]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-d91bdafc]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-d91bdafc]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-d91bdafc]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-d91bdafc]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-d91bdafc]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-d91bdafc]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-d91bdafc]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-d91bdafc]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-d91bdafc]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-d91bdafc]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-d91bdafc]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-d91bdafc]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-d91bdafc]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-d91bdafc]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-d91bdafc]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-d91bdafc]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-d91bdafc]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-d91bdafc]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-d91bdafc]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-d91bdafc]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-d91bdafc]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-d91bdafc]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-d91bdafc]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-d91bdafc]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}#app .ls-model[data-v-d91bdafc]{border-radius:20px}#app .ls-model.selected[data-v-d91bdafc]{border-radius:20px 20px 20px 8px}.ls-model b[data-v-d91bdafc]{font-size:13px;word-break:break-all}.ls-model span[data-v-d91bdafc]{font-size:12px;color:var(--md-on-surface-variant)}.ls-hint[data-v-d91bdafc]{margin:12px 0 0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.ls-state[data-v-d91bdafc]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-d91bdafc .32s var(--ls-spring) both}@keyframes ls-rise-d91bdafc{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-d91bdafc{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-d91bdafc],.ls-row[data-v-d91bdafc],.ls-models[data-v-d91bdafc]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-d91bdafc],.ls-card[data-v-d91bdafc],.ls-state[data-v-d91bdafc]{animation:none}}.about[data-v-2678e07b]{display:flex;flex-direction:column;gap:26px}.identity[data-v-2678e07b]{display:flex;align-items:center;gap:16px}.app-icon[data-v-2678e07b]{flex:none;width:56px;height:56px;filter:drop-shadow(0 6px 16px color-mix(in srgb,var(--md-primary) 25%,transparent))}.app-id[data-v-2678e07b]{flex:1;min-width:0}.app-id h2[data-v-2678e07b]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-2678e07b]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-2678e07b]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-2678e07b]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-2678e07b]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-2678e07b]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-2678e07b]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-2678e07b]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.credits[data-v-2678e07b]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-2678e07b]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-2678e07b]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-2678e07b]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-2678e07b]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-2678e07b]{font-size:16px;font-weight:650}.person-info .role[data-v-2678e07b]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-2678e07b]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-2678e07b]{margin-top:6px}.contribs[data-v-2678e07b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-2678e07b]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-2678e07b]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-2678e07b]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-2678e07b]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-2678e07b]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-2678e07b]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-2678e07b]{margin-left:auto}.status-chip[data-v-2678e07b]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-2678e07b]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-2678e07b]:hover{text-decoration:underline}.muted[data-v-2678e07b]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-2678e07b]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-2678e07b]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-hero.warn[data-v-2678e07b]{background:var(--md-warning-container);color:var(--md-on-warning-container);border-color:transparent}.us-hero.none[data-v-2678e07b]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-2678e07b]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-2678e07b]{flex:1;min-width:0}.us-hero-text b[data-v-2678e07b]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-2678e07b]{font-size:13px;opacity:.85}.us-hero-text em[data-v-2678e07b]{font-style:normal;font-weight:700}.us-hero-actions[data-v-2678e07b]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-2678e07b]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-2678e07b]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-2678e07b]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-2678e07b]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-2678e07b]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-2678e07b]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-apply-banner.failed[data-v-2678e07b]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-2678e07b]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-2678e07b]{font-weight:700}.us-apply-label[data-v-2678e07b]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-2678e07b]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-2678e07b]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-2678e07b]{animation:us-spin-2678e07b .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-2678e07b],.us-apply-banner.failed .us-spinner[data-v-2678e07b]{display:none}.us-apply-log[data-v-2678e07b],.us-apply-error[data-v-2678e07b]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-2678e07b{to{transform:rotate(360deg)}}.alert[data-v-2678e07b]{color:var(--md-error)}.updates[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-bc3fb39c]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-bc3fb39c]{display:flex;align-items:center;gap:12px}.us-ico[data-v-bc3fb39c]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-bc3fb39c]{flex:1;min-width:0}.us-title[data-v-bc3fb39c]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-bc3fb39c]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px}.us-tag[data-v-bc3fb39c]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-bc3fb39c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-bc3fb39c]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-bc3fb39c]{background:#ffdf9e;color:#4a3800}.us-source[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-bc3fb39c]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-bc3fb39c]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-bc3fb39c]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-bc3fb39c]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-bc3fb39c]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-bc3fb39c]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-bc3fb39c]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-bc3fb39c]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-bc3fb39c]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-bc3fb39c]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-bc3fb39c]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-bc3fb39c]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-bc3fb39c]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-bc3fb39c]{flex:1;min-width:0}.us-hero-text b[data-v-bc3fb39c]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-bc3fb39c]{font-size:13px;opacity:.85}.us-hero-text em[data-v-bc3fb39c]{font-style:normal;font-weight:700}.us-hero-actions[data-v-bc3fb39c]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-bc3fb39c]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-bc3fb39c]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-bc3fb39c]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-bc3fb39c]{font-weight:700}.us-apply-label[data-v-bc3fb39c]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-bc3fb39c]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-bc3fb39c]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-bc3fb39c]{animation:us-spin-bc3fb39c .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-bc3fb39c],.us-apply-banner.failed .us-spinner[data-v-bc3fb39c]{display:none}.us-apply-log[data-v-bc3fb39c],.us-apply-error[data-v-bc3fb39c]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-bc3fb39c{to{transform:rotate(360deg)}}.us-table[data-v-bc3fb39c]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-bc3fb39c]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-bc3fb39c]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-bc3fb39c]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-bc3fb39c]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden}.us-name-text[data-v-bc3fb39c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-bc3fb39c]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-bc3fb39c]{background:var(--md-success)}.us-dot.warn[data-v-bc3fb39c]{background:#e0a800}.us-dot.bad[data-v-bc3fb39c]{background:var(--md-error)}.us-ver[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-bc3fb39c]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-bc3fb39c]{font-weight:650}.us-ver b.good[data-v-bc3fb39c]{color:var(--md-success)}.us-arrow[data-v-bc3fb39c]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-bc3fb39c]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden}.us-status-text[data-v-bc3fb39c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-bc3fb39c]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-bc3fb39c]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-bc3fb39c]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-bc3fb39c]:hover{text-decoration:underline}.us-empty[data-v-bc3fb39c]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-bc3fb39c]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-bc3fb39c]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.alert[data-v-bc3fb39c]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-bc3fb39c]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-bc3fb39c]{display:none}.us-hero[data-v-bc3fb39c]{flex-wrap:wrap}.us-hero-actions[data-v-bc3fb39c]{width:100%}}.provider-panel[data-v-33dae46a]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-33dae46a]{display:flex;align-items:center;gap:14px}.pp-back[data-v-33dae46a]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-33dae46a]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-33dae46a]{flex:1;min-width:0}.pp-editor-title h2[data-v-33dae46a]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-33dae46a]{margin:3px 0 0}.pp-section[data-v-33dae46a]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-33dae46a]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-33dae46a]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-33dae46a]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-33dae46a]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-33dae46a]{margin-bottom:0}.pp-span[data-v-33dae46a]{grid-column:1 / -1}.pp-req[data-v-33dae46a]{color:var(--md-error);margin-left:2px}.pp-key[data-v-33dae46a]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-33dae46a]{flex:1}.pp-key-toggle[data-v-33dae46a]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-33dae46a]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-33dae46a]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-33dae46a]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-33dae46a]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-33dae46a]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-33dae46a]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-33dae46a]{animation:pp-pulse-33dae46a 1s ease-in-out infinite}@keyframes pp-pulse-33dae46a{50%{opacity:.15}}.pp-probe[data-v-33dae46a]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-33dae46a]{color:var(--md-success)}.pp-probe.err[data-v-33dae46a]{color:var(--md-error)}.pp-discovered[data-v-33dae46a]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-33dae46a]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-33dae46a]{flex:1;min-width:160px}.pp-mini[data-v-33dae46a]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-33dae46a]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-add-model[data-v-33dae46a]{display:flex;align-items:center;gap:8px;margin-top:8px}.pp-add-model .input[data-v-33dae46a]{flex:1;min-width:0}.pp-add-model .btn[data-v-33dae46a]{flex:none;white-space:nowrap}.pp-add-error[data-v-33dae46a]{color:var(--md-error)}.pp-remove[data-v-33dae46a]{flex:none;width:26px;height:26px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);font-size:17px;line-height:1;cursor:pointer}.pp-remove[data-v-33dae46a]:hover{background:color-mix(in srgb,var(--md-error) 14%,transparent);color:var(--md-error)}.pp-models[data-v-33dae46a]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-33dae46a]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-33dae46a]:first-child{border-top:0}.pp-model.off[data-v-33dae46a]{opacity:.5}.pp-model-name[data-v-33dae46a]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-33dae46a]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-33dae46a]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-33dae46a]{color:#e0a800;cursor:default}.pp-switch[data-v-33dae46a]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-33dae46a]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-33dae46a]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-33dae46a]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-33dae46a]{display:flex;gap:10px}.pp-list-head[data-v-33dae46a]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-33dae46a]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-33dae46a]{margin:3px 0 0}.pp-list-actions[data-v-33dae46a]{display:flex;gap:8px}.pp-cards[data-v-33dae46a]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:14px}.pp-card[data-v-33dae46a]{display:flex;flex-direction:column;gap:12px;padding:16px;min-width:0;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-33dae46a]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-33dae46a]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-33dae46a]{opacity:.62}.pp-card-head[data-v-33dae46a]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-33dae46a]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-33dae46a]{width:26px;height:26px}.pp-card-id[data-v-33dae46a]{flex:1;min-width:0}.pp-card-id strong[data-v-33dae46a]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-33dae46a]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-33dae46a]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-33dae46a]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-33dae46a]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-33dae46a]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-33dae46a]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-33dae46a]{color:var(--md-error)}.pp-chips[data-v-33dae46a]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-33dae46a]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-33dae46a],.pp-chip.empty[data-v-33dae46a]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-33dae46a]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.pp-empty[data-v-33dae46a]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-33dae46a],.pp-cards[data-v-33dae46a]{grid-template-columns:1fr}}.pairing-panel[data-v-67a1ff9e]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-67a1ff9e]{margin:12px 0;color:var(--md-on-surface-variant)}.pairing-panel .pairing-error[data-v-67a1ff9e]{color:var(--md-error)}article[data-v-67a1ff9e]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-67a1ff9e]{font-size:24px;letter-spacing:4px}h4[data-v-67a1ff9e]{margin:18px 0 0}.pairing-list[data-v-67a1ff9e]{position:relative}.pair-enter-active[data-v-67a1ff9e],.pair-leave-active[data-v-67a1ff9e]{transition:opacity var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out)}.pair-enter-from[data-v-67a1ff9e],.pair-leave-to[data-v-67a1ff9e]{opacity:0;transform:translateY(4px)}.pair-leave-active[data-v-67a1ff9e]{position:absolute;width:100%}.pair-move[data-v-67a1ff9e]{transition:transform var(--duration-medium) var(--ease-out)}@media(prefers-reduced-motion:reduce){.pair-enter-active[data-v-67a1ff9e],.pair-leave-active[data-v-67a1ff9e],.pair-move[data-v-67a1ff9e]{transition-duration:1ms}}.models-field[data-v-b6ad9d20]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-b6ad9d20]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-b6ad9d20]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-b6ad9d20]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-b6ad9d20]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-b6ad9d20]{display:inline-flex;gap:4px}.models-actions button[data-v-b6ad9d20]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-b6ad9d20]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-b6ad9d20]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-b6ad9d20]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.connection-grid[data-v-d9b226f0]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,264px);gap:24px;align-items:start}@media(max-width:1000px){.connection-grid[data-v-d9b226f0]{grid-template-columns:minmax(0,1fr)}}.connection-form .field[data-v-d9b226f0]{margin-bottom:12px}.connection-qr[data-v-d9b226f0]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-d9b226f0]{background:#fff;border-radius:8px;padding:6px;width:100%;max-width:264px;height:auto}.connection-link[data-v-d9b226f0]{max-width:100%;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.helper-text[data-v-d9b226f0]{overflow-wrap:anywhere}.toggle-label[data-v-d9b226f0]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-8a0a3d8d]{max-width:920px}.sec-stack[data-v-8a0a3d8d]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-8a0a3d8d]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-8a0a3d8d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-8a0a3d8d]{font-size:15px;font-weight:700}.sec-chip[data-v-8a0a3d8d]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-8a0a3d8d]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-8a0a3d8d]{margin:2px 0 12px}.sec-pin-grid[data-v-8a0a3d8d]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-8a0a3d8d]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-8a0a3d8d]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-8a0a3d8d]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-8a0a3d8d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-8a0a3d8d]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-8a0a3d8d]:hover{background:var(--md-surface-container)}.page-item[data-v-8a0a3d8d]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-8a0a3d8d]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-8a0a3d8d]{width:44px;height:26px}.page-item .toggle-slider[data-v-8a0a3d8d]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-8a0a3d8d]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-8a0a3d8d]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-8a0a3d8d]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-8a0a3d8d]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-8a0a3d8d]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-8a0a3d8d]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-8a0a3d8d]{margin-top:12px}.sec-error[data-v-8a0a3d8d]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-8a0a3d8d]{grid-template-columns:1fr}}.mcp-panel[data-v-60e55840]{max-width:900px}.mcp-head[data-v-60e55840]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-60e55840]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-60e55840]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-60e55840]{display:flex;gap:10px}.error-banner[data-v-60e55840]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-60e55840]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-60e55840]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-60e55840]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-60e55840]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-60e55840]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-60e55840]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-60e55840]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-60e55840]{flex:1}.mcp-field>span[data-v-60e55840]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-60e55840],.mcp-field select[data-v-60e55840],.mcp-field textarea[data-v-60e55840]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-60e55840]{opacity:.7}.mcp-field textarea[data-v-60e55840]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-60e55840]:focus,.mcp-field select[data-v-60e55840]:focus,.mcp-field textarea[data-v-60e55840]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-60e55840]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-60e55840]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-60e55840]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-60e55840]{font-family:ui-monospace,monospace}.mail-grid[data-v-60e55840]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-60e55840]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-60e55840]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-60e55840]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-60e55840]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-60e55840]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-60e55840]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-60e55840]:disabled{opacity:.6;cursor:not-allowed}#app .mcp-panel[data-v-60e55840] :is(.btn,.mcp-remove){border-radius:999px}#app .mcp-panel .mcp-field[data-v-60e55840] :is(input,select,textarea){border-radius:12px}@media(max-width:720px){.mail-grid[data-v-60e55840]{grid-template-columns:1fr}}.plugin-pane-message[data-v-32ca9ff2]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.pp-head[data-v-580db486]{display:flex;align-items:center;justify-content:space-between;gap:8px}.pp-head h2[data-v-580db486]{margin:0;font-size:18px}.pp-icon[data-v-580db486]{width:32px;height:32px;border-radius:50%;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);font-size:15px;cursor:pointer}.pp-icon[data-v-580db486]:disabled{opacity:.45;cursor:not-allowed}.pp-roots[data-v-580db486]{display:flex;flex-wrap:wrap;gap:6px}.pp-root[data-v-580db486]{padding:4px 10px;border-radius:999px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface-variant);font-size:12px;font-family:monospace;cursor:pointer}.pp-root.is-active[data-v-580db486]{border-color:var(--md-primary);color:var(--md-primary)}.pp-path[data-v-580db486]{font-family:monospace;font-size:13px}.pp-list[data-v-580db486]{display:flex;flex-direction:column;gap:2px;min-height:180px;max-height:42vh;overflow:auto;padding:6px;border-radius:14px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest, var(--md-surface))}.pp-item[data-v-580db486]{display:flex;align-items:center;gap:8px;padding:7px 10px;border:0;border-radius:10px;background:none;color:var(--md-on-surface);font-size:13px;text-align:left;cursor:pointer}.pp-item[data-v-580db486]:hover,.pp-item[data-v-580db486]:focus-visible{background:var(--md-surface-container-high);outline:none}.pp-folder[data-v-580db486]{color:var(--md-primary);font-size:13px;line-height:1;opacity:.85}.pp-name[data-v-580db486]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-empty[data-v-580db486]{margin:0;padding:24px 8px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.pp-error[data-v-580db486]{color:var(--md-error, #b3261e)}.pp-current[data-v-580db486]{margin:0;font-family:monospace;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-foot[data-v-580db486]{display:flex;align-items:center;gap:8px}.pp-spacer[data-v-580db486]{flex:1}\n";document.head.appendChild(s)}})();
