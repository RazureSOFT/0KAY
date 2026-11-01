var es = Object.defineProperty;
var ts = (g, s, h) => s in g ? es(g, s, { enumerable: !0, configurable: !0, writable: !0, value: h }) : g[s] = h;
var ee = (g, s, h) => ts(g, typeof s != "symbol" ? s + "" : s, h);
import { defineComponent as be, ref as x, computed as Q, onMounted as Ne, onUnmounted as at, watch as We, openBlock as r, createElementBlock as u, normalizeClass as oe, createElementVNode as e, unref as t, normalizeStyle as It, toDisplayString as n, createCommentVNode as N, withModifiers as Fe, nextTick as ss, createVNode as we, Fragment as Z, renderList as de, createTextVNode as Te, reactive as ns, withDirectives as O, vModelCheckbox as Ce, vModelText as J, withKeys as gt, createStaticVNode as ls, vModelDynamic as os, TransitionGroup as Vt, withCtx as nt, createBlock as ke, vModelSelect as as, shallowRef as Nt, resolveDynamicComponent as is, Transition as rs, isRef as ds } from "vue";
import { useI18n as _e } from "vue-i18n";
import { useLifeStore as cs, useWizardStore as it, live2dRuntimeReady as us, DEFAULT_LIVE2D_MODELS as ps, apiGet as Ke, apiPost as lt, ApiError as Ft, useConfirm as et, useProvidersStore as hs, PROVIDERS as ht, AppSelect as Ye, getLanguage as vs, LOCALES as ms, setLanguage as fs, MarkdownContent as gs, useSettingsMeta as bt, useUIPatchesStore as Kt, PinInput as Rt, ModalShell as bs, useSettingsSectionsStore as _s, NavIcon as ys } from "@0kay/host";
import { useRouter as Ht, useRoute as ks } from "vue-router";
const ws = ["title"], $s = {
  key: 0,
  class: "stage-placeholder"
}, Ss = {
  key: 1,
  class: "stage-status"
}, Cs = {
  key: 2,
  class: "stage-status warn"
}, Ps = ["title", "aria-label"], xs = { class: "stage-hint" }, Lt = "0kay.web.live2d.resetbtn", Ms = "0kay.web.live2d.transform.", Es = /* @__PURE__ */ be({
  __name: "Live2DStage",
  props: {
    bare: { type: Boolean, default: !1 }
  },
  setup(g) {
    const { t: s } = _e(), h = cs(), d = it(), b = x(null), $ = x(null), p = x(""), _ = x("idle"), C = x(""), i = g, o = Q(() => i.bare), l = Q(() => d.live2d.enabled), a = Q(() => d.live2d.modelUrl.trim()), c = Q(() => h.emotionMood), v = Q(() => {
      const m = String(c.value || "");
      if (!m) return "";
      const k = `emotion.${m}`, I = s(k);
      return I === k ? m : I;
    }), w = Q(() => h.emotionColor), f = x([]);
    async function U() {
      try {
        const m = await fetch("/api/live2d");
        if (m.ok) {
          const k = await m.json();
          f.value = k.models || [];
        }
      } catch {
        f.value = [];
      }
    }
    const E = x(null), H = x(G()), R = x(!1);
    let V = !1, M = { x: 0, y: 0 }, T = { x: 0, y: 0 };
    function G() {
      try {
        const m = localStorage.getItem(Lt);
        if (m) {
          const k = JSON.parse(m);
          if (typeof k?.x == "number" && typeof k?.y == "number") return k;
        }
      } catch {
      }
      return null;
    }
    const me = Q(() => H.value ? { left: `${H.value.x}px`, top: `${H.value.y}px`, right: "auto", bottom: "auto" } : {});
    function se(m) {
      R.value = !0, V = !1, M = { x: m.clientX, y: m.clientY };
      const k = E.value?.getBoundingClientRect();
      T = { x: k?.left ?? 0, y: k?.top ?? 0 };
      try {
        E.value?.setPointerCapture(m.pointerId);
      } catch {
      }
    }
    function z(m) {
      if (!R.value || !b.value) return;
      const k = m.clientX - M.x, I = m.clientY - M.y;
      (Math.abs(k) > 3 || Math.abs(I) > 3) && (V = !0);
      const F = b.value.getBoundingClientRect(), le = E.value?.offsetWidth || 34, pe = Oe(T.x - F.left + k, 4, Math.max(4, F.width - le - 4)), re = Oe(T.y - F.top + I, 4, Math.max(4, F.height - le - 4));
      H.value = { x: Math.round(pe), y: Math.round(re) };
    }
    function Y(m) {
      if (R.value) {
        R.value = !1;
        try {
          E.value?.releasePointerCapture(m.pointerId);
        } catch {
        }
        if (V)
          try {
            localStorage.setItem(Lt, JSON.stringify(H.value));
          } catch {
          }
      }
    }
    function K() {
      if (V) {
        V = !1;
        return;
      }
      qt();
    }
    let j = null, B = null, Ie = null, Pe = 0, ce = 0, Ve = { x: 0, y: 0, has: !1 }, ne = !1, he = null, Re = { x: 0, y: 0 }, $e = null, ve = null, xe = null, Se = null, ae = null, fe = "off", q = 0, L = 0, ie = 0, Le = 120, Je = ["ParamMouthOpenY"];
    function Me(m) {
      const k = B?.internalModel?.coreModel;
      if (!k) return;
      const I = Oe(m, 0, 1);
      for (const F of Je)
        try {
          typeof k.setParameterValueById == "function" ? k.setParameterValueById(F, I) : typeof k.setParamFloat == "function" && k.setParamFloat(F, I);
        } catch {
        }
    }
    function Ge(m) {
      const k = [];
      try {
        const I = m?.internalModel?.settings;
        let F = I?.getLipSyncParameters?.();
        if (!Array.isArray(F) && Array.isArray(I?.groups) && (F = I.groups.find((pe) => (pe?.Name || pe?.name || "").toLowerCase() === "lipsync")?.Ids), Array.isArray(F))
          for (const le of F) typeof le == "string" && le && k.push(le);
      } catch {
      }
      Je = k.length ? k : ["ParamMouthOpenY"];
    }
    function De() {
      if (fe === "off") {
        q !== 0 && (q = 0, Me(0));
        return;
      }
      if (fe === "audio" && Se && ae) {
        Se.getByteTimeDomainData(ae);
        let m = 0;
        for (let F = 0; F < ae.length; F++) {
          const le = (ae[F] - 128) / 128;
          m += le * le;
        }
        const k = Math.sqrt(m / ae.length), I = Oe(k * 3.4, 0, 1);
        q = q * 0.35 + I * 0.65, Me(q);
        return;
      }
      if (fe === "text") {
        const m = performance.now() - L;
        if (m > ie * Le + 260) {
          fe = "off", q = 0, Me(0);
          return;
        }
        const k = m % Le / Le, I = k < 0.5 ? 0.12 + 0.72 * Math.sin(k / 0.5 * Math.PI) : 0.06;
        q = q * 0.45 + I * 0.55, Me(q);
      }
    }
    async function y(m, k = "") {
      if (!m) {
        P(k);
        return;
      }
      if (B)
        try {
          if ($e || ($e = new Audio(), $e.crossOrigin = "anonymous", $e.addEventListener("ended", () => {
            fe = "off", q = 0, Me(0);
          })), ve && ve !== m)
            try {
              URL.revokeObjectURL(ve);
            } catch {
            }
          if (ve = m, $e.src = m, !xe) {
            const I = window.AudioContext || window.webkitAudioContext;
            I && (xe = new I(), Se = xe.createAnalyser(), Se.fftSize = 1024, ae = new Uint8Array(Se.fftSize), xe.createMediaElementSource($e).connect(Se), Se.connect(xe.destination));
          }
          await xe?.resume().catch(() => {
          }), fe = "audio", await $e.play().catch(() => {
            k ? P(k) : (fe = "off", Me(0));
          });
        } catch {
          k ? P(k) : fe = "off";
        }
    }
    function P(m) {
      const k = Array.from(String(m || "")).filter((I) => /\S/.test(I));
      k.length && (Le = /[\u4e00-\u9fff]/.test(k.join("")) ? 140 : 80, ie = k.length, L = performance.now(), fe = "text");
    }
    function S() {
      fe = "off", q = 0, Me(0);
      try {
        $e?.pause();
      } catch {
      }
    }
    function te(m) {
      const k = m.detail || {};
      k.url ? y(k.url, k.text || "") : k.text && P(k.text);
    }
    let A = {}, D = [], X = 0;
    function W(m) {
      A = {}, D = [];
      try {
        const k = m?.internalModel?.motionManager, I = m?.internalModel?.settings, F = k?.definitions || I?.motions || {};
        for (const [pe, re] of Object.entries(F)) A[pe] = Array.isArray(re) ? re.length : 0;
        D = (k?.expressionManager?.definitions || I?.expressions || []).map((pe) => pe?.Name || pe?.name).filter((pe) => !!pe);
      } catch {
      }
      try {
        console.info("[live2d] motions", A, "expressions", D);
      } catch {
      }
      try {
        window.__0KAY_LIVE2D_CAPS__ = { motions: A, expressions: D };
      } catch {
      }
    }
    function ye(m, k) {
      if (!B) return;
      const I = Object.keys(A).filter((re) => A[re] > 0);
      if (!I.length) return;
      const F = I.find((re) => /idle/i.test(re)), le = m && A[m] > 0, pe = le ? m : k == null && F ? F : I.find((re) => re !== F) || I[0];
      try {
        const re = B.internalModel?.motionManager;
        if (typeof B.motion == "function" && le) {
          B.motion(pe, k);
          return;
        }
        if (k == null) {
          re?.startRandomMotion?.(pe);
          return;
        }
        re?.startMotion?.(pe, k);
      } catch {
      }
    }
    function ge(m) {
      if (!B || !m) return;
      const k = /^\d+$/.test(m) ? Number(m) : D.indexOf(m), I = k >= 0 ? k : m;
      try {
        const F = B.internalModel?.motionManager?.expressionManager;
        if (F?.setExpression) {
          F.setExpression(I);
          return;
        }
        B.expression?.(I);
      } catch {
      }
    }
    function ue() {
      ze(), !(typeof window > "u") && (X = window.setInterval(() => {
        if (fe !== "off" || document.hidden) return;
        const m = Object.keys(A).filter((k) => A[k] > 0 && !/idle/i.test(k));
        m.length && Math.random() < 0.6 && ye(m[Math.floor(Math.random() * m.length)]), D.length && Math.random() < 0.5 && ge(D[Math.floor(Math.random() * D.length)]);
      }, 9e3));
    }
    function ze() {
      X && (clearInterval(X), X = 0);
    }
    function yt(m) {
      const k = m.detail || {};
      k.expression && ge(k.expression), (k.group || k.index != null) && ye(k.group, k.index);
    }
    function Yt() {
      return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore);
    }
    function Oe(m, k, I) {
      return Math.min(I, Math.max(k, m));
    }
    function dt() {
      return Ms + (a.value || "default");
    }
    function kt() {
      try {
        const m = localStorage.getItem(dt());
        if (!m) return null;
        const k = JSON.parse(m);
        if (typeof k?.x == "number" && typeof k?.y == "number" && typeof k?.scale == "number") return k;
      } catch {
      }
      return null;
    }
    function ct(m = !1) {
      if (!B) return;
      const k = () => {
        try {
          localStorage.setItem(dt(), JSON.stringify({
            x: Math.round(B.x * 100) / 100,
            y: Math.round(B.y * 100) / 100,
            scale: Math.round(B.scale.x * 1e4) / 1e4
          }));
        } catch {
        }
      };
      if (m) {
        ce && (clearTimeout(ce), ce = 0), k();
        return;
      }
      ce && clearTimeout(ce), ce = window.setTimeout(() => {
        ce = 0, k();
      }, 140);
    }
    function wt() {
      if (ze(), fe = "off", q = 0, je(), ce && (clearTimeout(ce), ce = 0), B) {
        try {
          j?.stage && j.stage.removeChild(B), B.destroy?.();
        } catch {
        }
        B = null;
      }
    }
    function $t() {
      if (Tt(), wt(), Ie && (Ie.disconnect(), Ie = null), ce && (clearTimeout(ce), ce = 0), j) {
        try {
          j.destroy(!1, { children: !0, texture: !1, baseTexture: !1 });
        } catch {
        }
        j = null;
      }
    }
    function St(m) {
      if (typeof m.getLocalBounds == "function") {
        const F = m.getLocalBounds();
        if (F && F.width > 0 && F.height > 0) return { width: F.width, height: F.height };
      }
      const k = Math.max(Math.abs(m.scale.x) || 0, 1e-4), I = Math.max(Math.abs(m.scale.y) || 0, 1e-4);
      return { width: Math.max(m.width / k, 1), height: Math.max(m.height / I, 1) };
    }
    function ut(m = B) {
      if (!m || !j) return !1;
      const k = j.screen.width, I = j.screen.height;
      if (!k || !I) return !1;
      const F = St(m);
      if (F.width > 0 && F.height > 0) {
        const le = Math.min(k / F.width, I / F.height) * 0.88;
        m.anchor?.set?.(0.5, 0.5), m.scale.set(le, le);
      }
      m.position.set(k * 0.5, I * 0.55);
      try {
        const le = m.getBounds?.();
        if (le && le.width > 0 && le.height > 0) {
          m.x += k * 0.5 - (le.x + le.width * 0.5), m.y += I * 0.55 - (le.y + le.height * 0.55);
          const pe = m.getBounds?.();
          if (pe && pe.width > 0 && pe.height > 0) {
            const re = Math.min(k / pe.width, I / pe.height) * 0.88, Ue = Math.abs(m.scale.x) || 1;
            if (Number.isFinite(re) && re > 0 && Math.abs(re - Ue) / Ue > 0.08) {
              const Be = Ue * re;
              m.scale.set(Be, Be);
              const Ee = m.getBounds?.();
              Ee && Ee.width > 0 && (m.x += k * 0.5 - (Ee.x + Ee.width * 0.5), m.y += I * 0.55 - (Ee.y + Ee.height * 0.55));
            }
          }
        }
      } catch {
      }
      return !0;
    }
    function Xt() {
      if (!B) return { hw: 0, hh: 0 };
      const m = St(B), k = Math.abs(B.scale.x) || 1, I = Math.abs(B.scale.y) || 1;
      return { hw: m.width * k / 2, hh: m.height * I / 2 };
    }
    function tt() {
      if (!B || !j) return;
      const m = j.screen.width, k = j.screen.height, { hw: I, hh: F } = Xt(), le = Math.min(I * 0.7, m * 0.5), pe = Math.min(F * 0.7, k * 0.5), re = le - I, Ue = m - le + I, Be = pe - F, Ee = k - pe + F, Ze = re <= Ue ? Oe(B.x, re, Ue) : m * 0.5, At = Be <= Ee ? Oe(B.y, Be, Ee) : k * 0.55;
      B.position.set(Ze, At);
    }
    function Jt() {
      if (!B || !j) return;
      const m = kt();
      if (m && Number.isFinite(m.scale) && m.scale > 0) {
        B.anchor?.set?.(0.5, 0.5), B.scale.set(m.scale, m.scale), B.position.set(m.x, m.y), tt();
        return;
      }
      ut();
    }
    function Wt(m, k) {
      if (!B || !window.PIXI || typeof window.PIXI.Point != "function" || typeof B.toModelPosition != "function") return null;
      try {
        const I = new window.PIXI.Point(m, k);
        return B.toModelPosition(I, new window.PIXI.Point());
      } catch {
        return null;
      }
    }
    function Ct(m, k, I) {
      const F = I - k;
      return !Number.isFinite(F) || Math.abs(F) <= 1e-4 ? 0 : Oe((m - k) / F * 2 - 1, -1, 1);
    }
    function Pt(m, k) {
      const I = B?.internalModel, F = I?.focusController;
      if (!F || typeof F.focus != "function" || !j) return;
      const le = j.screen.width || 1, pe = j.screen.height || 1;
      let re = m / le * 2 - 1, Ue = k / pe * 2 - 1;
      const Be = Wt(m, k);
      if (Be && I.originalWidth && I.originalHeight) {
        const Ee = Ct(Be.x, 0, I.originalWidth), Ze = Ct(Be.y, 0, I.originalHeight);
        Ee >= -1 && Ee <= 1 && Ze >= -1 && Ze <= 1 && (re = re * 0.35 + Ee * 0.65, Ue = Ue * 0.35 + Ze * 0.65);
      }
      re = Oe(re, -1, 1), Ue = Oe(Ue, -1, 1), F.focus(re, -Ue);
    }
    function st() {
      Ve.has && Pt(Ve.x, Ve.y);
    }
    function xt(m) {
      if (!B || !j || !b.value) return;
      const k = b.value.getBoundingClientRect();
      if (!k.width || !k.height) return;
      const I = (m.clientX - k.left) / k.width * j.screen.width, F = (m.clientY - k.top) / k.height * j.screen.height;
      Ve = { x: I, y: F, has: !0 }, ne && m.pointerId === he && (B.position.set(I + Re.x, F + Re.y), tt(), ct()), Pt(I, F);
    }
    function Mt(m) {
      if (!B || !j || !b.value || m.button !== 0 && m.pointerType === "mouse" || m.target?.closest?.(".stage-reset")) return;
      const k = b.value.getBoundingClientRect();
      if (!k.width || !k.height) return;
      const I = (m.clientX - k.left) / k.width * j.screen.width, F = (m.clientY - k.top) / k.height * j.screen.height;
      ne = !0, he = m.pointerId, Re = { x: B.x - I, y: B.y - F };
      try {
        b.value.setPointerCapture(m.pointerId);
      } catch {
      }
      b.value && (b.value.style.cursor = "grabbing");
    }
    function je(m) {
      if (ne && !(m && he !== null && m.pointerId !== he)) {
        if (ne = !1, b.value) {
          try {
            he !== null && b.value.releasePointerCapture(he);
          } catch {
          }
          b.value.style.cursor = "grab";
        }
        he = null, ct(!0);
      }
    }
    function Et(m) {
      if (!B || _.value !== "ok" || m.shiftKey) return;
      m.preventDefault();
      const k = m.deltaY < 0 ? 1.06 : 0.94, I = Oe(B.scale.x * k, 0.08, 3.2);
      B.scale.set(I, I), tt(), st(), ct();
    }
    function qt() {
      if (!(!B || !j)) {
        try {
          localStorage.removeItem(dt());
        } catch {
        }
        ce && (clearTimeout(ce), ce = 0);
        try {
          j.resize?.();
        } catch {
        }
        j?.stage && (j.stage.hitArea = j.screen), ut(), st();
      }
    }
    function Ut() {
      Tt();
      const m = b.value;
      m && (m.style.cursor = "grab", m.addEventListener("pointermove", xt), m.addEventListener("pointerdown", Mt), m.addEventListener("pointerup", je), m.addEventListener("pointercancel", je), m.addEventListener("pointerleave", je), m.addEventListener("wheel", Et, { passive: !1 }));
    }
    function Tt() {
      const m = b.value;
      m && (m.removeEventListener("pointermove", xt), m.removeEventListener("pointerdown", Mt), m.removeEventListener("pointerup", je), m.removeEventListener("pointercancel", je), m.removeEventListener("pointerleave", je), m.removeEventListener("wheel", Et), ne = !1, he = null);
    }
    function Gt() {
      if (j || !$.value || !b.value) return;
      const m = window.PIXI;
      j = new m.Application({
        view: $.value,
        resizeTo: b.value,
        autoStart: !0,
        antialias: !0,
        backgroundAlpha: 0,
        powerPreference: "high-performance"
      }), j.stage && (j.stage.interactive = !0, j.stage.hitArea = j.screen), Ie = new ResizeObserver(() => {
        try {
          j?.resize?.();
        } catch {
        }
        if (j?.stage && (j.stage.hitArea = j.screen), B) {
          const k = kt();
          k && Number.isFinite(k.scale) && k.scale > 0 ? (B.position.set(k.x, k.y), B.scale.set(k.scale, k.scale), tt()) : ut();
        }
        st();
      }), Ie.observe(b.value), Ut();
    }
    async function pt() {
      try {
        await us;
      } catch (I) {
        _.value = "error", C.value = `Live2D runtime: ${I.message}`;
        return;
      }
      const m = ++Pe;
      if (wt(), !l.value) {
        _.value = "disabled", p.value = "";
        return;
      }
      if (!Yt()) {
        _.value = "no-libs", C.value = s("live2d.libsMissing");
        return;
      }
      const k = a.value || f.value[0]?.url;
      if (!k) {
        _.value = "error", C.value = s("live2d.noModel");
        return;
      }
      if (_.value = "loading", C.value = "", p.value = k.split("/").pop() || k, await ss(), j || Gt(), !j) {
        _.value = "error", C.value = s("live2d.stageMissing");
        return;
      }
      try {
        const I = await window.PIXI.live2d.Live2DModel.from(k, { autoInteract: !1 });
        if (m !== Pe) {
          try {
            I.destroy?.();
          } catch {
          }
          return;
        }
        B = I, Ut(), I.anchor?.set?.(0.5, 0.5), j.stage.addChild(I), Jt();
        try {
          I.internalModel?.on?.("beforeModelUpdate", De);
        } catch {
        }
        Ge(I), W(I), _.value = "ok", st(), ye("Idle"), ue();
      } catch (I) {
        if (m !== Pe) return;
        console.error("Live2D load failed:", I), _.value = "error", C.value = I?.message || s("live2d.loadError");
      }
    }
    function Zt() {
      if (!l.value) {
        $t(), _.value = "disabled";
        return;
      }
      pt();
    }
    Ne(async () => {
      window.addEventListener("live2d-models-changed", U), window.addEventListener("live2d-speak", te), window.addEventListener("live2d-motion", yt), window.__0KAY_LIVE2D__ = { speak: y, stop: S, motion: ye, expression: ge };
      try {
        const m = await fetch("/api/settings/live2d");
        if (m.ok) {
          const { values: k } = await m.json();
          k && typeof k.enabled == "boolean" && (d.live2d.enabled = k.enabled), k && typeof k.model_url == "string" && (d.live2d.modelUrl = k.model_url);
        }
      } catch {
      }
      await U(), l.value ? pt() : _.value = "disabled";
    }), at(() => {
      if (window.removeEventListener("live2d-models-changed", U), window.removeEventListener("live2d-speak", te), window.removeEventListener("live2d-motion", yt), ze(), S(), ve) {
        try {
          URL.revokeObjectURL(ve);
        } catch {
        }
        ve = null;
      }
      try {
        xe?.close();
      } catch {
      }
      xe = null, Pe++, $t();
    }), We(l, Zt), We(a, () => {
      l.value && pt();
    });
    const Qt = { happy: 2, sad: 4, irritated: 6, neutral: 0, drowsy: 0, exhausted: 0, sleeping: 0 };
    return We(c, (m) => {
      if (!B || fe !== "off" || !D.length) return;
      const k = Qt[m] ?? 0;
      ge(D[k] || D[0]), (m === "happy" || m === "irritated") && Math.random() < 0.5 && ye();
    }), (m, k) => (r(), u("div", {
      class: oe(["live2d-stage", { on: l.value, bare: o.value }])
    }, [
      e("div", {
        ref_key: "stageEl",
        ref: b,
        class: "stage-viewport",
        style: It({ "--mood": w.value }),
        title: l.value && _.value === "ok" ? t(s)("live2d.interactHint") : ""
      }, [
        e("canvas", {
          ref_key: "canvasEl",
          ref: $,
          class: "stage-canvas"
        }, null, 512),
        l.value ? _.value === "loading" ? (r(), u("div", Ss, n(t(s)("live2d.loading")), 1)) : _.value === "error" || _.value === "no-libs" ? (r(), u("div", Cs, n(C.value || t(s)("live2d.loadError")), 1)) : N("", !0) : (r(), u("div", $s, [
          e("p", null, n(t(s)("live2d.disabledHint")), 1)
        ])),
        l.value && _.value === "ok" ? (r(), u("button", {
          key: 3,
          ref_key: "resetBtnEl",
          ref: E,
          class: oe(["stage-reset", { dragging: R.value }]),
          type: "button",
          style: It(me.value),
          title: t(s)("live2d.resetView"),
          "aria-label": t(s)("live2d.resetView"),
          onPointerdown: Fe(se, ["stop"]),
          onPointermove: Fe(z, ["stop"]),
          onPointerup: Fe(Y, ["stop"]),
          onPointercancel: Fe(Y, ["stop"]),
          onClick: Fe(K, ["stop"])
        }, "⟲", 46, Ps)) : N("", !0),
        k[0] || (k[0] = e("div", { class: "stage-gradient" }, null, -1)),
        e("div", xs, n(v.value), 1)
      ], 12, ws)
    ], 2));
  }
}), Ae = (g, s) => {
  const h = g.__vccOpts || g;
  for (const [d, b] of s)
    h[d] = b;
  return h;
}, Us = /* @__PURE__ */ Ae(Es, [["__scopeId", "data-v-600df96a"]]), Ts = { class: "content-card" }, As = { class: "toggle-label" }, Is = ["checked"], Vs = { class: "field" }, Ns = { class: "model-choices" }, Rs = ["value", "checked", "onChange"], Ls = ["value", "placeholder"], Os = { class: "helper-text" }, Ds = {
  href: "https://www.live2d.com/en/learn/sample/",
  target: "_blank",
  rel: "noopener"
}, zs = { class: "helper-text" }, Bs = ["disabled"], Fs = { class: "field" }, Ks = ["disabled"], Hs = {
  key: 0,
  class: "helper-text",
  role: "status"
}, js = {
  key: 1,
  class: "model-choices",
  style: { "margin-top": "12px" }
}, Ys = ["value", "checked", "onChange"], Xs = ["onClick"], Js = /* @__PURE__ */ be({
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
    const h = s, { t: d } = _e(), b = x(null);
    function $() {
      b.value?.click();
    }
    function p(C) {
      h("update:modelUrl", C), h("update:enabled", !0);
    }
    function _(C) {
      const i = C.target, o = i.files;
      !o || !o.length || (h("upload", o), i.value = "");
    }
    return (C, i) => (r(), u("div", Ts, [
      e("h2", null, n(t(d)("settings.live2d")), 1),
      we(Us, { class: "live2d-preview" }),
      e("label", As, [
        e("input", {
          type: "checkbox",
          checked: g.enabled,
          onChange: i[0] || (i[0] = (o) => h("update:enabled", o.target.checked))
        }, null, 40, Is),
        i[3] || (i[3] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, n(t(d)("wizard.enableLive2d")), 1)
      ]),
      e("div", Vs, [
        e("label", null, n(t(d)("wizard.modelUrl")), 1),
        e("div", Ns, [
          (r(!0), u(Z, null, de(t(ps), (o) => (r(), u("label", {
            key: o.id,
            class: oe(["model-choice", { selected: g.modelUrl === o.url }])
          }, [
            e("input", {
              type: "radio",
              name: "live2d-model",
              value: o.url,
              checked: g.modelUrl === o.url,
              onChange: (l) => p(o.url)
            }, null, 40, Rs),
            e("span", null, n(o.label), 1),
            e("code", null, n(o.url), 1)
          ], 2))), 128))
        ]),
        e("input", {
          value: g.modelUrl,
          placeholder: t(d)("wizard.modelUrlPlaceholder"),
          class: "input",
          onInput: i[1] || (i[1] = (o) => h("update:modelUrl", o.target.value))
        }, null, 40, Ls),
        e("p", Os, [
          Te(n(t(d)("wizard.live2dHelp")) + " ", 1),
          e("a", Ds, n(t(d)("wizard.live2dSamples")), 1)
        ])
      ]),
      e("p", zs, n(t(d)("settings.live2dHelper")), 1),
      e("button", {
        class: "btn btn-tonal",
        disabled: g.saving,
        onClick: i[2] || (i[2] = (o) => h("save"))
      }, n(g.saving ? t(d)("settings.saving") : t(d)("settings.saveLife2d")), 9, Bs),
      e("div", Fs, [
        e("label", null, n(t(d)("settings.uploadFolder")), 1),
        e("button", {
          type: "button",
          class: "upload-area",
          disabled: g.saving,
          onClick: $
        }, [
          e("span", null, n(t(d)("settings.uploadFolderHint")), 1)
        ], 8, Ks),
        e("input", {
          ref_key: "fileInput",
          ref: b,
          type: "file",
          webkitdirectory: "",
          directory: "",
          multiple: "",
          class: "file-input",
          onChange: _
        }, null, 544),
        g.msg ? (r(), u("p", Hs, n(g.msg), 1)) : N("", !0),
        g.uploaded && g.uploaded.length ? (r(), u("div", js, [
          (r(!0), u(Z, null, de(g.uploaded, (o) => (r(), u("label", {
            key: o.id,
            class: oe(["model-choice", { selected: g.modelUrl === o.url }])
          }, [
            e("input", {
              type: "radio",
              name: "live2d-uploaded",
              value: o.url,
              checked: g.modelUrl === o.url,
              onChange: (l) => p(o.url)
            }, null, 40, Ys),
            e("span", null, n(o.label), 1),
            e("code", null, n(o.url), 1),
            e("button", {
              type: "button",
              class: "btn btn-danger",
              onClick: Fe((l) => h("delete", o), ["prevent"])
            }, n(t(d)("settings.deleteModel")), 9, Xs)
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
}, kn = { class: "ls-card" }, wn = { class: "ls-card-head" }, $n = { class: "ls-note" }, Sn = { class: "ls-switch" }, Cn = { class: "ls-switch-text" }, Pn = { class: "ls-switch" }, xn = { class: "ls-switch-text" }, Mn = { class: "ls-card" }, En = { class: "ls-switch" }, Un = { class: "ls-switch-text" }, Tn = { class: "ls-card ls-card-wide" }, An = { class: "ls-card-head" }, In = { class: "ls-row" }, Vn = { class: "ls-switch" }, Nn = { class: "ls-switch-text" }, Rn = { class: "ls-switch" }, Ln = { class: "ls-switch-text" }, On = { class: "ls-row" }, Dn = { class: "ls-field" }, zn = { class: "ls-field" }, Bn = { class: "ls-row" }, Fn = { class: "ls-field" }, Kn = { class: "ls-field" }, Hn = ["placeholder"], jn = { class: "ls-row" }, Yn = { class: "ls-field" }, Xn = { class: "ls-field" }, Jn = { class: "ls-card ls-card-wide" }, Wn = { class: "ls-card-head" }, qn = { class: "ls-row" }, Gn = { class: "ls-switch" }, Zn = { class: "ls-switch-text" }, Qn = { class: "ls-row" }, el = { class: "ls-field" }, tl = ["placeholder"], sl = { class: "ls-field" }, nl = ["title"], ll = { class: "ls-hint" }, ol = { class: "ls-card ls-card-wide" }, al = { class: "ls-card-head" }, il = { class: "ls-row" }, rl = { class: "ls-switch" }, dl = { class: "ls-switch-text" }, cl = { class: "ls-switch" }, ul = { class: "ls-switch-text" }, pl = { class: "ls-switch" }, hl = { class: "ls-switch-text" }, vl = { class: "ls-hint" }, ml = {
  key: 0,
  class: "ls-state"
}, fl = /* @__PURE__ */ be({
  __name: "LifeSettingsPanel",
  setup(g) {
    const { t: s } = _e(), h = ns({
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
    }), d = x(""), b = x(!1), $ = x(!1), p = x([]), _ = x(""), C = x([]);
    async function i() {
      try {
        const [l, a] = await Promise.all([fetch("/api/settings/life"), fetch("/api/models")]);
        if (l.ok && (Object.assign(h, (await l.json()).values || {}), $.value = !0), a.ok) {
          const c = await a.json();
          C.value = Array.isArray(c.models) ? c.models.map((v) => ({ id: v.id, provider: v.provider || "custom", supports_thinking: v.supports_thinking })).filter((v) => v.id) : [], p.value = C.value.map((v) => v.id), _.value = s("lifeSettings.sourceFromCore");
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
    return Ne(i), (l, a) => (r(), u("section", Ws, [
      e("header", qs, [
        e("div", Gs, [
          a[20] || (a[20] = e("span", { class: "ls-eyebrow" }, "L.I.F.E · INTEGRATIONS", -1)),
          e("h2", null, n(t(s)("lifeSettings.title")), 1),
          e("p", Zs, n(t(s)("lifeSettings.subtitle")), 1)
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
          Te(n(b.value ? t(s)("common.saving") : t(s)("common.save")), 1)
        ], 8, Qs)
      ]),
      e("div", en, [
        e("article", tn, [
          e("div", sn, [
            a[22] || (a[22] = e("span", { class: "ls-ic tone-1" }, "◉", -1)),
            e("h3", null, n(t(s)("lifeSettings.hostPerms")), 1)
          ]),
          e("label", nn, [
            O(e("input", {
              "onUpdate:modelValue": a[0] || (a[0] = (c) => h.screen_watch = c),
              type: "checkbox"
            }, null, 512), [
              [Ce, h.screen_watch]
            ]),
            a[23] || (a[23] = e("span", { class: "ls-track" }, null, -1)),
            e("span", ln, [
              e("b", null, n(t(s)("lifeSettings.screenWatch")), 1),
              e("small", null, n(t(s)("lifeSettings.screenWatchDesc")), 1)
            ])
          ]),
          e("label", on, [
            O(e("input", {
              "onUpdate:modelValue": a[1] || (a[1] = (c) => h.computer_use = c),
              type: "checkbox"
            }, null, 512), [
              [Ce, h.computer_use]
            ]),
            a[24] || (a[24] = e("span", { class: "ls-track" }, null, -1)),
            e("span", an, [
              e("b", null, n(t(s)("lifeSettings.computerUse")), 1),
              e("small", null, n(t(s)("lifeSettings.computerUseDesc")), 1)
            ])
          ]),
          e("label", rn, [
            e("span", null, n(t(s)("lifeSettings.agentHost")), 1),
            O(e("input", {
              "onUpdate:modelValue": a[2] || (a[2] = (c) => h.report_agent_host = c),
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
          e("p", pn, n(_.value || t(s)("lifeSettings.loadingModels")), 1),
          e("p", hn, n(t(s)("lifeSettings.thinkLabel")), 1),
          e("div", vn, [
            (r(!0), u(Z, null, de(C.value, (c) => (r(), u("button", {
              key: "think-" + c.id,
              type: "button",
              class: oe(["ls-model", { selected: h.think_model === c.id }]),
              onClick: (v) => h.think_model = c.id
            }, [
              e("b", null, n(c.id), 1),
              e("span", null, n(c.provider) + " · " + n(c.supports_thinking ? "thinking" : "standard"), 1)
            ], 10, mn))), 128)),
            C.value.length ? N("", !0) : (r(), u("span", fn, n(t(s)("lifeSettings.noModels")), 1))
          ]),
          e("p", gn, n(t(s)("lifeSettings.outputLabel")), 1),
          e("div", bn, [
            (r(!0), u(Z, null, de(C.value, (c) => (r(), u("button", {
              key: "output-" + c.id,
              type: "button",
              class: oe(["ls-model", { selected: h.output_model === c.id }]),
              onClick: (v) => h.output_model = c.id
            }, [
              e("b", null, n(c.id), 1),
              e("span", null, n(c.provider) + " · output", 1)
            ], 10, _n))), 128)),
            C.value.length ? N("", !0) : (r(), u("span", yn, n(t(s)("lifeSettings.noModels")), 1))
          ])
        ]),
        e("article", kn, [
          e("div", wn, [
            a[26] || (a[26] = e("span", { class: "ls-ic tone-3" }, "✉", -1)),
            e("h3", null, n(t(s)("lifeSettings.mail")), 1)
          ]),
          e("p", $n, n(t(s)("lifeSettings.mailNote", { mcp: "0kay-mcp", mail: "mail" })), 1),
          e("label", Sn, [
            O(e("input", {
              "onUpdate:modelValue": a[3] || (a[3] = (c) => h.mail_auto_approve_all = c),
              type: "checkbox"
            }, null, 512), [
              [Ce, h.mail_auto_approve_all]
            ]),
            a[27] || (a[27] = e("span", { class: "ls-track" }, null, -1)),
            e("span", Cn, [
              e("b", null, n(t(s)("lifeSettings.mailAutoApprove")), 1),
              e("small", null, n(t(s)("lifeSettings.mailAutoApproveDesc")), 1)
            ])
          ]),
          e("label", Pn, [
            O(e("input", {
              "onUpdate:modelValue": a[4] || (a[4] = (c) => h.mail_require_approval = c),
              type: "checkbox"
            }, null, 512), [
              [Ce, h.mail_require_approval]
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
            O(e("input", {
              "onUpdate:modelValue": a[5] || (a[5] = (c) => h.mcp_enabled = c),
              type: "checkbox"
            }, null, 512), [
              [Ce, h.mcp_enabled]
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
              O(e("input", {
                "onUpdate:modelValue": a[6] || (a[6] = (c) => h.onebot_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.onebot_enabled]
              ]),
              a[32] || (a[32] = e("span", { class: "ls-track" }, null, -1)),
              e("span", Nn, [
                e("b", null, n(t(s)("lifeSettings.onebotEnable")), 1)
              ])
            ]),
            e("label", Rn, [
              O(e("input", {
                "onUpdate:modelValue": a[7] || (a[7] = (c) => h.onebot_observe_group = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.onebot_observe_group]
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
              O(e("input", {
                "onUpdate:modelValue": a[8] || (a[8] = (c) => h.onebot_ws_url = c),
                placeholder: "ws://127.0.0.1:6700"
              }, null, 512), [
                [J, h.onebot_ws_url]
              ])
            ]),
            e("label", zn, [
              e("span", null, n(t(s)("lifeSettings.onebotHttp")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[9] || (a[9] = (c) => h.onebot_http_url = c),
                placeholder: "http://127.0.0.1:6700"
              }, null, 512), [
                [J, h.onebot_http_url]
              ])
            ])
          ]),
          e("div", Bn, [
            e("label", Fn, [
              a[34] || (a[34] = e("span", null, "Access Token", -1)),
              O(e("input", {
                "onUpdate:modelValue": a[10] || (a[10] = (c) => h.onebot_access_token = c),
                type: "password",
                placeholder: "••••••••"
              }, null, 512), [
                [J, h.onebot_access_token]
              ])
            ]),
            e("label", Kn, [
              e("span", null, n(t(s)("lifeSettings.onebotKeywords")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[11] || (a[11] = (c) => h.onebot_trigger_keywords = c),
                placeholder: t(s)("lifeSettings.onebotKeywordsPlaceholder")
              }, null, 8, Hn), [
                [J, h.onebot_trigger_keywords]
              ])
            ])
          ]),
          e("div", jn, [
            e("label", Yn, [
              e("span", null, n(t(s)("lifeSettings.proactiveDaily")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[12] || (a[12] = (c) => h.proactive_daily_limit = c),
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
              O(e("input", {
                "onUpdate:modelValue": a[13] || (a[13] = (c) => h.proactive_target_limit = c),
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
              O(e("input", {
                "onUpdate:modelValue": a[14] || (a[14] = (c) => h.wake_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.wake_enabled]
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
              O(e("input", {
                "onUpdate:modelValue": a[15] || (a[15] = (c) => h.wake_nickname = c),
                placeholder: t(s)("lifeSettings.wakeNicknamePlaceholder")
              }, null, 8, tl), [
                [J, h.wake_nickname]
              ])
            ]),
            e("label", sl, [
              e("span", null, n(t(s)("lifeSettings.asrLanguage")), 1),
              O(e("input", {
                "onUpdate:modelValue": a[16] || (a[16] = (c) => h.asr_language = c),
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
              O(e("input", {
                "onUpdate:modelValue": a[17] || (a[17] = (c) => h.voice_reply_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.voice_reply_enabled]
              ]),
              a[38] || (a[38] = e("span", { class: "ls-track" }, null, -1)),
              e("span", dl, [
                e("b", null, n(t(s)("lifeSettings.mediaVoice")), 1),
                e("small", null, n(t(s)("lifeSettings.mediaVoiceDesc")), 1)
              ])
            ]),
            e("label", cl, [
              O(e("input", {
                "onUpdate:modelValue": a[18] || (a[18] = (c) => h.selfie_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.selfie_enabled]
              ]),
              a[39] || (a[39] = e("span", { class: "ls-track" }, null, -1)),
              e("span", ul, [
                e("b", null, n(t(s)("lifeSettings.mediaSelfie")), 1),
                e("small", null, n(t(s)("lifeSettings.mediaSelfieDesc")), 1)
              ])
            ]),
            e("label", pl, [
              O(e("input", {
                "onUpdate:modelValue": a[19] || (a[19] = (c) => h.call_enabled = c),
                type: "checkbox"
              }, null, 512), [
                [Ce, h.call_enabled]
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
      d.value ? (r(), u("p", ml, n(d.value), 1)) : N("", !0)
    ]));
  }
}), gl = /* @__PURE__ */ Ae(fl, [["__scopeId", "data-v-d91bdafc"]]), bl = "/okay-logo.svg", _l = { class: "content-card about" }, yl = { class: "identity" }, kl = { class: "app-id" }, wl = { class: "ver-badge" }, $l = { class: "app-desc" }, Sl = { class: "identity-actions" }, Cl = ["href"], Pl = { class: "section" }, xl = { class: "section-head" }, Ml = ["disabled"], El = {
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
}, Vl = { class: "us-hero-text" }, Nl = { key: 0 }, Rl = { key: 1 }, Ll = { class: "us-hero-actions" }, Ol = ["disabled"], Dl = ["disabled", "title"], zl = ["href"], Bl = {
  key: 2,
  class: "us-notes"
}, Fl = { class: "us-notes-title" }, Kl = { class: "us-notes-body" }, Hl = {
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
}, _o = ["href"], yo = { class: "foot" }, ko = ["href"], vt = "https://github.com/RazureSOFT/0KAY", wo = "https://github.com/RazureSOFT", $o = /* @__PURE__ */ be({
  __name: "AboutPanel",
  setup(g) {
    const { t: s } = _e(), h = x("0.1.3"), d = x([]), b = x(""), $ = { login: "razureink", url: "https://github.com/razureink", avatar: "https://github.com/razureink.png" }, p = (M, T = 96) => `https://github.com/${M}.png?size=${T}`, _ = x(!1), C = x(null), i = x(""), o = x(null), l = x("");
    let a = null;
    function c(M) {
      return o.value?.status === "running" && o.value.plugin === M;
    }
    async function v(M, T) {
      if (o.value?.status !== "running") {
        l.value = "";
        try {
          o.value = await lt("/api/plugins/pm/update", { plugin: M, version: T || "" }), f();
        } catch (G) {
          l.value = G instanceof Error ? G.message : String(G);
        }
      }
    }
    async function w() {
      try {
        o.value = await Ke("/api/plugins/pm/status");
      } catch {
        return;
      }
      o.value && o.value.status !== "running" && (U(), R());
    }
    function f() {
      a || (a = setInterval(w, 2e3));
    }
    function U() {
      a && (clearInterval(a), a = null);
    }
    const E = Q(() => {
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
    }), H = Q(() => C.value ? C.value.has_update ? "warn" : C.value.latest ? "ok" : "none" : "none");
    async function R() {
      _.value = !0, i.value = "";
      try {
        const M = await Ke("/api/plugins/pm/check");
        C.value = M, M?.current && (h.value = String(M.current));
      } catch (M) {
        i.value = M instanceof Ft && M.status === 404 ? s("settings.about.unsupported") : M instanceof Error ? M.message : String(M);
      } finally {
        _.value = !1;
      }
    }
    async function V() {
      try {
        const M = { Accept: "application/vnd.github+json" }, [T, G] = await Promise.all([
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/contributors?per_page=100", { headers: M }),
          fetch("https://api.github.com/repos/RazureSOFT/0KAY/commits?sha=main&per_page=100", { headers: M })
        ]);
        if (!T.ok) throw new Error(`HTTP ${T.status}`);
        const me = /* @__PURE__ */ new Map(), se = await T.json();
        for (const z of Array.isArray(se) ? se : [])
          z?.login && me.set(z.login, z);
        if (G.ok) {
          const z = await G.json();
          for (const Y of Array.isArray(z) ? z : []) {
            const K = Y?.author;
            !K?.login || K.login.endsWith("[bot]") || me.has(K.login) || me.set(K.login, {
              login: K.login,
              avatar_url: K.avatar_url,
              html_url: K.html_url,
              contributions: 0
            });
          }
        }
        d.value = [...me.values()].sort(
          (z, Y) => (Y.contributions || 0) - (z.contributions || 0) || z.login.localeCompare(Y.login)
        );
      } catch (M) {
        b.value = M instanceof Error ? M.message : String(M), d.value = [];
      }
    }
    return Ne(() => {
      R(), V(), Ke("/api/plugins/pm/status").then((M) => {
        o.value = M, M?.status === "running" && f();
      }).catch(() => {
      });
    }), at(U), (M, T) => (r(), u("div", _l, [
      e("header", yl, [
        T[3] || (T[3] = e("img", {
          class: "app-icon",
          src: bl,
          alt: "",
          "aria-hidden": "true"
        }, null, -1)),
        e("div", kl, [
          e("h2", null, [
            T[2] || (T[2] = Te("0KAY ", -1)),
            e("span", wl, "v" + n(h.value), 1)
          ]),
          e("p", $l, n(t(s)("settings.about.description")), 1)
        ]),
        e("div", Sl, [
          e("a", {
            class: "btn btn-tonal sm",
            href: vt,
            target: "_blank",
            rel: "noopener noreferrer"
          }, n(t(s)("settings.about.repository")) + " ↗", 1),
          e("a", {
            class: "btn btn-tonal sm",
            href: `${vt}/releases`,
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
            disabled: _.value,
            onClick: R
          }, n(t(s)(_.value ? "settings.about.checking" : "settings.about.check")), 9, Ml)
        ]),
        i.value ? (r(), u("p", El, n(i.value), 1)) : (r(), u("div", {
          key: 1,
          class: oe(["us-hero", H.value])
        }, [
          e("div", Ul, [
            H.value === "ok" ? (r(), u("svg", Tl, [...T[5] || (T[5] = [
              e("path", {
                d: "M5 13l4 4 10-11",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, null, -1)
            ])])) : H.value === "warn" ? (r(), u("svg", Al, [...T[6] || (T[6] = [
              e("path", {
                d: "M12 4v11M12 19.5v.5",
                stroke: "currentColor",
                "stroke-width": "2.4",
                "stroke-linecap": "round"
              }, null, -1)
            ])])) : (r(), u("svg", Il, [...T[7] || (T[7] = [
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
            C.value?.latest ? (r(), u("span", Nl, [
              Te("v" + n(C.value.current) + " → ", 1),
              e("em", null, "v" + n(C.value.latest), 1)
            ])) : (r(), u("span", Rl, "0KAY v" + n(C.value?.current || h.value), 1))
          ]),
          e("div", Ll, [
            C.value?.has_update ? (r(), u("button", {
              key: 0,
              class: "btn btn-primary sm",
              disabled: c("core"),
              onClick: T[0] || (T[0] = (G) => v("core", C.value.latest))
            }, n(c("core") ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, Ol)) : N("", !0),
            C.value?.source_available !== !1 ? (r(), u("button", {
              key: 1,
              class: "btn btn-tonal sm",
              disabled: c("core"),
              title: t(s)("settings.about.betaHint"),
              onClick: T[1] || (T[1] = (G) => v("core"))
            }, n(c("core") ? t(s)("settings.about.updating") : t(s)("settings.about.beta")), 9, Dl)) : N("", !0),
            C.value?.url ? (r(), u("a", {
              key: 2,
              class: "btn btn-ghost sm",
              href: C.value.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "Release ↗", 8, zl)) : N("", !0)
          ])
        ], 2)),
        C.value?.notes ? (r(), u("div", Bl, [
          e("p", Fl, n(t(s)("settings.about.whatsNew")), 1),
          e("pre", Kl, n(C.value.notes), 1)
        ])) : N("", !0),
        l.value ? (r(), u("p", Hl, n(l.value), 1)) : N("", !0),
        o.value && o.value.status !== "idle" ? (r(), u("div", {
          key: 4,
          class: oe(["us-apply-banner", o.value.status])
        }, [
          e("div", jl, [
            T[8] || (T[8] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Te(n(o.value.package), 1),
              o.value.version ? (r(), u("span", Yl, "@" + n(o.value.version), 1)) : (r(), u("span", Xl, " · main"))
            ]),
            o.value.mode === "source" ? (r(), u("span", Jl, n(t(s)("settings.about.sourceMode")), 1)) : N("", !0),
            e("span", Wl, n(E.value), 1)
          ]),
          o.value.error ? (r(), u("p", ql, n(o.value.error), 1)) : N("", !0),
          o.value.log ? (r(), u("pre", Gl, n(o.value.log), 1)) : N("", !0)
        ], 2)) : N("", !0)
      ]),
      e("section", Zl, [
        e("h3", Ql, n(t(s)("settings.about.developerTitle")) + " & " + n(t(s)("settings.about.teamTitle")), 1),
        e("div", eo, [
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
            }, null, 8, so),
            e("div", no, [
              e("span", lo, n($.login), 1),
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
              src: p("RazureSOFT"),
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
        d.value.length ? (r(), u("div", ho, [
          (r(!0), u(Z, null, de(d.value, (G) => (r(), u("a", {
            key: G.login,
            class: "contrib",
            href: G.html_url || `https://github.com/${G.login}`,
            target: "_blank",
            rel: "noopener noreferrer"
          }, [
            e("img", {
              src: G.avatar_url || p(G.login, 64),
              alt: G.login,
              loading: "lazy"
            }, null, 8, mo),
            e("span", fo, n(G.login), 1),
            G.contributions ? (r(), u("span", go, n(G.contributions), 1)) : N("", !0)
          ], 8, vo))), 128))
        ])) : (r(), u("p", bo, [
          e("a", {
            class: "repo-link",
            href: $.url,
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
          href: `${vt}/blob/main/LICENSE`,
          target: "_blank",
          rel: "noopener noreferrer"
        }, "LICENSE ↗", 8, ko)
      ])
    ]));
  }
}), So = /* @__PURE__ */ Ae($o, [["__scopeId", "data-v-2678e07b"]]), Co = { class: "content-card updates" }, Po = { class: "us-block" }, xo = { class: "us-head" }, Mo = { class: "us-head-text" }, Eo = { class: "us-title" }, Uo = { class: "us-desc" }, To = { class: "us-source" }, Ao = { class: "us-input-group" }, Io = ["disabled", "placeholder"], Vo = ["disabled"], No = { class: "us-chips" }, Ro = ["disabled"], Lo = ["disabled"], Oo = {
  key: 0,
  class: "us-saved"
}, Do = { class: "helper-text" }, zo = {
  key: 0,
  class: "alert"
}, Bo = { class: "us-block" }, Fo = { class: "us-head" }, Ko = { class: "us-head-text" }, Ho = { class: "us-title" }, jo = { class: "us-desc" }, Yo = { class: "us-head-actions" }, Xo = ["disabled"], Jo = {
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
}, va = /* @__PURE__ */ be({
  __name: "UpdatesPanel",
  setup(g) {
    const { t: s } = _e(), h = x(!1), d = x(null), b = x(""), $ = x(null), p = x("");
    let _ = null;
    const C = x(""), i = x(""), o = x(!1), l = x(!1), a = x(!1), c = x(""), v = Q(() => C.value.trim() !== i.value), w = Q(() => C.value.trim() !== "");
    function f(z) {
      return $.value?.status === "running" && $.value.plugin === z;
    }
    async function U(z, Y) {
      if ($.value?.status !== "running") {
        p.value = "";
        try {
          $.value = await lt("/api/plugins/pm/update", { plugin: z, version: Y || "" }), H();
        } catch (K) {
          p.value = K instanceof Error ? K.message : String(K);
        }
      }
    }
    async function E() {
      try {
        $.value = await Ke("/api/plugins/pm/status");
      } catch {
        return;
      }
      $.value && $.value.status !== "running" && (R(), T());
    }
    function H() {
      _ || (_ = setInterval(E, 2e3));
    }
    function R() {
      _ && (clearInterval(_), _ = null);
    }
    const V = Q(() => {
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
    }), M = Q(() => (d.value || []).filter((z) => z.has_update).length);
    async function T() {
      h.value = !0, b.value = "";
      try {
        const z = await Ke("/api/plugins/pm/check-plugins");
        d.value = z?.plugins || [];
      } catch (z) {
        b.value = z instanceof Ft && z.status === 404 ? s("settings.about.unsupported") : z instanceof Error ? z.message : String(z);
      } finally {
        h.value = !1;
      }
    }
    async function G() {
      o.value = !0, c.value = "";
      try {
        const z = await Ke("/api/settings/updates"), Y = String(z?.values?.github_proxy ?? "");
        C.value = Y, i.value = Y;
      } catch {
      } finally {
        o.value = !1;
      }
    }
    async function me() {
      l.value = !0, c.value = "";
      try {
        const z = C.value.trim();
        await lt("/api/settings/updates", { values: { github_proxy: z } }), i.value = z, a.value = !0, setTimeout(() => {
          a.value = !1;
        }, 1500);
      } catch (z) {
        c.value = z instanceof Error ? z.message : String(z);
      } finally {
        l.value = !1;
      }
    }
    function se(z) {
      C.value = z, me();
    }
    return Ne(() => {
      T(), G(), Ke("/api/plugins/pm/status").then((z) => {
        $.value = z, z?.status === "running" && H();
      }).catch(() => {
      });
    }), at(R), (z, Y) => (r(), u("div", Co, [
      e("section", Po, [
        e("header", xo, [
          Y[3] || (Y[3] = e("span", {
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
            class: oe(["us-tag", { on: w.value }])
          }, n(w.value ? "ghproxy" : t(s)("settings.pluginSourceDirect")), 3)
        ]),
        e("div", To, [
          e("div", Ao, [
            Y[4] || (Y[4] = e("span", {
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
              "onUpdate:modelValue": Y[0] || (Y[0] = (K) => C.value = K),
              class: "us-input",
              type: "text",
              disabled: o.value,
              placeholder: t(s)("settings.pluginSourcePlaceholder"),
              onKeyup: gt(me, ["enter"])
            }, null, 40, Io), [
              [J, C.value]
            ]),
            e("button", {
              class: "btn btn-primary us-apply",
              type: "button",
              disabled: l.value || !v.value,
              onClick: me
            }, n(t(s)("settings.save")), 9, Vo)
          ]),
          e("div", No, [
            e("button", {
              type: "button",
              class: oe(["us-chip", { active: !w.value }]),
              disabled: l.value,
              onClick: Y[1] || (Y[1] = (K) => se(""))
            }, n(t(s)("settings.pluginSourceDirect")), 11, Ro),
            e("button", {
              type: "button",
              class: oe(["us-chip", { active: C.value.trim() === "https://gh-proxy.com" }]),
              disabled: l.value,
              onClick: Y[2] || (Y[2] = (K) => se("https://gh-proxy.com"))
            }, " gh-proxy.com ", 10, Lo),
            a.value ? (r(), u("span", Oo, n(t(s)("settings.saved")), 1)) : N("", !0)
          ]),
          e("p", Do, n(t(s)("settings.pluginSourceHelp")), 1),
          c.value ? (r(), u("p", zo, n(c.value), 1)) : N("", !0)
        ])
      ]),
      Y[10] || (Y[10] = e("div", { class: "us-divider" }, null, -1)),
      e("section", Bo, [
        e("header", Fo, [
          Y[5] || (Y[5] = ls('<span class="us-ico" aria-hidden="true" data-v-bc3fb39c><svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-v-bc3fb39c><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8" data-v-bc3fb39c></rect></svg></span>', 1)),
          e("div", Ko, [
            e("h3", Ho, n(t(s)("settings.about.plugins")), 1),
            e("p", jo, n(t(s)("settings.about.updateHint")), 1)
          ]),
          e("div", Yo, [
            e("span", {
              class: oe(["us-count", { warn: M.value > 0 }])
            }, n(M.value), 3),
            e("button", {
              class: "btn btn-tonal sm",
              disabled: h.value,
              onClick: T
            }, n(t(s)(h.value ? "settings.about.checking" : "settings.about.check")), 9, Xo)
          ])
        ]),
        p.value ? (r(), u("p", Jo, n(p.value), 1)) : N("", !0),
        $.value && $.value.status !== "idle" ? (r(), u("div", {
          key: 1,
          class: oe(["us-apply-banner", $.value.status])
        }, [
          e("div", Wo, [
            Y[6] || (Y[6] = e("span", {
              class: "us-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            e("b", null, [
              Te(n($.value.package), 1),
              $.value.version ? (r(), u("span", qo, "@" + n($.value.version), 1)) : (r(), u("span", Go, " · main"))
            ]),
            $.value.mode === "source" ? (r(), u("span", Zo, n(t(s)("settings.about.sourceMode")), 1)) : N("", !0),
            e("span", Qo, n(V.value), 1)
          ]),
          $.value.error ? (r(), u("p", ea, n($.value.error), 1)) : N("", !0),
          $.value.log ? (r(), u("pre", ta, n($.value.log), 1)) : N("", !0)
        ], 2)) : N("", !0),
        b.value ? (r(), u("p", sa, n(b.value), 1)) : N("", !0),
        d.value ? (r(), u("div", na, [
          e("div", la, [
            e("span", null, n(t(s)("plugins.updatesColPlugin")), 1),
            e("span", null, n(t(s)("plugins.updatesColVersion")), 1),
            e("span", null, n(t(s)("plugins.updatesColStatus")), 1),
            Y[7] || (Y[7] = e("span", null, null, -1))
          ]),
          (r(!0), u(Z, null, de(d.value, (K) => (r(), u("div", {
            key: K.name,
            class: "us-row"
          }, [
            e("span", oa, [
              e("span", {
                class: oe(["us-dot", K.error ? "bad" : K.has_update ? "warn" : K.latest ? "ok" : ""])
              }, null, 2),
              e("span", aa, n(K.name), 1)
            ]),
            e("span", ia, [
              e("em", null, "v" + n(K.version || "—"), 1),
              Y[8] || (Y[8] = e("span", { class: "us-arrow" }, "→", -1)),
              e("b", {
                class: oe({ good: !!K.latest })
              }, n(K.latest ? `v${K.latest}` : "—"), 3)
            ]),
            e("span", {
              class: oe(["us-status", K.error ? "bad" : K.has_update ? "warn" : K.latest ? "ok" : ""])
            }, [
              e("span", ra, n(K.error || t(s)(K.has_update ? "settings.about.available" : K.latest ? "settings.about.latest" : "settings.about.noRelease")), 1)
            ], 2),
            e("span", da, [
              K.can_update && K.has_update ? (r(), u("button", {
                key: 0,
                class: "btn btn-primary xs",
                disabled: f(K.name),
                onClick: (j) => U(K.name, K.latest)
              }, n(f(K.name) ? t(s)("settings.about.updating") : t(s)("settings.about.updateNow")), 9, ca)) : K.can_update ? (r(), u("button", {
                key: 1,
                class: "btn btn-tonal xs",
                disabled: f(K.name),
                onClick: (j) => U(K.name)
              }, n(f(K.name) ? t(s)("settings.about.updating") : t(s)("settings.about.syncNow")), 9, ua)) : N("", !0),
              K.repository ? (r(), u("a", {
                key: 2,
                class: "us-repo",
                href: K.repository,
                target: "_blank",
                rel: "noopener noreferrer",
                title: K.repository
              }, n(t(s)("plugins.updatesColRepo")) + " ↗", 9, pa)) : N("", !0)
            ])
          ]))), 128)),
          d.value.length ? N("", !0) : (r(), u("p", ha, n(t(s)("settings.about.noPlugins")), 1))
        ])) : N("", !0),
        Y[9] || (Y[9] = e("p", { class: "us-foot-hint" }, [
          e("code", null, "0kay-pm update <package>@<version>")
        ], -1))
      ])
    ]));
  }
}), ma = /* @__PURE__ */ Ae(va, [["__scopeId", "data-v-bc3fb39c"]]), fa = { class: "content-card provider-panel" }, ga = { class: "pp-editor-head" }, ba = ["aria-label"], _a = { class: "pp-editor-title" }, ya = { class: "card-desc" }, ka = { class: "pp-section" }, wa = { class: "pp-section-title" }, $a = { class: "pp-grid" }, Sa = { class: "field" }, Ca = { class: "helper-text" }, Pa = { class: "field" }, xa = { class: "field" }, Ma = {
  key: 0,
  class: "pp-req"
}, Ea = ["placeholder"], Ua = { class: "field pp-span" }, Ta = ["placeholder"], Aa = { class: "field" }, Ia = { class: "helper-text" }, Va = { class: "field" }, Na = { class: "helper-text" }, Ra = { class: "pp-section" }, La = { class: "pp-section-head" }, Oa = { class: "pp-section-title" }, Da = ["disabled"], za = { class: "field" }, Ba = { class: "pp-key" }, Fa = ["type", "placeholder"], Ka = {
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
}, Di = { class: "pp-card-actions" }, zi = ["onClick"], Bi = ["disabled", "onClick"], Fi = ["disabled", "onClick"], Ki = ["onClick"], Hi = ["onClick"], ji = {
  key: 1,
  class: "pp-empty"
}, Yi = /* @__PURE__ */ be({
  __name: "ProviderPanel",
  setup(g) {
    const { t: s } = _e(), { confirm: h } = et(), d = hs(), b = x({}), $ = x("list"), p = x(null), _ = x(""), C = x({ state: "idle" }), i = x([]), o = x(""), l = x(!1), a = x(!1), c = x(!1), v = x("llm"), w = Q(() => [
      { value: "llm", label: s("settings.providerKindLLM") },
      { value: "tts", label: s("settings.providerKindTTS") },
      { value: "asr", label: s("settings.providerKindASR") },
      { value: "image", label: s("settings.providerKindImage") }
    ]);
    function f(y) {
      return (y.kind || "llm").toLowerCase();
    }
    const U = Q(() => d.providers.filter((y) => f(y) === v.value));
    function E(y) {
      return d.providers.filter((P) => f(P) === y).length;
    }
    function H() {
      for (const y of U.value) j(y);
    }
    Ne(async () => {
      await d.fetchAll();
      for (const y of d.providers) j(y);
    });
    function R(y) {
      return ht.find((P) => P.id === y) || null;
    }
    function V(y) {
      return y.name && y.name.trim() ? y.name.trim() : R(y.provider)?.name || y.provider;
    }
    function M(y) {
      return R(y.provider)?.logo || "";
    }
    const T = Q(() => [
      { value: "chat", label: s("modelType.chat") },
      { value: "embedding", label: s("modelType.embedding") },
      { value: "rerank", label: s("modelType.rerank") },
      { value: "vision", label: s("modelType.vision") },
      { value: "tts", label: s("modelType.tts") },
      { value: "image", label: s("modelType.image") },
      { value: "audio", label: s("modelType.audio") }
    ]);
    function G(y) {
      return (p.value?.model_types || {})[y] || "chat";
    }
    function me(y, P) {
      if (!p.value) return;
      const S = { ...p.value.model_types || {} };
      !P || P === "chat" ? delete S[y] : S[y] = P, p.value.model_types = S;
    }
    function se(y) {
      const P = new Set(y.disabled_models || []);
      return y.models.filter((S) => !P.has(S));
    }
    function z(y) {
      return d.defaultProviderId === y.id;
    }
    function Y(y) {
      const P = p.value;
      if (!P) return;
      const S = ht.find((te) => te.id === y);
      S?.baseUrl && !P.base_url && (P.base_url = S.baseUrl), P.format = S?.format || "";
    }
    async function K(y, P = "") {
      if (!y.base_url) return { state: "error", message: s("settings.baseUrlRequired") };
      const S = performance.now();
      try {
        const te = await fetch("/api/models/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: y.id,
            provider: y.provider,
            base_url: y.base_url,
            format: y.format || "",
            api_key: P || ""
          })
        });
        if (!te.ok) throw new Error(`HTTP ${te.status}`);
        const A = await te.json(), D = Math.round(performance.now() - S);
        return A.source === "api" && Array.isArray(A.models) && A.models.length ? { state: "ok", count: A.models.length, ms: D, models: A.models } : { state: "error", message: A.error || s("settings.connectionFailed"), ms: D };
      } catch (te) {
        return { state: "error", message: te instanceof Error ? te.message : String(te) };
      }
    }
    async function j(y, P = "") {
      b.value = { ...b.value, [y.id]: { state: "checking" } };
      const S = await K(y, P);
      b.value = { ...b.value, [y.id]: S };
    }
    function B() {
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
      }, _.value = "", C.value = { state: "idle" }, i.value = [], o.value = "", l.value = !1, a.value = !1, $.value = "edit";
    }
    function Ie(y) {
      p.value = {
        ...y,
        api_key: "",
        name: y.name || "",
        models: [...y.models],
        disabled_models: [...y.disabled_models || []],
        format: y.format || "",
        model_types: { ...y.model_types || {} }
      }, a.value = !!y.api_key_masked, _.value = "", C.value = { state: "idle" }, i.value = [], o.value = "", l.value = !1, $.value = "edit";
    }
    function Pe() {
      $.value = "list", p.value = null, _.value = "";
    }
    async function ce() {
      const y = p.value;
      if (!y) return;
      _.value = "";
      const P = (y.name || "").trim();
      if (!y.base_url.trim()) {
        _.value = s("settings.baseUrlRequired");
        return;
      }
      if (y.provider === "custom" && !P) {
        _.value = s("settings.providerNameRequired");
        return;
      }
      if (!y.models.length) {
        _.value = s("settings.modelsRequired");
        return;
      }
      y.id || (y.id = `${y.provider}_${Date.now().toString(36)}`), y.name = P, y.disabled_models = (y.disabled_models || []).filter((S) => y.models.includes(S)), (!y.default_model || !y.models.includes(y.default_model) || y.disabled_models.includes(y.default_model)) && (y.default_model = se(y)[0] || y.models[0]), c.value = !0;
      try {
        await d.upsert({ ...y }), d.defaultProviderId || await d.setDefaults(y.id, y.default_model), Pe(), j(d.providers.find((S) => S.id === y.id) || y);
      } catch (S) {
        _.value = S instanceof Error ? S.message : String(S);
      } finally {
        c.value = !1;
      }
    }
    async function Ve(y) {
      if (await h({
        title: s("settings.remove"),
        message: `${s("settings.remove")} ${V(y)}?`,
        confirmLabel: s("settings.remove"),
        danger: !0
      }))
        try {
          await d.remove(y.id);
        } catch {
        }
    }
    async function ne(y) {
      try {
        await d.upsert({ ...y, enabled: !y.enabled });
      } catch {
      }
    }
    async function he(y) {
      const P = y.default_model || se(y)[0] || y.models[0] || "";
      try {
        await d.setDefaults(y.id, P);
      } catch {
      }
    }
    async function Re() {
      const y = p.value;
      if (!y) return;
      C.value = { state: "checking" };
      const P = await K(y, y.api_key);
      C.value = P, P.state === "ok" && P.models && (i.value = P.models);
    }
    function $e() {
      const y = p.value;
      !y || !i.value.length || (y.models = [...i.value], y.disabled_models = (y.disabled_models || []).filter((P) => y.models.includes(P)), y.models.includes(y.default_model) || (y.default_model = ""));
    }
    function ve(y) {
      const P = p.value;
      if (!P) return;
      const S = new Set(P.disabled_models || []);
      S.has(y) ? S.delete(y) : S.add(y), P.disabled_models = [...S], S.has(P.default_model) && (P.default_model = se(P)[0] || "");
    }
    function xe(y) {
      const P = p.value;
      P && (P.default_model = y, P.disabled_models = (P.disabled_models || []).filter((S) => S !== y));
    }
    const Se = x(""), ae = x("");
    function fe() {
      const y = p.value;
      if (!y) return;
      const P = Se.value.trim();
      if (ae.value = "", !!P) {
        if (y.models.includes(P)) {
          ae.value = s("settings.modelExists", { name: P });
          return;
        }
        y.models = [...y.models, P], y.disabled_models = (y.disabled_models || []).filter((S) => S !== P), y.default_model || (y.default_model = P), Se.value = "";
      }
    }
    function q(y) {
      const P = p.value;
      if (P) {
        if (P.models = P.models.filter((S) => S !== y), P.disabled_models = (P.disabled_models || []).filter((S) => S !== y), P.model_types) {
          const S = { ...P.model_types };
          delete S[y], P.model_types = S;
        }
        P.default_model === y && (P.default_model = se(P)[0] || P.models[0] || "");
      }
    }
    function L(y) {
      const P = p.value;
      P && (P.disabled_models = y ? [] : [...P.models]);
    }
    function ie() {
      const y = p.value;
      if (!y) return;
      const P = new Set(y.disabled_models || []);
      y.disabled_models = y.models.filter((S) => !P.has(S));
    }
    const Le = Q(() => {
      const y = p.value?.models || [], P = o.value.trim().toLowerCase();
      return P ? y.filter((S) => S.toLowerCase().includes(P)) : y;
    }), Je = Q(() => p.value ? se(p.value).length : 0);
    function Me() {
      return s("settings.fetchedSummary", { n: i.value.length });
    }
    const Ge = Q(() => [
      { value: "", label: s("settings.formatAuto") },
      { value: "openai", label: s("settings.formatOpenai") },
      { value: "anthropic", label: s("settings.formatAnthropic") }
    ]), De = Q(
      () => ht.map((y) => ({ value: y.id, label: s(`providers.${y.id}.name`, y.name) }))
    );
    return (y, P) => (r(), u("div", fa, [
      $.value === "edit" && p.value ? (r(), u(Z, { key: 0 }, [
        e("div", ga, [
          e("button", {
            class: "pp-back",
            type: "button",
            onClick: Pe,
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
          ])], 8, ba),
          e("div", _a, [
            e("h2", null, n(p.value.id ? t(s)("settings.edit") : t(s)("settings.addProvider")), 1),
            e("p", ya, n(t(s)("settings.providerDesc")), 1)
          ]),
          e("span", {
            class: oe(["pp-status", C.value.state])
          }, [
            P[14] || (P[14] = e("span", { class: "pp-dot" }, null, -1)),
            Te(" " + n(C.value.state === "checking" ? t(s)("settings.testing") : C.value.state === "ok" ? t(s)("settings.connectionOk") : C.value.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
          ], 2)
        ]),
        e("section", ka, [
          e("h3", wa, n(t(s)("settings.providerSectionBasic")), 1),
          e("div", $a, [
            e("div", Sa, [
              e("label", null, n(t(s)("settings.providerKindLabel")), 1),
              we(t(Ye), {
                modelValue: p.value.kind,
                "onUpdate:modelValue": P[0] || (P[0] = (S) => p.value.kind = S),
                class: "input",
                "aria-label": t(s)("settings.providerKindLabel"),
                options: w.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Ca, n(t(s)("settings.providerKindHint")), 1)
            ]),
            e("div", Pa, [
              e("label", null, n(t(s)("wizard.provider")), 1),
              we(t(Ye), {
                modelValue: p.value.provider,
                "onUpdate:modelValue": P[1] || (P[1] = (S) => p.value.provider = S),
                class: "input",
                "aria-label": t(s)("wizard.provider"),
                options: De.value,
                onChange: Y
              }, null, 8, ["modelValue", "aria-label", "options"])
            ]),
            e("div", xa, [
              e("label", null, [
                Te(n(t(s)("settings.providerName")) + " ", 1),
                p.value.provider === "custom" ? (r(), u("span", Ma, "*")) : N("", !0)
              ]),
              O(e("input", {
                "onUpdate:modelValue": P[2] || (P[2] = (S) => p.value.name = S),
                placeholder: t(s)("settings.providerNamePlaceholder"),
                class: "input"
              }, null, 8, Ea), [
                [J, p.value.name]
              ])
            ]),
            e("div", Ua, [
              e("label", null, n(t(s)("wizard.baseUrl")), 1),
              O(e("input", {
                "onUpdate:modelValue": P[3] || (P[3] = (S) => p.value.base_url = S),
                placeholder: t(s)("wizard.baseUrlPlaceholder"),
                class: "input"
              }, null, 8, Ta), [
                [J, p.value.base_url]
              ])
            ]),
            e("div", Aa, [
              e("label", null, n(t(s)("settings.apiFormat")), 1),
              we(t(Ye), {
                modelValue: p.value.format,
                "onUpdate:modelValue": P[4] || (P[4] = (S) => p.value.format = S),
                class: "input",
                "aria-label": t(s)("settings.apiFormat"),
                options: Ge.value
              }, null, 8, ["modelValue", "aria-label", "options"]),
              e("p", Ia, n(t(s)("settings.apiFormatHint")), 1)
            ]),
            e("div", Va, [
              e("label", null, n(t(s)("wizard.defaultModel")), 1),
              we(t(Ye), {
                modelValue: p.value.default_model,
                "onUpdate:modelValue": P[5] || (P[5] = (S) => p.value.default_model = S),
                class: "input",
                "aria-label": t(s)("wizard.defaultModel"),
                options: se(p.value)
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
              disabled: C.value.state === "checking",
              onClick: Re
            }, n(C.value.state === "checking" ? t(s)("settings.testing") : t(s)("settings.testConnection")), 9, Da)
          ]),
          e("div", za, [
            e("label", null, n(t(s)("wizard.apiKey")), 1),
            e("div", Ba, [
              O(e("input", {
                "onUpdate:modelValue": P[6] || (P[6] = (S) => p.value.api_key = S),
                type: l.value ? "text" : "password",
                placeholder: a.value ? t(s)("settings.apiKeyKept") : t(s)("wizard.apiKeyPlaceholder"),
                class: "input"
              }, null, 8, Fa), [
                [os, p.value.api_key]
              ]),
              e("button", {
                class: "pp-key-toggle",
                type: "button",
                onClick: P[7] || (P[7] = (S) => l.value = !l.value)
              }, n(l.value ? t(s)("settings.hideKey") : t(s)("settings.showKey")), 1)
            ]),
            a.value ? (r(), u("p", Ka, n(t(s)("settings.apiKeyKeptHint")), 1)) : N("", !0),
            C.value.state === "error" ? (r(), u("p", Ha, n(C.value.message), 1)) : C.value.state === "ok" ? (r(), u("p", ja, n(t(s)("settings.connectionOk")) + " · " + n(Me()) + " · " + n(C.value.ms) + "ms ", 1)) : N("", !0)
          ])
        ]),
        e("section", Ya, [
          e("div", Xa, [
            e("h3", Ja, [
              Te(n(t(s)("settings.providerSectionModels")) + " ", 1),
              e("span", Wa, n(Je.value) + "/" + n(p.value.models.length), 1)
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: C.value.state === "checking",
              onClick: Re
            }, n(t(s)("settings.fetchModels")), 9, qa)
          ]),
          i.value.length && i.value.join("\0") !== p.value.models.join("\0") ? (r(), u("div", Ga, [
            e("span", null, n(Me()), 1),
            e("button", {
              class: "btn btn-primary xs",
              type: "button",
              onClick: $e
            }, n(t(s)("settings.applyFetched")), 1)
          ])) : N("", !0),
          e("div", Za, [
            O(e("input", {
              "onUpdate:modelValue": P[8] || (P[8] = (S) => o.value = S),
              class: "input pp-search",
              placeholder: t(s)("settings.searchModels")
            }, null, 8, Qa), [
              [J, o.value]
            ]),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[9] || (P[9] = (S) => L(!0))
            }, n(t(s)("settings.selectAll")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[10] || (P[10] = (S) => ie())
            }, n(t(s)("settings.invertSelection")), 1),
            e("button", {
              class: "pp-mini",
              type: "button",
              onClick: P[11] || (P[11] = (S) => L(!1))
            }, n(t(s)("settings.clearSelection")), 1)
          ]),
          e("div", ei, [
            O(e("input", {
              "onUpdate:modelValue": P[12] || (P[12] = (S) => Se.value = S),
              class: "input",
              placeholder: t(s)("settings.addModelPlaceholder"),
              "aria-label": t(s)("settings.addModelPlaceholder"),
              onKeydown: gt(Fe(fe, ["prevent"]), ["enter"])
            }, null, 40, ti), [
              [J, Se.value]
            ]),
            e("button", {
              class: "btn btn-tonal sm",
              type: "button",
              disabled: !Se.value.trim(),
              onClick: fe
            }, n(t(s)("settings.addModel")), 9, si)
          ]),
          ae.value ? (r(), u("p", ni, n(ae.value), 1)) : N("", !0),
          p.value.models.length ? (r(), u("div", li, [
            (r(!0), u(Z, null, de(Le.value, (S) => (r(), u("div", {
              key: S,
              class: oe(["pp-model", { off: (p.value.disabled_models || []).includes(S) }])
            }, [
              e("span", {
                class: "pp-model-name",
                title: S
              }, n(S), 9, oi),
              e("select", {
                class: oe(["pp-type", { tagged: G(S) !== "chat" }]),
                value: G(S),
                title: t(s)("settings.providerModelType"),
                onChange: (te) => me(S, te.target.value)
              }, [
                (r(!0), u(Z, null, de(T.value, (te) => (r(), u("option", {
                  key: te.value,
                  value: te.value
                }, n(te.label), 9, ii))), 128))
              ], 42, ai),
              p.value.default_model !== S ? (r(), u("button", {
                key: 0,
                class: "pp-star",
                type: "button",
                title: t(s)("settings.makeDefault"),
                disabled: (p.value.disabled_models || []).includes(S),
                onClick: (te) => xe(S)
              }, "☆", 8, ri)) : (r(), u("span", {
                key: 1,
                class: "pp-star on",
                title: t(s)("wizard.defaultModel")
              }, "★", 8, di)),
              e("input", {
                type: "checkbox",
                class: "pp-switch",
                checked: !(p.value.disabled_models || []).includes(S),
                onChange: (te) => ve(S)
              }, null, 40, ci),
              e("button", {
                class: "pp-remove",
                type: "button",
                title: t(s)("settings.removeModel", { name: S }),
                "aria-label": t(s)("settings.removeModel", { name: S }),
                onClick: (te) => q(S)
              }, "×", 8, ui)
            ], 2))), 128)),
            Le.value.length ? N("", !0) : (r(), u("p", pi, n(t(s)("settings.searchModels")), 1))
          ])) : (r(), u("p", hi, n(t(s)("settings.noModelsYet")), 1))
        ]),
        _.value ? (r(), u("p", vi, n(_.value), 1)) : N("", !0),
        e("div", mi, [
          e("button", {
            class: "btn btn-primary",
            type: "button",
            disabled: c.value,
            onClick: ce
          }, n(c.value ? t(s)("settings.saving") : t(s)("settings.save")), 9, fi),
          e("button", {
            class: "btn btn-ghost",
            type: "button",
            onClick: Pe
          }, n(t(s)("settings.cancel")), 1)
        ])
      ], 64)) : (r(), u(Z, { key: 1 }, [
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
              onClick: B
            }, "+ " + n(t(s)("settings.addProvider")), 1)
          ])
        ]),
        e("nav", yi, [
          (r(!0), u(Z, null, de(w.value, (S) => (r(), u("button", {
            key: S.value,
            type: "button",
            role: "tab",
            class: oe(["pp-kind", { active: v.value === S.value }]),
            "aria-selected": v.value === S.value,
            onClick: (te) => v.value = S.value
          }, [
            Te(n(S.label) + " ", 1),
            e("span", wi, n(E(S.value)), 1)
          ], 10, ki))), 128))
        ]),
        U.value.length ? (r(), u("div", $i, [
          (r(!0), u(Z, null, de(U.value, (S) => (r(), u("article", {
            key: S.id,
            class: oe(["pp-card", { off: !S.enabled, default: z(S) }])
          }, [
            e("header", Si, [
              e("span", Ci, [
                M(S) ? (r(), u("img", {
                  key: 0,
                  src: M(S),
                  alt: V(S)
                }, null, 8, Pi)) : (r(), u("svg", xi, [...P[15] || (P[15] = [
                  e("path", { d: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" }, null, -1)
                ])]))
              ]),
              e("div", Mi, [
                e("strong", null, n(V(S)), 1),
                e("code", {
                  title: S.base_url
                }, n(S.base_url || "—"), 9, Ei)
              ]),
              e("div", Ui, [
                z(S) ? (r(), u("span", Ti, n(t(s)("settings.default")), 1)) : N("", !0),
                e("span", Ai, n(se(S).length) + "/" + n(S.models.length), 1)
              ])
            ]),
            e("div", Ii, [
              e("span", {
                class: oe(["pp-status", b.value[S.id]?.state || "idle"])
              }, [
                P[16] || (P[16] = e("span", { class: "pp-dot" }, null, -1)),
                Te(" " + n(b.value[S.id]?.state === "checking" ? t(s)("settings.testing") : b.value[S.id]?.state === "ok" ? t(s)("settings.connectionOk") : b.value[S.id]?.state === "error" ? t(s)("settings.connectionFailed") : t(s)("settings.statusIdle")), 1)
              ], 2),
              b.value[S.id]?.state === "ok" ? (r(), u("span", Vi, n(t(s)("settings.fetchedSummary", { n: b.value[S.id]?.count || 0 })) + " · " + n(b.value[S.id]?.ms) + "ms", 1)) : b.value[S.id]?.state === "error" ? (r(), u("span", {
                key: 1,
                class: "pp-meta err",
                title: b.value[S.id]?.message
              }, n(b.value[S.id]?.message), 9, Ni)) : N("", !0)
            ]),
            e("div", Ri, [
              (r(!0), u(Z, null, de(se(S).slice(0, 6), (te) => (r(), u("span", {
                key: te,
                class: "pp-chip"
              }, n(te), 1))), 128)),
              se(S).length > 6 ? (r(), u("span", Li, "+" + n(se(S).length - 6), 1)) : N("", !0),
              S.models.length ? N("", !0) : (r(), u("span", Oi, n(t(s)("settings.noModelsYet")), 1))
            ]),
            e("footer", Di, [
              e("button", {
                class: "btn btn-tonal sm",
                type: "button",
                onClick: (te) => Ie(S)
              }, n(t(s)("settings.edit")), 9, zi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: b.value[S.id]?.state === "checking",
                onClick: (te) => j(S)
              }, n(t(s)("settings.testConnection")), 9, Bi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                disabled: z(S),
                onClick: (te) => he(S)
              }, n(t(s)("settings.makeDefault")), 9, Fi),
              e("button", {
                class: "btn btn-ghost sm",
                type: "button",
                onClick: (te) => ne(S)
              }, n(S.enabled ? t(s)("settings.disableProvider") : t(s)("settings.enableProvider")), 9, Ki),
              e("button", {
                class: "btn btn-ghost sm danger-text",
                type: "button",
                onClick: (te) => Ve(S)
              }, n(t(s)("settings.remove")), 9, Hi)
            ])
          ], 2))), 128))
        ])) : (r(), u("div", ji, [
          e("p", null, n(t(s)("settings.noProvidersForKind")), 1),
          e("button", {
            class: "btn btn-primary",
            type: "button",
            onClick: B
          }, "+ " + n(t(s)("settings.addFirstProvider")), 1)
        ]))
      ], 64))
    ]));
  }
}), Xi = /* @__PURE__ */ Ae(Yi, [["__scopeId", "data-v-d10cd596"]]), Ji = { class: "pairing-panel" }, Wi = {
  key: 0,
  class: "pairing-error",
  role: "alert"
}, qi = { key: 1 }, Gi = { key: 0 }, Zi = ["onClick"], Qi = ["onClick"], er = ["disabled", "onClick"], tr = /* @__PURE__ */ be({
  __name: "PairingPanel",
  setup(g) {
    const { t: s } = _e(), { confirm: h } = et(), d = x([]), b = x([]), $ = x(""), p = x("");
    let _;
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
    return Ne(() => {
      C(), _ = setInterval(C, 3e3);
    }), at(() => clearInterval(_)), (l, a) => (r(), u("section", Ji, [
      e("h3", null, n(t(s)("pairing.title")), 1),
      e("p", null, n(t(s)("pairing.hint")), 1),
      $.value ? (r(), u("p", Wi, n($.value), 1)) : N("", !0),
      d.value.length ? N("", !0) : (r(), u("p", qi, n(t(s)("pairing.empty")), 1)),
      we(Vt, {
        tag: "div",
        name: "pair",
        class: "pairing-list"
      }, {
        default: nt(() => [
          (r(!0), u(Z, null, de(d.value, (c) => (r(), u("article", {
            key: c.id
          }, [
            e("strong", null, n(c.name), 1),
            e("code", null, n(c.code), 1),
            c.approved ? (r(), u("span", Gi, n(t(s)("pairing.approved")), 1)) : (r(), u(Z, { key: 1 }, [
              e("button", {
                type: "button",
                class: "btn btn-ghost",
                onClick: (v) => i(c, !1)
              }, n(t(s)("pairing.deny")), 9, Zi),
              e("button", {
                type: "button",
                class: "btn btn-primary",
                onClick: (v) => i(c, !0)
              }, n(t(s)("pairing.allow")), 9, Qi)
            ], 64))
          ]))), 128))
        ]),
        _: 1
      }),
      b.value.length ? (r(), u(Z, { key: 2 }, [
        e("h4", null, n(t(s)("pairing.pairedCount", { n: b.value.length })), 1),
        we(Vt, {
          tag: "div",
          name: "pair",
          class: "pairing-list"
        }, {
          default: nt(() => [
            (r(!0), u(Z, null, de(b.value, (c) => (r(), u("article", {
              key: c.id
            }, [
              e("strong", null, n(c.name || c.id), 1),
              e("button", {
                type: "button",
                class: "btn btn-danger-tonal",
                disabled: p.value === c.id,
                onClick: (v) => o(c)
              }, n(p.value === c.id ? t(s)("pairing.disconnecting") : t(s)("pairing.disconnect")), 9, er)
            ]))), 128))
          ]),
          _: 1
        })
      ], 64)) : N("", !0)
    ]));
  }
}), sr = /* @__PURE__ */ Ae(tr, [["__scopeId", "data-v-67a1ff9e"]]), nr = { class: "content-card" }, lr = { class: "card-desc" }, or = { class: "field" }, ar = ["aria-label"], ir = ["aria-pressed", "onClick"], rr = /* @__PURE__ */ be({
  __name: "GeneralPanel",
  setup(g) {
    const { t: s } = _e(), h = x(vs());
    function d(b) {
      h.value = b, fs(b);
    }
    return (b, $) => (r(), u("div", nr, [
      e("h2", null, n(t(s)("settings.tabs.general")), 1),
      e("p", lr, n(t(s)("settings.generalDesc")), 1),
      e("div", or, [
        e("label", null, n(t(s)("settings.language")), 1),
        e("div", {
          class: "segmented",
          role: "group",
          "aria-label": t(s)("settings.language")
        }, [
          (r(!0), u(Z, null, de(t(ms), (p) => (r(), u("button", {
            key: p.code,
            class: oe(["seg", { active: h.value === p.code }]),
            "aria-pressed": h.value === p.code,
            onClick: (_) => d(p.code)
          }, n(p.label), 11, ir))), 128))
        ], 8, ar)
      ]),
      we(sr)
    ]));
  }
}), dr = { class: "models-field" }, cr = {
  key: 0,
  class: "models-list"
}, ur = { class: "models-rank" }, pr = ["title"], hr = { class: "models-actions" }, vr = ["disabled", "aria-label", "onClick"], mr = ["disabled", "aria-label", "onClick"], fr = ["aria-label", "onClick"], gr = {
  key: 1,
  class: "models-empty"
}, br = /* @__PURE__ */ be({
  __name: "ModelsField",
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(g, { emit: s }) {
    const { t: h } = _e(), d = g, b = s, $ = Q(() => String(d.modelValue || "").split(",").map((l) => l.trim()).filter(Boolean)), p = Q(() => d.options.filter((l) => !$.value.includes(l)));
    function _(l) {
      b("update:modelValue", l.join(","));
    }
    function C(l) {
      l && !$.value.includes(l) && _([...$.value, l]);
    }
    function i(l) {
      _($.value.filter((a) => a !== l));
    }
    function o(l, a) {
      const c = [...$.value], v = l + a;
      v < 0 || v >= c.length || ([c[l], c[v]] = [c[v], c[l]], _(c));
    }
    return (l, a) => (r(), u("div", dr, [
      $.value.length ? (r(), u("ol", cr, [
        (r(!0), u(Z, null, de($.value, (c, v) => (r(), u("li", { key: c }, [
          e("span", ur, n(v + 1), 1),
          e("span", {
            class: "models-name",
            title: c
          }, n(c), 9, pr),
          e("span", hr, [
            e("button", {
              type: "button",
              disabled: v === 0,
              "aria-label": t(h)("models.higher"),
              onClick: (w) => o(v, -1)
            }, "↑", 8, vr),
            e("button", {
              type: "button",
              disabled: v === $.value.length - 1,
              "aria-label": t(h)("models.lower"),
              onClick: (w) => o(v, 1)
            }, "↓", 8, mr),
            e("button", {
              type: "button",
              "aria-label": t(h)("common.remove"),
              onClick: (w) => i(c)
            }, "✕", 8, fr)
          ])
        ]))), 128))
      ])) : (r(), u("p", gr, n(t(h)("models.empty")), 1)),
      p.value.length ? (r(), ke(t(Ye), {
        key: 2,
        options: p.value,
        "model-value": "",
        placeholder: t(h)("models.addPlaceholder"),
        "onUpdate:modelValue": C
      }, null, 8, ["options", "placeholder"])) : N("", !0)
    ]));
  }
}), _r = /* @__PURE__ */ Ae(br, [["__scopeId", "data-v-b6ad9d20"]]), yr = { class: "field" }, kr = {
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
}, mt = /* @__PURE__ */ be({
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
    const { t: h } = _e(), d = g, b = s;
    function $() {
      return `field-${d.sectionId}-${d.field.key}`;
    }
    function p(_) {
      const C = _.target.value;
      b("update:modelValue", d.field.type === "number" ? Number(C) : C);
    }
    return (_, C) => (r(), u("div", yr, [
      g.field.type === "bool" ? (r(), u("label", kr, [
        e("input", {
          type: "checkbox",
          checked: !!g.modelValue,
          onChange: C[0] || (C[0] = (i) => b("update:modelValue", i.target.checked))
        }, null, 40, wr),
        C[5] || (C[5] = e("span", { class: "toggle-slider" }, null, -1)),
        e("span", null, [
          e("strong", null, n(g.label), 1),
          g.help ? (r(), u("br", $r)) : N("", !0),
          g.help ? (r(), u("small", Sr, n(g.help), 1)) : N("", !0)
        ])
      ])) : g.field.type === "note" ? (r(), u("div", Cr, [
        g.label ? (r(), u("strong", Pr, n(g.label), 1)) : N("", !0),
        we(t(gs), {
          content: g.help || ""
        }, null, 8, ["content"])
      ])) : g.field.type === "select" ? (r(), u(Z, { key: 2 }, [
        e("label", {
          for: $()
        }, n(g.label), 9, xr),
        we(t(Ye), {
          "input-id": $(),
          class: "input",
          "aria-label": g.label,
          "model-value": String(g.modelValue ?? ""),
          options: g.field.options ?? g.options ?? [],
          "onUpdate:modelValue": C[1] || (C[1] = (i) => b("update:modelValue", i))
        }, null, 8, ["input-id", "aria-label", "model-value", "options"]),
        g.help ? (r(), u("p", Mr, n(g.help), 1)) : N("", !0)
      ], 64)) : g.field.type === "model" ? (r(), u(Z, { key: 3 }, [
        e("label", {
          for: $()
        }, n(g.label), 9, Er),
        we(t(Ye), {
          "input-id": $(),
          class: "input",
          "aria-label": g.label,
          "model-value": String(g.modelValue ?? ""),
          options: g.modelOptions || [],
          "onUpdate:modelValue": C[2] || (C[2] = (i) => b("update:modelValue", i))
        }, null, 8, ["input-id", "aria-label", "model-value", "options"]),
        g.help ? (r(), u("p", Ur, n(g.help), 1)) : N("", !0)
      ], 64)) : g.field.type === "models" ? (r(), u(Z, { key: 4 }, [
        e("label", {
          for: $()
        }, n(g.label), 9, Tr),
        we(_r, {
          "model-value": String(g.modelValue ?? ""),
          options: g.availableModels || [],
          "onUpdate:modelValue": C[3] || (C[3] = (i) => b("update:modelValue", i))
        }, null, 8, ["model-value", "options"]),
        g.help ? (r(), u("p", Ar, n(g.help), 1)) : N("", !0)
      ], 64)) : g.field.type === "dir" ? (r(), u(Z, { key: 5 }, [
        e("label", {
          for: $()
        }, n(g.label), 9, Ir),
        e("div", Vr, [
          e("input", {
            id: $(),
            class: "input",
            type: "text",
            spellcheck: "false",
            value: String(g.modelValue ?? ""),
            placeholder: g.field.default_value || "",
            onInput: p
          }, null, 40, Nr),
          e("button", {
            class: "btn btn-tonal compact",
            type: "button",
            onClick: C[4] || (C[4] = (i) => b("browse"))
          }, n(t(h)("settings.browse")), 1)
        ]),
        g.help ? (r(), u("p", Rr, n(g.help), 1)) : N("", !0)
      ], 64)) : (r(), u(Z, { key: 6 }, [
        e("label", {
          for: $()
        }, n(g.label), 9, Lr),
        e("input", {
          id: $(),
          class: "input",
          type: g.field.type === "number" ? "number" : "text",
          value: g.modelValue === void 0 || g.modelValue === null ? "" : String(g.modelValue),
          onInput: p
        }, null, 40, Or),
        g.help ? (r(), u("p", Dr, n(g.help), 1)) : N("", !0)
      ], 64))
    ]));
  }
});
var Xe;
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
          const U = this.getPenaltyScore();
          U < w && (a = f, w = U), this.applyMask(f);
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
        const R = p.getNumDataCodewords(w, o) * 8, V = $.getTotalBits(i, w);
        if (V <= R) {
          f = V;
          break;
        }
        if (w >= a)
          throw new RangeError("Data too long");
      }
      for (const R of [p.Ecc.MEDIUM, p.Ecc.QUARTILE, p.Ecc.HIGH])
        v && f <= p.getNumDataCodewords(w, R) * 8 && (o = R);
      let U = [];
      for (const R of i) {
        h(R.mode.modeBits, 4, U), h(R.numChars, R.mode.numCharCountBits(w), U);
        for (const V of R.getData())
          U.push(V);
      }
      b(U.length == f);
      const E = p.getNumDataCodewords(w, o) * 8;
      b(U.length <= E), h(0, Math.min(4, E - U.length), U), h(0, (8 - U.length % 8) % 8, U), b(U.length % 8 == 0);
      for (let R = 236; U.length < E; R ^= 253)
        h(R, 8, U);
      let H = [];
      for (; H.length * 8 < U.length; )
        H.push(0);
      return U.forEach((R, V) => H[V >>> 3] |= R << 7 - (V & 7)), new p(w, o, H, c);
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
      let U = [];
      const E = p.reedSolomonComputeDivisor(c);
      for (let R = 0, V = 0; R < a; R++) {
        let M = i.slice(V, V + f - c + (R < w ? 0 : 1));
        V += M.length;
        const T = p.reedSolomonComputeRemainder(M, E);
        R < w && M.push(0), U.push(M.concat(T));
      }
      let H = [];
      for (let R = 0; R < U[0].length; R++)
        U.forEach((V, M) => {
          (R != f - c || M >= w) && H.push(V[R]);
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
        for (let U = 0; U < this.size; U++)
          this.modules[c][U] == v ? (w++, w == 5 ? i += p.PENALTY_N1 : w > 5 && i++) : (this.finderPenaltyAddHistory(w, f), v || (i += this.finderPenaltyCountPatterns(f) * p.PENALTY_N3), v = this.modules[c][U], w = 1);
        i += this.finderPenaltyTerminateAndCount(v, w, f) * p.PENALTY_N3;
      }
      for (let c = 0; c < this.size; c++) {
        let v = !1, w = 0, f = [0, 0, 0, 0, 0, 0, 0];
        for (let U = 0; U < this.size; U++)
          this.modules[U][c] == v ? (w++, w == 5 ? i += p.PENALTY_N1 : w > 5 && i++) : (this.finderPenaltyAddHistory(w, f), v || (i += this.finderPenaltyCountPatterns(f) * p.PENALTY_N3), v = this.modules[U][c], w = 1);
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
  const _ = class _ {
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
      return new _(_.Mode.BYTE, i.length, o);
    }
    static makeNumeric(i) {
      if (!_.isNumeric(i))
        throw new RangeError("String contains non-numeric characters");
      let o = [];
      for (let l = 0; l < i.length; ) {
        const a = Math.min(i.length - l, 3);
        h(parseInt(i.substring(l, l + a), 10), a * 3 + 1, o), l += a;
      }
      return new _(_.Mode.NUMERIC, i.length, o);
    }
    static makeAlphanumeric(i) {
      if (!_.isAlphanumeric(i))
        throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let o = [], l;
      for (l = 0; l + 2 <= i.length; l += 2) {
        let a = _.ALPHANUMERIC_CHARSET.indexOf(i.charAt(l)) * 45;
        a += _.ALPHANUMERIC_CHARSET.indexOf(i.charAt(l + 1)), h(a, 11, o);
      }
      return l < i.length && h(_.ALPHANUMERIC_CHARSET.indexOf(i.charAt(l)), 6, o), new _(_.Mode.ALPHANUMERIC, i.length, o);
    }
    static makeSegments(i) {
      return i == "" ? [] : _.isNumeric(i) ? [_.makeNumeric(i)] : _.isAlphanumeric(i) ? [_.makeAlphanumeric(i)] : [_.makeBytes(_.toUtf8ByteArray(i))];
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
      return new _(_.Mode.ECI, 0, o);
    }
    static isNumeric(i) {
      return _.NUMERIC_REGEX.test(i);
    }
    static isAlphanumeric(i) {
      return _.ALPHANUMERIC_REGEX.test(i);
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
  ee(_, "NUMERIC_REGEX", /^[0-9]*$/), ee(_, "ALPHANUMERIC_REGEX", /^[A-Z0-9 $%*+.\/:-]*$/), ee(_, "ALPHANUMERIC_CHARSET", "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:");
  let $ = _;
  g.QrSegment = $;
})(Xe || (Xe = {}));
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
})(Xe || (Xe = {}));
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
})(Xe || (Xe = {}));
const Ot = Xe, zr = { class: "content-card" }, Br = { class: "card-desc" }, Fr = { class: "connection-grid" }, Kr = { class: "connection-form" }, Hr = { class: "field" }, jr = ["placeholder"], Yr = { class: "field" }, Xr = { class: "toggle-label" }, Jr = { class: "field" }, Wr = ["placeholder"], qr = { class: "field" }, Gr = ["placeholder"], Zr = { class: "field" }, Qr = { class: "helper-text" }, ed = { key: 0 }, td = { key: 1 }, sd = { class: "actions-row" }, nd = { class: "connection-qr" }, ld = ["viewBox"], od = ["width", "height"], ad = ["x", "y"], id = { class: "connection-link" }, Dt = "0kay.connection.qr.v2", rd = /* @__PURE__ */ be({
  __name: "ConnectionPanel",
  setup(g) {
    const { t: s } = _e();
    function h() {
      try {
        return JSON.parse(localStorage.getItem(Dt) || "{}");
      } catch {
        return {};
      }
    }
    function d(V) {
      const M = (T) => /^192\.168\./.test(T) ? 0 : /^10\./.test(T) ? 1 : /^172\.(1[6-9]|2\d|3[01])\./.test(T) ? 2 : /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(T) ? 4 : 3;
      return [...V].sort((T, G) => M(T) - M(G))[0] || "";
    }
    const b = h(), $ = !!b.hostOverride, p = x(b.hostOverride && b.host ? b.host : location.hostname), _ = x($), C = location.protocol === "https:" ? location.port || "443" : "8080", i = x(b.port ?? C), o = x(b.tls ?? location.protocol === "https:"), l = x(""), a = x(""), c = x(b.name ?? "0KAY"), v = x(""), w = x(!1), f = x(!1);
    Ne(async () => {
      try {
        const V = await fetch("/api/auth/session");
        if (V.ok) {
          const M = await V.json();
          v.value = String(M.core_id || ""), w.value = !!M.lan_enabled;
          const T = Array.isArray(M.addresses) ? M.addresses : [], G = d(T);
          !_.value && G && (p.value = G);
        }
      } catch {
      }
    }), We([p, i, o, c, _], () => {
      localStorage.setItem(
        Dt,
        JSON.stringify({
          host: p.value,
          hostOverride: _.value,
          port: i.value,
          tls: o.value,
          name: c.value
        })
      );
    });
    const U = Q(() => {
      const V = o.value ? "https" : "http", M = String(i.value || "").trim();
      return `${V}://${p.value.trim()}${M ? ":" + M : ""}`;
    }), E = Q(() => {
      const V = [["v", "1"], ["url", U.value]];
      return c.value.trim() && V.push(["name", c.value.trim()]), l.value.trim() && V.push(["token", l.value.trim()]), a.value.trim() && V.push(["pin", a.value.trim()]), v.value && V.push(["core_id", v.value]), `0kay://pair?${V.map(([T, G]) => `${T}=${encodeURIComponent(G)}`).join("&")}`;
    }), H = Q(() => {
      const V = Ot.QrCode.encodeText(E.value, Ot.QrCode.Ecc.MEDIUM), M = V.size, T = 2, G = M + T * 2, me = [];
      for (let se = 0; se < M; se++)
        for (let z = 0; z < M; z++)
          V.getModule(z, se) && me.push({ x: z + T, y: se + T });
      return { dim: G, dark: me };
    });
    async function R() {
      try {
        await navigator.clipboard.writeText(E.value), f.value = !0, setTimeout(() => f.value = !1, 1500);
      } catch {
      }
    }
    return (V, M) => (r(), u("div", zr, [
      e("h2", null, n(t(s)("connection.title")), 1),
      e("p", Br, n(t(s)("connection.lead")), 1),
      e("div", Fr, [
        e("div", Kr, [
          e("div", Hr, [
            e("label", null, n(t(s)("connection.remoteHost")), 1),
            O(e("input", {
              "onUpdate:modelValue": M[0] || (M[0] = (T) => p.value = T),
              class: "input",
              placeholder: t(s)("connection.hostPlaceholder"),
              onInput: M[1] || (M[1] = (T) => _.value = !0)
            }, null, 40, jr), [
              [J, p.value]
            ])
          ]),
          e("div", Yr, [
            e("label", null, n(t(s)("connection.port")), 1),
            O(e("input", {
              "onUpdate:modelValue": M[2] || (M[2] = (T) => i.value = T),
              class: "input",
              inputmode: "numeric",
              placeholder: "8080"
            }, null, 512), [
              [J, i.value]
            ])
          ]),
          e("label", Xr, [
            O(e("input", {
              type: "checkbox",
              "onUpdate:modelValue": M[3] || (M[3] = (T) => o.value = T)
            }, null, 512), [
              [Ce, o.value]
            ]),
            M[7] || (M[7] = e("span", { class: "toggle-slider" }, null, -1)),
            e("span", null, n(t(s)("connection.useTls")), 1)
          ]),
          e("div", Jr, [
            e("label", null, n(t(s)("connection.token")), 1),
            O(e("input", {
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
            O(e("input", {
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
            O(e("input", {
              "onUpdate:modelValue": M[6] || (M[6] = (T) => c.value = T),
              class: "input",
              placeholder: "0KAY"
            }, null, 512), [
              [J, c.value]
            ])
          ]),
          e("div", Qr, [
            Te(n(t(s)("connection.address")), 1),
            e("code", null, n(U.value), 1),
            v.value ? (r(), u("span", ed, " · Core: " + n(v.value), 1)) : N("", !0),
            w.value ? (r(), u("span", td, n(t(s)("connection.lanMode")), 1)) : N("", !0)
          ]),
          e("div", sd, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              onClick: R
            }, n(f.value ? t(s)("common.copied") : t(s)("connection.copyLink")), 1)
          ])
        ]),
        e("div", nd, [
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
            }, null, 8, od),
            (r(!0), u(Z, null, de(H.value.dark, (T) => (r(), u("rect", {
              key: T.x + ":" + T.y,
              x: T.x,
              y: T.y,
              width: "1",
              height: "1",
              fill: "#0b1020"
            }, null, 8, ad))), 128))
          ], 8, ld)),
          e("code", id, n(E.value), 1)
        ])
      ])
    ]));
  }
}), dd = /* @__PURE__ */ Ae(rd, [["__scopeId", "data-v-d9b226f0"]]), cd = { class: "content-card" }, ud = { class: "card-desc" }, pd = { class: "field-row" }, hd = { class: "field" }, vd = ["placeholder"], md = { class: "field" }, fd = ["placeholder"], gd = { class: "field" }, bd = { class: "field" }, _d = ["placeholder"], yd = { class: "field" }, kd = ["placeholder"], wd = { class: "field" }, $d = ["placeholder"], Sd = { class: "field" }, Cd = ["placeholder"], Pd = { class: "helper-text" }, xd = /* @__PURE__ */ be({
  __name: "PersonaPanel",
  setup(g) {
    const { t: s } = _e(), h = it(), { tabLabel: d, tabMeta: b } = bt();
    return ($, p) => (r(), u("div", cd, [
      e("h2", null, n(t(d)("persona")), 1),
      e("p", ud, n(t(b)("persona")?.descriptionKey ? t(s)(t(b)("persona").descriptionKey) : t(s)("settings.personaDesc")), 1),
      e("div", pd, [
        e("div", hd, [
          e("label", null, n(t(s)("wizard.name")), 1),
          O(e("input", {
            "onUpdate:modelValue": p[0] || (p[0] = (_) => t(h).persona.name = _),
            placeholder: t(s)("wizard.namePlaceholder"),
            class: "input"
          }, null, 8, vd), [
            [J, t(h).persona.name]
          ])
        ]),
        e("div", md, [
          e("label", null, n(t(s)("wizard.avatarUrl")), 1),
          O(e("input", {
            "onUpdate:modelValue": p[1] || (p[1] = (_) => t(h).persona.avatar = _),
            placeholder: t(s)("wizard.avatarPlaceholder"),
            class: "input"
          }, null, 8, fd), [
            [J, t(h).persona.avatar]
          ])
        ]),
        e("div", gd, [
          e("label", null, n(t(s)("settings.personaBirthDate")), 1),
          O(e("input", {
            "onUpdate:modelValue": p[2] || (p[2] = (_) => t(h).persona.birthDate = _),
            type: "date",
            class: "input"
          }, null, 512), [
            [J, t(h).persona.birthDate]
          ])
        ])
      ]),
      e("div", bd, [
        e("label", null, n(t(s)("wizard.description")), 1),
        O(e("textarea", {
          "onUpdate:modelValue": p[3] || (p[3] = (_) => t(h).persona.description = _),
          placeholder: t(s)("wizard.descriptionPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, _d), [
          [J, t(h).persona.description]
        ])
      ]),
      e("div", yd, [
        e("label", null, n(t(s)("wizard.personality")), 1),
        O(e("textarea", {
          "onUpdate:modelValue": p[4] || (p[4] = (_) => t(h).persona.personality = _),
          placeholder: t(s)("wizard.personalityPlaceholder"),
          class: "input",
          rows: "3"
        }, null, 8, kd), [
          [J, t(h).persona.personality]
        ])
      ]),
      e("div", wd, [
        e("label", null, n(t(s)("wizard.greeting")), 1),
        O(e("textarea", {
          "onUpdate:modelValue": p[5] || (p[5] = (_) => t(h).persona.greeting = _),
          placeholder: t(s)("wizard.greetingPlaceholder"),
          class: "input",
          rows: "2"
        }, null, 8, $d), [
          [J, t(h).persona.greeting]
        ])
      ]),
      e("div", Sd, [
        e("label", null, n(t(s)("wizard.customPrompt")), 1),
        O(e("textarea", {
          "onUpdate:modelValue": p[6] || (p[6] = (_) => t(h).persona.customPrompt = _),
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
}, Od = { class: "actions-row" }, Dd = /* @__PURE__ */ be({
  __name: "PermissionsPanel",
  setup(g) {
    const { t: s } = _e(), { tabLabel: h, tabMeta: d, fieldLabel: b, fieldHelp: $ } = bt(), p = x({ screen_watch: !1, computer_use: !1, report_agent_host: "" }), _ = x("");
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
      _.value = "";
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
        }, _.value = s("settings.permSaved");
      } catch {
        _.value = s("settings.permFailed");
      }
    }
    return Ne(C), (o, l) => (r(), u("div", Md, [
      e("h2", null, n(t(h)("permissions")), 1),
      e("p", Ed, n(t(d)("permissions")?.descriptionKey ? t(s)(t(d)("permissions").descriptionKey) : t(s)("settings.permissionsDesc")), 1),
      e("label", Ud, [
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
          e("small", Td, n(t($)(t(d)("permissions"), "screen_watch", "settings.screenWatchDesc")), 1)
        ])
      ]),
      e("label", Ad, [
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
          e("small", Id, n(t($)(t(d)("permissions"), "computer_use", "settings.computerUseDesc")), 1)
        ])
      ]),
      e("div", Vd, [
        e("label", null, n(t(b)(t(d)("permissions"), "report_agent_host", "settings.reportAgentHost")), 1),
        O(e("input", {
          "onUpdate:modelValue": l[2] || (l[2] = (a) => p.value.report_agent_host = a),
          class: "input",
          placeholder: t($)(t(d)("permissions"), "report_agent_host", "settings.reportAgentHostDesc"),
          onChange: i
        }, null, 40, Nd), [
          [J, p.value.report_agent_host]
        ]),
        e("p", Rd, n(t($)(t(d)("permissions"), "report_agent_host", "settings.reportAgentHostDesc")), 1)
      ]),
      _.value ? (r(), u("div", Ld, n(_.value), 1)) : N("", !0),
      e("div", Od, [
        e("button", {
          class: "btn btn-primary",
          type: "button",
          onClick: i
        }, n(t(s)("settings.save")), 1)
      ])
    ]));
  }
}), zd = x(!1), Bd = x(!1);
x(!1);
const He = x(!1), qe = x(!0), _t = x(!0), Qe = x([]), jt = x(!1);
x(!1);
const rt = x(!1), zt = [];
function Fd(g) {
  const s = zt.splice(0, zt.length);
  for (const h of s)
    h.resolve();
}
async function Kd() {
  const g = window.fetch;
  try {
    const s = await g("/api/security/pin", { headers: { Accept: "application/json" } });
    if (!s.ok) return;
    const h = await s.json();
    He.value = !!h.configured, qe.value = h.enabled !== !1, _t.value = h.login_enabled !== !1, Qe.value = Array.isArray(h.pages) ? h.pages : [], rt.value = !h.configured && qe.value;
  } catch {
  }
}
async function Hd(g) {
  const s = window.fetch, h = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(g)
  }), d = await h.json().catch(() => null);
  if (!h.ok) throw new Error(d?.error || `HTTP ${h.status}`);
  typeof d?.enabled == "boolean" && (qe.value = d.enabled), typeof d?.login_enabled == "boolean" && (_t.value = d.login_enabled), Array.isArray(d?.pages) && (Qe.value = d.pages), He.value = !!d?.configured, rt.value = !d?.configured && qe.value;
}
async function jd() {
  const g = window.fetch, s = await g("/api/security/pin", { method: "DELETE" }), h = await s.json().catch(() => null);
  if (!s.ok) throw new Error(h?.error || `HTTP ${s.status}`);
  jt.value = !1, He.value = !1, rt.value = qe.value;
}
async function Yd(g) {
  const s = window.fetch, h = await s("/api/security/pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: g })
  }), d = await h.json().catch(() => null);
  if (!h.ok || !d?.configured) throw new Error(d?.error || `HTTP ${h.status}`);
  g.trim(), jt.value = !0, He.value = !0, rt.value = !1, Bd.value = !0, zd.value = !1, Fd();
}
const Xd = { class: "content-card security-panel" }, Jd = { class: "card-desc" }, Wd = { class: "sec-stack" }, qd = { class: "toggle-label" }, Gd = ["checked", "disabled"], Zd = { class: "helper-text" }, Qd = { class: "toggle-label" }, ec = ["checked", "disabled"], tc = { class: "helper-text" }, sc = { class: "sec-card" }, nc = { class: "sec-card-head" }, lc = { class: "sec-pin-grid" }, oc = { class: "sec-pin-col" }, ac = { class: "sec-pin-label" }, ic = { class: "sec-pin-col" }, rc = { class: "sec-pin-label" }, dc = { class: "sec-actions" }, cc = ["disabled"], uc = ["disabled"], pc = { class: "sec-card" }, hc = { class: "sec-card-head" }, vc = { class: "sec-chip" }, mc = { class: "helper-text" }, fc = { class: "page-list" }, gc = ["checked", "disabled", "onChange"], bc = { class: "page-text" }, _c = { class: "page-name" }, yc = {
  key: 0,
  class: "helper-text sec-msg"
}, kc = {
  key: 1,
  class: "sec-error"
}, wc = /* @__PURE__ */ be({
  __name: "SecurityPanel",
  setup(g) {
    const { t: s } = _e(), { confirm: h } = et(), d = Kt(), b = x(!1), $ = x(""), p = x(""), _ = x(""), C = x(""), i = Q(() => {
      const w = [], f = /* @__PURE__ */ new Set(), U = (E, H) => {
        !E || f.has(E) || (f.add(E), w.push({ path: E, label: H || E }));
      };
      for (const E of d.navItems) {
        const H = E.to || (E.id === "chat" ? "/" : "");
        if (!H) continue;
        let R = E.labelKey ? s(E.labelKey) : "";
        (!R || R === E.labelKey) && (R = E.label || E.id), U(H, R);
      }
      for (const E of d.routerPatches) {
        let H = E.titleKey ? s(E.titleKey) : "";
        (!H || H === E.titleKey) && (H = E.title || String(E.name || E.path)), U(E.path, H);
      }
      return w;
    });
    Ne(() => {
      Kd();
    });
    async function o(w) {
      b.value = !0, $.value = "", p.value = "";
      try {
        await Hd(w), $.value = s("settings.saved"), setTimeout(() => {
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
      const U = new Set(Qe.value);
      f ? U.add(w) : U.delete(w), o({ pages: [...U] });
    }
    async function c() {
      if (p.value = "", _.value.length !== 6) {
        p.value = s("wizard.pinTooShort");
        return;
      }
      if (_.value !== C.value) {
        p.value = s("wizard.pinMismatch");
        return;
      }
      b.value = !0;
      try {
        await Yd(_.value), _.value = "", C.value = "", $.value = s("settings.saved"), setTimeout(() => {
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
          await jd(), $.value = s("settings.saved"), setTimeout(() => {
            $.value = "";
          }, 1500);
        } catch (f) {
          p.value = f?.message || s("settings.permFailed");
        } finally {
          b.value = !1;
        }
      }
    }
    return (w, f) => (r(), u("div", Xd, [
      e("h2", null, n(t(s)("settings.tabs.security")), 1),
      e("p", Jd, n(t(s)("security.desc")), 1),
      e("div", Wd, [
        e("label", qd, [
          e("input", {
            type: "checkbox",
            checked: t(qe),
            disabled: b.value,
            onChange: f[0] || (f[0] = (U) => l("enabled", U.target.checked))
          }, null, 40, Gd),
          f[4] || (f[4] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, n(t(s)("security.pinSwitch")), 1),
            e("small", Zd, n(t(s)("security.pinSwitchHelp")), 1)
          ])
        ]),
        e("label", Qd, [
          e("input", {
            type: "checkbox",
            checked: t(_t),
            disabled: b.value,
            onChange: f[1] || (f[1] = (U) => l("login_enabled", U.target.checked))
          }, null, 40, ec),
          f[5] || (f[5] = e("span", { class: "toggle-slider" }, null, -1)),
          e("span", null, [
            e("strong", null, n(t(s)("security.loginSwitch")), 1),
            e("small", tc, n(t(s)("security.loginSwitchHelp")), 1)
          ])
        ]),
        e("section", sc, [
          e("div", nc, [
            e("strong", null, n(t(He) ? t(s)("security.changePin") : t(s)("auth.setupTitle")), 1),
            e("span", {
              class: oe(["sec-chip", { on: t(He) }])
            }, n(t(He) ? t(s)("security.pinSet") : t(s)("security.pinUnset")), 3)
          ]),
          e("div", lc, [
            e("div", oc, [
              e("span", ac, n(t(s)("auth.pinNew")), 1),
              we(t(Rt), {
                modelValue: _.value,
                "onUpdate:modelValue": f[2] || (f[2] = (U) => _.value = U)
              }, null, 8, ["modelValue"])
            ]),
            e("div", ic, [
              e("span", rc, n(t(s)("auth.pinConfirm")), 1),
              we(t(Rt), {
                modelValue: C.value,
                "onUpdate:modelValue": f[3] || (f[3] = (U) => C.value = U),
                onComplete: c
              }, null, 8, ["modelValue"])
            ])
          ]),
          e("div", dc, [
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: b.value,
              onClick: c
            }, n(t(s)("auth.savePin")), 9, cc),
            t(He) ? (r(), u("button", {
              key: 0,
              class: "btn btn-tonal",
              type: "button",
              disabled: b.value,
              onClick: v
            }, n(t(s)("security.removePin")), 9, uc)) : N("", !0)
          ])
        ]),
        e("section", pc, [
          e("div", hc, [
            e("strong", null, n(t(s)("security.pages")), 1),
            e("span", vc, n(t(s)("security.pageCount", { n: t(Qe).length })), 1)
          ]),
          e("p", mc, n(t(s)("security.pagesHelp")), 1),
          e("div", fc, [
            (r(!0), u(Z, null, de(i.value, (U) => (r(), u("label", {
              key: U.path,
              class: "page-item"
            }, [
              e("input", {
                type: "checkbox",
                checked: t(Qe).includes(U.path),
                disabled: b.value,
                onChange: (E) => a(U.path, E.target.checked)
              }, null, 40, gc),
              f[6] || (f[6] = e("span", { class: "toggle-slider" }, null, -1)),
              e("span", bc, [
                e("span", _c, n(U.label), 1),
                e("code", null, n(U.path), 1)
              ])
            ]))), 128))
          ])
        ])
      ]),
      $.value ? (r(), u("p", yc, n($.value), 1)) : N("", !0),
      p.value ? (r(), u("p", kc, n(p.value), 1)) : N("", !0)
    ]));
  }
}), $c = /* @__PURE__ */ Ae(wc, [["__scopeId", "data-v-8a0a3d8d"]]), Sc = { class: "mcp-panel" }, Cc = { class: "mcp-head" }, Pc = { class: "subtitle" }, xc = { class: "mcp-actions" }, Mc = ["disabled"], Ec = {
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
}, Ic = { class: "mcp-row" }, Vc = { class: "mcp-field grow" }, Nc = ["onUpdate:modelValue", "readonly"], Rc = { class: "mcp-field" }, Lc = ["onUpdate:modelValue", "onChange"], Oc = { value: "builtin" }, Dc = { class: "mcp-toggle" }, zc = ["onUpdate:modelValue"], Bc = ["onClick"], Fc = { class: "mcp-field" }, Kc = ["onUpdate:modelValue"], Hc = { class: "mcp-field" }, jc = ["onUpdate:modelValue"], Yc = { class: "mcp-field" }, Xc = ["onUpdate:modelValue"], Jc = { class: "mcp-field" }, Wc = ["onUpdate:modelValue"], qc = { class: "builtin-note" }, Gc = { class: "mail-grid" }, Zc = { class: "mail-col" }, Qc = { class: "mail-label" }, eu = { class: "mcp-field" }, tu = ["onUpdate:modelValue"], su = { class: "mail-row" }, nu = { class: "mcp-field" }, lu = ["onUpdate:modelValue"], ou = { class: "mcp-toggle" }, au = ["onUpdate:modelValue"], iu = { class: "mcp-field" }, ru = ["onUpdate:modelValue"], du = { class: "mcp-field" }, cu = ["onUpdate:modelValue"], uu = { class: "mail-col" }, pu = { class: "mail-label" }, hu = { class: "mcp-field" }, vu = ["onUpdate:modelValue"], mu = { class: "mail-row" }, fu = { class: "mcp-field" }, gu = ["onUpdate:modelValue"], bu = { class: "mcp-toggle" }, _u = ["onUpdate:modelValue"], yu = { class: "mcp-field" }, ku = ["onUpdate:modelValue"], wu = { class: "mcp-field" }, $u = ["onUpdate:modelValue"], Su = { class: "mail-row" }, Cu = { class: "mcp-field grow" }, Pu = ["onUpdate:modelValue", "placeholder"], xu = { class: "mcp-field" }, Mu = ["onUpdate:modelValue"], Eu = {
  key: 0,
  class: "hint"
}, Uu = /* @__PURE__ */ be({
  __name: "McpPanel",
  setup(g) {
    const { t: s } = _e(), h = x([]), d = x(!1), b = x(!1), $ = x(""), p = x(!1);
    function _() {
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
      const w = v?.transport === "http" ? "http" : v?.transport === "builtin" || v?.builtin ? "builtin" : "stdio", f = v?.options?.imap || {}, U = v?.options?.smtp || {};
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
        smtpHost: String(U.host || ""),
        smtpPort: Number(U.port) || 465,
        smtpSecure: U.secure !== !1,
        smtpUser: String(U.user || ""),
        smtpPassword: String(U.password || ""),
        from: String(U.from || ""),
        fromName: String(U.fromName || "0KAY")
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
`).map((U) => U.trim()).filter(Boolean);
        f.length && (w.args = f);
      }
      return w;
    }
    function o(v) {
      v.transport === "builtin" && (v.id = "mail");
    }
    function l() {
      const v = _();
      h.value.some((w) => w.transport === "builtin") && (v.transport = "stdio"), h.value.push(v);
    }
    async function a() {
      d.value = !0, $.value = "";
      try {
        const w = (await Ke("/api/settings/mcp"))?.values?.servers;
        let f = [];
        if (typeof w == "string" && w.trim())
          try {
            const U = JSON.parse(w);
            Array.isArray(U) && (f = U);
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
            const U = String(f.id || "").trim();
            return !U || v.has(U) ? !1 : (v.add(U), !0);
          });
          await lt("/api/settings/mcp", { values: { servers: JSON.stringify(w) } }), p.value = !0, setTimeout(() => {
            p.value = !1;
          }, 2e3);
        } catch (v) {
          $.value = v?.message || String(v);
        } finally {
          b.value = !1;
        }
      }
    }
    return Ne(a), (v, w) => (r(), u("div", Sc, [
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
            disabled: b.value,
            onClick: c
          }, n(b.value ? t(s)("common.saving") : t(s)("common.save")), 9, Mc)
        ])
      ]),
      $.value ? (r(), u("div", Ec, n($.value), 1)) : N("", !0),
      p.value ? (r(), u("div", Uc, n(t(s)("settings.saved")), 1)) : N("", !0),
      d.value ? (r(), u("p", Tc, n(t(s)("common.loading")), 1)) : (r(), u("div", Ac, [
        (r(!0), u(Z, null, de(h.value, (f, U) => (r(), u("article", {
          key: U,
          class: oe(["mcp-card", { "is-builtin": f.transport === "builtin" }])
        }, [
          e("div", Ic, [
            e("label", Vc, [
              w[0] || (w[0] = e("span", null, "ID", -1)),
              O(e("input", {
                "onUpdate:modelValue": (E) => f.id = E,
                readonly: f.transport === "builtin",
                placeholder: "filesystem"
              }, null, 8, Nc), [
                [J, f.id]
              ])
            ]),
            e("label", Rc, [
              e("span", null, n(t(s)("mcp.transport")), 1),
              O(e("select", {
                "onUpdate:modelValue": (E) => f.transport = E,
                onChange: (E) => o(f)
              }, [
                w[1] || (w[1] = e("option", { value: "stdio" }, "stdio", -1)),
                w[2] || (w[2] = e("option", { value: "http" }, "http", -1)),
                e("option", Oc, n(t(s)("mcp.builtinMail")), 1)
              ], 40, Lc), [
                [as, f.transport]
              ])
            ]),
            e("label", Dc, [
              O(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": (E) => f.enabled = E
              }, null, 8, zc), [
                [Ce, f.enabled]
              ]),
              e("span", null, n(t(s)("mcp.enabled")), 1)
            ]),
            e("button", {
              class: "mcp-remove",
              type: "button",
              onClick: (E) => h.value.splice(U, 1)
            }, n(t(s)("common.delete")), 9, Bc)
          ]),
          f.transport === "stdio" ? (r(), u(Z, { key: 0 }, [
            e("label", Fc, [
              e("span", null, n(t(s)("mcp.command")), 1),
              O(e("input", {
                "onUpdate:modelValue": (E) => f.command = E,
                placeholder: "npx"
              }, null, 8, Kc), [
                [J, f.command]
              ])
            ]),
            e("label", Hc, [
              e("span", null, n(t(s)("mcp.args")), 1),
              O(e("textarea", {
                "onUpdate:modelValue": (E) => f.argsText = E,
                rows: "2",
                placeholder: `-y
@modelcontextprotocol/server-filesystem
C:\\work`
              }, null, 8, jc), [
                [J, f.argsText]
              ])
            ])
          ], 64)) : f.transport === "http" ? (r(), u(Z, { key: 1 }, [
            e("label", Yc, [
              w[3] || (w[3] = e("span", null, "URL", -1)),
              O(e("input", {
                "onUpdate:modelValue": (E) => f.url = E,
                placeholder: "https://example.com/mcp"
              }, null, 8, Xc), [
                [J, f.url]
              ])
            ]),
            e("label", Jc, [
              w[4] || (w[4] = e("span", null, "Headers（JSON）", -1)),
              O(e("textarea", {
                "onUpdate:modelValue": (E) => f.headersText = E,
                rows: "2",
                placeholder: '{ "Authorization": "Bearer ..." }'
              }, null, 8, Wc), [
                [J, f.headersText]
              ])
            ])
          ], 64)) : (r(), u(Z, { key: 2 }, [
            e("p", qc, n(t(s)("mcp.builtinNote")), 1),
            e("div", Gc, [
              e("div", Zc, [
                e("p", Qc, n(t(s)("mcp.imap")), 1),
                e("label", eu, [
                  e("span", null, n(t(s)("mcp.host")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (E) => f.imapHost = E,
                    placeholder: "imap.example.com",
                    autocomplete: "off"
                  }, null, 8, tu), [
                    [J, f.imapHost]
                  ])
                ]),
                e("div", su, [
                  e("label", nu, [
                    e("span", null, n(t(s)("mcp.port")), 1),
                    O(e("input", {
                      "onUpdate:modelValue": (E) => f.imapPort = E,
                      type: "number",
                      placeholder: "993"
                    }, null, 8, lu), [
                      [
                        J,
                        f.imapPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", ou, [
                    O(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (E) => f.imapSsl = E
                    }, null, 8, au), [
                      [Ce, f.imapSsl]
                    ]),
                    w[5] || (w[5] = e("span", null, "SSL", -1))
                  ])
                ]),
                e("label", iu, [
                  e("span", null, n(t(s)("mcp.username")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (E) => f.imapUser = E,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, ru), [
                    [J, f.imapUser]
                  ])
                ]),
                e("label", du, [
                  e("span", null, n(t(s)("mcp.password")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (E) => f.imapPassword = E,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, cu), [
                    [J, f.imapPassword]
                  ])
                ])
              ]),
              e("div", uu, [
                e("p", pu, n(t(s)("mcp.smtp")), 1),
                e("label", hu, [
                  e("span", null, n(t(s)("mcp.host")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (E) => f.smtpHost = E,
                    placeholder: "smtp.example.com",
                    autocomplete: "off"
                  }, null, 8, vu), [
                    [J, f.smtpHost]
                  ])
                ]),
                e("div", mu, [
                  e("label", fu, [
                    e("span", null, n(t(s)("mcp.port")), 1),
                    O(e("input", {
                      "onUpdate:modelValue": (E) => f.smtpPort = E,
                      type: "number",
                      placeholder: "465"
                    }, null, 8, gu), [
                      [
                        J,
                        f.smtpPort,
                        void 0,
                        { number: !0 }
                      ]
                    ])
                  ]),
                  e("label", bu, [
                    O(e("input", {
                      type: "checkbox",
                      "onUpdate:modelValue": (E) => f.smtpSecure = E
                    }, null, 8, _u), [
                      [Ce, f.smtpSecure]
                    ]),
                    w[6] || (w[6] = e("span", null, "SSL（465）", -1))
                  ])
                ]),
                e("label", yu, [
                  e("span", null, n(t(s)("mcp.username")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (E) => f.smtpUser = E,
                    placeholder: "user@example.com",
                    autocomplete: "off"
                  }, null, 8, ku), [
                    [J, f.smtpUser]
                  ])
                ]),
                e("label", wu, [
                  e("span", null, n(t(s)("mcp.password")), 1),
                  O(e("input", {
                    "onUpdate:modelValue": (E) => f.smtpPassword = E,
                    type: "password",
                    placeholder: "••••••••",
                    autocomplete: "new-password"
                  }, null, 8, $u), [
                    [J, f.smtpPassword]
                  ])
                ]),
                e("div", Su, [
                  e("label", Cu, [
                    e("span", null, n(t(s)("mcp.from")), 1),
                    O(e("input", {
                      "onUpdate:modelValue": (E) => f.from = E,
                      placeholder: t(s)("mcp.fromPlaceholder"),
                      autocomplete: "off"
                    }, null, 8, Pu), [
                      [J, f.from]
                    ])
                  ]),
                  e("label", xu, [
                    e("span", null, n(t(s)("mcp.fromName")), 1),
                    O(e("input", {
                      "onUpdate:modelValue": (E) => f.fromName = E,
                      placeholder: "0KAY",
                      autocomplete: "off"
                    }, null, 8, Mu), [
                      [J, f.fromName]
                    ])
                  ])
                ])
              ])
            ])
          ], 64))
        ], 2))), 128)),
        h.value.length ? N("", !0) : (r(), u("p", Eu, n(t(s)("mcp.emptyServers")), 1))
      ]))
    ]));
  }
}), Tu = /* @__PURE__ */ Ae(Uu, [["__scopeId", "data-v-60e55840"]]), Au = { class: "content-card danger" }, Iu = { class: "card-desc" }, Vu = { class: "danger-box" }, Nu = ["disabled"], Ru = /* @__PURE__ */ be({
  __name: "DangerPanel",
  setup(g) {
    const { t: s } = _e(), h = it(), d = Ht(), { confirm: b } = et(), $ = x(!1);
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
    return (_, C) => (r(), u("div", Au, [
      e("h2", null, n(t(s)("settings.tabs.danger")), 1),
      e("p", Iu, n(t(s)("settings.resetDesc")), 1),
      e("div", Vu, [
        e("div", null, [
          e("strong", null, n(t(s)("settings.reset")), 1),
          e("p", null, n(t(s)("settings.resetWarning")), 1)
        ]),
        e("button", {
          class: "btn btn-danger",
          disabled: $.value,
          onClick: p
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
}, Du = /* @__PURE__ */ be({
  __name: "PluginModulePane",
  props: {
    module: {}
  },
  setup(g) {
    const { t: s } = _e(), h = g, d = Nt(null), b = Nt("");
    let $ = 0;
    return We(
      () => h.module,
      async (p) => {
        if (!p) {
          d.value = null, b.value = "";
          return;
        }
        const _ = ++$;
        try {
          const C = await import(
            /* @vite-ignore */
            p
          );
          if (_ !== $) return;
          d.value = C?.default || C, b.value = "";
        } catch (C) {
          if (_ !== $) return;
          d.value = null, b.value = C?.message || String(C);
        }
      },
      { immediate: !0 }
    ), (p, _) => d.value ? (r(), ke(is(d.value), { key: 0 })) : b.value ? (r(), u("div", Lu, n(b.value), 1)) : (r(), u("div", Ou, n(t(s)("pluginPane.loading")), 1));
  }
}), zu = /* @__PURE__ */ Ae(Du, [["__scopeId", "data-v-32ca9ff2"]]), Bu = { class: "pp-head" }, Fu = ["aria-label", "disabled"], Ku = { class: "pp-roots" }, Hu = ["onClick"], ju = ["placeholder"], Yu = ["aria-busy"], Xu = {
  key: 0,
  class: "pp-empty"
}, Ju = {
  key: 1,
  class: "pp-empty pp-error"
}, Wu = {
  key: 2,
  class: "pp-empty"
}, qu = ["title", "onClick"], Gu = { class: "pp-name" }, Zu = ["title"], Qu = { class: "pp-foot" }, ep = ["disabled"], tp = ["disabled"], sp = /* @__PURE__ */ be({
  __name: "PathPicker",
  props: {
    open: { type: Boolean },
    initial: {},
    title: {}
  },
  emits: ["update:open", "pick"],
  setup(g, { emit: s }) {
    const h = g, d = s, { t: b } = _e(), $ = x(""), p = x(""), _ = x([]), C = x([]), i = x(!1), o = x(""), l = x(""), a = x(!1);
    let c = "";
    async function v(R) {
      i.value = !0, o.value = "";
      try {
        const V = await fetch(`/api/agent/workspace?path=${encodeURIComponent(R || "")}`);
        if (!V.ok) {
          const T = await V.json().catch(() => ({}));
          o.value = T?.error || `HTTP ${V.status}`;
          return;
        }
        const M = await V.json();
        $.value = String(M?.path || ""), p.value = String(M?.parent || ""), _.value = Array.isArray(M?.roots) ? M.roots.map(String) : [], C.value = Array.isArray(M?.directories) ? M.directories.map((T) => ({ name: String(T?.name || ""), path: String(T?.path || "") })) : [], l.value = $.value, c = $.value;
      } catch (V) {
        o.value = V instanceof Error ? V.message : String(V);
      } finally {
        i.value = !1;
      }
    }
    We(
      () => h.open,
      (R) => {
        if (!R) return;
        o.value = "";
        const V = (h.initial || "").trim() || c;
        l.value = V, v(V);
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
    function U(R) {
      v(R.path);
    }
    function E() {
      p.value && p.value !== $.value && v(p.value);
    }
    async function H() {
      if (!a.value) {
        a.value = !0, o.value = "";
        try {
          const R = await fetch(`/api/agent/pick-folder?title=${encodeURIComponent(h.title || b("settings.pathPickTitle"))}`);
          if (R.ok) {
            const V = await R.json().catch(() => ({}));
            V?.path && (d("pick", String(V.path)), w());
          }
        } catch (R) {
          o.value = R instanceof Error ? R.message : String(R);
        } finally {
          a.value = !1;
        }
      }
    }
    return (R, V) => (r(), ke(t(bs), {
      open: g.open,
      title: g.title || t(b)("settings.pathPickTitle"),
      "on-dismiss": w,
      "initial-focus": "first",
      "panel-class": "path-picker-panel"
    }, {
      default: nt(() => [
        e("header", Bu, [
          e("h2", null, n(g.title || t(b)("settings.pathPickTitle")), 1),
          e("button", {
            class: "pp-icon",
            type: "button",
            "aria-label": t(b)("settings.pathUp"),
            disabled: i.value,
            onClick: E
          }, "↑", 8, Fu)
        ]),
        e("div", Ku, [
          (r(!0), u(Z, null, de(_.value, (M) => (r(), u("button", {
            key: M,
            class: oe(["pp-root", { "is-active": $.value === M }]),
            type: "button",
            onClick: (T) => v(M)
          }, n(M), 11, Hu))), 128))
        ]),
        O(e("input", {
          "onUpdate:modelValue": V[0] || (V[0] = (M) => l.value = M),
          class: "input pp-path",
          placeholder: t(b)("settings.pathPlaceholder"),
          spellcheck: "false",
          onKeydown: V[1] || (V[1] = gt(Fe((M) => v(l.value), ["prevent"]), ["enter"]))
        }, null, 40, ju), [
          [J, l.value]
        ]),
        e("div", {
          class: "pp-list",
          role: "listbox",
          "aria-busy": i.value
        }, [
          i.value ? (r(), u("p", Xu, n(t(b)("settings.pathLoading")), 1)) : o.value ? (r(), u("p", Ju, n(o.value), 1)) : C.value.length ? (r(!0), u(Z, { key: 3 }, de(C.value, (M) => (r(), u("button", {
            key: M.path,
            class: "pp-item",
            type: "button",
            role: "option",
            title: M.path,
            onClick: (T) => U(M)
          }, [
            V[2] || (V[2] = e("span", {
              class: "pp-folder",
              "aria-hidden": "true"
            }, "▸", -1)),
            e("span", Gu, n(M.name), 1)
          ], 8, qu))), 128)) : (r(), u("p", Wu, n(t(b)("settings.pathEmpty")), 1))
        ], 8, Yu),
        e("p", {
          class: "pp-current",
          title: $.value
        }, n(t(b)("settings.pathSelected", { path: $.value || l.value || "—" })), 9, Zu),
        e("footer", Qu, [
          e("button", {
            class: "btn btn-text",
            type: "button",
            disabled: a.value,
            onClick: H
          }, n(a.value ? t(b)("settings.pathNativeBusy") : t(b)("settings.pathNative")), 9, ep),
          V[3] || (V[3] = e("span", { class: "pp-spacer" }, null, -1)),
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
          }, n(t(b)("settings.pathUse")), 9, tp)
        ])
      ]),
      _: 1
    }, 8, ["open", "title"]));
  }
}), np = /* @__PURE__ */ Ae(sp, [["__scopeId", "data-v-580db486"]]), ot = x([]);
let lp = 0;
const ft = /* @__PURE__ */ new Map();
function op(g) {
  const s = ft.get(g);
  s && clearTimeout(s), ft.delete(g), ot.value = ot.value.filter((h) => h.id !== g);
}
function Bt(g, s = "info", h) {
  const d = {
    id: ++lp,
    kind: s,
    message: g,
    duration: s === "error" ? 6500 : 3500
  };
  return ot.value = [...ot.value.slice(-4), d], ft.set(d.id, setTimeout(() => op(d.id), d.duration)), d.id;
}
function ap() {
  const { t: g } = _e(), { confirm: s } = et(), h = it(), d = _s(), b = Kt(), $ = ks(), p = Ht(), _ = Q(() => b.settingsTabs.map((A) => ({
    id: A.id,
    icon: A.icon || "chip"
  }))), C = Q(() => {
    const A = new Set(b.settingsTabs.map((X) => X.id)), D = new Set(b.removedSettingsIds);
    return d.sections.filter((X) => X.id !== "permissions" && !A.has(X.id) && !D.has(X.id)).map((X) => ({ id: X.id, icon: X.icon || "lock" }));
  }), i = Q(() => [..._.value, ...C.value]), o = Q(() => [
    { id: "core", label: g("settings.groupCore"), tabs: _.value },
    { id: "plugins", label: g("settings.groupPlugins"), tabs: C.value }
  ].filter((A) => A.tabs.length)), l = x($.query.tab || "general"), a = x(!1), c = x([]), v = x(""), w = x({}), f = x(""), U = x("ok"), E = x(!1), H = x(!1), R = x(!1), V = x(!1), M = x("");
  function T() {
    M.value = "", R.value = !0;
  }
  function G() {
    V.value || (R.value = !1);
  }
  async function me() {
    if (!V.value) {
      V.value = !0, M.value = "";
      try {
        const A = await fetch("/api/agent/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: g("settings.evolveSessionTitle") })
        });
        if (!A.ok) throw new Error(`HTTP ${A.status}`);
        const D = await A.json(), X = D?.session_id || D?.id;
        if (!X) throw new Error(g("settings.evolveNoSession"));
        const W = await fetch("/api/agent/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: X,
            prompt: g("settings.evolvePrompt"),
            agent_type: "general"
          })
        });
        if (!W.ok) throw new Error(`HTTP ${W.status}`);
        R.value = !1, M.value = g("settings.evolveStarted");
      } catch (A) {
        M.value = A instanceof Error ? A.message : String(A);
      } finally {
        V.value = !1;
      }
    }
  }
  const se = x(""), z = x(!1), Y = x([]), K = Q(() => g("settings.modelAuto")), j = Q(() => [
    { value: "", label: K.value },
    ...Y.value.map((A) => ({ value: A, label: A }))
  ]);
  async function B() {
    try {
      const A = await fetch("/api/models");
      if (!A.ok) return;
      const D = await A.json();
      Y.value = Array.from(new Set((D.models || []).map((X) => String(X.id || "")).filter(Boolean)));
    } catch {
    }
  }
  async function Ie(A) {
    H.value = !0, se.value = "";
    try {
      const D = await fetch(`/api/settings/${A}/test`, { method: "POST" }), X = D.headers.get("content-type") || "";
      if (D.ok && X.startsWith("audio")) {
        const W = URL.createObjectURL(await D.blob());
        try {
          await new Audio(W).play();
        } catch {
        }
        window.dispatchEvent(new CustomEvent("live2d-speak", { detail: { url: W } })), se.value = g("settings.testSuccess");
      } else {
        const W = await D.json().catch(() => ({}));
        se.value = W.error || `HTTP ${D.status}`;
      }
    } catch (D) {
      se.value = D instanceof Error ? D.message : String(D);
    } finally {
      H.value = !1;
    }
  }
  const { tabMeta: Pe, isBuiltinTab: ce, isPluginSection: Ve, tabLabel: ne, fieldLabel: he, fieldHelp: Re, pluginSection: $e } = bt(), ve = x(""), xe = Q({
    get: () => ve.value !== "",
    set: (A) => {
      A || (ve.value = "");
    }
  }), Se = Q(() => $e(l.value)?.fields.find((D) => D.key === ve.value)?.label || ""), ae = Q(() => String(w.value[l.value]?.[ve.value] ?? ""));
  function fe(A) {
    const D = ve.value;
    D && (w.value = {
      ...w.value,
      [l.value]: { ...w.value[l.value], [D]: A }
    });
  }
  const q = Q(() => ce(l.value) ? null : Pe(l.value)?.module || null);
  function L(A) {
    if (Pe(A)?.fields?.length && !ce(A)) {
      ie(A);
      return;
    }
    const X = $e(A);
    if (!X) return;
    const W = {};
    for (const ue of X.fields)
      ue.type !== "note" && (ue.type === "bool" ? W[ue.key] = ue.default_value === "true" || ue.default_value === "1" : ue.type === "number" ? W[ue.key] = Number(ue.default_value || 0) : W[ue.key] = ue.default_value || "");
    const ye = d.values[A] || {}, ge = { ...W };
    for (const ue of X.fields) {
      if (!(ue.key in ye)) continue;
      const ze = ye[ue.key];
      ue.type === "bool" ? ge[ue.key] = ze === !0 || ze === "true" || ze === 1 || ze === "1" : ge[ue.key] = ze;
    }
    w.value = {
      ...w.value,
      [A]: ge
    };
  }
  async function ie(A) {
    const D = Pe(A);
    if (!D?.fields?.length) return;
    const X = {};
    for (const W of D.fields)
      W.type === "bool" ? X[W.key] = W.default_value === "true" || W.default_value === "1" : W.type === "number" ? X[W.key] = Number(W.default_value || 0) : X[W.key] = W.default_value || "";
    if (D.loadApi)
      try {
        const W = await fetch(D.loadApi);
        if (W.ok) {
          const ye = await W.json();
          for (const ge of D.fields) {
            if (!(ge.key in ye)) continue;
            const ue = ye[ge.key];
            ge.type === "bool" ? X[ge.key] = ue === !0 || ue === "true" || ue === 1 || ue === "1" : X[ge.key] = ue;
          }
        }
      } catch {
      }
    w.value = { ...w.value, [A]: X };
  }
  async function Le(A) {
    const D = Pe(A);
    if (!E.value) {
      E.value = !0, f.value = "";
      try {
        const X = w.value[A] || {};
        if (D?.saveApi) {
          const W = await fetch(D.saveApi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(X)
          });
          if (!W.ok) throw new Error(String(W.status));
        }
        f.value = g("settings.saved"), U.value = "ok", setTimeout(() => {
          f.value = "";
        }, 3e3);
      } catch {
        f.value = g("settings.permFailed"), U.value = "error";
      } finally {
        E.value = !1;
      }
    }
  }
  async function Je(A) {
    if (!E.value) {
      E.value = !0, f.value = "";
      try {
        const D = new Set(($e(A)?.fields || []).filter((W) => W.type === "note").map((W) => W.key)), X = Object.fromEntries(
          Object.entries(w.value[A] || {}).filter(([W]) => !D.has(W))
        );
        await d.saveValues(A, X), f.value = g("settings.saved"), U.value = "ok", setTimeout(() => {
          f.value = "";
        }, 3e3);
      } catch {
        f.value = g("settings.permFailed"), U.value = "error";
      } finally {
        E.value = !1;
      }
    }
  }
  async function Me() {
    try {
      const A = await fetch("/api/live2d");
      if (A.ok) {
        const D = await A.json();
        c.value = D.models || [];
      }
    } catch {
      c.value = [];
    }
  }
  async function Ge(A) {
    if (await s({
      title: g("settings.live2d"),
      message: g("settings.deleteModelConfirm", { label: A.label }),
      confirmLabel: g("common.delete"),
      danger: !0
    }))
      try {
        const X = await fetch(`/api/live2d/${encodeURIComponent(A.id)}`, { method: "DELETE" });
        if (!X.ok) throw new Error(await X.text());
        const W = await X.json();
        c.value = W.models || [];
        const ye = A.url.slice(0, A.url.indexOf("/", 15) + 1);
        h.live2d.modelUrl.startsWith(ye) && (h.live2d.modelUrl = "", h.live2d.enabled = !1, h.saveToStorage()), await De(), v.value = g("settings.modelDeleted"), window.dispatchEvent(new Event("live2d-models-changed"));
      } catch (X) {
        v.value = X.message;
      }
  }
  async function De() {
    h.saveToStorage();
    const A = await fetch("/api/settings/live2d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { enabled: h.live2d.enabled, model_url: h.live2d.modelUrl } }) });
    if (!A.ok) throw new Error(await A.text());
  }
  async function y() {
    if (!z.value) {
      z.value = !0, v.value = "";
      try {
        await De(), v.value = g("settings.saved"), setTimeout(() => {
          v.value === g("settings.saved") && (v.value = "");
        }, 3e3);
      } catch (A) {
        v.value = A.message, Bt(g("settings.permFailed"), "error");
      } finally {
        z.value = !1;
      }
    }
  }
  async function P(A) {
    if (!(!A || A.length === 0)) {
      v.value = "";
      try {
        const D = new FormData(), X = [];
        for (const ge of Array.from(A)) {
          const ue = ge.webkitRelativePath || ge.name;
          X.push(ue), D.append("files", ge, ge.name);
        }
        D.append("paths", JSON.stringify(X));
        const W = await fetch("/api/live2d", { method: "POST", body: D });
        if (!W.ok) throw new Error(await W.text());
        const ye = await W.json();
        v.value = g("settings.uploadOk"), ye?.models ? c.value = ye.models : await Me(), ye?.model_url && (h.live2d.modelUrl = ye.model_url, h.live2d.enabled = !0, h.saveToStorage(), await De(), window.dispatchEvent(new Event("live2d-models-changed")));
      } catch (D) {
        v.value = `${g("settings.uploadFail")}：${D.message}`;
      }
    }
  }
  Ne(async () => {
    h.loadFromStorage(), Me(), B(), await d.fetchSections();
    for (const A of d.sections) L(A.id);
    d.sections.length && !i.value.some((A) => A.id === l.value) && !ce(l.value) && (l.value = "general");
  });
  function S(A) {
    l.value = A, ce(A) || L(A), p.replace({ query: { tab: A } });
  }
  function te() {
    if (h.saveToStorage(), l.value === "live2d") {
      De().then(() => {
        a.value = !0, setTimeout(() => {
          a.value = !1;
        }, 1500);
      }).catch((A) => {
        v.value = A.message, Bt(g("settings.permFailed"), "error");
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
    tabs: _,
    pluginOnlyTabs: C,
    allTabs: i,
    navGroups: o,
    activeTab: l,
    saved: a,
    uploadedModels: c,
    uploadMsg: v,
    sectionDrafts: w,
    sectionMsg: f,
    sectionMsgKind: U,
    sectionSaving: E,
    sectionTesting: H,
    evolveDialog: R,
    evolveBusy: V,
    evolveMsg: M,
    openEvolveDialog: T,
    closeEvolveDialog: G,
    confirmEvolve: me,
    sectionTestMsg: se,
    live2dSaving: z,
    availableModels: Y,
    modelAutoLabel: K,
    modelOptions: j,
    loadAvailableModels: B,
    testPluginSection: Ie,
    pickerField: ve,
    pickerOpen: xe,
    pickerTitle: Se,
    pickerInitial: ae,
    applyPickedPath: fe,
    moduleTab: q,
    loadSectionDraft: L,
    loadPatchFields: ie,
    savePatchFields: Le,
    saveSection: Je,
    loadUploadedModels: Me,
    deleteModel: Ge,
    saveLive2D: De,
    saveLive2DNow: y,
    onFolderSelected: P,
    selectTab: S,
    save: te,
    t: g,
    confirm: s,
    tabMeta: Pe,
    isBuiltinTab: ce,
    isPluginSection: Ve,
    tabLabel: ne,
    fieldLabel: he,
    fieldHelp: Re,
    pluginSection: $e
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
  class: "helper-text"
}, Ip = {
  key: 0,
  class: "helper-text"
}, Vp = { class: "actions-row" }, Np = ["disabled"], Rp = {
  key: 0,
  class: "card-desc"
}, Lp = {
  key: 1,
  class: "card-desc"
}, Op = { class: "actions-row" }, Dp = ["disabled"], zp = {
  key: "unknown",
  class: "content-card tab-unknown"
}, Bp = ["aria-label"], Fp = { class: "dialog-card" }, Kp = { class: "helper-text" }, Hp = { class: "helper-text" }, jp = {
  key: 0,
  class: "helper-text msg-error"
}, Yp = { class: "actions-row" }, Xp = ["disabled"], Jp = ["disabled"], eh = /* @__PURE__ */ be({
  __name: "SettingsPage",
  setup(g) {
    const {
      wizard: s,
      navGroups: h,
      activeTab: d,
      saved: b,
      uploadedModels: $,
      uploadMsg: p,
      sectionDrafts: _,
      sectionMsg: C,
      sectionMsgKind: i,
      sectionSaving: o,
      sectionTesting: l,
      sectionTestMsg: a,
      live2dSaving: c,
      availableModels: v,
      modelOptions: w,
      testPluginSection: f,
      evolveDialog: U,
      evolveBusy: E,
      evolveMsg: H,
      openEvolveDialog: R,
      closeEvolveDialog: V,
      confirmEvolve: M,
      pickerField: T,
      pickerOpen: G,
      pickerTitle: me,
      pickerInitial: se,
      applyPickedPath: z,
      moduleTab: Y,
      savePatchFields: K,
      saveSection: j,
      deleteModel: B,
      saveLive2DNow: Ie,
      onFolderSelected: Pe,
      selectTab: ce,
      save: Ve,
      t: ne,
      tabMeta: he,
      isBuiltinTab: Re,
      isPluginSection: $e,
      tabLabel: ve,
      fieldLabel: xe,
      fieldHelp: Se,
      pluginSection: ae
    } = ap();
    return (fe, q) => (r(), u("div", ip, [
      e("header", rp, [
        e("div", null, [
          e("h1", null, n(t(ne)("settings.title")), 1),
          e("p", dp, n(t(ne)("settings.pageDesc")), 1)
        ]),
        t(d) === "persona" || t(d) === "live2d" ? (r(), u("button", {
          key: 0,
          class: "btn btn-primary",
          onClick: q[0] || (q[0] = //@ts-ignore
          (...L) => t(Ve) && t(Ve)(...L))
        }, [
          t(b) ? (r(), u("span", cp, n(t(ne)("settings.saved")), 1)) : (r(), u("span", up, n(t(ne)("settings.save")), 1))
        ])) : N("", !0)
      ]),
      e("div", pp, [
        e("nav", hp, [
          (r(!0), u(Z, null, de(t(h), (L) => (r(), u(Z, {
            key: L.id
          }, [
            e("p", vp, n(L.label), 1),
            (r(!0), u(Z, null, de(L.tabs, (ie) => (r(), u("button", {
              key: ie.id,
              class: oe(["nav-item", { active: t(d) === ie.id }]),
              "aria-current": t(d) === ie.id ? "true" : void 0,
              "data-tab-id": ie.id,
              title: t(ve)(ie.id),
              "aria-label": t(ve)(ie.id),
              onClick: (Le) => t(ce)(ie.id)
            }, [
              q[11] || (q[11] = e("span", { class: "nav-indicator" }, null, -1)),
              e("span", fp, [
                we(t(ys), {
                  name: ie.icon || "chip",
                  size: 20
                }, null, 8, ["name"])
              ]),
              e("span", gp, n(t(ve)(ie.id)), 1)
            ], 10, mp))), 128))
          ], 64))), 128))
        ]),
        e("section", bp, [
          we(rs, {
            name: "tab",
            mode: "out-in"
          }, {
            default: nt(() => [
              t(d) === "general" ? (r(), ke(rr, { key: "general" })) : t(d) === "connection" ? (r(), ke(dd, { key: "connection" })) : t(d) === "provider" ? (r(), u("div", _p, [
                we(Xi),
                t(ae)("provider")?.fields?.length ? (r(), u("div", yp, [
                  e("h3", null, n(t(ae)("provider").label), 1),
                  t(ae)("provider").description ? (r(), u("p", kp, n(t(ae)("provider").description), 1)) : N("", !0),
                  (r(!0), u(Z, null, de(t(ae)("provider").fields, (L) => (r(), ke(mt, {
                    key: L.key,
                    field: L,
                    label: L.label,
                    help: L.help,
                    "model-value": t(_).provider?.[L.key],
                    "section-id": "provider",
                    "model-options": t(w),
                    "available-models": t(v),
                    "onUpdate:modelValue": (ie) => _.value = { ...t(_), provider: { ...t(_).provider, [L.key]: ie } },
                    onBrowse: (ie) => T.value = L.key
                  }, null, 8, ["field", "label", "help", "model-value", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                  t(C) ? (r(), u("div", {
                    key: 1,
                    class: oe(["helper-text", t(i) === "error" ? "msg-error" : "msg-success"]),
                    role: "status"
                  }, n(t(C)), 3)) : N("", !0),
                  e("div", wp, [
                    e("button", {
                      class: "btn btn-primary",
                      type: "button",
                      disabled: t(o),
                      onClick: q[1] || (q[1] = (L) => t(j)("provider"))
                    }, n(t(ne)("settings.save")), 9, $p)
                  ])
                ])) : N("", !0)
              ])) : t(d) === "persona" ? (r(), ke(xd, { key: 3 })) : t(d) === "live2d" ? (r(), ke(Js, {
                key: "live2d",
                enabled: t(s).live2d.enabled,
                "model-url": t(s).live2d.modelUrl,
                uploaded: t($),
                msg: t(p),
                saving: t(c),
                "onUpdate:enabled": q[2] || (q[2] = (L) => t(s).live2d.enabled = L),
                "onUpdate:modelUrl": q[3] || (q[3] = (L) => t(s).live2d.modelUrl = L),
                onSave: t(Ie),
                onUpload: t(Pe),
                onDelete: t(B)
              }, null, 8, ["enabled", "model-url", "uploaded", "msg", "saving", "onSave", "onUpload", "onDelete"])) : t(d) === "security" ? (r(), ke($c, { key: 5 })) : t(d) === "permissions" ? (r(), ke(Dd, { key: 6 })) : t(d) === "mcp" ? (r(), ke(Tu, { key: 7 })) : t(d) === "life_settings" ? (r(), ke(gl, { key: 8 })) : t($e)(t(d)) && t(ae)(t(d)) ? (r(), u("div", {
                key: `section-${t(d)}`,
                class: "content-card"
              }, [
                e("h2", null, n(t(ae)(t(d)).label), 1),
                t(ae)(t(d)).description ? (r(), u("p", Sp, n(t(ae)(t(d)).description), 1)) : N("", !0),
                t(ae)(t(d)).plugin_name && t(ae)(t(d)).plugin_name !== t(d) ? (r(), u("p", Cp, n(t(ne)("settings.pluginProvidedBy", { name: t(ae)(t(d)).plugin_name })), 1)) : N("", !0),
                (r(!0), u(Z, null, de(t(ae)(t(d)).fields.filter((L) => L.type !== "test"), (L) => (r(), ke(mt, {
                  key: L.key,
                  field: L,
                  label: L.label,
                  help: L.help,
                  "model-value": t(_)[t(d)]?.[L.key],
                  "section-id": t(d),
                  "model-options": t(w),
                  "available-models": t(v),
                  "onUpdate:modelValue": (ie) => t(_)[t(d)] = { ...t(_)[t(d)], [L.key]: ie },
                  onBrowse: (ie) => T.value = L.key
                }, null, 8, ["field", "label", "help", "model-value", "section-id", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                (r(!0), u(Z, null, de(t(ae)(t(d)).fields.filter((L) => L.type === "test"), (L) => (r(), u("div", {
                  key: L.key,
                  class: "field"
                }, [
                  e("label", null, n(L.label), 1),
                  e("div", Pp, [
                    e("button", {
                      class: "btn btn-tonal",
                      type: "button",
                      disabled: t(l),
                      onClick: q[4] || (q[4] = (ie) => t(f)(t(d)))
                    }, n(t(l) ? t(ne)("settings.testing") : L.label || t(ne)("settings.test")), 9, xp),
                    t(a) ? (r(), u("span", Mp, n(t(a)), 1)) : N("", !0)
                  ]),
                  L.help ? (r(), u("p", Ep, n(L.help), 1)) : N("", !0)
                ]))), 128)),
                (r(!0), u(Z, null, de(t(ae)(t(d)).fields.filter((L) => L.type === "action"), (L) => (r(), u("div", {
                  key: L.key,
                  class: "field"
                }, [
                  e("label", null, n(L.label), 1),
                  e("div", Up, [
                    e("button", {
                      class: "btn btn-tonal",
                      type: "button",
                      disabled: t(E) || String(t(_)[t(d)]?.self_evolve_enabled) !== "true",
                      onClick: q[5] || (q[5] = //@ts-ignore
                      (...ie) => t(R) && t(R)(...ie))
                    }, n(L.label), 9, Tp),
                    t(H) ? (r(), u("span", Ap, n(t(H)), 1)) : N("", !0)
                  ]),
                  L.help ? (r(), u("p", Ip, n(L.help), 1)) : N("", !0)
                ]))), 128)),
                t(C) ? (r(), u("div", {
                  key: 2,
                  class: oe(["helper-text", t(i) === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, n(t(C)), 3)) : N("", !0),
                e("div", Vp, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: t(o),
                    onClick: q[6] || (q[6] = (L) => t(j)(t(d)))
                  }, n(t(ne)("settings.save")), 9, Np)
                ])
              ])) : t(Y) ? (r(), ke(zu, {
                key: t(Y),
                module: t(Y) || ""
              }, null, 8, ["module"])) : !t(Re)(t(d)) && t(he)(t(d))?.fields?.length ? (r(), u("div", {
                key: `patch-${t(d)}`,
                class: "content-card"
              }, [
                e("h2", null, n(t(ve)(t(d))), 1),
                t(he)(t(d))?.descriptionKey ? (r(), u("p", Rp, n(t(ne)(t(he)(t(d)).descriptionKey)), 1)) : t(he)(t(d))?.description ? (r(), u("p", Lp, n(t(he)(t(d)).description), 1)) : N("", !0),
                (r(!0), u(Z, null, de(t(he)(t(d)).fields, (L) => (r(), ke(mt, {
                  key: L.key,
                  field: L,
                  label: t(xe)(t(he)(t(d)), L.key, `settings.${L.key}`),
                  help: t(Se)(t(he)(t(d)), L.key, `settings.${L.key}Desc`),
                  "model-value": t(_)[t(d)]?.[L.key],
                  "section-id": t(d),
                  "model-options": t(w),
                  "available-models": t(v),
                  "onUpdate:modelValue": (ie) => t(_)[t(d)] = { ...t(_)[t(d)], [L.key]: ie },
                  onBrowse: (ie) => T.value = L.key
                }, null, 8, ["field", "label", "help", "model-value", "section-id", "model-options", "available-models", "onUpdate:modelValue", "onBrowse"]))), 128)),
                t(C) ? (r(), u("div", {
                  key: 2,
                  class: oe(["helper-text", t(i) === "error" ? "msg-error" : "msg-success"]),
                  role: "status"
                }, n(t(C)), 3)) : N("", !0),
                e("div", Op, [
                  e("button", {
                    class: "btn btn-primary",
                    type: "button",
                    disabled: t(o),
                    onClick: q[7] || (q[7] = (L) => t(K)(t(d)))
                  }, n(t(ne)("settings.save")), 9, Dp)
                ])
              ])) : t(d) === "about" ? (r(), ke(So, { key: "about" })) : t(d) === "updates" ? (r(), ke(ma, { key: "updates" })) : t(d) === "danger" ? (r(), ke(Ru, { key: "danger" })) : (r(), u("div", zp, [
                e("p", null, n(t(ne)("settings.tabNotFound")), 1)
              ]))
            ]),
            _: 1
          })
        ])
      ]),
      we(np, {
        open: t(G),
        "onUpdate:open": q[8] || (q[8] = (L) => ds(G) ? G.value = L : null),
        initial: t(se),
        title: t(me),
        onPick: t(z)
      }, null, 8, ["open", "initial", "title", "onPick"]),
      t(U) ? (r(), u("div", {
        key: 0,
        class: "dialog-veil",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t(ne)("settings.evolveConfirmTitle")
      }, [
        e("div", Fp, [
          e("h2", null, n(t(ne)("settings.evolveConfirmTitle")), 1),
          e("p", Kp, n(t(ne)("settings.evolveConfirmBody")), 1),
          e("ul", Hp, [
            e("li", null, n(t(ne)("settings.evolveBoundaryWorktree")), 1),
            e("li", null, n(t(ne)("settings.evolveBoundaryMain")), 1),
            e("li", null, n(t(ne)("settings.evolveBoundaryTests")), 1)
          ]),
          t(H) ? (r(), u("p", jp, n(t(H)), 1)) : N("", !0),
          e("div", Yp, [
            e("button", {
              class: "btn btn-tonal",
              type: "button",
              disabled: t(E),
              onClick: q[9] || (q[9] = //@ts-ignore
              (...L) => t(V) && t(V)(...L))
            }, n(t(ne)("settings.cancel")), 9, Xp),
            e("button", {
              class: "btn btn-primary",
              type: "button",
              disabled: t(E),
              onClick: q[10] || (q[10] = //@ts-ignore
              (...L) => t(M) && t(M)(...L))
            }, n(t(E) ? t(ne)("settings.evolveStarting") : t(ne)("settings.evolveConfirmAction")), 9, Jp)
          ])
        ])
      ], 8, Bp)) : N("", !0)
    ]));
  }
});
export {
  eh as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style-settings')){const s=document.createElement('style');s.id='webui-plugin-style-settings';s.textContent="@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage.bare[data-v-600df96a],.live2d-stage.bare .stage-viewport[data-v-600df96a]{background:none!important;border:0!important;border-radius:0!important;min-height:0}.live2d-stage.bare .stage-gradient[data-v-600df96a],.live2d-stage.bare .stage-hint[data-v-600df96a],.live2d-stage.bare .stage-reset[data-v-600df96a]{display:none!important}.live2d-stage[data-v-600df96a]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-600df96a]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-600df96a]:active{cursor:grabbing}.stage-canvas[data-v-600df96a]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-600df96a]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-600df96a]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-600df96a]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-600df96a]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-600df96a]:active{transform:scale(.96)}.stage-reset.dragging[data-v-600df96a]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-600df96a]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-600df96a]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-600df96a]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.life-settings[data-v-d91bdafc]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-d91bdafc]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-d91bdafc .52s var(--ls-spring) both}.ls-hero-main[data-v-d91bdafc]{min-width:0}.ls-eyebrow[data-v-d91bdafc]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-d91bdafc]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-d91bdafc]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-d91bdafc]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-d91bdafc]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-d91bdafc]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-d91bdafc]{font-size:16px}.ls-grid[data-v-d91bdafc]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-d91bdafc]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-d91bdafc .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-d91bdafc]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-d91bdafc]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-d91bdafc]{grid-column:1 / -1}.ls-card-head[data-v-d91bdafc]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-d91bdafc]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-d91bdafc]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-d91bdafc]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-d91bdafc]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-d91bdafc]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-d91bdafc]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-d91bdafc]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-d91bdafc]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-d91bdafc]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-d91bdafc]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-d91bdafc]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-d91bdafc]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-d91bdafc]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-d91bdafc]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-d91bdafc]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-d91bdafc]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-d91bdafc]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-d91bdafc]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-d91bdafc]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-d91bdafc]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-d91bdafc]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-d91bdafc]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-d91bdafc]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-d91bdafc]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-d91bdafc]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-d91bdafc]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-d91bdafc]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-d91bdafc]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-d91bdafc]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-d91bdafc]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-d91bdafc]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-d91bdafc]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-d91bdafc]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}#app .ls-model[data-v-d91bdafc]{border-radius:20px}#app .ls-model.selected[data-v-d91bdafc]{border-radius:20px 20px 20px 8px}.ls-model b[data-v-d91bdafc]{font-size:13px;word-break:break-all}.ls-model span[data-v-d91bdafc]{font-size:12px;color:var(--md-on-surface-variant)}.ls-hint[data-v-d91bdafc]{margin:12px 0 0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.ls-state[data-v-d91bdafc]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-d91bdafc .32s var(--ls-spring) both}@keyframes ls-rise-d91bdafc{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-d91bdafc{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-d91bdafc],.ls-row[data-v-d91bdafc],.ls-models[data-v-d91bdafc]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-d91bdafc],.ls-card[data-v-d91bdafc],.ls-state[data-v-d91bdafc]{animation:none}}.about[data-v-2678e07b]{display:flex;flex-direction:column;gap:26px}.identity[data-v-2678e07b]{display:flex;align-items:center;gap:16px}.app-icon[data-v-2678e07b]{flex:none;width:56px;height:56px;filter:drop-shadow(0 6px 16px color-mix(in srgb,var(--md-primary) 25%,transparent))}.app-id[data-v-2678e07b]{flex:1;min-width:0}.app-id h2[data-v-2678e07b]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-2678e07b]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-2678e07b]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-2678e07b]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-2678e07b]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-2678e07b]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-2678e07b]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-2678e07b]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.credits[data-v-2678e07b]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-2678e07b]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-2678e07b]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-2678e07b]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-2678e07b]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-2678e07b]{font-size:16px;font-weight:650}.person-info .role[data-v-2678e07b]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-2678e07b]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-2678e07b]{margin-top:6px}.contribs[data-v-2678e07b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-2678e07b]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-2678e07b]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-2678e07b]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-2678e07b]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-2678e07b]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-2678e07b]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-2678e07b]{margin-left:auto}.status-chip[data-v-2678e07b]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-2678e07b]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-2678e07b]:hover{text-decoration:underline}.muted[data-v-2678e07b]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-2678e07b]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-2678e07b]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-hero.warn[data-v-2678e07b]{background:var(--md-warning-container);color:var(--md-on-warning-container);border-color:transparent}.us-hero.none[data-v-2678e07b]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-2678e07b]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-2678e07b]{flex:1;min-width:0}.us-hero-text b[data-v-2678e07b]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-2678e07b]{font-size:13px;opacity:.85}.us-hero-text em[data-v-2678e07b]{font-style:normal;font-weight:700}.us-hero-actions[data-v-2678e07b]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-2678e07b]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-2678e07b]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-2678e07b]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-2678e07b]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-2678e07b]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-2678e07b]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-apply-banner.failed[data-v-2678e07b]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-2678e07b]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-2678e07b]{font-weight:700}.us-apply-label[data-v-2678e07b]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-2678e07b]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-2678e07b]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-2678e07b]{animation:us-spin-2678e07b .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-2678e07b],.us-apply-banner.failed .us-spinner[data-v-2678e07b]{display:none}.us-apply-log[data-v-2678e07b],.us-apply-error[data-v-2678e07b]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-2678e07b{to{transform:rotate(360deg)}}.alert[data-v-2678e07b]{color:var(--md-error)}.updates[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-bc3fb39c]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-bc3fb39c]{display:flex;align-items:center;gap:12px}.us-ico[data-v-bc3fb39c]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-bc3fb39c]{flex:1;min-width:0}.us-title[data-v-bc3fb39c]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-bc3fb39c]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px}.us-tag[data-v-bc3fb39c]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-bc3fb39c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-bc3fb39c]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-bc3fb39c]{background:#ffdf9e;color:#4a3800}.us-source[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-bc3fb39c]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-bc3fb39c]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-bc3fb39c]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-bc3fb39c]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-bc3fb39c]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-bc3fb39c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-bc3fb39c]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-bc3fb39c]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-bc3fb39c]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-bc3fb39c]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-bc3fb39c]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-bc3fb39c]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-bc3fb39c]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-bc3fb39c]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-bc3fb39c]{flex:1;min-width:0}.us-hero-text b[data-v-bc3fb39c]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-bc3fb39c]{font-size:13px;opacity:.85}.us-hero-text em[data-v-bc3fb39c]{font-style:normal;font-weight:700}.us-hero-actions[data-v-bc3fb39c]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-bc3fb39c]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-bc3fb39c]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-bc3fb39c]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-bc3fb39c]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-bc3fb39c]{font-weight:700}.us-apply-label[data-v-bc3fb39c]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-bc3fb39c]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-bc3fb39c]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-bc3fb39c]{animation:us-spin-bc3fb39c .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-bc3fb39c],.us-apply-banner.failed .us-spinner[data-v-bc3fb39c]{display:none}.us-apply-log[data-v-bc3fb39c],.us-apply-error[data-v-bc3fb39c]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-bc3fb39c{to{transform:rotate(360deg)}}.us-table[data-v-bc3fb39c]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-bc3fb39c]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-bc3fb39c]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-bc3fb39c]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-bc3fb39c]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden}.us-name-text[data-v-bc3fb39c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-bc3fb39c]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-bc3fb39c]{background:var(--md-success)}.us-dot.warn[data-v-bc3fb39c]{background:#e0a800}.us-dot.bad[data-v-bc3fb39c]{background:var(--md-error)}.us-ver[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-bc3fb39c]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-bc3fb39c]{font-weight:650}.us-ver b.good[data-v-bc3fb39c]{color:var(--md-success)}.us-arrow[data-v-bc3fb39c]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-bc3fb39c]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden}.us-status-text[data-v-bc3fb39c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-bc3fb39c]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-bc3fb39c]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-bc3fb39c]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-bc3fb39c]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-bc3fb39c]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-bc3fb39c]:hover{text-decoration:underline}.us-empty[data-v-bc3fb39c]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-bc3fb39c]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-bc3fb39c]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.alert[data-v-bc3fb39c]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-bc3fb39c]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-bc3fb39c]{display:none}.us-hero[data-v-bc3fb39c]{flex-wrap:wrap}.us-hero-actions[data-v-bc3fb39c]{width:100%}}.provider-panel[data-v-d10cd596]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-d10cd596]{display:flex;align-items:center;gap:14px}.pp-back[data-v-d10cd596]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-d10cd596]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-d10cd596]{flex:1;min-width:0}.pp-editor-title h2[data-v-d10cd596]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-d10cd596]{margin:3px 0 0}.pp-section[data-v-d10cd596]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-d10cd596]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-d10cd596]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-d10cd596]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-d10cd596]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-d10cd596]{margin-bottom:0}.pp-span[data-v-d10cd596]{grid-column:1 / -1}.pp-req[data-v-d10cd596]{color:var(--md-error);margin-left:2px}.pp-key[data-v-d10cd596]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-d10cd596]{flex:1}.pp-key-toggle[data-v-d10cd596]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-d10cd596]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-d10cd596]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-d10cd596]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-d10cd596]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-d10cd596]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-d10cd596]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-d10cd596]{animation:pp-pulse-d10cd596 1s ease-in-out infinite}@keyframes pp-pulse-d10cd596{50%{opacity:.15}}.pp-probe[data-v-d10cd596]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-d10cd596]{color:var(--md-success)}.pp-probe.err[data-v-d10cd596]{color:var(--md-error)}.pp-discovered[data-v-d10cd596]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-d10cd596]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-d10cd596]{flex:1;min-width:160px}.pp-mini[data-v-d10cd596]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-d10cd596]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-add-model[data-v-d10cd596]{display:flex;align-items:center;gap:8px;margin-top:8px}.pp-add-model .input[data-v-d10cd596]{flex:1;min-width:0}.pp-add-model .btn[data-v-d10cd596]{flex:none;white-space:nowrap}.pp-add-error[data-v-d10cd596]{color:var(--md-error)}.pp-remove[data-v-d10cd596]{flex:none;width:26px;height:26px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);font-size:17px;line-height:1;cursor:pointer}.pp-remove[data-v-d10cd596]:hover{background:color-mix(in srgb,var(--md-error) 14%,transparent);color:var(--md-error)}.pp-models[data-v-d10cd596]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-d10cd596]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-d10cd596]:first-child{border-top:0}.pp-model.off[data-v-d10cd596]{opacity:.5}.pp-model-name[data-v-d10cd596]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-d10cd596]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-d10cd596]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-d10cd596]{color:#e0a800;cursor:default}.pp-switch[data-v-d10cd596]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-d10cd596]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-d10cd596]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-d10cd596]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-d10cd596]{display:flex;gap:10px}.pp-list-head[data-v-d10cd596]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-d10cd596]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-d10cd596]{margin:3px 0 0}.pp-list-actions[data-v-d10cd596]{display:flex;gap:8px}.pp-cards[data-v-d10cd596]{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:14px}.pp-kinds[data-v-d10cd596]{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 12px}.pp-kind[data-v-d10cd596]{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);font-size:13px;font-weight:600;line-height:1}.pp-kind[data-v-d10cd596]:hover{border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));color:var(--md-on-surface)}.pp-kind.active[data-v-d10cd596]{background:var(--md-secondary-container);border-color:transparent;color:var(--md-on-secondary-container)}.pp-kind-count[data-v-d10cd596]{min-width:18px;padding:1px 5px;border-radius:999px;background:color-mix(in srgb,currentColor 12%,transparent);font-size:11px;font-weight:700;text-align:center}.pp-card[data-v-d10cd596]{display:flex;flex-direction:column;gap:12px;padding:16px;min-width:0;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-d10cd596]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-d10cd596]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-d10cd596]{opacity:.62}.pp-card-head[data-v-d10cd596]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-d10cd596]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-d10cd596]{width:26px;height:26px}.pp-card-id[data-v-d10cd596]{flex:1;min-width:0}.pp-card-id strong[data-v-d10cd596]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-d10cd596]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-d10cd596]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-d10cd596]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-d10cd596]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-d10cd596]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-d10cd596]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-d10cd596]{color:var(--md-error)}.pp-chips[data-v-d10cd596]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-d10cd596]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-d10cd596],.pp-chip.empty[data-v-d10cd596]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-d10cd596]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.pp-empty[data-v-d10cd596]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-d10cd596],.pp-cards[data-v-d10cd596]{grid-template-columns:1fr}}.pairing-panel[data-v-67a1ff9e]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-67a1ff9e]{margin:12px 0;color:var(--md-on-surface-variant)}.pairing-panel .pairing-error[data-v-67a1ff9e]{color:var(--md-error)}article[data-v-67a1ff9e]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-67a1ff9e]{font-size:24px;letter-spacing:4px}h4[data-v-67a1ff9e]{margin:18px 0 0}.pairing-list[data-v-67a1ff9e]{position:relative}.pair-enter-active[data-v-67a1ff9e],.pair-leave-active[data-v-67a1ff9e]{transition:opacity var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out)}.pair-enter-from[data-v-67a1ff9e],.pair-leave-to[data-v-67a1ff9e]{opacity:0;transform:translateY(4px)}.pair-leave-active[data-v-67a1ff9e]{position:absolute;width:100%}.pair-move[data-v-67a1ff9e]{transition:transform var(--duration-medium) var(--ease-out)}@media(prefers-reduced-motion:reduce){.pair-enter-active[data-v-67a1ff9e],.pair-leave-active[data-v-67a1ff9e],.pair-move[data-v-67a1ff9e]{transition-duration:1ms}}.models-field[data-v-b6ad9d20]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-b6ad9d20]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-b6ad9d20]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-b6ad9d20]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-b6ad9d20]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-b6ad9d20]{display:inline-flex;gap:4px}.models-actions button[data-v-b6ad9d20]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-b6ad9d20]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-b6ad9d20]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-b6ad9d20]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.connection-grid[data-v-d9b226f0]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,264px);gap:24px;align-items:start}@media(max-width:1000px){.connection-grid[data-v-d9b226f0]{grid-template-columns:minmax(0,1fr)}}.connection-form .field[data-v-d9b226f0]{margin-bottom:12px}.connection-qr[data-v-d9b226f0]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-d9b226f0]{background:#fff;border-radius:8px;padding:6px;width:100%;max-width:264px;height:auto}.connection-link[data-v-d9b226f0]{max-width:100%;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.helper-text[data-v-d9b226f0]{overflow-wrap:anywhere}.toggle-label[data-v-d9b226f0]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-8a0a3d8d]{max-width:920px}.sec-stack[data-v-8a0a3d8d]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-8a0a3d8d]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-8a0a3d8d]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-8a0a3d8d]{font-size:15px;font-weight:700}.sec-chip[data-v-8a0a3d8d]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-8a0a3d8d]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-8a0a3d8d]{margin:2px 0 12px}.sec-pin-grid[data-v-8a0a3d8d]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-8a0a3d8d]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-8a0a3d8d]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-8a0a3d8d]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-8a0a3d8d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-8a0a3d8d]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-8a0a3d8d]:hover{background:var(--md-surface-container)}.page-item[data-v-8a0a3d8d]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-8a0a3d8d]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-8a0a3d8d]{width:44px;height:26px}.page-item .toggle-slider[data-v-8a0a3d8d]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-8a0a3d8d]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-8a0a3d8d]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-8a0a3d8d]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-8a0a3d8d]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-8a0a3d8d]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-8a0a3d8d]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-8a0a3d8d]{margin-top:12px}.sec-error[data-v-8a0a3d8d]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-8a0a3d8d]{grid-template-columns:1fr}}.mcp-panel[data-v-60e55840]{max-width:900px}.mcp-head[data-v-60e55840]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-60e55840]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-60e55840]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-60e55840]{display:flex;gap:10px}.error-banner[data-v-60e55840]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-60e55840]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-60e55840]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-60e55840]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-60e55840]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-60e55840]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-60e55840]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-60e55840]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-60e55840]{flex:1}.mcp-field>span[data-v-60e55840]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-60e55840],.mcp-field select[data-v-60e55840],.mcp-field textarea[data-v-60e55840]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-60e55840]{opacity:.7}.mcp-field textarea[data-v-60e55840]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-60e55840]:focus,.mcp-field select[data-v-60e55840]:focus,.mcp-field textarea[data-v-60e55840]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-60e55840]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-60e55840]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-60e55840]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-60e55840]{font-family:ui-monospace,monospace}.mail-grid[data-v-60e55840]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-60e55840]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-60e55840]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-60e55840]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-60e55840]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-60e55840]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-60e55840]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-60e55840]:disabled{opacity:.6;cursor:not-allowed}#app .mcp-panel[data-v-60e55840] :is(.btn,.mcp-remove){border-radius:999px}#app .mcp-panel .mcp-field[data-v-60e55840] :is(input,select,textarea){border-radius:12px}@media(max-width:720px){.mail-grid[data-v-60e55840]{grid-template-columns:1fr}}.plugin-pane-message[data-v-32ca9ff2]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.pp-head[data-v-580db486]{display:flex;align-items:center;justify-content:space-between;gap:8px}.pp-head h2[data-v-580db486]{margin:0;font-size:18px}.pp-icon[data-v-580db486]{width:32px;height:32px;border-radius:50%;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);font-size:15px;cursor:pointer}.pp-icon[data-v-580db486]:disabled{opacity:.45;cursor:not-allowed}.pp-roots[data-v-580db486]{display:flex;flex-wrap:wrap;gap:6px}.pp-root[data-v-580db486]{padding:4px 10px;border-radius:999px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface-variant);font-size:12px;font-family:monospace;cursor:pointer}.pp-root.is-active[data-v-580db486]{border-color:var(--md-primary);color:var(--md-primary)}.pp-path[data-v-580db486]{font-family:monospace;font-size:13px}.pp-list[data-v-580db486]{display:flex;flex-direction:column;gap:2px;min-height:180px;max-height:42vh;overflow:auto;padding:6px;border-radius:14px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest, var(--md-surface))}.pp-item[data-v-580db486]{display:flex;align-items:center;gap:8px;padding:7px 10px;border:0;border-radius:10px;background:none;color:var(--md-on-surface);font-size:13px;text-align:left;cursor:pointer}.pp-item[data-v-580db486]:hover,.pp-item[data-v-580db486]:focus-visible{background:var(--md-surface-container-high);outline:none}.pp-folder[data-v-580db486]{color:var(--md-primary);font-size:13px;line-height:1;opacity:.85}.pp-name[data-v-580db486]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-empty[data-v-580db486]{margin:0;padding:24px 8px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.pp-error[data-v-580db486]{color:var(--md-error, #b3261e)}.pp-current[data-v-580db486]{margin:0;font-family:monospace;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-foot[data-v-580db486]{display:flex;align-items:center;gap:8px}.pp-spacer[data-v-580db486]{flex:1}\n";document.head.appendChild(s)}})();
