import { ref as p, defineComponent as _, watch as E, nextTick as w, openBlock as y, createBlock as x, Teleport as B, unref as s, createElementBlock as D, withModifiers as L, createElementVNode as a, toDisplayString as f, normalizeClass as S, createCommentVNode as h } from "vue";
const c = p(null);
function K() {
  function i(e) {
    const n = typeof e == "string" ? { message: e } : e;
    return c.value && c.value.resolve(!1), new Promise((r) => {
      c.value = { options: n, resolve: r };
    });
  }
  function t(e) {
    const n = c.value;
    c.value = null, n?.resolve(e);
  }
  return { confirmState: c, confirm: i, settle: t };
}
const $ = /* @__PURE__ */ _({
  __name: "ConfirmDialog",
  setup(i) {
    const { confirmState: t, settle: e } = K(), n = p(null), r = p(null);
    let v = null;
    const m = () => (document.documentElement.lang || "").startsWith("en"), g = () => t.value?.options.title || (m() ? "Confirm" : "请确认"), b = () => t.value?.options.confirmLabel || (m() ? "Confirm" : "确认"), k = () => t.value?.options.cancelLabel || (m() ? "Cancel" : "取消");
    E(() => !!t.value, async (l) => {
      l ? (v = document.activeElement, await w(), n.value?.focus(), r.value?.focus()) : (n.value = null, v?.focus?.());
    });
    function C(l) {
      if (!t.value) return;
      if (l.key === "Escape") {
        l.preventDefault(), e(!1);
        return;
      }
      if (l.key !== "Tab" || !n.value) return;
      const o = [...n.value.querySelectorAll("button:not(:disabled)")];
      if (!o.length) return;
      const u = o[0], d = o[o.length - 1];
      l.shiftKey && document.activeElement === u ? (l.preventDefault(), d.focus()) : !l.shiftKey && document.activeElement === d && (l.preventDefault(), u.focus());
    }
    return (l, o) => (y(), x(B, { to: "body" }, [
      s(t) ? (y(), D("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: o[2] || (o[2] = L((u) => s(e)(!1), ["self"])),
        onKeydown: C
      }, [
        a("section", {
          ref_key: "dialog",
          ref: n,
          class: "confirm-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          a("h2", null, f(g()), 1),
          a("p", null, f(s(t).options.message), 1),
          a("footer", null, [
            a("button", {
              ref_key: "cancelBtn",
              ref: r,
              type: "button",
              onClick: o[0] || (o[0] = (u) => s(e)(!1))
            }, f(k()), 513),
            a("button", {
              type: "button",
              class: S(["confirm-primary", { danger: s(t).options.danger !== !1 }]),
              onClick: o[1] || (o[1] = (u) => s(e)(!0))
            }, f(b()), 3)
          ])
        ], 512)
      ], 32)) : h("", !0)
    ]));
  }
}), N = (i, t) => {
  const e = i.__vccOpts || i;
  for (const [n, r] of t)
    e[n] = r;
  return e;
};
export {
  $ as _,
  N as a,
  K as u
};
