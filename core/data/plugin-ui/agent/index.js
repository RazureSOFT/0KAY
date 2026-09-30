var xr = Object.defineProperty;
var Sr = (n, e, t) => e in n ? xr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var ee = (n, e, t) => Sr(n, typeof e != "symbol" ? e + "" : e, t);
import { reactive as Tr, defineComponent as Nt, computed as J, openBlock as v, createElementBlock as y, ref as D, onMounted as En, onUnmounted as Rn, normalizeClass as ie, createElementVNode as i, toDisplayString as m, createCommentVNode as P, Fragment as oe, renderList as ye, withModifiers as ze, watch as Ie, nextTick as ct, mergeProps as Ar, unref as re, createBlock as Ot, Teleport as Yn, createVNode as Me, Transition as Ws, withCtx as Vs, normalizeStyle as en, withDirectives as Xt, vModelText as wn, withKeys as $t, createTextVNode as Se, vModelCheckbox as Er } from "vue";
function Rr() {
  const n = Tr({
    agents: [],
    tasks: [],
    sessions: [],
    onlineCount: 0,
    loading: !1,
    error: ""
  });
  let e = null, t = null, s = null, r = "";
  const a = /* @__PURE__ */ new Map();
  let u = null, o = !1;
  function k(I) {
    I.reset && a.clear();
    for (const F of I.removed || []) a.delete(F);
    for (const F of I.tasks || []) a.set(F.task_id, F);
    r = I.cursor || "";
    const U = [...a.values()].sort((F, X) => (X.started_at || "").localeCompare(F.started_at || "") || F.task_id.localeCompare(X.task_id));
    n.tasks = U.filter((F) => F.kind !== "agent_session"), n.sessions = U.filter((F) => F.kind === "agent_session");
  }
  function _() {
    u?.close(), o = !1, u = new EventSource(`/api/tasks/events?cursor=${encodeURIComponent(r)}`), u.onopen = () => {
      o = !0;
    }, u.onerror = () => {
      o = !1;
    }, u.addEventListener("tasks", (I) => {
      try {
        k(JSON.parse(I.data));
      } catch {
        o = !1;
      }
    });
  }
  function T() {
    return t ? (s || (s = t.then(() => (s = null, T()))), s) : (t = E().finally(() => {
      t = null;
    }), t);
  }
  async function E() {
    n.loading = !0, n.error = "";
    try {
      const I = await fetch("/api/agents", { signal: AbortSignal.timeout(8e3) });
      if (!I.ok) throw new Error(`HTTP ${I.status}`);
      const U = await I.json();
      n.agents = U.agents || [], n.onlineCount = U.online_count ?? n.agents.length;
    } catch (I) {
      n.error = I.message || "failed";
    }
    if (!o)
      try {
        const I = await fetch(`/api/tasks?incremental=1&cursor=${encodeURIComponent(r)}`, { signal: AbortSignal.timeout(8e3) });
        if (!I.ok) throw new Error(`任务记录 HTTP ${I.status}`);
        const U = await I.json();
        k(U);
      } catch (I) {
        n.error = I.message || "无法刷新任务记录";
      }
    n.loading = !1;
  }
  function N() {
    T().then(() => {
      e && _();
    }), e && clearInterval(e), e = setInterval(() => {
      !document.hidden && !t && T();
    }, 2e3);
  }
  function z() {
    u?.close(), u = null, o = !1, e && (clearInterval(e), e = null);
  }
  function C(I) {
    return !I.missing_dependencies?.length && (I.status === "PLUGIN_STATUS_HEALTHY" || I.status === "HEALTHY");
  }
  async function G(I) {
    const U = await fetch("/api/agent/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: I }) });
    if (!U.ok) throw new Error(await U.text());
    const F = await U.json();
    return await T(), F.session_id;
  }
  async function L(I, U, F) {
    const X = await fetch("/api/agent/sessions", { method: U === "delete" ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: I, action: U, title: F }) });
    if (!X.ok) throw new Error(await X.text());
    await T();
  }
  async function W(I, U, F, X = {}) {
    const ue = await fetch("/api/agent/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: I, prompt: U, agent_type: F, ...X }) }), B = await ue.text();
    if (await T(), !ue.ok) {
      let b = B;
      try {
        b = JSON.parse(B).message || B;
      } catch {
      }
      throw new Error(b);
    }
  }
  async function Q(I) {
    const U = await fetch("/api/tasks/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: I }) });
    if (!U.ok) throw new Error(await U.text());
    const F = await U.json();
    if (!F.success) throw new Error(F.message);
    await T();
  }
  return Object.assign(n, {
    fetchAgents: T,
    connect: N,
    disconnect: z,
    isHealthy: C,
    createSession: G,
    manageSession: L,
    sendTask: W,
    cancelTask: Q
  });
}
const $r = Rr();
function Cr() {
  return $r;
}
function Zn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var _t = Zn();
function qs(n) {
  _t = n;
}
var bt = { exec: () => null };
function Ct(n) {
  let e = [];
  return (t) => {
    let s = Math.max(0, Math.min(3, t - 1)), r = e[s];
    return r || (r = n(s), e[s] = r), r;
  };
}
function H(n, e = "") {
  let t = typeof n == "string" ? n : n.source, s = { replace: (r, a) => {
    let u = typeof a == "string" ? a : a.source;
    return u = u.replace(_e.caret, "$1"), t = t.replace(r, u), s;
  }, getRegex: () => new RegExp(t, e) };
  return s;
}
var Lr = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), _e = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: Ct((n) => new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: Ct((n) => new RegExp(`^ {0,${n}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: Ct((n) => new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)), headingBeginRegex: Ct((n) => new RegExp(`^ {0,${n}}#`)), htmlBeginRegex: Ct((n) => new RegExp(`^ {0,${n}}(?:</?(?:${nn})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: Ct((n) => new RegExp(`^ {0,${n}}>`)) }, Ir = /^(?:[ \t]*(?:\n|$))+/, Or = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Pr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, tn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Nr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Kn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Gs = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Ys = H(Gs).replace(/bull/g, Kn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Dr = H(Gs).replace(/bull/g, Kn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Xn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Mr = /^[^\n]+/, Qn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, zr = H(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Qn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Fr = H(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, Kn).getRegex(), nn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Jn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ur = H("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Jn).replace("tag", nn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Zs = (n) => H(Xn).replace("hr", tn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", n).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", nn).getRegex(), Br = Zs(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), Hr = Zs(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), jr = H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Hr).getRegex(), es = { blockquote: jr, code: Or, def: zr, fences: Pr, heading: Nr, hr: tn, html: Ur, lheading: Ys, list: Fr, newline: Ir, paragraph: Br, table: bt, text: Mr }, vs = H("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", tn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", nn).getRegex(), Wr = { ...es, lheading: Dr, table: vs, paragraph: H(Xn).replace("hr", tn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", vs).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", nn).getRegex() }, Vr = { ...es, html: H(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Jn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: bt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: H(Xn).replace("hr", tn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ys).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, qr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ks = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, Yr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, et = /[\p{P}\p{S}]/u, Dt = /[\s\p{P}\p{S}]/u, sn = /[^\s\p{P}\p{S}]/u, Zr = H(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Dt).getRegex(), Kr = /[\p{Pi}\p{Ps}"']/u, Xs = /(?!~)[\p{P}\p{S}]/u, Xr = /(?!~)[\s\p{P}\p{S}]/u, Qr = /(?:[^\s\p{P}\p{S}]|~)/u, Jr = H(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Lr ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Qs = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, el = H(Qs, "u").replace(/punct/g, et).getRegex(), tl = H(Qs, "u").replace(/punct/g, Xs).getRegex(), nl = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, sl = H(nl, "u").replace(/openQuote/g, Kr).replace(/punct/g, et).getRegex(), Js = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", rl = H(Js, "gu").replace(/notPunctSpace/g, sn).replace(/punctSpace/g, Dt).replace(/punct/g, et).getRegex(), ll = H(Js, "gu").replace(/notPunctSpace/g, Qr).replace(/punctSpace/g, Xr).replace(/punct/g, Xs).getRegex(), al = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", ol = H(al, "gu").replace(/notPunctSpace/g, sn).replace(/punctSpace/g, Dt).replace(/punct/g, et).getRegex(), il = H("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, sn).replace(/punctSpace/g, Dt).replace(/punct/g, et).getRegex(), ul = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", cl = H(ul, "gu").replace(/notPunctSpace/g, sn).replace(/punctSpace/g, Dt).replace(/punct/g, et).getRegex(), dl = H(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, et).getRegex(), pl = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", hl = H(pl, "gu").replace(/notPunctSpace/g, sn).replace(/punctSpace/g, Dt).replace(/punct/g, et).getRegex(), fl = H(/\\(punct)/, "gu").replace(/punct/g, et).getRegex(), gl = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ml = H(Jn).replace("(?:-->|$)", "-->").getRegex(), kl = H("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ml).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), er = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, xn = H(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", er).getRegex(), vl = H(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", xn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), bl = H(/^!?\[(label)\]\[(ref)\]/).replace("label", xn).replace("ref", Qn).getRegex(), yl = H(/^!?\[(ref)\](?:\[\])?/).replace("ref", Qn).getRegex(), bs = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, _l = H(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", er).getRegex(), wl = H("reflink|nolink(?!\\()", "g").replace("reflink", H(/^!?\[(label)\]\[(ref)\]/).replace("label", _l).replace("ref", bs).getRegex()).replace("nolink", H(/^!?\[(ref)\](?:\[\])?/).replace("ref", bs).getRegex()).getRegex(), ys = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, xl = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/, Sl = H(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, xl).getRegex(), ts = { _backpedal: bt, anyPunctuation: fl, autolink: gl, blockSkip: Jr, br: Ks, code: Gr, del: bt, delLDelim: bt, delRDelim: bt, emStrongLDelim: el, emStrongRDelimAst: rl, emStrongRDelimUnd: il, escape: qr, link: vl, nolink: yl, punctuation: Zr, reflink: bl, reflinkSearch: wl, tag: kl, text: Yr, url: bt }, Tl = { ...ts, emStrongLDelim: sl, emStrongRDelimAst: ol, emStrongRDelimUnd: cl, link: H(/^!?\[(label)\]\((.*?)\)/).replace("label", xn).getRegex(), reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", xn).getRegex() }, jn = { ...ts, emStrongRDelimAst: ll, emStrongLDelim: tl, delLDelim: dl, delRDelim: hl, url: H(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Sl).replace("protocol", ys).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: H(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", ys).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() }, Al = { ...jn, br: H(Ks).replace("{2,}", "*").getRegex(), text: H(jn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, vn = { normal: es, gfm: Wr, pedantic: Vr }, qt = { normal: ts, gfm: jn, breaks: Al, pedantic: Tl }, El = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, _s = (n) => El[n];
function Ce(n, e) {
  if (e) {
    if (_e.escapeTest.test(n)) return n.replace(_e.escapeReplace, _s);
  } else if (_e.escapeTestNoEncode.test(n)) return n.replace(_e.escapeReplaceNoEncode, _s);
  return n;
}
function Rl(n) {
  return n.replace(_e.numericCharacterReference, (e, t, s) => {
    let r = t === void 0 ? Number.parseInt(s, 16) : Number.parseInt(t, 10);
    return r === 0 || r > 1114111 || r >= 55296 && r <= 57343 ? "�" : String.fromCodePoint(r);
  });
}
function ws(n) {
  try {
    n = encodeURI(n).replace(_e.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function xs(n, e) {
  let t = n.replace(_e.findPipe, (a, u, o) => {
    let k = !1, _ = u;
    for (; --_ >= 0 && o[_] === "\\"; ) k = !k;
    return k ? "|" : " |";
  }), s = t.split(_e.splitPipe), r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; r < s.length; r++) s[r] = s[r].trim().replace(_e.slashPipe, "|");
  return s;
}
function ot(n, e, t) {
  let s = n.length;
  if (s === 0) return "";
  let r = 0;
  for (; r < s && n.charAt(s - r - 1) === e; )
    r++;
  return n.slice(0, s - r);
}
function Ss(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && _e.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function Sn(n) {
  return n.trim().toLowerCase().toUpperCase().toLowerCase();
}
function $l(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let s = 0; s < n.length; s++) if (n[s] === "\\") s++;
  else if (n[s] === e[0]) t++;
  else if (n[s] === e[1] && (t--, t < 0)) return s;
  return t > 0 ? -2 : -1;
}
function Ts(n, e = 0) {
  let t = e, s = "";
  for (let r of n) if (r === "	") {
    let a = 4 - t % 4;
    s += " ".repeat(a), t += a;
  } else s += r, t++;
  return s;
}
function As(n, e, t, s, r) {
  let a = e.href, u = e.title || null, o = n[1].replace(r.other.outputLinkReplace, "$1"), k = n[0].charAt(0) === "!";
  s.state.inLink = !0;
  let _ = s.state.linkEmitted, T = s.state.inRawBlock;
  s.state.linkEmitted = !1;
  let E = s.inlineTokens(o), N = s.state.linkEmitted;
  if (s.state.linkEmitted = _, s.state.inLink = !1, !k) {
    if (N) {
      s.state.inRawBlock = T;
      return;
    }
    s.state.linkEmitted = !0;
  }
  return { type: k ? "image" : "link", raw: t, href: a, title: u, text: o, tokens: E };
}
function Cl(n, e, t) {
  let s = n.match(t.other.indentCodeCompensation);
  if (s === null) return e;
  let r = s[1];
  return e.split(`
`).map((a) => {
    let u = a.match(t.other.beginningSpace);
    if (u === null) return a;
    let [o] = u;
    return a.slice(Math.min(o.length, r.length));
  }).join(`
`);
}
function Es(n, e, t, s) {
  if (!e.includes("<")) return !1;
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "\\") {
      r++;
      continue;
    }
    if (e[r] === "`") {
      let o = s.inline.code.exec(e.slice(r));
      if (o) {
        r += o[0].length - 1;
        continue;
      }
    }
    if (e[r] !== "<") continue;
    let a = n.slice(t + r), u = s.inline.tag.exec(a) || s.inline.autolink.exec(a);
    if (u) {
      if (u[0].length > e.length - r) return !0;
      r += u[0].length - 1;
    }
  }
  return !1;
}
var Tn = class {
  constructor(n) {
    ee(this, "options");
    ee(this, "rules");
    ee(this, "lexer");
    this.options = n || _t;
  }
  space(n) {
    let e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(n) {
    let e = this.rules.block.code.exec(n);
    if (e) {
      let t = this.options.pedantic ? e[0] : Ss(e[0]), s = t.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t, codeBlockStyle: "indented", text: s };
    }
  }
  fences(n) {
    let e = this.rules.block.fences.exec(n);
    if (e) {
      let t = e[0], s = Cl(t, e[3] || "", this.rules);
      return { type: "code", raw: t, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: s };
    }
  }
  heading(n) {
    let e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        let s = ot(t, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceTabChar.test(s)) && (t = s.trim());
      }
      return { type: "heading", raw: ot(e[0], `
`), depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(n) {
    let e = this.rules.block.hr.exec(n);
    if (e) return { type: "hr", raw: ot(e[0], `
`) };
  }
  blockquote(n) {
    let e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = ot(e[0], `
`).split(`
`), s = "", r = "", a = [];
      for (; t.length > 0; ) {
        let u = !1, o = [], k;
        for (k = 0; k < t.length; k++) if (this.rules.other.blockquoteStart.test(t[k])) o.push(t[k]), u = !0;
        else if (!u) o.push(t[k]);
        else break;
        t = t.slice(k);
        let _ = o.join(`
`), T = _.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${_}` : _, r = r ? `${r}
${T}` : T;
        let E = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(T, a, !0), this.lexer.state.top = E, t.length === 0) break;
        let N = a.at(-1);
        if (N?.type === "code") break;
        if (N?.type === "blockquote") {
          let z = N, C = t.join(`
`), G = z.raw + `
` + C.replace(this.rules.other.blockquoteSetextReplace2, ""), L = this.blockquote(G);
          a[a.length - 1] = L;
          let W = G.substring(L.raw.length).replace(/^\n/, ""), Q = W ? W.split(`
`).length : 0, I = Q ? t.slice(0, -Q) : t;
          I.length > 0 && (s = `${s}
${I.join(`
`)}`), r = r.substring(0, r.length - z.text.length) + L.text;
          break;
        } else if (N?.type === "list") {
          let z = N, C = z.raw + `
` + t.join(`
`), G = this.list(C);
          a[a.length - 1] = G, s = s.substring(0, s.length - N.raw.length) + G.raw, r = r.substring(0, r.length - z.raw.length) + G.raw, t = C.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: a, text: r };
    }
  }
  list(n) {
    let e = this.rules.block.list.exec(n);
    if (e) {
      let t = e[1].trim(), s = t.length > 1, r = { type: "list", raw: "", ordered: s, start: s ? +t.slice(0, -1) : "", loose: !1, items: [] };
      t = s ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = s ? t : "[*+-]");
      let a = this.rules.other.listItemRegex(t), u = !1;
      for (; n; ) {
        let k = !1, _ = "", T = "";
        if (!(e = a.exec(n)) || this.rules.block.hr.test(n)) break;
        _ = e[0], n = n.substring(_.length);
        let E = e[2].split(`
`, 1)[0], N = e[1].length, z = this.options.pedantic ? Ts(E, N) : E.replace(this.rules.other.leadingSpaceTab, (W) => Ts(W, N)), C = n.split(`
`, 1)[0], G = !z.trim(), L = 0;
        if (this.options.pedantic ? (L = 2, T = z.trimStart()) : G ? L = N + 1 : (L = z.search(this.rules.other.nonSpaceChar), L = L > 4 ? 1 : L, T = z.slice(L), L += N), G && this.rules.other.blankLine.test(C) && (_ += C + `
`, n = n.substring(C.length + 1), k = !0), !k) {
          let W = this.rules.other.nextBulletRegex(L), Q = this.rules.other.hrRegex(L), I = this.rules.other.fencesBeginRegex(L), U = this.rules.other.headingBeginRegex(L), F = this.rules.other.htmlBeginRegex(L), X = this.rules.other.blockquoteBeginRegex(L);
          for (; n; ) {
            let ue = n.split(`
`, 1)[0], B;
            if (C = ue, this.options.pedantic ? (C = C.replace(this.rules.other.listReplaceNesting, "  "), B = C) : B = C.replace(this.rules.other.leadingSpaceTab, (b) => b.replace(this.rules.other.tabCharGlobal, "    ")), I.test(C) || U.test(C) || F.test(C) || X.test(C) || W.test(C) || Q.test(C)) break;
            if (B.search(this.rules.other.nonSpaceChar) >= L || !C.trim()) T += `
` + B.slice(L);
            else {
              if (G || z.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || I.test(z) || U.test(z) || Q.test(z)) break;
              T += `
` + C;
            }
            G = !C.trim(), _ += ue + `
`, n = n.substring(ue.length + 1), z = B.slice(L);
          }
        }
        r.loose || (u ? r.loose = !0 : this.rules.other.doubleBlankLine.test(_) && (u = !0)), r.items.push({ type: "list_item", raw: _, task: !!this.options.gfm && this.rules.other.listIsTask.test(T), loose: !1, text: T, tokens: [] }), r.raw += _;
      }
      let o = r.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let k of r.items) if (this.lexer.state.top = !1, k.tokens = this.lexer.blockTokens(k.text, []), !r.loose) {
        let _ = k.tokens.filter((E) => E.type === "space"), T = _.length > 0 && _.some((E) => this.rules.other.anyLine.test(E.raw));
        r.loose = T;
      }
      for (let k of r.items) {
        let _ = k.tokens[0];
        if (k.task && (_?.type === "text" || _?.type === "paragraph")) {
          k.text = k.text.replace(this.rules.other.listReplaceTask, ""), _.raw = _.raw.replace(this.rules.other.listReplaceTask, ""), _.text = _.text.replace(this.rules.other.listReplaceTask, "");
          for (let E = this.lexer.inlineQueue.length - 1; E >= 0; E--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[E].src)) {
            this.lexer.inlineQueue[E].src = this.lexer.inlineQueue[E].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let T = this.rules.other.listTaskCheckbox.exec(k.raw);
          if (T) {
            let E = { type: "checkbox", raw: T[0] + " ", checked: T[0] !== "[ ]" };
            k.checked = E.checked, r.loose ? k.tokens[0] && ["paragraph", "text"].includes(k.tokens[0].type) && "tokens" in k.tokens[0] && k.tokens[0].tokens ? (k.tokens[0].raw = E.raw + k.tokens[0].raw, k.tokens[0].text = E.raw + k.tokens[0].text, k.tokens[0].tokens.unshift(E)) : k.tokens.unshift({ type: "paragraph", raw: E.raw, text: E.raw, tokens: [E] }) : k.tokens.unshift(E);
          }
        } else k.task && (k.task = !1);
      }
      if (r.loose) for (let k of r.items) {
        k.loose = !0;
        for (let _ of k.tokens) _.type === "text" && (_.type = "paragraph");
      }
      return r;
    }
  }
  html(n) {
    let e = this.rules.block.html.exec(n);
    if (e) {
      let t = Ss(e[0]);
      return { type: "html", block: !0, raw: t, pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: t };
    }
  }
  def(n) {
    let e = this.rules.block.def.exec(n);
    if (e) {
      let t = Sn(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: ot(e[0], `
`), href: s, title: r };
    }
  }
  table(n) {
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = xs(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: ot(e[0], `
`), header: [], align: [], rows: [] };
    if (t.length === s.length) {
      for (let u of s) this.rules.other.tableAlignRight.test(u) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(u) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(u) ? a.align.push("left") : a.align.push(null);
      for (let u = 0; u < t.length; u++) a.header.push({ text: t[u], tokens: this.lexer.inline(t[u]), header: !0, align: a.align[u] });
      for (let u of r) a.rows.push(xs(u, a.header.length).map((o, k) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: a.align[k] })));
      return a;
    }
  }
  lheading(n) {
    let e = this.rules.block.lheading.exec(n);
    if (e) {
      let t = e[1].trim();
      return { type: "heading", raw: ot(e[0], `
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
      if (!this.options.pedantic && Es(n, e[1], t, this.rules)) return;
      let s = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(s)) {
        if (!this.rules.other.endAngleBracket.test(s)) return;
        let u = ot(s.slice(0, -1), "\\");
        if ((s.length - u.length) % 2 === 0) return;
      } else {
        let u = $l(e[2], "()");
        if (u === -2) return;
        if (u > -1) {
          let o = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + u;
          e[2] = e[2].substring(0, u), e[0] = e[0].substring(0, o).trim(), e[3] = "";
        }
      }
      let r = e[2], a = "";
      if (this.options.pedantic) {
        let u = this.rules.other.pedanticHrefTitle.exec(r);
        u && (r = u[1], a = u[3]);
      } else a = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(s) ? r = r.slice(1) : r = r.slice(1, -1)), As(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: a && a.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      let s = t[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Es(n, t[1], s, this.rules)) return;
      let r = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), a = e[Sn(r)];
      if (!a) {
        let u = t[0].charAt(0);
        return { type: "text", raw: u, text: u };
      }
      return As(t, a, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let s = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!s || !s[1] && !s[2] && !s[3] && !s[4] || s[4] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[3]) || !t || this.rules.inline.punctuation.exec(t))) {
      let r = [...s[0]].length - 1, a, u, o = r, k = 0, _ = s[0][0], T = t === _, E = _ === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (E.lastIndex = 0, e = e.slice(-1 * n.length + r); (s = E.exec(e)) !== null; ) {
        if (a = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !a) continue;
        if (u = [...a].length, s[3] || s[4]) {
          o += u;
          continue;
        } else if (s[5] || s[6]) {
          if (r % 3 && !((r + u) % 3)) {
            k += u;
            continue;
          }
          if (T) break;
        }
        if (o -= u, o > 0) continue;
        u = Math.min(u, u + o + k);
        let N = [...s[0]][0].length, z = n.slice(0, r + s.index + N + u);
        if (Math.min(r, u) % 2) {
          let G = z.slice(1, -1);
          return { type: "em", raw: z, text: G, tokens: this.lexer.inlineTokens(G) };
        }
        let C = z.slice(2, -2);
        return { type: "strong", raw: z, text: C, tokens: this.lexer.inlineTokens(C) };
      }
    }
  }
  codespan(n) {
    let e = this.rules.inline.code.exec(n);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(t), r = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return s && r && (t = t.substring(1, t.length - 1)), { type: "codespan", raw: e[0], text: t };
    }
  }
  br(n) {
    let e = this.rules.inline.br.exec(n);
    if (e) return { type: "br", raw: e[0] };
  }
  del(n, e, t = "") {
    let s = this.rules.inline.delLDelim.exec(n);
    if (s && (!s[1] || !t || this.rules.inline.punctuation.exec(t))) {
      let r = [...s[0]].length - 1, a, u, o = r, k = this.rules.inline.delRDelim;
      for (k.lastIndex = 0, e = e.slice(-1 * n.length + r); (s = k.exec(e)) !== null; ) {
        if (a = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !a || (u = [...a].length, u !== r)) continue;
        if (s[3] || s[4]) {
          o += u;
          continue;
        }
        if (o -= u, o > 0) continue;
        u = Math.min(u, u + o);
        let _ = [...s[0]][0].length, T = n.slice(0, r + s.index + _ + u), E = T.slice(r, -r);
        return { type: "del", raw: T, text: E, tokens: this.lexer.inlineTokens(E) };
      }
    }
  }
  autolink(n) {
    let e = this.rules.inline.autolink.exec(n);
    if (e) {
      let t, s;
      return e[2] === "@" ? (t = e[1], s = "mailto:" + t) : (t = e[1], s = t), { type: "link", raw: e[0], text: t, href: s, autolink: !0, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  url(n) {
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let t, s;
      if (e[2] === "@") t = e[0], s = "mailto:" + t;
      else {
        let r;
        do
          r = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (r !== e[0]);
        t = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return { type: "link", raw: e[0], text: t, href: s, autolink: !0, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  inlineText(n) {
    let e = this.rules.inline.text.exec(n);
    if (e) {
      let t = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: t ? e[0] : Rl(e[0]), escaped: t };
    }
  }
}, Be = class Wn {
  constructor(e) {
    ee(this, "tokens");
    ee(this, "options");
    ee(this, "state");
    ee(this, "inlineQueue");
    ee(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || _t, this.options.tokenizer = this.options.tokenizer || new Tn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, linkEmitted: !1, top: !0 };
    let t = { other: _e, block: vn.normal, inline: qt.normal };
    this.options.pedantic ? (t.block = vn.pedantic, t.inline = qt.pedantic) : this.options.gfm && (t.block = vn.gfm, this.options.breaks ? t.inline = qt.breaks : t.inline = qt.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: vn, inline: qt };
  }
  static lex(e, t) {
    return new Wn(t).lex(e);
  }
  static lexInline(e, t) {
    return new Wn(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(_e.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let s = this.inlineQueue[t];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], s = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(_e.tabCharGlobal, "    ").replace(_e.spaceLine, ""));
    let r = 1 / 0;
    for (; e; ) {
      if (e.length < r) r = e.length;
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
      let u = e;
      if (this.options.extensions?.startBlock) {
        let o = 1 / 0, k = e.slice(1), _;
        this.options.extensions.startBlock.forEach((T) => {
          _ = T.call({ lexer: this }, k), typeof _ == "number" && _ >= 0 && (o = Math.min(o, _));
        }), o < 1 / 0 && o >= 0 && (u = e.substring(0, o + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(u))) {
        let o = t.at(-1);
        s && o?.type === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + a.raw, o.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(a), s = u.length !== e.length, e = e.substring(a.raw.length);
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
    for (let s of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (t.test(s[0]) && e.charAt(s.index - 1) !== "!") return !0;
    for (let s of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
      let r = s[0], a = r.lastIndexOf("[");
      if (!(r.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, Sn(r.slice(a + 1, -1)))) && !(a > 1 && this.linkInText(r.slice(1, a - 1)))) return !0;
    }
    return !1;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let s = e;
    if (this.tokens.links && e.includes("[")) {
      let o = this.tokenizer.rules.inline.reflinkSearch, k = (_) => {
        let T = _.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, Sn(_.slice(T + 1, -1)))) return _;
        if (T > 1 && _.charAt(0) !== "!") {
          let E = _.slice(1, T - 1);
          if (this.linkInText(E)) return "[" + E.replace(o, k) + "][" + "a".repeat(_.length - T - 2) + "]";
        }
        return "[" + "a".repeat(_.length - 2) + "]";
      };
      s = s.replace(o, k);
    }
    s = s.replace(this.tokenizer.rules.inline.anyPunctuation, (o) => "+".repeat(o.length)), s = s.replace(this.tokenizer.rules.inline.blockSkip, (o, k, _) => {
      let T = _ ? _.length : 0;
      return o.slice(0, T) + "[" + "a".repeat(o.length - T - 2) + "]";
    }), s = this.options.hooks?.emStrongMask?.call({ lexer: this }, s) ?? s;
    let r = !1, a = "", u = 1 / 0;
    for (; e; ) {
      if (e.length < u) u = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      r || (a = ""), r = !1;
      let o;
      if (this.options.extensions?.inline?.some((_) => (o = _.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
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
        let _ = t.at(-1);
        o.type === "text" && _?.type === "text" ? (_.raw += o.raw, _.text += o.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, s, a)) {
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
      if (o = this.tokenizer.del(e, s, a)) {
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
      let k = e;
      if (this.options.extensions?.startInline) {
        let _ = 1 / 0, T = e.slice(1), E;
        this.options.extensions.startInline.forEach((N) => {
          E = N.call({ lexer: this }, T), typeof E == "number" && E >= 0 && (_ = Math.min(_, E));
        }), _ < 1 / 0 && _ >= 0 && (k = e.substring(0, _ + 1));
      }
      if (o = this.tokenizer.inlineText(k)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (a = o.raw.slice(-1)), r = !0;
        let _ = t.at(-1);
        _?.type === "text" ? (_.raw += o.raw, _.text += o.text) : t.push(o);
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
}, An = class {
  constructor(n) {
    ee(this, "options");
    ee(this, "parser");
    this.options = n || _t;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    let s = (e || "").match(_e.notSpaceStart)?.[0], r = n ? n.replace(_e.endingNewline, "") + `
` : "";
    return s ? '<pre><code class="language-' + Ce(s) + '">' + (t ? r : Ce(r, !0)) + `</code></pre>
` : "<pre><code>" + (t ? r : Ce(r, !0)) + `</code></pre>
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
    let e = n.ordered, t = n.start, s = "";
    for (let u = 0; u < n.items.length; u++) {
      let o = n.items[u];
      s += this.listitem(o);
    }
    let r = e ? "ol" : "ul", a = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + r + a + `>
` + s + "</" + r + `>
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
    for (let r = 0; r < n.header.length; r++) t += this.tablecell(n.header[r]);
    e += this.tablerow({ text: t });
    let s = "";
    for (let r = 0; r < n.rows.length; r++) {
      let a = n.rows[r];
      t = "";
      for (let u = 0; u < a.length; u++) t += this.tablecell(a[u]);
      s += this.tablerow({ text: t });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + s + `</table>
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
    return `<code>${Ce(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, text: t, tokens: s, autolink: r }) {
    let a = r ? Ce(t, !0) : this.parser.parseInline(s), u = ws(n);
    if (u === null) return a;
    n = Ce(u, r);
    let o = '<a href="' + n + '"';
    return e && (o += ' title="' + Ce(e) + '"'), o += ">" + a + "</a>", o;
  }
  image({ href: n, title: e, text: t, tokens: s }) {
    s && (t = this.parser.parseInline(s, this.parser.textRenderer));
    let r = ws(n);
    if (r === null) return Ce(t);
    n = r;
    let a = `<img src="${Ce(n)}" alt="${Ce(t)}"`;
    return e && (a += ` title="${Ce(e)}"`), a += ">", a;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : Ce(n.text);
  }
}, ns = class {
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
}, He = class Vn {
  constructor(e) {
    ee(this, "options");
    ee(this, "renderer");
    ee(this, "textRenderer");
    this.options = e || _t, this.options.renderer = this.options.renderer || new An(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ns();
  }
  static parse(e, t) {
    return new Vn(t).parse(e);
  }
  static parseInline(e, t) {
    return new Vn(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (this.options.extensions?.renderers?.[r.type]) {
        let u = r, o = this.options.extensions.renderers[u.type].call({ parser: this }, u);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(u.type)) {
          t += o || "";
          continue;
        }
      }
      let a = r;
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
          let u = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(u), "";
          throw new Error(u);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    this.renderer.parser = this;
    let s = "";
    for (let r = 0; r < e.length; r++) {
      let a = e[r];
      if (this.options.extensions?.renderers?.[a.type]) {
        let o = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (o !== !1 || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          s += o || "";
          continue;
        }
      }
      let u = a;
      switch (u.type) {
        case "escape": {
          s += t.text(u);
          break;
        }
        case "html": {
          s += t.html(u);
          break;
        }
        case "link": {
          s += t.link(u);
          break;
        }
        case "image": {
          s += t.image(u);
          break;
        }
        case "checkbox": {
          s += t.checkbox(u);
          break;
        }
        case "strong": {
          s += t.strong(u);
          break;
        }
        case "em": {
          s += t.em(u);
          break;
        }
        case "codespan": {
          s += t.codespan(u);
          break;
        }
        case "br": {
          s += t.br(u);
          break;
        }
        case "del": {
          s += t.del(u);
          break;
        }
        case "text": {
          s += t.text(u);
          break;
        }
        default: {
          let o = 'Token with "' + u.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return s;
  }
}, _n, Qt = (_n = class {
  constructor(n) {
    ee(this, "options");
    ee(this, "block");
    this.options = n || _t;
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
    return n ? Be.lex : Be.lexInline;
  }
  provideParser(n = this.block) {
    return n ? He.parse : He.parseInline;
  }
}, ee(_n, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), ee(_n, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), _n), Ll = class {
  constructor(...n) {
    ee(this, "defaults", Zn());
    ee(this, "options", this.setOptions);
    ee(this, "parse", this.parseMarkdown(!0));
    ee(this, "parseInline", this.parseMarkdown(!1));
    ee(this, "Parser", He);
    ee(this, "Renderer", An);
    ee(this, "TextRenderer", ns);
    ee(this, "Lexer", Be);
    ee(this, "Tokenizer", Tn);
    ee(this, "Hooks", Qt);
    this.use(...n);
  }
  walkTokens(n, e) {
    let t = [];
    for (let s of n) switch (t = t.concat(e.call(this, s)), s.type) {
      case "table": {
        let r = s;
        for (let a of r.header) t = t.concat(this.walkTokens(a.tokens, e));
        for (let a of r.rows) for (let u of a) t = t.concat(this.walkTokens(u.tokens, e));
        break;
      }
      case "list": {
        let r = s;
        t = t.concat(this.walkTokens(r.items, e));
        break;
      }
      default: {
        let r = s;
        this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((a) => {
          let u = r[a].flat(1 / 0);
          t = t.concat(this.walkTokens(u, e));
        }) : r.tokens && (t = t.concat(this.walkTokens(r.tokens, e)));
      }
    }
    return t;
  }
  use(...n) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      let s = { ...t };
      if (s.async = this.defaults.async || s.async || !1, t.extensions && (t.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let a = e.renderers[r.name];
          a ? e.renderers[r.name] = function(...u) {
            let o = r.renderer.apply(this, u);
            return o === !1 && (o = a.apply(this, u)), o;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = e[r.level];
          a ? a.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), s.extensions = e), t.renderer) {
        let r = this.defaults.renderer || new An(this.defaults);
        for (let a in t.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let u = a, o = t.renderer[u], k = r[u];
          r[u] = (..._) => {
            let T = o.apply(r, _);
            return T === !1 && (T = k.apply(r, _)), T || "";
          };
        }
        s.renderer = r;
      }
      if (t.tokenizer) {
        let r = this.defaults.tokenizer || new Tn(this.defaults);
        for (let a in t.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let u = a, o = t.tokenizer[u], k = r[u];
          r[u] = (..._) => {
            let T = o.apply(r, _);
            return T === !1 && (T = k.apply(r, _)), T;
          };
        }
        s.tokenizer = r;
      }
      if (t.hooks) {
        let r = this.defaults.hooks || new Qt();
        for (let a in t.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let u = a, o = t.hooks[u], k = r[u];
          Qt.passThroughHooks.has(a) ? r[u] = (_) => {
            if (this.defaults.async && Qt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let E = await o.call(r, _);
              return k.call(r, E);
            })();
            let T = o.call(r, _);
            return k.call(r, T);
          } : r[u] = (..._) => {
            if (this.defaults.async) return (async () => {
              let E = await o.apply(r, _);
              return E === !1 && (E = await k.apply(r, _)), E;
            })();
            let T = o.apply(r, _);
            return T === !1 && (T = k.apply(r, _)), T;
          };
        }
        s.hooks = r;
      }
      if (t.walkTokens) {
        let r = this.defaults.walkTokens, a = t.walkTokens;
        s.walkTokens = function(u) {
          let o = [];
          return o.push(a.call(this, u)), r && (o = o.concat(r.call(this, u))), o;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return Be.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return He.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let s = { ...t }, r = { ...this.defaults, ...s }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = n), r.async) return (async () => {
        let u = r.hooks ? await r.hooks.preprocess(e) : e, o = await (r.hooks ? await r.hooks.provideLexer(n) : n ? Be.lex : Be.lexInline)(u, r), k = r.hooks ? await r.hooks.processAllTokens(o) : o;
        r.walkTokens && await Promise.all(this.walkTokens(k, r.walkTokens));
        let _ = await (r.hooks ? await r.hooks.provideParser(n) : n ? He.parse : He.parseInline)(k, r);
        return r.hooks ? await r.hooks.postprocess(_) : _;
      })().catch(a);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let u = (r.hooks ? r.hooks.provideLexer(n) : n ? Be.lex : Be.lexInline)(e, r);
        r.hooks && (u = r.hooks.processAllTokens(u)), r.walkTokens && this.walkTokens(u, r.walkTokens);
        let o = (r.hooks ? r.hooks.provideParser(n) : n ? He.parse : He.parseInline)(u, r);
        return r.hooks && (o = r.hooks.postprocess(o)), o;
      } catch (u) {
        return a(u);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        let s = "<p>An error occurred:</p><pre>" + Ce(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, yt = new Ll();
function te(n, e) {
  return yt.parse(n, e);
}
te.options = te.setOptions = function(n) {
  return yt.setOptions(n), te.defaults = yt.defaults, qs(te.defaults), te;
};
te.getDefaults = Zn;
te.defaults = _t;
function Il(...n) {
  return yt.use(...n), te.defaults = yt.defaults, qs(te.defaults), te;
}
te.use = Il;
te.walkTokens = function(n, e) {
  return yt.walkTokens(n, e);
};
te.parseInline = yt.parseInline;
te.Parser = He;
te.parser = He.parse;
te.Renderer = An;
te.TextRenderer = ns;
te.Lexer = Be;
te.lexer = Be.lex;
te.Tokenizer = Tn;
te.Hooks = Qt;
te.parse = te;
te.options;
te.setOptions;
te.walkTokens;
te.parseInline;
He.parse;
Be.lex;
/*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE */
function Rs(n, e) {
  (e == null || e > n.length) && (e = n.length);
  for (var t = 0, s = Array(e); t < e; t++) s[t] = n[t];
  return s;
}
function Ol(n) {
  if (Array.isArray(n)) return n;
}
function Pl(n, e) {
  var t = n == null ? null : typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
  if (t != null) {
    var s, r, a, u, o = [], k = !0, _ = !1;
    try {
      if (a = (t = t.call(n)).next, e !== 0) for (; !(k = (s = a.call(t)).done) && (o.push(s.value), o.length !== e); k = !0) ;
    } catch (T) {
      _ = !0, r = T;
    } finally {
      try {
        if (!k && t.return != null && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (_) throw r;
      }
    }
    return o;
  }
}
function Nl() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
function Dl(n, e) {
  return Ol(n) || Pl(n, e) || Ml(n, e) || Nl();
}
function Ml(n, e) {
  if (n) {
    if (typeof n == "string") return Rs(n, e);
    var t = {}.toString.call(n).slice(8, -1);
    return t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set" ? Array.from(n) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Rs(n, e) : void 0;
  }
}
const tr = Object.entries, $s = Object.setPrototypeOf, zl = Object.isFrozen, Fl = Object.getPrototypeOf, Ul = Object.getOwnPropertyDescriptor;
let ke = Object.freeze, be = Object.seal, It = Object.create, nr = typeof Reflect < "u" && Reflect, qn = nr.apply, Gn = nr.construct;
ke || (ke = function(e) {
  return e;
});
be || (be = function(e) {
  return e;
});
qn || (qn = function(e, t) {
  for (var s = arguments.length, r = new Array(s > 2 ? s - 2 : 0), a = 2; a < s; a++) r[a - 2] = arguments[a];
  return e.apply(t, r);
});
Gn || (Gn = function(e) {
  for (var t = arguments.length, s = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) s[r - 1] = arguments[r];
  return new e(...s);
});
const vt = ge(Array.prototype.forEach), Bl = ge(Array.prototype.lastIndexOf), Cs = ge(Array.prototype.pop), Gt = ge(Array.prototype.push), Hl = ge(Array.prototype.splice), Pt = Array.isArray, Jt = ge(String.prototype.toLowerCase), Mn = ge(String.prototype.toString), Ls = ge(String.prototype.match), Yt = ge(String.prototype.replace), Is = ge(String.prototype.indexOf), jl = ge(String.prototype.trim), Wl = ge(Number.prototype.toString), Vl = ge(Boolean.prototype.toString), Os = typeof BigInt > "u" ? null : ge(BigInt.prototype.toString), Ps = typeof Symbol > "u" ? null : ge(Symbol.prototype.toString), Ee = ge(Object.prototype.hasOwnProperty), Zt = ge(Object.prototype.toString), we = ge(RegExp.prototype.test), it = ql(TypeError);
function ge(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, s = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) s[r - 1] = arguments[r];
    return qn(n, e, s);
  };
}
function ql(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
    return Gn(n, t);
  };
}
function Z(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Jt;
  if ($s && $s(n, null), !Pt(e)) return n;
  let s = e.length;
  for (; s--; ) {
    let r = e[s];
    if (typeof r == "string") {
      const a = t(r);
      a !== r && (zl(e) || (e[s] = a), r = a);
    }
    n[r] = !0;
  }
  return n;
}
function Gl(n) {
  for (let e = 0; e < n.length; e++) Ee(n, e) || (n[e] = null);
  return n;
}
function Le(n) {
  const e = It(null);
  for (const s of tr(n)) {
    var t = Dl(s, 2);
    const r = t[0], a = t[1];
    Ee(n, r) && (Pt(a) ? e[r] = Gl(a) : a && typeof a == "object" && a.constructor === Object ? e[r] = Le(a) : e[r] = a);
  }
  return e;
}
function Yl(n) {
  switch (typeof n) {
    case "string":
      return n;
    case "number":
      return Wl(n);
    case "boolean":
      return Vl(n);
    case "bigint":
      return Os ? Os(n) : "0";
    case "symbol":
      return Ps ? Ps(n) : "Symbol()";
    case "undefined":
      return Zt(n);
    case "function":
    case "object": {
      if (n === null) return Zt(n);
      const e = n, t = De(e, "toString");
      if (typeof t == "function") {
        const s = t(e);
        return typeof s == "string" ? s : Zt(s);
      }
      return Zt(n);
    }
    default:
      return Zt(n);
  }
}
function De(n, e) {
  for (; n !== null; ) {
    const s = Ul(n, e);
    if (s) {
      if (s.get) return ge(s.get);
      if (typeof s.value == "function") return ge(s.value);
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
    return we(n, ""), !0;
  } catch {
    return !1;
  }
}
const Ns = ke([
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
]), zn = ke([
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
]), Fn = ke([
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
]), Kl = ke([
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
]), Un = ke([
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
]), Xl = ke([
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
]), Ds = ke(["#text"]), Ms = ke([
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
]), Bn = ke([
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
]), zs = ke([
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
]), bn = ke([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Ql = be(/{{[\w\W]*|^[\w\W]*}}/g), Jl = be(/<%[\w\W]*|^[\w\W]*%>/g), ea = be(/\${[\w\W]*/g), ta = be(/^data-[\-\w.\u00B7-\uFFFF]+$/), na = be(/^aria-[\-\w]+$/), Fs = be(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), sa = be(/^(?:\w+script|data):/i), ra = be(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), la = be(/^html$/i), aa = be(/^[a-z][.\w]*(-[.\w]+)+$/i), Us = be(/<[/\w!]/g), Bs = be(/<[/\w]/g), oa = be(/<\/no(script|embed|frames)/i), ia = be(/\/>/i), $e = {
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
}, sr = [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
], ua = ke(Z({}, sr)), ca = function() {
  const n = {};
  return vt(sr, (e) => {
    n[e] = be(new RegExp("</" + e + "(?=[\\t\\n\\f\\r />])", "i"));
  }), ke(n);
}(), da = function() {
  return typeof window > "u" ? null : window;
}, pa = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function") return null;
  let s = null;
  const r = "data-tt-policy-suffix";
  t && t.hasAttribute(r) && (s = t.getAttribute(r));
  const a = "dompurify" + (s ? "#" + s : "");
  try {
    return e.createPolicy(a, {
      createHTML(u) {
        return u;
      },
      createScriptURL(u) {
        return u;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + a + " could not be created."), null;
  }
}, Hs = function() {
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
}, ut = function(e, t, s, r) {
  return Ee(e, t) && Pt(e[t]) ? Z(r.base ? Le(r.base) : {}, e[t], r.transform) : s;
}, Hn = function(e, t, s) {
  const r = Ee(e, t) ? e[t] : void 0;
  return r && typeof r == "object" ? Le(r) : s();
};
function rr() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : da();
  const e = (S) => rr(S);
  if (e.version = "3.4.16", e.removed = [], !n || !n.document || n.document.nodeType !== $e.document || !n.Element)
    return e.isSupported = !1, e;
  let t = n.document;
  const s = t, r = s.currentScript;
  n.DocumentFragment;
  const a = n.HTMLTemplateElement, u = n.Node, o = n.Element, k = n.NodeFilter;
  n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const _ = n.DOMParser, T = n.trustedTypes, E = o.prototype, N = De(E, "cloneNode"), z = De(E, "remove"), C = De(E, "removeAttributeNode"), G = De(E, "nextSibling"), L = De(E, "childNodes"), W = De(E, "parentNode"), Q = De(E, "shadowRoot"), I = De(E, "attributes"), U = u && u.prototype ? De(u.prototype, "nodeType") : null, F = u && u.prototype ? De(u.prototype, "nodeName") : null, X = u && u.prototype ? De(u.prototype, "ownerDocument") : null, ue = function(l) {
    return U ? U(l) : l.nodeType;
  }, B = function(l) {
    return F ? F(l) : l.nodeName;
  };
  if (typeof a == "function") {
    const S = t.createElement("template");
    S.content && S.content.ownerDocument && (t = S.content.ownerDocument);
  }
  let b, f = "", g, x = !1, R = 0;
  const M = function() {
    if (R > 0) throw it('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, le = function(l) {
    M(), R++;
    try {
      return b.createHTML(l);
    } finally {
      R--;
    }
  }, K = function(l) {
    M(), R++;
    try {
      return b.createScriptURL(l);
    } finally {
      R--;
    }
  }, ve = function() {
    return x || (g = pa(T, r), x = !0), g;
  }, dt = t, pt = dt.implementation, ht = dt.createNodeIterator, tt = dt.createDocumentFragment, nt = dt.getElementsByTagName, rn = s.importNode;
  let ae = Hs();
  e.isSupported = typeof tr == "function" && typeof W == "function" && pt && pt.createHTMLDocument !== void 0;
  const $n = Ql, st = Jl, Cn = ea, Mt = ta, ln = na, Ln = sa, V = ra, an = aa;
  let zt = Fs, ne = null;
  const Ft = Z({}, [
    ...Ns,
    ...zn,
    ...Fn,
    ...Un,
    ...Ds
  ]);
  let se = null;
  const wt = Z({}, [
    ...Ms,
    ...Bn,
    ...zs,
    ...bn
  ]);
  let q = Object.seal(It(null, {
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
  })), me = null, je = null;
  const Te = Object.seal(It(null, {
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
  let Fe = !0, he = !0, ft = !1, fe = !0, Ae = !1, We = !0, Ve = !1, de = !1, Ze = null, Oe = null, qe = !1, Ge = !1, Ke = !1, gt = !1, Ut = !0, on = !1;
  const un = "user-content-";
  let mt = !0, Ue = !1, Xe = {}, Qe = null;
  const cn = Z({}, [
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
  let Bt = null;
  const Ht = Z({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let dn = null;
  const jt = Z({}, [
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
  ]), xt = "http://www.w3.org/1998/Math/MathML", rt = "http://www.w3.org/2000/svg", c = "http://www.w3.org/1999/xhtml";
  let h = c, d = !1, $ = null;
  const Pe = Z({}, [
    xt,
    rt,
    c
  ], Mn), St = ke([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let lt = Z({}, St);
  const rs = ke(["annotation-xml"]);
  let In = Z({}, rs);
  const ir = Z({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let Wt = null;
  const ur = ["application/xhtml+xml", "text/html"], cr = "text/html";
  let pe = null, Tt = null;
  const dr = t.createElement("form"), ls = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, On = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (Tt && Tt === l) return;
    (!l || typeof l != "object") && (l = {}), l = Le(l), Wt = ur.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? cr : l.PARSER_MEDIA_TYPE, pe = Wt === "application/xhtml+xml" ? Mn : Jt, ne = ut(l, "ALLOWED_TAGS", Ft, { transform: pe }), se = ut(l, "ALLOWED_ATTR", wt, { transform: pe }), $ = ut(l, "ALLOWED_NAMESPACES", Pe, { transform: Mn }), dn = ut(l, "ADD_URI_SAFE_ATTR", jt, {
      transform: pe,
      base: jt
    }), Bt = ut(l, "ADD_DATA_URI_TAGS", Ht, {
      transform: pe,
      base: Ht
    }), Qe = ut(l, "FORBID_CONTENTS", cn, { transform: pe }), me = ut(l, "FORBID_TAGS", Le({}), { transform: pe }), je = ut(l, "FORBID_ATTR", Le({}), { transform: pe }), Xe = Ee(l, "USE_PROFILES") ? l.USE_PROFILES && typeof l.USE_PROFILES == "object" ? Le(l.USE_PROFILES) : l.USE_PROFILES : !1, Fe = l.ALLOW_ARIA_ATTR !== !1, he = l.ALLOW_DATA_ATTR !== !1, ft = l.ALLOW_UNKNOWN_PROTOCOLS || !1, fe = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ae = l.SAFE_FOR_TEMPLATES || !1, We = l.SAFE_FOR_XML !== !1, Ve = l.WHOLE_DOCUMENT || !1, Ge = l.RETURN_DOM || !1, Ke = l.RETURN_DOM_FRAGMENT || !1, gt = l.RETURN_TRUSTED_TYPE || !1, qe = l.FORCE_BODY || !1, Ut = l.SANITIZE_DOM !== !1, on = l.SANITIZE_NAMED_PROPS || !1, mt = l.KEEP_CONTENT !== !1, Ue = l.IN_PLACE || !1, zt = Zl(l.ALLOWED_URI_REGEXP) ? l.ALLOWED_URI_REGEXP : Fs, h = typeof l.NAMESPACE == "string" ? l.NAMESPACE : c, lt = Hn(l, "MATHML_TEXT_INTEGRATION_POINTS", () => Z({}, St)), In = Hn(l, "HTML_INTEGRATION_POINTS", () => Z({}, rs));
    const p = Hn(l, "CUSTOM_ELEMENT_HANDLING", () => It(null));
    if (q = It(null), Ee(p, "tagNameCheck") && ls(p.tagNameCheck) && (q.tagNameCheck = p.tagNameCheck), Ee(p, "attributeNameCheck") && ls(p.attributeNameCheck) && (q.attributeNameCheck = p.attributeNameCheck), Ee(p, "allowCustomizedBuiltInElements") && typeof p.allowCustomizedBuiltInElements == "boolean" && (q.allowCustomizedBuiltInElements = p.allowCustomizedBuiltInElements), be(q), Ae && (he = !1), Ke && (Ge = !0), Xe && (ne = Z({}, Ds), se = It(null), Xe.html === !0 && (Z(ne, Ns), Z(se, Ms)), Xe.svg === !0 && (Z(ne, zn), Z(se, Bn), Z(se, bn)), Xe.svgFilters === !0 && (Z(ne, Fn), Z(se, Bn), Z(se, bn)), Xe.mathMl === !0 && (Z(ne, Un), Z(se, zs), Z(se, bn))), Te.tagCheck = null, Te.attributeCheck = null, Ee(l, "ADD_TAGS") && (typeof l.ADD_TAGS == "function" ? Te.tagCheck = l.ADD_TAGS : Pt(l.ADD_TAGS) && (ne === Ft && (ne = Le(ne)), Z(ne, l.ADD_TAGS, pe))), Ee(l, "ADD_ATTR") && (typeof l.ADD_ATTR == "function" ? Te.attributeCheck = l.ADD_ATTR : Pt(l.ADD_ATTR) && (se === wt && (se = Le(se)), Z(se, l.ADD_ATTR, pe))), Ee(l, "ADD_FORBID_CONTENTS") && Pt(l.ADD_FORBID_CONTENTS) && (Qe === cn && (Qe = Le(Qe)), Z(Qe, l.ADD_FORBID_CONTENTS, pe)), mt && (ne["#text"] = !0), Ve && Z(ne, [
      "html",
      "head",
      "body"
    ]), ne.table && (Z(ne, ["tbody"]), delete me.tbody), l.TRUSTED_TYPES_POLICY) {
      if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function") throw it('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw it('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const w = b;
      b = l.TRUSTED_TYPES_POLICY;
      try {
        f = le("");
      } catch (A) {
        throw b = w, A;
      }
    } else l.TRUSTED_TYPES_POLICY === null ? (b = void 0, f = "") : (b === void 0 && (b = ve()), b && typeof f == "string" && (f = le("")));
    ke && ke(l), Tt = l;
  }, as = Z({}, [
    ...zn,
    ...Fn,
    ...Kl
  ]), os = Z({}, [...Un, ...Xl]), pr = function(l, p, w) {
    return p.namespaceURI === c ? l === "svg" : p.namespaceURI === xt ? l === "svg" && (w === "annotation-xml" || lt[w]) : !!as[l];
  }, hr = function(l, p, w) {
    return p.namespaceURI === c ? l === "math" : p.namespaceURI === rt ? l === "math" && In[w] : !!os[l];
  }, fr = function(l, p, w) {
    return p.namespaceURI === rt && !In[w] || p.namespaceURI === xt && !lt[w] ? !1 : !os[l] && (ir[l] || !as[l]);
  }, gr = function(l) {
    let p = W(l);
    (!p || !p.tagName) && (p = {
      namespaceURI: h,
      tagName: "template"
    });
    const w = Jt(l.tagName), A = Jt(p.tagName);
    return $[l.namespaceURI] ? l.namespaceURI === rt ? pr(w, p, A) : l.namespaceURI === xt ? hr(w, p, A) : l.namespaceURI === c ? fr(w, p, A) : !!(Wt === "application/xhtml+xml" && $[l.namespaceURI]) : !1;
  }, at = function(l) {
    Gt(e.removed, { element: l });
    try {
      W(l).removeChild(l);
    } catch {
      if (z(l), !W(l)) throw it("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, is = function(l, p, w) {
    try {
      C(l, p);
    } catch {
      try {
        l.removeAttribute(w);
      } catch {
      }
    }
  }, pn = function(l) {
    hn(l);
    const p = L(l);
    if (p) {
      const A = [];
      vt(p, (O) => {
        Gt(A, O);
      }), vt(A, (O) => {
        try {
          z(O);
        } catch {
        }
      });
    }
    const w = I(l);
    if (w) for (let A = w.length - 1; A >= 0; --A) {
      const O = w[A], j = O && O.name;
      typeof j == "string" && is(l, O, j);
    }
  }, kt = function(l, p, w) {
    if (!w) try {
      w = p.getAttributeNode(l);
    } catch {
      w = null;
    }
    Gt(e.removed, {
      attribute: w || null,
      from: p
    });
    try {
      w ? C(p, w) : p.removeAttribute(l);
    } catch {
      try {
        p.removeAttribute(l);
      } catch {
      }
    }
    if (l === "is")
      if (Ge || Ke) try {
        at(p);
      } catch {
      }
      else try {
        p.setAttribute(l, "");
      } catch {
      }
  }, mr = function(l) {
    const p = I(l);
    if (p)
      for (let w = p.length - 1; w >= 0; --w) {
        const A = p[w], O = A && A.name;
        typeof O != "string" || se[pe(O)] || is(l, A, O);
      }
  }, hn = function(l) {
    const p = [l];
    for (; p.length > 0; ) {
      const w = p.pop();
      ue(w) === $e.element && mr(w);
      const A = L(w);
      if (A) for (let O = A.length - 1; O >= 0; --O) p.push(A[O]);
    }
  }, us = function(l, p) {
    return We ? l === "patchsrc" ? !0 : l === "for" && p !== "label" && p !== "output" : !1;
  }, kr = function(l) {
    if (!We) return;
    const p = [l];
    for (; p.length > 0; ) {
      const w = p.pop(), A = ue(w);
      if (A === $e.processingInstruction || A === $e.comment && we(Bs, w.data)) {
        try {
          z(w);
        } catch {
        }
        continue;
      }
      if (A === $e.element) {
        const j = w, Y = pe(B(w));
        try {
          j.hasAttribute && j.hasAttribute("patchsrc") && j.removeAttribute("patchsrc"), j.hasAttribute && j.hasAttribute("for") && us("for", Y) && j.removeAttribute("for");
        } catch {
        }
      }
      const O = L(w);
      if (O) for (let j = O.length - 1; j >= 0; --j) p.push(O[j]);
    }
  }, cs = function(l) {
    let p = null, w = null;
    if (qe) l = "<remove></remove>" + l;
    else {
      const j = Ls(l, /^[\r\n\t ]+/);
      w = j && j[0];
    }
    Wt === "application/xhtml+xml" && h === c && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const A = b ? le(l) : l;
    if (h === c) try {
      p = new _().parseFromString(A, Wt);
    } catch {
    }
    if (!p || !p.documentElement) {
      p = pt.createDocument(h, "template", null);
      try {
        p.documentElement.innerHTML = d ? f : A;
      } catch {
      }
    }
    const O = p.body || p.documentElement;
    return l && w && O.insertBefore(t.createTextNode(w), O.childNodes[0] || null), h === c ? nt.call(p, Ve ? "html" : "body")[0] : Ve ? p.documentElement : O;
  }, ds = function(l) {
    const p = X ? X(l) : l.ownerDocument;
    return ht.call(p || l, l, k.SHOW_ELEMENT | k.SHOW_COMMENT | k.SHOW_TEXT | k.SHOW_PROCESSING_INSTRUCTION | k.SHOW_CDATA_SECTION, null);
  }, fn = function(l) {
    return l = Yt(l, $n, " "), l = Yt(l, st, " "), l = Yt(l, Cn, " "), l;
  }, Pn = function(l) {
    var p;
    l.normalize();
    const w = X ? X(l) : l.ownerDocument, A = ht.call(w || l, l, k.SHOW_TEXT | k.SHOW_COMMENT | k.SHOW_CDATA_SECTION | k.SHOW_PROCESSING_INSTRUCTION, null);
    let O = A.nextNode();
    for (; O; )
      O.data = fn(O.data), O = A.nextNode();
    const j = (p = l.querySelectorAll) === null || p === void 0 ? void 0 : p.call(l, "template");
    j && vt(j, (Y) => {
      At(Y.content) && Pn(Y.content);
    });
  }, gn = function(l) {
    const p = F ? F(l) : null;
    return typeof p != "string" || pe(p) !== "form" ? !1 : typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || l.attributes !== I(l) || typeof l.removeAttribute != "function" || typeof l.removeAttributeNode != "function" || typeof l.getAttributeNode != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function" || l.nodeType !== U(l) || l.childNodes !== L(l);
  }, At = function(l) {
    if (!U || typeof l != "object" || l === null) return !1;
    try {
      return U(l) === $e.documentFragment;
    } catch {
      return !1;
    }
  }, Vt = function(l) {
    if (!U || typeof l != "object" || l === null) return !1;
    try {
      return typeof U(l) == "number";
    } catch {
      return !1;
    }
  };
  function Ye(S, l, p) {
    S.length !== 0 && vt(S, (w) => {
      w.call(e, l, p, Tt);
    });
  }
  const vr = function(l, p) {
    return !!(We && l.hasChildNodes() && !Vt(l.firstElementChild) && we(Us, l.textContent) && we(Us, l.innerHTML) || We && l.namespaceURI === c && ua[p] && (Vt(l.firstElementChild) || typeof l.textContent == "string" && we(ca[p], l.textContent)) || l.nodeType === $e.processingInstruction || We && l.nodeType === $e.comment && we(Bs, l.data));
  }, mn = function(l, p) {
    if (l instanceof RegExp) return we(l, p);
    if (l instanceof Function) {
      for (var w = arguments.length, A = new Array(w > 2 ? w - 2 : 0), O = 2; O < w; O++) A[O - 2] = arguments[O];
      return !!l(p, ...A);
    }
    return !1;
  }, br = function(l, p, w) {
    if (!me[p] && gs(p) && mn(q.tagNameCheck, p)) return !1;
    if (mt && !Qe[p]) {
      const A = W(l), O = L(l);
      if (O && A) {
        const j = O.length;
        for (let Y = j - 1; Y >= 0; --Y) {
          const ce = l === w ? N(O[Y], !0) : O[Y];
          A.insertBefore(ce, G(l));
        }
      }
    }
    return at(l), !0;
  }, ps = function(l, p, w, A) {
    return l.length === 0 ? p : p === w || p === A ? Le(p) : p;
  }, Et = function(l, p) {
    return l === p || W(l) !== null ? !1 : (Ue && hn(l), !0);
  }, hs = function(l, p) {
    if (Ye(ae.beforeSanitizeElements, l, null), Et(l, p)) return !0;
    if (gn(l))
      return at(l), !0;
    const w = pe(B(l));
    if (ne = ps(ae.uponSanitizeElement, ne, Ft, Ze), Ye(ae.uponSanitizeElement, l, {
      tagName: w,
      allowedTags: ne
    }), Et(l, p)) return !0;
    if (vr(l, w))
      return at(l), !0;
    if (me[w] || !(Te.tagCheck instanceof Function && Te.tagCheck(w)) && !ne[w]) {
      const A = br(l, w, p);
      return A === !1 && (Ye(ae.afterSanitizeElements, l, null), Et(l, p)) ? !0 : A;
    }
    if (ue(l) === $e.element && !gr(l) || (w === "noscript" || w === "noembed" || w === "noframes") && we(oa, l.innerHTML))
      return at(l), !0;
    if (Ae && l.nodeType === $e.text) {
      const A = fn(l.textContent);
      l.textContent !== A && (Gt(e.removed, { element: l.cloneNode() }), l.textContent = A);
    }
    return Ye(ae.afterSanitizeElements, l, null), Et(l, p);
  }, fs = function(l, p, w) {
    if (je[p] || us(p, l) || Ut && (p === "id" || p === "name") && (w in t || w in dr)) return !1;
    const A = se[p] || Te.attributeCheck instanceof Function && Te.attributeCheck(p, l);
    return he && we(Mt, p) || Fe && we(ln, p) ? !0 : A ? dn[p] || we(zt, Yt(w, V, "")) || (p === "src" || p === "xlink:href" || p === "href") && l !== "script" && Is(w, "data:") === 0 && Bt[l] || ft && !we(Ln, Yt(w, V, "")) ? !0 : !w : gs(l) && mn(q.tagNameCheck, l) && mn(q.attributeNameCheck, p, l) || p === "is" && q.allowCustomizedBuiltInElements && mn(q.tagNameCheck, w);
  }, yr = Z({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), gs = function(l) {
    return !yr[Jt(l)] && we(an, l);
  }, _r = function(l, p, w, A) {
    if (b && typeof T == "object" && typeof T.getAttributeType == "function" && !w) switch (T.getAttributeType(l, p)) {
      case "TrustedHTML":
        return le(A);
      case "TrustedScriptURL":
        return K(A);
    }
    return A;
  }, wr = function(l, p, w, A) {
    try {
      return w ? l.setAttributeNS(w, p, A) : l.setAttribute(p, A), gn(l) ? (at(l), !1) : !0;
    } catch {
      return kt(p, l), !1;
    }
  }, ms = function(l, p) {
    if (Ye(ae.beforeSanitizeAttributes, l, null), Et(l, p)) return;
    const w = l.attributes;
    if (!w || gn(l)) return;
    se = ps(ae.uponSanitizeAttribute, se, wt, Oe);
    const A = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: se,
      forceKeepAttr: void 0
    };
    let O = w.length;
    const j = pe(l.nodeName);
    for (; O--; ) {
      const Y = w[O], ce = Y.name, Ne = Y.namespaceURI, Re = Y.value, Rt = pe(ce), Dn = Re;
      let xe = ce === "value" ? Dn : jl(Dn), ks = !1;
      if (A.attrName = Rt, A.attrValue = xe, A.keepAttr = !0, A.forceKeepAttr = void 0, Ye(ae.uponSanitizeAttribute, l, A), xe = A.attrValue, on && (Rt === "id" || Rt === "name") && Is(xe, un) !== 0 && (kt(ce, l, Y), xe = un + xe, ks = !0), We && we(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, xe)) {
        kt(ce, l, Y);
        continue;
      }
      if (Rt === "attributename" && Ls(xe, "href")) {
        kt(ce, l, Y);
        continue;
      }
      if (!A.forceKeepAttr) {
        if (!A.keepAttr) {
          kt(ce, l, Y);
          continue;
        }
        if (!fe && we(ia, xe)) {
          kt(ce, l, Y);
          continue;
        }
        if (Ae && (xe = fn(xe)), !fs(j, Rt, xe)) {
          kt(ce, l, Y);
          continue;
        }
        xe = _r(j, Rt, Ne, xe), xe !== Dn && wr(l, ce, Ne, xe) && ks && Cs(e.removed);
      }
    }
    Ye(ae.afterSanitizeAttributes, l, null), Et(l, p);
  }, kn = function(l) {
    let p = null;
    const w = ds(l);
    for (Ye(ae.beforeSanitizeShadowDOM, l, null); p = w.nextNode(); )
      if (Ye(ae.uponSanitizeShadowNode, p, null), hs(p, l), ms(p, l), At(p.content) && kn(p.content), ue(p) === $e.element) {
        const A = Q(p);
        At(A) && (Nn(A), kn(A));
      }
    Ye(ae.afterSanitizeShadowDOM, l, null);
  }, Nn = function(l) {
    const p = [{
      node: l,
      shadow: null
    }];
    for (; p.length > 0; ) {
      const w = p.pop();
      if (w.shadow) {
        kn(w.shadow);
        continue;
      }
      const A = w.node, O = ue(A) === $e.element, j = L(A);
      if (j) for (let Y = j.length - 1; Y >= 0; --Y) p.push({
        node: j[Y],
        shadow: null
      });
      if (O) {
        const Y = F ? F(A) : null;
        if (typeof Y == "string" && pe(Y) === "template") {
          const ce = A.content;
          At(ce) && p.push({
            node: ce,
            shadow: null
          });
        }
      }
      if (O) {
        const Y = Q(A);
        At(Y) && p.push({
          node: null,
          shadow: Y
        }, {
          node: Y,
          shadow: null
        });
      }
    }
  };
  return e.sanitize = function(S) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, p = null, w = null, A = null, O = null;
    if (d = !S, d && (S = "<!-->"), typeof S != "string" && !Vt(S) && (S = Yl(S), typeof S != "string"))
      throw it("dirty is not a string, aborting");
    if (!e.isSupported) return S;
    de ? (ne = Ze, se = Oe) : On(l), (ae.uponSanitizeElement.length > 0 || ae.uponSanitizeAttribute.length > 0) && (ne = Le(ne)), ae.uponSanitizeAttribute.length > 0 && (se = Le(se)), e.removed = [];
    const j = Ue && typeof S != "string" && Vt(S);
    if (j) {
      kr(S);
      const Ne = B(S);
      if (typeof Ne == "string") {
        const Re = pe(Ne);
        if (!ne[Re] || me[Re])
          throw pn(S), it("root node is forbidden and cannot be sanitized in-place");
      }
      if (gn(S))
        throw pn(S), it("root node is clobbered and cannot be sanitized in-place");
      try {
        Nn(S);
      } catch (Re) {
        throw pn(S), Re;
      }
    } else if (Vt(S))
      p = cs("<!---->"), w = p.ownerDocument.importNode(S, !0), w.nodeType === $e.element && w.nodeName === "BODY" || w.nodeName === "HTML" ? p = w : p.appendChild(w), Nn(p);
    else {
      if (!Ge && !Ae && !Ve && S.indexOf("<") === -1) return b && gt ? le(S) : S;
      if (p = cs(S), !p) return Ge ? null : gt ? f : "";
    }
    p && qe && at(p.firstChild);
    const Y = j ? S : p;
    try {
      const Ne = ds(Y);
      for (; A = Ne.nextNode(); )
        hs(A, Y), ms(A, Y), At(A.content) && kn(A.content);
    } catch (Ne) {
      throw j && (pn(S), vt(e.removed, (Re) => {
        Re.element && hn(Re.element);
      })), Ne;
    }
    if (j) {
      let Ne = !1;
      if (vt(e.removed, (Re) => {
        Re.element && (Re.element === S && (Ne = !0), hn(Re.element));
      }), Ne) throw it("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return Ae && Pn(S), S;
    }
    if (Ge) {
      if (Ae && Pn(p), Ke)
        for (O = tt.call(p.ownerDocument); p.firstChild; ) O.appendChild(p.firstChild);
      else O = p;
      return (se.shadowroot || se.shadowrootmode) && (O = rn.call(s, O, !0)), O;
    }
    let ce = Ve ? p.outerHTML : p.innerHTML;
    return Ve && ne["!doctype"] && p.ownerDocument && p.ownerDocument.doctype && p.ownerDocument.doctype.name && we(la, p.ownerDocument.doctype.name) && (ce = "<!DOCTYPE " + p.ownerDocument.doctype.name + `>
` + ce), Ae && (ce = fn(ce)), b && gt ? le(ce) : ce;
  }, e.setConfig = function() {
    let S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    On(S), de = !0, Ze = ne, Oe = se;
  }, e.clearConfig = function() {
    Tt = null, de = !1, Ze = null, Oe = null, b = g, f = "";
  }, e.isValidAttribute = function(S, l, p) {
    Tt || On({});
    const w = pe(S), A = pe(l);
    return fs(w, A, p);
  }, e.addHook = function(S, l) {
    typeof l == "function" && Ee(ae, S) && Gt(ae[S], l);
  }, e.removeHook = function(S, l) {
    if (Ee(ae, S)) {
      if (l !== void 0) {
        const p = Bl(ae[S], l);
        return p === -1 ? void 0 : Hl(ae[S], p, 1)[0];
      }
      return Cs(ae[S]);
    }
  }, e.removeHooks = function(S) {
    Ee(ae, S) && (ae[S] = []);
  }, e.removeAllHooks = function() {
    ae = Hs();
  }, e;
}
var ha = rr();
const fa = ["innerHTML"], ga = /* @__PURE__ */ Nt({
  __name: "MarkdownContent",
  props: {
    content: {}
  },
  setup(n) {
    const e = n, t = J(() => ha.sanitize(te.parse(e.content, { async: !1, breaks: !0 })));
    return (s, r) => (v(), y("div", {
      class: "markdown-content",
      innerHTML: t.value
    }, null, 8, fa));
  }
}), ss = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [s, r] of e)
    t[s] = r;
  return t;
}, Kt = /* @__PURE__ */ ss(ga, [["__scopeId", "data-v-ef377647"]]);
function lr() {
  const n = localStorage.getItem("0kay_lang");
  return n === "en" || n === "zh" ? n : navigator.language.startsWith("zh") ? "zh" : "en";
}
const Je = D(lr());
function ma() {
  Je.value = lr();
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
  key: 1,
  class: "tool-shot"
}, Sa = ["src", "alt"], Ta = {
  key: 2,
  class: "diff-wrap"
}, Aa = { class: "diff-file-head" }, Ea = ["title"], Ra = {
  key: 0,
  class: "diff-file-stat"
}, $a = { class: "diff-body" }, Ca = { class: "diff-no" }, La = { class: "diff-no" }, Ia = { class: "diff-sign" }, Oa = { class: "diff-text" }, Pa = {
  key: 0,
  class: "tool-section-label"
}, Na = { key: 1 }, Da = {
  key: 2,
  class: "tool-section-text"
}, Ma = {
  key: 4,
  class: "muted"
}, za = {
  key: 5,
  class: "tool-error"
}, Fa = ["aria-label"], Ua = ["aria-label", "title"], Ba = {
  key: 0,
  class: "muted"
}, Ha = {
  key: 1,
  class: "tool-search-results"
}, ja = ["href"], Wa = { key: 0 }, Va = { key: 1 }, qa = {
  key: 2,
  class: "muted"
}, Ga = {
  key: 3,
  class: "tool-error"
}, Ya = /* @__PURE__ */ Nt({
  __name: "ToolStepCard",
  props: {
    step: {},
    formatError: { type: Function }
  },
  setup(n) {
    const e = n, t = (b, f) => Je.value === "en" ? f : b, s = D(!1), r = D(!1), a = J(() => (e.step.prompt || "").trim() || "tool"), u = J(() => ["websearch", "web_search", "search"].includes(a.value)), o = J(() => {
      if (!e.step.args) return null;
      try {
        const b = JSON.parse(e.step.args);
        return b && typeof b == "object" && !Array.isArray(b) ? b : null;
      } catch {
        return null;
      }
    }), k = J(() => {
      if (!e.step.result) return null;
      try {
        return JSON.parse(e.step.result);
      } catch {
        return e.step.result;
      }
    }), _ = J(() => {
      const b = k.value;
      return !b || typeof b != "object" || Array.isArray(b) ? null : b.data !== void 0 && b.data !== null && typeof b.data == "object" && !Array.isArray(b.data) ? b.data : "success" in b ? null : b;
    }), T = J(() => {
      const b = _.value;
      return !b || typeof b.base64 != "string" || typeof b.mime != "string" || !b.mime.startsWith("image/") ? null : { src: `data:${b.mime};base64,${b.base64}`, width: b.width, height: b.height, path: b.path };
    }), E = J(() => {
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
        case "computeruse":
          return t("电脑操作", "Computer");
        default:
          return t("工具", "Tool");
      }
    }), N = (b) => (Je.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[b] || b;
    function z(b) {
      let f = 0, g = 0;
      for (const x of String(b || "").split(`
`))
        x.startsWith("---") || x.startsWith("+++") || (x.startsWith("+") ? f++ : x.startsWith("-") && g++);
      return { added: f, removed: g };
    }
    const C = J(() => {
      const b = a.value, f = _.value;
      if (!f) return "";
      if (b === "write") return typeof f.lines == "number" ? `+${f.lines} ${t("行", "lines")}` : "";
      if (b === "edit") {
        const { added: g, removed: x } = z(f.diff);
        return g || x ? `+${g} −${x}` : "";
      }
      if (b === "apply_patch" && Array.isArray(f.files)) {
        let g = 0, x = 0;
        for (const R of f.files) {
          const M = z(R?.diff);
          g += M.added, x += M.removed;
        }
        return g || x ? `+${g} −${x}` : "";
      }
      return "";
    });
    function G(b, f) {
      const g = [];
      let x = null, R = 0, M = 0;
      const le = (K) => {
        x || (x = { path: f, lines: [] }, g.push(x)), x.lines.push(K);
      };
      for (const K of String(b || "").split(`
`)) {
        if (K.startsWith("+++ ")) {
          const ve = K.slice(4).split("	")[0].trim().replace(/^[ab]\//, "");
          x = { path: ve === "/dev/null" ? f : ve, lines: [] }, g.push(x);
          continue;
        }
        if (!K.startsWith("--- ")) {
          if (K.startsWith("diff --git")) {
            x || (x = { path: f, lines: [] }, g.push(x));
            continue;
          }
          if (K.startsWith("@@")) {
            const ve = /@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(K);
            ve && (R = parseInt(ve[1], 10), M = parseInt(ve[2], 10)), le({ kind: "hunk", oldNo: "", newNo: "", text: K });
            continue;
          }
          if (/^(index |new file|deleted file|old mode|new mode|similarity |rename |copy )/.test(K)) {
            le({ kind: "meta", oldNo: "", newNo: "", text: K });
            continue;
          }
          if (K.startsWith("+")) {
            le({ kind: "add", oldNo: "", newNo: String(M++), text: K.slice(1) });
            continue;
          }
          if (K.startsWith("-")) {
            le({ kind: "del", oldNo: String(R++), newNo: "", text: K.slice(1) });
            continue;
          }
          if (K.startsWith("\\")) {
            le({ kind: "meta", oldNo: "", newNo: "", text: K });
            continue;
          }
          le({ kind: "ctx", oldNo: String(R++), newNo: String(M++), text: K });
        }
      }
      return g;
    }
    const L = J(() => {
      const b = a.value, f = _.value, g = o.value;
      if (b === "edit" && f) return G(String(f.diff || ""), String(g?.filePath || f.path || ""));
      if (b === "apply_patch") {
        const x = [];
        if (Array.isArray(f?.files)) {
          for (const R of f.files) {
            const M = G(String(R?.diff || ""), String(R?.path || ""));
            M.length ? x.push(...M) : x.push({ path: String(R?.path || ""), lines: [] });
          }
          return x;
        }
        if (Array.isArray(g?.patches)) {
          const R = g.patches.map((M) => String(M?.patch ?? M?.diff ?? M?.text ?? "")).join(`
`);
          return G(R, "");
        }
        return x;
      }
      return [];
    });
    function W(b) {
      const f = b.lines || [], g = f.filter((R) => R.kind === "add").length, x = f.filter((R) => R.kind === "del").length;
      return g || x ? `+${g} −${x}` : "";
    }
    const Q = J(() => {
      const b = a.value, f = o.value, g = _.value, x = (R, M = 160) => (R || "").length > M ? `${R.slice(0, M)}…` : R || "";
      if (u.value) {
        const R = x(String(g?.query ?? f?.query ?? "")), M = Array.isArray(g?.results) ? g.results.length : 0;
        return R + (M ? ` · ${M} ${t("条结果", "results")}` : "");
      }
      if (b === "bash") {
        const R = x(String(f?.command ?? "")), M = g && g.exitCode !== void 0 && e.step.state !== "running" ? ` · ${t("退出码", "exit")} ${g.exitCode}` : "";
        return R + M;
      }
      if (b === "webfetch")
        return x(String(g?.url ?? f?.url ?? "")) + (g?.status !== void 0 && g?.status !== null ? ` · HTTP ${g.status}` : "");
      if (b === "read" || b === "write") return x(String(g?.path ?? f?.filePath ?? ""));
      if (b === "edit") return x(String(f?.filePath ?? g?.path ?? ""));
      if (b === "apply_patch") {
        const R = Array.isArray(f?.patches) ? f.patches.map((M) => M?.filePath).filter(Boolean) : Array.isArray(g?.files) ? g.files.map((M) => M?.path).filter(Boolean) : [];
        return x(R.join(", "));
      }
      if (b === "todowrite") {
        const R = Array.isArray(f?.todos) ? f.todos : Array.isArray(g?.todos) ? g.todos : [];
        if (!R.length) return x(String(e.step.args || ""));
        const M = R.length, le = R.filter((ve) => ve?.status === "completed").length, K = R.filter((ve) => ve?.status === "in_progress").length;
        return `${M} ${t("项", "items")} · ${t("完成", "done")} ${le}${K ? ` · ${t("进行中", "running")} ${K}` : ""}`;
      }
      if (b === "computeruse") {
        const R = String(f?.action ?? g?.action ?? ""), M = f && f.x !== void 0 ? ` (${f.x}, ${f.y})` : "", le = g?.width && g?.height ? ` · ${g.width}×${g.height}` : "", K = Array.isArray(g?.windows) ? ` · ${g.windows.length} ${t("个窗口", "windows")}` : "";
        return x(`${R}${M}${le}${K}`);
      }
      if (f && Object.keys(f).length)
        try {
          return x(JSON.stringify(f));
        } catch {
        }
      return x(String(e.step.args || ""));
    }), I = J(() => String(_.value?.query ?? o.value?.query ?? e.step.args ?? "")), U = J(() => Array.isArray(_.value?.results) ? _.value.results : []), F = J(() => typeof k.value == "string" ? k.value : k.value === null && e.step.result ? e.step.result : ""), X = J(() => {
      const b = a.value, f = _.value;
      if (b === "computeruse" && T.value) return [];
      if (b === "bash" && f) {
        const x = [{ label: t("工作目录", "cwd"), text: String(f.cwd || "") }];
        return f.stdout && x.push({ label: "stdout", text: String(f.stdout), mono: !0 }), f.stderr && x.push({ label: "stderr", text: String(f.stderr), mono: !0 }), !f.stdout && !f.stderr && x.push({ label: "", text: t("（无输出）", "(no output)") }), x;
      }
      if (b === "write" && f) {
        const x = [{ label: t("文件", "File"), text: String(f.path || "") }];
        return x.push({ label: t("内容", "Content"), text: `${typeof f.lines == "number" ? f.lines : "—"} ${t("行", "lines")}${f.created ? ` · ${t("新建文件", "created")}` : ""} · ${f.bytes ?? "—"} B` }), x;
      }
      if (b === "edit" || b === "apply_patch") return [];
      if (b === "read" && f) {
        const x = [{ label: t("文件", "File"), text: String(f.path || "") }];
        return x.push({ label: `${t("第", "line")} ${f.offset ?? "—"} ${t("行起", "onward")}`, text: String(f.content || ""), mono: !0 }), x;
      }
      if (b === "webfetch" && f)
        return [
          { label: "URL", text: String(f.url || "") },
          { label: t("内容", "Content"), text: String(f.content || ""), mono: !0 }
        ];
      const g = e.step.result;
      if (!g) return [];
      try {
        return [{ label: "JSON", text: JSON.stringify(k.value, null, 2), mono: !0 }];
      } catch {
        return [{ label: "", text: String(g), mono: !0 }];
      }
    });
    function ue() {
      if (u.value) {
        r.value = !r.value;
        return;
      }
      s.value = !s.value;
    }
    function B(b) {
      b.key === "Escape" && r.value && (r.value = !1);
    }
    return En(() => window.addEventListener("keydown", B)), Rn(() => window.removeEventListener("keydown", B)), (b, f) => (v(), y("div", {
      class: ie(["tool-card", { expanded: s.value }])
    }, [
      i("button", {
        type: "button",
        class: "tool-card-head",
        onClick: ue
      }, [
        i("span", {
          class: ie(["tool-dot", n.step.state])
        }, "●", 2),
        i("strong", ka, m(E.value), 1),
        i("span", va, m(Q.value), 1),
        C.value ? (v(), y("small", ba, m(C.value), 1)) : P("", !0),
        i("small", ya, m(N(n.step.state)), 1),
        f[2] || (f[2] = i("span", {
          class: "tool-chevron",
          "aria-hidden": "true"
        }, "▸", -1))
      ]),
      s.value && !u.value ? (v(), y("div", _a, [
        n.step.state === "running" && !X.value.length && !L.value.length && !T.value ? (v(), y("p", wa, m(t("执行中…", "Running…")), 1)) : P("", !0),
        T.value ? (v(), y("figure", xa, [
          i("img", {
            src: T.value.src,
            alt: t("屏幕截图", "Screenshot")
          }, null, 8, Sa),
          i("figcaption", null, m(T.value.width && T.value.height ? `${T.value.width}×${T.value.height} · ` : "") + m(T.value.path), 1)
        ])) : P("", !0),
        L.value.length ? (v(), y("div", Ta, [
          (v(!0), y(oe, null, ye(L.value, (g, x) => (v(), y("div", {
            key: x,
            class: "diff-file"
          }, [
            i("div", Aa, [
              i("span", {
                class: "diff-file-path",
                title: g.path
              }, m(g.path || "—"), 9, Ea),
              W(g) ? (v(), y("span", Ra, m(W(g)), 1)) : P("", !0)
            ]),
            i("div", $a, [
              (v(!0), y(oe, null, ye(g.lines, (R, M) => (v(), y("div", {
                key: M,
                class: ie(["diff-line", R.kind])
              }, [
                i("span", Ca, m(R.oldNo), 1),
                i("span", La, m(R.newNo), 1),
                i("span", Ia, m(R.kind === "add" ? "+" : R.kind === "del" ? "-" : ""), 1),
                i("span", Oa, m(R.text), 1)
              ], 2))), 128))
            ])
          ]))), 128))
        ])) : T.value ? P("", !0) : (v(!0), y(oe, { key: 3 }, ye(X.value, (g, x) => (v(), y(oe, { key: x }, [
          g.label ? (v(), y("small", Pa, m(g.label), 1)) : P("", !0),
          g.mono ? (v(), y("pre", Na, m(g.text), 1)) : (v(), y("p", Da, m(g.text), 1))
        ], 64))), 128)),
        !X.value.length && !L.value.length && !T.value && n.step.state !== "running" && !n.step.error ? (v(), y("p", Ma, m(t("执行完成，无输出", "Completed with no output")), 1)) : P("", !0),
        n.step.error ? (v(), y("p", za, m(n.formatError?.(n.step.error) || n.step.error), 1)) : P("", !0)
      ])) : P("", !0),
      r.value ? (v(), y("div", {
        key: 1,
        class: "tool-dialog-backdrop",
        onClick: f[1] || (f[1] = ze((g) => r.value = !1, ["self"]))
      }, [
        i("section", {
          class: "tool-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t("搜索结果", "Search results")
        }, [
          i("header", null, [
            i("h4", null, m(t("搜索", "Search")) + " · " + m(I.value), 1),
            i("button", {
              type: "button",
              class: "tool-dialog-close",
              "aria-label": t("关闭", "Close"),
              title: t("关闭", "Close"),
              onClick: f[0] || (f[0] = (g) => r.value = !1)
            }, [...f[3] || (f[3] = [
              i("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                i("path", {
                  d: "M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                })
              ], -1)
            ])], 8, Ua)
          ]),
          n.step.state === "running" ? (v(), y("p", Ba, m(t("搜索中…", "Searching…")), 1)) : U.value.length ? (v(), y("ol", Ha, [
            (v(!0), y(oe, null, ye(U.value, (g, x) => (v(), y("li", { key: x }, [
              i("a", {
                href: g.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }, m(g.title || g.url), 9, ja),
              g.snippet ? (v(), y("p", Wa, m(g.snippet), 1)) : P("", !0),
              g.title && g.url ? (v(), y("small", Va, m(g.url), 1)) : P("", !0)
            ]))), 128))
          ])) : (v(), y("p", qa, m(F.value || t("没有找到相关结果。", "No relevant results found.")), 1)),
          n.step.error ? (v(), y("p", Ga, m(n.formatError?.(n.step.error) || n.step.error), 1)) : P("", !0)
        ], 8, Fa)
      ])) : P("", !0)
    ], 2));
  }
}), js = /* @__PURE__ */ ss(Ya, [["__scopeId", "data-v-f13fbd25"]]);
function ar(n = "") {
  const e = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`;
  return n ? `${n}-${e}` : e;
}
const Za = ["aria-expanded", "aria-controls", "aria-activedescendant", "aria-label", "disabled"], Ka = { class: "app-select-value" }, Xa = {
  class: "app-select-chevron",
  "aria-hidden": "true"
}, Qa = ["id", "aria-label"], Ja = {
  key: 0,
  class: "app-select-search"
}, eo = ["placeholder"], to = ["id", "aria-selected", "aria-disabled", "data-index", "onPointermove", "onClick"], no = {
  key: 0,
  class: "app-select-check",
  "aria-hidden": "true"
}, so = {
  key: 1,
  class: "app-select-empty"
}, yn = /* @__PURE__ */ Nt({
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
    const t = n, s = e, r = D(null), a = D(null), u = D(null), o = D(!1), k = D(-1), _ = D({}), T = D(!1), E = D(""), N = ar("select"), z = J(() => t.options.map((f) => typeof f == "string" ? { value: f, label: f } : f)), C = J(() => {
      if (!t.searchable || !E.value.trim()) return z.value;
      const f = E.value.trim().toLocaleLowerCase();
      return z.value.filter((g) => g.label.toLocaleLowerCase().includes(f) || g.value.toLocaleLowerCase().includes(f));
    }), G = J(() => z.value.find((f) => f.value === t.modelValue)?.label || t.modelValue || t.placeholder);
    let L = "", W = 0;
    function Q() {
      const f = r.value?.getBoundingClientRect();
      if (!f) return;
      const g = window.visualViewport?.height || innerHeight, x = window.visualViewport?.width || innerWidth, R = g - f.bottom - 10, M = f.top - 10;
      T.value = R < Math.min(280, C.value.length * 46 + 58) && M > R;
      const le = Math.max(48, Math.min(340, T.value ? M : R)), K = Math.min(Math.max(f.width, 220), x - 16);
      _.value = { position: "fixed", left: `${Math.max(8, Math.min(f.left, x - K - 8))}px`, width: `${K}px`, maxHeight: `${le}px`, ...T.value ? { bottom: `${g - f.top + 8}px` } : { top: `${f.bottom + 8}px` } };
    }
    function I(f = !1) {
      o.value = !1, E.value = "", L = "", f && r.value?.focus();
    }
    async function U() {
      t.disabled || o.value || (o.value = !0, E.value = "", k.value = C.value.findIndex((f) => f.value === t.modelValue && !f.disabled), k.value < 0 && (k.value = C.value.findIndex((f) => !f.disabled)), Q(), s("open"), await ct(), t.searchable && u.value?.focus(), F());
    }
    function F() {
      a.value?.querySelector(`[data-index="${k.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function X(f) {
      const g = C.value[f];
      !g || g.disabled || (s("update:modelValue", g.value), s("change", g.value), I(!0));
    }
    async function ue(f) {
      if (!(t.disabled || f.isComposing)) {
        if (f.key === "Tab") {
          I();
          return;
        }
        if (f.key === "Escape") {
          o.value && (f.preventDefault(), I(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(f.key)) {
          if (t.searchable && f.key === " ") return;
          if (f.preventDefault(), !o.value) {
            await U();
            return;
          }
          if (f.key === "Enter") {
            X(k.value);
            return;
          }
          const g = C.value.map((R, M) => R.disabled ? -1 : M).filter((R) => R >= 0);
          if (!g.length) return;
          const x = g.indexOf(k.value);
          k.value = f.key === "Home" ? g[0] : f.key === "End" ? g[g.length - 1] : g[(x + (f.key === "ArrowDown" ? 1 : -1) + g.length) % g.length], await ct(), F();
          return;
        }
        if (!t.searchable && f.key.length === 1 && !f.ctrlKey && !f.metaKey && !f.altKey) {
          await U();
          const g = Date.now();
          L = g - W > 700 ? f.key : L + f.key, W = g;
          const x = C.value.findIndex((R) => !R.disabled && R.label.toLocaleLowerCase().startsWith(L.toLocaleLowerCase()));
          x >= 0 && (k.value = x, await ct(), F());
        }
      }
    }
    function B(f) {
      const g = f.target;
      !r.value?.contains(g) && !a.value?.contains(g) && I();
    }
    function b(f) {
      o.value && (!(f.target instanceof Node) || !a.value?.contains(f.target)) && Q();
    }
    return Ie(() => t.disabled, (f) => {
      f && I();
    }), Ie(C, () => {
      o.value && (k.value >= C.value.length && (k.value = C.value.findIndex((f) => !f.disabled)), ct(Q));
    }), Ie(E, () => {
      o.value && (k.value = C.value.findIndex((f) => !f.disabled), ct(F));
    }), En(() => {
      document.addEventListener("pointerdown", B, !0), window.addEventListener("resize", Q), window.addEventListener("scroll", b, !0);
    }), Rn(() => {
      document.removeEventListener("pointerdown", B, !0), window.removeEventListener("resize", Q), window.removeEventListener("scroll", b, !0);
    }), (f, g) => (v(), y("div", Ar(f.$attrs, {
      class: ["app-select", { "is-disabled": n.disabled, "is-open": o.value }]
    }), [
      i("button", {
        ref_key: "trigger",
        ref: r,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": o.value,
        "aria-controls": o.value ? re(N) : void 0,
        "aria-activedescendant": o.value && k.value >= 0 ? `${re(N)}-${k.value}` : void 0,
        "aria-label": n.ariaLabel,
        disabled: n.disabled,
        onClick: g[0] || (g[0] = (x) => o.value ? I() : U()),
        onKeydown: ue,
        onFocus: g[1] || (g[1] = (x) => s("focus", x))
      }, [
        i("span", Ka, m(G.value), 1),
        i("span", Xa, [
          (v(), y("svg", {
            class: ie({ "is-open": o.value }),
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none"
          }, [...g[4] || (g[4] = [
            i("path", {
              d: "m6 9 6 6 6-6",
              stroke: "currentColor",
              "stroke-width": "1.9",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, null, -1)
          ])], 2))
        ])
      ], 40, Za),
      (v(), Ot(Yn, { to: "body" }, [
        Me(Ws, { name: "select-menu" }, {
          default: Vs(() => [
            o.value ? (v(), y("div", {
              key: 0,
              id: re(N),
              ref_key: "menu",
              ref: a,
              class: ie(["app-select-menu", { "opens-up": T.value }]),
              style: en(_.value),
              role: "listbox",
              "aria-label": n.ariaLabel || "选项",
              onPointerdown: g[3] || (g[3] = ze(() => {
              }, ["prevent"]))
            }, [
              n.searchable ? (v(), y("label", Ja, [
                g[5] || (g[5] = i("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  i("circle", {
                    cx: "11",
                    cy: "11",
                    r: "7",
                    stroke: "currentColor",
                    "stroke-width": "1.8"
                  }),
                  i("path", {
                    d: "m20 20-3.5-3.5",
                    stroke: "currentColor",
                    "stroke-width": "1.8",
                    "stroke-linecap": "round"
                  })
                ], -1)),
                Xt(i("input", {
                  ref_key: "searchInput",
                  ref: u,
                  "onUpdate:modelValue": g[2] || (g[2] = (x) => E.value = x),
                  type: "text",
                  placeholder: re(Je) === "en" ? "Search…" : "搜索…",
                  onKeydown: ue
                }, null, 40, eo), [
                  [wn, E.value]
                ])
              ])) : P("", !0),
              (v(!0), y(oe, null, ye(C.value, (x, R) => (v(), y("div", {
                id: `${re(N)}-${R}`,
                key: `${x.value}:${R}`,
                role: "option",
                "aria-selected": x.value === n.modelValue,
                "aria-disabled": !!x.disabled,
                "data-index": R,
                class: ie(["app-select-option", { highlighted: k.value === R, selected: x.value === n.modelValue, disabled: x.disabled }]),
                onPointermove: (M) => !x.disabled && (k.value = R),
                onClick: ze((M) => X(R), ["stop"])
              }, [
                i("span", null, m(x.label), 1),
                x.value === n.modelValue ? (v(), y("span", no, [...g[6] || (g[6] = [
                  i("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none"
                  }, [
                    i("path", {
                      d: "m5 12 4 4L19 6",
                      stroke: "currentColor",
                      "stroke-width": "2.4",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ], -1)
                ])])) : P("", !0)
              ], 42, to))), 128)),
              C.value.length ? P("", !0) : (v(), y("div", so, m(re(Je) === "en" ? "No matches" : "没有匹配项"), 1))
            ], 46, Qa)) : P("", !0)
          ]),
          _: 1
        })
      ]))
    ], 16));
  }
}), ro = { class: "thinking-caption" }, lo = ["disabled", "aria-expanded", "aria-controls"], ao = ["id", "onKeydown"], oo = {
  class: "thinking-capsule",
  "aria-hidden": "true"
}, io = ["value", "aria-valuetext"], uo = {
  key: 0,
  class: "energy-wave",
  "aria-hidden": "true"
}, co = { class: "thinking-stops" }, po = ["aria-pressed", "onClick"], ho = { class: "thinking-provider-note" }, fo = /* @__PURE__ */ Nt({
  __name: "ThinkingSlider",
  props: {
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = J(() => Je.value === "en"), s = n, r = e, a = J(() => [{ value: 0, label: t.value ? "Off" : "关闭思考" }, { value: 20, label: t.value ? "Low" : "低" }, { value: 50, label: t.value ? "Medium" : "中" }, { value: 75, label: t.value ? "High" : "高" }, { value: 100, label: t.value ? "Max" : "最高" }]), u = J(() => s.modelValue === 0 ? 0 : s.modelValue < 35 ? 1 : s.modelValue < 62.5 ? 2 : s.modelValue < 87.5 ? 3 : 4), o = D(!1), k = D({}), _ = D(null), T = D(null), E = D(null), N = D(u.value * 25), z = D(!1), C = J(() => u.value === 4), G = ar("thinking");
    let L;
    Ie(() => s.modelValue, () => {
      o.value || (N.value = u.value * 25);
    }), Ie(C, (B, b) => {
      B && !b && (z.value = !0, clearTimeout(L), L = setTimeout(() => z.value = !1, 900));
    }), Ie(() => s.disabled, (B) => {
      B && (o.value = !1);
    });
    function W() {
      const B = _.value?.getBoundingClientRect();
      if (!B) return;
      const b = Math.min(352, innerWidth - 16), f = 236, g = B.top >= f + 8 || innerHeight - B.bottom < f;
      k.value = { left: `${Math.max(8, Math.min(B.left, innerWidth - b - 8))}px`, width: `${b}px`, ...g ? { bottom: `${innerHeight - B.top + 8}px` } : { top: `${B.bottom + 8}px` } };
    }
    async function Q() {
      s.disabled || (o.value = !o.value, o.value && (N.value = u.value * 25, W(), await ct(), E.value?.focus()));
    }
    function I() {
      o.value = !1, _.value?.focus();
    }
    function U(B) {
      N.value = Number(B.target.value), r("update:modelValue", a.value[Math.round(N.value / 25)].value);
    }
    function F(B) {
      N.value = B * 25, r("update:modelValue", a.value[B].value);
    }
    function X(B) {
      const b = B.target;
      !_.value?.contains(b) && !T.value?.contains(b) && (o.value = !1);
    }
    function ue(B) {
      o.value && (!(B.target instanceof Node) || !T.value?.contains(B.target)) && W();
    }
    return En(() => {
      document.addEventListener("pointerdown", X, !0), window.addEventListener("resize", W), window.addEventListener("scroll", ue, !0);
    }), Rn(() => {
      clearTimeout(L), document.removeEventListener("pointerdown", X, !0), window.removeEventListener("resize", W), window.removeEventListener("scroll", ue, !0);
    }), (B, b) => (v(), y("div", {
      class: ie(["thinking-control", { full: C.value, pulse: z.value }])
    }, [
      i("span", ro, m(t.value ? "Thinking effort" : "思考强度"), 1),
      i("button", {
        ref_key: "trigger",
        ref: _,
        type: "button",
        class: "thinking-trigger",
        disabled: n.disabled,
        "aria-label": "思考强度",
        "aria-haspopup": "dialog",
        "aria-expanded": o.value,
        "aria-controls": o.value ? re(G) : void 0,
        onClick: Q,
        onKeydown: $t(I, ["esc"])
      }, [
        i("span", null, m(C.value ? "✦ " : "") + m(a.value[u.value].label), 1),
        b[5] || (b[5] = i("span", { "aria-hidden": "true" }, "⌄", -1))
      ], 40, lo),
      (v(), Ot(Yn, { to: "body" }, [
        Me(Ws, { name: "thinking-menu" }, {
          default: Vs(() => [
            o.value ? (v(), y("section", {
              key: 0,
              id: re(G),
              ref_key: "panel",
              ref: T,
              class: ie(["thinking-popover", { full: C.value, pulse: z.value }]),
              style: en(k.value),
              role: "dialog",
              "aria-label": "调整思考强度",
              onKeydown: $t(ze(I, ["prevent", "stop"]), ["esc"])
            }, [
              i("header", null, [
                i("strong", null, m(t.value ? "Thinking effort" : "思考强度"), 1),
                i("output", null, m(C.value ? "✦ " : "") + m(a.value[u.value].label), 1)
              ]),
              i("div", {
                class: "thinking-track",
                style: en({ "--intensity": `${N.value}%` })
              }, [
                i("div", oo, [
                  b[6] || (b[6] = i("div", { class: "thinking-fill" }, null, -1)),
                  (v(!0), y(oe, null, ye(a.value, (f, g) => (v(), y("span", {
                    key: g,
                    class: ie(["thinking-tick", { passed: N.value >= g * 25 }]),
                    style: en({ left: `${g * 25}%` })
                  }, null, 6))), 128))
                ]),
                i("input", {
                  ref_key: "range",
                  ref: E,
                  type: "range",
                  min: "0",
                  max: "100",
                  step: "0.1",
                  value: N.value,
                  "aria-label": "思考强度滑块",
                  "aria-valuetext": a.value[u.value].label,
                  onInput: U,
                  onChange: b[0] || (b[0] = (f) => N.value = u.value * 25),
                  onKeydown: [
                    b[1] || (b[1] = $t(ze((f) => F(0), ["prevent"]), ["home"])),
                    b[2] || (b[2] = $t(ze((f) => F(4), ["prevent"]), ["end"])),
                    b[3] || (b[3] = $t(ze((f) => F(Math.min(4, u.value + 1)), ["prevent"]), ["arrow-right"])),
                    b[4] || (b[4] = $t(ze((f) => F(Math.max(0, u.value - 1)), ["prevent"]), ["arrow-left"]))
                  ]
                }, null, 40, io),
                C.value ? (v(), y("span", uo)) : P("", !0)
              ], 4),
              i("div", co, [
                (v(!0), y(oe, null, ye(a.value, (f, g) => (v(), y("button", {
                  key: f.value,
                  type: "button",
                  class: ie({ selected: u.value === g }),
                  "aria-pressed": u.value === g,
                  onClick: (x) => F(g)
                }, m(f.label), 11, po))), 128))
              ]),
              i("p", null, m(t.value ? u.value === 0 ? "Disable model reasoning" : C.value ? "Maximum effort" : "Drag to adjust; release to snap to a level" : u.value === 0 ? "不启用模型思考模式" : C.value ? "全力思考 · 已达到最高档" : "拖动滑块调整，松开后定位到对应档位"), 1),
              i("p", ho, m(t.value ? "Actual reasoning controls depend on the selected provider. Max may map to High." : "实际推理参数取决于供应商；最高档可能映射为高档。"), 1)
            ], 46, ao)) : P("", !0)
          ]),
          _: 1
        })
      ]))
    ], 2));
  }
}), Lt = D(null);
function or() {
  function n(t) {
    const s = typeof t == "string" ? { message: t } : t;
    return Lt.value && Lt.value.resolve(!1), new Promise((r) => {
      Lt.value = { options: s, resolve: r };
    });
  }
  function e(t) {
    const s = Lt.value;
    Lt.value = null, s?.resolve(t);
  }
  return { confirmState: Lt, confirm: n, settle: e };
}
const go = /* @__PURE__ */ Nt({
  __name: "ConfirmDialog",
  setup(n) {
    const { confirmState: e, settle: t } = or(), s = D(null), r = D(null);
    let a = null;
    const u = () => (document.documentElement.lang || "").startsWith("en"), o = () => e.value?.options.title || (u() ? "Confirm" : "请确认"), k = () => e.value?.options.confirmLabel || (u() ? "Confirm" : "确认"), _ = () => e.value?.options.cancelLabel || (u() ? "Cancel" : "取消");
    Ie(() => !!e.value, async (E) => {
      E ? (a = document.activeElement, await ct(), s.value?.focus(), r.value?.focus()) : (s.value = null, a?.focus?.());
    });
    function T(E) {
      if (!e.value) return;
      if (E.key === "Escape") {
        E.preventDefault(), t(!1);
        return;
      }
      if (E.key !== "Tab" || !s.value) return;
      const N = [...s.value.querySelectorAll("button:not(:disabled)")];
      if (!N.length) return;
      const z = N[0], C = N[N.length - 1];
      E.shiftKey && document.activeElement === z ? (E.preventDefault(), C.focus()) : !E.shiftKey && document.activeElement === C && (E.preventDefault(), z.focus());
    }
    return (E, N) => (v(), Ot(Yn, { to: "body" }, [
      re(e) ? (v(), y("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: N[2] || (N[2] = ze((z) => re(t)(!1), ["self"])),
        onKeydown: T
      }, [
        i("section", {
          ref_key: "dialog",
          ref: s,
          class: "confirm-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          i("h2", null, m(o()), 1),
          i("p", null, m(re(e).options.message), 1),
          i("footer", null, [
            i("button", {
              ref_key: "cancelBtn",
              ref: r,
              type: "button",
              onClick: N[0] || (N[0] = (z) => re(t)(!1))
            }, m(_()), 513),
            i("button", {
              type: "button",
              class: ie(["confirm-primary", { danger: re(e).options.danger !== !1 }]),
              onClick: N[1] || (N[1] = (z) => re(t)(!0))
            }, m(k()), 3)
          ])
        ], 512)
      ], 32)) : P("", !0)
    ]));
  }
}), mo = { class: "workspace" }, ko = { class: "sessions" }, vo = ["disabled", "title"], bo = { class: "connection" }, yo = ["title"], _o = ["placeholder", "aria-label"], wo = { class: "filter-bar" }, xo = ["onClick"], So = { class: "muted" }, To = { class: "session-list" }, Ao = ["disabled", "onClick"], Eo = { class: "origin" }, Ro = {
  key: 0,
  class: "muted"
}, $o = {
  key: 0,
  class: "ledger"
}, Co = { class: "muted" }, Lo = ["onClick"], Io = {
  key: 1,
  class: "conversation"
}, Oo = { class: "conversation-header" }, Po = {
  key: 0,
  class: "running"
}, No = {
  key: 1,
  class: "session-actions"
}, Do = ["disabled"], Mo = ["disabled"], zo = {
  key: 0,
  class: "error",
  role: "alert"
}, Fo = {
  key: 1,
  class: "host-panel"
}, Uo = { class: "usage-rings" }, Bo = {
  key: 1,
  class: "muted"
}, Ho = {
  key: 0,
  class: "sub-view"
}, jo = { class: "sub-view-header" }, Wo = { class: "muted" }, Vo = { class: "sub-view-body" }, qo = { class: "bubble user" }, Go = { class: "message-head" }, Yo = { class: "message-text" }, Zo = {
  key: 0,
  class: "agent-speech"
}, Ko = {
  key: 0,
  class: "muted model-annotation"
}, Xo = {
  key: 0,
  class: "running"
}, Qo = {
  key: 2,
  class: "muted"
}, Jo = {
  key: 3,
  class: "error"
}, ei = {
  key: 1,
  class: "subagent-card nested"
}, ti = ["onClick"], ni = { class: "subagent-prompt" }, si = { key: 3 }, ri = {
  key: 0,
  class: "agent-speech"
}, li = {
  key: 1,
  class: "error"
}, ai = {
  key: 2,
  class: "muted"
}, oi = {
  key: 0,
  class: "welcome"
}, ii = {
  key: 1,
  class: "context-summary"
}, ui = { class: "context-summary-head" }, ci = { class: "bubble user" }, di = { class: "message-head" }, pi = { class: "message-text" }, hi = { class: "bubble agent" }, fi = { class: "message-head" }, gi = {
  key: 0,
  class: "steps"
}, mi = {
  key: 0,
  class: "agent-speech"
}, ki = {
  key: 0,
  class: "muted model-annotation"
}, vi = {
  key: 0,
  class: "running"
}, bi = {
  key: 2,
  class: "muted"
}, yi = {
  key: 3,
  class: "error"
}, _i = {
  key: 1,
  class: "subagent-card"
}, wi = ["onClick"], xi = { class: "subagent-prompt" }, Si = {
  key: 0,
  class: "error subagent-card-error"
}, Ti = { key: 3 }, Ai = {
  key: 2,
  class: "error"
}, Ei = {
  key: 3,
  class: "muted"
}, Ri = {
  key: 0,
  class: "compact-notice"
}, $i = { class: "execution-options" }, Ci = ["disabled", "title"], Li = { class: "attach-row" }, Ii = ["disabled", "aria-label", "title"], Oi = ["title"], Pi = ["aria-label", "title", "onClick"], Ni = {
  key: 0,
  class: "attach-error"
}, Di = { class: "composer-input" }, Mi = ["disabled", "placeholder"], zi = ["disabled", "aria-label", "title"], Fi = ["aria-label", "title"], Ui = ["disabled"], Bi = { class: "muted" }, Hi = {
  class: "directory-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "选择工作区目录"
}, ji = { class: "directory-roots" }, Wi = ["disabled", "onClick"], Vi = ["disabled"], qi = ["disabled"], Gi = ["disabled"], Yi = {
  key: 0,
  class: "error"
}, Zi = { key: 1 }, Ki = {
  key: 2,
  class: "directory-list"
}, Xi = ["onClick"], Qi = {
  key: 1,
  class: "muted"
}, Ji = ["disabled"], eu = /* @__PURE__ */ Nt({
  __name: "AgentsPage",
  setup(n) {
    const e = (c, h) => Je.value === "en" ? h : c, { confirm: t } = or(), s = Cr(), r = D(localStorage.getItem("0kay.agent.selected") || ""), a = D(""), u = D([]), o = D(!1), k = D(""), _ = D(null);
    function T() {
      _.value?.click();
    }
    function E(c) {
      u.value.splice(c, 1);
    }
    async function N(c) {
      const h = c.target, d = Array.from(h.files || []);
      if (h.value = "", !!d.length) {
        o.value = !0, k.value = "";
        try {
          for (const $ of d) {
            const Pe = new FormData();
            Pe.append("file", $);
            const St = await fetch("/api/files", { method: "POST", body: Pe });
            if (!St.ok) throw new Error(await St.text());
            const lt = await St.json();
            u.value.push({ name: lt.name || $.name, url: lt.url, mime: lt.mime || $.type || "application/octet-stream", size: lt.size ?? $.size });
          }
        } catch ($) {
          k.value = $.message;
        } finally {
          o.value = !1;
        }
      }
    }
    const z = D(""), C = D("all"), G = D("general"), L = D(""), W = D(""), Q = D(50);
    function I(c) {
      const h = { off: 0, low: 20, medium: 50, high: 75, max: 100 };
      if (typeof c == "string" && c in h) return h[c];
      const d = Number(c ?? 50);
      return Number.isFinite(d) ? Math.max(0, Math.min(100, d)) : 50;
    }
    const U = D("MOCR"), F = D("normal"), X = D("");
    async function ue() {
      if (!(!X.value.trim() || !V.value || g.value)) {
        g.value = !0, x.value = "";
        try {
          const c = await fetch(`/api/agent/workspace?executor_id=${encodeURIComponent(V.value.plugin_id)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: R.value.path, name: X.value.trim() }) });
          if (!c.ok) throw new Error(await c.text());
          const h = await c.json();
          X.value = "", await st(h.path);
        } catch (c) {
          x.value = c.message;
        } finally {
          g.value = !1;
        }
      }
    }
    const B = D([]), b = D(!1), f = D(!1), g = D(!1), x = D(""), R = D({ path: "", parent: "", roots: [], directories: [] }), M = D(null), le = D("");
    let K = null, ve = 0, dt = "", pt = !1;
    const ht = D(!0);
    function tt(c = r.value) {
      try {
        localStorage.setItem(`0kay.agent.editor:${c}`, JSON.stringify({ draft: a.value, mode: G.value, ...wt() }));
      } catch {
      }
    }
    function nt() {
      ve++, f.value = !1, g.value = !1;
    }
    function rn(c) {
      c.key === "Escape" && f.value && nt();
    }
    function ae(c) {
      c.key === "Enter" && !c.shiftKey && !c.isComposing && c.keyCode !== 229 && (c.preventDefault(), jt());
    }
    function $n() {
      const c = ft.value;
      c && (ht.value = c.scrollHeight - c.scrollTop - c.clientHeight < 100);
    }
    async function st(c = "") {
      if (!V.value) {
        me.value = "请先选择在线执行器";
        return;
      }
      const h = ++ve;
      dt = V.value.plugin_id, f.value = !0, g.value = !0, x.value = "";
      try {
        const d = await fetch(`/api/agent/workspace?${new URLSearchParams({ executor_id: V.value.plugin_id, path: c })}`);
        if (!d.ok) throw new Error(await d.text());
        const $ = await d.json();
        h === ve && (R.value = $);
      } catch (d) {
        h === ve && (x.value = d.message);
      } finally {
        h === ve && (g.value = !1);
      }
    }
    function Cn() {
      !V.value || V.value.plugin_id !== dt || g.value || x.value || (L.value = V.value.plugin_id, W.value = R.value.path, f.value = !1);
    }
    async function Mt() {
      if (!b.value || !V.value || pt || document.hidden) return;
      pt = !0;
      const c = V.value.plugin_id;
      try {
        const h = await fetch(`/api/agent/host?executor_id=${encodeURIComponent(c)}`);
        if (!h.ok) throw new Error();
        const d = await h.json();
        V.value?.plugin_id === c && (M.value = d);
      } catch {
        V.value?.plugin_id === c && (M.value = null);
      } finally {
        pt = !1;
      }
    }
    async function ln() {
      if (!fe.value || de.value || q.value || fe.value.state === "archived") return;
      const c = r.value;
      q.value = !0, me.value = "", le.value = "正在压缩上下文…";
      try {
        const h = await fetch("/api/agent/compact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: c }) });
        if (!h.ok) throw new Error(await h.text());
        await h.json(), await s.fetchAgents(), le.value = "上下文已压缩。后续消息使用摘要；原始对话和工具记录仍然保留。", a.value.trim() === "/compact" && (a.value = "");
      } catch (h) {
        me.value = h.message, le.value = "";
      } finally {
        q.value = !1;
      }
    }
    const Ln = (c) => ({ background: `conic-gradient(var(--md-primary) ${Math.max(0, Math.min(100, c))}%, var(--md-outline-variant) 0)` }), V = J(() => L.value ? s.agents.find((c) => c.plugin_id === L.value) : s.agents.find((c) => s.isHealthy(c))), an = (c) => c === void 0 ? "—" : `${(c / 1024 ** 3).toFixed(1)} GiB`;
    function zt() {
      try {
        const c = JSON.parse(localStorage.getItem(`0kay.agent.editor:${r.value}`) || localStorage.getItem(`0kay.agent.options:${r.value}`) || "{}");
        L.value = c.executor_id || "", W.value = c.workdir || "", Q.value = I(c.thinking_intensity), U.value = c.model_id || "MOCR", F.value = c.permission_mode === "full_access" ? "full_access" : "normal", a.value = c.draft || "", G.value = c.mode || "general";
      } catch {
        L.value = "", W.value = "", Q.value = 50, U.value = "MOCR", a.value = "", G.value = "general";
      }
    }
    const ne = D({});
    function Ft(c) {
      return `${c.provider_name || (c.provider_id ? ne.value[c.provider_id] : "") || c.provider_id || c.provider}/${c.id}`;
    }
    async function se() {
      try {
        const c = await fetch("/api/models");
        if (!c.ok) throw new Error(`模型目录 HTTP ${c.status}`);
        B.value = (await c.json()).models || [];
      } catch (c) {
        me.value = c.message;
      }
      try {
        const c = await fetch("/api/providers");
        if (c.ok) {
          const h = (await c.json()).providers || [], d = {};
          for (const $ of h) $.name && $.id && (d[$.id] = $.name);
          ne.value = d;
        }
      } catch {
      }
    }
    function wt() {
      const c = Q.value === 0 ? "off" : Q.value < 35 ? "low" : Q.value < 62.5 ? "medium" : Q.value < 87.5 ? "high" : "max";
      return { executor_id: L.value, workdir: W.value.trim(), thinking_intensity: c, model_id: U.value, permission_mode: F.value, language: Je.value };
    }
    const q = D(!1), me = D(""), je = D(!1), Te = D(!1), Fe = D([]), he = J(() => Fe.value[Fe.value.length - 1] || null), ft = D(null), fe = J(() => s.sessions.find((c) => c.session_id === r.value)), Ae = (c) => c.caller_id !== "webui", We = J(() => s.sessions.filter((c) => (Te.value ? c.state === "archived" : c.state !== "archived") && (C.value === "all" || (C.value === "life" ? Ae(c) : !Ae(c))) && (c.prompt || "").toLowerCase().includes(z.value.toLowerCase()))), Ve = J(() => s.tasks.filter((c) => c.kind === "agent" && c.session_id === r.value).sort((c, h) => (c.started_at || "").localeCompare(h.started_at || "") || c.task_id.localeCompare(h.task_id))), de = J(() => s.tasks.find((c) => c.session_id === r.value && ["agent", "compact"].includes(c.kind || "") && ["running", "pending"].includes(c.state))), Ze = J(() => {
      const c = s.tasks.filter((h) => h.kind === "compact" && h.session_id === r.value && h.state === "done" && (h.result || "").trim());
      return c.length ? c.reduce((h, d) => (d.started_at || "") >= (h.started_at || "") ? d : h) : null;
    }), Oe = (c) => (Je.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[c] || c, qe = (c) => c ? new Date(c).toLocaleString() : "";
    function Ge(c) {
      return s.tasks.filter((h) => h.task_id !== c.task_id && h.session_id === c.session_id && h.parent_id === c.task_id).sort((h, d) => (h.started_at || "").localeCompare(d.started_at || "") || h.task_id.localeCompare(d.task_id));
    }
    function Ke(c) {
      return c ? s.tasks.filter((h) => h.task_id !== c.task_id && h.session_id === c.session_id && h.parent_id === c.task_id).sort((h, d) => (h.started_at || "").localeCompare(d.started_at || "") || h.task_id.localeCompare(d.task_id)) : [];
    }
    function gt(c) {
      const h = [];
      for (const d of Ge(c))
        h.push(d), d.kind === "subagent" && h.push(...gt({ ...d, session_id: c.session_id }));
      return h;
    }
    function Ut(c) {
      Fe.value = [...Fe.value, c];
    }
    function on() {
      Fe.value = Fe.value.slice(0, -1);
    }
    function un() {
      Fe.value = [];
    }
    function mt(c) {
      if (!c?.result) return "";
      let h = c.result;
      try {
        const d = JSON.parse(h);
        typeof d == "string" ? h = d : d && typeof d.result == "string" && (h = d.result);
      } catch {
      }
      return !h.trim() || Ke(c).some((d) => d.kind === "think" && (d.result || "").trim() === h.trim()) ? "" : h;
    }
    function Ue(c) {
      return c ? /User denied permission for task/i.test(c) ? e("你拒绝了这次子 Agent 调用", "You denied this sub-agent call") : /User denied permission for (\S+)/i.test(c) ? e(`你拒绝了 ${RegExp.$1} 权限`, `You denied permission for ${RegExp.$1}`) : /Permission request expired/i.test(c) ? e("权限请求已超时", "Permission request expired") : c : "";
    }
    function Xe(c) {
      return c.kind === "subagent" ? e("子 Agent", "Subagent") : c.kind === "tool" ? e("工具", "Tool") : c.kind === "think" ? e("模型", "Model") : c.kind || e("步骤", "Step");
    }
    function Qe(c) {
      return Ke(c).length;
    }
    function cn(c) {
      return gt(c).some((h) => h.kind === "think" && h.result?.trim() === c.result?.trim());
    }
    async function Bt(c) {
      if (!fe.value || q.value || c === "delete" && !await t({
        title: e("删除会话", "Delete session"),
        message: e("永久删除此会话及其中的消息和工具记录？", "Permanently delete this session and its messages and tool records?"),
        confirmLabel: e("永久删除", "Delete"),
        danger: !0
      }))
        return;
      const h = r.value;
      q.value = !0;
      try {
        tt(h), await s.manageSession(h, c), c === "delete" && (localStorage.removeItem(`0kay.agent.editor:${h}`), localStorage.removeItem(`0kay.agent.options:${h}`)), c !== "restore" ? (r.value = "", localStorage.removeItem("0kay.agent.selected")) : Te.value = !1;
      } catch (d) {
        me.value = d.message;
      } finally {
        q.value = !1;
      }
    }
    function Ht(c) {
      q.value || (tt(), r.value = c, je.value = !1, localStorage.setItem("0kay.agent.selected", c));
    }
    async function dn() {
      q.value = !0, me.value = "";
      try {
        const c = await s.createSession("新对话");
        tt(), r.value = c, localStorage.setItem("0kay.agent.selected", c), je.value = !1, Te.value = !1;
      } catch (c) {
        me.value = c.message;
      } finally {
        q.value = !1;
      }
    }
    async function jt() {
      if (a.value.trim() === "/compact") {
        await ln();
        return;
      }
      const c = u.value.length > 0;
      if (!(!a.value.trim() && !c || q.value || de.value || fe.value?.state === "archived")) {
        q.value = !0, me.value = "";
        try {
          const h = wt(), d = a.value.trim() || e("请查看我上传的附件。", "Please review the attached files."), $ = G.value;
          if (!fe.value) {
            const Pe = await s.createSession(d.slice(0, 60));
            localStorage.setItem(`0kay.agent.editor:${Pe}`, JSON.stringify({ ...h, draft: d, mode: $ })), r.value = Pe, localStorage.setItem("0kay.agent.selected", Pe);
          }
          tt(), c && (h.attachments = u.value.map((Pe) => ({ ...Pe }))), await s.sendTask(r.value, d, $, h), a.value = "", u.value = [], k.value = "", tt(), ht.value = !0, await rt();
        } catch (h) {
          me.value = h.message;
        } finally {
          q.value = !1;
        }
      }
    }
    async function xt() {
      if (!(!de.value || de.value.kind !== "agent"))
        try {
          await s.cancelTask(de.value.task_id);
        } catch (c) {
          me.value = c.message;
        }
    }
    async function rt() {
      await ct(), ht.value && ft.value?.scrollTo({ top: ft.value.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return Ie(() => s.tasks.filter((c) => c.session_id === r.value).map((c) => `${c.task_id}:${c.state}:${c.result?.length}`).join("|"), rt), Ie(r, () => {
      ht.value = !0, rt(), nt(), un(), me.value = "";
    }), Ie(r, zt), Ie(L, () => {
      M.value = null, W.value = "", nt(), Mt();
    }, { flush: "sync" }), Ie(b, Mt), Ie(r, () => {
      le.value = "";
    }), En(() => {
      ma(), s.connect(), zt(), se(), K = setInterval(Mt, 5e3), window.addEventListener("keydown", rn);
    }), Rn(() => {
      tt(), nt(), s.disconnect(), K && clearInterval(K), window.removeEventListener("keydown", rn);
    }), (c, h) => (v(), y(oe, null, [
      i("main", mo, [
        i("aside", ko, [
          i("header", null, [
            h[19] || (h[19] = i("h1", null, "Agent", -1)),
            i("button", {
              onClick: dn,
              disabled: q.value,
              title: e("新建会话", "New session")
            }, [
              h[18] || (h[18] = i("svg", {
                width: "15",
                height: "15",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                i("path", {
                  d: "M12 5v14M5 12h14",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                })
              ], -1)),
              Se(" " + m(e("新对话", "New chat")), 1)
            ], 8, vo)
          ]),
          i("div", bo, [
            i("i", {
              class: ie({ online: re(s).onlineCount > 0 })
            }, null, 2),
            Se(m(re(s).onlineCount) + " " + m(e("个执行器在线", "executors online")) + " ", 1),
            i("button", {
              onClick: h[0] || (h[0] = (d) => re(s).fetchAgents()),
              title: e("刷新", "Refresh"),
              "aria-label": "refresh"
            }, [...h[20] || (h[20] = [
              i("svg", {
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                i("path", {
                  d: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5",
                  stroke: "currentColor",
                  "stroke-width": "1.8",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ], -1)
            ])], 8, yo)
          ]),
          Xt(i("input", {
            "onUpdate:modelValue": h[1] || (h[1] = (d) => z.value = d),
            placeholder: e("搜索会话…", "Search sessions…"),
            "aria-label": e("搜索会话", "Search sessions")
          }, null, 8, _o), [
            [wn, z.value]
          ]),
          i("nav", wo, [
            (v(!0), y(oe, null, ye([{ id: "all", label: e("全部", "All") }, { id: "life", label: e("LIFE 发起", "From LIFE") }, { id: "user", label: e("我的对话", "My chats") }], (d) => (v(), y("button", {
              key: d.id,
              class: ie({ chosen: C.value === d.id }),
              onClick: ($) => C.value = d.id
            }, m(d.label), 11, xo))), 128))
          ]),
          i("label", So, [
            Xt(i("input", {
              "onUpdate:modelValue": h[2] || (h[2] = (d) => Te.value = d),
              type: "checkbox"
            }, null, 512), [
              [Er, Te.value]
            ]),
            Se(" " + m(e("显示已归档会话", "Show archived sessions")), 1)
          ]),
          i("div", To, [
            (v(!0), y(oe, null, ye(We.value, (d) => (v(), y("button", {
              key: d.task_id,
              class: ie(["session-card", { selected: r.value === d.session_id && !je.value }]),
              disabled: q.value,
              onClick: ($) => Ht(d.session_id)
            }, [
              i("span", Eo, m(Ae(d) ? "LIFE → Agent" : e("你 ↔ Agent", "You ↔ Agent")), 1),
              i("strong", null, m(d.prompt || "未命名会话"), 1),
              i("small", null, m(qe(d.started_at)), 1)
            ], 10, Ao))), 128)),
            We.value.length ? P("", !0) : (v(), y("p", Ro, m(e("暂无会话。直接发送消息，或等待 LIFE 委派工作。", "No sessions yet. Send a message or wait for LIFE to delegate work.")), 1))
          ]),
          i("button", {
            class: ie(["ledger-button", { chosen: je.value }]),
            onClick: h[3] || (h[3] = (d) => je.value = !0)
          }, m(e("全部任务记录", "All task records")) + " · " + m(re(s).tasks.length), 3)
        ]),
        je.value ? (v(), y("section", $o, [
          i("header", null, [
            i("h2", null, m(e("全部任务记录", "All task records")), 1),
            i("button", {
              onClick: h[4] || (h[4] = (d) => je.value = !1)
            }, m(e("返回会话", "Back to chat")), 1)
          ]),
          i("p", Co, m(e("包括 LIFE 对话、模型调用、Agent 执行及工具活动。", "LIFE conversations, model calls, Agent execution and tool activity.")), 1),
          (v(!0), y(oe, null, ye(re(s).tasks, (d) => (v(), y("article", {
            key: d.task_id,
            class: "ledger-entry"
          }, [
            i("div", null, [
              i("span", null, m(d.kind || "agent"), 1),
              i("span", {
                class: ie(d.state)
              }, m(Oe(d.state)), 3),
              i("small", null, m(qe(d.started_at)), 1)
            ]),
            i("p", null, m(d.prompt), 1),
            re(s).sessions.some(($) => $.session_id === d.session_id) ? (v(), y("button", {
              key: 0,
              onClick: ($) => Ht(d.session_id)
            }, "打开所属会话", 8, Lo)) : P("", !0),
            i("details", null, [
              h[21] || (h[21] = i("summary", null, "详情", -1)),
              i("code", null, m(d.task_id), 1),
              i("pre", null, m(d.result || d.error || "等待结果"), 1)
            ])
          ]))), 128))
        ])) : (v(), y("section", Io, [
          i("header", Oo, [
            i("div", null, [
              i("h2", null, m(fe.value?.prompt || "与 Agent 对话"), 1),
              i("p", null, m(fe.value && Ae(fe.value) ? "LIFE 发起的工作会话 · 你可以查看过程，也可以直接继续对话" : "持续对话 · 编程、调研与工具执行"), 1)
            ]),
            de.value ? (v(), y("span", Po, "正在执行")) : P("", !0),
            fe.value ? (v(), y("div", No, [
              i("button", {
                disabled: !!de.value,
                onClick: h[5] || (h[5] = (d) => Bt(fe.value.state === "archived" ? "restore" : "archive"))
              }, m(fe.value.state === "archived" ? "恢复" : "归档"), 9, Do),
              i("button", {
                disabled: !!de.value,
                onClick: h[6] || (h[6] = (d) => Bt("delete"))
              }, "删除", 8, Mo)
            ])) : P("", !0)
          ]),
          me.value || re(s).error ? (v(), y("div", zo, m(me.value || re(s).error), 1)) : P("", !0),
          b.value ? (v(), y("section", Fo, [
            V.value ? (v(), y(oe, { key: 0 }, [
              i("strong", null, m(V.value.host?.hostname || V.value.name), 1),
              i("span", {
                class: ie(re(s).isHealthy(V.value) ? "done" : "failed")
              }, m(re(s).isHealthy(V.value) ? "在线" : "离线"), 3),
              i("div", Uo, [
                (v(!0), y(oe, null, ye([{ label: "CPU 占用", value: M.value?.cpu_percent }, { label: "内存占用", value: M.value?.memory_percent }], (d) => (v(), y("div", {
                  key: d.label,
                  class: "usage-metric"
                }, [
                  i("div", {
                    class: "usage-ring",
                    style: en(Ln(d.value || 0))
                  }, [
                    i("b", null, m(d.value === void 0 ? "—" : `${d.value.toFixed(1)}%`), 1)
                  ], 4),
                  i("span", null, m(d.label), 1)
                ]))), 128)),
                i("small", null, m(M.value ? `采样时间：${qe(M.value.sampled_at)}` : "等待宿主机实时采样"), 1)
              ]),
              i("dl", null, [
                i("div", null, [
                  h[22] || (h[22] = i("dt", null, "执行器地址", -1)),
                  i("dd", null, m(V.value.address), 1)
                ]),
                i("div", null, [
                  h[23] || (h[23] = i("dt", null, "系统 / 架构", -1)),
                  i("dd", null, m(V.value.host?.os || "—") + " / " + m(V.value.host?.arch || "—"), 1)
                ]),
                i("div", null, [
                  h[24] || (h[24] = i("dt", null, "CPU", -1)),
                  i("dd", null, m(V.value.host?.cpu_model || "—") + " · " + m(V.value.host?.cpu_cores || "—") + " 核", 1)
                ]),
                i("div", null, [
                  h[25] || (h[25] = i("dt", null, "可用 / 总内存", -1)),
                  i("dd", null, m(an(V.value.host?.memory_available_bytes)) + " / " + m(an(V.value.host?.memory_total_bytes)), 1)
                ]),
                i("div", null, [
                  h[26] || (h[26] = i("dt", null, "活跃任务", -1)),
                  i("dd", null, m(V.value.active_tasks), 1)
                ]),
                i("div", null, [
                  h[27] || (h[27] = i("dt", null, "距上次心跳", -1)),
                  i("dd", null, m(V.value.last_heartbeat_age_seconds) + " 秒", 1)
                ]),
                i("div", null, [
                  h[28] || (h[28] = i("dt", null, "默认工作目录", -1)),
                  i("dd", null, m(V.value.host?.workdir || "—"), 1)
                ])
              ])
            ], 64)) : (v(), y("p", Bo, "没有可用的执行器宿主机信息。"))
          ])) : P("", !0),
          i("div", {
            ref_key: "transcript",
            ref: ft,
            class: "transcript",
            onScrollPassive: $n
          }, [
            he.value ? (v(), y("div", Ho, [
              i("header", jo, [
                i("button", {
                  type: "button",
                  onClick: on
                }, "← " + m(Fe.value.length > 1 ? e("返回上一层", "Back one level") : e("返回会话", "Back to chat")), 1),
                i("div", null, [
                  i("h3", null, m(e("子 Agent", "Subagent")), 1),
                  i("p", Wo, m(he.value.prompt), 1)
                ]),
                i("span", {
                  class: ie(he.value.state)
                }, m(Oe(he.value.state)), 3)
              ]),
              i("div", Vo, [
                i("div", qo, [
                  i("div", Go, [
                    i("b", null, m(e("父 Agent", "Parent agent")), 1),
                    i("time", null, m(qe(he.value.started_at)), 1)
                  ]),
                  i("div", Yo, m(he.value.prompt), 1)
                ]),
                (v(!0), y(oe, null, ye(Ke(he.value), (d) => (v(), y(oe, {
                  key: d.task_id
                }, [
                  d.kind === "think" && (d.result || d.state === "running" || d.error) ? (v(), y("div", Zo, [
                    d.prompt ? (v(), y("small", Ko, m(d.prompt), 1)) : P("", !0),
                    d.result ? (v(), y(oe, { key: 1 }, [
                      Me(Kt, {
                        content: d.result
                      }, null, 8, ["content"]),
                      d.state === "running" ? (v(), y("span", Xo, " ▍")) : P("", !0)
                    ], 64)) : d.state === "running" ? (v(), y("small", Qo, m(e("子 Agent 正在生成回复…", "Subagent is drafting a reply…")), 1)) : P("", !0),
                    d.error ? (v(), y("p", Jo, m(Ue(d.error)), 1)) : P("", !0)
                  ])) : d.kind === "subagent" ? (v(), y("div", ei, [
                    i("button", {
                      type: "button",
                      class: "subagent-card-head",
                      onClick: ($) => Ut(d)
                    }, [
                      i("span", {
                        class: ie(d.state)
                      }, "●", 2),
                      i("strong", null, m(e("子 Agent", "Subagent")), 1),
                      i("span", ni, m(d.prompt), 1),
                      i("small", null, m(Oe(d.state)), 1),
                      h[29] || (h[29] = i("span", {
                        class: "subagent-chevron",
                        "aria-hidden": "true"
                      }, "▸", -1))
                    ], 8, ti)
                  ])) : d.kind === "tool" ? (v(), Ot(js, {
                    key: 2,
                    step: d,
                    "format-error": Ue
                  }, null, 8, ["step"])) : d.kind !== "think" ? (v(), y("details", si, [
                    i("summary", null, [
                      i("span", {
                        class: ie(d.state)
                      }, "●", 2),
                      Se(" " + m(Xe(d)) + " · " + m(d.prompt) + " ", 1),
                      i("small", null, m(Oe(d.state)), 1)
                    ]),
                    i("pre", null, m(d.result || d.error || (d.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                  ])) : P("", !0)
                ], 64))), 128)),
                mt(he.value) ? (v(), y("div", ri, [
                  Me(Kt, {
                    content: mt(he.value)
                  }, null, 8, ["content"])
                ])) : P("", !0),
                he.value.error ? (v(), y("p", li, m(Ue(he.value.error)), 1)) : P("", !0),
                !Ke(he.value).length && !mt(he.value) && !he.value.error ? (v(), y("p", ai, m(he.value.state === "running" ? e("子 Agent 正在执行…", "Subagent is running…") : e("没有子步骤记录", "No child steps recorded")), 1)) : P("", !0)
              ])
            ])) : (v(), y(oe, { key: 1 }, [
              !Ve.value.length && !Ze.value ? (v(), y("div", oi, [...h[30] || (h[30] = [
                i("h2", null, "想让 Agent 帮你做什么？", -1),
                i("p", null, "直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。", -1),
                i("p", null, "左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。", -1)
              ])])) : P("", !0),
              Ze.value ? (v(), y("article", ii, [
                i("div", ui, [
                  i("strong", null, m(e("上下文摘要", "Context summary")), 1),
                  i("time", null, m(qe(Ze.value.started_at)), 1)
                ]),
                Me(Kt, {
                  content: Ze.value.result || ""
                }, null, 8, ["content"])
              ])) : P("", !0),
              (v(!0), y(oe, null, ye(Ve.value, (d) => (v(), y("article", {
                key: d.task_id,
                class: "turn"
              }, [
                i("div", ci, [
                  i("div", di, [
                    i("b", null, m(Ae(d) ? "LIFE" : "你"), 1),
                    i("time", null, m(qe(d.started_at)), 1)
                  ]),
                  i("div", pi, m(d.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, "")), 1)
                ]),
                i("div", hi, [
                  i("div", fi, [
                    h[31] || (h[31] = i("b", null, "Agent", -1)),
                    i("span", {
                      class: ie(d.state)
                    }, m(Oe(d.state)), 3)
                  ]),
                  Ge(d).length ? (v(), y("div", gi, [
                    (v(!0), y(oe, null, ye(Ge(d), ($) => (v(), y(oe, {
                      key: $.task_id
                    }, [
                      $.kind === "think" && ($.result || $.state === "running" || $.error) ? (v(), y("div", mi, [
                        $.prompt ? (v(), y("small", ki, m($.prompt), 1)) : P("", !0),
                        $.result ? (v(), y(oe, { key: 1 }, [
                          Me(Kt, {
                            content: $.result
                          }, null, 8, ["content"]),
                          $.state === "running" ? (v(), y("span", vi, " ▍")) : P("", !0)
                        ], 64)) : $.state === "running" ? (v(), y("small", bi, "Agent 正在生成回复…")) : P("", !0),
                        $.error ? (v(), y("p", yi, m(Ue($.error)), 1)) : P("", !0)
                      ])) : $.kind === "subagent" ? (v(), y("div", _i, [
                        i("button", {
                          type: "button",
                          class: "subagent-card-head",
                          onClick: (Pe) => Ut($)
                        }, [
                          i("span", {
                            class: ie($.state)
                          }, "●", 2),
                          i("strong", null, m(e("子 Agent", "Subagent")), 1),
                          i("span", xi, m($.prompt), 1),
                          i("small", null, [
                            Se(m(Oe($.state)), 1),
                            Qe($) ? (v(), y(oe, { key: 0 }, [
                              Se(" · " + m(Qe($)) + " " + m(e("步", "steps")), 1)
                            ], 64)) : P("", !0)
                          ]),
                          h[32] || (h[32] = i("span", {
                            class: "subagent-chevron",
                            "aria-hidden": "true"
                          }, "▸", -1))
                        ], 8, wi),
                        $.error ? (v(), y("p", Si, m(Ue($.error)), 1)) : P("", !0)
                      ])) : $.kind === "tool" ? (v(), Ot(js, {
                        key: 2,
                        step: $,
                        "format-error": Ue
                      }, null, 8, ["step"])) : $.kind !== "think" ? (v(), y("details", Ti, [
                        i("summary", null, [
                          i("span", {
                            class: ie($.state)
                          }, "●", 2),
                          Se(" " + m(Xe($)) + " · " + m($.prompt) + " ", 1),
                          i("small", null, m(Oe($.state)), 1)
                        ]),
                        i("pre", null, m($.result || $.error || ($.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                      ])) : P("", !0)
                    ], 64))), 128))
                  ])) : P("", !0),
                  d.result && !cn(d) ? (v(), Ot(Kt, {
                    key: 1,
                    content: d.result
                  }, null, 8, ["content"])) : P("", !0),
                  d.error ? (v(), y("div", Ai, m(Ue(d.error)), 1)) : P("", !0),
                  ["running", "pending"].includes(d.state) ? (v(), y("p", Ei, "Agent 正在处理，执行过程会自动更新…")) : P("", !0)
                ])
              ]))), 128))
            ], 64))
          ], 544),
          he.value ? P("", !0) : (v(), y("form", {
            key: 2,
            class: "composer",
            onSubmit: ze(jt, ["prevent"])
          }, [
            le.value ? (v(), y("div", Ri, m(le.value), 1)) : P("", !0),
            i("div", $i, [
              i("label", null, [
                Se(m(e("权限", "Permissions")), 1),
                Me(yn, {
                  modelValue: F.value,
                  "onUpdate:modelValue": h[7] || (h[7] = (d) => F.value = d),
                  "aria-label": e("权限", "Permissions"),
                  disabled: !!de.value || q.value,
                  options: [{ value: "normal", label: e("Normal · 全部审批", "Normal · Ask every time") }, { value: "full_access", label: e("Full access · 自动执行", "Full access · Auto execute") }]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ]),
              i("label", null, [
                Se(m(e("执行器", "Executor")), 1),
                Me(yn, {
                  modelValue: L.value,
                  "onUpdate:modelValue": h[8] || (h[8] = (d) => L.value = d),
                  "aria-label": e("执行器", "Executor"),
                  disabled: !!de.value || q.value,
                  options: [{ value: "", label: e("自动选择在线执行器", "Automatic executor") }, ...re(s).agents.map((d) => ({ value: d.plugin_id, label: `${d.host?.hostname || d.name} · ${d.plugin_id}`, disabled: !re(s).isHealthy(d) }))]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ]),
              i("label", null, [
                Se(m(e("工作区", "Workspace")), 1),
                i("button", {
                  type: "button",
                  class: "workspace-select",
                  disabled: !!de.value || q.value || !V.value,
                  title: W.value || V.value?.host?.workdir,
                  onClick: h[9] || (h[9] = (d) => st(W.value || V.value?.host?.workdir || ""))
                }, [
                  h[33] || (h[33] = i("svg", {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    "aria-hidden": "true"
                  }, [
                    i("path", {
                      d: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
                      stroke: "currentColor",
                      "stroke-width": "1.7",
                      "stroke-linejoin": "round"
                    })
                  ], -1)),
                  Se(" " + m(W.value || e("选择目录…", "Select folder…")), 1)
                ], 8, Ci)
              ]),
              Me(fo, {
                modelValue: Q.value,
                "onUpdate:modelValue": h[10] || (h[10] = (d) => Q.value = d),
                disabled: !!de.value || q.value
              }, null, 8, ["modelValue", "disabled"]),
              i("label", null, [
                Se(m(e("模型", "Model")), 1),
                Me(yn, {
                  modelValue: U.value,
                  "onUpdate:modelValue": h[11] || (h[11] = (d) => U.value = d),
                  searchable: "",
                  "aria-label": e("模型", "Model"),
                  disabled: !!de.value || q.value,
                  onOpen: se,
                  options: [{ value: "MOCR", label: e("MOCR · 自动选型", "MOCR · Automatic") }, ...B.value.map((d) => ({ value: d.id, label: Ft(d) }))]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ])
            ]),
            i("div", Li, [
              i("input", {
                ref_key: "fileInput",
                ref: _,
                type: "file",
                multiple: "",
                hidden: "",
                onChange: N
              }, null, 544),
              i("button", {
                type: "button",
                class: "attach-btn",
                disabled: q.value || o.value || fe.value?.state === "archived",
                "aria-label": e("添加附件", "Add attachment"),
                title: e("添加附件", "Attach files"),
                onClick: T
              }, [
                h[34] || (h[34] = i("svg", {
                  width: "15",
                  height: "15",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  i("path", {
                    d: "M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  })
                ], -1)),
                Se(" " + m(o.value ? e("上传中…", "Uploading…") : e("附件", "Attach")), 1)
              ], 8, Ii),
              (v(!0), y(oe, null, ye(u.value, (d, $) => (v(), y("span", {
                key: $,
                class: "attach-chip",
                title: `${d.mime} · ${d.size} B`
              }, [
                Se(m(d.name) + " ", 1),
                i("button", {
                  type: "button",
                  "aria-label": e("移除附件", "Remove attachment"),
                  title: e("移除", "Remove"),
                  onClick: (Pe) => E($)
                }, "×", 8, Pi)
              ], 8, Oi))), 128)),
              k.value ? (v(), y("span", Ni, m(k.value), 1)) : P("", !0)
            ]),
            i("div", Di, [
              Xt(i("textarea", {
                "onUpdate:modelValue": h[12] || (h[12] = (d) => a.value = d),
                disabled: q.value || fe.value?.state === "archived",
                placeholder: fe.value?.state === "archived" ? "恢复会话后可以继续对话" : "给 Agent 发消息…（Enter 发送，Shift+Enter 换行）",
                "aria-label": "给 Agent 发消息",
                onKeydown: ae
              }, null, 40, Mi), [
                [wn, a.value]
              ]),
              de.value?.kind !== "agent" ? (v(), y("button", {
                key: 0,
                type: "submit",
                class: "send-fly",
                disabled: q.value || !!de.value || !a.value.trim() || fe.value?.state === "archived",
                "aria-label": e("发送", "Send"),
                title: e("发送", "Send")
              }, [...h[35] || (h[35] = [
                i("svg", {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  i("path", {
                    d: "M3.6 11.2 20.4 4l-7.1 16.4-2.5-6.8-7.2-2.4z",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linejoin": "round"
                  }),
                  i("path", {
                    d: "m10.8 13.6 3.4-3.4",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linecap": "round"
                  })
                ], -1)
              ])], 8, zi)) : (v(), y("button", {
                key: 1,
                type: "button",
                class: "send-fly stop",
                onClick: xt,
                "aria-label": e("停止", "Stop"),
                title: e("停止", "Stop")
              }, [...h[36] || (h[36] = [
                i("svg", {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  i("rect", {
                    x: "7",
                    y: "7",
                    width: "10",
                    height: "10",
                    rx: "2",
                    fill: "currentColor"
                  })
                ], -1)
              ])], 8, Fi))
            ]),
            i("footer", null, [
              Me(yn, {
                modelValue: G.value,
                "onUpdate:modelValue": h[13] || (h[13] = (d) => G.value = d),
                disabled: q.value,
                "aria-label": e("Agent 模式", "Agent mode"),
                options: [{ value: "general", label: e("通用 Agent", "General Agent") }, { value: "code", label: e("编程 Agent", "Coding Agent") }, { value: "research", label: e("调研 Agent", "Research Agent") }]
              }, null, 8, ["modelValue", "disabled", "aria-label", "options"]),
              i("button", {
                type: "button",
                onClick: h[14] || (h[14] = (d) => b.value = !b.value)
              }, m(e("宿主机", "Host")), 1),
              i("button", {
                type: "button",
                disabled: !fe.value || !!de.value || q.value || fe.value.state === "archived",
                onClick: ln
              }, "/compact", 8, Ui),
              i("span", Bi, m(de.value?.kind === "compact" ? e("上下文压缩中…", "Compacting…") : re(s).onlineCount ? e("在当前会话中继续", "Continue this session") : e("执行器离线", "Executor offline")), 1)
            ])
          ], 32))
        ])),
        f.value ? (v(), y("div", {
          key: 2,
          class: "directory-backdrop",
          onClick: ze(nt, ["self"])
        }, [
          i("section", Hi, [
            i("header", null, [
              i("h2", null, "选择 " + m(V.value?.host?.hostname || "执行器") + " 的工作区", 1),
              i("button", { onClick: nt }, "关闭")
            ]),
            i("div", ji, [
              (v(!0), y(oe, null, ye(R.value.roots, (d) => (v(), y("button", {
                key: d,
                disabled: g.value,
                onClick: ($) => st(d)
              }, m(d), 9, Wi))), 128)),
              i("button", {
                disabled: g.value,
                onClick: h[15] || (h[15] = (d) => st(V.value?.host?.workdir || ""))
              }, "默认目录", 8, Vi)
            ]),
            i("code", null, m(R.value.path), 1),
            i("form", {
              class: "new-folder",
              onSubmit: ze(ue, ["prevent"])
            }, [
              Xt(i("input", {
                "onUpdate:modelValue": h[16] || (h[16] = (d) => X.value = d),
                placeholder: "新文件夹名称",
                "aria-label": "新文件夹名称",
                disabled: g.value
              }, null, 8, qi), [
                [wn, X.value]
              ]),
              i("button", {
                disabled: g.value || !X.value.trim() || !R.value.path
              }, "新建文件夹", 8, Gi)
            ], 32),
            x.value ? (v(), y("p", Yi, m(x.value), 1)) : P("", !0),
            g.value ? (v(), y("p", Zi, "正在读取目录…")) : (v(), y("div", Ki, [
              R.value.parent !== R.value.path ? (v(), y("button", {
                key: 0,
                onClick: h[17] || (h[17] = (d) => st(R.value.parent))
              }, "上一级")) : P("", !0),
              (v(!0), y(oe, null, ye(R.value.directories, (d) => (v(), y("button", {
                key: d.path,
                onClick: ($) => st(d.path)
              }, [
                h[37] || (h[37] = i("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  i("path", {
                    d: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linejoin": "round"
                  })
                ], -1)),
                Se(" " + m(d.name), 1)
              ], 8, Xi))), 128)),
              R.value.directories.length ? P("", !0) : (v(), y("p", Qi, "没有子目录"))
            ])),
            i("footer", null, [
              i("button", {
                disabled: g.value || !!x.value || !R.value.path,
                onClick: Cn
              }, "选择当前目录", 8, Ji)
            ])
          ])
        ])) : P("", !0)
      ]),
      Me(go)
    ], 64));
  }
}), su = /* @__PURE__ */ ss(eu, [["__scopeId", "data-v-8ea3016d"]]);
export {
  su as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('agent-plugin-style')){const s=document.createElement('style');s.id='agent-plugin-style';s.textContent=".markdown-content[data-v-ef377647]{line-height:1.75;overflow-wrap:anywhere;font-size:14px}.markdown-content[data-v-ef377647] pre{padding:16px;background:var(--md-surface-container);border-radius:8px;overflow:auto;white-space:pre;line-height:1.5}.markdown-content[data-v-ef377647] code{font-family:monospace;background:var(--md-surface-container);padding:2px 4px;border-radius:4px}.markdown-content[data-v-ef377647] pre code{padding:0;background:none}.markdown-content[data-v-ef377647] table{display:block;overflow:auto;border-collapse:collapse;margin:12px 0}.markdown-content[data-v-ef377647] th,.markdown-content[data-v-ef377647] td{border:1px solid var(--md-outline-variant);padding:8px 12px}.markdown-content[data-v-ef377647] blockquote{border-left:3px solid var(--md-outline);margin:12px 0;padding-left:14px;color:var(--md-on-surface-variant)}.markdown-content[data-v-ef377647] ul,.markdown-content[data-v-ef377647] ol{padding-left:24px}.markdown-content[data-v-ef377647] a{color:var(--md-primary);text-decoration:underline}.markdown-content[data-v-ef377647] img{max-width:100%}.markdown-content[data-v-ef377647] h1,.markdown-content[data-v-ef377647] h2,.markdown-content[data-v-ef377647] h3{margin:16px 0 8px}.tool-card[data-v-f13fbd25]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container);margin:8px 0;overflow:hidden}button.tool-card-head[data-v-f13fbd25]{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:none;border-radius:0;background:transparent;padding:10px 12px;cursor:pointer;font-size:13px}.tool-kind[data-v-f13fbd25]{flex-shrink:0;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--md-on-surface)}.tool-summary[data-v-f13fbd25]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font);font-size:13px;color:var(--md-on-surface)}.tool-stat[data-v-f13fbd25]{flex-shrink:0;font-size:12px;font-weight:600;color:var(--md-primary);border:1px solid var(--md-outline-variant);border-radius:999px;padding:1px 8px}.tool-state[data-v-f13fbd25]{flex-shrink:0;font-size:13px;color:var(--md-on-surface-variant)}.tool-chevron[data-v-f13fbd25]{flex-shrink:0;color:var(--md-on-surface-variant);font-size:12px;transition:transform .15s}.tool-card.expanded .tool-chevron[data-v-f13fbd25]{transform:rotate(90deg)}.tool-dot[data-v-f13fbd25]{font-size:9px}.tool-dot.running[data-v-f13fbd25],.tool-dot.pending[data-v-f13fbd25]{color:#b88412}.tool-dot.failed[data-v-f13fbd25]{color:var(--md-error,#c44)}.tool-dot.done[data-v-f13fbd25]{color:#3a6}.tool-dot.cancelled[data-v-f13fbd25]{color:var(--md-on-surface-variant)}.tool-card-body[data-v-f13fbd25]{padding:4px 12px 12px;border-top:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}.tool-section-label[data-v-f13fbd25]{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--md-on-surface-variant);margin-top:4px}.tool-card-body pre[data-v-f13fbd25]{margin:0;max-height:340px;overflow:auto;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);border-radius:8px;padding:8px 10px;font-family:var(--code-font);font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.tool-shot[data-v-f13fbd25]{margin:0;display:flex;flex-direction:column;gap:6px}.tool-shot img[data-v-f13fbd25]{width:100%;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest);display:block}.tool-shot figcaption[data-v-f13fbd25]{font-family:var(--code-font);font-size:11.5px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-section-text[data-v-f13fbd25]{margin:0;font-size:13px;overflow-wrap:anywhere}.tool-error[data-v-f13fbd25]{background:var(--md-error-container);padding:8px 12px;border-radius:8px;margin:0;font-size:12px;overflow-wrap:anywhere}.muted[data-v-f13fbd25]{font-size:12px;color:var(--md-on-surface-variant);margin:0}.tool-dialog-backdrop[data-v-f13fbd25]{position:fixed;inset:0;background:#0008;z-index:1050;display:grid;place-items:center;padding:20px}.tool-dialog[data-v-f13fbd25]{background:var(--md-surface);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:18px 20px;width:min(680px,100%);max-height:82vh;overflow:auto;display:flex;flex-direction:column;gap:12px}.tool-dialog header[data-v-f13fbd25]{display:flex;align-items:center;justify-content:space-between;gap:12px}.tool-dialog h4[data-v-f13fbd25]{margin:0;font-size:15px;overflow-wrap:anywhere;flex:1;min-width:0}#app .tool-dialog-close[data-v-f13fbd25],.tool-dialog-close[data-v-f13fbd25]{flex-shrink:0;width:40px;height:40px;min-height:0;padding:0;border:none;border-radius:50%;background:transparent;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}#app .tool-dialog-close[data-v-f13fbd25]:hover,.tool-dialog-close[data-v-f13fbd25]:hover{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent);box-shadow:none;filter:none;color:var(--md-on-surface)}#app .tool-dialog-close[data-v-f13fbd25]:active,.tool-dialog-close[data-v-f13fbd25]:active{background:color-mix(in srgb,var(--md-on-surface) 12%,transparent);border-radius:50%}.tool-search-results[data-v-f13fbd25]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}.tool-search-results a[data-v-f13fbd25]{color:var(--md-primary);font-size:14px;font-weight:500;text-decoration:none}.tool-search-results a[data-v-f13fbd25]:hover{text-decoration:underline}.tool-search-results p[data-v-f13fbd25]{margin:4px 0 0;font-size:13px;line-height:1.65;color:var(--md-on-surface)}.tool-search-results small[data-v-f13fbd25]{display:block;margin-top:2px;font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-card[data-v-f13fbd25]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent);background:var(--md-surface-container);transition:box-shadow .22s,background-color .2s}.tool-card[data-v-f13fbd25]:hover{box-shadow:var(--shadow-1)}button.tool-card-head[data-v-f13fbd25]{padding:12px 15px;gap:10px;min-height:46px;border-radius:0}button.tool-card-head[data-v-f13fbd25]:hover{background:var(--md-secondary-container)}.tool-kind[data-v-f13fbd25]{font-weight:700;letter-spacing:.06em}.tool-stat[data-v-f13fbd25]{border-color:color-mix(in srgb,var(--md-primary) 30%,transparent);background:color-mix(in srgb,var(--md-primary) 10%,transparent)}.tool-chevron[data-v-f13fbd25]{width:22px;height:22px;display:inline-grid;place-items:center;border-radius:50%;background:var(--md-surface-container-high);transition:transform .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}.tool-card-body[data-v-f13fbd25]{padding:8px 15px 15px;gap:8px;border-top-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-card-body pre[data-v-f13fbd25]{border-radius:14px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-section-label[data-v-f13fbd25]{font-weight:700}.diff-wrap[data-v-f13fbd25]{display:flex;flex-direction:column;gap:10px}.diff-file[data-v-f13fbd25]{border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);border-radius:14px;overflow:hidden;background:var(--md-surface-container-lowest)}.diff-file-head[data-v-f13fbd25]{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;background:var(--md-surface-container);font-size:11.5px;font-weight:650}.diff-file-path[data-v-f13fbd25]{font-family:var(--code-font);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.diff-file-stat[data-v-f13fbd25]{flex:none;font-family:var(--code-font);color:var(--md-on-surface-variant)}.diff-body[data-v-f13fbd25]{max-height:360px;overflow:auto;font-family:var(--code-font);font-size:12px;line-height:1.55;padding:4px 0}.diff-line[data-v-f13fbd25]{display:grid;grid-template-columns:40px 40px 18px 1fr;white-space:pre;min-width:max-content}.diff-no[data-v-f13fbd25]{text-align:right;padding:0 6px;color:var(--md-on-surface-variant);opacity:.6;user-select:none;font-variant-numeric:tabular-nums}.diff-sign[data-v-f13fbd25]{text-align:center;user-select:none;opacity:.9}.diff-text[data-v-f13fbd25]{padding-right:12px}.diff-line.add[data-v-f13fbd25]{background:color-mix(in srgb,#2ea043 20%,transparent);color:#116329}.diff-line.del[data-v-f13fbd25]{background:color-mix(in srgb,#cf222e 18%,transparent);color:#82071e}.diff-line.add .diff-sign[data-v-f13fbd25]{color:#116329;font-weight:700}.diff-line.del .diff-sign[data-v-f13fbd25]{color:#cf222e;font-weight:700}.diff-line.hunk[data-v-f13fbd25]{background:var(--md-surface-container);color:var(--md-on-surface-variant)}.diff-line.meta[data-v-f13fbd25]{color:var(--md-on-surface-variant);opacity:.75}@media (prefers-color-scheme: dark){.diff-line.add[data-v-f13fbd25],.diff-line.add .diff-sign[data-v-f13fbd25]{color:#7ee787}.diff-line.del[data-v-f13fbd25],.diff-line.del .diff-sign[data-v-f13fbd25]{color:#ffa198}}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color .14s,border-radius .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),color .14s}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.selected.highlighted{background:color-mix(in srgb,var(--md-primary-container) 88%,var(--md-primary) 12%)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-search{position:sticky;top:-8px;z-index:1;display:flex;align-items:center;gap:10px;margin:-8px -8px 8px;padding:13px 16px;background:var(--md-surface-container-low);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px 24px 0 0;color:var(--md-on-surface-variant)}.app-select-search input{flex:1;min-width:0;border:0;background:transparent;padding:0;font:inherit;color:var(--md-on-surface);outline:none}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity .18s var(--ease-emphasized,cubic-bezier(.2,0,0,1)),transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.select-menu-leave-active{transition:opacity .13s,transform .13s}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}.thinking-control{min-width:110px;flex:1;display:flex;flex-direction:column;gap:5px}.thinking-caption{font-size:12px}#app .thinking-trigger{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;padding:9px 12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);font-size:12px;border-radius:9px}.thinking-popover{position:fixed;z-index:10000;padding:16px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:0 10px 32px #16244026;color:var(--md-on-surface);font-family:var(--font-family)}.thinking-popover header{display:flex;justify-content:space-between;gap:12px;font-size:13px}.thinking-popover output{color:var(--md-primary);font-weight:600}.thinking-track{position:relative;padding:22px 4px 16px;display:flex;align-items:center}.thinking-track input{appearance:none;-webkit-appearance:none;width:100%;height:5px;padding:0;margin:0;border:0;border-radius:5px;background:linear-gradient(to right,var(--md-primary) var(--intensity),var(--md-outline-variant) var(--intensity));cursor:pointer;z-index:1}.thinking-track input::-webkit-slider-thumb{appearance:none;width:17px;height:17px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface);box-shadow:0 1px 4px #24345d40}.thinking-track input::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface)}.thinking-track input:focus-visible{outline:2px solid var(--md-primary);outline-offset:7px}.thinking-stops{display:flex;justify-content:space-between;gap:3px}.thinking-stops button{font:inherit;font-size:12px;border:0;background:transparent;color:var(--md-on-surface-variant);padding:6px 5px;border-radius:6px;cursor:pointer}.thinking-stops button.selected{background:var(--md-primary-container);color:var(--md-primary);font-weight:700}.thinking-popover p{font-size:12px;line-height:1.5;color:var(--md-on-surface-variant);margin:12px 0 0}.thinking-control.full .thinking-trigger,.thinking-popover.full{--md-primary:#a050db;border-color:#a050db88;box-shadow:0 0 16px #a050db25}.thinking-popover.full .energy-wave{position:absolute;inset:14px 0 8px;pointer-events:none;border-radius:20px;box-shadow:0 0 12px #a050db66}.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger{animation:thinking-boost .85s ease-out}.thinking-popover.pulse .energy-wave{animation:thinking-wave .85s ease-out}@keyframes thinking-boost{0%{box-shadow:0 0 #a050db66}45%{box-shadow:0 0 0 5px #a050db20,0 0 30px #a050db40}to{box-shadow:0 0 16px #a050db25}}@keyframes thinking-wave{0%{transform:scale(.95);opacity:1}to{transform:scale(1.15,2);opacity:0}}.thinking-menu-enter-active,.thinking-menu-leave-active{transition:opacity .13s,transform .13s}.thinking-menu-enter-from,.thinking-menu-leave-to{opacity:0;transform:translateY(4px)}@media (prefers-reduced-motion:reduce){.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger,.thinking-popover.pulse .energy-wave{animation:none}}.thinking-popover{padding:20px;border-radius:28px;background:var(--md-surface-container-low);border-color:transparent;box-shadow:0 8px 28px #24345d24}.thinking-popover header{align-items:center;font-size:14px;min-height:30px}.thinking-popover output{padding:6px 12px;border-radius:999px;background:var(--md-primary-container);font-size:12px}.thinking-track{height:68px;padding:0;margin:12px 0 0;isolation:isolate}.thinking-capsule{position:absolute;left:5px;right:5px;height:28px;border-radius:999px;background:var(--md-primary-container);overflow:hidden;pointer-events:none}.thinking-fill{height:100%;width:var(--intensity);background:var(--md-primary);border-radius:999px}.thinking-tick{position:absolute;top:50%;width:4px;height:4px;border-radius:50%;background:var(--md-primary);transform:translate(-50%,-50%)}.thinking-tick:first-of-type{left:8px!important}.thinking-tick:last-of-type{left:calc(100% - 8px)!important}.thinking-tick.passed{background:var(--md-on-primary)}.thinking-track input{position:relative;height:48px;background:transparent;border-radius:999px;touch-action:pan-y}.thinking-track input::-webkit-slider-runnable-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-webkit-slider-thumb{width:10px;height:44px;margin-top:-8px;border-radius:999px;border:0;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low);transition:width .14s,height .14s,margin-top .14s}.thinking-track input:active::-webkit-slider-thumb{width:6px;height:48px;margin-top:-10px}.thinking-track input::-moz-range-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-moz-range-thumb{width:10px;height:44px;border:0;border-radius:999px;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low)}.thinking-track input:active::-moz-range-thumb{width:6px;height:48px}.thinking-track input:focus-visible{outline-offset:3px}.thinking-stops{align-items:center;gap:2px;margin-top:2px}.thinking-stops button{border-radius:999px;min-height:30px;padding:6px 9px;transition:background-color .16s,color .16s}.thinking-popover.full{background:color-mix(in srgb,var(--md-surface-container-low) 93%,#a050db);border-color:#a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#7255c8,#ad50d6)}.thinking-popover.full .energy-wave{inset:18px 5px;border-radius:999px;z-index:-1}.thinking-popover p{margin-top:12px}.thinking-popover.full{box-shadow:0 8px 28px #24345d24,0 0 34px #a050db33;border-color:#a050db77}.thinking-popover.full .energy-wave{position:absolute;inset:-3px 4px;border-radius:999px;z-index:-1;background:radial-gradient(70% 120% at 100% 50%,#c56bffbb,transparent 68%),radial-gradient(50% 120% at 0% 50%,#6b8cffaa,transparent 70%);filter:blur(7px);animation:thunder-glow 1.7s ease-in-out infinite}@keyframes thunder-glow{0%,to{opacity:.5;transform:scale(1)}45%{opacity:1;transform:scale(1.03)}}.thinking-popover.full .thinking-capsule{box-shadow:0 0 0 1px #a050db66,0 0 26px #a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#6b8cff,#a050db,#e0a3ff,#a050db);background-size:280% 100%;animation:thunder-flow 2.6s linear infinite}@keyframes thunder-flow{to{background-position:280% 0}}.thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-control.full .thinking-trigger span:first-child{animation:thunder-flicker 2s steps(1,end) infinite}@keyframes thunder-flicker{0%,90%,to{opacity:1}92%{opacity:.35}94%{opacity:1}96%{opacity:.5}}#app .thinking-control .thinking-trigger{min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:13px;font-weight:500;align-items:center;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .thinking-control .thinking-trigger:hover{background:var(--md-surface-container-highest)}#app .thinking-control .thinking-trigger[aria-expanded=true]{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-caption{font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.workspace[data-v-8ea3016d]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}button[data-v-8ea3016d],input[data-v-8ea3016d],textarea[data-v-8ea3016d],select[data-v-8ea3016d]{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);padding:9px 12px}button[data-v-8ea3016d]{cursor:pointer;transition:background .15s,box-shadow .15s,filter .15s}button[data-v-8ea3016d]:disabled{opacity:.45;cursor:default}button[data-v-8ea3016d]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}input[data-v-8ea3016d]:focus,textarea[data-v-8ea3016d]:focus,select[data-v-8ea3016d]:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}input[type=checkbox][data-v-8ea3016d]{width:auto;accent-color:var(--md-primary)}.sessions[data-v-8ea3016d]{width:284px;flex-shrink:0;border-right:1px solid var(--md-outline-variant);padding:20px 16px;display:flex;flex-direction:column;gap:14px;background:var(--md-surface-container-low)}.sessions header[data-v-8ea3016d]{display:flex;align-items:center;justify-content:space-between;gap:12px}.sessions h1[data-v-8ea3016d]{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}.sessions header>button[data-v-8ea3016d]{height:34px;padding:0 13px;border:0;border-radius:9px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:600 13px/1 inherit}.sessions header>button[data-v-8ea3016d]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.08);box-shadow:var(--shadow-1)}.sessions>input[data-v-8ea3016d]{border-radius:10px;background:var(--md-surface-container-lowest)}.connection[data-v-8ea3016d]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}.connection button[data-v-8ea3016d]{margin-left:auto;padding:3px 9px;border-radius:8px;font-size:13px}.connection i[data-v-8ea3016d]{width:8px;height:8px;border-radius:50%;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}.connection i.online[data-v-8ea3016d]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.filter-bar[data-v-8ea3016d]{display:flex;gap:3px;padding:4px;border-radius:999px;background:var(--md-surface-container-high)}.filter-bar button[data-v-8ea3016d]{flex:1;font-size:12px;font-weight:500;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);box-shadow:none}.filter-bar button[data-v-8ea3016d]:hover:not(:disabled){background:transparent;color:var(--md-on-surface)}.filter-bar button.chosen[data-v-8ea3016d]{background:var(--md-surface-container-lowest);color:var(--md-primary);font-weight:650;box-shadow:var(--shadow-1)}.sessions label input[data-v-8ea3016d]{margin-right:6px}.session-list[data-v-8ea3016d]{overflow-y:auto;flex:1;min-height:0;margin:0 -4px;padding:0 4px}.session-card[data-v-8ea3016d]{display:flex;flex-direction:column;width:100%;text-align:left;gap:6px;margin-bottom:8px;padding:12px 13px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest)}.session-card[data-v-8ea3016d]:hover:not(:disabled){background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.session-card.selected[data-v-8ea3016d]{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}.session-card.selected[data-v-8ea3016d]:hover{background:var(--md-secondary-container)}.session-card strong[data-v-8ea3016d]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:600;font-size:14px}.origin[data-v-8ea3016d],small[data-v-8ea3016d],.sessions .muted[data-v-8ea3016d]{font-size:12px;color:var(--md-on-surface-variant)}.origin[data-v-8ea3016d]{font-weight:600;letter-spacing:.02em}.ledger-button[data-v-8ea3016d]{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:13px;font-weight:550}.ledger-button.chosen[data-v-8ea3016d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.ledger[data-v-8ea3016d]{flex:1;overflow-y:auto;padding:var(--space-xl)}.ledger>header[data-v-8ea3016d]{margin-bottom:8px}.ledger>header h2[data-v-8ea3016d]{font-size:18px;font-weight:650}.ledger-entry[data-v-8ea3016d]{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:14px 16px;margin:10px 0;box-shadow:var(--shadow-1)}.ledger-entry>div[data-v-8ea3016d]{display:flex;align-items:center;gap:10px;font-size:12px}.ledger-entry>div>span[data-v-8ea3016d]:first-child{font-family:var(--code-font);background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-weight:600}.ledger-entry>div small[data-v-8ea3016d]{margin-left:auto}.ledger-entry>p[data-v-8ea3016d]{margin:8px 0;font-size:14px;line-height:1.6;overflow-wrap:anywhere}.ledger-entry details[data-v-8ea3016d]{margin-top:8px;border-radius:10px;background:var(--md-surface-container);padding:8px 12px;font-size:12px}.ledger-entry summary[data-v-8ea3016d]{cursor:pointer;color:var(--md-on-surface-variant)}.ledger-entry pre[data-v-8ea3016d]{margin:8px 0 0;max-height:300px}.conversation[data-v-8ea3016d]{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}.conversation-header[data-v-8ea3016d]{display:flex;align-items:flex-start;gap:14px}.conversation-header>div[data-v-8ea3016d]:first-child{flex:1;min-width:0}.conversation-header h2[data-v-8ea3016d]{font-size:17px;font-weight:650;margin:0}.conversation-header p[data-v-8ea3016d]{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:13px}.session-actions[data-v-8ea3016d]{display:flex;gap:8px;flex-shrink:0}.session-actions button[data-v-8ea3016d]{height:32px;padding:0 13px;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.running[data-v-8ea3016d]{color:#b88412;font-weight:650;font-size:12px}.failed[data-v-8ea3016d]{color:var(--md-error)}.done[data-v-8ea3016d]{color:var(--md-success);font-weight:600;font-size:12px}.cancelled[data-v-8ea3016d],.muted[data-v-8ea3016d]{color:var(--md-on-surface-variant)}.muted[data-v-8ea3016d]{font-size:12px;line-height:1.6}.error[data-v-8ea3016d]{background:var(--md-error-container);color:#410e0b;padding:11px 16px;border-radius:12px;margin:8px 0;font-size:13px;overflow-wrap:anywhere}.transcript[data-v-8ea3016d]{flex:1;overflow-y:auto;padding:26px 28px;min-height:0}.context-summary[data-v-8ea3016d]{max-width:920px;margin:0 auto 22px;padding:14px 18px;border:1px dashed var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-low)}.context-summary-head[data-v-8ea3016d]{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.context-summary-head strong[data-v-8ea3016d]{font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--md-primary)}.context-summary-head time[data-v-8ea3016d]{font-size:12px;opacity:.75}.welcome[data-v-8ea3016d]{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}.welcome[data-v-8ea3016d]:before{content:\"\";display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center}.welcome h2[data-v-8ea3016d]{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}.welcome p[data-v-8ea3016d]{margin:6px 0;font-size:14px}.turn[data-v-8ea3016d]{max-width:920px;margin:0 auto 30px;display:flex;flex-direction:column;gap:10px}.bubble[data-v-8ea3016d]{padding:15px 19px;font-size:14px}.bubble.user[data-v-8ea3016d]{align-self:flex-end;max-width:82%;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:16px 16px 4px}.bubble.agent[data-v-8ea3016d]{align-self:flex-start;max-width:100%;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:16px 16px 16px 4px;box-shadow:var(--shadow-1)}.bubble .message-head[data-v-8ea3016d]{display:flex;align-items:center;gap:14px;margin-bottom:10px;font-size:12px}.bubble .message-head b[data-v-8ea3016d]{font-weight:700}.bubble .message-head time[data-v-8ea3016d]{margin-left:auto;opacity:.75;font-size:12px}.bubble .message-head span[data-v-8ea3016d]{margin-left:auto}.bubble.user .message-head[data-v-8ea3016d]{margin-bottom:7px;opacity:.85}.message-text[data-v-8ea3016d]{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}.bubble.agent[data-v-8ea3016d] p{margin:.4em 0}.bubble.agent[data-v-8ea3016d] pre{max-height:420px}.agent-speech[data-v-8ea3016d]{margin:6px 0;padding:2px 0;line-height:1.7}.model-annotation[data-v-8ea3016d]{display:block;font-size:12px;opacity:.7;margin-bottom:4px;font-family:var(--code-font)}.agent-speech[data-v-8ea3016d] p{margin:.45em 0}.agent-speech[data-v-8ea3016d] pre{background:var(--md-surface-container);border:1px solid var(--md-outline-variant);border-radius:10px;padding:12px 14px;max-height:460px;overflow:auto;font-size:13px}.agent-speech[data-v-8ea3016d] code{font-family:var(--code-font)}.agent-speech[data-v-8ea3016d] ul{padding-left:20px;margin:.4em 0}.steps[data-v-8ea3016d]{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}.steps details[data-v-8ea3016d]{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}.steps summary[data-v-8ea3016d]{cursor:pointer;font-size:13px;font-weight:550}.steps summary small[data-v-8ea3016d]{margin-left:10px;font-weight:600}.steps summary[data-v-8ea3016d]::marker{color:var(--md-on-surface-variant)}.steps details pre[data-v-8ea3016d]{margin:10px 0 0;font-family:var(--code-font);font-size:13px;white-space:pre-wrap;max-height:400px}pre[data-v-8ea3016d]{max-height:450px;overflow:auto;font-family:var(--code-font)}.subagent-card[data-v-8ea3016d]{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}button.subagent-card-head[data-v-8ea3016d]{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;border-radius:0;background:transparent;padding:11px 14px;font-size:13px}button.subagent-card-head[data-v-8ea3016d]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}button.subagent-card-head>span[data-v-8ea3016d]:first-child{color:var(--md-primary)}button.subagent-card-head>strong[data-v-8ea3016d]{font-weight:700}.subagent-prompt[data-v-8ea3016d]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--md-on-surface)}.subagent-card small[data-v-8ea3016d]{font-weight:600}.subagent-chevron[data-v-8ea3016d]{color:var(--md-on-surface-variant);font-size:12px}.subagent-card-error[data-v-8ea3016d]{margin:0 10px 10px;padding:8px 12px;font-size:12px}.subagent-card.nested[data-v-8ea3016d]{margin:6px 0;box-shadow:none}.sub-view[data-v-8ea3016d]{max-width:900px;margin:0 auto}.sub-view-header[data-v-8ea3016d]{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}.sub-view-header button[data-v-8ea3016d]{flex-shrink:0;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.sub-view-header h3[data-v-8ea3016d]{margin:0 0 4px;font-size:16px;font-weight:650}.sub-view-header p[data-v-8ea3016d]{margin:0;max-width:520px}.sub-view-header>span[data-v-8ea3016d]{margin-left:auto;font-weight:650;font-size:12px}.sub-view-body[data-v-8ea3016d]{min-height:120px}.composer[data-v-8ea3016d]{flex-shrink:0;margin:0 20px 18px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}.composer-input[data-v-8ea3016d]{position:relative}.composer-input textarea[data-v-8ea3016d]{font-size:14px;width:100%;display:block;min-height:96px;padding:15px 64px 15px 18px;line-height:1.6;resize:vertical;border:0;border-radius:0;background:transparent}.composer-input textarea[data-v-8ea3016d]:focus{box-shadow:none;border:0}.attach-row[data-v-8ea3016d]{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 16px 0}.attach-btn[data-v-8ea3016d]{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:650;min-height:30px;padding:0 12px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);border:0}.attach-btn[data-v-8ea3016d]:hover:not(:disabled){filter:brightness(1.04)}.attach-btn[data-v-8ea3016d]:disabled{opacity:.5}.attach-chip[data-v-8ea3016d]{display:inline-flex;align-items:center;gap:6px;max-width:220px;font-size:12px;padding:4px 6px 4px 10px;border-radius:999px;background:var(--md-surface-container);border:1px solid var(--md-outline-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.attach-chip button[data-v-8ea3016d]{border:0;background:transparent;cursor:pointer;font-size:14px;line-height:1;padding:0 4px;color:var(--md-on-surface-variant)}.attach-chip button[data-v-8ea3016d]:hover{color:var(--md-error)}.attach-error[data-v-8ea3016d]{font-size:12px;color:var(--md-error)}.send-fly[data-v-8ea3016d]{position:absolute!important;right:10px!important;bottom:10px!important;z-index:2;width:42px!important;height:42px!important;aspect-ratio:1/1;display:grid!important;place-items:center;border:0!important;border-radius:50%!important;padding:0!important;margin:0!important;background:var(--md-primary);color:var(--md-on-primary,#fff);box-shadow:0 2px 10px color-mix(in srgb,var(--md-primary) 38%,transparent)}.send-fly svg[data-v-8ea3016d]{width:20px;height:20px}.send-fly[data-v-8ea3016d]:hover:not(:disabled){filter:brightness(1.08)}.send-fly[data-v-8ea3016d]:disabled{background:var(--md-surface-container);color:var(--md-on-surface-variant);opacity:.7;box-shadow:none}.send-fly.stop[data-v-8ea3016d]{background:var(--md-error);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--md-error) 40%,transparent)}.compact-notice[data-v-8ea3016d]{font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}.execution-options[data-v-8ea3016d]{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}.execution-options label[data-v-8ea3016d]{display:flex;flex-direction:column;gap:5px;font-size:12px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}.execution-options[data-v-8ea3016d] .app-select-trigger,.execution-options .workspace-select[data-v-8ea3016d]{width:100%;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}.workspace-select[data-v-8ea3016d]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}.composer footer[data-v-8ea3016d]{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap;border-top:1px solid var(--md-outline-variant)}.composer footer>select[data-v-8ea3016d],.composer footer>.app-select[data-v-8ea3016d]{font-size:13px;border-radius:10px;min-height:34px}.composer footer .muted[data-v-8ea3016d]{flex:1;min-width:120px}.composer footer>button[data-v-8ea3016d]{font-size:13px;font-weight:600;border-radius:9px;min-height:34px}.host-panel>strong[data-v-8ea3016d]{font-size:14px}.host-panel dl[data-v-8ea3016d]{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px}.host-panel dt[data-v-8ea3016d]{color:var(--md-on-surface-variant);font-weight:600}.host-panel dd[data-v-8ea3016d]{margin:4px 0 0;overflow-wrap:anywhere}.usage-rings[data-v-8ea3016d]{display:flex;align-items:center;gap:24px;padding:14px 0;flex-wrap:wrap}.usage-metric[data-v-8ea3016d]{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}.usage-ring[data-v-8ea3016d]{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}.usage-ring b[data-v-8ea3016d]{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:15px;font-weight:650;box-shadow:var(--shadow-1)}.new-folder[data-v-8ea3016d]{display:flex;gap:8px}.new-folder input[data-v-8ea3016d]{flex:1;min-width:0}.directory-backdrop[data-v-8ea3016d]{position:fixed;inset:0;background:#14111acc;z-index:1000;display:grid;place-items:center;padding:20px}.directory-dialog[data-v-8ea3016d]{background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:20px;padding:22px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh;box-shadow:var(--shadow-4)}.directory-dialog>header[data-v-8ea3016d]{gap:12px}.directory-dialog>header h2[data-v-8ea3016d]{font-size:16px;font-weight:650}.directory-list[data-v-8ea3016d]{overflow:auto;min-height:180px;display:flex;flex-direction:column;gap:6px}.directory-list button[data-v-8ea3016d]{text-align:left;border-radius:10px;background:var(--md-surface-container-low);font-size:13px}.directory-roots[data-v-8ea3016d]{display:flex;gap:8px;flex-wrap:wrap}.directory-roots button[data-v-8ea3016d]{border-radius:999px;font-size:12px;padding:6px 12px}.directory-dialog code[data-v-8ea3016d]{overflow-wrap:anywhere;font-size:12px;background:var(--md-surface-container);padding:8px 10px;border-radius:8px}.directory-dialog>footer[data-v-8ea3016d]{display:flex;justify-content:flex-end}.directory-dialog>footer button[data-v-8ea3016d]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;font-weight:600}.permission-request[data-v-8ea3016d]{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}.permission-request small[data-v-8ea3016d]{display:block;margin:8px 0}.permission-request pre[data-v-8ea3016d]{max-height:160px;overflow:auto}.permission-request>div[data-v-8ea3016d]{display:flex;justify-content:flex-end;gap:8px}#app .workspace[data-v-8ea3016d]{gap:12px;padding-left:6px;background:var(--md-surface-container)}#app .workspace .sessions[data-v-8ea3016d]{width:296px;gap:14px;padding:18px 14px;border:0;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .workspace .sessions h1[data-v-8ea3016d]{font-size:24px;font-weight:800;letter-spacing:-.02em}#app .workspace .sessions header>button[data-v-8ea3016d]{height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 13px/1 inherit;display:inline-flex;align-items:center;gap:7px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .workspace .sessions header>button[data-v-8ea3016d]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.06);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .sessions>input[data-v-8ea3016d]{min-height:48px;padding:0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:14px}#app .workspace .sessions>input[data-v-8ea3016d]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .workspace .filter-bar[data-v-8ea3016d]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .workspace .filter-bar button[data-v-8ea3016d]{border-radius:999px;padding:8px 4px;font-weight:600}#app .workspace .filter-bar button.chosen[data-v-8ea3016d]{background:var(--md-primary);color:var(--md-on-primary,#fff);font-weight:700;box-shadow:var(--shadow-1)}#app .workspace .filter-bar button.chosen[data-v-8ea3016d]:hover:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff)}#app .workspace .session-list[data-v-8ea3016d]{margin:0 -2px;padding:0 2px}#app .workspace .session-card[data-v-8ea3016d]{gap:5px;margin-bottom:8px;padding:13px 15px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:18px;background:var(--md-surface-container-lowest);transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .2s,border-color .2s,box-shadow .22s,border-radius .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .workspace .session-card[data-v-8ea3016d]:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-1);border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant))}#app .workspace .session-card.selected[data-v-8ea3016d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent;border-radius:20px 20px 20px 7px;box-shadow:var(--shadow-1)}#app .workspace .session-card .origin[data-v-8ea3016d]{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:12px;color:var(--md-primary)}#app .workspace .session-card.selected .origin[data-v-8ea3016d]{color:var(--md-on-secondary-container);opacity:.75}#app .workspace .ledger-button[data-v-8ea3016d]{min-height:44px;border-radius:16px;font-weight:650;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .ledger-button.chosen[data-v-8ea3016d]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent}#app .workspace .ledger-entry[data-v-8ea3016d]{border-radius:20px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-lowest);box-shadow:var(--shadow-1)}#app .workspace .conversation[data-v-8ea3016d]{background:var(--md-surface);border-radius:30px;overflow:hidden;box-shadow:var(--shadow-1)}#app .workspace .conversation-header[data-v-8ea3016d]{padding:20px 26px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .conversation-header h2[data-v-8ea3016d]{font-size:20px;font-weight:750;letter-spacing:-.01em}#app .workspace .session-actions button[data-v-8ea3016d]{height:36px;padding:0 15px;border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .session-actions button[data-v-8ea3016d]:hover:not(:disabled){background:var(--md-surface-container-highest);box-shadow:none}#app .workspace .running[data-v-8ea3016d]{color:#b88412;background:color-mix(in srgb,#B88412 14%,transparent);padding:4px 11px;border-radius:999px;font-weight:700}#app .workspace .transcript[data-v-8ea3016d]{padding:28px 30px}#app .workspace .welcome[data-v-8ea3016d]{margin:64px auto 0}#app .workspace .welcome[data-v-8ea3016d]:before{width:76px;height:76px;border-radius:26px 26px 26px 10px;background-color:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24' fill='none' stroke='%235944c6' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-size:34px 34px}#app .workspace .welcome h2[data-v-8ea3016d]{font-size:26px;font-weight:800;letter-spacing:-.02em}#app .workspace .turn[data-v-8ea3016d]{gap:12px;margin-bottom:32px}#app .workspace .bubble[data-v-8ea3016d]{padding:16px 20px;font-size:15px;line-height:1.7}#app .workspace .bubble.user[data-v-8ea3016d]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px;box-shadow:var(--shadow-1);max-width:82%}#app .workspace .bubble.agent[data-v-8ea3016d]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:8px 24px 24px;box-shadow:var(--shadow-1);max-width:100%}#app .workspace .bubble .message-head b[data-v-8ea3016d]{font-weight:750}#app .workspace .steps[data-v-8ea3016d]{gap:9px;margin:14px 0}#app .workspace .steps details[data-v-8ea3016d]{border-radius:16px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);padding:11px 15px}#app .workspace .subagent-card[data-v-8ea3016d]{border-radius:18px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);box-shadow:var(--shadow-1)}#app .workspace button.subagent-card-head[data-v-8ea3016d]{padding:12px 15px}#app .workspace button.subagent-card-head[data-v-8ea3016d]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .sub-view-header[data-v-8ea3016d]{padding-bottom:16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .sub-view-header button[data-v-8ea3016d]{border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .agent-speech[data-v-8ea3016d] pre{border-radius:16px;background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}#app .workspace .composer[data-v-8ea3016d]{margin:0 22px 20px;border-radius:28px;overflow:hidden;background:var(--md-surface-container-lowest);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);box-shadow:var(--shadow-2)}#app .workspace .composer[data-v-8ea3016d]:focus-within{border-color:color-mix(in srgb,var(--md-primary) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent),var(--shadow-2)}#app .workspace .execution-options[data-v-8ea3016d]{padding:12px 16px;gap:10px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .execution-options label[data-v-8ea3016d]{font-weight:700;letter-spacing:.05em}#app .workspace .execution-options .workspace-select[data-v-8ea3016d]{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .execution-options[data-v-8ea3016d] .app-select-trigger,#app .workspace .composer footer[data-v-8ea3016d] .app-select-trigger{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .composer-input textarea[data-v-8ea3016d]{border-radius:0;background:transparent}#app .workspace .send-fly[data-v-8ea3016d]{width:46px!important;height:46px!important;border-radius:50%!important;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .composer footer[data-v-8ea3016d]{border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);padding:12px 16px}#app .workspace .composer footer>button[data-v-8ea3016d]{border-radius:999px;min-height:36px;padding-inline:15px;background:var(--md-surface-container-high);border-color:transparent}#app .workspace .host-panel[data-v-8ea3016d]{margin:0 22px 10px;border-radius:24px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .workspace .usage-ring b[data-v-8ea3016d]{background:var(--md-surface-container-lowest)}#app .workspace .directory-dialog[data-v-8ea3016d]{border-radius:32px;border-color:transparent;box-shadow:var(--shadow-4);background:var(--md-surface-container-low)}#app .workspace .directory-list button[data-v-8ea3016d]{background:var(--md-surface-container-lowest);border-color:transparent;border-radius:16px;min-height:46px}#app .workspace .directory-list button[data-v-8ea3016d]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .directory-roots button[data-v-8ea3016d]{background:var(--md-surface-container-high);border-color:transparent}@media (max-width:800px){.sessions[data-v-8ea3016d]{width:214px;padding:12px 10px}.transcript[data-v-8ea3016d]{padding:14px}.composer[data-v-8ea3016d]{margin:0 12px 12px}.composer footer .muted[data-v-8ea3016d]{display:none}.conversation-header[data-v-8ea3016d]{padding:14px 16px}.welcome[data-v-8ea3016d]{margin:30px auto 0}.turn[data-v-8ea3016d]{margin-bottom:22px}}@media (max-width:560px){.workspace[data-v-8ea3016d]{flex-direction:column}.sessions[data-v-8ea3016d]{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input[data-v-8ea3016d],.filter-bar[data-v-8ea3016d],.connection[data-v-8ea3016d]{display:none}.session-list[data-v-8ea3016d]{display:flex;gap:6px;overflow-x:auto}.session-card[data-v-8ea3016d]{min-width:160px;width:160px;margin-bottom:0}.ledger-button[data-v-8ea3016d]{padding:5px;font-size:12px}}\n";document.head.appendChild(s)}})();
