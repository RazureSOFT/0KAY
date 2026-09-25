import { ref as u } from "vue";
const t = u(null);
function l() {
  function r(e) {
    const n = typeof e == "string" ? { message: e } : e;
    return t.value && t.value.resolve(!1), new Promise((s) => {
      t.value = { options: n, resolve: s };
    });
  }
  function o(e) {
    const n = t.value;
    t.value = null, n?.resolve(e);
  }
  return { confirmState: t, confirm: r, settle: o };
}
const f = (r, o) => {
  const e = r.__vccOpts || r;
  for (const [n, s] of o)
    e[n] = s;
  return e;
};
export {
  f as _,
  l as u
};
