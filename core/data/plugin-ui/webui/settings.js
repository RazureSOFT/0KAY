var Qt = Object.defineProperty;
var es = (F, s, v) => s in F ? Qt(F, s, { enumerable: !0, configurable: !0, writable: !0, value: v }) : F[s] = v;
var W = (F, s, v) => es(F, typeof s != "symbol" ? s + "" : s, v);
import { defineComponent as pe, ref as x, computed as G, onMounted as Ne, onUnmounted as lt, watch as Xe, openBlock as o, createElementBlock as r, normalizeClass as ee, createElementVNode as e, unref as t, normalizeStyle as At, toDisplayString as l, createCommentVNode as R, withModifiers as Oe, nextTick as ts, reactive as ss, createTextVNode as Ie, withDirectives as B, vModelCheckbox as ce, vModelText as Y, Fragment as X, renderList as oe, withKeys as mt, createStaticVNode as ls, createVNode as ae, vModelDynamic as ns, TransitionGroup as Tt, withCtx as et, vModelSelect as os, shallowRef as It, createBlock as ke, resolveDynamicComponent as as, Transition as is } from "vue";
import { useRouter as Bt, useRoute as rs } from "vue-router";
import { useI18n as ve } from "vue-i18n";
import { useLifeStore as us, useWizardStore as nt, live2dRuntimeReady as cs, apiGet as Fe, apiPost as tt, ApiError as Ft, useConfirm as Ge, useProvidersStore as ds, PROVIDERS as pt, AppSelect as De, getLanguage as ps, LOCALES as hs, setLanguage as vs, useSettingsMeta as gt, useUIPatchesStore as Kt, PinInput as Nt, ModalShell as ms, useSettingsSectionsStore as gs, DEFAULT_LIVE2D_MODELS as fs, MarkdownContent as _s } from "@0kay/host";
const bs = ["title"], ys = {
  key: 0,
  class: "stage-placeholder"
}, ks = {
  key: 1,
  class: "stage-status"
}, ws = {
  key: 2,
  class: "stage-status warn"
}, $s = ["title", "aria-label"], Ss = { class: "stage-hint" }, Vt = "0kay.web.live2d.resetbtn", Cs = "0kay.web.live2d.transform.", xs = /* @__PURE__ */ pe({
  __name: "Live2DStage",
  setup(F) {
    const { t: s } = ve(), v = us(), m = nt(), k = x(null), w = x(null), h = x(""), $ = x("idle"), V = x(""), u = G(() => m.live2d.enabled), c = G(() => m.live2d.modelUrl.trim()), n = G(() => v.emotionMood), a = G(() => {
      const g = String(n.value || "");
      if (!g) return "";
      const _ = `emotion.${g}`, L = s(_);
      return L === _ ? g : L;
    }), d = G(() => v.emotionColor), f = x([]);
    async function y() {
      try {
        const g = await fetch("/api/live2d");
        if (g.ok) {
          const _ = await g.json();
          f.value = _.models || [];
        }
      } catch {
        f.value = [];
      }
    }
    const p = x(null), M = x(U()), A = x(!1);
    let j = !1, O = { x: 0, y: 0 }, D = { x: 0, y: 0 };
    function U() {
      try {
        const g = localStorage.getItem(Vt);
        if (g) {
          const _ = JSON.parse(g);
          if (typeof _?.x == "number" && typeof _?.y == "number") return _;
        }
      } catch {
      }
      return null;
    }
    const I = G(() => M.value ? { left: `${M.value.x}px`, top: `${M.value.y}px`, right: "auto", bottom: "auto" } : {});
    function J(g) {
      A.value = !0, j = !1, O = { x: g.clientX, y: g.clientY };
      const _ = p.value?.getBoundingClientRect();
      D = { x: _?.left ?? 0, y: _?.top ?? 0 };
      try {
        p.value?.setPointerCapture(g.pointerId);
      } catch {
      }
    }
    function ie(g) {
      if (!A.value || !k.value) return;
      const _ = g.clientX - O.x, L = g.clientY - O.y;
      (Math.abs(_) > 3 || Math.abs(L) > 3) && (j = !0);
      const K = k.value.getBoundingClientRect(), Q = p.value?.offsetWidth || 34, se = Ve(D.x - K.left + _, 4, Math.max(4, K.width - Q - 4)), te = Ve(D.y - K.top + L, 4, Math.max(4, K.height - Q - 4));
      M.value = { x: Math.round(se), y: Math.round(te) };
    }
    function re(g) {
      if (A.value) {
        A.value = !1;
        try {
          p.value?.releasePointerCapture(g.pointerId);
        } catch {
        }
        if (j)
          try {
            localStorage.setItem(Vt, JSON.stringify(M.value));
          } catch {
          }
      }
    }
    function H() {
      if (j) {
        j = !1;
        return;
      }
      Wt();
    }
    let E = null, P = null, Pe = null, Se = 0, Ee = 0, le = 0, ne = { x: 0, y: 0, has: !1 }, _e = !1, we = null, Ue = { x: 0, y: 0 }, me = null, Ce = null, be = null, ye = null, Ae = null, ue = "off", he = 0, ze = 0, je = 0, Be = 120, b = ["ParamMouthOpenY"];
    function C(g) {
      const _ = P?.internalModel?.coreModel;
      if (!_) return;
      const L = Ve(g, 0, 1);
      for (const K of b)
        try {
          typeof _.setParameterValueById == "function" ? _.setParameterValueById(K, L) : typeof _.setParamFloat == "function" && _.setParamFloat(K, L);
        } catch {
        }
    }
    function S(g) {
      const _ = [];
      try {
        const L = g?.internalModel?.settings;
        let K = L?.getLipSyncParameters?.();
        if (!Array.isArray(K) && Array.isArray(L?.groups) && (K = L.groups.find((se) => (se?.Name || se?.name || "").toLowerCase() === "lipsync")?.Ids), Array.isArray(K))
          for (const Q of K) typeof Q == "string" && Q && _.push(Q);
      } catch {
      }
      b = _.length ? _ : ["ParamMouthOpenY"];
    }
    function Z() {
      if (ue === "off") {
        he !== 0 && (he = 0, C(0));
        return;
      }
      if (ue === "audio" && ye && Ae) {
        ye.getByteTimeDomainData(Ae);
        let g = 0;
        for (let K = 0; K < Ae.length; K++) {
          const Q = (Ae[K] - 128) / 128;
          g += Q * Q;
        }
        const _ = Math.sqrt(g / Ae.length), L = Ve(_ * 3.4, 0, 1);
        he = he * 0.35 + L * 0.65, C(he);
        return;
      }
      if (ue === "text") {
        const g = performance.now() - ze;
        if (g > je * Be + 260) {
          ue = "off", he = 0, C(0);
          return;
        }
        const _ = g % Be / Be, L = _ < 0.5 ? 0.12 + 0.72 * Math.sin(_ / 0.5 * Math.PI) : 0.06;
        he = he * 0.45 + L * 0.55, C(he);
      }
    }
    async function Te(g, _ = "") {
      if (!g) {
        Re(_);
        return;
      }
      if (P)
        try {
          if (me || (me = new Audio(), me.crossOrigin = "anonymous", me.addEventListener("ended", () => {
            ue = "off", he = 0, C(0);
          })), Ce && Ce !== g)
            try {
              URL.revokeObjectURL(Ce);
            } catch {
            }
          if (Ce = g, me.src = g, !be) {
            const L = window.AudioContext || window.webkitAudioContext;
            L && (be = new L(), ye = be.createAnalyser(), ye.fftSize = 1024, Ae = new Uint8Array(ye.fftSize), be.createMediaElementSource(me).connect(ye), ye.connect(be.destination));
          }
          await be?.resume().catch(() => {
          }), ue = "audio", await me.play().catch(() => {
            _ ? Re(_) : (ue = "off", C(0));
          });
        } catch {
          _ ? Re(_) : ue = "off";
        }
    }
    function Re(g) {
      const _ = Array.from(String(g || "")).filter((L) => /\S/.test(L));
      _.length && (Be = /[\u4e00-\u9fff]/.test(_.join("")) ? 140 : 80, je = _.length, ze = performance.now(), ue = "text");
    }
    function z() {
      ue = "off", he = 0, C(0);
      try {
        me?.pause();
      } catch {
      }
    }
    function T(g) {
      const _ = g.detail || {};
      _.url ? Te(_.url, _.text || "") : _.text && Re(_.text);
    }
    let i = {}, N = [], de = 0;
    function ge(g) {
      i = {}, N = [];
      try {
        const _ = g?.internalModel?.motionManager, L = g?.internalModel?.settings, K = _?.definitions || L?.motions || {};
        for (const [se, te] of Object.entries(K)) i[se] = Array.isArray(te) ? te.length : 0;
        N = (_?.expressionManager?.definitions || L?.expressions || []).map((se) => se?.Name || se?.name).filter((se) => !!se);
      } catch {
      }
      try {
        console.info("[live2d] motions", i, "expressions", N);
      } catch {
      }
      try {
        window.__0KAY_LIVE2D_CAPS__ = { motions: i, expressions: N };
      } catch {
      }
    }
    function q(g, _) {
      if (!P) return;
      const L = Object.keys(i).filter((te) => i[te] > 0);
      if (!L.length) return;
      const K = L.find((te) => /idle/i.test(te)), Q = g && i[g] > 0, se = Q ? g : _ == null && K ? K : L.find((te) => te !== K) || L[0];
      try {
        const te = P.internalModel?.motionManager;
        if (typeof P.motion == "function" && Q) {
          P.motion(se, _);
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
    function fe(g) {
      if (!P || !g) return;
      const _ = /^\d+$/.test(g) ? Number(g) : N.indexOf(g), L = _ >= 0 ? _ : g;
      try {
        const K = P.internalModel?.motionManager?.expressionManager;
        if (K?.setExpression) {
          K.setExpression(L);
          return;
        }
        P.expression?.(L);
      } catch {
      }
    }
    function at() {
      it(), !(typeof window > "u") && (de = window.setInterval(() => {
        if (ue !== "off" || document.hidden) return;
        const g = Object.keys(i).filter((_) => i[_] > 0 && !/idle/i.test(_));
        g.length && Math.random() < 0.6 && q(g[Math.floor(Math.random() * g.length)]), N.length && Math.random() < 0.5 && fe(N[Math.floor(Math.random() * N.length)]);
      }, 9e3));
    }
    function it() {
      de && (clearInterval(de), de = 0);
    }
    function _t(g) {
      const _ = g.detail || {};
      _.expression && fe(_.expression), (_.group || _.index != null) && q(_.group, _.index);
    }
    function Ht() {
      return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore);
    }
    function Ve(g, _, L) {
      return Math.min(L, Math.max(_, g));
    }
    function rt() {
      return Cs + (c.value || "default");
    }
    function bt() {
      try {
        const g = localStorage.getItem(rt());
        if (!g) return null;
        const _ = JSON.parse(g);
        if (typeof _?.x == "number" && typeof _?.y == "number" && typeof _?.scale == "number") return _;
      } catch {
      }
      return null;
    }
    function ut(g = !1) {
      if (!P) return;
      const _ = () => {
        try {
          localStorage.setItem(rt(), JSON.stringify({
            x: Math.round(P.x * 100) / 100,
            y: Math.round(P.y * 100) / 100,
            scale: Math.round(P.scale.x * 1e4) / 1e4
          }));
        } catch {
        }
      };
      if (g) {
        le && (clearTimeout(le), le = 0), _();
        return;
      }
      le && clearTimeout(le), le = window.setTimeout(() => {
        le = 0, _();
      }, 140);
    }
    function yt() {
      if (it(), ue = "off", he = 0, He(), le && (clearTimeout(le), le = 0), P) {
        try {
          E?.stage && E.stage.removeChild(P), P.destroy?.();
        } catch {
        }
        P = null;
      }
    }
    function kt() {
      if (Et(), yt(), Pe && (Pe.disconnect(), Pe = null), le && (clearTimeout(le), le = 0), E) {
        try {
          E.destroy(!1, { children: !0, texture: !1, baseTexture: !1 });
        } catch {
        }
        E = null;
      }
    }
    function wt(g) {
      if (typeof g.getLocalBounds == "function") {
        const K = g.getLocalBounds();
        if (K && K.width > 0 && K.height > 0) return { width: K.width, height: K.height };
      }
      const _ = Math.max(Math.abs(g.scale.x) || 0, 1e-4), L = Math.max(Math.abs(g.scale.y) || 0, 1e-4);
      return { width: Math.max(g.width / _, 1), height: Math.max(g.height / L, 1) };
    }
    function ct(g = P) {
      if (!g || !E) return !1;
      const _ = E.screen.width, L = E.screen.height;
      if (!_ || !L) return !1;
      const K = wt(g);
      if (K.width > 0 && K.height > 0) {
        const Q = Math.min(_ / K.width, L / K.height) * 0.88;
        g.anchor?.set?.(0.5, 0.5), g.scale.set(Q, Q);
      }
      g.position.set(_ * 0.5, L * 0.55);
      try {
        const Q = g.getBounds?.();
        if (Q && Q.width > 0 && Q.height > 0) {
          g.x += _ * 0.5 - (Q.x + Q.width * 0.5), g.y += L * 0.55 - (Q.y + Q.height * 0.55);
          const se = g.getBounds?.();
          if (se && se.width > 0 && se.height > 0) {
            const te = Math.min(_ / se.width, L / se.height) * 0.88, xe = Math.abs(g.scale.x) || 1;
            if (Number.isFinite(te) && te > 0 && Math.abs(te - xe) / xe > 0.08) {
              const Le = xe * te;
              g.scale.set(Le, Le);
              const $e = g.getBounds?.();
              $e && $e.width > 0 && (g.x += _ * 0.5 - ($e.x + $e.width * 0.5), g.y += L * 0.55 - ($e.y + $e.height * 0.55));
            }
          }
        }
      } catch {
      }
      return !0;
    }
    function Yt() {
      if (!P) return { hw: 0, hh: 0 };
      const g = wt(P), _ = Math.abs(P.scale.x) || 1, L = Math.abs(P.scale.y) || 1;
      return { hw: g.width * _ / 2, hh: g.height * L / 2 };
    }
    function Ze() {
      if (!P || !E) return;
      const g = E.screen.width, _ = E.screen.height, { hw: L, hh: K } = Yt(), Q = Math.min(L * 0.7, g * 0.5), se = Math.min(K * 0.7, _ * 0.5), te = Q - L, xe = g - Q + L, Le = se - K, $e = _ - se + K, We = te <= xe ? Ve(P.x, te, xe) : g * 0.5, Ut = Le <= $e ? Ve(P.y, Le, $e) : _ * 0.55;
      P.position.set(We, Ut);
    }
    function Xt() {
      if (!P || !E) return;
      const g = bt();
      if (g && Number.isFinite(g.scale) && g.scale > 0) {
        P.anchor?.set?.(0.5, 0.5), P.scale.set(g.scale, g.scale), P.position.set(g.x, g.y), Ze();
        return;
      }
      ct();
    }
    function Jt(g, _) {
      if (!P || !window.PIXI || typeof window.PIXI.Point != "function" || typeof P.toModelPosition != "function") return null;
      try {
        const L = new window.PIXI.Point(g, _);
        return P.toModelPosition(L, new window.PIXI.Point());
      } catch {
        return null;
      }
    }
    function $t(g, _, L) {
      const K = L - _;
      return !Number.isFinite(K) || Math.abs(K) <= 1e-4 ? 0 : Ve((g - _) / K * 2 - 1, -1, 1);
    }
    function St(g, _) {
      const L = P?.internalModel, K = L?.focusController;
      if (!K || typeof K.focus != "function" || !E) return;
      const Q = E.screen.width || 1, se = E.screen.height || 1;
      let te = g / Q * 2 - 1, xe = _ / se * 2 - 1;
      const Le = Jt(g, _);
      if (Le && L.originalWidth && L.originalHeight) {
        const $e = $t(Le.x, 0, L.originalWidth), We = $t(Le.y, 0, L.originalHeight);
        $e >= -1 && $e <= 1 && We >= -1 && We <= 1 && (te = te * 0.35 + $e * 0.65, xe = xe * 0.35 + We * 0.65);
      }
      te = Ve(te, -1, 1), xe = Ve(xe, -1, 1), K.focus(te, -xe);
    }
    function Qe() {
      ne.has && St(ne.x, ne.y);
    }
    function Ct(g) {
      if (!P || !E || !k.value) return;
      const _ = k.value.getBoundingClientRect();
      if (!_.width || !_.height) return;
      const L = (g.clientX - _.left) / _.width * E.screen.width, K = (g.clientY - _.top) / _.height * E.screen.height;
      ne = { x: L, y: K, has: !0 }, _e && g.pointerId === we && (P.position.set(L + Ue.x, K + Ue.y), Ze(), ut()), St(L, K);
    }
    function xt(g) {
      if (!P || !E || !k.value || g.button !== 0 && g.pointerType === "mouse" || g.target?.closest?.(".stage-reset")) return;
      const _ = k.value.getBoundingClientRect();
      if (!_.width || !_.height) return;
      const L = (g.clientX - _.left) / _.width * E.screen.width, K = (g.clientY - _.top) / _.height * E.screen.height;
      _e = !0, we = g.pointerId, Ue = { x: P.x - L, y: P.y - K };
      try {
        k.value.setPointerCapture(g.pointerId);
      } catch {
      }
      k.value && (k.value.style.cursor = "grabbing");
    }
    function He(g) {
      if (_e && !(g && we !== null && g.pointerId !== we)) {
        if (_e = !1, k.value) {
          try {
            we !== null && k.value.releasePointerCapture(we);
          } catch {
          }
          k.value.style.cursor = "grab";
        }
        we = null, ut(!0);
      }
    }
    function Mt(g) {
      if (!P || $.value !== "ok" || !g.ctrlKey && !g.metaKey) return;
      g.preventDefault();
      const _ = g.deltaY < 0 ? 1.06 : 0.94, L = Ve(P.scale.x * _, 0.08, 3.2);
      P.scale.set(L, L), Ze(), Qe(), ut();
    }
    function Wt() {
      if (!(!P || !E)) {
        try {
          localStorage.removeItem(rt());
        } catch {
        }
        le && (clearTimeout(le), le = 0);
        try {
          E.resize?.();
        } catch {
        }
        E?.stage && (E.stage.hitArea = E.screen), ct(), Qe();
      }
    }
    function Pt() {
      Et();
      const g = k.value;
      g && (g.style.cursor = "grab", g.addEventListener("pointermove", Ct), g.addEventListener("pointerdown", xt), g.addEventListener("pointerup", He), g.addEventListener("pointercancel", He), g.addEventListener("pointerleave", He), g.addEventListener("wheel", Mt, { passive: !1 }));
    }
    function Et() {
      const g = k.value;
      g && (g.removeEventListener("pointermove", Ct), g.removeEventListener("pointerdown", xt), g.removeEventListener("pointerup", He), g.removeEventListener("pointercancel", He), g.removeEventListener("pointerleave", He), g.removeEventListener("wheel", Mt), _e = !1, we = null);
    }
    function qt() {
      if (E || !w.value || !k.value) return;
      const g = window.PIXI;
      E = new g.Application({
        view: w.value,
        resizeTo: k.value,
        autoStart: !0,
        antialias: !0,
        backgroundAlpha: 0,
        powerPreference: "high-performance"
      }), E.stage && (E.stage.interactive = !0, E.stage.hitArea = E.screen), Pe = new ResizeObserver(() => {
        try {
          E?.resize?.();
        } catch {
        }
        if (E?.stage && (E.stage.hitArea = E.screen), P) {
          const _ = bt();
          _ && Number.isFinite(_.scale) && _.scale > 0 ? (P.position.set(_.x, _.y), P.scale.set(_.scale, _.scale), Ze()) : ct();
        }
        Qe();
      }), Pe.observe(k.value), Pt();
    }
    async function dt() {
      try {
        await cs;
      } catch (L) {
        $.value = "error", V.value = `Live2D runtime: ${L.message}`;
        return;
      }
      const g = ++Se;
      if (yt(), !u.value) {
        $.value = "disabled", h.value = "";
        return;
      }
      if (!Ht()) {
        $.value = "no-libs", V.value = s("live2d.libsMissing");
        return;
      }
      const _ = c.value || f.value[0]?.url;
      if (!_) {
        $.value = "error", V.value = s("live2d.noModel");
        return;
      }
      if ($.value = "loading", V.value = "", h.value = _.split("/").pop() || _, await ts(), E || qt(), !E) {
        $.value = "error", V.value = s("live2d.stageMissing");
        return;
      }
      try {
        const L = await window.PIXI.live2d.Live2DModel.from(_, { autoInteract: !1 });
        if (g !== Se) {
          try {
            L.destroy?.();
          } catch {
          }
          return;
        }
        P = L, Pt(), L.anchor?.set?.(0.5, 0.5), E.stage.addChild(L), Xt();
        try {
          L.internalModel?.on?.("beforeModelUpdate", Z);
        } catch {
        }
        S(L), ge(L), $.value = "ok", Qe(), q("Idle"), at();
      } catch (L) {
        if (g !== Se) return;
        console.error("Live2D load failed:", L), $.value = "error", V.value = L?.message || s("live2d.loadError");
      }
    }
    function Gt() {
      if (!u.value) {
        kt(), $.value = "disabled";
        return;
      }
      dt();
    }
    Ne(async () => {
      window.addEventListener("live2d-models-changed", y), window.addEventListener("live2d-speak", T), window.addEventListener("live2d-motion", _t), window.__0KAY_LIVE2D__ = { speak: Te, stop: z, motion: q, expression: fe };
      try {
        const g = await fetch("/api/settings/live2d");
        if (g.ok) {
          const { values: _ } = await g.json();
          _ && typeof _.enabled == "boolean" && (m.live2d.enabled = _.enabled), _ && typeof _.model_url == "string" && (m.live2d.modelUrl = _.model_url);
        }
      } catch {
      }
      await y(), u.value ? dt() : $.value = "disabled";
    }), lt(() => {
      if (window.removeEventListener("live2d-models-changed", y), window.removeEventListener("live2d-speak", T), window.removeEventListener("live2d-motion", _t), it(), z(), Ce) {
        try {
          URL.revokeObjectURL(Ce);
        } catch {
        }
        Ce = null;
      }
      try {
        be?.close();
      } catch {
      }
      be = null, Se++, cancelAnimationFrame(Ee), kt();
    }), Xe(u, Gt), Xe(c, () => {
      u.value && dt();
    });
    const Zt = { happy: 2, sad: 4, irritated: 6, neutral: 0, drowsy: 0, exhausted: 0, sleeping: 0 };
    return Xe(n, (g) => {
      if (!P || ue !== "off" || !N.length) return;
      const _ = Zt[g] ?? 0;
      fe(N[_] || N[0]), (g === "happy" || g === "irritated") && Math.random() < 0.5 && q();
    }), (g, _) => (o(), r("div", {
      class: ee(["live2d-stage", { on: u.value }])
    }, [
      e("div", {
        ref_key: "stageEl",
        ref: k,
        class: "stage-viewport",
        style: At({ "--mood": d.value }),
        title: u.value && $.value === "ok" ? t(s)("live2d.interactHint") : ""
      }, [
        e("canvas", {
          ref_key: "canvasEl",
          ref: w,
          class: "stage-canvas"
        }, null, 512),
        u.value ? $.value === "loading" ? (o(), r("div", ks, l(t(s)("live2d.loading")), 1)) : $.value === "error" || $.value === "no-libs" ? (o(), r("div", ws, l(V.value || t(s)("live2d.loadError")), 1)) : R("", !0) : (o(), r("div", ys, [
          e("p", null, l(t(s)("live2d.disabledHint")), 1)
        ])),
        u.value && $.value === "ok" ? (o(), r("button", {
          key: 3,
          ref_key: "resetBtnEl",
          ref: p,
          class: ee(["stage-reset", { dragging: A.value }]),
          type: "button",
          style: At(I.value),
          title: t(s)("live2d.resetView"),
          "aria-label": t(s)("live2d.resetView"),
          onPointerdown: Oe(J, ["stop"]),
          onPointermove: Oe(ie, ["stop"]),
          onPointerup: Oe(re, ["stop"]),
          onPointercancel: Oe(re, ["stop"]),
          onClick: Oe(H, ["stop"])
        }, "⟲", 46, $s)) : R("", !0),
        _[0] || (_[0] = e("div", { class: "stage-gradient" }, null, -1)),
        e("div", Ss, l(a.value), 1)
      ], 12, bs)
    ], 2));
  }
}), Me = (F, s) => {
  const v = F.__vccOpts || F;
  for (const [m, k] of s)
    v[m] = k;
  return v;
}, Ms = /* @__PURE__ */ Me(xs, [["__scopeId", "data-v-15b509be"]]), Ps = { class: "life-settings" }, Es = { class: "ls-hero" }, Us = { class: "ls-hero-main" }, As = { class: "ls-sub" }, Ts = ["disabled"], Is = { class: "ls-grid" }, Ns = { class: "ls-card" }, Vs = { class: "ls-card-head" }, Rs = { class: "ls-switch" }, Ls = { class: "ls-switch-text" }, Os = { class: "ls-switch" }, Ds = { class: "ls-switch-text" }, zs = { class: "ls-field" }, Bs = ["placeholder"], Fs = { class: "ls-card" }, Ks = { class: "ls-card-head" }, js = { class: "ls-note" }, Hs = { class: "ls-label" }, Ys = { class: "ls-models" }, Xs = ["onClick"], Js = {
  key: 0,
  class: "ls-empty"
}, Ws = { class: "ls-label" }, qs = { class: "ls-models" }, Gs = ["onClick"], Zs = {
  key: 0,
  class: "ls-empty"
}, Qs = { class: "ls-card" }, el = { class: "ls-card-head" }, tl = { class: "ls-note" }, sl = { class: "ls-switch" }, ll = { class: "ls-switch-text" }, nl = { class: "ls-switch" }, ol = { class: "ls-switch-text" }, al = { class: "ls-card" }, il = { class: "ls-switch" }, rl = { class: "ls-switch-text" }, ul = { class: "ls-card ls-card-wide" }, cl = { class: "ls-card-head" }, dl = { class: "ls-row" }, pl = { class: "ls-switch" }, hl = { class: "ls-switch-text" }, vl = { class: "ls-switch" }, ml = { class: "ls-switch-text" }, gl = { class: "ls-row" }, fl = { class: "ls-field" }, _l = { class: "ls-field" }, bl = { class: "ls-row" }, yl = { class: "ls-field" }, kl = { class: "ls-field" }, wl = ["placeholder"], $l = { class: "ls-row" }, Sl = { class: "ls-field" }, Cl = { class: "ls-field" }, xl = { class: "ls-card ls-card-wide" }, Ml = { class: "ls-card-head" }, Pl = { class: "ls-row" }, El = { class: "ls-switch" }, Ul = { class: "ls-switch-text" }, Al = { class: "ls-row" }, Tl = { class: "ls-field" }, Il = ["placeholder"], Nl = { class: "ls-field" }, Vl = ["title"], Rl = { class: "ls-hint" }, Ll = { class: "ls-card ls-card-wide" }, Ol = { class: "ls-card-head" }, Dl = { class: "ls-row" }, zl = { class: "ls-switch" }, Bl = { class: "ls-switch-text" }, Fl = { class: "ls-switch" }, Kl = { class: "ls-switch-text" }, jl = { class: "ls-switch" }, Hl = { class: "ls-switch-text" }, Yl = { class: "ls-hint" }, Xl = {
  key: 0,
  class: "ls-state"
}, Jl = /* @__PURE__ */ pe({
  __name: "LifeSettingsPanel",
  setup(F) {
    const { t: s } = ve(), v = ss({
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
      asr_language: "zh",
      // Which media the character is allowed to choose on its own. Voice and selfie
      // are on by default because both degrade gracefully (no TTS backend → the text
      // still arrives); a call is a mode change, so it stays opt-in.
      voice_reply_enabled: !0,
      selfie_enabled: !0,
      call_enabled: !1
    }), m = x(""), k = x(!1), w = x(!1), h = x([]), $ = x(""), V = x([]);
    async function u() {
      try {
        const [n, a] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (n.ok && (Object.assign(v, (await n.json()).values || {}), w.value = !0), a.ok) {
          const d = await a.json();
          V.value = Array.isArray(d.models) ? d.models.map((f) => ({ id: f.id, provider: f.provider || "custom", supports_thinking: f.supports_thinking })).filter((f) => f.id) : [], h.value = V.value.map((f) => f.id), $.value = s("lifeSettings.sourceFromCore");
        }
      } catch {
        m.value = s("lifeSettings.loadFailed");
      }
    }
    async function c() {
      if (!w.value) {
        m.value = s("lifeSettings.notLoaded");
        return;
      }
      k.value = !0, m.value = "";
      try {
        const n = await fetch("/api/settings/life", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: v }) });
        if (!n.ok) throw new Error(String(n.status));
        await fetch("/api/life/permissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ screen_watch: v.screen_watch, computer_use: v.computer_use, report_agent_host: v.report_agent_host }) }), m.value = s("lifeSettings.savedNotice");
      } catch {
        m.value = s("lifeSettings.saveFailed");
      } finally {
        k.value = !1;
      }
    }
    return Ne(u), (n, a) => (o(), r("section", Ps, [
      e("header", Es, [
        e("div", Us, [
          a[20] || (a[20] = e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS", -1)),
          e("h2", null, l(t(s)("lifeSettings.title")), 1),
          e("p", As, l(t(s)("lifeSettings.subtitle")), 1)
        ]),
        e("button", {
          class: "ls-save",
          disabled: k.value,
          onClick: c
        }, [
          a[21] || (a[21] = e("span", {
            class: "ls-save-ic",
            "aria-hidden": "true"
          }, "✓", -1)),
          Ie(l(k.value ? t(s)("common.saving") : t(s)("common.save")), 1)
        ], 8, Ts)
      ]),
      e("div", Is, [
        e("article", Ns, [
          e("div", Vs, [
            a[22] || (a[22] = e("span", { class: "ls-ic tone-1" }, "◉", -1)),
            e("h3", null, l(t(s)("lifeSettings.hostPerms")), 1)
          ]),
          e("label", Rs, [
            B(e("input", {
              "onUpdate:modelValue": a[0] || (a[0] = (d) => v.screen_watch = d),
              type: "checkbox"
            }, null, 512), [
              [ce, v.screen_watch]
            ]),
            a[23] || (a[23] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Ls, [
              e("b", null, l(t(s)("lifeSettings.screenWatch")), 1),
              e("small", null, l(t(s)("lifeSettings.screenWatchDesc")), 1)
            ])
          ]),
          e("label", Os, [
            B(e("input", {
              "onUpdate:modelValue": a[1] || (a[1] = (d) => v.computer_use = d),
              type: "checkbox"
            }, null, 512), [
              [ce, v.computer_use]
            ]),
            a[24] || (a[24] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Ds, [
              e("b", null, l(t(s)("lifeSettings.computerUse")), 1),
              e("small", null, l(t(s)("lifeSettings.computerUseDesc")), 1)
            ])
          ]),
          e("label", zs, [
            e("span", null, l(t(s)("lifeSettings.agentHost")), 1),
            B(e("input", {
              "onUpdate:modelValue": a[2] || (a[2] = (d) => v.report_agent_host = d),
              placeholder: t(s)("lifeSettings.agentHostPlaceholder")
            }, null, 8, Bs), [
              [Y, v.report_agent_host]
            ])
          ])
        ]),
        e("article", Fs, [
          e("div", Ks, [
            a[25] || (a[25] = e("span", { class: "ls-ic tone-2" }, "✦", -1)),
            e("h3", null, l(t(s)("lifeSettings.thinkOutput")), 1)
          ]),
          e("p", js, l($.value || t(s)("lifeSettings.loadingModels")), 1),
          e("p", Hs, l(t(s)("lifeSettings.thinkLabel")), 1),
          e("div", Ys, [
            (o(!0), r(X, null, oe(V.value, (d) => (o(), r("button", {
              key: "think-" + d.id,
              type: "button",
              class: ee(["ls-model", { selected: v.think_model === d.id }]),
              onClick: (f) => v.think_model = d.id
            }, [
              e("b", null, l(d.id), 1),
              e("span", null, l(d.provider) + " · " + l(d.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, Xs))), 128)),
            V.value.length ? R("", !0) : (o(), r("span", Js, l(t(s)("lifeSettings.noModels")), 1))
          ]),
          e("p", Ws, l(t(s)("lifeSettings.outputLabel")), 1),
          e("div", qs, [
            (o(!0), r(X, null, oe(V.value, (d) => (o(), r("button", {
              key: "output-" + d.id,
              type: "button",
              class: ee(["ls-model", { selected: v.output_model === d.id }]),
              onClick: (f) => v.output_model = d.id
            }, [
              e("b", null, l(d.id), 1),
              e("span", null, l(d.provider) + " · output", 1)
            ], 10, Gs))), 128)),
            V.value.length ? R("", !0) : (o(), r("span", Zs, l(t(s)("lifeSettings.noModels")), 1))
          ])
        ]),
        e("article", Qs, [
          e("div", el, [
            a[26] || (a[26] = e("span", { class: "ls-ic tone-3" }, "✉", -1)),
            e("h3", null, l(t(s)("lifeSettings.mail")), 1)
          ]),
          e("p", tl, l(t(s)("lifeSettings.mailNote", { mcp: "0kay-mcp", mail: "mail" })), 1),
          e("label", sl, [
            B(e("input", {
              "onUpdate:modelValue": a[3] || (a[3] = (d) => v.mail_auto_approve_all = d),
              type: "checkbox"
            }, null, 512), [
              [ce, v.mail_auto_approve_all]
            ]),
            a[27] || (a[27] = e("span", { class: "ls-track" }, null, -1)),
            e("span", ll, [
              e("b", null, l(t(s)("lifeSettings.mailAutoApprove")), 1),
              e("small", null, l(t(s)("lifeSettings.mailAutoApproveDesc")), 1)
            ])
          ]),
          e("label", nl, [
            B(e("input", {
              "onUpdate:modelValue": a[4] || (a[4] = (d) => v.mail_require_approval = d),
              type: "checkbox"
            }, null, 512), [
              [ce, v.mail_require_approval]
            ]),
            a[28] || (a[28] = e("span", { class: "ls-track" }, null, -1)),
            e("span", ol, [
              e("b", null, l(t(s)("lifeSettings.mailRequireApproval")), 1),
              e("small", null, l(t(s)("lifeSettings.mailRequireApprovalDesc")), 1)
            ])
          ])
        ]),
        e("article", al, [
          a[30] || (a[30] = e("div", { class: "ls-card-head" }, [
            e("span", { class: "ls-ic tone-4" }, "⌘"),
            e("h3", null, "0kay-mcp")
          ], -1)),
          e("label", il, [
            B(e("input", {
              "onUpdate:modelValue": a[5] || (a[5] = (d) => v.mcp_enabled = d),
              type: "checkbox"
            }, null, 512), [
              [ce, v.mcp_enabled]
            ]),
            a[29] || (a[29] = e("span", { class: "ls-track" }, null, -1)),
            e("span", rl, [
              e("b", null, l(t(s)("lifeSettings.mcpEnabled")), 1),
              e("small", null, l(t(s)("lifeSettings.mcpEnabledDesc")), 1)
            ])
          ])
        ]),
        e("article", ul, [
          e("div", cl, [
            a[31] || (a[31] = e("span", { class: "ls-ic tone-5" }, "☷", -1)),
            e("h3", null, l(t(s)("lifeSettings.onebot")), 1)
          ]),
          e("div", dl, [
            e("label", pl, [
              B(e("input", {
                "onUpdate:modelValue": a[6] || (a[6] = (d) => v.onebot_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [ce, v.onebot_enabled]
              ]),
              a[32] || (a[32] = e("span", { class: "ls-track" }, null, -1)),
              e("span", hl, [
                e("b", null, l(t(s)("lifeSettings.onebotEnable")), 1)
              ])
            ]),
            e("label", vl, [
              B(e("input", {
                "onUpdate:modelValue": a[7] || (a[7] = (d) => v.onebot_observe_group = d),
                type: "checkbox"
              }, null, 512), [
                [ce, v.onebot_observe_group]
              ]),
              a[33] || (a[33] = e("span", { class: "ls-track" }, null, -1)),
              e("span", ml, [
                e("b", null, l(t(s)("lifeSettings.onebotObserve")), 1),
                e("small", null, l(t(s)("lifeSettings.onebotObserveDesc")), 1)
              ])
            ])
          ]),
          e("div", gl, [
            e("label", fl, [
              e("span", null, l(t(s)("lifeSettings.onebotWs")), 1),
              B(e("input", {
                "onUpdate:modelValue": a[8] || (a[8] = (d) => v.onebot_ws_url = d),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [Y, v.onebot_ws_url]
              ])
            ]),
            e("label", _l, [
              e("span", null, l(t(s)("lifeSettings.onebotHttp")), 1),
              B(e("input", {
                "onUpdate:modelValue": a[9] || (a[9] = (d) => v.onebot_http_url = d),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [Y, v.onebot_http_url]
              ])
            ])
          ]),
          e("div", bl, [
            e("label", yl, [
              a[34] || (a[34] = e("span", null, "Access Token", -1)),
              B(e("input", {
                "onUpdate:modelValue": a[10] || (a[10] = (d) => v.onebot_access_token = d),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [Y, v.onebot_access_token]
              ])
            ]),
            e("label", kl, [
              e("span", null, l(t(s)("lifeSettings.onebotKeywords")), 1),
              B(e("input", {
                "onUpdate:modelValue": a[11] || (a[11] = (d) => v.onebot_trigger_keywords = d),
                placeholder: t(s)("lifeSettings.onebotKeywordsPlaceholder")
              }, null, 8, wl), [
                [Y, v.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", $l, [
            e("label", Sl, [
              e("span", null, l(t(s)("lifeSettings.proactiveDaily")), 1),
              B(e("input", {
                "onUpdate:modelValue": a[12] || (a[12] = (d) => v.proactive_daily_limit = d),
                type: "number",
                min: "0",
                placeholder: "3"
              }, null, 512), [
                [
                  Y,
                  v.proactive_daily_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", Cl, [
              e("span", null, l(t(s)("lifeSettings.proactiveTarget")), 1),
              B(e("input", {
                "onUpdate:modelValue": a[13] || (a[13] = (d) => v.proactive_target_limit = d),
                type: "number",
                min: "0",
                placeholder: "1"
              }, null, 512), [
                [
                  Y,
                  v.proactive_target_limit,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ])
        ]),
        e("article", xl, [
          e("div", Ml, [
            a[35] || (a[35] = e("span", { class: "ls-ic tone-2" }, "🎙", -1)),
            e("h3", null, l(t(s)("lifeSettings.wake")), 1)
          ]),
          e("div", Pl, [
            e("label", El, [
              B(e("input", {
                "onUpdate:modelValue": a[14] || (a[14] = (d) => v.wake_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [ce, v.wake_enabled]
              ]),
              a[36] || (a[36] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Ul, [
                e("b", null, l(t(s)("lifeSettings.wakeEnable")), 1),
                e("small", null, l(t(s)("lifeSettings.wakeEnableDesc")), 1)
              ])
            ])
          ]),
          e("div", Al, [
            e("label", Tl, [
              e("span", null, l(t(s)("lifeSettings.wakeNickname")), 1),
              B(e("input", {
                "onUpdate:modelValue": a[15] || (a[15] = (d) => v.wake_nickname = d),
                placeholder: t(s)("lifeSettings.wakeNicknamePlaceholder")
              }, null, 8, Il), [
                [Y, v.wake_nickname]
              ])
            ]),
            e("label", Nl, [
              e("span", null, l(t(s)("lifeSettings.asrLanguage")), 1),
              B(e("input", {
                "onUpdate:modelValue": a[16] || (a[16] = (d) => v.asr_language = d),
                placeholder: "zh",
                title: t(s)("lifeSettings.asrLanguageDesc")
              }, null, 8, Vl), [
                [Y, v.asr_language]
              ])
            ])
          ]),
          e("p", Rl, l(t(s)("lifeSettings.wakeHint")), 1)
        ]),
        e("article", Ll, [
          e("div", Ol, [
            a[37] || (a[37] = e("span", { class: "ls-ic tone-4" }, "📸", -1)),
            e("h3", null, l(t(s)("lifeSettings.media")), 1)
          ]),
          e("div", Dl, [
            e("label", zl, [
              B(e("input", {
                "onUpdate:modelValue": a[17] || (a[17] = (d) => v.voice_reply_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [ce, v.voice_reply_enabled]
              ]),
              a[38] || (a[38] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Bl, [
                e("b", null, l(t(s)("lifeSettings.mediaVoice")), 1),
                e("small", null, l(t(s)("lifeSettings.mediaVoiceDesc")), 1)
              ])
            ]),
            e("label", Fl, [
              B(e("input", {
                "onUpdate:modelValue": a[18] || (a[18] = (d) => v.selfie_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [ce, v.selfie_enabled]
              ]),
              a[39] || (a[39] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Kl, [
                e("b", null, l(t(s)("lifeSettings.mediaSelfie")), 1),
                e("small", null, l(t(s)("lifeSettings.mediaSelfieDesc")), 1)
              ])
            ]),
            e("label", jl, [
              B(e("input", {
                "onUpdate:modelValue": a[19] || (a[19] = (d) => v.call_enabled = d),
                type: "checkbox"
              }, null, 512), [
                [ce, v.call_enabled]
              ]),
              a[40] || (a[40] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Hl, [
                e("b", null, l(t(s)("lifeSettings.mediaCall")), 1),
                e("small", null, l(t(s)("lifeSettings.mediaCallDesc")), 1)
              ])
            ])
          ]),
          e("p", Yl, l(t(s)("lifeSettings.mediaHint")), 1)
        ])
      ]),
      m.value ? (o(), r("p", Xl, l(m.value), 1)) : R("", !0)
    ]));
  }
}), Wl = /* @__PURE__ */ Me(Jl, [["__scopeId", "data-v-71eaecdc"]]), ql = "/okay-logo.svg", Gl = { class: "content-card about" }, Zl = { class: "identity" }, Ql = { class: "app-id" }, en = { class: "ver-badge" }, tn = { class: "app-desc" }, sn = { class: "identity-actions" }, ln = ["href"], nn = { class: "section" }, on = { class: "section-head" }, an = ["disabled"], rn = {
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
}, hn = { class: "us-hero-text" }, vn = { key: 0 }, mn = { key: 1 }, gn = { class: "us-hero-actions" }, fn = ["disabled"], _n = ["disabled", "title"], bn = ["href"], yn = {
  key: 2,
  class: "us-notes"
}, kn = { class: "us-notes-title" }, wn = { class: "us-notes-body" }, $n = {
  key: 3,
  class: "alert",
  role: "alert"
}, Sn = { class: "us-apply-head" }, Cn = { key: 0 }, xn = { key: 1 }, Mn = {
  key: 0,
  class: "us-chip-tag"
}, Pn = { class: "us-apply-label" }, En = {
  key: 0,
  class: "us-apply-error"
}, Un = {
  key: 1,
  class: "us-apply-log"
}, An = { class: "section" }, Tn = { class: "section-title" }, In = { class: "credits" }, Nn = ["href"], Vn = ["src", "alt"], Rn = { class: "person-info" }, Ln = { class: "name" }, On = { class: "role" }, Dn = ["src"], zn = { class: "person-info" }, Bn = { class: "role" }, Fn = { class: "section-head contributors-head" }, Kn = { class: "section-title" }, jn = { class: "muted" }, Hn = {
  key: 0,
  class: "contribs"
}, Yn = ["href"], Xn = ["src", "alt"], Jn = { class: "login" }, Wn = {
  key: 0,
  class: "count"
}, qn = {
  key: 1,
  class: "muted"
}, Gn = ["href"], Zn = { class: "foot" }, Qn = ["href"], ht = "https://github.com/RazureSOFT/0KAY", eo = "https://github.com/RazureSOFT", to = /* @__PURE__ */ pe({
  __name: "AboutPanel",
  setup(F) {
    const { t: s } = ve(), v = x("0.1.3"), m = x([]), k = x(""), w = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, h = (U, I = 96) => `https://github.com/${U}.png?size=${I}`, $ = x(!1), V = x(null), u = x(""), c = x(null), n = x("");
    let a = null;
    function d(U) {
      return c.value?.status === "running" && c.value.plugin === U;
    }
    async function f(U, I) {
      if (c.value?.status !== "running") {
        n.value = "";
        try {
          c.value = await tt("/api/plugins/pm/update", { plugin: U, version: I || "" }), p();
        } catch (J) {
          n.value = J instanceof Error ? J.message : String(J);
        }
      }
    }
    async function y() {
      try {
        c.value = await Fe("/api/plugins/pm/status");
      } catch {
        return;
      }
      c.value && c.value.status !== "running" && (M(), O());
    }
    function p() {
      a || (a = setInterval(y, 2e3));
    }
    function M() {
      a && (clearInterval(a), a = null);
    }
    const A = G(() => {
      switch (c.value?.status) {
        case "running":
          return s("settings.about.updating");
        case "done":
          return s("settings.about.updated");
        case "failed":
          return s("settings.about.updateFailed");
        default:
          return "";
      }
    }), j = G(() => V.value ? V.value.has_update ? "warn" : V.value.latest ? "ok" : "none" : "none");
    async function O() {
      $.value = !0, u.value = "";
      try {
        const U = await Fe("/api/plugins/pm/check");
        V.value = U, U?.current && (v.value = String(U.current));
      } catch (U) {
        u.value = U instanceof Ft && U.status === 404 ? s("settings.about.unsupported") : U instanceof Error ? U.message : String(U);
      } finally {
        $.value = !1;
      }
    }
    async function D() {
      try {
        const U = { Accept: "application/vnd.github+json" }, [I, J] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: U }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: U })
        ]);
        if (!I.ok) throw new Error(`HTTP ${I.status}`);
        const ie = /* @__PURE__ */ new Map(), re = await I.json();
        for (const H of Array.isArray(re) ? re : [])
          H?.login && ie.set(H.login, H);
        if (J.ok) {
          const H = await J.json();
          for (const E of Array.isArray(H) ? H : []) {
            const P = E?.author;
            !P?.login || P.login.endsWith("[bot]") || ie.has(P.login) || ie.set(P.login, {
              login: P.login,
              avatar_url: P.avatar_url,
              html_url: P.html_url,
              contributions: 0
            });
          }
        }
        m.value = [...ie.values()].sort(
          (H, E) => (E.contributions || 0) - (H.contributions || 0) || H.login.localeCompare(E.login)
        );
      } catch (U) {
        k.value = U instanceof Error ? U.message : String(U), m.value = [];
      }
    }
    return Ne(() => {
      O(), D(), Fe("/api/plugins/pm/status").then((U) => {
        c.value = U, U?.status === "running" && p();
      }).catch(() => {
      });
    }), lt(M), (U, I) => (o(), r("div", Gl, [
      e("header", Zl, [
        I[3] || (I[3] = e("img", {
          class: "app-icon",
          src: ql,
          alt: "",
          "aria-hidden": "true"
        }, null, -1)),
        e("div", Ql, [
          e("h2", null, [
            I[2] || (I[2] = Ie("0KAY ", -1)),
            e("span", en, "v" + l(v.value), 1)
          ]),
          e("p", tn, l(t(s)("settings.about.description")), 1)
        ]),
        e("div", sn, [
          e("a", {
            class: "btn btn-tonal sm",
            href: ht,
            target: "_blank",
            rel: "noopener noreferrer"
          }, l(t(s)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${ht}/releases`,
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
            disabled: $.value,
            onClick: O
          }, l(t(s)($.value ? "settings.about.checking" : "settings.about.check")), 9, an)
        ]),
        u.value ? (o(), r("p", rn, l(u.value), 1)) : (o(), r("div", {
          key: 1,
          class: ee(["us-hero", j.value])
        }, [
          e("div", un, [
            j.value === "ok" ? (o(), r("svg", cn, [...I[5] || (I[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : j.value === "warn" ? (o(), r("svg", dn, [...I[6] || (I[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (o(), r("svg", pn, [...I[7] || (I[7] = [
              e("path", {
                d: "M6 12h12",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])]))
          ]),
          e("div", hn, [
            e("b", null, l(t(s)(j.value === "warn" ? "settings.about.available" : j.value === "ok" ? "settings.about.latest" : "settings.about.noRelease")), 1),
            V.value?.latest ? (o(), r("span", vn, [
              Ie("v" + l(V.value.current) + " → ", 1),
              e("em", null, "v" + l(V.value.latest), 1)
            ])) : (o(), r("span", mn, "0KAY v" + l(V.value?.current || v.value), 1))
          ]),
          e("div", gn, [
            V.value?.has_update ? (o(), r("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: d("core"),
              onClick: I[0] || (I[0] = (J) => f("core", V.value.latest))
            }, l(d("core") ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, fn)) : R("", !0),
            V.value?.source_available !== !1 ? (o(), r("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: d("core"),
              title: t(s)("settings.about.betaHint"),
              onClick: I[1] || (I[1] = (J) => f("core"))
            }, l(d("core") ? t(s)("settings.about.updating") : t(s)("settings.about.beta")), 9, _n)) : R("", !0),
            V.value?.url ? (o(), r("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: V.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, bn)) : R("", !0)
          ])
        ], 2)),
        V.value?.notes ? (o(), r("div", yn, [
          e("p", kn, l(t(s)("settings.about.whatsNew")), 1),
          e("pre", wn, l(V.value.notes), 1)
        ])) : R("", !0),
        n.value ? (o(), r("p", $n, l(n.value), 1)) : R("", !0),
        c.value && c.value.status !== "idle" ? (o(), r("div", {
          key: 4,
          class: ee(["us-apply-banner", c.value.status])
        }, [
          e("div", Sn, [
            I[8] || (I[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Ie(l(c.value.package), 1),
              c.value.version ? (o(), r("span", Cn, "@" + l(c.value.version), 1)) : (o(), r("span", xn, " · main"))
            ]),
            c.value.mode === "source" ? (o(), r("span", Mn, l(t(s)("settings.about.sourceMode")), 1)) : R("", !0),
            e("span", Pn, l(A.value), 1)
          ]),
          c.value.error ? (o(), r("p", En, l(c.value.error), 1)) : R("", !0),
          c.value.log ? (o(), r("pre", Un, l(c.value.log), 1)) : R("", !0)
        ], 2)) : R("", !0)
      ]),
      e("section", An, [
        e("h3", Tn, l(t(s)("settings.about.developerTitle")) + " & " + l(t(s)("settings.about.teamTitle")), 1),
        e("div", In, [
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
            }, null, 8, Vn),
            e("div", Rn, [
              e("span", Ln, l(w.login), 1),
              e("span", On, l(t(s)("settings.about.developerTitle")), 1)
            ]),
            I[9] || (I[9] = e("span", { class: "go" }, "↗", -1))
          ], 8, Nn),
          e("a", {
            class: "person",
            href: eo,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: h("RazureSOFT"),
              alt: "RazureSOFT",
              loading: "lazy"
            }, null, 8, Dn),
            e("div", zn, [
              I[10] || (I[10] = e("span", { class: "name" }, "RazureSOFT", -1)),
              e("span", Bn, l(t(s)("settings.about.teamTitle")), 1)
            ]),
            I[11] || (I[11] = e("span", { class: "go" }, "↗", -1))
          ])
        ]),
        e("div", Fn, [
          e("h3", Kn, l(t(s)("settings.about.contributorsTitle")), 1),
          e("span", jn, l(t(s)("settings.about.contributorsFrom")), 1)
        ]),
        m.value.length ? (o(), r("div", Hn, [
          (o(!0), r(X, null, oe(m.value, (J) => (o(), r("a", {
            key: J.login,
            class: "contrib",
            href: J.html_url || `https://github.com/${J.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: J.avatar_url || h(J.login, 64),
              alt: J.login,
              loading: "lazy"
            }, null, 8, Xn),
            e("span", Jn, l(J.login), 1),
            J.contributions ? (o(), r("span", Wn, l(J.contributions), 1)) : R("", !0)
          ], 8, Yn))), 128))
        ])) : (o(), r("p", qn, [
          e("a", {
            class: "repo-link",
            href: w.url,
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
          href: `${ht}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, Qn)
      ])
    ]));
  }
}), so = /* @__PURE__ */ Me(to, [["__scopeId", "data-v-da8c447d"]]), lo = { class: "content-card updates" }, no = { class: "us-block" }, oo = { class: "us-head" }, ao = { class: "us-head-text" }, io = { class: "us-title" }, ro = { class: "us-desc" }, uo = { class: "us-source" }, co = { class: "us-input-group" }, po = ["disabled", "placeholder"], ho = ["disabled"], vo = { class: "us-chips" }, mo = ["disabled"], go = ["disabled"], fo = {
  key: 0,
  class: "us-saved"
}, _o = { class: "helper-text" }, bo = {
  key: 0,
  class: "alert"
}, yo = { class: "us-block" }, ko = { class: "us-head" }, wo = { class: "us-head-text" }, $o = { class: "us-title" }, So = { class: "us-desc" }, Co = { class: "us-head-actions" }, xo = ["disabled"], Mo = {
  key: 0,
  class: "alert",
  role: "alert"
}, Po = { class: "us-apply-head" }, Eo = { key: 0 }, Uo = { key: 1 }, Ao = {
  key: 0,
  class: "us-chip-tag"
}, To = { class: "us-apply-label" }, Io = {
  key: 0,
  class: "us-apply-error"
}, No = {
  key: 1,
  class: "us-apply-log"
}, Vo = {
  key: 2,
  class: "alert",
  role: "alert"
}, Ro = {
  key: 3,
  class: "us-table"
}, Lo = { class: "us-row us-thead" }, Oo = { class: "us-name" }, Do = { class: "us-name-text" }, zo = { class: "us-ver" }, Bo = { class: "us-status-text" }, Fo = { class: "us-actions" }, Ko = ["disabled", "onClick"], jo = ["disabled", "onClick"], Ho = ["href", "title"], Yo = {
  key: 0,
  class: "us-empty"
}, Xo = /* @__PURE__ */ pe({
  __name: "UpdatesPanel",
  setup(F) {
    const { t: s } = ve(), v = x(!1), m = x(null), k = x(""), w = x(null), h = x("");
    let $ = null;
    const V = x(""), u = x(""), c = x(!1), n = x(!1), a = x(!1), d = x(""), f = G(() => V.value.trim() !== u.value), y = G(() => V.value.trim() !== "");
    function p(H) {
      return w.value?.status === "running" && w.value.plugin === H;
    }
    async function M(H, E) {
      if (w.value?.status !== "running") {
        h.value = "";
        try {
          w.value = await tt("/api/plugins/pm/update", { plugin: H, version: E || "" }), j();
        } catch (P) {
          h.value = P instanceof Error ? P.message : String(P);
        }
      }
    }
    async function A() {
      try {
        w.value = await Fe("/api/plugins/pm/status");
      } catch {
        return;
      }
      w.value && w.value.status !== "running" && (O(), I());
    }
    function j() {
      $ || ($ = setInterval(A, 2e3));
    }
    function O() {
      $ && (clearInterval($), $ = null);
    }
    const D = G(() => {
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
    }), U = G(() => (m.value || []).filter((H) => H.has_update).length);
    async function I() {
      v.value = !0, k.value = "";
      try {
        const H = await Fe("/api/plugins/pm/check-plugins");
        m.value = H?.plugins || [];
      } catch (H) {
        k.value = H instanceof Ft && H.status === 404 ? s("settings.about.unsupported") : H instanceof Error ? H.message : String(H);
      } finally {
        v.value = !1;
      }
    }
    async function J() {
      c.value = !0, d.value = "";
      try {
        const H = await Fe("/api/settings/updates"), E = String(H?.values?.github_proxy ?? "");
        V.value = E, u.value = E;
      } catch {
      } finally {
        c.value = !1;
      }
    }
    async function ie() {
      n.value = !0, d.value = "";
      try {
        const H = V.value.trim();
        await tt("/api/settings/updates", { values: { github_proxy: H } }), u.value = H, a.value = !0, setTimeout(() => {
          a.value = !1;
        }, 1500);
      } catch (H) {
        d.value = H instanceof Error ? H.message : String(H);
      } finally {
        n.value = !1;
      }
    }
    function re(H) {
      V.value = H, ie();
    }
    return Ne(() => {
      I(), J(), Fe("/api/plugins/pm/status").then((H) => {
        w.value = H, H?.status === "running" && j();
      }).catch(() => {
      });
    }), lt(O), (H, E) => (o(), r("div", lo, [
      e("section", no, [
        e("header", oo, [
          E[3] || (E[3] = e("span", {
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
            e("h3", io, l(t(s)("settings.pluginSourceTitle")), 1),
            e("p", ro, l(t(s)("settings.pluginSourceDesc")), 1)
          ]),
          e("span", {
            class: ee(["us-tag", { on: y.value }])
          }, l(y.value ? "ghproxy" : t(s)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", uo, [
          e("div", co, [
            E[4] || (E[4] = e("span", {
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
            B(e("input", {
              "onUpdate:modelValue": E[0] || (E[0] = (P) => V.value = P),
              class: "us-input",
              type: "text",
              disabled: c.value,
              placeholder: t(s)("settings.pluginSourcePlaceholder"),
              onKeyup: mt(ie, ["enter"])
            }, null, 40, po), [
              [Y, V.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: n.value || !f.value,
              onClick: ie
            }, l(t(s)("settings.save")), 9, ho)
          ]),
          e("div", vo, [
            e("button", {
              type: "button",
              class: ee(["us-chip", { active: !y.value }]),
              disabled: n.value,
              onClick: E[1] || (E[1] = (P) => re(""))
            }, l(t(s)("settings.pluginSourceDirect")), 11, mo),
            e("button", {
              type: "button",
              class: ee(["us-chip", { active: V.value.trim() === "https://gh-proxy.com" }]),
              disabled: n.value,
              onClick: E[2] || (E[2] = (P) => re("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, go),
            a.value ? (o(), r("span", fo, l(t(s)("settings.saved")), 1)) : R("", !0)
          ]),
          e("p", _o, l(t(s)("settings.pluginSourceHelp")), 1),
          d.value ? (o(), r("p", bo, l(d.value), 1)) : R("", !0)
        ])
      ]),
      E[10] || (E[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", yo, [
        e("header", ko, [
          E[5] || (E[5] = ls('<span class="us-ico" aria-hidden="true" data-v-95a0aad4><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-95a0aad4><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-95a0aad4></rect></svg></span>', 1)),
          e("div", wo, [
            e("h3", $o, l(t(s)("settings.about.plugins")), 1),
            e("p", So, l(t(s)("settings.about.updateHint")), 1)
          ]),
          e("div", Co, [
            e("span", {
              class: ee(["us-count", { warn: U.value > 0 }])
            }, l(U.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: v.value,
              onClick: I
            }, l(t(s)(v.value ? "settings.about.checking" : "settings.about.check")), 9, xo)
          ])
        ]),
        h.value ? (o(), r("p", Mo, l(h.value), 1)) : R("", !0),
        w.value && w.value.status !== "idle" ? (o(), r("div", {
          key: 1,
          class: ee(["us-apply-banner", w.value.status])
        }, [
          e("div", Po, [
            E[6] || (E[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Ie(l(w.value.package), 1),
              w.value.version ? (o(), r("span", Eo, "@" + l(w.value.version), 1)) : (o(), r("span", Uo, " · main"))
            ]),
            w.value.mode === "source" ? (o(), r("span", Ao, l(t(s)("settings.about.sourceMode")), 1)) : R("", !0),
            e("span", To, l(D.value), 1)
          ]),
          w.value.error ? (o(), r("p", Io, l(w.value.error), 1)) : R("", !0),
          w.value.log ? (o(), r("pre", No, l(w.value.log), 1)) : R("", !0)
        ], 2)) : R("", !0),
        k.value ? (o(), r("p", Vo, l(k.value), 1)) : R("", !0),
        m.value ? (o(), r("div", Ro, [
          e("div", Lo, [
            e("span", null, l(t(s)("plugins.updatesColPlugin")), 1),
            e("span", null, l(t(s)("plugins.updatesColVersion")), 1),
            e("span", null, l(t(s)("plugins.updatesColStatus")), 1),
            E[7] || (E[7] = e("span", null, null, -1))
          ]),
          (o(!0), r(X, null, oe(m.value, (P) => (o(), r("div", {
            key: P.name,
            class: "us-row"
          }, [
            e("span", Oo, [
              e("span", {
                class: ee(["us-dot", P.error ? "bad" : P.has_update ? "warn" : P.latest ? "ok" : ""])
              }, null, 2),
              e("span", Do, l(P.name), 1)
            ]),
            e("span", zo, [
              e("em", null, "v" + l(P.version || "—"), 1),
              E[8] || (E[8] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: ee({ good: !!P.latest })
              }, l(P.latest ? `v${P.latest}` : "—"), 3)
            ]),
            e("span", {
              class: ee(["us-status", P.error ? "bad" : P.has_update ? "warn" : P.latest ? "ok" : ""])
            }, [
              e("span", Bo, l(P.error || t(s)(P.has_update ? "settings.about.available" : P.latest ? "settings.about.latest" : "settings.about.noRelease")), 1)
            ], 2),
            e("span", Fo, [
              P.can_update && P.has_update ? (o(), r("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: p(P.name),
                onClick: (Pe) => M(P.name, P.latest)
              }, l(p(P.name) ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, Ko)) : P.can_update ? (o(), r("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: p(P.name),
                onClick: (Pe) => M(P.name)
              }, l(p(P.name) ? t(s)("settings.about.updating") : t(s)("settings.about.syncNow")), 9, jo)) : R("", !0),
              P.repository ? (o(), r("a", {
                key: 2,
                class: "us-repo",
                href: P.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: P.repository
              }, l(t(s)("plugins.updatesColRepo")) + " ↗", 9, Ho)) : R("", !0)
            ])
          ]))), 128)),
          m.value.length ? R("", !0) : (o(), r("p", Yo, l(t(s)("settings.about.noPlugins")), 1))
        ])) : R("", !0),
        E[9] || (E[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), Jo = /* @__PURE__ */ Me(Xo, [["__scopeId", "data-v-95a0aad4"]]), Wo = { class: "content-card provider-panel" }, qo = { class: "pp-editor-head" }, Go = ["aria-label"], Zo = { class: "pp-editor-title" }, Qo = { class: "card-desc" }, ea = { class: "pp-section" }, ta = { class: "pp-section-title" }, sa = { class: "pp-grid" }, la = { class: "field" }, na = { class: "field" }, oa = {
  key: 0,
  class: "pp-req"
}, aa = ["placeholder"], ia = { class: "field pp-span" }, ra = ["placeholder"], ua = { class: "field" }, ca = { class: "helper-text" }, da = { class: "field" }, pa = { class: "helper-text" }, ha = { class: "pp-section" }, va = { class: "pp-section-head" }, ma = { class: "pp-section-title" }, ga = ["disabled"], fa = { class: "field" }, _a = { class: "pp-key" }, ba = ["type", "placeholder"], ya = {
  key: 0,
  class: "helper-text"
}, ka = {
  key: 1,
  class: "pp-probe err"
}, wa = {
  key: 2,
  class: "pp-probe ok"
}, $a = { class: "pp-section" }, Sa = { class: "pp-section-head" }, Ca = { class: "pp-section-title" }, xa = { class: "pp-count" }, Ma = ["disabled"], Pa = {
  key: 0,
  class: "pp-discovered"
}, Ea = { class: "pp-model-tools" }, Ua = ["placeholder"], Aa = { class: "pp-add-model" }, Ta = ["placeholder", "aria-label", "onKeydown"], Ia = ["disabled"], Na = {
  key: 1,
  class: "helper-text pp-add-error"
}, Va = {
  key: 2,
  class: "pp-models"
}, Ra = ["title"], La = ["value", "title", "onChange"], Oa = ["value"], Da = ["title", "disabled", "onClick"], za = ["title"], Ba = ["checked", "onChange"], Fa = ["title", "aria-label", "onClick"], Ka = {
  key: 0,
  class: "helper-text"
}, ja = {
  key: 3,
  class: "helper-text"
}, Ha = {
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
}, hi = { class: "pp-card-actions" }, vi = ["onClick"], mi = ["disabled", "onClick"], gi = ["disabled", "onClick"], fi = ["onClick"], _i = ["onClick"], bi = {
  key: 1,
  class: "pp-empty"
}, yi = /* @__PURE__ */ pe({
  __name: "ProviderPanel",
  setup(F) {
    const { t: s } = ve(), { confirm: v } = Ge(), m = ds(), k = x({}), w = x("list"), h = x(null), $ = x(""), V = x({ state: "idle" }), u = x([]), c = x(""), n = x(!1), a = x(!1), d = x(!1);
    Ne(async () => {
      await m.fetchAll();
      for (const b of m.providers) J(b);
    });
    function f(b) {
      return pt.find((C) => C.id === b) || null;
    }
    function y(b) {
      return b.name && b.name.trim() ? b.name.trim() : f(b.provider)?.name || b.provider;
    }
    function p(b) {
      return f(b.provider)?.logo || "";
    }
    const M = G(() => [
      { value: "chat", label: s("modelType.chat") },
      { value: "embedding", label: s("modelType.embedding") },
      { value: "rerank", label: s("modelType.rerank") },
      { value: "vision", label: s("modelType.vision") },
      { value: "tts", label: s("modelType.tts") },
      { value: "image", label: s("modelType.image") },
      { value: "audio", label: s("modelType.audio") }
    ]);
    function A(b) {
      return (h.value?.model_types || {})[b] || "chat";
    }
    function j(b, C) {
      if (!h.value) return;
      const S = { ...h.value.model_types || {} };
      !C || C === "chat" ? delete S[b] : S[b] = C, h.value.model_types = S;
    }
    function O(b) {
      const C = new Set(b.disabled_models || []);
      return b.models.filter((S) => !C.has(S));
    }
    function D(b) {
      return m.defaultProviderId === b.id;
    }
    function U(b) {
      const C = h.value;
      if (!C) return;
      const S = pt.find((Z) => Z.id === b);
      S?.baseUrl && !C.base_url && (C.base_url = S.baseUrl), C.format = S?.format || "";
    }
    async function I(b, C = "") {
      if (!b.base_url) return { state: "error", message: s("settings.baseUrlRequired") };
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
            api_key: C || ""
          })
        });
        if (!Z.ok) throw new Error(`HTTP ${Z.status}`);
        const Te = await Z.json(), Re = Math.round(performance.now() - S);
        return Te.source === "api" && Array.isArray(Te.models) && Te.models.length ? { state: "ok", count: Te.models.length, ms: Re, models: Te.models } : { state: "error", message: Te.error || s("settings.connectionFailed"), ms: Re };
      } catch (Z) {
        return { state: "error", message: Z instanceof Error ? Z.message : String(Z) };
      }
    }
    async function J(b, C = "") {
      k.value = { ...k.value, [b.id]: { state: "checking" } };
      const S = await I(b, C);
      k.value = { ...k.value, [b.id]: S };
    }
    function ie() {
      for (const b of m.providers) J(b);
    }
    function re() {
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
      }, $.value = "", V.value = { state: "idle" }, u.value = [], c.value = "", n.value = !1, a.value = !1, w.value = "edit";
    }
    function H(b) {
      h.value = {
        ...b,
        api_key: "",
        name: b.name || "",
        models: [...b.models],
        disabled_models: [...b.disabled_models || []],
        format: b.format || "",
        model_types: { ...b.model_types || {} }
      }, a.value = !!b.api_key_masked, $.value = "", V.value = { state: "idle" }, u.value = [], c.value = "", n.value = !1, w.value = "edit";
    }
    function E() {
      w.value = "list", h.value = null, $.value = "";
    }
    async function P() {
      const b = h.value;
      if (!b) return;
      $.value = "";
      const C = (b.name || "").trim();
      if (!b.base_url.trim()) {
        $.value = s("settings.baseUrlRequired");
        return;
      }
      if (b.provider === "custom" && !C) {
        $.value = s("settings.providerNameRequired");
        return;
      }
      if (!b.models.length) {
        $.value = s("settings.modelsRequired");
        return;
      }
      b.id || (b.id = `${b.provider}_${Date.now().toString(36)}`), b.name = C, b.disabled_models = (b.disabled_models || []).filter((S) => b.models.includes(S)), (!b.default_model || !b.models.includes(b.default_model) || b.disabled_models.includes(b.default_model)) && (b.default_model = O(b)[0] || b.models[0]), d.value = !0;
      try {
        await m.upsert({ ...b }), m.defaultProviderId || await m.setDefaults(b.id, b.default_model), E(), J(m.providers.find((S) => S.id === b.id) || b);
      } catch (S) {
        $.value = S instanceof Error ? S.message : String(S);
      } finally {
        d.value = !1;
      }
    }
    async function Pe(b) {
      if (await v({
        title: s("settings.remove"),
        message: `${s("settings.remove")} ${y(b)}?`,
        confirmLabel: s("settings.remove"),
        danger: !0
      }))
        try {
          await m.remove(b.id);
        } catch {
        }
    }
    async function Se(b) {
      try {
        await m.upsert({ ...b, enabled: !b.enabled });
      } catch {
      }
    }
    async function Ee(b) {
      const C = b.default_model || O(b)[0] || b.models[0] || "";
      try {
        await m.setDefaults(b.id, C);
      } catch {
      }
    }
    async function le() {
      const b = h.value;
      if (!b) return;
      V.value = { state: "checking" };
      const C = await I(b, b.api_key);
      V.value = C, C.state === "ok" && C.models && (u.value = C.models);
    }
    function ne() {
      const b = h.value;
      !b || !u.value.length || (b.models = [...u.value], b.disabled_models = (b.disabled_models || []).filter((C) => b.models.includes(C)), b.models.includes(b.default_model) || (b.default_model = ""));
    }
    function _e(b) {
      const C = h.value;
      if (!C) return;
      const S = new Set(C.disabled_models || []);
      S.has(b) ? S.delete(b) : S.add(b), C.disabled_models = [...S], S.has(C.default_model) && (C.default_model = O(C)[0] || "");
    }
    function we(b) {
      const C = h.value;
      C && (C.default_model = b, C.disabled_models = (C.disabled_models || []).filter((S) => S !== b));
    }
    const Ue = x(""), me = x("");
    function Ce() {
      const b = h.value;
      if (!b) return;
      const C = Ue.value.trim();
      if (me.value = "", !!C) {
        if (b.models.includes(C)) {
          me.value = s("settings.modelExists", { name: C });
          return;
        }
        b.models = [...b.models, C], b.disabled_models = (b.disabled_models || []).filter((S) => S !== C), b.default_model || (b.default_model = C), Ue.value = "";
      }
    }
    function be(b) {
      const C = h.value;
      if (C) {
        if (C.models = C.models.filter((S) => S !== b), C.disabled_models = (C.disabled_models || []).filter((S) => S !== b), C.model_types) {
          const S = { ...C.model_types };
          delete S[b], C.model_types = S;
        }
        C.default_model === b && (C.default_model = O(C)[0] || C.models[0] || "");
      }
    }
    function ye(b) {
      const C = h.value;
      C && (C.disabled_models = b ? [] : [...C.models]);
    }
    function Ae() {
      const b = h.value;
      if (!b) return;
      const C = new Set(b.disabled_models || []);
      b.disabled_models = b.models.filter((S) => !C.has(S));
    }
    const ue = G(() => {
      const b = h.value?.models || [], C = c.value.trim().toLowerCase();
      return C ? b.filter((S) => S.toLowerCase().includes(C)) : b;
    }), he = G(() => h.value ? O(h.value).length : 0);
    function ze() {
      return s("settings.fetchedSummary", { n: u.value.length });
    }
    const je = G(() => [
      { value: "", label: s("settings.formatAuto") },
      { value: "openai", label: s("settings.formatOpenai") },
      { value: "anthropic", label: s("settings.formatAnthropic") }
    ]), Be = G(
      () => pt.map((b) => ({ value: b.id, label: s(`providers.${b.id}.name`, b.name) }))
    );
    return (b, C) => (o(), r("div", Wo, [
      w.value === "edit" && h.value ? (o(), r(X, { key: 0 }, [
        e("div", qo, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: E,
            "aria-label": t(s)("settings.back")
          }, [...C[12] || (C[12] = [
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
            e("h2", null, l(h.value.id ? t(s)("settings.edit") : t(s)("settings.addProvider")), 1),
            e("p", Qo, l(t(s)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: ee(["pp-status", V.value.state])
          }, [
            C[13] || (C[13] = e("span", { class: "pp-dot" }, null, -1)),
            Ie(" " + l(V.value.state === "checking" ? t(s)("settings.testing") : V.value.state === "ok" ? t(s)("settings.connectionOk") : V.value.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", ea, [
          e("h3", ta, l(t(s)("settings.providerSectionBasic")), 1),
          e("div", sa, [
            e("div", la, [
              e("label", null, l(t(s)("wizard.provider")), 1),
              ae(t(De), {
                modelValue: h.value.provider,
                "onUpdate:modelValue": C[0] || (C[0] = (S) => h.value.provider = S),
                class: "input",
                "aria-label": t(s)("wizard.provider"),
                options: Be.value,
                onChange: U
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", na, [
              e("label", null, [
                Ie(l(t(s)("settings.providerName")) + " ", 1),
                h.value.provider === "custom" ? (o(), r("span", oa, "*")) : R("", !0)
              ]),
              B(e("input", {
                "onUpdate:modelValue": C[1] || (C[1] = (S) => h.value.name = S),
                placeholder: t(s)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, aa), [
                [Y, h.value.name]
              ])
            ]),
            e("div", ia, [
              e("label", null, l(t(s)("wizard.baseUrl")), 1),
              B(e("input", {
                "onUpdate:modelValue": C[2] || (C[2] = (S) => h.value.base_url = S),
                placeholder: t(s)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, ra), [
                [Y, h.value.base_url]
              ])
            ]),
            e("div", ua, [
              e("label", null, l(t(s)("settings.apiFormat")), 1),
              ae(t(De), {
                modelValue: h.value.format,
                "onUpdate:modelValue": C[3] || (C[3] = (S) => h.value.format = S),
                class: "input",
                "aria-label": t(s)("settings.apiFormat"),
                options: je.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", ca, l(t(s)("settings.apiFormatHint")), 1)
            ]),
            e("div", da, [
              e("label", null, l(t(s)("wizard.defaultModel")), 1),
              ae(t(De), {
                modelValue: h.value.default_model,
                "onUpdate:modelValue": C[4] || (C[4] = (S) => h.value.default_model = S),
                class: "input",
                "aria-label": t(s)("wizard.defaultModel"),
                options: O(h.value)
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", pa, l(t(s)("settings.defaultModelHint")), 1)
            ])
          ])
        ]),
        e("section", ha, [
          e("div", va, [
            e("h3", ma, l(t(s)("settings.providerSectionAuth")), 1),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: V.value.state === "checking",
              onClick: le
            }, l(V.value.state === "checking" ? t(s)("settings.testing") : t(s)("settings.testConnection")), 9, ga)
          ]),
          e("div", fa, [
            e("label", null, l(t(s)("wizard.apiKey")), 1),
            e("div", _a, [
              B(e("input", {
                "onUpdate:modelValue": C[5] || (C[5] = (S) => h.value.api_key = S),
                type: n.value ? "text" : "password",
                placeholder: a.value ? t(s)("settings.apiKeyKept") : t(s)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, ba), [
                [ns, h.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: C[6] || (C[6] = (S) => n.value = !n.value)
              }, l(n.value ? t(s)("settings.hideKey") : t(s)("settings.showKey")), 1)
            ]),
            a.value ? (o(), r("p", ya, l(t(s)("settings.apiKeyKeptHint")), 1)) : R("", !0),
            V.value.state === "error" ? (o(), r("p", ka, l(V.value.message), 1)) : V.value.state === "ok" ? (o(), r("p", wa, l(t(s)("settings.connectionOk")) + " · " + l(ze()) + " · " + l(V.value.ms) + "ms ", 1)) : R("", !0)
          ])
        ]),
        e("section", $a, [
          e("div", Sa, [
            e("h3", Ca, [
              Ie(l(t(s)("settings.providerSectionModels")) + " ", 1),
              e("span", xa, l(he.value) + "/" + l(h.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: V.value.state === "checking",
              onClick: le
            }, l(t(s)("settings.fetchModels")), 9, Ma)
          ]),
          u.value.length && u.value.join("\0") !== h.value.models.join("\0") ? (o(), r("div", Pa, [
            e("span", null, l(ze()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: ne
            }, l(t(s)("settings.applyFetched")), 1)
          ])) : R("", !0),
          e("div", Ea, [
            B(e("input", {
              "onUpdate:modelValue": C[7] || (C[7] = (S) => c.value = S),
              class: "input pp-search",
              placeholder: t(s)("settings.searchModels")
            }, null, 8, Ua), [
              [Y, c.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: C[8] || (C[8] = (S) => ye(!0))
            }, l(t(s)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: C[9] || (C[9] = (S) => Ae())
            }, l(t(s)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: C[10] || (C[10] = (S) => ye(!1))
            }, l(t(s)("settings.clearSelection")), 1)
          ]),
          e("div", Aa, [
            B(e("input", {
              "onUpdate:modelValue": C[11] || (C[11] = (S) => Ue.value = S),
              class: "input",
              placeholder: t(s)("settings.addModelPlaceholder"),
              "aria-label": t(s)("settings.addModelPlaceholder"),
              onKeydown: mt(Oe(Ce, ["prevent"]), ["enter"])
            }, null, 40, Ta), [
              [Y, Ue.value]
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: !Ue.value.trim(),
              onClick: Ce
            }, l(t(s)("settings.addModel")), 9, Ia)
          ]),
          me.value ? (o(), r("p", Na, l(me.value), 1)) : R("", !0),
          h.value.models.length ? (o(), r("div", Va, [
            (o(!0), r(X, null, oe(ue.value, (S) => (o(), r("div", {
              key: S,
              class: ee(["pp-model", { off: (h.value.disabled_models || []).includes(S) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: S
              }, l(S), 9, Ra),
              e("select", {
                class: ee(["pp-type", { tagged: A(S) !== "chat" }]),
                value: A(S),
                title: t(s)("settings.providerModelType"),
                onChange: (Z) => j(S, Z.target.value)
              }, [
                (o(!0), r(X, null, oe(M.value, (Z) => (o(), r("option", {
                  key: Z.value,
                  value: Z.value
                }, l(Z.label), 9, Oa))), 128))
              ], 42, La),
              h.value.default_model !== S ? (o(), r("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: t(s)("settings.makeDefault"),
                disabled: (h.value.disabled_models || []).includes(S),
                onClick: (Z) => we(S)
              }, "☆", 8, Da)) : (o(), r("span", {
                key: 1,
                class: "pp-star on",
                title: t(s)("wizard.defaultModel")
              }, "★", 8, za)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(h.value.disabled_models || []).includes(S),
                onChange: (Z) => _e(S)
              }, null, 40, Ba),
              e("button", {
                class: "pp-remove",
                type: "button",
                title: t(s)("settings.removeModel", { name: S }),
                "aria-label": t(s)("settings.removeModel", { name: S }),
                onClick: (Z) => be(S)
              }, "×", 8, Fa)
            ], 2))), 128)),
            ue.value.length ? R("", !0) : (o(), r("p", Ka, l(t(s)("settings.searchModels")), 1))
          ])) : (o(), r("p", ja, l(t(s)("settings.noModelsYet")), 1))
        ]),
        $.value ? (o(), r("p", Ha, l($.value), 1)) : R("", !0),
        e("div", Ya, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: d.value,
            onClick: P
          }, l(d.value ? t(s)("settings.saving") : t(s)("settings.save")), 9, Xa),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: E
          }, l(t(s)("settings.cancel")), 1)
        ])
      ], 64)) : (o(), r(X, { key: 1 }, [
        e("div", Ja, [
          e("div", null, [
            e("h2", null, l(t(s)("settings.tabs.provider")), 1),
            e("p", Wa, l(t(s)("settings.providerDesc")), 1)
          ]),
          e("div", qa, [
            e("button", {
              class: "btn btn-ghost sm",
              type: "button",
              onClick: ie
            }, l(t(s)("settings.refreshStatus")), 1),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              onClick: re
            }, "+ " + l(t(s)("settings.addProvider")), 1)
          ])
        ]),
        t(m).providers.length ? (o(), r("div", Ga, [
          (o(!0), r(X, null, oe(t(m).providers, (S) => (o(), r("article", {
            key: S.id,
            class: ee(["pp-card", { off: !S.enabled, default: D(S) }])
          }, [
            e("header", Za, [
              e("span", Qa, [
                p(S) ? (o(), r("img", {
                  key: 0,
                  src: p(S),
                  alt: y(S)
                }, null, 8, ei)) : (o(), r("svg", ti, [...C[14] || (C[14] = [
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
                D(S) ? (o(), r("span", oi, l(t(s)("settings.default")), 1)) : R("", !0),
                e("span", ai, l(O(S).length) + "/" + l(S.models.length), 1)
              ])
            ]),
            e("div", ii, [
              e("span", {
                class: ee(["pp-status", k.value[S.id]?.state || "idle"])
              }, [
                C[15] || (C[15] = e("span", { class: "pp-dot" }, null, -1)),
                Ie(" " + l(k.value[S.id]?.state === "checking" ? t(s)("settings.testing") : k.value[S.id]?.state === "ok" ? t(s)("settings.connectionOk") : k.value[S.id]?.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
              ], 2),
              k.value[S.id]?.state === "ok" ? (o(), r("span", ri, l(t(s)("settings.fetchedSummary", { n: k.value[S.id]?.count || 0 })) + " · " + l(k.value[S.id]?.ms) + "ms", 1)) : k.value[S.id]?.state === "error" ? (o(), r("span", {
                key: 1,
                class: "pp-meta err",
                title: k.value[S.id]?.message
              }, l(k.value[S.id]?.message), 9, ui)) : R("", !0)
            ]),
            e("div", ci, [
              (o(!0), r(X, null, oe(O(S).slice(0, 6), (Z) => (o(), r("span", {
                key: Z,
                class: "pp-chip"
              }, l(Z), 1))), 128)),
              O(S).length > 6 ? (o(), r("span", di, "+" + l(O(S).length - 6), 1)) : R("", !0),
              S.models.length ? R("", !0) : (o(), r("span", pi, l(t(s)("settings.noModelsYet")), 1))
            ]),
            e("footer", hi, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (Z) => H(S)
              }, l(t(s)("settings.edit")), 9, vi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: k.value[S.id]?.state === "checking",
                onClick: (Z) => J(S)
              }, l(t(s)("settings.testConnection")), 9, mi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: D(S),
                onClick: (Z) => Ee(S)
              }, l(t(s)("settings.makeDefault")), 9, gi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (Z) => Se(S)
              }, l(S.enabled ? t(s)("settings.disableProvider") : t(s)("settings.enableProvider")), 9, fi),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (Z) => Pe(S)
              }, l(t(s)("settings.remove")), 9, _i)
            ])
          ], 2))), 128))
        ])) : (o(), r("div", bi, [
          e("p", null, l(t(s)("settings.noProviders")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: re
          }, "+ " + l(t(s)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), ki = /* @__PURE__ */ Me(yi, [["__scopeId", "data-v-d93aed7e"]]), wi = { class: "pairing-panel" }, $i = {
  key: 0,
  class: "pairing-error",
  role: "alert"
}, Si = { key: 1 }, Ci = { key: 0 }, xi = ["onClick"], Mi = ["onClick"], Pi = ["disabled", "onClick"], Ei = /* @__PURE__ */ pe({
  __name: "PairingPanel",
  setup(F) {
    const { t: s } = ve(), { confirm: v } = Ge(), m = x([]), k = x([]), w = x(""), h = x("");
    let $;
    async function V() {
      try {
        const n = await fetch("/api/pairing/pending");
        if (!n.ok) throw new Error(await n.text());
        m.value = (await n.json()).requests || [];
      } catch (n) {
        w.value = n.message;
      }
      try {
        const n = await fetch("/api/pairing/devices");
        n.ok && (k.value = (await n.json()).devices || []);
      } catch {
      }
    }
    async function u(n, a) {
      try {
        const d = await fetch("/api/pairing/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...n, allow: a })
        });
        if (!d.ok) throw new Error(await d.text());
        await V();
      } catch (d) {
        w.value = d.message;
      }
    }
    async function c(n) {
      if (!(h.value || !await v({
        title: s("pairing.disconnect"),
        message: s("pairing.disconnectConfirm", { name: n.name || n.id }),
        confirmLabel: s("pairing.disconnect"),
        danger: !0
      }))) {
        h.value = n.id;
        try {
          const d = await fetch("/api/pairing/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: n.id })
          });
          if (!d.ok) throw new Error(await d.text());
          await V();
        } catch (d) {
          w.value = d.message;
        } finally {
          h.value = "";
        }
      }
    }
    return Ne(() => {
      V(), $ = setInterval(V, 3e3);
    }), lt(() => clearInterval($)), (n, a) => (o(), r("section", wi, [
      e("h3", null, l(t(s)("pairing.title")), 1),
      e("p", null, l(t(s)("pairing.hint")), 1),
      w.value ? (o(), r("p", $i, l(w.value), 1)) : R("", !0),
      m.value.length ? R("", !0) : (o(), r("p", Si, l(t(s)("pairing.empty")), 1)),
      ae(Tt, {
        tag: "div",
        name: "pair",
        class: "pairing-list"
      }, {
        default: et(() => [
          (o(!0), r(X, null, oe(m.value, (d) => (o(), r("article", {
            key: d.id
          }, [
            e("strong", null, l(d.name), 1),
            e("code", null, l(d.code), 1),
            d.approved ? (o(), r("span", Ci, l(t(s)("pairing.approved")), 1)) : (o(), r(X, { key: 1 }, [
              e("button", {
                type: "button",
                class: "btn btn-ghost",
                onClick: (f) => u(d, !1)
              }, l(t(s)("pairing.deny")), 9, xi),
              e("button", {
                type: "button",
                class: "btn btn-primary",
                onClick: (f) => u(d, !0)
              }, l(t(s)("pairing.allow")), 9, Mi)
            ], 64))
          ]))), 128))
        ]),
        _: 1
      }),
      k.value.length ? (o(), r(X, { key: 2 }, [
        e("h4", null, l(t(s)("pairing.pairedCount", { n: k.value.length })), 1),
        ae(Tt, {
          tag: "div",
          name: "pair",
          class: "pairing-list"
        }, {
          default: et(() => [
            (o(!0), r(X, null, oe(k.value, (d) => (o(), r("article", {
              key: d.id
            }, [
              e("strong", null, l(d.name || d.id), 1),
              e("button", {
                type: "button",
                class: "btn btn-danger-tonal",
                disabled: h.value === d.id,
                onClick: (f) => c(d)
              }, l(h.value === d.id ? t(s)("pairing.disconnecting") : t(s)("pairing.disconnect")), 9, Pi)
            ]))), 128))
          ]),
          _: 1
        })
      ], 64)) : R("", !0)
    ]));
  }
}), Ui = /* @__PURE__ */ Me(Ei, [["__scopeId", "data-v-c18959f6"]]), Ai = { class: "content-card" }, Ti = { class: "card-desc" }, Ii = { class: "field" }, Ni = ["aria-label"], Vi = ["aria-pressed", "onClick"], Ri = /* @__PURE__ */ pe({
  __name: "GeneralPanel",
  setup(F) {
    const { t: s } = ve(), v = x(ps());
    function m(k) {
      v.value = k, vs(k);
    }
    return (k, w) => (o(), r("div", Ai, [
      e("h2", null, l(t(s)("settings.tabs.general")), 1),
      e("p", Ti, l(t(s)("settings.generalDesc")), 1),
      e("div", Ii, [
        e("label", null, l(t(s)("settings.language")), 1),
        e("div", {
          class: "segmented",
          role: "group",
          "aria-label": t(s)("settings.language")
        }, [
          (o(!0), r(X, null, oe(t(hs), (h) => (o(), r("button", {
            key: h.code,
            class: ee(["seg", { active: v.value === h.code }]),
            "aria-pressed": v.value === h.code,
            onClick: ($) => m(h.code)
          }, l(h.label), 11, Vi))), 128))
        ], 8, Ni)
      ]),
      ae(Ui)
    ]));
  }
});
var Ye;
((F) => {
  const h = class h {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code with the given version number,
    // error correction level, data codeword bytes, and mask number.
    // This is a low-level API that most users should not use directly.
    // A mid-level API is the encodeSegments() function.
    constructor(u, c, n, a) {
      W(this, "version");
      W(this, "errorCorrectionLevel");
      /*-- Fields --*/
      // The width and height of this QR Code, measured in modules, between
      // 21 and 177 (inclusive). This is equal to version * 4 + 17.
      W(this, "size");
      // The index of the mask pattern used in this QR Code, which is between 0 and 7 (inclusive).
      // Even if a QR Code is created with automatic masking requested (mask = -1),
      // the resulting object still has a mask value between 0 and 7.
      W(this, "mask");
      // The modules of this QR Code (false = light, true = dark).
      // Immutable after constructor finishes. Accessed through getModule().
      W(this, "modules", []);
      // Indicates function modules that are not subjected to masking. Discarded when constructor finishes.
      W(this, "isFunction", []);
      if (this.version = u, this.errorCorrectionLevel = c, u < h.MIN_VERSION || u > h.MAX_VERSION)
        throw new RangeError("Version value out of range");
      if (a < -1 || a > 7)
        throw new RangeError("Mask value out of range");
      this.size = u * 4 + 17;
      let d = [];
      for (let y = 0; y < this.size; y++)
        d.push(!1);
      for (let y = 0; y < this.size; y++)
        this.modules.push(d.slice()), this.isFunction.push(d.slice());
      this.drawFunctionPatterns();
      const f = this.addEccAndInterleave(n);
      if (this.drawCodewords(f), a == -1) {
        let y = 1e9;
        for (let p = 0; p < 8; p++) {
          this.applyMask(p), this.drawFormatBits(p);
          const M = this.getPenaltyScore();
          M < y && (a = p, y = M), this.applyMask(p);
        }
      }
      k(0 <= a && a <= 7), this.mask = a, this.applyMask(a), this.drawFormatBits(a), this.isFunction = [];
    }
    /*-- Static factory functions (high level) --*/
    // Returns a QR Code representing the given Unicode text string at the given error correction level.
    // As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer
    // Unicode code points (not UTF-16 code units) if the low error correction level is used. The smallest possible
    // QR Code version is automatically chosen for the output. The ECC level of the result may be higher than the
    // ecl argument if it can be done without increasing the version.
    static encodeText(u, c) {
      const n = F.QrSegment.makeSegments(u);
      return h.encodeSegments(n, c);
    }
    // Returns a QR Code representing the given binary data at the given error correction level.
    // This function always encodes using the binary segment mode, not any text mode. The maximum number of
    // bytes allowed is 2953. The smallest possible QR Code version is automatically chosen for the output.
    // The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
    static encodeBinary(u, c) {
      const n = F.QrSegment.makeBytes(u);
      return h.encodeSegments([n], c);
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
    static encodeSegments(u, c, n = 1, a = 40, d = -1, f = !0) {
      if (!(h.MIN_VERSION <= n && n <= a && a <= h.MAX_VERSION) || d < -1 || d > 7)
        throw new RangeError("Invalid value");
      let y, p;
      for (y = n; ; y++) {
        const O = h.getNumDataCodewords(y, c) * 8, D = w.getTotalBits(u, y);
        if (D <= O) {
          p = D;
          break;
        }
        if (y >= a)
          throw new RangeError("Data too long");
      }
      for (const O of [h.Ecc.MEDIUM, h.Ecc.QUARTILE, h.Ecc.HIGH])
        f && p <= h.getNumDataCodewords(y, O) * 8 && (c = O);
      let M = [];
      for (const O of u) {
        v(O.mode.modeBits, 4, M), v(O.numChars, O.mode.numCharCountBits(y), M);
        for (const D of O.getData())
          M.push(D);
      }
      k(M.length == p);
      const A = h.getNumDataCodewords(y, c) * 8;
      k(M.length <= A), v(0, Math.min(4, A - M.length), M), v(0, (8 - M.length % 8) % 8, M), k(M.length % 8 == 0);
      for (let O = 236; M.length < A; O ^= 253)
        v(O, 8, M);
      let j = [];
      for (; j.length * 8 < M.length; )
        j.push(0);
      return M.forEach((O, D) => j[D >>> 3] |= O << 7 - (D & 7)), new h(y, c, j, d);
    }
    /*-- Accessor methods --*/
    // Returns the color of the module (pixel) at the given coordinates, which is false
    // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
    // If the given coordinates are out of bounds, then false (light) is returned.
    getModule(u, c) {
      return 0 <= u && u < this.size && 0 <= c && c < this.size && this.modules[c][u];
    }
    /*-- Private helper methods for constructor: Drawing function modules --*/
    // Reads this object's version field, and draws and marks all function modules.
    drawFunctionPatterns() {
      for (let n = 0; n < this.size; n++)
        this.setFunctionModule(6, n, n % 2 == 0), this.setFunctionModule(n, 6, n % 2 == 0);
      this.drawFinderPattern(3, 3), this.drawFinderPattern(this.size - 4, 3), this.drawFinderPattern(3, this.size - 4);
      const u = this.getAlignmentPatternPositions(), c = u.length;
      for (let n = 0; n < c; n++)
        for (let a = 0; a < c; a++)
          n == 0 && a == 0 || n == 0 && a == c - 1 || n == c - 1 && a == 0 || this.drawAlignmentPattern(u[n], u[a]);
      this.drawFormatBits(0), this.drawVersion();
    }
    // Draws two copies of the format bits (with its own error correction code)
    // based on the given mask and this object's error correction level field.
    drawFormatBits(u) {
      const c = this.errorCorrectionLevel.formatBits << 3 | u;
      let n = c;
      for (let d = 0; d < 10; d++)
        n = n << 1 ^ (n >>> 9) * 1335;
      const a = (c << 10 | n) ^ 21522;
      k(a >>> 15 == 0);
      for (let d = 0; d <= 5; d++)
        this.setFunctionModule(8, d, m(a, d));
      this.setFunctionModule(8, 7, m(a, 6)), this.setFunctionModule(8, 8, m(a, 7)), this.setFunctionModule(7, 8, m(a, 8));
      for (let d = 9; d < 15; d++)
        this.setFunctionModule(14 - d, 8, m(a, d));
      for (let d = 0; d < 8; d++)
        this.setFunctionModule(this.size - 1 - d, 8, m(a, d));
      for (let d = 8; d < 15; d++)
        this.setFunctionModule(8, this.size - 15 + d, m(a, d));
      this.setFunctionModule(8, this.size - 8, !0);
    }
    // Draws two copies of the version bits (with its own error correction code),
    // based on this object's version field, iff 7 <= version <= 40.
    drawVersion() {
      if (this.version < 7)
        return;
      let u = this.version;
      for (let n = 0; n < 12; n++)
        u = u << 1 ^ (u >>> 11) * 7973;
      const c = this.version << 12 | u;
      k(c >>> 18 == 0);
      for (let n = 0; n < 18; n++) {
        const a = m(c, n), d = this.size - 11 + n % 3, f = Math.floor(n / 3);
        this.setFunctionModule(d, f, a), this.setFunctionModule(f, d, a);
      }
    }
    // Draws a 9*9 finder pattern including the border separator,
    // with the center module at (x, y). Modules can be out of bounds.
    drawFinderPattern(u, c) {
      for (let n = -4; n <= 4; n++)
        for (let a = -4; a <= 4; a++) {
          const d = Math.max(Math.abs(a), Math.abs(n)), f = u + a, y = c + n;
          0 <= f && f < this.size && 0 <= y && y < this.size && this.setFunctionModule(f, y, d != 2 && d != 4);
        }
    }
    // Draws a 5*5 alignment pattern, with the center module
    // at (x, y). All modules must be in bounds.
    drawAlignmentPattern(u, c) {
      for (let n = -2; n <= 2; n++)
        for (let a = -2; a <= 2; a++)
          this.setFunctionModule(u + a, c + n, Math.max(Math.abs(a), Math.abs(n)) != 1);
    }
    // Sets the color of a module and marks it as a function module.
    // Only used by the constructor. Coordinates must be in bounds.
    setFunctionModule(u, c, n) {
      this.modules[c][u] = n, this.isFunction[c][u] = !0;
    }
    /*-- Private helper methods for constructor: Codewords and masking --*/
    // Returns a new byte string representing the given data with the appropriate error correction
    // codewords appended to it, based on this object's version and error correction level.
    addEccAndInterleave(u) {
      const c = this.version, n = this.errorCorrectionLevel;
      if (u.length != h.getNumDataCodewords(c, n))
        throw new RangeError("Invalid argument");
      const a = h.NUM_ERROR_CORRECTION_BLOCKS[n.ordinal][c], d = h.ECC_CODEWORDS_PER_BLOCK[n.ordinal][c], f = Math.floor(h.getNumRawDataModules(c) / 8), y = a - f % a, p = Math.floor(f / a);
      let M = [];
      const A = h.reedSolomonComputeDivisor(d);
      for (let O = 0, D = 0; O < a; O++) {
        let U = u.slice(D, D + p - d + (O < y ? 0 : 1));
        D += U.length;
        const I = h.reedSolomonComputeRemainder(U, A);
        O < y && U.push(0), M.push(U.concat(I));
      }
      let j = [];
      for (let O = 0; O < M[0].length; O++)
        M.forEach((D, U) => {
          (O != p - d || U >= y) && j.push(D[O]);
        });
      return k(j.length == f), j;
    }
    // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
    // data area of this QR Code. Function modules need to be marked off before this is called.
    drawCodewords(u) {
      if (u.length != Math.floor(h.getNumRawDataModules(this.version) / 8))
        throw new RangeError("Invalid argument");
      let c = 0;
      for (let n = this.size - 1; n >= 1; n -= 2) {
        n == 6 && (n = 5);
        for (let a = 0; a < this.size; a++)
          for (let d = 0; d < 2; d++) {
            const f = n - d, p = (n + 1 & 2) == 0 ? this.size - 1 - a : a;
            !this.isFunction[p][f] && c < u.length * 8 && (this.modules[p][f] = m(u[c >>> 3], 7 - (c & 7)), c++);
          }
      }
      k(c == u.length * 8);
    }
    // XORs the codeword modules in this QR Code with the given mask pattern.
    // The function modules must be marked and the codeword bits must be drawn
    // before masking. Due to the arithmetic of XOR, calling applyMask() with
    // the same mask value a second time will undo the mask. A final well-formed
    // QR Code needs exactly one (not zero, two, etc.) mask applied.
    applyMask(u) {
      if (u < 0 || u > 7)
        throw new RangeError("Mask value out of range");
      for (let c = 0; c < this.size; c++)
        for (let n = 0; n < this.size; n++) {
          let a;
          switch (u) {
            case 0:
              a = (n + c) % 2 == 0;
              break;
            case 1:
              a = c % 2 == 0;
              break;
            case 2:
              a = n % 3 == 0;
              break;
            case 3:
              a = (n + c) % 3 == 0;
              break;
            case 4:
              a = (Math.floor(n / 3) + Math.floor(c / 2)) % 2 == 0;
              break;
            case 5:
              a = n * c % 2 + n * c % 3 == 0;
              break;
            case 6:
              a = (n * c % 2 + n * c % 3) % 2 == 0;
              break;
            case 7:
              a = ((n + c) % 2 + n * c % 3) % 2 == 0;
              break;
            default:
              throw new Error("Unreachable");
          }
          !this.isFunction[c][n] && a && (this.modules[c][n] = !this.modules[c][n]);
        }
    }
    // Calculates and returns the penalty score based on state of this QR Code's current modules.
    // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
    getPenaltyScore() {
      let u = 0;
      for (let d = 0; d < this.size; d++) {
        let f = !1, y = 0, p = [0, 0, 0, 0, 0, 0, 0];
        for (let M = 0; M < this.size; M++)
          this.modules[d][M] == f ? (y++, y == 5 ? u += h.PENALTY_N1 : y > 5 && u++) : (this.finderPenaltyAddHistory(y, p), f || (u += this.finderPenaltyCountPatterns(p) * h.PENALTY_N3), f = this.modules[d][M], y = 1);
        u += this.finderPenaltyTerminateAndCount(f, y, p) * h.PENALTY_N3;
      }
      for (let d = 0; d < this.size; d++) {
        let f = !1, y = 0, p = [0, 0, 0, 0, 0, 0, 0];
        for (let M = 0; M < this.size; M++)
          this.modules[M][d] == f ? (y++, y == 5 ? u += h.PENALTY_N1 : y > 5 && u++) : (this.finderPenaltyAddHistory(y, p), f || (u += this.finderPenaltyCountPatterns(p) * h.PENALTY_N3), f = this.modules[M][d], y = 1);
        u += this.finderPenaltyTerminateAndCount(f, y, p) * h.PENALTY_N3;
      }
      for (let d = 0; d < this.size - 1; d++)
        for (let f = 0; f < this.size - 1; f++) {
          const y = this.modules[d][f];
          y == this.modules[d][f + 1] && y == this.modules[d + 1][f] && y == this.modules[d + 1][f + 1] && (u += h.PENALTY_N2);
        }
      let c = 0;
      for (const d of this.modules)
        c = d.reduce((f, y) => f + (y ? 1 : 0), c);
      const n = this.size * this.size, a = Math.ceil(Math.abs(c * 20 - n * 10) / n) - 1;
      return k(0 <= a && a <= 9), u += a * h.PENALTY_N4, k(0 <= u && u <= 2568888), u;
    }
    /*-- Private helper functions --*/
    // Returns an ascending list of positions of alignment patterns for this version number.
    // Each position is in the range [0,177), and are used on both the x and y axes.
    // This could be implemented as lookup table of 40 variable-length lists of integers.
    getAlignmentPatternPositions() {
      if (this.version == 1)
        return [];
      {
        const u = Math.floor(this.version / 7) + 2, c = Math.floor((this.version * 8 + u * 3 + 5) / (u * 4 - 4)) * 2;
        let n = [6];
        for (let a = this.size - 7; n.length < u; a -= c)
          n.splice(1, 0, a);
        return n;
      }
    }
    // Returns the number of data bits that can be stored in a QR Code of the given version number, after
    // all function modules are excluded. This includes remainder bits, so it might not be a multiple of 8.
    // The result is in the range [208, 29648]. This could be implemented as a 40-entry lookup table.
    static getNumRawDataModules(u) {
      if (u < h.MIN_VERSION || u > h.MAX_VERSION)
        throw new RangeError("Version number out of range");
      let c = (16 * u + 128) * u + 64;
      if (u >= 2) {
        const n = Math.floor(u / 7) + 2;
        c -= (25 * n - 10) * n - 55, u >= 7 && (c -= 36);
      }
      return k(208 <= c && c <= 29648), c;
    }
    // Returns the number of 8-bit data (i.e. not error correction) codewords contained in any
    // QR Code of the given version number and error correction level, with remainder bits discarded.
    // This stateless pure function could be implemented as a (40*4)-cell lookup table.
    static getNumDataCodewords(u, c) {
      return Math.floor(h.getNumRawDataModules(u) / 8) - h.ECC_CODEWORDS_PER_BLOCK[c.ordinal][u] * h.NUM_ERROR_CORRECTION_BLOCKS[c.ordinal][u];
    }
    // Returns a Reed-Solomon ECC generator polynomial for the given degree. This could be
    // implemented as a lookup table over all possible parameter values, instead of as an algorithm.
    static reedSolomonComputeDivisor(u) {
      if (u < 1 || u > 255)
        throw new RangeError("Degree out of range");
      let c = [];
      for (let a = 0; a < u - 1; a++)
        c.push(0);
      c.push(1);
      let n = 1;
      for (let a = 0; a < u; a++) {
        for (let d = 0; d < c.length; d++)
          c[d] = h.reedSolomonMultiply(c[d], n), d + 1 < c.length && (c[d] ^= c[d + 1]);
        n = h.reedSolomonMultiply(n, 2);
      }
      return c;
    }
    // Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.
    static reedSolomonComputeRemainder(u, c) {
      let n = c.map((a) => 0);
      for (const a of u) {
        const d = a ^ n.shift();
        n.push(0), c.forEach((f, y) => n[y] ^= h.reedSolomonMultiply(f, d));
      }
      return n;
    }
    // Returns the product of the two given field elements modulo GF(2^8/0x11D). The arguments and result
    // are unsigned 8-bit integers. This could be implemented as a lookup table of 256*256 entries of uint8.
    static reedSolomonMultiply(u, c) {
      if (u >>> 8 || c >>> 8)
        throw new RangeError("Byte out of range");
      let n = 0;
      for (let a = 7; a >= 0; a--)
        n = n << 1 ^ (n >>> 7) * 285, n ^= (c >>> a & 1) * u;
      return k(n >>> 8 == 0), n;
    }
    // Can only be called immediately after a light run is added, and
    // returns either 0, 1, or 2. A helper function for getPenaltyScore().
    finderPenaltyCountPatterns(u) {
      const c = u[1];
      k(c <= this.size * 3);
      const n = c > 0 && u[2] == c && u[3] == c * 3 && u[4] == c && u[5] == c;
      return (n && u[0] >= c * 4 && u[6] >= c ? 1 : 0) + (n && u[6] >= c * 4 && u[0] >= c ? 1 : 0);
    }
    // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
    finderPenaltyTerminateAndCount(u, c, n) {
      return u && (this.finderPenaltyAddHistory(c, n), c = 0), c += this.size, this.finderPenaltyAddHistory(c, n), this.finderPenaltyCountPatterns(n);
    }
    // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
    finderPenaltyAddHistory(u, c) {
      c[0] == 0 && (u += this.size), c.pop(), c.unshift(u);
    }
  };
  /*-- Constants and tables --*/
  // The minimum version number supported in the QR Code Model 2 standard.
  W(h, "MIN_VERSION", 1), // The maximum version number supported in the QR Code Model 2 standard.
  W(h, "MAX_VERSION", 40), // For use in getPenaltyScore(), when evaluating which mask is best.
  W(h, "PENALTY_N1", 3), W(h, "PENALTY_N2", 3), W(h, "PENALTY_N3", 40), W(h, "PENALTY_N4", 10), W(h, "ECC_CODEWORDS_PER_BLOCK", [
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
  ]), W(h, "NUM_ERROR_CORRECTION_BLOCKS", [
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
  function v(V, u, c) {
    if (u < 0 || u > 31 || V >>> u)
      throw new RangeError("Value out of range");
    for (let n = u - 1; n >= 0; n--)
      c.push(V >>> n & 1);
  }
  function m(V, u) {
    return (V >>> u & 1) != 0;
  }
  function k(V) {
    if (!V)
      throw new Error("Assertion error");
  }
  const $ = class $ {
    /*-- Constructor (low level) and fields --*/
    // Creates a new QR Code segment with the given attributes and data.
    // The character count (numChars) must agree with the mode and the bit buffer length,
    // but the constraint isn't checked. The given bit buffer is cloned and stored.
    constructor(u, c, n) {
      W(this, "mode");
      W(this, "numChars");
      W(this, "bitData");
      if (this.mode = u, this.numChars = c, this.bitData = n, c < 0)
        throw new RangeError("Invalid argument");
      this.bitData = n.slice();
    }
    /*-- Static factory functions (mid level) --*/
    // Returns a segment representing the given binary data encoded in
    // byte mode. All input byte arrays are acceptable. Any text string
    // can be converted to UTF-8 bytes and encoded as a byte mode segment.
    static makeBytes(u) {
      let c = [];
      for (const n of u)
        v(n, 8, c);
      return new $($.Mode.BYTE, u.length, c);
    }
    // Returns a segment representing the given string of decimal digits encoded in numeric mode.
    static makeNumeric(u) {
      if (!$.isNumeric(u))
        throw new RangeError("String contains non-numeric characters");
      let c = [];
      for (let n = 0; n < u.length; ) {
        const a = Math.min(u.length - n, 3);
        v(parseInt(u.substring(n, n + a), 10), a * 3 + 1, c), n += a;
      }
      return new $($.Mode.NUMERIC, u.length, c);
    }
    // Returns a segment representing the given text string encoded in alphanumeric mode.
    // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
    // dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static makeAlphanumeric(u) {
      if (!$.isAlphanumeric(u))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let c = [], n;
      for (n = 0; n + 2 <= u.length; n += 2) {
        let a = $.ALPHANUMERIC_CHARSET.indexOf(u.charAt(n)) * 45;
        a += $.ALPHANUMERIC_CHARSET.indexOf(u.charAt(n + 1)), v(a, 11, c);
      }
      return n < u.length && v($.ALPHANUMERIC_CHARSET.indexOf(u.charAt(n)), 6, c), new $($.Mode.ALPHANUMERIC, u.length, c);
    }
    // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
    // The result may use various segment modes and switch modes to optimize the length of the bit stream.
    static makeSegments(u) {
      return u == "" ? [] : $.isNumeric(u) ? [$.makeNumeric(u)] : $.isAlphanumeric(u) ? [$.makeAlphanumeric(u)] : [$.makeBytes($.toUtf8ByteArray(u))];
    }
    // Returns a segment representing an Extended Channel Interpretation
    // (ECI) designator with the given assignment value.
    static makeEci(u) {
      let c = [];
      if (u < 0)
        throw new RangeError("ECI assignment value out of range");
      if (u < 128)
        v(u, 8, c);
      else if (u < 16384)
        v(2, 2, c), v(u, 14, c);
      else if (u < 1e6)
        v(6, 3, c), v(u, 21, c);
      else
        throw new RangeError("ECI assignment value out of range");
      return new $($.Mode.ECI, 0, c);
    }
    // Tests whether the given string can be encoded as a segment in numeric mode.
    // A string is encodable iff each character is in the range 0 to 9.
    static isNumeric(u) {
      return $.NUMERIC_REGEX.test(u);
    }
    // Tests whether the given string can be encoded as a segment in alphanumeric mode.
    // A string is encodable iff each character is in the following set: 0 to 9, A to Z
    // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
    static isAlphanumeric(u) {
      return $.ALPHANUMERIC_REGEX.test(u);
    }
    /*-- Methods --*/
    // Returns a new copy of the data bits of this segment.
    getData() {
      return this.bitData.slice();
    }
    // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
    // the given version. The result is infinity if a segment has too many characters to fit its length field.
    static getTotalBits(u, c) {
      let n = 0;
      for (const a of u) {
        const d = a.mode.numCharCountBits(c);
        if (a.numChars >= 1 << d)
          return 1 / 0;
        n += 4 + d + a.bitData.length;
      }
      return n;
    }
    // Returns a new array of bytes representing the given string encoded in UTF-8.
    static toUtf8ByteArray(u) {
      u = encodeURI(u);
      let c = [];
      for (let n = 0; n < u.length; n++)
        u.charAt(n) != "%" ? c.push(u.charCodeAt(n)) : (c.push(parseInt(u.substring(n + 1, n + 3), 16)), n += 2);
      return c;
    }
  };
  /*-- Constants --*/
  // Describes precisely all strings that are encodable in numeric mode.
  W($, "NUMERIC_REGEX", /^[0-9]*$/), // Describes precisely all strings that are encodable in alphanumeric mode.
  W($, "ALPHANUMERIC_REGEX", /^[A-Z0-9 $%*+.\/:-]*$/), // The set of all legal characters in alphanumeric mode,
  // where each character value maps to the index in the string.
  W($, "ALPHANUMERIC_CHARSET", "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:");
  let w = $;
  F.QrSegment = w;
})(Ye || (Ye = {}));
((F) => {
  ((s) => {
    const m = class m {
      // The QR Code can tolerate about 30% erroneous codewords
      /*-- Constructor and fields --*/
      constructor(w, h) {
        W(this, "ordinal");
        W(this, "formatBits");
        this.ordinal = w, this.formatBits = h;
      }
    };
    /*-- Constants --*/
    W(m, "LOW", new m(0, 1)), // The QR Code can tolerate about  7% erroneous codewords
    W(m, "MEDIUM", new m(1, 0)), // The QR Code can tolerate about 15% erroneous codewords
    W(m, "QUARTILE", new m(2, 3)), // The QR Code can tolerate about 25% erroneous codewords
    W(m, "HIGH", new m(3, 2));
    let v = m;
    s.Ecc = v;
  })(F.QrCode || (F.QrCode = {}));
})(Ye || (Ye = {}));
((F) => {
  ((s) => {
    const m = class m {
      /*-- Constructor and fields --*/
      constructor(w, h) {
        W(this, "modeBits");
        W(this, "numBitsCharCount");
        this.modeBits = w, this.numBitsCharCount = h;
      }
      /*-- Method --*/
      // (Package-private) Returns the bit width of the character count field for a segment in
      // this mode in a QR Code at the given version number. The result is in the range [0, 16].
      numCharCountBits(w) {
        return this.numBitsCharCount[Math.floor((w + 7) / 17)];
      }
    };
    /*-- Constants --*/
    W(m, "NUMERIC", new m(1, [10, 12, 14])), W(m, "ALPHANUMERIC", new m(2, [9, 11, 13])), W(m, "BYTE", new m(4, [8, 16, 16])), W(m, "KANJI", new m(8, [8, 10, 12])), W(m, "ECI", new m(7, [0, 0, 0]));
    let v = m;
    s.Mode = v;
  })(F.QrSegment || (F.QrSegment = {}));
})(Ye || (Ye = {}));
const Rt = Ye, Li = { class: "content-card" }, Oi = { class: "card-desc" }, Di = { class: "connection-grid" }, zi = { class: "connection-form" }, Bi = { class: "field" }, Fi = ["placeholder"], Ki = { class: "field" }, ji = { class: "toggle-label" }, Hi = { class: "field" }, Yi = ["placeholder"], Xi = { class: "field" }, Ji = ["placeholder"], Wi = { class: "field" }, qi = { class: "helper-text" }, Gi = { key: 0 }, Zi = { key: 1 }, Qi = { class: "actions-row" }, er = { class: "connection-qr" }, tr = ["viewBox"], sr = ["width", "height"], lr = ["x", "y"], nr = { class: "connection-link" }, Lt = "0kay.connection.qr.v2", or = /* @__PURE__ */ pe({
  __name: "ConnectionPanel",
  setup(F) {
    const { t: s } = ve();
    function v() {
      try {
        return JSON.parse(localStorage.getItem(Lt) || "{}");
      } catch {
        return {};
      }
    }
    function m(D) {
      const U = (I) => /^192\.168\./.test(I) ? 0 : /^10\./.test(I) ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(I) ? 2 : /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(I) ? 4 : 3;
      return [...D].sort((I, J) => U(I) - U(J))[0] || "";
    }
    const k = v(), w = !!k.hostOverride, h = x(k.hostOverride && k.host ? k.host : location.hostname), $ = x(w), V = location.protocol === "https:" ? location.port || "443" : "8080", u = x(k.port ?? V), c = x(k.tls ?? location.protocol === "https:"), n = x(""), a = x(""), d = x(k.name ?? "0KAY"), f = x(""), y = x(!1), p = x(!1);
    Ne(async () => {
      try {
        const D = await fetch("/api/auth/session");
        if (D.ok) {
          const U = await D.json();
          f.value = String(U.core_id || ""), y.value = !!U.lan_enabled;
          const I = Array.isArray(U.addresses) ? U.addresses : [], J = m(I);
          !$.value && J && (h.value = J);
        }
      } catch {
      }
    }), Xe([h, u, c, d, $], () => {
      localStorage.setItem(
        Lt,
        JSON.stringify({
          host: h.value,
          hostOverride: $.value,
          port: u.value,
          tls: c.value,
          name: d.value
        })
      );
    });
    const M = G(() => {
      const D = c.value ? "https" : "http", U = String(u.value || "").trim();
      return `${D}://${h.value.trim()}${U ? ":" + U : ""}`;
    }), A = G(() => {
      const D = [["v", "1"], ["url", M.value]];
      return d.value.trim() && D.push(["name", d.value.trim()]), n.value.trim() && D.push(["token", n.value.trim()]), a.value.trim() && D.push(["pin", a.value.trim()]), f.value && D.push(["core_id", f.value]), `0kay://pair?${D.map(([I, J]) => `${I}=${encodeURIComponent(J)}`).join("&")}`;
    }), j = G(() => {
      const D = Rt.QrCode.encodeText(A.value, Rt.QrCode.Ecc.MEDIUM), U = D.size, I = 2, J = U + I * 2, ie = [];
      for (let re = 0; re < U; re++)
        for (let H = 0; H < U; H++)
          D.getModule(H, re) && ie.push({ x: H + I, y: re + I });
      return { dim: J, dark: ie };
    });
    async function O() {
      try {
        await navigator.clipboard.writeText(A.value), p.value = !0, setTimeout(() => p.value = !1, 1500);
      } catch {
      }
    }
    return (D, U) => (o(), r("div", Li, [
      e("h2", null, l(t(s)("connection.title")), 1),
      e("p", Oi, l(t(s)("connection.lead")), 1),
      e("div", Di, [
        e("div", zi, [
          e("div", Bi, [
            e("label", null, l(t(s)("connection.remoteHost")), 1),
            B(e("input", {
              "onUpdate:modelValue": U[0] || (U[0] = (I) => h.value = I),
              class: "input",
              placeholder: t(s)("connection.hostPlaceholder"),
              onInput: U[1] || (U[1] = (I) => $.value = !0)
            }, null, 40, Fi), [
              [Y, h.value]
            ])
          ]),
          e("div", Ki, [
            e("label", null, l(t(s)("connection.port")), 1),
            B(e("input", {
              "onUpdate:modelValue": U[2] || (U[2] = (I) => u.value = I),
              class: "input",
              inputmode: "numeric",
              placeholder: "8080"
            }, null, 512), [
              [Y, u.value]
            ])
          ]),
          e("label", ji, [
            B(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": U[3] || (U[3] = (I) => c.value = I)
            }, null, 512), [
              [ce, c.value]
            ]),
            U[7] || (U[7] = e("span", { class: "toggle-slider" }, null, -1)),
            e("span", null, l(t(s)("connection.useTls")), 1)
          ]),
          e("div", Hi, [
            e("label", null, l(t(s)("connection.token")), 1),
            B(e("input", {
              "onUpdate:modelValue": U[4] || (U[4] = (I) => n.value = I),
              class: "input",
              type: "password",
              placeholder: t(s)("connection.tokenPlaceholder"),
              autocomplete: "off"
            }, null, 8, Yi), [
              [Y, n.value]
            ])
          ]),
          e("div", Xi, [
            e("label", null, l(t(s)("connection.pin")), 1),
            B(e("input", {
              "onUpdate:modelValue": U[5] || (U[5] = (I) => a.value = I),
              class: "input",
              type: "password",
              placeholder: t(s)("connection.pinPlaceholder"),
              autocomplete: "off"
            }, null, 8, Ji), [
              [Y, a.value]
            ])
          ]),
          e("div", Wi, [
            e("label", null, l(t(s)("connection.deviceName")), 1),
            B(e("input", {
              "onUpdate:modelValue": U[6] || (U[6] = (I) => d.value = I),
              class: "input",
              placeholder: "0KAY"
            }, null, 512), [
              [Y, d.value]
            ])
          ]),
          e("div", qi, [
            Ie(l(t(s)("connection.address")), 1),
            e("code", null, l(M.value), 1),
            f.value ? (o(), r("span", Gi, " · Core: " + l(f.value), 1)) : R("", !0),
            y.value ? (o(), r("span", Zi, l(t(s)("connection.lanMode")), 1)) : R("", !0)
          ]),
          e("div", Qi, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              onClick: O
            }, l(p.value ? t(s)("common.copied") : t(s)("connection.copyLink")), 1)
          ])
        ]),
        e("div", er, [
          (o(), r("svg", {
            viewBox: `0 0 ${j.value.dim} ${j.value.dim}`,
            width: "264",
            height: "264",
            "shape-rendering": "crispEdges",
            role: "img",
            "aria-label": "0KAY connection QR code"
          }, [
            e("rect", {
              x: "0",
              y: "0",
              width: j.value.dim,
              height: j.value.dim,
              fill: "#ffffff"
            }, null, 8, sr),
            (o(!0), r(X, null, oe(j.value.dark, (I) => (o(), r("rect", {
              key: I.x + ":" + I.y,
              x: I.x,
              y: I.y,
              width: "1",
              height: "1",
              fill: "#0b1020"
            }, null, 8, lr))), 128))
          ], 8, tr)),
          e("code", nr, l(A.value), 1)
        ])
      ])
    ]));
  }
}), ar = /* @__PURE__ */ Me(or, [["__scopeId", "data-v-b6056614"]]), ir = { class: "content-card" }, rr = { class: "card-desc" }, ur = { class: "field-row" }, cr = { class: "field" }, dr = ["placeholder"], pr = { class: "field" }, hr = ["placeholder"], vr = { class: "field" }, mr = { class: "field" }, gr = ["placeholder"], fr = { class: "field" }, _r = ["placeholder"], br = { class: "field" }, yr = ["placeholder"], kr = { class: "field" }, wr = ["placeholder"], $r = { class: "helper-text" }, Sr = /* @__PURE__ */ pe({
  __name: "PersonaPanel",
  setup(F) {
    const { t: s } = ve(), v = nt(), { tabLabel: m, tabMeta: k } = gt();
    return (w, h) => (o(), r("div", ir, [
      e("h2", null, l(t(m)("persona")), 1),
      e("p", rr, l(t(k)("persona")?.descriptionKey ? t(s)(t(k)("persona").descriptionKey) : t(s)("settings.personaDesc")), 1),
      e("div", ur, [
        e("div", cr, [
          e("label", null, l(t(s)("wizard.name")), 1),
          B(e("input", {
            "onUpdate:modelValue": h[0] || (h[0] = ($) => t(v).persona.name = $),
            placeholder: t(s)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, dr), [
            [Y, t(v).persona.name]
          ])
        ]),
        e("div", pr, [
          e("label", null, l(t(s)("wizard.avatarUrl")), 1),
          B(e("input", {
            "onUpdate:modelValue": h[1] || (h[1] = ($) => t(v).persona.avatar = $),
            placeholder: t(s)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, hr), [
            [Y, t(v).persona.avatar]
          ])
        ]),
        e("div", vr, [
          e("label", null, l(t(s)("settings.personaBirthDate")), 1),
          B(e("input", {
            "onUpdate:modelValue": h[2] || (h[2] = ($) => t(v).persona.birthDate = $),
            type: "date",
            class: "input"
          }, null, 512), [
            [Y, t(v).persona.birthDate]
          ])
        ])
      ]),
      e("div", mr, [
        e("label", null, l(t(s)("wizard.description")), 1),
        B(e("textarea", {
          "onUpdate:modelValue": h[3] || (h[3] = ($) => t(v).persona.description = $),
          placeholder: t(s)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, gr), [
          [Y, t(v).persona.description]
        ])
      ]),
      e("div", fr, [
        e("label", null, l(t(s)("wizard.personality")), 1),
        B(e("textarea", {
          "onUpdate:modelValue": h[4] || (h[4] = ($) => t(v).persona.personality = $),
          placeholder: t(s)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, _r), [
          [Y, t(v).persona.personality]
        ])
      ]),
      e("div", br, [
        e("label", null, l(t(s)("wizard.greeting")), 1),
        B(e("textarea", {
          "onUpdate:modelValue": h[5] || (h[5] = ($) => t(v).persona.greeting = $),
          placeholder: t(s)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, yr), [
          [Y, t(v).persona.greeting]
        ])
      ]),
      e("div", kr, [
        e("label", null, l(t(s)("wizard.customPrompt")), 1),
        B(e("textarea", {
          "onUpdate:modelValue": h[6] || (h[6] = ($) => t(v).persona.customPrompt = $),
          placeholder: t(s)("wizard.customPromptPlaceholder"),
          class: "input",
          rows: "6"
        }, null, 8, wr), [
          [Y, t(v).persona.customPrompt]
        ]),
        e("p", $r, l(t(s)("wizard.customPromptHelp")), 1)
      ])
    ]));
  }
}), Cr = { class: "content-card" }, xr = { class: "card-desc" }, Mr = { class: "toggle-label" }, Pr = { class: "helper-text" }, Er = { class: "toggle-label" }, Ur = { class: "helper-text" }, Ar = { class: "field" }, Tr = ["placeholder"], Ir = { class: "helper-text" }, Nr = {
  key: 0,
  class: "helper-text"
}, Vr = { class: "actions-row" }, Rr = /* @__PURE__ */ pe({
  __name: "PermissionsPanel",
  setup(F) {
    const { t: s } = ve(), { tabLabel: v, tabMeta: m, fieldLabel: k, fieldHelp: w } = gt(), h = x({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), $ = x("");
    async function V() {
      try {
        const c = await fetch("/api/life/permissions");
        if (c.ok) {
          const n = await c.json();
          h.value = {
            screen_watch: !!n.screen_watch,
            computer_use: !!n.computer_use,
            report_agent_host: n.report_agent_host || ""
          };
        }
      } catch {
      }
    }
    async function u() {
      $.value = "";
      try {
        const c = await fetch("/api/life/permissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(h.value)
        });
        if (!c.ok) throw new Error(String(c.status));
        const n = await c.json();
        h.value = {
          screen_watch: !!n.screen_watch,
          computer_use: !!n.computer_use,
          report_agent_host: n.report_agent_host || ""
        }, $.value = s("settings.permSaved");
      } catch {
        $.value = s("settings.permFailed");
      }
    }
    return Ne(V), (c, n) => (o(), r("div", Cr, [
      e("h2", null, l(t(v)("permissions")), 1),
      e("p", xr, l(t(m)("permissions")?.descriptionKey ? t(s)(t(m)("permissions").descriptionKey) : t(s)("settings.permissionsDesc")), 1),
      e("label", Mr, [
        B(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": n[0] || (n[0] = (a) => h.value.screen_watch = a),
          onChange: u
        }, null, 544), [
          [ce, h.value.screen_watch]
        ]),
        n[4] || (n[4] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(t(k)(t(m)("permissions"), "screen_watch", "settings.screenWatch")), 1),
          n[3] || (n[3] = e("br", null, null, -1)),
          e("small", Pr, l(t(w)(t(m)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", Er, [
        B(e("input", {
          type: "checkbox",
          "onUpdate:modelValue": n[1] || (n[1] = (a) => h.value.computer_use = a),
          onChange: u
        }, null, 544), [
          [ce, h.value.computer_use]
        ]),
        n[6] || (n[6] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, l(t(k)(t(m)("permissions"), "computer_use", "settings.computerUse")), 1),
          n[5] || (n[5] = e("br", null, null, -1)),
          e("small", Ur, l(t(w)(t(m)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", Ar, [
        e("label", null, l(t(k)(t(m)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        B(e("input", {
          "onUpdate:modelValue": n[2] || (n[2] = (a) => h.value.report_agent_host = a),
          class: "input",
          placeholder: t(w)(t(m)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: u
        }, null, 40, Tr), [
          [Y, h.value.report_agent_host]
        ]),
        e("p", Ir, l(t(w)(t(m)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      $.value ? (o(), r("div", Nr, l($.value), 1)) : R("", !0),
      e("div", Vr, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: u
        }, l(t(s)("settings.save")), 1)
      ])
    ]));
  }
}), Lr = x(!1), Or = x(!1);
x(!1);
const Ke = x(!1), Je = x(!0), ft = x(!0), qe = x([]), jt = x(!1);
x(!1);
const ot = x(!1), Ot = [];
function Dr(F) {
  const s = Ot.splice(0, Ot.length);
  for (const v of s)
    v.resolve();
}
async function zr() {
  const F = window.fetch;
  try {
    const s = await F("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!s.ok) return;
    const v = await s.json();
    Ke.value = !!v.configured, Je.value = v.enabled !== !1, ft.value = v.login_enabled !== !1, qe.value = Array.isArray(v.pages) ? v.pages : [], ot.value = !v.configured && Je.value;
  } catch {
  }
}
async function Br(F) {
  const s = window.fetch, v = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(F)
  }), m = await v.json().catch(() => null);
  if (!v.ok) throw new Error(m?.error || `HTTP ${v.status}`);
  typeof m?.enabled == "boolean" && (Je.value = m.enabled), typeof m?.login_enabled == "boolean" && (ft.value = m.login_enabled), Array.isArray(m?.pages) && (qe.value = m.pages), Ke.value = !!m?.configured, ot.value = !m?.configured && Je.value;
}
async function Fr() {
  const F = window.fetch, s = await F("/api/security/pin", { method: "DELETE" }), v = await s.json().catch(() => null);
  if (!s.ok) throw new Error(v?.error || `HTTP ${s.status}`);
  jt.value = !1, Ke.value = !1, ot.value = Je.value;
}
async function Kr(F) {
  const s = window.fetch, v = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: F })
  }), m = await v.json().catch(() => null);
  if (!v.ok || !m?.configured) throw new Error(m?.error || `HTTP ${v.status}`);
  F.trim(), jt.value = !0, Ke.value = !0, ot.value = !1, Or.value = !0, Lr.value = !1, Dr();
}
const jr = { class: "content-card security-panel" }, Hr = { class: "card-desc" }, Yr = { class: "sec-stack" }, Xr = { class: "toggle-label" }, Jr = ["checked", "disabled"], Wr = { class: "helper-text" }, qr = { class: "toggle-label" }, Gr = ["checked", "disabled"], Zr = { class: "helper-text" }, Qr = { class: "sec-card" }, eu = { class: "sec-card-head" }, tu = { class: "sec-pin-grid" }, su = { class: "sec-pin-col" }, lu = { class: "sec-pin-label" }, nu = { class: "sec-pin-col" }, ou = { class: "sec-pin-label" }, au = { class: "sec-actions" }, iu = ["disabled"], ru = ["disabled"], uu = { class: "sec-card" }, cu = { class: "sec-card-head" }, du = { class: "sec-chip" }, pu = { class: "helper-text" }, hu = { class: "page-list" }, vu = ["checked", "disabled", "onChange"], mu = { class: "page-text" }, gu = { class: "page-name" }, fu = {
  key: 0,
  class: "helper-text sec-msg"
}, _u = {
  key: 1,
  class: "sec-error"
}, bu = /* @__PURE__ */ pe({
  __name: "SecurityPanel",
  setup(F) {
    const { t: s } = ve(), { confirm: v } = Ge(), m = Kt(), k = x(!1), w = x(""), h = x(""), $ = x(""), V = x(""), u = G(() => {
      const y = [], p = /* @__PURE__ */ new Set(), M = (A, j) => {
        !A || p.has(A) || (p.add(A), y.push({ path: A, label: j || A }));
      };
      for (const A of m.navItems) {
        const j = A.to || (A.id === "chat" ? "/" : "");
        if (!j) continue;
        let O = A.labelKey ? s(A.labelKey) : "";
        (!O || O === A.labelKey) && (O = A.label || A.id), M(j, O);
      }
      for (const A of m.routerPatches) {
        let j = A.titleKey ? s(A.titleKey) : "";
        (!j || j === A.titleKey) && (j = A.title || String(A.name || A.path)), M(A.path, j);
      }
      return y;
    });
    Ne(() => {
      zr();
    });
    async function c(y) {
      k.value = !0, w.value = "", h.value = "";
      try {
        await Br(y), w.value = s("settings.saved"), setTimeout(() => {
          w.value = "";
        }, 1500);
      } catch (p) {
        h.value = p?.message || s("settings.permFailed");
      } finally {
        k.value = !1;
      }
    }
    function n(y, p) {
      c({ [y]: p });
    }
    function a(y, p) {
      const M = new Set(qe.value);
      p ? M.add(y) : M.delete(y), c({ pages: [...M] });
    }
    async function d() {
      if (h.value = "", $.value.length !== 6) {
        h.value = s("wizard.pinTooShort");
        return;
      }
      if ($.value !== V.value) {
        h.value = s("wizard.pinMismatch");
        return;
      }
      k.value = !0;
      try {
        await Kr($.value), $.value = "", V.value = "", w.value = s("settings.saved"), setTimeout(() => {
          w.value = "";
        }, 1500);
      } catch (y) {
        h.value = y?.message || s("settings.permFailed");
      } finally {
        k.value = !1;
      }
    }
    async function f() {
      if (await v({
        title: s("security.removePin"),
        message: s("security.removePinConfirm"),
        confirmLabel: s("common.delete"),
        danger: !0
      })) {
        k.value = !0, h.value = "";
        try {
          await Fr(), w.value = s("settings.saved"), setTimeout(() => {
            w.value = "";
          }, 1500);
        } catch (p) {
          h.value = p?.message || s("settings.permFailed");
        } finally {
          k.value = !1;
        }
      }
    }
    return (y, p) => (o(), r("div", jr, [
      e("h2", null, l(t(s)("settings.tabs.security")), 1),
      e("p", Hr, l(t(s)("security.desc")), 1),
      e("div", Yr, [
        e("label", Xr, [
          e("input", {
            type: "checkbox",
            checked: t(Je),
            disabled: k.value,
            onChange: p[0] || (p[0] = (M) => n("enabled", M.target.checked))
          }, null, 40, Jr),
          p[4] || (p[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(t(s)("security.pinSwitch")), 1),
            e("small", Wr, l(t(s)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", qr, [
          e("input", {
            type: "checkbox",
            checked: t(ft),
            disabled: k.value,
            onChange: p[1] || (p[1] = (M) => n("login_enabled", M.target.checked))
          }, null, 40, Gr),
          p[5] || (p[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, l(t(s)("security.loginSwitch")), 1),
            e("small", Zr, l(t(s)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", Qr, [
          e("div", eu, [
            e("strong", null, l(t(Ke) ? t(s)("security.changePin") : t(s)("auth.setupTitle")), 1),
            e("span", {
              class: ee(["sec-chip", { on: t(Ke) }])
            }, l(t(Ke) ? t(s)("security.pinSet") : t(s)("security.pinUnset")), 3)
          ]),
          e("div", tu, [
            e("div", su, [
              e("span", lu, l(t(s)("auth.pinNew")), 1),
              ae(t(Nt), {
                modelValue: $.value,
                "onUpdate:modelValue": p[2] || (p[2] = (M) => $.value = M)
              }, null, 8, ["modelValue"])
            ]),
            e("div", nu, [
              e("span", ou, l(t(s)("auth.pinConfirm")), 1),
              ae(t(Nt), {
                modelValue: V.value,
                "onUpdate:modelValue": p[3] || (p[3] = (M) => V.value = M),
                onComplete: d
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", au, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: k.value,
              onClick: d
            }, l(t(s)("auth.savePin")), 9, iu),
            t(Ke) ? (o(), r("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: k.value,
              onClick: f
            }, l(t(s)("security.removePin")), 9, ru)) : R("", !0)
          ])
        ]),
        e("section", uu, [
          e("div", cu, [
            e("strong", null, l(t(s)("security.pages")), 1),
            e("span", du, l(t(s)("security.pageCount", { n: t(qe).length })), 1)
          ]),
          e("p", pu, l(t(s)("security.pagesHelp")), 1),
          e("div", hu, [
            (o(!0), r(X, null, oe(u.value, (M) => (o(), r("label", {
              key: M.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: t(qe).includes(M.path),
                disabled: k.value,
                onChange: (A) => a(M.path, A.target.checked)
              }, null, 40, vu),
              p[6] || (p[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", mu, [
                e("span", gu, l(M.label), 1),
                e("code", null, l(M.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      w.value ? (o(), r("p", fu, l(w.value), 1)) : R("", !0),
      h.value ? (o(), r("p", _u, l(h.value), 1)) : R("", !0)
    ]));
  }
}), yu = /* @__PURE__ */ Me(bu, [["__scopeId", "data-v-fb8c17b3"]]), ku = { class: "mcp-panel" }, wu = { class: "mcp-head" }, $u = { class: "subtitle" }, Su = { class: "mcp-actions" }, Cu = ["disabled"], xu = {
  key: 0,
  class: "error-banner"
}, Mu = {
  key: 1,
  class: "notice-banner"
}, Pu = {
  key: 2,
  class: "hint"
}, Eu = {
  key: 3,
  class: "mcp-list"
}, Uu = { class: "mcp-row" }, Au = { class: "mcp-field grow" }, Tu = ["onUpdate:modelValue", "readonly"], Iu = { class: "mcp-field" }, Nu = ["onUpdate:modelValue", "onChange"], Vu = { value: "builtin" }, Ru = { class: "mcp-toggle" }, Lu = ["onUpdate:modelValue"], Ou = ["onClick"], Du = { class: "mcp-field" }, zu = ["onUpdate:modelValue"], Bu = { class: "mcp-field" }, Fu = ["onUpdate:modelValue"], Ku = { class: "mcp-field" }, ju = ["onUpdate:modelValue"], Hu = { class: "mcp-field" }, Yu = ["onUpdate:modelValue"], Xu = { class: "builtin-note" }, Ju = { class: "mail-grid" }, Wu = { class: "mail-col" }, qu = { class: "mail-label" }, Gu = { class: "mcp-field" }, Zu = ["onUpdate:modelValue"], Qu = { class: "mail-row" }, ec = { class: "mcp-field" }, tc = ["onUpdate:modelValue"], sc = { class: "mcp-toggle" }, lc = ["onUpdate:modelValue"], nc = { class: "mcp-field" }, oc = ["onUpdate:modelValue"], ac = { class: "mcp-field" }, ic = ["onUpdate:modelValue"], rc = { class: "mail-col" }, uc = { class: "mail-label" }, cc = { class: "mcp-field" }, dc = ["onUpdate:modelValue"], pc = { class: "mail-row" }, hc = { class: "mcp-field" }, vc = ["onUpdate:modelValue"], mc = { class: "mcp-toggle" }, gc = ["onUpdate:modelValue"], fc = { class: "mcp-field" }, _c = ["onUpdate:modelValue"], bc = { class: "mcp-field" }, yc = ["onUpdate:modelValue"], kc = { class: "mail-row" }, wc = { class: "mcp-field grow" }, $c = ["onUpdate:modelValue", "placeholder"], Sc = { class: "mcp-field" }, Cc = ["onUpdate:modelValue"], xc = {
  key: 0,
  class: "hint"
}, Mc = /* @__PURE__ */ pe({
  __name: "McpPanel",
  setup(F) {
    const { t: s } = ve(), v = x([]), m = x(!1), k = x(!1), w = x(""), h = x(!1);
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
    function V(f) {
      const y = f?.transport === "http" ? "http" : f?.transport === "builtin" || f?.builtin ? "builtin" : "stdio", p = f?.options?.imap || {}, M = f?.options?.smtp || {};
      return {
        id: String(f?.id || ""),
        transport: y,
        command: String(f?.command || ""),
        argsText: Array.isArray(f?.args) ? f.args.join(`
`) : "",
        url: String(f?.url || ""),
        headersText: f?.headers && typeof f.headers == "object" ? JSON.stringify(f.headers, null, 2) : "",
        enabled: f?.enabled !== !1,
        imapHost: String(p.host || ""),
        imapPort: Number(p.port) || 993,
        imapSsl: p.ssl !== !1,
        imapUser: String(p.user || ""),
        imapPassword: String(p.password || ""),
        smtpHost: String(M.host || ""),
        smtpPort: Number(M.port) || 465,
        smtpSecure: M.secure !== !1,
        smtpUser: String(M.user || ""),
        smtpPassword: String(M.password || ""),
        from: String(M.from || ""),
        fromName: String(M.fromName || "0KAY")
      };
    }
    function u(f) {
      if (f.transport === "builtin") {
        const p = {};
        return (f.imapHost.trim() || f.imapUser.trim()) && (p.imap = {
          host: f.imapHost.trim(),
          port: Number(f.imapPort) || 993,
          ssl: f.imapSsl,
          user: f.imapUser.trim(),
          password: f.imapPassword
        }), (f.smtpHost.trim() || f.smtpUser.trim() || f.from.trim()) && (p.smtp = {
          host: f.smtpHost.trim(),
          port: Number(f.smtpPort) || 465,
          secure: f.smtpSecure,
          user: f.smtpUser.trim(),
          password: f.smtpPassword,
          from: f.from.trim(),
          fromName: f.fromName.trim() || "0KAY"
        }), { id: f.id.trim() || "mail", transport: "builtin", builtin: "mail", enabled: f.enabled, options: p };
      }
      const y = { id: f.id.trim(), transport: f.transport, enabled: f.enabled };
      if (f.transport === "http") {
        if (f.url.trim() && (y.url = f.url.trim()), f.headersText.trim())
          try {
            y.headers = JSON.parse(f.headersText);
          } catch {
            throw new Error(s("mcp.headersInvalid", { id: f.id || "(unnamed)" }));
          }
      } else {
        f.command.trim() && (y.command = f.command.trim());
        const p = f.argsText.split(`
`).map((M) => M.trim()).filter(Boolean);
        p.length && (y.args = p);
      }
      return y;
    }
    function c(f) {
      f.transport === "builtin" && (f.id = "mail");
    }
    function n() {
      const f = $();
      v.value.some((y) => y.transport === "builtin") && (f.transport = "stdio"), v.value.push(f);
    }
    async function a() {
      m.value = !0, w.value = "";
      try {
        const y = (await Fe("/api/settings/mcp"))?.values?.servers;
        let p = [];
        if (typeof y == "string" && y.trim())
          try {
            const M = JSON.parse(y);
            Array.isArray(M) && (p = M);
          } catch {
            w.value = s("mcp.configInvalid");
          }
        v.value = p.map(V);
      } catch (f) {
        w.value = f?.message || String(f);
      } finally {
        m.value = !1;
      }
    }
    async function d() {
      if (!k.value) {
        k.value = !0, w.value = "", h.value = !1;
        try {
          const f = /* @__PURE__ */ new Set(), y = v.value.map(u).filter((p) => {
            const M = String(p.id || "").trim();
            return !M || f.has(M) ? !1 : (f.add(M), !0);
          });
          await tt("/api/settings/mcp", { values: { servers: JSON.stringify(y) } }), h.value = !0, setTimeout(() => {
            h.value = !1;
          }, 2e3);
        } catch (f) {
          w.value = f?.message || String(f);
        } finally {
          k.value = !1;
        }
      }
    }
    return Ne(a), (f, y) => (o(), r("div", ku, [
      e("header", wu, [
        e("div", null, [
          e("h2", null, l(t(s)("mcp.title")), 1),
          e("p", $u, l(t(s)("mcp.subtitle")), 1)
        ]),
        e("div", Su, [
          e("button", {
            class: "btn btn-tonal",
            type: "button",
            onClick: n
          }, l(t(s)("mcp.addServer")), 1),
          e("button", {
            class: "btn primary",
            type: "button",
            disabled: k.value,
            onClick: d
          }, l(k.value ? t(s)("common.saving") : t(s)("common.save")), 9, Cu)
        ])
      ]),
      w.value ? (o(), r("div", xu, l(w.value), 1)) : R("", !0),
      h.value ? (o(), r("div", Mu, l(t(s)("settings.saved")), 1)) : R("", !0),
      m.value ? (o(), r("p", Pu, l(t(s)("common.loading")), 1)) : (o(), r("div", Eu, [
        (o(!0), r(X, null, oe(v.value, (p, M) => (o(), r("article", {
          key: M,
          class: ee(["mcp-card", { "is-builtin": p.transport === "builtin" }])
        }, [
          e("div", Uu, [
            e("label", Au, [
              y[0] || (y[0] = e("span", null, "ID", -1)),
              B(e("input", {
                "onUpdate:modelValue": (A) => p.id = A,
                readonly: p.transport === "builtin",
                placeholder: "filesystem"
              }, null, 8, Tu), [
                [Y, p.id]
              ])
            ]),
            e("label", Iu, [
              e("span", null, l(t(s)("mcp.transport")), 1),
              B(e("select", {
                "onUpdate:modelValue": (A) => p.transport = A,
                onChange: (A) => c(p)
              }, [
                y[1] || (y[1] = e("option", { value: "stdio" }, "stdio", -1)),
                y[2] || (y[2] = e("option", { value: "http" }, "http", -1)),
                e("option", Vu, l(t(s)("mcp.builtinMail")), 1)
              ], 40, Nu), [
                [os, p.transport]
              ])
            ]),
            e("label", Ru, [
              B(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (A) => p.enabled = A
              }, null, 8, Lu), [
                [ce, p.enabled]
              ]),
              e("span", null, l(t(s)("mcp.enabled")), 1)
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (A) => v.value.splice(M, 1)
            }, l(t(s)("common.delete")), 9, Ou)
          ]),
          p.transport === "stdio" ? (o(), r(X, { key: 0 }, [
            e("label", Du, [
              e("span", null, l(t(s)("mcp.command")), 1),
              B(e("input", {
                "onUpdate:modelValue": (A) => p.command = A,
                placeholder: "npx"
              }, null, 8, zu), [
                [Y, p.command]
              ])
            ]),
            e("label", Bu, [
              e("span", null, l(t(s)("mcp.args")), 1),
              B(e("textarea", {
                "onUpdate:modelValue": (A) => p.argsText = A,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, Fu), [
                [Y, p.argsText]
              ])
            ])
          ], 64)) : p.transport === "http" ? (o(), r(X, { key: 1 }, [
            e("label", Ku, [
              y[3] || (y[3] = e("span", null, "URL", -1)),
              B(e("input", {
                "onUpdate:modelValue": (A) => p.url = A,
                placeholder: "https://example.com/mcp"
              }, null, 8, ju), [
                [Y, p.url]
              ])
            ]),
            e("label", Hu, [
              y[4] || (y[4] = e("span", null, "Headers（JSON）", -1)),
              B(e("textarea", {
                "onUpdate:modelValue": (A) => p.headersText = A,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, Yu), [
                [Y, p.headersText]
              ])
            ])
          ], 64)) : (o(), r(X, { key: 2 }, [
            e("p", Xu, l(t(s)("mcp.builtinNote")), 1),
            e("div", Ju, [
              e("div", Wu, [
                e("p", qu, l(t(s)("mcp.imap")), 1),
                e("label", Gu, [
                  e("span", null, l(t(s)("mcp.host")), 1),
                  B(e("input", {
                    "onUpdate:modelValue": (A) => p.imapHost = A,
                    placeholder: "imap.example.com",
                    autocomplete: "off"
                  }, null, 8, Zu), [
                    [Y, p.imapHost]
                  ])
                ]),
                e("div", Qu, [
                  e("label", ec, [
                    e("span", null, l(t(s)("mcp.port")), 1),
                    B(e("input", {
                      "onUpdate:modelValue": (A) => p.imapPort = A,
                      type: "number",
                      placeholder: "993"
                    }, null, 8, tc), [
                      [
                        Y,
                        p.imapPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", sc, [
                    B(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (A) => p.imapSsl = A
                    }, null, 8, lc), [
                      [ce, p.imapSsl]
                    ]),
                    y[5] || (y[5] = e("span", null, "SSL", -1))
                  ])
                ]),
                e("label", nc, [
                  e("span", null, l(t(s)("mcp.username")), 1),
                  B(e("input", {
                    "onUpdate:modelValue": (A) => p.imapUser = A,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, oc), [
                    [Y, p.imapUser]
                  ])
                ]),
                e("label", ac, [
                  e("span", null, l(t(s)("mcp.password")), 1),
                  B(e("input", {
                    "onUpdate:modelValue": (A) => p.imapPassword = A,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, ic), [
                    [Y, p.imapPassword]
                  ])
                ])
              ]),
              e("div", rc, [
                e("p", uc, l(t(s)("mcp.smtp")), 1),
                e("label", cc, [
                  e("span", null, l(t(s)("mcp.host")), 1),
                  B(e("input", {
                    "onUpdate:modelValue": (A) => p.smtpHost = A,
                    placeholder: "smtp.example.com",
                    autocomplete: "off"
                  }, null, 8, dc), [
                    [Y, p.smtpHost]
                  ])
                ]),
                e("div", pc, [
                  e("label", hc, [
                    e("span", null, l(t(s)("mcp.port")), 1),
                    B(e("input", {
                      "onUpdate:modelValue": (A) => p.smtpPort = A,
                      type: "number",
                      placeholder: "465"
                    }, null, 8, vc), [
                      [
                        Y,
                        p.smtpPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", mc, [
                    B(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (A) => p.smtpSecure = A
                    }, null, 8, gc), [
                      [ce, p.smtpSecure]
                    ]),
                    y[6] || (y[6] = e("span", null, "SSL（465）", -1))
                  ])
                ]),
                e("label", fc, [
                  e("span", null, l(t(s)("mcp.username")), 1),
                  B(e("input", {
                    "onUpdate:modelValue": (A) => p.smtpUser = A,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, _c), [
                    [Y, p.smtpUser]
                  ])
                ]),
                e("label", bc, [
                  e("span", null, l(t(s)("mcp.password")), 1),
                  B(e("input", {
                    "onUpdate:modelValue": (A) => p.smtpPassword = A,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, yc), [
                    [Y, p.smtpPassword]
                  ])
                ]),
                e("div", kc, [
                  e("label", wc, [
                    e("span", null, l(t(s)("mcp.from")), 1),
                    B(e("input", {
                      "onUpdate:modelValue": (A) => p.from = A,
                      placeholder: t(s)("mcp.fromPlaceholder"),
                      autocomplete: "off"
                    }, null, 8, $c), [
                      [Y, p.from]
                    ])
                  ]),
                  e("label", Sc, [
                    e("span", null, l(t(s)("mcp.fromName")), 1),
                    B(e("input", {
                      "onUpdate:modelValue": (A) => p.fromName = A,
                      placeholder: "0KAY",
                      autocomplete: "off"
                    }, null, 8, Cc), [
                      [Y, p.fromName]
                    ])
                  ])
                ])
              ])
            ])
          ], 64))
        ], 2))), 128)),
        v.value.length ? R("", !0) : (o(), r("p", xc, l(t(s)("mcp.emptyServers")), 1))
      ]))
    ]));
  }
}), Pc = /* @__PURE__ */ Me(Mc, [["__scopeId", "data-v-01485e38"]]), Ec = { class: "content-card danger" }, Uc = { class: "card-desc" }, Ac = { class: "danger-box" }, Tc = ["disabled"], Ic = /* @__PURE__ */ pe({
  __name: "DangerPanel",
  setup(F) {
    const { t: s } = ve(), v = nt(), m = Bt(), { confirm: k } = Ge(), w = x(!1);
    async function h() {
      if (!(w.value || !await k({
        title: s("settings.reset"),
        message: s("settings.resetConfirmMsg"),
        confirmLabel: s("settings.reset"),
        danger: !0
      }))) {
        w.value = !0;
        try {
          v.resetWizard(), m.push("/");
        } finally {
          w.value = !1;
        }
      }
    }
    return ($, V) => (o(), r("div", Ec, [
      e("h2", null, l(t(s)("settings.tabs.danger")), 1),
      e("p", Uc, l(t(s)("settings.resetDesc")), 1),
      e("div", Ac, [
        e("div", null, [
          e("strong", null, l(t(s)("settings.reset")), 1),
          e("p", null, l(t(s)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          disabled: w.value,
          onClick: h
        }, l(t(s)("settings.reset")), 9, Tc)
      ])
    ]));
  }
}), Nc = {
  key: 1,
  class: "plugin-pane-message"
}, Vc = {
  key: 2,
  class: "plugin-pane-message"
}, Rc = /* @__PURE__ */ pe({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(F) {
    const s = F, v = It(null), m = It("");
    return Xe(
      () => s.module,
      async (k) => {
        if (!k) {
          v.value = null, m.value = "";
          return;
        }
        try {
          const w = await import(
            /* @vite-ignore */
            k
          );
          v.value = w?.default || w, m.value = "";
        } catch (w) {
          v.value = null, m.value = w?.message || String(w);
        }
      },
      { immediate: !0 }
    ), (k, w) => v.value ? (o(), ke(as(v.value), { key: 0 })) : m.value ? (o(), r("div", Nc, l(m.value), 1)) : (o(), r("div", Vc, "Loading plugin module…"));
  }
}), Lc = /* @__PURE__ */ Me(Rc, [["__scopeId", "data-v-2d1f36bc"]]), Oc = { class: "models-field" }, Dc = {
  key: 0,
  class: "models-list"
}, zc = { class: "models-rank" }, Bc = ["title"], Fc = { class: "models-actions" }, Kc = ["disabled", "aria-label", "onClick"], jc = ["disabled", "aria-label", "onClick"], Hc = ["aria-label", "onClick"], Yc = {
  key: 1,
  class: "models-empty"
}, Xc = /* @__PURE__ */ pe({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(F, { emit: s }) {
    const { t: v } = ve(), m = F, k = s, w = G(() => String(m.modelValue || "").split(",").map((n) => n.trim()).filter(Boolean)), h = G(() => m.options.filter((n) => !w.value.includes(n)));
    function $(n) {
      k("update:modelValue", n.join(","));
    }
    function V(n) {
      n && !w.value.includes(n) && $([...w.value, n]);
    }
    function u(n) {
      $(w.value.filter((a) => a !== n));
    }
    function c(n, a) {
      const d = [...w.value], f = n + a;
      f < 0 || f >= d.length || ([d[n], d[f]] = [d[f], d[n]], $(d));
    }
    return (n, a) => (o(), r("div", Oc, [
      w.value.length ? (o(), r("ol", Dc, [
        (o(!0), r(X, null, oe(w.value, (d, f) => (o(), r("li", { key: d }, [
          e("span", zc, l(f + 1), 1),
          e("span", {
            class: "models-name",
            title: d
          }, l(d), 9, Bc),
          e("span", Fc, [
            e("button", {
              type: "button",
              disabled: f === 0,
              "aria-label": t(v)("models.higher"),
              onClick: (y) => c(f, -1)
            }, "↑", 8, Kc),
            e("button", {
              type: "button",
              disabled: f === w.value.length - 1,
              "aria-label": t(v)("models.lower"),
              onClick: (y) => c(f, 1)
            }, "↓", 8, jc),
            e("button", {
              type: "button",
              "aria-label": t(v)("common.remove"),
              onClick: (y) => u(d)
            }, "✕", 8, Hc)
          ])
        ]))), 128))
      ])) : (o(), r("p", Yc, l(t(v)("models.empty")), 1)),
      h.value.length ? (o(), ke(t(De), {
        key: 2,
        options: h.value,
        "model-value": "",
        placeholder: t(v)("models.addPlaceholder"),
        "onUpdate:modelValue": V
      }, null, 8, ["options", "placeholder"])) : R("", !0)
    ]));
  }
}), Dt = /* @__PURE__ */ Me(Xc, [["__scopeId", "data-v-7089f4a3"]]), Jc = { class: "pp-head" }, Wc = ["aria-label", "disabled"], qc = { class: "pp-roots" }, Gc = ["onClick"], Zc = ["placeholder"], Qc = ["aria-busy"], ed = {
  key: 0,
  class: "pp-empty"
}, td = {
  key: 1,
  class: "pp-empty pp-error"
}, sd = {
  key: 2,
  class: "pp-empty"
}, ld = ["title", "onClick"], nd = { class: "pp-name" }, od = ["title"], ad = { class: "pp-foot" }, id = ["disabled"], rd = ["disabled"], ud = /* @__PURE__ */ pe({
  __name: "PathPicker",
  props: {
    open: { type: Boolean },
    initial: {},
    title: {}
  },
  emits: ["update:open", "pick"],
  setup(F, { emit: s }) {
    const v = F, m = s, { t: k } = ve(), w = x(""), h = x(""), $ = x([]), V = x([]), u = x(!1), c = x(""), n = x(""), a = x(!1);
    let d = "";
    async function f(O) {
      u.value = !0, c.value = "";
      try {
        const D = await fetch(`/api/agent/workspace?path=${encodeURIComponent(O || "")}`);
        if (!D.ok) {
          const I = await D.json().catch(() => ({}));
          c.value = I?.error || `HTTP ${D.status}`;
          return;
        }
        const U = await D.json();
        w.value = String(U?.path || ""), h.value = String(U?.parent || ""), $.value = Array.isArray(U?.roots) ? U.roots.map(String) : [], V.value = Array.isArray(U?.directories) ? U.directories.map((I) => ({ name: String(I?.name || ""), path: String(I?.path || "") })) : [], n.value = w.value, d = w.value;
      } catch (D) {
        c.value = D instanceof Error ? D.message : String(D);
      } finally {
        u.value = !1;
      }
    }
    Xe(
      () => v.open,
      (O) => {
        if (!O) return;
        c.value = "";
        const D = (v.initial || "").trim() || d;
        n.value = D, f(D);
      },
      { immediate: !0 }
    );
    function y() {
      m("update:open", !1);
    }
    function p() {
      const O = (w.value || n.value).trim();
      O && (m("pick", O), y());
    }
    function M(O) {
      f(O.path);
    }
    function A() {
      h.value && h.value !== w.value && f(h.value);
    }
    async function j() {
      if (!a.value) {
        a.value = !0, c.value = "";
        try {
          const O = await fetch(`/api/agent/pick-folder?title=${encodeURIComponent(v.title || k("settings.pathPickTitle"))}`);
          if (O.ok) {
            const D = await O.json().catch(() => ({}));
            D?.path && (m("pick", String(D.path)), y());
          }
        } catch (O) {
          c.value = O instanceof Error ? O.message : String(O);
        } finally {
          a.value = !1;
        }
      }
    }
    return (O, D) => (o(), ke(t(ms), {
      open: F.open,
      title: F.title || t(k)("settings.pathPickTitle"),
      "on-dismiss": y,
      "initial-focus": "first",
      "panel-class": "path-picker-panel"
    }, {
      default: et(() => [
        e("header", Jc, [
          e("h2", null, l(F.title || t(k)("settings.pathPickTitle")), 1),
          e("button", {
            class: "pp-icon",
            type: "button",
            "aria-label": t(k)("settings.pathUp"),
            disabled: u.value,
            onClick: A
          }, "↑", 8, Wc)
        ]),
        e("div", qc, [
          (o(!0), r(X, null, oe($.value, (U) => (o(), r("button", {
            key: U,
            class: ee(["pp-root", { "is-active": w.value === U }]),
            type: "button",
            onClick: (I) => f(U)
          }, l(U), 11, Gc))), 128))
        ]),
        B(e("input", {
          "onUpdate:modelValue": D[0] || (D[0] = (U) => n.value = U),
          class: "input pp-path",
          placeholder: t(k)("settings.pathPlaceholder"),
          spellcheck: "false",
          onKeydown: D[1] || (D[1] = mt(Oe((U) => f(n.value), ["prevent"]), ["enter"]))
        }, null, 40, Zc), [
          [Y, n.value]
        ]),
        e("div", {
          class: "pp-list",
          role: "listbox",
          "aria-busy": u.value
        }, [
          u.value ? (o(), r("p", ed, l(t(k)("settings.pathLoading")), 1)) : c.value ? (o(), r("p", td, l(c.value), 1)) : V.value.length ? (o(!0), r(X, { key: 3 }, oe(V.value, (U) => (o(), r("button", {
            key: U.path,
            class: "pp-item",
            type: "button",
            role: "option",
            title: U.path,
            onClick: (I) => M(U)
          }, [
            D[2] || (D[2] = e("span", {
              class: "pp-folder",
              "aria-hidden": "true"
            }, "▸", -1)),
            e("span", nd, l(U.name), 1)
          ], 8, ld))), 128)) : (o(), r("p", sd, l(t(k)("settings.pathEmpty")), 1))
        ], 8, Qc),
        e("p", {
          class: "pp-current",
          title: w.value
        }, l(t(k)("settings.pathSelected", { path: w.value || n.value || "—" })), 9, od),
        e("footer", ad, [
          e("button", {
            class: "btn btn-text",
            type: "button",
            disabled: a.value,
            onClick: j
          }, l(a.value ? t(k)("settings.pathNativeBusy") : t(k)("settings.pathNative")), 9, id),
          D[3] || (D[3] = e("span", { class: "pp-spacer" }, null, -1)),
          e("button", {
            class: "btn btn-text",
            type: "button",
            onClick: y
          }, l(t(k)("settings.cancel")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: u.value || !(w.value || n.value),
            onClick: p
          }, l(t(k)("settings.pathUse")), 9, rd)
        ])
      ]),
      _: 1
    }, 8, ["open", "title"]));
  }
}), cd = /* @__PURE__ */ Me(ud, [["__scopeId", "data-v-9d796590"]]), st = x([]);
let dd = 0;
const vt = /* @__PURE__ */ new Map();
function pd(F) {
  const s = vt.get(F);
  s && clearTimeout(s), vt.delete(F), st.value = st.value.filter((v) => v.id !== F);
}
function zt(F, s = "info", v) {
  const m = {
    id: ++dd,
    kind: s,
    message: F,
    duration: s === "error" ? 6500 : 3500
  };
  return st.value = [...st.value.slice(-4), m], vt.set(m.id, setTimeout(() => pd(m.id), m.duration)), m.id;
}
const hd = { class: "settings-page" }, vd = { class: "page-header" }, md = { class: "subtitle" }, gd = { key: 0 }, fd = { key: 1 }, _d = { class: "settings-layout" }, bd = {
  class: "settings-nav",
  "aria-label": "settings categories"
}, yd = ["aria-current", "data-tab-id", "title", "aria-label", "onClick"], kd = {
  class: "nav-icon",
  "aria-hidden": "true"
}, wd = {
  key: 0,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, $d = {
  key: 1,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Sd = {
  key: 2,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Cd = {
  key: 3,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, xd = {
  key: 4,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Md = {
  key: 5,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Pd = {
  key: 6,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ed = {
  key: 7,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ud = {
  key: 8,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Ad = {
  key: 9,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Td = {
  key: 10,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Id = {
  key: 11,
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none"
}, Nd = { class: "nav-label" }, Vd = { class: "settings-content" }, Rd = {
  key: 0,
  class: "content-card provider-runtime"
}, Ld = {
  key: 0,
  class: "helper-text"
}, Od = {
  key: 0,
  class: "toggle-label"
}, Dd = ["checked", "onChange"], zd = { key: 0 }, Bd = {
  key: 1,
  class: "helper-text"
}, Fd = {
  key: 0,
  class: "helper-text"
}, Kd = ["type", "value", "onInput"], jd = {
  key: 0,
  class: "helper-text"
}, Hd = { class: "actions-row" }, Yd = ["disabled"], Xd = {
  key: "live2d",
  class: "content-card"
}, Jd = { class: "card-desc" }, Wd = { class: "toggle-label" }, qd = { class: "field" }, Gd = { class: "model-choices" }, Zd = ["value", "checked", "onChange"], Qd = ["placeholder"], ep = { class: "helper-text" }, tp = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, sp = { class: "helper-text" }, lp = ["disabled"], np = { class: "field" }, op = {
  key: 0,
  class: "helper-text"
}, ap = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, ip = ["value", "checked", "onChange"], rp = ["onClick"], up = {
  key: 0,
  class: "card-desc"
}, cp = {
  key: 1,
  class: "helper-text"
}, dp = {
  key: 0,
  class: "toggle-label"
}, pp = ["checked", "onChange"], hp = { key: 0 }, vp = {
  key: 1,
  class: "helper-text"
}, mp = {
  key: 0,
  class: "helper-text"
}, gp = {
  key: 0,
  class: "helper-text"
}, fp = {
  key: 0,
  class: "helper-text"
}, _p = {
  key: 4,
  class: "field-note"
}, bp = { key: 0 }, yp = { class: "path-row" }, kp = ["value", "placeholder", "onInput"], wp = ["onClick"], $p = {
  key: 0,
  class: "helper-text"
}, Sp = { class: "actions-row" }, Cp = ["disabled"], xp = {
  key: 0,
  class: "helper-text"
}, Mp = {
  key: 0,
  class: "helper-text"
}, Pp = ["type", "value", "onInput"], Ep = {
  key: 0,
  class: "helper-text"
}, Up = { class: "actions-row" }, Ap = ["disabled"], Tp = {
  key: 0,
  class: "card-desc"
}, Ip = {
  key: 1,
  class: "card-desc"
}, Np = {
  key: 0,
  class: "toggle-label"
}, Vp = ["checked", "onChange"], Rp = { key: 0 }, Lp = {
  key: 1,
  class: "helper-text"
}, Op = {
  key: 0,
  class: "helper-text"
}, Dp = {
  key: 0,
  class: "helper-text"
}, zp = {
  key: 0,
  class: "helper-text"
}, Bp = ["type", "value", "onInput"], Fp = {
  key: 0,
  class: "helper-text"
}, Kp = { class: "actions-row" }, jp = ["disabled"], Hp = {
  key: "unknown",
  class: "content-card tab-unknown"
}, Gp = /* @__PURE__ */ pe({
  __name: "SettingsPage",
  setup(F) {
    const { t: s } = ve(), { confirm: v } = Ge(), m = nt(), k = gs(), w = Kt(), h = rs(), $ = Bt(), V = G(() => w.settingsTabs.map((z) => ({
      id: z.id,
      icon: z.icon || "chip"
    }))), u = G(() => {
      const z = new Set(w.settingsTabs.map((i) => i.id)), T = new Set(w.removedSettingsIds);
      return k.sections.filter((i) => i.id !== "permissions" && !z.has(i.id) && !T.has(i.id)).map((i) => ({ id: i.id, icon: i.icon || "lock" }));
    }), c = G(() => [...V.value, ...u.value]), n = x("general"), a = x(!1), d = x([]), f = x(null), y = x(""), p = x({}), M = x(""), A = x("ok"), j = x(!1), O = x(!1), D = x(""), U = x(!1), I = x([]), J = G(() => s("settings.modelAuto")), ie = G(() => [
      { value: "", label: J.value },
      ...I.value.map((z) => ({ value: z, label: z }))
    ]);
    async function re() {
      try {
        const z = await fetch("/api/models");
        if (!z.ok) return;
        const T = await z.json();
        I.value = Array.from(new Set((T.models || []).map((i) => String(i.id || "")).filter(Boolean)));
      } catch {
      }
    }
    async function H(z) {
      O.value = !0, D.value = "";
      try {
        const T = await fetch(`/api/settings/${z}/test`, { method: "POST" }), i = T.headers.get("content-type") || "";
        if (T.ok && i.startsWith("audio")) {
          const N = URL.createObjectURL(await T.blob());
          try {
            await new Audio(N).play();
          } catch {
          }
          window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: N } })), D.value = s("settings.testSuccess");
        } else {
          const N = await T.json().catch(() => ({}));
          D.value = N.error || `HTTP ${T.status}`;
        }
      } catch (T) {
        D.value = T instanceof Error ? T.message : String(T);
      } finally {
        O.value = !1;
      }
    }
    const { tabMeta: E, isBuiltinTab: P, isPluginSection: Pe, tabLabel: Se, fieldLabel: Ee, fieldHelp: le, pluginSection: ne } = gt(), _e = x(""), we = G({
      get: () => _e.value !== "",
      set: (z) => {
        z || (_e.value = "");
      }
    }), Ue = G(() => ne(n.value)?.fields.find((T) => T.key === _e.value)?.label || ""), me = G(() => String(p.value[n.value]?.[_e.value] ?? ""));
    function Ce(z) {
      const T = _e.value;
      T && (p.value = {
        ...p.value,
        [n.value]: { ...p.value[n.value], [T]: z }
      });
    }
    const be = G(() => P(n.value) ? null : E(n.value)?.module || null);
    function ye(z, T) {
      const i = p.value[z]?.[T];
      return typeof i == "boolean" ? i : i === "true" || i === 1 || i === "1";
    }
    function Ae(z) {
      if (E(z)?.fields?.length && !P(z)) {
        ue(z);
        return;
      }
      const i = ne(z);
      if (!i) return;
      const N = {};
      for (const q of i.fields)
        q.type !== "note" && (q.type === "bool" ? N[q.key] = q.default_value === "true" || q.default_value === "1" : q.type === "number" ? N[q.key] = Number(q.default_value || 0) : N[q.key] = q.default_value || "");
      const de = k.values[z] || {}, ge = { ...N };
      for (const q of i.fields) {
        if (!(q.key in de)) continue;
        const fe = de[q.key];
        q.type === "bool" ? ge[q.key] = fe === !0 || fe === "true" || fe === 1 || fe === "1" : ge[q.key] = fe;
      }
      p.value = {
        ...p.value,
        [z]: ge
      };
    }
    async function ue(z) {
      const T = E(z);
      if (!T?.fields?.length) return;
      const i = {};
      for (const N of T.fields)
        N.type === "bool" ? i[N.key] = N.default_value === "true" || N.default_value === "1" : N.type === "number" ? i[N.key] = Number(N.default_value || 0) : i[N.key] = N.default_value || "";
      if (T.loadApi)
        try {
          const N = await fetch(T.loadApi);
          if (N.ok) {
            const de = await N.json();
            for (const ge of T.fields) {
              if (!(ge.key in de)) continue;
              const q = de[ge.key];
              ge.type === "bool" ? i[ge.key] = q === !0 || q === "true" || q === 1 || q === "1" : i[ge.key] = q;
            }
          }
        } catch {
        }
      p.value = { ...p.value, [z]: i };
    }
    async function he(z) {
      const T = E(z);
      if (!j.value) {
        j.value = !0, M.value = "";
        try {
          const i = p.value[z] || {};
          if (T?.saveApi) {
            const N = await fetch(T.saveApi, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(i)
            });
            if (!N.ok) throw new Error(String(N.status));
          }
          M.value = s("settings.saved"), A.value = "ok", setTimeout(() => {
            M.value = "";
          }, 3e3);
        } catch {
          M.value = s("settings.permFailed"), A.value = "error";
        } finally {
          j.value = !1;
        }
      }
    }
    async function ze(z) {
      if (!j.value) {
        j.value = !0, M.value = "";
        try {
          const T = new Set((ne(z)?.fields || []).filter((N) => N.type === "note").map((N) => N.key)), i = Object.fromEntries(
            Object.entries(p.value[z] || {}).filter(([N]) => !T.has(N))
          );
          await k.saveValues(z, i), M.value = s("settings.saved"), A.value = "ok", setTimeout(() => {
            M.value = "";
          }, 3e3);
        } catch {
          M.value = s("settings.permFailed"), A.value = "error";
        } finally {
          j.value = !1;
        }
      }
    }
    async function je() {
      try {
        const z = await fetch("/api/live2d");
        if (z.ok) {
          const T = await z.json();
          d.value = T.models || [];
        }
      } catch {
        d.value = [];
      }
    }
    async function Be(z) {
      if (await v({
        title: s("settings.live2d"),
        message: s("settings.deleteModelConfirm", { label: z.label }),
        confirmLabel: s("common.delete"),
        danger: !0
      }))
        try {
          const i = await fetch(`/api/live2d/${encodeURIComponent(z.id)}`, { method: "DELETE" });
          if (!i.ok) throw new Error(await i.text());
          const N = await i.json();
          d.value = N.models || [];
          const de = z.url.slice(0, z.url.indexOf("/", 15) + 1);
          m.live2d.modelUrl.startsWith(de) && (m.live2d.modelUrl = "", m.live2d.enabled = !1, m.saveToStorage()), await b(), y.value = s("settings.modelDeleted"), window.dispatchEvent(new Event("live2d-models-changed"));
        } catch (i) {
          y.value = i.message;
        }
    }
    async function b() {
      m.saveToStorage();
      const z = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: m.live2d.enabled, model_url: m.live2d.modelUrl } }) });
      if (!z.ok) throw new Error(await z.text());
    }
    async function C() {
      if (!U.value) {
        U.value = !0, y.value = "";
        try {
          await b(), y.value = s("settings.saved"), setTimeout(() => {
            y.value === s("settings.saved") && (y.value = "");
          }, 3e3);
        } catch (z) {
          y.value = z.message, zt(s("settings.permFailed"), "error");
        } finally {
          U.value = !1;
        }
      }
    }
    function S() {
      f.value?.click();
    }
    async function Z(z) {
      const T = z.target, i = T.files;
      if (!(!i || i.length === 0)) {
        y.value = "";
        try {
          const N = new FormData(), de = [];
          for (const fe of Array.from(i)) {
            const at = fe.webkitRelativePath || fe.name;
            de.push(at), N.append("files", fe, fe.name);
          }
          N.append("paths", JSON.stringify(de));
          const ge = await fetch("/api/live2d", { method: "POST", body: N });
          if (!ge.ok) throw new Error(await ge.text());
          const q = await ge.json();
          y.value = s("settings.uploadOk"), q?.models ? d.value = q.models : await je(), q?.model_url && (m.live2d.modelUrl = q.model_url, m.live2d.enabled = !0, m.saveToStorage(), await b(), window.dispatchEvent(new Event("live2d-models-changed")));
        } catch (N) {
          y.value = `${s("settings.uploadFail")}：${N.message}`;
        } finally {
          T.value = "";
        }
      }
    }
    Ne(async () => {
      m.loadFromStorage();
      const z = h.query.tab;
      z && (n.value = z), je(), re(), await k.fetchSections();
      for (const T of k.sections) Ae(T.id);
      !c.value.some((T) => T.id === n.value) && !P(n.value) && (n.value = "general");
    });
    function Te(z) {
      n.value = z, P(z) || Ae(z), $.replace({ query: { tab: z } });
    }
    function Re() {
      if (m.saveToStorage(), n.value === "live2d") {
        b().then(() => {
          a.value = !0, setTimeout(() => {
            a.value = !1;
          }, 1500);
        }).catch((z) => {
          y.value = z.message, zt(s("settings.permFailed"), "error");
        });
        return;
      }
      a.value = !0, setTimeout(() => {
        a.value = !1;
      }, 1500);
    }
    return (z, T) => (o(), r("div", hd, [
      e("header", vd, [
        e("div", null, [
          e("h1", null, l(t(s)("settings.title")), 1),
          e("p", md, l(t(s)("settings.pageDesc")), 1)
        ]),
        t(P)(n.value) && n.value !== "about" && n.value !== "updates" && n.value !== "danger" ? (o(), r("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: Re
        }, [
          a.value ? (o(), r("span", gd, l(t(s)("settings.saved")), 1)) : (o(), r("span", fd, l(t(s)("settings.save")), 1))
        ])) : R("", !0)
      ]),
      e("div", _d, [
        e("nav", bd, [
          (o(!0), r(X, null, oe(c.value, (i) => (o(), r("button", {
            key: i.id,
            class: ee(["nav-item", { active: n.value === i.id }]),
            "aria-current": n.value === i.id ? "true" : void 0,
            "data-tab-id": i.id,
            title: t(Se)(i.id),
            "aria-label": t(Se)(i.id),
            onClick: (N) => Te(i.id)
          }, [
            T[19] || (T[19] = e("span", { class: "nav-indicator" }, null, -1)),
            e("span", kd, [
              i.icon === "globe" ? (o(), r("svg", wd, [...T[7] || (T[7] = [
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
              ])])) : i.icon === "cloud" ? (o(), r("svg", $d, [...T[8] || (T[8] = [
                e("path", {
                  d: "M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linejoin": "round"
                }, null, -1)
              ])])) : i.icon === "chip" ? (o(), r("svg", Sd, [...T[9] || (T[9] = [
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
              ])])) : i.icon === "person" ? (o(), r("svg", Cd, [...T[10] || (T[10] = [
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
              ])])) : i.icon === "avatar" ? (o(), r("svg", xd, [...T[11] || (T[11] = [
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
              ])])) : i.icon === "brightness" ? (o(), r("svg", Md, [...T[12] || (T[12] = [
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
              ])])) : i.icon === "warn" ? (o(), r("svg", Pd, [...T[13] || (T[13] = [
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
              ])])) : i.icon === "info" ? (o(), r("svg", Ed, [...T[14] || (T[14] = [
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
              ])])) : i.icon === "download" ? (o(), r("svg", Ud, [...T[15] || (T[15] = [
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
              ])])) : i.icon === "shield" ? (o(), r("svg", Ad, [...T[16] || (T[16] = [
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
              ])])) : i.icon === "link" ? (o(), r("svg", Td, [...T[17] || (T[17] = [
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
              ])])) : (o(), r("svg", Id, [...T[18] || (T[18] = [
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
            e("span", Nd, l(t(Se)(i.id)), 1)
          ], 10, yd))), 128))
        ]),
        e("section", Vd, [
          ae(is, {
            name: "tab",
            mode: "out-in"
          }, {
            default: et(() => [
              n.value === "general" ? (o(), ke(Ri, { key: "general" })) : n.value === "connection" ? (o(), ke(ar, { key: "connection" })) : n.value === "provider" ? (o(), r(X, { key: 2 }, [
                ae(ki),
                t(ne)("provider")?.fields?.length ? (o(), r("div", Rd, [
                  e("h3", null, l(t(ne)("provider").label), 1),
                  t(ne)("provider").description ? (o(), r("p", Ld, l(t(ne)("provider").description), 1)) : R("", !0),
                  (o(!0), r(X, null, oe(t(ne)("provider").fields, (i) => (o(), r("div", {
                    key: i.key,
                    class: "field"
                  }, [
                    i.type === "bool" ? (o(), r("label", Od, [
                      e("input", {
                        type: "checkbox",
                        checked: ye("provider", i.key),
                        onChange: (N) => p.value = { ...p.value, provider: { ...p.value.provider, [i.key]: N.target.checked } }
                      }, null, 40, Dd),
                      T[20] || (T[20] = e("span", { class: "toggle-slider" }, null, -1)),
                      e("span", null, [
                        e("strong", null, l(i.label), 1),
                        i.help ? (o(), r("br", zd)) : R("", !0),
                        i.help ? (o(), r("small", Bd, l(i.help), 1)) : R("", !0)
                      ])
                    ])) : i.type === "select" ? (o(), r(X, { key: 1 }, [
                      e("label", null, l(i.label), 1),
                      ae(t(De), {
                        class: "input",
                        "aria-label": i.label,
                        "model-value": String(p.value.provider?.[i.key] ?? ""),
                        options: i.options || [],
                        "onUpdate:modelValue": (N) => p.value = { ...p.value, provider: { ...p.value.provider, [i.key]: N } }
                      }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                      i.help ? (o(), r("p", Fd, l(i.help), 1)) : R("", !0)
                    ], 64)) : (o(), r(X, { key: 2 }, [
                      e("label", null, l(i.label), 1),
                      e("input", {
                        class: "input",
                        type: i.type === "number" ? "number" : "text",
                        value: p.value.provider?.[i.key],
                        onInput: (N) => p.value = { ...p.value, provider: { ...p.value.provider, [i.key]: i.type === "number" ? Number(N.target.value) : N.target.value } }
                      }, null, 40, Kd),
                      i.help ? (o(), r("p", jd, l(i.help), 1)) : R("", !0)
                    ], 64))
                  ]))), 128)),
                  M.value ? (o(), r("div", {
                    key: 1,
                    class: ee(["helper-text", A.value === "error" ? "msg-error" : "msg-success"]),
                    role: "status"
                  }, l(M.value), 3)) : R("", !0),
                  e("div", Hd, [
                    e("button", {
                      class: "btn btn-primary",
                      type: "button",
                      disabled: j.value,
                      onClick: T[0] || (T[0] = (i) => ze("provider"))
                    }, l(t(s)("settings.save")), 9, Yd)
                  ])
                ])) : R("", !0)
              ], 64)) : n.value === "persona" ? (o(), ke(Sr, { key: 3 })) : n.value === "live2d" ? (o(), r("div", Xd, [
                e("h2", null, l(t(Se)("live2d")), 1),
                e("p", Jd, l(t(E)("live2d")?.descriptionKey ? t(s)(t(E)("live2d").descriptionKey) : t(s)("settings.live2dDesc")), 1),
                ae(Ms, { class: "live2d-preview" }),
                e("label", Wd, [
                  B(e("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": T[1] || (T[1] = (i) => t(m).live2d.enabled = i)
                  }, null, 512), [
                    [ce, t(m).live2d.enabled]
                  ]),
                  T[21] || (T[21] = e("span", { class: "toggle-slider" }, null, -1)),
                  e("span", null, l(t(s)("wizard.enableLive2d")), 1)
                ]),
                e("div", qd, [
                  e("label", null, l(t(s)("wizard.modelUrl")), 1),
                  e("div", Gd, [
                    (o(!0), r(X, null, oe(t(fs), (i) => (o(), r("label", {
                      key: i.id,
                      class: ee(["model-choice", { selected: t(m).live2d.modelUrl === i.url }])
                    }, [
                      e("input", {
                        type: "radio",
                        name: "live2d-model",
                        value: i.url,
                        checked: t(m).live2d.modelUrl === i.url,
                        onChange: (N) => {
                          t(m).live2d.modelUrl = i.url, t(m).live2d.enabled = !0;
                        }
                      }, null, 40, Zd),
                      e("span", null, l(i.label), 1),
                      e("code", null, l(i.url), 1)
                    ], 2))), 128))
                  ]),
                  B(e("input", {
                    "onUpdate:modelValue": T[2] || (T[2] = (i) => t(m).live2d.modelUrl = i),
                    placeholder: t(s)("wizard.modelUrlPlaceholder"),
                    class: "input"
                  }, null, 8, Qd), [
                    [Y, t(m).live2d.modelUrl]
                  ]),
                  e("p", ep, [
                    Ie(l(t(s)("wizard.live2dHelp")) + " ", 1),
                    e("a", tp, l(t(s)("wizard.live2dSamples")), 1)
                  ])
                ]),
                e("p", sp, l(t(s)("settings.live2dHelper")), 1),
                e("button", {
                  class: "btn btn-tonal",
                  disabled: U.value,
                  onClick: C
                }, l(U.value ? t(s)("settings.saving") : t(s)("settings.saveLife2d")), 9, lp),
                e("div", np, [
                  e("label", null, l(t(s)("settings.uploadFolder")), 1),
                  e("label", {
                    class: "upload-area",
                    onClick: Oe(S, ["prevent"])
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
                    onChange: Z
                  }, null, 544),
                  y.value ? (o(), r("p", op, l(y.value), 1)) : R("", !0),
                  d.value.length ? (o(), r("div", ap, [
                    (o(!0), r(X, null, oe(d.value, (i) => (o(), r("label", {
                      key: i.id,
                      class: ee(["model-choice", { selected: t(m).live2d.modelUrl === i.url }])
                    }, [
                      e("input", {
                        type: "radio",
                        name: "live2d-uploaded",
                        value: i.url,
                        checked: t(m).live2d.modelUrl === i.url,
                        onChange: (N) => {
                          t(m).live2d.modelUrl = i.url, t(m).live2d.enabled = !0, b().catch((de) => y.value = de.message);
                        }
                      }, null, 40, ip),
                      e("span", null, l(i.label), 1),
                      e("code", null, l(i.url), 1),
                      e("button", {
                        type: "button",
                        class: "btn btn-danger",
                        onClick: Oe((N) => Be(i), ["prevent"])
                      }, l(t(s)("settings.deleteModel")), 9, rp)
                    ], 2))), 128))
                  ])) : R("", !0)
                ])
              ])) : n.value === "security" ? (o(), ke(yu, { key: 5 })) : n.value === "permissions" ? (o(), ke(Rr, { key: 6 })) : n.value === "mcp" ? (o(), ke(Pc, { key: 7 })) : n.value === "life_settings" ? (o(), ke(Wl, { key: 8 })) : t(Pe)(n.value) && t(ne)(n.value) ? (o(), r("div", {
                key: `section-${n.value}`,
                class: "content-card"
              }, [
                e("h2", null, l(t(ne)(n.value).label), 1),
                t(ne)(n.value).description ? (o(), r("p", up, l(t(ne)(n.value).description), 1)) : R("", !0),
                t(ne)(n.value).plugin_name && t(ne)(n.value).plugin_name !== n.value ? (o(), r("p", cp, l(t(s)("settings.pluginProvidedBy", { name: t(ne)(n.value).plugin_name })), 1)) : R("", !0),
                (o(!0), r(X, null, oe(t(ne)(n.value).fields, (i) => (o(), r("div", {
                  key: i.key,
                  class: "field"
                }, [
                  i.type === "bool" ? (o(), r("label", dp, [
                    e("input", {
                      type: "checkbox",
                      checked: ye(n.value, i.key),
                      onChange: (N) => p.value = { ...p.value, [n.value]: { ...p.value[n.value], [i.key]: N.target.checked } }
                    }, null, 40, pp),
                    T[22] || (T[22] = e("span", { class: "toggle-slider" }, null, -1)),
                    e("span", null, [
                      e("strong", null, l(i.label), 1),
                      i.help ? (o(), r("br", hp)) : R("", !0),
                      i.help ? (o(), r("small", vp, l(i.help), 1)) : R("", !0)
                    ])
                  ])) : i.type === "select" ? (o(), r(X, { key: 1 }, [
                    e("label", null, l(i.label), 1),
                    ae(t(De), {
                      class: "input",
                      "aria-label": i.label,
                      "model-value": String(p.value[n.value]?.[i.key] ?? ""),
                      options: i.options || [],
                      "onUpdate:modelValue": (N) => p.value[n.value] = { ...p.value[n.value], [i.key]: N }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    i.help ? (o(), r("p", mp, l(i.help), 1)) : R("", !0)
                  ], 64)) : i.type === "model" ? (o(), r(X, { key: 2 }, [
                    e("label", null, l(i.label), 1),
                    ae(t(De), {
                      class: "input",
                      "aria-label": i.label,
                      "model-value": String(p.value[n.value]?.[i.key] ?? ""),
                      options: ie.value,
                      "onUpdate:modelValue": (N) => p.value[n.value] = { ...p.value[n.value], [i.key]: N }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    i.help ? (o(), r("p", gp, l(i.help), 1)) : R("", !0)
                  ], 64)) : i.type === "models" ? (o(), r(X, { key: 3 }, [
                    e("label", null, l(i.label), 1),
                    ae(Dt, {
                      "model-value": String(p.value[n.value]?.[i.key] ?? ""),
                      options: I.value,
                      "onUpdate:modelValue": (N) => p.value[n.value] = { ...p.value[n.value], [i.key]: N }
                    }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                    i.help ? (o(), r("p", fp, l(i.help), 1)) : R("", !0)
                  ], 64)) : i.type === "note" ? (o(), r("div", _p, [
                    i.label ? (o(), r("strong", bp, l(i.label), 1)) : R("", !0),
                    ae(t(_s), {
                      content: i.help || ""
                    }, null, 8, ["content"])
                  ])) : i.type === "dir" ? (o(), r(X, { key: 5 }, [
                    e("label", null, l(i.label), 1),
                    e("div", yp, [
                      e("input", {
                        class: "input",
                        type: "text",
                        spellcheck: "false",
                        value: p.value[n.value]?.[i.key],
                        placeholder: i.default_value || "",
                        onInput: (N) => p.value = { ...p.value, [n.value]: { ...p.value[n.value], [i.key]: N.target.value } }
                      }, null, 40, kp),
                      e("button", {
                        class: "btn btn-tonal",
                        type: "button",
                        onClick: (N) => _e.value = i.key
                      }, l(t(s)("settings.browse")), 9, wp)
                    ]),
                    i.help ? (o(), r("p", $p, l(i.help), 1)) : R("", !0)
                  ], 64)) : i.type === "test" ? (o(), r(X, { key: 6 }, [
                    e("label", null, l(i.label), 1),
                    e("div", Sp, [
                      e("button", {
                        class: "btn btn-tonal",
                        type: "button",
                        disabled: O.value,
                        onClick: T[3] || (T[3] = (N) => H(n.value))
                      }, l(O.value ? t(s)("settings.testing") : i.label || t(s)("settings.test")), 9, Cp),
                      D.value ? (o(), r("span", xp, l(D.value), 1)) : R("", !0)
                    ]),
                    i.help ? (o(), r("p", Mp, l(i.help), 1)) : R("", !0)
                  ], 64)) : (o(), r(X, { key: 7 }, [
                    e("label", null, l(i.label), 1),
                    e("input", {
                      class: "input",
                      type: i.type === "number" ? "number" : "text",
                      value: p.value[n.value]?.[i.key],
                      onInput: (N) => p.value[n.value] = { ...p.value[n.value], [i.key]: i.type === "number" ? Number(N.target.value) : N.target.value }
                    }, null, 40, Pp),
                    i.help ? (o(), r("p", Ep, l(i.help), 1)) : R("", !0)
                  ], 64))
                ]))), 128)),
                M.value ? (o(), r("div", {
                  key: 2,
                  class: ee(["helper-text", A.value === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, l(M.value), 3)) : R("", !0),
                e("div", Up, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: j.value,
                    onClick: T[4] || (T[4] = (i) => ze(n.value))
                  }, l(t(s)("settings.save")), 9, Ap)
                ])
              ])) : be.value ? (o(), ke(Lc, {
                key: be.value,
                module: be.value || ""
              }, null, 8, ["module"])) : !t(P)(n.value) && t(E)(n.value)?.fields?.length ? (o(), r("div", {
                key: `patch-${n.value}`,
                class: "content-card"
              }, [
                e("h2", null, l(t(Se)(n.value)), 1),
                t(E)(n.value)?.descriptionKey ? (o(), r("p", Tp, l(t(s)(t(E)(n.value).descriptionKey)), 1)) : t(E)(n.value)?.description ? (o(), r("p", Ip, l(t(E)(n.value).description), 1)) : R("", !0),
                (o(!0), r(X, null, oe(t(E)(n.value).fields, (i) => (o(), r("div", {
                  key: i.key,
                  class: "field"
                }, [
                  i.type === "bool" ? (o(), r("label", Np, [
                    e("input", {
                      type: "checkbox",
                      checked: ye(n.value, i.key),
                      onChange: (N) => p.value = { ...p.value, [n.value]: { ...p.value[n.value], [i.key]: N.target.checked } }
                    }, null, 40, Vp),
                    T[23] || (T[23] = e("span", { class: "toggle-slider" }, null, -1)),
                    e("span", null, [
                      e("strong", null, l(t(Ee)(t(E)(n.value), i.key, `settings.${i.key}`)), 1),
                      i.help || i.helpKey ? (o(), r("br", Rp)) : R("", !0),
                      i.help || i.helpKey ? (o(), r("small", Lp, l(t(le)(t(E)(n.value), i.key, `settings.${i.key}Desc`)), 1)) : R("", !0)
                    ])
                  ])) : i.type === "select" ? (o(), r(X, { key: 1 }, [
                    e("label", null, l(t(Ee)(t(E)(n.value), i.key, `settings.${i.key}`)), 1),
                    ae(t(De), {
                      class: "input",
                      "aria-label": t(Ee)(t(E)(n.value), i.key, `settings.${i.key}`),
                      "model-value": String(p.value[n.value]?.[i.key] ?? ""),
                      options: i.options || [],
                      "onUpdate:modelValue": (N) => p.value[n.value] = { ...p.value[n.value], [i.key]: N }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    i.help || i.helpKey ? (o(), r("p", Op, l(t(le)(t(E)(n.value), i.key, `settings.${i.key}Desc`)), 1)) : R("", !0)
                  ], 64)) : i.type === "model" ? (o(), r(X, { key: 2 }, [
                    e("label", null, l(t(Ee)(t(E)(n.value), i.key, `settings.${i.key}`)), 1),
                    ae(t(De), {
                      class: "input",
                      "aria-label": t(Ee)(t(E)(n.value), i.key, `settings.${i.key}`),
                      "model-value": String(p.value[n.value]?.[i.key] ?? ""),
                      options: ie.value,
                      "onUpdate:modelValue": (N) => p.value[n.value] = { ...p.value[n.value], [i.key]: N }
                    }, null, 8, ["aria-label", "model-value", "options", "onUpdate:modelValue"]),
                    i.help || i.helpKey ? (o(), r("p", Dp, l(t(le)(t(E)(n.value), i.key, `settings.${i.key}Desc`)), 1)) : R("", !0)
                  ], 64)) : i.type === "models" ? (o(), r(X, { key: 3 }, [
                    e("label", null, l(t(Ee)(t(E)(n.value), i.key, `settings.${i.key}`)), 1),
                    ae(Dt, {
                      "model-value": String(p.value[n.value]?.[i.key] ?? ""),
                      options: I.value,
                      "onUpdate:modelValue": (N) => p.value[n.value] = { ...p.value[n.value], [i.key]: N }
                    }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                    i.help || i.helpKey ? (o(), r("p", zp, l(t(le)(t(E)(n.value), i.key, `settings.${i.key}Desc`)), 1)) : R("", !0)
                  ], 64)) : (o(), r(X, { key: 4 }, [
                    e("label", null, l(t(Ee)(t(E)(n.value), i.key, `settings.${i.key}`)), 1),
                    e("input", {
                      class: "input",
                      type: i.type === "number" ? "number" : "text",
                      value: p.value[n.value]?.[i.key],
                      onInput: (N) => p.value[n.value] = { ...p.value[n.value], [i.key]: i.type === "number" ? Number(N.target.value) : N.target.value }
                    }, null, 40, Bp),
                    i.help || i.helpKey ? (o(), r("p", Fp, l(t(le)(t(E)(n.value), i.key, `settings.${i.key}Desc`)), 1)) : R("", !0)
                  ], 64))
                ]))), 128)),
                M.value ? (o(), r("div", {
                  key: 2,
                  class: ee(["helper-text", A.value === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, l(M.value), 3)) : R("", !0),
                e("div", Kp, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: j.value,
                    onClick: T[5] || (T[5] = (i) => he(n.value))
                  }, l(t(s)("settings.save")), 9, jp)
                ])
              ])) : n.value === "about" ? (o(), ke(so, { key: "about" })) : n.value === "updates" ? (o(), ke(Jo, { key: "updates" })) : n.value === "danger" ? (o(), ke(Ic, { key: "danger" })) : (o(), r("div", Hp, [
                e("p", null, l(t(s)("settings.tabNotFound")), 1)
              ]))
            ]),
            _: 1
          })
        ])
      ]),
      ae(cd, {
        open: we.value,
        "onUpdate:open": T[6] || (T[6] = (i) => we.value = i),
        initial: me.value,
        title: Ue.value,
        onPick: Ce
      }, null, 8, ["open", "initial", "title"])
    ]));
  }
});
export {
  Gp as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent="@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage[data-v-15b509be]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-15b509be]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-15b509be]:active{cursor:grabbing}.stage-canvas[data-v-15b509be]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-15b509be]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-15b509be]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-15b509be]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-15b509be]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-15b509be]:active{transform:scale(.96)}.stage-reset.dragging[data-v-15b509be]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-15b509be]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-15b509be]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-15b509be]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.life-settings[data-v-71eaecdc]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-71eaecdc]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-71eaecdc .52s var(--ls-spring) both}.ls-hero-main[data-v-71eaecdc]{min-width:0}.ls-eyebrow[data-v-71eaecdc]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-71eaecdc]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-71eaecdc]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-71eaecdc]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-71eaecdc]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-71eaecdc]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-71eaecdc]{font-size:16px}.ls-grid[data-v-71eaecdc]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-71eaecdc]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-71eaecdc .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-71eaecdc]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-71eaecdc]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-71eaecdc]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-71eaecdc]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-71eaecdc]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-71eaecdc]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-71eaecdc]{grid-column:1 / -1}.ls-card-head[data-v-71eaecdc]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-71eaecdc]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-71eaecdc]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-71eaecdc]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-71eaecdc]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-71eaecdc]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-71eaecdc]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-71eaecdc]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-71eaecdc]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-71eaecdc]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-71eaecdc]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-71eaecdc]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-71eaecdc]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-71eaecdc]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-71eaecdc]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-71eaecdc]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-71eaecdc]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-71eaecdc]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-71eaecdc]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-71eaecdc]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-71eaecdc]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-71eaecdc]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-71eaecdc]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-71eaecdc]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-71eaecdc]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-71eaecdc]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-71eaecdc]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-71eaecdc]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-71eaecdc]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-71eaecdc]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-71eaecdc]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-71eaecdc]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-71eaecdc]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-71eaecdc]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}#app .ls-model[data-v-71eaecdc]{border-radius:20px}#app .ls-model.selected[data-v-71eaecdc]{border-radius:20px 20px 20px 8px}.ls-model b[data-v-71eaecdc]{font-size:13px;word-break:break-all}.ls-model span[data-v-71eaecdc]{font-size:12px;color:var(--md-on-surface-variant)}.ls-hint[data-v-71eaecdc]{margin:12px 0 0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.ls-state[data-v-71eaecdc]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-71eaecdc .32s var(--ls-spring) both}@keyframes ls-rise-71eaecdc{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-71eaecdc{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-71eaecdc],.ls-row[data-v-71eaecdc],.ls-models[data-v-71eaecdc]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-71eaecdc],.ls-card[data-v-71eaecdc],.ls-state[data-v-71eaecdc]{animation:none}}.about[data-v-da8c447d]{display:flex;flex-direction:column;gap:26px}.identity[data-v-da8c447d]{display:flex;align-items:center;gap:16px}.app-icon[data-v-da8c447d]{flex:none;width:56px;height:56px;filter:drop-shadow(0 6px 16px color-mix(in srgb,var(--md-primary) 25%,transparent))}.app-id[data-v-da8c447d]{flex:1;min-width:0}.app-id h2[data-v-da8c447d]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-da8c447d]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-da8c447d]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-da8c447d]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-da8c447d]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-da8c447d]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-da8c447d]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-da8c447d]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.credits[data-v-da8c447d]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-da8c447d]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-da8c447d]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-da8c447d]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-da8c447d]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-da8c447d]{font-size:16px;font-weight:650}.person-info .role[data-v-da8c447d]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-da8c447d]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-da8c447d]{margin-top:6px}.contribs[data-v-da8c447d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-da8c447d]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-da8c447d]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-da8c447d]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-da8c447d]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-da8c447d]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-da8c447d]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-da8c447d]{margin-left:auto}.status-chip[data-v-da8c447d]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-da8c447d]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-da8c447d]:hover{text-decoration:underline}.muted[data-v-da8c447d]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-da8c447d]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-da8c447d]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-hero.warn[data-v-da8c447d]{background:var(--md-warning-container);color:var(--md-on-warning-container);border-color:transparent}.us-hero.none[data-v-da8c447d]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-da8c447d]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-da8c447d]{flex:1;min-width:0}.us-hero-text b[data-v-da8c447d]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-da8c447d]{font-size:13px;opacity:.85}.us-hero-text em[data-v-da8c447d]{font-style:normal;font-weight:700}.us-hero-actions[data-v-da8c447d]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-da8c447d]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-da8c447d]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-da8c447d]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-da8c447d]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-da8c447d]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-da8c447d]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-apply-banner.failed[data-v-da8c447d]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-da8c447d]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-da8c447d]{font-weight:700}.us-apply-label[data-v-da8c447d]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-da8c447d]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-da8c447d]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-da8c447d]{animation:us-spin-da8c447d .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-da8c447d],.us-apply-banner.failed .us-spinner[data-v-da8c447d]{display:none}.us-apply-log[data-v-da8c447d],.us-apply-error[data-v-da8c447d]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-da8c447d{to{transform:rotate(360deg)}}.alert[data-v-da8c447d]{color:var(--md-error)}.updates[data-v-95a0aad4]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-95a0aad4]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-95a0aad4]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-95a0aad4]{display:flex;align-items:center;gap:12px}.us-ico[data-v-95a0aad4]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-95a0aad4]{flex:1;min-width:0}.us-title[data-v-95a0aad4]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-95a0aad4]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-95a0aad4]{display:flex;align-items:center;gap:8px}.us-tag[data-v-95a0aad4]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-95a0aad4]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-95a0aad4]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-95a0aad4]{background:#ffdf9e;color:#4a3800}.us-source[data-v-95a0aad4]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-95a0aad4]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-95a0aad4]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-95a0aad4]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-95a0aad4]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-95a0aad4]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-95a0aad4]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-95a0aad4]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-95a0aad4]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-95a0aad4]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-95a0aad4]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-95a0aad4]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-95a0aad4]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-95a0aad4]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-95a0aad4]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-95a0aad4]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-95a0aad4]{flex:1;min-width:0}.us-hero-text b[data-v-95a0aad4]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-95a0aad4]{font-size:13px;opacity:.85}.us-hero-text em[data-v-95a0aad4]{font-style:normal;font-weight:700}.us-hero-actions[data-v-95a0aad4]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-95a0aad4]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-95a0aad4]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-95a0aad4]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-95a0aad4]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-95a0aad4]{font-weight:700}.us-apply-label[data-v-95a0aad4]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-95a0aad4]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-95a0aad4]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-95a0aad4]{animation:us-spin-95a0aad4 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-95a0aad4],.us-apply-banner.failed .us-spinner[data-v-95a0aad4]{display:none}.us-apply-log[data-v-95a0aad4],.us-apply-error[data-v-95a0aad4]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-95a0aad4{to{transform:rotate(360deg)}}.us-table[data-v-95a0aad4]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-95a0aad4]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-95a0aad4]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-95a0aad4]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-95a0aad4]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden}.us-name-text[data-v-95a0aad4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-95a0aad4]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-95a0aad4]{background:var(--md-success)}.us-dot.warn[data-v-95a0aad4]{background:#e0a800}.us-dot.bad[data-v-95a0aad4]{background:var(--md-error)}.us-ver[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-95a0aad4]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-95a0aad4]{font-weight:650}.us-ver b.good[data-v-95a0aad4]{color:var(--md-success)}.us-arrow[data-v-95a0aad4]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-95a0aad4]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden}.us-status-text[data-v-95a0aad4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-95a0aad4]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-95a0aad4]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-95a0aad4]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-95a0aad4]:hover{text-decoration:underline}.us-empty[data-v-95a0aad4]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-95a0aad4]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-95a0aad4]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.alert[data-v-95a0aad4]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-95a0aad4]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-95a0aad4]{display:none}.us-hero[data-v-95a0aad4]{flex-wrap:wrap}.us-hero-actions[data-v-95a0aad4]{width:100%}}.provider-panel[data-v-d93aed7e]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-d93aed7e]{display:flex;align-items:center;gap:14px}.pp-back[data-v-d93aed7e]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-d93aed7e]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-d93aed7e]{flex:1;min-width:0}.pp-editor-title h2[data-v-d93aed7e]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-d93aed7e]{margin:3px 0 0}.pp-section[data-v-d93aed7e]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-d93aed7e]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-d93aed7e]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-d93aed7e]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-d93aed7e]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-d93aed7e]{margin-bottom:0}.pp-span[data-v-d93aed7e]{grid-column:1 / -1}.pp-req[data-v-d93aed7e]{color:var(--md-error);margin-left:2px}.pp-key[data-v-d93aed7e]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-d93aed7e]{flex:1}.pp-key-toggle[data-v-d93aed7e]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-d93aed7e]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-d93aed7e]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-d93aed7e]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-d93aed7e]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-d93aed7e]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-d93aed7e]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-d93aed7e]{animation:pp-pulse-d93aed7e 1s ease-in-out infinite}@keyframes pp-pulse-d93aed7e{50%{opacity:.15}}.pp-probe[data-v-d93aed7e]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-d93aed7e]{color:var(--md-success)}.pp-probe.err[data-v-d93aed7e]{color:var(--md-error)}.pp-discovered[data-v-d93aed7e]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-d93aed7e]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-d93aed7e]{flex:1;min-width:160px}.pp-mini[data-v-d93aed7e]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-d93aed7e]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-add-model[data-v-d93aed7e]{display:flex;align-items:center;gap:8px;margin-top:8px}.pp-add-model .input[data-v-d93aed7e]{flex:1;min-width:0}.pp-add-model .btn[data-v-d93aed7e]{flex:none;white-space:nowrap}.pp-add-error[data-v-d93aed7e]{color:var(--md-error)}.pp-remove[data-v-d93aed7e]{flex:none;width:26px;height:26px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);font-size:17px;line-height:1;cursor:pointer}.pp-remove[data-v-d93aed7e]:hover{background:color-mix(in srgb,var(--md-error) 14%,transparent);color:var(--md-error)}.pp-models[data-v-d93aed7e]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-d93aed7e]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-d93aed7e]:first-child{border-top:0}.pp-model.off[data-v-d93aed7e]{opacity:.5}.pp-model-name[data-v-d93aed7e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-d93aed7e]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-d93aed7e]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-d93aed7e]{color:#e0a800;cursor:default}.pp-switch[data-v-d93aed7e]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-d93aed7e]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-d93aed7e]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-d93aed7e]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-d93aed7e]{display:flex;gap:10px}.pp-list-head[data-v-d93aed7e]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-d93aed7e]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-d93aed7e]{margin:3px 0 0}.pp-list-actions[data-v-d93aed7e]{display:flex;gap:8px}.pp-cards[data-v-d93aed7e]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-d93aed7e]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-d93aed7e]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-d93aed7e]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-d93aed7e]{opacity:.62}.pp-card-head[data-v-d93aed7e]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-d93aed7e]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-d93aed7e]{width:26px;height:26px}.pp-card-id[data-v-d93aed7e]{flex:1;min-width:0}.pp-card-id strong[data-v-d93aed7e]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-d93aed7e]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-d93aed7e]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-d93aed7e]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-d93aed7e]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-d93aed7e]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-d93aed7e]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-d93aed7e]{color:var(--md-error)}.pp-chips[data-v-d93aed7e]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-d93aed7e]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-d93aed7e],.pp-chip.empty[data-v-d93aed7e]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-d93aed7e]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.pp-empty[data-v-d93aed7e]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-d93aed7e],.pp-cards[data-v-d93aed7e]{grid-template-columns:1fr}}.pairing-panel[data-v-c18959f6]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-c18959f6]{margin:12px 0;color:var(--md-on-surface-variant)}.pairing-panel .pairing-error[data-v-c18959f6]{color:var(--md-error)}article[data-v-c18959f6]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-c18959f6]{font-size:24px;letter-spacing:4px}h4[data-v-c18959f6]{margin:18px 0 0}.pairing-list[data-v-c18959f6]{position:relative}.pair-enter-active[data-v-c18959f6],.pair-leave-active[data-v-c18959f6]{transition:opacity var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out)}.pair-enter-from[data-v-c18959f6],.pair-leave-to[data-v-c18959f6]{opacity:0;transform:translateY(4px)}.pair-leave-active[data-v-c18959f6]{position:absolute;width:100%}.pair-move[data-v-c18959f6]{transition:transform var(--duration-medium) var(--ease-out)}@media(prefers-reduced-motion:reduce){.pair-enter-active[data-v-c18959f6],.pair-leave-active[data-v-c18959f6],.pair-move[data-v-c18959f6]{transition-duration:1ms}}.connection-grid[data-v-b6056614]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,264px);gap:24px;align-items:start}@media(max-width:1000px){.connection-grid[data-v-b6056614]{grid-template-columns:minmax(0,1fr)}}.connection-form .field[data-v-b6056614]{margin-bottom:12px}.connection-qr[data-v-b6056614]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-b6056614]{background:#fff;border-radius:8px;padding:6px;width:100%;max-width:264px;height:auto}.connection-link[data-v-b6056614]{max-width:100%;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.helper-text[data-v-b6056614]{overflow-wrap:anywhere}.toggle-label[data-v-b6056614]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-fb8c17b3]{max-width:920px}.sec-stack[data-v-fb8c17b3]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-fb8c17b3]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-fb8c17b3]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-fb8c17b3]{font-size:15px;font-weight:700}.sec-chip[data-v-fb8c17b3]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-fb8c17b3]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-fb8c17b3]{margin:2px 0 12px}.sec-pin-grid[data-v-fb8c17b3]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-fb8c17b3]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-fb8c17b3]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-fb8c17b3]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-fb8c17b3]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-fb8c17b3]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-fb8c17b3]:hover{background:var(--md-surface-container)}.page-item[data-v-fb8c17b3]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-fb8c17b3]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-fb8c17b3]{width:44px;height:26px}.page-item .toggle-slider[data-v-fb8c17b3]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-fb8c17b3]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-fb8c17b3]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-fb8c17b3]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-fb8c17b3]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-fb8c17b3]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-fb8c17b3]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-fb8c17b3]{margin-top:12px}.sec-error[data-v-fb8c17b3]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-fb8c17b3]{grid-template-columns:1fr}}.mcp-panel[data-v-01485e38]{max-width:900px}.mcp-head[data-v-01485e38]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-01485e38]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-01485e38]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-01485e38]{display:flex;gap:10px}.error-banner[data-v-01485e38]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-01485e38]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-01485e38]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-01485e38]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-01485e38]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-01485e38]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-01485e38]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-01485e38]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-01485e38]{flex:1}.mcp-field>span[data-v-01485e38]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-01485e38],.mcp-field select[data-v-01485e38],.mcp-field textarea[data-v-01485e38]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-01485e38]{opacity:.7}.mcp-field textarea[data-v-01485e38]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-01485e38]:focus,.mcp-field select[data-v-01485e38]:focus,.mcp-field textarea[data-v-01485e38]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-01485e38]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-01485e38]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-01485e38]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-01485e38]{font-family:ui-monospace,monospace}.mail-grid[data-v-01485e38]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-01485e38]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-01485e38]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-01485e38]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-01485e38]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-01485e38]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-01485e38]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-01485e38]:disabled{opacity:.6;cursor:not-allowed}#app .mcp-panel[data-v-01485e38] :is(.btn,.mcp-remove){border-radius:999px}#app .mcp-panel .mcp-field[data-v-01485e38] :is(input,select,textarea){border-radius:12px}@media(max-width:720px){.mail-grid[data-v-01485e38]{grid-template-columns:1fr}}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.models-field[data-v-7089f4a3]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-7089f4a3]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-7089f4a3]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-7089f4a3]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-7089f4a3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-7089f4a3]{display:inline-flex;gap:4px}.models-actions button[data-v-7089f4a3]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-7089f4a3]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-7089f4a3]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-7089f4a3]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.pp-head[data-v-9d796590]{display:flex;align-items:center;justify-content:space-between;gap:8px}.pp-head h2[data-v-9d796590]{margin:0;font-size:18px}.pp-icon[data-v-9d796590]{width:32px;height:32px;border-radius:50%;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);font-size:15px;cursor:pointer}.pp-icon[data-v-9d796590]:disabled{opacity:.45;cursor:not-allowed}.pp-roots[data-v-9d796590]{display:flex;flex-wrap:wrap;gap:6px}.pp-root[data-v-9d796590]{padding:4px 10px;border-radius:999px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface-variant);font-size:12px;font-family:monospace;cursor:pointer}.pp-root.is-active[data-v-9d796590]{border-color:var(--md-primary);color:var(--md-primary)}.pp-path[data-v-9d796590]{font-family:monospace;font-size:13px}.pp-list[data-v-9d796590]{display:flex;flex-direction:column;gap:2px;min-height:180px;max-height:42vh;overflow:auto;padding:6px;border-radius:14px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest, var(--md-surface))}.pp-item[data-v-9d796590]{display:flex;align-items:center;gap:8px;padding:7px 10px;border:0;border-radius:10px;background:none;color:var(--md-on-surface);font-size:13px;text-align:left;cursor:pointer}.pp-item[data-v-9d796590]:hover,.pp-item[data-v-9d796590]:focus-visible{background:var(--md-surface-container-high);outline:none}.pp-folder[data-v-9d796590]{color:var(--md-primary);font-size:13px;line-height:1;opacity:.85}.pp-name[data-v-9d796590]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-empty[data-v-9d796590]{margin:0;padding:24px 8px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.pp-error[data-v-9d796590]{color:var(--md-error, #b3261e)}.pp-current[data-v-9d796590]{margin:0;font-family:monospace;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-foot[data-v-9d796590]{display:flex;align-items:center;gap:8px}.pp-spacer[data-v-9d796590]{flex:1}\n";document.head.appendChild(s)}})();
