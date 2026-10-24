import { ref as E, defineComponent as Ye, computed as N, openBlock as u, createElementBlock as f, normalizeClass as te, createElementVNode as o, Fragment as W, renderList as me, createCommentVNode as O, toDisplayString as b, createBlock as Xe, unref as s, createTextVNode as Ke, normalizeStyle as Ee, watch as xe, nextTick as nt, onMounted as st, onUnmounted as rt, createStaticVNode as Ut, withDirectives as sn, vModelText as rn, withModifiers as Ue } from "vue";
import { useI18n as We } from "vue-i18n";
import { MarkdownContent as ln, useChatStore as Vt, useWizardStore as gt, useSettingsSectionsStore as cn, useConfirm as un, useLifeStore as Xt, useUIPatchesStore as Kt, live2dRuntimeReady as dn } from "@0kay/host";
const it = E([]);
let fn = 0;
const mt = /* @__PURE__ */ new Map();
function hn(i) {
  const t = mt.get(i);
  t && clearTimeout(t), mt.delete(i), it.value = it.value.filter((l) => l.id !== i);
}
function et(i, t = "info", l) {
  const a = {
    id: ++fn,
    kind: t,
    message: i,
    duration: t === "error" ? 6500 : 3500
  };
  return it.value = [...it.value.slice(-4), a], mt.set(a.id, setTimeout(() => hn(a.id), a.duration)), a.id;
}
const V = E("off"), he = E(""), Be = E(""), tt = 2600, vn = 9e3, mn = 850, gn = 0.012, pn = 0.02;
let K = null, Le = null, Ve = null, ne = !0, pt = !1, ot = null, Ae = "wake", be = "";
const Ht = (i) => new Promise((t) => setTimeout(t, i));
function Dt(i) {
  return i.toLowerCase().replace(/[\s\u3000]+/g, "").replace(/[，。！？、,.!?~～…:：;；"'“”‘’()（）[\]【】<>《》\-—_/\\]+/g, "");
}
function Yt(i, t) {
  const l = Dt(i);
  return l ? t.some((a) => {
    const d = Dt(a);
    return d.length > 0 && l.includes(d);
  }) : !1;
}
function yn() {
  const i = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  if (typeof MediaRecorder > "u") return "";
  for (const t of i)
    if (MediaRecorder.isTypeSupported?.(t)) return t;
  return "";
}
async function wn() {
  try {
    const i = await fetch("/api/asr", { signal: AbortSignal.timeout(5e3) });
    return i.ok ? !!(await i.json()).configured : !1;
  } catch {
    return !1;
  }
}
async function yt(i) {
  const t = new FormData(), l = i.type || "audio/webm", a = l.includes("mp4") ? "m4a" : l.includes("ogg") ? "ogg" : l.includes("wav") ? "wav" : "webm";
  t.append("audio", i, `chunk.${a}`);
  const d = K?.language || ve?.language;
  d && t.append("language", d);
  const y = await fetch("/api/asr", { method: "POST", body: t });
  if (y.status === 503) return { text: "", configured: !1 };
  if (!y.ok) throw new Error(await y.text());
  const _ = await y.json();
  return { text: String(_.text || ""), configured: !0 };
}
function kn(i) {
  const t = window.AudioContext || window.webkitAudioContext;
  Ve = new t();
  const l = Ve.createMediaStreamSource(i), a = Ve.createAnalyser();
  a.fftSize = 1024, l.connect(a);
  const d = new Float32Array(a.fftSize);
  return {
    read() {
      a.getFloatTimeDomainData(d);
      let y = 0;
      for (let _ = 0; _ < d.length; _++) y += d[_] * d[_];
      return Math.sqrt(y / d.length);
    },
    close() {
      try {
        l.disconnect();
      } catch {
      }
      try {
        Ve?.close();
      } catch {
      }
      Ve = null;
    }
  };
}
function De(i, t = !1) {
  let l = () => {
  };
  return { blob: new Promise((d) => {
    if (!Le || typeof MediaRecorder > "u") {
      d(null);
      return;
    }
    const y = yn();
    let _;
    try {
      _ = new MediaRecorder(Le, y ? { mimeType: y } : void 0);
    } catch {
      d(null);
      return;
    }
    const C = [], $ = t ? kn(Le) : null;
    let x = 0, S = 0, F = !1;
    const B = () => {
      if (!F) {
        F = !0, $ && $.close(), clearTimeout(Q), clearInterval(R);
        try {
          _.state !== "inactive" && _.stop();
        } catch {
        }
      }
    };
    l = B;
    const Q = setTimeout(B, i), R = setInterval(() => {
      if (!$) return;
      const k = $.read(), p = Date.now();
      if (k >= pn) {
        x = p, S = 0;
        return;
      }
      if (!(!x || p - x < 500)) {
        if (k > gn) {
          S = 0;
          return;
        }
        S ? p - S >= mn && B() : S = p;
      }
    }, 80);
    _.ondataavailable = (k) => {
      k.data && k.data.size && C.push(k.data);
    }, _.onstop = () => {
      $ && $.close(), d(C.length ? new Blob(C, { type: _.mimeType || y || "audio/webm" }) : null);
    };
    try {
      _.start();
    } catch {
      B(), d(null);
    }
  }), cancel: () => l() };
}
function bn() {
  try {
    const i = window.AudioContext || window.webkitAudioContext, t = new i(), l = t.currentTime;
    for (const [a, d] of [660, 880].entries()) {
      const y = t.createOscillator(), _ = t.createGain();
      y.type = "sine", y.frequency.value = d, _.gain.setValueAtTime(1e-4, l + a * 0.09), _.gain.exponentialRampToValueAtTime(0.06, l + a * 0.09 + 0.02), _.gain.exponentialRampToValueAtTime(1e-4, l + a * 0.09 + 0.13), y.connect(_).connect(t.destination), y.start(l + a * 0.09), y.stop(l + a * 0.09 + 0.15);
    }
    setTimeout(() => {
      try {
        t.close();
      } catch {
      }
    }, 600);
  } catch {
  }
}
async function xn(i) {
  if (!K || ne) return;
  V.value = "woken", bn(), K.onWake(i), V.value = "capturing";
  const t = await De(vn, !0).blob;
  if (!ne) {
    if (t && t.size > 2e3)
      try {
        const a = (await yt(t)).text.trim();
        a && (Be.value = a, K?.onUtterance(a));
      } catch {
      }
    !ne && he.value === "core" && (V.value = "listening");
  }
}
async function _n() {
  let i = De(tt);
  try {
    for (; !ne && he.value === "core"; ) {
      if (pt) {
        i?.cancel(), i = null, await Ht(250);
        continue;
      }
      i || (i = De(tt));
      const t = await i.blob;
      if (ne || he.value !== "core") return;
      if (i = De(tt), !t || t.size < 1200) continue;
      let l;
      try {
        l = await yt(t);
      } catch {
        continue;
      }
      if (!l.configured) {
        he.value = "", jt();
        return;
      }
      const a = l.text.trim();
      a && (Be.value = a, K?.onHeard?.(a), K && Yt(a, K.nicknames) && (i?.cancel(), i = null, await xn(a), !ne && he.value === "core" && (i = De(tt))));
    }
  } finally {
    i?.cancel();
  }
}
function Wt() {
  const i = window;
  return i.SpeechRecognition || i.webkitSpeechRecognition || null;
}
function jt() {
  const i = Wt();
  if (!i) {
    $e("no-engine");
    return;
  }
  he.value !== "browser" && (he.value = "browser"), Ae = "wake", be = "";
  const t = new i();
  ot = t, t.lang = K?.language || "zh-CN", t.continuous = !0, t.interimResults = !0, t.onresult = (l) => {
    let a = "";
    for (let d = l.resultIndex; d < l.results.length; d++)
      l.results[d].isFinal && (a += l.results[d][0].transcript);
    if (a = a.trim(), !!a) {
      if (Be.value = a, K?.onHeard?.(a), Ae === "wake") {
        K && Yt(a, K.nicknames) && (V.value = "woken", K.onWake(a), Ae = "capture", be = "", V.value = "capturing");
        return;
      }
      be = `${be}${a}`.trim();
    }
  }, t.onend = () => {
    if (!ne) {
      Ae === "capture" && be && (K?.onUtterance(be), be = "", Ae = "wake", V.value = "listening");
      try {
        t.start();
      } catch {
      }
    }
  }, t.onerror = (l) => {
    if (l?.error === "not-allowed" || l?.error === "service-not-allowed") {
      $e("mic-denied");
      return;
    }
    l?.error === "no-speech" || l?.error === "aborted" || $e("error", String(l?.error || "speech recognition failed"));
  };
  try {
    t.start(), V.value = "listening";
  } catch (l) {
    $e("error", l?.message || "speech recognition failed");
  }
}
function $e(i, t) {
  Ie(), V.value = "error", K?.onError?.(i, t);
}
async function Cn(i) {
  if (Ie(), K = i, ne = !1, pt = !1, Be.value = "", !i.nicknames.length) {
    $e("no-nickname");
    return;
  }
  if (await wn()) {
    if (ne) return;
    he.value = "core";
    try {
      Le = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !0, noiseSuppression: !0 } });
    } catch (t) {
      const l = t?.name === "NotAllowedError" || t?.name === "SecurityError";
      $e(l ? "mic-denied" : "error", t?.message);
      return;
    }
    if (ne) {
      lt();
      return;
    }
    V.value = "listening", _n();
    return;
  }
  if (Wt()) {
    jt();
    return;
  }
  $e("no-engine");
}
function lt() {
  try {
    Le?.getTracks().forEach((i) => i.stop());
  } catch {
  }
  Le = null;
}
function Ie() {
  if (ne = !0, lt(), ot) {
    const i = ot;
    ot = null, i.onend = null, i.onresult = null, i.onerror = null;
    try {
      i.stop();
    } catch {
    }
  }
  Ae = "wake", be = "", he.value = "", V.value !== "error" && (V.value = "off");
}
function Rt(i) {
  pt = i;
}
const ge = E("off"), Mn = 2e4, Sn = 9e4;
let ve = null, He = !1, at = 0;
function $n(i) {
  He = i;
}
async function In(i) {
  Ie(), Re("hangup"), ve = i, He = !1, ge.value = "dialing";
  try {
    Le = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !0, noiseSuppression: !0 } });
  } catch (t) {
    ge.value = "off", i.onEnd?.((t?.name === "NotAllowedError" || t?.name === "SecurityError", "error"));
    return;
  }
  if (!ve) {
    lt();
    return;
  }
  at = Date.now(), ge.value = "live", En();
}
function Re(i = "hangup") {
  const t = ge.value !== "off", l = ve;
  ve = null, He = !1, ge.value = "off", t && (lt(), l?.onEnd?.(i));
}
async function En() {
  for (; ve && ge.value === "live"; ) {
    if (He) {
      await Ht(200);
      continue;
    }
    if (Date.now() - at > Sn) {
      Re("silence");
      return;
    }
    const i = De(Mn, !0), t = await i.blob;
    if (!ve || ge.value !== "live") {
      i.cancel();
      return;
    }
    if (He || !t || t.size < 1200) continue;
    at = Date.now();
    let l = "";
    try {
      const a = await yt(t);
      if (!a.configured) {
        Re("error");
        return;
      }
      l = a.text.trim();
    } catch {
      continue;
    }
    !l || !ve || ge.value !== "live" || (at = Date.now(), ve.onUtterance(l));
  }
}
function Bt(i) {
  return i.irritation > 0.7 ? "irritated" : i.valence > 0.5 ? "happy" : i.valence < -0.3 ? "sad" : "neutral";
}
const Ln = {
  happy: "#107c10",
  sad: "#0078d4",
  irritated: "#d13438",
  neutral: "#8a8886"
};
function Pn(i) {
  return Ln[i];
}
const Tn = {
  key: 0,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, An = {
  key: 1,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, Dn = { class: "content-wrapper" }, Rn = {
  key: 0,
  class: "images"
}, Bn = ["src"], On = {
  key: 1,
  class: "files"
}, Nn = ["href", "title"], Fn = { class: "msg-file-name" }, zn = {
  key: 3,
  class: "media-row"
}, Un = { class: "media-chip" }, Vn = {
  key: 4,
  class: "selfie"
}, Xn = ["src", "alt"], Kn = {
  key: 1,
  class: "selfie-pending"
}, Hn = {
  key: 5,
  class: "think-panel"
}, Yn = ["aria-expanded"], Wn = { class: "think-body" }, jn = {
  key: 0,
  class: "think-raw"
}, qn = {
  key: 1,
  class: "think-summary"
}, Jn = { class: "meta" }, Gn = { class: "time" }, Zn = /* @__PURE__ */ Ye({
  __name: "MessageBubble",
  props: {
    message: {},
    streaming: { type: Boolean }
  },
  setup(i) {
    const t = i, { t: l, locale: a } = We(), d = N(() => t.message.role === "user"), y = E(!1), _ = N(() => {
      if (!t.message.thinkSummary) return null;
      try {
        const $ = JSON.parse(t.message.thinkSummary);
        if (typeof $.raw == "string" && $.raw.trim()) return { raw: $.raw };
        if (typeof $.summary == "string" && $.summary.trim()) return $;
        const x = $.intent || l("messageBubble.intentDefault"), S = $.strategy || l("messageBubble.strategyDefault");
        return { summary: l("messageBubble.summary", { intent: x, strategy: S }) };
      } catch {
        return { summary: t.message.thinkSummary };
      }
    }), C = N(() => {
      const $ = t.message.timestamp, x = $.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
      return new Intl.DateTimeFormat(a.value, {
        ...x ? {} : { year: "numeric" },
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }).format($);
    });
    return ($, x) => (u(), f("div", {
      class: te(["message", { user: d.value, assistant: !d.value }])
    }, [
      o("div", {
        class: te(["avatar", { "user-avatar": d.value, "assistant-avatar": !d.value }])
      }, [
        d.value ? (u(), f("svg", Tn, [...x[1] || (x[1] = [
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
        ])])) : (u(), f("svg", An, [...x[2] || (x[2] = [
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
      o("div", Dn, [
        i.message.images?.length ? (u(), f("div", Rn, [
          (u(!0), f(W, null, me(i.message.images, (S, F) => (u(), f("img", {
            key: F,
            src: S,
            alt: "",
            class: "msg-img"
          }, null, 8, Bn))), 128))
        ])) : O("", !0),
        i.message.files?.length ? (u(), f("div", On, [
          (u(!0), f(W, null, me(i.message.files, (S, F) => (u(), f("a", {
            key: F,
            href: S.url,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "msg-file",
            title: S.mime || ""
          }, [
            o("span", Fn, b(S.name), 1)
          ], 8, Nn))), 128))
        ])) : O("", !0),
        i.message.content ? (u(), f("div", {
          key: 2,
          class: te(["content", { "content-markdown": !d.value && !i.streaming }])
        }, [
          !d.value && !i.streaming ? (u(), Xe(s(ln), {
            key: 0,
            content: i.message.content
          }, null, 8, ["content"])) : (u(), f(W, { key: 1 }, [
            Ke(b(i.message.content), 1)
          ], 64))
        ], 2)) : O("", !0),
        !d.value && (i.message.media?.voice || i.message.media?.call) ? (u(), f("div", zn, [
          o("span", Un, [
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
            Ke(" " + b(i.message.media?.call ? s(l)("chat.mediaCall") : s(l)("chat.mediaVoice")), 1)
          ])
        ])) : O("", !0),
        !d.value && i.message.media?.selfie ? (u(), f("div", Vn, [
          i.message.selfieUrl ? (u(), f("img", {
            key: 0,
            src: i.message.selfieUrl,
            alt: i.message.media.selfie,
            class: "selfie-img"
          }, null, 8, Xn)) : (u(), f("div", Kn, [
            x[4] || (x[4] = o("span", {
              class: "selfie-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            Ke(" " + b(s(l)("chat.mediaSelfieDrawing")), 1)
          ]))
        ])) : O("", !0),
        !d.value && _.value ? (u(), f("div", Hn, [
          o("button", {
            class: "think-toggle",
            type: "button",
            "aria-expanded": y.value,
            onClick: x[0] || (x[0] = (S) => y.value = !y.value)
          }, [
            o("span", null, b(s(l)("chat.thinkLabel")), 1),
            o("span", null, b(y.value ? s(l)("chat.thinkCollapse") : s(l)("chat.thinkExpand")), 1)
          ], 8, Yn),
          o("div", {
            class: te(["collapse-grid", { open: y.value }])
          }, [
            o("div", null, [
              o("div", Wn, [
                _.value.raw ? (u(), f("pre", jn, b(_.value.raw), 1)) : _.value.summary ? (u(), f("p", qn, b(_.value.summary), 1)) : O("", !0)
              ])
            ])
          ], 2)
        ])) : O("", !0),
        o("div", Jn, [
          o("span", Gn, b(C.value), 1),
          !d.value && i.message.emotion ? (u(), f(W, { key: 0 }, [
            x[5] || (x[5] = o("span", { class: "separator" }, "·", -1)),
            o("span", {
              class: "emotion",
              style: Ee({ color: s(Pn)(s(Bt)(i.message.emotion)) })
            }, b(s(l)(`emotion.${s(Bt)(i.message.emotion)}`)), 5)
          ], 64)) : O("", !0)
        ])
      ])
    ], 2));
  }
}), je = (i, t) => {
  const l = i.__vccOpts || i;
  for (const [a, d] of t)
    l[a] = d;
  return l;
}, Qn = /* @__PURE__ */ je(Zn, [["__scopeId", "data-v-5eead54f"]]), eo = { class: "chat-panel" }, to = {
  class: "messages",
  role: "log",
  "aria-live": "polite",
  "aria-relevant": "additions text"
}, no = {
  key: 0,
  class: "empty-state"
}, oo = {
  key: 1,
  class: "typing-indicator"
}, ao = { class: "typing-text" }, io = { class: "input-area" }, so = {
  key: 0,
  class: "pending-images"
}, ro = ["src"], lo = ["aria-label", "title", "onClick"], co = {
  key: 0,
  class: "pending-thumb uploading",
  "aria-hidden": "true"
}, uo = {
  key: 1,
  class: "pending-files"
}, fo = ["title"], ho = { class: "pending-file-name" }, vo = ["title", "onClick"], mo = {
  key: 2,
  class: "call-strip"
}, go = { class: "call-text" }, po = { class: "wake-text" }, yo = ["title"], wo = { class: "input-wrapper" }, ko = ["title", "disabled"], bo = ["title", "disabled"], xo = ["title", "aria-pressed", "disabled"], _o = ["placeholder", "disabled"], Co = ["aria-label", "title", "disabled"], Mo = { class: "input-footer" }, So = {
  key: 0,
  class: "connection-status disconnected"
}, $o = {
  key: 1,
  class: "connection-status connected"
}, Io = { class: "hint" }, Eo = ["title"], Lo = ["disabled"], Po = ["disabled"], To = 80, Ao = /* @__PURE__ */ Ye({
  __name: "ChatPanel",
  setup(i) {
    const { t, locale: l } = We(), a = Vt(), d = gt(), y = cn(), { confirm: _ } = un(), C = E(""), $ = E(null), x = E(null), S = E([]), F = E(null), B = E([]), Q = E(null), R = E(!1), k = E([]), p = E(!1), P = N(() => V.value === "listening" || V.value === "woken" || V.value === "capturing"), U = N(() => P.value ? t("chat.wakeOnTitle") : t("chat.wakeOffTitle")), re = N(() => V.value === "capturing" ? Be.value ? t("chat.wakeHeardLine", { text: Be.value }) : t("chat.wakeCapturing") : V.value === "woken" ? t("chat.wakeWoken") : t("chat.wakeListening", { name: k.value[0] || "" }));
    function j(h) {
      const v = y.values.life?.[h];
      return v == null ? "" : String(v);
    }
    function pe() {
      return j("wake_nickname").split(/[,，、;；\s]+/).map((h) => h.trim()).filter(Boolean);
    }
    function I(h, c) {
      const v = h === "no-nickname" ? t("chat.wakeNeedNickname") : h === "no-engine" ? t("chat.wakeNoEngine") : h === "mic-denied" ? t("chat.wakeMicDenied") : t("chat.wakeFailed", { detail: c || "unknown" });
      et(v, "error");
    }
    function H(h) {
      const c = h.trim();
      if (c) {
        if (a.isTyping) {
          C.value = c, nt(we);
          return;
        }
        C.value = c, le();
      }
    }
    async function M() {
      if (!p.value) {
        p.value = !0;
        try {
          await y.loadValues("life");
          const h = pe();
          if (k.value = h, !h.length) {
            I("no-nickname");
            return;
          }
          await Cn({
            nicknames: h,
            language: j("asr_language") || "zh",
            onWake: () => {
              x.value?.focus();
            },
            onUtterance: H,
            onError: I
          });
        } finally {
          p.value = !1;
        }
      }
    }
    function ye() {
      if (P.value) {
        Ie();
        return;
      }
      M();
    }
    function we() {
      const h = x.value;
      h && (h.style.height = "auto", h.style.height = `${Math.min(h.scrollHeight, 120)}px`);
    }
    xe(C, () => nt(we));
    const Oe = E(!0);
    let w = !1;
    function g() {
      const h = $.value;
      h && (Oe.value = h.scrollHeight - h.scrollTop - h.clientHeight <= To);
    }
    function le() {
      if (a.isTyping) return;
      const h = C.value.trim();
      if (!h && S.value.length === 0 && B.value.length === 0) return;
      const c = [...S.value], v = B.value.map((T) => ({ ...T }));
      S.value = [], B.value = [], w = !0, a.sendMessage(h, c, v), C.value = "";
    }
    function Pe(h) {
      if (h.key === "Enter" && !h.shiftKey) {
        if (h.isComposing || h.keyCode === 229) return;
        h.preventDefault(), le();
      }
    }
    function ct() {
      F.value?.click();
    }
    async function z(h) {
      const c = h.target, v = Array.from(c.files || []);
      if (c.value = "", !!v.length) {
        R.value = !0;
        try {
          for (const T of v) {
            const J = await a.uploadImage(T);
            S.value.push(J);
          }
        } catch (T) {
          console.error("image upload failed:", T);
          const J = v.length === 1 ? v[0].name : "";
          et(J ? t("chat.uploadFailedNamed", { name: J }) : t("chat.uploadFailed"), "error");
        } finally {
          R.value = !1;
        }
      }
    }
    function Te(h) {
      S.value = S.value.filter((c) => c !== h);
    }
    function _e() {
      Q.value?.click();
    }
    async function oe(h) {
      const c = h.target, v = Array.from(c.files || []);
      if (c.value = "", !!v.length) {
        R.value = !0;
        try {
          for (const T of v)
            B.value.push(await a.uploadFile(T));
        } catch (T) {
          console.error("file upload failed:", T);
          const J = v.length === 1 ? v[0].name : "";
          et(J ? t("chat.uploadFailedNamed", { name: J }) : t("chat.uploadFailed"), "error");
        } finally {
          R.value = !1;
        }
      }
    }
    function Ne(h) {
      B.value = B.value.filter((c) => c.url !== h);
    }
    async function ae(h) {
      const c = Array.from(h.clipboardData?.files || []);
      if (c.length) {
        h.preventDefault(), R.value = !0;
        try {
          for (const v of c)
            v.type.startsWith("image/") ? S.value.push(await a.uploadImage(v)) : B.value.push(await a.uploadFile(v));
        } catch (v) {
          console.error("paste upload failed:", v), et(t("chat.uploadFailed"), "error");
        } finally {
          R.value = !1;
        }
      }
    }
    async function ce() {
      await _({
        title: t("chat.clear"),
        message: t("chat.clearConfirm"),
        confirmLabel: t("chat.clear"),
        danger: !0
      }) && a.clearMessages();
    }
    function ie() {
      const h = a.messages;
      if (!h.length) return;
      const c = d.persona.name || t("chat.defaultCharacter"), v = new Intl.DateTimeFormat(l.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }), T = [];
      T.push(`# ${t("chat.exportTitle")}`, ""), T.push(`- ${t("chat.defaultCharacter")}: ${c}`), T.push(`- ${v.format(/* @__PURE__ */ new Date())}`, "");
      for (const X of h) {
        if (!X.content && !X.images?.length && !X.files?.length) continue;
        const qe = X.role === "user" ? t("chat.you") : c;
        if (T.push(`## ${qe} · ${v.format(X.timestamp)}`), X.content && T.push("", X.content), X.images?.length) {
          T.push("");
          for (const ue of X.images) T.push(`![image](${ue})`);
        }
        if (X.files?.length) {
          T.push("");
          for (const ue of X.files) T.push(`- [${ue.name}](${ue.url})`);
        }
        T.push("");
      }
      const J = new Blob([T.join(`
`)], { type: "text/markdown;charset=utf-8" }), Ce = URL.createObjectURL(J), ke = /* @__PURE__ */ new Date(), G = (X) => String(X).padStart(2, "0"), Me = document.createElement("a");
      Me.href = Ce, Me.download = `0kay-chat-${ke.getFullYear()}${G(ke.getMonth() + 1)}${G(ke.getDate())}-${G(ke.getHours())}${G(ke.getMinutes())}.md`, document.body.appendChild(Me), Me.click(), Me.remove(), URL.revokeObjectURL(Ce);
    }
    st(() => {
      a.restoreHistory(), a.isConnected || a.connect(), (async () => (await y.loadValues("life"), j("wake_enabled") === "true" && pe().length && M()))();
    });
    let q = null;
    return xe(() => a.callMode, (h) => {
      if (!h) {
        Re("hangup");
        return;
      }
      q = a.voiceEnabled, a.setVoiceEnabled(!0), In({
        language: j("asr_language") || "zh",
        onUtterance: (c) => {
          a.sendMessage(c);
        },
        onEnd: () => {
          q !== null && a.setVoiceEnabled(q), q = null, a.endCall();
        }
      });
    }), xe(() => a.isTyping, (h) => $n(h || !a.voiceEnabled), { immediate: !0 }), rt(() => {
      Ie(), Rt(!1), Re("hangup");
    }), xe(() => a.isTyping, (h) => Rt(h), { immediate: !0 }), xe(
      () => a.messages.length,
      async () => {
        await nt();
        const h = $.value;
        h && ((Oe.value || w) && (h.scrollTop = h.scrollHeight, Oe.value = !0), w = !1);
      }
    ), (h, c) => (u(), f("div", eo, [
      o("div", {
        class: "chat-container",
        ref_key: "chatContainer",
        ref: $,
        onScroll: g
      }, [
        o("div", to, [
          s(a).messages.length === 0 ? (u(), f("div", no, [
            c[5] || (c[5] = Ut('<div class="empty-icon" data-v-562b70d1><svg width="64" height="64" viewBox="0 0 64 64" fill="none" data-v-562b70d1><circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" data-v-562b70d1></circle><circle cx="32" cy="28" r="8" stroke="currentColor" stroke-width="2" data-v-562b70d1></circle><path d="M20 44C20 38 26 34 32 34C38 34 44 38 44 44" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-562b70d1></path></svg></div>', 1)),
            o("h3", null, b(s(t)("chat.empty")), 1),
            o("p", null, b(s(t)("chat.emptyHint", { name: s(d).persona.name || s(t)("chat.defaultCharacter") })), 1)
          ])) : O("", !0),
          (u(!0), f(W, null, me(s(a).messages, (v, T) => (u(), Xe(Qn, {
            key: v.id,
            message: v,
            streaming: s(a).isTyping && T === s(a).messages.length - 1
          }, null, 8, ["message", "streaming"]))), 128)),
          s(a).isTyping ? (u(), f("div", oo, [
            c[6] || (c[6] = o("div", { class: "typing-dots" }, [
              o("span"),
              o("span"),
              o("span")
            ], -1)),
            o("span", ao, b(s(d).persona.name || "AI") + " " + b(s(t)("chat.thinking")), 1)
          ])) : O("", !0)
        ])
      ], 544),
      o("div", io, [
        S.value.length || R.value ? (u(), f("div", so, [
          (u(!0), f(W, null, me(S.value, (v) => (u(), f("div", {
            key: v,
            class: "pending-thumb"
          }, [
            o("img", {
              src: v,
              alt: ""
            }, null, 8, ro),
            o("button", {
              class: "remove-img",
              type: "button",
              "aria-label": s(t)("chat.removeImage"),
              title: s(t)("chat.removeImage"),
              onClick: (T) => Te(v)
            }, " × ", 8, lo)
          ]))), 128)),
          R.value ? (u(), f("div", co, [...c[7] || (c[7] = [
            o("span", { class: "upload-spinner" }, null, -1)
          ])])) : O("", !0)
        ])) : O("", !0),
        B.value.length ? (u(), f("div", uo, [
          (u(!0), f(W, null, me(B.value, (v) => (u(), f("span", {
            key: v.url,
            class: "pending-file",
            title: `${v.mime || ""} · ${v.size || 0} B`
          }, [
            o("span", ho, b(v.name), 1),
            o("button", {
              class: "remove-file",
              type: "button",
              title: s(t)("chat.removeFile"),
              onClick: (T) => Ne(v.url)
            }, " × ", 8, vo)
          ], 8, fo))), 128))
        ])) : O("", !0),
        s(a).callMode ? (u(), f("div", mo, [
          c[8] || (c[8] = o("span", {
            class: "call-dot",
            "aria-hidden": "true"
          }, null, -1)),
          o("span", go, b(s(ge) === "dialing" ? s(t)("chat.callDialing") : s(t)("chat.callBanner")), 1),
          o("button", {
            class: "call-end",
            type: "button",
            onClick: c[0] || (c[0] = (v) => s(Re)("hangup"))
          }, b(s(t)("chat.callEnd")), 1)
        ])) : O("", !0),
        P.value ? (u(), f("div", {
          key: 3,
          class: te(["wake-strip", s(V)])
        }, [
          c[9] || (c[9] = o("span", {
            class: "wake-dot",
            "aria-hidden": "true"
          }, null, -1)),
          o("span", po, b(re.value), 1),
          o("button", {
            class: "wake-stop",
            type: "button",
            title: s(t)("chat.wakeOnTitle"),
            onClick: c[1] || (c[1] = //@ts-ignore
            (...v) => s(Ie) && s(Ie)(...v))
          }, "×", 8, yo)
        ], 2)) : O("", !0),
        o("div", wo, [
          o("input", {
            ref_key: "imageInput",
            ref: F,
            type: "file",
            accept: "image/png,image/jpeg,image/gif,image/webp",
            multiple: "",
            hidden: "",
            onChange: z
          }, null, 544),
          o("input", {
            ref_key: "fileInput",
            ref: Q,
            type: "file",
            multiple: "",
            hidden: "",
            onChange: oe
          }, null, 544),
          o("button", {
            class: "attach-btn",
            type: "button",
            title: s(t)("chat.attachImage"),
            disabled: R.value || !s(a).isConnected,
            onClick: ct
          }, [...c[10] || (c[10] = [
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
          ])], 8, ko),
          o("button", {
            class: "attach-btn",
            type: "button",
            title: s(t)("chat.attachFile"),
            disabled: R.value || !s(a).isConnected,
            onClick: _e
          }, [...c[11] || (c[11] = [
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
          ])], 8, bo),
          o("button", {
            class: te(["attach-btn wake-btn", { active: P.value }]),
            type: "button",
            title: U.value,
            "aria-pressed": P.value,
            disabled: p.value,
            onClick: ye
          }, [...c[12] || (c[12] = [
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
          ])], 10, xo),
          sn(o("textarea", {
            ref_key: "messageInput",
            ref: x,
            "onUpdate:modelValue": c[2] || (c[2] = (v) => C.value = v),
            class: "message-input",
            placeholder: s(t)("chat.inputPlaceholder"),
            rows: "1",
            onKeydown: Pe,
            onPaste: ae,
            disabled: !s(a).isConnected
          }, null, 40, _o), [
            [rn, C.value]
          ]),
          o("button", {
            class: "send-button",
            "aria-label": s(t)("chat.send"),
            title: s(t)("chat.send"),
            onClick: le,
            disabled: !C.value.trim() && !S.value.length && !B.value.length || !s(a).isConnected || s(a).isTyping
          }, [...c[13] || (c[13] = [
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
          ])], 8, Co)
        ]),
        o("div", Mo, [
          s(a).isConnected ? (u(), f("span", $o, [
            c[15] || (c[15] = o("span", { class: "status-dot" }, null, -1)),
            Ke(" " + b(s(t)("chat.connected")), 1)
          ])) : (u(), f("span", So, [
            c[14] || (c[14] = o("span", { class: "status-dot" }, null, -1)),
            Ke(" " + b(s(t)("chat.disconnected")), 1)
          ])),
          o("span", Io, b(s(t)("chat.contextHint", { n: s(a).contextTokens.toLocaleString() })), 1),
          o("button", {
            class: te(["context-btn", { active: s(a).voiceEnabled }]),
            type: "button",
            title: s(a).voiceEnabled ? s(t)("chat.voiceOnTitle") : s(t)("chat.voiceOffTitle"),
            onClick: c[3] || (c[3] = (v) => s(a).setVoiceEnabled(!s(a).voiceEnabled))
          }, b(s(a).voiceEnabled ? s(t)("chat.voiceOn") : s(t)("chat.voiceOff")), 11, Eo),
          o("button", {
            class: "context-btn",
            type: "button",
            disabled: s(a).messages.length === 0,
            onClick: ie
          }, b(s(t)("chat.download")), 9, Lo),
          o("button", {
            class: "context-btn",
            type: "button",
            disabled: s(a).compacting,
            onClick: c[4] || (c[4] = //@ts-ignore
            (...v) => s(a).compactContext && s(a).compactContext(...v))
          }, b(s(a).compacting ? s(t)("chat.compacting") : s(t)("chat.compact")), 9, Po),
          o("button", {
            class: "context-btn danger",
            type: "button",
            onClick: ce
          }, b(s(t)("chat.clear")), 1)
        ])
      ])
    ]));
  }
}), Do = /* @__PURE__ */ je(Ao, [["__scopeId", "data-v-562b70d1"]]), Ro = { class: "status-panel" }, Bo = { class: "panel-header" }, Oo = {
  key: 0,
  class: "patch-badge"
}, No = { class: "panel-content" }, Fo = { class: "section character-profile" }, zo = { class: "section-header" }, Uo = { class: "section-title" }, Vo = ["datetime"], Xo = ["data-section", "data-kind"], Ko = { class: "section-header" }, Ho = { class: "section-title" }, Yo = {
  key: 0,
  class: "mood-display"
}, Wo = {
  key: 0,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, jo = {
  key: 1,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, qo = {
  key: 2,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Jo = {
  key: 3,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Go = {
  key: 4,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Zo = {
  key: 1,
  class: "emotion-bars"
}, Qo = { class: "emotion-label" }, ea = { class: "emotion-bar" }, ta = {
  key: 0,
  class: "empty-tasks"
}, na = /* @__PURE__ */ Ye({
  __name: "StatusPanel",
  setup(i) {
    const { t } = We(), l = Xt(), a = Kt(), d = gt(), y = E(/* @__PURE__ */ new Date()), _ = N(() => {
      const k = d.persona.birthDate;
      if (!k) return null;
      const p = /* @__PURE__ */ new Date(`${k}T00:00:00`);
      if (Number.isNaN(p.getTime()) || p > y.value) return null;
      const P = y.value;
      return P.getFullYear() - p.getFullYear() - +(P.getMonth() < p.getMonth() || P.getMonth() === p.getMonth() && P.getDate() < p.getDate());
    });
    let C = null;
    function $(k) {
      if (!k || !k.startsWith("life.")) return;
      const p = k.slice(5).split(".").reduce((P, U) => P?.[U], l);
      return typeof p == "function" ? void 0 : p;
    }
    function x(k) {
      if (k.titleKey) {
        const p = t(k.titleKey);
        if (p && p !== k.titleKey) return p;
      }
      return k.title || k.id;
    }
    function S(k) {
      if (k.labelKey) {
        const p = t(k.labelKey);
        if (p && p !== k.labelKey) return p;
      }
      return k.label || k.key;
    }
    function F(k) {
      const p = Number($(`life.emotion.${k.key}`) ?? 0);
      return k.scale === "remap01" ? (p + 1) / 2 : p;
    }
    st(() => {
      C = setInterval(() => {
        y.value = /* @__PURE__ */ new Date();
      }, 1e3);
    }), rt(() => {
      C && clearInterval(C);
    });
    const B = N(
      () => a.statusSections.filter((k) => k.kind === "mood" || k.kind === "bars")
    ), Q = N(() => l.emotionColor), R = N(() => l.emotionMood);
    return (k, p) => (u(), f("div", Ro, [
      o("div", Bo, [
        o("h2", null, b(s(t)("status.title")), 1),
        s(a).loaded ? (u(), f("span", Oo, "patch")) : O("", !0)
      ]),
      o("div", No, [
        o("section", Fo, [
          o("div", zo, [
            o("span", Uo, b(s(d).persona.name || s(t)("chat.defaultCharacter")), 1)
          ]),
          o("dl", null, [
            o("div", null, [
              o("dt", null, b(s(t)("status.age")), 1),
              o("dd", null, b(_.value === null ? s(t)("status.birthdayUnset") : s(t)("status.ageValue", { age: _.value })), 1)
            ]),
            o("div", null, [
              o("dt", null, b(s(t)("status.time")), 1),
              o("dd", null, [
                o("time", {
                  datetime: y.value.toISOString()
                }, b(y.value.toLocaleString()), 9, Vo)
              ])
            ]),
            o("div", null, [
              o("dt", null, b(s(t)("status.timezone")), 1),
              o("dd", null, b(Intl.DateTimeFormat().resolvedOptions().timeZone), 1)
            ])
          ])
        ]),
        (u(!0), f(W, null, me(B.value, (P) => (u(), f("div", {
          key: P.id,
          class: "section",
          "data-section": P.id,
          "data-kind": P.kind
        }, [
          o("div", Ko, [
            o("span", Ho, b(x(P)), 1)
          ]),
          P.kind === "mood" ? (u(), f("div", Yo, [
            o("div", {
              class: "mood-icon",
              style: Ee({ color: Q.value })
            }, [
              R.value === "happy" ? (u(), f("svg", Wo, [...p[0] || (p[0] = [
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
              ])])) : R.value === "sad" ? (u(), f("svg", jo, [...p[1] || (p[1] = [
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
              ])])) : R.value === "irritated" ? (u(), f("svg", qo, [...p[2] || (p[2] = [
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
              ])])) : R.value === "sleeping" ? (u(), f("svg", Jo, [...p[3] || (p[3] = [
                Ut('<circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" data-v-45331204></circle><path d="M16 22C17 22 18 22 18 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><path d="M30 22C31 22 32 22 32 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><path d="M18 32C20 34 28 34 30 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><text x="36" y="12" fill="currentColor" font-size="12" font-weight="bold" data-v-45331204>Z</text>', 5)
              ])])) : (u(), f("svg", Go, [...p[4] || (p[4] = [
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
              style: Ee({ color: Q.value })
            }, b(s(t)(`emotion.${R.value}`)), 5)
          ])) : P.kind === "bars" ? (u(), f("div", Zo, [
            (u(!0), f(W, null, me(P.axes || [], (U) => (u(), f("div", {
              key: U.key,
              class: "emotion-row"
            }, [
              o("span", Qo, b(S(U)), 1),
              o("div", ea, [
                o("div", {
                  class: "emotion-fill",
                  style: Ee({
                    transform: `scaleX(${Math.max(0, Math.min(1, F(U)))})`,
                    backgroundColor: U.color || "#0078d4"
                  })
                }, null, 4)
              ])
            ]))), 128))
          ])) : O("", !0)
        ], 8, Xo))), 128)),
        s(a).statusSections.length === 0 ? (u(), f("div", ta, " No status sections (load life.patch) ")) : O("", !0)
      ])
    ]));
  }
}), oa = /* @__PURE__ */ je(na, [["__scopeId", "data-v-45331204"]]), aa = ["title"], ia = {
  key: 0,
  class: "stage-placeholder"
}, sa = {
  key: 1,
  class: "stage-status"
}, ra = {
  key: 2,
  class: "stage-status warn"
}, la = ["title", "aria-label"], ca = { class: "stage-hint" }, Ot = "0kay.web.live2d.resetbtn", ua = "0kay.web.live2d.transform.", da = /* @__PURE__ */ Ye({
  __name: "Live2DStage",
  setup(i) {
    const { t } = We(), l = Xt(), a = gt(), d = E(null), y = E(null), _ = E(""), C = E("idle"), $ = E(""), x = N(() => a.live2d.enabled), S = N(() => a.live2d.modelUrl.trim()), F = N(() => l.emotionMood), B = N(() => {
      const e = String(F.value || "");
      if (!e) return "";
      const n = `emotion.${e}`, r = t(n);
      return r === n ? e : r;
    }), Q = N(() => l.emotionColor), R = E([]);
    async function k() {
      try {
        const e = await fetch("/api/live2d");
        if (e.ok) {
          const n = await e.json();
          R.value = n.models || [];
        }
      } catch {
        R.value = [];
      }
    }
    const p = E(null), P = E(I()), U = E(!1);
    let re = !1, j = { x: 0, y: 0 }, pe = { x: 0, y: 0 };
    function I() {
      try {
        const e = localStorage.getItem(Ot);
        if (e) {
          const n = JSON.parse(e);
          if (typeof n?.x == "number" && typeof n?.y == "number") return n;
        }
      } catch {
      }
      return null;
    }
    const H = N(() => P.value ? { left: `${P.value.x}px`, top: `${P.value.y}px`, right: "auto", bottom: "auto" } : {});
    function M(e) {
      U.value = !0, re = !1, j = { x: e.clientX, y: e.clientY };
      const n = p.value?.getBoundingClientRect();
      pe = { x: n?.left ?? 0, y: n?.top ?? 0 };
      try {
        p.value?.setPointerCapture(e.pointerId);
      } catch {
      }
    }
    function ye(e) {
      if (!U.value || !d.value) return;
      const n = e.clientX - j.x, r = e.clientY - j.y;
      (Math.abs(n) > 3 || Math.abs(r) > 3) && (re = !0);
      const m = d.value.getBoundingClientRect(), L = p.value?.offsetWidth || 34, D = se(pe.x - m.left + n, 4, Math.max(4, m.width - L - 4)), A = se(pe.y - m.top + r, 4, Math.max(4, m.height - L - 4));
      P.value = { x: Math.round(D), y: Math.round(A) };
    }
    function we(e) {
      if (U.value) {
        U.value = !1;
        try {
          p.value?.releasePointerCapture(e.pointerId);
        } catch {
        }
        if (re)
          try {
            localStorage.setItem(Ot, JSON.stringify(P.value));
          } catch {
          }
      }
    }
    function Oe() {
      if (re) {
        re = !1;
        return;
      }
      tn();
    }
    let w = null, g = null, le = null, Pe = 0, ct = 0, z = 0, Te = { x: 0, y: 0, has: !1 }, _e = !1, oe = null, Ne = { x: 0, y: 0 }, ae = null, ce = null, ie = null, q = null, h = null, c = "off", v = 0, T = 0, J = 0, Ce = 120, ke = ["ParamMouthOpenY"];
    function G(e) {
      const n = g?.internalModel?.coreModel;
      if (!n) return;
      const r = se(e, 0, 1);
      for (const m of ke)
        try {
          typeof n.setParameterValueById == "function" ? n.setParameterValueById(m, r) : typeof n.setParamFloat == "function" && n.setParamFloat(m, r);
        } catch {
        }
    }
    function Me(e) {
      const n = [];
      try {
        const r = e?.internalModel?.settings;
        let m = r?.getLipSyncParameters?.();
        if (!Array.isArray(m) && Array.isArray(r?.groups) && (m = r.groups.find((D) => (D?.Name || D?.name || "").toLowerCase() === "lipsync")?.Ids), Array.isArray(m))
          for (const L of m) typeof L == "string" && L && n.push(L);
      } catch {
      }
      ke = n.length ? n : ["ParamMouthOpenY"];
    }
    function X() {
      if (c === "off") {
        v !== 0 && (v = 0, G(0));
        return;
      }
      if (c === "audio" && q && h) {
        q.getByteTimeDomainData(h);
        let e = 0;
        for (let m = 0; m < h.length; m++) {
          const L = (h[m] - 128) / 128;
          e += L * L;
        }
        const n = Math.sqrt(e / h.length), r = se(n * 3.4, 0, 1);
        v = v * 0.35 + r * 0.65, G(v);
        return;
      }
      if (c === "text") {
        const e = performance.now() - T;
        if (e > J * Ce + 260) {
          c = "off", v = 0, G(0);
          return;
        }
        const n = e % Ce / Ce, r = n < 0.5 ? 0.12 + 0.72 * Math.sin(n / 0.5 * Math.PI) : 0.06;
        v = v * 0.45 + r * 0.55, G(v);
      }
    }
    async function qe(e, n = "") {
      if (!e) {
        ue(n);
        return;
      }
      if (g)
        try {
          if (ae || (ae = new Audio(), ae.crossOrigin = "anonymous", ae.addEventListener("ended", () => {
            c = "off", v = 0, G(0);
          })), ce && ce !== e)
            try {
              URL.revokeObjectURL(ce);
            } catch {
            }
          if (ce = e, ae.src = e, !ie) {
            const r = window.AudioContext || window.webkitAudioContext;
            r && (ie = new r(), q = ie.createAnalyser(), q.fftSize = 1024, h = new Uint8Array(q.fftSize), ie.createMediaElementSource(ae).connect(q), q.connect(ie.destination));
          }
          await ie?.resume().catch(() => {
          }), c = "audio", await ae.play().catch(() => {
            n ? ue(n) : (c = "off", G(0));
          });
        } catch {
          n ? ue(n) : c = "off";
        }
    }
    function ue(e) {
      const n = Array.from(String(e || "")).filter((r) => /\S/.test(r));
      n.length && (Ce = /[\u4e00-\u9fff]/.test(n.join("")) ? 140 : 80, J = n.length, T = performance.now(), c = "text");
    }
    function wt() {
      c = "off", v = 0, G(0);
      try {
        ae?.pause();
      } catch {
      }
    }
    function kt(e) {
      const n = e.detail || {};
      n.url ? qe(n.url, n.text || "") : n.text && ue(n.text);
    }
    let de = {}, ee = [], Je = 0;
    function qt(e) {
      de = {}, ee = [];
      try {
        const n = e?.internalModel?.motionManager, r = e?.internalModel?.settings, m = n?.definitions || r?.motions || {};
        for (const [D, A] of Object.entries(m)) de[D] = Array.isArray(A) ? A.length : 0;
        ee = (n?.expressionManager?.definitions || r?.expressions || []).map((D) => D?.Name || D?.name).filter((D) => !!D);
      } catch {
      }
      try {
        console.info("[live2d] motions", de, "expressions", ee);
      } catch {
      }
      try {
        window.__0KAY_LIVE2D_CAPS__ = { motions: de, expressions: ee };
      } catch {
      }
    }
    function Fe(e, n) {
      if (!g) return;
      const r = Object.keys(de).filter((A) => de[A] > 0);
      if (!r.length) return;
      const m = r.find((A) => /idle/i.test(A)), L = e && de[e] > 0, D = L ? e : n == null && m ? m : r.find((A) => A !== m) || r[0];
      try {
        const A = g.internalModel?.motionManager;
        if (typeof g.motion == "function" && L) {
          g.motion(D, n);
          return;
        }
        if (n == null) {
          A?.startRandomMotion?.(D);
          return;
        }
        A?.startMotion?.(D, n);
      } catch {
      }
    }
    function Ge(e) {
      if (!g || !e) return;
      const n = /^\d+$/.test(e) ? Number(e) : ee.indexOf(e), r = n >= 0 ? n : e;
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
    function Jt() {
      ut(), !(typeof window > "u") && (Je = window.setInterval(() => {
        if (c !== "off" || document.hidden) return;
        const e = Object.keys(de).filter((n) => de[n] > 0 && !/idle/i.test(n));
        e.length && Math.random() < 0.6 && Fe(e[Math.floor(Math.random() * e.length)]), ee.length && Math.random() < 0.5 && Ge(ee[Math.floor(Math.random() * ee.length)]);
      }, 9e3));
    }
    function ut() {
      Je && (clearInterval(Je), Je = 0);
    }
    function bt(e) {
      const n = e.detail || {};
      n.expression && Ge(n.expression), (n.group || n.index != null) && Fe(n.group, n.index);
    }
    function Gt() {
      return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore);
    }
    function se(e, n, r) {
      return Math.min(r, Math.max(n, e));
    }
    function dt() {
      return ua + (S.value || "default");
    }
    function xt() {
      try {
        const e = localStorage.getItem(dt());
        if (!e) return null;
        const n = JSON.parse(e);
        if (typeof n?.x == "number" && typeof n?.y == "number" && typeof n?.scale == "number") return n;
      } catch {
      }
      return null;
    }
    function ft(e = !1) {
      if (!g) return;
      const n = () => {
        try {
          localStorage.setItem(dt(), JSON.stringify({
            x: Math.round(g.x * 100) / 100,
            y: Math.round(g.y * 100) / 100,
            scale: Math.round(g.scale.x * 1e4) / 1e4
          }));
        } catch {
        }
      };
      if (e) {
        z && (clearTimeout(z), z = 0), n();
        return;
      }
      z && clearTimeout(z), z = window.setTimeout(() => {
        z = 0, n();
      }, 140);
    }
    function _t() {
      if (ut(), c = "off", v = 0, Se(), z && (clearTimeout(z), z = 0), g) {
        try {
          w?.stage && w.stage.removeChild(g), g.destroy?.();
        } catch {
        }
        g = null;
      }
    }
    function Ct() {
      if (Tt(), _t(), le && (le.disconnect(), le = null), z && (clearTimeout(z), z = 0), w) {
        try {
          w.destroy(!1, { children: !0, texture: !1, baseTexture: !1 });
        } catch {
        }
        w = null;
      }
    }
    function Mt(e) {
      if (typeof e.getLocalBounds == "function") {
        const m = e.getLocalBounds();
        if (m && m.width > 0 && m.height > 0) return { width: m.width, height: m.height };
      }
      const n = Math.max(Math.abs(e.scale.x) || 0, 1e-4), r = Math.max(Math.abs(e.scale.y) || 0, 1e-4);
      return { width: Math.max(e.width / n, 1), height: Math.max(e.height / r, 1) };
    }
    function ht(e = g) {
      if (!e || !w) return !1;
      const n = w.screen.width, r = w.screen.height;
      if (!n || !r) return !1;
      const m = Mt(e);
      if (m.width > 0 && m.height > 0) {
        const L = Math.min(n / m.width, r / m.height) * 0.88;
        e.anchor?.set?.(0.5, 0.5), e.scale.set(L, L);
      }
      e.position.set(n * 0.5, r * 0.55);
      try {
        const L = e.getBounds?.();
        if (L && L.width > 0 && L.height > 0) {
          e.x += n * 0.5 - (L.x + L.width * 0.5), e.y += r * 0.55 - (L.y + L.height * 0.55);
          const D = e.getBounds?.();
          if (D && D.width > 0 && D.height > 0) {
            const A = Math.min(n / D.width, r / D.height) * 0.88, Z = Math.abs(e.scale.x) || 1;
            if (Number.isFinite(A) && A > 0 && Math.abs(A - Z) / Z > 0.08) {
              const fe = Z * A;
              e.scale.set(fe, fe);
              const Y = e.getBounds?.();
              Y && Y.width > 0 && (e.x += n * 0.5 - (Y.x + Y.width * 0.5), e.y += r * 0.55 - (Y.y + Y.height * 0.55));
            }
          }
        }
      } catch {
      }
      return !0;
    }
    function Zt() {
      if (!g) return { hw: 0, hh: 0 };
      const e = Mt(g), n = Math.abs(g.scale.x) || 1, r = Math.abs(g.scale.y) || 1;
      return { hw: e.width * n / 2, hh: e.height * r / 2 };
    }
    function Ze() {
      if (!g || !w) return;
      const e = w.screen.width, n = w.screen.height, { hw: r, hh: m } = Zt(), L = Math.min(r * 0.7, e * 0.5), D = Math.min(m * 0.7, n * 0.5), A = L - r, Z = e - L + r, fe = D - m, Y = n - D + m, ze = A <= Z ? se(g.x, A, Z) : e * 0.5, At = fe <= Y ? se(g.y, fe, Y) : n * 0.55;
      g.position.set(ze, At);
    }
    function Qt() {
      if (!g || !w) return;
      const e = xt();
      if (e && Number.isFinite(e.scale) && e.scale > 0) {
        g.anchor?.set?.(0.5, 0.5), g.scale.set(e.scale, e.scale), g.position.set(e.x, e.y), Ze();
        return;
      }
      ht();
    }
    function en(e, n) {
      if (!g || !window.PIXI || typeof window.PIXI.Point != "function" || typeof g.toModelPosition != "function") return null;
      try {
        const r = new window.PIXI.Point(e, n);
        return g.toModelPosition(r, new window.PIXI.Point());
      } catch {
        return null;
      }
    }
    function St(e, n, r) {
      const m = r - n;
      return !Number.isFinite(m) || Math.abs(m) <= 1e-4 ? 0 : se((e - n) / m * 2 - 1, -1, 1);
    }
    function $t(e, n) {
      const r = g?.internalModel, m = r?.focusController;
      if (!m || typeof m.focus != "function" || !w) return;
      const L = w.screen.width || 1, D = w.screen.height || 1;
      let A = e / L * 2 - 1, Z = n / D * 2 - 1;
      const fe = en(e, n);
      if (fe && r.originalWidth && r.originalHeight) {
        const Y = St(fe.x, 0, r.originalWidth), ze = St(fe.y, 0, r.originalHeight);
        Y >= -1 && Y <= 1 && ze >= -1 && ze <= 1 && (A = A * 0.35 + Y * 0.65, Z = Z * 0.35 + ze * 0.65);
      }
      A = se(A, -1, 1), Z = se(Z, -1, 1), m.focus(A, -Z);
    }
    function Qe() {
      Te.has && $t(Te.x, Te.y);
    }
    function It(e) {
      if (!g || !w || !d.value) return;
      const n = d.value.getBoundingClientRect();
      if (!n.width || !n.height) return;
      const r = (e.clientX - n.left) / n.width * w.screen.width, m = (e.clientY - n.top) / n.height * w.screen.height;
      Te = { x: r, y: m, has: !0 }, _e && e.pointerId === oe && (g.position.set(r + Ne.x, m + Ne.y), Ze(), ft()), $t(r, m);
    }
    function Et(e) {
      if (!g || !w || !d.value || e.button !== 0 && e.pointerType === "mouse" || e.target?.closest?.(".stage-reset")) return;
      const n = d.value.getBoundingClientRect();
      if (!n.width || !n.height) return;
      const r = (e.clientX - n.left) / n.width * w.screen.width, m = (e.clientY - n.top) / n.height * w.screen.height;
      _e = !0, oe = e.pointerId, Ne = { x: g.x - r, y: g.y - m };
      try {
        d.value.setPointerCapture(e.pointerId);
      } catch {
      }
      d.value && (d.value.style.cursor = "grabbing");
    }
    function Se(e) {
      if (_e && !(e && oe !== null && e.pointerId !== oe)) {
        if (_e = !1, d.value) {
          try {
            oe !== null && d.value.releasePointerCapture(oe);
          } catch {
          }
          d.value.style.cursor = "grab";
        }
        oe = null, ft(!0);
      }
    }
    function Lt(e) {
      if (!g || C.value !== "ok" || !e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const n = e.deltaY < 0 ? 1.06 : 0.94, r = se(g.scale.x * n, 0.08, 3.2);
      g.scale.set(r, r), Ze(), Qe(), ft();
    }
    function tn() {
      if (!(!g || !w)) {
        try {
          localStorage.removeItem(dt());
        } catch {
        }
        z && (clearTimeout(z), z = 0);
        try {
          w.resize?.();
        } catch {
        }
        w?.stage && (w.stage.hitArea = w.screen), ht(), Qe();
      }
    }
    function Pt() {
      Tt();
      const e = d.value;
      e && (e.style.cursor = "grab", e.addEventListener("pointermove", It), e.addEventListener("pointerdown", Et), e.addEventListener("pointerup", Se), e.addEventListener("pointercancel", Se), e.addEventListener("pointerleave", Se), e.addEventListener("wheel", Lt, { passive: !1 }));
    }
    function Tt() {
      const e = d.value;
      e && (e.removeEventListener("pointermove", It), e.removeEventListener("pointerdown", Et), e.removeEventListener("pointerup", Se), e.removeEventListener("pointercancel", Se), e.removeEventListener("pointerleave", Se), e.removeEventListener("wheel", Lt), _e = !1, oe = null);
    }
    function nn() {
      if (w || !y.value || !d.value) return;
      const e = window.PIXI;
      w = new e.Application({
        view: y.value,
        resizeTo: d.value,
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
          const n = xt();
          n && Number.isFinite(n.scale) && n.scale > 0 ? (g.position.set(n.x, n.y), g.scale.set(n.scale, n.scale), Ze()) : ht();
        }
        Qe();
      }), le.observe(d.value), Pt();
    }
    async function vt() {
      try {
        await dn;
      } catch (r) {
        C.value = "error", $.value = `Live2D runtime: ${r.message}`;
        return;
      }
      const e = ++Pe;
      if (_t(), !x.value) {
        C.value = "disabled", _.value = "";
        return;
      }
      if (!Gt()) {
        C.value = "no-libs", $.value = t("live2d.libsMissing");
        return;
      }
      const n = S.value || R.value[0]?.url;
      if (!n) {
        C.value = "error", $.value = t("live2d.noModel");
        return;
      }
      if (C.value = "loading", $.value = "", _.value = n.split("/").pop() || n, await nt(), w || nn(), !w) {
        C.value = "error", $.value = t("live2d.stageMissing");
        return;
      }
      try {
        const r = await window.PIXI.live2d.Live2DModel.from(n, { autoInteract: !1 });
        if (e !== Pe) {
          try {
            r.destroy?.();
          } catch {
          }
          return;
        }
        g = r, Pt(), r.anchor?.set?.(0.5, 0.5), w.stage.addChild(r), Qt();
        try {
          r.internalModel?.on?.("beforeModelUpdate", X);
        } catch {
        }
        Me(r), qt(r), C.value = "ok", Qe(), Fe("Idle"), Jt();
      } catch (r) {
        if (e !== Pe) return;
        console.error("Live2D load failed:", r), C.value = "error", $.value = r?.message || t("live2d.loadError");
      }
    }
    function on() {
      if (!x.value) {
        Ct(), C.value = "disabled";
        return;
      }
      vt();
    }
    st(async () => {
      window.addEventListener("live2d-models-changed", k), window.addEventListener("live2d-speak", kt), window.addEventListener("live2d-motion", bt), window.__0KAY_LIVE2D__ = { speak: qe, stop: wt, motion: Fe, expression: Ge };
      try {
        const e = await fetch("/api/settings/live2d");
        if (e.ok) {
          const { values: n } = await e.json();
          n && typeof n.enabled == "boolean" && (a.live2d.enabled = n.enabled), n && typeof n.model_url == "string" && (a.live2d.modelUrl = n.model_url);
        }
      } catch {
      }
      await k(), x.value ? vt() : C.value = "disabled";
    }), rt(() => {
      if (window.removeEventListener("live2d-models-changed", k), window.removeEventListener("live2d-speak", kt), window.removeEventListener("live2d-motion", bt), ut(), wt(), ce) {
        try {
          URL.revokeObjectURL(ce);
        } catch {
        }
        ce = null;
      }
      try {
        ie?.close();
      } catch {
      }
      ie = null, Pe++, cancelAnimationFrame(ct), Ct();
    }), xe(x, on), xe(S, () => {
      x.value && vt();
    });
    const an = { happy: 2, sad: 4, irritated: 6, neutral: 0, drowsy: 0, exhausted: 0, sleeping: 0 };
    return xe(F, (e) => {
      if (!g || c !== "off" || !ee.length) return;
      const n = an[e] ?? 0;
      Ge(ee[n] || ee[0]), (e === "happy" || e === "irritated") && Math.random() < 0.5 && Fe();
    }), (e, n) => (u(), f("div", {
      class: te(["live2d-stage", { on: x.value }])
    }, [
      o("div", {
        ref_key: "stageEl",
        ref: d,
        class: "stage-viewport",
        style: Ee({ "--mood": Q.value }),
        title: x.value && C.value === "ok" ? s(t)("live2d.interactHint") : ""
      }, [
        o("canvas", {
          ref_key: "canvasEl",
          ref: y,
          class: "stage-canvas"
        }, null, 512),
        x.value ? C.value === "loading" ? (u(), f("div", sa, b(s(t)("live2d.loading")), 1)) : C.value === "error" || C.value === "no-libs" ? (u(), f("div", ra, b($.value || s(t)("live2d.loadError")), 1)) : O("", !0) : (u(), f("div", ia, [
          o("p", null, b(s(t)("live2d.disabledHint")), 1)
        ])),
        x.value && C.value === "ok" ? (u(), f("button", {
          key: 3,
          ref_key: "resetBtnEl",
          ref: p,
          class: te(["stage-reset", { dragging: U.value }]),
          type: "button",
          style: Ee(H.value),
          title: s(t)("live2d.resetView"),
          "aria-label": s(t)("live2d.resetView"),
          onPointerdown: Ue(M, ["stop"]),
          onPointermove: Ue(ye, ["stop"]),
          onPointerup: Ue(we, ["stop"]),
          onPointercancel: Ue(we, ["stop"]),
          onClick: Ue(Oe, ["stop"])
        }, "⟲", 46, la)) : O("", !0),
        n[0] || (n[0] = o("div", { class: "stage-gradient" }, null, -1)),
        o("div", ca, b(B.value), 1)
      ], 12, aa)
    ], 2));
  }
}), fa = /* @__PURE__ */ je(da, [["__scopeId", "data-v-15b509be"]]), ha = {
  key: 0,
  class: "stage-column"
}, va = ["src", "title"], ma = ["data-chat-slot"], ga = ["aria-label", "title"], pa = ["src", "title"], ya = ["data-chat-slot"], wa = ["title"], Nt = "0kay.web.chat_panel_width_ratio", Ft = 320, ka = 360, zt = 960, ba = /* @__PURE__ */ Ye({
  __name: "ChatPage",
  setup(i) {
    const { t } = We(), l = Kt(), a = Vt(), d = E(!1), y = E(!1), _ = N(() => l.chatRegion("stage")), C = N(() => l.chatRegion("chat")), $ = N(() => _.value.some((I) => I.component === "status")), x = N(() => C.value.some((I) => I.component === "chat")), S = E(0.34), F = E(null);
    let B = !1;
    function Q() {
      try {
        const I = Number(localStorage.getItem(Nt));
        I > 0 && I < 1 && (S.value = I);
      } catch {
      }
    }
    function R(I) {
      S.value = I;
      try {
        localStorage.setItem(Nt, String(I));
      } catch {
      }
    }
    function k(I, H) {
      const M = Math.min(Ft, I * 0.3), ye = Math.min(zt, I - ka);
      return Math.min(Math.max(H, M), ye) / I;
    }
    function p(I) {
      y.value || (B = !0, I.target.setPointerCapture?.(I.pointerId), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none");
    }
    function P(I) {
      if (!B || !F.value) return;
      const H = F.value.getBoundingClientRect(), M = H.right - I.clientX;
      R(k(H.width, M));
    }
    function U() {
      B && (B = !1, document.body.style.cursor = "", document.body.style.userSelect = "");
    }
    function re(I) {
      if (y.value || I.key !== "ArrowLeft" && I.key !== "ArrowRight") return;
      const H = F.value;
      if (!H) return;
      I.preventDefault();
      const M = H.getBoundingClientRect(), ye = S.value * M.width, we = I.key === "ArrowLeft" ? ye + 24 : ye - 24;
      R(k(M.width, we));
    }
    function j() {
      const I = y.value;
      y.value = window.innerWidth <= 960, y.value ? I || (d.value = !1) : d.value = !0;
    }
    st(() => {
      Q(), j(), a.setChatVisible(!0), window.addEventListener("resize", j), window.addEventListener("pointermove", P), window.addEventListener("pointerup", U);
    }), rt(() => {
      a.setChatVisible(!1), window.removeEventListener("resize", j), window.removeEventListener("pointermove", P), window.removeEventListener("pointerup", U), document.body.style.cursor = "", document.body.style.userSelect = "";
    });
    function pe() {
      d.value = !d.value;
    }
    return (I, H) => (u(), f("div", {
      ref_key: "pageEl",
      ref: F,
      class: te(["chat-page", { "no-chat": !x.value }]),
      style: Ee(y.value ? void 0 : { "--chat-w": `min(${zt}px, max(${Ft}px, ${S.value * 100}%))` })
    }, [
      _.value.length ? (u(), f("div", ha, [
        (u(!0), f(W, null, me(_.value, (M) => (u(), f(W, {
          key: M.id
        }, [
          M.component === "live2d" ? (u(), Xe(fa, {
            key: 0,
            class: "stage-host"
          })) : M.component === "status" ? (u(), Xe(oa, {
            key: 1,
            class: "status-panel"
          })) : M.component === "iframe" && M.src ? (u(), f("iframe", {
            key: 2,
            class: "slot-frame",
            src: M.src,
            title: M.title || M.id
          }, null, 8, va)) : (u(), f("div", {
            key: 3,
            class: "slot-note",
            "data-chat-slot": M.id
          }, b(M.titleKey ? s(t)(M.titleKey) : M.title || M.id), 9, ma))
        ], 64))), 128))
      ])) : O("", !0),
      !y.value && x.value && _.value.length ? (u(), f("div", {
        key: 1,
        ref: "resizer",
        class: "page-resizer",
        role: "separator",
        "aria-orientation": "vertical",
        tabindex: "0",
        "aria-label": s(t)("chat.resizePanel"),
        title: s(t)("chat.resizePanel"),
        onPointerdown: p,
        onKeydown: re
      }, null, 40, ga)) : O("", !0),
      x.value ? (u(), f("div", {
        key: 2,
        class: te(["chat-column", { open: d.value || !y.value }])
      }, [
        (u(!0), f(W, null, me(C.value, (M) => (u(), f(W, {
          key: M.id
        }, [
          M.component === "chat" ? (u(), Xe(Do, { key: 0 })) : M.component === "iframe" && M.src ? (u(), f("iframe", {
            key: 1,
            class: "slot-frame fill",
            src: M.src,
            title: M.title || M.id
          }, null, 8, pa)) : (u(), f("div", {
            key: 2,
            class: "slot-note",
            "data-chat-slot": M.id
          }, b(M.titleKey ? s(t)(M.titleKey) : M.title || M.id), 9, ya))
        ], 64))), 128))
      ], 2)) : O("", !0),
      y.value && $.value ? (u(), f("button", {
        key: 3,
        class: "status-fab",
        title: s(t)("app.status"),
        onClick: pe
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
      ])], 8, wa)) : O("", !0)
    ], 6));
  }
}), Ma = /* @__PURE__ */ je(ba, [["__scopeId", "data-v-599f785f"]]);
export {
  Ma as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".media-row[data-v-5eead54f]{display:flex;gap:6px;margin:0 0 6px}.media-chip[data-v-5eead54f]{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 10px;border-radius:999px;background:var(--md-primary-container, #e8e0ff);color:var(--md-on-primary-container, #21005d);font-size:11.5px;font-weight:650}.media-chip svg[data-v-5eead54f]{flex:none}.selfie[data-v-5eead54f]{margin:0 0 6px}.selfie-img[data-v-5eead54f]{display:block;max-width:260px;max-height:320px;border-radius:14px;border:1px solid var(--md-outline-variant)}.selfie-pending[data-v-5eead54f]{display:inline-flex;align-items:center;gap:8px;min-width:200px;padding:14px 16px;border-radius:14px;border:1px dashed var(--md-outline-variant);color:var(--md-on-surface-variant);font-size:12px}.selfie-spinner[data-v-5eead54f]{width:13px;height:13px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:selfie-spin-5eead54f .7s linear infinite}@keyframes selfie-spin-5eead54f{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.selfie-spinner[data-v-5eead54f]{animation:none}}.message[data-v-5eead54f]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-5eead54f]{flex-direction:row-reverse}.avatar[data-v-5eead54f]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-5eead54f]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-5eead54f]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-5eead54f]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-5eead54f]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-5eead54f]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-5eead54f]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden}.msg-file-name[data-v-5eead54f]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-5eead54f]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-5eead54f]{max-width:70%}.content[data-v-5eead54f]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.content-markdown[data-v-5eead54f]{white-space:normal}.user .content[data-v-5eead54f]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-5eead54f]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-5eead54f]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-5eead54f]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-5eead54f]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-5eead54f]{margin:4px 0}.think-body b[data-v-5eead54f]{color:var(--md-on-surface)}.think-summary[data-v-5eead54f]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-5eead54f]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-5eead54f]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-5eead54f]{justify-content:flex-end}.separator[data-v-5eead54f]{color:var(--neutral-gray-10)}.emotion[data-v-5eead54f]{font-weight:500}.chat-panel[data-v-562b70d1]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-562b70d1]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-562b70d1]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-562b70d1]{color:var(--md-error)}.chat-container[data-v-562b70d1]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-562b70d1]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-562b70d1]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-562b70d1]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-562b70d1]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-562b70d1]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-562b70d1]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-562b70d1]{display:flex;gap:4px}.typing-dots span[data-v-562b70d1]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-562b70d1 1.4s infinite ease-in-out}.typing-dots span[data-v-562b70d1]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-562b70d1]:nth-child(2){animation-delay:-.16s}@keyframes bounce-562b70d1{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-562b70d1]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-562b70d1]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-562b70d1]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-562b70d1]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-562b70d1]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-562b70d1],.pending-files[data-v-562b70d1]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-562b70d1]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden}.pending-file-name[data-v-562b70d1]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-562b70d1]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-562b70d1]:hover{color:var(--error)}.pending-thumb[data-v-562b70d1]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-562b70d1]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-562b70d1]{position:absolute;top:2px;right:2px;width:22px;height:22px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.pending-thumb.uploading[data-v-562b70d1]{display:flex;align-items:center;justify-content:center;background:var(--md-surface-container-high);animation:thumb-shimmer-562b70d1 1.2s infinite}.upload-spinner[data-v-562b70d1]{width:18px;height:18px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:upload-spin-562b70d1 .8s linear infinite}@keyframes upload-spin-562b70d1{to{transform:rotate(360deg)}}@keyframes thumb-shimmer-562b70d1{0%,to{opacity:1}50%{opacity:.55}}@media(prefers-reduced-motion:reduce){.pending-thumb.uploading[data-v-562b70d1]{animation:none}}.attach-btn[data-v-562b70d1]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-562b70d1]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-562b70d1]:disabled{opacity:.5;cursor:not-allowed}.wake-btn.active[data-v-562b70d1]{color:var(--md-primary);background:color-mix(in srgb,var(--md-primary) 14%,transparent)}.call-strip[data-v-562b70d1]{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:6px 10px;border-radius:999px;background:color-mix(in srgb,var(--md-success, #1a9e63) 14%,transparent);color:var(--md-on-surface);font-size:12px}.call-dot[data-v-562b70d1]{width:8px;height:8px;border-radius:50%;background:var(--md-success, #1a9e63);animation:call-pulse-562b70d1 1.4s ease-in-out infinite}.call-text[data-v-562b70d1]{flex:1;min-width:0;font-weight:600}.call-end[data-v-562b70d1]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:12px;font-weight:650;cursor:pointer;padding:2px 6px;border-radius:8px}.call-end[data-v-562b70d1]:hover{background:var(--md-surface-container-high);color:var(--md-on-surface)}@keyframes call-pulse-562b70d1{0%,to{opacity:1}50%{opacity:.35}}@media(prefers-reduced-motion:reduce){.call-dot[data-v-562b70d1]{animation:none}}.wake-strip[data-v-562b70d1]{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:5px 10px;border-radius:var(--radius-md, 10px);background:color-mix(in srgb,var(--md-primary) 10%,transparent);color:var(--md-primary);font-size:12px}.wake-strip.capturing[data-v-562b70d1]{background:color-mix(in srgb,var(--md-primary) 18%,transparent)}.wake-dot[data-v-562b70d1]{width:8px;height:8px;border-radius:50%;background:currentColor;animation:wake-pulse-562b70d1 1.1s ease-in-out infinite}.wake-strip.capturing .wake-dot[data-v-562b70d1]{animation-duration:.5s}.wake-text[data-v-562b70d1]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wake-stop[data-v-562b70d1]{border:none;background:transparent;color:inherit;cursor:pointer;font-size:15px;line-height:1;padding:0 2px;opacity:.75}.wake-stop[data-v-562b70d1]:hover{opacity:1}@keyframes wake-pulse-562b70d1{0%,to{opacity:1}50%{opacity:.2}}@media(prefers-reduced-motion:reduce){.wake-dot[data-v-562b70d1]{animation:none}}.send-button[data-v-562b70d1]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-562b70d1]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-562b70d1]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-562b70d1]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-562b70d1]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-562b70d1]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-562b70d1]{background:var(--success)}.disconnected .status-dot[data-v-562b70d1]{background:var(--error)}.hint[data-v-562b70d1]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-45331204]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-45331204]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-45331204]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-45331204]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-45331204]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-45331204]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-45331204]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-45331204]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-45331204]{margin-bottom:var(--space-xl)}.section-header[data-v-45331204]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-45331204]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.mood-display[data-v-45331204]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-45331204]{margin-bottom:var(--space-md)}.mood-label[data-v-45331204]{font-size:var(--font-size-md);font-weight:600}.emotion-bars[data-v-45331204]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-45331204]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-45331204]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-45331204]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-45331204]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-45331204]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage[data-v-15b509be]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-15b509be]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-15b509be]:active{cursor:grabbing}.stage-canvas[data-v-15b509be]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-15b509be]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-15b509be]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-15b509be]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-15b509be]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-15b509be]:active{transform:scale(.96)}.stage-reset.dragging[data-v-15b509be]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-15b509be]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-15b509be]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-15b509be]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.chat-page[data-v-599f785f]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-599f785f]{grid-template-columns:1fr}.stage-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-599f785f]{flex:1;min-height:240px}.status-panel[data-v-599f785f]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-599f785f]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-599f785f]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-599f785f]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-599f785f]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-599f785f]:hover,.page-resizer[data-v-599f785f]:active{background:var(--md-primary)}.chat-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-599f785f]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-599f785f]{display:flex;flex-direction:column}.stage-column[data-v-599f785f]{flex:1;min-height:0}.page-resizer[data-v-599f785f]{display:none}.chat-column[data-v-599f785f]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);visibility:hidden;transition:transform var(--transition-normal),visibility 0s linear var(--duration-medium)}.chat-column.open[data-v-599f785f]{transform:translate(0);visibility:visible;transition:transform var(--transition-normal),visibility 0s linear 0s}}\n";document.head.appendChild(s)}})();
