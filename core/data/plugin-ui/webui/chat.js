import { ref as L, defineComponent as Ke, computed as N, openBlock as u, createElementBlock as d, normalizeClass as ne, createElementVNode as a, Fragment as Y, renderList as he, createCommentVNode as B, toDisplayString as w, createBlock as Ve, unref as s, createTextVNode as Xe, normalizeStyle as Me, watch as ge, nextTick as nt, onMounted as st, onUnmounted as rt, createStaticVNode as Xt, withDirectives as ln, vModelText as cn, withModifiers as ze, watchEffect as un } from "vue";
import { useI18n as Ye } from "vue-i18n";
import { MarkdownContent as dn, useChatStore as Ht, useWizardStore as pt, useSettingsSectionsStore as fn, useConfirm as hn, useLifeStore as Kt, useUIPatchesStore as Yt, live2dRuntimeReady as vn } from "@0kay/host";
const it = L([]);
let mn = 0;
const gt = /* @__PURE__ */ new Map();
function gn(i) {
  const e = gt.get(i);
  e && clearTimeout(e), gt.delete(i), it.value = it.value.filter((l) => l.id !== i);
}
function et(i, e = "info", l) {
  const o = {
    id: ++mn,
    kind: e,
    message: i,
    duration: e === "error" ? 6500 : 3500
  };
  return it.value = [...it.value.slice(-4), o], gt.set(o.id, setTimeout(() => gn(o.id), o.duration)), o.id;
}
const X = L("off"), fe = L(""), De = L(""), tt = 2600, pn = 9e3, yn = 850, wn = 0.012, kn = 0.02;
let H = null, Se = null, Ue = null, ae = !0, yt = !1, at = null, Pe = "wake", me = "";
const jt = (i) => new Promise((e) => setTimeout(e, i));
function Bt(i) {
  return i.toLowerCase().replace(/[\s\u3000]+/g, "").replace(/[，。！？、,.!?~～…:：;；"'“”‘’()（）[\]【】<>《》\-—_/\\]+/g, "");
}
function Wt(i, e) {
  const l = Bt(i);
  return l ? e.some((o) => {
    const c = Bt(o);
    return c.length > 0 && l.includes(c);
  }) : !1;
}
function bn() {
  const i = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  if (typeof MediaRecorder > "u") return "";
  for (const e of i)
    if (MediaRecorder.isTypeSupported?.(e)) return e;
  return "";
}
async function xn() {
  try {
    const i = await fetch("/api/asr", { signal: AbortSignal.timeout(5e3) });
    return i.ok ? !!(await i.json()).configured : !1;
  } catch {
    return !1;
  }
}
async function wt(i) {
  const e = new FormData(), l = i.type || "audio/webm", o = l.includes("mp4") ? "m4a" : l.includes("ogg") ? "ogg" : l.includes("wav") ? "wav" : "webm";
  e.append("audio", i, `chunk.${o}`), H?.language && e.append("language", H.language);
  const c = await fetch("/api/asr", { method: "POST", body: e });
  if (c.status === 503) return { text: "", configured: !1 };
  if (!c.ok) throw new Error(await c.text());
  const x = await c.json();
  return { text: String(x.text || ""), configured: !0 };
}
function _n(i) {
  const e = window.AudioContext || window.webkitAudioContext;
  Ue = new e();
  const l = Ue.createMediaStreamSource(i), o = Ue.createAnalyser();
  o.fftSize = 1024, l.connect(o);
  const c = new Float32Array(o.fftSize);
  return {
    read() {
      o.getFloatTimeDomainData(c);
      let x = 0;
      for (let $ = 0; $ < c.length; $++) x += c[$] * c[$];
      return Math.sqrt(x / c.length);
    },
    close() {
      try {
        l.disconnect();
      } catch {
      }
      try {
        Ue?.close();
      } catch {
      }
      Ue = null;
    }
  };
}
function Te(i, e = !1) {
  let l = () => {
  };
  return { blob: new Promise((c) => {
    if (!Se || typeof MediaRecorder > "u") {
      c(null);
      return;
    }
    const x = bn();
    let $;
    try {
      $ = new MediaRecorder(Se, x ? { mimeType: x } : void 0);
    } catch {
      c(null);
      return;
    }
    const b = [], C = e ? _n(Se) : null;
    let E = 0, I = 0, O = !1;
    const R = () => {
      if (!O) {
        O = !0, C && C.close(), clearTimeout(j), clearInterval(F);
        try {
          $.state !== "inactive" && $.stop();
        } catch {
        }
      }
    };
    l = R;
    const j = setTimeout(R, i), F = setInterval(() => {
      if (!C) return;
      const k = C.read(), p = Date.now();
      if (k >= kn) {
        E = p, I = 0;
        return;
      }
      if (!(!E || p - E < 500)) {
        if (k > wn) {
          I = 0;
          return;
        }
        I ? p - I >= yn && R() : I = p;
      }
    }, 80);
    $.ondataavailable = (k) => {
      k.data && k.data.size && b.push(k.data);
    }, $.onstop = () => {
      C && C.close(), c(b.length ? new Blob(b, { type: $.mimeType || x || "audio/webm" }) : null);
    };
    try {
      $.start();
    } catch {
      R(), c(null);
    }
  }), cancel: () => l() };
}
function Cn() {
  try {
    const i = window.AudioContext || window.webkitAudioContext, e = new i(), l = e.currentTime;
    for (const [o, c] of [660, 880].entries()) {
      const x = e.createOscillator(), $ = e.createGain();
      x.type = "sine", x.frequency.value = c, $.gain.setValueAtTime(1e-4, l + o * 0.09), $.gain.exponentialRampToValueAtTime(0.06, l + o * 0.09 + 0.02), $.gain.exponentialRampToValueAtTime(1e-4, l + o * 0.09 + 0.13), x.connect($).connect(e.destination), x.start(l + o * 0.09), x.stop(l + o * 0.09 + 0.15);
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
async function Mn(i) {
  if (!H || ae) return;
  X.value = "woken", Cn(), H.onWake(i), X.value = "capturing";
  const e = await Te(pn, !0).blob;
  if (!ae) {
    if (e && e.size > 2e3)
      try {
        const o = (await wt(e)).text.trim();
        o && (De.value = o, H?.onUtterance(o));
      } catch {
      }
    !ae && fe.value === "core" && (X.value = "listening");
  }
}
async function Sn() {
  let i = Te(tt);
  try {
    for (; !ae && fe.value === "core"; ) {
      if (yt) {
        i?.cancel(), i = null, await jt(250);
        continue;
      }
      i || (i = Te(tt));
      const e = await i.blob;
      if (ae || fe.value !== "core") return;
      if (i = Te(tt), !e || e.size < 1200) continue;
      let l;
      try {
        l = await wt(e);
      } catch {
        continue;
      }
      if (!l.configured) {
        fe.value = "", Jt();
        return;
      }
      const o = l.text.trim();
      o && (De.value = o, H?.onHeard?.(o), H && Wt(o, H.nicknames) && (i?.cancel(), i = null, await Mn(o), !ae && fe.value === "core" && (i = Te(tt))));
    }
  } finally {
    i?.cancel();
  }
}
function qt() {
  const i = window;
  return i.SpeechRecognition || i.webkitSpeechRecognition || null;
}
function Jt() {
  const i = qt();
  if (!i) {
    _e("no-engine");
    return;
  }
  fe.value !== "browser" && (fe.value = "browser"), Pe = "wake", me = "";
  const e = new i();
  at = e, e.lang = H?.language || "zh-CN", e.continuous = !0, e.interimResults = !0, e.onresult = (l) => {
    let o = "";
    for (let c = l.resultIndex; c < l.results.length; c++)
      l.results[c].isFinal && (o += l.results[c][0].transcript);
    if (o = o.trim(), !!o) {
      if (De.value = o, H?.onHeard?.(o), Pe === "wake") {
        H && Wt(o, H.nicknames) && (X.value = "woken", H.onWake(o), Pe = "capture", me = "", X.value = "capturing");
        return;
      }
      me = `${me}${o}`.trim();
    }
  }, e.onend = () => {
    if (!ae) {
      Pe === "capture" && me && (H?.onUtterance(me), me = "", Pe = "wake", X.value = "listening");
      try {
        e.start();
      } catch {
      }
    }
  }, e.onerror = (l) => {
    if (l?.error === "not-allowed" || l?.error === "service-not-allowed") {
      _e("mic-denied");
      return;
    }
    l?.error === "no-speech" || l?.error === "aborted" || _e("error", String(l?.error || "speech recognition failed"));
  };
  try {
    e.start(), X.value = "listening";
  } catch (l) {
    _e("error", l?.message || "speech recognition failed");
  }
}
function _e(i, e) {
  Ce(), X.value = "error", H?.onError?.(i, e);
}
async function $n(i) {
  if (Ce(), H = i, ae = !1, yt = !1, De.value = "", !i.nicknames.length) {
    _e("no-nickname");
    return;
  }
  if (await xn()) {
    if (ae) return;
    fe.value = "core";
    try {
      Se = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !0, noiseSuppression: !0 } });
    } catch (e) {
      const l = e?.name === "NotAllowedError" || e?.name === "SecurityError";
      _e(l ? "mic-denied" : "error", e?.message);
      return;
    }
    if (ae) {
      lt();
      return;
    }
    X.value = "listening", Sn();
    return;
  }
  if (qt()) {
    Jt();
    return;
  }
  _e("no-engine");
}
function lt() {
  try {
    Se?.getTracks().forEach((i) => i.stop());
  } catch {
  }
  Se = null;
}
function Ce() {
  if (ae = !0, lt(), at) {
    const i = at;
    at = null, i.onend = null, i.onresult = null, i.onerror = null;
    try {
      i.stop();
    } catch {
    }
  }
  Pe = "wake", me = "", fe.value = "", X.value !== "error" && (X.value = "off");
}
function Rt(i) {
  yt = i;
}
const ve = L("off"), In = 2e4, En = 9e4;
let pe = null, He = !1, ot = 0;
function Ln(i) {
  He = i;
}
async function Pn(i) {
  Ce(), Ae("hangup"), pe = i, He = !1, ve.value = "dialing";
  try {
    Se = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !0, noiseSuppression: !0 } });
  } catch {
    ve.value = "off", i.onEnd?.("error");
    return;
  }
  if (!pe) {
    lt();
    return;
  }
  ot = Date.now(), ve.value = "live", Tn();
}
function Ae(i = "hangup") {
  const e = ve.value !== "off", l = pe;
  pe = null, He = !1, ve.value = "off", e && (lt(), l?.onEnd?.(i));
}
async function Tn() {
  for (; pe && ve.value === "live"; ) {
    if (He) {
      await jt(200);
      continue;
    }
    if (Date.now() - ot > En) {
      Ae("silence");
      return;
    }
    const i = Te(In, !0), e = await i.blob;
    if (!pe || ve.value !== "live") {
      i.cancel();
      return;
    }
    if (He || !e || e.size < 1200) continue;
    ot = Date.now();
    let l = "";
    try {
      const o = await wt(e);
      if (!o.configured) {
        Ae("error");
        return;
      }
      l = o.text.trim();
    } catch {
      continue;
    }
    !l || !pe || ve.value !== "live" || (ot = Date.now(), pe.onUtterance(l));
  }
}
function Ot(i) {
  return i.irritation > 0.7 ? "irritated" : i.valence > 0.5 ? "happy" : i.valence < -0.3 ? "sad" : "neutral";
}
const An = {
  happy: "#107c10",
  sad: "#0078d4",
  irritated: "#d13438",
  neutral: "#8a8886"
};
function Dn(i) {
  return An[i];
}
const Bn = {
  key: 0,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, Rn = {
  key: 1,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, On = { class: "content-wrapper" }, Fn = {
  key: 0,
  class: "images"
}, Nn = ["src"], zn = {
  key: 1,
  class: "files"
}, Un = ["href", "title"], Vn = { class: "msg-file-name" }, Xn = {
  key: 3,
  class: "media-row"
}, Hn = { class: "media-chip" }, Kn = {
  key: 4,
  class: "selfie"
}, Yn = ["src", "alt"], jn = {
  key: 1,
  class: "selfie-pending"
}, Wn = {
  key: 5,
  class: "think-panel"
}, qn = ["aria-expanded"], Jn = { class: "think-body" }, Gn = {
  key: 0,
  class: "think-raw"
}, Zn = {
  key: 1,
  class: "think-summary"
}, Qn = { class: "meta" }, ea = { class: "time" }, ta = /* @__PURE__ */ Ke({
  __name: "MessageBubble",
  props: {
    message: {},
    streaming: { type: Boolean }
  },
  setup(i) {
    const e = i, { t: l, locale: o } = Ye(), c = N(() => e.message.role === "user"), x = L(!1), $ = N(() => {
      if (!e.message.thinkSummary) return null;
      try {
        const C = JSON.parse(e.message.thinkSummary);
        if (typeof C.raw == "string" && C.raw.trim()) return { raw: C.raw };
        if (typeof C.summary == "string" && C.summary.trim()) return C;
        const E = C.intent || l("messageBubble.intentDefault"), I = C.strategy || l("messageBubble.strategyDefault");
        return { summary: l("messageBubble.summary", { intent: E, strategy: I }) };
      } catch {
        return { summary: e.message.thinkSummary };
      }
    }), b = N(() => {
      const C = e.message.timestamp, E = C.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
      return new Intl.DateTimeFormat(o.value, {
        ...E ? {} : { year: "numeric" },
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }).format(C);
    });
    return (C, E) => (u(), d("div", {
      class: ne(["message", { user: c.value, assistant: !c.value }])
    }, [
      a("div", {
        class: ne(["avatar", { "user-avatar": c.value, "assistant-avatar": !c.value }])
      }, [
        c.value ? (u(), d("svg", Bn, [...E[1] || (E[1] = [
          a("circle", {
            cx: "8",
            cy: "6",
            r: "3",
            stroke: "currentColor",
            "stroke-width": "1.5"
          }, null, -1),
          a("path", {
            d: "M3 14C3 11.5 5.5 10 8 10C10.5 10 13 11.5 13 14",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }, null, -1)
        ])])) : (u(), d("svg", Rn, [...E[2] || (E[2] = [
          a("circle", {
            cx: "8",
            cy: "8",
            r: "6",
            stroke: "currentColor",
            "stroke-width": "1.5"
          }, null, -1),
          a("circle", {
            cx: "6",
            cy: "7",
            r: "1",
            fill: "currentColor"
          }, null, -1),
          a("circle", {
            cx: "10",
            cy: "7",
            r: "1",
            fill: "currentColor"
          }, null, -1),
          a("path", {
            d: "M6 10C6.5 10.5 7.2 11 8 11C8.8 11 9.5 10.5 10 10",
            stroke: "currentColor",
            "stroke-width": "1",
            "stroke-linecap": "round"
          }, null, -1)
        ])]))
      ], 2),
      a("div", On, [
        i.message.images?.length ? (u(), d("div", Fn, [
          (u(!0), d(Y, null, he(i.message.images, (I, O) => (u(), d("img", {
            key: O,
            src: I,
            alt: "",
            class: "msg-img"
          }, null, 8, Nn))), 128))
        ])) : B("", !0),
        i.message.files?.length ? (u(), d("div", zn, [
          (u(!0), d(Y, null, he(i.message.files, (I, O) => (u(), d("a", {
            key: O,
            href: I.url,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "msg-file",
            title: I.mime || ""
          }, [
            a("span", Vn, w(I.name), 1)
          ], 8, Un))), 128))
        ])) : B("", !0),
        i.message.content ? (u(), d("div", {
          key: 2,
          class: ne(["content", { "content-markdown": !c.value && !i.streaming }])
        }, [
          !c.value && !i.streaming ? (u(), Ve(s(dn), {
            key: 0,
            content: i.message.content
          }, null, 8, ["content"])) : (u(), d(Y, { key: 1 }, [
            Xe(w(i.message.content), 1)
          ], 64))
        ], 2)) : B("", !0),
        !c.value && (i.message.media?.voice || i.message.media?.call) ? (u(), d("div", Xn, [
          a("span", Hn, [
            E[3] || (E[3] = a("svg", {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              "aria-hidden": "true"
            }, [
              a("path", {
                d: "M12 3v18M8 7v10M16 7v10M4 10v4M20 10v4",
                stroke: "currentColor",
                "stroke-width": "1.8",
                "stroke-linecap": "round"
              })
            ], -1)),
            Xe(" " + w(i.message.media?.call ? s(l)("chat.mediaCall") : s(l)("chat.mediaVoice")), 1)
          ])
        ])) : B("", !0),
        !c.value && i.message.media?.selfie ? (u(), d("div", Kn, [
          i.message.selfieUrl ? (u(), d("img", {
            key: 0,
            src: i.message.selfieUrl,
            alt: i.message.media.selfie,
            class: "selfie-img"
          }, null, 8, Yn)) : (u(), d("div", jn, [
            E[4] || (E[4] = a("span", {
              class: "selfie-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            Xe(" " + w(s(l)("chat.mediaSelfieDrawing")), 1)
          ]))
        ])) : B("", !0),
        !c.value && $.value ? (u(), d("div", Wn, [
          a("button", {
            class: "think-toggle",
            type: "button",
            "aria-expanded": x.value,
            onClick: E[0] || (E[0] = (I) => x.value = !x.value)
          }, [
            a("span", null, w(s(l)("chat.thinkLabel")), 1),
            a("span", null, w(x.value ? s(l)("chat.thinkCollapse") : s(l)("chat.thinkExpand")), 1)
          ], 8, qn),
          a("div", {
            class: ne(["collapse-grid", { open: x.value }])
          }, [
            a("div", null, [
              a("div", Jn, [
                $.value.raw ? (u(), d("pre", Gn, w($.value.raw), 1)) : $.value.summary ? (u(), d("p", Zn, w($.value.summary), 1)) : B("", !0)
              ])
            ])
          ], 2)
        ])) : B("", !0),
        a("div", Qn, [
          a("span", ea, w(b.value), 1),
          !c.value && i.message.emotion ? (u(), d(Y, { key: 0 }, [
            E[5] || (E[5] = a("span", { class: "separator" }, "·", -1)),
            a("span", {
              class: "emotion",
              style: Me({ color: s(Dn)(s(Ot)(i.message.emotion)) })
            }, w(s(l)(`emotion.${s(Ot)(i.message.emotion)}`)), 5)
          ], 64)) : B("", !0)
        ])
      ])
    ], 2));
  }
}), je = (i, e) => {
  const l = i.__vccOpts || i;
  for (const [o, c] of e)
    l[o] = c;
  return l;
}, na = /* @__PURE__ */ je(ta, [["__scopeId", "data-v-ffd3f9f0"]]), aa = { class: "chat-panel" }, oa = {
  class: "messages",
  role: "log",
  "aria-live": "polite",
  "aria-relevant": "additions text"
}, ia = {
  key: 0,
  class: "empty-state"
}, sa = {
  key: 1,
  class: "typing-indicator"
}, ra = { class: "typing-text" }, la = { class: "input-area" }, ca = {
  key: 0,
  class: "pending-images"
}, ua = ["src"], da = ["aria-label", "title", "onClick"], fa = {
  key: 0,
  class: "pending-thumb uploading",
  "aria-hidden": "true"
}, ha = {
  key: 1,
  class: "pending-files"
}, va = ["title"], ma = { class: "pending-file-name" }, ga = ["title", "aria-label", "onClick"], pa = {
  key: 2,
  class: "call-strip"
}, ya = { class: "call-text" }, wa = { class: "wake-text" }, ka = ["title"], ba = { class: "input-wrapper" }, xa = ["title", "disabled"], _a = ["title", "disabled"], Ca = ["title", "aria-pressed", "disabled"], Ma = ["placeholder", "disabled"], Sa = ["aria-label", "title", "disabled"], $a = { class: "input-footer" }, Ia = {
  key: 0,
  class: "connection-status disconnected"
}, Ea = {
  key: 1,
  class: "connection-status connected"
}, La = { class: "hint" }, Pa = ["title", "aria-label", "aria-pressed"], Ta = ["title", "aria-label"], Aa = ["disabled", "title", "aria-label"], Da = ["title", "aria-label"], Ba = 80, Ra = /* @__PURE__ */ Ke({
  __name: "ChatPanel",
  setup(i) {
    const { t: e, locale: l } = Ye(), o = Ht(), c = pt(), x = fn(), { confirm: $ } = hn(), b = L(""), C = L(null), E = L(null), I = L([]), O = L(null), R = L([]), j = L(null), F = L(!1), k = L([]), p = L(!1), T = N(() => X.value === "listening" || X.value === "woken" || X.value === "capturing"), z = N(() => T.value ? e("chat.wakeOnTitle") : e("chat.wakeOffTitle")), W = N(() => X.value === "capturing" ? De.value ? e("chat.wakeHeardLine", { text: De.value }) : e("chat.wakeCapturing") : X.value === "woken" ? e("chat.wakeWoken") : e("chat.wakeListening", { name: k.value[0] || "" }));
    function Z(f) {
      const v = x.values.life?.[f];
      return v == null ? "" : String(v);
    }
    function S() {
      return Z("wake_nickname").split(/[,，、;；\s]+/).map((f) => f.trim()).filter(Boolean);
    }
    function V(f, h) {
      const v = f === "no-nickname" ? e("chat.wakeNeedNickname") : f === "no-engine" ? e("chat.wakeNoEngine") : f === "mic-denied" ? e("chat.wakeMicDenied") : e("chat.wakeFailed", { detail: h || "unknown" });
      et(v, "error");
    }
    function _(f) {
      const h = f.trim();
      if (h) {
        if (o.isTyping) {
          b.value = h, nt(We);
          return;
        }
        b.value = h, y();
      }
    }
    async function le() {
      if (!p.value) {
        p.value = !0;
        try {
          await x.loadValues("life");
          const f = S();
          if (k.value = f, !f.length) {
            V("no-nickname");
            return;
          }
          await $n({
            nicknames: f,
            language: Z("asr_language") || "zh",
            onWake: () => {
              E.value?.focus();
            },
            onUtterance: _,
            onError: V
          });
        } finally {
          p.value = !1;
        }
      }
    }
    function $e() {
      if (T.value) {
        Ce();
        return;
      }
      le();
    }
    function We() {
      const f = E.value;
      f && (f.style.height = "auto", f.style.height = `${Math.min(f.scrollHeight, 120)}px`);
    }
    ge(b, () => nt(We));
    const Be = L(!0);
    let Ie = !1;
    function ct() {
      const f = C.value;
      f && (Be.value = f.scrollHeight - f.scrollTop - f.clientHeight <= Ba);
    }
    function y() {
      if (o.isTyping) return;
      const f = b.value.trim();
      if (!f && I.value.length === 0 && R.value.length === 0) return;
      const h = [...I.value], v = R.value.map((M) => ({ ...M }));
      I.value = [], R.value = [], Ie = !0, o.sendMessage(f, h, v), b.value = "";
    }
    function g(f) {
      if (f.key === "Enter" && !f.shiftKey) {
        if (f.isComposing || f.keyCode === 229) return;
        f.preventDefault(), y();
      }
    }
    function ye() {
      O.value?.click();
    }
    async function Ee(f) {
      const h = f.target, v = Array.from(h.files || []);
      if (h.value = "", !!v.length) {
        F.value = !0;
        try {
          for (const M of v) {
            const Q = await o.uploadImage(M);
            I.value.push(Q);
          }
        } catch (M) {
          console.error("image upload failed:", M);
          const Q = v.length === 1 ? v[0].name : "";
          et(Q ? e("chat.uploadFailedNamed", { name: Q }) : e("chat.uploadFailed"), "error");
        } finally {
          F.value = !1;
        }
      }
    }
    function U(f) {
      I.value = I.value.filter((h) => h !== f);
    }
    function Le() {
      j.value?.click();
    }
    async function we(f) {
      const h = f.target, v = Array.from(h.files || []);
      if (h.value = "", !!v.length) {
        F.value = !0;
        try {
          for (const M of v)
            R.value.push(await o.uploadFile(M));
        } catch (M) {
          console.error("file upload failed:", M);
          const Q = v.length === 1 ? v[0].name : "";
          et(Q ? e("chat.uploadFailedNamed", { name: Q }) : e("chat.uploadFailed"), "error");
        } finally {
          F.value = !1;
        }
      }
    }
    function oe(f) {
      R.value = R.value.filter((h) => h.url !== f);
    }
    async function Re(f) {
      const h = Array.from(f.clipboardData?.files || []);
      if (h.length) {
        f.preventDefault(), F.value = !0;
        try {
          for (const v of h)
            v.type.startsWith("image/") ? I.value.push(await o.uploadImage(v)) : R.value.push(await o.uploadFile(v));
        } catch (v) {
          console.error("paste upload failed:", v), et(e("chat.uploadFailed"), "error");
        } finally {
          F.value = !1;
        }
      }
    }
    async function ie() {
      await $({
        title: e("chat.clear"),
        message: e("chat.clearConfirm"),
        confirmLabel: e("chat.clear"),
        danger: !0
      }) && o.clearMessages();
    }
    function ce() {
      const f = o.messages;
      if (!f.length) return;
      const h = c.persona.name || e("chat.defaultCharacter"), v = new Intl.DateTimeFormat(l.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }), M = [];
      M.push(`# ${e("chat.exportTitle")}`, ""), M.push(`- ${e("chat.defaultCharacter")}: ${h}`), M.push(`- ${v.format(/* @__PURE__ */ new Date())}`, "");
      for (const K of f) {
        if (!K.content && !K.images?.length && !K.files?.length) continue;
        const ut = K.role === "user" ? e("chat.you") : h;
        if (M.push(`## ${ut} · ${v.format(K.timestamp)}`), K.content && M.push("", K.content), K.images?.length) {
          M.push("");
          for (const be of K.images) M.push(`![image](${be})`);
        }
        if (K.files?.length) {
          M.push("");
          for (const be of K.files) M.push(`- [${be.name}](${be.url})`);
        }
        M.push("");
      }
      const Q = new Blob([M.join(`
`)], { type: "text/markdown;charset=utf-8" }), Oe = URL.createObjectURL(Q), se = /* @__PURE__ */ new Date(), ke = (K) => String(K).padStart(2, "0"), J = document.createElement("a");
      J.href = Oe, J.download = `0kay-chat-${se.getFullYear()}${ke(se.getMonth() + 1)}${ke(se.getDate())}-${ke(se.getHours())}${ke(se.getMinutes())}.md`, document.body.appendChild(J), J.click(), J.remove(), URL.revokeObjectURL(Oe);
    }
    st(() => {
      o.restoreHistory(), o.isConnected || o.connect(), (async () => (await x.loadValues("life"), Z("wake_enabled") === "true" && S().length && le()))();
    });
    let q = null;
    return ge(() => o.callMode, (f) => {
      if (!f) {
        Ae("hangup");
        return;
      }
      q = o.voiceEnabled, o.setVoiceEnabled(!0), Pn({
        language: Z("asr_language") || "zh",
        onUtterance: (h) => {
          o.sendMessage(h);
        },
        onEnd: () => {
          q !== null && o.setVoiceEnabled(q), q = null, o.endCall();
        }
      });
    }), ge(() => o.isTyping, (f) => Ln(f || !o.voiceEnabled), { immediate: !0 }), rt(() => {
      Ce(), Rt(!1), Ae("hangup");
    }), ge(() => o.isTyping, (f) => Rt(f), { immediate: !0 }), ge(
      () => o.messages.length,
      async () => {
        await nt();
        const f = C.value;
        f && ((Be.value || Ie) && (f.scrollTop = f.scrollHeight, Be.value = !0), Ie = !1);
      }
    ), (f, h) => (u(), d("div", aa, [
      a("div", {
        class: "chat-container",
        ref_key: "chatContainer",
        ref: C,
        onScroll: ct
      }, [
        a("div", oa, [
          s(o).messages.length === 0 ? (u(), d("div", ia, [
            h[5] || (h[5] = Xt('<div class="empty-icon" data-v-376fda94><svg width="64" height="64" viewBox="0 0 64 64" fill="none" data-v-376fda94><circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" data-v-376fda94></circle><circle cx="32" cy="28" r="8" stroke="currentColor" stroke-width="2" data-v-376fda94></circle><path d="M20 44C20 38 26 34 32 34C38 34 44 38 44 44" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-376fda94></path></svg></div>', 1)),
            a("h3", null, w(s(e)("chat.empty")), 1),
            a("p", null, w(s(e)("chat.emptyHint", { name: s(c).persona.name || s(e)("chat.defaultCharacter") })), 1)
          ])) : B("", !0),
          (u(!0), d(Y, null, he(s(o).messages, (v, M) => (u(), Ve(na, {
            key: v.id,
            message: v,
            streaming: s(o).isTyping && M === s(o).messages.length - 1
          }, null, 8, ["message", "streaming"]))), 128)),
          s(o).isTyping ? (u(), d("div", sa, [
            h[6] || (h[6] = a("div", { class: "typing-dots" }, [
              a("span"),
              a("span"),
              a("span")
            ], -1)),
            a("span", ra, w(s(c).persona.name || "AI") + " " + w(s(e)("chat.thinking")), 1)
          ])) : B("", !0)
        ])
      ], 544),
      a("div", la, [
        I.value.length || F.value ? (u(), d("div", ca, [
          (u(!0), d(Y, null, he(I.value, (v) => (u(), d("div", {
            key: v,
            class: "pending-thumb"
          }, [
            a("img", {
              src: v,
              alt: ""
            }, null, 8, ua),
            a("button", {
              class: "remove-img",
              type: "button",
              "aria-label": s(e)("chat.removeImage"),
              title: s(e)("chat.removeImage"),
              onClick: (M) => U(v)
            }, " × ", 8, da)
          ]))), 128)),
          F.value ? (u(), d("div", fa, [...h[7] || (h[7] = [
            a("span", { class: "upload-spinner" }, null, -1)
          ])])) : B("", !0)
        ])) : B("", !0),
        R.value.length ? (u(), d("div", ha, [
          (u(!0), d(Y, null, he(R.value, (v) => (u(), d("span", {
            key: v.url,
            class: "pending-file",
            title: `${v.mime || ""} · ${v.size || 0} B`
          }, [
            a("span", ma, w(v.name), 1),
            a("button", {
              class: "remove-file",
              type: "button",
              title: s(e)("chat.removeFile"),
              "aria-label": s(e)("chat.removeFile"),
              onClick: (M) => oe(v.url)
            }, " × ", 8, ga)
          ], 8, va))), 128))
        ])) : B("", !0),
        s(o).callMode ? (u(), d("div", pa, [
          h[8] || (h[8] = a("span", {
            class: "call-dot",
            "aria-hidden": "true"
          }, null, -1)),
          a("span", ya, w(s(ve) === "dialing" ? s(e)("chat.callDialing") : s(e)("chat.callBanner")), 1),
          a("button", {
            class: "call-end",
            type: "button",
            onClick: h[0] || (h[0] = (v) => s(Ae)("hangup"))
          }, w(s(e)("chat.callEnd")), 1)
        ])) : B("", !0),
        T.value ? (u(), d("div", {
          key: 3,
          class: ne(["wake-strip", s(X)])
        }, [
          h[9] || (h[9] = a("span", {
            class: "wake-dot",
            "aria-hidden": "true"
          }, null, -1)),
          a("span", wa, w(W.value), 1),
          a("button", {
            class: "wake-stop",
            type: "button",
            title: s(e)("chat.wakeOnTitle"),
            onClick: h[1] || (h[1] = //@ts-ignore
            (...v) => s(Ce) && s(Ce)(...v))
          }, "×", 8, ka)
        ], 2)) : B("", !0),
        a("div", ba, [
          a("input", {
            ref_key: "imageInput",
            ref: O,
            type: "file",
            accept: "image/png,image/jpeg,image/gif,image/webp",
            multiple: "",
            hidden: "",
            onChange: Ee
          }, null, 544),
          a("input", {
            ref_key: "fileInput",
            ref: j,
            type: "file",
            multiple: "",
            hidden: "",
            onChange: we
          }, null, 544),
          a("button", {
            class: "attach-btn",
            type: "button",
            title: s(e)("chat.attachImage"),
            disabled: F.value || !s(o).isConnected,
            onClick: ye
          }, [...h[10] || (h[10] = [
            a("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              a("rect", {
                x: "3",
                y: "5",
                width: "18",
                height: "14",
                rx: "2",
                stroke: "currentColor",
                "stroke-width": "2"
              }),
              a("circle", {
                cx: "9",
                cy: "10",
                r: "1.5",
                fill: "currentColor"
              }),
              a("path", {
                d: "M4 17l5-5 4 4 3-3 4 4",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, xa),
          a("button", {
            class: "attach-btn",
            type: "button",
            title: s(e)("chat.attachFile"),
            disabled: F.value || !s(o).isConnected,
            onClick: Le
          }, [...h[11] || (h[11] = [
            a("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              a("path", {
                d: "M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, _a),
          a("button", {
            class: ne(["attach-btn wake-btn", { active: T.value }]),
            type: "button",
            title: z.value,
            "aria-pressed": T.value,
            disabled: p.value,
            onClick: $e
          }, [...h[12] || (h[12] = [
            a("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none",
              "aria-hidden": "true"
            }, [
              a("rect", {
                x: "9",
                y: "3",
                width: "6",
                height: "11",
                rx: "3",
                stroke: "currentColor",
                "stroke-width": "2"
              }),
              a("path", {
                d: "M5 11a7 7 0 0 0 14 0M12 18v3",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round"
              })
            ], -1)
          ])], 10, Ca),
          ln(a("textarea", {
            ref_key: "messageInput",
            ref: E,
            "onUpdate:modelValue": h[2] || (h[2] = (v) => b.value = v),
            class: "message-input",
            placeholder: s(e)("chat.inputPlaceholder"),
            rows: "1",
            onKeydown: g,
            onPaste: Re,
            disabled: !s(o).isConnected
          }, null, 40, Ma), [
            [cn, b.value]
          ]),
          a("button", {
            class: "send-button",
            "aria-label": s(e)("chat.send"),
            title: s(e)("chat.send"),
            onClick: y,
            disabled: !b.value.trim() && !I.value.length && !R.value.length || !s(o).isConnected || s(o).isTyping
          }, [...h[13] || (h[13] = [
            a("svg", {
              width: "20",
              height: "20",
              viewBox: "0 0 20 20",
              fill: "none"
            }, [
              a("path", {
                d: "M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, Sa)
        ]),
        a("div", $a, [
          s(o).isConnected ? (u(), d("span", Ea, [
            h[15] || (h[15] = a("span", { class: "status-dot" }, null, -1)),
            Xe(" " + w(s(e)("chat.connected")), 1)
          ])) : (u(), d("span", Ia, [
            h[14] || (h[14] = a("span", { class: "status-dot" }, null, -1)),
            Xe(" " + w(s(e)("chat.disconnected")), 1)
          ])),
          a("span", La, w(s(e)("chat.contextHint", { n: s(o).contextTokens.toLocaleString() })), 1),
          a("button", {
            class: ne(["context-btn", { active: s(o).voiceEnabled }]),
            type: "button",
            title: s(o).voiceEnabled ? s(e)("chat.voiceOnTitle") : s(e)("chat.voiceOffTitle"),
            "aria-label": s(o).voiceEnabled ? s(e)("chat.voiceOnTitle") : s(e)("chat.voiceOffTitle"),
            "aria-pressed": s(o).voiceEnabled,
            onClick: h[3] || (h[3] = (v) => s(o).setVoiceEnabled(!s(o).voiceEnabled))
          }, w(s(o).voiceEnabled ? s(e)("chat.voiceOn") : s(e)("chat.voiceOff")), 11, Pa),
          s(o).messages.length ? (u(), d(Y, { key: 2 }, [
            a("button", {
              class: "context-btn",
              type: "button",
              title: s(e)("chat.download"),
              "aria-label": s(e)("chat.download"),
              onClick: ce
            }, w(s(e)("chat.download")), 9, Ta),
            a("button", {
              class: "context-btn",
              type: "button",
              disabled: s(o).compacting,
              title: s(e)("chat.compact"),
              "aria-label": s(e)("chat.compact"),
              onClick: h[4] || (h[4] = //@ts-ignore
              (...v) => s(o).compactContext && s(o).compactContext(...v))
            }, w(s(o).compacting ? s(e)("chat.compacting") : s(e)("chat.compact")), 9, Aa)
          ], 64)) : B("", !0),
          a("button", {
            class: "context-btn danger",
            type: "button",
            title: s(e)("chat.clear"),
            "aria-label": s(e)("chat.clear"),
            onClick: ie
          }, w(s(e)("chat.clear")), 9, Da)
        ])
      ])
    ]));
  }
}), Oa = /* @__PURE__ */ je(Ra, [["__scopeId", "data-v-376fda94"]]), Ft = /* @__PURE__ */ new Set();
function Fa(i, e = console) {
  const l = String(i || "");
  return !l || Ft.has(l) ? !1 : (Ft.add(l), e.warn(
    `[0kay] chat slot "${l}" uses component: "iframe", which is deprecated: iframe slots run in a separate document and cannot share the host stores, i18n or theme. Publish the slot as an ES module (component: "module", module: "/api/plugins/<name>/ui/<page>.js") instead. Iframe slots keep working for now.`
  ), !0);
}
const Na = { class: "status-panel" }, za = { class: "panel-header" }, Ua = {
  key: 0,
  class: "patch-badge"
}, Va = { class: "panel-content" }, Xa = { class: "section character-profile" }, Ha = { class: "section-header" }, Ka = { class: "section-title" }, Ya = ["datetime"], ja = ["data-section", "data-kind"], Wa = { class: "section-header" }, qa = { class: "section-title" }, Ja = {
  key: 0,
  class: "mood-display"
}, Ga = {
  key: 0,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Za = {
  key: 1,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Qa = {
  key: 2,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, eo = {
  key: 3,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, to = {
  key: 4,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, no = {
  key: 1,
  class: "emotion-bars"
}, ao = { class: "emotion-label" }, oo = { class: "emotion-bar" }, io = {
  key: 0,
  class: "empty-tasks"
}, so = /* @__PURE__ */ Ke({
  __name: "StatusPanel",
  setup(i) {
    const { t: e } = Ye(), l = Kt(), o = Yt(), c = pt(), x = L(/* @__PURE__ */ new Date()), $ = N(() => {
      const k = c.persona.birthDate;
      if (!k) return null;
      const p = /* @__PURE__ */ new Date(`${k}T00:00:00`);
      if (Number.isNaN(p.getTime()) || p > x.value) return null;
      const T = x.value;
      return T.getFullYear() - p.getFullYear() - +(T.getMonth() < p.getMonth() || T.getMonth() === p.getMonth() && T.getDate() < p.getDate());
    });
    let b = null;
    function C(k) {
      if (!k || !k.startsWith("life.")) return;
      const p = k.slice(5).split(".").reduce((T, z) => T?.[z], l);
      return typeof p == "function" ? void 0 : p;
    }
    function E(k) {
      if (k.titleKey) {
        const p = e(k.titleKey);
        if (p && p !== k.titleKey) return p;
      }
      return k.title || k.id;
    }
    function I(k) {
      if (k.labelKey) {
        const p = e(k.labelKey);
        if (p && p !== k.labelKey) return p;
      }
      return k.label || k.key;
    }
    function O(k) {
      const p = Number(C(`life.emotion.${k.key}`) ?? 0);
      return k.scale === "remap01" ? (p + 1) / 2 : p;
    }
    st(() => {
      b = setInterval(() => {
        x.value = /* @__PURE__ */ new Date();
      }, 1e3);
    }), rt(() => {
      b && clearInterval(b);
    });
    const R = N(
      () => o.statusSections.filter((k) => k.kind === "mood" || k.kind === "bars" || k.kind === "bar")
    ), j = N(() => l.emotionColor), F = N(() => l.emotionMood);
    return (k, p) => (u(), d("div", Na, [
      a("div", za, [
        a("h2", null, w(s(e)("status.title")), 1),
        s(o).loaded ? (u(), d("span", Ua, "patch")) : B("", !0)
      ]),
      a("div", Va, [
        a("section", Xa, [
          a("div", Ha, [
            a("span", Ka, w(s(c).persona.name || s(e)("chat.defaultCharacter")), 1)
          ]),
          a("dl", null, [
            a("div", null, [
              a("dt", null, w(s(e)("status.age")), 1),
              a("dd", null, w($.value === null ? s(e)("status.birthdayUnset") : s(e)("status.ageValue", { age: $.value })), 1)
            ]),
            a("div", null, [
              a("dt", null, w(s(e)("status.time")), 1),
              a("dd", null, [
                a("time", {
                  datetime: x.value.toISOString()
                }, w(x.value.toLocaleString()), 9, Ya)
              ])
            ]),
            a("div", null, [
              a("dt", null, w(s(e)("status.timezone")), 1),
              a("dd", null, w(Intl.DateTimeFormat().resolvedOptions().timeZone), 1)
            ])
          ])
        ]),
        (u(!0), d(Y, null, he(R.value, (T) => (u(), d("div", {
          key: T.id,
          class: "section",
          "data-section": T.id,
          "data-kind": T.kind
        }, [
          a("div", Wa, [
            a("span", qa, w(E(T)), 1)
          ]),
          T.kind === "mood" ? (u(), d("div", Ja, [
            a("div", {
              class: "mood-icon",
              style: Me({ color: j.value })
            }, [
              F.value === "happy" ? (u(), d("svg", Ga, [...p[0] || (p[0] = [
                a("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                a("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                a("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                a("path", {
                  d: "M14 30C17 34 31 34 34 30",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : F.value === "sad" ? (u(), d("svg", Za, [...p[1] || (p[1] = [
                a("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                a("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                a("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                a("path", {
                  d: "M16 34C19 30 29 30 32 34",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : F.value === "irritated" ? (u(), d("svg", Qa, [...p[2] || (p[2] = [
                a("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                a("line", {
                  x1: "14",
                  y1: "18",
                  x2: "20",
                  y2: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                a("line", {
                  x1: "34",
                  y1: "18",
                  x2: "28",
                  y2: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                a("path", {
                  d: "M16 34C19 30 29 30 32 34",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : F.value === "sleeping" ? (u(), d("svg", eo, [...p[3] || (p[3] = [
                Xt('<circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" data-v-ff584ec1></circle><path d="M16 22C17 22 18 22 18 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-ff584ec1></path><path d="M30 22C31 22 32 22 32 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-ff584ec1></path><path d="M18 32C20 34 28 34 30 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-ff584ec1></path><text x="36" y="12" fill="currentColor" font-size="12" font-weight="bold" data-v-ff584ec1>Z</text>', 5)
              ])])) : (u(), d("svg", to, [...p[4] || (p[4] = [
                a("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                a("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                a("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                a("path", {
                  d: "M18 30H30",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])]))
            ], 4),
            a("div", {
              class: "mood-label",
              style: Me({ color: j.value })
            }, w(s(e)(`emotion.${F.value}`)), 5)
          ])) : T.kind === "bars" || T.kind === "bar" ? (u(), d("div", no, [
            (u(!0), d(Y, null, he(T.axes || [], (z) => (u(), d("div", {
              key: z.key,
              class: "emotion-row"
            }, [
              a("span", ao, w(I(z)), 1),
              a("div", oo, [
                a("div", {
                  class: "emotion-fill",
                  style: Me({
                    transform: `scaleX(${Math.max(0, Math.min(1, O(z)))})`,
                    backgroundColor: z.color || "#0078d4"
                  })
                }, null, 4)
              ])
            ]))), 128))
          ])) : B("", !0)
        ], 8, ja))), 128)),
        s(o).statusSections.length === 0 ? (u(), d("div", io, w(s(e)("status.noSections")), 1)) : B("", !0)
      ])
    ]));
  }
}), ro = /* @__PURE__ */ je(so, [["__scopeId", "data-v-ff584ec1"]]), lo = ["title"], co = {
  key: 0,
  class: "stage-placeholder"
}, uo = {
  key: 1,
  class: "stage-status"
}, fo = {
  key: 2,
  class: "stage-status warn"
}, ho = ["title", "aria-label"], vo = { class: "stage-hint" }, Nt = "0kay.web.live2d.resetbtn", mo = "0kay.web.live2d.transform.", go = /* @__PURE__ */ Ke({
  __name: "Live2DStage",
  props: {
    bare: { type: Boolean, default: !1 }
  },
  setup(i) {
    const { t: e } = Ye(), l = Kt(), o = pt(), c = L(null), x = L(null), $ = L(""), b = L("idle"), C = L(""), E = i, I = N(() => E.bare), O = N(() => o.live2d.enabled), R = N(() => o.live2d.modelUrl.trim()), j = N(() => l.emotionMood), F = N(() => {
      const t = String(j.value || "");
      if (!t) return "";
      const n = `emotion.${t}`, r = e(n);
      return r === n ? t : r;
    }), k = N(() => l.emotionColor), p = L([]);
    async function T() {
      try {
        const t = await fetch("/api/live2d");
        if (t.ok) {
          const n = await t.json();
          p.value = n.models || [];
        }
      } catch {
        p.value = [];
      }
    }
    const z = L(null), W = L(le()), Z = L(!1);
    let S = !1, V = { x: 0, y: 0 }, _ = { x: 0, y: 0 };
    function le() {
      try {
        const t = localStorage.getItem(Nt);
        if (t) {
          const n = JSON.parse(t);
          if (typeof n?.x == "number" && typeof n?.y == "number") return n;
        }
      } catch {
      }
      return null;
    }
    const $e = N(() => W.value ? { left: `${W.value.x}px`, top: `${W.value.y}px`, right: "auto", bottom: "auto" } : {});
    function We(t) {
      Z.value = !0, S = !1, V = { x: t.clientX, y: t.clientY };
      const n = z.value?.getBoundingClientRect();
      _ = { x: n?.left ?? 0, y: n?.top ?? 0 };
      try {
        z.value?.setPointerCapture(t.pointerId);
      } catch {
      }
    }
    function Be(t) {
      if (!Z.value || !c.value) return;
      const n = t.clientX - V.x, r = t.clientY - V.y;
      (Math.abs(n) > 3 || Math.abs(r) > 3) && (S = !0);
      const m = c.value.getBoundingClientRect(), P = z.value?.offsetWidth || 34, D = re(_.x - m.left + n, 4, Math.max(4, m.width - P - 4)), A = re(_.y - m.top + r, 4, Math.max(4, m.height - P - 4));
      W.value = { x: Math.round(D), y: Math.round(A) };
    }
    function Ie(t) {
      if (Z.value) {
        Z.value = !1;
        try {
          z.value?.releasePointerCapture(t.pointerId);
        } catch {
        }
        if (S)
          try {
            localStorage.setItem(Nt, JSON.stringify(W.value));
          } catch {
          }
      }
    }
    function ct() {
      if (S) {
        S = !1;
        return;
      }
      an();
    }
    let y = null, g = null, ye = null, Ee = 0, U = 0, Le = { x: 0, y: 0, has: !1 }, we = !1, oe = null, Re = { x: 0, y: 0 }, ie = null, ce = null, q = null, f = null, h = null, v = "off", M = 0, Q = 0, Oe = 0, se = 120, ke = ["ParamMouthOpenY"];
    function J(t) {
      const n = g?.internalModel?.coreModel;
      if (!n) return;
      const r = re(t, 0, 1);
      for (const m of ke)
        try {
          typeof n.setParameterValueById == "function" ? n.setParameterValueById(m, r) : typeof n.setParamFloat == "function" && n.setParamFloat(m, r);
        } catch {
        }
    }
    function K(t) {
      const n = [];
      try {
        const r = t?.internalModel?.settings;
        let m = r?.getLipSyncParameters?.();
        if (!Array.isArray(m) && Array.isArray(r?.groups) && (m = r.groups.find((D) => (D?.Name || D?.name || "").toLowerCase() === "lipsync")?.Ids), Array.isArray(m))
          for (const P of m) typeof P == "string" && P && n.push(P);
      } catch {
      }
      ke = n.length ? n : ["ParamMouthOpenY"];
    }
    function ut() {
      if (v === "off") {
        M !== 0 && (M = 0, J(0));
        return;
      }
      if (v === "audio" && f && h) {
        f.getByteTimeDomainData(h);
        let t = 0;
        for (let m = 0; m < h.length; m++) {
          const P = (h[m] - 128) / 128;
          t += P * P;
        }
        const n = Math.sqrt(t / h.length), r = re(n * 3.4, 0, 1);
        M = M * 0.35 + r * 0.65, J(M);
        return;
      }
      if (v === "text") {
        const t = performance.now() - Q;
        if (t > Oe * se + 260) {
          v = "off", M = 0, J(0);
          return;
        }
        const n = t % se / se, r = n < 0.5 ? 0.12 + 0.72 * Math.sin(n / 0.5 * Math.PI) : 0.06;
        M = M * 0.45 + r * 0.55, J(M);
      }
    }
    async function be(t, n = "") {
      if (!t) {
        qe(n);
        return;
      }
      if (g)
        try {
          if (ie || (ie = new Audio(), ie.crossOrigin = "anonymous", ie.addEventListener("ended", () => {
            v = "off", M = 0, J(0);
          })), ce && ce !== t)
            try {
              URL.revokeObjectURL(ce);
            } catch {
            }
          if (ce = t, ie.src = t, !q) {
            const r = window.AudioContext || window.webkitAudioContext;
            r && (q = new r(), f = q.createAnalyser(), f.fftSize = 1024, h = new Uint8Array(f.fftSize), q.createMediaElementSource(ie).connect(f), f.connect(q.destination));
          }
          await q?.resume().catch(() => {
          }), v = "audio", await ie.play().catch(() => {
            n ? qe(n) : (v = "off", J(0));
          });
        } catch {
          n ? qe(n) : v = "off";
        }
    }
    function qe(t) {
      const n = Array.from(String(t || "")).filter((r) => /\S/.test(r));
      n.length && (se = /[\u4e00-\u9fff]/.test(n.join("")) ? 140 : 80, Oe = n.length, Q = performance.now(), v = "text");
    }
    function kt() {
      v = "off", M = 0, J(0);
      try {
        ie?.pause();
      } catch {
      }
    }
    function bt(t) {
      const n = t.detail || {};
      n.url ? be(n.url, n.text || "") : n.text && qe(n.text);
    }
    let ue = {}, te = [], Je = 0;
    function Gt(t) {
      ue = {}, te = [];
      try {
        const n = t?.internalModel?.motionManager, r = t?.internalModel?.settings, m = n?.definitions || r?.motions || {};
        for (const [D, A] of Object.entries(m)) ue[D] = Array.isArray(A) ? A.length : 0;
        te = (n?.expressionManager?.definitions || r?.expressions || []).map((D) => D?.Name || D?.name).filter((D) => !!D);
      } catch {
      }
      try {
        console.info("[live2d] motions", ue, "expressions", te);
      } catch {
      }
      try {
        window.__0KAY_LIVE2D_CAPS__ = { motions: ue, expressions: te };
      } catch {
      }
    }
    function Fe(t, n) {
      if (!g) return;
      const r = Object.keys(ue).filter((A) => ue[A] > 0);
      if (!r.length) return;
      const m = r.find((A) => /idle/i.test(A)), P = t && ue[t] > 0, D = P ? t : n == null && m ? m : r.find((A) => A !== m) || r[0];
      try {
        const A = g.internalModel?.motionManager;
        if (typeof g.motion == "function" && P) {
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
    function Ge(t) {
      if (!g || !t) return;
      const n = /^\d+$/.test(t) ? Number(t) : te.indexOf(t), r = n >= 0 ? n : t;
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
    function Zt() {
      dt(), !(typeof window > "u") && (Je = window.setInterval(() => {
        if (v !== "off" || document.hidden) return;
        const t = Object.keys(ue).filter((n) => ue[n] > 0 && !/idle/i.test(n));
        t.length && Math.random() < 0.6 && Fe(t[Math.floor(Math.random() * t.length)]), te.length && Math.random() < 0.5 && Ge(te[Math.floor(Math.random() * te.length)]);
      }, 9e3));
    }
    function dt() {
      Je && (clearInterval(Je), Je = 0);
    }
    function xt(t) {
      const n = t.detail || {};
      n.expression && Ge(n.expression), (n.group || n.index != null) && Fe(n.group, n.index);
    }
    function Qt() {
      return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore);
    }
    function re(t, n, r) {
      return Math.min(r, Math.max(n, t));
    }
    function ft() {
      return mo + (R.value || "default");
    }
    function _t() {
      try {
        const t = localStorage.getItem(ft());
        if (!t) return null;
        const n = JSON.parse(t);
        if (typeof n?.x == "number" && typeof n?.y == "number" && typeof n?.scale == "number") return n;
      } catch {
      }
      return null;
    }
    function ht(t = !1) {
      if (!g) return;
      const n = () => {
        try {
          localStorage.setItem(ft(), JSON.stringify({
            x: Math.round(g.x * 100) / 100,
            y: Math.round(g.y * 100) / 100,
            scale: Math.round(g.scale.x * 1e4) / 1e4
          }));
        } catch {
        }
      };
      if (t) {
        U && (clearTimeout(U), U = 0), n();
        return;
      }
      U && clearTimeout(U), U = window.setTimeout(() => {
        U = 0, n();
      }, 140);
    }
    function Ct() {
      if (dt(), v = "off", M = 0, xe(), U && (clearTimeout(U), U = 0), g) {
        try {
          y?.stage && y.stage.removeChild(g), g.destroy?.();
        } catch {
        }
        g = null;
      }
    }
    function Mt() {
      if (At(), Ct(), ye && (ye.disconnect(), ye = null), U && (clearTimeout(U), U = 0), y) {
        try {
          y.destroy(!1, { children: !0, texture: !1, baseTexture: !1 });
        } catch {
        }
        y = null;
      }
    }
    function St(t) {
      if (typeof t.getLocalBounds == "function") {
        const m = t.getLocalBounds();
        if (m && m.width > 0 && m.height > 0) return { width: m.width, height: m.height };
      }
      const n = Math.max(Math.abs(t.scale.x) || 0, 1e-4), r = Math.max(Math.abs(t.scale.y) || 0, 1e-4);
      return { width: Math.max(t.width / n, 1), height: Math.max(t.height / r, 1) };
    }
    function vt(t = g) {
      if (!t || !y) return !1;
      const n = y.screen.width, r = y.screen.height;
      if (!n || !r) return !1;
      const m = St(t);
      if (m.width > 0 && m.height > 0) {
        const P = Math.min(n / m.width, r / m.height) * 0.88;
        t.anchor?.set?.(0.5, 0.5), t.scale.set(P, P);
      }
      t.position.set(n * 0.5, r * 0.55);
      try {
        const P = t.getBounds?.();
        if (P && P.width > 0 && P.height > 0) {
          t.x += n * 0.5 - (P.x + P.width * 0.5), t.y += r * 0.55 - (P.y + P.height * 0.55);
          const D = t.getBounds?.();
          if (D && D.width > 0 && D.height > 0) {
            const A = Math.min(n / D.width, r / D.height) * 0.88, ee = Math.abs(t.scale.x) || 1;
            if (Number.isFinite(A) && A > 0 && Math.abs(A - ee) / ee > 0.08) {
              const de = ee * A;
              t.scale.set(de, de);
              const G = t.getBounds?.();
              G && G.width > 0 && (t.x += n * 0.5 - (G.x + G.width * 0.5), t.y += r * 0.55 - (G.y + G.height * 0.55));
            }
          }
        }
      } catch {
      }
      return !0;
    }
    function en() {
      if (!g) return { hw: 0, hh: 0 };
      const t = St(g), n = Math.abs(g.scale.x) || 1, r = Math.abs(g.scale.y) || 1;
      return { hw: t.width * n / 2, hh: t.height * r / 2 };
    }
    function Ze() {
      if (!g || !y) return;
      const t = y.screen.width, n = y.screen.height, { hw: r, hh: m } = en(), P = Math.min(r * 0.7, t * 0.5), D = Math.min(m * 0.7, n * 0.5), A = P - r, ee = t - P + r, de = D - m, G = n - D + m, Ne = A <= ee ? re(g.x, A, ee) : t * 0.5, Dt = de <= G ? re(g.y, de, G) : n * 0.55;
      g.position.set(Ne, Dt);
    }
    function tn() {
      if (!g || !y) return;
      const t = _t();
      if (t && Number.isFinite(t.scale) && t.scale > 0) {
        g.anchor?.set?.(0.5, 0.5), g.scale.set(t.scale, t.scale), g.position.set(t.x, t.y), Ze();
        return;
      }
      vt();
    }
    function nn(t, n) {
      if (!g || !window.PIXI || typeof window.PIXI.Point != "function" || typeof g.toModelPosition != "function") return null;
      try {
        const r = new window.PIXI.Point(t, n);
        return g.toModelPosition(r, new window.PIXI.Point());
      } catch {
        return null;
      }
    }
    function $t(t, n, r) {
      const m = r - n;
      return !Number.isFinite(m) || Math.abs(m) <= 1e-4 ? 0 : re((t - n) / m * 2 - 1, -1, 1);
    }
    function It(t, n) {
      const r = g?.internalModel, m = r?.focusController;
      if (!m || typeof m.focus != "function" || !y) return;
      const P = y.screen.width || 1, D = y.screen.height || 1;
      let A = t / P * 2 - 1, ee = n / D * 2 - 1;
      const de = nn(t, n);
      if (de && r.originalWidth && r.originalHeight) {
        const G = $t(de.x, 0, r.originalWidth), Ne = $t(de.y, 0, r.originalHeight);
        G >= -1 && G <= 1 && Ne >= -1 && Ne <= 1 && (A = A * 0.35 + G * 0.65, ee = ee * 0.35 + Ne * 0.65);
      }
      A = re(A, -1, 1), ee = re(ee, -1, 1), m.focus(A, -ee);
    }
    function Qe() {
      Le.has && It(Le.x, Le.y);
    }
    function Et(t) {
      if (!g || !y || !c.value) return;
      const n = c.value.getBoundingClientRect();
      if (!n.width || !n.height) return;
      const r = (t.clientX - n.left) / n.width * y.screen.width, m = (t.clientY - n.top) / n.height * y.screen.height;
      Le = { x: r, y: m, has: !0 }, we && t.pointerId === oe && (g.position.set(r + Re.x, m + Re.y), Ze(), ht()), It(r, m);
    }
    function Lt(t) {
      if (!g || !y || !c.value || t.button !== 0 && t.pointerType === "mouse" || t.target?.closest?.(".stage-reset")) return;
      const n = c.value.getBoundingClientRect();
      if (!n.width || !n.height) return;
      const r = (t.clientX - n.left) / n.width * y.screen.width, m = (t.clientY - n.top) / n.height * y.screen.height;
      we = !0, oe = t.pointerId, Re = { x: g.x - r, y: g.y - m };
      try {
        c.value.setPointerCapture(t.pointerId);
      } catch {
      }
      c.value && (c.value.style.cursor = "grabbing");
    }
    function xe(t) {
      if (we && !(t && oe !== null && t.pointerId !== oe)) {
        if (we = !1, c.value) {
          try {
            oe !== null && c.value.releasePointerCapture(oe);
          } catch {
          }
          c.value.style.cursor = "grab";
        }
        oe = null, ht(!0);
      }
    }
    function Pt(t) {
      if (!g || b.value !== "ok" || t.shiftKey) return;
      t.preventDefault();
      const n = t.deltaY < 0 ? 1.06 : 0.94, r = re(g.scale.x * n, 0.08, 3.2);
      g.scale.set(r, r), Ze(), Qe(), ht();
    }
    function an() {
      if (!(!g || !y)) {
        try {
          localStorage.removeItem(ft());
        } catch {
        }
        U && (clearTimeout(U), U = 0);
        try {
          y.resize?.();
        } catch {
        }
        y?.stage && (y.stage.hitArea = y.screen), vt(), Qe();
      }
    }
    function Tt() {
      At();
      const t = c.value;
      t && (t.style.cursor = "grab", t.addEventListener("pointermove", Et), t.addEventListener("pointerdown", Lt), t.addEventListener("pointerup", xe), t.addEventListener("pointercancel", xe), t.addEventListener("pointerleave", xe), t.addEventListener("wheel", Pt, { passive: !1 }));
    }
    function At() {
      const t = c.value;
      t && (t.removeEventListener("pointermove", Et), t.removeEventListener("pointerdown", Lt), t.removeEventListener("pointerup", xe), t.removeEventListener("pointercancel", xe), t.removeEventListener("pointerleave", xe), t.removeEventListener("wheel", Pt), we = !1, oe = null);
    }
    function on() {
      if (y || !x.value || !c.value) return;
      const t = window.PIXI;
      y = new t.Application({
        view: x.value,
        resizeTo: c.value,
        autoStart: !0,
        antialias: !0,
        backgroundAlpha: 0,
        powerPreference: "high-performance"
      }), y.stage && (y.stage.interactive = !0, y.stage.hitArea = y.screen), ye = new ResizeObserver(() => {
        try {
          y?.resize?.();
        } catch {
        }
        if (y?.stage && (y.stage.hitArea = y.screen), g) {
          const n = _t();
          n && Number.isFinite(n.scale) && n.scale > 0 ? (g.position.set(n.x, n.y), g.scale.set(n.scale, n.scale), Ze()) : vt();
        }
        Qe();
      }), ye.observe(c.value), Tt();
    }
    async function mt() {
      try {
        await vn;
      } catch (r) {
        b.value = "error", C.value = `Live2D runtime: ${r.message}`;
        return;
      }
      const t = ++Ee;
      if (Ct(), !O.value) {
        b.value = "disabled", $.value = "";
        return;
      }
      if (!Qt()) {
        b.value = "no-libs", C.value = e("live2d.libsMissing");
        return;
      }
      const n = R.value || p.value[0]?.url;
      if (!n) {
        b.value = "error", C.value = e("live2d.noModel");
        return;
      }
      if (b.value = "loading", C.value = "", $.value = n.split("/").pop() || n, await nt(), y || on(), !y) {
        b.value = "error", C.value = e("live2d.stageMissing");
        return;
      }
      try {
        const r = await window.PIXI.live2d.Live2DModel.from(n, { autoInteract: !1 });
        if (t !== Ee) {
          try {
            r.destroy?.();
          } catch {
          }
          return;
        }
        g = r, Tt(), r.anchor?.set?.(0.5, 0.5), y.stage.addChild(r), tn();
        try {
          r.internalModel?.on?.("beforeModelUpdate", ut);
        } catch {
        }
        K(r), Gt(r), b.value = "ok", Qe(), Fe("Idle"), Zt();
      } catch (r) {
        if (t !== Ee) return;
        console.error("Live2D load failed:", r), b.value = "error", C.value = r?.message || e("live2d.loadError");
      }
    }
    function sn() {
      if (!O.value) {
        Mt(), b.value = "disabled";
        return;
      }
      mt();
    }
    st(async () => {
      window.addEventListener("live2d-models-changed", T), window.addEventListener("live2d-speak", bt), window.addEventListener("live2d-motion", xt), window.__0KAY_LIVE2D__ = { speak: be, stop: kt, motion: Fe, expression: Ge };
      try {
        const t = await fetch("/api/settings/live2d");
        if (t.ok) {
          const { values: n } = await t.json();
          n && typeof n.enabled == "boolean" && (o.live2d.enabled = n.enabled), n && typeof n.model_url == "string" && (o.live2d.modelUrl = n.model_url);
        }
      } catch {
      }
      await T(), O.value ? mt() : b.value = "disabled";
    }), rt(() => {
      if (window.removeEventListener("live2d-models-changed", T), window.removeEventListener("live2d-speak", bt), window.removeEventListener("live2d-motion", xt), dt(), kt(), ce) {
        try {
          URL.revokeObjectURL(ce);
        } catch {
        }
        ce = null;
      }
      try {
        q?.close();
      } catch {
      }
      q = null, Ee++, Mt();
    }), ge(O, sn), ge(R, () => {
      O.value && mt();
    });
    const rn = { happy: 2, sad: 4, irritated: 6, neutral: 0, drowsy: 0, exhausted: 0, sleeping: 0 };
    return ge(j, (t) => {
      if (!g || v !== "off" || !te.length) return;
      const n = rn[t] ?? 0;
      Ge(te[n] || te[0]), (t === "happy" || t === "irritated") && Math.random() < 0.5 && Fe();
    }), (t, n) => (u(), d("div", {
      class: ne(["live2d-stage", { on: O.value, bare: I.value }])
    }, [
      a("div", {
        ref_key: "stageEl",
        ref: c,
        class: "stage-viewport",
        style: Me({ "--mood": k.value }),
        title: O.value && b.value === "ok" ? s(e)("live2d.interactHint") : ""
      }, [
        a("canvas", {
          ref_key: "canvasEl",
          ref: x,
          class: "stage-canvas"
        }, null, 512),
        O.value ? b.value === "loading" ? (u(), d("div", uo, w(s(e)("live2d.loading")), 1)) : b.value === "error" || b.value === "no-libs" ? (u(), d("div", fo, w(C.value || s(e)("live2d.loadError")), 1)) : B("", !0) : (u(), d("div", co, [
          a("p", null, w(s(e)("live2d.disabledHint")), 1)
        ])),
        O.value && b.value === "ok" ? (u(), d("button", {
          key: 3,
          ref_key: "resetBtnEl",
          ref: z,
          class: ne(["stage-reset", { dragging: Z.value }]),
          type: "button",
          style: Me($e.value),
          title: s(e)("live2d.resetView"),
          "aria-label": s(e)("live2d.resetView"),
          onPointerdown: ze(We, ["stop"]),
          onPointermove: ze(Be, ["stop"]),
          onPointerup: ze(Ie, ["stop"]),
          onPointercancel: ze(Ie, ["stop"]),
          onClick: ze(ct, ["stop"])
        }, "⟲", 46, ho)) : B("", !0),
        n[0] || (n[0] = a("div", { class: "stage-gradient" }, null, -1)),
        a("div", vo, w(F.value), 1)
      ], 12, lo)
    ], 2));
  }
}), po = /* @__PURE__ */ je(go, [["__scopeId", "data-v-600df96a"]]), yo = {
  key: 0,
  class: "stage-column"
}, wo = ["src", "title"], ko = ["data-chat-slot"], bo = ["aria-label", "title"], xo = ["src", "title"], _o = ["data-chat-slot"], Co = ["title", "aria-label"], zt = "0kay.web.chat_panel_width_ratio", Ut = 320, Mo = 360, Vt = 960, So = /* @__PURE__ */ Ke({
  __name: "ChatPage",
  setup(i) {
    const { t: e } = Ye(), l = Yt(), o = Ht(), c = L(!1), x = N(() => l.chatRegion("stage")), $ = N(() => l.chatRegion("chat")), b = N(() => $.value.some((S) => S.component === "chat"));
    un(() => {
      for (const S of [...x.value, ...$.value])
        S.component === "iframe" && Fa(String(S.id || ""));
    });
    const C = L(0.34), E = L(null);
    let I = !1;
    function O() {
      try {
        const S = Number(localStorage.getItem(zt));
        S > 0 && S < 1 && (C.value = S);
      } catch {
      }
    }
    function R(S) {
      C.value = S;
      try {
        localStorage.setItem(zt, String(S));
      } catch {
      }
    }
    function j(S, V) {
      const _ = Math.min(Ut, S * 0.3), le = Math.min(Vt, S - Mo);
      return Math.min(Math.max(V, _), le) / S;
    }
    function F(S) {
      c.value || (I = !0, S.target.setPointerCapture?.(S.pointerId), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none");
    }
    function k(S) {
      if (!I || !E.value) return;
      const V = E.value.getBoundingClientRect(), _ = V.right - S.clientX;
      R(j(V.width, _));
    }
    function p() {
      I && (I = !1, document.body.style.cursor = "", document.body.style.userSelect = "");
    }
    function T(S) {
      if (c.value || S.key !== "ArrowLeft" && S.key !== "ArrowRight") return;
      const V = E.value;
      if (!V) return;
      S.preventDefault();
      const _ = V.getBoundingClientRect(), le = C.value * _.width, $e = S.key === "ArrowLeft" ? le + 24 : le - 24;
      R(j(_.width, $e));
    }
    function z() {
      const S = c.value;
      c.value = window.innerWidth <= 960, c.value ? S || (W.value = !1) : W.value = !0;
    }
    st(() => {
      O(), z(), o.setChatVisible(!0), window.addEventListener("resize", z), window.addEventListener("pointermove", k), window.addEventListener("pointerup", p);
    }), rt(() => {
      o.setChatVisible(!1), window.removeEventListener("resize", z), window.removeEventListener("pointermove", k), window.removeEventListener("pointerup", p), document.body.style.cursor = "", document.body.style.userSelect = "";
    });
    const W = L(!1);
    function Z() {
      W.value = !W.value;
    }
    return (S, V) => (u(), d("div", {
      ref_key: "pageEl",
      ref: E,
      class: ne(["chat-page", { "no-chat": !b.value }]),
      style: Me(c.value ? void 0 : { "--chat-w": `min(${Vt}px, max(${Ut}px, ${C.value * 100}%))` })
    }, [
      x.value.length ? (u(), d("div", yo, [
        (u(!0), d(Y, null, he(x.value, (_) => (u(), d(Y, {
          key: _.id
        }, [
          _.component === "live2d" ? (u(), Ve(po, {
            key: 0,
            class: "stage-host"
          })) : _.component === "status" ? (u(), Ve(ro, {
            key: 1,
            class: "status-panel"
          })) : _.component === "iframe" && _.src ? (u(), d("iframe", {
            key: 2,
            class: "slot-frame",
            src: _.src,
            title: _.title || _.id,
            sandbox: "allow-scripts allow-forms allow-popups"
          }, null, 8, wo)) : (u(), d("div", {
            key: 3,
            class: "slot-note",
            "data-chat-slot": _.id
          }, w(_.titleKey ? s(e)(_.titleKey) : _.title || _.id), 9, ko))
        ], 64))), 128))
      ])) : B("", !0),
      !c.value && b.value && x.value.length ? (u(), d("div", {
        key: 1,
        ref: "resizer",
        class: "page-resizer",
        role: "separator",
        "aria-orientation": "vertical",
        tabindex: "0",
        "aria-label": s(e)("chat.resizePanel"),
        title: s(e)("chat.resizePanel"),
        onPointerdown: F,
        onKeydown: T
      }, null, 40, bo)) : B("", !0),
      b.value ? (u(), d("div", {
        key: 2,
        class: ne(["chat-column", { open: W.value || !c.value }])
      }, [
        (u(!0), d(Y, null, he($.value, (_) => (u(), d(Y, {
          key: _.id
        }, [
          _.component === "chat" ? (u(), Ve(Oa, { key: 0 })) : _.component === "iframe" && _.src ? (u(), d("iframe", {
            key: 1,
            class: "slot-frame fill",
            src: _.src,
            title: _.title || _.id,
            sandbox: "allow-scripts allow-forms allow-popups"
          }, null, 8, xo)) : (u(), d("div", {
            key: 2,
            class: "slot-note",
            "data-chat-slot": _.id
          }, w(_.titleKey ? s(e)(_.titleKey) : _.title || _.id), 9, _o))
        ], 64))), 128))
      ], 2)) : B("", !0),
      c.value && b.value ? (u(), d("button", {
        key: 3,
        class: "status-fab",
        title: s(e)("chat.openChat"),
        "aria-label": s(e)("chat.openChat"),
        onClick: Z
      }, [...V[0] || (V[0] = [
        a("svg", {
          width: "22",
          height: "22",
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": "true"
        }, [
          a("path", {
            d: "M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linejoin": "round"
          }),
          a("path", {
            d: "M8.5 11h7M8.5 14h4",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          })
        ], -1)
      ])], 8, Co)) : B("", !0)
    ], 6));
  }
}), Lo = /* @__PURE__ */ je(So, [["__scopeId", "data-v-f5c8f818"]]);
export {
  Lo as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style-chat')){const s=document.createElement('style');s.id='webui-plugin-style-chat';s.textContent=".media-row[data-v-ffd3f9f0]{display:flex;gap:6px;margin:0 0 6px}.media-chip[data-v-ffd3f9f0]{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 10px;border-radius:999px;background:var(--md-primary-container, #e8e0ff);color:var(--md-on-primary-container, #21005d);font-size:11.5px;font-weight:650}.media-chip svg[data-v-ffd3f9f0]{flex:none}.selfie[data-v-ffd3f9f0]{margin:0 0 6px}.selfie-img[data-v-ffd3f9f0]{display:block;max-width:260px;max-height:320px;border-radius:14px;border:1px solid var(--md-outline-variant)}.selfie-pending[data-v-ffd3f9f0]{display:inline-flex;align-items:center;gap:8px;min-width:200px;padding:14px 16px;border-radius:14px;border:1px dashed var(--md-outline-variant);color:var(--md-on-surface-variant);font-size:12px}.selfie-spinner[data-v-ffd3f9f0]{width:13px;height:13px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:selfie-spin-ffd3f9f0 .7s linear infinite}@keyframes selfie-spin-ffd3f9f0{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.selfie-spinner[data-v-ffd3f9f0]{animation:none}}.message[data-v-ffd3f9f0]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-ffd3f9f0]{flex-direction:row-reverse}.avatar[data-v-ffd3f9f0]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-ffd3f9f0]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-ffd3f9f0]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-ffd3f9f0]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-ffd3f9f0]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-ffd3f9f0]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-ffd3f9f0]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden}.msg-file-name[data-v-ffd3f9f0]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-ffd3f9f0]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-ffd3f9f0]{max-width:70%}.content[data-v-ffd3f9f0]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.content-markdown[data-v-ffd3f9f0]{white-space:normal}.user .content[data-v-ffd3f9f0]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-ffd3f9f0]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-ffd3f9f0]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-ffd3f9f0]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-ffd3f9f0]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-ffd3f9f0]{margin:4px 0}.think-body b[data-v-ffd3f9f0]{color:var(--md-on-surface)}.think-summary[data-v-ffd3f9f0]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-ffd3f9f0]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-ffd3f9f0]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-ffd3f9f0]{justify-content:flex-end}.separator[data-v-ffd3f9f0]{color:var(--neutral-gray-10)}.emotion[data-v-ffd3f9f0]{font-weight:500}.chat-panel[data-v-376fda94]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-376fda94]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-376fda94]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-376fda94]{color:var(--md-on-error-container);background:var(--md-error-container);border-color:transparent}.chat-container[data-v-376fda94]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-376fda94]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-376fda94]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-376fda94]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-376fda94]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-376fda94]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-376fda94]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-376fda94]{display:flex;gap:4px}.typing-dots span[data-v-376fda94]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-376fda94 1.4s infinite ease-in-out}.typing-dots span[data-v-376fda94]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-376fda94]:nth-child(2){animation-delay:-.16s}@keyframes bounce-376fda94{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-376fda94]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-376fda94]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-376fda94]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-376fda94]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-376fda94]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-376fda94],.pending-files[data-v-376fda94]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-376fda94]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden}.pending-file-name[data-v-376fda94]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-376fda94]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-376fda94]:hover{color:var(--error)}.pending-thumb[data-v-376fda94]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-376fda94]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-376fda94]{position:absolute;top:2px;right:2px;width:22px;height:22px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.pending-thumb.uploading[data-v-376fda94]{display:flex;align-items:center;justify-content:center;background:var(--md-surface-container-high);animation:thumb-shimmer-376fda94 1.2s infinite}.upload-spinner[data-v-376fda94]{width:18px;height:18px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:upload-spin-376fda94 .8s linear infinite}@keyframes upload-spin-376fda94{to{transform:rotate(360deg)}}@keyframes thumb-shimmer-376fda94{0%,to{opacity:1}50%{opacity:.55}}@media(prefers-reduced-motion:reduce){.pending-thumb.uploading[data-v-376fda94]{animation:none}}.attach-btn[data-v-376fda94]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-376fda94]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-376fda94]:disabled{opacity:.5;cursor:not-allowed}.wake-btn.active[data-v-376fda94]{color:var(--md-primary);background:color-mix(in srgb,var(--md-primary) 14%,transparent)}.call-strip[data-v-376fda94]{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:6px 10px;border-radius:999px;background:color-mix(in srgb,var(--md-success, #1a9e63) 14%,transparent);color:var(--md-on-surface);font-size:12px}.call-dot[data-v-376fda94]{width:8px;height:8px;border-radius:50%;background:var(--md-success, #1a9e63);animation:call-pulse-376fda94 1.4s ease-in-out infinite}.call-text[data-v-376fda94]{flex:1;min-width:0;font-weight:600}.call-end[data-v-376fda94]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:12px;font-weight:650;cursor:pointer;padding:2px 6px;border-radius:8px}.call-end[data-v-376fda94]:hover{background:var(--md-surface-container-high);color:var(--md-on-surface)}@keyframes call-pulse-376fda94{0%,to{opacity:1}50%{opacity:.35}}@media(prefers-reduced-motion:reduce){.call-dot[data-v-376fda94]{animation:none}}.wake-strip[data-v-376fda94]{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:5px 10px;border-radius:var(--radius-md, 10px);background:color-mix(in srgb,var(--md-primary) 10%,transparent);color:var(--md-primary);font-size:12px}.wake-strip.capturing[data-v-376fda94]{background:color-mix(in srgb,var(--md-primary) 18%,transparent)}.wake-dot[data-v-376fda94]{width:8px;height:8px;border-radius:50%;background:currentColor;animation:wake-pulse-376fda94 1.1s ease-in-out infinite}.wake-strip.capturing .wake-dot[data-v-376fda94]{animation-duration:.5s}.wake-text[data-v-376fda94]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wake-stop[data-v-376fda94]{border:none;background:transparent;color:inherit;cursor:pointer;font-size:15px;line-height:1;padding:0 2px;opacity:.75}.wake-stop[data-v-376fda94]:hover{opacity:1}@keyframes wake-pulse-376fda94{0%,to{opacity:1}50%{opacity:.2}}@media(prefers-reduced-motion:reduce){.wake-dot[data-v-376fda94]{animation:none}}.send-button[data-v-376fda94]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-376fda94]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-376fda94]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-376fda94]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-376fda94]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-376fda94]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-376fda94]{background:var(--success)}.disconnected .status-dot[data-v-376fda94]{background:var(--error)}.hint[data-v-376fda94]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-ff584ec1]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-ff584ec1]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-ff584ec1]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-ff584ec1]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-ff584ec1]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-ff584ec1]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-ff584ec1]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-ff584ec1]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-ff584ec1]{margin-bottom:var(--space-xl)}.section-header[data-v-ff584ec1]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-ff584ec1]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.mood-display[data-v-ff584ec1]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-ff584ec1]{margin-bottom:var(--space-md)}.mood-label[data-v-ff584ec1]{font-size:var(--font-size-md);font-weight:600}.emotion-bars[data-v-ff584ec1]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-ff584ec1]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-ff584ec1]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-ff584ec1]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-ff584ec1]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-ff584ec1]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage.bare[data-v-600df96a],.live2d-stage.bare .stage-viewport[data-v-600df96a]{background:none!important;border:0!important;border-radius:0!important;min-height:0}.live2d-stage.bare .stage-gradient[data-v-600df96a],.live2d-stage.bare .stage-hint[data-v-600df96a],.live2d-stage.bare .stage-reset[data-v-600df96a]{display:none!important}.live2d-stage[data-v-600df96a]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-600df96a]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-600df96a]:active{cursor:grabbing}.stage-canvas[data-v-600df96a]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-600df96a]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-600df96a]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-600df96a]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-600df96a]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-600df96a]:active{transform:scale(.96)}.stage-reset.dragging[data-v-600df96a]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-600df96a]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-600df96a]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-600df96a]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.chat-page[data-v-f5c8f818]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-f5c8f818]{grid-template-columns:1fr}.stage-column[data-v-f5c8f818]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-f5c8f818]{flex:1;min-height:240px}.status-panel[data-v-f5c8f818]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-f5c8f818]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-f5c8f818]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-f5c8f818]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-f5c8f818]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-f5c8f818]:hover,.page-resizer[data-v-f5c8f818]:active{background:var(--md-primary)}.chat-column[data-v-f5c8f818]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);position:relative}.chat-slots[data-v-f5c8f818]{display:contents}.status-fab[data-v-f5c8f818]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-f5c8f818]{display:flex;flex-direction:column}.stage-column[data-v-f5c8f818]{flex:1;min-height:0}.page-resizer[data-v-f5c8f818]{display:none}.chat-column[data-v-f5c8f818]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);visibility:hidden;transition:transform var(--transition-normal),visibility 0s linear var(--duration-medium)}.chat-column.open[data-v-f5c8f818]{transform:translate(0);visibility:visible;transition:transform var(--transition-normal),visibility 0s linear 0s}}\n";document.head.appendChild(s)}})();
