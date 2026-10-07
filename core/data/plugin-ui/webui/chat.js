import { defineComponent as X, computed as D, ref as S, openBlock as n, createElementBlock as s, normalizeClass as R, createElementVNode as e, Fragment as B, renderList as N, createCommentVNode as $, toDisplayString as d, createBlock as U, unref as t, createTextVNode as ee, normalizeStyle as V, watch as oe, nextTick as se, onMounted as te, createStaticVNode as ce, withDirectives as ge, vModelText as ye, onUnmounted as ue } from "vue";
import { useI18n as Z } from "vue-i18n";
import { MarkdownContent as ke, useChatStore as de, useWizardStore as he, useConfirm as _e, useLifeStore as we, useUIPatchesStore as me } from "@0kay/host";
import { t as Q } from "./assets/toast-CztbypyC.js";
import { _ as G } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
import { L as be } from "./assets/Live2DStage-BH3rl0Rs.js";
function ae(g) {
  return g.irritation > 0.7 ? "irritated" : g.valence > 0.5 ? "happy" : g.valence < -0.3 ? "sad" : "neutral";
}
const Ce = {
  happy: "#107c10",
  sad: "#0078d4",
  irritated: "#d13438",
  neutral: "#8a8886"
};
function $e(g) {
  return Ce[g];
}
const xe = {
  key: 0,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, Me = {
  key: 1,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, Se = { class: "content-wrapper" }, Ie = {
  key: 0,
  class: "images"
}, Be = ["src"], Le = {
  key: 1,
  class: "files"
}, Te = ["href", "title"], Pe = { class: "msg-file-name" }, De = {
  key: 3,
  class: "think-panel"
}, Fe = ["aria-expanded"], Ee = { class: "think-body" }, Oe = {
  key: 0,
  class: "think-raw"
}, Ne = {
  key: 1,
  class: "think-summary"
}, Re = { class: "meta" }, ze = { class: "time" }, Ke = /* @__PURE__ */ X({
  __name: "MessageBubble",
  props: {
    message: {},
    streaming: { type: Boolean }
  },
  setup(g) {
    const o = g, { t: x, locale: a } = Z(), y = D(() => o.message.role === "user"), f = S(!1), _ = D(() => {
      if (!o.message.thinkSummary) return null;
      try {
        const w = JSON.parse(o.message.thinkSummary);
        if (typeof w.raw == "string" && w.raw.trim()) return { raw: w.raw };
        if (typeof w.summary == "string" && w.summary.trim()) return w;
        const m = w.intent || x("messageBubble.intentDefault"), C = w.strategy || x("messageBubble.strategyDefault");
        return { summary: x("messageBubble.summary", { intent: m, strategy: C }) };
      } catch {
        return { summary: o.message.thinkSummary };
      }
    }), L = D(() => {
      const w = o.message.timestamp, m = w.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
      return new Intl.DateTimeFormat(a.value, {
        ...m ? {} : { year: "numeric" },
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }).format(w);
    });
    return (w, m) => (n(), s("div", {
      class: R(["message", { user: y.value, assistant: !y.value }])
    }, [
      e("div", {
        class: R(["avatar", { "user-avatar": y.value, "assistant-avatar": !y.value }])
      }, [
        y.value ? (n(), s("svg", xe, [...m[1] || (m[1] = [
          e("circle", {
            cx: "8",
            cy: "6",
            r: "3",
            stroke: "currentColor",
            "stroke-width": "1.5"
          }, null, -1),
          e("path", {
            d: "M3 14C3 11.5 5.5 10 8 10C10.5 10 13 11.5 13 14",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          }, null, -1)
        ])])) : (n(), s("svg", Me, [...m[2] || (m[2] = [
          e("circle", {
            cx: "8",
            cy: "8",
            r: "6",
            stroke: "currentColor",
            "stroke-width": "1.5"
          }, null, -1),
          e("circle", {
            cx: "6",
            cy: "7",
            r: "1",
            fill: "currentColor"
          }, null, -1),
          e("circle", {
            cx: "10",
            cy: "7",
            r: "1",
            fill: "currentColor"
          }, null, -1),
          e("path", {
            d: "M6 10C6.5 10.5 7.2 11 8 11C8.8 11 9.5 10.5 10 10",
            stroke: "currentColor",
            "stroke-width": "1",
            "stroke-linecap": "round"
          }, null, -1)
        ])]))
      ], 2),
      e("div", Se, [
        g.message.images?.length ? (n(), s("div", Ie, [
          (n(!0), s(B, null, N(g.message.images, (C, k) => (n(), s("img", {
            key: k,
            src: C,
            alt: "",
            class: "msg-img"
          }, null, 8, Be))), 128))
        ])) : $("", !0),
        g.message.files?.length ? (n(), s("div", Le, [
          (n(!0), s(B, null, N(g.message.files, (C, k) => (n(), s("a", {
            key: k,
            href: C.url,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "msg-file",
            title: C.mime || ""
          }, [
            e("span", Pe, d(C.name), 1)
          ], 8, Te))), 128))
        ])) : $("", !0),
        g.message.content ? (n(), s("div", {
          key: 2,
          class: R(["content", { "content-markdown": !y.value && !g.streaming }])
        }, [
          !y.value && !g.streaming ? (n(), U(t(ke), {
            key: 0,
            content: g.message.content
          }, null, 8, ["content"])) : (n(), s(B, { key: 1 }, [
            ee(d(g.message.content), 1)
          ], 64))
        ], 2)) : $("", !0),
        !y.value && _.value ? (n(), s("div", De, [
          e("button", {
            class: "think-toggle",
            type: "button",
            "aria-expanded": f.value,
            onClick: m[0] || (m[0] = (C) => f.value = !f.value)
          }, [
            e("span", null, d(t(x)("chat.thinkLabel")), 1),
            e("span", null, d(f.value ? t(x)("chat.thinkCollapse") : t(x)("chat.thinkExpand")), 1)
          ], 8, Fe),
          e("div", {
            class: R(["collapse-grid", { open: f.value }])
          }, [
            e("div", null, [
              e("div", Ee, [
                _.value.raw ? (n(), s("pre", Oe, d(_.value.raw), 1)) : _.value.summary ? (n(), s("p", Ne, d(_.value.summary), 1)) : $("", !0)
              ])
            ])
          ], 2)
        ])) : $("", !0),
        e("div", Re, [
          e("span", ze, d(L.value), 1),
          !y.value && g.message.emotion ? (n(), s(B, { key: 0 }, [
            m[3] || (m[3] = e("span", { class: "separator" }, "·", -1)),
            e("span", {
              class: "emotion",
              style: V({ color: t($e)(t(ae)(g.message.emotion)) })
            }, d(t(x)(`emotion.${t(ae)(g.message.emotion)}`)), 5)
          ], 64)) : $("", !0)
        ])
      ])
    ], 2));
  }
}), Ae = /* @__PURE__ */ G(Ke, [["__scopeId", "data-v-e199848c"]]), He = { class: "chat-panel" }, Ue = {
  class: "messages",
  role: "log",
  "aria-live": "polite",
  "aria-relevant": "additions text"
}, Ve = {
  key: 0,
  class: "empty-state"
}, je = {
  key: 1,
  class: "typing-indicator"
}, Ye = { class: "typing-text" }, We = { class: "input-area" }, Xe = {
  key: 0,
  class: "pending-images"
}, Ze = ["src"], Ge = ["aria-label", "title", "onClick"], Je = {
  key: 0,
  class: "pending-thumb uploading",
  "aria-hidden": "true"
}, qe = {
  key: 1,
  class: "pending-files"
}, Qe = ["title"], et = { class: "pending-file-name" }, tt = ["title", "onClick"], nt = { class: "input-wrapper" }, ot = ["title", "disabled"], st = ["title", "disabled"], at = ["placeholder", "disabled"], lt = ["aria-label", "title", "disabled"], it = { class: "input-footer" }, rt = {
  key: 0,
  class: "connection-status disconnected"
}, ct = {
  key: 1,
  class: "connection-status connected"
}, ut = { class: "hint" }, dt = ["title"], ht = ["disabled"], mt = ["disabled"], vt = 80, pt = /* @__PURE__ */ X({
  __name: "ChatPanel",
  setup(g) {
    const { t: o, locale: x } = Z(), a = de(), y = he(), { confirm: f } = _e(), _ = S(""), L = S(null), w = S(null), m = S([]), C = S(null), k = S([]), E = S(null), M = S(!1);
    function F() {
      const i = w.value;
      i && (i.style.height = "auto", i.style.height = `${Math.min(i.scrollHeight, 120)}px`);
    }
    oe(_, () => se(F));
    const h = S(!0);
    let c = !1;
    function b() {
      const i = L.value;
      i && (h.value = i.scrollHeight - i.scrollTop - i.clientHeight <= vt);
    }
    function T() {
      if (a.isTyping) return;
      const i = _.value.trim();
      if (!i && m.value.length === 0 && k.value.length === 0) return;
      const l = [...m.value], r = k.value.map((p) => ({ ...p }));
      m.value = [], k.value = [], c = !0, a.sendMessage(i, l, r), _.value = "";
    }
    function J(i) {
      if (i.key === "Enter" && !i.shiftKey) {
        if (i.isComposing || i.keyCode === 229) return;
        i.preventDefault(), T();
      }
    }
    function K() {
      C.value?.click();
    }
    async function q(i) {
      const l = i.target, r = Array.from(l.files || []);
      if (l.value = "", !!r.length) {
        M.value = !0;
        try {
          for (const p of r) {
            const O = await a.uploadImage(p);
            m.value.push(O);
          }
        } catch (p) {
          console.error("image upload failed:", p);
          const O = r.length === 1 ? r[0].name : "";
          Q(O ? o("chat.uploadFailedNamed", { name: O }) : o("chat.uploadFailed"), "error");
        } finally {
          M.value = !1;
        }
      }
    }
    function v(i) {
      m.value = m.value.filter((l) => l !== i);
    }
    function P() {
      E.value?.click();
    }
    async function u(i) {
      const l = i.target, r = Array.from(l.files || []);
      if (l.value = "", !!r.length) {
        M.value = !0;
        try {
          for (const p of r)
            k.value.push(await a.uploadFile(p));
        } catch (p) {
          console.error("file upload failed:", p);
          const O = r.length === 1 ? r[0].name : "";
          Q(O ? o("chat.uploadFailedNamed", { name: O }) : o("chat.uploadFailed"), "error");
        } finally {
          M.value = !1;
        }
      }
    }
    function z(i) {
      k.value = k.value.filter((l) => l.url !== i);
    }
    async function j(i) {
      const l = Array.from(i.clipboardData?.files || []);
      if (l.length) {
        i.preventDefault(), M.value = !0;
        try {
          for (const r of l)
            r.type.startsWith("image/") ? m.value.push(await a.uploadImage(r)) : k.value.push(await a.uploadFile(r));
        } catch (r) {
          console.error("paste upload failed:", r), Q(o("chat.uploadFailed"), "error");
        } finally {
          M.value = !1;
        }
      }
    }
    async function ve() {
      await f({
        title: o("chat.clear"),
        message: o("chat.clearConfirm"),
        confirmLabel: o("chat.clear"),
        danger: !0
      }) && a.clearMessages();
    }
    function pe() {
      const i = a.messages;
      if (!i.length) return;
      const l = y.persona.name || o("chat.defaultCharacter"), r = new Intl.DateTimeFormat(x.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }), p = [];
      p.push(`# ${o("chat.exportTitle")}`, ""), p.push(`- ${o("chat.defaultCharacter")}: ${l}`), p.push(`- ${r.format(/* @__PURE__ */ new Date())}`, "");
      for (const I of i) {
        if (!I.content && !I.images?.length && !I.files?.length) continue;
        const fe = I.role === "user" ? o("chat.you") : l;
        if (p.push(`## ${fe} · ${r.format(I.timestamp)}`), I.content && p.push("", I.content), I.images?.length) {
          p.push("");
          for (const W of I.images) p.push(`![image](${W})`);
        }
        if (I.files?.length) {
          p.push("");
          for (const W of I.files) p.push(`- [${W.name}](${W.url})`);
        }
        p.push("");
      }
      const O = new Blob([p.join(`
`)], { type: "text/markdown;charset=utf-8" }), ne = URL.createObjectURL(O), A = /* @__PURE__ */ new Date(), Y = (I) => String(I).padStart(2, "0"), H = document.createElement("a");
      H.href = ne, H.download = `0kay-chat-${A.getFullYear()}${Y(A.getMonth() + 1)}${Y(A.getDate())}-${Y(A.getHours())}${Y(A.getMinutes())}.md`, document.body.appendChild(H), H.click(), H.remove(), URL.revokeObjectURL(ne);
    }
    return te(() => {
      a.restoreHistory(), a.isConnected || a.connect();
    }), oe(
      () => a.messages.length,
      async () => {
        await se();
        const i = L.value;
        i && ((h.value || c) && (i.scrollTop = i.scrollHeight, h.value = !0), c = !1);
      }
    ), (i, l) => (n(), s("div", He, [
      e("div", {
        class: "chat-container",
        ref_key: "chatContainer",
        ref: L,
        onScroll: b
      }, [
        e("div", Ue, [
          t(a).messages.length === 0 ? (n(), s("div", Ve, [
            l[3] || (l[3] = ce('<div class="empty-icon" data-v-8f0db4ce><svg width="64" height="64" viewBox="0 0 64 64" fill="none" data-v-8f0db4ce><circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" data-v-8f0db4ce></circle><circle cx="32" cy="28" r="8" stroke="currentColor" stroke-width="2" data-v-8f0db4ce></circle><path d="M20 44C20 38 26 34 32 34C38 34 44 38 44 44" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-8f0db4ce></path></svg></div>', 1)),
            e("h3", null, d(t(o)("chat.empty")), 1),
            e("p", null, d(t(o)("chat.emptyHint", { name: t(y).persona.name || t(o)("chat.defaultCharacter") })), 1)
          ])) : $("", !0),
          (n(!0), s(B, null, N(t(a).messages, (r, p) => (n(), U(Ae, {
            key: r.id,
            message: r,
            streaming: t(a).isTyping && p === t(a).messages.length - 1
          }, null, 8, ["message", "streaming"]))), 128)),
          t(a).isTyping ? (n(), s("div", je, [
            l[4] || (l[4] = e("div", { class: "typing-dots" }, [
              e("span"),
              e("span"),
              e("span")
            ], -1)),
            e("span", Ye, d(t(y).persona.name || "AI") + " " + d(t(o)("chat.thinking")), 1)
          ])) : $("", !0)
        ])
      ], 544),
      e("div", We, [
        m.value.length || M.value ? (n(), s("div", Xe, [
          (n(!0), s(B, null, N(m.value, (r) => (n(), s("div", {
            key: r,
            class: "pending-thumb"
          }, [
            e("img", {
              src: r,
              alt: ""
            }, null, 8, Ze),
            e("button", {
              class: "remove-img",
              type: "button",
              "aria-label": t(o)("chat.removeImage"),
              title: t(o)("chat.removeImage"),
              onClick: (p) => v(r)
            }, " × ", 8, Ge)
          ]))), 128)),
          M.value ? (n(), s("div", Je, [...l[5] || (l[5] = [
            e("span", { class: "upload-spinner" }, null, -1)
          ])])) : $("", !0)
        ])) : $("", !0),
        k.value.length ? (n(), s("div", qe, [
          (n(!0), s(B, null, N(k.value, (r) => (n(), s("span", {
            key: r.url,
            class: "pending-file",
            title: `${r.mime || ""} · ${r.size || 0} B`
          }, [
            e("span", et, d(r.name), 1),
            e("button", {
              class: "remove-file",
              type: "button",
              title: t(o)("chat.removeFile"),
              onClick: (p) => z(r.url)
            }, " × ", 8, tt)
          ], 8, Qe))), 128))
        ])) : $("", !0),
        e("div", nt, [
          e("input", {
            ref_key: "imageInput",
            ref: C,
            type: "file",
            accept: "image/png,image/jpeg,image/gif,image/webp",
            multiple: "",
            hidden: "",
            onChange: q
          }, null, 544),
          e("input", {
            ref_key: "fileInput",
            ref: E,
            type: "file",
            multiple: "",
            hidden: "",
            onChange: u
          }, null, 544),
          e("button", {
            class: "attach-btn",
            type: "button",
            title: t(o)("chat.attachImage"),
            disabled: M.value || !t(a).isConnected,
            onClick: K
          }, [...l[6] || (l[6] = [
            e("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              e("rect", {
                x: "3",
                y: "5",
                width: "18",
                height: "14",
                rx: "2",
                stroke: "currentColor",
                "stroke-width": "2"
              }),
              e("circle", {
                cx: "9",
                cy: "10",
                r: "1.5",
                fill: "currentColor"
              }),
              e("path", {
                d: "M4 17l5-5 4 4 3-3 4 4",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, ot),
          e("button", {
            class: "attach-btn",
            type: "button",
            title: t(o)("chat.attachFile"),
            disabled: M.value || !t(a).isConnected,
            onClick: P
          }, [...l[7] || (l[7] = [
            e("svg", {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              e("path", {
                d: "M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, st),
          ge(e("textarea", {
            ref_key: "messageInput",
            ref: w,
            "onUpdate:modelValue": l[0] || (l[0] = (r) => _.value = r),
            class: "message-input",
            placeholder: t(o)("chat.inputPlaceholder"),
            rows: "1",
            onKeydown: J,
            onPaste: j,
            disabled: !t(a).isConnected
          }, null, 40, at), [
            [ye, _.value]
          ]),
          e("button", {
            class: "send-button",
            "aria-label": t(o)("chat.send"),
            title: t(o)("chat.send"),
            onClick: T,
            disabled: !_.value.trim() && !m.value.length && !k.value.length || !t(a).isConnected || t(a).isTyping
          }, [...l[8] || (l[8] = [
            e("svg", {
              width: "20",
              height: "20",
              viewBox: "0 0 20 20",
              fill: "none"
            }, [
              e("path", {
                d: "M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, lt)
        ]),
        e("div", it, [
          t(a).isConnected ? (n(), s("span", ct, [
            l[10] || (l[10] = e("span", { class: "status-dot" }, null, -1)),
            ee(" " + d(t(o)("chat.connected")), 1)
          ])) : (n(), s("span", rt, [
            l[9] || (l[9] = e("span", { class: "status-dot" }, null, -1)),
            ee(" " + d(t(o)("chat.disconnected")), 1)
          ])),
          e("span", ut, d(t(o)("chat.contextHint", { n: t(a).contextTokens.toLocaleString() })), 1),
          e("button", {
            class: R(["context-btn", { active: t(a).voiceEnabled }]),
            type: "button",
            title: t(a).voiceEnabled ? t(o)("chat.voiceOnTitle") : t(o)("chat.voiceOffTitle"),
            onClick: l[1] || (l[1] = (r) => t(a).setVoiceEnabled(!t(a).voiceEnabled))
          }, d(t(a).voiceEnabled ? t(o)("chat.voiceOn") : t(o)("chat.voiceOff")), 11, dt),
          e("button", {
            class: "context-btn",
            type: "button",
            disabled: t(a).messages.length === 0,
            onClick: pe
          }, d(t(o)("chat.download")), 9, ht),
          e("button", {
            class: "context-btn",
            type: "button",
            disabled: t(a).compacting,
            onClick: l[2] || (l[2] = //@ts-ignore
            (...r) => t(a).compactContext && t(a).compactContext(...r))
          }, d(t(a).compacting ? t(o)("chat.compacting") : t(o)("chat.compact")), 9, mt),
          e("button", {
            class: "context-btn danger",
            type: "button",
            onClick: ve
          }, d(t(o)("chat.clear")), 1)
        ])
      ])
    ]));
  }
}), ft = /* @__PURE__ */ G(pt, [["__scopeId", "data-v-8f0db4ce"]]), gt = { class: "status-panel" }, yt = { class: "panel-header" }, kt = {
  key: 0,
  class: "patch-badge"
}, _t = { class: "panel-content" }, wt = { class: "section character-profile" }, bt = { class: "section-header" }, Ct = { class: "section-title" }, $t = ["datetime"], xt = ["data-section", "data-kind"], Mt = { class: "section-header" }, St = { class: "section-title" }, It = {
  key: 0,
  class: "mood-display"
}, Bt = {
  key: 0,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Lt = {
  key: 1,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Tt = {
  key: 2,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Pt = {
  key: 3,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Dt = {
  key: 4,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Ft = {
  key: 1,
  class: "emotion-bars"
}, Et = { class: "emotion-label" }, Ot = { class: "emotion-bar" }, Nt = {
  key: 0,
  class: "empty-tasks"
}, Rt = /* @__PURE__ */ X({
  __name: "StatusPanel",
  setup(g) {
    const { t: o } = Z(), x = we(), a = me(), y = he(), f = S(/* @__PURE__ */ new Date()), _ = D(() => {
      const h = y.persona.birthDate;
      if (!h) return null;
      const c = /* @__PURE__ */ new Date(`${h}T00:00:00`);
      if (Number.isNaN(c.getTime()) || c > f.value) return null;
      const b = f.value;
      return b.getFullYear() - c.getFullYear() - +(b.getMonth() < c.getMonth() || b.getMonth() === c.getMonth() && b.getDate() < c.getDate());
    });
    let L = null;
    function w(h) {
      if (!h || !h.startsWith("life.")) return;
      const c = h.slice(5).split(".").reduce((b, T) => b?.[T], x);
      return typeof c == "function" ? void 0 : c;
    }
    function m(h) {
      if (h.titleKey) {
        const c = o(h.titleKey);
        if (c && c !== h.titleKey) return c;
      }
      return h.title || h.id;
    }
    function C(h) {
      if (h.labelKey) {
        const c = o(h.labelKey);
        if (c && c !== h.labelKey) return c;
      }
      return h.label || h.key;
    }
    function k(h) {
      const c = Number(w(`life.emotion.${h.key}`) ?? 0);
      return h.scale === "remap01" ? (c + 1) / 2 : c;
    }
    te(() => {
      L = setInterval(() => {
        f.value = /* @__PURE__ */ new Date();
      }, 1e3);
    }), ue(() => {
      L && clearInterval(L);
    });
    const E = D(
      () => a.statusSections.filter((h) => h.kind === "mood" || h.kind === "bars")
    ), M = D(() => x.emotionColor), F = D(() => x.emotionMood);
    return (h, c) => (n(), s("div", gt, [
      e("div", yt, [
        e("h2", null, d(t(o)("status.title")), 1),
        t(a).loaded ? (n(), s("span", kt, "patch")) : $("", !0)
      ]),
      e("div", _t, [
        e("section", wt, [
          e("div", bt, [
            e("span", Ct, d(t(y).persona.name || t(o)("chat.defaultCharacter")), 1)
          ]),
          e("dl", null, [
            e("div", null, [
              e("dt", null, d(t(o)("status.age")), 1),
              e("dd", null, d(_.value === null ? t(o)("status.birthdayUnset") : t(o)("status.ageValue", { age: _.value })), 1)
            ]),
            e("div", null, [
              e("dt", null, d(t(o)("status.time")), 1),
              e("dd", null, [
                e("time", {
                  datetime: f.value.toISOString()
                }, d(f.value.toLocaleString()), 9, $t)
              ])
            ]),
            e("div", null, [
              e("dt", null, d(t(o)("status.timezone")), 1),
              e("dd", null, d(Intl.DateTimeFormat().resolvedOptions().timeZone), 1)
            ])
          ])
        ]),
        (n(!0), s(B, null, N(E.value, (b) => (n(), s("div", {
          key: b.id,
          class: "section",
          "data-section": b.id,
          "data-kind": b.kind
        }, [
          e("div", Mt, [
            e("span", St, d(m(b)), 1)
          ]),
          b.kind === "mood" ? (n(), s("div", It, [
            e("div", {
              class: "mood-icon",
              style: V({ color: M.value })
            }, [
              F.value === "happy" ? (n(), s("svg", Bt, [...c[0] || (c[0] = [
                e("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                e("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                e("path", {
                  d: "M14 30C17 34 31 34 34 30",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : F.value === "sad" ? (n(), s("svg", Lt, [...c[1] || (c[1] = [
                e("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                e("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                e("path", {
                  d: "M16 34C19 30 29 30 32 34",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : F.value === "irritated" ? (n(), s("svg", Tt, [...c[2] || (c[2] = [
                e("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("line", {
                  x1: "14",
                  y1: "18",
                  x2: "20",
                  y2: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("line", {
                  x1: "34",
                  y1: "18",
                  x2: "28",
                  y2: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("path", {
                  d: "M16 34C19 30 29 30 32 34",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])])) : F.value === "sleeping" ? (n(), s("svg", Pt, [...c[3] || (c[3] = [
                ce('<circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" data-v-45331204></circle><path d="M16 22C17 22 18 22 18 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><path d="M30 22C31 22 32 22 32 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><path d="M18 32C20 34 28 34 30 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-45331204></path><text x="36" y="12" fill="currentColor" font-size="12" font-weight="bold" data-v-45331204>Z</text>', 5)
              ])])) : (n(), s("svg", Dt, [...c[4] || (c[4] = [
                e("circle", {
                  cx: "24",
                  cy: "24",
                  r: "20",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, null, -1),
                e("circle", {
                  cx: "16",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                e("circle", {
                  cx: "32",
                  cy: "20",
                  r: "2",
                  fill: "currentColor"
                }, null, -1),
                e("path", {
                  d: "M18 30H30",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                }, null, -1)
              ])]))
            ], 4),
            e("div", {
              class: "mood-label",
              style: V({ color: M.value })
            }, d(t(o)(`emotion.${F.value}`)), 5)
          ])) : b.kind === "bars" ? (n(), s("div", Ft, [
            (n(!0), s(B, null, N(b.axes || [], (T) => (n(), s("div", {
              key: T.key,
              class: "emotion-row"
            }, [
              e("span", Et, d(C(T)), 1),
              e("div", Ot, [
                e("div", {
                  class: "emotion-fill",
                  style: V({
                    transform: `scaleX(${Math.max(0, Math.min(1, k(T)))})`,
                    backgroundColor: T.color || "#0078d4"
                  })
                }, null, 4)
              ])
            ]))), 128))
          ])) : $("", !0)
        ], 8, xt))), 128)),
        t(a).statusSections.length === 0 ? (n(), s("div", Nt, " No status sections (load life.patch) ")) : $("", !0)
      ])
    ]));
  }
}), zt = /* @__PURE__ */ G(Rt, [["__scopeId", "data-v-45331204"]]), Kt = {
  key: 0,
  class: "stage-column"
}, At = ["src", "title"], Ht = ["data-chat-slot"], Ut = ["aria-label", "title"], Vt = ["src", "title"], jt = ["data-chat-slot"], Yt = ["title"], le = "0kay.web.chat_panel_width_ratio", ie = 320, Wt = 360, re = 960, Xt = /* @__PURE__ */ X({
  __name: "ChatPage",
  setup(g) {
    const { t: o } = Z(), x = me(), a = de(), y = S(!1), f = S(!1), _ = D(() => x.chatRegion("stage")), L = D(() => x.chatRegion("chat")), w = D(() => _.value.some((v) => v.component === "status")), m = D(() => L.value.some((v) => v.component === "chat")), C = S(0.34), k = S(null);
    let E = !1;
    function M() {
      try {
        const v = Number(localStorage.getItem(le));
        v > 0 && v < 1 && (C.value = v);
      } catch {
      }
    }
    function F(v) {
      C.value = v;
      try {
        localStorage.setItem(le, String(v));
      } catch {
      }
    }
    function h(v, P) {
      const u = Math.min(ie, v * 0.3), z = Math.min(re, v - Wt);
      return Math.min(Math.max(P, u), z) / v;
    }
    function c(v) {
      f.value || (E = !0, v.target.setPointerCapture?.(v.pointerId), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none");
    }
    function b(v) {
      if (!E || !k.value) return;
      const P = k.value.getBoundingClientRect(), u = P.right - v.clientX;
      F(h(P.width, u));
    }
    function T() {
      E && (E = !1, document.body.style.cursor = "", document.body.style.userSelect = "");
    }
    function J(v) {
      if (f.value || v.key !== "ArrowLeft" && v.key !== "ArrowRight") return;
      const P = k.value;
      if (!P) return;
      v.preventDefault();
      const u = P.getBoundingClientRect(), z = C.value * u.width, j = v.key === "ArrowLeft" ? z + 24 : z - 24;
      F(h(u.width, j));
    }
    function K() {
      const v = f.value;
      f.value = window.innerWidth <= 960, f.value ? v || (y.value = !1) : y.value = !0;
    }
    te(() => {
      M(), K(), a.setChatVisible(!0), window.addEventListener("resize", K), window.addEventListener("pointermove", b), window.addEventListener("pointerup", T);
    }), ue(() => {
      a.setChatVisible(!1), window.removeEventListener("resize", K), window.removeEventListener("pointermove", b), window.removeEventListener("pointerup", T), document.body.style.cursor = "", document.body.style.userSelect = "";
    });
    function q() {
      y.value = !y.value;
    }
    return (v, P) => (n(), s("div", {
      ref_key: "pageEl",
      ref: k,
      class: R(["chat-page", { "no-chat": !m.value }]),
      style: V(f.value ? void 0 : { "--chat-w": `min(${re}px, max(${ie}px, ${C.value * 100}%))` })
    }, [
      _.value.length ? (n(), s("div", Kt, [
        (n(!0), s(B, null, N(_.value, (u) => (n(), s(B, {
          key: u.id
        }, [
          u.component === "live2d" ? (n(), U(be, {
            key: 0,
            class: "stage-host"
          })) : u.component === "status" ? (n(), U(zt, {
            key: 1,
            class: "status-panel"
          })) : u.component === "iframe" && u.src ? (n(), s("iframe", {
            key: 2,
            class: "slot-frame",
            src: u.src,
            title: u.title || u.id
          }, null, 8, At)) : (n(), s("div", {
            key: 3,
            class: "slot-note",
            "data-chat-slot": u.id
          }, d(u.titleKey ? t(o)(u.titleKey) : u.title || u.id), 9, Ht))
        ], 64))), 128))
      ])) : $("", !0),
      !f.value && m.value && _.value.length ? (n(), s("div", {
        key: 1,
        ref: "resizer",
        class: "page-resizer",
        role: "separator",
        "aria-orientation": "vertical",
        tabindex: "0",
        "aria-label": t(o)("chat.resizePanel"),
        title: t(o)("chat.resizePanel"),
        onPointerdown: c,
        onKeydown: J
      }, null, 40, Ut)) : $("", !0),
      m.value ? (n(), s("div", {
        key: 2,
        class: R(["chat-column", { open: y.value || !f.value }])
      }, [
        (n(!0), s(B, null, N(L.value, (u) => (n(), s(B, {
          key: u.id
        }, [
          u.component === "chat" ? (n(), U(ft, { key: 0 })) : u.component === "iframe" && u.src ? (n(), s("iframe", {
            key: 1,
            class: "slot-frame fill",
            src: u.src,
            title: u.title || u.id
          }, null, 8, Vt)) : (n(), s("div", {
            key: 2,
            class: "slot-note",
            "data-chat-slot": u.id
          }, d(u.titleKey ? t(o)(u.titleKey) : u.title || u.id), 9, jt))
        ], 64))), 128))
      ], 2)) : $("", !0),
      f.value && w.value ? (n(), s("button", {
        key: 3,
        class: "status-fab",
        title: t(o)("app.status"),
        onClick: q
      }, [...P[0] || (P[0] = [
        e("svg", {
          width: "22",
          height: "22",
          viewBox: "0 0 24 24",
          fill: "none"
        }, [
          e("circle", {
            cx: "12",
            cy: "12",
            r: "9",
            stroke: "currentColor",
            "stroke-width": "2"
          }),
          e("circle", {
            cx: "12",
            cy: "12",
            r: "3",
            fill: "currentColor"
          })
        ], -1)
      ])], 8, Yt)) : $("", !0)
    ], 6));
  }
}), tn = /* @__PURE__ */ G(Xt, [["__scopeId", "data-v-599f785f"]]);
export {
  tn as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent="@property --mood{syntax: \"<color>\"; inherits: true; initial-value: #6750A4;}.live2d-stage[data-v-232ecf34]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-232ecf34]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:pan-y;cursor:grab;user-select:none;transition:--mood var(--duration-long, .36s) var(--ease-out, ease-out);background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,var(--md-surface-container-low) 0%,var(--md-surface-container) 55%,color-mix(in srgb,var(--md-primary) 20%,transparent) 100%)}.stage-viewport[data-v-232ecf34]:active{cursor:grabbing}.stage-canvas[data-v-232ecf34]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-232ecf34]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-232ecf34]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-232ecf34]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-232ecf34]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-232ecf34]:active{transform:scale(.96)}.stage-reset.dragging[data-v-232ecf34]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-232ecf34]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-232ecf34]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-232ecf34]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-e199848c]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-e199848c]{flex-direction:row-reverse}.avatar[data-v-e199848c]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-e199848c]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-e199848c]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-e199848c]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-e199848c]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-e199848c]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-e199848c]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden}.msg-file-name[data-v-e199848c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-e199848c]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-e199848c]{max-width:70%}.content[data-v-e199848c]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.content-markdown[data-v-e199848c]{white-space:normal}.user .content[data-v-e199848c]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-e199848c]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-e199848c]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-e199848c]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-e199848c]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-e199848c]{margin:4px 0}.think-body b[data-v-e199848c]{color:var(--md-on-surface)}.think-summary[data-v-e199848c]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-e199848c]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-e199848c]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-e199848c]{justify-content:flex-end}.separator[data-v-e199848c]{color:var(--neutral-gray-10)}.emotion[data-v-e199848c]{font-weight:500}.chat-panel[data-v-8f0db4ce]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-8f0db4ce]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-8f0db4ce]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-8f0db4ce]{color:var(--md-error)}.chat-container[data-v-8f0db4ce]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-8f0db4ce]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-8f0db4ce]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-8f0db4ce]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-8f0db4ce]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-8f0db4ce]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-8f0db4ce]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-8f0db4ce]{display:flex;gap:4px}.typing-dots span[data-v-8f0db4ce]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-8f0db4ce 1.4s infinite ease-in-out}.typing-dots span[data-v-8f0db4ce]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-8f0db4ce]:nth-child(2){animation-delay:-.16s}@keyframes bounce-8f0db4ce{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-8f0db4ce]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-8f0db4ce]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-8f0db4ce]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-8f0db4ce]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-8f0db4ce]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-8f0db4ce],.pending-files[data-v-8f0db4ce]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-8f0db4ce]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden}.pending-file-name[data-v-8f0db4ce]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-8f0db4ce]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-8f0db4ce]:hover{color:var(--error)}.pending-thumb[data-v-8f0db4ce]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-8f0db4ce]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-8f0db4ce]{position:absolute;top:2px;right:2px;width:22px;height:22px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.pending-thumb.uploading[data-v-8f0db4ce]{display:flex;align-items:center;justify-content:center;background:var(--md-surface-container-high);animation:thumb-shimmer-8f0db4ce 1.2s infinite}.upload-spinner[data-v-8f0db4ce]{width:18px;height:18px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:upload-spin-8f0db4ce .8s linear infinite}@keyframes upload-spin-8f0db4ce{to{transform:rotate(360deg)}}@keyframes thumb-shimmer-8f0db4ce{0%,to{opacity:1}50%{opacity:.55}}@media(prefers-reduced-motion:reduce){.pending-thumb.uploading[data-v-8f0db4ce]{animation:none}}.attach-btn[data-v-8f0db4ce]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-8f0db4ce]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-8f0db4ce]:disabled{opacity:.5;cursor:not-allowed}.send-button[data-v-8f0db4ce]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-8f0db4ce]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-8f0db4ce]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-8f0db4ce]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-8f0db4ce]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-8f0db4ce]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-8f0db4ce]{background:var(--success)}.disconnected .status-dot[data-v-8f0db4ce]{background:var(--error)}.hint[data-v-8f0db4ce]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-45331204]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-45331204]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-45331204]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-45331204]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-45331204]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-45331204]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-45331204]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-45331204]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-45331204]{margin-bottom:var(--space-xl)}.section-header[data-v-45331204]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-45331204]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.mood-display[data-v-45331204]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-45331204]{margin-bottom:var(--space-md)}.mood-label[data-v-45331204]{font-size:var(--font-size-md);font-weight:600}.emotion-bars[data-v-45331204]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-45331204]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-45331204]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-45331204]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-45331204]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-45331204]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.chat-page[data-v-599f785f]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-599f785f]{grid-template-columns:1fr}.stage-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-599f785f]{flex:1;min-height:240px}.status-panel[data-v-599f785f]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-599f785f]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-599f785f]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-599f785f]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-599f785f]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-599f785f]:hover,.page-resizer[data-v-599f785f]:active{background:var(--md-primary)}.chat-column[data-v-599f785f]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-599f785f]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-599f785f]{display:flex;flex-direction:column}.stage-column[data-v-599f785f]{flex:1;min-height:0}.page-resizer[data-v-599f785f]{display:none}.chat-column[data-v-599f785f]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);visibility:hidden;transition:transform var(--transition-normal),visibility 0s linear var(--duration-medium)}.chat-column.open[data-v-599f785f]{transform:translate(0);visibility:visible;transition:transform var(--transition-normal),visibility 0s linear 0s}}.console[data-v-940c88b5]{display:flex;flex-direction:column;min-height:0;height:100%;background:var(--md-surface);color:var(--md-on-surface)}.pane-enter-active[data-v-940c88b5]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel)}.pane-leave-active[data-v-940c88b5]{transition:opacity var(--duration-instant) var(--ease-emphasized-accel)}.pane-enter-from[data-v-940c88b5],.pane-leave-to[data-v-940c88b5]{opacity:0}@media(prefers-reduced-motion:reduce){.pane-enter-active[data-v-940c88b5],.pane-leave-active[data-v-940c88b5]{transition-duration:1ms}}.console-bar[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:flex-end;gap:var(--space-md);padding:var(--space-md) var(--space-lg);border-bottom:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.tabs[data-v-940c88b5]{display:flex;gap:var(--space-xs)}.tab[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:0 14px;border:0;border-radius:var(--radius-full);background:transparent;color:var(--md-on-surface-variant);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}.tab[data-v-940c88b5]:hover{background:color-mix(in srgb,var(--md-on-surface) 7%,transparent)}.tab.active[data-v-940c88b5]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tab[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.tab-badge[data-v-940c88b5]{min-width:18px;padding:0 5px;border-radius:var(--radius-full);background:var(--md-error-container);color:var(--md-on-error-container);font-size:11px;font-weight:700;text-align:center}.controls[data-v-940c88b5]{display:flex;flex:1;flex-wrap:wrap;align-items:flex-end;gap:var(--space-sm)}.field[data-v-940c88b5]{display:flex;flex-direction:column;gap:2px}.field.grow[data-v-940c88b5]{flex:1;min-width:180px}.field-label[data-v-940c88b5]{font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant)}.input[data-v-940c88b5]{min-height:34px;padding:0 10px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-sm);background:var(--md-surface-container-lowest);color:inherit;font:inherit;font-size:13px}.input[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:1px}.check[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap}.btn[data-v-940c88b5]{min-height:34px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:background var(--transition-fast)}.btn[data-v-940c88b5]:hover:not(:disabled){background:var(--md-surface-container-high)}.btn[data-v-940c88b5]:disabled{opacity:.5;cursor:default}.btn[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.status[data-v-940c88b5]{display:inline-flex;align-items:center;gap:6px;min-height:34px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);white-space:nowrap}.status .dot[data-v-940c88b5]{width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.status.live .dot[data-v-940c88b5]{background:var(--md-success);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-success) 22%,transparent)}.status.dead .dot[data-v-940c88b5]{background:var(--md-error)}.banner[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-sm);margin:0;padding:var(--space-sm) var(--space-lg);background:var(--md-error-container);color:var(--md-on-error-container);font-size:13px}.banner code[data-v-940c88b5]{flex:1;min-width:0;overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.pane[data-v-940c88b5]{flex:1;min-height:0;overflow:auto}.empty[data-v-940c88b5]{padding:var(--space-xl);color:var(--md-on-surface-variant);font-size:13px}.rows[data-v-940c88b5]{margin:0;padding:0;list-style:none;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,monospace;font-size:12px;line-height:1.55}.row[data-v-940c88b5]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;padding:3px var(--space-lg);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}.row[data-v-940c88b5]:hover{background:color-mix(in srgb,var(--md-on-surface) 4%,transparent)}.row[data-v-940c88b5]:before{content:\"\";width:3px;align-self:stretch;margin:1px 0;border-radius:2px;background:var(--md-outline)}.row.debug[data-v-940c88b5]:before{background:var(--md-outline)}.row.info[data-v-940c88b5]:before{background:var(--md-primary)}.row.warn[data-v-940c88b5]:before{background:var(--md-warning)}.row.error[data-v-940c88b5]:before{background:var(--md-error)}.row.ok[data-v-940c88b5]:before{background:var(--md-success)}.ts[data-v-940c88b5]{color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.lvl[data-v-940c88b5]{min-width:46px;font-weight:700;color:var(--md-on-surface-variant);white-space:nowrap}.row.warn .lvl[data-v-940c88b5]{color:var(--md-warning)}.row.error .lvl[data-v-940c88b5]{color:var(--md-error)}.component[data-v-940c88b5]{min-width:96px;padding:0 6px;border-radius:var(--radius-sm);background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.msg[data-v-940c88b5]{flex:1;min-width:200px;word-break:break-word}.kv[data-v-940c88b5]{color:var(--md-on-surface-variant);white-space:nowrap}.kv .k[data-v-940c88b5]{opacity:.7}.kv .v[data-v-940c88b5]{color:var(--md-on-surface)}.err[data-v-940c88b5]{color:var(--md-error)}.event[data-v-940c88b5]{padding:0 6px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-full);color:var(--md-on-surface-variant);font-size:11px;white-space:nowrap}.dur[data-v-940c88b5]{margin-left:auto;color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums;white-space:nowrap}.indent[data-v-940c88b5]{flex:none}.link[data-v-940c88b5]{padding:0;border:0;background:none;color:var(--md-primary);font:inherit;font-size:11px;cursor:pointer;text-decoration:underline dotted}.link[data-v-940c88b5]:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}@media(max-width:720px){.console-bar[data-v-940c88b5]{align-items:stretch}.controls[data-v-940c88b5]{flex-direction:column;align-items:stretch}.component[data-v-940c88b5],.lvl[data-v-940c88b5]{min-width:0}}#app .console[data-v-940c88b5] :is(.tab,.btn){min-height:34px;border-radius:var(--radius-full)}#app .console .input[data-v-940c88b5]{min-height:34px;border-radius:var(--radius-sm)}.plugins-page[data-v-c650ea92]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-c650ea92]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-c650ea92]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-c650ea92],.pp-hero h1[data-v-c650ea92]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-c650ea92]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-c650ea92]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-c650ea92]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.banner-enter-active[data-v-c650ea92]{transition:opacity var(--duration-medium) var(--ease-emphasized-decel),transform var(--duration-medium) var(--ease-emphasized-decel)}.banner-leave-active[data-v-c650ea92]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.banner-enter-from[data-v-c650ea92],.banner-leave-to[data-v-c650ea92]{opacity:0;transform:translateY(-6px)}.pp-stats[data-v-c650ea92]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-c650ea92]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-c650ea92]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-c650ea92]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-c650ea92]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-c650ea92]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-c650ea92]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-c650ea92]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-c650ea92]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-c650ea92 var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-c650ea92{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-c650ea92]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-c650ea92]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-c650ea92]{opacity:.62}.plugin-top[data-v-c650ea92]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-c650ea92]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-c650ea92]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-c650ea92]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-c650ea92]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-c650ea92]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-c650ea92]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-c650ea92]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-c650ea92]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-c650ea92]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-c650ea92]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-c650ea92]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-c650ea92]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-c650ea92]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-c650ea92]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-c650ea92]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-c650ea92]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-c650ea92]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-c650ea92]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-c650ea92]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-c650ea92]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-c650ea92]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-c650ea92]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-c650ea92]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-c650ea92]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-c650ea92]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-c650ea92]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-c650ea92]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-c650ea92]{white-space:nowrap}#app .plugins-page .btn[data-v-c650ea92]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-c650ea92]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-c650ea92]:disabled{opacity:.6;cursor:not-allowed}.empty-state[data-v-c650ea92]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-c650ea92]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-c650ea92]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-c650ea92]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-c650ea92]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-c650ea92]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-c650ea92]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-c650ea92],.pd-leave-to[data-v-c650ea92]{opacity:0}.pd-enter-active .pd-dialog[data-v-c650ea92]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-c650ea92]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-c650ea92],.pd-leave-to .pd-dialog[data-v-c650ea92]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-c650ea92]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-c650ea92]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-c650ea92]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-c650ea92]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-c650ea92]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-c650ea92]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-c650ea92]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-c650ea92]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-c650ea92]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-c650ea92]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-c650ea92]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-c650ea92]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-c650ea92]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-c650ea92]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-c650ea92]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-c650ea92]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-c650ea92]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-c650ea92]{color:var(--md-error)}.pd-foot[data-v-c650ea92]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-c650ea92]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn[data-v-c650ea92]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-c650ea92],.pd-leave-active[data-v-c650ea92],.pd-enter-active .pd-dialog[data-v-c650ea92],.pd-leave-active .pd-dialog[data-v-c650ea92]{transition:none}.pd-enter-from .pd-dialog[data-v-c650ea92],.pd-leave-to .pd-dialog[data-v-c650ea92]{transform:none}}.life-settings[data-v-40f1c023]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-40f1c023]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-40f1c023 .52s var(--ls-spring) both}.ls-hero-main[data-v-40f1c023]{min-width:0}.ls-eyebrow[data-v-40f1c023]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-40f1c023]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-40f1c023]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-40f1c023]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-40f1c023]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-40f1c023]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-40f1c023]{font-size:16px}.ls-grid[data-v-40f1c023]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-40f1c023]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-40f1c023 .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-40f1c023]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-40f1c023]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-40f1c023]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-40f1c023]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-40f1c023]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-40f1c023]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-40f1c023]{grid-column:1 / -1}.ls-card-head[data-v-40f1c023]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-40f1c023]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-40f1c023]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-40f1c023]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-40f1c023]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-40f1c023]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-40f1c023]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-40f1c023]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-40f1c023]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-40f1c023]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-40f1c023]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-40f1c023]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-40f1c023]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-40f1c023]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-40f1c023]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-40f1c023]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-40f1c023]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-40f1c023]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-40f1c023]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-40f1c023]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-40f1c023]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-40f1c023]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-40f1c023]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-40f1c023]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-40f1c023]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-40f1c023]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-40f1c023]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-40f1c023]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-40f1c023]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-40f1c023]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-40f1c023]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-40f1c023]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-40f1c023]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-40f1c023]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}#app .ls-model[data-v-40f1c023]{border-radius:20px}#app .ls-model.selected[data-v-40f1c023]{border-radius:20px 20px 20px 8px}.ls-model b[data-v-40f1c023]{font-size:13px;word-break:break-all}.ls-model span[data-v-40f1c023]{font-size:12px;color:var(--md-on-surface-variant)}.ls-state[data-v-40f1c023]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-40f1c023 .32s var(--ls-spring) both}@keyframes ls-rise-40f1c023{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-40f1c023{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-40f1c023],.ls-row[data-v-40f1c023],.ls-models[data-v-40f1c023]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-40f1c023],.ls-card[data-v-40f1c023],.ls-state[data-v-40f1c023]{animation:none}}.about[data-v-a96ad93d]{display:flex;flex-direction:column;gap:26px}.identity[data-v-a96ad93d]{display:flex;align-items:center;gap:16px}.app-icon[data-v-a96ad93d]{flex:none;width:56px;height:56px;border-radius:16px;background:var(--md-primary);color:var(--md-on-primary);display:grid;place-items:center;font-size:20px;font-weight:750;letter-spacing:-1px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 35%,transparent)}.app-id[data-v-a96ad93d]{flex:1;min-width:0}.app-id h2[data-v-a96ad93d]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-a96ad93d]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-a96ad93d]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-a96ad93d]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-a96ad93d]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-a96ad93d]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-a96ad93d]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-a96ad93d]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.credits[data-v-a96ad93d]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-a96ad93d]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-a96ad93d]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-a96ad93d]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-a96ad93d]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-a96ad93d]{font-size:16px;font-weight:650}.person-info .role[data-v-a96ad93d]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-a96ad93d]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-a96ad93d]{margin-top:6px}.contribs[data-v-a96ad93d]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-a96ad93d]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-a96ad93d]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-a96ad93d]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-a96ad93d]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-a96ad93d]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-a96ad93d]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-a96ad93d]{margin-left:auto}.status-chip[data-v-a96ad93d]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-a96ad93d]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-a96ad93d]:hover{text-decoration:underline}.muted[data-v-a96ad93d]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-a96ad93d]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-a96ad93d]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-hero.warn[data-v-a96ad93d]{background:var(--md-warning-container);color:var(--md-on-warning-container);border-color:transparent}.us-hero.none[data-v-a96ad93d]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-a96ad93d]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-a96ad93d]{flex:1;min-width:0}.us-hero-text b[data-v-a96ad93d]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-a96ad93d]{font-size:13px;opacity:.85}.us-hero-text em[data-v-a96ad93d]{font-style:normal;font-weight:700}.us-hero-actions[data-v-a96ad93d]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-a96ad93d]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-a96ad93d]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-a96ad93d]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-a96ad93d]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-a96ad93d]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-a96ad93d]{background:var(--md-success-container);color:var(--md-on-success-container);border-color:transparent}.us-apply-banner.failed[data-v-a96ad93d]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-a96ad93d]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-a96ad93d]{font-weight:700}.us-apply-label[data-v-a96ad93d]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-a96ad93d]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-a96ad93d]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-a96ad93d]{animation:us-spin-a96ad93d .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-a96ad93d],.us-apply-banner.failed .us-spinner[data-v-a96ad93d]{display:none}.us-apply-log[data-v-a96ad93d],.us-apply-error[data-v-a96ad93d]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-a96ad93d{to{transform:rotate(360deg)}}.alert[data-v-a96ad93d]{color:var(--md-error)}.updates[data-v-95a0aad4]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-95a0aad4]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-95a0aad4]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-95a0aad4]{display:flex;align-items:center;gap:12px}.us-ico[data-v-95a0aad4]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-95a0aad4]{flex:1;min-width:0}.us-title[data-v-95a0aad4]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-95a0aad4]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-95a0aad4]{display:flex;align-items:center;gap:8px}.us-tag[data-v-95a0aad4]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-95a0aad4]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-95a0aad4]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-95a0aad4]{background:#ffdf9e;color:#4a3800}.us-source[data-v-95a0aad4]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-95a0aad4]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-95a0aad4]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-95a0aad4]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-95a0aad4]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-95a0aad4]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-95a0aad4]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-95a0aad4]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-95a0aad4]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-95a0aad4]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-95a0aad4]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-95a0aad4]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-95a0aad4]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-95a0aad4]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-95a0aad4]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-95a0aad4]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-95a0aad4]{flex:1;min-width:0}.us-hero-text b[data-v-95a0aad4]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-95a0aad4]{font-size:13px;opacity:.85}.us-hero-text em[data-v-95a0aad4]{font-style:normal;font-weight:700}.us-hero-actions[data-v-95a0aad4]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-95a0aad4]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-95a0aad4]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-95a0aad4]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-95a0aad4]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-95a0aad4]{font-weight:700}.us-apply-label[data-v-95a0aad4]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-95a0aad4]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-95a0aad4]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-95a0aad4]{animation:us-spin-95a0aad4 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-95a0aad4],.us-apply-banner.failed .us-spinner[data-v-95a0aad4]{display:none}.us-apply-log[data-v-95a0aad4],.us-apply-error[data-v-95a0aad4]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-95a0aad4{to{transform:rotate(360deg)}}.us-table[data-v-95a0aad4]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-95a0aad4]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-95a0aad4]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-95a0aad4]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-95a0aad4]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden}.us-name-text[data-v-95a0aad4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-95a0aad4]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-95a0aad4]{background:var(--md-success)}.us-dot.warn[data-v-95a0aad4]{background:#e0a800}.us-dot.bad[data-v-95a0aad4]{background:var(--md-error)}.us-ver[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-95a0aad4]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-95a0aad4]{font-weight:650}.us-ver b.good[data-v-95a0aad4]{color:var(--md-success)}.us-arrow[data-v-95a0aad4]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-95a0aad4]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden}.us-status-text[data-v-95a0aad4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-95a0aad4]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-95a0aad4]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-95a0aad4]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-95a0aad4]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-95a0aad4]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-95a0aad4]:hover{text-decoration:underline}.us-empty[data-v-95a0aad4]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-95a0aad4]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-95a0aad4]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.alert[data-v-95a0aad4]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-95a0aad4]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-95a0aad4]{display:none}.us-hero[data-v-95a0aad4]{flex-wrap:wrap}.us-hero-actions[data-v-95a0aad4]{width:100%}}.provider-panel[data-v-630e57ef]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-630e57ef]{display:flex;align-items:center;gap:14px}.pp-back[data-v-630e57ef]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-630e57ef]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-630e57ef]{flex:1;min-width:0}.pp-editor-title h2[data-v-630e57ef]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-630e57ef]{margin:3px 0 0}.pp-section[data-v-630e57ef]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-630e57ef]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-630e57ef]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-630e57ef]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-630e57ef]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-630e57ef]{margin-bottom:0}.pp-span[data-v-630e57ef]{grid-column:1 / -1}.pp-req[data-v-630e57ef]{color:var(--md-error);margin-left:2px}.pp-key[data-v-630e57ef]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-630e57ef]{flex:1}.pp-key-toggle[data-v-630e57ef]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-630e57ef]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-630e57ef]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-630e57ef]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-630e57ef]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-630e57ef]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-630e57ef]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-630e57ef]{animation:pp-pulse-630e57ef 1s ease-in-out infinite}@keyframes pp-pulse-630e57ef{50%{opacity:.15}}.pp-probe[data-v-630e57ef]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-630e57ef]{color:var(--md-success)}.pp-probe.err[data-v-630e57ef]{color:var(--md-error)}.pp-discovered[data-v-630e57ef]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-630e57ef]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-630e57ef]{flex:1;min-width:160px}.pp-mini[data-v-630e57ef]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-630e57ef]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-models[data-v-630e57ef]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-630e57ef]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-630e57ef]:first-child{border-top:0}.pp-model.off[data-v-630e57ef]{opacity:.5}.pp-model-name[data-v-630e57ef]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-630e57ef]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-630e57ef]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-630e57ef]{color:#e0a800;cursor:default}.pp-switch[data-v-630e57ef]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-630e57ef]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-630e57ef]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-630e57ef]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-630e57ef]{display:flex;gap:10px}.pp-list-head[data-v-630e57ef]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-630e57ef]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-630e57ef]{margin:3px 0 0}.pp-list-actions[data-v-630e57ef]{display:flex;gap:8px}.pp-cards[data-v-630e57ef]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-630e57ef]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-630e57ef]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-630e57ef]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-630e57ef]{opacity:.62}.pp-card-head[data-v-630e57ef]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-630e57ef]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-630e57ef]{width:26px;height:26px}.pp-card-id[data-v-630e57ef]{flex:1;min-width:0}.pp-card-id strong[data-v-630e57ef]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-630e57ef]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-630e57ef]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-630e57ef]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-630e57ef]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-630e57ef]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-630e57ef]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-630e57ef]{color:var(--md-error)}.pp-chips[data-v-630e57ef]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-630e57ef]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-630e57ef],.pp-chip.empty[data-v-630e57ef]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-630e57ef]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.pp-empty[data-v-630e57ef]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-630e57ef],.pp-cards[data-v-630e57ef]{grid-template-columns:1fr}}.pairing-panel[data-v-c18959f6]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-c18959f6]{margin:12px 0;color:var(--md-on-surface-variant)}.pairing-panel .pairing-error[data-v-c18959f6]{color:var(--md-error)}article[data-v-c18959f6]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-c18959f6]{font-size:24px;letter-spacing:4px}h4[data-v-c18959f6]{margin:18px 0 0}.pairing-list[data-v-c18959f6]{position:relative}.pair-enter-active[data-v-c18959f6],.pair-leave-active[data-v-c18959f6]{transition:opacity var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out)}.pair-enter-from[data-v-c18959f6],.pair-leave-to[data-v-c18959f6]{opacity:0;transform:translateY(4px)}.pair-leave-active[data-v-c18959f6]{position:absolute;width:100%}.pair-move[data-v-c18959f6]{transition:transform var(--duration-medium) var(--ease-out)}@media(prefers-reduced-motion:reduce){.pair-enter-active[data-v-c18959f6],.pair-leave-active[data-v-c18959f6],.pair-move[data-v-c18959f6]{transition-duration:1ms}}.connection-grid[data-v-b6056614]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,264px);gap:24px;align-items:start}@media(max-width:1000px){.connection-grid[data-v-b6056614]{grid-template-columns:minmax(0,1fr)}}.connection-form .field[data-v-b6056614]{margin-bottom:12px}.connection-qr[data-v-b6056614]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-b6056614]{background:#fff;border-radius:8px;padding:6px;width:100%;max-width:264px;height:auto}.connection-link[data-v-b6056614]{max-width:100%;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.helper-text[data-v-b6056614]{overflow-wrap:anywhere}.toggle-label[data-v-b6056614]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-fb8c17b3]{max-width:920px}.sec-stack[data-v-fb8c17b3]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-fb8c17b3]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-fb8c17b3]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-fb8c17b3]{font-size:15px;font-weight:700}.sec-chip[data-v-fb8c17b3]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-fb8c17b3]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-fb8c17b3]{margin:2px 0 12px}.sec-pin-grid[data-v-fb8c17b3]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-fb8c17b3]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-fb8c17b3]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-fb8c17b3]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-fb8c17b3]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-fb8c17b3]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-fb8c17b3]:hover{background:var(--md-surface-container)}.page-item[data-v-fb8c17b3]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-fb8c17b3]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-fb8c17b3]{width:44px;height:26px}.page-item .toggle-slider[data-v-fb8c17b3]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-fb8c17b3]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-fb8c17b3]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-fb8c17b3]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-fb8c17b3]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-fb8c17b3]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-fb8c17b3]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-fb8c17b3]{margin-top:12px}.sec-error[data-v-fb8c17b3]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-fb8c17b3]{grid-template-columns:1fr}}.mcp-panel[data-v-01485e38]{max-width:900px}.mcp-head[data-v-01485e38]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-01485e38]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-01485e38]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-01485e38]{display:flex;gap:10px}.error-banner[data-v-01485e38]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-01485e38]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-01485e38]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-01485e38]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-01485e38]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-01485e38]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-01485e38]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-01485e38]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-01485e38]{flex:1}.mcp-field>span[data-v-01485e38]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-01485e38],.mcp-field select[data-v-01485e38],.mcp-field textarea[data-v-01485e38]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-01485e38]{opacity:.7}.mcp-field textarea[data-v-01485e38]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-01485e38]:focus,.mcp-field select[data-v-01485e38]:focus,.mcp-field textarea[data-v-01485e38]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-01485e38]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-01485e38]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-01485e38]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-01485e38]{font-family:ui-monospace,monospace}.mail-grid[data-v-01485e38]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-01485e38]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-01485e38]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-01485e38]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-01485e38]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-01485e38]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-01485e38]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-01485e38]:disabled{opacity:.6;cursor:not-allowed}#app .mcp-panel[data-v-01485e38] :is(.btn,.mcp-remove){border-radius:999px}#app .mcp-panel .mcp-field[data-v-01485e38] :is(input,select,textarea){border-radius:12px}@media(max-width:720px){.mail-grid[data-v-01485e38]{grid-template-columns:1fr}}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.models-field[data-v-7089f4a3]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-7089f4a3]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-7089f4a3]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-7089f4a3]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-7089f4a3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-7089f4a3]{display:inline-flex;gap:4px}.models-actions button[data-v-7089f4a3]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-7089f4a3]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-7089f4a3]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-7089f4a3]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.usage-page[data-v-e1479886]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-e1479886]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-e1479886]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-e1479886]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-e1479886]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-e1479886]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-e1479886]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-e1479886]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-e1479886]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-e1479886]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .usage-page .btn[data-v-e1479886]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-e1479886]:disabled{opacity:.55;cursor:not-allowed}.overview[data-v-e1479886]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-e1479886]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-e1479886]{display:grid;place-items:center}.donut[data-v-e1479886]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-e1479886]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-e1479886]{fill:none;stroke-width:5}.donut-track[data-v-e1479886]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-e1479886]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-e1479886]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-e1479886]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-e1479886]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-e1479886]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-e1479886]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-e1479886]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-e1479886]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-e1479886]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-e1479886]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-e1479886]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-e1479886]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-e1479886]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-e1479886]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-e1479886]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-e1479886]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-e1479886]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-e1479886]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-e1479886]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-e1479886]{background:var(--md-primary)}.dot.completion[data-v-e1479886]{background:var(--md-tertiary)}.mini-stack[data-v-e1479886]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-e1479886]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-e1479886]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-e1479886]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-e1479886]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-e1479886]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-e1479886]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-e1479886 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-e1479886]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-e1479886]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-e1479886]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-e1479886]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-e1479886]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-e1479886]{position:absolute;inset:0}.grid span[data-v-e1479886]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-e1479886]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-e1479886]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-e1479886]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-e1479886]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-e1479886]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-e1479886]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-e1479886]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-e1479886]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-e1479886 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-e1479886]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-e1479886]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-e1479886]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-e1479886]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-e1479886]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-e1479886]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-e1479886]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-e1479886]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-e1479886]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-e1479886]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-e1479886]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-e1479886]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-e1479886]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-e1479886]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}.usage-loading[data-v-e1479886]{display:grid;grid-template-columns:minmax(220px,.9fr) 1.5fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-xl)}.skeleton[data-v-e1479886]{border-radius:32px;background:var(--md-surface-container-low);min-height:180px;animation:sk-shimmer-e1479886 1.4s ease-in-out infinite}.sk-donut[data-v-e1479886]{min-height:220px}@keyframes sk-shimmer-e1479886{0%,to{opacity:1}50%{opacity:.55}}@media(max-width:980px){.usage-loading[data-v-e1479886]{grid-template-columns:1fr 1fr}}@media(max-width:640px){.usage-loading[data-v-e1479886]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.skeleton[data-v-e1479886]{animation:none;opacity:.7}}@keyframes up-e1479886{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-e1479886]{grid-template-columns:1fr 1fr}.mini-stack[data-v-e1479886]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-e1479886],.mini-stack[data-v-e1479886]{grid-template-columns:1fr}.chart[data-v-e1479886]{height:200px;padding-left:34px}.grid span i[data-v-e1479886]{left:-34px;width:28px}.axis span[data-v-e1479886]{font-size:11px}}@media(max-width:560px){.axis span[data-v-e1479886]{font-size:10px}.axis span[data-v-e1479886]:nth-child(2n){visibility:hidden}}\n";document.head.appendChild(s)}})();
