import { ref as L, defineComponent as Ue, computed as F, openBlock as c, createElementBlock as d, normalizeClass as ee, createElementVNode as o, Fragment as j, renderList as he, createCommentVNode as O, toDisplayString as b, createBlock as Ne, unref as s, createTextVNode as ze, normalizeStyle as _e, watch as Ie, nextTick as Ge, onMounted as et, onUnmounted as tt, createStaticVNode as Rt, withDirectives as Qt, vModelText as en, withModifiers as De } from "vue";
import { useI18n as Ve } from "vue-i18n";
import { MarkdownContent as tn, useChatStore as Bt, useWizardStore as ut, useSettingsSectionsStore as nn, useConfirm as on, useLifeStore as Dt, useUIPatchesStore as Ot, live2dRuntimeReady as an } from "@0kay/host";
const Qe = L([]);
let sn = 0;
const ct = /* @__PURE__ */ new Map();
function rn(i) {
  const n = ct.get(i);
  n && clearTimeout(n), ct.delete(i), Qe.value = Qe.value.filter((u) => u.id !== i);
}
function qe(i, n = "info", u) {
  const a = {
    id: ++sn,
    kind: n,
    message: i,
    duration: n === "error" ? 6500 : 3500
  };
  return Qe.value = [...Qe.value.slice(-4), a], ct.set(a.id, setTimeout(() => rn(a.id), a.duration)), a.id;
}
const V = L("off"), fe = L(""), Ee = L(""), Je = 2600, ln = 9e3, cn = 850, un = 0.012, dn = 0.02;
let K = null, Pe = null, Oe = null, te = !0, dt = !1, Ze = null, Se = "wake", pe = "";
const fn = (i) => new Promise((n) => setTimeout(n, i));
function $t(i) {
  return i.toLowerCase().replace(/[\s\u3000]+/g, "").replace(/[，。！？、,.!?~～…:：;；"'“”‘’()（）[\]【】<>《》\-—_/\\]+/g, "");
}
function Ft(i, n) {
  const u = $t(i);
  return u ? n.some((a) => {
    const l = $t(a);
    return l.length > 0 && u.includes(l);
  }) : !1;
}
function hn() {
  const i = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  if (typeof MediaRecorder > "u") return "";
  for (const n of i)
    if (MediaRecorder.isTypeSupported?.(n)) return n;
  return "";
}
async function vn() {
  try {
    const i = await fetch("/api/asr", { signal: AbortSignal.timeout(5e3) });
    return i.ok ? !!(await i.json()).configured : !1;
  } catch {
    return !1;
  }
}
async function Nt(i) {
  const n = new FormData(), u = i.type || "audio/webm", a = u.includes("mp4") ? "m4a" : u.includes("ogg") ? "ogg" : u.includes("wav") ? "wav" : "webm";
  n.append("audio", i, `chunk.${a}`), K?.language && n.append("language", K.language);
  const l = await fetch("/api/asr", { method: "POST", body: n });
  if (l.status === 503) return { text: "", configured: !1 };
  if (!l.ok) throw new Error(await l.text());
  const y = await l.json();
  return { text: String(y.text || ""), configured: !0 };
}
function mn(i) {
  const n = window.AudioContext || window.webkitAudioContext;
  Oe = new n();
  const u = Oe.createMediaStreamSource(i), a = Oe.createAnalyser();
  a.fftSize = 1024, u.connect(a);
  const l = new Float32Array(a.fftSize);
  return {
    read() {
      a.getFloatTimeDomainData(l);
      let y = 0;
      for (let S = 0; S < l.length; S++) y += l[S] * l[S];
      return Math.sqrt(y / l.length);
    },
    close() {
      try {
        u.disconnect();
      } catch {
      }
      try {
        Oe?.close();
      } catch {
      }
      Oe = null;
    }
  };
}
function Fe(i, n = !1) {
  let u = () => {
  };
  return { blob: new Promise((l) => {
    if (!Pe || typeof MediaRecorder > "u") {
      l(null);
      return;
    }
    const y = hn();
    let S;
    try {
      S = new MediaRecorder(Pe, y ? { mimeType: y } : void 0);
    } catch {
      l(null);
      return;
    }
    const _ = [], I = n ? mn(Pe) : null;
    let x = 0, $ = 0, N = !1;
    const D = () => {
      if (!N) {
        N = !0, I && I.close(), clearTimeout(G), clearInterval(B);
        try {
          S.state !== "inactive" && S.stop();
        } catch {
        }
      }
    };
    u = D;
    const G = setTimeout(D, i), B = setInterval(() => {
      if (!I) return;
      const k = I.read(), p = Date.now();
      if (k >= dn) {
        x = p, $ = 0;
        return;
      }
      if (!(!x || p - x < 500)) {
        if (k > un) {
          $ = 0;
          return;
        }
        $ ? p - $ >= cn && D() : $ = p;
      }
    }, 80);
    S.ondataavailable = (k) => {
      k.data && k.data.size && _.push(k.data);
    }, S.onstop = () => {
      I && I.close(), l(_.length ? new Blob(_, { type: S.mimeType || y || "audio/webm" }) : null);
    };
    try {
      S.start();
    } catch {
      D(), l(null);
    }
  }), cancel: () => u() };
}
function gn() {
  try {
    const i = window.AudioContext || window.webkitAudioContext, n = new i(), u = n.currentTime;
    for (const [a, l] of [660, 880].entries()) {
      const y = n.createOscillator(), S = n.createGain();
      y.type = "sine", y.frequency.value = l, S.gain.setValueAtTime(1e-4, u + a * 0.09), S.gain.exponentialRampToValueAtTime(0.06, u + a * 0.09 + 0.02), S.gain.exponentialRampToValueAtTime(1e-4, u + a * 0.09 + 0.13), y.connect(S).connect(n.destination), y.start(u + a * 0.09), y.stop(u + a * 0.09 + 0.15);
    }
    setTimeout(() => {
      try {
        n.close();
      } catch {
      }
    }, 600);
  } catch {
  }
}
async function pn(i) {
  if (!K || te) return;
  V.value = "woken", gn(), K.onWake(i), V.value = "capturing";
  const n = await Fe(ln, !0).blob;
  if (!te) {
    if (n && n.size > 2e3)
      try {
        const a = (await Nt(n)).text.trim();
        a && (Ee.value = a, K?.onUtterance(a));
      } catch {
      }
    !te && fe.value === "core" && (V.value = "listening");
  }
}
async function yn() {
  let i = Fe(Je);
  try {
    for (; !te && fe.value === "core"; ) {
      if (dt) {
        i?.cancel(), i = null, await fn(250);
        continue;
      }
      i || (i = Fe(Je));
      const n = await i.blob;
      if (te || fe.value !== "core") return;
      if (i = Fe(Je), !n || n.size < 1200) continue;
      let u;
      try {
        u = await Nt(n);
      } catch {
        continue;
      }
      if (!u.configured) {
        fe.value = "", Ut();
        return;
      }
      const a = u.text.trim();
      a && (Ee.value = a, K?.onHeard?.(a), K && Ft(a, K.nicknames) && (i?.cancel(), i = null, await pn(a), !te && fe.value === "core" && (i = Fe(Je))));
    }
  } finally {
    i?.cancel();
  }
}
function zt() {
  const i = window;
  return i.SpeechRecognition || i.webkitSpeechRecognition || null;
}
function Ut() {
  const i = zt();
  if (!i) {
    xe("no-engine");
    return;
  }
  fe.value !== "browser" && (fe.value = "browser"), Se = "wake", pe = "";
  const n = new i();
  Ze = n, n.lang = K?.language || "zh-CN", n.continuous = !0, n.interimResults = !0, n.onresult = (u) => {
    let a = "";
    for (let l = u.resultIndex; l < u.results.length; l++)
      u.results[l].isFinal && (a += u.results[l][0].transcript);
    if (a = a.trim(), !!a) {
      if (Ee.value = a, K?.onHeard?.(a), Se === "wake") {
        K && Ft(a, K.nicknames) && (V.value = "woken", K.onWake(a), Se = "capture", pe = "", V.value = "capturing");
        return;
      }
      pe = `${pe}${a}`.trim();
    }
  }, n.onend = () => {
    if (!te) {
      Se === "capture" && pe && (K?.onUtterance(pe), pe = "", Se = "wake", V.value = "listening");
      try {
        n.start();
      } catch {
      }
    }
  }, n.onerror = (u) => {
    if (u?.error === "not-allowed" || u?.error === "service-not-allowed") {
      xe("mic-denied");
      return;
    }
    u?.error === "no-speech" || u?.error === "aborted" || xe("error", String(u?.error || "speech recognition failed"));
  };
  try {
    n.start(), V.value = "listening";
  } catch (u) {
    xe("error", u?.message || "speech recognition failed");
  }
}
function xe(i, n) {
  $e(), V.value = "error", K?.onError?.(i, n);
}
async function wn(i) {
  if ($e(), K = i, te = !1, dt = !1, Ee.value = "", !i.nicknames.length) {
    xe("no-nickname");
    return;
  }
  if (await vn()) {
    if (te) return;
    fe.value = "core";
    try {
      Pe = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !0, noiseSuppression: !0 } });
    } catch (n) {
      const u = n?.name === "NotAllowedError" || n?.name === "SecurityError";
      xe(u ? "mic-denied" : "error", n?.message);
      return;
    }
    if (te) {
      Vt();
      return;
    }
    V.value = "listening", yn();
    return;
  }
  if (zt()) {
    Ut();
    return;
  }
  xe("no-engine");
}
function Vt() {
  try {
    Pe?.getTracks().forEach((i) => i.stop());
  } catch {
  }
  Pe = null;
}
function $e() {
  if (te = !0, Vt(), Ze) {
    const i = Ze;
    Ze = null, i.onend = null, i.onresult = null, i.onerror = null;
    try {
      i.stop();
    } catch {
    }
  }
  Se = "wake", pe = "", fe.value = "", V.value !== "error" && (V.value = "off");
}
function It(i) {
  dt = i;
}
function Pt(i) {
  return i.irritation > 0.7 ? "irritated" : i.valence > 0.5 ? "happy" : i.valence < -0.3 ? "sad" : "neutral";
}
const kn = {
  happy: "#107c10",
  sad: "#0078d4",
  irritated: "#d13438",
  neutral: "#8a8886"
};
function bn(i) {
  return kn[i];
}
const xn = {
  key: 0,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, _n = {
  key: 1,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, Cn = { class: "content-wrapper" }, Mn = {
  key: 0,
  class: "images"
}, Sn = ["src"], $n = {
  key: 1,
  class: "files"
}, In = ["href", "title"], Pn = { class: "msg-file-name" }, En = {
  key: 3,
  class: "media-row"
}, Ln = { class: "media-chip" }, Tn = {
  key: 4,
  class: "selfie"
}, An = ["src", "alt"], Rn = {
  key: 1,
  class: "selfie-pending"
}, Bn = {
  key: 5,
  class: "think-panel"
}, Dn = ["aria-expanded"], On = { class: "think-body" }, Fn = {
  key: 0,
  class: "think-raw"
}, Nn = {
  key: 1,
  class: "think-summary"
}, zn = { class: "meta" }, Un = { class: "time" }, Vn = /* @__PURE__ */ Ue({
  __name: "MessageBubble",
  props: {
    message: {},
    streaming: { type: Boolean }
  },
  setup(i) {
    const n = i, { t: u, locale: a } = Ve(), l = F(() => n.message.role === "user"), y = L(!1), S = F(() => {
      if (!n.message.thinkSummary) return null;
      try {
        const I = JSON.parse(n.message.thinkSummary);
        if (typeof I.raw == "string" && I.raw.trim()) return { raw: I.raw };
        if (typeof I.summary == "string" && I.summary.trim()) return I;
        const x = I.intent || u("messageBubble.intentDefault"), $ = I.strategy || u("messageBubble.strategyDefault");
        return { summary: u("messageBubble.summary", { intent: x, strategy: $ }) };
      } catch {
        return { summary: n.message.thinkSummary };
      }
    }), _ = F(() => {
      const I = n.message.timestamp, x = I.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
      return new Intl.DateTimeFormat(a.value, {
        ...x ? {} : { year: "numeric" },
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }).format(I);
    });
    return (I, x) => (c(), d("div", {
      class: ee(["message", { user: l.value, assistant: !l.value }])
    }, [
      o("div", {
        class: ee(["avatar", { "user-avatar": l.value, "assistant-avatar": !l.value }])
      }, [
        l.value ? (c(), d("svg", xn, [...x[1] || (x[1] = [
          o("circle", {
            cx: "8",
            cy: "6",
            r: "3",
            stroke: "currentColor",
            "stroke-width": "1.5"
          }, null, -1),
          o("path", {
            d: "M3 14C3 11.5 5.5 10 8 10C10.5 10 13 11.5 13 14",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }, null, -1)
        ])])) : (c(), d("svg", _n, [...x[2] || (x[2] = [
          o("circle", {
            cx: "8",
            cy: "8",
            r: "6",
            stroke: "currentColor",
            "stroke-width": "1.5"
          }, null, -1),
          o("circle", {
            cx: "6",
            cy: "7",
            r: "1",
            fill: "currentColor"
          }, null, -1),
          o("circle", {
            cx: "10",
            cy: "7",
            r: "1",
            fill: "currentColor"
          }, null, -1),
          o("path", {
            d: "M6 10C6.5 10.5 7.2 11 8 11C8.8 11 9.5 10.5 10 10",
            stroke: "currentColor",
            "stroke-width": "1",
            "stroke-linecap": "round"
          }, null, -1)
        ])]))
      ], 2),
      o("div", Cn, [
        i.message.images?.length ? (c(), d("div", Mn, [
          (c(!0), d(j, null, he(i.message.images, ($, N) => (c(), d("img", {
            key: N,
            src: $,
            alt: "",
            class: "msg-img"
          }, null, 8, Sn))), 128))
        ])) : O("", !0),
        i.message.files?.length ? (c(), d("div", $n, [
          (c(!0), d(j, null, he(i.message.files, ($, N) => (c(), d("a", {
            key: N,
            href: $.url,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "msg-file",
            title: $.mime || ""
          }, [
            o("span", Pn, b($.name), 1)
          ], 8, In))), 128))
        ])) : O("", !0),
        i.message.content ? (c(), d("div", {
          key: 2,
          class: ee(["content", { "content-markdown": !l.value && !i.streaming }])
        }, [
          !l.value && !i.streaming ? (c(), Ne(s(tn), {
            key: 0,
            content: i.message.content
          }, null, 8, ["content"])) : (c(), d(j, { key: 1 }, [
            ze(b(i.message.content), 1)
          ], 64))
        ], 2)) : O("", !0),
        !l.value && (i.message.media?.voice || i.message.media?.call) ? (c(), d("div", En, [
          o("span", Ln, [
            x[3] || (x[3] = o("svg", {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              "aria-hidden": "true"
            }, [
              o("path", {
                d: "M12 3v18M8 7v10M16 7v10M4 10v4M20 10v4",
                stroke: "currentColor",
                "stroke-width": "1.8",
                "stroke-linecap": "round"
              })
            ], -1)),
            ze(" " + b(i.message.media?.call ? s(u)("chat.mediaCall") : s(u)("chat.mediaVoice")), 1)
          ])
        ])) : O("", !0),
        !l.value && i.message.media?.selfie ? (c(), d("div", Tn, [
          i.message.selfieUrl ? (c(), d("img", {
            key: 0,
            src: i.message.selfieUrl,
            alt: i.message.media.selfie,
            class: "selfie-img"
          }, null, 8, An)) : (c(), d("div", Rn, [
            x[4] || (x[4] = o("span", {
              class: "selfie-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            ze(" " + b(s(u)("chat.mediaSelfieDrawing")), 1)
          ]))
        ])) : O("", !0),
        !l.value && S.value ? (c(), d("div", Bn, [
          o("button", {
            class: "think-toggle",
            type: "button",
            "aria-expanded": y.value,
            onClick: x[0] || (x[0] = ($) => y.value = !y.value)
          }, [
            o("span", null, b(s(u)("chat.thinkLabel")), 1),
            o("span", null, b(y.value ? s(u)("chat.thinkCollapse") : s(u)("chat.thinkExpand")), 1)
          ], 8, Dn),
          o("div", {
            class: ee(["collapse-grid", { open: y.value }])
          }, [
            o("div", null, [
              o("div", On, [
                S.value.raw ? (c(), d("pre", Fn, b(S.value.raw), 1)) : S.value.summary ? (c(), d("p", Nn, b(S.value.summary), 1)) : O("", !0)
              ])
            ])
          ], 2)
        ])) : O("", !0),
        o("div", zn, [
          o("span", Un, b(_.value), 1),
          !l.value && i.message.emotion ? (c(), d(j, { key: 0 }, [
            x[5] || (x[5] = o("span", { class: "separator" }, "·", -1)),
            o("span", {
              class: "emotion",
              style: _e({ color: s(bn)(s(Pt)(i.message.emotion)) })
            }, b(s(u)(`emotion.${s(Pt)(i.message.emotion)}`)), 5)
          ], 64)) : O("", !0)
        ])
      ])
    ], 2));
  }
}), Ke = (i, n) => {
  const u = i.__vccOpts || i;
  for (const [a, l] of n)
    u[a] = l;
  return u;
}, Kn = /* @__PURE__ */ Ke(Vn, [["__scopeId", "data-v-5eead54f"]]), Xn = { class: "chat-panel" }, Hn = {
  class: "messages",
  role: "log",
  "aria-live": "polite",
  "aria-relevant": "additions text"
}, Yn = {
  key: 0,
  class: "empty-state"
}, Wn = {
  key: 1,
  class: "typing-indicator"
}, jn = { class: "typing-text" }, qn = { class: "input-area" }, Jn = {
  key: 0,
  class: "pending-images"
}, Gn = ["src"], Zn = ["aria-label", "title", "onClick"], Qn = {
  key: 0,
  class: "pending-thumb uploading",
  "aria-hidden": "true"
}, eo = {
  key: 1,
  class: "pending-files"
}, to = ["title"], no = { class: "pending-file-name" }, oo = ["title", "onClick"], ao = {
  key: 2,
  class: "call-strip"
}, io = { class: "call-text" }, so = { class: "wake-text" }, ro = ["title"], lo = { class: "input-wrapper" }, co = ["title", "disabled"], uo = ["title", "disabled"], fo = ["title", "aria-pressed", "disabled"], ho = ["placeholder", "disabled"], vo = ["aria-label", "title", "disabled"], mo = { class: "input-footer" }, go = {
  key: 0,
  class: "connection-status disconnected"
}, po = {
  key: 1,
  class: "connection-status connected"
}, yo = { class: "hint" }, wo = ["title"], ko = ["disabled"], bo = ["disabled"], xo = 80, _o = /* @__PURE__ */ Ue({
  __name: "ChatPanel",
  setup(i) {
    const { t: n, locale: u } = Ve(), a = Bt(), l = ut(), y = nn(), { confirm: S } = on(), _ = L(""), I = L(null), x = L(null), $ = L([]), N = L(null), D = L([]), G = L(null), B = L(!1), k = L([]), p = L(!1), T = F(() => V.value === "listening" || V.value === "woken" || V.value === "capturing"), U = F(() => T.value ? n("chat.wakeOnTitle") : n("chat.wakeOffTitle")), re = F(() => V.value === "capturing" ? Ee.value ? n("chat.wakeHeardLine", { text: Ee.value }) : n("chat.wakeCapturing") : V.value === "woken" ? n("chat.wakeWoken") : n("chat.wakeListening", { name: k.value[0] || "" }));
    function Z(h) {
      const v = y.values.life?.[h];
      return v == null ? "" : String(v);
    }
    function ve() {
      return Z("wake_nickname").split(/[,，、;；\s]+/).map((h) => h.trim()).filter(Boolean);
    }
    function P(h, f) {
      const v = h === "no-nickname" ? n("chat.wakeNeedNickname") : h === "no-engine" ? n("chat.wakeNoEngine") : h === "mic-denied" ? n("chat.wakeMicDenied") : n("chat.wakeFailed", { detail: f || "unknown" });
      qe(v, "error");
    }
    function H(h) {
      const f = h.trim();
      if (f) {
        if (a.isTyping) {
          _.value = f, Ge(ge);
          return;
        }
        _.value = f, le();
      }
    }
    async function C() {
      if (!p.value) {
        p.value = !0;
        try {
          await y.loadValues("life");
          const h = ve();
          if (k.value = h, !h.length) {
            P("no-nickname");
            return;
          }
          await wn({
            nicknames: h,
            language: Z("asr_language") || "zh",
            onWake: () => {
              x.value?.focus();
            },
            onUtterance: H,
            onError: P
          });
        } finally {
          p.value = !1;
        }
      }
    }
    function me() {
      if (T.value) {
        $e();
        return;
      }
      C();
    }
    function ge() {
      const h = x.value;
      h && (h.style.height = "auto", h.style.height = `${Math.min(h.scrollHeight, 120)}px`);
    }
    Ie(_, () => Ge(ge));
    const Le = L(!0);
    let w = !1;
    function g() {
      const h = I.value;
      h && (Le.value = h.scrollHeight - h.scrollTop - h.clientHeight <= xo);
    }
    function le() {
      if (a.isTyping) return;
      const h = _.value.trim();
      if (!h && $.value.length === 0 && D.value.length === 0) return;
      const f = [...$.value], v = D.value.map((M) => ({ ...M }));
      $.value = [], D.value = [], w = !0, a.sendMessage(h, f, v), _.value = "";
    }
    function Ce(h) {
      if (h.key === "Enter" && !h.shiftKey) {
        if (h.isComposing || h.keyCode === 229) return;
        h.preventDefault(), le();
      }
    }
    function nt() {
      N.value?.click();
    }
    async function z(h) {
      const f = h.target, v = Array.from(f.files || []);
      if (f.value = "", !!v.length) {
        B.value = !0;
        try {
          for (const M of v) {
            const q = await a.uploadImage(M);
            $.value.push(q);
          }
        } catch (M) {
          console.error("image upload failed:", M);
          const q = v.length === 1 ? v[0].name : "";
          qe(q ? n("chat.uploadFailedNamed", { name: q }) : n("chat.uploadFailed"), "error");
        } finally {
          B.value = !1;
        }
      }
    }
    function Me(h) {
      $.value = $.value.filter((f) => f !== h);
    }
    function ye() {
      G.value?.click();
    }
    async function ne(h) {
      const f = h.target, v = Array.from(f.files || []);
      if (f.value = "", !!v.length) {
        B.value = !0;
        try {
          for (const M of v)
            D.value.push(await a.uploadFile(M));
        } catch (M) {
          console.error("file upload failed:", M);
          const q = v.length === 1 ? v[0].name : "";
          qe(q ? n("chat.uploadFailedNamed", { name: q }) : n("chat.uploadFailed"), "error");
        } finally {
          B.value = !1;
        }
      }
    }
    function Te(h) {
      D.value = D.value.filter((f) => f.url !== h);
    }
    async function oe(h) {
      const f = Array.from(h.clipboardData?.files || []);
      if (f.length) {
        h.preventDefault(), B.value = !0;
        try {
          for (const v of f)
            v.type.startsWith("image/") ? $.value.push(await a.uploadImage(v)) : D.value.push(await a.uploadFile(v));
        } catch (v) {
          console.error("paste upload failed:", v), qe(n("chat.uploadFailed"), "error");
        } finally {
          B.value = !1;
        }
      }
    }
    async function ce() {
      await S({
        title: n("chat.clear"),
        message: n("chat.clearConfirm"),
        confirmLabel: n("chat.clear"),
        danger: !0
      }) && a.clearMessages();
    }
    function ae() {
      const h = a.messages;
      if (!h.length) return;
      const f = l.persona.name || n("chat.defaultCharacter"), v = new Intl.DateTimeFormat(u.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }), M = [];
      M.push(`# ${n("chat.exportTitle")}`, ""), M.push(`- ${n("chat.defaultCharacter")}: ${f}`), M.push(`- ${v.format(/* @__PURE__ */ new Date())}`, "");
      for (const X of h) {
        if (!X.content && !X.images?.length && !X.files?.length) continue;
        const ot = X.role === "user" ? n("chat.you") : f;
        if (M.push(`## ${ot} · ${v.format(X.timestamp)}`), X.content && M.push("", X.content), X.images?.length) {
          M.push("");
          for (const ke of X.images) M.push(`![image](${ke})`);
        }
        if (X.files?.length) {
          M.push("");
          for (const ke of X.files) M.push(`- [${ke.name}](${ke.url})`);
        }
        M.push("");
      }
      const q = new Blob([M.join(`
`)], { type: "text/markdown;charset=utf-8" }), Ae = URL.createObjectURL(q), ie = /* @__PURE__ */ new Date(), we = (X) => String(X).padStart(2, "0"), Y = document.createElement("a");
      Y.href = Ae, Y.download = `0kay-chat-${ie.getFullYear()}${we(ie.getMonth() + 1)}${we(ie.getDate())}-${we(ie.getHours())}${we(ie.getMinutes())}.md`, document.body.appendChild(Y), Y.click(), Y.remove(), URL.revokeObjectURL(Ae);
    }
    return et(() => {
      a.restoreHistory(), a.isConnected || a.connect(), (async () => (await y.loadValues("life"), Z("wake_enabled") === "true" && ve().length && C()))();
    }), tt(() => {
      $e(), It(!1);
    }), Ie(() => a.isTyping, (h) => It(h), { immediate: !0 }), Ie(
      () => a.messages.length,
      async () => {
        await Ge();
        const h = I.value;
        h && ((Le.value || w) && (h.scrollTop = h.scrollHeight, Le.value = !0), w = !1);
      }
    ), (h, f) => (c(), d("div", Xn, [
      o("div", {
        class: "chat-container",
        ref_key: "chatContainer",
        ref: I,
        onScroll: g
      }, [
        o("div", Hn, [
          s(a).messages.length === 0 ? (c(), d("div", Yn, [
            f[5] || (f[5] = Rt('<div class="empty-icon" data-v-044d5238><svg width="64" height="64" viewBox="0 0 64 64" fill="none" data-v-044d5238><circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" data-v-044d5238></circle><circle cx="32" cy="28" r="8" stroke="currentColor" stroke-width="2" data-v-044d5238></circle><path d="M20 44C20 38 26 34 32 34C38 34 44 38 44 44" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-044d5238></path></svg></div>', 1)),
            o("h3", null, b(s(n)("chat.empty")), 1),
            o("p", null, b(s(n)("chat.emptyHint", { name: s(l).persona.name || s(n)("chat.defaultCharacter") })), 1)
          ])) : O("", !0),
          (c(!0), d(j, null, he(s(a).messages, (v, M) => (c(), Ne(Kn, {
            key: v.id,
            message: v,
            streaming: s(a).isTyping && M === s(a).messages.length - 1
          }, null, 8, ["message", "streaming"]))), 128)),
          s(a).isTyping ? (c(), d("div", Wn, [
            f[6] || (f[6] = o("div", { class: "typing-dots" }, [
              o("span"),
              o("span"),
              o("span")
            ], -1)),
            o("span", jn, b(s(l).persona.name || "AI") + " " + b(s(n)("chat.thinking")), 1)
          ])) : O("", !0)
        ])
      ], 544),
      o("div", qn, [
        $.value.length || B.value ? (c(), d("div", Jn, [
          (c(!0), d(j, null, he($.value, (v) => (c(), d("div", {
            key: v,
            class: "pending-thumb"
          }, [
            o("img", {
              src: v,
              alt: ""
            }, null, 8, Gn),
            o("button", {
              class: "remove-img",
              type: "button",
              "aria-label": s(n)("chat.removeImage"),
              title: s(n)("chat.removeImage"),
              onClick: (M) => Me(v)
            }, " × ", 8, Zn)
          ]))), 128)),
          B.value ? (c(), d("div", Qn, [...f[7] || (f[7] = [
            o("span", { class: "upload-spinner" }, null, -1)
          ])])) : O("", !0)
        ])) : O("", !0),
        D.value.length ? (c(), d("div", eo, [
          (c(!0), d(j, null, he(D.value, (v) => (c(), d("span", {
            key: v.url,
            class: "pending-file",
            title: `${v.mime || ""} · ${v.size || 0} B`
          }, [
            o("span", no, b(v.name), 1),
            o("button", {
              class: "remove-file",
              type: "button",
              title: s(n)("chat.removeFile"),
              onClick: (M) => Te(v.url)
            }, " × ", 8, oo)
          ], 8, to))), 128))
        ])) : O("", !0),
        s(a).callMode ? (c(), d("div", ao, [
          f[8] || (f[8] = o("span", {
            class: "call-dot",
            "aria-hidden": "true"
          }, null, -1)),
          o("span", io, b(s(n)("chat.callBanner")), 1),
          o("button", {
            class: "call-end",
            type: "button",
            onClick: f[0] || (f[0] = (v) => s(a).endCall())
          }, b(s(n)("chat.callEnd")), 1)
        ])) : O("", !0),
        T.value ? (c(), d("div", {
          key: 3,
          class: ee(["wake-strip", s(V)])
        }, [
          f[9] || (f[9] = o("span", {
            class: "wake-dot",
            "aria-hidden": "true"
          }, null, -1)),
          o("span", so, b(re.value), 1),
          o("button", {
            class: "wake-stop",
            type: "button",
            title: s(n)("chat.wakeOnTitle"),
            onClick: f[1] || (f[1] = //@ts-ignore
            (...v) => s($e) && s($e)(...v))
          }, "×", 8, ro)
        ], 2)) : O("", !0),
        o("div", lo, [
          o("input", {
            ref_key: "imageInput",
            ref: N,
            type: "file",
            accept: "image/png,image/jpeg,image/gif,image/webp",
            multiple: "",
            hidden: "",
            onChange: z
          }, null, 544),
          o("input", {
            ref_key: "fileInput",
            ref: G,
            type: "file",
            multiple: "",
            hidden: "",
            onChange: ne
          }, null, 544),
          o("button", {
            class: "attach-btn",
            type: "button",
            title: s(n)("chat.attachImage"),
            disabled: B.value || !s(a).isConnected,
            onClick: nt
          }, [...f[10] || (f[10] = [
            o("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              o("rect", {
                x: "3",
                y: "5",
                width: "18",
                height: "14",
                rx: "2",
                stroke: "currentColor",
                "stroke-width": "2"
              }),
              o("circle", {
                cx: "9",
                cy: "10",
                r: "1.5",
                fill: "currentColor"
              }),
              o("path", {
                d: "M4 17l5-5 4 4 3-3 4 4",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, co),
          o("button", {
            class: "attach-btn",
            type: "button",
            title: s(n)("chat.attachFile"),
            disabled: B.value || !s(a).isConnected,
            onClick: ye
          }, [...f[11] || (f[11] = [
            o("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              o("path", {
                d: "M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, uo),
          o("button", {
            class: ee(["attach-btn wake-btn", { active: T.value }]),
            type: "button",
            title: U.value,
            "aria-pressed": T.value,
            disabled: p.value,
            onClick: me
          }, [...f[12] || (f[12] = [
            o("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none",
              "aria-hidden": "true"
            }, [
              o("rect", {
                x: "9",
                y: "3",
                width: "6",
                height: "11",
                rx: "3",
                stroke: "currentColor",
                "stroke-width": "2"
              }),
              o("path", {
                d: "M5 11a7 7 0 0 0 14 0M12 18v3",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round"
              })
            ], -1)
          ])], 10, fo),
          Qt(o("textarea", {
            ref_key: "messageInput",
            ref: x,
            "onUpdate:modelValue": f[2] || (f[2] = (v) => _.value = v),
            class: "message-input",
            placeholder: s(n)("chat.inputPlaceholder"),
            rows: "1",
            onKeydown: Ce,
            onPaste: oe,
            disabled: !s(a).isConnected
          }, null, 40, ho), [
            [en, _.value]
          ]),
          o("button", {
            class: "send-button",
            "aria-label": s(n)("chat.send"),
            title: s(n)("chat.send"),
            onClick: le,
            disabled: !_.value.trim() && !$.value.length && !D.value.length || !s(a).isConnected || s(a).isTyping
          }, [...f[13] || (f[13] = [
            o("svg", {
              width: "20",
              height: "20",
              viewBox: "0 0 20 20",
              fill: "none"
            }, [
              o("path", {
                d: "M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, vo)
        ]),
        o("div", mo, [
          s(a).isConnected ? (c(), d("span", po, [
            f[15] || (f[15] = o("span", { class: "status-dot" }, null, -1)),
            ze(" " + b(s(n)("chat.connected")), 1)
          ])) : (c(), d("span", go, [
            f[14] || (f[14] = o("span", { class: "status-dot" }, null, -1)),
            ze(" " + b(s(n)("chat.disconnected")), 1)
          ])),
          o("span", yo, b(s(n)("chat.contextHint", { n: s(a).contextTokens.toLocaleString() })), 1),
          o("button", {
            class: ee(["context-btn", { active: s(a).voiceEnabled }]),
            type: "button",
            title: s(a).voiceEnabled ? s(n)("chat.voiceOnTitle") : s(n)("chat.voiceOffTitle"),
            onClick: f[3] || (f[3] = (v) => s(a).setVoiceEnabled(!s(a).voiceEnabled))
          }, b(s(a).voiceEnabled ? s(n)("chat.voiceOn") : s(n)("chat.voiceOff")), 11, wo),
          o("button", {
            class: "context-btn",
            type: "button",
            disabled: s(a).messages.length === 0,
            onClick: ae
          }, b(s(n)("chat.download")), 9, ko),
          o("button", {
            class: "context-btn",
            type: "button",
            disabled: s(a).compacting,
            onClick: f[4] || (f[4] = //@ts-ignore
            (...v) => s(a).compactContext && s(a).compactContext(...v))
          }, b(s(a).compacting ? s(n)("chat.compacting") : s(n)("chat.compact")), 9, bo),
          o("button", {
            class: "context-btn danger",
            type: "button",
            onClick: ce
          }, b(s(n)("chat.clear")), 1)
        ])
      ])
    ]));
  }
}), Co = /* @__PURE__ */ Ke(_o, [["__scopeId", "data-v-044d5238"]]), Mo = { class: "status-panel" }, So = { class: "panel-header" }, $o = {
  key: 0,
  class: "patch-badge"
}, Io = { class: "panel-content" }, Po = { class: "section character-profile" }, Eo = { class: "section-header" }, Lo = { class: "section-title" }, To = ["datetime"], Ao = ["data-section", "data-kind"], Ro = { class: "section-header" }, Bo = { class: "section-title" }, Do = {
  key: 0,
  class: "mood-display"
}, Oo = {
  key: 0,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Fo = {
  key: 1,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, No = {
  key: 2,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, zo = {
  key: 3,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Uo = {
  key: 4,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Vo = {
  key: 1,
  class: "emotion-bars"
}, Ko = { class: "emotion-label" }, Xo = { class: "emotion-bar" }, Ho = {
  key: 0,
  class: "empty-tasks"
}, Yo = /* @__PURE__ */ Ue({
  __name: "StatusPanel",
  setup(i) {
    const { t: n } = Ve(), u = Dt(), a = Ot(), l = ut(), y = L(/* @__PURE__ */ new Date()), S = F(() => {
      const k = l.persona.birthDate;
      if (!k) return null;
      const p = /* @__PURE__ */ new Date(`${k}T00:00:00`);
      if (Number.isNaN(p.getTime()) || p > y.value) return null;
      const T = y.value;
      return T.getFullYear() - p.getFullYear() - +(T.getMonth() < p.getMonth() || T.getMonth() === p.getMonth() && T.getDate() < p.getDate());
    });
    let _ = null;
    function I(k) {
      if (!k || !k.startsWith("life.")) return;
      const p = k.slice(5).split(".").reduce((T, U) => T?.[U], u);
      return typeof p == "function" ? void 0 : p;
    }
    function x(k) {
      if (k.titleKey) {
        const p = n(k.titleKey);
        if (p && p !== k.titleKey) return p;
      }
      return k.title || k.id;
    }
    function $(k) {
      if (k.labelKey) {
        const p = n(k.labelKey);
        if (p && p !== k.labelKey) return p;
      }
      return k.label || k.key;
    }
    function N(k) {
      const p = Number(I(`life.emotion.${k.key}`) ?? 0);
      return k.scale === "remap01" ? (p + 1) / 2 : p;
    }
    et(() => {
      _ = setInterval(() => {
        y.value = /* @__PURE__ */ new Date();
      }, 1e3);
    }), tt(() => {
      _ && clearInterval(_);
    });
    const D = F(
      () => a.statusSections.filter((k) => k.kind === "mood" || k.kind === "bars")
    ), G = F(() => u.emotionColor), B = F(() => u.emotionMood);
    return (k, p) => (c(), d("div", Mo, [
      o("div", So, [
        o("h2", null, b(s(n)("status.title")), 1),
        s(a).loaded ? (c(), d("span", $o, "patch")) : O("", !0)
      ]),
      o("div", Io, [
        o("section", Po, [
          o("div", Eo, [
            o("span", Lo, b(s(l).persona.name || s(n)("chat.defaultCharacter")), 1)
          ]),
          o("dl", null, [
            o("div", null, [
              o("dt", null, b(s(n)("status.age")), 1),
              o("dd", null, b(S.value === null ? s(n)("status.birthdayUnset") : s(n)("status.ageValue", { age: S.value })), 1)
            ]),
            o("div", null, [
              o("dt", null, b(s(n)("status.time")), 1),
              o("dd", null, [
                o("time", {
                  datetime: y.value.toISOString()
                }, b(y.value.toLocaleString()), 9, To)
              ])
            ]),
            o("div", null, [
              o("dt", null, b(s(n)("status.timezone")), 1),
              o("dd", null, b(Intl.DateTimeFormat().resolvedOptions().timeZone), 1)
            ])
          ])
        ]),
        (c(!0), d(j, null, he(D.value, (T) => (c(), d("div", {
          key: T.id,
          class: "section",
          "data-section": T.id,
          "data-kind": T.kind
        }, [
          o("div", Ro, [
            o("span", Bo, b(x(T)), 1)
          ]),
          T.kind === "mood" ? (c(), d("div", Do, [
            o("div", {
              class: "mood-icon",
              style: _e({ color: G.value })
            }, [
              B.value === "happy" ? (c(), d("svg", Oo, [...p[0] || (p[0] = [
                o("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                o("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                o("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                o("path", {
                  d: "M14 30C17 34 31 34 34 30",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : B.value === "sad" ? (c(), d("svg", Fo, [...p[1] || (p[1] = [
                o("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                o("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                o("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                o("path", {
                  d: "M16 34C19 30 29 30 32 34",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : B.value === "irritated" ? (c(), d("svg", No, [...p[2] || (p[2] = [
                o("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                o("line", {
                  x1: "14",
                  y1: "18",
                  x2: "20",
                  y2: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                o("line", {
                  x1: "34",
                  y1: "18",
                  x2: "28",
                  y2: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                o("path", {
                  d: "M16 34C19 30 29 30 32 34",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : B.value === "sleeping" ? (c(), d("svg", zo, [...p[3] || (p[3] = [
                Rt('<circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" data-v-45331204></circle><path d="M16 22C17 22 18 22 18 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><path d="M30 22C31 22 32 22 32 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><path d="M18 32C20 34 28 34 30 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><text x="36" y="12" fill="currentColor" font-size="12" font-weight="bold" data-v-45331204>Z</text>', 5)
              ])])) : (c(), d("svg", Uo, [...p[4] || (p[4] = [
                o("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                o("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                o("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                o("path", {
                  d: "M18 30H30",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])]))
            ], 4),
            o("div", {
              class: "mood-label",
              style: _e({ color: G.value })
            }, b(s(n)(`emotion.${B.value}`)), 5)
          ])) : T.kind === "bars" ? (c(), d("div", Vo, [
            (c(!0), d(j, null, he(T.axes || [], (U) => (c(), d("div", {
              key: U.key,
              class: "emotion-row"
            }, [
              o("span", Ko, b($(U)), 1),
              o("div", Xo, [
                o("div", {
                  class: "emotion-fill",
                  style: _e({
                    transform: `scaleX(${Math.max(0, Math.min(1, N(U)))})`,
                    backgroundColor: U.color || "#0078d4"
                  })
                }, null, 4)
              ])
            ]))), 128))
          ])) : O("", !0)
        ], 8, Ao))), 128)),
        s(a).statusSections.length === 0 ? (c(), d("div", Ho, " No status sections (load life.patch) ")) : O("", !0)
      ])
    ]));
  }
}), Wo = /* @__PURE__ */ Ke(Yo, [["__scopeId", "data-v-45331204"]]), jo = ["title"], qo = {
  key: 0,
  class: "stage-placeholder"
}, Jo = {
  key: 1,
  class: "stage-status"
}, Go = {
  key: 2,
  class: "stage-status warn"
}, Zo = ["title", "aria-label"], Qo = { class: "stage-hint" }, Et = "0kay.web.live2d.resetbtn", ea = "0kay.web.live2d.transform.", ta = /* @__PURE__ */ Ue({
  __name: "Live2DStage",
  setup(i) {
    const { t: n } = Ve(), u = Dt(), a = ut(), l = L(null), y = L(null), S = L(""), _ = L("idle"), I = L(""), x = F(() => a.live2d.enabled), $ = F(() => a.live2d.modelUrl.trim()), N = F(() => u.emotionMood), D = F(() => {
      const e = String(N.value || "");
      if (!e) return "";
      const t = `emotion.${e}`, r = n(t);
      return r === t ? e : r;
    }), G = F(() => u.emotionColor), B = L([]);
    async function k() {
      try {
        const e = await fetch("/api/live2d");
        if (e.ok) {
          const t = await e.json();
          B.value = t.models || [];
        }
      } catch {
        B.value = [];
      }
    }
    const p = L(null), T = L(P()), U = L(!1);
    let re = !1, Z = { x: 0, y: 0 }, ve = { x: 0, y: 0 };
    function P() {
      try {
        const e = localStorage.getItem(Et);
        if (e) {
          const t = JSON.parse(e);
          if (typeof t?.x == "number" && typeof t?.y == "number") return t;
        }
      } catch {
      }
      return null;
    }
    const H = F(() => T.value ? { left: `${T.value.x}px`, top: `${T.value.y}px`, right: "auto", bottom: "auto" } : {});
    function C(e) {
      U.value = !0, re = !1, Z = { x: e.clientX, y: e.clientY };
      const t = p.value?.getBoundingClientRect();
      ve = { x: t?.left ?? 0, y: t?.top ?? 0 };
      try {
        p.value?.setPointerCapture(e.pointerId);
      } catch {
      }
    }
    function me(e) {
      if (!U.value || !l.value) return;
      const t = e.clientX - Z.x, r = e.clientY - Z.y;
      (Math.abs(t) > 3 || Math.abs(r) > 3) && (re = !0);
      const m = l.value.getBoundingClientRect(), E = p.value?.offsetWidth || 34, R = se(ve.x - m.left + t, 4, Math.max(4, m.width - E - 4)), A = se(ve.y - m.top + r, 4, Math.max(4, m.height - E - 4));
      T.value = { x: Math.round(R), y: Math.round(A) };
    }
    function ge(e) {
      if (U.value) {
        U.value = !1;
        try {
          p.value?.releasePointerCapture(e.pointerId);
        } catch {
        }
        if (re)
          try {
            localStorage.setItem(Et, JSON.stringify(T.value));
          } catch {
          }
      }
    }
    function Le() {
      if (re) {
        re = !1;
        return;
      }
      qt();
    }
    let w = null, g = null, le = null, Ce = 0, nt = 0, z = 0, Me = { x: 0, y: 0, has: !1 }, ye = !1, ne = null, Te = { x: 0, y: 0 }, oe = null, ce = null, ae = null, h = null, f = null, v = "off", M = 0, q = 0, Ae = 0, ie = 120, we = ["ParamMouthOpenY"];
    function Y(e) {
      const t = g?.internalModel?.coreModel;
      if (!t) return;
      const r = se(e, 0, 1);
      for (const m of we)
        try {
          typeof t.setParameterValueById == "function" ? t.setParameterValueById(m, r) : typeof t.setParamFloat == "function" && t.setParamFloat(m, r);
        } catch {
        }
    }
    function X(e) {
      const t = [];
      try {
        const r = e?.internalModel?.settings;
        let m = r?.getLipSyncParameters?.();
        if (!Array.isArray(m) && Array.isArray(r?.groups) && (m = r.groups.find((R) => (R?.Name || R?.name || "").toLowerCase() === "lipsync")?.Ids), Array.isArray(m))
          for (const E of m) typeof E == "string" && E && t.push(E);
      } catch {
      }
      we = t.length ? t : ["ParamMouthOpenY"];
    }
    function ot() {
      if (v === "off") {
        M !== 0 && (M = 0, Y(0));
        return;
      }
      if (v === "audio" && h && f) {
        h.getByteTimeDomainData(f);
        let e = 0;
        for (let m = 0; m < f.length; m++) {
          const E = (f[m] - 128) / 128;
          e += E * E;
        }
        const t = Math.sqrt(e / f.length), r = se(t * 3.4, 0, 1);
        M = M * 0.35 + r * 0.65, Y(M);
        return;
      }
      if (v === "text") {
        const e = performance.now() - q;
        if (e > Ae * ie + 260) {
          v = "off", M = 0, Y(0);
          return;
        }
        const t = e % ie / ie, r = t < 0.5 ? 0.12 + 0.72 * Math.sin(t / 0.5 * Math.PI) : 0.06;
        M = M * 0.45 + r * 0.55, Y(M);
      }
    }
    async function ke(e, t = "") {
      if (!e) {
        Xe(t);
        return;
      }
      if (g)
        try {
          if (oe || (oe = new Audio(), oe.crossOrigin = "anonymous", oe.addEventListener("ended", () => {
            v = "off", M = 0, Y(0);
          })), ce && ce !== e)
            try {
              URL.revokeObjectURL(ce);
            } catch {
            }
          if (ce = e, oe.src = e, !ae) {
            const r = window.AudioContext || window.webkitAudioContext;
            r && (ae = new r(), h = ae.createAnalyser(), h.fftSize = 1024, f = new Uint8Array(h.fftSize), ae.createMediaElementSource(oe).connect(h), h.connect(ae.destination));
          }
          await ae?.resume().catch(() => {
          }), v = "audio", await oe.play().catch(() => {
            t ? Xe(t) : (v = "off", Y(0));
          });
        } catch {
          t ? Xe(t) : v = "off";
        }
    }
    function Xe(e) {
      const t = Array.from(String(e || "")).filter((r) => /\S/.test(r));
      t.length && (ie = /[\u4e00-\u9fff]/.test(t.join("")) ? 140 : 80, Ae = t.length, q = performance.now(), v = "text");
    }
    function ft() {
      v = "off", M = 0, Y(0);
      try {
        oe?.pause();
      } catch {
      }
    }
    function ht(e) {
      const t = e.detail || {};
      t.url ? ke(t.url, t.text || "") : t.text && Xe(t.text);
    }
    let ue = {}, Q = [], He = 0;
    function Kt(e) {
      ue = {}, Q = [];
      try {
        const t = e?.internalModel?.motionManager, r = e?.internalModel?.settings, m = t?.definitions || r?.motions || {};
        for (const [R, A] of Object.entries(m)) ue[R] = Array.isArray(A) ? A.length : 0;
        Q = (t?.expressionManager?.definitions || r?.expressions || []).map((R) => R?.Name || R?.name).filter((R) => !!R);
      } catch {
      }
      try {
        console.info("[live2d] motions", ue, "expressions", Q);
      } catch {
      }
      try {
        window.__0KAY_LIVE2D_CAPS__ = { motions: ue, expressions: Q };
      } catch {
      }
    }
    function Re(e, t) {
      if (!g) return;
      const r = Object.keys(ue).filter((A) => ue[A] > 0);
      if (!r.length) return;
      const m = r.find((A) => /idle/i.test(A)), E = e && ue[e] > 0, R = E ? e : t == null && m ? m : r.find((A) => A !== m) || r[0];
      try {
        const A = g.internalModel?.motionManager;
        if (typeof g.motion == "function" && E) {
          g.motion(R, t);
          return;
        }
        if (t == null) {
          A?.startRandomMotion?.(R);
          return;
        }
        A?.startMotion?.(R, t);
      } catch {
      }
    }
    function Ye(e) {
      if (!g || !e) return;
      const t = /^\d+$/.test(e) ? Number(e) : Q.indexOf(e), r = t >= 0 ? t : e;
      try {
        const m = g.internalModel?.motionManager?.expressionManager;
        if (m?.setExpression) {
          m.setExpression(r);
          return;
        }
        g.expression?.(r);
      } catch {
      }
    }
    function Xt() {
      at(), !(typeof window > "u") && (He = window.setInterval(() => {
        if (v !== "off" || document.hidden) return;
        const e = Object.keys(ue).filter((t) => ue[t] > 0 && !/idle/i.test(t));
        e.length && Math.random() < 0.6 && Re(e[Math.floor(Math.random() * e.length)]), Q.length && Math.random() < 0.5 && Ye(Q[Math.floor(Math.random() * Q.length)]);
      }, 9e3));
    }
    function at() {
      He && (clearInterval(He), He = 0);
    }
    function vt(e) {
      const t = e.detail || {};
      t.expression && Ye(t.expression), (t.group || t.index != null) && Re(t.group, t.index);
    }
    function Ht() {
      return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore);
    }
    function se(e, t, r) {
      return Math.min(r, Math.max(t, e));
    }
    function it() {
      return ea + ($.value || "default");
    }
    function mt() {
      try {
        const e = localStorage.getItem(it());
        if (!e) return null;
        const t = JSON.parse(e);
        if (typeof t?.x == "number" && typeof t?.y == "number" && typeof t?.scale == "number") return t;
      } catch {
      }
      return null;
    }
    function st(e = !1) {
      if (!g) return;
      const t = () => {
        try {
          localStorage.setItem(it(), JSON.stringify({
            x: Math.round(g.x * 100) / 100,
            y: Math.round(g.y * 100) / 100,
            scale: Math.round(g.scale.x * 1e4) / 1e4
          }));
        } catch {
        }
      };
      if (e) {
        z && (clearTimeout(z), z = 0), t();
        return;
      }
      z && clearTimeout(z), z = window.setTimeout(() => {
        z = 0, t();
      }, 140);
    }
    function gt() {
      if (at(), v = "off", M = 0, be(), z && (clearTimeout(z), z = 0), g) {
        try {
          w?.stage && w.stage.removeChild(g), g.destroy?.();
        } catch {
        }
        g = null;
      }
    }
    function pt() {
      if (Mt(), gt(), le && (le.disconnect(), le = null), z && (clearTimeout(z), z = 0), w) {
        try {
          w.destroy(!1, { children: !0, texture: !1, baseTexture: !1 });
        } catch {
        }
        w = null;
      }
    }
    function yt(e) {
      if (typeof e.getLocalBounds == "function") {
        const m = e.getLocalBounds();
        if (m && m.width > 0 && m.height > 0) return { width: m.width, height: m.height };
      }
      const t = Math.max(Math.abs(e.scale.x) || 0, 1e-4), r = Math.max(Math.abs(e.scale.y) || 0, 1e-4);
      return { width: Math.max(e.width / t, 1), height: Math.max(e.height / r, 1) };
    }
    function rt(e = g) {
      if (!e || !w) return !1;
      const t = w.screen.width, r = w.screen.height;
      if (!t || !r) return !1;
      const m = yt(e);
      if (m.width > 0 && m.height > 0) {
        const E = Math.min(t / m.width, r / m.height) * 0.88;
        e.anchor?.set?.(0.5, 0.5), e.scale.set(E, E);
      }
      e.position.set(t * 0.5, r * 0.55);
      try {
        const E = e.getBounds?.();
        if (E && E.width > 0 && E.height > 0) {
          e.x += t * 0.5 - (E.x + E.width * 0.5), e.y += r * 0.55 - (E.y + E.height * 0.55);
          const R = e.getBounds?.();
          if (R && R.width > 0 && R.height > 0) {
            const A = Math.min(t / R.width, r / R.height) * 0.88, J = Math.abs(e.scale.x) || 1;
            if (Number.isFinite(A) && A > 0 && Math.abs(A - J) / J > 0.08) {
              const de = J * A;
              e.scale.set(de, de);
              const W = e.getBounds?.();
              W && W.width > 0 && (e.x += t * 0.5 - (W.x + W.width * 0.5), e.y += r * 0.55 - (W.y + W.height * 0.55));
            }
          }
        }
      } catch {
      }
      return !0;
    }
    function Yt() {
      if (!g) return { hw: 0, hh: 0 };
      const e = yt(g), t = Math.abs(g.scale.x) || 1, r = Math.abs(g.scale.y) || 1;
      return { hw: e.width * t / 2, hh: e.height * r / 2 };
    }
    function We() {
      if (!g || !w) return;
      const e = w.screen.width, t = w.screen.height, { hw: r, hh: m } = Yt(), E = Math.min(r * 0.7, e * 0.5), R = Math.min(m * 0.7, t * 0.5), A = E - r, J = e - E + r, de = R - m, W = t - R + m, Be = A <= J ? se(g.x, A, J) : e * 0.5, St = de <= W ? se(g.y, de, W) : t * 0.55;
      g.position.set(Be, St);
    }
    function Wt() {
      if (!g || !w) return;
      const e = mt();
      if (e && Number.isFinite(e.scale) && e.scale > 0) {
        g.anchor?.set?.(0.5, 0.5), g.scale.set(e.scale, e.scale), g.position.set(e.x, e.y), We();
        return;
      }
      rt();
    }
    function jt(e, t) {
      if (!g || !window.PIXI || typeof window.PIXI.Point != "function" || typeof g.toModelPosition != "function") return null;
      try {
        const r = new window.PIXI.Point(e, t);
        return g.toModelPosition(r, new window.PIXI.Point());
      } catch {
        return null;
      }
    }
    function wt(e, t, r) {
      const m = r - t;
      return !Number.isFinite(m) || Math.abs(m) <= 1e-4 ? 0 : se((e - t) / m * 2 - 1, -1, 1);
    }
    function kt(e, t) {
      const r = g?.internalModel, m = r?.focusController;
      if (!m || typeof m.focus != "function" || !w) return;
      const E = w.screen.width || 1, R = w.screen.height || 1;
      let A = e / E * 2 - 1, J = t / R * 2 - 1;
      const de = jt(e, t);
      if (de && r.originalWidth && r.originalHeight) {
        const W = wt(de.x, 0, r.originalWidth), Be = wt(de.y, 0, r.originalHeight);
        W >= -1 && W <= 1 && Be >= -1 && Be <= 1 && (A = A * 0.35 + W * 0.65, J = J * 0.35 + Be * 0.65);
      }
      A = se(A, -1, 1), J = se(J, -1, 1), m.focus(A, -J);
    }
    function je() {
      Me.has && kt(Me.x, Me.y);
    }
    function bt(e) {
      if (!g || !w || !l.value) return;
      const t = l.value.getBoundingClientRect();
      if (!t.width || !t.height) return;
      const r = (e.clientX - t.left) / t.width * w.screen.width, m = (e.clientY - t.top) / t.height * w.screen.height;
      Me = { x: r, y: m, has: !0 }, ye && e.pointerId === ne && (g.position.set(r + Te.x, m + Te.y), We(), st()), kt(r, m);
    }
    function xt(e) {
      if (!g || !w || !l.value || e.button !== 0 && e.pointerType === "mouse" || e.target?.closest?.(".stage-reset")) return;
      const t = l.value.getBoundingClientRect();
      if (!t.width || !t.height) return;
      const r = (e.clientX - t.left) / t.width * w.screen.width, m = (e.clientY - t.top) / t.height * w.screen.height;
      ye = !0, ne = e.pointerId, Te = { x: g.x - r, y: g.y - m };
      try {
        l.value.setPointerCapture(e.pointerId);
      } catch {
      }
      l.value && (l.value.style.cursor = "grabbing");
    }
    function be(e) {
      if (ye && !(e && ne !== null && e.pointerId !== ne)) {
        if (ye = !1, l.value) {
          try {
            ne !== null && l.value.releasePointerCapture(ne);
          } catch {
          }
          l.value.style.cursor = "grab";
        }
        ne = null, st(!0);
      }
    }
    function _t(e) {
      if (!g || _.value !== "ok" || !e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const t = e.deltaY < 0 ? 1.06 : 0.94, r = se(g.scale.x * t, 0.08, 3.2);
      g.scale.set(r, r), We(), je(), st();
    }
    function qt() {
      if (!(!g || !w)) {
        try {
          localStorage.removeItem(it());
        } catch {
        }
        z && (clearTimeout(z), z = 0);
        try {
          w.resize?.();
        } catch {
        }
        w?.stage && (w.stage.hitArea = w.screen), rt(), je();
      }
    }
    function Ct() {
      Mt();
      const e = l.value;
      e && (e.style.cursor = "grab", e.addEventListener("pointermove", bt), e.addEventListener("pointerdown", xt), e.addEventListener("pointerup", be), e.addEventListener("pointercancel", be), e.addEventListener("pointerleave", be), e.addEventListener("wheel", _t, { passive: !1 }));
    }
    function Mt() {
      const e = l.value;
      e && (e.removeEventListener("pointermove", bt), e.removeEventListener("pointerdown", xt), e.removeEventListener("pointerup", be), e.removeEventListener("pointercancel", be), e.removeEventListener("pointerleave", be), e.removeEventListener("wheel", _t), ye = !1, ne = null);
    }
    function Jt() {
      if (w || !y.value || !l.value) return;
      const e = window.PIXI;
      w = new e.Application({
        view: y.value,
        resizeTo: l.value,
        autoStart: !0,
        antialias: !0,
        backgroundAlpha: 0,
        powerPreference: "high-performance"
      }), w.stage && (w.stage.interactive = !0, w.stage.hitArea = w.screen), le = new ResizeObserver(() => {
        try {
          w?.resize?.();
        } catch {
        }
        if (w?.stage && (w.stage.hitArea = w.screen), g) {
          const t = mt();
          t && Number.isFinite(t.scale) && t.scale > 0 ? (g.position.set(t.x, t.y), g.scale.set(t.scale, t.scale), We()) : rt();
        }
        je();
      }), le.observe(l.value), Ct();
    }
    async function lt() {
      try {
        await an;
      } catch (r) {
        _.value = "error", I.value = `Live2D runtime: ${r.message}`;
        return;
      }
      const e = ++Ce;
      if (gt(), !x.value) {
        _.value = "disabled", S.value = "";
        return;
      }
      if (!Ht()) {
        _.value = "no-libs", I.value = n("live2d.libsMissing");
        return;
      }
      const t = $.value || B.value[0]?.url;
      if (!t) {
        _.value = "error", I.value = n("live2d.noModel");
        return;
      }
      if (_.value = "loading", I.value = "", S.value = t.split("/").pop() || t, await Ge(), w || Jt(), !w) {
        _.value = "error", I.value = n("live2d.stageMissing");
        return;
      }
      try {
        const r = await window.PIXI.live2d.Live2DModel.from(t, { autoInteract: !1 });
        if (e !== Ce) {
          try {
            r.destroy?.();
          } catch {
          }
          return;
        }
        g = r, Ct(), r.anchor?.set?.(0.5, 0.5), w.stage.addChild(r), Wt();
        try {
          r.internalModel?.on?.("beforeModelUpdate", ot);
        } catch {
        }
        X(r), Kt(r), _.value = "ok", je(), Re("Idle"), Xt();
      } catch (r) {
        if (e !== Ce) return;
        console.error("Live2D load failed:", r), _.value = "error", I.value = r?.message || n("live2d.loadError");
      }
    }
    function Gt() {
      if (!x.value) {
        pt(), _.value = "disabled";
        return;
      }
      lt();
    }
    et(async () => {
      window.addEventListener("live2d-models-changed", k), window.addEventListener("live2d-speak", ht), window.addEventListener("live2d-motion", vt), window.__0KAY_LIVE2D__ = { speak: ke, stop: ft, motion: Re, expression: Ye };
      try {
        const e = await fetch("/api/settings/live2d");
        if (e.ok) {
          const { values: t } = await e.json();
          t && typeof t.enabled == "boolean" && (a.live2d.enabled = t.enabled), t && typeof t.model_url == "string" && (a.live2d.modelUrl = t.model_url);
        }
      } catch {
      }
      await k(), x.value ? lt() : _.value = "disabled";
    }), tt(() => {
      if (window.removeEventListener("live2d-models-changed", k), window.removeEventListener("live2d-speak", ht), window.removeEventListener("live2d-motion", vt), at(), ft(), ce) {
        try {
          URL.revokeObjectURL(ce);
        } catch {
        }
        ce = null;
      }
      try {
        ae?.close();
      } catch {
      }
      ae = null, Ce++, cancelAnimationFrame(nt), pt();
    }), Ie(x, Gt), Ie($, () => {
      x.value && lt();
    });
    const Zt = { happy: 2, sad: 4, irritated: 6, neutral: 0, drowsy: 0, exhausted: 0, sleeping: 0 };
    return Ie(N, (e) => {
      if (!g || v !== "off" || !Q.length) return;
      const t = Zt[e] ?? 0;
      Ye(Q[t] || Q[0]), (e === "happy" || e === "irritated") && Math.random() < 0.5 && Re();
    }), (e, t) => (c(), d("div", {
      class: ee(["live2d-stage", { on: x.value }])
    }, [
      o("div", {
        ref_key: "stageEl",
        ref: l,
        class: "stage-viewport",
        style: _e({ "--mood": G.value }),
        title: x.value && _.value === "ok" ? s(n)("live2d.interactHint") : ""
      }, [
        o("canvas", {
          ref_key: "canvasEl",
          ref: y,
          class: "stage-canvas"
        }, null, 512),
        x.value ? _.value === "loading" ? (c(), d("div", Jo, b(s(n)("live2d.loading")), 1)) : _.value === "error" || _.value === "no-libs" ? (c(), d("div", Go, b(I.value || s(n)("live2d.loadError")), 1)) : O("", !0) : (c(), d("div", qo, [
          o("p", null, b(s(n)("live2d.disabledHint")), 1)
        ])),
        x.value && _.value === "ok" ? (c(), d("button", {
          key: 3,
          ref_key: "resetBtnEl",
          ref: p,
          class: ee(["stage-reset", { dragging: U.value }]),
          type: "button",
          style: _e(H.value),
          title: s(n)("live2d.resetView"),
          "aria-label": s(n)("live2d.resetView"),
          onPointerdown: De(C, ["stop"]),
          onPointermove: De(me, ["stop"]),
          onPointerup: De(ge, ["stop"]),
          onPointercancel: De(ge, ["stop"]),
          onClick: De(Le, ["stop"])
        }, "⟲", 46, Zo)) : O("", !0),
        t[0] || (t[0] = o("div", { class: "stage-gradient" }, null, -1)),
        o("div", Qo, b(D.value), 1)
      ], 12, jo)
    ], 2));
  }
}), na = /* @__PURE__ */ Ke(ta, [["__scopeId", "data-v-15b509be"]]), oa = {
  key: 0,
  class: "stage-column"
}, aa = ["src", "title"], ia = ["data-chat-slot"], sa = ["aria-label", "title"], ra = ["src", "title"], la = ["data-chat-slot"], ca = ["title"], Lt = "0kay.web.chat_panel_width_ratio", Tt = 320, ua = 360, At = 960, da = /* @__PURE__ */ Ue({
  __name: "ChatPage",
  setup(i) {
    const { t: n } = Ve(), u = Ot(), a = Bt(), l = L(!1), y = L(!1), S = F(() => u.chatRegion("stage")), _ = F(() => u.chatRegion("chat")), I = F(() => S.value.some((P) => P.component === "status")), x = F(() => _.value.some((P) => P.component === "chat")), $ = L(0.34), N = L(null);
    let D = !1;
    function G() {
      try {
        const P = Number(localStorage.getItem(Lt));
        P > 0 && P < 1 && ($.value = P);
      } catch {
      }
    }
    function B(P) {
      $.value = P;
      try {
        localStorage.setItem(Lt, String(P));
      } catch {
      }
    }
    function k(P, H) {
      const C = Math.min(Tt, P * 0.3), me = Math.min(At, P - ua);
      return Math.min(Math.max(H, C), me) / P;
    }
    function p(P) {
      y.value || (D = !0, P.target.setPointerCapture?.(P.pointerId), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none");
    }
    function T(P) {
      if (!D || !N.value) return;
      const H = N.value.getBoundingClientRect(), C = H.right - P.clientX;
      B(k(H.width, C));
    }
    function U() {
      D && (D = !1, document.body.style.cursor = "", document.body.style.userSelect = "");
    }
    function re(P) {
      if (y.value || P.key !== "ArrowLeft" && P.key !== "ArrowRight") return;
      const H = N.value;
      if (!H) return;
      P.preventDefault();
      const C = H.getBoundingClientRect(), me = $.value * C.width, ge = P.key === "ArrowLeft" ? me + 24 : me - 24;
      B(k(C.width, ge));
    }
    function Z() {
      const P = y.value;
      y.value = window.innerWidth <= 960, y.value ? P || (l.value = !1) : l.value = !0;
    }
    et(() => {
      G(), Z(), a.setChatVisible(!0), window.addEventListener("resize", Z), window.addEventListener("pointermove", T), window.addEventListener("pointerup", U);
    }), tt(() => {
      a.setChatVisible(!1), window.removeEventListener("resize", Z), window.removeEventListener("pointermove", T), window.removeEventListener("pointerup", U), document.body.style.cursor = "", document.body.style.userSelect = "";
    });
    function ve() {
      l.value = !l.value;
    }
    return (P, H) => (c(), d("div", {
      ref_key: "pageEl",
      ref: N,
      class: ee(["chat-page", { "no-chat": !x.value }]),
      style: _e(y.value ? void 0 : { "--chat-w": `min(${At}px, max(${Tt}px, ${$.value * 100}%))` })
    }, [
      S.value.length ? (c(), d("div", oa, [
        (c(!0), d(j, null, he(S.value, (C) => (c(), d(j, {
          key: C.id
        }, [
          C.component === "live2d" ? (c(), Ne(na, {
            key: 0,
            class: "stage-host"
          })) : C.component === "status" ? (c(), Ne(Wo, {
            key: 1,
            class: "status-panel"
          })) : C.component === "iframe" && C.src ? (c(), d("iframe", {
            key: 2,
            class: "slot-frame",
            src: C.src,
            title: C.title || C.id
          }, null, 8, aa)) : (c(), d("div", {
            key: 3,
            class: "slot-note",
            "data-chat-slot": C.id
          }, b(C.titleKey ? s(n)(C.titleKey) : C.title || C.id), 9, ia))
        ], 64))), 128))
      ])) : O("", !0),
      !y.value && x.value && S.value.length ? (c(), d("div", {
        key: 1,
        ref: "resizer",
        class: "page-resizer",
        role: "separator",
        "aria-orientation": "vertical",
        tabindex: "0",
        "aria-label": s(n)("chat.resizePanel"),
        title: s(n)("chat.resizePanel"),
        onPointerdown: p,
        onKeydown: re
      }, null, 40, sa)) : O("", !0),
      x.value ? (c(), d("div", {
        key: 2,
        class: ee(["chat-column", { open: l.value || !y.value }])
      }, [
        (c(!0), d(j, null, he(_.value, (C) => (c(), d(j, {
          key: C.id
        }, [
          C.component === "chat" ? (c(), Ne(Co, { key: 0 })) : C.component === "iframe" && C.src ? (c(), d("iframe", {
            key: 1,
            class: "slot-frame fill",
            src: C.src,
            title: C.title || C.id
          }, null, 8, ra)) : (c(), d("div", {
            key: 2,
            class: "slot-note",
            "data-chat-slot": C.id
          }, b(C.titleKey ? s(n)(C.titleKey) : C.title || C.id), 9, la))
        ], 64))), 128))
      ], 2)) : O("", !0),
      y.value && I.value ? (c(), d("button", {
        key: 3,
        class: "status-fab",
        title: s(n)("app.status"),
        onClick: ve
      }, [...H[0] || (H[0] = [
        o("svg", {
          width: "22",
          height: "22",
          viewBox: "0 0 24 24",
          fill: "none"
        }, [
          o("circle", {
            cx: "12",
            cy: "12",
            r: "9",
            stroke: "currentColor",
            "stroke-width": "2"
          }),
          o("circle", {
            cx: "12",
            cy: "12",
            r: "3",
            fill: "currentColor"
          })
        ], -1)
      ])], 8, ca)) : O("", !0)
    ], 6));
  }
}), ma = /* @__PURE__ */ Ke(da, [["__scopeId", "data-v-599f785f"]]);
export {
  ma as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".media-row[data-v-5eead54f]{display:flex;gap:6px;margin:0 0 6px}.media-chip[data-v-5eead54f]{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 10px;border-radius:999px;background:var(--md-primary-container, #e8e0ff);color:var(--md-on-primary-container, #21005d);font-size:11.5px;font-weight:650}.media-chip svg[data-v-5eead54f]{flex:none}.selfie[data-v-5eead54f]{margin:0 0 6px}.selfie-img[data-v-5eead54f]{display:block;max-width:260px;max-height:320px;border-radius:14px;border:1px solid var(--md-outline-variant)}.selfie-pending[data-v-5eead54f]{display:inline-flex;align-items:center;gap:8px;min-width:200px;padding:14px 16px;border-radius:14px;border:1px dashed var(--md-outline-variant);color:var(--md-on-surface-variant);font-size:12px}.selfie-spinner[data-v-5eead54f]{width:13px;height:13px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:selfie-spin-5eead54f .7s linear infinite}@keyframes selfie-spin-5eead54f{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.selfie-spinner[data-v-5eead54f]{animation:none}}.message[data-v-5eead54f]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-5eead54f]{flex-direction:row-reverse}.avatar[data-v-5eead54f]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-5eead54f]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-5eead54f]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-5eead54f]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-5eead54f]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-5eead54f]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-5eead54f]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden}.msg-file-name[data-v-5eead54f]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-5eead54f]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-5eead54f]{max-width:70%}.content[data-v-5eead54f]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.content-markdown[data-v-5eead54f]{white-space:normal}.user .content[data-v-5eead54f]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-5eead54f]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-5eead54f]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-5eead54f]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-5eead54f]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-5eead54f]{margin:4px 0}.think-body b[data-v-5eead54f]{color:var(--md-on-surface)}.think-summary[data-v-5eead54f]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-5eead54f]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-5eead54f]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-5eead54f]{justify-content:flex-end}.separator[data-v-5eead54f]{color:var(--neutral-gray-10)}.emotion[data-v-5eead54f]{font-weight:500}.chat-panel[data-v-044d5238]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-044d5238]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-044d5238]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-044d5238]{color:var(--md-error)}.chat-container[data-v-044d5238]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-044d5238]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-044d5238]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-044d5238]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-044d5238]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-044d5238]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-044d5238]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-044d5238]{display:flex;gap:4px}.typing-dots span[data-v-044d5238]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-044d5238 1.4s infinite ease-in-out}.typing-dots span[data-v-044d5238]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-044d5238]:nth-child(2){animation-delay:-.16s}@keyframes bounce-044d5238{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-044d5238]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-044d5238]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-044d5238]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-044d5238]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-044d5238]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-044d5238],.pending-files[data-v-044d5238]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-044d5238]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden}.pending-file-name[data-v-044d5238]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-044d5238]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-044d5238]:hover{color:var(--error)}.pending-thumb[data-v-044d5238]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-044d5238]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-044d5238]{position:absolute;top:2px;right:2px;width:22px;height:22px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.pending-thumb.uploading[data-v-044d5238]{display:flex;align-items:center;justify-content:center;background:var(--md-surface-container-high);animation:thumb-shimmer-044d5238 1.2s infinite}.upload-spinner[data-v-044d5238]{width:18px;height:18px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:upload-spin-044d5238 .8s linear infinite}@keyframes upload-spin-044d5238{to{transform:rotate(360deg)}}@keyframes thumb-shimmer-044d5238{0%,to{opacity:1}50%{opacity:.55}}@media(prefers-reduced-motion:reduce){.pending-thumb.uploading[data-v-044d5238]{animation:none}}.attach-btn[data-v-044d5238]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-044d5238]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-044d5238]:disabled{opacity:.5;cursor:not-allowed}.wake-btn.active[data-v-044d5238]{color:var(--md-primary);background:color-mix(in srgb,var(--md-primary) 14%,transparent)}.call-strip[data-v-044d5238]{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:6px 10px;border-radius:999px;background:color-mix(in srgb,var(--md-success, #1a9e63) 14%,transparent);color:var(--md-on-surface);font-size:12px}.call-dot[data-v-044d5238]{width:8px;height:8px;border-radius:50%;background:var(--md-success, #1a9e63);animation:call-pulse-044d5238 1.4s ease-in-out infinite}.call-text[data-v-044d5238]{flex:1;min-width:0;font-weight:600}.call-end[data-v-044d5238]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:12px;font-weight:650;cursor:pointer;padding:2px 6px;border-radius:8px}.call-end[data-v-044d5238]:hover{background:var(--md-surface-container-high);color:var(--md-on-surface)}@keyframes call-pulse-044d5238{0%,to{opacity:1}50%{opacity:.35}}@media(prefers-reduced-motion:reduce){.call-dot[data-v-044d5238]{animation:none}}.wake-strip[data-v-044d5238]{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:5px 10px;border-radius:var(--radius-md, 10px);background:color-mix(in srgb,var(--md-primary) 10%,transparent);color:var(--md-primary);font-size:12px}.wake-strip.capturing[data-v-044d5238]{background:color-mix(in srgb,var(--md-primary) 18%,transparent)}.wake-dot[data-v-044d5238]{width:8px;height:8px;border-radius:50%;background:currentColor;animation:wake-pulse-044d5238 1.1s ease-in-out infinite}.wake-strip.capturing .wake-dot[data-v-044d5238]{animation-duration:.5s}.wake-text[data-v-044d5238]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wake-stop[data-v-044d5238]{border:none;background:transparent;color:inherit;cursor:pointer;font-size:15px;line-height:1;padding:0 2px;opacity:.75}.wake-stop[data-v-044d5238]:hover{opacity:1}@keyframes wake-pulse-044d5238{0%,to{opacity:1}50%{opacity:.2}}@media(prefers-reduced-motion:reduce){.wake-dot[data-v-044d5238]{animation:none}}.send-button[data-v-044d5238]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-044d5238]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-044d5238]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-044d5238]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-044d5238]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-044d5238]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-044d5238]{background:var(--success)}.disconnected .status-dot[data-v-044d5238]{background:var(--error)}.hint[data-v-044d5238]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-45331204]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-45331204]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-45331204]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-45331204]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-45331204]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-45331204]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-45331204]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-45331204]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-45331204]{margin-bottom:var(--space-xl)}.section-header[data-v-45331204]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-45331204]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.mood-display[data-v-45331204]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-45331204]{margin-bottom:var(--space-md)}.mood-label[data-v-45331204]{font-size:var(--font-size-md);font-weight:600}.emotion-bars[data-v-45331204]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-45331204]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-45331204]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-45331204]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-45331204]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-45331204]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage[data-v-15b509be]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-15b509be]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-15b509be]:active{cursor:grabbing}.stage-canvas[data-v-15b509be]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-15b509be]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-15b509be]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-15b509be]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-15b509be]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-15b509be]:active{transform:scale(.96)}.stage-reset.dragging[data-v-15b509be]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-15b509be]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-15b509be]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-15b509be]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.chat-page[data-v-599f785f]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-599f785f]{grid-template-columns:1fr}.stage-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-599f785f]{flex:1;min-height:240px}.status-panel[data-v-599f785f]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-599f785f]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-599f785f]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-599f785f]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-599f785f]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-599f785f]:hover,.page-resizer[data-v-599f785f]:active{background:var(--md-primary)}.chat-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-599f785f]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-599f785f]{display:flex;flex-direction:column}.stage-column[data-v-599f785f]{flex:1;min-height:0}.page-resizer[data-v-599f785f]{display:none}.chat-column[data-v-599f785f]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);visibility:hidden;transition:transform var(--transition-normal),visibility 0s linear var(--duration-medium)}.chat-column.open[data-v-599f785f]{transform:translate(0);visibility:visible;transition:transform var(--transition-normal),visibility 0s linear 0s}}\n";document.head.appendChild(s)}})();
