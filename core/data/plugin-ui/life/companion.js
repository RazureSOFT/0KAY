import { defineComponent as ll, ref as r, computed as k, watch as Zt, nextTick as Xe, onMounted as sl, onUnmounted as os, openBlock as a, createElementBlock as o, mergeProps as is, createElementVNode as e, unref as Ee, toDisplayString as n, normalizeClass as C, createBlock as us, Teleport as ds, createVNode as I, Transition as rs, withCtx as cs, withModifiers as el, normalizeStyle as _e, Fragment as m, renderList as y, createCommentVNode as d, createTextVNode as f, withDirectives as u, withKeys as tl, vModelText as p, vShow as P, vModelCheckbox as pe } from "vue";
import { _ as vs } from "./assets/_plugin-vue_export-helper-O99hOdpN.js";
const ps = ["aria-expanded", "aria-controls", "aria-activedescendant", "aria-label", "disabled"], _s = { class: "app-select-value" }, ms = {
  class: "app-select-chevron",
  "aria-hidden": "true"
}, bs = ["id", "aria-label"], ys = ["id", "aria-selected", "aria-disabled", "data-index", "onPointermove", "onClick"], fs = {
  key: 0,
  class: "app-select-check",
  "aria-hidden": "true"
}, gs = {
  key: 0,
  class: "app-select-empty"
}, R = /* @__PURE__ */ ll({
  inheritAttrs: !1,
  __name: "AppSelect",
  props: {
    modelValue: { default: "" },
    options: {},
    disabled: { type: Boolean, default: !1 },
    placeholder: { default: "请选择" },
    ariaLabel: {}
  },
  emits: ["update:modelValue", "change"],
  setup(Q, { emit: v }) {
    const O = Q, j = v;
    let me = 0;
    const ae = (c) => `${c}-${++me}`, he = r("zh-CN"), X = r(null), Z = r(null), U = r(!1), V = r(-1), Ve = r({}), oe = r(!1), be = ae("select"), L = k(() => O.options.map((c) => typeof c == "string" ? { value: c, label: c } : c)), ee = k(() => L.value.find((c) => c.value === O.modelValue)?.label || O.modelValue || O.placeholder);
    let N = "", K = 0;
    function J() {
      const c = X.value?.getBoundingClientRect();
      if (!c) return;
      const h = window.visualViewport?.height || innerHeight, x = window.visualViewport?.width || innerWidth, S = h - c.bottom - 10, g = c.top - 10;
      oe.value = c.top >= Math.min(320, L.value.length * 46 + 12) + 8 || S < Math.min(320, L.value.length * 46 + 12) && g > S;
      const se = Math.max(48, Math.min(340, oe.value ? g : S)), Ne = Math.min(Math.max(c.width, 220), x - 16);
      Ve.value = { position: "fixed", left: `${Math.max(8, Math.min(c.left, x - Ne - 8))}px`, width: `${Ne}px`, maxHeight: `${se}px`, ...oe.value ? { bottom: `${h - c.top + 8}px` } : { top: `${c.bottom + 8}px` } };
    }
    function te(c = !1) {
      U.value = !1, N = "", c && X.value?.focus();
    }
    async function T() {
      O.disabled || U.value || (U.value = !0, V.value = L.value.findIndex((c) => c.value === O.modelValue && !c.disabled), V.value < 0 && (V.value = L.value.findIndex((c) => !c.disabled)), J(), await Xe(), Ue());
    }
    function Ue() {
      Z.value?.querySelector(`[data-index="${V.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function ie(c) {
      const h = L.value[c];
      !h || h.disabled || (j("update:modelValue", h.value), j("change", h.value), te(!0));
    }
    async function Fe(c) {
      if (!(O.disabled || c.isComposing)) {
        if (c.key === "Tab") {
          te();
          return;
        }
        if (c.key === "Escape") {
          U.value && (c.preventDefault(), te(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(c.key)) {
          if (c.preventDefault(), !U.value) {
            await T();
            return;
          }
          if (c.key === "Enter" || c.key === " ") {
            ie(V.value);
            return;
          }
          const h = L.value.map((S, g) => S.disabled ? -1 : g).filter((S) => S >= 0);
          if (!h.length) return;
          const x = h.indexOf(V.value);
          V.value = c.key === "Home" ? h[0] : c.key === "End" ? h[h.length - 1] : h[(x + (c.key === "ArrowDown" ? 1 : -1) + h.length) % h.length], await Xe(), Ue();
          return;
        }
        if (c.key.length === 1 && !c.ctrlKey && !c.metaKey && !c.altKey) {
          await T();
          const h = Date.now();
          N = h - K > 700 ? c.key : N + c.key, K = h;
          const x = L.value.findIndex((S) => !S.disabled && S.label.toLocaleLowerCase().startsWith(N.toLocaleLowerCase()));
          x >= 0 && (V.value = x, await Xe(), Ue());
        }
      }
    }
    function Se(c) {
      const h = c.target;
      !X.value?.contains(h) && !Z.value?.contains(h) && te();
    }
    function le(c) {
      U.value && (!(c.target instanceof Node) || !Z.value?.contains(c.target)) && J();
    }
    return Zt(() => O.disabled, (c) => {
      c && te();
    }), Zt(L, () => {
      U.value && (V.value >= L.value.length && (V.value = L.value.findIndex((c) => !c.disabled)), Xe(J));
    }), sl(() => {
      document.addEventListener("pointerdown", Se, !0), window.addEventListener("resize", J), window.addEventListener("scroll", le, !0);
    }), os(() => {
      document.removeEventListener("pointerdown", Se, !0), window.removeEventListener("resize", J), window.removeEventListener("scroll", le, !0);
    }), (c, h) => (a(), o("div", is(c.$attrs, {
      class: ["app-select", { "is-disabled": Q.disabled, "is-open": U.value }]
    }), [
      e("button", {
        ref_key: "trigger",
        ref: X,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": U.value,
        "aria-controls": U.value ? Ee(be) : void 0,
        "aria-activedescendant": U.value && V.value >= 0 ? `${Ee(be)}-${V.value}` : void 0,
        "aria-label": Q.ariaLabel,
        disabled: Q.disabled,
        onClick: h[0] || (h[0] = (x) => U.value ? te() : T()),
        onKeydown: Fe
      }, [
        e("span", _s, n(ee.value), 1),
        e("span", ms, [
          (a(), o("svg", {
            class: C({ "is-open": U.value }),
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none"
          }, [...h[2] || (h[2] = [
            e("path", {
              d: "m6 9 6 6 6-6",
              stroke: "currentColor",
              "stroke-width": "1.9",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, null, -1)
          ])], 2))
        ])
      ], 40, ps),
      (a(), us(ds, { to: "body" }, [
        I(rs, { name: "select-menu" }, {
          default: cs(() => [
            U.value ? (a(), o("div", {
              key: 0,
              id: Ee(be),
              ref_key: "menu",
              ref: Z,
              class: C(["app-select-menu", { "opens-up": oe.value }]),
              style: _e(Ve.value),
              role: "listbox",
              "aria-label": Q.ariaLabel || "选项",
              onPointerdown: h[1] || (h[1] = el(() => {
              }, ["prevent"]))
            }, [
              (a(!0), o(m, null, y(L.value, (x, S) => (a(), o("div", {
                id: `${Ee(be)}-${S}`,
                key: `${x.value}:${S}`,
                role: "option",
                "aria-selected": x.value === Q.modelValue,
                "aria-disabled": !!x.disabled,
                "data-index": S,
                class: C(["app-select-option", { highlighted: V.value === S, selected: x.value === Q.modelValue, disabled: x.disabled }]),
                onPointermove: (g) => !x.disabled && (V.value = S),
                onClick: el((g) => ie(S), ["stop"])
              }, [
                e("span", null, n(x.label), 1),
                x.value === Q.modelValue ? (a(), o("span", fs, [...h[3] || (h[3] = [
                  e("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none"
                  }, [
                    e("path", {
                      d: "m5 12 4 4L19 6",
                      stroke: "currentColor",
                      "stroke-width": "2.4",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ], -1)
                ])])) : d("", !0)
              ], 42, ys))), 128)),
              L.value.length ? d("", !0) : (a(), o("div", gs, n(he.value === "en" ? "No options available" : "暂无可选项"), 1))
            ], 46, bs)) : d("", !0)
          ]),
          _: 1
        })
      ]))
    ], 16));
  }
}), ks = { class: "hero" }, hs = { class: "hero-main" }, ws = { class: "hero-actions" }, Cs = ["disabled"], xs = ["disabled"], $s = { class: "hero-stats" }, Vs = { class: "stat-num" }, Us = { class: "stat-num" }, Ss = { class: "stat-num" }, Ns = { class: "stat-num" }, Ts = { class: "stat-num" }, js = { class: "stat-num" }, Ms = { class: "state-row" }, Ls = { class: "pill" }, Os = {
  key: 0,
  class: "pill"
}, Ds = {
  key: 1,
  class: "pill soft"
}, Es = {
  key: 2,
  class: "pill soft"
}, Fs = {
  key: 0,
  class: "banner err"
}, qs = {
  key: 1,
  class: "banner ok"
}, Ps = {
  class: "tabs",
  "aria-label": "视图"
}, Is = ["onClick"], Js = { class: "tab-ic" }, As = { class: "panel" }, Bs = { class: "section-head" }, zs = { class: "head-actions" }, Rs = { class: "desk" }, Ks = { class: "desk-col" }, Ys = { class: "dcard" }, Gs = { class: "fact-grid" }, Hs = { class: "fact" }, Ws = { class: "fact" }, Qs = { class: "fact" }, Xs = { class: "fact" }, Zs = {
  key: 0,
  class: "mini-list"
}, en = { class: "dcard" }, tn = {
  key: 0,
  class: "cur"
}, ln = {
  key: 1,
  class: "empty"
}, sn = {
  key: 2,
  class: "meta"
}, nn = {
  key: 0,
  class: "dcard"
}, an = { class: "mini-list" }, on = { class: "meta" }, un = { class: "mini-actions" }, dn = ["onClick"], rn = ["onClick"], cn = { class: "dcard" }, vn = { class: "form-row" }, pn = { class: "form-row" }, _n = ["disabled"], mn = { class: "desk-col" }, bn = { class: "dcard" }, yn = { class: "tl" }, fn = {
  key: 0,
  class: "meta"
}, gn = {
  key: 0,
  class: "empty"
}, kn = { class: "dcard" }, hn = {
  key: 0,
  class: "prose"
}, wn = {
  key: 1,
  class: "empty"
}, Cn = { class: "actions-row" }, xn = { class: "actions-row" }, $n = { class: "desk-col" }, Vn = { class: "dcard" }, Un = { class: "mini-tl" }, Sn = { class: "meta" }, Nn = {
  key: 0,
  class: "empty"
}, Tn = { class: "dcard" }, jn = { class: "caps" }, Mn = {
  key: 0,
  class: "empty"
}, Ln = {
  class: "fold",
  open: ""
}, On = { class: "grid3" }, Dn = { class: "card" }, En = { class: "mini-list" }, Fn = {
  key: 0,
  class: "owner"
}, qn = {
  key: 0,
  class: "empty"
}, Pn = { class: "card" }, In = { class: "mini-list" }, Jn = {
  key: 0,
  class: "empty"
}, An = { class: "card" }, Bn = { class: "policy" }, zn = { class: "fold" }, Rn = { class: "grid2" }, Kn = { class: "card" }, Yn = { class: "bars" }, Gn = { class: "bar-label" }, Hn = { class: "bar" }, Wn = {
  key: 0,
  class: "empty"
}, Qn = { class: "card" }, Xn = { class: "bars" }, Zn = { class: "bar-label" }, ea = { class: "bar" }, ta = {
  key: 0,
  class: "empty"
}, la = { class: "card" }, sa = { class: "feed" }, na = { class: "meta" }, aa = {
  key: 0,
  class: "empty"
}, oa = { class: "card" }, ia = { class: "feed" }, ua = { class: "meta" }, da = {
  key: 0,
  class: "empty"
}, ra = { class: "panel" }, ca = { class: "section-head" }, va = { class: "head-actions" }, pa = ["disabled"], _a = { class: "world-layout" }, ma = { class: "world-nav" }, ba = ["onClick"], ya = { class: "world-body" }, fa = { class: "card" }, ga = { class: "form-row" }, ka = { class: "actions-row" }, ha = ["disabled"], wa = { class: "cards" }, Ca = { class: "row" }, xa = { class: "chip muted" }, $a = { class: "prose" }, Va = {
  key: 0,
  class: "meta"
}, Ua = { class: "actions-row" }, Sa = ["onClick"], Na = ["onClick"], Ta = {
  key: 0,
  class: "empty"
}, ja = { class: "panel" }, Ma = { class: "section-head" }, La = { class: "head-actions" }, Oa = { class: "user-layout" }, Da = { class: "roster" }, Ea = { class: "roster-head" }, Fa = { class: "count-pill" }, qa = ["onClick"], Pa = { class: "avatar" }, Ia = { class: "rmain" }, Ja = { class: "rtop" }, Aa = {
  key: 0,
  class: "owner"
}, Ba = { class: "bar" }, za = { class: "meta" }, Ra = {
  key: 0,
  class: "empty"
}, Ka = { class: "user-detail" }, Ya = {
  key: 1,
  class: "empty"
}, Ga = { class: "detail-head" }, Ha = { class: "avatar lg" }, Wa = { class: "meta" }, Qa = { class: "subtabs" }, Xa = ["onClick"], Za = { key: 0 }, eo = { class: "kv-grid" }, to = { class: "kv" }, lo = { class: "kv" }, so = { class: "kv" }, no = { class: "kv" }, ao = { class: "kv" }, oo = {
  key: 0,
  class: "note"
}, io = {
  key: 1,
  class: "note"
}, uo = { class: "chips" }, ro = ["onClick"], co = {
  key: 0,
  class: "meta"
}, vo = { class: "form-row" }, po = ["disabled"], _o = { key: 1 }, mo = { class: "bar big" }, bo = { class: "meta" }, yo = { class: "actions-row" }, fo = { class: "feed" }, go = {
  key: 0,
  class: "empty"
}, ko = { key: 2 }, ho = { class: "feed" }, wo = { class: "meta" }, Co = ["onClick"], xo = {
  key: 0,
  class: "empty"
}, $o = { key: 3 }, Vo = { class: "feed" }, Uo = { class: "meta" }, So = ["onClick"], No = {
  key: 0,
  class: "empty"
}, To = { key: 4 }, jo = { class: "feed" }, Mo = { class: "meta" }, Lo = {
  key: 0,
  class: "empty"
}, Oo = {
  key: 3,
  class: "empty"
}, Do = { class: "panel" }, Eo = { class: "section-head" }, Fo = { class: "head-actions" }, qo = { class: "card" }, Po = { class: "group-form" }, Io = ["disabled"], Jo = { class: "cards" }, Ao = { class: "row" }, Bo = {
  key: 0,
  class: "chip muted"
}, zo = { class: "meta" }, Ro = {
  key: 0,
  class: "group-detail"
}, Ko = { class: "chips" }, Yo = {
  key: 0,
  class: "meta"
}, Go = { class: "chips" }, Ho = ["onClick"], Wo = { class: "form-row" }, Qo = ["onUpdate:modelValue"], Xo = ["onClick"], Zo = { class: "members" }, ei = { class: "meta" }, ti = { class: "actions-row" }, li = ["onClick"], si = ["onClick"], ni = {
  key: 0,
  class: "empty"
}, ai = { class: "panel" }, oi = { class: "grid3" }, ii = { class: "card" }, ui = { class: "count-pill" }, di = { class: "form-row" }, ri = ["disabled"], ci = { class: "feed" }, vi = { class: "chip muted" }, pi = { class: "actions-row" }, _i = ["onClick"], mi = ["onClick"], bi = {
  key: 0,
  class: "empty"
}, yi = { class: "card" }, fi = { class: "subtabs" }, gi = { class: "form-row" }, ki = ["disabled"], hi = { class: "feed" }, wi = { class: "meta" }, Ci = { class: "actions-row" }, xi = ["onClick"], $i = ["onClick"], Vi = ["onClick"], Ui = {
  key: 0,
  class: "empty"
}, Si = { class: "card" }, Ni = { class: "count-pill" }, Ti = { class: "form-row" }, ji = ["disabled"], Mi = { class: "feed" }, Li = { class: "meta" }, Oi = {
  key: 0,
  class: "empty"
}, Di = { class: "form-row" }, Ei = { class: "feed" }, Fi = ["onClick"], qi = {
  key: 0,
  class: "empty"
}, Pi = { class: "panel" }, Ii = { class: "section-head" }, Ji = { class: "head-actions" }, Ai = { class: "grid2" }, Bi = { class: "card cal-card" }, zi = { class: "cal-week" }, Ri = { class: "cal-grid" }, Ki = {
  key: 0,
  class: "cal-day"
}, Yi = {
  key: 1,
  class: "cal-more"
}, Gi = {
  key: 0,
  class: "warnline"
}, Hi = { class: "sub-label" }, Wi = { class: "feed" }, Qi = { class: "actions-row" }, Xi = ["onClick"], Zi = ["onClick"], eu = {
  key: 0,
  class: "empty"
}, tu = { class: "card" }, lu = { class: "spark" }, su = ["title"], nu = { class: "card" }, au = { class: "count-pill" }, ou = { class: "form-row" }, iu = ["disabled"], uu = { class: "feed" }, du = { class: "bar" }, ru = { class: "form-row" }, cu = ["onUpdate:modelValue"], vu = ["onClick"], pu = ["onClick"], _u = {
  key: 0,
  class: "feed"
}, mu = {
  key: 0,
  class: "empty"
}, bu = { class: "card" }, yu = { class: "feed" }, fu = { class: "chip" }, gu = { class: "meta" }, ku = {
  key: 0,
  class: "empty"
}, hu = { class: "card" }, wu = { class: "count-pill" }, Cu = { class: "feed" }, xu = { class: "meta" }, $u = ["onClick"], Vu = {
  key: 0,
  class: "empty"
}, Uu = { class: "card" }, Su = { class: "count-pill" }, Nu = { class: "feed" }, Tu = { class: "meta" }, ju = {
  key: 0,
  class: "empty"
}, Mu = { class: "card cal-card" }, Lu = { class: "count-pill" }, Ou = { class: "tl" }, Du = { class: "meta" }, Eu = {
  key: 0,
  class: "empty"
}, Fu = { class: "card" }, qu = { class: "radar-wrap" }, Pu = {
  viewBox: "0 0 120 120",
  class: "radar",
  "aria-label": "情绪雷达"
}, Iu = ["points"], Ju = { class: "hint" }, Au = { class: "card cal-card" }, Bu = { class: "count-pill" }, zu = { class: "feed" }, Ru = { class: "meta" }, Ku = {
  key: 0,
  class: "findings"
}, Yu = { class: "meta" }, Gu = {
  key: 0,
  class: "empty"
}, Hu = { class: "panel" }, Wu = { class: "section-head" }, Qu = { class: "head-actions" }, Xu = ["disabled"], Zu = { class: "grid2" }, ed = { class: "card" }, td = { class: "count-pill" }, ld = { class: "form-row" }, sd = { class: "form-row" }, nd = ["disabled"], ad = { class: "feed" }, od = { class: "meta" }, id = { class: "meta" }, ud = ["onClick"], dd = {
  key: 0,
  class: "empty"
}, rd = { class: "card" }, cd = { class: "feed" }, vd = { class: "meta" }, pd = {
  key: 0,
  class: "empty"
}, _d = { class: "panel" }, md = { class: "stat-cards" }, bd = { class: "stat-card" }, yd = { class: "stat-card" }, fd = { class: "stat-card" }, gd = { class: "stat-card" }, kd = { class: "card" }, hd = { class: "feed" }, wd = { class: "meta" }, Cd = {
  key: 0,
  class: "empty"
}, xd = { class: "panel" }, $d = { class: "section-head" }, Vd = { class: "head-actions" }, Ud = { class: "grid2" }, Sd = { class: "card" }, Nd = { class: "feed" }, Td = { class: "meta" }, jd = {
  key: 0,
  class: "empty"
}, Md = {
  key: 0,
  class: "kv-grid"
}, Ld = { class: "card" }, Od = { class: "count-pill" }, Dd = { class: "form-row" }, Ed = { class: "tl" }, Fd = { class: "meta" }, qd = {
  key: 0,
  class: "tl-detail"
}, Pd = {
  key: 0,
  class: "empty"
}, Id = { class: "panel" }, Jd = { class: "grid2" }, Ad = { class: "card" }, Bd = { class: "settings-grid" }, zd = { class: "switches" }, Rd = { class: "sw" }, Kd = { class: "sw" }, Yd = { class: "sw" }, Gd = { class: "sw" }, Hd = { class: "settings-grid" }, Wd = { class: "wide" }, Qd = { class: "wide" }, Xd = { class: "sw" }, Zd = { class: "card" }, er = { class: "settings-grid" }, tr = { class: "switches" }, lr = { class: "sw" }, sr = { class: "sw" }, nr = { class: "actions-row" }, ar = ["disabled"], or = ["disabled"], ir = { class: "panel" }, ur = { class: "grid2" }, dr = { class: "card" }, rr = { class: "card" }, cr = { class: "feed" }, vr = { class: "meta" }, pr = {
  key: 0,
  class: "empty"
}, _r = { class: "panel" }, mr = { class: "grid3" }, br = { class: "card" }, yr = { class: "actions-row" }, fr = { class: "card" }, gr = { class: "form-row" }, kr = ["disabled"], hr = { class: "card" }, wr = { class: "form-row" }, Cr = ["disabled"], xr = { class: "feed" }, $r = { class: "meta" }, Vr = ["onClick"], Ur = {
  key: 0,
  class: "empty"
}, Sr = { class: "card" }, Nr = { class: "form-row" }, Tr = ["disabled"], jr = { class: "sw" }, Mr = { class: "feed" }, Lr = ["onClick"], Or = {
  key: 0,
  class: "empty"
}, Dr = { class: "card" }, Er = { class: "cloud" }, Fr = {
  key: 0,
  class: "empty"
}, qr = /* @__PURE__ */ ll({
  __name: "CompanionPage",
  setup(Q) {
    const v = r({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [], open_topics: [], portraits: [], timeline: [] }), O = r(!1), j = r(""), me = r(""), ae = r(""), he = r(""), X = r(""), Z = r(""), U = r(""), V = () => {
      const s = /* @__PURE__ */ new Date(), t = (l) => String(l).padStart(2, "0");
      return `${s.getFullYear()}-${t(s.getMonth() + 1)}-${t(s.getDate())}`;
    }, Ve = r(V()), oe = r({ date: "", content: "", previous: null, next: null }), be = r(!1);
    k(() => (oe.value.content || "").split(/\n{2,}/).map((s) => s.trim()).filter(Boolean));
    async function L(s = Ve.value) {
      be.value = !0;
      try {
        const t = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "journal_page", payload: { date: s } }) });
        if (!t.ok) throw Error(await t.text());
        const l = await t.json();
        oe.value = { date: l?.date || s, content: l?.content || "", previous: l?.previous || null, next: l?.next || null }, Ve.value = oe.value.date;
      } catch (t) {
        j.value = se(t);
      } finally {
        be.value = !1;
      }
    }
    const ee = r(""), N = r({ target: "", motive: "", content: "", preferred_at: "" }), K = r(""), J = r("");
    function te() {
      return K.value === "__manual__" ? J.value.trim() : K.value;
    }
    const T = r({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 }), Ue = k(() => Object.entries(v.value.groups || {})), ie = k(() => (v.value.proactive?.candidates || []).filter((s) => !["delivered", "cancelled"].includes(s.status))), Fe = k(() => v.value.proactive?.receipts || []), Se = V(), le = k(() => (v.value.agenda || []).filter((s) => {
      const t = String(s.start_at || "").replace("T", " ");
      return !t || t.slice(0, 10) >= Se;
    })), c = r("overview"), h = r(null), x = r(""), S = [
      { key: "overview", i: "01", label: "总览", icon: "◉" },
      { key: "world", i: "02", label: "世界知识", icon: "✎" },
      { key: "users", i: "03", label: "用户", icon: "☺" },
      { key: "groups", i: "04", label: "群聊", icon: "☷" },
      { key: "learning", i: "05", label: "学习", icon: "✚" },
      { key: "observe", i: "06", label: "观察", icon: "◎" },
      { key: "proactive", i: "07", label: "主动", icon: "✦" },
      { key: "tokens", i: "08", label: "Token", icon: "∑" },
      { key: "troubleshooting", i: "09", label: "排障", icon: "⚠" },
      { key: "config", i: "10", label: "配置", icon: "⚙" },
      { key: "models", i: "11", label: "模型", icon: "⌁" },
      { key: "experimental", i: "12", label: "实验", icon: "⚗" }
    ];
    function g(s) {
      me.value = s, setTimeout(() => {
        me.value === s && (me.value = "");
      }, 2500);
    }
    function se(s) {
      const t = String(s?.message || s || "");
      return /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(t) ? "LIFE 服务暂时未就绪（可能正在启动或重启），已自动重试。稍候刷新即可。" : t || "操作失败";
    }
    const Ne = (s) => new Promise((t) => setTimeout(t, s)), ue = r(null);
    async function mt() {
      try {
        const s = await fetch("/api/usage");
        s.ok && (ue.value = await s.json());
      } catch {
      }
    }
    async function ye(s = 0) {
      O.value = !0, j.value = "";
      try {
        const t = await fetch("/api/life/companion");
        if (!t.ok) throw Error(await t.text() || String(t.status));
        v.value = await t.json(), v.value?.policy && (T.value = { ...T.value, ...v.value.policy }), Yl(), O.value = !1, mt(), L(), Ke(), jl(), Ut(), It(), Bt();
      } catch (t) {
        if (s < 4)
          return await Ne(1500), ye(s + 1);
        j.value = se(t), O.value = !1;
      }
    }
    async function b(s, t) {
      for (let l = 0; l < 3; l++)
        try {
          const i = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: s, payload: t }) });
          if (!i.ok) throw Error(await i.text());
          const M = await i.json().catch(() => ({}));
          return await ye(), M;
        } catch (i) {
          if (l < 2 && /connection refused|Unavailable|actively refused|dial tcp|502|503|life unavailable/i.test(String(i?.message || i))) {
            await Ne(1200);
            continue;
          }
          return j.value = se(i), null;
        }
      return null;
    }
    async function ne(s, t) {
      const l = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: s, payload: t }) });
      if (!l.ok) throw Error(await l.text());
      return await l.json().catch(() => ({}));
    }
    async function bt() {
      ae.value.trim() && (await b("add_agenda", { title: ae.value, when: he.value, detail: X.value }), ae.value = "", he.value = "", X.value = "", g("已加入日程"));
    }
    async function yt(s, t) {
      t.trim() && (await b(s, { content: t }), s === "journal" ? Z.value = "" : U.value = "");
    }
    function qe(s) {
      return `${Math.round(Math.max(0, Math.min(1, s || 0)) * 100)}%`;
    }
    function Ze(s) {
      if (s.status === "completed") return { label: "已完成", cls: "ok" };
      const t = new Date(String(s.start_at || "").replace(" ", "T"));
      return !Number.isNaN(t.getTime()) && t.getTime() <= Date.now() ? { label: "进行中", cls: "warn" } : { label: "待开始", cls: "muted" };
    }
    async function ft(s, t) {
      await b("relationship_adjust", { user_id: s, event_key: `manual:${Date.now()}`, reason: "dashboard_adjust", channel: "webui", delta: t }) && g(`已调整 ${s}`);
    }
    async function gt() {
      const s = await b("relationship_decay", {});
      g(s?.decayed != null ? `已自然回落 ${s.decayed} 个关系` : "已处理");
    }
    async function nl() {
      const s = te();
      if (!s || !N.value.content.trim()) return;
      await b("proactive_create", { ...N.value, target: s }) && (N.value = { target: "", motive: "", content: "", preferred_at: "" }, K.value = "", J.value = "", g("已创建主动候选"));
    }
    async function kt(s) {
      await b("proactive_cancel", { id: s, reason: "dashboard_cancel" }), g("已取消候选");
    }
    async function al() {
      await b("proactive_policy", { daily_limit: Number(T.value.daily_limit), per_target_limit: Number(T.value.per_target_limit), quiet_start: Number(T.value.quiet_start), quiet_end: Number(T.value.quiet_end) }), g("策略已保存");
    }
    const ht = r("");
    async function Pe(s) {
      ht.value = s;
      try {
        const t = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: s === "journal" ? "journal_generate" : "dream_generate", payload: {} }) });
        if (!t.ok) throw Error(await t.text());
        await ye(), g("已由 LIFE 生成");
      } catch (t) {
        j.value = se(t);
      } finally {
        ht.value = "";
      }
    }
    async function ol() {
      const s = te();
      if (!s) {
        g("先选择发送目标");
        return;
      }
      await b("proactive_suggest", { target: s, hint: N.value.motive }) && (N.value = { target: "", motive: "", content: "", preferred_at: "" }, K.value = "", J.value = "", g("已生成建议候选"));
    }
    const Ie = r(!1);
    async function il() {
      Ie.value = !0;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "proactive_tick", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        const t = await s.json();
        await ye(), g(t?.skipped ? `本次跳过：${t.skipped}` : `已投递 ${t.delivered || 0} 条 · 拦截 ${t.blocked || 0} 条`);
      } catch (s) {
        j.value = se(s);
      } finally {
        Ie.value = !1;
      }
    }
    const Je = r(!1);
    async function ul() {
      Je.value = !0;
      try {
        const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "autonomy_plan", payload: {} }) });
        if (!s.ok) throw Error(await s.text());
        const t = await s.json();
        await ye();
        const l = t?.applied;
        g(l ? `已自主规划：日程 ${l.agenda} · 主动 ${l.proactive}` : "本次没有新的规划");
      } catch (s) {
        j.value = se(s);
      } finally {
        Je.value = !1;
      }
    }
    function dl(s) {
      const t = (s || "").trim(), l = /* @__PURE__ */ new Date();
      l.setHours(0, 0, 0, 0);
      let i = null;
      return /^\d{4}-\d{2}-\d{2}$/.test(t) ? (i = new Date(t), i.setHours(0, 0, 0, 0), i < l && i.setFullYear(l.getFullYear() + 1)) : /^\d{2}-\d{2}$/.test(t) && (i = new Date(l.getFullYear(), Number(t.slice(0, 2)) - 1, Number(t.slice(3, 5))), i < l && i.setFullYear(l.getFullYear() + 1)), !i || Number.isNaN(i.getTime()) ? null : Math.round((i.getTime() - l.getTime()) / 864e5);
    }
    const F = r({ title: "", date: "", repeat_yearly: !0, note: "" });
    async function rl() {
      !F.value.title.trim() || !F.value.date.trim() || (await b("date_add", { ...F.value }), F.value = { title: "", date: "", repeat_yearly: !0, note: "" }, g("已添加重要日期"));
    }
    async function cl(s) {
      await b("date_delete", { id: s }), g("已删除");
    }
    async function vl() {
      await b("circadian_eat", { amount: 45 }), g("已用餐");
    }
    async function wt() {
      const s = await b("daily_agenda", {});
      g(s?.created ? `LIFE 已安排 ${s.created} 项活动` : "今天已有安排");
    }
    function A(s) {
      if (!s) return "";
      const t = new Date(s);
      return Number.isNaN(t.getTime()) ? s : t.toLocaleString();
    }
    const Y = r(""), Ae = r(""), Be = r(""), w = r(null), et = r(!1), ze = r([]), we = r(null), fe = r("overview"), pl = [{ key: "overview", label: "概览" }, { key: "relationship", label: "关系" }, { key: "proactive", label: "主动" }, { key: "memory", label: "记忆" }, { key: "diagnostics", label: "诊断" }], _l = k(() => Array.from(new Set((v.value.relationships || []).map((s) => s.stage).filter(Boolean)))), Ct = k(() => String(v.value.settings?.owner_user_ids || "").split(",").map((s) => s.trim()).filter(Boolean)), tt = k(() => (v.value.relationships || []).filter((s) => (!Ae.value || String(s.user_id).toLowerCase().includes(Ae.value.toLowerCase())) && (!Be.value || s.stage === Be.value)));
    async function lt(s) {
      Y.value = s, fe.value = "overview", et.value = !0;
      const [t, l, i] = await Promise.all([
        b("user_detail", { user_id: s, limit: 100, memory_limit: 100 }),
        ne("open_topic_list", { user_id: s, limit: 10 }).catch(() => ({ topics: [] })),
        ne("portrait_get", { user_id: s }).catch(() => null)
      ]);
      w.value = t || null, ze.value = l?.topics || [], we.value = i, et.value = !1;
    }
    function ml() {
      Y.value = "", w.value = null, ze.value = [], we.value = null;
    }
    async function bl(s) {
      await b("delete_memory", { id: s }), Y.value && lt(Y.value);
    }
    async function yl(s) {
      if (!Y.value) return;
      const t = await b("open_topic_resolve", { user_id: Y.value, topics: [s] });
      g(t?.resolved ? "已标记完成" : "已处理");
    }
    const Te = r(V().slice(0, 7)), de = r({ events: [], candidates: [], conflicts: [] }), Ce = r({ title: "", detail: "", kind: "growth" }), st = r({}), Re = r({}), re = r({ name: "", tags: "", note: "" }), xt = k(() => v.value.word_cloud || []), fl = k(() => {
      const [s, t] = Te.value.split("-").map(Number);
      if (!s || !t) return [];
      const l = new Date(s, t, 0).getDate(), i = new Date(s, t - 1, 1).getDay(), M = {};
      for (const E of de.value.events || []) {
        const z = String(E.start_at || "").replace("T", " ").slice(0, 10);
        (M[z] || (M[z] = [])).push(E);
      }
      const De = [];
      for (let E = 0; E < i; E++) De.push({ key: `pad-${E}`, empty: !0 });
      for (let E = 1; E <= l; E++) {
        const z = `${s}-${String(t).padStart(2, "0")}-${String(E).padStart(2, "0")}`;
        De.push({ key: z, day: E, iso: z, events: M[z] || [], today: z === Se });
      }
      return De;
    });
    async function Ke() {
      try {
        const s = await ne("calendar_month", { month: Te.value });
        s && (de.value = s);
      } catch {
      }
    }
    function $t(s) {
      const [t, l] = Te.value.split("-").map(Number), i = new Date(t, l - 1 + s, 1);
      Te.value = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}`, Ke();
    }
    async function gl() {
      Ce.value.title.trim() && (await b("goal_add", { ...Ce.value }), Ce.value = { title: "", detail: "", kind: "growth" });
    }
    async function Vt(s) {
      const t = await ne("goal_logs", { id: s, limit: 20 });
      st.value[s] = t?.logs || [];
    }
    async function kl(s) {
      const t = (Re.value[s] || "").trim();
      t && (await b("goal_log_add", { id: s, evidence: t }), Re.value[s] = "", Vt(s));
    }
    async function hl() {
      re.value.name.trim() && (await b("food_add", { ...re.value }), re.value = { name: "", tags: "", note: "" });
    }
    async function wl(s) {
      await b("food_delete", { id: s });
    }
    const Ye = r([]);
    async function Ut() {
      try {
        const s = await ne("content_list", { limit: 30 });
        Ye.value = s?.digests || [];
      } catch {
      }
    }
    async function St() {
      const s = await b("content_tick", {});
      Ut(), s && (s.skipped === "disabled" ? g("内容抓取未开启（配置 → 环境与内容 打开 enable_content_fetch）") : s.skipped === "done" ? g("今天已经抓取过了") : s.skipped === "sleeping" ? g("睡眠中，暂不抓取") : g(s.stored != null ? `已抓取 ${s.stored} 条见闻` : "已处理"));
    }
    async function nt() {
      const s = await b("outfit_tick", {});
      s && (s.outfit ? g(`今日穿搭：${s.outfit}`) : s.skipped === "no_wardrobe" ? g("衣橱还没有条目（世界知识 → wardrobe）") : s.skipped === "done" ? g("今天已经有穿搭了") : g("已处理"));
    }
    async function Cl() {
      const s = await b("image_generate", { prompt: "今天的穿搭" });
      g(s?.ok ? "已生成" : `生图不可用：${s?.reason || "未配置扩展"}`);
    }
    async function Nt() {
      if (!Y.value || !x.value.trim()) return;
      await b("open_topic_add", { user_id: Y.value, topic: x.value.trim() }) && (x.value = "", g("已加入未完话题"));
    }
    const Tt = k(() => {
      const s = {};
      for (const l of v.value.timeline || []) {
        const i = String(l.created_at || "").slice(0, 10);
        i && (s[i] = (s[i] || 0) + 1);
      }
      const t = [];
      for (let l = 13; l >= 0; l--) {
        const i = /* @__PURE__ */ new Date();
        i.setDate(i.getDate() - l);
        const M = i.toISOString().slice(0, 10);
        t.push({ day: M.slice(5), count: s[M] || 0 });
      }
      return t;
    }), xl = k(() => Math.max(1, ...Tt.value.map((s) => s.count))), ge = r([]), jt = k(() => {
      const s = [];
      for (const t of v.value.conversations || []) s.push({ value: `session:${t}`, label: `会话 · ${t}` });
      for (const t of v.value.relationships || []) s.push({ value: `user:${t.user_id}`, label: `用户 · ${t.user_id}` });
      for (const t of ge.value) s.push({ value: `group:${t.group_id}`, label: `群 · ${t.alias || t.group_id}` });
      return s;
    }), Mt = [{ value: "observe", label: "观察" }, { value: "whitelist", label: "白名单" }, { value: "blacklist", label: "黑名单" }], $l = [{ value: "watch", label: "关注" }, { value: "allow", label: "放行" }, { value: "mute", label: "禁言" }], Vl = k(() => [{ value: "", label: "全部阶段" }, ..._l.value.map((s) => ({ value: s, label: s }))]), Lt = ["警惕", "疏离", "陌生", "认识", "熟悉", "友好", "亲近", "亲密"], Ul = [{ value: "zh-CN", label: "简体中文" }, { value: "en-US", label: "English" }], Sl = [{ value: "tts", label: "语音 TTS" }, { value: "image", label: "图片" }, { value: "poke", label: "戳一戳" }, { value: "status", label: "QQ 状态" }], Nl = k(() => [{ value: "", label: "选择发送到哪个对话 / 对象…" }, ...jt.value, { value: "__manual__", label: "手动输入…" }]), Tl = k(() => [{ value: "", label: "选择目标…" }, ...jt.value]), G = r({ group_id: "", policy: "observe", alias: "" }), Ot = r({}), Dt = r({}), je = r({}), Ge = r({});
    async function jl() {
      try {
        const s = await ne("group_list", {});
        ge.value = s.groups || [];
      } catch {
      }
    }
    async function Ml() {
      G.value.group_id.trim() && (await b("group_upsert", { ...G.value }), G.value = { group_id: "", policy: "observe", alias: "" });
    }
    async function Ll(s) {
      await b("group_delete", { group_id: s }), ee.value === s && (ee.value = "");
    }
    async function Ol(s, t) {
      await b("group_upsert", { group_id: s.group_id, policy: t, alias: s.alias || "", note: s.note || "" });
    }
    async function Dl(s, t, l) {
      await b("group_member_flag", { group_id: s, user_id: t, flag: l }), He(s);
    }
    async function He(s) {
      const [t, l, i] = await Promise.all([b("group_slang_list", { group_id: s }), b("group_members", { group_id: s }), ne("group_atmosphere", { group_id: s }).catch(() => null)]);
      Ot.value[s] = t?.slang || [], Dt.value[s] = l?.members || [], i && (je.value[s] = i);
    }
    function El(s) {
      ee.value = ee.value === s ? "" : s, ee.value && He(s);
    }
    async function Fl(s) {
      const t = (Ge.value[s] || "").trim();
      t && (await b("group_slang_update", { group_id: s, topic: t, score: 1 }), Ge.value[s] = "", He(s));
    }
    async function ql(s, t) {
      await b("group_slang_delete", { group_id: s, topic: t }), He(s);
    }
    async function Et() {
      const s = await b("group_wake_tick", {});
      g(s?.proposed != null ? `已生成 ${s.proposed} 条群聊插话候选` : "本次没有合适的群聊兴趣点");
    }
    const B = r({ name: "", category: "general", level: 1, keywords: "" }), ce = r({ text: "", scene: "" }), ke = r("pending"), ve = r({ user_id: "", name: "", tags: "" }), H = r({ source_id: "", target_id: "", relation: "" }), Ft = k(() => (v.value.expressions || []).filter((s) => s.status === ke.value)), at = k(() => {
      const s = v.value.expressions || [];
      return { pending: s.filter((t) => t.status === "pending").length, approved: s.filter((t) => t.status === "approved").length, rejected: s.filter((t) => t.status === "rejected").length };
    });
    async function Pl() {
      B.value.name.trim() && (await b("skill_add", { ...B.value, level: Number(B.value.level) }), B.value = { name: "", category: "general", level: 1, keywords: "" });
    }
    async function Il(s) {
      const t = await b("skill_grow", { name: s });
      g(t?.updated ? `${s} 升到 Lv.${t.level}` : "技能未找到");
    }
    async function Jl(s) {
      await b("skill_delete", { id: s });
    }
    async function Al() {
      ce.value.text.trim() && (await b("expression_add", { ...ce.value }), ce.value = { text: "", scene: "" });
    }
    async function qt(s, t) {
      await b("expression_review", { id: s, accept: t });
    }
    async function Bl(s) {
      await b("expression_delete", { id: s });
    }
    async function zl() {
      ve.value.user_id.trim() && (await b("social_node_upsert", { ...ve.value }), ve.value = { user_id: "", name: "", tags: "" });
    }
    async function Rl() {
      !H.value.source_id.trim() || !H.value.target_id.trim() || (await b("social_edge_add", { ...H.value }), H.value = { source_id: "", target_id: "", relation: "" });
    }
    async function Kl(s) {
      await b("social_edge_delete", { id: s });
    }
    const _ = r({}), We = r("{}"), Me = r(null), W = r(""), Pt = r({}), Qe = k(() => Object.entries(Pt.value || {}).map(([s, t]) => ({ name: s, ...t })));
    async function It() {
      try {
        const s = await ne("extension_status", {});
        Pt.value = s?.extensions || {};
      } catch {
      }
    }
    function Yl() {
      const s = v.value.settings || {}, t = (l, i) => String(s[l] ?? i);
      _.value = {
        proactive_daily_limit: Number(t("proactive_daily_limit", "3")),
        proactive_target_limit: Number(t("proactive_target_limit", "1")),
        quiet_start: Number(t("quiet_start", "23")),
        quiet_end: Number(t("quiet_end", "8")),
        idle_minutes: Number(t("idle_minutes", "30")),
        min_interval_minutes: Number(t("min_interval_minutes", "5")),
        check_interval_seconds: Number(t("check_interval_seconds", "600")),
        burst_max: Number(t("burst_max", "2")),
        daily_token_limit: Number(t("daily_token_limit", "0")),
        enable_proactive: t("enable_proactive", "1") === "1",
        enable_group_observe: t("enable_group_observe", "1") === "1",
        enable_dream: t("enable_dream", "1") === "1",
        owner_user_ids: t("owner_user_ids", ""),
        secondary_user_ids: t("secondary_user_ids", ""),
        other_stage_cap: t("other_stage_cap", "熟悉"),
        secondary_stage_cap: t("secondary_stage_cap", "友好"),
        enable_exclusive_bond: t("enable_exclusive_bond", "1") === "1",
        affinity_decay_per_day: Number(t("affinity_decay_per_day", "0.02")),
        affinity_decay_after_days: Number(t("affinity_decay_after_days", "3")),
        reply_deceleration: t("reply_deceleration", "1") === "1",
        env_timezone: t("env_timezone", "Asia/Shanghai"),
        env_city: t("env_city", ""),
        env_latitude: t("env_latitude", ""),
        env_longitude: t("env_longitude", ""),
        enable_environment_fetch: t("enable_environment_fetch", "0") === "1",
        weather_cache_minutes: Number(t("weather_cache_minutes", "60")),
        enable_content_fetch: t("enable_content_fetch", "0") === "1",
        news_feeds: t("news_feeds", ""),
        content_items_per_feed: Number(t("content_items_per_feed", "3")),
        tts_endpoint: t("tts_endpoint", ""),
        locale: t("locale", "zh-CN")
      }, We.value = t("model_routes", "{}") || "{}";
    }
    async function Gl() {
      const s = _.value, t = {
        proactive_daily_limit: String(s.proactive_daily_limit),
        proactive_target_limit: String(s.proactive_target_limit),
        quiet_start: String(s.quiet_start),
        quiet_end: String(s.quiet_end),
        idle_minutes: String(s.idle_minutes),
        min_interval_minutes: String(s.min_interval_minutes),
        check_interval_seconds: String(s.check_interval_seconds),
        burst_max: String(s.burst_max),
        daily_token_limit: String(s.daily_token_limit),
        enable_proactive: s.enable_proactive ? "1" : "0",
        enable_group_observe: s.enable_group_observe ? "1" : "0",
        enable_dream: s.enable_dream ? "1" : "0",
        owner_user_ids: String(s.owner_user_ids),
        secondary_user_ids: String(s.secondary_user_ids),
        other_stage_cap: String(s.other_stage_cap),
        secondary_stage_cap: String(s.secondary_stage_cap),
        enable_exclusive_bond: s.enable_exclusive_bond ? "1" : "0",
        affinity_decay_per_day: String(s.affinity_decay_per_day),
        affinity_decay_after_days: String(s.affinity_decay_after_days),
        reply_deceleration: s.reply_deceleration ? "1" : "0",
        env_timezone: String(s.env_timezone),
        env_city: String(s.env_city),
        env_latitude: String(s.env_latitude),
        env_longitude: String(s.env_longitude),
        enable_environment_fetch: s.enable_environment_fetch ? "1" : "0",
        weather_cache_minutes: String(s.weather_cache_minutes),
        enable_content_fetch: s.enable_content_fetch ? "1" : "0",
        news_feeds: String(s.news_feeds),
        content_items_per_feed: String(s.content_items_per_feed),
        tts_endpoint: String(s.tts_endpoint),
        locale: String(s.locale)
      }, l = await b("settings_set", { settings: t });
      l?.rejected?.length ? g(`已保存，忽略无效项：${l.rejected.join("、")}`) : g("设置已保存");
    }
    async function Jt() {
      let s;
      try {
        s = JSON.parse(We.value || "{}");
      } catch {
        j.value = "模型分流不是合法 JSON";
        return;
      }
      await b("model_routes_set", { routes: s }), await b("settings_set", { settings: { model_routes: JSON.stringify(s) } }), g("模型分流已保存并生效");
    }
    async function Hl() {
      const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "config_export", payload: {} }) });
      if (!s.ok) {
        j.value = await s.text();
        return;
      }
      const t = new Blob([JSON.stringify(await s.json(), null, 2)], { type: "application/json" }), l = URL.createObjectURL(t), i = document.createElement("a");
      i.href = l, i.download = `life-companion-${V()}.json`, i.click(), URL.revokeObjectURL(l);
    }
    async function Wl() {
      if (!W.value.trim()) return;
      let s;
      try {
        s = JSON.parse(W.value);
      } catch {
        j.value = "导入内容不是合法 JSON";
        return;
      }
      const t = await b("config_import", { snapshot: s });
      t && (W.value = "", g(`已导入：${Object.entries(t.applied || {}).map(([l, i]) => `${l} ${i}`).join(" · ")}`));
    }
    async function Ql() {
      const s = await fetch("/api/life/companion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "export_all", payload: {} }) });
      if (!s.ok) {
        j.value = se(await s.text());
        return;
      }
      const t = new Blob([JSON.stringify(await s.json(), null, 2)], { type: "application/json" }), l = URL.createObjectURL(t), i = document.createElement("a");
      i.href = l, i.download = `life-full-${V()}.json`, i.click(), URL.revokeObjectURL(l);
    }
    async function Xl() {
      if (!W.value.trim()) return;
      let s;
      try {
        s = JSON.parse(W.value);
      } catch {
        j.value = "导入内容不是合法 JSON";
        return;
      }
      const t = await b("import_all", { snapshot: s });
      t && (W.value = "", g(`已全量导入：${Object.entries(t.applied || {}).map(([l, i]) => `${l} ${i}`).join(" · ")}`));
    }
    async function Zl() {
      const s = await b("diagnostics", {});
      s && (Me.value = s);
    }
    const ot = r(""), it = r(""), ut = r([]), At = r(0);
    async function Bt() {
      try {
        const s = await ne("audit_query", { kind: ot.value, outcome: it.value, limit: 120 });
        ut.value = s?.items || [], At.value = s?.total || 0;
      } catch {
      }
    }
    const zt = ["persona", "worldview", "style", "background", "wardrobe", "reference"], xe = r(""), $ = r({ id: "", kind: "worldview", title: "", content: "", tags: "" }), Rt = k(() => (v.value.world || []).filter((s) => !xe.value || s.kind === xe.value));
    function es(s) {
      $.value = { id: s.id, kind: s.kind, title: s.title, content: s.content, tags: s.tags || "" };
    }
    async function Kt() {
      !$.value.title.trim() || !$.value.content.trim() || (await b("world_upsert", { ...$.value }), $.value = { id: "", kind: "worldview", title: "", content: "", tags: "" });
    }
    async function ts(s) {
      await b("world_delete", { id: s });
    }
    const $e = k(() => v.value.timeline || []), Le = k(() => v.value.open_topics || []), dt = k(() => v.value.portraits || []), rt = k(() => v.value.reviews || []);
    function Yt(s) {
      try {
        return JSON.parse(s.findings || "[]");
      } catch {
        return [];
      }
    }
    const ct = r(""), vt = k(() => {
      const s = ct.value.trim().toLowerCase();
      return $e.value.filter((t) => !s || `${t.topic} ${t.summary} ${t.detail || ""}`.toLowerCase().includes(s));
    }), pt = r(""), Gt = k(() => {
      const s = pt.value.trim().toLowerCase();
      return ge.value.filter((t) => !s || `${t.group_id} ${t.alias || ""}`.toLowerCase().includes(s));
    }), Oe = k(() => v.value.emotion || { valence: 0, arousal: 0.5, connection: 0.5, irritation: 0 }), ls = k(() => {
      const s = Oe.value, t = [(Number(s.valence) + 1) / 2, Number(s.arousal), Number(s.connection), Number(s.irritation)], l = 60, i = 60, M = 46;
      return t.map((De, E) => {
        const z = (-90 + E * 90) * Math.PI / 180, Xt = M * Math.max(0.05, Math.min(1, Number(De) || 0));
        return `${(l + Xt * Math.cos(z)).toFixed(1)},${(i + Xt * Math.sin(z)).toFixed(1)}`;
      }).join(" ");
    }), q = r({ kind: "tts", target: "", text: "", file: "" });
    async function ss() {
      const s = await b("send_media", { ...q.value });
      g(s?.ok ? "已发送" : `发送失败：${s?.reason || "未知"}`);
    }
    async function ns() {
      const s = await b("backup_now", {});
      g(s?.backup ? "已备份陪伴数据" : `备份失败：${s?.error || "未知"}`);
    }
    const as = V(), Ht = k(() => {
      const s = Date.now();
      return le.value.filter((t) => {
        if (!t.start_at) return !1;
        const l = new Date(String(t.start_at).replace(" ", "T")).getTime();
        return !Number.isNaN(l) && l <= s;
      }).slice(-1)[0] || null;
    }), _t = k(() => {
      const s = Date.now();
      return le.value.find((t) => {
        if (!t.start_at) return !1;
        const l = new Date(String(t.start_at).replace(" ", "T")).getTime();
        return !Number.isNaN(l) && l > s;
      }) || null;
    }), Wt = k(() => (v.value.important_dates || []).map((s) => ({ ...s, inDays: dl(s.date_text) })).filter((s) => s.inDays !== null).sort((s, t) => s.inDays - t.inDays).slice(0, 3)), Qt = k(() => (v.value.journal || [])[0] || null);
    k(() => (v.value.dreams || [])[0] || null);
    function D(s) {
      c.value = s;
      const t = h.value;
      t ? t.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return sl(ye), (s, t) => (a(), o("main", {
      class: "pcp",
      ref_key: "pageEl",
      ref: h
    }, [
      e("header", ks, [
        e("div", hs, [
          t[110] || (t[110] = e("div", { class: "hero-copy" }, [
            e("p", { class: "eyebrow" }, [
              e("b", null, "●"),
              f(" L.I.F.E / COMPANION")
            ]),
            e("h1", null, "陪伴面板"),
            e("p", { class: "sub" }, "日程、关系、主动、群聊、成长与诊断集中在这里；功能卡片点击进入对应视图。")
          ], -1)),
          e("div", ws, [
            e("button", {
              class: "fab",
              disabled: Je.value,
              onClick: ul
            }, [
              t[109] || (t[109] = e("span", { class: "fab-ic" }, "✦", -1)),
              f(n(Je.value ? "规划中…" : "让 LIFE 规划"), 1)
            ], 8, Cs),
            e("button", {
              class: "btn tonic",
              disabled: O.value,
              onClick: ye
            }, n(O.value ? "刷新中…" : "刷新"), 9, xs),
            e("button", {
              class: "btn text",
              onClick: t[0] || (t[0] = (l) => D("config"))
            }, "配置引导")
          ])
        ]),
        e("div", $s, [
          e("button", {
            class: "stat",
            onClick: t[1] || (t[1] = (l) => D("users"))
          }, [
            t[111] || (t[111] = e("span", { class: "stat-ic t1" }, "☺", -1)),
            e("span", Vs, n(v.value.relationships?.length || 0), 1),
            t[112] || (t[112] = e("span", { class: "stat-cap" }, "关系对象", -1))
          ]),
          e("button", {
            class: "stat",
            onClick: t[2] || (t[2] = (l) => D("overview"))
          }, [
            t[113] || (t[113] = e("span", { class: "stat-ic t2" }, "▤", -1)),
            e("span", Us, n(le.value.filter((l) => l.status === "active").length), 1),
            t[114] || (t[114] = e("span", { class: "stat-cap" }, "待进行日程", -1))
          ]),
          e("button", {
            class: "stat",
            onClick: t[3] || (t[3] = (l) => D("proactive"))
          }, [
            t[115] || (t[115] = e("span", { class: "stat-ic t3" }, "✦", -1)),
            e("span", Ss, n(ie.value.length), 1),
            t[116] || (t[116] = e("span", { class: "stat-cap" }, "待投递主动", -1))
          ]),
          e("button", {
            class: "stat",
            onClick: t[4] || (t[4] = (l) => D("groups"))
          }, [
            t[117] || (t[117] = e("span", { class: "stat-ic t4" }, "☷", -1)),
            e("span", Ns, n(Ue.value.length), 1),
            t[118] || (t[118] = e("span", { class: "stat-cap" }, "观察群聊", -1))
          ]),
          e("button", {
            class: "stat",
            onClick: t[5] || (t[5] = (l) => D("observe"))
          }, [
            t[119] || (t[119] = e("span", { class: "stat-ic t5" }, "◎", -1)),
            e("span", Ts, n(Le.value.length), 1),
            t[120] || (t[120] = e("span", { class: "stat-cap" }, "未完话题", -1))
          ]),
          e("button", {
            class: "stat",
            onClick: t[6] || (t[6] = (l) => D("observe"))
          }, [
            t[121] || (t[121] = e("span", { class: "stat-ic t6" }, "✎", -1)),
            e("span", js, n(Ye.value.length), 1),
            t[122] || (t[122] = e("span", { class: "stat-cap" }, "内容见闻", -1))
          ])
        ]),
        e("div", Ms, [
          e("span", Ls, "精力 " + n(Math.round(v.value.circadian?.mental_energy ?? 0)), 1),
          e("span", {
            class: C(["pill", { bad: (v.value.circadian?.hunger ?? 0) >= 75 }])
          }, "饥饿 " + n(Math.round(v.value.circadian?.hunger ?? 0)), 3),
          e("span", {
            class: C(["pill", { bad: (v.value.circadian?.health ?? 100) < 60 }])
          }, "健康 " + n(Math.round(v.value.circadian?.health ?? 100)), 3),
          v.value.circadian?.is_sleeping ? (a(), o("span", Os, "睡眠中")) : d("", !0),
          v.value.settings?.env_timezone ? (a(), o("span", Ds, n(v.value.settings.env_timezone), 1)) : d("", !0),
          v.value.settings?.env_city ? (a(), o("span", Es, n(v.value.settings.env_city), 1)) : d("", !0),
          e("button", {
            class: "chip-btn",
            onClick: vl
          }, "吃饭"),
          e("button", {
            class: "chip-btn",
            onClick: nt
          }, "今日穿搭"),
          e("button", {
            class: "chip-btn",
            onClick: gt
          }, "关系回落")
        ])
      ]),
      j.value ? (a(), o("p", Fs, n(j.value), 1)) : d("", !0),
      me.value ? (a(), o("p", qs, n(me.value), 1)) : d("", !0),
      e("nav", Ps, [
        (a(), o(m, null, y(S, (l) => e("button", {
          key: l.key,
          class: C(["tab", { active: c.value === l.key }]),
          onClick: (i) => D(l.key)
        }, [
          e("i", null, n(l.i), 1),
          e("span", Js, n(l.icon), 1),
          f(n(l.label), 1)
        ], 10, Is)), 64))
      ]),
      u(e("section", As, [
        e("div", Bs, [
          t[123] || (t[123] = e("div", null, [
            e("h2", null, "今日概览"),
            e("p", { class: "desc" }, "生活工作台：今天发生了什么、现在在做什么、接下来做什么。")
          ], -1)),
          e("div", zs, [
            e("button", {
              class: "btn tonal sm",
              onClick: wt
            }, "安排今天"),
            e("button", {
              class: "btn tonal sm",
              onClick: t[7] || (t[7] = (l) => Pe("journal"))
            }, "生成日记"),
            e("button", {
              class: "btn tonal sm",
              onClick: t[8] || (t[8] = (l) => Pe("dream"))
            }, "生成梦境")
          ])
        ]),
        e("div", Rs, [
          e("div", Ks, [
            e("article", Ys, [
              e("header", null, [
                t[124] || (t[124] = e("span", { class: "dot ic" }, null, -1)),
                t[125] || (t[125] = e("h3", null, "今日", -1)),
                e("small", null, n(Ee(as)), 1)
              ]),
              e("div", Gs, [
                e("div", Hs, [
                  e("b", null, n(v.value.relationships?.length || 0), 1),
                  t[126] || (t[126] = e("span", null, "记住的人", -1))
                ]),
                e("div", Ws, [
                  e("b", null, n(ie.value.length), 1),
                  t[127] || (t[127] = e("span", null, "待投递", -1))
                ]),
                e("div", Qs, [
                  e("b", null, n(le.value.length), 1),
                  t[128] || (t[128] = e("span", null, "今日日程", -1))
                ]),
                e("div", Xs, [
                  e("b", null, n(Le.value.length), 1),
                  t[129] || (t[129] = e("span", null, "未完话题", -1))
                ])
              ]),
              Wt.value.length ? (a(), o("div", Zs, [
                (a(!0), o(m, null, y(Wt.value, (l) => (a(), o("span", {
                  key: l.id,
                  class: "chip warn"
                }, n(l.title) + " · " + n(l.inDays === 0 ? "今天" : l.inDays + "天后"), 1))), 128))
              ])) : d("", !0)
            ]),
            e("article", en, [
              t[131] || (t[131] = e("header", null, [
                e("span", { class: "dot ic" }),
                e("h3", null, "当前")
              ], -1)),
              Ht.value ? (a(), o("div", tn, [
                e("strong", null, n(Ht.value.title), 1),
                t[130] || (t[130] = e("span", { class: "chip ok" }, "进行中", -1))
              ])) : (a(), o("p", ln, "此刻没有进行中的日程。")),
              _t.value ? (a(), o("div", sn, "接下来：" + n(_t.value.start_at) + " " + n(_t.value.title), 1)) : d("", !0)
            ]),
            v.value.calendar_candidates?.filter((l) => l.status === "pending_confirmation").length ? (a(), o("article", nn, [
              e("header", null, [
                t[132] || (t[132] = e("span", { class: "dot ic" }, null, -1)),
                t[133] || (t[133] = e("h3", null, "待确认日程", -1)),
                e("small", null, n(v.value.calendar_candidates.filter((l) => l.status === "pending_confirmation").length), 1)
              ]),
              e("ul", an, [
                (a(!0), o(m, null, y(v.value.calendar_candidates.filter((l) => l.status === "pending_confirmation"), (l) => (a(), o("li", {
                  key: l.id
                }, [
                  e("span", null, [
                    f(n(l.title), 1),
                    e("em", on, " · " + n(l.when_text), 1)
                  ]),
                  e("span", un, [
                    e("button", {
                      class: "btn filled sm",
                      onClick: (i) => b("confirm_agenda", { id: l.id })
                    }, "确认", 8, dn),
                    e("button", {
                      class: "btn text sm",
                      onClick: (i) => b("reject_agenda", { id: l.id })
                    }, "拒绝", 8, rn)
                  ])
                ]))), 128))
              ])
            ])) : d("", !0),
            e("article", cn, [
              e("header", null, [
                t[134] || (t[134] = e("span", { class: "dot ic" }, null, -1)),
                t[135] || (t[135] = e("h3", null, "新增日程", -1)),
                e("button", {
                  class: "link",
                  onClick: wt
                }, "让 LIFE 安排")
              ]),
              e("div", vn, [
                u(e("input", {
                  "onUpdate:modelValue": t[9] || (t[9] = (l) => ae.value = l),
                  class: "field",
                  placeholder: "日程标题",
                  onKeyup: tl(bt, ["enter"])
                }, null, 544), [
                  [p, ae.value]
                ])
              ]),
              e("div", pn, [
                u(e("input", {
                  "onUpdate:modelValue": t[10] || (t[10] = (l) => he.value = l),
                  class: "field",
                  placeholder: "时间，如 2026-09-25 20:00"
                }, null, 512), [
                  [p, he.value]
                ])
              ]),
              u(e("textarea", {
                "onUpdate:modelValue": t[11] || (t[11] = (l) => X.value = l),
                class: "field area",
                placeholder: "说明（可选）"
              }, null, 512), [
                [p, X.value]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: bt,
                disabled: !ae.value.trim()
              }, "添加到日程", 8, _n),
              t[136] || (t[136] = e("p", { class: "hint" }, "直接加入日程，无需确认。", -1))
            ])
          ]),
          e("div", mn, [
            e("article", bn, [
              e("header", null, [
                t[137] || (t[137] = e("span", { class: "dot ic" }, null, -1)),
                t[138] || (t[138] = e("h3", null, "时间轴", -1)),
                e("button", {
                  class: "link",
                  onClick: t[12] || (t[12] = (l) => D("observe"))
                }, "完整日程")
              ]),
              e("ol", yn, [
                (a(!0), o(m, null, y(le.value, (l) => (a(), o("li", {
                  key: l.id,
                  class: C(Ze(l).cls)
                }, [
                  e("time", null, n((l.start_at || "").replace("T", " ").slice(11, 16) || "--:--"), 1),
                  e("div", null, [
                    e("strong", {
                      class: C({ done: l.status === "completed" })
                    }, n(l.title), 3),
                    l.detail ? (a(), o("span", fn, n(l.detail), 1)) : d("", !0)
                  ]),
                  e("span", {
                    class: C(["chip", Ze(l).cls])
                  }, n(Ze(l).label), 3)
                ], 2))), 128)),
                le.value.length ? d("", !0) : (a(), o("li", gn, "今天还没有安排。"))
              ])
            ]),
            e("article", kn, [
              e("header", null, [
                t[139] || (t[139] = e("span", { class: "dot ic" }, null, -1)),
                t[140] || (t[140] = e("h3", null, "最新日记", -1)),
                e("button", {
                  class: "link",
                  onClick: t[13] || (t[13] = (l) => D("observe"))
                }, "全部")
              ]),
              Qt.value ? (a(), o("p", hn, n(Qt.value.content), 1)) : (a(), o("p", wn, "今天还没有写下什么。")),
              e("div", Cn, [
                u(e("textarea", {
                  "onUpdate:modelValue": t[14] || (t[14] = (l) => Z.value = l),
                  class: "field area",
                  placeholder: "为今天写下一点…"
                }, null, 512), [
                  [p, Z.value]
                ]),
                e("button", {
                  class: "btn filled sm",
                  onClick: t[15] || (t[15] = (l) => yt("journal", Z.value))
                }, "写入日记")
              ]),
              e("div", xn, [
                u(e("textarea", {
                  "onUpdate:modelValue": t[16] || (t[16] = (l) => U.value = l),
                  class: "field area",
                  placeholder: "记录一个梦…"
                }, null, 512), [
                  [p, U.value]
                ]),
                e("button", {
                  class: "btn tonal sm",
                  onClick: t[17] || (t[17] = (l) => yt("dream", U.value))
                }, "写入梦境")
              ])
            ])
          ]),
          e("div", $n, [
            e("article", Vn, [
              e("header", null, [
                t[141] || (t[141] = e("span", { class: "dot ic" }, null, -1)),
                t[142] || (t[142] = e("h3", null, "动态与记忆", -1)),
                e("button", {
                  class: "link",
                  onClick: t[18] || (t[18] = (l) => D("observe"))
                }, "观察")
              ]),
              e("ol", Un, [
                (a(!0), o(m, null, y($e.value.slice(0, 5), (l) => (a(), o("li", {
                  key: l.id
                }, [
                  t[143] || (t[143] = e("span", { class: "dot" }, null, -1)),
                  e("div", null, [
                    e("strong", null, n(l.topic), 1),
                    e("span", Sn, n(l.summary), 1)
                  ])
                ]))), 128)),
                $e.value.length ? d("", !0) : (a(), o("li", Nn, "还没有记录。"))
              ])
            ]),
            e("article", Tn, [
              e("header", null, [
                t[144] || (t[144] = e("span", { class: "dot ic" }, null, -1)),
                t[145] || (t[145] = e("h3", null, "运行能力", -1)),
                e("button", {
                  class: "link",
                  onClick: t[19] || (t[19] = (l) => D("models"))
                }, "模型")
              ]),
              e("div", jn, [
                (a(!0), o(m, null, y(Qe.value, (l) => (a(), o("span", {
                  key: l.name,
                  class: C(["cap", { off: !l.available }])
                }, [
                  e("b", null, n(l.name), 1),
                  e("small", null, n(l.available ? "可用" : "未就绪"), 1)
                ], 2))), 128)),
                Qe.value.length ? d("", !0) : (a(), o("span", Mn, "没有注册的扩展。"))
              ])
            ])
          ])
        ]),
        e("details", Ln, [
          t[154] || (t[154] = e("summary", null, [
            e("b", null, "关系与主动策略"),
            e("small", null, "私聊、群聊与长线主动的当前概况")
          ], -1)),
          e("div", On, [
            e("article", Dn, [
              t[146] || (t[146] = e("h3", null, "私聊关系", -1)),
              e("ul", En, [
                (a(!0), o(m, null, y((v.value.relationships || []).slice(0, 5), (l) => (a(), o("li", {
                  key: l.user_id
                }, [
                  e("span", null, [
                    f(n(l.user_id), 1),
                    Ct.value.includes(l.user_id) ? (a(), o("em", Fn, "owner")) : d("", !0)
                  ]),
                  e("b", null, n(l.stage) + " · " + n(Math.round((l.affinity || 0) * 100)) + "%", 1)
                ]))), 128)),
                (v.value.relationships || []).length ? d("", !0) : (a(), o("li", qn, "暂无"))
              ])
            ]),
            e("article", Pn, [
              t[147] || (t[147] = e("h3", null, "群聊观察", -1)),
              e("ul", In, [
                (a(!0), o(m, null, y(ge.value.slice(0, 5), (l) => (a(), o("li", {
                  key: l.group_id
                }, [
                  e("span", null, n(l.alias || l.group_id), 1),
                  e("b", null, n(l.policy) + " · " + n(l.observations) + " 条", 1)
                ]))), 128)),
                ge.value.length ? d("", !0) : (a(), o("li", Jn, "暂无"))
              ])
            ]),
            e("article", An, [
              t[152] || (t[152] = e("h3", null, "长线主动", -1)),
              e("div", Bn, [
                e("label", null, [
                  t[148] || (t[148] = e("span", null, "每日上限", -1)),
                  u(e("input", {
                    "onUpdate:modelValue": t[20] || (t[20] = (l) => T.value.daily_limit = l),
                    type: "number",
                    min: "0",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      p,
                      T.value.daily_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                e("label", null, [
                  t[149] || (t[149] = e("span", null, "单人上限", -1)),
                  u(e("input", {
                    "onUpdate:modelValue": t[21] || (t[21] = (l) => T.value.per_target_limit = l),
                    type: "number",
                    min: "0",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      p,
                      T.value.per_target_limit,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                e("label", null, [
                  t[150] || (t[150] = e("span", null, "免打扰起", -1)),
                  u(e("input", {
                    "onUpdate:modelValue": t[22] || (t[22] = (l) => T.value.quiet_start = l),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      p,
                      T.value.quiet_start,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                e("label", null, [
                  t[151] || (t[151] = e("span", null, "免打扰止", -1)),
                  u(e("input", {
                    "onUpdate:modelValue": t[23] || (t[23] = (l) => T.value.quiet_end = l),
                    type: "number",
                    min: "0",
                    max: "23",
                    class: "field tiny"
                  }, null, 512), [
                    [
                      p,
                      T.value.quiet_end,
                      void 0,
                      { number: !0 }
                    ]
                  ])
                ]),
                e("button", {
                  class: "btn tonal sm",
                  onClick: al
                }, "保存策略")
              ]),
              t[153] || (t[153] = e("p", { class: "hint" }, "未回应会降速：连续 2 次暂停 24h、3 次暂停 3 天；回复即重置。", -1))
            ])
          ])
        ]),
        e("details", zn, [
          t[159] || (t[159] = e("summary", null, [
            e("b", null, "观察与内容记录"),
            e("small", null, "关系分布、群聊分布、内容见闻与活跃")
          ], -1)),
          e("div", Rn, [
            e("article", Kn, [
              t[155] || (t[155] = e("h3", null, "私聊关系分布", -1)),
              e("div", Yn, [
                (a(!0), o(m, null, y((v.value.relationships || []).slice(0, 8), (l) => (a(), o("div", {
                  key: l.user_id,
                  class: "bar-row"
                }, [
                  e("span", Gn, n(l.user_id), 1),
                  e("div", Hn, [
                    e("i", {
                      style: _e({ width: qe(l.affinity) })
                    }, null, 4)
                  ]),
                  e("b", null, n(Math.round((l.affinity || 0) * 100)) + "%", 1)
                ]))), 128)),
                (v.value.relationships || []).length ? d("", !0) : (a(), o("p", Wn, "暂无"))
              ])
            ]),
            e("article", Qn, [
              t[156] || (t[156] = e("h3", null, "群聊观测分布", -1)),
              e("div", Xn, [
                (a(!0), o(m, null, y(ge.value.slice(0, 8), (l) => (a(), o("div", {
                  key: l.group_id,
                  class: "bar-row"
                }, [
                  e("span", Zn, n(l.alias || l.group_id), 1),
                  e("div", ea, [
                    e("i", {
                      style: _e({ width: Math.min(100, l.observations) + "%" })
                    }, null, 4)
                  ]),
                  e("b", null, n(l.observations), 1)
                ]))), 128)),
                ge.value.length ? d("", !0) : (a(), o("p", ta, "暂无"))
              ])
            ]),
            e("article", la, [
              e("h3", null, [
                t[157] || (t[157] = f("内容见闻 ", -1)),
                e("button", {
                  class: "link",
                  onClick: St
                }, "抓取")
              ]),
              e("ol", sa, [
                (a(!0), o(m, null, y(Ye.value.slice(0, 6), (l) => (a(), o("li", {
                  key: l.id
                }, [
                  e("strong", null, n(l.title), 1),
                  e("span", na, n(l.kind) + " · " + n(A(l.created_at)), 1)
                ]))), 128)),
                Ye.value.length ? d("", !0) : (a(), o("li", aa, "暂无；在配置里填 news_feeds 并开启内容抓取。"))
              ])
            ]),
            e("article", oa, [
              t[158] || (t[158] = e("h3", null, "最近活跃", -1)),
              e("ol", ia, [
                (a(!0), o(m, null, y($e.value.slice(0, 8), (l) => (a(), o("li", {
                  key: l.id
                }, [
                  e("strong", null, n(l.topic), 1),
                  e("span", ua, n(A(l.created_at)) + " · " + n(l.summary), 1)
                ]))), 128)),
                $e.value.length ? d("", !0) : (a(), o("li", da, "暂无"))
              ])
            ])
          ])
        ])
      ], 512), [
        [P, c.value === "overview"]
      ]),
      u(e("section", ra, [
        e("div", ca, [
          t[160] || (t[160] = e("div", null, [
            e("h2", null, "世界知识"),
            e("p", { class: "desc" }, "角色资料、世界观、衣橱与引用资料；作为日程、状态、日记与主动行为的背景，不覆盖主回复人格。")
          ], -1)),
          e("div", va, [
            e("button", {
              class: "btn tonal sm",
              onClick: nt
            }, "今日穿搭"),
            e("button", {
              class: "btn filled sm",
              onClick: Kt,
              disabled: !$.value.title.trim() || !$.value.content.trim()
            }, n($.value.id ? "保存" : "添加"), 9, pa)
          ])
        ]),
        e("div", _a, [
          e("aside", ma, [
            e("button", {
              class: C({ active: xe.value === "" }),
              onClick: t[24] || (t[24] = (l) => xe.value = "")
            }, [
              t[161] || (t[161] = f("全部 ", -1)),
              e("b", null, n((v.value.world || []).length), 1)
            ], 2),
            (a(), o(m, null, y(zt, (l) => e("button", {
              key: l,
              class: C({ active: xe.value === l }),
              onClick: (i) => xe.value = l
            }, n(l), 11, ba)), 64))
          ]),
          e("div", ya, [
            e("article", fa, [
              e("h3", null, n($.value.id ? "编辑条目" : "新增条目"), 1),
              e("div", ga, [
                I(R, {
                  modelValue: $.value.kind,
                  "onUpdate:modelValue": t[25] || (t[25] = (l) => $.value.kind = l),
                  class: "sel",
                  style: { width: "160px" },
                  options: zt,
                  "aria-label": "条目类型"
                }, null, 8, ["modelValue"]),
                u(e("input", {
                  "onUpdate:modelValue": t[26] || (t[26] = (l) => $.value.title = l),
                  class: "field",
                  placeholder: "标题，如 世界观 / 今日穿搭"
                }, null, 512), [
                  [p, $.value.title]
                ])
              ]),
              u(e("textarea", {
                "onUpdate:modelValue": t[27] || (t[27] = (l) => $.value.content = l),
                class: "field area",
                placeholder: "内容…"
              }, null, 512), [
                [p, $.value.content]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[28] || (t[28] = (l) => $.value.tags = l),
                class: "field",
                placeholder: "标签（可选）"
              }, null, 512), [
                [p, $.value.tags]
              ]),
              e("div", ka, [
                e("button", {
                  class: "btn filled sm",
                  onClick: Kt,
                  disabled: !$.value.title.trim() || !$.value.content.trim()
                }, n($.value.id ? "保存" : "添加"), 9, ha),
                $.value.id ? (a(), o("button", {
                  key: 0,
                  class: "btn text sm",
                  onClick: t[29] || (t[29] = (l) => $.value = { id: "", kind: "worldview", title: "", content: "", tags: "" })
                }, "取消编辑")) : d("", !0)
              ])
            ]),
            e("div", wa, [
              (a(!0), o(m, null, y(Rt.value, (l) => (a(), o("article", {
                key: l.id,
                class: "card item-card"
              }, [
                e("div", Ca, [
                  e("strong", null, n(l.title), 1),
                  e("span", xa, n(l.kind), 1)
                ]),
                e("p", $a, n(l.content), 1),
                l.tags ? (a(), o("span", Va, n(l.tags), 1)) : d("", !0),
                e("div", Ua, [
                  e("button", {
                    class: "btn tonal sm",
                    onClick: (i) => es(l)
                  }, "编辑", 8, Sa),
                  e("button", {
                    class: "btn danger sm",
                    onClick: (i) => ts(l.id)
                  }, "删除", 8, Na)
                ])
              ]))), 128)),
              Rt.value.length ? d("", !0) : (a(), o("p", Ta, "还没有条目。"))
            ])
          ])
        ])
      ], 512), [
        [P, c.value === "world"]
      ]),
      u(e("section", ja, [
        e("div", Ma, [
          t[162] || (t[162] = e("div", null, [
            e("h2", null, "用户档案"),
            e("p", { class: "desc" }, "关系阶段、互动表达、未完话题与画像；先看身份，再进入详情。")
          ], -1)),
          e("div", La, [
            u(e("input", {
              "onUpdate:modelValue": t[30] || (t[30] = (l) => Ae.value = l),
              class: "field search",
              placeholder: "搜索用户 ID"
            }, null, 512), [
              [p, Ae.value]
            ]),
            I(R, {
              modelValue: Be.value,
              "onUpdate:modelValue": t[31] || (t[31] = (l) => Be.value = l),
              class: "sel",
              style: { width: "170px" },
              options: Vl.value,
              "aria-label": "阶段筛选"
            }, null, 8, ["modelValue", "options"])
          ])
        ]),
        e("div", Oa, [
          e("aside", Da, [
            e("div", Ea, [
              t[163] || (t[163] = e("span", { class: "eyebrow" }, "PEOPLE", -1)),
              e("span", Fa, n(tt.value.length), 1)
            ]),
            (a(!0), o(m, null, y(tt.value, (l) => (a(), o("button", {
              key: l.user_id,
              class: C(["roster-row", { active: Y.value === l.user_id }]),
              onClick: (i) => lt(l.user_id)
            }, [
              e("span", Pa, n((l.user_id || "?").slice(0, 1).toUpperCase()), 1),
              e("span", Ia, [
                e("span", Ja, [
                  f(n(l.user_id), 1),
                  Ct.value.includes(l.user_id) ? (a(), o("em", Aa, "owner")) : d("", !0)
                ]),
                e("span", Ba, [
                  e("i", {
                    style: _e({ width: qe(l.affinity) })
                  }, null, 4)
                ]),
                e("span", za, n(l.stage) + " · " + n(Math.round((l.affinity || 0) * 100)) + "%", 1)
              ])
            ], 10, qa))), 128)),
            tt.value.length ? d("", !0) : (a(), o("p", Ra, "没有匹配的用户。"))
          ]),
          e("div", Ka, [
            Y.value ? (a(), o("button", {
              key: 0,
              class: "btn text sm",
              onClick: ml
            }, "← 返回目录")) : d("", !0),
            et.value ? (a(), o("div", Ya, "加载中…")) : w.value ? (a(), o(m, { key: 2 }, [
              e("div", Ga, [
                e("span", Ha, n((w.value.user_id || "?").slice(0, 1).toUpperCase()), 1),
                e("div", null, [
                  e("strong", null, n(w.value.user_id), 1),
                  e("span", Wa, "角色 " + n(w.value.role || "other") + " · 阶段 " + n(w.value.relationship?.stage) + " · 互动 " + n(w.value.expression?.interaction) + " · 好感 " + n(Math.round((w.value.relationship?.affinity || 0) * 100)) + "%", 1)
                ])
              ]),
              e("nav", Qa, [
                (a(), o(m, null, y(pl, (l) => e("button", {
                  key: l.key,
                  class: C({ active: fe.value === l.key }),
                  onClick: (i) => fe.value = l.key
                }, n(l.label), 11, Xa)), 64))
              ]),
              fe.value === "overview" ? (a(), o("div", Za, [
                e("div", eo, [
                  e("div", to, [
                    t[164] || (t[164] = e("span", null, "关系事件", -1)),
                    e("b", null, n(w.value.counts?.ledger || 0), 1)
                  ]),
                  e("div", lo, [
                    t[165] || (t[165] = e("span", null, "主动候选", -1)),
                    e("b", null, n(w.value.counts?.candidates || 0), 1)
                  ]),
                  e("div", so, [
                    t[166] || (t[166] = e("span", null, "已投递", -1)),
                    e("b", null, n(w.value.counts?.delivered || 0), 1)
                  ]),
                  e("div", no, [
                    t[167] || (t[167] = e("span", null, "记忆条数", -1)),
                    e("b", null, n(w.value.memories?.total || 0), 1)
                  ]),
                  e("div", ao, [
                    t[168] || (t[168] = e("span", null, "主动额度", -1)),
                    e("b", null, n(w.value.expression?.proactive_limit ?? "—"), 1)
                  ])
                ]),
                we.value?.summary ? (a(), o("div", oo, [
                  t[169] || (t[169] = e("b", null, "画像：", -1)),
                  f(n(we.value.summary), 1),
                  we.value.traits ? (a(), o(m, { key: 0 }, [
                    f(" · " + n(we.value.traits), 1)
                  ], 64)) : d("", !0)
                ])) : d("", !0),
                w.value.expression?.tone ? (a(), o("div", io, [
                  t[170] || (t[170] = e("b", null, "表达基调：", -1)),
                  f(n(w.value.expression.tone), 1)
                ])) : d("", !0),
                t[171] || (t[171] = e("h4", { class: "sub-label" }, "未完话题", -1)),
                e("div", uo, [
                  (a(!0), o(m, null, y(ze.value, (l) => (a(), o("span", {
                    key: l,
                    class: "chip"
                  }, [
                    f(n(l), 1),
                    e("button", {
                      onClick: (i) => yl(l)
                    }, "×", 8, ro)
                  ]))), 128)),
                  ze.value.length ? d("", !0) : (a(), o("span", co, "暂无"))
                ]),
                e("div", vo, [
                  u(e("input", {
                    "onUpdate:modelValue": t[32] || (t[32] = (l) => x.value = l),
                    class: "field",
                    placeholder: "手动加一条待跟进话题…",
                    onKeyup: tl(Nt, ["enter"])
                  }, null, 544), [
                    [p, x.value]
                  ]),
                  e("button", {
                    class: "btn tonal sm",
                    onClick: Nt,
                    disabled: !x.value.trim()
                  }, "加入", 8, po)
                ])
              ])) : fe.value === "relationship" ? (a(), o("div", _o, [
                e("div", mo, [
                  e("i", {
                    style: _e({ width: qe(w.value.relationship?.affinity) })
                  }, null, 4)
                ]),
                e("p", bo, "阶段 " + n(w.value.expression?.stage) + " · 互动 " + n(w.value.expression?.interaction) + " · 额度 " + n(w.value.expression?.proactive_limit) + " · 专属联结 " + n(w.value.expression?.bond ? "是" : "否"), 1),
                e("div", yo, [
                  e("button", {
                    class: "btn tonal sm",
                    onClick: t[33] || (t[33] = (l) => ft(w.value.user_id, 0.05))
                  }, "更亲近 +"),
                  e("button", {
                    class: "btn tonal sm",
                    onClick: t[34] || (t[34] = (l) => ft(w.value.user_id, -0.05))
                  }, "更疏远 −")
                ]),
                t[172] || (t[172] = e("h4", { class: "sub-label" }, "事件账本", -1)),
                e("ol", fo, [
                  (a(!0), o(m, null, y(w.value.ledger, (l) => (a(), o("li", {
                    key: l.id
                  }, [
                    e("span", {
                      class: C(l.delta >= 0 ? "pos" : "neg")
                    }, n(l.delta >= 0 ? "+" : "") + n(l.delta), 3),
                    f(" " + n(l.event_key) + " · " + n(l.reason) + " · " + n(A(l.created_at)), 1)
                  ]))), 128)),
                  (w.value.ledger || []).length ? d("", !0) : (a(), o("li", go, "暂无"))
                ])
              ])) : fe.value === "proactive" ? (a(), o("div", ko, [
                e("ol", ho, [
                  (a(!0), o(m, null, y(w.value.proactive?.candidates || [], (l) => (a(), o("li", {
                    key: l.id
                  }, [
                    e("strong", null, n(l.motive), 1),
                    f(" · " + n(l.status), 1),
                    e("span", wo, n(l.content), 1),
                    ["delivered", "cancelled"].includes(l.status) ? d("", !0) : (a(), o("button", {
                      key: 0,
                      class: "btn danger sm",
                      onClick: (i) => kt(l.id)
                    }, "取消", 8, Co))
                  ]))), 128)),
                  (w.value.proactive?.candidates || []).length ? d("", !0) : (a(), o("li", xo, "暂无"))
                ])
              ])) : fe.value === "memory" ? (a(), o("div", $o, [
                e("ol", Vo, [
                  (a(!0), o(m, null, y(w.value.memories?.items || [], (l) => (a(), o("li", {
                    key: l.id
                  }, [
                    f(n(l.content), 1),
                    e("span", Uo, "scope " + n(l.scope) + " · 重要度 " + n(Math.round((l.importance || 0) * 100)) + "%", 1),
                    e("button", {
                      class: "btn danger sm",
                      onClick: (i) => bl(l.id)
                    }, "删除", 8, So)
                  ]))), 128)),
                  (w.value.memories?.items || []).length ? d("", !0) : (a(), o("li", No, "没有相关记忆"))
                ])
              ])) : (a(), o("div", To, [
                e("ol", jo, [
                  (a(!0), o(m, null, y(w.value.audit || [], (l) => (a(), o("li", {
                    key: l.id
                  }, [
                    e("strong", null, n(l.kind), 1),
                    f(" · " + n(l.outcome), 1),
                    e("span", Mo, n(l.target) + " · " + n(A(l.created_at)), 1)
                  ]))), 128)),
                  (w.value.audit || []).length ? d("", !0) : (a(), o("li", Lo, "暂无"))
                ])
              ]))
            ], 64)) : (a(), o("p", Oo, "从左侧选择一个用户查看详情。"))
          ])
        ])
      ], 512), [
        [P, c.value === "users"]
      ]),
      u(e("section", Do, [
        e("div", Eo, [
          t[173] || (t[173] = e("div", null, [
            e("h2", null, "群聊观察"),
            e("p", { class: "desc" }, "群气氛、话题线、黑话与成员安全。")
          ], -1)),
          e("div", Fo, [
            u(e("input", {
              "onUpdate:modelValue": t[35] || (t[35] = (l) => pt.value = l),
              class: "field search",
              placeholder: "搜索群号 / 备注"
            }, null, 512), [
              [p, pt.value]
            ]),
            e("button", {
              class: "btn tonal sm",
              onClick: Et
            }, "兴趣唤醒一次")
          ])
        ]),
        e("article", qo, [
          e("div", Po, [
            u(e("input", {
              "onUpdate:modelValue": t[36] || (t[36] = (l) => G.value.group_id = l),
              class: "field",
              placeholder: "群号"
            }, null, 512), [
              [p, G.value.group_id]
            ]),
            I(R, {
              modelValue: G.value.policy,
              "onUpdate:modelValue": t[37] || (t[37] = (l) => G.value.policy = l),
              class: "sel",
              style: { width: "140px" },
              options: Mt,
              "aria-label": "群策略"
            }, null, 8, ["modelValue"]),
            u(e("input", {
              "onUpdate:modelValue": t[38] || (t[38] = (l) => G.value.alias = l),
              class: "field",
              placeholder: "备注名（可选）"
            }, null, 512), [
              [p, G.value.alias]
            ]),
            e("button", {
              class: "btn filled sm",
              onClick: Ml,
              disabled: !G.value.group_id.trim()
            }, "添加群", 8, Io)
          ]),
          e("div", Jo, [
            (a(!0), o(m, null, y(Gt.value, (l) => (a(), o("article", {
              key: l.group_id,
              class: "card sub"
            }, [
              e("div", Ao, [
                e("strong", null, n(l.group_id), 1),
                l.alias ? (a(), o("span", Bo, n(l.alias), 1)) : d("", !0),
                e("span", {
                  class: C(["chip", l.policy === "blacklist" ? "danger" : l.policy === "whitelist" ? "ok" : "muted"])
                }, n(l.policy), 3)
              ]),
              e("span", zo, [
                f(n(l.observations) + " 条观察 · " + n(l.topics) + " 个话题", 1),
                je.value[l.group_id] ? (a(), o(m, { key: 0 }, [
                  f(" · 气氛 " + n(je.value[l.group_id].label), 1)
                ], 64)) : d("", !0)
              ]),
              ee.value === l.group_id ? (a(), o("div", Ro, [
                t[174] || (t[174] = e("h4", { class: "sub-label" }, "话题线", -1)),
                e("div", Ko, [
                  (a(!0), o(m, null, y(je.value[l.group_id]?.threads || [], (i) => (a(), o("span", {
                    key: i.topic,
                    class: "chip muted"
                  }, n(i.topic) + " · " + n(Math.round(i.score)), 1))), 128)),
                  (je.value[l.group_id]?.threads || []).length ? d("", !0) : (a(), o("span", Yo, "暂无"))
                ]),
                t[175] || (t[175] = e("h4", { class: "sub-label" }, "黑话 / 话题", -1)),
                e("div", Go, [
                  (a(!0), o(m, null, y(Ot.value[l.group_id] || [], (i) => (a(), o("span", {
                    key: i.topic,
                    class: "chip muted"
                  }, [
                    f(n(i.topic) + " · " + n(Math.round(i.score)), 1),
                    e("button", {
                      onClick: (M) => ql(l.group_id, i.topic)
                    }, "×", 8, Ho)
                  ]))), 128))
                ]),
                e("div", Wo, [
                  u(e("input", {
                    "onUpdate:modelValue": (i) => Ge.value[l.group_id] = i,
                    class: "field",
                    placeholder: "新增黑话 / 话题"
                  }, null, 8, Qo), [
                    [p, Ge.value[l.group_id]]
                  ]),
                  e("button", {
                    class: "btn tonal sm",
                    onClick: (i) => Fl(l.group_id)
                  }, "添加", 8, Xo)
                ]),
                t[176] || (t[176] = e("h4", { class: "sub-label" }, "成员安全", -1)),
                e("div", Zo, [
                  (a(!0), o(m, null, y(Dt.value[l.group_id] || [], (i) => (a(), o("div", {
                    key: i.user_id,
                    class: "member"
                  }, [
                    e("span", null, n(i.user_id), 1),
                    e("span", ei, n(i.messages) + " 条", 1),
                    I(R, {
                      "model-value": i.flag,
                      class: "sel-tiny",
                      style: { width: "108px" },
                      options: $l,
                      "aria-label": "成员标记",
                      "onUpdate:modelValue": (M) => Dl(l.group_id, i.user_id, M)
                    }, null, 8, ["model-value", "onUpdate:modelValue"])
                  ]))), 128))
                ])
              ])) : d("", !0),
              e("div", ti, [
                I(R, {
                  "model-value": l.policy,
                  class: "sel-tiny",
                  style: { width: "124px" },
                  options: Mt,
                  "aria-label": "群策略",
                  "onUpdate:modelValue": (i) => Ol(l, i)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                e("button", {
                  class: "btn tonal sm",
                  onClick: (i) => El(l.group_id)
                }, n(ee.value === l.group_id ? "收起" : "管理"), 9, li),
                e("button", {
                  class: "btn danger sm",
                  onClick: (i) => Ll(l.group_id)
                }, "删除", 8, si)
              ])
            ]))), 128)),
            Gt.value.length ? d("", !0) : (a(), o("p", ni, "还没有群记录。"))
          ])
        ])
      ], 512), [
        [P, c.value === "groups"]
      ]),
      u(e("section", ai, [
        t[184] || (t[184] = e("div", { class: "section-head" }, [
          e("div", null, [
            e("h2", null, "学习"),
            e("p", { class: "desc" }, "技能成长、表达学习与社交关系网。")
          ])
        ], -1)),
        e("div", oi, [
          e("article", ii, [
            e("h3", null, [
              t[177] || (t[177] = f("技能学习 ", -1)),
              e("span", ui, n((v.value.skills || []).length), 1)
            ]),
            e("div", di, [
              u(e("input", {
                "onUpdate:modelValue": t[39] || (t[39] = (l) => B.value.name = l),
                class: "field",
                placeholder: "技能，如 弹钢琴"
              }, null, 512), [
                [p, B.value.name]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[40] || (t[40] = (l) => B.value.level = l),
                type: "number",
                min: "1",
                max: "10",
                class: "field tiny"
              }, null, 512), [
                [
                  p,
                  B.value.level,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            u(e("input", {
              "onUpdate:modelValue": t[41] || (t[41] = (l) => B.value.keywords = l),
              class: "field",
              placeholder: "关键词（逗号分隔，可选）"
            }, null, 512), [
              [p, B.value.keywords]
            ]),
            e("button", {
              class: "btn filled sm",
              onClick: Pl,
              disabled: !B.value.name.trim()
            }, "添加技能", 8, ri),
            e("ol", ci, [
              (a(!0), o(m, null, y(v.value.skills, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", null, n(l.name), 1),
                t[178] || (t[178] = f()),
                e("span", vi, "Lv." + n(l.level), 1),
                f(" " + n(l.category), 1),
                e("div", pi, [
                  e("button", {
                    class: "btn tonal sm",
                    onClick: (i) => Il(l.name)
                  }, "练习 +1", 8, _i),
                  e("button", {
                    class: "btn danger sm",
                    onClick: (i) => Jl(l.id)
                  }, "删除", 8, mi)
                ])
              ]))), 128)),
              (v.value.skills || []).length ? d("", !0) : (a(), o("li", bi, "还没有技能"))
            ])
          ]),
          e("article", yi, [
            t[180] || (t[180] = e("h3", null, "表达学习", -1)),
            e("div", fi, [
              e("button", {
                class: C({ active: ke.value === "pending" }),
                onClick: t[42] || (t[42] = (l) => ke.value = "pending")
              }, "待审 " + n(at.value.pending), 3),
              e("button", {
                class: C({ active: ke.value === "approved" }),
                onClick: t[43] || (t[43] = (l) => ke.value = "approved")
              }, "已用 " + n(at.value.approved), 3),
              e("button", {
                class: C({ active: ke.value === "rejected" }),
                onClick: t[44] || (t[44] = (l) => ke.value = "rejected")
              }, "已拒 " + n(at.value.rejected), 3)
            ]),
            e("div", gi, [
              u(e("input", {
                "onUpdate:modelValue": t[45] || (t[45] = (l) => ce.value.text = l),
                class: "field",
                placeholder: "表达，如 晚安呀"
              }, null, 512), [
                [p, ce.value.text]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[46] || (t[46] = (l) => ce.value.scene = l),
                class: "field",
                style: { "max-width": "120px" },
                placeholder: "场景"
              }, null, 512), [
                [p, ce.value.scene]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: Al,
                disabled: !ce.value.text.trim()
              }, "入库", 8, ki)
            ]),
            e("ol", hi, [
              (a(!0), o(m, null, y(Ft.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", null, n(l.text), 1),
                t[179] || (t[179] = f()),
                e("span", wi, n(l.scene || "通用") + " · " + n(l.source), 1),
                e("div", Ci, [
                  l.status === "pending" ? (a(), o("button", {
                    key: 0,
                    class: "btn tonal sm",
                    onClick: (i) => qt(l.id, !0)
                  }, "采用", 8, xi)) : d("", !0),
                  l.status === "pending" ? (a(), o("button", {
                    key: 1,
                    class: "btn text sm",
                    onClick: (i) => qt(l.id, !1)
                  }, "拒绝", 8, $i)) : d("", !0),
                  e("button", {
                    class: "btn danger sm",
                    onClick: (i) => Bl(l.id)
                  }, "删除", 8, Vi)
                ])
              ]))), 128)),
              Ft.value.length ? d("", !0) : (a(), o("li", Ui, "该分类下没有表达"))
            ])
          ]),
          e("article", Si, [
            e("h3", null, [
              t[181] || (t[181] = f("社交关系网 ", -1)),
              e("span", Ni, n((v.value.social_nodes || []).length) + " / " + n((v.value.social_edges || []).length), 1)
            ]),
            e("div", Ti, [
              u(e("input", {
                "onUpdate:modelValue": t[47] || (t[47] = (l) => ve.value.user_id = l),
                class: "field",
                placeholder: "用户 ID"
              }, null, 512), [
                [p, ve.value.user_id]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[48] || (t[48] = (l) => ve.value.name = l),
                class: "field",
                placeholder: "称呼（可选）"
              }, null, 512), [
                [p, ve.value.name]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: zl,
                disabled: !ve.value.user_id.trim()
              }, "加入", 8, ji)
            ]),
            e("ol", Mi, [
              (a(!0), o(m, null, y(v.value.social_nodes, (l) => (a(), o("li", {
                key: l.user_id
              }, [
                e("strong", null, n(l.name || l.user_id), 1),
                t[182] || (t[182] = f()),
                e("span", Li, n(l.user_id), 1)
              ]))), 128)),
              (v.value.social_nodes || []).length ? d("", !0) : (a(), o("li", Oi, "关系网还是空的"))
            ]),
            t[183] || (t[183] = e("h4", { class: "sub-label" }, "关系连线", -1)),
            e("div", Di, [
              u(e("input", {
                "onUpdate:modelValue": t[49] || (t[49] = (l) => H.value.source_id = l),
                class: "field",
                placeholder: "A"
              }, null, 512), [
                [p, H.value.source_id]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[50] || (t[50] = (l) => H.value.target_id = l),
                class: "field",
                placeholder: "B"
              }, null, 512), [
                [p, H.value.target_id]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[51] || (t[51] = (l) => H.value.relation = l),
                class: "field",
                placeholder: "关系"
              }, null, 512), [
                [p, H.value.relation]
              ]),
              e("button", {
                class: "btn tonal sm",
                onClick: Rl
              }, "连线")
            ]),
            e("ol", Ei, [
              (a(!0), o(m, null, y(v.value.social_edges, (l) => (a(), o("li", {
                key: l.id
              }, [
                f(n(l.source_id) + " → " + n(l.target_id) + " · " + n(l.relation) + " ", 1),
                e("button", {
                  class: "btn danger sm",
                  onClick: (i) => Kl(l.id)
                }, "×", 8, Fi)
              ]))), 128)),
              (v.value.social_edges || []).length ? d("", !0) : (a(), o("li", qi, "还没有连线"))
            ])
          ])
        ])
      ], 512), [
        [P, c.value === "learning"]
      ]),
      u(e("section", Pi, [
        e("div", Ii, [
          t[185] || (t[185] = e("div", null, [
            e("h2", null, "观察"),
            e("p", { class: "desc" }, "日程日历、目标、性格演化、未完话题、画像与自我时间线。")
          ], -1)),
          e("div", Ji, [
            e("button", {
              class: "btn tonal sm",
              onClick: t[52] || (t[52] = (l) => $t(-1))
            }, "←"),
            e("strong", null, n(Te.value), 1),
            e("button", {
              class: "btn tonal sm",
              onClick: t[53] || (t[53] = (l) => $t(1))
            }, "→")
          ])
        ]),
        e("div", Ai, [
          e("article", Bi, [
            e("div", zi, [
              (a(), o(m, null, y(["日", "一", "二", "三", "四", "五", "六"], (l) => e("span", { key: l }, n(l), 1)), 64))
            ]),
            e("div", Ri, [
              (a(!0), o(m, null, y(fl.value, (l) => (a(), o("div", {
                key: l.key,
                class: C(["cal-cell", { empty: l.empty, today: l.today, has: l.events?.length }])
              }, [
                l.empty ? d("", !0) : (a(), o("span", Ki, n(l.day), 1)),
                (a(!0), o(m, null, y((l.events || []).slice(0, 2), (i) => (a(), o("span", {
                  key: i.id,
                  class: "cal-chip"
                }, n(i.title), 1))), 128)),
                (l.events || []).length > 2 ? (a(), o("span", Yi, "+" + n(l.events.length - 2), 1)) : d("", !0)
              ], 2))), 128))
            ]),
            de.value.conflicts?.length ? (a(), o("p", Gi, "⚠ " + n(de.value.conflicts.length) + " 处时间冲突：" + n(de.value.conflicts.map((l) => l.titles.join(" / ")).join("；")), 1)) : d("", !0),
            e("h4", Hi, "本月待确认候选 (" + n(de.value.candidates?.length || 0) + ")", 1),
            e("ol", Wi, [
              (a(!0), o(m, null, y((de.value.candidates || []).slice(0, 8), (l) => (a(), o("li", {
                key: l.id
              }, [
                f(n(l.title) + " · " + n(l.when_text) + " ", 1),
                e("div", Qi, [
                  e("button", {
                    class: "btn filled sm",
                    onClick: (i) => b("confirm_agenda", { id: l.id }).then(Ke)
                  }, "确认", 8, Xi),
                  e("button", {
                    class: "btn text sm",
                    onClick: (i) => b("reject_agenda", { id: l.id }).then(Ke)
                  }, "拒绝", 8, Zi)
                ])
              ]))), 128)),
              (de.value.candidates || []).length ? d("", !0) : (a(), o("li", eu, "没有待确认候选"))
            ])
          ]),
          e("article", tu, [
            t[186] || (t[186] = e("h3", null, "近 14 天活跃", -1)),
            e("div", lu, [
              (a(!0), o(m, null, y(Tt.value, (l) => (a(), o("div", {
                key: l.day,
                class: "spark-col",
                title: `${l.day} · ${l.count}`
              }, [
                e("i", {
                  style: _e({ height: Math.max(4, Math.round(l.count / xl.value * 100)) + "%" })
                }, null, 4),
                e("span", null, n(l.day), 1)
              ], 8, su))), 128))
            ]),
            t[187] || (t[187] = e("p", { class: "hint" }, "来自 Bot 自我时间线（日记/梦境/任务/主动/见闻）。", -1))
          ]),
          e("article", nu, [
            e("h3", null, [
              t[188] || (t[188] = f("个人目标 ", -1)),
              e("span", au, n((v.value.goals || []).length), 1)
            ]),
            e("div", ou, [
              u(e("input", {
                "onUpdate:modelValue": t[54] || (t[54] = (l) => Ce.value.title = l),
                class: "field",
                placeholder: "目标，如 学会一首钢琴曲"
              }, null, 512), [
                [p, Ce.value.title]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: gl,
                disabled: !Ce.value.title.trim()
              }, "添加", 8, iu)
            ]),
            e("ol", uu, [
              (a(!0), o(m, null, y(v.value.goals, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", {
                  class: C({ done: l.status === "done" })
                }, n(l.title), 3),
                e("span", du, [
                  e("i", {
                    style: _e({ width: qe(l.progress) })
                  }, null, 4)
                ]),
                e("div", ru, [
                  u(e("input", {
                    "onUpdate:modelValue": (i) => Re.value[l.id] = i,
                    class: "field",
                    placeholder: "记录一次进展…"
                  }, null, 8, cu), [
                    [p, Re.value[l.id]]
                  ]),
                  e("button", {
                    class: "btn tonal sm",
                    onClick: (i) => kl(l.id)
                  }, "记一笔", 8, vu),
                  e("button", {
                    class: "btn text sm",
                    onClick: (i) => Vt(l.id)
                  }, "日志", 8, pu)
                ]),
                st.value[l.id]?.length ? (a(), o("ol", _u, [
                  (a(!0), o(m, null, y(st.value[l.id], (i) => (a(), o("li", {
                    key: i.id,
                    class: "meta"
                  }, n(i.evidence) + " · " + n(A(i.created_at)), 1))), 128))
                ])) : d("", !0)
              ]))), 128)),
              (v.value.goals || []).length ? d("", !0) : (a(), o("li", mu, "还没有目标"))
            ])
          ]),
          e("article", bu, [
            t[190] || (t[190] = e("h3", null, "成长中的性格", -1)),
            e("ol", yu, [
              (a(!0), o(m, null, y(v.value.persona_evolution, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", null, n(l.trait), 1),
                t[189] || (t[189] = f()),
                e("span", fu, n(l.value), 1),
                e("span", gu, "支持 " + n(l.support_count) + " · 置信 " + n(Math.round((l.confidence || 0) * 100)) + "%", 1)
              ]))), 128)),
              v.value.persona_evolution?.length ? d("", !0) : (a(), o("li", ku, "LIFE 还在观察。"))
            ])
          ]),
          e("article", hu, [
            e("h3", null, [
              t[191] || (t[191] = f("未完话题 ", -1)),
              e("span", wu, n(Le.value.length), 1)
            ]),
            e("ol", Cu, [
              (a(!0), o(m, null, y(Le.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", null, n(l.topic), 1),
                e("span", xu, n(l.user_id) + " · " + n(A(l.updated_at)), 1),
                e("button", {
                  class: "btn tonal sm",
                  onClick: (i) => {
                    lt(l.user_id), D("users");
                  }
                }, "查看用户", 8, $u)
              ]))), 128)),
              Le.value.length ? d("", !0) : (a(), o("li", Vu, "没有待跟进的话题。"))
            ])
          ]),
          e("article", Uu, [
            e("h3", null, [
              t[192] || (t[192] = f("轻量画像 ", -1)),
              e("span", Su, n(dt.value.length), 1)
            ]),
            e("ol", Nu, [
              (a(!0), o(m, null, y(dt.value, (l) => (a(), o("li", {
                key: l.user_id
              }, [
                e("strong", null, n(l.user_id), 1),
                e("span", Tu, [
                  f(n(l.summary), 1),
                  l.traits ? (a(), o(m, { key: 0 }, [
                    f(" · " + n(l.traits), 1)
                  ], 64)) : d("", !0)
                ])
              ]))), 128)),
              dt.value.length ? d("", !0) : (a(), o("li", ju, "还没有稳定画像。"))
            ])
          ]),
          e("article", Mu, [
            e("h3", null, [
              t[193] || (t[193] = f("Bot 自我时间线 ", -1)),
              e("span", Lu, n(vt.value.length) + "/" + n($e.value.length), 1),
              u(e("input", {
                "onUpdate:modelValue": t[55] || (t[55] = (l) => ct.value = l),
                class: "field search",
                style: { "margin-left": "auto" },
                placeholder: "搜索时间线"
              }, null, 512), [
                [p, ct.value]
              ])
            ]),
            e("ol", Ou, [
              (a(!0), o(m, null, y(vt.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("time", null, n(A(l.created_at).slice(5, 16)), 1),
                e("div", null, [
                  e("strong", null, n(l.topic), 1),
                  e("span", Du, n(l.summary), 1)
                ])
              ]))), 128)),
              vt.value.length ? d("", !0) : (a(), o("li", Eu, "没有匹配的记录。"))
            ])
          ]),
          e("article", Fu, [
            t[200] || (t[200] = e("h3", null, "情绪雷达", -1)),
            e("div", qu, [
              (a(), o("svg", Pu, [
                t[194] || (t[194] = e("polygon", {
                  points: "60,14 106,60 60,106 14,60",
                  class: "radar-grid"
                }, null, -1)),
                t[195] || (t[195] = e("polygon", {
                  points: "60,37 83,60 60,83 37,60",
                  class: "radar-grid"
                }, null, -1)),
                e("polygon", {
                  points: ls.value,
                  class: "radar-fill"
                }, null, 8, Iu),
                t[196] || (t[196] = e("text", {
                  x: "60",
                  y: "10",
                  class: "radar-lbl",
                  "text-anchor": "middle"
                }, "心情", -1)),
                t[197] || (t[197] = e("text", {
                  x: "112",
                  y: "63",
                  class: "radar-lbl",
                  "text-anchor": "end"
                }, "激活", -1)),
                t[198] || (t[198] = e("text", {
                  x: "60",
                  y: "119",
                  class: "radar-lbl",
                  "text-anchor": "middle"
                }, "连接", -1)),
                t[199] || (t[199] = e("text", {
                  x: "8",
                  y: "63",
                  class: "radar-lbl"
                }, "烦扰", -1))
              ])),
              e("p", Ju, "心情 " + n(Math.round((Oe.value.valence + 1) / 2 * 100)) + "% · 激活 " + n(Math.round(Oe.value.arousal * 100)) + "% · 连接 " + n(Math.round(Oe.value.connection * 100)) + "% · 烦扰 " + n(Math.round(Oe.value.irritation * 100)) + "%", 1)
            ])
          ]),
          e("article", Au, [
            e("h3", null, [
              t[201] || (t[201] = f("每日复盘 ", -1)),
              e("span", Bu, n(rt.value.length), 1),
              e("button", {
                class: "btn tonal sm",
                style: { "margin-left": "auto" },
                onClick: t[56] || (t[56] = (l) => b("daily_review", {}))
              }, "立即复盘")
            ]),
            e("ol", zu, [
              (a(!0), o(m, null, y(rt.value, (l) => (a(), o("li", {
                key: l.date
              }, [
                e("strong", null, n(l.date), 1),
                e("span", Ru, n(l.summary), 1),
                Yt(l).length ? (a(), o("ul", Ku, [
                  (a(!0), o(m, null, y(Yt(l), (i, M) => (a(), o("li", { key: M }, [
                    e("span", {
                      class: C(["chip", i.level === "warn" ? "warn" : "muted"])
                    }, n(i.title), 3),
                    e("span", Yu, n(i.detail), 1)
                  ]))), 128))
                ])) : d("", !0)
              ]))), 128)),
              rt.value.length ? d("", !0) : (a(), o("li", Gu, "还没有复盘记录；每天会自动生成一次。"))
            ])
          ])
        ])
      ], 512), [
        [P, c.value === "observe"]
      ]),
      u(e("section", Hu, [
        e("div", Wu, [
          t[202] || (t[202] = e("div", null, [
            e("h2", null, "主动行为"),
            e("p", { class: "desc" }, "候选、投递时机、配额与未回应降速。")
          ], -1)),
          e("div", Qu, [
            e("button", {
              class: "btn tonal sm",
              onClick: ol
            }, "让 LIFE 建议一条"),
            e("button", {
              class: "btn tonal sm",
              disabled: Ie.value,
              onClick: il
            }, n(Ie.value ? "检查中…" : "立即检查投递"), 9, Xu)
          ])
        ]),
        e("div", Zu, [
          e("article", ed, [
            e("h3", null, [
              t[203] || (t[203] = f("候选队列 ", -1)),
              e("span", td, n(ie.value.length), 1)
            ]),
            e("div", ld, [
              I(R, {
                modelValue: K.value,
                "onUpdate:modelValue": t[57] || (t[57] = (l) => K.value = l),
                style: { flex: "1", "min-width": "200px" },
                options: Nl.value,
                "aria-label": "发送目标"
              }, null, 8, ["modelValue", "options"]),
              K.value === "__manual__" ? u((a(), o("input", {
                key: 0,
                "onUpdate:modelValue": t[58] || (t[58] = (l) => J.value = l),
                class: "field",
                placeholder: "session:<会话ID> / user:<QQ> / group:<群号>"
              }, null, 512)), [
                [p, J.value]
              ]) : d("", !0)
            ]),
            e("div", sd, [
              u(e("input", {
                "onUpdate:modelValue": t[59] || (t[59] = (l) => N.value.motive = l),
                class: "field",
                placeholder: "动机，如 care"
              }, null, 512), [
                [p, N.value.motive]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[60] || (t[60] = (l) => N.value.preferred_at = l),
                class: "field",
                placeholder: "期望时间（ISO，可选）"
              }, null, 512), [
                [p, N.value.preferred_at]
              ])
            ]),
            u(e("textarea", {
              "onUpdate:modelValue": t[61] || (t[61] = (l) => N.value.content = l),
              class: "field area",
              placeholder: "想说的内容…"
            }, null, 512), [
              [p, N.value.content]
            ]),
            e("button", {
              class: "btn filled sm",
              onClick: nl,
              disabled: !N.value.target.trim() || !N.value.content.trim()
            }, "创建候选", 8, nd),
            e("ol", ad, [
              (a(!0), o(m, null, y(ie.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("strong", null, n(l.target) + " · " + n(l.motive), 1),
                e("span", od, n(l.content), 1),
                e("span", id, [
                  f("窗口 " + n(A(l.preferred_at)), 1),
                  l.best_until ? (a(), o(m, { key: 0 }, [
                    f(" → " + n(A(l.best_until)), 1)
                  ], 64)) : d("", !0)
                ]),
                e("button", {
                  class: "btn danger sm",
                  onClick: (i) => kt(l.id)
                }, "取消", 8, ud)
              ]))), 128)),
              ie.value.length ? d("", !0) : (a(), o("li", dd, "没有待投递候选"))
            ])
          ]),
          e("article", rd, [
            t[204] || (t[204] = e("h3", null, "投递记录", -1)),
            e("ol", cd, [
              (a(!0), o(m, null, y(Fe.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                f(n(l.phase) + " · " + n(l.content), 1),
                e("span", vd, n(A(l.created_at)), 1)
              ]))), 128)),
              Fe.value.length ? d("", !0) : (a(), o("li", pd, "还没有投递记录"))
            ])
          ])
        ])
      ], 512), [
        [P, c.value === "proactive"]
      ]),
      u(e("section", _d, [
        e("div", { class: "section-head" }, [
          t[205] || (t[205] = e("div", null, [
            e("h2", null, "Token 用量"),
            e("p", { class: "desc" }, "模型调用与 token 统计。")
          ], -1)),
          e("div", { class: "head-actions" }, [
            e("button", {
              class: "btn tonal sm",
              onClick: mt
            }, "刷新")
          ])
        ]),
        e("div", md, [
          e("article", bd, [
            e("b", null, n((ue.value?.total_tokens || 0).toLocaleString()), 1),
            t[206] || (t[206] = e("span", null, "总 Token", -1))
          ]),
          e("article", yd, [
            e("b", null, n((ue.value?.total_prompt_tokens || 0).toLocaleString()), 1),
            t[207] || (t[207] = e("span", null, "输入", -1))
          ]),
          e("article", fd, [
            e("b", null, n((ue.value?.total_completion_tokens || 0).toLocaleString()), 1),
            t[208] || (t[208] = e("span", null, "输出", -1))
          ]),
          e("article", gd, [
            e("b", null, n(ue.value?.request_count || 0), 1),
            t[209] || (t[209] = e("span", null, "请求次数", -1))
          ])
        ]),
        e("article", kd, [
          t[211] || (t[211] = e("h3", null, "按模型", -1)),
          e("ol", hd, [
            (a(!0), o(m, null, y(ue.value?.by_model || {}, (l, i) => (a(), o("li", { key: i }, [
              e("strong", null, n(i), 1),
              t[210] || (t[210] = f()),
              e("span", wd, n((l.total || 0).toLocaleString()) + " tokens · " + n(l.count) + " 次", 1)
            ]))), 128)),
            !ue.value || !Object.keys(ue.value.by_model || {}).length ? (a(), o("li", Cd, "暂无用量记录")) : d("", !0)
          ])
        ])
      ], 512), [
        [P, c.value === "tokens"]
      ]),
      u(e("section", xd, [
        e("div", $d, [
          t[212] || (t[212] = e("div", null, [
            e("h2", null, "排障与审计"),
            e("p", { class: "desc" }, "运行检查、主动行为审计与记忆维护。")
          ], -1)),
          e("div", Vd, [
            e("button", {
              class: "btn tonal sm",
              onClick: Zl
            }, "运行诊断"),
            e("button", {
              class: "btn tonal sm",
              onClick: t[62] || (t[62] = (l) => b("memory_maintenance", {}))
            }, "记忆维护"),
            e("button", {
              class: "btn tonal sm",
              onClick: ns
            }, "备份数据")
          ])
        ]),
        e("div", Ud, [
          e("article", Sd, [
            t[213] || (t[213] = e("h3", null, "运行检查", -1)),
            e("ol", Nd, [
              (a(!0), o(m, null, y(Me.value?.checks || [], (l) => (a(), o("li", {
                key: l.name
              }, [
                e("strong", null, n(l.name), 1),
                e("span", Td, n(l.detail), 1),
                e("span", {
                  class: C(["chip", l.status === "ok" ? "ok" : l.status === "warn" ? "warn" : "muted"])
                }, n(l.status), 3)
              ]))), 128)),
              Me.value ? d("", !0) : (a(), o("li", jd, "点击运行诊断"))
            ]),
            Me.value ? (a(), o("div", Md, [
              (a(!0), o(m, null, y(Me.value.counts, (l, i) => (a(), o("div", {
                key: i,
                class: "kv"
              }, [
                e("span", null, n(i), 1),
                e("b", null, n(l), 1)
              ]))), 128))
            ])) : d("", !0)
          ]),
          e("article", Ld, [
            e("h3", null, [
              t[214] || (t[214] = f("主动行为审计 ", -1)),
              e("span", Od, n(At.value), 1)
            ]),
            e("div", Dd, [
              u(e("input", {
                "onUpdate:modelValue": t[63] || (t[63] = (l) => ot.value = l),
                class: "field",
                placeholder: "类型筛选"
              }, null, 512), [
                [p, ot.value]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[64] || (t[64] = (l) => it.value = l),
                class: "field",
                placeholder: "结果"
              }, null, 512), [
                [p, it.value]
              ]),
              e("button", {
                class: "btn tonal sm",
                onClick: Bt
              }, "查询")
            ]),
            e("ol", Ed, [
              (a(!0), o(m, null, y(ut.value, (l) => (a(), o("li", {
                key: l.id
              }, [
                e("time", null, n(A(l.created_at).slice(5, 16)), 1),
                e("div", null, [
                  e("strong", null, n(l.kind), 1),
                  t[215] || (t[215] = f()),
                  e("span", {
                    class: C(["chip", l.outcome === "ok" ? "ok" : "warn"])
                  }, n(l.outcome), 3),
                  e("span", Fd, n(l.target), 1),
                  l.detail ? (a(), o("p", qd, n(l.detail), 1)) : d("", !0)
                ])
              ]))), 128)),
              ut.value.length ? d("", !0) : (a(), o("li", Pd, "暂无审计记录"))
            ])
          ])
        ])
      ], 512), [
        [P, c.value === "troubleshooting"]
      ]),
      u(e("section", Id, [
        e("div", { class: "section-head" }, [
          t[216] || (t[216] = e("div", null, [
            e("h2", null, "配置"),
            e("p", { class: "desc" }, "运行设置、用户边界、环境与内容、导入导出。")
          ], -1)),
          e("div", { class: "head-actions" }, [
            e("button", {
              class: "btn filled sm",
              onClick: Gl
            }, "保存")
          ])
        ]),
        e("div", Jd, [
          e("article", Ad, [
            t[237] || (t[237] = e("h3", null, "主动行为", -1)),
            e("div", Bd, [
              e("label", null, [
                t[217] || (t[217] = e("span", null, "每日主动上限", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[65] || (t[65] = (l) => _.value.proactive_daily_limit = l),
                  type: "number",
                  min: "0",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.proactive_daily_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[218] || (t[218] = e("span", null, "单人上限", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[66] || (t[66] = (l) => _.value.proactive_target_limit = l),
                  type: "number",
                  min: "0",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.proactive_target_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[219] || (t[219] = e("span", null, "免打扰起", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[67] || (t[67] = (l) => _.value.quiet_start = l),
                  type: "number",
                  min: "0",
                  max: "23",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.quiet_start,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[220] || (t[220] = e("span", null, "免打扰止", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[68] || (t[68] = (l) => _.value.quiet_end = l),
                  type: "number",
                  min: "0",
                  max: "23",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.quiet_end,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[221] || (t[221] = e("span", null, "空闲分钟", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[69] || (t[69] = (l) => _.value.idle_minutes = l),
                  type: "number",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.idle_minutes,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[222] || (t[222] = e("span", null, "最小间隔(分)", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[70] || (t[70] = (l) => _.value.min_interval_minutes = l),
                  type: "number",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.min_interval_minutes,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[223] || (t[223] = e("span", null, "检查间隔(秒)", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[71] || (t[71] = (l) => _.value.check_interval_seconds = l),
                  type: "number",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.check_interval_seconds,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[224] || (t[224] = e("span", null, "连发上限", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[72] || (t[72] = (l) => _.value.burst_max = l),
                  type: "number",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.burst_max,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[225] || (t[225] = e("span", null, "每日 Token", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[73] || (t[73] = (l) => _.value.daily_token_limit = l),
                  type: "number",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.daily_token_limit,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            e("div", zd, [
              e("label", Rd, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[74] || (t[74] = (l) => _.value.enable_proactive = l)
                }, null, 512), [
                  [pe, _.value.enable_proactive]
                ]),
                t[226] || (t[226] = e("span", null, "启用主动消息", -1))
              ]),
              e("label", Kd, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[75] || (t[75] = (l) => _.value.enable_group_observe = l)
                }, null, 512), [
                  [pe, _.value.enable_group_observe]
                ]),
                t[227] || (t[227] = e("span", null, "群聊观察", -1))
              ]),
              e("label", Yd, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[76] || (t[76] = (l) => _.value.enable_dream = l)
                }, null, 512), [
                  [pe, _.value.enable_dream]
                ]),
                t[228] || (t[228] = e("span", null, "梦境生成", -1))
              ]),
              e("label", Gd, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[77] || (t[77] = (l) => _.value.reply_deceleration = l)
                }, null, 512), [
                  [pe, _.value.reply_deceleration]
                ]),
                t[229] || (t[229] = e("span", null, "未回应降速", -1))
              ])
            ]),
            t[238] || (t[238] = e("h4", { class: "sub-label" }, "用户边界", -1)),
            e("div", Hd, [
              e("label", Wd, [
                t[230] || (t[230] = e("span", null, "主要用户 ID（逗号分隔）", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[78] || (t[78] = (l) => _.value.owner_user_ids = l),
                  class: "field"
                }, null, 512), [
                  [p, _.value.owner_user_ids]
                ])
              ]),
              e("label", Qd, [
                t[231] || (t[231] = e("span", null, "次要用户 ID（逗号分隔）", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[79] || (t[79] = (l) => _.value.secondary_user_ids = l),
                  class: "field"
                }, null, 512), [
                  [p, _.value.secondary_user_ids]
                ])
              ]),
              e("label", null, [
                t[232] || (t[232] = e("span", null, "普通用户阶段上限", -1)),
                I(R, {
                  modelValue: _.value.other_stage_cap,
                  "onUpdate:modelValue": t[80] || (t[80] = (l) => _.value.other_stage_cap = l),
                  options: Lt,
                  "aria-label": "普通用户阶段上限"
                }, null, 8, ["modelValue"])
              ]),
              e("label", null, [
                t[233] || (t[233] = e("span", null, "次要用户阶段上限", -1)),
                I(R, {
                  modelValue: _.value.secondary_stage_cap,
                  "onUpdate:modelValue": t[81] || (t[81] = (l) => _.value.secondary_stage_cap = l),
                  options: Lt,
                  "aria-label": "次要用户阶段上限"
                }, null, 8, ["modelValue"])
              ]),
              e("label", null, [
                t[234] || (t[234] = e("span", null, "好感回落/天", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[82] || (t[82] = (l) => _.value.affinity_decay_per_day = l),
                  type: "number",
                  step: "0.01",
                  min: "0",
                  max: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.affinity_decay_per_day,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[235] || (t[235] = e("span", null, "未互动多久才回落(天)", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[83] || (t[83] = (l) => _.value.affinity_decay_after_days = l),
                  type: "number",
                  min: "0",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.affinity_decay_after_days,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ])
            ]),
            e("label", Xd, [
              u(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": t[84] || (t[84] = (l) => _.value.enable_exclusive_bond = l)
              }, null, 512), [
                [pe, _.value.enable_exclusive_bond]
              ]),
              t[236] || (t[236] = e("span", null, "允许主要用户的专属联结", -1))
            ])
          ]),
          e("article", Zd, [
            t[248] || (t[248] = e("h3", null, "环境与内容", -1)),
            e("div", er, [
              e("label", null, [
                t[239] || (t[239] = e("span", null, "时区", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[85] || (t[85] = (l) => _.value.env_timezone = l),
                  class: "field"
                }, null, 512), [
                  [p, _.value.env_timezone]
                ])
              ]),
              e("label", null, [
                t[240] || (t[240] = e("span", null, "城市", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[86] || (t[86] = (l) => _.value.env_city = l),
                  class: "field"
                }, null, 512), [
                  [p, _.value.env_city]
                ])
              ]),
              e("label", null, [
                t[241] || (t[241] = e("span", null, "纬度", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[87] || (t[87] = (l) => _.value.env_latitude = l),
                  class: "field tiny"
                }, null, 512), [
                  [p, _.value.env_latitude]
                ])
              ]),
              e("label", null, [
                t[242] || (t[242] = e("span", null, "经度", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[88] || (t[88] = (l) => _.value.env_longitude = l),
                  class: "field tiny"
                }, null, 512), [
                  [p, _.value.env_longitude]
                ])
              ]),
              e("label", null, [
                t[243] || (t[243] = e("span", null, "天气缓存(分)", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[89] || (t[89] = (l) => _.value.weather_cache_minutes = l),
                  type: "number",
                  min: "5",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.weather_cache_minutes,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[244] || (t[244] = e("span", null, "每条源条数", -1)),
                u(e("input", {
                  "onUpdate:modelValue": t[90] || (t[90] = (l) => _.value.content_items_per_feed = l),
                  type: "number",
                  min: "1",
                  class: "field tiny"
                }, null, 512), [
                  [
                    p,
                    _.value.content_items_per_feed,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              e("label", null, [
                t[245] || (t[245] = e("span", null, "语言", -1)),
                I(R, {
                  modelValue: _.value.locale,
                  "onUpdate:modelValue": t[91] || (t[91] = (l) => _.value.locale = l),
                  options: Ul,
                  "aria-label": "语言"
                }, null, 8, ["modelValue"])
              ])
            ]),
            u(e("input", {
              "onUpdate:modelValue": t[92] || (t[92] = (l) => _.value.news_feeds = l),
              class: "field",
              placeholder: "news_feeds：ai:https://… , bilibili:https://… , https://…"
            }, null, 512), [
              [p, _.value.news_feeds]
            ]),
            u(e("input", {
              "onUpdate:modelValue": t[93] || (t[93] = (l) => _.value.tts_endpoint = l),
              class: "field",
              placeholder: "tts_endpoint（可选）"
            }, null, 512), [
              [p, _.value.tts_endpoint]
            ]),
            e("div", tr, [
              e("label", lr, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[94] || (t[94] = (l) => _.value.enable_environment_fetch = l)
                }, null, 512), [
                  [pe, _.value.enable_environment_fetch]
                ]),
                t[246] || (t[246] = e("span", null, "允许联网取天气", -1))
              ]),
              e("label", sr, [
                u(e("input", {
                  type: "checkbox",
                  "onUpdate:modelValue": t[95] || (t[95] = (l) => _.value.enable_content_fetch = l)
                }, null, 512), [
                  [pe, _.value.enable_content_fetch]
                ]),
                t[247] || (t[247] = e("span", null, "允许联网取内容", -1))
              ])
            ]),
            t[249] || (t[249] = e("h4", { class: "sub-label" }, "数据导入导出", -1)),
            e("div", { class: "actions-row" }, [
              e("button", {
                class: "btn tonal sm",
                onClick: Hl
              }, "导出配置"),
              e("button", {
                class: "btn tonal sm",
                onClick: Ql
              }, "导出全部（含关系/日记/时间线）")
            ]),
            u(e("textarea", {
              "onUpdate:modelValue": t[96] || (t[96] = (l) => W.value = l),
              class: "field area",
              placeholder: "粘贴导出 JSON 后点导入…"
            }, null, 512), [
              [p, W.value]
            ]),
            e("div", nr, [
              e("button", {
                class: "btn filled sm",
                onClick: Wl,
                disabled: !W.value.trim()
              }, "导入配置", 8, ar),
              e("button", {
                class: "btn filled sm",
                onClick: Xl,
                disabled: !W.value.trim()
              }, "全量导入", 8, or)
            ])
          ])
        ])
      ], 512), [
        [P, c.value === "config"]
      ]),
      u(e("section", ir, [
        e("div", { class: "section-head" }, [
          t[250] || (t[250] = e("div", null, [
            e("h2", null, "模型与扩展"),
            e("p", { class: "desc" }, "逐任务模型分流，以及可选扩展的可用状态（fail-closed）。")
          ], -1)),
          e("div", { class: "head-actions" }, [
            e("button", {
              class: "btn filled sm",
              onClick: Jt
            }, "保存分流"),
            e("button", {
              class: "btn tonal sm",
              onClick: It
            }, "刷新扩展")
          ])
        ]),
        e("div", ur, [
          e("article", dr, [
            t[251] || (t[251] = e("h3", null, "逐任务模型分流", -1)),
            t[252] || (t[252] = e("p", { class: "hint" }, "JSON：任务 → 模型。可用任务：think / output / reflect / journal / dream / agenda / plan / compact。", -1)),
            u(e("textarea", {
              "onUpdate:modelValue": t[97] || (t[97] = (l) => We.value = l),
              class: "field area",
              placeholder: '{"think":"deepseek-v4-pro","output":"deepseek-flash"}'
            }, null, 512), [
              [p, We.value]
            ]),
            e("button", {
              class: "btn filled sm",
              onClick: Jt
            }, "保存并生效")
          ]),
          e("article", rr, [
            t[253] || (t[253] = e("h3", null, "扩展状态", -1)),
            e("ol", cr, [
              (a(!0), o(m, null, y(Qe.value, (l) => (a(), o("li", {
                key: l.name
              }, [
                e("strong", null, n(l.name), 1),
                e("span", vr, "api " + n(l.api_version) + " · " + n(l.reason || "—"), 1),
                e("span", {
                  class: C(["chip", l.available ? "ok" : "muted"])
                }, n(l.available ? "可用" : "未就绪"), 3)
              ]))), 128)),
              Qe.value.length ? d("", !0) : (a(), o("li", pr, "没有注册的扩展。"))
            ]),
            t[254] || (t[254] = e("p", { class: "hint" }, "未就绪的扩展不会伪装成可用；配置对应端点或开关后即可转为可用。", -1))
          ])
        ])
      ], 512), [
        [P, c.value === "models"]
      ]),
      u(e("section", _r, [
        t[265] || (t[265] = e("div", { class: "section-head" }, [
          e("div", null, [
            e("h2", null, "实验与手动触发"),
            e("p", { class: "desc" }, "一次性触发内容抓取、群聊兴趣唤醒、关系回落、穿搭与生图（扩展未就绪时失败即报）。")
          ])
        ], -1)),
        e("div", mr, [
          e("article", br, [
            t[255] || (t[255] = e("h3", null, "内容", -1)),
            e("div", yr, [
              e("button", {
                class: "btn tonal sm",
                onClick: St
              }, "抓取见闻"),
              e("button", {
                class: "btn tonal sm",
                onClick: t[98] || (t[98] = (l) => Pe("journal"))
              }, "生成日记"),
              e("button", {
                class: "btn tonal sm",
                onClick: t[99] || (t[99] = (l) => Pe("dream"))
              }, "生成梦境")
            ])
          ]),
          e("article", { class: "card" }, [
            t[256] || (t[256] = e("h3", null, "行为", -1)),
            e("div", { class: "actions-row" }, [
              e("button", {
                class: "btn tonal sm",
                onClick: Et
              }, "群聊兴趣唤醒"),
              e("button", {
                class: "btn tonal sm",
                onClick: gt
              }, "关系自然回落"),
              e("button", {
                class: "btn tonal sm",
                onClick: nt
              }, "今日穿搭")
            ])
          ]),
          e("article", { class: "card" }, [
            t[257] || (t[257] = e("h3", null, "生图（扩展门控）", -1)),
            t[258] || (t[258] = e("p", { class: "hint" }, "未安装生图扩展或未配置端点时不会伪装成功。", -1)),
            e("div", { class: "actions-row" }, [
              e("button", {
                class: "btn tonal sm",
                onClick: Cl
              }, "尝试生图")
            ])
          ]),
          e("article", fr, [
            t[259] || (t[259] = e("h3", null, "多模态出站", -1)),
            e("div", gr, [
              I(R, {
                modelValue: q.value.kind,
                "onUpdate:modelValue": t[100] || (t[100] = (l) => q.value.kind = l),
                class: "sel",
                style: { width: "160px" },
                options: Sl,
                "aria-label": "媒体类型"
              }, null, 8, ["modelValue"]),
              I(R, {
                modelValue: q.value.target,
                "onUpdate:modelValue": t[101] || (t[101] = (l) => q.value.target = l),
                style: { flex: "1", "min-width": "200px" },
                options: Tl.value,
                "aria-label": "发送目标"
              }, null, 8, ["modelValue", "options"])
            ]),
            q.value.kind === "tts" ? u((a(), o("textarea", {
              key: 0,
              "onUpdate:modelValue": t[102] || (t[102] = (l) => q.value.text = l),
              class: "field area",
              placeholder: "语音内容…"
            }, null, 512)), [
              [p, q.value.text]
            ]) : q.value.kind === "image" ? u((a(), o("input", {
              key: 1,
              "onUpdate:modelValue": t[103] || (t[103] = (l) => q.value.file = l),
              class: "field",
              placeholder: "图片路径 / URL"
            }, null, 512)), [
              [p, q.value.file]
            ]) : d("", !0),
            e("button", {
              class: "btn filled sm",
              onClick: ss,
              disabled: !q.value.target
            }, "发送", 8, kr),
            t[260] || (t[260] = e("p", { class: "hint" }, "需要 OneBot 已连接；未连接会明确失败。", -1))
          ]),
          e("article", hr, [
            t[261] || (t[261] = e("h3", null, "食物菜单", -1)),
            e("div", wr, [
              u(e("input", {
                "onUpdate:modelValue": t[104] || (t[104] = (l) => re.value.name = l),
                class: "field",
                placeholder: "食物，如 番茄牛腩"
              }, null, 512), [
                [p, re.value.name]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[105] || (t[105] = (l) => re.value.tags = l),
                class: "field",
                placeholder: "标签（可选）"
              }, null, 512), [
                [p, re.value.tags]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: hl,
                disabled: !re.value.name.trim()
              }, "加入", 8, Cr)
            ]),
            e("ol", xr, [
              (a(!0), o(m, null, y(v.value.food, (l) => (a(), o("li", {
                key: l.id
              }, [
                f(n(l.name) + " ", 1),
                e("span", $r, n(l.tags || "—"), 1),
                e("button", {
                  class: "btn danger sm",
                  onClick: (i) => wl(l.id)
                }, "删除", 8, Vr)
              ]))), 128)),
              (v.value.food || []).length ? d("", !0) : (a(), o("li", Ur, "菜单还是空的"))
            ])
          ]),
          e("article", Sr, [
            t[263] || (t[263] = e("h3", null, "重要日期", -1)),
            e("div", Nr, [
              u(e("input", {
                "onUpdate:modelValue": t[106] || (t[106] = (l) => F.value.title = l),
                class: "field",
                placeholder: "名称，如 生日"
              }, null, 512), [
                [p, F.value.title]
              ]),
              u(e("input", {
                "onUpdate:modelValue": t[107] || (t[107] = (l) => F.value.date = l),
                class: "field",
                placeholder: "YYYY-MM-DD 或 MM-DD"
              }, null, 512), [
                [p, F.value.date]
              ]),
              e("button", {
                class: "btn filled sm",
                onClick: rl,
                disabled: !F.value.title.trim() || !F.value.date.trim()
              }, "添加", 8, Tr)
            ]),
            e("label", jr, [
              u(e("input", {
                type: "checkbox",
                "onUpdate:modelValue": t[108] || (t[108] = (l) => F.value.repeat_yearly = l)
              }, null, 512), [
                [pe, F.value.repeat_yearly]
              ]),
              t[262] || (t[262] = e("span", null, "每年重复", -1))
            ]),
            e("ol", Mr, [
              (a(!0), o(m, null, y(v.value.important_dates, (l) => (a(), o("li", {
                key: l.id
              }, [
                f(n(l.title) + " · " + n(l.date_text), 1),
                e("button", {
                  class: "btn danger sm",
                  onClick: (i) => cl(l.id)
                }, "删除", 8, Lr)
              ]))), 128)),
              v.value.important_dates?.length ? d("", !0) : (a(), o("li", Or, "还没有重要日期"))
            ])
          ]),
          e("article", Dr, [
            t[264] || (t[264] = e("h3", null, "群聊黑话词云", -1)),
            e("div", Er, [
              (a(!0), o(m, null, y(xt.value, (l) => (a(), o("span", {
                key: l.topic,
                class: "cloud-word",
                style: _e({ fontSize: 12 + Math.min(18, Math.log(l.score + 1) * 6) + "px", opacity: 0.55 + Math.min(0.45, l.score / 20) })
              }, n(l.topic), 5))), 128)),
              xt.value.length ? d("", !0) : (a(), o("span", Fr, "还没有词云数据"))
            ])
          ])
        ])
      ], 512), [
        [P, c.value === "experimental"]
      ])
    ], 512));
  }
}), Jr = /* @__PURE__ */ vs(qr, [["__scopeId", "data-v-2943d753"]]);
export {
  Jr as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('life-plugin-style')){const s=document.createElement('style');s.id='life-plugin-style';s.textContent="#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color .14s,border-radius .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),color .14s}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity .18s var(--ease-emphasized,cubic-bezier(.2,0,0,1)),transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.select-menu-leave-active{transition:opacity .13s,transform .13s}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}.pcp[data-v-2943d753]{--r-xs:10px;--r-sm:14px;--r-md:20px;--r-lg:28px;--r-xl:36px;--spring:cubic-bezier(.2,.9,.25,1.15);height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;background:var(--md-surface);color:var(--md-on-surface);max-width:1240px;margin:0 auto}h1[data-v-2943d753],h2[data-v-2943d753],h3[data-v-2943d753],h4[data-v-2943d753]{margin:0;letter-spacing:-.01em}.eyebrow[data-v-2943d753]{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}.eyebrow b[data-v-2943d753]{font-size:9px}.hero[data-v-2943d753]{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}.hero[data-v-2943d753]:after{content:\"\";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}.hero-main[data-v-2943d753]{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}.hero-copy h1[data-v-2943d753]{font-size:clamp(26px,3.4vw,40px);font-weight:800}.sub[data-v-2943d753]{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}.hero-actions[data-v-2943d753]{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.fab[data-v-2943d753]{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);transition:transform .28s var(--spring),box-shadow .28s}.fab[data-v-2943d753]:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}.fab[data-v-2943d753]:disabled{opacity:.6;cursor:not-allowed}.fab-ic[data-v-2943d753]{font-size:17px}.hero-stats[data-v-2943d753]{position:relative;z-index:1;display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:22px}.stat[data-v-2943d753]{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;border:0;border-radius:var(--r-md);background:color-mix(in srgb,var(--md-surface-container-lowest) 78%,transparent);cursor:pointer;text-align:left;transition:transform .25s var(--spring),background .25s;backdrop-filter:blur(4px)}.stat[data-v-2943d753]:hover{transform:translateY(-2px);background:var(--md-surface-container-lowest)}.stat-ic[data-v-2943d753]{font-size:14px;opacity:.85}.stat-num[data-v-2943d753]{font-size:26px;font-weight:800;letter-spacing:-.02em}.stat-cap[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.t1[data-v-2943d753]{color:var(--md-primary)}.t2[data-v-2943d753]{color:#9a6a00}.t3[data-v-2943d753]{color:#7b4bb7}.t4[data-v-2943d753]{color:#0d8a5f}.t5[data-v-2943d753]{color:#b5473c}.t6[data-v-2943d753]{color:#1a6fb4}.state-row[data-v-2943d753]{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}.pill[data-v-2943d753]{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}.pill.soft[data-v-2943d753]{font-weight:500;color:var(--md-on-surface-variant)}.pill.bad[data-v-2943d753]{background:#ffdcc6;color:#7a3a00}.chip-btn[data-v-2943d753]{border:0;border-radius:999px;padding:7px 14px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font:700 13px/1 inherit;cursor:pointer;transition:transform .2s var(--spring)}.chip-btn[data-v-2943d753]:hover{transform:translateY(-1px)}.banner[data-v-2943d753]{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}.banner.err[data-v-2943d753]{background:var(--md-error-container);color:#410e0b}.banner.ok[data-v-2943d753]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tabs[data-v-2943d753]{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}.tab[data-v-2943d753]{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .25s,color .25s,transform .25s var(--spring)}.tab i[data-v-2943d753]{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}.tab-ic[data-v-2943d753]{font-size:14px}.tab[data-v-2943d753]:hover{background:var(--md-surface-container-high)}.tab.active[data-v-2943d753]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}.tab.active i[data-v-2943d753]{opacity:.85}.panel[data-v-2943d753]{animation:fade-2943d753 .32s var(--spring)}@keyframes fade-2943d753{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}.section-head[data-v-2943d753]{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}.section-head h2[data-v-2943d753]{font-size:22px;font-weight:800}.desc[data-v-2943d753]{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}.head-actions[data-v-2943d753]{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.btn[data-v-2943d753]{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}.btn.sm[data-v-2943d753]{height:34px;padding:0 14px;font-size:13px}.btn[data-v-2943d753]:disabled{opacity:.5;cursor:not-allowed}.btn[data-v-2943d753]:hover:not(:disabled){transform:translateY(-1px)}.btn.filled[data-v-2943d753]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn.tonic[data-v-2943d753]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn.text[data-v-2943d753]{background:transparent;color:var(--md-primary)}.btn.danger[data-v-2943d753]{background:var(--md-error-container);color:#410e0b}.link[data-v-2943d753]{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}.card[data-v-2943d753]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}.card>h3[data-v-2943d753]{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}.card.sub[data-v-2943d753]{padding:16px;margin-bottom:0}.grid2[data-v-2943d753]{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.grid3[data-v-2943d753]{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}.cards[data-v-2943d753]{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}.item-card[data-v-2943d753]{display:flex;flex-direction:column;gap:8px}.row[data-v-2943d753]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.sub-label[data-v-2943d753]{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}.hint[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}.meta[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}.prose[data-v-2943d753]{margin:0;font-size:14px;line-height:1.85;white-space:pre-wrap;overflow-wrap:anywhere}.empty[data-v-2943d753]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}.field[data-v-2943d753]{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}.field[data-v-2943d753]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}.field.area[data-v-2943d753]{height:auto;padding:12px 16px;line-height:1.6;resize:vertical;min-height:84px}.field.tiny[data-v-2943d753]{width:104px;height:38px;padding:0 12px;font-size:13px}.field.search[data-v-2943d753]{max-width:200px}.form-row[data-v-2943d753]{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}.form-row .field[data-v-2943d753]{flex:1;min-width:120px}.actions-row[data-v-2943d753]{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}.switches[data-v-2943d753]{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}.sw[data-v-2943d753]{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}.sw input[data-v-2943d753]{width:18px;height:18px;accent-color:var(--md-primary)}.settings-grid[data-v-2943d753]{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.settings-grid label[data-v-2943d753]{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}.settings-grid label.wide[data-v-2943d753]{grid-column:span 2}.settings-grid .field[data-v-2943d753]{height:40px}.chip[data-v-2943d753]{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.chip.muted[data-v-2943d753]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.chip.ok[data-v-2943d753]{background:var(--md-success-container);color:#0d3b1e}.chip.warn[data-v-2943d753]{background:#ffe6c2;color:#7a4400}.chip.danger[data-v-2943d753]{background:var(--md-error-container);color:#410e0b}.chip button[data-v-2943d753]{border:0;background:transparent;color:inherit;cursor:pointer;font-weight:800;margin-left:2px}.count-pill[data-v-2943d753]{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}.chips[data-v-2943d753]{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.owner[data-v-2943d753]{margin-left:6px;font-style:normal;font-size:12px;font-weight:800;background:var(--md-success-container);color:#0d3b1e;border-radius:999px;padding:2px 7px}.note[data-v-2943d753]{margin:10px 0;padding:12px 14px;border-radius:var(--r-sm);background:var(--md-surface-container);font-size:13px;line-height:1.6}.desk[data-v-2943d753]{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:16px;align-items:start}.desk-col[data-v-2943d753]{display:flex;flex-direction:column;gap:16px}.dcard[data-v-2943d753]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:18px}.dcard header[data-v-2943d753]{display:flex;align-items:center;gap:8px;margin-bottom:12px}.dcard header h3[data-v-2943d753]{font-size:14px;font-weight:800}.dcard header small[data-v-2943d753],.dcard header .link[data-v-2943d753]{margin-left:auto}.dcard .link[data-v-2943d753]{margin-left:auto}.dot[data-v-2943d753]{width:11px;height:11px;border-radius:50%;background:var(--md-outline)}.dot.ic[data-v-2943d753]{background:var(--md-primary);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-primary) 18%,transparent)}.fact-grid[data-v-2943d753]{display:grid;grid-template-columns:1fr 1fr;gap:10px}.fact[data-v-2943d753]{background:var(--md-surface-container-low);border-radius:var(--r-sm);padding:10px 12px;display:flex;flex-direction:column;gap:2px}.fact b[data-v-2943d753]{font-size:22px;font-weight:800}.fact span[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.mini-list[data-v-2943d753]{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}.mini-list li[data-v-2943d753]{display:flex;justify-content:space-between;gap:10px;font-size:13px;align-items:center}.cur[data-v-2943d753]{display:flex;align-items:center;gap:10px;font-size:15px}.tl[data-v-2943d753]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.tl li[data-v-2943d753]{display:flex;gap:12px;align-items:flex-start;padding:8px 10px;border-radius:var(--r-sm);background:var(--md-surface-container-low)}.tl li time[data-v-2943d753]{font:600 12px/1.4 ui-monospace,monospace;color:var(--md-on-surface-variant);flex:0 0 46px}.tl li>div[data-v-2943d753]{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.tl li strong.done[data-v-2943d753]{text-decoration:line-through;color:var(--md-on-surface-variant)}.tl li.ok[data-v-2943d753]{background:var(--md-success-container)}.tl li.warn[data-v-2943d753]{background:#fff3dd}.mini-tl[data-v-2943d753]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.mini-tl li[data-v-2943d753]{display:flex;gap:10px;align-items:flex-start}.mini-tl li>div[data-v-2943d753]{display:flex;flex-direction:column;gap:2px}.caps[data-v-2943d753]{display:flex;flex-wrap:wrap;gap:8px}.cap[data-v-2943d753]{display:flex;flex-direction:column;gap:1px;padding:8px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);min-width:96px}.cap b[data-v-2943d753]{font-size:13px}.cap small[data-v-2943d753]{font-size:12px;color:#0d8a5f;font-weight:700}.cap.off small[data-v-2943d753]{color:var(--md-on-surface-variant)}.fold[data-v-2943d753]{border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);margin-top:16px;background:var(--md-surface-container-lowest);overflow:hidden}.fold summary[data-v-2943d753]{padding:16px 20px;cursor:pointer;display:flex;flex-direction:column;gap:2px;list-style:none}.fold summary[data-v-2943d753]::-webkit-details-marker{display:none}.fold summary b[data-v-2943d753]{font-size:15px}.fold summary small[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.fold[open] summary[data-v-2943d753]{border-bottom:1px solid var(--md-outline-variant)}.fold .grid3[data-v-2943d753],.fold .grid2[data-v-2943d753]{padding:18px;margin:0}.stat-cards[data-v-2943d753]{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px}.stat-card[data-v-2943d753]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:18px;display:flex;flex-direction:column;gap:4px}.stat-card b[data-v-2943d753]{font-size:28px;font-weight:800}.stat-card span[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.bars[data-v-2943d753]{display:flex;flex-direction:column;gap:10px}.bar-row[data-v-2943d753]{display:flex;align-items:center;gap:10px;font-size:13px}.bar-label[data-v-2943d753]{flex:0 0 84px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--md-on-surface-variant)}.bar[data-v-2943d753]{flex:1;height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.bar i[data-v-2943d753]{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 60%,#fff));transition:width .4s var(--spring)}.bar.big[data-v-2943d753]{height:14px;margin:8px 0}.feed[data-v-2943d753]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.feed li[data-v-2943d753]{display:flex;flex-direction:column;gap:3px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);font-size:13px}.feed li .actions-row[data-v-2943d753]{margin-top:4px}.pos[data-v-2943d753]{color:var(--md-success);font-weight:800}.neg[data-v-2943d753]{color:var(--md-error);font-weight:800}.tl-detail[data-v-2943d753]{margin:4px 0 0;font-size:12px;color:var(--md-on-surface-variant);background:var(--md-surface-container);padding:7px 10px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}.user-layout[data-v-2943d753]{display:grid;grid-template-columns:300px 1fr;gap:16px;align-items:start}.roster[data-v-2943d753]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:14px;display:flex;flex-direction:column;gap:8px}.roster-head[data-v-2943d753]{display:flex;align-items:center;gap:8px;padding:4px 6px 8px}.roster-row[data-v-2943d753]{display:flex;gap:10px;align-items:center;padding:10px;border:0;border-radius:var(--r-sm);background:transparent;cursor:pointer;text-align:left;transition:background .2s}.roster-row[data-v-2943d753]:hover{background:var(--md-surface-container-low)}.roster-row.active[data-v-2943d753]{background:var(--md-secondary-container)}.avatar[data-v-2943d753]{width:38px;height:38px;border-radius:50%;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:800;flex:0 0 auto}.avatar.lg[data-v-2943d753]{width:52px;height:52px;font-size:20px}.rmain[data-v-2943d753]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.rtop[data-v-2943d753]{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700}.user-detail[data-v-2943d753]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;min-height:320px}.detail-head[data-v-2943d753]{display:flex;align-items:center;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}.subtabs[data-v-2943d753]{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}.subtabs button[data-v-2943d753]{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:700 12px/1 inherit;cursor:pointer}.subtabs button.active[data-v-2943d753]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}.kv-grid[data-v-2943d753]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:8px}.kv[data-v-2943d753]{background:var(--md-surface-container-low);border-radius:var(--r-sm);padding:12px 14px;display:flex;flex-direction:column;gap:3px}.kv span[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.kv b[data-v-2943d753]{font-size:22px;font-weight:800}.world-layout[data-v-2943d753]{display:grid;grid-template-columns:190px 1fr;gap:16px;align-items:start}.world-nav[data-v-2943d753]{position:sticky;top:8px;display:flex;flex-direction:column;gap:4px}.world-nav button[data-v-2943d753]{display:flex;justify-content:space-between;align-items:center;height:42px;padding:0 14px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .2s}.world-nav button[data-v-2943d753]:hover{background:var(--md-surface-container-high)}.world-nav button.active[data-v-2943d753]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.world-body .cards[data-v-2943d753]{margin-top:0}.group-form[data-v-2943d753]{display:grid;grid-template-columns:1fr 130px 1fr auto;gap:10px;margin-bottom:16px}.group-detail[data-v-2943d753]{margin:10px 0;padding:12px;border-radius:var(--r-sm);background:var(--md-surface-container-low)}.members[data-v-2943d753]{display:flex;flex-direction:column;gap:6px}.member[data-v-2943d753]{display:flex;align-items:center;gap:10px;font-size:13px}.member .meta[data-v-2943d753]{flex:1}.cal-card[data-v-2943d753]{grid-column:auto}.cal-week[data-v-2943d753]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}.cal-week span[data-v-2943d753]{text-align:center;font-size:12px;color:var(--md-on-surface-variant);font-weight:700}.cal-grid[data-v-2943d753]{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}.cal-cell[data-v-2943d753]{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:12px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}.cal-cell.empty[data-v-2943d753]{border-color:transparent;background:transparent}.cal-cell.today[data-v-2943d753]{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 20%,transparent)}.cal-cell.has[data-v-2943d753]{background:var(--md-surface-container-low)}.cal-day[data-v-2943d753]{font-size:12px;font-weight:800;color:var(--md-on-surface-variant)}.cal-chip[data-v-2943d753]{font-size:11px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cal-more[data-v-2943d753]{font-size:12px;color:var(--md-on-surface-variant)}.cloud[data-v-2943d753]{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}.cloud-word[data-v-2943d753]{font-weight:800;color:var(--md-primary);line-height:1.2}.mini-actions[data-v-2943d753]{display:flex;gap:6px;flex:0 0 auto}.warnline[data-v-2943d753]{margin:12px 0 0;padding:10px 12px;border-radius:var(--r-sm);background:#fff3dd;color:#7a4400;font-size:13px}.spark[data-v-2943d753]{display:flex;align-items:flex-end;gap:6px;height:120px;padding:8px 2px 0}.spark-col[data-v-2943d753]{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px;height:100%}.spark-col i[data-v-2943d753]{width:100%;max-width:22px;border-radius:7px 7px 3px 3px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 55%,#fff));transition:height .4s var(--spring)}.spark-col span[data-v-2943d753]{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace}.radar-wrap[data-v-2943d753]{display:flex;flex-direction:column;align-items:center;gap:8px}.radar[data-v-2943d753]{width:180px;height:180px}.radar-grid[data-v-2943d753]{fill:none;stroke:var(--md-outline-variant);stroke-width:1}.radar-fill[data-v-2943d753]{fill:color-mix(in srgb,var(--md-primary) 34%,transparent);stroke:var(--md-primary);stroke-width:2;transition:all .4s var(--spring)}.radar-lbl[data-v-2943d753]{font-size:10px;fill:var(--md-on-surface-variant);font-weight:700}.findings[data-v-2943d753]{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}.findings li[data-v-2943d753]{display:flex;gap:8px;align-items:center}#app .pcp .card[data-v-2943d753],#app .pcp .dcard[data-v-2943d753]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .pcp .field[data-v-2943d753]{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}#app .pcp .field[data-v-2943d753]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .pcp .field.area[data-v-2943d753]{height:auto}#app .pcp .field.tiny[data-v-2943d753]{height:40px}#app .pcp .settings-grid .field[data-v-2943d753]{height:44px}#app .pcp .btn[data-v-2943d753]{height:44px;padding:0 20px}#app .pcp .btn.sm[data-v-2943d753]{height:36px;padding:0 15px}#app .pcp .stat-card[data-v-2943d753],#app .pcp .item-card[data-v-2943d753]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent)}#app .pcp .note[data-v-2943d753],#app .pcp .fact[data-v-2943d753],#app .pcp .tl li[data-v-2943d753],#app .pcp .feed li[data-v-2943d753],#app .pcp .kv[data-v-2943d753],#app .pcp .cap[data-v-2943d753],#app .pcp .group-detail[data-v-2943d753]{background:var(--md-surface-container)}#app .pcp .sel[data-v-2943d753]{flex:0 0 auto}#app .pcp .sel[data-v-2943d753] .app-select-trigger{min-height:48px;border-radius:14px}#app .pcp .sel-tiny[data-v-2943d753]{flex:0 0 auto}#app .pcp .sel-tiny[data-v-2943d753] .app-select-trigger{min-height:38px;padding:0 10px;border-radius:12px;font-size:13px}@media (prefers-color-scheme: dark){.pill.bad[data-v-2943d753]{background:#5a2d00;color:#ffd7b0}.chip.warn[data-v-2943d753]{background:#5a3d00;color:#ffe0a3}.warnline[data-v-2943d753]{background:#3d2b00;color:#ffd89a}.tl li.warn[data-v-2943d753]{background:#3d2b00}}@media (max-width:1080px){.desk[data-v-2943d753]{grid-template-columns:1fr 1fr}.stat-cards[data-v-2943d753]{grid-template-columns:repeat(2,1fr)}.hero-stats[data-v-2943d753]{grid-template-columns:repeat(3,1fr)}}@media (max-width:820px){.grid2[data-v-2943d753],.grid3[data-v-2943d753],.desk[data-v-2943d753],.user-layout[data-v-2943d753],.world-layout[data-v-2943d753],.group-form[data-v-2943d753]{grid-template-columns:1fr}.settings-grid label.wide[data-v-2943d753]{grid-column:span 1}.hero-stats[data-v-2943d753]{grid-template-columns:repeat(2,1fr)}}@media (max-width:560px){.pcp[data-v-2943d753]{padding:var(--space-lg) var(--space-lg) 80px}.hero[data-v-2943d753]{padding:20px}.hero-actions[data-v-2943d753]{width:100%}}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.page[data-v-7e62324c]{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}.page-inner[data-v-7e62324c]{max-width:1180px;margin:0 auto}.page-header[data-v-7e62324c]{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}.eyebrow[data-v-7e62324c]{margin:0 0 6px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}.page-header h1[data-v-7e62324c]{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}.subtitle[data-v-7e62324c]{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}.header-actions[data-v-7e62324c]{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}.btn[data-v-7e62324c]{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}.btn[data-v-7e62324c]:disabled{opacity:.55;cursor:not-allowed}.btn[data-v-7e62324c]:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}.btn-sm[data-v-7e62324c]{height:30px;padding:0 12px;font-size:12px}.btn-primary[data-v-7e62324c]{background:var(--md-primary);color:var(--md-on-primary,#fff)}.btn-tonal[data-v-7e62324c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.btn-danger[data-v-7e62324c]{background:var(--md-error-container);color:#410e0b}.stat-grid[data-v-7e62324c]{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}.stat-card[data-v-7e62324c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}.stat-head[data-v-7e62324c]{display:flex;align-items:center;gap:10px}.stat-label[data-v-7e62324c]{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}.stat-value[data-v-7e62324c]{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.stat-hint[data-v-7e62324c]{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}.icon-badge[data-v-7e62324c]{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}.tone-1[data-v-7e62324c]{background:var(--md-primary-container);color:var(--md-on-primary-container)}.tone-2[data-v-7e62324c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tone-3[data-v-7e62324c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.tone-4[data-v-7e62324c]{background:var(--md-success-container);color:#0d3b1e}.card[data-v-7e62324c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}.card-head[data-v-7e62324c]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.card-title[data-v-7e62324c]{margin:0;font-size:16px;font-weight:650}.tabs[data-v-7e62324c]{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}.tabs button[data-v-7e62324c]{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}.tabs button.active[data-v-7e62324c]{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}.toolbar[data-v-7e62324c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}.search-field[data-v-7e62324c]{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}.search-icon[data-v-7e62324c]{color:var(--md-on-surface-variant);flex-shrink:0}.search-field input[data-v-7e62324c]{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}.search-field.mini[data-v-7e62324c]{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}.select[data-v-7e62324c]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}.select select[data-v-7e62324c]{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}.chip[data-v-7e62324c]{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}.chip.muted[data-v-7e62324c]{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}.tier-short[data-v-7e62324c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.tier-long[data-v-7e62324c]{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}.chip-ok[data-v-7e62324c]{background:var(--md-success-container);color:#0d3b1e}.chip-warn[data-v-7e62324c]{background:#fff1dc;color:#7a4400}.error-banner[data-v-7e62324c]{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410e0b;font-size:13px;margin:var(--space-lg) 0}.notice[data-v-7e62324c]{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}.memory-list[data-v-7e62324c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}.memory-card[data-v-7e62324c]{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}.memory-card[data-v-7e62324c]:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}.card-top[data-v-7e62324c]{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.btn-icon[data-v-7e62324c]{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}.btn-icon.danger[data-v-7e62324c]:hover{background:var(--md-error-container);color:var(--md-error)}.memory-content[data-v-7e62324c]{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}.tags[data-v-7e62324c]{display:flex;gap:6px;flex-wrap:wrap}.tags span[data-v-7e62324c]{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}.memory-foot[data-v-7e62324c]{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}.meter[data-v-7e62324c]{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}.meter-bar[data-v-7e62324c]{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}.meter-bar i[data-v-7e62324c]{display:block;height:100%;border-radius:999px;transition:width .3s}.fill-primary[data-v-7e62324c]{background:var(--md-primary)}.fill-secondary[data-v-7e62324c]{background:var(--md-secondary,#536255)}.meter-text[data-v-7e62324c]{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}.detail[data-v-7e62324c]{border-top:1px solid var(--md-outline-variant);padding-top:10px}.detail dl[data-v-7e62324c]{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}.detail dt[data-v-7e62324c]{color:var(--md-on-surface-variant);font-weight:600}.detail dd[data-v-7e62324c]{margin:3px 0 0;overflow-wrap:anywhere}.detail code[data-v-7e62324c]{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.card-actions[data-v-7e62324c]{display:flex;gap:8px;justify-content:flex-end}.hidden-input[data-v-7e62324c]{display:none}.empty-state[data-v-7e62324c]{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}.empty-state p[data-v-7e62324c]{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}.empty-state .hint[data-v-7e62324c]{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}.pager[data-v-7e62324c]{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}.grid-notes[data-v-7e62324c]{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}.stack-form[data-v-7e62324c]{display:flex;flex-direction:column;gap:10px}.input[data-v-7e62324c]{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}.input[data-v-7e62324c]:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}.input.area[data-v-7e62324c]{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}.note-list[data-v-7e62324c],.reflection-list[data-v-7e62324c]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}.note-item[data-v-7e62324c]{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}.note-main[data-v-7e62324c]{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.note-main strong[data-v-7e62324c]{font-size:14px;font-weight:600;overflow-wrap:anywhere}.item-meta[data-v-7e62324c]{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}.note-actions[data-v-7e62324c]{display:flex;gap:6px;flex-shrink:0}.list-empty[data-v-7e62324c]{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}.reader[data-v-7e62324c]{margin-top:var(--space-lg)}.reader pre[data-v-7e62324c]{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}.reflection .card-title[data-v-7e62324c]{font-size:14px;font-weight:600}.reflection details[data-v-7e62324c]{margin-top:6px}.reflection summary[data-v-7e62324c]{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}.quote[data-v-7e62324c]{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}#app .memory-page .page-header h1[data-v-7e62324c]{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}#app .memory-page .stat-grid[data-v-7e62324c]{gap:var(--space-lg)}#app .memory-page .stat-card[data-v-7e62324c],#app .memory-page .card[data-v-7e62324c],#app .memory-page .memory-card[data-v-7e62324c]{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .memory-page .stat-card[data-v-7e62324c]{border-radius:24px;transition:transform .28s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .28s}#app .memory-page .stat-card[data-v-7e62324c]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}#app .memory-page .stat-value[data-v-7e62324c]{font-size:34px;font-weight:800;letter-spacing:-.02em}#app .memory-page .icon-badge[data-v-7e62324c]{width:44px;height:44px;border-radius:16px 16px 16px 6px}#app .memory-page .card[data-v-7e62324c],#app .memory-page .memory-card[data-v-7e62324c]{border-radius:24px}#app .memory-page .memory-card[data-v-7e62324c]{transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow .22s,border-color .2s}#app .memory-page .memory-card[data-v-7e62324c]:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}#app .memory-page .btn[data-v-7e62324c]{height:44px;padding:0 20px;border-radius:999px;font-weight:700}#app .memory-page .btn-sm[data-v-7e62324c]{height:34px;padding:0 14px;font-size:13px}#app .memory-page .btn-tonal[data-v-7e62324c]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .memory-page .btn-primary[data-v-7e62324c]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 28%,transparent)}#app .memory-page .input[data-v-7e62324c]{height:48px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);transition:background-color .18s,border-color .18s,box-shadow .2s}#app .memory-page .input[data-v-7e62324c]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .memory-page .input.area[data-v-7e62324c]{height:auto;padding:14px 16px}#app .memory-page .search-field input[data-v-7e62324c]{height:44px}#app .memory-page .search-field.mini[data-v-7e62324c]{border-color:transparent;background:var(--md-surface-container-high);border-radius:14px}#app .memory-page .select select[data-v-7e62324c]{height:44px;border-color:transparent;border-radius:14px;background:var(--md-surface-container-high);padding:0 14px}#app .memory-page .tabs[data-v-7e62324c]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .memory-page .tabs button[data-v-7e62324c]{border-radius:999px;padding:9px 20px;font-weight:650}#app .memory-page .tabs button.active[data-v-7e62324c]{background:var(--md-primary);color:var(--md-on-primary);box-shadow:var(--shadow-1)}#app .memory-page .note-item[data-v-7e62324c]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-low)}@media (max-width:900px){.stat-grid[data-v-7e62324c]{grid-template-columns:repeat(2,1fr)}.grid-notes[data-v-7e62324c]{grid-template-columns:1fr}}@media (max-width:640px){.page[data-v-7e62324c]{padding:var(--space-lg)}.header-actions[data-v-7e62324c]{padding-top:0}.memory-list[data-v-7e62324c]{grid-template-columns:1fr}}\n";document.head.appendChild(s)}})();
