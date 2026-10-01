var xr = Object.defineProperty;
var Sr = (n, e, t) => e in n ? xr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var se = (n, e, t) => Sr(n, typeof e != "symbol" ? e + "" : e, t);
import { reactive as Tr, defineComponent as qt, computed as X, openBlock as v, createElementBlock as b, ref as O, onMounted as hn, onUnmounted as fn, normalizeClass as de, createElementVNode as i, toDisplayString as g, createCommentVNode as I, Fragment as ae, renderList as be, withModifiers as Pe, watch as Se, nextTick as Ke, mergeProps as Ar, unref as oe, createBlock as wt, Teleport as zn, createVNode as ze, Transition as Zs, withCtx as Ks, normalizeStyle as Wt, withDirectives as cn, vModelText as On, withKeys as Ut, createTextVNode as Re, vModelCheckbox as Er } from "vue";
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
  function k(C) {
    C.reset && a.clear();
    for (const B of C.removed || []) a.delete(B);
    for (const B of C.tasks || []) a.set(B.task_id, B);
    r = C.cursor || "";
    const z = [...a.values()].sort((B, te) => (te.started_at || "").localeCompare(B.started_at || "") || B.task_id.localeCompare(te.task_id));
    n.tasks = z.filter((B) => B.kind !== "agent_session"), n.sessions = z.filter((B) => B.kind === "agent_session");
  }
  function y() {
    u?.close(), o = !1, u = new EventSource(`/api/tasks/events?cursor=${encodeURIComponent(r)}`), u.onopen = () => {
      o = !0;
    }, u.onerror = () => {
      o = !1;
    }, u.addEventListener("tasks", (C) => {
      try {
        k(JSON.parse(C.data));
      } catch {
        o = !1;
      }
    });
  }
  function S() {
    return t ? (s || (s = t.then(() => (s = null, S()))), s) : (t = E().finally(() => {
      t = null;
    }), t);
  }
  async function E() {
    n.loading = !0, n.error = "";
    try {
      const C = await fetch("/api/agents", { signal: AbortSignal.timeout(8e3) });
      if (!C.ok) throw new Error(`HTTP ${C.status}`);
      const z = await C.json();
      n.agents = z.agents || [], n.onlineCount = z.online_count ?? n.agents.length;
    } catch (C) {
      n.error = C.message || "failed";
    }
    if (!o)
      try {
        const C = await fetch(`/api/tasks?incremental=1&cursor=${encodeURIComponent(r)}`, { signal: AbortSignal.timeout(8e3) });
        if (!C.ok) throw new Error(`任务记录 HTTP ${C.status}`);
        const z = await C.json();
        k(z);
      } catch (C) {
        n.error = C.message || "无法刷新任务记录";
      }
    n.loading = !1;
  }
  function D() {
    S().then(() => {
      e && y();
    }), e && clearInterval(e), e = setInterval(() => {
      !document.hidden && !t && S();
    }, 2e3);
  }
  function U() {
    u?.close(), u = null, o = !1, e && (clearInterval(e), e = null);
  }
  function L(C) {
    return !C.missing_dependencies?.length && (C.status === "PLUGIN_STATUS_HEALTHY" || C.status === "HEALTHY");
  }
  async function Q(C) {
    const z = await fetch("/api/agent/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: C }) });
    if (!z.ok) throw new Error(await z.text());
    const B = await z.json();
    return await S(), B.session_id;
  }
  async function M(C, z, B) {
    const te = await fetch("/api/agent/sessions", { method: z === "delete" ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: C, action: z, title: B }) });
    if (!te.ok) throw new Error(await te.text());
    await S();
  }
  async function Y(C, z, B, te = {}) {
    const ie = await fetch("/api/agent/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: C, prompt: z, agent_type: B, ...te }) }), F = await ie.text();
    if (await S(), !ie.ok) {
      let _ = F;
      try {
        _ = JSON.parse(F).message || F;
      } catch {
      }
      throw new Error(_);
    }
  }
  async function ee(C) {
    const z = await fetch("/api/tasks/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: C }) });
    if (!z.ok) throw new Error(await z.text());
    const B = await z.json();
    if (!B.success) throw new Error(B.message);
    await S();
  }
  return Object.assign(n, {
    fetchAgents: S,
    connect: D,
    disconnect: U,
    isHealthy: L,
    createSession: Q,
    manageSession: M,
    sendTask: Y,
    cancelTask: ee
  });
}
const $r = Rr();
function Cr() {
  return $r;
}
function rs() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var St = rs();
function Xs(n) {
  St = n;
}
var _t = { exec: () => null };
function Bt(n) {
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
})(), _e = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: Bt((n) => new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: Bt((n) => new RegExp(`^ {0,${n}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: Bt((n) => new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)), headingBeginRegex: Bt((n) => new RegExp(`^ {0,${n}}#`)), htmlBeginRegex: Bt((n) => new RegExp(`^ {0,${n}}(?:</?(?:${mn})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: Bt((n) => new RegExp(`^ {0,${n}}>`)) }, Ir = /^(?:[ \t]*(?:\n|$))+/, Or = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Pr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, gn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Dr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ls = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Qs = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Js = H(Qs).replace(/bull/g, ls).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Nr = H(Qs).replace(/bull/g, ls).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), as = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Mr = /^[^\n]+/, os = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, zr = H(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", os).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Fr = H(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, ls).getRegex(), mn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", is = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ur = H("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", is).replace("tag", mn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), er = (n) => H(as).replace("hr", gn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", n).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", mn).getRegex(), Br = er(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), Hr = er(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), jr = H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Hr).getRegex(), us = { blockquote: jr, code: Or, def: zr, fences: Pr, heading: Dr, hr: gn, html: Ur, lheading: Js, list: Fr, newline: Ir, paragraph: Br, table: _t, text: Mr }, xs = H("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", gn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", mn).getRegex(), Wr = { ...us, lheading: Nr, table: xs, paragraph: H(as).replace("hr", gn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", xs).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", mn).getRegex() }, Vr = { ...us, html: H(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", is).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: _t, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: H(as).replace("hr", gn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Js).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, qr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, tr = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, Yr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, nt = /[\p{P}\p{S}]/u, Gt = /[\s\p{P}\p{S}]/u, vn = /[^\s\p{P}\p{S}]/u, Zr = H(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Gt).getRegex(), Kr = /[\p{Pi}\p{Ps}"']/u, nr = /(?!~)[\p{P}\p{S}]/u, Xr = /(?!~)[\s\p{P}\p{S}]/u, Qr = /(?:[^\s\p{P}\p{S}]|~)/u, Jr = H(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Lr ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), sr = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, el = H(sr, "u").replace(/punct/g, nt).getRegex(), tl = H(sr, "u").replace(/punct/g, nr).getRegex(), nl = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, sl = H(nl, "u").replace(/openQuote/g, Kr).replace(/punct/g, nt).getRegex(), rr = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", rl = H(rr, "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, Gt).replace(/punct/g, nt).getRegex(), ll = H(rr, "gu").replace(/notPunctSpace/g, Qr).replace(/punctSpace/g, Xr).replace(/punct/g, nr).getRegex(), al = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", ol = H(al, "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, Gt).replace(/punct/g, nt).getRegex(), il = H("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, Gt).replace(/punct/g, nt).getRegex(), ul = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", cl = H(ul, "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, Gt).replace(/punct/g, nt).getRegex(), dl = H(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, nt).getRegex(), pl = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", hl = H(pl, "gu").replace(/notPunctSpace/g, vn).replace(/punctSpace/g, Gt).replace(/punct/g, nt).getRegex(), fl = H(/\\(punct)/, "gu").replace(/punct/g, nt).getRegex(), gl = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ml = H(is).replace("(?:-->|$)", "-->").getRegex(), vl = H("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ml).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), lr = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, Pn = H(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", lr).getRegex(), kl = H(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Pn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), bl = H(/^!?\[(label)\]\[(ref)\]/).replace("label", Pn).replace("ref", os).getRegex(), yl = H(/^!?\[(ref)\](?:\[\])?/).replace("ref", os).getRegex(), Ss = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, _l = H(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", lr).getRegex(), wl = H("reflink|nolink(?!\\()", "g").replace("reflink", H(/^!?\[(label)\]\[(ref)\]/).replace("label", _l).replace("ref", Ss).getRegex()).replace("nolink", H(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ss).getRegex()).getRegex(), Ts = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, xl = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/, Sl = H(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, xl).getRegex(), cs = { _backpedal: _t, anyPunctuation: fl, autolink: gl, blockSkip: Jr, br: tr, code: Gr, del: _t, delLDelim: _t, delRDelim: _t, emStrongLDelim: el, emStrongRDelimAst: rl, emStrongRDelimUnd: il, escape: qr, link: kl, nolink: yl, punctuation: Zr, reflink: bl, reflinkSearch: wl, tag: vl, text: Yr, url: _t }, Tl = { ...cs, emStrongLDelim: sl, emStrongRDelimAst: ol, emStrongRDelimUnd: cl, link: H(/^!?\[(label)\]\((.*?)\)/).replace("label", Pn).getRegex(), reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Pn).getRegex() }, Jn = { ...cs, emStrongRDelimAst: ll, emStrongLDelim: tl, delLDelim: dl, delRDelim: hl, url: H(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Sl).replace("protocol", Ts).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: H(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", Ts).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() }, Al = { ...Jn, br: H(tr).replace("{2,}", "*").getRegex(), text: H(Jn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, $n = { normal: us, gfm: Wr, pedantic: Vr }, rn = { normal: cs, gfm: Jn, breaks: Al, pedantic: Tl }, El = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, As = (n) => El[n];
function Ie(n, e) {
  if (e) {
    if (_e.escapeTest.test(n)) return n.replace(_e.escapeReplace, As);
  } else if (_e.escapeTestNoEncode.test(n)) return n.replace(_e.escapeReplaceNoEncode, As);
  return n;
}
function Rl(n) {
  return n.replace(_e.numericCharacterReference, (e, t, s) => {
    let r = t === void 0 ? Number.parseInt(s, 16) : Number.parseInt(t, 10);
    return r === 0 || r > 1114111 || r >= 55296 && r <= 57343 ? "�" : String.fromCodePoint(r);
  });
}
function Es(n) {
  try {
    n = encodeURI(n).replace(_e.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function Rs(n, e) {
  let t = n.replace(_e.findPipe, (a, u, o) => {
    let k = !1, y = u;
    for (; --y >= 0 && o[y] === "\\"; ) k = !k;
    return k ? "|" : " |";
  }), s = t.split(_e.splitPipe), r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; r < s.length; r++) s[r] = s[r].trim().replace(_e.slashPipe, "|");
  return s;
}
function ht(n, e, t) {
  let s = n.length;
  if (s === 0) return "";
  let r = 0;
  for (; r < s && n.charAt(s - r - 1) === e; )
    r++;
  return n.slice(0, s - r);
}
function $s(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && _e.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function Dn(n) {
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
function Cs(n, e = 0) {
  let t = e, s = "";
  for (let r of n) if (r === "	") {
    let a = 4 - t % 4;
    s += " ".repeat(a), t += a;
  } else s += r, t++;
  return s;
}
function Ls(n, e, t, s, r) {
  let a = e.href, u = e.title || null, o = n[1].replace(r.other.outputLinkReplace, "$1"), k = n[0].charAt(0) === "!";
  s.state.inLink = !0;
  let y = s.state.linkEmitted, S = s.state.inRawBlock;
  s.state.linkEmitted = !1;
  let E = s.inlineTokens(o), D = s.state.linkEmitted;
  if (s.state.linkEmitted = y, s.state.inLink = !1, !k) {
    if (D) {
      s.state.inRawBlock = S;
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
function Is(n, e, t, s) {
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
var Nn = class {
  constructor(n) {
    se(this, "options");
    se(this, "rules");
    se(this, "lexer");
    this.options = n || St;
  }
  space(n) {
    let e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(n) {
    let e = this.rules.block.code.exec(n);
    if (e) {
      let t = this.options.pedantic ? e[0] : $s(e[0]), s = t.replace(this.rules.other.codeRemoveIndent, "");
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
        let s = ht(t, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceTabChar.test(s)) && (t = s.trim());
      }
      return { type: "heading", raw: ht(e[0], `
`), depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(n) {
    let e = this.rules.block.hr.exec(n);
    if (e) return { type: "hr", raw: ht(e[0], `
`) };
  }
  blockquote(n) {
    let e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = ht(e[0], `
`).split(`
`), s = "", r = "", a = [];
      for (; t.length > 0; ) {
        let u = !1, o = [], k;
        for (k = 0; k < t.length; k++) if (this.rules.other.blockquoteStart.test(t[k])) o.push(t[k]), u = !0;
        else if (!u) o.push(t[k]);
        else break;
        t = t.slice(k);
        let y = o.join(`
`), S = y.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${y}` : y, r = r ? `${r}
${S}` : S;
        let E = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(S, a, !0), this.lexer.state.top = E, t.length === 0) break;
        let D = a.at(-1);
        if (D?.type === "code") break;
        if (D?.type === "blockquote") {
          let U = D, L = t.join(`
`), Q = U.raw + `
` + L.replace(this.rules.other.blockquoteSetextReplace2, ""), M = this.blockquote(Q);
          a[a.length - 1] = M;
          let Y = Q.substring(M.raw.length).replace(/^\n/, ""), ee = Y ? Y.split(`
`).length : 0, C = ee ? t.slice(0, -ee) : t;
          C.length > 0 && (s = `${s}
${C.join(`
`)}`), r = r.substring(0, r.length - U.text.length) + M.text;
          break;
        } else if (D?.type === "list") {
          let U = D, L = U.raw + `
` + t.join(`
`), Q = this.list(L);
          a[a.length - 1] = Q, s = s.substring(0, s.length - D.raw.length) + Q.raw, r = r.substring(0, r.length - U.raw.length) + Q.raw, t = L.substring(a.at(-1).raw.length).split(`
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
        let k = !1, y = "", S = "";
        if (!(e = a.exec(n)) || this.rules.block.hr.test(n)) break;
        y = e[0], n = n.substring(y.length);
        let E = e[2].split(`
`, 1)[0], D = e[1].length, U = this.options.pedantic ? Cs(E, D) : E.replace(this.rules.other.leadingSpaceTab, (Y) => Cs(Y, D)), L = n.split(`
`, 1)[0], Q = !U.trim(), M = 0;
        if (this.options.pedantic ? (M = 2, S = U.trimStart()) : Q ? M = D + 1 : (M = U.search(this.rules.other.nonSpaceChar), M = M > 4 ? 1 : M, S = U.slice(M), M += D), Q && this.rules.other.blankLine.test(L) && (y += L + `
`, n = n.substring(L.length + 1), k = !0), !k) {
          let Y = this.rules.other.nextBulletRegex(M), ee = this.rules.other.hrRegex(M), C = this.rules.other.fencesBeginRegex(M), z = this.rules.other.headingBeginRegex(M), B = this.rules.other.htmlBeginRegex(M), te = this.rules.other.blockquoteBeginRegex(M);
          for (; n; ) {
            let ie = n.split(`
`, 1)[0], F;
            if (L = ie, this.options.pedantic ? (L = L.replace(this.rules.other.listReplaceNesting, "  "), F = L) : F = L.replace(this.rules.other.leadingSpaceTab, (_) => _.replace(this.rules.other.tabCharGlobal, "    ")), C.test(L) || z.test(L) || B.test(L) || te.test(L) || Y.test(L) || ee.test(L)) break;
            if (F.search(this.rules.other.nonSpaceChar) >= M || !L.trim()) S += `
` + F.slice(M);
            else {
              if (Q || U.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || C.test(U) || z.test(U) || ee.test(U)) break;
              S += `
` + L;
            }
            Q = !L.trim(), y += ie + `
`, n = n.substring(ie.length + 1), U = F.slice(M);
          }
        }
        r.loose || (u ? r.loose = !0 : this.rules.other.doubleBlankLine.test(y) && (u = !0)), r.items.push({ type: "list_item", raw: y, task: !!this.options.gfm && this.rules.other.listIsTask.test(S), loose: !1, text: S, tokens: [] }), r.raw += y;
      }
      let o = r.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let k of r.items) if (this.lexer.state.top = !1, k.tokens = this.lexer.blockTokens(k.text, []), !r.loose) {
        let y = k.tokens.filter((E) => E.type === "space"), S = y.length > 0 && y.some((E) => this.rules.other.anyLine.test(E.raw));
        r.loose = S;
      }
      for (let k of r.items) {
        let y = k.tokens[0];
        if (k.task && (y?.type === "text" || y?.type === "paragraph")) {
          k.text = k.text.replace(this.rules.other.listReplaceTask, ""), y.raw = y.raw.replace(this.rules.other.listReplaceTask, ""), y.text = y.text.replace(this.rules.other.listReplaceTask, "");
          for (let E = this.lexer.inlineQueue.length - 1; E >= 0; E--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[E].src)) {
            this.lexer.inlineQueue[E].src = this.lexer.inlineQueue[E].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let S = this.rules.other.listTaskCheckbox.exec(k.raw);
          if (S) {
            let E = { type: "checkbox", raw: S[0] + " ", checked: S[0] !== "[ ]" };
            k.checked = E.checked, r.loose ? k.tokens[0] && ["paragraph", "text"].includes(k.tokens[0].type) && "tokens" in k.tokens[0] && k.tokens[0].tokens ? (k.tokens[0].raw = E.raw + k.tokens[0].raw, k.tokens[0].text = E.raw + k.tokens[0].text, k.tokens[0].tokens.unshift(E)) : k.tokens.unshift({ type: "paragraph", raw: E.raw, text: E.raw, tokens: [E] }) : k.tokens.unshift(E);
          }
        } else k.task && (k.task = !1);
      }
      if (r.loose) for (let k of r.items) {
        k.loose = !0;
        for (let y of k.tokens) y.type === "text" && (y.type = "paragraph");
      }
      return r;
    }
  }
  html(n) {
    let e = this.rules.block.html.exec(n);
    if (e) {
      let t = $s(e[0]);
      return { type: "html", block: !0, raw: t, pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: t };
    }
  }
  def(n) {
    let e = this.rules.block.def.exec(n);
    if (e) {
      let t = Dn(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: ht(e[0], `
`), href: s, title: r };
    }
  }
  table(n) {
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = Rs(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: ht(e[0], `
`), header: [], align: [], rows: [] };
    if (t.length === s.length) {
      for (let u of s) this.rules.other.tableAlignRight.test(u) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(u) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(u) ? a.align.push("left") : a.align.push(null);
      for (let u = 0; u < t.length; u++) a.header.push({ text: t[u], tokens: this.lexer.inline(t[u]), header: !0, align: a.align[u] });
      for (let u of r) a.rows.push(Rs(u, a.header.length).map((o, k) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: a.align[k] })));
      return a;
    }
  }
  lheading(n) {
    let e = this.rules.block.lheading.exec(n);
    if (e) {
      let t = e[1].trim();
      return { type: "heading", raw: ht(e[0], `
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
      if (!this.options.pedantic && Is(n, e[1], t, this.rules)) return;
      let s = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(s)) {
        if (!this.rules.other.endAngleBracket.test(s)) return;
        let u = ht(s.slice(0, -1), "\\");
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
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(s) ? r = r.slice(1) : r = r.slice(1, -1)), Ls(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: a && a.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      let s = t[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Is(n, t[1], s, this.rules)) return;
      let r = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), a = e[Dn(r)];
      if (!a) {
        let u = t[0].charAt(0);
        return { type: "text", raw: u, text: u };
      }
      return Ls(t, a, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let s = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!s || !s[1] && !s[2] && !s[3] && !s[4] || s[4] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[3]) || !t || this.rules.inline.punctuation.exec(t))) {
      let r = [...s[0]].length - 1, a, u, o = r, k = 0, y = s[0][0], S = t === y, E = y === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
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
          if (S) break;
        }
        if (o -= u, o > 0) continue;
        u = Math.min(u, u + o + k);
        let D = [...s[0]][0].length, U = n.slice(0, r + s.index + D + u);
        if (Math.min(r, u) % 2) {
          let Q = U.slice(1, -1);
          return { type: "em", raw: U, text: Q, tokens: this.lexer.inlineTokens(Q) };
        }
        let L = U.slice(2, -2);
        return { type: "strong", raw: U, text: L, tokens: this.lexer.inlineTokens(L) };
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
        let y = [...s[0]][0].length, S = n.slice(0, r + s.index + y + u), E = S.slice(r, -r);
        return { type: "del", raw: S, text: E, tokens: this.lexer.inlineTokens(E) };
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
}, He = class es {
  constructor(e) {
    se(this, "tokens");
    se(this, "options");
    se(this, "state");
    se(this, "inlineQueue");
    se(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || St, this.options.tokenizer = this.options.tokenizer || new Nn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, linkEmitted: !1, top: !0 };
    let t = { other: _e, block: $n.normal, inline: rn.normal };
    this.options.pedantic ? (t.block = $n.pedantic, t.inline = rn.pedantic) : this.options.gfm && (t.block = $n.gfm, this.options.breaks ? t.inline = rn.breaks : t.inline = rn.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: $n, inline: rn };
  }
  static lex(e, t) {
    return new es(t).lex(e);
  }
  static lexInline(e, t) {
    return new es(t).inlineTokens(e);
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
        let o = 1 / 0, k = e.slice(1), y;
        this.options.extensions.startBlock.forEach((S) => {
          y = S.call({ lexer: this }, k), typeof y == "number" && y >= 0 && (o = Math.min(o, y));
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
      if (!(r.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, Dn(r.slice(a + 1, -1)))) && !(a > 1 && this.linkInText(r.slice(1, a - 1)))) return !0;
    }
    return !1;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let s = e;
    if (this.tokens.links && e.includes("[")) {
      let o = this.tokenizer.rules.inline.reflinkSearch, k = (y) => {
        let S = y.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, Dn(y.slice(S + 1, -1)))) return y;
        if (S > 1 && y.charAt(0) !== "!") {
          let E = y.slice(1, S - 1);
          if (this.linkInText(E)) return "[" + E.replace(o, k) + "][" + "a".repeat(y.length - S - 2) + "]";
        }
        return "[" + "a".repeat(y.length - 2) + "]";
      };
      s = s.replace(o, k);
    }
    s = s.replace(this.tokenizer.rules.inline.anyPunctuation, (o) => "+".repeat(o.length)), s = s.replace(this.tokenizer.rules.inline.blockSkip, (o, k, y) => {
      let S = y ? y.length : 0;
      return o.slice(0, S) + "[" + "a".repeat(o.length - S - 2) + "]";
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
      if (this.options.extensions?.inline?.some((y) => (o = y.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
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
        let y = t.at(-1);
        o.type === "text" && y?.type === "text" ? (y.raw += o.raw, y.text += o.text) : t.push(o);
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
        let y = 1 / 0, S = e.slice(1), E;
        this.options.extensions.startInline.forEach((D) => {
          E = D.call({ lexer: this }, S), typeof E == "number" && E >= 0 && (y = Math.min(y, E));
        }), y < 1 / 0 && y >= 0 && (k = e.substring(0, y + 1));
      }
      if (o = this.tokenizer.inlineText(k)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (a = o.raw.slice(-1)), r = !0;
        let y = t.at(-1);
        y?.type === "text" ? (y.raw += o.raw, y.text += o.text) : t.push(o);
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
}, Mn = class {
  constructor(n) {
    se(this, "options");
    se(this, "parser");
    this.options = n || St;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    let s = (e || "").match(_e.notSpaceStart)?.[0], r = n ? n.replace(_e.endingNewline, "") + `
` : "";
    return s ? '<pre><code class="language-' + Ie(s) + '">' + (t ? r : Ie(r, !0)) + `</code></pre>
` : "<pre><code>" + (t ? r : Ie(r, !0)) + `</code></pre>
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
    return `<code>${Ie(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, text: t, tokens: s, autolink: r }) {
    let a = r ? Ie(t, !0) : this.parser.parseInline(s), u = Es(n);
    if (u === null) return a;
    n = Ie(u, r);
    let o = '<a href="' + n + '"';
    return e && (o += ' title="' + Ie(e) + '"'), o += ">" + a + "</a>", o;
  }
  image({ href: n, title: e, text: t, tokens: s }) {
    s && (t = this.parser.parseInline(s, this.parser.textRenderer));
    let r = Es(n);
    if (r === null) return Ie(t);
    n = r;
    let a = `<img src="${Ie(n)}" alt="${Ie(t)}"`;
    return e && (a += ` title="${Ie(e)}"`), a += ">", a;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : Ie(n.text);
  }
}, ds = class {
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
}, je = class ts {
  constructor(e) {
    se(this, "options");
    se(this, "renderer");
    se(this, "textRenderer");
    this.options = e || St, this.options.renderer = this.options.renderer || new Mn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ds();
  }
  static parse(e, t) {
    return new ts(t).parse(e);
  }
  static parseInline(e, t) {
    return new ts(t).parseInline(e);
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
}, In, dn = (In = class {
  constructor(n) {
    se(this, "options");
    se(this, "block");
    this.options = n || St;
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
    return n ? He.lex : He.lexInline;
  }
  provideParser(n = this.block) {
    return n ? je.parse : je.parseInline;
  }
}, se(In, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), se(In, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), In), Ll = class {
  constructor(...n) {
    se(this, "defaults", rs());
    se(this, "options", this.setOptions);
    se(this, "parse", this.parseMarkdown(!0));
    se(this, "parseInline", this.parseMarkdown(!1));
    se(this, "Parser", je);
    se(this, "Renderer", Mn);
    se(this, "TextRenderer", ds);
    se(this, "Lexer", He);
    se(this, "Tokenizer", Nn);
    se(this, "Hooks", dn);
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
        let r = this.defaults.renderer || new Mn(this.defaults);
        for (let a in t.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let u = a, o = t.renderer[u], k = r[u];
          r[u] = (...y) => {
            let S = o.apply(r, y);
            return S === !1 && (S = k.apply(r, y)), S || "";
          };
        }
        s.renderer = r;
      }
      if (t.tokenizer) {
        let r = this.defaults.tokenizer || new Nn(this.defaults);
        for (let a in t.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let u = a, o = t.tokenizer[u], k = r[u];
          r[u] = (...y) => {
            let S = o.apply(r, y);
            return S === !1 && (S = k.apply(r, y)), S;
          };
        }
        s.tokenizer = r;
      }
      if (t.hooks) {
        let r = this.defaults.hooks || new dn();
        for (let a in t.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let u = a, o = t.hooks[u], k = r[u];
          dn.passThroughHooks.has(a) ? r[u] = (y) => {
            if (this.defaults.async && dn.passThroughHooksRespectAsync.has(a)) return (async () => {
              let E = await o.call(r, y);
              return k.call(r, E);
            })();
            let S = o.call(r, y);
            return k.call(r, S);
          } : r[u] = (...y) => {
            if (this.defaults.async) return (async () => {
              let E = await o.apply(r, y);
              return E === !1 && (E = await k.apply(r, y)), E;
            })();
            let S = o.apply(r, y);
            return S === !1 && (S = k.apply(r, y)), S;
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
    return He.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return je.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let s = { ...t }, r = { ...this.defaults, ...s }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = n), r.async) return (async () => {
        let u = r.hooks ? await r.hooks.preprocess(e) : e, o = await (r.hooks ? await r.hooks.provideLexer(n) : n ? He.lex : He.lexInline)(u, r), k = r.hooks ? await r.hooks.processAllTokens(o) : o;
        r.walkTokens && await Promise.all(this.walkTokens(k, r.walkTokens));
        let y = await (r.hooks ? await r.hooks.provideParser(n) : n ? je.parse : je.parseInline)(k, r);
        return r.hooks ? await r.hooks.postprocess(y) : y;
      })().catch(a);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let u = (r.hooks ? r.hooks.provideLexer(n) : n ? He.lex : He.lexInline)(e, r);
        r.hooks && (u = r.hooks.processAllTokens(u)), r.walkTokens && this.walkTokens(u, r.walkTokens);
        let o = (r.hooks ? r.hooks.provideParser(n) : n ? je.parse : je.parseInline)(u, r);
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
        let s = "<p>An error occurred:</p><pre>" + Ie(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, xt = new Ll();
function re(n, e) {
  return xt.parse(n, e);
}
re.options = re.setOptions = function(n) {
  return xt.setOptions(n), re.defaults = xt.defaults, Xs(re.defaults), re;
};
re.getDefaults = rs;
re.defaults = St;
function Il(...n) {
  return xt.use(...n), re.defaults = xt.defaults, Xs(re.defaults), re;
}
re.use = Il;
re.walkTokens = function(n, e) {
  return xt.walkTokens(n, e);
};
re.parseInline = xt.parseInline;
re.Parser = je;
re.parser = je.parse;
re.Renderer = Mn;
re.TextRenderer = ds;
re.Lexer = He;
re.lexer = He.lex;
re.Tokenizer = Nn;
re.Hooks = dn;
re.parse = re;
re.options;
re.setOptions;
re.walkTokens;
re.parseInline;
je.parse;
He.lex;
/*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE */
function Os(n, e) {
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
    var s, r, a, u, o = [], k = !0, y = !1;
    try {
      if (a = (t = t.call(n)).next, e !== 0) for (; !(k = (s = a.call(t)).done) && (o.push(s.value), o.length !== e); k = !0) ;
    } catch (S) {
      y = !0, r = S;
    } finally {
      try {
        if (!k && t.return != null && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (y) throw r;
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
function Nl(n, e) {
  return Ol(n) || Pl(n, e) || Ml(n, e) || Dl();
}
function Ml(n, e) {
  if (n) {
    if (typeof n == "string") return Os(n, e);
    var t = {}.toString.call(n).slice(8, -1);
    return t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set" ? Array.from(n) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Os(n, e) : void 0;
  }
}
const ar = Object.entries, Ps = Object.setPrototypeOf, zl = Object.isFrozen, Fl = Object.getPrototypeOf, Ul = Object.getOwnPropertyDescriptor;
let ve = Object.freeze, ye = Object.seal, jt = Object.create, or = typeof Reflect < "u" && Reflect, ns = or.apply, ss = or.construct;
ve || (ve = function(e) {
  return e;
});
ye || (ye = function(e) {
  return e;
});
ns || (ns = function(e, t) {
  for (var s = arguments.length, r = new Array(s > 2 ? s - 2 : 0), a = 2; a < s; a++) r[a - 2] = arguments[a];
  return e.apply(t, r);
});
ss || (ss = function(e) {
  for (var t = arguments.length, s = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) s[r - 1] = arguments[r];
  return new e(...s);
});
const yt = ge(Array.prototype.forEach), Bl = ge(Array.prototype.lastIndexOf), Ds = ge(Array.prototype.pop), ln = ge(Array.prototype.push), Hl = ge(Array.prototype.splice), Vt = Array.isArray, pn = ge(String.prototype.toLowerCase), Gn = ge(String.prototype.toString), Ns = ge(String.prototype.match), an = ge(String.prototype.replace), Ms = ge(String.prototype.indexOf), jl = ge(String.prototype.trim), Wl = ge(Number.prototype.toString), Vl = ge(Boolean.prototype.toString), zs = typeof BigInt > "u" ? null : ge(BigInt.prototype.toString), Fs = typeof Symbol > "u" ? null : ge(Symbol.prototype.toString), $e = ge(Object.prototype.hasOwnProperty), on = ge(Object.prototype.toString), xe = ge(RegExp.prototype.test), ft = ql(TypeError);
function ge(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, s = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) s[r - 1] = arguments[r];
    return ns(n, e, s);
  };
}
function ql(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
    return ss(n, t);
  };
}
function Z(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : pn;
  if (Ps && Ps(n, null), !Vt(e)) return n;
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
  for (let e = 0; e < n.length; e++) $e(n, e) || (n[e] = null);
  return n;
}
function Oe(n) {
  const e = jt(null);
  for (const s of ar(n)) {
    var t = Nl(s, 2);
    const r = t[0], a = t[1];
    $e(n, r) && (Vt(a) ? e[r] = Gl(a) : a && typeof a == "object" && a.constructor === Object ? e[r] = Oe(a) : e[r] = a);
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
      return zs ? zs(n) : "0";
    case "symbol":
      return Fs ? Fs(n) : "Symbol()";
    case "undefined":
      return on(n);
    case "function":
    case "object": {
      if (n === null) return on(n);
      const e = n, t = Me(e, "toString");
      if (typeof t == "function") {
        const s = t(e);
        return typeof s == "string" ? s : on(s);
      }
      return on(n);
    }
    default:
      return on(n);
  }
}
function Me(n, e) {
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
    return xe(n, ""), !0;
  } catch {
    return !1;
  }
}
const Us = ve([
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
]), Yn = ve([
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
]), Zn = ve([
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
]), Kl = ve([
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
]), Kn = ve([
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
]), Xl = ve([
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
]), Bs = ve(["#text"]), Hs = ve([
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
]), Xn = ve([
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
]), js = ve([
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
]), Cn = ve([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Ql = ye(/{{[\w\W]*|^[\w\W]*}}/g), Jl = ye(/<%[\w\W]*|^[\w\W]*%>/g), ea = ye(/\${[\w\W]*/g), ta = ye(/^data-[\-\w.\u00B7-\uFFFF]+$/), na = ye(/^aria-[\-\w]+$/), Ws = ye(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), sa = ye(/^(?:\w+script|data):/i), ra = ye(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), la = ye(/^html$/i), aa = ye(/^[a-z][.\w]*(-[.\w]+)+$/i), Vs = ye(/<[/\w!]/g), qs = ye(/<[/\w]/g), oa = ye(/<\/no(script|embed|frames)/i), ia = ye(/\/>/i), Le = {
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
}, ir = [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
], ua = ve(Z({}, ir)), ca = function() {
  const n = {};
  return yt(ir, (e) => {
    n[e] = ye(new RegExp("</" + e + "(?=[\\t\\n\\f\\r />])", "i"));
  }), ve(n);
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
}, Gs = function() {
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
}, gt = function(e, t, s, r) {
  return $e(e, t) && Vt(e[t]) ? Z(r.base ? Oe(r.base) : {}, e[t], r.transform) : s;
}, Qn = function(e, t, s) {
  const r = $e(e, t) ? e[t] : void 0;
  return r && typeof r == "object" ? Oe(r) : s();
};
function ur() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : da();
  const e = (x) => ur(x);
  if (e.version = "3.4.16", e.removed = [], !n || !n.document || n.document.nodeType !== Le.document || !n.Element)
    return e.isSupported = !1, e;
  let t = n.document;
  const s = t, r = s.currentScript;
  n.DocumentFragment;
  const a = n.HTMLTemplateElement, u = n.Node, o = n.Element, k = n.NodeFilter;
  n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const y = n.DOMParser, S = n.trustedTypes, E = o.prototype, D = Me(E, "cloneNode"), U = Me(E, "remove"), L = Me(E, "removeAttributeNode"), Q = Me(E, "nextSibling"), M = Me(E, "childNodes"), Y = Me(E, "parentNode"), ee = Me(E, "shadowRoot"), C = Me(E, "attributes"), z = u && u.prototype ? Me(u.prototype, "nodeType") : null, B = u && u.prototype ? Me(u.prototype, "nodeName") : null, te = u && u.prototype ? Me(u.prototype, "ownerDocument") : null, ie = function(l) {
    return z ? z(l) : l.nodeType;
  }, F = function(l) {
    return B ? B(l) : l.nodeName;
  };
  if (typeof a == "function") {
    const x = t.createElement("template");
    x.content && x.content.ownerDocument && (t = x.content.ownerDocument);
  }
  let _, f = "", m, T = !1, R = 0;
  const N = function() {
    if (R > 0) throw ft('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, K = function(l) {
    N(), R++;
    try {
      return _.createHTML(l);
    } finally {
      R--;
    }
  }, V = function(l) {
    N(), R++;
    try {
      return _.createScriptURL(l);
    } finally {
      R--;
    }
  }, me = function() {
    return T || (m = pa(S, r), T = !0), m;
  }, st = t, Xe = st.implementation, Yt = st.createNodeIterator, Zt = st.createDocumentFragment, Tt = st.getElementsByTagName, rt = s.importNode;
  let J = Gs();
  e.isSupported = typeof ar == "function" && typeof Y == "function" && Xe && Xe.createHTMLDocument !== void 0;
  const kn = Ql, bn = Jl, At = ea, Fn = ta, Un = na, yn = sa, lt = ra, Et = aa;
  let mt = Ws, q = null;
  const Rt = Z({}, [
    ...Us,
    ...Yn,
    ...Zn,
    ...Kn,
    ...Bs
  ]);
  let le = null;
  const $t = Z({}, [
    ...Hs,
    ...Xn,
    ...js,
    ...Cn
  ]);
  let Te = Object.seal(jt(null, {
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
  })), at = null, _n = null;
  const We = Object.seal(jt(null, {
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
  let Qe = !0, Kt = !0, Ct = !1, Xt = !0, Ve = !1, j = !0, qe = !1, Lt = !1, vt = null, It = null, Ot = !1, Je = !1, ne = !1, ke = !1, Ge = !0, ot = !1;
  const Fe = "user-content-";
  let fe = !0, it = !1, ue = {}, De = null;
  const Qt = Z({}, [
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
  let Jt = null;
  const he = Z({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let kt = null;
  const Ye = Z({}, [
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
  ]), Ue = "http://www.w3.org/1998/Math/MathML", ut = "http://www.w3.org/2000/svg", Ae = "http://www.w3.org/1999/xhtml";
  let et = Ae, Pt = !1, en = null;
  const Bn = Z({}, [
    Ue,
    ut,
    Ae
  ], Gn), Dt = ve([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let Be = Z({}, Dt);
  const tn = ve(["annotation-xml"]);
  let Nt = Z({}, tn);
  const Hn = Z({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let ct = null;
  const wn = ["application/xhtml+xml", "text/html"], jn = "text/html";
  let ce = null, dt = null;
  const nn = t.createElement("form"), c = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, p = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (dt && dt === l) return;
    (!l || typeof l != "object") && (l = {}), l = Oe(l), ct = wn.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? jn : l.PARSER_MEDIA_TYPE, ce = ct === "application/xhtml+xml" ? Gn : pn, q = gt(l, "ALLOWED_TAGS", Rt, { transform: ce }), le = gt(l, "ALLOWED_ATTR", $t, { transform: ce }), en = gt(l, "ALLOWED_NAMESPACES", Bn, { transform: Gn }), kt = gt(l, "ADD_URI_SAFE_ATTR", Ye, {
      transform: ce,
      base: Ye
    }), Jt = gt(l, "ADD_DATA_URI_TAGS", he, {
      transform: ce,
      base: he
    }), De = gt(l, "FORBID_CONTENTS", Qt, { transform: ce }), at = gt(l, "FORBID_TAGS", Oe({}), { transform: ce }), _n = gt(l, "FORBID_ATTR", Oe({}), { transform: ce }), ue = $e(l, "USE_PROFILES") ? l.USE_PROFILES && typeof l.USE_PROFILES == "object" ? Oe(l.USE_PROFILES) : l.USE_PROFILES : !1, Qe = l.ALLOW_ARIA_ATTR !== !1, Kt = l.ALLOW_DATA_ATTR !== !1, Ct = l.ALLOW_UNKNOWN_PROTOCOLS || !1, Xt = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ve = l.SAFE_FOR_TEMPLATES || !1, j = l.SAFE_FOR_XML !== !1, qe = l.WHOLE_DOCUMENT || !1, Je = l.RETURN_DOM || !1, ne = l.RETURN_DOM_FRAGMENT || !1, ke = l.RETURN_TRUSTED_TYPE || !1, Ot = l.FORCE_BODY || !1, Ge = l.SANITIZE_DOM !== !1, ot = l.SANITIZE_NAMED_PROPS || !1, fe = l.KEEP_CONTENT !== !1, it = l.IN_PLACE || !1, mt = Zl(l.ALLOWED_URI_REGEXP) ? l.ALLOWED_URI_REGEXP : Ws, et = typeof l.NAMESPACE == "string" ? l.NAMESPACE : Ae, Be = Qn(l, "MATHML_TEXT_INTEGRATION_POINTS", () => Z({}, Dt)), Nt = Qn(l, "HTML_INTEGRATION_POINTS", () => Z({}, tn));
    const h = Qn(l, "CUSTOM_ELEMENT_HANDLING", () => jt(null));
    if (Te = jt(null), $e(h, "tagNameCheck") && c(h.tagNameCheck) && (Te.tagNameCheck = h.tagNameCheck), $e(h, "attributeNameCheck") && c(h.attributeNameCheck) && (Te.attributeNameCheck = h.attributeNameCheck), $e(h, "allowCustomizedBuiltInElements") && typeof h.allowCustomizedBuiltInElements == "boolean" && (Te.allowCustomizedBuiltInElements = h.allowCustomizedBuiltInElements), ye(Te), Ve && (Kt = !1), ne && (Je = !0), ue && (q = Z({}, Bs), le = jt(null), ue.html === !0 && (Z(q, Us), Z(le, Hs)), ue.svg === !0 && (Z(q, Yn), Z(le, Xn), Z(le, Cn)), ue.svgFilters === !0 && (Z(q, Zn), Z(le, Xn), Z(le, Cn)), ue.mathMl === !0 && (Z(q, Kn), Z(le, js), Z(le, Cn))), We.tagCheck = null, We.attributeCheck = null, $e(l, "ADD_TAGS") && (typeof l.ADD_TAGS == "function" ? We.tagCheck = l.ADD_TAGS : Vt(l.ADD_TAGS) && (q === Rt && (q = Oe(q)), Z(q, l.ADD_TAGS, ce))), $e(l, "ADD_ATTR") && (typeof l.ADD_ATTR == "function" ? We.attributeCheck = l.ADD_ATTR : Vt(l.ADD_ATTR) && (le === $t && (le = Oe(le)), Z(le, l.ADD_ATTR, ce))), $e(l, "ADD_FORBID_CONTENTS") && Vt(l.ADD_FORBID_CONTENTS) && (De === Qt && (De = Oe(De)), Z(De, l.ADD_FORBID_CONTENTS, ce)), fe && (q["#text"] = !0), qe && Z(q, [
      "html",
      "head",
      "body"
    ]), q.table && (Z(q, ["tbody"]), delete at.tbody), l.TRUSTED_TYPES_POLICY) {
      if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function") throw ft('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw ft('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const w = _;
      _ = l.TRUSTED_TYPES_POLICY;
      try {
        f = K("");
      } catch (A) {
        throw _ = w, A;
      }
    } else l.TRUSTED_TYPES_POLICY === null ? (_ = void 0, f = "") : (_ === void 0 && (_ = me()), _ && typeof f == "string" && (f = K("")));
    ve && ve(l), dt = l;
  }, d = Z({}, [
    ...Yn,
    ...Zn,
    ...Kl
  ]), $ = Z({}, [...Kn, ...Xl]), we = function(l, h, w) {
    return h.namespaceURI === Ae ? l === "svg" : h.namespaceURI === Ue ? l === "svg" && (w === "annotation-xml" || Be[w]) : !!d[l];
  }, hr = function(l, h, w) {
    return h.namespaceURI === Ae ? l === "math" : h.namespaceURI === ut ? l === "math" && Nt[w] : !!$[l];
  }, fr = function(l, h, w) {
    return h.namespaceURI === ut && !Nt[w] || h.namespaceURI === Ue && !Be[w] ? !1 : !$[l] && (Hn[l] || !d[l]);
  }, gr = function(l) {
    let h = Y(l);
    (!h || !h.tagName) && (h = {
      namespaceURI: et,
      tagName: "template"
    });
    const w = pn(l.tagName), A = pn(h.tagName);
    return en[l.namespaceURI] ? l.namespaceURI === ut ? we(w, h, A) : l.namespaceURI === Ue ? hr(w, h, A) : l.namespaceURI === Ae ? fr(w, h, A) : !!(ct === "application/xhtml+xml" && en[l.namespaceURI]) : !1;
  }, pt = function(l) {
    ln(e.removed, { element: l });
    try {
      Y(l).removeChild(l);
    } catch {
      if (U(l), !Y(l)) throw ft("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, hs = function(l, h, w) {
    try {
      L(l, h);
    } catch {
      try {
        l.removeAttribute(w);
      } catch {
      }
    }
  }, xn = function(l) {
    Sn(l);
    const h = M(l);
    if (h) {
      const A = [];
      yt(h, (P) => {
        ln(A, P);
      }), yt(A, (P) => {
        try {
          U(P);
        } catch {
        }
      });
    }
    const w = C(l);
    if (w) for (let A = w.length - 1; A >= 0; --A) {
      const P = w[A], W = P && P.name;
      typeof W == "string" && hs(l, P, W);
    }
  }, bt = function(l, h, w) {
    if (!w) try {
      w = h.getAttributeNode(l);
    } catch {
      w = null;
    }
    ln(e.removed, {
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
      if (Je || ne) try {
        pt(h);
      } catch {
      }
      else try {
        h.setAttribute(l, "");
      } catch {
      }
  }, mr = function(l) {
    const h = C(l);
    if (h)
      for (let w = h.length - 1; w >= 0; --w) {
        const A = h[w], P = A && A.name;
        typeof P != "string" || le[ce(P)] || hs(l, A, P);
      }
  }, Sn = function(l) {
    const h = [l];
    for (; h.length > 0; ) {
      const w = h.pop();
      ie(w) === Le.element && mr(w);
      const A = M(w);
      if (A) for (let P = A.length - 1; P >= 0; --P) h.push(A[P]);
    }
  }, fs = function(l, h) {
    return j ? l === "patchsrc" ? !0 : l === "for" && h !== "label" && h !== "output" : !1;
  }, vr = function(l) {
    if (!j) return;
    const h = [l];
    for (; h.length > 0; ) {
      const w = h.pop(), A = ie(w);
      if (A === Le.processingInstruction || A === Le.comment && xe(qs, w.data)) {
        try {
          U(w);
        } catch {
        }
        continue;
      }
      if (A === Le.element) {
        const W = w, G = ce(F(w));
        try {
          W.hasAttribute && W.hasAttribute("patchsrc") && W.removeAttribute("patchsrc"), W.hasAttribute && W.hasAttribute("for") && fs("for", G) && W.removeAttribute("for");
        } catch {
        }
      }
      const P = M(w);
      if (P) for (let W = P.length - 1; W >= 0; --W) h.push(P[W]);
    }
  }, gs = function(l) {
    let h = null, w = null;
    if (Ot) l = "<remove></remove>" + l;
    else {
      const W = Ns(l, /^[\r\n\t ]+/);
      w = W && W[0];
    }
    ct === "application/xhtml+xml" && et === Ae && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const A = _ ? K(l) : l;
    if (et === Ae) try {
      h = new y().parseFromString(A, ct);
    } catch {
    }
    if (!h || !h.documentElement) {
      h = Xe.createDocument(et, "template", null);
      try {
        h.documentElement.innerHTML = Pt ? f : A;
      } catch {
      }
    }
    const P = h.body || h.documentElement;
    return l && w && P.insertBefore(t.createTextNode(w), P.childNodes[0] || null), et === Ae ? Tt.call(h, qe ? "html" : "body")[0] : qe ? h.documentElement : P;
  }, ms = function(l) {
    const h = te ? te(l) : l.ownerDocument;
    return Yt.call(h || l, l, k.SHOW_ELEMENT | k.SHOW_COMMENT | k.SHOW_TEXT | k.SHOW_PROCESSING_INSTRUCTION | k.SHOW_CDATA_SECTION, null);
  }, Tn = function(l) {
    return l = an(l, kn, " "), l = an(l, bn, " "), l = an(l, At, " "), l;
  }, Wn = function(l) {
    var h;
    l.normalize();
    const w = te ? te(l) : l.ownerDocument, A = Yt.call(w || l, l, k.SHOW_TEXT | k.SHOW_COMMENT | k.SHOW_CDATA_SECTION | k.SHOW_PROCESSING_INSTRUCTION, null);
    let P = A.nextNode();
    for (; P; )
      P.data = Tn(P.data), P = A.nextNode();
    const W = (h = l.querySelectorAll) === null || h === void 0 ? void 0 : h.call(l, "template");
    W && yt(W, (G) => {
      Mt(G.content) && Wn(G.content);
    });
  }, An = function(l) {
    const h = B ? B(l) : null;
    return typeof h != "string" || ce(h) !== "form" ? !1 : typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || l.attributes !== C(l) || typeof l.removeAttribute != "function" || typeof l.removeAttributeNode != "function" || typeof l.getAttributeNode != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function" || l.nodeType !== z(l) || l.childNodes !== M(l);
  }, Mt = function(l) {
    if (!z || typeof l != "object" || l === null) return !1;
    try {
      return z(l) === Le.documentFragment;
    } catch {
      return !1;
    }
  }, sn = function(l) {
    if (!z || typeof l != "object" || l === null) return !1;
    try {
      return typeof z(l) == "number";
    } catch {
      return !1;
    }
  };
  function Ze(x, l, h) {
    x.length !== 0 && yt(x, (w) => {
      w.call(e, l, h, dt);
    });
  }
  const kr = function(l, h) {
    return !!(j && l.hasChildNodes() && !sn(l.firstElementChild) && xe(Vs, l.textContent) && xe(Vs, l.innerHTML) || j && l.namespaceURI === Ae && ua[h] && (sn(l.firstElementChild) || typeof l.textContent == "string" && xe(ca[h], l.textContent)) || l.nodeType === Le.processingInstruction || j && l.nodeType === Le.comment && xe(qs, l.data));
  }, En = function(l, h) {
    if (l instanceof RegExp) return xe(l, h);
    if (l instanceof Function) {
      for (var w = arguments.length, A = new Array(w > 2 ? w - 2 : 0), P = 2; P < w; P++) A[P - 2] = arguments[P];
      return !!l(h, ...A);
    }
    return !1;
  }, br = function(l, h, w) {
    if (!at[h] && ys(h) && En(Te.tagNameCheck, h)) return !1;
    if (fe && !De[h]) {
      const A = Y(l), P = M(l);
      if (P && A) {
        const W = P.length;
        for (let G = W - 1; G >= 0; --G) {
          const pe = l === w ? D(P[G], !0) : P[G];
          A.insertBefore(pe, Q(l));
        }
      }
    }
    return pt(l), !0;
  }, vs = function(l, h, w, A) {
    return l.length === 0 ? h : h === w || h === A ? Oe(h) : h;
  }, zt = function(l, h) {
    return l === h || Y(l) !== null ? !1 : (it && Sn(l), !0);
  }, ks = function(l, h) {
    if (Ze(J.beforeSanitizeElements, l, null), zt(l, h)) return !0;
    if (An(l))
      return pt(l), !0;
    const w = ce(F(l));
    if (q = vs(J.uponSanitizeElement, q, Rt, vt), Ze(J.uponSanitizeElement, l, {
      tagName: w,
      allowedTags: q
    }), zt(l, h)) return !0;
    if (kr(l, w))
      return pt(l), !0;
    if (at[w] || !(We.tagCheck instanceof Function && We.tagCheck(w)) && !q[w]) {
      const A = br(l, w, h);
      return A === !1 && (Ze(J.afterSanitizeElements, l, null), zt(l, h)) ? !0 : A;
    }
    if (ie(l) === Le.element && !gr(l) || (w === "noscript" || w === "noembed" || w === "noframes") && xe(oa, l.innerHTML))
      return pt(l), !0;
    if (Ve && l.nodeType === Le.text) {
      const A = Tn(l.textContent);
      l.textContent !== A && (ln(e.removed, { element: l.cloneNode() }), l.textContent = A);
    }
    return Ze(J.afterSanitizeElements, l, null), zt(l, h);
  }, bs = function(l, h, w) {
    if (_n[h] || fs(h, l) || Ge && (h === "id" || h === "name") && (w in t || w in nn)) return !1;
    const A = le[h] || We.attributeCheck instanceof Function && We.attributeCheck(h, l);
    return Kt && xe(Fn, h) || Qe && xe(Un, h) ? !0 : A ? kt[h] || xe(mt, an(w, lt, "")) || (h === "src" || h === "xlink:href" || h === "href") && l !== "script" && Ms(w, "data:") === 0 && Jt[l] || Ct && !xe(yn, an(w, lt, "")) ? !0 : !w : ys(l) && En(Te.tagNameCheck, l) && En(Te.attributeNameCheck, h, l) || h === "is" && Te.allowCustomizedBuiltInElements && En(Te.tagNameCheck, w);
  }, yr = Z({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), ys = function(l) {
    return !yr[pn(l)] && xe(Et, l);
  }, _r = function(l, h, w, A) {
    if (_ && typeof S == "object" && typeof S.getAttributeType == "function" && !w) switch (S.getAttributeType(l, h)) {
      case "TrustedHTML":
        return K(A);
      case "TrustedScriptURL":
        return V(A);
    }
    return A;
  }, wr = function(l, h, w, A) {
    try {
      return w ? l.setAttributeNS(w, h, A) : l.setAttribute(h, A), An(l) ? (pt(l), !1) : !0;
    } catch {
      return bt(h, l), !1;
    }
  }, _s = function(l, h) {
    if (Ze(J.beforeSanitizeAttributes, l, null), zt(l, h)) return;
    const w = l.attributes;
    if (!w || An(l)) return;
    le = vs(J.uponSanitizeAttribute, le, $t, It);
    const A = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: le,
      forceKeepAttr: void 0
    };
    let P = w.length;
    const W = ce(l.nodeName);
    for (; P--; ) {
      const G = w[P], pe = G.name, Ne = G.namespaceURI, Ce = G.value, Ft = ce(pe), qn = Ce;
      let Ee = pe === "value" ? qn : jl(qn), ws = !1;
      if (A.attrName = Ft, A.attrValue = Ee, A.keepAttr = !0, A.forceKeepAttr = void 0, Ze(J.uponSanitizeAttribute, l, A), Ee = A.attrValue, ot && (Ft === "id" || Ft === "name") && Ms(Ee, Fe) !== 0 && (bt(pe, l, G), Ee = Fe + Ee, ws = !0), j && xe(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, Ee)) {
        bt(pe, l, G);
        continue;
      }
      if (Ft === "attributename" && Ns(Ee, "href")) {
        bt(pe, l, G);
        continue;
      }
      if (!A.forceKeepAttr) {
        if (!A.keepAttr) {
          bt(pe, l, G);
          continue;
        }
        if (!Xt && xe(ia, Ee)) {
          bt(pe, l, G);
          continue;
        }
        if (Ve && (Ee = Tn(Ee)), !bs(W, Ft, Ee)) {
          bt(pe, l, G);
          continue;
        }
        Ee = _r(W, Ft, Ne, Ee), Ee !== qn && wr(l, pe, Ne, Ee) && ws && Ds(e.removed);
      }
    }
    Ze(J.afterSanitizeAttributes, l, null), zt(l, h);
  }, Rn = function(l) {
    let h = null;
    const w = ms(l);
    for (Ze(J.beforeSanitizeShadowDOM, l, null); h = w.nextNode(); )
      if (Ze(J.uponSanitizeShadowNode, h, null), ks(h, l), _s(h, l), Mt(h.content) && Rn(h.content), ie(h) === Le.element) {
        const A = ee(h);
        Mt(A) && (Vn(A), Rn(A));
      }
    Ze(J.afterSanitizeShadowDOM, l, null);
  }, Vn = function(l) {
    const h = [{
      node: l,
      shadow: null
    }];
    for (; h.length > 0; ) {
      const w = h.pop();
      if (w.shadow) {
        Rn(w.shadow);
        continue;
      }
      const A = w.node, P = ie(A) === Le.element, W = M(A);
      if (W) for (let G = W.length - 1; G >= 0; --G) h.push({
        node: W[G],
        shadow: null
      });
      if (P) {
        const G = B ? B(A) : null;
        if (typeof G == "string" && ce(G) === "template") {
          const pe = A.content;
          Mt(pe) && h.push({
            node: pe,
            shadow: null
          });
        }
      }
      if (P) {
        const G = ee(A);
        Mt(G) && h.push({
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
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, h = null, w = null, A = null, P = null;
    if (Pt = !x, Pt && (x = "<!-->"), typeof x != "string" && !sn(x) && (x = Yl(x), typeof x != "string"))
      throw ft("dirty is not a string, aborting");
    if (!e.isSupported) return x;
    Lt ? (q = vt, le = It) : p(l), (J.uponSanitizeElement.length > 0 || J.uponSanitizeAttribute.length > 0) && (q = Oe(q)), J.uponSanitizeAttribute.length > 0 && (le = Oe(le)), e.removed = [];
    const W = it && typeof x != "string" && sn(x);
    if (W) {
      vr(x);
      const Ne = F(x);
      if (typeof Ne == "string") {
        const Ce = ce(Ne);
        if (!q[Ce] || at[Ce])
          throw xn(x), ft("root node is forbidden and cannot be sanitized in-place");
      }
      if (An(x))
        throw xn(x), ft("root node is clobbered and cannot be sanitized in-place");
      try {
        Vn(x);
      } catch (Ce) {
        throw xn(x), Ce;
      }
    } else if (sn(x))
      h = gs("<!---->"), w = h.ownerDocument.importNode(x, !0), w.nodeType === Le.element && w.nodeName === "BODY" || w.nodeName === "HTML" ? h = w : h.appendChild(w), Vn(h);
    else {
      if (!Je && !Ve && !qe && x.indexOf("<") === -1) return _ && ke ? K(x) : x;
      if (h = gs(x), !h) return Je ? null : ke ? f : "";
    }
    h && Ot && pt(h.firstChild);
    const G = W ? x : h;
    try {
      const Ne = ms(G);
      for (; A = Ne.nextNode(); )
        ks(A, G), _s(A, G), Mt(A.content) && Rn(A.content);
    } catch (Ne) {
      throw W && (xn(x), yt(e.removed, (Ce) => {
        Ce.element && Sn(Ce.element);
      })), Ne;
    }
    if (W) {
      let Ne = !1;
      if (yt(e.removed, (Ce) => {
        Ce.element && (Ce.element === x && (Ne = !0), Sn(Ce.element));
      }), Ne) throw ft("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return Ve && Wn(x), x;
    }
    if (Je) {
      if (Ve && Wn(h), ne)
        for (P = Zt.call(h.ownerDocument); h.firstChild; ) P.appendChild(h.firstChild);
      else P = h;
      return (le.shadowroot || le.shadowrootmode) && (P = rt.call(s, P, !0)), P;
    }
    let pe = qe ? h.outerHTML : h.innerHTML;
    return qe && q["!doctype"] && h.ownerDocument && h.ownerDocument.doctype && h.ownerDocument.doctype.name && xe(la, h.ownerDocument.doctype.name) && (pe = "<!DOCTYPE " + h.ownerDocument.doctype.name + `>
` + pe), Ve && (pe = Tn(pe)), _ && ke ? K(pe) : pe;
  }, e.setConfig = function() {
    let x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    p(x), Lt = !0, vt = q, It = le;
  }, e.clearConfig = function() {
    dt = null, Lt = !1, vt = null, It = null, _ = m, f = "";
  }, e.isValidAttribute = function(x, l, h) {
    dt || p({});
    const w = ce(x), A = ce(l);
    return bs(w, A, h);
  }, e.addHook = function(x, l) {
    typeof l == "function" && $e(J, x) && ln(J[x], l);
  }, e.removeHook = function(x, l) {
    if ($e(J, x)) {
      if (l !== void 0) {
        const h = Bl(J[x], l);
        return h === -1 ? void 0 : Hl(J[x], h, 1)[0];
      }
      return Ds(J[x]);
    }
  }, e.removeHooks = function(x) {
    $e(J, x) && (J[x] = []);
  }, e.removeAllHooks = function() {
    J = Gs();
  }, e;
}
var ha = ur();
const fa = ["innerHTML"], ga = /* @__PURE__ */ qt({
  __name: "MarkdownContent",
  props: {
    content: {}
  },
  setup(n) {
    const e = n, t = X(() => ha.sanitize(re.parse(e.content, { async: !1, breaks: !0 })));
    return (s, r) => (v(), b("div", {
      class: "markdown-content",
      innerHTML: t.value
    }, null, 8, fa));
  }
}), ps = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [s, r] of e)
    t[s] = r;
  return t;
}, un = /* @__PURE__ */ ps(ga, [["__scopeId", "data-v-ef377647"]]);
function cr() {
  const n = localStorage.getItem("0kay_lang");
  return n === "en" || n === "zh" ? n : navigator.language.startsWith("zh") ? "zh" : "en";
}
const tt = O(cr());
function ma() {
  tt.value = cr();
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
}, Aa = { class: "diff-file-head" }, Ea = ["title"], Ra = {
  key: 0,
  class: "diff-file-stat"
}, $a = { class: "diff-body" }, Ca = { class: "diff-no" }, La = { class: "diff-no" }, Ia = { class: "diff-sign" }, Oa = { class: "diff-text" }, Pa = {
  key: 0,
  class: "tool-section-label"
}, Da = { key: 1 }, Na = {
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
}, Ya = /* @__PURE__ */ qt({
  __name: "ToolStepCard",
  props: {
    step: {},
    formatError: { type: Function }
  },
  setup(n) {
    const e = n, t = (_, f) => tt.value === "en" ? f : _, s = O(!1), r = O(!1), a = X(() => (e.step.prompt || "").trim() || "tool"), u = X(() => ["websearch", "web_search", "search"].includes(a.value)), o = X(() => {
      if (!e.step.args) return null;
      try {
        const _ = JSON.parse(e.step.args);
        return _ && typeof _ == "object" && !Array.isArray(_) ? _ : null;
      } catch {
        return null;
      }
    }), k = X(() => {
      if (!e.step.result) return null;
      try {
        return JSON.parse(e.step.result);
      } catch {
        return e.step.result;
      }
    }), y = X(() => {
      const _ = k.value;
      return !_ || typeof _ != "object" || Array.isArray(_) ? null : _.data !== void 0 && _.data !== null && typeof _.data == "object" && !Array.isArray(_.data) ? _.data : "success" in _ ? null : _;
    }), S = X(() => {
      const _ = y.value;
      return !_ || typeof _.base64 != "string" || typeof _.mime != "string" || !_.mime.startsWith("image/") ? null : { src: `data:${_.mime};base64,${_.base64}`, width: _.width, height: _.height, path: _.path };
    }), E = X(() => {
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
    }), D = (_) => (tt.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[_] || _;
    function U(_) {
      let f = 0, m = 0;
      for (const T of String(_ || "").split(`
`))
        T.startsWith("---") || T.startsWith("+++") || (T.startsWith("+") ? f++ : T.startsWith("-") && m++);
      return { added: f, removed: m };
    }
    const L = X(() => {
      const _ = a.value, f = y.value;
      if (!f) return "";
      if (_ === "write") return typeof f.lines == "number" ? `+${f.lines} ${t("行", "lines")}` : "";
      if (_ === "edit") {
        const { added: m, removed: T } = U(f.diff);
        return m || T ? `+${m} −${T}` : "";
      }
      if (_ === "apply_patch" && Array.isArray(f.files)) {
        let m = 0, T = 0;
        for (const R of f.files) {
          const N = U(R?.diff);
          m += N.added, T += N.removed;
        }
        return m || T ? `+${m} −${T}` : "";
      }
      return "";
    });
    function Q(_, f) {
      const m = [];
      let T = null, R = 0, N = 0;
      const K = (V) => {
        T || (T = { path: f, lines: [] }, m.push(T)), T.lines.push(V);
      };
      for (const V of String(_ || "").split(`
`)) {
        if (V.startsWith("+++ ")) {
          const me = V.slice(4).split("	")[0].trim().replace(/^[ab]\//, "");
          T = { path: me === "/dev/null" ? f : me, lines: [] }, m.push(T);
          continue;
        }
        if (!V.startsWith("--- ")) {
          if (V.startsWith("diff --git")) {
            T || (T = { path: f, lines: [] }, m.push(T));
            continue;
          }
          if (V.startsWith("@@")) {
            const me = /@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(V);
            me && (R = parseInt(me[1], 10), N = parseInt(me[2], 10)), K({ kind: "hunk", oldNo: "", newNo: "", text: V });
            continue;
          }
          if (/^(index |new file|deleted file|old mode|new mode|similarity |rename |copy )/.test(V)) {
            K({ kind: "meta", oldNo: "", newNo: "", text: V });
            continue;
          }
          if (V.startsWith("+")) {
            K({ kind: "add", oldNo: "", newNo: String(N++), text: V.slice(1) });
            continue;
          }
          if (V.startsWith("-")) {
            K({ kind: "del", oldNo: String(R++), newNo: "", text: V.slice(1) });
            continue;
          }
          if (V.startsWith("\\")) {
            K({ kind: "meta", oldNo: "", newNo: "", text: V });
            continue;
          }
          K({ kind: "ctx", oldNo: String(R++), newNo: String(N++), text: V });
        }
      }
      return m;
    }
    const M = X(() => {
      const _ = a.value, f = y.value, m = o.value;
      if (_ === "edit" && f) return Q(String(f.diff || ""), String(m?.filePath || f.path || ""));
      if (_ === "apply_patch") {
        const T = [];
        if (Array.isArray(f?.files)) {
          for (const R of f.files) {
            const N = Q(String(R?.diff || ""), String(R?.path || ""));
            N.length ? T.push(...N) : T.push({ path: String(R?.path || ""), lines: [] });
          }
          return T;
        }
        if (Array.isArray(m?.patches)) {
          const R = m.patches.map((N) => String(N?.patch ?? N?.diff ?? N?.text ?? "")).join(`
`);
          return Q(R, "");
        }
        return T;
      }
      return [];
    });
    function Y(_) {
      const f = _.lines || [], m = f.filter((R) => R.kind === "add").length, T = f.filter((R) => R.kind === "del").length;
      return m || T ? `+${m} −${T}` : "";
    }
    const ee = X(() => {
      const _ = a.value, f = o.value, m = y.value, T = (R, N = 160) => (R || "").length > N ? `${R.slice(0, N)}…` : R || "";
      if (u.value) {
        const R = T(String(m?.query ?? f?.query ?? "")), N = Array.isArray(m?.results) ? m.results.length : 0;
        return R + (N ? ` · ${N} ${t("条结果", "results")}` : "");
      }
      if (_ === "bash") {
        const R = T(String(f?.command ?? "")), N = m && m.exitCode !== void 0 && e.step.state !== "running" ? ` · ${t("退出码", "exit")} ${m.exitCode}` : "";
        return R + N;
      }
      if (_ === "webfetch")
        return T(String(m?.url ?? f?.url ?? "")) + (m?.status !== void 0 && m?.status !== null ? ` · HTTP ${m.status}` : "");
      if (_ === "read" || _ === "write") return T(String(m?.path ?? f?.filePath ?? ""));
      if (_ === "edit") return T(String(f?.filePath ?? m?.path ?? ""));
      if (_ === "apply_patch") {
        const R = Array.isArray(f?.patches) ? f.patches.map((N) => N?.filePath).filter(Boolean) : Array.isArray(m?.files) ? m.files.map((N) => N?.path).filter(Boolean) : [];
        return T(R.join(", "));
      }
      if (_ === "todowrite") {
        const R = Array.isArray(f?.todos) ? f.todos : Array.isArray(m?.todos) ? m.todos : [];
        if (!R.length) return T(String(e.step.args || ""));
        const N = R.length, K = R.filter((me) => me?.status === "completed").length, V = R.filter((me) => me?.status === "in_progress").length;
        return `${N} ${t("项", "items")} · ${t("完成", "done")} ${K}${V ? ` · ${t("进行中", "running")} ${V}` : ""}`;
      }
      if (_ === "computeruse") {
        const R = String(f?.action ?? m?.action ?? ""), N = f && f.x !== void 0 ? ` (${f.x}, ${f.y})` : "", K = m?.width && m?.height ? ` · ${m.width}×${m.height}` : "", V = Array.isArray(m?.windows) ? ` · ${m.windows.length} ${t("个窗口", "windows")}` : "";
        return T(`${R}${N}${K}${V}`);
      }
      if (f && Object.keys(f).length)
        try {
          return T(JSON.stringify(f));
        } catch {
        }
      return T(String(e.step.args || ""));
    }), C = X(() => String(y.value?.query ?? o.value?.query ?? e.step.args ?? "")), z = X(() => Array.isArray(y.value?.results) ? y.value.results : []), B = X(() => typeof k.value == "string" ? k.value : k.value === null && e.step.result ? e.step.result : ""), te = X(() => {
      const _ = a.value, f = y.value;
      if (_ === "computeruse" && S.value) return [];
      if (_ === "bash" && f) {
        const T = [{ label: t("工作目录", "cwd"), text: String(f.cwd || "") }];
        return f.stdout && T.push({ label: "stdout", text: String(f.stdout), mono: !0 }), f.stderr && T.push({ label: "stderr", text: String(f.stderr), mono: !0 }), !f.stdout && !f.stderr && T.push({ label: "", text: t("（无输出）", "(no output)") }), T;
      }
      if (_ === "write" && f) {
        const T = [{ label: t("文件", "File"), text: String(f.path || "") }];
        return T.push({ label: t("内容", "Content"), text: `${typeof f.lines == "number" ? f.lines : "—"} ${t("行", "lines")}${f.created ? ` · ${t("新建文件", "created")}` : ""} · ${f.bytes ?? "—"} B` }), T;
      }
      if (_ === "edit" || _ === "apply_patch") return [];
      if (_ === "read" && f) {
        const T = [{ label: t("文件", "File"), text: String(f.path || "") }];
        return T.push({ label: `${t("第", "line")} ${f.offset ?? "—"} ${t("行起", "onward")}`, text: String(f.content || ""), mono: !0 }), T;
      }
      if (_ === "webfetch" && f)
        return [
          { label: "URL", text: String(f.url || "") },
          { label: t("内容", "Content"), text: String(f.content || ""), mono: !0 }
        ];
      const m = e.step.result;
      if (!m) return [];
      try {
        return [{ label: "JSON", text: JSON.stringify(k.value, null, 2), mono: !0 }];
      } catch {
        return [{ label: "", text: String(m), mono: !0 }];
      }
    });
    function ie() {
      if (u.value) {
        r.value = !r.value;
        return;
      }
      s.value = !s.value;
    }
    function F(_) {
      _.key === "Escape" && r.value && (r.value = !1);
    }
    return hn(() => window.addEventListener("keydown", F)), fn(() => window.removeEventListener("keydown", F)), (_, f) => (v(), b("div", {
      class: de(["tool-card", { expanded: s.value }])
    }, [
      i("button", {
        type: "button",
        class: "tool-card-head",
        onClick: ie
      }, [
        i("span", {
          class: de(["tool-dot", n.step.state])
        }, "●", 2),
        i("strong", va, g(E.value), 1),
        i("span", ka, g(ee.value), 1),
        L.value ? (v(), b("small", ba, g(L.value), 1)) : I("", !0),
        i("small", ya, g(D(n.step.state)), 1),
        f[2] || (f[2] = i("span", {
          class: "tool-chevron",
          "aria-hidden": "true"
        }, "▸", -1))
      ]),
      s.value && !u.value ? (v(), b("div", _a, [
        n.step.state === "running" && !te.value.length && !M.value.length && !S.value ? (v(), b("p", wa, g(t("执行中…", "Running…")), 1)) : I("", !0),
        S.value ? (v(), b("figure", xa, [
          i("img", {
            src: S.value.src,
            alt: t("屏幕截图", "Screenshot")
          }, null, 8, Sa),
          i("figcaption", null, g(S.value.width && S.value.height ? `${S.value.width}×${S.value.height} · ` : "") + g(S.value.path), 1)
        ])) : I("", !0),
        M.value.length ? (v(), b("div", Ta, [
          (v(!0), b(ae, null, be(M.value, (m, T) => (v(), b("div", {
            key: T,
            class: "diff-file"
          }, [
            i("div", Aa, [
              i("span", {
                class: "diff-file-path",
                title: m.path
              }, g(m.path || "—"), 9, Ea),
              Y(m) ? (v(), b("span", Ra, g(Y(m)), 1)) : I("", !0)
            ]),
            i("div", $a, [
              (v(!0), b(ae, null, be(m.lines, (R, N) => (v(), b("div", {
                key: N,
                class: de(["diff-line", R.kind])
              }, [
                i("span", Ca, g(R.oldNo), 1),
                i("span", La, g(R.newNo), 1),
                i("span", Ia, g(R.kind === "add" ? "+" : R.kind === "del" ? "-" : ""), 1),
                i("span", Oa, g(R.text), 1)
              ], 2))), 128))
            ])
          ]))), 128))
        ])) : S.value ? I("", !0) : (v(!0), b(ae, { key: 3 }, be(te.value, (m, T) => (v(), b(ae, { key: T }, [
          m.label ? (v(), b("small", Pa, g(m.label), 1)) : I("", !0),
          m.mono ? (v(), b("pre", Da, g(m.text), 1)) : (v(), b("p", Na, g(m.text), 1))
        ], 64))), 128)),
        !te.value.length && !M.value.length && !S.value && n.step.state !== "running" && !n.step.error ? (v(), b("p", Ma, g(t("执行完成，无输出", "Completed with no output")), 1)) : I("", !0),
        n.step.error ? (v(), b("p", za, g(n.formatError?.(n.step.error) || n.step.error), 1)) : I("", !0)
      ])) : I("", !0),
      r.value ? (v(), b("div", {
        key: 1,
        class: "tool-dialog-backdrop",
        onClick: f[1] || (f[1] = Pe((m) => r.value = !1, ["self"]))
      }, [
        i("section", {
          class: "tool-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t("搜索结果", "Search results")
        }, [
          i("header", null, [
            i("h4", null, g(t("搜索", "Search")) + " · " + g(C.value), 1),
            i("button", {
              type: "button",
              class: "tool-dialog-close",
              "aria-label": t("关闭", "Close"),
              title: t("关闭", "Close"),
              onClick: f[0] || (f[0] = (m) => r.value = !1)
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
          n.step.state === "running" ? (v(), b("p", Ba, g(t("搜索中…", "Searching…")), 1)) : z.value.length ? (v(), b("ol", Ha, [
            (v(!0), b(ae, null, be(z.value, (m, T) => (v(), b("li", { key: T }, [
              i("a", {
                href: m.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }, g(m.title || m.url), 9, ja),
              m.snippet ? (v(), b("p", Wa, g(m.snippet), 1)) : I("", !0),
              m.title && m.url ? (v(), b("small", Va, g(m.url), 1)) : I("", !0)
            ]))), 128))
          ])) : (v(), b("p", qa, g(B.value || t("没有找到相关结果。", "No relevant results found.")), 1)),
          n.step.error ? (v(), b("p", Ga, g(n.formatError?.(n.step.error) || n.step.error), 1)) : I("", !0)
        ], 8, Fa)
      ])) : I("", !0)
    ], 2));
  }
}), Ys = /* @__PURE__ */ ps(Ya, [["__scopeId", "data-v-f13fbd25"]]);
function dr(n = "") {
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
}, Ln = /* @__PURE__ */ qt({
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
    const t = n, s = e, r = O(null), a = O(null), u = O(null), o = O(!1), k = O(-1), y = O({}), S = O(!1), E = O(""), D = dr("select"), U = X(() => t.options.map((f) => typeof f == "string" ? { value: f, label: f } : f)), L = X(() => {
      if (!t.searchable || !E.value.trim()) return U.value;
      const f = E.value.trim().toLocaleLowerCase();
      return U.value.filter((m) => m.label.toLocaleLowerCase().includes(f) || m.value.toLocaleLowerCase().includes(f));
    }), Q = X(() => U.value.find((f) => f.value === t.modelValue)?.label || t.modelValue || t.placeholder);
    let M = "", Y = 0;
    function ee() {
      const f = r.value?.getBoundingClientRect();
      if (!f) return;
      const m = window.visualViewport?.height || innerHeight, T = window.visualViewport?.width || innerWidth, R = m - f.bottom - 10, N = f.top - 10;
      S.value = R < Math.min(280, L.value.length * 46 + 58) && N > R;
      const K = Math.max(48, Math.min(340, S.value ? N : R)), V = Math.min(Math.max(f.width, 220), T - 16);
      y.value = { position: "fixed", left: `${Math.max(8, Math.min(f.left, T - V - 8))}px`, width: `${V}px`, maxHeight: `${K}px`, ...S.value ? { bottom: `${m - f.top + 8}px` } : { top: `${f.bottom + 8}px` } };
    }
    function C(f = !1) {
      o.value = !1, E.value = "", M = "", f && r.value?.focus();
    }
    async function z() {
      t.disabled || o.value || (o.value = !0, E.value = "", k.value = L.value.findIndex((f) => f.value === t.modelValue && !f.disabled), k.value < 0 && (k.value = L.value.findIndex((f) => !f.disabled)), ee(), s("open"), await Ke(), t.searchable && u.value?.focus(), B());
    }
    function B() {
      a.value?.querySelector(`[data-index="${k.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function te(f) {
      const m = L.value[f];
      !m || m.disabled || (s("update:modelValue", m.value), s("change", m.value), C(!0));
    }
    async function ie(f) {
      if (!(t.disabled || f.isComposing)) {
        if (f.key === "Tab") {
          C();
          return;
        }
        if (f.key === "Escape") {
          o.value && (f.preventDefault(), C(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(f.key)) {
          if (t.searchable && f.key === " ") return;
          if (f.preventDefault(), !o.value) {
            await z();
            return;
          }
          if (f.key === "Enter") {
            te(k.value);
            return;
          }
          const m = L.value.map((R, N) => R.disabled ? -1 : N).filter((R) => R >= 0);
          if (!m.length) return;
          const T = m.indexOf(k.value);
          k.value = f.key === "Home" ? m[0] : f.key === "End" ? m[m.length - 1] : m[(T + (f.key === "ArrowDown" ? 1 : -1) + m.length) % m.length], await Ke(), B();
          return;
        }
        if (!t.searchable && f.key.length === 1 && !f.ctrlKey && !f.metaKey && !f.altKey) {
          await z();
          const m = Date.now();
          M = m - Y > 700 ? f.key : M + f.key, Y = m;
          const T = L.value.findIndex((R) => !R.disabled && R.label.toLocaleLowerCase().startsWith(M.toLocaleLowerCase()));
          T >= 0 && (k.value = T, await Ke(), B());
        }
      }
    }
    function F(f) {
      const m = f.target;
      !r.value?.contains(m) && !a.value?.contains(m) && C();
    }
    function _(f) {
      o.value && (!(f.target instanceof Node) || !a.value?.contains(f.target)) && ee();
    }
    return Se(() => t.disabled, (f) => {
      f && C();
    }), Se(L, () => {
      o.value && (k.value >= L.value.length && (k.value = L.value.findIndex((f) => !f.disabled)), Ke(ee));
    }), Se(E, () => {
      o.value && (k.value = L.value.findIndex((f) => !f.disabled), Ke(B));
    }), hn(() => {
      document.addEventListener("pointerdown", F, !0), window.addEventListener("resize", ee), window.addEventListener("scroll", _, !0);
    }), fn(() => {
      document.removeEventListener("pointerdown", F, !0), window.removeEventListener("resize", ee), window.removeEventListener("scroll", _, !0);
    }), (f, m) => (v(), b("div", Ar(f.$attrs, {
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
        "aria-controls": o.value ? oe(D) : void 0,
        "aria-activedescendant": o.value && k.value >= 0 ? `${oe(D)}-${k.value}` : void 0,
        "aria-label": n.ariaLabel,
        disabled: n.disabled,
        onClick: m[0] || (m[0] = (T) => o.value ? C() : z()),
        onKeydown: ie,
        onFocus: m[1] || (m[1] = (T) => s("focus", T))
      }, [
        i("span", Ka, g(Q.value), 1),
        i("span", Xa, [
          (v(), b("svg", {
            class: de({ "is-open": o.value }),
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none"
          }, [...m[4] || (m[4] = [
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
      (v(), wt(zn, { to: "body" }, [
        ze(Zs, { name: "select-menu" }, {
          default: Ks(() => [
            o.value ? (v(), b("div", {
              key: 0,
              id: oe(D),
              ref_key: "menu",
              ref: a,
              class: de(["app-select-menu", { "opens-up": S.value }]),
              style: Wt(y.value),
              role: "listbox",
              "aria-label": n.ariaLabel || "选项",
              onPointerdown: m[3] || (m[3] = Pe(() => {
              }, ["prevent"]))
            }, [
              n.searchable ? (v(), b("label", Ja, [
                m[5] || (m[5] = i("svg", {
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
                cn(i("input", {
                  ref_key: "searchInput",
                  ref: u,
                  "onUpdate:modelValue": m[2] || (m[2] = (T) => E.value = T),
                  type: "text",
                  placeholder: oe(tt) === "en" ? "Search…" : "搜索…",
                  onKeydown: ie
                }, null, 40, eo), [
                  [On, E.value]
                ])
              ])) : I("", !0),
              (v(!0), b(ae, null, be(L.value, (T, R) => (v(), b("div", {
                id: `${oe(D)}-${R}`,
                key: `${T.value}:${R}`,
                role: "option",
                "aria-selected": T.value === n.modelValue,
                "aria-disabled": !!T.disabled,
                "data-index": R,
                class: de(["app-select-option", { highlighted: k.value === R, selected: T.value === n.modelValue, disabled: T.disabled }]),
                onPointermove: (N) => !T.disabled && (k.value = R),
                onClick: Pe((N) => te(R), ["stop"])
              }, [
                i("span", null, g(T.label), 1),
                T.value === n.modelValue ? (v(), b("span", no, [...m[6] || (m[6] = [
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
                ])])) : I("", !0)
              ], 42, to))), 128)),
              L.value.length ? I("", !0) : (v(), b("div", so, g(oe(tt) === "en" ? "No matches" : "没有匹配项"), 1))
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
}, co = { class: "thinking-stops" }, po = ["aria-pressed", "onClick"], ho = { class: "thinking-provider-note" }, fo = /* @__PURE__ */ qt({
  __name: "ThinkingSlider",
  props: {
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = X(() => tt.value === "en"), s = n, r = e, a = X(() => [{ value: 0, label: t.value ? "Off" : "关闭思考" }, { value: 20, label: t.value ? "Low" : "低" }, { value: 50, label: t.value ? "Medium" : "中" }, { value: 75, label: t.value ? "High" : "高" }, { value: 100, label: t.value ? "Max" : "最高" }]), u = X(() => s.modelValue === 0 ? 0 : s.modelValue < 35 ? 1 : s.modelValue < 62.5 ? 2 : s.modelValue < 87.5 ? 3 : 4), o = O(!1), k = O({}), y = O(null), S = O(null), E = O(null), D = O(u.value * 25), U = O(!1), L = X(() => u.value === 4), Q = dr("thinking");
    let M;
    Se(() => s.modelValue, () => {
      o.value || (D.value = u.value * 25);
    }), Se(L, (F, _) => {
      F && !_ && (U.value = !0, clearTimeout(M), M = setTimeout(() => U.value = !1, 900));
    }), Se(() => s.disabled, (F) => {
      F && (o.value = !1);
    });
    function Y() {
      const F = y.value?.getBoundingClientRect();
      if (!F) return;
      const _ = Math.min(352, innerWidth - 16), f = 236, m = F.top >= f + 8 || innerHeight - F.bottom < f;
      k.value = { left: `${Math.max(8, Math.min(F.left, innerWidth - _ - 8))}px`, width: `${_}px`, ...m ? { bottom: `${innerHeight - F.top + 8}px` } : { top: `${F.bottom + 8}px` } };
    }
    async function ee() {
      s.disabled || (o.value = !o.value, o.value && (D.value = u.value * 25, Y(), await Ke(), E.value?.focus()));
    }
    function C() {
      o.value = !1, y.value?.focus();
    }
    function z(F) {
      D.value = Number(F.target.value), r("update:modelValue", a.value[Math.round(D.value / 25)].value);
    }
    function B(F) {
      D.value = F * 25, r("update:modelValue", a.value[F].value);
    }
    function te(F) {
      const _ = F.target;
      !y.value?.contains(_) && !S.value?.contains(_) && (o.value = !1);
    }
    function ie(F) {
      o.value && (!(F.target instanceof Node) || !S.value?.contains(F.target)) && Y();
    }
    return hn(() => {
      document.addEventListener("pointerdown", te, !0), window.addEventListener("resize", Y), window.addEventListener("scroll", ie, !0);
    }), fn(() => {
      clearTimeout(M), document.removeEventListener("pointerdown", te, !0), window.removeEventListener("resize", Y), window.removeEventListener("scroll", ie, !0);
    }), (F, _) => (v(), b("div", {
      class: de(["thinking-control", { full: L.value, pulse: U.value }])
    }, [
      i("span", ro, g(t.value ? "Thinking effort" : "思考强度"), 1),
      i("button", {
        ref_key: "trigger",
        ref: y,
        type: "button",
        class: "thinking-trigger",
        disabled: n.disabled,
        "aria-label": "思考强度",
        "aria-haspopup": "dialog",
        "aria-expanded": o.value,
        "aria-controls": o.value ? oe(Q) : void 0,
        onClick: ee,
        onKeydown: Ut(C, ["esc"])
      }, [
        i("span", null, g(L.value ? "✦ " : "") + g(a.value[u.value].label), 1),
        _[5] || (_[5] = i("span", { "aria-hidden": "true" }, "⌄", -1))
      ], 40, lo),
      (v(), wt(zn, { to: "body" }, [
        ze(Zs, { name: "thinking-menu" }, {
          default: Ks(() => [
            o.value ? (v(), b("section", {
              key: 0,
              id: oe(Q),
              ref_key: "panel",
              ref: S,
              class: de(["thinking-popover", { full: L.value, pulse: U.value }]),
              style: Wt(k.value),
              role: "dialog",
              "aria-label": "调整思考强度",
              onKeydown: Ut(Pe(C, ["prevent", "stop"]), ["esc"])
            }, [
              i("header", null, [
                i("strong", null, g(t.value ? "Thinking effort" : "思考强度"), 1),
                i("output", null, g(L.value ? "✦ " : "") + g(a.value[u.value].label), 1)
              ]),
              i("div", {
                class: "thinking-track",
                style: Wt({ "--intensity": `${D.value}%` })
              }, [
                i("div", oo, [
                  _[6] || (_[6] = i("div", { class: "thinking-fill" }, null, -1)),
                  (v(!0), b(ae, null, be(a.value, (f, m) => (v(), b("span", {
                    key: m,
                    class: de(["thinking-tick", { passed: D.value >= m * 25 }]),
                    style: Wt({ left: `${m * 25}%` })
                  }, null, 6))), 128))
                ]),
                i("input", {
                  ref_key: "range",
                  ref: E,
                  type: "range",
                  min: "0",
                  max: "100",
                  step: "0.1",
                  value: D.value,
                  "aria-label": "思考强度滑块",
                  "aria-valuetext": a.value[u.value].label,
                  onInput: z,
                  onChange: _[0] || (_[0] = (f) => D.value = u.value * 25),
                  onKeydown: [
                    _[1] || (_[1] = Ut(Pe((f) => B(0), ["prevent"]), ["home"])),
                    _[2] || (_[2] = Ut(Pe((f) => B(4), ["prevent"]), ["end"])),
                    _[3] || (_[3] = Ut(Pe((f) => B(Math.min(4, u.value + 1)), ["prevent"]), ["arrow-right"])),
                    _[4] || (_[4] = Ut(Pe((f) => B(Math.max(0, u.value - 1)), ["prevent"]), ["arrow-left"]))
                  ]
                }, null, 40, io),
                L.value ? (v(), b("span", uo)) : I("", !0)
              ], 4),
              i("div", co, [
                (v(!0), b(ae, null, be(a.value, (f, m) => (v(), b("button", {
                  key: f.value,
                  type: "button",
                  class: de({ selected: u.value === m }),
                  "aria-pressed": u.value === m,
                  onClick: (T) => B(m)
                }, g(f.label), 11, po))), 128))
              ]),
              i("p", null, g(t.value ? u.value === 0 ? "Disable model reasoning" : L.value ? "Maximum effort" : "Drag to adjust; release to snap to a level" : u.value === 0 ? "不启用模型思考模式" : L.value ? "全力思考 · 已达到最高档" : "拖动滑块调整，松开后定位到对应档位"), 1),
              i("p", ho, g(t.value ? "Actual reasoning controls depend on the selected provider. Max may map to High." : "实际推理参数取决于供应商；最高档可能映射为高档。"), 1)
            ], 46, ao)) : I("", !0)
          ]),
          _: 1
        })
      ]))
    ], 2));
  }
}), Ht = O(null);
function pr() {
  function n(t) {
    const s = typeof t == "string" ? { message: t } : t;
    return Ht.value && Ht.value.resolve(!1), new Promise((r) => {
      Ht.value = { options: s, resolve: r };
    });
  }
  function e(t) {
    const s = Ht.value;
    Ht.value = null, s?.resolve(t);
  }
  return { confirmState: Ht, confirm: n, settle: e };
}
const go = /* @__PURE__ */ qt({
  __name: "ConfirmDialog",
  setup(n) {
    const { confirmState: e, settle: t } = pr(), s = O(null), r = O(null);
    let a = null;
    const u = () => (document.documentElement.lang || "").startsWith("en"), o = () => e.value?.options.title || (u() ? "Confirm" : "请确认"), k = () => e.value?.options.confirmLabel || (u() ? "Confirm" : "确认"), y = () => e.value?.options.cancelLabel || (u() ? "Cancel" : "取消");
    Se(() => !!e.value, async (E) => {
      E ? (a = document.activeElement, await Ke(), s.value?.focus(), r.value?.focus()) : (s.value = null, a?.focus?.());
    });
    function S(E) {
      if (!e.value) return;
      if (E.key === "Escape") {
        E.preventDefault(), t(!1);
        return;
      }
      if (E.key !== "Tab" || !s.value) return;
      const D = [...s.value.querySelectorAll("button:not(:disabled)")];
      if (!D.length) return;
      const U = D[0], L = D[D.length - 1];
      E.shiftKey && document.activeElement === U ? (E.preventDefault(), L.focus()) : !E.shiftKey && document.activeElement === L && (E.preventDefault(), U.focus());
    }
    return (E, D) => (v(), wt(zn, { to: "body" }, [
      oe(e) ? (v(), b("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: D[2] || (D[2] = Pe((U) => oe(t)(!1), ["self"])),
        onKeydown: S
      }, [
        i("section", {
          ref_key: "dialog",
          ref: s,
          class: "confirm-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          i("h2", null, g(o()), 1),
          i("p", null, g(oe(e).options.message), 1),
          i("footer", null, [
            i("button", {
              ref_key: "cancelBtn",
              ref: r,
              type: "button",
              onClick: D[0] || (D[0] = (U) => oe(t)(!1))
            }, g(y()), 513),
            i("button", {
              type: "button",
              class: de(["confirm-primary", { danger: oe(e).options.danger !== !1 }]),
              onClick: D[1] || (D[1] = (U) => oe(t)(!0))
            }, g(k()), 3)
          ])
        ], 512)
      ], 32)) : I("", !0)
    ]));
  }
}), mo = { class: "workspace" }, vo = { class: "sessions" }, ko = ["disabled", "title"], bo = { class: "connection" }, yo = ["title"], _o = ["placeholder", "aria-label"], wo = { class: "filter-bar" }, xo = ["onClick"], So = { class: "muted" }, To = { class: "session-list" }, Ao = ["disabled", "onClick"], Eo = { class: "origin" }, Ro = {
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
}, Do = {
  key: 1,
  class: "session-actions"
}, No = ["disabled"], Mo = ["disabled"], zo = {
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
}, Ei = { key: 3 }, Ri = {
  key: 2,
  class: "error"
}, $i = {
  key: 3,
  class: "muted"
}, Ci = {
  key: 0,
  class: "compact-notice"
}, Li = { class: "execution-options" }, Ii = ["disabled", "title"], Oi = ["aria-label"], Pi = ["aria-selected", "onMousedown", "onMouseenter"], Di = { class: "slash-name" }, Ni = { class: "slash-desc" }, Mi = {
  key: 0,
  class: "attach-chips"
}, zi = ["title"], Fi = ["aria-label", "title", "onClick"], Ui = {
  key: 0,
  class: "attach-error"
}, Bi = ["disabled", "placeholder"], Hi = { class: "composer-actions" }, ji = ["disabled", "aria-label", "title"], Wi = ["disabled", "aria-label", "title"], Vi = ["aria-label", "title"], qi = ["disabled"], Gi = { class: "muted" }, Yi = {
  class: "directory-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "选择工作区目录"
}, Zi = { class: "directory-roots" }, Ki = ["disabled", "onClick"], Xi = ["disabled"], Qi = ["disabled"], Ji = ["disabled"], eu = {
  key: 0,
  class: "error"
}, tu = { key: 1 }, nu = {
  key: 2,
  class: "directory-list"
}, su = ["onClick"], ru = {
  key: 1,
  class: "muted"
}, lu = ["disabled"], au = /* @__PURE__ */ qt({
  __name: "AgentsPage",
  setup(n) {
    const e = (c, p) => tt.value === "en" ? p : c, { confirm: t } = pr(), s = Cr(), r = O(localStorage.getItem("0kay.agent.selected") || ""), a = O(""), u = O([]), o = O(!1), k = O(""), y = O(null);
    function S() {
      y.value?.click();
    }
    function E(c) {
      u.value.splice(c, 1);
    }
    async function D(c) {
      if (c.length) {
        o.value = !0, k.value = "";
        try {
          for (const p of c) {
            const d = new FormData();
            d.append("file", p);
            const $ = await fetch("/api/files", { method: "POST", body: d });
            if (!$.ok) throw new Error(await $.text());
            const we = await $.json();
            u.value.push({ name: we.name || p.name, url: we.url, mime: we.mime || p.type || "application/octet-stream", size: we.size ?? p.size });
          }
        } catch (p) {
          k.value = p.message;
        } finally {
          o.value = !1;
        }
      }
    }
    async function U(c) {
      const p = c.target, d = Array.from(p.files || []);
      p.value = "", await D(d);
    }
    function L(c) {
      const p = Array.from(c.clipboardData?.files || []);
      p.length && (c.preventDefault(), D(p));
    }
    const Q = O(""), M = O("all"), Y = O("general"), ee = O(""), C = O(""), z = O(50);
    function B(c) {
      const p = { off: 0, low: 20, medium: 50, high: 75, max: 100 };
      if (typeof c == "string" && c in p) return p[c];
      const d = Number(c ?? 50);
      return Number.isFinite(d) ? Math.max(0, Math.min(100, d)) : 50;
    }
    const te = O("MOCR"), ie = O("normal"), F = O("");
    async function _() {
      if (!(!F.value.trim() || !j.value || R.value)) {
        R.value = !0, N.value = "";
        try {
          const c = await fetch(`/api/agent/workspace?executor_id=${encodeURIComponent(j.value.plugin_id)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: K.value.path, name: F.value.trim() }) });
          if (!c.ok) throw new Error(await c.text());
          const p = await c.json();
          F.value = "", await Qe(p.path);
        } catch (c) {
          N.value = c.message;
        } finally {
          R.value = !1;
        }
      }
    }
    const f = O([]), m = O(!1), T = O(!1), R = O(!1), N = O(""), K = O({ path: "", parent: "", roots: [], directories: [] }), V = O(null), me = O("");
    let st = null, Xe = 0, Yt = "", Zt = !1;
    const Tt = O(!0);
    function rt(c = r.value) {
      try {
        localStorage.setItem(`0kay.agent.editor:${c}`, JSON.stringify({ draft: a.value, mode: Y.value, ...Je() }));
      } catch {
      }
    }
    function J() {
      Xe++, T.value = !1, R.value = !1;
    }
    function kn(c) {
      c.key === "Escape" && T.value && J();
    }
    const bn = O([]);
    let At = !1;
    async function Fn() {
      if (!At) {
        At = !0;
        try {
          const p = await (await fetch("/api/skills")).json(), d = p?.result?.skills ?? p?.skills;
          Array.isArray(d) ? bn.value = d : At = !1;
        } catch {
          At = !1;
        }
      }
    }
    const Un = [{ name: "compact", description: e("压缩当前会话上下文", "Compact the session context") }], yn = X(() => {
      const c = /^\/([^\s]*)$/.exec(a.value);
      return c ? c[1].toLowerCase() : null;
    }), lt = X(() => {
      const c = yn.value;
      if (c === null) return [];
      const p = [
        ...Un,
        ...bn.value.map(($) => ({ name: $.name, description: $.description || "" }))
      ], d = /* @__PURE__ */ new Set();
      return p.filter(($) => d.has($.name) || !$.name.toLowerCase().startsWith(c) ? !1 : (d.add($.name), !0)).slice(0, 8);
    }), Et = O(!1), mt = X(() => !Et.value && lt.value.length > 0), q = O(0);
    Se(lt, () => {
      q.value = 0;
    }), Se(yn, (c) => {
      Et.value = !1, c !== null && Fn();
    });
    const Rt = O(null), le = O({});
    function $t() {
      const c = Rt.value?.getBoundingClientRect();
      c && (le.value = {
        left: `${c.left}px`,
        width: `${c.width}px`,
        bottom: `${Math.max(8, window.innerHeight - c.top + 8)}px`
      });
    }
    const Te = () => {
      mt.value && $t();
    };
    Se(mt, (c) => {
      c && Ke($t);
    }), hn(() => {
      window.addEventListener("resize", Te), window.addEventListener("scroll", Te, !0);
    }), fn(() => {
      window.removeEventListener("resize", Te), window.removeEventListener("scroll", Te, !0);
    });
    function at(c) {
      a.value = "/" + c.name + " ", Et.value = !0, Ke(() => document.querySelector(".composer-input textarea")?.focus());
    }
    function _n(c) {
      if (mt.value) {
        const p = lt.value.length;
        if (c.key === "ArrowDown") {
          c.preventDefault(), q.value = (Math.min(q.value, p - 1) + 1) % p;
          return;
        }
        if (c.key === "ArrowUp") {
          c.preventDefault(), q.value = (Math.min(q.value, p - 1) - 1 + p) % p;
          return;
        }
        if (c.key === "Enter" || c.key === "Tab") {
          c.preventDefault(), at(lt.value[Math.min(q.value, p - 1)]);
          return;
        }
        if (c.key === "Escape") {
          c.preventDefault(), Et.value = !0;
          return;
        }
      }
      c.key === "Enter" && !c.shiftKey && !c.isComposing && c.keyCode !== 229 && (c.preventDefault(), ce());
    }
    function We() {
      const c = it.value;
      c && (Tt.value = c.scrollHeight - c.scrollTop - c.clientHeight < 100);
    }
    async function Qe(c = "") {
      if (!j.value) {
        ke.value = "请先选择在线执行器";
        return;
      }
      const p = ++Xe;
      Yt = j.value.plugin_id, T.value = !0, R.value = !0, N.value = "";
      try {
        const d = await fetch(`/api/agent/workspace?${new URLSearchParams({ executor_id: j.value.plugin_id, path: c })}`);
        if (!d.ok) throw new Error(await d.text());
        const $ = await d.json();
        p === Xe && (K.value = $);
      } catch (d) {
        p === Xe && (N.value = d.message);
      } finally {
        p === Xe && (R.value = !1);
      }
    }
    function Kt() {
      !j.value || j.value.plugin_id !== Yt || R.value || N.value || (ee.value = j.value.plugin_id, C.value = K.value.path, T.value = !1);
    }
    async function Ct() {
      if (!m.value || !j.value || Zt || document.hidden) return;
      Zt = !0;
      const c = j.value.plugin_id;
      try {
        const p = await fetch(`/api/agent/host?executor_id=${encodeURIComponent(c)}`);
        if (!p.ok) throw new Error();
        const d = await p.json();
        j.value?.plugin_id === c && (V.value = d);
      } catch {
        j.value?.plugin_id === c && (V.value = null);
      } finally {
        Zt = !1;
      }
    }
    async function Xt() {
      if (!ue.value || he.value || ne.value || ue.value.state === "archived") return;
      const c = r.value;
      ne.value = !0, ke.value = "", me.value = "正在压缩上下文…";
      try {
        const p = await fetch("/api/agent/compact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: c }) });
        if (!p.ok) throw new Error(await p.text());
        await p.json(), await s.fetchAgents(), me.value = "上下文已压缩。后续消息使用摘要；原始对话和工具记录仍然保留。", a.value.trim() === "/compact" && (a.value = "");
      } catch (p) {
        ke.value = p.message, me.value = "";
      } finally {
        ne.value = !1;
      }
    }
    const Ve = (c) => ({ background: `conic-gradient(var(--md-primary) ${Math.max(0, Math.min(100, c))}%, var(--md-outline-variant) 0)` }), j = X(() => ee.value ? s.agents.find((c) => c.plugin_id === ee.value) : s.agents.find((c) => s.isHealthy(c))), qe = (c) => c === void 0 ? "—" : `${(c / 1024 ** 3).toFixed(1)} GiB`;
    function Lt() {
      try {
        const c = JSON.parse(localStorage.getItem(`0kay.agent.editor:${r.value}`) || localStorage.getItem(`0kay.agent.options:${r.value}`) || "{}");
        ee.value = c.executor_id || "", C.value = c.workdir || "", z.value = B(c.thinking_intensity), te.value = c.model_id || "MOCR", ie.value = c.permission_mode === "full_access" ? "full_access" : "normal", a.value = c.draft || "", Y.value = c.mode || "general";
      } catch {
        ee.value = "", C.value = "", z.value = 50, te.value = "MOCR", a.value = "", Y.value = "general";
      }
    }
    const vt = O({});
    function It(c) {
      return `${c.provider_name || (c.provider_id ? vt.value[c.provider_id] : "") || c.provider_id || c.provider}/${c.id}`;
    }
    async function Ot() {
      try {
        const c = await fetch("/api/models");
        if (!c.ok) throw new Error(`模型目录 HTTP ${c.status}`);
        f.value = (await c.json()).models || [];
      } catch (c) {
        ke.value = c.message;
      }
      try {
        const c = await fetch("/api/providers");
        if (c.ok) {
          const p = (await c.json()).providers || [], d = {};
          for (const $ of p) $.name && $.id && (d[$.id] = $.name);
          vt.value = d;
        }
      } catch {
      }
    }
    function Je() {
      const c = z.value === 0 ? "off" : z.value < 35 ? "low" : z.value < 62.5 ? "medium" : z.value < 87.5 ? "high" : "max";
      return { executor_id: ee.value, workdir: C.value.trim(), thinking_intensity: c, model_id: te.value, permission_mode: ie.value, language: tt.value };
    }
    const ne = O(!1), ke = O(""), Ge = O(!1), ot = O(!1), Fe = O([]), fe = X(() => Fe.value[Fe.value.length - 1] || null), it = O(null), ue = X(() => s.sessions.find((c) => c.session_id === r.value)), De = (c) => c.caller_id !== "webui", Qt = X(() => s.sessions.filter((c) => (ot.value ? c.state === "archived" : c.state !== "archived") && (M.value === "all" || (M.value === "life" ? De(c) : !De(c))) && (c.prompt || "").toLowerCase().includes(Q.value.toLowerCase()))), Jt = X(() => s.tasks.filter((c) => c.kind === "agent" && c.session_id === r.value).sort((c, p) => (c.started_at || "").localeCompare(p.started_at || "") || c.task_id.localeCompare(p.task_id))), he = X(() => s.tasks.find((c) => c.session_id === r.value && ["agent", "compact"].includes(c.kind || "") && ["running", "pending"].includes(c.state))), kt = X(() => {
      const c = s.tasks.filter((p) => p.kind === "compact" && p.session_id === r.value && p.state === "done" && (p.result || "").trim());
      return c.length ? c.reduce((p, d) => (d.started_at || "") >= (p.started_at || "") ? d : p) : null;
    }), Ye = (c) => (tt.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[c] || c, Ue = (c) => c ? new Date(c).toLocaleString() : "";
    function ut(c) {
      return s.tasks.filter((p) => p.task_id !== c.task_id && p.session_id === c.session_id && p.parent_id === c.task_id).sort((p, d) => (p.started_at || "").localeCompare(d.started_at || "") || p.task_id.localeCompare(d.task_id));
    }
    function Ae(c) {
      return c ? s.tasks.filter((p) => p.task_id !== c.task_id && p.session_id === c.session_id && p.parent_id === c.task_id).sort((p, d) => (p.started_at || "").localeCompare(d.started_at || "") || p.task_id.localeCompare(d.task_id)) : [];
    }
    function et(c) {
      const p = [];
      for (const d of ut(c))
        p.push(d), d.kind === "subagent" && p.push(...et({ ...d, session_id: c.session_id }));
      return p;
    }
    function Pt(c) {
      Fe.value = [...Fe.value, c];
    }
    function en() {
      Fe.value = Fe.value.slice(0, -1);
    }
    function Bn() {
      Fe.value = [];
    }
    function Dt(c) {
      if (!c?.result) return "";
      let p = c.result;
      try {
        const d = JSON.parse(p);
        typeof d == "string" ? p = d : d && typeof d.result == "string" && (p = d.result);
      } catch {
      }
      return !p.trim() || Ae(c).some((d) => d.kind === "think" && (d.result || "").trim() === p.trim()) ? "" : p;
    }
    function Be(c) {
      return c ? /User denied permission for task/i.test(c) ? e("你拒绝了这次子 Agent 调用", "You denied this sub-agent call") : /User denied permission for (\S+)/i.test(c) ? e(`你拒绝了 ${RegExp.$1} 权限`, `You denied permission for ${RegExp.$1}`) : /Permission request expired/i.test(c) ? e("权限请求已超时", "Permission request expired") : c : "";
    }
    function tn(c) {
      return c.kind === "subagent" ? e("子 Agent", "Subagent") : c.kind === "tool" ? e("工具", "Tool") : c.kind === "think" ? e("模型", "Model") : c.kind || e("步骤", "Step");
    }
    function Nt(c) {
      return Ae(c).length;
    }
    function Hn(c) {
      return et(c).some((p) => p.kind === "think" && p.result?.trim() === c.result?.trim());
    }
    async function ct(c) {
      if (!ue.value || ne.value || c === "delete" && !await t({
        title: e("删除会话", "Delete session"),
        message: e("永久删除此会话及其中的消息和工具记录？", "Permanently delete this session and its messages and tool records?"),
        confirmLabel: e("永久删除", "Delete"),
        danger: !0
      }))
        return;
      const p = r.value;
      ne.value = !0;
      try {
        rt(p), await s.manageSession(p, c), c === "delete" && (localStorage.removeItem(`0kay.agent.editor:${p}`), localStorage.removeItem(`0kay.agent.options:${p}`)), c !== "restore" ? (r.value = "", localStorage.removeItem("0kay.agent.selected")) : ot.value = !1;
      } catch (d) {
        ke.value = d.message;
      } finally {
        ne.value = !1;
      }
    }
    function wn(c) {
      ne.value || (rt(), r.value = c, Ge.value = !1, localStorage.setItem("0kay.agent.selected", c));
    }
    async function jn() {
      ne.value = !0, ke.value = "";
      try {
        const c = await s.createSession("新对话");
        rt(), r.value = c, localStorage.setItem("0kay.agent.selected", c), Ge.value = !1, ot.value = !1;
      } catch (c) {
        ke.value = c.message;
      } finally {
        ne.value = !1;
      }
    }
    async function ce() {
      if (a.value.trim() === "/compact") {
        await Xt();
        return;
      }
      const c = u.value.length > 0;
      if (!(!a.value.trim() && !c || ne.value || he.value || ue.value?.state === "archived")) {
        ne.value = !0, ke.value = "";
        try {
          const p = Je(), d = a.value.trim() || e("请查看我上传的附件。", "Please review the attached files."), $ = Y.value;
          if (!ue.value) {
            const we = await s.createSession(d.slice(0, 60));
            localStorage.setItem(`0kay.agent.editor:${we}`, JSON.stringify({ ...p, draft: d, mode: $ })), r.value = we, localStorage.setItem("0kay.agent.selected", we);
          }
          rt(), c && (p.attachments = u.value.map((we) => ({ ...we }))), await s.sendTask(r.value, d, $, p), a.value = "", u.value = [], k.value = "", rt(), Tt.value = !0, await nn();
        } catch (p) {
          ke.value = p.message;
        } finally {
          ne.value = !1;
        }
      }
    }
    async function dt() {
      if (!(!he.value || he.value.kind !== "agent"))
        try {
          await s.cancelTask(he.value.task_id);
        } catch (c) {
          ke.value = c.message;
        }
    }
    async function nn() {
      await Ke(), Tt.value && it.value?.scrollTo({ top: it.value.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return Se(() => s.tasks.filter((c) => c.session_id === r.value).map((c) => `${c.task_id}:${c.state}:${c.result?.length}`).join("|"), nn), Se(r, () => {
      Tt.value = !0, nn(), J(), Bn(), ke.value = "";
    }), Se(r, Lt), Se(ee, () => {
      V.value = null, C.value = "", J(), Ct();
    }, { flush: "sync" }), Se(m, Ct), Se(r, () => {
      me.value = "";
    }), hn(() => {
      ma(), s.connect(), Lt(), Ot(), st = setInterval(Ct, 5e3), window.addEventListener("keydown", kn);
    }), fn(() => {
      rt(), J(), s.disconnect(), st && clearInterval(st), window.removeEventListener("keydown", kn);
    }), (c, p) => (v(), b(ae, null, [
      i("main", mo, [
        i("aside", vo, [
          i("header", null, [
            p[19] || (p[19] = i("h1", null, "Agent", -1)),
            i("button", {
              onClick: jn,
              disabled: ne.value,
              title: e("新建会话", "New session")
            }, [
              p[18] || (p[18] = i("svg", {
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
              Re(" " + g(e("新对话", "New chat")), 1)
            ], 8, ko)
          ]),
          i("div", bo, [
            i("i", {
              class: de({ online: oe(s).onlineCount > 0 })
            }, null, 2),
            Re(g(oe(s).onlineCount) + " " + g(e("个执行器在线", "executors online")) + " ", 1),
            i("button", {
              onClick: p[0] || (p[0] = (d) => oe(s).fetchAgents()),
              title: e("刷新", "Refresh"),
              "aria-label": "refresh"
            }, [...p[20] || (p[20] = [
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
          cn(i("input", {
            "onUpdate:modelValue": p[1] || (p[1] = (d) => Q.value = d),
            placeholder: e("搜索会话…", "Search sessions…"),
            "aria-label": e("搜索会话", "Search sessions")
          }, null, 8, _o), [
            [On, Q.value]
          ]),
          i("nav", wo, [
            (v(!0), b(ae, null, be([{ id: "all", label: e("全部", "All") }, { id: "life", label: e("LIFE 发起", "From LIFE") }, { id: "user", label: e("我的对话", "My chats") }], (d) => (v(), b("button", {
              key: d.id,
              class: de({ chosen: M.value === d.id }),
              onClick: ($) => M.value = d.id
            }, g(d.label), 11, xo))), 128))
          ]),
          i("label", So, [
            cn(i("input", {
              "onUpdate:modelValue": p[2] || (p[2] = (d) => ot.value = d),
              type: "checkbox"
            }, null, 512), [
              [Er, ot.value]
            ]),
            Re(" " + g(e("显示已归档会话", "Show archived sessions")), 1)
          ]),
          i("div", To, [
            (v(!0), b(ae, null, be(Qt.value, (d) => (v(), b("button", {
              key: d.task_id,
              class: de(["session-card", { selected: r.value === d.session_id && !Ge.value }]),
              disabled: ne.value,
              onClick: ($) => wn(d.session_id)
            }, [
              i("span", Eo, g(De(d) ? "LIFE → Agent" : e("你 ↔ Agent", "You ↔ Agent")), 1),
              i("strong", null, g(d.prompt || "未命名会话"), 1),
              i("small", null, g(Ue(d.started_at)), 1)
            ], 10, Ao))), 128)),
            Qt.value.length ? I("", !0) : (v(), b("p", Ro, g(e("暂无会话。直接发送消息，或等待 LIFE 委派工作。", "No sessions yet. Send a message or wait for LIFE to delegate work.")), 1))
          ]),
          i("button", {
            class: de(["ledger-button", { chosen: Ge.value }]),
            onClick: p[3] || (p[3] = (d) => Ge.value = !0)
          }, g(e("全部任务记录", "All task records")) + " · " + g(oe(s).tasks.length), 3)
        ]),
        Ge.value ? (v(), b("section", $o, [
          i("header", null, [
            i("h2", null, g(e("全部任务记录", "All task records")), 1),
            i("button", {
              onClick: p[4] || (p[4] = (d) => Ge.value = !1)
            }, g(e("返回会话", "Back to chat")), 1)
          ]),
          i("p", Co, g(e("包括 LIFE 对话、模型调用、Agent 执行及工具活动。", "LIFE conversations, model calls, Agent execution and tool activity.")), 1),
          (v(!0), b(ae, null, be(oe(s).tasks, (d) => (v(), b("article", {
            key: d.task_id,
            class: "ledger-entry"
          }, [
            i("div", null, [
              i("span", null, g(d.kind || "agent"), 1),
              i("span", {
                class: de(d.state)
              }, g(Ye(d.state)), 3),
              i("small", null, g(Ue(d.started_at)), 1)
            ]),
            i("p", null, g(d.prompt), 1),
            oe(s).sessions.some(($) => $.session_id === d.session_id) ? (v(), b("button", {
              key: 0,
              onClick: ($) => wn(d.session_id)
            }, "打开所属会话", 8, Lo)) : I("", !0),
            i("details", null, [
              p[21] || (p[21] = i("summary", null, "详情", -1)),
              i("code", null, g(d.task_id), 1),
              i("pre", null, g(d.result || d.error || "等待结果"), 1)
            ])
          ]))), 128))
        ])) : (v(), b("section", Io, [
          i("header", Oo, [
            i("div", null, [
              i("h2", null, g(ue.value?.prompt || "与 Agent 对话"), 1),
              i("p", null, g(ue.value && De(ue.value) ? "LIFE 发起的工作会话 · 你可以查看过程，也可以直接继续对话" : "持续对话 · 编程、调研与工具执行"), 1)
            ]),
            he.value ? (v(), b("span", Po, "正在执行")) : I("", !0),
            ue.value ? (v(), b("div", Do, [
              i("button", {
                disabled: !!he.value,
                onClick: p[5] || (p[5] = (d) => ct(ue.value.state === "archived" ? "restore" : "archive"))
              }, g(ue.value.state === "archived" ? "恢复" : "归档"), 9, No),
              i("button", {
                disabled: !!he.value,
                onClick: p[6] || (p[6] = (d) => ct("delete"))
              }, "删除", 8, Mo)
            ])) : I("", !0)
          ]),
          ke.value || oe(s).error ? (v(), b("div", zo, g(ke.value || oe(s).error), 1)) : I("", !0),
          m.value ? (v(), b("section", Fo, [
            j.value ? (v(), b(ae, { key: 0 }, [
              i("strong", null, g(j.value.host?.hostname || j.value.name), 1),
              i("span", {
                class: de(oe(s).isHealthy(j.value) ? "done" : "failed")
              }, g(oe(s).isHealthy(j.value) ? "在线" : "离线"), 3),
              i("div", Uo, [
                (v(!0), b(ae, null, be([{ label: "CPU 占用", value: V.value?.cpu_percent }, { label: "内存占用", value: V.value?.memory_percent }], (d) => (v(), b("div", {
                  key: d.label,
                  class: "usage-metric"
                }, [
                  i("div", {
                    class: "usage-ring",
                    style: Wt(Ve(d.value || 0))
                  }, [
                    i("b", null, g(d.value === void 0 ? "—" : `${d.value.toFixed(1)}%`), 1)
                  ], 4),
                  i("span", null, g(d.label), 1)
                ]))), 128)),
                i("small", null, g(V.value ? `采样时间：${Ue(V.value.sampled_at)}` : "等待宿主机实时采样"), 1)
              ]),
              i("dl", null, [
                i("div", null, [
                  p[22] || (p[22] = i("dt", null, "执行器地址", -1)),
                  i("dd", null, g(j.value.address), 1)
                ]),
                i("div", null, [
                  p[23] || (p[23] = i("dt", null, "系统 / 架构", -1)),
                  i("dd", null, g(j.value.host?.os || "—") + " / " + g(j.value.host?.arch || "—"), 1)
                ]),
                i("div", null, [
                  p[24] || (p[24] = i("dt", null, "CPU", -1)),
                  i("dd", null, g(j.value.host?.cpu_model || "—") + " · " + g(j.value.host?.cpu_cores || "—") + " 核", 1)
                ]),
                i("div", null, [
                  p[25] || (p[25] = i("dt", null, "可用 / 总内存", -1)),
                  i("dd", null, g(qe(j.value.host?.memory_available_bytes)) + " / " + g(qe(j.value.host?.memory_total_bytes)), 1)
                ]),
                i("div", null, [
                  p[26] || (p[26] = i("dt", null, "活跃任务", -1)),
                  i("dd", null, g(j.value.active_tasks), 1)
                ]),
                i("div", null, [
                  p[27] || (p[27] = i("dt", null, "距上次心跳", -1)),
                  i("dd", null, g(j.value.last_heartbeat_age_seconds) + " 秒", 1)
                ]),
                i("div", null, [
                  p[28] || (p[28] = i("dt", null, "默认工作目录", -1)),
                  i("dd", null, g(j.value.host?.workdir || "—"), 1)
                ])
              ])
            ], 64)) : (v(), b("p", Bo, "没有可用的执行器宿主机信息。"))
          ])) : I("", !0),
          i("div", {
            ref_key: "transcript",
            ref: it,
            class: "transcript",
            onScrollPassive: We
          }, [
            fe.value ? (v(), b("div", Ho, [
              i("header", jo, [
                i("button", {
                  type: "button",
                  onClick: en
                }, "← " + g(Fe.value.length > 1 ? e("返回上一层", "Back one level") : e("返回会话", "Back to chat")), 1),
                i("div", null, [
                  i("h3", null, g(e("子 Agent", "Subagent")), 1),
                  i("p", Wo, g(fe.value.prompt), 1)
                ]),
                i("span", {
                  class: de(fe.value.state)
                }, g(Ye(fe.value.state)), 3)
              ]),
              i("div", Vo, [
                i("div", qo, [
                  i("div", Go, [
                    i("b", null, g(e("父 Agent", "Parent agent")), 1),
                    i("time", null, g(Ue(fe.value.started_at)), 1)
                  ]),
                  i("div", Yo, g(fe.value.prompt), 1)
                ]),
                (v(!0), b(ae, null, be(Ae(fe.value), (d) => (v(), b(ae, {
                  key: d.task_id
                }, [
                  d.kind === "think" && (d.result || d.reasoning || d.state === "running" || d.error) ? (v(), b("div", Zo, [
                    d.prompt ? (v(), b("small", Ko, g(d.prompt), 1)) : I("", !0),
                    d.reasoning ? (v(), b("details", {
                      key: 1,
                      class: "think-chain",
                      open: d.state === "running" && !d.result
                    }, [
                      i("summary", null, g(e("思维链", "Reasoning")), 1),
                      i("pre", null, g(d.reasoning), 1)
                    ], 8, Xo)) : I("", !0),
                    d.result ? (v(), b(ae, { key: 2 }, [
                      ze(un, {
                        content: d.result
                      }, null, 8, ["content"]),
                      d.state === "running" ? (v(), b("span", Qo, " ▍")) : I("", !0)
                    ], 64)) : d.state === "running" ? (v(), b("small", Jo, g(e("子 Agent 正在生成回复…", "Subagent is drafting a reply…")), 1)) : I("", !0),
                    d.error ? (v(), b("p", ei, g(Be(d.error)), 1)) : I("", !0)
                  ])) : d.kind === "subagent" ? (v(), b("div", ti, [
                    i("button", {
                      type: "button",
                      class: "subagent-card-head",
                      onClick: ($) => Pt(d)
                    }, [
                      i("span", {
                        class: de(d.state)
                      }, "●", 2),
                      i("strong", null, g(e("子 Agent", "Subagent")), 1),
                      i("span", si, g(d.prompt), 1),
                      i("small", null, g(Ye(d.state)), 1),
                      p[29] || (p[29] = i("span", {
                        class: "subagent-chevron",
                        "aria-hidden": "true"
                      }, "▸", -1))
                    ], 8, ni)
                  ])) : d.kind === "tool" ? (v(), wt(Ys, {
                    key: 2,
                    step: d,
                    "format-error": Be
                  }, null, 8, ["step"])) : d.kind !== "think" ? (v(), b("details", ri, [
                    i("summary", null, [
                      i("span", {
                        class: de(d.state)
                      }, "●", 2),
                      Re(" " + g(tn(d)) + " · " + g(d.prompt) + " ", 1),
                      i("small", null, g(Ye(d.state)), 1)
                    ]),
                    i("pre", null, g(d.result || d.error || (d.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                  ])) : I("", !0)
                ], 64))), 128)),
                Dt(fe.value) ? (v(), b("div", li, [
                  ze(un, {
                    content: Dt(fe.value)
                  }, null, 8, ["content"])
                ])) : I("", !0),
                fe.value.error ? (v(), b("p", ai, g(Be(fe.value.error)), 1)) : I("", !0),
                !Ae(fe.value).length && !Dt(fe.value) && !fe.value.error ? (v(), b("p", oi, g(fe.value.state === "running" ? e("子 Agent 正在执行…", "Subagent is running…") : e("没有子步骤记录", "No child steps recorded")), 1)) : I("", !0)
              ])
            ])) : (v(), b(ae, { key: 1 }, [
              !Jt.value.length && !kt.value ? (v(), b("div", ii, [...p[30] || (p[30] = [
                i("h2", null, "想让 Agent 帮你做什么？", -1),
                i("p", null, "直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。", -1),
                i("p", null, "左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。", -1)
              ])])) : I("", !0),
              kt.value ? (v(), b("article", ui, [
                i("div", ci, [
                  i("strong", null, g(e("上下文摘要", "Context summary")), 1),
                  i("time", null, g(Ue(kt.value.started_at)), 1)
                ]),
                ze(un, {
                  content: kt.value.result || ""
                }, null, 8, ["content"])
              ])) : I("", !0),
              (v(!0), b(ae, null, be(Jt.value, (d) => (v(), b("article", {
                key: d.task_id,
                class: "turn"
              }, [
                i("div", di, [
                  i("div", pi, [
                    i("b", null, g(De(d) ? "LIFE" : "你"), 1),
                    i("time", null, g(Ue(d.started_at)), 1)
                  ]),
                  i("div", hi, g(d.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, "")), 1)
                ]),
                i("div", fi, [
                  i("div", gi, [
                    p[31] || (p[31] = i("b", null, "Agent", -1)),
                    i("span", {
                      class: de(d.state)
                    }, g(Ye(d.state)), 3)
                  ]),
                  ut(d).length ? (v(), b("div", mi, [
                    (v(!0), b(ae, null, be(ut(d), ($) => (v(), b(ae, {
                      key: $.task_id
                    }, [
                      $.kind === "think" && ($.result || $.reasoning || $.state === "running" || $.error) ? (v(), b("div", vi, [
                        $.prompt ? (v(), b("small", ki, g($.prompt), 1)) : I("", !0),
                        $.reasoning ? (v(), b("details", {
                          key: 1,
                          class: "think-chain",
                          open: $.state === "running" && !$.result
                        }, [
                          i("summary", null, g(e("思维链", "Reasoning")), 1),
                          i("pre", null, g($.reasoning), 1)
                        ], 8, bi)) : I("", !0),
                        $.result ? (v(), b(ae, { key: 2 }, [
                          ze(un, {
                            content: $.result
                          }, null, 8, ["content"]),
                          $.state === "running" ? (v(), b("span", yi, " ▍")) : I("", !0)
                        ], 64)) : $.state === "running" ? (v(), b("small", _i, "Agent 正在生成回复…")) : I("", !0),
                        $.error ? (v(), b("p", wi, g(Be($.error)), 1)) : I("", !0)
                      ])) : $.kind === "subagent" ? (v(), b("div", xi, [
                        i("button", {
                          type: "button",
                          class: "subagent-card-head",
                          onClick: (we) => Pt($)
                        }, [
                          i("span", {
                            class: de($.state)
                          }, "●", 2),
                          i("strong", null, g(e("子 Agent", "Subagent")), 1),
                          i("span", Ti, g($.prompt), 1),
                          i("small", null, [
                            Re(g(Ye($.state)), 1),
                            Nt($) ? (v(), b(ae, { key: 0 }, [
                              Re(" · " + g(Nt($)) + " " + g(e("步", "steps")), 1)
                            ], 64)) : I("", !0)
                          ]),
                          p[32] || (p[32] = i("span", {
                            class: "subagent-chevron",
                            "aria-hidden": "true"
                          }, "▸", -1))
                        ], 8, Si),
                        $.error ? (v(), b("p", Ai, g(Be($.error)), 1)) : I("", !0)
                      ])) : $.kind === "tool" ? (v(), wt(Ys, {
                        key: 2,
                        step: $,
                        "format-error": Be
                      }, null, 8, ["step"])) : $.kind !== "think" ? (v(), b("details", Ei, [
                        i("summary", null, [
                          i("span", {
                            class: de($.state)
                          }, "●", 2),
                          Re(" " + g(tn($)) + " · " + g($.prompt) + " ", 1),
                          i("small", null, g(Ye($.state)), 1)
                        ]),
                        i("pre", null, g($.result || $.error || ($.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                      ])) : I("", !0)
                    ], 64))), 128))
                  ])) : I("", !0),
                  d.result && !Hn(d) ? (v(), wt(un, {
                    key: 1,
                    content: d.result
                  }, null, 8, ["content"])) : I("", !0),
                  d.error ? (v(), b("div", Ri, g(Be(d.error)), 1)) : I("", !0),
                  ["running", "pending"].includes(d.state) ? (v(), b("p", $i, "Agent 正在处理，执行过程会自动更新…")) : I("", !0)
                ])
              ]))), 128))
            ], 64))
          ], 544),
          fe.value ? I("", !0) : (v(), b("form", {
            key: 2,
            class: "composer",
            onSubmit: Pe(ce, ["prevent"])
          }, [
            me.value ? (v(), b("div", Ci, g(me.value), 1)) : I("", !0),
            i("div", Li, [
              i("label", null, [
                Re(g(e("权限", "Permissions")), 1),
                ze(Ln, {
                  modelValue: ie.value,
                  "onUpdate:modelValue": p[7] || (p[7] = (d) => ie.value = d),
                  "aria-label": e("权限", "Permissions"),
                  disabled: !!he.value || ne.value,
                  options: [{ value: "normal", label: e("Normal · 全部审批", "Normal · Ask every time") }, { value: "full_access", label: e("Full access · 自动执行", "Full access · Auto execute") }]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ]),
              i("label", null, [
                Re(g(e("执行器", "Executor")), 1),
                ze(Ln, {
                  modelValue: ee.value,
                  "onUpdate:modelValue": p[8] || (p[8] = (d) => ee.value = d),
                  "aria-label": e("执行器", "Executor"),
                  disabled: !!he.value || ne.value,
                  options: [{ value: "", label: e("自动选择在线执行器", "Automatic executor") }, ...oe(s).agents.map((d) => ({ value: d.plugin_id, label: `${d.host?.hostname || d.name} · ${d.plugin_id}`, disabled: !oe(s).isHealthy(d) }))]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ]),
              i("label", null, [
                Re(g(e("工作区", "Workspace")), 1),
                i("button", {
                  type: "button",
                  class: "workspace-select",
                  disabled: !!he.value || ne.value || !j.value,
                  title: C.value || j.value?.host?.workdir,
                  onClick: p[9] || (p[9] = (d) => Qe(C.value || j.value?.host?.workdir || ""))
                }, [
                  p[33] || (p[33] = i("svg", {
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
                  Re(" " + g(C.value || e("选择目录…", "Select folder…")), 1)
                ], 8, Ii)
              ]),
              ze(fo, {
                modelValue: z.value,
                "onUpdate:modelValue": p[10] || (p[10] = (d) => z.value = d),
                disabled: !!he.value || ne.value
              }, null, 8, ["modelValue", "disabled"]),
              i("label", null, [
                Re(g(e("模型", "Model")), 1),
                ze(Ln, {
                  modelValue: te.value,
                  "onUpdate:modelValue": p[11] || (p[11] = (d) => te.value = d),
                  searchable: "",
                  "aria-label": e("模型", "Model"),
                  disabled: !!he.value || ne.value,
                  onOpen: Ot,
                  options: [{ value: "MOCR", label: e("MOCR · 自动选型", "MOCR · Automatic") }, ...f.value.map((d) => ({ value: d.id, label: It(d) }))]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ])
            ]),
            i("input", {
              ref_key: "fileInput",
              ref: y,
              type: "file",
              multiple: "",
              hidden: "",
              onChange: U
            }, null, 544),
            i("div", {
              ref_key: "composerInput",
              ref: Rt,
              class: "composer-input"
            }, [
              (v(), wt(zn, { to: "body" }, [
                mt.value ? (v(), b("div", {
                  key: 0,
                  class: "slash-menu",
                  style: Wt(le.value),
                  role: "listbox",
                  "aria-label": e("技能与命令", "Skills and commands")
                }, [
                  (v(!0), b(ae, null, be(lt.value, (d, $) => (v(), b("button", {
                    key: d.name,
                    type: "button",
                    class: de(["slash-item", { active: $ === q.value }]),
                    role: "option",
                    "aria-selected": $ === q.value,
                    onMousedown: Pe((we) => at(d), ["prevent"]),
                    onMouseenter: (we) => q.value = $
                  }, [
                    i("span", Di, "/" + g(d.name), 1),
                    i("span", Ni, g(d.description), 1)
                  ], 42, Pi))), 128))
                ], 12, Oi)) : I("", !0)
              ])),
              u.value.length || k.value ? (v(), b("div", Mi, [
                (v(!0), b(ae, null, be(u.value, (d, $) => (v(), b("span", {
                  key: $,
                  class: "attach-chip",
                  title: `${d.mime} · ${d.size} B`
                }, [
                  Re(g(d.name) + " ", 1),
                  i("button", {
                    type: "button",
                    "aria-label": e("移除附件", "Remove attachment"),
                    title: e("移除", "Remove"),
                    onClick: (we) => E($)
                  }, "×", 8, Fi)
                ], 8, zi))), 128)),
                k.value ? (v(), b("span", Ui, g(k.value), 1)) : I("", !0)
              ])) : I("", !0),
              cn(i("textarea", {
                "onUpdate:modelValue": p[12] || (p[12] = (d) => a.value = d),
                disabled: ne.value || ue.value?.state === "archived",
                placeholder: ue.value?.state === "archived" ? "恢复会话后可以继续对话" : "给 Agent 发消息…（Enter 发送，Shift+Enter 换行，可 Ctrl+V 粘贴图片/文件）",
                "aria-label": "给 Agent 发消息",
                onKeydown: _n,
                onPaste: L
              }, null, 40, Bi), [
                [On, a.value]
              ]),
              i("div", Hi, [
                i("button", {
                  type: "button",
                  class: "attach-fly",
                  disabled: !!he.value || ne.value || o.value || ue.value?.state === "archived",
                  "aria-label": e("添加附件", "Add attachment"),
                  title: o.value ? e("上传中…", "Uploading…") : e("添加附件（也可 Ctrl+V 粘贴）", "Attach (or Ctrl+V to paste)"),
                  onClick: S
                }, [...p[34] || (p[34] = [
                  i("svg", {
                    width: "18",
                    height: "18",
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
                  ], -1)
                ])], 8, ji),
                he.value?.kind !== "agent" ? (v(), b("button", {
                  key: 0,
                  type: "submit",
                  class: "send-fly",
                  disabled: ne.value || !!he.value || !a.value.trim() || ue.value?.state === "archived",
                  "aria-label": e("发送", "Send"),
                  title: e("发送", "Send")
                }, [...p[35] || (p[35] = [
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
                ])], 8, Wi)) : (v(), b("button", {
                  key: 1,
                  type: "button",
                  class: "send-fly stop",
                  onClick: dt,
                  "aria-label": e("停止", "Stop"),
                  title: e("停止", "Stop")
                }, [...p[36] || (p[36] = [
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
                ])], 8, Vi))
              ])
            ], 512),
            i("footer", null, [
              ze(Ln, {
                modelValue: Y.value,
                "onUpdate:modelValue": p[13] || (p[13] = (d) => Y.value = d),
                disabled: ne.value,
                "aria-label": e("Agent 模式", "Agent mode"),
                options: [{ value: "general", label: e("通用 Agent", "General Agent") }, { value: "code", label: e("编程 Agent", "Coding Agent") }, { value: "research", label: e("调研 Agent", "Research Agent") }]
              }, null, 8, ["modelValue", "disabled", "aria-label", "options"]),
              i("button", {
                type: "button",
                onClick: p[14] || (p[14] = (d) => m.value = !m.value)
              }, g(e("宿主机", "Host")), 1),
              i("button", {
                type: "button",
                disabled: !ue.value || !!he.value || ne.value || ue.value.state === "archived",
                onClick: Xt
              }, "/compact", 8, qi),
              i("span", Gi, g(he.value?.kind === "compact" ? e("上下文压缩中…", "Compacting…") : oe(s).onlineCount ? e("在当前会话中继续", "Continue this session") : e("执行器离线", "Executor offline")), 1)
            ])
          ], 32))
        ])),
        T.value ? (v(), b("div", {
          key: 2,
          class: "directory-backdrop",
          onClick: Pe(J, ["self"])
        }, [
          i("section", Yi, [
            i("header", null, [
              i("h2", null, "选择 " + g(j.value?.host?.hostname || "执行器") + " 的工作区", 1),
              i("button", { onClick: J }, "关闭")
            ]),
            i("div", Zi, [
              (v(!0), b(ae, null, be(K.value.roots, (d) => (v(), b("button", {
                key: d,
                disabled: R.value,
                onClick: ($) => Qe(d)
              }, g(d), 9, Ki))), 128)),
              i("button", {
                disabled: R.value,
                onClick: p[15] || (p[15] = (d) => Qe(j.value?.host?.workdir || ""))
              }, "默认目录", 8, Xi)
            ]),
            i("code", null, g(K.value.path), 1),
            i("form", {
              class: "new-folder",
              onSubmit: Pe(_, ["prevent"])
            }, [
              cn(i("input", {
                "onUpdate:modelValue": p[16] || (p[16] = (d) => F.value = d),
                placeholder: "新文件夹名称",
                "aria-label": "新文件夹名称",
                disabled: R.value
              }, null, 8, Qi), [
                [On, F.value]
              ]),
              i("button", {
                disabled: R.value || !F.value.trim() || !K.value.path
              }, "新建文件夹", 8, Ji)
            ], 32),
            N.value ? (v(), b("p", eu, g(N.value), 1)) : I("", !0),
            R.value ? (v(), b("p", tu, "正在读取目录…")) : (v(), b("div", nu, [
              K.value.parent !== K.value.path ? (v(), b("button", {
                key: 0,
                onClick: p[17] || (p[17] = (d) => Qe(K.value.parent))
              }, "上一级")) : I("", !0),
              (v(!0), b(ae, null, be(K.value.directories, (d) => (v(), b("button", {
                key: d.path,
                onClick: ($) => Qe(d.path)
              }, [
                p[37] || (p[37] = i("svg", {
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
                Re(" " + g(d.name), 1)
              ], 8, su))), 128)),
              K.value.directories.length ? I("", !0) : (v(), b("p", ru, "没有子目录"))
            ])),
            i("footer", null, [
              i("button", {
                disabled: R.value || !!N.value || !K.value.path,
                onClick: Kt
              }, "选择当前目录", 8, lu)
            ])
          ])
        ])) : I("", !0)
      ]),
      ze(go)
    ], 64));
  }
}), uu = /* @__PURE__ */ ps(au, [["__scopeId", "data-v-8b88250e"]]);
export {
  uu as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('agent-plugin-style')){const s=document.createElement('style');s.id='agent-plugin-style';s.textContent=".markdown-content[data-v-ef377647]{line-height:1.75;overflow-wrap:anywhere;font-size:14px}.markdown-content[data-v-ef377647] pre{padding:16px;background:var(--md-surface-container);border-radius:8px;overflow:auto;white-space:pre;line-height:1.5}.markdown-content[data-v-ef377647] code{font-family:monospace;background:var(--md-surface-container);padding:2px 4px;border-radius:4px}.markdown-content[data-v-ef377647] pre code{padding:0;background:none}.markdown-content[data-v-ef377647] table{display:block;overflow:auto;border-collapse:collapse;margin:12px 0}.markdown-content[data-v-ef377647] th,.markdown-content[data-v-ef377647] td{border:1px solid var(--md-outline-variant);padding:8px 12px}.markdown-content[data-v-ef377647] blockquote{border-left:3px solid var(--md-outline);margin:12px 0;padding-left:14px;color:var(--md-on-surface-variant)}.markdown-content[data-v-ef377647] ul,.markdown-content[data-v-ef377647] ol{padding-left:24px}.markdown-content[data-v-ef377647] a{color:var(--md-primary);text-decoration:underline}.markdown-content[data-v-ef377647] img{max-width:100%}.markdown-content[data-v-ef377647] h1,.markdown-content[data-v-ef377647] h2,.markdown-content[data-v-ef377647] h3{margin:16px 0 8px}.tool-card[data-v-f13fbd25]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container);margin:8px 0;overflow:hidden}button.tool-card-head[data-v-f13fbd25]{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:none;border-radius:0;background:transparent;padding:10px 12px;cursor:pointer;font-size:13px}.tool-kind[data-v-f13fbd25]{flex-shrink:0;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--md-on-surface)}.tool-summary[data-v-f13fbd25]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font);font-size:13px;color:var(--md-on-surface)}.tool-stat[data-v-f13fbd25]{flex-shrink:0;font-size:12px;font-weight:600;color:var(--md-primary);border:1px solid var(--md-outline-variant);border-radius:999px;padding:1px 8px}.tool-state[data-v-f13fbd25]{flex-shrink:0;font-size:13px;color:var(--md-on-surface-variant)}.tool-chevron[data-v-f13fbd25]{flex-shrink:0;color:var(--md-on-surface-variant);font-size:12px;transition:transform .15s}.tool-card.expanded .tool-chevron[data-v-f13fbd25]{transform:rotate(90deg)}.tool-dot[data-v-f13fbd25]{font-size:9px}.tool-dot.running[data-v-f13fbd25],.tool-dot.pending[data-v-f13fbd25]{color:#b88412}.tool-dot.failed[data-v-f13fbd25]{color:var(--md-error,#c44)}.tool-dot.done[data-v-f13fbd25]{color:#3a6}.tool-dot.cancelled[data-v-f13fbd25]{color:var(--md-on-surface-variant)}.tool-card-body[data-v-f13fbd25]{padding:4px 12px 12px;border-top:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}.tool-section-label[data-v-f13fbd25]{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--md-on-surface-variant);margin-top:4px}.tool-card-body pre[data-v-f13fbd25]{margin:0;max-height:340px;overflow:auto;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);border-radius:8px;padding:8px 10px;font-family:var(--code-font);font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.tool-shot[data-v-f13fbd25]{margin:0;display:flex;flex-direction:column;gap:6px}.tool-shot img[data-v-f13fbd25]{width:100%;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest);display:block}.tool-shot figcaption[data-v-f13fbd25]{font-family:var(--code-font);font-size:11.5px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-section-text[data-v-f13fbd25]{margin:0;font-size:13px;overflow-wrap:anywhere}.tool-error[data-v-f13fbd25]{background:var(--md-error-container);padding:8px 12px;border-radius:8px;margin:0;font-size:12px;overflow-wrap:anywhere}.muted[data-v-f13fbd25]{font-size:12px;color:var(--md-on-surface-variant);margin:0}.tool-dialog-backdrop[data-v-f13fbd25]{position:fixed;inset:0;background:#0008;z-index:1050;display:grid;place-items:center;padding:20px}.tool-dialog[data-v-f13fbd25]{background:var(--md-surface);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:18px 20px;width:min(680px,100%);max-height:82vh;overflow:auto;display:flex;flex-direction:column;gap:12px}.tool-dialog header[data-v-f13fbd25]{display:flex;align-items:center;justify-content:space-between;gap:12px}.tool-dialog h4[data-v-f13fbd25]{margin:0;font-size:15px;overflow-wrap:anywhere;flex:1;min-width:0}#app .tool-dialog-close[data-v-f13fbd25],.tool-dialog-close[data-v-f13fbd25]{flex-shrink:0;width:40px;height:40px;min-height:0;padding:0;border:none;border-radius:50%;background:transparent;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}#app .tool-dialog-close[data-v-f13fbd25]:hover,.tool-dialog-close[data-v-f13fbd25]:hover{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent);box-shadow:none;filter:none;color:var(--md-on-surface)}#app .tool-dialog-close[data-v-f13fbd25]:active,.tool-dialog-close[data-v-f13fbd25]:active{background:color-mix(in srgb,var(--md-on-surface) 12%,transparent);border-radius:50%}.tool-search-results[data-v-f13fbd25]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}.tool-search-results a[data-v-f13fbd25]{color:var(--md-primary);font-size:14px;font-weight:500;text-decoration:none}.tool-search-results a[data-v-f13fbd25]:hover{text-decoration:underline}.tool-search-results p[data-v-f13fbd25]{margin:4px 0 0;font-size:13px;line-height:1.65;color:var(--md-on-surface)}.tool-search-results small[data-v-f13fbd25]{display:block;margin-top:2px;font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-card[data-v-f13fbd25]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent);background:var(--md-surface-container);transition:box-shadow .22s,background-color .2s}.tool-card[data-v-f13fbd25]:hover{box-shadow:var(--shadow-1)}button.tool-card-head[data-v-f13fbd25]{padding:12px 15px;gap:10px;min-height:46px;border-radius:0}button.tool-card-head[data-v-f13fbd25]:hover{background:var(--md-secondary-container)}.tool-kind[data-v-f13fbd25]{font-weight:700;letter-spacing:.06em}.tool-stat[data-v-f13fbd25]{border-color:color-mix(in srgb,var(--md-primary) 30%,transparent);background:color-mix(in srgb,var(--md-primary) 10%,transparent)}.tool-chevron[data-v-f13fbd25]{width:22px;height:22px;display:inline-grid;place-items:center;border-radius:50%;background:var(--md-surface-container-high);transition:transform .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}.tool-card-body[data-v-f13fbd25]{padding:8px 15px 15px;gap:8px;border-top-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-card-body pre[data-v-f13fbd25]{border-radius:14px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-section-label[data-v-f13fbd25]{font-weight:700}.diff-wrap[data-v-f13fbd25]{display:flex;flex-direction:column;gap:10px}.diff-file[data-v-f13fbd25]{border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);border-radius:14px;overflow:hidden;background:var(--md-surface-container-lowest)}.diff-file-head[data-v-f13fbd25]{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;background:var(--md-surface-container);font-size:11.5px;font-weight:650}.diff-file-path[data-v-f13fbd25]{font-family:var(--code-font);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.diff-file-stat[data-v-f13fbd25]{flex:none;font-family:var(--code-font);color:var(--md-on-surface-variant)}.diff-body[data-v-f13fbd25]{max-height:360px;overflow:auto;font-family:var(--code-font);font-size:12px;line-height:1.55;padding:4px 0}.diff-line[data-v-f13fbd25]{display:grid;grid-template-columns:40px 40px 18px 1fr;white-space:pre;min-width:max-content}.diff-no[data-v-f13fbd25]{text-align:right;padding:0 6px;color:var(--md-on-surface-variant);opacity:.6;user-select:none;font-variant-numeric:tabular-nums}.diff-sign[data-v-f13fbd25]{text-align:center;user-select:none;opacity:.9}.diff-text[data-v-f13fbd25]{padding-right:12px}.diff-line.add[data-v-f13fbd25]{background:color-mix(in srgb,#2ea043 20%,transparent);color:#116329}.diff-line.del[data-v-f13fbd25]{background:color-mix(in srgb,#cf222e 18%,transparent);color:#82071e}.diff-line.add .diff-sign[data-v-f13fbd25]{color:#116329;font-weight:700}.diff-line.del .diff-sign[data-v-f13fbd25]{color:#cf222e;font-weight:700}.diff-line.hunk[data-v-f13fbd25]{background:var(--md-surface-container);color:var(--md-on-surface-variant)}.diff-line.meta[data-v-f13fbd25]{color:var(--md-on-surface-variant);opacity:.75}@media (prefers-color-scheme: dark){.diff-line.add[data-v-f13fbd25],.diff-line.add .diff-sign[data-v-f13fbd25]{color:#7ee787}.diff-line.del[data-v-f13fbd25],.diff-line.del .diff-sign[data-v-f13fbd25]{color:#ffa198}}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color .14s,border-radius .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),color .14s}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.selected.highlighted{background:color-mix(in srgb,var(--md-primary-container) 88%,var(--md-primary) 12%)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-search{position:sticky;top:-8px;z-index:1;display:flex;align-items:center;gap:10px;margin:-8px -8px 8px;padding:13px 16px;background:var(--md-surface-container-low);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px 24px 0 0;color:var(--md-on-surface-variant)}.app-select-search input{flex:1;min-width:0;border:0;background:transparent;padding:0;font:inherit;color:var(--md-on-surface);outline:none}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity .18s var(--ease-emphasized,cubic-bezier(.2,0,0,1)),transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.select-menu-leave-active{transition:opacity .13s,transform .13s}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}.thinking-control{min-width:110px;flex:1;display:flex;flex-direction:column;gap:5px}.thinking-caption{font-size:12px}#app .thinking-trigger{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;padding:9px 12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);font-size:12px;border-radius:9px}.thinking-popover{position:fixed;z-index:10000;padding:16px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:0 10px 32px #16244026;color:var(--md-on-surface);font-family:var(--font-family)}.thinking-popover header{display:flex;justify-content:space-between;gap:12px;font-size:13px}.thinking-popover output{color:var(--md-primary);font-weight:600}.thinking-track{position:relative;padding:22px 4px 16px;display:flex;align-items:center}.thinking-track input{appearance:none;-webkit-appearance:none;width:100%;height:5px;padding:0;margin:0;border:0;border-radius:5px;background:linear-gradient(to right,var(--md-primary) var(--intensity),var(--md-outline-variant) var(--intensity));cursor:pointer;z-index:1}.thinking-track input::-webkit-slider-thumb{appearance:none;width:17px;height:17px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface);box-shadow:0 1px 4px #24345d40}.thinking-track input::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface)}.thinking-track input:focus-visible{outline:2px solid var(--md-primary);outline-offset:7px}.thinking-stops{display:flex;justify-content:space-between;gap:3px}.thinking-stops button{font:inherit;font-size:12px;border:0;background:transparent;color:var(--md-on-surface-variant);padding:6px 5px;border-radius:6px;cursor:pointer}.thinking-stops button.selected{background:var(--md-primary-container);color:var(--md-primary);font-weight:700}.thinking-popover p{font-size:12px;line-height:1.5;color:var(--md-on-surface-variant);margin:12px 0 0}.thinking-control.full .thinking-trigger,.thinking-popover.full{--md-primary:#a050db;border-color:#a050db88;box-shadow:0 0 16px #a050db25}.thinking-popover.full .energy-wave{position:absolute;inset:14px 0 8px;pointer-events:none;border-radius:20px;box-shadow:0 0 12px #a050db66}.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger{animation:thinking-boost .85s ease-out}.thinking-popover.pulse .energy-wave{animation:thinking-wave .85s ease-out}@keyframes thinking-boost{0%{box-shadow:0 0 #a050db66}45%{box-shadow:0 0 0 5px #a050db20,0 0 30px #a050db40}to{box-shadow:0 0 16px #a050db25}}@keyframes thinking-wave{0%{transform:scale(.95);opacity:1}to{transform:scale(1.15,2);opacity:0}}.thinking-menu-enter-active,.thinking-menu-leave-active{transition:opacity .13s,transform .13s}.thinking-menu-enter-from,.thinking-menu-leave-to{opacity:0;transform:translateY(4px)}@media (prefers-reduced-motion:reduce){.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger,.thinking-popover.pulse .energy-wave{animation:none}}.thinking-popover{padding:20px;border-radius:28px;background:var(--md-surface-container-low);border-color:transparent;box-shadow:0 8px 28px #24345d24}.thinking-popover header{align-items:center;font-size:14px;min-height:30px}.thinking-popover output{padding:6px 12px;border-radius:999px;background:var(--md-primary-container);font-size:12px}.thinking-track{height:68px;padding:0;margin:12px 0 0;isolation:isolate}.thinking-capsule{position:absolute;left:5px;right:5px;height:28px;border-radius:999px;background:var(--md-primary-container);overflow:hidden;pointer-events:none}.thinking-fill{height:100%;width:var(--intensity);background:var(--md-primary);border-radius:999px}.thinking-tick{position:absolute;top:50%;width:4px;height:4px;border-radius:50%;background:var(--md-primary);transform:translate(-50%,-50%)}.thinking-tick:first-of-type{left:8px!important}.thinking-tick:last-of-type{left:calc(100% - 8px)!important}.thinking-tick.passed{background:var(--md-on-primary)}.thinking-track input{position:relative;height:48px;background:transparent;border-radius:999px;touch-action:pan-y}.thinking-track input::-webkit-slider-runnable-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-webkit-slider-thumb{width:10px;height:44px;margin-top:-8px;border-radius:999px;border:0;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low);transition:width .14s,height .14s,margin-top .14s}.thinking-track input:active::-webkit-slider-thumb{width:6px;height:48px;margin-top:-10px}.thinking-track input::-moz-range-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-moz-range-thumb{width:10px;height:44px;border:0;border-radius:999px;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low)}.thinking-track input:active::-moz-range-thumb{width:6px;height:48px}.thinking-track input:focus-visible{outline-offset:3px}.thinking-stops{align-items:center;gap:2px;margin-top:2px}.thinking-stops button{border-radius:999px;min-height:30px;padding:6px 9px;transition:background-color .16s,color .16s}.thinking-popover.full{background:color-mix(in srgb,var(--md-surface-container-low) 93%,#a050db);border-color:#a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#7255c8,#ad50d6)}.thinking-popover.full .energy-wave{inset:18px 5px;border-radius:999px;z-index:-1}.thinking-popover p{margin-top:12px}.thinking-popover.full{box-shadow:0 8px 28px #24345d24,0 0 34px #a050db33;border-color:#a050db77}.thinking-popover.full .energy-wave{position:absolute;inset:-3px 4px;border-radius:999px;z-index:-1;background:radial-gradient(70% 120% at 100% 50%,#c56bffbb,transparent 68%),radial-gradient(50% 120% at 0% 50%,#6b8cffaa,transparent 70%);filter:blur(7px);animation:thunder-glow 1.7s ease-in-out infinite}@keyframes thunder-glow{0%,to{opacity:.5;transform:scale(1)}45%{opacity:1;transform:scale(1.03)}}.thinking-popover.full .thinking-capsule{box-shadow:0 0 0 1px #a050db66,0 0 26px #a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#6b8cff,#a050db,#e0a3ff,#a050db);background-size:280% 100%;animation:thunder-flow 2.6s linear infinite}@keyframes thunder-flow{to{background-position:280% 0}}.thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-control.full .thinking-trigger span:first-child{animation:thunder-flicker 2s steps(1,end) infinite}@keyframes thunder-flicker{0%,90%,to{opacity:1}92%{opacity:.35}94%{opacity:1}96%{opacity:.5}}#app .thinking-control .thinking-trigger{min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:13px;font-weight:500;align-items:center;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .thinking-control .thinking-trigger:hover{background:var(--md-surface-container-highest)}#app .thinking-control .thinking-trigger[aria-expanded=true]{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-caption{font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.workspace[data-v-8b88250e]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}button[data-v-8b88250e],input[data-v-8b88250e],textarea[data-v-8b88250e],select[data-v-8b88250e]{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);padding:9px 12px}button[data-v-8b88250e]{cursor:pointer;transition:background .15s,box-shadow .15s,filter .15s}button[data-v-8b88250e]:disabled{opacity:.45;cursor:default}button[data-v-8b88250e]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}input[data-v-8b88250e]:focus,textarea[data-v-8b88250e]:focus,select[data-v-8b88250e]:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}input[type=checkbox][data-v-8b88250e]{width:auto;accent-color:var(--md-primary)}.sessions[data-v-8b88250e]{width:284px;flex-shrink:0;border-right:1px solid var(--md-outline-variant);padding:20px 16px;display:flex;flex-direction:column;gap:14px;background:var(--md-surface-container-low)}.sessions header[data-v-8b88250e]{display:flex;align-items:center;justify-content:space-between;gap:12px}.sessions h1[data-v-8b88250e]{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}.sessions header>button[data-v-8b88250e]{height:34px;padding:0 13px;border:0;border-radius:9px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:600 13px/1 inherit}.sessions header>button[data-v-8b88250e]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.08);box-shadow:var(--shadow-1)}.sessions>input[data-v-8b88250e]{border-radius:10px;background:var(--md-surface-container-lowest)}.connection[data-v-8b88250e]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}.connection button[data-v-8b88250e]{margin-left:auto;padding:3px 9px;border-radius:8px;font-size:13px}.connection i[data-v-8b88250e]{width:8px;height:8px;border-radius:50%;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}.connection i.online[data-v-8b88250e]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.filter-bar[data-v-8b88250e]{display:flex;gap:3px;padding:4px;border-radius:999px;background:var(--md-surface-container-high)}.filter-bar button[data-v-8b88250e]{flex:1;font-size:12px;font-weight:500;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);box-shadow:none}.filter-bar button[data-v-8b88250e]:hover:not(:disabled){background:transparent;color:var(--md-on-surface)}.filter-bar button.chosen[data-v-8b88250e]{background:var(--md-surface-container-lowest);color:var(--md-primary);font-weight:650;box-shadow:var(--shadow-1)}.sessions label input[data-v-8b88250e]{margin-right:6px}.session-list[data-v-8b88250e]{overflow-y:auto;flex:1;min-height:0;margin:0 -4px;padding:0 4px}.session-card[data-v-8b88250e]{display:flex;flex-direction:column;width:100%;text-align:left;gap:6px;margin-bottom:8px;padding:12px 13px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest)}.session-card[data-v-8b88250e]:hover:not(:disabled){background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.session-card.selected[data-v-8b88250e]{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}.session-card.selected[data-v-8b88250e]:hover{background:var(--md-secondary-container)}.session-card strong[data-v-8b88250e]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:600;font-size:14px}.origin[data-v-8b88250e],small[data-v-8b88250e],.sessions .muted[data-v-8b88250e]{font-size:12px;color:var(--md-on-surface-variant)}.origin[data-v-8b88250e]{font-weight:600;letter-spacing:.02em}.ledger-button[data-v-8b88250e]{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:13px;font-weight:550}.ledger-button.chosen[data-v-8b88250e]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.ledger[data-v-8b88250e]{flex:1;overflow-y:auto;padding:var(--space-xl)}.ledger>header[data-v-8b88250e]{margin-bottom:8px}.ledger>header h2[data-v-8b88250e]{font-size:18px;font-weight:650}.ledger-entry[data-v-8b88250e]{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:14px 16px;margin:10px 0;box-shadow:var(--shadow-1)}.ledger-entry>div[data-v-8b88250e]{display:flex;align-items:center;gap:10px;font-size:12px}.ledger-entry>div>span[data-v-8b88250e]:first-child{font-family:var(--code-font);background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-weight:600}.ledger-entry>div small[data-v-8b88250e]{margin-left:auto}.ledger-entry>p[data-v-8b88250e]{margin:8px 0;font-size:14px;line-height:1.6;overflow-wrap:anywhere}.ledger-entry details[data-v-8b88250e]{margin-top:8px;border-radius:10px;background:var(--md-surface-container);padding:8px 12px;font-size:12px}.ledger-entry summary[data-v-8b88250e]{cursor:pointer;color:var(--md-on-surface-variant)}.ledger-entry pre[data-v-8b88250e]{margin:8px 0 0;max-height:300px}.conversation[data-v-8b88250e]{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}.conversation-header[data-v-8b88250e]{display:flex;align-items:flex-start;gap:14px}.conversation-header>div[data-v-8b88250e]:first-child{flex:1;min-width:0}.conversation-header h2[data-v-8b88250e]{font-size:17px;font-weight:650;margin:0}.conversation-header p[data-v-8b88250e]{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:13px}.session-actions[data-v-8b88250e]{display:flex;gap:8px;flex-shrink:0}.session-actions button[data-v-8b88250e]{height:32px;padding:0 13px;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.running[data-v-8b88250e]{color:#b88412;font-weight:650;font-size:12px}.failed[data-v-8b88250e]{color:var(--md-error)}.done[data-v-8b88250e]{color:var(--md-success);font-weight:600;font-size:12px}.cancelled[data-v-8b88250e],.muted[data-v-8b88250e]{color:var(--md-on-surface-variant)}.muted[data-v-8b88250e]{font-size:12px;line-height:1.6}.error[data-v-8b88250e]{background:var(--md-error-container);color:#410e0b;padding:11px 16px;border-radius:12px;margin:8px 0;font-size:13px;overflow-wrap:anywhere}.transcript[data-v-8b88250e]{flex:1;overflow-y:auto;padding:26px 28px;min-height:0}.context-summary[data-v-8b88250e]{max-width:920px;margin:0 auto 22px;padding:14px 18px;border:1px dashed var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-low)}.context-summary-head[data-v-8b88250e]{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.context-summary-head strong[data-v-8b88250e]{font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--md-primary)}.context-summary-head time[data-v-8b88250e]{font-size:12px;opacity:.75}.welcome[data-v-8b88250e]{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}.welcome[data-v-8b88250e]:before{content:\"\";display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center}.welcome h2[data-v-8b88250e]{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}.welcome p[data-v-8b88250e]{margin:6px 0;font-size:14px}.turn[data-v-8b88250e]{max-width:920px;margin:0 auto 30px;display:flex;flex-direction:column;gap:10px}.bubble[data-v-8b88250e]{padding:15px 19px;font-size:14px}.bubble.user[data-v-8b88250e]{align-self:flex-end;max-width:82%;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:16px 16px 4px}.bubble.agent[data-v-8b88250e]{align-self:flex-start;max-width:100%;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:16px 16px 16px 4px;box-shadow:var(--shadow-1)}.bubble .message-head[data-v-8b88250e]{display:flex;align-items:center;gap:14px;margin-bottom:10px;font-size:12px}.bubble .message-head b[data-v-8b88250e]{font-weight:700}.bubble .message-head time[data-v-8b88250e]{margin-left:auto;opacity:.75;font-size:12px}.bubble .message-head span[data-v-8b88250e]{margin-left:auto}.bubble.user .message-head[data-v-8b88250e]{margin-bottom:7px;opacity:.85}.message-text[data-v-8b88250e]{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}.bubble.agent[data-v-8b88250e] p{margin:.4em 0}.bubble.agent[data-v-8b88250e] pre{max-height:420px}.agent-speech[data-v-8b88250e]{margin:6px 0;padding:2px 0;line-height:1.7}.model-annotation[data-v-8b88250e]{display:block;font-size:12px;opacity:.7;margin-bottom:4px;font-family:var(--code-font)}.think-chain[data-v-8b88250e]{margin:2px 0 8px;border:0;border-radius:10px;background:var(--md-surface-container-low);overflow:hidden}.think-chain>summary[data-v-8b88250e]{display:inline-flex;align-items:center;gap:5px;cursor:pointer;list-style:none;padding:3px 10px;font-size:11px;font-weight:600;letter-spacing:.03em;color:var(--md-on-surface-variant);user-select:none;border-radius:999px;background:var(--md-surface-container)}.think-chain>summary[data-v-8b88250e]::-webkit-details-marker{display:none}.think-chain>summary[data-v-8b88250e]:before{content:\"▸\";display:inline-block;transition:transform .15s}.think-chain[open]>summary[data-v-8b88250e]:before{transform:rotate(90deg)}.think-chain>pre[data-v-8b88250e]{margin:0;padding:6px 10px 8px;max-height:180px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--code-font);font-size:11.5px;line-height:1.55;color:var(--md-on-surface-variant)}.agent-speech[data-v-8b88250e] p{margin:.45em 0}.agent-speech[data-v-8b88250e] pre{background:var(--md-surface-container);border:1px solid var(--md-outline-variant);border-radius:10px;padding:12px 14px;max-height:460px;overflow:auto;font-size:13px}.agent-speech[data-v-8b88250e] code{font-family:var(--code-font)}.agent-speech[data-v-8b88250e] ul{padding-left:20px;margin:.4em 0}.steps[data-v-8b88250e]{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}.steps details[data-v-8b88250e]{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}.steps summary[data-v-8b88250e]{cursor:pointer;font-size:13px;font-weight:550}.steps summary small[data-v-8b88250e]{margin-left:10px;font-weight:600}.steps summary[data-v-8b88250e]::marker{color:var(--md-on-surface-variant)}.steps details pre[data-v-8b88250e]{margin:10px 0 0;font-family:var(--code-font);font-size:13px;white-space:pre-wrap;max-height:400px}pre[data-v-8b88250e]{max-height:450px;overflow:auto;font-family:var(--code-font)}.subagent-card[data-v-8b88250e]{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}button.subagent-card-head[data-v-8b88250e]{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;border-radius:0;background:transparent;padding:11px 14px;font-size:13px}button.subagent-card-head[data-v-8b88250e]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}button.subagent-card-head>span[data-v-8b88250e]:first-child{color:var(--md-primary)}button.subagent-card-head>strong[data-v-8b88250e]{font-weight:700}.subagent-prompt[data-v-8b88250e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--md-on-surface)}.subagent-card small[data-v-8b88250e]{font-weight:600}.subagent-chevron[data-v-8b88250e]{color:var(--md-on-surface-variant);font-size:12px}.subagent-card-error[data-v-8b88250e]{margin:0 10px 10px;padding:8px 12px;font-size:12px}.subagent-card.nested[data-v-8b88250e]{margin:6px 0;box-shadow:none}.sub-view[data-v-8b88250e]{max-width:900px;margin:0 auto}.sub-view-header[data-v-8b88250e]{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}.sub-view-header button[data-v-8b88250e]{flex-shrink:0;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.sub-view-header h3[data-v-8b88250e]{margin:0 0 4px;font-size:16px;font-weight:650}.sub-view-header p[data-v-8b88250e]{margin:0;max-width:520px}.sub-view-header>span[data-v-8b88250e]{margin-left:auto;font-weight:650;font-size:12px}.sub-view-body[data-v-8b88250e]{min-height:120px}.composer[data-v-8b88250e]{flex-shrink:0;margin:0 20px 18px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-lowest);overflow:visible;box-shadow:var(--shadow-1)}.composer-input[data-v-8b88250e]{position:relative}.composer-input textarea[data-v-8b88250e]{font-size:14px;width:100%;display:block;min-height:96px;padding:15px 112px 15px 16px;line-height:1.6;resize:vertical;border:0;border-radius:0;background:transparent}.composer-input textarea[data-v-8b88250e]:focus{box-shadow:none;border:0}.slash-menu[data-v-8b88250e]{position:fixed;z-index:10000;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:14px;box-shadow:var(--shadow-3);padding:6px;max-height:min(320px,42vh);overflow:auto}.slash-item[data-v-8b88250e]{display:flex;align-items:baseline;gap:10px;width:100%;text-align:left;padding:8px 10px;border:0;border-radius:10px;background:transparent;color:var(--md-on-surface);cursor:pointer}.slash-item.active[data-v-8b88250e]{background:var(--md-secondary-container)}.slash-name[data-v-8b88250e]{flex:none;font-family:var(--code-font);font-weight:650;font-size:13px;color:var(--md-primary)}.slash-desc[data-v-8b88250e]{font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.attach-chips[data-v-8b88250e]{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 16px 0}.composer-actions[data-v-8b88250e]{position:absolute;right:10px;bottom:10px;z-index:2;display:flex;align-items:center;gap:8px}.attach-fly[data-v-8b88250e]{width:42px;height:42px;flex:none;aspect-ratio:1/1;display:grid;place-items:center;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.attach-fly svg[data-v-8b88250e]{width:18px;height:18px}.attach-fly[data-v-8b88250e]:hover:not(:disabled){filter:brightness(1.05)}.attach-fly[data-v-8b88250e]:disabled{opacity:.5;cursor:default}.attach-chip[data-v-8b88250e]{display:inline-flex;align-items:center;gap:6px;max-width:220px;font-size:12px;padding:4px 6px 4px 10px;border-radius:999px;background:var(--md-surface-container);border:1px solid var(--md-outline-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.attach-chip button[data-v-8b88250e]{border:0;background:transparent;cursor:pointer;font-size:14px;line-height:1;padding:0 4px;color:var(--md-on-surface-variant)}.attach-chip button[data-v-8b88250e]:hover{color:var(--md-error)}.attach-error[data-v-8b88250e]{font-size:12px;color:var(--md-error)}.send-fly[data-v-8b88250e]{width:42px;height:42px;flex:none;aspect-ratio:1/1;display:grid;place-items:center;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-primary);color:var(--md-on-primary,#fff);box-shadow:0 2px 10px color-mix(in srgb,var(--md-primary) 38%,transparent)}.send-fly svg[data-v-8b88250e]{width:20px;height:20px}.send-fly[data-v-8b88250e]:hover:not(:disabled){filter:brightness(1.08)}.send-fly[data-v-8b88250e]:disabled{background:var(--md-surface-container);color:var(--md-on-surface-variant);opacity:.7;box-shadow:none}.send-fly.stop[data-v-8b88250e]{background:var(--md-error);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--md-error) 40%,transparent)}.compact-notice[data-v-8b88250e]{font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}.execution-options[data-v-8b88250e]{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}.execution-options label[data-v-8b88250e]{display:flex;flex-direction:column;gap:5px;font-size:12px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}.execution-options[data-v-8b88250e] .app-select-trigger,.execution-options .workspace-select[data-v-8b88250e]{width:100%;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}.workspace-select[data-v-8b88250e]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}.composer footer[data-v-8b88250e]{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap;border-top:1px solid var(--md-outline-variant)}.composer footer>select[data-v-8b88250e],.composer footer>.app-select[data-v-8b88250e]{font-size:13px;border-radius:10px;min-height:34px}.composer footer .muted[data-v-8b88250e]{flex:1;min-width:120px}.composer footer>button[data-v-8b88250e]{font-size:13px;font-weight:600;border-radius:9px;min-height:34px}.host-panel>strong[data-v-8b88250e]{font-size:14px}.host-panel dl[data-v-8b88250e]{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px}.host-panel dt[data-v-8b88250e]{color:var(--md-on-surface-variant);font-weight:600}.host-panel dd[data-v-8b88250e]{margin:4px 0 0;overflow-wrap:anywhere}.usage-rings[data-v-8b88250e]{display:flex;align-items:center;gap:24px;padding:14px 0;flex-wrap:wrap}.usage-metric[data-v-8b88250e]{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}.usage-ring[data-v-8b88250e]{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}.usage-ring b[data-v-8b88250e]{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:15px;font-weight:650;box-shadow:var(--shadow-1)}.new-folder[data-v-8b88250e]{display:flex;gap:8px}.new-folder input[data-v-8b88250e]{flex:1;min-width:0}.directory-backdrop[data-v-8b88250e]{position:fixed;inset:0;background:#14111acc;z-index:1000;display:grid;place-items:center;padding:20px}.directory-dialog[data-v-8b88250e]{background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:20px;padding:22px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh;box-shadow:var(--shadow-4)}.directory-dialog>header[data-v-8b88250e]{gap:12px}.directory-dialog>header h2[data-v-8b88250e]{font-size:16px;font-weight:650}.directory-list[data-v-8b88250e]{overflow:auto;min-height:180px;display:flex;flex-direction:column;gap:6px}.directory-list button[data-v-8b88250e]{text-align:left;border-radius:10px;background:var(--md-surface-container-low);font-size:13px}.directory-roots[data-v-8b88250e]{display:flex;gap:8px;flex-wrap:wrap}.directory-roots button[data-v-8b88250e]{border-radius:999px;font-size:12px;padding:6px 12px}.directory-dialog code[data-v-8b88250e]{overflow-wrap:anywhere;font-size:12px;background:var(--md-surface-container);padding:8px 10px;border-radius:8px}.directory-dialog>footer[data-v-8b88250e]{display:flex;justify-content:flex-end}.directory-dialog>footer button[data-v-8b88250e]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;font-weight:600}.permission-request[data-v-8b88250e]{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}.permission-request small[data-v-8b88250e]{display:block;margin:8px 0}.permission-request pre[data-v-8b88250e]{max-height:160px;overflow:auto}.permission-request>div[data-v-8b88250e]{display:flex;justify-content:flex-end;gap:8px}#app .workspace[data-v-8b88250e]{gap:12px;padding-left:6px;background:var(--md-surface-container)}#app .workspace .sessions[data-v-8b88250e]{width:296px;gap:14px;padding:18px 14px;border:0;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .workspace .sessions h1[data-v-8b88250e]{font-size:24px;font-weight:800;letter-spacing:-.02em}#app .workspace .sessions header>button[data-v-8b88250e]{height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 13px/1 inherit;display:inline-flex;align-items:center;gap:7px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .workspace .sessions header>button[data-v-8b88250e]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.06);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .sessions>input[data-v-8b88250e]{min-height:48px;padding:0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:14px}#app .workspace .sessions>input[data-v-8b88250e]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .workspace .filter-bar[data-v-8b88250e]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .workspace .filter-bar button[data-v-8b88250e]{border-radius:999px;padding:8px 4px;font-weight:600}#app .workspace .filter-bar button.chosen[data-v-8b88250e]{background:var(--md-primary);color:var(--md-on-primary,#fff);font-weight:700;box-shadow:var(--shadow-1)}#app .workspace .filter-bar button.chosen[data-v-8b88250e]:hover:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff)}#app .workspace .session-list[data-v-8b88250e]{margin:0 -2px;padding:0 2px}#app .workspace .session-card[data-v-8b88250e]{gap:5px;margin-bottom:8px;padding:13px 15px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:18px;background:var(--md-surface-container-lowest);transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .2s,border-color .2s,box-shadow .22s,border-radius .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .workspace .session-card[data-v-8b88250e]:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-1);border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant))}#app .workspace .session-card.selected[data-v-8b88250e]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent;border-radius:20px 20px 20px 7px;box-shadow:var(--shadow-1)}#app .workspace .session-card .origin[data-v-8b88250e]{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:12px;color:var(--md-primary)}#app .workspace .session-card.selected .origin[data-v-8b88250e]{color:var(--md-on-secondary-container);opacity:.75}#app .workspace .ledger-button[data-v-8b88250e]{min-height:44px;border-radius:16px;font-weight:650;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .ledger-button.chosen[data-v-8b88250e]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent}#app .workspace .ledger-entry[data-v-8b88250e]{border-radius:20px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-lowest);box-shadow:var(--shadow-1)}#app .workspace .conversation[data-v-8b88250e]{background:var(--md-surface);border-radius:30px;overflow:hidden;box-shadow:var(--shadow-1)}#app .workspace .conversation-header[data-v-8b88250e]{padding:20px 26px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .conversation-header h2[data-v-8b88250e]{font-size:20px;font-weight:750;letter-spacing:-.01em}#app .workspace .session-actions button[data-v-8b88250e]{height:36px;padding:0 15px;border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .session-actions button[data-v-8b88250e]:hover:not(:disabled){background:var(--md-surface-container-highest);box-shadow:none}#app .workspace .running[data-v-8b88250e]{color:#b88412;background:color-mix(in srgb,#B88412 14%,transparent);padding:4px 11px;border-radius:999px;font-weight:700}#app .workspace .transcript[data-v-8b88250e]{padding:28px 30px}#app .workspace .welcome[data-v-8b88250e]{margin:64px auto 0}#app .workspace .welcome[data-v-8b88250e]:before{width:76px;height:76px;border-radius:26px 26px 26px 10px;background-color:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24' fill='none' stroke='%235944c6' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-size:34px 34px}#app .workspace .welcome h2[data-v-8b88250e]{font-size:26px;font-weight:800;letter-spacing:-.02em}#app .workspace .turn[data-v-8b88250e]{gap:12px;margin-bottom:32px}#app .workspace .bubble[data-v-8b88250e]{padding:16px 20px;font-size:15px;line-height:1.7}#app .workspace .bubble.user[data-v-8b88250e]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px;box-shadow:var(--shadow-1);max-width:82%}#app .workspace .bubble.agent[data-v-8b88250e]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:8px 24px 24px;box-shadow:var(--shadow-1);max-width:100%}#app .workspace .bubble .message-head b[data-v-8b88250e]{font-weight:750}#app .workspace .steps[data-v-8b88250e]{gap:9px;margin:14px 0}#app .workspace .steps details[data-v-8b88250e]{border-radius:16px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);padding:11px 15px}#app .workspace .subagent-card[data-v-8b88250e]{border-radius:18px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);box-shadow:var(--shadow-1)}#app .workspace button.subagent-card-head[data-v-8b88250e]{padding:12px 15px}#app .workspace button.subagent-card-head[data-v-8b88250e]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .sub-view-header[data-v-8b88250e]{padding-bottom:16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .sub-view-header button[data-v-8b88250e]{border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .agent-speech[data-v-8b88250e] pre{border-radius:16px;background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}#app .workspace .composer[data-v-8b88250e]{margin:0 22px 20px;border-radius:28px;overflow:hidden;background:var(--md-surface-container-lowest);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);box-shadow:var(--shadow-2)}#app .workspace .composer[data-v-8b88250e]:focus-within{border-color:color-mix(in srgb,var(--md-primary) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent),var(--shadow-2)}#app .workspace .execution-options[data-v-8b88250e]{padding:12px 16px;gap:10px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .execution-options label[data-v-8b88250e]{font-weight:700;letter-spacing:.05em}#app .workspace .execution-options .workspace-select[data-v-8b88250e]{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .execution-options[data-v-8b88250e] .app-select-trigger,#app .workspace .composer footer[data-v-8b88250e] .app-select-trigger{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .composer-input textarea[data-v-8b88250e]{border-radius:0;background:transparent}#app .workspace .send-fly[data-v-8b88250e]{width:46px!important;height:46px!important;border-radius:50%!important;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .composer footer[data-v-8b88250e]{border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);padding:12px 16px}#app .workspace .composer footer>button[data-v-8b88250e]{border-radius:999px;min-height:36px;padding-inline:15px;background:var(--md-surface-container-high);border-color:transparent}#app .workspace .host-panel[data-v-8b88250e]{margin:0 22px 10px;border-radius:24px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .workspace .usage-ring b[data-v-8b88250e]{background:var(--md-surface-container-lowest)}#app .workspace .directory-dialog[data-v-8b88250e]{border-radius:32px;border-color:transparent;box-shadow:var(--shadow-4);background:var(--md-surface-container-low)}#app .workspace .directory-list button[data-v-8b88250e]{background:var(--md-surface-container-lowest);border-color:transparent;border-radius:16px;min-height:46px}#app .workspace .directory-list button[data-v-8b88250e]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .directory-roots button[data-v-8b88250e]{background:var(--md-surface-container-high);border-color:transparent}@media (max-width:800px){.sessions[data-v-8b88250e]{width:214px;padding:12px 10px}.transcript[data-v-8b88250e]{padding:14px}.composer[data-v-8b88250e]{margin:0 12px 12px}.composer footer .muted[data-v-8b88250e]{display:none}.conversation-header[data-v-8b88250e]{padding:14px 16px}.welcome[data-v-8b88250e]{margin:30px auto 0}.turn[data-v-8b88250e]{margin-bottom:22px}}@media (max-width:560px){.workspace[data-v-8b88250e]{flex-direction:column}.sessions[data-v-8b88250e]{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input[data-v-8b88250e],.filter-bar[data-v-8b88250e],.connection[data-v-8b88250e]{display:none}.session-list[data-v-8b88250e]{display:flex;gap:6px;overflow-x:auto}.session-card[data-v-8b88250e]{min-width:160px;width:160px;margin-bottom:0}.ledger-button[data-v-8b88250e]{padding:5px;font-size:12px}}\n";document.head.appendChild(s)}})();
