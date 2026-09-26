import { ref as p, computed as h, onMounted as P, onUnmounted as O, openBlock as n, createElementBlock as o, createElementVNode as t, normalizeClass as D, createTextVNode as _, toDisplayString as s, createCommentVNode as r, withDirectives as b, vModelText as g, vModelSelect as X, Fragment as k, normalizeStyle as B, renderList as w } from "vue";
const Y = (S, U) => {
  const d = S.__vccOpts || S;
  for (const [f, c] of U)
    d[f] = c;
  return d;
}, H = { class: "mc" }, W = { class: "mc-head" }, Z = { class: "mc-title" }, q = { class: "mc-copy" }, G = { class: "mc-sub" }, K = {
  key: 0,
  class: "tag"
}, Q = { class: "mc-actions" }, R = ["disabled"], tt = ["disabled"], et = ["disabled"], lt = {
  key: 0,
  class: "err"
}, st = {
  key: 1,
  class: "card connect"
}, nt = { class: "connect-grid" }, ot = { class: "wide" }, at = { class: "actions" }, it = ["disabled"], ut = { class: "grid" }, rt = { class: "card" }, dt = { class: "card" }, ct = { class: "bar-row" }, vt = { class: "bar" }, mt = { class: "bar-num" }, pt = { class: "bar-row" }, ht = { class: "bar" }, _t = { class: "bar-num" }, bt = {
  key: 0,
  class: "err small"
}, kt = { class: "card" }, ft = { class: "muted" }, yt = { class: "list" }, gt = { class: "muted" }, wt = {
  key: 0,
  class: "chip muted"
}, $t = {
  key: 0,
  class: "muted"
}, Mt = { class: "card" }, xt = { class: "muted" }, Ct = { class: "list" }, St = { class: "muted" }, Ut = ["disabled", "onClick"], Vt = {
  key: 0,
  class: "muted"
}, jt = { class: "card" }, It = { class: "muted" }, Nt = { class: "list" }, Bt = { class: "muted" }, Et = ["disabled", "onClick"], zt = {
  key: 0,
  class: "muted"
}, At = { class: "card" }, Lt = { class: "inv hotbar" }, Tt = ["title"], Ft = {
  key: 0,
  class: "it"
}, Jt = { key: 0 }, Pt = { class: "card" }, Ot = { class: "inv" }, Dt = ["title"], Xt = {
  key: 0,
  class: "it"
}, Yt = { key: 0 }, Ht = {
  key: 3,
  class: "muted pad"
}, Wt = {
  __name: "MinecraftPage",
  setup(S) {
    const U = (() => {
      try {
        return localStorage.getItem("0kay.minecraft.url") || "";
      } catch {
        return "";
      }
    })(), d = p(U || `http://${location.hostname || "127.0.0.1"}:8765`), f = p(null), c = p({ waypoints: [], skills: [] }), m = p(""), v = p(!1), $ = p(!1), u = p({ edition: "java", host: "", port: "", username: "XingYao", password: "" });
    let V = null;
    const a = h(() => f.value?.bot || null), j = h(() => !!a.value?.connected), E = h(() => f.value?.autopilot || { running: !1 }), z = h(() => a.value?.username || "");
    function I(i, e = 20) {
      const l = Number(i);
      return Number.isFinite(l) ? Math.max(0, Math.min(100, l / e * 100)) : 0;
    }
    const A = h(() => {
      const i = {};
      for (const e of a.value?.inventory || []) i[e.slot] = e;
      return i;
    });
    function N(i) {
      return A.value[i] || null;
    }
    const L = h(() => Array.from({ length: 9 }, (i, e) => ({ slot: 36 + e, item: N(36 + e) }))), T = h(() => Array.from({ length: 27 }, (i, e) => ({ slot: 9 + e, item: N(9 + e) })));
    function y(i) {
      return String(i || "").replace(/_/g, " ");
    }
    async function M() {
      try {
        const i = await fetch(`${d.value.replace(/\/$/, "")}/status`, { signal: AbortSignal.timeout(6e3) });
        if (!i.ok) throw new Error(`HTTP ${i.status}`);
        f.value = await i.json(), m.value = "", F();
      } catch (i) {
        m.value = i?.message || "unreachable";
      }
    }
    async function F() {
      try {
        const i = await fetch(`${d.value.replace(/\/$/, "")}/world`, { signal: AbortSignal.timeout(6e3) });
        i.ok && (c.value = await i.json());
      } catch {
      }
    }
    async function x(i, e = {}) {
      v.value = !0;
      try {
        const C = await (await fetch(`${d.value.replace(/\/$/, "")}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: i, args: e }),
          signal: AbortSignal.timeout(4e4)
        })).json().catch(() => ({}));
        if (C.ok === !1) throw new Error(C.error || "action failed");
        await M();
      } catch (l) {
        m.value = l?.message || "action failed";
      } finally {
        v.value = !1;
      }
    }
    async function J() {
      await x("connect", {
        edition: u.value.edition,
        host: u.value.host.trim(),
        port: u.value.port ? Number(u.value.port) : void 0,
        username: u.value.username.trim() || void 0,
        password: u.value.password || void 0
      });
    }
    return P(() => {
      M(), V = setInterval(M, 3e3);
    }), O(() => {
      V && clearInterval(V);
    }), (i, e) => (n(), o("div", H, [
      t("header", W, [
        t("div", Z, [
          e[9] || (e[9] = t("span", {
            class: "mc-logo",
            "aria-hidden": "true"
          }, [
            t("svg", {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none"
            }, [
              t("path", {
                d: "M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z",
                stroke: "currentColor",
                "stroke-width": "1.7",
                "stroke-linejoin": "round"
              }),
              t("path", {
                d: "M12 12 4 7.5M12 12l8-4.5M12 12v9",
                stroke: "currentColor",
                "stroke-width": "1.7",
                "stroke-linejoin": "round"
              })
            ])
          ], -1)),
          t("div", q, [
            e[8] || (e[8] = t("h1", null, "Minecraft", -1)),
            t("p", G, [
              t("span", {
                class: D(["dot", j.value ? "on" : m.value ? "err" : "off"])
              }, null, 2),
              _(" " + s(j.value ? z.value || "已连接" : a.value?.state || "未连接") + " ", 1),
              E.value.running ? (n(), o("span", K, "AI 自动游玩")) : r("", !0)
            ])
          ])
        ]),
        t("div", Q, [
          b(t("input", {
            "onUpdate:modelValue": e[0] || (e[0] = (l) => d.value = l),
            class: "url",
            spellcheck: "false",
            "aria-label": "服务地址"
          }, null, 512), [
            [g, d.value]
          ]),
          t("button", {
            class: "btn tonic",
            disabled: v.value,
            onClick: M
          }, "刷新", 8, R),
          t("button", {
            class: "btn filled",
            disabled: v.value,
            onClick: e[1] || (e[1] = (l) => $.value = !$.value)
          }, s($.value ? "收起" : "连接"), 9, tt),
          j.value ? (n(), o("button", {
            key: 0,
            class: "btn danger",
            disabled: v.value,
            onClick: e[2] || (e[2] = (l) => x("disconnect"))
          }, "断开", 8, et)) : r("", !0)
        ])
      ]),
      m.value ? (n(), o("p", lt, "服务不可达：" + s(m.value) + "（地址 " + s(d.value) + "）", 1)) : r("", !0),
      $.value ? (n(), o("section", st, [
        e[16] || (e[16] = t("h2", null, "连接到服务器", -1)),
        t("div", nt, [
          t("label", null, [
            e[11] || (e[11] = t("span", null, "版本", -1)),
            b(t("select", {
              "onUpdate:modelValue": e[3] || (e[3] = (l) => u.value.edition = l)
            }, [...e[10] || (e[10] = [
              t("option", { value: "java" }, "Java", -1),
              t("option", { value: "bedrock" }, "Bedrock", -1)
            ])], 512), [
              [X, u.value.edition]
            ])
          ]),
          t("label", null, [
            e[12] || (e[12] = t("span", null, "服务器地址", -1)),
            b(t("input", {
              "onUpdate:modelValue": e[4] || (e[4] = (l) => u.value.host = l),
              placeholder: "如 razure.ink",
              spellcheck: "false"
            }, null, 512), [
              [g, u.value.host]
            ])
          ]),
          t("label", null, [
            e[13] || (e[13] = t("span", null, "端口", -1)),
            b(t("input", {
              "onUpdate:modelValue": e[5] || (e[5] = (l) => u.value.port = l),
              placeholder: "Java 25565 / Bedrock 19132",
              spellcheck: "false"
            }, null, 512), [
              [g, u.value.port]
            ])
          ]),
          t("label", null, [
            e[14] || (e[14] = t("span", null, "昵称", -1)),
            b(t("input", {
              "onUpdate:modelValue": e[6] || (e[6] = (l) => u.value.username = l),
              placeholder: "XingYao",
              spellcheck: "false"
            }, null, 512), [
              [g, u.value.username]
            ])
          ]),
          t("label", ot, [
            e[15] || (e[15] = t("span", null, "服务器密码", -1)),
            b(t("input", {
              "onUpdate:modelValue": e[7] || (e[7] = (l) => u.value.password = l),
              placeholder: "留空自动使用 LIFE 记忆里的密码",
              spellcheck: "false"
            }, null, 512), [
              [g, u.value.password]
            ])
          ])
        ]),
        t("div", at, [
          t("button", {
            class: "btn filled",
            disabled: v.value || !u.value.host.trim(),
            onClick: J
          }, "连接", 8, it)
        ])
      ])) : r("", !0),
      a.value ? (n(), o(k, { key: 2 }, [
        t("section", ut, [
          t("div", rt, [
            e[22] || (e[22] = t("h2", null, "服务器", -1)),
            t("dl", null, [
              e[17] || (e[17] = t("dt", null, "地址", -1)),
              t("dd", null, s(a.value.host || "-") + ":" + s(a.value.port || "-"), 1),
              e[18] || (e[18] = t("dt", null, "版本", -1)),
              t("dd", null, s(a.value.edition === "bedrock" ? "Bedrock" : "Java") + " " + s(a.value.version || ""), 1),
              e[19] || (e[19] = t("dt", null, "维度", -1)),
              t("dd", null, s(a.value.dimension || "-"), 1),
              e[20] || (e[20] = t("dt", null, "坐标", -1)),
              t("dd", null, s(a.value.position ? `${a.value.position.x}, ${a.value.position.y}, ${a.value.position.z}` : "-"), 1),
              e[21] || (e[21] = t("dt", null, "手持", -1)),
              t("dd", null, s(y(a.value.held) || "空"), 1)
            ])
          ]),
          t("div", dt, [
            e[25] || (e[25] = t("h2", null, "状态", -1)),
            t("div", ct, [
              e[23] || (e[23] = t("span", { class: "bar-label" }, "生命", -1)),
              t("div", vt, [
                t("i", {
                  class: "hp",
                  style: B({ width: I(a.value.health) + "%" })
                }, null, 4)
              ]),
              t("span", mt, s(a.value.health ?? "-") + "/20", 1)
            ]),
            t("div", pt, [
              e[24] || (e[24] = t("span", { class: "bar-label" }, "饥饿", -1)),
              t("div", ht, [
                t("i", {
                  class: "food",
                  style: B({ width: I(a.value.food) + "%" })
                }, null, 4)
              ]),
              t("span", _t, s(a.value.food ?? "-") + "/20", 1)
            ]),
            a.value.error ? (n(), o("p", bt, s(a.value.error), 1)) : r("", !0)
          ]),
          t("div", kt, [
            t("h2", null, [
              e[26] || (e[26] = _("玩家 ", -1)),
              t("span", ft, s((a.value.players || []).length), 1)
            ]),
            t("ul", yt, [
              (n(!0), o(k, null, w(a.value.players || [], (l) => (n(), o("li", {
                key: l.name
              }, [
                t("b", null, s(l.name), 1),
                t("span", gt, s(l.position ? `${Math.round(l.position.x)}, ${Math.round(l.position.y)}, ${Math.round(l.position.z)}` : ""), 1),
                l.ping != null ? (n(), o("span", wt, s(l.ping) + "ms", 1)) : r("", !0)
              ]))), 128)),
              (a.value.players || []).length ? r("", !0) : (n(), o("li", $t, "暂无其他玩家"))
            ])
          ])
        ]),
        t("section", Mt, [
          t("h2", null, [
            e[27] || (e[27] = _("记忆的地点 ", -1)),
            t("span", xt, s((c.value.waypoints || []).length), 1)
          ]),
          t("ul", Ct, [
            (n(!0), o(k, null, w(c.value.waypoints || [], (l) => (n(), o("li", {
              key: l.id
            }, [
              t("b", null, s(l.name), 1),
              t("span", St, s(Math.round(l.x)) + ", " + s(Math.round(l.y)) + ", " + s(Math.round(l.z)) + " · " + s(l.type), 1),
              t("button", {
                class: "btn sm tonic",
                disabled: v.value,
                onClick: (C) => x("waypoint_goto", { name: l.name })
              }, "前往", 8, Ut)
            ]))), 128)),
            (c.value.waypoints || []).length ? r("", !0) : (n(), o("li", Vt, "暂无，机器人会随游玩自动记录"))
          ])
        ]),
        t("section", jt, [
          t("h2", null, [
            e[28] || (e[28] = _("学会的技能 ", -1)),
            t("span", It, s((c.value.skills || []).length), 1)
          ]),
          t("ul", Nt, [
            (n(!0), o(k, null, w(c.value.skills || [], (l) => (n(), o("li", {
              key: l.id
            }, [
              t("b", null, s(l.name), 1),
              t("span", Bt, s((l.steps || []).length) + " 步 · 用过 " + s(l.runs || 0) + " 次", 1),
              t("button", {
                class: "btn sm tonic",
                disabled: v.value,
                onClick: (C) => x("skill_run", { name: l.name })
              }, "执行", 8, Et)
            ]))), 128)),
            (c.value.skills || []).length ? r("", !0) : (n(), o("li", zt, "暂无，LIFE 会定期复盘并沉淀技能"))
          ])
        ]),
        t("section", At, [
          e[29] || (e[29] = t("h2", null, [
            _("物品栏 "),
            t("span", { class: "muted" }, "快捷栏")
          ], -1)),
          t("div", Lt, [
            (n(!0), o(k, null, w(L.value, (l) => (n(), o("div", {
              key: l.slot,
              class: "cell",
              title: l.item ? `${y(l.item.name)} x${l.item.count}` : "空"
            }, [
              l.item ? (n(), o("span", Ft, [
                _(s(y(l.item.name)), 1),
                l.item.count > 1 ? (n(), o("b", Jt, "×" + s(l.item.count), 1)) : r("", !0)
              ])) : r("", !0)
            ], 8, Tt))), 128))
          ])
        ]),
        t("section", Pt, [
          e[30] || (e[30] = t("h2", null, "背包", -1)),
          t("div", Ot, [
            (n(!0), o(k, null, w(T.value, (l) => (n(), o("div", {
              key: l.slot,
              class: "cell",
              title: l.item ? `${y(l.item.name)} x${l.item.count}` : "空"
            }, [
              l.item ? (n(), o("span", Xt, [
                _(s(y(l.item.name)), 1),
                l.item.count > 1 ? (n(), o("b", Yt, "×" + s(l.item.count), 1)) : r("", !0)
              ])) : r("", !0)
            ], 8, Dt))), 128))
          ])
        ])
      ], 64)) : m.value ? r("", !0) : (n(), o("p", Ht, "未连接。点「连接」填写服务器，或让 L.I.F.E 说「连到 xxx 服务器」。"))
    ]));
  }
}, qt = /* @__PURE__ */ Y(Wt, [["__scopeId", "data-v-27ef4d05"]]);
export {
  qt as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('minecraft-plugin-style')){const s=document.createElement('style');s.id='minecraft-plugin-style';s.textContent="#app .mc[data-v-27ef4d05]{padding:clamp(18px,2.4vw,30px);max-width:1120px;margin:0 auto;color:var(--md-on-surface);font-family:var(--font-family)}#app .mc h1[data-v-27ef4d05],#app .mc h2[data-v-27ef4d05]{margin:0;letter-spacing:-.01em}#app .mc h2[data-v-27ef4d05]{font-size:15px;font-weight:750;margin-bottom:12px;display:flex;align-items:center;gap:8px}#app .mc .mc-head[data-v-27ef4d05]{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px;padding:20px 22px;border-radius:28px;background:radial-gradient(520px 240px at 100% 0%,color-mix(in srgb,var(--md-primary) 12%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-high)));box-shadow:var(--shadow-1)}#app .mc .mc-title[data-v-27ef4d05]{display:flex;align-items:center;gap:14px;min-width:0}#app .mc .mc-logo[data-v-27ef4d05]{width:52px;height:52px;flex-shrink:0;display:grid;place-items:center;border-radius:18px 18px 18px 7px;background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .mc .mc-copy h1[data-v-27ef4d05]{font-size:22px;font-weight:800}#app .mc .mc-sub[data-v-27ef4d05]{display:flex;align-items:center;gap:8px;margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);flex-wrap:wrap}#app .mc .dot[data-v-27ef4d05]{width:9px;height:9px;border-radius:50%;background:var(--md-outline);flex-shrink:0}#app .mc .dot.on[data-v-27ef4d05]{background:var(--md-success);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-success) 22%,transparent)}#app .mc .dot.err[data-v-27ef4d05]{background:var(--md-error);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-error) 20%,transparent)}#app .mc .tag[data-v-27ef4d05]{font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--md-success-container);color:#0d3b1e}#app .mc .mc-actions[data-v-27ef4d05]{display:flex;gap:8px;align-items:center;flex-wrap:wrap}#app .mc .btn[data-v-27ef4d05]{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform .24s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .18s,box-shadow .2s,border-radius .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .mc .btn[data-v-27ef4d05]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}#app .mc .btn[data-v-27ef4d05]:disabled{opacity:.5;cursor:not-allowed}#app .mc .btn.sm[data-v-27ef4d05]{height:32px;padding:0 13px;font-size:13px}#app .mc .btn.filled[data-v-27ef4d05]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .mc .btn.tonic[data-v-27ef4d05]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .mc .btn.danger[data-v-27ef4d05]{background:var(--md-error-container);color:var(--md-on-error-container,#410e0b)}#app .mc .url[data-v-27ef4d05],#app .mc .connect input[data-v-27ef4d05],#app .mc .connect select[data-v-27ef4d05]{height:44px;padding:0 14px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s}#app .mc .url[data-v-27ef4d05]{width:238px}#app .mc .url[data-v-27ef4d05]:focus,#app .mc .connect input[data-v-27ef4d05]:focus,#app .mc .connect select[data-v-27ef4d05]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .mc .card[data-v-27ef4d05]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;padding:18px 20px;margin-bottom:16px;box-shadow:var(--shadow-1);transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}#app .mc .card[data-v-27ef4d05]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}#app .mc .grid[data-v-27ef4d05]{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-bottom:0}#app .mc .grid .card[data-v-27ef4d05]{margin-bottom:16px}#app .mc .connect-grid[data-v-27ef4d05]{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}#app .mc .connect-grid label[data-v-27ef4d05]{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .mc .connect-grid label.wide[data-v-27ef4d05]{grid-column:1/-1}#app .mc .connect .actions[data-v-27ef4d05]{display:flex;justify-content:flex-end;margin-top:14px}#app .mc dl[data-v-27ef4d05]{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0;font-size:13px}#app .mc dt[data-v-27ef4d05]{color:var(--md-on-surface-variant)}#app .mc dd[data-v-27ef4d05]{margin:0;overflow-wrap:anywhere}#app .mc .bar-row[data-v-27ef4d05]{display:flex;align-items:center;gap:12px;margin:10px 0;font-size:13px}#app .mc .bar-label[data-v-27ef4d05]{width:36px;color:var(--md-on-surface-variant);flex-shrink:0}#app .mc .bar[data-v-27ef4d05]{flex:1;height:12px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}#app .mc .bar i[data-v-27ef4d05]{display:block;height:100%;border-radius:999px;transition:width .4s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .mc .bar i.hp[data-v-27ef4d05]{background:linear-gradient(90deg,#e35d5d,#ff9a9a)}#app .mc .bar i.food[data-v-27ef4d05]{background:linear-gradient(90deg,#d99a37,#f0c060)}#app .mc .bar-num[data-v-27ef4d05]{width:54px;text-align:right;color:var(--md-on-surface-variant);flex-shrink:0}#app .mc .list[data-v-27ef4d05]{list-style:none;margin:0;padding:0;font-size:13px;display:flex;flex-direction:column;gap:2px}#app .mc .list li[data-v-27ef4d05]{display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}#app .mc .list li[data-v-27ef4d05]:last-child{border-bottom:none}#app .mc .list li .btn[data-v-27ef4d05],#app .mc .list li span.muted[data-v-27ef4d05],#app .mc .list li .chip[data-v-27ef4d05]{margin-left:auto}#app .mc .list li b+span.muted[data-v-27ef4d05]{flex:1;min-width:0}#app .mc .chip[data-v-27ef4d05]{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}#app .mc .chip.muted[data-v-27ef4d05]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:600}#app .mc .muted[data-v-27ef4d05]{color:var(--md-on-surface-variant)}#app .mc .err[data-v-27ef4d05]{color:var(--md-error);font-size:13px;background:var(--md-error-container);padding:11px 16px;border-radius:16px;margin-bottom:14px}#app .mc .err.small[data-v-27ef4d05]{font-size:12px;margin:8px 0 0;background:transparent;padding:0}#app .mc .pad[data-v-27ef4d05]{padding:8px 0}#app .mc .inv[data-v-27ef4d05]{display:grid;grid-template-columns:repeat(9,1fr);gap:8px}#app .mc .inv.hotbar[data-v-27ef4d05]{margin-bottom:10px}#app .mc .cell[data-v-27ef4d05]{aspect-ratio:1;border-radius:14px;background:var(--md-surface-container-high);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;align-items:center;justify-content:center;padding:4px;overflow:hidden;transition:transform .2s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .18s}#app .mc .cell[data-v-27ef4d05]:hover{transform:translateY(-2px);background:var(--md-surface-container-highest)}#app .mc .cell .it[data-v-27ef4d05]{font-size:11px;line-height:1.1;text-align:center;word-break:break-word}#app .mc .cell .it b[data-v-27ef4d05]{display:block;font-size:11px;color:var(--md-primary);font-weight:800}@media (max-width:640px){#app .mc .url[data-v-27ef4d05],#app .mc .mc-actions[data-v-27ef4d05]{width:100%}#app .mc .inv[data-v-27ef4d05]{grid-template-columns:repeat(5,1fr)}}\n";document.head.appendChild(s)}})();
