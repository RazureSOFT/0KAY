var xr = Object.defineProperty;
var Sr = (n, e, t) => e in n ? xr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var re = (n, e, t) => Sr(n, typeof e != "symbol" ? e + "" : e, t);
import { reactive as Tr, defineComponent as Zt, computed as V, openBlock as m, createElementBlock as k, ref as O, onMounted as qt, onUnmounted as yn, normalizeClass as ie, createElementVNode as o, toDisplayString as g, createCommentVNode as I, Fragment as ne, renderList as ve, withModifiers as Ne, watch as be, nextTick as nt, mergeProps as Ar, unref as ue, createBlock as Et, Teleport as Zn, createVNode as Be, Transition as er, withCtx as tr, normalizeStyle as Gt, withDirectives as vn, vModelText as Wn, withKeys as Ht, createTextVNode as $e, vModelCheckbox as Er } from "vue";
function $r() {
  const n = Tr({
    agents: [],
    tasks: [],
    sessions: [],
    onlineCount: 0,
    loading: !1,
    error: ""
  });
  let e = null, t = null, r = null, s = "";
  const a = /* @__PURE__ */ new Map();
  let d = null, u = !1;
  function b(C) {
    C.reset && a.clear();
    for (const N of C.removed || []) a.delete(N);
    for (const N of C.tasks || []) a.set(N.task_id, N);
    s = C.cursor || "";
    const U = [...a.values()].sort((N, ce) => (ce.started_at || "").localeCompare(N.started_at || "") || N.task_id.localeCompare(ce.task_id));
    n.tasks = U.filter((N) => N.kind !== "agent_session"), n.sessions = U.filter((N) => N.kind === "agent_session");
  }
  function _() {
    d?.close(), u = !1, d = new EventSource(`/api/tasks/events?cursor=${encodeURIComponent(s)}`), d.onopen = () => {
      u = !0;
    }, d.onerror = () => {
      u = !1;
    }, d.addEventListener("tasks", (C) => {
      try {
        b(JSON.parse(C.data));
      } catch {
        u = !1;
      }
    });
  }
  function S() {
    return t ? (r || (r = t.then(() => (r = null, S()))), r) : (t = E().finally(() => {
      t = null;
    }), t);
  }
  async function E() {
    n.loading = !0, n.error = "";
    try {
      const C = await fetch("/api/agents", { signal: AbortSignal.timeout(8e3) });
      if (!C.ok) throw new Error(`HTTP ${C.status}`);
      const U = await C.json();
      n.agents = U.agents || [], n.onlineCount = U.online_count ?? n.agents.length;
    } catch (C) {
      n.error = C.message || "failed";
    }
    if (!u)
      try {
        const C = await fetch(`/api/tasks?incremental=1&cursor=${encodeURIComponent(s)}`, { signal: AbortSignal.timeout(8e3) });
        if (!C.ok) throw new Error(`任务记录 HTTP ${C.status}`);
        const U = await C.json();
        b(U);
      } catch (C) {
        n.error = C.message || "无法刷新任务记录";
      }
    n.loading = !1;
  }
  function D() {
    S().then(() => {
      e && _();
    }), e && clearInterval(e), e = setInterval(() => {
      !document.hidden && !t && S();
    }, 2e3);
  }
  function F() {
    d?.close(), d = null, u = !1, e && (clearInterval(e), e = null);
  }
  function L(C) {
    return !C.missing_dependencies?.length && (C.status === "PLUGIN_STATUS_HEALTHY" || C.status === "HEALTHY");
  }
  async function K(C) {
    const U = await fetch("/api/agent/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: C }) });
    if (!U.ok) throw new Error(await U.text());
    const N = await U.json();
    return await S(), N.session_id;
  }
  async function z(C, U, N) {
    const ce = await fetch("/api/agent/sessions", { method: U === "delete" ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: C, action: U, title: N }) });
    if (!ce.ok) throw new Error(await ce.text());
    await S();
  }
  async function Y(C, U, N, ce = {}) {
    const J = await fetch("/api/agent/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: C, prompt: U, agent_type: N, ...ce }) }), B = await J.text();
    if (await S(), !J.ok) {
      let y = B;
      try {
        y = JSON.parse(B).message || B;
      } catch {
      }
      throw new Error(y);
    }
  }
  async function ae(C) {
    const U = await fetch("/api/tasks/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: C }) });
    if (!U.ok) throw new Error(await U.text());
    const N = await U.json();
    if (!N.success) throw new Error(N.message);
    await S();
  }
  return Object.assign(n, {
    fetchAgents: S,
    connect: D,
    disconnect: F,
    isHealthy: L,
    createSession: K,
    manageSession: z,
    sendTask: Y,
    cancelTask: ae
  });
}
const Rr = $r();
function Cr() {
  return Rr;
}
function hs() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Rt = hs();
function nr(n) {
  Rt = n;
}
var At = { exec: () => null };
function jt(n) {
  let e = [];
  return (t) => {
    let r = Math.max(0, Math.min(3, t - 1)), s = e[r];
    return s || (s = n(r), e[r] = s), s;
  };
}
function H(n, e = "") {
  let t = typeof n == "string" ? n : n.source, r = { replace: (s, a) => {
    let d = typeof a == "string" ? a : a.source;
    return d = d.replace(we.caret, "$1"), t = t.replace(s, d), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var Lr = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), we = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: jt((n) => new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: jt((n) => new RegExp(`^ {0,${n}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: jt((n) => new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)), headingBeginRegex: jt((n) => new RegExp(`^ {0,${n}}#`)), htmlBeginRegex: jt((n) => new RegExp(`^ {0,${n}}(?:</?(?:${wn})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: jt((n) => new RegExp(`^ {0,${n}}>`)) }, Ir = /^(?:[ \t]*(?:\n|$))+/, Or = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Pr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, _n = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Mr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, fs = / {0,3}(?:[*+-]|\d{1,9}[.)])/, sr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, rr = H(sr).replace(/bull/g, fs).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Dr = H(sr).replace(/bull/g, fs).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), gs = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Nr = /^[^\n]+/, ms = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, zr = H(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", ms).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ur = H(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, fs).getRegex(), wn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", vs = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Fr = H("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", vs).replace("tag", wn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), lr = (n) => H(gs).replace("hr", _n).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", n).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", wn).getRegex(), Br = lr(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), Hr = lr(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), jr = H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Hr).getRegex(), ks = { blockquote: jr, code: Or, def: zr, fences: Pr, heading: Mr, hr: _n, html: Fr, lheading: rr, list: Ur, newline: Ir, paragraph: Br, table: At, text: Nr }, $s = H("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", _n).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", wn).getRegex(), Wr = { ...ks, lheading: Dr, table: $s, paragraph: H(gs).replace("hr", _n).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", $s).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", wn).getRegex() }, Vr = { ...ks, html: H(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", vs).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: At, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: H(gs).replace("hr", _n).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", rr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, qr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ar = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, Yr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, it = /[\p{P}\p{S}]/u, Kt = /[\s\p{P}\p{S}]/u, xn = /[^\s\p{P}\p{S}]/u, Zr = H(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Kt).getRegex(), Kr = /[\p{Pi}\p{Ps}"']/u, or = /(?!~)[\p{P}\p{S}]/u, Xr = /(?!~)[\s\p{P}\p{S}]/u, Qr = /(?:[^\s\p{P}\p{S}]|~)/u, Jr = H(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Lr ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ir = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, el = H(ir, "u").replace(/punct/g, it).getRegex(), tl = H(ir, "u").replace(/punct/g, or).getRegex(), nl = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, sl = H(nl, "u").replace(/openQuote/g, Kr).replace(/punct/g, it).getRegex(), ur = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", rl = H(ur, "gu").replace(/notPunctSpace/g, xn).replace(/punctSpace/g, Kt).replace(/punct/g, it).getRegex(), ll = H(ur, "gu").replace(/notPunctSpace/g, Qr).replace(/punctSpace/g, Xr).replace(/punct/g, or).getRegex(), al = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", ol = H(al, "gu").replace(/notPunctSpace/g, xn).replace(/punctSpace/g, Kt).replace(/punct/g, it).getRegex(), il = H("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, xn).replace(/punctSpace/g, Kt).replace(/punct/g, it).getRegex(), ul = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", cl = H(ul, "gu").replace(/notPunctSpace/g, xn).replace(/punctSpace/g, Kt).replace(/punct/g, it).getRegex(), dl = H(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, it).getRegex(), pl = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", hl = H(pl, "gu").replace(/notPunctSpace/g, xn).replace(/punctSpace/g, Kt).replace(/punct/g, it).getRegex(), fl = H(/\\(punct)/, "gu").replace(/punct/g, it).getRegex(), gl = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ml = H(vs).replace("(?:-->|$)", "-->").getRegex(), vl = H("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ml).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), cr = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, Vn = H(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", cr).getRegex(), kl = H(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Vn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), bl = H(/^!?\[(label)\]\[(ref)\]/).replace("label", Vn).replace("ref", ms).getRegex(), yl = H(/^!?\[(ref)\](?:\[\])?/).replace("ref", ms).getRegex(), Rs = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, _l = H(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", cr).getRegex(), wl = H("reflink|nolink(?!\\()", "g").replace("reflink", H(/^!?\[(label)\]\[(ref)\]/).replace("label", _l).replace("ref", Rs).getRegex()).replace("nolink", H(/^!?\[(ref)\](?:\[\])?/).replace("ref", Rs).getRegex()).getRegex(), Cs = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, xl = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/, Sl = H(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, xl).getRegex(), bs = { _backpedal: At, anyPunctuation: fl, autolink: gl, blockSkip: Jr, br: ar, code: Gr, del: At, delLDelim: At, delRDelim: At, emStrongLDelim: el, emStrongRDelimAst: rl, emStrongRDelimUnd: il, escape: qr, link: kl, nolink: yl, punctuation: Zr, reflink: bl, reflinkSearch: wl, tag: vl, text: Yr, url: At }, Tl = { ...bs, emStrongLDelim: sl, emStrongRDelimAst: ol, emStrongRDelimUnd: cl, link: H(/^!?\[(label)\]\((.*?)\)/).replace("label", Vn).getRegex(), reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Vn).getRegex() }, is = { ...bs, emStrongRDelimAst: ll, emStrongLDelim: tl, delLDelim: dl, delRDelim: hl, url: H(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Sl).replace("protocol", Cs).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: H(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", Cs).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() }, Al = { ...is, br: H(ar).replace("{2,}", "*").getRegex(), text: H(is.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Fn = { normal: ks, gfm: Wr, pedantic: Vr }, pn = { normal: bs, gfm: is, breaks: Al, pedantic: Tl }, El = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Ls = (n) => El[n];
function Me(n, e) {
  if (e) {
    if (we.escapeTest.test(n)) return n.replace(we.escapeReplace, Ls);
  } else if (we.escapeTestNoEncode.test(n)) return n.replace(we.escapeReplaceNoEncode, Ls);
  return n;
}
function $l(n) {
  return n.replace(we.numericCharacterReference, (e, t, r) => {
    let s = t === void 0 ? Number.parseInt(r, 16) : Number.parseInt(t, 10);
    return s === 0 || s > 1114111 || s >= 55296 && s <= 57343 ? "�" : String.fromCodePoint(s);
  });
}
function Is(n) {
  try {
    n = encodeURI(n).replace(we.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function Os(n, e) {
  let t = n.replace(we.findPipe, (a, d, u) => {
    let b = !1, _ = d;
    for (; --_ >= 0 && u[_] === "\\"; ) b = !b;
    return b ? "|" : " |";
  }), r = t.split(we.splitPipe), s = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; s < r.length; s++) r[s] = r[s].trim().replace(we.slashPipe, "|");
  return r;
}
function ft(n, e, t) {
  let r = n.length;
  if (r === 0) return "";
  let s = 0;
  for (; s < r && n.charAt(r - s - 1) === e; )
    s++;
  return n.slice(0, r - s);
}
function Ps(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && we.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function qn(n) {
  return n.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Rl(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++) if (n[r] === "\\") r++;
  else if (n[r] === e[0]) t++;
  else if (n[r] === e[1] && (t--, t < 0)) return r;
  return t > 0 ? -2 : -1;
}
function Ms(n, e = 0) {
  let t = e, r = "";
  for (let s of n) if (s === "	") {
    let a = 4 - t % 4;
    r += " ".repeat(a), t += a;
  } else r += s, t++;
  return r;
}
function Ds(n, e, t, r, s) {
  let a = e.href, d = e.title || null, u = n[1].replace(s.other.outputLinkReplace, "$1"), b = n[0].charAt(0) === "!";
  r.state.inLink = !0;
  let _ = r.state.linkEmitted, S = r.state.inRawBlock;
  r.state.linkEmitted = !1;
  let E = r.inlineTokens(u), D = r.state.linkEmitted;
  if (r.state.linkEmitted = _, r.state.inLink = !1, !b) {
    if (D) {
      r.state.inRawBlock = S;
      return;
    }
    r.state.linkEmitted = !0;
  }
  return { type: b ? "image" : "link", raw: t, href: a, title: d, text: u, tokens: E };
}
function Cl(n, e, t) {
  let r = n.match(t.other.indentCodeCompensation);
  if (r === null) return e;
  let s = r[1];
  return e.split(`
`).map((a) => {
    let d = a.match(t.other.beginningSpace);
    if (d === null) return a;
    let [u] = d;
    return a.slice(Math.min(u.length, s.length));
  }).join(`
`);
}
function Ns(n, e, t, r) {
  if (!e.includes("<")) return !1;
  for (let s = 0; s < e.length; s++) {
    if (e[s] === "\\") {
      s++;
      continue;
    }
    if (e[s] === "`") {
      let u = r.inline.code.exec(e.slice(s));
      if (u) {
        s += u[0].length - 1;
        continue;
      }
    }
    if (e[s] !== "<") continue;
    let a = n.slice(t + s), d = r.inline.tag.exec(a) || r.inline.autolink.exec(a);
    if (d) {
      if (d[0].length > e.length - s) return !0;
      s += d[0].length - 1;
    }
  }
  return !1;
}
var Gn = class {
  constructor(n) {
    re(this, "options");
    re(this, "rules");
    re(this, "lexer");
    this.options = n || Rt;
  }
  space(n) {
    let e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(n) {
    let e = this.rules.block.code.exec(n);
    if (e) {
      let t = this.options.pedantic ? e[0] : Ps(e[0]), r = t.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t, codeBlockStyle: "indented", text: r };
    }
  }
  fences(n) {
    let e = this.rules.block.fences.exec(n);
    if (e) {
      let t = e[0], r = Cl(t, e[3] || "", this.rules);
      return { type: "code", raw: t, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(n) {
    let e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        let r = ft(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceTabChar.test(r)) && (t = r.trim());
      }
      return { type: "heading", raw: ft(e[0], `
`), depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(n) {
    let e = this.rules.block.hr.exec(n);
    if (e) return { type: "hr", raw: ft(e[0], `
`) };
  }
  blockquote(n) {
    let e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = ft(e[0], `
`).split(`
`), r = "", s = "", a = [];
      for (; t.length > 0; ) {
        let d = !1, u = [], b;
        for (b = 0; b < t.length; b++) if (this.rules.other.blockquoteStart.test(t[b])) u.push(t[b]), d = !0;
        else if (!d) u.push(t[b]);
        else break;
        t = t.slice(b);
        let _ = u.join(`
`), S = _.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${_}` : _, s = s ? `${s}
${S}` : S;
        let E = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(S, a, !0), this.lexer.state.top = E, t.length === 0) break;
        let D = a.at(-1);
        if (D?.type === "code") break;
        if (D?.type === "blockquote") {
          let F = D, L = t.join(`
`), K = F.raw + `
` + L.replace(this.rules.other.blockquoteSetextReplace2, ""), z = this.blockquote(K);
          a[a.length - 1] = z;
          let Y = K.substring(z.raw.length).replace(/^\n/, ""), ae = Y ? Y.split(`
`).length : 0, C = ae ? t.slice(0, -ae) : t;
          C.length > 0 && (r = `${r}
${C.join(`
`)}`), s = s.substring(0, s.length - F.text.length) + z.text;
          break;
        } else if (D?.type === "list") {
          let F = D, L = F.raw + `
` + t.join(`
`), K = this.list(L);
          a[a.length - 1] = K, r = r.substring(0, r.length - D.raw.length) + K.raw, s = s.substring(0, s.length - F.raw.length) + K.raw, t = L.substring(a.at(-1).raw.length).split(`
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
      let a = this.rules.other.listItemRegex(t), d = !1;
      for (; n; ) {
        let b = !1, _ = "", S = "";
        if (!(e = a.exec(n)) || this.rules.block.hr.test(n)) break;
        _ = e[0], n = n.substring(_.length);
        let E = e[2].split(`
`, 1)[0], D = e[1].length, F = this.options.pedantic ? Ms(E, D) : E.replace(this.rules.other.leadingSpaceTab, (Y) => Ms(Y, D)), L = n.split(`
`, 1)[0], K = !F.trim(), z = 0;
        if (this.options.pedantic ? (z = 2, S = F.trimStart()) : K ? z = D + 1 : (z = F.search(this.rules.other.nonSpaceChar), z = z > 4 ? 1 : z, S = F.slice(z), z += D), K && this.rules.other.blankLine.test(L) && (_ += L + `
`, n = n.substring(L.length + 1), b = !0), !b) {
          let Y = this.rules.other.nextBulletRegex(z), ae = this.rules.other.hrRegex(z), C = this.rules.other.fencesBeginRegex(z), U = this.rules.other.headingBeginRegex(z), N = this.rules.other.htmlBeginRegex(z), ce = this.rules.other.blockquoteBeginRegex(z);
          for (; n; ) {
            let J = n.split(`
`, 1)[0], B;
            if (L = J, this.options.pedantic ? (L = L.replace(this.rules.other.listReplaceNesting, "  "), B = L) : B = L.replace(this.rules.other.leadingSpaceTab, (y) => y.replace(this.rules.other.tabCharGlobal, "    ")), C.test(L) || U.test(L) || N.test(L) || ce.test(L) || Y.test(L) || ae.test(L)) break;
            if (B.search(this.rules.other.nonSpaceChar) >= z || !L.trim()) S += `
` + B.slice(z);
            else {
              if (K || F.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || C.test(F) || U.test(F) || ae.test(F)) break;
              S += `
` + L;
            }
            K = !L.trim(), _ += J + `
`, n = n.substring(J.length + 1), F = B.slice(z);
          }
        }
        s.loose || (d ? s.loose = !0 : this.rules.other.doubleBlankLine.test(_) && (d = !0)), s.items.push({ type: "list_item", raw: _, task: !!this.options.gfm && this.rules.other.listIsTask.test(S), loose: !1, text: S, tokens: [] }), s.raw += _;
      }
      let u = s.items.at(-1);
      if (u) u.raw = u.raw.trimEnd(), u.text = u.text.trimEnd();
      else return;
      s.raw = s.raw.trimEnd();
      for (let b of s.items) if (this.lexer.state.top = !1, b.tokens = this.lexer.blockTokens(b.text, []), !s.loose) {
        let _ = b.tokens.filter((E) => E.type === "space"), S = _.length > 0 && _.some((E) => this.rules.other.anyLine.test(E.raw));
        s.loose = S;
      }
      for (let b of s.items) {
        let _ = b.tokens[0];
        if (b.task && (_?.type === "text" || _?.type === "paragraph")) {
          b.text = b.text.replace(this.rules.other.listReplaceTask, ""), _.raw = _.raw.replace(this.rules.other.listReplaceTask, ""), _.text = _.text.replace(this.rules.other.listReplaceTask, "");
          for (let E = this.lexer.inlineQueue.length - 1; E >= 0; E--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[E].src)) {
            this.lexer.inlineQueue[E].src = this.lexer.inlineQueue[E].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let S = this.rules.other.listTaskCheckbox.exec(b.raw);
          if (S) {
            let E = { type: "checkbox", raw: S[0] + " ", checked: S[0] !== "[ ]" };
            b.checked = E.checked, s.loose ? b.tokens[0] && ["paragraph", "text"].includes(b.tokens[0].type) && "tokens" in b.tokens[0] && b.tokens[0].tokens ? (b.tokens[0].raw = E.raw + b.tokens[0].raw, b.tokens[0].text = E.raw + b.tokens[0].text, b.tokens[0].tokens.unshift(E)) : b.tokens.unshift({ type: "paragraph", raw: E.raw, text: E.raw, tokens: [E] }) : b.tokens.unshift(E);
          }
        } else b.task && (b.task = !1);
      }
      if (s.loose) for (let b of s.items) {
        b.loose = !0;
        for (let _ of b.tokens) _.type === "text" && (_.type = "paragraph");
      }
      return s;
    }
  }
  html(n) {
    let e = this.rules.block.html.exec(n);
    if (e) {
      let t = Ps(e[0]);
      return { type: "html", block: !0, raw: t, pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: t };
    }
  }
  def(n) {
    let e = this.rules.block.def.exec(n);
    if (e) {
      let t = qn(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: ft(e[0], `
`), href: r, title: s };
    }
  }
  table(n) {
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = Os(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: ft(e[0], `
`), header: [], align: [], rows: [] };
    if (t.length === r.length) {
      for (let d of r) this.rules.other.tableAlignRight.test(d) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(d) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(d) ? a.align.push("left") : a.align.push(null);
      for (let d = 0; d < t.length; d++) a.header.push({ text: t[d], tokens: this.lexer.inline(t[d]), header: !0, align: a.align[d] });
      for (let d of s) a.rows.push(Os(d, a.header.length).map((u, b) => ({ text: u, tokens: this.lexer.inline(u), header: !1, align: a.align[b] })));
      return a;
    }
  }
  lheading(n) {
    let e = this.rules.block.lheading.exec(n);
    if (e) {
      let t = e[1].trim();
      return { type: "heading", raw: ft(e[0], `
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
      if (!this.options.pedantic && Ns(n, e[1], t, this.rules)) return;
      let r = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let d = ft(r.slice(0, -1), "\\");
        if ((r.length - d.length) % 2 === 0) return;
      } else {
        let d = Rl(e[2], "()");
        if (d === -2) return;
        if (d > -1) {
          let u = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + d;
          e[2] = e[2].substring(0, d), e[0] = e[0].substring(0, u).trim(), e[3] = "";
        }
      }
      let s = e[2], a = "";
      if (this.options.pedantic) {
        let d = this.rules.other.pedanticHrefTitle.exec(s);
        d && (s = d[1], a = d[3]);
      } else a = e[3] ? e[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? s = s.slice(1) : s = s.slice(1, -1)), Ds(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: a && a.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      let r = t[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Ns(n, t[1], r, this.rules)) return;
      let s = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), a = e[qn(s)];
      if (!a) {
        let d = t[0].charAt(0);
        return { type: "text", raw: d, text: d };
      }
      return Ds(t, a, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...r[0]].length - 1, a, d, u = s, b = 0, _ = r[0][0], S = t === _, E = _ === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (E.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = E.exec(e)) !== null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
        if (d = [...a].length, r[3] || r[4]) {
          u += d;
          continue;
        } else if (r[5] || r[6]) {
          if (s % 3 && !((s + d) % 3)) {
            b += d;
            continue;
          }
          if (S) break;
        }
        if (u -= d, u > 0) continue;
        d = Math.min(d, d + u + b);
        let D = [...r[0]][0].length, F = n.slice(0, s + r.index + D + d);
        if (Math.min(s, d) % 2) {
          let K = F.slice(1, -1);
          return { type: "em", raw: F, text: K, tokens: this.lexer.inlineTokens(K) };
        }
        let L = F.slice(2, -2);
        return { type: "strong", raw: F, text: L, tokens: this.lexer.inlineTokens(L) };
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
      let s = [...r[0]].length - 1, a, d, u = s, b = this.rules.inline.delRDelim;
      for (b.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = b.exec(e)) !== null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a || (d = [...a].length, d !== s)) continue;
        if (r[3] || r[4]) {
          u += d;
          continue;
        }
        if (u -= d, u > 0) continue;
        d = Math.min(d, d + u);
        let _ = [...r[0]][0].length, S = n.slice(0, s + r.index + _ + d), E = S.slice(s, -s);
        return { type: "del", raw: S, text: E, tokens: this.lexer.inlineTokens(E) };
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
      return { type: "text", raw: e[0], text: t ? e[0] : $l(e[0]), escaped: t };
    }
  }
}, qe = class us {
  constructor(e) {
    re(this, "tokens");
    re(this, "options");
    re(this, "state");
    re(this, "inlineQueue");
    re(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Rt, this.options.tokenizer = this.options.tokenizer || new Gn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, linkEmitted: !1, top: !0 };
    let t = { other: we, block: Fn.normal, inline: pn.normal };
    this.options.pedantic ? (t.block = Fn.pedantic, t.inline = pn.pedantic) : this.options.gfm && (t.block = Fn.gfm, this.options.breaks ? t.inline = pn.breaks : t.inline = pn.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: Fn, inline: pn };
  }
  static lex(e, t) {
    return new us(t).lex(e);
  }
  static lexInline(e, t) {
    return new us(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(we.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(we.tabCharGlobal, "    ").replace(we.spaceLine, ""));
    let s = 1 / 0;
    for (; e; ) {
      if (e.length < s) s = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      let a;
      if (this.options.extensions?.block?.some((u) => (a = u.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), !0) : !1)) continue;
      if (a = this.tokenizer.space(e)) {
        e = e.substring(a.raw.length);
        let u = t.at(-1);
        a.raw.length === 1 && u !== void 0 ? u.raw += `
` : t.push(a);
        continue;
      }
      if (a = this.tokenizer.code(e)) {
        e = e.substring(a.raw.length);
        let u = t.at(-1);
        u?.type === "paragraph" || u?.type === "text" ? (u.raw += (u.raw.endsWith(`
`) ? "" : `
`) + a.raw, u.text += `
` + a.text, this.inlineQueue.at(-1).src = u.text) : t.push(a);
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
        let u = t.at(-1);
        u?.type === "paragraph" || u?.type === "text" ? (u.raw += (u.raw.endsWith(`
`) ? "" : `
`) + a.raw, u.text += `
` + a.raw, this.inlineQueue.at(-1).src = u.text) : this.tokens.links[a.tag] || (this.tokens.links[a.tag] = { href: a.href, title: a.title }, t.push(a));
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
      let d = e;
      if (this.options.extensions?.startBlock) {
        let u = 1 / 0, b = e.slice(1), _;
        this.options.extensions.startBlock.forEach((S) => {
          _ = S.call({ lexer: this }, b), typeof _ == "number" && _ >= 0 && (u = Math.min(u, _));
        }), u < 1 / 0 && u >= 0 && (d = e.substring(0, u + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(d))) {
        let u = t.at(-1);
        r && u?.type === "paragraph" ? (u.raw += (u.raw.endsWith(`
`) ? "" : `
`) + a.raw, u.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : t.push(a), r = d.length !== e.length, e = e.substring(a.raw.length);
        continue;
      }
      if (a = this.tokenizer.text(e)) {
        e = e.substring(a.raw.length);
        let u = t.at(-1);
        u?.type === "text" ? (u.raw += (u.raw.endsWith(`
`) ? "" : `
`) + a.raw, u.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : t.push(a);
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
      if (!(s.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, qn(s.slice(a + 1, -1)))) && !(a > 1 && this.linkInText(s.slice(1, a - 1)))) return !0;
    }
    return !1;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let r = e;
    if (this.tokens.links && e.includes("[")) {
      let u = this.tokenizer.rules.inline.reflinkSearch, b = (_) => {
        let S = _.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, qn(_.slice(S + 1, -1)))) return _;
        if (S > 1 && _.charAt(0) !== "!") {
          let E = _.slice(1, S - 1);
          if (this.linkInText(E)) return "[" + E.replace(u, b) + "][" + "a".repeat(_.length - S - 2) + "]";
        }
        return "[" + "a".repeat(_.length - 2) + "]";
      };
      r = r.replace(u, b);
    }
    r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (u) => "+".repeat(u.length)), r = r.replace(this.tokenizer.rules.inline.blockSkip, (u, b, _) => {
      let S = _ ? _.length : 0;
      return u.slice(0, S) + "[" + "a".repeat(u.length - S - 2) + "]";
    }), r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let s = !1, a = "", d = 1 / 0;
    for (; e; ) {
      if (e.length < d) d = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      s || (a = ""), s = !1;
      let u;
      if (this.options.extensions?.inline?.some((_) => (u = _.call({ lexer: this }, e, t)) ? (e = e.substring(u.raw.length), t.push(u), !0) : !1)) continue;
      if (u = this.tokenizer.escape(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.tag(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.link(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(u.raw.length);
        let _ = t.at(-1);
        u.type === "text" && _?.type === "text" ? (_.raw += u.raw, _.text += u.text) : t.push(u);
        continue;
      }
      if (u = this.tokenizer.emStrong(e, r, a)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.codespan(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.br(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.del(e, r, a)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (u = this.tokenizer.autolink(e)) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      if (!this.state.inLink && (u = this.tokenizer.url(e))) {
        e = e.substring(u.raw.length), t.push(u);
        continue;
      }
      let b = e;
      if (this.options.extensions?.startInline) {
        let _ = 1 / 0, S = e.slice(1), E;
        this.options.extensions.startInline.forEach((D) => {
          E = D.call({ lexer: this }, S), typeof E == "number" && E >= 0 && (_ = Math.min(_, E));
        }), _ < 1 / 0 && _ >= 0 && (b = e.substring(0, _ + 1));
      }
      if (u = this.tokenizer.inlineText(b)) {
        e = e.substring(u.raw.length), u.raw.slice(-1) !== "_" && (a = u.raw.slice(-1)), s = !0;
        let _ = t.at(-1);
        _?.type === "text" ? (_.raw += u.raw, _.text += u.text) : t.push(u);
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
}, Yn = class {
  constructor(n) {
    re(this, "options");
    re(this, "parser");
    this.options = n || Rt;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    let r = (e || "").match(we.notSpaceStart)?.[0], s = n ? n.replace(we.endingNewline, "") + `
` : "";
    return r ? '<pre><code class="language-' + Me(r) + '">' + (t ? s : Me(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : Me(s, !0)) + `</code></pre>
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
    for (let d = 0; d < n.items.length; d++) {
      let u = n.items[d];
      r += this.listitem(u);
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
      for (let d = 0; d < a.length; d++) t += this.tablecell(a[d]);
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
    return `<code>${Me(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, text: t, tokens: r, autolink: s }) {
    let a = s ? Me(t, !0) : this.parser.parseInline(r), d = Is(n);
    if (d === null) return a;
    n = Me(d, s);
    let u = '<a href="' + n + '"';
    return e && (u += ' title="' + Me(e) + '"'), u += ">" + a + "</a>", u;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    let s = Is(n);
    if (s === null) return Me(t);
    n = s;
    let a = `<img src="${Me(n)}" alt="${Me(t)}"`;
    return e && (a += ` title="${Me(e)}"`), a += ">", a;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : Me(n.text);
  }
}, ys = class {
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
}, Ge = class cs {
  constructor(e) {
    re(this, "options");
    re(this, "renderer");
    re(this, "textRenderer");
    this.options = e || Rt, this.options.renderer = this.options.renderer || new Yn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ys();
  }
  static parse(e, t) {
    return new cs(t).parse(e);
  }
  static parseInline(e, t) {
    return new cs(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let r = 0; r < e.length; r++) {
      let s = e[r];
      if (this.options.extensions?.renderers?.[s.type]) {
        let d = s, u = this.options.extensions.renderers[d.type].call({ parser: this }, d);
        if (u !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(d.type)) {
          t += u || "";
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
          let d = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(d), "";
          throw new Error(d);
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
        let u = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (u !== !1 || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          r += u || "";
          continue;
        }
      }
      let d = a;
      switch (d.type) {
        case "escape": {
          r += t.text(d);
          break;
        }
        case "html": {
          r += t.html(d);
          break;
        }
        case "link": {
          r += t.link(d);
          break;
        }
        case "image": {
          r += t.image(d);
          break;
        }
        case "checkbox": {
          r += t.checkbox(d);
          break;
        }
        case "strong": {
          r += t.strong(d);
          break;
        }
        case "em": {
          r += t.em(d);
          break;
        }
        case "codespan": {
          r += t.codespan(d);
          break;
        }
        case "br": {
          r += t.br(d);
          break;
        }
        case "del": {
          r += t.del(d);
          break;
        }
        case "text": {
          r += t.text(d);
          break;
        }
        default: {
          let u = 'Token with "' + d.type + '" type was not found.';
          if (this.options.silent) return console.error(u), "";
          throw new Error(u);
        }
      }
    }
    return r;
  }
}, jn, kn = (jn = class {
  constructor(n) {
    re(this, "options");
    re(this, "block");
    this.options = n || Rt;
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
    return n ? qe.lex : qe.lexInline;
  }
  provideParser(n = this.block) {
    return n ? Ge.parse : Ge.parseInline;
  }
}, re(jn, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), re(jn, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), jn), Ll = class {
  constructor(...n) {
    re(this, "defaults", hs());
    re(this, "options", this.setOptions);
    re(this, "parse", this.parseMarkdown(!0));
    re(this, "parseInline", this.parseMarkdown(!1));
    re(this, "Parser", Ge);
    re(this, "Renderer", Yn);
    re(this, "TextRenderer", ys);
    re(this, "Lexer", qe);
    re(this, "Tokenizer", Gn);
    re(this, "Hooks", kn);
    this.use(...n);
  }
  walkTokens(n, e) {
    let t = [];
    for (let r of n) switch (t = t.concat(e.call(this, r)), r.type) {
      case "table": {
        let s = r;
        for (let a of s.header) t = t.concat(this.walkTokens(a.tokens, e));
        for (let a of s.rows) for (let d of a) t = t.concat(this.walkTokens(d.tokens, e));
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
          let d = s[a].flat(1 / 0);
          t = t.concat(this.walkTokens(d, e));
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
          a ? e.renderers[s.name] = function(...d) {
            let u = s.renderer.apply(this, d);
            return u === !1 && (u = a.apply(this, d)), u;
          } : e.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = e[s.level];
          a ? a.unshift(s.tokenizer) : e[s.level] = [s.tokenizer], s.start && (s.level === "block" ? e.startBlock ? e.startBlock.push(s.start) : e.startBlock = [s.start] : s.level === "inline" && (e.startInline ? e.startInline.push(s.start) : e.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (e.childTokens[s.name] = s.childTokens);
      }), r.extensions = e), t.renderer) {
        let s = this.defaults.renderer || new Yn(this.defaults);
        for (let a in t.renderer) {
          if (!(a in s)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let d = a, u = t.renderer[d], b = s[d];
          s[d] = (..._) => {
            let S = u.apply(s, _);
            return S === !1 && (S = b.apply(s, _)), S || "";
          };
        }
        r.renderer = s;
      }
      if (t.tokenizer) {
        let s = this.defaults.tokenizer || new Gn(this.defaults);
        for (let a in t.tokenizer) {
          if (!(a in s)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let d = a, u = t.tokenizer[d], b = s[d];
          s[d] = (..._) => {
            let S = u.apply(s, _);
            return S === !1 && (S = b.apply(s, _)), S;
          };
        }
        r.tokenizer = s;
      }
      if (t.hooks) {
        let s = this.defaults.hooks || new kn();
        for (let a in t.hooks) {
          if (!(a in s)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let d = a, u = t.hooks[d], b = s[d];
          kn.passThroughHooks.has(a) ? s[d] = (_) => {
            if (this.defaults.async && kn.passThroughHooksRespectAsync.has(a)) return (async () => {
              let E = await u.call(s, _);
              return b.call(s, E);
            })();
            let S = u.call(s, _);
            return b.call(s, S);
          } : s[d] = (..._) => {
            if (this.defaults.async) return (async () => {
              let E = await u.apply(s, _);
              return E === !1 && (E = await b.apply(s, _)), E;
            })();
            let S = u.apply(s, _);
            return S === !1 && (S = b.apply(s, _)), S;
          };
        }
        r.hooks = s;
      }
      if (t.walkTokens) {
        let s = this.defaults.walkTokens, a = t.walkTokens;
        r.walkTokens = function(d) {
          let u = [];
          return u.push(a.call(this, d)), s && (u = u.concat(s.call(this, d))), u;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return qe.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return Ge.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let r = { ...t }, s = { ...this.defaults, ...r }, a = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && r.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = n), s.async) return (async () => {
        let d = s.hooks ? await s.hooks.preprocess(e) : e, u = await (s.hooks ? await s.hooks.provideLexer(n) : n ? qe.lex : qe.lexInline)(d, s), b = s.hooks ? await s.hooks.processAllTokens(u) : u;
        s.walkTokens && await Promise.all(this.walkTokens(b, s.walkTokens));
        let _ = await (s.hooks ? await s.hooks.provideParser(n) : n ? Ge.parse : Ge.parseInline)(b, s);
        return s.hooks ? await s.hooks.postprocess(_) : _;
      })().catch(a);
      try {
        s.hooks && (e = s.hooks.preprocess(e));
        let d = (s.hooks ? s.hooks.provideLexer(n) : n ? qe.lex : qe.lexInline)(e, s);
        s.hooks && (d = s.hooks.processAllTokens(d)), s.walkTokens && this.walkTokens(d, s.walkTokens);
        let u = (s.hooks ? s.hooks.provideParser(n) : n ? Ge.parse : Ge.parseInline)(d, s);
        return s.hooks && (u = s.hooks.postprocess(u)), u;
      } catch (d) {
        return a(d);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        let r = "<p>An error occurred:</p><pre>" + Me(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, $t = new Ll();
function le(n, e) {
  return $t.parse(n, e);
}
le.options = le.setOptions = function(n) {
  return $t.setOptions(n), le.defaults = $t.defaults, nr(le.defaults), le;
};
le.getDefaults = hs;
le.defaults = Rt;
function Il(...n) {
  return $t.use(...n), le.defaults = $t.defaults, nr(le.defaults), le;
}
le.use = Il;
le.walkTokens = function(n, e) {
  return $t.walkTokens(n, e);
};
le.parseInline = $t.parseInline;
le.Parser = Ge;
le.parser = Ge.parse;
le.Renderer = Yn;
le.TextRenderer = ys;
le.Lexer = qe;
le.lexer = qe.lex;
le.Tokenizer = Gn;
le.Hooks = kn;
le.parse = le;
le.options;
le.setOptions;
le.walkTokens;
le.parseInline;
Ge.parse;
qe.lex;
/*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE */
function zs(n, e) {
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
    var r, s, a, d, u = [], b = !0, _ = !1;
    try {
      if (a = (t = t.call(n)).next, e !== 0) for (; !(b = (r = a.call(t)).done) && (u.push(r.value), u.length !== e); b = !0) ;
    } catch (S) {
      _ = !0, s = S;
    } finally {
      try {
        if (!b && t.return != null && (d = t.return(), Object(d) !== d)) return;
      } finally {
        if (_) throw s;
      }
    }
    return u;
  }
}
function Ml() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
function Dl(n, e) {
  return Ol(n) || Pl(n, e) || Nl(n, e) || Ml();
}
function Nl(n, e) {
  if (n) {
    if (typeof n == "string") return zs(n, e);
    var t = {}.toString.call(n).slice(8, -1);
    return t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set" ? Array.from(n) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? zs(n, e) : void 0;
  }
}
const dr = Object.entries, Us = Object.setPrototypeOf, zl = Object.isFrozen, Ul = Object.getPrototypeOf, Fl = Object.getOwnPropertyDescriptor;
let ye = Object.freeze, _e = Object.seal, Vt = Object.create, pr = typeof Reflect < "u" && Reflect, ds = pr.apply, ps = pr.construct;
ye || (ye = function(e) {
  return e;
});
_e || (_e = function(e) {
  return e;
});
ds || (ds = function(e, t) {
  for (var r = arguments.length, s = new Array(r > 2 ? r - 2 : 0), a = 2; a < r; a++) s[a - 2] = arguments[a];
  return e.apply(t, s);
});
ps || (ps = function(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) r[s - 1] = arguments[s];
  return new e(...r);
});
const Tt = ke(Array.prototype.forEach), Bl = ke(Array.prototype.lastIndexOf), Fs = ke(Array.prototype.pop), hn = ke(Array.prototype.push), Hl = ke(Array.prototype.splice), Yt = Array.isArray, bn = ke(String.prototype.toLowerCase), ns = ke(String.prototype.toString), Bs = ke(String.prototype.match), fn = ke(String.prototype.replace), Hs = ke(String.prototype.indexOf), jl = ke(String.prototype.trim), Wl = ke(Number.prototype.toString), Vl = ke(Boolean.prototype.toString), js = typeof BigInt > "u" ? null : ke(BigInt.prototype.toString), Ws = typeof Symbol > "u" ? null : ke(Symbol.prototype.toString), Re = ke(Object.prototype.hasOwnProperty), gn = ke(Object.prototype.toString), Se = ke(RegExp.prototype.test), gt = ql(TypeError);
function ke(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) r[s - 1] = arguments[s];
    return ds(n, e, r);
  };
}
function ql(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
    return ps(n, t);
  };
}
function Z(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : bn;
  if (Us && Us(n, null), !Yt(e)) return n;
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
  for (let e = 0; e < n.length; e++) Re(n, e) || (n[e] = null);
  return n;
}
function De(n) {
  const e = Vt(null);
  for (const r of dr(n)) {
    var t = Dl(r, 2);
    const s = t[0], a = t[1];
    Re(n, s) && (Yt(a) ? e[s] = Gl(a) : a && typeof a == "object" && a.constructor === Object ? e[s] = De(a) : e[s] = a);
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
      return js ? js(n) : "0";
    case "symbol":
      return Ws ? Ws(n) : "Symbol()";
    case "undefined":
      return gn(n);
    case "function":
    case "object": {
      if (n === null) return gn(n);
      const e = n, t = Fe(e, "toString");
      if (typeof t == "function") {
        const r = t(e);
        return typeof r == "string" ? r : gn(r);
      }
      return gn(n);
    }
    default:
      return gn(n);
  }
}
function Fe(n, e) {
  for (; n !== null; ) {
    const r = Fl(n, e);
    if (r) {
      if (r.get) return ke(r.get);
      if (typeof r.value == "function") return ke(r.value);
    }
    n = Ul(n);
  }
  function t() {
    return null;
  }
  return t;
}
function Zl(n) {
  try {
    return Se(n, ""), !0;
  } catch {
    return !1;
  }
}
const Vs = ye([
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
]), ss = ye([
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
]), rs = ye([
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
]), Kl = ye([
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
]), ls = ye([
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
]), Xl = ye([
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
]), qs = ye(["#text"]), Gs = ye([
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
]), as = ye([
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
]), Ys = ye([
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
]), Bn = ye([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Ql = _e(/{{[\w\W]*|^[\w\W]*}}/g), Jl = _e(/<%[\w\W]*|^[\w\W]*%>/g), ea = _e(/\${[\w\W]*/g), ta = _e(/^data-[\-\w.\u00B7-\uFFFF]+$/), na = _e(/^aria-[\-\w]+$/), Zs = _e(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), sa = _e(/^(?:\w+script|data):/i), ra = _e(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), la = _e(/^html$/i), aa = _e(/^[a-z][.\w]*(-[.\w]+)+$/i), Ks = _e(/<[/\w!]/g), Xs = _e(/<[/\w]/g), oa = _e(/<\/no(script|embed|frames)/i), ia = _e(/\/>/i), Pe = {
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
}, hr = [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
], ua = ye(Z({}, hr)), ca = function() {
  const n = {};
  return Tt(hr, (e) => {
    n[e] = _e(new RegExp("</" + e + "(?=[\\t\\n\\f\\r />])", "i"));
  }), ye(n);
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
      createHTML(d) {
        return d;
      },
      createScriptURL(d) {
        return d;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + a + " could not be created."), null;
  }
}, Qs = function() {
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
}, mt = function(e, t, r, s) {
  return Re(e, t) && Yt(e[t]) ? Z(s.base ? De(s.base) : {}, e[t], s.transform) : r;
}, os = function(e, t, r) {
  const s = Re(e, t) ? e[t] : void 0;
  return s && typeof s == "object" ? De(s) : r();
};
function fr() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : da();
  const e = (x) => fr(x);
  if (e.version = "3.4.16", e.removed = [], !n || !n.document || n.document.nodeType !== Pe.document || !n.Element)
    return e.isSupported = !1, e;
  let t = n.document;
  const r = t, s = r.currentScript;
  n.DocumentFragment;
  const a = n.HTMLTemplateElement, d = n.Node, u = n.Element, b = n.NodeFilter;
  n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const _ = n.DOMParser, S = n.trustedTypes, E = u.prototype, D = Fe(E, "cloneNode"), F = Fe(E, "remove"), L = Fe(E, "removeAttributeNode"), K = Fe(E, "nextSibling"), z = Fe(E, "childNodes"), Y = Fe(E, "parentNode"), ae = Fe(E, "shadowRoot"), C = Fe(E, "attributes"), U = d && d.prototype ? Fe(d.prototype, "nodeType") : null, N = d && d.prototype ? Fe(d.prototype, "nodeName") : null, ce = d && d.prototype ? Fe(d.prototype, "ownerDocument") : null, J = function(l) {
    return U ? U(l) : l.nodeType;
  }, B = function(l) {
    return N ? N(l) : l.nodeName;
  };
  if (typeof a == "function") {
    const x = t.createElement("template");
    x.content && x.content.ownerDocument && (t = x.content.ownerDocument);
  }
  let y, f = "", v, T = !1, R = 0;
  const P = function() {
    if (R > 0) throw gt('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, se = function(l) {
    P(), R++;
    try {
      return y.createHTML(l);
    } finally {
      R--;
    }
  }, j = function(l) {
    P(), R++;
    try {
      return y.createScriptURL(l);
    } finally {
      R--;
    }
  }, ge = function() {
    return T || (v = pa(S, s), T = !0), v;
  }, He = t, vt = He.implementation, ut = He.createNodeIterator, Sn = He.createDocumentFragment, Xt = He.getElementsByTagName, Ct = r.importNode;
  let X = Qs();
  e.isSupported = typeof dr == "function" && typeof Y == "function" && vt && vt.createHTMLDocument !== void 0;
  const ct = Ql, Tn = Jl, An = ea, Lt = ta, Kn = na, Xn = sa, Qt = ra, kt = aa;
  let bt = Zs, ee = null;
  const Ce = Z({}, [
    ...Vs,
    ...ss,
    ...rs,
    ...ls,
    ...qs
  ]);
  let oe = null;
  const It = Z({}, [
    ...Gs,
    ...as,
    ...Ys,
    ...Bn
  ]);
  let Le = Object.seal(Vt(null, {
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
  })), Ye = null, Jt = null;
  const Ze = Object.seal(Vt(null, {
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
  let En = !0, Ke = !0, $n = !1, Ot = !0, je = !1, st = !0, W = !1, Pt = !1, yt = null, _t = null, en = !1, rt = !1, wt = !1, te = !1, xe = !0, Xe = !1;
  const dt = "user-content-";
  let ze = !0, me = !1, We = {}, pe = null;
  const pt = Z({}, [
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
  let tn = null;
  const nn = Z({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let fe = null;
  const xt = Z({}, [
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
  ]), Mt = "http://www.w3.org/1998/Math/MathML", Ee = "http://www.w3.org/2000/svg", Te = "http://www.w3.org/1999/xhtml";
  let Qe = Te, sn = !1, Dt = null;
  const Rn = Z({}, [
    Mt,
    Ee,
    Te
  ], ns), Cn = ye([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let rn = Z({}, Cn);
  const ln = ye(["annotation-xml"]);
  let an = Z({}, ln);
  const Nt = Z({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let Ie = null;
  const ht = ["application/xhtml+xml", "text/html"], on = "text/html";
  let de = null, lt = null;
  const Ln = t.createElement("form"), In = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, un = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (lt && lt === l) return;
    (!l || typeof l != "object") && (l = {}), l = De(l), Ie = ht.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? on : l.PARSER_MEDIA_TYPE, de = Ie === "application/xhtml+xml" ? ns : bn, ee = mt(l, "ALLOWED_TAGS", Ce, { transform: de }), oe = mt(l, "ALLOWED_ATTR", It, { transform: de }), Dt = mt(l, "ALLOWED_NAMESPACES", Rn, { transform: ns }), fe = mt(l, "ADD_URI_SAFE_ATTR", xt, {
      transform: de,
      base: xt
    }), tn = mt(l, "ADD_DATA_URI_TAGS", nn, {
      transform: de,
      base: nn
    }), pe = mt(l, "FORBID_CONTENTS", pt, { transform: de }), Ye = mt(l, "FORBID_TAGS", De({}), { transform: de }), Jt = mt(l, "FORBID_ATTR", De({}), { transform: de }), We = Re(l, "USE_PROFILES") ? l.USE_PROFILES && typeof l.USE_PROFILES == "object" ? De(l.USE_PROFILES) : l.USE_PROFILES : !1, En = l.ALLOW_ARIA_ATTR !== !1, Ke = l.ALLOW_DATA_ATTR !== !1, $n = l.ALLOW_UNKNOWN_PROTOCOLS || !1, Ot = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, je = l.SAFE_FOR_TEMPLATES || !1, st = l.SAFE_FOR_XML !== !1, W = l.WHOLE_DOCUMENT || !1, rt = l.RETURN_DOM || !1, wt = l.RETURN_DOM_FRAGMENT || !1, te = l.RETURN_TRUSTED_TYPE || !1, en = l.FORCE_BODY || !1, xe = l.SANITIZE_DOM !== !1, Xe = l.SANITIZE_NAMED_PROPS || !1, ze = l.KEEP_CONTENT !== !1, me = l.IN_PLACE || !1, bt = Zl(l.ALLOWED_URI_REGEXP) ? l.ALLOWED_URI_REGEXP : Zs, Qe = typeof l.NAMESPACE == "string" ? l.NAMESPACE : Te, rn = os(l, "MATHML_TEXT_INTEGRATION_POINTS", () => Z({}, Cn)), an = os(l, "HTML_INTEGRATION_POINTS", () => Z({}, ln));
    const h = os(l, "CUSTOM_ELEMENT_HANDLING", () => Vt(null));
    if (Le = Vt(null), Re(h, "tagNameCheck") && In(h.tagNameCheck) && (Le.tagNameCheck = h.tagNameCheck), Re(h, "attributeNameCheck") && In(h.attributeNameCheck) && (Le.attributeNameCheck = h.attributeNameCheck), Re(h, "allowCustomizedBuiltInElements") && typeof h.allowCustomizedBuiltInElements == "boolean" && (Le.allowCustomizedBuiltInElements = h.allowCustomizedBuiltInElements), _e(Le), je && (Ke = !1), wt && (rt = !0), We && (ee = Z({}, qs), oe = Vt(null), We.html === !0 && (Z(ee, Vs), Z(oe, Gs)), We.svg === !0 && (Z(ee, ss), Z(oe, as), Z(oe, Bn)), We.svgFilters === !0 && (Z(ee, rs), Z(oe, as), Z(oe, Bn)), We.mathMl === !0 && (Z(ee, ls), Z(oe, Ys), Z(oe, Bn))), Ze.tagCheck = null, Ze.attributeCheck = null, Re(l, "ADD_TAGS") && (typeof l.ADD_TAGS == "function" ? Ze.tagCheck = l.ADD_TAGS : Yt(l.ADD_TAGS) && (ee === Ce && (ee = De(ee)), Z(ee, l.ADD_TAGS, de))), Re(l, "ADD_ATTR") && (typeof l.ADD_ATTR == "function" ? Ze.attributeCheck = l.ADD_ATTR : Yt(l.ADD_ATTR) && (oe === It && (oe = De(oe)), Z(oe, l.ADD_ATTR, de))), Re(l, "ADD_FORBID_CONTENTS") && Yt(l.ADD_FORBID_CONTENTS) && (pe === pt && (pe = De(pe)), Z(pe, l.ADD_FORBID_CONTENTS, de)), ze && (ee["#text"] = !0), W && Z(ee, [
      "html",
      "head",
      "body"
    ]), ee.table && (Z(ee, ["tbody"]), delete Ye.tbody), l.TRUSTED_TYPES_POLICY) {
      if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function") throw gt('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw gt('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const w = y;
      y = l.TRUSTED_TYPES_POLICY;
      try {
        f = se("");
      } catch (A) {
        throw y = w, A;
      }
    } else l.TRUSTED_TYPES_POLICY === null ? (y = void 0, f = "") : (y === void 0 && (y = ge()), y && typeof f == "string" && (f = se("")));
    ye && ye(l), lt = l;
  }, zt = Z({}, [
    ...ss,
    ...rs,
    ...Kl
  ]), Je = Z({}, [...ls, ...Xl]), On = function(l, h, w) {
    return h.namespaceURI === Te ? l === "svg" : h.namespaceURI === Mt ? l === "svg" && (w === "annotation-xml" || rn[w]) : !!zt[l];
  }, Pn = function(l, h, w) {
    return h.namespaceURI === Te ? l === "math" : h.namespaceURI === Ee ? l === "math" && an[w] : !!Je[l];
  }, Qn = function(l, h, w) {
    return h.namespaceURI === Ee && !an[w] || h.namespaceURI === Mt && !rn[w] ? !1 : !Je[l] && (Nt[l] || !zt[l]);
  }, Mn = function(l) {
    let h = Y(l);
    (!h || !h.tagName) && (h = {
      namespaceURI: Qe,
      tagName: "template"
    });
    const w = bn(l.tagName), A = bn(h.tagName);
    return Dt[l.namespaceURI] ? l.namespaceURI === Ee ? On(w, h, A) : l.namespaceURI === Mt ? Pn(w, h, A) : l.namespaceURI === Te ? Qn(w, h, A) : !!(Ie === "application/xhtml+xml" && Dt[l.namespaceURI]) : !1;
  }, Ve = function(l) {
    hn(e.removed, { element: l });
    try {
      Y(l).removeChild(l);
    } catch {
      if (F(l), !Y(l)) throw gt("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, Dn = function(l, h, w) {
    try {
      L(l, h);
    } catch {
      try {
        l.removeAttribute(w);
      } catch {
      }
    }
  }, St = function(l) {
    i(l);
    const h = z(l);
    if (h) {
      const A = [];
      Tt(h, (M) => {
        hn(A, M);
      }), Tt(A, (M) => {
        try {
          F(M);
        } catch {
        }
      });
    }
    const w = C(l);
    if (w) for (let A = w.length - 1; A >= 0; --A) {
      const M = w[A], q = M && M.name;
      typeof q == "string" && Dn(l, M, q);
    }
  }, at = function(l, h, w) {
    if (!w) try {
      w = h.getAttributeNode(l);
    } catch {
      w = null;
    }
    hn(e.removed, {
      attribute: w || null,
      from: h
    });
    try {
      w ? L(h, w) : h.removeAttribute(l);
    } catch {
      try {
        h.removeAttribute(l);
      } catch {
      }
    }
    if (l === "is")
      if (rt || wt) try {
        Ve(h);
      } catch {
      }
      else try {
        h.setAttribute(l, "");
      } catch {
      }
  }, cn = function(l) {
    const h = C(l);
    if (h)
      for (let w = h.length - 1; w >= 0; --w) {
        const A = h[w], M = A && A.name;
        typeof M != "string" || oe[de(M)] || Dn(l, A, M);
      }
  }, i = function(l) {
    const h = [l];
    for (; h.length > 0; ) {
      const w = h.pop();
      J(w) === Pe.element && cn(w);
      const A = z(w);
      if (A) for (let M = A.length - 1; M >= 0; --M) h.push(A[M]);
    }
  }, p = function(l, h) {
    return st ? l === "patchsrc" ? !0 : l === "for" && h !== "label" && h !== "output" : !1;
  }, c = function(l) {
    if (!st) return;
    const h = [l];
    for (; h.length > 0; ) {
      const w = h.pop(), A = J(w);
      if (A === Pe.processingInstruction || A === Pe.comment && Se(Xs, w.data)) {
        try {
          F(w);
        } catch {
        }
        continue;
      }
      if (A === Pe.element) {
        const q = w, G = de(B(w));
        try {
          q.hasAttribute && q.hasAttribute("patchsrc") && q.removeAttribute("patchsrc"), q.hasAttribute && q.hasAttribute("for") && p("for", G) && q.removeAttribute("for");
        } catch {
        }
      }
      const M = z(w);
      if (M) for (let q = M.length - 1; q >= 0; --q) h.push(M[q]);
    }
  }, $ = function(l) {
    let h = null, w = null;
    if (en) l = "<remove></remove>" + l;
    else {
      const q = Bs(l, /^[\r\n\t ]+/);
      w = q && q[0];
    }
    Ie === "application/xhtml+xml" && Qe === Te && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const A = y ? se(l) : l;
    if (Qe === Te) try {
      h = new _().parseFromString(A, Ie);
    } catch {
    }
    if (!h || !h.documentElement) {
      h = vt.createDocument(Qe, "template", null);
      try {
        h.documentElement.innerHTML = sn ? f : A;
      } catch {
      }
    }
    const M = h.body || h.documentElement;
    return l && w && M.insertBefore(t.createTextNode(w), M.childNodes[0] || null), Qe === Te ? Xt.call(h, W ? "html" : "body")[0] : W ? h.documentElement : M;
  }, Q = function(l) {
    const h = ce ? ce(l) : l.ownerDocument;
    return ut.call(h || l, l, b.SHOW_ELEMENT | b.SHOW_COMMENT | b.SHOW_TEXT | b.SHOW_PROCESSING_INSTRUCTION | b.SHOW_CDATA_SECTION, null);
  }, et = function(l) {
    return l = fn(l, ct, " "), l = fn(l, Tn, " "), l = fn(l, An, " "), l;
  }, Jn = function(l) {
    var h;
    l.normalize();
    const w = ce ? ce(l) : l.ownerDocument, A = ut.call(w || l, l, b.SHOW_TEXT | b.SHOW_COMMENT | b.SHOW_CDATA_SECTION | b.SHOW_PROCESSING_INSTRUCTION, null);
    let M = A.nextNode();
    for (; M; )
      M.data = et(M.data), M = A.nextNode();
    const q = (h = l.querySelectorAll) === null || h === void 0 ? void 0 : h.call(l, "template");
    q && Tt(q, (G) => {
      Ut(G.content) && Jn(G.content);
    });
  }, Nn = function(l) {
    const h = N ? N(l) : null;
    return typeof h != "string" || de(h) !== "form" ? !1 : typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || l.attributes !== C(l) || typeof l.removeAttribute != "function" || typeof l.removeAttributeNode != "function" || typeof l.getAttributeNode != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function" || l.nodeType !== U(l) || l.childNodes !== z(l);
  }, Ut = function(l) {
    if (!U || typeof l != "object" || l === null) return !1;
    try {
      return U(l) === Pe.documentFragment;
    } catch {
      return !1;
    }
  }, dn = function(l) {
    if (!U || typeof l != "object" || l === null) return !1;
    try {
      return typeof U(l) == "number";
    } catch {
      return !1;
    }
  };
  function tt(x, l, h) {
    x.length !== 0 && Tt(x, (w) => {
      w.call(e, l, h, lt);
    });
  }
  const kr = function(l, h) {
    return !!(st && l.hasChildNodes() && !dn(l.firstElementChild) && Se(Ks, l.textContent) && Se(Ks, l.innerHTML) || st && l.namespaceURI === Te && ua[h] && (dn(l.firstElementChild) || typeof l.textContent == "string" && Se(ca[h], l.textContent)) || l.nodeType === Pe.processingInstruction || st && l.nodeType === Pe.comment && Se(Xs, l.data));
  }, zn = function(l, h) {
    if (l instanceof RegExp) return Se(l, h);
    if (l instanceof Function) {
      for (var w = arguments.length, A = new Array(w > 2 ? w - 2 : 0), M = 2; M < w; M++) A[M - 2] = arguments[M];
      return !!l(h, ...A);
    }
    return !1;
  }, br = function(l, h, w) {
    if (!Ye[h] && Ts(h) && zn(Le.tagNameCheck, h)) return !1;
    if (ze && !pe[h]) {
      const A = Y(l), M = z(l);
      if (M && A) {
        const q = M.length;
        for (let G = q - 1; G >= 0; --G) {
          const he = l === w ? D(M[G], !0) : M[G];
          A.insertBefore(he, K(l));
        }
      }
    }
    return Ve(l), !0;
  }, ws = function(l, h, w, A) {
    return l.length === 0 ? h : h === w || h === A ? De(h) : h;
  }, Ft = function(l, h) {
    return l === h || Y(l) !== null ? !1 : (me && i(l), !0);
  }, xs = function(l, h) {
    if (tt(X.beforeSanitizeElements, l, null), Ft(l, h)) return !0;
    if (Nn(l))
      return Ve(l), !0;
    const w = de(B(l));
    if (ee = ws(X.uponSanitizeElement, ee, Ce, yt), tt(X.uponSanitizeElement, l, {
      tagName: w,
      allowedTags: ee
    }), Ft(l, h)) return !0;
    if (kr(l, w))
      return Ve(l), !0;
    if (Ye[w] || !(Ze.tagCheck instanceof Function && Ze.tagCheck(w)) && !ee[w]) {
      const A = br(l, w, h);
      return A === !1 && (tt(X.afterSanitizeElements, l, null), Ft(l, h)) ? !0 : A;
    }
    if (J(l) === Pe.element && !Mn(l) || (w === "noscript" || w === "noembed" || w === "noframes") && Se(oa, l.innerHTML))
      return Ve(l), !0;
    if (je && l.nodeType === Pe.text) {
      const A = et(l.textContent);
      l.textContent !== A && (hn(e.removed, { element: l.cloneNode() }), l.textContent = A);
    }
    return tt(X.afterSanitizeElements, l, null), Ft(l, h);
  }, Ss = function(l, h, w) {
    if (Jt[h] || p(h, l) || xe && (h === "id" || h === "name") && (w in t || w in Ln)) return !1;
    const A = oe[h] || Ze.attributeCheck instanceof Function && Ze.attributeCheck(h, l);
    return Ke && Se(Lt, h) || En && Se(Kn, h) ? !0 : A ? fe[h] || Se(bt, fn(w, Qt, "")) || (h === "src" || h === "xlink:href" || h === "href") && l !== "script" && Hs(w, "data:") === 0 && tn[l] || $n && !Se(Xn, fn(w, Qt, "")) ? !0 : !w : Ts(l) && zn(Le.tagNameCheck, l) && zn(Le.attributeNameCheck, h, l) || h === "is" && Le.allowCustomizedBuiltInElements && zn(Le.tagNameCheck, w);
  }, yr = Z({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), Ts = function(l) {
    return !yr[bn(l)] && Se(kt, l);
  }, _r = function(l, h, w, A) {
    if (y && typeof S == "object" && typeof S.getAttributeType == "function" && !w) switch (S.getAttributeType(l, h)) {
      case "TrustedHTML":
        return se(A);
      case "TrustedScriptURL":
        return j(A);
    }
    return A;
  }, wr = function(l, h, w, A) {
    try {
      return w ? l.setAttributeNS(w, h, A) : l.setAttribute(h, A), Nn(l) ? (Ve(l), !1) : !0;
    } catch {
      return at(h, l), !1;
    }
  }, As = function(l, h) {
    if (tt(X.beforeSanitizeAttributes, l, null), Ft(l, h)) return;
    const w = l.attributes;
    if (!w || Nn(l)) return;
    oe = ws(X.uponSanitizeAttribute, oe, It, _t);
    const A = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: oe,
      forceKeepAttr: void 0
    };
    let M = w.length;
    const q = de(l.nodeName);
    for (; M--; ) {
      const G = w[M], he = G.name, Ue = G.namespaceURI, Oe = G.value, Bt = de(he), ts = Oe;
      let Ae = he === "value" ? ts : jl(ts), Es = !1;
      if (A.attrName = Bt, A.attrValue = Ae, A.keepAttr = !0, A.forceKeepAttr = void 0, tt(X.uponSanitizeAttribute, l, A), Ae = A.attrValue, Xe && (Bt === "id" || Bt === "name") && Hs(Ae, dt) !== 0 && (at(he, l, G), Ae = dt + Ae, Es = !0), st && Se(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, Ae)) {
        at(he, l, G);
        continue;
      }
      if (Bt === "attributename" && Bs(Ae, "href")) {
        at(he, l, G);
        continue;
      }
      if (!A.forceKeepAttr) {
        if (!A.keepAttr) {
          at(he, l, G);
          continue;
        }
        if (!Ot && Se(ia, Ae)) {
          at(he, l, G);
          continue;
        }
        if (je && (Ae = et(Ae)), !Ss(q, Bt, Ae)) {
          at(he, l, G);
          continue;
        }
        Ae = _r(q, Bt, Ue, Ae), Ae !== ts && wr(l, he, Ue, Ae) && Es && Fs(e.removed);
      }
    }
    tt(X.afterSanitizeAttributes, l, null), Ft(l, h);
  }, Un = function(l) {
    let h = null;
    const w = Q(l);
    for (tt(X.beforeSanitizeShadowDOM, l, null); h = w.nextNode(); )
      if (tt(X.uponSanitizeShadowNode, h, null), xs(h, l), As(h, l), Ut(h.content) && Un(h.content), J(h) === Pe.element) {
        const A = ae(h);
        Ut(A) && (es(A), Un(A));
      }
    tt(X.afterSanitizeShadowDOM, l, null);
  }, es = function(l) {
    const h = [{
      node: l,
      shadow: null
    }];
    for (; h.length > 0; ) {
      const w = h.pop();
      if (w.shadow) {
        Un(w.shadow);
        continue;
      }
      const A = w.node, M = J(A) === Pe.element, q = z(A);
      if (q) for (let G = q.length - 1; G >= 0; --G) h.push({
        node: q[G],
        shadow: null
      });
      if (M) {
        const G = N ? N(A) : null;
        if (typeof G == "string" && de(G) === "template") {
          const he = A.content;
          Ut(he) && h.push({
            node: he,
            shadow: null
          });
        }
      }
      if (M) {
        const G = ae(A);
        Ut(G) && h.push({
          node: null,
          shadow: G
        }, {
          node: G,
          shadow: null
        });
      }
    }
  };
  return e.sanitize = function(x) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, h = null, w = null, A = null, M = null;
    if (sn = !x, sn && (x = "<!-->"), typeof x != "string" && !dn(x) && (x = Yl(x), typeof x != "string"))
      throw gt("dirty is not a string, aborting");
    if (!e.isSupported) return x;
    Pt ? (ee = yt, oe = _t) : un(l), (X.uponSanitizeElement.length > 0 || X.uponSanitizeAttribute.length > 0) && (ee = De(ee)), X.uponSanitizeAttribute.length > 0 && (oe = De(oe)), e.removed = [];
    const q = me && typeof x != "string" && dn(x);
    if (q) {
      c(x);
      const Ue = B(x);
      if (typeof Ue == "string") {
        const Oe = de(Ue);
        if (!ee[Oe] || Ye[Oe])
          throw St(x), gt("root node is forbidden and cannot be sanitized in-place");
      }
      if (Nn(x))
        throw St(x), gt("root node is clobbered and cannot be sanitized in-place");
      try {
        es(x);
      } catch (Oe) {
        throw St(x), Oe;
      }
    } else if (dn(x))
      h = $("<!---->"), w = h.ownerDocument.importNode(x, !0), w.nodeType === Pe.element && w.nodeName === "BODY" || w.nodeName === "HTML" ? h = w : h.appendChild(w), es(h);
    else {
      if (!rt && !je && !W && x.indexOf("<") === -1) return y && te ? se(x) : x;
      if (h = $(x), !h) return rt ? null : te ? f : "";
    }
    h && en && Ve(h.firstChild);
    const G = q ? x : h;
    try {
      const Ue = Q(G);
      for (; A = Ue.nextNode(); )
        xs(A, G), As(A, G), Ut(A.content) && Un(A.content);
    } catch (Ue) {
      throw q && (St(x), Tt(e.removed, (Oe) => {
        Oe.element && i(Oe.element);
      })), Ue;
    }
    if (q) {
      let Ue = !1;
      if (Tt(e.removed, (Oe) => {
        Oe.element && (Oe.element === x && (Ue = !0), i(Oe.element));
      }), Ue) throw gt("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return je && Jn(x), x;
    }
    if (rt) {
      if (je && Jn(h), wt)
        for (M = Sn.call(h.ownerDocument); h.firstChild; ) M.appendChild(h.firstChild);
      else M = h;
      return (oe.shadowroot || oe.shadowrootmode) && (M = Ct.call(r, M, !0)), M;
    }
    let he = W ? h.outerHTML : h.innerHTML;
    return W && ee["!doctype"] && h.ownerDocument && h.ownerDocument.doctype && h.ownerDocument.doctype.name && Se(la, h.ownerDocument.doctype.name) && (he = "<!DOCTYPE " + h.ownerDocument.doctype.name + `>
` + he), je && (he = et(he)), y && te ? se(he) : he;
  }, e.setConfig = function() {
    let x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    un(x), Pt = !0, yt = ee, _t = oe;
  }, e.clearConfig = function() {
    lt = null, Pt = !1, yt = null, _t = null, y = v, f = "";
  }, e.isValidAttribute = function(x, l, h) {
    lt || un({});
    const w = de(x), A = de(l);
    return Ss(w, A, h);
  }, e.addHook = function(x, l) {
    typeof l == "function" && Re(X, x) && hn(X[x], l);
  }, e.removeHook = function(x, l) {
    if (Re(X, x)) {
      if (l !== void 0) {
        const h = Bl(X[x], l);
        return h === -1 ? void 0 : Hl(X[x], h, 1)[0];
      }
      return Fs(X[x]);
    }
  }, e.removeHooks = function(x) {
    Re(X, x) && (X[x] = []);
  }, e.removeAllHooks = function() {
    X = Qs();
  }, e;
}
var ha = fr();
const fa = ["innerHTML"], ga = /* @__PURE__ */ Zt({
  __name: "MarkdownContent",
  props: {
    content: {}
  },
  setup(n) {
    const e = n, t = V(() => ha.sanitize(le.parse(e.content, { async: !1, breaks: !0 })));
    return (r, s) => (m(), k("div", {
      class: "markdown-content",
      innerHTML: t.value
    }, null, 8, fa));
  }
}), _s = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, s] of e)
    t[r] = s;
  return t;
}, mn = /* @__PURE__ */ _s(ga, [["__scopeId", "data-v-ef377647"]]);
function gr() {
  const n = localStorage.getItem("0kay_lang");
  return n === "en" || n === "zh" ? n : navigator.language.startsWith("zh") ? "zh" : "en";
}
const ot = O(gr());
function ma() {
  ot.value = gr();
}
const va = { class: "tool-kind" }, ka = { class: "tool-summary" }, ba = {
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
}, Aa = { class: "diff-file-head" }, Ea = ["title"], $a = {
  key: 0,
  class: "diff-file-stat"
}, Ra = { class: "diff-body" }, Ca = { class: "diff-no" }, La = { class: "diff-no" }, Ia = { class: "diff-sign" }, Oa = { class: "diff-text" }, Pa = {
  key: 0,
  class: "tool-section-label"
}, Ma = { key: 1 }, Da = {
  key: 2,
  class: "tool-section-text"
}, Na = {
  key: 4,
  class: "muted"
}, za = {
  key: 5,
  class: "tool-error"
}, Ua = ["aria-label"], Fa = ["aria-label", "title"], Ba = {
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
}, Ya = /* @__PURE__ */ Zt({
  __name: "ToolStepCard",
  props: {
    step: {},
    formatError: { type: Function }
  },
  setup(n) {
    const e = n, t = (y, f) => ot.value === "en" ? f : y, r = O(!1), s = O(!1), a = V(() => (e.step.prompt || "").trim() || "tool"), d = V(() => ["websearch", "web_search", "search"].includes(a.value)), u = V(() => {
      if (!e.step.args) return null;
      try {
        const y = JSON.parse(e.step.args);
        return y && typeof y == "object" && !Array.isArray(y) ? y : null;
      } catch {
        return null;
      }
    }), b = V(() => {
      if (!e.step.result) return null;
      try {
        return JSON.parse(e.step.result);
      } catch {
        return e.step.result;
      }
    }), _ = V(() => {
      const y = b.value;
      return !y || typeof y != "object" || Array.isArray(y) ? null : y.data !== void 0 && y.data !== null && typeof y.data == "object" && !Array.isArray(y.data) ? y.data : "success" in y ? null : y;
    }), S = V(() => {
      const y = _.value;
      return !y || typeof y.base64 != "string" || typeof y.mime != "string" || !y.mime.startsWith("image/") ? null : { src: `data:${y.mime};base64,${y.base64}`, width: y.width, height: y.height, path: y.path };
    }), E = V(() => {
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
    }), D = (y) => (ot.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[y] || y;
    function F(y) {
      let f = 0, v = 0;
      for (const T of String(y || "").split(`
`))
        T.startsWith("---") || T.startsWith("+++") || (T.startsWith("+") ? f++ : T.startsWith("-") && v++);
      return { added: f, removed: v };
    }
    const L = V(() => {
      const y = a.value, f = _.value;
      if (!f) return "";
      if (y === "write") return typeof f.lines == "number" ? `+${f.lines} ${t("行", "lines")}` : "";
      if (y === "edit") {
        const { added: v, removed: T } = F(f.diff);
        return v || T ? `+${v} −${T}` : "";
      }
      if (y === "apply_patch" && Array.isArray(f.files)) {
        let v = 0, T = 0;
        for (const R of f.files) {
          const P = F(R?.diff);
          v += P.added, T += P.removed;
        }
        return v || T ? `+${v} −${T}` : "";
      }
      return "";
    });
    function K(y, f) {
      const v = [];
      let T = null, R = 0, P = 0;
      const se = (j) => {
        T || (T = { path: f, lines: [] }, v.push(T)), T.lines.push(j);
      };
      for (const j of String(y || "").split(`
`)) {
        if (j.startsWith("+++ ")) {
          const ge = j.slice(4).split("	")[0].trim().replace(/^[ab]\//, "");
          T = { path: ge === "/dev/null" ? f : ge, lines: [] }, v.push(T);
          continue;
        }
        if (!j.startsWith("--- ")) {
          if (j.startsWith("diff --git")) {
            T || (T = { path: f, lines: [] }, v.push(T));
            continue;
          }
          if (j.startsWith("@@")) {
            const ge = /@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(j);
            ge && (R = parseInt(ge[1], 10), P = parseInt(ge[2], 10)), se({ kind: "hunk", oldNo: "", newNo: "", text: j });
            continue;
          }
          if (/^(index |new file|deleted file|old mode|new mode|similarity |rename |copy )/.test(j)) {
            se({ kind: "meta", oldNo: "", newNo: "", text: j });
            continue;
          }
          if (j.startsWith("+")) {
            se({ kind: "add", oldNo: "", newNo: String(P++), text: j.slice(1) });
            continue;
          }
          if (j.startsWith("-")) {
            se({ kind: "del", oldNo: String(R++), newNo: "", text: j.slice(1) });
            continue;
          }
          if (j.startsWith("\\")) {
            se({ kind: "meta", oldNo: "", newNo: "", text: j });
            continue;
          }
          se({ kind: "ctx", oldNo: String(R++), newNo: String(P++), text: j });
        }
      }
      return v;
    }
    const z = V(() => {
      const y = a.value, f = _.value, v = u.value;
      if (y === "edit" && f) return K(String(f.diff || ""), String(v?.filePath || f.path || ""));
      if (y === "apply_patch") {
        const T = [];
        if (Array.isArray(f?.files)) {
          for (const R of f.files) {
            const P = K(String(R?.diff || ""), String(R?.path || ""));
            P.length ? T.push(...P) : T.push({ path: String(R?.path || ""), lines: [] });
          }
          return T;
        }
        if (Array.isArray(v?.patches)) {
          const R = v.patches.map((P) => String(P?.patch ?? P?.diff ?? P?.text ?? "")).join(`
`);
          return K(R, "");
        }
        return T;
      }
      return [];
    });
    function Y(y) {
      const f = y.lines || [], v = f.filter((R) => R.kind === "add").length, T = f.filter((R) => R.kind === "del").length;
      return v || T ? `+${v} −${T}` : "";
    }
    const ae = V(() => {
      const y = a.value, f = u.value, v = _.value, T = (R, P = 160) => (R || "").length > P ? `${R.slice(0, P)}…` : R || "";
      if (d.value) {
        const R = T(String(v?.query ?? f?.query ?? "")), P = Array.isArray(v?.results) ? v.results.length : 0;
        return R + (P ? ` · ${P} ${t("条结果", "results")}` : "");
      }
      if (y === "bash") {
        const R = T(String(f?.command ?? "")), P = v && v.exitCode !== void 0 && e.step.state !== "running" ? ` · ${t("退出码", "exit")} ${v.exitCode}` : "";
        return R + P;
      }
      if (y === "webfetch")
        return T(String(v?.url ?? f?.url ?? "")) + (v?.status !== void 0 && v?.status !== null ? ` · HTTP ${v.status}` : "");
      if (y === "read" || y === "write") return T(String(v?.path ?? f?.filePath ?? ""));
      if (y === "edit") return T(String(f?.filePath ?? v?.path ?? ""));
      if (y === "apply_patch") {
        const R = Array.isArray(f?.patches) ? f.patches.map((P) => P?.filePath).filter(Boolean) : Array.isArray(v?.files) ? v.files.map((P) => P?.path).filter(Boolean) : [];
        return T(R.join(", "));
      }
      if (y === "todowrite") {
        const R = Array.isArray(f?.todos) ? f.todos : Array.isArray(v?.todos) ? v.todos : [];
        if (!R.length) return T(String(e.step.args || ""));
        const P = R.length, se = R.filter((ge) => ge?.status === "completed").length, j = R.filter((ge) => ge?.status === "in_progress").length;
        return `${P} ${t("项", "items")} · ${t("完成", "done")} ${se}${j ? ` · ${t("进行中", "running")} ${j}` : ""}`;
      }
      if (y === "computeruse") {
        const R = String(f?.action ?? v?.action ?? ""), P = f && f.x !== void 0 ? ` (${f.x}, ${f.y})` : "", se = v?.width && v?.height ? ` · ${v.width}×${v.height}` : "", j = Array.isArray(v?.windows) ? ` · ${v.windows.length} ${t("个窗口", "windows")}` : "";
        return T(`${R}${P}${se}${j}`);
      }
      if (f && Object.keys(f).length)
        try {
          return T(JSON.stringify(f));
        } catch {
        }
      return T(String(e.step.args || ""));
    }), C = V(() => String(_.value?.query ?? u.value?.query ?? e.step.args ?? "")), U = V(() => Array.isArray(_.value?.results) ? _.value.results : []), N = V(() => typeof b.value == "string" ? b.value : b.value === null && e.step.result ? e.step.result : ""), ce = V(() => {
      const y = a.value, f = _.value;
      if (y === "computeruse" && S.value) return [];
      if (y === "bash" && f) {
        const T = [{ label: t("工作目录", "cwd"), text: String(f.cwd || "") }];
        return f.stdout && T.push({ label: "stdout", text: String(f.stdout), mono: !0 }), f.stderr && T.push({ label: "stderr", text: String(f.stderr), mono: !0 }), !f.stdout && !f.stderr && T.push({ label: "", text: t("（无输出）", "(no output)") }), T;
      }
      if (y === "write" && f) {
        const T = [{ label: t("文件", "File"), text: String(f.path || "") }];
        return T.push({ label: t("内容", "Content"), text: `${typeof f.lines == "number" ? f.lines : "—"} ${t("行", "lines")}${f.created ? ` · ${t("新建文件", "created")}` : ""} · ${f.bytes ?? "—"} B` }), T;
      }
      if (y === "edit" || y === "apply_patch") return [];
      if (y === "read" && f) {
        const T = [{ label: t("文件", "File"), text: String(f.path || "") }];
        return T.push({ label: `${t("第", "line")} ${f.offset ?? "—"} ${t("行起", "onward")}`, text: String(f.content || ""), mono: !0 }), T;
      }
      if (y === "webfetch" && f)
        return [
          { label: "URL", text: String(f.url || "") },
          { label: t("内容", "Content"), text: String(f.content || ""), mono: !0 }
        ];
      const v = e.step.result;
      if (!v) return [];
      try {
        return [{ label: "JSON", text: JSON.stringify(b.value, null, 2), mono: !0 }];
      } catch {
        return [{ label: "", text: String(v), mono: !0 }];
      }
    });
    function J() {
      if (d.value) {
        s.value = !s.value;
        return;
      }
      r.value = !r.value;
    }
    function B(y) {
      y.key === "Escape" && s.value && (s.value = !1);
    }
    return qt(() => window.addEventListener("keydown", B)), yn(() => window.removeEventListener("keydown", B)), (y, f) => (m(), k("div", {
      class: ie(["tool-card", { expanded: r.value }])
    }, [
      o("button", {
        type: "button",
        class: "tool-card-head",
        onClick: J
      }, [
        o("span", {
          class: ie(["tool-dot", n.step.state])
        }, "●", 2),
        o("strong", va, g(E.value), 1),
        o("span", ka, g(ae.value), 1),
        L.value ? (m(), k("small", ba, g(L.value), 1)) : I("", !0),
        o("small", ya, g(D(n.step.state)), 1),
        f[2] || (f[2] = o("span", {
          class: "tool-chevron",
          "aria-hidden": "true"
        }, "▸", -1))
      ]),
      r.value && !d.value ? (m(), k("div", _a, [
        n.step.state === "running" && !ce.value.length && !z.value.length && !S.value ? (m(), k("p", wa, g(t("执行中…", "Running…")), 1)) : I("", !0),
        S.value ? (m(), k("figure", xa, [
          o("img", {
            src: S.value.src,
            alt: t("屏幕截图", "Screenshot")
          }, null, 8, Sa),
          o("figcaption", null, g(S.value.width && S.value.height ? `${S.value.width}×${S.value.height} · ` : "") + g(S.value.path), 1)
        ])) : I("", !0),
        z.value.length ? (m(), k("div", Ta, [
          (m(!0), k(ne, null, ve(z.value, (v, T) => (m(), k("div", {
            key: T,
            class: "diff-file"
          }, [
            o("div", Aa, [
              o("span", {
                class: "diff-file-path",
                title: v.path
              }, g(v.path || "—"), 9, Ea),
              Y(v) ? (m(), k("span", $a, g(Y(v)), 1)) : I("", !0)
            ]),
            o("div", Ra, [
              (m(!0), k(ne, null, ve(v.lines, (R, P) => (m(), k("div", {
                key: P,
                class: ie(["diff-line", R.kind])
              }, [
                o("span", Ca, g(R.oldNo), 1),
                o("span", La, g(R.newNo), 1),
                o("span", Ia, g(R.kind === "add" ? "+" : R.kind === "del" ? "-" : ""), 1),
                o("span", Oa, g(R.text), 1)
              ], 2))), 128))
            ])
          ]))), 128))
        ])) : S.value ? I("", !0) : (m(!0), k(ne, { key: 3 }, ve(ce.value, (v, T) => (m(), k(ne, { key: T }, [
          v.label ? (m(), k("small", Pa, g(v.label), 1)) : I("", !0),
          v.mono ? (m(), k("pre", Ma, g(v.text), 1)) : (m(), k("p", Da, g(v.text), 1))
        ], 64))), 128)),
        !ce.value.length && !z.value.length && !S.value && n.step.state !== "running" && !n.step.error ? (m(), k("p", Na, g(t("执行完成，无输出", "Completed with no output")), 1)) : I("", !0),
        n.step.error ? (m(), k("p", za, g(n.formatError?.(n.step.error) || n.step.error), 1)) : I("", !0)
      ])) : I("", !0),
      s.value ? (m(), k("div", {
        key: 1,
        class: "tool-dialog-backdrop",
        onClick: f[1] || (f[1] = Ne((v) => s.value = !1, ["self"]))
      }, [
        o("section", {
          class: "tool-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t("搜索结果", "Search results")
        }, [
          o("header", null, [
            o("h4", null, g(t("搜索", "Search")) + " · " + g(C.value), 1),
            o("button", {
              type: "button",
              class: "tool-dialog-close",
              "aria-label": t("关闭", "Close"),
              title: t("关闭", "Close"),
              onClick: f[0] || (f[0] = (v) => s.value = !1)
            }, [...f[3] || (f[3] = [
              o("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                o("path", {
                  d: "M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                })
              ], -1)
            ])], 8, Fa)
          ]),
          n.step.state === "running" ? (m(), k("p", Ba, g(t("搜索中…", "Searching…")), 1)) : U.value.length ? (m(), k("ol", Ha, [
            (m(!0), k(ne, null, ve(U.value, (v, T) => (m(), k("li", { key: T }, [
              o("a", {
                href: v.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }, g(v.title || v.url), 9, ja),
              v.snippet ? (m(), k("p", Wa, g(v.snippet), 1)) : I("", !0),
              v.title && v.url ? (m(), k("small", Va, g(v.url), 1)) : I("", !0)
            ]))), 128))
          ])) : (m(), k("p", qa, g(N.value || t("没有找到相关结果。", "No relevant results found.")), 1)),
          n.step.error ? (m(), k("p", Ga, g(n.formatError?.(n.step.error) || n.step.error), 1)) : I("", !0)
        ], 8, Ua)
      ])) : I("", !0)
    ], 2));
  }
}), Js = /* @__PURE__ */ _s(Ya, [["__scopeId", "data-v-f13fbd25"]]);
function mr(n = "") {
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
}, Hn = /* @__PURE__ */ Zt({
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
    const t = n, r = e, s = O(null), a = O(null), d = O(null), u = O(!1), b = O(-1), _ = O({}), S = O(!1), E = O(""), D = mr("select"), F = V(() => t.options.map((f) => typeof f == "string" ? { value: f, label: f } : f)), L = V(() => {
      if (!t.searchable || !E.value.trim()) return F.value;
      const f = E.value.trim().toLocaleLowerCase();
      return F.value.filter((v) => v.label.toLocaleLowerCase().includes(f) || v.value.toLocaleLowerCase().includes(f));
    }), K = V(() => F.value.find((f) => f.value === t.modelValue)?.label || t.modelValue || t.placeholder);
    let z = "", Y = 0;
    function ae() {
      const f = s.value?.getBoundingClientRect();
      if (!f) return;
      const v = window.visualViewport?.height || innerHeight, T = window.visualViewport?.width || innerWidth, R = v - f.bottom - 10, P = f.top - 10;
      S.value = R < Math.min(280, L.value.length * 46 + 58) && P > R;
      const se = Math.max(48, Math.min(340, S.value ? P : R)), j = Math.min(Math.max(f.width, 220), T - 16);
      _.value = { position: "fixed", left: `${Math.max(8, Math.min(f.left, T - j - 8))}px`, width: `${j}px`, maxHeight: `${se}px`, ...S.value ? { bottom: `${v - f.top + 8}px` } : { top: `${f.bottom + 8}px` } };
    }
    function C(f = !1) {
      u.value = !1, E.value = "", z = "", f && s.value?.focus();
    }
    async function U() {
      t.disabled || u.value || (u.value = !0, E.value = "", b.value = L.value.findIndex((f) => f.value === t.modelValue && !f.disabled), b.value < 0 && (b.value = L.value.findIndex((f) => !f.disabled)), ae(), r("open"), await nt(), t.searchable && d.value?.focus(), N());
    }
    function N() {
      a.value?.querySelector(`[data-index="${b.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function ce(f) {
      const v = L.value[f];
      !v || v.disabled || (r("update:modelValue", v.value), r("change", v.value), C(!0));
    }
    async function J(f) {
      if (!(t.disabled || f.isComposing)) {
        if (f.key === "Tab") {
          C();
          return;
        }
        if (f.key === "Escape") {
          u.value && (f.preventDefault(), C(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(f.key)) {
          if (t.searchable && f.key === " ") return;
          if (f.preventDefault(), !u.value) {
            await U();
            return;
          }
          if (f.key === "Enter") {
            ce(b.value);
            return;
          }
          const v = L.value.map((R, P) => R.disabled ? -1 : P).filter((R) => R >= 0);
          if (!v.length) return;
          const T = v.indexOf(b.value);
          b.value = f.key === "Home" ? v[0] : f.key === "End" ? v[v.length - 1] : v[(T + (f.key === "ArrowDown" ? 1 : -1) + v.length) % v.length], await nt(), N();
          return;
        }
        if (!t.searchable && f.key.length === 1 && !f.ctrlKey && !f.metaKey && !f.altKey) {
          await U();
          const v = Date.now();
          z = v - Y > 700 ? f.key : z + f.key, Y = v;
          const T = L.value.findIndex((R) => !R.disabled && R.label.toLocaleLowerCase().startsWith(z.toLocaleLowerCase()));
          T >= 0 && (b.value = T, await nt(), N());
        }
      }
    }
    function B(f) {
      const v = f.target;
      !s.value?.contains(v) && !a.value?.contains(v) && C();
    }
    function y(f) {
      u.value && (!(f.target instanceof Node) || !a.value?.contains(f.target)) && ae();
    }
    return be(() => t.disabled, (f) => {
      f && C();
    }), be(L, () => {
      u.value && (b.value >= L.value.length && (b.value = L.value.findIndex((f) => !f.disabled)), nt(ae));
    }), be(E, () => {
      u.value && (b.value = L.value.findIndex((f) => !f.disabled), nt(N));
    }), qt(() => {
      document.addEventListener("pointerdown", B, !0), window.addEventListener("resize", ae), window.addEventListener("scroll", y, !0);
    }), yn(() => {
      document.removeEventListener("pointerdown", B, !0), window.removeEventListener("resize", ae), window.removeEventListener("scroll", y, !0);
    }), (f, v) => (m(), k("div", Ar(f.$attrs, {
      class: ["app-select", { "is-disabled": n.disabled, "is-open": u.value }]
    }), [
      o("button", {
        ref_key: "trigger",
        ref: s,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": u.value,
        "aria-controls": u.value ? ue(D) : void 0,
        "aria-activedescendant": u.value && b.value >= 0 ? `${ue(D)}-${b.value}` : void 0,
        "aria-label": n.ariaLabel,
        disabled: n.disabled,
        onClick: v[0] || (v[0] = (T) => u.value ? C() : U()),
        onKeydown: J,
        onFocus: v[1] || (v[1] = (T) => r("focus", T))
      }, [
        o("span", Ka, g(K.value), 1),
        o("span", Xa, [
          (m(), k("svg", {
            class: ie({ "is-open": u.value }),
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none"
          }, [...v[4] || (v[4] = [
            o("path", {
              d: "m6 9 6 6 6-6",
              stroke: "currentColor",
              "stroke-width": "1.9",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, null, -1)
          ])], 2))
        ])
      ], 40, Za),
      (m(), Et(Zn, { to: "body" }, [
        Be(er, { name: "select-menu" }, {
          default: tr(() => [
            u.value ? (m(), k("div", {
              key: 0,
              id: ue(D),
              ref_key: "menu",
              ref: a,
              class: ie(["app-select-menu", { "opens-up": S.value }]),
              style: Gt(_.value),
              role: "listbox",
              "aria-label": n.ariaLabel || "选项",
              onPointerdown: v[3] || (v[3] = Ne(() => {
              }, ["prevent"]))
            }, [
              n.searchable ? (m(), k("label", Ja, [
                v[5] || (v[5] = o("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  o("circle", {
                    cx: "11",
                    cy: "11",
                    r: "7",
                    stroke: "currentColor",
                    "stroke-width": "1.8"
                  }),
                  o("path", {
                    d: "m20 20-3.5-3.5",
                    stroke: "currentColor",
                    "stroke-width": "1.8",
                    "stroke-linecap": "round"
                  })
                ], -1)),
                vn(o("input", {
                  ref_key: "searchInput",
                  ref: d,
                  "onUpdate:modelValue": v[2] || (v[2] = (T) => E.value = T),
                  type: "text",
                  placeholder: ue(ot) === "en" ? "Search…" : "搜索…",
                  onKeydown: J
                }, null, 40, eo), [
                  [Wn, E.value]
                ])
              ])) : I("", !0),
              (m(!0), k(ne, null, ve(L.value, (T, R) => (m(), k("div", {
                id: `${ue(D)}-${R}`,
                key: `${T.value}:${R}`,
                role: "option",
                "aria-selected": T.value === n.modelValue,
                "aria-disabled": !!T.disabled,
                "data-index": R,
                class: ie(["app-select-option", { highlighted: b.value === R, selected: T.value === n.modelValue, disabled: T.disabled }]),
                onPointermove: (P) => !T.disabled && (b.value = R),
                onClick: Ne((P) => ce(R), ["stop"])
              }, [
                o("span", null, g(T.label), 1),
                T.value === n.modelValue ? (m(), k("span", no, [...v[6] || (v[6] = [
                  o("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none"
                  }, [
                    o("path", {
                      d: "m5 12 4 4L19 6",
                      stroke: "currentColor",
                      "stroke-width": "2.4",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ], -1)
                ])])) : I("", !0)
              ], 42, to))), 128)),
              L.value.length ? I("", !0) : (m(), k("div", so, g(ue(ot) === "en" ? "No matches" : "没有匹配项"), 1))
            ], 46, Qa)) : I("", !0)
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
}, co = { class: "thinking-stops" }, po = ["aria-pressed", "onClick"], ho = { class: "thinking-provider-note" }, fo = /* @__PURE__ */ Zt({
  __name: "ThinkingSlider",
  props: {
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = V(() => ot.value === "en"), r = n, s = e, a = V(() => [{ value: 0, label: t.value ? "Off" : "关闭思考" }, { value: 20, label: t.value ? "Low" : "低" }, { value: 50, label: t.value ? "Medium" : "中" }, { value: 75, label: t.value ? "High" : "高" }, { value: 100, label: t.value ? "Max" : "最高" }]), d = V(() => r.modelValue === 0 ? 0 : r.modelValue < 35 ? 1 : r.modelValue < 62.5 ? 2 : r.modelValue < 87.5 ? 3 : 4), u = O(!1), b = O({}), _ = O(null), S = O(null), E = O(null), D = O(d.value * 25), F = O(!1), L = V(() => d.value === 4), K = mr("thinking");
    let z;
    be(() => r.modelValue, () => {
      u.value || (D.value = d.value * 25);
    }), be(L, (B, y) => {
      B && !y && (F.value = !0, clearTimeout(z), z = setTimeout(() => F.value = !1, 900));
    }), be(() => r.disabled, (B) => {
      B && (u.value = !1);
    });
    function Y() {
      const B = _.value?.getBoundingClientRect();
      if (!B) return;
      const y = Math.min(352, innerWidth - 16), f = 236, v = B.top >= f + 8 || innerHeight - B.bottom < f;
      b.value = { left: `${Math.max(8, Math.min(B.left, innerWidth - y - 8))}px`, width: `${y}px`, ...v ? { bottom: `${innerHeight - B.top + 8}px` } : { top: `${B.bottom + 8}px` } };
    }
    async function ae() {
      r.disabled || (u.value = !u.value, u.value && (D.value = d.value * 25, Y(), await nt(), E.value?.focus()));
    }
    function C() {
      u.value = !1, _.value?.focus();
    }
    function U(B) {
      D.value = Number(B.target.value), s("update:modelValue", a.value[Math.round(D.value / 25)].value);
    }
    function N(B) {
      D.value = B * 25, s("update:modelValue", a.value[B].value);
    }
    function ce(B) {
      const y = B.target;
      !_.value?.contains(y) && !S.value?.contains(y) && (u.value = !1);
    }
    function J(B) {
      u.value && (!(B.target instanceof Node) || !S.value?.contains(B.target)) && Y();
    }
    return qt(() => {
      document.addEventListener("pointerdown", ce, !0), window.addEventListener("resize", Y), window.addEventListener("scroll", J, !0);
    }), yn(() => {
      clearTimeout(z), document.removeEventListener("pointerdown", ce, !0), window.removeEventListener("resize", Y), window.removeEventListener("scroll", J, !0);
    }), (B, y) => (m(), k("div", {
      class: ie(["thinking-control", { full: L.value, pulse: F.value }])
    }, [
      o("span", ro, g(t.value ? "Thinking effort" : "思考强度"), 1),
      o("button", {
        ref_key: "trigger",
        ref: _,
        type: "button",
        class: "thinking-trigger",
        disabled: n.disabled,
        "aria-label": "思考强度",
        "aria-haspopup": "dialog",
        "aria-expanded": u.value,
        "aria-controls": u.value ? ue(K) : void 0,
        onClick: ae,
        onKeydown: Ht(C, ["esc"])
      }, [
        o("span", null, g(L.value ? "✦ " : "") + g(a.value[d.value].label), 1),
        y[5] || (y[5] = o("span", { "aria-hidden": "true" }, "⌄", -1))
      ], 40, lo),
      (m(), Et(Zn, { to: "body" }, [
        Be(er, { name: "thinking-menu" }, {
          default: tr(() => [
            u.value ? (m(), k("section", {
              key: 0,
              id: ue(K),
              ref_key: "panel",
              ref: S,
              class: ie(["thinking-popover", { full: L.value, pulse: F.value }]),
              style: Gt(b.value),
              role: "dialog",
              "aria-label": "调整思考强度",
              onKeydown: Ht(Ne(C, ["prevent", "stop"]), ["esc"])
            }, [
              o("header", null, [
                o("strong", null, g(t.value ? "Thinking effort" : "思考强度"), 1),
                o("output", null, g(L.value ? "✦ " : "") + g(a.value[d.value].label), 1)
              ]),
              o("div", {
                class: "thinking-track",
                style: Gt({ "--intensity": `${D.value}%` })
              }, [
                o("div", oo, [
                  y[6] || (y[6] = o("div", { class: "thinking-fill" }, null, -1)),
                  (m(!0), k(ne, null, ve(a.value, (f, v) => (m(), k("span", {
                    key: v,
                    class: ie(["thinking-tick", { passed: D.value >= v * 25 }]),
                    style: Gt({ left: `${v * 25}%` })
                  }, null, 6))), 128))
                ]),
                o("input", {
                  ref_key: "range",
                  ref: E,
                  type: "range",
                  min: "0",
                  max: "100",
                  step: "0.1",
                  value: D.value,
                  "aria-label": "思考强度滑块",
                  "aria-valuetext": a.value[d.value].label,
                  onInput: U,
                  onChange: y[0] || (y[0] = (f) => D.value = d.value * 25),
                  onKeydown: [
                    y[1] || (y[1] = Ht(Ne((f) => N(0), ["prevent"]), ["home"])),
                    y[2] || (y[2] = Ht(Ne((f) => N(4), ["prevent"]), ["end"])),
                    y[3] || (y[3] = Ht(Ne((f) => N(Math.min(4, d.value + 1)), ["prevent"]), ["arrow-right"])),
                    y[4] || (y[4] = Ht(Ne((f) => N(Math.max(0, d.value - 1)), ["prevent"]), ["arrow-left"]))
                  ]
                }, null, 40, io),
                L.value ? (m(), k("span", uo)) : I("", !0)
              ], 4),
              o("div", co, [
                (m(!0), k(ne, null, ve(a.value, (f, v) => (m(), k("button", {
                  key: f.value,
                  type: "button",
                  class: ie({ selected: d.value === v }),
                  "aria-pressed": d.value === v,
                  onClick: (T) => N(v)
                }, g(f.label), 11, po))), 128))
              ]),
              o("p", null, g(t.value ? d.value === 0 ? "Disable model reasoning" : L.value ? "Maximum effort" : "Drag to adjust; release to snap to a level" : d.value === 0 ? "不启用模型思考模式" : L.value ? "全力思考 · 已达到最高档" : "拖动滑块调整，松开后定位到对应档位"), 1),
              o("p", ho, g(t.value ? "Actual reasoning controls depend on the selected provider. Max may map to High." : "实际推理参数取决于供应商；最高档可能映射为高档。"), 1)
            ], 46, ao)) : I("", !0)
          ]),
          _: 1
        })
      ]))
    ], 2));
  }
}), Wt = O(null);
function vr() {
  function n(t) {
    const r = typeof t == "string" ? { message: t } : t;
    return Wt.value && Wt.value.resolve(!1), new Promise((s) => {
      Wt.value = { options: r, resolve: s };
    });
  }
  function e(t) {
    const r = Wt.value;
    Wt.value = null, r?.resolve(t);
  }
  return { confirmState: Wt, confirm: n, settle: e };
}
const go = /* @__PURE__ */ Zt({
  __name: "ConfirmDialog",
  setup(n) {
    const { confirmState: e, settle: t } = vr(), r = O(null), s = O(null);
    let a = null;
    const d = () => (document.documentElement.lang || "").startsWith("en"), u = () => e.value?.options.title || (d() ? "Confirm" : "请确认"), b = () => e.value?.options.confirmLabel || (d() ? "Confirm" : "确认"), _ = () => e.value?.options.cancelLabel || (d() ? "Cancel" : "取消");
    be(() => !!e.value, async (E) => {
      E ? (a = document.activeElement, await nt(), r.value?.focus(), s.value?.focus()) : (r.value = null, a?.focus?.());
    });
    function S(E) {
      if (!e.value) return;
      if (E.key === "Escape") {
        E.preventDefault(), t(!1);
        return;
      }
      if (E.key !== "Tab" || !r.value) return;
      const D = [...r.value.querySelectorAll("button:not(:disabled)")];
      if (!D.length) return;
      const F = D[0], L = D[D.length - 1];
      E.shiftKey && document.activeElement === F ? (E.preventDefault(), L.focus()) : !E.shiftKey && document.activeElement === L && (E.preventDefault(), F.focus());
    }
    return (E, D) => (m(), Et(Zn, { to: "body" }, [
      ue(e) ? (m(), k("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: D[2] || (D[2] = Ne((F) => ue(t)(!1), ["self"])),
        onKeydown: S
      }, [
        o("section", {
          ref_key: "dialog",
          ref: r,
          class: "confirm-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          o("h2", null, g(u()), 1),
          o("p", null, g(ue(e).options.message), 1),
          o("footer", null, [
            o("button", {
              ref_key: "cancelBtn",
              ref: s,
              type: "button",
              onClick: D[0] || (D[0] = (F) => ue(t)(!1))
            }, g(_()), 513),
            o("button", {
              type: "button",
              class: ie(["confirm-primary", { danger: ue(e).options.danger !== !1 }]),
              onClick: D[1] || (D[1] = (F) => ue(t)(!0))
            }, g(b()), 3)
          ])
        ], 512)
      ], 32)) : I("", !0)
    ]));
  }
}), mo = { class: "workspace" }, vo = { class: "sessions" }, ko = ["disabled", "title"], bo = { class: "connection" }, yo = ["title"], _o = ["placeholder", "aria-label"], wo = { class: "filter-bar" }, xo = ["onClick"], So = { class: "muted" }, To = { class: "session-list" }, Ao = ["disabled", "onClick"], Eo = { class: "origin" }, $o = {
  key: 0,
  class: "muted"
}, Ro = {
  key: 0,
  class: "ledger"
}, Co = { class: "muted" }, Lo = ["onClick"], Io = {
  key: 1,
  class: "conversation"
}, Oo = { class: "conversation-header" }, Po = {
  key: 0,
  class: "running"
}, Mo = {
  key: 1,
  class: "session-actions"
}, Do = ["disabled"], No = ["disabled"], zo = {
  key: 0,
  class: "error",
  role: "alert"
}, Uo = {
  key: 1,
  class: "host-panel"
}, Fo = { class: "usage-rings" }, Bo = {
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
}, Xo = ["open"], Qo = {
  key: 0,
  class: "running"
}, Jo = {
  key: 3,
  class: "muted"
}, ei = {
  key: 4,
  class: "error"
}, ti = {
  key: 1,
  class: "subagent-card nested"
}, ni = ["onClick"], si = { class: "subagent-prompt" }, ri = { key: 3 }, li = {
  key: 0,
  class: "agent-speech"
}, ai = {
  key: 1,
  class: "error"
}, oi = {
  key: 2,
  class: "muted"
}, ii = {
  key: 0,
  class: "welcome"
}, ui = {
  key: 1,
  class: "context-summary"
}, ci = { class: "context-summary-head" }, di = { class: "bubble user" }, pi = { class: "message-head" }, hi = { class: "message-text" }, fi = { class: "bubble agent" }, gi = { class: "message-head" }, mi = {
  key: 0,
  class: "steps"
}, vi = {
  key: 0,
  class: "agent-speech"
}, ki = {
  key: 0,
  class: "muted model-annotation"
}, bi = ["open"], yi = {
  key: 0,
  class: "running"
}, _i = {
  key: 3,
  class: "muted"
}, wi = {
  key: 4,
  class: "error"
}, xi = {
  key: 1,
  class: "subagent-card"
}, Si = ["onClick"], Ti = { class: "subagent-prompt" }, Ai = {
  key: 0,
  class: "error subagent-card-error"
}, Ei = { key: 3 }, $i = {
  key: 2,
  class: "error"
}, Ri = {
  key: 3,
  class: "muted"
}, Ci = ["aria-label"], Li = {
  class: "todo-mark",
  "aria-hidden": "true"
}, Ii = { class: "todo-text" }, Oi = {
  key: 1,
  class: "compact-notice"
}, Pi = { class: "execution-options" }, Mi = ["disabled", "title"], Di = ["aria-label"], Ni = ["aria-selected", "onMousedown", "onMouseenter"], zi = { class: "slash-name" }, Ui = { class: "slash-desc" }, Fi = {
  key: 0,
  class: "attach-chips"
}, Bi = ["title"], Hi = ["aria-label", "title", "onClick"], ji = {
  key: 0,
  class: "attach-error"
}, Wi = ["disabled", "placeholder"], Vi = { class: "composer-actions" }, qi = ["disabled", "aria-label", "title"], Gi = ["disabled", "aria-label", "title"], Yi = ["aria-label", "title"], Zi = ["aria-label"], Ki = {
  class: "ctx-ring",
  viewBox: "0 0 20 20",
  "aria-hidden": "true"
}, Xi = ["stroke-dashoffset"], Qi = {
  class: "ctx-tip",
  role: "tooltip"
}, Ji = { class: "ctx-used" }, eu = { class: "ctx-sub" }, tu = ["aria-expanded"], nu = ["disabled"], su = { class: "muted" }, ru = {
  class: "directory-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "选择工作区目录"
}, lu = { class: "directory-roots" }, au = ["disabled", "onClick"], ou = ["disabled"], iu = ["disabled"], uu = ["disabled"], cu = {
  key: 0,
  class: "error"
}, du = { key: 1 }, pu = {
  key: 2,
  class: "directory-list"
}, hu = ["onClick"], fu = {
  key: 1,
  class: "muted"
}, gu = ["disabled"], mu = /* @__PURE__ */ Zt({
  __name: "AgentsPage",
  setup(n) {
    const e = (i, p) => ot.value === "en" ? p : i, { confirm: t } = vr(), r = Cr(), s = O(localStorage.getItem("0kay.agent.selected") || ""), a = O(""), d = O([]), u = O(!1), b = O(""), _ = O(null);
    function S() {
      _.value?.click();
    }
    function E(i) {
      d.value.splice(i, 1);
    }
    async function D(i) {
      if (i.length) {
        u.value = !0, b.value = "";
        try {
          for (const p of i) {
            const c = new FormData();
            c.append("file", p);
            const $ = await fetch("/api/files", { method: "POST", body: c });
            if (!$.ok) throw new Error(await $.text());
            const Q = await $.json();
            d.value.push({ name: Q.name || p.name, url: Q.url, mime: Q.mime || p.type || "application/octet-stream", size: Q.size ?? p.size });
          }
        } catch (p) {
          b.value = p.message;
        } finally {
          u.value = !1;
        }
      }
    }
    async function F(i) {
      const p = i.target, c = Array.from(p.files || []);
      p.value = "", await D(c);
    }
    function L(i) {
      const p = Array.from(i.clipboardData?.files || []);
      p.length && (i.preventDefault(), D(p));
    }
    const K = O(""), z = O("all"), Y = O("general"), ae = O(!1), C = O(""), U = O(""), N = O(50);
    function ce(i) {
      const p = { off: 0, low: 20, medium: 50, high: 75, max: 100 };
      if (typeof i == "string" && i in p) return p[i];
      const c = Number(i ?? 50);
      return Number.isFinite(c) ? Math.max(0, Math.min(100, c)) : 50;
    }
    const J = O("MOCR"), B = O("normal"), y = O("");
    async function f() {
      if (!(!y.value.trim() || !W.value || P.value)) {
        P.value = !0, se.value = "";
        try {
          const i = await fetch(`/api/agent/workspace?executor_id=${encodeURIComponent(W.value.plugin_id)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: j.value.path, name: y.value.trim() }) });
          if (!i.ok) throw new Error(await i.text());
          const p = await i.json();
          y.value = "", await Ke(p.path);
        } catch (i) {
          se.value = i.message;
        } finally {
          P.value = !1;
        }
      }
    }
    const v = O([]), T = O(!1), R = O(!1), P = O(!1), se = O(""), j = O({ path: "", parent: "", roots: [], directories: [] }), ge = O(null), He = O("");
    let vt = null, ut = 0, Sn = "", Xt = !1;
    const Ct = O(!0);
    function X(i = s.value) {
      try {
        localStorage.setItem(`0kay.agent.editor:${i}`, JSON.stringify({ draft: a.value, mode: Y.value, ...wt() }));
      } catch {
      }
    }
    function ct() {
      ut++, R.value = !1, P.value = !1;
    }
    function Tn(i) {
      i.key === "Escape" && R.value && ct();
    }
    const An = O([]);
    let Lt = !1;
    async function Kn() {
      if (!Lt) {
        Lt = !0;
        try {
          const p = await (await fetch("/api/skills")).json(), c = p?.result?.skills ?? p?.skills;
          Array.isArray(c) ? An.value = c : Lt = !1;
        } catch {
          Lt = !1;
        }
      }
    }
    const Xn = [{ name: "compact", description: e("压缩当前会话上下文", "Compact the session context") }], Qt = V(() => {
      const i = /^\/([^\s]*)$/.exec(a.value);
      return i ? i[1].toLowerCase() : null;
    }), kt = V(() => {
      const i = Qt.value;
      if (i === null) return [];
      const p = [
        ...Xn,
        ...An.value.map(($) => ({ name: $.name, description: $.description || "" }))
      ], c = /* @__PURE__ */ new Set();
      return p.filter(($) => c.has($.name) || !$.name.toLowerCase().startsWith(i) ? !1 : (c.add($.name), !0)).slice(0, 8);
    }), bt = O(!1), ee = V(() => !bt.value && kt.value.length > 0), Ce = O(0);
    be(kt, () => {
      Ce.value = 0;
    }), be(Qt, (i) => {
      bt.value = !1, i !== null && Kn();
    });
    const oe = O(null), It = O({});
    function Le() {
      const i = oe.value?.getBoundingClientRect();
      i && (It.value = {
        left: `${i.left}px`,
        width: `${i.width}px`,
        bottom: `${Math.max(8, window.innerHeight - i.top + 8)}px`
      });
    }
    const Ye = () => {
      ee.value && Le();
    };
    be(ee, (i) => {
      i && nt(Le);
    }), qt(() => {
      window.addEventListener("resize", Ye), window.addEventListener("scroll", Ye, !0);
    }), yn(() => {
      window.removeEventListener("resize", Ye), window.removeEventListener("scroll", Ye, !0);
    });
    function Jt(i) {
      a.value = "/" + i.name + " ", bt.value = !0, nt(() => document.querySelector(".composer-input textarea")?.focus());
    }
    function Ze(i) {
      if (ee.value) {
        const p = kt.value.length;
        if (i.key === "ArrowDown") {
          i.preventDefault(), Ce.value = (Math.min(Ce.value, p - 1) + 1) % p;
          return;
        }
        if (i.key === "ArrowUp") {
          i.preventDefault(), Ce.value = (Math.min(Ce.value, p - 1) - 1 + p) % p;
          return;
        }
        if (i.key === "Enter" || i.key === "Tab") {
          i.preventDefault(), Jt(kt.value[Math.min(Ce.value, p - 1)]);
          return;
        }
        if (i.key === "Escape") {
          i.preventDefault(), bt.value = !0;
          return;
        }
      }
      i.key === "Enter" && !i.shiftKey && !i.isComposing && i.keyCode !== 229 && (i.preventDefault(), St());
    }
    function En() {
      const i = We.value;
      i && (Ct.value = i.scrollHeight - i.scrollTop - i.clientHeight < 100);
    }
    async function Ke(i = "") {
      if (!W.value) {
        xe.value = "请先选择在线执行器";
        return;
      }
      const p = ++ut;
      Sn = W.value.plugin_id, R.value = !0, P.value = !0, se.value = "";
      try {
        const c = await fetch(`/api/agent/workspace?${new URLSearchParams({ executor_id: W.value.plugin_id, path: i })}`);
        if (!c.ok) throw new Error(await c.text());
        const $ = await c.json();
        p === ut && (j.value = $);
      } catch (c) {
        p === ut && (se.value = c.message);
      } finally {
        p === ut && (P.value = !1);
      }
    }
    function $n() {
      !W.value || W.value.plugin_id !== Sn || P.value || se.value || (C.value = W.value.plugin_id, U.value = j.value.path, R.value = !1);
    }
    async function Ot() {
      if (!T.value || !W.value || Xt || document.hidden) return;
      Xt = !0;
      const i = W.value.plugin_id;
      try {
        const p = await fetch(`/api/agent/host?executor_id=${encodeURIComponent(i)}`);
        if (!p.ok) throw new Error();
        const c = await p.json();
        W.value?.plugin_id === i && (ge.value = c);
      } catch {
        W.value?.plugin_id === i && (ge.value = null);
      } finally {
        Xt = !1;
      }
    }
    async function je() {
      if (!pe.value || fe.value || te.value || pe.value.state === "archived") return;
      const i = s.value;
      te.value = !0, xe.value = "", He.value = "正在压缩上下文…";
      try {
        const p = await fetch("/api/agent/compact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: i, model_id: J.value }) });
        if (!p.ok) throw new Error(await p.text());
        await p.json(), await r.fetchAgents(), He.value = "上下文已压缩。后续消息使用摘要；原始对话和工具记录仍然保留。", a.value.trim() === "/compact" && (a.value = "");
      } catch (p) {
        xe.value = p.message, He.value = "";
      } finally {
        te.value = !1;
      }
    }
    const st = (i) => ({ background: `conic-gradient(var(--md-primary) ${Math.max(0, Math.min(100, i))}%, var(--md-outline-variant) 0)` }), W = V(() => C.value ? r.agents.find((i) => i.plugin_id === C.value) : r.agents.find((i) => r.isHealthy(i))), Pt = (i) => i === void 0 ? "—" : `${(i / 1024 ** 3).toFixed(1)} GiB`;
    function yt() {
      try {
        const i = JSON.parse(localStorage.getItem(`0kay.agent.editor:${s.value}`) || localStorage.getItem(`0kay.agent.options:${s.value}`) || "{}");
        C.value = i.executor_id || "", U.value = i.workdir || "", N.value = ce(i.thinking_intensity), J.value = i.model_id || "MOCR", B.value = i.permission_mode === "full_access" ? "full_access" : "normal", a.value = i.draft || "", Y.value = i.mode || "general";
      } catch {
        C.value = "", U.value = "", N.value = 50, J.value = "MOCR", a.value = "", Y.value = "general";
      }
    }
    const _t = O({});
    function en(i) {
      return `${i.provider_name || (i.provider_id ? _t.value[i.provider_id] : "") || i.provider_id || i.provider}/${i.id}`;
    }
    async function rt() {
      try {
        const i = await fetch("/api/models");
        if (!i.ok) throw new Error(`模型目录 HTTP ${i.status}`);
        v.value = (await i.json()).models || [];
      } catch (i) {
        xe.value = i.message;
      }
      try {
        const i = await fetch("/api/providers");
        if (i.ok) {
          const p = (await i.json()).providers || [], c = {};
          for (const $ of p) $.name && $.id && (c[$.id] = $.name);
          _t.value = c;
        }
      } catch {
      }
    }
    function wt() {
      const i = N.value === 0 ? "off" : N.value < 35 ? "low" : N.value < 62.5 ? "medium" : N.value < 87.5 ? "high" : "max";
      return { executor_id: C.value, workdir: U.value.trim(), thinking_intensity: i, model_id: J.value, permission_mode: B.value, language: ot.value };
    }
    const te = O(!1), xe = O(""), Xe = O(!1), dt = O(!1), ze = O([]), me = V(() => ze.value[ze.value.length - 1] || null), We = O(null), pe = V(() => r.sessions.find((i) => i.session_id === s.value)), pt = (i) => i.caller_id !== "webui", tn = V(() => r.sessions.filter((i) => (dt.value ? i.state === "archived" : i.state !== "archived") && (z.value === "all" || (z.value === "life" ? pt(i) : !pt(i))) && (i.prompt || "").toLowerCase().includes(K.value.toLowerCase()))), nn = V(() => r.tasks.filter((i) => i.kind === "agent" && i.session_id === s.value).sort((i, p) => (i.started_at || "").localeCompare(p.started_at || "") || i.task_id.localeCompare(p.task_id))), fe = V(() => r.tasks.find((i) => i.session_id === s.value && ["agent", "compact"].includes(i.kind || "") && ["running", "pending"].includes(i.state))), xt = V(() => {
      const i = r.tasks.filter((Q) => Q.session_id === s.value && Q.kind === "tool" && (Q.prompt || "").trim() === "todowrite").sort((Q, et) => (Q.started_at || "").localeCompare(et.started_at || "") || Q.task_id.localeCompare(et.task_id)), p = i[i.length - 1];
      if (!p) return [];
      const c = (Q) => {
        try {
          const et = JSON.parse(Q || "");
          return Array.isArray(et?.todos) ? et.todos : [];
        } catch {
          return [];
        }
      };
      return (c(p.result).length ? c(p.result) : c(p.args)).filter((Q) => Q && typeof Q.content == "string" && Q.status !== "cancelled");
    }), Mt = V(() => xt.value.filter((i) => i.status === "completed").length), Ee = O(null);
    async function Te() {
      if (!s.value) {
        Ee.value = null;
        return;
      }
      try {
        const i = await fetch(`/api/agent/context?session_id=${encodeURIComponent(s.value)}&model_id=${encodeURIComponent(J.value)}`);
        i.ok && (Ee.value = await i.json());
      } catch {
      }
    }
    let Qe = null;
    function sn() {
      Qe && clearTimeout(Qe), Qe = setTimeout(() => void Te(), 800);
    }
    const Dt = 2 * Math.PI * 8, Rn = V(() => Math.max(0, Math.min(1, (Ee.value?.tokens || 0) / Math.max(1, Ee.value?.window || 1)))), Cn = V(() => Math.round(Rn.value * 1e3) / 10), rn = V(() => Dt * (1 - Rn.value)), ln = (i) => `${Math.round((i || 0) / 1e3 * 10) / 10}K`, an = V(() => {
      const i = Ee.value?.breakdown || {}, p = Math.max(1, Ee.value?.window || 1), c = ($) => Math.round((Number($) || 0) / p * 1e3) / 10;
      return [
        { key: "system", label: e("系统提示", "System Prompt"), pct: c(i.system) },
        { key: "tools", label: e("工具", "Tools"), pct: c(i.tools) },
        { key: "conversation", label: e("对话", "Conversation"), pct: c(i.conversation) },
        { key: "mcp", label: "MCP", pct: c(i.mcp) },
        { key: "skills", label: e("技能", "Skills"), pct: c(i.skills) }
      ];
    }), Nt = V(() => {
      const i = r.tasks.filter((p) => p.kind === "compact" && p.session_id === s.value && p.state === "done" && (p.result || "").trim());
      return i.length ? i.reduce((p, c) => (c.started_at || "") >= (p.started_at || "") ? c : p) : null;
    }), Ie = (i) => (ot.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[i] || i, ht = (i) => i ? new Date(i).toLocaleString() : "";
    function on(i) {
      return r.tasks.filter((p) => p.task_id !== i.task_id && p.session_id === i.session_id && p.parent_id === i.task_id).sort((p, c) => (p.started_at || "").localeCompare(c.started_at || "") || p.task_id.localeCompare(c.task_id));
    }
    function de(i) {
      return i ? r.tasks.filter((p) => p.task_id !== i.task_id && p.session_id === i.session_id && p.parent_id === i.task_id).sort((p, c) => (p.started_at || "").localeCompare(c.started_at || "") || p.task_id.localeCompare(c.task_id)) : [];
    }
    function lt(i) {
      const p = [];
      for (const c of on(i))
        p.push(c), c.kind === "subagent" && p.push(...lt({ ...c, session_id: i.session_id }));
      return p;
    }
    function Ln(i) {
      ze.value = [...ze.value, i];
    }
    function In() {
      ze.value = ze.value.slice(0, -1);
    }
    function un() {
      ze.value = [];
    }
    function zt(i) {
      if (!i?.result) return "";
      let p = i.result;
      try {
        const c = JSON.parse(p);
        typeof c == "string" ? p = c : c && typeof c.result == "string" && (p = c.result);
      } catch {
      }
      return !p.trim() || de(i).some((c) => c.kind === "think" && (c.result || "").trim() === p.trim()) ? "" : p;
    }
    function Je(i) {
      return i ? /User denied permission for task/i.test(i) ? e("你拒绝了这次子 Agent 调用", "You denied this sub-agent call") : /User denied permission for (\S+)/i.test(i) ? e(`你拒绝了 ${RegExp.$1} 权限`, `You denied permission for ${RegExp.$1}`) : /Permission request expired/i.test(i) ? e("权限请求已超时", "Permission request expired") : i : "";
    }
    function On(i) {
      return i.kind === "subagent" ? e("子 Agent", "Subagent") : i.kind === "tool" ? e("工具", "Tool") : i.kind === "think" ? e("模型", "Model") : i.kind || e("步骤", "Step");
    }
    function Pn(i) {
      return de(i).length;
    }
    function Qn(i) {
      return lt(i).some((p) => p.kind === "think" && p.result?.trim() === i.result?.trim());
    }
    async function Mn(i) {
      if (!pe.value || te.value || i === "delete" && !await t({
        title: e("删除会话", "Delete session"),
        message: e("永久删除此会话及其中的消息和工具记录？", "Permanently delete this session and its messages and tool records?"),
        confirmLabel: e("永久删除", "Delete"),
        danger: !0
      }))
        return;
      const p = s.value;
      te.value = !0;
      try {
        X(p), await r.manageSession(p, i), i === "delete" && (localStorage.removeItem(`0kay.agent.editor:${p}`), localStorage.removeItem(`0kay.agent.options:${p}`)), i !== "restore" ? (s.value = "", localStorage.removeItem("0kay.agent.selected")) : dt.value = !1;
      } catch (c) {
        xe.value = c.message;
      } finally {
        te.value = !1;
      }
    }
    function Ve(i) {
      te.value || (X(), s.value = i, Xe.value = !1, localStorage.setItem("0kay.agent.selected", i));
    }
    async function Dn() {
      te.value = !0, xe.value = "";
      try {
        const i = await r.createSession("新对话");
        X(), s.value = i, localStorage.setItem("0kay.agent.selected", i), Xe.value = !1, dt.value = !1;
      } catch (i) {
        xe.value = i.message;
      } finally {
        te.value = !1;
      }
    }
    async function St() {
      if (a.value.trim() === "/compact") {
        await je();
        return;
      }
      const i = d.value.length > 0;
      if (!(!a.value.trim() && !i || te.value || fe.value || pe.value?.state === "archived")) {
        te.value = !0, xe.value = "";
        try {
          const p = wt(), c = a.value.trim() || e("请查看我上传的附件。", "Please review the attached files."), $ = Y.value;
          if (!pe.value) {
            const Q = await r.createSession(c.slice(0, 60));
            localStorage.setItem(`0kay.agent.editor:${Q}`, JSON.stringify({ ...p, draft: c, mode: $ })), s.value = Q, localStorage.setItem("0kay.agent.selected", Q);
          }
          X(), i && (p.attachments = d.value.map((Q) => ({ ...Q }))), await r.sendTask(s.value, c, $, p), a.value = "", d.value = [], b.value = "", X(), Ct.value = !0, await cn();
        } catch (p) {
          xe.value = p.message;
        } finally {
          te.value = !1;
        }
      }
    }
    async function at() {
      if (!(!fe.value || fe.value.kind !== "agent"))
        try {
          await r.cancelTask(fe.value.task_id);
        } catch (i) {
          xe.value = i.message;
        }
    }
    async function cn() {
      await nt(), Ct.value && We.value?.scrollTo({ top: We.value.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return be(() => r.tasks.filter((i) => i.session_id === s.value).map((i) => `${i.task_id}:${i.state}:${i.result?.length}`).join("|"), cn), be(() => r.tasks.filter((i) => i.session_id === s.value).map((i) => `${i.task_id}:${i.state}:${i.result?.length}`).join("|"), sn), be(s, () => {
      Te();
    }), be(J, () => {
      Te();
    }), qt(() => {
      Te();
    }), be(s, () => {
      Ct.value = !0, cn(), ct(), un(), xe.value = "";
    }), be(s, yt), be(C, () => {
      ge.value = null, U.value = "", ct(), Ot();
    }, { flush: "sync" }), be(T, Ot), be(s, () => {
      He.value = "";
    }), qt(() => {
      ma(), r.connect(), yt(), rt(), vt = setInterval(Ot, 5e3), window.addEventListener("keydown", Tn);
    }), yn(() => {
      X(), ct(), r.disconnect(), vt && clearInterval(vt), window.removeEventListener("keydown", Tn);
    }), (i, p) => (m(), k(ne, null, [
      o("main", mo, [
        o("aside", vo, [
          o("header", null, [
            p[20] || (p[20] = o("h1", null, "Agent", -1)),
            o("button", {
              onClick: Dn,
              disabled: te.value,
              title: e("新建会话", "New session")
            }, [
              p[19] || (p[19] = o("svg", {
                width: "15",
                height: "15",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                o("path", {
                  d: "M12 5v14M5 12h14",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                })
              ], -1)),
              $e(" " + g(e("新对话", "New chat")), 1)
            ], 8, ko)
          ]),
          o("div", bo, [
            o("i", {
              class: ie({ online: ue(r).onlineCount > 0 })
            }, null, 2),
            $e(g(ue(r).onlineCount) + " " + g(e("个执行器在线", "executors online")) + " ", 1),
            o("button", {
              onClick: p[0] || (p[0] = (c) => ue(r).fetchAgents()),
              title: e("刷新", "Refresh"),
              "aria-label": "refresh"
            }, [...p[21] || (p[21] = [
              o("svg", {
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                o("path", {
                  d: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5",
                  stroke: "currentColor",
                  "stroke-width": "1.8",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                })
              ], -1)
            ])], 8, yo)
          ]),
          vn(o("input", {
            "onUpdate:modelValue": p[1] || (p[1] = (c) => K.value = c),
            placeholder: e("搜索会话…", "Search sessions…"),
            "aria-label": e("搜索会话", "Search sessions")
          }, null, 8, _o), [
            [Wn, K.value]
          ]),
          o("nav", wo, [
            (m(!0), k(ne, null, ve([{ id: "all", label: e("全部", "All") }, { id: "life", label: e("LIFE 发起", "From LIFE") }, { id: "user", label: e("我的对话", "My chats") }], (c) => (m(), k("button", {
              key: c.id,
              class: ie({ chosen: z.value === c.id }),
              onClick: ($) => z.value = c.id
            }, g(c.label), 11, xo))), 128))
          ]),
          o("label", So, [
            vn(o("input", {
              "onUpdate:modelValue": p[2] || (p[2] = (c) => dt.value = c),
              type: "checkbox"
            }, null, 512), [
              [Er, dt.value]
            ]),
            $e(" " + g(e("显示已归档会话", "Show archived sessions")), 1)
          ]),
          o("div", To, [
            (m(!0), k(ne, null, ve(tn.value, (c) => (m(), k("button", {
              key: c.task_id,
              class: ie(["session-card", { selected: s.value === c.session_id && !Xe.value }]),
              disabled: te.value,
              onClick: ($) => Ve(c.session_id)
            }, [
              o("span", Eo, g(pt(c) ? "LIFE → Agent" : e("你 ↔ Agent", "You ↔ Agent")), 1),
              o("strong", null, g(c.prompt || "未命名会话"), 1),
              o("small", null, g(ht(c.started_at)), 1)
            ], 10, Ao))), 128)),
            tn.value.length ? I("", !0) : (m(), k("p", $o, g(e("暂无会话。直接发送消息，或等待 LIFE 委派工作。", "No sessions yet. Send a message or wait for LIFE to delegate work.")), 1))
          ]),
          o("button", {
            class: ie(["ledger-button", { chosen: Xe.value }]),
            onClick: p[3] || (p[3] = (c) => Xe.value = !0)
          }, g(e("全部任务记录", "All task records")) + " · " + g(ue(r).tasks.length), 3)
        ]),
        Xe.value ? (m(), k("section", Ro, [
          o("header", null, [
            o("h2", null, g(e("全部任务记录", "All task records")), 1),
            o("button", {
              onClick: p[4] || (p[4] = (c) => Xe.value = !1)
            }, g(e("返回会话", "Back to chat")), 1)
          ]),
          o("p", Co, g(e("包括 LIFE 对话、模型调用、Agent 执行及工具活动。", "LIFE conversations, model calls, Agent execution and tool activity.")), 1),
          (m(!0), k(ne, null, ve(ue(r).tasks, (c) => (m(), k("article", {
            key: c.task_id,
            class: "ledger-entry"
          }, [
            o("div", null, [
              o("span", null, g(c.kind || "agent"), 1),
              o("span", {
                class: ie(c.state)
              }, g(Ie(c.state)), 3),
              o("small", null, g(ht(c.started_at)), 1)
            ]),
            o("p", null, g(c.prompt), 1),
            ue(r).sessions.some(($) => $.session_id === c.session_id) ? (m(), k("button", {
              key: 0,
              onClick: ($) => Ve(c.session_id)
            }, "打开所属会话", 8, Lo)) : I("", !0),
            o("details", null, [
              p[22] || (p[22] = o("summary", null, "详情", -1)),
              o("code", null, g(c.task_id), 1),
              o("pre", null, g(c.result || c.error || "等待结果"), 1)
            ])
          ]))), 128))
        ])) : (m(), k("section", Io, [
          o("header", Oo, [
            o("div", null, [
              o("h2", null, g(pe.value?.prompt || "与 Agent 对话"), 1),
              o("p", null, g(pe.value && pt(pe.value) ? "LIFE 发起的工作会话 · 你可以查看过程，也可以直接继续对话" : "持续对话 · 编程、调研与工具执行"), 1)
            ]),
            fe.value ? (m(), k("span", Po, "正在执行")) : I("", !0),
            pe.value ? (m(), k("div", Mo, [
              o("button", {
                disabled: !!fe.value,
                onClick: p[5] || (p[5] = (c) => Mn(pe.value.state === "archived" ? "restore" : "archive"))
              }, g(pe.value.state === "archived" ? "恢复" : "归档"), 9, Do),
              o("button", {
                disabled: !!fe.value,
                onClick: p[6] || (p[6] = (c) => Mn("delete"))
              }, "删除", 8, No)
            ])) : I("", !0)
          ]),
          xe.value || ue(r).error ? (m(), k("div", zo, g(xe.value || ue(r).error), 1)) : I("", !0),
          T.value ? (m(), k("section", Uo, [
            W.value ? (m(), k(ne, { key: 0 }, [
              o("strong", null, g(W.value.host?.hostname || W.value.name), 1),
              o("span", {
                class: ie(ue(r).isHealthy(W.value) ? "done" : "failed")
              }, g(ue(r).isHealthy(W.value) ? "在线" : "离线"), 3),
              o("div", Fo, [
                (m(!0), k(ne, null, ve([{ label: "CPU 占用", value: ge.value?.cpu_percent }, { label: "内存占用", value: ge.value?.memory_percent }], (c) => (m(), k("div", {
                  key: c.label,
                  class: "usage-metric"
                }, [
                  o("div", {
                    class: "usage-ring",
                    style: Gt(st(c.value || 0))
                  }, [
                    o("b", null, g(c.value === void 0 ? "—" : `${c.value.toFixed(1)}%`), 1)
                  ], 4),
                  o("span", null, g(c.label), 1)
                ]))), 128)),
                o("small", null, g(ge.value ? `采样时间：${ht(ge.value.sampled_at)}` : "等待宿主机实时采样"), 1)
              ]),
              o("dl", null, [
                o("div", null, [
                  p[23] || (p[23] = o("dt", null, "执行器地址", -1)),
                  o("dd", null, g(W.value.address), 1)
                ]),
                o("div", null, [
                  p[24] || (p[24] = o("dt", null, "系统 / 架构", -1)),
                  o("dd", null, g(W.value.host?.os || "—") + " / " + g(W.value.host?.arch || "—"), 1)
                ]),
                o("div", null, [
                  p[25] || (p[25] = o("dt", null, "CPU", -1)),
                  o("dd", null, g(W.value.host?.cpu_model || "—") + " · " + g(W.value.host?.cpu_cores || "—") + " 核", 1)
                ]),
                o("div", null, [
                  p[26] || (p[26] = o("dt", null, "可用 / 总内存", -1)),
                  o("dd", null, g(Pt(W.value.host?.memory_available_bytes)) + " / " + g(Pt(W.value.host?.memory_total_bytes)), 1)
                ]),
                o("div", null, [
                  p[27] || (p[27] = o("dt", null, "活跃任务", -1)),
                  o("dd", null, g(W.value.active_tasks), 1)
                ]),
                o("div", null, [
                  p[28] || (p[28] = o("dt", null, "距上次心跳", -1)),
                  o("dd", null, g(W.value.last_heartbeat_age_seconds) + " 秒", 1)
                ]),
                o("div", null, [
                  p[29] || (p[29] = o("dt", null, "默认工作目录", -1)),
                  o("dd", null, g(W.value.host?.workdir || "—"), 1)
                ])
              ])
            ], 64)) : (m(), k("p", Bo, "没有可用的执行器宿主机信息。"))
          ])) : I("", !0),
          o("div", {
            ref_key: "transcript",
            ref: We,
            class: "transcript",
            onScrollPassive: En
          }, [
            me.value ? (m(), k("div", Ho, [
              o("header", jo, [
                o("button", {
                  type: "button",
                  onClick: In
                }, "← " + g(ze.value.length > 1 ? e("返回上一层", "Back one level") : e("返回会话", "Back to chat")), 1),
                o("div", null, [
                  o("h3", null, g(e("子 Agent", "Subagent")), 1),
                  o("p", Wo, g(me.value.prompt), 1)
                ]),
                o("span", {
                  class: ie(me.value.state)
                }, g(Ie(me.value.state)), 3)
              ]),
              o("div", Vo, [
                o("div", qo, [
                  o("div", Go, [
                    o("b", null, g(e("父 Agent", "Parent agent")), 1),
                    o("time", null, g(ht(me.value.started_at)), 1)
                  ]),
                  o("div", Yo, g(me.value.prompt), 1)
                ]),
                (m(!0), k(ne, null, ve(de(me.value), (c) => (m(), k(ne, {
                  key: c.task_id
                }, [
                  c.kind === "think" && (c.result || c.reasoning || c.state === "running" || c.error) ? (m(), k("div", Zo, [
                    c.prompt ? (m(), k("small", Ko, g(c.prompt), 1)) : I("", !0),
                    c.reasoning ? (m(), k("details", {
                      key: 1,
                      class: "think-chain",
                      open: c.state === "running" && !c.result
                    }, [
                      o("summary", null, g(e("思维链", "Reasoning")), 1),
                      o("pre", null, g(c.reasoning), 1)
                    ], 8, Xo)) : I("", !0),
                    c.result ? (m(), k(ne, { key: 2 }, [
                      Be(mn, {
                        content: c.result
                      }, null, 8, ["content"]),
                      c.state === "running" ? (m(), k("span", Qo, " ▍")) : I("", !0)
                    ], 64)) : c.state === "running" ? (m(), k("small", Jo, g(e("子 Agent 正在生成回复…", "Subagent is drafting a reply…")), 1)) : I("", !0),
                    c.error ? (m(), k("p", ei, g(Je(c.error)), 1)) : I("", !0)
                  ])) : c.kind === "subagent" ? (m(), k("div", ti, [
                    o("button", {
                      type: "button",
                      class: "subagent-card-head",
                      onClick: ($) => Ln(c)
                    }, [
                      o("span", {
                        class: ie(c.state)
                      }, "●", 2),
                      o("strong", null, g(e("子 Agent", "Subagent")), 1),
                      o("span", si, g(c.prompt), 1),
                      o("small", null, g(Ie(c.state)), 1),
                      p[30] || (p[30] = o("span", {
                        class: "subagent-chevron",
                        "aria-hidden": "true"
                      }, "▸", -1))
                    ], 8, ni)
                  ])) : c.kind === "tool" ? (m(), Et(Js, {
                    key: 2,
                    step: c,
                    "format-error": Je
                  }, null, 8, ["step"])) : c.kind !== "think" ? (m(), k("details", ri, [
                    o("summary", null, [
                      o("span", {
                        class: ie(c.state)
                      }, "●", 2),
                      $e(" " + g(On(c)) + " · " + g(c.prompt) + " ", 1),
                      o("small", null, g(Ie(c.state)), 1)
                    ]),
                    o("pre", null, g(c.result || c.error || (c.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                  ])) : I("", !0)
                ], 64))), 128)),
                zt(me.value) ? (m(), k("div", li, [
                  Be(mn, {
                    content: zt(me.value)
                  }, null, 8, ["content"])
                ])) : I("", !0),
                me.value.error ? (m(), k("p", ai, g(Je(me.value.error)), 1)) : I("", !0),
                !de(me.value).length && !zt(me.value) && !me.value.error ? (m(), k("p", oi, g(me.value.state === "running" ? e("子 Agent 正在执行…", "Subagent is running…") : e("没有子步骤记录", "No child steps recorded")), 1)) : I("", !0)
              ])
            ])) : (m(), k(ne, { key: 1 }, [
              !nn.value.length && !Nt.value ? (m(), k("div", ii, [...p[31] || (p[31] = [
                o("h2", null, "想让 Agent 帮你做什么？", -1),
                o("p", null, "直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。", -1),
                o("p", null, "左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。", -1)
              ])])) : I("", !0),
              Nt.value ? (m(), k("article", ui, [
                o("div", ci, [
                  o("strong", null, g(e("上下文摘要", "Context summary")), 1),
                  o("time", null, g(ht(Nt.value.started_at)), 1)
                ]),
                Be(mn, {
                  content: Nt.value.result || ""
                }, null, 8, ["content"])
              ])) : I("", !0),
              (m(!0), k(ne, null, ve(nn.value, (c) => (m(), k("article", {
                key: c.task_id,
                class: "turn"
              }, [
                o("div", di, [
                  o("div", pi, [
                    o("b", null, g(pt(c) ? "LIFE" : "你"), 1),
                    o("time", null, g(ht(c.started_at)), 1)
                  ]),
                  o("div", hi, g(c.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, "")), 1)
                ]),
                o("div", fi, [
                  o("div", gi, [
                    p[32] || (p[32] = o("b", null, "Agent", -1)),
                    o("span", {
                      class: ie(c.state)
                    }, g(Ie(c.state)), 3)
                  ]),
                  on(c).length ? (m(), k("div", mi, [
                    (m(!0), k(ne, null, ve(on(c), ($) => (m(), k(ne, {
                      key: $.task_id
                    }, [
                      $.kind === "think" && ($.result || $.reasoning || $.state === "running" || $.error) ? (m(), k("div", vi, [
                        $.prompt ? (m(), k("small", ki, g($.prompt), 1)) : I("", !0),
                        $.reasoning ? (m(), k("details", {
                          key: 1,
                          class: "think-chain",
                          open: $.state === "running" && !$.result
                        }, [
                          o("summary", null, g(e("思维链", "Reasoning")), 1),
                          o("pre", null, g($.reasoning), 1)
                        ], 8, bi)) : I("", !0),
                        $.result ? (m(), k(ne, { key: 2 }, [
                          Be(mn, {
                            content: $.result
                          }, null, 8, ["content"]),
                          $.state === "running" ? (m(), k("span", yi, " ▍")) : I("", !0)
                        ], 64)) : $.state === "running" ? (m(), k("small", _i, "Agent 正在生成回复…")) : I("", !0),
                        $.error ? (m(), k("p", wi, g(Je($.error)), 1)) : I("", !0)
                      ])) : $.kind === "subagent" ? (m(), k("div", xi, [
                        o("button", {
                          type: "button",
                          class: "subagent-card-head",
                          onClick: (Q) => Ln($)
                        }, [
                          o("span", {
                            class: ie($.state)
                          }, "●", 2),
                          o("strong", null, g(e("子 Agent", "Subagent")), 1),
                          o("span", Ti, g($.prompt), 1),
                          o("small", null, [
                            $e(g(Ie($.state)), 1),
                            Pn($) ? (m(), k(ne, { key: 0 }, [
                              $e(" · " + g(Pn($)) + " " + g(e("步", "steps")), 1)
                            ], 64)) : I("", !0)
                          ]),
                          p[33] || (p[33] = o("span", {
                            class: "subagent-chevron",
                            "aria-hidden": "true"
                          }, "▸", -1))
                        ], 8, Si),
                        $.error ? (m(), k("p", Ai, g(Je($.error)), 1)) : I("", !0)
                      ])) : $.kind === "tool" ? (m(), Et(Js, {
                        key: 2,
                        step: $,
                        "format-error": Je
                      }, null, 8, ["step"])) : $.kind !== "think" ? (m(), k("details", Ei, [
                        o("summary", null, [
                          o("span", {
                            class: ie($.state)
                          }, "●", 2),
                          $e(" " + g(On($)) + " · " + g($.prompt) + " ", 1),
                          o("small", null, g(Ie($.state)), 1)
                        ]),
                        o("pre", null, g($.result || $.error || ($.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                      ])) : I("", !0)
                    ], 64))), 128))
                  ])) : I("", !0),
                  c.result && !Qn(c) ? (m(), Et(mn, {
                    key: 1,
                    content: c.result
                  }, null, 8, ["content"])) : I("", !0),
                  c.error ? (m(), k("div", $i, g(Je(c.error)), 1)) : I("", !0),
                  ["running", "pending"].includes(c.state) ? (m(), k("p", Ri, "Agent 正在处理，执行过程会自动更新…")) : I("", !0)
                ])
              ]))), 128))
            ], 64))
          ], 544),
          me.value ? I("", !0) : (m(), k("form", {
            key: 2,
            class: "composer",
            onSubmit: Ne(St, ["prevent"])
          }, [
            xt.value.length ? (m(), k("section", {
              key: 0,
              class: "todo-panel",
              "aria-label": e("待办清单", "Todo list")
            }, [
              o("header", null, [
                o("strong", null, g(e("待办", "Todo")), 1),
                o("span", null, g(Mt.value) + "/" + g(xt.value.length), 1)
              ]),
              o("ul", null, [
                (m(!0), k(ne, null, ve(xt.value, (c, $) => (m(), k("li", {
                  key: $,
                  class: ie(c.status)
                }, [
                  o("span", Li, g(c.status === "completed" ? "✓" : c.status === "in_progress" ? "◐" : "○"), 1),
                  o("span", Ii, g(c.content), 1)
                ], 2))), 128))
              ])
            ], 8, Ci)) : I("", !0),
            He.value ? (m(), k("div", Oi, g(He.value), 1)) : I("", !0),
            o("div", {
              class: ie(["options-collapse", { open: ae.value }])
            }, [
              o("div", Pi, [
                o("label", null, [
                  $e(g(e("权限", "Permissions")), 1),
                  Be(Hn, {
                    modelValue: B.value,
                    "onUpdate:modelValue": p[7] || (p[7] = (c) => B.value = c),
                    "aria-label": e("权限", "Permissions"),
                    disabled: !!fe.value || te.value,
                    options: [{ value: "normal", label: e("Normal · 全部审批", "Normal · Ask every time") }, { value: "full_access", label: e("Full access · 自动执行", "Full access · Auto execute") }]
                  }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
                ]),
                o("label", null, [
                  $e(g(e("执行器", "Executor")), 1),
                  Be(Hn, {
                    modelValue: C.value,
                    "onUpdate:modelValue": p[8] || (p[8] = (c) => C.value = c),
                    "aria-label": e("执行器", "Executor"),
                    disabled: !!fe.value || te.value,
                    options: [{ value: "", label: e("自动选择在线执行器", "Automatic executor") }, ...ue(r).agents.map((c) => ({ value: c.plugin_id, label: `${c.host?.hostname || c.name} · ${c.plugin_id}`, disabled: !ue(r).isHealthy(c) }))]
                  }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
                ]),
                o("label", null, [
                  $e(g(e("工作区", "Workspace")), 1),
                  o("button", {
                    type: "button",
                    class: "workspace-select",
                    disabled: !!fe.value || te.value || !W.value,
                    title: U.value || W.value?.host?.workdir,
                    onClick: p[9] || (p[9] = (c) => Ke(U.value || W.value?.host?.workdir || ""))
                  }, [
                    p[34] || (p[34] = o("svg", {
                      width: "14",
                      height: "14",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      "aria-hidden": "true"
                    }, [
                      o("path", {
                        d: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
                        stroke: "currentColor",
                        "stroke-width": "1.7",
                        "stroke-linejoin": "round"
                      })
                    ], -1)),
                    $e(" " + g(U.value || e("选择目录…", "Select folder…")), 1)
                  ], 8, Mi)
                ]),
                Be(fo, {
                  modelValue: N.value,
                  "onUpdate:modelValue": p[10] || (p[10] = (c) => N.value = c),
                  disabled: !!fe.value || te.value
                }, null, 8, ["modelValue", "disabled"]),
                o("label", null, [
                  $e(g(e("模型", "Model")), 1),
                  Be(Hn, {
                    modelValue: J.value,
                    "onUpdate:modelValue": p[11] || (p[11] = (c) => J.value = c),
                    searchable: "",
                    "aria-label": e("模型", "Model"),
                    disabled: !!fe.value || te.value,
                    onOpen: rt,
                    options: [{ value: "MOCR", label: e("MOCR · 自动选型", "MOCR · Automatic") }, ...v.value.map((c) => ({ value: c.id, label: en(c) }))]
                  }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
                ])
              ])
            ], 2),
            o("input", {
              ref_key: "fileInput",
              ref: _,
              type: "file",
              multiple: "",
              hidden: "",
              onChange: F
            }, null, 544),
            o("div", {
              ref_key: "composerInput",
              ref: oe,
              class: "composer-input"
            }, [
              (m(), Et(Zn, { to: "body" }, [
                ee.value ? (m(), k("div", {
                  key: 0,
                  class: "slash-menu",
                  style: Gt(It.value),
                  role: "listbox",
                  "aria-label": e("技能与命令", "Skills and commands")
                }, [
                  (m(!0), k(ne, null, ve(kt.value, (c, $) => (m(), k("button", {
                    key: c.name,
                    type: "button",
                    class: ie(["slash-item", { active: $ === Ce.value }]),
                    role: "option",
                    "aria-selected": $ === Ce.value,
                    onMousedown: Ne((Q) => Jt(c), ["prevent"]),
                    onMouseenter: (Q) => Ce.value = $
                  }, [
                    o("span", zi, "/" + g(c.name), 1),
                    o("span", Ui, g(c.description), 1)
                  ], 42, Ni))), 128))
                ], 12, Di)) : I("", !0)
              ])),
              d.value.length || b.value ? (m(), k("div", Fi, [
                (m(!0), k(ne, null, ve(d.value, (c, $) => (m(), k("span", {
                  key: $,
                  class: "attach-chip",
                  title: `${c.mime} · ${c.size} B`
                }, [
                  $e(g(c.name) + " ", 1),
                  o("button", {
                    type: "button",
                    "aria-label": e("移除附件", "Remove attachment"),
                    title: e("移除", "Remove"),
                    onClick: (Q) => E($)
                  }, "×", 8, Hi)
                ], 8, Bi))), 128)),
                b.value ? (m(), k("span", ji, g(b.value), 1)) : I("", !0)
              ])) : I("", !0),
              vn(o("textarea", {
                "onUpdate:modelValue": p[12] || (p[12] = (c) => a.value = c),
                disabled: te.value || pe.value?.state === "archived",
                placeholder: pe.value?.state === "archived" ? "恢复会话后可以继续对话" : "给 Agent 发消息…（Enter 发送，Shift+Enter 换行，可 Ctrl+V 粘贴图片/文件）",
                "aria-label": "给 Agent 发消息",
                onKeydown: Ze,
                onPaste: L
              }, null, 40, Wi), [
                [Wn, a.value]
              ]),
              o("div", Vi, [
                o("button", {
                  type: "button",
                  class: "attach-fly",
                  disabled: !!fe.value || te.value || u.value || pe.value?.state === "archived",
                  "aria-label": e("添加附件", "Add attachment"),
                  title: u.value ? e("上传中…", "Uploading…") : e("添加附件（也可 Ctrl+V 粘贴）", "Attach (or Ctrl+V to paste)"),
                  onClick: S
                }, [...p[35] || (p[35] = [
                  o("svg", {
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    "aria-hidden": "true"
                  }, [
                    o("path", {
                      d: "M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6",
                      stroke: "currentColor",
                      "stroke-width": "1.7",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ], -1)
                ])], 8, qi),
                fe.value?.kind !== "agent" ? (m(), k("button", {
                  key: 0,
                  type: "submit",
                  class: "send-fly",
                  disabled: te.value || !!fe.value || !a.value.trim() || pe.value?.state === "archived",
                  "aria-label": e("发送", "Send"),
                  title: e("发送", "Send")
                }, [...p[36] || (p[36] = [
                  o("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    "aria-hidden": "true"
                  }, [
                    o("path", {
                      d: "M3.6 11.2 20.4 4l-7.1 16.4-2.5-6.8-7.2-2.4z",
                      stroke: "currentColor",
                      "stroke-width": "1.7",
                      "stroke-linejoin": "round"
                    }),
                    o("path", {
                      d: "m10.8 13.6 3.4-3.4",
                      stroke: "currentColor",
                      "stroke-width": "1.7",
                      "stroke-linecap": "round"
                    })
                  ], -1)
                ])], 8, Gi)) : (m(), k("button", {
                  key: 1,
                  type: "button",
                  class: "send-fly stop",
                  onClick: at,
                  "aria-label": e("停止", "Stop"),
                  title: e("停止", "Stop")
                }, [...p[37] || (p[37] = [
                  o("svg", {
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    "aria-hidden": "true"
                  }, [
                    o("rect", {
                      x: "7",
                      y: "7",
                      width: "10",
                      height: "10",
                      rx: "2",
                      fill: "currentColor"
                    })
                  ], -1)
                ])], 8, Yi))
              ])
            ], 512),
            o("footer", null, [
              Ee.value ? (m(), k("div", {
                key: 0,
                class: "ctx-usage",
                tabindex: "0",
                "aria-label": e("上下文用量", "Context usage")
              }, [
                (m(), k("svg", Ki, [
                  p[38] || (p[38] = o("circle", {
                    class: "ctx-track",
                    cx: "10",
                    cy: "10",
                    r: "8"
                  }, null, -1)),
                  o("circle", {
                    class: "ctx-fill",
                    cx: "10",
                    cy: "10",
                    r: "8",
                    "stroke-dasharray": Dt,
                    "stroke-dashoffset": rn.value
                  }, null, 8, Xi)
                ])),
                o("div", Qi, [
                  o("strong", null, g(e("上下文用量", "Context Usage")), 1),
                  o("div", Ji, [
                    o("b", null, g(Cn.value) + "%", 1),
                    o("span", null, g(e("已用", "Used")), 1)
                  ]),
                  o("div", eu, g(ln(Ee.value.tokens)) + " / " + g(ln(Ee.value.window)), 1),
                  (m(!0), k(ne, null, ve(an.value, (c) => (m(), k("div", {
                    class: "ctx-row",
                    key: c.key
                  }, [
                    o("span", null, g(c.label), 1),
                    o("span", null, g(c.pct) + "%", 1)
                  ]))), 128))
                ])
              ], 8, Zi)) : I("", !0),
              o("button", {
                type: "button",
                class: ie(["options-toggle", { open: ae.value }]),
                "aria-expanded": ae.value,
                onClick: p[13] || (p[13] = (c) => ae.value = !ae.value)
              }, g(ae.value ? e("收起", "Less") : e("设置", "Settings")), 11, tu),
              Be(Hn, {
                modelValue: Y.value,
                "onUpdate:modelValue": p[14] || (p[14] = (c) => Y.value = c),
                disabled: te.value,
                "aria-label": e("Agent 模式", "Agent mode"),
                options: [{ value: "general", label: e("通用 Agent", "General Agent") }, { value: "code", label: e("编程 Agent", "Coding Agent") }, { value: "research", label: e("调研 Agent", "Research Agent") }, { value: "science", label: e("科学 Agent", "Science Agent") }]
              }, null, 8, ["modelValue", "disabled", "aria-label", "options"]),
              o("button", {
                type: "button",
                onClick: p[15] || (p[15] = (c) => T.value = !T.value)
              }, g(e("宿主机", "Host")), 1),
              o("button", {
                type: "button",
                disabled: !pe.value || !!fe.value || te.value || pe.value.state === "archived",
                onClick: je
              }, "/compact", 8, nu),
              o("span", su, g(fe.value?.kind === "compact" ? e("上下文压缩中…", "Compacting…") : ue(r).onlineCount ? e("在当前会话中继续", "Continue this session") : e("执行器离线", "Executor offline")), 1)
            ])
          ], 32))
        ])),
        R.value ? (m(), k("div", {
          key: 2,
          class: "directory-backdrop",
          onClick: Ne(ct, ["self"])
        }, [
          o("section", ru, [
            o("header", null, [
              o("h2", null, "选择 " + g(W.value?.host?.hostname || "执行器") + " 的工作区", 1),
              o("button", { onClick: ct }, "关闭")
            ]),
            o("div", lu, [
              (m(!0), k(ne, null, ve(j.value.roots, (c) => (m(), k("button", {
                key: c,
                disabled: P.value,
                onClick: ($) => Ke(c)
              }, g(c), 9, au))), 128)),
              o("button", {
                disabled: P.value,
                onClick: p[16] || (p[16] = (c) => Ke(W.value?.host?.workdir || ""))
              }, "默认目录", 8, ou)
            ]),
            o("code", null, g(j.value.path), 1),
            o("form", {
              class: "new-folder",
              onSubmit: Ne(f, ["prevent"])
            }, [
              vn(o("input", {
                "onUpdate:modelValue": p[17] || (p[17] = (c) => y.value = c),
                placeholder: "新文件夹名称",
                "aria-label": "新文件夹名称",
                disabled: P.value
              }, null, 8, iu), [
                [Wn, y.value]
              ]),
              o("button", {
                disabled: P.value || !y.value.trim() || !j.value.path
              }, "新建文件夹", 8, uu)
            ], 32),
            se.value ? (m(), k("p", cu, g(se.value), 1)) : I("", !0),
            P.value ? (m(), k("p", du, "正在读取目录…")) : (m(), k("div", pu, [
              j.value.parent !== j.value.path ? (m(), k("button", {
                key: 0,
                onClick: p[18] || (p[18] = (c) => Ke(j.value.parent))
              }, "上一级")) : I("", !0),
              (m(!0), k(ne, null, ve(j.value.directories, (c) => (m(), k("button", {
                key: c.path,
                onClick: ($) => Ke(c.path)
              }, [
                p[39] || (p[39] = o("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  "aria-hidden": "true"
                }, [
                  o("path", {
                    d: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
                    stroke: "currentColor",
                    "stroke-width": "1.7",
                    "stroke-linejoin": "round"
                  })
                ], -1)),
                $e(" " + g(c.name), 1)
              ], 8, hu))), 128)),
              j.value.directories.length ? I("", !0) : (m(), k("p", fu, "没有子目录"))
            ])),
            o("footer", null, [
              o("button", {
                disabled: P.value || !!se.value || !j.value.path,
                onClick: $n
              }, "选择当前目录", 8, gu)
            ])
          ])
        ])) : I("", !0)
      ]),
      Be(go)
    ], 64));
  }
}), bu = /* @__PURE__ */ _s(mu, [["__scopeId", "data-v-c64cf9c9"]]);
export {
  bu as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('agent-plugin-style')){const s=document.createElement('style');s.id='agent-plugin-style';s.textContent=".markdown-content[data-v-ef377647]{line-height:1.75;overflow-wrap:anywhere;font-size:14px}.markdown-content[data-v-ef377647] pre{padding:16px;background:var(--md-surface-container);border-radius:8px;overflow:auto;white-space:pre;line-height:1.5}.markdown-content[data-v-ef377647] code{font-family:monospace;background:var(--md-surface-container);padding:2px 4px;border-radius:4px}.markdown-content[data-v-ef377647] pre code{padding:0;background:none}.markdown-content[data-v-ef377647] table{display:block;overflow:auto;border-collapse:collapse;margin:12px 0}.markdown-content[data-v-ef377647] th,.markdown-content[data-v-ef377647] td{border:1px solid var(--md-outline-variant);padding:8px 12px}.markdown-content[data-v-ef377647] blockquote{border-left:3px solid var(--md-outline);margin:12px 0;padding-left:14px;color:var(--md-on-surface-variant)}.markdown-content[data-v-ef377647] ul,.markdown-content[data-v-ef377647] ol{padding-left:24px}.markdown-content[data-v-ef377647] a{color:var(--md-primary);text-decoration:underline}.markdown-content[data-v-ef377647] img{max-width:100%}.markdown-content[data-v-ef377647] h1,.markdown-content[data-v-ef377647] h2,.markdown-content[data-v-ef377647] h3{margin:16px 0 8px}.tool-card[data-v-f13fbd25]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container);margin:8px 0;overflow:hidden}button.tool-card-head[data-v-f13fbd25]{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:none;border-radius:0;background:transparent;padding:10px 12px;cursor:pointer;font-size:13px}.tool-kind[data-v-f13fbd25]{flex-shrink:0;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--md-on-surface)}.tool-summary[data-v-f13fbd25]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font);font-size:13px;color:var(--md-on-surface)}.tool-stat[data-v-f13fbd25]{flex-shrink:0;font-size:12px;font-weight:600;color:var(--md-primary);border:1px solid var(--md-outline-variant);border-radius:999px;padding:1px 8px}.tool-state[data-v-f13fbd25]{flex-shrink:0;font-size:13px;color:var(--md-on-surface-variant)}.tool-chevron[data-v-f13fbd25]{flex-shrink:0;color:var(--md-on-surface-variant);font-size:12px;transition:transform .15s}.tool-card.expanded .tool-chevron[data-v-f13fbd25]{transform:rotate(90deg)}.tool-dot[data-v-f13fbd25]{font-size:9px}.tool-dot.running[data-v-f13fbd25],.tool-dot.pending[data-v-f13fbd25]{color:#b88412}.tool-dot.failed[data-v-f13fbd25]{color:var(--md-error,#c44)}.tool-dot.done[data-v-f13fbd25]{color:#3a6}.tool-dot.cancelled[data-v-f13fbd25]{color:var(--md-on-surface-variant)}.tool-card-body[data-v-f13fbd25]{padding:4px 12px 12px;border-top:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}.tool-section-label[data-v-f13fbd25]{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--md-on-surface-variant);margin-top:4px}.tool-card-body pre[data-v-f13fbd25]{margin:0;max-height:340px;overflow:auto;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);border-radius:8px;padding:8px 10px;font-family:var(--code-font);font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.tool-shot[data-v-f13fbd25]{margin:0;display:flex;flex-direction:column;gap:6px}.tool-shot img[data-v-f13fbd25]{width:100%;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest);display:block}.tool-shot figcaption[data-v-f13fbd25]{font-family:var(--code-font);font-size:11.5px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-section-text[data-v-f13fbd25]{margin:0;font-size:13px;overflow-wrap:anywhere}.tool-error[data-v-f13fbd25]{background:var(--md-error-container);padding:8px 12px;border-radius:8px;margin:0;font-size:12px;overflow-wrap:anywhere}.muted[data-v-f13fbd25]{font-size:12px;color:var(--md-on-surface-variant);margin:0}.tool-dialog-backdrop[data-v-f13fbd25]{position:fixed;inset:0;background:#0008;z-index:1050;display:grid;place-items:center;padding:20px}.tool-dialog[data-v-f13fbd25]{background:var(--md-surface);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:18px 20px;width:min(680px,100%);max-height:82vh;overflow:auto;display:flex;flex-direction:column;gap:12px}.tool-dialog header[data-v-f13fbd25]{display:flex;align-items:center;justify-content:space-between;gap:12px}.tool-dialog h4[data-v-f13fbd25]{margin:0;font-size:15px;overflow-wrap:anywhere;flex:1;min-width:0}#app .tool-dialog-close[data-v-f13fbd25],.tool-dialog-close[data-v-f13fbd25]{flex-shrink:0;width:40px;height:40px;min-height:0;padding:0;border:none;border-radius:50%;background:transparent;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}#app .tool-dialog-close[data-v-f13fbd25]:hover,.tool-dialog-close[data-v-f13fbd25]:hover{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent);box-shadow:none;filter:none;color:var(--md-on-surface)}#app .tool-dialog-close[data-v-f13fbd25]:active,.tool-dialog-close[data-v-f13fbd25]:active{background:color-mix(in srgb,var(--md-on-surface) 12%,transparent);border-radius:50%}.tool-search-results[data-v-f13fbd25]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}.tool-search-results a[data-v-f13fbd25]{color:var(--md-primary);font-size:14px;font-weight:500;text-decoration:none}.tool-search-results a[data-v-f13fbd25]:hover{text-decoration:underline}.tool-search-results p[data-v-f13fbd25]{margin:4px 0 0;font-size:13px;line-height:1.65;color:var(--md-on-surface)}.tool-search-results small[data-v-f13fbd25]{display:block;margin-top:2px;font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-card[data-v-f13fbd25]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent);background:var(--md-surface-container);transition:box-shadow .22s,background-color .2s}.tool-card[data-v-f13fbd25]:hover{box-shadow:var(--shadow-1)}button.tool-card-head[data-v-f13fbd25]{padding:12px 15px;gap:10px;min-height:46px;border-radius:0}button.tool-card-head[data-v-f13fbd25]:hover{background:var(--md-secondary-container)}.tool-kind[data-v-f13fbd25]{font-weight:700;letter-spacing:.06em}.tool-stat[data-v-f13fbd25]{border-color:color-mix(in srgb,var(--md-primary) 30%,transparent);background:color-mix(in srgb,var(--md-primary) 10%,transparent)}.tool-chevron[data-v-f13fbd25]{width:22px;height:22px;display:inline-grid;place-items:center;border-radius:50%;background:var(--md-surface-container-high);transition:transform .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}.tool-card-body[data-v-f13fbd25]{padding:8px 15px 15px;gap:8px;border-top-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-card-body pre[data-v-f13fbd25]{border-radius:14px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-section-label[data-v-f13fbd25]{font-weight:700}.diff-wrap[data-v-f13fbd25]{display:flex;flex-direction:column;gap:10px}.diff-file[data-v-f13fbd25]{border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);border-radius:14px;overflow:hidden;background:var(--md-surface-container-lowest)}.diff-file-head[data-v-f13fbd25]{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;background:var(--md-surface-container);font-size:11.5px;font-weight:650}.diff-file-path[data-v-f13fbd25]{font-family:var(--code-font);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.diff-file-stat[data-v-f13fbd25]{flex:none;font-family:var(--code-font);color:var(--md-on-surface-variant)}.diff-body[data-v-f13fbd25]{max-height:360px;overflow:auto;font-family:var(--code-font);font-size:12px;line-height:1.55;padding:4px 0}.diff-line[data-v-f13fbd25]{display:grid;grid-template-columns:40px 40px 18px 1fr;white-space:pre;min-width:max-content}.diff-no[data-v-f13fbd25]{text-align:right;padding:0 6px;color:var(--md-on-surface-variant);opacity:.6;user-select:none;font-variant-numeric:tabular-nums}.diff-sign[data-v-f13fbd25]{text-align:center;user-select:none;opacity:.9}.diff-text[data-v-f13fbd25]{padding-right:12px}.diff-line.add[data-v-f13fbd25]{background:color-mix(in srgb,#2ea043 20%,transparent);color:#116329}.diff-line.del[data-v-f13fbd25]{background:color-mix(in srgb,#cf222e 18%,transparent);color:#82071e}.diff-line.add .diff-sign[data-v-f13fbd25]{color:#116329;font-weight:700}.diff-line.del .diff-sign[data-v-f13fbd25]{color:#cf222e;font-weight:700}.diff-line.hunk[data-v-f13fbd25]{background:var(--md-surface-container);color:var(--md-on-surface-variant)}.diff-line.meta[data-v-f13fbd25]{color:var(--md-on-surface-variant);opacity:.75}@media (prefers-color-scheme: dark){.diff-line.add[data-v-f13fbd25],.diff-line.add .diff-sign[data-v-f13fbd25]{color:#7ee787}.diff-line.del[data-v-f13fbd25],.diff-line.del .diff-sign[data-v-f13fbd25]{color:#ffa198}}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color .14s,border-radius .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),color .14s}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.selected.highlighted{background:color-mix(in srgb,var(--md-primary-container) 88%,var(--md-primary) 12%)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-search{position:sticky;top:-8px;z-index:1;display:flex;align-items:center;gap:10px;margin:-8px -8px 8px;padding:13px 16px;background:var(--md-surface-container-low);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px 24px 0 0;color:var(--md-on-surface-variant)}.app-select-search input{flex:1;min-width:0;border:0;background:transparent;padding:0;font:inherit;color:var(--md-on-surface);outline:none}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity .18s var(--ease-emphasized,cubic-bezier(.2,0,0,1)),transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.select-menu-leave-active{transition:opacity .13s,transform .13s}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}.thinking-control{min-width:110px;flex:1;display:flex;flex-direction:column;gap:5px}.thinking-caption{font-size:12px}#app .thinking-trigger{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;padding:9px 12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);font-size:12px;border-radius:9px}.thinking-popover{position:fixed;z-index:10000;padding:16px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:0 10px 32px #16244026;color:var(--md-on-surface);font-family:var(--font-family)}.thinking-popover header{display:flex;justify-content:space-between;gap:12px;font-size:13px}.thinking-popover output{color:var(--md-primary);font-weight:600}.thinking-track{position:relative;padding:22px 4px 16px;display:flex;align-items:center}.thinking-track input{appearance:none;-webkit-appearance:none;width:100%;height:5px;padding:0;margin:0;border:0;border-radius:5px;background:linear-gradient(to right,var(--md-primary) var(--intensity),var(--md-outline-variant) var(--intensity));cursor:pointer;z-index:1}.thinking-track input::-webkit-slider-thumb{appearance:none;width:17px;height:17px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface);box-shadow:0 1px 4px #24345d40}.thinking-track input::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface)}.thinking-track input:focus-visible{outline:2px solid var(--md-primary);outline-offset:7px}.thinking-stops{display:flex;justify-content:space-between;gap:3px}.thinking-stops button{font:inherit;font-size:12px;border:0;background:transparent;color:var(--md-on-surface-variant);padding:6px 5px;border-radius:6px;cursor:pointer}.thinking-stops button.selected{background:var(--md-primary-container);color:var(--md-primary);font-weight:700}.thinking-popover p{font-size:12px;line-height:1.5;color:var(--md-on-surface-variant);margin:12px 0 0}.thinking-control.full .thinking-trigger,.thinking-popover.full{--md-primary:#a050db;border-color:#a050db88;box-shadow:0 0 16px #a050db25}.thinking-popover.full .energy-wave{position:absolute;inset:14px 0 8px;pointer-events:none;border-radius:20px;box-shadow:0 0 12px #a050db66}.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger{animation:thinking-boost .85s ease-out}.thinking-popover.pulse .energy-wave{animation:thinking-wave .85s ease-out}@keyframes thinking-boost{0%{box-shadow:0 0 #a050db66}45%{box-shadow:0 0 0 5px #a050db20,0 0 30px #a050db40}to{box-shadow:0 0 16px #a050db25}}@keyframes thinking-wave{0%{transform:scale(.95);opacity:1}to{transform:scale(1.15,2);opacity:0}}.thinking-menu-enter-active,.thinking-menu-leave-active{transition:opacity .13s,transform .13s}.thinking-menu-enter-from,.thinking-menu-leave-to{opacity:0;transform:translateY(4px)}@media (prefers-reduced-motion:reduce){.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger,.thinking-popover.pulse .energy-wave{animation:none}}.thinking-popover{padding:20px;border-radius:28px;background:var(--md-surface-container-low);border-color:transparent;box-shadow:0 8px 28px #24345d24}.thinking-popover header{align-items:center;font-size:14px;min-height:30px}.thinking-popover output{padding:6px 12px;border-radius:999px;background:var(--md-primary-container);font-size:12px}.thinking-track{height:68px;padding:0;margin:12px 0 0;isolation:isolate}.thinking-capsule{position:absolute;left:5px;right:5px;height:28px;border-radius:999px;background:var(--md-primary-container);overflow:hidden;pointer-events:none}.thinking-fill{height:100%;width:var(--intensity);background:var(--md-primary);border-radius:999px}.thinking-tick{position:absolute;top:50%;width:4px;height:4px;border-radius:50%;background:var(--md-primary);transform:translate(-50%,-50%)}.thinking-tick:first-of-type{left:8px!important}.thinking-tick:last-of-type{left:calc(100% - 8px)!important}.thinking-tick.passed{background:var(--md-on-primary)}.thinking-track input{position:relative;height:48px;background:transparent;border-radius:999px;touch-action:pan-y}.thinking-track input::-webkit-slider-runnable-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-webkit-slider-thumb{width:10px;height:44px;margin-top:-8px;border-radius:999px;border:0;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low);transition:width .14s,height .14s,margin-top .14s}.thinking-track input:active::-webkit-slider-thumb{width:6px;height:48px;margin-top:-10px}.thinking-track input::-moz-range-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-moz-range-thumb{width:10px;height:44px;border:0;border-radius:999px;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low)}.thinking-track input:active::-moz-range-thumb{width:6px;height:48px}.thinking-track input:focus-visible{outline-offset:3px}.thinking-stops{align-items:center;gap:2px;margin-top:2px}.thinking-stops button{border-radius:999px;min-height:30px;padding:6px 9px;transition:background-color .16s,color .16s}.thinking-popover.full{background:color-mix(in srgb,var(--md-surface-container-low) 93%,#a050db);border-color:#a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#7255c8,#ad50d6)}.thinking-popover.full .energy-wave{inset:18px 5px;border-radius:999px;z-index:-1}.thinking-popover p{margin-top:12px}.thinking-popover.full{box-shadow:0 8px 28px #24345d24,0 0 34px #a050db33;border-color:#a050db77}.thinking-popover.full .energy-wave{position:absolute;inset:-3px 4px;border-radius:999px;z-index:-1;background:radial-gradient(70% 120% at 100% 50%,#c56bffbb,transparent 68%),radial-gradient(50% 120% at 0% 50%,#6b8cffaa,transparent 70%);filter:blur(7px);animation:thunder-glow 1.7s ease-in-out infinite}@keyframes thunder-glow{0%,to{opacity:.5;transform:scale(1)}45%{opacity:1;transform:scale(1.03)}}.thinking-popover.full .thinking-capsule{box-shadow:0 0 0 1px #a050db66,0 0 26px #a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#6b8cff,#a050db,#e0a3ff,#a050db);background-size:280% 100%;animation:thunder-flow 2.6s linear infinite}@keyframes thunder-flow{to{background-position:280% 0}}.thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-control.full .thinking-trigger span:first-child{animation:thunder-flicker 2s steps(1,end) infinite}@keyframes thunder-flicker{0%,90%,to{opacity:1}92%{opacity:.35}94%{opacity:1}96%{opacity:.5}}#app .thinking-control .thinking-trigger{min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:13px;font-weight:500;align-items:center;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .thinking-control .thinking-trigger:hover{background:var(--md-surface-container-highest)}#app .thinking-control .thinking-trigger[aria-expanded=true]{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-caption{font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.workspace[data-v-c64cf9c9]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}button[data-v-c64cf9c9],input[data-v-c64cf9c9],textarea[data-v-c64cf9c9],select[data-v-c64cf9c9]{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);padding:9px 12px}button[data-v-c64cf9c9]{cursor:pointer;transition:background .15s,box-shadow .15s,filter .15s}button[data-v-c64cf9c9]:disabled{opacity:.45;cursor:default}button[data-v-c64cf9c9]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}input[data-v-c64cf9c9]:focus,textarea[data-v-c64cf9c9]:focus,select[data-v-c64cf9c9]:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}input[type=checkbox][data-v-c64cf9c9]{width:auto;accent-color:var(--md-primary)}.sessions[data-v-c64cf9c9]{width:284px;flex-shrink:0;border-right:1px solid var(--md-outline-variant);padding:20px 16px;display:flex;flex-direction:column;gap:14px;background:var(--md-surface-container-low)}.sessions header[data-v-c64cf9c9]{display:flex;align-items:center;justify-content:space-between;gap:12px}.sessions h1[data-v-c64cf9c9]{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}.sessions header>button[data-v-c64cf9c9]{height:34px;padding:0 13px;border:0;border-radius:9px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:600 13px/1 inherit}.sessions header>button[data-v-c64cf9c9]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.08);box-shadow:var(--shadow-1)}.sessions>input[data-v-c64cf9c9]{border-radius:10px;background:var(--md-surface-container-lowest)}.connection[data-v-c64cf9c9]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}.connection button[data-v-c64cf9c9]{margin-left:auto;padding:3px 9px;border-radius:8px;font-size:13px}.connection i[data-v-c64cf9c9]{width:8px;height:8px;border-radius:50%;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}.connection i.online[data-v-c64cf9c9]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.filter-bar[data-v-c64cf9c9]{display:flex;gap:3px;padding:4px;border-radius:999px;background:var(--md-surface-container-high)}.filter-bar button[data-v-c64cf9c9]{flex:1;font-size:12px;font-weight:500;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);box-shadow:none}.filter-bar button[data-v-c64cf9c9]:hover:not(:disabled){background:transparent;color:var(--md-on-surface)}.filter-bar button.chosen[data-v-c64cf9c9]{background:var(--md-surface-container-lowest);color:var(--md-primary);font-weight:650;box-shadow:var(--shadow-1)}.sessions label input[data-v-c64cf9c9]{margin-right:6px}.session-list[data-v-c64cf9c9]{overflow-y:auto;flex:1;min-height:0;margin:0 -4px;padding:0 4px}.session-card[data-v-c64cf9c9]{display:flex;flex-direction:column;width:100%;text-align:left;gap:6px;margin-bottom:8px;padding:12px 13px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest)}.session-card[data-v-c64cf9c9]:hover:not(:disabled){background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.session-card.selected[data-v-c64cf9c9]{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}.session-card.selected[data-v-c64cf9c9]:hover{background:var(--md-secondary-container)}.session-card strong[data-v-c64cf9c9]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:600;font-size:14px}.origin[data-v-c64cf9c9],small[data-v-c64cf9c9],.sessions .muted[data-v-c64cf9c9]{font-size:12px;color:var(--md-on-surface-variant)}.origin[data-v-c64cf9c9]{font-weight:600;letter-spacing:.02em}.ledger-button[data-v-c64cf9c9]{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:13px;font-weight:550}.ledger-button.chosen[data-v-c64cf9c9]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.ledger[data-v-c64cf9c9]{flex:1;overflow-y:auto;padding:var(--space-xl)}.ledger>header[data-v-c64cf9c9]{margin-bottom:8px}.ledger>header h2[data-v-c64cf9c9]{font-size:18px;font-weight:650}.ledger-entry[data-v-c64cf9c9]{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:14px 16px;margin:10px 0;box-shadow:var(--shadow-1)}.ledger-entry>div[data-v-c64cf9c9]{display:flex;align-items:center;gap:10px;font-size:12px}.ledger-entry>div>span[data-v-c64cf9c9]:first-child{font-family:var(--code-font);background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-weight:600}.ledger-entry>div small[data-v-c64cf9c9]{margin-left:auto}.ledger-entry>p[data-v-c64cf9c9]{margin:8px 0;font-size:14px;line-height:1.6;overflow-wrap:anywhere}.ledger-entry details[data-v-c64cf9c9]{margin-top:8px;border-radius:10px;background:var(--md-surface-container);padding:8px 12px;font-size:12px}.ledger-entry summary[data-v-c64cf9c9]{cursor:pointer;color:var(--md-on-surface-variant)}.ledger-entry pre[data-v-c64cf9c9]{margin:8px 0 0;max-height:300px}.conversation[data-v-c64cf9c9]{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}.conversation-header[data-v-c64cf9c9]{display:flex;align-items:flex-start;gap:14px}.conversation-header>div[data-v-c64cf9c9]:first-child{flex:1;min-width:0}.conversation-header h2[data-v-c64cf9c9]{font-size:17px;font-weight:650;margin:0}.conversation-header p[data-v-c64cf9c9]{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:13px}.session-actions[data-v-c64cf9c9]{display:flex;gap:8px;flex-shrink:0}.session-actions button[data-v-c64cf9c9]{height:32px;padding:0 13px;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.running[data-v-c64cf9c9]{color:#b88412;font-weight:650;font-size:12px}.failed[data-v-c64cf9c9]{color:var(--md-error)}.done[data-v-c64cf9c9]{color:var(--md-success);font-weight:600;font-size:12px}.cancelled[data-v-c64cf9c9],.muted[data-v-c64cf9c9]{color:var(--md-on-surface-variant)}.muted[data-v-c64cf9c9]{font-size:12px;line-height:1.6}.error[data-v-c64cf9c9]{background:var(--md-error-container);color:#410e0b;padding:11px 16px;border-radius:12px;margin:8px 0;font-size:13px;overflow-wrap:anywhere}.transcript[data-v-c64cf9c9]{flex:1;overflow-y:auto;padding:26px 28px;min-height:0}.context-summary[data-v-c64cf9c9]{max-width:920px;margin:0 auto 22px;padding:14px 18px;border:1px dashed var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-low)}.context-summary-head[data-v-c64cf9c9]{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.context-summary-head strong[data-v-c64cf9c9]{font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--md-primary)}.context-summary-head time[data-v-c64cf9c9]{font-size:12px;opacity:.75}.welcome[data-v-c64cf9c9]{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}.welcome[data-v-c64cf9c9]:before{content:\"\";display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center}.welcome h2[data-v-c64cf9c9]{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}.welcome p[data-v-c64cf9c9]{margin:6px 0;font-size:14px}.turn[data-v-c64cf9c9]{max-width:920px;margin:0 auto 30px;display:flex;flex-direction:column;gap:10px}.bubble[data-v-c64cf9c9]{padding:15px 19px;font-size:14px}.bubble.user[data-v-c64cf9c9]{align-self:flex-end;max-width:82%;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:16px 16px 4px}.bubble.agent[data-v-c64cf9c9]{align-self:flex-start;max-width:100%;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:16px 16px 16px 4px;box-shadow:var(--shadow-1)}.bubble .message-head[data-v-c64cf9c9]{display:flex;align-items:center;gap:14px;margin-bottom:10px;font-size:12px}.bubble .message-head b[data-v-c64cf9c9]{font-weight:700}.bubble .message-head time[data-v-c64cf9c9]{margin-left:auto;opacity:.75;font-size:12px}.bubble .message-head span[data-v-c64cf9c9]{margin-left:auto}.bubble.user .message-head[data-v-c64cf9c9]{margin-bottom:7px;opacity:.85}.message-text[data-v-c64cf9c9]{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}.bubble.agent[data-v-c64cf9c9] p{margin:.4em 0}.bubble.agent[data-v-c64cf9c9] pre{max-height:420px}.agent-speech[data-v-c64cf9c9]{margin:6px 0;padding:2px 0;line-height:1.7}.model-annotation[data-v-c64cf9c9]{display:block;font-size:12px;opacity:.7;margin-bottom:4px;font-family:var(--code-font)}.think-chain[data-v-c64cf9c9]{margin:2px 0 8px;border:0;border-radius:10px;background:var(--md-surface-container-low);overflow:hidden}.think-chain>summary[data-v-c64cf9c9]{display:inline-flex;align-items:center;gap:5px;cursor:pointer;list-style:none;padding:3px 10px;font-size:11px;font-weight:600;letter-spacing:.03em;color:var(--md-on-surface-variant);user-select:none;border-radius:999px;background:var(--md-surface-container)}.think-chain>summary[data-v-c64cf9c9]::-webkit-details-marker{display:none}.think-chain>summary[data-v-c64cf9c9]:before{content:\"▸\";display:inline-block;transition:transform .15s}.think-chain[open]>summary[data-v-c64cf9c9]:before{transform:rotate(90deg)}.think-chain>pre[data-v-c64cf9c9]{margin:0;padding:6px 10px 8px;max-height:180px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--code-font);font-size:11.5px;line-height:1.55;color:var(--md-on-surface-variant)}.agent-speech[data-v-c64cf9c9] p{margin:.45em 0}.agent-speech[data-v-c64cf9c9] pre{background:var(--md-surface-container);border:1px solid var(--md-outline-variant);border-radius:10px;padding:12px 14px;max-height:460px;overflow:auto;font-size:13px}.agent-speech[data-v-c64cf9c9] code{font-family:var(--code-font)}.agent-speech[data-v-c64cf9c9] ul{padding-left:20px;margin:.4em 0}.steps[data-v-c64cf9c9]{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}.steps details[data-v-c64cf9c9]{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}.steps summary[data-v-c64cf9c9]{cursor:pointer;font-size:13px;font-weight:550}.steps summary small[data-v-c64cf9c9]{margin-left:10px;font-weight:600}.steps summary[data-v-c64cf9c9]::marker{color:var(--md-on-surface-variant)}.steps details pre[data-v-c64cf9c9]{margin:10px 0 0;font-family:var(--code-font);font-size:13px;white-space:pre-wrap;max-height:400px}pre[data-v-c64cf9c9]{max-height:450px;overflow:auto;font-family:var(--code-font)}.subagent-card[data-v-c64cf9c9]{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}button.subagent-card-head[data-v-c64cf9c9]{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;border-radius:0;background:transparent;padding:11px 14px;font-size:13px}button.subagent-card-head[data-v-c64cf9c9]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}button.subagent-card-head>span[data-v-c64cf9c9]:first-child{color:var(--md-primary)}button.subagent-card-head>strong[data-v-c64cf9c9]{font-weight:700}.subagent-prompt[data-v-c64cf9c9]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--md-on-surface)}.subagent-card small[data-v-c64cf9c9]{font-weight:600}.subagent-chevron[data-v-c64cf9c9]{color:var(--md-on-surface-variant);font-size:12px}.subagent-card-error[data-v-c64cf9c9]{margin:0 10px 10px;padding:8px 12px;font-size:12px}.subagent-card.nested[data-v-c64cf9c9]{margin:6px 0;box-shadow:none}.sub-view[data-v-c64cf9c9]{max-width:900px;margin:0 auto}.sub-view-header[data-v-c64cf9c9]{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}.sub-view-header button[data-v-c64cf9c9]{flex-shrink:0;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.sub-view-header h3[data-v-c64cf9c9]{margin:0 0 4px;font-size:16px;font-weight:650}.sub-view-header p[data-v-c64cf9c9]{margin:0;max-width:520px}.sub-view-header>span[data-v-c64cf9c9]{margin-left:auto;font-weight:650;font-size:12px}.sub-view-body[data-v-c64cf9c9]{min-height:120px}.todo-panel[data-v-c64cf9c9]{padding:12px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);max-height:170px;overflow:auto;animation:panel-in-c64cf9c9 .22s cubic-bezier(.2,0,0,1) both}.todo-panel>header[data-v-c64cf9c9]{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant);text-transform:uppercase}.todo-panel>header span[data-v-c64cf9c9]{font-weight:700;color:var(--md-primary)}.todo-panel ul[data-v-c64cf9c9]{list-style:none;margin:9px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}.todo-panel li[data-v-c64cf9c9]{display:flex;align-items:flex-start;gap:9px;font-size:13px;line-height:1.5;color:var(--md-on-surface);animation:panel-in-c64cf9c9 .22s ease both;transition:opacity .2s,color .2s}.todo-panel li.completed[data-v-c64cf9c9]{opacity:.6}.todo-panel li.completed .todo-text[data-v-c64cf9c9]{text-decoration:line-through}.todo-panel li.in_progress .todo-text[data-v-c64cf9c9]{font-weight:650}.todo-mark[data-v-c64cf9c9]{flex:none;width:16px;text-align:center;color:var(--md-primary);transition:color .2s,transform .2s}.todo-panel li.completed .todo-mark[data-v-c64cf9c9]{color:var(--md-success,#3ba55c)}.composer .todo-panel[data-v-c64cf9c9]{border-radius:28px 28px 0 0}.ctx-usage[data-v-c64cf9c9]{position:relative;display:inline-flex;align-items:center;flex:none;outline:none;order:99;margin-left:6px}.ctx-ring[data-v-c64cf9c9]{width:22px;height:22px;transform:rotate(-90deg)}.ctx-track[data-v-c64cf9c9]{fill:none;stroke:var(--md-outline-variant);stroke-width:2.5}.ctx-fill[data-v-c64cf9c9]{fill:none;stroke:var(--md-primary);stroke-width:2.5;stroke-linecap:round;transition:stroke-dashoffset .35s cubic-bezier(.2,0,0,1)}.ctx-tip[data-v-c64cf9c9]{position:absolute;bottom:calc(100% + 12px);right:0;left:auto;transform:translateY(4px);z-index:60;width:max-content;min-width:216px;max-width:280px;padding:12px 14px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:var(--shadow-3);color:var(--md-on-surface);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .16s,transform .16s,visibility .16s;font-size:12px;text-align:left}.ctx-usage:hover .ctx-tip[data-v-c64cf9c9],.ctx-usage:focus-visible .ctx-tip[data-v-c64cf9c9],.ctx-usage:focus-within .ctx-tip[data-v-c64cf9c9]{opacity:1;visibility:visible;transform:translateY(0)}.ctx-tip strong[data-v-c64cf9c9]{display:block;font-size:12px;font-weight:750;margin-bottom:8px}.ctx-used[data-v-c64cf9c9]{display:flex;align-items:baseline;gap:6px}.ctx-used b[data-v-c64cf9c9]{font-size:22px;font-weight:800;color:var(--md-primary);line-height:1}.ctx-used span[data-v-c64cf9c9]{color:var(--md-on-surface-variant)}.ctx-sub[data-v-c64cf9c9]{color:var(--md-on-surface-variant);margin:4px 0 8px}.ctx-row[data-v-c64cf9c9]{display:flex;justify-content:space-between;gap:16px;padding:4px 0;border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.ctx-row span[data-v-c64cf9c9]:last-child{font-weight:650;color:var(--md-primary)}.composer[data-v-c64cf9c9]{flex-shrink:0;margin:0 20px 18px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-lowest);overflow:visible;box-shadow:var(--shadow-1)}.composer-input[data-v-c64cf9c9]{position:relative}.composer-input textarea[data-v-c64cf9c9]{font-size:14px;width:100%;display:block;min-height:96px;padding:15px 112px 15px 16px;line-height:1.6;resize:vertical;border:0;border-radius:0;background:transparent}.composer-input textarea[data-v-c64cf9c9]:focus{box-shadow:none;border:0}.slash-menu[data-v-c64cf9c9]{position:fixed;z-index:10000;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:14px;box-shadow:var(--shadow-3);padding:6px;max-height:min(320px,42vh);overflow:auto}.slash-item[data-v-c64cf9c9]{display:flex;align-items:baseline;gap:10px;width:100%;text-align:left;padding:8px 10px;border:0;border-radius:10px;background:transparent;color:var(--md-on-surface);cursor:pointer}.slash-item.active[data-v-c64cf9c9]{background:var(--md-secondary-container)}.slash-name[data-v-c64cf9c9]{flex:none;font-family:var(--code-font);font-weight:650;font-size:13px;color:var(--md-primary)}.slash-desc[data-v-c64cf9c9]{font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.attach-chips[data-v-c64cf9c9]{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 16px 0}.composer-actions[data-v-c64cf9c9]{position:absolute;right:10px;bottom:10px;z-index:2;display:flex;align-items:center;gap:8px}.attach-fly[data-v-c64cf9c9]{width:42px;height:42px;flex:none;aspect-ratio:1/1;display:grid;place-items:center;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.attach-fly svg[data-v-c64cf9c9]{width:18px;height:18px}.attach-fly[data-v-c64cf9c9]:hover:not(:disabled){filter:brightness(1.05)}.attach-fly[data-v-c64cf9c9]:disabled{opacity:.5;cursor:default}.attach-chip[data-v-c64cf9c9]{display:inline-flex;align-items:center;gap:6px;max-width:220px;font-size:12px;padding:4px 6px 4px 10px;border-radius:999px;background:var(--md-surface-container);border:1px solid var(--md-outline-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.attach-chip button[data-v-c64cf9c9]{border:0;background:transparent;cursor:pointer;font-size:14px;line-height:1;padding:0 4px;color:var(--md-on-surface-variant)}.attach-chip button[data-v-c64cf9c9]:hover{color:var(--md-error)}.attach-error[data-v-c64cf9c9]{font-size:12px;color:var(--md-error)}.send-fly[data-v-c64cf9c9]{width:42px;height:42px;flex:none;aspect-ratio:1/1;display:grid;place-items:center;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-primary);color:var(--md-on-primary,#fff);box-shadow:0 2px 10px color-mix(in srgb,var(--md-primary) 38%,transparent)}.send-fly svg[data-v-c64cf9c9]{width:20px;height:20px}.send-fly[data-v-c64cf9c9]:hover:not(:disabled){filter:brightness(1.08)}.send-fly[data-v-c64cf9c9]:disabled{background:var(--md-surface-container);color:var(--md-on-surface-variant);opacity:.7;box-shadow:none}.send-fly.stop[data-v-c64cf9c9]{background:var(--md-error);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--md-error) 40%,transparent)}.compact-notice[data-v-c64cf9c9]{font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}.options-collapse[data-v-c64cf9c9]{max-height:0;overflow:hidden;transition:max-height .3s cubic-bezier(.2,0,0,1)}.options-collapse.open[data-v-c64cf9c9]{max-height:360px}.options-toggle[data-v-c64cf9c9]{display:inline-flex;align-items:center;gap:6px;transition:background-color .18s,color .18s}.options-toggle.open[data-v-c64cf9c9]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.execution-options[data-v-c64cf9c9]{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}.execution-options label[data-v-c64cf9c9]{display:flex;flex-direction:column;gap:5px;font-size:12px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}.execution-options[data-v-c64cf9c9] .app-select-trigger,.execution-options .workspace-select[data-v-c64cf9c9]{width:100%;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}.workspace-select[data-v-c64cf9c9]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}.composer footer[data-v-c64cf9c9]{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap;border-top:1px solid var(--md-outline-variant)}.composer footer>select[data-v-c64cf9c9],.composer footer>.app-select[data-v-c64cf9c9]{font-size:13px;border-radius:10px;min-height:34px}.composer footer .muted[data-v-c64cf9c9]{flex:1;min-width:120px}.composer footer>button[data-v-c64cf9c9]{font-size:13px;font-weight:600;border-radius:9px;min-height:34px}.host-panel>strong[data-v-c64cf9c9]{font-size:14px}.host-panel dl[data-v-c64cf9c9]{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px}.host-panel dt[data-v-c64cf9c9]{color:var(--md-on-surface-variant);font-weight:600}.host-panel dd[data-v-c64cf9c9]{margin:4px 0 0;overflow-wrap:anywhere}.usage-rings[data-v-c64cf9c9]{display:flex;align-items:center;gap:24px;padding:14px 0;flex-wrap:wrap}.usage-metric[data-v-c64cf9c9]{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}.usage-ring[data-v-c64cf9c9]{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}.usage-ring b[data-v-c64cf9c9]{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:15px;font-weight:650;box-shadow:var(--shadow-1)}.new-folder[data-v-c64cf9c9]{display:flex;gap:8px}.new-folder input[data-v-c64cf9c9]{flex:1;min-width:0}.directory-backdrop[data-v-c64cf9c9]{position:fixed;inset:0;background:#14111acc;z-index:1000;display:grid;place-items:center;padding:20px}.directory-dialog[data-v-c64cf9c9]{background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:20px;padding:22px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh;box-shadow:var(--shadow-4)}.directory-dialog>header[data-v-c64cf9c9]{gap:12px}.directory-dialog>header h2[data-v-c64cf9c9]{font-size:16px;font-weight:650}.directory-list[data-v-c64cf9c9]{overflow:auto;min-height:180px;display:flex;flex-direction:column;gap:6px}.directory-list button[data-v-c64cf9c9]{text-align:left;border-radius:10px;background:var(--md-surface-container-low);font-size:13px}.directory-roots[data-v-c64cf9c9]{display:flex;gap:8px;flex-wrap:wrap}.directory-roots button[data-v-c64cf9c9]{border-radius:999px;font-size:12px;padding:6px 12px}.directory-dialog code[data-v-c64cf9c9]{overflow-wrap:anywhere;font-size:12px;background:var(--md-surface-container);padding:8px 10px;border-radius:8px}.directory-dialog>footer[data-v-c64cf9c9]{display:flex;justify-content:flex-end}.directory-dialog>footer button[data-v-c64cf9c9]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;font-weight:600}.permission-request[data-v-c64cf9c9]{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}.permission-request small[data-v-c64cf9c9]{display:block;margin:8px 0}.permission-request pre[data-v-c64cf9c9]{max-height:160px;overflow:auto}.permission-request>div[data-v-c64cf9c9]{display:flex;justify-content:flex-end;gap:8px}#app .workspace[data-v-c64cf9c9]{gap:12px;padding-left:6px;background:var(--md-surface-container)}#app .workspace .sessions[data-v-c64cf9c9]{width:296px;gap:14px;padding:18px 14px;border:0;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .workspace .sessions h1[data-v-c64cf9c9]{font-size:24px;font-weight:800;letter-spacing:-.02em}#app .workspace .sessions header>button[data-v-c64cf9c9]{height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 13px/1 inherit;display:inline-flex;align-items:center;gap:7px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .workspace .sessions header>button[data-v-c64cf9c9]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.06);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .sessions>input[data-v-c64cf9c9]{min-height:48px;padding:0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:14px}#app .workspace .sessions>input[data-v-c64cf9c9]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .workspace .filter-bar[data-v-c64cf9c9]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .workspace .filter-bar button[data-v-c64cf9c9]{border-radius:999px;padding:8px 4px;font-weight:600}#app .workspace .filter-bar button.chosen[data-v-c64cf9c9]{background:var(--md-primary);color:var(--md-on-primary,#fff);font-weight:700;box-shadow:var(--shadow-1)}#app .workspace .filter-bar button.chosen[data-v-c64cf9c9]:hover:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff)}#app .workspace .session-list[data-v-c64cf9c9]{margin:0 -2px;padding:0 2px}#app .workspace .session-card[data-v-c64cf9c9]{gap:5px;margin-bottom:8px;padding:13px 15px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:18px;background:var(--md-surface-container-lowest);transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .2s,border-color .2s,box-shadow .22s,border-radius .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .workspace .session-card[data-v-c64cf9c9]:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-1);border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant))}#app .workspace .session-card.selected[data-v-c64cf9c9]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent;border-radius:20px 20px 20px 7px;box-shadow:var(--shadow-1)}#app .workspace .session-card .origin[data-v-c64cf9c9]{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:12px;color:var(--md-primary)}#app .workspace .session-card.selected .origin[data-v-c64cf9c9]{color:var(--md-on-secondary-container);opacity:.75}#app .workspace .ledger-button[data-v-c64cf9c9]{min-height:44px;border-radius:16px;font-weight:650;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .ledger-button.chosen[data-v-c64cf9c9]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent}#app .workspace .ledger-entry[data-v-c64cf9c9]{border-radius:20px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-lowest);box-shadow:var(--shadow-1)}#app .workspace .conversation[data-v-c64cf9c9]{background:var(--md-surface);border-radius:30px;overflow:hidden;box-shadow:var(--shadow-1)}#app .workspace .conversation-header[data-v-c64cf9c9]{padding:20px 26px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .conversation-header h2[data-v-c64cf9c9]{font-size:20px;font-weight:750;letter-spacing:-.01em}#app .workspace .session-actions button[data-v-c64cf9c9]{height:36px;padding:0 15px;border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .session-actions button[data-v-c64cf9c9]:hover:not(:disabled){background:var(--md-surface-container-highest);box-shadow:none}#app .workspace .running[data-v-c64cf9c9]{color:#b88412;background:color-mix(in srgb,#B88412 14%,transparent);padding:4px 11px;border-radius:999px;font-weight:700}#app .workspace .transcript[data-v-c64cf9c9]{padding:28px 30px}#app .workspace .welcome[data-v-c64cf9c9]{margin:64px auto 0}#app .workspace .welcome[data-v-c64cf9c9]:before{width:76px;height:76px;border-radius:26px 26px 26px 10px;background-color:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24' fill='none' stroke='%235944c6' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-size:34px 34px}#app .workspace .welcome h2[data-v-c64cf9c9]{font-size:26px;font-weight:800;letter-spacing:-.02em}#app .workspace .turn[data-v-c64cf9c9]{gap:12px;margin-bottom:32px}#app .workspace .bubble[data-v-c64cf9c9]{padding:16px 20px;font-size:15px;line-height:1.7}#app .workspace .bubble.user[data-v-c64cf9c9]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px;box-shadow:var(--shadow-1);max-width:82%}#app .workspace .bubble.agent[data-v-c64cf9c9]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:8px 24px 24px;box-shadow:var(--shadow-1);max-width:100%}#app .workspace .bubble .message-head b[data-v-c64cf9c9]{font-weight:750}#app .workspace .steps[data-v-c64cf9c9]{gap:9px;margin:14px 0}#app .workspace .steps details[data-v-c64cf9c9]{border-radius:16px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);padding:11px 15px}#app .workspace .subagent-card[data-v-c64cf9c9]{border-radius:18px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);box-shadow:var(--shadow-1)}#app .workspace button.subagent-card-head[data-v-c64cf9c9]{padding:12px 15px}#app .workspace button.subagent-card-head[data-v-c64cf9c9]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .sub-view-header[data-v-c64cf9c9]{padding-bottom:16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .sub-view-header button[data-v-c64cf9c9]{border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .agent-speech[data-v-c64cf9c9] pre{border-radius:16px;background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}#app .workspace .composer[data-v-c64cf9c9]{position:relative;z-index:5;margin:0 22px 20px;border-radius:28px;overflow:visible;background:var(--md-surface-container-lowest);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);box-shadow:var(--shadow-2)}#app .workspace .composer[data-v-c64cf9c9]:focus-within{border-color:color-mix(in srgb,var(--md-primary) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent),var(--shadow-2)}#app .workspace .execution-options[data-v-c64cf9c9]{padding:12px 16px;gap:10px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .execution-options label[data-v-c64cf9c9]{font-weight:700;letter-spacing:.05em}#app .workspace .execution-options .workspace-select[data-v-c64cf9c9]{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .execution-options[data-v-c64cf9c9] .app-select-trigger,#app .workspace .composer footer[data-v-c64cf9c9] .app-select-trigger{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .composer-input textarea[data-v-c64cf9c9]{border-radius:0;background:transparent}#app .workspace .send-fly[data-v-c64cf9c9]{width:46px!important;height:46px!important;border-radius:50%!important;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .composer footer[data-v-c64cf9c9]{border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);padding:12px 16px}#app .workspace .composer footer>button[data-v-c64cf9c9]{border-radius:999px;min-height:36px;padding-inline:15px;background:var(--md-surface-container-high);border-color:transparent}#app .workspace .host-panel[data-v-c64cf9c9]{margin:0 22px 10px;border-radius:24px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .workspace .usage-ring b[data-v-c64cf9c9]{background:var(--md-surface-container-lowest)}#app .workspace .directory-dialog[data-v-c64cf9c9]{border-radius:32px;border-color:transparent;box-shadow:var(--shadow-4);background:var(--md-surface-container-low)}#app .workspace .directory-list button[data-v-c64cf9c9]{background:var(--md-surface-container-lowest);border-color:transparent;border-radius:16px;min-height:46px}#app .workspace .directory-list button[data-v-c64cf9c9]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .directory-roots button[data-v-c64cf9c9]{background:var(--md-surface-container-high);border-color:transparent}@keyframes turn-in-c64cf9c9{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes panel-in-c64cf9c9{0%{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes caret-blink-c64cf9c9{0%,to{opacity:1}50%{opacity:.2}}@keyframes soft-pulse-c64cf9c9{0%,to{opacity:1}50%{opacity:.5}}.turn[data-v-c64cf9c9]{animation:turn-in-c64cf9c9 .28s cubic-bezier(.2,0,0,1) both}#app .workspace .agent-speech .running[data-v-c64cf9c9]{animation:caret-blink-c64cf9c9 1s steps(1,end) infinite;color:var(--md-primary)}#app .workspace .conversation-header .running[data-v-c64cf9c9]{animation:soft-pulse-c64cf9c9 1.6s ease-in-out infinite}@media (prefers-reduced-motion: reduce){[data-v-c64cf9c9],[data-v-c64cf9c9] *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}@media (max-width:800px){.sessions[data-v-c64cf9c9]{width:214px;padding:12px 10px}.transcript[data-v-c64cf9c9]{padding:14px}.composer[data-v-c64cf9c9]{margin:0 12px 12px}.composer footer .muted[data-v-c64cf9c9]{display:none}.conversation-header[data-v-c64cf9c9]{padding:14px 16px}.welcome[data-v-c64cf9c9]{margin:30px auto 0}.turn[data-v-c64cf9c9]{margin-bottom:22px}}@media (max-width:560px){.workspace[data-v-c64cf9c9]{flex-direction:column}.sessions[data-v-c64cf9c9]{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input[data-v-c64cf9c9],.filter-bar[data-v-c64cf9c9],.connection[data-v-c64cf9c9]{display:none}.session-list[data-v-c64cf9c9]{display:flex;gap:6px;overflow-x:auto}.session-card[data-v-c64cf9c9]{min-width:160px;width:160px;margin-bottom:0}.ledger-button[data-v-c64cf9c9]{padding:5px;font-size:12px}}\n";document.head.appendChild(s)}})();
