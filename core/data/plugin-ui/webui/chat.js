import { defineComponent as G, computed as M, ref as T, openBlock as t, createElementBlock as n, normalizeClass as V, createElementVNode as e, Fragment as L, renderList as E, createCommentVNode as _, toDisplayString as a, unref as s, normalizeStyle as Y, onMounted as ee, watch as ae, nextTick as he, createStaticVNode as le, createBlock as Z, createTextVNode as Q, withDirectives as ie, vModelText as ve, onUnmounted as re, vShow as me } from "vue";
import { useI18n as J } from "vue-i18n";
import { useChatStore as ce, useWizardStore as ue, useLifeStore as pe, useUIPatchesStore as de } from "@0kay/host";
import { _ as q } from "./assets/_plugin-vue_export-helper-CHgC5LLL.js";
import { L as ye } from "./assets/Live2DStage-w9T1h3vJ.js";
function te(b) {
  return b.irritation > 0.7 ? "irritated" : b.valence > 0.5 ? "happy" : b.valence < -0.3 ? "sad" : "neutral";
}
const fe = {
  happy: "#107c10",
  sad: "#0078d4",
  irritated: "#d13438",
  neutral: "#8a8886"
};
function ge(b) {
  return fe[b];
}
const ke = {
  key: 0,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, _e = {
  key: 1,
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none"
}, we = { class: "content-wrapper" }, be = {
  key: 0,
  class: "images"
}, Ce = ["src"], $e = {
  key: 1,
  class: "files"
}, xe = ["href", "title"], Me = {
  key: 2,
  class: "content"
}, Se = {
  key: 3,
  class: "think-panel"
}, Ie = {
  key: 0,
  class: "think-body"
}, Te = {
  key: 0,
  class: "think-raw"
}, Pe = {
  key: 1,
  class: "think-summary"
}, Le = { class: "meta" }, Be = { class: "time" }, Ke = /* @__PURE__ */ G({
  __name: "MessageBubble",
  props: {
    message: {}
  },
  setup(b) {
    const o = b, { t: C, locale: u } = J(), k = M(() => o.message.role === "user"), y = T(!1), I = M(() => {
      if (!o.message.thinkSummary) return null;
      try {
        const w = JSON.parse(o.message.thinkSummary);
        if (typeof w.raw == "string" && w.raw.trim()) return { raw: w.raw };
        if (typeof w.summary == "string" && w.summary.trim()) return w;
        const m = w.intent || "他好像是在和我打招呼", S = w.strategy || "温柔地接住这句话";
        return { summary: `嗯，我听懂啦：${m}。我现在心里暖暖的，想用轻松一点的方式回应他；先${S}，再陪他继续聊下去。` };
      } catch {
        return { summary: o.message.thinkSummary };
      }
    }), $ = M(() => {
      const w = o.message.timestamp, m = w.getFullYear() === (/* @__PURE__ */ new Date()).getFullYear();
      return new Intl.DateTimeFormat(u.value, {
        ...m ? {} : { year: "numeric" },
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }).format(w);
    });
    return (w, m) => (t(), n("div", {
      class: V(["message", { user: k.value, assistant: !k.value }])
    }, [
      e("div", {
        class: V(["avatar", { "user-avatar": k.value, "assistant-avatar": !k.value }])
      }, [
        k.value ? (t(), n("svg", ke, [...m[1] || (m[1] = [
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
        ])])) : (t(), n("svg", _e, [...m[2] || (m[2] = [
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
      e("div", we, [
        b.message.images?.length ? (t(), n("div", be, [
          (t(!0), n(L, null, E(b.message.images, (S, x) => (t(), n("img", {
            key: x,
            src: S,
            alt: "",
            class: "msg-img"
          }, null, 8, Ce))), 128))
        ])) : _("", !0),
        b.message.files?.length ? (t(), n("div", $e, [
          (t(!0), n(L, null, E(b.message.files, (S, x) => (t(), n("a", {
            key: x,
            href: S.url,
            target: "_blank",
            rel: "noopener noreferrer",
            class: "msg-file",
            title: S.mime || ""
          }, a(S.name), 9, xe))), 128))
        ])) : _("", !0),
        b.message.content ? (t(), n("div", Me, a(b.message.content), 1)) : _("", !0),
        !k.value && I.value ? (t(), n("div", Se, [
          e("button", {
            class: "think-toggle",
            type: "button",
            onClick: m[0] || (m[0] = (S) => y.value = !y.value)
          }, [
            m[3] || (m[3] = e("span", null, "THINK", -1)),
            e("span", null, a(y.value ? s(C)("chat.thinkCollapse") : s(C)("chat.thinkExpand")), 1)
          ]),
          y.value ? (t(), n("div", Ie, [
            I.value.raw ? (t(), n("pre", Te, a(I.value.raw), 1)) : I.value.summary ? (t(), n("p", Pe, a(I.value.summary), 1)) : _("", !0)
          ])) : _("", !0)
        ])) : _("", !0),
        e("div", Le, [
          e("span", Be, a($.value), 1),
          !k.value && b.message.emotion ? (t(), n(L, { key: 0 }, [
            m[4] || (m[4] = e("span", { class: "separator" }, "·", -1)),
            e("span", {
              class: "emotion",
              style: Y({ color: s(ge)(s(te)(b.message.emotion)) })
            }, a(s(C)(`emotion.${s(te)(b.message.emotion)}`)), 5)
          ], 64)) : _("", !0)
        ])
      ])
    ], 2));
  }
}), De = /* @__PURE__ */ q(Ke, [["__scopeId", "data-v-31946fce"]]), Ee = { class: "chat-panel" }, Oe = {
  class: "messages",
  role: "log",
  "aria-live": "polite",
  "aria-relevant": "additions text"
}, Ae = {
  key: 0,
  class: "empty-state"
}, Fe = {
  key: 1,
  class: "typing-indicator"
}, Ne = { class: "typing-text" }, Re = { class: "input-area" }, ze = {
  key: 0,
  class: "pending-images"
}, He = ["src"], Ve = ["title", "onClick"], Ue = {
  key: 1,
  class: "pending-files"
}, je = ["title"], Ye = ["title", "onClick"], Xe = { class: "input-wrapper" }, We = ["title", "disabled"], Ze = ["title", "disabled"], Ge = ["placeholder", "disabled"], Je = ["disabled"], qe = { class: "input-footer" }, Qe = {
  key: 0,
  class: "connection-status disconnected"
}, et = {
  key: 1,
  class: "connection-status connected"
}, tt = { class: "hint" }, nt = ["title"], st = ["disabled"], ot = ["disabled"], at = 80, lt = /* @__PURE__ */ G({
  __name: "ChatPanel",
  setup(b) {
    const { t: o, locale: C } = J(), u = ce(), k = ue(), y = T(""), I = T(null), $ = T([]), w = T(null), m = T([]), S = T(null), x = T(!1), O = T(!0);
    let F = !1;
    function z() {
      const v = I.value;
      v && (O.value = v.scrollHeight - v.scrollTop - v.clientHeight <= at);
    }
    function K() {
      if (u.isTyping) return;
      const v = y.value.trim();
      if (!v && $.value.length === 0 && m.value.length === 0) return;
      const c = [...$.value], d = m.value.map((f) => ({ ...f }));
      $.value = [], m.value = [], F = !0, u.sendMessage(v, c, d), y.value = "";
    }
    function N(v) {
      v.key === "Enter" && !v.shiftKey && (v.preventDefault(), K());
    }
    function R() {
      w.value?.click();
    }
    async function B(v) {
      const c = v.target, d = Array.from(c.files || []);
      if (c.value = "", !!d.length) {
        x.value = !0;
        try {
          for (const f of d) {
            const j = await u.uploadImage(f);
            $.value.push(j);
          }
        } catch (f) {
          console.error("image upload failed:", f);
        } finally {
          x.value = !1;
        }
      }
    }
    function H(v) {
      $.value = $.value.filter((c) => c !== v);
    }
    function D() {
      S.value?.click();
    }
    async function U(v) {
      const c = v.target, d = Array.from(c.files || []);
      if (c.value = "", !!d.length) {
        x.value = !0;
        try {
          for (const f of d)
            m.value.push(await u.uploadFile(f));
        } catch (f) {
          console.error("file upload failed:", f);
        } finally {
          x.value = !1;
        }
      }
    }
    function p(v) {
      m.value = m.value.filter((c) => c.url !== v);
    }
    async function P(v) {
      const c = Array.from(v.clipboardData?.files || []);
      if (c.length) {
        v.preventDefault(), x.value = !0;
        try {
          for (const d of c)
            d.type.startsWith("image/") ? $.value.push(await u.uploadImage(d)) : m.value.push(await u.uploadFile(d));
        } catch (d) {
          console.error("paste upload failed:", d);
        } finally {
          x.value = !1;
        }
      }
    }
    function h() {
      const v = u.messages;
      if (!v.length) return;
      const c = k.persona.name || o("chat.defaultCharacter"), d = new Intl.DateTimeFormat(C.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }), f = [];
      f.push(`# ${o("chat.exportTitle")}`, ""), f.push(`- ${o("chat.defaultCharacter")}: ${c}`), f.push(`- ${d.format(/* @__PURE__ */ new Date())}`, "");
      for (const r of v) {
        if (!r.content && !r.images?.length && !r.files?.length) continue;
        const g = r.role === "user" ? o("chat.you") : c;
        if (f.push(`## ${g} · ${d.format(r.timestamp)}`), r.content && f.push("", r.content), r.images?.length) {
          f.push("");
          for (const W of r.images) f.push(`![image](${W})`);
        }
        if (r.files?.length) {
          f.push("");
          for (const W of r.files) f.push(`- [${W.name}](${W.url})`);
        }
        f.push("");
      }
      const j = new Blob([f.join(`
`)], { type: "text/markdown;charset=utf-8" }), X = URL.createObjectURL(j), A = /* @__PURE__ */ new Date(), l = (r) => String(r).padStart(2, "0"), i = document.createElement("a");
      i.href = X, i.download = `0kay-chat-${A.getFullYear()}${l(A.getMonth() + 1)}${l(A.getDate())}-${l(A.getHours())}${l(A.getMinutes())}.md`, document.body.appendChild(i), i.click(), i.remove(), URL.revokeObjectURL(X);
    }
    return ee(() => {
      u.restoreHistory(), u.isConnected || u.connect();
    }), ae(
      () => u.messages.length,
      async () => {
        await he();
        const v = I.value;
        v && ((O.value || F) && (v.scrollTop = v.scrollHeight, O.value = !0), F = !1);
      }
    ), (v, c) => (t(), n("div", Ee, [
      e("div", {
        class: "chat-container",
        ref_key: "chatContainer",
        ref: I,
        onScroll: z
      }, [
        e("div", Oe, [
          s(u).messages.length === 0 ? (t(), n("div", Ae, [
            c[4] || (c[4] = le('<div class="empty-icon" data-v-12162d94><svg width="64" height="64" viewBox="0 0 64 64" fill="none" data-v-12162d94><circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" data-v-12162d94></circle><circle cx="32" cy="28" r="8" stroke="currentColor" stroke-width="2" data-v-12162d94></circle><path d="M20 44C20 38 26 34 32 34C38 34 44 38 44 44" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-12162d94></path></svg></div>', 1)),
            e("h3", null, a(s(o)("chat.empty")), 1),
            e("p", null, a(s(o)("chat.emptyHint", { name: s(k).persona.name || s(o)("chat.defaultCharacter") })), 1)
          ])) : _("", !0),
          (t(!0), n(L, null, E(s(u).messages, (d) => (t(), Z(De, {
            key: d.id,
            message: d
          }, null, 8, ["message"]))), 128)),
          s(u).isTyping ? (t(), n("div", Fe, [
            c[5] || (c[5] = e("div", { class: "typing-dots" }, [
              e("span"),
              e("span"),
              e("span")
            ], -1)),
            e("span", Ne, a(s(k).persona.name || "AI") + " " + a(s(o)("chat.thinking")), 1)
          ])) : _("", !0)
        ])
      ], 544),
      e("div", Re, [
        $.value.length ? (t(), n("div", ze, [
          (t(!0), n(L, null, E($.value, (d) => (t(), n("div", {
            key: d,
            class: "pending-thumb"
          }, [
            e("img", {
              src: d,
              alt: ""
            }, null, 8, He),
            e("button", {
              class: "remove-img",
              type: "button",
              title: s(o)("chat.removeImage"),
              onClick: (f) => H(d)
            }, " × ", 8, Ve)
          ]))), 128))
        ])) : _("", !0),
        m.value.length ? (t(), n("div", Ue, [
          (t(!0), n(L, null, E(m.value, (d) => (t(), n("span", {
            key: d.url,
            class: "pending-file",
            title: `${d.mime || ""} · ${d.size || 0} B`
          }, [
            Q(a(d.name) + " ", 1),
            e("button", {
              class: "remove-file",
              type: "button",
              title: s(o)("chat.removeFile"),
              onClick: (f) => p(d.url)
            }, " × ", 8, Ye)
          ], 8, je))), 128))
        ])) : _("", !0),
        e("div", Xe, [
          e("input", {
            ref_key: "imageInput",
            ref: w,
            type: "file",
            accept: "image/png,image/jpeg,image/gif,image/webp",
            multiple: "",
            hidden: "",
            onChange: B
          }, null, 544),
          e("input", {
            ref_key: "fileInput",
            ref: S,
            type: "file",
            multiple: "",
            hidden: "",
            onChange: U
          }, null, 544),
          e("button", {
            class: "attach-btn",
            type: "button",
            title: s(o)("chat.attachImage"),
            disabled: x.value || !s(u).isConnected,
            onClick: R
          }, [...c[6] || (c[6] = [
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
          ])], 8, We),
          e("button", {
            class: "attach-btn",
            type: "button",
            title: s(o)("chat.attachFile"),
            disabled: x.value || !s(u).isConnected,
            onClick: D
          }, [...c[7] || (c[7] = [
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
          ])], 8, Ze),
          ie(e("textarea", {
            "onUpdate:modelValue": c[0] || (c[0] = (d) => y.value = d),
            class: "message-input",
            placeholder: s(o)("chat.inputPlaceholder"),
            rows: "1",
            onKeydown: N,
            onPaste: P,
            disabled: !s(u).isConnected
          }, null, 40, Ge), [
            [ve, y.value]
          ]),
          e("button", {
            class: "send-button",
            onClick: K,
            disabled: !y.value.trim() && !$.value.length && !m.value.length || !s(u).isConnected || s(u).isTyping
          }, [...c[8] || (c[8] = [
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
          ])], 8, Je)
        ]),
        e("div", qe, [
          s(u).isConnected ? (t(), n("span", et, [
            c[10] || (c[10] = e("span", { class: "status-dot" }, null, -1)),
            Q(" " + a(s(o)("chat.connected")), 1)
          ])) : (t(), n("span", Qe, [
            c[9] || (c[9] = e("span", { class: "status-dot" }, null, -1)),
            Q(" " + a(s(o)("chat.disconnected")), 1)
          ])),
          e("span", tt, a(s(o)("chat.contextHint", { n: s(u).contextTokens.toLocaleString() })), 1),
          e("button", {
            class: V(["context-btn", { active: s(u).voiceEnabled }]),
            type: "button",
            title: s(u).voiceEnabled ? s(o)("chat.voiceOnTitle") : s(o)("chat.voiceOffTitle"),
            onClick: c[1] || (c[1] = (d) => s(u).setVoiceEnabled(!s(u).voiceEnabled))
          }, a(s(u).voiceEnabled ? s(o)("chat.voiceOn") : s(o)("chat.voiceOff")), 11, nt),
          e("button", {
            class: "context-btn",
            type: "button",
            disabled: s(u).messages.length === 0,
            onClick: h
          }, a(s(o)("chat.download")), 9, st),
          e("button", {
            class: "context-btn",
            type: "button",
            disabled: s(u).compacting,
            onClick: c[2] || (c[2] = //@ts-ignore
            (...d) => s(u).compactContext && s(u).compactContext(...d))
          }, a(s(u).compacting ? s(o)("chat.compacting") : s(o)("chat.compact")), 9, ot),
          e("button", {
            class: "context-btn danger",
            type: "button",
            onClick: c[3] || (c[3] = //@ts-ignore
            (...d) => s(u).clearMessages && s(u).clearMessages(...d))
          }, a(s(o)("chat.clear")), 1)
        ])
      ])
    ]));
  }
}), it = /* @__PURE__ */ q(lt, [["__scopeId", "data-v-12162d94"]]), rt = { class: "status-panel" }, ct = { class: "panel-header" }, ut = {
  key: 0,
  class: "patch-badge"
}, dt = { class: "panel-content" }, ht = { class: "section character-profile" }, vt = { class: "section-header" }, mt = { class: "section-title" }, pt = ["datetime"], yt = ["data-section", "data-kind"], ft = { class: "section-header" }, gt = { class: "section-title" }, kt = {
  key: 0,
  class: "section-value"
}, _t = {
  key: 1,
  class: "section-value"
}, wt = {
  key: 2,
  class: "section-value"
}, bt = ["disabled", "onClick"], Ct = {
  key: 0,
  class: "mood-display"
}, $t = {
  key: 0,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, xt = {
  key: 1,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Mt = {
  key: 2,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, St = {
  key: 3,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, It = {
  key: 4,
  width: "48",
  height: "48",
  viewBox: "0 0 48 48",
  fill: "none"
}, Tt = {
  key: 1,
  class: "energy-bar"
}, Pt = {
  key: 2,
  class: "emotion-bars"
}, Lt = { class: "emotion-label" }, Bt = { class: "emotion-bar" }, Kt = {
  key: 3,
  class: "agents-display"
}, Dt = { class: "agent-count" }, Et = { class: "agent-label" }, Ot = {
  key: 0,
  class: "agent-offline"
}, At = { key: 4 }, Ft = {
  key: 0,
  class: "empty-tasks"
}, Nt = {
  key: 1,
  class: "task-list"
}, Rt = { class: "task-id" }, zt = { class: "task-status" }, Ht = { key: 5 }, Vt = {
  key: 0,
  class: "empty-tasks"
}, Ut = {
  key: 1,
  class: "task-list"
}, jt = { class: "task-id" }, Yt = { key: 6 }, Xt = {
  key: 0,
  class: "memory-stats"
}, Wt = { class: "memory-stat" }, Zt = { class: "memory-stat-label" }, Gt = { class: "memory-stat-value" }, Jt = { class: "memory-stat" }, qt = { class: "memory-stat-label" }, Qt = { class: "memory-stat-value" }, en = { class: "memory-stat" }, tn = { class: "memory-stat-label" }, nn = { class: "memory-stat-value" }, sn = {
  key: 1,
  class: "empty-tasks"
}, on = {
  key: 2,
  class: "memory-list"
}, an = ["title"], ln = { class: "memory-text" }, rn = { class: "memory-strength" }, cn = {
  key: 7,
  class: "connection-info"
}, un = {
  key: 0,
  class: "state-source"
}, dn = {
  key: 8,
  class: "connection-info"
}, hn = {
  key: 0,
  class: "empty-tasks"
}, vn = /* @__PURE__ */ G({
  __name: "StatusPanel",
  setup(b) {
    const { t: o } = J(), C = pe(), u = de(), k = ue(), y = T(/* @__PURE__ */ new Date()), I = M(() => {
      const l = k.persona.birthDate;
      if (!l) return null;
      const i = /* @__PURE__ */ new Date(`${l}T00:00:00`);
      if (Number.isNaN(i.getTime()) || i > y.value) return null;
      const r = y.value;
      return r.getFullYear() - i.getFullYear() - +(r.getMonth() < i.getMonth() || r.getMonth() === i.getMonth() && r.getDate() < i.getDate());
    });
    let $ = null;
    function w(l) {
      if (!l || !l.startsWith("life.")) return;
      const i = l.slice(5).split(".").reduce((r, g) => r?.[g], C);
      return typeof i == "function" ? void 0 : i;
    }
    function m(l) {
      if (l.titleKey) {
        const i = o(l.titleKey);
        if (i && i !== l.titleKey) return i;
      }
      return l.title || l.id;
    }
    function S(l) {
      if (l.labelKey) {
        const i = o(l.labelKey);
        if (i && i !== l.labelKey) return i;
      }
      return l.label || l.key;
    }
    function x(l) {
      const i = Number(w(`life.emotion.${l.key}`) ?? 0);
      return l.scale === "remap01" ? (i + 1) / 2 : i;
    }
    function O(l) {
      if (l.value) return l.value;
      if (l.valueKey) {
        const i = o(l.valueKey);
        if (i !== l.valueKey) return i;
      }
      return "—";
    }
    function F(l) {
      if (l.empty) return l.empty;
      if (l.emptyKey) {
        const i = o(l.emptyKey);
        if (i !== l.emptyKey) return i;
      }
      return "—";
    }
    function z(l) {
      const i = w(l.listBind);
      return Array.isArray(i) ? i.map(String) : [];
    }
    const K = T(null), N = T([]), R = T(!1), B = M(() => u.statusSections.find((l) => l.kind === "memory") || null);
    async function H(l) {
      const i = l || B.value?.endpoint || "/api/life/memories";
      R.value = !0;
      try {
        const r = await fetch(i);
        if (r.ok) {
          const g = await r.json();
          K.value = g.stats || null, N.value = g.memories || [];
        }
      } catch {
        K.value = null, N.value = [];
      } finally {
        R.value = !1;
      }
    }
    let D = null;
    function U() {
      if (D && clearInterval(D), D = null, B.value) {
        const l = B.value.pollMs || 15e3;
        H(B.value.endpoint), D = setInterval(() => H(B.value?.endpoint), l);
      }
    }
    ae(
      () => [B.value?.endpoint, B.value?.pollMs, u.loaded],
      U,
      { immediate: !0 }
    ), ee(() => {
      B.value || U(), $ = setInterval(() => {
        y.value = /* @__PURE__ */ new Date();
      }, 1e3);
    }), re(() => {
      D && clearInterval(D), $ && clearInterval($);
    });
    const p = M(
      () => u.statusSections.filter((l) => l.kind === "mood" || l.kind === "bars")
    ), P = M(() => C.emotionColor), h = M(() => C.emotionMood), v = M(() => C.energyPercent), c = M(() => C.energyColor), d = M(() => C.onlineAgents), f = M(() => C.totalAgents), j = M(() => C.isConnected), X = M(() => C.source), A = M(() => C.activeTasks);
    return (l, i) => (t(), n("div", rt, [
      e("div", ct, [
        e("h2", null, a(s(o)("status.title")), 1),
        s(u).loaded ? (t(), n("span", ut, "patch")) : _("", !0)
      ]),
      e("div", dt, [
        e("section", ht, [
          e("div", vt, [
            e("span", mt, a(s(k).persona.name || s(o)("chat.defaultCharacter")), 1)
          ]),
          e("dl", null, [
            e("div", null, [
              e("dt", null, a(s(o)("status.age")), 1),
              e("dd", null, a(I.value === null ? s(o)("status.birthdayUnset") : s(o)("status.ageValue", { age: I.value })), 1)
            ]),
            e("div", null, [
              e("dt", null, a(s(o)("status.time")), 1),
              e("dd", null, [
                e("time", {
                  datetime: y.value.toISOString()
                }, a(y.value.toLocaleString()), 9, pt)
              ])
            ]),
            e("div", null, [
              e("dt", null, a(s(o)("status.timezone")), 1),
              e("dd", null, a(Intl.DateTimeFormat().resolvedOptions().timeZone), 1)
            ])
          ])
        ]),
        (t(!0), n(L, null, E(p.value, (r) => (t(), n("div", {
          key: r.id,
          class: "section",
          "data-section": r.id,
          "data-kind": r.kind
        }, [
          e("div", ft, [
            e("span", gt, a(m(r)), 1),
            r.kind === "bar" ? (t(), n("span", kt, a(v.value) + "%", 1)) : r.kind === "count" ? (t(), n("span", _t, a(d.value), 1)) : r.kind === "tasks" ? (t(), n("span", wt, a(A.value.length), 1)) : r.kind === "memory" ? (t(), n("button", {
              key: 3,
              class: "link-btn",
              type: "button",
              disabled: R.value,
              onClick: (g) => H(r.endpoint)
            }, a(s(o)("memory.refresh")), 9, bt)) : _("", !0)
          ]),
          r.kind === "mood" ? (t(), n("div", Ct, [
            e("div", {
              class: "mood-icon",
              style: Y({ color: P.value })
            }, [
              h.value === "happy" ? (t(), n("svg", $t, [...i[0] || (i[0] = [
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
              ])])) : h.value === "sad" ? (t(), n("svg", xt, [...i[1] || (i[1] = [
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
              ])])) : h.value === "irritated" ? (t(), n("svg", Mt, [...i[2] || (i[2] = [
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
              ])])) : h.value === "sleeping" ? (t(), n("svg", St, [...i[3] || (i[3] = [
                le('<circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" data-v-16905aa0></circle><path d="M16 22C17 22 18 22 18 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-16905aa0></path><path d="M30 22C31 22 32 22 32 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-16905aa0></path><path d="M18 32C20 34 28 34 30 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-16905aa0></path><text x="36" y="12" fill="currentColor" font-size="12" font-weight="bold" data-v-16905aa0>Z</text>', 5)
              ])])) : (t(), n("svg", It, [...i[4] || (i[4] = [
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
              style: Y({ color: P.value })
            }, a(s(o)(`emotion.${h.value}`)), 5)
          ])) : r.kind === "bar" ? (t(), n("div", Tt, [
            e("div", {
              class: "energy-fill",
              style: Y({ transform: `scaleX(${v.value / 100})`, backgroundColor: c.value })
            }, null, 4)
          ])) : r.kind === "bars" ? (t(), n("div", Pt, [
            (t(!0), n(L, null, E(r.axes || [], (g) => (t(), n("div", {
              key: g.key,
              class: "emotion-row"
            }, [
              e("span", Lt, a(S(g)), 1),
              e("div", Bt, [
                e("div", {
                  class: "emotion-fill",
                  style: Y({
                    transform: `scaleX(${Math.max(0, Math.min(1, x(g)))})`,
                    backgroundColor: g.color || "#0078d4"
                  })
                }, null, 4)
              ])
            ]))), 128))
          ])) : r.kind === "count" ? (t(), n("div", Kt, [
            e("div", Dt, [
              e("span", {
                class: V(["agent-number", { online: d.value > 0 }])
              }, a(d.value), 3),
              e("span", Et, a(s(o)("status.agentsOnline")), 1)
            ]),
            f.value > d.value ? (t(), n("div", Ot, a(f.value - d.value) + " " + a(s(o)("status.agentsOffline")), 1)) : _("", !0)
          ])) : r.kind === "tasks" ? (t(), n("div", At, [
            A.value.length === 0 ? (t(), n("div", Ft, a(F(r)), 1)) : (t(), n("div", Nt, [
              (t(!0), n(L, null, E(A.value, (g) => (t(), n("div", {
                key: g,
                class: "task-item"
              }, [
                e("span", Rt, a(g.substring(0, 8)) + "...", 1),
                e("span", zt, a(s(o)("status.running")), 1)
              ]))), 128))
            ]))
          ])) : r.kind === "list" ? (t(), n("div", Ht, [
            z(r).length === 0 ? (t(), n("div", Vt, a(F(r)), 1)) : (t(), n("div", Ut, [
              (t(!0), n(L, null, E(z(r), (g) => (t(), n("div", {
                key: g,
                class: "task-item"
              }, [
                e("span", jt, a(g), 1)
              ]))), 128))
            ]))
          ])) : r.kind === "memory" ? (t(), n("div", Yt, [
            K.value ? (t(), n("div", Xt, [
              e("div", Wt, [
                e("span", Zt, a(s(o)("memory.working")), 1),
                e("span", Gt, a(K.value.working), 1)
              ]),
              e("div", Jt, [
                e("span", qt, a(s(o)("memory.shortTerm")), 1),
                e("span", Qt, a(K.value.shortTerm), 1)
              ]),
              e("div", en, [
                e("span", tn, a(s(o)("memory.longTerm")), 1),
                e("span", nn, a(K.value.longTerm), 1)
              ])
            ])) : _("", !0),
            N.value.length === 0 ? (t(), n("div", sn, a(s(o)("memory.empty")), 1)) : (t(), n("div", on, [
              (t(!0), n(L, null, E(N.value.slice(0, 5), (g) => (t(), n("div", {
                key: g.id,
                class: "memory-item",
                title: g.content
              }, [
                e("span", ln, a(g.content), 1),
                e("span", rn, a(Math.round((g.strength || 0) * 100)) + "%", 1)
              ], 8, an))), 128))
            ]))
          ])) : r.kind === "connection" ? (t(), n("div", cn, [
            e("span", {
              class: V(["connection-dot", { connected: j.value }])
            }, null, 2),
            e("span", null, a(j.value ? s(o)("status.connectedTo") : s(o)("chat.disconnected")), 1),
            X.value === "core" ? (t(), n("span", un, "Core")) : _("", !0)
          ])) : (t(), n("div", dn, [
            e("span", null, a(O(r)), 1)
          ]))
        ], 8, yt))), 128)),
        s(u).statusSections.length === 0 ? (t(), n("div", hn, " No status sections (load life.patch) ")) : _("", !0)
      ])
    ]));
  }
}), mn = /* @__PURE__ */ q(vn, [["__scopeId", "data-v-16905aa0"]]), pn = {
  key: 0,
  class: "stage-column"
}, yn = ["src", "title"], fn = ["data-chat-slot"], gn = ["aria-label", "title"], kn = ["src", "title"], _n = ["data-chat-slot"], wn = ["title"], ne = "0kay.web.chat_panel_width_ratio", se = 320, bn = 360, oe = 960, Cn = /* @__PURE__ */ G({
  __name: "ChatPage",
  setup(b) {
    const { t: o } = J(), C = de(), u = ce(), k = T(!1), y = T(!1), I = M(() => C.chatRegion("stage")), $ = M(() => C.chatRegion("chat")), w = M(() => I.value.some((p) => p.component === "status")), m = M(() => $.value.some((p) => p.component === "chat")), S = T(0.34), x = T(null);
    let O = !1;
    function F() {
      try {
        const p = Number(localStorage.getItem(ne));
        p > 0 && p < 1 && (S.value = p);
      } catch {
      }
    }
    function z(p) {
      S.value = p;
      try {
        localStorage.setItem(ne, String(p));
      } catch {
      }
    }
    function K(p, P) {
      const h = Math.min(se, p * 0.3), v = Math.min(oe, p - bn);
      return Math.min(Math.max(P, h), v) / p;
    }
    function N(p) {
      y.value || (O = !0, p.target.setPointerCapture?.(p.pointerId), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none");
    }
    function R(p) {
      if (!O || !x.value) return;
      const P = x.value.getBoundingClientRect(), h = P.right - p.clientX;
      z(K(P.width, h));
    }
    function B() {
      O && (O = !1, document.body.style.cursor = "", document.body.style.userSelect = "");
    }
    function H(p) {
      if (y.value || p.key !== "ArrowLeft" && p.key !== "ArrowRight") return;
      const P = x.value;
      if (!P) return;
      p.preventDefault();
      const h = P.getBoundingClientRect(), v = S.value * h.width, c = p.key === "ArrowLeft" ? v + 24 : v - 24;
      z(K(h.width, c));
    }
    function D() {
      const p = y.value;
      y.value = window.innerWidth <= 960, y.value ? p || (k.value = !1) : k.value = !0;
    }
    ee(() => {
      F(), D(), u.setChatVisible(!0), window.addEventListener("resize", D), window.addEventListener("pointermove", R), window.addEventListener("pointerup", B);
    }), re(() => {
      u.setChatVisible(!1), window.removeEventListener("resize", D), window.removeEventListener("pointermove", R), window.removeEventListener("pointerup", B), document.body.style.cursor = "", document.body.style.userSelect = "";
    });
    function U() {
      k.value = !k.value;
    }
    return (p, P) => (t(), n("div", {
      ref_key: "pageEl",
      ref: x,
      class: V(["chat-page", { "no-chat": !m.value }]),
      style: Y(y.value ? void 0 : { "--chat-w": `min(${oe}px, max(${se}px, ${S.value * 100}%))` })
    }, [
      I.value.length ? (t(), n("div", pn, [
        (t(!0), n(L, null, E(I.value, (h) => (t(), n(L, {
          key: h.id
        }, [
          h.component === "live2d" ? (t(), Z(ye, {
            key: 0,
            class: "stage-host"
          })) : h.component === "status" ? (t(), Z(mn, {
            key: 1,
            class: "status-panel"
          })) : h.component === "iframe" && h.src ? (t(), n("iframe", {
            key: 2,
            class: "slot-frame",
            src: h.src,
            title: h.title || h.id
          }, null, 8, yn)) : (t(), n("div", {
            key: 3,
            class: "slot-note",
            "data-chat-slot": h.id
          }, a(h.titleKey ? s(o)(h.titleKey) : h.title || h.id), 9, fn))
        ], 64))), 128))
      ])) : _("", !0),
      !y.value && m.value && I.value.length ? (t(), n("div", {
        key: 1,
        ref: "resizer",
        class: "page-resizer",
        role: "separator",
        "aria-orientation": "vertical",
        tabindex: "0",
        "aria-label": s(o)("chat.resizePanel"),
        title: s(o)("chat.resizePanel"),
        onPointerdown: N,
        onKeydown: H
      }, null, 40, gn)) : _("", !0),
      m.value ? ie((t(), n("div", {
        key: 2,
        class: V(["chat-column", { open: k.value && y.value }])
      }, [
        (t(!0), n(L, null, E($.value, (h) => (t(), n(L, {
          key: h.id
        }, [
          h.component === "chat" ? (t(), Z(it, { key: 0 })) : h.component === "iframe" && h.src ? (t(), n("iframe", {
            key: 1,
            class: "slot-frame fill",
            src: h.src,
            title: h.title || h.id
          }, null, 8, kn)) : (t(), n("div", {
            key: 2,
            class: "slot-note",
            "data-chat-slot": h.id
          }, a(h.titleKey ? s(o)(h.titleKey) : h.title || h.id), 9, _n))
        ], 64))), 128))
      ], 2)), [
        [me, k.value || !y.value]
      ]) : _("", !0),
      y.value && w.value ? (t(), n("button", {
        key: 3,
        class: "status-fab",
        title: s(o)("app.status"),
        onClick: U
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
      ])], 8, wn)) : _("", !0)
    ], 6));
  }
}), Tn = /* @__PURE__ */ q(Cn, [["__scopeId", "data-v-ea28c256"]]);
export {
  Tn as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('webui-plugin-style')){const s=document.createElement('style');s.id='webui-plugin-style';s.textContent=".live2d-stage[data-v-594879d8]{display:flex;flex-direction:column;background:var(--md-surface-container);border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--md-outline-variant);min-height:320px}.stage-viewport[data-v-594879d8]{position:relative;flex:1;min-height:260px;overflow:hidden;touch-action:none;cursor:grab;user-select:none;background:radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood, #6750A4) 22%,transparent),transparent 55%),radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood, #6750A4) 12%,transparent),transparent 50%),linear-gradient(180deg,#f3edf7,#e7e0ec 55%,#d0bcff33)}.stage-viewport[data-v-594879d8]:active{cursor:grabbing}.stage-canvas[data-v-594879d8]{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none}.stage-gradient[data-v-594879d8]{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(33,0,93,.18) 100%)}.stage-hint[data-v-594879d8]{position:absolute;left:10px;top:10px;z-index:3;padding:4px 10px;border-radius:var(--radius-full);background:color-mix(in srgb,var(--md-inverse-surface) 75%,transparent);color:var(--md-inverse-on-surface);font-size:12px;text-transform:capitalize;pointer-events:none}.stage-reset[data-v-594879d8]{position:absolute;top:10px;right:10px;z-index:20;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid color-mix(in srgb,var(--md-on-surface) 10%,transparent);border-radius:50%;background:color-mix(in srgb,var(--md-surface) 55%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);color:var(--md-on-surface);font:inherit;font-size:16px;line-height:1;cursor:grab;touch-action:none;opacity:.7;transition:opacity var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out)}.stage-reset[data-v-594879d8]:hover{opacity:1;background:color-mix(in srgb,var(--md-surface) 82%,transparent)}.stage-reset[data-v-594879d8]:active{transform:scale(.96)}.stage-reset.dragging[data-v-594879d8]{cursor:grabbing;opacity:1}.stage-placeholder[data-v-594879d8]{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-md);background:color-mix(in srgb,var(--md-surface) 72%,transparent);color:var(--md-on-surface-variant);font-size:14px;text-align:center;padding:var(--space-lg)}.stage-status[data-v-594879d8]{position:absolute;left:var(--space-md);bottom:var(--space-md);z-index:5;padding:6px 12px;border-radius:var(--radius-full);background:var(--md-inverse-surface);color:var(--md-inverse-on-surface);font-size:12px}.stage-status.warn[data-v-594879d8]{background:var(--md-error-container);color:var(--md-on-error-container);max-width:90%;word-break:break-word}.message[data-v-31946fce]{display:flex;gap:var(--space-md);animation:slideUp .2s ease}.message.user[data-v-31946fce]{flex-direction:row-reverse}.avatar[data-v-31946fce]{flex-shrink:0;width:32px;height:32px;border-radius:var(--radius-round);display:flex;align-items:center;justify-content:center}.user-avatar[data-v-31946fce]{background:var(--neutral-gray-60);color:var(--neutral-white)}.assistant-avatar[data-v-31946fce]{background:var(--brand-primary);color:var(--neutral-white)}.images[data-v-31946fce]{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}.msg-img[data-v-31946fce]{max-width:240px;max-height:240px;border-radius:var(--radius-md);object-fit:cover;display:block}.files[data-v-31946fce]{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.msg-file[data-v-31946fce]{display:inline-flex;align-items:center;max-width:240px;padding:5px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);color:var(--neutral-gray-60);font-size:var(--font-size-xs);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msg-file[data-v-31946fce]:hover{border-color:var(--brand-primary);color:var(--brand-primary)}.content-wrapper[data-v-31946fce]{max-width:70%}.content[data-v-31946fce]{padding:var(--space-md) var(--space-lg);border-radius:var(--radius-lg);line-height:1.5;white-space:pre-wrap;word-break:break-word}.user .content[data-v-31946fce]{background:var(--brand-primary);color:var(--neutral-white);border-bottom-right-radius:var(--radius-sm)}.assistant .content[data-v-31946fce]{background:var(--neutral-white);color:var(--neutral-gray-70);border-bottom-left-radius:var(--radius-sm);box-shadow:var(--shadow-2)}.think-panel[data-v-31946fce]{margin-top:6px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low)}.think-toggle[data-v-31946fce]{width:100%;display:flex;justify-content:space-between;align-items:center;border:0;background:transparent;padding:7px 10px;color:var(--md-on-surface-variant);font:600 12px/1.2 monospace;letter-spacing:.06em;cursor:pointer}.think-body[data-v-31946fce]{padding:0 10px 9px;color:var(--md-on-surface-variant);font-size:12px;line-height:1.45}.think-body p[data-v-31946fce]{margin:4px 0}.think-body b[data-v-31946fce]{color:var(--md-on-surface)}.think-summary[data-v-31946fce]{margin:6px 0;color:var(--md-on-surface);line-height:1.55}.think-raw[data-v-31946fce]{margin:6px 0;white-space:pre-wrap;max-height:420px;overflow:auto;color:var(--md-on-surface);font:12px/1.5 monospace}.meta[data-v-31946fce]{display:flex;align-items:center;gap:var(--space-xs);margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.user .meta[data-v-31946fce]{justify-content:flex-end}.separator[data-v-31946fce]{color:var(--neutral-gray-10)}.emotion[data-v-31946fce]{font-weight:500}.chat-panel[data-v-12162d94]{display:flex;flex-direction:column;height:100%;background:var(--neutral-gray-2)}.context-btn[data-v-12162d94]{border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);min-height:32px;padding:7px 12px;font-size:12px;cursor:pointer;transition:background-color var(--transition-fast),border-color var(--transition-fast),color var(--transition-fast)}.context-btn[data-v-12162d94]:disabled{opacity:.6;cursor:wait}.context-btn.danger[data-v-12162d94]{color:var(--md-error)}.chat-container[data-v-12162d94]{flex:1;overflow-y:auto;padding:var(--space-xl)}.messages[data-v-12162d94]{max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:var(--space-md)}.empty-state[data-v-12162d94]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--neutral-gray-30)}.empty-icon[data-v-12162d94]{margin-bottom:var(--space-xl);opacity:.5}.empty-state h3[data-v-12162d94]{font-size:var(--font-size-lg);font-weight:600;color:var(--neutral-gray-50);margin-bottom:var(--space-sm)}.empty-state p[data-v-12162d94]{font-size:var(--font-size-base);color:var(--neutral-gray-30)}.typing-indicator[data-v-12162d94]{display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-md);color:var(--neutral-gray-30);font-size:var(--font-size-sm)}.typing-dots[data-v-12162d94]{display:flex;gap:4px}.typing-dots span[data-v-12162d94]{width:6px;height:6px;background:var(--neutral-gray-20);border-radius:50%;animation:bounce-12162d94 1.4s infinite ease-in-out}.typing-dots span[data-v-12162d94]:nth-child(1){animation-delay:-.32s}.typing-dots span[data-v-12162d94]:nth-child(2){animation-delay:-.16s}@keyframes bounce-12162d94{0%,80%,to{transform:scale(.5);opacity:.45}40%{transform:scale(1);opacity:1}}.input-area[data-v-12162d94]{padding:var(--space-lg) var(--space-xl);background:var(--neutral-white);border-top:1px solid var(--neutral-gray-6)}.input-wrapper[data-v-12162d94]{display:flex;align-items:flex-end;gap:var(--space-sm);max-width:800px;margin:0 auto;padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-lg);border:1px solid transparent;transition:background-color var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast)}.input-wrapper[data-v-12162d94]:focus-within{background:var(--neutral-white);border-color:var(--brand-primary);box-shadow:0 0 0 2px var(--brand-light)}.message-input[data-v-12162d94]{flex:1;padding:var(--space-sm) var(--space-md);font-size:var(--font-size-base);font-family:inherit;border:none;background:transparent;resize:none;outline:none;min-height:24px;max-height:120px}.message-input[data-v-12162d94]::placeholder{color:var(--neutral-gray-20)}.pending-images[data-v-12162d94],.pending-files[data-v-12162d94]{display:flex;flex-wrap:wrap;gap:8px;max-width:800px;margin:0 auto var(--space-sm)}.pending-file[data-v-12162d94]{display:inline-flex;align-items:center;gap:6px;max-width:240px;padding:6px 6px 6px 12px;border-radius:var(--radius-round);background:var(--neutral-gray-4);border:1px solid var(--neutral-gray-6);font-size:var(--font-size-xs);color:var(--neutral-gray-50);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.remove-file[data-v-12162d94]{border:none;background:transparent;color:var(--neutral-gray-30);font-size:14px;line-height:1;cursor:pointer;padding:0 4px}.remove-file[data-v-12162d94]:hover{color:var(--error)}.pending-thumb[data-v-12162d94]{position:relative;width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--neutral-gray-6)}.pending-thumb img[data-v-12162d94]{width:100%;height:100%;object-fit:cover}.remove-img[data-v-12162d94]{position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;border-radius:50%;background:#000000a6;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}.attach-btn[data-v-12162d94]{flex-shrink:0;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:transparent;color:var(--neutral-gray-30);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background-color var(--transition-fast),color var(--transition-fast)}.attach-btn[data-v-12162d94]:hover:not(:disabled){background:var(--neutral-gray-6);color:var(--neutral-gray-50)}.attach-btn[data-v-12162d94]:disabled{opacity:.5;cursor:not-allowed}.send-button[data-v-12162d94]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:var(--radius-round);background:var(--brand-primary);color:var(--neutral-white);cursor:pointer;transition:background-color var(--transition-fast),transform var(--duration-short) var(--ease-out)}.send-button[data-v-12162d94]:hover:not(:disabled){background:var(--brand-hover)}.send-button[data-v-12162d94]:disabled{background:var(--neutral-gray-8);cursor:not-allowed}.input-footer[data-v-12162d94]{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:var(--space-sm);max-width:800px;margin-left:auto;margin-right:auto;padding:0 var(--space-sm)}.connection-status[data-v-12162d94]{display:flex;align-items:center;gap:var(--space-xs);font-size:var(--font-size-xs)}.status-dot[data-v-12162d94]{width:6px;height:6px;border-radius:50%}.connected .status-dot[data-v-12162d94]{background:var(--success)}.disconnected .status-dot[data-v-12162d94]{background:var(--error)}.hint[data-v-12162d94]{font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.character-profile dl>div[data-v-16905aa0]{display:flex;justify-content:space-between;gap:12px;margin:10px 0;font-size:12px}.character-profile dt[data-v-16905aa0]{color:var(--md-on-surface-variant);flex-shrink:0}.character-profile dd[data-v-16905aa0]{margin:0;text-align:right;overflow-wrap:anywhere}.status-panel[data-v-16905aa0]{display:flex;flex-direction:column;height:100%;background:var(--neutral-white)}.panel-header[data-v-16905aa0]{display:flex;align-items:center;justify-content:space-between;padding:var(--space-lg) var(--space-xl);border-bottom:1px solid var(--neutral-gray-6)}.panel-header h2[data-v-16905aa0]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-70)}.patch-badge[data-v-16905aa0]{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--brand-primary);background:color-mix(in srgb,var(--brand-primary) 12%,transparent);padding:2px 8px;border-radius:var(--radius-full)}.panel-content[data-v-16905aa0]{flex:1;overflow-y:auto;padding:var(--space-lg)}.section[data-v-16905aa0]{margin-bottom:var(--space-xl)}.section-header[data-v-16905aa0]{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md)}.section-title[data-v-16905aa0]{font-size:var(--font-size-sm);font-weight:600;color:var(--neutral-gray-50);text-transform:uppercase;letter-spacing:.5px}.section-value[data-v-16905aa0]{font-size:var(--font-size-sm);color:var(--neutral-gray-30)}.mood-display[data-v-16905aa0]{display:flex;flex-direction:column;align-items:center;padding:var(--space-xl);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.mood-icon[data-v-16905aa0]{margin-bottom:var(--space-md)}.mood-label[data-v-16905aa0]{font-size:var(--font-size-md);font-weight:600}.energy-bar[data-v-16905aa0]{height:8px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.energy-fill[data-v-16905aa0]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out),background-color var(--duration-medium) var(--ease-out)}.emotion-bars[data-v-16905aa0]{display:flex;flex-direction:column;gap:var(--space-sm)}.emotion-row[data-v-16905aa0]{display:flex;align-items:center;gap:var(--space-md)}.emotion-label[data-v-16905aa0]{width:80px;font-size:var(--font-size-xs);color:var(--neutral-gray-40)}.emotion-bar[data-v-16905aa0]{flex:1;height:6px;background:var(--neutral-gray-6);border-radius:var(--radius-sm);overflow:hidden}.emotion-fill[data-v-16905aa0]{height:100%;width:100%;transform-origin:left;border-radius:var(--radius-sm);transition:transform var(--duration-medium) var(--ease-out)}.empty-tasks[data-v-16905aa0]{padding:var(--space-md);text-align:center;color:var(--neutral-gray-20);font-size:var(--font-size-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-list[data-v-16905aa0]{display:flex;flex-direction:column;gap:var(--space-sm)}.task-item[data-v-16905aa0]{display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-sm)}.task-id[data-v-16905aa0]{font-family:monospace;font-size:var(--font-size-sm);color:var(--neutral-gray-50)}.task-status[data-v-16905aa0]{font-size:var(--font-size-xs);color:var(--brand-primary)}.connection-info[data-v-16905aa0]{display:flex;align-items:center;gap:var(--space-sm);font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.link-btn[data-v-16905aa0]{border:none;background:none;color:var(--brand-primary);font-size:var(--font-size-xs);cursor:pointer;padding:0}.link-btn[data-v-16905aa0]:disabled{opacity:.5;cursor:default}.memory-stats[data-v-16905aa0]{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);margin-bottom:var(--space-sm)}.memory-stat[data-v-16905aa0]{padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);text-align:center}.memory-stat-label[data-v-16905aa0]{display:block;font-size:var(--font-size-xs);color:var(--neutral-gray-30);margin-bottom:2px}.memory-stat-value[data-v-16905aa0]{font-size:var(--font-size-md);font-weight:600;color:var(--neutral-gray-50)}.memory-list[data-v-16905aa0]{display:flex;flex-direction:column;gap:var(--space-xs)}.memory-item[data-v-16905aa0]{display:flex;justify-content:space-between;align-items:center;gap:var(--space-sm);padding:var(--space-sm);background:var(--neutral-gray-4);border-radius:var(--radius-sm);font-size:var(--font-size-sm)}.memory-text[data-v-16905aa0]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--neutral-gray-50)}.memory-strength[data-v-16905aa0]{font-size:var(--font-size-xs);color:var(--brand-primary);font-weight:600}.connection-dot[data-v-16905aa0]{width:8px;height:8px;border-radius:50%;background:var(--error)}.connection-dot.connected[data-v-16905aa0]{background:var(--success)}.state-source[data-v-16905aa0]{margin-left:auto;font-size:var(--font-size-xs);font-weight:700;color:var(--brand-primary);letter-spacing:.5px}.agents-display[data-v-16905aa0]{padding:var(--space-md);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.agent-count[data-v-16905aa0]{display:flex;align-items:baseline;gap:var(--space-sm)}.agent-number[data-v-16905aa0]{font-size:var(--font-size-xl);font-weight:700;color:var(--neutral-gray-30)}.agent-number.online[data-v-16905aa0]{color:var(--success)}.agent-label[data-v-16905aa0]{font-size:var(--font-size-sm);color:var(--neutral-gray-40)}.agent-offline[data-v-16905aa0]{margin-top:var(--space-xs);font-size:var(--font-size-xs);color:var(--neutral-gray-20)}.chat-page[data-v-ea28c256]{position:relative;display:grid;grid-template-columns:minmax(360px,1fr) 6px minmax(320px,var(--chat-w, 34%));flex:1;height:100%;min-height:0;background:var(--md-surface)}.chat-page.no-chat[data-v-ea28c256]{grid-template-columns:1fr}.stage-column[data-v-ea28c256]{min-width:0;min-height:0;display:flex;flex-direction:column;gap:var(--space-md);padding:var(--space-md);overflow:hidden}.stage-host[data-v-ea28c256]{flex:1;min-height:240px}.status-panel[data-v-ea28c256]{flex:0 0 auto;max-height:40%;background:transparent;border-radius:var(--radius-lg);border:1px solid var(--md-outline-variant);overflow:hidden}.slot-frame[data-v-ea28c256]{flex:1;min-height:200px;border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);background:var(--neutral-white)}.slot-frame.fill[data-v-ea28c256]{flex:1;width:100%;height:100%;border:none;border-radius:0}.slot-note[data-v-ea28c256]{padding:var(--space-md);font-size:var(--font-size-sm);color:var(--neutral-gray-40);background:var(--neutral-gray-4);border-radius:var(--radius-md)}.page-resizer[data-v-ea28c256]{cursor:col-resize;background:var(--md-outline-variant);transition:background var(--transition-fast)}.page-resizer[data-v-ea28c256]:hover,.page-resizer[data-v-ea28c256]:active{background:var(--md-primary)}.chat-column[data-v-ea28c256]{min-width:0;min-height:0;display:flex;flex-direction:column;border-left:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.status-fab[data-v-ea28c256]{position:absolute;right:var(--space-lg);bottom:var(--space-lg);width:56px;height:56px;border:none;border-radius:var(--radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow-3);z-index:6}@media(max-width:960px){.chat-page[data-v-ea28c256]{display:flex;flex-direction:column}.stage-column[data-v-ea28c256]{flex:1;min-height:0}.page-resizer[data-v-ea28c256]{display:none}.chat-column[data-v-ea28c256]{position:absolute;right:0;top:0;bottom:0;width:min(360px,92vw);z-index:5;box-shadow:var(--shadow-8);transform:translate(100%);transition:transform var(--transition-normal)}.chat-column.open[data-v-ea28c256]{transform:translate(0)}}.plugins-page[data-v-68f27c9f]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.pp-hero[data-v-68f27c9f]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.pp-eyebrow[data-v-68f27c9f]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.page-header h1[data-v-68f27c9f],.pp-hero h1[data-v-68f27c9f]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-68f27c9f]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.error-banner[data-v-68f27c9f]{padding:14px 18px;border-radius:18px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-68f27c9f]{padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.pp-stats[data-v-68f27c9f]{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-lg);margin-bottom:var(--space-lg)}.pp-stat[data-v-68f27c9f]{border-radius:24px;padding:18px 20px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow-1)}.pp-stat b[data-v-68f27c9f]{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.pp-stat span[data-v-68f27c9f]{font-size:12px;font-weight:700;letter-spacing:.04em;opacity:.8}.tone-primary[data-v-68f27c9f]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-success[data-v-68f27c9f]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-muted[data-v-68f27c9f]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.plugin-grid[data-v-68f27c9f]{display:grid;grid-template-columns:repeat(auto-fill,minmax(312px,1fr));gap:var(--space-lg)}#app .plugins-page .plugin-card[data-v-68f27c9f]{position:relative;border-radius:28px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);padding:22px;box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:16px;animation:pp-card-in-68f27c9f var(--duration-long) var(--ease-spring) both;cursor:pointer;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}@keyframes pp-card-in-68f27c9f{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(hover:hover)and (pointer:fine){#app .plugins-page .plugin-card[data-v-68f27c9f]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}}#app .plugins-page .plugin-card.healthy[data-v-68f27c9f]:before{content:\"\";position:absolute;left:0;top:22px;bottom:22px;width:4px;border-radius:999px;background:var(--md-success)}#app .plugins-page .plugin-card.disabled[data-v-68f27c9f]{opacity:.62}.plugin-top[data-v-68f27c9f]{display:flex;align-items:center;gap:14px}.plugin-icon[data-v-68f27c9f]{width:52px;height:52px;flex-shrink:0;border-radius:18px 18px 18px 7px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center}.plugin-titles[data-v-68f27c9f]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.plugin-titles h2[data-v-68f27c9f]{font-size:17px;font-weight:750;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.plugin-id[data-v-68f27c9f]{font-size:12px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.source-badge[data-v-68f27c9f]{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.source-badge.rt[data-v-68f27c9f]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.source-badge.pm[data-v-68f27c9f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.status-chip[data-v-68f27c9f]{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;flex-shrink:0;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.status-chip .status-dot[data-v-68f27c9f]{width:7px;height:7px;border-radius:50%;background:currentColor}.status-chip.ok[data-v-68f27c9f]{background:var(--md-success-container);color:var(--md-on-success-container)}.status-chip.off[data-v-68f27c9f]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.plugin-meta[data-v-68f27c9f]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}.plugin-meta div[data-v-68f27c9f]{display:flex;flex-direction:column;gap:3px;min-width:0}.plugin-meta dt[data-v-68f27c9f]{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}.plugin-meta dd[data-v-68f27c9f]{font-size:14px;font-weight:650;color:var(--md-on-surface);font-family:ui-monospace,monospace;overflow-wrap:anywhere;margin:0}.caps[data-v-68f27c9f]{display:flex;flex-wrap:wrap;gap:6px}.cap-chip[data-v-68f27c9f]{height:26px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:12px;font-weight:600;display:inline-flex;align-items:center}.cap-chip.muted[data-v-68f27c9f]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.card-actions[data-v-68f27c9f]{display:flex;gap:var(--space-sm);margin-top:auto;align-items:center;flex-wrap:wrap}.plugin-switch[data-v-68f27c9f]{display:inline-flex;align-items:center;gap:10px;min-height:44px;cursor:pointer;user-select:none;font-size:13px;font-weight:650;color:var(--md-on-surface-variant)}.plugin-switch input[data-v-68f27c9f]{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.plugin-switch-slider[data-v-68f27c9f]{width:50px;height:30px;flex-shrink:0;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);border-radius:999px;position:relative;transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.plugin-switch-slider[data-v-68f27c9f]:after{content:\"\";position:absolute;top:50%;left:4px;width:18px;height:18px;background:var(--md-outline);border-radius:50%;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out)}.plugin-switch input:focus-visible+.plugin-switch-slider[data-v-68f27c9f]{outline:3px solid var(--md-primary);outline-offset:2px}.plugin-switch.on .plugin-switch-slider[data-v-68f27c9f]{background:var(--md-primary);border-color:var(--md-primary)}.plugin-switch.on .plugin-switch-slider[data-v-68f27c9f]:after{transform:translateY(-50%) translate(20px) scale(1.12);background:var(--md-on-primary)}.plugin-switch.busy[data-v-68f27c9f]{opacity:.6;cursor:wait}.plugin-switch-label[data-v-68f27c9f]{white-space:nowrap}#app .plugins-page .btn[data-v-68f27c9f]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .plugins-page .btn[data-v-68f27c9f]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .plugins-page .btn[data-v-68f27c9f]:disabled{opacity:.6;cursor:not-allowed}#app .plugins-page .btn-tonal[data-v-68f27c9f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .plugins-page .btn-danger[data-v-68f27c9f]{background:var(--md-error-container);color:var(--md-on-error-container)}.empty-state[data-v-68f27c9f]{grid-column:1 / -1;padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);border-radius:32px;color:var(--md-on-surface-variant)}.empty-state p[data-v-68f27c9f]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-68f27c9f]{font-size:13px;margin-top:8px;font-weight:400;opacity:.8}.pd-scrim[data-v-68f27c9f]{position:fixed;inset:0;z-index:var(--z-modal);background:var(--md-scrim);backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.pd-dialog[data-v-68f27c9f]{width:min(760px,100%);max-height:min(86vh,900px);display:flex;flex-direction:column;background:var(--md-surface-container-high);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:28px;padding:26px;box-shadow:0 24px 70px #18132d33}.pd-enter-active[data-v-68f27c9f]{transition:opacity var(--duration-medium) var(--ease-out)}.pd-leave-active[data-v-68f27c9f]{transition:opacity var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from[data-v-68f27c9f],.pd-leave-to[data-v-68f27c9f]{opacity:0}.pd-enter-active .pd-dialog[data-v-68f27c9f]{transition:opacity var(--duration-long) var(--ease-emphasized-decel),transform var(--duration-long) var(--ease-emphasized-decel)}.pd-leave-active .pd-dialog[data-v-68f27c9f]{transition:opacity var(--duration-short) var(--ease-emphasized-accel),transform var(--duration-short) var(--ease-emphasized-accel)}.pd-enter-from .pd-dialog[data-v-68f27c9f],.pd-leave-to .pd-dialog[data-v-68f27c9f]{opacity:0;transform:translateY(12px) scale(.97)}.pd-head[data-v-68f27c9f]{display:flex;align-items:flex-start;gap:16px}.pd-titles[data-v-68f27c9f]{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.pd-titles h2[data-v-68f27c9f]{margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pd-pkg[data-v-68f27c9f]{font-size:13px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace;overflow-wrap:anywhere}.pd-close[data-v-68f27c9f]{border:0;background:transparent;color:var(--md-on-surface-variant);font-size:26px;line-height:1;width:44px;height:44px;border-radius:999px;cursor:pointer;flex-shrink:0}.pd-close[data-v-68f27c9f]:hover{background:var(--md-surface-container-highest)}.pd-meta[data-v-68f27c9f]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}.pd-chip[data-v-68f27c9f]{height:28px;padding:0 12px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.pd-chip.ok[data-v-68f27c9f]{background:var(--md-success-container);color:var(--md-on-success-container)}.pd-repo[data-v-68f27c9f]{font-size:13px;font-weight:650;color:var(--md-primary);text-decoration:underline;overflow-wrap:anywhere}.pd-body[data-v-68f27c9f]{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;margin:0 -4px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms[data-v-68f27c9f]{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;padding:14px 16px;border-radius:16px;background:var(--md-surface-container-low)}.pd-perms.builtin[data-v-68f27c9f]{color:var(--md-on-surface-variant);font-size:13px;font-weight:650}.pd-perms h4[data-v-68f27c9f]{margin:0 0 4px;font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-primary)}.pd-perms ul[data-v-68f27c9f]{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:2px}.pd-perms li[data-v-68f27c9f]{font-size:12.5px;font-family:ui-monospace,monospace;color:var(--md-on-surface);overflow-wrap:anywhere}.pd-hint[data-v-68f27c9f]{margin:0;padding:24px;text-align:center;color:var(--md-on-surface-variant);font-size:14px}.pd-hint.err[data-v-68f27c9f]{color:var(--md-error)}.pd-foot[data-v-68f27c9f]{display:flex;justify-content:flex-end;gap:12px;margin-top:20px;flex-wrap:wrap}.pd-foot .btn[data-v-68f27c9f]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;color:var(--md-on-surface);background:var(--md-surface-container-high);display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}.pd-foot .btn-tonal[data-v-68f27c9f]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pd-foot .btn-danger[data-v-68f27c9f]{background:var(--md-error-container);color:var(--md-on-error-container)}.pd-foot .btn[data-v-68f27c9f]:disabled{opacity:.6;cursor:not-allowed}@media(prefers-reduced-motion:reduce){.pd-enter-active[data-v-68f27c9f],.pd-leave-active[data-v-68f27c9f],.pd-enter-active .pd-dialog[data-v-68f27c9f],.pd-leave-active .pd-dialog[data-v-68f27c9f]{transition:none}.pd-enter-from .pd-dialog[data-v-68f27c9f],.pd-leave-to .pd-dialog[data-v-68f27c9f]{transform:none}}.life-settings[data-v-153238d0]{--ls-spring: var(--ease-spring);padding:4px}.ls-hero[data-v-153238d0]{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:22px;padding:clamp(22px,2.4vw,32px);border-radius:32px;background:radial-gradient(520px 260px at 100% 0%,color-mix(in srgb,var(--md-tertiary) 16%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-low)));color:var(--md-on-primary-container);box-shadow:var(--shadow-1);animation:ls-rise-153238d0 .52s var(--ls-spring) both}.ls-hero-main[data-v-153238d0]{min-width:0}.ls-eyebrow[data-v-153238d0]{display:inline-block;margin:0 0 10px;padding:4px 12px;border-radius:999px;background:color-mix(in srgb,var(--md-on-primary-container) 10%,transparent);font:800 12px/1 ui-monospace,monospace;letter-spacing:.16em}.ls-hero h2[data-v-153238d0]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.ls-sub[data-v-153238d0]{margin:10px 0 0;font-size:14px;line-height:1.6;opacity:.82;max-width:60ch}#app .ls-save[data-v-153238d0]{min-height:52px;padding:0 26px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 15px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 30%,transparent);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring)}@media(hover:hover)and (pointer:fine){#app .ls-save[data-v-153238d0]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}#app .ls-save[data-v-153238d0]:disabled{opacity:.55;cursor:not-allowed}.ls-save-ic[data-v-153238d0]{font-size:16px}.ls-grid[data-v-153238d0]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.ls-card[data-v-153238d0]{position:relative;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);border-radius:28px;padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow-1);transition:transform .3s var(--ls-spring),box-shadow .3s var(--ls-spring),border-color .3s;animation:ls-card-in-153238d0 .52s var(--ls-spring) both}@media(hover:hover)and (pointer:fine){.ls-card[data-v-153238d0]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 26%,var(--md-outline-variant))}}.ls-grid>.ls-card[data-v-153238d0]:nth-child(1){animation-delay:40ms}.ls-grid>.ls-card[data-v-153238d0]:nth-child(2){animation-delay:90ms}.ls-grid>.ls-card[data-v-153238d0]:nth-child(3){animation-delay:.14s}.ls-grid>.ls-card[data-v-153238d0]:nth-child(4){animation-delay:.19s}.ls-grid>.ls-card[data-v-153238d0]:nth-child(5){animation-delay:.24s}.ls-card-wide[data-v-153238d0]{grid-column:1 / -1}.ls-card-head[data-v-153238d0]{display:flex;align-items:center;gap:12px}.ls-card-head h3[data-v-153238d0]{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ls-ic[data-v-153238d0]{width:38px;height:38px;border-radius:16px 16px 16px 6px;display:grid;place-items:center;font-size:16px;flex-shrink:0}.tone-1[data-v-153238d0]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-153238d0]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-153238d0]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container)}.tone-4[data-v-153238d0]{background:var(--md-success-container);color:var(--md-on-success-container)}.tone-5[data-v-153238d0]{background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.ls-row[data-v-153238d0]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ls-note[data-v-153238d0]{margin:-4px 0 0;font-size:12px;color:var(--md-on-surface-variant)}.ls-label[data-v-153238d0]{margin:4px 0 -4px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.ls-empty[data-v-153238d0]{font-size:13px;color:var(--md-on-surface-variant);padding:8px 2px}.ls-field[data-v-153238d0]{display:flex;flex-direction:column;gap:6px}.ls-field>span[data-v-153238d0]{font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .ls-field input[data-v-153238d0]{width:100%;min-height:52px;padding:0 17px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:400 15px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ls-spring)}#app .ls-field input[data-v-153238d0]:hover{background-color:var(--md-surface-container-highest)}#app .ls-field input[data-v-153238d0]:focus{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .ls-field input[data-v-153238d0]:focus-visible{outline:3px solid var(--md-primary);outline-offset:2px}#app .ls-switch[data-v-153238d0]{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:20px;background:var(--md-surface-container-lowest);cursor:pointer;transition:background-color .2s,border-color .2s,box-shadow .22s,transform .26s var(--ls-spring)}#app .ls-switch[data-v-153238d0]:hover{background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.ls-switch input[data-v-153238d0]{position:absolute;opacity:0;width:0;height:0}.ls-switch-text[data-v-153238d0]{display:flex;flex-direction:column;gap:2px}.ls-switch-text b[data-v-153238d0]{font-size:14px;font-weight:700}.ls-switch-text small[data-v-153238d0]{font-size:12px;color:var(--md-on-surface-variant)}.ls-track[data-v-153238d0]{position:relative;width:54px;height:32px;flex-shrink:0;border-radius:999px;background:var(--md-surface-container-highest);border:2px solid var(--md-outline);transition:background-color var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.ls-track[data-v-153238d0]:after{content:\"✓\";display:grid;place-items:center;position:absolute;top:50%;left:5px;width:18px;height:18px;border-radius:50%;background:var(--md-outline);color:transparent;font-size:12px;font-weight:900;line-height:1;transform:translateY(-50%) translate(0) scale(1);transition:transform var(--duration-medium) var(--ease-spring-soft),background-color var(--duration-medium) var(--ease-out),color var(--duration-medium) var(--ease-out)}.ls-switch input:focus-visible+.ls-track[data-v-153238d0]{outline:3px solid var(--md-primary);outline-offset:2px}.ls-switch input:checked+.ls-track[data-v-153238d0]{background:var(--md-primary);border-color:var(--md-primary)}.ls-switch input:checked+.ls-track[data-v-153238d0]:after{transform:translateY(-50%) translate(22px) scale(1.2);background:var(--md-on-primary);color:var(--md-primary)}.ls-models[data-v-153238d0]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ls-model[data-v-153238d0]{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:13px 15px;border:2px solid var(--md-outline-variant);border-radius:20px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);cursor:pointer;transition:border-color .24s var(--ls-spring),background-color .24s var(--ls-spring),transform .26s var(--ls-spring),border-radius .36s var(--ls-spring)}@media(hover:hover)and (pointer:fine){.ls-model[data-v-153238d0]:hover{transform:translateY(-2px);background:var(--md-surface-container)}}.ls-model.selected[data-v-153238d0]{border-color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:20px 20px 20px 8px}.ls-model.selected[data-v-153238d0]:after{content:\"✓\";position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:var(--md-primary);color:var(--md-on-primary);font-size:12px;font-weight:900}.ls-model b[data-v-153238d0]{font-size:13px;word-break:break-all}.ls-model span[data-v-153238d0]{font-size:12px;color:var(--md-on-surface-variant)}.ls-state[data-v-153238d0]{margin:18px 0 0;padding:14px 18px;border-radius:18px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px;font-weight:650;animation:ls-rise-153238d0 .32s var(--ls-spring) both}@keyframes ls-rise-153238d0{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes ls-card-in-153238d0{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:760px){.ls-grid[data-v-153238d0],.ls-row[data-v-153238d0],.ls-models[data-v-153238d0]{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.ls-hero[data-v-153238d0],.ls-card[data-v-153238d0],.ls-state[data-v-153238d0]{animation:none}}.about[data-v-979e4119]{display:flex;flex-direction:column;gap:26px}.identity[data-v-979e4119]{display:flex;align-items:center;gap:16px}.app-icon[data-v-979e4119]{flex:none;width:56px;height:56px;border-radius:16px;background:var(--md-primary);color:var(--md-on-primary);display:grid;place-items:center;font-size:20px;font-weight:750;letter-spacing:-1px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 35%,transparent)}.app-id[data-v-979e4119]{flex:1;min-width:0}.app-id h2[data-v-979e4119]{margin:0;display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;letter-spacing:-.3px}.ver-badge[data-v-979e4119]{font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.app-desc[data-v-979e4119]{margin:4px 0 0;font-size:14px;color:var(--md-on-surface-variant)}.identity-actions[data-v-979e4119]{display:flex;gap:8px;flex-wrap:wrap}.section[data-v-979e4119]{display:flex;flex-direction:column;gap:14px}.section-head[data-v-979e4119]{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.section-title[data-v-979e4119]{display:flex;align-items:center;gap:8px;margin:0;font-size:17px;font-weight:650;color:var(--md-on-surface)}.section-title[data-v-979e4119]:before{content:\"\";width:4px;height:16px;border-radius:2px;background:var(--md-primary)}.btn.sm[data-v-979e4119]{height:34px;padding-inline:16px;font-size:13px}.credits[data-v-979e4119]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.person[data-v-979e4119]{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.person[data-v-979e4119]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.person img[data-v-979e4119]{width:54px;height:54px;border-radius:50%;flex:none;box-shadow:0 0 0 3px var(--md-surface-container-low),0 0 0 4px var(--md-outline-variant)}.person-info[data-v-979e4119]{display:flex;flex-direction:column;min-width:0}.person-info .name[data-v-979e4119]{font-size:16px;font-weight:650}.person-info .role[data-v-979e4119]{font-size:13px;color:var(--md-on-surface-variant)}.person .go[data-v-979e4119]{margin-left:auto;color:var(--md-primary);font-weight:700}.contributors-head[data-v-979e4119]{margin-top:6px}.contribs[data-v-979e4119]{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}.contrib[data-v-979e4119]{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:16px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);text-decoration:none;color:inherit;transition:border-color .18s,background-color .18s,transform .2s}.contrib[data-v-979e4119]:hover{border-color:var(--md-primary);background:var(--md-surface-container);transform:translateY(-1px)}.contrib img[data-v-979e4119]{width:46px;height:46px;border-radius:50%}.contrib .login[data-v-979e4119]{font-size:12px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contrib .count[data-v-979e4119]{font-size:12px;color:var(--md-on-surface-variant)}.foot[data-v-979e4119]{display:flex;align-items:center;gap:12px;padding-top:18px;border-top:1px solid var(--md-outline-variant);font-size:13px;color:var(--md-on-surface-variant)}.foot .repo-link[data-v-979e4119]{margin-left:auto}.status-chip[data-v-979e4119]{height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.repo-link[data-v-979e4119]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.repo-link[data-v-979e4119]:hover{text-decoration:underline}.muted[data-v-979e4119]{color:var(--md-on-surface-variant);font-size:12px}.us-hero[data-v-979e4119]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-979e4119]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-979e4119]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-979e4119]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-979e4119]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-979e4119]{flex:1;min-width:0}.us-hero-text b[data-v-979e4119]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-979e4119]{font-size:13px;opacity:.85}.us-hero-text em[data-v-979e4119]{font-style:normal;font-weight:700}.us-hero-actions[data-v-979e4119]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-979e4119]{background:var(--md-primary);color:var(--md-on-primary)}.us-notes[data-v-979e4119]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.us-notes-title[data-v-979e4119]{margin:0;font-size:13px;font-weight:700;color:var(--md-on-surface)}.us-notes-body[data-v-979e4119]{margin:0;max-height:320px;overflow:auto;font:12.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;color:var(--md-on-surface-variant)}.us-apply-banner[data-v-979e4119]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-979e4119]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-979e4119]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-979e4119]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-979e4119]{font-weight:700}.us-apply-label[data-v-979e4119]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-979e4119]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-979e4119]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-979e4119]{animation:us-spin-979e4119 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-979e4119],.us-apply-banner.failed .us-spinner[data-v-979e4119]{display:none}.us-apply-log[data-v-979e4119],.us-apply-error[data-v-979e4119]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-979e4119{to{transform:rotate(360deg)}}.alert[data-v-979e4119]{color:var(--md-error)}.updates[data-v-d69111d9]{display:flex;flex-direction:column;gap:4px}.us-block[data-v-d69111d9]{display:flex;flex-direction:column;gap:14px;padding:6px 0 10px}.us-divider[data-v-d69111d9]{height:1px;background:var(--md-outline-variant);margin:4px 0}.us-head[data-v-d69111d9]{display:flex;align-items:center;gap:12px}.us-ico[data-v-d69111d9]{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--md-primary) 14%,transparent);color:var(--md-primary)}.us-head-text[data-v-d69111d9]{flex:1;min-width:0}.us-title[data-v-d69111d9]{margin:0;font-size:16px;font-weight:700;color:var(--md-on-surface)}.us-desc[data-v-d69111d9]{margin:2px 0 0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-head-actions[data-v-d69111d9]{display:flex;align-items:center;gap:8px}.us-tag[data-v-d69111d9]{flex:none;height:24px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant)}.us-tag.on[data-v-d69111d9]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.us-count[data-v-d69111d9]{min-width:26px;height:26px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.us-count.warn[data-v-d69111d9]{background:#ffdf9e;color:#4a3800}.us-source[data-v-d69111d9]{display:flex;flex-direction:column;gap:10px}.us-input-group[data-v-d69111d9]{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1.5px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);transition:border-color .16s,box-shadow .16s}.us-input-group[data-v-d69111d9]:focus-within{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}.us-input-ico[data-v-d69111d9]{flex:none;display:grid;place-items:center;color:var(--md-on-surface-variant)}.us-input[data-v-d69111d9]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--md-on-surface);font-size:14px;padding:9px 0}.us-input[data-v-d69111d9]::placeholder{color:var(--md-on-surface-variant);opacity:.7}.us-apply[data-v-d69111d9]{flex:none;height:34px;padding-inline:18px;border-radius:10px}.us-chips[data-v-d69111d9]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.us-chip[data-v-d69111d9]{height:30px;padding:0 14px;border-radius:999px;border:1.5px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:650;cursor:pointer;transition:border-color var(--duration-short) var(--ease-out),background-color var(--duration-short) var(--ease-out),color var(--duration-short) var(--ease-out)}.us-chip[data-v-d69111d9]:hover{border-color:var(--md-primary);color:var(--md-primary)}.us-chip.active[data-v-d69111d9]{background:var(--md-primary);border-color:var(--md-primary);color:var(--md-on-primary)}.us-saved[data-v-d69111d9]{color:var(--md-success);font-size:13px;font-weight:600}.us-hero[data-v-d69111d9]{display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:16px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low)}.us-hero.ok[data-v-d69111d9]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-hero.warn[data-v-d69111d9]{background:linear-gradient(135deg,#ffe4a3,#ffd680);color:#4a3800;border-color:transparent}.us-hero.none[data-v-d69111d9]{background:var(--md-surface-container-low)}.us-hero-icon[data-v-d69111d9]{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,currentColor 12%,transparent)}.us-hero-text[data-v-d69111d9]{flex:1;min-width:0}.us-hero-text b[data-v-d69111d9]{display:block;font-size:15px;font-weight:750}.us-hero-text span[data-v-d69111d9]{font-size:13px;opacity:.85}.us-hero-text em[data-v-d69111d9]{font-style:normal;font-weight:700}.us-hero-actions[data-v-d69111d9]{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.us-hero .btn.btn-primary[data-v-d69111d9]{background:var(--md-primary);color:var(--md-on-primary)}.us-apply-banner[data-v-d69111d9]{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container)}.us-apply-banner.done[data-v-d69111d9]{background:var(--md-success-container);color:#0d1f06;border-color:transparent}.us-apply-banner.failed[data-v-d69111d9]{background:var(--md-error-container);color:var(--md-on-error-container);border-color:transparent}.us-apply-head[data-v-d69111d9]{display:flex;align-items:center;gap:10px;font-size:14px}.us-apply-head b[data-v-d69111d9]{font-weight:700}.us-apply-label[data-v-d69111d9]{margin-left:auto;font-size:13px;opacity:.85}.us-chip-tag[data-v-d69111d9]{height:22px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.us-spinner[data-v-d69111d9]{flex:none;width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-top-color:transparent;opacity:.75}.us-apply-banner.running .us-spinner[data-v-d69111d9]{animation:us-spin-d69111d9 .8s linear infinite}.us-apply-banner.done .us-spinner[data-v-d69111d9],.us-apply-banner.failed .us-spinner[data-v-d69111d9]{display:none}.us-apply-log[data-v-d69111d9],.us-apply-error[data-v-d69111d9]{margin:0;max-height:220px;overflow:auto;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;color:inherit}@keyframes us-spin-d69111d9{to{transform:rotate(360deg)}}.us-table[data-v-d69111d9]{border:1px solid var(--md-outline-variant);border-radius:16px;overflow:hidden}.us-row[data-v-d69111d9]{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px;align-items:center;padding:11px 16px}.us-thead[data-v-d69111d9]{background:var(--md-surface-container);font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant);font-weight:700}.us-row[data-v-d69111d9]:not(.us-thead){background:var(--md-surface-container-lowest);border-top:1px solid var(--md-outline-variant);transition:background-color .14s}.us-row[data-v-d69111d9]:not(.us-thead):hover{background:var(--md-surface-container-low)}.us-name[data-v-d69111d9]{display:inline-flex;align-items:center;gap:8px;font-weight:650;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-dot[data-v-d69111d9]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--md-outline)}.us-dot.ok[data-v-d69111d9]{background:var(--md-success)}.us-dot.warn[data-v-d69111d9]{background:#e0a800}.us-dot.bad[data-v-d69111d9]{background:var(--md-error)}.us-ver[data-v-d69111d9]{display:inline-flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}.us-ver em[data-v-d69111d9]{font-style:normal;color:var(--md-on-surface-variant)}.us-ver b[data-v-d69111d9]{font-weight:650}.us-ver b.good[data-v-d69111d9]{color:var(--md-success)}.us-arrow[data-v-d69111d9]{color:var(--md-on-surface-variant);opacity:.6}.us-status[data-v-d69111d9]{justify-self:start;max-width:100%;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;font-size:12px;font-weight:600;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.us-status.ok[data-v-d69111d9]{background:var(--md-success-container);color:#0d1f06}.us-status.warn[data-v-d69111d9]{background:#ffdf9e;color:#4a3800}.us-status.bad[data-v-d69111d9]{background:var(--md-error-container);color:var(--md-on-error-container)}.us-actions[data-v-d69111d9]{display:inline-flex;align-items:center;gap:10px;justify-self:end}.us-repo[data-v-d69111d9]{color:var(--md-primary);text-decoration:none;font-size:13px;font-weight:600;white-space:nowrap}.us-repo[data-v-d69111d9]:hover{text-decoration:underline}.us-empty[data-v-d69111d9]{padding:18px;margin:0;color:var(--md-on-surface-variant)}.us-foot-hint[data-v-d69111d9]{margin:0;font-size:12.5px;color:var(--md-on-surface-variant)}.us-foot-hint code[data-v-d69111d9]{background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-size:12px}.btn.sm[data-v-d69111d9]{height:34px;padding-inline:16px;font-size:13px}.btn.xs[data-v-d69111d9]{height:30px;padding-inline:12px;font-size:12px}.alert[data-v-d69111d9]{color:var(--md-error)}@media(max-width:720px){.us-row[data-v-d69111d9]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto}.us-status[data-v-d69111d9]{display:none}.us-hero[data-v-d69111d9]{flex-wrap:wrap}.us-hero-actions[data-v-d69111d9]{width:100%}}.provider-panel[data-v-828ee6e3]{display:flex;flex-direction:column;gap:18px}.pp-editor-head[data-v-828ee6e3]{display:flex;align-items:center;gap:14px}.pp-back[data-v-828ee6e3]{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;cursor:pointer;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface);transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out)}.pp-back[data-v-828ee6e3]:hover{background:var(--md-surface-container);border-color:var(--md-primary)}.pp-editor-title[data-v-828ee6e3]{flex:1;min-width:0}.pp-editor-title h2[data-v-828ee6e3]{margin:0;font-size:19px;font-weight:700}.pp-editor-title .card-desc[data-v-828ee6e3]{margin:3px 0 0}.pp-section[data-v-828ee6e3]{display:flex;flex-direction:column;gap:12px;padding:16px 18px;border:1px solid var(--md-outline-variant);border-radius:16px;background:var(--md-surface-container-lowest)}.pp-section-head[data-v-828ee6e3]{display:flex;align-items:center;justify-content:space-between;gap:12px}.pp-section-title[data-v-828ee6e3]{margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--md-on-surface-variant)}.pp-count[data-v-828ee6e3]{color:var(--md-primary);font-weight:700;margin-left:4px}.pp-grid[data-v-828ee6e3]{display:grid;grid-template-columns:1fr 1fr;gap:14px}.pp-grid .field[data-v-828ee6e3]{margin-bottom:0}.pp-span[data-v-828ee6e3]{grid-column:1 / -1}.pp-req[data-v-828ee6e3]{color:var(--md-error);margin-left:2px}.pp-key[data-v-828ee6e3]{display:flex;align-items:center;gap:8px}.pp-key .input[data-v-828ee6e3]{flex:1}.pp-key-toggle[data-v-828ee6e3]{flex:none;height:40px;padding-inline:14px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);cursor:pointer;font-size:13px;font-weight:600}.pp-key-toggle[data-v-828ee6e3]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-status[data-v-828ee6e3]{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:650;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);white-space:nowrap}.pp-dot[data-v-828ee6e3]{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.55}.pp-status.ok[data-v-828ee6e3]{background:var(--md-success-container);color:var(--md-on-success-container)}.pp-status.error[data-v-828ee6e3]{background:var(--md-error-container);color:var(--md-on-error-container)}.pp-status.checking[data-v-828ee6e3]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.pp-status.checking .pp-dot[data-v-828ee6e3]{animation:pp-pulse-828ee6e3 1s ease-in-out infinite}@keyframes pp-pulse-828ee6e3{50%{opacity:.15}}.pp-probe[data-v-828ee6e3]{margin:6px 0 0;font-size:12.5px}.pp-probe.ok[data-v-828ee6e3]{color:var(--md-success)}.pp-probe.err[data-v-828ee6e3]{color:var(--md-error)}.pp-discovered[data-v-828ee6e3]{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;font-weight:600}.pp-model-tools[data-v-828ee6e3]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pp-search[data-v-828ee6e3]{flex:1;min-width:160px}.pp-mini[data-v-828ee6e3]{height:34px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600;cursor:pointer}.pp-mini[data-v-828ee6e3]:hover{border-color:var(--md-primary);color:var(--md-primary)}.pp-models[data-v-828ee6e3]{display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;max-height:340px;overflow-y:auto}.pp-model[data-v-828ee6e3]{display:flex;align-items:center;gap:12px;padding:9px 14px;border-top:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest)}.pp-model[data-v-828ee6e3]:first-child{border-top:0}.pp-model.off[data-v-828ee6e3]{opacity:.5}.pp-model-name[data-v-828ee6e3]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px}.pp-star[data-v-828ee6e3]{flex:none;width:30px;height:30px;border:0;background:transparent;color:var(--md-on-surface-variant);font-size:17px;cursor:pointer;border-radius:8px}.pp-star[data-v-828ee6e3]:hover{background:var(--md-surface-container);color:var(--md-primary)}.pp-star.on[data-v-828ee6e3]{color:#e0a800;cursor:default}.pp-switch[data-v-828ee6e3]{flex:none;width:40px;height:22px;accent-color:var(--md-primary);cursor:pointer}.pp-type[data-v-828ee6e3]{flex:none;height:28px;max-width:132px;padding:0 6px;border-radius:8px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font-size:12px;cursor:pointer}.pp-type.tagged[data-v-828ee6e3]{border-color:color-mix(in srgb,var(--md-primary) 55%,var(--md-outline-variant));color:var(--md-primary);font-weight:650}.pp-error[data-v-828ee6e3]{color:var(--md-error);margin:0}.pp-editor-actions[data-v-828ee6e3]{display:flex;gap:10px}.pp-list-head[data-v-828ee6e3]{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.pp-list-head h2[data-v-828ee6e3]{margin:0;font-size:19px;font-weight:700}.pp-list-head .card-desc[data-v-828ee6e3]{margin:3px 0 0}.pp-list-actions[data-v-828ee6e3]{display:flex;gap:8px}.pp-cards[data-v-828ee6e3]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}.pp-card[data-v-828ee6e3]{display:flex;flex-direction:column;gap:12px;padding:16px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-low);transition:border-color var(--duration-medium) var(--ease-out),transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.pp-card[data-v-828ee6e3]:hover{transform:translateY(-1px);box-shadow:var(--shadow-1)}}.pp-card.default[data-v-828ee6e3]{border-color:color-mix(in srgb,var(--md-primary) 60%,var(--md-outline-variant))}.pp-card.off[data-v-828ee6e3]{opacity:.62}.pp-card-head[data-v-828ee6e3]{display:flex;align-items:center;gap:12px}.pp-logo[data-v-828ee6e3]{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);overflow:hidden}.pp-logo img[data-v-828ee6e3]{width:26px;height:26px}.pp-card-id[data-v-828ee6e3]{flex:1;min-width:0}.pp-card-id strong[data-v-828ee6e3]{display:block;font-size:15.5px;font-weight:700}.pp-card-id code[data-v-828ee6e3]{display:block;font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-card-badges[data-v-828ee6e3]{display:flex;flex-direction:column;align-items:flex-end;gap:6px}.pp-badge[data-v-828ee6e3]{font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.pp-badge.primary[data-v-828ee6e3]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.pp-card-status[data-v-828ee6e3]{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.pp-meta[data-v-828ee6e3]{font-size:12px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.pp-meta.err[data-v-828ee6e3]{color:var(--md-error)}.pp-chips[data-v-828ee6e3]{display:flex;flex-wrap:wrap;gap:6px}.pp-chip[data-v-828ee6e3]{font-size:11.5px;padding:3px 9px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pp-chip.more[data-v-828ee6e3],.pp-chip.empty[data-v-828ee6e3]{background:transparent;border:1px dashed var(--md-outline-variant)}.pp-card-actions[data-v-828ee6e3]{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.btn.sm[data-v-828ee6e3]{height:32px;padding-inline:12px;font-size:12.5px}.btn.xs[data-v-828ee6e3]{height:28px;padding-inline:12px;font-size:12px}.pp-empty[data-v-828ee6e3]{display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 16px;color:var(--md-on-surface-variant);border:1px dashed var(--md-outline-variant);border-radius:18px}@media(max-width:640px){.pp-grid[data-v-828ee6e3],.pp-cards[data-v-828ee6e3]{grid-template-columns:1fr}}.pairing-panel[data-v-62d9948d]{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p[data-v-62d9948d]{margin:12px 0;color:var(--md-on-surface-variant)}article[data-v-62d9948d]{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code[data-v-62d9948d]{font-size:24px;letter-spacing:4px}button[data-v-62d9948d]{padding:8px 12px}button.danger[data-v-62d9948d]{color:var(--md-error, #b3261e);border-color:var(--md-error, #b3261e)}h4[data-v-62d9948d]{margin:18px 0 0}.connection-grid[data-v-14f725eb]{display:grid;grid-template-columns:minmax(280px,1fr) auto;gap:24px;align-items:start}@media(max-width:760px){.connection-grid[data-v-14f725eb]{grid-template-columns:1fr}}.connection-form .field[data-v-14f725eb]{margin-bottom:12px}.connection-qr[data-v-14f725eb]{display:flex;flex-direction:column;align-items:center;gap:8px}.connection-qr svg[data-v-14f725eb]{background:#fff;border-radius:8px;padding:6px}.connection-link[data-v-14f725eb]{max-width:280px;word-break:break-all;font-size:11px;opacity:.7;text-align:center}.toggle-label[data-v-14f725eb]{display:flex;align-items:center;gap:10px;margin-bottom:12px}.security-panel[data-v-b1d117f0]{max-width:920px}.sec-stack[data-v-b1d117f0]{display:flex;flex-direction:column;gap:12px;margin-top:18px}.sec-card[data-v-b1d117f0]{padding:16px 18px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent);border-radius:22px;background:var(--md-surface-container-lowest)}.sec-card-head[data-v-b1d117f0]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}.sec-card-head strong[data-v-b1d117f0]{font-size:15px;font-weight:700}.sec-chip[data-v-b1d117f0]{flex-shrink:0;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.sec-chip.on[data-v-b1d117f0]{color:color-mix(in srgb,var(--md-primary) 80%,var(--md-on-surface));background:color-mix(in srgb,var(--md-primary) 12%,transparent)}.sec-card>.helper-text[data-v-b1d117f0]{margin:2px 0 12px}.sec-pin-grid[data-v-b1d117f0]{display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;max-width:720px;margin-top:12px}.sec-pin-col[data-v-b1d117f0]{display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 14px;border-radius:16px;background:var(--md-surface-container-low)}.sec-pin-label[data-v-b1d117f0]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.sec-actions[data-v-b1d117f0]{display:flex;align-items:center;gap:12px;margin-top:18px}.page-list[data-v-b1d117f0]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px}.page-item[data-v-b1d117f0]{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;cursor:pointer;transition:background-color .16s}.page-item[data-v-b1d117f0]:hover{background:var(--md-surface-container)}.page-item[data-v-b1d117f0]:has(input:checked){background:color-mix(in srgb,var(--md-primary) 8%,transparent)}.page-item input[data-v-b1d117f0]{position:absolute;opacity:0;width:0;height:0}.page-item .toggle-slider[data-v-b1d117f0]{width:44px;height:26px}.page-item .toggle-slider[data-v-b1d117f0]:after{left:3px;width:16px;height:16px;font-size:10px}.page-item input:checked+.toggle-slider[data-v-b1d117f0]{background:var(--md-primary);border-color:var(--md-primary)}.page-item input:checked+.toggle-slider[data-v-b1d117f0]:after{left:25px;background:var(--md-on-primary);color:var(--md-primary)}.page-item input:focus-visible+.toggle-slider[data-v-b1d117f0]{box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 22%,transparent)}.page-text[data-v-b1d117f0]{display:flex;align-items:baseline;gap:8px;min-width:0}.page-name[data-v-b1d117f0]{font-size:13px;font-weight:650;color:var(--md-on-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-text code[data-v-b1d117f0]{font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sec-msg[data-v-b1d117f0]{margin-top:12px}.sec-error[data-v-b1d117f0]{color:var(--md-error);font-size:12.5px;margin-top:8px}@media(max-width:640px){.sec-pin-grid[data-v-b1d117f0]{grid-template-columns:1fr}}.mcp-panel[data-v-775007b1]{max-width:900px}.mcp-head[data-v-775007b1]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);flex-wrap:wrap;margin-bottom:var(--space-lg)}.mcp-head h2[data-v-775007b1]{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}.subtitle[data-v-775007b1]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:60ch}.mcp-actions[data-v-775007b1]{display:flex;gap:10px}.error-banner[data-v-775007b1]{padding:14px 18px;border-radius:16px;background:var(--md-error-container);color:var(--md-on-error-container);margin-bottom:var(--space-lg)}.notice-banner[data-v-775007b1]{padding:14px 18px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);margin-bottom:var(--space-lg)}.hint[data-v-775007b1]{color:var(--md-on-surface-variant);font-size:14px}.mcp-list[data-v-775007b1]{display:flex;flex-direction:column;gap:var(--space-md, 16px)}.mcp-card[data-v-775007b1]{display:flex;flex-direction:column;gap:12px;padding:18px;border-radius:22px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low)}.mcp-card.is-builtin[data-v-775007b1]{border-color:color-mix(in srgb,var(--md-primary) 34%,var(--md-outline-variant));background:var(--md-surface-container)}.mcp-row[data-v-775007b1]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mcp-field[data-v-775007b1]{display:flex;flex-direction:column;gap:6px;min-width:160px}.mcp-field.grow[data-v-775007b1]{flex:1}.mcp-field>span[data-v-775007b1]{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}.mcp-field input[data-v-775007b1],.mcp-field select[data-v-775007b1],.mcp-field textarea[data-v-775007b1]{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}.mcp-field input[readonly][data-v-775007b1]{opacity:.7}.mcp-field textarea[data-v-775007b1]{resize:vertical;font-family:ui-monospace,monospace;font-size:13px}.mcp-field input[data-v-775007b1]:focus,.mcp-field select[data-v-775007b1]:focus,.mcp-field textarea[data-v-775007b1]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mcp-toggle[data-v-775007b1]{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:650;color:var(--md-on-surface-variant);user-select:none}.mcp-remove[data-v-775007b1]{margin-left:auto;border:0;border-radius:999px;padding:10px 16px;font-weight:650;cursor:pointer;background:var(--md-error-container);color:var(--md-on-error-container)}.builtin-note[data-v-775007b1]{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}.builtin-note code[data-v-775007b1]{font-family:ui-monospace,monospace}.mail-grid[data-v-775007b1]{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mail-col[data-v-775007b1]{display:flex;flex-direction:column;gap:10px}.mail-row[data-v-775007b1]{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}.mail-label[data-v-775007b1]{margin:0;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--md-on-surface-variant)}.btn[data-v-775007b1]{height:44px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}.btn-tonal[data-v-775007b1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.primary[data-v-775007b1]{background:var(--md-primary);color:var(--md-on-primary)}.btn[data-v-775007b1]:disabled{opacity:.6;cursor:not-allowed}@media(max-width:720px){.mail-grid[data-v-775007b1]{grid-template-columns:1fr}}.plugin-pane-message[data-v-2d1f36bc]{padding:var(--space-xl);color:var(--md-on-surface-variant)}.models-field[data-v-b73b6842]{display:flex;flex-direction:column;gap:8px}.models-list[data-v-b73b6842]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.models-list li[data-v-b73b6842]{display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:12px;background:var(--md-surface-container-high)}.models-rank[data-v-b73b6842]{flex:none;width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:var(--md-primary);color:var(--md-on-primary);font-size:11px;font-weight:700}.models-name[data-v-b73b6842]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}.models-actions[data-v-b73b6842]{display:inline-flex;gap:4px}.models-actions button[data-v-b73b6842]{width:28px;height:28px;border:0;border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface-variant);cursor:pointer}.models-actions button[data-v-b73b6842]:disabled{opacity:.35;cursor:not-allowed}.models-actions button[data-v-b73b6842]:hover:not(:disabled){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.models-empty[data-v-b73b6842]{margin:0;color:var(--md-on-surface-variant);font-size:12.5px}.usage-page[data-v-a7476de1]{height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);color:var(--md-on-surface)}.hero[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}.eyebrow[data-v-a7476de1]{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}.hero h1[data-v-a7476de1]{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em;margin:0}.subtitle[data-v-a7476de1]{color:var(--md-on-surface-variant);font-size:15px;margin-top:8px;line-height:1.6;max-width:70ch}.hero-actions[data-v-a7476de1]{display:flex;gap:10px;flex-wrap:wrap}.banner[data-v-a7476de1]{padding:13px 18px;border-radius:18px;margin-bottom:14px;font-size:13px;font-weight:600}.banner.err[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.banner.ok[data-v-a7476de1]{background:var(--md-success-container);color:var(--md-on-success-container)}#app .usage-page .btn[data-v-a7476de1]{height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform var(--duration-medium) var(--ease-spring),background-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){#app .usage-page .btn[data-v-a7476de1]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .usage-page .btn[data-v-a7476de1]:disabled{opacity:.55;cursor:not-allowed}#app .usage-page .btn-tonal[data-v-a7476de1]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .usage-page .btn-danger[data-v-a7476de1]{background:var(--md-error-container);color:var(--md-on-error-container)}.overview[data-v-a7476de1]{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(280px,1.5fr) minmax(200px,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl)}.card[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:24px;box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.donut-card[data-v-a7476de1]{display:grid;place-items:center}.donut[data-v-a7476de1]{position:relative;width:min(190px,100%);aspect-ratio:1}.donut svg[data-v-a7476de1]{width:100%;height:100%;transform:rotate(-90deg)}.donut circle[data-v-a7476de1]{fill:none;stroke-width:5}.donut-track[data-v-a7476de1]{stroke:var(--md-surface-container-high)}.donut-prompt[data-v-a7476de1]{stroke:var(--md-primary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring)}.donut-completion[data-v-a7476de1]{stroke:var(--md-tertiary);stroke-linecap:round;transition:stroke-dasharray var(--duration-long) var(--ease-spring),stroke-dashoffset var(--duration-long) var(--ease-spring)}.donut-center[data-v-a7476de1]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}.donut-center b[data-v-a7476de1]{font-size:30px;font-weight:800;letter-spacing:-.02em}.donut-center span[data-v-a7476de1]{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.total-card[data-v-a7476de1]{display:flex;flex-direction:column;gap:18px}.total-head[data-v-a7476de1]{display:flex;align-items:center;gap:16px}.stat-ic[data-v-a7476de1]{width:46px;height:46px;flex-shrink:0;border-radius:18px 18px 18px 7px;display:grid;place-items:center;background:var(--md-primary-container);color:var(--md-on-primary-container)}.stat-label[data-v-a7476de1]{font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.big[data-v-a7476de1]{display:block;font-size:clamp(30px,3.4vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.05}.compose[data-v-a7476de1]{display:flex;height:18px;border-radius:999px;overflow:hidden;background:var(--md-surface-container-high)}.seg[data-v-a7476de1]{height:100%;transition:width var(--duration-long) var(--ease-spring)}.seg.prompt[data-v-a7476de1]{background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 70%,var(--md-tertiary)))}.seg.completion[data-v-a7476de1]{background:linear-gradient(90deg,color-mix(in srgb,var(--md-tertiary) 80%,var(--md-primary)),var(--md-tertiary))}.legend[data-v-a7476de1]{display:flex;gap:20px;flex-wrap:wrap}.lg[data-v-a7476de1]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}.lg b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:700}.lg small[data-v-a7476de1]{color:var(--md-on-surface-variant);font-weight:700}.dot[data-v-a7476de1]{width:10px;height:10px;border-radius:50%}.dot.prompt[data-v-a7476de1]{background:var(--md-primary)}.dot.completion[data-v-a7476de1]{background:var(--md-tertiary)}.mini-stack[data-v-a7476de1]{display:grid;grid-template-rows:repeat(3,1fr);gap:var(--space-lg)}.mini[data-v-a7476de1]{display:flex;align-items:center;gap:14px;padding:18px 20px;border-radius:26px;background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}@media(hover:hover)and (pointer:fine){.mini[data-v-a7476de1]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}.mini-ic[data-v-a7476de1]{width:40px;height:40px;flex-shrink:0;border-radius:16px 16px 16px 6px;display:grid;place-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mini b[data-v-a7476de1]{display:block;font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.1}.mini span[data-v-a7476de1]{font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.panel[data-v-a7476de1]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:32px;padding:clamp(20px,2.2vw,28px);margin-bottom:var(--space-lg);box-shadow:var(--shadow-1);animation:up-a7476de1 var(--duration-long) var(--ease-spring) both}.panel-head[data-v-a7476de1]{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:20px;flex-wrap:wrap}.panel-head h2[data-v-a7476de1]{font-size:17px;font-weight:800;letter-spacing:-.01em;margin:0}.panel-note[data-v-a7476de1]{font-size:13px;color:var(--md-on-surface-variant);font-weight:600}.chart[data-v-a7476de1]{display:flex;flex-direction:column;height:264px;padding-left:42px}.bars[data-v-a7476de1]{position:relative;flex:1;display:flex;align-items:flex-end;gap:6px}.grid[data-v-a7476de1]{position:absolute;inset:0}.grid span[data-v-a7476de1]{position:absolute;left:0;right:0;border-top:1px dashed color-mix(in srgb,var(--md-outline-variant) 70%,transparent)}.grid span i[data-v-a7476de1]{position:absolute;left:-42px;top:-8px;width:36px;text-align:right;font-size:11px;font-style:normal;color:var(--md-on-surface-variant)}.col[data-v-a7476de1]{flex:1;min-width:0;height:100%;display:flex;justify-content:center;align-items:flex-end}.col-bar[data-v-a7476de1]{width:100%;max-width:44px;height:100%;transform-origin:bottom;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 40%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring),filter var(--duration-short) var(--ease-out)}.col:hover .col-bar[data-v-a7476de1]{filter:brightness(1.1) saturate(1.1)}.axis[data-v-a7476de1]{display:flex;gap:6px;height:22px;padding-top:6px}.axis span[data-v-a7476de1]{flex:1;min-width:0;text-align:center;font-size:11px;color:var(--md-on-surface-variant);white-space:nowrap}.model-grid[data-v-a7476de1]{display:grid;grid-template-columns:repeat(auto-fill,minmax(264px,1fr));gap:16px}.model-card[data-v-a7476de1]{position:relative;overflow:hidden;padding:22px;border-radius:26px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;flex-direction:column;gap:12px;animation:up-a7476de1 var(--duration-long) var(--ease-spring) both;transition:transform var(--duration-medium) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out),border-color var(--duration-medium) var(--ease-out)}.model-card[data-v-a7476de1]:before{content:\"\";position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 25%,transparent))}@media(hover:hover)and (pointer:fine){.model-card[data-v-a7476de1]:hover{transform:translateY(-4px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--c) 40%,var(--md-outline-variant))}}.mc-top[data-v-a7476de1]{display:flex;align-items:center;gap:10px;min-width:0}.mc-avatar[data-v-a7476de1]{width:38px;height:38px;flex-shrink:0;border-radius:15px 15px 15px 5px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font-weight:800;font-size:16px}.mc-name[data-v-a7476de1]{flex:1;min-width:0;font:700 13px/1.35 ui-monospace,monospace;overflow-wrap:anywhere}.mc-share[data-v-a7476de1]{flex-shrink:0;height:26px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}.mc-total[data-v-a7476de1]{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.05}.mc-total small[data-v-a7476de1]{font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.mc-track[data-v-a7476de1]{height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.mc-fill[data-v-a7476de1]{height:100%;width:100%;transform-origin:left;border-radius:999px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 50%,var(--md-surface)));transition:transform var(--duration-long) var(--ease-spring)}.mc-meta[data-v-a7476de1]{display:flex;gap:18px;flex-wrap:wrap}.mc-meta span[data-v-a7476de1]{display:flex;flex-direction:column;gap:1px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.mc-meta b[data-v-a7476de1]{color:var(--md-on-surface);font-weight:750;font-size:14px;font-variant-numeric:tabular-nums}.empty[data-v-a7476de1]{padding:var(--space-xl);text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:20px}@keyframes up-a7476de1{0%{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}@media(max-width:980px){.overview[data-v-a7476de1]{grid-template-columns:1fr 1fr}.mini-stack[data-v-a7476de1]{grid-column:1 / -1;grid-template-rows:none;grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.overview[data-v-a7476de1],.mini-stack[data-v-a7476de1]{grid-template-columns:1fr}.chart[data-v-a7476de1]{height:200px;padding-left:34px}.grid span i[data-v-a7476de1]{left:-34px;width:28px}.axis span[data-v-a7476de1]{font-size:11px}}\n";document.head.appendChild(s)}})();
