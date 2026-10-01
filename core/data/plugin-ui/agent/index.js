var xl = Object.defineProperty;
var Sl = (n, e, t) => e in n ? xl(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var le = (n, e, t) => Sl(n, typeof e != "symbol" ? e + "" : e, t);
import { reactive as Tl, defineComponent as Kt, computed as q, openBlock as m, createElementBlock as k, ref as O, onMounted as Gt, onUnmounted as vn, normalizeClass as ie, createElementVNode as o, toDisplayString as g, createCommentVNode as I, Fragment as ne, renderList as ve, withModifiers as De, watch as be, nextTick as tt, mergeProps as Al, unref as ue, createBlock as Rt, Teleport as jn, createVNode as Fe, Transition as Js, withCtx as el, normalizeStyle as Yt, withDirectives as fn, vModelText as zn, withKeys as jt, createTextVNode as Ee, vModelCheckbox as El } from "vue";
function $l() {
  const n = Tl({
    agents: [],
    tasks: [],
    sessions: [],
    onlineCount: 0,
    loading: !1,
    error: ""
  });
  let e = null, t = null, l = null, s = "";
  const a = /* @__PURE__ */ new Map();
  let d = null, u = !1;
  function b(C) {
    C.reset && a.clear();
    for (const M of C.removed || []) a.delete(M);
    for (const M of C.tasks || []) a.set(M.task_id, M);
    s = C.cursor || "";
    const U = [...a.values()].sort((M, ce) => (ce.started_at || "").localeCompare(M.started_at || "") || M.task_id.localeCompare(ce.task_id));
    n.tasks = U.filter((M) => M.kind !== "agent_session"), n.sessions = U.filter((M) => M.kind === "agent_session");
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
    return t ? (l || (l = t.then(() => (l = null, S()))), l) : (t = E().finally(() => {
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
  function N() {
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
  async function X(C) {
    const U = await fetch("/api/agent/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: C }) });
    if (!U.ok) throw new Error(await U.text());
    const M = await U.json();
    return await S(), M.session_id;
  }
  async function z(C, U, M) {
    const ce = await fetch("/api/agent/sessions", { method: U === "delete" ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: C, action: U, title: M }) });
    if (!ce.ok) throw new Error(await ce.text());
    await S();
  }
  async function Y(C, U, M, ce = {}) {
    const J = await fetch("/api/agent/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: C, prompt: U, agent_type: M, ...ce }) }), B = await J.text();
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
    const M = await U.json();
    if (!M.success) throw new Error(M.message);
    await S();
  }
  return Object.assign(n, {
    fetchAgents: S,
    connect: N,
    disconnect: F,
    isHealthy: L,
    createSession: X,
    manageSession: z,
    sendTask: Y,
    cancelTask: ae
  });
}
const Rl = $l();
function Cl() {
  return Rl;
}
function cs() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Lt = cs();
function tl(n) {
  Lt = n;
}
var $t = { exec: () => null };
function Wt(n) {
  let e = [];
  return (t) => {
    let l = Math.max(0, Math.min(3, t - 1)), s = e[l];
    return s || (s = n(l), e[l] = s), s;
  };
}
function H(n, e = "") {
  let t = typeof n == "string" ? n : n.source, l = { replace: (s, a) => {
    let d = typeof a == "string" ? a : a.source;
    return d = d.replace(we.caret, "$1"), t = t.replace(s, d), l;
  }, getRegex: () => new RegExp(t, e) };
  return l;
}
var Ll = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), we = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: Wt((n) => new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: Wt((n) => new RegExp(`^ {0,${n}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: Wt((n) => new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)), headingBeginRegex: Wt((n) => new RegExp(`^ {0,${n}}#`)), htmlBeginRegex: Wt((n) => new RegExp(`^ {0,${n}}(?:</?(?:${bn})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: Wt((n) => new RegExp(`^ {0,${n}}>`)) }, Il = /^(?:[ \t]*(?:\n|$))+/, Ol = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Pl = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, kn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Dl = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ds = / {0,3}(?:[*+-]|\d{1,9}[.)])/, nl = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, sl = H(nl).replace(/bull/g, ds).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Nl = H(nl).replace(/bull/g, ds).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), ps = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Ml = /^[^\n]+/, hs = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, zl = H(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", hs).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ul = H(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, ds).getRegex(), bn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", fs = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Fl = H("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", fs).replace("tag", bn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ll = (n) => H(ps).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", n).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", bn).getRegex(), Bl = ll(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), Hl = ll(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), jl = H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Hl).getRegex(), gs = { blockquote: jl, code: Ol, def: zl, fences: Pl, heading: Dl, hr: kn, html: Fl, lheading: sl, list: Ul, newline: Il, paragraph: Bl, table: $t, text: Ml }, Es = H("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", bn).getRegex(), Wl = { ...gs, lheading: Nl, table: Es, paragraph: H(ps).replace("hr", kn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Es).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", bn).getRegex() }, Vl = { ...gs, html: H(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", fs).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: $t, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: H(ps).replace("hr", kn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", sl).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, ql = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gl = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, rl = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, Yl = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ot = /[\p{P}\p{S}]/u, Xt = /[\s\p{P}\p{S}]/u, yn = /[^\s\p{P}\p{S}]/u, Zl = H(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Xt).getRegex(), Kl = /[\p{Pi}\p{Ps}"']/u, al = /(?!~)[\p{P}\p{S}]/u, Xl = /(?!~)[\s\p{P}\p{S}]/u, Ql = /(?:[^\s\p{P}\p{S}]|~)/u, Jl = H(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ll ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ol = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, er = H(ol, "u").replace(/punct/g, ot).getRegex(), tr = H(ol, "u").replace(/punct/g, al).getRegex(), nr = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, sr = H(nr, "u").replace(/openQuote/g, Kl).replace(/punct/g, ot).getRegex(), il = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", lr = H(il, "gu").replace(/notPunctSpace/g, yn).replace(/punctSpace/g, Xt).replace(/punct/g, ot).getRegex(), rr = H(il, "gu").replace(/notPunctSpace/g, Ql).replace(/punctSpace/g, Xl).replace(/punct/g, al).getRegex(), ar = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", or = H(ar, "gu").replace(/notPunctSpace/g, yn).replace(/punctSpace/g, Xt).replace(/punct/g, ot).getRegex(), ir = H("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, yn).replace(/punctSpace/g, Xt).replace(/punct/g, ot).getRegex(), ur = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", cr = H(ur, "gu").replace(/notPunctSpace/g, yn).replace(/punctSpace/g, Xt).replace(/punct/g, ot).getRegex(), dr = H(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, ot).getRegex(), pr = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", hr = H(pr, "gu").replace(/notPunctSpace/g, yn).replace(/punctSpace/g, Xt).replace(/punct/g, ot).getRegex(), fr = H(/\\(punct)/, "gu").replace(/punct/g, ot).getRegex(), gr = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), mr = H(fs).replace("(?:-->|$)", "-->").getRegex(), vr = H("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", mr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ul = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, Un = H(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", ul).getRegex(), kr = H(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Un).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), br = H(/^!?\[(label)\]\[(ref)\]/).replace("label", Un).replace("ref", hs).getRegex(), yr = H(/^!?\[(ref)\](?:\[\])?/).replace("ref", hs).getRegex(), $s = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, _r = H(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", ul).getRegex(), wr = H("reflink|nolink(?!\\()", "g").replace("reflink", H(/^!?\[(label)\]\[(ref)\]/).replace("label", _r).replace("ref", $s).getRegex()).replace("nolink", H(/^!?\[(ref)\](?:\[\])?/).replace("ref", $s).getRegex()).getRegex(), Rs = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, xr = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/, Sr = H(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, xr).getRegex(), ms = { _backpedal: $t, anyPunctuation: fr, autolink: gr, blockSkip: Jl, br: rl, code: Gl, del: $t, delLDelim: $t, delRDelim: $t, emStrongLDelim: er, emStrongRDelimAst: lr, emStrongRDelimUnd: ir, escape: ql, link: kr, nolink: yr, punctuation: Zl, reflink: br, reflinkSearch: wr, tag: vr, text: Yl, url: $t }, Tr = { ...ms, emStrongLDelim: sr, emStrongRDelimAst: or, emStrongRDelimUnd: cr, link: H(/^!?\[(label)\]\((.*?)\)/).replace("label", Un).getRegex(), reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Un).getRegex() }, rs = { ...ms, emStrongRDelimAst: rr, emStrongLDelim: tr, delLDelim: dr, delRDelim: hr, url: H(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Sr).replace("protocol", Rs).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: H(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", Rs).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() }, Ar = { ...rs, br: H(rl).replace("{2,}", "*").getRegex(), text: H(rs.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Pn = { normal: gs, gfm: Wl, pedantic: Vl }, un = { normal: ms, gfm: rs, breaks: Ar, pedantic: Tr }, Er = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Cs = (n) => Er[n];
function Oe(n, e) {
  if (e) {
    if (we.escapeTest.test(n)) return n.replace(we.escapeReplace, Cs);
  } else if (we.escapeTestNoEncode.test(n)) return n.replace(we.escapeReplaceNoEncode, Cs);
  return n;
}
function $r(n) {
  return n.replace(we.numericCharacterReference, (e, t, l) => {
    let s = t === void 0 ? Number.parseInt(l, 16) : Number.parseInt(t, 10);
    return s === 0 || s > 1114111 || s >= 55296 && s <= 57343 ? "�" : String.fromCodePoint(s);
  });
}
function Ls(n) {
  try {
    n = encodeURI(n).replace(we.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function Is(n, e) {
  let t = n.replace(we.findPipe, (a, d, u) => {
    let b = !1, _ = d;
    for (; --_ >= 0 && u[_] === "\\"; ) b = !b;
    return b ? "|" : " |";
  }), l = t.split(we.splitPipe), s = 0;
  if (l[0].trim() || l.shift(), l.length > 0 && !l.at(-1)?.trim() && l.pop(), e) if (l.length > e) l.splice(e);
  else for (; l.length < e; ) l.push("");
  for (; s < l.length; s++) l[s] = l[s].trim().replace(we.slashPipe, "|");
  return l;
}
function ft(n, e, t) {
  let l = n.length;
  if (l === 0) return "";
  let s = 0;
  for (; s < l && n.charAt(l - s - 1) === e; )
    s++;
  return n.slice(0, l - s);
}
function Os(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && we.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function Fn(n) {
  return n.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Rr(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let l = 0; l < n.length; l++) if (n[l] === "\\") l++;
  else if (n[l] === e[0]) t++;
  else if (n[l] === e[1] && (t--, t < 0)) return l;
  return t > 0 ? -2 : -1;
}
function Ps(n, e = 0) {
  let t = e, l = "";
  for (let s of n) if (s === "	") {
    let a = 4 - t % 4;
    l += " ".repeat(a), t += a;
  } else l += s, t++;
  return l;
}
function Ds(n, e, t, l, s) {
  let a = e.href, d = e.title || null, u = n[1].replace(s.other.outputLinkReplace, "$1"), b = n[0].charAt(0) === "!";
  l.state.inLink = !0;
  let _ = l.state.linkEmitted, S = l.state.inRawBlock;
  l.state.linkEmitted = !1;
  let E = l.inlineTokens(u), N = l.state.linkEmitted;
  if (l.state.linkEmitted = _, l.state.inLink = !1, !b) {
    if (N) {
      l.state.inRawBlock = S;
      return;
    }
    l.state.linkEmitted = !0;
  }
  return { type: b ? "image" : "link", raw: t, href: a, title: d, text: u, tokens: E };
}
function Cr(n, e, t) {
  let l = n.match(t.other.indentCodeCompensation);
  if (l === null) return e;
  let s = l[1];
  return e.split(`
`).map((a) => {
    let d = a.match(t.other.beginningSpace);
    if (d === null) return a;
    let [u] = d;
    return a.slice(Math.min(u.length, s.length));
  }).join(`
`);
}
function Ns(n, e, t, l) {
  if (!e.includes("<")) return !1;
  for (let s = 0; s < e.length; s++) {
    if (e[s] === "\\") {
      s++;
      continue;
    }
    if (e[s] === "`") {
      let u = l.inline.code.exec(e.slice(s));
      if (u) {
        s += u[0].length - 1;
        continue;
      }
    }
    if (e[s] !== "<") continue;
    let a = n.slice(t + s), d = l.inline.tag.exec(a) || l.inline.autolink.exec(a);
    if (d) {
      if (d[0].length > e.length - s) return !0;
      s += d[0].length - 1;
    }
  }
  return !1;
}
var Bn = class {
  constructor(n) {
    le(this, "options");
    le(this, "rules");
    le(this, "lexer");
    this.options = n || Lt;
  }
  space(n) {
    let e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(n) {
    let e = this.rules.block.code.exec(n);
    if (e) {
      let t = this.options.pedantic ? e[0] : Os(e[0]), l = t.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t, codeBlockStyle: "indented", text: l };
    }
  }
  fences(n) {
    let e = this.rules.block.fences.exec(n);
    if (e) {
      let t = e[0], l = Cr(t, e[3] || "", this.rules);
      return { type: "code", raw: t, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: l };
    }
  }
  heading(n) {
    let e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        let l = ft(t, "#");
        (this.options.pedantic || !l || this.rules.other.endingSpaceTabChar.test(l)) && (t = l.trim());
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
`), l = "", s = "", a = [];
      for (; t.length > 0; ) {
        let d = !1, u = [], b;
        for (b = 0; b < t.length; b++) if (this.rules.other.blockquoteStart.test(t[b])) u.push(t[b]), d = !0;
        else if (!d) u.push(t[b]);
        else break;
        t = t.slice(b);
        let _ = u.join(`
`), S = _.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        l = l ? `${l}
${_}` : _, s = s ? `${s}
${S}` : S;
        let E = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(S, a, !0), this.lexer.state.top = E, t.length === 0) break;
        let N = a.at(-1);
        if (N?.type === "code") break;
        if (N?.type === "blockquote") {
          let F = N, L = t.join(`
`), X = F.raw + `
` + L.replace(this.rules.other.blockquoteSetextReplace2, ""), z = this.blockquote(X);
          a[a.length - 1] = z;
          let Y = X.substring(z.raw.length).replace(/^\n/, ""), ae = Y ? Y.split(`
`).length : 0, C = ae ? t.slice(0, -ae) : t;
          C.length > 0 && (l = `${l}
${C.join(`
`)}`), s = s.substring(0, s.length - F.text.length) + z.text;
          break;
        } else if (N?.type === "list") {
          let F = N, L = F.raw + `
` + t.join(`
`), X = this.list(L);
          a[a.length - 1] = X, l = l.substring(0, l.length - N.raw.length) + X.raw, s = s.substring(0, s.length - F.raw.length) + X.raw, t = L.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: l, tokens: a, text: s };
    }
  }
  list(n) {
    let e = this.rules.block.list.exec(n);
    if (e) {
      let t = e[1].trim(), l = t.length > 1, s = { type: "list", raw: "", ordered: l, start: l ? +t.slice(0, -1) : "", loose: !1, items: [] };
      t = l ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = l ? t : "[*+-]");
      let a = this.rules.other.listItemRegex(t), d = !1;
      for (; n; ) {
        let b = !1, _ = "", S = "";
        if (!(e = a.exec(n)) || this.rules.block.hr.test(n)) break;
        _ = e[0], n = n.substring(_.length);
        let E = e[2].split(`
`, 1)[0], N = e[1].length, F = this.options.pedantic ? Ps(E, N) : E.replace(this.rules.other.leadingSpaceTab, (Y) => Ps(Y, N)), L = n.split(`
`, 1)[0], X = !F.trim(), z = 0;
        if (this.options.pedantic ? (z = 2, S = F.trimStart()) : X ? z = N + 1 : (z = F.search(this.rules.other.nonSpaceChar), z = z > 4 ? 1 : z, S = F.slice(z), z += N), X && this.rules.other.blankLine.test(L) && (_ += L + `
`, n = n.substring(L.length + 1), b = !0), !b) {
          let Y = this.rules.other.nextBulletRegex(z), ae = this.rules.other.hrRegex(z), C = this.rules.other.fencesBeginRegex(z), U = this.rules.other.headingBeginRegex(z), M = this.rules.other.htmlBeginRegex(z), ce = this.rules.other.blockquoteBeginRegex(z);
          for (; n; ) {
            let J = n.split(`
`, 1)[0], B;
            if (L = J, this.options.pedantic ? (L = L.replace(this.rules.other.listReplaceNesting, "  "), B = L) : B = L.replace(this.rules.other.leadingSpaceTab, (y) => y.replace(this.rules.other.tabCharGlobal, "    ")), C.test(L) || U.test(L) || M.test(L) || ce.test(L) || Y.test(L) || ae.test(L)) break;
            if (B.search(this.rules.other.nonSpaceChar) >= z || !L.trim()) S += `
` + B.slice(z);
            else {
              if (X || F.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || C.test(F) || U.test(F) || ae.test(F)) break;
              S += `
` + L;
            }
            X = !L.trim(), _ += J + `
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
      let t = Os(e[0]);
      return { type: "html", block: !0, raw: t, pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: t };
    }
  }
  def(n) {
    let e = this.rules.block.def.exec(n);
    if (e) {
      let t = Fn(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), l = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: ft(e[0], `
`), href: l, title: s };
    }
  }
  table(n) {
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = Is(e[1]), l = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: ft(e[0], `
`), header: [], align: [], rows: [] };
    if (t.length === l.length) {
      for (let d of l) this.rules.other.tableAlignRight.test(d) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(d) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(d) ? a.align.push("left") : a.align.push(null);
      for (let d = 0; d < t.length; d++) a.header.push({ text: t[d], tokens: this.lexer.inline(t[d]), header: !0, align: a.align[d] });
      for (let d of s) a.rows.push(Is(d, a.header.length).map((u, b) => ({ text: u, tokens: this.lexer.inline(u), header: !1, align: a.align[b] })));
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
      let l = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(l)) {
        if (!this.rules.other.endAngleBracket.test(l)) return;
        let d = ft(l.slice(0, -1), "\\");
        if ((l.length - d.length) % 2 === 0) return;
      } else {
        let d = Rr(e[2], "()");
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
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(l) ? s = s.slice(1) : s = s.slice(1, -1)), Ds(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: a && a.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      let l = t[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Ns(n, t[1], l, this.rules)) return;
      let s = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), a = e[Fn(s)];
      if (!a) {
        let d = t[0].charAt(0);
        return { type: "text", raw: d, text: d };
      }
      return Ds(t, a, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let l = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!l || !l[1] && !l[2] && !l[3] && !l[4] || l[4] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(l[1] || l[3]) || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...l[0]].length - 1, a, d, u = s, b = 0, _ = l[0][0], S = t === _, E = _ === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (E.lastIndex = 0, e = e.slice(-1 * n.length + s); (l = E.exec(e)) !== null; ) {
        if (a = l[1] || l[2] || l[3] || l[4] || l[5] || l[6], !a) continue;
        if (d = [...a].length, l[3] || l[4]) {
          u += d;
          continue;
        } else if (l[5] || l[6]) {
          if (s % 3 && !((s + d) % 3)) {
            b += d;
            continue;
          }
          if (S) break;
        }
        if (u -= d, u > 0) continue;
        d = Math.min(d, d + u + b);
        let N = [...l[0]][0].length, F = n.slice(0, s + l.index + N + d);
        if (Math.min(s, d) % 2) {
          let X = F.slice(1, -1);
          return { type: "em", raw: F, text: X, tokens: this.lexer.inlineTokens(X) };
        }
        let L = F.slice(2, -2);
        return { type: "strong", raw: F, text: L, tokens: this.lexer.inlineTokens(L) };
      }
    }
  }
  codespan(n) {
    let e = this.rules.inline.code.exec(n);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " "), l = this.rules.other.nonSpaceChar.test(t), s = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return l && s && (t = t.substring(1, t.length - 1)), { type: "codespan", raw: e[0], text: t };
    }
  }
  br(n) {
    let e = this.rules.inline.br.exec(n);
    if (e) return { type: "br", raw: e[0] };
  }
  del(n, e, t = "") {
    let l = this.rules.inline.delLDelim.exec(n);
    if (l && (!l[1] || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...l[0]].length - 1, a, d, u = s, b = this.rules.inline.delRDelim;
      for (b.lastIndex = 0, e = e.slice(-1 * n.length + s); (l = b.exec(e)) !== null; ) {
        if (a = l[1] || l[2] || l[3] || l[4] || l[5] || l[6], !a || (d = [...a].length, d !== s)) continue;
        if (l[3] || l[4]) {
          u += d;
          continue;
        }
        if (u -= d, u > 0) continue;
        d = Math.min(d, d + u);
        let _ = [...l[0]][0].length, S = n.slice(0, s + l.index + _ + d), E = S.slice(s, -s);
        return { type: "del", raw: S, text: E, tokens: this.lexer.inlineTokens(E) };
      }
    }
  }
  autolink(n) {
    let e = this.rules.inline.autolink.exec(n);
    if (e) {
      let t, l;
      return e[2] === "@" ? (t = e[1], l = "mailto:" + t) : (t = e[1], l = t), { type: "link", raw: e[0], text: t, href: l, autolink: !0, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  url(n) {
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let t, l;
      if (e[2] === "@") t = e[0], l = "mailto:" + t;
      else {
        let s;
        do
          s = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (s !== e[0]);
        t = e[0], e[1] === "www." ? l = "http://" + e[0] : l = e[0];
      }
      return { type: "link", raw: e[0], text: t, href: l, autolink: !0, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  inlineText(n) {
    let e = this.rules.inline.text.exec(n);
    if (e) {
      let t = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: t ? e[0] : $r(e[0]), escaped: t };
    }
  }
}, qe = class as {
  constructor(e) {
    le(this, "tokens");
    le(this, "options");
    le(this, "state");
    le(this, "inlineQueue");
    le(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Lt, this.options.tokenizer = this.options.tokenizer || new Bn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, linkEmitted: !1, top: !0 };
    let t = { other: we, block: Pn.normal, inline: un.normal };
    this.options.pedantic ? (t.block = Pn.pedantic, t.inline = un.pedantic) : this.options.gfm && (t.block = Pn.gfm, this.options.breaks ? t.inline = un.breaks : t.inline = un.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: Pn, inline: un };
  }
  static lex(e, t) {
    return new as(t).lex(e);
  }
  static lexInline(e, t) {
    return new as(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(we.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let l = this.inlineQueue[t];
      this.inlineTokens(l.src, l.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], l = !1) {
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
        l && u?.type === "paragraph" ? (u.raw += (u.raw.endsWith(`
`) ? "" : `
`) + a.raw, u.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = u.text) : t.push(a), l = d.length !== e.length, e = e.substring(a.raw.length);
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
    for (let l of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (t.test(l[0]) && e.charAt(l.index - 1) !== "!") return !0;
    for (let l of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
      let s = l[0], a = s.lastIndexOf("[");
      if (!(s.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, Fn(s.slice(a + 1, -1)))) && !(a > 1 && this.linkInText(s.slice(1, a - 1)))) return !0;
    }
    return !1;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let l = e;
    if (this.tokens.links && e.includes("[")) {
      let u = this.tokenizer.rules.inline.reflinkSearch, b = (_) => {
        let S = _.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, Fn(_.slice(S + 1, -1)))) return _;
        if (S > 1 && _.charAt(0) !== "!") {
          let E = _.slice(1, S - 1);
          if (this.linkInText(E)) return "[" + E.replace(u, b) + "][" + "a".repeat(_.length - S - 2) + "]";
        }
        return "[" + "a".repeat(_.length - 2) + "]";
      };
      l = l.replace(u, b);
    }
    l = l.replace(this.tokenizer.rules.inline.anyPunctuation, (u) => "+".repeat(u.length)), l = l.replace(this.tokenizer.rules.inline.blockSkip, (u, b, _) => {
      let S = _ ? _.length : 0;
      return u.slice(0, S) + "[" + "a".repeat(u.length - S - 2) + "]";
    }), l = this.options.hooks?.emStrongMask?.call({ lexer: this }, l) ?? l;
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
      if (u = this.tokenizer.emStrong(e, l, a)) {
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
      if (u = this.tokenizer.del(e, l, a)) {
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
        this.options.extensions.startInline.forEach((N) => {
          E = N.call({ lexer: this }, S), typeof E == "number" && E >= 0 && (_ = Math.min(_, E));
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
}, Hn = class {
  constructor(n) {
    le(this, "options");
    le(this, "parser");
    this.options = n || Lt;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    let l = (e || "").match(we.notSpaceStart)?.[0], s = n ? n.replace(we.endingNewline, "") + `
` : "";
    return l ? '<pre><code class="language-' + Oe(l) + '">' + (t ? s : Oe(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : Oe(s, !0)) + `</code></pre>
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
    let e = n.ordered, t = n.start, l = "";
    for (let d = 0; d < n.items.length; d++) {
      let u = n.items[d];
      l += this.listitem(u);
    }
    let s = e ? "ol" : "ul", a = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + s + a + `>
` + l + "</" + s + `>
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
    let l = "";
    for (let s = 0; s < n.rows.length; s++) {
      let a = n.rows[s];
      t = "";
      for (let d = 0; d < a.length; d++) t += this.tablecell(a[d]);
      l += this.tablerow({ text: t });
    }
    return l && (l = `<tbody>${l}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + l + `</table>
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
    return `<code>${Oe(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, text: t, tokens: l, autolink: s }) {
    let a = s ? Oe(t, !0) : this.parser.parseInline(l), d = Ls(n);
    if (d === null) return a;
    n = Oe(d, s);
    let u = '<a href="' + n + '"';
    return e && (u += ' title="' + Oe(e) + '"'), u += ">" + a + "</a>", u;
  }
  image({ href: n, title: e, text: t, tokens: l }) {
    l && (t = this.parser.parseInline(l, this.parser.textRenderer));
    let s = Ls(n);
    if (s === null) return Oe(t);
    n = s;
    let a = `<img src="${Oe(n)}" alt="${Oe(t)}"`;
    return e && (a += ` title="${Oe(e)}"`), a += ">", a;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : Oe(n.text);
  }
}, vs = class {
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
}, Ge = class os {
  constructor(e) {
    le(this, "options");
    le(this, "renderer");
    le(this, "textRenderer");
    this.options = e || Lt, this.options.renderer = this.options.renderer || new Hn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new vs();
  }
  static parse(e, t) {
    return new os(t).parse(e);
  }
  static parseInline(e, t) {
    return new os(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let l = 0; l < e.length; l++) {
      let s = e[l];
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
    let l = "";
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (this.options.extensions?.renderers?.[a.type]) {
        let u = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (u !== !1 || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          l += u || "";
          continue;
        }
      }
      let d = a;
      switch (d.type) {
        case "escape": {
          l += t.text(d);
          break;
        }
        case "html": {
          l += t.html(d);
          break;
        }
        case "link": {
          l += t.link(d);
          break;
        }
        case "image": {
          l += t.image(d);
          break;
        }
        case "checkbox": {
          l += t.checkbox(d);
          break;
        }
        case "strong": {
          l += t.strong(d);
          break;
        }
        case "em": {
          l += t.em(d);
          break;
        }
        case "codespan": {
          l += t.codespan(d);
          break;
        }
        case "br": {
          l += t.br(d);
          break;
        }
        case "del": {
          l += t.del(d);
          break;
        }
        case "text": {
          l += t.text(d);
          break;
        }
        default: {
          let u = 'Token with "' + d.type + '" type was not found.';
          if (this.options.silent) return console.error(u), "";
          throw new Error(u);
        }
      }
    }
    return l;
  }
}, Mn, gn = (Mn = class {
  constructor(n) {
    le(this, "options");
    le(this, "block");
    this.options = n || Lt;
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
}, le(Mn, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), le(Mn, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), Mn), Lr = class {
  constructor(...n) {
    le(this, "defaults", cs());
    le(this, "options", this.setOptions);
    le(this, "parse", this.parseMarkdown(!0));
    le(this, "parseInline", this.parseMarkdown(!1));
    le(this, "Parser", Ge);
    le(this, "Renderer", Hn);
    le(this, "TextRenderer", vs);
    le(this, "Lexer", qe);
    le(this, "Tokenizer", Bn);
    le(this, "Hooks", gn);
    this.use(...n);
  }
  walkTokens(n, e) {
    let t = [];
    for (let l of n) switch (t = t.concat(e.call(this, l)), l.type) {
      case "table": {
        let s = l;
        for (let a of s.header) t = t.concat(this.walkTokens(a.tokens, e));
        for (let a of s.rows) for (let d of a) t = t.concat(this.walkTokens(d.tokens, e));
        break;
      }
      case "list": {
        let s = l;
        t = t.concat(this.walkTokens(s.items, e));
        break;
      }
      default: {
        let s = l;
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
      let l = { ...t };
      if (l.async = this.defaults.async || l.async || !1, t.extensions && (t.extensions.forEach((s) => {
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
      }), l.extensions = e), t.renderer) {
        let s = this.defaults.renderer || new Hn(this.defaults);
        for (let a in t.renderer) {
          if (!(a in s)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let d = a, u = t.renderer[d], b = s[d];
          s[d] = (..._) => {
            let S = u.apply(s, _);
            return S === !1 && (S = b.apply(s, _)), S || "";
          };
        }
        l.renderer = s;
      }
      if (t.tokenizer) {
        let s = this.defaults.tokenizer || new Bn(this.defaults);
        for (let a in t.tokenizer) {
          if (!(a in s)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let d = a, u = t.tokenizer[d], b = s[d];
          s[d] = (..._) => {
            let S = u.apply(s, _);
            return S === !1 && (S = b.apply(s, _)), S;
          };
        }
        l.tokenizer = s;
      }
      if (t.hooks) {
        let s = this.defaults.hooks || new gn();
        for (let a in t.hooks) {
          if (!(a in s)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let d = a, u = t.hooks[d], b = s[d];
          gn.passThroughHooks.has(a) ? s[d] = (_) => {
            if (this.defaults.async && gn.passThroughHooksRespectAsync.has(a)) return (async () => {
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
        l.hooks = s;
      }
      if (t.walkTokens) {
        let s = this.defaults.walkTokens, a = t.walkTokens;
        l.walkTokens = function(d) {
          let u = [];
          return u.push(a.call(this, d)), s && (u = u.concat(s.call(this, d))), u;
        };
      }
      this.defaults = { ...this.defaults, ...l };
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
      let l = { ...t }, s = { ...this.defaults, ...l }, a = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && l.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
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
        let l = "<p>An error occurred:</p><pre>" + Oe(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(l) : l;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, Ct = new Lr();
function re(n, e) {
  return Ct.parse(n, e);
}
re.options = re.setOptions = function(n) {
  return Ct.setOptions(n), re.defaults = Ct.defaults, tl(re.defaults), re;
};
re.getDefaults = cs;
re.defaults = Lt;
function Ir(...n) {
  return Ct.use(...n), re.defaults = Ct.defaults, tl(re.defaults), re;
}
re.use = Ir;
re.walkTokens = function(n, e) {
  return Ct.walkTokens(n, e);
};
re.parseInline = Ct.parseInline;
re.Parser = Ge;
re.parser = Ge.parse;
re.Renderer = Hn;
re.TextRenderer = vs;
re.Lexer = qe;
re.lexer = qe.lex;
re.Tokenizer = Bn;
re.Hooks = gn;
re.parse = re;
re.options;
re.setOptions;
re.walkTokens;
re.parseInline;
Ge.parse;
qe.lex;
/*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE */
function Ms(n, e) {
  (e == null || e > n.length) && (e = n.length);
  for (var t = 0, l = Array(e); t < e; t++) l[t] = n[t];
  return l;
}
function Or(n) {
  if (Array.isArray(n)) return n;
}
function Pr(n, e) {
  var t = n == null ? null : typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
  if (t != null) {
    var l, s, a, d, u = [], b = !0, _ = !1;
    try {
      if (a = (t = t.call(n)).next, e !== 0) for (; !(b = (l = a.call(t)).done) && (u.push(l.value), u.length !== e); b = !0) ;
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
function Dr() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
function Nr(n, e) {
  return Or(n) || Pr(n, e) || Mr(n, e) || Dr();
}
function Mr(n, e) {
  if (n) {
    if (typeof n == "string") return Ms(n, e);
    var t = {}.toString.call(n).slice(8, -1);
    return t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set" ? Array.from(n) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Ms(n, e) : void 0;
  }
}
const cl = Object.entries, zs = Object.setPrototypeOf, zr = Object.isFrozen, Ur = Object.getPrototypeOf, Fr = Object.getOwnPropertyDescriptor;
let ye = Object.freeze, _e = Object.seal, qt = Object.create, dl = typeof Reflect < "u" && Reflect, is = dl.apply, us = dl.construct;
ye || (ye = function(e) {
  return e;
});
_e || (_e = function(e) {
  return e;
});
is || (is = function(e, t) {
  for (var l = arguments.length, s = new Array(l > 2 ? l - 2 : 0), a = 2; a < l; a++) s[a - 2] = arguments[a];
  return e.apply(t, s);
});
us || (us = function(e) {
  for (var t = arguments.length, l = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) l[s - 1] = arguments[s];
  return new e(...l);
});
const Et = ke(Array.prototype.forEach), Br = ke(Array.prototype.lastIndexOf), Us = ke(Array.prototype.pop), cn = ke(Array.prototype.push), Hr = ke(Array.prototype.splice), Zt = Array.isArray, mn = ke(String.prototype.toLowerCase), Jn = ke(String.prototype.toString), Fs = ke(String.prototype.match), dn = ke(String.prototype.replace), Bs = ke(String.prototype.indexOf), jr = ke(String.prototype.trim), Wr = ke(Number.prototype.toString), Vr = ke(Boolean.prototype.toString), Hs = typeof BigInt > "u" ? null : ke(BigInt.prototype.toString), js = typeof Symbol > "u" ? null : ke(Symbol.prototype.toString), $e = ke(Object.prototype.hasOwnProperty), pn = ke(Object.prototype.toString), Se = ke(RegExp.prototype.test), gt = qr(TypeError);
function ke(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, l = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) l[s - 1] = arguments[s];
    return is(n, e, l);
  };
}
function qr(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), l = 0; l < e; l++) t[l] = arguments[l];
    return us(n, t);
  };
}
function Z(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : mn;
  if (zs && zs(n, null), !Zt(e)) return n;
  let l = e.length;
  for (; l--; ) {
    let s = e[l];
    if (typeof s == "string") {
      const a = t(s);
      a !== s && (zr(e) || (e[l] = a), s = a);
    }
    n[s] = !0;
  }
  return n;
}
function Gr(n) {
  for (let e = 0; e < n.length; e++) $e(n, e) || (n[e] = null);
  return n;
}
function Pe(n) {
  const e = qt(null);
  for (const l of cl(n)) {
    var t = Nr(l, 2);
    const s = t[0], a = t[1];
    $e(n, s) && (Zt(a) ? e[s] = Gr(a) : a && typeof a == "object" && a.constructor === Object ? e[s] = Pe(a) : e[s] = a);
  }
  return e;
}
function Yr(n) {
  switch (typeof n) {
    case "string":
      return n;
    case "number":
      return Wr(n);
    case "boolean":
      return Vr(n);
    case "bigint":
      return Hs ? Hs(n) : "0";
    case "symbol":
      return js ? js(n) : "Symbol()";
    case "undefined":
      return pn(n);
    case "function":
    case "object": {
      if (n === null) return pn(n);
      const e = n, t = Ue(e, "toString");
      if (typeof t == "function") {
        const l = t(e);
        return typeof l == "string" ? l : pn(l);
      }
      return pn(n);
    }
    default:
      return pn(n);
  }
}
function Ue(n, e) {
  for (; n !== null; ) {
    const l = Fr(n, e);
    if (l) {
      if (l.get) return ke(l.get);
      if (typeof l.value == "function") return ke(l.value);
    }
    n = Ur(n);
  }
  function t() {
    return null;
  }
  return t;
}
function Zr(n) {
  try {
    return Se(n, ""), !0;
  } catch {
    return !1;
  }
}
const Ws = ye([
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
]), es = ye([
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
]), ts = ye([
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
]), Kr = ye([
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
]), ns = ye([
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
]), Xr = ye([
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
]), Vs = ye(["#text"]), qs = ye([
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
]), ss = ye([
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
]), Gs = ye([
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
]), Dn = ye([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Qr = _e(/{{[\w\W]*|^[\w\W]*}}/g), Jr = _e(/<%[\w\W]*|^[\w\W]*%>/g), ea = _e(/\${[\w\W]*/g), ta = _e(/^data-[\-\w.\u00B7-\uFFFF]+$/), na = _e(/^aria-[\-\w]+$/), Ys = _e(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), sa = _e(/^(?:\w+script|data):/i), la = _e(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), ra = _e(/^html$/i), aa = _e(/^[a-z][.\w]*(-[.\w]+)+$/i), Zs = _e(/<[/\w!]/g), Ks = _e(/<[/\w]/g), oa = _e(/<\/no(script|embed|frames)/i), ia = _e(/\/>/i), Ie = {
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
}, pl = [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
], ua = ye(Z({}, pl)), ca = function() {
  const n = {};
  return Et(pl, (e) => {
    n[e] = _e(new RegExp("</" + e + "(?=[\\t\\n\\f\\r />])", "i"));
  }), ye(n);
}(), da = function() {
  return typeof window > "u" ? null : window;
}, pa = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function") return null;
  let l = null;
  const s = "data-tt-policy-suffix";
  t && t.hasAttribute(s) && (l = t.getAttribute(s));
  const a = "dompurify" + (l ? "#" + l : "");
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
}, Xs = function() {
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
}, mt = function(e, t, l, s) {
  return $e(e, t) && Zt(e[t]) ? Z(s.base ? Pe(s.base) : {}, e[t], s.transform) : l;
}, ls = function(e, t, l) {
  const s = $e(e, t) ? e[t] : void 0;
  return s && typeof s == "object" ? Pe(s) : l();
};
function hl() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : da();
  const e = (x) => hl(x);
  if (e.version = "3.4.16", e.removed = [], !n || !n.document || n.document.nodeType !== Ie.document || !n.Element)
    return e.isSupported = !1, e;
  let t = n.document;
  const l = t, s = l.currentScript;
  n.DocumentFragment;
  const a = n.HTMLTemplateElement, d = n.Node, u = n.Element, b = n.NodeFilter;
  n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const _ = n.DOMParser, S = n.trustedTypes, E = u.prototype, N = Ue(E, "cloneNode"), F = Ue(E, "remove"), L = Ue(E, "removeAttributeNode"), X = Ue(E, "nextSibling"), z = Ue(E, "childNodes"), Y = Ue(E, "parentNode"), ae = Ue(E, "shadowRoot"), C = Ue(E, "attributes"), U = d && d.prototype ? Ue(d.prototype, "nodeType") : null, M = d && d.prototype ? Ue(d.prototype, "nodeName") : null, ce = d && d.prototype ? Ue(d.prototype, "ownerDocument") : null, J = function(r) {
    return U ? U(r) : r.nodeType;
  }, B = function(r) {
    return M ? M(r) : r.nodeName;
  };
  if (typeof a == "function") {
    const x = t.createElement("template");
    x.content && x.content.ownerDocument && (t = x.content.ownerDocument);
  }
  let y, f = "", v, T = !1, R = 0;
  const P = function() {
    if (R > 0) throw gt('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, se = function(r) {
    P(), R++;
    try {
      return y.createHTML(r);
    } finally {
      R--;
    }
  }, j = function(r) {
    P(), R++;
    try {
      return y.createScriptURL(r);
    } finally {
      R--;
    }
  }, ge = function() {
    return T || (v = pa(S, s), T = !0), v;
  }, Be = t, vt = Be.implementation, it = Be.createNodeIterator, _n = Be.createDocumentFragment, Qt = Be.getElementsByTagName, It = l.importNode;
  let Q = Xs();
  e.isSupported = typeof cl == "function" && typeof Y == "function" && vt && vt.createHTMLDocument !== void 0;
  const ut = Qr, wn = Jr, xn = ea, Ot = ta, Wn = na, Vn = sa, Jt = la, kt = aa;
  let bt = Ys, ee = null;
  const Re = Z({}, [
    ...Ws,
    ...es,
    ...ts,
    ...ns,
    ...Vs
  ]);
  let oe = null;
  const Pt = Z({}, [
    ...qs,
    ...ss,
    ...Gs,
    ...Dn
  ]);
  let Ce = Object.seal(qt(null, {
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
  })), Ye = null, en = null;
  const Ze = Object.seal(qt(null, {
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
  let Sn = !0, Ke = !0, Tn = !1, Dt = !0, He = !1, nt = !0, W = !1, Nt = !1, yt = null, _t = null, tn = !1, st = !1, wt = !1, te = !1, xe = !0, Xe = !1;
  const ct = "user-content-";
  let Ne = !0, me = !1, je = {}, de = null;
  const dt = Z({}, [
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
  let nn = null;
  const sn = Z({}, [
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
  ]), Mt = "http://www.w3.org/1998/Math/MathML", We = "http://www.w3.org/2000/svg", Te = "http://www.w3.org/1999/xhtml";
  let Qe = Te, ln = !1, St = null;
  const qn = Z({}, [
    Mt,
    We,
    Te
  ], Jn), Tt = ye([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let Ve = Z({}, Tt);
  const lt = ye(["annotation-xml"]);
  let At = Z({}, lt);
  const zt = Z({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let pt = null;
  const An = ["application/xhtml+xml", "text/html"], Gn = "text/html";
  let pe = null, Je = null;
  const rt = t.createElement("form"), rn = function(r) {
    return r instanceof RegExp || r instanceof Function;
  }, Ut = function() {
    let r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (Je && Je === r) return;
    (!r || typeof r != "object") && (r = {}), r = Pe(r), pt = An.indexOf(r.PARSER_MEDIA_TYPE) === -1 ? Gn : r.PARSER_MEDIA_TYPE, pe = pt === "application/xhtml+xml" ? Jn : mn, ee = mt(r, "ALLOWED_TAGS", Re, { transform: pe }), oe = mt(r, "ALLOWED_ATTR", Pt, { transform: pe }), St = mt(r, "ALLOWED_NAMESPACES", qn, { transform: Jn }), fe = mt(r, "ADD_URI_SAFE_ATTR", xt, {
      transform: pe,
      base: xt
    }), nn = mt(r, "ADD_DATA_URI_TAGS", sn, {
      transform: pe,
      base: sn
    }), de = mt(r, "FORBID_CONTENTS", dt, { transform: pe }), Ye = mt(r, "FORBID_TAGS", Pe({}), { transform: pe }), en = mt(r, "FORBID_ATTR", Pe({}), { transform: pe }), je = $e(r, "USE_PROFILES") ? r.USE_PROFILES && typeof r.USE_PROFILES == "object" ? Pe(r.USE_PROFILES) : r.USE_PROFILES : !1, Sn = r.ALLOW_ARIA_ATTR !== !1, Ke = r.ALLOW_DATA_ATTR !== !1, Tn = r.ALLOW_UNKNOWN_PROTOCOLS || !1, Dt = r.ALLOW_SELF_CLOSE_IN_ATTR !== !1, He = r.SAFE_FOR_TEMPLATES || !1, nt = r.SAFE_FOR_XML !== !1, W = r.WHOLE_DOCUMENT || !1, st = r.RETURN_DOM || !1, wt = r.RETURN_DOM_FRAGMENT || !1, te = r.RETURN_TRUSTED_TYPE || !1, tn = r.FORCE_BODY || !1, xe = r.SANITIZE_DOM !== !1, Xe = r.SANITIZE_NAMED_PROPS || !1, Ne = r.KEEP_CONTENT !== !1, me = r.IN_PLACE || !1, bt = Zr(r.ALLOWED_URI_REGEXP) ? r.ALLOWED_URI_REGEXP : Ys, Qe = typeof r.NAMESPACE == "string" ? r.NAMESPACE : Te, Ve = ls(r, "MATHML_TEXT_INTEGRATION_POINTS", () => Z({}, Tt)), At = ls(r, "HTML_INTEGRATION_POINTS", () => Z({}, lt));
    const h = ls(r, "CUSTOM_ELEMENT_HANDLING", () => qt(null));
    if (Ce = qt(null), $e(h, "tagNameCheck") && rn(h.tagNameCheck) && (Ce.tagNameCheck = h.tagNameCheck), $e(h, "attributeNameCheck") && rn(h.attributeNameCheck) && (Ce.attributeNameCheck = h.attributeNameCheck), $e(h, "allowCustomizedBuiltInElements") && typeof h.allowCustomizedBuiltInElements == "boolean" && (Ce.allowCustomizedBuiltInElements = h.allowCustomizedBuiltInElements), _e(Ce), He && (Ke = !1), wt && (st = !0), je && (ee = Z({}, Vs), oe = qt(null), je.html === !0 && (Z(ee, Ws), Z(oe, qs)), je.svg === !0 && (Z(ee, es), Z(oe, ss), Z(oe, Dn)), je.svgFilters === !0 && (Z(ee, ts), Z(oe, ss), Z(oe, Dn)), je.mathMl === !0 && (Z(ee, ns), Z(oe, Gs), Z(oe, Dn))), Ze.tagCheck = null, Ze.attributeCheck = null, $e(r, "ADD_TAGS") && (typeof r.ADD_TAGS == "function" ? Ze.tagCheck = r.ADD_TAGS : Zt(r.ADD_TAGS) && (ee === Re && (ee = Pe(ee)), Z(ee, r.ADD_TAGS, pe))), $e(r, "ADD_ATTR") && (typeof r.ADD_ATTR == "function" ? Ze.attributeCheck = r.ADD_ATTR : Zt(r.ADD_ATTR) && (oe === Pt && (oe = Pe(oe)), Z(oe, r.ADD_ATTR, pe))), $e(r, "ADD_FORBID_CONTENTS") && Zt(r.ADD_FORBID_CONTENTS) && (de === dt && (de = Pe(de)), Z(de, r.ADD_FORBID_CONTENTS, pe)), Ne && (ee["#text"] = !0), W && Z(ee, [
      "html",
      "head",
      "body"
    ]), ee.table && (Z(ee, ["tbody"]), delete Ye.tbody), r.TRUSTED_TYPES_POLICY) {
      if (typeof r.TRUSTED_TYPES_POLICY.createHTML != "function") throw gt('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof r.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw gt('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const w = y;
      y = r.TRUSTED_TYPES_POLICY;
      try {
        f = se("");
      } catch (A) {
        throw y = w, A;
      }
    } else r.TRUSTED_TYPES_POLICY === null ? (y = void 0, f = "") : (y === void 0 && (y = ge()), y && typeof f == "string" && (f = se("")));
    ye && ye(r), Je = r;
  }, En = Z({}, [
    ...es,
    ...ts,
    ...Kr
  ]), an = Z({}, [...ns, ...Xr]), $n = function(r, h, w) {
    return h.namespaceURI === Te ? r === "svg" : h.namespaceURI === Mt ? r === "svg" && (w === "annotation-xml" || Ve[w]) : !!En[r];
  }, Yn = function(r, h, w) {
    return h.namespaceURI === Te ? r === "math" : h.namespaceURI === We ? r === "math" && At[w] : !!an[r];
  }, Rn = function(r, h, w) {
    return h.namespaceURI === We && !At[w] || h.namespaceURI === Mt && !Ve[w] ? !1 : !an[r] && (zt[r] || !En[r]);
  }, Zn = function(r) {
    let h = Y(r);
    (!h || !h.tagName) && (h = {
      namespaceURI: Qe,
      tagName: "template"
    });
    const w = mn(r.tagName), A = mn(h.tagName);
    return St[r.namespaceURI] ? r.namespaceURI === We ? $n(w, h, A) : r.namespaceURI === Mt ? Yn(w, h, A) : r.namespaceURI === Te ? Rn(w, h, A) : !!(pt === "application/xhtml+xml" && St[r.namespaceURI]) : !1;
  }, Me = function(r) {
    cn(e.removed, { element: r });
    try {
      Y(r).removeChild(r);
    } catch {
      if (F(r), !Y(r)) throw gt("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, i = function(r, h, w) {
    try {
      L(r, h);
    } catch {
      try {
        r.removeAttribute(w);
      } catch {
      }
    }
  }, p = function(r) {
    K(r);
    const h = z(r);
    if (h) {
      const A = [];
      Et(h, (D) => {
        cn(A, D);
      }), Et(A, (D) => {
        try {
          F(D);
        } catch {
        }
      });
    }
    const w = C(r);
    if (w) for (let A = w.length - 1; A >= 0; --A) {
      const D = w[A], V = D && D.name;
      typeof V == "string" && i(r, D, V);
    }
  }, c = function(r, h, w) {
    if (!w) try {
      w = h.getAttributeNode(r);
    } catch {
      w = null;
    }
    cn(e.removed, {
      attribute: w || null,
      from: h
    });
    try {
      w ? L(h, w) : h.removeAttribute(r);
    } catch {
      try {
        h.removeAttribute(r);
      } catch {
      }
    }
    if (r === "is")
      if (st || wt) try {
        Me(h);
      } catch {
      }
      else try {
        h.setAttribute(r, "");
      } catch {
      }
  }, $ = function(r) {
    const h = C(r);
    if (h)
      for (let w = h.length - 1; w >= 0; --w) {
        const A = h[w], D = A && A.name;
        typeof D != "string" || oe[pe(D)] || i(r, A, D);
      }
  }, K = function(r) {
    const h = [r];
    for (; h.length > 0; ) {
      const w = h.pop();
      J(w) === Ie.element && $(w);
      const A = z(w);
      if (A) for (let D = A.length - 1; D >= 0; --D) h.push(A[D]);
    }
  }, ht = function(r, h) {
    return nt ? r === "patchsrc" ? !0 : r === "for" && h !== "label" && h !== "output" : !1;
  }, vl = function(r) {
    if (!nt) return;
    const h = [r];
    for (; h.length > 0; ) {
      const w = h.pop(), A = J(w);
      if (A === Ie.processingInstruction || A === Ie.comment && Se(Ks, w.data)) {
        try {
          F(w);
        } catch {
        }
        continue;
      }
      if (A === Ie.element) {
        const V = w, G = pe(B(w));
        try {
          V.hasAttribute && V.hasAttribute("patchsrc") && V.removeAttribute("patchsrc"), V.hasAttribute && V.hasAttribute("for") && ht("for", G) && V.removeAttribute("for");
        } catch {
        }
      }
      const D = z(w);
      if (D) for (let V = D.length - 1; V >= 0; --V) h.push(D[V]);
    }
  }, bs = function(r) {
    let h = null, w = null;
    if (tn) r = "<remove></remove>" + r;
    else {
      const V = Fs(r, /^[\r\n\t ]+/);
      w = V && V[0];
    }
    pt === "application/xhtml+xml" && Qe === Te && (r = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + r + "</body></html>");
    const A = y ? se(r) : r;
    if (Qe === Te) try {
      h = new _().parseFromString(A, pt);
    } catch {
    }
    if (!h || !h.documentElement) {
      h = vt.createDocument(Qe, "template", null);
      try {
        h.documentElement.innerHTML = ln ? f : A;
      } catch {
      }
    }
    const D = h.body || h.documentElement;
    return r && w && D.insertBefore(t.createTextNode(w), D.childNodes[0] || null), Qe === Te ? Qt.call(h, W ? "html" : "body")[0] : W ? h.documentElement : D;
  }, ys = function(r) {
    const h = ce ? ce(r) : r.ownerDocument;
    return it.call(h || r, r, b.SHOW_ELEMENT | b.SHOW_COMMENT | b.SHOW_TEXT | b.SHOW_PROCESSING_INSTRUCTION | b.SHOW_CDATA_SECTION, null);
  }, Cn = function(r) {
    return r = dn(r, ut, " "), r = dn(r, wn, " "), r = dn(r, xn, " "), r;
  }, Kn = function(r) {
    var h;
    r.normalize();
    const w = ce ? ce(r) : r.ownerDocument, A = it.call(w || r, r, b.SHOW_TEXT | b.SHOW_COMMENT | b.SHOW_CDATA_SECTION | b.SHOW_PROCESSING_INSTRUCTION, null);
    let D = A.nextNode();
    for (; D; )
      D.data = Cn(D.data), D = A.nextNode();
    const V = (h = r.querySelectorAll) === null || h === void 0 ? void 0 : h.call(r, "template");
    V && Et(V, (G) => {
      Ft(G.content) && Kn(G.content);
    });
  }, Ln = function(r) {
    const h = M ? M(r) : null;
    return typeof h != "string" || pe(h) !== "form" ? !1 : typeof r.nodeName != "string" || typeof r.textContent != "string" || typeof r.removeChild != "function" || r.attributes !== C(r) || typeof r.removeAttribute != "function" || typeof r.removeAttributeNode != "function" || typeof r.getAttributeNode != "function" || typeof r.setAttribute != "function" || typeof r.namespaceURI != "string" || typeof r.insertBefore != "function" || typeof r.hasChildNodes != "function" || r.nodeType !== U(r) || r.childNodes !== z(r);
  }, Ft = function(r) {
    if (!U || typeof r != "object" || r === null) return !1;
    try {
      return U(r) === Ie.documentFragment;
    } catch {
      return !1;
    }
  }, on = function(r) {
    if (!U || typeof r != "object" || r === null) return !1;
    try {
      return typeof U(r) == "number";
    } catch {
      return !1;
    }
  };
  function et(x, r, h) {
    x.length !== 0 && Et(x, (w) => {
      w.call(e, r, h, Je);
    });
  }
  const kl = function(r, h) {
    return !!(nt && r.hasChildNodes() && !on(r.firstElementChild) && Se(Zs, r.textContent) && Se(Zs, r.innerHTML) || nt && r.namespaceURI === Te && ua[h] && (on(r.firstElementChild) || typeof r.textContent == "string" && Se(ca[h], r.textContent)) || r.nodeType === Ie.processingInstruction || nt && r.nodeType === Ie.comment && Se(Ks, r.data));
  }, In = function(r, h) {
    if (r instanceof RegExp) return Se(r, h);
    if (r instanceof Function) {
      for (var w = arguments.length, A = new Array(w > 2 ? w - 2 : 0), D = 2; D < w; D++) A[D - 2] = arguments[D];
      return !!r(h, ...A);
    }
    return !1;
  }, bl = function(r, h, w) {
    if (!Ye[h] && Ss(h) && In(Ce.tagNameCheck, h)) return !1;
    if (Ne && !de[h]) {
      const A = Y(r), D = z(r);
      if (D && A) {
        const V = D.length;
        for (let G = V - 1; G >= 0; --G) {
          const he = r === w ? N(D[G], !0) : D[G];
          A.insertBefore(he, X(r));
        }
      }
    }
    return Me(r), !0;
  }, _s = function(r, h, w, A) {
    return r.length === 0 ? h : h === w || h === A ? Pe(h) : h;
  }, Bt = function(r, h) {
    return r === h || Y(r) !== null ? !1 : (me && K(r), !0);
  }, ws = function(r, h) {
    if (et(Q.beforeSanitizeElements, r, null), Bt(r, h)) return !0;
    if (Ln(r))
      return Me(r), !0;
    const w = pe(B(r));
    if (ee = _s(Q.uponSanitizeElement, ee, Re, yt), et(Q.uponSanitizeElement, r, {
      tagName: w,
      allowedTags: ee
    }), Bt(r, h)) return !0;
    if (kl(r, w))
      return Me(r), !0;
    if (Ye[w] || !(Ze.tagCheck instanceof Function && Ze.tagCheck(w)) && !ee[w]) {
      const A = bl(r, w, h);
      return A === !1 && (et(Q.afterSanitizeElements, r, null), Bt(r, h)) ? !0 : A;
    }
    if (J(r) === Ie.element && !Zn(r) || (w === "noscript" || w === "noembed" || w === "noframes") && Se(oa, r.innerHTML))
      return Me(r), !0;
    if (He && r.nodeType === Ie.text) {
      const A = Cn(r.textContent);
      r.textContent !== A && (cn(e.removed, { element: r.cloneNode() }), r.textContent = A);
    }
    return et(Q.afterSanitizeElements, r, null), Bt(r, h);
  }, xs = function(r, h, w) {
    if (en[h] || ht(h, r) || xe && (h === "id" || h === "name") && (w in t || w in rt)) return !1;
    const A = oe[h] || Ze.attributeCheck instanceof Function && Ze.attributeCheck(h, r);
    return Ke && Se(Ot, h) || Sn && Se(Wn, h) ? !0 : A ? fe[h] || Se(bt, dn(w, Jt, "")) || (h === "src" || h === "xlink:href" || h === "href") && r !== "script" && Bs(w, "data:") === 0 && nn[r] || Tn && !Se(Vn, dn(w, Jt, "")) ? !0 : !w : Ss(r) && In(Ce.tagNameCheck, r) && In(Ce.attributeNameCheck, h, r) || h === "is" && Ce.allowCustomizedBuiltInElements && In(Ce.tagNameCheck, w);
  }, yl = Z({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), Ss = function(r) {
    return !yl[mn(r)] && Se(kt, r);
  }, _l = function(r, h, w, A) {
    if (y && typeof S == "object" && typeof S.getAttributeType == "function" && !w) switch (S.getAttributeType(r, h)) {
      case "TrustedHTML":
        return se(A);
      case "TrustedScriptURL":
        return j(A);
    }
    return A;
  }, wl = function(r, h, w, A) {
    try {
      return w ? r.setAttributeNS(w, h, A) : r.setAttribute(h, A), Ln(r) ? (Me(r), !1) : !0;
    } catch {
      return c(h, r), !1;
    }
  }, Ts = function(r, h) {
    if (et(Q.beforeSanitizeAttributes, r, null), Bt(r, h)) return;
    const w = r.attributes;
    if (!w || Ln(r)) return;
    oe = _s(Q.uponSanitizeAttribute, oe, Pt, _t);
    const A = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: oe,
      forceKeepAttr: void 0
    };
    let D = w.length;
    const V = pe(r.nodeName);
    for (; D--; ) {
      const G = w[D], he = G.name, ze = G.namespaceURI, Le = G.value, Ht = pe(he), Qn = Le;
      let Ae = he === "value" ? Qn : jr(Qn), As = !1;
      if (A.attrName = Ht, A.attrValue = Ae, A.keepAttr = !0, A.forceKeepAttr = void 0, et(Q.uponSanitizeAttribute, r, A), Ae = A.attrValue, Xe && (Ht === "id" || Ht === "name") && Bs(Ae, ct) !== 0 && (c(he, r, G), Ae = ct + Ae, As = !0), nt && Se(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, Ae)) {
        c(he, r, G);
        continue;
      }
      if (Ht === "attributename" && Fs(Ae, "href")) {
        c(he, r, G);
        continue;
      }
      if (!A.forceKeepAttr) {
        if (!A.keepAttr) {
          c(he, r, G);
          continue;
        }
        if (!Dt && Se(ia, Ae)) {
          c(he, r, G);
          continue;
        }
        if (He && (Ae = Cn(Ae)), !xs(V, Ht, Ae)) {
          c(he, r, G);
          continue;
        }
        Ae = _l(V, Ht, ze, Ae), Ae !== Qn && wl(r, he, ze, Ae) && As && Us(e.removed);
      }
    }
    et(Q.afterSanitizeAttributes, r, null), Bt(r, h);
  }, On = function(r) {
    let h = null;
    const w = ys(r);
    for (et(Q.beforeSanitizeShadowDOM, r, null); h = w.nextNode(); )
      if (et(Q.uponSanitizeShadowNode, h, null), ws(h, r), Ts(h, r), Ft(h.content) && On(h.content), J(h) === Ie.element) {
        const A = ae(h);
        Ft(A) && (Xn(A), On(A));
      }
    et(Q.afterSanitizeShadowDOM, r, null);
  }, Xn = function(r) {
    const h = [{
      node: r,
      shadow: null
    }];
    for (; h.length > 0; ) {
      const w = h.pop();
      if (w.shadow) {
        On(w.shadow);
        continue;
      }
      const A = w.node, D = J(A) === Ie.element, V = z(A);
      if (V) for (let G = V.length - 1; G >= 0; --G) h.push({
        node: V[G],
        shadow: null
      });
      if (D) {
        const G = M ? M(A) : null;
        if (typeof G == "string" && pe(G) === "template") {
          const he = A.content;
          Ft(he) && h.push({
            node: he,
            shadow: null
          });
        }
      }
      if (D) {
        const G = ae(A);
        Ft(G) && h.push({
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
    let r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, h = null, w = null, A = null, D = null;
    if (ln = !x, ln && (x = "<!-->"), typeof x != "string" && !on(x) && (x = Yr(x), typeof x != "string"))
      throw gt("dirty is not a string, aborting");
    if (!e.isSupported) return x;
    Nt ? (ee = yt, oe = _t) : Ut(r), (Q.uponSanitizeElement.length > 0 || Q.uponSanitizeAttribute.length > 0) && (ee = Pe(ee)), Q.uponSanitizeAttribute.length > 0 && (oe = Pe(oe)), e.removed = [];
    const V = me && typeof x != "string" && on(x);
    if (V) {
      vl(x);
      const ze = B(x);
      if (typeof ze == "string") {
        const Le = pe(ze);
        if (!ee[Le] || Ye[Le])
          throw p(x), gt("root node is forbidden and cannot be sanitized in-place");
      }
      if (Ln(x))
        throw p(x), gt("root node is clobbered and cannot be sanitized in-place");
      try {
        Xn(x);
      } catch (Le) {
        throw p(x), Le;
      }
    } else if (on(x))
      h = bs("<!---->"), w = h.ownerDocument.importNode(x, !0), w.nodeType === Ie.element && w.nodeName === "BODY" || w.nodeName === "HTML" ? h = w : h.appendChild(w), Xn(h);
    else {
      if (!st && !He && !W && x.indexOf("<") === -1) return y && te ? se(x) : x;
      if (h = bs(x), !h) return st ? null : te ? f : "";
    }
    h && tn && Me(h.firstChild);
    const G = V ? x : h;
    try {
      const ze = ys(G);
      for (; A = ze.nextNode(); )
        ws(A, G), Ts(A, G), Ft(A.content) && On(A.content);
    } catch (ze) {
      throw V && (p(x), Et(e.removed, (Le) => {
        Le.element && K(Le.element);
      })), ze;
    }
    if (V) {
      let ze = !1;
      if (Et(e.removed, (Le) => {
        Le.element && (Le.element === x && (ze = !0), K(Le.element));
      }), ze) throw gt("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return He && Kn(x), x;
    }
    if (st) {
      if (He && Kn(h), wt)
        for (D = _n.call(h.ownerDocument); h.firstChild; ) D.appendChild(h.firstChild);
      else D = h;
      return (oe.shadowroot || oe.shadowrootmode) && (D = It.call(l, D, !0)), D;
    }
    let he = W ? h.outerHTML : h.innerHTML;
    return W && ee["!doctype"] && h.ownerDocument && h.ownerDocument.doctype && h.ownerDocument.doctype.name && Se(ra, h.ownerDocument.doctype.name) && (he = "<!DOCTYPE " + h.ownerDocument.doctype.name + `>
` + he), He && (he = Cn(he)), y && te ? se(he) : he;
  }, e.setConfig = function() {
    let x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Ut(x), Nt = !0, yt = ee, _t = oe;
  }, e.clearConfig = function() {
    Je = null, Nt = !1, yt = null, _t = null, y = v, f = "";
  }, e.isValidAttribute = function(x, r, h) {
    Je || Ut({});
    const w = pe(x), A = pe(r);
    return xs(w, A, h);
  }, e.addHook = function(x, r) {
    typeof r == "function" && $e(Q, x) && cn(Q[x], r);
  }, e.removeHook = function(x, r) {
    if ($e(Q, x)) {
      if (r !== void 0) {
        const h = Br(Q[x], r);
        return h === -1 ? void 0 : Hr(Q[x], h, 1)[0];
      }
      return Us(Q[x]);
    }
  }, e.removeHooks = function(x) {
    $e(Q, x) && (Q[x] = []);
  }, e.removeAllHooks = function() {
    Q = Xs();
  }, e;
}
var ha = hl();
const fa = ["innerHTML"], ga = /* @__PURE__ */ Kt({
  __name: "MarkdownContent",
  props: {
    content: {}
  },
  setup(n) {
    const e = n, t = q(() => ha.sanitize(re.parse(e.content, { async: !1, breaks: !0 })));
    return (l, s) => (m(), k("div", {
      class: "markdown-content",
      innerHTML: t.value
    }, null, 8, fa));
  }
}), ks = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [l, s] of e)
    t[l] = s;
  return t;
}, hn = /* @__PURE__ */ ks(ga, [["__scopeId", "data-v-ef377647"]]);
function fl() {
  const n = localStorage.getItem("0kay_lang");
  return n === "en" || n === "zh" ? n : navigator.language.startsWith("zh") ? "zh" : "en";
}
const at = O(fl());
function ma() {
  at.value = fl();
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
}, Da = { key: 1 }, Na = {
  key: 2,
  class: "tool-section-text"
}, Ma = {
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
}, Ya = /* @__PURE__ */ Kt({
  __name: "ToolStepCard",
  props: {
    step: {},
    formatError: { type: Function }
  },
  setup(n) {
    const e = n, t = (y, f) => at.value === "en" ? f : y, l = O(!1), s = O(!1), a = q(() => (e.step.prompt || "").trim() || "tool"), d = q(() => ["websearch", "web_search", "search"].includes(a.value)), u = q(() => {
      if (!e.step.args) return null;
      try {
        const y = JSON.parse(e.step.args);
        return y && typeof y == "object" && !Array.isArray(y) ? y : null;
      } catch {
        return null;
      }
    }), b = q(() => {
      if (!e.step.result) return null;
      try {
        return JSON.parse(e.step.result);
      } catch {
        return e.step.result;
      }
    }), _ = q(() => {
      const y = b.value;
      return !y || typeof y != "object" || Array.isArray(y) ? null : y.data !== void 0 && y.data !== null && typeof y.data == "object" && !Array.isArray(y.data) ? y.data : "success" in y ? null : y;
    }), S = q(() => {
      const y = _.value;
      return !y || typeof y.base64 != "string" || typeof y.mime != "string" || !y.mime.startsWith("image/") ? null : { src: `data:${y.mime};base64,${y.base64}`, width: y.width, height: y.height, path: y.path };
    }), E = q(() => {
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
    }), N = (y) => (at.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[y] || y;
    function F(y) {
      let f = 0, v = 0;
      for (const T of String(y || "").split(`
`))
        T.startsWith("---") || T.startsWith("+++") || (T.startsWith("+") ? f++ : T.startsWith("-") && v++);
      return { added: f, removed: v };
    }
    const L = q(() => {
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
    function X(y, f) {
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
    const z = q(() => {
      const y = a.value, f = _.value, v = u.value;
      if (y === "edit" && f) return X(String(f.diff || ""), String(v?.filePath || f.path || ""));
      if (y === "apply_patch") {
        const T = [];
        if (Array.isArray(f?.files)) {
          for (const R of f.files) {
            const P = X(String(R?.diff || ""), String(R?.path || ""));
            P.length ? T.push(...P) : T.push({ path: String(R?.path || ""), lines: [] });
          }
          return T;
        }
        if (Array.isArray(v?.patches)) {
          const R = v.patches.map((P) => String(P?.patch ?? P?.diff ?? P?.text ?? "")).join(`
`);
          return X(R, "");
        }
        return T;
      }
      return [];
    });
    function Y(y) {
      const f = y.lines || [], v = f.filter((R) => R.kind === "add").length, T = f.filter((R) => R.kind === "del").length;
      return v || T ? `+${v} −${T}` : "";
    }
    const ae = q(() => {
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
    }), C = q(() => String(_.value?.query ?? u.value?.query ?? e.step.args ?? "")), U = q(() => Array.isArray(_.value?.results) ? _.value.results : []), M = q(() => typeof b.value == "string" ? b.value : b.value === null && e.step.result ? e.step.result : ""), ce = q(() => {
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
      l.value = !l.value;
    }
    function B(y) {
      y.key === "Escape" && s.value && (s.value = !1);
    }
    return Gt(() => window.addEventListener("keydown", B)), vn(() => window.removeEventListener("keydown", B)), (y, f) => (m(), k("div", {
      class: ie(["tool-card", { expanded: l.value }])
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
        o("small", ya, g(N(n.step.state)), 1),
        f[2] || (f[2] = o("span", {
          class: "tool-chevron",
          "aria-hidden": "true"
        }, "▸", -1))
      ]),
      l.value && !d.value ? (m(), k("div", _a, [
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
          v.mono ? (m(), k("pre", Da, g(v.text), 1)) : (m(), k("p", Na, g(v.text), 1))
        ], 64))), 128)),
        !ce.value.length && !z.value.length && !S.value && n.step.state !== "running" && !n.step.error ? (m(), k("p", Ma, g(t("执行完成，无输出", "Completed with no output")), 1)) : I("", !0),
        n.step.error ? (m(), k("p", za, g(n.formatError?.(n.step.error) || n.step.error), 1)) : I("", !0)
      ])) : I("", !0),
      s.value ? (m(), k("div", {
        key: 1,
        class: "tool-dialog-backdrop",
        onClick: f[1] || (f[1] = De((v) => s.value = !1, ["self"]))
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
          ])) : (m(), k("p", qa, g(M.value || t("没有找到相关结果。", "No relevant results found.")), 1)),
          n.step.error ? (m(), k("p", Ga, g(n.formatError?.(n.step.error) || n.step.error), 1)) : I("", !0)
        ], 8, Ua)
      ])) : I("", !0)
    ], 2));
  }
}), Qs = /* @__PURE__ */ ks(Ya, [["__scopeId", "data-v-f13fbd25"]]);
function gl(n = "") {
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
}, Nn = /* @__PURE__ */ Kt({
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
    const t = n, l = e, s = O(null), a = O(null), d = O(null), u = O(!1), b = O(-1), _ = O({}), S = O(!1), E = O(""), N = gl("select"), F = q(() => t.options.map((f) => typeof f == "string" ? { value: f, label: f } : f)), L = q(() => {
      if (!t.searchable || !E.value.trim()) return F.value;
      const f = E.value.trim().toLocaleLowerCase();
      return F.value.filter((v) => v.label.toLocaleLowerCase().includes(f) || v.value.toLocaleLowerCase().includes(f));
    }), X = q(() => F.value.find((f) => f.value === t.modelValue)?.label || t.modelValue || t.placeholder);
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
      t.disabled || u.value || (u.value = !0, E.value = "", b.value = L.value.findIndex((f) => f.value === t.modelValue && !f.disabled), b.value < 0 && (b.value = L.value.findIndex((f) => !f.disabled)), ae(), l("open"), await tt(), t.searchable && d.value?.focus(), M());
    }
    function M() {
      a.value?.querySelector(`[data-index="${b.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function ce(f) {
      const v = L.value[f];
      !v || v.disabled || (l("update:modelValue", v.value), l("change", v.value), C(!0));
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
          b.value = f.key === "Home" ? v[0] : f.key === "End" ? v[v.length - 1] : v[(T + (f.key === "ArrowDown" ? 1 : -1) + v.length) % v.length], await tt(), M();
          return;
        }
        if (!t.searchable && f.key.length === 1 && !f.ctrlKey && !f.metaKey && !f.altKey) {
          await U();
          const v = Date.now();
          z = v - Y > 700 ? f.key : z + f.key, Y = v;
          const T = L.value.findIndex((R) => !R.disabled && R.label.toLocaleLowerCase().startsWith(z.toLocaleLowerCase()));
          T >= 0 && (b.value = T, await tt(), M());
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
      u.value && (b.value >= L.value.length && (b.value = L.value.findIndex((f) => !f.disabled)), tt(ae));
    }), be(E, () => {
      u.value && (b.value = L.value.findIndex((f) => !f.disabled), tt(M));
    }), Gt(() => {
      document.addEventListener("pointerdown", B, !0), window.addEventListener("resize", ae), window.addEventListener("scroll", y, !0);
    }), vn(() => {
      document.removeEventListener("pointerdown", B, !0), window.removeEventListener("resize", ae), window.removeEventListener("scroll", y, !0);
    }), (f, v) => (m(), k("div", Al(f.$attrs, {
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
        "aria-controls": u.value ? ue(N) : void 0,
        "aria-activedescendant": u.value && b.value >= 0 ? `${ue(N)}-${b.value}` : void 0,
        "aria-label": n.ariaLabel,
        disabled: n.disabled,
        onClick: v[0] || (v[0] = (T) => u.value ? C() : U()),
        onKeydown: J,
        onFocus: v[1] || (v[1] = (T) => l("focus", T))
      }, [
        o("span", Ka, g(X.value), 1),
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
      (m(), Rt(jn, { to: "body" }, [
        Fe(Js, { name: "select-menu" }, {
          default: el(() => [
            u.value ? (m(), k("div", {
              key: 0,
              id: ue(N),
              ref_key: "menu",
              ref: a,
              class: ie(["app-select-menu", { "opens-up": S.value }]),
              style: Yt(_.value),
              role: "listbox",
              "aria-label": n.ariaLabel || "选项",
              onPointerdown: v[3] || (v[3] = De(() => {
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
                fn(o("input", {
                  ref_key: "searchInput",
                  ref: d,
                  "onUpdate:modelValue": v[2] || (v[2] = (T) => E.value = T),
                  type: "text",
                  placeholder: ue(at) === "en" ? "Search…" : "搜索…",
                  onKeydown: J
                }, null, 40, eo), [
                  [zn, E.value]
                ])
              ])) : I("", !0),
              (m(!0), k(ne, null, ve(L.value, (T, R) => (m(), k("div", {
                id: `${ue(N)}-${R}`,
                key: `${T.value}:${R}`,
                role: "option",
                "aria-selected": T.value === n.modelValue,
                "aria-disabled": !!T.disabled,
                "data-index": R,
                class: ie(["app-select-option", { highlighted: b.value === R, selected: T.value === n.modelValue, disabled: T.disabled }]),
                onPointermove: (P) => !T.disabled && (b.value = R),
                onClick: De((P) => ce(R), ["stop"])
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
              L.value.length ? I("", !0) : (m(), k("div", so, g(ue(at) === "en" ? "No matches" : "没有匹配项"), 1))
            ], 46, Qa)) : I("", !0)
          ]),
          _: 1
        })
      ]))
    ], 16));
  }
}), lo = { class: "thinking-caption" }, ro = ["disabled", "aria-expanded", "aria-controls"], ao = ["id", "onKeydown"], oo = {
  class: "thinking-capsule",
  "aria-hidden": "true"
}, io = ["value", "aria-valuetext"], uo = {
  key: 0,
  class: "energy-wave",
  "aria-hidden": "true"
}, co = { class: "thinking-stops" }, po = ["aria-pressed", "onClick"], ho = { class: "thinking-provider-note" }, fo = /* @__PURE__ */ Kt({
  __name: "ThinkingSlider",
  props: {
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = q(() => at.value === "en"), l = n, s = e, a = q(() => [{ value: 0, label: t.value ? "Off" : "关闭思考" }, { value: 20, label: t.value ? "Low" : "低" }, { value: 50, label: t.value ? "Medium" : "中" }, { value: 75, label: t.value ? "High" : "高" }, { value: 100, label: t.value ? "Max" : "最高" }]), d = q(() => l.modelValue === 0 ? 0 : l.modelValue < 35 ? 1 : l.modelValue < 62.5 ? 2 : l.modelValue < 87.5 ? 3 : 4), u = O(!1), b = O({}), _ = O(null), S = O(null), E = O(null), N = O(d.value * 25), F = O(!1), L = q(() => d.value === 4), X = gl("thinking");
    let z;
    be(() => l.modelValue, () => {
      u.value || (N.value = d.value * 25);
    }), be(L, (B, y) => {
      B && !y && (F.value = !0, clearTimeout(z), z = setTimeout(() => F.value = !1, 900));
    }), be(() => l.disabled, (B) => {
      B && (u.value = !1);
    });
    function Y() {
      const B = _.value?.getBoundingClientRect();
      if (!B) return;
      const y = Math.min(352, innerWidth - 16), f = 236, v = B.top >= f + 8 || innerHeight - B.bottom < f;
      b.value = { left: `${Math.max(8, Math.min(B.left, innerWidth - y - 8))}px`, width: `${y}px`, ...v ? { bottom: `${innerHeight - B.top + 8}px` } : { top: `${B.bottom + 8}px` } };
    }
    async function ae() {
      l.disabled || (u.value = !u.value, u.value && (N.value = d.value * 25, Y(), await tt(), E.value?.focus()));
    }
    function C() {
      u.value = !1, _.value?.focus();
    }
    function U(B) {
      N.value = Number(B.target.value), s("update:modelValue", a.value[Math.round(N.value / 25)].value);
    }
    function M(B) {
      N.value = B * 25, s("update:modelValue", a.value[B].value);
    }
    function ce(B) {
      const y = B.target;
      !_.value?.contains(y) && !S.value?.contains(y) && (u.value = !1);
    }
    function J(B) {
      u.value && (!(B.target instanceof Node) || !S.value?.contains(B.target)) && Y();
    }
    return Gt(() => {
      document.addEventListener("pointerdown", ce, !0), window.addEventListener("resize", Y), window.addEventListener("scroll", J, !0);
    }), vn(() => {
      clearTimeout(z), document.removeEventListener("pointerdown", ce, !0), window.removeEventListener("resize", Y), window.removeEventListener("scroll", J, !0);
    }), (B, y) => (m(), k("div", {
      class: ie(["thinking-control", { full: L.value, pulse: F.value }])
    }, [
      o("span", lo, g(t.value ? "Thinking effort" : "思考强度"), 1),
      o("button", {
        ref_key: "trigger",
        ref: _,
        type: "button",
        class: "thinking-trigger",
        disabled: n.disabled,
        "aria-label": "思考强度",
        "aria-haspopup": "dialog",
        "aria-expanded": u.value,
        "aria-controls": u.value ? ue(X) : void 0,
        onClick: ae,
        onKeydown: jt(C, ["esc"])
      }, [
        o("span", null, g(L.value ? "✦ " : "") + g(a.value[d.value].label), 1),
        y[5] || (y[5] = o("span", { "aria-hidden": "true" }, "⌄", -1))
      ], 40, ro),
      (m(), Rt(jn, { to: "body" }, [
        Fe(Js, { name: "thinking-menu" }, {
          default: el(() => [
            u.value ? (m(), k("section", {
              key: 0,
              id: ue(X),
              ref_key: "panel",
              ref: S,
              class: ie(["thinking-popover", { full: L.value, pulse: F.value }]),
              style: Yt(b.value),
              role: "dialog",
              "aria-label": "调整思考强度",
              onKeydown: jt(De(C, ["prevent", "stop"]), ["esc"])
            }, [
              o("header", null, [
                o("strong", null, g(t.value ? "Thinking effort" : "思考强度"), 1),
                o("output", null, g(L.value ? "✦ " : "") + g(a.value[d.value].label), 1)
              ]),
              o("div", {
                class: "thinking-track",
                style: Yt({ "--intensity": `${N.value}%` })
              }, [
                o("div", oo, [
                  y[6] || (y[6] = o("div", { class: "thinking-fill" }, null, -1)),
                  (m(!0), k(ne, null, ve(a.value, (f, v) => (m(), k("span", {
                    key: v,
                    class: ie(["thinking-tick", { passed: N.value >= v * 25 }]),
                    style: Yt({ left: `${v * 25}%` })
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
                  "aria-valuetext": a.value[d.value].label,
                  onInput: U,
                  onChange: y[0] || (y[0] = (f) => N.value = d.value * 25),
                  onKeydown: [
                    y[1] || (y[1] = jt(De((f) => M(0), ["prevent"]), ["home"])),
                    y[2] || (y[2] = jt(De((f) => M(4), ["prevent"]), ["end"])),
                    y[3] || (y[3] = jt(De((f) => M(Math.min(4, d.value + 1)), ["prevent"]), ["arrow-right"])),
                    y[4] || (y[4] = jt(De((f) => M(Math.max(0, d.value - 1)), ["prevent"]), ["arrow-left"]))
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
                  onClick: (T) => M(v)
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
}), Vt = O(null);
function ml() {
  function n(t) {
    const l = typeof t == "string" ? { message: t } : t;
    return Vt.value && Vt.value.resolve(!1), new Promise((s) => {
      Vt.value = { options: l, resolve: s };
    });
  }
  function e(t) {
    const l = Vt.value;
    Vt.value = null, l?.resolve(t);
  }
  return { confirmState: Vt, confirm: n, settle: e };
}
const go = /* @__PURE__ */ Kt({
  __name: "ConfirmDialog",
  setup(n) {
    const { confirmState: e, settle: t } = ml(), l = O(null), s = O(null);
    let a = null;
    const d = () => (document.documentElement.lang || "").startsWith("en"), u = () => e.value?.options.title || (d() ? "Confirm" : "请确认"), b = () => e.value?.options.confirmLabel || (d() ? "Confirm" : "确认"), _ = () => e.value?.options.cancelLabel || (d() ? "Cancel" : "取消");
    be(() => !!e.value, async (E) => {
      E ? (a = document.activeElement, await tt(), l.value?.focus(), s.value?.focus()) : (l.value = null, a?.focus?.());
    });
    function S(E) {
      if (!e.value) return;
      if (E.key === "Escape") {
        E.preventDefault(), t(!1);
        return;
      }
      if (E.key !== "Tab" || !l.value) return;
      const N = [...l.value.querySelectorAll("button:not(:disabled)")];
      if (!N.length) return;
      const F = N[0], L = N[N.length - 1];
      E.shiftKey && document.activeElement === F ? (E.preventDefault(), L.focus()) : !E.shiftKey && document.activeElement === L && (E.preventDefault(), F.focus());
    }
    return (E, N) => (m(), Rt(jn, { to: "body" }, [
      ue(e) ? (m(), k("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: N[2] || (N[2] = De((F) => ue(t)(!1), ["self"])),
        onKeydown: S
      }, [
        o("section", {
          ref_key: "dialog",
          ref: l,
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
              onClick: N[0] || (N[0] = (F) => ue(t)(!1))
            }, g(_()), 513),
            o("button", {
              type: "button",
              class: ie(["confirm-primary", { danger: ue(e).options.danger !== !1 }]),
              onClick: N[1] || (N[1] = (F) => ue(t)(!0))
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
}, Do = {
  key: 1,
  class: "session-actions"
}, No = ["disabled"], Mo = ["disabled"], zo = {
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
}, ni = ["onClick"], si = { class: "subagent-prompt" }, li = { key: 3 }, ri = {
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
}, Pi = { class: "execution-options" }, Di = ["disabled", "title"], Ni = ["aria-label"], Mi = ["aria-selected", "onMousedown", "onMouseenter"], zi = { class: "slash-name" }, Ui = { class: "slash-desc" }, Fi = {
  key: 0,
  class: "attach-chips"
}, Bi = ["title"], Hi = ["aria-label", "title", "onClick"], ji = {
  key: 0,
  class: "attach-error"
}, Wi = ["disabled", "placeholder"], Vi = { class: "composer-actions" }, qi = ["disabled", "aria-label", "title"], Gi = ["disabled", "aria-label", "title"], Yi = ["aria-label", "title"], Zi = ["aria-label"], Ki = { class: "ctx-value" }, Xi = {
  class: "ctx-tip",
  role: "tooltip"
}, Qi = { class: "ctx-used" }, Ji = ["aria-expanded"], eu = ["disabled"], tu = { class: "muted" }, nu = {
  class: "directory-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "选择工作区目录"
}, su = { class: "directory-roots" }, lu = ["disabled", "onClick"], ru = ["disabled"], au = ["disabled"], ou = ["disabled"], iu = {
  key: 0,
  class: "error"
}, uu = { key: 1 }, cu = {
  key: 2,
  class: "directory-list"
}, du = ["onClick"], pu = {
  key: 1,
  class: "muted"
}, hu = ["disabled"], fu = /* @__PURE__ */ Kt({
  __name: "AgentsPage",
  setup(n) {
    const e = (i, p) => at.value === "en" ? p : i, { confirm: t } = ml(), l = Cl(), s = O(localStorage.getItem("0kay.agent.selected") || ""), a = O(""), d = O([]), u = O(!1), b = O(""), _ = O(null);
    function S() {
      _.value?.click();
    }
    function E(i) {
      d.value.splice(i, 1);
    }
    async function N(i) {
      if (i.length) {
        u.value = !0, b.value = "";
        try {
          for (const p of i) {
            const c = new FormData();
            c.append("file", p);
            const $ = await fetch("/api/files", { method: "POST", body: c });
            if (!$.ok) throw new Error(await $.text());
            const K = await $.json();
            d.value.push({ name: K.name || p.name, url: K.url, mime: K.mime || p.type || "application/octet-stream", size: K.size ?? p.size });
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
      p.value = "", await N(c);
    }
    function L(i) {
      const p = Array.from(i.clipboardData?.files || []);
      p.length && (i.preventDefault(), N(p));
    }
    const X = O(""), z = O("all"), Y = O("general"), ae = O(!1), C = O(""), U = O(""), M = O(50);
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
    const v = O([]), T = O(!1), R = O(!1), P = O(!1), se = O(""), j = O({ path: "", parent: "", roots: [], directories: [] }), ge = O(null), Be = O("");
    let vt = null, it = 0, _n = "", Qt = !1;
    const It = O(!0);
    function Q(i = s.value) {
      try {
        localStorage.setItem(`0kay.agent.editor:${i}`, JSON.stringify({ draft: a.value, mode: Y.value, ...wt() }));
      } catch {
      }
    }
    function ut() {
      it++, R.value = !1, P.value = !1;
    }
    function wn(i) {
      i.key === "Escape" && R.value && ut();
    }
    const xn = O([]);
    let Ot = !1;
    async function Wn() {
      if (!Ot) {
        Ot = !0;
        try {
          const p = await (await fetch("/api/skills")).json(), c = p?.result?.skills ?? p?.skills;
          Array.isArray(c) ? xn.value = c : Ot = !1;
        } catch {
          Ot = !1;
        }
      }
    }
    const Vn = [{ name: "compact", description: e("压缩当前会话上下文", "Compact the session context") }], Jt = q(() => {
      const i = /^\/([^\s]*)$/.exec(a.value);
      return i ? i[1].toLowerCase() : null;
    }), kt = q(() => {
      const i = Jt.value;
      if (i === null) return [];
      const p = [
        ...Vn,
        ...xn.value.map(($) => ({ name: $.name, description: $.description || "" }))
      ], c = /* @__PURE__ */ new Set();
      return p.filter(($) => c.has($.name) || !$.name.toLowerCase().startsWith(i) ? !1 : (c.add($.name), !0)).slice(0, 8);
    }), bt = O(!1), ee = q(() => !bt.value && kt.value.length > 0), Re = O(0);
    be(kt, () => {
      Re.value = 0;
    }), be(Jt, (i) => {
      bt.value = !1, i !== null && Wn();
    });
    const oe = O(null), Pt = O({});
    function Ce() {
      const i = oe.value?.getBoundingClientRect();
      i && (Pt.value = {
        left: `${i.left}px`,
        width: `${i.width}px`,
        bottom: `${Math.max(8, window.innerHeight - i.top + 8)}px`
      });
    }
    const Ye = () => {
      ee.value && Ce();
    };
    be(ee, (i) => {
      i && tt(Ce);
    }), Gt(() => {
      window.addEventListener("resize", Ye), window.addEventListener("scroll", Ye, !0);
    }), vn(() => {
      window.removeEventListener("resize", Ye), window.removeEventListener("scroll", Ye, !0);
    });
    function en(i) {
      a.value = "/" + i.name + " ", bt.value = !0, tt(() => document.querySelector(".composer-input textarea")?.focus());
    }
    function Ze(i) {
      if (ee.value) {
        const p = kt.value.length;
        if (i.key === "ArrowDown") {
          i.preventDefault(), Re.value = (Math.min(Re.value, p - 1) + 1) % p;
          return;
        }
        if (i.key === "ArrowUp") {
          i.preventDefault(), Re.value = (Math.min(Re.value, p - 1) - 1 + p) % p;
          return;
        }
        if (i.key === "Enter" || i.key === "Tab") {
          i.preventDefault(), en(kt.value[Math.min(Re.value, p - 1)]);
          return;
        }
        if (i.key === "Escape") {
          i.preventDefault(), bt.value = !0;
          return;
        }
      }
      i.key === "Enter" && !i.shiftKey && !i.isComposing && i.keyCode !== 229 && (i.preventDefault(), Rn());
    }
    function Sn() {
      const i = je.value;
      i && (It.value = i.scrollHeight - i.scrollTop - i.clientHeight < 100);
    }
    async function Ke(i = "") {
      if (!W.value) {
        xe.value = "请先选择在线执行器";
        return;
      }
      const p = ++it;
      _n = W.value.plugin_id, R.value = !0, P.value = !0, se.value = "";
      try {
        const c = await fetch(`/api/agent/workspace?${new URLSearchParams({ executor_id: W.value.plugin_id, path: i })}`);
        if (!c.ok) throw new Error(await c.text());
        const $ = await c.json();
        p === it && (j.value = $);
      } catch (c) {
        p === it && (se.value = c.message);
      } finally {
        p === it && (P.value = !1);
      }
    }
    function Tn() {
      !W.value || W.value.plugin_id !== _n || P.value || se.value || (C.value = W.value.plugin_id, U.value = j.value.path, R.value = !1);
    }
    async function Dt() {
      if (!T.value || !W.value || Qt || document.hidden) return;
      Qt = !0;
      const i = W.value.plugin_id;
      try {
        const p = await fetch(`/api/agent/host?executor_id=${encodeURIComponent(i)}`);
        if (!p.ok) throw new Error();
        const c = await p.json();
        W.value?.plugin_id === i && (ge.value = c);
      } catch {
        W.value?.plugin_id === i && (ge.value = null);
      } finally {
        Qt = !1;
      }
    }
    async function He() {
      if (!de.value || fe.value || te.value || de.value.state === "archived") return;
      const i = s.value;
      te.value = !0, xe.value = "", Be.value = "正在压缩上下文…";
      try {
        const p = await fetch("/api/agent/compact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: i, model_id: J.value }) });
        if (!p.ok) throw new Error(await p.text());
        await p.json(), await l.fetchAgents(), Be.value = "上下文已压缩。后续消息使用摘要；原始对话和工具记录仍然保留。", a.value.trim() === "/compact" && (a.value = "");
      } catch (p) {
        xe.value = p.message, Be.value = "";
      } finally {
        te.value = !1;
      }
    }
    const nt = (i) => ({ background: `conic-gradient(var(--md-primary) ${Math.max(0, Math.min(100, i))}%, var(--md-outline-variant) 0)` }), W = q(() => C.value ? l.agents.find((i) => i.plugin_id === C.value) : l.agents.find((i) => l.isHealthy(i))), Nt = (i) => i === void 0 ? "—" : `${(i / 1024 ** 3).toFixed(1)} GiB`;
    function yt() {
      try {
        const i = JSON.parse(localStorage.getItem(`0kay.agent.editor:${s.value}`) || localStorage.getItem(`0kay.agent.options:${s.value}`) || "{}");
        C.value = i.executor_id || "", U.value = i.workdir || "", M.value = ce(i.thinking_intensity), J.value = i.model_id || "MOCR", B.value = i.permission_mode === "full_access" ? "full_access" : "normal", a.value = i.draft || "", Y.value = i.mode || "general";
      } catch {
        C.value = "", U.value = "", M.value = 50, J.value = "MOCR", a.value = "", Y.value = "general";
      }
    }
    const _t = O({});
    function tn(i) {
      return `${i.provider_name || (i.provider_id ? _t.value[i.provider_id] : "") || i.provider_id || i.provider}/${i.id}`;
    }
    async function st() {
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
      const i = M.value === 0 ? "off" : M.value < 35 ? "low" : M.value < 62.5 ? "medium" : M.value < 87.5 ? "high" : "max";
      return { executor_id: C.value, workdir: U.value.trim(), thinking_intensity: i, model_id: J.value, permission_mode: B.value, language: at.value };
    }
    const te = O(!1), xe = O(""), Xe = O(!1), ct = O(!1), Ne = O([]), me = q(() => Ne.value[Ne.value.length - 1] || null), je = O(null), de = q(() => l.sessions.find((i) => i.session_id === s.value)), dt = (i) => i.caller_id !== "webui", nn = q(() => l.sessions.filter((i) => (ct.value ? i.state === "archived" : i.state !== "archived") && (z.value === "all" || (z.value === "life" ? dt(i) : !dt(i))) && (i.prompt || "").toLowerCase().includes(X.value.toLowerCase()))), sn = q(() => l.tasks.filter((i) => i.kind === "agent" && i.session_id === s.value).sort((i, p) => (i.started_at || "").localeCompare(p.started_at || "") || i.task_id.localeCompare(p.task_id))), fe = q(() => l.tasks.find((i) => i.session_id === s.value && ["agent", "compact"].includes(i.kind || "") && ["running", "pending"].includes(i.state))), xt = q(() => {
      const i = l.tasks.filter((K) => K.session_id === s.value && K.kind === "tool" && (K.prompt || "").trim() === "todowrite").sort((K, ht) => (K.started_at || "").localeCompare(ht.started_at || "") || K.task_id.localeCompare(ht.task_id)), p = i[i.length - 1];
      if (!p) return [];
      const c = (K) => {
        try {
          const ht = JSON.parse(K || "");
          return Array.isArray(ht?.todos) ? ht.todos : [];
        } catch {
          return [];
        }
      };
      return (c(p.result).length ? c(p.result) : c(p.args)).filter((K) => K && typeof K.content == "string" && K.status !== "cancelled");
    }), Mt = q(() => xt.value.filter((i) => i.status === "completed").length), We = O(null);
    async function Te() {
      if (!s.value) {
        We.value = null;
        return;
      }
      try {
        const i = await fetch(`/api/agent/context?session_id=${encodeURIComponent(s.value)}&model_id=${encodeURIComponent(J.value)}`);
        i.ok && (We.value = await i.json());
      } catch {
      }
    }
    let Qe = null;
    function ln() {
      Qe && clearTimeout(Qe), Qe = setTimeout(() => void Te(), 800);
    }
    const St = (i) => `${Math.round((i || 0) / 1e3 * 10) / 10}K`, qn = q(() => {
      const i = We.value?.breakdown || {}, p = (c) => St(Number(c) || 0);
      return [
        { key: "system", label: e("系统提示", "System Prompt"), value: p(i.system) },
        { key: "tools", label: e("工具", "Tools"), value: p(i.tools) },
        { key: "conversation", label: e("对话", "Conversation"), value: p(i.conversation) },
        { key: "mcp", label: "MCP", value: p(i.mcp) },
        { key: "skills", label: e("技能", "Skills"), value: p(i.skills) }
      ];
    }), Tt = q(() => {
      const i = l.tasks.filter((p) => p.kind === "compact" && p.session_id === s.value && p.state === "done" && (p.result || "").trim());
      return i.length ? i.reduce((p, c) => (c.started_at || "") >= (p.started_at || "") ? c : p) : null;
    }), Ve = (i) => (at.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[i] || i, lt = (i) => i ? new Date(i).toLocaleString() : "";
    function At(i) {
      return l.tasks.filter((p) => p.task_id !== i.task_id && p.session_id === i.session_id && p.parent_id === i.task_id).sort((p, c) => (p.started_at || "").localeCompare(c.started_at || "") || p.task_id.localeCompare(c.task_id));
    }
    function zt(i) {
      return i ? l.tasks.filter((p) => p.task_id !== i.task_id && p.session_id === i.session_id && p.parent_id === i.task_id).sort((p, c) => (p.started_at || "").localeCompare(c.started_at || "") || p.task_id.localeCompare(c.task_id)) : [];
    }
    function pt(i) {
      const p = [];
      for (const c of At(i))
        p.push(c), c.kind === "subagent" && p.push(...pt({ ...c, session_id: i.session_id }));
      return p;
    }
    function An(i) {
      Ne.value = [...Ne.value, i];
    }
    function Gn() {
      Ne.value = Ne.value.slice(0, -1);
    }
    function pe() {
      Ne.value = [];
    }
    function Je(i) {
      if (!i?.result) return "";
      let p = i.result;
      try {
        const c = JSON.parse(p);
        typeof c == "string" ? p = c : c && typeof c.result == "string" && (p = c.result);
      } catch {
      }
      return !p.trim() || zt(i).some((c) => c.kind === "think" && (c.result || "").trim() === p.trim()) ? "" : p;
    }
    function rt(i) {
      return i ? /User denied permission for task/i.test(i) ? e("你拒绝了这次子 Agent 调用", "You denied this sub-agent call") : /User denied permission for (\S+)/i.test(i) ? e(`你拒绝了 ${RegExp.$1} 权限`, `You denied permission for ${RegExp.$1}`) : /Permission request expired/i.test(i) ? e("权限请求已超时", "Permission request expired") : i : "";
    }
    function rn(i) {
      return i.kind === "subagent" ? e("子 Agent", "Subagent") : i.kind === "tool" ? e("工具", "Tool") : i.kind === "think" ? e("模型", "Model") : i.kind || e("步骤", "Step");
    }
    function Ut(i) {
      return zt(i).length;
    }
    function En(i) {
      return pt(i).some((p) => p.kind === "think" && p.result?.trim() === i.result?.trim());
    }
    async function an(i) {
      if (!de.value || te.value || i === "delete" && !await t({
        title: e("删除会话", "Delete session"),
        message: e("永久删除此会话及其中的消息和工具记录？", "Permanently delete this session and its messages and tool records?"),
        confirmLabel: e("永久删除", "Delete"),
        danger: !0
      }))
        return;
      const p = s.value;
      te.value = !0;
      try {
        Q(p), await l.manageSession(p, i), i === "delete" && (localStorage.removeItem(`0kay.agent.editor:${p}`), localStorage.removeItem(`0kay.agent.options:${p}`)), i !== "restore" ? (s.value = "", localStorage.removeItem("0kay.agent.selected")) : ct.value = !1;
      } catch (c) {
        xe.value = c.message;
      } finally {
        te.value = !1;
      }
    }
    function $n(i) {
      te.value || (Q(), s.value = i, Xe.value = !1, localStorage.setItem("0kay.agent.selected", i));
    }
    async function Yn() {
      te.value = !0, xe.value = "";
      try {
        const i = await l.createSession("新对话");
        Q(), s.value = i, localStorage.setItem("0kay.agent.selected", i), Xe.value = !1, ct.value = !1;
      } catch (i) {
        xe.value = i.message;
      } finally {
        te.value = !1;
      }
    }
    async function Rn() {
      if (a.value.trim() === "/compact") {
        await He();
        return;
      }
      const i = d.value.length > 0;
      if (!(!a.value.trim() && !i || te.value || fe.value || de.value?.state === "archived")) {
        te.value = !0, xe.value = "";
        try {
          const p = wt(), c = a.value.trim() || e("请查看我上传的附件。", "Please review the attached files."), $ = Y.value;
          if (!de.value) {
            const K = await l.createSession(c.slice(0, 60));
            localStorage.setItem(`0kay.agent.editor:${K}`, JSON.stringify({ ...p, draft: c, mode: $ })), s.value = K, localStorage.setItem("0kay.agent.selected", K);
          }
          Q(), i && (p.attachments = d.value.map((K) => ({ ...K }))), await l.sendTask(s.value, c, $, p), a.value = "", d.value = [], b.value = "", Q(), It.value = !0, await Me();
        } catch (p) {
          xe.value = p.message;
        } finally {
          te.value = !1;
        }
      }
    }
    async function Zn() {
      if (!(!fe.value || fe.value.kind !== "agent"))
        try {
          await l.cancelTask(fe.value.task_id);
        } catch (i) {
          xe.value = i.message;
        }
    }
    async function Me() {
      await tt(), It.value && je.value?.scrollTo({ top: je.value.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return be(() => l.tasks.filter((i) => i.session_id === s.value).map((i) => `${i.task_id}:${i.state}:${i.result?.length}`).join("|"), Me), be(() => l.tasks.filter((i) => i.session_id === s.value).map((i) => `${i.task_id}:${i.state}:${i.result?.length}`).join("|"), ln), be(s, () => {
      Te();
    }), be(J, () => {
      Te();
    }), Gt(() => {
      Te();
    }), be(s, () => {
      It.value = !0, Me(), ut(), pe(), xe.value = "";
    }), be(s, yt), be(C, () => {
      ge.value = null, U.value = "", ut(), Dt();
    }, { flush: "sync" }), be(T, Dt), be(s, () => {
      Be.value = "";
    }), Gt(() => {
      ma(), l.connect(), yt(), st(), vt = setInterval(Dt, 5e3), window.addEventListener("keydown", wn);
    }), vn(() => {
      Q(), ut(), l.disconnect(), vt && clearInterval(vt), window.removeEventListener("keydown", wn);
    }), (i, p) => (m(), k(ne, null, [
      o("main", mo, [
        o("aside", vo, [
          o("header", null, [
            p[20] || (p[20] = o("h1", null, "Agent", -1)),
            o("button", {
              onClick: Yn,
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
              Ee(" " + g(e("新对话", "New chat")), 1)
            ], 8, ko)
          ]),
          o("div", bo, [
            o("i", {
              class: ie({ online: ue(l).onlineCount > 0 })
            }, null, 2),
            Ee(g(ue(l).onlineCount) + " " + g(e("个执行器在线", "executors online")) + " ", 1),
            o("button", {
              onClick: p[0] || (p[0] = (c) => ue(l).fetchAgents()),
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
          fn(o("input", {
            "onUpdate:modelValue": p[1] || (p[1] = (c) => X.value = c),
            placeholder: e("搜索会话…", "Search sessions…"),
            "aria-label": e("搜索会话", "Search sessions")
          }, null, 8, _o), [
            [zn, X.value]
          ]),
          o("nav", wo, [
            (m(!0), k(ne, null, ve([{ id: "all", label: e("全部", "All") }, { id: "life", label: e("LIFE 发起", "From LIFE") }, { id: "user", label: e("我的对话", "My chats") }], (c) => (m(), k("button", {
              key: c.id,
              class: ie({ chosen: z.value === c.id }),
              onClick: ($) => z.value = c.id
            }, g(c.label), 11, xo))), 128))
          ]),
          o("label", So, [
            fn(o("input", {
              "onUpdate:modelValue": p[2] || (p[2] = (c) => ct.value = c),
              type: "checkbox"
            }, null, 512), [
              [El, ct.value]
            ]),
            Ee(" " + g(e("显示已归档会话", "Show archived sessions")), 1)
          ]),
          o("div", To, [
            (m(!0), k(ne, null, ve(nn.value, (c) => (m(), k("button", {
              key: c.task_id,
              class: ie(["session-card", { selected: s.value === c.session_id && !Xe.value }]),
              disabled: te.value,
              onClick: ($) => $n(c.session_id)
            }, [
              o("span", Eo, g(dt(c) ? "LIFE → Agent" : e("你 ↔ Agent", "You ↔ Agent")), 1),
              o("strong", null, g(c.prompt || "未命名会话"), 1),
              o("small", null, g(lt(c.started_at)), 1)
            ], 10, Ao))), 128)),
            nn.value.length ? I("", !0) : (m(), k("p", $o, g(e("暂无会话。直接发送消息，或等待 LIFE 委派工作。", "No sessions yet. Send a message or wait for LIFE to delegate work.")), 1))
          ]),
          o("button", {
            class: ie(["ledger-button", { chosen: Xe.value }]),
            onClick: p[3] || (p[3] = (c) => Xe.value = !0)
          }, g(e("全部任务记录", "All task records")) + " · " + g(ue(l).tasks.length), 3)
        ]),
        Xe.value ? (m(), k("section", Ro, [
          o("header", null, [
            o("h2", null, g(e("全部任务记录", "All task records")), 1),
            o("button", {
              onClick: p[4] || (p[4] = (c) => Xe.value = !1)
            }, g(e("返回会话", "Back to chat")), 1)
          ]),
          o("p", Co, g(e("包括 LIFE 对话、模型调用、Agent 执行及工具活动。", "LIFE conversations, model calls, Agent execution and tool activity.")), 1),
          (m(!0), k(ne, null, ve(ue(l).tasks, (c) => (m(), k("article", {
            key: c.task_id,
            class: "ledger-entry"
          }, [
            o("div", null, [
              o("span", null, g(c.kind || "agent"), 1),
              o("span", {
                class: ie(c.state)
              }, g(Ve(c.state)), 3),
              o("small", null, g(lt(c.started_at)), 1)
            ]),
            o("p", null, g(c.prompt), 1),
            ue(l).sessions.some(($) => $.session_id === c.session_id) ? (m(), k("button", {
              key: 0,
              onClick: ($) => $n(c.session_id)
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
              o("h2", null, g(de.value?.prompt || "与 Agent 对话"), 1),
              o("p", null, g(de.value && dt(de.value) ? "LIFE 发起的工作会话 · 你可以查看过程，也可以直接继续对话" : "持续对话 · 编程、调研与工具执行"), 1)
            ]),
            fe.value ? (m(), k("span", Po, "正在执行")) : I("", !0),
            de.value ? (m(), k("div", Do, [
              o("button", {
                disabled: !!fe.value,
                onClick: p[5] || (p[5] = (c) => an(de.value.state === "archived" ? "restore" : "archive"))
              }, g(de.value.state === "archived" ? "恢复" : "归档"), 9, No),
              o("button", {
                disabled: !!fe.value,
                onClick: p[6] || (p[6] = (c) => an("delete"))
              }, "删除", 8, Mo)
            ])) : I("", !0)
          ]),
          xe.value || ue(l).error ? (m(), k("div", zo, g(xe.value || ue(l).error), 1)) : I("", !0),
          T.value ? (m(), k("section", Uo, [
            W.value ? (m(), k(ne, { key: 0 }, [
              o("strong", null, g(W.value.host?.hostname || W.value.name), 1),
              o("span", {
                class: ie(ue(l).isHealthy(W.value) ? "done" : "failed")
              }, g(ue(l).isHealthy(W.value) ? "在线" : "离线"), 3),
              o("div", Fo, [
                (m(!0), k(ne, null, ve([{ label: "CPU 占用", value: ge.value?.cpu_percent }, { label: "内存占用", value: ge.value?.memory_percent }], (c) => (m(), k("div", {
                  key: c.label,
                  class: "usage-metric"
                }, [
                  o("div", {
                    class: "usage-ring",
                    style: Yt(nt(c.value || 0))
                  }, [
                    o("b", null, g(c.value === void 0 ? "—" : `${c.value.toFixed(1)}%`), 1)
                  ], 4),
                  o("span", null, g(c.label), 1)
                ]))), 128)),
                o("small", null, g(ge.value ? `采样时间：${lt(ge.value.sampled_at)}` : "等待宿主机实时采样"), 1)
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
                  o("dd", null, g(Nt(W.value.host?.memory_available_bytes)) + " / " + g(Nt(W.value.host?.memory_total_bytes)), 1)
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
            ref: je,
            class: "transcript",
            onScrollPassive: Sn
          }, [
            me.value ? (m(), k("div", Ho, [
              o("header", jo, [
                o("button", {
                  type: "button",
                  onClick: Gn
                }, "← " + g(Ne.value.length > 1 ? e("返回上一层", "Back one level") : e("返回会话", "Back to chat")), 1),
                o("div", null, [
                  o("h3", null, g(e("子 Agent", "Subagent")), 1),
                  o("p", Wo, g(me.value.prompt), 1)
                ]),
                o("span", {
                  class: ie(me.value.state)
                }, g(Ve(me.value.state)), 3)
              ]),
              o("div", Vo, [
                o("div", qo, [
                  o("div", Go, [
                    o("b", null, g(e("父 Agent", "Parent agent")), 1),
                    o("time", null, g(lt(me.value.started_at)), 1)
                  ]),
                  o("div", Yo, g(me.value.prompt), 1)
                ]),
                (m(!0), k(ne, null, ve(zt(me.value), (c) => (m(), k(ne, {
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
                      Fe(hn, {
                        content: c.result
                      }, null, 8, ["content"]),
                      c.state === "running" ? (m(), k("span", Qo, " ▍")) : I("", !0)
                    ], 64)) : c.state === "running" ? (m(), k("small", Jo, g(e("子 Agent 正在生成回复…", "Subagent is drafting a reply…")), 1)) : I("", !0),
                    c.error ? (m(), k("p", ei, g(rt(c.error)), 1)) : I("", !0)
                  ])) : c.kind === "subagent" ? (m(), k("div", ti, [
                    o("button", {
                      type: "button",
                      class: "subagent-card-head",
                      onClick: ($) => An(c)
                    }, [
                      o("span", {
                        class: ie(c.state)
                      }, "●", 2),
                      o("strong", null, g(e("子 Agent", "Subagent")), 1),
                      o("span", si, g(c.prompt), 1),
                      o("small", null, g(Ve(c.state)), 1),
                      p[30] || (p[30] = o("span", {
                        class: "subagent-chevron",
                        "aria-hidden": "true"
                      }, "▸", -1))
                    ], 8, ni)
                  ])) : c.kind === "tool" ? (m(), Rt(Qs, {
                    key: 2,
                    step: c,
                    "format-error": rt
                  }, null, 8, ["step"])) : c.kind !== "think" ? (m(), k("details", li, [
                    o("summary", null, [
                      o("span", {
                        class: ie(c.state)
                      }, "●", 2),
                      Ee(" " + g(rn(c)) + " · " + g(c.prompt) + " ", 1),
                      o("small", null, g(Ve(c.state)), 1)
                    ]),
                    o("pre", null, g(c.result || c.error || (c.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                  ])) : I("", !0)
                ], 64))), 128)),
                Je(me.value) ? (m(), k("div", ri, [
                  Fe(hn, {
                    content: Je(me.value)
                  }, null, 8, ["content"])
                ])) : I("", !0),
                me.value.error ? (m(), k("p", ai, g(rt(me.value.error)), 1)) : I("", !0),
                !zt(me.value).length && !Je(me.value) && !me.value.error ? (m(), k("p", oi, g(me.value.state === "running" ? e("子 Agent 正在执行…", "Subagent is running…") : e("没有子步骤记录", "No child steps recorded")), 1)) : I("", !0)
              ])
            ])) : (m(), k(ne, { key: 1 }, [
              !sn.value.length && !Tt.value ? (m(), k("div", ii, [...p[31] || (p[31] = [
                o("h2", null, "想让 Agent 帮你做什么？", -1),
                o("p", null, "直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。", -1),
                o("p", null, "左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。", -1)
              ])])) : I("", !0),
              Tt.value ? (m(), k("article", ui, [
                o("div", ci, [
                  o("strong", null, g(e("上下文摘要", "Context summary")), 1),
                  o("time", null, g(lt(Tt.value.started_at)), 1)
                ]),
                Fe(hn, {
                  content: Tt.value.result || ""
                }, null, 8, ["content"])
              ])) : I("", !0),
              (m(!0), k(ne, null, ve(sn.value, (c) => (m(), k("article", {
                key: c.task_id,
                class: "turn"
              }, [
                o("div", di, [
                  o("div", pi, [
                    o("b", null, g(dt(c) ? "LIFE" : "你"), 1),
                    o("time", null, g(lt(c.started_at)), 1)
                  ]),
                  o("div", hi, g(c.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, "")), 1)
                ]),
                o("div", fi, [
                  o("div", gi, [
                    p[32] || (p[32] = o("b", null, "Agent", -1)),
                    o("span", {
                      class: ie(c.state)
                    }, g(Ve(c.state)), 3)
                  ]),
                  At(c).length ? (m(), k("div", mi, [
                    (m(!0), k(ne, null, ve(At(c), ($) => (m(), k(ne, {
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
                          Fe(hn, {
                            content: $.result
                          }, null, 8, ["content"]),
                          $.state === "running" ? (m(), k("span", yi, " ▍")) : I("", !0)
                        ], 64)) : $.state === "running" ? (m(), k("small", _i, "Agent 正在生成回复…")) : I("", !0),
                        $.error ? (m(), k("p", wi, g(rt($.error)), 1)) : I("", !0)
                      ])) : $.kind === "subagent" ? (m(), k("div", xi, [
                        o("button", {
                          type: "button",
                          class: "subagent-card-head",
                          onClick: (K) => An($)
                        }, [
                          o("span", {
                            class: ie($.state)
                          }, "●", 2),
                          o("strong", null, g(e("子 Agent", "Subagent")), 1),
                          o("span", Ti, g($.prompt), 1),
                          o("small", null, [
                            Ee(g(Ve($.state)), 1),
                            Ut($) ? (m(), k(ne, { key: 0 }, [
                              Ee(" · " + g(Ut($)) + " " + g(e("步", "steps")), 1)
                            ], 64)) : I("", !0)
                          ]),
                          p[33] || (p[33] = o("span", {
                            class: "subagent-chevron",
                            "aria-hidden": "true"
                          }, "▸", -1))
                        ], 8, Si),
                        $.error ? (m(), k("p", Ai, g(rt($.error)), 1)) : I("", !0)
                      ])) : $.kind === "tool" ? (m(), Rt(Qs, {
                        key: 2,
                        step: $,
                        "format-error": rt
                      }, null, 8, ["step"])) : $.kind !== "think" ? (m(), k("details", Ei, [
                        o("summary", null, [
                          o("span", {
                            class: ie($.state)
                          }, "●", 2),
                          Ee(" " + g(rn($)) + " · " + g($.prompt) + " ", 1),
                          o("small", null, g(Ve($.state)), 1)
                        ]),
                        o("pre", null, g($.result || $.error || ($.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                      ])) : I("", !0)
                    ], 64))), 128))
                  ])) : I("", !0),
                  c.result && !En(c) ? (m(), Rt(hn, {
                    key: 1,
                    content: c.result
                  }, null, 8, ["content"])) : I("", !0),
                  c.error ? (m(), k("div", $i, g(rt(c.error)), 1)) : I("", !0),
                  ["running", "pending"].includes(c.state) ? (m(), k("p", Ri, "Agent 正在处理，执行过程会自动更新…")) : I("", !0)
                ])
              ]))), 128))
            ], 64))
          ], 544),
          me.value ? I("", !0) : (m(), k("form", {
            key: 2,
            class: "composer",
            onSubmit: De(Rn, ["prevent"])
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
            Be.value ? (m(), k("div", Oi, g(Be.value), 1)) : I("", !0),
            o("div", {
              class: ie(["options-collapse", { open: ae.value }])
            }, [
              o("div", Pi, [
                o("label", null, [
                  Ee(g(e("权限", "Permissions")), 1),
                  Fe(Nn, {
                    modelValue: B.value,
                    "onUpdate:modelValue": p[7] || (p[7] = (c) => B.value = c),
                    "aria-label": e("权限", "Permissions"),
                    disabled: !!fe.value || te.value,
                    options: [{ value: "normal", label: e("Normal · 全部审批", "Normal · Ask every time") }, { value: "full_access", label: e("Full access · 自动执行", "Full access · Auto execute") }]
                  }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
                ]),
                o("label", null, [
                  Ee(g(e("执行器", "Executor")), 1),
                  Fe(Nn, {
                    modelValue: C.value,
                    "onUpdate:modelValue": p[8] || (p[8] = (c) => C.value = c),
                    "aria-label": e("执行器", "Executor"),
                    disabled: !!fe.value || te.value,
                    options: [{ value: "", label: e("自动选择在线执行器", "Automatic executor") }, ...ue(l).agents.map((c) => ({ value: c.plugin_id, label: `${c.host?.hostname || c.name} · ${c.plugin_id}`, disabled: !ue(l).isHealthy(c) }))]
                  }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
                ]),
                o("label", null, [
                  Ee(g(e("工作区", "Workspace")), 1),
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
                    Ee(" " + g(U.value || e("选择目录…", "Select folder…")), 1)
                  ], 8, Di)
                ]),
                Fe(fo, {
                  modelValue: M.value,
                  "onUpdate:modelValue": p[10] || (p[10] = (c) => M.value = c),
                  disabled: !!fe.value || te.value
                }, null, 8, ["modelValue", "disabled"]),
                o("label", null, [
                  Ee(g(e("模型", "Model")), 1),
                  Fe(Nn, {
                    modelValue: J.value,
                    "onUpdate:modelValue": p[11] || (p[11] = (c) => J.value = c),
                    searchable: "",
                    "aria-label": e("模型", "Model"),
                    disabled: !!fe.value || te.value,
                    onOpen: st,
                    options: [{ value: "MOCR", label: e("MOCR · 自动选型", "MOCR · Automatic") }, ...v.value.map((c) => ({ value: c.id, label: tn(c) }))]
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
              (m(), Rt(jn, { to: "body" }, [
                ee.value ? (m(), k("div", {
                  key: 0,
                  class: "slash-menu",
                  style: Yt(Pt.value),
                  role: "listbox",
                  "aria-label": e("技能与命令", "Skills and commands")
                }, [
                  (m(!0), k(ne, null, ve(kt.value, (c, $) => (m(), k("button", {
                    key: c.name,
                    type: "button",
                    class: ie(["slash-item", { active: $ === Re.value }]),
                    role: "option",
                    "aria-selected": $ === Re.value,
                    onMousedown: De((K) => en(c), ["prevent"]),
                    onMouseenter: (K) => Re.value = $
                  }, [
                    o("span", zi, "/" + g(c.name), 1),
                    o("span", Ui, g(c.description), 1)
                  ], 42, Mi))), 128))
                ], 12, Ni)) : I("", !0)
              ])),
              d.value.length || b.value ? (m(), k("div", Fi, [
                (m(!0), k(ne, null, ve(d.value, (c, $) => (m(), k("span", {
                  key: $,
                  class: "attach-chip",
                  title: `${c.mime} · ${c.size} B`
                }, [
                  Ee(g(c.name) + " ", 1),
                  o("button", {
                    type: "button",
                    "aria-label": e("移除附件", "Remove attachment"),
                    title: e("移除", "Remove"),
                    onClick: (K) => E($)
                  }, "×", 8, Hi)
                ], 8, Bi))), 128)),
                b.value ? (m(), k("span", ji, g(b.value), 1)) : I("", !0)
              ])) : I("", !0),
              fn(o("textarea", {
                "onUpdate:modelValue": p[12] || (p[12] = (c) => a.value = c),
                disabled: te.value || de.value?.state === "archived",
                placeholder: de.value?.state === "archived" ? "恢复会话后可以继续对话" : "给 Agent 发消息…（Enter 发送，Shift+Enter 换行，可 Ctrl+V 粘贴图片/文件）",
                "aria-label": "给 Agent 发消息",
                onKeydown: Ze,
                onPaste: L
              }, null, 40, Wi), [
                [zn, a.value]
              ]),
              o("div", Vi, [
                o("button", {
                  type: "button",
                  class: "attach-fly",
                  disabled: !!fe.value || te.value || u.value || de.value?.state === "archived",
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
                  disabled: te.value || !!fe.value || !a.value.trim() || de.value?.state === "archived",
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
                  onClick: Zn,
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
              We.value ? (m(), k("div", {
                key: 0,
                class: "ctx-usage",
                tabindex: "0",
                "aria-label": e("上下文用量", "Context usage")
              }, [
                p[38] || (p[38] = o("svg", {
                  class: "ctx-ring",
                  viewBox: "0 0 20 20",
                  "aria-hidden": "true"
                }, [
                  o("circle", {
                    class: "ctx-track",
                    cx: "10",
                    cy: "10",
                    r: "8"
                  })
                ], -1)),
                o("span", Ki, g(St(We.value.tokens)), 1),
                o("div", Xi, [
                  o("strong", null, g(e("上下文用量", "Context Usage")), 1),
                  o("div", Qi, [
                    o("b", null, g(St(We.value.tokens)), 1),
                    o("span", null, g(e("已用", "Used")), 1)
                  ]),
                  (m(!0), k(ne, null, ve(qn.value, (c) => (m(), k("div", {
                    class: "ctx-row",
                    key: c.key
                  }, [
                    o("span", null, g(c.label), 1),
                    o("span", null, g(c.value), 1)
                  ]))), 128))
                ])
              ], 8, Zi)) : I("", !0),
              o("button", {
                type: "button",
                class: ie(["options-toggle", { open: ae.value }]),
                "aria-expanded": ae.value,
                onClick: p[13] || (p[13] = (c) => ae.value = !ae.value)
              }, g(ae.value ? e("收起", "Less") : e("设置", "Settings")), 11, Ji),
              Fe(Nn, {
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
                disabled: !de.value || !!fe.value || te.value || de.value.state === "archived",
                onClick: He
              }, "/compact", 8, eu),
              o("span", tu, g(fe.value?.kind === "compact" ? e("上下文压缩中…", "Compacting…") : ue(l).onlineCount ? e("在当前会话中继续", "Continue this session") : e("执行器离线", "Executor offline")), 1)
            ])
          ], 32))
        ])),
        R.value ? (m(), k("div", {
          key: 2,
          class: "directory-backdrop",
          onClick: De(ut, ["self"])
        }, [
          o("section", nu, [
            o("header", null, [
              o("h2", null, "选择 " + g(W.value?.host?.hostname || "执行器") + " 的工作区", 1),
              o("button", { onClick: ut }, "关闭")
            ]),
            o("div", su, [
              (m(!0), k(ne, null, ve(j.value.roots, (c) => (m(), k("button", {
                key: c,
                disabled: P.value,
                onClick: ($) => Ke(c)
              }, g(c), 9, lu))), 128)),
              o("button", {
                disabled: P.value,
                onClick: p[16] || (p[16] = (c) => Ke(W.value?.host?.workdir || ""))
              }, "默认目录", 8, ru)
            ]),
            o("code", null, g(j.value.path), 1),
            o("form", {
              class: "new-folder",
              onSubmit: De(f, ["prevent"])
            }, [
              fn(o("input", {
                "onUpdate:modelValue": p[17] || (p[17] = (c) => y.value = c),
                placeholder: "新文件夹名称",
                "aria-label": "新文件夹名称",
                disabled: P.value
              }, null, 8, au), [
                [zn, y.value]
              ]),
              o("button", {
                disabled: P.value || !y.value.trim() || !j.value.path
              }, "新建文件夹", 8, ou)
            ], 32),
            se.value ? (m(), k("p", iu, g(se.value), 1)) : I("", !0),
            P.value ? (m(), k("p", uu, "正在读取目录…")) : (m(), k("div", cu, [
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
                Ee(" " + g(c.name), 1)
              ], 8, du))), 128)),
              j.value.directories.length ? I("", !0) : (m(), k("p", pu, "没有子目录"))
            ])),
            o("footer", null, [
              o("button", {
                disabled: P.value || !!se.value || !j.value.path,
                onClick: Tn
              }, "选择当前目录", 8, hu)
            ])
          ])
        ])) : I("", !0)
      ]),
      Fe(go)
    ], 64));
  }
}), vu = /* @__PURE__ */ ks(fu, [["__scopeId", "data-v-07c85480"]]);
export {
  vu as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('agent-plugin-style')){const s=document.createElement('style');s.id='agent-plugin-style';s.textContent=".markdown-content[data-v-ef377647]{line-height:1.75;overflow-wrap:anywhere;font-size:14px}.markdown-content[data-v-ef377647] pre{padding:16px;background:var(--md-surface-container);border-radius:8px;overflow:auto;white-space:pre;line-height:1.5}.markdown-content[data-v-ef377647] code{font-family:monospace;background:var(--md-surface-container);padding:2px 4px;border-radius:4px}.markdown-content[data-v-ef377647] pre code{padding:0;background:none}.markdown-content[data-v-ef377647] table{display:block;overflow:auto;border-collapse:collapse;margin:12px 0}.markdown-content[data-v-ef377647] th,.markdown-content[data-v-ef377647] td{border:1px solid var(--md-outline-variant);padding:8px 12px}.markdown-content[data-v-ef377647] blockquote{border-left:3px solid var(--md-outline);margin:12px 0;padding-left:14px;color:var(--md-on-surface-variant)}.markdown-content[data-v-ef377647] ul,.markdown-content[data-v-ef377647] ol{padding-left:24px}.markdown-content[data-v-ef377647] a{color:var(--md-primary);text-decoration:underline}.markdown-content[data-v-ef377647] img{max-width:100%}.markdown-content[data-v-ef377647] h1,.markdown-content[data-v-ef377647] h2,.markdown-content[data-v-ef377647] h3{margin:16px 0 8px}.tool-card[data-v-f13fbd25]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container);margin:8px 0;overflow:hidden}button.tool-card-head[data-v-f13fbd25]{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:none;border-radius:0;background:transparent;padding:10px 12px;cursor:pointer;font-size:13px}.tool-kind[data-v-f13fbd25]{flex-shrink:0;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--md-on-surface)}.tool-summary[data-v-f13fbd25]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font);font-size:13px;color:var(--md-on-surface)}.tool-stat[data-v-f13fbd25]{flex-shrink:0;font-size:12px;font-weight:600;color:var(--md-primary);border:1px solid var(--md-outline-variant);border-radius:999px;padding:1px 8px}.tool-state[data-v-f13fbd25]{flex-shrink:0;font-size:13px;color:var(--md-on-surface-variant)}.tool-chevron[data-v-f13fbd25]{flex-shrink:0;color:var(--md-on-surface-variant);font-size:12px;transition:transform .15s}.tool-card.expanded .tool-chevron[data-v-f13fbd25]{transform:rotate(90deg)}.tool-dot[data-v-f13fbd25]{font-size:9px}.tool-dot.running[data-v-f13fbd25],.tool-dot.pending[data-v-f13fbd25]{color:#b88412}.tool-dot.failed[data-v-f13fbd25]{color:var(--md-error,#c44)}.tool-dot.done[data-v-f13fbd25]{color:#3a6}.tool-dot.cancelled[data-v-f13fbd25]{color:var(--md-on-surface-variant)}.tool-card-body[data-v-f13fbd25]{padding:4px 12px 12px;border-top:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}.tool-section-label[data-v-f13fbd25]{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--md-on-surface-variant);margin-top:4px}.tool-card-body pre[data-v-f13fbd25]{margin:0;max-height:340px;overflow:auto;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);border-radius:8px;padding:8px 10px;font-family:var(--code-font);font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.tool-shot[data-v-f13fbd25]{margin:0;display:flex;flex-direction:column;gap:6px}.tool-shot img[data-v-f13fbd25]{width:100%;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest);display:block}.tool-shot figcaption[data-v-f13fbd25]{font-family:var(--code-font);font-size:11.5px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-section-text[data-v-f13fbd25]{margin:0;font-size:13px;overflow-wrap:anywhere}.tool-error[data-v-f13fbd25]{background:var(--md-error-container);padding:8px 12px;border-radius:8px;margin:0;font-size:12px;overflow-wrap:anywhere}.muted[data-v-f13fbd25]{font-size:12px;color:var(--md-on-surface-variant);margin:0}.tool-dialog-backdrop[data-v-f13fbd25]{position:fixed;inset:0;background:#0008;z-index:1050;display:grid;place-items:center;padding:20px}.tool-dialog[data-v-f13fbd25]{background:var(--md-surface);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:18px 20px;width:min(680px,100%);max-height:82vh;overflow:auto;display:flex;flex-direction:column;gap:12px}.tool-dialog header[data-v-f13fbd25]{display:flex;align-items:center;justify-content:space-between;gap:12px}.tool-dialog h4[data-v-f13fbd25]{margin:0;font-size:15px;overflow-wrap:anywhere;flex:1;min-width:0}#app .tool-dialog-close[data-v-f13fbd25],.tool-dialog-close[data-v-f13fbd25]{flex-shrink:0;width:40px;height:40px;min-height:0;padding:0;border:none;border-radius:50%;background:transparent;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}#app .tool-dialog-close[data-v-f13fbd25]:hover,.tool-dialog-close[data-v-f13fbd25]:hover{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent);box-shadow:none;filter:none;color:var(--md-on-surface)}#app .tool-dialog-close[data-v-f13fbd25]:active,.tool-dialog-close[data-v-f13fbd25]:active{background:color-mix(in srgb,var(--md-on-surface) 12%,transparent);border-radius:50%}.tool-search-results[data-v-f13fbd25]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}.tool-search-results a[data-v-f13fbd25]{color:var(--md-primary);font-size:14px;font-weight:500;text-decoration:none}.tool-search-results a[data-v-f13fbd25]:hover{text-decoration:underline}.tool-search-results p[data-v-f13fbd25]{margin:4px 0 0;font-size:13px;line-height:1.65;color:var(--md-on-surface)}.tool-search-results small[data-v-f13fbd25]{display:block;margin-top:2px;font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-card[data-v-f13fbd25]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent);background:var(--md-surface-container);transition:box-shadow .22s,background-color .2s}.tool-card[data-v-f13fbd25]:hover{box-shadow:var(--shadow-1)}button.tool-card-head[data-v-f13fbd25]{padding:12px 15px;gap:10px;min-height:46px;border-radius:0}button.tool-card-head[data-v-f13fbd25]:hover{background:var(--md-secondary-container)}.tool-kind[data-v-f13fbd25]{font-weight:700;letter-spacing:.06em}.tool-stat[data-v-f13fbd25]{border-color:color-mix(in srgb,var(--md-primary) 30%,transparent);background:color-mix(in srgb,var(--md-primary) 10%,transparent)}.tool-chevron[data-v-f13fbd25]{width:22px;height:22px;display:inline-grid;place-items:center;border-radius:50%;background:var(--md-surface-container-high);transition:transform .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}.tool-card-body[data-v-f13fbd25]{padding:8px 15px 15px;gap:8px;border-top-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-card-body pre[data-v-f13fbd25]{border-radius:14px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-section-label[data-v-f13fbd25]{font-weight:700}.diff-wrap[data-v-f13fbd25]{display:flex;flex-direction:column;gap:10px}.diff-file[data-v-f13fbd25]{border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);border-radius:14px;overflow:hidden;background:var(--md-surface-container-lowest)}.diff-file-head[data-v-f13fbd25]{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;background:var(--md-surface-container);font-size:11.5px;font-weight:650}.diff-file-path[data-v-f13fbd25]{font-family:var(--code-font);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.diff-file-stat[data-v-f13fbd25]{flex:none;font-family:var(--code-font);color:var(--md-on-surface-variant)}.diff-body[data-v-f13fbd25]{max-height:360px;overflow:auto;font-family:var(--code-font);font-size:12px;line-height:1.55;padding:4px 0}.diff-line[data-v-f13fbd25]{display:grid;grid-template-columns:40px 40px 18px 1fr;white-space:pre;min-width:max-content}.diff-no[data-v-f13fbd25]{text-align:right;padding:0 6px;color:var(--md-on-surface-variant);opacity:.6;user-select:none;font-variant-numeric:tabular-nums}.diff-sign[data-v-f13fbd25]{text-align:center;user-select:none;opacity:.9}.diff-text[data-v-f13fbd25]{padding-right:12px}.diff-line.add[data-v-f13fbd25]{background:color-mix(in srgb,#2ea043 20%,transparent);color:#116329}.diff-line.del[data-v-f13fbd25]{background:color-mix(in srgb,#cf222e 18%,transparent);color:#82071e}.diff-line.add .diff-sign[data-v-f13fbd25]{color:#116329;font-weight:700}.diff-line.del .diff-sign[data-v-f13fbd25]{color:#cf222e;font-weight:700}.diff-line.hunk[data-v-f13fbd25]{background:var(--md-surface-container);color:var(--md-on-surface-variant)}.diff-line.meta[data-v-f13fbd25]{color:var(--md-on-surface-variant);opacity:.75}@media (prefers-color-scheme: dark){.diff-line.add[data-v-f13fbd25],.diff-line.add .diff-sign[data-v-f13fbd25]{color:#7ee787}.diff-line.del[data-v-f13fbd25],.diff-line.del .diff-sign[data-v-f13fbd25]{color:#ffa198}}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color .14s,border-radius .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),color .14s}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.selected.highlighted{background:color-mix(in srgb,var(--md-primary-container) 88%,var(--md-primary) 12%)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-search{position:sticky;top:-8px;z-index:1;display:flex;align-items:center;gap:10px;margin:-8px -8px 8px;padding:13px 16px;background:var(--md-surface-container-low);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px 24px 0 0;color:var(--md-on-surface-variant)}.app-select-search input{flex:1;min-width:0;border:0;background:transparent;padding:0;font:inherit;color:var(--md-on-surface);outline:none}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity .18s var(--ease-emphasized,cubic-bezier(.2,0,0,1)),transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.select-menu-leave-active{transition:opacity .13s,transform .13s}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}.thinking-control{min-width:110px;flex:1;display:flex;flex-direction:column;gap:5px}.thinking-caption{font-size:12px}#app .thinking-trigger{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;padding:9px 12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);font-size:12px;border-radius:9px}.thinking-popover{position:fixed;z-index:10000;padding:16px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:0 10px 32px #16244026;color:var(--md-on-surface);font-family:var(--font-family)}.thinking-popover header{display:flex;justify-content:space-between;gap:12px;font-size:13px}.thinking-popover output{color:var(--md-primary);font-weight:600}.thinking-track{position:relative;padding:22px 4px 16px;display:flex;align-items:center}.thinking-track input{appearance:none;-webkit-appearance:none;width:100%;height:5px;padding:0;margin:0;border:0;border-radius:5px;background:linear-gradient(to right,var(--md-primary) var(--intensity),var(--md-outline-variant) var(--intensity));cursor:pointer;z-index:1}.thinking-track input::-webkit-slider-thumb{appearance:none;width:17px;height:17px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface);box-shadow:0 1px 4px #24345d40}.thinking-track input::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface)}.thinking-track input:focus-visible{outline:2px solid var(--md-primary);outline-offset:7px}.thinking-stops{display:flex;justify-content:space-between;gap:3px}.thinking-stops button{font:inherit;font-size:12px;border:0;background:transparent;color:var(--md-on-surface-variant);padding:6px 5px;border-radius:6px;cursor:pointer}.thinking-stops button.selected{background:var(--md-primary-container);color:var(--md-primary);font-weight:700}.thinking-popover p{font-size:12px;line-height:1.5;color:var(--md-on-surface-variant);margin:12px 0 0}.thinking-control.full .thinking-trigger,.thinking-popover.full{--md-primary:#a050db;border-color:#a050db88;box-shadow:0 0 16px #a050db25}.thinking-popover.full .energy-wave{position:absolute;inset:14px 0 8px;pointer-events:none;border-radius:20px;box-shadow:0 0 12px #a050db66}.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger{animation:thinking-boost .85s ease-out}.thinking-popover.pulse .energy-wave{animation:thinking-wave .85s ease-out}@keyframes thinking-boost{0%{box-shadow:0 0 #a050db66}45%{box-shadow:0 0 0 5px #a050db20,0 0 30px #a050db40}to{box-shadow:0 0 16px #a050db25}}@keyframes thinking-wave{0%{transform:scale(.95);opacity:1}to{transform:scale(1.15,2);opacity:0}}.thinking-menu-enter-active,.thinking-menu-leave-active{transition:opacity .13s,transform .13s}.thinking-menu-enter-from,.thinking-menu-leave-to{opacity:0;transform:translateY(4px)}@media (prefers-reduced-motion:reduce){.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger,.thinking-popover.pulse .energy-wave{animation:none}}.thinking-popover{padding:20px;border-radius:28px;background:var(--md-surface-container-low);border-color:transparent;box-shadow:0 8px 28px #24345d24}.thinking-popover header{align-items:center;font-size:14px;min-height:30px}.thinking-popover output{padding:6px 12px;border-radius:999px;background:var(--md-primary-container);font-size:12px}.thinking-track{height:68px;padding:0;margin:12px 0 0;isolation:isolate}.thinking-capsule{position:absolute;left:5px;right:5px;height:28px;border-radius:999px;background:var(--md-primary-container);overflow:hidden;pointer-events:none}.thinking-fill{height:100%;width:var(--intensity);background:var(--md-primary);border-radius:999px}.thinking-tick{position:absolute;top:50%;width:4px;height:4px;border-radius:50%;background:var(--md-primary);transform:translate(-50%,-50%)}.thinking-tick:first-of-type{left:8px!important}.thinking-tick:last-of-type{left:calc(100% - 8px)!important}.thinking-tick.passed{background:var(--md-on-primary)}.thinking-track input{position:relative;height:48px;background:transparent;border-radius:999px;touch-action:pan-y}.thinking-track input::-webkit-slider-runnable-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-webkit-slider-thumb{width:10px;height:44px;margin-top:-8px;border-radius:999px;border:0;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low);transition:width .14s,height .14s,margin-top .14s}.thinking-track input:active::-webkit-slider-thumb{width:6px;height:48px;margin-top:-10px}.thinking-track input::-moz-range-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-moz-range-thumb{width:10px;height:44px;border:0;border-radius:999px;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low)}.thinking-track input:active::-moz-range-thumb{width:6px;height:48px}.thinking-track input:focus-visible{outline-offset:3px}.thinking-stops{align-items:center;gap:2px;margin-top:2px}.thinking-stops button{border-radius:999px;min-height:30px;padding:6px 9px;transition:background-color .16s,color .16s}.thinking-popover.full{background:color-mix(in srgb,var(--md-surface-container-low) 93%,#a050db);border-color:#a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#7255c8,#ad50d6)}.thinking-popover.full .energy-wave{inset:18px 5px;border-radius:999px;z-index:-1}.thinking-popover p{margin-top:12px}.thinking-popover.full{box-shadow:0 8px 28px #24345d24,0 0 34px #a050db33;border-color:#a050db77}.thinking-popover.full .energy-wave{position:absolute;inset:-3px 4px;border-radius:999px;z-index:-1;background:radial-gradient(70% 120% at 100% 50%,#c56bffbb,transparent 68%),radial-gradient(50% 120% at 0% 50%,#6b8cffaa,transparent 70%);filter:blur(7px);animation:thunder-glow 1.7s ease-in-out infinite}@keyframes thunder-glow{0%,to{opacity:.5;transform:scale(1)}45%{opacity:1;transform:scale(1.03)}}.thinking-popover.full .thinking-capsule{box-shadow:0 0 0 1px #a050db66,0 0 26px #a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#6b8cff,#a050db,#e0a3ff,#a050db);background-size:280% 100%;animation:thunder-flow 2.6s linear infinite}@keyframes thunder-flow{to{background-position:280% 0}}.thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-control.full .thinking-trigger span:first-child{animation:thunder-flicker 2s steps(1,end) infinite}@keyframes thunder-flicker{0%,90%,to{opacity:1}92%{opacity:.35}94%{opacity:1}96%{opacity:.5}}#app .thinking-control .thinking-trigger{min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:13px;font-weight:500;align-items:center;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .thinking-control .thinking-trigger:hover{background:var(--md-surface-container-highest)}#app .thinking-control .thinking-trigger[aria-expanded=true]{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-caption{font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.workspace[data-v-07c85480]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}button[data-v-07c85480],input[data-v-07c85480],textarea[data-v-07c85480],select[data-v-07c85480]{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);padding:9px 12px}button[data-v-07c85480]{cursor:pointer;transition:background .15s,box-shadow .15s,filter .15s}button[data-v-07c85480]:disabled{opacity:.45;cursor:default}button[data-v-07c85480]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}input[data-v-07c85480]:focus,textarea[data-v-07c85480]:focus,select[data-v-07c85480]:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}input[type=checkbox][data-v-07c85480]{width:auto;accent-color:var(--md-primary)}.sessions[data-v-07c85480]{width:284px;flex-shrink:0;border-right:1px solid var(--md-outline-variant);padding:20px 16px;display:flex;flex-direction:column;gap:14px;background:var(--md-surface-container-low)}.sessions header[data-v-07c85480]{display:flex;align-items:center;justify-content:space-between;gap:12px}.sessions h1[data-v-07c85480]{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}.sessions header>button[data-v-07c85480]{height:34px;padding:0 13px;border:0;border-radius:9px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:600 13px/1 inherit}.sessions header>button[data-v-07c85480]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.08);box-shadow:var(--shadow-1)}.sessions>input[data-v-07c85480]{border-radius:10px;background:var(--md-surface-container-lowest)}.connection[data-v-07c85480]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}.connection button[data-v-07c85480]{margin-left:auto;padding:3px 9px;border-radius:8px;font-size:13px}.connection i[data-v-07c85480]{width:8px;height:8px;border-radius:50%;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}.connection i.online[data-v-07c85480]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.filter-bar[data-v-07c85480]{display:flex;gap:3px;padding:4px;border-radius:999px;background:var(--md-surface-container-high)}.filter-bar button[data-v-07c85480]{flex:1;font-size:12px;font-weight:500;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);box-shadow:none}.filter-bar button[data-v-07c85480]:hover:not(:disabled){background:transparent;color:var(--md-on-surface)}.filter-bar button.chosen[data-v-07c85480]{background:var(--md-surface-container-lowest);color:var(--md-primary);font-weight:650;box-shadow:var(--shadow-1)}.sessions label input[data-v-07c85480]{margin-right:6px}.session-list[data-v-07c85480]{overflow-y:auto;flex:1;min-height:0;margin:0 -4px;padding:0 4px}.session-card[data-v-07c85480]{display:flex;flex-direction:column;width:100%;text-align:left;gap:6px;margin-bottom:8px;padding:12px 13px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest)}.session-card[data-v-07c85480]:hover:not(:disabled){background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.session-card.selected[data-v-07c85480]{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}.session-card.selected[data-v-07c85480]:hover{background:var(--md-secondary-container)}.session-card strong[data-v-07c85480]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:600;font-size:14px}.origin[data-v-07c85480],small[data-v-07c85480],.sessions .muted[data-v-07c85480]{font-size:12px;color:var(--md-on-surface-variant)}.origin[data-v-07c85480]{font-weight:600;letter-spacing:.02em}.ledger-button[data-v-07c85480]{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:13px;font-weight:550}.ledger-button.chosen[data-v-07c85480]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.ledger[data-v-07c85480]{flex:1;overflow-y:auto;padding:var(--space-xl)}.ledger>header[data-v-07c85480]{margin-bottom:8px}.ledger>header h2[data-v-07c85480]{font-size:18px;font-weight:650}.ledger-entry[data-v-07c85480]{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:14px 16px;margin:10px 0;box-shadow:var(--shadow-1)}.ledger-entry>div[data-v-07c85480]{display:flex;align-items:center;gap:10px;font-size:12px}.ledger-entry>div>span[data-v-07c85480]:first-child{font-family:var(--code-font);background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-weight:600}.ledger-entry>div small[data-v-07c85480]{margin-left:auto}.ledger-entry>p[data-v-07c85480]{margin:8px 0;font-size:14px;line-height:1.6;overflow-wrap:anywhere}.ledger-entry details[data-v-07c85480]{margin-top:8px;border-radius:10px;background:var(--md-surface-container);padding:8px 12px;font-size:12px}.ledger-entry summary[data-v-07c85480]{cursor:pointer;color:var(--md-on-surface-variant)}.ledger-entry pre[data-v-07c85480]{margin:8px 0 0;max-height:300px}.conversation[data-v-07c85480]{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}.conversation-header[data-v-07c85480]{display:flex;align-items:flex-start;gap:14px}.conversation-header>div[data-v-07c85480]:first-child{flex:1;min-width:0}.conversation-header h2[data-v-07c85480]{font-size:17px;font-weight:650;margin:0}.conversation-header p[data-v-07c85480]{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:13px}.session-actions[data-v-07c85480]{display:flex;gap:8px;flex-shrink:0}.session-actions button[data-v-07c85480]{height:32px;padding:0 13px;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.running[data-v-07c85480]{color:#b88412;font-weight:650;font-size:12px}.failed[data-v-07c85480]{color:var(--md-error)}.done[data-v-07c85480]{color:var(--md-success);font-weight:600;font-size:12px}.cancelled[data-v-07c85480],.muted[data-v-07c85480]{color:var(--md-on-surface-variant)}.muted[data-v-07c85480]{font-size:12px;line-height:1.6}.error[data-v-07c85480]{background:var(--md-error-container);color:#410e0b;padding:11px 16px;border-radius:12px;margin:8px 0;font-size:13px;overflow-wrap:anywhere}.transcript[data-v-07c85480]{flex:1;overflow-y:auto;padding:26px 28px;min-height:0}.context-summary[data-v-07c85480]{max-width:920px;margin:0 auto 22px;padding:14px 18px;border:1px dashed var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-low)}.context-summary-head[data-v-07c85480]{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.context-summary-head strong[data-v-07c85480]{font-size:12px;font-weight:700;letter-spacing:.02em;color:var(--md-primary)}.context-summary-head time[data-v-07c85480]{font-size:12px;opacity:.75}.welcome[data-v-07c85480]{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}.welcome[data-v-07c85480]:before{content:\"\";display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center}.welcome h2[data-v-07c85480]{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}.welcome p[data-v-07c85480]{margin:6px 0;font-size:14px}.turn[data-v-07c85480]{max-width:920px;margin:0 auto 30px;display:flex;flex-direction:column;gap:10px}.bubble[data-v-07c85480]{padding:15px 19px;font-size:14px}.bubble.user[data-v-07c85480]{align-self:flex-end;max-width:82%;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:16px 16px 4px}.bubble.agent[data-v-07c85480]{align-self:flex-start;max-width:100%;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:16px 16px 16px 4px;box-shadow:var(--shadow-1)}.bubble .message-head[data-v-07c85480]{display:flex;align-items:center;gap:14px;margin-bottom:10px;font-size:12px}.bubble .message-head b[data-v-07c85480]{font-weight:700}.bubble .message-head time[data-v-07c85480]{margin-left:auto;opacity:.75;font-size:12px}.bubble .message-head span[data-v-07c85480]{margin-left:auto}.bubble.user .message-head[data-v-07c85480]{margin-bottom:7px;opacity:.85}.message-text[data-v-07c85480]{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}.bubble.agent[data-v-07c85480] p{margin:.4em 0}.bubble.agent[data-v-07c85480] pre{max-height:420px}.agent-speech[data-v-07c85480]{margin:6px 0;padding:2px 0;line-height:1.7}.model-annotation[data-v-07c85480]{display:block;font-size:12px;opacity:.7;margin-bottom:4px;font-family:var(--code-font)}.think-chain[data-v-07c85480]{margin:2px 0 8px;border:0;border-radius:10px;background:var(--md-surface-container-low);overflow:hidden}.think-chain>summary[data-v-07c85480]{display:inline-flex;align-items:center;gap:5px;cursor:pointer;list-style:none;padding:3px 10px;font-size:11px;font-weight:600;letter-spacing:.03em;color:var(--md-on-surface-variant);user-select:none;border-radius:999px;background:var(--md-surface-container)}.think-chain>summary[data-v-07c85480]::-webkit-details-marker{display:none}.think-chain>summary[data-v-07c85480]:before{content:\"▸\";display:inline-block;transition:transform .15s}.think-chain[open]>summary[data-v-07c85480]:before{transform:rotate(90deg)}.think-chain>pre[data-v-07c85480]{margin:0;padding:6px 10px 8px;max-height:180px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--code-font);font-size:11.5px;line-height:1.55;color:var(--md-on-surface-variant)}.agent-speech[data-v-07c85480] p{margin:.45em 0}.agent-speech[data-v-07c85480] pre{background:var(--md-surface-container);border:1px solid var(--md-outline-variant);border-radius:10px;padding:12px 14px;max-height:460px;overflow:auto;font-size:13px}.agent-speech[data-v-07c85480] code{font-family:var(--code-font)}.agent-speech[data-v-07c85480] ul{padding-left:20px;margin:.4em 0}.steps[data-v-07c85480]{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}.steps details[data-v-07c85480]{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}.steps summary[data-v-07c85480]{cursor:pointer;font-size:13px;font-weight:550}.steps summary small[data-v-07c85480]{margin-left:10px;font-weight:600}.steps summary[data-v-07c85480]::marker{color:var(--md-on-surface-variant)}.steps details pre[data-v-07c85480]{margin:10px 0 0;font-family:var(--code-font);font-size:13px;white-space:pre-wrap;max-height:400px}pre[data-v-07c85480]{max-height:450px;overflow:auto;font-family:var(--code-font)}.subagent-card[data-v-07c85480]{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}button.subagent-card-head[data-v-07c85480]{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;border-radius:0;background:transparent;padding:11px 14px;font-size:13px}button.subagent-card-head[data-v-07c85480]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}button.subagent-card-head>span[data-v-07c85480]:first-child{color:var(--md-primary)}button.subagent-card-head>strong[data-v-07c85480]{font-weight:700}.subagent-prompt[data-v-07c85480]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--md-on-surface)}.subagent-card small[data-v-07c85480]{font-weight:600}.subagent-chevron[data-v-07c85480]{color:var(--md-on-surface-variant);font-size:12px}.subagent-card-error[data-v-07c85480]{margin:0 10px 10px;padding:8px 12px;font-size:12px}.subagent-card.nested[data-v-07c85480]{margin:6px 0;box-shadow:none}.sub-view[data-v-07c85480]{max-width:900px;margin:0 auto}.sub-view-header[data-v-07c85480]{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}.sub-view-header button[data-v-07c85480]{flex-shrink:0;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.sub-view-header h3[data-v-07c85480]{margin:0 0 4px;font-size:16px;font-weight:650}.sub-view-header p[data-v-07c85480]{margin:0;max-width:520px}.sub-view-header>span[data-v-07c85480]{margin-left:auto;font-weight:650;font-size:12px}.sub-view-body[data-v-07c85480]{min-height:120px}.todo-panel[data-v-07c85480]{padding:12px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);background:var(--md-surface-container-low);max-height:170px;overflow:auto;animation:panel-in-07c85480 .22s cubic-bezier(.2,0,0,1) both}.todo-panel>header[data-v-07c85480]{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant);text-transform:uppercase}.todo-panel>header span[data-v-07c85480]{font-weight:700;color:var(--md-primary)}.todo-panel ul[data-v-07c85480]{list-style:none;margin:9px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}.todo-panel li[data-v-07c85480]{display:flex;align-items:flex-start;gap:9px;font-size:13px;line-height:1.5;color:var(--md-on-surface);animation:panel-in-07c85480 .22s ease both;transition:opacity .2s,color .2s}.todo-panel li.completed[data-v-07c85480]{opacity:.6}.todo-panel li.completed .todo-text[data-v-07c85480]{text-decoration:line-through}.todo-panel li.in_progress .todo-text[data-v-07c85480]{font-weight:650}.todo-mark[data-v-07c85480]{flex:none;width:16px;text-align:center;color:var(--md-primary);transition:color .2s,transform .2s}.todo-panel li.completed .todo-mark[data-v-07c85480]{color:var(--md-success,#3ba55c)}.composer .todo-panel[data-v-07c85480]{border-radius:28px 28px 0 0}.ctx-usage[data-v-07c85480]{position:relative;display:inline-flex;align-items:center;gap:6px;flex:none;outline:none;order:99;margin-left:6px;cursor:default}.ctx-ring[data-v-07c85480]{width:20px;height:20px;flex:none}.ctx-track[data-v-07c85480]{fill:none;stroke:var(--md-primary);stroke-width:2.2;opacity:.85}.ctx-value[data-v-07c85480]{font-size:11px;color:var(--md-on-surface-variant);font-variant-numeric:tabular-nums}.ctx-tip[data-v-07c85480]{position:absolute;bottom:calc(100% + 12px);right:0;left:auto;transform:translateY(4px);z-index:60;width:max-content;min-width:216px;max-width:280px;padding:12px 14px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:var(--shadow-3);color:var(--md-on-surface);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .16s,transform .16s,visibility .16s;font-size:12px;text-align:left}.ctx-usage:hover .ctx-tip[data-v-07c85480],.ctx-usage:focus-visible .ctx-tip[data-v-07c85480],.ctx-usage:focus-within .ctx-tip[data-v-07c85480]{opacity:1;visibility:visible;transform:translateY(0)}.ctx-tip strong[data-v-07c85480]{display:block;font-size:12px;font-weight:750;margin-bottom:8px}.ctx-used[data-v-07c85480]{display:flex;align-items:baseline;gap:6px}.ctx-used b[data-v-07c85480]{font-size:22px;font-weight:800;color:var(--md-primary);line-height:1}.ctx-used span[data-v-07c85480]{color:var(--md-on-surface-variant)}.ctx-sub[data-v-07c85480]{color:var(--md-on-surface-variant);margin:4px 0 8px}.ctx-row[data-v-07c85480]{display:flex;justify-content:space-between;gap:16px;padding:4px 0;border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.ctx-row span[data-v-07c85480]:last-child{font-weight:650;color:var(--md-primary)}.composer[data-v-07c85480]{flex-shrink:0;margin:0 20px 18px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-lowest);overflow:visible;box-shadow:var(--shadow-1)}.composer-input[data-v-07c85480]{position:relative}.composer-input textarea[data-v-07c85480]{font-size:14px;width:100%;display:block;min-height:96px;padding:15px 112px 15px 16px;line-height:1.6;resize:vertical;border:0;border-radius:0;background:transparent}.composer-input textarea[data-v-07c85480]:focus{box-shadow:none;border:0}.slash-menu[data-v-07c85480]{position:fixed;z-index:10000;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:14px;box-shadow:var(--shadow-3);padding:6px;max-height:min(320px,42vh);overflow:auto}.slash-item[data-v-07c85480]{display:flex;align-items:baseline;gap:10px;width:100%;text-align:left;padding:8px 10px;border:0;border-radius:10px;background:transparent;color:var(--md-on-surface);cursor:pointer}.slash-item.active[data-v-07c85480]{background:var(--md-secondary-container)}.slash-name[data-v-07c85480]{flex:none;font-family:var(--code-font);font-weight:650;font-size:13px;color:var(--md-primary)}.slash-desc[data-v-07c85480]{font-size:12px;color:var(--md-on-surface-variant);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.attach-chips[data-v-07c85480]{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 16px 0}.composer-actions[data-v-07c85480]{position:absolute;right:10px;bottom:10px;z-index:2;display:flex;align-items:center;gap:8px}.attach-fly[data-v-07c85480]{width:42px;height:42px;flex:none;aspect-ratio:1/1;display:grid;place-items:center;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.attach-fly svg[data-v-07c85480]{width:18px;height:18px}.attach-fly[data-v-07c85480]:hover:not(:disabled){filter:brightness(1.05)}.attach-fly[data-v-07c85480]:disabled{opacity:.5;cursor:default}.attach-chip[data-v-07c85480]{display:inline-flex;align-items:center;gap:6px;max-width:220px;font-size:12px;padding:4px 6px 4px 10px;border-radius:999px;background:var(--md-surface-container);border:1px solid var(--md-outline-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.attach-chip button[data-v-07c85480]{border:0;background:transparent;cursor:pointer;font-size:14px;line-height:1;padding:0 4px;color:var(--md-on-surface-variant)}.attach-chip button[data-v-07c85480]:hover{color:var(--md-error)}.attach-error[data-v-07c85480]{font-size:12px;color:var(--md-error)}.send-fly[data-v-07c85480]{width:42px;height:42px;flex:none;aspect-ratio:1/1;display:grid;place-items:center;border:0;border-radius:50%;padding:0;margin:0;background:var(--md-primary);color:var(--md-on-primary,#fff);box-shadow:0 2px 10px color-mix(in srgb,var(--md-primary) 38%,transparent)}.send-fly svg[data-v-07c85480]{width:20px;height:20px}.send-fly[data-v-07c85480]:hover:not(:disabled){filter:brightness(1.08)}.send-fly[data-v-07c85480]:disabled{background:var(--md-surface-container);color:var(--md-on-surface-variant);opacity:.7;box-shadow:none}.send-fly.stop[data-v-07c85480]{background:var(--md-error);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--md-error) 40%,transparent)}.compact-notice[data-v-07c85480]{font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}.options-collapse[data-v-07c85480]{max-height:0;overflow:hidden;transition:max-height .3s cubic-bezier(.2,0,0,1)}.options-collapse.open[data-v-07c85480]{max-height:360px}.options-toggle[data-v-07c85480]{display:inline-flex;align-items:center;gap:6px;transition:background-color .18s,color .18s}.options-toggle.open[data-v-07c85480]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.execution-options[data-v-07c85480]{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}.execution-options label[data-v-07c85480]{display:flex;flex-direction:column;gap:5px;font-size:12px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}.execution-options[data-v-07c85480] .app-select-trigger,.execution-options .workspace-select[data-v-07c85480]{width:100%;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}.workspace-select[data-v-07c85480]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}.composer footer[data-v-07c85480]{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap;border-top:1px solid var(--md-outline-variant)}.composer footer>select[data-v-07c85480],.composer footer>.app-select[data-v-07c85480]{font-size:13px;border-radius:10px;min-height:34px}.composer footer .muted[data-v-07c85480]{flex:1;min-width:120px}.composer footer>button[data-v-07c85480]{font-size:13px;font-weight:600;border-radius:9px;min-height:34px}.host-panel>strong[data-v-07c85480]{font-size:14px}.host-panel dl[data-v-07c85480]{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px}.host-panel dt[data-v-07c85480]{color:var(--md-on-surface-variant);font-weight:600}.host-panel dd[data-v-07c85480]{margin:4px 0 0;overflow-wrap:anywhere}.usage-rings[data-v-07c85480]{display:flex;align-items:center;gap:24px;padding:14px 0;flex-wrap:wrap}.usage-metric[data-v-07c85480]{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}.usage-ring[data-v-07c85480]{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}.usage-ring b[data-v-07c85480]{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:15px;font-weight:650;box-shadow:var(--shadow-1)}.new-folder[data-v-07c85480]{display:flex;gap:8px}.new-folder input[data-v-07c85480]{flex:1;min-width:0}.directory-backdrop[data-v-07c85480]{position:fixed;inset:0;background:#14111acc;z-index:1000;display:grid;place-items:center;padding:20px}.directory-dialog[data-v-07c85480]{background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:20px;padding:22px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh;box-shadow:var(--shadow-4)}.directory-dialog>header[data-v-07c85480]{gap:12px}.directory-dialog>header h2[data-v-07c85480]{font-size:16px;font-weight:650}.directory-list[data-v-07c85480]{overflow:auto;min-height:180px;display:flex;flex-direction:column;gap:6px}.directory-list button[data-v-07c85480]{text-align:left;border-radius:10px;background:var(--md-surface-container-low);font-size:13px}.directory-roots[data-v-07c85480]{display:flex;gap:8px;flex-wrap:wrap}.directory-roots button[data-v-07c85480]{border-radius:999px;font-size:12px;padding:6px 12px}.directory-dialog code[data-v-07c85480]{overflow-wrap:anywhere;font-size:12px;background:var(--md-surface-container);padding:8px 10px;border-radius:8px}.directory-dialog>footer[data-v-07c85480]{display:flex;justify-content:flex-end}.directory-dialog>footer button[data-v-07c85480]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;font-weight:600}.permission-request[data-v-07c85480]{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}.permission-request small[data-v-07c85480]{display:block;margin:8px 0}.permission-request pre[data-v-07c85480]{max-height:160px;overflow:auto}.permission-request>div[data-v-07c85480]{display:flex;justify-content:flex-end;gap:8px}#app .workspace[data-v-07c85480]{gap:12px;padding-left:6px;background:var(--md-surface-container)}#app .workspace .sessions[data-v-07c85480]{width:296px;gap:14px;padding:18px 14px;border:0;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .workspace .sessions h1[data-v-07c85480]{font-size:24px;font-weight:800;letter-spacing:-.02em}#app .workspace .sessions header>button[data-v-07c85480]{height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 13px/1 inherit;display:inline-flex;align-items:center;gap:7px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .workspace .sessions header>button[data-v-07c85480]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.06);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .sessions>input[data-v-07c85480]{min-height:48px;padding:0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:14px}#app .workspace .sessions>input[data-v-07c85480]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .workspace .filter-bar[data-v-07c85480]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .workspace .filter-bar button[data-v-07c85480]{border-radius:999px;padding:8px 4px;font-weight:600}#app .workspace .filter-bar button.chosen[data-v-07c85480]{background:var(--md-primary);color:var(--md-on-primary,#fff);font-weight:700;box-shadow:var(--shadow-1)}#app .workspace .filter-bar button.chosen[data-v-07c85480]:hover:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff)}#app .workspace .session-list[data-v-07c85480]{margin:0 -2px;padding:0 2px}#app .workspace .session-card[data-v-07c85480]{gap:5px;margin-bottom:8px;padding:13px 15px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:18px;background:var(--md-surface-container-lowest);transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .2s,border-color .2s,box-shadow .22s,border-radius .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .workspace .session-card[data-v-07c85480]:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-1);border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant))}#app .workspace .session-card.selected[data-v-07c85480]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent;border-radius:20px 20px 20px 7px;box-shadow:var(--shadow-1)}#app .workspace .session-card .origin[data-v-07c85480]{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:12px;color:var(--md-primary)}#app .workspace .session-card.selected .origin[data-v-07c85480]{color:var(--md-on-secondary-container);opacity:.75}#app .workspace .ledger-button[data-v-07c85480]{min-height:44px;border-radius:16px;font-weight:650;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .ledger-button.chosen[data-v-07c85480]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent}#app .workspace .ledger-entry[data-v-07c85480]{border-radius:20px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-lowest);box-shadow:var(--shadow-1)}#app .workspace .conversation[data-v-07c85480]{background:var(--md-surface);border-radius:30px;overflow:hidden;box-shadow:var(--shadow-1)}#app .workspace .conversation-header[data-v-07c85480]{padding:20px 26px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .conversation-header h2[data-v-07c85480]{font-size:20px;font-weight:750;letter-spacing:-.01em}#app .workspace .session-actions button[data-v-07c85480]{height:36px;padding:0 15px;border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .session-actions button[data-v-07c85480]:hover:not(:disabled){background:var(--md-surface-container-highest);box-shadow:none}#app .workspace .running[data-v-07c85480]{color:#b88412;background:color-mix(in srgb,#B88412 14%,transparent);padding:4px 11px;border-radius:999px;font-weight:700}#app .workspace .transcript[data-v-07c85480]{padding:28px 30px}#app .workspace .welcome[data-v-07c85480]{margin:64px auto 0}#app .workspace .welcome[data-v-07c85480]:before{width:76px;height:76px;border-radius:26px 26px 26px 10px;background-color:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24' fill='none' stroke='%235944c6' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-size:34px 34px}#app .workspace .welcome h2[data-v-07c85480]{font-size:26px;font-weight:800;letter-spacing:-.02em}#app .workspace .turn[data-v-07c85480]{gap:12px;margin-bottom:32px}#app .workspace .bubble[data-v-07c85480]{padding:16px 20px;font-size:15px;line-height:1.7}#app .workspace .bubble.user[data-v-07c85480]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px;box-shadow:var(--shadow-1);max-width:82%}#app .workspace .bubble.agent[data-v-07c85480]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:8px 24px 24px;box-shadow:var(--shadow-1);max-width:100%}#app .workspace .bubble .message-head b[data-v-07c85480]{font-weight:750}#app .workspace .steps[data-v-07c85480]{gap:9px;margin:14px 0}#app .workspace .steps details[data-v-07c85480]{border-radius:16px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);padding:11px 15px}#app .workspace .subagent-card[data-v-07c85480]{border-radius:18px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);box-shadow:var(--shadow-1)}#app .workspace button.subagent-card-head[data-v-07c85480]{padding:12px 15px}#app .workspace button.subagent-card-head[data-v-07c85480]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .sub-view-header[data-v-07c85480]{padding-bottom:16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .sub-view-header button[data-v-07c85480]{border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .agent-speech[data-v-07c85480] pre{border-radius:16px;background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}#app .workspace .composer[data-v-07c85480]{position:relative;z-index:5;margin:0 22px 20px;border-radius:28px;overflow:visible;background:var(--md-surface-container-lowest);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);box-shadow:var(--shadow-2)}#app .workspace .composer[data-v-07c85480]:focus-within{border-color:color-mix(in srgb,var(--md-primary) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent),var(--shadow-2)}#app .workspace .execution-options[data-v-07c85480]{padding:12px 16px;gap:10px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .execution-options label[data-v-07c85480]{font-weight:700;letter-spacing:.05em}#app .workspace .execution-options .workspace-select[data-v-07c85480]{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .execution-options[data-v-07c85480] .app-select-trigger,#app .workspace .composer footer[data-v-07c85480] .app-select-trigger{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .composer-input textarea[data-v-07c85480]{border-radius:0;background:transparent}#app .workspace .send-fly[data-v-07c85480]{width:46px!important;height:46px!important;border-radius:50%!important;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .composer footer[data-v-07c85480]{border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);padding:12px 16px}#app .workspace .composer footer>button[data-v-07c85480]{border-radius:999px;min-height:36px;padding-inline:15px;background:var(--md-surface-container-high);border-color:transparent}#app .workspace .host-panel[data-v-07c85480]{margin:0 22px 10px;border-radius:24px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .workspace .usage-ring b[data-v-07c85480]{background:var(--md-surface-container-lowest)}#app .workspace .directory-dialog[data-v-07c85480]{border-radius:32px;border-color:transparent;box-shadow:var(--shadow-4);background:var(--md-surface-container-low)}#app .workspace .directory-list button[data-v-07c85480]{background:var(--md-surface-container-lowest);border-color:transparent;border-radius:16px;min-height:46px}#app .workspace .directory-list button[data-v-07c85480]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .directory-roots button[data-v-07c85480]{background:var(--md-surface-container-high);border-color:transparent}@keyframes turn-in-07c85480{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes panel-in-07c85480{0%{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes caret-blink-07c85480{0%,to{opacity:1}50%{opacity:.2}}@keyframes soft-pulse-07c85480{0%,to{opacity:1}50%{opacity:.5}}.turn[data-v-07c85480]{animation:turn-in-07c85480 .28s cubic-bezier(.2,0,0,1) both}#app .workspace .agent-speech .running[data-v-07c85480]{animation:caret-blink-07c85480 1s steps(1,end) infinite;color:var(--md-primary)}#app .workspace .conversation-header .running[data-v-07c85480]{animation:soft-pulse-07c85480 1.6s ease-in-out infinite}@media (prefers-reduced-motion: reduce){[data-v-07c85480],[data-v-07c85480] *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}@media (max-width:800px){.sessions[data-v-07c85480]{width:214px;padding:12px 10px}.transcript[data-v-07c85480]{padding:14px}.composer[data-v-07c85480]{margin:0 12px 12px}.composer footer .muted[data-v-07c85480]{display:none}.conversation-header[data-v-07c85480]{padding:14px 16px}.welcome[data-v-07c85480]{margin:30px auto 0}.turn[data-v-07c85480]{margin-bottom:22px}}@media (max-width:560px){.workspace[data-v-07c85480]{flex-direction:column}.sessions[data-v-07c85480]{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input[data-v-07c85480],.filter-bar[data-v-07c85480],.connection[data-v-07c85480]{display:none}.session-list[data-v-07c85480]{display:flex;gap:6px;overflow-x:auto}.session-card[data-v-07c85480]{min-width:160px;width:160px;margin-bottom:0}.ledger-button[data-v-07c85480]{padding:5px;font-size:12px}}\n";document.head.appendChild(s)}})();
