import { ref as m, defineComponent as E, watch as w, nextTick as B, openBlock as y, createBlock as D, Teleport as _, unref as r, createElementBlock as x, withModifiers as L, createElementVNode as s, toDisplayString as c, normalizeClass as S, createCommentVNode as h } from "vue";
const a = m(null);
function K() {
  function p(n) {
    const l = typeof n == "string" ? { message: n } : n;
    return a.value && a.value.resolve(!1), new Promise((u) => {
      a.value = { options: l, resolve: u };
    });
  }
  function t(n) {
    const l = a.value;
    a.value = null, l?.resolve(n);
  }
  return { confirmState: a, confirm: p, settle: t };
}
const $ = /* @__PURE__ */ E({
  __name: "ConfirmDialog",
  setup(p) {
    const { confirmState: t, settle: n } = K(), l = m(null), u = m(null);
    let d = null;
    const f = () => (document.documentElement.lang || "").startsWith("en"), g = () => t.value?.options.title || (f() ? "Confirm" : "请确认"), b = () => t.value?.options.confirmLabel || (f() ? "Confirm" : "确认"), k = () => t.value?.options.cancelLabel || (f() ? "Cancel" : "取消");
    w(() => !!t.value, async (o) => {
      o ? (d = document.activeElement, await B(), l.value?.focus(), u.value?.focus()) : (l.value = null, d?.focus?.());
    });
    function C(o) {
      if (!t.value) return;
      if (o.key === "Escape") {
        o.preventDefault(), n(!1);
        return;
      }
      if (o.key !== "Tab" || !l.value) return;
      const e = [...l.value.querySelectorAll("button:not(:disabled)")];
      if (!e.length) return;
      const i = e[0], v = e[e.length - 1];
      o.shiftKey && document.activeElement === i ? (o.preventDefault(), v.focus()) : !o.shiftKey && document.activeElement === v && (o.preventDefault(), i.focus());
    }
    return (o, e) => (y(), D(_, { to: "body" }, [
      r(t) ? (y(), x("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: e[2] || (e[2] = L((i) => r(n)(!1), ["self"])),
        onKeydown: C
      }, [
        s("section", {
          ref_key: "dialog",
          ref: l,
          class: "confirm-dialog",
          role: "dialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          s("h2", null, c(g()), 1),
          s("p", null, c(r(t).options.message), 1),
          s("footer", null, [
            s("button", {
              ref_key: "cancelBtn",
              ref: u,
              type: "button",
              onClick: e[0] || (e[0] = (i) => r(n)(!1))
            }, c(k()), 513),
            s("button", {
              type: "button",
              class: S(["confirm-primary", { danger: r(t).options.danger !== !1 }]),
              onClick: e[1] || (e[1] = (i) => r(n)(!0))
            }, c(b()), 3)
          ])
        ], 512)
      ], 32)) : h("", !0)
    ]));
  }
});
export {
  $ as _,
  K as u
};
