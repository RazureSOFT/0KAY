import { ref as M, defineComponent as ue, computed as B, openBlock as s, createElementBlock as i, normalizeClass as z, createElementVNode as t, Fragment as P, renderList as K, createCommentVNode as T, toDisplayString as g, createBlock as ne, unref as o, createTextVNode as ye, normalizeStyle as ae, watch as ve, nextTick as ke, onMounted as we, onUnmounted as be, createStaticVNode as Le, withDirectives as Ze, vModelText as Je } from "vue";
import { useI18n as de } from "vue-i18n";
import { MarkdownContent as Qe, useChatStore as Ee, useWizardStore as Be, useSettingsSectionsStore as et, useConfirm as tt, useLifeStore as nt, useUIPatchesStore as De } from "@0kay/host";
import { t as re } from "./assets/toast-CztbypyC.js";
import { _ as he } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
import { L as at } from "./assets/Live2DStage-CQ-AJ4l1.js";
const I = M("off"), H = M(""), G = M(""), le = 2600, ot = 9e3, st = 850, it = 0.012, rt = 0.02;
let E = null, q = null, ee = null, N = !0, _e = !1, ce = null, Y = "wake", V = "";
const lt = (a) => new Promise((e) => setTimeout(e, a));
function xe(a) {
  return a.toLowerCase().replace(/[\s\u3000]+/g, "").replace(/[，。！？、,.!?~～…:：;；"'“”‘’()（）[\]【】<>《》\-—_/\\]+/g, "");
}
function Pe(a, e) {
  const r = xe(a);
  return r ? e.some((n) => {
    const u = xe(n);
    return u.length > 0 && r.includes(u);
  }) : !1;
}
function ct() {
  const a = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  if (typeof MediaRecorder > "u") return "";
  for (const e of a)
    if (MediaRecorder.isTypeSupported?.(e)) return e;
  return "";
}
async function ut() {
  try {
    const a = await fetch("/api/asr", { signal: AbortSignal.timeout(5e3) });
    return a.ok ? !!(await a.json()).configured : !1;
  } catch {
    return !1;
  }
}
async function Re(a) {
  const e = new FormData(), r = a.type || "audio/webm", n = r.includes("mp4") ? "m4a" : r.includes("ogg") ? "ogg" : r.includes("wav") ? "wav" : "webm";
  e.append("audio", a, `chunk.${n}`), E?.language && e.append("language", E.language);
  const u = await fetch("/api/asr", { method: "POST", body: e });
  if (u.status === 503) return { text: "", configured: !1 };
  if (!u.ok) throw new Error(await u.text());
  const f = await u.json();
  return { text: String(f.text || ""), configured: !0 };
}
function dt(a) {
  const e = window.AudioContext || window.webkitAudioContext;
  ee = new e();
  const r = ee.createMediaStreamSource(a), n = ee.createAnalyser();
  n.fftSize = 1024, r.connect(n);
  const u = new Float32Array(n.fftSize);
  return {
    read() {
      n.getFloatTimeDomainData(u);
      let f = 0;
      for (let v = 0; v < u.length; v++) f += u[v] * u[v];
      return Math.sqrt(f / u.length);
    },
    close() {
      try {
        r.disconnect();
      } catch {
      }
      try {
        ee?.close();
      } catch {
      }
      ee = null;
    }
  };
}
function te(a, e = !1) {
  let r = () => {
  };
  return { blob: new Promise((u) => {
    if (!q || typeof MediaRecorder > "u") {
      u(null);
      return;
    }
    const f = ct();
    let v;
    try {
      v = new MediaRecorder(q, f ? { mimeType: f } : void 0);
    } catch {
      u(null);
      return;
    }
    const $ = [], w = e ? dt(q) : null;
    let b = 0, k = 0, L = !1;
    const x = () => {
      if (!L) {
        L = !0, w && w.close(), clearTimeout(A), clearInterval(S);
        try {
          v.state !== "inactive" && v.stop();
        } catch {
        }
      }
    };
    r = x;
    const A = setTimeout(x, a), S = setInterval(() => {
      if (!w) return;
      const m = w.read(), h = Date.now();
      if (m >= rt) {
        b = h, k = 0;
        return;
      }
      if (!(!b || h - b < 500)) {
        if (m > it) {
          k = 0;
          return;
        }
        k ? h - k >= st && x() : k = h;
      }
    }, 80);
    v.ondataavailable = (m) => {
      m.data && m.data.size && $.push(m.data);
    }, v.onstop = () => {
      w && w.close(), u($.length ? new Blob($, { type: v.mimeType || f || "audio/webm" }) : null);
    };
    try {
      v.start();
    } catch {
      x(), u(null);
    }
  }), cancel: () => r() };
}
function ht() {
  try {
    const a = window.AudioContext || window.webkitAudioContext, e = new a(), r = e.currentTime;
    for (const [n, u] of [660, 880].entries()) {
      const f = e.createOscillator(), v = e.createGain();
      f.type = "sine", f.frequency.value = u, v.gain.setValueAtTime(1e-4, r + n * 0.09), v.gain.exponentialRampToValueAtTime(0.06, r + n * 0.09 + 0.02), v.gain.exponentialRampToValueAtTime(1e-4, r + n * 0.09 + 0.13), f.connect(v).connect(e.destination), f.start(r + n * 0.09), f.stop(r + n * 0.09 + 0.15);
    }
    setTimeout(() => {
      try {
        e.close();
      } catch {
      }
    }, 600);
  } catch {
  }
}
async function ft(a) {
  if (!E || N) return;
  I.value = "woken", ht(), E.onWake(a), I.value = "capturing";
  const e = await te(ot, !0).blob;
  if (!N) {
    if (e && e.size > 2e3)
      try {
        const n = (await Re(e)).text.trim();
        n && (G.value = n, E?.onUtterance(n));
      } catch {
      }
    !N && H.value === "core" && (I.value = "listening");
  }
}
async function mt() {
  let a = te(le);
  try {
    for (; !N && H.value === "core"; ) {
      if (_e) {
        a?.cancel(), a = null, await lt(250);
        continue;
      }
      a || (a = te(le));
      const e = await a.blob;
      if (N || H.value !== "core") return;
      if (a = te(le), !e || e.size < 1200) continue;
      let r;
      try {
        r = await Re(e);
      } catch {
        continue;
      }
      if (!r.configured) {
        H.value = "", Ne();
        return;
      }
      const n = r.text.trim();
      n && (G.value = n, E?.onHeard?.(n), E && Pe(n, E.nicknames) && (a?.cancel(), a = null, await ft(n), !N && H.value === "core" && (a = te(le))));
    }
  } finally {
    a?.cancel();
  }
}
function Fe() {
  const a = window;
  return a.SpeechRecognition || a.webkitSpeechRecognition || null;
}
function Ne() {
  const a = Fe();
  if (!a) {
    W("no-engine");
    return;
  }
  H.value !== "browser" && (H.value = "browser"), Y = "wake", V = "";
  const e = new a();
  ce = e, e.lang = E?.language || "zh-CN", e.continuous = !0, e.interimResults = !0, e.onresult = (r) => {
    let n = "";
    for (let u = r.resultIndex; u < r.results.length; u++)
      r.results[u].isFinal && (n += r.results[u][0].transcript);
    if (n = n.trim(), !!n) {
      if (G.value = n, E?.onHeard?.(n), Y === "wake") {
        E && Pe(n, E.nicknames) && (I.value = "woken", E.onWake(n), Y = "capture", V = "", I.value = "capturing");
        return;
      }
      V = `${V}${n}`.trim();
    }
  }, e.onend = () => {
    if (!N) {
      Y === "capture" && V && (E?.onUtterance(V), V = "", Y = "wake", I.value = "listening");
      try {
        e.start();
      } catch {
      }
    }
  }, e.onerror = (r) => {
    if (r?.error === "not-allowed" || r?.error === "service-not-allowed") {
      W("mic-denied");
      return;
    }
    r?.error === "no-speech" || r?.error === "aborted" || W("error", String(r?.error || "speech recognition failed"));
  };
  try {
    e.start(), I.value = "listening";
  } catch (r) {
    W("error", r?.message || "speech recognition failed");
  }
}
function W(a, e) {
  X(), I.value = "error", E?.onError?.(a, e);
}
async function pt(a) {
  if (X(), E = a, N = !1, _e = !1, G.value = "", !a.nicknames.length) {
    W("no-nickname");
    return;
  }
  if (await ut()) {
    if (N) return;
    H.value = "core";
    try {
      q = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !0, noiseSuppression: !0 } });
    } catch (e) {
      const r = e?.name === "NotAllowedError" || e?.name === "SecurityError";
      W(r ? "mic-denied" : "error", e?.message);
      return;
    }
    if (N) {
      Ae();
      return;
    }
    I.value = "listening", mt();
    return;
  }
  if (Fe()) {
    Ne();
    return;
  }
  W("no-engine");
}
function Ae() {
  try {
    q?.getTracks().forEach((a) => a.stop());
  } catch {
  }
  q = null;
}
function X() {
  if (N = !0, Ae(), ce) {
    const a = ce;
    ce = null, a.onend = null, a.onresult = null, a.onerror = null;
    try {
      a.stop();
    } catch {
    }
  }
  Y = "wake", V = "", H.value = "", I.value !== "error" && (I.value = "off");
}
function $e(a) {
  _e = a;
}
function Se(a) {
  return a.irritation > 0.7 ? "irritated" : a.valence > 0.5 ? "happy" : a.valence < -0.3 ? "sad" : "neutral";
}
const gt = {
  happy: "#107c10",
  sad: "#0078d4",
  irritated: "#d13438",
  neutral: "#8a8886"
};
function vt(a) {
  return gt[a];
}
const kt = {
  key: 0,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, yt = {
  key: 1,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, wt = { class: "content-wrapper" }, bt = {
  key: 0,
  class: "images"
}, _t = ["src"], Ct = {
  key: 1,
  class: "files"
}, xt = ["href", "title"], $t = { class: "msg-file-name" }, St = {
  key: 3,
  class: "think-panel"
}, Mt = ["aria-expanded"], Tt = { class: "think-body" }, It = {
  key: 0,
  class: "think-raw"
}, Lt = {
  key: 1,
  class: "think-summary"
}, Et = { class: "meta" }, Bt = { class: "time" }, Dt = /* @__PURE__ */ ue({
  __name: "MessageBubble",
  props: {
    message: {},
    streaming: { type: Boolean }
  },
  setup(a) {
    const e = a, { t: r, locale: n } = de(), u = B(() => e.message.role === "user"), f = M(!1), v = B(() => {
      if (!e.message.thinkSummary) return null;
      try {
        const w = JSON.parse(e.message.thinkSummary);
        if (typeof w.raw == "string" && w.raw.trim()) return { raw: w.raw };
        if (typeof w.summary == "string" && w.summary.trim()) return w;
        const b = w.intent || r("messageBubble.intentDefault"), k = w.strategy || r("messageBubble.strategyDefault");
        return { summary: r("messageBubble.summary", { intent: b, strategy: k }) };
      } catch {
        return { summary: e.message.thinkSummary };
      }
    }), $ = B(() => {
      const w = e.message.timestamp, b = w.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
      return new Intl.DateTimeFormat(n.value, {
        ...b ? {} : { year: "numeric" },
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }).format(w);
    });
    return (w, b) => (s(), i("div", {
      class: z(["message", { user: u.value, assistant: !u.value }])
    }, [
      t("div", {
        class: z(["avatar", { "user-avatar": u.value, "assistant-avatar": !u.value }])
      }, [
        u.value ? (s(), i("svg", kt, [...b[1] || (b[1] = [
          t("circle", {
            cx: "8",
            cy: "6",
            r: "3",
            stroke: "currentColor",
            "stroke-width": "1.5"
          }, null, -1),
          t("path", {
            d: "M3 14C3 11.5 5.5 10 8 10C10.5 10 13 11.5 13 14",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }, null, -1)
        ])])) : (s(), i("svg", yt, [...b[2] || (b[2] = [
          t("circle", {
            cx: "8",
            cy: "8",
            r: "6",
            stroke: "currentColor",
            "stroke-width": "1.5"
          }, null, -1),
          t("circle", {
            cx: "6",
            cy: "7",
            r: "1",
            fill: "currentColor"
          }, null, -1),
          t("circle", {
            cx: "10",
            cy: "7",
            r: "1",
            fill: "currentColor"
          }, null, -1),
          t("path", {
            d: "M6 10C6.5 10.5 7.2 11 8 11C8.8 11 9.5 10.5 10 10",
            stroke: "currentColor",
            "stroke-width": "1",
            "stroke-linecap": "round"
          }, null, -1)
        ])]))
      ], 2),
      t("div", wt, [
        a.message.images?.length ? (s(), i("div", bt, [
          (s(!0), i(P, null, K(a.message.images, (k, L) => (s(), i("img", {
            key: L,
            src: k,
            alt: "",
            class: "msg-img"
          }, null, 8, _t))), 128))
        ])) : T("", !0),
        a.message.files?.length ? (s(), i("div", Ct, [
          (s(!0), i(P, null, K(a.message.files, (k, L) => (s(), i("a", {
            key: L,
            href: k.url,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "msg-file",
            title: k.mime || ""
          }, [
            t("span", $t, g(k.name), 1)
          ], 8, xt))), 128))
        ])) : T("", !0),
        a.message.content ? (s(), i("div", {
          key: 2,
          class: z(["content", { "content-markdown": !u.value && !a.streaming }])
        }, [
          !u.value && !a.streaming ? (s(), ne(o(Qe), {
            key: 0,
            content: a.message.content
          }, null, 8, ["content"])) : (s(), i(P, { key: 1 }, [
            ye(g(a.message.content), 1)
          ], 64))
        ], 2)) : T("", !0),
        !u.value && v.value ? (s(), i("div", St, [
          t("button", {
            class: "think-toggle",
            type: "button",
            "aria-expanded": f.value,
            onClick: b[0] || (b[0] = (k) => f.value = !f.value)
          }, [
            t("span", null, g(o(r)("chat.thinkLabel")), 1),
            t("span", null, g(f.value ? o(r)("chat.thinkCollapse") : o(r)("chat.thinkExpand")), 1)
          ], 8, Mt),
          t("div", {
            class: z(["collapse-grid", { open: f.value }])
          }, [
            t("div", null, [
              t("div", Tt, [
                v.value.raw ? (s(), i("pre", It, g(v.value.raw), 1)) : v.value.summary ? (s(), i("p", Lt, g(v.value.summary), 1)) : T("", !0)
              ])
            ])
          ], 2)
        ])) : T("", !0),
        t("div", Et, [
          t("span", Bt, g($.value), 1),
          !u.value && a.message.emotion ? (s(), i(P, { key: 0 }, [
            b[3] || (b[3] = t("span", { class: "separator" }, "·", -1)),
            t("span", {
              class: "emotion",
              style: ae({ color: o(vt)(o(Se)(a.message.emotion)) })
            }, g(o(r)(`emotion.${o(Se)(a.message.emotion)}`)), 5)
          ], 64)) : T("", !0)
        ])
      ])
    ], 2));
  }
}), Pt = /* @__PURE__ */ he(Dt, [["__scopeId", "data-v-e199848c"]]), Rt = { class: "chat-panel" }, Ft = {
  class: "messages",
  role: "log",
  "aria-live": "polite",
  "aria-relevant": "additions text"
}, Nt = {
  key: 0,
  class: "empty-state"
}, At = {
  key: 1,
  class: "typing-indicator"
}, Ot = { class: "typing-text" }, zt = { class: "input-area" }, Ht = {
  key: 0,
  class: "pending-images"
}, Kt = ["src"], Vt = ["aria-label", "title", "onClick"], Ut = {
  key: 0,
  class: "pending-thumb uploading",
  "aria-hidden": "true"
}, Wt = {
  key: 1,
  class: "pending-files"
}, jt = ["title"], Yt = { class: "pending-file-name" }, Xt = ["title", "onClick"], qt = { class: "wake-text" }, Gt = ["title"], Zt = { class: "input-wrapper" }, Jt = ["title", "disabled"], Qt = ["title", "disabled"], en = ["title", "aria-pressed", "disabled"], tn = ["placeholder", "disabled"], nn = ["aria-label", "title", "disabled"], an = { class: "input-footer" }, on = {
  key: 0,
  class: "connection-status disconnected"
}, sn = {
  key: 1,
  class: "connection-status connected"
}, rn = { class: "hint" }, ln = ["title"], cn = ["disabled"], un = ["disabled"], dn = 80, hn = /* @__PURE__ */ ue({
  __name: "ChatPanel",
  setup(a) {
    const { t: e, locale: r } = de(), n = Ee(), u = Be(), f = et(), { confirm: v } = tt(), $ = M(""), w = M(null), b = M(null), k = M([]), L = M(null), x = M([]), A = M(null), S = M(!1), m = M([]), h = M(!1), C = B(() => I.value === "listening" || I.value === "woken" || I.value === "capturing"), F = B(() => C.value ? e("chat.wakeOnTitle") : e("chat.wakeOffTitle")), fe = B(() => I.value === "capturing" ? G.value ? e("chat.wakeHeardLine", { text: G.value }) : e("chat.wakeCapturing") : I.value === "woken" ? e("chat.wakeWoken") : e("chat.wakeListening", { name: m.value[0] || "" }));
    function U(l) {
      const d = f.values.life?.[l];
      return d == null ? "" : String(d);
    }
    function oe() {
      return U("wake_nickname").split(/[,，、;；\s]+/).map((l) => l.trim()).filter(Boolean);
    }
    function y(l, c) {
      const d = l === "no-nickname" ? e("chat.wakeNeedNickname") : l === "no-engine" ? e("chat.wakeNoEngine") : l === "mic-denied" ? e("chat.wakeMicDenied") : e("chat.wakeFailed", { detail: c || "unknown" });
      re(d, "error");
    }
    function R(l) {
      const c = l.trim();
      if (c) {
        if (n.isTyping) {
          $.value = c, ke(Z);
          return;
        }
        $.value = c, ge();
      }
    }
    async function p() {
      if (!h.value) {
        h.value = !0;
        try {
          await f.loadValues("life");
          const l = oe();
          if (m.value = l, !l.length) {
            y("no-nickname");
            return;
          }
          await pt({
            nicknames: l,
            language: U("asr_language") || "zh",
            onWake: () => {
              b.value?.focus();
            },
            onUtterance: R,
            onError: y
          });
        } finally {
          h.value = !1;
        }
      }
    }
    function j() {
      if (C.value) {
        X();
        return;
      }
      p();
    }
    function Z() {
      const l = b.value;
      l && (l.style.height = "auto", l.style.height = `${Math.min(l.scrollHeight, 120)}px`);
    }
    ve($, () => ke(Z));
    const me = M(!0);
    let pe = !1;
    function Oe() {
      const l = w.value;
      l && (me.value = l.scrollHeight - l.scrollTop - l.clientHeight <= dn);
    }
    function ge() {
      if (n.isTyping) return;
      const l = $.value.trim();
      if (!l && k.value.length === 0 && x.value.length === 0) return;
      const c = [...k.value], d = x.value.map((_) => ({ ..._ }));
      k.value = [], x.value = [], pe = !0, n.sendMessage(l, c, d), $.value = "";
    }
    function ze(l) {
      if (l.key === "Enter" && !l.shiftKey) {
        if (l.isComposing || l.keyCode === 229) return;
        l.preventDefault(), ge();
      }
    }
    function He() {
      L.value?.click();
    }
    async function Ke(l) {
      const c = l.target, d = Array.from(c.files || []);
      if (c.value = "", !!d.length) {
        S.value = !0;
        try {
          for (const _ of d) {
            const O = await n.uploadImage(_);
            k.value.push(O);
          }
        } catch (_) {
          console.error("image upload failed:", _);
          const O = d.length === 1 ? d[0].name : "";
          re(O ? e("chat.uploadFailedNamed", { name: O }) : e("chat.uploadFailed"), "error");
        } finally {
          S.value = !1;
        }
      }
    }
    function Ve(l) {
      k.value = k.value.filter((c) => c !== l);
    }
    function Ue() {
      A.value?.click();
    }
    async function We(l) {
      const c = l.target, d = Array.from(c.files || []);
      if (c.value = "", !!d.length) {
        S.value = !0;
        try {
          for (const _ of d)
            x.value.push(await n.uploadFile(_));
        } catch (_) {
          console.error("file upload failed:", _);
          const O = d.length === 1 ? d[0].name : "";
          re(O ? e("chat.uploadFailedNamed", { name: O }) : e("chat.uploadFailed"), "error");
        } finally {
          S.value = !1;
        }
      }
    }
    function je(l) {
      x.value = x.value.filter((c) => c.url !== l);
    }
    async function Ye(l) {
      const c = Array.from(l.clipboardData?.files || []);
      if (c.length) {
        l.preventDefault(), S.value = !0;
        try {
          for (const d of c)
            d.type.startsWith("image/") ? k.value.push(await n.uploadImage(d)) : x.value.push(await n.uploadFile(d));
        } catch (d) {
          console.error("paste upload failed:", d), re(e("chat.uploadFailed"), "error");
        } finally {
          S.value = !1;
        }
      }
    }
    async function Xe() {
      await v({
        title: e("chat.clear"),
        message: e("chat.clearConfirm"),
        confirmLabel: e("chat.clear"),
        danger: !0
      }) && n.clearMessages();
    }
    function qe() {
      const l = n.messages;
      if (!l.length) return;
      const c = u.persona.name || e("chat.defaultCharacter"), d = new Intl.DateTimeFormat(r.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }), _ = [];
      _.push(`# ${e("chat.exportTitle")}`, ""), _.push(`- ${e("chat.defaultCharacter")}: ${c}`), _.push(`- ${d.format(/* @__PURE__ */ new Date())}`, "");
      for (const D of l) {
        if (!D.content && !D.images?.length && !D.files?.length) continue;
        const Ge = D.role === "user" ? e("chat.you") : c;
        if (_.push(`## ${Ge} · ${d.format(D.timestamp)}`), D.content && _.push("", D.content), D.images?.length) {
          _.push("");
          for (const ie of D.images) _.push(`![image](${ie})`);
        }
        if (D.files?.length) {
          _.push("");
          for (const ie of D.files) _.push(`- [${ie.name}](${ie.url})`);
        }
        _.push("");
      }
      const O = new Blob([_.join(`
`)], { type: "text/markdown;charset=utf-8" }), Ce = URL.createObjectURL(O), J = /* @__PURE__ */ new Date(), se = (D) => String(D).padStart(2, "0"), Q = document.createElement("a");
      Q.href = Ce, Q.download = `0kay-chat-${J.getFullYear()}${se(J.getMonth() + 1)}${se(J.getDate())}-${se(J.getHours())}${se(J.getMinutes())}.md`, document.body.appendChild(Q), Q.click(), Q.remove(), URL.revokeObjectURL(Ce);
    }
    return we(() => {
      n.restoreHistory(), n.isConnected || n.connect(), (async () => (await f.loadValues("life"), U("wake_enabled") === "true" && oe().length && p()))();
    }), be(() => {
      X(), $e(!1);
    }), ve(() => n.isTyping, (l) => $e(l), { immediate: !0 }), ve(
      () => n.messages.length,
      async () => {
        await ke();
        const l = w.value;
        l && ((me.value || pe) && (l.scrollTop = l.scrollHeight, me.value = !0), pe = !1);
      }
    ), (l, c) => (s(), i("div", Rt, [
      t("div", {
        class: "chat-container",
        ref_key: "chatContainer",
        ref: w,
        onScroll: Oe
      }, [
        t("div", Ft, [
          o(n).messages.length === 0 ? (s(), i("div", Nt, [
            c[4] || (c[4] = Le('<div class="empty-icon" data-v-8a0e76e2><svg width="64" height="64" viewBox="0 0 64 64" fill="none" data-v-8a0e76e2><circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" data-v-8a0e76e2></circle><circle cx="32" cy="28" r="8" stroke="currentColor" stroke-width="2" data-v-8a0e76e2></circle><path d="M20 44C20 38 26 34 32 34C38 34 44 38 44 44" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-8a0e76e2></path></svg></div>', 1)),
            t("h3", null, g(o(e)("chat.empty")), 1),
            t("p", null, g(o(e)("chat.emptyHint", { name: o(u).persona.name || o(e)("chat.defaultCharacter") })), 1)
          ])) : T("", !0),
          (s(!0), i(P, null, K(o(n).messages, (d, _) => (s(), ne(Pt, {
            key: d.id,
            message: d,
            streaming: o(n).isTyping && _ === o(n).messages.length - 1
          }, null, 8, ["message", "streaming"]))), 128)),
          o(n).isTyping ? (s(), i("div", At, [
            c[5] || (c[5] = t("div", { class: "typing-dots" }, [
              t("span"),
              t("span"),
              t("span")
            ], -1)),
            t("span", Ot, g(o(u).persona.name || "AI") + " " + g(o(e)("chat.thinking")), 1)
          ])) : T("", !0)
        ])
      ], 544),
      t("div", zt, [
        k.value.length || S.value ? (s(), i("div", Ht, [
          (s(!0), i(P, null, K(k.value, (d) => (s(), i("div", {
            key: d,
            class: "pending-thumb"
          }, [
            t("img", {
              src: d,
              alt: ""
            }, null, 8, Kt),
            t("button", {
              class: "remove-img",
              type: "button",
              "aria-label": o(e)("chat.removeImage"),
              title: o(e)("chat.removeImage"),
              onClick: (_) => Ve(d)
            }, " × ", 8, Vt)
          ]))), 128)),
          S.value ? (s(), i("div", Ut, [...c[6] || (c[6] = [
            t("span", { class: "upload-spinner" }, null, -1)
          ])])) : T("", !0)
        ])) : T("", !0),
        x.value.length ? (s(), i("div", Wt, [
          (s(!0), i(P, null, K(x.value, (d) => (s(), i("span", {
            key: d.url,
            class: "pending-file",
            title: `${d.mime || ""} · ${d.size || 0} B`
          }, [
            t("span", Yt, g(d.name), 1),
            t("button", {
              class: "remove-file",
              type: "button",
              title: o(e)("chat.removeFile"),
              onClick: (_) => je(d.url)
            }, " × ", 8, Xt)
          ], 8, jt))), 128))
        ])) : T("", !0),
        C.value ? (s(), i("div", {
          key: 2,
          class: z(["wake-strip", o(I)])
        }, [
          c[7] || (c[7] = t("span", {
            class: "wake-dot",
            "aria-hidden": "true"
          }, null, -1)),
          t("span", qt, g(fe.value), 1),
          t("button", {
            class: "wake-stop",
            type: "button",
            title: o(e)("chat.wakeOnTitle"),
            onClick: c[0] || (c[0] = //@ts-ignore
            (...d) => o(X) && o(X)(...d))
          }, "×", 8, Gt)
        ], 2)) : T("", !0),
        t("div", Zt, [
          t("input", {
            ref_key: "imageInput",
            ref: L,
            type: "file",
            accept: "image/png,image/jpeg,image/gif,image/webp",
            multiple: "",
            hidden: "",
            onChange: Ke
          }, null, 544),
          t("input", {
            ref_key: "fileInput",
            ref: A,
            type: "file",
            multiple: "",
            hidden: "",
            onChange: We
          }, null, 544),
          t("button", {
            class: "attach-btn",
            type: "button",
            title: o(e)("chat.attachImage"),
            disabled: S.value || !o(n).isConnected,
            onClick: He
          }, [...c[8] || (c[8] = [
            t("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              t("rect", {
                x: "3",
                y: "5",
                width: "18",
                height: "14",
                rx: "2",
                stroke: "currentColor",
                "stroke-width": "2"
              }),
              t("circle", {
                cx: "9",
                cy: "10",
                r: "1.5",
                fill: "currentColor"
              }),
              t("path", {
                d: "M4 17l5-5 4 4 3-3 4 4",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, Jt),
          t("button", {
            class: "attach-btn",
            type: "button",
            title: o(e)("chat.attachFile"),
            disabled: S.value || !o(n).isConnected,
            onClick: Ue
          }, [...c[9] || (c[9] = [
            t("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              t("path", {
                d: "M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, Qt),
          t("button", {
            class: z(["attach-btn wake-btn", { active: C.value }]),
            type: "button",
            title: F.value,
            "aria-pressed": C.value,
            disabled: h.value,
            onClick: j
          }, [...c[10] || (c[10] = [
            t("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none",
              "aria-hidden": "true"
            }, [
              t("rect", {
                x: "9",
                y: "3",
                width: "6",
                height: "11",
                rx: "3",
                stroke: "currentColor",
                "stroke-width": "2"
              }),
              t("path", {
                d: "M5 11a7 7 0 0 0 14 0M12 18v3",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round"
              })
            ], -1)
          ])], 10, en),
          Ze(t("textarea", {
            ref_key: "messageInput",
            ref: b,
            "onUpdate:modelValue": c[1] || (c[1] = (d) => $.value = d),
            class: "message-input",
            placeholder: o(e)("chat.inputPlaceholder"),
            rows: "1",
            onKeydown: ze,
            onPaste: Ye,
            disabled: !o(n).isConnected
          }, null, 40, tn), [
            [Je, $.value]
          ]),
          t("button", {
            class: "send-button",
            "aria-label": o(e)("chat.send"),
            title: o(e)("chat.send"),
            onClick: ge,
            disabled: !$.value.trim() && !k.value.length && !x.value.length || !o(n).isConnected || o(n).isTyping
          }, [...c[11] || (c[11] = [
            t("svg", {
              width: "20",
              height: "20",
              viewBox: "0 0 20 20",
              fill: "none"
            }, [
              t("path", {
                d: "M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, nn)
        ]),
        t("div", an, [
          o(n).isConnected ? (s(), i("span", sn, [
            c[13] || (c[13] = t("span", { class: "status-dot" }, null, -1)),
            ye(" " + g(o(e)("chat.connected")), 1)
          ])) : (s(), i("span", on, [
            c[12] || (c[12] = t("span", { class: "status-dot" }, null, -1)),
            ye(" " + g(o(e)("chat.disconnected")), 1)
          ])),
          t("span", rn, g(o(e)("chat.contextHint", { n: o(n).contextTokens.toLocaleString() })), 1),
          t("button", {
            class: z(["context-btn", { active: o(n).voiceEnabled }]),
            type: "button",
            title: o(n).voiceEnabled ? o(e)("chat.voiceOnTitle") : o(e)("chat.voiceOffTitle"),
            onClick: c[2] || (c[2] = (d) => o(n).setVoiceEnabled(!o(n).voiceEnabled))
          }, g(o(n).voiceEnabled ? o(e)("chat.voiceOn") : o(e)("chat.voiceOff")), 11, ln),
          t("button", {
            class: "context-btn",
            type: "button",
            disabled: o(n).messages.length === 0,
            onClick: qe
          }, g(o(e)("chat.download")), 9, cn),
          t("button", {
            class: "context-btn",
            type: "button",
            disabled: o(n).compacting,
            onClick: c[3] || (c[3] = //@ts-ignore
            (...d) => o(n).compactContext && o(n).compactContext(...d))
          }, g(o(n).compacting ? o(e)("chat.compacting") : o(e)("chat.compact")), 9, un),
          t("button", {
            class: "context-btn danger",
            type: "button",
            onClick: Xe
          }, g(o(e)("chat.clear")), 1)
        ])
      ])
    ]));
  }
}), fn = /* @__PURE__ */ he(hn, [["__scopeId", "data-v-8a0e76e2"]]), mn = { class: "status-panel" }, pn = { class: "panel-header" }, gn = {
  key: 0,
  class: "patch-badge"
}, vn = { class: "panel-content" }, kn = { class: "section character-profile" }, yn = { class: "section-header" }, wn = { class: "section-title" }, bn = ["datetime"], _n = ["data-section", "data-kind"], Cn = { class: "section-header" }, xn = { class: "section-title" }, $n = {
  key: 0,
  class: "mood-display"
}, Sn = {
  key: 0,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Mn = {
  key: 1,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Tn = {
  key: 2,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, In = {
  key: 3,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Ln = {
  key: 4,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, En = {
  key: 1,
  class: "emotion-bars"
}, Bn = { class: "emotion-label" }, Dn = { class: "emotion-bar" }, Pn = {
  key: 0,
  class: "empty-tasks"
}, Rn = /* @__PURE__ */ ue({
  __name: "StatusPanel",
  setup(a) {
    const { t: e } = de(), r = nt(), n = De(), u = Be(), f = M(/* @__PURE__ */ new Date()), v = B(() => {
      const m = u.persona.birthDate;
      if (!m) return null;
      const h = /* @__PURE__ */ new Date(`${m}T00:00:00`);
      if (Number.isNaN(h.getTime()) || h > f.value) return null;
      const C = f.value;
      return C.getFullYear() - h.getFullYear() - +(C.getMonth() < h.getMonth() || C.getMonth() === h.getMonth() && C.getDate() < h.getDate());
    });
    let $ = null;
    function w(m) {
      if (!m || !m.startsWith("life.")) return;
      const h = m.slice(5).split(".").reduce((C, F) => C?.[F], r);
      return typeof h == "function" ? void 0 : h;
    }
    function b(m) {
      if (m.titleKey) {
        const h = e(m.titleKey);
        if (h && h !== m.titleKey) return h;
      }
      return m.title || m.id;
    }
    function k(m) {
      if (m.labelKey) {
        const h = e(m.labelKey);
        if (h && h !== m.labelKey) return h;
      }
      return m.label || m.key;
    }
    function L(m) {
      const h = Number(w(`life.emotion.${m.key}`) ?? 0);
      return m.scale === "remap01" ? (h + 1) / 2 : h;
    }
    we(() => {
      $ = setInterval(() => {
        f.value = /* @__PURE__ */ new Date();
      }, 1e3);
    }), be(() => {
      $ && clearInterval($);
    });
    const x = B(
      () => n.statusSections.filter((m) => m.kind === "mood" || m.kind === "bars")
    ), A = B(() => r.emotionColor), S = B(() => r.emotionMood);
    return (m, h) => (s(), i("div", mn, [
      t("div", pn, [
        t("h2", null, g(o(e)("status.title")), 1),
        o(n).loaded ? (s(), i("span", gn, "patch")) : T("", !0)
      ]),
      t("div", vn, [
        t("section", kn, [
          t("div", yn, [
            t("span", wn, g(o(u).persona.name || o(e)("chat.defaultCharacter")), 1)
          ]),
          t("dl", null, [
            t("div", null, [
              t("dt", null, g(o(e)("status.age")), 1),
              t("dd", null, g(v.value === null ? o(e)("status.birthdayUnset") : o(e)("status.ageValue", { age: v.value })), 1)
            ]),
            t("div", null, [
              t("dt", null, g(o(e)("status.time")), 1),
              t("dd", null, [
                t("time", {
                  datetime: f.value.toISOString()
                }, g(f.value.toLocaleString()), 9, bn)
              ])
            ]),
            t("div", null, [
              t("dt", null, g(o(e)("status.timezone")), 1),
              t("dd", null, g(Intl.DateTimeFormat().resolvedOptions().timeZone), 1)
            ])
          ])
        ]),
        (s(!0), i(P, null, K(x.value, (C) => (s(), i("div", {
          key: C.id,
          class: "section",
          "data-section": C.id,
          "data-kind": C.kind
        }, [
          t("div", Cn, [
            t("span", xn, g(b(C)), 1)
          ]),
          C.kind === "mood" ? (s(), i("div", $n, [
            t("div", {
              class: "mood-icon",
              style: ae({ color: A.value })
            }, [
              S.value === "happy" ? (s(), i("svg", Sn, [...h[0] || (h[0] = [
                t("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                t("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                t("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                t("path", {
                  d: "M14 30C17 34 31 34 34 30",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : S.value === "sad" ? (s(), i("svg", Mn, [...h[1] || (h[1] = [
                t("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                t("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                t("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                t("path", {
                  d: "M16 34C19 30 29 30 32 34",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : S.value === "irritated" ? (s(), i("svg", Tn, [...h[2] || (h[2] = [
                t("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                t("line", {
                  x1: "14",
                  y1: "18",
                  x2: "20",
                  y2: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                t("line", {
                  x1: "34",
                  y1: "18",
                  x2: "28",
                  y2: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                t("path", {
                  d: "M16 34C19 30 29 30 32 34",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : S.value === "sleeping" ? (s(), i("svg", In, [...h[3] || (h[3] = [
                Le('<circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" data-v-45331204></circle><path d="M16 22C17 22 18 22 18 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><path d="M30 22C31 22 32 22 32 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><path d="M18 32C20 34 28 34 30 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><text x="36" y="12" fill="currentColor" font-size="12" font-weight="bold" data-v-45331204>Z</text>', 5)
              ])])) : (s(), i("svg", Ln, [...h[4] || (h[4] = [
                t("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                t("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                t("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                t("path", {
                  d: "M18 30H30",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])]))
            ], 4),
            t("div", {
              class: "mood-label",
              style: ae({ color: A.value })
            }, g(o(e)(`emotion.${S.value}`)), 5)
          ])) : C.kind === "bars" ? (s(), i("div", En, [
            (s(!0), i(P, null, K(C.axes || [], (F) => (s(), i("div", {
              key: F.key,
              class: "emotion-row"
            }, [
              t("span", Bn, g(k(F)), 1),
              t("div", Dn, [
                t("div", {
                  class: "emotion-fill",
                  style: ae({
                    transform: `scaleX(${Math.max(0, Math.min(1, L(F)))})`,
                    backgroundColor: F.color || "#0078d4"
                  })
                }, null, 4)
              ])
            ]))), 128))
          ])) : T("", !0)
        ], 8, _n))), 128)),
        o(n).statusSections.length === 0 ? (s(), i("div", Pn, " No status sections (load life.patch) ")) : T("", !0)
      ])
    ]));
  }
}), Fn = /* @__PURE__ */ he(Rn, [["__scopeId", "data-v-45331204"]]), Nn = {
  key: 0,
  class: "stage-column"
}, An = ["src", "title"], On = ["data-chat-slot"], zn = ["aria-label", "title"], Hn = ["src", "title"], Kn = ["data-chat-slot"], Vn = ["title"], Me = "0kay.web.chat_panel_width_ratio", Te = 320, Un = 360, Ie = 960, Wn = /* @__PURE__ */ ue({
  __name: "ChatPage",
  setup(a) {
    const { t: e } = de(), r = De(), n = Ee(), u = M(!1), f = M(!1), v = B(() => r.chatRegion("stage")), $ = B(() => r.chatRegion("chat")), w = B(() => v.value.some((y) => y.component === "status")), b = B(() => $.value.some((y) => y.component === "chat")), k = M(0.34), L = M(null);
    let x = !1;
    function A() {
      try {
        const y = Number(localStorage.getItem(Me));
        y > 0 && y < 1 && (k.value = y);
      } catch {
      }
    }
    function S(y) {
      k.value = y;
      try {
        localStorage.setItem(Me, String(y));
      } catch {
      }
    }
    function m(y, R) {
      const p = Math.min(Te, y * 0.3), j = Math.min(Ie, y - Un);
      return Math.min(Math.max(R, p), j) / y;
    }
    function h(y) {
      f.value || (x = !0, y.target.setPointerCapture?.(y.pointerId), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none");
    }
    function C(y) {
      if (!x || !L.value) return;
      const R = L.value.getBoundingClientRect(), p = R.right - y.clientX;
      S(m(R.width, p));
    }
    function F() {
      x && (x = !1, document.body.style.cursor = "", document.body.style.userSelect = "");
    }
    function fe(y) {
      if (f.value || y.key !== "ArrowLeft" && y.key !== "ArrowRight") return;
      const R = L.value;
      if (!R) return;
      y.preventDefault();
      const p = R.getBoundingClientRect(), j = k.value * p.width, Z = y.key === "ArrowLeft" ? j + 24 : j - 24;
      S(m(p.width, Z));
    }
    function U() {
      const y = f.value;
      f.value = window.innerWidth <= 960, f.value ? y || (u.value = !1) : u.value = !0;
    }
    we(() => {
      A(), U(), n.setChatVisible(!0), window.addEventListener("resize", U), window.addEventListener("pointermove", C), window.addEventListener("pointerup", F);
    }), be(() => {
      n.setChatVisible(!1), window.removeEventListener("resize", U), window.removeEventListener("pointermove", C), window.removeEventListener("pointerup", F), document.body.style.cursor = "", document.body.style.userSelect = "";
    });
    function oe() {
      u.value = !u.value;
    }
    return (y, R) => (s(), i("div", {
      ref_key: "pageEl",
      ref: L,
      class: z(["chat-page", { "no-chat": !b.value }]),
      style: ae(f.value ? void 0 : { "--chat-w": `min(${Ie}px, max(${Te}px, ${k.value * 100}%))` })
    }, [
      v.value.length ? (s(), i("div", Nn, [
        (s(!0), i(P, null, K(v.value, (p) => (s(), i(P, {
          key: p.id
        }, [
          p.component === "live2d" ? (s(), ne(at, {
            key: 0,
            class: "stage-host"
          })) : p.component === "status" ? (s(), ne(Fn, {
            key: 1,
            class: "status-panel"
          })) : p.component === "iframe" && p.src ? (s(), i("iframe", {
            key: 2,
            class: "slot-frame",
            src: p.src,
            title: p.title || p.id
          }, null, 8, An)) : (s(), i("div", {
            key: 3,
            class: "slot-note",
            "data-chat-slot": p.id
          }, g(p.titleKey ? o(e)(p.titleKey) : p.title || p.id), 9, On))
        ], 64))), 128))
      ])) : T("", !0),
      !f.value && b.value && v.value.length ? (s(), i("div", {
        key: 1,
        ref: "resizer",
        class: "page-resizer",
        role: "separator",
        "aria-orientation": "vertical",
        tabindex: "0",
        "aria-label": o(e)("chat.resizePanel"),
        title: o(e)("chat.resizePanel"),
        onPointerdown: h,
        onKeydown: fe
      }, null, 40, zn)) : T("", !0),
      b.value ? (s(), i("div", {
        key: 2,
        class: z(["chat-column", { open: u.value || !f.value }])
      }, [
        (s(!0), i(P, null, K($.value, (p) => (s(), i(P, {
          key: p.id
        }, [
          p.component === "chat" ? (s(), ne(fn, { key: 0 })) : p.component === "iframe" && p.src ? (s(), i("iframe", {
            key: 1,
            class: "slot-frame fill",
            src: p.src,
            title: p.title || p.id
          }, null, 8, Hn)) : (s(), i("div", {
            key: 2,
            class: "slot-note",
            "data-chat-slot": p.id
          }, g(p.titleKey ? o(e)(p.titleKey) : p.title || p.id), 9, Kn))
        ], 64))), 128))
      ], 2)) : T("", !0),
      f.value && w.value ? (s(), i("button", {
        key: 3,
        class: "status-fab",
        title: o(e)("app.status"),
        onClick: oe
      }, [...R[0] || (R[0] = [
        t("svg", {
          width: "22",
          height: "22",
          viewBox: "0 0 24 24",
          fill: "none"
        }, [
          t("circle", {
            cx: "12",
            cy: "12",
            r: "9",
            stroke: "currentColor",
            "stroke-width": "2"
          }),
          t("circle", {
            cx: "12",
            cy: "12",
            r: "3",
            fill: "currentColor"
          })
        ], -1)
      ])], 8, Vn)) : T("", !0)
    ], 6));
  }
}), Jn = /* @__PURE__ */ he(Wn, [["__scopeId", "data-v-599f785f"]]);
export {
  Jn as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent="@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage[data-v-15b509be]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-15b509be]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-15b509be]:active{cursor:grabbing}.stage-canvas[data-v-15b509be]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-15b509be]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-15b509be]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-15b509be]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-15b509be]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-15b509be]:active{transform:scale(.96)}.stage-reset.dragging[data-v-15b509be]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-15b509be]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-15b509be]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-15b509be]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-e199848c]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-e199848c]{flex-direction:row-reverse}.avatar[data-v-e199848c]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-e199848c]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-e199848c]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-e199848c]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-e199848c]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-e199848c]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-e199848c]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden}.msg-file-name[data-v-e199848c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-e199848c]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-e199848c]{max-width:70%}.content[data-v-e199848c]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.content-markdown[data-v-e199848c]{white-space:normal}.user .content[data-v-e199848c]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-e199848c]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-e199848c]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-e199848c]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-e199848c]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-e199848c]{margin:4px 0}.think-body b[data-v-e199848c]{color:var(--md-on-surface)}.think-summary[data-v-e199848c]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-e199848c]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-e199848c]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-e199848c]{justify-content:flex-end}.separator[data-v-e199848c]{color:var(--neutral-gray-10)}.emotion[data-v-e199848c]{font-weight:500}.chat-panel[data-v-8a0e76e2]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-8a0e76e2]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-8a0e76e2]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-8a0e76e2]{color:var(--md-error)}.chat-container[data-v-8a0e76e2]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-8a0e76e2]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-8a0e76e2]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-8a0e76e2]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-8a0e76e2]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-8a0e76e2]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-8a0e76e2]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-8a0e76e2]{display:flex;gap:4px}.typing-dots span[data-v-8a0e76e2]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-8a0e76e2 1.4s infinite ease-in-out}.typing-dots span[data-v-8a0e76e2]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-8a0e76e2]:nth-child(2){animation-delay:-.16s}@keyframes bounce-8a0e76e2{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-8a0e76e2]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-8a0e76e2]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-8a0e76e2]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-8a0e76e2]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-8a0e76e2]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-8a0e76e2],.pending-files[data-v-8a0e76e2]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-8a0e76e2]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden}.pending-file-name[data-v-8a0e76e2]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-8a0e76e2]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-8a0e76e2]:hover{color:var(--error)}.pending-thumb[data-v-8a0e76e2]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-8a0e76e2]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-8a0e76e2]{position:absolute;top:2px;right:2px;width:22px;height:22px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.pending-thumb.uploading[data-v-8a0e76e2]{display:flex;align-items:center;justify-content:center;background:var(--md-surface-container-high);animation:thumb-shimmer-8a0e76e2 1.2s infinite}.upload-spinner[data-v-8a0e76e2]{width:18px;height:18px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:upload-spin-8a0e76e2 .8s linear infinite}@keyframes upload-spin-8a0e76e2{to{transform:rotate(360deg)}}@keyframes thumb-shimmer-8a0e76e2{0%,to{opacity:1}50%{opacity:.55}}@media(prefers-reduced-motion:reduce){.pending-thumb.uploading[data-v-8a0e76e2]{animation:none}}.attach-btn[data-v-8a0e76e2]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-8a0e76e2]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-8a0e76e2]:disabled{opacity:.5;cursor:not-allowed}.wake-btn.active[data-v-8a0e76e2]{color:var(--md-primary);background:color-mix(in srgb,var(--md-primary) 14%,transparent)}.wake-strip[data-v-8a0e76e2]{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:5px 10px;border-radius:var(--radius-md, 10px);background:color-mix(in srgb,var(--md-primary) 10%,transparent);color:var(--md-primary);font-size:12px}.wake-strip.capturing[data-v-8a0e76e2]{background:color-mix(in srgb,var(--md-primary) 18%,transparent)}.wake-dot[data-v-8a0e76e2]{width:8px;height:8px;border-radius:50%;background:currentColor;animation:wake-pulse-8a0e76e2 1.1s ease-in-out infinite}.wake-strip.capturing .wake-dot[data-v-8a0e76e2]{animation-duration:.5s}.wake-text[data-v-8a0e76e2]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wake-stop[data-v-8a0e76e2]{border:none;background:transparent;color:inherit;cursor:pointer;font-size:15px;line-height:1;padding:0 2px;opacity:.75}.wake-stop[data-v-8a0e76e2]:hover{opacity:1}@keyframes wake-pulse-8a0e76e2{0%,to{opacity:1}50%{opacity:.2}}@media(prefers-reduced-motion:reduce){.wake-dot[data-v-8a0e76e2]{animation:none}}.send-button[data-v-8a0e76e2]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-8a0e76e2]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-8a0e76e2]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-8a0e76e2]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-8a0e76e2]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-8a0e76e2]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-8a0e76e2]{background:var(--success)}.disconnected .status-dot[data-v-8a0e76e2]{background:var(--error)}.hint[data-v-8a0e76e2]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-45331204]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-45331204]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-45331204]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-45331204]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-45331204]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-45331204]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-45331204]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-45331204]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-45331204]{margin-bottom:var(--space-xl)}.section-header[data-v-45331204]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-45331204]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.mood-display[data-v-45331204]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-45331204]{margin-bottom:var(--space-md)}.mood-label[data-v-45331204]{font-size:var(--font-size-md);font-weight:600}.emotion-bars[data-v-45331204]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-45331204]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-45331204]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-45331204]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-45331204]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-45331204]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.chat-page[data-v-599f785f]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-599f785f]{grid-template-columns:1fr}.stage-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-599f785f]{flex:1;min-height:240px}.status-panel[data-v-599f785f]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-599f785f]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-599f785f]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-599f785f]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-599f785f]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-599f785f]:hover,.page-resizer[data-v-599f785f]:active{background:var(--md-primary)}.chat-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-599f785f]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-599f785f]{display:flex;flex-direction:column}.stage-column[data-v-599f785f]{flex:1;min-height:0}.page-resizer[data-v-599f785f]{display:none}.chat-column[data-v-599f785f]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);visibility:hidden;transition:transform var(--transition-normal),visibility 0s linear var(--duration-medium)}.chat-column.open[data-v-599f785f]{transform:translate(0);visibility:visible;transition:transform var(--transition-normal),visibility 0s linear 0s}}.console[data-v-940c88b5]{display:flex;flex-direction:column;min-height:0;height:100%;background:var(--md-surface);color:var(--md-on-surface)}.pane-enter-active[data-v-940c88b5]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel)}.pane-leave-active[data-v-940c88b5]{transition:opacity var(--duration-instant) var(--ease-emphasized-accel)}.pane-enter-from[data-v-940c88b5],.pane-leave-to[data-v-940c88b5]{opacity:0}@media(prefers-reduced-motion:reduce){.pane-enter-active[data-v-940c88b5],.pane-leave-active[data-v-940c88b5]{transition-duration:1ms}}.console-bar[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:flex-end;gap:var(--space-md);padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.tabs[data-v-940c88b5]{display:flex;gap:var(--space-xs)}.tab[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:0 14px;border:0;border-radius:var(--radius-full);background:transparent;color:var(--md-on-surface-variant);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}.tab[data-v-940c88b5]:hover{background:color-mix(in srgb,var(--md-on-surface) 7%,transparent)}.tab.active[data-v-940c88b5]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tab[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.tab-badge[data-v-940c88b5]{min-width:18px;padding:0 5px;border-radius:var(--radius-full);background:var(--md-error-container);color:var(--md-on-error-container);font-size:11px;font-weight:700;text-align:center}.controls[data-v-940c88b5]{display:flex;flex:1;flex-wrap:wrap;align-items:flex-end;gap:var(--space-sm)}.field[data-v-940c88b5]{display:flex;flex-direction:column;gap:2px}.field.grow[data-v-940c88b5]{flex:1;min-width:180px}.field-label[data-v-940c88b5]{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant)}.input[data-v-940c88b5]{min-height:34px;padding:0 10px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-sm);background:var(--md-surface-container-lowest);color:inherit;font:inherit;font-size:13px}.input[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:1px}.check[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap}.btn[data-v-940c88b5]{min-height:34px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast)}.btn[data-v-940c88b5]:hover:not(:disabled){background:var(--md-surface-container-high)}.btn[data-v-940c88b5]:disabled{opacity:.5;cursor:default}.btn[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.status[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);white-space:nowrap}.status .dot[data-v-940c88b5]{width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.status.live .dot[data-v-940c88b5]{background:var(--md-success);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-success) 22%,transparent)}.status.dead .dot[data-v-940c88b5]{background:var(--md-error)}.banner[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-sm);margin:0;padding:var(--space-sm) var(--space-lg);background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px}.banner code[data-v-940c88b5]{flex:1;min-width:0;overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.pane[data-v-940c88b5]{flex:1;min-height:0;overflow:auto}.empty[data-v-940c88b5]{padding:var(--space-xl);color:var(--md-on-surface-variant);font-size:13px}.rows[data-v-940c88b5]{margin:0;padding:0;list-style:none;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,monospace;font-size:12px;line-height:1.55}.row[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;padding:3px var(--space-lg);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.row[data-v-940c88b5]:hover{background:color-mix(in srgb,var(--md-on-surface) 4%,transparent)}.row[data-v-940c88b5]:before{content:\"\";width:3px;align-self:stretch;margin:1px 0;border-radius:2px;background:var(--md-outline)}.row.debug[data-v-940c88b5]:before{background:var(--md-outline)}.row.info[data-v-940c88b5]:before{background:var(--md-primary)}.row.warn[data-v-940c88b5]:before{background:var(--md-warning)}.row.error[data-v-940c88b5]:before{background:var(--md-error)}.row.ok[data-v-940c88b5]:before{background:var(--md-success)}.ts[data-v-940c88b5]{color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.lvl[data-v-940c88b5]{min-width:46px;font-weight:700;color:var(--md-on-surface-variant);white-space:nowrap}.row.warn .lvl[data-v-940c88b5]{color:var(--md-warning)}.row.error .lvl[data-v-940c88b5]{color:var(--md-error)}.component[data-v-940c88b5]{min-width:96px;padding:0 6px;border-radius:var(--radius-sm);background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.msg[data-v-940c88b5]{flex:1;min-width:200px;word-break:break-word}.kv[data-v-940c88b5]{color:var(--md-on-surface-variant);white-space:nowrap}.kv .k[data-v-940c88b5]{opacity:.7}.kv .v[data-v-940c88b5]{color:var(--md-on-surface)}.err[data-v-940c88b5]{color:var(--md-error)}.event[data-v-940c88b5]{padding:0 6px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.dur[data-v-940c88b5]{margin-left:auto;color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.indent[data-v-940c88b5]{flex:none}.link[data-v-940c88b5]{padding:0;border:0;background:none;color:var(--md-primary);font:inherit;font-size:11px;cursor:pointer;text-decoration:underline dotted}.link[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}@media(max-width:720px){.console-bar[data-v-940c88b5]{align-items:stretch}.controls[data-v-940c88b5]{flex-direction:column;align-items:stretch}.component[data-v-940c88b5],.lvl[data-v-940c88b5]{min-width:0}}#app .console[data-v-940c88b5] :is(.tab,.btn){min-height:34px;border-radius:var(--radius-full)}#app .console .input[data-v-940c88b5]{min-height:34px;border-radius:var(--radius-sm)}.plugins-page[data-v-147ee65e]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-147ee65e]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-147ee65e]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-147ee65e],.pp-hero h1[data-v-147ee65e]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-147ee65e]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-147ee65e]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-147ee65e]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.banner-enter-active[data-v-147ee65e]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}.banner-leave-active[data-v-147ee65e]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.banner-enter-from[data-v-147ee65e],.banner-leave-to[data-v-147ee65e]{opacity:0;transform:translateY(-6px)}.pp-stats[data-v-147ee65e]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-147ee65e]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-147ee65e]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-147ee65e]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-147ee65e]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-147ee65e]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-147ee65e]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-147ee65e]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-147ee65e]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-147ee65e var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-147ee65e{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-147ee65e]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-147ee65e]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-147ee65e]{opacity:.62}.plugin-top[data-v-147ee65e]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-147ee65e]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-147ee65e]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-147ee65e]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-147ee65e]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-147ee65e]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-147ee65e]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-147ee65e]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-147ee65e]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-147ee65e]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-147ee65e]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-147ee65e]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-147ee65e]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-147ee65e]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-147ee65e]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-147ee65e]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-147ee65e]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-147ee65e]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-147ee65e]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-147ee65e]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-147ee65e]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-147ee65e]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-147ee65e]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-147ee65e]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-147ee65e]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-147ee65e]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-147ee65e]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-147ee65e]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-147ee65e]{white-space:nowrap}#app .plugins-page .btn[data-v-147ee65e]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-147ee65e]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-147ee65e]:disabled{opacity:.6;cursor:not-allowed}.empty-state[data-v-147ee65e]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-147ee65e]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-147ee65e]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-147ee65e]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-147ee65e]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-147ee65e]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-147ee65e]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-147ee65e],.pd-leave-to[data-v-147ee65e]{opacity:0}.pd-enter-active .pd-dialog[data-v-147ee65e]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-147ee65e]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-147ee65e],.pd-leave-to .pd-dialog[data-v-147ee65e]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-147ee65e]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-147ee65e]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-147ee65e]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-147ee65e]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-147ee65e]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-147ee65e]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-147ee65e]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-147ee65e]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-147ee65e]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-147ee65e]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-147ee65e]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-147ee65e]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-147ee65e]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-147ee65e]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-147ee65e]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-147ee65e]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-147ee65e]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-147ee65e]{color:var(--md-error)}.pd-foot[data-v-147ee65e]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-147ee65e]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn[data-v-147ee65e]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-147ee65e],.pd-leave-active[data-v-147ee65e],.pd-enter-active .pd-dialog[data-v-147ee65e],.pd-leave-active .pd-dialog[data-v-147ee65e]{transition:none}.pd-enter-from .pd-dialog[data-v-147ee65e],.pd-leave-to .pd-dialog[data-v-147ee65e]{transform:none}}.life-settings[data-v-f79f46a2]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-f79f46a2]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-f79f46a2 .52s var(--ls-spring) both}.ls-hero-main[data-v-f79f46a2]{min-width:0}.ls-eyebrow[data-v-f79f46a2]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-f79f46a2]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-f79f46a2]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-f79f46a2]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-f79f46a2]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-f79f46a2]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-f79f46a2]{font-size:16px}.ls-grid[data-v-f79f46a2]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-f79f46a2]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-f79f46a2 .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-f79f46a2]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-f79f46a2]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-f79f46a2]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-f79f46a2]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-f79f46a2]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-f79f46a2]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-f79f46a2]{grid-column:1 / -1}.ls-card-head[data-v-f79f46a2]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-f79f46a2]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-f79f46a2]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-f79f46a2]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-f79f46a2]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-f79f46a2]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-f79f46a2]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-f79f46a2]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-f79f46a2]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-f79f46a2]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-f79f46a2]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-f79f46a2]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-f79f46a2]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-f79f46a2]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-f79f46a2]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-f79f46a2]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-f79f46a2]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-f79f46a2]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-f79f46a2]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-f79f46a2]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-f79f46a2]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-f79f46a2]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-f79f46a2]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-f79f46a2]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-f79f46a2]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-f79f46a2]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-f79f46a2]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-f79f46a2]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-f79f46a2]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-f79f46a2]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-f79f46a2]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-f79f46a2]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-f79f46a2]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-f79f46a2]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}#app .ls-model[data-v-f79f46a2]{border-radius:20px}#app .ls-model.selected[data-v-f79f46a2]{border-radius:20px 20px 20px 8px}.ls-model b[data-v-f79f46a2]{font-size:13px;word-break:break-all}.ls-model span[data-v-f79f46a2]{font-size:12px;color:var(--md-on-surface-variant)}.ls-hint[data-v-f79f46a2]{margin:12px 0 0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.ls-state[data-v-f79f46a2]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-f79f46a2 .32s var(--ls-spring) both}@keyframes ls-rise-f79f46a2{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-f79f46a2{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-f79f46a2],.ls-row[data-v-f79f46a2],.ls-models[data-v-f79f46a2]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-f79f46a2],.ls-card[data-v-f79f46a2],.ls-state[data-v-f79f46a2]{animation:none}}.about[data-v-da8c447d]{display:flex;flex-direction:column;gap:26px}.identity[data-v-da8c447d]{display:flex;align-items:center;gap:16px}.app-icon[data-v-da8c447d]{flex:none;width:56px;height:56px;filter:drop-shadow(0 6px 16px color-mix(in srgb,var(--md-primary) 25%,transparent))}.app-id[data-v-da8c447d]{flex:1;min-width:0}.app-id h2[data-v-da8c447d]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-da8c447d]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-da8c447d]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-da8c447d]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-da8c447d]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-da8c447d]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-da8c447d]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-da8c447d]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.credits[data-v-da8c447d]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-da8c447d]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-da8c447d]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-da8c447d]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-da8c447d]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-da8c447d]{font-size:16px;font-weight:650}.person-info .role[data-v-da8c447d]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-da8c447d]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-da8c447d]{margin-top:6px}.contribs[data-v-da8c447d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-da8c447d]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-da8c447d]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-da8c447d]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-da8c447d]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-da8c447d]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-da8c447d]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-da8c447d]{margin-left:auto}.status-chip[data-v-da8c447d]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-da8c447d]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-da8c447d]:hover{text-decoration:underline}.muted[data-v-da8c447d]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-da8c447d]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-da8c447d]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-hero.warn[data-v-da8c447d]{background:var(--md-warning-container);color:var(--md-on-warning-container);border-color:transparent}.us-hero.none[data-v-da8c447d]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-da8c447d]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-da8c447d]{flex:1;min-width:0}.us-hero-text b[data-v-da8c447d]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-da8c447d]{font-size:13px;opacity:.85}.us-hero-text em[data-v-da8c447d]{font-style:normal;font-weight:700}.us-hero-actions[data-v-da8c447d]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-da8c447d]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-da8c447d]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-da8c447d]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-da8c447d]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-da8c447d]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-da8c447d]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-apply-banner.failed[data-v-da8c447d]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-da8c447d]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-da8c447d]{font-weight:700}.us-apply-label[data-v-da8c447d]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-da8c447d]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-da8c447d]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-da8c447d]{animation:us-spin-da8c447d .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-da8c447d],.us-apply-banner.failed .us-spinner[data-v-da8c447d]{display:none}.us-apply-log[data-v-da8c447d],.us-apply-error[data-v-da8c447d]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-da8c447d{to{transform:rotate(360deg)}}.alert[data-v-da8c447d]{color:var(--md-error)}.updates[data-v-95a0aad4]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-95a0aad4]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-95a0aad4]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-95a0aad4]{display:flex;align-items:center;gap:12px}.us-ico[data-v-95a0aad4]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-95a0aad4]{flex:1;min-width:0}.us-title[data-v-95a0aad4]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-95a0aad4]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-95a0aad4]{display:flex;align-items:center;gap:8px}.us-tag[data-v-95a0aad4]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-95a0aad4]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-95a0aad4]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-95a0aad4]{background:#ffdf9e;color:#4a3800}.us-source[data-v-95a0aad4]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-95a0aad4]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-95a0aad4]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-95a0aad4]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-95a0aad4]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-95a0aad4]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-95a0aad4]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-95a0aad4]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-95a0aad4]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-95a0aad4]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-95a0aad4]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-95a0aad4]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-95a0aad4]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-95a0aad4]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-95a0aad4]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-95a0aad4]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-95a0aad4]{flex:1;min-width:0}.us-hero-text b[data-v-95a0aad4]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-95a0aad4]{font-size:13px;opacity:.85}.us-hero-text em[data-v-95a0aad4]{font-style:normal;font-weight:700}.us-hero-actions[data-v-95a0aad4]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-95a0aad4]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-95a0aad4]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-95a0aad4]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-95a0aad4]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-95a0aad4]{font-weight:700}.us-apply-label[data-v-95a0aad4]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-95a0aad4]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-95a0aad4]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-95a0aad4]{animation:us-spin-95a0aad4 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-95a0aad4],.us-apply-banner.failed .us-spinner[data-v-95a0aad4]{display:none}.us-apply-log[data-v-95a0aad4],.us-apply-error[data-v-95a0aad4]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-95a0aad4{to{transform:rotate(360deg)}}.us-table[data-v-95a0aad4]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-95a0aad4]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-95a0aad4]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-95a0aad4]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-95a0aad4]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden}.us-name-text[data-v-95a0aad4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-95a0aad4]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-95a0aad4]{background:var(--md-success)}.us-dot.warn[data-v-95a0aad4]{background:#e0a800}.us-dot.bad[data-v-95a0aad4]{background:var(--md-error)}.us-ver[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-95a0aad4]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-95a0aad4]{font-weight:650}.us-ver b.good[data-v-95a0aad4]{color:var(--md-success)}.us-arrow[data-v-95a0aad4]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-95a0aad4]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden}.us-status-text[data-v-95a0aad4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-95a0aad4]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-95a0aad4]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-95a0aad4]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-95a0aad4]:hover{text-decoration:underline}.us-empty[data-v-95a0aad4]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-95a0aad4]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-95a0aad4]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.alert[data-v-95a0aad4]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-95a0aad4]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-95a0aad4]{display:none}.us-hero[data-v-95a0aad4]{flex-wrap:wrap}.us-hero-actions[data-v-95a0aad4]{width:100%}}.provider-panel[data-v-d93aed7e]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-d93aed7e]{display:flex;align-items:center;gap:14px}.pp-back[data-v-d93aed7e]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-d93aed7e]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-d93aed7e]{flex:1;min-width:0}.pp-editor-title h2[data-v-d93aed7e]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-d93aed7e]{margin:3px 0 0}.pp-section[data-v-d93aed7e]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-d93aed7e]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-d93aed7e]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-d93aed7e]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-d93aed7e]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-d93aed7e]{margin-bottom:0}.pp-span[data-v-d93aed7e]{grid-column:1 / -1}.pp-req[data-v-d93aed7e]{color:var(--md-error);margin-left:2px}.pp-key[data-v-d93aed7e]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-d93aed7e]{flex:1}.pp-key-toggle[data-v-d93aed7e]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-d93aed7e]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-d93aed7e]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-d93aed7e]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-d93aed7e]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-d93aed7e]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-d93aed7e]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-d93aed7e]{animation:pp-pulse-d93aed7e 1s ease-in-out infinite}@keyframes pp-pulse-d93aed7e{50%{opacity:.15}}.pp-probe[data-v-d93aed7e]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-d93aed7e]{color:var(--md-success)}.pp-probe.err[data-v-d93aed7e]{color:var(--md-error)}.pp-discovered[data-v-d93aed7e]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-d93aed7e]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-d93aed7e]{flex:1;min-width:160px}.pp-mini[data-v-d93aed7e]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-d93aed7e]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-add-model[data-v-d93aed7e]{display:flex;align-items:center;gap:8px;margin-top:8px}.pp-add-model .input[data-v-d93aed7e]{flex:1;min-width:0}.pp-add-model .btn[data-v-d93aed7e]{flex:none;white-space:nowrap}.pp-add-error[data-v-d93aed7e]{color:var(--md-error)}.pp-remove[data-v-d93aed7e]{flex:none;width:26px;height:26px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);font-size:17px;line-height:1;cursor:pointer}.pp-remove[data-v-d93aed7e]:hover{background:color-mix(in srgb,var(--md-error) 14%,transparent);color:var(--md-error)}.pp-models[data-v-d93aed7e]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-d93aed7e]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-d93aed7e]:first-child{border-top:0}.pp-model.off[data-v-d93aed7e]{opacity:.5}.pp-model-name[data-v-d93aed7e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-d93aed7e]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-d93aed7e]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-d93aed7e]{color:#e0a800;cursor:default}.pp-switch[data-v-d93aed7e]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-d93aed7e]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-d93aed7e]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-d93aed7e]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-d93aed7e]{display:flex;gap:10px}.pp-list-head[data-v-d93aed7e]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-d93aed7e]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-d93aed7e]{margin:3px 0 0}.pp-list-actions[data-v-d93aed7e]{display:flex;gap:8px}.pp-cards[data-v-d93aed7e]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-d93aed7e]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-d93aed7e]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-d93aed7e]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-d93aed7e]{opacity:.62}.pp-card-head[data-v-d93aed7e]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-d93aed7e]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-d93aed7e]{width:26px;height:26px}.pp-card-id[data-v-d93aed7e]{flex:1;min-width:0}.pp-card-id strong[data-v-d93aed7e]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-d93aed7e]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-d93aed7e]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-d93aed7e]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-d93aed7e]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-d93aed7e]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-d93aed7e]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-d93aed7e]{color:var(--md-error)}.pp-chips[data-v-d93aed7e]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-d93aed7e]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-d93aed7e],.pp-chip.empty[data-v-d93aed7e]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-d93aed7e]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.pp-empty[data-v-d93aed7e]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-d93aed7e],.pp-cards[data-v-d93aed7e]{grid-template-columns:1fr}}.pairing-panel[data-v-c18959f6]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-c18959f6]{margin:12px 0;color:var(--md-on-surface-variant)}.pairing-panel .pairing-error[data-v-c18959f6]{color:var(--md-error)}article[data-v-c18959f6]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-c18959f6]{font-size:24px;letter-spacing:4px}h4[data-v-c18959f6]{margin:18px 0 0}.pairing-list[data-v-c18959f6]{position:relative}.pair-enter-active[data-v-c18959f6],.pair-leave-active[data-v-c18959f6]{transition:opacity var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out)}.pair-enter-from[data-v-c18959f6],.pair-leave-to[data-v-c18959f6]{opacity:0;transform:translateY(4px)}.pair-leave-active[data-v-c18959f6]{position:absolute;width:100%}.pair-move[data-v-c18959f6]{transition:transform var(--duration-medium) var(--ease-out)}@media(prefers-reduced-motion:reduce){.pair-enter-active[data-v-c18959f6],.pair-leave-active[data-v-c18959f6],.pair-move[data-v-c18959f6]{transition-duration:1ms}}.connection-grid[data-v-b6056614]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,264px);gap:24px;align-items:start}@media(max-width:1000px){.connection-grid[data-v-b6056614]{grid-template-columns:minmax(0,1fr)}}.connection-form .field[data-v-b6056614]{margin-bottom:12px}.connection-qr[data-v-b6056614]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-b6056614]{background:#fff;border-radius:8px;padding:6px;width:100%;max-width:264px;height:auto}.connection-link[data-v-b6056614]{max-width:100%;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.helper-text[data-v-b6056614]{overflow-wrap:anywhere}.toggle-label[data-v-b6056614]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-fb8c17b3]{max-width:920px}.sec-stack[data-v-fb8c17b3]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-fb8c17b3]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-fb8c17b3]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-fb8c17b3]{font-size:15px;font-weight:700}.sec-chip[data-v-fb8c17b3]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-fb8c17b3]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-fb8c17b3]{margin:2px 0 12px}.sec-pin-grid[data-v-fb8c17b3]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-fb8c17b3]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-fb8c17b3]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-fb8c17b3]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-fb8c17b3]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-fb8c17b3]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-fb8c17b3]:hover{background:var(--md-surface-container)}.page-item[data-v-fb8c17b3]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-fb8c17b3]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-fb8c17b3]{width:44px;height:26px}.page-item .toggle-slider[data-v-fb8c17b3]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-fb8c17b3]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-fb8c17b3]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-fb8c17b3]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-fb8c17b3]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-fb8c17b3]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-fb8c17b3]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-fb8c17b3]{margin-top:12px}.sec-error[data-v-fb8c17b3]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-fb8c17b3]{grid-template-columns:1fr}}.mcp-panel[data-v-01485e38]{max-width:900px}.mcp-head[data-v-01485e38]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-01485e38]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-01485e38]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-01485e38]{display:flex;gap:10px}.error-banner[data-v-01485e38]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-01485e38]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-01485e38]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-01485e38]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-01485e38]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-01485e38]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-01485e38]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-01485e38]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-01485e38]{flex:1}.mcp-field>span[data-v-01485e38]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-01485e38],.mcp-field select[data-v-01485e38],.mcp-field textarea[data-v-01485e38]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-01485e38]{opacity:.7}.mcp-field textarea[data-v-01485e38]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-01485e38]:focus,.mcp-field select[data-v-01485e38]:focus,.mcp-field textarea[data-v-01485e38]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-01485e38]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-01485e38]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-01485e38]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-01485e38]{font-family:ui-monospace,monospace}.mail-grid[data-v-01485e38]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-01485e38]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-01485e38]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-01485e38]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-01485e38]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-01485e38]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-01485e38]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-01485e38]:disabled{opacity:.6;cursor:not-allowed}#app .mcp-panel[data-v-01485e38] :is(.btn,.mcp-remove){border-radius:999px}#app .mcp-panel .mcp-field[data-v-01485e38] :is(input,select,textarea){border-radius:12px}@media(max-width:720px){.mail-grid[data-v-01485e38]{grid-template-columns:1fr}}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.models-field[data-v-7089f4a3]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-7089f4a3]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-7089f4a3]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-7089f4a3]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-7089f4a3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-7089f4a3]{display:inline-flex;gap:4px}.models-actions button[data-v-7089f4a3]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-7089f4a3]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-7089f4a3]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-7089f4a3]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.usage-page[data-v-e1479886]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-e1479886]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-e1479886]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-e1479886]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-e1479886]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-e1479886]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-e1479886]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-e1479886]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-e1479886]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-e1479886]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .usage-page .btn[data-v-e1479886]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-e1479886]:disabled{opacity:.55;cursor:not-allowed}.overview[data-v-e1479886]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-e1479886]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-e1479886]{display:grid;place-items:center}.donut[data-v-e1479886]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-e1479886]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-e1479886]{fill:none;stroke-width:5}.donut-track[data-v-e1479886]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-e1479886]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-e1479886]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-e1479886]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-e1479886]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-e1479886]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-e1479886]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-e1479886]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-e1479886]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-e1479886]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-e1479886]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-e1479886]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-e1479886]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-e1479886]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-e1479886]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-e1479886]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-e1479886]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-e1479886]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-e1479886]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-e1479886]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-e1479886]{background:var(--md-primary)}.dot.completion[data-v-e1479886]{background:var(--md-tertiary)}.mini-stack[data-v-e1479886]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-e1479886]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-e1479886]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-e1479886]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-e1479886]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-e1479886]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-e1479886]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-e1479886]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-e1479886]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-e1479886]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-e1479886]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-e1479886]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-e1479886]{position:absolute;inset:0}.grid span[data-v-e1479886]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-e1479886]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-e1479886]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-e1479886]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-e1479886]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-e1479886]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-e1479886]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-e1479886]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-e1479886]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-e1479886 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-e1479886]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-e1479886]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-e1479886]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-e1479886]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-e1479886]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-e1479886]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-e1479886]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-e1479886]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-e1479886]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-e1479886]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-e1479886]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-e1479886]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-e1479886]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-e1479886]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}.usage-loading[data-v-e1479886]{display:grid;grid-template-columns:minmax(220px,.9fr) 1.5fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-xl)}.skeleton[data-v-e1479886]{border-radius:32px;background:var(--md-surface-container-low);min-height:180px;animation:sk-shimmer-e1479886 1.4s ease-in-out infinite}.sk-donut[data-v-e1479886]{min-height:220px}@keyframes sk-shimmer-e1479886{0%,to{opacity:1}50%{opacity:.55}}@media(max-width:980px){.usage-loading[data-v-e1479886]{grid-template-columns:1fr 1fr}}@media(max-width:640px){.usage-loading[data-v-e1479886]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.skeleton[data-v-e1479886]{animation:none;opacity:.7}}@keyframes up-e1479886{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-e1479886]{grid-template-columns:1fr 1fr}.mini-stack[data-v-e1479886]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-e1479886],.mini-stack[data-v-e1479886]{grid-template-columns:1fr}.chart[data-v-e1479886]{height:200px;padding-left:34px}.grid span i[data-v-e1479886]{left:-34px;width:28px}.axis span[data-v-e1479886]{font-size:11px}}@media(max-width:560px){.axis span[data-v-e1479886]{font-size:10px}.axis span[data-v-e1479886]:nth-child(2n){visibility:hidden}}\n";document.head.appendChild(s)}})();
