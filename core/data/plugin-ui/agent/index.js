var xs = Object.defineProperty;
var Ss = (n, e, t) => e in n ? xs(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var J = (n, e, t) => Ss(n, typeof e != "symbol" ? e + "" : e, t);
import { reactive as Ts, defineComponent as At, computed as se, openBlock as k, createElementBlock as v, ref as U, onMounted as yn, onUnmounted as _n, normalizeClass as oe, createElementVNode as u, toDisplayString as g, createCommentVNode as F, Fragment as le, renderList as ye, withModifiers as Le, watch as Ee, nextTick as nt, mergeProps as As, unref as ne, createBlock as St, Teleport as Wn, createVNode as Me, Transition as jr, withCtx as Vr, normalizeStyle as jt, withDirectives as Ut, vModelText as gn, withKeys as yt, createTextVNode as xe, vModelCheckbox as Es } from "vue";
function Rs() {
  const n = Ts({
    agents: [],
    tasks: [],
    sessions: [],
    onlineCount: 0,
    loading: !1,
    error: ""
  });
  let e = null, t = null, r = null, s = "";
  const a = /* @__PURE__ */ new Map();
  let i = null, o = !1;
  function f(L) {
    L.reset && a.clear();
    for (const w of L.removed || []) a.delete(w);
    for (const w of L.tasks || []) a.set(w.task_id, w);
    s = L.cursor || "";
    const P = [...a.values()].sort((w, y) => (y.started_at || "").localeCompare(w.started_at || "") || w.task_id.localeCompare(y.task_id));
    n.tasks = P.filter((w) => w.kind !== "agent_session"), n.sessions = P.filter((w) => w.kind === "agent_session");
  }
  function m() {
    i?.close(), o = !1, i = new EventSource(`/api/tasks/events?cursor=${encodeURIComponent(s)}`), i.onopen = () => {
      o = !0;
    }, i.onerror = () => {
      o = !1;
    }, i.addEventListener("tasks", (L) => {
      try {
        f(JSON.parse(L.data));
      } catch {
        o = !1;
      }
    });
  }
  function T() {
    return t ? (r || (r = t.then(() => (r = null, T()))), r) : (t = S().finally(() => {
      t = null;
    }), t);
  }
  async function S() {
    n.loading = !0, n.error = "";
    try {
      const L = await fetch("/api/agents", { signal: AbortSignal.timeout(8e3) });
      if (!L.ok) throw new Error(`HTTP ${L.status}`);
      const P = await L.json();
      n.agents = P.agents || [], n.onlineCount = P.online_count ?? n.agents.length;
    } catch (L) {
      n.error = L.message || "failed";
    }
    if (!o)
      try {
        const L = await fetch(`/api/tasks?incremental=1&cursor=${encodeURIComponent(s)}`, { signal: AbortSignal.timeout(8e3) });
        if (!L.ok) throw new Error(`任务记录 HTTP ${L.status}`);
        const P = await L.json();
        f(P);
      } catch (L) {
        n.error = L.message || "无法刷新任务记录";
      }
    n.loading = !1;
  }
  function M() {
    T().then(() => {
      e && m();
    }), e && clearInterval(e), e = setInterval(() => {
      !document.hidden && !t && T();
    }, 2e3);
  }
  function z() {
    i?.close(), i = null, o = !1, e && (clearInterval(e), e = null);
  }
  function $(L) {
    return !L.missing_dependencies?.length && (L.status === "PLUGIN_STATUS_HEALTHY" || L.status === "HEALTHY");
  }
  async function G(L) {
    const P = await fetch("/api/agent/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: L }) });
    if (!P.ok) throw new Error(await P.text());
    const w = await P.json();
    return await T(), w.session_id;
  }
  async function B(L, P, w) {
    const y = await fetch("/api/agent/sessions", { method: P === "delete" ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: L, action: P, title: w }) });
    if (!y.ok) throw new Error(await y.text());
    await T();
  }
  async function K(L, P, w, y = {}) {
    const R = await fetch("/api/agent/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: L, prompt: P, agent_type: w, ...y }) }), E = await R.text();
    if (await T(), !R.ok) {
      let C = E;
      try {
        C = JSON.parse(E).message || E;
      } catch {
      }
      throw new Error(C);
    }
  }
  async function X(L) {
    const P = await fetch("/api/tasks/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: L }) });
    if (!P.ok) throw new Error(await P.text());
    const w = await P.json();
    if (!w.success) throw new Error(w.message);
    await T();
  }
  return Object.assign(n, {
    fetchAgents: T,
    connect: M,
    disconnect: z,
    isHealthy: $,
    createSession: G,
    manageSession: B,
    sendTask: K,
    cancelTask: X
  });
}
const Cs = Rs();
function $s() {
  return Cs;
}
function qn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ut = qn();
function Wr(n) {
  ut = n;
}
var ot = { exec: () => null };
function _t(n) {
  let e = [];
  return (t) => {
    let r = Math.max(0, Math.min(3, t - 1)), s = e[r];
    return s || (s = n(r), e[r] = s), s;
  };
}
function H(n, e = "") {
  let t = typeof n == "string" ? n : n.source, r = { replace: (s, a) => {
    let i = typeof a == "string" ? a : a.source;
    return i = i.replace(he.caret, "$1"), t = t.replace(s, i), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var Ls = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), he = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: _t((n) => new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: _t((n) => new RegExp(`^ {0,${n}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: _t((n) => new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)), headingBeginRegex: _t((n) => new RegExp(`^ {0,${n}}#`)), htmlBeginRegex: _t((n) => new RegExp(`^ {0,${n}}(?:</?(?:${Wt})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: _t((n) => new RegExp(`^ {0,${n}}>`)) }, Is = /^(?:[ \t]*(?:\n|$))+/, Os = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ps = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Vt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ds = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Gn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, qr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Gr = H(qr).replace(/bull/g, Gn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ms = H(qr).replace(/bull/g, Gn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Yn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Ns = /^[^\n]+/, Zn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, zs = H(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Zn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Fs = H(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, Gn).getRegex(), Wt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Kn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Us = H("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Kn).replace("tag", Wt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Yr = (n) => H(Yn).replace("hr", Vt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", n).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Wt).getRegex(), Bs = Yr(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), Hs = Yr(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), js = H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Hs).getRegex(), Xn = { blockquote: js, code: Os, def: zs, fences: Ps, heading: Ds, hr: Vt, html: Us, lheading: Gr, list: Fs, newline: Is, paragraph: Bs, table: ot, text: Ns }, kr = H("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Vt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Wt).getRegex(), Vs = { ...Xn, lheading: Ms, table: kr, paragraph: H(Yn).replace("hr", Vt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", kr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Wt).getRegex() }, Ws = { ...Xn, html: H(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Kn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ot, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: H(Yn).replace("hr", Vt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Gr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, qs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Zr = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, Ys = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Ye = /[\p{P}\p{S}]/u, Et = /[\s\p{P}\p{S}]/u, qt = /[^\s\p{P}\p{S}]/u, Zs = H(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Et).getRegex(), Ks = /[\p{Pi}\p{Ps}"']/u, Kr = /(?!~)[\p{P}\p{S}]/u, Xs = /(?!~)[\s\p{P}\p{S}]/u, Qs = /(?:[^\s\p{P}\p{S}]|~)/u, Js = H(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ls ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Xr = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, el = H(Xr, "u").replace(/punct/g, Ye).getRegex(), tl = H(Xr, "u").replace(/punct/g, Kr).getRegex(), nl = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, rl = H(nl, "u").replace(/openQuote/g, Ks).replace(/punct/g, Ye).getRegex(), Qr = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", sl = H(Qr, "gu").replace(/notPunctSpace/g, qt).replace(/punctSpace/g, Et).replace(/punct/g, Ye).getRegex(), ll = H(Qr, "gu").replace(/notPunctSpace/g, Qs).replace(/punctSpace/g, Xs).replace(/punct/g, Kr).getRegex(), al = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", ol = H(al, "gu").replace(/notPunctSpace/g, qt).replace(/punctSpace/g, Et).replace(/punct/g, Ye).getRegex(), il = H("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, qt).replace(/punctSpace/g, Et).replace(/punct/g, Ye).getRegex(), ul = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", cl = H(ul, "gu").replace(/notPunctSpace/g, qt).replace(/punctSpace/g, Et).replace(/punct/g, Ye).getRegex(), dl = H(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Ye).getRegex(), pl = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", hl = H(pl, "gu").replace(/notPunctSpace/g, qt).replace(/punctSpace/g, Et).replace(/punct/g, Ye).getRegex(), fl = H(/\\(punct)/, "gu").replace(/punct/g, Ye).getRegex(), gl = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ml = H(Kn).replace("(?:-->|$)", "-->").getRegex(), kl = H("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ml).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Jr = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, mn = H(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", Jr).getRegex(), vl = H(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", mn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), bl = H(/^!?\[(label)\]\[(ref)\]/).replace("label", mn).replace("ref", Zn).getRegex(), yl = H(/^!?\[(ref)\](?:\[\])?/).replace("ref", Zn).getRegex(), vr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, _l = H(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", Jr).getRegex(), wl = H("reflink|nolink(?!\\()", "g").replace("reflink", H(/^!?\[(label)\]\[(ref)\]/).replace("label", _l).replace("ref", vr).getRegex()).replace("nolink", H(/^!?\[(ref)\](?:\[\])?/).replace("ref", vr).getRegex()).getRegex(), br = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, xl = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/, Sl = H(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, xl).getRegex(), Qn = { _backpedal: ot, anyPunctuation: fl, autolink: gl, blockSkip: Js, br: Zr, code: Gs, del: ot, delLDelim: ot, delRDelim: ot, emStrongLDelim: el, emStrongRDelimAst: sl, emStrongRDelimUnd: il, escape: qs, link: vl, nolink: yl, punctuation: Zs, reflink: bl, reflinkSearch: wl, tag: kl, text: Ys, url: ot }, Tl = { ...Qn, emStrongLDelim: rl, emStrongRDelimAst: ol, emStrongRDelimUnd: cl, link: H(/^!?\[(label)\]\((.*?)\)/).replace("label", mn).getRegex(), reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", mn).getRegex() }, Un = { ...Qn, emStrongRDelimAst: ll, emStrongLDelim: tl, delLDelim: dl, delRDelim: hl, url: H(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Sl).replace("protocol", br).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: H(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", br).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() }, Al = { ...Un, br: H(Zr).replace("{2,}", "*").getRegex(), text: H(Un.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, cn = { normal: Xn, gfm: Vs, pedantic: Ws }, Mt = { normal: Qn, gfm: Un, breaks: Al, pedantic: Tl }, El = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, yr = (n) => El[n];
function Te(n, e) {
  if (e) {
    if (he.escapeTest.test(n)) return n.replace(he.escapeReplace, yr);
  } else if (he.escapeTestNoEncode.test(n)) return n.replace(he.escapeReplaceNoEncode, yr);
  return n;
}
function Rl(n) {
  return n.replace(he.numericCharacterReference, (e, t, r) => {
    let s = t === void 0 ? Number.parseInt(r, 16) : Number.parseInt(t, 10);
    return s === 0 || s > 1114111 || s >= 55296 && s <= 57343 ? "�" : String.fromCodePoint(s);
  });
}
function _r(n) {
  try {
    n = encodeURI(n).replace(he.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function wr(n, e) {
  let t = n.replace(he.findPipe, (a, i, o) => {
    let f = !1, m = i;
    for (; --m >= 0 && o[m] === "\\"; ) f = !f;
    return f ? "|" : " |";
  }), r = t.split(he.splitPipe), s = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; s < r.length; s++) r[s] = r[s].trim().replace(he.slashPipe, "|");
  return r;
}
function Je(n, e, t) {
  let r = n.length;
  if (r === 0) return "";
  let s = 0;
  for (; s < r && n.charAt(r - s - 1) === e; )
    s++;
  return n.slice(0, r - s);
}
function xr(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && he.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function kn(n) {
  return n.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Cl(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++) if (n[r] === "\\") r++;
  else if (n[r] === e[0]) t++;
  else if (n[r] === e[1] && (t--, t < 0)) return r;
  return t > 0 ? -2 : -1;
}
function Sr(n, e = 0) {
  let t = e, r = "";
  for (let s of n) if (s === "	") {
    let a = 4 - t % 4;
    r += " ".repeat(a), t += a;
  } else r += s, t++;
  return r;
}
function Tr(n, e, t, r, s) {
  let a = e.href, i = e.title || null, o = n[1].replace(s.other.outputLinkReplace, "$1"), f = n[0].charAt(0) === "!";
  r.state.inLink = !0;
  let m = r.state.linkEmitted, T = r.state.inRawBlock;
  r.state.linkEmitted = !1;
  let S = r.inlineTokens(o), M = r.state.linkEmitted;
  if (r.state.linkEmitted = m, r.state.inLink = !1, !f) {
    if (M) {
      r.state.inRawBlock = T;
      return;
    }
    r.state.linkEmitted = !0;
  }
  return { type: f ? "image" : "link", raw: t, href: a, title: i, text: o, tokens: S };
}
function $l(n, e, t) {
  let r = n.match(t.other.indentCodeCompensation);
  if (r === null) return e;
  let s = r[1];
  return e.split(`
`).map((a) => {
    let i = a.match(t.other.beginningSpace);
    if (i === null) return a;
    let [o] = i;
    return a.slice(Math.min(o.length, s.length));
  }).join(`
`);
}
function Ar(n, e, t, r) {
  if (!e.includes("<")) return !1;
  for (let s = 0; s < e.length; s++) {
    if (e[s] === "\\") {
      s++;
      continue;
    }
    if (e[s] === "`") {
      let o = r.inline.code.exec(e.slice(s));
      if (o) {
        s += o[0].length - 1;
        continue;
      }
    }
    if (e[s] !== "<") continue;
    let a = n.slice(t + s), i = r.inline.tag.exec(a) || r.inline.autolink.exec(a);
    if (i) {
      if (i[0].length > e.length - s) return !0;
      s += i[0].length - 1;
    }
  }
  return !1;
}
var vn = class {
  constructor(n) {
    J(this, "options");
    J(this, "rules");
    J(this, "lexer");
    this.options = n || ut;
  }
  space(n) {
    let e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(n) {
    let e = this.rules.block.code.exec(n);
    if (e) {
      let t = this.options.pedantic ? e[0] : xr(e[0]), r = t.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t, codeBlockStyle: "indented", text: r };
    }
  }
  fences(n) {
    let e = this.rules.block.fences.exec(n);
    if (e) {
      let t = e[0], r = $l(t, e[3] || "", this.rules);
      return { type: "code", raw: t, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(n) {
    let e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        let r = Je(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceTabChar.test(r)) && (t = r.trim());
      }
      return { type: "heading", raw: Je(e[0], `
`), depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(n) {
    let e = this.rules.block.hr.exec(n);
    if (e) return { type: "hr", raw: Je(e[0], `
`) };
  }
  blockquote(n) {
    let e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = Je(e[0], `
`).split(`
`), r = "", s = "", a = [];
      for (; t.length > 0; ) {
        let i = !1, o = [], f;
        for (f = 0; f < t.length; f++) if (this.rules.other.blockquoteStart.test(t[f])) o.push(t[f]), i = !0;
        else if (!i) o.push(t[f]);
        else break;
        t = t.slice(f);
        let m = o.join(`
`), T = m.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${m}` : m, s = s ? `${s}
${T}` : T;
        let S = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(T, a, !0), this.lexer.state.top = S, t.length === 0) break;
        let M = a.at(-1);
        if (M?.type === "code") break;
        if (M?.type === "blockquote") {
          let z = M, $ = t.join(`
`), G = z.raw + `
` + $.replace(this.rules.other.blockquoteSetextReplace2, ""), B = this.blockquote(G);
          a[a.length - 1] = B;
          let K = G.substring(B.raw.length).replace(/^\n/, ""), X = K ? K.split(`
`).length : 0, L = X ? t.slice(0, -X) : t;
          L.length > 0 && (r = `${r}
${L.join(`
`)}`), s = s.substring(0, s.length - z.text.length) + B.text;
          break;
        } else if (M?.type === "list") {
          let z = M, $ = z.raw + `
` + t.join(`
`), G = this.list($);
          a[a.length - 1] = G, r = r.substring(0, r.length - M.raw.length) + G.raw, s = s.substring(0, s.length - z.raw.length) + G.raw, t = $.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: a, text: s };
    }
  }
  list(n) {
    let e = this.rules.block.list.exec(n);
    if (e) {
      let t = e[1].trim(), r = t.length > 1, s = { type: "list", raw: "", ordered: r, start: r ? +t.slice(0, -1) : "", loose: !1, items: [] };
      t = r ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = r ? t : "[*+-]");
      let a = this.rules.other.listItemRegex(t), i = !1;
      for (; n; ) {
        let f = !1, m = "", T = "";
        if (!(e = a.exec(n)) || this.rules.block.hr.test(n)) break;
        m = e[0], n = n.substring(m.length);
        let S = e[2].split(`
`, 1)[0], M = e[1].length, z = this.options.pedantic ? Sr(S, M) : S.replace(this.rules.other.leadingSpaceTab, (K) => Sr(K, M)), $ = n.split(`
`, 1)[0], G = !z.trim(), B = 0;
        if (this.options.pedantic ? (B = 2, T = z.trimStart()) : G ? B = M + 1 : (B = z.search(this.rules.other.nonSpaceChar), B = B > 4 ? 1 : B, T = z.slice(B), B += M), G && this.rules.other.blankLine.test($) && (m += $ + `
`, n = n.substring($.length + 1), f = !0), !f) {
          let K = this.rules.other.nextBulletRegex(B), X = this.rules.other.hrRegex(B), L = this.rules.other.fencesBeginRegex(B), P = this.rules.other.headingBeginRegex(B), w = this.rules.other.htmlBeginRegex(B), y = this.rules.other.blockquoteBeginRegex(B);
          for (; n; ) {
            let R = n.split(`
`, 1)[0], E;
            if ($ = R, this.options.pedantic ? ($ = $.replace(this.rules.other.listReplaceNesting, "  "), E = $) : E = $.replace(this.rules.other.leadingSpaceTab, (C) => C.replace(this.rules.other.tabCharGlobal, "    ")), L.test($) || P.test($) || w.test($) || y.test($) || K.test($) || X.test($)) break;
            if (E.search(this.rules.other.nonSpaceChar) >= B || !$.trim()) T += `
` + E.slice(B);
            else {
              if (G || z.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || L.test(z) || P.test(z) || X.test(z)) break;
              T += `
` + $;
            }
            G = !$.trim(), m += R + `
`, n = n.substring(R.length + 1), z = E.slice(B);
          }
        }
        s.loose || (i ? s.loose = !0 : this.rules.other.doubleBlankLine.test(m) && (i = !0)), s.items.push({ type: "list_item", raw: m, task: !!this.options.gfm && this.rules.other.listIsTask.test(T), loose: !1, text: T, tokens: [] }), s.raw += m;
      }
      let o = s.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      s.raw = s.raw.trimEnd();
      for (let f of s.items) if (this.lexer.state.top = !1, f.tokens = this.lexer.blockTokens(f.text, []), !s.loose) {
        let m = f.tokens.filter((S) => S.type === "space"), T = m.length > 0 && m.some((S) => this.rules.other.anyLine.test(S.raw));
        s.loose = T;
      }
      for (let f of s.items) {
        let m = f.tokens[0];
        if (f.task && (m?.type === "text" || m?.type === "paragraph")) {
          f.text = f.text.replace(this.rules.other.listReplaceTask, ""), m.raw = m.raw.replace(this.rules.other.listReplaceTask, ""), m.text = m.text.replace(this.rules.other.listReplaceTask, "");
          for (let S = this.lexer.inlineQueue.length - 1; S >= 0; S--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[S].src)) {
            this.lexer.inlineQueue[S].src = this.lexer.inlineQueue[S].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let T = this.rules.other.listTaskCheckbox.exec(f.raw);
          if (T) {
            let S = { type: "checkbox", raw: T[0] + " ", checked: T[0] !== "[ ]" };
            f.checked = S.checked, s.loose ? f.tokens[0] && ["paragraph", "text"].includes(f.tokens[0].type) && "tokens" in f.tokens[0] && f.tokens[0].tokens ? (f.tokens[0].raw = S.raw + f.tokens[0].raw, f.tokens[0].text = S.raw + f.tokens[0].text, f.tokens[0].tokens.unshift(S)) : f.tokens.unshift({ type: "paragraph", raw: S.raw, text: S.raw, tokens: [S] }) : f.tokens.unshift(S);
          }
        } else f.task && (f.task = !1);
      }
      if (s.loose) for (let f of s.items) {
        f.loose = !0;
        for (let m of f.tokens) m.type === "text" && (m.type = "paragraph");
      }
      return s;
    }
  }
  html(n) {
    let e = this.rules.block.html.exec(n);
    if (e) {
      let t = xr(e[0]);
      return { type: "html", block: !0, raw: t, pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: t };
    }
  }
  def(n) {
    let e = this.rules.block.def.exec(n);
    if (e) {
      let t = kn(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: Je(e[0], `
`), href: r, title: s };
    }
  }
  table(n) {
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = wr(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: Je(e[0], `
`), header: [], align: [], rows: [] };
    if (t.length === r.length) {
      for (let i of r) this.rules.other.tableAlignRight.test(i) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? a.align.push("left") : a.align.push(null);
      for (let i = 0; i < t.length; i++) a.header.push({ text: t[i], tokens: this.lexer.inline(t[i]), header: !0, align: a.align[i] });
      for (let i of s) a.rows.push(wr(i, a.header.length).map((o, f) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: a.align[f] })));
      return a;
    }
  }
  lheading(n) {
    let e = this.rules.block.lheading.exec(n);
    if (e) {
      let t = e[1].trim();
      return { type: "heading", raw: Je(e[0], `
`), depth: e[2].charAt(0) === "=" ? 1 : 2, text: t, tokens: this.lexer.inline(t) };
    }
  }
  paragraph(n) {
    let e = this.rules.block.paragraph.exec(n);
    if (e) {
      let t = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: t, tokens: this.lexer.inline(t) };
    }
  }
  text(n) {
    let e = this.rules.block.text.exec(n);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(n) {
    let e = this.rules.inline.escape.exec(n);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(n) {
    let e = this.rules.inline.tag.exec(n);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(n) {
    let e = this.rules.inline.link.exec(n);
    if (e) {
      let t = e[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Ar(n, e[1], t, this.rules)) return;
      let r = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let i = Je(r.slice(0, -1), "\\");
        if ((r.length - i.length) % 2 === 0) return;
      } else {
        let i = Cl(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let o = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, o).trim(), e[3] = "";
        }
      }
      let s = e[2], a = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(s);
        i && (s = i[1], a = i[3]);
      } else a = e[3] ? e[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? s = s.slice(1) : s = s.slice(1, -1)), Tr(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: a && a.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      let r = t[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Ar(n, t[1], r, this.rules)) return;
      let s = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), a = e[kn(s)];
      if (!a) {
        let i = t[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return Tr(t, a, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...r[0]].length - 1, a, i, o = s, f = 0, m = r[0][0], T = t === m, S = m === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (S.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = S.exec(e)) !== null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
        if (i = [...a].length, r[3] || r[4]) {
          o += i;
          continue;
        } else if (r[5] || r[6]) {
          if (s % 3 && !((s + i) % 3)) {
            f += i;
            continue;
          }
          if (T) break;
        }
        if (o -= i, o > 0) continue;
        i = Math.min(i, i + o + f);
        let M = [...r[0]][0].length, z = n.slice(0, s + r.index + M + i);
        if (Math.min(s, i) % 2) {
          let G = z.slice(1, -1);
          return { type: "em", raw: z, text: G, tokens: this.lexer.inlineTokens(G) };
        }
        let $ = z.slice(2, -2);
        return { type: "strong", raw: z, text: $, tokens: this.lexer.inlineTokens($) };
      }
    }
  }
  codespan(n) {
    let e = this.rules.inline.code.exec(n);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(t), s = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return r && s && (t = t.substring(1, t.length - 1)), { type: "codespan", raw: e[0], text: t };
    }
  }
  br(n) {
    let e = this.rules.inline.br.exec(n);
    if (e) return { type: "br", raw: e[0] };
  }
  del(n, e, t = "") {
    let r = this.rules.inline.delLDelim.exec(n);
    if (r && (!r[1] || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...r[0]].length - 1, a, i, o = s, f = this.rules.inline.delRDelim;
      for (f.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = f.exec(e)) !== null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a || (i = [...a].length, i !== s)) continue;
        if (r[3] || r[4]) {
          o += i;
          continue;
        }
        if (o -= i, o > 0) continue;
        i = Math.min(i, i + o);
        let m = [...r[0]][0].length, T = n.slice(0, s + r.index + m + i), S = T.slice(s, -s);
        return { type: "del", raw: T, text: S, tokens: this.lexer.inlineTokens(S) };
      }
    }
  }
  autolink(n) {
    let e = this.rules.inline.autolink.exec(n);
    if (e) {
      let t, r;
      return e[2] === "@" ? (t = e[1], r = "mailto:" + t) : (t = e[1], r = t), { type: "link", raw: e[0], text: t, href: r, autolink: !0, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  url(n) {
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let t, r;
      if (e[2] === "@") t = e[0], r = "mailto:" + t;
      else {
        let s;
        do
          s = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (s !== e[0]);
        t = e[0], e[1] === "www." ? r = "http://" + e[0] : r = e[0];
      }
      return { type: "link", raw: e[0], text: t, href: r, autolink: !0, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  inlineText(n) {
    let e = this.rules.inline.text.exec(n);
    if (e) {
      let t = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: t ? e[0] : Rl(e[0]), escaped: t };
    }
  }
}, Ne = class Bn {
  constructor(e) {
    J(this, "tokens");
    J(this, "options");
    J(this, "state");
    J(this, "inlineQueue");
    J(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ut, this.options.tokenizer = this.options.tokenizer || new vn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, linkEmitted: !1, top: !0 };
    let t = { other: he, block: cn.normal, inline: Mt.normal };
    this.options.pedantic ? (t.block = cn.pedantic, t.inline = Mt.pedantic) : this.options.gfm && (t.block = cn.gfm, this.options.breaks ? t.inline = Mt.breaks : t.inline = Mt.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: cn, inline: Mt };
  }
  static lex(e, t) {
    return new Bn(t).lex(e);
  }
  static lexInline(e, t) {
    return new Bn(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(he.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(he.tabCharGlobal, "    ").replace(he.spaceLine, ""));
    let s = 1 / 0;
    for (; e; ) {
      if (e.length < s) s = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      let a;
      if (this.options.extensions?.block?.some((o) => (a = o.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), !0) : !1)) continue;
      if (a = this.tokenizer.space(e)) {
        e = e.substring(a.raw.length);
        let o = t.at(-1);
        a.raw.length === 1 && o !== void 0 ? o.raw += `
` : t.push(a);
        continue;
      }
      if (a = this.tokenizer.code(e)) {
        e = e.substring(a.raw.length);
        let o = t.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + a.raw, o.text += `
` + a.text, this.inlineQueue.at(-1).src = o.text) : t.push(a);
        continue;
      }
      if (a = this.tokenizer.fences(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.heading(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.hr(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.blockquote(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.list(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.html(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.def(e)) {
        e = e.substring(a.raw.length);
        let o = t.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + a.raw, o.text += `
` + a.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[a.tag] || (this.tokens.links[a.tag] = { href: a.href, title: a.title }, t.push(a));
        continue;
      }
      if (a = this.tokenizer.table(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.lheading(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let o = 1 / 0, f = e.slice(1), m;
        this.options.extensions.startBlock.forEach((T) => {
          m = T.call({ lexer: this }, f), typeof m == "number" && m >= 0 && (o = Math.min(o, m));
        }), o < 1 / 0 && o >= 0 && (i = e.substring(0, o + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(i))) {
        let o = t.at(-1);
        r && o?.type === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + a.raw, o.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(a), r = i.length !== e.length, e = e.substring(a.raw.length);
        continue;
      }
      if (a = this.tokenizer.text(e)) {
        e = e.substring(a.raw.length);
        let o = t.at(-1);
        o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + a.raw, o.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(a);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  linkInText(e) {
    if (!e.includes("[")) return !1;
    let t = this.tokenizer.rules.inline.link;
    for (let r of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (t.test(r[0]) && e.charAt(r.index - 1) !== "!") return !0;
    for (let r of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
      let s = r[0], a = s.lastIndexOf("[");
      if (!(s.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, kn(s.slice(a + 1, -1)))) && !(a > 1 && this.linkInText(s.slice(1, a - 1)))) return !0;
    }
    return !1;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let r = e;
    if (this.tokens.links && e.includes("[")) {
      let o = this.tokenizer.rules.inline.reflinkSearch, f = (m) => {
        let T = m.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, kn(m.slice(T + 1, -1)))) return m;
        if (T > 1 && m.charAt(0) !== "!") {
          let S = m.slice(1, T - 1);
          if (this.linkInText(S)) return "[" + S.replace(o, f) + "][" + "a".repeat(m.length - T - 2) + "]";
        }
        return "[" + "a".repeat(m.length - 2) + "]";
      };
      r = r.replace(o, f);
    }
    r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (o) => "+".repeat(o.length)), r = r.replace(this.tokenizer.rules.inline.blockSkip, (o, f, m) => {
      let T = m ? m.length : 0;
      return o.slice(0, T) + "[" + "a".repeat(o.length - T - 2) + "]";
    }), r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let s = !1, a = "", i = 1 / 0;
    for (; e; ) {
      if (e.length < i) i = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      s || (a = ""), s = !1;
      let o;
      if (this.options.extensions?.inline?.some((m) => (o = m.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let m = t.at(-1);
        o.type === "text" && m?.type === "text" ? (m.raw += o.raw, m.text += o.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, r, a)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e, r, a)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let f = e;
      if (this.options.extensions?.startInline) {
        let m = 1 / 0, T = e.slice(1), S;
        this.options.extensions.startInline.forEach((M) => {
          S = M.call({ lexer: this }, T), typeof S == "number" && S >= 0 && (m = Math.min(m, S));
        }), m < 1 / 0 && m >= 0 && (f = e.substring(0, m + 1));
      }
      if (o = this.tokenizer.inlineText(f)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (a = o.raw.slice(-1)), s = !0;
        let m = t.at(-1);
        m?.type === "text" ? (m.raw += o.raw, m.text += o.text) : t.push(o);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return t;
  }
  infiniteLoopError(e) {
    let t = "Infinite loop on byte: " + e;
    if (this.options.silent) console.error(t);
    else throw new Error(t);
  }
}, bn = class {
  constructor(n) {
    J(this, "options");
    J(this, "parser");
    this.options = n || ut;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    let r = (e || "").match(he.notSpaceStart)?.[0], s = n ? n.replace(he.endingNewline, "") + `
` : "";
    return r ? '<pre><code class="language-' + Te(r) + '">' + (t ? s : Te(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : Te(s, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: n }) {
    return `<blockquote>
${this.parser.parse(n)}</blockquote>
`;
  }
  html({ text: n }) {
    return n;
  }
  def(n) {
    return "";
  }
  heading({ tokens: n, depth: e }) {
    return `<h${e}>${this.parser.parseInline(n)}</h${e}>
`;
  }
  hr(n) {
    return `<hr>
`;
  }
  list(n) {
    let e = n.ordered, t = n.start, r = "";
    for (let i = 0; i < n.items.length; i++) {
      let o = n.items[i];
      r += this.listitem(o);
    }
    let s = e ? "ol" : "ul", a = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + s + a + `>
` + r + "</" + s + `>
`;
  }
  listitem(n) {
    return `<li>${this.parser.parse(n.tokens)}</li>
`;
  }
  checkbox({ checked: n }) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: n }) {
    return `<p>${this.parser.parseInline(n)}</p>
`;
  }
  table(n) {
    let e = "", t = "";
    for (let s = 0; s < n.header.length; s++) t += this.tablecell(n.header[s]);
    e += this.tablerow({ text: t });
    let r = "";
    for (let s = 0; s < n.rows.length; s++) {
      let a = n.rows[s];
      t = "";
      for (let i = 0; i < a.length; i++) t += this.tablecell(a[i]);
      r += this.tablerow({ text: t });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: n }) {
    return `<tr>
${n}</tr>
`;
  }
  tablecell(n) {
    let e = this.parser.parseInline(n.tokens), t = n.header ? "th" : "td";
    return (n.align ? `<${t} align="${n.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  strong({ tokens: n }) {
    return `<strong>${this.parser.parseInline(n)}</strong>`;
  }
  em({ tokens: n }) {
    return `<em>${this.parser.parseInline(n)}</em>`;
  }
  codespan({ text: n }) {
    return `<code>${Te(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, text: t, tokens: r, autolink: s }) {
    let a = s ? Te(t, !0) : this.parser.parseInline(r), i = _r(n);
    if (i === null) return a;
    n = Te(i, s);
    let o = '<a href="' + n + '"';
    return e && (o += ' title="' + Te(e) + '"'), o += ">" + a + "</a>", o;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    let s = _r(n);
    if (s === null) return Te(t);
    n = s;
    let a = `<img src="${Te(n)}" alt="${Te(t)}"`;
    return e && (a += ` title="${Te(e)}"`), a += ">", a;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : Te(n.text);
  }
}, Jn = class {
  strong({ text: n }) {
    return n;
  }
  em({ text: n }) {
    return n;
  }
  codespan({ text: n }) {
    return n;
  }
  del({ text: n }) {
    return n;
  }
  html({ text: n }) {
    return n;
  }
  text({ text: n }) {
    return n;
  }
  link({ text: n }) {
    return "" + n;
  }
  image({ text: n }) {
    return "" + n;
  }
  br() {
    return "";
  }
  checkbox({ raw: n }) {
    return n;
  }
}, ze = class Hn {
  constructor(e) {
    J(this, "options");
    J(this, "renderer");
    J(this, "textRenderer");
    this.options = e || ut, this.options.renderer = this.options.renderer || new bn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Jn();
  }
  static parse(e, t) {
    return new Hn(t).parse(e);
  }
  static parseInline(e, t) {
    return new Hn(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let r = 0; r < e.length; r++) {
      let s = e[r];
      if (this.options.extensions?.renderers?.[s.type]) {
        let i = s, o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(i.type)) {
          t += o || "";
          continue;
        }
      }
      let a = s;
      switch (a.type) {
        case "space": {
          t += this.renderer.space(a);
          break;
        }
        case "hr": {
          t += this.renderer.hr(a);
          break;
        }
        case "heading": {
          t += this.renderer.heading(a);
          break;
        }
        case "code": {
          t += this.renderer.code(a);
          break;
        }
        case "table": {
          t += this.renderer.table(a);
          break;
        }
        case "blockquote": {
          t += this.renderer.blockquote(a);
          break;
        }
        case "list": {
          t += this.renderer.list(a);
          break;
        }
        case "checkbox": {
          t += this.renderer.checkbox(a);
          break;
        }
        case "html": {
          t += this.renderer.html(a);
          break;
        }
        case "def": {
          t += this.renderer.def(a);
          break;
        }
        case "paragraph": {
          t += this.renderer.paragraph(a);
          break;
        }
        case "text": {
          t += this.renderer.text(a);
          break;
        }
        default: {
          let i = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    this.renderer.parser = this;
    let r = "";
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (this.options.extensions?.renderers?.[a.type]) {
        let o = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (o !== !1 || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          r += o || "";
          continue;
        }
      }
      let i = a;
      switch (i.type) {
        case "escape": {
          r += t.text(i);
          break;
        }
        case "html": {
          r += t.html(i);
          break;
        }
        case "link": {
          r += t.link(i);
          break;
        }
        case "image": {
          r += t.image(i);
          break;
        }
        case "checkbox": {
          r += t.checkbox(i);
          break;
        }
        case "strong": {
          r += t.strong(i);
          break;
        }
        case "em": {
          r += t.em(i);
          break;
        }
        case "codespan": {
          r += t.codespan(i);
          break;
        }
        case "br": {
          r += t.br(i);
          break;
        }
        case "del": {
          r += t.del(i);
          break;
        }
        case "text": {
          r += t.text(i);
          break;
        }
        default: {
          let o = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return r;
  }
}, fn, Bt = (fn = class {
  constructor(n) {
    J(this, "options");
    J(this, "block");
    this.options = n || ut;
  }
  preprocess(n) {
    return n;
  }
  postprocess(n) {
    return n;
  }
  processAllTokens(n) {
    return n;
  }
  emStrongMask(n) {
    return n;
  }
  provideLexer(n = this.block) {
    return n ? Ne.lex : Ne.lexInline;
  }
  provideParser(n = this.block) {
    return n ? ze.parse : ze.parseInline;
  }
}, J(fn, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), J(fn, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), fn), Ll = class {
  constructor(...n) {
    J(this, "defaults", qn());
    J(this, "options", this.setOptions);
    J(this, "parse", this.parseMarkdown(!0));
    J(this, "parseInline", this.parseMarkdown(!1));
    J(this, "Parser", ze);
    J(this, "Renderer", bn);
    J(this, "TextRenderer", Jn);
    J(this, "Lexer", Ne);
    J(this, "Tokenizer", vn);
    J(this, "Hooks", Bt);
    this.use(...n);
  }
  walkTokens(n, e) {
    let t = [];
    for (let r of n) switch (t = t.concat(e.call(this, r)), r.type) {
      case "table": {
        let s = r;
        for (let a of s.header) t = t.concat(this.walkTokens(a.tokens, e));
        for (let a of s.rows) for (let i of a) t = t.concat(this.walkTokens(i.tokens, e));
        break;
      }
      case "list": {
        let s = r;
        t = t.concat(this.walkTokens(s.items, e));
        break;
      }
      default: {
        let s = r;
        this.defaults.extensions?.childTokens?.[s.type] ? this.defaults.extensions.childTokens[s.type].forEach((a) => {
          let i = s[a].flat(1 / 0);
          t = t.concat(this.walkTokens(i, e));
        }) : s.tokens && (t = t.concat(this.walkTokens(s.tokens, e)));
      }
    }
    return t;
  }
  use(...n) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      let r = { ...t };
      if (r.async = this.defaults.async || r.async || !1, t.extensions && (t.extensions.forEach((s) => {
        if (!s.name) throw new Error("extension name required");
        if ("renderer" in s) {
          let a = e.renderers[s.name];
          a ? e.renderers[s.name] = function(...i) {
            let o = s.renderer.apply(this, i);
            return o === !1 && (o = a.apply(this, i)), o;
          } : e.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = e[s.level];
          a ? a.unshift(s.tokenizer) : e[s.level] = [s.tokenizer], s.start && (s.level === "block" ? e.startBlock ? e.startBlock.push(s.start) : e.startBlock = [s.start] : s.level === "inline" && (e.startInline ? e.startInline.push(s.start) : e.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (e.childTokens[s.name] = s.childTokens);
      }), r.extensions = e), t.renderer) {
        let s = this.defaults.renderer || new bn(this.defaults);
        for (let a in t.renderer) {
          if (!(a in s)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let i = a, o = t.renderer[i], f = s[i];
          s[i] = (...m) => {
            let T = o.apply(s, m);
            return T === !1 && (T = f.apply(s, m)), T || "";
          };
        }
        r.renderer = s;
      }
      if (t.tokenizer) {
        let s = this.defaults.tokenizer || new vn(this.defaults);
        for (let a in t.tokenizer) {
          if (!(a in s)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let i = a, o = t.tokenizer[i], f = s[i];
          s[i] = (...m) => {
            let T = o.apply(s, m);
            return T === !1 && (T = f.apply(s, m)), T;
          };
        }
        r.tokenizer = s;
      }
      if (t.hooks) {
        let s = this.defaults.hooks || new Bt();
        for (let a in t.hooks) {
          if (!(a in s)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let i = a, o = t.hooks[i], f = s[i];
          Bt.passThroughHooks.has(a) ? s[i] = (m) => {
            if (this.defaults.async && Bt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let S = await o.call(s, m);
              return f.call(s, S);
            })();
            let T = o.call(s, m);
            return f.call(s, T);
          } : s[i] = (...m) => {
            if (this.defaults.async) return (async () => {
              let S = await o.apply(s, m);
              return S === !1 && (S = await f.apply(s, m)), S;
            })();
            let T = o.apply(s, m);
            return T === !1 && (T = f.apply(s, m)), T;
          };
        }
        r.hooks = s;
      }
      if (t.walkTokens) {
        let s = this.defaults.walkTokens, a = t.walkTokens;
        r.walkTokens = function(i) {
          let o = [];
          return o.push(a.call(this, i)), s && (o = o.concat(s.call(this, i))), o;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return Ne.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return ze.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let r = { ...t }, s = { ...this.defaults, ...r }, a = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && r.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = n), s.async) return (async () => {
        let i = s.hooks ? await s.hooks.preprocess(e) : e, o = await (s.hooks ? await s.hooks.provideLexer(n) : n ? Ne.lex : Ne.lexInline)(i, s), f = s.hooks ? await s.hooks.processAllTokens(o) : o;
        s.walkTokens && await Promise.all(this.walkTokens(f, s.walkTokens));
        let m = await (s.hooks ? await s.hooks.provideParser(n) : n ? ze.parse : ze.parseInline)(f, s);
        return s.hooks ? await s.hooks.postprocess(m) : m;
      })().catch(a);
      try {
        s.hooks && (e = s.hooks.preprocess(e));
        let i = (s.hooks ? s.hooks.provideLexer(n) : n ? Ne.lex : Ne.lexInline)(e, s);
        s.hooks && (i = s.hooks.processAllTokens(i)), s.walkTokens && this.walkTokens(i, s.walkTokens);
        let o = (s.hooks ? s.hooks.provideParser(n) : n ? ze.parse : ze.parseInline)(i, s);
        return s.hooks && (o = s.hooks.postprocess(o)), o;
      } catch (i) {
        return a(i);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        let r = "<p>An error occurred:</p><pre>" + Te(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, it = new Ll();
function ee(n, e) {
  return it.parse(n, e);
}
ee.options = ee.setOptions = function(n) {
  return it.setOptions(n), ee.defaults = it.defaults, Wr(ee.defaults), ee;
};
ee.getDefaults = qn;
ee.defaults = ut;
function Il(...n) {
  return it.use(...n), ee.defaults = it.defaults, Wr(ee.defaults), ee;
}
ee.use = Il;
ee.walkTokens = function(n, e) {
  return it.walkTokens(n, e);
};
ee.parseInline = it.parseInline;
ee.Parser = ze;
ee.parser = ze.parse;
ee.Renderer = bn;
ee.TextRenderer = Jn;
ee.Lexer = Ne;
ee.lexer = Ne.lex;
ee.Tokenizer = vn;
ee.Hooks = Bt;
ee.parse = ee;
ee.options;
ee.setOptions;
ee.walkTokens;
ee.parseInline;
ze.parse;
Ne.lex;
/*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE */
function Er(n, e) {
  (e == null || e > n.length) && (e = n.length);
  for (var t = 0, r = Array(e); t < e; t++) r[t] = n[t];
  return r;
}
function Ol(n) {
  if (Array.isArray(n)) return n;
}
function Pl(n, e) {
  var t = n == null ? null : typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
  if (t != null) {
    var r, s, a, i, o = [], f = !0, m = !1;
    try {
      if (a = (t = t.call(n)).next, e !== 0) for (; !(f = (r = a.call(t)).done) && (o.push(r.value), o.length !== e); f = !0) ;
    } catch (T) {
      m = !0, s = T;
    } finally {
      try {
        if (!f && t.return != null && (i = t.return(), Object(i) !== i)) return;
      } finally {
        if (m) throw s;
      }
    }
    return o;
  }
}
function Dl() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
function Ml(n, e) {
  return Ol(n) || Pl(n, e) || Nl(n, e) || Dl();
}
function Nl(n, e) {
  if (n) {
    if (typeof n == "string") return Er(n, e);
    var t = {}.toString.call(n).slice(8, -1);
    return t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set" ? Array.from(n) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Er(n, e) : void 0;
  }
}
const es = Object.entries, Rr = Object.setPrototypeOf, zl = Object.isFrozen, Fl = Object.getPrototypeOf, Ul = Object.getOwnPropertyDescriptor;
let de = Object.freeze, pe = Object.seal, xt = Object.create, ts = typeof Reflect < "u" && Reflect, jn = ts.apply, Vn = ts.construct;
de || (de = function(e) {
  return e;
});
pe || (pe = function(e) {
  return e;
});
jn || (jn = function(e, t) {
  for (var r = arguments.length, s = new Array(r > 2 ? r - 2 : 0), a = 2; a < r; a++) s[a - 2] = arguments[a];
  return e.apply(t, s);
});
Vn || (Vn = function(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) r[s - 1] = arguments[s];
  return new e(...r);
});
const at = ce(Array.prototype.forEach), Bl = ce(Array.prototype.lastIndexOf), Cr = ce(Array.prototype.pop), Nt = ce(Array.prototype.push), Hl = ce(Array.prototype.splice), Tt = Array.isArray, Ht = ce(String.prototype.toLowerCase), Pn = ce(String.prototype.toString), $r = ce(String.prototype.match), zt = ce(String.prototype.replace), Lr = ce(String.prototype.indexOf), jl = ce(String.prototype.trim), Vl = ce(Number.prototype.toString), Wl = ce(Boolean.prototype.toString), Ir = typeof BigInt > "u" ? null : ce(BigInt.prototype.toString), Or = typeof Symbol > "u" ? null : ce(Symbol.prototype.toString), be = ce(Object.prototype.hasOwnProperty), Ft = ce(Object.prototype.toString), ge = ce(RegExp.prototype.test), et = ql(TypeError);
function ce(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) r[s - 1] = arguments[s];
    return jn(n, e, r);
  };
}
function ql(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
    return Vn(n, t);
  };
}
function q(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ht;
  if (Rr && Rr(n, null), !Tt(e)) return n;
  let r = e.length;
  for (; r--; ) {
    let s = e[r];
    if (typeof s == "string") {
      const a = t(s);
      a !== s && (zl(e) || (e[r] = a), s = a);
    }
    n[s] = !0;
  }
  return n;
}
function Gl(n) {
  for (let e = 0; e < n.length; e++) be(n, e) || (n[e] = null);
  return n;
}
function Ae(n) {
  const e = xt(null);
  for (const r of es(n)) {
    var t = Ml(r, 2);
    const s = t[0], a = t[1];
    be(n, s) && (Tt(a) ? e[s] = Gl(a) : a && typeof a == "object" && a.constructor === Object ? e[s] = Ae(a) : e[s] = a);
  }
  return e;
}
function Yl(n) {
  switch (typeof n) {
    case "string":
      return n;
    case "number":
      return Vl(n);
    case "boolean":
      return Wl(n);
    case "bigint":
      return Ir ? Ir(n) : "0";
    case "symbol":
      return Or ? Or(n) : "Symbol()";
    case "undefined":
      return Ft(n);
    case "function":
    case "object": {
      if (n === null) return Ft(n);
      const e = n, t = $e(e, "toString");
      if (typeof t == "function") {
        const r = t(e);
        return typeof r == "string" ? r : Ft(r);
      }
      return Ft(n);
    }
    default:
      return Ft(n);
  }
}
function $e(n, e) {
  for (; n !== null; ) {
    const r = Ul(n, e);
    if (r) {
      if (r.get) return ce(r.get);
      if (typeof r.value == "function") return ce(r.value);
    }
    n = Fl(n);
  }
  function t() {
    return null;
  }
  return t;
}
function Zl(n) {
  try {
    return ge(n, ""), !0;
  } catch {
    return !1;
  }
}
const Pr = de([
  "a",
  "abbr",
  "acronym",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "content",
  "data",
  "datalist",
  "dd",
  "decorator",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meter",
  "nav",
  "nobr",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "search",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
]), Dn = de([
  "svg",
  "a",
  "altglyph",
  "altglyphdef",
  "altglyphitem",
  "animatecolor",
  "animatemotion",
  "animatetransform",
  "circle",
  "clippath",
  "defs",
  "desc",
  "ellipse",
  "enterkeyhint",
  "exportparts",
  "filter",
  "font",
  "g",
  "glyph",
  "glyphref",
  "hkern",
  "image",
  "inputmode",
  "line",
  "lineargradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "part",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "stop",
  "style",
  "switch",
  "symbol",
  "text",
  "textpath",
  "title",
  "tref",
  "tspan",
  "view",
  "vkern"
]), Mn = de([
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence"
]), Kl = de([
  "animate",
  "color-profile",
  "cursor",
  "discard",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignobject",
  "hatch",
  "hatchpath",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "missing-glyph",
  "script",
  "set",
  "solidcolor",
  "unknown",
  "use"
]), Nn = de([
  "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "mprescripts"
]), Xl = de([
  "maction",
  "maligngroup",
  "malignmark",
  "mlongdiv",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "msline",
  "msrow",
  "semantics",
  "annotation",
  "annotation-xml",
  "mprescripts",
  "none"
]), Dr = de(["#text"]), Mr = de([
  "accept",
  "action",
  "align",
  "alt",
  "autocapitalize",
  "autocomplete",
  "autopictureinpicture",
  "autoplay",
  "background",
  "bgcolor",
  "border",
  "capture",
  "cellpadding",
  "cellspacing",
  "checked",
  "cite",
  "class",
  "clear",
  "color",
  "cols",
  "colspan",
  "command",
  "commandfor",
  "controls",
  "controlslist",
  "coords",
  "crossorigin",
  "datetime",
  "decoding",
  "default",
  "dir",
  "disabled",
  "disablepictureinpicture",
  "disableremoteplayback",
  "download",
  "draggable",
  "enctype",
  "enterkeyhint",
  "exportparts",
  "face",
  "for",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "id",
  "inert",
  "inputmode",
  "integrity",
  "ismap",
  "kind",
  "label",
  "lang",
  "list",
  "loading",
  "loop",
  "low",
  "max",
  "maxlength",
  "media",
  "method",
  "min",
  "minlength",
  "multiple",
  "muted",
  "name",
  "nonce",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "optimum",
  "part",
  "pattern",
  "placeholder",
  "playsinline",
  "popover",
  "popovertarget",
  "popovertargetaction",
  "poster",
  "preload",
  "pubdate",
  "radiogroup",
  "readonly",
  "rel",
  "required",
  "rev",
  "reversed",
  "role",
  "rows",
  "rowspan",
  "spellcheck",
  "scope",
  "selected",
  "shape",
  "size",
  "sizes",
  "slot",
  "span",
  "srclang",
  "start",
  "src",
  "srcset",
  "step",
  "style",
  "summary",
  "tabindex",
  "title",
  "translate",
  "type",
  "usemap",
  "valign",
  "value",
  "width",
  "wrap",
  "xmlns"
]), zn = de([
  "accent-height",
  "accumulate",
  "additive",
  "alignment-baseline",
  "amplitude",
  "ascent",
  "attributename",
  "attributetype",
  "azimuth",
  "basefrequency",
  "baseline-shift",
  "begin",
  "bias",
  "by",
  "class",
  "clip",
  "clippathunits",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "cx",
  "cy",
  "d",
  "dx",
  "dy",
  "diffuseconstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "edgemode",
  "elevation",
  "end",
  "exponent",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterunits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyph-name",
  "glyphref",
  "gradientunits",
  "gradienttransform",
  "height",
  "href",
  "id",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kerning",
  "keypoints",
  "keysplines",
  "keytimes",
  "lang",
  "lengthadjust",
  "letter-spacing",
  "kernelmatrix",
  "kernelunitlength",
  "lighting-color",
  "local",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerheight",
  "markerunits",
  "markerwidth",
  "maskcontentunits",
  "maskunits",
  "max",
  "mask",
  "mask-type",
  "media",
  "method",
  "mode",
  "min",
  "name",
  "numoctaves",
  "offset",
  "operator",
  "opacity",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "paint-order",
  "path",
  "pathlength",
  "patterncontentunits",
  "patterntransform",
  "patternunits",
  "pointer-events",
  "points",
  "preservealpha",
  "preserveaspectratio",
  "primitiveunits",
  "r",
  "rx",
  "ry",
  "radius",
  "refx",
  "refy",
  "repeatcount",
  "repeatdur",
  "restart",
  "result",
  "rotate",
  "scale",
  "seed",
  "shape-rendering",
  "slope",
  "specularconstant",
  "specularexponent",
  "spreadmethod",
  "startoffset",
  "stddeviation",
  "stitchtiles",
  "stop-color",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke",
  "stroke-width",
  "style",
  "surfacescale",
  "systemlanguage",
  "tabindex",
  "tablevalues",
  "targetx",
  "targety",
  "transform",
  "transform-origin",
  "text-anchor",
  "text-decoration",
  "text-orientation",
  "text-rendering",
  "textlength",
  "type",
  "u1",
  "u2",
  "unicode",
  "values",
  "vector-effect",
  "viewbox",
  "visibility",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "width",
  "word-spacing",
  "wrap",
  "writing-mode",
  "xchannelselector",
  "ychannelselector",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
  "z",
  "zoomandpan"
]), Nr = de([
  "accent",
  "accentunder",
  "align",
  "bevelled",
  "close",
  "columnalign",
  "columnlines",
  "columnspacing",
  "columnspan",
  "denomalign",
  "depth",
  "dir",
  "display",
  "displaystyle",
  "encoding",
  "fence",
  "frame",
  "height",
  "href",
  "id",
  "largeop",
  "length",
  "linethickness",
  "lquote",
  "lspace",
  "mathbackground",
  "mathcolor",
  "mathsize",
  "mathvariant",
  "maxsize",
  "minsize",
  "movablelimits",
  "notation",
  "numalign",
  "open",
  "rowalign",
  "rowlines",
  "rowspacing",
  "rowspan",
  "rspace",
  "rquote",
  "scriptlevel",
  "scriptminsize",
  "scriptsizemultiplier",
  "selection",
  "separator",
  "separators",
  "stretchy",
  "subscriptshift",
  "supscriptshift",
  "symmetric",
  "voffset",
  "width",
  "xmlns"
]), dn = de([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Ql = pe(/{{[\w\W]*|^[\w\W]*}}/g), Jl = pe(/<%[\w\W]*|^[\w\W]*%>/g), ea = pe(/\${[\w\W]*/g), ta = pe(/^data-[\-\w.\u00B7-\uFFFF]+$/), na = pe(/^aria-[\-\w]+$/), zr = pe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), ra = pe(/^(?:\w+script|data):/i), sa = pe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), la = pe(/^html$/i), aa = pe(/^[a-z][.\w]*(-[.\w]+)+$/i), Fr = pe(/<[/\w!]/g), Ur = pe(/<[/\w]/g), oa = pe(/<\/no(script|embed|frames)/i), ia = pe(/\/>/i), Se = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  entityNode: 6,
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
}, ns = [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
], ua = de(q({}, ns)), ca = function() {
  const n = {};
  return at(ns, (e) => {
    n[e] = pe(new RegExp("</" + e + "(?=[\\t\\n\\f\\r />])", "i"));
  }), de(n);
}(), da = function() {
  return typeof window > "u" ? null : window;
}, pa = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function") return null;
  let r = null;
  const s = "data-tt-policy-suffix";
  t && t.hasAttribute(s) && (r = t.getAttribute(s));
  const a = "dompurify" + (r ? "#" + r : "");
  try {
    return e.createPolicy(a, {
      createHTML(i) {
        return i;
      },
      createScriptURL(i) {
        return i;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + a + " could not be created."), null;
  }
}, Br = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
}, tt = function(e, t, r, s) {
  return be(e, t) && Tt(e[t]) ? q(s.base ? Ae(s.base) : {}, e[t], s.transform) : r;
}, Fn = function(e, t, r) {
  const s = be(e, t) ? e[t] : void 0;
  return s && typeof s == "object" ? Ae(s) : r();
};
function rs() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : da();
  const e = (x) => rs(x);
  if (e.version = "3.4.16", e.removed = [], !n || !n.document || n.document.nodeType !== Se.document || !n.Element)
    return e.isSupported = !1, e;
  let t = n.document;
  const r = t, s = r.currentScript;
  n.DocumentFragment;
  const a = n.HTMLTemplateElement, i = n.Node, o = n.Element, f = n.NodeFilter;
  n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const m = n.DOMParser, T = n.trustedTypes, S = o.prototype, M = $e(S, "cloneNode"), z = $e(S, "remove"), $ = $e(S, "removeAttributeNode"), G = $e(S, "nextSibling"), B = $e(S, "childNodes"), K = $e(S, "parentNode"), X = $e(S, "shadowRoot"), L = $e(S, "attributes"), P = i && i.prototype ? $e(i.prototype, "nodeType") : null, w = i && i.prototype ? $e(i.prototype, "nodeName") : null, y = i && i.prototype ? $e(i.prototype, "ownerDocument") : null, R = function(l) {
    return P ? P(l) : l.nodeType;
  }, E = function(l) {
    return w ? w(l) : l.nodeName;
  };
  if (typeof a == "function") {
    const x = t.createElement("template");
    x.content && x.content.ownerDocument && (t = x.content.ownerDocument);
  }
  let C, _ = "", I, Z = !1, Q = 0;
  const fe = function() {
    if (Q > 0) throw et('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, me = function(l) {
    fe(), Q++;
    try {
      return C.createHTML(l);
    } finally {
      Q--;
    }
  }, rt = function(l) {
    fe(), Q++;
    try {
      return C.createScriptURL(l);
    } finally {
      Q--;
    }
  }, wn = function() {
    return Z || (I = pa(T, s), Z = !0), I;
  }, ct = t, Fe = ct.implementation, Gt = ct.createNodeIterator, Rt = ct.createDocumentFragment, Yt = ct.getElementsByTagName, xn = r.importNode;
  let O = Br();
  e.isSupported = typeof es == "function" && typeof K == "function" && Fe && Fe.createHTMLDocument !== void 0;
  const Zt = Ql, Kt = Jl, Xt = ea, Sn = ta, Qt = na, Jt = ra, re = sa, ke = aa;
  let Ue = zr, Y = null;
  const Re = q({}, [
    ...Pr,
    ...Dn,
    ...Mn,
    ...Nn,
    ...Dr
  ]);
  let j = null;
  const Ze = q({}, [
    ...Mr,
    ...zn,
    ...Nr,
    ...dn
  ]);
  let te = Object.seal(xt(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), Ie = null, Ct = null;
  const Oe = Object.seal(xt(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let ue = !0, Pe = !0, Ke = !1, dt = !0, _e = !1, Be = !0, He = !1, $t = !1, pt = null, Xe = null, De = !1, qe = !1, st = !1, ht = !1, Lt = !0, It = !1;
  const en = "user-content-";
  let ft = !0, Ot = !1, je = {}, d = null;
  const h = q({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let p = null;
  const N = q({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let Tn = null;
  const tr = q({}, [
    "alt",
    "class",
    "for",
    "id",
    "label",
    "name",
    "pattern",
    "placeholder",
    "role",
    "summary",
    "title",
    "value",
    "style",
    "xmlns"
  ]), tn = "http://www.w3.org/1998/Math/MathML", nn = "http://www.w3.org/2000/svg", Ve = "http://www.w3.org/1999/xhtml";
  let gt = Ve, An = !1, En = null;
  const os = q({}, [
    tn,
    nn,
    Ve
  ], Pn), nr = de([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let Rn = q({}, nr);
  const rr = de(["annotation-xml"]);
  let Cn = q({}, rr);
  const is = q({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let Pt = null;
  const us = ["application/xhtml+xml", "text/html"], cs = "text/html";
  let ie = null, mt = null;
  const ds = t.createElement("form"), sr = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, $n = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (mt && mt === l) return;
    (!l || typeof l != "object") && (l = {}), l = Ae(l), Pt = us.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? cs : l.PARSER_MEDIA_TYPE, ie = Pt === "application/xhtml+xml" ? Pn : Ht, Y = tt(l, "ALLOWED_TAGS", Re, { transform: ie }), j = tt(l, "ALLOWED_ATTR", Ze, { transform: ie }), En = tt(l, "ALLOWED_NAMESPACES", os, { transform: Pn }), Tn = tt(l, "ADD_URI_SAFE_ATTR", tr, {
      transform: ie,
      base: tr
    }), p = tt(l, "ADD_DATA_URI_TAGS", N, {
      transform: ie,
      base: N
    }), d = tt(l, "FORBID_CONTENTS", h, { transform: ie }), Ie = tt(l, "FORBID_TAGS", Ae({}), { transform: ie }), Ct = tt(l, "FORBID_ATTR", Ae({}), { transform: ie }), je = be(l, "USE_PROFILES") ? l.USE_PROFILES && typeof l.USE_PROFILES == "object" ? Ae(l.USE_PROFILES) : l.USE_PROFILES : !1, ue = l.ALLOW_ARIA_ATTR !== !1, Pe = l.ALLOW_DATA_ATTR !== !1, Ke = l.ALLOW_UNKNOWN_PROTOCOLS || !1, dt = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, _e = l.SAFE_FOR_TEMPLATES || !1, Be = l.SAFE_FOR_XML !== !1, He = l.WHOLE_DOCUMENT || !1, qe = l.RETURN_DOM || !1, st = l.RETURN_DOM_FRAGMENT || !1, ht = l.RETURN_TRUSTED_TYPE || !1, De = l.FORCE_BODY || !1, Lt = l.SANITIZE_DOM !== !1, It = l.SANITIZE_NAMED_PROPS || !1, ft = l.KEEP_CONTENT !== !1, Ot = l.IN_PLACE || !1, Ue = Zl(l.ALLOWED_URI_REGEXP) ? l.ALLOWED_URI_REGEXP : zr, gt = typeof l.NAMESPACE == "string" ? l.NAMESPACE : Ve, Rn = Fn(l, "MATHML_TEXT_INTEGRATION_POINTS", () => q({}, nr)), Cn = Fn(l, "HTML_INTEGRATION_POINTS", () => q({}, rr));
    const c = Fn(l, "CUSTOM_ELEMENT_HANDLING", () => xt(null));
    if (te = xt(null), be(c, "tagNameCheck") && sr(c.tagNameCheck) && (te.tagNameCheck = c.tagNameCheck), be(c, "attributeNameCheck") && sr(c.attributeNameCheck) && (te.attributeNameCheck = c.attributeNameCheck), be(c, "allowCustomizedBuiltInElements") && typeof c.allowCustomizedBuiltInElements == "boolean" && (te.allowCustomizedBuiltInElements = c.allowCustomizedBuiltInElements), pe(te), _e && (Pe = !1), st && (qe = !0), je && (Y = q({}, Dr), j = xt(null), je.html === !0 && (q(Y, Pr), q(j, Mr)), je.svg === !0 && (q(Y, Dn), q(j, zn), q(j, dn)), je.svgFilters === !0 && (q(Y, Mn), q(j, zn), q(j, dn)), je.mathMl === !0 && (q(Y, Nn), q(j, Nr), q(j, dn))), Oe.tagCheck = null, Oe.attributeCheck = null, be(l, "ADD_TAGS") && (typeof l.ADD_TAGS == "function" ? Oe.tagCheck = l.ADD_TAGS : Tt(l.ADD_TAGS) && (Y === Re && (Y = Ae(Y)), q(Y, l.ADD_TAGS, ie))), be(l, "ADD_ATTR") && (typeof l.ADD_ATTR == "function" ? Oe.attributeCheck = l.ADD_ATTR : Tt(l.ADD_ATTR) && (j === Ze && (j = Ae(j)), q(j, l.ADD_ATTR, ie))), be(l, "ADD_FORBID_CONTENTS") && Tt(l.ADD_FORBID_CONTENTS) && (d === h && (d = Ae(d)), q(d, l.ADD_FORBID_CONTENTS, ie)), ft && (Y["#text"] = !0), He && q(Y, [
      "html",
      "head",
      "body"
    ]), Y.table && (q(Y, ["tbody"]), delete Ie.tbody), l.TRUSTED_TYPES_POLICY) {
      if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function") throw et('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw et('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const b = C;
      C = l.TRUSTED_TYPES_POLICY;
      try {
        _ = me("");
      } catch (A) {
        throw C = b, A;
      }
    } else l.TRUSTED_TYPES_POLICY === null ? (C = void 0, _ = "") : (C === void 0 && (C = wn()), C && typeof _ == "string" && (_ = me("")));
    de && de(l), mt = l;
  }, lr = q({}, [
    ...Dn,
    ...Mn,
    ...Kl
  ]), ar = q({}, [...Nn, ...Xl]), ps = function(l, c, b) {
    return c.namespaceURI === Ve ? l === "svg" : c.namespaceURI === tn ? l === "svg" && (b === "annotation-xml" || Rn[b]) : !!lr[l];
  }, hs = function(l, c, b) {
    return c.namespaceURI === Ve ? l === "math" : c.namespaceURI === nn ? l === "math" && Cn[b] : !!ar[l];
  }, fs = function(l, c, b) {
    return c.namespaceURI === nn && !Cn[b] || c.namespaceURI === tn && !Rn[b] ? !1 : !ar[l] && (is[l] || !lr[l]);
  }, gs = function(l) {
    let c = K(l);
    (!c || !c.tagName) && (c = {
      namespaceURI: gt,
      tagName: "template"
    });
    const b = Ht(l.tagName), A = Ht(c.tagName);
    return En[l.namespaceURI] ? l.namespaceURI === nn ? ps(b, c, A) : l.namespaceURI === tn ? hs(b, c, A) : l.namespaceURI === Ve ? fs(b, c, A) : !!(Pt === "application/xhtml+xml" && En[l.namespaceURI]) : !1;
  }, Qe = function(l) {
    Nt(e.removed, { element: l });
    try {
      K(l).removeChild(l);
    } catch {
      if (z(l), !K(l)) throw et("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, or = function(l, c, b) {
    try {
      $(l, c);
    } catch {
      try {
        l.removeAttribute(b);
      } catch {
      }
    }
  }, rn = function(l) {
    sn(l);
    const c = B(l);
    if (c) {
      const A = [];
      at(c, (D) => {
        Nt(A, D);
      }), at(A, (D) => {
        try {
          z(D);
        } catch {
        }
      });
    }
    const b = L(l);
    if (b) for (let A = b.length - 1; A >= 0; --A) {
      const D = b[A], V = D && D.name;
      typeof V == "string" && or(l, D, V);
    }
  }, lt = function(l, c, b) {
    if (!b) try {
      b = c.getAttributeNode(l);
    } catch {
      b = null;
    }
    Nt(e.removed, {
      attribute: b || null,
      from: c
    });
    try {
      b ? $(c, b) : c.removeAttribute(l);
    } catch {
      try {
        c.removeAttribute(l);
      } catch {
      }
    }
    if (l === "is")
      if (qe || st) try {
        Qe(c);
      } catch {
      }
      else try {
        c.setAttribute(l, "");
      } catch {
      }
  }, ms = function(l) {
    const c = L(l);
    if (c)
      for (let b = c.length - 1; b >= 0; --b) {
        const A = c[b], D = A && A.name;
        typeof D != "string" || j[ie(D)] || or(l, A, D);
      }
  }, sn = function(l) {
    const c = [l];
    for (; c.length > 0; ) {
      const b = c.pop();
      R(b) === Se.element && ms(b);
      const A = B(b);
      if (A) for (let D = A.length - 1; D >= 0; --D) c.push(A[D]);
    }
  }, ir = function(l, c) {
    return Be ? l === "patchsrc" ? !0 : l === "for" && c !== "label" && c !== "output" : !1;
  }, ks = function(l) {
    if (!Be) return;
    const c = [l];
    for (; c.length > 0; ) {
      const b = c.pop(), A = R(b);
      if (A === Se.processingInstruction || A === Se.comment && ge(Ur, b.data)) {
        try {
          z(b);
        } catch {
        }
        continue;
      }
      if (A === Se.element) {
        const V = b, W = ie(E(b));
        try {
          V.hasAttribute && V.hasAttribute("patchsrc") && V.removeAttribute("patchsrc"), V.hasAttribute && V.hasAttribute("for") && ir("for", W) && V.removeAttribute("for");
        } catch {
        }
      }
      const D = B(b);
      if (D) for (let V = D.length - 1; V >= 0; --V) c.push(D[V]);
    }
  }, ur = function(l) {
    let c = null, b = null;
    if (De) l = "<remove></remove>" + l;
    else {
      const V = $r(l, /^[\r\n\t ]+/);
      b = V && V[0];
    }
    Pt === "application/xhtml+xml" && gt === Ve && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const A = C ? me(l) : l;
    if (gt === Ve) try {
      c = new m().parseFromString(A, Pt);
    } catch {
    }
    if (!c || !c.documentElement) {
      c = Fe.createDocument(gt, "template", null);
      try {
        c.documentElement.innerHTML = An ? _ : A;
      } catch {
      }
    }
    const D = c.body || c.documentElement;
    return l && b && D.insertBefore(t.createTextNode(b), D.childNodes[0] || null), gt === Ve ? Yt.call(c, He ? "html" : "body")[0] : He ? c.documentElement : D;
  }, cr = function(l) {
    const c = y ? y(l) : l.ownerDocument;
    return Gt.call(c || l, l, f.SHOW_ELEMENT | f.SHOW_COMMENT | f.SHOW_TEXT | f.SHOW_PROCESSING_INSTRUCTION | f.SHOW_CDATA_SECTION, null);
  }, ln = function(l) {
    return l = zt(l, Zt, " "), l = zt(l, Kt, " "), l = zt(l, Xt, " "), l;
  }, Ln = function(l) {
    var c;
    l.normalize();
    const b = y ? y(l) : l.ownerDocument, A = Gt.call(b || l, l, f.SHOW_TEXT | f.SHOW_COMMENT | f.SHOW_CDATA_SECTION | f.SHOW_PROCESSING_INSTRUCTION, null);
    let D = A.nextNode();
    for (; D; )
      D.data = ln(D.data), D = A.nextNode();
    const V = (c = l.querySelectorAll) === null || c === void 0 ? void 0 : c.call(l, "template");
    V && at(V, (W) => {
      kt(W.content) && Ln(W.content);
    });
  }, an = function(l) {
    const c = w ? w(l) : null;
    return typeof c != "string" || ie(c) !== "form" ? !1 : typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || l.attributes !== L(l) || typeof l.removeAttribute != "function" || typeof l.removeAttributeNode != "function" || typeof l.getAttributeNode != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function" || l.nodeType !== P(l) || l.childNodes !== B(l);
  }, kt = function(l) {
    if (!P || typeof l != "object" || l === null) return !1;
    try {
      return P(l) === Se.documentFragment;
    } catch {
      return !1;
    }
  }, Dt = function(l) {
    if (!P || typeof l != "object" || l === null) return !1;
    try {
      return typeof P(l) == "number";
    } catch {
      return !1;
    }
  };
  function We(x, l, c) {
    x.length !== 0 && at(x, (b) => {
      b.call(e, l, c, mt);
    });
  }
  const vs = function(l, c) {
    return !!(Be && l.hasChildNodes() && !Dt(l.firstElementChild) && ge(Fr, l.textContent) && ge(Fr, l.innerHTML) || Be && l.namespaceURI === Ve && ua[c] && (Dt(l.firstElementChild) || typeof l.textContent == "string" && ge(ca[c], l.textContent)) || l.nodeType === Se.processingInstruction || Be && l.nodeType === Se.comment && ge(Ur, l.data));
  }, on = function(l, c) {
    if (l instanceof RegExp) return ge(l, c);
    if (l instanceof Function) {
      for (var b = arguments.length, A = new Array(b > 2 ? b - 2 : 0), D = 2; D < b; D++) A[D - 2] = arguments[D];
      return !!l(c, ...A);
    }
    return !1;
  }, bs = function(l, c, b) {
    if (!Ie[c] && fr(c) && on(te.tagNameCheck, c)) return !1;
    if (ft && !d[c]) {
      const A = K(l), D = B(l);
      if (D && A) {
        const V = D.length;
        for (let W = V - 1; W >= 0; --W) {
          const ae = l === b ? M(D[W], !0) : D[W];
          A.insertBefore(ae, G(l));
        }
      }
    }
    return Qe(l), !0;
  }, dr = function(l, c, b, A) {
    return l.length === 0 ? c : c === b || c === A ? Ae(c) : c;
  }, vt = function(l, c) {
    return l === c || K(l) !== null ? !1 : (Ot && sn(l), !0);
  }, pr = function(l, c) {
    if (We(O.beforeSanitizeElements, l, null), vt(l, c)) return !0;
    if (an(l))
      return Qe(l), !0;
    const b = ie(E(l));
    if (Y = dr(O.uponSanitizeElement, Y, Re, pt), We(O.uponSanitizeElement, l, {
      tagName: b,
      allowedTags: Y
    }), vt(l, c)) return !0;
    if (vs(l, b))
      return Qe(l), !0;
    if (Ie[b] || !(Oe.tagCheck instanceof Function && Oe.tagCheck(b)) && !Y[b]) {
      const A = bs(l, b, c);
      return A === !1 && (We(O.afterSanitizeElements, l, null), vt(l, c)) ? !0 : A;
    }
    if (R(l) === Se.element && !gs(l) || (b === "noscript" || b === "noembed" || b === "noframes") && ge(oa, l.innerHTML))
      return Qe(l), !0;
    if (_e && l.nodeType === Se.text) {
      const A = ln(l.textContent);
      l.textContent !== A && (Nt(e.removed, { element: l.cloneNode() }), l.textContent = A);
    }
    return We(O.afterSanitizeElements, l, null), vt(l, c);
  }, hr = function(l, c, b) {
    if (Ct[c] || ir(c, l) || Lt && (c === "id" || c === "name") && (b in t || b in ds)) return !1;
    const A = j[c] || Oe.attributeCheck instanceof Function && Oe.attributeCheck(c, l);
    return Pe && ge(Sn, c) || ue && ge(Qt, c) ? !0 : A ? Tn[c] || ge(Ue, zt(b, re, "")) || (c === "src" || c === "xlink:href" || c === "href") && l !== "script" && Lr(b, "data:") === 0 && p[l] || Ke && !ge(Jt, zt(b, re, "")) ? !0 : !b : fr(l) && on(te.tagNameCheck, l) && on(te.attributeNameCheck, c, l) || c === "is" && te.allowCustomizedBuiltInElements && on(te.tagNameCheck, b);
  }, ys = q({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), fr = function(l) {
    return !ys[Ht(l)] && ge(ke, l);
  }, _s = function(l, c, b, A) {
    if (C && typeof T == "object" && typeof T.getAttributeType == "function" && !b) switch (T.getAttributeType(l, c)) {
      case "TrustedHTML":
        return me(A);
      case "TrustedScriptURL":
        return rt(A);
    }
    return A;
  }, ws = function(l, c, b, A) {
    try {
      return b ? l.setAttributeNS(b, c, A) : l.setAttribute(c, A), an(l) ? (Qe(l), !1) : !0;
    } catch {
      return lt(c, l), !1;
    }
  }, gr = function(l, c) {
    if (We(O.beforeSanitizeAttributes, l, null), vt(l, c)) return;
    const b = l.attributes;
    if (!b || an(l)) return;
    j = dr(O.uponSanitizeAttribute, j, Ze, Xe);
    const A = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: j,
      forceKeepAttr: void 0
    };
    let D = b.length;
    const V = ie(l.nodeName);
    for (; D--; ) {
      const W = b[D], ae = W.name, Ce = W.namespaceURI, we = W.value, bt = ie(ae), On = we;
      let ve = ae === "value" ? On : jl(On), mr = !1;
      if (A.attrName = bt, A.attrValue = ve, A.keepAttr = !0, A.forceKeepAttr = void 0, We(O.uponSanitizeAttribute, l, A), ve = A.attrValue, It && (bt === "id" || bt === "name") && Lr(ve, en) !== 0 && (lt(ae, l, W), ve = en + ve, mr = !0), Be && ge(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, ve)) {
        lt(ae, l, W);
        continue;
      }
      if (bt === "attributename" && $r(ve, "href")) {
        lt(ae, l, W);
        continue;
      }
      if (!A.forceKeepAttr) {
        if (!A.keepAttr) {
          lt(ae, l, W);
          continue;
        }
        if (!dt && ge(ia, ve)) {
          lt(ae, l, W);
          continue;
        }
        if (_e && (ve = ln(ve)), !hr(V, bt, ve)) {
          lt(ae, l, W);
          continue;
        }
        ve = _s(V, bt, Ce, ve), ve !== On && ws(l, ae, Ce, ve) && mr && Cr(e.removed);
      }
    }
    We(O.afterSanitizeAttributes, l, null), vt(l, c);
  }, un = function(l) {
    let c = null;
    const b = cr(l);
    for (We(O.beforeSanitizeShadowDOM, l, null); c = b.nextNode(); )
      if (We(O.uponSanitizeShadowNode, c, null), pr(c, l), gr(c, l), kt(c.content) && un(c.content), R(c) === Se.element) {
        const A = X(c);
        kt(A) && (In(A), un(A));
      }
    We(O.afterSanitizeShadowDOM, l, null);
  }, In = function(l) {
    const c = [{
      node: l,
      shadow: null
    }];
    for (; c.length > 0; ) {
      const b = c.pop();
      if (b.shadow) {
        un(b.shadow);
        continue;
      }
      const A = b.node, D = R(A) === Se.element, V = B(A);
      if (V) for (let W = V.length - 1; W >= 0; --W) c.push({
        node: V[W],
        shadow: null
      });
      if (D) {
        const W = w ? w(A) : null;
        if (typeof W == "string" && ie(W) === "template") {
          const ae = A.content;
          kt(ae) && c.push({
            node: ae,
            shadow: null
          });
        }
      }
      if (D) {
        const W = X(A);
        kt(W) && c.push({
          node: null,
          shadow: W
        }, {
          node: W,
          shadow: null
        });
      }
    }
  };
  return e.sanitize = function(x) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, c = null, b = null, A = null, D = null;
    if (An = !x, An && (x = "<!-->"), typeof x != "string" && !Dt(x) && (x = Yl(x), typeof x != "string"))
      throw et("dirty is not a string, aborting");
    if (!e.isSupported) return x;
    $t ? (Y = pt, j = Xe) : $n(l), (O.uponSanitizeElement.length > 0 || O.uponSanitizeAttribute.length > 0) && (Y = Ae(Y)), O.uponSanitizeAttribute.length > 0 && (j = Ae(j)), e.removed = [];
    const V = Ot && typeof x != "string" && Dt(x);
    if (V) {
      ks(x);
      const Ce = E(x);
      if (typeof Ce == "string") {
        const we = ie(Ce);
        if (!Y[we] || Ie[we])
          throw rn(x), et("root node is forbidden and cannot be sanitized in-place");
      }
      if (an(x))
        throw rn(x), et("root node is clobbered and cannot be sanitized in-place");
      try {
        In(x);
      } catch (we) {
        throw rn(x), we;
      }
    } else if (Dt(x))
      c = ur("<!---->"), b = c.ownerDocument.importNode(x, !0), b.nodeType === Se.element && b.nodeName === "BODY" || b.nodeName === "HTML" ? c = b : c.appendChild(b), In(c);
    else {
      if (!qe && !_e && !He && x.indexOf("<") === -1) return C && ht ? me(x) : x;
      if (c = ur(x), !c) return qe ? null : ht ? _ : "";
    }
    c && De && Qe(c.firstChild);
    const W = V ? x : c;
    try {
      const Ce = cr(W);
      for (; A = Ce.nextNode(); )
        pr(A, W), gr(A, W), kt(A.content) && un(A.content);
    } catch (Ce) {
      throw V && (rn(x), at(e.removed, (we) => {
        we.element && sn(we.element);
      })), Ce;
    }
    if (V) {
      let Ce = !1;
      if (at(e.removed, (we) => {
        we.element && (we.element === x && (Ce = !0), sn(we.element));
      }), Ce) throw et("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return _e && Ln(x), x;
    }
    if (qe) {
      if (_e && Ln(c), st)
        for (D = Rt.call(c.ownerDocument); c.firstChild; ) D.appendChild(c.firstChild);
      else D = c;
      return (j.shadowroot || j.shadowrootmode) && (D = xn.call(r, D, !0)), D;
    }
    let ae = He ? c.outerHTML : c.innerHTML;
    return He && Y["!doctype"] && c.ownerDocument && c.ownerDocument.doctype && c.ownerDocument.doctype.name && ge(la, c.ownerDocument.doctype.name) && (ae = "<!DOCTYPE " + c.ownerDocument.doctype.name + `>
` + ae), _e && (ae = ln(ae)), C && ht ? me(ae) : ae;
  }, e.setConfig = function() {
    let x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    $n(x), $t = !0, pt = Y, Xe = j;
  }, e.clearConfig = function() {
    mt = null, $t = !1, pt = null, Xe = null, C = I, _ = "";
  }, e.isValidAttribute = function(x, l, c) {
    mt || $n({});
    const b = ie(x), A = ie(l);
    return hr(b, A, c);
  }, e.addHook = function(x, l) {
    typeof l == "function" && be(O, x) && Nt(O[x], l);
  }, e.removeHook = function(x, l) {
    if (be(O, x)) {
      if (l !== void 0) {
        const c = Bl(O[x], l);
        return c === -1 ? void 0 : Hl(O[x], c, 1)[0];
      }
      return Cr(O[x]);
    }
  }, e.removeHooks = function(x) {
    be(O, x) && (O[x] = []);
  }, e.removeAllHooks = function() {
    O = Br();
  }, e;
}
var ha = rs();
const fa = ["innerHTML"], ga = /* @__PURE__ */ At({
  __name: "MarkdownContent",
  props: {
    content: {}
  },
  setup(n) {
    const e = n, t = se(() => ha.sanitize(ee.parse(e.content, { async: !1, breaks: !0 })));
    return (r, s) => (k(), v("div", {
      class: "markdown-content",
      innerHTML: t.value
    }, null, 8, fa));
  }
}), er = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, s] of e)
    t[r] = s;
  return t;
}, pn = /* @__PURE__ */ er(ga, [["__scopeId", "data-v-ef377647"]]);
function ss() {
  const n = localStorage.getItem("0kay_lang");
  return n === "en" || n === "zh" ? n : navigator.language.startsWith("zh") ? "zh" : "en";
}
const Ge = U(ss());
function ma() {
  Ge.value = ss();
}
const ka = { class: "tool-kind" }, va = { class: "tool-summary" }, ba = {
  key: 0,
  class: "tool-stat"
}, ya = { class: "tool-state" }, _a = {
  key: 0,
  class: "tool-card-body"
}, wa = {
  key: 0,
  class: "muted"
}, xa = {
  key: 0,
  class: "tool-section-label"
}, Sa = { key: 1 }, Ta = {
  key: 2,
  class: "tool-section-text"
}, Aa = {
  key: 1,
  class: "muted"
}, Ea = {
  key: 2,
  class: "tool-error"
}, Ra = ["aria-label"], Ca = ["aria-label", "title"], $a = {
  key: 0,
  class: "muted"
}, La = {
  key: 1,
  class: "tool-search-results"
}, Ia = ["href"], Oa = { key: 0 }, Pa = { key: 1 }, Da = {
  key: 2,
  class: "muted"
}, Ma = {
  key: 3,
  class: "tool-error"
}, Na = /* @__PURE__ */ At({
  __name: "ToolStepCard",
  props: {
    step: {},
    formatError: { type: Function }
  },
  setup(n) {
    const e = n, t = (w, y) => Ge.value === "en" ? y : w, r = U(!1), s = U(!1), a = se(() => (e.step.prompt || "").trim() || "tool"), i = se(() => ["websearch", "web_search", "search"].includes(a.value)), o = se(() => {
      if (!e.step.args) return null;
      try {
        const w = JSON.parse(e.step.args);
        return w && typeof w == "object" && !Array.isArray(w) ? w : null;
      } catch {
        return null;
      }
    }), f = se(() => {
      if (!e.step.result) return null;
      try {
        return JSON.parse(e.step.result);
      } catch {
        return e.step.result;
      }
    }), m = se(() => {
      const w = f.value;
      return !w || typeof w != "object" || Array.isArray(w) ? null : w.data !== void 0 && w.data !== null && typeof w.data == "object" && !Array.isArray(w.data) ? w.data : "success" in w ? null : w;
    }), T = se(() => {
      switch (a.value) {
        case "websearch":
        case "web_search":
        case "search":
          return t("搜索", "Search");
        case "bash":
          return "Bash";
        case "write":
          return t("写入", "Write");
        case "edit":
        case "apply_patch":
          return t("编辑", "Edit");
        case "read":
          return t("读取", "Read");
        case "webfetch":
          return t("请求", "Fetch");
        case "todowrite":
          return t("待办", "Todo");
        case "task":
          return t("子任务", "Subtask");
        case "skills_admin":
        case "skill":
          return t("技能", "Skill");
        default:
          return t("工具", "Tool");
      }
    }), S = (w) => (Ge.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[w] || w;
    function M(w) {
      let y = 0, R = 0;
      for (const E of String(w || "").split(`
`))
        E.startsWith("---") || E.startsWith("+++") || (E.startsWith("+") ? y++ : E.startsWith("-") && R++);
      return { added: y, removed: R };
    }
    const z = se(() => {
      const w = a.value, y = m.value;
      if (!y) return "";
      if (w === "write") return typeof y.lines == "number" ? `+${y.lines} ${t("行", "lines")}` : "";
      if (w === "edit") {
        const { added: R, removed: E } = M(y.diff);
        return R || E ? `+${R} −${E}` : "";
      }
      if (w === "apply_patch" && Array.isArray(y.files)) {
        let R = 0, E = 0;
        for (const C of y.files) {
          const _ = M(C?.diff);
          R += _.added, E += _.removed;
        }
        return R || E ? `+${R} −${E}` : "";
      }
      return "";
    }), $ = se(() => {
      const w = a.value, y = o.value, R = m.value, E = (C, _ = 160) => (C || "").length > _ ? `${C.slice(0, _)}…` : C || "";
      if (i.value) {
        const C = E(String(R?.query ?? y?.query ?? "")), _ = Array.isArray(R?.results) ? R.results.length : 0;
        return C + (_ ? ` · ${_} ${t("条结果", "results")}` : "");
      }
      if (w === "bash") {
        const C = E(String(y?.command ?? "")), _ = R && R.exitCode !== void 0 && e.step.state !== "running" ? ` · ${t("退出码", "exit")} ${R.exitCode}` : "";
        return C + _;
      }
      if (w === "webfetch")
        return E(String(R?.url ?? y?.url ?? "")) + (R?.status !== void 0 && R?.status !== null ? ` · HTTP ${R.status}` : "");
      if (w === "read" || w === "write") return E(String(R?.path ?? y?.filePath ?? ""));
      if (w === "edit") return E(String(y?.filePath ?? R?.path ?? ""));
      if (w === "apply_patch") {
        const C = Array.isArray(y?.patches) ? y.patches.map((_) => _?.filePath).filter(Boolean) : Array.isArray(R?.files) ? R.files.map((_) => _?.path).filter(Boolean) : [];
        return E(C.join(", "));
      }
      if (y && Object.keys(y).length)
        try {
          return E(JSON.stringify(y));
        } catch {
        }
      return E(String(e.step.args || ""));
    }), G = se(() => String(m.value?.query ?? o.value?.query ?? e.step.args ?? "")), B = se(() => Array.isArray(m.value?.results) ? m.value.results : []), K = se(() => typeof f.value == "string" ? f.value : f.value === null && e.step.result ? e.step.result : ""), X = se(() => {
      const w = a.value, y = m.value;
      if (w === "bash" && y) {
        const E = [{ label: t("工作目录", "cwd"), text: String(y.cwd || "") }];
        return y.stdout && E.push({ label: "stdout", text: String(y.stdout), mono: !0 }), y.stderr && E.push({ label: "stderr", text: String(y.stderr), mono: !0 }), !y.stdout && !y.stderr && E.push({ label: "", text: t("（无输出）", "(no output)") }), E;
      }
      if (w === "write" && y) {
        const E = [{ label: t("文件", "File"), text: String(y.path || "") }];
        return E.push({ label: t("内容", "Content"), text: `${typeof y.lines == "number" ? y.lines : "—"} ${t("行", "lines")}${y.created ? ` · ${t("新建文件", "created")}` : ""} · ${y.bytes ?? "—"} B` }), E;
      }
      if (w === "edit" && y)
        return [
          { label: t("文件", "File"), text: String(y.path || "") },
          { label: `diff${typeof y.replacements == "number" && y.replacements > 1 ? ` · ×${y.replacements}` : ""}`, text: String(y.diff || ""), mono: !0 }
        ];
      if (w === "apply_patch" && Array.isArray(y?.files) && y.files.length) {
        const E = [];
        for (const C of y.files)
          E.push({ label: t("文件", "File"), text: String(C?.path || "") }), C?.diff && E.push({ label: "diff", text: String(C.diff), mono: !0 });
        return E;
      }
      if (w === "read" && y) {
        const E = [{ label: t("文件", "File"), text: String(y.path || "") }];
        return E.push({ label: `${t("第", "line")} ${y.offset ?? "—"} ${t("行起", "onward")}`, text: String(y.content || ""), mono: !0 }), E;
      }
      if (w === "webfetch" && y)
        return [
          { label: "URL", text: String(y.url || "") },
          { label: t("内容", "Content"), text: String(y.content || ""), mono: !0 }
        ];
      const R = e.step.result;
      if (!R) return [];
      try {
        return [{ label: "JSON", text: JSON.stringify(f.value, null, 2), mono: !0 }];
      } catch {
        return [{ label: "", text: String(R), mono: !0 }];
      }
    });
    function L() {
      if (i.value) {
        s.value = !s.value;
        return;
      }
      r.value = !r.value;
    }
    function P(w) {
      w.key === "Escape" && s.value && (s.value = !1);
    }
    return yn(() => window.addEventListener("keydown", P)), _n(() => window.removeEventListener("keydown", P)), (w, y) => (k(), v("div", {
      class: oe(["tool-card", { expanded: r.value }])
    }, [
      u("button", {
        type: "button",
        class: "tool-card-head",
        onClick: L
      }, [
        u("span", {
          class: oe(["tool-dot", n.step.state])
        }, "●", 2),
        u("strong", ka, g(T.value), 1),
        u("span", va, g($.value), 1),
        z.value ? (k(), v("small", ba, g(z.value), 1)) : F("", !0),
        u("small", ya, g(S(n.step.state)), 1),
        y[2] || (y[2] = u("span", {
          class: "tool-chevron",
          "aria-hidden": "true"
        }, "▸", -1))
      ]),
      r.value && !i.value ? (k(), v("div", _a, [
        n.step.state === "running" && !X.value.length ? (k(), v("p", wa, g(t("执行中…", "Running…")), 1)) : F("", !0),
        (k(!0), v(le, null, ye(X.value, (R, E) => (k(), v(le, { key: E }, [
          R.label ? (k(), v("small", xa, g(R.label), 1)) : F("", !0),
          R.mono ? (k(), v("pre", Sa, g(R.text), 1)) : (k(), v("p", Ta, g(R.text), 1))
        ], 64))), 128)),
        !X.value.length && n.step.state !== "running" && !n.step.error ? (k(), v("p", Aa, g(t("执行完成，无输出", "Completed with no output")), 1)) : F("", !0),
        n.step.error ? (k(), v("p", Ea, g(n.formatError?.(n.step.error) || n.step.error), 1)) : F("", !0)
      ])) : F("", !0),
      s.value ? (k(), v("div", {
        key: 1,
        class: "tool-dialog-backdrop",
        onClick: y[1] || (y[1] = Le((R) => s.value = !1, ["self"]))
      }, [
        u("section", {
          class: "tool-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t("搜索结果", "Search results")
        }, [
          u("header", null, [
            u("h4", null, g(t("搜索", "Search")) + " · " + g(G.value), 1),
            u("button", {
              type: "button",
              class: "tool-dialog-close",
              "aria-label": t("关闭", "Close"),
              title: t("关闭", "Close"),
              onClick: y[0] || (y[0] = (R) => s.value = !1)
            }, [...y[3] || (y[3] = [
              u("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                u("path", {
                  d: "M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                })
              ], -1)
            ])], 8, Ca)
          ]),
          n.step.state === "running" ? (k(), v("p", $a, g(t("搜索中…", "Searching…")), 1)) : B.value.length ? (k(), v("ol", La, [
            (k(!0), v(le, null, ye(B.value, (R, E) => (k(), v("li", { key: E }, [
              u("a", {
                href: R.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }, g(R.title || R.url), 9, Ia),
              R.snippet ? (k(), v("p", Oa, g(R.snippet), 1)) : F("", !0),
              R.title && R.url ? (k(), v("small", Pa, g(R.url), 1)) : F("", !0)
            ]))), 128))
          ])) : (k(), v("p", Da, g(K.value || t("没有找到相关结果。", "No relevant results found.")), 1)),
          n.step.error ? (k(), v("p", Ma, g(n.formatError?.(n.step.error) || n.step.error), 1)) : F("", !0)
        ], 8, Ra)
      ])) : F("", !0)
    ], 2));
  }
}), Hr = /* @__PURE__ */ er(Na, [["__scopeId", "data-v-79ca3a33"]]);
function ls(n = "") {
  const e = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`;
  return n ? `${n}-${e}` : e;
}
const za = ["aria-expanded", "aria-controls", "aria-activedescendant", "aria-label", "disabled"], Fa = { class: "app-select-value" }, Ua = {
  class: "app-select-chevron",
  "aria-hidden": "true"
}, Ba = ["id", "aria-label"], Ha = {
  key: 0,
  class: "app-select-search"
}, ja = ["placeholder"], Va = ["id", "aria-selected", "aria-disabled", "data-index", "onPointermove", "onClick"], Wa = {
  key: 0,
  class: "app-select-check",
  "aria-hidden": "true"
}, qa = {
  key: 1,
  class: "app-select-empty"
}, hn = /* @__PURE__ */ At({
  inheritAttrs: !1,
  __name: "AppSelect",
  props: {
    modelValue: { default: "" },
    options: {},
    disabled: { type: Boolean, default: !1 },
    placeholder: { default: "请选择" },
    ariaLabel: {},
    searchable: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue", "change", "focus", "open"],
  setup(n, { emit: e }) {
    const t = n, r = e, s = U(null), a = U(null), i = U(null), o = U(!1), f = U(-1), m = U({}), T = U(!1), S = U(""), M = ls("select"), z = se(() => t.options.map((_) => typeof _ == "string" ? { value: _, label: _ } : _)), $ = se(() => {
      if (!t.searchable || !S.value.trim()) return z.value;
      const _ = S.value.trim().toLocaleLowerCase();
      return z.value.filter((I) => I.label.toLocaleLowerCase().includes(_) || I.value.toLocaleLowerCase().includes(_));
    }), G = se(() => z.value.find((_) => _.value === t.modelValue)?.label || t.modelValue || t.placeholder);
    let B = "", K = 0;
    function X() {
      const _ = s.value?.getBoundingClientRect();
      if (!_) return;
      const I = window.visualViewport?.height || innerHeight, Z = window.visualViewport?.width || innerWidth, Q = I - _.bottom - 10, fe = _.top - 10;
      T.value = Q < Math.min(280, $.value.length * 46 + 58) && fe > Q;
      const me = Math.max(48, Math.min(340, T.value ? fe : Q)), rt = Math.min(Math.max(_.width, 220), Z - 16);
      m.value = { position: "fixed", left: `${Math.max(8, Math.min(_.left, Z - rt - 8))}px`, width: `${rt}px`, maxHeight: `${me}px`, ...T.value ? { bottom: `${I - _.top + 8}px` } : { top: `${_.bottom + 8}px` } };
    }
    function L(_ = !1) {
      o.value = !1, S.value = "", B = "", _ && s.value?.focus();
    }
    async function P() {
      t.disabled || o.value || (o.value = !0, S.value = "", f.value = $.value.findIndex((_) => _.value === t.modelValue && !_.disabled), f.value < 0 && (f.value = $.value.findIndex((_) => !_.disabled)), X(), r("open"), await nt(), t.searchable && i.value?.focus(), w());
    }
    function w() {
      a.value?.querySelector(`[data-index="${f.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function y(_) {
      const I = $.value[_];
      !I || I.disabled || (r("update:modelValue", I.value), r("change", I.value), L(!0));
    }
    async function R(_) {
      if (!(t.disabled || _.isComposing)) {
        if (_.key === "Tab") {
          L();
          return;
        }
        if (_.key === "Escape") {
          o.value && (_.preventDefault(), L(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(_.key)) {
          if (t.searchable && _.key === " ") return;
          if (_.preventDefault(), !o.value) {
            await P();
            return;
          }
          if (_.key === "Enter") {
            y(f.value);
            return;
          }
          const I = $.value.map((Q, fe) => Q.disabled ? -1 : fe).filter((Q) => Q >= 0);
          if (!I.length) return;
          const Z = I.indexOf(f.value);
          f.value = _.key === "Home" ? I[0] : _.key === "End" ? I[I.length - 1] : I[(Z + (_.key === "ArrowDown" ? 1 : -1) + I.length) % I.length], await nt(), w();
          return;
        }
        if (!t.searchable && _.key.length === 1 && !_.ctrlKey && !_.metaKey && !_.altKey) {
          await P();
          const I = Date.now();
          B = I - K > 700 ? _.key : B + _.key, K = I;
          const Z = $.value.findIndex((Q) => !Q.disabled && Q.label.toLocaleLowerCase().startsWith(B.toLocaleLowerCase()));
          Z >= 0 && (f.value = Z, await nt(), w());
        }
      }
    }
    function E(_) {
      const I = _.target;
      !s.value?.contains(I) && !a.value?.contains(I) && L();
    }
    function C(_) {
      o.value && (!(_.target instanceof Node) || !a.value?.contains(_.target)) && X();
    }
    return Ee(() => t.disabled, (_) => {
      _ && L();
    }), Ee($, () => {
      o.value && (f.value >= $.value.length && (f.value = $.value.findIndex((_) => !_.disabled)), nt(X));
    }), Ee(S, () => {
      o.value && (f.value = $.value.findIndex((_) => !_.disabled), nt(w));
    }), yn(() => {
      document.addEventListener("pointerdown", E, !0), window.addEventListener("resize", X), window.addEventListener("scroll", C, !0);
    }), _n(() => {
      document.removeEventListener("pointerdown", E, !0), window.removeEventListener("resize", X), window.removeEventListener("scroll", C, !0);
    }), (_, I) => (k(), v("div", As(_.$attrs, {
      class: ["app-select", { "is-disabled": n.disabled, "is-open": o.value }]
    }), [
      u("button", {
        ref_key: "trigger",
        ref: s,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": o.value,
        "aria-controls": o.value ? ne(M) : void 0,
        "aria-activedescendant": o.value && f.value >= 0 ? `${ne(M)}-${f.value}` : void 0,
        "aria-label": n.ariaLabel,
        disabled: n.disabled,
        onClick: I[0] || (I[0] = (Z) => o.value ? L() : P()),
        onKeydown: R,
        onFocus: I[1] || (I[1] = (Z) => r("focus", Z))
      }, [
        u("span", Fa, g(G.value), 1),
        u("span", Ua, [
          (k(), v("svg", {
            class: oe({ "is-open": o.value }),
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none"
          }, [...I[4] || (I[4] = [
            u("path", {
              d: "m6 9 6 6 6-6",
              stroke: "currentColor",
              "stroke-width": "1.9",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, null, -1)
          ])], 2))
        ])
      ], 40, za),
      (k(), St(Wn, { to: "body" }, [
        Me(jr, { name: "select-menu" }, {
          default: Vr(() => [
            o.value ? (k(), v("div", {
              key: 0,
              id: ne(M),
              ref_key: "menu",
              ref: a,
              class: oe(["app-select-menu", { "opens-up": T.value }]),
              style: jt(m.value),
              role: "listbox",
              "aria-label": n.ariaLabel || "选项",
              onPointerdown: I[3] || (I[3] = Le(() => {
              }, ["prevent"]))
            }, [
              n.searchable ? (k(), v("label", Ha, [
                I[5] || (I[5] = u("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  u("circle", {
                    cx: "11",
                    cy: "11",
                    r: "7",
                    stroke: "currentColor",
                    "stroke-width": "1.8"
                  }),
                  u("path", {
                    d: "m20 20-3.5-3.5",
                    stroke: "currentColor",
                    "stroke-width": "1.8",
                    "stroke-linecap": "round"
                  })
                ], -1)),
                Ut(u("input", {
                  ref_key: "searchInput",
                  ref: i,
                  "onUpdate:modelValue": I[2] || (I[2] = (Z) => S.value = Z),
                  type: "text",
                  placeholder: ne(Ge) === "en" ? "Search…" : "搜索…",
                  onKeydown: R
                }, null, 40, ja), [
                  [gn, S.value]
                ])
              ])) : F("", !0),
              (k(!0), v(le, null, ye($.value, (Z, Q) => (k(), v("div", {
                id: `${ne(M)}-${Q}`,
                key: `${Z.value}:${Q}`,
                role: "option",
                "aria-selected": Z.value === n.modelValue,
                "aria-disabled": !!Z.disabled,
                "data-index": Q,
                class: oe(["app-select-option", { highlighted: f.value === Q, selected: Z.value === n.modelValue, disabled: Z.disabled }]),
                onPointermove: (fe) => !Z.disabled && (f.value = Q),
                onClick: Le((fe) => y(Q), ["stop"])
              }, [
                u("span", null, g(Z.label), 1),
                Z.value === n.modelValue ? (k(), v("span", Wa, [...I[6] || (I[6] = [
                  u("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none"
                  }, [
                    u("path", {
                      d: "m5 12 4 4L19 6",
                      stroke: "currentColor",
                      "stroke-width": "2.4",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ], -1)
                ])])) : F("", !0)
              ], 42, Va))), 128)),
              $.value.length ? F("", !0) : (k(), v("div", qa, g(ne(Ge) === "en" ? "No matches" : "没有匹配项"), 1))
            ], 46, Ba)) : F("", !0)
          ]),
          _: 1
        })
      ]))
    ], 16));
  }
}), Ga = { class: "thinking-caption" }, Ya = ["disabled", "aria-expanded", "aria-controls"], Za = ["id", "onKeydown"], Ka = {
  class: "thinking-capsule",
  "aria-hidden": "true"
}, Xa = ["value", "aria-valuetext"], Qa = {
  key: 0,
  class: "energy-wave",
  "aria-hidden": "true"
}, Ja = { class: "thinking-stops" }, eo = ["aria-pressed", "onClick"], to = { class: "thinking-provider-note" }, no = /* @__PURE__ */ At({
  __name: "ThinkingSlider",
  props: {
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = se(() => Ge.value === "en"), r = n, s = e, a = se(() => [{ value: 0, label: t.value ? "Off" : "关闭思考" }, { value: 20, label: t.value ? "Low" : "低" }, { value: 50, label: t.value ? "Medium" : "中" }, { value: 75, label: t.value ? "High" : "高" }, { value: 100, label: t.value ? "Max" : "最高" }]), i = se(() => r.modelValue === 0 ? 0 : r.modelValue < 35 ? 1 : r.modelValue < 62.5 ? 2 : r.modelValue < 87.5 ? 3 : 4), o = U(!1), f = U({}), m = U(null), T = U(null), S = U(null), M = U(i.value * 25), z = U(!1), $ = se(() => i.value === 4), G = ls("thinking");
    let B;
    Ee(() => r.modelValue, () => {
      o.value || (M.value = i.value * 25);
    }), Ee($, (E, C) => {
      E && !C && (z.value = !0, clearTimeout(B), B = setTimeout(() => z.value = !1, 900));
    }), Ee(() => r.disabled, (E) => {
      E && (o.value = !1);
    });
    function K() {
      const E = m.value?.getBoundingClientRect();
      if (!E) return;
      const C = Math.min(352, innerWidth - 16), I = innerHeight - E.bottom < 204;
      f.value = { left: `${Math.max(8, Math.min(E.left, innerWidth - C - 8))}px`, width: `${C}px`, ...I ? { bottom: `${innerHeight - E.top + 8}px` } : { top: `${E.bottom + 8}px` } };
    }
    async function X() {
      r.disabled || (o.value = !o.value, o.value && (M.value = i.value * 25, K(), await nt(), S.value?.focus()));
    }
    function L() {
      o.value = !1, m.value?.focus();
    }
    function P(E) {
      M.value = Number(E.target.value), s("update:modelValue", a.value[Math.round(M.value / 25)].value);
    }
    function w(E) {
      M.value = E * 25, s("update:modelValue", a.value[E].value);
    }
    function y(E) {
      const C = E.target;
      !m.value?.contains(C) && !T.value?.contains(C) && (o.value = !1);
    }
    function R(E) {
      o.value && (!(E.target instanceof Node) || !T.value?.contains(E.target)) && K();
    }
    return yn(() => {
      document.addEventListener("pointerdown", y, !0), window.addEventListener("resize", K), window.addEventListener("scroll", R, !0);
    }), _n(() => {
      clearTimeout(B), document.removeEventListener("pointerdown", y, !0), window.removeEventListener("resize", K), window.removeEventListener("scroll", R, !0);
    }), (E, C) => (k(), v("div", {
      class: oe(["thinking-control", { full: $.value, pulse: z.value }])
    }, [
      u("span", Ga, g(t.value ? "Thinking effort" : "思考强度"), 1),
      u("button", {
        ref_key: "trigger",
        ref: m,
        type: "button",
        class: "thinking-trigger",
        disabled: n.disabled,
        "aria-label": "思考强度",
        "aria-haspopup": "dialog",
        "aria-expanded": o.value,
        "aria-controls": o.value ? ne(G) : void 0,
        onClick: X,
        onKeydown: yt(L, ["esc"])
      }, [
        u("span", null, g($.value ? "✦ " : "") + g(a.value[i.value].label), 1),
        C[5] || (C[5] = u("span", { "aria-hidden": "true" }, "⌄", -1))
      ], 40, Ya),
      (k(), St(Wn, { to: "body" }, [
        Me(jr, { name: "thinking-menu" }, {
          default: Vr(() => [
            o.value ? (k(), v("section", {
              key: 0,
              id: ne(G),
              ref_key: "panel",
              ref: T,
              class: oe(["thinking-popover", { full: $.value, pulse: z.value }]),
              style: jt(f.value),
              role: "dialog",
              "aria-label": "调整思考强度",
              onKeydown: yt(Le(L, ["prevent", "stop"]), ["esc"])
            }, [
              u("header", null, [
                u("strong", null, g(t.value ? "Thinking effort" : "思考强度"), 1),
                u("output", null, g($.value ? "✦ " : "") + g(a.value[i.value].label), 1)
              ]),
              u("div", {
                class: "thinking-track",
                style: jt({ "--intensity": `${M.value}%` })
              }, [
                u("div", Ka, [
                  C[6] || (C[6] = u("div", { class: "thinking-fill" }, null, -1)),
                  (k(!0), v(le, null, ye(a.value, (_, I) => (k(), v("span", {
                    key: I,
                    class: oe(["thinking-tick", { passed: M.value >= I * 25 }]),
                    style: jt({ left: `${I * 25}%` })
                  }, null, 6))), 128))
                ]),
                u("input", {
                  ref_key: "range",
                  ref: S,
                  type: "range",
                  min: "0",
                  max: "100",
                  step: "0.1",
                  value: M.value,
                  "aria-label": "思考强度滑块",
                  "aria-valuetext": a.value[i.value].label,
                  onInput: P,
                  onChange: C[0] || (C[0] = (_) => M.value = i.value * 25),
                  onKeydown: [
                    C[1] || (C[1] = yt(Le((_) => w(0), ["prevent"]), ["home"])),
                    C[2] || (C[2] = yt(Le((_) => w(4), ["prevent"]), ["end"])),
                    C[3] || (C[3] = yt(Le((_) => w(Math.min(4, i.value + 1)), ["prevent"]), ["arrow-right"])),
                    C[4] || (C[4] = yt(Le((_) => w(Math.max(0, i.value - 1)), ["prevent"]), ["arrow-left"]))
                  ]
                }, null, 40, Xa),
                $.value ? (k(), v("span", Qa)) : F("", !0)
              ], 4),
              u("div", Ja, [
                (k(!0), v(le, null, ye(a.value, (_, I) => (k(), v("button", {
                  key: _.value,
                  type: "button",
                  class: oe({ selected: i.value === I }),
                  "aria-pressed": i.value === I,
                  onClick: (Z) => w(I)
                }, g(_.label), 11, eo))), 128))
              ]),
              u("p", null, g(t.value ? i.value === 0 ? "Disable model reasoning" : $.value ? "Maximum effort" : "Drag to adjust; release to snap to a level" : i.value === 0 ? "不启用模型思考模式" : $.value ? "全力思考 · 已达到最高档" : "拖动滑块调整，松开后定位到对应档位"), 1),
              u("p", to, g(t.value ? "Actual reasoning controls depend on the selected provider. Max may map to High." : "实际推理参数取决于供应商；最高档可能映射为高档。"), 1)
            ], 46, Za)) : F("", !0)
          ]),
          _: 1
        })
      ]))
    ], 2));
  }
}), wt = U(null);
function as() {
  function n(t) {
    const r = typeof t == "string" ? { message: t } : t;
    return wt.value && wt.value.resolve(!1), new Promise((s) => {
      wt.value = { options: r, resolve: s };
    });
  }
  function e(t) {
    const r = wt.value;
    wt.value = null, r?.resolve(t);
  }
  return { confirmState: wt, confirm: n, settle: e };
}
const ro = /* @__PURE__ */ At({
  __name: "ConfirmDialog",
  setup(n) {
    const { confirmState: e, settle: t } = as(), r = U(null), s = U(null);
    let a = null;
    const i = () => (document.documentElement.lang || "").startsWith("en"), o = () => e.value?.options.title || (i() ? "Confirm" : "请确认"), f = () => e.value?.options.confirmLabel || (i() ? "Confirm" : "确认"), m = () => e.value?.options.cancelLabel || (i() ? "Cancel" : "取消");
    Ee(() => !!e.value, async (S) => {
      S ? (a = document.activeElement, await nt(), r.value?.focus(), s.value?.focus()) : (r.value = null, a?.focus?.());
    });
    function T(S) {
      if (!e.value) return;
      if (S.key === "Escape") {
        S.preventDefault(), t(!1);
        return;
      }
      if (S.key !== "Tab" || !r.value) return;
      const M = [...r.value.querySelectorAll("button:not(:disabled)")];
      if (!M.length) return;
      const z = M[0], $ = M[M.length - 1];
      S.shiftKey && document.activeElement === z ? (S.preventDefault(), $.focus()) : !S.shiftKey && document.activeElement === $ && (S.preventDefault(), z.focus());
    }
    return (S, M) => (k(), St(Wn, { to: "body" }, [
      ne(e) ? (k(), v("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: M[2] || (M[2] = Le((z) => ne(t)(!1), ["self"])),
        onKeydown: T
      }, [
        u("section", {
          ref_key: "dialog",
          ref: r,
          class: "confirm-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          u("h2", null, g(o()), 1),
          u("p", null, g(ne(e).options.message), 1),
          u("footer", null, [
            u("button", {
              ref_key: "cancelBtn",
              ref: s,
              type: "button",
              onClick: M[0] || (M[0] = (z) => ne(t)(!1))
            }, g(m()), 513),
            u("button", {
              type: "button",
              class: oe(["confirm-primary", { danger: ne(e).options.danger !== !1 }]),
              onClick: M[1] || (M[1] = (z) => ne(t)(!0))
            }, g(f()), 3)
          ])
        ], 512)
      ], 32)) : F("", !0)
    ]));
  }
}), so = { class: "workspace" }, lo = { class: "sessions" }, ao = ["disabled", "title"], oo = { class: "connection" }, io = ["title"], uo = ["placeholder", "aria-label"], co = { class: "filter-bar" }, po = ["onClick"], ho = { class: "muted" }, fo = { class: "session-list" }, go = ["disabled", "onClick"], mo = { class: "origin" }, ko = {
  key: 0,
  class: "muted"
}, vo = {
  key: 0,
  class: "ledger"
}, bo = { class: "muted" }, yo = ["onClick"], _o = {
  key: 1,
  class: "conversation"
}, wo = { class: "conversation-header" }, xo = {
  key: 0,
  class: "running"
}, So = {
  key: 1,
  class: "session-actions"
}, To = ["disabled"], Ao = ["disabled"], Eo = {
  key: 0,
  class: "error",
  role: "alert"
}, Ro = {
  key: 1,
  class: "host-panel"
}, Co = { class: "usage-rings" }, $o = {
  key: 1,
  class: "muted"
}, Lo = {
  key: 0,
  class: "sub-view"
}, Io = { class: "sub-view-header" }, Oo = { class: "muted" }, Po = { class: "sub-view-body" }, Do = { class: "bubble user" }, Mo = { class: "message-head" }, No = { class: "message-text" }, zo = {
  key: 0,
  class: "agent-speech"
}, Fo = {
  key: 0,
  class: "muted model-annotation"
}, Uo = {
  key: 0,
  class: "running"
}, Bo = {
  key: 2,
  class: "muted"
}, Ho = {
  key: 3,
  class: "error"
}, jo = {
  key: 1,
  class: "subagent-card nested"
}, Vo = ["onClick"], Wo = { class: "subagent-prompt" }, qo = { key: 3 }, Go = {
  key: 0,
  class: "agent-speech"
}, Yo = {
  key: 1,
  class: "error"
}, Zo = {
  key: 2,
  class: "muted"
}, Ko = {
  key: 0,
  class: "welcome"
}, Xo = { class: "bubble user" }, Qo = { class: "message-head" }, Jo = { class: "message-text" }, ei = { class: "bubble agent" }, ti = { class: "message-head" }, ni = {
  key: 0,
  class: "steps"
}, ri = {
  key: 0,
  class: "agent-speech"
}, si = {
  key: 0,
  class: "muted model-annotation"
}, li = {
  key: 0,
  class: "running"
}, ai = {
  key: 2,
  class: "muted"
}, oi = {
  key: 3,
  class: "error"
}, ii = {
  key: 1,
  class: "subagent-card"
}, ui = ["onClick"], ci = { class: "subagent-prompt" }, di = {
  key: 0,
  class: "error subagent-card-error"
}, pi = { key: 3 }, hi = {
  key: 2,
  class: "error"
}, fi = {
  key: 3,
  class: "muted"
}, gi = {
  key: 0,
  class: "compact-notice"
}, mi = { class: "execution-options" }, ki = ["disabled", "title"], vi = { class: "composer-input" }, bi = ["disabled", "placeholder"], yi = ["disabled", "aria-label", "title"], _i = ["aria-label", "title"], wi = ["disabled"], xi = { class: "muted" }, Si = {
  class: "directory-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "选择工作区目录"
}, Ti = { class: "directory-roots" }, Ai = ["disabled", "onClick"], Ei = ["disabled"], Ri = ["disabled"], Ci = ["disabled"], $i = {
  key: 0,
  class: "error"
}, Li = { key: 1 }, Ii = {
  key: 2,
  class: "directory-list"
}, Oi = ["onClick"], Pi = {
  key: 1,
  class: "muted"
}, Di = ["disabled"], Mi = /* @__PURE__ */ At({
  __name: "AgentsPage",
  setup(n) {
    const e = (d, h) => Ge.value === "en" ? h : d, { confirm: t } = as(), r = $s(), s = U(localStorage.getItem("0kay.agent.selected") || ""), a = U(""), i = U(""), o = U("all"), f = U("general"), m = U(""), T = U(""), S = U(50);
    function M(d) {
      const h = { off: 0, low: 20, medium: 50, high: 75, max: 100 };
      if (typeof d == "string" && d in h) return h[d];
      const p = Number(d ?? 50);
      return Number.isFinite(p) ? Math.max(0, Math.min(100, p)) : 50;
    }
    const z = U("MOCR"), $ = U("normal"), G = U("");
    async function B() {
      if (!(!G.value.trim() || !O.value || P.value)) {
        P.value = !0, w.value = "";
        try {
          const d = await fetch(`/api/agent/workspace?executor_id=${encodeURIComponent(O.value.plugin_id)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: y.value.path, name: G.value.trim() }) });
          if (!d.ok) throw new Error(await d.text());
          const h = await d.json();
          G.value = "", await Fe(h.path);
        } catch (d) {
          w.value = d.message;
        } finally {
          P.value = !1;
        }
      }
    }
    const K = U([]), X = U(!1), L = U(!1), P = U(!1), w = U(""), y = U({ path: "", parent: "", roots: [], directories: [] }), R = U(null), E = U("");
    let C = null, _ = 0, I = "", Z = !1;
    const Q = U(!0);
    function fe(d = s.value) {
      try {
        localStorage.setItem(`0kay.agent.editor:${d}`, JSON.stringify({ draft: a.value, mode: f.value, ...Jt() }));
      } catch {
      }
    }
    function me() {
      _++, L.value = !1, P.value = !1;
    }
    function rt(d) {
      d.key === "Escape" && L.value && me();
    }
    function wn(d) {
      d.key === "Enter" && !d.shiftKey && !d.isComposing && d.keyCode !== 229 && (d.preventDefault(), ft());
    }
    function ct() {
      const d = Ze.value;
      d && (Q.value = d.scrollHeight - d.scrollTop - d.clientHeight < 100);
    }
    async function Fe(d = "") {
      if (!O.value) {
        ke.value = "请先选择在线执行器";
        return;
      }
      const h = ++_;
      I = O.value.plugin_id, L.value = !0, P.value = !0, w.value = "";
      try {
        const p = await fetch(`/api/agent/workspace?${new URLSearchParams({ executor_id: O.value.plugin_id, path: d })}`);
        if (!p.ok) throw new Error(await p.text());
        const N = await p.json();
        h === _ && (y.value = N);
      } catch (p) {
        h === _ && (w.value = p.message);
      } finally {
        h === _ && (P.value = !1);
      }
    }
    function Gt() {
      !O.value || O.value.plugin_id !== I || P.value || w.value || (m.value = O.value.plugin_id, T.value = y.value.path, L.value = !1);
    }
    async function Rt() {
      if (!X.value || !O.value || Z || document.hidden) return;
      Z = !0;
      const d = O.value.plugin_id;
      try {
        const h = await fetch(`/api/agent/host?executor_id=${encodeURIComponent(d)}`);
        if (!h.ok) throw new Error();
        const p = await h.json();
        O.value?.plugin_id === d && (R.value = p);
      } catch {
        O.value?.plugin_id === d && (R.value = null);
      } finally {
        Z = !1;
      }
    }
    async function Yt() {
      if (!te.value || ue.value || re.value || te.value.state === "archived") return;
      const d = s.value;
      re.value = !0, ke.value = "", E.value = "正在压缩上下文…";
      try {
        const h = await fetch("/api/agent/compact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: d }) });
        if (!h.ok) throw new Error(await h.text());
        await h.json(), await r.fetchAgents(), E.value = "上下文已压缩。后续消息使用摘要；原始对话和工具记录仍然保留。", a.value.trim() === "/compact" && (a.value = "");
      } catch (h) {
        ke.value = h.message, E.value = "";
      } finally {
        re.value = !1;
      }
    }
    const xn = (d) => ({ background: `conic-gradient(var(--md-primary) ${Math.max(0, Math.min(100, d))}%, var(--md-outline-variant) 0)` }), O = se(() => m.value ? r.agents.find((d) => d.plugin_id === m.value) : r.agents.find((d) => r.isHealthy(d))), Zt = (d) => d === void 0 ? "—" : `${(d / 1024 ** 3).toFixed(1)} GiB`;
    function Kt() {
      try {
        const d = JSON.parse(localStorage.getItem(`0kay.agent.editor:${s.value}`) || localStorage.getItem(`0kay.agent.options:${s.value}`) || "{}");
        m.value = d.executor_id || "", T.value = d.workdir || "", S.value = M(d.thinking_intensity), z.value = d.model_id || "MOCR", $.value = d.permission_mode === "full_access" ? "full_access" : "normal", a.value = d.draft || "", f.value = d.mode || "general";
      } catch {
        m.value = "", T.value = "", S.value = 50, z.value = "MOCR", a.value = "", f.value = "general";
      }
    }
    const Xt = U({});
    function Sn(d) {
      return `${Xt.value[d.provider] || d.provider}/${d.id}`;
    }
    async function Qt() {
      try {
        const d = await fetch("/api/models");
        if (!d.ok) throw new Error(`模型目录 HTTP ${d.status}`);
        K.value = (await d.json()).models || [];
      } catch (d) {
        ke.value = d.message;
      }
      try {
        const d = await fetch("/api/providers");
        if (d.ok) {
          const h = (await d.json()).providers || [], p = {};
          for (const N of h) N.name && (p[N.provider] = N.name);
          Xt.value = p;
        }
      } catch {
      }
    }
    function Jt() {
      const d = S.value === 0 ? "off" : S.value < 35 ? "low" : S.value < 62.5 ? "medium" : S.value < 87.5 ? "high" : "max";
      return { executor_id: m.value, workdir: T.value.trim(), thinking_intensity: d, model_id: z.value, permission_mode: $.value, language: Ge.value };
    }
    const re = U(!1), ke = U(""), Ue = U(!1), Y = U(!1), Re = U([]), j = se(() => Re.value[Re.value.length - 1] || null), Ze = U(null), te = se(() => r.sessions.find((d) => d.session_id === s.value)), Ie = (d) => d.caller_id !== "webui", Ct = se(() => r.sessions.filter((d) => (Y.value ? d.state === "archived" : d.state !== "archived") && (o.value === "all" || (o.value === "life" ? Ie(d) : !Ie(d))) && (d.prompt || "").toLowerCase().includes(i.value.toLowerCase()))), Oe = se(() => r.tasks.filter((d) => d.kind === "agent" && d.session_id === s.value).sort((d, h) => (d.started_at || "").localeCompare(h.started_at || "") || d.task_id.localeCompare(h.task_id))), ue = se(() => r.tasks.find((d) => d.session_id === s.value && ["agent", "compact"].includes(d.kind || "") && ["running", "pending"].includes(d.state))), Pe = (d) => (Ge.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[d] || d, Ke = (d) => d ? new Date(d).toLocaleString() : "";
    function dt(d) {
      return r.tasks.filter((h) => h.task_id !== d.task_id && h.session_id === d.session_id && h.parent_id === d.task_id).sort((h, p) => (h.started_at || "").localeCompare(p.started_at || "") || h.task_id.localeCompare(p.task_id));
    }
    function _e(d) {
      return d ? r.tasks.filter((h) => h.task_id !== d.task_id && h.session_id === d.session_id && h.parent_id === d.task_id).sort((h, p) => (h.started_at || "").localeCompare(p.started_at || "") || h.task_id.localeCompare(p.task_id)) : [];
    }
    function Be(d) {
      const h = [];
      for (const p of dt(d))
        h.push(p), p.kind === "subagent" && h.push(...Be({ ...p, session_id: d.session_id }));
      return h;
    }
    function He(d) {
      Re.value = [...Re.value, d];
    }
    function $t() {
      Re.value = Re.value.slice(0, -1);
    }
    function pt() {
      Re.value = [];
    }
    function Xe(d) {
      if (!d?.result) return "";
      let h = d.result;
      try {
        const p = JSON.parse(h);
        typeof p == "string" ? h = p : p && typeof p.result == "string" && (h = p.result);
      } catch {
      }
      return !h.trim() || _e(d).some((p) => p.kind === "think" && (p.result || "").trim() === h.trim()) ? "" : h;
    }
    function De(d) {
      return d ? /User denied permission for task/i.test(d) ? e("你拒绝了这次子 Agent 调用", "You denied this sub-agent call") : /User denied permission for (\S+)/i.test(d) ? e(`你拒绝了 ${RegExp.$1} 权限`, `You denied permission for ${RegExp.$1}`) : /Permission request expired/i.test(d) ? e("权限请求已超时", "Permission request expired") : d : "";
    }
    function qe(d) {
      return d.kind === "subagent" ? e("子 Agent", "Subagent") : d.kind === "tool" ? e("工具", "Tool") : d.kind === "think" ? e("模型", "Model") : d.kind || e("步骤", "Step");
    }
    function st(d) {
      return _e(d).length;
    }
    function ht(d) {
      return Be(d).some((h) => h.kind === "think" && h.result?.trim() === d.result?.trim());
    }
    async function Lt(d) {
      if (!te.value || re.value || d === "delete" && !await t({
        title: e("删除会话", "Delete session"),
        message: e("永久删除此会话及其中的消息和工具记录？", "Permanently delete this session and its messages and tool records?"),
        confirmLabel: e("永久删除", "Delete"),
        danger: !0
      }))
        return;
      const h = s.value;
      re.value = !0;
      try {
        fe(h), await r.manageSession(h, d), d === "delete" && (localStorage.removeItem(`0kay.agent.editor:${h}`), localStorage.removeItem(`0kay.agent.options:${h}`)), d !== "restore" ? (s.value = "", localStorage.removeItem("0kay.agent.selected")) : Y.value = !1;
      } catch (p) {
        ke.value = p.message;
      } finally {
        re.value = !1;
      }
    }
    function It(d) {
      re.value || (fe(), s.value = d, Ue.value = !1, localStorage.setItem("0kay.agent.selected", d));
    }
    async function en() {
      re.value = !0, ke.value = "";
      try {
        const d = await r.createSession("新对话");
        fe(), s.value = d, localStorage.setItem("0kay.agent.selected", d), Ue.value = !1, Y.value = !1;
      } catch (d) {
        ke.value = d.message;
      } finally {
        re.value = !1;
      }
    }
    async function ft() {
      if (a.value.trim() === "/compact") {
        await Yt();
        return;
      }
      if (!(!a.value.trim() || re.value || ue.value || te.value?.state === "archived")) {
        re.value = !0, ke.value = "";
        try {
          const d = Jt(), h = a.value.trim(), p = f.value;
          if (!te.value) {
            const N = await r.createSession(h.slice(0, 60));
            localStorage.setItem(`0kay.agent.editor:${N}`, JSON.stringify({ ...d, draft: h, mode: p })), s.value = N, localStorage.setItem("0kay.agent.selected", N);
          }
          fe(), await r.sendTask(s.value, h, p, d), a.value = "", fe(), Q.value = !0, await je();
        } catch (d) {
          ke.value = d.message;
        } finally {
          re.value = !1;
        }
      }
    }
    async function Ot() {
      if (!(!ue.value || ue.value.kind !== "agent"))
        try {
          await r.cancelTask(ue.value.task_id);
        } catch (d) {
          ke.value = d.message;
        }
    }
    async function je() {
      await nt(), Q.value && Ze.value?.scrollTo({ top: Ze.value.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return Ee(() => r.tasks.filter((d) => d.session_id === s.value).map((d) => `${d.task_id}:${d.state}:${d.result?.length}`).join("|"), je), Ee(s, () => {
      Q.value = !0, je(), me(), pt(), ke.value = "";
    }), Ee(s, Kt), Ee(m, () => {
      R.value = null, T.value = "", me(), Rt();
    }, { flush: "sync" }), Ee(X, Rt), Ee(s, () => {
      E.value = "";
    }), yn(() => {
      ma(), r.connect(), Kt(), Qt(), C = setInterval(Rt, 5e3), window.addEventListener("keydown", rt);
    }), _n(() => {
      fe(), me(), r.disconnect(), C && clearInterval(C), window.removeEventListener("keydown", rt);
    }), (d, h) => (k(), v(le, null, [
      u("main", so, [
        u("aside", lo, [
          u("header", null, [
            h[19] || (h[19] = u("h1", null, "Agent", -1)),
            u("button", {
              onClick: en,
              disabled: re.value,
              title: e("新建会话", "New session")
            }, [
              h[18] || (h[18] = u("svg", {
                width: "15",
                height: "15",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                u("path", {
                  d: "M12 5v14M5 12h14",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                })
              ], -1)),
              xe(" " + g(e("新对话", "New chat")), 1)
            ], 8, ao)
          ]),
          u("div", oo, [
            u("i", {
              class: oe({ online: ne(r).onlineCount > 0 })
            }, null, 2),
            xe(g(ne(r).onlineCount) + " " + g(e("个执行器在线", "executors online")) + " ", 1),
            u("button", {
              onClick: h[0] || (h[0] = (p) => ne(r).fetchAgents()),
              title: e("刷新", "Refresh"),
              "aria-label": "refresh"
            }, [...h[20] || (h[20] = [
              u("svg", {
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                u("path", {
                  d: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5",
                  stroke: "currentColor",
                  "stroke-width": "1.8",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ], -1)
            ])], 8, io)
          ]),
          Ut(u("input", {
            "onUpdate:modelValue": h[1] || (h[1] = (p) => i.value = p),
            placeholder: e("搜索会话…", "Search sessions…"),
            "aria-label": e("搜索会话", "Search sessions")
          }, null, 8, uo), [
            [gn, i.value]
          ]),
          u("nav", co, [
            (k(!0), v(le, null, ye([{ id: "all", label: e("全部", "All") }, { id: "life", label: e("LIFE 发起", "From LIFE") }, { id: "user", label: e("我的对话", "My chats") }], (p) => (k(), v("button", {
              key: p.id,
              class: oe({ chosen: o.value === p.id }),
              onClick: (N) => o.value = p.id
            }, g(p.label), 11, po))), 128))
          ]),
          u("label", ho, [
            Ut(u("input", {
              "onUpdate:modelValue": h[2] || (h[2] = (p) => Y.value = p),
              type: "checkbox"
            }, null, 512), [
              [Es, Y.value]
            ]),
            xe(" " + g(e("显示已归档会话", "Show archived sessions")), 1)
          ]),
          u("div", fo, [
            (k(!0), v(le, null, ye(Ct.value, (p) => (k(), v("button", {
              key: p.task_id,
              class: oe(["session-card", { selected: s.value === p.session_id && !Ue.value }]),
              disabled: re.value,
              onClick: (N) => It(p.session_id)
            }, [
              u("span", mo, g(Ie(p) ? "LIFE → Agent" : e("你 ↔ Agent", "You ↔ Agent")), 1),
              u("strong", null, g(p.prompt || "未命名会话"), 1),
              u("small", null, g(Ke(p.started_at)), 1)
            ], 10, go))), 128)),
            Ct.value.length ? F("", !0) : (k(), v("p", ko, g(e("暂无会话。直接发送消息，或等待 LIFE 委派工作。", "No sessions yet. Send a message or wait for LIFE to delegate work.")), 1))
          ]),
          u("button", {
            class: oe(["ledger-button", { chosen: Ue.value }]),
            onClick: h[3] || (h[3] = (p) => Ue.value = !0)
          }, g(e("全部任务记录", "All task records")) + " · " + g(ne(r).tasks.length), 3)
        ]),
        Ue.value ? (k(), v("section", vo, [
          u("header", null, [
            u("h2", null, g(e("全部任务记录", "All task records")), 1),
            u("button", {
              onClick: h[4] || (h[4] = (p) => Ue.value = !1)
            }, g(e("返回会话", "Back to chat")), 1)
          ]),
          u("p", bo, g(e("包括 LIFE 对话、模型调用、Agent 执行及工具活动。", "LIFE conversations, model calls, Agent execution and tool activity.")), 1),
          (k(!0), v(le, null, ye(ne(r).tasks, (p) => (k(), v("article", {
            key: p.task_id,
            class: "ledger-entry"
          }, [
            u("div", null, [
              u("span", null, g(p.kind || "agent"), 1),
              u("span", {
                class: oe(p.state)
              }, g(Pe(p.state)), 3),
              u("small", null, g(Ke(p.started_at)), 1)
            ]),
            u("p", null, g(p.prompt), 1),
            ne(r).sessions.some((N) => N.session_id === p.session_id) ? (k(), v("button", {
              key: 0,
              onClick: (N) => It(p.session_id)
            }, "打开所属会话", 8, yo)) : F("", !0),
            u("details", null, [
              h[21] || (h[21] = u("summary", null, "详情", -1)),
              u("code", null, g(p.task_id), 1),
              u("pre", null, g(p.result || p.error || "等待结果"), 1)
            ])
          ]))), 128))
        ])) : (k(), v("section", _o, [
          u("header", wo, [
            u("div", null, [
              u("h2", null, g(te.value?.prompt || "与 Agent 对话"), 1),
              u("p", null, g(te.value && Ie(te.value) ? "LIFE 发起的工作会话 · 你可以查看过程，也可以直接继续对话" : "持续对话 · 编程、调研与工具执行"), 1)
            ]),
            ue.value ? (k(), v("span", xo, "正在执行")) : F("", !0),
            te.value ? (k(), v("div", So, [
              u("button", {
                disabled: !!ue.value,
                onClick: h[5] || (h[5] = (p) => Lt(te.value.state === "archived" ? "restore" : "archive"))
              }, g(te.value.state === "archived" ? "恢复" : "归档"), 9, To),
              u("button", {
                disabled: !!ue.value,
                onClick: h[6] || (h[6] = (p) => Lt("delete"))
              }, "删除", 8, Ao)
            ])) : F("", !0)
          ]),
          ke.value || ne(r).error ? (k(), v("div", Eo, g(ke.value || ne(r).error), 1)) : F("", !0),
          X.value ? (k(), v("section", Ro, [
            O.value ? (k(), v(le, { key: 0 }, [
              u("strong", null, g(O.value.host?.hostname || O.value.name), 1),
              u("span", {
                class: oe(ne(r).isHealthy(O.value) ? "done" : "failed")
              }, g(ne(r).isHealthy(O.value) ? "在线" : "离线"), 3),
              u("div", Co, [
                (k(!0), v(le, null, ye([{ label: "CPU 占用", value: R.value?.cpu_percent }, { label: "内存占用", value: R.value?.memory_percent }], (p) => (k(), v("div", {
                  key: p.label,
                  class: "usage-metric"
                }, [
                  u("div", {
                    class: "usage-ring",
                    style: jt(xn(p.value || 0))
                  }, [
                    u("b", null, g(p.value === void 0 ? "—" : `${p.value.toFixed(1)}%`), 1)
                  ], 4),
                  u("span", null, g(p.label), 1)
                ]))), 128)),
                u("small", null, g(R.value ? `采样时间：${Ke(R.value.sampled_at)}` : "等待宿主机实时采样"), 1)
              ]),
              u("dl", null, [
                u("div", null, [
                  h[22] || (h[22] = u("dt", null, "执行器地址", -1)),
                  u("dd", null, g(O.value.address), 1)
                ]),
                u("div", null, [
                  h[23] || (h[23] = u("dt", null, "系统 / 架构", -1)),
                  u("dd", null, g(O.value.host?.os || "—") + " / " + g(O.value.host?.arch || "—"), 1)
                ]),
                u("div", null, [
                  h[24] || (h[24] = u("dt", null, "CPU", -1)),
                  u("dd", null, g(O.value.host?.cpu_model || "—") + " · " + g(O.value.host?.cpu_cores || "—") + " 核", 1)
                ]),
                u("div", null, [
                  h[25] || (h[25] = u("dt", null, "可用 / 总内存", -1)),
                  u("dd", null, g(Zt(O.value.host?.memory_available_bytes)) + " / " + g(Zt(O.value.host?.memory_total_bytes)), 1)
                ]),
                u("div", null, [
                  h[26] || (h[26] = u("dt", null, "活跃任务", -1)),
                  u("dd", null, g(O.value.active_tasks), 1)
                ]),
                u("div", null, [
                  h[27] || (h[27] = u("dt", null, "距上次心跳", -1)),
                  u("dd", null, g(O.value.last_heartbeat_age_seconds) + " 秒", 1)
                ]),
                u("div", null, [
                  h[28] || (h[28] = u("dt", null, "默认工作目录", -1)),
                  u("dd", null, g(O.value.host?.workdir || "—"), 1)
                ])
              ])
            ], 64)) : (k(), v("p", $o, "没有可用的执行器宿主机信息。"))
          ])) : F("", !0),
          u("div", {
            ref_key: "transcript",
            ref: Ze,
            class: "transcript",
            onScrollPassive: ct
          }, [
            j.value ? (k(), v("div", Lo, [
              u("header", Io, [
                u("button", {
                  type: "button",
                  onClick: $t
                }, "← " + g(Re.value.length > 1 ? e("返回上一层", "Back one level") : e("返回会话", "Back to chat")), 1),
                u("div", null, [
                  u("h3", null, g(e("子 Agent", "Subagent")), 1),
                  u("p", Oo, g(j.value.prompt), 1)
                ]),
                u("span", {
                  class: oe(j.value.state)
                }, g(Pe(j.value.state)), 3)
              ]),
              u("div", Po, [
                u("div", Do, [
                  u("div", Mo, [
                    u("b", null, g(e("父 Agent", "Parent agent")), 1),
                    u("time", null, g(Ke(j.value.started_at)), 1)
                  ]),
                  u("div", No, g(j.value.prompt), 1)
                ]),
                (k(!0), v(le, null, ye(_e(j.value), (p) => (k(), v(le, {
                  key: p.task_id
                }, [
                  p.kind === "think" && (p.result || p.state === "running" || p.error) ? (k(), v("div", zo, [
                    p.prompt ? (k(), v("small", Fo, g(p.prompt), 1)) : F("", !0),
                    p.result ? (k(), v(le, { key: 1 }, [
                      Me(pn, {
                        content: p.result
                      }, null, 8, ["content"]),
                      p.state === "running" ? (k(), v("span", Uo, " ▍")) : F("", !0)
                    ], 64)) : p.state === "running" ? (k(), v("small", Bo, g(e("子 Agent 正在生成回复…", "Subagent is drafting a reply…")), 1)) : F("", !0),
                    p.error ? (k(), v("p", Ho, g(De(p.error)), 1)) : F("", !0)
                  ])) : p.kind === "subagent" ? (k(), v("div", jo, [
                    u("button", {
                      type: "button",
                      class: "subagent-card-head",
                      onClick: (N) => He(p)
                    }, [
                      u("span", {
                        class: oe(p.state)
                      }, "●", 2),
                      u("strong", null, g(e("子 Agent", "Subagent")), 1),
                      u("span", Wo, g(p.prompt), 1),
                      u("small", null, g(Pe(p.state)), 1),
                      h[29] || (h[29] = u("span", {
                        class: "subagent-chevron",
                        "aria-hidden": "true"
                      }, "▸", -1))
                    ], 8, Vo)
                  ])) : p.kind === "tool" ? (k(), St(Hr, {
                    key: 2,
                    step: p,
                    "format-error": De
                  }, null, 8, ["step"])) : p.kind !== "think" ? (k(), v("details", qo, [
                    u("summary", null, [
                      u("span", {
                        class: oe(p.state)
                      }, "●", 2),
                      xe(" " + g(qe(p)) + " · " + g(p.prompt) + " ", 1),
                      u("small", null, g(Pe(p.state)), 1)
                    ]),
                    u("pre", null, g(p.result || p.error || (p.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                  ])) : F("", !0)
                ], 64))), 128)),
                Xe(j.value) ? (k(), v("div", Go, [
                  Me(pn, {
                    content: Xe(j.value)
                  }, null, 8, ["content"])
                ])) : F("", !0),
                j.value.error ? (k(), v("p", Yo, g(De(j.value.error)), 1)) : F("", !0),
                !_e(j.value).length && !Xe(j.value) && !j.value.error ? (k(), v("p", Zo, g(j.value.state === "running" ? e("子 Agent 正在执行…", "Subagent is running…") : e("没有子步骤记录", "No child steps recorded")), 1)) : F("", !0)
              ])
            ])) : (k(), v(le, { key: 1 }, [
              Oe.value.length ? F("", !0) : (k(), v("div", Ko, [...h[30] || (h[30] = [
                u("h2", null, "想让 Agent 帮你做什么？", -1),
                u("p", null, "直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。", -1),
                u("p", null, "左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。", -1)
              ])])),
              (k(!0), v(le, null, ye(Oe.value, (p) => (k(), v("article", {
                key: p.task_id,
                class: "turn"
              }, [
                u("div", Xo, [
                  u("div", Qo, [
                    u("b", null, g(Ie(p) ? "LIFE" : "你"), 1),
                    u("time", null, g(Ke(p.started_at)), 1)
                  ]),
                  u("div", Jo, g(p.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, "")), 1)
                ]),
                u("div", ei, [
                  u("div", ti, [
                    h[31] || (h[31] = u("b", null, "Agent", -1)),
                    u("span", {
                      class: oe(p.state)
                    }, g(Pe(p.state)), 3)
                  ]),
                  dt(p).length ? (k(), v("div", ni, [
                    (k(!0), v(le, null, ye(dt(p), (N) => (k(), v(le, {
                      key: N.task_id
                    }, [
                      N.kind === "think" && (N.result || N.state === "running" || N.error) ? (k(), v("div", ri, [
                        N.prompt ? (k(), v("small", si, g(N.prompt), 1)) : F("", !0),
                        N.result ? (k(), v(le, { key: 1 }, [
                          Me(pn, {
                            content: N.result
                          }, null, 8, ["content"]),
                          N.state === "running" ? (k(), v("span", li, " ▍")) : F("", !0)
                        ], 64)) : N.state === "running" ? (k(), v("small", ai, "Agent 正在生成回复…")) : F("", !0),
                        N.error ? (k(), v("p", oi, g(De(N.error)), 1)) : F("", !0)
                      ])) : N.kind === "subagent" ? (k(), v("div", ii, [
                        u("button", {
                          type: "button",
                          class: "subagent-card-head",
                          onClick: (Tn) => He(N)
                        }, [
                          u("span", {
                            class: oe(N.state)
                          }, "●", 2),
                          u("strong", null, g(e("子 Agent", "Subagent")), 1),
                          u("span", ci, g(N.prompt), 1),
                          u("small", null, [
                            xe(g(Pe(N.state)), 1),
                            st(N) ? (k(), v(le, { key: 0 }, [
                              xe(" · " + g(st(N)) + " " + g(e("步", "steps")), 1)
                            ], 64)) : F("", !0)
                          ]),
                          h[32] || (h[32] = u("span", {
                            class: "subagent-chevron",
                            "aria-hidden": "true"
                          }, "▸", -1))
                        ], 8, ui),
                        N.error ? (k(), v("p", di, g(De(N.error)), 1)) : F("", !0)
                      ])) : N.kind === "tool" ? (k(), St(Hr, {
                        key: 2,
                        step: N,
                        "format-error": De
                      }, null, 8, ["step"])) : N.kind !== "think" ? (k(), v("details", pi, [
                        u("summary", null, [
                          u("span", {
                            class: oe(N.state)
                          }, "●", 2),
                          xe(" " + g(qe(N)) + " · " + g(N.prompt) + " ", 1),
                          u("small", null, g(Pe(N.state)), 1)
                        ]),
                        u("pre", null, g(N.result || N.error || (N.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                      ])) : F("", !0)
                    ], 64))), 128))
                  ])) : F("", !0),
                  p.result && !ht(p) ? (k(), St(pn, {
                    key: 1,
                    content: p.result
                  }, null, 8, ["content"])) : F("", !0),
                  p.error ? (k(), v("div", hi, g(De(p.error)), 1)) : F("", !0),
                  ["running", "pending"].includes(p.state) ? (k(), v("p", fi, "Agent 正在处理，执行过程会自动更新…")) : F("", !0)
                ])
              ]))), 128))
            ], 64))
          ], 544),
          j.value ? F("", !0) : (k(), v("form", {
            key: 2,
            class: "composer",
            onSubmit: Le(ft, ["prevent"])
          }, [
            E.value ? (k(), v("div", gi, g(E.value), 1)) : F("", !0),
            u("div", mi, [
              u("label", null, [
                xe(g(e("权限", "Permissions")), 1),
                Me(hn, {
                  modelValue: $.value,
                  "onUpdate:modelValue": h[7] || (h[7] = (p) => $.value = p),
                  "aria-label": e("权限", "Permissions"),
                  disabled: !!ue.value || re.value,
                  options: [{ value: "normal", label: e("Normal · 全部审批", "Normal · Ask every time") }, { value: "full_access", label: e("Full access · 自动执行", "Full access · Auto execute") }]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ]),
              u("label", null, [
                xe(g(e("执行器", "Executor")), 1),
                Me(hn, {
                  modelValue: m.value,
                  "onUpdate:modelValue": h[8] || (h[8] = (p) => m.value = p),
                  "aria-label": e("执行器", "Executor"),
                  disabled: !!ue.value || re.value,
                  options: [{ value: "", label: e("自动选择在线执行器", "Automatic executor") }, ...ne(r).agents.map((p) => ({ value: p.plugin_id, label: `${p.host?.hostname || p.name} · ${p.plugin_id}`, disabled: !ne(r).isHealthy(p) }))]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ]),
              u("label", null, [
                xe(g(e("工作区", "Workspace")), 1),
                u("button", {
                  type: "button",
                  class: "workspace-select",
                  disabled: !!ue.value || re.value || !O.value,
                  title: T.value || O.value?.host?.workdir,
                  onClick: h[9] || (h[9] = (p) => Fe(T.value || O.value?.host?.workdir || ""))
                }, [
                  h[33] || (h[33] = u("svg", {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    "aria-hidden": "true"
                  }, [
                    u("path", {
                      d: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
                      stroke: "currentColor",
                      "stroke-width": "1.7",
                      "stroke-linejoin": "round"
                    })
                  ], -1)),
                  xe(" " + g(T.value || e("选择目录…", "Select folder…")), 1)
                ], 8, ki)
              ]),
              Me(no, {
                modelValue: S.value,
                "onUpdate:modelValue": h[10] || (h[10] = (p) => S.value = p),
                disabled: !!ue.value || re.value
              }, null, 8, ["modelValue", "disabled"]),
              u("label", null, [
                xe(g(e("模型", "Model")), 1),
                Me(hn, {
                  modelValue: z.value,
                  "onUpdate:modelValue": h[11] || (h[11] = (p) => z.value = p),
                  searchable: "",
                  "aria-label": e("模型", "Model"),
                  disabled: !!ue.value || re.value,
                  onOpen: Qt,
                  options: [{ value: "MOCR", label: e("MOCR · 自动选型", "MOCR · Automatic") }, ...K.value.map((p) => ({ value: p.id, label: Sn(p) }))]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ])
            ]),
            u("div", vi, [
              Ut(u("textarea", {
                "onUpdate:modelValue": h[12] || (h[12] = (p) => a.value = p),
                disabled: re.value || te.value?.state === "archived",
                placeholder: te.value?.state === "archived" ? "恢复会话后可以继续对话" : "给 Agent 发消息…（Enter 发送，Shift+Enter 换行）",
                "aria-label": "给 Agent 发消息",
                onKeydown: wn
              }, null, 40, bi), [
                [gn, a.value]
              ]),
              ue.value?.kind !== "agent" ? (k(), v("button", {
                key: 0,
                type: "submit",
                class: "send-fly",
                disabled: re.value || !!ue.value || !a.value.trim() || te.value?.state === "archived",
                "aria-label": e("发送", "Send"),
                title: e("发送", "Send")
              }, [...h[34] || (h[34] = [
                u("svg", {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  u("path", {
                    d: "M3.6 11.2 20.4 4l-7.1 16.4-2.5-6.8-7.2-2.4z",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linejoin": "round"
                  }),
                  u("path", {
                    d: "m10.8 13.6 3.4-3.4",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linecap": "round"
                  })
                ], -1)
              ])], 8, yi)) : (k(), v("button", {
                key: 1,
                type: "button",
                class: "send-fly stop",
                onClick: Ot,
                "aria-label": e("停止", "Stop"),
                title: e("停止", "Stop")
              }, [...h[35] || (h[35] = [
                u("svg", {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  u("rect", {
                    x: "7",
                    y: "7",
                    width: "10",
                    height: "10",
                    rx: "2",
                    fill: "currentColor"
                  })
                ], -1)
              ])], 8, _i))
            ]),
            u("footer", null, [
              Me(hn, {
                modelValue: f.value,
                "onUpdate:modelValue": h[13] || (h[13] = (p) => f.value = p),
                disabled: re.value,
                "aria-label": e("Agent 模式", "Agent mode"),
                options: [{ value: "general", label: e("通用 Agent", "General Agent") }, { value: "code", label: e("编程 Agent", "Coding Agent") }, { value: "research", label: e("调研 Agent", "Research Agent") }]
              }, null, 8, ["modelValue", "disabled", "aria-label", "options"]),
              u("button", {
                type: "button",
                onClick: h[14] || (h[14] = (p) => X.value = !X.value)
              }, g(e("宿主机", "Host")), 1),
              u("button", {
                type: "button",
                disabled: !te.value || !!ue.value || re.value || te.value.state === "archived",
                onClick: Yt
              }, "/compact", 8, wi),
              u("span", xi, g(ue.value?.kind === "compact" ? e("上下文压缩中…", "Compacting…") : ne(r).onlineCount ? e("在当前会话中继续", "Continue this session") : e("执行器离线", "Executor offline")), 1)
            ])
          ], 32))
        ])),
        L.value ? (k(), v("div", {
          key: 2,
          class: "directory-backdrop",
          onClick: Le(me, ["self"])
        }, [
          u("section", Si, [
            u("header", null, [
              u("h2", null, "选择 " + g(O.value?.host?.hostname || "执行器") + " 的工作区", 1),
              u("button", { onClick: me }, "关闭")
            ]),
            u("div", Ti, [
              (k(!0), v(le, null, ye(y.value.roots, (p) => (k(), v("button", {
                key: p,
                disabled: P.value,
                onClick: (N) => Fe(p)
              }, g(p), 9, Ai))), 128)),
              u("button", {
                disabled: P.value,
                onClick: h[15] || (h[15] = (p) => Fe(O.value?.host?.workdir || ""))
              }, "默认目录", 8, Ei)
            ]),
            u("code", null, g(y.value.path), 1),
            u("form", {
              class: "new-folder",
              onSubmit: Le(B, ["prevent"])
            }, [
              Ut(u("input", {
                "onUpdate:modelValue": h[16] || (h[16] = (p) => G.value = p),
                placeholder: "新文件夹名称",
                "aria-label": "新文件夹名称",
                disabled: P.value
              }, null, 8, Ri), [
                [gn, G.value]
              ]),
              u("button", {
                disabled: P.value || !G.value.trim() || !y.value.path
              }, "新建文件夹", 8, Ci)
            ], 32),
            w.value ? (k(), v("p", $i, g(w.value), 1)) : F("", !0),
            P.value ? (k(), v("p", Li, "正在读取目录…")) : (k(), v("div", Ii, [
              y.value.parent !== y.value.path ? (k(), v("button", {
                key: 0,
                onClick: h[17] || (h[17] = (p) => Fe(y.value.parent))
              }, "上一级")) : F("", !0),
              (k(!0), v(le, null, ye(y.value.directories, (p) => (k(), v("button", {
                key: p.path,
                onClick: (N) => Fe(p.path)
              }, [
                h[36] || (h[36] = u("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  u("path", {
                    d: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linejoin": "round"
                  })
                ], -1)),
                xe(" " + g(p.name), 1)
              ], 8, Oi))), 128)),
              y.value.directories.length ? F("", !0) : (k(), v("p", Pi, "没有子目录"))
            ])),
            u("footer", null, [
              u("button", {
                disabled: P.value || !!w.value || !y.value.path,
                onClick: Gt
              }, "选择当前目录", 8, Di)
            ])
          ])
        ])) : F("", !0)
      ]),
      Me(ro)
    ], 64));
  }
}), Fi = /* @__PURE__ */ er(Mi, [["__scopeId", "data-v-1b8a4030"]]);
export {
  Fi as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('agent-plugin-style')){const s=document.createElement('style');s.id='agent-plugin-style';s.textContent=".markdown-content[data-v-ef377647]{line-height:1.75;overflow-wrap:anywhere;font-size:14px}.markdown-content[data-v-ef377647] pre{padding:16px;background:var(--md-surface-container);border-radius:8px;overflow:auto;white-space:pre;line-height:1.5}.markdown-content[data-v-ef377647] code{font-family:monospace;background:var(--md-surface-container);padding:2px 4px;border-radius:4px}.markdown-content[data-v-ef377647] pre code{padding:0;background:none}.markdown-content[data-v-ef377647] table{display:block;overflow:auto;border-collapse:collapse;margin:12px 0}.markdown-content[data-v-ef377647] th,.markdown-content[data-v-ef377647] td{border:1px solid var(--md-outline-variant);padding:8px 12px}.markdown-content[data-v-ef377647] blockquote{border-left:3px solid var(--md-outline);margin:12px 0;padding-left:14px;color:var(--md-on-surface-variant)}.markdown-content[data-v-ef377647] ul,.markdown-content[data-v-ef377647] ol{padding-left:24px}.markdown-content[data-v-ef377647] a{color:var(--md-primary);text-decoration:underline}.markdown-content[data-v-ef377647] img{max-width:100%}.markdown-content[data-v-ef377647] h1,.markdown-content[data-v-ef377647] h2,.markdown-content[data-v-ef377647] h3{margin:16px 0 8px}.tool-card[data-v-79ca3a33]{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container);margin:8px 0;overflow:hidden}button.tool-card-head[data-v-79ca3a33]{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:none;border-radius:0;background:transparent;padding:10px 12px;cursor:pointer;font-size:12px}.tool-kind[data-v-79ca3a33]{flex-shrink:0;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--md-on-surface-variant)}.tool-summary[data-v-79ca3a33]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace;font-size:11.5px}.tool-stat[data-v-79ca3a33]{flex-shrink:0;font-size:11px;font-weight:600;color:var(--md-primary);border:1px solid var(--md-outline-variant);border-radius:999px;padding:1px 8px}.tool-state[data-v-79ca3a33]{flex-shrink:0;font-size:11px;color:var(--md-on-surface-variant)}.tool-chevron[data-v-79ca3a33]{flex-shrink:0;color:var(--md-on-surface-variant);font-size:11px;transition:transform .15s}.tool-card.expanded .tool-chevron[data-v-79ca3a33]{transform:rotate(90deg)}.tool-dot[data-v-79ca3a33]{font-size:9px}.tool-dot.running[data-v-79ca3a33],.tool-dot.pending[data-v-79ca3a33]{color:#b88412}.tool-dot.failed[data-v-79ca3a33]{color:var(--md-error,#c44)}.tool-dot.done[data-v-79ca3a33]{color:#3a6}.tool-dot.cancelled[data-v-79ca3a33]{color:var(--md-on-surface-variant)}.tool-card-body[data-v-79ca3a33]{padding:4px 12px 12px;border-top:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}.tool-section-label[data-v-79ca3a33]{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--md-on-surface-variant);margin-top:4px}.tool-card-body pre[data-v-79ca3a33]{margin:0;max-height:340px;overflow:auto;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);border-radius:8px;padding:8px 10px;font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.tool-section-text[data-v-79ca3a33]{margin:0;font-size:12.5px;overflow-wrap:anywhere}.tool-error[data-v-79ca3a33]{background:var(--md-error-container);padding:8px 12px;border-radius:8px;margin:0;font-size:12px;overflow-wrap:anywhere}.muted[data-v-79ca3a33]{font-size:12px;color:var(--md-on-surface-variant);margin:0}.tool-dialog-backdrop[data-v-79ca3a33]{position:fixed;inset:0;background:#0008;z-index:1050;display:grid;place-items:center;padding:20px}.tool-dialog[data-v-79ca3a33]{background:var(--md-surface);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:18px 20px;width:min(680px,100%);max-height:82vh;overflow:auto;display:flex;flex-direction:column;gap:12px}.tool-dialog header[data-v-79ca3a33]{display:flex;align-items:center;justify-content:space-between;gap:12px}.tool-dialog h4[data-v-79ca3a33]{margin:0;font-size:15px;overflow-wrap:anywhere;flex:1;min-width:0}#app .tool-dialog-close[data-v-79ca3a33],.tool-dialog-close[data-v-79ca3a33]{flex-shrink:0;width:40px;height:40px;min-height:0;padding:0;border:none;border-radius:50%;background:transparent;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}#app .tool-dialog-close[data-v-79ca3a33]:hover,.tool-dialog-close[data-v-79ca3a33]:hover{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent);box-shadow:none;filter:none;color:var(--md-on-surface)}#app .tool-dialog-close[data-v-79ca3a33]:active,.tool-dialog-close[data-v-79ca3a33]:active{background:color-mix(in srgb,var(--md-on-surface) 12%,transparent);border-radius:50%}.tool-search-results[data-v-79ca3a33]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}.tool-search-results a[data-v-79ca3a33]{color:var(--md-primary);font-size:14px;font-weight:500;text-decoration:none}.tool-search-results a[data-v-79ca3a33]:hover{text-decoration:underline}.tool-search-results p[data-v-79ca3a33]{margin:4px 0 0;font-size:12.5px;line-height:1.65;color:var(--md-on-surface)}.tool-search-results small[data-v-79ca3a33]{display:block;margin-top:2px;font-size:11px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-card[data-v-79ca3a33]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent);background:var(--md-surface-container);transition:box-shadow .22s,background-color .2s}.tool-card[data-v-79ca3a33]:hover{box-shadow:var(--shadow-1)}button.tool-card-head[data-v-79ca3a33]{padding:12px 15px;gap:10px;min-height:46px;border-radius:0}button.tool-card-head[data-v-79ca3a33]:hover{background:var(--md-secondary-container)}.tool-kind[data-v-79ca3a33]{font-weight:700;letter-spacing:.06em}.tool-stat[data-v-79ca3a33]{border-color:color-mix(in srgb,var(--md-primary) 30%,transparent);background:color-mix(in srgb,var(--md-primary) 10%,transparent)}.tool-chevron[data-v-79ca3a33]{width:22px;height:22px;display:inline-grid;place-items:center;border-radius:50%;background:var(--md-surface-container-high);transition:transform .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}.tool-card-body[data-v-79ca3a33]{padding:8px 15px 15px;gap:8px;border-top-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-card-body pre[data-v-79ca3a33]{border-radius:14px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-section-label[data-v-79ca3a33]{font-weight:700}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:14.5px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color .14s,border-radius .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),color .14s}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.selected.highlighted{background:color-mix(in srgb,var(--md-primary-container) 88%,var(--md-primary) 12%)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-search{position:sticky;top:-8px;z-index:1;display:flex;align-items:center;gap:10px;margin:-8px -8px 8px;padding:13px 16px;background:var(--md-surface-container-low);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px 24px 0 0;color:var(--md-on-surface-variant)}.app-select-search input{flex:1;min-width:0;border:0;background:transparent;padding:0;font:inherit;color:var(--md-on-surface);outline:none}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity .18s var(--ease-emphasized,cubic-bezier(.2,0,0,1)),transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.select-menu-leave-active{transition:opacity .13s,transform .13s}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}.thinking-control{min-width:110px;flex:1;display:flex;flex-direction:column;gap:5px}.thinking-caption{font-size:11px}#app .thinking-trigger{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;padding:9px 12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);font-size:12px;border-radius:9px}.thinking-popover{position:fixed;z-index:10000;padding:16px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:0 10px 32px #16244026;color:var(--md-on-surface);font-family:var(--font-family)}.thinking-popover header{display:flex;justify-content:space-between;gap:12px;font-size:13px}.thinking-popover output{color:var(--md-primary);font-weight:600}.thinking-track{position:relative;padding:22px 4px 16px;display:flex;align-items:center}.thinking-track input{appearance:none;-webkit-appearance:none;width:100%;height:5px;padding:0;margin:0;border:0;border-radius:5px;background:linear-gradient(to right,var(--md-primary) var(--intensity),var(--md-outline-variant) var(--intensity));cursor:pointer;z-index:1}.thinking-track input::-webkit-slider-thumb{appearance:none;width:17px;height:17px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface);box-shadow:0 1px 4px #24345d40}.thinking-track input::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface)}.thinking-track input:focus-visible{outline:2px solid var(--md-primary);outline-offset:7px}.thinking-stops{display:flex;justify-content:space-between;gap:3px}.thinking-stops button{font:inherit;font-size:11px;border:0;background:transparent;color:var(--md-on-surface-variant);padding:6px 5px;border-radius:6px;cursor:pointer}.thinking-stops button.selected{background:var(--md-primary-container);color:var(--md-primary);font-weight:700}.thinking-popover p{font-size:11px;line-height:1.5;color:var(--md-on-surface-variant);margin:12px 0 0}.thinking-control.full .thinking-trigger,.thinking-popover.full{--md-primary:#a050db;border-color:#a050db88;box-shadow:0 0 16px #a050db25}.thinking-popover.full .energy-wave{position:absolute;inset:14px 0 8px;pointer-events:none;border-radius:20px;box-shadow:0 0 12px #a050db66}.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger{animation:thinking-boost .85s ease-out}.thinking-popover.pulse .energy-wave{animation:thinking-wave .85s ease-out}@keyframes thinking-boost{0%{box-shadow:0 0 #a050db66}45%{box-shadow:0 0 0 5px #a050db20,0 0 30px #a050db40}to{box-shadow:0 0 16px #a050db25}}@keyframes thinking-wave{0%{transform:scale(.95);opacity:1}to{transform:scale(1.15,2);opacity:0}}.thinking-menu-enter-active,.thinking-menu-leave-active{transition:opacity .13s,transform .13s}.thinking-menu-enter-from,.thinking-menu-leave-to{opacity:0;transform:translateY(4px)}@media (prefers-reduced-motion:reduce){.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger,.thinking-popover.pulse .energy-wave{animation:none}}.thinking-popover{padding:20px;border-radius:28px;background:var(--md-surface-container-low);border-color:transparent;box-shadow:0 8px 28px #24345d24}.thinking-popover header{align-items:center;font-size:14px;min-height:30px}.thinking-popover output{padding:6px 12px;border-radius:999px;background:var(--md-primary-container);font-size:12px}.thinking-track{height:68px;padding:0;margin:12px 0 0;isolation:isolate}.thinking-capsule{position:absolute;left:5px;right:5px;height:28px;border-radius:999px;background:var(--md-primary-container);overflow:hidden;pointer-events:none}.thinking-fill{height:100%;width:var(--intensity);background:var(--md-primary);border-radius:999px}.thinking-tick{position:absolute;top:50%;width:4px;height:4px;border-radius:50%;background:var(--md-primary);transform:translate(-50%,-50%)}.thinking-tick:first-of-type{left:8px!important}.thinking-tick:last-of-type{left:calc(100% - 8px)!important}.thinking-tick.passed{background:var(--md-on-primary)}.thinking-track input{position:relative;height:48px;background:transparent;border-radius:999px;touch-action:pan-y}.thinking-track input::-webkit-slider-runnable-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-webkit-slider-thumb{width:10px;height:44px;margin-top:-8px;border-radius:999px;border:0;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low);transition:width .14s,height .14s,margin-top .14s}.thinking-track input:active::-webkit-slider-thumb{width:6px;height:48px;margin-top:-10px}.thinking-track input::-moz-range-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-moz-range-thumb{width:10px;height:44px;border:0;border-radius:999px;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low)}.thinking-track input:active::-moz-range-thumb{width:6px;height:48px}.thinking-track input:focus-visible{outline-offset:3px}.thinking-stops{align-items:center;gap:2px;margin-top:2px}.thinking-stops button{border-radius:999px;min-height:30px;padding:6px 9px;transition:background-color .16s,color .16s}.thinking-popover.full{background:color-mix(in srgb,var(--md-surface-container-low) 93%,#a050db);border-color:#a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#7255c8,#ad50d6)}.thinking-popover.full .energy-wave{inset:18px 5px;border-radius:999px;z-index:-1}.thinking-popover p{margin-top:12px}.thinking-popover.full{box-shadow:0 8px 28px #24345d24,0 0 34px #a050db33;border-color:#a050db77}.thinking-popover.full .energy-wave{position:absolute;inset:-3px 4px;border-radius:999px;z-index:-1;background:radial-gradient(70% 120% at 100% 50%,#c56bffbb,transparent 68%),radial-gradient(50% 120% at 0% 50%,#6b8cffaa,transparent 70%);filter:blur(7px);animation:thunder-glow 1.7s ease-in-out infinite}@keyframes thunder-glow{0%,to{opacity:.5;transform:scale(1)}45%{opacity:1;transform:scale(1.03)}}.thinking-popover.full .thinking-capsule{box-shadow:0 0 0 1px #a050db66,0 0 26px #a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#6b8cff,#a050db,#e0a3ff,#a050db);background-size:280% 100%;animation:thunder-flow 2.6s linear infinite}@keyframes thunder-flow{to{background-position:280% 0}}.thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-control.full .thinking-trigger span:first-child{animation:thunder-flicker 2s steps(1,end) infinite}@keyframes thunder-flicker{0%,90%,to{opacity:1}92%{opacity:.35}94%{opacity:1}96%{opacity:.5}}#app .thinking-control .thinking-trigger{min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:13px;font-weight:500;align-items:center;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .thinking-control .thinking-trigger:hover{background:var(--md-surface-container-highest)}#app .thinking-control .thinking-trigger[aria-expanded=true]{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-caption{font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.workspace[data-v-1b8a4030]{display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}button[data-v-1b8a4030],input[data-v-1b8a4030],textarea[data-v-1b8a4030],select[data-v-1b8a4030]{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);padding:9px 12px}button[data-v-1b8a4030]{cursor:pointer;transition:background .15s,box-shadow .15s,filter .15s}button[data-v-1b8a4030]:disabled{opacity:.45;cursor:default}button[data-v-1b8a4030]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}input[data-v-1b8a4030]:focus,textarea[data-v-1b8a4030]:focus,select[data-v-1b8a4030]:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}input[type=checkbox][data-v-1b8a4030]{width:auto;accent-color:var(--md-primary)}.sessions[data-v-1b8a4030]{width:284px;flex-shrink:0;border-right:1px solid var(--md-outline-variant);padding:20px 16px;display:flex;flex-direction:column;gap:14px;background:var(--md-surface-container-low)}.sessions header[data-v-1b8a4030]{display:flex;align-items:center;justify-content:space-between;gap:12px}.sessions h1[data-v-1b8a4030]{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}.sessions header>button[data-v-1b8a4030]{height:34px;padding:0 13px;border:0;border-radius:9px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:600 13px/1 inherit}.sessions header>button[data-v-1b8a4030]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.08);box-shadow:var(--shadow-1)}.sessions>input[data-v-1b8a4030]{border-radius:10px;background:var(--md-surface-container-lowest)}.connection[data-v-1b8a4030]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}.connection button[data-v-1b8a4030]{margin-left:auto;padding:3px 9px;border-radius:8px;font-size:13px}.connection i[data-v-1b8a4030]{width:8px;height:8px;border-radius:50%;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}.connection i.online[data-v-1b8a4030]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.filter-bar[data-v-1b8a4030]{display:flex;gap:3px;padding:4px;border-radius:999px;background:var(--md-surface-container-high)}.filter-bar button[data-v-1b8a4030]{flex:1;font-size:12px;font-weight:500;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);box-shadow:none}.filter-bar button[data-v-1b8a4030]:hover:not(:disabled){background:transparent;color:var(--md-on-surface)}.filter-bar button.chosen[data-v-1b8a4030]{background:var(--md-surface-container-lowest);color:var(--md-primary);font-weight:650;box-shadow:var(--shadow-1)}.sessions label input[data-v-1b8a4030]{margin-right:6px}.session-list[data-v-1b8a4030]{overflow-y:auto;flex:1;min-height:0;margin:0 -4px;padding:0 4px}.session-card[data-v-1b8a4030]{display:flex;flex-direction:column;width:100%;text-align:left;gap:6px;margin-bottom:8px;padding:12px 13px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest)}.session-card[data-v-1b8a4030]:hover:not(:disabled){background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.session-card.selected[data-v-1b8a4030]{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}.session-card.selected[data-v-1b8a4030]:hover{background:var(--md-secondary-container)}.session-card strong[data-v-1b8a4030]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:600;font-size:13.5px}.origin[data-v-1b8a4030],small[data-v-1b8a4030],.sessions .muted[data-v-1b8a4030]{font-size:11px;color:var(--md-on-surface-variant)}.origin[data-v-1b8a4030]{font-weight:600;letter-spacing:.02em}.ledger-button[data-v-1b8a4030]{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:12.5px;font-weight:550}.ledger-button.chosen[data-v-1b8a4030]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.ledger[data-v-1b8a4030]{flex:1;overflow-y:auto;padding:var(--space-xl)}.ledger>header[data-v-1b8a4030]{margin-bottom:8px}.ledger>header h2[data-v-1b8a4030]{font-size:18px;font-weight:650}.ledger-entry[data-v-1b8a4030]{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:14px 16px;margin:10px 0;box-shadow:var(--shadow-1)}.ledger-entry>div[data-v-1b8a4030]{display:flex;align-items:center;gap:10px;font-size:12px}.ledger-entry>div>span[data-v-1b8a4030]:first-child{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-weight:600}.ledger-entry>div small[data-v-1b8a4030]{margin-left:auto}.ledger-entry>p[data-v-1b8a4030]{margin:8px 0;font-size:13.5px;line-height:1.6;overflow-wrap:anywhere}.ledger-entry details[data-v-1b8a4030]{margin-top:8px;border-radius:10px;background:var(--md-surface-container);padding:8px 12px;font-size:12px}.ledger-entry summary[data-v-1b8a4030]{cursor:pointer;color:var(--md-on-surface-variant)}.ledger-entry pre[data-v-1b8a4030]{margin:8px 0 0;max-height:300px}.conversation[data-v-1b8a4030]{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}.conversation-header[data-v-1b8a4030]{display:flex;align-items:flex-start;gap:14px}.conversation-header>div[data-v-1b8a4030]:first-child{flex:1;min-width:0}.conversation-header h2[data-v-1b8a4030]{font-size:17px;font-weight:650;margin:0}.conversation-header p[data-v-1b8a4030]{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:12.5px}.session-actions[data-v-1b8a4030]{display:flex;gap:8px;flex-shrink:0}.session-actions button[data-v-1b8a4030]{height:32px;padding:0 13px;border-radius:9px;font-size:12.5px;font-weight:550;background:var(--md-surface-container-lowest)}.running[data-v-1b8a4030]{color:#b88412;font-weight:650;font-size:12px}.failed[data-v-1b8a4030]{color:var(--md-error)}.done[data-v-1b8a4030]{color:var(--md-success);font-weight:600;font-size:12px}.cancelled[data-v-1b8a4030],.muted[data-v-1b8a4030]{color:var(--md-on-surface-variant)}.muted[data-v-1b8a4030]{font-size:12px;line-height:1.6}.error[data-v-1b8a4030]{background:var(--md-error-container);color:#410e0b;padding:11px 16px;border-radius:12px;margin:8px 0;font-size:13px;overflow-wrap:anywhere}.transcript[data-v-1b8a4030]{flex:1;overflow-y:auto;padding:26px 28px;min-height:0}.welcome[data-v-1b8a4030]{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}.welcome[data-v-1b8a4030]:before{content:\"\";display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center}.welcome h2[data-v-1b8a4030]{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}.welcome p[data-v-1b8a4030]{margin:6px 0;font-size:13.5px}.turn[data-v-1b8a4030]{max-width:920px;margin:0 auto 30px;display:flex;flex-direction:column;gap:10px}.bubble[data-v-1b8a4030]{padding:15px 19px;font-size:14px}.bubble.user[data-v-1b8a4030]{align-self:flex-end;max-width:82%;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:16px 16px 4px}.bubble.agent[data-v-1b8a4030]{align-self:flex-start;max-width:100%;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:16px 16px 16px 4px;box-shadow:var(--shadow-1)}.bubble .message-head[data-v-1b8a4030]{display:flex;align-items:center;gap:14px;margin-bottom:10px;font-size:12px}.bubble .message-head b[data-v-1b8a4030]{font-weight:700}.bubble .message-head time[data-v-1b8a4030]{margin-left:auto;opacity:.75;font-size:11px}.bubble .message-head span[data-v-1b8a4030]{margin-left:auto}.bubble.user .message-head[data-v-1b8a4030]{margin-bottom:7px;opacity:.85}.message-text[data-v-1b8a4030]{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}.bubble.agent[data-v-1b8a4030] p{margin:.4em 0}.bubble.agent[data-v-1b8a4030] pre{max-height:420px}.agent-speech[data-v-1b8a4030]{margin:6px 0;padding:2px 0;line-height:1.7}.model-annotation[data-v-1b8a4030]{display:block;font-size:11px;opacity:.7;margin-bottom:4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.agent-speech[data-v-1b8a4030] p{margin:.45em 0}.agent-speech[data-v-1b8a4030] pre{background:var(--md-surface-container);border:1px solid var(--md-outline-variant);border-radius:10px;padding:12px 14px;max-height:460px;overflow:auto;font-size:12.5px}.agent-speech[data-v-1b8a4030] code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.agent-speech[data-v-1b8a4030] ul{padding-left:20px;margin:.4em 0}.steps[data-v-1b8a4030]{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}.steps details[data-v-1b8a4030]{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}.steps summary[data-v-1b8a4030]{cursor:pointer;font-size:12.5px;font-weight:550}.steps summary small[data-v-1b8a4030]{margin-left:10px;font-weight:600}.steps summary[data-v-1b8a4030]::marker{color:var(--md-on-surface-variant)}.steps details pre[data-v-1b8a4030]{margin:10px 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;white-space:pre-wrap;max-height:400px}pre[data-v-1b8a4030]{max-height:450px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.subagent-card[data-v-1b8a4030]{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}button.subagent-card-head[data-v-1b8a4030]{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;border-radius:0;background:transparent;padding:11px 14px;font-size:12.5px}button.subagent-card-head[data-v-1b8a4030]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}button.subagent-card-head>span[data-v-1b8a4030]:first-child{color:var(--md-primary)}button.subagent-card-head>strong[data-v-1b8a4030]{font-weight:700}.subagent-prompt[data-v-1b8a4030]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--md-on-surface)}.subagent-card small[data-v-1b8a4030]{font-weight:600}.subagent-chevron[data-v-1b8a4030]{color:var(--md-on-surface-variant);font-size:11px}.subagent-card-error[data-v-1b8a4030]{margin:0 10px 10px;padding:8px 12px;font-size:12px}.subagent-card.nested[data-v-1b8a4030]{margin:6px 0;box-shadow:none}.sub-view[data-v-1b8a4030]{max-width:900px;margin:0 auto}.sub-view-header[data-v-1b8a4030]{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}.sub-view-header button[data-v-1b8a4030]{flex-shrink:0;border-radius:9px;font-size:12.5px;font-weight:550;background:var(--md-surface-container-lowest)}.sub-view-header h3[data-v-1b8a4030]{margin:0 0 4px;font-size:16px;font-weight:650}.sub-view-header p[data-v-1b8a4030]{margin:0;max-width:520px}.sub-view-header>span[data-v-1b8a4030]{margin-left:auto;font-weight:650;font-size:12px}.sub-view-body[data-v-1b8a4030]{min-height:120px}.composer[data-v-1b8a4030]{flex-shrink:0;margin:0 20px 18px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}.composer-input[data-v-1b8a4030]{position:relative}.composer-input textarea[data-v-1b8a4030]{font-size:14px;width:100%;display:block;min-height:96px;padding:15px 64px 15px 18px;line-height:1.6;resize:vertical;border:0;border-radius:0;background:transparent}.composer-input textarea[data-v-1b8a4030]:focus{box-shadow:none;border:0}.send-fly[data-v-1b8a4030]{position:absolute!important;right:10px!important;bottom:10px!important;z-index:2;width:42px!important;height:42px!important;aspect-ratio:1/1;display:grid!important;place-items:center;border:0!important;border-radius:50%!important;padding:0!important;margin:0!important;background:var(--md-primary);color:var(--md-on-primary,#fff);box-shadow:0 2px 10px color-mix(in srgb,var(--md-primary) 38%,transparent)}.send-fly svg[data-v-1b8a4030]{width:20px;height:20px}.send-fly[data-v-1b8a4030]:hover:not(:disabled){filter:brightness(1.08)}.send-fly[data-v-1b8a4030]:disabled{background:var(--md-surface-container);color:var(--md-on-surface-variant);opacity:.7;box-shadow:none}.send-fly.stop[data-v-1b8a4030]{background:var(--md-error);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--md-error) 40%,transparent)}.compact-notice[data-v-1b8a4030]{font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}.execution-options[data-v-1b8a4030]{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}.execution-options label[data-v-1b8a4030]{display:flex;flex-direction:column;gap:5px;font-size:11px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}.execution-options[data-v-1b8a4030] .app-select-trigger,.execution-options .workspace-select[data-v-1b8a4030]{width:100%;font-size:12.5px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}.workspace-select[data-v-1b8a4030]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}.composer footer[data-v-1b8a4030]{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap;border-top:1px solid var(--md-outline-variant)}.composer footer>select[data-v-1b8a4030],.composer footer>.app-select[data-v-1b8a4030]{font-size:12.5px;border-radius:10px;min-height:34px}.composer footer .muted[data-v-1b8a4030]{flex:1;min-width:120px}.composer footer>button[data-v-1b8a4030]{font-size:12.5px;font-weight:600;border-radius:9px;min-height:34px}.host-panel>strong[data-v-1b8a4030]{font-size:14px}.host-panel dl[data-v-1b8a4030]{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px}.host-panel dt[data-v-1b8a4030]{color:var(--md-on-surface-variant);font-weight:600}.host-panel dd[data-v-1b8a4030]{margin:4px 0 0;overflow-wrap:anywhere}.usage-rings[data-v-1b8a4030]{display:flex;align-items:center;gap:24px;padding:14px 0;flex-wrap:wrap}.usage-metric[data-v-1b8a4030]{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}.usage-ring[data-v-1b8a4030]{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}.usage-ring b[data-v-1b8a4030]{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:15px;font-weight:650;box-shadow:var(--shadow-1)}.new-folder[data-v-1b8a4030]{display:flex;gap:8px}.new-folder input[data-v-1b8a4030]{flex:1;min-width:0}.directory-backdrop[data-v-1b8a4030]{position:fixed;inset:0;background:#14111acc;z-index:1000;display:grid;place-items:center;padding:20px}.directory-dialog[data-v-1b8a4030]{background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:20px;padding:22px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh;box-shadow:var(--shadow-4)}.directory-dialog>header[data-v-1b8a4030]{gap:12px}.directory-dialog>header h2[data-v-1b8a4030]{font-size:16px;font-weight:650}.directory-list[data-v-1b8a4030]{overflow:auto;min-height:180px;display:flex;flex-direction:column;gap:6px}.directory-list button[data-v-1b8a4030]{text-align:left;border-radius:10px;background:var(--md-surface-container-low);font-size:13px}.directory-roots[data-v-1b8a4030]{display:flex;gap:8px;flex-wrap:wrap}.directory-roots button[data-v-1b8a4030]{border-radius:999px;font-size:12px;padding:6px 12px}.directory-dialog code[data-v-1b8a4030]{overflow-wrap:anywhere;font-size:12px;background:var(--md-surface-container);padding:8px 10px;border-radius:8px}.directory-dialog>footer[data-v-1b8a4030]{display:flex;justify-content:flex-end}.directory-dialog>footer button[data-v-1b8a4030]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;font-weight:600}.permission-request[data-v-1b8a4030]{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}.permission-request small[data-v-1b8a4030]{display:block;margin:8px 0}.permission-request pre[data-v-1b8a4030]{max-height:160px;overflow:auto}.permission-request>div[data-v-1b8a4030]{display:flex;justify-content:flex-end;gap:8px}#app .workspace[data-v-1b8a4030]{gap:12px;padding-left:6px;background:var(--md-surface-container)}#app .workspace .sessions[data-v-1b8a4030]{width:296px;gap:14px;padding:18px 14px;border:0;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .workspace .sessions h1[data-v-1b8a4030]{font-size:24px;font-weight:800;letter-spacing:-.02em}#app .workspace .sessions header>button[data-v-1b8a4030]{height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 13px/1 inherit;display:inline-flex;align-items:center;gap:7px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .workspace .sessions header>button[data-v-1b8a4030]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.06);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .sessions>input[data-v-1b8a4030]{min-height:48px;padding:0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:14px}#app .workspace .sessions>input[data-v-1b8a4030]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .workspace .filter-bar[data-v-1b8a4030]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .workspace .filter-bar button[data-v-1b8a4030]{border-radius:999px;padding:8px 4px;font-weight:600}#app .workspace .filter-bar button.chosen[data-v-1b8a4030]{background:var(--md-primary);color:var(--md-on-primary,#fff);font-weight:700;box-shadow:var(--shadow-1)}#app .workspace .filter-bar button.chosen[data-v-1b8a4030]:hover:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff)}#app .workspace .session-list[data-v-1b8a4030]{margin:0 -2px;padding:0 2px}#app .workspace .session-card[data-v-1b8a4030]{gap:5px;margin-bottom:8px;padding:13px 15px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:18px;background:var(--md-surface-container-lowest);transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .2s,border-color .2s,box-shadow .22s,border-radius .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .workspace .session-card[data-v-1b8a4030]:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-1);border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant))}#app .workspace .session-card.selected[data-v-1b8a4030]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent;border-radius:20px 20px 20px 7px;box-shadow:var(--shadow-1)}#app .workspace .session-card .origin[data-v-1b8a4030]{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:10.5px;color:var(--md-primary)}#app .workspace .session-card.selected .origin[data-v-1b8a4030]{color:var(--md-on-secondary-container);opacity:.75}#app .workspace .ledger-button[data-v-1b8a4030]{min-height:44px;border-radius:16px;font-weight:650;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .ledger-button.chosen[data-v-1b8a4030]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent}#app .workspace .ledger-entry[data-v-1b8a4030]{border-radius:20px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-lowest);box-shadow:var(--shadow-1)}#app .workspace .conversation[data-v-1b8a4030]{background:var(--md-surface);border-radius:30px;overflow:hidden;box-shadow:var(--shadow-1)}#app .workspace .conversation-header[data-v-1b8a4030]{padding:20px 26px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .conversation-header h2[data-v-1b8a4030]{font-size:20px;font-weight:750;letter-spacing:-.01em}#app .workspace .session-actions button[data-v-1b8a4030]{height:36px;padding:0 15px;border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .session-actions button[data-v-1b8a4030]:hover:not(:disabled){background:var(--md-surface-container-highest);box-shadow:none}#app .workspace .running[data-v-1b8a4030]{color:#b88412;background:color-mix(in srgb,#B88412 14%,transparent);padding:4px 11px;border-radius:999px;font-weight:700}#app .workspace .transcript[data-v-1b8a4030]{padding:28px 30px}#app .workspace .welcome[data-v-1b8a4030]{margin:64px auto 0}#app .workspace .welcome[data-v-1b8a4030]:before{width:76px;height:76px;border-radius:26px 26px 26px 10px;background-color:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24' fill='none' stroke='%235944c6' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-size:34px 34px}#app .workspace .welcome h2[data-v-1b8a4030]{font-size:26px;font-weight:800;letter-spacing:-.02em}#app .workspace .turn[data-v-1b8a4030]{gap:12px;margin-bottom:32px}#app .workspace .bubble[data-v-1b8a4030]{padding:16px 20px;font-size:14.5px;line-height:1.7}#app .workspace .bubble.user[data-v-1b8a4030]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px;box-shadow:var(--shadow-1);max-width:82%}#app .workspace .bubble.agent[data-v-1b8a4030]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:8px 24px 24px;box-shadow:var(--shadow-1);max-width:100%}#app .workspace .bubble .message-head b[data-v-1b8a4030]{font-weight:750}#app .workspace .steps[data-v-1b8a4030]{gap:9px;margin:14px 0}#app .workspace .steps details[data-v-1b8a4030]{border-radius:16px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);padding:11px 15px}#app .workspace .subagent-card[data-v-1b8a4030]{border-radius:18px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);box-shadow:var(--shadow-1)}#app .workspace button.subagent-card-head[data-v-1b8a4030]{padding:12px 15px}#app .workspace button.subagent-card-head[data-v-1b8a4030]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .sub-view-header[data-v-1b8a4030]{padding-bottom:16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .sub-view-header button[data-v-1b8a4030]{border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .agent-speech[data-v-1b8a4030] pre{border-radius:16px;background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}#app .workspace .composer[data-v-1b8a4030]{margin:0 22px 20px;border-radius:28px;overflow:hidden;background:var(--md-surface-container-lowest);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);box-shadow:var(--shadow-2)}#app .workspace .composer[data-v-1b8a4030]:focus-within{border-color:color-mix(in srgb,var(--md-primary) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent),var(--shadow-2)}#app .workspace .execution-options[data-v-1b8a4030]{padding:12px 16px;gap:10px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .execution-options label[data-v-1b8a4030]{font-weight:700;letter-spacing:.05em}#app .workspace .execution-options .workspace-select[data-v-1b8a4030]{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .execution-options[data-v-1b8a4030] .app-select-trigger,#app .workspace .composer footer[data-v-1b8a4030] .app-select-trigger{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .composer-input textarea[data-v-1b8a4030]{border-radius:0;background:transparent}#app .workspace .send-fly[data-v-1b8a4030]{width:46px!important;height:46px!important;border-radius:50%!important;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .composer footer[data-v-1b8a4030]{border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);padding:12px 16px}#app .workspace .composer footer>button[data-v-1b8a4030]{border-radius:999px;min-height:36px;padding-inline:15px;background:var(--md-surface-container-high);border-color:transparent}#app .workspace .host-panel[data-v-1b8a4030]{margin:0 22px 10px;border-radius:24px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .workspace .usage-ring b[data-v-1b8a4030]{background:var(--md-surface-container-lowest)}#app .workspace .directory-dialog[data-v-1b8a4030]{border-radius:32px;border-color:transparent;box-shadow:var(--shadow-4);background:var(--md-surface-container-low)}#app .workspace .directory-list button[data-v-1b8a4030]{background:var(--md-surface-container-lowest);border-color:transparent;border-radius:16px;min-height:46px}#app .workspace .directory-list button[data-v-1b8a4030]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .directory-roots button[data-v-1b8a4030]{background:var(--md-surface-container-high);border-color:transparent}@media (max-width:800px){.sessions[data-v-1b8a4030]{width:214px;padding:12px 10px}.transcript[data-v-1b8a4030]{padding:14px}.composer[data-v-1b8a4030]{margin:0 12px 12px}.composer footer .muted[data-v-1b8a4030]{display:none}.conversation-header[data-v-1b8a4030]{padding:14px 16px}.welcome[data-v-1b8a4030]{margin:30px auto 0}.turn[data-v-1b8a4030]{margin-bottom:22px}}@media (max-width:560px){.workspace[data-v-1b8a4030]{flex-direction:column}.sessions[data-v-1b8a4030]{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input[data-v-1b8a4030],.filter-bar[data-v-1b8a4030],.connection[data-v-1b8a4030]{display:none}.session-list[data-v-1b8a4030]{display:flex;gap:6px;overflow-x:auto}.session-card[data-v-1b8a4030]{min-width:160px;width:160px;margin-bottom:0}.ledger-button[data-v-1b8a4030]{padding:5px;font-size:12px}}\n";document.head.appendChild(s)}})();
