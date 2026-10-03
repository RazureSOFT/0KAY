import { defineComponent as Z, computed as b, ref as x, openBlock as t, createElementBlock as n, normalizeClass as V, createElementVNode as e, Fragment as M, renderList as D, createCommentVNode as _, toDisplayString as a, normalizeStyle as W, onMounted as Q, watch as se, nextTick as ue, unref as o, createStaticVNode as oe, createBlock as X, createTextVNode as q, withDirectives as le, vModelText as de, onUnmounted as ae, vShow as he } from "vue";
import { useI18n as G } from "vue-i18n";
import { useChatStore as ie, useWizardStore as re, useLifeStore as me, useUIPatchesStore as ce } from "@0kay/host";
import { _ as J } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
import { L as ve } from "./assets/Live2DStage-C20BJYzk.js";
const ye = {
  key: 0,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, pe = {
  key: 1,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, fe = { class: "content-wrapper" }, ge = {
  key: 0,
  class: "images"
}, ke = ["src"], _e = {
  key: 1,
  class: "files"
}, be = ["href", "title"], we = {
  key: 2,
  class: "content"
}, Ce = {
  key: 3,
  class: "think-panel"
}, $e = {
  key: 0,
  class: "think-body"
}, xe = {
  key: 0,
  class: "think-raw"
}, Me = {
  key: 1,
  class: "think-summary"
}, Se = { class: "meta" }, Ie = { class: "time" };
function Te(g) {
  return g.irritation > 0.7 ? "#d13438" : g.valence > 0.5 ? "#107c10" : g.valence < -0.3 ? "#0078d4" : "#8a8886";
}
function Le(g) {
  return g.irritation > 0.7 ? "Irritated" : g.valence > 0.5 ? "Happy" : g.valence < -0.3 ? "Down" : "Neutral";
}
const Pe = /* @__PURE__ */ Z({
  __name: "MessageBubble",
  props: {
    message: {}
  },
  setup(g) {
    const d = g, { locale: C } = G(), r = b(() => d.message.role === "user"), w = x(!1), y = b(() => {
      if (!d.message.thinkSummary) return null;
      try {
        const m = JSON.parse(d.message.thinkSummary);
        if (typeof m.raw == "string" && m.raw.trim()) return { raw: m.raw };
        if (typeof m.summary == "string" && m.summary.trim()) return m;
        const f = m.intent || "他好像是在和我打招呼", p = m.strategy || "温柔地接住这句话";
        return { summary: `嗯，我听懂啦：${f}。我现在心里暖暖的，想用轻松一点的方式回应他；先${p}，再陪他继续聊下去。` };
      } catch {
        return { summary: d.message.thinkSummary };
      }
    }), S = b(() => {
      const m = d.message.timestamp, f = m.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
      return new Intl.DateTimeFormat(C.value, {
        ...f ? {} : { year: "numeric" },
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }).format(m);
    });
    return (m, f) => (t(), n("div", {
      class: V(["message", { user: r.value, assistant: !r.value }])
    }, [
      e("div", {
        class: V(["avatar", { "user-avatar": r.value, "assistant-avatar": !r.value }])
      }, [
        r.value ? (t(), n("svg", ye, [...f[1] || (f[1] = [
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
        ])])) : (t(), n("svg", pe, [...f[2] || (f[2] = [
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
      e("div", fe, [
        g.message.images?.length ? (t(), n("div", ge, [
          (t(!0), n(M, null, D(g.message.images, (p, T) => (t(), n("img", {
            key: T,
            src: p,
            alt: "",
            class: "msg-img"
          }, null, 8, ke))), 128))
        ])) : _("", !0),
        g.message.files?.length ? (t(), n("div", _e, [
          (t(!0), n(M, null, D(g.message.files, (p, T) => (t(), n("a", {
            key: T,
            href: p.url,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "msg-file",
            title: p.mime || ""
          }, a(p.name), 9, be))), 128))
        ])) : _("", !0),
        g.message.content ? (t(), n("div", we, a(g.message.content), 1)) : _("", !0),
        !r.value && y.value ? (t(), n("div", Ce, [
          e("button", {
            class: "think-toggle",
            type: "button",
            onClick: f[0] || (f[0] = (p) => w.value = !w.value)
          }, [
            f[3] || (f[3] = e("span", null, "THINK", -1)),
            e("span", null, a(w.value ? "收起" : "展开"), 1)
          ]),
          w.value ? (t(), n("div", $e, [
            y.value.raw ? (t(), n("pre", xe, a(y.value.raw), 1)) : y.value.summary ? (t(), n("p", Me, a(y.value.summary), 1)) : _("", !0)
          ])) : _("", !0)
        ])) : _("", !0),
        e("div", Se, [
          e("span", Ie, a(S.value), 1),
          !r.value && g.message.emotion ? (t(), n(M, { key: 0 }, [
            f[4] || (f[4] = e("span", { class: "separator" }, "·", -1)),
            e("span", {
              class: "emotion",
              style: W({ color: Te(g.message.emotion) })
            }, a(Le(g.message.emotion)), 5)
          ], 64)) : _("", !0)
        ])
      ])
    ], 2));
  }
}), De = /* @__PURE__ */ J(Pe, [["__scopeId", "data-v-bdd613ec"]]), Be = { class: "chat-panel" }, Ee = { class: "messages" }, Ke = {
  key: 0,
  class: "empty-state"
}, Fe = {
  key: 1,
  class: "typing-indicator"
}, Ne = { class: "typing-text" }, Ae = { class: "input-area" }, ze = {
  key: 0,
  class: "pending-images"
}, Re = ["src"], He = ["title", "onClick"], Oe = {
  key: 1,
  class: "pending-files"
}, Ve = ["title"], Ue = ["title", "onClick"], je = { class: "input-wrapper" }, Ye = ["title", "disabled"], We = ["title", "disabled"], Xe = ["placeholder", "disabled"], Ze = ["disabled"], Ge = { class: "input-footer" }, Je = {
  key: 0,
  class: "connection-status disconnected"
}, qe = {
  key: 1,
  class: "connection-status connected"
}, Qe = { class: "hint" }, et = ["title"], tt = ["disabled"], nt = ["disabled"], st = /* @__PURE__ */ Z({
  __name: "ChatPanel",
  setup(g) {
    const { t: d, locale: C } = G(), r = ie(), w = re(), y = x(""), S = x(null), m = x([]), f = x(null), p = x([]), T = x(null), L = x(!1);
    function K() {
      const u = y.value.trim();
      if (!u && m.value.length === 0 && p.value.length === 0) return;
      const i = [...m.value], s = p.value.map((v) => ({ ...v }));
      m.value = [], p.value = [], r.sendMessage(u, i, s), y.value = "";
    }
    function E(u) {
      u.key === "Enter" && !u.shiftKey && (u.preventDefault(), K());
    }
    function U() {
      f.value?.click();
    }
    async function B(u) {
      const i = u.target, s = Array.from(i.files || []);
      if (i.value = "", !!s.length) {
        L.value = !0;
        try {
          for (const v of s) {
            const Y = await r.uploadImage(v);
            m.value.push(Y);
          }
        } catch (v) {
          console.error("image upload failed:", v);
        } finally {
          L.value = !1;
        }
      }
    }
    function F(u) {
      m.value = m.value.filter((i) => i !== u);
    }
    function R() {
      T.value?.click();
    }
    async function I(u) {
      const i = u.target, s = Array.from(i.files || []);
      if (i.value = "", !!s.length) {
        L.value = !0;
        try {
          for (const v of s)
            p.value.push(await r.uploadFile(v));
        } catch (v) {
          console.error("file upload failed:", v);
        } finally {
          L.value = !1;
        }
      }
    }
    function N(u) {
      p.value = p.value.filter((i) => i.url !== u);
    }
    async function P(u) {
      const i = Array.from(u.clipboardData?.files || []);
      if (i.length) {
        u.preventDefault(), L.value = !0;
        try {
          for (const s of i)
            s.type.startsWith("image/") ? m.value.push(await r.uploadImage(s)) : p.value.push(await r.uploadFile(s));
        } catch (s) {
          console.error("paste upload failed:", s);
        } finally {
          L.value = !1;
        }
      }
    }
    function j() {
      const u = r.messages;
      if (!u.length) return;
      const i = w.persona.name || d("chat.defaultCharacter"), s = new Intl.DateTimeFormat(C.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }), v = [];
      v.push(`# ${d("chat.exportTitle")}`, ""), v.push(`- ${d("chat.defaultCharacter")}: ${i}`), v.push(`- ${s.format(/* @__PURE__ */ new Date())}`, "");
      for (const $ of u) {
        if (!$.content && !$.images?.length && !$.files?.length) continue;
        const c = $.role === "user" ? d("chat.you") : i;
        if (v.push(`## ${c} · ${s.format($.timestamp)}`), $.content && v.push("", $.content), $.images?.length) {
          v.push("");
          for (const l of $.images) v.push(`![image](${l})`);
        }
        if ($.files?.length) {
          v.push("");
          for (const l of $.files) v.push(`- [${l.name}](${l.url})`);
        }
        v.push("");
      }
      const Y = new Blob([v.join(`
`)], { type: "text/markdown;charset=utf-8" }), A = URL.createObjectURL(Y), z = /* @__PURE__ */ new Date(), H = ($) => String($).padStart(2, "0"), O = document.createElement("a");
      O.href = A, O.download = `0kay-chat-${z.getFullYear()}${H(z.getMonth() + 1)}${H(z.getDate())}-${H(z.getHours())}${H(z.getMinutes())}.md`, document.body.appendChild(O), O.click(), O.remove(), URL.revokeObjectURL(A);
    }
    return Q(() => {
      r.restoreHistory(), r.isConnected || r.connect();
    }), se(
      () => r.messages.length,
      async () => {
        await ue(), S.value && (S.value.scrollTop = S.value.scrollHeight);
      }
    ), (u, i) => (t(), n("div", Be, [
      e("div", {
        class: "chat-container",
        ref_key: "chatContainer",
        ref: S
      }, [
        e("div", Ee, [
          o(r).messages.length === 0 ? (t(), n("div", Ke, [
            i[4] || (i[4] = oe('<div class="empty-icon" data-v-3b7db97c><svg width="64" height="64" viewBox="0 0 64 64" fill="none" data-v-3b7db97c><circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" data-v-3b7db97c></circle><circle cx="32" cy="28" r="8" stroke="currentColor" stroke-width="2" data-v-3b7db97c></circle><path d="M20 44C20 38 26 34 32 34C38 34 44 38 44 44" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-3b7db97c></path></svg></div>', 1)),
            e("h3", null, a(o(d)("chat.empty")), 1),
            e("p", null, a(o(d)("chat.emptyHint", { name: o(w).persona.name || o(d)("chat.defaultCharacter") })), 1)
          ])) : _("", !0),
          (t(!0), n(M, null, D(o(r).messages, (s) => (t(), X(De, {
            key: s.id,
            message: s
          }, null, 8, ["message"]))), 128)),
          o(r).isTyping ? (t(), n("div", Fe, [
            i[5] || (i[5] = e("div", { class: "typing-dots" }, [
              e("span"),
              e("span"),
              e("span")
            ], -1)),
            e("span", Ne, a(o(w).persona.name || "AI") + " " + a(o(d)("chat.thinking")), 1)
          ])) : _("", !0)
        ])
      ], 512),
      e("div", Ae, [
        m.value.length ? (t(), n("div", ze, [
          (t(!0), n(M, null, D(m.value, (s) => (t(), n("div", {
            key: s,
            class: "pending-thumb"
          }, [
            e("img", {
              src: s,
              alt: ""
            }, null, 8, Re),
            e("button", {
              class: "remove-img",
              type: "button",
              title: o(d)("chat.removeImage"),
              onClick: (v) => F(s)
            }, " × ", 8, He)
          ]))), 128))
        ])) : _("", !0),
        p.value.length ? (t(), n("div", Oe, [
          (t(!0), n(M, null, D(p.value, (s) => (t(), n("span", {
            key: s.url,
            class: "pending-file",
            title: `${s.mime || ""} · ${s.size || 0} B`
          }, [
            q(a(s.name) + " ", 1),
            e("button", {
              class: "remove-file",
              type: "button",
              title: o(d)("chat.removeFile"),
              onClick: (v) => N(s.url)
            }, " × ", 8, Ue)
          ], 8, Ve))), 128))
        ])) : _("", !0),
        e("div", je, [
          e("input", {
            ref_key: "imageInput",
            ref: f,
            type: "file",
            accept: "image/png,image/jpeg,image/gif,image/webp",
            multiple: "",
            hidden: "",
            onChange: B
          }, null, 544),
          e("input", {
            ref_key: "fileInput",
            ref: T,
            type: "file",
            multiple: "",
            hidden: "",
            onChange: I
          }, null, 544),
          e("button", {
            class: "attach-btn",
            type: "button",
            title: o(d)("chat.attachImage"),
            disabled: L.value || !o(r).isConnected,
            onClick: U
          }, [...i[6] || (i[6] = [
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
          ])], 8, Ye),
          e("button", {
            class: "attach-btn",
            type: "button",
            title: o(d)("chat.attachFile"),
            disabled: L.value || !o(r).isConnected,
            onClick: R
          }, [...i[7] || (i[7] = [
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
          ])], 8, We),
          le(e("textarea", {
            "onUpdate:modelValue": i[0] || (i[0] = (s) => y.value = s),
            class: "message-input",
            placeholder: o(d)("chat.inputPlaceholder"),
            rows: "1",
            onKeydown: E,
            onPaste: P,
            disabled: !o(r).isConnected
          }, null, 40, Xe), [
            [de, y.value]
          ]),
          e("button", {
            class: "send-button",
            onClick: K,
            disabled: !y.value.trim() && !m.value.length && !p.value.length || !o(r).isConnected
          }, [...i[8] || (i[8] = [
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
          ])], 8, Ze)
        ]),
        e("div", Ge, [
          o(r).isConnected ? (t(), n("span", qe, [
            i[10] || (i[10] = e("span", { class: "status-dot" }, null, -1)),
            q(" " + a(o(d)("chat.connected")), 1)
          ])) : (t(), n("span", Je, [
            i[9] || (i[9] = e("span", { class: "status-dot" }, null, -1)),
            q(" " + a(o(d)("chat.disconnected")), 1)
          ])),
          e("span", Qe, "上下文约 " + a(o(r).contextTokens.toLocaleString()) + " tokens", 1),
          e("button", {
            class: V(["context-btn", { active: o(r).voiceEnabled }]),
            type: "button",
            title: o(r).voiceEnabled ? "关闭语音朗读" : "开启语音朗读（Live2D 口型同步）",
            onClick: i[1] || (i[1] = (s) => o(r).setVoiceEnabled(!o(r).voiceEnabled))
          }, a(o(r).voiceEnabled ? "🔊 语音开" : "🔇 语音关"), 11, et),
          e("button", {
            class: "context-btn",
            type: "button",
            disabled: o(r).messages.length === 0,
            onClick: j
          }, a(o(d)("chat.download")), 9, tt),
          e("button", {
            class: "context-btn",
            type: "button",
            disabled: o(r).compacting,
            onClick: i[2] || (i[2] = //@ts-ignore
            (...s) => o(r).compactContext && o(r).compactContext(...s))
          }, a(o(r).compacting ? "整理中…" : "整理上下文"), 9, nt),
          e("button", {
            class: "context-btn danger",
            type: "button",
            onClick: i[3] || (i[3] = //@ts-ignore
            (...s) => o(r).clearMessages && o(r).clearMessages(...s))
          }, "清除对话")
        ])
      ])
    ]));
  }
}), ot = /* @__PURE__ */ J(st, [["__scopeId", "data-v-3b7db97c"]]), lt = { class: "status-panel" }, at = { class: "panel-header" }, it = {
  key: 0,
  class: "patch-badge"
}, rt = { class: "panel-content" }, ct = { class: "section character-profile" }, ut = { class: "section-header" }, dt = { class: "section-title" }, ht = ["datetime"], mt = ["data-section", "data-kind"], vt = { class: "section-header" }, yt = { class: "section-title" }, pt = {
  key: 0,
  class: "section-value"
}, ft = {
  key: 1,
  class: "section-value"
}, gt = {
  key: 2,
  class: "section-value"
}, kt = ["disabled", "onClick"], _t = {
  key: 0,
  class: "mood-display"
}, bt = {
  key: 0,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, wt = {
  key: 1,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Ct = {
  key: 2,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, $t = {
  key: 3,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, xt = {
  key: 4,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Mt = {
  key: 1,
  class: "energy-bar"
}, St = {
  key: 2,
  class: "emotion-bars"
}, It = { class: "emotion-label" }, Tt = { class: "emotion-bar" }, Lt = {
  key: 3,
  class: "agents-display"
}, Pt = { class: "agent-count" }, Dt = { class: "agent-label" }, Bt = {
  key: 0,
  class: "agent-offline"
}, Et = { key: 4 }, Kt = {
  key: 0,
  class: "empty-tasks"
}, Ft = {
  key: 1,
  class: "task-list"
}, Nt = { class: "task-id" }, At = { class: "task-status" }, zt = { key: 5 }, Rt = {
  key: 0,
  class: "empty-tasks"
}, Ht = {
  key: 1,
  class: "task-list"
}, Ot = { class: "task-id" }, Vt = { key: 6 }, Ut = {
  key: 0,
  class: "memory-stats"
}, jt = { class: "memory-stat" }, Yt = { class: "memory-stat-label" }, Wt = { class: "memory-stat-value" }, Xt = { class: "memory-stat" }, Zt = { class: "memory-stat-label" }, Gt = { class: "memory-stat-value" }, Jt = { class: "memory-stat" }, qt = { class: "memory-stat-label" }, Qt = { class: "memory-stat-value" }, en = {
  key: 1,
  class: "empty-tasks"
}, tn = {
  key: 2,
  class: "memory-list"
}, nn = ["title"], sn = { class: "memory-text" }, on = { class: "memory-strength" }, ln = {
  key: 7,
  class: "connection-info"
}, an = {
  key: 0,
  class: "state-source"
}, rn = {
  key: 8,
  class: "connection-info"
}, cn = {
  key: 0,
  class: "empty-tasks"
}, un = /* @__PURE__ */ Z({
  __name: "StatusPanel",
  setup(g) {
    const { t: d } = G(), C = me(), r = ce(), w = re(), y = x(/* @__PURE__ */ new Date()), S = b(() => {
      const c = w.persona.birthDate;
      if (!c) return null;
      const l = /* @__PURE__ */ new Date(`${c}T00:00:00`);
      if (Number.isNaN(l.getTime()) || l > y.value) return null;
      const h = y.value;
      return h.getFullYear() - l.getFullYear() - +(h.getMonth() < l.getMonth() || h.getMonth() === l.getMonth() && h.getDate() < l.getDate());
    });
    let m = null;
    function f(c) {
      if (!c || !c.startsWith("life.")) return;
      const l = c.slice(5).split(".").reduce((h, k) => h?.[k], C);
      return typeof l == "function" ? void 0 : l;
    }
    function p(c) {
      if (c.titleKey) {
        const l = d(c.titleKey);
        if (l && l !== c.titleKey) return l;
      }
      return c.title || c.id;
    }
    function T(c) {
      if (c.labelKey) {
        const l = d(c.labelKey);
        if (l && l !== c.labelKey) return l;
      }
      return c.label || c.key;
    }
    function L(c) {
      const l = Number(f(`life.emotion.${c.key}`) ?? 0);
      return c.scale === "remap01" ? (l + 1) / 2 : l;
    }
    function K(c) {
      if (c.value) return c.value;
      if (c.valueKey) {
        const l = d(c.valueKey);
        if (l !== c.valueKey) return l;
      }
      return "—";
    }
    function E(c) {
      if (c.empty) return c.empty;
      if (c.emptyKey) {
        const l = d(c.emptyKey);
        if (l !== c.emptyKey) return l;
      }
      return "—";
    }
    function U(c) {
      const l = f(c.listBind);
      return Array.isArray(l) ? l.map(String) : [];
    }
    const B = x(null), F = x([]), R = x(!1), I = b(() => r.statusSections.find((c) => c.kind === "memory") || null);
    async function N(c) {
      const l = c || I.value?.endpoint || "/api/life/memories";
      R.value = !0;
      try {
        const h = await fetch(l);
        if (h.ok) {
          const k = await h.json();
          B.value = k.stats || null, F.value = k.memories || [];
        }
      } catch {
        B.value = null, F.value = [];
      } finally {
        R.value = !1;
      }
    }
    let P = null;
    function j() {
      if (P && clearInterval(P), P = null, I.value) {
        const c = I.value.pollMs || 15e3;
        N(I.value.endpoint), P = setInterval(() => N(I.value?.endpoint), c);
      }
    }
    se(
      () => [I.value?.endpoint, I.value?.pollMs, r.loaded],
      j,
      { immediate: !0 }
    ), Q(() => {
      I.value || j(), m = setInterval(() => {
        y.value = /* @__PURE__ */ new Date();
      }, 1e3);
    }), ae(() => {
      P && clearInterval(P), m && clearInterval(m);
    });
    const u = b(
      () => r.statusSections.filter((c) => c.kind === "mood" || c.kind === "bars")
    ), i = b(() => C.emotionColor), s = b(() => C.emotionMood), v = b(() => C.energyPercent), Y = b(() => C.energyColor), A = b(() => C.onlineAgents), z = b(() => C.totalAgents), H = b(() => C.isConnected), O = b(() => C.source), $ = b(() => C.activeTasks);
    return (c, l) => (t(), n("div", lt, [
      e("div", at, [
        e("h2", null, a(o(d)("status.title")), 1),
        o(r).loaded ? (t(), n("span", it, "patch")) : _("", !0)
      ]),
      e("div", rt, [
        e("section", ct, [
          e("div", ut, [
            e("span", dt, a(o(w).persona.name || o(d)("chat.defaultCharacter")), 1)
          ]),
          e("dl", null, [
            e("div", null, [
              l[0] || (l[0] = e("dt", null, "年龄", -1)),
              e("dd", null, a(S.value === null ? "未设置生日" : `${S.value} 岁`), 1)
            ]),
            e("div", null, [
              l[1] || (l[1] = e("dt", null, "时间", -1)),
              e("dd", null, [
                e("time", {
                  datetime: y.value.toISOString()
                }, a(y.value.toLocaleString()), 9, ht)
              ])
            ]),
            e("div", null, [
              l[2] || (l[2] = e("dt", null, "时区", -1)),
              e("dd", null, a(Intl.DateTimeFormat().resolvedOptions().timeZone), 1)
            ])
          ])
        ]),
        (t(!0), n(M, null, D(u.value, (h) => (t(), n("div", {
          key: h.id,
          class: "section",
          "data-section": h.id,
          "data-kind": h.kind
        }, [
          e("div", vt, [
            e("span", yt, a(p(h)), 1),
            h.kind === "bar" ? (t(), n("span", pt, a(v.value) + "%", 1)) : h.kind === "count" ? (t(), n("span", ft, a(A.value), 1)) : h.kind === "tasks" ? (t(), n("span", gt, a($.value.length), 1)) : h.kind === "memory" ? (t(), n("button", {
              key: 3,
              class: "link-btn",
              type: "button",
              disabled: R.value,
              onClick: (k) => N(h.endpoint)
            }, a(o(d)("memory.refresh")), 9, kt)) : _("", !0)
          ]),
          h.kind === "mood" ? (t(), n("div", _t, [
            e("div", {
              class: "mood-icon",
              style: W({ color: i.value })
            }, [
              s.value === "happy" ? (t(), n("svg", bt, [...l[3] || (l[3] = [
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
              ])])) : s.value === "sad" ? (t(), n("svg", wt, [...l[4] || (l[4] = [
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
              ])])) : s.value === "irritated" ? (t(), n("svg", Ct, [...l[5] || (l[5] = [
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
              ])])) : s.value === "sleeping" ? (t(), n("svg", $t, [...l[6] || (l[6] = [
                oe('<circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" data-v-95ba671e></circle><path d="M16 22C17 22 18 22 18 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-95ba671e></path><path d="M30 22C31 22 32 22 32 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-95ba671e></path><path d="M18 32C20 34 28 34 30 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-95ba671e></path><text x="36" y="12" fill="currentColor" font-size="12" font-weight="bold" data-v-95ba671e>Z</text>', 5)
              ])])) : (t(), n("svg", xt, [...l[7] || (l[7] = [
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
              style: W({ color: i.value })
            }, a(o(d)(`emotion.${s.value}`)), 5)
          ])) : h.kind === "bar" ? (t(), n("div", Mt, [
            e("div", {
              class: "energy-fill",
              style: W({ transform: `scaleX(${v.value / 100})`, backgroundColor: Y.value })
            }, null, 4)
          ])) : h.kind === "bars" ? (t(), n("div", St, [
            (t(!0), n(M, null, D(h.axes || [], (k) => (t(), n("div", {
              key: k.key,
              class: "emotion-row"
            }, [
              e("span", It, a(T(k)), 1),
              e("div", Tt, [
                e("div", {
                  class: "emotion-fill",
                  style: W({
                    transform: `scaleX(${Math.max(0, Math.min(1, L(k)))})`,
                    backgroundColor: k.color || "#0078d4"
                  })
                }, null, 4)
              ])
            ]))), 128))
          ])) : h.kind === "count" ? (t(), n("div", Lt, [
            e("div", Pt, [
              e("span", {
                class: V(["agent-number", { online: A.value > 0 }])
              }, a(A.value), 3),
              e("span", Dt, a(o(d)("status.agentsOnline")), 1)
            ]),
            z.value > A.value ? (t(), n("div", Bt, a(z.value - A.value) + " " + a(o(d)("status.agentsOffline")), 1)) : _("", !0)
          ])) : h.kind === "tasks" ? (t(), n("div", Et, [
            $.value.length === 0 ? (t(), n("div", Kt, a(E(h)), 1)) : (t(), n("div", Ft, [
              (t(!0), n(M, null, D($.value, (k) => (t(), n("div", {
                key: k,
                class: "task-item"
              }, [
                e("span", Nt, a(k.substring(0, 8)) + "...", 1),
                e("span", At, a(o(d)("status.running")), 1)
              ]))), 128))
            ]))
          ])) : h.kind === "list" ? (t(), n("div", zt, [
            U(h).length === 0 ? (t(), n("div", Rt, a(E(h)), 1)) : (t(), n("div", Ht, [
              (t(!0), n(M, null, D(U(h), (k) => (t(), n("div", {
                key: k,
                class: "task-item"
              }, [
                e("span", Ot, a(k), 1)
              ]))), 128))
            ]))
          ])) : h.kind === "memory" ? (t(), n("div", Vt, [
            B.value ? (t(), n("div", Ut, [
              e("div", jt, [
                e("span", Yt, a(o(d)("memory.working")), 1),
                e("span", Wt, a(B.value.working), 1)
              ]),
              e("div", Xt, [
                e("span", Zt, a(o(d)("memory.shortTerm")), 1),
                e("span", Gt, a(B.value.shortTerm), 1)
              ]),
              e("div", Jt, [
                e("span", qt, a(o(d)("memory.longTerm")), 1),
                e("span", Qt, a(B.value.longTerm), 1)
              ])
            ])) : _("", !0),
            F.value.length === 0 ? (t(), n("div", en, a(o(d)("memory.empty")), 1)) : (t(), n("div", tn, [
              (t(!0), n(M, null, D(F.value.slice(0, 5), (k) => (t(), n("div", {
                key: k.id,
                class: "memory-item",
                title: k.content
              }, [
                e("span", sn, a(k.content), 1),
                e("span", on, a(Math.round((k.strength || 0) * 100)) + "%", 1)
              ], 8, nn))), 128))
            ]))
          ])) : h.kind === "connection" ? (t(), n("div", ln, [
            e("span", {
              class: V(["connection-dot", { connected: H.value }])
            }, null, 2),
            e("span", null, a(H.value ? o(d)("status.connectedTo") : o(d)("chat.disconnected")), 1),
            O.value === "core" ? (t(), n("span", an, "Core")) : _("", !0)
          ])) : (t(), n("div", rn, [
            e("span", null, a(K(h)), 1)
          ]))
        ], 8, mt))), 128)),
        o(r).statusSections.length === 0 ? (t(), n("div", cn, " No status sections (load life.patch) ")) : _("", !0)
      ])
    ]));
  }
}), dn = /* @__PURE__ */ J(un, [["__scopeId", "data-v-95ba671e"]]), hn = {
  key: 0,
  class: "stage-column"
}, mn = ["src", "title"], vn = ["data-chat-slot"], yn = ["src", "title"], pn = ["data-chat-slot"], fn = ["title"], ee = "0kay.web.chat_panel_width_ratio", te = 320, gn = 360, ne = 960, kn = /* @__PURE__ */ Z({
  __name: "ChatPage",
  setup(g) {
    const { t: d } = G(), C = ce(), r = ie(), w = x(!1), y = x(!1), S = b(() => C.chatRegion("stage")), m = b(() => C.chatRegion("chat")), f = b(() => S.value.some((u) => u.component === "status")), p = b(() => m.value.some((u) => u.component === "chat")), T = x(0.34), L = x(null), K = x(null);
    let E = !1;
    function U() {
      try {
        const u = Number(localStorage.getItem(ee));
        u > 0 && u < 1 && (T.value = u);
      } catch {
      }
    }
    function B(u) {
      T.value = u;
      try {
        localStorage.setItem(ee, String(u));
      } catch {
      }
    }
    function F(u, i) {
      const s = Math.min(te, u * 0.3), v = Math.min(ne, u - gn);
      return Math.min(Math.max(i, s), v) / u;
    }
    function R(u) {
      y.value || (E = !0, u.target.setPointerCapture?.(u.pointerId), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none");
    }
    function I(u) {
      if (!E || !K.value) return;
      const i = K.value.getBoundingClientRect(), s = i.right - u.clientX;
      B(F(i.width, s));
    }
    function N() {
      E && (E = !1, document.body.style.cursor = "", document.body.style.userSelect = "");
    }
    function P() {
      const u = y.value;
      y.value = window.innerWidth <= 960, y.value ? u || (w.value = !1) : w.value = !0;
    }
    Q(() => {
      U(), P(), r.setChatVisible(!0), window.addEventListener("resize", P), window.addEventListener("pointermove", I), window.addEventListener("pointerup", N);
    }), ae(() => {
      r.setChatVisible(!1), window.removeEventListener("resize", P), window.removeEventListener("pointermove", I), window.removeEventListener("pointerup", N), document.body.style.cursor = "", document.body.style.userSelect = "";
    });
    function j() {
      w.value = !w.value;
    }
    return (u, i) => (t(), n("div", {
      ref_key: "pageEl",
      ref: K,
      class: V(["chat-page", { "no-chat": !p.value }]),
      style: W(y.value ? void 0 : { "--chat-w": `min(${ne}px, max(${te}px, ${T.value * 100}%))` })
    }, [
      S.value.length ? (t(), n("div", hn, [
        (t(!0), n(M, null, D(S.value, (s) => (t(), n(M, {
          key: s.id
        }, [
          s.component === "live2d" ? (t(), X(ve, {
            key: 0,
            class: "stage-host"
          })) : s.component === "status" ? (t(), X(dn, {
            key: 1,
            class: "status-panel"
          })) : s.component === "iframe" && s.src ? (t(), n("iframe", {
            key: 2,
            class: "slot-frame",
            src: s.src,
            title: s.title || s.id
          }, null, 8, mn)) : (t(), n("div", {
            key: 3,
            class: "slot-note",
            "data-chat-slot": s.id
          }, a(s.titleKey ? o(d)(s.titleKey) : s.title || s.id), 9, vn))
        ], 64))), 128))
      ])) : _("", !0),
      !y.value && p.value && S.value.length ? (t(), n("div", {
        key: 1,
        ref_key: "resizer",
        ref: L,
        class: "page-resizer",
        title: "Drag to resize",
        onPointerdown: R
      }, null, 544)) : _("", !0),
      p.value ? le((t(), n("div", {
        key: 2,
        class: V(["chat-column", { open: w.value && y.value }])
      }, [
        (t(!0), n(M, null, D(m.value, (s) => (t(), n(M, {
          key: s.id
        }, [
          s.component === "chat" ? (t(), X(ot, { key: 0 })) : s.component === "iframe" && s.src ? (t(), n("iframe", {
            key: 1,
            class: "slot-frame fill",
            src: s.src,
            title: s.title || s.id
          }, null, 8, yn)) : (t(), n("div", {
            key: 2,
            class: "slot-note",
            "data-chat-slot": s.id
          }, a(s.titleKey ? o(d)(s.titleKey) : s.title || s.id), 9, pn))
        ], 64))), 128))
      ], 2)), [
        [he, w.value || !y.value]
      ]) : _("", !0),
      y.value && f.value ? (t(), n("button", {
        key: 3,
        class: "status-fab",
        title: o(d)("app.status"),
        onClick: j
      }, [...i[0] || (i[0] = [
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
      ])], 8, fn)) : _("", !0)
    ], 6));
  }
}), xn = /* @__PURE__ */ J(kn, [["__scopeId", "data-v-157876d6"]]);
export {
  xn as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".live2d-stage[data-v-ed3cc7f4]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-ed3cc7f4]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:none;cursor:grab;user-select:none;background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,#f3edf7,#e7e0ec 55%,#d0bcff33)}.stage-viewport[data-v-ed3cc7f4]:active{cursor:grabbing}.stage-canvas[data-v-ed3cc7f4]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-ed3cc7f4]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-ed3cc7f4]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-ed3cc7f4]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-ed3cc7f4]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-ed3cc7f4]:active{transform:scale(.96)}.stage-reset.dragging[data-v-ed3cc7f4]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-ed3cc7f4]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-ed3cc7f4]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-ed3cc7f4]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-bdd613ec]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-bdd613ec]{flex-direction:row-reverse}.avatar[data-v-bdd613ec]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-bdd613ec]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-bdd613ec]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-bdd613ec]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-bdd613ec]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-bdd613ec]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-bdd613ec]{max-width:70%}.content[data-v-bdd613ec]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.user .content[data-v-bdd613ec]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-bdd613ec]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-bdd613ec]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-bdd613ec]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-bdd613ec]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-bdd613ec]{margin:4px 0}.think-body b[data-v-bdd613ec]{color:var(--md-on-surface)}.think-summary[data-v-bdd613ec]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-bdd613ec]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-bdd613ec]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-bdd613ec]{justify-content:flex-end}.separator[data-v-bdd613ec]{color:var(--neutral-gray-10)}.emotion[data-v-bdd613ec]{font-weight:500}.chat-panel[data-v-3b7db97c]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-3b7db97c]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-3b7db97c]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-3b7db97c]{color:var(--md-error)}.chat-container[data-v-3b7db97c]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-3b7db97c]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-3b7db97c]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-3b7db97c]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-3b7db97c]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-3b7db97c]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-3b7db97c]{display:flex;gap:4px}.typing-dots span[data-v-3b7db97c]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-3b7db97c 1.4s infinite ease-in-out}.typing-dots span[data-v-3b7db97c]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-3b7db97c]:nth-child(2){animation-delay:-.16s}@keyframes bounce-3b7db97c{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-3b7db97c]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-3b7db97c]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-3b7db97c]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-3b7db97c]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-3b7db97c]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-3b7db97c],.pending-files[data-v-3b7db97c]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-3b7db97c]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-3b7db97c]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-3b7db97c]:hover{color:var(--error)}.pending-thumb[data-v-3b7db97c]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-3b7db97c]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-3b7db97c]{position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.attach-btn[data-v-3b7db97c]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-3b7db97c]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-3b7db97c]:disabled{opacity:.5;cursor:not-allowed}.send-button[data-v-3b7db97c]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-3b7db97c]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-3b7db97c]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-3b7db97c]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-3b7db97c]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-3b7db97c]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-3b7db97c]{background:var(--success)}.disconnected .status-dot[data-v-3b7db97c]{background:var(--error)}.hint[data-v-3b7db97c]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-95ba671e]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-95ba671e]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-95ba671e]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-95ba671e]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-95ba671e]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-95ba671e]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-95ba671e]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-95ba671e]{margin-bottom:var(--space-xl)}.section-header[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-95ba671e]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.section-value[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-30)}.mood-display[data-v-95ba671e]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-95ba671e]{margin-bottom:var(--space-md)}.mood-label[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600}.energy-bar[data-v-95ba671e]{height:8px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.energy-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out),background-color var(--duration-medium) var(--ease-out)}.emotion-bars[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-95ba671e]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-95ba671e]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-95ba671e]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-95ba671e]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-sm)}.task-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-id[data-v-95ba671e]{font-family:monospace;font-size:var(--font-size-sm);color:var(--neutral-gray-50)}.task-status[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary)}.connection-info[data-v-95ba671e]{display:flex;align-items:center;gap:var(--space-sm);font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.link-btn[data-v-95ba671e]{border:none;background:none;color:var(--brand-primary);font-size:var(--font-size-xs);cursor:pointer;padding:0}.link-btn[data-v-95ba671e]:disabled{opacity:.5;cursor:default}.memory-stats[data-v-95ba671e]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);margin-bottom:var(--space-sm)}.memory-stat[data-v-95ba671e]{padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);text-align:center}.memory-stat-label[data-v-95ba671e]{display:block;font-size:var(--font-size-xs);color:var(--neutral-gray-30);margin-bottom:2px}.memory-stat-value[data-v-95ba671e]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-50)}.memory-list[data-v-95ba671e]{display:flex;flex-direction:column;gap:var(--space-xs)}.memory-item[data-v-95ba671e]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-sm);padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);font-size:var(--font-size-sm)}.memory-text[data-v-95ba671e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--neutral-gray-50)}.memory-strength[data-v-95ba671e]{font-size:var(--font-size-xs);color:var(--brand-primary);font-weight:600}.connection-dot[data-v-95ba671e]{width:8px;height:8px;border-radius:50%;background:var(--error)}.connection-dot.connected[data-v-95ba671e]{background:var(--success)}.state-source[data-v-95ba671e]{margin-left:auto;font-size:var(--font-size-xs);font-weight:700;color:var(--brand-primary);letter-spacing:.5px}.agents-display[data-v-95ba671e]{padding:var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.agent-count[data-v-95ba671e]{display:flex;align-items:baseline;gap:var(--space-sm)}.agent-number[data-v-95ba671e]{font-size:var(--font-size-xl);font-weight:700;color:var(--neutral-gray-30)}.agent-number.online[data-v-95ba671e]{color:var(--success)}.agent-label[data-v-95ba671e]{font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.agent-offline[data-v-95ba671e]{margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.chat-page[data-v-157876d6]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-157876d6]{grid-template-columns:1fr}.stage-column[data-v-157876d6]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-157876d6]{flex:1;min-height:240px}.status-panel[data-v-157876d6]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-157876d6]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-157876d6]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-157876d6]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-157876d6]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-157876d6]:hover,.page-resizer[data-v-157876d6]:active{background:var(--md-primary)}.chat-column[data-v-157876d6]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-157876d6]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media (max-width: 960px){.chat-page[data-v-157876d6]{display:flex;flex-direction:column}.stage-column[data-v-157876d6]{flex:1;min-height:0}.page-resizer[data-v-157876d6]{display:none}.chat-column[data-v-157876d6]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);transition:transform var(--transition-normal)}.chat-column.open[data-v-157876d6]{transform:translate(0)}}.plugins-page[data-v-b484d3da]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-b484d3da]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-b484d3da]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-b484d3da],.pp-hero h1[data-v-b484d3da]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-b484d3da]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-b484d3da]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-b484d3da]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.pp-stats[data-v-b484d3da]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-b484d3da]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-b484d3da]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-b484d3da]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-b484d3da]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-b484d3da]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-b484d3da]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-b484d3da]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-b484d3da]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-b484d3da var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-b484d3da{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media (hover: hover) and (pointer: fine){#app .plugins-page .plugin-card[data-v-b484d3da]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-b484d3da]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-b484d3da]{opacity:.62}.plugin-top[data-v-b484d3da]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-b484d3da]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-b484d3da]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-b484d3da]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-b484d3da]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-b484d3da]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-b484d3da]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-b484d3da]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-b484d3da]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-b484d3da]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-b484d3da]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-b484d3da]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-b484d3da]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-b484d3da]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-b484d3da]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-b484d3da]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-b484d3da]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-b484d3da]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-b484d3da]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-b484d3da]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-b484d3da]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-b484d3da]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-b484d3da]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-b484d3da]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-b484d3da]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-b484d3da]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-b484d3da]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-b484d3da]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-b484d3da]{white-space:nowrap}#app .plugins-page .btn[data-v-b484d3da]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media (hover: hover) and (pointer: fine){#app .plugins-page .btn[data-v-b484d3da]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-b484d3da]:disabled{opacity:.6;cursor:not-allowed}#app .plugins-page .btn-tonal[data-v-b484d3da]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .plugins-page .btn-danger[data-v-b484d3da]{background:var(--md-error-container);color:var(--md-on-error-container)}.empty-state[data-v-b484d3da]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-b484d3da]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-b484d3da]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-b484d3da]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-b484d3da]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-b484d3da]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-b484d3da]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-b484d3da],.pd-leave-to[data-v-b484d3da]{opacity:0}.pd-enter-active .pd-dialog[data-v-b484d3da]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-b484d3da]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-b484d3da],.pd-leave-to .pd-dialog[data-v-b484d3da]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-b484d3da]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-b484d3da]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-b484d3da]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-b484d3da]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-b484d3da]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-b484d3da]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-b484d3da]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-b484d3da]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-b484d3da]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-b484d3da]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-b484d3da]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-b484d3da]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-b484d3da]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-b484d3da]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-b484d3da]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-b484d3da]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-b484d3da]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-b484d3da]{color:var(--md-error)}.pd-foot[data-v-b484d3da]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-b484d3da]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn-tonal[data-v-b484d3da]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pd-foot .btn-danger[data-v-b484d3da]{background:var(--md-error-container);color:var(--md-on-error-container)}.pd-foot .btn[data-v-b484d3da]:disabled{opacity:.6;cursor:not-allowed}@media (prefers-reduced-motion: reduce){.pd-enter-active[data-v-b484d3da],.pd-leave-active[data-v-b484d3da],.pd-enter-active .pd-dialog[data-v-b484d3da],.pd-leave-active .pd-dialog[data-v-b484d3da]{transition:none}.pd-enter-from .pd-dialog[data-v-b484d3da],.pd-leave-to .pd-dialog[data-v-b484d3da]{transform:none}}.life-settings[data-v-537538f7]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-537538f7]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-537538f7 .52s var(--ls-spring) both}.ls-hero-main[data-v-537538f7]{min-width:0}.ls-eyebrow[data-v-537538f7]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-537538f7]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-537538f7]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-537538f7]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media (hover: hover) and (pointer: fine){#app .ls-save[data-v-537538f7]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-537538f7]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-537538f7]{font-size:16px}.ls-grid[data-v-537538f7]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-537538f7]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-537538f7 .52s var(--ls-spring) both}@media (hover: hover) and (pointer: fine){.ls-card[data-v-537538f7]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-537538f7]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-537538f7]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-537538f7]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-537538f7]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-537538f7]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-537538f7]{grid-column:1 / -1}.ls-card-head[data-v-537538f7]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-537538f7]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-537538f7]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-537538f7]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-537538f7]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-537538f7]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-537538f7]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-537538f7]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-537538f7]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-537538f7]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-537538f7]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-537538f7]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-537538f7]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-537538f7]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-537538f7]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-537538f7]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-537538f7]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-537538f7]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-537538f7]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-537538f7]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-537538f7]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-537538f7]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-537538f7]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-537538f7]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-537538f7]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-537538f7]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-537538f7]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-537538f7]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-537538f7]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-537538f7]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-537538f7]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media (hover: hover) and (pointer: fine){.ls-model[data-v-537538f7]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-537538f7]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-537538f7]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}.ls-model b[data-v-537538f7]{font-size:13px;word-break:break-all}.ls-model span[data-v-537538f7]{font-size:12px;color:var(--md-on-surface-variant)}.ls-state[data-v-537538f7]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-537538f7 .32s var(--ls-spring) both}.ls-mail-actions[data-v-537538f7]{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}#app .ls-mail-actions .ls-test[data-v-537538f7]{min-height:44px;padding:0 20px;border:0;border-radius:999px;cursor:pointer;font:700 13px/1 inherit;background:var(--md-secondary-container);color:var(--md-on-secondary-container);transition:transform var(--duration-medium) var(--ease-spring),box-shadow var(--duration-medium) var(--ease-out)}@media (hover: hover) and (pointer: fine){#app .ls-mail-actions .ls-test[data-v-537538f7]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .ls-mail-actions .ls-test[data-v-537538f7]:disabled{opacity:.55;cursor:not-allowed}.ls-mail-result[data-v-537538f7]{margin:4px 0 0;padding:12px 15px;border-radius:16px;font-size:12.5px;line-height:1.55;font-weight:600}.ls-mail-result.ok[data-v-537538f7]{background:var(--md-success-container);color:var(--md-on-success-container)}.ls-mail-result.bad[data-v-537538f7]{background:var(--md-error-container);color:var(--md-on-error-container)}@keyframes ls-rise-537538f7{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-537538f7{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media (max-width: 760px){.ls-grid[data-v-537538f7],.ls-row[data-v-537538f7],.ls-models[data-v-537538f7]{grid-template-columns:1fr}}@media (prefers-reduced-motion: reduce){.ls-hero[data-v-537538f7],.ls-card[data-v-537538f7],.ls-state[data-v-537538f7]{animation:none}}.about[data-v-f0cbac94]{display:flex;flex-direction:column;gap:26px}.identity[data-v-f0cbac94]{display:flex;align-items:center;gap:16px}.app-icon[data-v-f0cbac94]{flex:none;width:56px;height:56px;border-radius:16px;background:var(--md-primary);color:var(--md-on-primary);display:grid;place-items:center;font-size:20px;font-weight:750;letter-spacing:-1px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 35%,transparent)}.app-id[data-v-f0cbac94]{flex:1;min-width:0}.app-id h2[data-v-f0cbac94]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-f0cbac94]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-f0cbac94]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-f0cbac94]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-f0cbac94]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-f0cbac94]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-f0cbac94]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.btn.sm[data-v-f0cbac94]{height:34px;padding-inline:16px;font-size:13px}.credits[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-f0cbac94]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-f0cbac94]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-f0cbac94]{font-size:16px;font-weight:650}.person-info .role[data-v-f0cbac94]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-f0cbac94]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-f0cbac94]{margin-top:6px}.contribs[data-v-f0cbac94]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-f0cbac94]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-f0cbac94]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-f0cbac94]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-f0cbac94]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-f0cbac94]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-f0cbac94]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-f0cbac94]{margin-left:auto}.status-chip[data-v-f0cbac94]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-f0cbac94]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-f0cbac94]:hover{text-decoration:underline}.muted[data-v-f0cbac94]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-f0cbac94]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-f0cbac94]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-f0cbac94]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-f0cbac94]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-f0cbac94]{flex:1;min-width:0}.us-hero-text b[data-v-f0cbac94]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-f0cbac94]{font-size:13px;opacity:.85}.us-hero-text em[data-v-f0cbac94]{font-style:normal;font-weight:700}.us-hero-actions[data-v-f0cbac94]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-f0cbac94]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-f0cbac94]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-f0cbac94]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-f0cbac94]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-f0cbac94]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-f0cbac94]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-f0cbac94]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-f0cbac94]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-f0cbac94]{font-weight:700}.us-apply-label[data-v-f0cbac94]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-f0cbac94]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-f0cbac94]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-f0cbac94]{animation:us-spin-f0cbac94 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-f0cbac94],.us-apply-banner.failed .us-spinner[data-v-f0cbac94]{display:none}.us-apply-log[data-v-f0cbac94],.us-apply-error[data-v-f0cbac94]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-f0cbac94{to{transform:rotate(360deg)}}.alert[data-v-f0cbac94]{color:var(--md-error)}.updates[data-v-6bbe694b]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-6bbe694b]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-6bbe694b]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-6bbe694b]{display:flex;align-items:center;gap:12px}.us-ico[data-v-6bbe694b]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-6bbe694b]{flex:1;min-width:0}.us-title[data-v-6bbe694b]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-6bbe694b]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-6bbe694b]{display:flex;align-items:center;gap:8px}.us-tag[data-v-6bbe694b]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-6bbe694b]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-6bbe694b]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-source[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-6bbe694b]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-6bbe694b]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-6bbe694b]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-6bbe694b]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-6bbe694b]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-6bbe694b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-6bbe694b]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-6bbe694b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-6bbe694b]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-6bbe694b]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-6bbe694b]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-6bbe694b]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-6bbe694b]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-6bbe694b]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-6bbe694b]{flex:1;min-width:0}.us-hero-text b[data-v-6bbe694b]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-6bbe694b]{font-size:13px;opacity:.85}.us-hero-text em[data-v-6bbe694b]{font-style:normal;font-weight:700}.us-hero-actions[data-v-6bbe694b]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-6bbe694b]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-6bbe694b]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-6bbe694b]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-6bbe694b]{font-weight:700}.us-apply-label[data-v-6bbe694b]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-6bbe694b]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-6bbe694b]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-6bbe694b]{animation:us-spin-6bbe694b .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-6bbe694b],.us-apply-banner.failed .us-spinner[data-v-6bbe694b]{display:none}.us-apply-log[data-v-6bbe694b],.us-apply-error[data-v-6bbe694b]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-6bbe694b{to{transform:rotate(360deg)}}.us-table[data-v-6bbe694b]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-6bbe694b]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-6bbe694b]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-6bbe694b]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-6bbe694b]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-6bbe694b]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-6bbe694b]{background:var(--md-success)}.us-dot.warn[data-v-6bbe694b]{background:#e0a800}.us-dot.bad[data-v-6bbe694b]{background:var(--md-error)}.us-ver[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-6bbe694b]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-6bbe694b]{font-weight:650}.us-ver b.good[data-v-6bbe694b]{color:var(--md-success)}.us-arrow[data-v-6bbe694b]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-6bbe694b]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-6bbe694b]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-6bbe694b]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-6bbe694b]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-6bbe694b]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-6bbe694b]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-6bbe694b]:hover{text-decoration:underline}.us-empty[data-v-6bbe694b]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-6bbe694b]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-6bbe694b]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.btn.sm[data-v-6bbe694b]{height:34px;padding-inline:16px;font-size:13px}.btn.xs[data-v-6bbe694b]{height:30px;padding-inline:12px;font-size:12px}.alert[data-v-6bbe694b]{color:var(--md-error)}@media (max-width: 720px){.us-row[data-v-6bbe694b]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-6bbe694b]{display:none}.us-hero[data-v-6bbe694b]{flex-wrap:wrap}.us-hero-actions[data-v-6bbe694b]{width:100%}}.provider-panel[data-v-dc98b94b]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-dc98b94b]{display:flex;align-items:center;gap:14px}.pp-back[data-v-dc98b94b]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-dc98b94b]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-dc98b94b]{flex:1;min-width:0}.pp-editor-title h2[data-v-dc98b94b]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-dc98b94b]{margin:3px 0 0}.pp-section[data-v-dc98b94b]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-dc98b94b]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-dc98b94b]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-dc98b94b]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-dc98b94b]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-dc98b94b]{margin-bottom:0}.pp-span[data-v-dc98b94b]{grid-column:1 / -1}.pp-req[data-v-dc98b94b]{color:var(--md-error);margin-left:2px}.pp-key[data-v-dc98b94b]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-dc98b94b]{flex:1}.pp-key-toggle[data-v-dc98b94b]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-dc98b94b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-dc98b94b]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-dc98b94b]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-dc98b94b]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-dc98b94b]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-dc98b94b]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-dc98b94b]{animation:pp-pulse-dc98b94b 1s ease-in-out infinite}@keyframes pp-pulse-dc98b94b{50%{opacity:.15}}.pp-probe[data-v-dc98b94b]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-dc98b94b]{color:var(--md-success)}.pp-probe.err[data-v-dc98b94b]{color:var(--md-error)}.pp-discovered[data-v-dc98b94b]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-dc98b94b]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-dc98b94b]{flex:1;min-width:160px}.pp-mini[data-v-dc98b94b]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-dc98b94b]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-models[data-v-dc98b94b]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-dc98b94b]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-dc98b94b]:first-child{border-top:0}.pp-model.off[data-v-dc98b94b]{opacity:.5}.pp-model-name[data-v-dc98b94b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-dc98b94b]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-dc98b94b]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-dc98b94b]{color:#e0a800;cursor:default}.pp-switch[data-v-dc98b94b]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-dc98b94b]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-dc98b94b]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-dc98b94b]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-dc98b94b]{display:flex;gap:10px}.pp-list-head[data-v-dc98b94b]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-dc98b94b]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-dc98b94b]{margin:3px 0 0}.pp-list-actions[data-v-dc98b94b]{display:flex;gap:8px}.pp-cards[data-v-dc98b94b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-dc98b94b]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media (hover: hover) and (pointer: fine){.pp-card[data-v-dc98b94b]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-dc98b94b]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-dc98b94b]{opacity:.62}.pp-card-head[data-v-dc98b94b]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-dc98b94b]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-dc98b94b]{width:26px;height:26px}.pp-card-id[data-v-dc98b94b]{flex:1;min-width:0}.pp-card-id strong[data-v-dc98b94b]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-dc98b94b]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-dc98b94b]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-dc98b94b]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-dc98b94b]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-dc98b94b]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-dc98b94b]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-dc98b94b]{color:var(--md-error)}.pp-chips[data-v-dc98b94b]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-dc98b94b]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-dc98b94b],.pp-chip.empty[data-v-dc98b94b]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-dc98b94b]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.btn.sm[data-v-dc98b94b]{height:32px;padding-inline:12px;font-size:12.5px}.btn.xs[data-v-dc98b94b]{height:28px;padding-inline:12px;font-size:12px}.pp-empty[data-v-dc98b94b]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media (max-width: 640px){.pp-grid[data-v-dc98b94b],.pp-cards[data-v-dc98b94b]{grid-template-columns:1fr}}.pairing-panel[data-v-0559b1b2]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-0559b1b2]{margin:12px 0;color:var(--md-on-surface-variant)}article[data-v-0559b1b2]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-0559b1b2]{font-size:24px;letter-spacing:4px}button[data-v-0559b1b2]{padding:8px 12px}.security-panel[data-v-bd35de8f]{max-width:920px}.sec-stack[data-v-bd35de8f]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-bd35de8f]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-bd35de8f]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-bd35de8f]{font-size:15px;font-weight:700}.sec-chip[data-v-bd35de8f]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-bd35de8f]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-bd35de8f]{margin:2px 0 12px}.sec-pin-grid[data-v-bd35de8f]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-bd35de8f]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-bd35de8f]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-bd35de8f]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-bd35de8f]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-bd35de8f]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-bd35de8f]:hover{background:var(--md-surface-container)}.page-item[data-v-bd35de8f]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-bd35de8f]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-bd35de8f]{width:44px;height:26px}.page-item .toggle-slider[data-v-bd35de8f]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-bd35de8f]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-bd35de8f]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-bd35de8f]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-bd35de8f]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-bd35de8f]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-bd35de8f]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-bd35de8f]{margin-top:12px}.sec-error[data-v-bd35de8f]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media (max-width: 640px){.sec-pin-grid[data-v-bd35de8f]{grid-template-columns:1fr}}.mcp-panel[data-v-3b21cb32]{max-width:900px}.mcp-head[data-v-3b21cb32]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-3b21cb32]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-3b21cb32]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-3b21cb32]{display:flex;gap:10px}.error-banner[data-v-3b21cb32]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-3b21cb32]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-3b21cb32]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-3b21cb32]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-3b21cb32]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-row[data-v-3b21cb32]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-3b21cb32]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-3b21cb32]{flex:1}.mcp-field>span[data-v-3b21cb32]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-3b21cb32],.mcp-field select[data-v-3b21cb32],.mcp-field textarea[data-v-3b21cb32]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field textarea[data-v-3b21cb32]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-3b21cb32]:focus,.mcp-field select[data-v-3b21cb32]:focus,.mcp-field textarea[data-v-3b21cb32]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-3b21cb32]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-3b21cb32]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.btn[data-v-3b21cb32]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-3b21cb32]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-3b21cb32]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-3b21cb32]:disabled{opacity:.6;cursor:not-allowed}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.usage-page[data-v-a7476de1]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-a7476de1]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-a7476de1]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-a7476de1]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-a7476de1]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-a7476de1]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-a7476de1]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-a7476de1]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media (hover: hover) and (pointer: fine){#app .usage-page .btn[data-v-a7476de1]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-a7476de1]:disabled{opacity:.55;cursor:not-allowed}#app .usage-page .btn-tonal[data-v-a7476de1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .usage-page .btn-danger[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.overview[data-v-a7476de1]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-a7476de1]{display:grid;place-items:center}.donut[data-v-a7476de1]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-a7476de1]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-a7476de1]{fill:none;stroke-width:5}.donut-track[data-v-a7476de1]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-a7476de1]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-a7476de1]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-a7476de1]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-a7476de1]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-a7476de1]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-a7476de1]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-a7476de1]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-a7476de1]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-a7476de1]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-a7476de1]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-a7476de1]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-a7476de1]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-a7476de1]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-a7476de1]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-a7476de1]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-a7476de1]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-a7476de1]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-a7476de1]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-a7476de1]{background:var(--md-primary)}.dot.completion[data-v-a7476de1]{background:var(--md-tertiary)}.mini-stack[data-v-a7476de1]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-a7476de1]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media (hover: hover) and (pointer: fine){.mini[data-v-a7476de1]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-a7476de1]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-a7476de1]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-a7476de1]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-a7476de1]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-a7476de1]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-a7476de1]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-a7476de1]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-a7476de1]{position:absolute;inset:0}.grid span[data-v-a7476de1]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-a7476de1]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-a7476de1]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-a7476de1]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-a7476de1]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-a7476de1]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-a7476de1]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-a7476de1]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-a7476de1]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-a7476de1]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media (hover: hover) and (pointer: fine){.model-card[data-v-a7476de1]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-a7476de1]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-a7476de1]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-a7476de1]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-a7476de1]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-a7476de1]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-a7476de1]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-a7476de1]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-a7476de1]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-a7476de1]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-a7476de1]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-a7476de1]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}@keyframes up-a7476de1{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media (max-width: 980px){.overview[data-v-a7476de1]{grid-template-columns:1fr 1fr}.mini-stack[data-v-a7476de1]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media (max-width: 640px){.overview[data-v-a7476de1],.mini-stack[data-v-a7476de1]{grid-template-columns:1fr}.chart[data-v-a7476de1]{height:200px;padding-left:34px}.grid span i[data-v-a7476de1]{left:-34px;width:28px}.axis span[data-v-a7476de1]{font-size:11px}}\n";document.head.appendChild(s)}})();
