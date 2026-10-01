var xr = Object.defineProperty;
var Sr = (n, e, t) => e in n ? xr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var ne = (n, e, t) => Sr(n, typeof e != "symbol" ? e + "" : e, t);
import { reactive as Tr, defineComponent as qt, computed as G, openBlock as m, createElementBlock as b, ref as O, onMounted as fn, onUnmounted as gn, normalizeClass as oe, createElementVNode as o, toDisplayString as g, createCommentVNode as I, Fragment as se, renderList as ke, withModifiers as Me, watch as Te, nextTick as Qe, mergeProps as Ar, unref as ie, createBlock as Et, Teleport as Hn, createVNode as Be, Transition as Qs, withCtx as Js, normalizeStyle as Wt, withDirectives as dn, vModelText as Mn, withKeys as Ut, createTextVNode as Re, vModelCheckbox as Er } from "vue";
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
  let c = null, i = !1;
  function k(C) {
    C.reset && a.clear();
    for (const M of C.removed || []) a.delete(M);
    for (const M of C.tasks || []) a.set(M.task_id, M);
    r = C.cursor || "";
    const F = [...a.values()].sort((M, ue) => (ue.started_at || "").localeCompare(M.started_at || "") || M.task_id.localeCompare(ue.task_id));
    n.tasks = F.filter((M) => M.kind !== "agent_session"), n.sessions = F.filter((M) => M.kind === "agent_session");
  }
  function _() {
    c?.close(), i = !1, c = new EventSource(`/api/tasks/events?cursor=${encodeURIComponent(r)}`), c.onopen = () => {
      i = !0;
    }, c.onerror = () => {
      i = !1;
    }, c.addEventListener("tasks", (C) => {
      try {
        k(JSON.parse(C.data));
      } catch {
        i = !1;
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
      const F = await C.json();
      n.agents = F.agents || [], n.onlineCount = F.online_count ?? n.agents.length;
    } catch (C) {
      n.error = C.message || "failed";
    }
    if (!i)
      try {
        const C = await fetch(`/api/tasks?incremental=1&cursor=${encodeURIComponent(r)}`, { signal: AbortSignal.timeout(8e3) });
        if (!C.ok) throw new Error(`任务记录 HTTP ${C.status}`);
        const F = await C.json();
        k(F);
      } catch (C) {
        n.error = C.message || "无法刷新任务记录";
      }
    n.loading = !1;
  }
  function N() {
    S().then(() => {
      e && _();
    }), e && clearInterval(e), e = setInterval(() => {
      !document.hidden && !t && S();
    }, 2e3);
  }
  function U() {
    c?.close(), c = null, i = !1, e && (clearInterval(e), e = null);
  }
  function L(C) {
    return !C.missing_dependencies?.length && (C.status === "PLUGIN_STATUS_HEALTHY" || C.status === "HEALTHY");
  }
  async function K(C) {
    const F = await fetch("/api/agent/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: C }) });
    if (!F.ok) throw new Error(await F.text());
    const M = await F.json();
    return await S(), M.session_id;
  }
  async function z(C, F, M) {
    const ue = await fetch("/api/agent/sessions", { method: F === "delete" ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: C, action: F, title: M }) });
    if (!ue.ok) throw new Error(await ue.text());
    await S();
  }
  async function Y(C, F, M, ue = {}) {
    const ce = await fetch("/api/agent/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: C, prompt: F, agent_type: M, ...ue }) }), B = await ce.text();
    if (await S(), !ce.ok) {
      let y = B;
      try {
        y = JSON.parse(B).message || B;
      } catch {
      }
      throw new Error(y);
    }
  }
  async function le(C) {
    const F = await fetch("/api/tasks/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: C }) });
    if (!F.ok) throw new Error(await F.text());
    const M = await F.json();
    if (!M.success) throw new Error(M.message);
    await S();
  }
  return Object.assign(n, {
    fetchAgents: S,
    connect: N,
    disconnect: U,
    isHealthy: L,
    createSession: K,
    manageSession: z,
    sendTask: Y,
    cancelTask: le
  });
}
const $r = Rr();
function Cr() {
  return $r;
}
function os() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var $t = os();
function er(n) {
  $t = n;
}
var At = { exec: () => null };
function Bt(n) {
  let e = [];
  return (t) => {
    let s = Math.max(0, Math.min(3, t - 1)), r = e[s];
    return r || (r = n(s), e[s] = r), r;
  };
}
function H(n, e = "") {
  let t = typeof n == "string" ? n : n.source, s = { replace: (r, a) => {
    let c = typeof a == "string" ? a : a.source;
    return c = c.replace(we.caret, "$1"), t = t.replace(r, c), s;
  }, getRegex: () => new RegExp(t, e) };
  return s;
}
var Lr = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), we = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: Bt((n) => new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: Bt((n) => new RegExp(`^ {0,${n}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: Bt((n) => new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)), headingBeginRegex: Bt((n) => new RegExp(`^ {0,${n}}#`)), htmlBeginRegex: Bt((n) => new RegExp(`^ {0,${n}}(?:</?(?:${vn})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: Bt((n) => new RegExp(`^ {0,${n}}>`)) }, Ir = /^(?:[ \t]*(?:\n|$))+/, Or = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Pr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, mn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Dr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, is = / {0,3}(?:[*+-]|\d{1,9}[.)])/, tr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, nr = H(tr).replace(/bull/g, is).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Nr = H(tr).replace(/bull/g, is).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), us = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Mr = /^[^\n]+/, cs = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, zr = H(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", cs).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Fr = H(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, is).getRegex(), vn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", ds = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ur = H("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", ds).replace("tag", vn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), sr = (n) => H(us).replace("hr", mn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", n).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", vn).getRegex(), Br = sr(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), Hr = sr(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), jr = H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Hr).getRegex(), ps = { blockquote: jr, code: Or, def: zr, fences: Pr, heading: Dr, hr: mn, html: Ur, lheading: nr, list: Fr, newline: Ir, paragraph: Br, table: At, text: Mr }, As = H("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", mn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", vn).getRegex(), Wr = { ...ps, lheading: Nr, table: As, paragraph: H(us).replace("hr", mn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", As).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", vn).getRegex() }, Vr = { ...ps, html: H(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", ds).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: At, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: H(us).replace("hr", mn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", nr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, qr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, rr = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, Yr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, lt = /[\p{P}\p{S}]/u, Gt = /[\s\p{P}\p{S}]/u, kn = /[^\s\p{P}\p{S}]/u, Zr = H(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Gt).getRegex(), Kr = /[\p{Pi}\p{Ps}"']/u, lr = /(?!~)[\p{P}\p{S}]/u, Xr = /(?!~)[\s\p{P}\p{S}]/u, Qr = /(?:[^\s\p{P}\p{S}]|~)/u, Jr = H(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Lr ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ar = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, el = H(ar, "u").replace(/punct/g, lt).getRegex(), tl = H(ar, "u").replace(/punct/g, lr).getRegex(), nl = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, sl = H(nl, "u").replace(/openQuote/g, Kr).replace(/punct/g, lt).getRegex(), or = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", rl = H(or, "gu").replace(/notPunctSpace/g, kn).replace(/punctSpace/g, Gt).replace(/punct/g, lt).getRegex(), ll = H(or, "gu").replace(/notPunctSpace/g, Qr).replace(/punctSpace/g, Xr).replace(/punct/g, lr).getRegex(), al = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", ol = H(al, "gu").replace(/notPunctSpace/g, kn).replace(/punctSpace/g, Gt).replace(/punct/g, lt).getRegex(), il = H("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, kn).replace(/punctSpace/g, Gt).replace(/punct/g, lt).getRegex(), ul = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", cl = H(ul, "gu").replace(/notPunctSpace/g, kn).replace(/punctSpace/g, Gt).replace(/punct/g, lt).getRegex(), dl = H(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, lt).getRegex(), pl = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", hl = H(pl, "gu").replace(/notPunctSpace/g, kn).replace(/punctSpace/g, Gt).replace(/punct/g, lt).getRegex(), fl = H(/\\(punct)/, "gu").replace(/punct/g, lt).getRegex(), gl = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ml = H(ds).replace("(?:-->|$)", "-->").getRegex(), vl = H("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ml).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ir = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, zn = H(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", ir).getRegex(), kl = H(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", zn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), bl = H(/^!?\[(label)\]\[(ref)\]/).replace("label", zn).replace("ref", cs).getRegex(), yl = H(/^!?\[(ref)\](?:\[\])?/).replace("ref", cs).getRegex(), Es = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, _l = H(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", ir).getRegex(), wl = H("reflink|nolink(?!\\()", "g").replace("reflink", H(/^!?\[(label)\]\[(ref)\]/).replace("label", _l).replace("ref", Es).getRegex()).replace("nolink", H(/^!?\[(ref)\](?:\[\])?/).replace("ref", Es).getRegex()).getRegex(), Rs = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, xl = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/, Sl = H(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, xl).getRegex(), hs = { _backpedal: At, anyPunctuation: fl, autolink: gl, blockSkip: Jr, br: rr, code: Gr, del: At, delLDelim: At, delRDelim: At, emStrongLDelim: el, emStrongRDelimAst: rl, emStrongRDelimUnd: il, escape: qr, link: kl, nolink: yl, punctuation: Zr, reflink: bl, reflinkSearch: wl, tag: vl, text: Yr, url: At }, Tl = { ...hs, emStrongLDelim: sl, emStrongRDelimAst: ol, emStrongRDelimUnd: cl, link: H(/^!?\[(label)\]\((.*?)\)/).replace("label", zn).getRegex(), reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", zn).getRegex() }, ns = { ...hs, emStrongRDelimAst: ll, emStrongLDelim: tl, delLDelim: dl, delRDelim: hl, url: H(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Sl).replace("protocol", Rs).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: H(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", Rs).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() }, Al = { ...ns, br: H(rr).replace("{2,}", "*").getRegex(), text: H(ns.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, On = { normal: ps, gfm: Wr, pedantic: Vr }, ln = { normal: hs, gfm: ns, breaks: Al, pedantic: Tl }, El = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, $s = (n) => El[n];
function De(n, e) {
  if (e) {
    if (we.escapeTest.test(n)) return n.replace(we.escapeReplace, $s);
  } else if (we.escapeTestNoEncode.test(n)) return n.replace(we.escapeReplaceNoEncode, $s);
  return n;
}
function Rl(n) {
  return n.replace(we.numericCharacterReference, (e, t, s) => {
    let r = t === void 0 ? Number.parseInt(s, 16) : Number.parseInt(t, 10);
    return r === 0 || r > 1114111 || r >= 55296 && r <= 57343 ? "�" : String.fromCodePoint(r);
  });
}
function Cs(n) {
  try {
    n = encodeURI(n).replace(we.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function Ls(n, e) {
  let t = n.replace(we.findPipe, (a, c, i) => {
    let k = !1, _ = c;
    for (; --_ >= 0 && i[_] === "\\"; ) k = !k;
    return k ? "|" : " |";
  }), s = t.split(we.splitPipe), r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; r < s.length; r++) s[r] = s[r].trim().replace(we.slashPipe, "|");
  return s;
}
function pt(n, e, t) {
  let s = n.length;
  if (s === 0) return "";
  let r = 0;
  for (; r < s && n.charAt(s - r - 1) === e; )
    r++;
  return n.slice(0, s - r);
}
function Is(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && we.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function Fn(n) {
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
function Os(n, e = 0) {
  let t = e, s = "";
  for (let r of n) if (r === "	") {
    let a = 4 - t % 4;
    s += " ".repeat(a), t += a;
  } else s += r, t++;
  return s;
}
function Ps(n, e, t, s, r) {
  let a = e.href, c = e.title || null, i = n[1].replace(r.other.outputLinkReplace, "$1"), k = n[0].charAt(0) === "!";
  s.state.inLink = !0;
  let _ = s.state.linkEmitted, S = s.state.inRawBlock;
  s.state.linkEmitted = !1;
  let E = s.inlineTokens(i), N = s.state.linkEmitted;
  if (s.state.linkEmitted = _, s.state.inLink = !1, !k) {
    if (N) {
      s.state.inRawBlock = S;
      return;
    }
    s.state.linkEmitted = !0;
  }
  return { type: k ? "image" : "link", raw: t, href: a, title: c, text: i, tokens: E };
}
function Cl(n, e, t) {
  let s = n.match(t.other.indentCodeCompensation);
  if (s === null) return e;
  let r = s[1];
  return e.split(`
`).map((a) => {
    let c = a.match(t.other.beginningSpace);
    if (c === null) return a;
    let [i] = c;
    return a.slice(Math.min(i.length, r.length));
  }).join(`
`);
}
function Ds(n, e, t, s) {
  if (!e.includes("<")) return !1;
  for (let r = 0; r < e.length; r++) {
    if (e[r] === "\\") {
      r++;
      continue;
    }
    if (e[r] === "`") {
      let i = s.inline.code.exec(e.slice(r));
      if (i) {
        r += i[0].length - 1;
        continue;
      }
    }
    if (e[r] !== "<") continue;
    let a = n.slice(t + r), c = s.inline.tag.exec(a) || s.inline.autolink.exec(a);
    if (c) {
      if (c[0].length > e.length - r) return !0;
      r += c[0].length - 1;
    }
  }
  return !1;
}
var Un = class {
  constructor(n) {
    ne(this, "options");
    ne(this, "rules");
    ne(this, "lexer");
    this.options = n || $t;
  }
  space(n) {
    let e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(n) {
    let e = this.rules.block.code.exec(n);
    if (e) {
      let t = this.options.pedantic ? e[0] : Is(e[0]), s = t.replace(this.rules.other.codeRemoveIndent, "");
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
        let s = pt(t, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceTabChar.test(s)) && (t = s.trim());
      }
      return { type: "heading", raw: pt(e[0], `
`), depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(n) {
    let e = this.rules.block.hr.exec(n);
    if (e) return { type: "hr", raw: pt(e[0], `
`) };
  }
  blockquote(n) {
    let e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = pt(e[0], `
`).split(`
`), s = "", r = "", a = [];
      for (; t.length > 0; ) {
        let c = !1, i = [], k;
        for (k = 0; k < t.length; k++) if (this.rules.other.blockquoteStart.test(t[k])) i.push(t[k]), c = !0;
        else if (!c) i.push(t[k]);
        else break;
        t = t.slice(k);
        let _ = i.join(`
`), S = _.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${_}` : _, r = r ? `${r}
${S}` : S;
        let E = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(S, a, !0), this.lexer.state.top = E, t.length === 0) break;
        let N = a.at(-1);
        if (N?.type === "code") break;
        if (N?.type === "blockquote") {
          let U = N, L = t.join(`
`), K = U.raw + `
` + L.replace(this.rules.other.blockquoteSetextReplace2, ""), z = this.blockquote(K);
          a[a.length - 1] = z;
          let Y = K.substring(z.raw.length).replace(/^\n/, ""), le = Y ? Y.split(`
`).length : 0, C = le ? t.slice(0, -le) : t;
          C.length > 0 && (s = `${s}
${C.join(`
`)}`), r = r.substring(0, r.length - U.text.length) + z.text;
          break;
        } else if (N?.type === "list") {
          let U = N, L = U.raw + `
` + t.join(`
`), K = this.list(L);
          a[a.length - 1] = K, s = s.substring(0, s.length - N.raw.length) + K.raw, r = r.substring(0, r.length - U.raw.length) + K.raw, t = L.substring(a.at(-1).raw.length).split(`
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
      let a = this.rules.other.listItemRegex(t), c = !1;
      for (; n; ) {
        let k = !1, _ = "", S = "";
        if (!(e = a.exec(n)) || this.rules.block.hr.test(n)) break;
        _ = e[0], n = n.substring(_.length);
        let E = e[2].split(`
`, 1)[0], N = e[1].length, U = this.options.pedantic ? Os(E, N) : E.replace(this.rules.other.leadingSpaceTab, (Y) => Os(Y, N)), L = n.split(`
`, 1)[0], K = !U.trim(), z = 0;
        if (this.options.pedantic ? (z = 2, S = U.trimStart()) : K ? z = N + 1 : (z = U.search(this.rules.other.nonSpaceChar), z = z > 4 ? 1 : z, S = U.slice(z), z += N), K && this.rules.other.blankLine.test(L) && (_ += L + `
`, n = n.substring(L.length + 1), k = !0), !k) {
          let Y = this.rules.other.nextBulletRegex(z), le = this.rules.other.hrRegex(z), C = this.rules.other.fencesBeginRegex(z), F = this.rules.other.headingBeginRegex(z), M = this.rules.other.htmlBeginRegex(z), ue = this.rules.other.blockquoteBeginRegex(z);
          for (; n; ) {
            let ce = n.split(`
`, 1)[0], B;
            if (L = ce, this.options.pedantic ? (L = L.replace(this.rules.other.listReplaceNesting, "  "), B = L) : B = L.replace(this.rules.other.leadingSpaceTab, (y) => y.replace(this.rules.other.tabCharGlobal, "    ")), C.test(L) || F.test(L) || M.test(L) || ue.test(L) || Y.test(L) || le.test(L)) break;
            if (B.search(this.rules.other.nonSpaceChar) >= z || !L.trim()) S += `
` + B.slice(z);
            else {
              if (K || U.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || C.test(U) || F.test(U) || le.test(U)) break;
              S += `
` + L;
            }
            K = !L.trim(), _ += ce + `
`, n = n.substring(ce.length + 1), U = B.slice(z);
          }
        }
        r.loose || (c ? r.loose = !0 : this.rules.other.doubleBlankLine.test(_) && (c = !0)), r.items.push({ type: "list_item", raw: _, task: !!this.options.gfm && this.rules.other.listIsTask.test(S), loose: !1, text: S, tokens: [] }), r.raw += _;
      }
      let i = r.items.at(-1);
      if (i) i.raw = i.raw.trimEnd(), i.text = i.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let k of r.items) if (this.lexer.state.top = !1, k.tokens = this.lexer.blockTokens(k.text, []), !r.loose) {
        let _ = k.tokens.filter((E) => E.type === "space"), S = _.length > 0 && _.some((E) => this.rules.other.anyLine.test(E.raw));
        r.loose = S;
      }
      for (let k of r.items) {
        let _ = k.tokens[0];
        if (k.task && (_?.type === "text" || _?.type === "paragraph")) {
          k.text = k.text.replace(this.rules.other.listReplaceTask, ""), _.raw = _.raw.replace(this.rules.other.listReplaceTask, ""), _.text = _.text.replace(this.rules.other.listReplaceTask, "");
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
        for (let _ of k.tokens) _.type === "text" && (_.type = "paragraph");
      }
      return r;
    }
  }
  html(n) {
    let e = this.rules.block.html.exec(n);
    if (e) {
      let t = Is(e[0]);
      return { type: "html", block: !0, raw: t, pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: t };
    }
  }
  def(n) {
    let e = this.rules.block.def.exec(n);
    if (e) {
      let t = Fn(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: pt(e[0], `
`), href: s, title: r };
    }
  }
  table(n) {
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = Ls(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: pt(e[0], `
`), header: [], align: [], rows: [] };
    if (t.length === s.length) {
      for (let c of s) this.rules.other.tableAlignRight.test(c) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(c) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(c) ? a.align.push("left") : a.align.push(null);
      for (let c = 0; c < t.length; c++) a.header.push({ text: t[c], tokens: this.lexer.inline(t[c]), header: !0, align: a.align[c] });
      for (let c of r) a.rows.push(Ls(c, a.header.length).map((i, k) => ({ text: i, tokens: this.lexer.inline(i), header: !1, align: a.align[k] })));
      return a;
    }
  }
  lheading(n) {
    let e = this.rules.block.lheading.exec(n);
    if (e) {
      let t = e[1].trim();
      return { type: "heading", raw: pt(e[0], `
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
      if (!this.options.pedantic && Ds(n, e[1], t, this.rules)) return;
      let s = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(s)) {
        if (!this.rules.other.endAngleBracket.test(s)) return;
        let c = pt(s.slice(0, -1), "\\");
        if ((s.length - c.length) % 2 === 0) return;
      } else {
        let c = $l(e[2], "()");
        if (c === -2) return;
        if (c > -1) {
          let i = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + c;
          e[2] = e[2].substring(0, c), e[0] = e[0].substring(0, i).trim(), e[3] = "";
        }
      }
      let r = e[2], a = "";
      if (this.options.pedantic) {
        let c = this.rules.other.pedanticHrefTitle.exec(r);
        c && (r = c[1], a = c[3]);
      } else a = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(s) ? r = r.slice(1) : r = r.slice(1, -1)), Ps(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: a && a.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      let s = t[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Ds(n, t[1], s, this.rules)) return;
      let r = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), a = e[Fn(r)];
      if (!a) {
        let c = t[0].charAt(0);
        return { type: "text", raw: c, text: c };
      }
      return Ps(t, a, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let s = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!s || !s[1] && !s[2] && !s[3] && !s[4] || s[4] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[3]) || !t || this.rules.inline.punctuation.exec(t))) {
      let r = [...s[0]].length - 1, a, c, i = r, k = 0, _ = s[0][0], S = t === _, E = _ === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (E.lastIndex = 0, e = e.slice(-1 * n.length + r); (s = E.exec(e)) !== null; ) {
        if (a = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !a) continue;
        if (c = [...a].length, s[3] || s[4]) {
          i += c;
          continue;
        } else if (s[5] || s[6]) {
          if (r % 3 && !((r + c) % 3)) {
            k += c;
            continue;
          }
          if (S) break;
        }
        if (i -= c, i > 0) continue;
        c = Math.min(c, c + i + k);
        let N = [...s[0]][0].length, U = n.slice(0, r + s.index + N + c);
        if (Math.min(r, c) % 2) {
          let K = U.slice(1, -1);
          return { type: "em", raw: U, text: K, tokens: this.lexer.inlineTokens(K) };
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
      let r = [...s[0]].length - 1, a, c, i = r, k = this.rules.inline.delRDelim;
      for (k.lastIndex = 0, e = e.slice(-1 * n.length + r); (s = k.exec(e)) !== null; ) {
        if (a = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !a || (c = [...a].length, c !== r)) continue;
        if (s[3] || s[4]) {
          i += c;
          continue;
        }
        if (i -= c, i > 0) continue;
        c = Math.min(c, c + i);
        let _ = [...s[0]][0].length, S = n.slice(0, r + s.index + _ + c), E = S.slice(r, -r);
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
}, Ve = class ss {
  constructor(e) {
    ne(this, "tokens");
    ne(this, "options");
    ne(this, "state");
    ne(this, "inlineQueue");
    ne(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || $t, this.options.tokenizer = this.options.tokenizer || new Un(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, linkEmitted: !1, top: !0 };
    let t = { other: we, block: On.normal, inline: ln.normal };
    this.options.pedantic ? (t.block = On.pedantic, t.inline = ln.pedantic) : this.options.gfm && (t.block = On.gfm, this.options.breaks ? t.inline = ln.breaks : t.inline = ln.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: On, inline: ln };
  }
  static lex(e, t) {
    return new ss(t).lex(e);
  }
  static lexInline(e, t) {
    return new ss(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(we.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let s = this.inlineQueue[t];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], s = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(we.tabCharGlobal, "    ").replace(we.spaceLine, ""));
    let r = 1 / 0;
    for (; e; ) {
      if (e.length < r) r = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      let a;
      if (this.options.extensions?.block?.some((i) => (a = i.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), !0) : !1)) continue;
      if (a = this.tokenizer.space(e)) {
        e = e.substring(a.raw.length);
        let i = t.at(-1);
        a.raw.length === 1 && i !== void 0 ? i.raw += `
` : t.push(a);
        continue;
      }
      if (a = this.tokenizer.code(e)) {
        e = e.substring(a.raw.length);
        let i = t.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + a.raw, i.text += `
` + a.text, this.inlineQueue.at(-1).src = i.text) : t.push(a);
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
        let i = t.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + a.raw, i.text += `
` + a.raw, this.inlineQueue.at(-1).src = i.text) : this.tokens.links[a.tag] || (this.tokens.links[a.tag] = { href: a.href, title: a.title }, t.push(a));
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
      let c = e;
      if (this.options.extensions?.startBlock) {
        let i = 1 / 0, k = e.slice(1), _;
        this.options.extensions.startBlock.forEach((S) => {
          _ = S.call({ lexer: this }, k), typeof _ == "number" && _ >= 0 && (i = Math.min(i, _));
        }), i < 1 / 0 && i >= 0 && (c = e.substring(0, i + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(c))) {
        let i = t.at(-1);
        s && i?.type === "paragraph" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + a.raw, i.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : t.push(a), s = c.length !== e.length, e = e.substring(a.raw.length);
        continue;
      }
      if (a = this.tokenizer.text(e)) {
        e = e.substring(a.raw.length);
        let i = t.at(-1);
        i?.type === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + a.raw, i.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : t.push(a);
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
      if (!(r.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, Fn(r.slice(a + 1, -1)))) && !(a > 1 && this.linkInText(r.slice(1, a - 1)))) return !0;
    }
    return !1;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let s = e;
    if (this.tokens.links && e.includes("[")) {
      let i = this.tokenizer.rules.inline.reflinkSearch, k = (_) => {
        let S = _.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, Fn(_.slice(S + 1, -1)))) return _;
        if (S > 1 && _.charAt(0) !== "!") {
          let E = _.slice(1, S - 1);
          if (this.linkInText(E)) return "[" + E.replace(i, k) + "][" + "a".repeat(_.length - S - 2) + "]";
        }
        return "[" + "a".repeat(_.length - 2) + "]";
      };
      s = s.replace(i, k);
    }
    s = s.replace(this.tokenizer.rules.inline.anyPunctuation, (i) => "+".repeat(i.length)), s = s.replace(this.tokenizer.rules.inline.blockSkip, (i, k, _) => {
      let S = _ ? _.length : 0;
      return i.slice(0, S) + "[" + "a".repeat(i.length - S - 2) + "]";
    }), s = this.options.hooks?.emStrongMask?.call({ lexer: this }, s) ?? s;
    let r = !1, a = "", c = 1 / 0;
    for (; e; ) {
      if (e.length < c) c = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      r || (a = ""), r = !1;
      let i;
      if (this.options.extensions?.inline?.some((_) => (i = _.call({ lexer: this }, e, t)) ? (e = e.substring(i.raw.length), t.push(i), !0) : !1)) continue;
      if (i = this.tokenizer.escape(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.tag(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.link(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(i.raw.length);
        let _ = t.at(-1);
        i.type === "text" && _?.type === "text" ? (_.raw += i.raw, _.text += i.text) : t.push(i);
        continue;
      }
      if (i = this.tokenizer.emStrong(e, s, a)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.codespan(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.br(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.del(e, s, a)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (i = this.tokenizer.autolink(e)) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      if (!this.state.inLink && (i = this.tokenizer.url(e))) {
        e = e.substring(i.raw.length), t.push(i);
        continue;
      }
      let k = e;
      if (this.options.extensions?.startInline) {
        let _ = 1 / 0, S = e.slice(1), E;
        this.options.extensions.startInline.forEach((N) => {
          E = N.call({ lexer: this }, S), typeof E == "number" && E >= 0 && (_ = Math.min(_, E));
        }), _ < 1 / 0 && _ >= 0 && (k = e.substring(0, _ + 1));
      }
      if (i = this.tokenizer.inlineText(k)) {
        e = e.substring(i.raw.length), i.raw.slice(-1) !== "_" && (a = i.raw.slice(-1)), r = !0;
        let _ = t.at(-1);
        _?.type === "text" ? (_.raw += i.raw, _.text += i.text) : t.push(i);
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
}, Bn = class {
  constructor(n) {
    ne(this, "options");
    ne(this, "parser");
    this.options = n || $t;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    let s = (e || "").match(we.notSpaceStart)?.[0], r = n ? n.replace(we.endingNewline, "") + `
` : "";
    return s ? '<pre><code class="language-' + De(s) + '">' + (t ? r : De(r, !0)) + `</code></pre>
` : "<pre><code>" + (t ? r : De(r, !0)) + `</code></pre>
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
    for (let c = 0; c < n.items.length; c++) {
      let i = n.items[c];
      s += this.listitem(i);
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
      for (let c = 0; c < a.length; c++) t += this.tablecell(a[c]);
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
    return `<code>${De(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, text: t, tokens: s, autolink: r }) {
    let a = r ? De(t, !0) : this.parser.parseInline(s), c = Cs(n);
    if (c === null) return a;
    n = De(c, r);
    let i = '<a href="' + n + '"';
    return e && (i += ' title="' + De(e) + '"'), i += ">" + a + "</a>", i;
  }
  image({ href: n, title: e, text: t, tokens: s }) {
    s && (t = this.parser.parseInline(s, this.parser.textRenderer));
    let r = Cs(n);
    if (r === null) return De(t);
    n = r;
    let a = `<img src="${De(n)}" alt="${De(t)}"`;
    return e && (a += ` title="${De(e)}"`), a += ">", a;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : De(n.text);
  }
}, fs = class {
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
}, qe = class rs {
  constructor(e) {
    ne(this, "options");
    ne(this, "renderer");
    ne(this, "textRenderer");
    this.options = e || $t, this.options.renderer = this.options.renderer || new Bn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new fs();
  }
  static parse(e, t) {
    return new rs(t).parse(e);
  }
  static parseInline(e, t) {
    return new rs(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (this.options.extensions?.renderers?.[r.type]) {
        let c = r, i = this.options.extensions.renderers[c.type].call({ parser: this }, c);
        if (i !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(c.type)) {
          t += i || "";
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
          let c = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
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
        let i = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (i !== !1 || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          s += i || "";
          continue;
        }
      }
      let c = a;
      switch (c.type) {
        case "escape": {
          s += t.text(c);
          break;
        }
        case "html": {
          s += t.html(c);
          break;
        }
        case "link": {
          s += t.link(c);
          break;
        }
        case "image": {
          s += t.image(c);
          break;
        }
        case "checkbox": {
          s += t.checkbox(c);
          break;
        }
        case "strong": {
          s += t.strong(c);
          break;
        }
        case "em": {
          s += t.em(c);
          break;
        }
        case "codespan": {
          s += t.codespan(c);
          break;
        }
        case "br": {
          s += t.br(c);
          break;
        }
        case "del": {
          s += t.del(c);
          break;
        }
        case "text": {
          s += t.text(c);
          break;
        }
        default: {
          let i = 'Token with "' + c.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return s;
  }
}, Nn, pn = (Nn = class {
  constructor(n) {
    ne(this, "options");
    ne(this, "block");
    this.options = n || $t;
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
    return n ? Ve.lex : Ve.lexInline;
  }
  provideParser(n = this.block) {
    return n ? qe.parse : qe.parseInline;
  }
}, ne(Nn, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), ne(Nn, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), Nn), Ll = class {
  constructor(...n) {
    ne(this, "defaults", os());
    ne(this, "options", this.setOptions);
    ne(this, "parse", this.parseMarkdown(!0));
    ne(this, "parseInline", this.parseMarkdown(!1));
    ne(this, "Parser", qe);
    ne(this, "Renderer", Bn);
    ne(this, "TextRenderer", fs);
    ne(this, "Lexer", Ve);
    ne(this, "Tokenizer", Un);
    ne(this, "Hooks", pn);
    this.use(...n);
  }
  walkTokens(n, e) {
    let t = [];
    for (let s of n) switch (t = t.concat(e.call(this, s)), s.type) {
      case "table": {
        let r = s;
        for (let a of r.header) t = t.concat(this.walkTokens(a.tokens, e));
        for (let a of r.rows) for (let c of a) t = t.concat(this.walkTokens(c.tokens, e));
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
          let c = r[a].flat(1 / 0);
          t = t.concat(this.walkTokens(c, e));
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
          a ? e.renderers[r.name] = function(...c) {
            let i = r.renderer.apply(this, c);
            return i === !1 && (i = a.apply(this, c)), i;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = e[r.level];
          a ? a.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), s.extensions = e), t.renderer) {
        let r = this.defaults.renderer || new Bn(this.defaults);
        for (let a in t.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let c = a, i = t.renderer[c], k = r[c];
          r[c] = (..._) => {
            let S = i.apply(r, _);
            return S === !1 && (S = k.apply(r, _)), S || "";
          };
        }
        s.renderer = r;
      }
      if (t.tokenizer) {
        let r = this.defaults.tokenizer || new Un(this.defaults);
        for (let a in t.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let c = a, i = t.tokenizer[c], k = r[c];
          r[c] = (..._) => {
            let S = i.apply(r, _);
            return S === !1 && (S = k.apply(r, _)), S;
          };
        }
        s.tokenizer = r;
      }
      if (t.hooks) {
        let r = this.defaults.hooks || new pn();
        for (let a in t.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let c = a, i = t.hooks[c], k = r[c];
          pn.passThroughHooks.has(a) ? r[c] = (_) => {
            if (this.defaults.async && pn.passThroughHooksRespectAsync.has(a)) return (async () => {
              let E = await i.call(r, _);
              return k.call(r, E);
            })();
            let S = i.call(r, _);
            return k.call(r, S);
          } : r[c] = (..._) => {
            if (this.defaults.async) return (async () => {
              let E = await i.apply(r, _);
              return E === !1 && (E = await k.apply(r, _)), E;
            })();
            let S = i.apply(r, _);
            return S === !1 && (S = k.apply(r, _)), S;
          };
        }
        s.hooks = r;
      }
      if (t.walkTokens) {
        let r = this.defaults.walkTokens, a = t.walkTokens;
        s.walkTokens = function(c) {
          let i = [];
          return i.push(a.call(this, c)), r && (i = i.concat(r.call(this, c))), i;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return Ve.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return qe.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let s = { ...t }, r = { ...this.defaults, ...s }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = n), r.async) return (async () => {
        let c = r.hooks ? await r.hooks.preprocess(e) : e, i = await (r.hooks ? await r.hooks.provideLexer(n) : n ? Ve.lex : Ve.lexInline)(c, r), k = r.hooks ? await r.hooks.processAllTokens(i) : i;
        r.walkTokens && await Promise.all(this.walkTokens(k, r.walkTokens));
        let _ = await (r.hooks ? await r.hooks.provideParser(n) : n ? qe.parse : qe.parseInline)(k, r);
        return r.hooks ? await r.hooks.postprocess(_) : _;
      })().catch(a);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let c = (r.hooks ? r.hooks.provideLexer(n) : n ? Ve.lex : Ve.lexInline)(e, r);
        r.hooks && (c = r.hooks.processAllTokens(c)), r.walkTokens && this.walkTokens(c, r.walkTokens);
        let i = (r.hooks ? r.hooks.provideParser(n) : n ? qe.parse : qe.parseInline)(c, r);
        return r.hooks && (i = r.hooks.postprocess(i)), i;
      } catch (c) {
        return a(c);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        let s = "<p>An error occurred:</p><pre>" + De(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, Rt = new Ll();
function re(n, e) {
  return Rt.parse(n, e);
}
re.options = re.setOptions = function(n) {
  return Rt.setOptions(n), re.defaults = Rt.defaults, er(re.defaults), re;
};
re.getDefaults = os;
re.defaults = $t;
function Il(...n) {
  return Rt.use(...n), re.defaults = Rt.defaults, er(re.defaults), re;
}
re.use = Il;
re.walkTokens = function(n, e) {
  return Rt.walkTokens(n, e);
};
re.parseInline = Rt.parseInline;
re.Parser = qe;
re.parser = qe.parse;
re.Renderer = Bn;
re.TextRenderer = fs;
re.Lexer = Ve;
re.lexer = Ve.lex;
re.Tokenizer = Un;
re.Hooks = pn;
re.parse = re;
re.options;
re.setOptions;
re.walkTokens;
re.parseInline;
qe.parse;
Ve.lex;
/*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE */
function Ns(n, e) {
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
    var s, r, a, c, i = [], k = !0, _ = !1;
    try {
      if (a = (t = t.call(n)).next, e !== 0) for (; !(k = (s = a.call(t)).done) && (i.push(s.value), i.length !== e); k = !0) ;
    } catch (S) {
      _ = !0, r = S;
    } finally {
      try {
        if (!k && t.return != null && (c = t.return(), Object(c) !== c)) return;
      } finally {
        if (_) throw r;
      }
    }
    return i;
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
    if (typeof n == "string") return Ns(n, e);
    var t = {}.toString.call(n).slice(8, -1);
    return t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set" ? Array.from(n) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Ns(n, e) : void 0;
  }
}
const ur = Object.entries, Ms = Object.setPrototypeOf, zl = Object.isFrozen, Fl = Object.getPrototypeOf, Ul = Object.getOwnPropertyDescriptor;
let be = Object.freeze, _e = Object.seal, jt = Object.create, cr = typeof Reflect < "u" && Reflect, ls = cr.apply, as = cr.construct;
be || (be = function(e) {
  return e;
});
_e || (_e = function(e) {
  return e;
});
ls || (ls = function(e, t) {
  for (var s = arguments.length, r = new Array(s > 2 ? s - 2 : 0), a = 2; a < s; a++) r[a - 2] = arguments[a];
  return e.apply(t, r);
});
as || (as = function(e) {
  for (var t = arguments.length, s = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) s[r - 1] = arguments[r];
  return new e(...s);
});
const Tt = ve(Array.prototype.forEach), Bl = ve(Array.prototype.lastIndexOf), zs = ve(Array.prototype.pop), an = ve(Array.prototype.push), Hl = ve(Array.prototype.splice), Vt = Array.isArray, hn = ve(String.prototype.toLowerCase), Kn = ve(String.prototype.toString), Fs = ve(String.prototype.match), on = ve(String.prototype.replace), Us = ve(String.prototype.indexOf), jl = ve(String.prototype.trim), Wl = ve(Number.prototype.toString), Vl = ve(Boolean.prototype.toString), Bs = typeof BigInt > "u" ? null : ve(BigInt.prototype.toString), Hs = typeof Symbol > "u" ? null : ve(Symbol.prototype.toString), $e = ve(Object.prototype.hasOwnProperty), un = ve(Object.prototype.toString), Se = ve(RegExp.prototype.test), ht = ql(TypeError);
function ve(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, s = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) s[r - 1] = arguments[r];
    return ls(n, e, s);
  };
}
function ql(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
    return as(n, t);
  };
}
function Z(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : hn;
  if (Ms && Ms(n, null), !Vt(e)) return n;
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
function Ne(n) {
  const e = jt(null);
  for (const s of ur(n)) {
    var t = Nl(s, 2);
    const r = t[0], a = t[1];
    $e(n, r) && (Vt(a) ? e[r] = Gl(a) : a && typeof a == "object" && a.constructor === Object ? e[r] = Ne(a) : e[r] = a);
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
      return Bs ? Bs(n) : "0";
    case "symbol":
      return Hs ? Hs(n) : "Symbol()";
    case "undefined":
      return un(n);
    case "function":
    case "object": {
      if (n === null) return un(n);
      const e = n, t = Ue(e, "toString");
      if (typeof t == "function") {
        const s = t(e);
        return typeof s == "string" ? s : un(s);
      }
      return un(n);
    }
    default:
      return un(n);
  }
}
function Ue(n, e) {
  for (; n !== null; ) {
    const s = Ul(n, e);
    if (s) {
      if (s.get) return ve(s.get);
      if (typeof s.value == "function") return ve(s.value);
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
    return Se(n, ""), !0;
  } catch {
    return !1;
  }
}
const js = be([
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
]), Xn = be([
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
]), Qn = be([
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
]), Kl = be([
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
]), Jn = be([
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
]), Xl = be([
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
]), Ws = be(["#text"]), Vs = be([
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
]), es = be([
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
]), qs = be([
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
]), Pn = be([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Ql = _e(/{{[\w\W]*|^[\w\W]*}}/g), Jl = _e(/<%[\w\W]*|^[\w\W]*%>/g), ea = _e(/\${[\w\W]*/g), ta = _e(/^data-[\-\w.\u00B7-\uFFFF]+$/), na = _e(/^aria-[\-\w]+$/), Gs = _e(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), sa = _e(/^(?:\w+script|data):/i), ra = _e(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), la = _e(/^html$/i), aa = _e(/^[a-z][.\w]*(-[.\w]+)+$/i), Ys = _e(/<[/\w!]/g), Zs = _e(/<[/\w]/g), oa = _e(/<\/no(script|embed|frames)/i), ia = _e(/\/>/i), Pe = {
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
}, dr = [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
], ua = be(Z({}, dr)), ca = function() {
  const n = {};
  return Tt(dr, (e) => {
    n[e] = _e(new RegExp("</" + e + "(?=[\\t\\n\\f\\r />])", "i"));
  }), be(n);
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
      createHTML(c) {
        return c;
      },
      createScriptURL(c) {
        return c;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + a + " could not be created."), null;
  }
}, Ks = function() {
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
}, ft = function(e, t, s, r) {
  return $e(e, t) && Vt(e[t]) ? Z(r.base ? Ne(r.base) : {}, e[t], r.transform) : s;
}, ts = function(e, t, s) {
  const r = $e(e, t) ? e[t] : void 0;
  return r && typeof r == "object" ? Ne(r) : s();
};
function pr() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : da();
  const e = (x) => pr(x);
  if (e.version = "3.4.16", e.removed = [], !n || !n.document || n.document.nodeType !== Pe.document || !n.Element)
    return e.isSupported = !1, e;
  let t = n.document;
  const s = t, r = s.currentScript;
  n.DocumentFragment;
  const a = n.HTMLTemplateElement, c = n.Node, i = n.Element, k = n.NodeFilter;
  n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const _ = n.DOMParser, S = n.trustedTypes, E = i.prototype, N = Ue(E, "cloneNode"), U = Ue(E, "remove"), L = Ue(E, "removeAttributeNode"), K = Ue(E, "nextSibling"), z = Ue(E, "childNodes"), Y = Ue(E, "parentNode"), le = Ue(E, "shadowRoot"), C = Ue(E, "attributes"), F = c && c.prototype ? Ue(c.prototype, "nodeType") : null, M = c && c.prototype ? Ue(c.prototype, "nodeName") : null, ue = c && c.prototype ? Ue(c.prototype, "ownerDocument") : null, ce = function(l) {
    return F ? F(l) : l.nodeType;
  }, B = function(l) {
    return M ? M(l) : l.nodeName;
  };
  if (typeof a == "function") {
    const x = t.createElement("template");
    x.content && x.content.ownerDocument && (t = x.content.ownerDocument);
  }
  let y, f = "", v, T = !1, $ = 0;
  const P = function() {
    if ($ > 0) throw ht('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, te = function(l) {
    P(), $++;
    try {
      return y.createHTML(l);
    } finally {
      $--;
    }
  }, j = function(l) {
    P(), $++;
    try {
      return y.createScriptURL(l);
    } finally {
      $--;
    }
  }, ge = function() {
    return T || (v = pa(S, r), T = !0), v;
  }, He = t, gt = He.implementation, at = He.createNodeIterator, bn = He.createDocumentFragment, Yt = He.getElementsByTagName, Ct = s.importNode;
  let X = Ks();
  e.isSupported = typeof ur == "function" && typeof Y == "function" && gt && gt.createHTMLDocument !== void 0;
  const ot = Ql, yn = Jl, _n = ea, Lt = ta, jn = na, Wn = sa, Zt = ra, mt = aa;
  let vt = Gs, Q = null;
  const Ce = Z({}, [
    ...js,
    ...Xn,
    ...Qn,
    ...Jn,
    ...Ws
  ]);
  let ae = null;
  const It = Z({}, [
    ...Vs,
    ...es,
    ...qs,
    ...Pn
  ]);
  let Le = Object.seal(jt(null, {
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
  })), Ge = null, Kt = null;
  const Ye = Object.seal(jt(null, {
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
  let wn = !0, Ze = !0, xn = !1, Ot = !0, je = !1, Je = !0, W = !1, Pt = !1, kt = null, bt = null, Xt = !1, et = !1, yt = !1, J = !1, xe = !0, Ke = !1;
  const it = "user-content-";
  let ze = !0, me = !1, We = {}, de = null;
  const ut = Z({}, [
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
  let Qt = null;
  const Jt = Z({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let fe = null;
  const _t = Z({}, [
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
  ]), Dt = "http://www.w3.org/1998/Math/MathML", tt = "http://www.w3.org/2000/svg", ye = "http://www.w3.org/1999/xhtml";
  let Ie = ye, wt = !1, ct = null;
  const Sn = Z({}, [
    Dt,
    tt,
    ye
  ], Kn), en = be([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let tn = Z({}, en);
  const Tn = be(["annotation-xml"]);
  let xt = Z({}, Tn);
  const nt = Z({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let dt = null;
  const An = ["application/xhtml+xml", "text/html"], Vn = "text/html";
  let pe = null, st = null;
  const qn = t.createElement("form"), nn = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, sn = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (st && st === l) return;
    (!l || typeof l != "object") && (l = {}), l = Ne(l), dt = An.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? Vn : l.PARSER_MEDIA_TYPE, pe = dt === "application/xhtml+xml" ? Kn : hn, Q = ft(l, "ALLOWED_TAGS", Ce, { transform: pe }), ae = ft(l, "ALLOWED_ATTR", It, { transform: pe }), ct = ft(l, "ALLOWED_NAMESPACES", Sn, { transform: Kn }), fe = ft(l, "ADD_URI_SAFE_ATTR", _t, {
      transform: pe,
      base: _t
    }), Qt = ft(l, "ADD_DATA_URI_TAGS", Jt, {
      transform: pe,
      base: Jt
    }), de = ft(l, "FORBID_CONTENTS", ut, { transform: pe }), Ge = ft(l, "FORBID_TAGS", Ne({}), { transform: pe }), Kt = ft(l, "FORBID_ATTR", Ne({}), { transform: pe }), We = $e(l, "USE_PROFILES") ? l.USE_PROFILES && typeof l.USE_PROFILES == "object" ? Ne(l.USE_PROFILES) : l.USE_PROFILES : !1, wn = l.ALLOW_ARIA_ATTR !== !1, Ze = l.ALLOW_DATA_ATTR !== !1, xn = l.ALLOW_UNKNOWN_PROTOCOLS || !1, Ot = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, je = l.SAFE_FOR_TEMPLATES || !1, Je = l.SAFE_FOR_XML !== !1, W = l.WHOLE_DOCUMENT || !1, et = l.RETURN_DOM || !1, yt = l.RETURN_DOM_FRAGMENT || !1, J = l.RETURN_TRUSTED_TYPE || !1, Xt = l.FORCE_BODY || !1, xe = l.SANITIZE_DOM !== !1, Ke = l.SANITIZE_NAMED_PROPS || !1, ze = l.KEEP_CONTENT !== !1, me = l.IN_PLACE || !1, vt = Zl(l.ALLOWED_URI_REGEXP) ? l.ALLOWED_URI_REGEXP : Gs, Ie = typeof l.NAMESPACE == "string" ? l.NAMESPACE : ye, tn = ts(l, "MATHML_TEXT_INTEGRATION_POINTS", () => Z({}, en)), xt = ts(l, "HTML_INTEGRATION_POINTS", () => Z({}, Tn));
    const h = ts(l, "CUSTOM_ELEMENT_HANDLING", () => jt(null));
    if (Le = jt(null), $e(h, "tagNameCheck") && nn(h.tagNameCheck) && (Le.tagNameCheck = h.tagNameCheck), $e(h, "attributeNameCheck") && nn(h.attributeNameCheck) && (Le.attributeNameCheck = h.attributeNameCheck), $e(h, "allowCustomizedBuiltInElements") && typeof h.allowCustomizedBuiltInElements == "boolean" && (Le.allowCustomizedBuiltInElements = h.allowCustomizedBuiltInElements), _e(Le), je && (Ze = !1), yt && (et = !0), We && (Q = Z({}, Ws), ae = jt(null), We.html === !0 && (Z(Q, js), Z(ae, Vs)), We.svg === !0 && (Z(Q, Xn), Z(ae, es), Z(ae, Pn)), We.svgFilters === !0 && (Z(Q, Qn), Z(ae, es), Z(ae, Pn)), We.mathMl === !0 && (Z(Q, Jn), Z(ae, qs), Z(ae, Pn))), Ye.tagCheck = null, Ye.attributeCheck = null, $e(l, "ADD_TAGS") && (typeof l.ADD_TAGS == "function" ? Ye.tagCheck = l.ADD_TAGS : Vt(l.ADD_TAGS) && (Q === Ce && (Q = Ne(Q)), Z(Q, l.ADD_TAGS, pe))), $e(l, "ADD_ATTR") && (typeof l.ADD_ATTR == "function" ? Ye.attributeCheck = l.ADD_ATTR : Vt(l.ADD_ATTR) && (ae === It && (ae = Ne(ae)), Z(ae, l.ADD_ATTR, pe))), $e(l, "ADD_FORBID_CONTENTS") && Vt(l.ADD_FORBID_CONTENTS) && (de === ut && (de = Ne(de)), Z(de, l.ADD_FORBID_CONTENTS, pe)), ze && (Q["#text"] = !0), W && Z(Q, [
      "html",
      "head",
      "body"
    ]), Q.table && (Z(Q, ["tbody"]), delete Ge.tbody), l.TRUSTED_TYPES_POLICY) {
      if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function") throw ht('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw ht('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const w = y;
      y = l.TRUSTED_TYPES_POLICY;
      try {
        f = te("");
      } catch (A) {
        throw y = w, A;
      }
    } else l.TRUSTED_TYPES_POLICY === null ? (y = void 0, f = "") : (y === void 0 && (y = ge()), y && typeof f == "string" && (f = te("")));
    be && be(l), st = l;
  }, Nt = Z({}, [
    ...Xn,
    ...Qn,
    ...Kl
  ]), u = Z({}, [...Jn, ...Xl]), p = function(l, h, w) {
    return h.namespaceURI === ye ? l === "svg" : h.namespaceURI === Dt ? l === "svg" && (w === "annotation-xml" || tn[w]) : !!Nt[l];
  }, d = function(l, h, w) {
    return h.namespaceURI === ye ? l === "math" : h.namespaceURI === tt ? l === "math" && xt[w] : !!u[l];
  }, R = function(l, h, w) {
    return h.namespaceURI === tt && !xt[w] || h.namespaceURI === Dt && !tn[w] ? !1 : !u[l] && (nt[l] || !Nt[l]);
  }, ee = function(l) {
    let h = Y(l);
    (!h || !h.tagName) && (h = {
      namespaceURI: Ie,
      tagName: "template"
    });
    const w = hn(l.tagName), A = hn(h.tagName);
    return ct[l.namespaceURI] ? l.namespaceURI === tt ? p(w, h, A) : l.namespaceURI === Dt ? d(w, h, A) : l.namespaceURI === ye ? R(w, h, A) : !!(dt === "application/xhtml+xml" && ct[l.namespaceURI]) : !1;
  }, Ee = function(l) {
    an(e.removed, { element: l });
    try {
      Y(l).removeChild(l);
    } catch {
      if (U(l), !Y(l)) throw ht("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, ms = function(l, h, w) {
    try {
      L(l, h);
    } catch {
      try {
        l.removeAttribute(w);
      } catch {
      }
    }
  }, En = function(l) {
    Rn(l);
    const h = z(l);
    if (h) {
      const A = [];
      Tt(h, (D) => {
        an(A, D);
      }), Tt(A, (D) => {
        try {
          U(D);
        } catch {
        }
      });
    }
    const w = C(l);
    if (w) for (let A = w.length - 1; A >= 0; --A) {
      const D = w[A], V = D && D.name;
      typeof V == "string" && ms(l, D, V);
    }
  }, St = function(l, h, w) {
    if (!w) try {
      w = h.getAttributeNode(l);
    } catch {
      w = null;
    }
    an(e.removed, {
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
      if (et || yt) try {
        Ee(h);
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
        const A = h[w], D = A && A.name;
        typeof D != "string" || ae[pe(D)] || ms(l, A, D);
      }
  }, Rn = function(l) {
    const h = [l];
    for (; h.length > 0; ) {
      const w = h.pop();
      ce(w) === Pe.element && mr(w);
      const A = z(w);
      if (A) for (let D = A.length - 1; D >= 0; --D) h.push(A[D]);
    }
  }, vs = function(l, h) {
    return Je ? l === "patchsrc" ? !0 : l === "for" && h !== "label" && h !== "output" : !1;
  }, vr = function(l) {
    if (!Je) return;
    const h = [l];
    for (; h.length > 0; ) {
      const w = h.pop(), A = ce(w);
      if (A === Pe.processingInstruction || A === Pe.comment && Se(Zs, w.data)) {
        try {
          U(w);
        } catch {
        }
        continue;
      }
      if (A === Pe.element) {
        const V = w, q = pe(B(w));
        try {
          V.hasAttribute && V.hasAttribute("patchsrc") && V.removeAttribute("patchsrc"), V.hasAttribute && V.hasAttribute("for") && vs("for", q) && V.removeAttribute("for");
        } catch {
        }
      }
      const D = z(w);
      if (D) for (let V = D.length - 1; V >= 0; --V) h.push(D[V]);
    }
  }, ks = function(l) {
    let h = null, w = null;
    if (Xt) l = "<remove></remove>" + l;
    else {
      const V = Fs(l, /^[\r\n\t ]+/);
      w = V && V[0];
    }
    dt === "application/xhtml+xml" && Ie === ye && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const A = y ? te(l) : l;
    if (Ie === ye) try {
      h = new _().parseFromString(A, dt);
    } catch {
    }
    if (!h || !h.documentElement) {
      h = gt.createDocument(Ie, "template", null);
      try {
        h.documentElement.innerHTML = wt ? f : A;
      } catch {
      }
    }
    const D = h.body || h.documentElement;
    return l && w && D.insertBefore(t.createTextNode(w), D.childNodes[0] || null), Ie === ye ? Yt.call(h, W ? "html" : "body")[0] : W ? h.documentElement : D;
  }, bs = function(l) {
    const h = ue ? ue(l) : l.ownerDocument;
    return at.call(h || l, l, k.SHOW_ELEMENT | k.SHOW_COMMENT | k.SHOW_TEXT | k.SHOW_PROCESSING_INSTRUCTION | k.SHOW_CDATA_SECTION, null);
  }, $n = function(l) {
    return l = on(l, ot, " "), l = on(l, yn, " "), l = on(l, _n, " "), l;
  }, Gn = function(l) {
    var h;
    l.normalize();
    const w = ue ? ue(l) : l.ownerDocument, A = at.call(w || l, l, k.SHOW_TEXT | k.SHOW_COMMENT | k.SHOW_CDATA_SECTION | k.SHOW_PROCESSING_INSTRUCTION, null);
    let D = A.nextNode();
    for (; D; )
      D.data = $n(D.data), D = A.nextNode();
    const V = (h = l.querySelectorAll) === null || h === void 0 ? void 0 : h.call(l, "template");
    V && Tt(V, (q) => {
      Mt(q.content) && Gn(q.content);
    });
  }, Cn = function(l) {
    const h = M ? M(l) : null;
    return typeof h != "string" || pe(h) !== "form" ? !1 : typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || l.attributes !== C(l) || typeof l.removeAttribute != "function" || typeof l.removeAttributeNode != "function" || typeof l.getAttributeNode != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function" || l.nodeType !== F(l) || l.childNodes !== z(l);
  }, Mt = function(l) {
    if (!F || typeof l != "object" || l === null) return !1;
    try {
      return F(l) === Pe.documentFragment;
    } catch {
      return !1;
    }
  }, rn = function(l) {
    if (!F || typeof l != "object" || l === null) return !1;
    try {
      return typeof F(l) == "number";
    } catch {
      return !1;
    }
  };
  function Xe(x, l, h) {
    x.length !== 0 && Tt(x, (w) => {
      w.call(e, l, h, st);
    });
  }
  const kr = function(l, h) {
    return !!(Je && l.hasChildNodes() && !rn(l.firstElementChild) && Se(Ys, l.textContent) && Se(Ys, l.innerHTML) || Je && l.namespaceURI === ye && ua[h] && (rn(l.firstElementChild) || typeof l.textContent == "string" && Se(ca[h], l.textContent)) || l.nodeType === Pe.processingInstruction || Je && l.nodeType === Pe.comment && Se(Zs, l.data));
  }, Ln = function(l, h) {
    if (l instanceof RegExp) return Se(l, h);
    if (l instanceof Function) {
      for (var w = arguments.length, A = new Array(w > 2 ? w - 2 : 0), D = 2; D < w; D++) A[D - 2] = arguments[D];
      return !!l(h, ...A);
    }
    return !1;
  }, br = function(l, h, w) {
    if (!Ge[h] && xs(h) && Ln(Le.tagNameCheck, h)) return !1;
    if (ze && !de[h]) {
      const A = Y(l), D = z(l);
      if (D && A) {
        const V = D.length;
        for (let q = V - 1; q >= 0; --q) {
          const he = l === w ? N(D[q], !0) : D[q];
          A.insertBefore(he, K(l));
        }
      }
    }
    return Ee(l), !0;
  }, ys = function(l, h, w, A) {
    return l.length === 0 ? h : h === w || h === A ? Ne(h) : h;
  }, zt = function(l, h) {
    return l === h || Y(l) !== null ? !1 : (me && Rn(l), !0);
  }, _s = function(l, h) {
    if (Xe(X.beforeSanitizeElements, l, null), zt(l, h)) return !0;
    if (Cn(l))
      return Ee(l), !0;
    const w = pe(B(l));
    if (Q = ys(X.uponSanitizeElement, Q, Ce, kt), Xe(X.uponSanitizeElement, l, {
      tagName: w,
      allowedTags: Q
    }), zt(l, h)) return !0;
    if (kr(l, w))
      return Ee(l), !0;
    if (Ge[w] || !(Ye.tagCheck instanceof Function && Ye.tagCheck(w)) && !Q[w]) {
      const A = br(l, w, h);
      return A === !1 && (Xe(X.afterSanitizeElements, l, null), zt(l, h)) ? !0 : A;
    }
    if (ce(l) === Pe.element && !ee(l) || (w === "noscript" || w === "noembed" || w === "noframes") && Se(oa, l.innerHTML))
      return Ee(l), !0;
    if (je && l.nodeType === Pe.text) {
      const A = $n(l.textContent);
      l.textContent !== A && (an(e.removed, { element: l.cloneNode() }), l.textContent = A);
    }
    return Xe(X.afterSanitizeElements, l, null), zt(l, h);
  }, ws = function(l, h, w) {
    if (Kt[h] || vs(h, l) || xe && (h === "id" || h === "name") && (w in t || w in qn)) return !1;
    const A = ae[h] || Ye.attributeCheck instanceof Function && Ye.attributeCheck(h, l);
    return Ze && Se(Lt, h) || wn && Se(jn, h) ? !0 : A ? fe[h] || Se(vt, on(w, Zt, "")) || (h === "src" || h === "xlink:href" || h === "href") && l !== "script" && Us(w, "data:") === 0 && Qt[l] || xn && !Se(Wn, on(w, Zt, "")) ? !0 : !w : xs(l) && Ln(Le.tagNameCheck, l) && Ln(Le.attributeNameCheck, h, l) || h === "is" && Le.allowCustomizedBuiltInElements && Ln(Le.tagNameCheck, w);
  }, yr = Z({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), xs = function(l) {
    return !yr[hn(l)] && Se(mt, l);
  }, _r = function(l, h, w, A) {
    if (y && typeof S == "object" && typeof S.getAttributeType == "function" && !w) switch (S.getAttributeType(l, h)) {
      case "TrustedHTML":
        return te(A);
      case "TrustedScriptURL":
        return j(A);
    }
    return A;
  }, wr = function(l, h, w, A) {
    try {
      return w ? l.setAttributeNS(w, h, A) : l.setAttribute(h, A), Cn(l) ? (Ee(l), !1) : !0;
    } catch {
      return St(h, l), !1;
    }
  }, Ss = function(l, h) {
    if (Xe(X.beforeSanitizeAttributes, l, null), zt(l, h)) return;
    const w = l.attributes;
    if (!w || Cn(l)) return;
    ae = ys(X.uponSanitizeAttribute, ae, It, bt);
    const A = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: ae,
      forceKeepAttr: void 0
    };
    let D = w.length;
    const V = pe(l.nodeName);
    for (; D--; ) {
      const q = w[D], he = q.name, Fe = q.namespaceURI, Oe = q.value, Ft = pe(he), Zn = Oe;
      let Ae = he === "value" ? Zn : jl(Zn), Ts = !1;
      if (A.attrName = Ft, A.attrValue = Ae, A.keepAttr = !0, A.forceKeepAttr = void 0, Xe(X.uponSanitizeAttribute, l, A), Ae = A.attrValue, Ke && (Ft === "id" || Ft === "name") && Us(Ae, it) !== 0 && (St(he, l, q), Ae = it + Ae, Ts = !0), Je && Se(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, Ae)) {
        St(he, l, q);
        continue;
      }
      if (Ft === "attributename" && Fs(Ae, "href")) {
        St(he, l, q);
        continue;
      }
      if (!A.forceKeepAttr) {
        if (!A.keepAttr) {
          St(he, l, q);
          continue;
        }
        if (!Ot && Se(ia, Ae)) {
          St(he, l, q);
          continue;
        }
        if (je && (Ae = $n(Ae)), !ws(V, Ft, Ae)) {
          St(he, l, q);
          continue;
        }
        Ae = _r(V, Ft, Fe, Ae), Ae !== Zn && wr(l, he, Fe, Ae) && Ts && zs(e.removed);
      }
    }
    Xe(X.afterSanitizeAttributes, l, null), zt(l, h);
  }, In = function(l) {
    let h = null;
    const w = bs(l);
    for (Xe(X.beforeSanitizeShadowDOM, l, null); h = w.nextNode(); )
      if (Xe(X.uponSanitizeShadowNode, h, null), _s(h, l), Ss(h, l), Mt(h.content) && In(h.content), ce(h) === Pe.element) {
        const A = le(h);
        Mt(A) && (Yn(A), In(A));
      }
    Xe(X.afterSanitizeShadowDOM, l, null);
  }, Yn = function(l) {
    const h = [{
      node: l,
      shadow: null
    }];
    for (; h.length > 0; ) {
      const w = h.pop();
      if (w.shadow) {
        In(w.shadow);
        continue;
      }
      const A = w.node, D = ce(A) === Pe.element, V = z(A);
      if (V) for (let q = V.length - 1; q >= 0; --q) h.push({
        node: V[q],
        shadow: null
      });
      if (D) {
        const q = M ? M(A) : null;
        if (typeof q == "string" && pe(q) === "template") {
          const he = A.content;
          Mt(he) && h.push({
            node: he,
            shadow: null
          });
        }
      }
      if (D) {
        const q = le(A);
        Mt(q) && h.push({
          node: null,
          shadow: q
        }, {
          node: q,
          shadow: null
        });
      }
    }
  };
  return e.sanitize = function(x) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, h = null, w = null, A = null, D = null;
    if (wt = !x, wt && (x = "<!-->"), typeof x != "string" && !rn(x) && (x = Yl(x), typeof x != "string"))
      throw ht("dirty is not a string, aborting");
    if (!e.isSupported) return x;
    Pt ? (Q = kt, ae = bt) : sn(l), (X.uponSanitizeElement.length > 0 || X.uponSanitizeAttribute.length > 0) && (Q = Ne(Q)), X.uponSanitizeAttribute.length > 0 && (ae = Ne(ae)), e.removed = [];
    const V = me && typeof x != "string" && rn(x);
    if (V) {
      vr(x);
      const Fe = B(x);
      if (typeof Fe == "string") {
        const Oe = pe(Fe);
        if (!Q[Oe] || Ge[Oe])
          throw En(x), ht("root node is forbidden and cannot be sanitized in-place");
      }
      if (Cn(x))
        throw En(x), ht("root node is clobbered and cannot be sanitized in-place");
      try {
        Yn(x);
      } catch (Oe) {
        throw En(x), Oe;
      }
    } else if (rn(x))
      h = ks("<!---->"), w = h.ownerDocument.importNode(x, !0), w.nodeType === Pe.element && w.nodeName === "BODY" || w.nodeName === "HTML" ? h = w : h.appendChild(w), Yn(h);
    else {
      if (!et && !je && !W && x.indexOf("<") === -1) return y && J ? te(x) : x;
      if (h = ks(x), !h) return et ? null : J ? f : "";
    }
    h && Xt && Ee(h.firstChild);
    const q = V ? x : h;
    try {
      const Fe = bs(q);
      for (; A = Fe.nextNode(); )
        _s(A, q), Ss(A, q), Mt(A.content) && In(A.content);
    } catch (Fe) {
      throw V && (En(x), Tt(e.removed, (Oe) => {
        Oe.element && Rn(Oe.element);
      })), Fe;
    }
    if (V) {
      let Fe = !1;
      if (Tt(e.removed, (Oe) => {
        Oe.element && (Oe.element === x && (Fe = !0), Rn(Oe.element));
      }), Fe) throw ht("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return je && Gn(x), x;
    }
    if (et) {
      if (je && Gn(h), yt)
        for (D = bn.call(h.ownerDocument); h.firstChild; ) D.appendChild(h.firstChild);
      else D = h;
      return (ae.shadowroot || ae.shadowrootmode) && (D = Ct.call(s, D, !0)), D;
    }
    let he = W ? h.outerHTML : h.innerHTML;
    return W && Q["!doctype"] && h.ownerDocument && h.ownerDocument.doctype && h.ownerDocument.doctype.name && Se(la, h.ownerDocument.doctype.name) && (he = "<!DOCTYPE " + h.ownerDocument.doctype.name + `>
` + he), je && (he = $n(he)), y && J ? te(he) : he;
  }, e.setConfig = function() {
    let x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    sn(x), Pt = !0, kt = Q, bt = ae;
  }, e.clearConfig = function() {
    st = null, Pt = !1, kt = null, bt = null, y = v, f = "";
  }, e.isValidAttribute = function(x, l, h) {
    st || sn({});
    const w = pe(x), A = pe(l);
    return ws(w, A, h);
  }, e.addHook = function(x, l) {
    typeof l == "function" && $e(X, x) && an(X[x], l);
  }, e.removeHook = function(x, l) {
    if ($e(X, x)) {
      if (l !== void 0) {
        const h = Bl(X[x], l);
        return h === -1 ? void 0 : Hl(X[x], h, 1)[0];
      }
      return zs(X[x]);
    }
  }, e.removeHooks = function(x) {
    $e(X, x) && (X[x] = []);
  }, e.removeAllHooks = function() {
    X = Ks();
  }, e;
}
var ha = pr();
const fa = ["innerHTML"], ga = /* @__PURE__ */ qt({
  __name: "MarkdownContent",
  props: {
    content: {}
  },
  setup(n) {
    const e = n, t = G(() => ha.sanitize(re.parse(e.content, { async: !1, breaks: !0 })));
    return (s, r) => (m(), b("div", {
      class: "markdown-content",
      innerHTML: t.value
    }, null, 8, fa));
  }
}), gs = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [s, r] of e)
    t[s] = r;
  return t;
}, cn = /* @__PURE__ */ gs(ga, [["__scopeId", "data-v-ef377647"]]);
function hr() {
  const n = localStorage.getItem("0kay_lang");
  return n === "en" || n === "zh" ? n : navigator.language.startsWith("zh") ? "zh" : "en";
}
const rt = O(hr());
function ma() {
  rt.value = hr();
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
    const e = n, t = (y, f) => rt.value === "en" ? f : y, s = O(!1), r = O(!1), a = G(() => (e.step.prompt || "").trim() || "tool"), c = G(() => ["websearch", "web_search", "search"].includes(a.value)), i = G(() => {
      if (!e.step.args) return null;
      try {
        const y = JSON.parse(e.step.args);
        return y && typeof y == "object" && !Array.isArray(y) ? y : null;
      } catch {
        return null;
      }
    }), k = G(() => {
      if (!e.step.result) return null;
      try {
        return JSON.parse(e.step.result);
      } catch {
        return e.step.result;
      }
    }), _ = G(() => {
      const y = k.value;
      return !y || typeof y != "object" || Array.isArray(y) ? null : y.data !== void 0 && y.data !== null && typeof y.data == "object" && !Array.isArray(y.data) ? y.data : "success" in y ? null : y;
    }), S = G(() => {
      const y = _.value;
      return !y || typeof y.base64 != "string" || typeof y.mime != "string" || !y.mime.startsWith("image/") ? null : { src: `data:${y.mime};base64,${y.base64}`, width: y.width, height: y.height, path: y.path };
    }), E = G(() => {
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
    }), N = (y) => (rt.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[y] || y;
    function U(y) {
      let f = 0, v = 0;
      for (const T of String(y || "").split(`
`))
        T.startsWith("---") || T.startsWith("+++") || (T.startsWith("+") ? f++ : T.startsWith("-") && v++);
      return { added: f, removed: v };
    }
    const L = G(() => {
      const y = a.value, f = _.value;
      if (!f) return "";
      if (y === "write") return typeof f.lines == "number" ? `+${f.lines} ${t("行", "lines")}` : "";
      if (y === "edit") {
        const { added: v, removed: T } = U(f.diff);
        return v || T ? `+${v} −${T}` : "";
      }
      if (y === "apply_patch" && Array.isArray(f.files)) {
        let v = 0, T = 0;
        for (const $ of f.files) {
          const P = U($?.diff);
          v += P.added, T += P.removed;
        }
        return v || T ? `+${v} −${T}` : "";
      }
      return "";
    });
    function K(y, f) {
      const v = [];
      let T = null, $ = 0, P = 0;
      const te = (j) => {
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
            ge && ($ = parseInt(ge[1], 10), P = parseInt(ge[2], 10)), te({ kind: "hunk", oldNo: "", newNo: "", text: j });
            continue;
          }
          if (/^(index |new file|deleted file|old mode|new mode|similarity |rename |copy )/.test(j)) {
            te({ kind: "meta", oldNo: "", newNo: "", text: j });
            continue;
          }
          if (j.startsWith("+")) {
            te({ kind: "add", oldNo: "", newNo: String(P++), text: j.slice(1) });
            continue;
          }
          if (j.startsWith("-")) {
            te({ kind: "del", oldNo: String($++), newNo: "", text: j.slice(1) });
            continue;
          }
          if (j.startsWith("\\")) {
            te({ kind: "meta", oldNo: "", newNo: "", text: j });
            continue;
          }
          te({ kind: "ctx", oldNo: String($++), newNo: String(P++), text: j });
        }
      }
      return v;
    }
    const z = G(() => {
      const y = a.value, f = _.value, v = i.value;
      if (y === "edit" && f) return K(String(f.diff || ""), String(v?.filePath || f.path || ""));
      if (y === "apply_patch") {
        const T = [];
        if (Array.isArray(f?.files)) {
          for (const $ of f.files) {
            const P = K(String($?.diff || ""), String($?.path || ""));
            P.length ? T.push(...P) : T.push({ path: String($?.path || ""), lines: [] });
          }
          return T;
        }
        if (Array.isArray(v?.patches)) {
          const $ = v.patches.map((P) => String(P?.patch ?? P?.diff ?? P?.text ?? "")).join(`
`);
          return K($, "");
        }
        return T;
      }
      return [];
    });
    function Y(y) {
      const f = y.lines || [], v = f.filter(($) => $.kind === "add").length, T = f.filter(($) => $.kind === "del").length;
      return v || T ? `+${v} −${T}` : "";
    }
    const le = G(() => {
      const y = a.value, f = i.value, v = _.value, T = ($, P = 160) => ($ || "").length > P ? `${$.slice(0, P)}…` : $ || "";
      if (c.value) {
        const $ = T(String(v?.query ?? f?.query ?? "")), P = Array.isArray(v?.results) ? v.results.length : 0;
        return $ + (P ? ` · ${P} ${t("条结果", "results")}` : "");
      }
      if (y === "bash") {
        const $ = T(String(f?.command ?? "")), P = v && v.exitCode !== void 0 && e.step.state !== "running" ? ` · ${t("退出码", "exit")} ${v.exitCode}` : "";
        return $ + P;
      }
      if (y === "webfetch")
        return T(String(v?.url ?? f?.url ?? "")) + (v?.status !== void 0 && v?.status !== null ? ` · HTTP ${v.status}` : "");
      if (y === "read" || y === "write") return T(String(v?.path ?? f?.filePath ?? ""));
      if (y === "edit") return T(String(f?.filePath ?? v?.path ?? ""));
      if (y === "apply_patch") {
        const $ = Array.isArray(f?.patches) ? f.patches.map((P) => P?.filePath).filter(Boolean) : Array.isArray(v?.files) ? v.files.map((P) => P?.path).filter(Boolean) : [];
        return T($.join(", "));
      }
      if (y === "todowrite") {
        const $ = Array.isArray(f?.todos) ? f.todos : Array.isArray(v?.todos) ? v.todos : [];
        if (!$.length) return T(String(e.step.args || ""));
        const P = $.length, te = $.filter((ge) => ge?.status === "completed").length, j = $.filter((ge) => ge?.status === "in_progress").length;
        return `${P} ${t("项", "items")} · ${t("完成", "done")} ${te}${j ? ` · ${t("进行中", "running")} ${j}` : ""}`;
      }
      if (y === "computeruse") {
        const $ = String(f?.action ?? v?.action ?? ""), P = f && f.x !== void 0 ? ` (${f.x}, ${f.y})` : "", te = v?.width && v?.height ? ` · ${v.width}×${v.height}` : "", j = Array.isArray(v?.windows) ? ` · ${v.windows.length} ${t("个窗口", "windows")}` : "";
        return T(`${$}${P}${te}${j}`);
      }
      if (f && Object.keys(f).length)
        try {
          return T(JSON.stringify(f));
        } catch {
        }
      return T(String(e.step.args || ""));
    }), C = G(() => String(_.value?.query ?? i.value?.query ?? e.step.args ?? "")), F = G(() => Array.isArray(_.value?.results) ? _.value.results : []), M = G(() => typeof k.value == "string" ? k.value : k.value === null && e.step.result ? e.step.result : ""), ue = G(() => {
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
        return [{ label: "JSON", text: JSON.stringify(k.value, null, 2), mono: !0 }];
      } catch {
        return [{ label: "", text: String(v), mono: !0 }];
      }
    });
    function ce() {
      if (c.value) {
        r.value = !r.value;
        return;
      }
      s.value = !s.value;
    }
    function B(y) {
      y.key === "Escape" && r.value && (r.value = !1);
    }
    return fn(() => window.addEventListener("keydown", B)), gn(() => window.removeEventListener("keydown", B)), (y, f) => (m(), b("div", {
      class: oe(["tool-card", { expanded: s.value }])
    }, [
      o("button", {
        type: "button",
        class: "tool-card-head",
        onClick: ce
      }, [
        o("span", {
          class: oe(["tool-dot", n.step.state])
        }, "●", 2),
        o("strong", va, g(E.value), 1),
        o("span", ka, g(le.value), 1),
        L.value ? (m(), b("small", ba, g(L.value), 1)) : I("", !0),
        o("small", ya, g(N(n.step.state)), 1),
        f[2] || (f[2] = o("span", {
          class: "tool-chevron",
          "aria-hidden": "true"
        }, "▸", -1))
      ]),
      s.value && !c.value ? (m(), b("div", _a, [
        n.step.state === "running" && !ue.value.length && !z.value.length && !S.value ? (m(), b("p", wa, g(t("执行中…", "Running…")), 1)) : I("", !0),
        S.value ? (m(), b("figure", xa, [
          o("img", {
            src: S.value.src,
            alt: t("屏幕截图", "Screenshot")
          }, null, 8, Sa),
          o("figcaption", null, g(S.value.width && S.value.height ? `${S.value.width}×${S.value.height} · ` : "") + g(S.value.path), 1)
        ])) : I("", !0),
        z.value.length ? (m(), b("div", Ta, [
          (m(!0), b(se, null, ke(z.value, (v, T) => (m(), b("div", {
            key: T,
            class: "diff-file"
          }, [
            o("div", Aa, [
              o("span", {
                class: "diff-file-path",
                title: v.path
              }, g(v.path || "—"), 9, Ea),
              Y(v) ? (m(), b("span", Ra, g(Y(v)), 1)) : I("", !0)
            ]),
            o("div", $a, [
              (m(!0), b(se, null, ke(v.lines, ($, P) => (m(), b("div", {
                key: P,
                class: oe(["diff-line", $.kind])
              }, [
                o("span", Ca, g($.oldNo), 1),
                o("span", La, g($.newNo), 1),
                o("span", Ia, g($.kind === "add" ? "+" : $.kind === "del" ? "-" : ""), 1),
                o("span", Oa, g($.text), 1)
              ], 2))), 128))
            ])
          ]))), 128))
        ])) : S.value ? I("", !0) : (m(!0), b(se, { key: 3 }, ke(ue.value, (v, T) => (m(), b(se, { key: T }, [
          v.label ? (m(), b("small", Pa, g(v.label), 1)) : I("", !0),
          v.mono ? (m(), b("pre", Da, g(v.text), 1)) : (m(), b("p", Na, g(v.text), 1))
        ], 64))), 128)),
        !ue.value.length && !z.value.length && !S.value && n.step.state !== "running" && !n.step.error ? (m(), b("p", Ma, g(t("执行完成，无输出", "Completed with no output")), 1)) : I("", !0),
        n.step.error ? (m(), b("p", za, g(n.formatError?.(n.step.error) || n.step.error), 1)) : I("", !0)
      ])) : I("", !0),
      r.value ? (m(), b("div", {
        key: 1,
        class: "tool-dialog-backdrop",
        onClick: f[1] || (f[1] = Me((v) => r.value = !1, ["self"]))
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
              onClick: f[0] || (f[0] = (v) => r.value = !1)
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
            ])], 8, Ua)
          ]),
          n.step.state === "running" ? (m(), b("p", Ba, g(t("搜索中…", "Searching…")), 1)) : F.value.length ? (m(), b("ol", Ha, [
            (m(!0), b(se, null, ke(F.value, (v, T) => (m(), b("li", { key: T }, [
              o("a", {
                href: v.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }, g(v.title || v.url), 9, ja),
              v.snippet ? (m(), b("p", Wa, g(v.snippet), 1)) : I("", !0),
              v.title && v.url ? (m(), b("small", Va, g(v.url), 1)) : I("", !0)
            ]))), 128))
          ])) : (m(), b("p", qa, g(M.value || t("没有找到相关结果。", "No relevant results found.")), 1)),
          n.step.error ? (m(), b("p", Ga, g(n.formatError?.(n.step.error) || n.step.error), 1)) : I("", !0)
        ], 8, Fa)
      ])) : I("", !0)
    ], 2));
  }
}), Xs = /* @__PURE__ */ gs(Ya, [["__scopeId", "data-v-f13fbd25"]]);
function fr(n = "") {
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
}, Dn = /* @__PURE__ */ qt({
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
    const t = n, s = e, r = O(null), a = O(null), c = O(null), i = O(!1), k = O(-1), _ = O({}), S = O(!1), E = O(""), N = fr("select"), U = G(() => t.options.map((f) => typeof f == "string" ? { value: f, label: f } : f)), L = G(() => {
      if (!t.searchable || !E.value.trim()) return U.value;
      const f = E.value.trim().toLocaleLowerCase();
      return U.value.filter((v) => v.label.toLocaleLowerCase().includes(f) || v.value.toLocaleLowerCase().includes(f));
    }), K = G(() => U.value.find((f) => f.value === t.modelValue)?.label || t.modelValue || t.placeholder);
    let z = "", Y = 0;
    function le() {
      const f = r.value?.getBoundingClientRect();
      if (!f) return;
      const v = window.visualViewport?.height || innerHeight, T = window.visualViewport?.width || innerWidth, $ = v - f.bottom - 10, P = f.top - 10;
      S.value = $ < Math.min(280, L.value.length * 46 + 58) && P > $;
      const te = Math.max(48, Math.min(340, S.value ? P : $)), j = Math.min(Math.max(f.width, 220), T - 16);
      _.value = { position: "fixed", left: `${Math.max(8, Math.min(f.left, T - j - 8))}px`, width: `${j}px`, maxHeight: `${te}px`, ...S.value ? { bottom: `${v - f.top + 8}px` } : { top: `${f.bottom + 8}px` } };
    }
    function C(f = !1) {
      i.value = !1, E.value = "", z = "", f && r.value?.focus();
    }
    async function F() {
      t.disabled || i.value || (i.value = !0, E.value = "", k.value = L.value.findIndex((f) => f.value === t.modelValue && !f.disabled), k.value < 0 && (k.value = L.value.findIndex((f) => !f.disabled)), le(), s("open"), await Qe(), t.searchable && c.value?.focus(), M());
    }
    function M() {
      a.value?.querySelector(`[data-index="${k.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function ue(f) {
      const v = L.value[f];
      !v || v.disabled || (s("update:modelValue", v.value), s("change", v.value), C(!0));
    }
    async function ce(f) {
      if (!(t.disabled || f.isComposing)) {
        if (f.key === "Tab") {
          C();
          return;
        }
        if (f.key === "Escape") {
          i.value && (f.preventDefault(), C(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(f.key)) {
          if (t.searchable && f.key === " ") return;
          if (f.preventDefault(), !i.value) {
            await F();
            return;
          }
          if (f.key === "Enter") {
            ue(k.value);
            return;
          }
          const v = L.value.map(($, P) => $.disabled ? -1 : P).filter(($) => $ >= 0);
          if (!v.length) return;
          const T = v.indexOf(k.value);
          k.value = f.key === "Home" ? v[0] : f.key === "End" ? v[v.length - 1] : v[(T + (f.key === "ArrowDown" ? 1 : -1) + v.length) % v.length], await Qe(), M();
          return;
        }
        if (!t.searchable && f.key.length === 1 && !f.ctrlKey && !f.metaKey && !f.altKey) {
          await F();
          const v = Date.now();
          z = v - Y > 700 ? f.key : z + f.key, Y = v;
          const T = L.value.findIndex(($) => !$.disabled && $.label.toLocaleLowerCase().startsWith(z.toLocaleLowerCase()));
          T >= 0 && (k.value = T, await Qe(), M());
        }
      }
    }
    function B(f) {
      const v = f.target;
      !r.value?.contains(v) && !a.value?.contains(v) && C();
    }
    function y(f) {
      i.value && (!(f.target instanceof Node) || !a.value?.contains(f.target)) && le();
    }
    return Te(() => t.disabled, (f) => {
      f && C();
    }), Te(L, () => {
      i.value && (k.value >= L.value.length && (k.value = L.value.findIndex((f) => !f.disabled)), Qe(le));
    }), Te(E, () => {
      i.value && (k.value = L.value.findIndex((f) => !f.disabled), Qe(M));
    }), fn(() => {
      document.addEventListener("pointerdown", B, !0), window.addEventListener("resize", le), window.addEventListener("scroll", y, !0);
    }), gn(() => {
      document.removeEventListener("pointerdown", B, !0), window.removeEventListener("resize", le), window.removeEventListener("scroll", y, !0);
    }), (f, v) => (m(), b("div", Ar(f.$attrs, {
      class: ["app-select", { "is-disabled": n.disabled, "is-open": i.value }]
    }), [
      o("button", {
        ref_key: "trigger",
        ref: r,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": i.value,
        "aria-controls": i.value ? ie(N) : void 0,
        "aria-activedescendant": i.value && k.value >= 0 ? `${ie(N)}-${k.value}` : void 0,
        "aria-label": n.ariaLabel,
        disabled: n.disabled,
        onClick: v[0] || (v[0] = (T) => i.value ? C() : F()),
        onKeydown: ce,
        onFocus: v[1] || (v[1] = (T) => s("focus", T))
      }, [
        o("span", Ka, g(K.value), 1),
        o("span", Xa, [
          (m(), b("svg", {
            class: oe({ "is-open": i.value }),
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
      (m(), Et(Hn, { to: "body" }, [
        Be(Qs, { name: "select-menu" }, {
          default: Js(() => [
            i.value ? (m(), b("div", {
              key: 0,
              id: ie(N),
              ref_key: "menu",
              ref: a,
              class: oe(["app-select-menu", { "opens-up": S.value }]),
              style: Wt(_.value),
              role: "listbox",
              "aria-label": n.ariaLabel || "选项",
              onPointerdown: v[3] || (v[3] = Me(() => {
              }, ["prevent"]))
            }, [
              n.searchable ? (m(), b("label", Ja, [
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
                dn(o("input", {
                  ref_key: "searchInput",
                  ref: c,
                  "onUpdate:modelValue": v[2] || (v[2] = (T) => E.value = T),
                  type: "text",
                  placeholder: ie(rt) === "en" ? "Search…" : "搜索…",
                  onKeydown: ce
                }, null, 40, eo), [
                  [Mn, E.value]
                ])
              ])) : I("", !0),
              (m(!0), b(se, null, ke(L.value, (T, $) => (m(), b("div", {
                id: `${ie(N)}-${$}`,
                key: `${T.value}:${$}`,
                role: "option",
                "aria-selected": T.value === n.modelValue,
                "aria-disabled": !!T.disabled,
                "data-index": $,
                class: oe(["app-select-option", { highlighted: k.value === $, selected: T.value === n.modelValue, disabled: T.disabled }]),
                onPointermove: (P) => !T.disabled && (k.value = $),
                onClick: Me((P) => ue($), ["stop"])
              }, [
                o("span", null, g(T.label), 1),
                T.value === n.modelValue ? (m(), b("span", no, [...v[6] || (v[6] = [
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
              L.value.length ? I("", !0) : (m(), b("div", so, g(ie(rt) === "en" ? "No matches" : "没有匹配项"), 1))
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
    const t = G(() => rt.value === "en"), s = n, r = e, a = G(() => [{ value: 0, label: t.value ? "Off" : "关闭思考" }, { value: 20, label: t.value ? "Low" : "低" }, { value: 50, label: t.value ? "Medium" : "中" }, { value: 75, label: t.value ? "High" : "高" }, { value: 100, label: t.value ? "Max" : "最高" }]), c = G(() => s.modelValue === 0 ? 0 : s.modelValue < 35 ? 1 : s.modelValue < 62.5 ? 2 : s.modelValue < 87.5 ? 3 : 4), i = O(!1), k = O({}), _ = O(null), S = O(null), E = O(null), N = O(c.value * 25), U = O(!1), L = G(() => c.value === 4), K = fr("thinking");
    let z;
    Te(() => s.modelValue, () => {
      i.value || (N.value = c.value * 25);
    }), Te(L, (B, y) => {
      B && !y && (U.value = !0, clearTimeout(z), z = setTimeout(() => U.value = !1, 900));
    }), Te(() => s.disabled, (B) => {
      B && (i.value = !1);
    });
    function Y() {
      const B = _.value?.getBoundingClientRect();
      if (!B) return;
      const y = Math.min(352, innerWidth - 16), f = 236, v = B.top >= f + 8 || innerHeight - B.bottom < f;
      k.value = { left: `${Math.max(8, Math.min(B.left, innerWidth - y - 8))}px`, width: `${y}px`, ...v ? { bottom: `${innerHeight - B.top + 8}px` } : { top: `${B.bottom + 8}px` } };
    }
    async function le() {
      s.disabled || (i.value = !i.value, i.value && (N.value = c.value * 25, Y(), await Qe(), E.value?.focus()));
    }
    function C() {
      i.value = !1, _.value?.focus();
    }
    function F(B) {
      N.value = Number(B.target.value), r("update:modelValue", a.value[Math.round(N.value / 25)].value);
    }
    function M(B) {
      N.value = B * 25, r("update:modelValue", a.value[B].value);
    }
    function ue(B) {
      const y = B.target;
      !_.value?.contains(y) && !S.value?.contains(y) && (i.value = !1);
    }
    function ce(B) {
      i.value && (!(B.target instanceof Node) || !S.value?.contains(B.target)) && Y();
    }
    return fn(() => {
      document.addEventListener("pointerdown", ue, !0), window.addEventListener("resize", Y), window.addEventListener("scroll", ce, !0);
    }), gn(() => {
      clearTimeout(z), document.removeEventListener("pointerdown", ue, !0), window.removeEventListener("resize", Y), window.removeEventListener("scroll", ce, !0);
    }), (B, y) => (m(), b("div", {
      class: oe(["thinking-control", { full: L.value, pulse: U.value }])
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
        "aria-expanded": i.value,
        "aria-controls": i.value ? ie(K) : void 0,
        onClick: le,
        onKeydown: Ut(C, ["esc"])
      }, [
        o("span", null, g(L.value ? "✦ " : "") + g(a.value[c.value].label), 1),
        y[5] || (y[5] = o("span", { "aria-hidden": "true" }, "⌄", -1))
      ], 40, lo),
      (m(), Et(Hn, { to: "body" }, [
        Be(Qs, { name: "thinking-menu" }, {
          default: Js(() => [
            i.value ? (m(), b("section", {
              key: 0,
              id: ie(K),
              ref_key: "panel",
              ref: S,
              class: oe(["thinking-popover", { full: L.value, pulse: U.value }]),
              style: Wt(k.value),
              role: "dialog",
              "aria-label": "调整思考强度",
              onKeydown: Ut(Me(C, ["prevent", "stop"]), ["esc"])
            }, [
              o("header", null, [
                o("strong", null, g(t.value ? "Thinking effort" : "思考强度"), 1),
                o("output", null, g(L.value ? "✦ " : "") + g(a.value[c.value].label), 1)
              ]),
              o("div", {
                class: "thinking-track",
                style: Wt({ "--intensity": `${N.value}%` })
              }, [
                o("div", oo, [
                  y[6] || (y[6] = o("div", { class: "thinking-fill" }, null, -1)),
                  (m(!0), b(se, null, ke(a.value, (f, v) => (m(), b("span", {
                    key: v,
                    class: oe(["thinking-tick", { passed: N.value >= v * 25 }]),
                    style: Wt({ left: `${v * 25}%` })
                  }, null, 6))), 128))
                ]),
                o("input", {
                  ref_key: "range",
                  ref: E,
                  type: "range",
                  min: "0",
                  max: "100",
                  step: "0.1",
                  value: N.value,
                  "aria-label": "思考强度滑块",
                  "aria-valuetext": a.value[c.value].label,
                  onInput: F,
                  onChange: y[0] || (y[0] = (f) => N.value = c.value * 25),
                  onKeydown: [
                    y[1] || (y[1] = Ut(Me((f) => M(0), ["prevent"]), ["home"])),
                    y[2] || (y[2] = Ut(Me((f) => M(4), ["prevent"]), ["end"])),
                    y[3] || (y[3] = Ut(Me((f) => M(Math.min(4, c.value + 1)), ["prevent"]), ["arrow-right"])),
                    y[4] || (y[4] = Ut(Me((f) => M(Math.max(0, c.value - 1)), ["prevent"]), ["arrow-left"]))
                  ]
                }, null, 40, io),
                L.value ? (m(), b("span", uo)) : I("", !0)
              ], 4),
              o("div", co, [
                (m(!0), b(se, null, ke(a.value, (f, v) => (m(), b("button", {
                  key: f.value,
                  type: "button",
                  class: oe({ selected: c.value === v }),
                  "aria-pressed": c.value === v,
                  onClick: (T) => M(v)
                }, g(f.label), 11, po))), 128))
              ]),
              o("p", null, g(t.value ? c.value === 0 ? "Disable model reasoning" : L.value ? "Maximum effort" : "Drag to adjust; release to snap to a level" : c.value === 0 ? "不启用模型思考模式" : L.value ? "全力思考 · 已达到最高档" : "拖动滑块调整，松开后定位到对应档位"), 1),
              o("p", ho, g(t.value ? "Actual reasoning controls depend on the selected provider. Max may map to High." : "实际推理参数取决于供应商；最高档可能映射为高档。"), 1)
            ], 46, ao)) : I("", !0)
          ]),
          _: 1
        })
      ]))
    ], 2));
  }
}), Ht = O(null);
function gr() {
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
    const { confirmState: e, settle: t } = gr(), s = O(null), r = O(null);
    let a = null;
    const c = () => (document.documentElement.lang || "").startsWith("en"), i = () => e.value?.options.title || (c() ? "Confirm" : "请确认"), k = () => e.value?.options.confirmLabel || (c() ? "Confirm" : "确认"), _ = () => e.value?.options.cancelLabel || (c() ? "Cancel" : "取消");
    Te(() => !!e.value, async (E) => {
      E ? (a = document.activeElement, await Qe(), s.value?.focus(), r.value?.focus()) : (s.value = null, a?.focus?.());
    });
    function S(E) {
      if (!e.value) return;
      if (E.key === "Escape") {
        E.preventDefault(), t(!1);
        return;
      }
      if (E.key !== "Tab" || !s.value) return;
      const N = [...s.value.querySelectorAll("button:not(:disabled)")];
      if (!N.length) return;
      const U = N[0], L = N[N.length - 1];
      E.shiftKey && document.activeElement === U ? (E.preventDefault(), L.focus()) : !E.shiftKey && document.activeElement === L && (E.preventDefault(), U.focus());
    }
    return (E, N) => (m(), Et(Hn, { to: "body" }, [
      ie(e) ? (m(), b("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: N[2] || (N[2] = Me((U) => ie(t)(!1), ["self"])),
        onKeydown: S
      }, [
        o("section", {
          ref_key: "dialog",
          ref: s,
          class: "confirm-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          o("h2", null, g(i()), 1),
          o("p", null, g(ie(e).options.message), 1),
          o("footer", null, [
            o("button", {
              ref_key: "cancelBtn",
              ref: r,
              type: "button",
              onClick: N[0] || (N[0] = (U) => ie(t)(!1))
            }, g(_()), 513),
            o("button", {
              type: "button",
              class: oe(["confirm-primary", { danger: ie(e).options.danger !== !1 }]),
              onClick: N[1] || (N[1] = (U) => ie(t)(!0))
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
}, Ci = ["aria-label"], Li = {
  class: "todo-mark",
  "aria-hidden": "true"
}, Ii = { class: "todo-text" }, Oi = {
  key: 1,
  class: "compact-notice"
}, Pi = { class: "execution-options" }, Di = ["disabled", "title"], Ni = ["aria-label"], Mi = ["aria-selected", "onMousedown", "onMouseenter"], zi = { class: "slash-name" }, Fi = { class: "slash-desc" }, Ui = {
  key: 0,
  class: "attach-chips"
}, Bi = ["title"], Hi = ["aria-label", "title", "onClick"], ji = {
  key: 0,
  class: "attach-error"
}, Wi = ["disabled", "placeholder"], Vi = { class: "composer-actions" }, qi = ["disabled", "aria-label", "title"], Gi = ["disabled", "aria-label", "title"], Yi = ["aria-label", "title"], Zi = ["aria-expanded"], Ki = ["disabled"], Xi = { class: "muted" }, Qi = {
  class: "directory-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "选择工作区目录"
}, Ji = { class: "directory-roots" }, eu = ["disabled", "onClick"], tu = ["disabled"], nu = ["disabled"], su = ["disabled"], ru = {
  key: 0,
  class: "error"
}, lu = { key: 1 }, au = {
  key: 2,
  class: "directory-list"
}, ou = ["onClick"], iu = {
  key: 1,
  class: "muted"
}, uu = ["disabled"], cu = /* @__PURE__ */ qt({
  __name: "AgentsPage",
  setup(n) {
    const e = (u, p) => rt.value === "en" ? p : u, { confirm: t } = gr(), s = Cr(), r = O(localStorage.getItem("0kay.agent.selected") || ""), a = O(""), c = O([]), i = O(!1), k = O(""), _ = O(null);
    function S() {
      _.value?.click();
    }
    function E(u) {
      c.value.splice(u, 1);
    }
    async function N(u) {
      if (u.length) {
        i.value = !0, k.value = "";
        try {
          for (const p of u) {
            const d = new FormData();
            d.append("file", p);
            const R = await fetch("/api/files", { method: "POST", body: d });
            if (!R.ok) throw new Error(await R.text());
            const ee = await R.json();
            c.value.push({ name: ee.name || p.name, url: ee.url, mime: ee.mime || p.type || "application/octet-stream", size: ee.size ?? p.size });
          }
        } catch (p) {
          k.value = p.message;
        } finally {
          i.value = !1;
        }
      }
    }
    async function U(u) {
      const p = u.target, d = Array.from(p.files || []);
      p.value = "", await N(d);
    }
    function L(u) {
      const p = Array.from(u.clipboardData?.files || []);
      p.length && (u.preventDefault(), N(p));
    }
    const K = O(""), z = O("all"), Y = O("general"), le = O(!1), C = O(""), F = O(""), M = O(50);
    function ue(u) {
      const p = { off: 0, low: 20, medium: 50, high: 75, max: 100 };
      if (typeof u == "string" && u in p) return p[u];
      const d = Number(u ?? 50);
      return Number.isFinite(d) ? Math.max(0, Math.min(100, d)) : 50;
    }
    const ce = O("MOCR"), B = O("normal"), y = O("");
    async function f() {
      if (!(!y.value.trim() || !W.value || P.value)) {
        P.value = !0, te.value = "";
        try {
          const u = await fetch(`/api/agent/workspace?executor_id=${encodeURIComponent(W.value.plugin_id)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: j.value.path, name: y.value.trim() }) });
          if (!u.ok) throw new Error(await u.text());
          const p = await u.json();
          y.value = "", await Ze(p.path);
        } catch (u) {
          te.value = u.message;
        } finally {
          P.value = !1;
        }
      }
    }
    const v = O([]), T = O(!1), $ = O(!1), P = O(!1), te = O(""), j = O({ path: "", parent: "", roots: [], directories: [] }), ge = O(null), He = O("");
    let gt = null, at = 0, bn = "", Yt = !1;
    const Ct = O(!0);
    function X(u = r.value) {
      try {
        localStorage.setItem(`0kay.agent.editor:${u}`, JSON.stringify({ draft: a.value, mode: Y.value, ...yt() }));
      } catch {
      }
    }
    function ot() {
      at++, $.value = !1, P.value = !1;
    }
    function yn(u) {
      u.key === "Escape" && $.value && ot();
    }
    const _n = O([]);
    let Lt = !1;
    async function jn() {
      if (!Lt) {
        Lt = !0;
        try {
          const p = await (await fetch("/api/skills")).json(), d = p?.result?.skills ?? p?.skills;
          Array.isArray(d) ? _n.value = d : Lt = !1;
        } catch {
          Lt = !1;
        }
      }
    }
    const Wn = [{ name: "compact", description: e("压缩当前会话上下文", "Compact the session context") }], Zt = G(() => {
      const u = /^\/([^\s]*)$/.exec(a.value);
      return u ? u[1].toLowerCase() : null;
    }), mt = G(() => {
      const u = Zt.value;
      if (u === null) return [];
      const p = [
        ...Wn,
        ..._n.value.map((R) => ({ name: R.name, description: R.description || "" }))
      ], d = /* @__PURE__ */ new Set();
      return p.filter((R) => d.has(R.name) || !R.name.toLowerCase().startsWith(u) ? !1 : (d.add(R.name), !0)).slice(0, 8);
    }), vt = O(!1), Q = G(() => !vt.value && mt.value.length > 0), Ce = O(0);
    Te(mt, () => {
      Ce.value = 0;
    }), Te(Zt, (u) => {
      vt.value = !1, u !== null && jn();
    });
    const ae = O(null), It = O({});
    function Le() {
      const u = ae.value?.getBoundingClientRect();
      u && (It.value = {
        left: `${u.left}px`,
        width: `${u.width}px`,
        bottom: `${Math.max(8, window.innerHeight - u.top + 8)}px`
      });
    }
    const Ge = () => {
      Q.value && Le();
    };
    Te(Q, (u) => {
      u && Qe(Le);
    }), fn(() => {
      window.addEventListener("resize", Ge), window.addEventListener("scroll", Ge, !0);
    }), gn(() => {
      window.removeEventListener("resize", Ge), window.removeEventListener("scroll", Ge, !0);
    });
    function Kt(u) {
      a.value = "/" + u.name + " ", vt.value = !0, Qe(() => document.querySelector(".composer-input textarea")?.focus());
    }
    function Ye(u) {
      if (Q.value) {
        const p = mt.value.length;
        if (u.key === "ArrowDown") {
          u.preventDefault(), Ce.value = (Math.min(Ce.value, p - 1) + 1) % p;
          return;
        }
        if (u.key === "ArrowUp") {
          u.preventDefault(), Ce.value = (Math.min(Ce.value, p - 1) - 1 + p) % p;
          return;
        }
        if (u.key === "Enter" || u.key === "Tab") {
          u.preventDefault(), Kt(mt.value[Math.min(Ce.value, p - 1)]);
          return;
        }
        if (u.key === "Escape") {
          u.preventDefault(), vt.value = !0;
          return;
        }
      }
      u.key === "Enter" && !u.shiftKey && !u.isComposing && u.keyCode !== 229 && (u.preventDefault(), nn());
    }
    function wn() {
      const u = We.value;
      u && (Ct.value = u.scrollHeight - u.scrollTop - u.clientHeight < 100);
    }
    async function Ze(u = "") {
      if (!W.value) {
        xe.value = "请先选择在线执行器";
        return;
      }
      const p = ++at;
      bn = W.value.plugin_id, $.value = !0, P.value = !0, te.value = "";
      try {
        const d = await fetch(`/api/agent/workspace?${new URLSearchParams({ executor_id: W.value.plugin_id, path: u })}`);
        if (!d.ok) throw new Error(await d.text());
        const R = await d.json();
        p === at && (j.value = R);
      } catch (d) {
        p === at && (te.value = d.message);
      } finally {
        p === at && (P.value = !1);
      }
    }
    function xn() {
      !W.value || W.value.plugin_id !== bn || P.value || te.value || (C.value = W.value.plugin_id, F.value = j.value.path, $.value = !1);
    }
    async function Ot() {
      if (!T.value || !W.value || Yt || document.hidden) return;
      Yt = !0;
      const u = W.value.plugin_id;
      try {
        const p = await fetch(`/api/agent/host?executor_id=${encodeURIComponent(u)}`);
        if (!p.ok) throw new Error();
        const d = await p.json();
        W.value?.plugin_id === u && (ge.value = d);
      } catch {
        W.value?.plugin_id === u && (ge.value = null);
      } finally {
        Yt = !1;
      }
    }
    async function je() {
      if (!de.value || fe.value || J.value || de.value.state === "archived") return;
      const u = r.value;
      J.value = !0, xe.value = "", He.value = "正在压缩上下文…";
      try {
        const p = await fetch("/api/agent/compact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: u }) });
        if (!p.ok) throw new Error(await p.text());
        await p.json(), await s.fetchAgents(), He.value = "上下文已压缩。后续消息使用摘要；原始对话和工具记录仍然保留。", a.value.trim() === "/compact" && (a.value = "");
      } catch (p) {
        xe.value = p.message, He.value = "";
      } finally {
        J.value = !1;
      }
    }
    const Je = (u) => ({ background: `conic-gradient(var(--md-primary) ${Math.max(0, Math.min(100, u))}%, var(--md-outline-variant) 0)` }), W = G(() => C.value ? s.agents.find((u) => u.plugin_id === C.value) : s.agents.find((u) => s.isHealthy(u))), Pt = (u) => u === void 0 ? "—" : `${(u / 1024 ** 3).toFixed(1)} GiB`;
    function kt() {
      try {
        const u = JSON.parse(localStorage.getItem(`0kay.agent.editor:${r.value}`) || localStorage.getItem(`0kay.agent.options:${r.value}`) || "{}");
        C.value = u.executor_id || "", F.value = u.workdir || "", M.value = ue(u.thinking_intensity), ce.value = u.model_id || "MOCR", B.value = u.permission_mode === "full_access" ? "full_access" : "normal", a.value = u.draft || "", Y.value = u.mode || "general";
      } catch {
        C.value = "", F.value = "", M.value = 50, ce.value = "MOCR", a.value = "", Y.value = "general";
      }
    }
    const bt = O({});
    function Xt(u) {
      return `${u.provider_name || (u.provider_id ? bt.value[u.provider_id] : "") || u.provider_id || u.provider}/${u.id}`;
    }
    async function et() {
      try {
        const u = await fetch("/api/models");
        if (!u.ok) throw new Error(`模型目录 HTTP ${u.status}`);
        v.value = (await u.json()).models || [];
      } catch (u) {
        xe.value = u.message;
      }
      try {
        const u = await fetch("/api/providers");
        if (u.ok) {
          const p = (await u.json()).providers || [], d = {};
          for (const R of p) R.name && R.id && (d[R.id] = R.name);
          bt.value = d;
        }
      } catch {
      }
    }
    function yt() {
      const u = M.value === 0 ? "off" : M.value < 35 ? "low" : M.value < 62.5 ? "medium" : M.value < 87.5 ? "high" : "max";
      return { executor_id: C.value, workdir: F.value.trim(), thinking_intensity: u, model_id: ce.value, permission_mode: B.value, language: rt.value };
    }
    const J = O(!1), xe = O(""), Ke = O(!1), it = O(!1), ze = O([]), me = G(() => ze.value[ze.value.length - 1] || null), We = O(null), de = G(() => s.sessions.find((u) => u.session_id === r.value)), ut = (u) => u.caller_id !== "webui", Qt = G(() => s.sessions.filter((u) => (it.value ? u.state === "archived" : u.state !== "archived") && (z.value === "all" || (z.value === "life" ? ut(u) : !ut(u))) && (u.prompt || "").toLowerCase().includes(K.value.toLowerCase()))), Jt = G(() => s.tasks.filter((u) => u.kind === "agent" && u.session_id === r.value).sort((u, p) => (u.started_at || "").localeCompare(p.started_at || "") || u.task_id.localeCompare(p.task_id))), fe = G(() => s.tasks.find((u) => u.session_id === r.value && ["agent", "compact"].includes(u.kind || "") && ["running", "pending"].includes(u.state))), _t = G(() => {
      const u = s.tasks.filter((ee) => ee.session_id === r.value && ee.kind === "tool" && (ee.prompt || "").trim() === "todowrite").sort((ee, Ee) => (ee.started_at || "").localeCompare(Ee.started_at || "") || ee.task_id.localeCompare(Ee.task_id)), p = u[u.length - 1];
      if (!p) return [];
      const d = (ee) => {
        try {
          const Ee = JSON.parse(ee || "");
          return Array.isArray(Ee?.todos) ? Ee.todos : [];
        } catch {
          return [];
        }
      };
      return (d(p.result).length ? d(p.result) : d(p.args)).filter((ee) => ee && typeof ee.content == "string" && ee.status !== "cancelled");
    }), Dt = G(() => _t.value.filter((u) => u.status === "completed").length), tt = G(() => {
      const u = s.tasks.filter((p) => p.kind === "compact" && p.session_id === r.value && p.state === "done" && (p.result || "").trim());
      return u.length ? u.reduce((p, d) => (d.started_at || "") >= (p.started_at || "") ? d : p) : null;
    }), ye = (u) => (rt.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[u] || u, Ie = (u) => u ? new Date(u).toLocaleString() : "";
    function wt(u) {
      return s.tasks.filter((p) => p.task_id !== u.task_id && p.session_id === u.session_id && p.parent_id === u.task_id).sort((p, d) => (p.started_at || "").localeCompare(d.started_at || "") || p.task_id.localeCompare(d.task_id));
    }
    function ct(u) {
      return u ? s.tasks.filter((p) => p.task_id !== u.task_id && p.session_id === u.session_id && p.parent_id === u.task_id).sort((p, d) => (p.started_at || "").localeCompare(d.started_at || "") || p.task_id.localeCompare(d.task_id)) : [];
    }
    function Sn(u) {
      const p = [];
      for (const d of wt(u))
        p.push(d), d.kind === "subagent" && p.push(...Sn({ ...d, session_id: u.session_id }));
      return p;
    }
    function en(u) {
      ze.value = [...ze.value, u];
    }
    function tn() {
      ze.value = ze.value.slice(0, -1);
    }
    function Tn() {
      ze.value = [];
    }
    function xt(u) {
      if (!u?.result) return "";
      let p = u.result;
      try {
        const d = JSON.parse(p);
        typeof d == "string" ? p = d : d && typeof d.result == "string" && (p = d.result);
      } catch {
      }
      return !p.trim() || ct(u).some((d) => d.kind === "think" && (d.result || "").trim() === p.trim()) ? "" : p;
    }
    function nt(u) {
      return u ? /User denied permission for task/i.test(u) ? e("你拒绝了这次子 Agent 调用", "You denied this sub-agent call") : /User denied permission for (\S+)/i.test(u) ? e(`你拒绝了 ${RegExp.$1} 权限`, `You denied permission for ${RegExp.$1}`) : /Permission request expired/i.test(u) ? e("权限请求已超时", "Permission request expired") : u : "";
    }
    function dt(u) {
      return u.kind === "subagent" ? e("子 Agent", "Subagent") : u.kind === "tool" ? e("工具", "Tool") : u.kind === "think" ? e("模型", "Model") : u.kind || e("步骤", "Step");
    }
    function An(u) {
      return ct(u).length;
    }
    function Vn(u) {
      return Sn(u).some((p) => p.kind === "think" && p.result?.trim() === u.result?.trim());
    }
    async function pe(u) {
      if (!de.value || J.value || u === "delete" && !await t({
        title: e("删除会话", "Delete session"),
        message: e("永久删除此会话及其中的消息和工具记录？", "Permanently delete this session and its messages and tool records?"),
        confirmLabel: e("永久删除", "Delete"),
        danger: !0
      }))
        return;
      const p = r.value;
      J.value = !0;
      try {
        X(p), await s.manageSession(p, u), u === "delete" && (localStorage.removeItem(`0kay.agent.editor:${p}`), localStorage.removeItem(`0kay.agent.options:${p}`)), u !== "restore" ? (r.value = "", localStorage.removeItem("0kay.agent.selected")) : it.value = !1;
      } catch (d) {
        xe.value = d.message;
      } finally {
        J.value = !1;
      }
    }
    function st(u) {
      J.value || (X(), r.value = u, Ke.value = !1, localStorage.setItem("0kay.agent.selected", u));
    }
    async function qn() {
      J.value = !0, xe.value = "";
      try {
        const u = await s.createSession("新对话");
        X(), r.value = u, localStorage.setItem("0kay.agent.selected", u), Ke.value = !1, it.value = !1;
      } catch (u) {
        xe.value = u.message;
      } finally {
        J.value = !1;
      }
    }
    async function nn() {
      if (a.value.trim() === "/compact") {
        await je();
        return;
      }
      const u = c.value.length > 0;
      if (!(!a.value.trim() && !u || J.value || fe.value || de.value?.state === "archived")) {
        J.value = !0, xe.value = "";
        try {
          const p = yt(), d = a.value.trim() || e("请查看我上传的附件。", "Please review the attached files."), R = Y.value;
          if (!de.value) {
            const ee = await s.createSession(d.slice(0, 60));
            localStorage.setItem(`0kay.agent.editor:${ee}`, JSON.stringify({ ...p, draft: d, mode: R })), r.value = ee, localStorage.setItem("0kay.agent.selected", ee);
          }
          X(), u && (p.attachments = c.value.map((ee) => ({ ...ee }))), await s.sendTask(r.value, d, R, p), a.value = "", c.value = [], k.value = "", X(), Ct.value = !0, await Nt();
        } catch (p) {
          xe.value = p.message;
        } finally {
          J.value = !1;
        }
      }
    }
    async function sn() {
      if (!(!fe.value || fe.value.kind !== "agent"))
        try {
          await s.cancelTask(fe.value.task_id);
        } catch (u) {
          xe.value = u.message;
        }
    }
    async function Nt() {
      await Qe(), Ct.value && We.value?.scrollTo({ top: We.value.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return Te(() => s.tasks.filter((u) => u.session_id === r.value).map((u) => `${u.task_id}:${u.state}:${u.result?.length}`).join("|"), Nt), Te(r, () => {
      Ct.value = !0, Nt(), ot(), Tn(), xe.value = "";
    }), Te(r, kt), Te(C, () => {
      ge.value = null, F.value = "", ot(), Ot();
    }, { flush: "sync" }), Te(T, Ot), Te(r, () => {
      He.value = "";
    }), fn(() => {
      ma(), s.connect(), kt(), et(), gt = setInterval(Ot, 5e3), window.addEventListener("keydown", yn);
    }), gn(() => {
      X(), ot(), s.disconnect(), gt && clearInterval(gt), window.removeEventListener("keydown", yn);
    }), (u, p) => (m(), b(se, null, [
      o("main", mo, [
        o("aside", vo, [
          o("header", null, [
            p[20] || (p[20] = o("h1", null, "Agent", -1)),
            o("button", {
              onClick: qn,
              disabled: J.value,
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
              Re(" " + g(e("新对话", "New chat")), 1)
            ], 8, ko)
          ]),
          o("div", bo, [
            o("i", {
              class: oe({ online: ie(s).onlineCount > 0 })
            }, null, 2),
            Re(g(ie(s).onlineCount) + " " + g(e("个执行器在线", "executors online")) + " ", 1),
            o("button", {
              onClick: p[0] || (p[0] = (d) => ie(s).fetchAgents()),
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
          dn(o("input", {
            "onUpdate:modelValue": p[1] || (p[1] = (d) => K.value = d),
            placeholder: e("搜索会话…", "Search sessions…"),
            "aria-label": e("搜索会话", "Search sessions")
          }, null, 8, _o), [
            [Mn, K.value]
          ]),
          o("nav", wo, [
            (m(!0), b(se, null, ke([{ id: "all", label: e("全部", "All") }, { id: "life", label: e("LIFE 发起", "From LIFE") }, { id: "user", label: e("我的对话", "My chats") }], (d) => (m(), b("button", {
              key: d.id,
              class: oe({ chosen: z.value === d.id }),
              onClick: (R) => z.value = d.id
            }, g(d.label), 11, xo))), 128))
          ]),
          o("label", So, [
            dn(o("input", {
              "onUpdate:modelValue": p[2] || (p[2] = (d) => it.value = d),
              type: "checkbox"
            }, null, 512), [
              [Er, it.value]
            ]),
            Re(" " + g(e("显示已归档会话", "Show archived sessions")), 1)
          ]),
          o("div", To, [
            (m(!0), b(se, null, ke(Qt.value, (d) => (m(), b("button", {
              key: d.task_id,
              class: oe(["session-card", { selected: r.value === d.session_id && !Ke.value }]),
              disabled: J.value,
              onClick: (R) => st(d.session_id)
            }, [
              o("span", Eo, g(ut(d) ? "LIFE → Agent" : e("你 ↔ Agent", "You ↔ Agent")), 1),
              o("strong", null, g(d.prompt || "未命名会话"), 1),
              o("small", null, g(Ie(d.started_at)), 1)
            ], 10, Ao))), 128)),
            Qt.value.length ? I("", !0) : (m(), b("p", Ro, g(e("暂无会话。直接发送消息，或等待 LIFE 委派工作。", "No sessions yet. Send a message or wait for LIFE to delegate work.")), 1))
          ]),
          o("button", {
            class: oe(["ledger-button", { chosen: Ke.value }]),
            onClick: p[3] || (p[3] = (d) => Ke.value = !0)
          }, g(e("全部任务记录", "All task records")) + " · " + g(ie(s).tasks.length), 3)
        ]),
        Ke.value ? (m(), b("section", $o, [
          o("header", null, [
            o("h2", null, g(e("全部任务记录", "All task records")), 1),
            o("button", {
              onClick: p[4] || (p[4] = (d) => Ke.value = !1)
            }, g(e("返回会话", "Back to chat")), 1)
          ]),
          o("p", Co, g(e("包括 LIFE 对话、模型调用、Agent 执行及工具活动。", "LIFE conversations, model calls, Agent execution and tool activity.")), 1),
          (m(!0), b(se, null, ke(ie(s).tasks, (d) => (m(), b("article", {
            key: d.task_id,
            class: "ledger-entry"
          }, [
            o("div", null, [
              o("span", null, g(d.kind || "agent"), 1),
              o("span", {
                class: oe(d.state)
              }, g(ye(d.state)), 3),
              o("small", null, g(Ie(d.started_at)), 1)
            ]),
            o("p", null, g(d.prompt), 1),
            ie(s).sessions.some((R) => R.session_id === d.session_id) ? (m(), b("button", {
              key: 0,
              onClick: (R) => st(d.session_id)
            }, "打开所属会话", 8, Lo)) : I("", !0),
            o("details", null, [
              p[22] || (p[22] = o("summary", null, "详情", -1)),
              o("code", null, g(d.task_id), 1),
              o("pre", null, g(d.result || d.error || "等待结果"), 1)
            ])
          ]))), 128))
        ])) : (m(), b("section", Io, [
          o("header", Oo, [
            o("div", null, [
              o("h2", null, g(de.value?.prompt || "与 Agent 对话"), 1),
              o("p", null, g(de.value && ut(de.value) ? "LIFE 发起的工作会话 · 你可以查看过程，也可以直接继续对话" : "持续对话 · 编程、调研与工具执行"), 1)
            ]),
            fe.value ? (m(), b("span", Po, "正在执行")) : I("", !0),
            de.value ? (m(), b("div", Do, [
              o("button", {
                disabled: !!fe.value,
                onClick: p[5] || (p[5] = (d) => pe(de.value.state === "archived" ? "restore" : "archive"))
              }, g(de.value.state === "archived" ? "恢复" : "归档"), 9, No),
              o("button", {
                disabled: !!fe.value,
                onClick: p[6] || (p[6] = (d) => pe("delete"))
              }, "删除", 8, Mo)
            ])) : I("", !0)
          ]),
          xe.value || ie(s).error ? (m(), b("div", zo, g(xe.value || ie(s).error), 1)) : I("", !0),
          T.value ? (m(), b("section", Fo, [
            W.value ? (m(), b(se, { key: 0 }, [
              o("strong", null, g(W.value.host?.hostname || W.value.name), 1),
              o("span", {
                class: oe(ie(s).isHealthy(W.value) ? "done" : "failed")
              }, g(ie(s).isHealthy(W.value) ? "在线" : "离线"), 3),
              o("div", Uo, [
                (m(!0), b(se, null, ke([{ label: "CPU 占用", value: ge.value?.cpu_percent }, { label: "内存占用", value: ge.value?.memory_percent }], (d) => (m(), b("div", {
                  key: d.label,
                  class: "usage-metric"
                }, [
                  o("div", {
                    class: "usage-ring",
                    style: Wt(Je(d.value || 0))
                  }, [
                    o("b", null, g(d.value === void 0 ? "—" : `${d.value.toFixed(1)}%`), 1)
                  ], 4),
                  o("span", null, g(d.label), 1)
                ]))), 128)),
                o("small", null, g(ge.value ? `采样时间：${Ie(ge.value.sampled_at)}` : "等待宿主机实时采样"), 1)
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
            ], 64)) : (m(), b("p", Bo, "没有可用的执行器宿主机信息。"))
          ])) : I("", !0),
          o("div", {
            ref_key: "transcript",
            ref: We,
            class: "transcript",
            onScrollPassive: wn
          }, [
            me.value ? (m(), b("div", Ho, [
              o("header", jo, [
                o("button", {
                  type: "button",
                  onClick: tn
                }, "← " + g(ze.value.length > 1 ? e("返回上一层", "Back one level") : e("返回会话", "Back to chat")), 1),
                o("div", null, [
                  o("h3", null, g(e("子 Agent", "Subagent")), 1),
                  o("p", Wo, g(me.value.prompt), 1)
                ]),
                o("span", {
                  class: oe(me.value.state)
                }, g(ye(me.value.state)), 3)
              ]),
              o("div", Vo, [
                o("div", qo, [
                  o("div", Go, [
                    o("b", null, g(e("父 Agent", "Parent agent")), 1),
                    o("time", null, g(Ie(me.value.started_at)), 1)
                  ]),
                  o("div", Yo, g(me.value.prompt), 1)
                ]),
                (m(!0), b(se, null, ke(ct(me.value), (d) => (m(), b(se, {
                  key: d.task_id
                }, [
                  d.kind === "think" && (d.result || d.reasoning || d.state === "running" || d.error) ? (m(), b("div", Zo, [
                    d.prompt ? (m(), b("small", Ko, g(d.prompt), 1)) : I("", !0),
                    d.reasoning ? (m(), b("details", {
                      key: 1,
                      class: "think-chain",
                      open: d.state === "running" && !d.result
                    }, [
                      o("summary", null, g(e("思维链", "Reasoning")), 1),
                      o("pre", null, g(d.reasoning), 1)
                    ], 8, Xo)) : I("", !0),
                    d.result ? (m(), b(se, { key: 2 }, [
                      Be(cn, {
                        content: d.result
                      }, null, 8, ["content"]),
                      d.state === "running" ? (m(), b("span", Qo, " ▍")) : I("", !0)
                    ], 64)) : d.state === "running" ? (m(), b("small", Jo, g(e("子 Agent 正在生成回复…", "Subagent is drafting a reply…")), 1)) : I("", !0),
                    d.error ? (m(), b("p", ei, g(nt(d.error)), 1)) : I("", !0)
                  ])) : d.kind === "subagent" ? (m(), b("div", ti, [
                    o("button", {
                      type: "button",
                      class: "subagent-card-head",
                      onClick: (R) => en(d)
                    }, [
                      o("span", {
                        class: oe(d.state)
                      }, "●", 2),
                      o("strong", null, g(e("子 Agent", "Subagent")), 1),
                      o("span", si, g(d.prompt), 1),
                      o("small", null, g(ye(d.state)), 1),
                      p[30] || (p[30] = o("span", {
                        class: "subagent-chevron",
                        "aria-hidden": "true"
                      }, "▸", -1))
                    ], 8, ni)
                  ])) : d.kind === "tool" ? (m(), Et(Xs, {
                    key: 2,
                    step: d,
                    "format-error": nt
                  }, null, 8, ["step"])) : d.kind !== "think" ? (m(), b("details", ri, [
                    o("summary", null, [
                      o("span", {
                        class: oe(d.state)
                      }, "●", 2),
                      Re(" " + g(dt(d)) + " · " + g(d.prompt) + " ", 1),
                      o("small", null, g(ye(d.state)), 1)
                    ]),
                    o("pre", null, g(d.result || d.error || (d.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                  ])) : I("", !0)
                ], 64))), 128)),
                xt(me.value) ? (m(), b("div", li, [
                  Be(cn, {
                    content: xt(me.value)
                  }, null, 8, ["content"])
                ])) : I("", !0),
                me.value.error ? (m(), b("p", ai, g(nt(me.value.error)), 1)) : I("", !0),
                !ct(me.value).length && !xt(me.value) && !me.value.error ? (m(), b("p", oi, g(me.value.state === "running" ? e("子 Agent 正在执行…", "Subagent is running…") : e("没有子步骤记录", "No child steps recorded")), 1)) : I("", !0)
              ])
            ])) : (m(), b(se, { key: 1 }, [
              !Jt.value.length && !tt.value ? (m(), b("div", ii, [...p[31] || (p[31] = [
                o("h2", null, "想让 Agent 帮你做什么？", -1),
                o("p", null, "直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。", -1),
                o("p", null, "左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。", -1)
              ])])) : I("", !0),
              tt.value ? (m(), b("article", ui, [
                o("div", ci, [
                  o("strong", null, g(e("上下文摘要", "Context summary")), 1),
                  o("time", null, g(Ie(tt.value.started_at)), 1)
                ]),
                Be(cn, {
                  content: tt.value.result || ""
                }, null, 8, ["content"])
              ])) : I("", !0),
              (m(!0), b(se, null, ke(Jt.value, (d) => (m(), b("article", {
                key: d.task_id,
                class: "turn"
              }, [
                o("div", di, [
                  o("div", pi, [
                    o("b", null, g(ut(d) ? "LIFE" : "你"), 1),
                    o("time", null, g(Ie(d.started_at)), 1)
                  ]),
                  o("div", hi, g(d.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, "")), 1)
                ]),
                o("div", fi, [
                  o("div", gi, [
                    p[32] || (p[32] = o("b", null, "Agent", -1)),
                    o("span", {
                      class: oe(d.state)
                    }, g(ye(d.state)), 3)
                  ]),
                  wt(d).length ? (m(), b("div", mi, [
                    (m(!0), b(se, null, ke(wt(d), (R) => (m(), b(se, {
                      key: R.task_id
                    }, [
                      R.kind === "think" && (R.result || R.reasoning || R.state === "running" || R.error) ? (m(), b("div", vi, [
                        R.prompt ? (m(), b("small", ki, g(R.prompt), 1)) : I("", !0),
                        R.reasoning ? (m(), b("details", {
                          key: 1,
                          class: "think-chain",
                          open: R.state === "running" && !R.result
                        }, [
                          o("summary", null, g(e("思维链", "Reasoning")), 1),
                          o("pre", null, g(R.reasoning), 1)
                        ], 8, bi)) : I("", !0),
                        R.result ? (m(), b(se, { key: 2 }, [
                          Be(cn, {
                            content: R.result
                          }, null, 8, ["content"]),
                          R.state === "running" ? (m(), b("span", yi, " ▍")) : I("", !0)
                        ], 64)) : R.state === "running" ? (m(), b("small", _i, "Agent 正在生成回复…")) : I("", !0),
                        R.error ? (m(), b("p", wi, g(nt(R.error)), 1)) : I("", !0)
                      ])) : R.kind === "subagent" ? (m(), b("div", xi, [
                        o("button", {
                          type: "button",
                          class: "subagent-card-head",
                          onClick: (ee) => en(R)
                        }, [
                          o("span", {
                            class: oe(R.state)
                          }, "●", 2),
                          o("strong", null, g(e("子 Agent", "Subagent")), 1),
                          o("span", Ti, g(R.prompt), 1),
                          o("small", null, [
                            Re(g(ye(R.state)), 1),
                            An(R) ? (m(), b(se, { key: 0 }, [
                              Re(" · " + g(An(R)) + " " + g(e("步", "steps")), 1)
                            ], 64)) : I("", !0)
                          ]),
                          p[33] || (p[33] = o("span", {
                            class: "subagent-chevron",
                            "aria-hidden": "true"
                          }, "▸", -1))
                        ], 8, Si),
                        R.error ? (m(), b("p", Ai, g(nt(R.error)), 1)) : I("", !0)
                      ])) : R.kind === "tool" ? (m(), Et(Xs, {
                        key: 2,
                        step: R,
                        "format-error": nt
                      }, null, 8, ["step"])) : R.kind !== "think" ? (m(), b("details", Ei, [
                        o("summary", null, [
                          o("span", {
                            class: oe(R.state)
                          }, "●", 2),
                          Re(" " + g(dt(R)) + " · " + g(R.prompt) + " ", 1),
                          o("small", null, g(ye(R.state)), 1)
                        ]),
                        o("pre", null, g(R.result || R.error || (R.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                      ])) : I("", !0)
                    ], 64))), 128))
                  ])) : I("", !0),
                  d.result && !Vn(d) ? (m(), Et(cn, {
                    key: 1,
                    content: d.result
                  }, null, 8, ["content"])) : I("", !0),
                  d.error ? (m(), b("div", Ri, g(nt(d.error)), 1)) : I("", !0),
                  ["running", "pending"].includes(d.state) ? (m(), b("p", $i, "Agent 正在处理，执行过程会自动更新…")) : I("", !0)
                ])
              ]))), 128))
            ], 64))
          ], 544),
          me.value ? I("", !0) : (m(), b("form", {
            key: 2,
            class: "composer",
            onSubmit: Me(nn, ["prevent"])
          }, [
            _t.value.length ? (m(), b("section", {
              key: 0,
              class: "todo-panel",
              "aria-label": e("待办清单", "Todo list")
            }, [
              o("header", null, [
                o("strong", null, g(e("待办", "Todo")), 1),
                o("span", null, g(Dt.value) + "/" + g(_t.value.length), 1)
              ]),
              o("ul", null, [
                (m(!0), b(se, null, ke(_t.value, (d, R) => (m(), b("li", {
                  key: R,
                  class: oe(d.status)
                }, [
                  o("span", Li, g(d.status === "completed" ? "✓" : d.status === "in_progress" ? "◐" : "○"), 1),
                  o("span", Ii, g(d.content), 1)
                ], 2))), 128))
              ])
            ], 8, Ci)) : I("", !0),
            He.value ? (m(), b("div", Oi, g(He.value), 1)) : I("", !0),
            o("div", {
              class: oe(["options-collapse", { open: le.value }])
            }, [
              o("div", Pi, [
                o("label", null, [
                  Re(g(e("权限", "Permissions")), 1),
                  Be(Dn, {
                    modelValue: B.value,
                    "onUpdate:modelValue": p[7] || (p[7] = (d) => B.value = d),
                    "aria-label": e("权限", "Permissions"),
                    disabled: !!fe.value || J.value,
                    options: [{ value: "normal", label: e("Normal · 全部审批", "Normal · Ask every time") }, { value: "full_access", label: e("Full access · 自动执行", "Full access · Auto execute") }]
                  }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
                ]),
                o("label", null, [
                  Re(g(e("执行器", "Executor")), 1),
                  Be(Dn, {
                    modelValue: C.value,
                    "onUpdate:modelValue": p[8] || (p[8] = (d) => C.value = d),
                    "aria-label": e("执行器", "Executor"),
                    disabled: !!fe.value || J.value,
                    options: [{ value: "", label: e("自动选择在线执行器", "Automatic executor") }, ...ie(s).agents.map((d) => ({ value: d.plugin_id, label: `${d.host?.hostname || d.name} · ${d.plugin_id}`, disabled: !ie(s).isHealthy(d) }))]
                  }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
                ]),
                o("label", null, [
                  Re(g(e("工作区", "Workspace")), 1),
                  o("button", {
                    type: "button",
                    class: "workspace-select",
                    disabled: !!fe.value || J.value || !W.value,
                    title: F.value || W.value?.host?.workdir,
                    onClick: p[9] || (p[9] = (d) => Ze(F.value || W.value?.host?.workdir || ""))
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
                    Re(" " + g(F.value || e("选择目录…", "Select folder…")), 1)
                  ], 8, Di)
                ]),
                Be(fo, {
                  modelValue: M.value,
                  "onUpdate:modelValue": p[10] || (p[10] = (d) => M.value = d),
                  disabled: !!fe.value || J.value
                }, null, 8, ["modelValue", "disabled"]),
                o("label", null, [
                  Re(g(e("模型", "Model")), 1),
                  Be(Dn, {
                    modelValue: ce.value,
                    "onUpdate:modelValue": p[11] || (p[11] = (d) => ce.value = d),
                    searchable: "",
                    "aria-label": e("模型", "Model"),
                    disabled: !!fe.value || J.value,
                    onOpen: et,
                    options: [{ value: "MOCR", label: e("MOCR · 自动选型", "MOCR · Automatic") }, ...v.value.map((d) => ({ value: d.id, label: Xt(d) }))]
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
              onChange: U
            }, null, 544),
            o("div", {
              ref_key: "composerInput",
              ref: ae,
              class: "composer-input"
            }, [
              (m(), Et(Hn, { to: "body" }, [
                Q.value ? (m(), b("div", {
                  key: 0,
                  class: "slash-menu",
                  style: Wt(It.value),
                  role: "listbox",
                  "aria-label": e("技能与命令", "Skills and commands")
                }, [
                  (m(!0), b(se, null, ke(mt.value, (d, R) => (m(), b("button", {
                    key: d.name,
                    type: "button",
                    class: oe(["slash-item", { active: R === Ce.value }]),
                    role: "option",
                    "aria-selected": R === Ce.value,
                    onMousedown: Me((ee) => Kt(d), ["prevent"]),
                    onMouseenter: (ee) => Ce.value = R
                  }, [
                    o("span", zi, "/" + g(d.name), 1),
                    o("span", Fi, g(d.description), 1)
                  ], 42, Mi))), 128))
                ], 12, Ni)) : I("", !0)
              ])),
              c.value.length || k.value ? (m(), b("div", Ui, [
                (m(!0), b(se, null, ke(c.value, (d, R) => (m(), b("span", {
                  key: R,
                  class: "attach-chip",
                  title: `${d.mime} · ${d.size} B`
                }, [
                  Re(g(d.name) + " ", 1),
                  o("button", {
                    type: "button",
                    "aria-label": e("移除附件", "Remove attachment"),
                    title: e("移除", "Remove"),
                    onClick: (ee) => E(R)
                  }, "×", 8, Hi)
                ], 8, Bi))), 128)),
                k.value ? (m(), b("span", ji, g(k.value), 1)) : I("", !0)
              ])) : I("", !0),
              dn(o("textarea", {
                "onUpdate:modelValue": p[12] || (p[12] = (d) => a.value = d),
                disabled: J.value || de.value?.state === "archived",
                placeholder: de.value?.state === "archived" ? "恢复会话后可以继续对话" : "给 Agent 发消息…（Enter 发送，Shift+Enter 换行，可 Ctrl+V 粘贴图片/文件）",
                "aria-label": "给 Agent 发消息",
                onKeydown: Ye,
                onPaste: L
              }, null, 40, Wi), [
                [Mn, a.value]
              ]),
              o("div", Vi, [
                o("button", {
                  type: "button",
                  class: "attach-fly",
                  disabled: !!fe.value || J.value || i.value || de.value?.state === "archived",
                  "aria-label": e("添加附件", "Add attachment"),
                  title: i.value ? e("上传中…", "Uploading…") : e("添加附件（也可 Ctrl+V 粘贴）", "Attach (or Ctrl+V to paste)"),
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
                fe.value?.kind !== "agent" ? (m(), b("button", {
                  key: 0,
                  type: "submit",
                  class: "send-fly",
                  disabled: J.value || !!fe.value || !a.value.trim() || de.value?.state === "archived",
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
                ])], 8, Gi)) : (m(), b("button", {
                  key: 1,
                  type: "button",
                  class: "send-fly stop",
                  onClick: sn,
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
              o("button", {
                type: "button",
                class: oe(["options-toggle", { open: le.value }]),
                "aria-expanded": le.value,
                onClick: p[13] || (p[13] = (d) => le.value = !le.value)
              }, g(le.value ? e("收起", "Less") : e("设置", "Settings")), 11, Zi),
              Be(Dn, {
                modelValue: Y.value,
                "onUpdate:modelValue": p[14] || (p[14] = (d) => Y.value = d),
                disabled: J.value,
                "aria-label": e("Agent 模式", "Agent mode"),
                options: [{ value: "general", label: e("通用 Agent", "General Agent") }, { value: "code", label: e("编程 Agent", "Coding Agent") }, { value: "research", label: e("调研 Agent", "Research Agent") }, { value: "science", label: e("科学 Agent", "Science Agent") }]
              }, null, 8, ["modelValue", "disabled", "aria-label", "options"]),
              o("button", {
                type: "button",
                onClick: p[15] || (p[15] = (d) => T.value = !T.value)
              }, g(e("宿主机", "Host")), 1),
              o("button", {
                type: "button",
                disabled: !de.value || !!fe.value || J.value || de.value.state === "archived",
                onClick: je
              }, "/compact", 8, Ki),
              o("span", Xi, g(fe.value?.kind === "compact" ? e("上下文压缩中…", "Compacting…") : ie(s).onlineCount ? e("在当前会话中继续", "Continue this session") : e("执行器离线", "Executor offline")), 1)
            ])
          ], 32))
        ])),
        $.value ? (m(), b("div", {
          key: 2,
          class: "directory-backdrop",
          onClick: Me(ot, ["self"])
        }, [
          o("section", Qi, [
            o("header", null, [
              o("h2", null, "选择 " + g(W.value?.host?.hostname || "执行器") + " 的工作区", 1),
              o("button", { onClick: ot }, "关闭")
            ]),
            o("div", Ji, [
              (m(!0), b(se, null, ke(j.value.roots, (d) => (m(), b("button", {
                key: d,
                disabled: P.value,
                onClick: (R) => Ze(d)
              }, g(d), 9, eu))), 128)),
              o("button", {
                disabled: P.value,
                onClick: p[16] || (p[16] = (d) => Ze(W.value?.host?.workdir || ""))
              }, "默认目录", 8, tu)
            ]),
            o("code", null, g(j.value.path), 1),
            o("form", {
              class: "new-folder",
              onSubmit: Me(f, ["prevent"])
            }, [
              dn(o("input", {
                "onUpdate:modelValue": p[17] || (p[17] = (d) => y.value = d),
                placeholder: "新文件夹名称",
                "aria-label": "新文件夹名称",
                disabled: P.value
              }, null, 8, nu), [
                [Mn, y.value]
              ]),
              o("button", {
                disabled: P.value || !y.value.trim() || !j.value.path
              }, "新建文件夹", 8, su)
            ], 32),
            te.value ? (m(), b("p", ru, g(te.value), 1)) : I("", !0),
            P.value ? (m(), b("p", lu, "正在读取目录…")) : (m(), b("div", au, [
              j.value.parent !== j.value.path ? (m(), b("button", {
                key: 0,
                onClick: p[18] || (p[18] = (d) => Ze(j.value.parent))
              }, "上一级")) : I("", !0),
              (m(!0), b(se, null, ke(j.value.directories, (d) => (m(), b("button", {
                key: d.path,
                onClick: (R) => Ze(d.path)
              }, [
                p[38] || (p[38] = o("svg", {
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
                Re(" " + g(d.name), 1)
              ], 8, ou))), 128)),
              j.value.directories.length ? I("", !0) : (m(), b("p", iu, "没有子目录"))
            ])),
            o("footer", null, [
              o("button", {
                disabled: P.value || !!te.value || !j.value.path,
                onClick: xn
              }, "选择当前目录", 8, uu)
            ])
          ])
        ])) : I("", !0)
      ]),
      Be(go)
    ], 64));
  }
}), hu = /* @__PURE__ */ gs(cu, [["__scopeId", "data-v-18491eb8"]]);
export {
  hu as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('agent-plugin-style')){const s=document.createElement('style');s.id='agent-plugin-style';s.textContent=".markdown-content[data-v-ef377647]{line-height:1.75;overflow-wrap:anywhere;font-size:14px}.markdown-content[data-v-ef377647] pre{padding:16px;background:var(--md-surface-container);border-radius:8px;overflow:auto;white-space:pre;line-height:1.5}.markdown-content[data-v-ef377647] code{font-family:monospace;background:var(--md-surface-container);padding:2px 4px;border-radius:4px}.markdown-content[data-v-ef377647] pre code{padding:0;background:none}.markdown-content[data-v-ef377647] table{display:block;overflow:auto;border-collapse:collapse;margin:12px 0}.markdown-content[data-v-ef377647] th,.markdown-content[data-v-ef377647] td{border:1px solid var(--md-outline-variant);padding:8px 12px}.markdown-content[data-v-ef377647] blockquote{border-left:3px solid var(--md-outline);margin:12px 0;padding-left:14px;color:var(--md-on-surface-variant)}.markdown-content[data-v-ef377647] ul,.markdown-content[data-v-ef377647] ol{padding-left:24px}.markdown-content[data-v-ef377647] a{color:var(--md-primary);text-decoration:underline}.markdown-content[data-v-ef377647] img{max-width:100%}.markdown-content[data-v-ef377647] h1,.markdown-content[data-v-ef377647] h2,.markdown-content[data-v-ef377647] h3{margin:16px 0 8px}.tool-card[data-v-f13fbd25]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container);margin:8px 0;overflow:hidden}button.tool-card-head[data-v-f13fbd25]{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:none;border-radius:0;background:transparent;padding:10px 12px;cursor:pointer;font-size:13px}.tool-kind[data-v-f13fbd25]{flex-shrink:0;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--md-on-surface)}.tool-summary[data-v-f13fbd25]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font);font-size:13px;color:var(--md-on-surface)}.tool-stat[data-v-f13fbd25]{flex-shrink:0;font-size:12px;font-weight:600;color:var(--md-primary);border:1px solid var(--md-outline-variant);border-radius:999px;padding:1px 8px}.tool-state[data-v-f13fbd25]{flex-shrink:0;font-size:13px;color:var(--md-on-surface-variant)}.tool-chevron[data-v-f13fbd25]{flex-shrink:0;color:var(--md-on-surface-variant);font-size:12px;transition:transform .15s}.tool-card.expanded .tool-chevron[data-v-f13fbd25]{transform:rotate(90deg)}.tool-dot[data-v-f13fbd25]{font-size:9px}.tool-dot.running[data-v-f13fbd25],.tool-dot.pending[data-v-f13fbd25]{color:#b88412}.tool-dot.failed[data-v-f13fbd25]{color:var(--md-error,#c44)}.tool-dot.done[data-v-f13fbd25]{color:#3a6}.tool-dot.cancelled[data-v-f13fbd25]{color:var(--md-on-surface-variant)}.tool-card-body[data-v-f13fbd25]{padding:4px 12px 12px;border-top:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}.tool-section-label[data-v-f13fbd25]{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--md-on-surface-variant);margin-top:4px}.tool-card-body pre[data-v-f13fbd25]{margin:0;max-height:340px;overflow:auto;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);border-radius:8px;padding:8px 10px;font-family:var(--code-font);font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.tool-shot[data-v-f13fbd25]{margin:0;display:flex;flex-direction:column;gap:6px}.tool-shot img[data-v-f13fbd25]{width:100%;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest);display:block}.tool-shot figcaption[data-v-f13fbd25]{font-family:var(--code-font);font-size:11.5px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-section-text[data-v-f13fbd25]{margin:0;font-size:13px;overflow-wrap:anywhere}.tool-error[data-v-f13fbd25]{background:var(--md-error-container);padding:8px 12px;border-radius:8px;margin:0;font-size:12px;overflow-wrap:anywhere}.muted[data-v-f13fbd25]{font-size:12px;color:var(--md-on-surface-variant);margin:0}.tool-dialog-backdrop[data-v-f13fbd25]{position:fixed;inset:0;background:#0008;z-index:1050;display:grid;place-items:center;padding:20px}.tool-dialog[data-v-f13fbd25]{background:var(--md-surface);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:18px 20px;width:min(680px,100%);max-height:82vh;overflow:auto;display:flex;flex-direction:column;gap:12px}.tool-dialog header[data-v-f13fbd25]{display:flex;align-items:center;justify-content:space-between;gap:12px}.tool-dialog h4[data-v-f13fbd25]{margin:0;font-size:15px;overflow-wrap:anywhere;flex:1;min-width:0}#app .tool-dialog-close[data-v-f13fbd25],.tool-dialog-close[data-v-f13fbd25]{flex-shrink:0;width:40px;height:40px;min-height:0;padding:0;border:none;border-radius:50%;background:transparent;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}#app .tool-dialog-close[data-v-f13fbd25]:hover,.tool-dialog-close[data-v-f13fbd25]:hover{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent);box-shadow:none;filter:none;color:var(--md-on-surface)}#app .tool-dialog-close[data-v-f13fbd25]:active,.tool-dialog-close[data-v-f13fbd25]:active{background:color-mix(in srgb,var(--md-on-surface) 12%,transparent);border-radius:50%}.tool-search-results[data-v-f13fbd25]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}.tool-search-results a[data-v-f13fbd25]{color:var(--md-primary);font-size:14px;font-weight:500;text-decoration:none}.tool-search-results a[data-v-f13fbd25]:hover{text-decoration:underline}.tool-search-results p[data-v-f13fbd25]{margin:4px 0 0;font-size:13px;line-height:1.65;color:var(--md-on-surface)}.tool-search-results small[data-v-f13fbd25]{display:block;margin-top:2px;font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-card[data-v-f13fbd25]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent);background:var(--md-surface-container);transition:box-shadow .22s,background-color .2s}.tool-card[data-v-f13fbd25]:hover{box-shadow:var(--shadow-1)}button.tool-card-head[data-v-f13fbd25]{padding:12px 15px;gap:10px;min-height:46px;border-radius:0}button.tool-card-head[data-v-f13fbd25]:hover{background:var(--md-secondary-container)}.tool-kind[data-v-f13fbd25]{font-weight:700;letter-spacing:.06em}.tool-stat[data-v-f13fbd25]{border-color:color-mix(in srgb,var(--md-primary) 30%,transparent);background:color-mix(in srgb,var(--md-primary) 10%,transparent)}.tool-chevron[data-v-f13fbd25]{width:22px;height:22px;display:inline-grid;place-items:center;border-radius:50%;background:var(--md-surface-container-high);transition:transform .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}.tool-card-body[data-v-f13fbd25]{padding:8px 15px 15px;gap:8px;border-top-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-card-body pre[data-v-f13fbd25]{border-radius:14px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-section-label[data-v-f13fbd25]{font-weight:700}.diff-wrap[data-v-f13fbd25]{display:flex;flex-direction:column;gap:10px}.diff-file[data-v-f13fbd25]{border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);border-radius:14px;overflow:hidden;background:var(--md-surface-container-lowest)}.diff-file-head[data-v-f13fbd25]{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;background:var(--md-surface-container);font-size:11.5px;font-weight:650}.diff-file-path[data-v-f13fbd25]{font-family:var(--code-font);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.diff-file-stat[data-v-f13fbd25]{flex:none;font-family:var(--code-font);color:var(--md-on-surface-variant)}.diff-body[data-v-f13fbd25]{max-height:360px;overflow:auto;font-family:var(--code-font);font-size:12px;line-height:1.55;padding:4px 0}.diff-line[data-v-f13fbd25]{display:grid;grid-template-columns:40px 40px 18px 1fr;white-space:pre;min-width:max-content}.diff-no[data-v-f13fbd25]{text-align:right;padding:0 6px;color:var(--md-on-surface-variant);opacity:.6;user-select:none;font-variant-numeric:tabular-nums}.diff-sign[data-v-f13fbd25]{text-align:center;user-select:none;opacity:.9}.diff-text[data-v-f13fbd25]{padding-right:12px}.diff-line.add[data-v-f13fbd25]{background:color-mix(in srgb,#2ea043 20%,transparent);color:#116329}.diff-line.del[data-v-f13fbd25]{background:color-mix(in srgb,#cf222e 18%,transparent);color:#82071e}.diff-line.add .diff-sign[data-v-f13fbd25]{color:#116329;font-weight:700}.diff-line.del .diff-sign[data-v-f13fbd25]{color:#cf222e;font-weight:700}.diff-line.hunk[data-v-f13fbd25]{background:var(--md-surface-container);color:var(--md-on-surface-variant)}.diff-line.meta[data-v-f13fbd25]{color:var(--md-on-surface-variant);opacity:.75}@media (prefers-color-scheme: dark){.diff-line.add[data-v-f13fbd25],.diff-line.add .diff-sign[data-v-f13fbd25]{color:#7ee787}.diff-line.del[data-v-f13fbd25],.diff-line.del .diff-sign[data-v-f13fbd25]{color:#ffa198}}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color .14s,border-radius .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),color .14s}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.selected.highlighted{background:color-mix(in srgb,var(--md-primary-container) 88%,var(--md-primary) 12%)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-search{position:sticky;top:-8px;z-index:1;display:flex;align-items:center;gap:10px;margin:-8px -8px 8px;padding:13px 16px;background:var(--md-surface-container-low);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px 24px 0 0;color:var(--md-on-surface-variant)}.app-select-search input{flex:1;min-width:0;border:0;background:transparent;padding:0;font:inherit;color:var(--md-on-surface);outline:none}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity .18s var(--ease-emphasized,cubic-bezier(.2,0,0,1)),transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.select-menu-leave-active{transition:opacity .13s,transform .13s}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}.thinking-control{min-width:110px;flex:1;display:flex;flex-direction:column;gap:5px}.thinking-caption{font-size:12px}#app .thinking-trigger{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;padding:9px 12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);font-size:12px;border-radius:9px}.thinking-popover{position:fixed;z-index:10000;padding:16px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:0 10px 32px #16244026;color:var(--md-on-surface);font-family:var(--font-family)}.thinking-popover header{display:flex;justify-content:space-between;gap:12px;font-size:13px}.thinking-popover output{color:var(--md-primary);font-weight:600}.thinking-track{position:relative;padding:22px 4px 16px;display:flex;align-items:center}.thinking-track input{appearance:none;-webkit-appearance:none;width:100%;height:5px;padding:0;margin:0;border:0;border-radius:5px;background:linear-gradient(to right,var(--md-primary) var(--intensity),var(--md-outline-variant) var(--intensity));cursor:pointer;z-index:1}.thinking-track input::-webkit-slider-thumb{appearance:none;width:17px;height:17px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface);box-shadow:0 1px 4px #24345d40}.thinking-track input::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface)}.thinking-track input:focus-visible{outline:2px solid var(--md-primary);outline-offset:7px}.thinking-stops{display:flex;justify-content:space-between;gap:3px}.thinking-stops button{font:inherit;font-size:12px;border:0;background:transparent;color:var(--md-on-surface-variant);padding:6px 5px;border-radius:6px;cursor:pointer}.thinking-stops button.selected{background:var(--md-primary-container);color:var(--md-primary);font-weight:700}.thinking-popover p{font-size:12px;line-height:1.5;color:var(--md-on-surface-variant);margin:12px 0 0}.thinking-control.full .thinking-trigger,.thinking-popover.full{--md-primary:#a050db;border-color:#a050db88;box-shadow:0 0 16px #a050db25}.thinking-popover.full .energy-wave{position:absolute;inset:14px 0 8px;pointer-events:none;border-radius:20px;box-shadow:0 0 12px #a050db66}.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger{animation:thinking-boost .85s ease-out}.thinking-popover.pulse .energy-wave{animation:thinking-wave .85s ease-out}@keyframes thinking-boost{0%{box-shadow:0 0 #a050db66}45%{box-shadow:0 0 0 5px #a050db20,0 0 30px #a050db40}to{box-shadow:0 0 16px #a050db25}}@keyframes thinking-wave{0%{transform:scale(.95);opacity:1}to{transform:scale(1.15,2);opacity:0}}.thinking-menu-enter-active,.thinking-menu-leave-active{transition:opacity .13s,transform .13s}.thinking-menu-enter-from,.thinking-menu-leave-to{opacity:0;transform:translateY(4px)}@media (prefers-reduced-motion:reduce){.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger,.thinking-popover.pulse .energy-wave{animation:none}}.thinking-popover{padding:20px;border-radius:28px;background:var(--md-surface-container-low);border-color:transparent;box-shadow:0 8px 28px #24345d24}.thinking-popover header{align-items:center;font-size:14px;min-height:30px}.thinking-popover output{padding:6px 12px;border-radius:999px;background:var(--md-primary-container);font-size:12px}.thinking-track{height:68px;padding:0;margin:12px 0 0;isolation:isolate}.thinking-capsule{position:absolute;left:5px;right:5px;height:28px;border-radius:999px;background:var(--md-primary-container);overflow:hidden;pointer-events:none}.thinking-fill{height:100%;width:var(--intensity);background:var(--md-primary);border-radius:999px}.thinking-tick{position:absolute;top:50%;width:4px;height:4px;border-radius:50%;background:var(--md-primary);transform:translate(-50%,-50%)}.thinking-tick:first-of-type{left:8px!important}.thinking-tick:last-of-type{left:calc(100% - 8px)!important}.thinking-tick.passed{background:var(--md-on-primary)}.thinking-track input{position:relative;height:48px;background:transparent;border-radius:999px;touch-action:pan-y}.thinking-track input::-webkit-slider-runnable-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-webkit-slider-thumb{width:10px;height:44px;margin-top:-8px;border-radius:999px;border:0;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low);transition:width .14s,height .14s,margin-top .14s}.thinking-track input:active::-webkit-slider-thumb{width:6px;height:48px;margin-top:-10px}.thinking-track input::-moz-range-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-moz-range-thumb{width:10px;height:44px;border:0;border-radius:999px;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low)}.thinking-track input:active::-moz-range-thumb{width:6px;height:48px}.thinking-track input:focus-visible{outline-offset:3px}.thinking-stops{align-items:center;gap:2px;margin-top:2px}.thinking-stops button{border-radius:999px;min-height:30px;padding:6px 9px;transition:background-color .16s,color .16s}.thinking-popover.full{background:color-mix(in srgb,var(--md-surface-container-low) 93%,#a050db);border-color:#a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#7255c8,#ad50d6)}.thinking-popover.full .energy-wave{inset:18px 5px;border-radius:999px;z-index:-1}.thinking-popover p{margin-top:12px}.thinking-popover.full{box-shadow:0 8px 28px #24345d24,0 0 34px #a050db33;border-color:#a050db77}.thinking-popover.full .energy-wave{position:absolute;inset:-3px 4px;border-radius:999px;z-index:-1;background:radial-gradient(70% 120% at 100% 50%,#c56bffbb,transparent 68%),radial-gradient(50% 120% at 0% 50%,#6b8cffaa,transparent 70%);filter:blur(7px);animation:thunder-glow 1.7s ease-in-out infinite}@keyframes thunder-glow{0%,to{opacity:.5;transform:scale(1)}45%{opacity:1;transform:scale(1.03)}}.thinking-popover.full .thinking-capsule{box-shadow:0 0 0 1px #a050db66,0 0 26px #a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#6b8cff,#a050db,#e0a3ff,#a050db);background-size:280% 100%;animation:thunder-flow 2.6s linear infinite}@keyframes thunder-flow{to{background-position:280% 0}}.thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-control.full .thinking-trigger span:first-child{animation:thunder-flicker 2s steps(1,end) infinite}@keyframes thunder-flicker{0%,90%,to{opacity:1}92%{opacity:.35}94%{opacity:1}96%{opacity:.5}}#app .thinking-control .thinking-trigger{min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:13px;font-weight:500;align-items:center;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .thinking-control .thinking-trigger:hover{background:var(--md-surface-container-highest)}#app .thinking-control .thinking-trigger[aria-expanded=true]{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-caption{font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.workspace[data-v-18491eb8]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}button[data-v-18491eb8],input[data-v-18491eb8],textarea[data-v-18491eb8],select[data-v-18491eb8]{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);padding:9px 12px}button[data-v-18491eb8]{cursor:pointer;transition:background .15s,box-shadow .15s,filter .15s}button[data-v-18491eb8]:disabled{opacity:.45;cursor:default}button[data-v-18491eb8]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}input[data-v-18491eb8]:focus,textarea[data-v-18491eb8]:focus,select[data-v-18491eb8]:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}input[type=checkbox][data-v-18491eb8]{width:auto;accent-color:var(--md-primary)}.sessions[data-v-18491eb8]{width:284px;flex-shrink:0;border-right:1px solid var(--md-outline-variant);padding:20px 16px;display:flex;flex-direction:column;gap:14px;background:var(--md-surface-container-low)}.sessions header[data-v-18491eb8]{display:flex;align-items:center;justify-content:space-between;gap:12px}.sessions h1[data-v-18491eb8]{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}.sessions header>button[data-v-18491eb8]{height:34px;padding:0 13px;border:0;border-radius:9px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:600 13px/1 inherit}.sessions header>button[data-v-18491eb8]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.08);box-shadow:var(--shadow-1)}.sessions>input[data-v-18491eb8]{border-radius:10px;background:var(--md-surface-container-lowest)}.connection[data-v-18491eb8]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}.connection button[data-v-18491eb8]{margin-left:auto;padding:3px 9px;border-radius:8px;font-size:13px}.connection i[data-v-18491eb8]{width:8px;height:8px;border-radius:50%;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}.connection i.online[data-v-18491eb8]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.filter-bar[data-v-18491eb8]{display:flex;gap:3px;padding:4px;border-radius:999px;background:var(--md-surface-container-high)}.filter-bar button[data-v-18491eb8]{flex:1;font-size:12px;font-weight:500;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);box-shadow:none}.filter-bar button[data-v-18491eb8]:hover:not(:disabled){background:transparent;color:var(--md-on-surface)}.filter-bar button.chosen[data-v-18491eb8]{background:var(--md-surface-container-lowest);color:var(--md-primary);font-weight:650;box-shadow:var(--shadow-1)}.sessions label input[data-v-18491eb8]{margin-right:6px}.session-list[data-v-18491eb8]{overflow-y:auto;flex:1;min-height:0;margin:0 -4px;padding:0 4px}.session-card[data-v-18491eb8]{display:flex;flex-direction:column;width:100%;text-align:left;gap:6px;margin-bottom:8px;padding:12px 13px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest)}.session-card[data-v-18491eb8]:hover:not(:disabled){background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.session-card.selected[data-v-18491eb8]{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}.session-card.selected[data-v-18491eb8]:hover{background:var(--md-secondary-container)}.session-card strong[data-v-18491eb8]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:600;font-size:14px}.origin[data-v-18491eb8],small[data-v-18491eb8],.sessions .muted[data-v-18491eb8]{font-size:12px;color:var(--md-on-surface-variant)}.origin[data-v-18491eb8]{font-weight:600;letter-spacing:.02em}.ledger-button[data-v-18491eb8]{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:13px;font-weight:550}.ledger-button.chosen[data-v-18491eb8]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.ledger[data-v-18491eb8]{flex:1;overflow-y:auto;padding:var(--space-xl)}.ledger>header[data-v-18491eb8]{margin-bottom:8px}.ledger>header h2[data-v-18491eb8]{font-size:18px;font-weight:650}.ledger-entry[data-v-18491eb8]{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:14px 16px;margin:10px 0;box-shadow:var(--shadow-1)}.ledger-entry>div[data-v-18491eb8]{display:flex;align-items:center;gap:10px;font-size:12px}.ledger-entry>div>span[data-v-18491eb8]:first-child{font-family:var(--code-font);background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-weight:600}.ledger-entry>div small[data-v-18491eb8]{margin-left:auto}.ledger-entry>p[data-v-18491eb8]{margin:8px 0;font-size:14px;line-height:1.6;overflow-wrap:anywhere}.ledger-entry details[data-v-18491eb8]{margin-top:8px;border-radius:10px;background:var(--md-surface-container);padding:8px 12px;font-size:12px}.ledger-entry summary[data-v-18491eb8]{cursor:pointer;color:var(--md-on-surface-variant)}.ledger-entry pre[data-v-18491eb8]{margin:8px 0 0;max-height:300px}.conversation[data-v-18491eb8]{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}.conversation-header[data-v-18491eb8]{display:flex;align-items:flex-start;gap:14px}.conversation-header>div[data-v-18491eb8]:first-child{flex:1;min-width:0}.conversation-header h2[data-v-18491eb8]{font-size:17px;font-weight:650;margin:0}.conversation-header p[data-v-18491eb8]{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:13px}.session-actions[data-v-18491eb8]{display:flex;gap:8px;flex-shrink:0}.session-actions button[data-v-18491eb8]{height:32px;padding:0 13px;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.running[data-v-18491eb8]{color:#b88412;font-weight:650;font-size:12px}.failed[data-v-18491eb8]{color:var(--md-error)}.done[data-v-18491eb8]{color:var(--md-success);font-weight:600;font-size:12px}.cancelled[data-v-18491eb8],.muted[data-v-18491eb8]{color:var(--md-on-surface-variant)}.muted[data-v-18491eb8]{font-size:12px;line-height:1.6}.error[data-v-18491eb8]{background:var(--md-error-container);color:#410e0b;padding:11px 16px;border-radius:12px;margin:8px 0;font-size:13px;overflow-wrap:anywhere}.transcript[data-v-18491eb8]{flex:1;overflow-y:auto;padding:26px 28px;min-height:0}.context-summary[data-v-18491eb8]{max-width:920px;margin:0 auto 22px;padding:14px 18px;border:1px dashed var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-low)}.context-summary-head[data-v-18491eb8]{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.context-summary-head strong[data-v-18491eb8]{font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--md-primary)}.context-summary-head time[data-v-18491eb8]{font-size:12px;opacity:.75}.welcome[data-v-18491eb8]{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}.welcome[data-v-18491eb8]:before{content:\"\";display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center}.welcome h2[data-v-18491eb8]{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}.welcome p[data-v-18491eb8]{margin:6px 0;font-size:14px}.turn[data-v-18491eb8]{max-width:920px;margin:0 auto 30px;display:flex;flex-direction:column;gap:10px}.bubble[data-v-18491eb8]{padding:15px 19px;font-size:14px}.bubble.user[data-v-18491eb8]{align-self:flex-end;max-width:82%;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:16px 16px 4px}.bubble.agent[data-v-18491eb8]{align-self:flex-start;max-width:100%;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:16px 16px 16px 4px;box-shadow:var(--shadow-1)}.bubble .message-head[data-v-18491eb8]{display:flex;align-items:center;gap:14px;margin-bottom:10px;font-size:12px}.bubble .message-head b[data-v-18491eb8]{font-weight:700}.bubble .message-head time[data-v-18491eb8]{margin-left:auto;opacity:.75;font-size:12px}.bubble .message-head span[data-v-18491eb8]{margin-left:auto}.bubble.user .message-head[data-v-18491eb8]{margin-bottom:7px;opacity:.85}.message-text[data-v-18491eb8]{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}.bubble.agent[data-v-18491eb8] p{margin:.4em 0}.bubble.agent[data-v-18491eb8] pre{max-height:420px}.agent-speech[data-v-18491eb8]{margin:6px 0;padding:2px 0;line-height:1.7}.model-annotation[data-v-18491eb8]{display:block;font-size:12px;opacity:.7;margin-bottom:4px;font-family:var(--code-font)}.think-chain[data-v-18491eb8]{margin:2px 0 8px;border:0;border-radius:10px;background:var(--md-surface-container-low);overflow:hidden}.think-chain>summary[data-v-18491eb8]{display:inline-flex;align-items:center;gap:5px;cursor:pointer;list-style:none;padding:3px 10px;font-size:11px;font-weight:600;letter-spacing:.03em;color:var(--md-on-surface-variant);user-select:none;border-radius:999px;background:var(--md-surface-container)}.think-chain>summary[data-v-18491eb8]::-webkit-details-marker{display:none}.think-chain>summary[data-v-18491eb8]:before{content:\"▸\";display:inline-block;transition:transform .15s}.think-chain[open]>summary[data-v-18491eb8]:before{transform:rotate(90deg)}.think-chain>pre[data-v-18491eb8]{margin:0;padding:6px 10px 8px;max-height:180px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--code-font);font-size:11.5px;line-height:1.55;color:var(--md-on-surface-variant)}.agent-speech[data-v-18491eb8] p{margin:.45em 0}.agent-speech[data-v-18491eb8] pre{background:var(--md-surface-container);border:1px solid var(--md-outline-variant);border-radius:10px;padding:12px 14px;max-height:460px;overflow:auto;font-size:13px}.agent-speech[data-v-18491eb8] code{font-family:var(--code-font)}.agent-speech[data-v-18491eb8] ul{padding-left:20px;margin:.4em 0}.steps[data-v-18491eb8]{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}.steps details[data-v-18491eb8]{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}.steps summary[data-v-18491eb8]{cursor:pointer;font-size:13px;font-weight:550}.steps summary small[data-v-18491eb8]{margin-left:10px;font-weight:600}.steps summary[data-v-18491eb8]::marker{color:var(--md-on-surface-variant)}.steps details pre[data-v-18491eb8]{margin:10px 0 0;font-family:var(--code-font);font-size:13px;white-space:pre-wrap;max-height:400px}pre[data-v-18491eb8]{max-height:450px;overflow:auto;font-family:var(--code-font)}.subagent-card[data-v-18491eb8]{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}button.subagent-card-head[data-v-18491eb8]{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;border-radius:0;background:transparent;padding:11px 14px;font-size:13px}button.subagent-card-head[data-v-18491eb8]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}button.subagent-card-head>span[data-v-18491eb8]:first-child{color:var(--md-primary)}button.subagent-card-head>strong[data-v-18491eb8]{font-weight:700}.subagent-prompt[data-v-18491eb8]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--md-on-surface)}.subagent-card small[data-v-18491eb8]{font-weight:600}.subagent-chevron[data-v-18491eb8]{color:var(--md-on-surface-variant);font-size:12px}.subagent-card-error[data-v-18491eb8]{margin:0 10px 10px;padding:8px 12px;font-size:12px}.subagent-card.nested[data-v-18491eb8]{margin:6px 0;box-shadow:none}.sub-view[data-v-18491eb8]{max-width:900px;margin:0 auto}.sub-view-header[data-v-18491eb8]{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}.sub-view-header button[data-v-18491eb8]{flex-shrink:0;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.sub-view-header h3[data-v-18491eb8]{margin:0 0 4px;font-size:16px;font-weight:650}.sub-view-header p[data-v-18491eb8]{margin:0;max-width:520px}.sub-view-header>span[data-v-18491eb8]{margin-left:auto;font-weight:650;font-size:12px}.sub-view-body[data-v-18491eb8]{min-height:120px}.todo-panel[data-v-18491eb8]{padding:12px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);max-height:170px;overflow:auto;animation:panel-in-18491eb8 .22s cubic-bezier(.2,0,0,1) both}.todo-panel>header[data-v-18491eb8]{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant);text-transform:uppercase}.todo-panel>header span[data-v-18491eb8]{font-weight:700;color:var(--md-primary)}.todo-panel ul[data-v-18491eb8]{list-style:none;margin:9px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}.todo-panel li[data-v-18491eb8]{display:flex;align-items:flex-start;gap:9px;font-size:13px;line-height:1.5;color:var(--md-on-surface);animation:panel-in-18491eb8 .22s ease both;transition:opacity .2s,color .2s}.todo-panel li.completed[data-v-18491eb8]{opacity:.6}.todo-panel li.completed .todo-text[data-v-18491eb8]{text-decoration:line-through}.todo-panel li.in_progress .todo-text[data-v-18491eb8]{font-weight:650}.todo-mark[data-v-18491eb8]{flex:none;width:16px;text-align:center;color:var(--md-primary);transition:color .2s,transform .2s}.todo-panel li.completed .todo-mark[data-v-18491eb8]{color:var(--md-success,#3ba55c)}.composer[data-v-18491eb8]{flex-shrink:0;margin:0 20px 18px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-lowest);overflow:visible;box-shadow:var(--shadow-1)}.composer-input[data-v-18491eb8]{position:relative}.composer-input textarea[data-v-18491eb8]{font-size:14px;width:100%;display:block;min-height:96px;padding:15px 112px 15px 16px;line-height:1.6;resize:vertical;border:0;border-radius:0;background:transparent}.composer-input textarea[data-v-18491eb8]:focus{box-shadow:none;border:0}.slash-menu[data-v-18491eb8]{position:fixed;z-index:10000;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:14px;box-shadow:var(--shadow-3);padding:6px;max-height:min(320px,42vh);overflow:auto}.slash-item[data-v-18491eb8]{display:flex;align-items:baseline;gap:10px;width:100%;text-align:left;padding:8px 10px;border:0;border-radius:10px;background:transparent;color:var(--md-on-surface);cursor:pointer}.slash-item.active[data-v-18491eb8]{background:var(--md-secondary-container)}.slash-name[data-v-18491eb8]{flex:none;font-family:var(--code-font);font-weight:650;font-size:13px;color:var(--md-primary)}.slash-desc[data-v-18491eb8]{font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.attach-chips[data-v-18491eb8]{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 16px 0}.composer-actions[data-v-18491eb8]{position:absolute;right:10px;bottom:10px;z-index:2;display:flex;align-items:center;gap:8px}.attach-fly[data-v-18491eb8]{width:42px;height:42px;flex:none;aspect-ratio:1/1;display:grid;place-items:center;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.attach-fly svg[data-v-18491eb8]{width:18px;height:18px}.attach-fly[data-v-18491eb8]:hover:not(:disabled){filter:brightness(1.05)}.attach-fly[data-v-18491eb8]:disabled{opacity:.5;cursor:default}.attach-chip[data-v-18491eb8]{display:inline-flex;align-items:center;gap:6px;max-width:220px;font-size:12px;padding:4px 6px 4px 10px;border-radius:999px;background:var(--md-surface-container);border:1px solid var(--md-outline-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.attach-chip button[data-v-18491eb8]{border:0;background:transparent;cursor:pointer;font-size:14px;line-height:1;padding:0 4px;color:var(--md-on-surface-variant)}.attach-chip button[data-v-18491eb8]:hover{color:var(--md-error)}.attach-error[data-v-18491eb8]{font-size:12px;color:var(--md-error)}.send-fly[data-v-18491eb8]{width:42px;height:42px;flex:none;aspect-ratio:1/1;display:grid;place-items:center;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-primary);color:var(--md-on-primary,#fff);box-shadow:0 2px 10px color-mix(in srgb,var(--md-primary) 38%,transparent)}.send-fly svg[data-v-18491eb8]{width:20px;height:20px}.send-fly[data-v-18491eb8]:hover:not(:disabled){filter:brightness(1.08)}.send-fly[data-v-18491eb8]:disabled{background:var(--md-surface-container);color:var(--md-on-surface-variant);opacity:.7;box-shadow:none}.send-fly.stop[data-v-18491eb8]{background:var(--md-error);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--md-error) 40%,transparent)}.compact-notice[data-v-18491eb8]{font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}.options-collapse[data-v-18491eb8]{max-height:0;overflow:hidden;transition:max-height .3s cubic-bezier(.2,0,0,1)}.options-collapse.open[data-v-18491eb8]{max-height:360px}.options-toggle[data-v-18491eb8]{display:inline-flex;align-items:center;gap:6px;transition:background-color .18s,color .18s}.options-toggle.open[data-v-18491eb8]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.execution-options[data-v-18491eb8]{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}.execution-options label[data-v-18491eb8]{display:flex;flex-direction:column;gap:5px;font-size:12px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}.execution-options[data-v-18491eb8] .app-select-trigger,.execution-options .workspace-select[data-v-18491eb8]{width:100%;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}.workspace-select[data-v-18491eb8]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}.composer footer[data-v-18491eb8]{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap;border-top:1px solid var(--md-outline-variant)}.composer footer>select[data-v-18491eb8],.composer footer>.app-select[data-v-18491eb8]{font-size:13px;border-radius:10px;min-height:34px}.composer footer .muted[data-v-18491eb8]{flex:1;min-width:120px}.composer footer>button[data-v-18491eb8]{font-size:13px;font-weight:600;border-radius:9px;min-height:34px}.host-panel>strong[data-v-18491eb8]{font-size:14px}.host-panel dl[data-v-18491eb8]{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px}.host-panel dt[data-v-18491eb8]{color:var(--md-on-surface-variant);font-weight:600}.host-panel dd[data-v-18491eb8]{margin:4px 0 0;overflow-wrap:anywhere}.usage-rings[data-v-18491eb8]{display:flex;align-items:center;gap:24px;padding:14px 0;flex-wrap:wrap}.usage-metric[data-v-18491eb8]{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}.usage-ring[data-v-18491eb8]{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}.usage-ring b[data-v-18491eb8]{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:15px;font-weight:650;box-shadow:var(--shadow-1)}.new-folder[data-v-18491eb8]{display:flex;gap:8px}.new-folder input[data-v-18491eb8]{flex:1;min-width:0}.directory-backdrop[data-v-18491eb8]{position:fixed;inset:0;background:#14111acc;z-index:1000;display:grid;place-items:center;padding:20px}.directory-dialog[data-v-18491eb8]{background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:20px;padding:22px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh;box-shadow:var(--shadow-4)}.directory-dialog>header[data-v-18491eb8]{gap:12px}.directory-dialog>header h2[data-v-18491eb8]{font-size:16px;font-weight:650}.directory-list[data-v-18491eb8]{overflow:auto;min-height:180px;display:flex;flex-direction:column;gap:6px}.directory-list button[data-v-18491eb8]{text-align:left;border-radius:10px;background:var(--md-surface-container-low);font-size:13px}.directory-roots[data-v-18491eb8]{display:flex;gap:8px;flex-wrap:wrap}.directory-roots button[data-v-18491eb8]{border-radius:999px;font-size:12px;padding:6px 12px}.directory-dialog code[data-v-18491eb8]{overflow-wrap:anywhere;font-size:12px;background:var(--md-surface-container);padding:8px 10px;border-radius:8px}.directory-dialog>footer[data-v-18491eb8]{display:flex;justify-content:flex-end}.directory-dialog>footer button[data-v-18491eb8]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;font-weight:600}.permission-request[data-v-18491eb8]{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}.permission-request small[data-v-18491eb8]{display:block;margin:8px 0}.permission-request pre[data-v-18491eb8]{max-height:160px;overflow:auto}.permission-request>div[data-v-18491eb8]{display:flex;justify-content:flex-end;gap:8px}#app .workspace[data-v-18491eb8]{gap:12px;padding-left:6px;background:var(--md-surface-container)}#app .workspace .sessions[data-v-18491eb8]{width:296px;gap:14px;padding:18px 14px;border:0;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .workspace .sessions h1[data-v-18491eb8]{font-size:24px;font-weight:800;letter-spacing:-.02em}#app .workspace .sessions header>button[data-v-18491eb8]{height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 13px/1 inherit;display:inline-flex;align-items:center;gap:7px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .workspace .sessions header>button[data-v-18491eb8]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.06);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .sessions>input[data-v-18491eb8]{min-height:48px;padding:0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:14px}#app .workspace .sessions>input[data-v-18491eb8]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .workspace .filter-bar[data-v-18491eb8]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .workspace .filter-bar button[data-v-18491eb8]{border-radius:999px;padding:8px 4px;font-weight:600}#app .workspace .filter-bar button.chosen[data-v-18491eb8]{background:var(--md-primary);color:var(--md-on-primary,#fff);font-weight:700;box-shadow:var(--shadow-1)}#app .workspace .filter-bar button.chosen[data-v-18491eb8]:hover:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff)}#app .workspace .session-list[data-v-18491eb8]{margin:0 -2px;padding:0 2px}#app .workspace .session-card[data-v-18491eb8]{gap:5px;margin-bottom:8px;padding:13px 15px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:18px;background:var(--md-surface-container-lowest);transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .2s,border-color .2s,box-shadow .22s,border-radius .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .workspace .session-card[data-v-18491eb8]:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-1);border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant))}#app .workspace .session-card.selected[data-v-18491eb8]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent;border-radius:20px 20px 20px 7px;box-shadow:var(--shadow-1)}#app .workspace .session-card .origin[data-v-18491eb8]{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:12px;color:var(--md-primary)}#app .workspace .session-card.selected .origin[data-v-18491eb8]{color:var(--md-on-secondary-container);opacity:.75}#app .workspace .ledger-button[data-v-18491eb8]{min-height:44px;border-radius:16px;font-weight:650;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .ledger-button.chosen[data-v-18491eb8]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent}#app .workspace .ledger-entry[data-v-18491eb8]{border-radius:20px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-lowest);box-shadow:var(--shadow-1)}#app .workspace .conversation[data-v-18491eb8]{background:var(--md-surface);border-radius:30px;overflow:hidden;box-shadow:var(--shadow-1)}#app .workspace .conversation-header[data-v-18491eb8]{padding:20px 26px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .conversation-header h2[data-v-18491eb8]{font-size:20px;font-weight:750;letter-spacing:-.01em}#app .workspace .session-actions button[data-v-18491eb8]{height:36px;padding:0 15px;border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .session-actions button[data-v-18491eb8]:hover:not(:disabled){background:var(--md-surface-container-highest);box-shadow:none}#app .workspace .running[data-v-18491eb8]{color:#b88412;background:color-mix(in srgb,#B88412 14%,transparent);padding:4px 11px;border-radius:999px;font-weight:700}#app .workspace .transcript[data-v-18491eb8]{padding:28px 30px}#app .workspace .welcome[data-v-18491eb8]{margin:64px auto 0}#app .workspace .welcome[data-v-18491eb8]:before{width:76px;height:76px;border-radius:26px 26px 26px 10px;background-color:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24' fill='none' stroke='%235944c6' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-size:34px 34px}#app .workspace .welcome h2[data-v-18491eb8]{font-size:26px;font-weight:800;letter-spacing:-.02em}#app .workspace .turn[data-v-18491eb8]{gap:12px;margin-bottom:32px}#app .workspace .bubble[data-v-18491eb8]{padding:16px 20px;font-size:15px;line-height:1.7}#app .workspace .bubble.user[data-v-18491eb8]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px;box-shadow:var(--shadow-1);max-width:82%}#app .workspace .bubble.agent[data-v-18491eb8]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:8px 24px 24px;box-shadow:var(--shadow-1);max-width:100%}#app .workspace .bubble .message-head b[data-v-18491eb8]{font-weight:750}#app .workspace .steps[data-v-18491eb8]{gap:9px;margin:14px 0}#app .workspace .steps details[data-v-18491eb8]{border-radius:16px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);padding:11px 15px}#app .workspace .subagent-card[data-v-18491eb8]{border-radius:18px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);box-shadow:var(--shadow-1)}#app .workspace button.subagent-card-head[data-v-18491eb8]{padding:12px 15px}#app .workspace button.subagent-card-head[data-v-18491eb8]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .sub-view-header[data-v-18491eb8]{padding-bottom:16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .sub-view-header button[data-v-18491eb8]{border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .agent-speech[data-v-18491eb8] pre{border-radius:16px;background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}#app .workspace .composer[data-v-18491eb8]{margin:0 22px 20px;border-radius:28px;overflow:hidden;background:var(--md-surface-container-lowest);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);box-shadow:var(--shadow-2)}#app .workspace .composer[data-v-18491eb8]:focus-within{border-color:color-mix(in srgb,var(--md-primary) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent),var(--shadow-2)}#app .workspace .execution-options[data-v-18491eb8]{padding:12px 16px;gap:10px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .execution-options label[data-v-18491eb8]{font-weight:700;letter-spacing:.05em}#app .workspace .execution-options .workspace-select[data-v-18491eb8]{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .execution-options[data-v-18491eb8] .app-select-trigger,#app .workspace .composer footer[data-v-18491eb8] .app-select-trigger{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .composer-input textarea[data-v-18491eb8]{border-radius:0;background:transparent}#app .workspace .send-fly[data-v-18491eb8]{width:46px!important;height:46px!important;border-radius:50%!important;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .composer footer[data-v-18491eb8]{border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);padding:12px 16px}#app .workspace .composer footer>button[data-v-18491eb8]{border-radius:999px;min-height:36px;padding-inline:15px;background:var(--md-surface-container-high);border-color:transparent}#app .workspace .host-panel[data-v-18491eb8]{margin:0 22px 10px;border-radius:24px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .workspace .usage-ring b[data-v-18491eb8]{background:var(--md-surface-container-lowest)}#app .workspace .directory-dialog[data-v-18491eb8]{border-radius:32px;border-color:transparent;box-shadow:var(--shadow-4);background:var(--md-surface-container-low)}#app .workspace .directory-list button[data-v-18491eb8]{background:var(--md-surface-container-lowest);border-color:transparent;border-radius:16px;min-height:46px}#app .workspace .directory-list button[data-v-18491eb8]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .directory-roots button[data-v-18491eb8]{background:var(--md-surface-container-high);border-color:transparent}@keyframes turn-in-18491eb8{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes panel-in-18491eb8{0%{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes caret-blink-18491eb8{0%,to{opacity:1}50%{opacity:.2}}@keyframes soft-pulse-18491eb8{0%,to{opacity:1}50%{opacity:.5}}.turn[data-v-18491eb8]{animation:turn-in-18491eb8 .28s cubic-bezier(.2,0,0,1) both}#app .workspace .agent-speech .running[data-v-18491eb8]{animation:caret-blink-18491eb8 1s steps(1,end) infinite;color:var(--md-primary)}#app .workspace .conversation-header .running[data-v-18491eb8]{animation:soft-pulse-18491eb8 1.6s ease-in-out infinite}@media (prefers-reduced-motion: reduce){[data-v-18491eb8],[data-v-18491eb8] *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}@media (max-width:800px){.sessions[data-v-18491eb8]{width:214px;padding:12px 10px}.transcript[data-v-18491eb8]{padding:14px}.composer[data-v-18491eb8]{margin:0 12px 12px}.composer footer .muted[data-v-18491eb8]{display:none}.conversation-header[data-v-18491eb8]{padding:14px 16px}.welcome[data-v-18491eb8]{margin:30px auto 0}.turn[data-v-18491eb8]{margin-bottom:22px}}@media (max-width:560px){.workspace[data-v-18491eb8]{flex-direction:column}.sessions[data-v-18491eb8]{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input[data-v-18491eb8],.filter-bar[data-v-18491eb8],.connection[data-v-18491eb8]{display:none}.session-list[data-v-18491eb8]{display:flex;gap:6px;overflow-x:auto}.session-card[data-v-18491eb8]{min-width:160px;width:160px;margin-bottom:0}.ledger-button[data-v-18491eb8]{padding:5px;font-size:12px}}\n";document.head.appendChild(s)}})();
