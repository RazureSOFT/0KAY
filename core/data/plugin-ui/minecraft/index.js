import { ref as p, computed as v, onMounted as P, onUnmounted as F, openBlock as n, createElementBlock as a, createElementVNode as t, normalizeClass as L, toDisplayString as o, createCommentVNode as r, withDirectives as h, vModelText as b, vModelSelect as O, Fragment as g, normalizeStyle as B, createTextVNode as w, renderList as U } from "vue";
const D = ($, x) => {
  const d = $.__vccOpts || $;
  for (const [f, c] of x)
    d[f] = c;
  return d;
}, H = { class: "mc" }, X = { class: "mc-head" }, Y = { class: "mc-title" }, q = { class: "state" }, G = {
  key: 0,
  class: "tag"
}, K = { class: "mc-actions" }, Q = ["disabled"], R = ["disabled"], W = ["disabled"], Z = {
  key: 0,
  class: "err"
}, ee = {
  key: 1,
  class: "card connect"
}, te = ["disabled"], le = { class: "grid" }, se = { class: "card" }, oe = { class: "card" }, ne = { class: "bar-row" }, ae = { class: "bar" }, ie = { class: "bar-num" }, ue = { class: "bar-row" }, re = { class: "bar" }, de = { class: "bar-num" }, ce = {
  key: 0,
  class: "err small"
}, ve = { class: "card" }, me = { class: "muted" }, pe = { class: "players" }, he = { class: "muted" }, fe = {
  key: 0,
  class: "muted"
}, _e = {
  key: 0,
  class: "muted"
}, ye = { class: "card" }, be = { class: "inv hotbar" }, ke = ["title"], ge = {
  key: 0,
  class: "it"
}, we = { key: 0 }, $e = { class: "card" }, xe = { class: "inv" }, Me = ["title"], Se = {
  key: 0,
  class: "it"
}, Ue = { key: 0 }, Ce = {
  key: 3,
  class: "muted pad"
}, Ve = {
  __name: "MinecraftPage",
  setup($) {
    const x = (() => {
      try {
        return localStorage.getItem("0kay.minecraft.url") || "";
      } catch {
        return "";
      }
    })(), d = p(x || `http://${location.hostname || "127.0.0.1"}:8765`), f = p(null), c = p(""), m = p(!1), k = p(!1), u = p({ edition: "java", host: "", port: "", username: "XingYao", password: "" });
    let M = null;
    const s = v(() => f.value?.bot || null), S = v(() => !!s.value?.connected), T = v(() => f.value?.autopilot || { running: !1 });
    v(() => s.value?.username || "");
    function C(i, e = 20) {
      const l = Number(i);
      return Number.isFinite(l) ? Math.max(0, Math.min(100, l / e * 100)) : 0;
    }
    const j = v(() => {
      const i = {};
      for (const e of s.value?.inventory || []) i[e.slot] = e;
      return i;
    });
    function V(i) {
      return j.value[i] || null;
    }
    const z = v(() => Array.from({ length: 9 }, (i, e) => ({ slot: 36 + e, item: V(36 + e) }))), A = v(() => Array.from({ length: 27 }, (i, e) => ({ slot: 9 + e, item: V(9 + e) })));
    function _(i) {
      return String(i || "").replace(/_/g, " ");
    }
    async function y() {
      try {
        const i = await fetch(`${d.value.replace(/\/$/, "")}/status`, { signal: AbortSignal.timeout(6e3) });
        if (!i.ok) throw new Error(`HTTP ${i.status}`);
        f.value = await i.json(), c.value = "";
      } catch (i) {
        c.value = i?.message || "unreachable";
      }
    }
    async function I(i, e = {}) {
      m.value = !0;
      try {
        const N = await (await fetch(`${d.value.replace(/\/$/, "")}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: i, args: e }),
          signal: AbortSignal.timeout(4e4)
        })).json().catch(() => ({}));
        if (N.ok === !1) throw new Error(N.error || "action failed");
        await y();
      } catch (l) {
        c.value = l?.message || "action failed";
      } finally {
        m.value = !1;
      }
    }
    async function E() {
      await I("connect", {
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
      y();
    }
    return P(() => {
      y(), M = setInterval(y, 3e3);
    }), F(() => {
      M && clearInterval(M);
    }), (i, e) => (n(), a("div", H, [
      t("header", X, [
        t("div", Y, [
          t("span", {
            class: L(["dot", S.value ? "on" : c.value ? "err" : "off"])
          }, null, 2),
          e[8] || (e[8] = t("h1", null, "Minecraft", -1)),
          t("span", q, o(S.value ? "在线" : s.value?.state || "未连接"), 1),
          T.value.running ? (n(), a("span", G, "AI 自动游玩")) : r("", !0)
        ]),
        t("div", K, [
          h(t("input", {
            "onUpdate:modelValue": e[0] || (e[0] = (l) => d.value = l),
            class: "url",
            spellcheck: "false",
            onChange: J
          }, null, 544), [
            [b, d.value]
          ]),
          t("button", {
            disabled: m.value,
            onClick: y
          }, "刷新", 8, Q),
          t("button", {
            disabled: m.value,
            onClick: e[1] || (e[1] = (l) => k.value = !k.value)
          }, o(k.value ? "收起" : "连接"), 9, R),
          S.value ? (n(), a("button", {
            key: 0,
            class: "danger",
            disabled: m.value,
            onClick: e[2] || (e[2] = (l) => I("disconnect"))
          }, "断开", 8, W)) : r("", !0)
        ])
      ]),
      c.value ? (n(), a("p", Z, "服务不可达：" + o(c.value) + "（地址 " + o(d.value) + "）", 1)) : r("", !0),
      k.value ? (n(), a("section", ee, [
        h(t("select", {
          "onUpdate:modelValue": e[3] || (e[3] = (l) => u.value.edition = l)
        }, [...e[9] || (e[9] = [
          t("option", { value: "java" }, "Java", -1),
          t("option", { value: "bedrock" }, "Bedrock", -1)
        ])], 512), [
          [O, u.value.edition]
        ]),
        h(t("input", {
          "onUpdate:modelValue": e[4] || (e[4] = (l) => u.value.host = l),
          placeholder: "服务器地址，如 razure.ink",
          spellcheck: "false"
        }, null, 512), [
          [b, u.value.host]
        ]),
        h(t("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (l) => u.value.port = l),
          placeholder: "端口（Java 25565 / Bedrock 19132）",
          spellcheck: "false"
        }, null, 512), [
          [b, u.value.port]
        ]),
        h(t("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (l) => u.value.username = l),
          placeholder: "昵称",
          spellcheck: "false"
        }, null, 512), [
          [b, u.value.username]
        ]),
        h(t("input", {
          "onUpdate:modelValue": e[7] || (e[7] = (l) => u.value.password = l),
          placeholder: "服务器密码（可选，用于 /register /login）",
          spellcheck: "false"
        }, null, 512), [
          [b, u.value.password]
        ]),
        t("button", {
          class: "primary",
          disabled: m.value || !u.value.host.trim(),
          onClick: E
        }, "连接", 8, te)
      ])) : r("", !0),
      s.value ? (n(), a(g, { key: 2 }, [
        t("section", le, [
          t("div", se, [
            e[15] || (e[15] = t("h2", null, "服务器", -1)),
            t("dl", null, [
              e[10] || (e[10] = t("dt", null, "地址", -1)),
              t("dd", null, o(s.value.host || "-") + ":" + o(s.value.port || "-"), 1),
              e[11] || (e[11] = t("dt", null, "版本", -1)),
              t("dd", null, o(s.value.edition === "bedrock" ? "Bedrock" : "Java") + " " + o(s.value.version || ""), 1),
              e[12] || (e[12] = t("dt", null, "维度", -1)),
              t("dd", null, o(s.value.dimension || "-"), 1),
              e[13] || (e[13] = t("dt", null, "坐标", -1)),
              t("dd", null, o(s.value.position ? `${s.value.position.x}, ${s.value.position.y}, ${s.value.position.z}` : "-"), 1),
              e[14] || (e[14] = t("dt", null, "手持", -1)),
              t("dd", null, o(_(s.value.held) || "空"), 1)
            ])
          ]),
          t("div", oe, [
            e[18] || (e[18] = t("h2", null, "状态", -1)),
            t("div", ne, [
              e[16] || (e[16] = t("span", { class: "bar-label" }, "生命", -1)),
              t("div", ae, [
                t("i", {
                  class: "hp",
                  style: B({ width: C(s.value.health) + "%" })
                }, null, 4)
              ]),
              t("span", ie, o(s.value.health ?? "-") + "/20", 1)
            ]),
            t("div", ue, [
              e[17] || (e[17] = t("span", { class: "bar-label" }, "饥饿", -1)),
              t("div", re, [
                t("i", {
                  class: "food",
                  style: B({ width: C(s.value.food) + "%" })
                }, null, 4)
              ]),
              t("span", de, o(s.value.food ?? "-") + "/20", 1)
            ]),
            s.value.error ? (n(), a("p", ce, o(s.value.error), 1)) : r("", !0)
          ]),
          t("div", ve, [
            t("h2", null, [
              e[19] || (e[19] = w("玩家 ", -1)),
              t("span", me, o((s.value.players || []).length), 1)
            ]),
            t("ul", pe, [
              (n(!0), a(g, null, U(s.value.players || [], (l) => (n(), a("li", {
                key: l.name
              }, [
                t("b", null, o(l.name), 1),
                t("span", he, o(l.position ? `${Math.round(l.position.x)}, ${Math.round(l.position.y)}, ${Math.round(l.position.z)}` : ""), 1),
                l.ping != null ? (n(), a("span", fe, o(l.ping) + "ms", 1)) : r("", !0)
              ]))), 128)),
              (s.value.players || []).length ? r("", !0) : (n(), a("li", _e, "暂无其他玩家"))
            ])
          ])
        ]),
        t("section", ye, [
          e[20] || (e[20] = t("h2", null, [
            w("物品栏 "),
            t("span", { class: "muted" }, "快捷栏")
          ], -1)),
          t("div", be, [
            (n(!0), a(g, null, U(z.value, (l) => (n(), a("div", {
              key: l.slot,
              class: "cell",
              title: l.item ? `${_(l.item.name)} x${l.item.count}` : "空"
            }, [
              l.item ? (n(), a("span", ge, [
                w(o(_(l.item.name)), 1),
                l.item.count > 1 ? (n(), a("b", we, "×" + o(l.item.count), 1)) : r("", !0)
              ])) : r("", !0)
            ], 8, ke))), 128))
          ])
        ]),
        t("section", $e, [
          e[21] || (e[21] = t("h2", null, "背包", -1)),
          t("div", xe, [
            (n(!0), a(g, null, U(A.value, (l) => (n(), a("div", {
              key: l.slot,
              class: "cell",
              title: l.item ? `${_(l.item.name)} x${l.item.count}` : "空"
            }, [
              l.item ? (n(), a("span", Se, [
                w(o(_(l.item.name)), 1),
                l.item.count > 1 ? (n(), a("b", Ue, "×" + o(l.item.count), 1)) : r("", !0)
              ])) : r("", !0)
            ], 8, Me))), 128))
          ])
        ])
      ], 64)) : c.value ? r("", !0) : (n(), a("p", Ce, "未连接。点「连接」填写服务器，或让 L.I.F.E 说「连到 xxx 服务器」。"))
    ]));
  }
}, Ne = /* @__PURE__ */ D(Ve, [["__scopeId", "data-v-cdfdbf11"]]);
export {
  Ne as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('minecraft-plugin-style')){const s=document.createElement('style');s.id='minecraft-plugin-style';s.textContent=".mc[data-v-cdfdbf11]{padding:20px 24px;color:var(--md-on-surface, #e6e1e5);max-width:1100px}.mc-head[data-v-cdfdbf11]{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:16px}.mc-title[data-v-cdfdbf11]{display:flex;align-items:center;gap:10px}.mc-title h1[data-v-cdfdbf11]{font-size:20px;margin:0}.dot[data-v-cdfdbf11]{width:10px;height:10px;border-radius:50%;background:#888}.dot.on[data-v-cdfdbf11]{background:#37c871;box-shadow:0 0 8px #37c871}.dot.err[data-v-cdfdbf11]{background:#e35d5d}.state[data-v-cdfdbf11]{color:var(--md-on-surface-variant, #a8a2ab);font-size:13px}.tag[data-v-cdfdbf11]{font-size:12px;padding:2px 8px;border-radius:999px;background:#37c87126;color:#37c871;border:1px solid rgba(55,200,113,.4)}.mc-actions[data-v-cdfdbf11]{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.mc button[data-v-cdfdbf11]{background:var(--md-surface-container, #2b2930);color:inherit;border:1px solid var(--md-outline, #49454f);border-radius:8px;padding:6px 12px;cursor:pointer}.mc button[data-v-cdfdbf11]:disabled{opacity:.5;cursor:default}.mc button.primary[data-v-cdfdbf11]{background:#4a7dff;border-color:#4a7dff;color:#fff}.mc button.danger[data-v-cdfdbf11]{border-color:#e35d5d;color:#e35d5d}.url[data-v-cdfdbf11],.connect input[data-v-cdfdbf11],.connect select[data-v-cdfdbf11]{background:#ffffff0a;color:inherit;border:1px solid var(--md-outline, #49454f);border-radius:8px;padding:6px 10px;font:inherit}.url[data-v-cdfdbf11]{width:230px}.grid[data-v-cdfdbf11]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-bottom:14px}.card[data-v-cdfdbf11]{background:var(--md-surface-container, #2b2930);border:1px solid var(--md-outline, #49454f);border-radius:14px;padding:14px 16px;margin-bottom:14px}.card h2[data-v-cdfdbf11]{font-size:14px;margin:0 0 10px;font-weight:600}.card h2 .muted[data-v-cdfdbf11]{font-weight:400;font-size:12px}dl[data-v-cdfdbf11]{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;margin:0;font-size:13px}dt[data-v-cdfdbf11]{color:var(--md-on-surface-variant, #a8a2ab)}dd[data-v-cdfdbf11]{margin:0}.bar-row[data-v-cdfdbf11]{display:flex;align-items:center;gap:10px;margin:8px 0;font-size:13px}.bar-label[data-v-cdfdbf11]{width:34px;color:var(--md-on-surface-variant, #a8a2ab)}.bar[data-v-cdfdbf11]{flex:1;height:12px;border-radius:6px;background:#ffffff14;overflow:hidden}.bar i[data-v-cdfdbf11]{display:block;height:100%;border-radius:6px}.bar i.hp[data-v-cdfdbf11]{background:linear-gradient(90deg,#e35d5d,#ff8a8a)}.bar i.food[data-v-cdfdbf11]{background:linear-gradient(90deg,#d99a37,#f0c060)}.bar-num[data-v-cdfdbf11]{width:54px;text-align:right;color:var(--md-on-surface-variant, #a8a2ab)}.players[data-v-cdfdbf11]{list-style:none;margin:0;padding:0;font-size:13px}.players li[data-v-cdfdbf11]{display:flex;gap:10px;align-items:center;padding:3px 0}.players li span[data-v-cdfdbf11]:last-child{margin-left:auto}.inv[data-v-cdfdbf11]{display:grid;grid-template-columns:repeat(9,1fr);gap:6px}.inv.hotbar[data-v-cdfdbf11]{margin-bottom:4px}.cell[data-v-cdfdbf11]{aspect-ratio:1;border-radius:8px;background:#ffffff0d;border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;padding:2px;overflow:hidden}.cell .it[data-v-cdfdbf11]{font-size:10px;line-height:1.05;text-align:center;word-break:break-word}.cell .it b[data-v-cdfdbf11]{display:block;font-size:10px;color:#ffd76a}.muted[data-v-cdfdbf11]{color:var(--md-on-surface-variant, #a8a2ab)}.err[data-v-cdfdbf11]{color:#e35d5d}.err.small[data-v-cdfdbf11]{font-size:12px;margin:6px 0 0}.pad[data-v-cdfdbf11]{padding:8px 0}.connect[data-v-cdfdbf11]{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.connect input[data-v-cdfdbf11]{min-width:160px;flex:1}\n";document.head.appendChild(s)}})();
