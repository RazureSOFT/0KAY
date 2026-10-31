var es = Object.defineProperty;
var ts = (y, s, h) => s in y ? es(y, s, { enumerable: !0, configurable: !0, writable: !0, value: h }) : y[s] = h;
var Q = (y, s, h) => ts(y, typeof s != "symbol" ? s + "" : s, h);
import { defineComponent as he, ref as x, computed as Z, onMounted as Ue, onUnmounted as nt, watch as He, openBlock as r, createElementBlock as p, normalizeClass as le, createElementVNode as e, unref as t, normalizeStyle as Tt, toDisplayString as n, createCommentVNode as N, withModifiers as Re, nextTick as ss, createVNode as fe, Fragment as G, renderList as de, createTextVNode as Ce, reactive as ns, withDirectives as D, vModelCheckbox as ge, vModelText as J, withKeys as mt, createStaticVNode as ls, vModelDynamic as os, TransitionGroup as At, withCtx as et, createBlock as me, vModelSelect as as, shallowRef as It, resolveDynamicComponent as is, Transition as rs, isRef as ds } from "vue";
import { useI18n as ve } from "vue-i18n";
import { useLifeStore as cs, useWizardStore as lt, live2dRuntimeReady as us, DEFAULT_LIVE2D_MODELS as ps, apiGet as Le, apiPost as tt, ApiError as zt, useConfirm as We, useProvidersStore as hs, PROVIDERS as ut, AppSelect as ze, getLanguage as vs, LOCALES as ms, setLanguage as fs, MarkdownContent as gs, useSettingsMeta as ft, useUIPatchesStore as Ft, PinInput as Vt, ModalShell as bs, useSettingsSectionsStore as _s, NavIcon as ys } from "@0kay/host";
import { useRouter as Bt, useRoute as ks } from "vue-router";
const ws = ["title"], $s = {
  key: 0,
  class: "stage-placeholder"
}, Ss = {
  key: 1,
  class: "stage-status"
}, Cs = {
  key: 2,
  class: "stage-status warn"
}, Ps = ["title", "aria-label"], xs = { class: "stage-hint" }, Nt = "0kay.web.live2d.resetbtn", Ms = "0kay.web.live2d.transform.", Es = /* @__PURE__ */ he({
  __name: "Live2DStage",
  props: {
    bare: { type: Boolean, default: !1 }
  },
  setup(y) {
    const { t: s } = ve(), h = cs(), c = lt(), _ = x(null), C = x(null), u = x(""), w = x("idle"), P = x(""), i = y, o = Z(() => i.bare), l = Z(() => c.live2d.enabled), a = Z(() => c.live2d.modelUrl.trim()), d = Z(() => h.emotionMood), m = Z(() => {
      const f = String(d.value || "");
      if (!f) return "";
      const k = `emotion.${f}`, A = s(k);
      return A === k ? f : A;
    }), S = Z(() => h.emotionColor), b = x([]);
    async function E() {
      try {
        const f = await fetch("/api/live2d");
        if (f.ok) {
          const k = await f.json();
          b.value = k.models || [];
        }
      } catch {
        b.value = [];
      }
    }
    const U = x(null), H = x(q()), V = x(!1);
    let I = !1, M = { x: 0, y: 0 }, T = { x: 0, y: 0 };
    function q() {
      try {
        const f = localStorage.getItem(Nt);
        if (f) {
          const k = JSON.parse(f);
          if (typeof k?.x == "number" && typeof k?.y == "number") return k;
        }
      } catch {
      }
      return null;
    }
    const ce = Z(() => H.value ? { left: `${H.value.x}px`, top: `${H.value.y}px`, right: "auto", bottom: "auto" } : {});
    function oe(f) {
      V.value = !0, I = !1, M = { x: f.clientX, y: f.clientY };
      const k = U.value?.getBoundingClientRect();
      T = { x: k?.left ?? 0, y: k?.top ?? 0 };
      try {
        U.value?.setPointerCapture(f.pointerId);
      } catch {
      }
    }
    function F(f) {
      if (!V.value || !_.value) return;
      const k = f.clientX - M.x, A = f.clientY - M.y;
      (Math.abs(k) > 3 || Math.abs(A) > 3) && (I = !0);
      const B = _.value.getBoundingClientRect(), ne = U.value?.offsetWidth || 34, re = Ae(T.x - B.left + k, 4, Math.max(4, B.width - ne - 4)), ie = Ae(T.y - B.top + A, 4, Math.max(4, B.height - ne - 4));
      H.value = { x: Math.round(re), y: Math.round(ie) };
    }
    function j(f) {
      if (V.value) {
        V.value = !1;
        try {
          U.value?.releasePointerCapture(f.pointerId);
        } catch {
        }
        if (I)
          try {
            localStorage.setItem(Nt, JSON.stringify(H.value));
          } catch {
          }
      }
    }
    function K() {
      if (I) {
        I = !1;
        return;
      }
      qt();
    }
    let z = null, O = null, xe = null, ye = 0, se = 0, Te = { x: 0, y: 0, has: !1 }, Me = !1, ae = null, Ie = { x: 0, y: 0 }, te = null, L = null, ee = null, be = null, ke = null, ue = "off", _e = 0, Ee = 0, Be = 0, Ve = 120, Ke = ["ParamMouthOpenY"];
    function $e(f) {
      const k = O?.internalModel?.coreModel;
      if (!k) return;
      const A = Ae(f, 0, 1);
      for (const B of Ke)
        try {
          typeof k.setParameterValueById == "function" ? k.setParameterValueById(B, A) : typeof k.setParamFloat == "function" && k.setParamFloat(B, A);
        } catch {
        }
    }
    function R(f) {
      const k = [];
      try {
        const A = f?.internalModel?.settings;
        let B = A?.getLipSyncParameters?.();
        if (!Array.isArray(B) && Array.isArray(A?.groups) && (B = A.groups.find((re) => (re?.Name || re?.name || "").toLowerCase() === "lipsync")?.Ids), Array.isArray(B))
          for (const ne of B) typeof ne == "string" && ne && k.push(ne);
      } catch {
      }
      Ke = k.length ? k : ["ParamMouthOpenY"];
    }
    function X() {
      if (ue === "off") {
        _e !== 0 && (_e = 0, $e(0));
        return;
      }
      if (ue === "audio" && be && ke) {
        be.getByteTimeDomainData(ke);
        let f = 0;
        for (let B = 0; B < ke.length; B++) {
          const ne = (ke[B] - 128) / 128;
          f += ne * ne;
        }
        const k = Math.sqrt(f / ke.length), A = Ae(k * 3.4, 0, 1);
        _e = _e * 0.35 + A * 0.65, $e(_e);
        return;
      }
      if (ue === "text") {
        const f = performance.now() - Ee;
        if (f > Be * Ve + 260) {
          ue = "off", _e = 0, $e(0);
          return;
        }
        const k = f % Ve / Ve, A = k < 0.5 ? 0.12 + 0.72 * Math.sin(k / 0.5 * Math.PI) : 0.06;
        _e = _e * 0.45 + A * 0.55, $e(_e);
      }
    }
    async function v(f, k = "") {
      if (!f) {
        g(k);
        return;
      }
      if (O)
        try {
          if (te || (te = new Audio(), te.crossOrigin = "anonymous", te.addEventListener("ended", () => {
            ue = "off", _e = 0, $e(0);
          })), L && L !== f)
            try {
              URL.revokeObjectURL(L);
            } catch {
            }
          if (L = f, te.src = f, !ee) {
            const A = window.AudioContext || window.webkitAudioContext;
            A && (ee = new A(), be = ee.createAnalyser(), be.fftSize = 1024, ke = new Uint8Array(be.fftSize), ee.createMediaElementSource(te).connect(be), be.connect(ee.destination));
          }
          await ee?.resume().catch(() => {
          }), ue = "audio", await te.play().catch(() => {
            k ? g(k) : (ue = "off", $e(0));
          });
        } catch {
          k ? g(k) : ue = "off";
        }
    }
    function g(f) {
      const k = Array.from(String(f || "")).filter((A) => /\S/.test(A));
      k.length && (Ve = /[\u4e00-\u9fff]/.test(k.join("")) ? 140 : 80, Be = k.length, Ee = performance.now(), ue = "text");
    }
    function $() {
      ue = "off", _e = 0, $e(0);
      try {
        te?.pause();
      } catch {
      }
    }
    function Y(f) {
      const k = f.detail || {};
      k.url ? v(k.url, k.text || "") : k.text && g(k.text);
    }
    let W = {}, pe = [], qe = 0;
    function Ht(f) {
      W = {}, pe = [];
      try {
        const k = f?.internalModel?.motionManager, A = f?.internalModel?.settings, B = k?.definitions || A?.motions || {};
        for (const [re, ie] of Object.entries(B)) W[re] = Array.isArray(ie) ? ie.length : 0;
        pe = (k?.expressionManager?.definitions || A?.expressions || []).map((re) => re?.Name || re?.name).filter((re) => !!re);
      } catch {
      }
      try {
        console.info("[live2d] motions", W, "expressions", pe);
      } catch {
      }
      try {
        window.__0KAY_LIVE2D_CAPS__ = { motions: W, expressions: pe };
      } catch {
      }
    }
    function Ye(f, k) {
      if (!O) return;
      const A = Object.keys(W).filter((ie) => W[ie] > 0);
      if (!A.length) return;
      const B = A.find((ie) => /idle/i.test(ie)), ne = f && W[f] > 0, re = ne ? f : k == null && B ? B : A.find((ie) => ie !== B) || A[0];
      try {
        const ie = O.internalModel?.motionManager;
        if (typeof O.motion == "function" && ne) {
          O.motion(re, k);
          return;
        }
        if (k == null) {
          ie?.startRandomMotion?.(re);
          return;
        }
        ie?.startMotion?.(re, k);
      } catch {
      }
    }
    function Ge(f) {
      if (!O || !f) return;
      const k = /^\d+$/.test(f) ? Number(f) : pe.indexOf(f), A = k >= 0 ? k : f;
      try {
        const B = O.internalModel?.motionManager?.expressionManager;
        if (B?.setExpression) {
          B.setExpression(A);
          return;
        }
        O.expression?.(A);
      } catch {
      }
    }
    function jt() {
      at(), !(typeof window > "u") && (qe = window.setInterval(() => {
        if (ue !== "off" || document.hidden) return;
        const f = Object.keys(W).filter((k) => W[k] > 0 && !/idle/i.test(k));
        f.length && Math.random() < 0.6 && Ye(f[Math.floor(Math.random() * f.length)]), pe.length && Math.random() < 0.5 && Ge(pe[Math.floor(Math.random() * pe.length)]);
      }, 9e3));
    }
    function at() {
      qe && (clearInterval(qe), qe = 0);
    }
    function bt(f) {
      const k = f.detail || {};
      k.expression && Ge(k.expression), (k.group || k.index != null) && Ye(k.group, k.index);
    }
    function Yt() {
      return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore);
    }
    function Ae(f, k, A) {
      return Math.min(A, Math.max(k, f));
    }
    function it() {
      return Ms + (a.value || "default");
    }
    function _t() {
      try {
        const f = localStorage.getItem(it());
        if (!f) return null;
        const k = JSON.parse(f);
        if (typeof k?.x == "number" && typeof k?.y == "number" && typeof k?.scale == "number") return k;
      } catch {
      }
      return null;
    }
    function rt(f = !1) {
      if (!O) return;
      const k = () => {
        try {
          localStorage.setItem(it(), JSON.stringify({
            x: Math.round(O.x * 100) / 100,
            y: Math.round(O.y * 100) / 100,
            scale: Math.round(O.scale.x * 1e4) / 1e4
          }));
        } catch {
        }
      };
      if (f) {
        se && (clearTimeout(se), se = 0), k();
        return;
      }
      se && clearTimeout(se), se = window.setTimeout(() => {
        se = 0, k();
      }, 140);
    }
    function yt() {
      if (at(), ue = "off", _e = 0, De(), se && (clearTimeout(se), se = 0), O) {
        try {
          z?.stage && z.stage.removeChild(O), O.destroy?.();
        } catch {
        }
        O = null;
      }
    }
    function kt() {
      if (Et(), yt(), xe && (xe.disconnect(), xe = null), se && (clearTimeout(se), se = 0), z) {
        try {
          z.destroy(!1, { children: !0, texture: !1, baseTexture: !1 });
        } catch {
        }
        z = null;
      }
    }
    function wt(f) {
      if (typeof f.getLocalBounds == "function") {
        const B = f.getLocalBounds();
        if (B && B.width > 0 && B.height > 0) return { width: B.width, height: B.height };
      }
      const k = Math.max(Math.abs(f.scale.x) || 0, 1e-4), A = Math.max(Math.abs(f.scale.y) || 0, 1e-4);
      return { width: Math.max(f.width / k, 1), height: Math.max(f.height / A, 1) };
    }
    function dt(f = O) {
      if (!f || !z) return !1;
      const k = z.screen.width, A = z.screen.height;
      if (!k || !A) return !1;
      const B = wt(f);
      if (B.width > 0 && B.height > 0) {
        const ne = Math.min(k / B.width, A / B.height) * 0.88;
        f.anchor?.set?.(0.5, 0.5), f.scale.set(ne, ne);
      }
      f.position.set(k * 0.5, A * 0.55);
      try {
        const ne = f.getBounds?.();
        if (ne && ne.width > 0 && ne.height > 0) {
          f.x += k * 0.5 - (ne.x + ne.width * 0.5), f.y += A * 0.55 - (ne.y + ne.height * 0.55);
          const re = f.getBounds?.();
          if (re && re.width > 0 && re.height > 0) {
            const ie = Math.min(k / re.width, A / re.height) * 0.88, Se = Math.abs(f.scale.x) || 1;
            if (Number.isFinite(ie) && ie > 0 && Math.abs(ie - Se) / Se > 0.08) {
              const Ne = Se * ie;
              f.scale.set(Ne, Ne);
              const we = f.getBounds?.();
              we && we.width > 0 && (f.x += k * 0.5 - (we.x + we.width * 0.5), f.y += A * 0.55 - (we.y + we.height * 0.55));
            }
          }
        }
      } catch {
      }
      return !0;
    }
    function Xt() {
      if (!O) return { hw: 0, hh: 0 };
      const f = wt(O), k = Math.abs(O.scale.x) || 1, A = Math.abs(O.scale.y) || 1;
      return { hw: f.width * k / 2, hh: f.height * A / 2 };
    }
    function Ze() {
      if (!O || !z) return;
      const f = z.screen.width, k = z.screen.height, { hw: A, hh: B } = Xt(), ne = Math.min(A * 0.7, f * 0.5), re = Math.min(B * 0.7, k * 0.5), ie = ne - A, Se = f - ne + A, Ne = re - B, we = k - re + B, Xe = ie <= Se ? Ae(O.x, ie, Se) : f * 0.5, Ut = Ne <= we ? Ae(O.y, Ne, we) : k * 0.55;
      O.position.set(Xe, Ut);
    }
    function Jt() {
      if (!O || !z) return;
      const f = _t();
      if (f && Number.isFinite(f.scale) && f.scale > 0) {
        O.anchor?.set?.(0.5, 0.5), O.scale.set(f.scale, f.scale), O.position.set(f.x, f.y), Ze();
        return;
      }
      dt();
    }
    function Wt(f, k) {
      if (!O || !window.PIXI || typeof window.PIXI.Point != "function" || typeof O.toModelPosition != "function") return null;
      try {
        const A = new window.PIXI.Point(f, k);
        return O.toModelPosition(A, new window.PIXI.Point());
      } catch {
        return null;
      }
    }
    function $t(f, k, A) {
      const B = A - k;
      return !Number.isFinite(B) || Math.abs(B) <= 1e-4 ? 0 : Ae((f - k) / B * 2 - 1, -1, 1);
    }
    function St(f, k) {
      const A = O?.internalModel, B = A?.focusController;
      if (!B || typeof B.focus != "function" || !z) return;
      const ne = z.screen.width || 1, re = z.screen.height || 1;
      let ie = f / ne * 2 - 1, Se = k / re * 2 - 1;
      const Ne = Wt(f, k);
      if (Ne && A.originalWidth && A.originalHeight) {
        const we = $t(Ne.x, 0, A.originalWidth), Xe = $t(Ne.y, 0, A.originalHeight);
        we >= -1 && we <= 1 && Xe >= -1 && Xe <= 1 && (ie = ie * 0.35 + we * 0.65, Se = Se * 0.35 + Xe * 0.65);
      }
      ie = Ae(ie, -1, 1), Se = Ae(Se, -1, 1), B.focus(ie, -Se);
    }
    function Qe() {
      Te.has && St(Te.x, Te.y);
    }
    function Ct(f) {
      if (!O || !z || !_.value) return;
      const k = _.value.getBoundingClientRect();
      if (!k.width || !k.height) return;
      const A = (f.clientX - k.left) / k.width * z.screen.width, B = (f.clientY - k.top) / k.height * z.screen.height;
      Te = { x: A, y: B, has: !0 }, Me && f.pointerId === ae && (O.position.set(A + Ie.x, B + Ie.y), Ze(), rt()), St(A, B);
    }
    function Pt(f) {
      if (!O || !z || !_.value || f.button !== 0 && f.pointerType === "mouse" || f.target?.closest?.(".stage-reset")) return;
      const k = _.value.getBoundingClientRect();
      if (!k.width || !k.height) return;
      const A = (f.clientX - k.left) / k.width * z.screen.width, B = (f.clientY - k.top) / k.height * z.screen.height;
      Me = !0, ae = f.pointerId, Ie = { x: O.x - A, y: O.y - B };
      try {
        _.value.setPointerCapture(f.pointerId);
      } catch {
      }
      _.value && (_.value.style.cursor = "grabbing");
    }
    function De(f) {
      if (Me && !(f && ae !== null && f.pointerId !== ae)) {
        if (Me = !1, _.value) {
          try {
            ae !== null && _.value.releasePointerCapture(ae);
          } catch {
          }
          _.value.style.cursor = "grab";
        }
        ae = null, rt(!0);
      }
    }
    function xt(f) {
      if (!O || w.value !== "ok" || f.shiftKey) return;
      f.preventDefault();
      const k = f.deltaY < 0 ? 1.06 : 0.94, A = Ae(O.scale.x * k, 0.08, 3.2);
      O.scale.set(A, A), Ze(), Qe(), rt();
    }
    function qt() {
      if (!(!O || !z)) {
        try {
          localStorage.removeItem(it());
        } catch {
        }
        se && (clearTimeout(se), se = 0);
        try {
          z.resize?.();
        } catch {
        }
        z?.stage && (z.stage.hitArea = z.screen), dt(), Qe();
      }
    }
    function Mt() {
      Et();
      const f = _.value;
      f && (f.style.cursor = "grab", f.addEventListener("pointermove", Ct), f.addEventListener("pointerdown", Pt), f.addEventListener("pointerup", De), f.addEventListener("pointercancel", De), f.addEventListener("pointerleave", De), f.addEventListener("wheel", xt, { passive: !1 }));
    }
    function Et() {
      const f = _.value;
      f && (f.removeEventListener("pointermove", Ct), f.removeEventListener("pointerdown", Pt), f.removeEventListener("pointerup", De), f.removeEventListener("pointercancel", De), f.removeEventListener("pointerleave", De), f.removeEventListener("wheel", xt), Me = !1, ae = null);
    }
    function Gt() {
      if (z || !C.value || !_.value) return;
      const f = window.PIXI;
      z = new f.Application({
        view: C.value,
        resizeTo: _.value,
        autoStart: !0,
        antialias: !0,
        backgroundAlpha: 0,
        powerPreference: "high-performance"
      }), z.stage && (z.stage.interactive = !0, z.stage.hitArea = z.screen), xe = new ResizeObserver(() => {
        try {
          z?.resize?.();
        } catch {
        }
        if (z?.stage && (z.stage.hitArea = z.screen), O) {
          const k = _t();
          k && Number.isFinite(k.scale) && k.scale > 0 ? (O.position.set(k.x, k.y), O.scale.set(k.scale, k.scale), Ze()) : dt();
        }
        Qe();
      }), xe.observe(_.value), Mt();
    }
    async function ct() {
      try {
        await us;
      } catch (A) {
        w.value = "error", P.value = `Live2D runtime: ${A.message}`;
        return;
      }
      const f = ++ye;
      if (yt(), !l.value) {
        w.value = "disabled", u.value = "";
        return;
      }
      if (!Yt()) {
        w.value = "no-libs", P.value = s("live2d.libsMissing");
        return;
      }
      const k = a.value || b.value[0]?.url;
      if (!k) {
        w.value = "error", P.value = s("live2d.noModel");
        return;
      }
      if (w.value = "loading", P.value = "", u.value = k.split("/").pop() || k, await ss(), z || Gt(), !z) {
        w.value = "error", P.value = s("live2d.stageMissing");
        return;
      }
      try {
        const A = await window.PIXI.live2d.Live2DModel.from(k, { autoInteract: !1 });
        if (f !== ye) {
          try {
            A.destroy?.();
          } catch {
          }
          return;
        }
        O = A, Mt(), A.anchor?.set?.(0.5, 0.5), z.stage.addChild(A), Jt();
        try {
          A.internalModel?.on?.("beforeModelUpdate", X);
        } catch {
        }
        R(A), Ht(A), w.value = "ok", Qe(), Ye("Idle"), jt();
      } catch (A) {
        if (f !== ye) return;
        console.error("Live2D load failed:", A), w.value = "error", P.value = A?.message || s("live2d.loadError");
      }
    }
    function Zt() {
      if (!l.value) {
        kt(), w.value = "disabled";
        return;
      }
      ct();
    }
    Ue(async () => {
      window.addEventListener("live2d-models-changed", E), window.addEventListener("live2d-speak", Y), window.addEventListener("live2d-motion", bt), window.__0KAY_LIVE2D__ = { speak: v, stop: $, motion: Ye, expression: Ge };
      try {
        const f = await fetch("/api/settings/live2d");
        if (f.ok) {
          const { values: k } = await f.json();
          k && typeof k.enabled == "boolean" && (c.live2d.enabled = k.enabled), k && typeof k.model_url == "string" && (c.live2d.modelUrl = k.model_url);
        }
      } catch {
      }
      await E(), l.value ? ct() : w.value = "disabled";
    }), nt(() => {
      if (window.removeEventListener("live2d-models-changed", E), window.removeEventListener("live2d-speak", Y), window.removeEventListener("live2d-motion", bt), at(), $(), L) {
        try {
          URL.revokeObjectURL(L);
        } catch {
        }
        L = null;
      }
      try {
        ee?.close();
      } catch {
      }
      ee = null, ye++, kt();
    }), He(l, Zt), He(a, () => {
      l.value && ct();
    });
    const Qt = { happy: 2, sad: 4, irritated: 6, neutral: 0, drowsy: 0, exhausted: 0, sleeping: 0 };
    return He(d, (f) => {
      if (!O || ue !== "off" || !pe.length) return;
      const k = Qt[f] ?? 0;
      Ge(pe[k] || pe[0]), (f === "happy" || f === "irritated") && Math.random() < 0.5 && Ye();
    }), (f, k) => (r(), p("div", {
      class: le(["live2d-stage", { on: l.value, bare: o.value }])
    }, [
      e("div", {
        ref_key: "stageEl",
        ref: _,
        class: "stage-viewport",
        style: Tt({ "--mood": S.value }),
        title: l.value && w.value === "ok" ? t(s)("live2d.interactHint") : ""
      }, [
        e("canvas", {
          ref_key: "canvasEl",
          ref: C,
          class: "stage-canvas"
        }, null, 512),
        l.value ? w.value === "loading" ? (r(), p("div", Ss, n(t(s)("live2d.loading")), 1)) : w.value === "error" || w.value === "no-libs" ? (r(), p("div", Cs, n(P.value || t(s)("live2d.loadError")), 1)) : N("", !0) : (r(), p("div", $s, [
          e("p", null, n(t(s)("live2d.disabledHint")), 1)
        ])),
        l.value && w.value === "ok" ? (r(), p("button", {
          key: 3,
          ref_key: "resetBtnEl",
          ref: U,
          class: le(["stage-reset", { dragging: V.value }]),
          type: "button",
          style: Tt(ce.value),
          title: t(s)("live2d.resetView"),
          "aria-label": t(s)("live2d.resetView"),
          onPointerdown: Re(oe, ["stop"]),
          onPointermove: Re(F, ["stop"]),
          onPointerup: Re(j, ["stop"]),
          onPointercancel: Re(j, ["stop"]),
          onClick: Re(K, ["stop"])
        }, "⟲", 46, Ps)) : N("", !0),
        k[0] || (k[0] = e("div", { class: "stage-gradient" }, null, -1)),
        e("div", xs, n(m.value), 1)
      ], 12, ws)
    ], 2));
  }
}), Pe = (y, s) => {
  const h = y.__vccOpts || y;
  for (const [c, _] of s)
    h[c] = _;
  return h;
}, Us = /* @__PURE__ */ Pe(Es, [["__scopeId", "data-v-600df96a"]]), Ts = { class: "content-card" }, As = { class: "toggle-label" }, Is = ["checked"], Vs = { class: "field" }, Ns = { class: "model-choices" }, Rs = ["value", "checked", "onChange"], Ls = ["value", "placeholder"], Os = { class: "helper-text" }, Ds = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, zs = { class: "helper-text" }, Fs = ["disabled"], Bs = { class: "field" }, Ks = ["disabled"], Hs = {
  key: 0,
  class: "helper-text",
  role: "status"
}, js = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, Ys = ["value", "checked", "onChange"], Xs = ["onClick"], Js = /* @__PURE__ */ he({
  __name: "Live2DPanel",
  props: {
    enabled: { type: Boolean },
    modelUrl: {},
    uploaded: {},
    msg: {},
    saving: { type: Boolean }
  },
  emits: ["update:enabled", "update:modelUrl", "save", "upload", "delete"],
  setup(y, { emit: s }) {
    const h = s, { t: c } = ve(), _ = x(null);
    function C() {
      _.value?.click();
    }
    function u(P) {
      h("update:modelUrl", P), h("update:enabled", !0);
    }
    function w(P) {
      const i = P.target, o = i.files;
      !o || !o.length || (h("upload", o), i.value = "");
    }
    return (P, i) => (r(), p("div", Ts, [
      e("h2", null, n(t(c)("settings.live2d")), 1),
      fe(Us, { class: "live2d-preview" }),
      e("label", As, [
        e("input", {
          type: "checkbox",
          checked: y.enabled,
          onChange: i[0] || (i[0] = (o) => h("update:enabled", o.target.checked))
        }, null, 40, Is),
        i[3] || (i[3] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, n(t(c)("wizard.enableLive2d")), 1)
      ]),
      e("div", Vs, [
        e("label", null, n(t(c)("wizard.modelUrl")), 1),
        e("div", Ns, [
          (r(!0), p(G, null, de(t(ps), (o) => (r(), p("label", {
            key: o.id,
            class: le(["model-choice", { selected: y.modelUrl === o.url }])
          }, [
            e("input", {
              type: "radio",
              name: "live2d-model",
              value: o.url,
              checked: y.modelUrl === o.url,
              onChange: (l) => u(o.url)
            }, null, 40, Rs),
            e("span", null, n(o.label), 1),
            e("code", null, n(o.url), 1)
          ], 2))), 128))
        ]),
        e("input", {
          value: y.modelUrl,
          placeholder: t(c)("wizard.modelUrlPlaceholder"),
          class: "input",
          onInput: i[1] || (i[1] = (o) => h("update:modelUrl", o.target.value))
        }, null, 40, Ls),
        e("p", Os, [
          Ce(n(t(c)("wizard.live2dHelp")) + " ", 1),
          e("a", Ds, n(t(c)("wizard.live2dSamples")), 1)
        ])
      ]),
      e("p", zs, n(t(c)("settings.live2dHelper")), 1),
      e("button", {
        class: "btn btn-tonal",
        disabled: y.saving,
        onClick: i[2] || (i[2] = (o) => h("save"))
      }, n(y.saving ? t(c)("settings.saving") : t(c)("settings.saveLife2d")), 9, Fs),
      e("div", Bs, [
        e("label", null, n(t(c)("settings.uploadFolder")), 1),
        e("button", {
          type: "button",
          class: "upload-area",
          disabled: y.saving,
          onClick: C
        }, [
          e("span", null, n(t(c)("settings.uploadFolderHint")), 1)
        ], 8, Ks),
        e("input", {
          ref_key: "fileInput",
          ref: _,
          type: "file",
          webkitdirectory: "",
          directory: "",
          multiple: "",
          class: "file-input",
          onChange: w
        }, null, 544),
        y.msg ? (r(), p("p", Hs, n(y.msg), 1)) : N("", !0),
        y.uploaded && y.uploaded.length ? (r(), p("div", js, [
          (r(!0), p(G, null, de(y.uploaded, (o) => (r(), p("label", {
            key: o.id,
            class: le(["model-choice", { selected: y.modelUrl === o.url }])
          }, [
            e("input", {
              type: "radio",
              name: "live2d-uploaded",
              value: o.url,
              checked: y.modelUrl === o.url,
              onChange: (l) => u(o.url)
            }, null, 40, Ys),
            e("span", null, n(o.label), 1),
            e("code", null, n(o.url), 1),
            e("button", {
              type: "button",
              class: "btn btn-danger",
              onClick: Re((l) => h("delete", o), ["prevent"])
            }, n(t(c)("settings.deleteModel")), 9, Xs)
          ], 2))), 128))
        ])) : N("", !0)
      ])
    ]));
  }
}), Ws = { class: "life-settings" }, qs = { class: "ls-hero" }, Gs = { class: "ls-hero-main" }, Zs = { class: "ls-sub" }, Qs = ["disabled"], en = { class: "ls-grid" }, tn = { class: "ls-card" }, sn = { class: "ls-card-head" }, nn = { class: "ls-switch" }, ln = { class: "ls-switch-text" }, on = { class: "ls-switch" }, an = { class: "ls-switch-text" }, rn = { class: "ls-field" }, dn = ["placeholder"], cn = { class: "ls-card" }, un = { class: "ls-card-head" }, pn = { class: "ls-note" }, hn = { class: "ls-label" }, vn = { class: "ls-models" }, mn = ["onClick"], fn = {
  key: 0,
  class: "ls-empty"
}, gn = { class: "ls-label" }, bn = { class: "ls-models" }, _n = ["onClick"], yn = {
  key: 0,
  class: "ls-empty"
}, kn = { class: "ls-card" }, wn = { class: "ls-card-head" }, $n = { class: "ls-note" }, Sn = { class: "ls-switch" }, Cn = { class: "ls-switch-text" }, Pn = { class: "ls-switch" }, xn = { class: "ls-switch-text" }, Mn = { class: "ls-card" }, En = { class: "ls-switch" }, Un = { class: "ls-switch-text" }, Tn = { class: "ls-card ls-card-wide" }, An = { class: "ls-card-head" }, In = { class: "ls-row" }, Vn = { class: "ls-switch" }, Nn = { class: "ls-switch-text" }, Rn = { class: "ls-switch" }, Ln = { class: "ls-switch-text" }, On = { class: "ls-row" }, Dn = { class: "ls-field" }, zn = { class: "ls-field" }, Fn = { class: "ls-row" }, Bn = { class: "ls-field" }, Kn = { class: "ls-field" }, Hn = ["placeholder"], jn = { class: "ls-row" }, Yn = { class: "ls-field" }, Xn = { class: "ls-field" }, Jn = { class: "ls-card ls-card-wide" }, Wn = { class: "ls-card-head" }, qn = { class: "ls-row" }, Gn = { class: "ls-switch" }, Zn = { class: "ls-switch-text" }, Qn = { class: "ls-row" }, el = { class: "ls-field" }, tl = ["placeholder"], sl = { class: "ls-field" }, nl = ["title"], ll = { class: "ls-hint" }, ol = { class: "ls-card ls-card-wide" }, al = { class: "ls-card-head" }, il = { class: "ls-row" }, rl = { class: "ls-switch" }, dl = { class: "ls-switch-text" }, cl = { class: "ls-switch" }, ul = { class: "ls-switch-text" }, pl = { class: "ls-switch" }, hl = { class: "ls-switch-text" }, vl = { class: "ls-hint" }, ml = {
  key: 0,
  class: "ls-state"
}, fl = /* @__PURE__ */ he({
  __name: "LifeSettingsPanel",
  setup(y) {
    const { t: s } = ve(), h = ns({
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
    }), c = x(""), _ = x(!1), C = x(!1), u = x([]), w = x(""), P = x([]);
    async function i() {
      try {
        const [l, a] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (l.ok && (Object.assign(h, (await l.json()).values || {}), C.value = !0), a.ok) {
          const d = await a.json();
          P.value = Array.isArray(d.models) ? d.models.map((m) => ({ id: m.id, provider: m.provider || "custom", supports_thinking: m.supports_thinking })).filter((m) => m.id) : [], u.value = P.value.map((m) => m.id), w.value = s("lifeSettings.sourceFromCore");
        }
      } catch {
        c.value = s("lifeSettings.loadFailed");
      }
    }
    async function o() {
      if (!C.value) {
        c.value = s("lifeSettings.notLoaded");
        return;
      }
      _.value = !0, c.value = "";
      try {
        const l = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: h }) });
        if (!l.ok) throw new Error(String(l.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: h.screen_watch, computer_use: h.computer_use, report_agent_host: h.report_agent_host }) }), c.value = s("lifeSettings.savedNotice");
      } catch {
        c.value = s("lifeSettings.saveFailed");
      } finally {
        _.value = !1;
      }
    }
    return Ue(i), (l, a) => (r(), p("section", Ws, [
      e("header", qs, [
        e("div", Gs, [
          a[20] || (a[20] = e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS", -1)),
          e("h2", null, n(t(s)("lifeSettings.title")), 1),
          e("p", Zs, n(t(s)("lifeSettings.subtitle")), 1)
        ]),
        e("button", {
          class: "ls-save",
          disabled: _.value,
          onClick: o
        }, [
          a[21] || (a[21] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          Ce(n(_.value ? t(s)("common.saving") : t(s)("common.save")), 1)
        ], 8, Qs)
      ]),
      e("div", en, [
        e("article", tn, [
          e("div", sn, [
            a[22] || (a[22] = e("span", { class: "ls-ic tone-1" }, "◉", -1)),
            e("h3", null, n(t(s)("lifeSettings.hostPerms")), 1)
          ]),
          e("label", nn, [
            D(e("input", {
              "onUpdate:modelValue": a[0] || (a[0] = (d) => h.screen_watch = d),
              type: "checkbox"
            }, null, 512), [
              [ge, h.screen_watch]
            ]),
            a[23] || (a[23] = e("span", { class: "ls-track" }, null, -1)),
            e("span", ln, [
              e("b", null, n(t(s)("lifeSettings.screenWatch")), 1),
              e("small", null, n(t(s)("lifeSettings.screenWatchDesc")), 1)
            ])
          ]),
          e("label", on, [
            D(e("input", {
              "onUpdate:modelValue": a[1] || (a[1] = (d) => h.computer_use = d),
              type: "checkbox"
            }, null, 512), [
              [ge, h.computer_use]
            ]),
            a[24] || (a[24] = e("span", { class: "ls-track" }, null, -1)),
            e("span", an, [
              e("b", null, n(t(s)("lifeSettings.computerUse")), 1),
              e("small", null, n(t(s)("lifeSettings.computerUseDesc")), 1)
            ])
          ]),
          e("label", rn, [
            e("span", null, n(t(s)("lifeSettings.agentHost")), 1),
            D(e("input", {
              "onUpdate:modelValue": a[2] || (a[2] = (d) => h.report_agent_host = d),
              placeholder: t(s)("lifeSettings.agentHostPlaceholder")
            }, null, 8, dn), [
              [J, h.report_agent_host]
            ])
          ])
        ]),
        e("article", cn, [
          e("div", un, [
            a[25] || (a[25] = e("span", { class: "ls-ic tone-2" }, "✦", -1)),
            e("h3", null, n(t(s)("lifeSettings.thinkOutput")), 1)
          ]),
          e("p", pn, n(w.value || t(s)("lifeSettings.loadingModels")), 1),
          e("p", hn, n(t(s)("lifeSettings.thinkLabel")), 1),
          e("div", vn, [
            (r(!0), p(G, null, de(P.value, (d) => (r(), p("button", {
              key: "think-" + d.id,
              type: "button",
              class: le(["ls-model", { selected: h.think_model === d.id }]),
              onClick: (m) => h.think_model = d.id
            }, [
              e("b", null, n(d.id), 1),
              e("span", null, n(d.provider) + " · " + n(d.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, mn))), 128)),
            P.value.length ? N("", !0) : (r(), p("span", fn, n(t(s)("lifeSettings.noModels")), 1))
          ]),
          e("p", gn, n(t(s)("lifeSettings.outputLabel")), 1),
          e("div", bn, [
            (r(!0), p(G, null, de(P.value, (d) => (r(), p("button", {
              key: "output-" + d.id,
              type: "button",
              class: le(["ls-model", { selected: h.output_model === d.id }]),
              onClick: (m) => h.output_model = d.id
            }, [
              e("b", null, n(d.id), 1),
              e("span", null, n(d.provider) + " · output", 1)
            ], 10, _n))), 128)),
            P.value.length ? N("", !0) : (r(), p("span", yn, n(t(s)("lifeSettings.noModels")), 1))
          ])
        ]),
        e("article", kn, [
          e("div", wn, [
            a[26] || (a[26] = e("span", { class: "ls-ic tone-3" }, "✉", -1)),
            e("h3", null, n(t(s)("lifeSettings.mail")), 1)
          ]),
          e("p", $n, n(t(s)("lifeSettings.mailNote", { mcp: "0kay-mcp", mail: "mail" })), 1),
          e("label", Sn, [
            D(e("input", {
              "onUpdate:modelValue": a[3] || (a[3] = (d) => h.mail_auto_approve_all = d),
              type: "checkbox"
            }, null, 512), [
              [ge, h.mail_auto_approve_all]
            ]),
            a[27] || (a[27] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Cn, [
              e("b", null, n(t(s)("lifeSettings.mailAutoApprove")), 1),
              e("small", null, n(t(s)("lifeSettings.mailAutoApproveDesc")), 1)
            ])
          ]),
          e("label", Pn, [
            D(e("input", {
              "onUpdate:modelValue": a[4] || (a[4] = (d) => h.mail_require_approval = d),
              type: "checkbox"
            }, null, 512), [
              [ge, h.mail_require_approval]
            ]),
            a[28] || (a[28] = e("span", { class: "ls-track" }, null, -1)),
            e("span", xn, [
              e("b", null, n(t(s)("lifeSettings.mailRequireApproval")), 1),
              e("small", null, n(t(s)("lifeSettings.mailRequireApprovalDesc")), 1)
            ])
          ])
        ]),
        e("article", Mn, [
          a[30] || (a[30] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", En, [
            D(e("input", {
              "onUpdate:modelValue": a[5] || (a[5] = (d) => h.mcp_enabled = d),
              type: "checkbox"
            }, null, 512), [
              [ge, h.mcp_enabled]
            ]),
            a[29] || (a[29] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Un, [
              e("b", null, n(t(s)("lifeSettings.mcpEnabled")), 1),
              e("small", null, n(t(s)("lifeSettings.mcpEnabledDesc")), 1)
            ])
          ])
        ]),
        e("article", Tn, [
          e("div", An, [
            a[31] || (a[31] = e("span", { class: "ls-ic tone-5" }, "☷", -1)),
            e("h3", null, n(t(s)("lifeSettings.onebot")), 1)
          ]),
          e("div", In, [
            e("label", Vn, [
              D(e("input", {
                "onUpdate:modelValue": a[6] || (a[6] = (d) => h.onebot_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [ge, h.onebot_enabled]
              ]),
              a[32] || (a[32] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Nn, [
                e("b", null, n(t(s)("lifeSettings.onebotEnable")), 1)
              ])
            ]),
            e("label", Rn, [
              D(e("input", {
                "onUpdate:modelValue": a[7] || (a[7] = (d) => h.onebot_observe_group = d),
                type: "checkbox"
              }, null, 512), [
                [ge, h.onebot_observe_group]
              ]),
              a[33] || (a[33] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Ln, [
                e("b", null, n(t(s)("lifeSettings.onebotObserve")), 1),
                e("small", null, n(t(s)("lifeSettings.onebotObserveDesc")), 1)
              ])
            ])
          ]),
          e("div", On, [
            e("label", Dn, [
              e("span", null, n(t(s)("lifeSettings.onebotWs")), 1),
              D(e("input", {
                "onUpdate:modelValue": a[8] || (a[8] = (d) => h.onebot_ws_url = d),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [J, h.onebot_ws_url]
              ])
            ]),
            e("label", zn, [
              e("span", null, n(t(s)("lifeSettings.onebotHttp")), 1),
              D(e("input", {
                "onUpdate:modelValue": a[9] || (a[9] = (d) => h.onebot_http_url = d),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [J, h.onebot_http_url]
              ])
            ])
          ]),
          e("div", Fn, [
            e("label", Bn, [
              a[34] || (a[34] = e("span", null, "Access Token", -1)),
              D(e("input", {
                "onUpdate:modelValue": a[10] || (a[10] = (d) => h.onebot_access_token = d),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [J, h.onebot_access_token]
              ])
            ]),
            e("label", Kn, [
              e("span", null, n(t(s)("lifeSettings.onebotKeywords")), 1),
              D(e("input", {
                "onUpdate:modelValue": a[11] || (a[11] = (d) => h.onebot_trigger_keywords = d),
                placeholder: t(s)("lifeSettings.onebotKeywordsPlaceholder")
              }, null, 8, Hn), [
                [J, h.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", jn, [
            e("label", Yn, [
              e("span", null, n(t(s)("lifeSettings.proactiveDaily")), 1),
              D(e("input", {
                "onUpdate:modelValue": a[12] || (a[12] = (d) => h.proactive_daily_limit = d),
                type: "number",
                min: "0",
                placeholder: "3"
              }, null, 512), [
                [
                  J,
                  h.proactive_daily_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", Xn, [
              e("span", null, n(t(s)("lifeSettings.proactiveTarget")), 1),
              D(e("input", {
                "onUpdate:modelValue": a[13] || (a[13] = (d) => h.proactive_target_limit = d),
                type: "number",
                min: "0",
                placeholder: "1"
              }, null, 512), [
                [
                  J,
                  h.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ]),
        e("article", Jn, [
          e("div", Wn, [
            a[35] || (a[35] = e("span", { class: "ls-ic tone-2" }, "🎙", -1)),
            e("h3", null, n(t(s)("lifeSettings.wake")), 1)
          ]),
          e("div", qn, [
            e("label", Gn, [
              D(e("input", {
                "onUpdate:modelValue": a[14] || (a[14] = (d) => h.wake_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [ge, h.wake_enabled]
              ]),
              a[36] || (a[36] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Zn, [
                e("b", null, n(t(s)("lifeSettings.wakeEnable")), 1),
                e("small", null, n(t(s)("lifeSettings.wakeEnableDesc")), 1)
              ])
            ])
          ]),
          e("div", Qn, [
            e("label", el, [
              e("span", null, n(t(s)("lifeSettings.wakeNickname")), 1),
              D(e("input", {
                "onUpdate:modelValue": a[15] || (a[15] = (d) => h.wake_nickname = d),
                placeholder: t(s)("lifeSettings.wakeNicknamePlaceholder")
              }, null, 8, tl), [
                [J, h.wake_nickname]
              ])
            ]),
            e("label", sl, [
              e("span", null, n(t(s)("lifeSettings.asrLanguage")), 1),
              D(e("input", {
                "onUpdate:modelValue": a[16] || (a[16] = (d) => h.asr_language = d),
                placeholder: "zh",
                title: t(s)("lifeSettings.asrLanguageDesc")
              }, null, 8, nl), [
                [J, h.asr_language]
              ])
            ])
          ]),
          e("p", ll, n(t(s)("lifeSettings.wakeHint")), 1)
        ]),
        e("article", ol, [
          e("div", al, [
            a[37] || (a[37] = e("span", { class: "ls-ic tone-4" }, "📸", -1)),
            e("h3", null, n(t(s)("lifeSettings.media")), 1)
          ]),
          e("div", il, [
            e("label", rl, [
              D(e("input", {
                "onUpdate:modelValue": a[17] || (a[17] = (d) => h.voice_reply_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [ge, h.voice_reply_enabled]
              ]),
              a[38] || (a[38] = e("span", { class: "ls-track" }, null, -1)),
              e("span", dl, [
                e("b", null, n(t(s)("lifeSettings.mediaVoice")), 1),
                e("small", null, n(t(s)("lifeSettings.mediaVoiceDesc")), 1)
              ])
            ]),
            e("label", cl, [
              D(e("input", {
                "onUpdate:modelValue": a[18] || (a[18] = (d) => h.selfie_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [ge, h.selfie_enabled]
              ]),
              a[39] || (a[39] = e("span", { class: "ls-track" }, null, -1)),
              e("span", ul, [
                e("b", null, n(t(s)("lifeSettings.mediaSelfie")), 1),
                e("small", null, n(t(s)("lifeSettings.mediaSelfieDesc")), 1)
              ])
            ]),
            e("label", pl, [
              D(e("input", {
                "onUpdate:modelValue": a[19] || (a[19] = (d) => h.call_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [ge, h.call_enabled]
              ]),
              a[40] || (a[40] = e("span", { class: "ls-track" }, null, -1)),
              e("span", hl, [
                e("b", null, n(t(s)("lifeSettings.mediaCall")), 1),
                e("small", null, n(t(s)("lifeSettings.mediaCallDesc")), 1)
              ])
            ])
          ]),
          e("p", vl, n(t(s)("lifeSettings.mediaHint")), 1)
        ])
      ]),
      c.value ? (r(), p("p", ml, n(c.value), 1)) : N("", !0)
    ]));
  }
}), gl = /* @__PURE__ */ Pe(fl, [["__scopeId", "data-v-d91bdafc"]]), bl = "/okay-logo.svg", _l = { class: "content-card about" }, yl = { class: "identity" }, kl = { class: "app-id" }, wl = { class: "ver-badge" }, $l = { class: "app-desc" }, Sl = { class: "identity-actions" }, Cl = ["href"], Pl = { class: "section" }, xl = { class: "section-head" }, Ml = ["disabled"], El = {
  key: 0,
  class: "alert",
  role: "alert"
}, Ul = {
  class: "us-hero-icon",
  "aria-hidden": "true"
}, Tl = {
  key: 0,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Al = {
  key: 1,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Il = {
  key: 2,
  width: "26",
  height: "26",
  viewBox: "0 0 24 24",
  fill: "none"
}, Vl = { class: "us-hero-text" }, Nl = { key: 0 }, Rl = { key: 1 }, Ll = { class: "us-hero-actions" }, Ol = ["disabled"], Dl = ["disabled", "title"], zl = ["href"], Fl = {
  key: 2,
  class: "us-notes"
}, Bl = { class: "us-notes-title" }, Kl = { class: "us-notes-body" }, Hl = {
  key: 3,
  class: "alert",
  role: "alert"
}, jl = { class: "us-apply-head" }, Yl = { key: 0 }, Xl = { key: 1 }, Jl = {
  key: 0,
  class: "us-chip-tag"
}, Wl = { class: "us-apply-label" }, ql = {
  key: 0,
  class: "us-apply-error"
}, Gl = {
  key: 1,
  class: "us-apply-log"
}, Zl = { class: "section" }, Ql = { class: "section-title" }, eo = { class: "credits" }, to = ["href"], so = ["src", "alt"], no = { class: "person-info" }, lo = { class: "name" }, oo = { class: "role" }, ao = ["src"], io = { class: "person-info" }, ro = { class: "role" }, co = { class: "section-head contributors-head" }, uo = { class: "section-title" }, po = { class: "muted" }, ho = {
  key: 0,
  class: "contribs"
}, vo = ["href"], mo = ["src", "alt"], fo = { class: "login" }, go = {
  key: 0,
  class: "count"
}, bo = {
  key: 1,
  class: "muted"
}, _o = ["href"], yo = { class: "foot" }, ko = ["href"], pt = "https://github.com/RazureSOFT/0KAY", wo = "https://github.com/RazureSOFT", $o = /* @__PURE__ */ he({
  __name: "AboutPanel",
  setup(y) {
    const { t: s } = ve(), h = x("0.1.3"), c = x([]), _ = x(""), C = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, u = (M, T = 96) => `https://github.com/${M}.png?size=${T}`, w = x(!1), P = x(null), i = x(""), o = x(null), l = x("");
    let a = null;
    function d(M) {
      return o.value?.status === "running" && o.value.plugin === M;
    }
    async function m(M, T) {
      if (o.value?.status !== "running") {
        l.value = "";
        try {
          o.value = await tt("/api/plugins/pm/update", { plugin: M, version: T || "" }), b();
        } catch (q) {
          l.value = q instanceof Error ? q.message : String(q);
        }
      }
    }
    async function S() {
      try {
        o.value = await Le("/api/plugins/pm/status");
      } catch {
        return;
      }
      o.value && o.value.status !== "running" && (E(), V());
    }
    function b() {
      a || (a = setInterval(S, 2e3));
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
    }), H = Z(() => P.value ? P.value.has_update ? "warn" : P.value.latest ? "ok" : "none" : "none");
    async function V() {
      w.value = !0, i.value = "";
      try {
        const M = await Le("/api/plugins/pm/check");
        P.value = M, M?.current && (h.value = String(M.current));
      } catch (M) {
        i.value = M instanceof zt && M.status === 404 ? s("settings.about.unsupported") : M instanceof Error ? M.message : String(M);
      } finally {
        w.value = !1;
      }
    }
    async function I() {
      try {
        const M = { Accept: "application/vnd.github+json" }, [T, q] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: M }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: M })
        ]);
        if (!T.ok) throw new Error(`HTTP ${T.status}`);
        const ce = /* @__PURE__ */ new Map(), oe = await T.json();
        for (const F of Array.isArray(oe) ? oe : [])
          F?.login && ce.set(F.login, F);
        if (q.ok) {
          const F = await q.json();
          for (const j of Array.isArray(F) ? F : []) {
            const K = j?.author;
            !K?.login || K.login.endsWith("[bot]") || ce.has(K.login) || ce.set(K.login, {
              login: K.login,
              avatar_url: K.avatar_url,
              html_url: K.html_url,
              contributions: 0
            });
          }
        }
        c.value = [...ce.values()].sort(
          (F, j) => (j.contributions || 0) - (F.contributions || 0) || F.login.localeCompare(j.login)
        );
      } catch (M) {
        _.value = M instanceof Error ? M.message : String(M), c.value = [];
      }
    }
    return Ue(() => {
      V(), I(), Le("/api/plugins/pm/status").then((M) => {
        o.value = M, M?.status === "running" && b();
      }).catch(() => {
      });
    }), nt(E), (M, T) => (r(), p("div", _l, [
      e("header", yl, [
        T[3] || (T[3] = e("img", {
          class: "app-icon",
          src: bl,
          alt: "",
          "aria-hidden": "true"
        }, null, -1)),
        e("div", kl, [
          e("h2", null, [
            T[2] || (T[2] = Ce("0KAY ", -1)),
            e("span", wl, "v" + n(h.value), 1)
          ]),
          e("p", $l, n(t(s)("settings.about.description")), 1)
        ]),
        e("div", Sl, [
          e("a", {
            class: "btn btn-tonal sm",
            href: pt,
            target: "_blank",
            rel: "noopener noreferrer"
          }, n(t(s)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${pt}/releases`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "Releases ↗", 8, Cl)
        ])
      ]),
      e("section", Pl, [
        e("div", xl, [
          T[4] || (T[4] = e("h3", { class: "section-title" }, "0KAY", -1)),
          e("button", {
            class: "btn btn-tonal sm",
            disabled: w.value,
            onClick: V
          }, n(t(s)(w.value ? "settings.about.checking" : "settings.about.check")), 9, Ml)
        ]),
        i.value ? (r(), p("p", El, n(i.value), 1)) : (r(), p("div", {
          key: 1,
          class: le(["us-hero", H.value])
        }, [
          e("div", Ul, [
            H.value === "ok" ? (r(), p("svg", Tl, [...T[5] || (T[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : H.value === "warn" ? (r(), p("svg", Al, [...T[6] || (T[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (r(), p("svg", Il, [...T[7] || (T[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", Vl, [
            e("b", null, n(t(s)(H.value === "warn" ? "settings.about.available" : H.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            P.value?.latest ? (r(), p("span", Nl, [
              Ce("v" + n(P.value.current) + " → ", 1),
              e("em", null, "v" + n(P.value.latest), 1)
            ])) : (r(), p("span", Rl, "0KAY v" + n(P.value?.current || h.value), 1))
          ]),
          e("div", Ll, [
            P.value?.has_update ? (r(), p("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: d("core"),
              onClick: T[0] || (T[0] = (q) => m("core", P.value.latest))
            }, n(d("core") ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, Ol)) : N("", !0),
            P.value?.source_available !== !1 ? (r(), p("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: d("core"),
              title: t(s)("settings.about.betaHint"),
              onClick: T[1] || (T[1] = (q) => m("core"))
            }, n(d("core") ? t(s)("settings.about.updating") : t(s)("settings.about.beta")), 9, Dl)) : N("", !0),
            P.value?.url ? (r(), p("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: P.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, zl)) : N("", !0)
          ])
        ], 2)),
        P.value?.notes ? (r(), p("div", Fl, [
          e("p", Bl, n(t(s)("settings.about.whatsNew")), 1),
          e("pre", Kl, n(P.value.notes), 1)
        ])) : N("", !0),
        l.value ? (r(), p("p", Hl, n(l.value), 1)) : N("", !0),
        o.value && o.value.status !== "idle" ? (r(), p("div", {
          key: 4,
          class: le(["us-apply-banner", o.value.status])
        }, [
          e("div", jl, [
            T[8] || (T[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Ce(n(o.value.package), 1),
              o.value.version ? (r(), p("span", Yl, "@" + n(o.value.version), 1)) : (r(), p("span", Xl, " · main"))
            ]),
            o.value.mode === "source" ? (r(), p("span", Jl, n(t(s)("settings.about.sourceMode")), 1)) : N("", !0),
            e("span", Wl, n(U.value), 1)
          ]),
          o.value.error ? (r(), p("p", ql, n(o.value.error), 1)) : N("", !0),
          o.value.log ? (r(), p("pre", Gl, n(o.value.log), 1)) : N("", !0)
        ], 2)) : N("", !0)
      ]),
      e("section", Zl, [
        e("h3", Ql, n(t(s)("settings.about.developerTitle")) + " & " + n(t(s)("settings.about.teamTitle")), 1),
        e("div", eo, [
          e("a", {
            class: "person",
            href: C.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: C.avatar,
              alt: C.login,
              loading: "lazy"
            }, null, 8, so),
            e("div", no, [
              e("span", lo, n(C.login), 1),
              e("span", oo, n(t(s)("settings.about.developerTitle")), 1)
            ]),
            T[9] || (T[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, to),
          e("a", {
            class: "person",
            href: wo,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: u("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, ao),
            e("div", io, [
              T[10] || (T[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", ro, n(t(s)("settings.about.teamTitle")), 1)
            ]),
            T[11] || (T[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", co, [
          e("h3", uo, n(t(s)("settings.about.contributorsTitle")), 1),
          e("span", po, n(t(s)("settings.about.contributorsFrom")), 1)
        ]),
        c.value.length ? (r(), p("div", ho, [
          (r(!0), p(G, null, de(c.value, (q) => (r(), p("a", {
            key: q.login,
            class: "contrib",
            href: q.html_url || `https://github.com/${q.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: q.avatar_url || u(q.login, 64),
              alt: q.login,
              loading: "lazy"
            }, null, 8, mo),
            e("span", fo, n(q.login), 1),
            q.contributions ? (r(), p("span", go, n(q.contributions), 1)) : N("", !0)
          ], 8, vo))), 128))
        ])) : (r(), p("p", bo, [
          e("a", {
            class: "repo-link",
            href: C.url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "razureink ↗", 8, _o)
        ]))
      ]),
      e("footer", yo, [
        T[12] || (T[12] = e("span", { class: "status-chip" }, "MIT", -1)),
        T[13] || (T[13] = e("span", null, "© 2026 RazureSOFT", -1)),
        e("a", {
          class: "repo-link",
          href: `${pt}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, ko)
      ])
    ]));
  }
}), So = /* @__PURE__ */ Pe($o, [["__scopeId", "data-v-2678e07b"]]), Co = { class: "content-card updates" }, Po = { class: "us-block" }, xo = { class: "us-head" }, Mo = { class: "us-head-text" }, Eo = { class: "us-title" }, Uo = { class: "us-desc" }, To = { class: "us-source" }, Ao = { class: "us-input-group" }, Io = ["disabled", "placeholder"], Vo = ["disabled"], No = { class: "us-chips" }, Ro = ["disabled"], Lo = ["disabled"], Oo = {
  key: 0,
  class: "us-saved"
}, Do = { class: "helper-text" }, zo = {
  key: 0,
  class: "alert"
}, Fo = { class: "us-block" }, Bo = { class: "us-head" }, Ko = { class: "us-head-text" }, Ho = { class: "us-title" }, jo = { class: "us-desc" }, Yo = { class: "us-head-actions" }, Xo = ["disabled"], Jo = {
  key: 0,
  class: "alert",
  role: "alert"
}, Wo = { class: "us-apply-head" }, qo = { key: 0 }, Go = { key: 1 }, Zo = {
  key: 0,
  class: "us-chip-tag"
}, Qo = { class: "us-apply-label" }, ea = {
  key: 0,
  class: "us-apply-error"
}, ta = {
  key: 1,
  class: "us-apply-log"
}, sa = {
  key: 2,
  class: "alert",
  role: "alert"
}, na = {
  key: 3,
  class: "us-table"
}, la = { class: "us-row us-thead" }, oa = { class: "us-name" }, aa = { class: "us-name-text" }, ia = { class: "us-ver" }, ra = { class: "us-status-text" }, da = { class: "us-actions" }, ca = ["disabled", "onClick"], ua = ["disabled", "onClick"], pa = ["href", "title"], ha = {
  key: 0,
  class: "us-empty"
}, va = /* @__PURE__ */ he({
  __name: "UpdatesPanel",
  setup(y) {
    const { t: s } = ve(), h = x(!1), c = x(null), _ = x(""), C = x(null), u = x("");
    let w = null;
    const P = x(""), i = x(""), o = x(!1), l = x(!1), a = x(!1), d = x(""), m = Z(() => P.value.trim() !== i.value), S = Z(() => P.value.trim() !== "");
    function b(F) {
      return C.value?.status === "running" && C.value.plugin === F;
    }
    async function E(F, j) {
      if (C.value?.status !== "running") {
        u.value = "";
        try {
          C.value = await tt("/api/plugins/pm/update", { plugin: F, version: j || "" }), H();
        } catch (K) {
          u.value = K instanceof Error ? K.message : String(K);
        }
      }
    }
    async function U() {
      try {
        C.value = await Le("/api/plugins/pm/status");
      } catch {
        return;
      }
      C.value && C.value.status !== "running" && (V(), T());
    }
    function H() {
      w || (w = setInterval(U, 2e3));
    }
    function V() {
      w && (clearInterval(w), w = null);
    }
    const I = Z(() => {
      switch (C.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), M = Z(() => (c.value || []).filter((F) => F.has_update).length);
    async function T() {
      h.value = !0, _.value = "";
      try {
        const F = await Le("/api/plugins/pm/check-plugins");
        c.value = F?.plugins || [];
      } catch (F) {
        _.value = F instanceof zt && F.status === 404 ? s("settings.about.unsupported") : F instanceof Error ? F.message : String(F);
      } finally {
        h.value = !1;
      }
    }
    async function q() {
      o.value = !0, d.value = "";
      try {
        const F = await Le("/api/settings/updates"), j = String(F?.values?.github_proxy ?? "");
        P.value = j, i.value = j;
      } catch {
      } finally {
        o.value = !1;
      }
    }
    async function ce() {
      l.value = !0, d.value = "";
      try {
        const F = P.value.trim();
        await tt("/api/settings/updates", { values: { github_proxy: F } }), i.value = F, a.value = !0, setTimeout(() => {
          a.value = !1;
        }, 1500);
      } catch (F) {
        d.value = F instanceof Error ? F.message : String(F);
      } finally {
        l.value = !1;
      }
    }
    function oe(F) {
      P.value = F, ce();
    }
    return Ue(() => {
      T(), q(), Le("/api/plugins/pm/status").then((F) => {
        C.value = F, F?.status === "running" && H();
      }).catch(() => {
      });
    }), nt(V), (F, j) => (r(), p("div", Co, [
      e("section", Po, [
        e("header", xo, [
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
          e("div", Mo, [
            e("h3", Eo, n(t(s)("settings.pluginSourceTitle")), 1),
            e("p", Uo, n(t(s)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: le(["us-tag", { on: S.value }])
          }, n(S.value ? "ghproxy" : t(s)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", To, [
          e("div", Ao, [
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
            D(e("input", {
              "onUpdate:modelValue": j[0] || (j[0] = (K) => P.value = K),
              class: "us-input",
              type: "text",
              disabled: o.value,
              placeholder: t(s)("settings.pluginSourcePlaceholder"),
              onKeyup: mt(ce, ["enter"])
            }, null, 40, Io), [
              [J, P.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: l.value || !m.value,
              onClick: ce
            }, n(t(s)("settings.save")), 9, Vo)
          ]),
          e("div", No, [
            e("button", {
              type: "button",
              class: le(["us-chip", { active: !S.value }]),
              disabled: l.value,
              onClick: j[1] || (j[1] = (K) => oe(""))
            }, n(t(s)("settings.pluginSourceDirect")), 11, Ro),
            e("button", {
              type: "button",
              class: le(["us-chip", { active: P.value.trim() === "https://gh-proxy.com" }]),
              disabled: l.value,
              onClick: j[2] || (j[2] = (K) => oe("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, Lo),
            a.value ? (r(), p("span", Oo, n(t(s)("settings.saved")), 1)) : N("", !0)
          ]),
          e("p", Do, n(t(s)("settings.pluginSourceHelp")), 1),
          d.value ? (r(), p("p", zo, n(d.value), 1)) : N("", !0)
        ])
      ]),
      j[10] || (j[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", Fo, [
        e("header", Bo, [
          j[5] || (j[5] = ls('<span class="us-ico" aria-hidden="true" data-v-bc3fb39c><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-bc3fb39c><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect></svg></span>', 1)),
          e("div", Ko, [
            e("h3", Ho, n(t(s)("settings.about.plugins")), 1),
            e("p", jo, n(t(s)("settings.about.updateHint")), 1)
          ]),
          e("div", Yo, [
            e("span", {
              class: le(["us-count", { warn: M.value > 0 }])
            }, n(M.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: h.value,
              onClick: T
            }, n(t(s)(h.value ? "settings.about.checking" : "settings.about.check")), 9, Xo)
          ])
        ]),
        u.value ? (r(), p("p", Jo, n(u.value), 1)) : N("", !0),
        C.value && C.value.status !== "idle" ? (r(), p("div", {
          key: 1,
          class: le(["us-apply-banner", C.value.status])
        }, [
          e("div", Wo, [
            j[6] || (j[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Ce(n(C.value.package), 1),
              C.value.version ? (r(), p("span", qo, "@" + n(C.value.version), 1)) : (r(), p("span", Go, " · main"))
            ]),
            C.value.mode === "source" ? (r(), p("span", Zo, n(t(s)("settings.about.sourceMode")), 1)) : N("", !0),
            e("span", Qo, n(I.value), 1)
          ]),
          C.value.error ? (r(), p("p", ea, n(C.value.error), 1)) : N("", !0),
          C.value.log ? (r(), p("pre", ta, n(C.value.log), 1)) : N("", !0)
        ], 2)) : N("", !0),
        _.value ? (r(), p("p", sa, n(_.value), 1)) : N("", !0),
        c.value ? (r(), p("div", na, [
          e("div", la, [
            e("span", null, n(t(s)("plugins.updatesColPlugin")), 1),
            e("span", null, n(t(s)("plugins.updatesColVersion")), 1),
            e("span", null, n(t(s)("plugins.updatesColStatus")), 1),
            j[7] || (j[7] = e("span", null, null, -1))
          ]),
          (r(!0), p(G, null, de(c.value, (K) => (r(), p("div", {
            key: K.name,
            class: "us-row"
          }, [
            e("span", oa, [
              e("span", {
                class: le(["us-dot", K.error ? "bad" : K.has_update ? "warn" : K.latest ? "ok" : ""])
              }, null, 2),
              e("span", aa, n(K.name), 1)
            ]),
            e("span", ia, [
              e("em", null, "v" + n(K.version || "—"), 1),
              j[8] || (j[8] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: le({ good: !!K.latest })
              }, n(K.latest ? `v${K.latest}` : "—"), 3)
            ]),
            e("span", {
              class: le(["us-status", K.error ? "bad" : K.has_update ? "warn" : K.latest ? "ok" : ""])
            }, [
              e("span", ra, n(K.error || t(s)(K.has_update ? "settings.about.available" : K.latest ? "settings.about.latest" : "settings.about.noRelease")), 1)
            ], 2),
            e("span", da, [
              K.can_update && K.has_update ? (r(), p("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: b(K.name),
                onClick: (z) => E(K.name, K.latest)
              }, n(b(K.name) ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, ca)) : K.can_update ? (r(), p("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: b(K.name),
                onClick: (z) => E(K.name)
              }, n(b(K.name) ? t(s)("settings.about.updating") : t(s)("settings.about.syncNow")), 9, ua)) : N("", !0),
              K.repository ? (r(), p("a", {
                key: 2,
                class: "us-repo",
                href: K.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: K.repository
              }, n(t(s)("plugins.updatesColRepo")) + " ↗", 9, pa)) : N("", !0)
            ])
          ]))), 128)),
          c.value.length ? N("", !0) : (r(), p("p", ha, n(t(s)("settings.about.noPlugins")), 1))
        ])) : N("", !0),
        j[9] || (j[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), ma = /* @__PURE__ */ Pe(va, [["__scopeId", "data-v-bc3fb39c"]]), fa = { class: "content-card provider-panel" }, ga = { class: "pp-editor-head" }, ba = ["aria-label"], _a = { class: "pp-editor-title" }, ya = { class: "card-desc" }, ka = { class: "pp-section" }, wa = { class: "pp-section-title" }, $a = { class: "pp-grid" }, Sa = { class: "field" }, Ca = { class: "helper-text" }, Pa = { class: "field" }, xa = { class: "field" }, Ma = {
  key: 0,
  class: "pp-req"
}, Ea = ["placeholder"], Ua = { class: "field pp-span" }, Ta = ["placeholder"], Aa = { class: "field" }, Ia = { class: "helper-text" }, Va = { class: "field" }, Na = { class: "helper-text" }, Ra = { class: "pp-section" }, La = { class: "pp-section-head" }, Oa = { class: "pp-section-title" }, Da = ["disabled"], za = { class: "field" }, Fa = { class: "pp-key" }, Ba = ["type", "placeholder"], Ka = {
  key: 0,
  class: "helper-text"
}, Ha = {
  key: 1,
  class: "pp-probe err"
}, ja = {
  key: 2,
  class: "pp-probe ok"
}, Ya = { class: "pp-section" }, Xa = { class: "pp-section-head" }, Ja = { class: "pp-section-title" }, Wa = { class: "pp-count" }, qa = ["disabled"], Ga = {
  key: 0,
  class: "pp-discovered"
}, Za = { class: "pp-model-tools" }, Qa = ["placeholder"], ei = { class: "pp-add-model" }, ti = ["placeholder", "aria-label", "onKeydown"], si = ["disabled"], ni = {
  key: 1,
  class: "helper-text pp-add-error"
}, li = {
  key: 2,
  class: "pp-models"
}, oi = ["title"], ai = ["value", "title", "onChange"], ii = ["value"], ri = ["title", "disabled", "onClick"], di = ["title"], ci = ["checked", "onChange"], ui = ["title", "aria-label", "onClick"], pi = {
  key: 0,
  class: "helper-text"
}, hi = {
  key: 3,
  class: "helper-text"
}, vi = {
  key: 0,
  class: "pp-error",
  role: "alert"
}, mi = { class: "pp-editor-actions" }, fi = ["disabled"], gi = { class: "pp-list-head" }, bi = { class: "card-desc" }, _i = { class: "pp-list-actions" }, yi = {
  class: "pp-kinds",
  role: "tablist"
}, ki = ["aria-selected", "onClick"], wi = { class: "pp-kind-count" }, $i = {
  key: 0,
  class: "pp-cards"
}, Si = { class: "pp-card-head" }, Ci = { class: "pp-logo" }, Pi = ["src", "alt"], xi = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, Mi = { class: "pp-card-id" }, Ei = ["title"], Ui = { class: "pp-card-badges" }, Ti = {
  key: 0,
  class: "pp-badge primary"
}, Ai = { class: "pp-badge" }, Ii = { class: "pp-card-status" }, Vi = {
  key: 0,
  class: "pp-meta"
}, Ni = ["title"], Ri = { class: "pp-chips" }, Li = {
  key: 0,
  class: "pp-chip more"
}, Oi = {
  key: 1,
  class: "pp-chip empty"
}, Di = { class: "pp-card-actions" }, zi = ["onClick"], Fi = ["disabled", "onClick"], Bi = ["disabled", "onClick"], Ki = ["onClick"], Hi = ["onClick"], ji = {
  key: 1,
  class: "pp-empty"
}, Yi = /* @__PURE__ */ he({
  __name: "ProviderPanel",
  setup(y) {
    const { t: s } = ve(), { confirm: h } = We(), c = hs(), _ = x({}), C = x("list"), u = x(null), w = x(""), P = x({ state: "idle" }), i = x([]), o = x(""), l = x(!1), a = x(!1), d = x(!1), m = x("llm"), S = Z(() => [
      { value: "llm", label: s("settings.providerKindLLM") },
      { value: "tts", label: s("settings.providerKindTTS") },
      { value: "asr", label: s("settings.providerKindASR") },
      { value: "image", label: s("settings.providerKindImage") }
    ]);
    function b(v) {
      return (v.kind || "llm").toLowerCase();
    }
    const E = Z(() => c.providers.filter((v) => b(v) === m.value));
    function U(v) {
      return c.providers.filter((g) => b(g) === v).length;
    }
    function H() {
      for (const v of E.value) z(v);
    }
    Ue(async () => {
      await c.fetchAll();
      for (const v of c.providers) z(v);
    });
    function V(v) {
      return ut.find((g) => g.id === v) || null;
    }
    function I(v) {
      return v.name && v.name.trim() ? v.name.trim() : V(v.provider)?.name || v.provider;
    }
    function M(v) {
      return V(v.provider)?.logo || "";
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
    function q(v) {
      return (u.value?.model_types || {})[v] || "chat";
    }
    function ce(v, g) {
      if (!u.value) return;
      const $ = { ...u.value.model_types || {} };
      !g || g === "chat" ? delete $[v] : $[v] = g, u.value.model_types = $;
    }
    function oe(v) {
      const g = new Set(v.disabled_models || []);
      return v.models.filter(($) => !g.has($));
    }
    function F(v) {
      return c.defaultProviderId === v.id;
    }
    function j(v) {
      const g = u.value;
      if (!g) return;
      const $ = ut.find((Y) => Y.id === v);
      $?.baseUrl && !g.base_url && (g.base_url = $.baseUrl), g.format = $?.format || "";
    }
    async function K(v, g = "") {
      if (!v.base_url) return { state: "error", message: s("settings.baseUrlRequired") };
      const $ = performance.now();
      try {
        const Y = await fetch("/api/models/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: v.id,
            provider: v.provider,
            base_url: v.base_url,
            format: v.format || "",
            api_key: g || ""
          })
        });
        if (!Y.ok) throw new Error(`HTTP ${Y.status}`);
        const W = await Y.json(), pe = Math.round(performance.now() - $);
        return W.source === "api" && Array.isArray(W.models) && W.models.length ? { state: "ok", count: W.models.length, ms: pe, models: W.models } : { state: "error", message: W.error || s("settings.connectionFailed"), ms: pe };
      } catch (Y) {
        return { state: "error", message: Y instanceof Error ? Y.message : String(Y) };
      }
    }
    async function z(v, g = "") {
      _.value = { ..._.value, [v.id]: { state: "checking" } };
      const $ = await K(v, g);
      _.value = { ..._.value, [v.id]: $ };
    }
    function O() {
      u.value = {
        id: "",
        provider: "custom",
        kind: m.value,
        name: "",
        api_key: "",
        base_url: "",
        models: [],
        disabled_models: [],
        default_model: "",
        enabled: !0,
        format: "",
        model_types: {}
      }, w.value = "", P.value = { state: "idle" }, i.value = [], o.value = "", l.value = !1, a.value = !1, C.value = "edit";
    }
    function xe(v) {
      u.value = {
        ...v,
        api_key: "",
        name: v.name || "",
        models: [...v.models],
        disabled_models: [...v.disabled_models || []],
        format: v.format || "",
        model_types: { ...v.model_types || {} }
      }, a.value = !!v.api_key_masked, w.value = "", P.value = { state: "idle" }, i.value = [], o.value = "", l.value = !1, C.value = "edit";
    }
    function ye() {
      C.value = "list", u.value = null, w.value = "";
    }
    async function se() {
      const v = u.value;
      if (!v) return;
      w.value = "";
      const g = (v.name || "").trim();
      if (!v.base_url.trim()) {
        w.value = s("settings.baseUrlRequired");
        return;
      }
      if (v.provider === "custom" && !g) {
        w.value = s("settings.providerNameRequired");
        return;
      }
      if (!v.models.length) {
        w.value = s("settings.modelsRequired");
        return;
      }
      v.id || (v.id = `${v.provider}_${Date.now().toString(36)}`), v.name = g, v.disabled_models = (v.disabled_models || []).filter(($) => v.models.includes($)), (!v.default_model || !v.models.includes(v.default_model) || v.disabled_models.includes(v.default_model)) && (v.default_model = oe(v)[0] || v.models[0]), d.value = !0;
      try {
        await c.upsert({ ...v }), c.defaultProviderId || await c.setDefaults(v.id, v.default_model), ye(), z(c.providers.find(($) => $.id === v.id) || v);
      } catch ($) {
        w.value = $ instanceof Error ? $.message : String($);
      } finally {
        d.value = !1;
      }
    }
    async function Te(v) {
      if (await h({
        title: s("settings.remove"),
        message: `${s("settings.remove")} ${I(v)}?`,
        confirmLabel: s("settings.remove"),
        danger: !0
      }))
        try {
          await c.remove(v.id);
        } catch {
        }
    }
    async function Me(v) {
      try {
        await c.upsert({ ...v, enabled: !v.enabled });
      } catch {
      }
    }
    async function ae(v) {
      const g = v.default_model || oe(v)[0] || v.models[0] || "";
      try {
        await c.setDefaults(v.id, g);
      } catch {
      }
    }
    async function Ie() {
      const v = u.value;
      if (!v) return;
      P.value = { state: "checking" };
      const g = await K(v, v.api_key);
      P.value = g, g.state === "ok" && g.models && (i.value = g.models);
    }
    function te() {
      const v = u.value;
      !v || !i.value.length || (v.models = [...i.value], v.disabled_models = (v.disabled_models || []).filter((g) => v.models.includes(g)), v.models.includes(v.default_model) || (v.default_model = ""));
    }
    function L(v) {
      const g = u.value;
      if (!g) return;
      const $ = new Set(g.disabled_models || []);
      $.has(v) ? $.delete(v) : $.add(v), g.disabled_models = [...$], $.has(g.default_model) && (g.default_model = oe(g)[0] || "");
    }
    function ee(v) {
      const g = u.value;
      g && (g.default_model = v, g.disabled_models = (g.disabled_models || []).filter(($) => $ !== v));
    }
    const be = x(""), ke = x("");
    function ue() {
      const v = u.value;
      if (!v) return;
      const g = be.value.trim();
      if (ke.value = "", !!g) {
        if (v.models.includes(g)) {
          ke.value = s("settings.modelExists", { name: g });
          return;
        }
        v.models = [...v.models, g], v.disabled_models = (v.disabled_models || []).filter(($) => $ !== g), v.default_model || (v.default_model = g), be.value = "";
      }
    }
    function _e(v) {
      const g = u.value;
      if (g) {
        if (g.models = g.models.filter(($) => $ !== v), g.disabled_models = (g.disabled_models || []).filter(($) => $ !== v), g.model_types) {
          const $ = { ...g.model_types };
          delete $[v], g.model_types = $;
        }
        g.default_model === v && (g.default_model = oe(g)[0] || g.models[0] || "");
      }
    }
    function Ee(v) {
      const g = u.value;
      g && (g.disabled_models = v ? [] : [...g.models]);
    }
    function Be() {
      const v = u.value;
      if (!v) return;
      const g = new Set(v.disabled_models || []);
      v.disabled_models = v.models.filter(($) => !g.has($));
    }
    const Ve = Z(() => {
      const v = u.value?.models || [], g = o.value.trim().toLowerCase();
      return g ? v.filter(($) => $.toLowerCase().includes(g)) : v;
    }), Ke = Z(() => u.value ? oe(u.value).length : 0);
    function $e() {
      return s("settings.fetchedSummary", { n: i.value.length });
    }
    const R = Z(() => [
      { value: "", label: s("settings.formatAuto") },
      { value: "openai", label: s("settings.formatOpenai") },
      { value: "anthropic", label: s("settings.formatAnthropic") }
    ]), X = Z(
      () => ut.map((v) => ({ value: v.id, label: s(`providers.${v.id}.name`, v.name) }))
    );
    return (v, g) => (r(), p("div", fa, [
      C.value === "edit" && u.value ? (r(), p(G, { key: 0 }, [
        e("div", ga, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: ye,
            "aria-label": t(s)("settings.back")
          }, [...g[13] || (g[13] = [
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
          ])], 8, ba),
          e("div", _a, [
            e("h2", null, n(u.value.id ? t(s)("settings.edit") : t(s)("settings.addProvider")), 1),
            e("p", ya, n(t(s)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: le(["pp-status", P.value.state])
          }, [
            g[14] || (g[14] = e("span", { class: "pp-dot" }, null, -1)),
            Ce(" " + n(P.value.state === "checking" ? t(s)("settings.testing") : P.value.state === "ok" ? t(s)("settings.connectionOk") : P.value.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", ka, [
          e("h3", wa, n(t(s)("settings.providerSectionBasic")), 1),
          e("div", $a, [
            e("div", Sa, [
              e("label", null, n(t(s)("settings.providerKindLabel")), 1),
              fe(t(ze), {
                modelValue: u.value.kind,
                "onUpdate:modelValue": g[0] || (g[0] = ($) => u.value.kind = $),
                class: "input",
                "aria-label": t(s)("settings.providerKindLabel"),
                options: S.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Ca, n(t(s)("settings.providerKindHint")), 1)
            ]),
            e("div", Pa, [
              e("label", null, n(t(s)("wizard.provider")), 1),
              fe(t(ze), {
                modelValue: u.value.provider,
                "onUpdate:modelValue": g[1] || (g[1] = ($) => u.value.provider = $),
                class: "input",
                "aria-label": t(s)("wizard.provider"),
                options: X.value,
                onChange: j
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", xa, [
              e("label", null, [
                Ce(n(t(s)("settings.providerName")) + " ", 1),
                u.value.provider === "custom" ? (r(), p("span", Ma, "*")) : N("", !0)
              ]),
              D(e("input", {
                "onUpdate:modelValue": g[2] || (g[2] = ($) => u.value.name = $),
                placeholder: t(s)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, Ea), [
                [J, u.value.name]
              ])
            ]),
            e("div", Ua, [
              e("label", null, n(t(s)("wizard.baseUrl")), 1),
              D(e("input", {
                "onUpdate:modelValue": g[3] || (g[3] = ($) => u.value.base_url = $),
                placeholder: t(s)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, Ta), [
                [J, u.value.base_url]
              ])
            ]),
            e("div", Aa, [
              e("label", null, n(t(s)("settings.apiFormat")), 1),
              fe(t(ze), {
                modelValue: u.value.format,
                "onUpdate:modelValue": g[4] || (g[4] = ($) => u.value.format = $),
                class: "input",
                "aria-label": t(s)("settings.apiFormat"),
                options: R.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Ia, n(t(s)("settings.apiFormatHint")), 1)
            ]),
            e("div", Va, [
              e("label", null, n(t(s)("wizard.defaultModel")), 1),
              fe(t(ze), {
                modelValue: u.value.default_model,
                "onUpdate:modelValue": g[5] || (g[5] = ($) => u.value.default_model = $),
                class: "input",
                "aria-label": t(s)("wizard.defaultModel"),
                options: oe(u.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Na, n(t(s)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", Ra, [
          e("div", La, [
            e("h3", Oa, n(t(s)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: P.value.state === "checking",
              onClick: Ie
            }, n(P.value.state === "checking" ? t(s)("settings.testing") : t(s)("settings.testConnection")), 9, Da)
          ]),
          e("div", za, [
            e("label", null, n(t(s)("wizard.apiKey")), 1),
            e("div", Fa, [
              D(e("input", {
                "onUpdate:modelValue": g[6] || (g[6] = ($) => u.value.api_key = $),
                type: l.value ? "text" : "password",
                placeholder: a.value ? t(s)("settings.apiKeyKept") : t(s)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, Ba), [
                [os, u.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: g[7] || (g[7] = ($) => l.value = !l.value)
              }, n(l.value ? t(s)("settings.hideKey") : t(s)("settings.showKey")), 1)
            ]),
            a.value ? (r(), p("p", Ka, n(t(s)("settings.apiKeyKeptHint")), 1)) : N("", !0),
            P.value.state === "error" ? (r(), p("p", Ha, n(P.value.message), 1)) : P.value.state === "ok" ? (r(), p("p", ja, n(t(s)("settings.connectionOk")) + " · " + n($e()) + " · " + n(P.value.ms) + "ms ", 1)) : N("", !0)
          ])
        ]),
        e("section", Ya, [
          e("div", Xa, [
            e("h3", Ja, [
              Ce(n(t(s)("settings.providerSectionModels")) + " ", 1),
              e("span", Wa, n(Ke.value) + "/" + n(u.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: P.value.state === "checking",
              onClick: Ie
            }, n(t(s)("settings.fetchModels")), 9, qa)
          ]),
          i.value.length && i.value.join("\0") !== u.value.models.join("\0") ? (r(), p("div", Ga, [
            e("span", null, n($e()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: te
            }, n(t(s)("settings.applyFetched")), 1)
          ])) : N("", !0),
          e("div", Za, [
            D(e("input", {
              "onUpdate:modelValue": g[8] || (g[8] = ($) => o.value = $),
              class: "input pp-search",
              placeholder: t(s)("settings.searchModels")
            }, null, 8, Qa), [
              [J, o.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: g[9] || (g[9] = ($) => Ee(!0))
            }, n(t(s)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: g[10] || (g[10] = ($) => Be())
            }, n(t(s)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: g[11] || (g[11] = ($) => Ee(!1))
            }, n(t(s)("settings.clearSelection")), 1)
          ]),
          e("div", ei, [
            D(e("input", {
              "onUpdate:modelValue": g[12] || (g[12] = ($) => be.value = $),
              class: "input",
              placeholder: t(s)("settings.addModelPlaceholder"),
              "aria-label": t(s)("settings.addModelPlaceholder"),
              onKeydown: mt(Re(ue, ["prevent"]), ["enter"])
            }, null, 40, ti), [
              [J, be.value]
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: !be.value.trim(),
              onClick: ue
            }, n(t(s)("settings.addModel")), 9, si)
          ]),
          ke.value ? (r(), p("p", ni, n(ke.value), 1)) : N("", !0),
          u.value.models.length ? (r(), p("div", li, [
            (r(!0), p(G, null, de(Ve.value, ($) => (r(), p("div", {
              key: $,
              class: le(["pp-model", { off: (u.value.disabled_models || []).includes($) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: $
              }, n($), 9, oi),
              e("select", {
                class: le(["pp-type", { tagged: q($) !== "chat" }]),
                value: q($),
                title: t(s)("settings.providerModelType"),
                onChange: (Y) => ce($, Y.target.value)
              }, [
                (r(!0), p(G, null, de(T.value, (Y) => (r(), p("option", {
                  key: Y.value,
                  value: Y.value
                }, n(Y.label), 9, ii))), 128))
              ], 42, ai),
              u.value.default_model !== $ ? (r(), p("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: t(s)("settings.makeDefault"),
                disabled: (u.value.disabled_models || []).includes($),
                onClick: (Y) => ee($)
              }, "☆", 8, ri)) : (r(), p("span", {
                key: 1,
                class: "pp-star on",
                title: t(s)("wizard.defaultModel")
              }, "★", 8, di)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(u.value.disabled_models || []).includes($),
                onChange: (Y) => L($)
              }, null, 40, ci),
              e("button", {
                class: "pp-remove",
                type: "button",
                title: t(s)("settings.removeModel", { name: $ }),
                "aria-label": t(s)("settings.removeModel", { name: $ }),
                onClick: (Y) => _e($)
              }, "×", 8, ui)
            ], 2))), 128)),
            Ve.value.length ? N("", !0) : (r(), p("p", pi, n(t(s)("settings.searchModels")), 1))
          ])) : (r(), p("p", hi, n(t(s)("settings.noModelsYet")), 1))
        ]),
        w.value ? (r(), p("p", vi, n(w.value), 1)) : N("", !0),
        e("div", mi, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: d.value,
            onClick: se
          }, n(d.value ? t(s)("settings.saving") : t(s)("settings.save")), 9, fi),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: ye
          }, n(t(s)("settings.cancel")), 1)
        ])
      ], 64)) : (r(), p(G, { key: 1 }, [
        e("div", gi, [
          e("div", null, [
            e("h2", null, n(t(s)("settings.tabs.provider")), 1),
            e("p", bi, n(t(s)("settings.providerDesc")), 1)
          ]),
          e("div", _i, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: H
            }, n(t(s)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: O
            }, "+ " + n(t(s)("settings.addProvider")), 1)
          ])
        ]),
        e("nav", yi, [
          (r(!0), p(G, null, de(S.value, ($) => (r(), p("button", {
            key: $.value,
            type: "button",
            role: "tab",
            class: le(["pp-kind", { active: m.value === $.value }]),
            "aria-selected": m.value === $.value,
            onClick: (Y) => m.value = $.value
          }, [
            Ce(n($.label) + " ", 1),
            e("span", wi, n(U($.value)), 1)
          ], 10, ki))), 128))
        ]),
        E.value.length ? (r(), p("div", $i, [
          (r(!0), p(G, null, de(E.value, ($) => (r(), p("article", {
            key: $.id,
            class: le(["pp-card", { off: !$.enabled, default: F($) }])
          }, [
            e("header", Si, [
              e("span", Ci, [
                M($) ? (r(), p("img", {
                  key: 0,
                  src: M($),
                  alt: I($)
                }, null, 8, Pi)) : (r(), p("svg", xi, [...g[15] || (g[15] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", Mi, [
                e("strong", null, n(I($)), 1),
                e("code", {
                  title: $.base_url
                }, n($.base_url || "—"), 9, Ei)
              ]),
              e("div", Ui, [
                F($) ? (r(), p("span", Ti, n(t(s)("settings.default")), 1)) : N("", !0),
                e("span", Ai, n(oe($).length) + "/" + n($.models.length), 1)
              ])
            ]),
            e("div", Ii, [
              e("span", {
                class: le(["pp-status", _.value[$.id]?.state || "idle"])
              }, [
                g[16] || (g[16] = e("span", { class: "pp-dot" }, null, -1)),
                Ce(" " + n(_.value[$.id]?.state === "checking" ? t(s)("settings.testing") : _.value[$.id]?.state === "ok" ? t(s)("settings.connectionOk") : _.value[$.id]?.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
              ], 2),
              _.value[$.id]?.state === "ok" ? (r(), p("span", Vi, n(t(s)("settings.fetchedSummary", { n: _.value[$.id]?.count || 0 })) + " · " + n(_.value[$.id]?.ms) + "ms", 1)) : _.value[$.id]?.state === "error" ? (r(), p("span", {
                key: 1,
                class: "pp-meta err",
                title: _.value[$.id]?.message
              }, n(_.value[$.id]?.message), 9, Ni)) : N("", !0)
            ]),
            e("div", Ri, [
              (r(!0), p(G, null, de(oe($).slice(0, 6), (Y) => (r(), p("span", {
                key: Y,
                class: "pp-chip"
              }, n(Y), 1))), 128)),
              oe($).length > 6 ? (r(), p("span", Li, "+" + n(oe($).length - 6), 1)) : N("", !0),
              $.models.length ? N("", !0) : (r(), p("span", Oi, n(t(s)("settings.noModelsYet")), 1))
            ]),
            e("footer", Di, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (Y) => xe($)
              }, n(t(s)("settings.edit")), 9, zi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: _.value[$.id]?.state === "checking",
                onClick: (Y) => z($)
              }, n(t(s)("settings.testConnection")), 9, Fi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: F($),
                onClick: (Y) => ae($)
              }, n(t(s)("settings.makeDefault")), 9, Bi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (Y) => Me($)
              }, n($.enabled ? t(s)("settings.disableProvider") : t(s)("settings.enableProvider")), 9, Ki),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (Y) => Te($)
              }, n(t(s)("settings.remove")), 9, Hi)
            ])
          ], 2))), 128))
        ])) : (r(), p("div", ji, [
          e("p", null, n(t(s)("settings.noProvidersForKind")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: O
          }, "+ " + n(t(s)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), Xi = /* @__PURE__ */ Pe(Yi, [["__scopeId", "data-v-d10cd596"]]), Ji = { class: "pairing-panel" }, Wi = {
  key: 0,
  class: "pairing-error",
  role: "alert"
}, qi = { key: 1 }, Gi = { key: 0 }, Zi = ["onClick"], Qi = ["onClick"], er = ["disabled", "onClick"], tr = /* @__PURE__ */ he({
  __name: "PairingPanel",
  setup(y) {
    const { t: s } = ve(), { confirm: h } = We(), c = x([]), _ = x([]), C = x(""), u = x("");
    let w;
    async function P() {
      try {
        const l = await fetch("/api/pairing/pending");
        if (!l.ok) throw new Error(await l.text());
        c.value = (await l.json()).requests || [];
      } catch (l) {
        C.value = l.message;
      }
      try {
        const l = await fetch("/api/pairing/devices");
        l.ok && (_.value = (await l.json()).devices || []);
      } catch {
      }
    }
    async function i(l, a) {
      try {
        const d = await fetch("/api/pairing/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...l, allow: a })
        });
        if (!d.ok) throw new Error(await d.text());
        await P();
      } catch (d) {
        C.value = d.message;
      }
    }
    async function o(l) {
      if (!(u.value || !await h({
        title: s("pairing.disconnect"),
        message: s("pairing.disconnectConfirm", { name: l.name || l.id }),
        confirmLabel: s("pairing.disconnect"),
        danger: !0
      }))) {
        u.value = l.id;
        try {
          const d = await fetch("/api/pairing/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: l.id })
          });
          if (!d.ok) throw new Error(await d.text());
          await P();
        } catch (d) {
          C.value = d.message;
        } finally {
          u.value = "";
        }
      }
    }
    return Ue(() => {
      P(), w = setInterval(P, 3e3);
    }), nt(() => clearInterval(w)), (l, a) => (r(), p("section", Ji, [
      e("h3", null, n(t(s)("pairing.title")), 1),
      e("p", null, n(t(s)("pairing.hint")), 1),
      C.value ? (r(), p("p", Wi, n(C.value), 1)) : N("", !0),
      c.value.length ? N("", !0) : (r(), p("p", qi, n(t(s)("pairing.empty")), 1)),
      fe(At, {
        tag: "div",
        name: "pair",
        class: "pairing-list"
      }, {
        default: et(() => [
          (r(!0), p(G, null, de(c.value, (d) => (r(), p("article", {
            key: d.id
          }, [
            e("strong", null, n(d.name), 1),
            e("code", null, n(d.code), 1),
            d.approved ? (r(), p("span", Gi, n(t(s)("pairing.approved")), 1)) : (r(), p(G, { key: 1 }, [
              e("button", {
                type: "button",
                class: "btn btn-ghost",
                onClick: (m) => i(d, !1)
              }, n(t(s)("pairing.deny")), 9, Zi),
              e("button", {
                type: "button",
                class: "btn btn-primary",
                onClick: (m) => i(d, !0)
              }, n(t(s)("pairing.allow")), 9, Qi)
            ], 64))
          ]))), 128))
        ]),
        _: 1
      }),
      _.value.length ? (r(), p(G, { key: 2 }, [
        e("h4", null, n(t(s)("pairing.pairedCount", { n: _.value.length })), 1),
        fe(At, {
          tag: "div",
          name: "pair",
          class: "pairing-list"
        }, {
          default: et(() => [
            (r(!0), p(G, null, de(_.value, (d) => (r(), p("article", {
              key: d.id
            }, [
              e("strong", null, n(d.name || d.id), 1),
              e("button", {
                type: "button",
                class: "btn btn-danger-tonal",
                disabled: u.value === d.id,
                onClick: (m) => o(d)
              }, n(u.value === d.id ? t(s)("pairing.disconnecting") : t(s)("pairing.disconnect")), 9, er)
            ]))), 128))
          ]),
          _: 1
        })
      ], 64)) : N("", !0)
    ]));
  }
}), sr = /* @__PURE__ */ Pe(tr, [["__scopeId", "data-v-67a1ff9e"]]), nr = { class: "content-card" }, lr = { class: "card-desc" }, or = { class: "field" }, ar = ["aria-label"], ir = ["aria-pressed", "onClick"], rr = /* @__PURE__ */ he({
  __name: "GeneralPanel",
  setup(y) {
    const { t: s } = ve(), h = x(vs());
    function c(_) {
      h.value = _, fs(_);
    }
    return (_, C) => (r(), p("div", nr, [
      e("h2", null, n(t(s)("settings.tabs.general")), 1),
      e("p", lr, n(t(s)("settings.generalDesc")), 1),
      e("div", or, [
        e("label", null, n(t(s)("settings.language")), 1),
        e("div", {
          class: "segmented",
          role: "group",
          "aria-label": t(s)("settings.language")
        }, [
          (r(!0), p(G, null, de(t(ms), (u) => (r(), p("button", {
            key: u.code,
            class: le(["seg", { active: h.value === u.code }]),
            "aria-pressed": h.value === u.code,
            onClick: (w) => c(u.code)
          }, n(u.label), 11, ir))), 128))
        ], 8, ar)
      ]),
      fe(sr)
    ]));
  }
}), dr = { class: "models-field" }, cr = {
  key: 0,
  class: "models-list"
}, ur = { class: "models-rank" }, pr = ["title"], hr = { class: "models-actions" }, vr = ["disabled", "aria-label", "onClick"], mr = ["disabled", "aria-label", "onClick"], fr = ["aria-label", "onClick"], gr = {
  key: 1,
  class: "models-empty"
}, br = /* @__PURE__ */ he({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(y, { emit: s }) {
    const { t: h } = ve(), c = y, _ = s, C = Z(() => String(c.modelValue || "").split(",").map((l) => l.trim()).filter(Boolean)), u = Z(() => c.options.filter((l) => !C.value.includes(l)));
    function w(l) {
      _("update:modelValue", l.join(","));
    }
    function P(l) {
      l && !C.value.includes(l) && w([...C.value, l]);
    }
    function i(l) {
      w(C.value.filter((a) => a !== l));
    }
    function o(l, a) {
      const d = [...C.value], m = l + a;
      m < 0 || m >= d.length || ([d[l], d[m]] = [d[m], d[l]], w(d));
    }
    return (l, a) => (r(), p("div", dr, [
      C.value.length ? (r(), p("ol", cr, [
        (r(!0), p(G, null, de(C.value, (d, m) => (r(), p("li", { key: d }, [
          e("span", ur, n(m + 1), 1),
          e("span", {
            class: "models-name",
            title: d
          }, n(d), 9, pr),
          e("span", hr, [
            e("button", {
              type: "button",
              disabled: m === 0,
              "aria-label": t(h)("models.higher"),
              onClick: (S) => o(m, -1)
            }, "↑", 8, vr),
            e("button", {
              type: "button",
              disabled: m === C.value.length - 1,
              "aria-label": t(h)("models.lower"),
              onClick: (S) => o(m, 1)
            }, "↓", 8, mr),
            e("button", {
              type: "button",
              "aria-label": t(h)("common.remove"),
              onClick: (S) => i(d)
            }, "✕", 8, fr)
          ])
        ]))), 128))
      ])) : (r(), p("p", gr, n(t(h)("models.empty")), 1)),
      u.value.length ? (r(), me(t(ze), {
        key: 2,
        options: u.value,
        "model-value": "",
        placeholder: t(h)("models.addPlaceholder"),
        "onUpdate:modelValue": P
      }, null, 8, ["options", "placeholder"])) : N("", !0)
    ]));
  }
}), _r = /* @__PURE__ */ Pe(br, [["__scopeId", "data-v-b6ad9d20"]]), yr = { class: "field" }, kr = {
  key: 0,
  class: "toggle-label"
}, wr = ["checked"], $r = { key: 0 }, Sr = {
  key: 1,
  class: "helper-text"
}, Cr = {
  key: 1,
  class: "field-note"
}, Pr = { key: 0 }, xr = ["for"], Mr = {
  key: 0,
  class: "helper-text"
}, Er = ["for"], Ur = {
  key: 0,
  class: "helper-text"
}, Tr = ["for"], Ar = {
  key: 0,
  class: "helper-text"
}, Ir = ["for"], Vr = { class: "path-row" }, Nr = ["id", "value", "placeholder"], Rr = {
  key: 0,
  class: "helper-text"
}, Lr = ["for"], Or = ["id", "type", "value"], Dr = {
  key: 0,
  class: "helper-text"
}, ht = /* @__PURE__ */ he({
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
  setup(y, { emit: s }) {
    const { t: h } = ve(), c = y, _ = s;
    function C() {
      return `field-${c.sectionId}-${c.field.key}`;
    }
    function u(w) {
      const P = w.target.value;
      _("update:modelValue", c.field.type === "number" ? Number(P) : P);
    }
    return (w, P) => (r(), p("div", yr, [
      y.field.type === "bool" ? (r(), p("label", kr, [
        e("input", {
          type: "checkbox",
          checked: !!y.modelValue,
          onChange: P[0] || (P[0] = (i) => _("update:modelValue", i.target.checked))
        }, null, 40, wr),
        P[5] || (P[5] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(y.label), 1),
          y.help ? (r(), p("br", $r)) : N("", !0),
          y.help ? (r(), p("small", Sr, n(y.help), 1)) : N("", !0)
        ])
      ])) : y.field.type === "note" ? (r(), p("div", Cr, [
        y.label ? (r(), p("strong", Pr, n(y.label), 1)) : N("", !0),
        fe(t(gs), {
          content: y.help || ""
        }, null, 8, ["content"])
      ])) : y.field.type === "select" ? (r(), p(G, { key: 2 }, [
        e("label", {
          for: C()
        }, n(y.label), 9, xr),
        fe(t(ze), {
          "input-id": C(),
          class: "input",
          "aria-label": y.label,
          "model-value": String(y.modelValue ?? ""),
          options: y.field.options ?? y.options ?? [],
          "onUpdate:modelValue": P[1] || (P[1] = (i) => _("update:modelValue", i))
        }, null, 8, ["input-id", "aria-label", "model-value", "options"]),
        y.help ? (r(), p("p", Mr, n(y.help), 1)) : N("", !0)
      ], 64)) : y.field.type === "model" ? (r(), p(G, { key: 3 }, [
        e("label", {
          for: C()
        }, n(y.label), 9, Er),
        fe(t(ze), {
          "input-id": C(),
          class: "input",
          "aria-label": y.label,
          "model-value": String(y.modelValue ?? ""),
          options: y.modelOptions || [],
          "onUpdate:modelValue": P[2] || (P[2] = (i) => _("update:modelValue", i))
        }, null, 8, ["input-id", "aria-label", "model-value", "options"]),
        y.help ? (r(), p("p", Ur, n(y.help), 1)) : N("", !0)
      ], 64)) : y.field.type === "models" ? (r(), p(G, { key: 4 }, [
        e("label", {
          for: C()
        }, n(y.label), 9, Tr),
        fe(_r, {
          "model-value": String(y.modelValue ?? ""),
          options: y.availableModels || [],
          "onUpdate:modelValue": P[3] || (P[3] = (i) => _("update:modelValue", i))
        }, null, 8, ["model-value", "options"]),
        y.help ? (r(), p("p", Ar, n(y.help), 1)) : N("", !0)
      ], 64)) : y.field.type === "dir" ? (r(), p(G, { key: 5 }, [
        e("label", {
          for: C()
        }, n(y.label), 9, Ir),
        e("div", Vr, [
          e("input", {
            id: C(),
            class: "input",
            type: "text",
            spellcheck: "false",
            value: String(y.modelValue ?? ""),
            placeholder: y.field.default_value || "",
            onInput: u
          }, null, 40, Nr),
          e("button", {
            class: "btn btn-tonal compact",
            type: "button",
            onClick: P[4] || (P[4] = (i) => _("browse"))
          }, n(t(h)("settings.browse")), 1)
        ]),
        y.help ? (r(), p("p", Rr, n(y.help), 1)) : N("", !0)
      ], 64)) : (r(), p(G, { key: 6 }, [
        e("label", {
          for: C()
        }, n(y.label), 9, Lr),
        e("input", {
          id: C(),
          class: "input",
          type: y.field.type === "number" ? "number" : "text",
          value: y.modelValue === void 0 || y.modelValue === null ? "" : String(y.modelValue),
          onInput: u
        }, null, 40, Or),
        y.help ? (r(), p("p", Dr, n(y.help), 1)) : N("", !0)
      ], 64))
    ]));
  }
});
var Fe;
((y) => {
  const u = class u {
    constructor(i, o, l, a) {
      Q(this, "version");
      Q(this, "errorCorrectionLevel");
      Q(this, "size");
      Q(this, "mask");
      Q(this, "modules", []);
      Q(this, "isFunction", []);
      if (this.version = i, this.errorCorrectionLevel = o, i < u.MIN_VERSION || i > u.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (a < -1 || a > 7)
        throw new RangeError("Mask value out of range");
      this.size = i * 4 + 17;
      let d = [];
      for (let S = 0; S < this.size; S++)
        d.push(!1);
      for (let S = 0; S < this.size; S++)
        this.modules.push(d.slice()), this.isFunction.push(d.slice());
      this.drawFunctionPatterns();
      const m = this.addEccAndInterleave(l);
      if (this.drawCodewords(m), a == -1) {
        let S = 1e9;
        for (let b = 0; b < 8; b++) {
          this.applyMask(b), this.drawFormatBits(b);
          const E = this.getPenaltyScore();
          E < S && (a = b, S = E), this.applyMask(b);
        }
      }
      _(0 <= a && a <= 7), this.mask = a, this.applyMask(a), this.drawFormatBits(a), this.isFunction = [];
    }
    static encodeText(i, o) {
      const l = y.QrSegment.makeSegments(i);
      return u.encodeSegments(l, o);
    }
    static encodeBinary(i, o) {
      const l = y.QrSegment.makeBytes(i);
      return u.encodeSegments([l], o);
    }
    static encodeSegments(i, o, l = 1, a = 40, d = -1, m = !0) {
      if (!(u.MIN_VERSION <= l && l <= a && a <= u.MAX_VERSION) || d < -1 || d > 7)
        throw new RangeError("Invalid value");
      let S, b;
      for (S = l; ; S++) {
        const V = u.getNumDataCodewords(S, o) * 8, I = C.getTotalBits(i, S);
        if (I <= V) {
          b = I;
          break;
        }
        if (S >= a)
          throw new RangeError("Data too long");
      }
      for (const V of [u.Ecc.MEDIUM, u.Ecc.QUARTILE, u.Ecc.HIGH])
        m && b <= u.getNumDataCodewords(S, V) * 8 && (o = V);
      let E = [];
      for (const V of i) {
        h(V.mode.modeBits, 4, E), h(V.numChars, V.mode.numCharCountBits(S), E);
        for (const I of V.getData())
          E.push(I);
      }
      _(E.length == b);
      const U = u.getNumDataCodewords(S, o) * 8;
      _(E.length <= U), h(0, Math.min(4, U - E.length), E), h(0, (8 - E.length % 8) % 8, E), _(E.length % 8 == 0);
      for (let V = 236; E.length < U; V ^= 253)
        h(V, 8, E);
      let H = [];
      for (; H.length * 8 < E.length; )
        H.push(0);
      return E.forEach((V, I) => H[I >>> 3] |= V << 7 - (I & 7)), new u(S, o, H, d);
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
      for (let d = 0; d < 10; d++)
        l = l << 1 ^ (l >>> 9) * 1335;
      const a = (o << 10 | l) ^ 21522;
      _(a >>> 15 == 0);
      for (let d = 0; d <= 5; d++)
        this.setFunctionModule(8, d, c(a, d));
      this.setFunctionModule(8, 7, c(a, 6)), this.setFunctionModule(8, 8, c(a, 7)), this.setFunctionModule(7, 8, c(a, 8));
      for (let d = 9; d < 15; d++)
        this.setFunctionModule(14 - d, 8, c(a, d));
      for (let d = 0; d < 8; d++)
        this.setFunctionModule(this.size - 1 - d, 8, c(a, d));
      for (let d = 8; d < 15; d++)
        this.setFunctionModule(8, this.size - 15 + d, c(a, d));
      this.setFunctionModule(8, this.size - 8, !0);
    }
    drawVersion() {
      if (this.version < 7)
        return;
      let i = this.version;
      for (let l = 0; l < 12; l++)
        i = i << 1 ^ (i >>> 11) * 7973;
      const o = this.version << 12 | i;
      _(o >>> 18 == 0);
      for (let l = 0; l < 18; l++) {
        const a = c(o, l), d = this.size - 11 + l % 3, m = Math.floor(l / 3);
        this.setFunctionModule(d, m, a), this.setFunctionModule(m, d, a);
      }
    }
    drawFinderPattern(i, o) {
      for (let l = -4; l <= 4; l++)
        for (let a = -4; a <= 4; a++) {
          const d = Math.max(Math.abs(a), Math.abs(l)), m = i + a, S = o + l;
          0 <= m && m < this.size && 0 <= S && S < this.size && this.setFunctionModule(m, S, d != 2 && d != 4);
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
      if (i.length != u.getNumDataCodewords(o, l))
        throw new RangeError("Invalid argument");
      const a = u.NUM_ERROR_CORRECTION_BLOCKS[l.ordinal][o], d = u.ECC_CODEWORDS_PER_BLOCK[l.ordinal][o], m = Math.floor(u.getNumRawDataModules(o) / 8), S = a - m % a, b = Math.floor(m / a);
      let E = [];
      const U = u.reedSolomonComputeDivisor(d);
      for (let V = 0, I = 0; V < a; V++) {
        let M = i.slice(I, I + b - d + (V < S ? 0 : 1));
        I += M.length;
        const T = u.reedSolomonComputeRemainder(M, U);
        V < S && M.push(0), E.push(M.concat(T));
      }
      let H = [];
      for (let V = 0; V < E[0].length; V++)
        E.forEach((I, M) => {
          (V != b - d || M >= S) && H.push(I[V]);
        });
      return _(H.length == m), H;
    }
    drawCodewords(i) {
      if (i.length != Math.floor(u.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let o = 0;
      for (let l = this.size - 1; l >= 1; l -= 2) {
        l == 6 && (l = 5);
        for (let a = 0; a < this.size; a++)
          for (let d = 0; d < 2; d++) {
            const m = l - d, b = (l + 1 & 2) == 0 ? this.size - 1 - a : a;
            !this.isFunction[b][m] && o < i.length * 8 && (this.modules[b][m] = c(i[o >>> 3], 7 - (o & 7)), o++);
          }
      }
      _(o == i.length * 8);
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
      for (let d = 0; d < this.size; d++) {
        let m = !1, S = 0, b = [0, 0, 0, 0, 0, 0, 0];
        for (let E = 0; E < this.size; E++)
          this.modules[d][E] == m ? (S++, S == 5 ? i += u.PENALTY_N1 : S > 5 && i++) : (this.finderPenaltyAddHistory(S, b), m || (i += this.finderPenaltyCountPatterns(b) * u.PENALTY_N3), m = this.modules[d][E], S = 1);
        i += this.finderPenaltyTerminateAndCount(m, S, b) * u.PENALTY_N3;
      }
      for (let d = 0; d < this.size; d++) {
        let m = !1, S = 0, b = [0, 0, 0, 0, 0, 0, 0];
        for (let E = 0; E < this.size; E++)
          this.modules[E][d] == m ? (S++, S == 5 ? i += u.PENALTY_N1 : S > 5 && i++) : (this.finderPenaltyAddHistory(S, b), m || (i += this.finderPenaltyCountPatterns(b) * u.PENALTY_N3), m = this.modules[E][d], S = 1);
        i += this.finderPenaltyTerminateAndCount(m, S, b) * u.PENALTY_N3;
      }
      for (let d = 0; d < this.size - 1; d++)
        for (let m = 0; m < this.size - 1; m++) {
          const S = this.modules[d][m];
          S == this.modules[d][m + 1] && S == this.modules[d + 1][m] && S == this.modules[d + 1][m + 1] && (i += u.PENALTY_N2);
        }
      let o = 0;
      for (const d of this.modules)
        o = d.reduce((m, S) => m + (S ? 1 : 0), o);
      const l = this.size * this.size, a = Math.ceil(Math.abs(o * 20 - l * 10) / l) - 1;
      return _(0 <= a && a <= 9), i += a * u.PENALTY_N4, _(0 <= i && i <= 2568888), i;
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
      if (i < u.MIN_VERSION || i > u.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let o = (16 * i + 128) * i + 64;
      if (i >= 2) {
        const l = Math.floor(i / 7) + 2;
        o -= (25 * l - 10) * l - 55, i >= 7 && (o -= 36);
      }
      return _(208 <= o && o <= 29648), o;
    }
    static getNumDataCodewords(i, o) {
      return Math.floor(u.getNumRawDataModules(i) / 8) - u.ECC_CODEWORDS_PER_BLOCK[o.ordinal][i] * u.NUM_ERROR_CORRECTION_BLOCKS[o.ordinal][i];
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
        for (let d = 0; d < o.length; d++)
          o[d] = u.reedSolomonMultiply(o[d], l), d + 1 < o.length && (o[d] ^= o[d + 1]);
        l = u.reedSolomonMultiply(l, 2);
      }
      return o;
    }
    static reedSolomonComputeRemainder(i, o) {
      let l = o.map((a) => 0);
      for (const a of i) {
        const d = a ^ l.shift();
        l.push(0), o.forEach((m, S) => l[S] ^= u.reedSolomonMultiply(m, d));
      }
      return l;
    }
    static reedSolomonMultiply(i, o) {
      if (i >>> 8 || o >>> 8)
        throw new RangeError("Byte out of range");
      let l = 0;
      for (let a = 7; a >= 0; a--)
        l = l << 1 ^ (l >>> 7) * 285, l ^= (o >>> a & 1) * i;
      return _(l >>> 8 == 0), l;
    }
    finderPenaltyCountPatterns(i) {
      const o = i[1];
      _(o <= this.size * 3);
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
  Q(u, "MIN_VERSION", 1), Q(u, "MAX_VERSION", 40), Q(u, "PENALTY_N1", 3), Q(u, "PENALTY_N2", 3), Q(u, "PENALTY_N3", 40), Q(u, "PENALTY_N4", 10), Q(u, "ECC_CODEWORDS_PER_BLOCK", [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  ]), Q(u, "NUM_ERROR_CORRECTION_BLOCKS", [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  ]);
  let s = u;
  y.QrCode = s;
  function h(P, i, o) {
    if (i < 0 || i > 31 || P >>> i)
      throw new RangeError("Value out of range");
    for (let l = i - 1; l >= 0; l--)
      o.push(P >>> l & 1);
  }
  function c(P, i) {
    return (P >>> i & 1) != 0;
  }
  function _(P) {
    if (!P)
      throw new Error("Assertion error");
  }
  const w = class w {
    constructor(i, o, l) {
      Q(this, "mode");
      Q(this, "numChars");
      Q(this, "bitData");
      if (this.mode = i, this.numChars = o, this.bitData = l, o < 0)
        throw new RangeError("Invalid argument");
      this.bitData = l.slice();
    }
    static makeBytes(i) {
      let o = [];
      for (const l of i)
        h(l, 8, o);
      return new w(w.Mode.BYTE, i.length, o);
    }
    static makeNumeric(i) {
      if (!w.isNumeric(i))
        throw new RangeError("String contains non-numeric characters");
      let o = [];
      for (let l = 0; l < i.length; ) {
        const a = Math.min(i.length - l, 3);
        h(parseInt(i.substring(l, l + a), 10), a * 3 + 1, o), l += a;
      }
      return new w(w.Mode.NUMERIC, i.length, o);
    }
    static makeAlphanumeric(i) {
      if (!w.isAlphanumeric(i))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let o = [], l;
      for (l = 0; l + 2 <= i.length; l += 2) {
        let a = w.ALPHANUMERIC_CHARSET.indexOf(i.charAt(l)) * 45;
        a += w.ALPHANUMERIC_CHARSET.indexOf(i.charAt(l + 1)), h(a, 11, o);
      }
      return l < i.length && h(w.ALPHANUMERIC_CHARSET.indexOf(i.charAt(l)), 6, o), new w(w.Mode.ALPHANUMERIC, i.length, o);
    }
    static makeSegments(i) {
      return i == "" ? [] : w.isNumeric(i) ? [w.makeNumeric(i)] : w.isAlphanumeric(i) ? [w.makeAlphanumeric(i)] : [w.makeBytes(w.toUtf8ByteArray(i))];
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
      return new w(w.Mode.ECI, 0, o);
    }
    static isNumeric(i) {
      return w.NUMERIC_REGEX.test(i);
    }
    static isAlphanumeric(i) {
      return w.ALPHANUMERIC_REGEX.test(i);
    }
    getData() {
      return this.bitData.slice();
    }
    static getTotalBits(i, o) {
      let l = 0;
      for (const a of i) {
        const d = a.mode.numCharCountBits(o);
        if (a.numChars >= 1 << d)
          return 1 / 0;
        l += 4 + d + a.bitData.length;
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
  Q(w, "NUMERIC_REGEX", /^[0-9]*$/), Q(w, "ALPHANUMERIC_REGEX", /^[A-Z0-9 $%*+.\/:-]*$/), Q(w, "ALPHANUMERIC_CHARSET", "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:");
  let C = w;
  y.QrSegment = C;
})(Fe || (Fe = {}));
((y) => {
  ((s) => {
    const c = class c {
      constructor(C, u) {
        Q(this, "ordinal");
        Q(this, "formatBits");
        this.ordinal = C, this.formatBits = u;
      }
    };
    Q(c, "LOW", new c(0, 1)), Q(c, "MEDIUM", new c(1, 0)), Q(c, "QUARTILE", new c(2, 3)), Q(c, "HIGH", new c(3, 2));
    let h = c;
    s.Ecc = h;
  })(y.QrCode || (y.QrCode = {}));
})(Fe || (Fe = {}));
((y) => {
  ((s) => {
    const c = class c {
      constructor(C, u) {
        Q(this, "modeBits");
        Q(this, "numBitsCharCount");
        this.modeBits = C, this.numBitsCharCount = u;
      }
      numCharCountBits(C) {
        return this.numBitsCharCount[Math.floor((C + 7) / 17)];
      }
    };
    Q(c, "NUMERIC", new c(1, [10, 12, 14])), Q(c, "ALPHANUMERIC", new c(2, [9, 11, 13])), Q(c, "BYTE", new c(4, [8, 16, 16])), Q(c, "KANJI", new c(8, [8, 10, 12])), Q(c, "ECI", new c(7, [0, 0, 0]));
    let h = c;
    s.Mode = h;
  })(y.QrSegment || (y.QrSegment = {}));
})(Fe || (Fe = {}));
const Rt = Fe, zr = { class: "content-card" }, Fr = { class: "card-desc" }, Br = { class: "connection-grid" }, Kr = { class: "connection-form" }, Hr = { class: "field" }, jr = ["placeholder"], Yr = { class: "field" }, Xr = { class: "toggle-label" }, Jr = { class: "field" }, Wr = ["placeholder"], qr = { class: "field" }, Gr = ["placeholder"], Zr = { class: "field" }, Qr = { class: "helper-text" }, ed = { key: 0 }, td = { key: 1 }, sd = { class: "actions-row" }, nd = { class: "connection-qr" }, ld = ["viewBox"], od = ["width", "height"], ad = ["x", "y"], id = { class: "connection-link" }, Lt = "0kay.connection.qr.v2", rd = /* @__PURE__ */ he({
  __name: "ConnectionPanel",
  setup(y) {
    const { t: s } = ve();
    function h() {
      try {
        return JSON.parse(localStorage.getItem(Lt) || "{}");
      } catch {
        return {};
      }
    }
    function c(I) {
      const M = (T) => /^192\.168\./.test(T) ? 0 : /^10\./.test(T) ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(T) ? 2 : /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(T) ? 4 : 3;
      return [...I].sort((T, q) => M(T) - M(q))[0] || "";
    }
    const _ = h(), C = !!_.hostOverride, u = x(_.hostOverride && _.host ? _.host : location.hostname), w = x(C), P = location.protocol === "https:" ? location.port || "443" : "8080", i = x(_.port ?? P), o = x(_.tls ?? location.protocol === "https:"), l = x(""), a = x(""), d = x(_.name ?? "0KAY"), m = x(""), S = x(!1), b = x(!1);
    Ue(async () => {
      try {
        const I = await fetch("/api/auth/session");
        if (I.ok) {
          const M = await I.json();
          m.value = String(M.core_id || ""), S.value = !!M.lan_enabled;
          const T = Array.isArray(M.addresses) ? M.addresses : [], q = c(T);
          !w.value && q && (u.value = q);
        }
      } catch {
      }
    }), He([u, i, o, d, w], () => {
      localStorage.setItem(
        Lt,
        JSON.stringify({
          host: u.value,
          hostOverride: w.value,
          port: i.value,
          tls: o.value,
          name: d.value
        })
      );
    });
    const E = Z(() => {
      const I = o.value ? "https" : "http", M = String(i.value || "").trim();
      return `${I}://${u.value.trim()}${M ? ":" + M : ""}`;
    }), U = Z(() => {
      const I = [["v", "1"], ["url", E.value]];
      return d.value.trim() && I.push(["name", d.value.trim()]), l.value.trim() && I.push(["token", l.value.trim()]), a.value.trim() && I.push(["pin", a.value.trim()]), m.value && I.push(["core_id", m.value]), `0kay://pair?${I.map(([T, q]) => `${T}=${encodeURIComponent(q)}`).join("&")}`;
    }), H = Z(() => {
      const I = Rt.QrCode.encodeText(U.value, Rt.QrCode.Ecc.MEDIUM), M = I.size, T = 2, q = M + T * 2, ce = [];
      for (let oe = 0; oe < M; oe++)
        for (let F = 0; F < M; F++)
          I.getModule(F, oe) && ce.push({ x: F + T, y: oe + T });
      return { dim: q, dark: ce };
    });
    async function V() {
      try {
        await navigator.clipboard.writeText(U.value), b.value = !0, setTimeout(() => b.value = !1, 1500);
      } catch {
      }
    }
    return (I, M) => (r(), p("div", zr, [
      e("h2", null, n(t(s)("connection.title")), 1),
      e("p", Fr, n(t(s)("connection.lead")), 1),
      e("div", Br, [
        e("div", Kr, [
          e("div", Hr, [
            e("label", null, n(t(s)("connection.remoteHost")), 1),
            D(e("input", {
              "onUpdate:modelValue": M[0] || (M[0] = (T) => u.value = T),
              class: "input",
              placeholder: t(s)("connection.hostPlaceholder"),
              onInput: M[1] || (M[1] = (T) => w.value = !0)
            }, null, 40, jr), [
              [J, u.value]
            ])
          ]),
          e("div", Yr, [
            e("label", null, n(t(s)("connection.port")), 1),
            D(e("input", {
              "onUpdate:modelValue": M[2] || (M[2] = (T) => i.value = T),
              class: "input",
              inputmode: "numeric",
              placeholder: "8080"
            }, null, 512), [
              [J, i.value]
            ])
          ]),
          e("label", Xr, [
            D(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": M[3] || (M[3] = (T) => o.value = T)
            }, null, 512), [
              [ge, o.value]
            ]),
            M[7] || (M[7] = e("span", { class: "toggle-slider" }, null, -1)),
            e("span", null, n(t(s)("connection.useTls")), 1)
          ]),
          e("div", Jr, [
            e("label", null, n(t(s)("connection.token")), 1),
            D(e("input", {
              "onUpdate:modelValue": M[4] || (M[4] = (T) => l.value = T),
              class: "input",
              type: "password",
              placeholder: t(s)("connection.tokenPlaceholder"),
              autocomplete: "off"
            }, null, 8, Wr), [
              [J, l.value]
            ])
          ]),
          e("div", qr, [
            e("label", null, n(t(s)("connection.pin")), 1),
            D(e("input", {
              "onUpdate:modelValue": M[5] || (M[5] = (T) => a.value = T),
              class: "input",
              type: "password",
              placeholder: t(s)("connection.pinPlaceholder"),
              autocomplete: "off"
            }, null, 8, Gr), [
              [J, a.value]
            ])
          ]),
          e("div", Zr, [
            e("label", null, n(t(s)("connection.deviceName")), 1),
            D(e("input", {
              "onUpdate:modelValue": M[6] || (M[6] = (T) => d.value = T),
              class: "input",
              placeholder: "0KAY"
            }, null, 512), [
              [J, d.value]
            ])
          ]),
          e("div", Qr, [
            Ce(n(t(s)("connection.address")), 1),
            e("code", null, n(E.value), 1),
            m.value ? (r(), p("span", ed, " · Core: " + n(m.value), 1)) : N("", !0),
            S.value ? (r(), p("span", td, n(t(s)("connection.lanMode")), 1)) : N("", !0)
          ]),
          e("div", sd, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              onClick: V
            }, n(b.value ? t(s)("common.copied") : t(s)("connection.copyLink")), 1)
          ])
        ]),
        e("div", nd, [
          (r(), p("svg", {
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
            }, null, 8, od),
            (r(!0), p(G, null, de(H.value.dark, (T) => (r(), p("rect", {
              key: T.x + ":" + T.y,
              x: T.x,
              y: T.y,
              width: "1",
              height: "1",
              fill: "#0b1020"
            }, null, 8, ad))), 128))
          ], 8, ld)),
          e("code", id, n(U.value), 1)
        ])
      ])
    ]));
  }
}), dd = /* @__PURE__ */ Pe(rd, [["__scopeId", "data-v-d9b226f0"]]), cd = { class: "content-card" }, ud = { class: "card-desc" }, pd = { class: "field-row" }, hd = { class: "field" }, vd = ["placeholder"], md = { class: "field" }, fd = ["placeholder"], gd = { class: "field" }, bd = { class: "field" }, _d = ["placeholder"], yd = { class: "field" }, kd = ["placeholder"], wd = { class: "field" }, $d = ["placeholder"], Sd = { class: "field" }, Cd = ["placeholder"], Pd = { class: "helper-text" }, xd = /* @__PURE__ */ he({
  __name: "PersonaPanel",
  setup(y) {
    const { t: s } = ve(), h = lt(), { tabLabel: c, tabMeta: _ } = ft();
    return (C, u) => (r(), p("div", cd, [
      e("h2", null, n(t(c)("persona")), 1),
      e("p", ud, n(t(_)("persona")?.descriptionKey ? t(s)(t(_)("persona").descriptionKey) : t(s)("settings.personaDesc")), 1),
      e("div", pd, [
        e("div", hd, [
          e("label", null, n(t(s)("wizard.name")), 1),
          D(e("input", {
            "onUpdate:modelValue": u[0] || (u[0] = (w) => t(h).persona.name = w),
            placeholder: t(s)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, vd), [
            [J, t(h).persona.name]
          ])
        ]),
        e("div", md, [
          e("label", null, n(t(s)("wizard.avatarUrl")), 1),
          D(e("input", {
            "onUpdate:modelValue": u[1] || (u[1] = (w) => t(h).persona.avatar = w),
            placeholder: t(s)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, fd), [
            [J, t(h).persona.avatar]
          ])
        ]),
        e("div", gd, [
          e("label", null, n(t(s)("settings.personaBirthDate")), 1),
          D(e("input", {
            "onUpdate:modelValue": u[2] || (u[2] = (w) => t(h).persona.birthDate = w),
            type: "date",
            class: "input"
          }, null, 512), [
            [J, t(h).persona.birthDate]
          ])
        ])
      ]),
      e("div", bd, [
        e("label", null, n(t(s)("wizard.description")), 1),
        D(e("textarea", {
          "onUpdate:modelValue": u[3] || (u[3] = (w) => t(h).persona.description = w),
          placeholder: t(s)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, _d), [
          [J, t(h).persona.description]
        ])
      ]),
      e("div", yd, [
        e("label", null, n(t(s)("wizard.personality")), 1),
        D(e("textarea", {
          "onUpdate:modelValue": u[4] || (u[4] = (w) => t(h).persona.personality = w),
          placeholder: t(s)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, kd), [
          [J, t(h).persona.personality]
        ])
      ]),
      e("div", wd, [
        e("label", null, n(t(s)("wizard.greeting")), 1),
        D(e("textarea", {
          "onUpdate:modelValue": u[5] || (u[5] = (w) => t(h).persona.greeting = w),
          placeholder: t(s)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, $d), [
          [J, t(h).persona.greeting]
        ])
      ]),
      e("div", Sd, [
        e("label", null, n(t(s)("wizard.customPrompt")), 1),
        D(e("textarea", {
          "onUpdate:modelValue": u[6] || (u[6] = (w) => t(h).persona.customPrompt = w),
          placeholder: t(s)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, Cd), [
          [J, t(h).persona.customPrompt]
        ]),
        e("p", Pd, n(t(s)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), Md = { class: "content-card" }, Ed = { class: "card-desc" }, Ud = { class: "toggle-label" }, Td = { class: "helper-text" }, Ad = { class: "toggle-label" }, Id = { class: "helper-text" }, Vd = { class: "field" }, Nd = ["placeholder"], Rd = { class: "helper-text" }, Ld = {
  key: 0,
  class: "helper-text"
}, Od = { class: "actions-row" }, Dd = /* @__PURE__ */ he({
  __name: "PermissionsPanel",
  setup(y) {
    const { t: s } = ve(), { tabLabel: h, tabMeta: c, fieldLabel: _, fieldHelp: C } = ft(), u = x({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), w = x("");
    async function P() {
      try {
        const o = await fetch("/api/life/permissions");
        if (o.ok) {
          const l = await o.json();
          u.value = {
            screen_watch: !!l.screen_watch,
            computer_use: !!l.computer_use,
            report_agent_host: l.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function i() {
      w.value = "";
      try {
        const o = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(u.value)
        });
        if (!o.ok) throw new Error(String(o.status));
        const l = await o.json();
        u.value = {
          screen_watch: !!l.screen_watch,
          computer_use: !!l.computer_use,
          report_agent_host: l.report_agent_host || ""
        }, w.value = s("settings.permSaved");
      } catch {
        w.value = s("settings.permFailed");
      }
    }
    return Ue(P), (o, l) => (r(), p("div", Md, [
      e("h2", null, n(t(h)("permissions")), 1),
      e("p", Ed, n(t(c)("permissions")?.descriptionKey ? t(s)(t(c)("permissions").descriptionKey) : t(s)("settings.permissionsDesc")), 1),
      e("label", Ud, [
        D(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": l[0] || (l[0] = (a) => u.value.screen_watch = a),
          onChange: i
        }, null, 544), [
          [ge, u.value.screen_watch]
        ]),
        l[4] || (l[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(t(_)(t(c)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          l[3] || (l[3] = e("br", null, null, -1)),
          e("small", Td, n(t(C)(t(c)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", Ad, [
        D(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": l[1] || (l[1] = (a) => u.value.computer_use = a),
          onChange: i
        }, null, 544), [
          [ge, u.value.computer_use]
        ]),
        l[6] || (l[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(t(_)(t(c)("permissions"), "computer_use", "settings.computerUse")), 1),
          l[5] || (l[5] = e("br", null, null, -1)),
          e("small", Id, n(t(C)(t(c)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", Vd, [
        e("label", null, n(t(_)(t(c)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        D(e("input", {
          "onUpdate:modelValue": l[2] || (l[2] = (a) => u.value.report_agent_host = a),
          class: "input",
          placeholder: t(C)(t(c)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: i
        }, null, 40, Nd), [
          [J, u.value.report_agent_host]
        ]),
        e("p", Rd, n(t(C)(t(c)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      w.value ? (r(), p("div", Ld, n(w.value), 1)) : N("", !0),
      e("div", Od, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: i
        }, n(t(s)("settings.save")), 1)
      ])
    ]));
  }
}), zd = x(!1), Fd = x(!1);
x(!1);
const Oe = x(!1), je = x(!0), gt = x(!0), Je = x([]), Kt = x(!1);
x(!1);
const ot = x(!1), Ot = [];
function Bd(y) {
  const s = Ot.splice(0, Ot.length);
  for (const h of s)
    h.resolve();
}
async function Kd() {
  const y = window.fetch;
  try {
    const s = await y("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!s.ok) return;
    const h = await s.json();
    Oe.value = !!h.configured, je.value = h.enabled !== !1, gt.value = h.login_enabled !== !1, Je.value = Array.isArray(h.pages) ? h.pages : [], ot.value = !h.configured && je.value;
  } catch {
  }
}
async function Hd(y) {
  const s = window.fetch, h = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(y)
  }), c = await h.json().catch(() => null);
  if (!h.ok) throw new Error(c?.error || `HTTP ${h.status}`);
  typeof c?.enabled == "boolean" && (je.value = c.enabled), typeof c?.login_enabled == "boolean" && (gt.value = c.login_enabled), Array.isArray(c?.pages) && (Je.value = c.pages), Oe.value = !!c?.configured, ot.value = !c?.configured && je.value;
}
async function jd() {
  const y = window.fetch, s = await y("/api/security/pin", { method: "DELETE" }), h = await s.json().catch(() => null);
  if (!s.ok) throw new Error(h?.error || `HTTP ${s.status}`);
  Kt.value = !1, Oe.value = !1, ot.value = je.value;
}
async function Yd(y) {
  const s = window.fetch, h = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: y })
  }), c = await h.json().catch(() => null);
  if (!h.ok || !c?.configured) throw new Error(c?.error || `HTTP ${h.status}`);
  y.trim(), Kt.value = !0, Oe.value = !0, ot.value = !1, Fd.value = !0, zd.value = !1, Bd();
}
const Xd = { class: "content-card security-panel" }, Jd = { class: "card-desc" }, Wd = { class: "sec-stack" }, qd = { class: "toggle-label" }, Gd = ["checked", "disabled"], Zd = { class: "helper-text" }, Qd = { class: "toggle-label" }, ec = ["checked", "disabled"], tc = { class: "helper-text" }, sc = { class: "sec-card" }, nc = { class: "sec-card-head" }, lc = { class: "sec-pin-grid" }, oc = { class: "sec-pin-col" }, ac = { class: "sec-pin-label" }, ic = { class: "sec-pin-col" }, rc = { class: "sec-pin-label" }, dc = { class: "sec-actions" }, cc = ["disabled"], uc = ["disabled"], pc = { class: "sec-card" }, hc = { class: "sec-card-head" }, vc = { class: "sec-chip" }, mc = { class: "helper-text" }, fc = { class: "page-list" }, gc = ["checked", "disabled", "onChange"], bc = { class: "page-text" }, _c = { class: "page-name" }, yc = {
  key: 0,
  class: "helper-text sec-msg"
}, kc = {
  key: 1,
  class: "sec-error"
}, wc = /* @__PURE__ */ he({
  __name: "SecurityPanel",
  setup(y) {
    const { t: s } = ve(), { confirm: h } = We(), c = Ft(), _ = x(!1), C = x(""), u = x(""), w = x(""), P = x(""), i = Z(() => {
      const S = [], b = /* @__PURE__ */ new Set(), E = (U, H) => {
        !U || b.has(U) || (b.add(U), S.push({ path: U, label: H || U }));
      };
      for (const U of c.navItems) {
        const H = U.to || (U.id === "chat" ? "/" : "");
        if (!H) continue;
        let V = U.labelKey ? s(U.labelKey) : "";
        (!V || V === U.labelKey) && (V = U.label || U.id), E(H, V);
      }
      for (const U of c.routerPatches) {
        let H = U.titleKey ? s(U.titleKey) : "";
        (!H || H === U.titleKey) && (H = U.title || String(U.name || U.path)), E(U.path, H);
      }
      return S;
    });
    Ue(() => {
      Kd();
    });
    async function o(S) {
      _.value = !0, C.value = "", u.value = "";
      try {
        await Hd(S), C.value = s("settings.saved"), setTimeout(() => {
          C.value = "";
        }, 1500);
      } catch (b) {
        u.value = b?.message || s("settings.permFailed");
      } finally {
        _.value = !1;
      }
    }
    function l(S, b) {
      o({ [S]: b });
    }
    function a(S, b) {
      const E = new Set(Je.value);
      b ? E.add(S) : E.delete(S), o({ pages: [...E] });
    }
    async function d() {
      if (u.value = "", w.value.length !== 6) {
        u.value = s("wizard.pinTooShort");
        return;
      }
      if (w.value !== P.value) {
        u.value = s("wizard.pinMismatch");
        return;
      }
      _.value = !0;
      try {
        await Yd(w.value), w.value = "", P.value = "", C.value = s("settings.saved"), setTimeout(() => {
          C.value = "";
        }, 1500);
      } catch (S) {
        u.value = S?.message || s("settings.permFailed");
      } finally {
        _.value = !1;
      }
    }
    async function m() {
      if (await h({
        title: s("security.removePin"),
        message: s("security.removePinConfirm"),
        confirmLabel: s("common.delete"),
        danger: !0
      })) {
        _.value = !0, u.value = "";
        try {
          await jd(), C.value = s("settings.saved"), setTimeout(() => {
            C.value = "";
          }, 1500);
        } catch (b) {
          u.value = b?.message || s("settings.permFailed");
        } finally {
          _.value = !1;
        }
      }
    }
    return (S, b) => (r(), p("div", Xd, [
      e("h2", null, n(t(s)("settings.tabs.security")), 1),
      e("p", Jd, n(t(s)("security.desc")), 1),
      e("div", Wd, [
        e("label", qd, [
          e("input", {
            type: "checkbox",
            checked: t(je),
            disabled: _.value,
            onChange: b[0] || (b[0] = (E) => l("enabled", E.target.checked))
          }, null, 40, Gd),
          b[4] || (b[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, n(t(s)("security.pinSwitch")), 1),
            e("small", Zd, n(t(s)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", Qd, [
          e("input", {
            type: "checkbox",
            checked: t(gt),
            disabled: _.value,
            onChange: b[1] || (b[1] = (E) => l("login_enabled", E.target.checked))
          }, null, 40, ec),
          b[5] || (b[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, n(t(s)("security.loginSwitch")), 1),
            e("small", tc, n(t(s)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", sc, [
          e("div", nc, [
            e("strong", null, n(t(Oe) ? t(s)("security.changePin") : t(s)("auth.setupTitle")), 1),
            e("span", {
              class: le(["sec-chip", { on: t(Oe) }])
            }, n(t(Oe) ? t(s)("security.pinSet") : t(s)("security.pinUnset")), 3)
          ]),
          e("div", lc, [
            e("div", oc, [
              e("span", ac, n(t(s)("auth.pinNew")), 1),
              fe(t(Vt), {
                modelValue: w.value,
                "onUpdate:modelValue": b[2] || (b[2] = (E) => w.value = E)
              }, null, 8, ["modelValue"])
            ]),
            e("div", ic, [
              e("span", rc, n(t(s)("auth.pinConfirm")), 1),
              fe(t(Vt), {
                modelValue: P.value,
                "onUpdate:modelValue": b[3] || (b[3] = (E) => P.value = E),
                onComplete: d
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", dc, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: _.value,
              onClick: d
            }, n(t(s)("auth.savePin")), 9, cc),
            t(Oe) ? (r(), p("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: _.value,
              onClick: m
            }, n(t(s)("security.removePin")), 9, uc)) : N("", !0)
          ])
        ]),
        e("section", pc, [
          e("div", hc, [
            e("strong", null, n(t(s)("security.pages")), 1),
            e("span", vc, n(t(s)("security.pageCount", { n: t(Je).length })), 1)
          ]),
          e("p", mc, n(t(s)("security.pagesHelp")), 1),
          e("div", fc, [
            (r(!0), p(G, null, de(i.value, (E) => (r(), p("label", {
              key: E.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: t(Je).includes(E.path),
                disabled: _.value,
                onChange: (U) => a(E.path, U.target.checked)
              }, null, 40, gc),
              b[6] || (b[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", bc, [
                e("span", _c, n(E.label), 1),
                e("code", null, n(E.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      C.value ? (r(), p("p", yc, n(C.value), 1)) : N("", !0),
      u.value ? (r(), p("p", kc, n(u.value), 1)) : N("", !0)
    ]));
  }
}), $c = /* @__PURE__ */ Pe(wc, [["__scopeId", "data-v-8a0a3d8d"]]), Sc = { class: "mcp-panel" }, Cc = { class: "mcp-head" }, Pc = { class: "subtitle" }, xc = { class: "mcp-actions" }, Mc = ["disabled"], Ec = {
  key: 0,
  class: "error-banner"
}, Uc = {
  key: 1,
  class: "notice-banner"
}, Tc = {
  key: 2,
  class: "hint"
}, Ac = {
  key: 3,
  class: "mcp-list"
}, Ic = { class: "mcp-row" }, Vc = { class: "mcp-field grow" }, Nc = ["onUpdate:modelValue", "readonly"], Rc = { class: "mcp-field" }, Lc = ["onUpdate:modelValue", "onChange"], Oc = { value: "builtin" }, Dc = { class: "mcp-toggle" }, zc = ["onUpdate:modelValue"], Fc = ["onClick"], Bc = { class: "mcp-field" }, Kc = ["onUpdate:modelValue"], Hc = { class: "mcp-field" }, jc = ["onUpdate:modelValue"], Yc = { class: "mcp-field" }, Xc = ["onUpdate:modelValue"], Jc = { class: "mcp-field" }, Wc = ["onUpdate:modelValue"], qc = { class: "builtin-note" }, Gc = { class: "mail-grid" }, Zc = { class: "mail-col" }, Qc = { class: "mail-label" }, eu = { class: "mcp-field" }, tu = ["onUpdate:modelValue"], su = { class: "mail-row" }, nu = { class: "mcp-field" }, lu = ["onUpdate:modelValue"], ou = { class: "mcp-toggle" }, au = ["onUpdate:modelValue"], iu = { class: "mcp-field" }, ru = ["onUpdate:modelValue"], du = { class: "mcp-field" }, cu = ["onUpdate:modelValue"], uu = { class: "mail-col" }, pu = { class: "mail-label" }, hu = { class: "mcp-field" }, vu = ["onUpdate:modelValue"], mu = { class: "mail-row" }, fu = { class: "mcp-field" }, gu = ["onUpdate:modelValue"], bu = { class: "mcp-toggle" }, _u = ["onUpdate:modelValue"], yu = { class: "mcp-field" }, ku = ["onUpdate:modelValue"], wu = { class: "mcp-field" }, $u = ["onUpdate:modelValue"], Su = { class: "mail-row" }, Cu = { class: "mcp-field grow" }, Pu = ["onUpdate:modelValue", "placeholder"], xu = { class: "mcp-field" }, Mu = ["onUpdate:modelValue"], Eu = {
  key: 0,
  class: "hint"
}, Uu = /* @__PURE__ */ he({
  __name: "McpPanel",
  setup(y) {
    const { t: s } = ve(), h = x([]), c = x(!1), _ = x(!1), C = x(""), u = x(!1);
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
    function P(m) {
      const S = m?.transport === "http" ? "http" : m?.transport === "builtin" || m?.builtin ? "builtin" : "stdio", b = m?.options?.imap || {}, E = m?.options?.smtp || {};
      return {
        id: String(m?.id || ""),
        transport: S,
        command: String(m?.command || ""),
        argsText: Array.isArray(m?.args) ? m.args.join(`
`) : "",
        url: String(m?.url || ""),
        headersText: m?.headers && typeof m.headers == "object" ? JSON.stringify(m.headers, null, 2) : "",
        enabled: m?.enabled !== !1,
        imapHost: String(b.host || ""),
        imapPort: Number(b.port) || 993,
        imapSsl: b.ssl !== !1,
        imapUser: String(b.user || ""),
        imapPassword: String(b.password || ""),
        smtpHost: String(E.host || ""),
        smtpPort: Number(E.port) || 465,
        smtpSecure: E.secure !== !1,
        smtpUser: String(E.user || ""),
        smtpPassword: String(E.password || ""),
        from: String(E.from || ""),
        fromName: String(E.fromName || "0KAY")
      };
    }
    function i(m) {
      if (m.transport === "builtin") {
        const b = {};
        return (m.imapHost.trim() || m.imapUser.trim()) && (b.imap = {
          host: m.imapHost.trim(),
          port: Number(m.imapPort) || 993,
          ssl: m.imapSsl,
          user: m.imapUser.trim(),
          password: m.imapPassword
        }), (m.smtpHost.trim() || m.smtpUser.trim() || m.from.trim()) && (b.smtp = {
          host: m.smtpHost.trim(),
          port: Number(m.smtpPort) || 465,
          secure: m.smtpSecure,
          user: m.smtpUser.trim(),
          password: m.smtpPassword,
          from: m.from.trim(),
          fromName: m.fromName.trim() || "0KAY"
        }), { id: m.id.trim() || "mail", transport: "builtin", builtin: "mail", enabled: m.enabled, options: b };
      }
      const S = { id: m.id.trim(), transport: m.transport, enabled: m.enabled };
      if (m.transport === "http") {
        if (m.url.trim() && (S.url = m.url.trim()), m.headersText.trim())
          try {
            S.headers = JSON.parse(m.headersText);
          } catch {
            throw new Error(s("mcp.headersInvalid", { id: m.id || "(unnamed)" }));
          }
      } else {
        m.command.trim() && (S.command = m.command.trim());
        const b = m.argsText.split(`
`).map((E) => E.trim()).filter(Boolean);
        b.length && (S.args = b);
      }
      return S;
    }
    function o(m) {
      m.transport === "builtin" && (m.id = "mail");
    }
    function l() {
      const m = w();
      h.value.some((S) => S.transport === "builtin") && (m.transport = "stdio"), h.value.push(m);
    }
    async function a() {
      c.value = !0, C.value = "";
      try {
        const S = (await Le("/api/settings/mcp"))?.values?.servers;
        let b = [];
        if (typeof S == "string" && S.trim())
          try {
            const E = JSON.parse(S);
            Array.isArray(E) && (b = E);
          } catch {
            C.value = s("mcp.configInvalid");
          }
        h.value = b.map(P);
      } catch (m) {
        C.value = m?.message || String(m);
      } finally {
        c.value = !1;
      }
    }
    async function d() {
      if (!_.value) {
        _.value = !0, C.value = "", u.value = !1;
        try {
          const m = /* @__PURE__ */ new Set(), S = h.value.map(i).filter((b) => {
            const E = String(b.id || "").trim();
            return !E || m.has(E) ? !1 : (m.add(E), !0);
          });
          await tt("/api/settings/mcp", { values: { servers: JSON.stringify(S) } }), u.value = !0, setTimeout(() => {
            u.value = !1;
          }, 2e3);
        } catch (m) {
          C.value = m?.message || String(m);
        } finally {
          _.value = !1;
        }
      }
    }
    return Ue(a), (m, S) => (r(), p("div", Sc, [
      e("header", Cc, [
        e("div", null, [
          e("h2", null, n(t(s)("mcp.title")), 1),
          e("p", Pc, n(t(s)("mcp.subtitle")), 1)
        ]),
        e("div", xc, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: l
          }, n(t(s)("mcp.addServer")), 1),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: _.value,
            onClick: d
          }, n(_.value ? t(s)("common.saving") : t(s)("common.save")), 9, Mc)
        ])
      ]),
      C.value ? (r(), p("div", Ec, n(C.value), 1)) : N("", !0),
      u.value ? (r(), p("div", Uc, n(t(s)("settings.saved")), 1)) : N("", !0),
      c.value ? (r(), p("p", Tc, n(t(s)("common.loading")), 1)) : (r(), p("div", Ac, [
        (r(!0), p(G, null, de(h.value, (b, E) => (r(), p("article", {
          key: E,
          class: le(["mcp-card", { "is-builtin": b.transport === "builtin" }])
        }, [
          e("div", Ic, [
            e("label", Vc, [
              S[0] || (S[0] = e("span", null, "ID", -1)),
              D(e("input", {
                "onUpdate:modelValue": (U) => b.id = U,
                readonly: b.transport === "builtin",
                placeholder: "filesystem"
              }, null, 8, Nc), [
                [J, b.id]
              ])
            ]),
            e("label", Rc, [
              e("span", null, n(t(s)("mcp.transport")), 1),
              D(e("select", {
                "onUpdate:modelValue": (U) => b.transport = U,
                onChange: (U) => o(b)
              }, [
                S[1] || (S[1] = e("option", { value: "stdio" }, "stdio", -1)),
                S[2] || (S[2] = e("option", { value: "http" }, "http", -1)),
                e("option", Oc, n(t(s)("mcp.builtinMail")), 1)
              ], 40, Lc), [
                [as, b.transport]
              ])
            ]),
            e("label", Dc, [
              D(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (U) => b.enabled = U
              }, null, 8, zc), [
                [ge, b.enabled]
              ]),
              e("span", null, n(t(s)("mcp.enabled")), 1)
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (U) => h.value.splice(E, 1)
            }, n(t(s)("common.delete")), 9, Fc)
          ]),
          b.transport === "stdio" ? (r(), p(G, { key: 0 }, [
            e("label", Bc, [
              e("span", null, n(t(s)("mcp.command")), 1),
              D(e("input", {
                "onUpdate:modelValue": (U) => b.command = U,
                placeholder: "npx"
              }, null, 8, Kc), [
                [J, b.command]
              ])
            ]),
            e("label", Hc, [
              e("span", null, n(t(s)("mcp.args")), 1),
              D(e("textarea", {
                "onUpdate:modelValue": (U) => b.argsText = U,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, jc), [
                [J, b.argsText]
              ])
            ])
          ], 64)) : b.transport === "http" ? (r(), p(G, { key: 1 }, [
            e("label", Yc, [
              S[3] || (S[3] = e("span", null, "URL", -1)),
              D(e("input", {
                "onUpdate:modelValue": (U) => b.url = U,
                placeholder: "https://example.com/mcp"
              }, null, 8, Xc), [
                [J, b.url]
              ])
            ]),
            e("label", Jc, [
              S[4] || (S[4] = e("span", null, "Headers（JSON）", -1)),
              D(e("textarea", {
                "onUpdate:modelValue": (U) => b.headersText = U,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, Wc), [
                [J, b.headersText]
              ])
            ])
          ], 64)) : (r(), p(G, { key: 2 }, [
            e("p", qc, n(t(s)("mcp.builtinNote")), 1),
            e("div", Gc, [
              e("div", Zc, [
                e("p", Qc, n(t(s)("mcp.imap")), 1),
                e("label", eu, [
                  e("span", null, n(t(s)("mcp.host")), 1),
                  D(e("input", {
                    "onUpdate:modelValue": (U) => b.imapHost = U,
                    placeholder: "imap.example.com",
                    autocomplete: "off"
                  }, null, 8, tu), [
                    [J, b.imapHost]
                  ])
                ]),
                e("div", su, [
                  e("label", nu, [
                    e("span", null, n(t(s)("mcp.port")), 1),
                    D(e("input", {
                      "onUpdate:modelValue": (U) => b.imapPort = U,
                      type: "number",
                      placeholder: "993"
                    }, null, 8, lu), [
                      [
                        J,
                        b.imapPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", ou, [
                    D(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (U) => b.imapSsl = U
                    }, null, 8, au), [
                      [ge, b.imapSsl]
                    ]),
                    S[5] || (S[5] = e("span", null, "SSL", -1))
                  ])
                ]),
                e("label", iu, [
                  e("span", null, n(t(s)("mcp.username")), 1),
                  D(e("input", {
                    "onUpdate:modelValue": (U) => b.imapUser = U,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, ru), [
                    [J, b.imapUser]
                  ])
                ]),
                e("label", du, [
                  e("span", null, n(t(s)("mcp.password")), 1),
                  D(e("input", {
                    "onUpdate:modelValue": (U) => b.imapPassword = U,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, cu), [
                    [J, b.imapPassword]
                  ])
                ])
              ]),
              e("div", uu, [
                e("p", pu, n(t(s)("mcp.smtp")), 1),
                e("label", hu, [
                  e("span", null, n(t(s)("mcp.host")), 1),
                  D(e("input", {
                    "onUpdate:modelValue": (U) => b.smtpHost = U,
                    placeholder: "smtp.example.com",
                    autocomplete: "off"
                  }, null, 8, vu), [
                    [J, b.smtpHost]
                  ])
                ]),
                e("div", mu, [
                  e("label", fu, [
                    e("span", null, n(t(s)("mcp.port")), 1),
                    D(e("input", {
                      "onUpdate:modelValue": (U) => b.smtpPort = U,
                      type: "number",
                      placeholder: "465"
                    }, null, 8, gu), [
                      [
                        J,
                        b.smtpPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", bu, [
                    D(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (U) => b.smtpSecure = U
                    }, null, 8, _u), [
                      [ge, b.smtpSecure]
                    ]),
                    S[6] || (S[6] = e("span", null, "SSL（465）", -1))
                  ])
                ]),
                e("label", yu, [
                  e("span", null, n(t(s)("mcp.username")), 1),
                  D(e("input", {
                    "onUpdate:modelValue": (U) => b.smtpUser = U,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, ku), [
                    [J, b.smtpUser]
                  ])
                ]),
                e("label", wu, [
                  e("span", null, n(t(s)("mcp.password")), 1),
                  D(e("input", {
                    "onUpdate:modelValue": (U) => b.smtpPassword = U,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, $u), [
                    [J, b.smtpPassword]
                  ])
                ]),
                e("div", Su, [
                  e("label", Cu, [
                    e("span", null, n(t(s)("mcp.from")), 1),
                    D(e("input", {
                      "onUpdate:modelValue": (U) => b.from = U,
                      placeholder: t(s)("mcp.fromPlaceholder"),
                      autocomplete: "off"
                    }, null, 8, Pu), [
                      [J, b.from]
                    ])
                  ]),
                  e("label", xu, [
                    e("span", null, n(t(s)("mcp.fromName")), 1),
                    D(e("input", {
                      "onUpdate:modelValue": (U) => b.fromName = U,
                      placeholder: "0KAY",
                      autocomplete: "off"
                    }, null, 8, Mu), [
                      [J, b.fromName]
                    ])
                  ])
                ])
              ])
            ])
          ], 64))
        ], 2))), 128)),
        h.value.length ? N("", !0) : (r(), p("p", Eu, n(t(s)("mcp.emptyServers")), 1))
      ]))
    ]));
  }
}), Tu = /* @__PURE__ */ Pe(Uu, [["__scopeId", "data-v-60e55840"]]), Au = { class: "content-card danger" }, Iu = { class: "card-desc" }, Vu = { class: "danger-box" }, Nu = ["disabled"], Ru = /* @__PURE__ */ he({
  __name: "DangerPanel",
  setup(y) {
    const { t: s } = ve(), h = lt(), c = Bt(), { confirm: _ } = We(), C = x(!1);
    async function u() {
      if (!(C.value || !await _({
        title: s("settings.reset"),
        message: s("settings.resetConfirmMsg"),
        confirmLabel: s("settings.reset"),
        danger: !0
      }))) {
        C.value = !0;
        try {
          h.resetWizard(), c.push("/");
        } finally {
          C.value = !1;
        }
      }
    }
    return (w, P) => (r(), p("div", Au, [
      e("h2", null, n(t(s)("settings.tabs.danger")), 1),
      e("p", Iu, n(t(s)("settings.resetDesc")), 1),
      e("div", Vu, [
        e("div", null, [
          e("strong", null, n(t(s)("settings.reset")), 1),
          e("p", null, n(t(s)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          disabled: C.value,
          onClick: u
        }, n(t(s)("settings.reset")), 9, Nu)
      ])
    ]));
  }
}), Lu = {
  key: 1,
  class: "plugin-pane-message"
}, Ou = {
  key: 2,
  class: "plugin-pane-message"
}, Du = /* @__PURE__ */ he({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(y) {
    const { t: s } = ve(), h = y, c = It(null), _ = It("");
    let C = 0;
    return He(
      () => h.module,
      async (u) => {
        if (!u) {
          c.value = null, _.value = "";
          return;
        }
        const w = ++C;
        try {
          const P = await import(
            /* @vite-ignore */
            u
          );
          if (w !== C) return;
          c.value = P?.default || P, _.value = "";
        } catch (P) {
          if (w !== C) return;
          c.value = null, _.value = P?.message || String(P);
        }
      },
      { immediate: !0 }
    ), (u, w) => c.value ? (r(), me(is(c.value), { key: 0 })) : _.value ? (r(), p("div", Lu, n(_.value), 1)) : (r(), p("div", Ou, n(t(s)("pluginPane.loading")), 1));
  }
}), zu = /* @__PURE__ */ Pe(Du, [["__scopeId", "data-v-32ca9ff2"]]), Fu = { class: "pp-head" }, Bu = ["aria-label", "disabled"], Ku = { class: "pp-roots" }, Hu = ["onClick"], ju = ["placeholder"], Yu = ["aria-busy"], Xu = {
  key: 0,
  class: "pp-empty"
}, Ju = {
  key: 1,
  class: "pp-empty pp-error"
}, Wu = {
  key: 2,
  class: "pp-empty"
}, qu = ["title", "onClick"], Gu = { class: "pp-name" }, Zu = ["title"], Qu = { class: "pp-foot" }, ep = ["disabled"], tp = ["disabled"], sp = /* @__PURE__ */ he({
  __name: "PathPicker",
  props: {
    open: { type: Boolean },
    initial: {},
    title: {}
  },
  emits: ["update:open", "pick"],
  setup(y, { emit: s }) {
    const h = y, c = s, { t: _ } = ve(), C = x(""), u = x(""), w = x([]), P = x([]), i = x(!1), o = x(""), l = x(""), a = x(!1);
    let d = "";
    async function m(V) {
      i.value = !0, o.value = "";
      try {
        const I = await fetch(`/api/agent/workspace?path=${encodeURIComponent(V || "")}`);
        if (!I.ok) {
          const T = await I.json().catch(() => ({}));
          o.value = T?.error || `HTTP ${I.status}`;
          return;
        }
        const M = await I.json();
        C.value = String(M?.path || ""), u.value = String(M?.parent || ""), w.value = Array.isArray(M?.roots) ? M.roots.map(String) : [], P.value = Array.isArray(M?.directories) ? M.directories.map((T) => ({ name: String(T?.name || ""), path: String(T?.path || "") })) : [], l.value = C.value, d = C.value;
      } catch (I) {
        o.value = I instanceof Error ? I.message : String(I);
      } finally {
        i.value = !1;
      }
    }
    He(
      () => h.open,
      (V) => {
        if (!V) return;
        o.value = "";
        const I = (h.initial || "").trim() || d;
        l.value = I, m(I);
      },
      { immediate: !0 }
    );
    function S() {
      c("update:open", !1);
    }
    function b() {
      const V = (C.value || l.value).trim();
      V && (c("pick", V), S());
    }
    function E(V) {
      m(V.path);
    }
    function U() {
      u.value && u.value !== C.value && m(u.value);
    }
    async function H() {
      if (!a.value) {
        a.value = !0, o.value = "";
        try {
          const V = await fetch(`/api/agent/pick-folder?title=${encodeURIComponent(h.title || _("settings.pathPickTitle"))}`);
          if (V.ok) {
            const I = await V.json().catch(() => ({}));
            I?.path && (c("pick", String(I.path)), S());
          }
        } catch (V) {
          o.value = V instanceof Error ? V.message : String(V);
        } finally {
          a.value = !1;
        }
      }
    }
    return (V, I) => (r(), me(t(bs), {
      open: y.open,
      title: y.title || t(_)("settings.pathPickTitle"),
      "on-dismiss": S,
      "initial-focus": "first",
      "panel-class": "path-picker-panel"
    }, {
      default: et(() => [
        e("header", Fu, [
          e("h2", null, n(y.title || t(_)("settings.pathPickTitle")), 1),
          e("button", {
            class: "pp-icon",
            type: "button",
            "aria-label": t(_)("settings.pathUp"),
            disabled: i.value,
            onClick: U
          }, "↑", 8, Bu)
        ]),
        e("div", Ku, [
          (r(!0), p(G, null, de(w.value, (M) => (r(), p("button", {
            key: M,
            class: le(["pp-root", { "is-active": C.value === M }]),
            type: "button",
            onClick: (T) => m(M)
          }, n(M), 11, Hu))), 128))
        ]),
        D(e("input", {
          "onUpdate:modelValue": I[0] || (I[0] = (M) => l.value = M),
          class: "input pp-path",
          placeholder: t(_)("settings.pathPlaceholder"),
          spellcheck: "false",
          onKeydown: I[1] || (I[1] = mt(Re((M) => m(l.value), ["prevent"]), ["enter"]))
        }, null, 40, ju), [
          [J, l.value]
        ]),
        e("div", {
          class: "pp-list",
          role: "listbox",
          "aria-busy": i.value
        }, [
          i.value ? (r(), p("p", Xu, n(t(_)("settings.pathLoading")), 1)) : o.value ? (r(), p("p", Ju, n(o.value), 1)) : P.value.length ? (r(!0), p(G, { key: 3 }, de(P.value, (M) => (r(), p("button", {
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
            e("span", Gu, n(M.name), 1)
          ], 8, qu))), 128)) : (r(), p("p", Wu, n(t(_)("settings.pathEmpty")), 1))
        ], 8, Yu),
        e("p", {
          class: "pp-current",
          title: C.value
        }, n(t(_)("settings.pathSelected", { path: C.value || l.value || "—" })), 9, Zu),
        e("footer", Qu, [
          e("button", {
            class: "btn btn-text",
            type: "button",
            disabled: a.value,
            onClick: H
          }, n(a.value ? t(_)("settings.pathNativeBusy") : t(_)("settings.pathNative")), 9, ep),
          I[3] || (I[3] = e("span", { class: "pp-spacer" }, null, -1)),
          e("button", {
            class: "btn btn-text",
            type: "button",
            onClick: S
          }, n(t(_)("settings.cancel")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: i.value || !(C.value || l.value),
            onClick: b
          }, n(t(_)("settings.pathUse")), 9, tp)
        ])
      ]),
      _: 1
    }, 8, ["open", "title"]));
  }
}), np = /* @__PURE__ */ Pe(sp, [["__scopeId", "data-v-580db486"]]), st = x([]);
let lp = 0;
const vt = /* @__PURE__ */ new Map();
function op(y) {
  const s = vt.get(y);
  s && clearTimeout(s), vt.delete(y), st.value = st.value.filter((h) => h.id !== y);
}
function Dt(y, s = "info", h) {
  const c = {
    id: ++lp,
    kind: s,
    message: y,
    duration: s === "error" ? 6500 : 3500
  };
  return st.value = [...st.value.slice(-4), c], vt.set(c.id, setTimeout(() => op(c.id), c.duration)), c.id;
}
function ap() {
  const { t: y } = ve(), { confirm: s } = We(), h = lt(), c = _s(), _ = Ft(), C = ks(), u = Bt(), w = Z(() => _.settingsTabs.map((R) => ({
    id: R.id,
    icon: R.icon || "chip"
  }))), P = Z(() => {
    const R = new Set(_.settingsTabs.map((v) => v.id)), X = new Set(_.removedSettingsIds);
    return c.sections.filter((v) => v.id !== "permissions" && !R.has(v.id) && !X.has(v.id)).map((v) => ({ id: v.id, icon: v.icon || "lock" }));
  }), i = Z(() => [...w.value, ...P.value]), o = Z(() => [
    { id: "core", label: y("settings.groupCore"), tabs: w.value },
    { id: "plugins", label: y("settings.groupPlugins"), tabs: P.value }
  ].filter((R) => R.tabs.length)), l = x(C.query.tab || "general"), a = x(!1), d = x([]), m = x(""), S = x({}), b = x(""), E = x("ok"), U = x(!1), H = x(!1), V = x(""), I = x(!1), M = x([]), T = Z(() => y("settings.modelAuto")), q = Z(() => [
    { value: "", label: T.value },
    ...M.value.map((R) => ({ value: R, label: R }))
  ]);
  async function ce() {
    try {
      const R = await fetch("/api/models");
      if (!R.ok) return;
      const X = await R.json();
      M.value = Array.from(new Set((X.models || []).map((v) => String(v.id || "")).filter(Boolean)));
    } catch {
    }
  }
  async function oe(R) {
    H.value = !0, V.value = "";
    try {
      const X = await fetch(`/api/settings/${R}/test`, { method: "POST" }), v = X.headers.get("content-type") || "";
      if (X.ok && v.startsWith("audio")) {
        const g = URL.createObjectURL(await X.blob());
        try {
          await new Audio(g).play();
        } catch {
        }
        window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: g } })), V.value = y("settings.testSuccess");
      } else {
        const g = await X.json().catch(() => ({}));
        V.value = g.error || `HTTP ${X.status}`;
      }
    } catch (X) {
      V.value = X instanceof Error ? X.message : String(X);
    } finally {
      H.value = !1;
    }
  }
  const { tabMeta: F, isBuiltinTab: j, isPluginSection: K, tabLabel: z, fieldLabel: O, fieldHelp: xe, pluginSection: ye } = ft(), se = x(""), Te = Z({
    get: () => se.value !== "",
    set: (R) => {
      R || (se.value = "");
    }
  }), Me = Z(() => ye(l.value)?.fields.find((X) => X.key === se.value)?.label || ""), ae = Z(() => String(S.value[l.value]?.[se.value] ?? ""));
  function Ie(R) {
    const X = se.value;
    X && (S.value = {
      ...S.value,
      [l.value]: { ...S.value[l.value], [X]: R }
    });
  }
  const te = Z(() => j(l.value) ? null : F(l.value)?.module || null);
  function L(R) {
    if (F(R)?.fields?.length && !j(R)) {
      ee(R);
      return;
    }
    const v = ye(R);
    if (!v) return;
    const g = {};
    for (const W of v.fields)
      W.type !== "note" && (W.type === "bool" ? g[W.key] = W.default_value === "true" || W.default_value === "1" : W.type === "number" ? g[W.key] = Number(W.default_value || 0) : g[W.key] = W.default_value || "");
    const $ = c.values[R] || {}, Y = { ...g };
    for (const W of v.fields) {
      if (!(W.key in $)) continue;
      const pe = $[W.key];
      W.type === "bool" ? Y[W.key] = pe === !0 || pe === "true" || pe === 1 || pe === "1" : Y[W.key] = pe;
    }
    S.value = {
      ...S.value,
      [R]: Y
    };
  }
  async function ee(R) {
    const X = F(R);
    if (!X?.fields?.length) return;
    const v = {};
    for (const g of X.fields)
      g.type === "bool" ? v[g.key] = g.default_value === "true" || g.default_value === "1" : g.type === "number" ? v[g.key] = Number(g.default_value || 0) : v[g.key] = g.default_value || "";
    if (X.loadApi)
      try {
        const g = await fetch(X.loadApi);
        if (g.ok) {
          const $ = await g.json();
          for (const Y of X.fields) {
            if (!(Y.key in $)) continue;
            const W = $[Y.key];
            Y.type === "bool" ? v[Y.key] = W === !0 || W === "true" || W === 1 || W === "1" : v[Y.key] = W;
          }
        }
      } catch {
      }
    S.value = { ...S.value, [R]: v };
  }
  async function be(R) {
    const X = F(R);
    if (!U.value) {
      U.value = !0, b.value = "";
      try {
        const v = S.value[R] || {};
        if (X?.saveApi) {
          const g = await fetch(X.saveApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(v)
          });
          if (!g.ok) throw new Error(String(g.status));
        }
        b.value = y("settings.saved"), E.value = "ok", setTimeout(() => {
          b.value = "";
        }, 3e3);
      } catch {
        b.value = y("settings.permFailed"), E.value = "error";
      } finally {
        U.value = !1;
      }
    }
  }
  async function ke(R) {
    if (!U.value) {
      U.value = !0, b.value = "";
      try {
        const X = new Set((ye(R)?.fields || []).filter((g) => g.type === "note").map((g) => g.key)), v = Object.fromEntries(
          Object.entries(S.value[R] || {}).filter(([g]) => !X.has(g))
        );
        await c.saveValues(R, v), b.value = y("settings.saved"), E.value = "ok", setTimeout(() => {
          b.value = "";
        }, 3e3);
      } catch {
        b.value = y("settings.permFailed"), E.value = "error";
      } finally {
        U.value = !1;
      }
    }
  }
  async function ue() {
    try {
      const R = await fetch("/api/live2d");
      if (R.ok) {
        const X = await R.json();
        d.value = X.models || [];
      }
    } catch {
      d.value = [];
    }
  }
  async function _e(R) {
    if (await s({
      title: y("settings.live2d"),
      message: y("settings.deleteModelConfirm", { label: R.label }),
      confirmLabel: y("common.delete"),
      danger: !0
    }))
      try {
        const v = await fetch(`/api/live2d/${encodeURIComponent(R.id)}`, { method: "DELETE" });
        if (!v.ok) throw new Error(await v.text());
        const g = await v.json();
        d.value = g.models || [];
        const $ = R.url.slice(0, R.url.indexOf("/", 15) + 1);
        h.live2d.modelUrl.startsWith($) && (h.live2d.modelUrl = "", h.live2d.enabled = !1, h.saveToStorage()), await Ee(), m.value = y("settings.modelDeleted"), window.dispatchEvent(new Event("live2d-models-changed"));
      } catch (v) {
        m.value = v.message;
      }
  }
  async function Ee() {
    h.saveToStorage();
    const R = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: h.live2d.enabled, model_url: h.live2d.modelUrl } }) });
    if (!R.ok) throw new Error(await R.text());
  }
  async function Be() {
    if (!I.value) {
      I.value = !0, m.value = "";
      try {
        await Ee(), m.value = y("settings.saved"), setTimeout(() => {
          m.value === y("settings.saved") && (m.value = "");
        }, 3e3);
      } catch (R) {
        m.value = R.message, Dt(y("settings.permFailed"), "error");
      } finally {
        I.value = !1;
      }
    }
  }
  async function Ve(R) {
    if (!(!R || R.length === 0)) {
      m.value = "";
      try {
        const X = new FormData(), v = [];
        for (const Y of Array.from(R)) {
          const W = Y.webkitRelativePath || Y.name;
          v.push(W), X.append("files", Y, Y.name);
        }
        X.append("paths", JSON.stringify(v));
        const g = await fetch("/api/live2d", { method: "POST", body: X });
        if (!g.ok) throw new Error(await g.text());
        const $ = await g.json();
        m.value = y("settings.uploadOk"), $?.models ? d.value = $.models : await ue(), $?.model_url && (h.live2d.modelUrl = $.model_url, h.live2d.enabled = !0, h.saveToStorage(), await Ee(), window.dispatchEvent(new Event("live2d-models-changed")));
      } catch (X) {
        m.value = `${y("settings.uploadFail")}：${X.message}`;
      }
    }
  }
  Ue(async () => {
    h.loadFromStorage(), ue(), ce(), await c.fetchSections();
    for (const R of c.sections) L(R.id);
    c.sections.length && !i.value.some((R) => R.id === l.value) && !j(l.value) && (l.value = "general");
  });
  function Ke(R) {
    l.value = R, j(R) || L(R), u.replace({ query: { tab: R } });
  }
  function $e() {
    if (h.saveToStorage(), l.value === "live2d") {
      Ee().then(() => {
        a.value = !0, setTimeout(() => {
          a.value = !1;
        }, 1500);
      }).catch((R) => {
        m.value = R.message, Dt(y("settings.permFailed"), "error");
      });
      return;
    }
    a.value = !0, setTimeout(() => {
      a.value = !1;
    }, 1500);
  }
  return {
    wizard: h,
    sectionsStore: c,
    uiPatches: _,
    route: C,
    router: u,
    tabs: w,
    pluginOnlyTabs: P,
    allTabs: i,
    navGroups: o,
    activeTab: l,
    saved: a,
    uploadedModels: d,
    uploadMsg: m,
    sectionDrafts: S,
    sectionMsg: b,
    sectionMsgKind: E,
    sectionSaving: U,
    sectionTesting: H,
    sectionTestMsg: V,
    live2dSaving: I,
    availableModels: M,
    modelAutoLabel: T,
    modelOptions: q,
    loadAvailableModels: ce,
    testPluginSection: oe,
    pickerField: se,
    pickerOpen: Te,
    pickerTitle: Me,
    pickerInitial: ae,
    applyPickedPath: Ie,
    moduleTab: te,
    loadSectionDraft: L,
    loadPatchFields: ee,
    savePatchFields: be,
    saveSection: ke,
    loadUploadedModels: ue,
    deleteModel: _e,
    saveLive2D: Ee,
    saveLive2DNow: Be,
    onFolderSelected: Ve,
    selectTab: Ke,
    save: $e,
    t: y,
    confirm: s,
    tabMeta: F,
    isBuiltinTab: j,
    isPluginSection: K,
    tabLabel: z,
    fieldLabel: O,
    fieldHelp: xe,
    pluginSection: ye
  };
}
const ip = { class: "settings-page" }, rp = { class: "page-header" }, dp = { class: "subtitle" }, cp = { key: 0 }, up = { key: 1 }, pp = { class: "settings-layout" }, hp = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, vp = { class: "nav-group" }, mp = ["aria-current", "data-tab-id", "title", "aria-label", "onClick"], fp = {
  class: "nav-icon",
  "aria-hidden": "true"
}, gp = { class: "nav-label" }, bp = { class: "settings-content" }, _p = {
  key: "provider",
  class: "tab-stack"
}, yp = {
  key: 0,
  class: "content-card provider-runtime"
}, kp = {
  key: 0,
  class: "helper-text"
}, wp = { class: "actions-row" }, $p = ["disabled"], Sp = {
  key: 0,
  class: "card-desc"
}, Cp = {
  key: 1,
  class: "helper-text"
}, Pp = { class: "actions-row" }, xp = ["disabled"], Mp = {
  key: 0,
  class: "helper-text"
}, Ep = {
  key: 0,
  class: "helper-text"
}, Up = { class: "actions-row" }, Tp = ["disabled"], Ap = {
  key: 0,
  class: "card-desc"
}, Ip = {
  key: 1,
  class: "card-desc"
}, Vp = { class: "actions-row" }, Np = ["disabled"], Rp = {
  key: "unknown",
  class: "content-card tab-unknown"
}, Bp = /* @__PURE__ */ he({
  __name: "SettingsPage",
  setup(y) {
    const {
      wizard: s,
      navGroups: h,
      activeTab: c,
      saved: _,
      uploadedModels: C,
      uploadMsg: u,
      sectionDrafts: w,
      sectionMsg: P,
      sectionMsgKind: i,
      sectionSaving: o,
      sectionTesting: l,
      sectionTestMsg: a,
      live2dSaving: d,
      availableModels: m,
      modelOptions: S,
      testPluginSection: b,
      pickerField: E,
      pickerOpen: U,
      pickerTitle: H,
      pickerInitial: V,
      applyPickedPath: I,
      moduleTab: M,
      savePatchFields: T,
      saveSection: q,
      deleteModel: ce,
      saveLive2DNow: oe,
      onFolderSelected: F,
      selectTab: j,
      save: K,
      t: z,
      tabMeta: O,
      isBuiltinTab: xe,
      isPluginSection: ye,
      tabLabel: se,
      fieldLabel: Te,
      fieldHelp: Me,
      pluginSection: ae
    } = ap();
    return (Ie, te) => (r(), p("div", ip, [
      e("header", rp, [
        e("div", null, [
          e("h1", null, n(t(z)("settings.title")), 1),
          e("p", dp, n(t(z)("settings.pageDesc")), 1)
        ]),
        t(c) === "persona" || t(c) === "live2d" ? (r(), p("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: te[0] || (te[0] = //@ts-ignore
          (...L) => t(K) && t(K)(...L))
        }, [
          t(_) ? (r(), p("span", cp, n(t(z)("settings.saved")), 1)) : (r(), p("span", up, n(t(z)("settings.save")), 1))
        ])) : N("", !0)
      ]),
      e("div", pp, [
        e("nav", hp, [
          (r(!0), p(G, null, de(t(h), (L) => (r(), p(G, {
            key: L.id
          }, [
            e("p", vp, n(L.label), 1),
            (r(!0), p(G, null, de(L.tabs, (ee) => (r(), p("button", {
              key: ee.id,
              class: le(["nav-item", { active: t(c) === ee.id }]),
              "aria-current": t(c) === ee.id ? "true" : void 0,
              "data-tab-id": ee.id,
              title: t(se)(ee.id),
              "aria-label": t(se)(ee.id),
              onClick: (be) => t(j)(ee.id)
            }, [
              te[8] || (te[8] = e("span", { class: "nav-indicator" }, null, -1)),
              e("span", fp, [
                fe(t(ys), {
                  name: ee.icon || "chip",
                  size: 20
                }, null, 8, ["name"])
              ]),
              e("span", gp, n(t(se)(ee.id)), 1)
            ], 10, mp))), 128))
          ], 64))), 128))
        ]),
        e("section", bp, [
          fe(rs, {
            name: "tab",
            mode: "out-in"
          }, {
            default: et(() => [
              t(c) === "general" ? (r(), me(rr, { key: "general" })) : t(c) === "connection" ? (r(), me(dd, { key: "connection" })) : t(c) === "provider" ? (r(), p("div", _p, [
                fe(Xi),
                t(ae)("provider")?.fields?.length ? (r(), p("div", yp, [
                  e("h3", null, n(t(ae)("provider").label), 1),
                  t(ae)("provider").description ? (r(), p("p", kp, n(t(ae)("provider").description), 1)) : N("", !0),
                  (r(!0), p(G, null, de(t(ae)("provider").fields, (L) => (r(), me(ht, {
                    key: L.key,
                    field: L,
                    label: L.label,
                    help: L.help,
                    "model-value": t(w).provider?.[L.key],
                    "section-id": "provider",
                    "model-options": t(S),
                    "available-models": t(m),
                    "onUpdate:modelValue": (ee) => w.value = { ...t(w), provider: { ...t(w).provider, [L.key]: ee } },
                    onBrowse: (ee) => E.value = L.key
                  }, null, 8, ["field", "label", "help", "model-value", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                  t(P) ? (r(), p("div", {
                    key: 1,
                    class: le(["helper-text", t(i) === "error" ? "msg-error" : "msg-success"]),
                    role: "status"
                  }, n(t(P)), 3)) : N("", !0),
                  e("div", wp, [
                    e("button", {
                      class: "btn btn-primary",
                      type: "button",
                      disabled: t(o),
                      onClick: te[1] || (te[1] = (L) => t(q)("provider"))
                    }, n(t(z)("settings.save")), 9, $p)
                  ])
                ])) : N("", !0)
              ])) : t(c) === "persona" ? (r(), me(xd, { key: 3 })) : t(c) === "live2d" ? (r(), me(Js, {
                key: "live2d",
                enabled: t(s).live2d.enabled,
                "model-url": t(s).live2d.modelUrl,
                uploaded: t(C),
                msg: t(u),
                saving: t(d),
                "onUpdate:enabled": te[2] || (te[2] = (L) => t(s).live2d.enabled = L),
                "onUpdate:modelUrl": te[3] || (te[3] = (L) => t(s).live2d.modelUrl = L),
                onSave: t(oe),
                onUpload: t(F),
                onDelete: t(ce)
              }, null, 8, ["enabled", "model-url", "uploaded", "msg", "saving", "onSave", "onUpload", "onDelete"])) : t(c) === "security" ? (r(), me($c, { key: 5 })) : t(c) === "permissions" ? (r(), me(Dd, { key: 6 })) : t(c) === "mcp" ? (r(), me(Tu, { key: 7 })) : t(c) === "life_settings" ? (r(), me(gl, { key: 8 })) : t(ye)(t(c)) && t(ae)(t(c)) ? (r(), p("div", {
                key: `section-${t(c)}`,
                class: "content-card"
              }, [
                e("h2", null, n(t(ae)(t(c)).label), 1),
                t(ae)(t(c)).description ? (r(), p("p", Sp, n(t(ae)(t(c)).description), 1)) : N("", !0),
                t(ae)(t(c)).plugin_name && t(ae)(t(c)).plugin_name !== t(c) ? (r(), p("p", Cp, n(t(z)("settings.pluginProvidedBy", { name: t(ae)(t(c)).plugin_name })), 1)) : N("", !0),
                (r(!0), p(G, null, de(t(ae)(t(c)).fields.filter((L) => L.type !== "test"), (L) => (r(), me(ht, {
                  key: L.key,
                  field: L,
                  label: L.label,
                  help: L.help,
                  "model-value": t(w)[t(c)]?.[L.key],
                  "section-id": t(c),
                  "model-options": t(S),
                  "available-models": t(m),
                  "onUpdate:modelValue": (ee) => t(w)[t(c)] = { ...t(w)[t(c)], [L.key]: ee },
                  onBrowse: (ee) => E.value = L.key
                }, null, 8, ["field", "label", "help", "model-value", "section-id", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                (r(!0), p(G, null, de(t(ae)(t(c)).fields.filter((L) => L.type === "test"), (L) => (r(), p("div", {
                  key: L.key,
                  class: "field"
                }, [
                  e("label", null, n(L.label), 1),
                  e("div", Pp, [
                    e("button", {
                      class: "btn btn-tonal",
                      type: "button",
                      disabled: t(l),
                      onClick: te[4] || (te[4] = (ee) => t(b)(t(c)))
                    }, n(t(l) ? t(z)("settings.testing") : L.label || t(z)("settings.test")), 9, xp),
                    t(a) ? (r(), p("span", Mp, n(t(a)), 1)) : N("", !0)
                  ]),
                  L.help ? (r(), p("p", Ep, n(L.help), 1)) : N("", !0)
                ]))), 128)),
                t(P) ? (r(), p("div", {
                  key: 2,
                  class: le(["helper-text", t(i) === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, n(t(P)), 3)) : N("", !0),
                e("div", Up, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: t(o),
                    onClick: te[5] || (te[5] = (L) => t(q)(t(c)))
                  }, n(t(z)("settings.save")), 9, Tp)
                ])
              ])) : t(M) ? (r(), me(zu, {
                key: t(M),
                module: t(M) || ""
              }, null, 8, ["module"])) : !t(xe)(t(c)) && t(O)(t(c))?.fields?.length ? (r(), p("div", {
                key: `patch-${t(c)}`,
                class: "content-card"
              }, [
                e("h2", null, n(t(se)(t(c))), 1),
                t(O)(t(c))?.descriptionKey ? (r(), p("p", Ap, n(t(z)(t(O)(t(c)).descriptionKey)), 1)) : t(O)(t(c))?.description ? (r(), p("p", Ip, n(t(O)(t(c)).description), 1)) : N("", !0),
                (r(!0), p(G, null, de(t(O)(t(c)).fields, (L) => (r(), me(ht, {
                  key: L.key,
                  field: L,
                  label: t(Te)(t(O)(t(c)), L.key, `settings.${L.key}`),
                  help: t(Me)(t(O)(t(c)), L.key, `settings.${L.key}Desc`),
                  "model-value": t(w)[t(c)]?.[L.key],
                  "section-id": t(c),
                  "model-options": t(S),
                  "available-models": t(m),
                  "onUpdate:modelValue": (ee) => t(w)[t(c)] = { ...t(w)[t(c)], [L.key]: ee },
                  onBrowse: (ee) => E.value = L.key
                }, null, 8, ["field", "label", "help", "model-value", "section-id", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                t(P) ? (r(), p("div", {
                  key: 2,
                  class: le(["helper-text", t(i) === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, n(t(P)), 3)) : N("", !0),
                e("div", Vp, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: t(o),
                    onClick: te[6] || (te[6] = (L) => t(T)(t(c)))
                  }, n(t(z)("settings.save")), 9, Np)
                ])
              ])) : t(c) === "about" ? (r(), me(So, { key: "about" })) : t(c) === "updates" ? (r(), me(ma, { key: "updates" })) : t(c) === "danger" ? (r(), me(Ru, { key: "danger" })) : (r(), p("div", Rp, [
                e("p", null, n(t(z)("settings.tabNotFound")), 1)
              ]))
            ]),
            _: 1
          })
        ])
      ]),
      fe(np, {
        open: t(U),
        "onUpdate:open": te[7] || (te[7] = (L) => ds(U) ? U.value = L : null),
        initial: t(V),
        title: t(H),
        onPick: t(I)
      }, null, 8, ["open", "initial", "title", "onPick"])
    ]));
  }
});
export {
  Bp as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style-settings')){const s=document.createElement('style');s.id='webui-plugin-style-settings';s.textContent="@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage.bare[data-v-600df96a],.live2d-stage.bare .stage-viewport[data-v-600df96a]{background:none!important;border:0!important;border-radius:0!important;min-height:0}.live2d-stage.bare .stage-gradient[data-v-600df96a],.live2d-stage.bare .stage-hint[data-v-600df96a],.live2d-stage.bare .stage-reset[data-v-600df96a]{display:none!important}.live2d-stage[data-v-600df96a]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-600df96a]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-600df96a]:active{cursor:grabbing}.stage-canvas[data-v-600df96a]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-600df96a]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-600df96a]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-600df96a]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-600df96a]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-600df96a]:active{transform:scale(.96)}.stage-reset.dragging[data-v-600df96a]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-600df96a]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-600df96a]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-600df96a]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.life-settings[data-v-d91bdafc]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-d91bdafc]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-d91bdafc .52s var(--ls-spring) both}.ls-hero-main[data-v-d91bdafc]{min-width:0}.ls-eyebrow[data-v-d91bdafc]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-d91bdafc]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-d91bdafc]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-d91bdafc]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-d91bdafc]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-d91bdafc]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-d91bdafc]{font-size:16px}.ls-grid[data-v-d91bdafc]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-d91bdafc]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-d91bdafc .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-d91bdafc]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-d91bdafc]{grid-column:1 / -1}.ls-card-head[data-v-d91bdafc]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-d91bdafc]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-d91bdafc]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-d91bdafc]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d91bdafc]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d91bdafc]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-d91bdafc]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-d91bdafc]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-d91bdafc]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-d91bdafc]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-d91bdafc]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-d91bdafc]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-d91bdafc]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-d91bdafc]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-d91bdafc]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-d91bdafc]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-d91bdafc]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-d91bdafc]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-d91bdafc]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-d91bdafc]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-d91bdafc]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-d91bdafc]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-d91bdafc]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-d91bdafc]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-d91bdafc]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-d91bdafc]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-d91bdafc]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-d91bdafc]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-d91bdafc]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-d91bdafc]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-d91bdafc]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-d91bdafc]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-d91bdafc]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-d91bdafc]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}#app .ls-model[data-v-d91bdafc]{border-radius:20px}#app .ls-model.selected[data-v-d91bdafc]{border-radius:20px 20px 20px 8px}.ls-model b[data-v-d91bdafc]{font-size:13px;word-break:break-all}.ls-model span[data-v-d91bdafc]{font-size:12px;color:var(--md-on-surface-variant)}.ls-hint[data-v-d91bdafc]{margin:12px 0 0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.ls-state[data-v-d91bdafc]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-d91bdafc .32s var(--ls-spring) both}@keyframes ls-rise-d91bdafc{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-d91bdafc{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-d91bdafc],.ls-row[data-v-d91bdafc],.ls-models[data-v-d91bdafc]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-d91bdafc],.ls-card[data-v-d91bdafc],.ls-state[data-v-d91bdafc]{animation:none}}.about[data-v-2678e07b]{display:flex;flex-direction:column;gap:26px}.identity[data-v-2678e07b]{display:flex;align-items:center;gap:16px}.app-icon[data-v-2678e07b]{flex:none;width:56px;height:56px;filter:drop-shadow(0 6px 16px color-mix(in srgb,var(--md-primary) 25%,transparent))}.app-id[data-v-2678e07b]{flex:1;min-width:0}.app-id h2[data-v-2678e07b]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-2678e07b]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-2678e07b]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-2678e07b]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-2678e07b]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-2678e07b]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-2678e07b]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-2678e07b]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.credits[data-v-2678e07b]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-2678e07b]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-2678e07b]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-2678e07b]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-2678e07b]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-2678e07b]{font-size:16px;font-weight:650}.person-info .role[data-v-2678e07b]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-2678e07b]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-2678e07b]{margin-top:6px}.contribs[data-v-2678e07b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-2678e07b]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-2678e07b]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-2678e07b]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-2678e07b]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-2678e07b]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-2678e07b]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-2678e07b]{margin-left:auto}.status-chip[data-v-2678e07b]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-2678e07b]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-2678e07b]:hover{text-decoration:underline}.muted[data-v-2678e07b]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-2678e07b]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-2678e07b]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-hero.warn[data-v-2678e07b]{background:var(--md-warning-container);color:var(--md-on-warning-container);border-color:transparent}.us-hero.none[data-v-2678e07b]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-2678e07b]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-2678e07b]{flex:1;min-width:0}.us-hero-text b[data-v-2678e07b]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-2678e07b]{font-size:13px;opacity:.85}.us-hero-text em[data-v-2678e07b]{font-style:normal;font-weight:700}.us-hero-actions[data-v-2678e07b]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-2678e07b]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-2678e07b]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-2678e07b]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-2678e07b]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-2678e07b]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-2678e07b]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-apply-banner.failed[data-v-2678e07b]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-2678e07b]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-2678e07b]{font-weight:700}.us-apply-label[data-v-2678e07b]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-2678e07b]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-2678e07b]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-2678e07b]{animation:us-spin-2678e07b .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-2678e07b],.us-apply-banner.failed .us-spinner[data-v-2678e07b]{display:none}.us-apply-log[data-v-2678e07b],.us-apply-error[data-v-2678e07b]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-2678e07b{to{transform:rotate(360deg)}}.alert[data-v-2678e07b]{color:var(--md-error)}.updates[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-bc3fb39c]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-bc3fb39c]{display:flex;align-items:center;gap:12px}.us-ico[data-v-bc3fb39c]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-bc3fb39c]{flex:1;min-width:0}.us-title[data-v-bc3fb39c]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-bc3fb39c]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px}.us-tag[data-v-bc3fb39c]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-bc3fb39c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-bc3fb39c]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-bc3fb39c]{background:#ffdf9e;color:#4a3800}.us-source[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-bc3fb39c]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-bc3fb39c]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-bc3fb39c]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-bc3fb39c]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-bc3fb39c]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-bc3fb39c]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-bc3fb39c]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-bc3fb39c]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-bc3fb39c]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-bc3fb39c]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-bc3fb39c]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-bc3fb39c]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-bc3fb39c]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-bc3fb39c]{flex:1;min-width:0}.us-hero-text b[data-v-bc3fb39c]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-bc3fb39c]{font-size:13px;opacity:.85}.us-hero-text em[data-v-bc3fb39c]{font-style:normal;font-weight:700}.us-hero-actions[data-v-bc3fb39c]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-bc3fb39c]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-bc3fb39c]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-bc3fb39c]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-bc3fb39c]{font-weight:700}.us-apply-label[data-v-bc3fb39c]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-bc3fb39c]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-bc3fb39c]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-bc3fb39c]{animation:us-spin-bc3fb39c .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-bc3fb39c],.us-apply-banner.failed .us-spinner[data-v-bc3fb39c]{display:none}.us-apply-log[data-v-bc3fb39c],.us-apply-error[data-v-bc3fb39c]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-bc3fb39c{to{transform:rotate(360deg)}}.us-table[data-v-bc3fb39c]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-bc3fb39c]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-bc3fb39c]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-bc3fb39c]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-bc3fb39c]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden}.us-name-text[data-v-bc3fb39c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-bc3fb39c]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-bc3fb39c]{background:var(--md-success)}.us-dot.warn[data-v-bc3fb39c]{background:#e0a800}.us-dot.bad[data-v-bc3fb39c]{background:var(--md-error)}.us-ver[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-bc3fb39c]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-bc3fb39c]{font-weight:650}.us-ver b.good[data-v-bc3fb39c]{color:var(--md-success)}.us-arrow[data-v-bc3fb39c]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-bc3fb39c]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden}.us-status-text[data-v-bc3fb39c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-bc3fb39c]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-bc3fb39c]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-bc3fb39c]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-bc3fb39c]:hover{text-decoration:underline}.us-empty[data-v-bc3fb39c]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-bc3fb39c]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-bc3fb39c]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.alert[data-v-bc3fb39c]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-bc3fb39c]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-bc3fb39c]{display:none}.us-hero[data-v-bc3fb39c]{flex-wrap:wrap}.us-hero-actions[data-v-bc3fb39c]{width:100%}}.provider-panel[data-v-d10cd596]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-d10cd596]{display:flex;align-items:center;gap:14px}.pp-back[data-v-d10cd596]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-d10cd596]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-d10cd596]{flex:1;min-width:0}.pp-editor-title h2[data-v-d10cd596]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-d10cd596]{margin:3px 0 0}.pp-section[data-v-d10cd596]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-d10cd596]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-d10cd596]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-d10cd596]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-d10cd596]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-d10cd596]{margin-bottom:0}.pp-span[data-v-d10cd596]{grid-column:1 / -1}.pp-req[data-v-d10cd596]{color:var(--md-error);margin-left:2px}.pp-key[data-v-d10cd596]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-d10cd596]{flex:1}.pp-key-toggle[data-v-d10cd596]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-d10cd596]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-d10cd596]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-d10cd596]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-d10cd596]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-d10cd596]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-d10cd596]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-d10cd596]{animation:pp-pulse-d10cd596 1s ease-in-out infinite}@keyframes pp-pulse-d10cd596{50%{opacity:.15}}.pp-probe[data-v-d10cd596]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-d10cd596]{color:var(--md-success)}.pp-probe.err[data-v-d10cd596]{color:var(--md-error)}.pp-discovered[data-v-d10cd596]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-d10cd596]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-d10cd596]{flex:1;min-width:160px}.pp-mini[data-v-d10cd596]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-d10cd596]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-add-model[data-v-d10cd596]{display:flex;align-items:center;gap:8px;margin-top:8px}.pp-add-model .input[data-v-d10cd596]{flex:1;min-width:0}.pp-add-model .btn[data-v-d10cd596]{flex:none;white-space:nowrap}.pp-add-error[data-v-d10cd596]{color:var(--md-error)}.pp-remove[data-v-d10cd596]{flex:none;width:26px;height:26px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);font-size:17px;line-height:1;cursor:pointer}.pp-remove[data-v-d10cd596]:hover{background:color-mix(in srgb,var(--md-error) 14%,transparent);color:var(--md-error)}.pp-models[data-v-d10cd596]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-d10cd596]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-d10cd596]:first-child{border-top:0}.pp-model.off[data-v-d10cd596]{opacity:.5}.pp-model-name[data-v-d10cd596]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-d10cd596]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-d10cd596]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-d10cd596]{color:#e0a800;cursor:default}.pp-switch[data-v-d10cd596]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-d10cd596]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-d10cd596]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-d10cd596]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-d10cd596]{display:flex;gap:10px}.pp-list-head[data-v-d10cd596]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-d10cd596]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-d10cd596]{margin:3px 0 0}.pp-list-actions[data-v-d10cd596]{display:flex;gap:8px}.pp-cards[data-v-d10cd596]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:14px}.pp-kinds[data-v-d10cd596]{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 12px}.pp-kind[data-v-d10cd596]{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);font-size:13px;font-weight:600;line-height:1}.pp-kind[data-v-d10cd596]:hover{border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));color:var(--md-on-surface)}.pp-kind.active[data-v-d10cd596]{background:var(--md-secondary-container);border-color:transparent;color:var(--md-on-secondary-container)}.pp-kind-count[data-v-d10cd596]{min-width:18px;padding:1px 5px;border-radius:999px;background:color-mix(in srgb,currentColor 12%,transparent);font-size:11px;font-weight:700;text-align:center}.pp-card[data-v-d10cd596]{display:flex;flex-direction:column;gap:12px;padding:16px;min-width:0;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-d10cd596]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-d10cd596]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-d10cd596]{opacity:.62}.pp-card-head[data-v-d10cd596]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-d10cd596]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-d10cd596]{width:26px;height:26px}.pp-card-id[data-v-d10cd596]{flex:1;min-width:0}.pp-card-id strong[data-v-d10cd596]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-d10cd596]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-d10cd596]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-d10cd596]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-d10cd596]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-d10cd596]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-d10cd596]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-d10cd596]{color:var(--md-error)}.pp-chips[data-v-d10cd596]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-d10cd596]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-d10cd596],.pp-chip.empty[data-v-d10cd596]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-d10cd596]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.pp-empty[data-v-d10cd596]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-d10cd596],.pp-cards[data-v-d10cd596]{grid-template-columns:1fr}}.pairing-panel[data-v-67a1ff9e]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-67a1ff9e]{margin:12px 0;color:var(--md-on-surface-variant)}.pairing-panel .pairing-error[data-v-67a1ff9e]{color:var(--md-error)}article[data-v-67a1ff9e]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-67a1ff9e]{font-size:24px;letter-spacing:4px}h4[data-v-67a1ff9e]{margin:18px 0 0}.pairing-list[data-v-67a1ff9e]{position:relative}.pair-enter-active[data-v-67a1ff9e],.pair-leave-active[data-v-67a1ff9e]{transition:opacity var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out)}.pair-enter-from[data-v-67a1ff9e],.pair-leave-to[data-v-67a1ff9e]{opacity:0;transform:translateY(4px)}.pair-leave-active[data-v-67a1ff9e]{position:absolute;width:100%}.pair-move[data-v-67a1ff9e]{transition:transform var(--duration-medium) var(--ease-out)}@media(prefers-reduced-motion:reduce){.pair-enter-active[data-v-67a1ff9e],.pair-leave-active[data-v-67a1ff9e],.pair-move[data-v-67a1ff9e]{transition-duration:1ms}}.models-field[data-v-b6ad9d20]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-b6ad9d20]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-b6ad9d20]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-b6ad9d20]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-b6ad9d20]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-b6ad9d20]{display:inline-flex;gap:4px}.models-actions button[data-v-b6ad9d20]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-b6ad9d20]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-b6ad9d20]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-b6ad9d20]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.connection-grid[data-v-d9b226f0]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,264px);gap:24px;align-items:start}@media(max-width:1000px){.connection-grid[data-v-d9b226f0]{grid-template-columns:minmax(0,1fr)}}.connection-form .field[data-v-d9b226f0]{margin-bottom:12px}.connection-qr[data-v-d9b226f0]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-d9b226f0]{background:#fff;border-radius:8px;padding:6px;width:100%;max-width:264px;height:auto}.connection-link[data-v-d9b226f0]{max-width:100%;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.helper-text[data-v-d9b226f0]{overflow-wrap:anywhere}.toggle-label[data-v-d9b226f0]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-8a0a3d8d]{max-width:920px}.sec-stack[data-v-8a0a3d8d]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-8a0a3d8d]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-8a0a3d8d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-8a0a3d8d]{font-size:15px;font-weight:700}.sec-chip[data-v-8a0a3d8d]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-8a0a3d8d]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-8a0a3d8d]{margin:2px 0 12px}.sec-pin-grid[data-v-8a0a3d8d]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-8a0a3d8d]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-8a0a3d8d]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-8a0a3d8d]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-8a0a3d8d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-8a0a3d8d]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-8a0a3d8d]:hover{background:var(--md-surface-container)}.page-item[data-v-8a0a3d8d]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-8a0a3d8d]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-8a0a3d8d]{width:44px;height:26px}.page-item .toggle-slider[data-v-8a0a3d8d]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-8a0a3d8d]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-8a0a3d8d]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-8a0a3d8d]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-8a0a3d8d]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-8a0a3d8d]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-8a0a3d8d]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-8a0a3d8d]{margin-top:12px}.sec-error[data-v-8a0a3d8d]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-8a0a3d8d]{grid-template-columns:1fr}}.mcp-panel[data-v-60e55840]{max-width:900px}.mcp-head[data-v-60e55840]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-60e55840]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-60e55840]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-60e55840]{display:flex;gap:10px}.error-banner[data-v-60e55840]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-60e55840]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-60e55840]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-60e55840]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-60e55840]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-60e55840]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-60e55840]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-60e55840]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-60e55840]{flex:1}.mcp-field>span[data-v-60e55840]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-60e55840],.mcp-field select[data-v-60e55840],.mcp-field textarea[data-v-60e55840]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-60e55840]{opacity:.7}.mcp-field textarea[data-v-60e55840]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-60e55840]:focus,.mcp-field select[data-v-60e55840]:focus,.mcp-field textarea[data-v-60e55840]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-60e55840]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-60e55840]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-60e55840]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-60e55840]{font-family:ui-monospace,monospace}.mail-grid[data-v-60e55840]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-60e55840]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-60e55840]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-60e55840]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-60e55840]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-60e55840]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-60e55840]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-60e55840]:disabled{opacity:.6;cursor:not-allowed}#app .mcp-panel[data-v-60e55840] :is(.btn,.mcp-remove){border-radius:999px}#app .mcp-panel .mcp-field[data-v-60e55840] :is(input,select,textarea){border-radius:12px}@media(max-width:720px){.mail-grid[data-v-60e55840]{grid-template-columns:1fr}}.plugin-pane-message[data-v-32ca9ff2]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.pp-head[data-v-580db486]{display:flex;align-items:center;justify-content:space-between;gap:8px}.pp-head h2[data-v-580db486]{margin:0;font-size:18px}.pp-icon[data-v-580db486]{width:32px;height:32px;border-radius:50%;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);font-size:15px;cursor:pointer}.pp-icon[data-v-580db486]:disabled{opacity:.45;cursor:not-allowed}.pp-roots[data-v-580db486]{display:flex;flex-wrap:wrap;gap:6px}.pp-root[data-v-580db486]{padding:4px 10px;border-radius:999px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface-variant);font-size:12px;font-family:monospace;cursor:pointer}.pp-root.is-active[data-v-580db486]{border-color:var(--md-primary);color:var(--md-primary)}.pp-path[data-v-580db486]{font-family:monospace;font-size:13px}.pp-list[data-v-580db486]{display:flex;flex-direction:column;gap:2px;min-height:180px;max-height:42vh;overflow:auto;padding:6px;border-radius:14px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest, var(--md-surface))}.pp-item[data-v-580db486]{display:flex;align-items:center;gap:8px;padding:7px 10px;border:0;border-radius:10px;background:none;color:var(--md-on-surface);font-size:13px;text-align:left;cursor:pointer}.pp-item[data-v-580db486]:hover,.pp-item[data-v-580db486]:focus-visible{background:var(--md-surface-container-high);outline:none}.pp-folder[data-v-580db486]{color:var(--md-primary);font-size:13px;line-height:1;opacity:.85}.pp-name[data-v-580db486]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-empty[data-v-580db486]{margin:0;padding:24px 8px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.pp-error[data-v-580db486]{color:var(--md-error, #b3261e)}.pp-current[data-v-580db486]{margin:0;font-family:monospace;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-foot[data-v-580db486]{display:flex;align-items:center;gap:8px}.pp-spacer[data-v-580db486]{flex:1}\n";document.head.appendChild(s)}})();
