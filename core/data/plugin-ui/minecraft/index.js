import { ref as p, computed as h, onMounted as P, onUnmounted as O, openBlock as n, createElementBlock as o, createElementVNode as e, normalizeClass as D, toDisplayString as s, createCommentVNode as r, withDirectives as _, vModelText as w, vModelSelect as H, Fragment as y, normalizeStyle as j, createTextVNode as f, renderList as $ } from "vue";
const W = (S, U) => {
  const d = S.__vccOpts || S;
  for (const [k, c] of U)
    d[k] = c;
  return d;
}, X = { class: "mc" }, Y = { class: "mc-head" }, q = { class: "mc-title" }, G = { class: "state" }, K = {
  key: 0,
  class: "tag"
}, Q = { class: "mc-actions" }, R = ["disabled"], Z = ["disabled"], ee = ["disabled"], te = {
  key: 0,
  class: "err"
}, le = {
  key: 1,
  class: "card connect"
}, se = ["disabled"], ne = { class: "grid" }, oe = { class: "card" }, ae = { class: "card" }, ie = { class: "bar-row" }, ue = { class: "bar" }, re = { class: "bar-num" }, de = { class: "bar-row" }, ce = { class: "bar" }, ve = { class: "bar-num" }, me = {
  key: 0,
  class: "err small"
}, pe = { class: "card" }, he = { class: "muted" }, _e = { class: "players" }, ye = { class: "muted" }, fe = {
  key: 0,
  class: "muted"
}, ke = {
  key: 0,
  class: "muted"
}, be = { class: "card" }, ge = { class: "muted" }, we = { class: "players" }, $e = { class: "muted" }, xe = ["disabled", "onClick"], Me = {
  key: 0,
  class: "muted"
}, Ce = { class: "card" }, Se = { class: "muted" }, Ue = { class: "players" }, Ie = { class: "muted" }, Ve = ["disabled", "onClick"], Ee = {
  key: 0,
  class: "muted"
}, Ne = { class: "card" }, je = { class: "inv hotbar" }, ze = ["title"], Ae = {
  key: 0,
  class: "it"
}, Be = { key: 0 }, Te = { class: "card" }, Fe = { class: "inv" }, Le = ["title"], Je = {
  key: 0,
  class: "it"
}, Pe = { key: 0 }, Oe = {
  key: 3,
  class: "muted pad"
}, De = {
  __name: "MinecraftPage",
  setup(S) {
    const U = (() => {
      try {
        return localStorage.getItem("0kay.minecraft.url") || "";
      } catch {
        return "";
      }
    })(), d = p(U || `http://${location.hostname || "127.0.0.1"}:8765`), k = p(null), c = p({ waypoints: [], skills: [] }), m = p(""), v = p(!1), x = p(!1), u = p({ edition: "java", host: "", port: "", username: "XingYao", password: "" });
    let I = null;
    const a = h(() => k.value?.bot || null), V = h(() => !!a.value?.connected), z = h(() => k.value?.autopilot || { running: !1 });
    h(() => a.value?.username || "");
    function E(i, t = 20) {
      const l = Number(i);
      return Number.isFinite(l) ? Math.max(0, Math.min(100, l / t * 100)) : 0;
    }
    const A = h(() => {
      const i = {};
      for (const t of a.value?.inventory || []) i[t.slot] = t;
      return i;
    });
    function N(i) {
      return A.value[i] || null;
    }
    const B = h(() => Array.from({ length: 9 }, (i, t) => ({ slot: 36 + t, item: N(36 + t) }))), T = h(() => Array.from({ length: 27 }, (i, t) => ({ slot: 9 + t, item: N(9 + t) })));
    function b(i) {
      return String(i || "").replace(/_/g, " ");
    }
    async function g() {
      try {
        const i = await fetch(`${d.value.replace(/\/$/, "")}/status`, { signal: AbortSignal.timeout(6e3) });
        if (!i.ok) throw new Error(`HTTP ${i.status}`);
        k.value = await i.json(), m.value = "", F();
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
    async function M(i, t = {}) {
      v.value = !0;
      try {
        const C = await (await fetch(`${d.value.replace(/\/$/, "")}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: i, args: t }),
          signal: AbortSignal.timeout(4e4)
        })).json().catch(() => ({}));
        if (C.ok === !1) throw new Error(C.error || "action failed");
        await g();
      } catch (l) {
        m.value = l?.message || "action failed";
      } finally {
        v.value = !1;
      }
    }
    async function L() {
      await M("connect", {
        edition: u.value.edition,
        host: u.value.host.trim(),
        port: u.value.port ? Number(u.value.port) : void 0,
        username: u.value.username.trim() || void 0,
        password: u.value.password || void 0
      });
    }
    function J() {
      try {
        localStorage.setItem("0kay.minecraft.url", d.value);
      } catch {
      }
      g();
    }
    return P(() => {
      g(), I = setInterval(g, 3e3);
    }), O(() => {
      I && clearInterval(I);
    }), (i, t) => (n(), o("div", X, [
      e("header", Y, [
        e("div", q, [
          e("span", {
            class: D(["dot", V.value ? "on" : m.value ? "err" : "off"])
          }, null, 2),
          t[8] || (t[8] = e("h1", null, "Minecraft", -1)),
          e("span", G, s(V.value ? "在线" : a.value?.state || "未连接"), 1),
          z.value.running ? (n(), o("span", K, "AI 自动游玩")) : r("", !0)
        ]),
        e("div", Q, [
          _(e("input", {
            "onUpdate:modelValue": t[0] || (t[0] = (l) => d.value = l),
            class: "url",
            spellcheck: "false",
            onChange: J
          }, null, 544), [
            [w, d.value]
          ]),
          e("button", {
            disabled: v.value,
            onClick: g
          }, "刷新", 8, R),
          e("button", {
            disabled: v.value,
            onClick: t[1] || (t[1] = (l) => x.value = !x.value)
          }, s(x.value ? "收起" : "连接"), 9, Z),
          V.value ? (n(), o("button", {
            key: 0,
            class: "danger",
            disabled: v.value,
            onClick: t[2] || (t[2] = (l) => M("disconnect"))
          }, "断开", 8, ee)) : r("", !0)
        ])
      ]),
      m.value ? (n(), o("p", te, "服务不可达：" + s(m.value) + "（地址 " + s(d.value) + "）", 1)) : r("", !0),
      x.value ? (n(), o("section", le, [
        _(e("select", {
          "onUpdate:modelValue": t[3] || (t[3] = (l) => u.value.edition = l)
        }, [...t[9] || (t[9] = [
          e("option", { value: "java" }, "Java", -1),
          e("option", { value: "bedrock" }, "Bedrock", -1)
        ])], 512), [
          [H, u.value.edition]
        ]),
        _(e("input", {
          "onUpdate:modelValue": t[4] || (t[4] = (l) => u.value.host = l),
          placeholder: "服务器地址，如 razure.ink",
          spellcheck: "false"
        }, null, 512), [
          [w, u.value.host]
        ]),
        _(e("input", {
          "onUpdate:modelValue": t[5] || (t[5] = (l) => u.value.port = l),
          placeholder: "端口（Java 25565 / Bedrock 19132）",
          spellcheck: "false"
        }, null, 512), [
          [w, u.value.port]
        ]),
        _(e("input", {
          "onUpdate:modelValue": t[6] || (t[6] = (l) => u.value.username = l),
          placeholder: "昵称",
          spellcheck: "false"
        }, null, 512), [
          [w, u.value.username]
        ]),
        _(e("input", {
          "onUpdate:modelValue": t[7] || (t[7] = (l) => u.value.password = l),
          placeholder: "服务器密码（留空自动用 LIFE 记忆里的）",
          spellcheck: "false"
        }, null, 512), [
          [w, u.value.password]
        ]),
        e("button", {
          class: "primary",
          disabled: v.value || !u.value.host.trim(),
          onClick: L
        }, "连接", 8, se)
      ])) : r("", !0),
      a.value ? (n(), o(y, { key: 2 }, [
        e("section", ne, [
          e("div", oe, [
            t[15] || (t[15] = e("h2", null, "服务器", -1)),
            e("dl", null, [
              t[10] || (t[10] = e("dt", null, "地址", -1)),
              e("dd", null, s(a.value.host || "-") + ":" + s(a.value.port || "-"), 1),
              t[11] || (t[11] = e("dt", null, "版本", -1)),
              e("dd", null, s(a.value.edition === "bedrock" ? "Bedrock" : "Java") + " " + s(a.value.version || ""), 1),
              t[12] || (t[12] = e("dt", null, "维度", -1)),
              e("dd", null, s(a.value.dimension || "-"), 1),
              t[13] || (t[13] = e("dt", null, "坐标", -1)),
              e("dd", null, s(a.value.position ? `${a.value.position.x}, ${a.value.position.y}, ${a.value.position.z}` : "-"), 1),
              t[14] || (t[14] = e("dt", null, "手持", -1)),
              e("dd", null, s(b(a.value.held) || "空"), 1)
            ])
          ]),
          e("div", ae, [
            t[18] || (t[18] = e("h2", null, "状态", -1)),
            e("div", ie, [
              t[16] || (t[16] = e("span", { class: "bar-label" }, "生命", -1)),
              e("div", ue, [
                e("i", {
                  class: "hp",
                  style: j({ width: E(a.value.health) + "%" })
                }, null, 4)
              ]),
              e("span", re, s(a.value.health ?? "-") + "/20", 1)
            ]),
            e("div", de, [
              t[17] || (t[17] = e("span", { class: "bar-label" }, "饥饿", -1)),
              e("div", ce, [
                e("i", {
                  class: "food",
                  style: j({ width: E(a.value.food) + "%" })
                }, null, 4)
              ]),
              e("span", ve, s(a.value.food ?? "-") + "/20", 1)
            ]),
            a.value.error ? (n(), o("p", me, s(a.value.error), 1)) : r("", !0)
          ]),
          e("div", pe, [
            e("h2", null, [
              t[19] || (t[19] = f("玩家 ", -1)),
              e("span", he, s((a.value.players || []).length), 1)
            ]),
            e("ul", _e, [
              (n(!0), o(y, null, $(a.value.players || [], (l) => (n(), o("li", {
                key: l.name
              }, [
                e("b", null, s(l.name), 1),
                e("span", ye, s(l.position ? `${Math.round(l.position.x)}, ${Math.round(l.position.y)}, ${Math.round(l.position.z)}` : ""), 1),
                l.ping != null ? (n(), o("span", fe, s(l.ping) + "ms", 1)) : r("", !0)
              ]))), 128)),
              (a.value.players || []).length ? r("", !0) : (n(), o("li", ke, "暂无其他玩家"))
            ])
          ])
        ]),
        e("section", be, [
          e("h2", null, [
            t[20] || (t[20] = f("记忆的地点 ", -1)),
            e("span", ge, s((c.value.waypoints || []).length), 1)
          ]),
          e("ul", we, [
            (n(!0), o(y, null, $(c.value.waypoints || [], (l) => (n(), o("li", {
              key: l.id
            }, [
              e("b", null, s(l.name), 1),
              e("span", $e, s(Math.round(l.x)) + ", " + s(Math.round(l.y)) + ", " + s(Math.round(l.z)) + " · " + s(l.type), 1),
              e("button", {
                class: "mini",
                disabled: v.value,
                onClick: (C) => M("waypoint_goto", { name: l.name })
              }, "前往", 8, xe)
            ]))), 128)),
            (c.value.waypoints || []).length ? r("", !0) : (n(), o("li", Me, "暂无，机器人会随游玩自动记录"))
          ])
        ]),
        e("section", Ce, [
          e("h2", null, [
            t[21] || (t[21] = f("学会的技能 ", -1)),
            e("span", Se, s((c.value.skills || []).length), 1)
          ]),
          e("ul", Ue, [
            (n(!0), o(y, null, $(c.value.skills || [], (l) => (n(), o("li", {
              key: l.id
            }, [
              e("b", null, s(l.name), 1),
              e("span", Ie, s((l.steps || []).length) + " 步 · 用过 " + s(l.runs || 0) + " 次", 1),
              e("button", {
                class: "mini",
                disabled: v.value,
                onClick: (C) => M("skill_run", { name: l.name })
              }, "执行", 8, Ve)
            ]))), 128)),
            (c.value.skills || []).length ? r("", !0) : (n(), o("li", Ee, "暂无，LIFE 会定期复盘并沉淀技能"))
          ])
        ]),
        e("section", Ne, [
          t[22] || (t[22] = e("h2", null, [
            f("物品栏 "),
            e("span", { class: "muted" }, "快捷栏")
          ], -1)),
          e("div", je, [
            (n(!0), o(y, null, $(B.value, (l) => (n(), o("div", {
              key: l.slot,
              class: "cell",
              title: l.item ? `${b(l.item.name)} x${l.item.count}` : "空"
            }, [
              l.item ? (n(), o("span", Ae, [
                f(s(b(l.item.name)), 1),
                l.item.count > 1 ? (n(), o("b", Be, "×" + s(l.item.count), 1)) : r("", !0)
              ])) : r("", !0)
            ], 8, ze))), 128))
          ])
        ]),
        e("section", Te, [
          t[23] || (t[23] = e("h2", null, "背包", -1)),
          e("div", Fe, [
            (n(!0), o(y, null, $(T.value, (l) => (n(), o("div", {
              key: l.slot,
              class: "cell",
              title: l.item ? `${b(l.item.name)} x${l.item.count}` : "空"
            }, [
              l.item ? (n(), o("span", Je, [
                f(s(b(l.item.name)), 1),
                l.item.count > 1 ? (n(), o("b", Pe, "×" + s(l.item.count), 1)) : r("", !0)
              ])) : r("", !0)
            ], 8, Le))), 128))
          ])
        ])
      ], 64)) : m.value ? r("", !0) : (n(), o("p", Oe, "未连接。点「连接」填写服务器，或让 L.I.F.E 说「连到 xxx 服务器」。"))
    ]));
  }
}, We = /* @__PURE__ */ W(De, [["__scopeId", "data-v-74ca0137"]]);
export {
  We as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('minecraft-plugin-style')){const s=document.createElement('style');s.id='minecraft-plugin-style';s.textContent=".mc[data-v-74ca0137]{padding:20px 24px;color:var(--md-on-surface, #e6e1e5);max-width:1100px}.mc-head[data-v-74ca0137]{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:16px}.mc-title[data-v-74ca0137]{display:flex;align-items:center;gap:10px}.mc-title h1[data-v-74ca0137]{font-size:20px;margin:0}.dot[data-v-74ca0137]{width:10px;height:10px;border-radius:50%;background:#888}.dot.on[data-v-74ca0137]{background:#37c871;box-shadow:0 0 8px #37c871}.dot.err[data-v-74ca0137]{background:#e35d5d}.state[data-v-74ca0137]{color:var(--md-on-surface-variant, #a8a2ab);font-size:13px}.tag[data-v-74ca0137]{font-size:12px;padding:2px 8px;border-radius:999px;background:#37c87126;color:#37c871;border:1px solid rgba(55,200,113,.4)}.mc-actions[data-v-74ca0137]{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.mc button[data-v-74ca0137]{background:var(--md-surface-container, #2b2930);color:inherit;border:1px solid var(--md-outline, #49454f);border-radius:8px;padding:6px 12px;cursor:pointer}.mc button[data-v-74ca0137]:disabled{opacity:.5;cursor:default}.mc button.primary[data-v-74ca0137]{background:#4a7dff;border-color:#4a7dff;color:#fff}.mc button.danger[data-v-74ca0137]{border-color:#e35d5d;color:#e35d5d}.url[data-v-74ca0137],.connect input[data-v-74ca0137],.connect select[data-v-74ca0137]{background:#ffffff0a;color:inherit;border:1px solid var(--md-outline, #49454f);border-radius:8px;padding:6px 10px;font:inherit}.url[data-v-74ca0137]{width:230px}.grid[data-v-74ca0137]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-bottom:14px}.card[data-v-74ca0137]{background:var(--md-surface-container, #2b2930);border:1px solid var(--md-outline, #49454f);border-radius:14px;padding:14px 16px;margin-bottom:14px}.card h2[data-v-74ca0137]{font-size:14px;margin:0 0 10px;font-weight:600}.card h2 .muted[data-v-74ca0137]{font-weight:400;font-size:12px}dl[data-v-74ca0137]{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;margin:0;font-size:13px}dt[data-v-74ca0137]{color:var(--md-on-surface-variant, #a8a2ab)}dd[data-v-74ca0137]{margin:0}.bar-row[data-v-74ca0137]{display:flex;align-items:center;gap:10px;margin:8px 0;font-size:13px}.bar-label[data-v-74ca0137]{width:34px;color:var(--md-on-surface-variant, #a8a2ab)}.bar[data-v-74ca0137]{flex:1;height:12px;border-radius:6px;background:#ffffff14;overflow:hidden}.bar i[data-v-74ca0137]{display:block;height:100%;border-radius:6px}.bar i.hp[data-v-74ca0137]{background:linear-gradient(90deg,#e35d5d,#ff8a8a)}.bar i.food[data-v-74ca0137]{background:linear-gradient(90deg,#d99a37,#f0c060)}.bar-num[data-v-74ca0137]{width:54px;text-align:right;color:var(--md-on-surface-variant, #a8a2ab)}.players[data-v-74ca0137]{list-style:none;margin:0;padding:0;font-size:13px}.players li[data-v-74ca0137]{display:flex;gap:10px;align-items:center;padding:3px 0}.players li span[data-v-74ca0137]:last-child{margin-left:auto}.mini[data-v-74ca0137]{padding:2px 10px;font-size:12px;margin-left:auto}.inv[data-v-74ca0137]{display:grid;grid-template-columns:repeat(9,1fr);gap:6px}.inv.hotbar[data-v-74ca0137]{margin-bottom:4px}.cell[data-v-74ca0137]{aspect-ratio:1;border-radius:8px;background:#ffffff0d;border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;padding:2px;overflow:hidden}.cell .it[data-v-74ca0137]{font-size:10px;line-height:1.05;text-align:center;word-break:break-word}.cell .it b[data-v-74ca0137]{display:block;font-size:10px;color:#ffd76a}.muted[data-v-74ca0137]{color:var(--md-on-surface-variant, #a8a2ab)}.err[data-v-74ca0137]{color:#e35d5d}.err.small[data-v-74ca0137]{font-size:12px;margin:6px 0 0}.pad[data-v-74ca0137]{padding:8px 0}.connect[data-v-74ca0137]{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.connect input[data-v-74ca0137]{min-width:160px;flex:1}\n";document.head.appendChild(s)}})();
