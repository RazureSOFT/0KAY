import { defineComponent as at, ref as b, computed as F, onMounted as st, onUnmounted as lt, watch as he, openBlock as Y, createElementBlock as V, normalizeClass as Be, createElementVNode as U, unref as C, normalizeStyle as Ne, toDisplayString as ee, createCommentVNode as ze, withModifiers as j, nextTick as ct } from "vue";
import { useI18n as ut } from "vue-i18n";
import { useLifeStore as ft, useWizardStore as dt, live2dRuntimeReady as ht } from "@0kay/host";
import { _ as vt } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const pt = ["title"], gt = {
  key: 0,
  class: "stage-placeholder"
}, yt = {
  key: 1,
  class: "stage-status"
}, mt = {
  key: 2,
  class: "stage-status warn"
}, wt = ["title", "aria-label"], xt = { class: "stage-hint" }, Fe = "0kay.web.live2d.resetbtn", Mt = "0kay.web.live2d.transform.", bt = /* @__PURE__ */ at({
  __name: "Live2DStage",
  setup(Pt) {
    const { t: y } = ut(), ve = ft(), H = dt(), c = b(null), te = b(null), pe = b(""), u = b("idle"), _ = b(""), w = F(() => H.live2d.enabled), ne = F(() => H.live2d.modelUrl.trim()), ge = F(() => ve.emotionMood), Ye = F(() => ve.emotionColor), oe = b([]);
    async function ie() {
      try {
        const e = await fetch("/api/live2d");
        if (e.ok) {
          const t = await e.json();
          oe.value = t.models || [];
        }
      } catch {
        oe.value = [];
      }
    }
    const D = b(null), O = b(Ve()), R = b(!1);
    let T = !1, re = { x: 0, y: 0 }, ae = { x: 0, y: 0 };
    function Ve() {
      try {
        const e = localStorage.getItem(Fe);
        if (e) {
          const t = JSON.parse(e);
          if (typeof t?.x == "number" && typeof t?.y == "number") return t;
        }
      } catch {
      }
      return null;
    }
    const Ue = F(() => O.value ? { left: `${O.value.x}px`, top: `${O.value.y}px`, right: "auto", bottom: "auto" } : {});
    function je(e) {
      R.value = !0, T = !1, re = { x: e.clientX, y: e.clientY };
      const t = D.value?.getBoundingClientRect();
      ae = { x: t?.left ?? 0, y: t?.top ?? 0 };
      try {
        D.value?.setPointerCapture(e.pointerId);
      } catch {
      }
    }
    function He(e) {
      if (!R.value || !c.value) return;
      const t = e.clientX - re.x, n = e.clientY - re.y;
      (Math.abs(t) > 3 || Math.abs(n) > 3) && (T = !0);
      const o = c.value.getBoundingClientRect(), a = D.value?.offsetWidth || 34, l = m(ae.x - o.left + t, 4, Math.max(4, o.width - a - 4)), s = m(ae.y - o.top + n, 4, Math.max(4, o.height - a - 4));
      O.value = { x: Math.round(l), y: Math.round(s) };
    }
    function ye(e) {
      if (R.value) {
        R.value = !1;
        try {
          D.value?.releasePointerCapture(e.pointerId);
        } catch {
        }
        if (T)
          try {
            localStorage.setItem(Fe, JSON.stringify(O.value));
          } catch {
          }
      }
    }
    function Ke() {
      if (T) {
        T = !1;
        return;
      }
      nt();
    }
    let r = null, i = null, X = null, K = 0, We = 0, f = 0, W = { x: 0, y: 0, has: !1 }, B = !1, P = null, se = { x: 0, y: 0 }, I = null, S = null, E = null, A = null, d = "off", v = 0, me = 0, we = 0, J = 120, xe = ["ParamMouthOpenY"];
    function L(e) {
      const t = i?.internalModel?.coreModel;
      if (!t) return;
      const n = m(e, 0, 1);
      for (const o of xe)
        try {
          typeof t.setParameterValueById == "function" ? t.setParameterValueById(o, n) : typeof t.setParamFloat == "function" && t.setParamFloat(o, n);
        } catch {
        }
    }
    function Je(e) {
      const t = [];
      try {
        const n = e?.internalModel?.settings;
        let o = n?.getLipSyncParameters?.();
        if (!Array.isArray(o) && Array.isArray(n?.groups) && (o = n.groups.find((l) => (l?.Name || l?.name || "").toLowerCase() === "lipsync")?.Ids), Array.isArray(o))
          for (const a of o) typeof a == "string" && a && t.push(a);
      } catch {
      }
      xe = t.length ? t : ["ParamMouthOpenY"];
    }
    function $e() {
      if (d === "off") {
        v !== 0 && (v = 0, L(0));
        return;
      }
      if (d === "audio" && E && A) {
        E.getByteTimeDomainData(A);
        let e = 0;
        for (let o = 0; o < A.length; o++) {
          const a = (A[o] - 128) / 128;
          e += a * a;
        }
        const t = Math.sqrt(e / A.length), n = m(t * 3.4, 0, 1);
        v = v * 0.35 + n * 0.65, L(v);
        return;
      }
      if (d === "text") {
        const e = performance.now() - me;
        if (e > we * J + 260) {
          d = "off", v = 0, L(0);
          return;
        }
        const t = e % J / J, n = t < 0.5 ? 0.12 + 0.72 * Math.sin(t / 0.5 * Math.PI) : 0.06;
        v = v * 0.45 + n * 0.55, L(v);
      }
    }
    async function Me(e, t = "") {
      if (!e) {
        $(t);
        return;
      }
      if (i)
        try {
          if (I || (I = new Audio(), I.crossOrigin = "anonymous", I.addEventListener("ended", () => {
            d = "off", v = 0, L(0);
          })), I.src = e, !S) {
            const n = window.AudioContext || window.webkitAudioContext;
            n && (S = new n(), E = S.createAnalyser(), E.fftSize = 1024, A = new Uint8Array(E.fftSize), S.createMediaElementSource(I).connect(E), E.connect(S.destination));
          }
          await S?.resume().catch(() => {
          }), d = "audio", await I.play().catch(() => {
            t ? $(t) : (d = "off", L(0));
          });
        } catch {
          t ? $(t) : d = "off";
        }
    }
    function $(e) {
      const t = Array.from(String(e || "")).filter((n) => /\S/.test(n));
      t.length && (J = /[\u4e00-\u9fff]/.test(t.join("")) ? 140 : 80, we = t.length, me = performance.now(), d = "text");
    }
    function be() {
      d = "off", v = 0, L(0);
      try {
        I?.pause();
      } catch {
      }
    }
    function Pe(e) {
      const t = e.detail || {};
      t.url ? Me(t.url, t.text || "") : t.text && $(t.text);
    }
    let x = {}, g = [], G = 0;
    function Ge(e) {
      x = {}, g = [];
      try {
        const t = e?.internalModel?.motionManager, n = e?.internalModel?.settings, o = t?.definitions || n?.motions || {};
        for (const [l, s] of Object.entries(o)) x[l] = Array.isArray(s) ? s.length : 0;
        g = (t?.expressionManager?.definitions || n?.expressions || []).map((l) => l?.Name || l?.name).filter((l) => !!l);
      } catch {
      }
      try {
        console.info("[live2d] motions", x, "expressions", g);
      } catch {
      }
      try {
        window.__0KAY_LIVE2D_CAPS__ = { motions: x, expressions: g };
      } catch {
      }
    }
    function N(e, t) {
      if (!i) return;
      const n = Object.keys(x).filter((s) => x[s] > 0);
      if (!n.length) return;
      const o = n.find((s) => /idle/i.test(s)), a = e && x[e] > 0, l = a ? e : t == null && o ? o : n.find((s) => s !== o) || n[0];
      try {
        const s = i.internalModel?.motionManager;
        if (typeof i.motion == "function" && a) {
          i.motion(l, t);
          return;
        }
        if (t == null) {
          s?.startRandomMotion?.(l);
          return;
        }
        s?.startMotion?.(l, t);
      } catch {
      }
    }
    function q(e) {
      if (!i || !e) return;
      const t = /^\d+$/.test(e) ? Number(e) : g.indexOf(e), n = t >= 0 ? t : e;
      try {
        const o = i.internalModel?.motionManager?.expressionManager;
        if (o?.setExpression) {
          o.setExpression(n);
          return;
        }
        i.expression?.(n);
      } catch {
      }
    }
    function qe() {
      le(), !(typeof window > "u") && (G = window.setInterval(() => {
        if (d !== "off" || document.hidden) return;
        const e = Object.keys(x).filter((t) => x[t] > 0 && !/idle/i.test(t));
        e.length && Math.random() < 0.6 && N(e[Math.floor(Math.random() * e.length)]), g.length && Math.random() < 0.5 && q(g[Math.floor(Math.random() * g.length)]);
      }, 9e3));
    }
    function le() {
      G && (clearInterval(G), G = 0);
    }
    function Ie(e) {
      const t = e.detail || {};
      t.expression && q(t.expression), (t.group || t.index != null) && N(t.group, t.index);
    }
    function Qe() {
      return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore);
    }
    function m(e, t, n) {
      return Math.min(n, Math.max(t, e));
    }
    function ce() {
      return Mt + (ne.value || "default");
    }
    function Se() {
      try {
        const e = localStorage.getItem(ce());
        if (!e) return null;
        const t = JSON.parse(e);
        if (typeof t?.x == "number" && typeof t?.y == "number" && typeof t?.scale == "number") return t;
      } catch {
      }
      return null;
    }
    function ue(e = !1) {
      if (!i) return;
      const t = () => {
        try {
          localStorage.setItem(ce(), JSON.stringify({
            x: Math.round(i.x * 100) / 100,
            y: Math.round(i.y * 100) / 100,
            scale: Math.round(i.scale.x * 1e4) / 1e4
          }));
        } catch {
        }
      };
      if (e) {
        f && (clearTimeout(f), f = 0), t();
        return;
      }
      f && clearTimeout(f), f = window.setTimeout(() => {
        f = 0, t();
      }, 140);
    }
    function _e() {
      if (le(), d = "off", v = 0, k(), f && (clearTimeout(f), f = 0), i) {
        try {
          r?.stage && r.stage.removeChild(i), i.destroy?.();
        } catch {
        }
        i = null;
      }
    }
    function Ee() {
      if (Te(), _e(), X && (X.disconnect(), X = null), f && (clearTimeout(f), f = 0), r) {
        try {
          r.destroy(!1, { children: !0, texture: !1, baseTexture: !1 });
        } catch {
        }
        r = null;
      }
    }
    function Le(e) {
      if (typeof e.getLocalBounds == "function") {
        const o = e.getLocalBounds();
        if (o && o.width > 0 && o.height > 0) return { width: o.width, height: o.height };
      }
      const t = Math.max(Math.abs(e.scale.x) || 0, 1e-4), n = Math.max(Math.abs(e.scale.y) || 0, 1e-4);
      return { width: Math.max(e.width / t, 1), height: Math.max(e.height / n, 1) };
    }
    function fe(e = i) {
      if (!e || !r) return !1;
      const t = r.screen.width, n = r.screen.height;
      if (!t || !n) return !1;
      const o = Le(e);
      if (o.width > 0 && o.height > 0) {
        const a = Math.min(t / o.width, n / o.height) * 0.88;
        e.anchor?.set?.(0.5, 0.5), e.scale.set(a, a);
      }
      e.position.set(t * 0.5, n * 0.55);
      try {
        const a = e.getBounds?.();
        if (a && a.width > 0 && a.height > 0) {
          e.x += t * 0.5 - (a.x + a.width * 0.5), e.y += n * 0.55 - (a.y + a.height * 0.55);
          const l = e.getBounds?.();
          if (l && l.width > 0 && l.height > 0) {
            const s = Math.min(t / l.width, n / l.height) * 0.88, p = Math.abs(e.scale.x) || 1;
            if (Number.isFinite(s) && s > 0 && Math.abs(s - p) / p > 0.08) {
              const M = p * s;
              e.scale.set(M, M);
              const h = e.getBounds?.();
              h && h.width > 0 && (e.x += t * 0.5 - (h.x + h.width * 0.5), e.y += n * 0.55 - (h.y + h.height * 0.55));
            }
          }
        }
      } catch {
      }
      return !0;
    }
    function Ze() {
      if (!i) return { hw: 0, hh: 0 };
      const e = Le(i), t = Math.abs(i.scale.x) || 1, n = Math.abs(i.scale.y) || 1;
      return { hw: e.width * t / 2, hh: e.height * n / 2 };
    }
    function Q() {
      if (!i || !r) return;
      const e = r.screen.width, t = r.screen.height, { hw: n, hh: o } = Ze(), a = Math.min(n * 0.7, e * 0.5), l = Math.min(o * 0.7, t * 0.5), s = a - n, p = e - a + n, M = l - o, h = t - l + o, z = s <= p ? m(i.x, s, p) : e * 0.5, Xe = M <= h ? m(i.y, M, h) : t * 0.55;
      i.position.set(z, Xe);
    }
    function et() {
      if (!i || !r) return;
      const e = Se();
      if (e && Number.isFinite(e.scale) && e.scale > 0) {
        i.anchor?.set?.(0.5, 0.5), i.scale.set(e.scale, e.scale), i.position.set(e.x, e.y), Q();
        return;
      }
      fe();
    }
    function tt(e, t) {
      if (!i || !window.PIXI || typeof window.PIXI.Point != "function" || typeof i.toModelPosition != "function") return null;
      try {
        const n = new window.PIXI.Point(e, t);
        return i.toModelPosition(n, new window.PIXI.Point());
      } catch {
        return null;
      }
    }
    function ke(e, t, n) {
      const o = n - t;
      return !Number.isFinite(o) || Math.abs(o) <= 1e-4 ? 0 : m((e - t) / o * 2 - 1, -1, 1);
    }
    function Ae(e, t) {
      const n = i?.internalModel, o = n?.focusController;
      if (!o || typeof o.focus != "function" || !r) return;
      const a = r.screen.width || 1, l = r.screen.height || 1;
      let s = e / a * 2 - 1, p = t / l * 2 - 1;
      const M = tt(e, t);
      if (M && n.originalWidth && n.originalHeight) {
        const h = ke(M.x, 0, n.originalWidth), z = ke(M.y, 0, n.originalHeight);
        h >= -1 && h <= 1 && z >= -1 && z <= 1 && (s = s * 0.35 + h * 0.65, p = p * 0.35 + z * 0.65);
      }
      s = m(s, -1, 1), p = m(p, -1, 1), o.focus(s, -p);
    }
    function Z() {
      W.has && Ae(W.x, W.y);
    }
    function Ce(e) {
      if (!i || !r || !c.value) return;
      const t = c.value.getBoundingClientRect();
      if (!t.width || !t.height) return;
      const n = (e.clientX - t.left) / t.width * r.screen.width, o = (e.clientY - t.top) / t.height * r.screen.height;
      W = { x: n, y: o, has: !0 }, B && e.pointerId === P && (i.position.set(n + se.x, o + se.y), Q(), ue()), Ae(n, o);
    }
    function De(e) {
      if (!i || !r || !c.value || e.button !== 0 && e.pointerType === "mouse" || e.target?.closest?.(".stage-reset")) return;
      const t = c.value.getBoundingClientRect();
      if (!t.width || !t.height) return;
      const n = (e.clientX - t.left) / t.width * r.screen.width, o = (e.clientY - t.top) / t.height * r.screen.height;
      B = !0, P = e.pointerId, se = { x: i.x - n, y: i.y - o };
      try {
        c.value.setPointerCapture(e.pointerId);
      } catch {
      }
      c.value && (c.value.style.cursor = "grabbing");
    }
    function k(e) {
      if (B && !(e && P !== null && e.pointerId !== P)) {
        if (B = !1, c.value) {
          try {
            P !== null && c.value.releasePointerCapture(P);
          } catch {
          }
          c.value.style.cursor = "grab";
        }
        P = null, ue(!0);
      }
    }
    function Oe(e) {
      if (!i || u.value !== "ok") return;
      e.preventDefault();
      const t = e.deltaY < 0 ? 1.06 : 0.94, n = m(i.scale.x * t, 0.08, 3.2);
      i.scale.set(n, n), Q(), Z(), ue();
    }
    function nt() {
      if (!(!i || !r)) {
        try {
          localStorage.removeItem(ce());
        } catch {
        }
        f && (clearTimeout(f), f = 0);
        try {
          r.resize?.();
        } catch {
        }
        r?.stage && (r.stage.hitArea = r.screen), fe(), Z();
      }
    }
    function Re() {
      Te();
      const e = c.value;
      e && (e.style.cursor = "grab", e.addEventListener("pointermove", Ce), e.addEventListener("pointerdown", De), e.addEventListener("pointerup", k), e.addEventListener("pointercancel", k), e.addEventListener("pointerleave", k), e.addEventListener("wheel", Oe, { passive: !1 }));
    }
    function Te() {
      const e = c.value;
      e && (e.removeEventListener("pointermove", Ce), e.removeEventListener("pointerdown", De), e.removeEventListener("pointerup", k), e.removeEventListener("pointercancel", k), e.removeEventListener("pointerleave", k), e.removeEventListener("wheel", Oe), B = !1, P = null);
    }
    function ot() {
      if (r || !te.value || !c.value) return;
      const e = window.PIXI;
      r = new e.Application({
        view: te.value,
        resizeTo: c.value,
        autoStart: !0,
        antialias: !0,
        backgroundAlpha: 0,
        powerPreference: "high-performance"
      }), r.stage && (r.stage.interactive = !0, r.stage.hitArea = r.screen), X = new ResizeObserver(() => {
        try {
          r?.resize?.();
        } catch {
        }
        if (r?.stage && (r.stage.hitArea = r.screen), i) {
          const t = Se();
          t && Number.isFinite(t.scale) && t.scale > 0 ? (i.position.set(t.x, t.y), i.scale.set(t.scale, t.scale), Q()) : fe();
        }
        Z();
      }), X.observe(c.value), Re();
    }
    async function de() {
      try {
        await ht;
      } catch (n) {
        u.value = "error", _.value = `Live2D runtime: ${n.message}`;
        return;
      }
      const e = ++K;
      if (_e(), !w.value) {
        u.value = "disabled", pe.value = "";
        return;
      }
      if (!Qe()) {
        u.value = "no-libs", _.value = y("live2d.libsMissing");
        return;
      }
      const t = ne.value || oe.value[0]?.url;
      if (!t) {
        u.value = "error", _.value = y("live2d.noModel");
        return;
      }
      if (u.value = "loading", _.value = "", pe.value = t.split("/").pop() || t, await ct(), r || ot(), !r) {
        u.value = "error", _.value = y("live2d.stageMissing");
        return;
      }
      try {
        const n = await window.PIXI.live2d.Live2DModel.from(t, { autoInteract: !1 });
        if (e !== K) {
          try {
            n.destroy?.();
          } catch {
          }
          return;
        }
        i = n, Re(), n.anchor?.set?.(0.5, 0.5), r.stage.addChild(n), et();
        try {
          n.internalModel?.on?.("beforeModelUpdate", $e);
        } catch {
        }
        Je(n), Ge(n), u.value = "ok", Z(), N("Idle"), qe();
      } catch (n) {
        if (e !== K) return;
        console.error("Live2D load failed:", n), u.value = "error", _.value = n?.message || y("live2d.loadError");
      }
    }
    function it() {
      if (!w.value) {
        Ee(), u.value = "disabled";
        return;
      }
      de();
    }
    st(async () => {
      window.addEventListener("live2d-models-changed", ie), window.addEventListener("live2d-speak", Pe), window.addEventListener("live2d-motion", Ie), window.__0KAY_LIVE2D__ = { speak: Me, stop: be, motion: N, expression: q };
      try {
        const e = await fetch("/api/settings/live2d");
        if (e.ok) {
          const { values: t } = await e.json();
          t && typeof t.enabled == "boolean" && (H.live2d.enabled = t.enabled), t && typeof t.model_url == "string" && (H.live2d.modelUrl = t.model_url);
        }
      } catch {
      }
      await ie(), w.value ? de() : u.value = "disabled";
    }), lt(() => {
      window.removeEventListener("live2d-models-changed", ie), window.removeEventListener("live2d-speak", Pe), window.removeEventListener("live2d-motion", Ie), le(), be();
      try {
        S?.close();
      } catch {
      }
      S = null, K++, cancelAnimationFrame(We), Ee();
    }), he(w, it), he(ne, () => {
      w.value && de();
    });
    const rt = { happy: 2, sad: 4, irritated: 6, neutral: 0, drowsy: 0, exhausted: 0, sleeping: 0 };
    return he(ge, (e) => {
      if (!i || d !== "off" || !g.length) return;
      const t = rt[e] ?? 0;
      q(g[t] || g[0]), (e === "happy" || e === "irritated") && Math.random() < 0.5 && N();
    }), (e, t) => (Y(), V("div", {
      class: Be(["live2d-stage", { on: w.value }])
    }, [
      U("div", {
        ref_key: "stageEl",
        ref: c,
        class: "stage-viewport",
        style: Ne({ "--mood": Ye.value }),
        title: w.value && u.value === "ok" ? C(y)("live2d.interactHint") : ""
      }, [
        U("canvas", {
          ref_key: "canvasEl",
          ref: te,
          class: "stage-canvas"
        }, null, 512),
        w.value ? u.value === "loading" ? (Y(), V("div", yt, ee(C(y)("live2d.loading")), 1)) : u.value === "error" || u.value === "no-libs" ? (Y(), V("div", mt, ee(_.value || C(y)("live2d.loadError")), 1)) : ze("", !0) : (Y(), V("div", gt, [
          U("p", null, ee(C(y)("live2d.disabledHint")), 1)
        ])),
        w.value && u.value === "ok" ? (Y(), V("button", {
          key: 3,
          ref_key: "resetBtnEl",
          ref: D,
          class: Be(["stage-reset", { dragging: R.value }]),
          type: "button",
          style: Ne(Ue.value),
          title: C(y)("live2d.resetView"),
          "aria-label": C(y)("live2d.resetView"),
          onPointerdown: j(je, ["stop"]),
          onPointermove: j(He, ["stop"]),
          onPointerup: j(ye, ["stop"]),
          onPointercancel: j(ye, ["stop"]),
          onClick: j(Ke, ["stop"])
        }, "⟲", 46, wt)) : ze("", !0),
        t[0] || (t[0] = U("div", { class: "stage-gradient" }, null, -1)),
        U("div", xt, ee(ge.value), 1)
      ], 12, pt)
    ], 2));
  }
}), Lt = /* @__PURE__ */ vt(bt, [["__scopeId", "data-v-ed3cc7f4"]]);
export {
  Lt as L
};
