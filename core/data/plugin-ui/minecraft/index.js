import { ref as c, computed as _, onMounted as H, onUnmounted as D, openBlock as n, createElementBlock as o, createElementVNode as t, createTextVNode as p, withDirectives as b, vModelText as f, normalizeClass as Y, toDisplayString as s, createCommentVNode as r, vModelSelect as K, Fragment as k, normalizeStyle as B, renderList as M } from "vue";
const R = (T, N) => {
  const d = T.__vccOpts || T;
  for (const [y, g] of N)
    d[y] = g;
  return d;
}, W = { class: "mc" }, Z = { class: "mc-head" }, q = { class: "mc-title" }, G = { class: "mc-copy" }, Q = { class: "mc-sub" }, tt = {
  key: 0,
  class: "tag"
}, et = { class: "mc-actions" }, lt = ["disabled"], st = ["disabled"], nt = ["disabled"], ot = {
  key: 0,
  class: "err"
}, at = {
  key: 1,
  class: "card connect"
}, it = { class: "connect-grid" }, ut = { class: "wide" }, rt = { class: "actions" }, dt = ["disabled"], ct = { class: "grid" }, vt = { class: "card" }, pt = { class: "card" }, mt = { class: "bar-row" }, ht = { class: "bar" }, _t = { class: "bar-num" }, bt = { class: "bar-row" }, ft = { class: "bar" }, kt = { class: "bar-num" }, yt = {
  key: 0,
  class: "err small"
}, gt = { class: "card" }, wt = { class: "muted" }, $t = { class: "list" }, Mt = { class: "muted" }, Ct = {
  key: 0,
  class: "chip muted"
}, xt = {
  key: 0,
  class: "muted"
}, St = { class: "card" }, Tt = { class: "muted" }, Nt = { class: "list" }, Ut = { class: "muted" }, Vt = ["disabled", "onClick"], Et = {
  key: 0,
  class: "muted"
}, It = { class: "card" }, jt = { class: "muted" }, At = { class: "list" }, Bt = { class: "muted" }, zt = ["disabled", "onClick"], Ft = {
  key: 0,
  class: "muted"
}, Lt = { class: "card" }, Pt = { class: "inv hotbar" }, Jt = ["title"], Ot = {
  key: 0,
  class: "it"
}, Xt = { key: 0 }, Ht = { class: "card" }, Dt = { class: "inv" }, Yt = ["title"], Kt = {
  key: 0,
  class: "it"
}, Rt = { key: 0 }, Wt = {
  key: 3,
  class: "muted pad"
}, Zt = {
  key: 4,
  class: "muted pad"
}, qt = {
  __name: "MinecraftPage",
  setup(T) {
    const N = (() => {
      try {
        return localStorage.getItem("0kay.minecraft.url") || "";
      } catch {
        return "";
      }
    })(), d = c(N || `http://${location.hostname || "127.0.0.1"}:8765`), y = c(""), g = () => ({ Authorization: `Bearer ${y.value}` }), U = c(null), m = c({ waypoints: [], skills: [] }), h = c(""), I = c(!0), v = c(!1), C = c(!1), u = c({ edition: "java", host: "", port: "", username: "XingYao", password: "" });
    let V = null;
    const a = _(() => U.value?.bot || null), E = _(() => !!a.value?.connected), z = _(() => U.value?.autopilot || { running: !1 }), F = _(() => a.value?.username || "");
    function j(i, e = 20) {
      const l = Number(i);
      return Number.isFinite(l) ? Math.max(0, Math.min(100, l / e * 100)) : 0;
    }
    const L = _(() => {
      const i = {};
      for (const e of a.value?.inventory || []) i[e.slot] = e;
      return i;
    });
    function A(i) {
      return L.value[i] || null;
    }
    const P = _(() => Array.from({ length: 9 }, (i, e) => ({ slot: 36 + e, item: A(36 + e) }))), J = _(() => Array.from({ length: 27 }, (i, e) => ({ slot: 9 + e, item: A(9 + e) })));
    function w(i) {
      return String(i || "").replace(/_/g, " ");
    }
    async function $() {
      try {
        const i = await fetch(`${d.value.replace(/\/$/, "")}/status`, { headers: g(), signal: AbortSignal.timeout(6e3) });
        if (!i.ok) throw new Error(`HTTP ${i.status}`);
        U.value = await i.json(), h.value = "", O();
      } catch (i) {
        h.value = i?.message || "unreachable";
      } finally {
        I.value = !1;
      }
    }
    async function O() {
      try {
        const i = await fetch(`${d.value.replace(/\/$/, "")}/world`, { headers: g(), signal: AbortSignal.timeout(6e3) });
        i.ok && (m.value = await i.json());
      } catch {
      }
    }
    async function x(i, e = {}) {
      v.value = !0;
      try {
        const l = await fetch(`${d.value.replace(/\/$/, "")}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...g() },
          body: JSON.stringify({ action: i, args: e }),
          signal: AbortSignal.timeout(4e4)
        }), S = await l.json().catch(() => ({}));
        if (!l.ok || S.ok === !1) throw new Error(S.error || `HTTP ${l.status}`);
        await $();
      } catch (l) {
        h.value = l?.message || "action failed";
      } finally {
        v.value = !1;
      }
    }
    async function X() {
      await x("connect", {
        edition: u.value.edition,
        host: u.value.host.trim(),
        port: u.value.port ? Number(u.value.port) : void 0,
        username: u.value.username.trim() || void 0,
        password: u.value.password || void 0
      });
    }
    return H(() => {
      $(), V = setInterval($, 3e3);
    }), D(() => {
      V && clearInterval(V);
    }), (i, e) => (n(), o("div", W, [
      t("label", null, [
        e[9] || (e[9] = p("服务访问令牌 ", -1)),
        b(t("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (l) => y.value = l),
          type: "password",
          autocomplete: "off",
          placeholder: "MINECRAFT_TOKEN",
          onChange: $
        }, null, 544), [
          [f, y.value]
        ])
      ]),
      t("header", Z, [
        t("div", q, [
          e[11] || (e[11] = t("span", {
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
          t("div", G, [
            e[10] || (e[10] = t("h1", null, "Minecraft", -1)),
            t("p", Q, [
              t("span", {
                class: Y(["dot", E.value ? "on" : h.value ? "err" : "off"])
              }, null, 2),
              p(" " + s(E.value ? F.value || "已连接" : a.value?.state || "未连接") + " ", 1),
              z.value.running ? (n(), o("span", tt, "AI 自动游玩")) : r("", !0)
            ])
          ])
        ]),
        t("div", et, [
          b(t("input", {
            "onUpdate:modelValue": e[1] || (e[1] = (l) => d.value = l),
            class: "url",
            spellcheck: "false",
            "aria-label": "服务地址"
          }, null, 512), [
            [f, d.value]
          ]),
          t("button", {
            class: "btn tonic",
            disabled: v.value,
            onClick: $
          }, "刷新", 8, lt),
          t("button", {
            class: "btn filled",
            disabled: v.value,
            onClick: e[2] || (e[2] = (l) => C.value = !C.value)
          }, s(C.value ? "收起" : "连接"), 9, st),
          E.value ? (n(), o("button", {
            key: 0,
            class: "btn danger",
            disabled: v.value,
            onClick: e[3] || (e[3] = (l) => x("disconnect"))
          }, "断开", 8, nt)) : r("", !0)
        ])
      ]),
      h.value ? (n(), o("p", ot, "服务不可达：" + s(h.value) + "（地址 " + s(d.value) + "）", 1)) : r("", !0),
      C.value ? (n(), o("section", at, [
        e[18] || (e[18] = t("h2", null, "连接到服务器", -1)),
        t("div", it, [
          t("label", null, [
            e[13] || (e[13] = t("span", null, "版本", -1)),
            b(t("select", {
              "onUpdate:modelValue": e[4] || (e[4] = (l) => u.value.edition = l)
            }, [...e[12] || (e[12] = [
              t("option", { value: "java" }, "Java", -1),
              t("option", { value: "bedrock" }, "Bedrock", -1)
            ])], 512), [
              [K, u.value.edition]
            ])
          ]),
          t("label", null, [
            e[14] || (e[14] = t("span", null, "服务器地址", -1)),
            b(t("input", {
              "onUpdate:modelValue": e[5] || (e[5] = (l) => u.value.host = l),
              placeholder: "如 razure.ink",
              spellcheck: "false"
            }, null, 512), [
              [f, u.value.host]
            ])
          ]),
          t("label", null, [
            e[15] || (e[15] = t("span", null, "端口", -1)),
            b(t("input", {
              "onUpdate:modelValue": e[6] || (e[6] = (l) => u.value.port = l),
              placeholder: "Java 25565 / Bedrock 19132",
              spellcheck: "false"
            }, null, 512), [
              [f, u.value.port]
            ])
          ]),
          t("label", null, [
            e[16] || (e[16] = t("span", null, "昵称", -1)),
            b(t("input", {
              "onUpdate:modelValue": e[7] || (e[7] = (l) => u.value.username = l),
              placeholder: "XingYao",
              spellcheck: "false"
            }, null, 512), [
              [f, u.value.username]
            ])
          ]),
          t("label", ut, [
            e[17] || (e[17] = t("span", null, "服务器密码", -1)),
            b(t("input", {
              "onUpdate:modelValue": e[8] || (e[8] = (l) => u.value.password = l),
              placeholder: "留空自动使用 LIFE 记忆里的密码",
              spellcheck: "false"
            }, null, 512), [
              [f, u.value.password]
            ])
          ])
        ]),
        t("div", rt, [
          t("button", {
            class: "btn filled",
            disabled: v.value || !u.value.host.trim(),
            onClick: X
          }, "连接", 8, dt)
        ])
      ])) : r("", !0),
      a.value ? (n(), o(k, { key: 2 }, [
        t("section", ct, [
          t("div", vt, [
            e[24] || (e[24] = t("h2", null, "服务器", -1)),
            t("dl", null, [
              e[19] || (e[19] = t("dt", null, "地址", -1)),
              t("dd", null, s(a.value.host || "-") + ":" + s(a.value.port || "-"), 1),
              e[20] || (e[20] = t("dt", null, "版本", -1)),
              t("dd", null, s(a.value.edition === "bedrock" ? "Bedrock" : "Java") + " " + s(a.value.version || ""), 1),
              e[21] || (e[21] = t("dt", null, "维度", -1)),
              t("dd", null, s(a.value.dimension || "-"), 1),
              e[22] || (e[22] = t("dt", null, "坐标", -1)),
              t("dd", null, s(a.value.position ? `${a.value.position.x}, ${a.value.position.y}, ${a.value.position.z}` : "-"), 1),
              e[23] || (e[23] = t("dt", null, "手持", -1)),
              t("dd", null, s(w(a.value.held) || "空"), 1)
            ])
          ]),
          t("div", pt, [
            e[27] || (e[27] = t("h2", null, "状态", -1)),
            t("div", mt, [
              e[25] || (e[25] = t("span", { class: "bar-label" }, "生命", -1)),
              t("div", ht, [
                t("i", {
                  class: "hp",
                  style: B({ transform: `scaleX(${j(a.value.health) / 100})` })
                }, null, 4)
              ]),
              t("span", _t, s(a.value.health ?? "-") + "/20", 1)
            ]),
            t("div", bt, [
              e[26] || (e[26] = t("span", { class: "bar-label" }, "饥饿", -1)),
              t("div", ft, [
                t("i", {
                  class: "food",
                  style: B({ transform: `scaleX(${j(a.value.food) / 100})` })
                }, null, 4)
              ]),
              t("span", kt, s(a.value.food ?? "-") + "/20", 1)
            ]),
            a.value.error ? (n(), o("p", yt, s(a.value.error), 1)) : r("", !0)
          ]),
          t("div", gt, [
            t("h2", null, [
              e[28] || (e[28] = p("玩家 ", -1)),
              t("span", wt, s((a.value.players || []).length), 1)
            ]),
            t("ul", $t, [
              (n(!0), o(k, null, M(a.value.players || [], (l) => (n(), o("li", {
                key: l.name
              }, [
                t("b", null, s(l.name), 1),
                t("span", Mt, s(l.position ? `${Math.round(l.position.x)}, ${Math.round(l.position.y)}, ${Math.round(l.position.z)}` : ""), 1),
                l.ping != null ? (n(), o("span", Ct, s(l.ping) + "ms", 1)) : r("", !0)
              ]))), 128)),
              (a.value.players || []).length ? r("", !0) : (n(), o("li", xt, "暂无其他玩家"))
            ])
          ])
        ]),
        t("section", St, [
          t("h2", null, [
            e[29] || (e[29] = p("记忆的地点 ", -1)),
            t("span", Tt, s((m.value.waypoints || []).length), 1)
          ]),
          t("ul", Nt, [
            (n(!0), o(k, null, M(m.value.waypoints || [], (l) => (n(), o("li", {
              key: l.id
            }, [
              t("b", null, s(l.name), 1),
              t("span", Ut, s(Math.round(l.x)) + ", " + s(Math.round(l.y)) + ", " + s(Math.round(l.z)) + " · " + s(l.type), 1),
              t("button", {
                class: "btn sm tonic",
                disabled: v.value,
                onClick: (S) => x("waypoint_goto", { name: l.name })
              }, "前往", 8, Vt)
            ]))), 128)),
            (m.value.waypoints || []).length ? r("", !0) : (n(), o("li", Et, "暂无，机器人会随游玩自动记录"))
          ])
        ]),
        t("section", It, [
          t("h2", null, [
            e[30] || (e[30] = p("学会的技能 ", -1)),
            t("span", jt, s((m.value.skills || []).length), 1)
          ]),
          t("ul", At, [
            (n(!0), o(k, null, M(m.value.skills || [], (l) => (n(), o("li", {
              key: l.id
            }, [
              t("b", null, s(l.name), 1),
              t("span", Bt, s((l.steps || []).length) + " 步 · 用过 " + s(l.runs || 0) + " 次", 1),
              t("button", {
                class: "btn sm tonic",
                disabled: v.value,
                onClick: (S) => x("skill_run", { name: l.name })
              }, "执行", 8, zt)
            ]))), 128)),
            (m.value.skills || []).length ? r("", !0) : (n(), o("li", Ft, "暂无，LIFE 会定期复盘并沉淀技能"))
          ])
        ]),
        t("section", Lt, [
          e[31] || (e[31] = t("h2", null, [
            p("物品栏 "),
            t("span", { class: "muted" }, "快捷栏")
          ], -1)),
          t("div", Pt, [
            (n(!0), o(k, null, M(P.value, (l) => (n(), o("div", {
              key: l.slot,
              class: "cell",
              title: l.item ? `${w(l.item.name)} x${l.item.count}` : "空"
            }, [
              l.item ? (n(), o("span", Ot, [
                p(s(w(l.item.name)), 1),
                l.item.count > 1 ? (n(), o("b", Xt, "×" + s(l.item.count), 1)) : r("", !0)
              ])) : r("", !0)
            ], 8, Jt))), 128))
          ])
        ]),
        t("section", Ht, [
          e[32] || (e[32] = t("h2", null, "背包", -1)),
          t("div", Dt, [
            (n(!0), o(k, null, M(J.value, (l) => (n(), o("div", {
              key: l.slot,
              class: "cell",
              title: l.item ? `${w(l.item.name)} x${l.item.count}` : "空"
            }, [
              l.item ? (n(), o("span", Kt, [
                p(s(w(l.item.name)), 1),
                l.item.count > 1 ? (n(), o("b", Rt, "×" + s(l.item.count), 1)) : r("", !0)
              ])) : r("", !0)
            ], 8, Yt))), 128))
          ])
        ])
      ], 64)) : I.value ? (n(), o("p", Wt, "正在加载…")) : h.value ? r("", !0) : (n(), o("p", Zt, "未连接。点「连接」填写服务器，或让 L.I.F.E 说「连到 xxx 服务器」。"))
    ]));
  }
}, Qt = /* @__PURE__ */ R(qt, [["__scopeId", "data-v-e35c4cca"]]);
export {
  Qt as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('minecraft-plugin-style')){const s=document.createElement('style');s.id='minecraft-plugin-style';s.textContent="#app .mc[data-v-e35c4cca]{padding:clamp(18px,2.4vw,30px);max-width:1120px;margin:0 auto;color:var(--md-on-surface);font-family:var(--font-family)}#app .mc h1[data-v-e35c4cca],#app .mc h2[data-v-e35c4cca]{margin:0;letter-spacing:-.01em}#app .mc h2[data-v-e35c4cca]{font-size:15px;font-weight:750;margin-bottom:12px;display:flex;align-items:center;gap:8px}#app .mc .mc-head[data-v-e35c4cca]{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px;padding:20px 22px;border-radius:28px;background:radial-gradient(520px 240px at 100% 0%,color-mix(in srgb,var(--md-primary) 12%,transparent),transparent 70%),linear-gradient(135deg,var(--md-primary-container),color-mix(in srgb,var(--md-primary-container) 45%,var(--md-surface-container-high)));box-shadow:var(--shadow-1)}#app .mc .mc-title[data-v-e35c4cca]{display:flex;align-items:center;gap:14px;min-width:0}#app .mc .mc-logo[data-v-e35c4cca]{width:52px;height:52px;flex-shrink:0;display:grid;place-items:center;border-radius:18px 18px 18px 7px;background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .mc .mc-copy h1[data-v-e35c4cca]{font-size:22px;font-weight:800}#app .mc .mc-sub[data-v-e35c4cca]{display:flex;align-items:center;gap:8px;margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);flex-wrap:wrap}#app .mc .dot[data-v-e35c4cca]{width:9px;height:9px;border-radius:50%;background:var(--md-outline);flex-shrink:0}#app .mc .dot.on[data-v-e35c4cca]{background:var(--md-success);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-success) 22%,transparent)}#app .mc .dot.err[data-v-e35c4cca]{background:var(--md-error);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-error) 20%,transparent)}#app .mc .tag[data-v-e35c4cca]{font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--md-success-container);color:var(--md-on-success-container,#0d3b1e)}#app .mc .mc-actions[data-v-e35c4cca]{display:flex;gap:8px;align-items:center;flex-wrap:wrap}#app .mc .btn[data-v-e35c4cca]{min-height:44px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;color:var(--md-on-surface);background:var(--md-surface-container-high);transition:transform .24s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .18s,box-shadow .2s,border-radius .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .mc .btn[data-v-e35c4cca]:disabled{opacity:.5;cursor:not-allowed}@media(hover:hover)and (pointer:fine){#app .mc .btn[data-v-e35c4cca]:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}}#app .mc .btn.sm[data-v-e35c4cca]{min-height:44px;padding:0 13px;font-size:13px}#app .mc .btn.filled[data-v-e35c4cca]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .mc .btn.tonic[data-v-e35c4cca]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .mc .btn.danger[data-v-e35c4cca]{background:var(--md-error-container);color:var(--md-on-error-container,var(--md-on-error-container))}#app .mc .url[data-v-e35c4cca],#app .mc .connect input[data-v-e35c4cca],#app .mc .connect select[data-v-e35c4cca]{height:44px;padding:0 14px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:background-color .18s,border-color .18s,box-shadow .2s}#app .mc .url[data-v-e35c4cca]{width:238px}#app .mc .url[data-v-e35c4cca]:focus-visible,#app .mc .connect input[data-v-e35c4cca]:focus-visible,#app .mc .connect select[data-v-e35c4cca]:focus-visible{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .mc .card[data-v-e35c4cca]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;padding:18px 20px;margin-bottom:16px;box-shadow:var(--shadow-1);transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}@media(hover:hover)and (pointer:fine){#app .mc .card[data-v-e35c4cca]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}}#app .mc .grid[data-v-e35c4cca]{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-bottom:0}#app .mc .grid .card[data-v-e35c4cca]{margin-bottom:16px}#app .mc .connect-grid[data-v-e35c4cca]{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}#app .mc .connect-grid label[data-v-e35c4cca]{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}#app .mc .connect-grid label.wide[data-v-e35c4cca]{grid-column:1/-1}#app .mc .connect .actions[data-v-e35c4cca]{display:flex;justify-content:flex-end;margin-top:14px}#app .mc dl[data-v-e35c4cca]{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0;font-size:13px}#app .mc dt[data-v-e35c4cca]{color:var(--md-on-surface-variant)}#app .mc dd[data-v-e35c4cca]{margin:0;overflow-wrap:anywhere}#app .mc .bar-row[data-v-e35c4cca]{display:flex;align-items:center;gap:12px;margin:10px 0;font-size:13px}#app .mc .bar-label[data-v-e35c4cca]{width:36px;color:var(--md-on-surface-variant);flex-shrink:0}#app .mc .bar[data-v-e35c4cca]{flex:1;height:12px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}#app .mc .bar i[data-v-e35c4cca]{display:block;width:100%;height:100%;border-radius:999px;transform-origin:left;transform:scaleX(0);transition:transform var(--duration-long,.36s) var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .mc .bar i.hp[data-v-e35c4cca]{background:linear-gradient(90deg,#e35d5d,#ff9a9a)}#app .mc .bar i.food[data-v-e35c4cca]{background:linear-gradient(90deg,#d99a37,#f0c060)}#app .mc .bar-num[data-v-e35c4cca]{width:54px;text-align:right;color:var(--md-on-surface-variant);flex-shrink:0}#app .mc .list[data-v-e35c4cca]{list-style:none;margin:0;padding:0;font-size:13px;display:flex;flex-direction:column;gap:2px}#app .mc .list li[data-v-e35c4cca]{display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}#app .mc .list li[data-v-e35c4cca]:last-child{border-bottom:none}#app .mc .list li .btn[data-v-e35c4cca],#app .mc .list li span.muted[data-v-e35c4cca],#app .mc .list li .chip[data-v-e35c4cca]{margin-left:auto}#app .mc .list li b+span.muted[data-v-e35c4cca]{flex:1;min-width:0}#app .mc .chip[data-v-e35c4cca]{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}#app .mc .chip.muted[data-v-e35c4cca]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:600}#app .mc .muted[data-v-e35c4cca]{color:var(--md-on-surface-variant)}#app .mc .err[data-v-e35c4cca]{color:var(--md-error);font-size:13px;background:var(--md-error-container);padding:11px 16px;border-radius:16px;margin-bottom:14px}#app .mc .err.small[data-v-e35c4cca]{font-size:12px;margin:8px 0 0;background:transparent;padding:0}#app .mc .pad[data-v-e35c4cca]{padding:8px 0}#app .mc .inv[data-v-e35c4cca]{display:grid;grid-template-columns:repeat(9,1fr);gap:8px}#app .mc .inv.hotbar[data-v-e35c4cca]{margin-bottom:10px}#app .mc .cell[data-v-e35c4cca]{aspect-ratio:1;border-radius:14px;background:var(--md-surface-container-high);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);display:flex;align-items:center;justify-content:center;padding:4px;overflow:hidden;transition:transform .2s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .18s}@media(hover:hover)and (pointer:fine){#app .mc .cell[data-v-e35c4cca]:hover{background:var(--md-surface-container-highest)}}#app .mc .cell .it[data-v-e35c4cca]{font-size:11px;line-height:1.1;text-align:center;word-break:break-word}#app .mc .cell .it b[data-v-e35c4cca]{display:block;font-size:11px;color:var(--md-primary);font-weight:800}@media(max-width:640px){#app .mc .url[data-v-e35c4cca],#app .mc .mc-actions[data-v-e35c4cca]{width:100%}#app .mc .inv[data-v-e35c4cca]{grid-template-columns:repeat(5,1fr)}}@media(prefers-reduced-motion:reduce){#app .mc[data-v-e35c4cca] *,#app .mc[data-v-e35c4cca] *:before,#app .mc[data-v-e35c4cca] *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}#app .mc .btn[data-v-e35c4cca]:hover:not(:disabled),#app .mc .card[data-v-e35c4cca]:hover{transform:none}}\n";document.head.appendChild(s)}})();
