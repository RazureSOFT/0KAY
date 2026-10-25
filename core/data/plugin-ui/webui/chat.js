import { ref as E, defineComponent as We, computed as F, openBlock as f, createElementBlock as h, normalizeClass as te, createElementVNode as a, Fragment as j, renderList as me, createCommentVNode as R, toDisplayString as k, createBlock as Ke, unref as i, createTextVNode as Ye, normalizeStyle as Se, watch as ye, nextTick as at, onMounted as rt, onUnmounted as lt, createStaticVNode as zt, withDirectives as on, vModelText as sn, withModifiers as Xe } from "vue";
import { useI18n as qe } from "vue-i18n";
import { MarkdownContent as rn, useChatStore as Ut, useWizardStore as gt, useSettingsSectionsStore as ln, useConfirm as cn, useLifeStore as Vt, useUIPatchesStore as Xt, live2dRuntimeReady as un } from "@0kay/host";
const st = E([]);
let dn = 0;
const mt = /* @__PURE__ */ new Map();
function fn(s) {
  const t = mt.get(s);
  t && clearTimeout(t), mt.delete(s), st.value = st.value.filter((c) => c.id !== s);
}
function tt(s, t = "info", c) {
  const o = {
    id: ++dn,
    kind: t,
    message: s,
    duration: t === "error" ? 6500 : 3500
  };
  return st.value = [...st.value.slice(-4), o], mt.set(o.id, setTimeout(() => fn(o.id), o.duration)), o.id;
}
const U = E("off"), ve = E(""), Oe = E(""), nt = 2600, hn = 9e3, vn = 850, mn = 0.012, gn = 0.02;
let H = null, $e = null, He = null, ne = !0, pt = !1, ot = null, Ae = "wake", pe = "";
const Ht = (s) => new Promise((t) => setTimeout(t, s));
function At(s) {
  return s.toLowerCase().replace(/[\s\u3000]+/g, "").replace(/[，。！？、,.!?~～…:：;；"'“”‘’()（）[\]【】<>《》\-—_/\\]+/g, "");
}
function Kt(s, t) {
  const c = At(s);
  return c ? t.some((o) => {
    const l = At(o);
    return l.length > 0 && c.includes(l);
  }) : !1;
}
function pn() {
  const s = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  if (typeof MediaRecorder > "u") return "";
  for (const t of s)
    if (MediaRecorder.isTypeSupported?.(t)) return t;
  return "";
}
async function yn() {
  try {
    const s = await fetch("/api/asr", { signal: AbortSignal.timeout(5e3) });
    return s.ok ? !!(await s.json()).configured : !1;
  } catch {
    return !1;
  }
}
async function yt(s) {
  const t = new FormData(), c = s.type || "audio/webm", o = c.includes("mp4") ? "m4a" : c.includes("ogg") ? "ogg" : c.includes("wav") ? "wav" : "webm";
  t.append("audio", s, `chunk.${o}`), H?.language && t.append("language", H.language);
  const l = await fetch("/api/asr", { method: "POST", body: t });
  if (l.status === 503) return { text: "", configured: !1 };
  if (!l.ok) throw new Error(await l.text());
  const _ = await l.json();
  return { text: String(_.text || ""), configured: !0 };
}
function wn(s) {
  const t = window.AudioContext || window.webkitAudioContext;
  He = new t();
  const c = He.createMediaStreamSource(s), o = He.createAnalyser();
  o.fftSize = 1024, c.connect(o);
  const l = new Float32Array(o.fftSize);
  return {
    read() {
      o.getFloatTimeDomainData(l);
      let _ = 0;
      for (let $ = 0; $ < l.length; $++) _ += l[$] * l[$];
      return Math.sqrt(_ / l.length);
    },
    close() {
      try {
        c.disconnect();
      } catch {
      }
      try {
        He?.close();
      } catch {
      }
      He = null;
    }
  };
}
function De(s, t = !1) {
  let c = () => {
  };
  return { blob: new Promise((l) => {
    if (!$e || typeof MediaRecorder > "u") {
      l(null);
      return;
    }
    const _ = pn();
    let $;
    try {
      $ = new MediaRecorder($e, _ ? { mimeType: _ } : void 0);
    } catch {
      l(null);
      return;
    }
    const x = [], C = t ? wn($e) : null;
    let b = 0, S = 0, V = !1;
    const B = () => {
      if (!V) {
        V = !0, C && C.close(), clearTimeout(G), clearInterval(O);
        try {
          $.state !== "inactive" && $.stop();
        } catch {
        }
      }
    };
    c = B;
    const G = setTimeout(B, s), O = setInterval(() => {
      if (!C) return;
      const y = C.read(), m = Date.now();
      if (y >= gn) {
        b = m, S = 0;
        return;
      }
      if (!(!b || m - b < 500)) {
        if (y > mn) {
          S = 0;
          return;
        }
        S ? m - S >= vn && B() : S = m;
      }
    }, 80);
    $.ondataavailable = (y) => {
      y.data && y.data.size && x.push(y.data);
    }, $.onstop = () => {
      C && C.close(), l(x.length ? new Blob(x, { type: $.mimeType || _ || "audio/webm" }) : null);
    };
    try {
      $.start();
    } catch {
      B(), l(null);
    }
  }), cancel: () => c() };
}
function kn() {
  try {
    const s = window.AudioContext || window.webkitAudioContext, t = new s(), c = t.currentTime;
    for (const [o, l] of [660, 880].entries()) {
      const _ = t.createOscillator(), $ = t.createGain();
      _.type = "sine", _.frequency.value = l, $.gain.setValueAtTime(1e-4, c + o * 0.09), $.gain.exponentialRampToValueAtTime(0.06, c + o * 0.09 + 0.02), $.gain.exponentialRampToValueAtTime(1e-4, c + o * 0.09 + 0.13), _.connect($).connect(t.destination), _.start(c + o * 0.09), _.stop(c + o * 0.09 + 0.15);
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
async function bn(s) {
  if (!H || ne) return;
  U.value = "woken", kn(), H.onWake(s), U.value = "capturing";
  const t = await De(hn, !0).blob;
  if (!ne) {
    if (t && t.size > 2e3)
      try {
        const o = (await yt(t)).text.trim();
        o && (Oe.value = o, H?.onUtterance(o));
      } catch {
      }
    !ne && ve.value === "core" && (U.value = "listening");
  }
}
async function xn() {
  let s = De(nt);
  try {
    for (; !ne && ve.value === "core"; ) {
      if (pt) {
        s?.cancel(), s = null, await Ht(250);
        continue;
      }
      s || (s = De(nt));
      const t = await s.blob;
      if (ne || ve.value !== "core") return;
      if (s = De(nt), !t || t.size < 1200) continue;
      let c;
      try {
        c = await yt(t);
      } catch {
        continue;
      }
      if (!c.configured) {
        ve.value = "", jt();
        return;
      }
      const o = c.text.trim();
      o && (Oe.value = o, H?.onHeard?.(o), H && Kt(o, H.nicknames) && (s?.cancel(), s = null, await bn(o), !ne && ve.value === "core" && (s = De(nt))));
    }
  } finally {
    s?.cancel();
  }
}
function Yt() {
  const s = window;
  return s.SpeechRecognition || s.webkitSpeechRecognition || null;
}
function jt() {
  const s = Yt();
  if (!s) {
    Ce("no-engine");
    return;
  }
  ve.value !== "browser" && (ve.value = "browser"), Ae = "wake", pe = "";
  const t = new s();
  ot = t, t.lang = H?.language || "zh-CN", t.continuous = !0, t.interimResults = !0, t.onresult = (c) => {
    let o = "";
    for (let l = c.resultIndex; l < c.results.length; l++)
      c.results[l].isFinal && (o += c.results[l][0].transcript);
    if (o = o.trim(), !!o) {
      if (Oe.value = o, H?.onHeard?.(o), Ae === "wake") {
        H && Kt(o, H.nicknames) && (U.value = "woken", H.onWake(o), Ae = "capture", pe = "", U.value = "capturing");
        return;
      }
      pe = `${pe}${o}`.trim();
    }
  }, t.onend = () => {
    if (!ne) {
      Ae === "capture" && pe && (H?.onUtterance(pe), pe = "", Ae = "wake", U.value = "listening");
      try {
        t.start();
      } catch {
      }
    }
  }, t.onerror = (c) => {
    if (c?.error === "not-allowed" || c?.error === "service-not-allowed") {
      Ce("mic-denied");
      return;
    }
    c?.error === "no-speech" || c?.error === "aborted" || Ce("error", String(c?.error || "speech recognition failed"));
  };
  try {
    t.start(), U.value = "listening";
  } catch (c) {
    Ce("error", c?.message || "speech recognition failed");
  }
}
function Ce(s, t) {
  Me(), U.value = "error", H?.onError?.(s, t);
}
async function _n(s) {
  if (Me(), H = s, ne = !1, pt = !1, Oe.value = "", !s.nicknames.length) {
    Ce("no-nickname");
    return;
  }
  if (await yn()) {
    if (ne) return;
    ve.value = "core";
    try {
      $e = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !0, noiseSuppression: !0 } });
    } catch (t) {
      const c = t?.name === "NotAllowedError" || t?.name === "SecurityError";
      Ce(c ? "mic-denied" : "error", t?.message);
      return;
    }
    if (ne) {
      ct();
      return;
    }
    U.value = "listening", xn();
    return;
  }
  if (Yt()) {
    jt();
    return;
  }
  Ce("no-engine");
}
function ct() {
  try {
    $e?.getTracks().forEach((s) => s.stop());
  } catch {
  }
  $e = null;
}
function Me() {
  if (ne = !0, ct(), ot) {
    const s = ot;
    ot = null, s.onend = null, s.onresult = null, s.onerror = null;
    try {
      s.stop();
    } catch {
    }
  }
  Ae = "wake", pe = "", ve.value = "", U.value !== "error" && (U.value = "off");
}
function Dt(s) {
  pt = s;
}
const ge = E("off"), Cn = 2e4, Mn = 9e4;
let we = null, je = !1, it = 0;
function Sn(s) {
  je = s;
}
async function $n(s) {
  Me(), Re("hangup"), we = s, je = !1, ge.value = "dialing";
  try {
    $e = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !0, noiseSuppression: !0 } });
  } catch {
    ge.value = "off", s.onEnd?.("error");
    return;
  }
  if (!we) {
    ct();
    return;
  }
  it = Date.now(), ge.value = "live", In();
}
function Re(s = "hangup") {
  const t = ge.value !== "off", c = we;
  we = null, je = !1, ge.value = "off", t && (ct(), c?.onEnd?.(s));
}
async function In() {
  for (; we && ge.value === "live"; ) {
    if (je) {
      await Ht(200);
      continue;
    }
    if (Date.now() - it > Mn) {
      Re("silence");
      return;
    }
    const s = De(Cn, !0), t = await s.blob;
    if (!we || ge.value !== "live") {
      s.cancel();
      return;
    }
    if (je || !t || t.size < 1200) continue;
    it = Date.now();
    let c = "";
    try {
      const o = await yt(t);
      if (!o.configured) {
        Re("error");
        return;
      }
      c = o.text.trim();
    } catch {
      continue;
    }
    !c || !we || ge.value !== "live" || (it = Date.now(), we.onUtterance(c));
  }
}
function Rt(s) {
  return s.irritation > 0.7 ? "irritated" : s.valence > 0.5 ? "happy" : s.valence < -0.3 ? "sad" : "neutral";
}
const En = {
  happy: "#107c10",
  sad: "#0078d4",
  irritated: "#d13438",
  neutral: "#8a8886"
};
function Ln(s) {
  return En[s];
}
const Pn = {
  key: 0,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, Tn = {
  key: 1,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, An = { class: "content-wrapper" }, Dn = {
  key: 0,
  class: "images"
}, Rn = ["src"], On = {
  key: 1,
  class: "files"
}, Bn = ["href", "title"], Fn = { class: "msg-file-name" }, Nn = {
  key: 3,
  class: "media-row"
}, zn = { class: "media-chip" }, Un = {
  key: 4,
  class: "selfie"
}, Vn = ["src", "alt"], Xn = {
  key: 1,
  class: "selfie-pending"
}, Hn = {
  key: 5,
  class: "think-panel"
}, Kn = ["aria-expanded"], Yn = { class: "think-body" }, jn = {
  key: 0,
  class: "think-raw"
}, Wn = {
  key: 1,
  class: "think-summary"
}, qn = { class: "meta" }, Jn = { class: "time" }, Gn = /* @__PURE__ */ We({
  __name: "MessageBubble",
  props: {
    message: {},
    streaming: { type: Boolean }
  },
  setup(s) {
    const t = s, { t: c, locale: o } = qe(), l = F(() => t.message.role === "user"), _ = E(!1), $ = F(() => {
      if (!t.message.thinkSummary) return null;
      try {
        const C = JSON.parse(t.message.thinkSummary);
        if (typeof C.raw == "string" && C.raw.trim()) return { raw: C.raw };
        if (typeof C.summary == "string" && C.summary.trim()) return C;
        const b = C.intent || c("messageBubble.intentDefault"), S = C.strategy || c("messageBubble.strategyDefault");
        return { summary: c("messageBubble.summary", { intent: b, strategy: S }) };
      } catch {
        return { summary: t.message.thinkSummary };
      }
    }), x = F(() => {
      const C = t.message.timestamp, b = C.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
      return new Intl.DateTimeFormat(o.value, {
        ...b ? {} : { year: "numeric" },
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }).format(C);
    });
    return (C, b) => (f(), h("div", {
      class: te(["message", { user: l.value, assistant: !l.value }])
    }, [
      a("div", {
        class: te(["avatar", { "user-avatar": l.value, "assistant-avatar": !l.value }])
      }, [
        l.value ? (f(), h("svg", Pn, [...b[1] || (b[1] = [
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
        ])])) : (f(), h("svg", Tn, [...b[2] || (b[2] = [
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
      a("div", An, [
        s.message.images?.length ? (f(), h("div", Dn, [
          (f(!0), h(j, null, me(s.message.images, (S, V) => (f(), h("img", {
            key: V,
            src: S,
            alt: "",
            class: "msg-img"
          }, null, 8, Rn))), 128))
        ])) : R("", !0),
        s.message.files?.length ? (f(), h("div", On, [
          (f(!0), h(j, null, me(s.message.files, (S, V) => (f(), h("a", {
            key: V,
            href: S.url,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "msg-file",
            title: S.mime || ""
          }, [
            a("span", Fn, k(S.name), 1)
          ], 8, Bn))), 128))
        ])) : R("", !0),
        s.message.content ? (f(), h("div", {
          key: 2,
          class: te(["content", { "content-markdown": !l.value && !s.streaming }])
        }, [
          !l.value && !s.streaming ? (f(), Ke(i(rn), {
            key: 0,
            content: s.message.content
          }, null, 8, ["content"])) : (f(), h(j, { key: 1 }, [
            Ye(k(s.message.content), 1)
          ], 64))
        ], 2)) : R("", !0),
        !l.value && (s.message.media?.voice || s.message.media?.call) ? (f(), h("div", Nn, [
          a("span", zn, [
            b[3] || (b[3] = a("svg", {
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
            Ye(" " + k(s.message.media?.call ? i(c)("chat.mediaCall") : i(c)("chat.mediaVoice")), 1)
          ])
        ])) : R("", !0),
        !l.value && s.message.media?.selfie ? (f(), h("div", Un, [
          s.message.selfieUrl ? (f(), h("img", {
            key: 0,
            src: s.message.selfieUrl,
            alt: s.message.media.selfie,
            class: "selfie-img"
          }, null, 8, Vn)) : (f(), h("div", Xn, [
            b[4] || (b[4] = a("span", {
              class: "selfie-spinner",
              "aria-hidden": "true"
            }, null, -1)),
            Ye(" " + k(i(c)("chat.mediaSelfieDrawing")), 1)
          ]))
        ])) : R("", !0),
        !l.value && $.value ? (f(), h("div", Hn, [
          a("button", {
            class: "think-toggle",
            type: "button",
            "aria-expanded": _.value,
            onClick: b[0] || (b[0] = (S) => _.value = !_.value)
          }, [
            a("span", null, k(i(c)("chat.thinkLabel")), 1),
            a("span", null, k(_.value ? i(c)("chat.thinkCollapse") : i(c)("chat.thinkExpand")), 1)
          ], 8, Kn),
          a("div", {
            class: te(["collapse-grid", { open: _.value }])
          }, [
            a("div", null, [
              a("div", Yn, [
                $.value.raw ? (f(), h("pre", jn, k($.value.raw), 1)) : $.value.summary ? (f(), h("p", Wn, k($.value.summary), 1)) : R("", !0)
              ])
            ])
          ], 2)
        ])) : R("", !0),
        a("div", qn, [
          a("span", Jn, k(x.value), 1),
          !l.value && s.message.emotion ? (f(), h(j, { key: 0 }, [
            b[5] || (b[5] = a("span", { class: "separator" }, "·", -1)),
            a("span", {
              class: "emotion",
              style: Se({ color: i(Ln)(i(Rt)(s.message.emotion)) })
            }, k(i(c)(`emotion.${i(Rt)(s.message.emotion)}`)), 5)
          ], 64)) : R("", !0)
        ])
      ])
    ], 2));
  }
}), Je = (s, t) => {
  const c = s.__vccOpts || s;
  for (const [o, l] of t)
    c[o] = l;
  return c;
}, Zn = /* @__PURE__ */ Je(Gn, [["__scopeId", "data-v-ffd3f9f0"]]), Qn = { class: "chat-panel" }, ea = {
  class: "messages",
  role: "log",
  "aria-live": "polite",
  "aria-relevant": "additions text"
}, ta = {
  key: 0,
  class: "empty-state"
}, na = {
  key: 1,
  class: "typing-indicator"
}, aa = { class: "typing-text" }, oa = { class: "input-area" }, ia = {
  key: 0,
  class: "pending-images"
}, sa = ["src"], ra = ["aria-label", "title", "onClick"], la = {
  key: 0,
  class: "pending-thumb uploading",
  "aria-hidden": "true"
}, ca = {
  key: 1,
  class: "pending-files"
}, ua = ["title"], da = { class: "pending-file-name" }, fa = ["title", "aria-label", "onClick"], ha = {
  key: 2,
  class: "call-strip"
}, va = { class: "call-text" }, ma = { class: "wake-text" }, ga = ["title"], pa = { class: "input-wrapper" }, ya = ["title", "disabled"], wa = ["title", "disabled"], ka = ["title", "aria-pressed", "disabled"], ba = ["placeholder", "disabled"], xa = ["aria-label", "title", "disabled"], _a = { class: "input-footer" }, Ca = {
  key: 0,
  class: "connection-status disconnected"
}, Ma = {
  key: 1,
  class: "connection-status connected"
}, Sa = { class: "hint" }, $a = ["title", "aria-label", "aria-pressed"], Ia = ["title", "aria-label"], Ea = ["disabled", "title", "aria-label"], La = ["title", "aria-label"], Pa = 80, Ta = /* @__PURE__ */ We({
  __name: "ChatPanel",
  setup(s) {
    const { t, locale: c } = qe(), o = Ut(), l = gt(), _ = ln(), { confirm: $ } = cn(), x = E(""), C = E(null), b = E(null), S = E([]), V = E(null), B = E([]), G = E(null), O = E(!1), y = E([]), m = E(!1), P = F(() => U.value === "listening" || U.value === "woken" || U.value === "capturing"), N = F(() => P.value ? t("chat.wakeOnTitle") : t("chat.wakeOffTitle")), W = F(() => U.value === "capturing" ? Oe.value ? t("chat.wakeHeardLine", { text: Oe.value }) : t("chat.wakeCapturing") : U.value === "woken" ? t("chat.wakeWoken") : t("chat.wakeListening", { name: y.value[0] || "" }));
    function ae(u) {
      const p = _.values.life?.[u];
      return p == null ? "" : String(p);
    }
    function I() {
      return ae("wake_nickname").split(/[,，、;；\s]+/).map((u) => u.trim()).filter(Boolean);
    }
    function K(u, d) {
      const p = u === "no-nickname" ? t("chat.wakeNeedNickname") : u === "no-engine" ? t("chat.wakeNoEngine") : u === "mic-denied" ? t("chat.wakeMicDenied") : t("chat.wakeFailed", { detail: d || "unknown" });
      tt(p, "error");
    }
    function M(u) {
      const d = u.trim();
      if (d) {
        if (o.isTyping) {
          x.value = d, at(Be);
          return;
        }
        x.value = d, ce();
      }
    }
    async function le() {
      if (!m.value) {
        m.value = !0;
        try {
          await _.loadValues("life");
          const u = I();
          if (y.value = u, !u.length) {
            K("no-nickname");
            return;
          }
          await _n({
            nicknames: u,
            language: ae("asr_language") || "zh",
            onWake: () => {
              b.value?.focus();
            },
            onUtterance: M,
            onError: K
          });
        } finally {
          m.value = !1;
        }
      }
    }
    function Ie() {
      if (P.value) {
        Me();
        return;
      }
      le();
    }
    function Be() {
      const u = b.value;
      u && (u.style.height = "auto", u.style.height = `${Math.min(u.scrollHeight, 120)}px`);
    }
    ye(x, () => at(Be));
    const Fe = E(!0);
    let w = !1;
    function g() {
      const u = C.value;
      u && (Fe.value = u.scrollHeight - u.scrollTop - u.clientHeight <= Pa);
    }
    function ce() {
      if (o.isTyping) return;
      const u = x.value.trim();
      if (!u && S.value.length === 0 && B.value.length === 0) return;
      const d = [...S.value], p = B.value.map((T) => ({ ...T }));
      S.value = [], B.value = [], w = !0, o.sendMessage(u, d, p), x.value = "";
    }
    function Ee(u) {
      if (u.key === "Enter" && !u.shiftKey) {
        if (u.isComposing || u.keyCode === 229) return;
        u.preventDefault(), ce();
      }
    }
    function z() {
      V.value?.click();
    }
    async function Le(u) {
      const d = u.target, p = Array.from(d.files || []);
      if (d.value = "", !!p.length) {
        O.value = !0;
        try {
          for (const T of p) {
            const Y = await o.uploadImage(T);
            S.value.push(Y);
          }
        } catch (T) {
          console.error("image upload failed:", T);
          const Y = p.length === 1 ? p[0].name : "";
          tt(Y ? t("chat.uploadFailedNamed", { name: Y }) : t("chat.uploadFailed"), "error");
        } finally {
          O.value = !1;
        }
      }
    }
    function ke(u) {
      S.value = S.value.filter((d) => d !== u);
    }
    function oe() {
      G.value?.click();
    }
    async function Ne(u) {
      const d = u.target, p = Array.from(d.files || []);
      if (d.value = "", !!p.length) {
        O.value = !0;
        try {
          for (const T of p)
            B.value.push(await o.uploadFile(T));
        } catch (T) {
          console.error("file upload failed:", T);
          const Y = p.length === 1 ? p[0].name : "";
          tt(Y ? t("chat.uploadFailedNamed", { name: Y }) : t("chat.uploadFailed"), "error");
        } finally {
          O.value = !1;
        }
      }
    }
    function ie(u) {
      B.value = B.value.filter((d) => d.url !== u);
    }
    async function ue(u) {
      const d = Array.from(u.clipboardData?.files || []);
      if (d.length) {
        u.preventDefault(), O.value = !0;
        try {
          for (const p of d)
            p.type.startsWith("image/") ? S.value.push(await o.uploadImage(p)) : B.value.push(await o.uploadFile(p));
        } catch (p) {
          console.error("paste upload failed:", p), tt(t("chat.uploadFailed"), "error");
        } finally {
          O.value = !1;
        }
      }
    }
    async function se() {
      await $({
        title: t("chat.clear"),
        message: t("chat.clearConfirm"),
        confirmLabel: t("chat.clear"),
        danger: !0
      }) && o.clearMessages();
    }
    function de() {
      const u = o.messages;
      if (!u.length) return;
      const d = l.persona.name || t("chat.defaultCharacter"), p = new Intl.DateTimeFormat(c.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }), T = [];
      T.push(`# ${t("chat.exportTitle")}`, ""), T.push(`- ${t("chat.defaultCharacter")}: ${d}`), T.push(`- ${p.format(/* @__PURE__ */ new Date())}`, "");
      for (const X of u) {
        if (!X.content && !X.images?.length && !X.files?.length) continue;
        const Te = X.role === "user" ? t("chat.you") : d;
        if (T.push(`## ${Te} · ${p.format(X.timestamp)}`), X.content && T.push("", X.content), X.images?.length) {
          T.push("");
          for (const xe of X.images) T.push(`![image](${xe})`);
        }
        if (X.files?.length) {
          T.push("");
          for (const xe of X.files) T.push(`- [${xe.name}](${xe.url})`);
        }
        T.push("");
      }
      const Y = new Blob([T.join(`
`)], { type: "text/markdown;charset=utf-8" }), ze = URL.createObjectURL(Y), q = /* @__PURE__ */ new Date(), Pe = (X) => String(X).padStart(2, "0"), be = document.createElement("a");
      be.href = ze, be.download = `0kay-chat-${q.getFullYear()}${Pe(q.getMonth() + 1)}${Pe(q.getDate())}-${Pe(q.getHours())}${Pe(q.getMinutes())}.md`, document.body.appendChild(be), be.click(), be.remove(), URL.revokeObjectURL(ze);
    }
    rt(() => {
      o.restoreHistory(), o.isConnected || o.connect(), (async () => (await _.loadValues("life"), ae("wake_enabled") === "true" && I().length && le()))();
    });
    let Q = null;
    return ye(() => o.callMode, (u) => {
      if (!u) {
        Re("hangup");
        return;
      }
      Q = o.voiceEnabled, o.setVoiceEnabled(!0), $n({
        language: ae("asr_language") || "zh",
        onUtterance: (d) => {
          o.sendMessage(d);
        },
        onEnd: () => {
          Q !== null && o.setVoiceEnabled(Q), Q = null, o.endCall();
        }
      });
    }), ye(() => o.isTyping, (u) => Sn(u || !o.voiceEnabled), { immediate: !0 }), lt(() => {
      Me(), Dt(!1), Re("hangup");
    }), ye(() => o.isTyping, (u) => Dt(u), { immediate: !0 }), ye(
      () => o.messages.length,
      async () => {
        await at();
        const u = C.value;
        u && ((Fe.value || w) && (u.scrollTop = u.scrollHeight, Fe.value = !0), w = !1);
      }
    ), (u, d) => (f(), h("div", Qn, [
      a("div", {
        class: "chat-container",
        ref_key: "chatContainer",
        ref: C,
        onScroll: g
      }, [
        a("div", ea, [
          i(o).messages.length === 0 ? (f(), h("div", ta, [
            d[5] || (d[5] = zt('<div class="empty-icon" data-v-376fda94><svg width="64" height="64" viewBox="0 0 64 64" fill="none" data-v-376fda94><circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" data-v-376fda94></circle><circle cx="32" cy="28" r="8" stroke="currentColor" stroke-width="2" data-v-376fda94></circle><path d="M20 44C20 38 26 34 32 34C38 34 44 38 44 44" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-376fda94></path></svg></div>', 1)),
            a("h3", null, k(i(t)("chat.empty")), 1),
            a("p", null, k(i(t)("chat.emptyHint", { name: i(l).persona.name || i(t)("chat.defaultCharacter") })), 1)
          ])) : R("", !0),
          (f(!0), h(j, null, me(i(o).messages, (p, T) => (f(), Ke(Zn, {
            key: p.id,
            message: p,
            streaming: i(o).isTyping && T === i(o).messages.length - 1
          }, null, 8, ["message", "streaming"]))), 128)),
          i(o).isTyping ? (f(), h("div", na, [
            d[6] || (d[6] = a("div", { class: "typing-dots" }, [
              a("span"),
              a("span"),
              a("span")
            ], -1)),
            a("span", aa, k(i(l).persona.name || "AI") + " " + k(i(t)("chat.thinking")), 1)
          ])) : R("", !0)
        ])
      ], 544),
      a("div", oa, [
        S.value.length || O.value ? (f(), h("div", ia, [
          (f(!0), h(j, null, me(S.value, (p) => (f(), h("div", {
            key: p,
            class: "pending-thumb"
          }, [
            a("img", {
              src: p,
              alt: ""
            }, null, 8, sa),
            a("button", {
              class: "remove-img",
              type: "button",
              "aria-label": i(t)("chat.removeImage"),
              title: i(t)("chat.removeImage"),
              onClick: (T) => ke(p)
            }, " × ", 8, ra)
          ]))), 128)),
          O.value ? (f(), h("div", la, [...d[7] || (d[7] = [
            a("span", { class: "upload-spinner" }, null, -1)
          ])])) : R("", !0)
        ])) : R("", !0),
        B.value.length ? (f(), h("div", ca, [
          (f(!0), h(j, null, me(B.value, (p) => (f(), h("span", {
            key: p.url,
            class: "pending-file",
            title: `${p.mime || ""} · ${p.size || 0} B`
          }, [
            a("span", da, k(p.name), 1),
            a("button", {
              class: "remove-file",
              type: "button",
              title: i(t)("chat.removeFile"),
              "aria-label": i(t)("chat.removeFile"),
              onClick: (T) => ie(p.url)
            }, " × ", 8, fa)
          ], 8, ua))), 128))
        ])) : R("", !0),
        i(o).callMode ? (f(), h("div", ha, [
          d[8] || (d[8] = a("span", {
            class: "call-dot",
            "aria-hidden": "true"
          }, null, -1)),
          a("span", va, k(i(ge) === "dialing" ? i(t)("chat.callDialing") : i(t)("chat.callBanner")), 1),
          a("button", {
            class: "call-end",
            type: "button",
            onClick: d[0] || (d[0] = (p) => i(Re)("hangup"))
          }, k(i(t)("chat.callEnd")), 1)
        ])) : R("", !0),
        P.value ? (f(), h("div", {
          key: 3,
          class: te(["wake-strip", i(U)])
        }, [
          d[9] || (d[9] = a("span", {
            class: "wake-dot",
            "aria-hidden": "true"
          }, null, -1)),
          a("span", ma, k(W.value), 1),
          a("button", {
            class: "wake-stop",
            type: "button",
            title: i(t)("chat.wakeOnTitle"),
            onClick: d[1] || (d[1] = //@ts-ignore
            (...p) => i(Me) && i(Me)(...p))
          }, "×", 8, ga)
        ], 2)) : R("", !0),
        a("div", pa, [
          a("input", {
            ref_key: "imageInput",
            ref: V,
            type: "file",
            accept: "image/png,image/jpeg,image/gif,image/webp",
            multiple: "",
            hidden: "",
            onChange: Le
          }, null, 544),
          a("input", {
            ref_key: "fileInput",
            ref: G,
            type: "file",
            multiple: "",
            hidden: "",
            onChange: Ne
          }, null, 544),
          a("button", {
            class: "attach-btn",
            type: "button",
            title: i(t)("chat.attachImage"),
            disabled: O.value || !i(o).isConnected,
            onClick: z
          }, [...d[10] || (d[10] = [
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
          ])], 8, ya),
          a("button", {
            class: "attach-btn",
            type: "button",
            title: i(t)("chat.attachFile"),
            disabled: O.value || !i(o).isConnected,
            onClick: oe
          }, [...d[11] || (d[11] = [
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
          ])], 8, wa),
          a("button", {
            class: te(["attach-btn wake-btn", { active: P.value }]),
            type: "button",
            title: N.value,
            "aria-pressed": P.value,
            disabled: m.value,
            onClick: Ie
          }, [...d[12] || (d[12] = [
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
          ])], 10, ka),
          on(a("textarea", {
            ref_key: "messageInput",
            ref: b,
            "onUpdate:modelValue": d[2] || (d[2] = (p) => x.value = p),
            class: "message-input",
            placeholder: i(t)("chat.inputPlaceholder"),
            rows: "1",
            onKeydown: Ee,
            onPaste: ue,
            disabled: !i(o).isConnected
          }, null, 40, ba), [
            [sn, x.value]
          ]),
          a("button", {
            class: "send-button",
            "aria-label": i(t)("chat.send"),
            title: i(t)("chat.send"),
            onClick: ce,
            disabled: !x.value.trim() && !S.value.length && !B.value.length || !i(o).isConnected || i(o).isTyping
          }, [...d[13] || (d[13] = [
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
          ])], 8, xa)
        ]),
        a("div", _a, [
          i(o).isConnected ? (f(), h("span", Ma, [
            d[15] || (d[15] = a("span", { class: "status-dot" }, null, -1)),
            Ye(" " + k(i(t)("chat.connected")), 1)
          ])) : (f(), h("span", Ca, [
            d[14] || (d[14] = a("span", { class: "status-dot" }, null, -1)),
            Ye(" " + k(i(t)("chat.disconnected")), 1)
          ])),
          a("span", Sa, k(i(t)("chat.contextHint", { n: i(o).contextTokens.toLocaleString() })), 1),
          a("button", {
            class: te(["context-btn", { active: i(o).voiceEnabled }]),
            type: "button",
            title: i(o).voiceEnabled ? i(t)("chat.voiceOnTitle") : i(t)("chat.voiceOffTitle"),
            "aria-label": i(o).voiceEnabled ? i(t)("chat.voiceOnTitle") : i(t)("chat.voiceOffTitle"),
            "aria-pressed": i(o).voiceEnabled,
            onClick: d[3] || (d[3] = (p) => i(o).setVoiceEnabled(!i(o).voiceEnabled))
          }, k(i(o).voiceEnabled ? i(t)("chat.voiceOn") : i(t)("chat.voiceOff")), 11, $a),
          i(o).messages.length ? (f(), h(j, { key: 2 }, [
            a("button", {
              class: "context-btn",
              type: "button",
              title: i(t)("chat.download"),
              "aria-label": i(t)("chat.download"),
              onClick: de
            }, k(i(t)("chat.download")), 9, Ia),
            a("button", {
              class: "context-btn",
              type: "button",
              disabled: i(o).compacting,
              title: i(t)("chat.compact"),
              "aria-label": i(t)("chat.compact"),
              onClick: d[4] || (d[4] = //@ts-ignore
              (...p) => i(o).compactContext && i(o).compactContext(...p))
            }, k(i(o).compacting ? i(t)("chat.compacting") : i(t)("chat.compact")), 9, Ea)
          ], 64)) : R("", !0),
          a("button", {
            class: "context-btn danger",
            type: "button",
            title: i(t)("chat.clear"),
            "aria-label": i(t)("chat.clear"),
            onClick: se
          }, k(i(t)("chat.clear")), 9, La)
        ])
      ])
    ]));
  }
}), Aa = /* @__PURE__ */ Je(Ta, [["__scopeId", "data-v-376fda94"]]), Da = { class: "status-panel" }, Ra = { class: "panel-header" }, Oa = {
  key: 0,
  class: "patch-badge"
}, Ba = { class: "panel-content" }, Fa = { class: "section character-profile" }, Na = { class: "section-header" }, za = { class: "section-title" }, Ua = ["datetime"], Va = ["data-section", "data-kind"], Xa = { class: "section-header" }, Ha = { class: "section-title" }, Ka = {
  key: 0,
  class: "mood-display"
}, Ya = {
  key: 0,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, ja = {
  key: 1,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Wa = {
  key: 2,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, qa = {
  key: 3,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Ja = {
  key: 4,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Ga = {
  key: 1,
  class: "emotion-bars"
}, Za = { class: "emotion-label" }, Qa = { class: "emotion-bar" }, eo = {
  key: 0,
  class: "empty-tasks"
}, to = /* @__PURE__ */ We({
  __name: "StatusPanel",
  setup(s) {
    const { t } = qe(), c = Vt(), o = Xt(), l = gt(), _ = E(/* @__PURE__ */ new Date()), $ = F(() => {
      const y = l.persona.birthDate;
      if (!y) return null;
      const m = /* @__PURE__ */ new Date(`${y}T00:00:00`);
      if (Number.isNaN(m.getTime()) || m > _.value) return null;
      const P = _.value;
      return P.getFullYear() - m.getFullYear() - +(P.getMonth() < m.getMonth() || P.getMonth() === m.getMonth() && P.getDate() < m.getDate());
    });
    let x = null;
    function C(y) {
      if (!y || !y.startsWith("life.")) return;
      const m = y.slice(5).split(".").reduce((P, N) => P?.[N], c);
      return typeof m == "function" ? void 0 : m;
    }
    function b(y) {
      if (y.titleKey) {
        const m = t(y.titleKey);
        if (m && m !== y.titleKey) return m;
      }
      return y.title || y.id;
    }
    function S(y) {
      if (y.labelKey) {
        const m = t(y.labelKey);
        if (m && m !== y.labelKey) return m;
      }
      return y.label || y.key;
    }
    function V(y) {
      const m = Number(C(`life.emotion.${y.key}`) ?? 0);
      return y.scale === "remap01" ? (m + 1) / 2 : m;
    }
    rt(() => {
      x = setInterval(() => {
        _.value = /* @__PURE__ */ new Date();
      }, 1e3);
    }), lt(() => {
      x && clearInterval(x);
    });
    const B = F(
      () => o.statusSections.filter((y) => y.kind === "mood" || y.kind === "bars" || y.kind === "bar")
    ), G = F(() => c.emotionColor), O = F(() => c.emotionMood);
    return (y, m) => (f(), h("div", Da, [
      a("div", Ra, [
        a("h2", null, k(i(t)("status.title")), 1),
        i(o).loaded ? (f(), h("span", Oa, "patch")) : R("", !0)
      ]),
      a("div", Ba, [
        a("section", Fa, [
          a("div", Na, [
            a("span", za, k(i(l).persona.name || i(t)("chat.defaultCharacter")), 1)
          ]),
          a("dl", null, [
            a("div", null, [
              a("dt", null, k(i(t)("status.age")), 1),
              a("dd", null, k($.value === null ? i(t)("status.birthdayUnset") : i(t)("status.ageValue", { age: $.value })), 1)
            ]),
            a("div", null, [
              a("dt", null, k(i(t)("status.time")), 1),
              a("dd", null, [
                a("time", {
                  datetime: _.value.toISOString()
                }, k(_.value.toLocaleString()), 9, Ua)
              ])
            ]),
            a("div", null, [
              a("dt", null, k(i(t)("status.timezone")), 1),
              a("dd", null, k(Intl.DateTimeFormat().resolvedOptions().timeZone), 1)
            ])
          ])
        ]),
        (f(!0), h(j, null, me(B.value, (P) => (f(), h("div", {
          key: P.id,
          class: "section",
          "data-section": P.id,
          "data-kind": P.kind
        }, [
          a("div", Xa, [
            a("span", Ha, k(b(P)), 1)
          ]),
          P.kind === "mood" ? (f(), h("div", Ka, [
            a("div", {
              class: "mood-icon",
              style: Se({ color: G.value })
            }, [
              O.value === "happy" ? (f(), h("svg", Ya, [...m[0] || (m[0] = [
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
              ])])) : O.value === "sad" ? (f(), h("svg", ja, [...m[1] || (m[1] = [
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
              ])])) : O.value === "irritated" ? (f(), h("svg", Wa, [...m[2] || (m[2] = [
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
              ])])) : O.value === "sleeping" ? (f(), h("svg", qa, [...m[3] || (m[3] = [
                zt('<circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" data-v-ff584ec1></circle><path d="M16 22C17 22 18 22 18 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-ff584ec1></path><path d="M30 22C31 22 32 22 32 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-ff584ec1></path><path d="M18 32C20 34 28 34 30 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-ff584ec1></path><text x="36" y="12" fill="currentColor" font-size="12" font-weight="bold" data-v-ff584ec1>Z</text>', 5)
              ])])) : (f(), h("svg", Ja, [...m[4] || (m[4] = [
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
              style: Se({ color: G.value })
            }, k(i(t)(`emotion.${O.value}`)), 5)
          ])) : P.kind === "bars" || P.kind === "bar" ? (f(), h("div", Ga, [
            (f(!0), h(j, null, me(P.axes || [], (N) => (f(), h("div", {
              key: N.key,
              class: "emotion-row"
            }, [
              a("span", Za, k(S(N)), 1),
              a("div", Qa, [
                a("div", {
                  class: "emotion-fill",
                  style: Se({
                    transform: `scaleX(${Math.max(0, Math.min(1, V(N)))})`,
                    backgroundColor: N.color || "#0078d4"
                  })
                }, null, 4)
              ])
            ]))), 128))
          ])) : R("", !0)
        ], 8, Va))), 128)),
        i(o).statusSections.length === 0 ? (f(), h("div", eo, k(i(t)("status.noSections")), 1)) : R("", !0)
      ])
    ]));
  }
}), no = /* @__PURE__ */ Je(to, [["__scopeId", "data-v-ff584ec1"]]), ao = ["title"], oo = {
  key: 0,
  class: "stage-placeholder"
}, io = {
  key: 1,
  class: "stage-status"
}, so = {
  key: 2,
  class: "stage-status warn"
}, ro = ["title", "aria-label"], lo = { class: "stage-hint" }, Ot = "0kay.web.live2d.resetbtn", co = "0kay.web.live2d.transform.", uo = /* @__PURE__ */ We({
  __name: "Live2DStage",
  setup(s) {
    const { t } = qe(), c = Vt(), o = gt(), l = E(null), _ = E(null), $ = E(""), x = E("idle"), C = E(""), b = F(() => o.live2d.enabled), S = F(() => o.live2d.modelUrl.trim()), V = F(() => c.emotionMood), B = F(() => {
      const e = String(V.value || "");
      if (!e) return "";
      const n = `emotion.${e}`, r = t(n);
      return r === n ? e : r;
    }), G = F(() => c.emotionColor), O = E([]);
    async function y() {
      try {
        const e = await fetch("/api/live2d");
        if (e.ok) {
          const n = await e.json();
          O.value = n.models || [];
        }
      } catch {
        O.value = [];
      }
    }
    const m = E(null), P = E(K()), N = E(!1);
    let W = !1, ae = { x: 0, y: 0 }, I = { x: 0, y: 0 };
    function K() {
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
    const M = F(() => P.value ? { left: `${P.value.x}px`, top: `${P.value.y}px`, right: "auto", bottom: "auto" } : {});
    function le(e) {
      N.value = !0, W = !1, ae = { x: e.clientX, y: e.clientY };
      const n = m.value?.getBoundingClientRect();
      I = { x: n?.left ?? 0, y: n?.top ?? 0 };
      try {
        m.value?.setPointerCapture(e.pointerId);
      } catch {
      }
    }
    function Ie(e) {
      if (!N.value || !l.value) return;
      const n = e.clientX - ae.x, r = e.clientY - ae.y;
      (Math.abs(n) > 3 || Math.abs(r) > 3) && (W = !0);
      const v = l.value.getBoundingClientRect(), L = m.value?.offsetWidth || 34, D = re(I.x - v.left + n, 4, Math.max(4, v.width - L - 4)), A = re(I.y - v.top + r, 4, Math.max(4, v.height - L - 4));
      P.value = { x: Math.round(D), y: Math.round(A) };
    }
    function Be(e) {
      if (N.value) {
        N.value = !1;
        try {
          m.value?.releasePointerCapture(e.pointerId);
        } catch {
        }
        if (W)
          try {
            localStorage.setItem(Ot, JSON.stringify(P.value));
          } catch {
          }
      }
    }
    function Fe() {
      if (W) {
        W = !1;
        return;
      }
      en();
    }
    let w = null, g = null, ce = null, Ee = 0, z = 0, Le = { x: 0, y: 0, has: !1 }, ke = !1, oe = null, Ne = { x: 0, y: 0 }, ie = null, ue = null, se = null, de = null, Q = null, u = "off", d = 0, p = 0, T = 0, Y = 120, ze = ["ParamMouthOpenY"];
    function q(e) {
      const n = g?.internalModel?.coreModel;
      if (!n) return;
      const r = re(e, 0, 1);
      for (const v of ze)
        try {
          typeof n.setParameterValueById == "function" ? n.setParameterValueById(v, r) : typeof n.setParamFloat == "function" && n.setParamFloat(v, r);
        } catch {
        }
    }
    function Pe(e) {
      const n = [];
      try {
        const r = e?.internalModel?.settings;
        let v = r?.getLipSyncParameters?.();
        if (!Array.isArray(v) && Array.isArray(r?.groups) && (v = r.groups.find((D) => (D?.Name || D?.name || "").toLowerCase() === "lipsync")?.Ids), Array.isArray(v))
          for (const L of v) typeof L == "string" && L && n.push(L);
      } catch {
      }
      ze = n.length ? n : ["ParamMouthOpenY"];
    }
    function be() {
      if (u === "off") {
        d !== 0 && (d = 0, q(0));
        return;
      }
      if (u === "audio" && de && Q) {
        de.getByteTimeDomainData(Q);
        let e = 0;
        for (let v = 0; v < Q.length; v++) {
          const L = (Q[v] - 128) / 128;
          e += L * L;
        }
        const n = Math.sqrt(e / Q.length), r = re(n * 3.4, 0, 1);
        d = d * 0.35 + r * 0.65, q(d);
        return;
      }
      if (u === "text") {
        const e = performance.now() - p;
        if (e > T * Y + 260) {
          u = "off", d = 0, q(0);
          return;
        }
        const n = e % Y / Y, r = n < 0.5 ? 0.12 + 0.72 * Math.sin(n / 0.5 * Math.PI) : 0.06;
        d = d * 0.45 + r * 0.55, q(d);
      }
    }
    async function X(e, n = "") {
      if (!e) {
        Te(n);
        return;
      }
      if (g)
        try {
          if (ie || (ie = new Audio(), ie.crossOrigin = "anonymous", ie.addEventListener("ended", () => {
            u = "off", d = 0, q(0);
          })), ue && ue !== e)
            try {
              URL.revokeObjectURL(ue);
            } catch {
            }
          if (ue = e, ie.src = e, !se) {
            const r = window.AudioContext || window.webkitAudioContext;
            r && (se = new r(), de = se.createAnalyser(), de.fftSize = 1024, Q = new Uint8Array(de.fftSize), se.createMediaElementSource(ie).connect(de), de.connect(se.destination));
          }
          await se?.resume().catch(() => {
          }), u = "audio", await ie.play().catch(() => {
            n ? Te(n) : (u = "off", q(0));
          });
        } catch {
          n ? Te(n) : u = "off";
        }
    }
    function Te(e) {
      const n = Array.from(String(e || "")).filter((r) => /\S/.test(r));
      n.length && (Y = /[\u4e00-\u9fff]/.test(n.join("")) ? 140 : 80, T = n.length, p = performance.now(), u = "text");
    }
    function xe() {
      u = "off", d = 0, q(0);
      try {
        ie?.pause();
      } catch {
      }
    }
    function wt(e) {
      const n = e.detail || {};
      n.url ? X(n.url, n.text || "") : n.text && Te(n.text);
    }
    let fe = {}, ee = [], Ge = 0;
    function Wt(e) {
      fe = {}, ee = [];
      try {
        const n = e?.internalModel?.motionManager, r = e?.internalModel?.settings, v = n?.definitions || r?.motions || {};
        for (const [D, A] of Object.entries(v)) fe[D] = Array.isArray(A) ? A.length : 0;
        ee = (n?.expressionManager?.definitions || r?.expressions || []).map((D) => D?.Name || D?.name).filter((D) => !!D);
      } catch {
      }
      try {
        console.info("[live2d] motions", fe, "expressions", ee);
      } catch {
      }
      try {
        window.__0KAY_LIVE2D_CAPS__ = { motions: fe, expressions: ee };
      } catch {
      }
    }
    function Ue(e, n) {
      if (!g) return;
      const r = Object.keys(fe).filter((A) => fe[A] > 0);
      if (!r.length) return;
      const v = r.find((A) => /idle/i.test(A)), L = e && fe[e] > 0, D = L ? e : n == null && v ? v : r.find((A) => A !== v) || r[0];
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
    function Ze(e) {
      if (!g || !e) return;
      const n = /^\d+$/.test(e) ? Number(e) : ee.indexOf(e), r = n >= 0 ? n : e;
      try {
        const v = g.internalModel?.motionManager?.expressionManager;
        if (v?.setExpression) {
          v.setExpression(r);
          return;
        }
        g.expression?.(r);
      } catch {
      }
    }
    function qt() {
      ut(), !(typeof window > "u") && (Ge = window.setInterval(() => {
        if (u !== "off" || document.hidden) return;
        const e = Object.keys(fe).filter((n) => fe[n] > 0 && !/idle/i.test(n));
        e.length && Math.random() < 0.6 && Ue(e[Math.floor(Math.random() * e.length)]), ee.length && Math.random() < 0.5 && Ze(ee[Math.floor(Math.random() * ee.length)]);
      }, 9e3));
    }
    function ut() {
      Ge && (clearInterval(Ge), Ge = 0);
    }
    function kt(e) {
      const n = e.detail || {};
      n.expression && Ze(n.expression), (n.group || n.index != null) && Ue(n.group, n.index);
    }
    function Jt() {
      return !!(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel && window.Live2DCubismCore);
    }
    function re(e, n, r) {
      return Math.min(r, Math.max(n, e));
    }
    function dt() {
      return co + (S.value || "default");
    }
    function bt() {
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
    function xt() {
      if (ut(), u = "off", d = 0, _e(), z && (clearTimeout(z), z = 0), g) {
        try {
          w?.stage && w.stage.removeChild(g), g.destroy?.();
        } catch {
        }
        g = null;
      }
    }
    function _t() {
      if (Pt(), xt(), ce && (ce.disconnect(), ce = null), z && (clearTimeout(z), z = 0), w) {
        try {
          w.destroy(!1, { children: !0, texture: !1, baseTexture: !1 });
        } catch {
        }
        w = null;
      }
    }
    function Ct(e) {
      if (typeof e.getLocalBounds == "function") {
        const v = e.getLocalBounds();
        if (v && v.width > 0 && v.height > 0) return { width: v.width, height: v.height };
      }
      const n = Math.max(Math.abs(e.scale.x) || 0, 1e-4), r = Math.max(Math.abs(e.scale.y) || 0, 1e-4);
      return { width: Math.max(e.width / n, 1), height: Math.max(e.height / r, 1) };
    }
    function ht(e = g) {
      if (!e || !w) return !1;
      const n = w.screen.width, r = w.screen.height;
      if (!n || !r) return !1;
      const v = Ct(e);
      if (v.width > 0 && v.height > 0) {
        const L = Math.min(n / v.width, r / v.height) * 0.88;
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
              const he = Z * A;
              e.scale.set(he, he);
              const J = e.getBounds?.();
              J && J.width > 0 && (e.x += n * 0.5 - (J.x + J.width * 0.5), e.y += r * 0.55 - (J.y + J.height * 0.55));
            }
          }
        }
      } catch {
      }
      return !0;
    }
    function Gt() {
      if (!g) return { hw: 0, hh: 0 };
      const e = Ct(g), n = Math.abs(g.scale.x) || 1, r = Math.abs(g.scale.y) || 1;
      return { hw: e.width * n / 2, hh: e.height * r / 2 };
    }
    function Qe() {
      if (!g || !w) return;
      const e = w.screen.width, n = w.screen.height, { hw: r, hh: v } = Gt(), L = Math.min(r * 0.7, e * 0.5), D = Math.min(v * 0.7, n * 0.5), A = L - r, Z = e - L + r, he = D - v, J = n - D + v, Ve = A <= Z ? re(g.x, A, Z) : e * 0.5, Tt = he <= J ? re(g.y, he, J) : n * 0.55;
      g.position.set(Ve, Tt);
    }
    function Zt() {
      if (!g || !w) return;
      const e = bt();
      if (e && Number.isFinite(e.scale) && e.scale > 0) {
        g.anchor?.set?.(0.5, 0.5), g.scale.set(e.scale, e.scale), g.position.set(e.x, e.y), Qe();
        return;
      }
      ht();
    }
    function Qt(e, n) {
      if (!g || !window.PIXI || typeof window.PIXI.Point != "function" || typeof g.toModelPosition != "function") return null;
      try {
        const r = new window.PIXI.Point(e, n);
        return g.toModelPosition(r, new window.PIXI.Point());
      } catch {
        return null;
      }
    }
    function Mt(e, n, r) {
      const v = r - n;
      return !Number.isFinite(v) || Math.abs(v) <= 1e-4 ? 0 : re((e - n) / v * 2 - 1, -1, 1);
    }
    function St(e, n) {
      const r = g?.internalModel, v = r?.focusController;
      if (!v || typeof v.focus != "function" || !w) return;
      const L = w.screen.width || 1, D = w.screen.height || 1;
      let A = e / L * 2 - 1, Z = n / D * 2 - 1;
      const he = Qt(e, n);
      if (he && r.originalWidth && r.originalHeight) {
        const J = Mt(he.x, 0, r.originalWidth), Ve = Mt(he.y, 0, r.originalHeight);
        J >= -1 && J <= 1 && Ve >= -1 && Ve <= 1 && (A = A * 0.35 + J * 0.65, Z = Z * 0.35 + Ve * 0.65);
      }
      A = re(A, -1, 1), Z = re(Z, -1, 1), v.focus(A, -Z);
    }
    function et() {
      Le.has && St(Le.x, Le.y);
    }
    function $t(e) {
      if (!g || !w || !l.value) return;
      const n = l.value.getBoundingClientRect();
      if (!n.width || !n.height) return;
      const r = (e.clientX - n.left) / n.width * w.screen.width, v = (e.clientY - n.top) / n.height * w.screen.height;
      Le = { x: r, y: v, has: !0 }, ke && e.pointerId === oe && (g.position.set(r + Ne.x, v + Ne.y), Qe(), ft()), St(r, v);
    }
    function It(e) {
      if (!g || !w || !l.value || e.button !== 0 && e.pointerType === "mouse" || e.target?.closest?.(".stage-reset")) return;
      const n = l.value.getBoundingClientRect();
      if (!n.width || !n.height) return;
      const r = (e.clientX - n.left) / n.width * w.screen.width, v = (e.clientY - n.top) / n.height * w.screen.height;
      ke = !0, oe = e.pointerId, Ne = { x: g.x - r, y: g.y - v };
      try {
        l.value.setPointerCapture(e.pointerId);
      } catch {
      }
      l.value && (l.value.style.cursor = "grabbing");
    }
    function _e(e) {
      if (ke && !(e && oe !== null && e.pointerId !== oe)) {
        if (ke = !1, l.value) {
          try {
            oe !== null && l.value.releasePointerCapture(oe);
          } catch {
          }
          l.value.style.cursor = "grab";
        }
        oe = null, ft(!0);
      }
    }
    function Et(e) {
      if (!g || x.value !== "ok" || !e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const n = e.deltaY < 0 ? 1.06 : 0.94, r = re(g.scale.x * n, 0.08, 3.2);
      g.scale.set(r, r), Qe(), et(), ft();
    }
    function en() {
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
        w?.stage && (w.stage.hitArea = w.screen), ht(), et();
      }
    }
    function Lt() {
      Pt();
      const e = l.value;
      e && (e.style.cursor = "grab", e.addEventListener("pointermove", $t), e.addEventListener("pointerdown", It), e.addEventListener("pointerup", _e), e.addEventListener("pointercancel", _e), e.addEventListener("pointerleave", _e), e.addEventListener("wheel", Et, { passive: !1 }));
    }
    function Pt() {
      const e = l.value;
      e && (e.removeEventListener("pointermove", $t), e.removeEventListener("pointerdown", It), e.removeEventListener("pointerup", _e), e.removeEventListener("pointercancel", _e), e.removeEventListener("pointerleave", _e), e.removeEventListener("wheel", Et), ke = !1, oe = null);
    }
    function tn() {
      if (w || !_.value || !l.value) return;
      const e = window.PIXI;
      w = new e.Application({
        view: _.value,
        resizeTo: l.value,
        autoStart: !0,
        antialias: !0,
        backgroundAlpha: 0,
        powerPreference: "high-performance"
      }), w.stage && (w.stage.interactive = !0, w.stage.hitArea = w.screen), ce = new ResizeObserver(() => {
        try {
          w?.resize?.();
        } catch {
        }
        if (w?.stage && (w.stage.hitArea = w.screen), g) {
          const n = bt();
          n && Number.isFinite(n.scale) && n.scale > 0 ? (g.position.set(n.x, n.y), g.scale.set(n.scale, n.scale), Qe()) : ht();
        }
        et();
      }), ce.observe(l.value), Lt();
    }
    async function vt() {
      try {
        await un;
      } catch (r) {
        x.value = "error", C.value = `Live2D runtime: ${r.message}`;
        return;
      }
      const e = ++Ee;
      if (xt(), !b.value) {
        x.value = "disabled", $.value = "";
        return;
      }
      if (!Jt()) {
        x.value = "no-libs", C.value = t("live2d.libsMissing");
        return;
      }
      const n = S.value || O.value[0]?.url;
      if (!n) {
        x.value = "error", C.value = t("live2d.noModel");
        return;
      }
      if (x.value = "loading", C.value = "", $.value = n.split("/").pop() || n, await at(), w || tn(), !w) {
        x.value = "error", C.value = t("live2d.stageMissing");
        return;
      }
      try {
        const r = await window.PIXI.live2d.Live2DModel.from(n, { autoInteract: !1 });
        if (e !== Ee) {
          try {
            r.destroy?.();
          } catch {
          }
          return;
        }
        g = r, Lt(), r.anchor?.set?.(0.5, 0.5), w.stage.addChild(r), Zt();
        try {
          r.internalModel?.on?.("beforeModelUpdate", be);
        } catch {
        }
        Pe(r), Wt(r), x.value = "ok", et(), Ue("Idle"), qt();
      } catch (r) {
        if (e !== Ee) return;
        console.error("Live2D load failed:", r), x.value = "error", C.value = r?.message || t("live2d.loadError");
      }
    }
    function nn() {
      if (!b.value) {
        _t(), x.value = "disabled";
        return;
      }
      vt();
    }
    rt(async () => {
      window.addEventListener("live2d-models-changed", y), window.addEventListener("live2d-speak", wt), window.addEventListener("live2d-motion", kt), window.__0KAY_LIVE2D__ = { speak: X, stop: xe, motion: Ue, expression: Ze };
      try {
        const e = await fetch("/api/settings/live2d");
        if (e.ok) {
          const { values: n } = await e.json();
          n && typeof n.enabled == "boolean" && (o.live2d.enabled = n.enabled), n && typeof n.model_url == "string" && (o.live2d.modelUrl = n.model_url);
        }
      } catch {
      }
      await y(), b.value ? vt() : x.value = "disabled";
    }), lt(() => {
      if (window.removeEventListener("live2d-models-changed", y), window.removeEventListener("live2d-speak", wt), window.removeEventListener("live2d-motion", kt), ut(), xe(), ue) {
        try {
          URL.revokeObjectURL(ue);
        } catch {
        }
        ue = null;
      }
      try {
        se?.close();
      } catch {
      }
      se = null, Ee++, _t();
    }), ye(b, nn), ye(S, () => {
      b.value && vt();
    });
    const an = { happy: 2, sad: 4, irritated: 6, neutral: 0, drowsy: 0, exhausted: 0, sleeping: 0 };
    return ye(V, (e) => {
      if (!g || u !== "off" || !ee.length) return;
      const n = an[e] ?? 0;
      Ze(ee[n] || ee[0]), (e === "happy" || e === "irritated") && Math.random() < 0.5 && Ue();
    }), (e, n) => (f(), h("div", {
      class: te(["live2d-stage", { on: b.value }])
    }, [
      a("div", {
        ref_key: "stageEl",
        ref: l,
        class: "stage-viewport",
        style: Se({ "--mood": G.value }),
        title: b.value && x.value === "ok" ? i(t)("live2d.interactHint") : ""
      }, [
        a("canvas", {
          ref_key: "canvasEl",
          ref: _,
          class: "stage-canvas"
        }, null, 512),
        b.value ? x.value === "loading" ? (f(), h("div", io, k(i(t)("live2d.loading")), 1)) : x.value === "error" || x.value === "no-libs" ? (f(), h("div", so, k(C.value || i(t)("live2d.loadError")), 1)) : R("", !0) : (f(), h("div", oo, [
          a("p", null, k(i(t)("live2d.disabledHint")), 1)
        ])),
        b.value && x.value === "ok" ? (f(), h("button", {
          key: 3,
          ref_key: "resetBtnEl",
          ref: m,
          class: te(["stage-reset", { dragging: N.value }]),
          type: "button",
          style: Se(M.value),
          title: i(t)("live2d.resetView"),
          "aria-label": i(t)("live2d.resetView"),
          onPointerdown: Xe(le, ["stop"]),
          onPointermove: Xe(Ie, ["stop"]),
          onPointerup: Xe(Be, ["stop"]),
          onPointercancel: Xe(Be, ["stop"]),
          onClick: Xe(Fe, ["stop"])
        }, "⟲", 46, ro)) : R("", !0),
        n[0] || (n[0] = a("div", { class: "stage-gradient" }, null, -1)),
        a("div", lo, k(B.value), 1)
      ], 12, ao)
    ], 2));
  }
}), fo = /* @__PURE__ */ Je(uo, [["__scopeId", "data-v-389757eb"]]), ho = {
  key: 0,
  class: "stage-column"
}, vo = ["src", "title"], mo = ["data-chat-slot"], go = ["aria-label", "title"], po = ["src", "title"], yo = ["data-chat-slot"], wo = ["title", "aria-label"], Bt = "0kay.web.chat_panel_width_ratio", Ft = 320, ko = 360, Nt = 960, bo = /* @__PURE__ */ We({
  __name: "ChatPage",
  setup(s) {
    const { t } = qe(), c = Xt(), o = Ut(), l = E(!1), _ = F(() => c.chatRegion("stage")), $ = F(() => c.chatRegion("chat")), x = F(() => $.value.some((I) => I.component === "chat")), C = E(0.34), b = E(null);
    let S = !1;
    function V() {
      try {
        const I = Number(localStorage.getItem(Bt));
        I > 0 && I < 1 && (C.value = I);
      } catch {
      }
    }
    function B(I) {
      C.value = I;
      try {
        localStorage.setItem(Bt, String(I));
      } catch {
      }
    }
    function G(I, K) {
      const M = Math.min(Ft, I * 0.3), le = Math.min(Nt, I - ko);
      return Math.min(Math.max(K, M), le) / I;
    }
    function O(I) {
      l.value || (S = !0, I.target.setPointerCapture?.(I.pointerId), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none");
    }
    function y(I) {
      if (!S || !b.value) return;
      const K = b.value.getBoundingClientRect(), M = K.right - I.clientX;
      B(G(K.width, M));
    }
    function m() {
      S && (S = !1, document.body.style.cursor = "", document.body.style.userSelect = "");
    }
    function P(I) {
      if (l.value || I.key !== "ArrowLeft" && I.key !== "ArrowRight") return;
      const K = b.value;
      if (!K) return;
      I.preventDefault();
      const M = K.getBoundingClientRect(), le = C.value * M.width, Ie = I.key === "ArrowLeft" ? le + 24 : le - 24;
      B(G(M.width, Ie));
    }
    function N() {
      const I = l.value;
      l.value = window.innerWidth <= 960, l.value ? I || (W.value = !1) : W.value = !0;
    }
    rt(() => {
      V(), N(), o.setChatVisible(!0), window.addEventListener("resize", N), window.addEventListener("pointermove", y), window.addEventListener("pointerup", m);
    }), lt(() => {
      o.setChatVisible(!1), window.removeEventListener("resize", N), window.removeEventListener("pointermove", y), window.removeEventListener("pointerup", m), document.body.style.cursor = "", document.body.style.userSelect = "";
    });
    const W = E(!1);
    function ae() {
      W.value = !W.value;
    }
    return (I, K) => (f(), h("div", {
      ref_key: "pageEl",
      ref: b,
      class: te(["chat-page", { "no-chat": !x.value }]),
      style: Se(l.value ? void 0 : { "--chat-w": `min(${Nt}px, max(${Ft}px, ${C.value * 100}%))` })
    }, [
      _.value.length ? (f(), h("div", ho, [
        (f(!0), h(j, null, me(_.value, (M) => (f(), h(j, {
          key: M.id
        }, [
          M.component === "live2d" ? (f(), Ke(fo, {
            key: 0,
            class: "stage-host"
          })) : M.component === "status" ? (f(), Ke(no, {
            key: 1,
            class: "status-panel"
          })) : M.component === "iframe" && M.src ? (f(), h("iframe", {
            key: 2,
            class: "slot-frame",
            src: M.src,
            title: M.title || M.id,
            sandbox: "allow-scripts allow-forms allow-popups"
          }, null, 8, vo)) : (f(), h("div", {
            key: 3,
            class: "slot-note",
            "data-chat-slot": M.id
          }, k(M.titleKey ? i(t)(M.titleKey) : M.title || M.id), 9, mo))
        ], 64))), 128))
      ])) : R("", !0),
      !l.value && x.value && _.value.length ? (f(), h("div", {
        key: 1,
        ref: "resizer",
        class: "page-resizer",
        role: "separator",
        "aria-orientation": "vertical",
        tabindex: "0",
        "aria-label": i(t)("chat.resizePanel"),
        title: i(t)("chat.resizePanel"),
        onPointerdown: O,
        onKeydown: P
      }, null, 40, go)) : R("", !0),
      x.value ? (f(), h("div", {
        key: 2,
        class: te(["chat-column", { open: W.value || !l.value }])
      }, [
        (f(!0), h(j, null, me($.value, (M) => (f(), h(j, {
          key: M.id
        }, [
          M.component === "chat" ? (f(), Ke(Aa, { key: 0 })) : M.component === "iframe" && M.src ? (f(), h("iframe", {
            key: 1,
            class: "slot-frame fill",
            src: M.src,
            title: M.title || M.id,
            sandbox: "allow-scripts allow-forms allow-popups"
          }, null, 8, po)) : (f(), h("div", {
            key: 2,
            class: "slot-note",
            "data-chat-slot": M.id
          }, k(M.titleKey ? i(t)(M.titleKey) : M.title || M.id), 9, yo))
        ], 64))), 128))
      ], 2)) : R("", !0),
      l.value && x.value ? (f(), h("button", {
        key: 3,
        class: "status-fab",
        title: i(t)("chat.openChat"),
        "aria-label": i(t)("chat.openChat"),
        onClick: ae
      }, [...K[0] || (K[0] = [
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
      ])], 8, wo)) : R("", !0)
    ], 6));
  }
}), Mo = /* @__PURE__ */ Je(bo, [["__scopeId", "data-v-839f922b"]]);
export {
  Mo as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".media-row[data-v-ffd3f9f0]{display:flex;gap:6px;margin:0 0 6px}.media-chip[data-v-ffd3f9f0]{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 10px;border-radius:999px;background:var(--md-primary-container, #e8e0ff);color:var(--md-on-primary-container, #21005d);font-size:11.5px;font-weight:650}.media-chip svg[data-v-ffd3f9f0]{flex:none}.selfie[data-v-ffd3f9f0]{margin:0 0 6px}.selfie-img[data-v-ffd3f9f0]{display:block;max-width:260px;max-height:320px;border-radius:14px;border:1px solid var(--md-outline-variant)}.selfie-pending[data-v-ffd3f9f0]{display:inline-flex;align-items:center;gap:8px;min-width:200px;padding:14px 16px;border-radius:14px;border:1px dashed var(--md-outline-variant);color:var(--md-on-surface-variant);font-size:12px}.selfie-spinner[data-v-ffd3f9f0]{width:13px;height:13px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:selfie-spin-ffd3f9f0 .7s linear infinite}@keyframes selfie-spin-ffd3f9f0{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.selfie-spinner[data-v-ffd3f9f0]{animation:none}}.message[data-v-ffd3f9f0]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-ffd3f9f0]{flex-direction:row-reverse}.avatar[data-v-ffd3f9f0]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-ffd3f9f0]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-ffd3f9f0]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-ffd3f9f0]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-ffd3f9f0]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-ffd3f9f0]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-ffd3f9f0]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden}.msg-file-name[data-v-ffd3f9f0]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-ffd3f9f0]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-ffd3f9f0]{max-width:70%}.content[data-v-ffd3f9f0]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.content-markdown[data-v-ffd3f9f0]{white-space:normal}.user .content[data-v-ffd3f9f0]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-ffd3f9f0]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-ffd3f9f0]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-ffd3f9f0]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-ffd3f9f0]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-ffd3f9f0]{margin:4px 0}.think-body b[data-v-ffd3f9f0]{color:var(--md-on-surface)}.think-summary[data-v-ffd3f9f0]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-ffd3f9f0]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-ffd3f9f0]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-ffd3f9f0]{justify-content:flex-end}.separator[data-v-ffd3f9f0]{color:var(--neutral-gray-10)}.emotion[data-v-ffd3f9f0]{font-weight:500}.chat-panel[data-v-376fda94]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-376fda94]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-376fda94]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-376fda94]{color:var(--md-on-error-container);background:var(--md-error-container);border-color:transparent}.chat-container[data-v-376fda94]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-376fda94]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-376fda94]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-376fda94]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-376fda94]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-376fda94]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-376fda94]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-376fda94]{display:flex;gap:4px}.typing-dots span[data-v-376fda94]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-376fda94 1.4s infinite ease-in-out}.typing-dots span[data-v-376fda94]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-376fda94]:nth-child(2){animation-delay:-.16s}@keyframes bounce-376fda94{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-376fda94]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-376fda94]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-376fda94]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-376fda94]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-376fda94]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-376fda94],.pending-files[data-v-376fda94]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-376fda94]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden}.pending-file-name[data-v-376fda94]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-376fda94]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-376fda94]:hover{color:var(--error)}.pending-thumb[data-v-376fda94]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-376fda94]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-376fda94]{position:absolute;top:2px;right:2px;width:22px;height:22px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.pending-thumb.uploading[data-v-376fda94]{display:flex;align-items:center;justify-content:center;background:var(--md-surface-container-high);animation:thumb-shimmer-376fda94 1.2s infinite}.upload-spinner[data-v-376fda94]{width:18px;height:18px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:upload-spin-376fda94 .8s linear infinite}@keyframes upload-spin-376fda94{to{transform:rotate(360deg)}}@keyframes thumb-shimmer-376fda94{0%,to{opacity:1}50%{opacity:.55}}@media(prefers-reduced-motion:reduce){.pending-thumb.uploading[data-v-376fda94]{animation:none}}.attach-btn[data-v-376fda94]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-376fda94]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-376fda94]:disabled{opacity:.5;cursor:not-allowed}.wake-btn.active[data-v-376fda94]{color:var(--md-primary);background:color-mix(in srgb,var(--md-primary) 14%,transparent)}.call-strip[data-v-376fda94]{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:6px 10px;border-radius:999px;background:color-mix(in srgb,var(--md-success, #1a9e63) 14%,transparent);color:var(--md-on-surface);font-size:12px}.call-dot[data-v-376fda94]{width:8px;height:8px;border-radius:50%;background:var(--md-success, #1a9e63);animation:call-pulse-376fda94 1.4s ease-in-out infinite}.call-text[data-v-376fda94]{flex:1;min-width:0;font-weight:600}.call-end[data-v-376fda94]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:12px;font-weight:650;cursor:pointer;padding:2px 6px;border-radius:8px}.call-end[data-v-376fda94]:hover{background:var(--md-surface-container-high);color:var(--md-on-surface)}@keyframes call-pulse-376fda94{0%,to{opacity:1}50%{opacity:.35}}@media(prefers-reduced-motion:reduce){.call-dot[data-v-376fda94]{animation:none}}.wake-strip[data-v-376fda94]{display:flex;align-items:center;gap:8px;margin:0 0 6px;padding:5px 10px;border-radius:var(--radius-md, 10px);background:color-mix(in srgb,var(--md-primary) 10%,transparent);color:var(--md-primary);font-size:12px}.wake-strip.capturing[data-v-376fda94]{background:color-mix(in srgb,var(--md-primary) 18%,transparent)}.wake-dot[data-v-376fda94]{width:8px;height:8px;border-radius:50%;background:currentColor;animation:wake-pulse-376fda94 1.1s ease-in-out infinite}.wake-strip.capturing .wake-dot[data-v-376fda94]{animation-duration:.5s}.wake-text[data-v-376fda94]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wake-stop[data-v-376fda94]{border:none;background:transparent;color:inherit;cursor:pointer;font-size:15px;line-height:1;padding:0 2px;opacity:.75}.wake-stop[data-v-376fda94]:hover{opacity:1}@keyframes wake-pulse-376fda94{0%,to{opacity:1}50%{opacity:.2}}@media(prefers-reduced-motion:reduce){.wake-dot[data-v-376fda94]{animation:none}}.send-button[data-v-376fda94]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-376fda94]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-376fda94]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-376fda94]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-376fda94]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-376fda94]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-376fda94]{background:var(--success)}.disconnected .status-dot[data-v-376fda94]{background:var(--error)}.hint[data-v-376fda94]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-ff584ec1]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-ff584ec1]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-ff584ec1]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-ff584ec1]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-ff584ec1]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-ff584ec1]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-ff584ec1]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-ff584ec1]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-ff584ec1]{margin-bottom:var(--space-xl)}.section-header[data-v-ff584ec1]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-ff584ec1]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.mood-display[data-v-ff584ec1]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-ff584ec1]{margin-bottom:var(--space-md)}.mood-label[data-v-ff584ec1]{font-size:var(--font-size-md);font-weight:600}.emotion-bars[data-v-ff584ec1]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-ff584ec1]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-ff584ec1]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-ff584ec1]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-ff584ec1]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-ff584ec1]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage[data-v-389757eb]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-389757eb]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-389757eb]:active{cursor:grabbing}.stage-canvas[data-v-389757eb]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-389757eb]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-389757eb]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-389757eb]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-389757eb]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-389757eb]:active{transform:scale(.96)}.stage-reset.dragging[data-v-389757eb]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-389757eb]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-389757eb]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-389757eb]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.chat-page[data-v-839f922b]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-839f922b]{grid-template-columns:1fr}.stage-column[data-v-839f922b]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-839f922b]{flex:1;min-height:240px}.status-panel[data-v-839f922b]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-839f922b]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-839f922b]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-839f922b]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-839f922b]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-839f922b]:hover,.page-resizer[data-v-839f922b]:active{background:var(--md-primary)}.chat-column[data-v-839f922b]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);position:relative}.chat-slots[data-v-839f922b]{display:contents}.status-fab[data-v-839f922b]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-839f922b]{display:flex;flex-direction:column}.stage-column[data-v-839f922b]{flex:1;min-height:0}.page-resizer[data-v-839f922b]{display:none}.chat-column[data-v-839f922b]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);visibility:hidden;transition:transform var(--transition-normal),visibility 0s linear var(--duration-medium)}.chat-column.open[data-v-839f922b]{transform:translate(0);visibility:visible;transition:transform var(--transition-normal),visibility 0s linear 0s}}\n";document.head.appendChild(s)}})();
