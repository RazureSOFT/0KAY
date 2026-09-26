import { defineComponent as D, ref as d, computed as T, onMounted as F, openBlock as o, createElementBlock as r, createElementVNode as l, createTextVNode as h, toDisplayString as i, withDirectives as J, withKeys as X, vModelText as Q, createCommentVNode as v, Fragment as M, renderList as N } from "vue";
const W = { class: "mp" }, Z = { class: "mp-hero" }, ee = { class: "mp-actions" }, te = ["disabled"], ne = ["disabled"], ae = {
  key: 0,
  class: "mp-alert"
}, se = {
  key: 1,
  class: "mp-notice"
}, le = {
  key: 2,
  class: "mp-empty"
}, oe = {
  key: 3,
  class: "mp-empty"
}, re = {
  key: 4,
  class: "mp-grid"
}, ie = { class: "mp-head" }, ce = ["src", "alt"], ue = { class: "mp-title" }, de = ["href"], pe = { class: "mp-owner" }, fe = ["title"], ve = { class: "mp-desc" }, me = {
  key: 0,
  class: "mp-chips"
}, _e = {
  key: 0,
  class: "mp-chip muted"
}, he = {
  key: 1,
  class: "mp-err"
}, ye = { class: "mp-foot" }, ge = ["disabled", "onClick"], be = ["disabled", "onClick"], we = {
  key: 2,
  class: "mp-installed"
}, ke = ["onClick"], $e = ["href"], Ce = {
  key: 5,
  class: "mp-pager"
}, Te = ["disabled"], Me = { class: "mp-count" }, Pe = ["disabled"], S = "0kay-plugin", j = 12, Ae = 1e3, Ee = /* @__PURE__ */ D({
  __name: "MarketplacePage",
  setup(k) {
    const p = d([]), u = d(!1), m = d(""), y = d(""), b = d(""), _ = d(1), $ = d(0), g = d(""), f = d(""), x = d(/* @__PURE__ */ new Map()), O = d(/* @__PURE__ */ new Map());
    function P(n) {
      return String(n || "").replace(/^https?:\/\/github\.com\//i, "").replace(/\.git$/i, "").replace(/\/+$/, "").toLowerCase();
    }
    const C = T(() => Math.max(1, Math.ceil($.value / j))), R = T(() => _.value > 1), H = T(() => _.value < C.value);
    function K(n) {
      return n.manifest?.name || n.full_name;
    }
    function G(n) {
      return `0kay-pm install ${n.full_name}`;
    }
    async function I(n, t) {
      try {
        const e = await fetch(`https://raw.githubusercontent.com/${n}/${t}/manifest.json`);
        return e.ok ? await e.json() : null;
      } catch {
        return null;
      }
    }
    async function L() {
      const n = [...p.value], t = Array.from({ length: 6 }, async () => {
        for (; n.length; ) {
          const e = n.shift();
          if (!e) break;
          e.loadingManifest = !0;
          const s = await I(e.full_name, e.branch);
          s && (e.manifest = { name: s.name, version: s.version, description: s.description }), e.loadingManifest = !1;
        }
      });
      await Promise.all(t);
    }
    async function U() {
      try {
        const n = await fetch("/api/plugins/installed");
        if (!n.ok) return;
        const t = await n.json(), e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
        for (const a of Array.isArray(t?.installed) ? t.installed : [])
          a?.name && (e.set(a.name, a), a.repository && s.set(P(a.repository), a));
        for (const a of Array.isArray(t?.packages) ? t.packages : [])
          e.has(a) || e.set(a, { name: a });
        x.value = e, O.value = s;
        for (const a of p.value) {
          const c = e.get(K(a)) || s.get(P(a.url));
          c && (a.installed = !0, a.entryName = c.name, a.removable = c.source === "pm");
        }
      } catch {
      }
    }
    async function w(n = 1) {
      u.value = !0, m.value = "", b.value = "", f.value = "";
      const t = y.value.trim(), e = `topic:${S}` + (t ? ` ${t}` : "");
      try {
        const s = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(e)}&sort=stars&order=desc&per_page=${j}&page=${n}`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        if (!s.ok) throw new Error(`GitHub HTTP ${s.status}`);
        const a = await s.json();
        $.value = Math.min(a.total_count || 0, Ae), _.value = n, p.value = (a.items || []).map((c) => ({
          full_name: c.full_name,
          name: c.name,
          owner: c.owner?.login || "",
          avatar: c.owner?.avatar_url || "",
          description: c.description || "",
          stars: c.stargazers_count || 0,
          url: c.html_url,
          branch: c.default_branch || "main",
          topics: c.topics || []
        })), await L(), await U();
      } catch (s) {
        m.value = s?.message || String(s);
      } finally {
        u.value = !1;
      }
    }
    function A(n) {
      u.value || n < 1 || n > C.value || w(n);
    }
    async function q(n) {
      try {
        await navigator.clipboard.writeText(G(n)), b.value = n.full_name, setTimeout(() => {
          b.value === n.full_name && (b.value = "");
        }, 1500);
      } catch {
      }
    }
    async function B(n) {
      for (let t = 0; t < 400; t++) {
        await new Promise((a) => setTimeout(a, 1500));
        const e = await fetch("/api/plugins/install/status");
        if (!e.ok) continue;
        const s = await e.json();
        if (s.status === "done") {
          n(), await fetch("/api/ui/patches", { method: "POST" }), setTimeout(() => location.reload(), 1200);
          return;
        }
        if (s.status === "failed" || s.status === "error") throw new Error(s.error || "操作失败");
      }
      throw new Error("操作超时");
    }
    async function E(n, t, e, s) {
      t.error = "", t.installing = !0, g.value = t.full_name;
      try {
        const a = await fetch(n, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ package: e })
        });
        if (a.status === 404) {
          f.value = "当前 Core 不支持该操作";
          return;
        }
        const c = await a.json().catch(() => ({}));
        if (!a.ok) throw new Error(c.error || `HTTP ${a.status}`);
        await B(s);
      } catch (a) {
        t.error = a?.message || String(a);
      } finally {
        t.installing = !1, g.value = "";
      }
    }
    function V(n) {
      if (!(g.value || n.installed))
        return f.value = "", E("/api/plugins/install", n, n.full_name, () => {
          n.installed = !0, n.entryName = n.manifest?.name || n.full_name, f.value = `已安装 ${n.full_name}，正在刷新…`;
        });
    }
    async function z(n) {
      const t = window.__0KAY_UI__;
      return t && typeof t.confirm == "function" ? await t.confirm({ title: "卸载插件", message: `确定卸载 ${n}？`, confirmLabel: "卸载", danger: !0 }) : window.confirm(`确定卸载 ${n}？`);
    }
    async function Y(n) {
      if (g.value || !n.installed) return;
      const t = n.entryName || n.full_name;
      if (await z(t))
        return f.value = "", E("/api/plugins/uninstall", n, t, () => {
          n.installed = !1, n.removable = !1, n.entryName = void 0, f.value = `已卸载 ${t}，正在刷新…`;
        });
    }
    return F(() => w(1)), (n, t) => (o(), r("div", W, [
      l("header", Z, [
        l("div", null, [
          t[8] || (t[8] = l("p", { class: "mp-eyebrow" }, "0KAY MARKETPLACE", -1)),
          t[9] || (t[9] = l("h1", null, "插件市场", -1)),
          l("p", { class: "mp-sub" }, [
            t[6] || (t[6] = h("来自 GitHub topic ", -1)),
            l("code", null, i(S)),
            t[7] || (t[7] = h(" 的 0KAY 插件，可直接一键安装。", -1))
          ])
        ]),
        l("div", ee, [
          J(l("input", {
            "onUpdate:modelValue": t[0] || (t[0] = (e) => y.value = e),
            class: "mp-search",
            type: "search",
            placeholder: "搜索插件…",
            "aria-label": "搜索插件",
            onKeyup: t[1] || (t[1] = X((e) => w(1), ["enter"]))
          }, null, 544), [
            [Q, y.value]
          ]),
          l("button", {
            class: "mp-btn",
            disabled: u.value,
            onClick: t[2] || (t[2] = (e) => w(1))
          }, i(u.value ? "加载中…" : "搜索"), 9, te),
          l("button", {
            class: "mp-btn tonal",
            disabled: u.value,
            onClick: t[3] || (t[3] = (e) => w(_.value))
          }, "刷新", 8, ne)
        ])
      ]),
      m.value ? (o(), r("p", ae, i(m.value), 1)) : v("", !0),
      f.value ? (o(), r("p", se, i(f.value), 1)) : v("", !0),
      u.value && !p.value.length ? (o(), r("div", le, "正在从 GitHub 拉取插件…")) : p.value.length ? (o(), r("ul", re, [
        (o(!0), r(M, null, N(p.value, (e) => (o(), r("li", {
          key: e.full_name,
          class: "mp-card"
        }, [
          l("div", ie, [
            e.avatar ? (o(), r("img", {
              key: 0,
              class: "mp-avatar",
              src: e.avatar,
              alt: e.owner,
              loading: "lazy"
            }, null, 8, ce)) : v("", !0),
            l("div", ue, [
              l("a", {
                href: e.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }, i(e.full_name), 9, de),
              l("span", pe, [
                h(i(e.manifest?.name || e.name), 1),
                e.manifest?.version ? (o(), r(M, { key: 0 }, [
                  h(" · v" + i(e.manifest.version), 1)
                ], 64)) : v("", !0)
              ])
            ]),
            l("span", {
              class: "mp-stars",
              title: `${e.stars} stars`
            }, "★ " + i(e.stars), 9, fe)
          ]),
          l("p", ve, i(e.manifest?.description || e.description || "—"), 1),
          e.topics.length ? (o(), r("div", me, [
            (o(!0), r(M, null, N(e.topics.slice(0, 6), (s) => (o(), r("span", {
              key: s,
              class: "mp-chip"
            }, i(s), 1))), 128)),
            e.topics.length > 6 ? (o(), r("span", _e, "+" + i(e.topics.length - 6), 1)) : v("", !0)
          ])) : v("", !0),
          e.error ? (o(), r("p", he, i(e.error), 1)) : v("", !0),
          l("div", ye, [
            e.installed ? e.removable ? (o(), r("button", {
              key: 1,
              class: "mp-btn small danger",
              disabled: !!g.value,
              onClick: (s) => Y(e)
            }, i(e.installing ? "卸载中…" : "卸载"), 9, be)) : (o(), r("span", we, "已安装")) : (o(), r("button", {
              key: 0,
              class: "mp-btn small install",
              disabled: !!g.value,
              onClick: (s) => V(e)
            }, i(e.installing ? "安装中…" : "安装"), 9, ge)),
            l("button", {
              class: "mp-btn small tonal",
              onClick: (s) => q(e)
            }, i(b.value === e.full_name ? "已复制" : "复制命令"), 9, ke),
            l("a", {
              class: "mp-btn small tonal",
              href: e.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }, "打开", 8, $e)
          ])
        ]))), 128))
      ])) : (o(), r("div", oe, i(y.value ? "没有匹配的插件" : "暂无插件"), 1)),
      p.value.length && !m.value ? (o(), r("nav", Ce, [
        l("button", {
          class: "mp-btn small tonal",
          disabled: !R.value || u.value,
          onClick: t[4] || (t[4] = (e) => A(_.value - 1))
        }, "上一页", 8, Te),
        l("span", Me, "第 " + i(_.value) + " / " + i(C.value) + " 页 · 共 " + i($.value) + " 个插件", 1),
        l("button", {
          class: "mp-btn small tonal",
          disabled: !H.value || u.value,
          onClick: t[5] || (t[5] = (e) => A(_.value + 1))
        }, "下一页", 8, Pe)
      ])) : v("", !0),
      t[10] || (t[10] = l("p", { class: "mp-note" }, [
        h("一键安装会调用本机 Core 的 "),
        l("code", null, "/api/plugins/install"),
        h("，由 "),
        l("code", null, "0kay-pm"),
        h(" 完成下载与构建；未登录的 GitHub 搜索接口每小时约 60 次。")
      ], -1))
    ]));
  }
}), Ne = (k, p) => {
  const u = k.__vccOpts || k;
  for (const [m, y] of p)
    u[m] = y;
  return u;
}, je = /* @__PURE__ */ Ne(Ee, [["__scopeId", "data-v-a82e8925"]]);
export {
  je as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('marketplace-plugin-style')){const s=document.createElement('style');s.id='marketplace-plugin-style';s.textContent=".mp[data-v-a82e8925]{--code-font: ui-monospace, \"Cascadia Code\", \"JetBrains Mono\", Consolas, \"SFMono-Regular\", Menlo, monospace;box-sizing:border-box;flex:1;min-height:0;width:100%;overflow-y:auto;overscroll-behavior:contain;padding:clamp(20px,2.6vw,36px) max(clamp(20px,2.6vw,36px),calc((100% - 1100px)/2))}.mp-hero[data-v-a82e8925]{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:24px}.mp-eyebrow[data-v-a82e8925]{margin:0 0 6px;font-size:12px;font-weight:800;letter-spacing:.18em;color:var(--md-primary)}.mp-hero h1[data-v-a82e8925]{margin:0;font-size:clamp(26px,3vw,38px);font-weight:850;letter-spacing:-.02em}.mp-sub[data-v-a82e8925]{margin:8px 0 0;color:var(--md-on-surface-variant);font-size:15px}.mp-sub code[data-v-a82e8925],.mp-note code[data-v-a82e8925]{font-family:var(--code-font);font-size:.9em;background:var(--md-surface-container-high);padding:2px 6px;border-radius:8px}.mp-actions[data-v-a82e8925]{display:flex;gap:10px;flex-wrap:wrap}.mp-search[data-v-a82e8925]{min-height:44px;padding:0 16px;min-width:220px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;outline:none}.mp-search[data-v-a82e8925]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.mp-btn[data-v-a82e8925]{min-height:44px;padding:0 20px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary);font:700 14px/1 inherit;cursor:pointer;transition:transform .2s var(--ease-spring, ease),filter .15s}.mp-btn[data-v-a82e8925]:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.05)}.mp-btn[data-v-a82e8925]:disabled{opacity:.55;cursor:default}.mp-btn.tonal[data-v-a82e8925]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mp-btn.small[data-v-a82e8925]{min-height:34px;padding:0 14px;font-size:13px}.mp-btn.small.tonal[data-v-a82e8925]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);display:inline-flex;align-items:center;text-decoration:none}.mp-btn.small.install[data-v-a82e8925]{background:var(--md-primary);color:var(--md-on-primary)}.mp-btn.small.danger[data-v-a82e8925]{background:var(--md-error-container);color:#410e0b}.mp-installed[data-v-a82e8925]{font-size:13px;font-weight:750;color:var(--md-primary)}.mp-alert[data-v-a82e8925]{padding:12px 16px;border-radius:16px;background:var(--md-error-container);color:#410e0b;font-size:13px}.mp-notice[data-v-a82e8925]{padding:12px 16px;border-radius:16px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13px}.mp-err[data-v-a82e8925]{margin:0;font-size:12px;color:#b3261e}.mp-empty[data-v-a82e8925]{padding:40px;text-align:center;color:var(--md-on-surface-variant);background:var(--md-surface-container-low);border-radius:20px}.mp-grid[data-v-a82e8925]{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}.mp-card[data-v-a82e8925]{display:flex;flex-direction:column;gap:12px;padding:18px;border:1px solid var(--md-outline-variant);border-radius:24px 24px 24px 8px;background:var(--md-surface-container-low);transition:transform .24s var(--ease-spring, ease),box-shadow .24s,border-color .24s}.mp-card[data-v-a82e8925]:hover{transform:translateY(-3px);box-shadow:var(--shadow-2, 0 8px 24px rgba(20,18,36,.14));border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant))}.mp-head[data-v-a82e8925]{display:flex;align-items:center;gap:12px}.mp-avatar[data-v-a82e8925]{width:40px;height:40px;border-radius:14px;flex:none}.mp-title[data-v-a82e8925]{display:flex;flex-direction:column;min-width:0;flex:1}.mp-title a[data-v-a82e8925]{color:var(--md-on-surface);font-weight:750;font-size:15px;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mp-title a[data-v-a82e8925]:hover{color:var(--md-primary);text-decoration:underline}.mp-owner[data-v-a82e8925]{color:var(--md-on-surface-variant);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mp-stars[data-v-a82e8925]{flex:none;font-weight:700;font-size:12.5px;color:var(--md-primary);background:color-mix(in srgb,var(--md-primary) 12%,transparent);border-radius:999px;padding:4px 10px}.mp-desc[data-v-a82e8925]{margin:0;color:var(--md-on-surface-variant);font-size:13.5px;line-height:1.6;flex:1}.mp-chips[data-v-a82e8925]{display:flex;flex-wrap:wrap;gap:6px}.mp-chip[data-v-a82e8925]{font-size:11.5px;font-weight:700;padding:3px 10px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.mp-chip.muted[data-v-a82e8925]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}.mp-foot[data-v-a82e8925]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.mp-pager[data-v-a82e8925]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:26px;flex-wrap:wrap}.mp-count[data-v-a82e8925]{color:var(--md-on-surface-variant);font-size:13px}.mp-note[data-v-a82e8925]{margin:26px 0 0;color:var(--md-on-surface-variant);font-size:12.5px}\n";document.head.appendChild(s)}})();
